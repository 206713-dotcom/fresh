#!/usr/bin/env python3
"""Deterministic gatekeeper for the 6,000-question Cambridge IGCSE Business MCQ bank.

Read-only: parses the six mcq-bank-section*.ts files, validates every MCQItem
against the locked 0264 whitelist/blacklist and the exact TypeScript schema,
and emits a JSON report. No bank file is modified by this script.

Usage:
  python scripts/gatekeeper.py --out data-staging/audit/gatekeeper.json
  python scripts/gatekeeper.py --wave 3 --out data-staging/audit/wave3.json
"""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "src" / "lib" / "data"

# Locked canonical values from the 0264 syllabus whitelist.
REQUIRED_UNITS = {
    1: "Unit 1: Understanding business activity",
    2: "Unit 2: People in business",
    3: "Unit 3: Marketing",
    4: "Unit 4: Operations management",
    5: "Unit 5: Financial information and decisions",
    6: "Unit 6: External influences on business activity",
}

REQUIRED_CHAPTERS = {
    1: {
        "1.1 Business activity",
        "1.2 Economic sectors",
        "1.3 Enterprise, business growth and size",
        "1.4 Types of business organisation",
        "1.5 Business objectives and stakeholder objectives",
    },
    2: {
        "2.1 Motivating employees",
        "2.2 Organisation and management",
        "2.3 Recruitment, selection and training",
        "2.4 Internal and external communication",
    },
    3: {
        "3.1 Marketing, competition and the customer",
        "3.2 Market research",
        "3.3 Marketing mix",
        "3.4 Marketing strategy",
    },
    4: {
        "4.1 Production of goods and services",
        "4.2 Technology and production of goods and services",
        "4.3 Sustainable production of goods and services",
        "4.4 Costs, scale of production and break-even analysis",
        "4.5 Quality of goods and services",
        "4.6 Location decisions",
    },
    5: {
        "5.1 Business finance",
        "5.2 Cash flow forecast",
        "5.3 Profit and loss",
        "5.4 Statement of financial position",
        "5.5 Analysis of accounts",
    },
    6: {
        "6.1 Economic issues",
        "6.2 Environmental and ethical issues",
        "6.3 Business and the international economy",
    },
}

# Full locked blacklist. Short acronyms use word boundaries so ordinary words
# such as "arrangement" or "current" are not false positives.
BLACKLIST_TERMS = [
    "boston matrix", "cash cow", "cash dog", "star product", "problem child",
    "question mark", "stratified sampling", "systematic sampling", "cluster sampling",
    "convenience sampling", "snowball sampling", "push strategy", "pull strategy",
    "ansoff", "porter", "7 ps", "physical evidence", "ped formula",
    "mcgregor", "theory x", "theory y", "vroom", "expectancy theory", "mayo",
    "hawthorne", "adams equity", "mcclelland", "mintzberg", "belbin", "tuckman",
    "paternalistic", "hard hrm", "soft hrm", "zero-hours contract",
    "swot", "pestle", "pest analysis", "core competencies", "critical path",
    "cpa", "network diagram", "decision tree", "expected monetary value", "emv",
    "economic order quantity", "eoq", "buffer inventory", "gearing", "gearing ratio",
    "inventory turnover", "receivables days", "payables days", "net present value",
    "npv", "internal rate of return", "irr", "payback period", "arr",
    "conglomerate", "0450", "examiner guidance", "mark schemes penalise",
]

FORBIDDEN_STUBS = {"correct selection.", "correct.", ""}

EXPECTED_ITEM_KEYS = {
    "id", "section", "unit", "chapter", "questionNumber", "question", "options",
    "correctOption", "correctAnswer", "questionType", "explanation",
}


def boundary_pattern(term: str) -> re.Pattern[str]:
    left = r"(?<![a-z0-9])"
    right = r"(?![a-z0-9])"
    return re.compile(left + re.escape(term) + right)


BLACKLIST_PATTERNS = [(term, boundary_pattern(term)) for term in BLACKLIST_TERMS]


def load_bank(section: int) -> list[dict[str, Any]]:
    text = (DATA_DIR / f"mcq-bank-section{section}.ts").read_text(encoding="utf-8")
    match = re.search(r"export const MCQ_BANK_\d+\s*:\s*MCQItem\[\]\s*=\s*(\[.*\]);?\s*$", text, re.S)
    if not match:
        raise RuntimeError(f"section {section}: bank array not found")
    return json.loads(match.group(1))


def load_all() -> dict[int, list[dict[str, Any]]]:
    return {s: load_bank(s) for s in range(1, 7)}


def validate_item(item: dict[str, Any], section: int, seen_ids: set[str],
                  seen_stems: dict[str, str]) -> list[str]:
    errors: list[str] = []
    qid = str(item.get("id", "UNKNOWN"))

    if not isinstance(item, dict) or set(item.keys()) != EXPECTED_ITEM_KEYS:
        errors.append(f"{qid}: MCQItem keys must be exactly {sorted(EXPECTED_ITEM_KEYS)}")

    qnum = str(item.get("questionNumber", ""))
    if qid in seen_ids:
        errors.append(f"{qid}: duplicate id")
    seen_ids.add(qid)
    if qid != qnum:
        errors.append(f"{qid}: questionNumber '{qnum}' does not match id")
    if str(item.get("section")) != str(section):
        errors.append(f"{qid}: expected section '{section}', got '{item.get('section')}'")
    if item.get("unit") != REQUIRED_UNITS[section]:
        errors.append(f"{qid}: invalid unit '{item.get('unit')}'")
    if item.get("chapter") not in REQUIRED_CHAPTERS[section]:
        errors.append(f"{qid}: invalid chapter '{item.get('chapter')}'")
    if item.get("questionType") != "MCQ":
        errors.append(f"{qid}: questionType must be 'MCQ'")

    expected_id = f"P1_U{section}_MCQ_{qnum.rsplit('_', 1)[-1]}"
    if qid != expected_id or not re.fullmatch(r"P1_U[1-6]_MCQ_\d{3,4}", qid):
        errors.append(f"{qid}: id must follow P1_U<section>_MCQ_<001..1000>")

    qtext = str(item.get("question", "")).strip()
    norm_stem = re.sub(r"\s+", " ", qtext.lower())
    if len(qtext) < 10:
        errors.append(f"{qid}: question stem too short")
    if norm_stem in seen_stems:
        errors.append(f"{qid}: duplicate question stem (first seen {seen_stems[norm_stem]})")
    else:
        seen_stems[norm_stem] = qid

    blob = json.dumps(item, ensure_ascii=False).lower()
    for term, pattern in BLACKLIST_PATTERNS:
        if pattern.search(blob):
            errors.append(f"{qid}: FORBIDDEN / OUT-OF-SYLLABUS TERM -> '{term}'")

    options = item.get("options")
    if not isinstance(options, dict) or set(options) != {"A", "B", "C", "D"}:
        errors.append(f"{qid}: options must have exact keys A, B, C, D")
    else:
        if len({str(value).strip() for value in options.values()}) != 4:
            errors.append(f"{qid}: duplicate option text detected")
        for key, value in options.items():
            if not isinstance(value, str) or not value.strip():
                errors.append(f"{qid}: option {key} must be a non-empty string")

    corr_opt = item.get("correctOption")
    if corr_opt not in {"A", "B", "C", "D"}:
        errors.append(f"{qid}: invalid correctOption '{corr_opt}'")
    elif isinstance(options, dict) and options.get(corr_opt) != item.get("correctAnswer"):
        errors.append(f"{qid}: correctAnswer does not match options['{corr_opt}']")

    explanation = item.get("explanation")
    if not isinstance(explanation, dict) or set(explanation) != {"correct_reason", "distractor_reasons"}:
        errors.append(f"{qid}: explanation must have exact keys correct_reason and distractor_reasons")
        return errors
    correct_reason = str(explanation.get("correct_reason", "")).strip()
    if len(correct_reason) < 20:
        errors.append(f"{qid}: missing or too-short correct_reason")

    distractors = explanation.get("distractor_reasons")
    if not isinstance(distractors, dict) or set(distractors) != {"A", "B", "C", "D"}:
        errors.append(f"{qid}: distractor_reasons must contain exactly A, B, C, D")
    else:
        for key in ("A", "B", "C", "D"):
            reason = str(distractors.get(key, "")).strip()
            if key == corr_opt:
                if reason.lower() in FORBIDDEN_STUBS:
                    errors.append(f"{qid}: distractor_reasons['{key}'] is a stub, not the full correct_reason")
                elif reason != correct_reason:
                    errors.append(f"{qid}: distractor_reasons['{key}'] must equal correct_reason verbatim")
            elif len(reason) < 20:
                errors.append(f"{qid}: distractor_reasons['{key}'] missing explanation of why {key} is wrong")

    return errors


def validate_wave(banks: dict[int, list[dict[str, Any]]], wave: int | None) -> dict[str, Any]:
    """Wave n covers indices (n-1)*500 .. n*500-1 across the flattened bank."""
    flat = [(s, item) for s in range(1, 7) for item in banks[s]]
    if wave is None:
        selected = flat
    else:
        if not 1 <= wave <= 12:
            raise ValueError("wave must be 1..12")
        selected = flat[(wave - 1) * 500: wave * 500]

    seen_ids: set[str] = set()
    seen_stems: dict[str, str] = {}
    errors: list[str] = []
    counts_by_section: Counter[int] = Counter()
    for section, item in selected:
        counts_by_section[section] += 1
        errors.extend(validate_item(item, section, seen_ids, seen_stems))

    return {
        "wave": wave,
        "item_count": len(selected),
        "sections": dict(sorted(counts_by_section.items())),
        "error_count": len(errors),
        "errors": errors,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--wave", type=int, choices=range(1, 13))
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()

    report = validate_wave(load_all(), args.wave)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps({k: v for k, v in report.items() if k != "errors"}, indent=2))
    for error in report["errors"][:25]:
        print("  " + error)
    if report["error_count"] > 25:
        print(f"  ... and {report['error_count'] - 25} more (see {args.out})")


if __name__ == "__main__":
    main()

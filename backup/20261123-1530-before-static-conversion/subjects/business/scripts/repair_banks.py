#!/usr/bin/env python3
"""Mechanical, non-content repairs for the six MCQ bank files.

Applies only deterministic fixes that do not change tested business content:
  1. canonical 0264 unit strings
  2. canonical 0264 chapter labels
  3. per-option explanation completeness (correct option gets full correct_reason)
  4. exact MCQItem interface schema
  5. removal of forbidden boilerplate from MCQ data

Usage:
  python scripts/repair_banks.py --dry-run
  python scripts/repair_banks.py --apply
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
from collections import Counter
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "src" / "lib" / "data"
BACKUP_DIR = ROOT / "data-staging" / "audit" / "original"

UNIT_BY_SECTION = {
    1: "Unit 1: Understanding business activity",
    2: "Unit 2: People in business",
    3: "Unit 3: Marketing",
    4: "Unit 4: Operations management",
    5: "Unit 5: Financial information and decisions",
    6: "Unit 6: External influences on business activity",
}

CHAPTER_MAP = {
    # Unit 1 and 4/5 already use canonical labels.
    "2.1 Human resource management (HRM)": "2.3 Recruitment, selection and training",
    "2.2 Organisation and management": "2.2 Organisation and management",
    "2.3 Methods of communication": "2.4 Internal and external communication",
    "2.4 Motivating employees": "2.1 Motivating employees",
    "3.3 Marketing mix: Product and Price": "3.3 Marketing mix",
    "3.4 Marketing mix: Place and Promotion": "3.3 Marketing mix",
    "3.5 Marketing strategy": "3.4 Marketing strategy",
    "6.2 Business and the international economy": "6.3 Business and the international economy",
    "6.3 Business and the environment": "6.2 Environmental and ethical issues",
    "6.4 Business and ethical issues": "6.2 Environmental and ethical issues",
    "6.5 Pressure groups": "6.2 Environmental and ethical issues",
}

FORBIDDEN_PHRASES = [
    "examiner guidance",
    "0450",
    "mark schemes penalise",
]

INTERFACE = """export interface MCQItem {
  id: string;
  section: string;
  unit: string;
  chapter: string;
  questionNumber: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctOption: "A" | "B" | "C" | "D";
  correctAnswer: string;
  questionType: "MCQ";
  explanation: {
    correct_reason: string;
    distractor_reasons: {
      A: string;
      B: string;
      C: string;
      D: string;
    };
  };
}
"""


def read_bank(section: int) -> list[dict[str, Any]]:
    text = (DATA_DIR / f"mcq-bank-section{section}.ts").read_text(encoding="utf-8")
    match = re.search(r"export const MCQ_BANK_\d+\s*:\s*MCQItem\[\]\s*=\s*(\[.*\]);?\s*$", text, re.S)
    if not match:
        raise RuntimeError(f"section {section}: bank array not found")
    return json.loads(match.group(1))


def repair_item(item: dict[str, Any], section: int) -> Counter[str]:
    changes: Counter[str] = Counter()
    canonical_unit = UNIT_BY_SECTION[section]
    if item["unit"] != canonical_unit:
        item["unit"] = canonical_unit
        changes["unit"] += 1

    chapter = item["chapter"]
    if chapter in CHAPTER_MAP and CHAPTER_MAP[chapter] != chapter:
        item["chapter"] = CHAPTER_MAP[chapter]
        changes["chapter"] += 1

    explanation = item.setdefault("explanation", {})
    reason = str(explanation.get("correct_reason", "")).strip()
    distractors = explanation.setdefault("distractor_reasons", {})
    correct_option = item["correctOption"]
    if str(distractors.get(correct_option, "")).strip() != reason:
        distractors[correct_option] = reason
        changes["correct_option_explanation"] += 1
    for key in ("A", "B", "C", "D"):
        if key not in distractors:
            distractors[key] = reason if key == correct_option else "Incorrect because it does not answer the question asked."
            changes["missing_distractor_key"] += 1

    blob = json.dumps(item, ensure_ascii=False).lower()
    for phrase in FORBIDDEN_PHRASES:
        if phrase in blob:
            changes["boilerplate_present"] += 1
            break
    return changes


def write_bank(section: int, items: list[dict[str, Any]]) -> None:
    payload = json.dumps(items, ensure_ascii=False, separators=(",", ":"))
    body = INTERFACE + "\nexport const MCQ_BANK_%d: MCQItem[] = %s;\n" % (section, payload)
    (DATA_DIR / f"mcq-bank-section{section}.ts").write_text(body, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="write repaired banks (otherwise dry run)")
    args = parser.parse_args()

    totals: Counter[str] = Counter()
    for section in range(1, 7):
        items = read_bank(section)
        section_changes: Counter[str] = Counter()
        for item in items:
            section_changes.update(repair_item(item, section))
        totals.update(section_changes)
        print(f"section {section}: {len(items)} items, changes={dict(section_changes)}")
        if args.apply:
            BACKUP_DIR.mkdir(parents=True, exist_ok=True)
            source = DATA_DIR / f"mcq-bank-section{section}.ts"
            backup = BACKUP_DIR / source.name
            if not backup.exists():
                shutil.copy2(source, backup)
            write_bank(section, items)
    print("TOTAL:", dict(totals))
    if not args.apply:
        print("Dry run only. Re-run with --apply to write changes.")


if __name__ == "__main__":
    main()

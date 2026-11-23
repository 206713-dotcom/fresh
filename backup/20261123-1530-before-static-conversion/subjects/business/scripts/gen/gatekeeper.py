#!/usr/bin/env python3
"""Deterministic Gatekeeper for the 0264 expansion (Tracks A, B, C).

Validates ONLY the newly generated items and checks them against the read-only
snapshot of the already-audited banks. Never writes into the production banks.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from scripts.gen.common import (  # noqa: E402
    BLACKLIST_PATTERNS, UNITS, STAGING, ExistingIndex,
)

EXPECTED_MCQ_KEYS = {"id", "section", "unit", "chapter", "questionNumber", "question",
                     "options", "correctOption", "correctAnswer", "questionType",
                     "explanation"}


def norm(s: str) -> str:
    return re.sub(r"\s+", " ", str(s)).strip().lower()


def blacklist(obj, ident, errors):
    blob = json.dumps(obj, ensure_ascii=False).lower()
    for term, pat in BLACKLIST_PATTERNS:
        if pat.search(blob):
            errors.append(f"{ident}: BLACKLIST -> '{term}'")


# ------------------------------------------------------------------ Track A
def check_mcq(items, unit, idx, seen_ids: set, seen_q: set, errors):
    for it in items:
        qid = it.get("id", "?")
        if qid in seen_ids:
            errors.append(f"{qid}: duplicate id")
        seen_ids.add(qid)
        if set(it) != EXPECTED_MCQ_KEYS:
            errors.append(f"{qid}: keys must be exactly {sorted(EXPECTED_MCQ_KEYS)}")
            continue
        if str(it["section"]) != str(unit):
            errors.append(f"{qid}: section '{it['section']}' != {unit}")
        if it["unit"] != UNITS[unit]:
            errors.append(f"{qid}: invalid unit '{it['unit']}'")
        if it["questionNumber"] != qid:
            errors.append(f"{qid}: questionNumber mismatch")
        if not re.fullmatch(rf"P1_U{unit}_MCQ_(\d{{4}})", qid):
            errors.append(f"{qid}: id format")
        else:
            n = int(qid.rsplit("_", 1)[-1])
            if not 1001 <= n <= 2000:
                errors.append(f"{qid}: id outside new range 1001-2000")
        blob = norm(it["question"])
        if blob in seen_q:
            errors.append(f"{qid}: duplicate question stem")
        seen_q.add(blob)
        if len(it["question"].split()) < 12:
            errors.append(f"{qid}: stem too short for a scenario stem")
        opts = it["options"]
        if set(opts) != {"A", "B", "C", "D"}:
            errors.append(f"{qid}: options keys")
            continue
        if len({norm(v) for v in opts.values()}) != 4:
            errors.append(f"{qid}: duplicate option text")
        co = it["correctOption"]
        if co not in "ABCD" or opts.get(co) != it["correctAnswer"]:
            errors.append(f"{qid}: correctAnswer mismatch")
        exp = it["explanation"]
        if set(exp) != {"correct_reason", "distractor_reasons"}:
            errors.append(f"{qid}: explanation keys")
            continue
        if len(exp["correct_reason"].strip()) < 20:
            errors.append(f"{qid}: short correct_reason")
        dr = exp["distractor_reasons"]
        if set(dr) != {"A", "B", "C", "D"}:
            errors.append(f"{qid}: distractor_reasons keys")
            continue
        for k in "ABCD":
            r = dr[k].strip()
            if k == co:
                if r != exp["correct_reason"].strip():
                    errors.append(f"{qid}: distractor_reasons[{k}] must equal correct_reason")
            elif len(r) < 20:
                errors.append(f"{qid}: weak distractor reason {k}")
        blacklist(it, qid, errors)


# ------------------------------------------------------------------ Track B
P1_KEYS = {"scenario_id", "section", "unit", "chapter", "scenario_stem", "questions"}
P1_Q_KEYS = {"part", "number", "mark_value", "question_text", "model_answer",
             "mark_scheme", "qwen_marking_keys"}
P1_MARKS = [2, 2, 6, 6]


def check_p1(items, unit, idx, seen_ids, seen_stems, errors):
    for sc in items:
        sid = sc.get("scenario_id", "?")
        if sid in seen_ids:
            errors.append(f"{sid}: duplicate scenario id")
        seen_ids.add(sid)
        if sid not in idx.p1_ids and not re.fullmatch(r"P1_SET_\d{4}", sid):
            errors.append(f"{sid}: bad id format")
        if set(sc) != P1_KEYS:
            errors.append(f"{sid}: keys must be exactly {sorted(P1_KEYS)}")
            continue
        if sc["unit"] != P1_UNIT_NAMES[unit]:
            errors.append(f"{sid}: invalid unit '{sc['unit']}'")
        if sc["section"] != str(unit):
            errors.append(f"{sid}: section mismatch")
        stem = sc["scenario_stem"]
        wc = len(stem.split())
        if not 50 <= wc <= 85:
            errors.append(f"{sid}: stem word count {wc} outside 50-85")
        ns = norm(stem)
        if ns in seen_stems:
            errors.append(f"{sid}: duplicate stem")
        seen_stems.add(ns)
        blacklist(sc, sid, errors)
        qs = sc["questions"]
        if [q.get("mark_value") for q in qs] != P1_MARKS or len(qs) != 4:
            errors.append(f"{sid}: questions must be a-d with marks {P1_MARKS}")
            continue
        for q in qs:
            if set(q) != P1_Q_KEYS:
                errors.append(f"{sid} {q.get('part')}: question keys")
            words = q["qwen_marking_keys"]["valid_app_words"]
            if len(words) < 4:
                errors.append(f"{sid} {q['part']}: needs >=4 valid_app_words")
            low = stem.lower() + " " + q["model_answer"].lower()
            for w in words:
                if str(w).lower() not in low:
                    errors.append(f"{sid} {q['part']}: ungrounded app word '{w}'")


# ------------------------------------------------------------------ Track C
P2_KEYS = {"scenario_id", "unit", "case_study_insert", "questions"}
INS_KEYS = {"main_stem", "appendix_1_marketing_ops", "appendix_2_financial_data",
            "appendix_3_external_environment"}
P2_NUMS = ["1(a)", "1(b)", "2(a)", "2(b)", "3(a)", "3(b)", "4(a)", "4(b)"]
P2_MARKS = [8, 12, 8, 12, 8, 12, 8, 12]
MS8 = {"knowledge_max_2", "application_analysis_max_6"}
MS12 = {"level_1_1_to_4", "level_2_5_to_8", "level_3_9_to_12"}
Q3_KEYS = {"number", "mark_value", "sub_parts", "mark_scheme"}
QKEYS = {"number", "mark_value", "question_text", "model_answer", "mark_scheme",
         "qwen_marking_keys"}


def check_p2(items, idx, seen_ids, seen_stems, seen_initials, errors):
    for sc in items:
        sid = sc.get("scenario_id", "?")
        if sid in seen_ids:
            errors.append(f"{sid}: duplicate scenario id")
        seen_ids.add(sid)
        if set(sc) != P2_KEYS:
            errors.append(f"{sid}: top keys")
            continue
        if sc["unit"] != "Paper 2 Case Study":
            errors.append(f"{sid}: unit")
        ins = sc["case_study_insert"]
        if set(ins) != INS_KEYS:
            errors.append(f"{sid}: insert keys")
            continue
        ms = ins["main_stem"]
        wc = len(ms.split())
        if not 110 <= wc <= 145:
            errors.append(f"{sid}: main_stem {wc} words outside 110-145")
        ns = norm(ms)
        if ns in seen_stems:
            errors.append(f"{sid}: duplicate main_stem")
        seen_stems.add(ns)
        mi = re.search(r"\(([A-Z]{2,7})\)\s*$|\(([A-Z]{2,7})\)", ms)
        initials = (mi.group(1) or mi.group(2)) if mi else None
        if not initials:
            errors.append(f"{sid}: missing business initials")
        elif initials in seen_initials:
            errors.append(f"{sid}: initials '{initials}' reused")
        else:
            seen_initials.add(initials)
        a1 = ins["appendix_1_marketing_ops"]
        if len(a1) < 120 or len(re.findall(r"\d", a1)) < 6:
            errors.append(f"{sid}: appendix 1 needs >=120 chars and several metrics")
        a2 = ins["appendix_2_financial_data"]
        if set(a2) != {"title", "headers", "rows"}:
            errors.append(f"{sid}: appendix 2 keys")
        else:
            if a2["headers"] != ["Financial Metric", "2024", "2025"]:
                errors.append(f"{sid}: appendix 2 headers")
            if len(a2["rows"]) < 6:
                errors.append(f"{sid}: appendix 2 needs >=6 rows")
            for r in a2["rows"]:
                if len(r) != 3:
                    errors.append(f"{sid}: appendix 2 row shape")
                    break
        a3 = ins["appendix_3_external_environment"]
        if len(a3) < 80 or len(re.findall(r"\d+(?:\.\d+)?\s?%", a3)) < 3:
            errors.append(f"{sid}: appendix 3 needs 3 external changes with % figures")
        blacklist(sc, sid, errors)
        qs = sc["questions"]
        if [q.get("number") for q in qs] != P2_NUMS or \
           [q.get("mark_value") for q in qs] != P2_MARKS:
            errors.append(f"{sid}: question plan must be 1(a)..4(b) = 80 marks")
            continue
        insert_blob = json.dumps(ins, ensure_ascii=False).lower()
        for q in qs:
            num = q["number"]
            if num == "3(a)":
                if set(q) not in (Q3_KEYS, Q3_KEYS | {"question_text", "model_answer",
                                                     "qwen_marking_keys"}):
                    errors.append(f"{sid} 3(a): keys")
                subs = q.get("sub_parts", [])
                if [s.get("marks") for s in subs] != [2, 2, 4]:
                    errors.append(f"{sid} 3(a): sub marks [2,2,4]")
                if set(q.get("mark_scheme", {})) != {"working_marks"}:
                    errors.append(f"{sid} 3(a): mark_scheme.working_marks")
            else:
                if set(q) != QKEYS:
                    errors.append(f"{sid} {num}: keys")
                ms_keys = set(q.get("mark_scheme", {}))
                if num.endswith("(a)"):
                    if ms_keys != MS8:
                        errors.append(f"{sid} {num}: 8-mark scheme keys")
                elif ms_keys != MS12:
                    errors.append(f"{sid} {num}: 12-mark scheme keys")
                if num.endswith("(b)"):
                    t = norm(q["question_text"])
                    if not ("consider" in t and "which" in t and "justify" in t):
                        errors.append(f"{sid} {num}: needs Consider ... Which ...? Justify ...")
            if num == "3(a)" and "qwen_marking_keys" not in q:
                continue
            words = q.get("qwen_marking_keys", {}).get("valid_app_words", [])
            if not 5 <= len(words) <= 8:
                errors.append(f"{sid} {num}: valid_app_words 5-8")
            ans = q.get("model_answer", "").lower()
            hay = insert_blob + " " + ans + " " + json.dumps(q.get("sub_parts", []),
                                                            ensure_ascii=False).lower()
            check_in_insert = num not in {"3(a)", "3(b)"}
            for w in words:
                wl = str(w).lower()
                if check_in_insert and wl not in insert_blob:
                    errors.append(f"{sid} {num}: app word '{w}' not in insert")
                elif not check_in_insert and wl not in hay:
                    errors.append(f"{sid} {num}: app word '{w}' not grounded")


P1_UNIT_NAMES = {
    1: "Unit 1: Understanding Business Activity",
    2: "Unit 2: People in Business",
    3: "Unit 3: Marketing",
    4: "Unit 4: Operations Management",
    5: "Unit 5: Financial Information and Decisions",
    6: "Unit 6: External Influences on Business Activity",
}


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--track", choices=["a", "b", "c"], required=True)
    ap.add_argument("--unit", type=int)
    ap.add_argument("--out", type=Path, default=STAGING / "gatekeeper.json")
    args = ap.parse_args()

    idx = ExistingIndex()
    errors: list[str] = []

    if args.track == "a":
        for unit in range(1, 7):
            items = json.loads((STAGING / "mcq" / f"unit-{unit}.json").read_text(encoding="utf-8"))
            check_mcq(items, unit, idx, set(idx.mcq_ids), set(idx.mcq_stems), errors)
            print(f"track A unit {unit}: {len(items)} items checked")
    elif args.track == "b":
        p1_seen = set(idx.p1_ids)
        stems = set(idx.p1_stems)
        for unit in range(1, 7):
            items = json.loads((STAGING / "p1" / f"unit-{unit}.json").read_text(encoding="utf-8"))
            check_p1(items, unit, idx, p1_seen, stems, errors)
            print(f"track B unit {unit}: {len(items)} scenarios checked")
    else:
        seen = set(idx.p2_ids)
        stems = set(idx.p2_stems)
        initials = {re.search(r"\(([A-Z]{2,7})\)", s["case_study_insert"]["main_stem"]).
                    group(1) for s in idx.p2 if re.search(r"\(([A-Z]{2,7})\)",
                                                           s["case_study_insert"]["main_stem"])}
        total = 0
        for sector in range(1, 11):
            path = STAGING / "p2" / f"sector-{sector:02d}.json"
            if not path.exists():
                print(f"track C sector {sector:02d}: MISSING")
                continue
            items = json.loads(path.read_text(encoding="utf-8"))
            check_p2(items, idx, seen, stems, initials, errors)
            total += len(items)
            print(f"track C sector {sector:02d}: {len(items)} sets checked")
        print(f"track C total: {total}")

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({"error_count": len(errors), "errors": errors},
                                   indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"ERRORS: {len(errors)}")
    for e in errors[:40]:
        print("  " + e)
    if len(errors) > 40:
        print(f"  ... and {len(errors) - 40} more (see {args.out})")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()

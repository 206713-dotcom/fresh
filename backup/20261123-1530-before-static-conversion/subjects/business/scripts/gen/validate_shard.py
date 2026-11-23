#!/usr/bin/env python3
"""Validate ONE generated shard file (or a directory of shards) for the 0264 expansion.

Python is used ONLY for validation (schema, word counts, arithmetic, uniqueness,
blacklist). It never generates question text.

Usage:
  python scripts/gen/validate_shard.py --track a --glob "tmp_shards/mcq/U1-a-*.json"
  python scripts/gen/validate_shard.py --track b --glob "tmp_shards/p1/U1-a-*.json"
  python scripts/gen/validate_shard.py --track c --glob "tmp_shards/p2/S01-a-*.json"
"""
from __future__ import annotations

import argparse
import glob
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from scripts.gen.common import (  # noqa: E402
    BLACKLIST_PATTERNS, CHAPTERS, UNITS, P1_UNITS, ExistingIndex,
)

MCQ_KEYS = {"id", "section", "unit", "chapter", "questionNumber", "question", "options",
            "correctOption", "correctAnswer", "questionType", "explanation"}
P1_KEYS = {"scenario_id", "section", "unit", "chapter", "scenario_stem", "questions"}
P1_Q_DETAIL = {"part", "mark_value", "question_text", "model_answer", "mark_scheme",
               "qwen_marking_keys"}
P2_KEYS = {"scenario_id", "unit", "case_study_insert", "questions"}
INS_KEYS = {"main_stem", "appendix_1_marketing_ops", "appendix_2_financial_data",
            "appendix_3_external_environment"}
NUMS = ["1(a)", "1(b)", "2(a)", "2(b)", "3(a)", "3(b)", "4(a)", "4(b)"]
MARKS = [8, 12, 8, 12, 8, 12, 8, 12]
MS8 = {"knowledge_max_2", "application_analysis_max_6"}
MS12 = {"level_1_1_to_4", "level_2_5_to_8", "level_3_9_to_12"}


def norm(s):
    return re.sub(r"\s+", " ", str(s)).strip().lower()


PLACEHOLDER = re.compile(r"\b(?:Country|City|Region|Town|Island)\s+[A-Z]\b")


def blacklist(obj, ident, errors):
    blob = json.dumps(obj, ensure_ascii=False).lower()
    for term, pat in BLACKLIST_PATTERNS:
        if pat.search(blob):
            errors.append(f"{ident}: BLACKLIST -> '{term}'")
    text = json.dumps(obj, ensure_ascii=False)
    ph = PLACEHOLDER.search(text)
    if ph:
        errors.append(f"{ident}: PLACEHOLDER -> '{ph.group(0)}'")


def num(s):
    t = re.sub(r"[^0-9.\-]", "", str(s))
    try:
        return float(t)
    except ValueError:
        return None


# ----------------------------------------------------------------- Track A
def check_mcq(items, errors, idx, seen):
    for it in items:
        qid = it.get("id", "?")
        if qid in seen["ids"] or qid in idx.mcq_ids:
            errors.append(f"{qid}: duplicate id (shard/existing)")
        seen["ids"].add(qid)
        if set(it) != MCQ_KEYS:
            errors.append(f"{qid}: keys {sorted(set(it) ^ MCQ_KEYS)} differ")
            continue
        m = re.fullmatch(r"P1_U([1-6])_MCQ_(\d{4})", qid)
        if not m:
            errors.append(f"{qid}: bad id format")
            continue
        unit = int(m.group(1))
        n = int(m.group(2))
        if not 1001 <= n <= 2000:
            errors.append(f"{qid}: id outside range 1001-2000")
        if str(it["section"]) != str(unit) or it["unit"] != UNITS[unit]:
            errors.append(f"{qid}: section/unit mismatch")
        if it["chapter"] not in CHAPTERS[unit]:
            errors.append(f"{qid}: chapter '{it['chapter']}' not in unit {unit}")
        if it["questionNumber"] != qid:
            errors.append(f"{qid}: questionNumber != id")
        if it["questionType"] != "MCQ":
            errors.append(f"{qid}: questionType")
        stem = it["question"].strip()
        if len(stem.split()) < 25:
            errors.append(f"{qid}: stem only {len(stem.split())} words (needs a scenario)")
        ns = norm(stem)
        if ns in seen["stems"] or ns in idx.mcq_stems:
            errors.append(f"{qid}: duplicate question stem")
        seen["stems"].add(ns)
        opts = it["options"]
        if set(opts) != {"A", "B", "C", "D"}:
            errors.append(f"{qid}: option keys")
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
        cr = exp["correct_reason"].strip()
        if len(cr) < 20:
            errors.append(f"{qid}: correct_reason too short")
        dr = exp["distractor_reasons"]
        if set(dr) != {"A", "B", "C", "D"}:
            errors.append(f"{qid}: distractor keys")
            continue
        for k in "ABCD":
            r = str(dr[k]).strip()
            if k == co:
                if r != cr:
                    errors.append(f"{qid}: distractor_reasons[{k}] must equal correct_reason")
            elif len(r) < 20:
                errors.append(f"{qid}: distractor_reasons[{k}] too short")
        blacklist(it, qid, errors)


# ----------------------------------------------------------------- Track B
def check_p1(items, errors, idx, seen):
    for sc in items:
        sid = sc.get("scenario_id", "?")
        if sid in seen["ids"] or sid in idx.p1_ids:
            errors.append(f"{sid}: duplicate scenario id")
        seen["ids"].add(sid)
        if not re.fullmatch(r"P1_SET_\d{4}", sid):
            errors.append(f"{sid}: bad id format")
        else:
            n = int(sid.rsplit("_", 1)[-1])
            if not 1201 <= n <= 6000:
                errors.append(f"{sid}: id outside range 1201-6000")
        if set(sc) != P1_KEYS:
            errors.append(f"{sid}: keys {sorted(set(sc) ^ P1_KEYS)} differ")
            continue
        unit = int(str(sc["section"]))
        if sc["unit"] != P1_UNITS[unit]:
            errors.append(f"{sid}: unit '{sc['unit']}' != '{P1_UNITS[unit]}'")
        if sc["chapter"] not in CHAPTERS[unit]:
            errors.append(f"{sid}: chapter '{sc['chapter']}' not in unit {unit}")
        stem = sc["scenario_stem"]
        wc = len(stem.split())
        if not 50 <= wc <= 85:
            errors.append(f"{sid}: stem {wc} words, must be 50-85")
        ns = norm(stem)
        if ns in seen["stems"] or ns in idx.p1_stems:
            errors.append(f"{sid}: duplicate stem")
        seen["stems"].add(ns)
        blacklist(sc, sid, errors)
        qs = sc["questions"]
        if len(qs) != 4:
            errors.append(f"{sid}: needs exactly 4 questions")
            continue
        if [q.get("part") for q in qs] != ["a", "b", "c", "d"]:
            errors.append(f"{sid}: parts must be a,b,c,d")
        if [q.get("mark_value") for q in qs] != [2, 2, 6, 6]:
            errors.append(f"{sid}: marks must be [2,2,6,6]")
        for q in qs:
            if set(q) != P1_Q_DETAIL:
                errors.append(f"{sid} {q.get('part')}: keys")
                continue
            if len(q["model_answer"].split()) < 8:
                errors.append(f"{sid} {q['part']}: model_answer too thin")
            words = q["qwen_marking_keys"].get("valid_app_words", [])
            if not 4 <= len(words) <= 8:
                errors.append(f"{sid} {q['part']}: valid_app_words {len(words)} not 4-8")
            low = stem.lower() + " " + q["model_answer"].lower()
            for w in words:
                if str(w).lower() not in low:
                    errors.append(f"{sid} {q['part']}: ungrounded app word '{w}'")
        d = [q for q in qs if q.get("part") == "d"][0]
        if "justify" not in norm(d["question_text"]):
            errors.append(f"{sid} d: needs a justified decision question")


# ----------------------------------------------------------------- Track C
def check_p2(items, errors, idx, seen):
    for sc in items:
        sid = sc.get("scenario_id", "?")
        if sid in seen["ids"] or sid in idx.p2_ids:
            errors.append(f"{sid}: duplicate scenario id")
        seen["ids"].add(sid)
        if not re.fullmatch(r"P2_SET_\d{3,4}", sid):
            errors.append(f"{sid}: bad id format")
        else:
            n = int(sid.rsplit("_", 1)[-1])
            if not 501 <= n <= 3000:
                errors.append(f"{sid}: id outside range 501-3000")
        if set(sc) != P2_KEYS:
            errors.append(f"{sid}: top keys")
            continue
        if sc["unit"] != "Paper 2 Case Study":
            errors.append(f"{sid}: unit")
        ins = sc["case_study_insert"]
        if set(ins) != INS_KEYS:
            errors.append(f"{sid}: insert keys")
            continue
        stem = ins["main_stem"]
        wc = len(stem.split())
        if not 110 <= wc <= 145:
            errors.append(f"{sid}: main_stem {wc} words, must be 110-145")
        mi = re.search(r"\(([A-Z]{2,7})\)", stem)
        if not mi:
            errors.append(f"{sid}: main_stem needs parenthesised initials")
        else:
            ini = mi.group(1)
            if ini in seen["initials"] or ini in idx.p2_initials:
                errors.append(f"{sid}: initials '{ini}' reused")
            seen["initials"].add(ini)
            if ini.lower() not in norm(stem):
                errors.append(f"{sid}: initials not applied")
        ns = norm(stem)
        if ns in seen["stems"] or ns in idx.p2_stems:
            errors.append(f"{sid}: duplicate main_stem")
        seen["stems"].add(ns)

        a1 = ins["appendix_1_marketing_ops"]
        if len(a1) < 120 or len(re.findall(r"\d[\d,.]*", a1)) < 4:
            errors.append(f"{sid}: appendix_1 needs >=120 chars and >=4 metrics")
        a2 = ins["appendix_2_financial_data"]
        if not isinstance(a2, dict) or set(a2) != {"title", "headers", "rows"}:
            errors.append(f"{sid}: appendix_2 must be {title,headers,rows}")
            continue
        if a2["headers"] != ["Financial Metric", "2024", "2025"]:
            errors.append(f"{sid}: appendix_2 headers")
        rows = a2["rows"]
        if not isinstance(rows, list) or len(rows) < 6:
            errors.append(f"{sid}: appendix_2 needs >=6 rows")
            continue
        for r in rows:
            if not (isinstance(r, list) and len(r) == 3):
                errors.append(f"{sid}: appendix_2 row must be [label,2024,2025]")
                break
        if "$" not in a2["title"]:
            errors.append(f"{sid}: appendix_2 title needs a currency")
        a3 = ins["appendix_3_external_environment"]
        if len(a3) < 80 or len(re.findall(r"\d+(?:\.\d+)?\s?%", a3)) < 3:
            errors.append(f"{sid}: appendix_3 needs 3 changes with % figures")
        blacklist(sc, sid, errors)

        # ---- arithmetic: break-even family from the stem
        fc = _money(stem, r"fixed costs? of \$?([0-9,]+(?:\.[0-9]+)?)")
        vc = _money(stem, r"variable cost of \$?([0-9,]+(?:\.[0-9]+)?)")
        price = _money(stem, r"selling price of \$?([0-9,]+(?:\.[0-9]+)?)")
        out = _int(stem, r"produces ([0-9][0-9,]*) units")
        if None in (fc, vc, price, out):
            errors.append(f"{sid}: stem must contain 'fixed costs of $X', "
                          f"'variable cost of $Y', 'selling price of $Z', 'produces N units'")
        else:
            contrib = price - vc
            be = fc / contrib
            if contrib <= 0:
                errors.append(f"{sid}: negative contribution")
            q3 = [q for q in sc["questions"] if q.get("number") == "3(a)"]
            if q3:
                blob = " ".join(sp.get("model_answer", "") for sp in q3[0].get("sub_parts", []))
                if not _contains(blob, contrib):
                    errors.append(f"{sid}: 3(a) model answer lacks contribution {contrib:.2f}")
                if not _contains(blob, be, tol=1.0):
                    errors.append(f"{sid}: 3(a) model answer lacks break-even {be:.0f}")
                if not _contains(blob, out - be, tol=1.0):
                    errors.append(f"{sid}: 3(a) model answer lacks margin of safety {out-be:.0f}")

        # ---- ratio claims recomputed from appendix 2
        _check_ratios(sid, rows, sc, errors)

        qs = sc["questions"]
        if [q.get("number") for q in qs] != NUMS or \
           [q.get("mark_value") for q in qs] != MARKS:
            errors.append(f"{sid}: question plan must be 1(a)..4(b), 80 marks")
            continue
        insert_blob = json.dumps(ins, ensure_ascii=False).lower()
        for q in qs:
            number = q["number"]
            if number == "3(a)":
                # Accept both the short form and the canonical app schema (as in
                # paper2/prompts/example_set.json, which also carries question_text,
                # model_answer and qwen_marking_keys).
                if set(q) not in (
                    {"number", "mark_value", "sub_parts", "mark_scheme"},
                    {"number", "mark_value", "question_text", "sub_parts",
                     "model_answer", "mark_scheme", "qwen_marking_keys"},
                ):
                    errors.append(f"{sid} 3(a): keys")
                if [s.get("marks") for s in q.get("sub_parts", [])] != [2, 2, 4]:
                    errors.append(f"{sid} 3(a): sub marks [2,2,4]")
            else:
                if set(q) != {"number", "mark_value", "question_text", "model_answer",
                             "mark_scheme", "qwen_marking_keys"}:
                    errors.append(f"{sid} {number}: keys")
                    continue
                ms = set(q["mark_scheme"])
                want = MS8 if number.endswith("(a)") else MS12
                if ms != want:
                    errors.append(f"{sid} {number}: mark_scheme keys {sorted(ms)}")
                if number.endswith("(b)"):
                    t = norm(q["question_text"])
                    for frag in ("consider", "which", "justify"):
                        if frag not in t:
                            errors.append(f"{sid} {number}: missing '{frag}'")
            if number == "3(a)" and "qwen_marking_keys" not in q:
                continue
            words = q.get("qwen_marking_keys", {}).get("valid_app_words", [])
            if not 5 <= len(words) <= 8:
                errors.append(f"{sid} {number}: valid_app_words {len(words)} not 5-8")
            hay = insert_blob
            if number in ("3(a)", "3(b)"):
                hay += " " + q.get("model_answer", "").lower() + " " + \
                       json.dumps(q.get("sub_parts", []), ensure_ascii=False).lower()
            for w in words:
                if str(w).lower() not in hay:
                    errors.append(f"{sid} {number}: app word '{w}' not grounded in insert")


def _money(text, pattern):
    m = re.search(pattern, text, re.I)
    if not m:
        return None
    try:
        return float(m.group(1).replace(",", ""))
    except ValueError:
        return None


def _int(text, pattern):
    m = re.search(pattern, text, re.I)
    if not m:
        return None
    try:
        return float(m.group(1).replace(",", ""))
    except ValueError:
        return None


def _contains(text, value, tol=0.01):
    for raw in re.findall(r"[0-9][0-9,]*(?:\.[0-9]+)?", text):
        v = num(raw)
        if v is not None and abs(v - value) <= max(tol, abs(value) * 0.005):
            return True
    return False


def _rows(rows):
    out = {}
    for r in rows:
        out[norm(r[0])] = (num(r[1]), num(r[2]))
    return out


def _check_ratios(sid, rows, sc, errors):
    d = _rows(rows)
    blob = json.dumps(sc["questions"], ensure_ascii=False)

    def claim(label, year, expected):
        # "Profit Margin" must not be read out of the "Gross Profit Margin" line.
        guard = r"(?<!Gross )" if label == "Profit Margin" else ""
        pat = rf"{guard}{label}\s*{year}\s*=\s*([0-9.]+)"
        m = re.search(pat, blob, re.I)
        if not m:
            return
        got = float(m.group(1))
        if abs(got - expected) > 0.02:
            errors.append(f"{sid}: {label} {year} claimed {got}, recomputed {expected:.2f}")

    def need(key):
        for k in d:
            if key in k:
                return True
        return False

    q = [x for x in sc["questions"] if x.get("number") == "3(b)"]
    if not q:
        return
    text = norm(q[0]["question_text"])
    if "liquidity" in text or "acid" in text or "current ratio" in text:
        if need("inventor") and need("receivable") and need("current liabilit") and need("cash"):
            def ca(y):
                return d[[k for k in d if "inventor" in k][0]][y] + \
                       d[[k for k in d if "receivable" in k][0]][y] + \
                       d[[k for k in d if "cash" in k][0]][y]
            cl = d[[k for k in d if "current liabilit" in k][0]]
            for y in (0, 1):
                claim("Current Ratio", 2024 + y, ca(y) / cl[y])
                claim("Acid Test Ratio", 2024 + y,
                      (ca(y) - d[[k for k in d if "inventor" in k][0]][y]) / cl[y])
        else:
            errors.append(f"{sid}: liquidity set missing inventories/receivables/cash/"
                          f"current liabilities row labels")
    else:
        if need("revenue") and need("cost of sales") and need("gross profit") and \
           need("operating profit") and need("capital employed"):
            rev = d[[k for k in d if "revenue" in k][0]]
            cos = d[[k for k in d if "cost of sales" in k][0]]
            gp = d[[k for k in d if "gross profit" in k][0]]
            op = d[[k for k in d if "operating profit" in k][0]]
            ce = d[[k for k in d if "capital employed" in k][0]]
            for y in (0, 1):
                year = 2024 + y
                if abs((rev[y] - cos[y]) - gp[y]) > 1:
                    errors.append(f"{sid}: {year} gross profit != revenue - cost of sales")
                claim("Gross Profit Margin", year, gp[y] / rev[y] * 100)
                claim("Profit Margin", year, op[y] / rev[y] * 100)
                claim("ROCE", year, op[y] / ce[y] * 100)
        else:
            errors.append(f"{sid}: profitability set missing revenue/cost of sales/gross "
                          f"profit/operating profit/capital employed row labels")


# -------------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--track", choices=["a", "b", "c"], required=True)
    ap.add_argument("--glob", required=True)
    ap.add_argument("--out", type=Path)
    args = ap.parse_args()

    idx = ExistingIndex()
    files = sorted(glob.glob(args.glob, recursive=True))
    errors, seen = [], {"ids": set(), "stems": set(), "initials": set()}
    total = 0
    for f in files:
        try:
            items = json.loads(Path(f).read_text(encoding="utf-8"))
        except Exception as exc:  # noqa: BLE001
            errors.append(f"{f}: JSON PARSE ERROR {exc}")
            continue
        if not isinstance(items, list):
            errors.append(f"{f}: top level must be a JSON array")
            continue
        total += len(items)
        tag = ""
        if args.track == "a":
            check_mcq(items, errors, idx, seen)
        elif args.track == "b":
            check_p1(items, errors, idx, seen)
        else:
            check_p2(items, errors, idx, seen)
        print(f"{Path(f).name}: {len(items)} items")

    report = {"track": args.track, "files": len(files), "items": total,
              "error_count": len(errors), "errors": errors}
    if args.out:
        args.out.parent.mkdir(parents=True, exist_ok=True)
        args.out.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nFILES {len(files)} | ITEMS {total} | ERRORS {len(errors)}")
    for e in errors[:30]:
        print("  " + e)
    if len(errors) > 30:
        print(f"  ... and {len(errors) - 30} more")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()

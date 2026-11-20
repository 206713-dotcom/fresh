#!/usr/bin/env python3
"""
Deterministic gatekeeper for Cambridge IGCSE Business (0264) Paper 2 sets.

Usage:
  python gatekeeper.py --wave 1 --sets-dir paper2/sets/wave_01
  python gatekeeper.py --wave-file paper2/waves/0264_Paper_2_Wave_01.json

Exits non-zero if ANY set fails. Prints a per-set error log and a wave summary.
Combined wave JSON is only written when every set passes (combine mode with --combine).
"""
import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]  # repo root (paper2/scripts/gatekeeper.py)

TOL_RATIO = 0.06        # absolute tolerance for ratio values (e.g. 1.85 vs 1.80)
TOL_PCT = 0.75          # absolute tolerance for percentage margins
TOL_MONEY_REL = 0.006   # relative tolerance for money math
TOL_MONEY_ABS = 0.51

REQUIRED_TOP = ["scenario_id", "unit", "case_study_insert", "questions"]
REQUIRED_INSERT = ["main_stem", "appendix_1_marketing_ops", "appendix_2_financial_data", "appendix_3_external_environment"]
REQUIRED_APP2 = ["title", "headers", "rows"]
QUESTION_PLAN = [("1(a)", 8), ("1(b)", 12), ("2(a)", 8), ("2(b)", 12), ("3(a)", 8), ("3(b)", 12), ("4(a)", 8), ("4(b)", 12)]
REQUIRED_Q = ["number", "mark_value", "question_text", "model_answer", "mark_scheme", "qwen_marking_keys"]
MS_8A = ["knowledge_max_2", "application_analysis_max_6"]
MS_12 = ["level_1_1_to_4", "level_2_5_to_8", "level_3_9_to_12"]
Q3_NUMBERS = {"3(a)", "3(b)"}


def approx_money(a, b):
    return abs(a - b) <= max(TOL_MONEY_ABS, abs(b) * TOL_MONEY_REL)


def num(s):
    """Parse a money/number cell like '$1,234' or '18.5' or '12.5%'."""
    if s is None:
        return None
    t = str(s).strip()
    is_pct = "%" in t
    t = re.sub(r"[^0-9.\-]", "", t)
    if t in ("", "-", "."):
        return None
    try:
        v = float(t)
        return (v, is_pct)
    except ValueError:
        return None


def strip_num_str(v):
    return re.sub(r"[^0-9.\-%]", "", str(v)) if v is not None else ""


def extract_number_strings(text):
    return re.findall(r"\d[\d,]*(?:\.\d+)?%?", text or "")


def word_count(text):
    return len(re.findall(r"\S+", text or ""))


def norm(s):
    return re.sub(r"\s+", " ", str(s)).strip().lower()


def find_initials(main_stem):
    m = re.search(r"\(([A-Z]{2,7})\)", main_stem or "")
    return m.group(1) if m else None


def parse_money_after(pattern, text):
    m = re.search(pattern, text, re.IGNORECASE)
    if not m:
        return None
    raw = m.group(1).replace(",", "")
    try:
        return float(raw)
    except ValueError:
        return None


def combined_insert(cs):
    parts = [cs.get("main_stem", ""), cs.get("appendix_1_marketing_ops", ""),
             json.dumps(cs.get("appendix_2_financial_data", {}), ensure_ascii=False),
             cs.get("appendix_3_external_environment", "")]
    return " ".join(parts)


def check_set(s, all_initials, filename="<memory>"):
    errs = []
    warns = []

    def E(msg):
        errs.append(msg)

    # ---- 1. Top-level structure -------------------------------------------
    if set(s.keys()) != set(REQUIRED_TOP):
        E(f"top-level keys must be exactly {REQUIRED_TOP}, got {sorted(s.keys())}")
    sid = s.get("scenario_id", "")
    m = re.match(r"^P2_SET_(\d{3})$", str(sid))
    if not m:
        E(f"scenario_id '{sid}' does not match P2_SET_###")
    elif not (101 <= int(m.group(1)) <= 500):
        E(f"scenario_id '{sid}' outside 101-500")
    if s.get("unit") != "Paper 2 Case Study":
        E("unit must be 'Paper 2 Case Study'")

    cs = s.get("case_study_insert", {})
    if not isinstance(cs, dict) or set(cs.keys()) != set(REQUIRED_INSERT):
        E("case_study_insert keys must be exactly main_stem, appendix_1_marketing_ops, appendix_2_financial_data, appendix_3_external_environment")
        cs = cs if isinstance(cs, dict) else {}

    main_stem = cs.get("main_stem", "")
    app1 = cs.get("appendix_1_marketing_ops", "")
    app2 = cs.get("appendix_2_financial_data", {})
    app3 = cs.get("appendix_3_external_environment", "")

    # ---- 2. main_stem 110-145 words ----------------------------------------
    wc = word_count(main_stem)
    if not (110 <= wc <= 145):
        E(f"main_stem word count {wc} outside 110-145")

    initials = find_initials(main_stem)
    if not initials:
        E("main_stem missing parenthesised business initials, e.g. 'Kestrel (KPP)'")
    else:
        if initials in all_initials:
            E(f"business initials '{initials}' already used by set {all_initials[initials]}")
        else:
            all_initials[initials] = sid

    # ---- 3. Appendix 1 ------------------------------------------------------
    if len(app1) < 120:
        E("appendix_1_marketing_ops too short (<120 chars)")
    nums_app1 = extract_number_strings(app1)
    if len(nums_app1) < 4:
        E(f"appendix_1 must contain at least 4 concrete numerical metrics, found {len(nums_app1)}")

    # ---- 4. Appendix 2 ------------------------------------------------------
    if not isinstance(app2, dict):
        E("appendix_2_financial_data must be an object")
        app2 = {}
    if set(app2.keys()) != set(REQUIRED_APP2):
        E("appendix_2 keys must be exactly title, headers, rows")
    title = str(app2.get("title", ""))
    if "$" not in title:
        E("appendix_2 title must include a currency symbol ($) and scale, e.g. \"$ '000\"")
    headers = app2.get("headers", [])
    if headers != ["Financial Metric", "2024", "2025"]:
        E(f"appendix_2 headers must be ['Financial Metric','2024','2025'], got {headers}")
    rows = app2.get("rows", [])
    if not isinstance(rows, list) or len(rows) < 6:
        E(f"appendix_2 must contain at least 6 rows, got {len(rows) if isinstance(rows, list) else 'non-list'}")
        rows = rows if isinstance(rows, list) else []
    parsed_rows = []
    for i, r in enumerate(rows):
        if not (isinstance(r, list) and len(r) == 3):
            E(f"appendix_2 row {i} must be a 3-element array, got {r}")
            continue
        label = str(r[0]).strip()
        v24, v25 = num(r[1]), num(r[2])
        if v24 is None or v25 is None:
            E(f"appendix_2 row {i} values not numeric: {r}")
            continue
        parsed_rows.append((label, v24[0], v25[0]))

    # ---- 5. Appendix 3 ------------------------------------------------------
    if len(str(app3)) < 80:
        E("appendix_3_external_environment too short (<80 chars)")
    pcts = re.findall(r"\d+(?:\.\d+)?\s?%", str(app3))
    if len(pcts) < 3:
        E(f"appendix_3 must detail 3 external changes with figures/percentages, found {len(pcts)}")

    insert_text = combined_insert(cs)

    # ---- 6. Questions structure ----------------------------------------------
    qs = s.get("questions", [])
    if not isinstance(qs, list) or len(qs) != 8:
        E(f"questions must be a list of exactly 8, got {len(qs) if isinstance(qs, list) else 'non-list'}")
        qs = qs if isinstance(qs, list) else []
    seen_numbers = [q.get("number") for q in qs if isinstance(q, dict)]
    if seen_numbers != [p[0] for p in QUESTION_PLAN]:
        E(f"question numbers/order must be {[p[0] for p in QUESTION_PLAN]}, got {seen_numbers}")

    q_by_number = {q.get("number"): q for q in qs if isinstance(q, dict)}
    total_marks = sum(q.get("mark_value", 0) for q in qs if isinstance(q, dict))
    if total_marks != 80:
        E(f"mark total must be 80, got {total_marks}")

    ratio_claims = {}
    for number, mark in QUESTION_PLAN:
        q = q_by_number.get(number)
        if not isinstance(q, dict):
            continue
        # keys exactly
        extra = set(q.keys()) - set(REQUIRED_Q + (["sub_parts"] if number == "3(a)" else []))
        missing = set(REQUIRED_Q) - set(q.keys())
        if missing:
            E(f"{number}: missing keys {sorted(missing)}")
        if extra:
            E(f"{number}: unexpected keys {sorted(extra)}")
        if q.get("mark_value") != mark:
            E(f"{number}: mark_value must be {mark}, got {q.get('mark_value')}")
        if not str(q.get("question_text", "")).strip():
            E(f"{number}: empty question_text")
        if not str(q.get("model_answer", "")).strip():
            E(f"{number}: empty model_answer")
        # mark scheme keys
        ms = q.get("mark_scheme", {})
        if not isinstance(ms, dict):
            E(f"{number}: mark_scheme must be object")
        elif number.endswith("(a)") and number != "3(a)":
            if set(ms.keys()) != set(MS_8A):
                E(f"{number}: mark_scheme keys must be {MS_8A}, got {sorted(ms.keys())}")
        elif number.endswith("(b)"):
            if set(ms.keys()) != set(MS_12):
                E(f"{number}: mark_scheme keys must be {MS_12}, got {sorted(ms.keys())}")
        # valid_app_words
        keys = q.get("qwen_marking_keys", {})
        vaw = keys.get("valid_app_words") if isinstance(keys, dict) else None
        if not isinstance(vaw, list) or not (5 <= len(vaw) <= 8):
            E(f"{number}: valid_app_words must be a list of 5-8 entries, got {vaw}")
        else:
            haystack = insert_text if number not in Q3_NUMBERS else insert_text + " " + str(q.get("model_answer", "")) + " " + json.dumps(q.get("sub_parts", []))
            hay_low = norm(haystack)
            for w in vaw:
                if not isinstance(w, str) or not w.strip():
                    E(f"{number}: valid_app_words contains empty/non-string entry")
                    continue
                if norm(w) not in hay_low:
                    E(f"{number}: valid_app_word '{w}' not found verbatim in {'insert+model_answer' if number in Q3_NUMBERS else 'case_study_insert'}")
        # (b)-question evaluative command words
        qt = norm(q.get("question_text", ""))
        if number.endswith("(b)") and number != "3(b)":
            if "which" not in qt or "justify" not in qt:
                E(f"{number}: (b) question must use 'Which ...? Justify your ...' structure")
        # part (a) applied to named business
        if number.endswith("(a)") and number != "3(a)" and initials:
            if initials.lower() not in qt:
                E(f"{number}: part (a) not applied to the named business ('{initials}' absent from question_text)")

    # ---- 7. 3(a) sub-parts & math -------------------------------------------
    q3a = q_by_number.get("3(a)", {})
    subparts = q3a.get("sub_parts", [])
    if not isinstance(subparts, list) or len(subparts) != 3:
        E("3(a): must contain exactly 3 sub_parts")
        subparts = []
    sp_plan = [("(i)", 2), ("(ii)", 2), ("(iii)", 4)]
    sp_map = {}
    for i, sp in enumerate(subparts):
        if not isinstance(sp, dict):
            E(f"3(a) sub_part {i} must be an object")
            continue
        exp_part, exp_marks = sp_plan[i] if i < 3 else (None, None)
        if sp.get("part") != exp_part:
            E(f"3(a) sub_part {i}: part must be {exp_part}, got {sp.get('part')}")
        if sp.get("marks") != exp_marks:
            E(f"3(a) sub_part {exp_part}: marks must be {exp_marks}, got {sp.get('marks')}")
        if set(sp.keys()) != {"part", "marks", "question_text", "model_answer"}:
            E(f"3(a) sub_part {exp_part}: keys must be exactly part, marks, question_text, model_answer")
        if not str(sp.get("model_answer", "")).strip():
            E(f"3(a) sub_part {exp_part}: empty model_answer")
        sp_map[sp.get("part")] = sp
    if q3a.get("mark_scheme", {}) and set((q3a.get("mark_scheme") or {}).keys()) != {"working_marks"}:
        E("3(a): mark_scheme keys must be exactly ['working_marks']")

    # parse stem data
    fc = parse_money_after(r"fixed costs? (?:of|totalling|total(?:ling)?) ?\$?([0-9,]+(?:\.[0-9]+)?)", main_stem)
    if fc is None:
        fc = parse_money_after(r"\$([0-9,]+(?:\.[0-9]+)?)\s+(?:in\s+)?fixed costs?", main_stem)
    vc = parse_money_after(r"variable cost[s]?(?: per unit| a unit| each| of)[^$0-9]{0,30}\$?([0-9,]+(?:\.[0-9]+)?)", main_stem)
    if vc is None:
        vc = parse_money_after(r"\$([0-9,]+(?:\.[0-9]+)?)\s+(?:in\s+)?variable cost[s]?", main_stem)
    price = parse_money_after(r"selling price of \$?([0-9,]+(?:\.[0-9]+)?)", main_stem)
    if price is None:
        price = parse_money_after(r"sells?[^.]{0,40}?\$?([0-9,]+(?:\.[0-9]+)?)\s+(?:per|a|each)\s+unit", main_stem)
    output_m = re.search(r"([0-9][0-9,]*)\s+units", main_stem)
    output = float(output_m.group(1).replace(",", "")) if output_m else None
    workers = None
    wm = re.search(r"workforce of ([0-9,]+)", main_stem, re.IGNORECASE) or re.search(r"([0-9,]+)\s*(?:full[- ]time )?(?:employees|workers|staff)", main_stem, re.IGNORECASE)
    if wm:
        workers = float(wm.group(1).replace(",", ""))

    calc_targets = {}
    if price is not None and vc is not None:
        calc_targets["contribution"] = price - vc
        if fc is not None and calc_targets["contribution"] != 0:
            calc_targets["break-even"] = fc / calc_targets["contribution"]
            if output is not None:
                calc_targets["margin of safety"] = output - calc_targets["break-even"]
    if fc is not None and output:
        calc_targets["average total cost"] = fc / output + (vc or 0)
        calc_targets["unit cost"] = calc_targets["average total cost"]
    if output and workers:
        calc_targets["labour productivity"] = output / workers
    if vc is not None:
        calc_targets["variable cost per unit"] = vc

    for part in ("(i)", "(ii)"):
        sp = sp_map.get(part, {})
        qtext = norm(sp.get("question_text", ""))
        ma = sp.get("model_answer", "")
        expected = None
        for key, val in calc_targets.items():
            if key in qtext:
                expected = (key, val)
                break
        if expected is None:
            warns.append(f"3(a) {part}: could not map question to a recalculable quantity; skipping math check")
            continue
        key, val = expected

        def appears(v, text):
            t = text.replace(",", "")
            for pat in (f"{v:.2f}", f"{v:.1f}", f"{v:.0f}", f"{v:.4f}", f"{v}"):
                if re.search(r"(?<![0-9])" + re.escape(pat) + r"(?![0-9])", t):
                    return True
            return False
        if not appears(val, ma):
            E(f"3(a) {part}: model_answer does not contain recalculated '{key}' = {val:.4f} (question: {sp.get('question_text','')[:80]})")

    # ---- 8. Appendix 2 math & 3(b) ------------------------------------------
    rows_d = {}
    for label, v24, v25 in parsed_rows:
        rows_d[norm(label)] = (v24, v25)

    def row_lookup(*keywords):
        for lab, vals in rows_d.items():
            for kw in keywords:
                if kw in lab:
                    return vals
        return None

    inv = row_lookup("inventor", "stock")
    receiv = row_lookup("receivable", "debtor")
    cash = row_lookup("cash")
    cl = row_lookup("current liabilities", "creditor", "payable")
    rev = row_lookup("revenue", "sales", "turnover")
    cos = row_lookup("cost of sales", "cost of goods")
    gp = row_lookup("gross profit")
    op = row_lookup("operating profit", "profit from operations", "pbit", "profit before interest")
    ce = row_lookup("capital employed")

    q3b = q_by_number.get("3(b)", {})
    ma3b = str(q3b.get("model_answer", ""))

    def check_pair(name, computed_pair, label_regex, tol, exclude_regex=None):
        vals = []
        for line in ma3b.splitlines():
            if not re.search(label_regex, line, re.IGNORECASE):
                continue
            if exclude_regex and re.search(exclude_regex, line, re.IGNORECASE):
                continue
            for x in re.findall(r"([0-9]+(?:\.[0-9]+)?)", line):
                v = float(x)
                if 1900 <= v <= 2100 and v == int(v):
                    continue
                vals.append(v)
        matched = []
        remaining = list(vals)
        for target in computed_pair:
            hit = None
            for v in remaining:
                if abs(v - target) <= tol:
                    hit = v
                    break
            if hit is not None:
                matched.append(hit)
                remaining.remove(hit)
        if len(matched) != len(computed_pair):
            E(f"3(b): model_answer does not accurately restate both {name} values (computed {computed_pair[0]:.2f} / {computed_pair[1]:.2f}; found near-label numbers {vals})")

    liquidity = inv is not None and cl is not None and (receiv is not None or cash is not None)
    profitability = rev is not None and gp is not None and ce is not None

    if liquidity:
        ca24 = (inv[0] or 0) + ((receiv[0] if receiv else 0) or 0) + ((cash[0] if cash else 0) or 0)
        ca25 = (inv[1] or 0) + ((receiv[1] if receiv else 0) or 0) + ((cash[1] if cash else 0) or 0)
        cr24, cr25 = ca24 / cl[0], ca25 / cl[1]
        at24, at25 = (ca24 - inv[0]) / cl[0], (ca25 - inv[1]) / cl[1]
        check_pair("Current Ratio", (cr24, cr25), r"current ratio", TOL_RATIO)
        check_pair("Acid Test Ratio", (at24, at25), r"acid[ -]test(?: ratio)?", TOL_RATIO)
    elif profitability:
        gpm24, gpm25 = gp[0] / rev[0] * 100, gp[1] / rev[1] * 100
        if cos:
            for yr, r_, c_, g_ in (("2024", rev[0], cos[0], gp[0]), ("2025", rev[1], cos[1], gp[1])):
                if not approx_money(g_, r_ - c_):
                    E(f"appendix_2 ({yr}): gross profit {g_} inconsistent with revenue {r_} - cost of sales {c_}")
        check_pair("gross profit margin", (gpm24, gpm25), r"gross profit margin", TOL_PCT)
        if op:
            pm24, pm25 = op[0] / rev[0] * 100, op[1] / rev[1] * 100
            check_pair("profit margin", (pm24, pm25), r"profit margin", TOL_PCT, exclude_regex=r"gross profit margin")
            roce24, roce25 = op[0] / ce[0] * 100, op[1] / ce[1] * 100
            check_pair("ROCE", (roce24, roce25), r"roce", TOL_PCT)
        else:
            E("appendix_2: missing operating profit (PBIT) row needed for profit margin and ROCE")
    else:
        E("appendix_2: cannot identify required statement rows. Liquidity sets need Inventories/Receivables/Cash/Current liabilities; Profitability sets need Revenue/Gross profit/Operating profit/Capital employed")

    # ---- 9. Duplicate scenario IDs -------------------------------------------
    # handled by caller via all_initials / ids set

    return errs, warns, initials


def load_sets_from_dir(d):
    d = Path(d)
    files = sorted(d.rglob("*.json"))
    out = []
    for f in files:
        try:
            data = json.loads(f.read_text(encoding="utf-8"))
        except Exception as e:
            out.append((f, None, f"invalid JSON: {e}"))
            continue
        if isinstance(data, list):
            for item in data:
                out.append((f, item, None))
        else:
            out.append((f, data, None))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--wave", type=int, default=None)
    ap.add_argument("--sets-dir", type=str, default=None)
    ap.add_argument("--wave-file", type=str, default=None)
    ap.add_argument("--combine", action="store_true", help="write combined wave file if all pass")
    args = ap.parse_args()

    # uniqueness across ALL previous waves + current
    all_initials = {}
    seen_ids = {}
    wave_root = ROOT / "paper2" / "sets"
    for wf in wave_root.rglob("*.json"):
        if args.sets_dir and str(Path(args.sets_dir).resolve()) in str(wf.resolve()):
            continue
        try:
            data = json.loads(wf.read_text(encoding="utf-8"))
        except Exception:
            continue
        items = data if isinstance(data, list) else [data]
        for item in items:
            init = find_initials((item.get("case_study_insert") or {}).get("main_stem", ""))
            if init:
                all_initials.setdefault(init, item.get("scenario_id", "?"))
            seen_ids.setdefault(item.get("scenario_id", "?"), wf.name)
    for wf in (ROOT / "paper2" / "waves").glob("*.json"):
        try:
            data = json.loads(wf.read_text(encoding="utf-8"))
        except Exception:
            continue
        for item in data:
            init = find_initials((item.get("case_study_insert") or {}).get("main_stem", ""))
            if init:
                all_initials.setdefault(init, item.get("scenario_id", "?"))
            seen_ids.setdefault(item.get("scenario_id", "?"), wf.name)

    if args.wave_file:
        raw = json.loads(Path(args.wave_file).read_text(encoding="utf-8"))
        items = raw if isinstance(raw, list) else [raw]
        file_entries = [(Path(args.wave_file), it, None) for it in items]
    elif args.sets_dir:
        file_entries = load_sets_from_dir(args.sets_dir)
    else:
        print("Provide --sets-dir or --wave-file", file=sys.stderr)
        sys.exit(2)

    results = []
    any_fail = False
    for f, item, parse_err in file_entries:
        if parse_err:
            results.append((str(f), "<unparseable>", [parse_err], []))
            any_fail = True
            continue
        sid = item.get("scenario_id", "?")
        errs, warns, init = check_set(item, all_initials, str(f))
        if sid in seen_ids:
            errs.append(f"scenario_id '{sid}' already used in {seen_ids[sid]}")
        else:
            seen_ids[sid] = str(f)
        status = "PASS" if not errs else "FAIL"
        if errs:
            any_fail = True
        results.append((str(f), sid, errs, warns))

    print("=" * 78)
    print(f"GATEKEEPER REPORT  |  checked {len(results)} set(s)")
    print("=" * 78)
    for f, sid, errs, warns in results:
        status = "PASS" if not errs else "FAIL"
        print(f"[{status}] {sid}  ({f})")
        for e in errs:
            print(f"    ERROR: {e}")
        for w in warns:
            print(f"    warn : {w}")
    fails = sum(1 for _, _, e, _ in results if e)
    print("=" * 78)
    print(f"Sets passed: {len(results) - fails}/{len(results)}   |   failed: {fails}")

    if args.combine and args.sets_dir and not any_fail:
        combined = [item for _, item, _ in file_entries]
        combined.sort(key=lambda it: it.get("scenario_id", ""))
        out = ROOT / "paper2" / "waves" / f"0264_Paper_2_Wave_{args.wave:02d}.json"
        out.write_text(json.dumps(combined, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"Combined wave written to {out}")
    elif args.combine and any_fail:
        print("NOT writing combined wave file: failures present.", file=sys.stderr)
        sys.exit(1)

    sys.exit(1 if any_fail else 0)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Deterministic repair: swap non-verbatim valid_app_words entries for insert-verbatim spans
and append training-clause sentences to appendix_1 where the question text requires those phrases."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
W = ROOT / "sets" / "wave_03"

PATCHES = [
    (206, {("4(a)", "$8.00"): "$26.50"}, None),
    (207, {("1(a)", "bank loan"): "permit-processing platform", ("4(a)", "citizen-facing"): "civic-tech"},
        " Staff complete on-the-job training on the permit module and off-the-job training at the civic-tech institute."),
    (208, {("1(a)", "bank loan"): "route-optimization", ("4(a)", "electric-vehicle"): "route-optimization"},
        " Staff complete on-the-job training on the optimization engine and off-the-job training at the logistics institute."),
    (209, {("1(a)", "bank loan"): "predictive-fault-alert", ("4(a)", "solar-panel"): "predictive-fault-alert"},
        " Staff complete on-the-job training on the analytics dashboard and off-the-job training with the software vendor."),
    (210, {("1(a)", "bank loan"): "claims-automation", ("4(a)", "fully automated"): "claims-automation"},
        " Staff complete on-the-job training on the triage platform and off-the-job training at the insurtech institute."),
    (219, {("4(a)", "$82"): "$210"}, None),
]

for sid, kw_repl, a1_clause in PATCHES:
    p = W / f"P2_SET_{sid}.json"
    d = json.loads(p.read_text(encoding="utf-8"))
    applied = []
    for q in d["questions"]:
        vaw = q["qwen_marking_keys"]["valid_app_words"]
        for i, w in enumerate(vaw):
            k = (q["number"], w)
            if k in kw_repl:
                vaw[i] = kw_repl[k]
                applied.append(f"{q['number']}:'{w}'->'{kw_repl[k]}'")
    if a1_clause:
        d["case_study_insert"]["appendix_1_marketing_ops"] += a1_clause
    p.write_text(json.dumps(d, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"patched {sid}: {applied}")
print("done")

#!/usr/bin/env python3
"""Grounding repairs for wave_03 sets 187/188/189/190/195 (replace non-verbatim VAW spans)."""
import json
from pathlib import Path

BASE = Path(__file__).resolve().parents[1] / "sets" / "wave_03"
JOBS = {
    187: {("4(a)", "$11.00"): "$24.00"},
    188: {("2(a)", "democratic leadership"): "shared democratic decision-making",
          ("2(b)", "internal"): "in-process checks",
          ("2(b)", "external"): "final inspection"},
    189: {("2(a)", "profit sharing"): "share issue",
          ("2(b)", "flat democratic structure"): "democratic leadership",
          ("2(b)", "operations manager"): "rubber-calendering"},
    190: {("1(a)", "sale of assets"): "delivery fleet",
          ("2(a)", "job enrichment"): "wall-thickness testing",
          ("2(b)", "CAM"): "in-line wall-thickness testing",
          ("4(a)", "$4.50"): "$12.60"},
    195: {("1(a)", "overdraft"): "bank loan",
          ("2(b)", "off-the-job training"): "off-the-job watchmaker training"},
}
for sid, repl in JOBS.items():
    p = BASE / f"P2_SET_{sid}.json"
    d = json.loads(p.read_text(encoding="utf-8"))
    found = set()
    for q in d["questions"]:
        vaw = q["qwen_marking_keys"]["valid_app_words"]
        for i, w in enumerate(vaw):
            k = (q["number"], w)
            if k in repl:
                vaw[i] = repl[k]
                found.add(k)
    missing = set(repl) - found
    if missing:
        print(f"{sid}: already-fixed keys skipped: {missing}")
    p.write_text(json.dumps(d, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"{sid}: {len(found)} swaps")
print("done")

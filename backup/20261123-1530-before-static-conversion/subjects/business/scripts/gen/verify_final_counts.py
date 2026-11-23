#!/usr/bin/env python3
"""Prove final production bank totals: 12,000 MCQ (2,000/unit),
6,000 Paper 1 (1,000/unit) and 3,000 Paper 2 sets."""
from __future__ import annotations

import json, re, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from scripts.gen.common import DATA  # noqa: E402

errors = []
mcq_total = 0
for sec in range(1, 7):
    text = (DATA / f"mcq-bank-section{sec}.ts").read_text(encoding="utf-8")
    m = re.search(r"=\s*(\[.*\]);?\s*$", text, re.S)
    items = json.loads(m.group(1))
    nums = [int(x["id"].rsplit("_", 1)[-1]) for x in items]
    if len(items) != 2000:
        errors.append(f"MCQ unit {sec}: {len(items)} != 2000")
    if sorted(nums) != list(range(1, 2001)):
        errors.append(f"MCQ unit {sec}: ids not 1-2000")
    mcq_total += len(items)

p1 = json.loads((DATA / "paper1-database.json").read_text(encoding="utf-8"))
if len(p1) != 6000:
    errors.append(f"Paper 1: {len(p1)} != 6000")
for sec in range(1, 7):
    cnt = sum(1 for s in p1 if f"Unit {sec}" in s["unit"])
    if cnt != 1000:
        errors.append(f"Paper 1 unit {sec}: {cnt} != 1000")

p2 = json.loads((DATA / "paper2-database.json").read_text(encoding="utf-8"))
if len(p2) != 3000:
    errors.append(f"Paper 2: {len(p2)} != 3000")
nums = sorted(int(s["scenario_id"].rsplit("_", 1)[-1]) for s in p2)
if nums != list(range(1, 3001)):
    errors.append("Paper 2 ids not 1-3000")

print(f"MCQ {mcq_total} | P1 {len(p1)} | P2 {len(p2)}")
if errors:
    for e in errors:
        print("FAIL", e)
    raise SystemExit(1)
print("ALL FINAL BANK COUNTS PASS")

#!/usr/bin/env python3
"""Merge the 400 generated sets into the business app's Paper 2 database (one-off)."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DB = ROOT / "subjects" / "business" / "src" / "lib" / "data" / "paper2-database.json"
SETS = ROOT / "paper2" / "sets"

existing = json.loads(DB.read_text(encoding="utf-8"))
existing_ids = {s["scenario_id"] for s in existing}
new_sets = []
for f in sorted(SETS.glob("wave_*/P2_SET_*.json")):
    s = json.loads(f.read_text(encoding="utf-8"))
    if s["scenario_id"] in existing_ids:
        raise SystemExit(f"DUPLICATE id {s['scenario_id']} in {f}")
    existing_ids.add(s["scenario_id"])
    new_sets.append(s)

assert len(existing) == 100, len(existing)
assert len(new_sets) == 400, len(new_sets)
merged = existing + new_sets


def key(s):
    m = re.search(r"(\d+)$", s["scenario_id"])
    return int(m.group(1)) if m else 0


merged.sort(key=key)
assert len(merged) == 500
assert len({s["scenario_id"] for s in merged}) == 500
DB.write_text(json.dumps(merged, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"merged: {len(existing)} original + {len(new_sets)} generated = {len(merged)} sets")
print("first:", merged[0]["scenario_id"], "last:", merged[-1]["scenario_id"])
print("db bytes:", DB.stat().st_size)

#!/usr/bin/env python3
"""Full-range (100%) merge of every expansion shard into the production banks.

Unlike merge_half1.py / merge_half2.py, this rebuilds each bank from the
*untouched* pre-expansion base and adds every new shard in strict ID order:

  MCQ : base ids 001-1000/unit  + shards mcq/ + mcq2/  -> 1001-2000/unit
  P1  : base legacy ids (1-200/unit) + shards p1/ + p12/ -> 1201-6000
  P2  : base ids 001-500 + shards p2/ + p2h2/ -> 501-3000

It asserts the base items are byte-identical before and after the write.
Run from subjects/business:  python scripts/gen/merge_full.py
"""
from __future__ import annotations

import glob
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from scripts.gen.common import DATA, load_mcq, load_p1, load_p2  # noqa: E402

MCQ_HEADER = '''export interface MCQItem {
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
'''


def num(sid: str) -> int:
    return int(re.search(r"(\d+)$", str(sid)).group(1))


def canon(obj) -> str:
    return json.dumps(obj, sort_keys=True, ensure_ascii=False, separators=(",", ":"))


def shard_items(folders: list[str], idkey: str, lo: int, hi: int) -> dict[str, dict]:
    out: dict[str, dict] = {}
    for folder in folders:
        for f in sorted(glob.glob(f"tmp_shards/{folder}/*.json")):
            try:
                data = json.loads(Path(f).read_text(encoding="utf-8"))
            except Exception:
                continue
            if not isinstance(data, list):
                continue
            for item in data:
                if not isinstance(item, dict) or idkey not in item:
                    continue
                n = num(item[idkey])
                if lo <= n <= hi:
                    key = item[idkey]
                    if key in out:
                        raise AssertionError(f"duplicate shard id {key} in {f}")
                    out[key] = item
    return out


def write_mcq(section: int, items: list[dict]) -> None:
    body = json.dumps(items, ensure_ascii=False, separators=(",", ":"))
    (DATA / f"mcq-bank-section{section}.ts").write_text(
        f"{MCQ_HEADER}\nexport const MCQ_BANK_{section}: MCQItem[] = {body};\n",
        encoding="utf-8")


def main() -> None:
    # ---- snapshot the untouched pre-expansion banks
    base_mcq = {s: [q for q in load_mcq(s) if num(q["id"]) <= 1000]
                for s in range(1, 7)}
    for s in range(1, 7):
        assert len(base_mcq[s]) == 1000, f"MCQ unit {s}: base {len(base_mcq[s])} != 1000"
    base_p1 = [s for s in load_p1() if num(s["scenario_id"]) <= 1200]
    base_p2 = [s for s in load_p2() if num(s["scenario_id"]) <= 500]
    assert len(base_p1) == 1200, f"P1 base {len(base_p1)} != 1200"
    assert len(base_p2) == 500, f"P2 base {len(base_p2)} != 500"
    base_snapshot = (
        {s: canon(base_mcq[s]) for s in range(1, 7)},
        canon(base_p1), canon(base_p2),
    )

    # ---- load all new shards
    new_mcq = shard_items(["mcq", "mcq2"], "id", 1001, 2000)
    new_p1 = shard_items(["p1", "p12"], "scenario_id", 1201, 6000)
    new_p2 = shard_items(["p2", "p2h2"], "scenario_id", 501, 3000)
    assert len(new_mcq) == 6000, f"new MCQs {len(new_mcq)} != 6000"
    assert len(new_p1) == 4800, f"new P1 {len(new_p1)} != 4800"
    assert len(new_p2) == 2500, f"new P2 {len(new_p2)} != 2500"

    # ---- MCQ: 1000 base + 1000 new per unit = 2000
    for s in range(1, 7):
        unit_new = [q for q in new_mcq.values() if str(q["section"]) == str(s)]
        assert sorted(num(q["id"]) for q in unit_new) == list(range(1001, 2001)), \
            f"MCQ unit {s}: new ids not 1001-2000"
        merged = base_mcq[s] + unit_new
        merged.sort(key=lambda q: num(q["id"]))
        assert len(merged) == 2000 and num(merged[0]["id"]) == 1 and num(merged[-1]["id"]) == 2000
        assert len({q["id"] for q in merged}) == 2000
        write_mcq(s, merged)
        print(f"mcq unit {s}: 1000 base + 1000 new = 2000")

    # ---- Paper 1: 1200 legacy base + 4800 new = 6000, 1000 per unit
    assert sorted(num(q["scenario_id"]) for q in new_p1.values()) == list(range(1201, 6001))
    merged_p1 = base_p1 + list(new_p1.values())
    merged_p1.sort(key=lambda q: num(q["scenario_id"]))
    assert len(merged_p1) == 6000 and len({q["scenario_id"] for q in merged_p1}) == 6000
    for u in range(1, 7):
        c = sum(1 for q in merged_p1 if f"Unit {u}" in q["unit"])
        assert c == 1000, f"P1 unit {u}: {c} != 1000"
    (DATA / "paper1-database.json").write_text(
        json.dumps(merged_p1, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"paper 1: 1200 base + 4800 new = 6000 (1000/unit)")

    # ---- Paper 2: 500 base + 2500 new = 3000
    assert sorted(num(q["scenario_id"]) for q in new_p2.values()) == list(range(501, 3001))
    merged_p2 = base_p2 + list(new_p2.values())
    merged_p2.sort(key=lambda q: num(q["scenario_id"]))
    assert len(merged_p2) == 3000 and len({q["scenario_id"] for q in merged_p2}) == 3000
    (DATA / "paper2-database.json").write_text(
        json.dumps(merged_p2, ensure_ascii=False), encoding="utf-8")
    print(f"paper 2: 500 base + 2500 new = 3000")

    # ---- assert the base banks were not modified
    after_mcq = {s: canon([q for q in load_mcq(s) if num(q["id"]) <= 1000])
                 for s in range(1, 7)}
    after = (after_mcq, canon([q for q in load_p1() if num(q["scenario_id"]) <= 1200]),
             canon([q for q in load_p2() if num(q["scenario_id"]) <= 500]))
    assert after == base_snapshot, "UNTLOCKED BASE BANK WAS MODIFIED"
    print("UNTOUCHED BASE BANKS VERIFIED BYTE-IDENTICAL (MCQ 6000 | P1 1200 | P2 500)")
    print("FULL MERGE OK")


if __name__ == "__main__":
    main()

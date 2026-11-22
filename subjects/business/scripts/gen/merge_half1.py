#!/usr/bin/env python3
"""Merge validated Half-1 shards into the production banks.

Reads ONLY tmp_shards/*.json (already validated), appends the new items after the
untouched existing records, sorts by ID, and writes the production files.
Never regenerates or edits existing items.
"""
from __future__ import annotations

import argparse
import glob
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from scripts.gen.common import DATA, UNITS  # noqa: E402

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


def load_bank(section: int) -> tuple[str, list[dict]]:
    text = (DATA / f"mcq-bank-section{section}.ts").read_text(encoding="utf-8")
    m = re.search(r"=\s*(\[.*\]);?\s*$", text, re.S)
    return text, json.loads(m.group(1))


def write_bank(section: int, items: list[dict]) -> None:
    path = DATA / f"mcq-bank-section{section}.ts"
    body = json.dumps(items, ensure_ascii=False, separators=(",", ":"))
    path.write_text(
        f"{MCQ_HEADER}\nexport const MCQ_BANK_{section}: MCQItem[] = {body};\n",
        encoding="utf-8")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--track", choices=["a", "b", "c", "d"], required=True)
    ap.add_argument("--expect-total", type=int, default=0,
                    help="assert the merged paper 2 bank reaches this size")
    args = ap.parse_args()

    shards = sorted(glob.glob("tmp_shards/**/*.json", recursive=True))

    if args.track == "a":
        new: dict[int, list[dict]] = {s: [] for s in range(1, 7)}
        for f in shards:
            if not f.replace("\\", "/").startswith("tmp_shards/mcq/"):
                continue
            try:
                data = json.loads(Path(f).read_text(encoding="utf-8"))
            except Exception:
                continue
            if not isinstance(data, list):
                continue
            for it in data:
                if isinstance(it, dict):
                    unit = int(it["section"])
                    new[unit].append(it)
        for unit in range(1, 7):
            _, old = load_bank(unit)
            allitems = old + new[unit]
            allitems.sort(key=lambda x: int(x["id"].rsplit("_", 1)[-1]))
            ids = [x["id"] for x in allitems]
            assert len(ids) == len(set(ids)), f"unit {unit}: duplicate ids"
            placed = sorted({int(x["id"].rsplit("_", 1)[-1]) for x in new[unit]})
            assert placed[0] == 1001, f"unit {unit}: first new id {placed[0]} != 1001"
            assert placed == list(range(1001, 1001 + len(placed))), \
                f"unit {unit}: new ids not contiguous"
            assert len(new[unit]) == 500, f"unit {unit}: expected 500 new, got {len(new[unit])}"
            assert len(allitems) == 1500, f"unit {unit}: total {len(allitems)} != 1500"
            write_bank(unit, allitems)
            print(f"unit {unit}: {len(old)} existing + {len(new[unit])} new = {len(allitems)}")

    elif args.track == "b":
        p1_path = DATA / "paper1-database.json"
        old = json.loads(p1_path.read_text(encoding="utf-8"))
        new: list[dict] = []
        for f in shards:
            if f.replace("\\", "/").startswith("tmp_shards/p1/"):
                try:
                    data = json.loads(Path(f).read_text(encoding="utf-8"))
                except Exception:
                    continue
                if isinstance(data, list):
                    new.extend(x for x in data if isinstance(x, dict))
        allsc = old + new
        allsc.sort(key=lambda s: int(s["scenario_id"].rsplit("_", 1)[-1]))
        ids = [s["scenario_id"] for s in allsc]
        assert len(ids) == len(set(ids)), "duplicate paper 1 ids"
        placed = sorted(int(s["scenario_id"].rsplit("_", 1)[-1]) for s in new)
        assert placed[0] == 1201 and placed == list(range(1201, 1201 + len(placed))), \
            "new paper 1 ids not contiguous from 1201"
        for unit in range(1, 7):
            cnt = sum(1 for s in allsc if f"Unit {unit}" in s["unit"])
            assert cnt == 600, f"Unit {unit}: {cnt} paper 1 scenarios != 600"
        p1_path.write_text(json.dumps(allsc, ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"paper 1: {len(old)} existing + {len(new)} new = {len(allsc)}")

    else:
        p2_path = DATA / "paper2-database.json"
        old = json.loads(p2_path.read_text(encoding="utf-8"))
        new: list[dict] = []
        prefix = "tmp_shards/p2h2/" if args.track == "d" else "tmp_shards/p2/"
        first_id = 1751 if args.track == "d" else 501
        for f in shards:
            if f.replace("\\", "/").startswith(prefix):
                try:
                    items = json.loads(Path(f).read_text(encoding="utf-8"))
                except Exception:
                    continue
                if not isinstance(items, list):
                    continue
                items = [x for x in items if isinstance(x, dict)]
                if args.track == "d":
                    items = [x for x in items
                             if 1751 <= int(x["scenario_id"].rsplit("_", 1)[-1]) <= 2062]
                new.extend(items)
        allsets = old + new
        allsets.sort(key=lambda s: int(s["scenario_id"].rsplit("_", 1)[-1]))
        ids = [s["scenario_id"] for s in allsets]
        assert len(ids) == len(set(ids)), "duplicate paper 2 ids"
        placed = sorted(int(s["scenario_id"].rsplit("_", 1)[-1]) for s in new)
        assert placed[0] == first_id and placed == list(range(first_id, first_id + len(placed))), \
            f"new paper 2 ids not contiguous from {first_id}"
        if args.expect_total:
            assert len(allsets) == args.expect_total, \
                f"paper 2 total {len(allsets)} != {args.expect_total}"
        p2_path.write_text(json.dumps(allsets, ensure_ascii=False), encoding="utf-8")
        print(f"paper 2: {len(old)} existing + {len(new)} new = {len(allsets)}")


if __name__ == "__main__":
    main()

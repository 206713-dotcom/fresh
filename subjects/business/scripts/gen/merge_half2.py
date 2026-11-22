#!/usr/bin/env python3
"""Merge Half-2 shards into the production banks (Half-1 banks are already merged).

Reads only tmp_shards/mcq2, tmp_shards/p12 and tmp_shards/p2h2. Never edits
existing production items; appended items are sorted by id.
"""
from __future__ import annotations

import argparse, glob, json, re, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from scripts.gen.common import DATA  # noqa: E402

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


def load_mcq(section: int) -> list[dict]:
    text = (DATA / f"mcq-bank-section{section}.ts").read_text(encoding="utf-8")
    m = re.search(r"=\s*(\[.*\]);?\s*$", text, re.S)
    return json.loads(m.group(1))


def write_mcq(section: int, items: list[dict]) -> None:
    body = json.dumps(items, ensure_ascii=False, separators=(",", ":"))
    (DATA / f"mcq-bank-section{section}.ts").write_text(
        f"{MCQ_HEADER}\nexport const MCQ_BANK_{section}: MCQItem[] = {body};\n",
        encoding="utf-8")


def shard_items(folder: str, min_id: int = 0) -> list[dict]:
    out = []
    for f in sorted(glob.glob(f"tmp_shards/{folder}/*.json")):
        try:
            data = json.loads(Path(f).read_text(encoding="utf-8"))
        except Exception:
            continue
        if not isinstance(data, list):
            continue  # skip *_validation.json / report artifacts
        for item in data:
            if not isinstance(item, dict):
                continue
            key = "id" if "id" in item else "scenario_id"
            if int(item[key].rsplit("_", 1)[-1]) >= min_id:
                out.append(item)
    return out


def nums(items: list[dict], key: str) -> list[int]:
    return [int(x[key].rsplit("_", 1)[-1]) for x in items]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--track", choices=["a", "b", "c"], required=True)
    args = ap.parse_args()

    if args.track == "a":
        new = shard_items("mcq2")
        for unit in range(1, 7):
            items = [x for x in new if str(x["section"]) == str(unit)]
            placed = sorted(int(x["id"].rsplit("_", 1)[-1]) for x in items)
            assert placed == list(range(1501, 2001)), f"unit {unit}: mcq ids {placed[:1]}..{placed[-1:]}"
            assert len(items) == 500, f"unit {unit}: {len(items)} mcqs != 500"
            old = load_mcq(unit)
            # idempotent: drop any previously-merged half-2 items, keep the
            # untouched audited 001-1000 bank as the foundation.
            base = [x for x in old if int(x["id"].rsplit("_", 1)[-1]) <= 1500]
            assert len(base) == 1500, f"unit {unit}: existing audited bank {len(base)} != 1500"
            allitems = base + items
            allitems.sort(key=lambda x: int(x["id"].rsplit("_", 1)[-1]))
            ids = [x["id"] for x in allitems]
            assert len(ids) == len(set(ids)) == 2000, f"unit {unit}: duplicate ids or bad total"
            write_mcq(unit, allitems)
            print(f"mcq unit {unit}: 1500 + 500 = 2000")

    elif args.track == "b":
        new = shard_items("p12")
        path = DATA / "paper1-database.json"
        old = json.loads(path.read_text(encoding="utf-8"))
        base = [s for s in old if int(s["scenario_id"].rsplit("_", 1)[-1]) <= 3600]
        assert len(base) == 3600, f"existing audited paper 1 {len(base)} != 3600"
        placed = sorted(nums(new, "scenario_id"))
        assert placed == list(range(3601, 6001)), "paper 1 ids not 3601-6000"
        allsc = base + new
        allsc.sort(key=lambda s: int(s["scenario_id"].rsplit("_", 1)[-1]))
        ids = [s["scenario_id"] for s in allsc]
        assert len(ids) == len(set(ids)) == 6000, "paper 1 duplicate ids or bad total"
        for unit in range(1, 7):
            cnt = sum(1 for s in allsc if f"Unit {unit}" in s["unit"])
            assert cnt == 1000, f"unit {unit}: {cnt} != 1000"
        path.write_text(json.dumps(allsc, ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"paper 1: 3600 + {len(new)} = 6000")

    else:
        new = shard_items("p2h2", min_id=2063)
        path = DATA / "paper2-database.json"
        old = json.loads(path.read_text(encoding="utf-8"))
        base = [s for s in old if int(s["scenario_id"].rsplit("_", 1)[-1]) <= 2062]
        assert len(base) == 2062, f"existing audited paper 2 {len(base)} != 2062"
        placed = sorted(nums(new, "scenario_id"))
        assert placed == list(range(2063, 3001)), "paper 2 ids not 2063-3000"
        allsets = base + new
        allsets.sort(key=lambda s: int(s["scenario_id"].rsplit("_", 1)[-1]))
        ids = [s["scenario_id"] for s in allsets]
        assert len(ids) == len(set(ids)) == 3000, "paper 2 duplicate ids or bad total"
        path.write_text(json.dumps(allsets, ensure_ascii=False), encoding="utf-8")
        print(f"paper 2: 2062 + {len(new)} = 3000")


if __name__ == "__main__":
    main()

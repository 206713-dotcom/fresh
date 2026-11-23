#!/usr/bin/env python3
"""Merge audited/repaired wave JSON files back into the six MCQ bank .ts files.

Verifies that only assigned ids changed, that ordering/counts are intact, and
that immutable identity fields (id, questionNumber, section, unit, chapter)
were preserved before writing anything.
"""

from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "src" / "lib" / "data"
AUDIT = ROOT / "data-staging" / "audit"
WAVES = AUDIT / "waves"
ASSIGN = WAVES / "assignments"
BACKUP = AUDIT / "pre-merge"

INTERFACE = """export interface MCQItem {
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
"""

IMMUTABLE = ("id", "questionNumber", "section", "unit", "chapter")


def load_bank(section: int) -> list[dict]:
    text = (DATA / f"mcq-bank-section{section}.ts").read_text(encoding="utf-8")
    return json.loads(re.search(r"= (\[.*\]);?\s*$", text, re.S).group(1))


def main() -> None:
    BACKUP.mkdir(parents=True, exist_ok=True)
    wave_arrays: list[list[dict]] = []
    for wave in range(1, 13):
        arr = json.loads((WAVES / f"wave-{wave:02d}.json").read_text(encoding="utf-8"))
        assert len(arr) == 500, f"wave {wave}: expected 500 items, got {len(arr)}"
        wave_arrays.append(arr)

    merged = [item for arr in wave_arrays for item in arr]
    original = [item for section in range(1, 7) for item in load_bank(section)]
    assert len(merged) == len(original) == 6000

    assigned: set[str] = set()
    for wave in range(1, 13):
        report = json.loads((ASSIGN / f"wave-{wave:02d}-defects.json").read_text(encoding="utf-8"))
        assigned.update(entry["id"] for entry in report["items"])

    errors: list[str] = []
    for old, new in zip(original, merged):
        qid = old["id"]
        if new["id"] != qid:
            errors.append(f"{qid}: id/order changed to {new['id']}")
            continue
        for field in IMMUTABLE:
            if old.get(field) != new.get(field):
                errors.append(f"{qid}: immutable field {field} changed")
        if qid not in assigned and old != new:
            errors.append(f"{qid}: changed but was not assigned for regeneration")
    if errors:
        raise SystemExit("Merge aborted:\n" + "\n".join(errors[:40]))

    for section in range(1, 7):
        source = DATA / f"mcq-bank-section{section}.ts"
        backup = BACKUP / source.name
        if not backup.exists():
            shutil.copy2(source, backup)
        items = merged[(section - 1) * 1000: section * 1000]
        payload = json.dumps(items, ensure_ascii=False, separators=(",", ":"))
        source.write_text(INTERFACE + "\nexport const MCQ_BANK_%d: MCQItem[] = %s;\n" % (section, payload), encoding="utf-8")
    print(f"Merged 6000 items ({len(assigned)} regenerated) into six bank files.")


if __name__ == "__main__":
    main()

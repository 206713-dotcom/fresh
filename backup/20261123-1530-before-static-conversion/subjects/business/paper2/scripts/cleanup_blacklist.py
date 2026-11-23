#!/usr/bin/env python3
"""One-off mechanical blacklist-token cleanup across waves 01/02/03.
Exact-string, case-sensitive replacements; abort loudly on any no-op."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "sets"

# (file relative to sets/, [(old, new), ...])
JOBS = [
    ("wave_03/P2_SET_220.json", [("payback testing for the $980,000 investment and $550,000 loan",
                                   "affordability testing for the $980,000 investment against the $550,000 loan")]),
    ("wave_03/P2_SET_195.json", [("payback feasibility for the $1,600,000 refurbishment",
                                   "affordability testing for the $1,600,000 refurbishment"),
                                  ("extend click-and-collect to accelerate cash conversion",
                                   "extend click-and-collect to speed up cash collection"),
                                  ("expected payback stretches beyond plan",
                                   "expected returns stretch beyond plan")]),
    ("wave_03/P2_SET_219.json", [("payback testing for the $1,850,000 press and $700,000 loan",
                                   "affordability testing for the $1,850,000 press against the $700,000 loan"),
                                  ("Its weaknesses are slower payback, a risk of",
                                   "Its weaknesses are slower returns, a risk of")]),
    ("wave_03/P2_SET_213.json", [("HACCP food-safety", "food-safety"),
                                  ("HACCP", "food-safety")]),
    ("wave_03/P2_SET_189.json", [("supporting the case for the $920,000 calendering line's payback.",
                                   "supporting the business case for the $920,000 calendering line."),
                                  ("a longer payback on the whole expansion",
                                   "a longer recovery across the whole expansion")]),
    ("wave_03/P2_SET_193.json", [("avoids increasing KMR's gearing", "avoids increasing KMR's debt burden"),
                                  ("flagship payback feasibility", "flagship expansion affordability")]),
    ("wave_03/P2_SET_181.json", [("accelerate depreciation of the old line", "retire the old line early")]),
    ("wave_02/P2_SET_168.json", [("thousands of regression tests", "thousands of automated checks"),
                                  ("thousands of regression checks overnight", "thousands of automated checks overnight"),
                                  ("inferior for regression control", "inferior for test coverage")]),
    ("wave_02/P2_SET_143.json", [("HACCP hygiene", "food-safety hygiene")]),
    ("wave_02/P2_SET_159.json", [("a payback of well under two months if waste falls",
                                   "cost recovery in well under two months if waste falls")]),
    ("wave_03/P2_SET_204.json", [("improves payback", "improves the economics")]),
    ("wave_03/P2_SET_200.json", [("assets that depreciate quickly", "assets that lose value quickly")]),
    ("wave_01/P2_SET_139.json", [("modify the line, depreciate it for tax purposes and use it as collateral",
                                   "modify the line and use it as collateral"),
                                  ("in-process SPC checks", "in-process inspection checks")]),
    ("wave_03/P2_SET_206.json", [("It also delays the payback narrative", "It also weakens the business-case narrative")]),
    ("wave_02/P2_SET_161.json", [("threatening the payback of the electrification programme",
                                   "threatening the recovery of the electrification investment")]),
    ("wave_02/P2_SET_178.json", [("lift the discount rate", "raise the cost of financing")]),
    ("wave_01/P2_SET_115.json", [("before its cash conversion cycle is proven", "before its cash position is proven")]),
]

problems = []
for rel, pairs in JOBS:
    f = ROOT / rel
    t = f.read_text(encoding="utf-8")
    new = t
    for old, repl in pairs:
        n = new.count(old)
        if n == 0:
            problems.append(f"NO-MATCH {rel}: {old[:60]!r}")
            continue
        new = new.replace(old, repl)
    json.loads(new)
    f.write_text(new, encoding="utf-8")
    print(f"patched {rel}")

if problems:
    print("\n".join(problems))
    sys.exit(1)
print("ALL PATCHES APPLIED")

#!/usr/bin/env python3
import json
from pathlib import Path

p = Path(__file__).resolve().parents[1] / "sets" / "wave_03" / "P2_SET_218.json"
t = p.read_text(encoding="utf-8")
t = t.replace("expansion payback testing for the $2,400,000 investment",
              "expansion affordability testing for the $2,400,000 investment")
t = t.replace("accelerate sorting-line payback",
              "accelerate sorting-line throughput")
p.write_text(t, encoding="utf-8")
json.loads(t)
print("payback remaining:", t.count("payback"))

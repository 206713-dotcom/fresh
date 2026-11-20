import json
from pathlib import Path

p = Path(__file__).resolve().parents[1] / "sets" / "wave_04" / "P2_SET_251.json"
d = json.loads(p.read_text(encoding="utf-8"))
q = [x for x in d["questions"] if x["number"] == "3(b)"][0]
v = q["qwen_marking_keys"]["valid_app_words"]
v[v.index("$500")] = "capital employed"
p.write_text(json.dumps(d, indent=2, ensure_ascii=False), encoding="utf-8")
print("VAW now:", v)

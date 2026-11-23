import json
from pathlib import Path

p = Path(__file__).resolve().parents[1] / "sets" / "wave_04" / "P2_SET_251.json"
d = json.loads(p.read_text(encoding="utf-8"))
for q in d["questions"]:
    vaw = q["qwen_marking_keys"]["valid_app_words"]
    if len(vaw) > 8:
        print(q["number"], "trim", len(vaw), "->", 8)
        q["qwen_marking_keys"]["valid_app_words"] = vaw[:8]
p.write_text(json.dumps(d, indent=2, ensure_ascii=False), encoding="utf-8")
print("saved")

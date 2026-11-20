import json
from pathlib import Path
out = []
for sid in (187, 188, 189, 190, 195):
    p = Path(__file__).resolve().parents[1] / "sets" / "wave_03" / f"P2_SET_{sid}.json"
    d = json.loads(p.read_text(encoding="utf-8"))
    ins = d["case_study_insert"]
    out.append(f"===== {sid} =====")
    out.append("STEM: " + ins["main_stem"])
    out.append("A1: " + ins["appendix_1_marketing_ops"])
    out.append("A3: " + ins["appendix_3_external_environment"])
    out.append("")
    for q in d["questions"]:
        if q["number"] in ("1(a)", "2(a)", "2(b)", "4(a)"):
            out.append(q["number"] + " VAW: " + repr(q["qwen_marking_keys"]["valid_app_words"]))
    out.append("")
Path(__file__).with_name("dump_5.txt").write_text("\n".join(out), encoding="utf-8")
print("dump written")

import json, os

tmp = r"C:\Users\jayde\AppData\Local\Temp\opencode\u2c"
out = r"C:\Users\jayde\Documents\GitHub\fresh\subjects\business\tmp_shards\p12\U2-c.json"

items = []
for i in range(1, 5):
    p = os.path.join(tmp, f"U2-c-{i}.json")
    with open(p, encoding="utf-8") as f:
        chunk = json.load(f)
    print(os.path.basename(p), len(chunk))
    items.extend(chunk)

ids = [it["scenario_id"] for it in items]
assert len(ids) == 100, len(ids)
assert ids[0] == "P1_SET_4201" and ids[-1] == "P1_SET_4300"
# contiguous ids 4201..4300
nums = [int(x.split("_")[-1]) for x in ids]
assert nums == list(range(4201, 4301)), "ids not contiguous"

os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, "w", encoding="utf-8") as f:
    f.write(json.dumps(items, indent=2, ensure_ascii=False))
    f.write("\n")

print("WROTE", out, "items=", len(items))

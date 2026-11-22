import json
p = "tmp_shards/p1/U2-c.json"
d = json.load(open(p, encoding="utf-8"))
print(len(d), d[0]["scenario_id"], d[-1]["scenario_id"])
print([x["scenario_id"] for x in d[24:50]])

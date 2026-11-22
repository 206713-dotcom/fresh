import json, re
d = json.load(open('src/lib/data/paper1-database.json', encoding='utf-8'))
names = []
for s in d:
    stem = s.get('scenario_stem', '')
    m = re.match(r"([A-Z][A-Za-z&.'\-]*(?:\s+[A-Z][A-Za-z&.'\-]*){0,3})\s+(?:Ltd|Co|Plc|Inc|Corp|GmbH|LLC|Limited)\b", stem)
    if m:
        names.append(m.group(1))
print('total named:', len(names))
low = set(x.lower() for x in names)
checks = ['Nakuru','Lisbon','Cebu','Bergen','Pune','Oaxaca','Tangier','Medellin','Aarhus','Ghent']
for n in names:
    if any(w.lower() in n.lower() for w in checks):
        print('COLLISION?', n)
print('SAMPLE:')
for n in names[:40]:
    print(' ', n)

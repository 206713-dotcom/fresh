import json
from pathlib import Path

base = Path('tmp_shards/p12')
chunks = ['_chunks/U2-c-1.json', '_chunks/U2-c-2.json',
          '_chunks/U2-c-3.json', '_chunks/U2-c-4.json']
items = []
for c in chunks:
    data = json.loads((base / c).read_text(encoding='utf-8'))
    items.extend(data)
out = base / 'U2-c.json'
out.write_text(json.dumps(items, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
print('wrote', out, 'items', len(items))
print('first', items[0]['scenario_id'], 'last', items[-1]['scenario_id'])

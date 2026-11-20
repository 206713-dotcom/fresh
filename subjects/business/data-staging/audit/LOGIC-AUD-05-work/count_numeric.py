import json,re,collections
items=json.load(open('data-staging/audit/LOGIC-AUD-05-work/all_items.json',encoding='utf-8'))
NUMSTART=re.compile(r'^[-+]?\$?\d')
def numeric_answer(s):
    s=str(s).strip()
    return bool(NUMSTART.match(s)) and len(s)<90
calc=[x for x in items if any(numeric_answer(v) for v in x['options'].values())]
print('items with >=1 numeric-looking option:', len(calc))
for k,v in sorted(collections.Counter(x['chapter'] for x in calc).items()): print('  ',k,v)
keycalc=[x for x in items if numeric_answer(x['correctAnswer'])]
print('\nitems with NUMERIC keyed answer:', len(keycalc))
for k,v in sorted(collections.Counter(x['chapter'] for x in keycalc).items()): print('  ',k,v)

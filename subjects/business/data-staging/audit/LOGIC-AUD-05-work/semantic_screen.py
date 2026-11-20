import json,re,collections
items=json.load(open('data-staging/audit/LOGIC-AUD-05-work/all_items.json',encoding='utf-8'))

# 1) distribution of wrong-option reason openings
openings=collections.Counter()
for x in items:
    co=x['correctOption']; dr=x['explanation']['distractor_reasons']
    for k in 'ABCD':
        if k==co: continue
        r=dr[k].strip()
        m=re.match(r'([A-Z][a-z]+|\([^)]*\)|[^ ]+)',r)
        openings[m.group(1) if m else '']+=1
print('Top wrong-option reason openings:')
for w,c in openings.most_common(20): print(f'  {w!r}: {c}')

# 2) suspicious keyed options (absolutes / very short)
ABS=re.compile(r'\b(never|always|no |none|zero|identical|impossible|do not|does not|did not|cannot|can\'t|without any|eliminate all|all )\b',re.I)
susp=[]
for x in items:
    key=x['correctAnswer']
    lens=[len(v) for k,v in x['options'].items()]
    if ABS.search(key) or len(key)<min(l for l in lens if l>0):
        susp.append((x['id'],x['chapter'],key[:90],{k:v[:50] for k,v in x['options'].items()}))
print('\nSuspicious keyed options (absolute language or shortest option):',len(susp))
for s in susp[:40]:
    print('\n###',s[0],'|',s[1]); print('KEY:',s[2]); print('OPTS:',s[3])

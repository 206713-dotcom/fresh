import json, re, collections
items=json.load(open('data-staging/audit/LOGIC-AUD-05-work/all_items.json',encoding='utf-8'))

# 1) correct_reason letter prefix consistency
pref_mismatch=[]
no_prefix=[]
for x in items:
    co=x['correctOption']; cr=x['explanation']['correct_reason']
    m=re.match(r'\s*Option\s+([A-D])\b', cr)
    if not m:
        no_prefix.append(x['id'])
    elif m.group(1)!=co:
        pref_mismatch.append((x['id'],co,m.group(1),cr[:80]))
print('correct_reason "Option X" prefix mismatches:', len(pref_mismatch))
for p in pref_mismatch[:20]: print('  ',p)
print('correct_reason with no Option-prefix:', len(no_prefix))

# 2) wrong-option reason says "Correct" suspicious
wrong_says_correct=[]
for x in items:
    co=x['correctOption']; dr=x['explanation']['distractor_reasons']
    for k in 'ABCD':
        if k==co: continue
        r=dr.get(k,'')
        if re.match(r'\s*Correct\b', r) and 'incorrect' not in r.lower():
            wrong_says_correct.append((x['id'],k,r[:90]))
print('\nwrong-option reason starting "Correct":', len(wrong_says_correct))
for p in wrong_says_correct[:20]: print('  ',p)

# 3) numeric census: question contains digits
numeric=[x for x in items if re.search(r'\d', x['question'])]
print('\nquestions containing digits:', len(numeric))
# by chapter
bych=collections.Counter((x['section'],x['chapter']) for x in numeric)
for k,v in sorted(bych.items()): print('  ',k,v)

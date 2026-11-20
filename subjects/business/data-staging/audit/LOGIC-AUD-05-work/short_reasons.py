import json,re,itertools
items=json.load(open('data-staging/audit/LOGIC-AUD-05-work/all_items.json',encoding='utf-8'))
STOP=set('the a an is are was were be been being that this these those of to in on for with and or but by as at from it its their our your his her they he she we you i which who whose what when where why how do does did not no so than then there here can could would should will may might must about into over under more most other such only also incorrect because'.split())
def toks(s):return set(w for w in re.findall(r'[a-z]{3,}',s.lower()) if w not in STOP)
# shortest wrong reasons
rows=[]
for x in items:
    co=x['correctOption']
    for k in 'ABCD':
        if k==co:continue
        r=x['explanation']['distractor_reasons'][k]
        rows.append((len(r),x['id'],k,r,x['options'][k][:60]))
rows.sort()
print('=== 30 shortest wrong-option reasons ===')
for r in rows[:30]:
    print(f'{r[0]:3d} {r[1]} [{r[2]}] reason={r[3]!r} opt={r[4]!r}')
# near-duplicate options within item (jaccard>0.8)
dup=[]
for x in items:
    for a,b in itertools.combinations('ABCD',2):
        ta,tb=toks(x['options'][a]),toks(x['options'][b])
        if not ta or not tb:continue
        j=len(ta&tb)/len(ta|tb)
        if j>0.8:
            dup.append((x['id'],a,b,round(j,2),x['options'][a][:60],x['options'][b][:60],x['correctOption']))
print('\n=== near-duplicate option pairs (jaccard>0.8):',len(dup),'===')
for d in dup[:30]: print(d)

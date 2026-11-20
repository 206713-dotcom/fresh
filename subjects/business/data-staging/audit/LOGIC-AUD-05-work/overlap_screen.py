import json,re,collections
items=json.load(open('data-staging/audit/LOGIC-AUD-05-work/all_items.json',encoding='utf-8'))
STOP=set('the a an is are was were be been being that this these those of to in on for with and or but by as at from it its their our your his her they he she we you i which who whose what when where why how do does did not no so than then there here can could would should will may might must about into over under more most other such only also'.split())
def toks(s):
    return set(w for w in re.findall(r'[a-z]{4,}',s.lower()) if w not in STOP)
flag=[]
for x in items:
    co=x['correctOption']
    cr=x['explanation']['correct_reason']
    cr=re.sub(r'^Option\s+[A-D]\s+is correct because\s*','',cr)
    ct=toks(cr)
    if len(ct)<4: continue
    scores={k:len(ct & toks(v))/max(1,len(ct|toks(v))) for k,v in x['options'].items()}
    ranked=sorted(scores,key=lambda k:-scores[k])
    best=ranked[0]; second=ranked[1]
    if best!=co and scores[best] > scores.get(co,0)+0.04 and scores[best]>0.12:
        flag.append((x['id'],x['chapter'],co,best,round(scores.get(co,0),2),round(scores[best],2),
                     x['correctAnswer'][:70], x['options'][best][:70], cr[:170]))
print('items where reason overlaps a distractor more than key:',len(flag))
for f in flag[:60]:
    print('\n###',f[0],'|',f[1]); print('KEY=',f[2],f[6]); print('BEST=',f[3],f[7],'| scores key',f[4],'best',f[5]); print('CR:',f[8])

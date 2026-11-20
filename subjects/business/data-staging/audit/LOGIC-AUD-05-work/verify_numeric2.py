import json,re,itertools

items=json.load(open('data-staging/audit/LOGIC-AUD-05-work/all_items.json',encoding='utf-8'))
NUMSTART=re.compile(r'^[-+]?\$?\d')
NUMRE=re.compile(r'(?<![\w])[-+]?\$?(\d[\d,]*(?:\.\d+)?)\s*(%)?')
def numeric_answer(s):
    s=str(s).strip(); return bool(NUMSTART.match(s)) and len(s)<90
def extract(text):
    res=[]
    for m in NUMRE.finditer(text or ''):
        v=float(m.group(1).replace(',',''))
        res.append((v,bool(m.group(2)) or '%' in m.group(0)))
    return res
def close(a,b): return abs(a-b)<=max(0.02,0.004*abs(b))
OPS=(lambda x,y:x+y,lambda x,y:x-y,lambda x,y:x*y,lambda x,y:(x/y if y else None))
def results(vals):
    cur=list(dict.fromkeys(round(v,6) for v in vals))[:40]
    res=set(cur)
    for _ in range(2):
        nxt=set()
        for a,b in itertools.permutations(cur,2):
            for f in OPS:
                try:r=f(a,b)
                except:continue
                if r is not None and abs(r)<1e12:
                    nxt.add(round(r,6))
                    if len(nxt)>40000: break
            if len(nxt)>40000: break
        nxt-=res
        nxt=list(nxt)[:1500]
        res|=set(nxt); cur=nxt
    return res
flag=[]
numkey=[x for x in items if numeric_answer(x['correctAnswer'])]
for x in numkey:
    ans=str(x['correctAnswer']); ae=extract(ans); av=ae[0][0] if ae else None
    qe=extract(x['question']); qvals=[v for v,_ in qe]
    qexp=list(qvals)+[v/100 for v,ip in qe if ip]
    cands=results(qexp)
    deriv = av is not None and any(close(av,c) or close(av,c*100) or close(av,c/100) for c in cands)
    present = av is not None and any(close(av,c) for c,_ in extract(x['explanation']['correct_reason']))
    if not deriv or not present:
        flag.append((x['id'],x['chapter'],x['question'][:120],ans[:45],x['explanation']['correct_reason'][:220],qvals,'deriv='+str(deriv),'present='+str(present)))
print('numeric-key items:',len(numkey),' FLAGGED:',len(flag))
for f in flag:
    print('\n###',f[0],'|',f[1])
    print('Q:',f[2]); print('KEY:',f[3]); print('CR:',f[4])
    print('stem nums:',f[5],'|',f[6],f[7])

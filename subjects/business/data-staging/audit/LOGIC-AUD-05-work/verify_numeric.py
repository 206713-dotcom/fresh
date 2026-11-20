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
        ispct=bool(m.group(2)) or '%' in m.group(0)
        res.append((v,ispct))
    return res
def close(a,b): return abs(a-b)<=max(0.02,0.003*abs(b))
def deriv(vals, ans):
    cands=set()
    for a,b in itertools.permutations(vals,2):
        for f in (lambda x,y:x+y,lambda x,y:x-y,lambda x,y:x*y,lambda x,y:x/y if y else None):
            try:r=f(a,b)
            except:continue
            if r is not None and abs(r)<1e12:cands.add(round(r,6))
    if any(close(a,ans) for a in cands):return 'pair'
    for a,b,c in itertools.permutations(vals,3):
        for op1 in (lambda x,y:x+y,lambda x,y:x-y,lambda x,y:x*y,lambda x,y:x/y if y else None):
            try:r1=op1(a,b)
            except:continue
            if r1 is None:continue
            for op2 in (lambda x,y:x+y,lambda x,y:x-y,lambda x,y:x*y,lambda x,y:x/y if y else None):
                try:r=op2(r1,c)
                except:continue
                if r is not None and abs(r)<1e12 and close(r,ans):return 'triple'
    return None

flag=[]
numkey=[x for x in items if numeric_answer(x['correctAnswer'])]
for x in numkey:
    q=x['question']; cr=x['explanation']['correct_reason']; ans=str(x['correctAnswer'])
    ae=extract(ans); av=ae[0][0] if ae else None
    qe=extract(q); cre=extract(cr)
    qvals=[v for v,_ in qe]
    qexp=list(qvals)+[v/100 for v,ip in qe if ip]
    d=deriv(qexp,av) if av is not None else None
    present=any(close(av,c) for c,_ in cre) if av is not None else False
    if d is None or not present:
        flag.append((x['id'],x['chapter'],q[:130],ans[:40],cr[:200],qvals,'deriv='+str(d),'present='+str(present)))
print('numeric-key items:',len(numkey),' FLAGGED:',len(flag))
for f in flag:
    print('\n###',f[0],'|',f[1])
    print('Q:',f[2])
    print('KEY:',f[3])
    print('CR:',f[4])
    print('stem nums:',f[5],'|',f[6],f[7])

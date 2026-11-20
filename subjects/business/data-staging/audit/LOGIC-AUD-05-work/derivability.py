import json, re, itertools, collections

items=json.load(open('data-staging/audit/LOGIC-AUD-05-work/all_items.json',encoding='utf-8'))

NUMRE = re.compile(r'(?<![\w])[-+]?\$?(\d[\d,]*(?:\.\d+)?)\s*(%)?')

def nums(text):
    out=[]
    for m in NUMRE.finditer(text or ''):
        v=float(m.group(1).replace(',',''))
        if m.group(2): v=v/100.0
        # capture if there's a % sign after in raw text (handled) 
        out.append(v)
    return out

def extract(text):
    res=[]
    for m in NUMRE.finditer(text or ''):
        raw=m.group(0)
        v=float(m.group(1).replace(',',''))
        ispct = bool(m.group(2)) or '%' in raw
        res.append((v,ispct,raw.strip()))
    return res

def close(a,b):
    if a is None or b is None: return False
    return abs(a-b) <= max(0.02, 0.003*abs(b))

def cand_results(vals):
    res=set()
    for a,b in itertools.permutations(vals,2):
        for f in (lambda x,y:x+y, lambda x,y:x-y, lambda x,y:x*y,
                  lambda x,y:x/y if y else None):
            try: r=f(a,b)
            except: r=None
            if r is not None and abs(r)<1e12: res.add(round(r,6))
    return res

numeric_flags=[]
no_result=[]
for x in items:
    q=x['question']; cr=x['explanation']['correct_reason']
    ans=str(x['correctAnswer']); co=x['correctOption']
    qe=extract(q); cre=extract(cr); ae=extract(ans)
    if not qe: continue
    if not ae: continue  # non-numeric answer
    # answer numeric values (skip percentages that are part of words like "30% vs 15%"? keep)
    avals=[v for v,ip,raw in ae]
    # Does answer value appear in correct_reason?
    crvals=[v for v,ip,raw in cre]
    present=any(close(a,c) for a in avals for c in crvals)
    if not present:
        no_result.append((x['id'],x['chapter'],ans[:80],cr[:160]))
    # Derivability from stem numbers
    qvals=[v for v,ip,raw in qe]
    # include percentage-decimal forms
    expanded=list(qvals)
    for v,ip,raw in qe:
        if ip: expanded.append(v/100.0)
    cands=cand_results(expanded)
    # 3-number combos (a op b) op c
    cands3=set()
    for a,b,c in itertools.permutations(expanded,3):
        for op1 in (lambda x,y:x+y, lambda x,y:x-y, lambda x,y:x*y, lambda x,y:x/y if y else None):
            for op2 in (lambda x,y:x+y, lambda x,y:x-y, lambda x,y:x*y, lambda x,y:x/y if y else None):
                try:
                    r1=op1(a,b)
                    if r1 is None: continue
                    r=op2(r1,c)
                except: continue
                if r is not None and abs(r)<1e12: cands3.add(round(r,6))
    deriv=any(close(a,c) for a in avals for c in (cands|cands3))
    if not deriv:
        numeric_flags.append((x['id'],x['chapter'],q[:140],ans[:80],cr[:180],qvals))

print('items: answer value NOT present in correct_reason:', len(no_result))
for r in no_result[:25]:
    print('  ',r)
print()
print('items: answer NOT derivable from stem numbers (brute force):', len(numeric_flags))

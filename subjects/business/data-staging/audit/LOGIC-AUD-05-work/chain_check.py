import json,re,ast,collections

items=json.load(open('data-staging/audit/LOGIC-AUD-05-work/all_items.json',encoding='utf-8'))

def prep(t):
    t=t.replace('\u00d7','*').replace('\u00f7','/').replace('\u2212','-').replace('\u2013','-').replace('\u00b7','*')
    t=t.replace('$','').replace(',','')
    t=re.sub(r'(?<=\d)\s*x\s*(?=\d)','*',t,flags=re.I)
    t=re.sub(r'(?<=\d)\s*X\s*(?=\d)','*',t)
    for w in ['divided by','multiplied by','times','plus','minus']:
        rep={'divided by':'/','multiplied by':'*','times':'*','plus':'+','minus':'-'}[w]
        t=re.sub(r'(?<=\d)\s*'+w+r'\s*(?=[\d(])',' '+rep+' ',t,flags=re.I)
    t=re.sub(r'(?<=\d)\s*%\s*of\s*(?=[\d($])','/100*',t,flags=re.I)
    t=re.sub(r'(?<=\d)\s*%','/100',t)
    # result markers -> '='
    for w in ['equals','equal to','giving','gives','is','totalling','totals','results in','leaving','leaves','of']:
        pass
    t=re.sub(r'\b(equals|equal to|giving|gives|totalling|totals|results in)\b','=',t,flags=re.I)
    # 'is' only when between digit and digit/number context
    t=re.sub(r'(?<=\d)\s+is\s+(?=[\d(+-])','=',t,flags=re.I)
    return t

def safe_eval(e):
    e=re.sub(r'[^0-9\.\+\-\*/\(\) ]','',e)
    e=re.sub(r'\s+',' ',e).strip()
    if not e or not re.search(r'\d',e):return None
    try:
        return eval(compile(ast.parse(e,mode='eval'),'<s>','eval'),{'__builtins__':{}},{})
    except Exception:
        return None

# find chains: EXPR = RESULT
CHAIN=re.compile(r'([0-9][0-9\.\+\-\*/\(\) ]{0,90}?)\s*=\s*([-+]?\d+(?:\.\d+)?)\s*%?')

def close(a,b):return abs(a-b)<=max(0.02,0.005*abs(b))

mism=[]; checked=0; peritem=collections.defaultdict(list)
for x in items:
    cr=x['explanation']['correct_reason']
    p=prep(cr)
    for m in CHAIN.finditer(p):
        lhs=m.group(1); rhs=float(m.group(2))
        lv=safe_eval(lhs)
        if lv is None: continue
        checked+=1
        peritem[x['id']].append((lhs.strip(),lv,rhs))
        if not close(lv,rhs):
            mism.append((x['id'],x['chapter'],lhs.strip(),lv,rhs,cr[:200]))

print('equations evaluated:',checked,'across',len(peritem),'items')
print('MISMATCHES:',len(mism))
for m in mism:
    print('\n###',m[0],'|',m[1])
    print(' LHS:',m[2],'=>',m[3],' RHS:',m[4])
    print(' CR:',m[5])

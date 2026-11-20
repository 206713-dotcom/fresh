import json, re, ast, collections

items=json.load(open('data-staging/audit/LOGIC-AUD-05-work/all_items.json',encoding='utf-8'))

def norm_text(t):
    return (t.replace('\u2212','-').replace('\u00d7','x').replace('\u00f7','/')
             .replace('\u00b7','x').replace('\u2013','-').replace('\u2014','-'))

NUM = r'[-+]?\$?\d[\d,]*(?:\.\d+)?'
OP  = r'[\+\-x\*/]'
# equation: NUMBER (OP NUMBER)+ = NUMBER
EQ_RE = re.compile(rf'({NUM}(?:\s*{OP}\s*{NUM})+\s*=\s*{NUM})')
# percent-of: NUMBER% of NUMBER = NUMBER
PCT_RE = re.compile(rf'({NUM})\s*%\s*of\s*({NUM})\s*=\s*({NUM})', re.I)

def tofloat(s):
    s=s.replace('$','').replace(',','').strip()
    if s in ('','+','-'): return None
    return float(s)

def sanitize(expr):
    # keep only digits, operators, parens, dot, comma(removed), spaces
    e=expr.replace('$','').replace(',','').replace('x','*').replace('X','*')
    e=re.sub(r'[^0-9\.\+\-\*/\(\) ]','',e)
    e=re.sub(r'\s+',' ',e).strip()
    return e

def eval_expr(expr):
    s=sanitize(expr)
    if not s or not re.search(r'\d',s): return None
    try:
        node=ast.parse(s, mode='eval')
        return eval(compile(node,'<s>','eval'), {'__builtins__':{}}, {})
    except Exception:
        return None

def close(a,b):
    if a is None or b is None: return False
    return abs(a-b) <= max(0.011, 0.002*abs(b))

mismatches=[]
expr_count=0
per_item_expr={}
for x in items:
    cr=norm_text(x['explanation']['correct_reason'])
    # find equations
    spans=[]
    for m in EQ_RE.finditer(cr):
        spans.append(('eq',m.group(1)))
    for m in PCT_RE.finditer(cr):
        spans.append(('pct',(m.group(1),m.group(2),m.group(3))))
    if not spans: continue
    per_item_expr[x['id']]=len(spans)
    for typ,val in spans:
        expr_count+=1
        if typ=='eq':
            e=val
            # split on = (last one)
            parts=e.split('=')
            lhs='='.join(parts[:-1]); rhs=parts[-1]
            lv=eval_expr(lhs); rv=tofloat(rhs)
            if lv is None or rv is None: continue
            if not close(lv,rv):
                mismatches.append((x['id'],e,f'LHS={lv}',f'RHS={rv}', x['chapter'], cr[:160]))
        else:
            p,b,r=val
            pv=tofloat(p.replace('%','')); bv=tofloat(b); rv=tofloat(r)
            if None in (pv,bv,rv): continue
            lv=pv/100*bv
            if not close(lv,rv):
                mismatches.append((x['id'],f'{p} of {b} = {r}',f'LHS={lv}',f'RHS={rv}', x['chapter'], cr[:160]))

print('total extracted expressions:', expr_count)
print('items with >=1 explicit equation:', len(per_item_expr))
print('MISMATCHES:', len(mismatches))
for m in mismatches:
    print('---')
    print(' id:',m[0],'| ch:',m[4])
    print(' expr:',m[1],'|',m[2],m[3])
    print(' cr:',m[5])

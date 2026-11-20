import json, re, collections

with open('data-staging/audit/LOGIC-AUD-05-work/all_items.json', encoding='utf-8') as f:
    items = json.load(f)

BOILER = ["Examiner guidance:", "0450", "mark schemes penalise vague or colloquial phrasing"]

def norm(s):
    return re.sub(r'\s+', ' ', str(s).strip().lower())

generic_patterns = [
    r'^incorrect( calculation| arithmetic| mathematical calculation)?\.?$',
    r'^this option is incorrect\.?$',
    r'^wrong\.?$',
    r'^incorrect answer\.?$',
    r'^no[, ]+.*$',  # too broad, skip
]

def is_generic(s):
    t = norm(s)
    for p in generic_patterns[:5]:
        if re.match(p, t):
            return True
    return False

flags = collections.defaultdict(list)

for x in items:
    iid = x['id']
    opts = x.get('options') or {}
    co = x.get('correctOption')
    ca = x.get('correctAnswer')
    exp = x.get('explanation') or {}
    cr = exp.get('correct_reason') or ''
    dr = exp.get('distractor_reasons') or {}

    # GATE 4 boilerplate (whole item)
    blob = json.dumps(x, ensure_ascii=False)
    for b in BOILER:
        if b in blob:
            flags['boilerplate'].append((iid, f'found "{b}"'))

    # GATE 2 key
    if co not in ('A','B','C','D'):
        flags['key_option'].append((iid, f'correctOption={co!r}'))
    if set(opts.keys()) != {'A','B','C','D'}:
        flags['key_optkeys'].append((iid, f'option keys={sorted(opts.keys())}'))
    if co in opts and opts.get(co) != ca:
        flags['key_mismatch'].append((iid, f'options[{co}]={opts.get(co)!r} != correctAnswer={ca!r}'))
    vals = [norm(v) for v in opts.values()]
    if len(vals) != len(set(vals)):
        # list which duplicate
        dup = [v for v,c in collections.Counter(vals).items() if c>1]
        flags['key_duplicate'].append((iid, f'duplicate option values: {dup}'))
    # correctAnswer appears among distractors textually?
    if ca is not None:
        others = [v for k,v in opts.items() if k!=co]
        for v in others:
            if norm(v)==norm(ca):
                flags['key_dup_correct_in_distractor'].append((iid, f'distractor equals correct answer text'))

    # GATE 3 explanation
    if len(str(cr).strip()) < 20:
        flags['exp_correct_short'].append((iid, f'correct_reason len={len(str(cr).strip())}'))
    if set(dr.keys()) != {'A','B','C','D'}:
        flags['exp_dr_keys'].append((iid, f'dr keys={sorted(dr.keys())}'))
    if co in dr and dr.get(co) != cr:
        flags['exp_correct_mismatch'].append((iid, f'dr[{co}] != correct_reason'))
    for k in 'ABCD':
        if k==co: continue
        r = dr.get(k)
        if r is None:
            flags['exp_wrong_missing'].append((iid, f'missing reason for {k}'))
            continue
        if len(str(r).strip()) < 20:
            flags['exp_wrong_short'].append((iid, f'{k} reason len={len(str(r).strip())}'))
        if is_generic(r):
            flags['exp_wrong_generic'].append((iid, f'{k}: {r!r}'))

for k in sorted(flags):
    print(f'=== {k}: {len(flags[k])} ===')
    for iid,msg in flags[k][:15]:
        print('  ', iid, '|', msg)
    if len(flags[k])>15: print('   ... and', len(flags[k])-15, 'more')

# unique ids per flag
print('\n=== SUMMARY unique items per gate ===')
for gate, keys in [('boilerplate',['boilerplate']),('key',['key_option','key_optkeys','key_mismatch','key_duplicate','key_dup_correct_in_distractor']),('explanation',['exp_correct_short','exp_dr_keys','exp_correct_mismatch','exp_wrong_missing','exp_wrong_short','exp_wrong_generic'])]:
    s=set()
    for kk in keys:
        s.update(i for i,_ in flags[kk])
    print(gate, len(s))

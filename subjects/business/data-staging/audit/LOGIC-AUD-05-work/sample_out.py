import json,re,random
items=json.load(open('data-staging/audit/LOGIC-AUD-05-work/all_items.json',encoding='utf-8'))
NUMSTART=re.compile(r'^[-+]?\$?\d')
def numeric_answer(s):
    s=str(s).strip(); return bool(NUMSTART.match(s)) and len(s)<90
numkey=[x for x in items if numeric_answer(x['correctAnswer'])]
random.seed(42)
sample=random.sample(numkey,40)
# also phrases with numbers in key
phrase=[x for x in items if re.search(r'\d',x['correctAnswer']) and not numeric_answer(x['correctAnswer']) and re.search(r'\d',x['question'])]
print('phrase-answer numeric items:',len(phrase))
sample+=random.sample(phrase,12)
for x in sample:
    print('\n========',x['id'],'|',x['chapter'])
    print('Q:',x['question'])
    for k in 'ABCD': print(' ',k+':',x['options'][k])
    print('KEY:',x['correctOption'],'=>',x['correctAnswer'])
    print('CR:',x['explanation']['correct_reason'])

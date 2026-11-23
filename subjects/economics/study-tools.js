
/* Browser-local study plans, diagram exercises and exam summaries. */
const studyTopicName = code => officialSyllabusChapters.flatMap(chapter=>chapter.topics).find(topic=>topic.code===code)?.title || code;

function mockRows(state) {
  if (state.mode === 'p1') {
    return state.ids.flatMap(id => {
      const q = revisionQuestion(id);
      return q ? [{topic:q.topic, max:1, score:Number(state.answers[id] === String(q.answer))}] : [];
    });
  }
  return revisionWrittenItems(state).map(({key,marks,topic}) => {
    const submitted = hasMockResponse(state,key);
    return {topic,max:marks,score:state.grades?.[key]?.score ?? (submitted ? null : 0)};
  });
}

function mockSummary(state) {
  const rows = mockRows(state);
  const topics = {}, markTypes = {};
  for (const row of rows) {
    for (const [key, group] of [[row.topic,topics],[row.max,markTypes]]) {
      const item = group[key] ??= {earned:0,max:0,pending:0};
      if (row.score === null) item.pending += row.max;
      else { item.earned += row.score; item.max += row.max; }
    }
  }
  return {id:state.attemptId || 'previous-' + state.mode, mode:state.mode, paper:state.paper, at:state.completedAt ?? null,
    score:rows.reduce((sum,r)=>sum+(r.score??0),0), max:state.mode === 'p2' ? 80 : rows.reduce((sum,r)=>sum+r.max,0),
    pending:rows.filter(r=>r.score===null).reduce((sum,r)=>sum+r.max,0), topics, markTypes,
    ids:state.mode==='p1'?state.ids:[], evidence:state.evidence, corrections:snapshotMockCorrections(state)};
}

function fixedMockKey({mode, paper}) {
  if ((mode === 'p1' || mode === 'p2') && paper > 0) return mode + '-' + paper;
  return mode === 'p2' ? 'p2-original' : null;
}

function retainMockHistory(history) {
  // Keep the 30 most recent attempts plus the latest result for every fixed paper.
  const seen = new Set();
  return history.filter((item, index) => {
    const key = fixedMockKey(item);
    const firstForPaper = key && !seen.has(key);
    if (key) seen.add(key);
    return index < 30 || firstForPaper;
  });
}

function completedFixedMocks() {
  return new Set(mockHistory().map(fixedMockKey).filter(Boolean));
}

function mockHistory() {
  const history = revisionState('mock-history', []);
  const current = revisionState('test', null);
  const saved = Array.isArray(history) ? history : [];
  if (!current?.finished || !['p1','p2'].includes(current.mode)) return saved;
  const snapshot = mockSummary(current);
  return retainMockHistory([snapshot, ...saved.filter(item => item.id !== snapshot.id)]);
}

function archiveMock(state) {
  if (!state?.finished || !['p1','p2'].includes(state.mode)) return true;
  const snapshot = mockSummary(state);
  return saveRevisionState('mock-history', retainMockHistory([snapshot, ...mockHistory().filter(item => item.id !== snapshot.id)]));
}

function mockHistoryView() {
  const history = mockHistory();
  return revisionHeading('Exam practice','Mock exam history','Review your submitted mocks saved in this browser.') +
    (history.length ? history.map(item => {
      const topicRows = Object.entries(item.topics).sort((a,b)=>(b[1].max-b[1].earned)-(a[1].max-a[1].earned));
      const types = Object.entries(item.markTypes).sort((a,b)=>Number(a[0])-Number(b[0]));
      const score = row => row.earned + '/' + row.max + (row.pending ? ' · '+row.pending+' marks awaiting marking' : '');
      const date = item.at ? new Date(item.at).toLocaleString() : 'Earlier attempt';
      const summary = item.max===item.pending ? 'Awaiting marks' : item.score+'/'+(item.max-item.pending)+(item.pending?' marked so far':'');
      return '<details class="panel mock-history-entry"><summary><strong>'+revisionMockLabel(item.mode,item.paper)+'</strong> · '+
        escapeHtml(date)+' · '+summary+(item.pending?' · '+item.pending+' marks pending':'')+
        '</summary><h2>Marks by topic</h2><ul>'+topicRows.map(([code,row])=>'<li>'+escapeHtml(studyTopicName(code))+' · '+score(row)+' '+
          link('Practise this topic','#practice/topic/'+code,'text-link')+'</li>').join('')+
        '</ul><h2>Marks by question type</h2><ul>'+types.map(([type,row])=>'<li>'+type+'-mark questions · '+score(row)+'</li>').join('')+'</ul>'+link('Open corrections',mockCorrectionHref(item),'text-link')+'</details>';
    }).join('') : '<p class="panel">Finished Paper 1 and Paper 2 mocks will appear here.</p>')+
    link('Open test builder','#revision-test');
}

function suggestStudy() {
  const attempts = readPracticeAnswers();
  const mistakes = revisionState('mistakes', {});
  const reviewed = revisionState('reviewed-questions', []);
  const seen = new Set([...reviewed,...mockHistory().flatMap(mock=>mock.ids)]);
  const gaps = new Map();
  const add = (topic, lost) => { if (topic && lost>0) gaps.set(topic,(gaps.get(topic)??0)+lost); };
  for (const q of questions) {
    const saved = attempts[q.id];
    if (saved?.answer) seen.add(q.id);
    if (q.options && (mistakes[q.id] || (saved?.feedback && saved.answer!==String(q.answer)))) add(q.topic,1);
    if (!q.options && Number.isInteger(saved?.score)) add(q.topic,q.marks-saved.score);
  }
  for (const id of Object.keys(mistakes)) if (id.startsWith('topic-')) add(id.slice(6),1);
  for (const [topic,row] of Object.entries(mockHistory()[0]?.topics ?? {})) add(topic,row.max-row.earned);
  const candidates = [...gaps.keys()].sort((a,b)=>gaps.get(b)-gaps.get(a));
  const order = [...new Set([...candidates,...revisionLab.topics.map(topic=>topic.code)])];
  for (const topic of order) {
    const q = questions.find(q=>q.options && q.topic===topic && !seen.has(q.id));
    const lesson = syllabusTopicLessons(topic).find(l=>flashcardDecks[l.id]?.length);
    if (q && lesson) return {topic,question:q.id,lesson:lesson.id,step:0,card:0,revealed:false,misses:gaps.get(topic)??0};
  }
  return null;
}

function studyQueue() {
  const plan = revisionState('study-queue',null) ?? suggestStudy();
  const q = plan && questions.find(q=>q.id===plan.question && q.options);
  const lesson = plan && lessons.find(l=>l.id===plan.lesson);
  if (!q || !lesson) return revisionHeading('Your revision','10-minute review','Open a practice topic to keep revising.')+
    link('Browse practice','#practice');
  const topic = revisionLab.topics.find(topic=>topic.code===plan.topic);
  const deck = flashcardDecks[lesson.id];
  const limit = Math.min(3,deck.length);
  const actions = '<p id="revision-save-status" role="status"></p>';
  let body;
  if (plan.step===0) {
    body = '<h2>1. Recap</h2><p>'+escapeHtml(topic?.summary ?? lesson.title)+'</p>'+
      '<div class="row">'+link('Read the full lesson','#lesson/'+lesson.id)+'<button type="button" class="primary" data-review-action="cards">Start flashcards</button></div>';
  } else if (plan.step===1) {
    const card = deck[plan.card];
    body = '<h2>2. Recall · '+(plan.card+1)+'/'+limit+'</h2><p>'+escapeHtml(card[0])+'</p>'+
      (plan.revealed?'<p class="feedback">'+escapeHtml(card[1])+'</p>':'')+
      '<button type="button" class="primary" data-review-action="'+(plan.revealed?'advance':'reveal')+'">'+
      (plan.revealed?(plan.card+1===limit?'Start knowledge check':'Next card'):'Reveal answer')+'</button>';
  } else if (plan.step===2) {
    body = '<h2>3. Check your understanding</h2><form id="study-review-check"><p>'+escapeHtml(q.q)+'</p>'+
      (q.case?'<p>'+escapeHtml(q.case)+'</p>':'')+
      q.options.map((option,i)=>'<label class="choice"><input name="answer" type="radio" value="'+i+'" required> '+escapeHtml(option)+'</label>').join('')+
      '<button class="primary">Check answer</button></form>';
  } else {
    const outcome = mcqOutcome(plan.answer,q.answer);
    body = '<h2>Review complete</h2><div class="feedback" data-outcome="'+outcome+'">'+outcomeBadge(outcome)+
      '<p>Correct answer · '+escapeHtml(q.options[q.answer])+'</p><p>'+escapeHtml(q.why ?? '')+'</p></div>'+
      '<div class="row"><button class="primary" type="button" data-review-action="new">Start another review</button>'+
      link('Practise '+studyTopicName(plan.topic),'#practice/topic/'+plan.topic)+'</div>';
  }
  return revisionHeading('Your revision','10-minute review',escapeHtml(studyTopicName(plan.topic))+
    (plan.misses?' · Revisit this topic based on marks missed in recent work':' · Suggested syllabus topic'))+
    '<section class="panel" id="study-queue" data-question="'+escapeHtml(plan.question)+'">'+body+actions+'</section>';
}

function setupStudyQueue() {
  const panel = document.querySelector('#study-queue');
  if (!panel) return;
  const plan = revisionState('study-queue', null) ?? suggestStudy();
  if (!plan || plan.question !== panel.dataset.question) return;
  const save = () => { if (saveRevisionState('study-queue',plan)) render(); };
  saveRevisionState('study-queue',plan);
  panel.onclick = event => {
    const action = event.target.closest('[data-review-action]')?.dataset.reviewAction;
    if (!action) return;
    if (action==='new') { if (saveRevisionState('study-queue',null)) render(); return; }
    if (action==='cards') plan.step=1;
    if (action==='reveal') plan.revealed=true;
    if (action==='advance') {
      plan.card++;
      plan.revealed=false;
      if (plan.card>=Math.min(3,flashcardDecks[plan.lesson].length)) plan.step=2;
    }
    save();
  };
  const form = panel.querySelector('form');
  if (form) form.onsubmit = event => {
    event.preventDefault();
    const answer = new FormData(form).get('answer');
    if (answer===null) return;
    const q = questions.find(q=>q.id===plan.question);
    if (!saveRevisionState('reviewed-questions',[...new Set([...revisionState('reviewed-questions',[]),q.id])])) return;
    recordRevisionMistake(q.id,q.q,'#revision-retry/'+q.id,answer!==String(q.answer));
    plan.answer=answer;
    plan.step=3;
    save();
  };
}

const diagramExercises = [
  {id:'drought',name:'Supply falls',topic:'2.5',kind:'market',prompt:'A drought damages the vegetable harvest. Show the effect on the market for vegetables.', shift:'s-left', point:[4,6]},
  {id:'demand',name:'Demand rises',topic:'2.5',kind:'market',prompt:'A health campaign makes vegetables more popular. Show the effect on the market for vegetables.', shift:'d-right', point:[6,6]},
  {id:'growth',name:'PPC expands',topic:'1.4',kind:'ppc',prompt:'Better technology makes it possible to produce more of both capital goods and consumer goods. Show the effect on the PPC and locate the labelled output combination.',shift:'out',point:[8,8],classification:'inside'},
  {id:'loss',name:'PPC contracts',topic:'1.4',kind:'ppc',prompt:'A flood destroys productive resources used to make both capital goods and consumer goods. Show the effect on the PPC and locate the labelled output combination.',shift:'in',point:[6,6],classification:'outside'}
];
function diagramPlot(exercise, values) {
  const x=n=>56+n*34,y=n=>365-n*24;
  const line=(d,style)=>'<path class="'+style+'" d="'+d+'" fill="none"/>';
  const straight=(x1,y1,x2,y2)=>'M'+x(x1)+' '+y(y1)+'L'+x(x2)+' '+y(y2);
  const ppc=n=>'M'+x(0)+' '+y(n)+'Q'+x(n*.81)+' '+y(n*.81)+' '+x(n)+' '+y(0);
  const market=exercise.kind==='market';
  const demand=shift=>straight(0,10+shift,10+shift,0);
  const supply=shift=>straight(Math.max(0,shift),Math.max(0,-shift),Math.min(14,14+shift),Math.min(14,14-shift));
  const shift=values.shift;
  let curves=market ? line(demand(0),'diagram-demand')+line(supply(0),'diagram-supply') : line(ppc(10),'diagram-ppc');
  if (market && shift?.startsWith('d-')) curves+=line(demand(shift==='d-right'?2:-2),'diagram-shift');
  if (market && shift?.startsWith('s-')) curves+=line(supply(shift==='s-left'?-2:2),'diagram-shift');
  if (!market && ['out','in'].includes(shift)) curves+=line(ppc(shift==='out'?14:7),'diagram-shift');
  const grid=Array.from({length:15},(_,i)=>line(straight(i,0,i,14),'diagram-grid')+
    line(straight(0,i,14,i),'diagram-grid')+'<text x="'+x(i)+'" y="386" text-anchor="middle">'+i+'</text>'+
    (i?'<text x="44" y="'+(y(i)+4)+'" text-anchor="end">'+i+'</text>':'')).join('');
  const point=market ? (values.q!==''&&values.p!==''&&values.q!=null&&values.p!=null?[Number(values.q),Number(values.p)]:null) : exercise.point;
  const xAxis=values.xAxis||'Horizontal axis',yAxis=values.yAxis||'Vertical axis';
  return '<svg viewBox="0 0 570 420" role="img" aria-label="'+escapeHtml(yAxis+' against '+xAxis+
    (point?' with a point at '+point.join(', '):''))+'">'+grid+
    line('M56 21V365H538','diagram-axis')+curves+
    (point&&point.every(n=>Number.isFinite(n)&&n>=0&&n<=14)?'<circle cx="'+x(point[0])+'" cy="'+y(point[1])+
      '" r="6" class="diagram-point"/><text x="'+(x(point[0])+9)+'" y="'+(y(point[1])-9)+'">'+(market?'E':'A')+'</text>':'')+
    '<text x="58" y="20">'+escapeHtml(yAxis)+'</text><text x="294" y="410" text-anchor="middle">'+escapeHtml(xAxis)+'</text></svg>';
}
function diagramCorrect(exercise) {
  return exercise.kind==='market'
    ? {xAxis:'Quantity',yAxis:'Price',shift:exercise.shift,q:String(exercise.point[0]),p:String(exercise.point[1])}
    : {xAxis:'Consumer goods',yAxis:'Capital goods',shift:exercise.shift,classification:exercise.classification};
}
function diagramPractice(id) {
  const exercise=diagramExercises.find(item=>item.id===id) ?? diagramExercises[0];
  const market=exercise.kind==='market';
  const selectField=(name,label,options)=>'<label class="field">'+label+'<select name="'+name+
    '" required><option value="">Choose…</option>'+options.map(([value,text])=>
      '<option value="'+escapeHtml(value)+'">'+escapeHtml(text)+'</option>').join('')+'</select></label>';
  const axes=(market?['Quantity','Price']:['Consumer goods','Capital goods']).map(word=>[word,word]);
  const shifts=market?[['d-right','Demand shifts right'],['d-left','Demand shifts left'],['s-right','Supply shifts right'],['s-left','Supply shifts left']]:
    [['out','PPC shifts outwards'],['in','PPC shifts inwards'],['none','PPC does not shift']];
  return revisionHeading('Interactive practice','Diagram practice','Build your diagram and get feedback on each step.')+
    '<nav class="row" aria-label="Diagram exercises">'+diagramExercises.map(item=>
      '<a class="button'+(item===exercise?' primary':'')+'" href="#revision-diagrams/'+item.id+'"'+
      (item===exercise?' aria-current="page"':'')+'>'+escapeHtml(item.name)+'</a>').join('')+'</nav>'+
    '<div class="diagram-workspace"><form id="diagram-exercise" class="panel" data-exercise="'+exercise.id+'"><h2>'+escapeHtml(exercise.name)+'</h2><p>'+escapeHtml(exercise.prompt)+'</p>'+
    (!market?'<p>Put consumer goods on the horizontal axis and capital goods on the vertical axis. Classify point A relative to the new PPC.</p>':'')+
    selectField('xAxis','Horizontal axis',axes)+selectField('yAxis','Vertical axis',axes)+selectField('shift','Curve change',shifts)+
    (market?'<p>Click the graph to place the new equilibrium, or enter its coordinates.</p>'+
      '<div class="row"><label class="field">Quantity at E<input name="q" type="number" min="0" max="14" required></label>'+
      '<label class="field">Price at E<input name="p" type="number" min="0" max="14" required></label></div>':
      selectField('classification','Where is point A?',[['inside','Inside · attainable but inefficient'],['on','On · productively efficient'],['outside','Outside · currently unattainable']]))+
    '<div class="row"><button class="primary">Check diagram</button><button type="reset">Reset</button></div>'+
    '<div id="diagram-feedback" role="status"></div><button type="button" id="diagram-solution" hidden>Show correct diagram</button></form>'+
    '<figure class="panel diagram-figure"><div id="diagram-plot">'+diagramPlot(exercise,{})+'</div><figcaption>'+
    (market?'Blue · original demand. Mint · original supply. Purple · your shifted curve.':'Blue · original PPC. Purple · your shifted PPC.')+
    '</figcaption></figure></div><p>'+link('Draw a PPC from scratch','#revision-diagram-draw/growth')+'</p>';
}
function setupDiagramPractice() {
  const form=document.querySelector('#diagram-exercise');
  if (!form) return;
  const exercise=diagramExercises.find(item=>item.id===form.dataset.exercise);
  const plot=document.querySelector('#diagram-plot');
  const feedback=form.querySelector('#diagram-feedback');
  const solution=form.querySelector('#diagram-solution');
  const values=()=>Object.fromEntries(new FormData(form));
  const draw=()=>{plot.innerHTML=diagramPlot(exercise,values());};
  const clear=()=>{feedback.innerHTML=''; solution.hidden=true;};
  form.oninput=()=>{clear(); draw();};
  form.onreset=()=>{clear(); window.setTimeout(draw,0);};
  if(exercise.kind==='market') plot.onclick=event=>{
    const svg=plot.querySelector('svg');
    const point=svg.createSVGPoint();
    point.x=event.clientX; point.y=event.clientY;
    const matrix=svg.getScreenCTM();
    if(!matrix) return;
    const p=point.matrixTransform(matrix.inverse());
    if(p.x<50||p.x>538||p.y<21||p.y>372) return;
    form.elements.q.value=String(Math.min(14,Math.max(0,Math.round((p.x-56)/34))));
    form.elements.p.value=String(Math.min(14,Math.max(0,Math.round((365-p.y)/24))));
    clear(); draw();
  };
  form.onsubmit=event=>{
    event.preventDefault();
    const actual=values(),expected=diagramCorrect(exercise);
    const checks=[
      ['Axis labels',actual.xAxis===expected.xAxis&&actual.yAxis===expected.yAxis],
      ['Curve and shift',actual.shift===expected.shift],
      [exercise.kind==='market'?'New equilibrium':'Point A',exercise.kind==='market'?
        Number(actual.q)===Number(expected.q)&&Number(actual.p)===Number(expected.p):actual.classification===expected.classification]
    ];
    feedback.innerHTML='<h3>'+checks.filter(([,pass])=>pass).length+' of 3 steps correct</h3><ul>'+
      checks.map(([label,pass])=>'<li>'+outcomeBadge(pass?'correct':'incorrect')+' '+label+'</li>').join('')+'</ul>';
    solution.hidden=false;
  };
  solution.onclick=()=>{
    const expected=diagramCorrect(exercise);
    for(const [key,value] of Object.entries(expected)) form.elements.namedItem(key).value=value;
    draw();
    feedback.innerHTML='<p>Showing the correct diagram and values.</p>';
    solution.hidden=true;
  };
}

function creditedEvidence(answer, grade) {
  if (typeof answer!=='string') return [];
  return (grade?.credits ?? []).flatMap(credit=>{
    if (typeof credit.evidence!=='string' || !credit.evidence.trim()) return [];
    const query=credit.evidence.trim().split(/\s+/).map(part=>part.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('\\s+');
    const match=new RegExp(query,'i').exec(answer);
    if (!match) return [];
    const {0:snippet,index:start}=match;
    const end = start+snippet.length;
    if ((/\p{L}|\p{N}/u.test(snippet[0]) && /[\p{L}\p{N}]/u.test(answer[start-1]??'')) ||
        (/[\p{L}\p{N}]/u.test(snippet.at(-1)) && /[\p{L}\p{N}]/u.test(answer[end]??''))) return [];
    return [{start,end,criterion:credit.criterion,snippet:answer.slice(start,end)}];
  });
}

function markedEvidence(answer, grade) {
  const claims = creditedEvidence(answer,grade);
  if(!claims.length)return '';
  const ranges = claims.slice().sort((a,b)=>a.start-b.start).reduce((merged,current)=>{
    const last=merged.at(-1);
    if (last && current.start<=last.end) last.end=Math.max(last.end,current.end);
    else merged.push({...current});
    return merged;
  },[]);
  let pos=0, highlighted='';
  for (const {start,end} of ranges) {
    highlighted+=escapeHtml(answer.slice(pos,start))+'<mark>'+escapeHtml(answer.slice(start,end))+'</mark>';
    pos=end;
  }
  highlighted+=escapeHtml(answer.slice(pos));
  return '<h4>Wording that earned marks</h4><p class="mark-scheme">'+highlighted+'</p><ul>'+
    claims.map(c=>'<li><strong>'+escapeHtml(c.criterion)+'</strong> · “'+escapeHtml(c.snippet)+'”</li>').join('')+'</ul>';
}

function saveWritingVersion(id,answer,grade) {
  const key='writing-'+id;
  const versions=revisionState(key,[]);
  if (versions.at(-1)?.answer===answer && versions.at(-1)?.grade) return true;
  return saveRevisionState(key,[...versions,{answer,grade}].slice(-12));
}

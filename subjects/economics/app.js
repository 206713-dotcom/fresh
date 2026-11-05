const main = document.querySelector('main');
const notesUrl = 'https://www.savemyexams.com/igcse/economics/cie/25/revision-notes/';
const syllabus = 'https://www.cambridgeinternational.org/Images/718148-2027-2029-syllabus.pdf';
const papers = 'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-economics-0455/past-papers/';
const lessons = catalog.flatMap((chapter, index) => chapter.groups.flatMap(group => group.lessons.map(lesson => ({...lesson, chapter:index}))));
const icons = ['◒','⇄','▦','▥','↗','◎','✎'];
const colors = ['#e2e9ff','#ffe5d5','#e9e3ff','#ffebc9','#dceef4','#fbe0e8'];
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[char]);
const link = (label, href, cls = 'button') => '<a class="' + cls + '" href="' + escapeHtml(href) + '">' + escapeHtml(label) + '</a>';
const heading = (label, title, desc) => '<div class="eyebrow">' + label + '</div><h1 class="page-title">' + title + '</h1><p class="muted">' + desc + '</p>';
const pad = n => String(n).padStart(2,'0');
const heroArt = '<svg class="hero-art" viewBox="0 0 460 300" aria-hidden="true"><defs><pattern id="grid" width="27" height="27" patternUnits="userSpaceOnUse"><path d="M27 0H0V27" fill="none" stroke="#53649d" stroke-width=".7"/></pattern></defs><rect x="40" y="18" width="392" height="252" rx="19" fill="#263972" stroke="#6479b5"/><rect x="58" y="35" width="356" height="218" fill="url(#grid)"/><path d="M86 62v164h303" fill="none" stroke="#aebfe9"/><path d="M94 82c84 9 170 72 279 122" fill="none" stroke="#ffd2ab" stroke-width="3"/><path d="M94 207c88-15 161-72 274-134" fill="none" stroke="#93b7ff" stroke-width="3"/><path d="M231 143v83M86 143h145" stroke="#aebfe9" stroke-dasharray="4 5"/><circle cx="231" cy="143" r="8" fill="#ffd2ab" stroke="#263972" stroke-width="3"/><g fill="#dde6ff" font-family="system-ui" font-size="11" letter-spacing="1"><text x="91" y="57">PRICE</text><text x="308" y="246">QUANTITY</text><text x="246" y="139">EQUILIBRIUM</text></g></svg>';
function tiles(includeExam) {
  return '<div class="grid">' + catalog.slice(0,includeExam ? catalog.length : 6).map((c,i) => '<a class="tile" style="--tone:'+ (colors[i] || colors[0]) +'" href="#chapter/'+i+'"><span class="icon" aria-hidden="true">'+icons[i]+'</span><div class="tile-copy"><h3>'+escapeHtml(c.title)+'</h3><small>'+ (i<6 ? 'CHAPTER '+pad(i+1) : 'EXAM SKILLS') +' · '+lessons.filter(l=>l.chapter===i).length+' lessons</small></div><span class="arrow" aria-hidden="true">→</span></a>').join('')+'</div>';
}
function home() {
  return '<section class="hero"><div class="hero-copy"><div class="eyebrow">IGCSE ECONOMICS / FIRST EXAMS 2027</div><h1>Economics<br><em>revision.</em></h1><p>Find your next lesson, test your recall, and practise answering economics questions.</p><div class="actions">'+link('Browse lessons →','#library','button primary')+link('Practice questions','#practice','button ghost')+'</div></div>'+heroArt+'</section><div class="band"><span><strong>6</strong> chapters</span><span><strong>'+lessons.length+'</strong> lessons with notes</span><span><strong>'+(Object.values(flashcardDecks).flat().length + supplementaryGlossary.length)+'</strong> flashcards</span><span><strong>'+questions.length+'</strong> original questions</span></div><section><div class="section-head"><div><div class="eyebrow">Course library</div><h2>Explore the chapters</h2></div>'+link('Syllabus coverage','#syllabus')+link('All lessons ↗','#library')+'</div>'+tiles(false)+'</section>';
}
function library() {
  return heading('Course library','Lessons','Browse by chapter or search the lesson index.')+'<label class="field">Find a lesson<input id="search" type="search" placeholder="Try demand or inflation"></label><div id="results">'+tiles(true)+'</div>';
}
function lessonLink(l) {
  return '<a class="lesson-link" href="#lesson/'+l.id+'"><span>'+escapeHtml(l.title)+'</span><small>'+(flashcardDecks[l.id] ? 'Notes + cards' : 'Source lesson')+' ↗</small></a>';
}
function chapter(index) {
  const c = catalog[index];
  if (!c) return home();
  return '<p class="crumb"><a href="#library">Lessons</a> / '+(index < 6 ? 'Chapter '+pad(index+1) : 'Exam skills')+'</p>'+heading('Course library',escapeHtml(c.title),'Choose a lesson to open its study page.')+c.groups.map(g=>'<section class="group"><h2>'+escapeHtml(g.title)+'</h2>'+g.lessons.map(lessonLink).join('')+'</section>').join('');
}
function diagram(shift) {
  return '<figure><svg class="figure" viewBox="0 0 380 235" role="img" aria-label="'+(shift?'A PPC shifting outward increases productive capacity.':'A point inside the PPC is attainable with idle resources. A point on the curve is efficient. A point outside the curve is unattainable.')+'"><path d="M55 35v155h285" stroke="#394d80" stroke-width="2" fill="none"/><path d="M55 63C151 68 236 97 258 190" stroke="#304eb0" stroke-width="3" fill="none"/>'+ (shift ? '<path d="M55 43C182 42 288 72 310 190" stroke="#a34920" stroke-width="3" fill="none"/><text x="257" y="88">New PPC</text><text x="202" y="146">Original PPC</text>' : '<circle cx="112" cy="144" r="5" fill="#304eb0"/><text x="123" y="148">Inside</text><circle cx="211" cy="113" r="5" fill="#304eb0"/><text x="174" y="133">On curve</text><circle cx="266" cy="74" r="5" fill="#a34920"/><text x="277" y="78">Outside</text>')+'<text x="50" y="24">Output A</text><text x="280" y="211">Output B</text></svg><figcaption class="muted">'+(shift?'An outward shift makes more combinations attainable.':'Where a point lies relative to the PPC shows what the economy can produce.')+'</figcaption></figure>';
}
function revisionNotes(id) {
  const [title, ...paragraphs] = explanations[id];
  const points = lessonPoints[id] || foundationPoints[id];
  const worked = workedNotes[id];
  const detail = syllabusNotes[id];
  const detailedSection = detail ? '<section class="syllabus-detail"><p class="eyebrow">Cambridge 0455 · '+escapeHtml(detail.codes.join(' · '))+'</p><h2>'+escapeHtml(detail.title)+'</h2>'+detail.paragraphs.map(p=>'<p>'+escapeHtml(p)+'</p>').join('')+(id===2879?equilibriumSchedule():'')+syllabusVisuals(id)+'</section>' : '';
  return '<article class="panel revision-notes"><section><h2>'+escapeHtml(title)+'</h2>'+paragraphs.map(paragraph=>'<p>'+escapeHtml(paragraph)+'</p>').join('')+lessonVisual(id)+'</section>'+
    detailedSection+'<section class="remember"><h2>Key points to remember</h2><ul>'+points.map(([label,description])=>'<li><strong>'+escapeHtml(label)+'</strong><p>'+escapeHtml(description)+'</p></li>').join('')+'</ul></section>'+
    (worked ? '<section class="worked-note"><h2>'+escapeHtml(worked[0])+'</h2><p>'+escapeHtml(worked[1])+'</p></section>' : '')+
    '</article>';
}
function lesson(id, cardsMode) {
  const l = lessons.find(l=>l.id===id);
  if (!l) return library();
  const cards = flashcardDecks[id];
  return '<p class="crumb"><a href="#library">Lessons</a> / <a href="#chapter/'+l.chapter+'">'+escapeHtml(catalog[l.chapter].title)+'</a></p>'+heading('Lesson',escapeHtml(l.title),cards?'Read the explanation, review the key points and test your recall.':'Open the corresponding Save My Exams lesson for the full notes.')+
  (cards ? '<div class="tabs">'+link('Revision notes','#lesson/'+id)+link('Flashcards ('+cards.length+')','#lesson/'+id+'/cards')+'</div>' + (cardsMode ? '<section class="panel" id="deck"></section>' : revisionNotes(id)) : '')+
  '<div class="row">'+link('Open Save My Exams ↗',l.url||notesUrl)+'</div>';
}
function flashcards() {
  return heading('Active recall','Flashcards','Choose a deck to practise online or export it as a CSV.')+'<section class="group"><h2>Glossary</h2><p>Definition cards for syllabus topics are in the matching lessons. Additional ZNotes terms are grouped separately.</p>'+link('Supplementary glossary · '+supplementaryGlossary.length+' cards','#glossary')+'</section>'+catalog.map((c,index)=>'<details class="group" '+(index===0?'open':'')+'><summary>'+escapeHtml(c.title)+'</summary>'+lessons.filter(l=>l.chapter===index).map(l=>'<a class="lesson-link" href="#lesson/'+l.id+'/cards"><span>'+escapeHtml(l.title)+'</span><small>'+flashcardDecks[l.id].length+' cards ↗</small></a>').join('')+'</details>').join('');
}
function glossary() {
  return heading('Extra vocabulary','Supplementary glossary','This deck includes additional terms from the supplied glossary. Use the lesson decks for Cambridge 0455 syllabus revision.')+
    '<section class="panel" id="deck"></section><div class="row">'+link('Back to lesson decks','#flashcards')+
    link('ZNotes glossary ↗','https://znotes.org/caie/igcse/economics-0455/definitions/definitions')+'</div>';
}
function setupDeck(id) {
  const deck = document.querySelector('#deck');
  if (!deck) return;
  const cards = id === 'glossary' ? supplementaryGlossary : flashcardDecks[id];
  let index=0, flipped=false;
  deck.innerHTML='<p class="eyebrow counter" aria-live="polite"></p><button class="flash" type="button"></button><div class="row" style="margin-top:16px"><button data-step="-1">← Previous</button><button data-step="1">Next →</button><button id="export">Download CSV</button></div>';
  const flash=deck.querySelector('.flash');
  const stepButtons=[...deck.querySelectorAll('[data-step]')];
  function update() {
    deck.querySelector('.counter').textContent='Card '+(index+1)+' of '+cards.length;
    flash.innerHTML='<small>'+(flipped?'Answer · click to see prompt':'Prompt · click to reveal')+'</small><span class="flash-text">'+escapeHtml(cards[index][Number(flipped)])+'</span>';
    stepButtons[0].disabled=index===0;
    stepButtons[1].disabled=index===cards.length-1;
  }
  flash.onclick=()=>{flipped=!flipped;update()};
  stepButtons.forEach(button=>button.onclick=()=>{index+=Number(button.dataset.step);flipped=false;update();if(button.disabled)flash.focus()});
  deck.querySelector('#export').onclick=()=>{
    const csv=[['Question','Answer'],...cards].map(row=>row.map(cell=>'"'+cell.replaceAll('"','""')+'"').join(',')).join('\r\n');
    const url=URL.createObjectURL(new Blob(['\ufeff',csv],{type:'text/csv;charset=utf-8'}));
    const a=document.createElement('a');
    a.href=url;
    a.download='ecbiz-'+id+'.csv';
    a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  update();
}
function practice(chapterIndex) {
  return heading('Original practice','Practice Questions','2,490 questions from your supplied practice bank, organised by syllabus chapter.')+
    '<div class="grid practice-chapters">'+catalog.slice(0,6).map((chapter,i)=>'<a class="tile" href="#practice/'+i+'"><div><strong>Chapter '+(i+1)+'</strong><h3>'+escapeHtml(chapter.title)+'</h3><small>415 questions · 300 MCQs · 115 structured</small></div></a>').join('')+'</div>'+
    '<div class="row"><label class="field">Chapter<select id="filter-chapter"><option value="">All chapters</option>'+catalog.slice(0,6).map((chapter,i)=>'<option value="'+i+'" '+(chapterIndex===i?'selected':'')+'>'+escapeHtml(chapter.title)+'</option>').join('')+'</select></label>'+
    '<label class="field">Topic<select id="filter-topic"></select></label><label class="field">Question type<select id="filter-type"><option value="">All types</option><option value="mcq">MCQ · Paper 1</option><option value="structured">Structured · Paper 2</option></select></label>'+
    '<label class="field">Marks<select id="filter-marks"><option value="">All marks</option>'+[1,2,4,6,8].map(m=>'<option value="'+m+'">'+m+'</option>').join('')+'</select></label></div>'+
    '<p class="muted">MCQs score automatically. Submit a structured answer to reveal its supplied mark scheme and record your self-assessed score.</p>'+
    '<p id="question-count" class="muted" aria-live="polite"></p><div id="questions"></div><div class="row pagination" id="question-pages"></div>';
}
function setupPractice() {
  const chapter=document.querySelector('#filter-chapter');
  if (!chapter) return;
  const topic=document.querySelector('#filter-topic');
  const type=document.querySelector('#filter-type');
  const marks=document.querySelector('#filter-marks');
  const target=document.querySelector('#questions');
  const pages=document.querySelector('#question-pages');
  const attempts=new Map();
  let page=0;
  const size=8;

  function renderTopics() {
    const topics=new Map(questions.filter(q=>chapter.value===''||q.c===Number(chapter.value)).map(q=>[q.topic,q.topicName]));
    topic.innerHTML='<option value="">All topics</option>'+[...topics].map(([code,name])=>'<option value="'+code+'">'+code+' · '+escapeHtml(name)+'</option>').join('');
  }
  function renderQuestions() {
    const matches=questions.map((q,i)=>({q,i})).filter(({q})=>
      (chapter.value===''||q.c===Number(chapter.value))&&
      (!topic.value||q.topic===topic.value)&&
      (!type.value||type.value===(q.options?'mcq':'structured'))&&
      (!marks.value||q.marks===Number(marks.value)));
    const start=page*size;
    const end=Math.min(start+size,matches.length);
    document.querySelector('#question-count').textContent=matches.length?'Showing '+(start+1)+'–'+end+' of '+matches.length+' questions':'No questions match these filters.';
    target.innerHTML=matches.slice(start,end).map(({q,i})=>{
      const saved=attempts.get(i)||{};
      const answer=saved.answer||'';
      return '<form class="panel" data-question="'+i+'"><div class="eyebrow">Chapter '+(q.c+1)+' · '+q.topic+' · '+q.marks+' '+(q.marks===1?'mark':'marks')+'</div><p class="question-id">'+escapeHtml(q.id)+'</p>'+
        (q.case?'<div class="case-study"><strong>Case study</strong><p>'+escapeHtml(q.case)+'</p></div>':'')+
        '<h2>'+escapeHtml(q.q)+'</h2>'+
        (q.options?q.options.map((option,j)=>'<label class="choice"><input type="radio" name="answer" value="'+j+'" '+(answer===String(j)?'checked':'')+' required><strong>'+String.fromCharCode(65+j)+'.</strong> '+escapeHtml(option)+'</label>').join(''):'<label class="field">Your answer<textarea name="answer" required>'+escapeHtml(answer)+'</textarea></label>')+
        '<button class="primary">'+(q.options?'Check answer':'Submit and view mark scheme')+'</button><div class="feedback" role="status" '+(saved.feedback?'':'hidden')+'>'+(saved.feedback||'')+'</div></form>';
    }).join('');
    pages.innerHTML=matches.length>size?'<button data-page="-1" '+(page===0?'disabled':'')+'>← Previous page</button><span>Page '+(page+1)+' of '+Math.ceil(matches.length/size)+'</span><button data-page="1" '+(end===matches.length?'disabled':'')+'>Next page →</button>':'';
  }
  function reset() {page=0;renderQuestions()}
  renderTopics();
  chapter.onchange=()=>{renderTopics();reset()};
  topic.onchange=type.onchange=marks.onchange=reset;
  pages.onclick=event=>{
    const button=event.target.closest('[data-page]');
    if (!button) return;
    page+=Number(button.dataset.page);
    renderQuestions();
    target.scrollIntoView({block:'start'});
  };
  target.oninput=event=>{
    const form=event.target.closest('form');
    if(!form)return;
    const index=Number(form.dataset.question);
    if(event.target.matches('[data-score]')) {
      const state=attempts.get(index);
      const value=event.target.value;
      form.querySelector('.self-score-result').textContent=value===''?'':'Self-assessed score · '+value+'/'+questions[index].marks;
      if(state)state.feedback=form.querySelector('.feedback').innerHTML.replace(/<option value="(\d+)"(?: selected)?/g,(match,n)=>'<option value="'+n+'"'+(n===value?' selected':''));
      return;
    }
    attempts.set(index,{answer:event.target.value});
    form.querySelector('.feedback').hidden=true;
  };
  target.onsubmit=event=>{
    event.preventDefault();
    const form=event.target;
    const index=Number(form.dataset.question);
    const q=questions[index];
    const answer=String(new FormData(form).get('answer')??'').trim();
    if(!answer)return;
    const feedback=form.querySelector('.feedback');
    feedback.hidden=false;
    feedback.innerHTML=q.options
      ? '<strong>'+(Number(answer)===q.answer?'Correct · 1/1':'0/1 · Correct answer '+String.fromCharCode(65+q.answer))+'</strong><p>'+escapeHtml(q.why)+'</p>'
      : '<strong>Supplied mark scheme · '+q.marks+' marks</strong><div class="mark-scheme">'+escapeHtml(q.scheme)+'</div>'+
        (q.note?'<p><strong>Marking guidance</strong></p><p>'+escapeHtml(q.note)+'</p>':'')+
        '<label class="field">Your self-assessed mark<select data-score><option value="">Choose a score</option>'+Array.from({length:q.marks+1},(_,n)=>'<option value="'+n+'">'+n+'</option>').join('')+'</select></label><p class="self-score-result"></p>';
    attempts.set(index,{answer,feedback:feedback.innerHTML});
  };
  renderQuestions();
}
function syllabusGuide() {
  const entries = Object.entries(syllabusNotes);
  const codes = [...new Set(entries.flatMap(([,note])=>note.codes))];
  return heading('Cambridge 0455 · 2027–2029','Syllabus coverage',codes.length+' numbered subject-content requirements mapped to the EcBiz notes.')+
    '<div class="row">'+link('Official syllabus PDF ↗',syllabus)+link('Official Cambridge course page ↗','https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-economics-0455/')+'</div>'+
    catalog.slice(0,6).map((chapter,index)=>'<section class="group"><h2>'+escapeHtml(chapter.title)+'</h2>'+codes.filter(code=>code.startsWith((index+1)+'.')).map(code=>{
      const matches = entries.filter(([,note])=>note.codes.includes(code));
      return '<div class="coverage-row"><strong>'+code+'</strong><div>'+matches.map(([id])=>link(lessons.find(lesson=>lesson.id===Number(id)).title,'#lesson/'+id,'coverage-link')).join('')+'</div></div>';
    }).join('')+'</section>').join('')+
    '<section class="group"><h2>Assessment guidance</h2>'+lessons.filter(lesson=>lesson.chapter===6).map(lessonLink).join('')+'</section>';
}
function sources() {
  return heading('Reference desk','Sources and coverage','Use the source lessons for full coverage and the official papers to practise under exam conditions.')+'<article class="panel"><h2>Lesson library</h2><p>All '+lessons.length+' indexed lessons include concise notes, downloadable flashcards and a link to Save My Exams for further reading.</p>'+link('Save My Exams lesson index ↗',notesUrl)+'<h2>Cambridge 0455 from 2027</h2><ul><li>Paper 1 · Multiple choice · 40 marks · 1 hour</li><li>Paper 2 · Structured questions · 80 marks · 2 hours</li></ul><p>The practice bank contains '+questions.length+' questions imported from the supplied original practice file. MCQs use its answer keys. Structured questions provide the supplied mark schemes for self-assessment. Cambridge publishes selected past papers, official mark schemes and specimen materials.</p><div class="row">'+link('Syllabus coverage','#syllabus')+link('Official syllabus ↗',syllabus)+link('Papers and mark schemes ↗',papers)+'</div></article>';
}
function render() {
  const [page='home', id, mode] = location.hash.slice(1).split('/');
  const routes={home,library,chapter:()=>chapter(Number(id)),lesson:()=>lesson(Number(id),mode==='cards'),flashcards,glossary,practice:()=>practice(id===undefined?null:Number(id),Number(mode)),syllabus:syllabusGuide,sources};
  main.innerHTML='<div class="wrap">'+(Object.hasOwn(routes,page)?routes[page]:home)()+'</div>';
  const active=page==='glossary'?'flashcards':page==='chapter'||page==='lesson'?(mode==='cards'?'flashcards':'library'):page||'home';
  document.querySelectorAll('.top nav a,.tabs a').forEach(a=>{
    const current=a.closest('.tabs')?a.hash===location.hash:a.hash==='#'+active;
    if(current)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
  });
  const search=document.querySelector('#search');
  if(search) search.oninput=()=>{
    const query=search.value.toLowerCase().trim();
    const matches=lessons.filter(l=>l.title.toLowerCase().includes(query));
    document.querySelector('#results').innerHTML=!query?tiles(true):matches.length?'<section class="group">'+matches.map(lessonLink).join('')+'</section>':'<p class="muted" role="status">No lessons match your search.</p>';
  };
  setupDeck(page==='glossary'?'glossary':Number(id));
  setupPractice();
}
window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0)});
render();

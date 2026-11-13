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
function tiles(includeExam) {
  return '<div class="grid">' + catalog.slice(0,includeExam ? catalog.length : 6).map((c,i) => '<a class="tile" style="--tone:'+ (colors[i] || colors[0]) +'" href="#chapter/'+i+'"><span class="icon" aria-hidden="true">'+icons[i]+'</span><div class="tile-copy"><h3>'+escapeHtml(c.title)+'</h3><small>'+ (i<6 ? 'CHAPTER '+pad(i+1) : 'EXAM SKILLS') +' · '+lessons.filter(l=>l.chapter===i).length+' lessons</small></div><span class="arrow" aria-hidden="true">→</span></a>').join('')+'</div>';
}
function home() {
  const tools = [
    ['▤','Chapter notes','Build understanding through clear explanations.','Start reading →','#library'],
    ['▣','Flashcards','Recall key concepts and strengthen memory.','Review cards →','#flashcards'],
    ['☑','Exam practice','Answer questions and review the supplied mark schemes.','Start practice →','#practice']
  ];
  return '<div class="eyebrow">EcBiz / The Economics Library</div><section class="editorial"><div class="hero-copy"><div class="eyebrow">Ideas worth understanding</div><h1>Understand the world.<br><em>One idea at a time.</em></h1><p class="muted">Read deeply, recall actively and practise confidently. Your Cambridge IGCSE Economics 0455 library for exams from 2027.</p>'+link('Explore the library ↗','#library','button primary')+'</div><div class="journal-art" aria-hidden="true"><small>The Economics Collection</small><b>E.</b><small>Learn / Recall / Apply</small></div></section><h2 class="paths-title">Three paths to understanding</h2><div class="study-tools">'+tools.map(([symbol,title,description,label,href])=>'<a class="study-tool" href="'+href+'"><span class="symbol" aria-hidden="true">'+symbol+'</span><strong>'+title+'</strong><span class="muted">'+description+'</span><em>'+label+'</em></a>').join('')+'</div><div class="band"><span><strong>6</strong> chapters</span><span><strong>'+lessons.length+'</strong> lessons with notes</span><span><strong>'+(Object.values(flashcardDecks).flat().length + supplementaryGlossary.length)+'</strong> flashcards</span><span><strong>'+questions.length+'</strong> original questions</span></div><section><div class="section-head"><div><div class="eyebrow">Course library</div><h2>Explore the chapters</h2></div><div class="row">'+link('Syllabus coverage','#syllabus')+link('All lessons ↗','#library')+'</div></div>'+tiles(false)+'</section>';
}
function studyHero(label, title, description, stats, kind) {
  return '<section class="study-hero"><div><p class="eyebrow">'+label+'</p><h1>'+title+'</h1><p class="study-intro">'+description+'</p><div class="study-stats">'+stats.map(([n,label])=>'<span><strong>'+n+'</strong> '+label+'</span>').join('')+'</div></div><div class="study-art '+kind+'" aria-hidden="true"><span class="art-orbit"></span><span class="art-sheet sheet-back"></span><span class="art-sheet sheet-front">'+(kind==='card-art'?'Q.<i>think it through.</i>':'E.<i>ideas into understanding.</i>')+'</span><small>'+(kind==='card-art'?'A little recall. A lot of progress.':'Your Economics study collection')+'</small></div></section>';
}
function chapterGallery() {
  return '<div class="chapter-collection">'+catalog.map((c,i)=>{
    const chapterLessons=lessons.filter(l=>l.chapter===i);
    return '<a class="chapter-cover" href="#chapter/'+i+'" style="--chapter-tint:'+(['#dcebe2','#f0e1cb','#dfe4ed','#e8dfeb','#e5e8ce','#f1dcd1','#e0e9e5'][i])+'"><div class="cover-top"><span class="cover-number">'+(i<6?pad(i+1):'✎')+'</span><span class="cover-arrow" aria-hidden="true">↗</span></div><div><small>'+(i<6?'Chapter '+(i+1):'The exam collection')+'</small><h2>'+escapeHtml(c.title)+'</h2></div><div class="cover-bottom"><span>'+chapterLessons.length+' lessons</span><span>Explore notes →</span></div></a>';
  }).join('')+'</div>';
}
function library() {
  return studyHero('The notes collection','Make every idea<br><em>make sense.</em>','Explore the course through clear explanations, key points and diagrams. Pick a chapter and settle into your next lesson.',[[6,'chapters'],[lessons.length,'lessons'],['2027–29','syllabus']],'notes-art')+'<section class="collection-toolbar"><div><p class="eyebrow">Find your next lesson</p><h2>Your Economics library</h2></div><label class="study-search"><span>Search lessons</span><input id="search" type="search" placeholder="Search demand, inflation, opportunity cost…"></label></section><div id="results">'+chapterGallery()+'</div>';
}
function lessonLink(l) {
  return '<a class="lesson-link" href="#lesson/'+l.id+'"><span>'+escapeHtml(l.title)+'</span><small>'+(flashcardDecks[l.id] ? 'Notes + cards' : 'Source lesson')+' ↗</small></a>';
}
function chapter(index) {
  const c = catalog[index];
  if (!c) return library();
  return '<p class="crumb"><a href="#library">Notes library</a><span>/</span>'+(index<6?'Chapter '+pad(index+1):'Exam skills')+'</p><header class="lesson-heading"><p class="eyebrow">'+(index<6?'Chapter '+pad(index+1):'Exam collection')+' · '+lessons.filter(l=>l.chapter===index).length+' lessons</p><h1>'+escapeHtml(c.title)+'</h1><p>Start with a lesson, then use its flashcards to make the ideas stick.</p></header><div class="chapter-lessons">'+c.groups.map((g,i)=>'<section class="chapter-topic"><div class="topic-heading"><span>'+pad(i+1)+'</span><h2>'+escapeHtml(g.title)+'</h2></div><div>'+g.lessons.map(lessonLink).join('')+'</div></section>').join('')+'</div>';
}
function diagram(shift) {
  return '<figure><svg class="figure" viewBox="0 0 380 235" role="img" aria-label="'+(shift?'A PPC shifting outward increases productive capacity.':'A point inside the PPC is attainable with idle resources. A point on the curve is efficient. A point outside the curve is unattainable.')+'"><path d="M55 35v155h285" stroke="#394d80" stroke-width="2" fill="none"/><path d="M55 63C151 68 236 97 258 190" stroke="#304eb0" stroke-width="3" fill="none"/>'+ (shift ? '<path d="M55 43C182 42 288 72 310 190" stroke="#a34920" stroke-width="3" fill="none"/><text x="257" y="88">New PPC</text><text x="202" y="146">Original PPC</text>' : '<circle cx="112" cy="144" r="5" fill="#304eb0"/><text x="123" y="148">Inside</text><circle cx="211" cy="113" r="5" fill="#304eb0"/><text x="174" y="133">On curve</text><circle cx="266" cy="74" r="5" fill="#a34920"/><text x="277" y="78">Outside</text>')+'<text x="50" y="24">Output A</text><text x="280" y="211">Output B</text></svg><figcaption class="muted">'+(shift?'An outward shift makes more combinations attainable.':'Where a point lies relative to the PPC shows what the economy can produce.')+'</figcaption></figure>';
}
function revisionNotes(id) {
  const [title, ...paragraphs] = explanations[id];
  const points = lessonPoints[id] || foundationPoints[id];
  const worked = workedNotes[id];
  const detail = syllabusNotes[id];
  const detailedSection = detail ? '<section class="syllabus-detail" id="note-syllabus"><p class="eyebrow">Cambridge 0455 · '+escapeHtml(detail.codes.join(' · '))+'</p><h2>'+escapeHtml(detail.title)+'</h2>'+detail.paragraphs.map(p=>'<p>'+escapeHtml(p)+'</p>').join('')+(id===2879?equilibriumSchedule():'')+syllabusVisuals(id)+'</section>' : '';
  return '<article class="panel revision-notes"><section id="note-overview"><h2>'+escapeHtml(title)+'</h2>'+paragraphs.map(paragraph=>'<p>'+escapeHtml(paragraph)+'</p>').join('')+lessonVisual(id)+'</section>'+
    detailedSection+'<section class="remember" id="note-key-points"><h2>Key points to remember</h2><ul>'+points.map(([label,description])=>'<li><strong>'+escapeHtml(label)+'</strong><p>'+escapeHtml(description)+'</p></li>').join('')+'</ul></section>'+
    (worked ? '<section class="worked-note" id="note-worked"><h2>'+escapeHtml(worked[0])+'</h2><p>'+escapeHtml(worked[1])+'</p></section>' : '')+
    '</article>';
}
function lesson(id, cardsMode) {
  const l=lessons.find(l=>l.id===id);
  if(!l)return library();
  const cards=flashcardDecks[id];
  const position=lessons.findIndex(item=>item.id===id);
  const sections=[['note-overview','The explanation'],...(syllabusNotes[id]?[['note-syllabus','Syllabus detail']]:[]),['note-key-points','Key points to remember'],...(workedNotes[id]?[['note-worked',workedNotes[id][0]]]:[])];
  const sibling=(item,direction)=>item?'<a class="lesson-sibling" href="#lesson/'+item.id+(cardsMode?'/cards':'')+'"><small>'+direction+'</small><span>'+escapeHtml(item.title)+'</span></a>':'<span></span>';
  return '<p class="crumb"><a href="#library">Notes library</a><span>/</span><a href="#chapter/'+l.chapter+'">'+escapeHtml(catalog[l.chapter].title)+'</a></p><header class="lesson-heading"><p class="eyebrow">'+(l.chapter<6?'Chapter '+pad(l.chapter+1):'Exam skills')+' · '+(cardsMode?'Active recall':'Revision notes')+'</p><h1>'+escapeHtml(l.title)+'</h1><p>'+(cardsMode?'A question at a time. Recall the answer, then turn the card to check.':'Read at your own pace. Follow the explanation, explore the diagrams and keep the key ideas close.')+'</p></header>'+
    (cards?'<div class="lesson-study-tabs tabs">'+link('▤  Revision notes','#lesson/'+id)+link('▣  Flashcards · '+cards.length,'#lesson/'+id+'/cards')+'</div>'+(cardsMode?'<div class="recall-layout"><section class="panel" id="deck"></section><aside class="recall-guide"><span class="mini-icon" aria-hidden="true">✦</span><p class="eyebrow">Make it stick</p><h2>Pause. Recall.<br>Then reveal.</h2><ol><li>Read the prompt.</li><li>Form your answer before flipping.</li><li>Check it, then move to the next card.</li></ol>'+link('Revisit the notes →','#lesson/'+id,'text-link')+'</aside></div>':'<div class="note-layout">'+revisionNotes(id)+'<aside class="study-aside"><p class="eyebrow">In this lesson</p><nav aria-label="On this page">'+sections.map(([target,title],i)=>'<button type="button" data-note-target="'+target+'"><span>'+pad(i+1)+'</span>'+escapeHtml(title)+'</button>').join('')+'</nav><div class="aside-recall"><span class="mini-icon" aria-hidden="true">▣</span><h2>Know it?<br>Test your recall.</h2><p>'+cards.length+' cards to help you remember this lesson.</p>'+link('Study flashcards →','#lesson/'+id+'/cards','button primary')+'</div>'+link('Practise this chapter ↗','#practice/'+l.chapter,'text-link')+'</aside></div>'):'')+
    '<div class="lesson-end"><div><span class="eyebrow">Keep exploring</span><p>Build on what you have just studied.</p></div>'+link('Source lesson on Save My Exams ↗',l.url||notesUrl,'text-link')+'</div><nav class="lesson-pagination" aria-label="Adjacent lessons">'+sibling(lessons[position-1],'← Previous lesson')+sibling(lessons[position+1],'Next lesson →')+'</nav>';
}
function deckGallery(query='', chapterIndex='') {
  const matching=lessons.filter(l=>(chapterIndex===''||l.chapter===Number(chapterIndex))&&(l.title+' '+catalog[l.chapter].title).toLowerCase().includes(query.toLowerCase().trim()));
  if(!matching.length)return '<p class="collection-empty" role="status">No decks found. Try another topic or choose all chapters.</p>';
  return '<p class="collection-count" role="status">'+matching.length+' decks to explore</p>'+catalog.map((c,i)=>{
    const chapterLessons=matching.filter(l=>l.chapter===i);
    return chapterLessons.length?'<section class="deck-chapter"><div class="deck-chapter-heading"><span class="chapter-tag">'+(i<6?pad(i+1):'✎')+'</span><h2>'+escapeHtml(c.title)+'</h2><span>'+chapterLessons.length+' decks</span></div><div class="deck-grid">'+chapterLessons.map(l=>'<a class="deck-cover" href="#lesson/'+l.id+'/cards"><span class="deck-cover-icon" aria-hidden="true">▣</span><small>Lesson deck</small><h3>'+escapeHtml(l.title)+'</h3><div><span>'+flashcardDecks[l.id].length+' cards</span><span>Study →</span></div></a>').join('')+'</div></section>':'';
  }).join('');
}
function flashcards() {
  const total=Object.values(flashcardDecks).flat().length;
  return studyHero('The recall collection','Small cards.<br><em>Lasting knowledge.</em>','Choose a lesson deck, test what you remember and turn uncertainty into understanding. Every deck is also available to download.',[[lessons.length,'lesson decks'],[total,'lesson cards'],['CSV','downloads']],'card-art')+'<section class="collection-toolbar deck-filters"><div><p class="eyebrow">Your next recall session</p><h2>Find your deck</h2></div><label class="study-search"><span>Search flashcard decks</span><input id="deck-search" type="search" placeholder="Search a lesson or topic…"></label><label class="chapter-select"><span>Chapter</span><select id="deck-chapter"><option value="">All chapters</option>'+catalog.map((c,i)=>'<option value="'+i+'">'+escapeHtml(c.title)+'</option>').join('')+'</select></label></section><div id="deck-results">'+deckGallery()+'</div><section class="glossary-banner"><span class="mini-icon" aria-hidden="true">Aa</span><div><h2>A little more vocabulary</h2><p>Lesson definitions are in their matching decks. Explore '+supplementaryGlossary.length+' additional supplied terms in the supplementary glossary.</p></div>'+link('Open glossary →','#glossary','button')+'</section>';
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
  deck.innerHTML='<div class="deck-topline"><p class="eyebrow counter" aria-live="polite"></p><button id="export" class="deck-download">↓ Download CSV</button></div><div class="deck-progress" aria-hidden="true"><span></span></div><button class="flash" type="button"></button><p class="deck-hint">Click the card or press Space to flip. Use ← and → to move between cards.</p><div class="deck-controls"><button data-step="-1" aria-label="Previous card">← Previous</button><button id="flip-card" class="primary">Reveal answer ↻</button><button data-step="1" aria-label="Next card">Next →</button></div>';
  const flash=deck.querySelector('.flash');
  const stepButtons=[...deck.querySelectorAll('[data-step]')];
  function update() {
    deck.querySelector('.counter').textContent='Card '+(index+1)+' of '+cards.length;
    flash.classList.toggle('reveal',flipped);
    deck.querySelector('.deck-progress span').style.width=((index+1)/cards.length*100)+'%';
    deck.querySelector('#flip-card').textContent=flipped?'Show question ↻':'Reveal answer ↻';
    flash.setAttribute('aria-label',(flipped?'Answer: ':'Question: ')+cards[index][Number(flipped)]+'. Activate to flip.');
    flash.innerHTML='<small>'+(flipped?'Answer · click to see prompt':'Prompt · click to reveal')+'</small><span class="flash-text">'+escapeHtml(cards[index][Number(flipped)])+'</span>';
    stepButtons[0].disabled=index===0;
    stepButtons[1].disabled=index===cards.length-1;
  }
  flash.onclick=()=>{flipped=!flipped;update()};
  deck.querySelector('#flip-card').onclick=flash.onclick;
  deck.onkeydown=event=>{
    const direction=event.key==='ArrowLeft'?-1:event.key==='ArrowRight'?1:0;
    if(direction&&index+direction>=0&&index+direction<cards.length){event.preventDefault();index+=direction;flipped=false;update()}
  };
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
  return heading('Original practice','Practice Questions','Standalone questions: answer directly using your economics knowledge. Choose a chapter or topic to practise.')+
    '<section class="practice-filters" aria-label="Filter questions"><div class="row"><label class="field">Chapter<select id="filter-chapter"><option value="">All chapters</option>'+catalog.slice(0,6).map((chapter,i)=>'<option value="'+i+'" '+(chapterIndex===i?'selected':'')+'>'+escapeHtml(chapter.title)+'</option>').join('')+'</select></label>'+
    '<label class="field">Topic<select id="filter-topic"></select></label><label class="field">Question type<select id="filter-type"><option value="">All types</option><option value="mcq">MCQ · Paper 1</option><option value="structured">Structured · Paper 2</option></select></label>'+
    '<label class="field">Marks<select id="filter-marks"><option value="">All marks</option>'+[1,2,4,6,8].map(m=>'<option value="'+m+'">'+m+'</option>').join('')+'</select></label></div>'+
    '<div class="row"><label class="field question-search">Find a question<input type="search" id="filter-search" placeholder="Search wording, topic or question ID"></label><button type="button" id="clear-filters">Clear filters</button></div></section>'+
    '<div class="practice-workspace"><aside class="question-browser" aria-label="Question navigator"><p id="question-scope" class="eyebrow"></p><p id="question-count" class="muted" aria-live="polite"></p><p class="navigator-hint">Choose a question. A dot means you have started an answer.</p><nav id="question-list" aria-label="Questions"></nav><div class="row navigator-pages" id="list-pages"></div></aside>'+
    '<section class="question-work"><div class="question-toolbar" id="question-pages"></div><div id="questions"></div></section></div>';
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
  const search=document.querySelector('#filter-search');
  const list=document.querySelector('#question-list');
  const listPages=document.querySelector('#list-pages');
  const filterKey='ecbiz-practice-filters';
  let savedFilters={};
  try {savedFilters=JSON.parse(sessionStorage.getItem(filterKey))||{}} catch {}
  if(!location.hash.split('/')[1])chapter.value=savedFilters.chapter||'';
  type.value=savedFilters.type||'';
  marks.value=savedFilters.marks||'';
  search.value=savedFilters.search||'';
  let page=Number.isInteger(savedFilters.page)?savedFilters.page:0;
  let matches=[];
  const size=20;

  function renderTopics() {
    const topics=new Map(questions.filter(q=>chapter.value===''||q.c===Number(chapter.value)).map(q=>[q.topic,q.topicName]));
    topic.innerHTML='<option value="">All topics</option>'+[...topics].sort(([a],[b])=>a.localeCompare(b,undefined,{numeric:true})).map(([code,name])=>'<option value="'+code+'">'+code+' · '+escapeHtml(name)+'</option>').join('');
  }
  function renderQuestions() {
    matches=questions.map((q,i)=>({q,i})).filter(({q})=>
      (chapter.value===''||q.c===Number(chapter.value))&&
      (!topic.value||q.topic===topic.value)&&
      (!type.value||type.value===(q.options?'mcq':'structured'))&&
      (!marks.value||q.marks===Number(marks.value))&&
      (!search.value.trim()||(q.id+' '+q.topicName+' '+q.q+' '+q.case).toLowerCase().includes(search.value.trim().toLowerCase())));
    page=Math.max(0,Math.min(page,matches.length-1));
    document.querySelector('#question-count').textContent=matches.length+' matching questions';
    const topicLabel=topic.value?topic.selectedOptions[0].textContent:'All topics';
    const typeLabel=type.value==='mcq'?'MCQs':type.value==='structured'?'Structured questions':'All types';
    document.querySelector('#question-scope').textContent=topicLabel+' · '+typeLabel;
    try {sessionStorage.setItem(filterKey,JSON.stringify({chapter:chapter.value,topic:topic.value,type:type.value,marks:marks.value,search:search.value,page}))} catch {}
    renderNavigator();
    target.innerHTML=matches.slice(page,page+1).map(({q,i})=>{
      const saved=attempts.get(i)||{};
      const answer=saved.answer||'';
      return '<form class="panel" data-question="'+i+'"><div class="eyebrow">Chapter '+(q.c+1)+' · '+q.topic+' · '+q.marks+' '+(q.marks===1?'mark':'marks')+'</div><p class="question-id">'+escapeHtml(q.id)+'</p>'+
        (q.case?'<div class="case-study"><strong>Case study</strong><p>'+escapeHtml(q.case)+'</p></div>':'')+
        '<h2>'+escapeHtml(q.q)+'</h2>'+
        (q.options?q.options.map((option,j)=>'<label class="choice"><input type="radio" name="answer" value="'+j+'" '+(answer===String(j)?'checked':'')+' required><strong>'+String.fromCharCode(65+j)+'.</strong> '+escapeHtml(option)+'</label>').join(''):'<label class="field">Your answer<textarea name="answer" required>'+escapeHtml(answer)+'</textarea></label>')+
        '<button class="primary">'+(q.options?'Check answer':'Submit and view mark scheme')+'</button><div class="feedback" role="status" '+(saved.feedback?'':'hidden')+'>'+(saved.feedback||'')+'</div></form>';
    }).join('');
    pages.innerHTML=matches.length?'<button type="button" data-page="-1" '+(page===0?'disabled':'')+'>← Previous</button><label class="jump-label">Question <input id="question-jump" aria-label="Go to question number" type="number" min="1" max="'+matches.length+'" value="'+(page+1)+'"> of '+matches.length+'</label><button type="button" data-page="1" '+(page===matches.length-1?'disabled':'')+'>Next →</button>':'';
    if(!matches.length)target.innerHTML='<div class="panel"><h2>No matching questions</h2><p>Try a broader search or clear the filters.</p></div>';
  }
  function renderNavigator() {
    const start=Math.floor(page/size)*size;
    list.innerHTML=matches.slice(start,start+size).map(({q,i},offset)=>
      '<button type="button" data-question-position="'+(start+offset)+'" '+(start+offset===page?'aria-current="step"':'')+'><span class="question-number">'+(start+offset+1)+'</span><span><strong>'+escapeHtml(q.q)+'</strong><small>Ch '+(q.c+1)+' · '+q.topic+' · '+(q.options?'MCQ':q.marks+' marks')+(attempts.get(i)?.answer?' · ● Started':'')+'</small></span></button>').join('');
    listPages.innerHTML=matches.length>size?'<button type="button" data-list-page="-1" '+(start===0?'disabled':'')+'>← List</button><small>'+(start+1)+'–'+Math.min(start+size,matches.length)+'</small><button type="button" data-list-page="1" '+(start+size>=matches.length?'disabled':'')+'>List →</button>':'';
  }
  function reset() {page=0;renderQuestions()}
  renderTopics();
  if([...topic.options].some(option=>option.value===savedFilters.topic))topic.value=savedFilters.topic;
  chapter.onchange=()=>{renderTopics();reset()};
  topic.onchange=type.onchange=marks.onchange=reset;
  search.oninput=reset;
  document.querySelector('#clear-filters').onclick=()=>{
    chapter.value=topic.value=type.value=marks.value=search.value='';
    renderTopics();
    reset();
  };
  function moveTo(position,scroll=false) {
    page=Math.max(0,Math.min(position,matches.length-1));
    renderQuestions();
    if(scroll)document.querySelector('.question-work').scrollIntoView({block:'start'});
  }
  list.onclick=event=>{
    const button=event.target.closest('[data-question-position]');
    if(button)moveTo(Number(button.dataset.questionPosition),window.innerWidth<901);
  };
  listPages.onclick=event=>{
    const button=event.target.closest('[data-list-page]');
    if(button)moveTo(Math.floor(page/size)*size+Number(button.dataset.listPage)*size);
  };
  pages.onclick=event=>{
    const button=event.target.closest('[data-page]');
    if(button)moveTo(page+Number(button.dataset.page));
  };
  pages.onchange=event=>{
    if(event.target.id==='question-jump'&&event.target.value)moveTo(Number(event.target.value)-1);
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
    renderNavigator();
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
      : '<strong>Practice mark scheme · '+q.marks+' marks</strong><div class="mark-scheme">'+escapeHtml(q.scheme)+'</div>'+
        (q.note?'<p><strong>Marking guidance</strong></p><p>'+escapeHtml(q.note)+'</p>':'')+
        (q.marks===8?'<section class="discussion-rubric"><h3>8-mark discussion rubric</h3><ul><li><strong>6–8:</strong> Both sides are developed through sound economic analysis, with a reasoned assessment of the issue.</li><li><strong>3–5:</strong> Relevant economic reasoning, but the discussion has limited depth or mainly develops one side.</li><li><strong>1–2:</strong> Relevant ideas or definitions with little explanation.</li><li><strong>0:</strong> No creditworthy response.</li></ul><p>EcBiz summary based on <a href="https://www.cambridgeinternational.org/Images/718805-2027-specimen-paper-2-mark-scheme.pdf" target="_blank" rel="noopener noreferrer">Cambridge’s 2027 specimen marking guidance, Table A</a>.</p></section>':'')+
        '<label class="field">Your self-assessed mark<select data-score><option value="">Choose a score</option>'+Array.from({length:q.marks+1},(_,n)=>'<option value="'+n+'">'+n+'</option>').join('')+'</select></label><p class="self-score-result"></p>';
    attempts.set(index,{answer,feedback:feedback.innerHTML});
    renderNavigator();
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
  return heading('Reference desk','Sources and coverage','Use the source lessons for full coverage and the official papers to practise under exam conditions.')+'<article class="panel"><h2>Lesson library</h2><p>All '+lessons.length+' indexed lessons include concise notes, downloadable flashcards and a link to Save My Exams for further reading.</p>'+link('Save My Exams lesson index ↗',notesUrl)+'<h2>Cambridge 0455 from 2027</h2><ul><li>Paper 1 · Multiple choice · 40 marks · 1 hour</li><li>Paper 2 · Structured questions · 80 marks · 2 hours</li></ul><p>The practice bank contains '+questions.length+' original questions. Structured questions have been adapted from the supplied practice file to be answered without a separate case study. MCQs use the original answer keys. Structured questions include revised practice mark schemes for self-assessment. Cambridge publishes selected past papers, official mark schemes and specimen materials.</p><div class="row">'+link('Syllabus coverage','#syllabus')+link('Official syllabus ↗',syllabus)+link('Papers and mark schemes ↗',papers)+'</div></article>';
}
function render() {
  updateRevisionNotesIndex();
  const [revisionPage, revisionId] = location.hash.slice(1).split('/');
  if (Object.hasOwn(revisionRoutes, revisionPage)) {
    main.classList.remove('practice-page', 'learning-page');
    main.innerHTML = '<div class="wrap">' + revisionRoutes[revisionPage](revisionId) + '</div>';
    document.querySelectorAll('.top nav a').forEach(a => {
      if (a.hash === '#revision') a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    revisionSetups[revisionPage]?.(revisionId);
    return;
  }
  const [page='home', id, mode] = location.hash.slice(1).split('/');
  main.classList.toggle('practice-page',page==='practice');
  main.classList.toggle('learning-page',['library','chapter','lesson','flashcards','glossary'].includes(page));
  const routes={home,library,chapter:()=>chapter(Number(id)),lesson:()=>lesson(Number(id),mode==='cards'),flashcards,glossary,practice:()=>practice(id===undefined?null:Number(id),Number(mode)),syllabus:syllabusGuide,sources};
  main.innerHTML='<div class="wrap">'+(Object.hasOwn(routes,page)?routes[page]:home)()+'</div>';
  const active=page==='glossary'?'flashcards':page==='chapter'||page==='lesson'?(mode==='cards'?'flashcards':'library'):page||'home';
  document.querySelectorAll('.top nav:not(#revision-notes-index) a,.tabs a').forEach(a=>{
    const current=a.closest('.tabs')?a.hash===location.hash:a.hash==='#'+active;
    if(current)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
  });
  const search=document.querySelector('#search');
  if(search) search.oninput=()=>{
    const query=search.value.toLowerCase().trim();
    const matches=lessons.filter(l=>l.title.toLowerCase().includes(query));
    document.querySelector('#results').innerHTML=!query?chapterGallery():matches.length?'<section class="group">'+matches.map(lessonLink).join('')+'</section>':'<p class="muted" role="status">No lessons match your search.</p>';
  };
  const deckSearch=document.querySelector('#deck-search');
  const deckChapter=document.querySelector('#deck-chapter');
  if(deckSearch)deckSearch.oninput=deckChapter.onchange=()=>{document.querySelector('#deck-results').innerHTML=deckGallery(deckSearch.value,deckChapter.value)};
  document.querySelectorAll('[data-note-target]').forEach(button=>button.onclick=()=>document.getElementById(button.dataset.noteTarget).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'}));
  setupDeck(page==='glossary'?'glossary':Number(id));
  setupPractice();
}
window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0)});
document.addEventListener('DOMContentLoaded', () => {
  buildRevisionNotesIndex();
  render();
}, {once:true});

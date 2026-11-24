const main = document.querySelector('main');
const markingControls = document.querySelector('#local-marking-controls');
const markingPages = new Set(['practice', 'revision-test', 'revision-writing', 'revision-retry', 'revision-corrections']);
const notesUrl = 'https://www.savemyexams.com/igcse/economics/cie/25/revision-notes/';
const syllabus = 'https://www.cambridgeinternational.org/Images/718148-2027-2029-syllabus.pdf';
const papers = 'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-economics-0455/past-papers/';
const lessons = catalog.flatMap((chapter, index) => chapter.groups.flatMap(group => group.lessons.map(lesson => ({...lesson, chapter:index}))));
const icons = ['◒','⇄','▦','▥','↗','◎','✎'];
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[char]);
const link = (label, href, cls = 'button') => '<a class="' + cls + '" href="' + escapeHtml(href) + '">' + escapeHtml(label) + '</a>';
const heading = (label, title, desc) => '<div class="eyebrow">' + label + '</div><h1 class="page-title">' + title + '</h1><p class="muted">' + desc + '</p>';
const pad = n => String(n).padStart(2,'0');
function tiles(includeExam) {
  return '<div class="grid">' + catalog.slice(0,includeExam ? catalog.length : 6).map((c,i) => '<a class="tile" data-chapter-colour="'+i+'" href="#chapter/'+i+'"><span class="icon" aria-hidden="true">'+icons[i]+'</span><div class="tile-copy"><h3>'+escapeHtml(c.title)+'</h3><small>'+ (i<6 ? 'CHAPTER '+pad(i+1) : 'EXAM SKILLS') +' · '+lessons.filter(l=>l.chapter===i).length+' lessons</small></div><span class="arrow" aria-hidden="true">→</span></a>').join('')+'</div>';
}
function overviewIcon(kind) {
  const shapes = {
    paper: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5M10 12h5M10 16h5"/>',
    writing: '<path d="m15 4 5 5-10 10-6 1 1-6zM13 6l5 5"/>',
    notes: '<path d="M3 5c4-2 6-1 9 1 3-2 5-3 9-1v15c-4-2-6-1-9 1-3-2-5-3-9-1zM12 6v15"/>',
    cards: '<rect x="6" y="7" width="15" height="14" rx="2"/><path d="M17 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1M10 12h7M10 16h4"/>',
    tools: '<path d="M4 5h16M4 12h16M4 19h16"/><circle cx="8" cy="5" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="9" cy="19" r="2"/>',
    progress: '<path d="M4 4v16h17M8 15l4-5 4 2 4-7"/>',
    check: '<path d="m7 12 3 3 7-7"/><rect x="3" y="3" width="18" height="18" rx="5"/>'
  };
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + shapes[kind] + '</svg>';
}
function home() {
  const exam = [
    ['paper', 'Paper 1 practice', 'Build your confidence with multiple-choice questions, organised by topic.', '#practice/mcq'],
    ['writing', 'Paper 2 practice', 'Develop your written answers with structured questions and detailed feedback.', '#practice/structured']
  ];
  const revision = [
    ['notes', 'Lesson library', 'Clear explanations, key ideas and diagrams for every chapter.', '#library'],
    ['cards', 'Flashcards', 'Turn what you understand into what you remember.', '#flashcards'],
    ['tools', 'Revision tools', 'Cheatsheets, timed tests and a place to revisit mistakes.', '#revision']
  ];
  const cards = items => items.map(([icon, title, description, href]) => `
    <a class="overview-card" href="${href}">
      <span class="overview-icon">${overviewIcon(icon)}</span>
      <span class="overview-card-copy"><strong>${title}</strong><span>${description}</span></span>
    </a>`).join('');
  return `
    <header class="economics-hero">
      <div class="economics-hero-copy">
        <p class="eyebrow">Cambridge IGCSE · Economics 0455</p>
        <h1>Economics,<br><em>made clearer.</em></h1>
        <p>Make sense of the world around you. Explore the ideas, connect the concepts and build confidence for your exams.</p>
        <div class="actions">
          ${link('Start practising', '#practice', 'button hero-primary')}
          ${link('Explore lessons', '#library', 'button hero-secondary')}
        </div>
        <div class="hero-facts" aria-label="Study resources">
          <span><strong>6</strong> syllabus chapters</span>
          <span><strong>${lessons.length}</strong> lessons</span>
          <span><strong>2</strong> exam paper formats</span>
        </div>
      </div>
      <aside class="hero-study-plan" aria-labelledby="study-plan-title">
        <div class="study-plan-heading"><span class="eyebrow">A little progress, every day</span><h2 id="study-plan-title">Find your focus.</h2><p>Choose where you want to begin.</p></div>
        <a href="#library"><span class="focus-icon">${overviewIcon('notes')}</span><span><strong>Understand a concept</strong><small>Open the lesson library</small></span></a>
        <a href="#practice"><span class="focus-icon">${overviewIcon('writing')}</span><span><strong>Put it into practice</strong><small>Try an exam-style question</small></span></a>
        <a href="#revision-checklist"><span class="focus-icon">${overviewIcon('check')}</span><span><strong>Plan your next step</strong><small>Review your syllabus checklist</small></span></a>
        <div class="study-plan-footer">Your space to learn at your own pace.</div>
      </aside>
    </header>
    <div class="overview-personal">
      <a class="progress-overview-link" href="#progress"><span class="overview-icon">${overviewIcon('progress')}</span><span class="overview-card-copy"><strong>Your progress, in one place</strong><span>Revisit saved answers and see how far you’ve come.</span></span></a>
      <a class="checklist-callout" href="#revision-checklist"><span class="overview-icon">${overviewIcon('check')}</span><span class="overview-card-copy"><strong>Know what comes next</strong><span>Keep track of the syllabus with your revision checklist.</span></span></a>
    </div>
    <section class="overview-section" aria-labelledby="overview-exam">
      <div class="overview-section-heading"><div><p class="eyebrow">Build your confidence</p><h2 id="overview-exam">Make practice a habit.</h2></div><p>Small steps. Stronger answers.</p></div>
      <div class="overview-exam-grid">${cards(exam)}</div>
    </section>
    <section class="overview-section" aria-labelledby="overview-revision">
      <div class="overview-section-heading"><div><p class="eyebrow">Learn your way</p><h2 id="overview-revision">A toolkit for every topic.</h2></div></div>
      <div class="overview-revision-grid">${cards(revision)}</div>
    </section>
    <section class="overview-section overview-chapters" aria-labelledby="overview-chapters">
      <div class="section-head"><div><p class="eyebrow">The bigger picture</p><h2 id="overview-chapters">Explore the syllabus.</h2></div>${link('View syllabus coverage', '#syllabus', 'text-link')}</div>
      ${tiles(false)}
    </section>`;
}
function studyHero(label, title, description, stats, kind) {
  return '<section class="study-hero"><div><p class="eyebrow">'+label+'</p><h1>'+title+'</h1><p class="study-intro">'+description+'</p><div class="study-stats">'+stats.map(([n,label])=>'<span><strong>'+n+'</strong> '+label+'</span>').join('')+'</div></div><div class="study-art '+kind+'" aria-hidden="true"><span class="art-orbit"></span><span class="art-sheet sheet-back"></span><span class="art-sheet sheet-front">'+(kind==='card-art'?'Q.':'E.')+'</span></div></section>';
}
function chapterGallery() {
  return '<div class="chapter-collection">'+catalog.map((c,i)=>{
    const chapterLessons=lessons.filter(l=>l.chapter===i);
    return '<a class="chapter-cover" href="#chapter/'+i+'" data-chapter-colour="'+i+'"><div class="cover-top"><span class="cover-number">'+(i<6?pad(i+1):'✎')+'</span><span class="cover-arrow" aria-hidden="true">↗</span></div><div><small>'+(i<6?'Chapter '+(i+1):'The exam collection')+'</small><h2>'+escapeHtml(c.title)+'</h2></div><div class="cover-bottom"><span>'+chapterLessons.length+' lessons</span><span>Explore notes →</span></div></a>';
  }).join('')+'</div>';
}
function library() {
  return studyHero('Cambridge IGCSE · 0455','Economics lessons','Browse the syllabus by chapter or search for a specific concept. Lessons include notes, diagrams and key points.',[[6,'chapters'],[lessons.length,'lessons'],['2027–29','syllabus']],'notes-art')+'<section class="collection-toolbar"><div><h2>Browse chapters</h2></div><label class="study-search"><span>Search lessons</span><input id="search" type="search" placeholder="Search demand, inflation, opportunity cost…"></label></section><div id="results">'+chapterGallery()+'</div>';
}
function lessonLink(l) {
  return '<a class="lesson-link" href="#lesson/'+l.id+'"><span>'+escapeHtml(l.title)+'</span><small>'+(flashcardDecks[l.id] ? 'Notes + cards' : 'Source lesson')+' ↗</small></a>';
}
function chapter(index) {
  const c = catalog[index];
  if (!c) return library();
  return '<p class="crumb"><a href="#library">Notes library</a><span>/</span>'+(index<6?'Chapter '+pad(index+1):'Exam skills')+'</p><header class="lesson-heading" data-chapter-colour="'+index+'"><p class="eyebrow">'+(index<6?'Chapter '+pad(index+1):'Exam collection')+' · '+lessons.filter(l=>l.chapter===index).length+' lessons</p><h1>'+escapeHtml(c.title)+'</h1><p>Start with a lesson, then use its flashcards to make the ideas stick.</p></header><div class="chapter-lessons">'+c.groups.map((g,i)=>'<section class="chapter-topic"><div class="topic-heading"><span>'+pad(i+1)+'</span><h2>'+escapeHtml(g.title)+'</h2></div><div>'+g.lessons.map(lessonLink).join('')+'</div></section>').join('')+'</div>';
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
  const practiceTopic = syllabusNotes[id]?.codes[0]?.split('.').slice(0, 2).join('.');
  const practiceHref = practiceTopic ? '#practice/topic/' + practiceTopic : '#practice/' + l.chapter;
  const studyTabs = cards ? `<nav class="lesson-study-tabs tabs" aria-label="Study this lesson">
    ${link('▤  Revision notes', '#lesson/' + id)}
    ${link('▣  Flashcards · ' + cards.length, '#lesson/' + id + '/cards')}
    ${link(practiceTopic ? 'Practice this topic →' : 'Chapter practice →', practiceHref)}
  </nav>` : '';
  const sections=[['note-overview','The explanation'],...(syllabusNotes[id]?[['note-syllabus','Syllabus detail']]:[]),['note-key-points','Key points to remember'],...(workedNotes[id]?[['note-worked',workedNotes[id][0]]]:[])];
  const sibling=(item,direction)=>item?'<a class="lesson-sibling" href="#lesson/'+item.id+(cardsMode?'/cards':'')+'"><small>'+direction+'</small><span>'+escapeHtml(item.title)+'</span></a>':'<span></span>';
  return '<p class="crumb"><a href="#library">Notes library</a><span>/</span><a href="#chapter/'+l.chapter+'">'+escapeHtml(catalog[l.chapter].title)+'</a></p><header class="lesson-heading" data-chapter-colour="'+l.chapter+'"><p class="eyebrow">'+(l.chapter<6?'Chapter '+pad(l.chapter+1):'Exam skills')+' · '+(cardsMode?'Active recall':'Revision notes')+'</p><h1>'+escapeHtml(l.title)+'</h1><p>'+(cardsMode?'A question at a time. Recall the answer, then turn the card to check.':'Read at your own pace. Follow the explanation, explore the diagrams and keep the key ideas close.')+'</p></header>'+
    (cards?studyTabs+(cardsMode?'<div class="recall-layout"><section class="panel" id="deck"></section><aside class="recall-guide"><span class="mini-icon" aria-hidden="true">✦</span><h2>Pause. Recall.<br>Then reveal.</h2><ol><li>Read the prompt.</li><li>Form your answer before flipping.</li><li>Check it, then move to the next card.</li></ol>'+link('Revisit the notes →','#lesson/'+id,'text-link')+'</aside></div>':'<div class="note-layout">'+revisionNotes(id)+'<aside class="study-aside"><p class="eyebrow">In this lesson</p><nav aria-label="On this page">'+sections.map(([target,title],i)=>'<button type="button" data-note-target="'+target+'"><span>'+pad(i+1)+'</span>'+escapeHtml(title)+'</button>').join('')+'</nav><div class="aside-recall"><span class="mini-icon" aria-hidden="true">▣</span><h2>Know it?<br>Test your recall.</h2><p>'+cards.length+' cards to help you remember this lesson.</p>'+link('Study flashcards →','#lesson/'+id+'/cards','button primary')+'</div></aside></div>'):'')+
    '<div class="lesson-end"><div><span class="eyebrow">Keep exploring</span><p>Build on what you have just studied.</p></div>'+link('Source lesson on Save My Exams ↗',l.url||notesUrl,'text-link')+'</div><nav class="lesson-pagination" aria-label="Adjacent lessons">'+sibling(lessons[position-1],'← Previous lesson')+sibling(lessons[position+1],'Next lesson →')+'</nav>';
}
function deckGallery(query='', chapterIndex='') {
  const matching=lessons.filter(l=>(chapterIndex===''||l.chapter===Number(chapterIndex))&&(l.title+' '+catalog[l.chapter].title).toLowerCase().includes(query.toLowerCase().trim()));
  if(!matching.length)return '<p class="collection-empty" role="status">No decks found. Try another topic or choose all chapters.</p>';
  return '<p class="collection-count" role="status">'+matching.length+' decks to explore</p>'+catalog.map((c,i)=>{
    const chapterLessons=matching.filter(l=>l.chapter===i);
    return chapterLessons.length?'<section class="deck-chapter" data-chapter-colour="'+i+'"><div class="deck-chapter-heading"><span class="chapter-tag">'+(i<6?pad(i+1):'✎')+'</span><h2>'+escapeHtml(c.title)+'</h2><span>'+chapterLessons.length+' decks</span></div><div class="deck-grid">'+chapterLessons.map(l=>'<a class="deck-cover" href="#lesson/'+l.id+'/cards"><span class="deck-cover-icon" aria-hidden="true">▣</span><small>Lesson deck</small><h3>'+escapeHtml(l.title)+'</h3><div><span>'+flashcardDecks[l.id].length+' cards</span><span>Study →</span></div></a>').join('')+'</div></section>':'';
  }).join('');
}
function flashcards() {
  const total=Object.values(flashcardDecks).flat().length;
  return studyHero('Cambridge IGCSE · 0455','Economics flashcards','Choose a lesson deck, recall each answer, then flip the card to check it.',[[lessons.length,'lesson decks'],[total,'cards'],['CSV','downloads']],'card-art')+flashcardReviewCallout()+'<section class="collection-toolbar deck-filters"><div><h2>Find a deck</h2></div><label class="study-search"><span>Search flashcard decks</span><input id="deck-search" type="search" placeholder="Search a lesson or topic…"></label><label class="chapter-select"><span>Chapter</span><select id="deck-chapter"><option value="">All chapters</option>'+catalog.map((c,i)=>'<option value="'+i+'">'+escapeHtml(c.title)+'</option>').join('')+'</select></label></section><div id="deck-results">'+deckGallery()+'</div><section class="glossary-banner"><span class="mini-icon" aria-hidden="true">Aa</span><div><h2>Supplementary glossary</h2><p>Review '+supplementaryGlossary.length+' additional Economics terms.</p></div>'+link('Open glossary →','#glossary','button')+'</section>';
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
  const positionKey = 'ecbiz-economics-flashcard-' + id;
  let index=0, flipped=false;
  try {
    const saved = Number(localStorage.getItem(positionKey));
    if (Number.isInteger(saved) && saved >= 0 && saved < cards.length) index = saved;
  } catch {}
  const rateable = id !== 'glossary';
  deck.innerHTML='<div class="deck-topline"><p class="eyebrow counter" aria-live="polite"></p><button id="export" class="deck-download">↓ Download CSV</button></div><div class="deck-progress" aria-hidden="true"><span></span></div><button class="flash" type="button"></button><p class="deck-hint">Click the card or press Space to flip. Use ← and → to move between cards.</p><div class="deck-controls"><button data-step="-1" aria-label="Previous card">← Previous</button><button id="flip-card" class="primary">Reveal answer ↻</button><button data-step="1" aria-label="Next card">Next →</button></div>' +
    (rateable ? flashcardRatings() + '<p data-card-status role="status"></p>' : '');
  const flash=deck.querySelector('.flash');
  const stepButtons=[...deck.querySelectorAll('[data-step]')];
  const ratings = deck.querySelector('[data-flashcard-ratings]');
  function update() {
    if (ratings) ratings.hidden = !flipped;
    try { localStorage.setItem(positionKey, String(index)); } catch {}
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
  if (ratings) ratings.onclick = event => {
    const rating = event.target.closest('[data-card-rating]')?.dataset.cardRating;
    if (!rating || !flipped) return;
    const next = saveCardRating(id,index,rating);
    deck.querySelector('[data-card-status]').textContent = flashcardRatingMessage(next);
    if (!next) return;
    index = Math.min(index + 1, cards.length - 1);
    flipped = false;
    update();
    flash.focus();
  };
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
function practicePreset(id, mode) {
  const match = questions.find(question => id === 'topic' ? question.topic === mode : id === 'question' && question.id === mode);
  return {
    chapterIndex: match?.c ?? (id && /^[0-5]$/.test(id) ? Number(id) : null),
    paper: id === 'mcq' || id === 'structured' ? id : '',
    topic: match?.topic ?? '',
    questionId: id === 'question' ? match?.id ?? '' : '',
  };
}

function practice(chapterIndex) {
  const expanded = matchMedia('(min-width: 901px)').matches ? ' open' : '';
  return '<header class="practice-heading"><h1 class="page-title">Practice questions</h1><p id="practice-context" class="muted"></p><a id="practice-checklist" class="text-link" hidden>Open topic checklist →</a><p id="practice-save-status" role="status">Progress saves in this browser.</p></header><div id="practice-marking"></div>'+
    '<details class="practice-filters"'+expanded+'><summary>Filter questions</summary><div class="row"><label class="field">Chapter<select id="filter-chapter"><option value="">All chapters</option>'+catalog.slice(0,6).map((chapter,i)=>'<option value="'+i+'" '+(chapterIndex===i?'selected':'')+'>'+escapeHtml(chapter.title)+'</option>').join('')+'</select></label>'+
    '<label class="field">Topic<select id="filter-topic"></select></label><label class="field">Question type<select id="filter-type"><option value="">All types</option><option value="mcq">MCQ · Paper 1</option><option value="structured">Structured · Paper 2</option></select></label>'+
    '<label class="field">Marks<select id="filter-marks"><option value="">All marks</option>'+[1,2,4,6,8].map(m=>'<option value="'+m+'">'+m+'</option>').join('')+'</select></label></div>'+
    '<div class="row"><label class="field">Question set<select id="filter-set"><option value="">All questions</option><option value="mixed">Mixed question patterns</option><option value="exam">2027 exam-style set</option></select></label><label class="field question-search">Find a question<input type="search" id="filter-search" placeholder="Search wording, topic or question ID"></label><button type="button" id="clear-filters">Clear filters</button></div></details>'+
    '<div class="practice-workspace"><details class="question-browser"'+expanded+'><summary>Browse questions <span id="question-count" aria-live="polite"></span></summary><p id="question-scope" class="eyebrow"></p><nav id="question-list" aria-label="Questions"></nav><div class="row navigator-pages" id="list-pages"></div></details>'+
    '<section class="question-work" tabindex="-1" aria-label="Selected question"><div class="question-toolbar" id="question-pages"></div><div id="questions"></div></section></div>';
}
function readPracticeAnswers() {
  try {
    const saved = JSON.parse(localStorage.getItem('ecbiz-economics-practice-answers') || '{}');
    return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
  } catch { return {}; }
}


const outcomeLabels = {
  correct: ['✓', 'Correct'], incorrect: ['✕', 'Incorrect'],
  unanswered: ['–', 'Unanswered'], partial: ['◐', 'Partial credit']
};

function outcomeBadge(outcome, label = outcomeLabels[outcome][1]) {
  return '<strong class="result-badge" data-outcome="' + outcome + '">' +
    '<span aria-hidden="true">' + outcomeLabels[outcome][0] + '</span> ' + escapeHtml(label) + '</strong>';
}

function mcqOutcome(selected, expected) {
  return selected === String(expected) ? 'correct' : selected ? 'incorrect' : 'unanswered';
}

function choiceOutcome(option, selected, expected) {
  if (option === String(expected)) return ['correct', option === selected ? 'Correct · your answer' : 'Correct answer'];
  if (option === selected) return ['incorrect', 'Incorrect · your answer'];
  return null;
}

function paintAnswerChoices(form, selected, expected) {
  for (const input of form.querySelectorAll('.choice input[type="radio"]')) {
    const label = input.closest('.choice');
    const outcome = expected != null ? choiceOutcome(input.value, selected, expected) : null;
    delete label.dataset.outcome;
    label.querySelector('.result-badge')?.remove();
    if (outcome) {
      label.dataset.outcome = outcome[0];
      label.insertAdjacentHTML('beforeend', outcomeBadge(...outcome));
    }
  }
}

function setupPractice({ chapterIndex, paper, topic: initialTopic, questionId }) {
  const chapter=document.querySelector('#filter-chapter');
  if (!chapter) return;
  const topic=document.querySelector('#filter-topic');
  const type=document.querySelector('#filter-type');
  const marks=document.querySelector('#filter-marks');
  const target=document.querySelector('#questions');
  const pages=document.querySelector('#question-pages');
  const attempts=new Map();
  const search=document.querySelector('#filter-search');
  const questionSet=document.querySelector('#filter-set');
  const list=document.querySelector('#question-list');
  const listPages=document.querySelector('#list-pages');
  const context = document.querySelector('#practice-context');
  const checklistLink = document.querySelector('#practice-checklist');
  const saveStatus = document.querySelector('#practice-save-status');
  const answersKey = 'ecbiz-economics-practice-answers';
  try {
    const saved = readPracticeAnswers();
    questions.forEach((question, index) => {
      const entry = saved?.[question.id];
      if (typeof entry?.answer === 'string') {
        attempts.set(index, { answer: entry.answer, feedback: typeof entry.feedback === 'string' ? entry.feedback : '', score: entry.score });
      }
    });
  } catch {}

  function saveAttempt(index, state) {
    try {
      const saved = readPracticeAnswers();
      saved[questions[index].id] = { answer: state.answer, feedback: state.pending ? '' : state.feedback || '', score: state.score };
      localStorage.setItem(answersKey, JSON.stringify(saved));
      saveStatus.textContent = 'Saved in this browser.';
    } catch {
      saveStatus.textContent = 'This browser could not save your progress. Check whether site storage is available.';
    }
  }
  const filterKey='ecbiz-practice-filters';
  let savedFilters={};
  const useSavedFilters = !paper && !initialTopic;
  if (useSavedFilters) {
    try {savedFilters=JSON.parse(localStorage.getItem(filterKey) || sessionStorage.getItem(filterKey))||{}} catch {}
  }
  if (chapterIndex === null) chapter.value = savedFilters.chapter || '';
  type.value=paper||savedFilters.type||'';
  marks.value=savedFilters.marks||'';
  search.value=savedFilters.search||'';
  questionSet.value=savedFilters.questionSet||'';
  let page=Number.isInteger(savedFilters.page)?savedFilters.page:0;
  let requestedQuestion = questionId;
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
      (questionSet.value!=='exam'||Boolean(q.reference))&&
      (!search.value.trim()||(q.id+' '+q.topicName+' '+q.q+' '+q.case).toLowerCase().includes(search.value.trim().toLowerCase())));
    if (questionSet.value==='mixed') matches = distinctQuestionPatterns(matches, item=>item.q);
    if (requestedQuestion) {
      page = matches.findIndex(({q}) => q.id === requestedQuestion);
      requestedQuestion = '';
    }
    page=Math.max(0,Math.min(page,matches.length-1));
    document.querySelector('#question-count').textContent=matches.length+' matching questions';
    const topicLabel=topic.value?topic.selectedOptions[0].textContent:'All topics';
    const typeLabel=type.value==='mcq'?'MCQs':type.value==='structured'?'Structured questions':'All types';
    document.querySelector('#question-scope').textContent=topicLabel+' · '+typeLabel;
    context.textContent = topic.value || type.value ? topicLabel + ' · ' + typeLabel : 'Choose a chapter or topic, then pick a question from the list.';
    checklistLink.hidden = !topic.value;
    if (topic.value) checklistLink.href = '#revision-checklist/' + topic.value;
    if (useSavedFilters) {
      try {localStorage.setItem(filterKey,JSON.stringify({chapter:chapter.value,topic:topic.value,type:type.value,marks:marks.value,search:search.value,questionSet:questionSet.value,page}))} catch {}
    }
    renderNavigator();
    target.innerHTML=matches.slice(page,page+1).map(({q,i})=>{
      const saved=attempts.get(i)||{};
      const answer=saved.answer||'';
      const wordCount=answer.trim()?answer.trim().split(/\s+/).length:0;
      return '<form class="panel" data-question="'+i+'"><div class="eyebrow">Chapter '+(q.c+1)+' · '+q.topic+' · '+q.marks+' '+(q.marks===1?'mark':'marks')+'</div><p class="question-id">'+escapeHtml(q.id)+'</p>'+
        (q.case?'<div class="case-study"><strong>Case study</strong><p>'+escapeHtml(q.case)+'</p></div>':'')+
        '<h2>'+escapeHtml(q.q)+'</h2>'+
        (q.options?q.options.map((option,j)=>'<label class="choice"><input type="radio" name="answer" value="'+j+'" '+(answer===String(j)?'checked':'')+' required><strong>'+String.fromCharCode(65+j)+'.</strong> '+escapeHtml(option)+'</label>').join(''):
          '<div class="answer-composer"><div class="answer-heading"><label for="practice-answer">Your answer</label><span>Written practice</span></div>'+
          '<textarea id="practice-answer" name="answer" maxlength="8000" required aria-describedby="answer-hint" placeholder="Start with your key point, then develop your reasoning…">'+escapeHtml(answer)+'</textarea>'+
          '<div class="answer-footer"><span id="answer-hint">Use clear economic reasoning and relevant examples.</span><span class="answer-count">'+wordCount+' '+(wordCount===1?'word':'words')+'</span></div></div>')+
        '<button class="primary" '+(saved.pending?'disabled':'')+'>'+(q.options?'Check answer':'Mark my answer')+'</button><div class="feedback" role="status" '+(saved.feedback?'':'hidden')+'>'+(saved.feedback||'')+'</div></form>';
    }).join('');
    const current=matches[page];
    const saved=current && attempts.get(current.i);
    if (current?.q.options && saved?.feedback) {
      paintAnswerChoices(target, saved.answer, current.q.answer);
      target.querySelector('.feedback').dataset.outcome = mcqOutcome(saved.answer, current.q.answer);
    }
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
  const selectedTopic = initialTopic || savedFilters.topic;
  if ([...topic.options].some(option => option.value === selectedTopic)) topic.value = selectedTopic;
  chapter.onchange=()=>{renderTopics();reset()};
  topic.onchange=type.onchange=marks.onchange=questionSet.onchange=reset;
  search.oninput=reset;
  document.querySelector('#clear-filters').onclick=()=>{
    chapter.value=topic.value=type.value=marks.value=search.value=questionSet.value='';
    renderTopics();
    reset();
  };
  function moveTo(position,scroll=false) {
    page=Math.max(0,Math.min(position,matches.length-1));
    renderQuestions();
    if (scroll) {
      const work = target.closest('.question-work');
      work.focus({ preventScroll: true });
      work.scrollIntoView({ block: 'start' });
    }
  }
  list.onclick=event=>{
    const button=event.target.closest('[data-question-position]');
    if (!button) return;
    const compact = window.innerWidth < 901;
    if (compact) list.closest('details').open = false;
    moveTo(Number(button.dataset.questionPosition), compact || event.detail === 0);
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
    attempts.set(index,{answer:event.target.value});
    saveAttempt(index, attempts.get(index));
    const count=form.querySelector('.answer-count');
    if(count) {
      const words=event.target.value.trim()?event.target.value.trim().split(/\s+/).length:0;
      count.textContent=words+' '+(words===1?'word':'words');
    }
    const feedback=form.querySelector('.feedback');
    feedback.hidden=true;
    delete feedback.dataset.outcome;
    paintAnswerChoices(form);
    form.querySelector('button.primary').disabled=false;
    renderNavigator();
  };
  target.onsubmit=async event=>{
    event.preventDefault();
    const form=event.target;
    const index=Number(form.dataset.question);
    const q=questions[index];
    const answer=String(new FormData(form).get('answer')??'').trim();
    if(!answer || attempts.get(index)?.pending)return;
    const state={answer,pending:!q.options,feedback:'Marking your answer…'};
    attempts.set(index,state);
    saveAttempt(index, state);
    const showFeedback=()=>{
      const current=target.querySelector('form[data-question="'+index+'"]');
      if(!current || attempts.get(index)!==state)return;
      const feedback=current.querySelector('.feedback');
      feedback.hidden=false;
      feedback.innerHTML=state.feedback;
      if (q.options && state.feedback !== 'Marking your answer…') {
        feedback.dataset.outcome=mcqOutcome(answer, q.answer);
        paintAnswerChoices(current, answer, q.answer);
      }
      current.querySelector('button.primary').disabled=state.pending;
    };
    showFeedback();
    try {
      if (q.options) {
        state.score = Number(answer === String(q.answer));
        state.feedback = outcomeBadge(mcqOutcome(answer, q.answer))+'<h3>Feedback</h3><p>'+escapeHtml(q.why)+'</p><h3>Model response</h3><p>'+escapeHtml(q.options[q.answer])+'</p>';
      } else {
        await loadEconomicsMarker();
        const grade = await ecbizMarking.grade(q.id,answer,undefined,message=>{
          state.feedback='<p>'+escapeHtml(message)+'</p>';
          showFeedback();
        });
        state.score = grade.score;
        if ([2,4,6].includes(q.marks) && attempts.get(index) === state) saveWritingVersion(q.id,answer,grade);
        state.feedback = ecbizMarking.feedback(grade,q.marks,answer)+ecbizMarking.scheme(q)+
          '<div class="row">'+link('Revise this answer and compare versions','#revision-writing/'+q.id)+answerComparisonLink(q.marks)+'</div>';
      }
      if(q.reference) {
        state.feedback+='<p class="muted">Exam-style reference: <a target="_blank" rel="noopener noreferrer" href="'+
          escapeHtml(q.reference.url)+'">'+escapeHtml(q.reference.label)+'</a></p>';
      }
    } catch(error) {
      state.feedback='<p>'+escapeHtml(error.message)+'</p>';
    } finally {
      state.pending=false;
      if (attempts.get(index) === state) saveAttempt(index, state);
      showFeedback();
      renderNavigator();
    }
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
function setActiveSection(active) {
  document.querySelectorAll('.economics-links [data-section]').forEach(link => {
    if (link.dataset.section === active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

function render(autoMark = true) {
  const [revisionPage, revisionId] = location.hash.slice(1).split('/');
  if (revisionPage === 'revision-teach') {
    location.replace('#revision');
    return;
  }
  const isRevision = Object.hasOwn(revisionRoutes, revisionPage);
  main.classList.toggle('revision-page', isRevision);
  main.after(markingControls);
  markingControls.hidden = !markingPages.has(revisionPage);
  if (isRevision) {
    main.classList.remove('practice-page', 'learning-page');
    main.innerHTML = '<div class="wrap">' + renderRevisionTool(revisionPage, revisionId) + '</div>';
    if (!markingControls.hidden) main.querySelector('.revision-heading')?.after(markingControls);
    setActiveSection(revisionPage === 'revision-checklist' ? 'revision-checklist' : 'revision');
    revisionSetups[revisionPage]?.(revisionId, autoMark);
    return;
  }
  const [page='home', id, mode] = location.hash.slice(1).split('/');
  main.classList.toggle('practice-page',page==='practice');
  main.classList.toggle('learning-page',['library','chapter','lesson','flashcards','flashcard-review','glossary'].includes(page));
  const preset = page === 'practice' ? practicePreset(id, mode) : null;
  const routes={home,progress:economicsProgress,'progress-weak-topics':economicsProgress,library,chapter:()=>chapter(Number(id)),lesson:()=>lesson(Number(id),mode==='cards'),flashcards,'flashcard-review':dailyFlashcards,glossary,practice:()=>practice(preset.chapterIndex),syllabus:syllabusGuide,sources};
  main.innerHTML='<div class="wrap">'+(Object.hasOwn(routes,page)?routes[page]:home)()+'</div>';
  const active = page==='progress-weak-topics' ? 'progress' : ['glossary','flashcard-review'].includes(page) ? 'flashcards' : page === 'chapter' || page === 'lesson' ? (mode === 'cards' ? 'flashcards' : 'library') : page;
  setActiveSection(Object.hasOwn(routes, page) ? active : 'home');
  document.querySelectorAll('.tabs a').forEach(a=>{
    if(a.hash===location.hash)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
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
  if (page==='flashcard-review') setupDailyFlashcards();
  if (page === 'practice') {
    main.querySelector('#practice-marking').replaceWith(markingControls);
    setupPractice(preset);
  }
}
window.addEventListener('hashchange', () => renderEconomicsRoute(true));
document.addEventListener('DOMContentLoaded', () => {
  renderEconomicsRoute();
  document.querySelector('.skip').addEventListener('click', event => {
    event.preventDefault();
    main.focus();
    main.scrollIntoView({ block: 'start' });
  });
}, {once:true});


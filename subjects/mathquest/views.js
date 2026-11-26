import {asset} from './assets.js';
import {
  COURSES, EXAMS, LEVELS, LESSONS, TRACKS, UNITS, aLevelCourses, assessmentItems, courseLabel, courseLevel,
  courseLessons, courseUnit, courseUnits, selectedCourse, tierLabel, unitName
} from './curriculum.js';
import {buildPlan} from './coach.js';
import {curveRatios} from './hero-curve.js';
import {CRATES, ITEMS, RARITIES, SLOTS, gearSellValue, itemById, slotBuff} from './game-items.js';
import {renderEquippedAvatar} from './game-avatar.js';
import {crateOdds} from './shared/gear-crates.js';
import {badge, button, coinLabel, e, empty, icon, link, pageHead, progress, tile} from './ui.js';
import {hasLessonVisual, lessonVisual} from './lesson-visuals.js';

export const courseButton = label => button('course',label,'primary');
const formatDate = timestamp => new Intl.DateTimeFormat('en',{dateStyle:'medium'}).format(timestamp);
const levelDescriptions = {igcse:'Core, Extended and Additional Maths',alevel:'Cambridge International 9709'};

function qualificationLinks(level,page='home') {
  return `<nav class="qualification-tabs" aria-label="Qualification">${Object.entries(LEVELS).map(([id,name])=>
    `<a href="#${page}/${id}" ${id===level ? 'aria-current="page"' : ''}>
      ${tile(id==='igcse' ? 'book' : 'function',id==='igcse' ? 'violet' : 'mint',20)}
      <span><strong>${name}</strong><small>${levelDescriptions[id]}</small></span>${icon('chevron',16)}</a>`).join('')}</nav>`;
}

function trackCard(id, attrs='') {
  const track = TRACKS[id];
  return `<button class="track-card" type="button" ${attrs || 'data-action="course" data-track="' + id + '"'}>
    <span class="track-card-top">${tile(track.icon,track.tone,23)}${badge(track.tag,track.tone)}</span>
    <strong>${track.name}</strong><span class="track-desc">${track.description}</span></button>`;
}

const topicExamples = {
  number:'Fractions, percentages and ratio',
  algebra:'Expressions, equations and sequences',
  'function-graphs':'Sketch, interpret and transform graphs',
  coordinates:'Gradient, midpoint and line equations',
  geometry:'Angles, symmetry and circle theorems',
  mensuration:'Perimeter, area, surface area and volume',
  trigonometry:'Pythagoras, triangles and bearings',
  vectors:'Transform shapes and work with vectors',
  probability:'Combined events and tree diagrams',
  statistics:'Averages, charts and interpreting data',
  modelling:'Patterns, models and investigations',
  functions:'Domain, range, composite and inverse functions',
  quadratic:'Complete the square and find turning points',
  polynomials:'Factor and remainder theorems',
  equations:'Solve inequalities and read their graphs',
  systems:'Solve two equations together',
  logarithms:'Log laws and exponential equations',
  'line-model':'Use straight lines to model data',
  'circle-coordinate':'Centres, radii and circle equations',
  circular:'Radians, arc length and sector area',
  'add-trig':'Identities and trigonometric equations',
  counting:'Arrangements and selections',
  series:'Arithmetic, geometric and binomial series',
  'add-vectors':'Vector lengths, directions and motion',
  calculus:'Differentiate, integrate and find areas',
  'al-p1':'Functions, coordinate geometry, trigonometry and calculus',
  'al-p3':'Advanced calculus, vectors, complex numbers and more',
  'al-mechanics':'Forces, motion, momentum, energy and power',
  'al-stat1':'Counting, probability, data and distributions',
  'al-stat2':'Poisson models, sampling and hypothesis tests'
};

const additionalTopics = new Set(courseUnits(COURSES['0606-only']));

function topicExample(course,id) {
  if (course?.track === 'nurture' && id === 'vectors') return 'Reflection, rotation and other transformations';
  if (course?.track === 'nurture' && id === 'geometry') return 'Angles, symmetry and shapes';
  return topicExamples[id];
}

function topicCard(course,id,members,practice) {
  const unit = UNITS[id];
  const done = members.filter(l => practice[l.id]?.complete).length;
  return `<a href="#library/${id}" class="topic-card card">
    ${tile(unit.icon,unit.tone)}
    <span><strong>${e(unitName(course,id))}</strong><small>${e(topicExample(course,id))}</small>
      <span class="topic-count">${members.length} ${members.length === 1 ? 'lesson' : 'lessons'}${done ? ' · ' + done + ' completed' : ''}</span></span>
    <span class="topic-open">${icon('chevron',16)}</span></a>`;
}

const sampleOptions = ['x = 3','x = 5','x = 7','x = 15'];

function samplePanel(picked) {
  const correct = picked === 1;
  return `<article class="hero-panel sample-panel" aria-labelledby="sample-title">
    <div class="sample-heading">
      ${tile('function','indigo',21)}
      <div><h2 id="sample-title">Try a sample question</h2><p>Algebra</p></div>
    </div>
    <p class="sample-prompt" id="sample-prompt">3x + 2 = 17. What is x?</p>
    <div class="sample-options" role="group" aria-labelledby="sample-prompt" aria-describedby="sample-feedback">
      ${sampleOptions.map((option,i) => `<button type="button" class="sample-option${picked === i ? (correct ? ' correct' : ' retry') : ''}" data-action="sample-answer" data-option="${i}" aria-pressed="${picked === i}">${option}${picked === i && correct ? icon('check',16) : ''}</button>`).join('')}
    </div>
    <p class="sample-feedback${picked === null ? '' : correct ? ' correct' : ' retry'}" id="sample-feedback" role="status">
      ${picked === null ? '' : correct ? 'Correct. Subtract 2, then divide 15 by 3.' : 'Start by subtracting 2 from both sides.'}
    </p>
  </article>`;
}

function studySnapshot(course,draft,report,step,total,done) {
  if (draft) {
    const answered = Object.values(draft.answers).filter(answer => typeof answer === 'string').length;
    return `<div class="hero-panel snapshot-panel">
      <div class="sample-heading">${tile('test','indigo')}<div><h2>Level test</h2><p>${e(course.label)}</p></div></div>
      <p class="snapshot-count"><strong>${answered}</strong><span>of ${total} questions answered</span></p>
      ${progress(answered,total,'Questions answered')}</div>`;
  }
  if (report && step) {
    return `<div class="hero-panel snapshot-panel">
      <div class="sample-heading">${tile('route','indigo')}<div><h2>Recommended lesson</h2><p>${e(unitName(course,courseUnit(course,step.lesson)))}</p></div></div>
      <p class="snapshot-lesson">${e(step.lesson.title)}</p>
      <p>${e(step.reason)}</p></div>`;
  }
  return `<div class="hero-panel snapshot-panel">
    <div class="sample-heading">${tile('book','indigo')}<div><h2>${e(course.label)}</h2><p>${e(courseLabel(course))}</p></div></div>
    <p class="snapshot-count"><strong>${done}</strong><span>of ${total} lessons completed</span></p>
    ${progress(done,total,'Lessons completed')}</div>`;
}

function curriculumExplorer(trackId) {
  const track = TRACKS[trackId];
  const course = COURSES['0580-' + trackId];
  const lessons = courseLessons(course);
  const units = courseUnits(course);
  const topics = trackId === 'fast' ? ['number','algebra','calculus'] : ['number','algebra','geometry'];
  return `<section class="choose-section" id="curricula">
    <div class="section-head"><div><h2>Which curriculum are you studying?</h2><p>Explore a track before choosing your syllabus.</p></div>
    ${button('course','Choose by exam code','text-button')}</div>
    <div class="curriculum-explorer">
      <div class="track-list" role="group" aria-label="Preview a curriculum track">
        ${Object.entries(TRACKS).map(([id,t])=>`<button type="button" class="track-row" aria-pressed="${id === trackId}" aria-controls="track-preview" data-action="preview-track" data-track="${id}">
          ${tile(t.icon,t.tone,23)}<span><strong>${t.name}</strong><small>${t.tag}</small></span>${icon('chevron',17)}</button>`).join('')}
      </div>
      <article class="track-preview" id="track-preview">
        <div class="track-preview-main">
          <h3>${track.name}</h3>
          <p>${track.description}</p>
          <p class="track-syllabus">${e(course.exams.join(' + '))} · <strong>${lessons.length} lessons</strong> · ${units.length} topics</p>
          <ul class="track-topics" aria-label="Sample topics">${topics.map(id=>'<li>'+e(unitName(course,id))+'</li>').join('')}</ul>
        </div>
        ${button('course','Choose ' + track.name,'primary','data-track="' + trackId + '"')}
      </article>
    </div>
  </section>`;
}

export function homeView(state,course,sampleChoice=null,enter=false,trackId='standard',curve=0,paused=false,level=courseLevel(course)) {
  const aLevel = level === 'alevel';
  const members = courseLessons(course,level);
  const units = courseUnits(course,level);
  const report = state.reports[course?.id];
  const draft = state.drafts[course?.id];
  const step = report ? buildPlan(course,report,state.practice).steps[0] : null;
  const done = members.filter(l => state.practice[l.id]?.complete).length;
  const xp = state.wallet.claimed.reduce((total,key) => total + (key.startsWith('lesson:') ? 50 : key.startsWith('quest:') ? 120 : 0),state.wallet.bonusXp);
  const regular = units.filter(id => !additionalTopics.has(id));
  const additional = units.filter(id => additionalTopics.has(id));
  const topicGrid = ids => '<div class="topic-grid">' + ids.map(id =>
    topicCard(course,id,members.filter(l => courseUnit(course,l) === id),state.practice)).join('') + '</div>';
  const topics = regular.length ? topicGrid(regular) : topicGrid(additional);
  const curriculumAction = button('course',course ? 'Change course' : 'Choose course','secondary','data-level="' + level + '"');
  const currentStudy = draft ? {
    title:'Resume your level test.', action:link('test','Resume test','secondary')
  } : step ? {
    title:step.lesson.title, action:link('lesson/' + step.lesson.id,'Continue studying','secondary')
  } : null;
  const [a,b] = curveRatios[curve];
  const snapshot = course ? studySnapshot(course,draft,report,step,members.length,done) : aLevel ? '' : samplePanel(sampleChoice);
  const score = report ? Object.values(report.results).filter(value => value === true).length + '/' + members.length : 'Pending';
  return `
    ${qualificationLinks(level)}
    <section class="study-hero${enter ? ' hero-enter' : ''}" aria-labelledby="study-title">
      <div class="hero-copy">
        <div class="study-context">${icon('compass',18)}${course ? e(courseLabel(course)) : 'Cambridge ' + LEVELS[level] + ' Mathematics'}</div>
        <h1 id="study-title">What do you want to learn?</h1>
        <p>Pick a topic or search for a lesson.</p>
        <form class="topic-search" id="topic-search-form" role="search">
          <label class="search-wrap">${icon('search',19)}<input id="home-search" name="lesson" type="search" aria-label="Search lessons" placeholder="${aLevel ? 'Try differentiation, momentum or sampling' : 'Try fractions, graphs or probability'}"></label>
          <button type="submit" class="btn primary">Search</button>
        </form>
      </div>
      <div class="hero-stage">
        <canvas data-hero-curve="${curve}" role="img" aria-label="Lissajous curve with a ${a} to ${b} frequency ratio"></canvas>
        <div class="curve-caption">
          <div><strong>Lissajous curve</strong><small>x = sin(${a}t + π/2), y = sin(${b}t)</small></div>
          <div class="curve-controls">
            ${button('cycle-curve','Ratio ' + a + ':' + b,'curve-btn','aria-label="Change frequency ratio, currently ' + a + ' to ' + b + '"')}
            ${button('toggle-curve',paused ? 'Play' : 'Pause','curve-btn','aria-label="' + (paused ? 'Play' : 'Pause') + ' curve animation"')}
          </div>
        </div>
      </div>
    </section>
    <section class="topics-section" aria-labelledby="topics-title">
      <div class="section-head topic-section-head"><div><h2 id="topics-title">${aLevel ? 'A Level maths' : regular.length ? 'IGCSE maths' : 'IGCSE Additional Mathematics'}</h2>
        <p>${units.length} ${aLevel ? 'papers' : 'topics'} · ${members.length} lessons${course ? ' on your course' : ''}</p></div>${curriculumAction}</div>
      ${topics}
      ${regular.length && additional.length ? `<details class="additional-topics card" ${course?.track === 'fast' ? 'open' : ''}>
        <summary>Additional Mathematics <span>${additional.length} topics</span></summary>${topicGrid(additional)}</details>` : ''}
    </section>
    ${currentStudy ? `<section class="topic-continue card" aria-label="Continue studying">${tile(draft ? 'test' : 'route','violet')}
      <div><small>${draft ? 'Saved level test' : 'Recommended next'}</small><strong>${e(currentStudy.title)}</strong></div>${currentStudy.action}</section>` : ''}
    <div class="home-details${snapshot ? '' : ' single'}">
      ${course ? `<section class="dashboard-progress">
        <div class="section-head"><div><h2>Your progress</h2><p>${e(courseLabel(course))}</p></div>${report ? link('path','My study path') : link('test',draft ? 'Resume level test' : 'Find my starting point')}</div>
        <div class="stats-grid">
          <div class="stat-card card">${tile('book','indigo')}<div><strong>${done}<small> / ${members.length}</small></strong><span>Lessons completed</span></div></div>
          <div class="stat-card card">${tile('target','mint')}<div><strong>${score}</strong><span>Level test</span></div></div>
          <div class="stat-card card">${tile('zap','amber')}<div><strong>${xp}</strong><span>Total XP</span></div></div>
        </div></section>` : aLevel ? aLevelCourseSection() : curriculumExplorer(trackId)}
      ${snapshot ? '<div class="home-snapshot">' + snapshot + '</div>' : ''}
    </div>`;
}

const routeMaterials = {mechanics:'Pure 1, Pure 3, Mechanics and Statistics 1',statistics:'Pure 1, Pure 3, Statistics 1 and Statistics 2'};

function aLevelCourseCards(action,selectedTrack) {
  return aLevelCourses.map(course=>`<button class="track-card" type="button" data-action="${action}"
    data-level="alevel" data-track="${course.track}" ${selectedTrack === undefined ? '' : 'aria-pressed="' + (selectedTrack === course.track) + '"'}>
    ${badge('9709 · Papers ' + course.papers,course.track === 'mechanics' ? 'amber' : 'mint')}
    <strong>${course.label}</strong><span class="track-desc">${routeMaterials[course.track]}</span>
  </button>`).join('');
}

function aLevelCourseSection() {
  return `<section><div class="section-head"><div><h2>Which A Level papers are you taking?</h2><p>Choose the route your school teaches for a matching level test.</p></div></div>
    <div class="course-route-options">${aLevelCourseCards('course')}</div></section>`;
}

export function courseDialog(selection,existing) {
  const {code,track,level,forTest} = selection;
  const course = selectedCourse(selection);
  const testLabel = course && existing?.id === course.id ? 'Continue to level test' : 'Save and take level test';
  const testAction = button('save-course',testLabel,forTest ? 'primary' : 'secondary','data-test="true"' + (course ? '' : ' disabled'));
  const browseAction = button('save-course','Save and browse lessons','primary',course ? '' : 'disabled');
  return `<div class="dialog-head">${tile('layers','violet',24)}<button type="button" class="icon-button" data-action="close-dialog" aria-label="Close curriculum picker">${icon('close')}</button></div>
    <h2 id="dialog-title">${forTest ? 'Choose your test course' : 'Choose your course'}</h2>
    <p>${forTest ? 'The level test uses the questions for the course you select.' : 'Select the Cambridge qualification and course you study.'}</p>
    <div class="course-level-picker" role="group" aria-label="Qualification">${Object.entries(LEVELS).map(([id,name])=>
      button('pick-level',name,'secondary','data-level="' + id + '" aria-pressed="' + (level===id) + '"')).join('')}</div>
    ${level === 'alevel' ? `<p class="field-label">Which 9709 route are you taking?</p>
      <div class="course-route-options" role="group" aria-label="A Level route">${aLevelCourseCards('pick-track',track)}</div>` : `
      <label class="field-label" for="exam-code">Which Cambridge syllabus are you studying?</label>
      <div class="select-wrap"><select id="exam-code"><option value="" ${code ? '' : 'selected'} disabled>Select an exam code</option>${Object.entries(EXAMS).filter(([id])=>id !== '9709').map(([id,exam]) => '<option value="' + id + '"' + (id === code ? ' selected' : '') + '>' + e(id + ' · ' + exam.title) + '</option>').join('')}</select>${icon('down',16)}</div>
      ${code && (code !== '0606' ? '<div class="dialog-tracks" role="group" aria-label="Study track">' + Object.keys(TRACKS).filter(id => code !== '0607' || id !== 'fast').map(id => trackCard(id,'data-action="pick-track" data-track="' + id + '" aria-pressed="' + (track === id) + '"')).join('') + '</div>' : '<div class="dialog-single">' + badge('0606','violet') + ' Study Additional Mathematics on its own.</div>')}`}
    <p class="dialog-detail">${icon('test',18)} <span>${course ? `<strong>${assessmentItems(course).length} level-test questions</strong> across ${courseUnits(course).length} ${level === 'alevel' ? 'papers' : 'topics'}. You can pause and resume.` : 'Choose a course above to continue.'}</span></p>
    <div class="actions">${forTest ? testAction : browseAction + testAction}</div>`;
}

export function libraryResults(state,course,filter,level=courseLevel(course)) {
  const terms = filter.query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const units = courseUnits(course,level);
  const found = courseLessons(course,level).filter(l =>
    (filter.unit === 'all' || courseUnit(course,l) === filter.unit) &&
    (filter.status === 'all' || Boolean(state.practice[l.id]?.complete) === (filter.status === 'complete')) &&
    terms.every(term => (l.title + ' ' + l.objectives + ' ' + l.method.join(' ') + ' ' + unitName(course,courseUnit(course,l))).toLowerCase().includes(term)));
  if (!found.length) return {count:'0 lessons',markup:empty('search','No lessons found','Try a different search or clear the filters.',button('clear-filter','Clear filters','secondary'))};
  const lessonTags = l => badge(tierLabel(l.tier),l.tier === 'core' ? 'mint' : l.tier === 'additional' ? 'amber' : 'violet') +
    (hasLessonVisual(l.id) ? badge('Interactive visual','sky') : '') +
    (state.practice[l.id]?.complete ? badge('Completed','mint') : '');
  const count = found.length + (found.length === 1 ? ' lesson' : ' lessons');
  if (filter.unit !== 'all') {
    const markup = `<ul class="topic-lesson-list">${found.map(l => `<li><a href="#lesson/${l.id}" class="topic-lesson card">
      <span class="topic-lesson-copy"><strong>${e(l.title)}</strong><small>${e(l.objectives)}</small></span>
      <span class="lesson-tags">${lessonTags(l)}</span>${icon('chevron',17)}</a></li>`).join('')}</ul>`;
    return {count,markup};
  }
  const markup = units.map(id => {
      const list = found.filter(l => courseUnit(course,l) === id);
      if (!list.length) return '';
      const unit = UNITS[id];
      return `<section class="library-unit"><div class="section-head library-section-head"><div>${tile(unit.icon,unit.tone)}<h2>${unitName(course,id)}</h2></div></div>
        <div class="lesson-grid">${list.map(l => `<a href="#lesson/${l.id}" class="lesson-card card"><span class="lesson-tags">${lessonTags(l)}</span><h3>${e(l.title)}</h3><p>${e(l.objectives)}</p><span class="lesson-card-foot">${icon('book',16)} Worked lesson <span>·</span> ${l.practice.length} practice questions</span></a>`).join('')}</div></section>`;
    }).join('');
  return {count,markup};
}

export function libraryView(state,course,filter,level=courseLevel(course)) {
  const results = libraryResults(state,course,filter,level);
  const unit = filter.unit !== 'all' ? filter.unit : null;
  return `${qualificationLinks(level,'library')}
    ${unit ? '<div class="breadcrumb"><a href="#home/' + level + '">All topics</a></div>' : ''}
    ${pageHead('',unit ? e(unitName(course,unit)) : LEVELS[level] + ' lesson library',
      unit ? e(topicExample(course,unit)) + '.' : 'Learn the method, follow a worked example and try it yourself.',
      unit ? '' : button('course',course ? 'Change course' : 'Choose course','secondary','data-level="' + level + '"'))}
    <div class="filters card">
      <label class="search-wrap">${icon('search',19)}<input type="search" id="lesson-search" placeholder="Search lessons…" value="${e(filter.query)}" aria-label="Search lessons"></label>
      <label class="select-wrap"><select id="unit-filter" aria-label="Topic"><option value="all">All topics</option>${courseUnits(course,level).map(id => `<option value="${id}" ${filter.unit === id ? 'selected' : ''}>${unitName(course,id)}</option>`).join('')}</select>${icon('down',16)}</label>
      <label class="select-wrap"><select id="status-filter" aria-label="Completion"><option value="all">All lessons</option><option value="remaining" ${filter.status === 'remaining' ? 'selected' : ''}>To do</option><option value="complete" ${filter.status === 'complete' ? 'selected' : ''}>Completed</option></select>${icon('down',16)}</label>
    </div>
    <div class="result-count" id="lesson-count" role="status" aria-atomic="true">${results.count}</div>
    <div id="lesson-results">${results.markup}</div>`;
}

export function answerChoices(options,picked,action,attributes='',marked) {
  return `<div class="answers" role="group" aria-label="Answer options">${options.map((option,i) => {
    const status = marked && option === marked.answer ? ' correct' : marked && picked === option ? ' wrong' : picked === option ? ' chosen' : '';
    return `<button type="button" class="answer${status}" data-action="${action}" data-option="${i}" ${attributes} ${marked?.locked ? 'disabled' : ''} aria-pressed="${option === picked}"><span class="option-letter">${String.fromCharCode(65 + i)}</span><span>${e(option)}</span>${status === ' correct' ? icon('check',17) : status === ' wrong' ? icon('close',17) : ''}</button>`;
  }).join('')}</div>`;
}

const diagramCaptions = {
  coordinates:'Line y = 2x through (1, 2) and (4, 8).',
  graphs:'Parabola y = x² − 4, crossing at x = −2 and x = 2.',
  pythagoras:'A right triangle with legs 5 and 12 and hypotenuse 13.',
  'right-trig':'A ramp of length 4 and vertical rise 2, at an angle of 30°.',
  'circle-right':'A triangle inscribed in a semicircle, with a right angle opposite the diameter.',
  'motion-graphs':'A speed–time graph from 0 to 12 m/s in 8 seconds.',
  'circle-coordinates':'Circle centred at (3, −2) with radius 5.',
  integration:'The shaded area under y = 3x² + 1 from x = 0 to x = 2.'
};

export function lessonView(state,course,id,hints,shuffle,level=courseLevel(course)) {
  const l = LESSONS[id];
  const lessons = courseLessons(course,level);
  if (!l || !lessons.includes(l)) return `${pageHead('','Lesson unavailable','Open a lesson from your current course.')}${link('library/' + level,'Back to library')}`;
  const unitId = courseUnit(course,l);
  const unit = UNITS[unitId];
  const saved = state.practice[id];
  const solved = saved?.questions.filter(question => question?.solved).length ?? 0;
  const total = l.practice.length;
  const allSolved = solved === total;
  const gearHints = slotBuff(state.wallet.equipped,'head');
  const next = lessons.find(other => other.id !== id && courseUnit(course,other) === unitId && !state.practice[other.id]?.complete);
  const prerequisites = l.requires.map(id => LESSONS[id]).filter(required => lessons.includes(required));
  const solution = typeof Intl.Segmenter === 'function'
    ? Array.from(new Intl.Segmenter('en',{granularity:'sentence'}).segment(l.example[1]), part => part.segment.trim())
    : [l.example[1]];
  return `
    <div class="breadcrumb"><a href="#library/${level}">${LEVELS[level]} lessons</a>${icon('chevron',13)}<a href="#library/${unitId}">${e(unitName(course,unitId))}</a></div>
    ${pageHead(badge(tierLabel(l.tier),unit.tone),e(l.title),e(l.objectives),saved?.complete ? badge('Lesson complete','mint') : '')}
    <div class="lesson-layout">
      <div class="lesson-main">
        <section class="card lesson-notes"><div class="inline-head">${tile(unit.icon,unit.tone)}<h2>Learn the method</h2></div><ul class="method-list">${l.method.map(line => '<li>' + e(line) + '</li>').join('')}</ul></section>
        ${lessonVisual(id)}
        <section class="card worked"><div class="inline-head">${tile('bulb','amber')}<h2>Worked example</h2></div>
          <h3>${e(l.example[0])}</h3>
          ${diagramCaptions[id] ? '<figure><canvas data-diagram="' + id + '" role="img" aria-label="' + e(diagramCaptions[id]) + '"></canvas><figcaption>' + e(diagramCaptions[id]) + '</figcaption></figure>' : ''}
          <div class="worked-solution"><strong>Solution</strong>${solution.map(line => '<p>' + e(line) + '</p>').join('')}</div></section>
        <section class="lesson-practice" id="practice-questions"><div class="section-head"><div><h2>Try it yourself</h2>
          <p>${allSolved ? 'You solved all ' + total + ' practice questions.' : saved?.complete ? 'Try the remaining questions for extra practice.' : 'Solve all ' + total + ' questions to complete this lesson.'}</p></div></div>
          ${l.practice.map((q,i) => {
            const attempt = saved?.questions[i];
            const options = shuffle(q,id + ':' + i);
            const shown = hints[id + ':' + i] ?? 0;
            const maxHints = Math.min(l.method.length,1 + gearHints);
            return `<div class="card practice-question"><div class="question-top">${badge('Question ' + (i+1) + ' of ' + total,'neutral')}${badge(attempt?.solved ? 'Solved' : '+12 GIS Points',attempt?.solved ? 'mint' : 'amber')}</div>
            <h3>${e(q.prompt)}</h3>${answerChoices(options,attempt?.last,'lesson-answer','data-question="' + i + '"',attempt?.solved ? {answer:q.answer,locked:true} : attempt ? {answer:null} : null)}
            ${attempt ? '<div class="answer-feedback ' + (attempt.solved ? 'good' : 'retry') + '" role="status" tabindex="-1" data-feedback="' + i + '">' + icon(attempt.solved ? 'check' : 'bulb',19) + '<span>' + (attempt.solved ? e(q.why) : 'Try again. Check the worked example or use a hint.') + '</span></div>' : ''}
            ${shown ? '<div class="shown-hints">' + l.method.slice(0,shown).map(h => '<p>' + e(h) + '</p>').join('') + '</div>' : ''}
            ${!attempt?.solved && shown < maxHints ? button('hint',icon('bulb',17) + (shown ? ' Another hint' : ' Show a hint'),'text-button','data-question="' + i + '"') : ''}</div>`;
          }).join('')}
        </section>
        ${saved?.complete && next ? '<div class="actions">' + link('lesson/' + next.id,'Next lesson · ' + e(next.title),'primary') + '</div>' : ''}
      </div>
      <aside class="lesson-aside">
        <div class="card side-panel">${tile('target','violet')}<h2>Lesson progress</h2>
          ${progress(solved,total,'Practice questions solved')}
          <p>${solved} of ${total} solved</p>${saved?.complete ? '' : '<p class="lesson-earn">' + icon('coin',17) + ' +10 base GIS Points on completion</p>'}
          <div class="actions">${hasLessonVisual(id) ? '<a class="btn secondary" href="#lesson-visual" data-scroll="lesson-visual">Explore visual</a>' : ''}
          ${allSolved ? '' : '<a class="btn secondary" href="#practice-questions" data-scroll="practice-questions">Go to practice</a>'}</div>
        </div>
        ${prerequisites.length ? '<div class="card side-panel"><h2>Review these skills first</h2><ul class="simple-links">' + prerequisites.map(required => '<li><a href="#lesson/' + required.id + '">' + e(required.title) + '</a></li>').join('') + '</ul></div>' : ''}
      </aside>
    </div>`;
}

export function testView(state,course,shuffle) {
  if (!course) return `${pageHead('','Level test','Find out what to study first.')}
    <section class="card test-intro required-course">
      <div>${tile('test','violet',25)}<h2>Choose a course to start</h2>
      <p>Your test questions come from the course you select.</p></div>
      <div class="course-route-options" aria-label="Choose qualification">
        ${button('course','Choose IGCSE course','secondary','data-level="igcse"')}
        ${button('course','Choose A Level course','secondary','data-level="alevel"')}
      </div>
    </section>`;
  const draft = state.drafts[course.id];
  const report = state.reports[course.id];
  const items = assessmentItems(course,draft?.assessmentVersion);
  const units = courseUnits(course);
  const aLevel = courseLevel(course) === 'alevel';
  const change = button('course','Change course','secondary');
  if (!draft) return `${pageHead(e(courseLabel(course)),'Level test','Answer a question for each lesson in your selected course.',change)}
    <section class="card test-intro"><div>${tile('test','violet',25)}<h2>${report ? 'Ready for another check-in?' : 'Find your starting point'}</h2>
    <p>${items.length} questions cover ${units.length} ${aLevel ? 'papers' : 'topics'}. Your answers are saved as you go. Use paper for working and skip any question you want to revisit.</p>
    <div class="actions">${button('start-test',report ? 'Retake level test' : 'Begin level test')}${report ? link('path','View current study path') : ''}</div></div>
    <div class="test-topics"><h3>${aLevel ? 'Papers on this test' : 'Topics on this test'}</h3><div class="badge-list">${units.map(id=>badge(unitName(course,id),UNITS[id].tone)).join('')}</div></div></section>`;
  const n = draft.index;
  const l = items[n];
  const currentUnit = courseUnit(course,l);
  const answered = Object.values(draft.answers).filter(x=>x!==null).length;
  const reviewed = Object.keys(draft.answers).length;
  const options = shuffle(l.diagnostic,l.id + ':' + draft.seed);
  return `${pageHead(e(courseLabel(course)),'Level test','Your answers save automatically as you go.',link('home','Pause test') + change)}
    <div class="test-layout">
      <section class="card test-question">
        <div class="question-top">${badge(unitName(course,currentUnit),UNITS[currentUnit].tone)}<span>Question ${n+1} of ${items.length}</span></div>
        ${progress(reviewed,items.length,'Questions visited and answered or skipped')}
        <h2 id="active-question" tabindex="-1">${e(l.diagnostic.prompt)}</h2>
        ${answerChoices(options,draft.answers[l.id],'test-answer')}
        <div class="question-controls">
          ${button('test-move','Previous','secondary','data-step="-1" ' + (n === 0 ? 'disabled' : ''))}
          <div class="actions">${button('test-skip','Skip question','text-button')}
          ${n === items.length-1 ? button('confirm-test','Finish test','primary') : button('test-move','Next question','primary','data-step="1" ' + (!Object.hasOwn(draft.answers,l.id) ? 'disabled' : ''))}</div>
        </div>
      </section>
      <aside class="card side-panel test-map"><h2>Test progress</h2><p>${answered} of ${items.length} answered${reviewed-answered ? ' · ' + (reviewed-answered) + ' skipped' : ''}</p>
        <div class="test-map-list" aria-label="${aLevel ? 'Jump to a paper' : 'Jump to a topic'}">${units.map(id=>{
          const list = items.filter(x => courseUnit(course,x) === id);
          const count = list.filter(x=>typeof draft.answers[x.id] === 'string').length;
          const next = list.find(x=>!Object.hasOwn(draft.answers,x.id)) ?? list.find(x=>draft.answers[x.id] === null) ?? list[0];
          return '<button type="button" class="map-row' + (currentUnit === id ? ' selected' : '') + '" data-action="test-jump" data-index="' + items.indexOf(next) + '"><span>' + e(unitName(course,id)) + '</span><strong>' + count + '/' + list.length + '</strong></button>';
        }).join('')}</div>${reviewed === items.length && n < items.length - 1 ? button('confirm-test','Finish test','secondary') : ''}
      </aside>
    </div>`;
}

export function pathView(state,course,review=false) {
  const report = state.reports[course?.id];
  if (!report) return `${pageHead('','My study path','The AI study coach uses your answers to plan what to learn next.')}
    ${empty('sparkle','Your path starts with a level test','Complete the test for your course to find your strongest topics and the skills to revisit.',link('test',course && state.drafts[course.id] ? 'Resume level test' : 'Take level test','primary'))}`;
  const {steps,topics} = buildPlan(course,report,state.practice);
  const items = assessmentItems(course,report.assessmentVersion);
  const total = items.length;
  const correct = Object.values(report.results).filter(x=>x===true).length;
  const skipped = Object.values(report.results).filter(x=>x===null).length;
  const weak = topics.filter(t => t.answered && t.score / t.answered < 0.6).sort((a,b) => (a.score / a.answered) - (b.score / b.answered));
  const headline = steps.length ? 'Start with ' + steps[0].lesson.title.toLowerCase() + '.' : 'You’ve completed every lesson on this track.';
  const rows = group => group.map(({lesson,reason}) => `<article class="path-step">
      ${tile(UNITS[courseUnit(course,lesson)].icon,UNITS[courseUnit(course,lesson)].tone)}
      <div><h3>${e(lesson.title)}</h3><p>${e(reason)}</p></div>${link('lesson/' + lesson.id,'Open lesson')}</article>`).join('');
  return `${pageHead(e(courseLabel(course)),'My study path','Recommendations update as you finish lessons and practise.',link('test','Level test'))}
    <section class="coach-card">
      <div class="coach-copy"><span class="hero-label">${icon('sparkle',17)} AI study coach</span><h2>${e(headline)}</h2><p>${weak.length ? 'Give ' + e(weak.slice(0,2).map(t=>unitName(course,t.id)).join(' and ').toLowerCase()) + ' some extra time.' : 'Keep practising to build confidence across the syllabus.'}</p>
        ${steps.length ? link('lesson/' + steps[0].lesson.id,'Start first lesson','hero-button') : link('practice','Open practice lab','hero-button')}</div>
      <div class="coach-score"><small>Level test</small><strong>${correct}<span>/${total}</span></strong><span>correct${skipped ? ' · ' + skipped + ' skipped' : ''}</span><span>${formatDate(report.at)}</span></div>
    </section>
    <div class="path-layout">
      <section class="card path-steps"><h2>Suggested lessons</h2>
        ${steps.length ? rows(steps.slice(0,6)) : '<p>Your course is complete. Keep skills fresh in the practice lab.</p>'}
        ${steps.length > 6 ? '<details><summary>See all ' + steps.length + ' remaining lessons</summary>' + rows(steps.slice(6)) + '</details>' : ''}
        <details class="model-note"><summary>How the study coach works</summary><p>An on-device Bayesian model estimates each skill using level-test and practice answers. The plan brings forward skills you missed and the lessons they build on. A single question gives an initial estimate.</p></details>
      </section>
      <section class="card topic-scores"><h2>Level-test results</h2><p>Correct answers by topic</p>
        ${topics.map(t => '<div class="score-topic"><div><span>' + e(unitName(course,t.id)) + '</span><strong>' + t.score + '/' + t.total + '</strong></div>' + progress(t.score,t.total,unitName(course,t.id) + ' correct answers') + (t.total > t.answered ? '<small>' + (t.total-t.answered) + ' skipped</small>' : '') + '</div>').join('')}
      </section>
    </div>
    <details class="card answer-review" ${review ? 'open' : ''}><summary>Review all level-test answers</summary>
      ${items.map(l => {
        const r = report.results[l.id];
        const answer = report.answers[l.id];
        return `<article><div class="question-top">${badge(unitName(course,courseUnit(course,l)),UNITS[courseUnit(course,l)].tone)}${badge(r === true ? 'Correct' : r === false ? 'Needs review' : 'Skipped',r === true ? 'mint' : 'amber')}</div>
        <h3>${e(l.diagnostic.prompt)}</h3><p><strong>Your answer</strong> ${e(answer ?? 'Skipped')} · <strong>Correct answer</strong> ${e(l.diagnostic.answer)}</p><p>${e(l.diagnostic.why)}</p><a href="#lesson/${l.id}">Study ${e(l.title.toLowerCase())}</a></article>`;
      }).join('')}</details>`;
}

export const art = item => {
  const artId = item.legacy ? ITEMS.find(other => other.slot === item.slot && other.rarity === item.rarity)?.id : item.id;
  return artId ? `<img class="item-art" src="${asset(`assets/cosmetics/${artId}.png`)}" alt="" loading="lazy" decoding="async">` : tile('box','neutral');
};
const rarityFor = item => RARITIES.find(rarity=>rarity.id === item.rarity);
const rarityTag = item => badge(rarityFor(item).name,'rarity-' + item.rarity);
const gearCount = (wallet,id) => wallet.gearCounts?.[id] ?? Number(wallet.owned.includes(id));
const copyLabel = count => count + (count === 1 ? ' copy' : ' copies');
const rewardText = item => {
  const slot = SLOTS.find(x=>x.id === item.slot);
  return '+' + item.bonus + slot.suffix + ' ' + slot.bonus;
};

export function gearView(state,tab,crateId) {
  const wallet = state.wallet;
  const {crate,pool,totalWeight} = crateOdds(crateId);
  const collection = wallet.owned.map(itemById).filter(item => item && gearCount(wallet,item.id) > 0);
  const totalCopies = collection.reduce((total,item) => total + gearCount(wallet,item.id),0);
  const collectedStyles = collection.filter(item => !item.legacy).length;
  const crateStyles = pool.filter(({item}) => gearCount(wallet,item.id) > 0).length;
  const slots = SLOTS.map(slot => {
    const item = itemById(wallet.equipped[slot.id]);
    return `<div class="gear-slot">${item ? art(item) : tile('box','neutral',18)}
      <span><strong>${slot.label}</strong><small>${item ? e(item.name) : 'Empty slot'}</small>${item ? '<small>' + e(rewardText(item)) + '</small>' : ''}</span>${item ? button('unequip','Remove','text-button','data-slot="' + slot.id + '" aria-label="Remove ' + e(item.name) + '"') : ''}</div>`;
  }).join('');
  const dropCard = (item,manage) => {
    const count = gearCount(wallet,item.id);
    const equipped = wallet.equipped[item.slot] === item.id;
    const sellValue = manage ? gearSellValue(item) : 0;
    return `<article class="drop card">
      <div class="gear-card-meta">${rarityTag(item)}${badge(copyLabel(count),count ? 'mint' : 'neutral')}</div>
      ${art(item)}
      <h3>${e(item.name)}</h3><p>${e(rewardText(item))}</p>
      ${manage ? `<div class="gear-card-actions">
        ${equipped ? badge('Equipped','mint') : button('equip','Equip','secondary','data-item="' + item.id + '" aria-label="Equip ' + e(item.name) + '"')}
        ${sellValue > 0 ? button('sell-gear','Sell for ' + sellValue + ' GIS Points','text-button','data-gear="' + item.id + '" aria-label="Sell one copy of ' + e(item.name) + ' for ' + sellValue + ' GIS Points"') : ''}
      </div>` : ''}
    </article>`;
  };
  return `${pageHead('','Gear shop','Open PyQuest crates, collect gear and sell copies for GIS Points.',coinLabel(wallet.coins))}
    <div class="tabs" role="group" aria-label="Gear shop sections">${['crates','closet'].map(id=>'<button type="button" class="' + (tab === id ? 'active' : '') + '" data-action="gear-tab" data-tab="' + id + '" aria-pressed="' + (tab === id) + '">' + icon(id === 'crates' ? 'box' : 'person',17) + (id === 'crates' ? 'Cosmetic crates' : 'My character') + '</button>').join('')}</div>
    ${tab === 'closet' ? `<section class="closet-layout">
      <div class="avatar-card"><div><h2>My character</h2><p>${collectedStyles} of ${ITEMS.length} crate styles collected</p></div>${renderEquippedAvatar(wallet,'mathquest')}</div>
      <div class="card equipment"><h2>Equipped gear</h2>${slots}</div>
    </section><section class="collection"><div class="section-head"><div><h2 id="gear-collection" tabindex="-1">My collection</h2><p>${copyLabel(totalCopies)} in your collection. Equip an item or sell one copy at a time.</p></div></div>
      ${collection.length ? '<div class="drop-grid">' + collection.map(item => dropCard(item,true)).join('') + '</div>' : empty('gift','Your collection is empty','Earn GIS Points from practice and spend them on your first crate.',button('gear-tab','Browse crates','primary','data-tab="crates"'))}</section>` : `
    <div class="crate-picker" role="group" aria-label="Crate category">${CRATES.map(c=>`<button type="button" class="crate-option ${c.id === crateId ? 'active' : ''}" data-action="crate" data-crate="${c.id}" aria-pressed="${c.id === crateId}"><img src="${asset(`assets/cosmetics/crate-${c.theme}.png`)}" alt="" loading="lazy"><span>${e(c.name.replace(' Crate',''))}</span></button>`).join('')}</div>
    <div class="shop-layout">
      <section class="crate-feature crate-${crate.theme}">
        <div class="crate-photo"><img src="${asset(`assets/cosmetics/crate-${crate.theme}.png`)}" alt=""></div>
        <div><h2>${e(crate.name)}</h2><p>${e(crate.desc)}</p>
        <div class="crate-inventory">${crateStyles} of ${pool.length} styles collected</div>
        <div class="actions">${button('open-crate','Open for ' + crate.cost + ' GIS Points','hero-button',wallet.coins < crate.cost ? 'disabled' : '')}</div>
        ${wallet.coins < crate.cost ? '<p class="cost-note">Earn ' + (crate.cost - wallet.coins) + ' more GIS Points to open it.</p>' : ''}
        </div></section>
      <section class="card odds-panel"><h2>Drop chances</h2><p>Each opening can give you another copy. The odds stay the same as your collection grows.</p>
        ${RARITIES.map(rarity => {
          const found = pool.find(row=>row.item.rarity === rarity.id);
          const chance = found ? 100 * found.weight / totalWeight : 0;
          return '<div class="odds-row">' + badge(rarity.name,'rarity-' + rarity.id) + '<strong>' + chance.toFixed(2) + '%</strong></div>';
        }).join('')}</section>
    </div>
    <section class="collection"><div class="section-head"><div><h2>What’s inside</h2><p>Each rarity comes with a different learning boost.</p></div></div>
      <div class="drop-grid">${pool.map(({item}) => dropCard(item,false)).join('')}</div></section>`}
    <section class="card earn-panel"><div class="inline-head">${tile('coin','amber')}<h2>Earn GIS Points</h2></div>
      <p>A new correct practice question earns 3 GIS Points and finishing a lesson earns 10 before gear bonuses. Try the practice lab for checkpoint, challenge and pair sprint rewards.</p>
      <div class="actions">${link('library','Browse lessons')}${link('practice','Practice lab')}</div></section>`;
}

export function crateDialog(item,count=1) {
  return `<div class="dialog-head">${rarityTag(item)}<button type="button" class="icon-button" data-action="close-dialog" aria-label="Close crate result">${icon('close')}</button></div>
    <div class="crate-reveal">${art(item)}<h2 id="dialog-title">You found ${e(item.name)}!</h2><p>${e(rewardText(item))}</p><p>${copyLabel(count)} in your collection</p></div>
    <div class="actions centered">${button('equip','Equip now','primary','data-item="' + item.id + '" data-reveal="true"')}${button('close-dialog','Keep in collection','secondary')}</div>`;
}

export function profileView(state,course,storage) {
  return `${pageHead('','Local profile','Manage your curriculum, saved progress and backups.')}
    <div class="profile-grid">
      <section class="card side-panel">${tile('layers','violet')}<h2>Curriculum</h2><p>${course ? e(course.label + ' · ' + courseLabel(course)) : 'Choose an exam code and study track.'}</p>${button('course',course ? 'Change curriculum' : 'Choose curriculum','secondary')}</section>
      <section class="card side-panel">${tile('shield','mint')}<h2>${storage ? 'Saved in this browser' : 'Browser storage is unavailable'}</h2>
        <p>${storage ? 'Download your test answers, lesson records and gear collection. GIS Points stay in this browser.' : 'Progress is available for this session. Download a backup before closing the page.'}</p>
        <div class="actions">${button('export','Download backup','primary')}${button('import','Restore backup','secondary')}</div>
        <input type="file" id="backup-input" accept=".json,application/json" hidden></section>
    </div>
    <section class="card sources"><h2>Syllabus sources</h2><p>IGCSE tracks are Nurture (Core), Standard (Extended), and Fast Track (Extended plus Additional Mathematics). The Cambridge 9709 A Level offers a Mechanics route and a Statistics route.</p>
      <ul>${Object.entries(EXAMS).map(([code,exam]) => '<li><a target="_blank" rel="noopener noreferrer" href="' + exam.source + '">' + e(exam.title) + ' (' + code + ')</a> · ' + (code === '9709' ? '2026–2027' : '2025–2027') + '</li>').join('')}</ul>
      <p>Lessons and questions are original practice material. Gear illustrations and reward rules come from PyQuest.</p>
    </section>`;
}

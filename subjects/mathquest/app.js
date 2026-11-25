import {ASSESSMENT_VERSION, COURSES, LEVELS, LESSONS, assessmentItems, courseLessons, courseLevel, courseUnits, questionByKey, selectedCourse, unitLevel} from './curriculum.js';
import {current, update, hasStorage, KEY, syncFromStorage, decodeBackup, choices} from './store.js';
import {award, openCrate, randomInt, sellGear} from './rewards.js';
import {CRATES, SLOTS, gearSellValue, itemById, slotBuff} from './game-items.js';
import {button, chrome, e, icon, tile} from './ui.js';
import {homeView, courseDialog, libraryView, libraryResults, lessonView, testView, pathView, gearView, crateDialog, profileView} from './views.js';
import {arenaView, createRound, markRound, MODES} from './arena.js';
import {drawDiagrams} from './diagrams.js';
import {curveRatios, mountHeroCurve} from './hero-curve.js';
import {mountLessonVisual} from './lesson-visuals.js';

const main = document.querySelector('#content');
const sidebar = document.querySelector('#sidebar');
const topbar = document.querySelector('#topbar');
const dialog = document.querySelector('#dialog');
const footer = document.querySelector('.footer');
const toast = document.querySelector('#toast');
const routes = new Set(['home','library','lesson','test','path','practice','gear','profile']);
const filter = {unit:'all',query:'',status:'all'};
const hints = {};
let selection, pendingBackup, previousFocus;
let gearTab = 'crates', crateId = CRATES[0].id, practiceUnit = null;
let menuOpen = false, busy = false, toastTimer;
let renderedRoute;
let sampleChoice = null;
let featuredTrack = 'standard', curve = 0, curvePaused = matchMedia('(prefers-reduced-motion: reduce)').matches;

const courseNow = () => COURSES[current().courseId];
const seed = () => randomInt(0x7fffffff);
const route = () => {
  const [page,id] = location.hash.slice(1).split('/');
  return {page:routes.has(page) ? page : 'home',id};
};

function learningContext(page,id,active=courseNow()) {
  const routeLevel = page === 'lesson' ? unitLevel(LESSONS[id]?.unit)
    : Object.hasOwn(LEVELS,id) ? id : page === 'library' ? unitLevel(id) : undefined;
  const level = routeLevel ?? courseLevel(active);
  return {level,course:courseLevel(active) === level ? active : undefined};
}

function notify(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('shown');
  toastTimer = setTimeout(()=>toast.classList.remove('shown'),4200);
}

function order(items, key) {
  let hash = 2166136261;
  for (const char of String(key)) hash = Math.imul(hash ^ char.charCodeAt(0),16777619);
  const result = [...items];
  for (let i=result.length-1;i>0;i--) {
    hash ^= hash << 13; hash ^= hash >>> 17; hash ^= hash << 5;
    const j = (hash >>> 0) % (i+1);
    [result[i],result[j]] = [result[j],result[i]];
  }
  return result;
}
const shuffle = (question,key) => order(choices(question),key);

function setMenu(value) {
  menuOpen = value;
  document.body.classList.toggle('menu-open',value);
  topbar.querySelector('.mobile-menu')?.setAttribute('aria-expanded',String(value));
  main.inert = value;
  if (footer) footer.inert = value;
}

function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;
  if (menuOpen) setMenu(false);
  target.scrollIntoView({block:'start'});
  const focusTarget = target.matches('[tabindex="-1"]') ? target
    : target.querySelector('input[type="range"]') ?? target.querySelector('button:not(:disabled)');
  focusTarget?.focus({preventScroll:true});
}

function render(focus, resetScroll=false) {
  const before = document.activeElement;
  const currentRoute = location.hash;
  const {page,id} = route();
  const state = current();
  const course = courseNow();
  const browse = learningContext(page,id,course);
  if (page === 'library') filter.unit = courseUnits(browse.course,browse.level).includes(id) ? id : 'all';
  const practiceUnits = courseUnits(course);
  if (!practiceUnits.includes(practiceUnit)) practiceUnit = practiceUnits[0];
  const shell = chrome(page,state,hasStorage());
  if (sidebar.innerHTML !== shell.sidebar) sidebar.innerHTML = shell.sidebar;
  topbar.innerHTML = shell.topbar;
  setMenu(menuOpen);
  const views = {
    home:()=>homeView(state,browse.course,sampleChoice,renderedRoute !== currentRoute,featuredTrack,curve,curvePaused,browse.level),
    library:()=>libraryView(state,browse.course,filter,browse.level),
    lesson:()=>lessonView(state,browse.course,id,hints,shuffle,browse.level),
    test:()=>testView(state,course,shuffle),
    path:()=>pathView(state,course),
    practice:()=>arenaView(state,course,practiceUnit,shuffle),
    gear:()=>gearView(state,gearTab,crateId),
    profile:()=>profileView(state,course,hasStorage())
  };
  main.innerHTML = views[page]();
  drawDiagrams();
  mountLessonVisual();
  mountHeroCurve(curvePaused);
  if (resetScroll || renderedRoute !== currentRoute) {
    if (currentRoute === '#website-help') scrollToSection('website-help');
    else {
      window.scrollTo(0,0);
      (focus ? main.querySelector(focus) ?? main : main).focus({preventScroll:true});
    }
  } else if (focus && !dialog.open) {
    (main.querySelector(focus) ?? main).focus({preventScroll:true});
  } else if (!dialog.open && before?.closest('main') && !before.isConnected && document.activeElement === document.body) {
    main.focus({preventScroll:true});
  }
  renderedRoute = currentRoute;
}

function go(target,focus) {
  setMenu(false);
  const next = '#' + target;
  if (location.hash !== next) history.pushState(null,'',next);
  render(focus,true);
}

function showDialog(markup,focus) {
  if (!dialog.open) previousFocus = document.activeElement;
  dialog.innerHTML = markup;
  if (!dialog.open) dialog.showModal();
  if (focus) dialog.querySelector(focus)?.focus();
}

function closeDialog() {
  if (dialog.open) dialog.close();
}

dialog.addEventListener('close',()=>{
  if (previousFocus?.isConnected) previousFocus.focus({preventScroll:true});
  pendingBackup = null;
});

function showCourse(data={}) {
  const existing = courseNow();
  const {page,id} = route();
  const level = data.level ?? (data.exam === '9709' ? 'alevel' : data.exam || ['nurture','standard','fast'].includes(data.track) ? 'igcse' : learningContext(page,id).level);
  const matching = courseLevel(existing) === level ? existing : undefined;
  const code = level === 'alevel' ? '9709' : data.exam ?? matching?.code ?? '';
  const track = data.track ?? (code === matching?.code ? matching?.track : '') ?? '';
  selection = {level,code:code === '0606' && data.track ? '' : code,track,forTest:page === 'test'};
  if (selection.code === '0607' && track === 'fast') selection.code = '';
  showDialog(courseDialog(selection,existing),level === 'alevel' ? '[data-action="pick-track"]' : '#exam-code');
}

function confirmation(title,copy,confirmAction,confirmLabel,other,attributes='') {
  showDialog(`<div class="dialog-head">${tile('test','violet',23)}<button type="button" class="icon-button" data-action="close-dialog" aria-label="Close dialog">${icon('close')}</button></div>
    <h2 id="dialog-title">${e(title)}</h2><p>${e(copy)}</p>
    <div class="actions">${button(confirmAction,confirmLabel,'primary',attributes)}${other ?? button('close-dialog','Cancel','secondary')}</div>`,'[data-action="close-dialog"]');
}

function newDraft() {
  return {seed:seed(),index:0,answers:{},assessmentVersion:ASSESSMENT_VERSION};
}

async function saveCourse(start) {
  const chosen = selection && selectedCourse(selection);
  if (!chosen) return;
  const {id} = chosen;
  await update(s=>{
    s.courseId = id;
    if (start && !s.drafts[id] && !s.reports[id]) s.drafts[id] = newDraft();
  });
  filter.unit='all'; filter.query=''; filter.status='all';
  closeDialog();
  go(start ? 'test' : 'library');
}

async function practiceAnswer(id,i,option) {
  const l = LESSONS[id];
  const browse = learningContext('lesson',id);
  if (!l || !courseLessons(browse.course,browse.level).includes(l) || !l.practice[i]) return;
  const q = l.practice[i];
  const answer = shuffle(q,id+':'+i)[option];
  if (answer === undefined) return;
  const result = await update(s=>{
    const entry = s.practice[id] ??= {questions:l.practice.map(()=>null),complete:false};
    const seen = entry.questions[i];
    if (seen?.solved) return {coins:0};
    const correct = answer === q.answer;
    entry.questions[i] = {attempts:(seen?.attempts ?? 0) + 1, firstCorrect:seen ? seen.firstCorrect : correct, solved:correct, last:answer};
    let coins = correct ? award(s.wallet,'igcse',id + ':' + i) : 0;
    const completed = entry.questions.every(q => q?.solved);
    if (completed && !entry.complete) coins += award(s.wallet,'lesson',id);
    if (completed) entry.complete = true;
    return {coins,completed};
  });
  render(answer === q.answer ? '[data-feedback="' + i + '"]' : '[data-action="lesson-answer"][data-question="' + i + '"][data-option="' + option + '"]');
  if (result.coins) notify(result.completed ? 'Lesson complete · +' + result.coins + ' PyCoins' : '+' + result.coins + ' PyCoins');
}

async function testAction(action,data) {
  const course = courseNow();
  if (!course) return showCourse();
  const id = course.id;
  if (action === 'start-test') {
    await update(s=>{s.drafts[id] ??= newDraft();});
    render('#active-question');
    return;
  }
  const visibleDraft = current().drafts[id];
  if (!visibleDraft) return;
  const items = assessmentItems(course,visibleDraft.assessmentVersion);
  if (action === 'confirm-test') {
    const answered = Object.values(visibleDraft.answers).filter(value=>value!==null).length;
    const missing = items.length - answered;
    if (!answered) {
      notify('Answer at least one question to create a study path.');
      return;
    }
    confirmation('Submit your level test?',missing
      ? 'You answered ' + answered + ' of ' + items.length + ' questions. The remaining ' + missing + ' will be recorded as skipped.'
      : 'All questions are answered. Submit to see your results and study path.',
      'submit-test','Submit and see my path',missing ? button('review-test','Review unanswered','secondary') : undefined);
    return;
  }
  const outcome = await update(s=>{
    const draft = s.drafts[id];
    if (!draft || draft.seed !== visibleDraft.seed) return null;
    const l = items[draft.index];
    if (action === 'submit-test') {
      const answers = Object.fromEntries(items.map(item=>[item.id,draft.answers[item.id] ?? null]));
      const results = Object.fromEntries(items.map(item=>[item.id,answers[item.id] === null ? null : answers[item.id] === item.diagnostic.answer]));
      s.reports[id] = {answers,results,at:Date.now(),assessmentVersion:draft.assessmentVersion};
      delete s.drafts[id];
      return 'path';
    }
    if (action === 'review-test') {
      draft.index = Math.max(0,items.findIndex(item=>typeof draft.answers[item.id] !== 'string'));
    }
    if (action === 'test-answer' && draft.index === visibleDraft.index) {
      const answer = shuffle(l.diagnostic,l.id + ':' + draft.seed)[Number(data.option)];
      if (answer !== undefined) draft.answers[l.id] = answer;
    }
    if (action === 'test-jump') draft.index = Math.min(items.length-1,Math.max(0,Number(data.index)));
    if (action === 'test-move') draft.index = Math.min(items.length-1,Math.max(0,draft.index + Number(data.step)));
    if (action === 'test-skip' && draft.index === visibleDraft.index) {
      draft.answers[l.id] = null;
      if (draft.index === items.length-1) return 'confirm';
      draft.index++;
    }
    return 'test';
  });
  if (outcome === 'path') {
    closeDialog();
    go('path');
    return;
  }
  if (action === 'review-test') closeDialog();
  render(action === 'test-answer' ? '[data-action="test-answer"][data-option="' + data.option + '"]' : '#active-question');
  if (outcome === 'confirm') await testAction('confirm-test',{});
}

async function roundAction(action,data) {
  const course = courseNow();
  if (!course) return showCourse();
  const id = course.id;
  if (action === 'start-round' && Object.hasOwn(MODES,data.mode)) {
    await update(s=>{s.rounds[id] ??= createRound(course,data.mode,practiceUnit,seed(),order);});
    render('#active-question');
    return;
  }
  const visibleRound = current().rounds[id];
  if (!visibleRound) return;
  if (action === 'confirm-round') {
    confirmation('End this practice round?','The next round will start with a fresh score.','leave-round','End round');
    return;
  }
  const outcome = await update(s=>{
    const round = s.rounds[id];
    if (!round || round.seed !== visibleRound.seed) return 0;
    if (action === 'leave-round') {delete s.rounds[id];return 0;}
    if (round.done || round.index !== visibleRound.index) return 0;
    const i = round.index;
    if (action === 'round-answer') {
      const question = questionByKey(round.keys[i]).question;
      const value = shuffle(question,round.keys[i] + ':' + round.seed)[Number(data.option)];
      if (value !== undefined) round.answers[i] = value;
    }
    if (action === 'round-next' && round.answers[i]) {
      if (i < round.keys.length-1) {
        round.index++;
      } else {
        const pass = round.mode === 'team' || markRound(round).filter(Boolean).length >= 6;
        const claim = round.mode === 'checkpoint' ? id + ':' + round.unit : id;
        round.done = true;
        if (pass) round.reward = award(s.wallet,round.mode,claim);
      }
    }
    return round.reward;
  });
  if (action === 'leave-round') closeDialog();
  render(action === 'round-answer' ? '[data-action="round-answer"][data-option="' + data.option + '"]' : '#active-question');
  if (outcome) notify('Practice reward · +' + outcome + ' PyCoins');
}

async function equip(id,fromReveal) {
  const item = itemById(id);
  if (!item) return;
  await update(s=>{
    if (!s.wallet.gearCounts[item.id]) throw new Error('Collect this item before equipping it.');
    s.wallet.equipped[item.slot] = item.id;
  });
  if (fromReveal) {closeDialog();gearTab='closet';}
  render('[data-action="gear-tab"][data-tab="closet"]');
  notify(item.name + ' equipped');
}

async function sell(id,confirmed) {
  const item = itemById(id);
  if (!item) return;
  const result = await update(({wallet})=>{
    if (!confirmed && wallet.gearCounts[id] === 1) return null;
    const coins = sellGear(wallet,id);
    return {coins,remaining:wallet.gearCounts[id] ?? 0};
  });
  if (!result) {
    confirmation('Sell your last ' + item.name + '?',
      'You’ll receive ' + gearSellValue(item) + ' PyCoins. If the gear is equipped, selling the last copy also removes it from your character.',
      'confirm-sell-gear','Sell last copy',undefined,'data-gear="' + id + '"');
    return;
  }
  if (confirmed) closeDialog();
  render(result.remaining ? '[data-action="sell-gear"][data-gear="' + id + '"]' : '#gear-collection');
  notify('Sold ' + item.name + ' · +' + result.coins + ' PyCoins');
}

function refreshLibrary() {
  const results = document.querySelector('#lesson-results');
  const count = document.querySelector('#lesson-count');
  if (!results || !count) return;
  const browse = learningContext('library',route().id);
  const next = libraryResults(current(),browse.course,filter,browse.level);
  results.innerHTML = next.markup;
  count.textContent = next.count;
}

function startBackupDownload() {
  const file = new Blob([JSON.stringify({app:'MathQuest',data:current()},null,2)],{type:'application/json'});
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href=url; a.download='MathQuest-progress.json'; a.click();
  setTimeout(()=>URL.revokeObjectURL(url),3000);
  notify('Progress backup downloaded');
}

const testActions = new Set(['start-test','confirm-test','submit-test','review-test','test-answer','test-move','test-jump','test-skip']);
const roundActions = new Set(['start-round','confirm-round','leave-round','round-answer','round-next']);

async function act(action,data) {
  if (testActions.has(action)) return testAction(action,data);
  if (roundActions.has(action)) return roundAction(action,data);
  switch (action) {
    case 'menu':
      setMenu(!menuOpen);
      if (menuOpen) (sidebar.querySelector('[aria-current="page"]') ?? sidebar.querySelector('.brand'))?.focus();
      break;
    case 'close-menu':
      setMenu(false);
      topbar.querySelector('.mobile-menu')?.focus();
      break;
    case 'preview-track':
      if (Object.hasOwn(COURSES,'0580-' + data.track)) {
        featuredTrack = data.track;
        render('[data-action="preview-track"][aria-pressed="true"]');
      }
      break;
    case 'cycle-curve':
      curve = (curve + 1) % curveRatios.length;
      render('[data-action="cycle-curve"]');
      break;
    case 'toggle-curve':
      curvePaused = !curvePaused;
      render('[data-action="toggle-curve"]');
      break;
    case 'sample-answer': {
      const option = Number(data.option);
      const {page,id} = route();
      const browse = learningContext(page,id);
      if (page !== 'home' || browse.level !== 'igcse' || browse.course || !Number.isInteger(option) || option < 0 || option > 3) break;
      sampleChoice = option;
      render('[data-action="sample-answer"][data-option="' + option + '"]');
      break;
    }
    case 'course': showCourse(data); break;
    case 'close-dialog': closeDialog(); break;
    case 'pick-level':
      if (selection?.level !== data.level && Object.hasOwn(LEVELS,data.level)) showCourse({level:data.level});
      break;
    case 'pick-track':
      if (!selection) break;
      selection.track=data.track;
      showDialog(courseDialog(selection,courseNow()),'[data-track="' + data.track + '"]');
      break;
    case 'save-course': await saveCourse(data.test === 'true'); break;
    case 'clear-filter': filter.query='';filter.status='all';render('#lesson-search');break;
    case 'lesson-answer': await practiceAnswer(route().id,Number(data.question),Number(data.option)); break;
    case 'hint': {
      const id = route().id;
      const lesson = LESSONS[id];
      const key = id + ':' + data.question;
      hints[key] = Math.min(lesson.method.length,1 + slotBuff(current().wallet.equipped,'head'),(hints[key] ?? 0) + 1);
      render('[data-action="hint"][data-question="' + data.question + '"]');
      break;
    }
    case 'gear-tab': gearTab=data.tab;render('[data-action="gear-tab"][data-tab="' + gearTab + '"]');break;
    case 'crate': crateId=data.crate;render('[data-crate="' + crateId + '"]');break;
    case 'open-crate': {
      const {item,count} = await update(({wallet})=>{
        const item = openCrate(wallet,crateId);
        return {item,count:wallet.gearCounts[item.id]};
      });
      render('[data-action="open-crate"]:not(:disabled)');
      showDialog(crateDialog(item,count),'[data-action="equip"]');
      break;
    }
    case 'sell-gear': await sell(data.gear,false); break;
    case 'confirm-sell-gear': await sell(data.gear,true); break;
    case 'equip': await equip(data.item,data.reveal==='true'); break;
    case 'unequip':
      if (SLOTS.some(slot=>slot.id===data.slot)) await update(s=>{delete s.wallet.equipped[data.slot];});
      render('[data-action="gear-tab"][data-tab="closet"]');
      notify('Gear removed');
      break;
    case 'export': startBackupDownload();break;
    case 'import': document.querySelector('#backup-input')?.click();break;
    case 'restore': {
      if (!pendingBackup) return;
      const restored = pendingBackup;
      await update(s=>Object.assign(s,restored));
      closeDialog();
      render();
      notify('Progress backup restored');
      break;
    }
  }
}

document.addEventListener('click',async event=>{
  const anchor=event.target.closest('a[href^="#"]');
  if (anchor && event.button===0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
    event.preventDefault();
    if (anchor.dataset.scroll) {
      scrollToSection(anchor.dataset.scroll);
      return;
    }
    const href=anchor.getAttribute('href').slice(1);
    if (href==='library' || href.startsWith('library/')) {filter.query='';filter.status='all';}
    if (href==='content') main.focus();
    else go(href);
    return;
  }
  const control=event.target.closest('button[data-action]');
  if (!control || busy) return;
  busy = true;
  try { await act(control.dataset.action,control.dataset); }
  catch (error) { notify(error.message || 'Try that again.'); }
  finally { busy = false; }
});

document.addEventListener('input',event=>{
  if (event.target.id==='lesson-search') {
    filter.query=event.target.value;
    refreshLibrary();
  }
});

document.addEventListener('submit',event=>{
  const form = event.target;
  if (form.id !== 'topic-search-form') return;
  event.preventDefault();
  filter.query = form.elements.namedItem('lesson').value.trim();
  filter.status = 'all';
  go('library/' + learningContext('home',route().id).level,'#lesson-search');
});

document.addEventListener('change',async event=>{
  const element=event.target;
  if (element.id==='exam-code') {
    selection.code=element.value;
    if (selection.code==='0607' && selection.track==='fast') selection.track='';
    showDialog(courseDialog(selection,courseNow()),'#exam-code');
  }
  if (element.id==='unit-filter') go('library/' + (element.value === 'all' ? learningContext('library',route().id).level : element.value),'#unit-filter');
  if (element.id==='status-filter') {filter.status=element.value; refreshLibrary();}
  if (element.id==='practice-topic') practiceUnit=element.value;
  if (element.id==='backup-input' && element.files[0]) {
    const file=element.files[0];
    try {
      if (file.size>2_000_000) throw new Error('This backup is too large.');
      pendingBackup=decodeBackup(await file.text());
      confirmation('Restore this backup?','Restoring replaces MathQuest’s progress and wallet in this browser.','restore','Restore progress');
    } catch (error) {
      notify(error instanceof SyntaxError ? 'Choose a valid MathQuest backup file.' : error.message);
    } finally {element.value='';}
  }
});

window.addEventListener('storage',event=>{
  if (event.key===KEY || event.key===null) {
    syncFromStorage();
    if (!dialog.open) render();
  }
});
matchMedia('(max-width: 930px)').addEventListener?.('change',event=>{ if (!event.matches && menuOpen) setMenu(false); });
window.addEventListener('popstate',()=>{setMenu(false);closeDialog();render(null,true);});
window.addEventListener('hashchange',()=>{if (renderedRoute!==location.hash) render(null,true);});
document.addEventListener('keydown',event=>{
  if (event.key==='Escape' && menuOpen && !dialog.open) {
    setMenu(false);
    topbar.querySelector('.mobile-menu')?.focus();
  }
});
render();

import {LESSONS, QUIZZES, QUESTS} from './lessons.js';
import {IGCSE_TOPICS} from './igcse.js';
import {LESSON_DEPTH} from './lesson-depth.js';
import {EXTRA_EXERCISES} from './lesson-practice.js';
import {lessonPreview, challengePreview} from './task-visuals.js';
import {IGCSE_DEPTH} from './igcse-depth.js';
// Keep existing questions at the same positions so prior progress remains valid.
for(const topic of IGCSE_TOPICS)topic.questions.push(...(IGCSE_DEPTH[topic.id]?.questions||[]));
import {startSocial, stopSocial, socialState, lookupFriendCode, sendFriendRequest, acceptFriend, removeFriend, blockStudent, unblockStudent, renameProfile, getNickname, friends, incoming, outgoing, openChat, closeChat, sendMessage, reportMessage} from './social.js';
import {initializeLogin, signUpStudent, signInStudent, signInAdmin, signOutStudent, changeOwnPassword, sendStaffResetEmail, authConfigured, friendlyAuthError, looksLikeSchoolPassword} from './auth.js';
import {startLessonManager, stopLessonManager, lessonManagerState, saveManagedLesson, setLessonStatus} from './lesson-manager.js';
import {startPasswordHelp, stopPasswordHelp, passwordHelpState, requestPasswordHelp, reviewPasswordHelp} from './security.js';
import {fetchAdminRole, startHelpDesk, stopHelpDesk, helpDeskState, sendHelpRequest, answerHelpRequest, adminRenameStudent} from './helpdesk.js';
import {readCloudProgress, createCloudProgress, applyCloudChanges, explainCloudError} from './cloud-progress.js';
import {queueSheetsSync} from './sheets-sync.js';
import {startLeaderboard, stopLeaderboard, leaderboardState, joinLeaderboard, leaveLeaderboard, updateLeaderboard, refreshLeaderboardWeek} from './leaderboard.js';
import {startAnnouncements, stopAnnouncements, announcementState, saveAnnouncement, setAnnouncementStatus} from './announcements.js';
import {TOPICS as LEVEL_TOPICS, QUESTIONS as LEVEL_QUESTIONS, TOTAL as LEVEL_TOTAL, studyPriority, studyPlan, scoreAnswers, strengthLabel, diagnosticPlacement, localDiagnosticFeedback} from './level-test-questions.js';
import {startLevelTest, stopLevelTest, levelTestState, beginLevelTest, finishLevelTest, getAILevelAdvice, readDraft, writeDraft} from './level-test.js';
import {RARITIES,SLOTS,CRATES,ITEMS,slotBuff,checkpointQuestions} from './game-items.js';
import {startGame,stopGame,gameState,awardProgress,awardCheckpoint,openCrate,sellGear,equipItem,removeEquipment} from './game-state.js?v=balanced';
import {avatarHTML,gameShopHTML,checkpointHTML,teamGamesHTML} from './game-ui.js?v=balanced';
import {startDirectory,stopDirectory,directoryState,setDirectoryOptIn,syncDirectoryName} from './student-discovery.js';
import {startTeams,stopTeams,teamState,createRoom,joinRoomByCode,answerRoom,claimTeamReward} from './team-rooms.js?v=balanced';
import {startRoster,stopRoster,rosterState,syncStudentStats} from './staff-roster.js';
import {startStaffChat,stopStaffChat,openStaffChat,staffChatState,sendStaffMessage,reportStaffMessage} from './staff-chat.js';
import {localPreview,activeLocalProfile,localProfiles,selectLocalProfile,selectTeamProfile,readCharacterStyle,saveCharacterStyle} from './local-preview.js';
import {
  browserStorageAvailable, createProfileBackup, decodeProfileBackup, maxBackupBytes, progressStorageKey, restoreProfileBackup
} from './local-profile-backup.js?v=balanced';

const $ = id => document.getElementById(id);
const escapeHTML = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const defaults = () => ({xp:0,completed:[],questDone:[],quizCorrect:[],igcseCorrect:[],runs:0,drafts:{},labCode:'print("Hello, Python!")'});
const studyMenu = [
  ['learn','▤','Lessons'],['lab','›_','Code Lab'],['leveltest','◎','Level Test'],
  ['igcse','▱','IGCSE 0478'],['quests','◇','Challenges'],['quiz','?','Quick Quiz']
];
const localMenu = [['home','⌂','Home'],...studyMenu,['game','◈','Game Zone'],['account','○','Local profile']];
const igcseSyllabus = 'https://www.cambridgeinternational.org/Images/697167-2026-2028-syllabus.pdf';
const schoolMenu = [
  ['home','⌂','Home'],['announcements','◷','Announcements'],...studyMenu,
  ['game','◈','Game Zone'],['leaderboard','≡','Leaderboard'],['friends','○','Friends'],
  ['staff','✉','Teachers'],['help','?','Ask admin'],['account','○','Account']
];
const staffMenu = [['admin','▤','Admin dashboard'],['account','○','Account']];
const onlineHint=localPreview?'':' <button type="button" class="btn btn-quiet" data-action="ai-hint">AI hint (optional)</button><div id="ai-response"></div>';
const achievementFields={lesson:'completed',quest:'questDone',quiz:'quizCorrect',igcse:'igcseCorrect'};
let user = null;
let authReady = false;
let adminRole = null;
const fixedLessonCount = LESSONS.length;
const courseUnitTitles = [
  'First programs', 'Loops, lists and functions', 'Text and logic', 'Collections and strings',
  'Iteration and errors', 'Modules and iteration', 'Sets, recursion and classes', 'Generators, patterns and JSON',
  'Testing, files and search', 'Number representations', 'Sorting and comprehensions', 'Patterns, files and search',
  'Iteration and unpacking', 'Summaries and text counts', 'JSON, dates and combinations', 'Conversions, files and exceptions'
];
let editingLessonId = null;
let editingAnnouncementId = null;
let authMode = 'login';
let leaderboardMode = 'all';
let levelAnswers = Array(LEVEL_TOTAL).fill(null);
let levelQuestion = 0;
let levelBusy = false;
let authBusy = false;
const composeDraft={friend:'',staff:''};
const sendingCompose={friend:false,staff:false};
let questIndex = 0;
let selectedInvite = null;
const names = new Map();
let reportTarget = null;
let data = load('guest');
let page = 'home';
let gameTab='closet', selectedCrate='helmet', selectedRoom=null;
let checkpointGroup=0, checkpointAnswers=Array(8).fill(null), checkpointFeedback='', checkpointBusy=false;
let activeExercise=0;
let lessonIndex = 0;
let labSelection = 'free';
let quizIndex = 0;
let quizChoice = null;
let quizChecked = false;
let quizScore = 0;
let quizFeedback = "";
let igcseTopic = 0;
let igcseQuestion = 0;
let igcseChoice = null;
let igcseFeedback = '';
let igcseAnswered = false;
let current = null;
let worker = null;
let workerReady = false;
let runId = 0;
let runTimer = null;
let toastTimer = null;
let cloudStatus = 'device';
let cloudReady = false;
let authEpoch = 0;
let flushTimer = null;
let cloudWrite = null;
const emptyPending = () => ({lessons:[],quests:[],quiz:[],igcse:[],drafts:{},labCode:null,runInc:0});
let pending = emptyPending();
function normalize(raw) {
  const d = {...defaults(), ...(raw && typeof raw === 'object' ? raw : {})};
  d.completed = [...new Set((Array.isArray(d.completed)?d.completed:[]).filter(x=>typeof x==='string' && (LESSONS.some(l=>l.id===x) || /^custom-[A-Za-z0-9]{15,35}$/.test(x))))];
  d.questDone = [...new Set((Array.isArray(d.questDone)?d.questDone:[]).filter(x=>QUESTS.some(q=>q.id===x)))];
  d.quizCorrect = [...new Set((Array.isArray(d.quizCorrect)?d.quizCorrect:[]).filter(x=>Number.isInteger(x)&&x>=0&&x<QUIZZES.length))];
  d.igcseCorrect = [...new Set((Array.isArray(d.igcseCorrect)?d.igcseCorrect:[]).filter(x=>typeof x==='string' && /^\d+-\d+$/.test(x)))];
  d.drafts = d.drafts && typeof d.drafts==='object'&&!Array.isArray(d.drafts) ? d.drafts : {};
  d.labCode = typeof d.labCode==='string' ? d.labCode : defaults().labCode;
  d.runs = Math.max(0,Number(d.runs)||0);
  d.xp = d.completed.length*50 + d.quizCorrect.length*20 + d.questDone.length*120 + d.igcseCorrect.length*15;
  return d;
}
function pendingKey(uid) {return 'pyquest-cloud-pending-' + uid;}
function readPending(uid) {
  try {
    const p=JSON.parse(localStorage.getItem(pendingKey(uid)));
    if(p && typeof p==='object') return {
      lessons:Array.isArray(p.lessons)?p.lessons:[],
      quests:Array.isArray(p.quests)?p.quests:[],
      quiz:Array.isArray(p.quiz)?p.quiz:[],
      igcse:Array.isArray(p.igcse)?p.igcse:[],
      drafts:p.drafts && typeof p.drafts==='object'?p.drafts:{},
      labCode:typeof p.labCode==='string'?p.labCode:null,
      runInc:Math.max(0,Number(p.runInc)||0)
    };
  } catch (_) {}
  return emptyPending();
}
function storePending(uid) {if(uid)try{localStorage.setItem(pendingKey(uid),JSON.stringify(pending));}catch(_){}}
function mergePending(base,p) {
  return normalize({
    ...base,
    completed:[...base.completed,...p.lessons],
    questDone:[...base.questDone,...p.quests],
    quizCorrect:[...base.quizCorrect,...p.quiz],
    igcseCorrect:[...base.igcseCorrect,...p.igcse],
    drafts:{...base.drafts,...p.drafts},
    labCode:p.labCode===null?base.labCode:p.labCode,
    runs:base.runs + p.runInc
  });
}
function statusLabel() {
  return ({device:'On this device',loading:'Loading progress…',saving:'Saving progress…',saved:'✓ Progress saved',error:'⚠ Not synced'})[cloudStatus];
}
function startLocalStudent(profile) {
  stopWorker();
  user=profile;
  data=load(profile.uid);
  page='home';
  gameTab='closet';
  selectedRoom=null;
  labSelection='free';
  levelAnswers=readDraft(profile.uid);
  const unfinished=levelAnswers.findIndex(answer=>answer===null);
  levelQuestion=unfinished<0?LEVEL_TOTAL-1:unfinished;
  levelBusy=false;
  checkpointBusy=false;
  checkpointFeedback='';
  quizIndex=0;
  quizChoice=null;
  quizChecked=false;
  quizScore=0;
  quizFeedback='';
  igcseTopic=0;
  igcseQuestion=0;
  resetIGCSE();
  void startGame(profile,localGameUpdated,()=>load(profile.uid));
  void startLevelTest(profile,levelTestUpdated);
  void startTeams(profile,()=>{if(page==='game'&&gameTab==='teams')renderPreservingFormValues();});
  syncLocation();
  render();
  void awardProgress().catch(error=>notify(error.message));
}
function updateStatus(status) {
  cloudStatus=status;
  const el=$('sync-status');
  if(el){el.textContent=statusLabel();el.className='sync-status '+status;}
}
function pendingEmpty(p=pending) {return !p.lessons.length&&!p.quests.length&&!p.quiz.length&&!p.igcse.length&&!Object.keys(p.drafts).length&&p.labCode===null&&!p.runInc;}
function queue(change) {
  if(!user || !change) return;
  if(change.type==='lesson' && !pending.lessons.includes(change.id)) pending.lessons.push(change.id);
  if(change.type==='quest' && !pending.quests.includes(change.id)) pending.quests.push(change.id);
  if(change.type==='quiz' && !pending.quiz.includes(change.id)) pending.quiz.push(change.id);
  if(change.type==='igcse' && !pending.igcse.includes(change.id)) pending.igcse.push(change.id);
  if(change.type==='draft') pending.drafts[change.key]=change.value;
  if(change.type==='lab') pending.labCode=change.value;
  if(change.type==='run') pending.runInc++;
  storePending(user.uid);
  updateStatus(cloudReady?'saving':cloudStatus==='error'?'error':'loading');
  if(cloudReady) scheduleCloudSave();
}
function scheduleCloudSave(){clearTimeout(flushTimer);flushTimer=setTimeout(()=>{void flushCloud();},650);}
function mergeQueued(a,b) {
  return {
    lessons:[...new Set([...a.lessons,...b.lessons])],
    quests:[...new Set([...a.quests,...b.quests])],
    quiz:[...new Set([...a.quiz,...b.quiz])],
    igcse:[...new Set([...a.igcse,...b.igcse])],
    drafts:{...a.drafts,...b.drafts},
    labCode:b.labCode===null?a.labCode:b.labCode,
    runInc:a.runInc+b.runInc
  };
}
async function flushCloud() {
  clearTimeout(flushTimer);
  if(!user||!cloudReady) return;
  if(cloudWrite){try{await cloudWrite;}catch(_){return;} if(!pendingEmpty()) return flushCloud(); return;}
  if(pendingEmpty()){updateStatus('saved');return;}
  const uid=user.uid;
  const packet=pending;
  pending=emptyPending();storePending(uid);
  updateStatus('saving');
  cloudWrite=applyCloudChanges(uid,packet);
  try {
    await cloudWrite;
    if(user?.uid===uid){
      queueSheetsSync(user, data); // mirror saved achievement snapshot to teacher Sheet
      // After saved achievements, request an authenticated, one-time server reward.
      void awardProgress().catch(e=>console.warn('PyCoin rewards:',e.message));
      void syncStudentStats(user).catch(e=>console.warn('Student stats:',e.message));
      if(leaderboardState().me){
        void updateLeaderboard(socialState().profile?.nickname).catch(err=>{console.warn('Leaderboard sync:',err.message);});
      }
      if(pendingEmpty())updateStatus('saved');else scheduleCloudSave();
    }
  } catch(err){
    if(user?.uid===uid){pending=mergeQueued(packet,pending);storePending(uid);updateStatus('error');notify(explainCloudError(err));}
  } finally {cloudWrite=null;}
}
async function syncStudentAccount(newUser){
  const epoch=++authEpoch;
  clearTimeout(flushTimer);
  user=newUser;
  composeDraft.friend='';composeDraft.staff='';
  authReady=true;
  cloudReady=false;
  if(!newUser){stopGame();stopDirectory();stopTeams();stopRoster();stopStaffChat();stopLevelTest();stopAnnouncements();stopLeaderboard();stopSocial();stopHelpDesk();stopLessonManager();stopPasswordHelp();LESSONS.splice(fixedLessonCount);adminRole=null;names.clear();page='home';pending=emptyPending();data=defaults();updateStatus('device');refresh();return;}
  // A staff role exists only when provisioned by the school in Firestore. Nothing
  // in localStorage or the website grants this privilege.
  try {adminRole=await fetchAdminRole(newUser.uid);} catch(e){
    if(epoch!==authEpoch)return;
    adminRole=null;notify('Could not check your account role: '+e.message);
  }
  if(epoch!==authEpoch)return;
  if(adminRole){
    stopGame();stopDirectory();stopTeams();
    void startRoster(newUser,()=>{if(page==='admin')renderPreservingFormValues();});
    void startStaffChat(newUser,true,()=>{if(page==='admin')renderPreservingFormValues();});
    stopLevelTest();stopLeaderboard();stopSocial();stopHelpDesk();page='admin';editingLessonId=null;editingAnnouncementId=null;
    void startAnnouncements(newUser,adminRole,announcementsChanged);
    void startLessonManager(newUser,adminRole,lessonsChanged);
    void startPasswordHelp(newUser,adminRole,passwordRequestsChanged);pending=emptyPending();data=defaults();
    updateStatus('saved');refresh();
    void startHelpDesk(newUser,adminRole,helpDeskUpdated);
    return;
  }
  if(authMode==='admin'){
    // Reject unapproved email/password accounts even if Firebase Auth accepted them.
    await signOutStudent();
    notify('This email is not approved as a PyQuest admin. Ask the school owner.');
    return;
  }
  void startAnnouncements(newUser,null,announcementsChanged);
  void startHelpDesk(newUser,null,helpDeskUpdated);
  void startLessonManager(newUser,null,lessonsChanged);
  void startPasswordHelp(newUser,null,passwordRequestsChanged);
  stopRoster();
  void startSocial(newUser, socialUpdated);
  void startDirectory(newUser,()=>{if(page==='friends')renderPreservingFormValues();});
  void startGame(newUser,()=>{if(['game','home','learn','checkpoint'].includes(page))refresh();});
  void startTeams(newUser,()=>{if(page==='game'&&gameTab==='teams')renderPreservingFormValues();});
  void startStaffChat(newUser,false,()=>{if(page==='staff')renderPreservingFormValues();});
  void startLeaderboard(newUser, leaderboardUpdated);
  levelAnswers=readDraft(newUser.uid);levelQuestion=Math.max(0,levelAnswers.findIndex(x=>x===null));
  void startLevelTest(newUser, levelTestUpdated);
  pending=readPending(newUser.uid);
  data=load(newUser.uid);
  updateStatus('loading');syncLocation();refresh();
  try {
    const remote=await readCloudProgress(newUser.uid);
    if(epoch!==authEpoch)return;
    const legacy=load(newUser.uid);
    if(remote){
      // Cloud is the authority; import any old, device-only achievements once.
      const cloudData=normalize(remote);
      const missingLessons=legacy.completed.filter(id=>!cloudData.completed.includes(id));
      const missingQuiz=legacy.quizCorrect.filter(id=>!cloudData.quizCorrect.includes(id));
      const missingIgcse=legacy.igcseCorrect.filter(id=>!cloudData.igcseCorrect.includes(id));
      const missingQuests=legacy.questDone.filter(id=>!cloudData.questDone.includes(id));
      pending.lessons=[...new Set([...pending.lessons,...missingLessons])];
      pending.quiz=[...new Set([...pending.quiz,...missingQuiz])];
      pending.igcse=[...new Set([...pending.igcse,...missingIgcse])];
      pending.quests=[...new Set([...pending.quests,...missingQuests])];
      data=mergePending(cloudData,pending);
    } else {
      data=normalize(legacy);
      // Create the account's first cloud record; import previously saved local progress.
      await createCloudProgress(newUser.uid,data);
      if(epoch!==authEpoch)return;
      // Initial record already includes queued changes (runs and drafts).
      pending=emptyPending();
    }
    storePending(newUser.uid);
    save();
    cloudReady=true;
    if (pendingEmpty()) {
      queueSheetsSync(newUser, data);
      // Catch up older accomplishments, without client-side wallet writes.
      void awardProgress().catch(e=>console.warn('PyCoin rewards:',e.message));
      void syncStudentStats(newUser).catch(e=>console.warn('Student stats:',e.message));
      // Catch up opted-in students after opening on a different device.
      void updateLeaderboardWhenJoined();
    }
    updateStatus(pendingEmpty()?'saved':'saving');
    refresh();
    if(!pendingEmpty())scheduleCloudSave();
  } catch(err){
    if(epoch!==authEpoch)return;
    // Keep device copy + unsent changes; don't pretend the cloud is synced.
    data=load(newUser.uid);
    save();
    updateStatus('error');refresh();notify(explainCloudError(err));
  }
}
async function retryCloud(){if(!user)return;await syncStudentAccount(user);}


function load(key) {
  try { return normalize(JSON.parse(localStorage.getItem(progressStorageKey(key)))); }
  catch (_) { return defaults(); }
}
function applyLocalProgress(change) {
  const saved=load(user.uid);
  const field=achievementFields[change.type];
  if(field) saved[field].push(change.id);
  if(change.type==='draft'){
    let value=change.value;
    if(change.key.startsWith('practice:') && saved.drafts[change.key]){
      try {
        value=JSON.stringify([...new Set([...JSON.parse(saved.drafts[change.key]),...JSON.parse(value)])]);
      } catch { /* Keep the new practice marks when older data is malformed. */ }
    }
    saved.drafts[change.key]=value;
  }
  if(change.type==='lab')saved.labCode=change.value;
  if(change.type==='run')saved.runs++;
  return normalize(saved);
}
function save(change=null) {
  data=localPreview&&user&&change?applyLocalProgress(change):normalize(data);
  try { localStorage.setItem(progressStorageKey(user?.uid ?? 'guest'),JSON.stringify(data)); }
  catch (_){notify('Progress could not be saved on this device.');return;}
  if(localPreview){
    if(change&&achievementFields[change.type])void awardProgress().catch(error=>notify(error.message));
  }else if(change)queue(change);
}
function notify(message) {const t=$('toast');if(!t)return;t.textContent=message;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),3300);}
function visibleCompleted(){return LESSONS.filter(x=>data.completed.includes(x.id)).length;}
function checkpointPassed(group){return (gameState().passedCheckpoints||[]).includes(group)||(gameState().wallet?.claimed||[]).includes('checkpoint:'+group);}
const LESSONS_PER_CHECKPOINT=4;
const courseUnitCount = Math.floor(fixedLessonCount / LESSONS_PER_CHECKPOINT);
function savedPlacement(){
  const attempt=levelTestState().attempt;
  if(attempt?.status!=='completed'||attempt.version!==1)return null;
  // Recalculate from the saved ANSWERS, not a client-submitted score field.
  // Diagnostic placement is navigation only: never pay XP/GIS Points for it.
  try{return diagnosticPlacement(scoreAnswers(attempt.answers).scores);}catch{return null;}
}
function checkpointSkipped(group){return !!savedPlacement() && group<savedPlacement().skippedCheckpoints;}
function checkpointCleared(group){return checkpointSkipped(group)||checkpointPassed(group);}
function lessonAccess(i){
  if(i<0||i>=LESSONS.length)return false;
  if(i>=fixedLessonCount || data.completed.includes(LESSONS[i].id))return true;
  const required=Math.floor(i/LESSONS_PER_CHECKPOINT);
  for(let g=0;g<required;g++)if(!checkpointCleared(g))return false;
  return true;
}
function firstUnpassed(i){for(let g=0;g<Math.floor(i/LESSONS_PER_CHECKPOINT);g++)if(!checkpointCleared(g))return g;return -1;}
function nextLessonIndex(){
  const placement=savedPlacement();
  const start=placement?.index||0;
  let i=LESSONS.findIndex((l,idx)=>idx>=start&&!data.completed.includes(l.id)&&lessonAccess(idx));
  if(i<0)i=LESSONS.findIndex((l,idx)=>!data.completed.includes(l.id)&&lessonAccess(idx));
  return i<0?0:i;
}
function courseUnits() {
  const waivedCount = savedPlacement()?.skippedCheckpoints ?? 0;
  let requiredCheckpoint = null;
  return Array.from({length: courseUnitCount}, (_, group) => {
    const from = group * LESSONS_PER_CHECKPOINT;
    const end = from + LESSONS_PER_CHECKPOINT;
    const completed = LESSONS.slice(from, end).filter(lesson => data.completed.includes(lesson.id)).length;
    const passed = checkpointPassed(group);
    const waived = !passed && group < waivedCount;
    const ready = requiredCheckpoint === null && completed === LESSONS_PER_CHECKPOINT && !passed && !waived;
    const unit = {group, from, end, title: courseUnitTitles[group] ?? `Unit ${group + 1}`, completed, passed, waived, ready, requiredCheckpoint};
    if (requiredCheckpoint === null && !passed && !waived) requiredCheckpoint = group;
    return unit;
  });
}
function coursePlan() {
  const units = courseUnits();
  const checkpoint = units.find(unit => unit.ready);
  const lesson = nextLessonIndex();
  return {units, checkpoint, lesson, current: checkpoint ?? units[Math.floor(lesson / LESSONS_PER_CHECKPOINT)]};
}
function lessonDraftKey(id,step){return step===0?id:`practice-code:${id}:${step}`;}
function practiceKey(id){return 'practice:'+id;}
function practiceMarks(id){
  const old=data.drafts[practiceKey(id)];
  try{const marks=JSON.parse(old);if(Array.isArray(marks))return [0,1,2].map(n=>marks.includes(n));}catch(_){}
  return [data.completed.includes(id),false,false]; // Migrated users retain completed lessons.
}
function currentLessonTask(){
  const l=LESSONS[lessonIndex];
  if(activeExercise===0)return l;
  const extra=EXTRA_EXERCISES[l.id]?.[activeExercise-1];
  return extra?{...extra,id:l.id,kind:'lesson',context:'lesson'}:l;
}
function markPracticeStep(id,step){
  const marks=practiceMarks(id);if(marks[step])return false;
  marks[step]=true;
  data.drafts[practiceKey(id)]=JSON.stringify(marks.map((v,i)=>v?i:null).filter(x=>x!==null));
  save({type:'draft',key:practiceKey(id),value:data.drafts[practiceKey(id)]});
  return practiceMarks(id).every(Boolean);
}

function menuItems(){return adminRole?staffMenu:localPreview?localMenu:schoolMenu;}
function activeSection(){return ({lesson:'learn',checkpoint:'learn',quest:'quests'})[page]||page;}
function navButton(id,icon,title){
  const active=activeSection()===id;
  return `<button type="button" data-nav="${id}" ${active?'class="active" aria-current="page"':''}><span class="nav-icon" aria-hidden="true">${icon}</span><span>${title}</span></button>`;
}
function authUI(){
  if(localPreview)return `<button class="profile-button" type="button" data-nav="account" aria-label="${escapeHTML(user.label)}"><span class="profile-initial" aria-hidden="true">○</span><span>${escapeHTML(user.label)}</span></button>`;
  return `<div class="user-info"><span class="avatar" aria-hidden="true">${adminRole?"A":"S"}</span><span class="user-name">${escapeHTML(adminRole?.displayName || socialState().profile?.nickname || "Student")}</span><button class="logout" data-action="logout" type="button">Sign out</button></div>`;
}
function loginGate(){
  if(!authReady)return `<div class="login-wrap"><section class="login-box"><img src="assets/garden-international-school-logo.png" alt="School crest"><h1>PyQuest</h1><p>Checking account…</p></section></div>`;
  const signup=authMode==='signup';
  const staff=authMode==='admin';
  return `<div class="login-wrap"><section class="login-box"><img src="assets/garden-international-school-logo.png" alt="School crest"><div class="eyebrow">LEARN • CODE • PLAY</div><h1>${staff?'Staff login':signup?'Create an account':'Welcome to PyQuest'}</h1><p>${staff?'For school-approved admins only.':signup?'Use your student ID. Create a new PyQuest password.':'Log in with your student ID.'}</p>
    <div class="auth-tabs"><button type="button" data-auth-mode="login" class="${authMode==='login'?'selected':''}">Student login</button><button type="button" data-auth-mode="signup" class="${signup?'selected':''}">Sign up</button><button type="button" data-auth-mode="admin" class="${staff?'selected':''}">Admin</button></div>
    <form id="auth-form" class="auth-form" novalidate>
      ${staff?'<label for="staff-email">Staff email</label><input id="staff-email" type="email" autocomplete="username" placeholder="name@school.org" required maxlength="150">':'<label for="student-id">Student ID</label><input id="student-id" name="username" type="text" minlength="4" maxlength="24" pattern="[a-zA-Z0-9_-]{4,24}" autocomplete="username" placeholder="Your student ID" required spellcheck="false" autocapitalize="characters">'}
      <label for="auth-password">${signup?'New PyQuest password':'Password'}</label><input id="auth-password" type="password" ${signup?'autocomplete="new-password"':'autocomplete="current-password"'} minlength="${signup?12:6}" maxlength="128" placeholder="${signup?'12+ characters, different from school password':'Enter your password'}" required>
      ${signup?`<label for="auth-confirm">Confirm new password</label><input id="auth-confirm" type="password" autocomplete="new-password" minlength="12" maxlength="128" placeholder="Type it again" required><p class="password-guidance">Use a unique password. Never use your school login password.</p><p id="school-password-warning" class="password-warning" role="alert" hidden>This might be your school password. Please choose a different password for PyQuest and retype it.</p>`:''}
      <p id="auth-error" class="auth-error" role="alert" hidden></p>
      <button class="btn btn-primary auth-submit" type="submit" ${!authConfigured?'disabled':''}>${staff?'Log in as admin':signup?'Create account':'Log in'}</button>
    </form>
    ${!authConfigured?'<p class="setup-warning">Website owner: connect Firebase first (see SETUP.md).</p>':''}
    ${staff?'<button type="button" class="btn btn-quiet" data-action="staff-reset">Forgot staff password?</button>':'<p class="fineprint muted">Forgot a student password? Contact school IT; student IDs do not receive email resets.</p>'}<p class="login-foot">${staff?'Only admins approved in Firebase can access the dashboard.':'Progress saves to your account. Ask admins for help privately.'}</p></section></div>`;
}
function showAuthMessage(message){const el=$('auth-error');if(!el)return;el.textContent=message;el.hidden=!message;}
async function submitAuthForm(event){
  event.preventDefault();if(authBusy)return;
  const studentId=$('student-id')?.value || '';
  const staffEmail=$('staff-email')?.value || '';
  const password=$('auth-password')?.value || '';
  const confirmation=$('auth-confirm')?.value || '';
  showAuthMessage('');
  if(authMode==='signup' && looksLikeSchoolPassword(password)){
    const warning=$('school-password-warning');if(warning)warning.hidden=false;
    if($('auth-password'))$('auth-password').value='';
    if($('auth-confirm'))$('auth-confirm').value='';
    $('auth-password')?.focus();return;
  }
  const submit=event.target.querySelector('[type="submit"]');
  authBusy=true;if(submit){submit.disabled=true;submit.textContent='Checking…';}
  try {
    if(authMode==='signup') await signUpStudent(studentId,password,confirmation);
    else if(authMode==='admin') await signInAdmin(staffEmail,password);
    else await signInStudent(studentId,password);
  }catch(error){showAuthMessage(friendlyAuthError(error));}
  finally {authBusy=false;if(submit?.isConnected){submit.disabled=false;submit.textContent=authMode==='signup'?'Create account':authMode==='admin'?'Log in as admin':'Log in';}}
}

function render(){
  if (user && page === 'home' && current?.context === 'home') return;
  if(!user){$('app').innerHTML=loginGate();return;}
  const menus=menuItems();
  const primary=new Set(['home','learn','lab','game','admin']);
  const more=menus.filter(([id])=>!primary.has(id));
  const menuGroupLabels={learn:'Study',game:'Play',friends:'School'};
  const menuHTML=menus.map(([id,icon,title])=>`${!adminRole&&menuGroupLabels[id]?`<div class="nav-group-heading">${menuGroupLabels[id]}</div>`:''}${navButton(id,icon,title)}`).join('');
  const rootPage=adminRole?'admin':'home';
  const section=menus.find(([id])=>id===activeSection())?.[2]||'PyQuest';
  $('app').innerHTML=`<div class="layout workspace-layout">
  <aside class="sidebar"><a class="logo" href="#${rootPage}" data-nav="${rootPage}"><img class="school-logo" src="assets/garden-international-school-logo.png" alt="">PyQuest</a>
    <nav class="nav" aria-label="Main navigation">${menuHTML}</nav>
    <div class="side-bottom"><a class="fresh-python-back" href="../../">← Fresh home</a><br>Garden International School</div></aside>
  <main class="main"><header class="top"><span class="workspace-location">${section}</span><a href="#${rootPage}" data-nav="${rootPage}" class="top-title"><img class="top-mini-logo" src="assets/garden-international-school-logo.png" alt="">PyQuest</a><div class="top-right">${adminRole?'<span class="tag">Approved admin</span>':`<span id="sync-status" class="sync-status ${cloudStatus}" role="status" aria-live="polite">${statusLabel()}</span>${cloudStatus==='error'?'<button type="button" class="retry-sync" data-action="retry-sync">Retry</button>':''}`}${adminRole?'':`<div class="xp" id="xp-total">${data.xp+Number(gameState().wallet?.bonusXp||0)} XP</div><div class="xp coins-top" id="coin-total">${Number(gameState().wallet?.coins||0)} <span>GIS Points</span></div>`}${authUI()}</div></header>
  <div class="page page-${page}">${page==='igcse'?'':'<a class="fresh-python-back fresh-python-back-mobile" href="../../">← Fresh home</a>'}${page==='admin'?adminView():page==='account'?accountView():page==='help'?helpView():page==='game'?gameZoneView():page==='staff'?staffChatStudentView():page==='checkpoint'?checkpointHTML(checkpointGroup,LESSONS,checkpointAnswers,checkpointFeedback):page==='announcements'?announcementsView():page==='home'?homeView():page==='learn'?learnView():page==='lesson'?lessonView():page==='quests'?questsView():page==='leaderboard'?leaderboardView():page==='leveltest'?levelTestView():page==='quest'?questView():page==='lab'?labView():page==='quiz'?quizView():page==='igcse'?igcseView():friendsView()}</div></main>
  </div><nav class="mobile-bar" aria-label="Mobile navigation">${menus.filter(([id])=>primary.has(id)).map(item=>navButton(...item)).join('')}${more.length?`<details class="mobile-more"><summary class="${more.some(([id])=>id===activeSection())?'active':''}"><span aria-hidden="true">···</span><span>More</span></summary><div class="mobile-more-menu">${more.map(item=>navButton(...item)).join('')}</div></details>`:''}</nav>`;
}
function exampleLine(line) {
  const tokens = line.split(/(#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:print|input|def|class|return|if|elif|else|for|while|in|import|from|try|except|with|as|True|False|None)\b)/g);
  return tokens.map((token, index) => {
    if (index % 2 === 0) return escapeHTML(token);
    const style = token.startsWith('#') ? 'comment' : ['"', "'"].includes(token[0]) ? 'string' : 'keyword';
    return `<span class="example-${style}">${escapeHTML(token)}</span>`;
  }).join('');
}

function workedExample(index, label = 'Worked example') {
  const example = String(LESSONS[index].example ?? '');
  const runnable = example && index < fixedLessonCount;
  return `<figure class="course-example">
    <figcaption class="course-example-caption"><span>${escapeHTML(label)}</span><code>example.py</code></figcaption>
    <pre tabindex="0" aria-label="Python example code"><code>${example.split('\n').map((line, i) =>
      `<span class="example-line"><span class="example-number" aria-hidden="true">${i + 1}</span><span>${exampleLine(line)}</span></span>`).join('\n')}</code></pre>
    ${example ? `<div class="course-example-footer"><span>Python 3</span><div class="example-controls">
      <button type="button" data-copy-example="${index}">Copy code</button>
      ${runnable ? `<button type="button" class="example-run" data-run-example="${index}"><span aria-hidden="true">▷</span> Run example</button><button type="button" id="stop-code" data-action="stop-code" hidden>Stop</button>` : ''}
    </div></div>` : ''}
    ${runnable ? '<div class="example-result"><span>Output</span><div id="output" class="example-output" role="status">Ready to run.</div></div>' : ''}
  </figure>`;
}

async function copyExample(index) {
  const example = LESSONS[index]?.example;
  if (!example) return;
  try {
    await navigator.clipboard.writeText(example);
    notify('Example copied.');
  } catch {
    notify('Select the example text to copy it.');
  }
}

function courseProgress() {
  const completed = visibleCompleted();
  return `<div class="course-progress">
    <div><strong>Course progress</strong><span>${completed} of ${LESSONS.length} lessons done</span></div>
    <progress max="${LESSONS.length}" value="${completed}" aria-label="Lessons completed"></progress>
  </div>`;
}

function courseLessonRows(from, end, recommended, requiredCheckpoint = null) {
  const rows = LESSONS.slice(from, end).map((lesson, offset) => {
    const index = from + offset;
    const done = data.completed.includes(lesson.id);
    const locked = requiredCheckpoint !== null && !done;
    const next = recommended === index && !done;
    const status = done ? 'Done' : locked ? 'Locked' : next ? 'Up next' : `${lesson.minutes} min`;
    return `<li><button type="button" class="course-lesson-row${next ? ' recommended' : ''}" data-lesson="${index}" ${locked ? 'disabled' : ''} ${next ? 'aria-current="step"' : ''}>
      <span class="course-lesson-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
      <span class="course-lesson-title">${escapeHTML(lesson.title)}</span>
      <span class="course-lesson-status${done ? ' done' : ''}">${status}</span>
      <span class="course-lesson-arrow" aria-hidden="true">${locked ? '' : '→'}</span>
    </button></li>`;
  }).join('');
  return `<ol class="course-lesson-list" start="${from + 1}">${rows}</ol>`;
}

function unitCheckpoint(unit) {
  let description = 'Finish the four lessons to take this checkpoint.';
  let action = '';
  if (unit.passed) {
    description = 'Passed';
    action = 'Review checkpoint';
  } else if (unit.waived) {
    description = 'Waived by your level test';
  } else if (unit.ready) {
    description = 'Answer at least 6 of 8 questions correctly.';
    action = 'Take checkpoint';
  } else if (unit.requiredCheckpoint !== null) {
    description = `Pass checkpoint ${unit.requiredCheckpoint + 1} to unlock this unit.`;
  }
  return `<div class="unit-checkpoint${unit.ready ? ' ready' : ''}">
    <div><strong>Checkpoint ${unit.group + 1}</strong><small>${description}</small></div>
    ${action ? `<button type="button" class="btn ${unit.ready ? 'btn-primary' : 'btn-light'}" data-checkpoint="${unit.group}">${action} <span aria-hidden="true">→</span></button>` : ''}
  </div>`;
}

function homeView() {
  const {checkpoint, lesson: next, current} = coursePlan();
  const lesson = LESSONS[next];
  const name = localPreview ? '' : socialState().profile?.nickname;
  const reviewing = visibleCompleted() === LESSONS.length;
  const started = data.drafts[lesson.id] != null || practiceMarks(lesson.id).some(Boolean);
  const lessonAction = reviewing ? 'Review lesson' : started ? 'Resume lesson' : 'Start lesson';
  const intro = lesson.id === 'hello' ? 'Write your first line of Python and see what it prints.' :
    (String(lesson.description ?? '').match(/^.+?[.!?](?=\s|$)/)?.[0] || lesson.tagline);
  return `<div class="course-page-head">
    <h1>${name ? `Welcome, ${escapeHTML(name)}.` : 'Learn Python.'}</h1>
    ${courseProgress()}
  </div>
  <section class="home-intro" aria-labelledby="home-next-title">
    <div class="home-overview">
      <p class="course-label">${checkpoint ? `${escapeHTML(checkpoint.title)} · 8 questions` : `Lesson ${next + 1} of ${LESSONS.length} · ${lesson.minutes} min`}</p>
      <h2 id="home-next-title">${checkpoint ? `Checkpoint ${checkpoint.group + 1}` : escapeHTML(lesson.title)}</h2>
      <p class="home-intro-description">${checkpoint ? 'You’ve finished all four lessons in this unit. Get 6 of 8 questions right to pass.' : escapeHTML(intro)}</p>
      <div class="home-actions">
        <button type="button" class="btn btn-primary" ${checkpoint ? `data-checkpoint="${checkpoint.group}"` : `data-lesson="${next}"`}>${checkpoint ? 'Take checkpoint' : lessonAction} <span aria-hidden="true">→</span></button>
        <button type="button" class="btn btn-light" data-nav="learn">All lessons</button>
      </div>
    </div>
    ${checkpoint ? workedExample(checkpoint.end - 1, 'From this unit') : workedExample(next)}
  </section>
  <div class="home-sections">
    <section class="home-lessons">
      <div class="section-head"><h2>${escapeHTML(current?.title ?? 'School lessons')}</h2></div>
      <div class="home-unit">
        ${courseLessonRows(current?.from ?? fixedLessonCount, current?.end ?? LESSONS.length, checkpoint ? null : next, current?.requiredCheckpoint)}
        ${current ? unitCheckpoint(current) : ''}
      </div>
    </section>
    <section class="home-tools"><h2>Practice</h2><div class="home-tool-list">${homeLevelTestBanner()}
      <button class="home-tool" type="button" data-nav="lab"><span><strong>Code Lab</strong><small>Write and run your own Python</small></span><span aria-hidden="true">↗</span></button>
      <button class="home-tool" type="button" data-nav="igcse"><span><strong>IGCSE 0478</strong><small>Topic notes and exam practice</small></span><span aria-hidden="true">↗</span></button>
      <button class="home-tool" type="button" data-nav="game"><span><strong>Game Zone</strong><small>Team games, crates and your character</small></span><span aria-hidden="true">↗</span></button>
    </div></section>
  </div>
  ${localPreview?'':`<div class="section-head"><h2>School announcements</h2><button type="button" class="text-link" data-nav="announcements">See all →</button></div>${announcementCards(3)}`}`;
}
function levelTestUpdated(){
  const status=levelTestState();
  if(status.attempt?.status==='started' && user && !levelAnswers.some(x=>x!==null)){
    levelAnswers=readDraft(user.uid);
    const first=levelAnswers.findIndex(x=>x===null);
    levelQuestion=first<0?LEVEL_TOTAL-1:first;
  }
  if(user && (page==='home'||page==='leveltest'||page==='learn'))render();
}
function homeLevelTestBanner(){
  const t=levelTestState();
  const finished=t.attempt?.status==='completed';
  const underway=t.attempt?.status==='started';
  return `<button type="button" class="home-tool" data-nav="leveltest"><span><strong>${finished?'Your study plan':underway?'Resume level test':'Find your starting level'}</strong><small>${finished?'Review your scores and lesson placement':underway?'Continue your saved attempt':'One-time diagnostic · 24 questions'}</small></span><span aria-hidden="true">↗</span></button>`;
}
function levelTestView(){
  const t=levelTestState();
  if(t.loading)return `<div class="page-head"><div><h1>🎯 Your level test</h1><p>Checking your saved attempt…</p></div></div>`;
  if(t.error)return `<div class="page-head"><div><h1>🎯 Your level test</h1><p>Unable to check your one-time attempt.</p></div></div><section class="panel"><p class="feedback bad">${escapeHTML(t.error)}</p><button type="button" class="btn btn-light" data-nav="home">Back home</button></section>`;
  if(t.attempt?.status==='completed')return levelResultsView(t.attempt,t);
  if(!t.attempt)return `<div class="level-intro"><div class="level-intro-symbol">🎯</div><span class="level-eyebrow">YOUR PYTHON STARTING POINT</span><h1>Find your level. Find your path.</h1>
    <p>24 quick questions across 6 topics. We'll use your answers to show what to study first.</p>
    <div class="level-chips"><span>🐍 Python</span><span>🎓 IGCSE 0478</span><span>🧠 Algorithms</span><span>~12–15 minutes</span></div>
    <div class="level-warning"><strong>One attempt per ${localPreview?'profile':'account'}.</strong> You can pause and resume until you submit. The result helps you pick lessons and carries no XP reward.</div>
    <button type="button" class="btn btn-primary level-start" data-action="level-begin" ${levelBusy?'disabled':''}>${levelBusy?'Starting…':'Start level test →'}</button><p class="fineprint muted">${localPreview?'Your result is saved in this browser.':'Your result is private to your account.'}</p>
    </div>`;
  const index=Math.max(0,Math.min(LEVEL_TOTAL-1,levelQuestion));
  const question=LEVEL_QUESTIONS[index];
  const selected=levelAnswers[index];
  const done=levelAnswers.filter(x=>x!==null).length;
  return `<div class="level-test-top"><div><span class="level-eyebrow">ONE-TIME LEVEL TEST · IN PROGRESS</span><h1>Question ${index+1} <span class="muted">/ ${LEVEL_TOTAL}</span></h1><p>${escapeHTML(LEVEL_TOPICS.find(x=>x.id===question.topic)?.label)}</p></div><span class="level-progress-num">${done} answered</span></div>
    <div class="level-track"><div style="width:${Math.round(done/LEVEL_TOTAL*100)}%"></div></div>
    <section class="panel level-question"><h2>${escapeHTML(question.q)}</h2><div class="level-choices">${question.a.map((option,n)=>`<button type="button" class="level-choice ${selected===n?'chosen':''}" data-level-choice="${n}" aria-pressed="${selected===n}"><span class="level-letter">${String.fromCharCode(65+n)}</span><span>${escapeHTML(option)}</span>${selected===n?'<span aria-hidden="true" class="level-chosen">✓</span>':''}</button>`).join('')}</div>
    <div class="level-controls"><button type="button" class="btn btn-light" data-action="level-prev" ${index===0?'disabled':''}>← Previous</button>${index<LEVEL_TOTAL-1?`<button type="button" class="btn btn-primary" data-action="level-next" ${selected===null?'disabled':''}>Next →</button>`:`<button type="button" class="btn btn-primary" data-action="level-finish" ${done!==LEVEL_TOTAL||levelBusy?'disabled':''}>${levelBusy?'Saving…':'Finish & save results →'}</button>`}</div>
    ${index===LEVEL_TOTAL-1&&done<LEVEL_TOTAL?`<p class="fineprint muted">${LEVEL_TOTAL-done} unanswered. Go back to finish the questions before submitting.</p>`:''}
    <p class="fineprint muted">No feedback until you finish, so the result reflects your starting point. Your answers are saved on this device during the test.</p></section>`;
}
function levelResultsView(attempt,t){
  const verified=Array.isArray(attempt.answers)?(()=>{try{return scoreAnswers(attempt.answers);}catch{return null;}})():null;
  const scores=verified?.scores||attempt.scores||{};
  const plan=studyPlan(scores);
  const placement=diagnosticPlacement(scores);
  const recommended=LESSONS[placement.index]||LESSONS[0];
  const coach=localDiagnosticFeedback(scores);
  const advice=t.advice||(t.aiStatus==='built-in'?null:t.localAdvice)||null;
  const correct=verified?.correct??Number(attempt.correctCount||0);
  return `<div class="page-head level-results-head"><div><span class="level-eyebrow">🎯 LEVEL TEST COMPLETED · ONE ATTEMPT</span><h1>Your learning map</h1><p>Based on ${LEVEL_TOTAL} practice questions. You can revisit this page whenever you want.</p></div><span class="level-score-tag">${correct}/${LEVEL_TOTAL} correct</span></div>
    <section class="panel level-placement"><span class="level-eyebrow">YOUR RECOMMENDED STARTING POINT</span>
      <h2>Lesson ${placement.index+1}: ${escapeHTML(recommended.title)}</h2>
      <p>Based on your answers, you can start here. <strong>Lessons 1–${placement.index+1} are accessible now.</strong> ${placement.skippedCheckpoints?`The first ${placement.skippedCheckpoints} checkpoints are waived for access.`:'Start with Lesson 1; no checkpoint is required yet.'}</p>
      <p class="fineprint muted">Earlier lessons are unlocked for revision, but they are not marked complete and do not give XP or GIS Points. From this starting point onward, ordinary four-lesson checkpoints apply.</p>
      <button type="button" class="btn btn-primary" data-level-lesson="${escapeHTML(recommended.id)}">Start Lesson ${placement.index+1} →</button>
      <button type="button" class="btn btn-light" data-nav="learn">View all lessons</button>
    </section>
    <section class="panel level-results-panel"><h2>Your six topic scores</h2><p class="muted fineprint">Each area has 4 questions. These scores show where to start, not your ability or exam grade.</p><div class="level-score-grid">${LEVEL_TOPICS.map(topic=>{
      const score=Math.max(0,Math.min(4,Number(scores[topic.id]||0)));
      return `<div class="level-topic-row"><div class="level-topic-head"><strong>${topic.emoji} ${escapeHTML(topic.label)}</strong><span>${score}/4 · ${strengthLabel(score)}</span></div><div class="level-score-bar"><div style="width:${score/4*100}%"></div></div></div>`;
    }).join('')}</div></section>
    <section class="level-plan"><div class="section-head"><div><h2>Topics worth revisiting 📚</h2><p>These are optional focus areas based on the questions you missed. Your recommended main lesson is above.</p></div></div>
      <div class="level-plan-grid">${plan.map((item,i)=>{
        const topic=LEVEL_TOPICS.find(t=>t.id===item.topic);if(!topic)return '';
        const lesson=LESSONS.find(l=>l.id===item.lesson);
        return `<article class="level-plan-card"><span class="level-order">${i+1}</span><h3>${topic.emoji} ${escapeHTML(topic.label)}</h3><p>${escapeHTML(topic.focus)}</p>${lesson?`<button type="button" class="btn btn-primary btn-small" data-level-lesson="${escapeHTML(lesson.id)}">Study ${escapeHTML(lesson.title)} →</button>`:`<button type="button" class="btn btn-light btn-small" data-nav="igcse">Explore this topic →</button>`}</article>`;
      }).join('')}</div></section>
    <section class="panel level-ai"><div class="section-head"><div><h2>Study coach</h2><p class="muted">Practice suggestions based on your topic scores.</p></div></div>
      <p class="level-ai-summary">${escapeHTML(coach.summary)}</p><div class="level-ai-tips">${coach.steps.map(x=>`<p><strong>${escapeHTML(LEVEL_TOPICS.find(t=>t.id===x.topic)?.label||'Study tip')}:</strong> ${escapeHTML(x.reason)}</p>`).join('')}</div>
      ${localPreview?'':`<h3>Optional AI feedback</h3>
      ${advice?`<p class="fineprint muted">${t.aiStatus==='built-in'?'Built-in advice (online AI not configured)':'Online AI feedback'}</p><p class="level-ai-summary">${escapeHTML(advice.summary)}</p><div class="level-ai-tips">${(advice.steps||[]).map(x=>`<p><strong>${escapeHTML(LEVEL_TOPICS.find(t=>t.id===x.topic)?.label||'Study tip')}:</strong> ${escapeHTML(x.reason)}</p>`).join('')}</div>`:
      `<p class="muted">${t.aiStatus==='loading'?'Generating AI feedback…':t.aiError?escapeHTML(t.aiError):'Select Generate AI feedback to try the optional online coach. Your study plan above already works without it.'}</p><button type="button" class="btn btn-light" data-action="level-ai" ${t.aiStatus==='loading'?'disabled':''}>${t.aiStatus==='loading'?'Thinking…':'Generate AI feedback'}</button>`}
      ${t.aiStatus==='built-in'?'<p class="fineprint muted">The online AI is unavailable or has not been configured. Your built-in analysis is available above.</p>':''}`}
      <p class="fineprint muted">A 24-question test cannot measure everything. Keep learning and ask a teacher if you need a deeper review.</p></section>`;
}
function announcementCards(limit=100){
  const notice=announcementState();
  if(notice.error)return `<p class="feedback bad">${escapeHTML(notice.error)}</p>`;
  if(notice.loading)return '<p class="muted">Loading school notices…</p>';
  const posts=notice.posts.filter(p=>p.status==='published').slice(0,limit);
  if(!posts.length)return '<div class="notice-empty">No announcements yet.</div>';
  return `<div class="notice-list">${posts.map(p=>`<article class="notice-card ${p.pinned?'notice-pinned':''}">
    <div class="notice-tags"><span class="notice-kind ${p.kind==='reminder'?'reminder':''}">${p.kind==='reminder'?'⏰ Reminder':'📣 Announcement'}</span>${p.pinned?'<span class="notice-pin">📌 Pinned</span>':''}${p.dueDate?`<span class="notice-due">Due: ${escapeHTML(p.dueDate)}</span>`:''}</div>
    <h3>${escapeHTML(p.title)}</h3><p>${escapeHTML(p.body)}</p>
  </article>`).join('')}</div>`;
}
function announcementsView(){
  return `<div class="page-head"><div><h1>School announcements 📣</h1><p>Updates and reminders from approved PyQuest admins.</p></div><span class="tag">${announcementState().posts.filter(x=>x.status==='published').length} posts</span></div>
    ${announcementCards()}<p class="fineprint muted">Announcements appear inside PyQuest after you log in. They are not email or push notifications.</p>`;
}
function announcementsChanged(){
  if(!user)return;
  if(page==='admin')renderPreservingFormValues();
  else if(page==='home'||page==='announcements')render();
}
function adminAnnouncementsPanel(){
  const notices=announcementState();
  const post=editingAnnouncementId&&editingAnnouncementId!=='new'?notices.posts.find(x=>x.id===editingAnnouncementId):null;
  const val=(key,defaultValue='')=>escapeHTML(post?.[key]??defaultValue);
  return `<section class="panel admin-management"><div class="section-head"><div><h2>School announcements 📣</h2><p class="muted">Publish posts or reminders to all signed-in students.</p></div><button type="button" class="btn btn-primary btn-small" data-action="announcement-new">+ New post</button></div>
    ${notices.error?`<p class="feedback bad">${escapeHTML(notices.error)}</p>`:''}
    ${editingAnnouncementId?`<form class="help-form" id="admin-announcement-form">
      <h3>${post?'Edit announcement':'Create a post'}</h3>
      <label for="announcement-title">Title</label><input id="announcement-title" data-preserve minlength="4" maxlength="100" required value="${val('title')}" placeholder="e.g. Python quiz on Friday">
      <label for="announcement-body">Message</label><textarea id="announcement-body" data-preserve minlength="10" maxlength="1200" rows="5" required placeholder="Write your update or reminder…">${val('body')}</textarea>
      <div class="form-two"><div><label for="announcement-kind">Type</label><select id="announcement-kind" data-preserve><option value="announcement" ${post?.kind!=='reminder'?'selected':''}>Announcement</option><option value="reminder" ${post?.kind==='reminder'?'selected':''}>Reminder</option></select></div>
      <div><label for="announcement-due">Due date (optional)</label><input id="announcement-due" data-preserve type="date" value="${val('dueDate')}"></div></div>
      <div class="form-two"><div><label for="announcement-status">Visibility</label><select id="announcement-status" data-preserve><option value="draft" ${post?.status!=='published'?'selected':''}>Draft — admins only</option><option value="published" ${post?.status==='published'?'selected':''}>Published — students can read</option></select></div>
      <div><label class="notice-check"><input id="announcement-pinned" data-preserve type="checkbox" ${post?.pinned?'checked':''}> Pin to top</label></div></div>
      <div class="admin-row-actions"><button type="submit" class="btn btn-primary">Save post</button><button type="button" class="btn btn-light" data-action="announcement-cancel">Cancel</button></div>
    </form>`:''}
    <div class="managed-lessons">${notices.loading?'<p class="muted">Loading posts…</p>':notices.posts.length?notices.posts.map(p=>`<div class="managed-row"><div><strong>${p.pinned?'📌 ':''}${escapeHTML(p.title)}</strong><p class="muted">${p.kind==='reminder'?'Reminder':'Announcement'} · ${escapeHTML(p.status)}${p.dueDate?' · Due '+escapeHTML(p.dueDate):''}</p></div><div class="admin-row-actions"><button type="button" class="btn btn-light btn-small" data-edit-announcement="${escapeHTML(p.id)}">Edit</button><button type="button" class="btn btn-light btn-small" data-announcement-status="${escapeHTML(p.id)}" data-next-status="${p.status==='published'?'draft':'published'}">${p.status==='published'?'Unpublish':'Publish'}</button><button type="button" class="btn btn-light btn-small danger" data-announcement-status="${escapeHTML(p.id)}" data-next-status="archived" ${p.status==='archived'?'disabled':''}>Archive</button></div></div>`).join(''):'<p class="muted">No posts yet. Click + New post to create one.</p>'}</div>
    <p class="fineprint muted">Only approved admins can publish posts. All signed-in students can read published posts. Avoid including personal student information.</p>
  </section>`;
}
function leaderboardUpdated(){
  const board=leaderboardState(),nickname=socialState().profile?.nickname;
  if(user && cloudReady && !cloudWrite && pendingEmpty() && board.me && nickname &&
    (board.me.nickname!==nickname || board.me.xp!==data.xp)){
    void updateLeaderboard(nickname).catch(e=>console.warn('Leaderboard catchup:',e.message));
  }
  if(user && page==='leaderboard')render();
}
async function updateLeaderboardWhenJoined(){
  if(!user||!cloudReady)return;
  try{await updateLeaderboard(socialState().profile?.nickname);}catch(e){console.warn('Leaderboard update:',e.message);}
}
function leaderboardView(){
  const board=leaderboardState(), joined=!!board.me, weekly=leaderboardMode==='week';
  const entries=weekly?board.weekly:board.all;
  const display=entries.slice(0,25);
  const myPosition=entries.findIndex(x=>x.id===user?.uid);
  const rows=display.length?display.map((entry,i)=>{
    const isMe=entry.id===user.uid,place=i+1;
    const medal=place===1?'🥇':place===2?'🥈':place===3?'🥉':String(place);
    return `<div class="leaderboard-row ${isMe?'mine':''}"><span class="rank-mark">${medal}</span><span class="leaderboard-person"><strong>${escapeHTML(entry.nickname)}</strong>${isMe?'<small>You</small>':''}</span><span class="leaderboard-metric">${weekly?Number(entry.weeklyXp||0):Number(entry.xp||0)} <small>XP</small></span><span class="leaderboard-details">${Number(entry.lessons||0)} lessons · ${Number(entry.quests||0)} quests</span></div>`;
  }).join(''):'<div class="leaderboard-empty">No scores yet. Be the first to join!</div>';
  const you=joined?`<div class="leaderboard-you"><div><strong>Your rank: ${myPosition>=0?'#'+(myPosition+1):'Not ranked yet'}</strong><p>Only your preferred name appears to classmates.</p></div><button type="button" class="btn btn-light btn-small" data-action="leave-leaderboard">Leave leaderboard</button></div>`:
    `<div class="leaderboard-join"><div><strong>Join the friendly leaderboard?</strong><p>Joining is optional. Your preferred name, XP and counts become visible to signed-in PyQuest students. Student IDs and email addresses stay private.</p></div><button type="button" class="btn btn-primary" data-action="join-leaderboard" ${!cloudReady?'disabled':''}>Join leaderboard</button></div>`;
  return `<div class="page-head"><div><h1>Leaderboard 🏆</h1><p>Learn, earn XP and celebrate progress.</p></div><span class="tag">${board.all.length} participants</span></div>
  ${you}<div class="leaderboard-switch" role="group" aria-label="Leaderboard period"><button type="button" data-board-mode="all" class="${weekly?'':'chosen'}">All time</button><button type="button" data-board-mode="week" class="${weekly?'chosen':''}">This week</button></div>
  <section class="panel leaderboard-panel">${board.error?`<p class="leaderboard-error">Couldn't load leaderboard: ${escapeHTML(board.error)}</p>`:''}
  ${board.loading?'<p class="muted">Loading scores…</p>':rows}</section>
  <p class="fineprint muted">Weekly XP starts after joining. Weekly scores reset on Monday (Malaysia time). Scores reflect completed in-app activities, not exam marks. Ranks show the top 25 among up to 250 participants.</p>`;
}
function learnView() {
  const {units, checkpoint, lesson, current} = coursePlan();
  const previous = $('app').querySelectorAll?.('.course-unit') ?? [];
  const unitsHTML = units.map(unit => {
    const recommended = unit === current;
    const old = previous[unit.group];
    const open = old && old.open !== (old.dataset.recommended === 'true') ? old.open : recommended;
    const status = unit.passed ? 'Checkpoint passed' : unit.waived ? 'Waived by level test' : unit.ready ? 'Checkpoint ready' :
      unit.requiredCheckpoint !== null ? 'Locked' : `${unit.completed} of ${LESSONS_PER_CHECKPOINT} done`;
    return `<details class="course-unit" data-recommended="${recommended}" ${open ? 'open' : ''}>
      <summary ${recommended ? 'id="current-course-unit"' : ''}>
        <span class="course-unit-index">${String(unit.group + 1).padStart(2, '0')}</span>
        <span class="course-unit-title"><strong>${escapeHTML(unit.title)}</strong><small>Lessons ${unit.from + 1}–${unit.end}</small></span>
        <span class="course-unit-status">${status}</span>
        <span class="course-unit-chevron" aria-hidden="true"></span>
      </summary>
      <div class="course-unit-content">
        ${courseLessonRows(unit.from, unit.end, checkpoint ? null : lesson, unit.requiredCheckpoint)}
        ${unitCheckpoint(unit)}
      </div>
    </details>`;
  }).join('');
  return `<div class="course-page-head">
    <div><h1>Python learning path</h1><p>Work through four lessons, then take the unit’s eight-question checkpoint.</p></div>
    ${courseProgress()}
  </div>
  ${current?.group > 0 ? `<button type="button" class="text-link current-unit-link" data-jump-target="current-course-unit">Jump to unit ${current.group + 1} <span aria-hidden="true">↓</span></button>` : ''}
  <section class="course-path" aria-label="Course units">${unitsHTML}</section>
  ${LESSONS.length > fixedLessonCount ? `<section class="school-lessons"><h2>School lessons</h2>${courseLessonRows(fixedLessonCount, LESSONS.length, checkpoint ? null : lesson)}</section>` : ''}`;
}

function taskPreviewHTML(steps, showTarget = false) {
  if (!steps.length) return '';
  const stages = [['start', 'Start'], ['work', 'Steps'], ['result', 'Result']];
  const result = steps.at(-1);
  return `<details class="task-preview" data-task-preview data-current-step="0">
    <summary><span>Visualize task</span><span class="task-preview-chevron" aria-hidden="true">⌄</span></summary>
    <div class="task-preview-content">
      <nav class="task-preview-stages" aria-label="Program preview stages">
        ${stages.map(([phase, name], i) => `<button type="button" data-preview-step="${steps.findIndex(step => step.phase === phase)}"
          data-preview-phase="${phase}" ${i === 0 ? 'aria-current="step"' : ''}>${name}</button>`).join('')}
      </nav>
      ${steps.map((step, i) => `<section class="task-preview-pane" data-preview-frame="${step.phase}" ${i ? 'hidden' : ''}>
        <h3>${escapeHTML(step.title)}</h3>
        ${step.values ? `<dl class="task-preview-values">${Object.entries(step.values).map(([name, value]) =>
          `<div><dt>${escapeHTML(name)}</dt><dd><code>${escapeHTML(value)}</code></dd></div>`
        ).join('')}</dl>` : ''}
        ${step.note ? `<p>${escapeHTML(step.note)}</p>` : ''}
        ${step.code ? `<pre class="task-preview-code" tabindex="0" aria-label="Worked code"><code>${escapeHTML(step.code)}</code></pre>` : ''}
        ${step.output !== undefined ? `<figure class="task-preview-console">
          <figcaption>${escapeHTML(step.outputLabel)}</figcaption>
          <pre><code>${escapeHTML(step.output)}</code></pre>
        </figure>` : ''}
      </section>`).join('')}
      <div class="task-preview-controls">
        <button type="button" class="btn btn-light" data-preview-move="-1" disabled>Previous step</button>
        <span data-preview-status role="status">Step 1 of ${steps.length}</span>
        <button type="button" class="btn btn-primary" data-preview-move="1">Next step</button>
      </div>
    </div>
  </details>${showTarget ? `<div class="target-output task-target-output"><strong>Expected output</strong><pre>${escapeHTML(result.output)}</pre></div>` : ''}`;
}

function showTaskPreviewStep(button) {
  const preview = button.closest('[data-task-preview]');
  if (!preview || button.disabled) return;
  const frames = [...preview.querySelectorAll('[data-preview-frame]')];
  const current = Number(preview.dataset.currentStep);
  const next = button.dataset.previewStep === undefined
    ? current + Number(button.dataset.previewMove)
    : Number(button.dataset.previewStep);
  if (!Number.isInteger(next) || next < 0 || next >= frames.length || next === current) return;

  preview.dataset.currentStep = String(next);
  frames[current].hidden = true;
  frames[next].hidden = false;
  for (const stage of preview.querySelectorAll('[data-preview-phase]')) {
    if (stage.dataset.previewPhase === frames[next].dataset.previewFrame) stage.setAttribute('aria-current', 'step');
    else stage.removeAttribute('aria-current');
  }
  preview.querySelector('[data-preview-move="-1"]').disabled = next === 0;
  preview.querySelector('[data-preview-move="1"]').disabled = next === frames.length - 1;
  preview.querySelector('[data-preview-status]').textContent = `Step ${next + 1} of ${frames.length}`;
  if (button.disabled) preview.querySelector('[aria-current="step"]')?.focus({preventScroll: true});
}

function editor(value, context) {
  const hasAnswer = context === 'lesson' || context === 'quest' || labSelection !== 'free';
  return `<div class="editor-heading"><label for="code-input">Your code</label><span aria-hidden="true">Ctrl / ⌘ + Enter to run</span></div>
    <p id="editor-keyboard-help" class="visually-hidden">Tab indents. Press Escape, then Tab, to leave the editor. Press Control or Command and Enter to run.</p>
    <div class="code-area">
      <div class="code-top"><span>main.py</span><span>Python 3</span></div>
      <textarea id="code-input" class="code-input" data-context="${context}" aria-describedby="editor-keyboard-help" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" wrap="off">${escapeHTML(value)}</textarea>
    </div>
    <div class="code-actions editor-controls">
      <button type="button" class="btn btn-primary" data-action="run"><span aria-hidden="true">▷</span> Run code</button>
      ${hasAnswer ? '<button type="button" class="btn btn-green" data-action="check">Check answer</button>' : ''}
      <button type="button" class="btn btn-light" id="stop-code" data-action="stop-code" hidden>Stop</button>
      <button type="button" class="btn btn-light reset-code" data-action="reset">Reset</button>
    </div>
    <p id="editor-output-label" class="editor-output-label">Output</p>
    <div id="output" class="output" role="status" aria-labelledby="editor-output-label">Click Run code to start.</div>
    <div id="feedback"></div>`;
}
function lessonView(){const l=LESSONS[lessonIndex];if(!l)return learnView();
  const d=LESSON_DEPTH[l.id];const activities=[l,...(EXTRA_EXERCISES[l.id]||[])];const marks=practiceMarks(l.id);const task=currentLessonTask();
  const group = Math.floor(lessonIndex / LESSONS_PER_CHECKPOINT);
  const unit = group < courseUnitCount ? courseUnits()[group] : null;
  const checkpointInstruction = unit && group + 1 < courseUnitCount
    ? `Pass checkpoint ${group + 1} to unlock lessons ${unit.end + 1}–${unit.end + LESSONS_PER_CHECKPOINT}.`
    : 'Pass the final checkpoint to finish the course.';
  return `<div class="page-head lesson-page-head">
    <div><p class="course-label">Lesson ${lessonIndex + 1} of ${LESSONS.length}${unit ? ` · ${escapeHTML(unit.title)}` : ''}</p><h1>${escapeHTML(l.title)}</h1></div>
    <div class="lesson-heading-actions">
      <button type="button" class="btn btn-light" data-action="back-lessons">All lessons</button>
      <button type="button" class="btn btn-light lesson-section-link" data-jump-target="lesson-notes">Lesson notes <span aria-hidden="true">↓</span></button>
    </div>
  </div>
  ${unit?.ready ? `<div class="lesson-checkpoint-notice"><strong>Unit complete.</strong> ${checkpointInstruction}<button type="button" class="btn btn-primary" data-checkpoint="${group}">Take checkpoint ${group + 1}</button></div>` : ''}
  <div class="lesson-practice-progress"><div><strong>${marks.filter(Boolean).length}/3 coding exercises passed</strong><small>${data.completed.includes(l.id)?'Lesson completion saved':"All three must pass to earn this lesson's XP"}</small></div><div class="lesson-progress-meter"><span style="width:${Math.round(marks.filter(Boolean).length/3*100)}%"></span></div></div>
  <div class="lesson-layout deeper-layout">
    <section class="panel lesson-editor-panel" aria-labelledby="lesson-exercises">
      <h2 id="lesson-exercises" tabindex="-1">Coding exercises</h2>
      <div class="lesson-activity-tabs" role="group" aria-label="Choose an exercise">${activities.map((x,i)=>`<button type="button" data-exercise="${i}" class="${activeExercise===i?'current':''} ${marks[i]?'passed':''}" aria-pressed="${activeExercise===i}"><span class="exercise-number" aria-hidden="true">${marks[i]?'✓':i+1}</span>${i===0?'Core task':escapeHTML(x.title)}<span class="exercise-completion visually-hidden" ${marks[i]?'':'hidden'}>completed</span></button>`).join('')}</div>
      <div class="lesson-task-detail">
        <p>${escapeHTML(task.prompt)}</p>
        ${taskPreviewHTML(lessonPreview(l, task, activeExercise, d?.worked), activeExercise > 0)}
        <button type="button" class="btn btn-quiet btn-small" data-action="hint" aria-controls="hint-text" aria-expanded="false">Show hint</button>
        <div id="hint-text" class="small-note" hidden>${escapeHTML(task.hint||l.hint)}</div>
      </div>
      ${editor(data.drafts[lessonDraftKey(l.id,activeExercise)] ?? task.starter,'lesson')}
      <div class="lesson-step-footer"><button type="button" class="btn btn-light" data-action="previous" ${lessonIndex===0?'disabled':''}>Previous lesson</button>${activeExercise<2?`<button type="button" class="btn btn-quiet" data-exercise="${activeExercise+1}">Next exercise</button>`:`<button type="button" class="btn btn-quiet" data-action="next">Next lesson</button>`}</div>
    </section>
    <aside class="guide lesson-reference" aria-labelledby="lesson-notes">
      <section class="panel lesson-teach-panel"><h2 id="lesson-notes" tabindex="-1">Lesson notes</h2><p class="concept">${escapeHTML(l.description)}</p><h3>First worked example</h3><pre class="sample">${escapeHTML(l.example)}</pre><p class="fineprint muted">Read each line and predict the output before you try the example.</p></section>
      ${d ? `<section class="panel lesson-teach-panel"><h2>Go deeper</h2><p class="concept">${escapeHTML(d.deep)}</p><h3>Second worked example</h3><pre class="sample">${escapeHTML(d.worked)}</pre><p class="lesson-mistake"><strong>Common mistake:</strong> ${escapeHTML(d.mistake)}</p></section>
      <section class="panel lesson-teach-panel"><h2>Quick check</h2><details class="lesson-thinking"><summary>${escapeHTML(d.check)}</summary><p>${escapeHTML(d.answer)}</p></details><p class="muted">Explain your answer in your own words, then test it with code.</p></section>` : ''}
      <button type="button" class="btn btn-light lesson-section-link" data-jump-target="lesson-exercises">Back to exercises <span aria-hidden="true">↑</span></button>
    </aside>
  </div>`;
}

function labTask(){return labSelection==='free'?null:LESSONS.find(l=>l.id===labSelection)||null;}
function labView(){const l=labTask();const code=l?(data.drafts['lab-'+l.id]??l.starter):data.labCode;return `<div class="page-head"><div><h1>Code Lab 💻</h1><p>Write Python. Press Run.</p></div><span class="tag">Python 3</span></div>
  <div class="code-layout"><div class="guide"><section class="panel"><h2>Choose a challenge</h2><select id="lab-select" class="selector" aria-label="Select a challenge"><option value="free">✨ Free coding</option>${LESSONS.map(x=>`<option value="${x.id}" ${x.id===labSelection?'selected':''}>${x.emoji} ${escapeHTML(x.title)}</option>`).join('')}</select>${l?`<p class="task-text">${escapeHTML(l.prompt)}</p>${taskPreviewHTML(lessonPreview(l), true)}<button class="btn btn-quiet" type="button" data-action="hint">💡 Hint</button><div id="hint-text" class="small-note" hidden>${escapeHTML(l.hint)}</div>`:'<p class="muted">Build anything you like.</p>'}</section></div><section class="panel">${editor(code,'lab')}</section></div>`;}
function quizView(){const n=QUIZZES.length;if(quizIndex>=n)return `<div class="quiz-shell"><div class="panel quiz-panel center"><div class="end-emoji">🏆</div><h2>Quiz complete!</h2><p class="muted">You got ${quizScore} out of ${n}.</p><div class="code-actions" style="justify-content:center"><button class="btn btn-primary" type="button" data-action="restart-quiz">Play again</button><button class="btn btn-light" type="button" data-nav="learn">Learn more</button></div></div></div>`;
 const q=QUIZZES[quizIndex];return `<div class="quiz-shell"><div class="page-head"><div><h1>Quick Quiz 🧠</h1><p>Choose the correct answer.</p></div></div><div class="quiz-progress"><span>Question ${quizIndex+1}/${n}</span><span>⚡ +20 XP for new correct answers</span></div><div class="progress-track"><div class="progress-fill" style="width:${quizIndex/n*100}%"></div></div><section class="panel quiz-panel"><h2>${escapeHTML(q.question)}</h2><div class="answers">${q.answers.map((a,i)=>`<button type="button" ${quizChecked?'disabled':''} data-choice="${i}" class="answer ${quizChecked?(i===q.correct?'correct':quizChoice===i?'wrong':''):quizChoice===i?'selected':''}"><span class="letter">${'ABCD'[i]}</span>${escapeHTML(a)}</button>`).join('')}</div>${quizChecked?`<div class="result">✅ Correct! ${escapeHTML(q.why)}</div>`:''}${quizFeedback?`<div class="feedback bad">💡 ${escapeHTML(quizFeedback)} ${onlineHint}</div>`:''}<div class="quiz-footer"><button type="button" class="btn btn-primary" data-action="${quizChecked?'next-question':'check-quiz'}" ${!quizChecked&&quizChoice===null?'disabled':''}>${quizChecked?(quizIndex===n-1?'See result →':'Next →'):'Check answer'}</button></div></section></div>`;
}

function questCards(limit=QUESTS.length){return `<div class="lesson-grid quest-grid">${QUESTS.slice(0,limit).map((q,i)=>`<a href="#challenge/${encodeURIComponent(q.id)}" class="lesson-card quest-card" data-quest="${i}" aria-label="Open challenge: ${escapeHTML(q.title)}"><div class="lesson-top"><span class="lesson-emoji">${q.emoji}</span><span class="lesson-check ${data.questDone.includes(q.id)?'done':''}">${data.questDone.includes(q.id)?'✓ Done':'★'.repeat(q.difficulty)}</span></div><h3>${escapeHTML(q.title)}</h3><p>${escapeHTML(q.tagline)}</p><small>${escapeHTML(q.topic)} · +120 XP</small></a>`).join('')}</div>`;}
function questsView(){return `<div class="page-head"><div><h1>Python Challenges 🏆</h1><p>Choose a challenge below. Click its card to open the Python editor, write your function and press Check answer.</p></div><span class="tag">${data.questDone.length}/${QUESTS.length} cleared</span></div>${questCards()}`;}
function questView(){const q=QUESTS[questIndex];const code=data.drafts['quest-'+q.id]??q.starter;return `<div class="page-head"><div><div class="eyebrow">HARD QUEST · ${'★'.repeat(q.difficulty)}</div><h1>${q.emoji} ${escapeHTML(q.title)}</h1></div><button class="btn btn-light" type="button" data-nav="quests">All quests</button></div><div class="lesson-layout"><div class="guide"><section class="panel"><span class="tag">${escapeHTML(q.topic)}</span><h2 style="margin-top:14px">Mission</h2><p class="task-text">${escapeHTML(q.prompt)}</p><p class="muted">${q.checks} hidden checks · +120 XP</p>${taskPreviewHTML(challengePreview(q.id))}</section><section class="panel"><h2>Small hints 💡</h2><p class="muted">Reveal one at a time.</p><div id="quest-hints">${q.hints.map((x,i)=>`<p class="hint-step" ${i>slotBuff(gameState().wallet?.equipped,'head')?'hidden':''}>${i+1}. ${escapeHTML(x)}</p>`).join('')}</div><button class="btn btn-quiet" type="button" data-action="quest-hint">Reveal hint</button></section></div><section class="panel">${editor(code,'quest')}</section></div>`;}
function hintForQuiz(q){return `Think about this topic: ${q.question.split(' ').slice(0,5).join(' ')}. Eliminate choices that contradict the definition.`;}
function feedbackHint(task,error,out,isQuest){
  if(error){if(/IndentationError|unindent/.test(error))return 'Python uses indentation to group code. Check the spaces after a colon.';if(/SyntaxError/.test(error))return 'Check colons, brackets and quotation marks on the line Python highlights.';if(/NameError/.test(error))return 'A variable or function name is missing or spelt differently. Check capital letters.';if(/TypeError/.test(error))return 'Check your data types and how arguments are passed to the function.';return 'Read the last error line, then test one smaller example.';}
  if(isQuest)return (task.hints?.[0] || 'Try empty inputs, boundary values and a short test case.')+(slotBuff(gameState().wallet?.equipped,'head')>0&&task.hints?.[1]?' Extra gear hint: '+task.hints[1]:'');
  if(!out)return 'Your code ran but printed nothing. Use print() to show the result.';
  return (task.hint || 'Compare your output with the required answer, including spaces and punctuation.')+(slotBuff(gameState().wallet?.equipped,'head')>0&&task.explain?' Extra gear hint: '+task.explain:'');
}
function igcseView(){
  const topic=IGCSE_TOPICS[igcseTopic], q=topic.questions[igcseQuestion];
  const done=data.igcseCorrect.length;
  return `<div class="page-head"><div><h1>IGCSE Computer Science 0478 🎓</h1><p>2026–2028 syllabus · Full topic notes, worked examples and exam-style practice</p></div><span class="tag">${done}/${IGCSE_TOPICS.reduce((sum,t)=>sum+t.questions.length,0)} questions mastered</span></div>
  <div class="panel" style="margin-bottom:20px"><strong>Paper 1:</strong> Computer Systems (Topics 1–6) &nbsp; <strong>Paper 2:</strong> Algorithms, Programming and Logic (Topics 7–10).<p class="muted fineprint">Original practice questions, not official exam questions. Check the latest Cambridge syllabus for full coverage.</p><a href="${igcseSyllabus}" target="_blank" rel="noopener noreferrer">Official Cambridge syllabus ↗</a></div>
  <nav class="cs-exam-links" aria-label="Computer Science practice">
    <a class="cs-fresh-link" href="../../"><img src="../../fresh.svg" width="26" height="26" alt="">Return to Fresh</a>
    <a class="btn btn-primary" href="exam/#pseudocode">Pseudocode training</a>
    <a class="btn btn-light" href="exam/#scenario">15-mark scenarios</a>
    <a class="btn btn-light" href="exam/#written">Longer answers</a>
    <a class="btn btn-light" href="exam/#trace-tables">Paper 2 skills</a>
  </nav>
  <div class="igcse-topics">${IGCSE_TOPICS.map((t,i)=>`<button type="button" data-topic="${i}" class="lesson-card ${i===igcseTopic?'selected-topic':''}"><span class="tag">Paper ${t.paper} · Topic ${t.id}</span><h3>${escapeHTML(t.title)}</h3><p>${escapeHTML(t.subtitle)}</p></button>`).join('')}</div>
  ${IGCSE_DEPTH[topic.id]?`<section class="panel igcse-depth"><div class="eyebrow">TOPIC ${topic.id} · COMPLETE NOTES</div><h2>${escapeHTML(topic.title)} — understand the ideas</h2><p class="concept">${escapeHTML(topic.description)}</p><div class="igcse-note-grid">${IGCSE_DEPTH[topic.id].sections.map(([heading,body],i)=>`<article class="igcse-note"><span class="mini-label">CONCEPT ${i+1}</span><h3>${escapeHTML(heading)}</h3><p>${escapeHTML(body)}</p></article>`).join('')}</div><div class="lesson-stretch"><h3>Worked example</h3><p>${escapeHTML(IGCSE_DEPTH[topic.id].worked)}</p></div><p class="lesson-mistake"><strong>Common exam mistake:</strong> ${escapeHTML(IGCSE_DEPTH[topic.id].mistake)}</p><p class="igcse-exam-tip"><strong>Exam technique:</strong> ${escapeHTML(IGCSE_DEPTH[topic.id].exam)}</p><details class="lesson-thinking"><summary>Test your understanding</summary><p>${escapeHTML(IGCSE_DEPTH[topic.id].think)}</p><details><summary>Reveal explanation</summary><p>${escapeHTML(IGCSE_DEPTH[topic.id].answer)}</p></details></details></section>`:''}
  <div class="panel igcse-question"><div class="eyebrow">TOPIC ${topic.id} · QUESTION ${igcseQuestion+1} OF ${topic.questions.length}</div><h2>Exam-style practice</h2><p>${escapeHTML(topic.description)}</p><h3>${escapeHTML(q.question)}</h3>
  <div class="answers">${q.answers.map((a,i)=>`<button type="button" data-igcse-choice="${i}" ${igcseAnswered?'disabled':''} class="answer ${igcseChoice===i?'selected':''}"><span class="letter">${'ABCD'[i]}</span>${escapeHTML(a)}</button>`).join('')}</div>
  ${igcseFeedback?`<div class="result ${igcseAnswered?'':'hint-feedback'}">${igcseAnswered?'✅ Correct!':'💡 Not quite — try again.'} ${escapeHTML(igcseFeedback)} ${igcseAnswered?'':onlineHint}</div>`:''}
  <div class="code-actions"><button class="btn btn-primary" type="button" data-action="igcse-check" ${igcseChoice===null||igcseAnswered?'disabled':''}>Check answer</button><button class="btn btn-light" type="button" data-action="igcse-next">Next question →</button></div></div>`;
}
function checkIGCSE(){const t=IGCSE_TOPICS[igcseTopic],q=t.questions[igcseQuestion];if(igcseChoice===null||igcseAnswered)return;
  if(igcseChoice!==q.correct){igcseFeedback=q.hint;igcseChoice=null;render();return;}
  igcseAnswered=true;igcseFeedback=q.why;const key=`${igcseTopic+1}-${igcseQuestion}`;
  if(!data.igcseCorrect.includes(key)){data.igcseCorrect.push(key);save({type:'igcse',id:key});notify('🎓 +15 XP for IGCSE practice!');}render();
}
function resetIGCSE(){igcseChoice=null;igcseFeedback='';igcseAnswered=false;}
async function requestAIHint(){
  const box=$('ai-response');if(!box)return;box.textContent='Preparing a hint…';
  let prompt='',hint='';
  if(page==='igcse'){const q=IGCSE_TOPICS[igcseTopic].questions[igcseQuestion];prompt=q.question;hint=q.hint;}
  else if(page==='quiz'){const q=QUIZZES[quizIndex];prompt=q.question;hint=quizFeedback;}
  else {const task=codeForTask();prompt=task?.prompt||'';hint=task?.hint||task?.hints?.[0]||'';}
  if(localPreview){box.textContent=hint||'Break the question into smaller steps and try one example.';return;}
  try {const token=await user.getIdToken();const response=await fetch('/.netlify/functions/ai-hint',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({question:prompt,hint})});if(!response.ok)throw Error('AI hints not configured');const body=await response.json();box.textContent=body.hint||hint;}
  catch(_){box.textContent='Tutor tip: '+(hint||'Break the question into smaller steps and try one example.');}
}
function gameZoneView(){const shop=gameShopHTML(gameTab,selectedCrate,readCharacterStyle(user.uid));
 if(gameTab!=='teams')return shop;
 return shop+teamGamesHTML(user,selectedRoom);
}
function staffMessageCards(){const chat=staffChatState();return `<div class="staff-message-list">${chat.loading?'<p class="muted">Loading…</p>':chat.error?`<p class="feedback bad">${escapeHTML(chat.error)}</p>`:chat.messages.length?chat.messages.map(m=>`<div class="message ${m.from===user.uid?'mine':''}"><div class="bubble"><small>${m.from===user.uid?'You':'School staff / student'}</small><p>${escapeHTML(m.text)}</p></div>${!adminRole&&m.from!==user.uid?`<button class="report-mini" data-staff-report="${escapeHTML(m.id)}">Report</button>`:''}</div>`).join(''):'<p class="muted">No messages yet. You can ask an admin a question here.</p>'}</div>
 <form id="staff-chat-form" class="chat-compose"><input id="staff-message" maxlength="600" value="${escapeHTML(composeDraft.staff)}" required placeholder="Write a message…" autocomplete="off"><button type="submit" class="btn btn-primary">Send</button></form><p class="fineprint muted">Only approved school admins and this student can see the conversation. Never send passwords or private details.</p>`;}
function staffChatStudentView(){return `<div class="page-head"><div><h1>✉️ Message school staff</h1><p>Private help from approved PyQuest admins.</p></div></div><section class="panel staff-chat-panel">${staffMessageCards()}</section>`;}
function adminRosterPanel(){const r=rosterState();const c=staffChatState();return `<section class="panel admin-management"><div class="section-head"><div><h2>👥 Students & direct messages</h2><p class="muted">Learning summaries only; no passwords or code drafts.</p></div><span class="tag">${r.rows.length} students</span></div>${r.error?`<p class="feedback bad">${escapeHTML(r.error)}</p>`:''}
  <div class="admin-roster-layout"><div class="admin-roster">${r.rows.map(st=>`<button class="roster-person ${c.target===st.uid?'selected':''}" data-staff-target="${escapeHTML(st.uid)}"><strong>${escapeHTML(st.nickname)}</strong><small>⚡ ${st.xp} XP · 📚 ${st.lessons} lessons · 🏆 ${st.quests} quests · 🧠 ${st.quizzes+st.igcse} questions</small></button>`).join('')||'<p class="muted">Student summaries appear after they sign in and sync their learning progress.</p>'}</div><div class="staff-chat-column">${c.target?staffMessageCards():'<div class="empty-staff-chat"><span>✉️</span><p>Choose a student to send a message.</p></div>'}</div></div>
  <p class="fineprint muted">Only school-approved admins should use this dashboard. The school should define message moderation, access and retention policies.</p></section>`;}
function updateTotals(){
  if($('xp-total'))$('xp-total').textContent=(data.xp+Number(gameState().wallet?.bonusXp||0))+' XP';
  if($('coin-total'))$('coin-total').firstChild.textContent=Number(gameState().wallet?.coins||0)+' ';
}
function localGameUpdated(){
  if(page==='game')renderPreservingFormValues();
  else if(['home','learn','checkpoint'].includes(page))refresh();
  else updateTotals();
}
function socialUpdated(snapshot){
  if(!user)return;
  if(cloudReady && snapshot.profile?.nickname)void syncStudentStats(user).catch(()=>{});
  if(cloudReady && leaderboardState().me && snapshot.profile?.nickname && snapshot.profile.nickname!==leaderboardState().me.nickname){
    void updateLeaderboard(snapshot.profile.nickname).catch(err=>console.warn('Leaderboard name:',err.message));
  }
  const ids=new Set();
  for(const f of snapshot.friendships||[])for(const uid of f.members||[])if(uid!==user.uid)ids.add(uid);
  for(const uid of ids){if(names.has(uid))continue;names.set(uid,'Coder');getNickname(uid).then(name=>{names.set(uid,name);if(page==='friends')renderPreservingChatInput();}).catch(()=>{});}
  if(page==='friends')renderPreservingChatInput();
  else if(page==='home'||page==='leaderboard')render();
  else {const nameEl=document.querySelector('.user-name');if(nameEl)nameEl.textContent=socialState().profile?.nickname||'Student';}
}
function renderPreservingChatInput(){
  const code=$('friend-code')?.value||'';
  const msg=$('chat-input')?.value||'';
  const reason=$('report-reason')?.value||'Bullying';
  render();
  if($('friend-code'))$('friend-code').value=code;
  if($('chat-input'))$('chat-input').value=msg;
  if($('report-reason'))$('report-reason').value=reason;
}
function userNickname(uid){return escapeHTML(names.get(uid)||'Coder');}
function otherOf(f){return f.members.find(id=>id!==user.uid);}
function friendRow(f,kind){const other=otherOf(f);return `<div class="friend-row"><div class="avatar">👤</div><div class="friend-main"><strong>${userNickname(other)}</strong><span>${kind==='friends'?'Friend':kind==='incoming'?'Wants to connect':'Request sent'}</span></div><div class="friend-actions">${kind==='friends'?`<button type="button" class="btn btn-primary btn-small" data-chat="${escapeHTML(f.id)}">Chat</button><button type="button" class="btn btn-light btn-small" data-remove="${escapeHTML(f.id)}">Remove</button>`:kind==='incoming'?`<button type="button" class="btn btn-primary btn-small" data-accept="${escapeHTML(f.id)}">Accept</button><button type="button" class="btn btn-light btn-small" data-remove="${escapeHTML(f.id)}">Decline</button>`:`<button type="button" class="btn btn-light btn-small" data-remove="${escapeHTML(f.id)}">Cancel</button>`}<button type="button" class="btn btn-light btn-small danger" data-block="${escapeHTML(other)}">Block</button></div></div>`;}
function chatView(){const ss=socialState();const f=friends().find(f=>f.id===ss.selected);if(!f)return '';
  const other=otherOf(f);
  return `<section class="panel chat-panel"><div class="chat-head"><div><h2>Chat with ${userNickname(other)}</h2><p class="muted">Only accepted friends can message.</p></div><button class="btn btn-light" type="button" data-action="close-chat">Close</button></div><div class="chat-history" role="log" aria-live="polite">${ss.messageLoading?'<p class="muted">Loading messages…</p>':ss.messages.length?ss.messages.map(m=>`<div class="message ${m.from===user.uid?'mine':''}"><div class="bubble"><div class="message-name">${m.from===user.uid?'You':userNickname(m.from)}</div><p>${escapeHTML(m.text)}</p></div>${m.from!==user.uid?`<button class="report-mini" type="button" data-report="${escapeHTML(m.id)}">Report</button>`:''}</div>`).join(''):'<p class="muted">Say hello 👋</p>'}</div>${reportTarget?`<div class="report-bar"><label for="report-reason">Report message:</label><select id="report-reason" class="selector"><option>Bullying</option><option>Inappropriate</option><option>Spam</option><option>Other</option></select><button class="btn btn-light btn-small" data-action="submit-report" type="button">Send report</button><button class="btn btn-light btn-small" data-action="cancel-report" type="button">Cancel</button></div>`:''}<form id="chat-form" class="chat-compose"><input id="chat-input" autocomplete="off" maxlength="500" value="${escapeHTML(composeDraft.friend)}" placeholder="Message a friend…" aria-label="Message" required><button class="btn btn-primary" type="submit">Send</button></form><p class="muted fineprint">Keep it kind. Don't share private information. Use Report or Block if needed.</p></section>`;
}
function friendsView(){const ss=socialState(),ds=directoryState(),f=friends(),requests=incoming(),sent=outgoing();
 const candidates=ds.list.filter(x=>x.id!==user.uid&&!ss.blocked.includes(x.id)&&!ss.friendships.some(fr=>fr.members.includes(x.id)));
 return `<div class="page-head"><div><h1>Friends 💬</h1><p>Discover classmates by name. Requests need approval before chatting.</p></div><span class="tag">${f.length} friends</span></div>
 <div class="name-reminder friend-name-reminder">🔔 <strong>Set your preferred name</strong> so classmates recognize you. <span>Your student ID stays private.</span></div>
 ${ss.error?`<div class="feedback bad">${escapeHTML(ss.error)}</div>`:''}${ds.error?`<div class="feedback bad">${escapeHTML(ds.error)}</div>`:''}
 <div class="social-layout"><div class="guide"><section class="panel"><h2>👤 My preferred name</h2>${ss.profile?`<form id="nickname-form" class="horizontal-form"><input id="new-nickname" maxlength="24" value="${escapeHTML(ss.profile.nickname)}" placeholder="Your preferred name" required aria-label="Your preferred name"><button class="btn btn-primary btn-small">Save</button></form>`:'<p class="muted">Setting up your profile…</p>'}
 <div class="directory-setting"><div><strong>Appear in classmate list</strong><p class="muted">Optional. Only your chosen name appears. Turn it off anytime.</p></div><button class="btn btn-light btn-small" data-action="toggle-directory">${ds.listed?'Leave list':'Join list'}</button></div></section>
 <section class="panel"><h2>🔎 Find a classmate</h2><input id="directory-search" data-preserve placeholder="Search preferred names…" autocomplete="off" maxlength="24" aria-label="Find a classmate by name"><div class="directory-results" id="directory-results">${directoryEntriesHTML(candidates)}</div></section>
 <section class="panel"><h2>Requests ${requests.length?'('+requests.length+')':''}</h2>${requests.map(x=>friendRow(x,'incoming')).join('')||'<p class="muted">No friend requests.</p>'}${sent.length?'<h3 class="subtitle">Sent requests</h3>'+sent.map(x=>friendRow(x,'outgoing')).join(''):''}</section></div>
 <div class="guide"><section class="panel"><h2>My friends (${f.length})</h2>${f.map(x=>friendRow(x,'friends')).join('')||'<p class="muted">Add a friend to chat and play team games.</p>'}</section>${chatView()}${ss.blocked.length?`<section class="panel"><h2>Blocked (${ss.blocked.length})</h2>${ss.blocked.map(id=>`<div class="friend-row">Blocked student <button class="btn btn-light btn-small" data-unblock="${escapeHTML(id)}">Unblock</button></div>`).join('')}</section>`:''}</div></div>`;
}
function directoryEntriesHTML(rows,search=''){const q=String(search||'').trim().toLowerCase();const filtered=rows.filter(x=>x.nickname?.toLowerCase().includes(q)).slice(0,35);
 return filtered.length?filtered.map(x=>`<div class="directory-person"><span class="directory-person-avatar">👤</span><strong>${escapeHTML(x.nickname||'Coder')}</strong><button type="button" class="btn btn-primary btn-small" data-add-user="${escapeHTML(x.id)}">Add friend</button></div>`).join(''):'<p class="muted">No matching classmates yet. They need to opt into the list.</p>';
}
// Private question system. Every submitted request belongs to one student and
// is routed to exactly one approved staff account.
function niceAdmin(id){return helpDeskState().admins.find(a=>a.id===id)?.displayName || 'Admin';}
function helpView(){
  const hd=helpDeskState();
  return `<div class="page-head"><div><h1>Ask an admin 🙋</h1><p>Choose a teacher or admin and send a private question.</p></div><span class="tag">${hd.tickets.length} requests</span></div>
  ${hd.error?`<div class="feedback bad">${escapeHTML(hd.error)}</div>`:''}
  <div class="help-layout"><section class="panel"><h2>New question</h2><form id="help-form" class="help-form">
    <label for="help-admin">Send to</label><select id="help-admin" data-preserve required><option value="">Choose an admin</option>${hd.admins.map(a=>`<option value="${escapeHTML(a.id)}">${escapeHTML(a.displayName||'Admin')} ${a.subject?'— '+escapeHTML(a.subject):''}</option>`).join('')}</select>
    <label for="help-topic">Topic</label><input id="help-topic" data-preserve minlength="4" maxlength="80" required placeholder="e.g. Python loops">
    <label for="help-question">Your question</label><textarea id="help-question" data-preserve minlength="10" maxlength="1500" rows="6" required placeholder="What did you try, and where are you stuck?"></textarea>
    <button class="btn btn-primary" type="submit" ${hd.admins.length?'':'disabled'}>Send question</button>
    <p class="fineprint muted">Only the selected admin can reply. Don't share passwords or private information.</p></form>
    ${!hd.admins.length?'<p class="small-note">No approved admins yet. The website owner needs to set them up in Firebase.</p>':''}</section>
  <section class="panel"><h2>Your questions</h2>${hd.loading?'<p class="muted">Loading questions…</p>':hd.tickets.length?hd.tickets.map(t=>`<article class="help-ticket"><div class="help-ticket-head"><strong>${escapeHTML(t.topic)}</strong><span class="help-status ${t.status==='answered'?'answered':''}">${t.status==='answered'?'Answered':'Awaiting reply'}</span></div><p class="muted">To ${escapeHTML(niceAdmin(t.adminId))}</p><p class="help-content">${escapeHTML(t.question)}</p>${t.status==='answered'?`<div class="help-answer"><strong>💡 Admin reply</strong><p>${escapeHTML(t.reply||'')}</p></div>`:''}</article>`).join(''):'<p class="muted">Your questions and replies will appear here.</p>'}</section></div>`;
}

// Secure account and learning management. Inputs are escaped for HTML output.
function localProfileView() {
  const profiles = localProfiles();
  const storage = browserStorageAvailable();
  return `<div class="page-head"><div><h1>Local profile</h1><p>Manage your curriculum, saved progress and backups.</p></div></div>
  <div class="local-profile-grid">
    <section class="panel local-profile-card">
      <h2>Curriculum</h2>
      <p>Work through the Python course or practise for Cambridge IGCSE Computer Science.</p>
      <div class="local-profile-actions">
        <button class="btn btn-light" type="button" data-nav="learn">Python lessons</button>
        <button class="btn btn-light" type="button" data-nav="igcse">IGCSE 0478</button>
      </div>
    </section>
    <section class="panel local-profile-card">
      <h2>${storage ? 'Saved in this browser' : 'Browser storage is unavailable'}</h2>
      <p>${storage
        ? 'Download your lessons, code drafts, test answers and gear. GIS Points stay in this browser.'
        : 'Download a backup of your progress before you close this tab.'}</p>
      <div class="local-profile-actions">
        <button class="btn btn-primary" type="button" data-action="download-profile-backup">Download backup</button>
        <button class="btn btn-light" type="button" data-action="choose-profile-backup">Restore backup</button>
      </div>
      <input id="profile-backup-file" type="file" accept=".json,application/json" aria-label="PyQuest backup file" hidden>
    </section>
  </div>
  <section class="panel local-profile-card local-profile-section">
    <h2>Syllabus source</h2>
    <p><a href="${igcseSyllabus}" target="_blank" rel="noopener noreferrer">Cambridge IGCSE Computer Science (0478)</a> · 2026–2028</p>
  </section>
  ${profiles.length > 1 ? `<details class="panel local-profile-section">
    <summary>Saved profiles on this browser</summary>
    <div class="profile-list">${profiles.map(profile => `<div class="profile-row">
      <strong>${escapeHTML(profile.label)}</strong>
      ${profile.uid === user.uid ? '<span>This tab</span>' : `<button class="btn btn-light" type="button" data-local-profile="${escapeHTML(profile.uid)}" aria-label="Switch to ${escapeHTML(profile.label)}">Switch</button>`}
    </div>`).join('')}</div>
  </details>` : ''}`;
}

function downloadProfileBackup() {
  const progress = browserStorageAvailable() ? load(user.uid) : data;
  const file = new Blob([createProfileBackup(user.uid, progress)], {type: 'application/json'});
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'PyQuest-progress.json';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
  notify('Progress backup downloaded.');
}

async function importProfileBackup(file, profile) {
  if (file.size > maxBackupBytes) throw new Error('This backup is too large.');
  let backup;
  try {
    backup = decodeProfileBackup(await file.text());
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error('Choose a valid PyQuest progress backup.');
    throw error;
  }
  if (user?.uid !== profile.uid || page !== 'account') return;
  if (!window.confirm('Restore this backup? It will replace this profile’s progress and gear. Your shared GIS Points stay as they are.')) return;
  await restoreProfileBackup(profile.uid, backup, normalize(backup.progress));
  if (user?.uid === profile.uid) {
    startLocalStudent(profile);
    focusPageHeading();
    notify('Progress backup restored.');
  }
}
function switchLocalProfile(uid){
  const profile=selectLocalProfile(uid);
  if(profile.uid===user.uid)return;
  history.replaceState(null,'','#home');
  startLocalStudent(profile);
  window.scrollTo(0,0);
}
function accountView(){
 if(localPreview)return localProfileView();
 const requests=passwordHelpState();
 return `<div class="page-head"><div><h1>Account & password 🔐</h1><p>Protect your PyQuest account.</p></div></div>
 <div class="help-layout"><section class="panel"><h2>Change my password</h2><p class="muted">Only you know your password. The new password must be unique and at least 12 characters.</p>
 <form id="password-change-form" class="help-form" autocomplete="off"><label for="current-password">Current password</label><input type="password" id="current-password" autocomplete="current-password" required>
 <label for="new-password">New PyQuest password</label><input type="password" id="new-password" autocomplete="new-password" minlength="12" maxlength="128" required>
 <label for="confirm-password">Confirm new password</label><input type="password" id="confirm-password" autocomplete="new-password" minlength="12" maxlength="128" required>
 <button class="btn btn-primary" type="submit">Change password</button></form>
 <p class="fineprint muted">Avoid your school's password. Your password goes directly to Firebase Authentication and is never saved in Google Sheets or Firestore.</p></section>
 <section class="panel"><h2>${adminRole?'Staff account support':'Password help'}</h2>
 ${adminRole?'<p class="muted">Staff with a verified email can request a Firebase password reset from the Admin sign-in page. Student passwords are not visible to admins.</p>':`<p class="muted">If you need help changing your password, send a request to an approved admin. Never include a password.</p><form id="password-help-form" class="help-form"><label for="password-help-reason">Reason</label><select id="password-help-reason"><option value="password-change">Help changing my password</option><option value="account-access">Account access concern</option></select><button class="btn btn-light" type="submit">Request admin help</button></form>
 ${requests.error?`<p class="feedback bad">${escapeHTML(requests.error)}</p>`:''}
 <h3>My requests</h3>${requests.requests.length?requests.requests.map(r=>`<div class="help-ticket"><strong>${escapeHTML(r.reason==='account-access'?'Account access':'Password change')}</strong><span class="help-status">${escapeHTML(r.status)}</span></div>`).join(''):'<p class="muted">No requests yet.</p>'}
 <p class="fineprint muted">If you cannot sign in at all, contact school IT outside PyQuest. Student-ID accounts cannot receive email password resets.</p>`}</section></div>`;
}
function adminLessonPanel(){
 const lm=lessonManagerState();
 const lesson=editingLessonId&&editingLessonId!=='new'?lm.lessons.find(l=>l.id===editingLessonId):null;
 const formOpen=!!editingLessonId;
 const val=(k,otherwise='')=>escapeHTML(lesson?.[k]??otherwise);
 return `<section class="panel admin-management"><div class="section-head"><div><h2>Manage lessons 📚</h2><p class="muted">Create drafts, edit lessons and publish them for students.</p></div><button class="btn btn-primary btn-small" type="button" data-action="lesson-new">+ New lesson</button></div>
 ${lm.error?`<div class="feedback bad">${escapeHTML(lm.error)}</div>`:''}
 ${formOpen?`<form id="admin-lesson-form" class="help-form"><h3>${lesson?'Edit lesson':'Create lesson'}</h3>
 <div class="form-two"><div><label for="lesson-title">Title</label><input id="lesson-title" data-preserve required maxlength="80" minlength="3" value="${val('title')}" placeholder="Python lesson title"></div><div><label for="lesson-tagline">Subtitle</label><input id="lesson-tagline" data-preserve maxlength="120" minlength="3" required value="${val('tagline')}" placeholder="A short description"></div></div>
 <div class="form-two"><div><label for="lesson-level">Level</label><select id="lesson-level" data-preserve>${['Beginner','Explorer','Advanced'].map(x=>`<option ${x===(lesson?.level||'Explorer')?'selected':''}>${x}</option>`).join('')}</select></div><div><label for="lesson-emoji">Emoji</label><input id="lesson-emoji" data-preserve value="${val('emoji','📘')}" maxlength="8" required></div></div>
 <label for="lesson-description">Explanation</label><textarea id="lesson-description" data-preserve required maxlength="3000" rows="3" placeholder="Explain the concept clearly">${val('description')}</textarea>
 <label for="lesson-example">Example Python code</label><textarea id="lesson-example" data-preserve required maxlength="3000" rows="4" spellcheck="false">${val('example')}</textarea>
 <label for="lesson-prompt">Student challenge</label><textarea id="lesson-prompt" data-preserve required maxlength="3000" rows="3">${val('prompt')}</textarea>
 <label for="lesson-starter">Starter code</label><textarea id="lesson-starter" data-preserve required maxlength="3000" rows="4" spellcheck="false">${val('starter')}</textarea>
 <label for="lesson-expected">Exact expected printed output</label><textarea id="lesson-expected" data-preserve required maxlength="500" rows="2" spellcheck="false">${val('expected')}</textarea>
 <label for="lesson-hint">Small hint</label><textarea id="lesson-hint" data-preserve required maxlength="3000" rows="2">${val('hint')}</textarea>
 <div class="form-two"><div><label for="lesson-minutes">Minutes</label><input id="lesson-minutes" data-preserve type="number" min="5" max="60" value="${Number(lesson?.minutes)||12}"></div><div><label for="lesson-status">Visibility</label><select id="lesson-status" data-preserve><option value="draft" ${!lesson||lesson.status==='draft'?'selected':''}>Draft</option><option value="published" ${lesson?.status==='published'?'selected':''}>Published</option></select></div></div>
 <div class="admin-row-actions"><button class="btn btn-primary" type="submit">Save lesson</button><button class="btn btn-light" type="button" data-action="lesson-cancel">Cancel</button></div></form>`:''}
 <div class="managed-lessons">${lm.loading?'<p class="muted">Loading lessons…</p>':lm.lessons.length?lm.lessons.map(l=>`<div class="managed-row"><div><strong>${escapeHTML(l.emoji||'📘')} ${escapeHTML(l.title)}</strong><p class="muted">${escapeHTML(l.level)} · ${escapeHTML(l.status)}</p></div><div class="admin-row-actions"><button type="button" class="btn btn-light btn-small" data-edit-lesson="${escapeHTML(l.id)}">Edit</button><button type="button" class="btn btn-light btn-small" data-lesson-status="${escapeHTML(l.id)}" data-next-status="${l.status==='published'?'draft':'published'}">${l.status==='published'?'Unpublish':'Publish'}</button><button type="button" class="btn btn-light btn-small danger" data-lesson-status="${escapeHTML(l.id)}" data-next-status="archived" ${l.status==='archived'?'disabled':''}>Archive</button></div></div>`).join(''):'<p class="muted">No admin-created lessons yet. Start with + New lesson.</p>'}</div>
 <p class="fineprint muted">The 64 built-in lessons stay available. Admin-created lessons appear to students only when published. Archive instead of deleting student learning history.</p></section>`;
}
function adminPasswordPanel(){
 const ph=passwordHelpState(), students=helpDeskState().students;
 return `<section class="panel admin-management"><h2>Password assistance 🔐</h2><p class="muted">Review password-help requests. Admins cannot see or change student passwords from this dashboard.</p>
 ${ph.error?`<div class="feedback bad">${escapeHTML(ph.error)}</div>`:''}
 ${ph.loading?'<p class="muted">Loading…</p>':ph.requests.length?ph.requests.map(r=>{
  const p=students.find(x=>x.id===r.studentUid);
  return `<div class="managed-row"><div><strong>${escapeHTML(p?.nickname||'Student')}</strong><p class="muted">${escapeHTML(r.reason==='account-access'?'Account access':'Password change')} · ${escapeHTML(r.status)}</p><p class="fineprint muted">Friend code: ${escapeHTML(p?.code||'not available')}</p></div><div class="admin-row-actions">${r.status==='open'?`<button class="btn btn-light btn-small" data-pw-review="${escapeHTML(r.id)}" data-pw-next="reviewed">Mark reviewed</button>`:''}${r.status!=='resolved'?`<button class="btn btn-light btn-small" data-pw-review="${escapeHTML(r.id)}" data-pw-next="resolved">Mark resolved</button>`:''}</div></div>`;
 }).join(''):'<p class="muted">No password-help requests yet.</p>'}
 <p class="fineprint muted">Verify student identity using school procedures before any recovery. Actual forgotten-password resets require a trusted server-side recovery tool run by school IT; marking a request resolved does not change a password.</p></section>`;
}

function adminView(){
  const hd=helpDeskState();
  const unanswered=hd.tickets.filter(t=>t.status!=='answered').length;
  return `<div class="page-head"><div><h1>Admin dashboard 🛡️</h1><p>Support students, publish lessons and review account help.</p></div><span class="tag">${escapeHTML(adminRole?.displayName || 'Admin')}</span></div>
   ${hd.error?`<div class="feedback bad">${escapeHTML(hd.error)}</div>`:''}
   <div class="stats"><div class="stat"><div class="stat-icon">📬</div><div><b>${unanswered}</b><span>Needs reply</span></div></div><div class="stat"><div class="stat-icon">✅</div><div><b>${hd.tickets.length-unanswered}</b><span>Answered</span></div></div><div class="stat"><div class="stat-icon">👥</div><div><b>${hd.students.length}</b><span>Student profiles*</span></div></div></div>
   <div class="help-layout"><section class="panel"><h2>Student preferred names</h2><p class="muted">Choose a student by name and friend code.</p>
   <form id="admin-rename-form" class="help-form"><label for="admin-student">Student</label><select id="admin-student" data-preserve required><option value="">Choose student</option>${hd.students.map(st=>`<option value="${escapeHTML(st.id)}">${escapeHTML(st.nickname||'Coder')} · ${escapeHTML(st.code||'No code')}</option>`).join('')}</select>
   <label for="admin-new-name">New preferred name</label><input id="admin-new-name" data-preserve maxlength="24" minlength="2" placeholder="Student's preferred name" required>
   <button type="submit" class="btn btn-primary" ${hd.students.length?'':'disabled'}>Update name</button></form>
   <p class="fineprint muted">Changes are recorded in an admin audit log. *Shows up to 100 profiles.</p></section>
   <section class="panel"><h2>Questions assigned to you</h2>${hd.loading?'<p class="muted">Loading requests…</p>':hd.tickets.length?hd.tickets.map(t=>{
     const sender=hd.students.find(st=>st.id===t.studentId);
     return `<article class="help-ticket"><div class="help-ticket-head"><strong>${escapeHTML(t.topic)}</strong><span class="help-status ${t.status==='answered'?'answered':''}">${t.status==='answered'?'Answered':'Needs reply'}</span></div>
     <p class="muted">From ${escapeHTML(sender?.nickname||'Student')} ${sender?.code?'· '+escapeHTML(sender.code):''}</p><p class="help-content">${escapeHTML(t.question)}</p>
     ${t.status==='answered'?`<div class="help-answer"><strong>Your reply</strong><p>${escapeHTML(t.reply||'')}</p></div>`:''}
     <form class="help-form reply-form" data-reply-form="${escapeHTML(t.id)}"><label for="reply-${escapeHTML(t.id)}">${t.status==='answered'?'Update answer':'Your answer'}</label><textarea id="reply-${escapeHTML(t.id)}" data-preserve maxlength="2000" minlength="2" rows="3" required placeholder="Give a helpful explanation…">${escapeHTML(t.reply||'')}</textarea><button class="btn btn-primary btn-small" type="submit">${t.status==='answered'?'Update reply':'Send reply'}</button></form></article>`;}).join(''):'<p class="muted">No questions assigned yet.</p>'}</section></div>${adminRosterPanel()}${adminAnnouncementsPanel()}${adminLessonPanel()}${adminPasswordPanel()}`;
}
function lessonsChanged(){
 const feed=lessonManagerState().lessons;
 const visible=adminRole?[]:feed.filter(x=>x.status==='published').map(x=>({
   ...x,id:'custom-'+x.id,minutes:Number(x.minutes)||12
 }));
 LESSONS.splice(fixedLessonCount,LESSONS.length-fixedLessonCount,...visible);
 if(page==='learn' && document.querySelector('.lesson-layout') && lessonIndex>=LESSONS.length){page='learn';render();return;}
 if(page==='admin')renderPreservingFormValues();
 else if(page==='home' || page==='learn' || page==='lab')refresh();
}
function passwordRequestsChanged(){if(page==='admin'||page==='account')renderPreservingFormValues();}
function renderPreservingFormValues(){
 const controls=[...document.querySelectorAll('[data-preserve]')].map(el=>({id:el.id,value:el.value,checked:el.type==='checkbox'?el.checked:null}));
 render();
 for(const c of controls){const el=$(c.id);if(el){el.value=c.value;if(c.checked!==null)el.checked=c.checked;}}
 if(page==='friends'&&$('directory-search'))$('directory-search').dispatchEvent(new Event('input',{bubbles:true}));
}

function helpDeskUpdated(){
  if(!user || (page!=='help' && page!=='admin'))return;
  const fields=[...document.querySelectorAll('[data-preserve]')].map(el=>({id:el.id,value:el.value,selected:el.selectionStart}));
  render();
  for(const item of fields){const el=$(item.id);if(el)el.value=item.value;}
}
function openQuest(i){if(!Number.isInteger(i)||i<0||i>=QUESTS.length){notify('Challenge not found.');return;}questIndex=i;showPage('quest','challenge/'+encodeURIComponent(QUESTS[i].id));}
async function socialAction(task){try{await task();}catch(err){notify(err?.message||'Action failed.');}}
async function sendComposeMessage(kind,value,send){
  if(sendingCompose[kind])return;
  const inputId=kind==='friend'?'chat-input':'staff-message';
  const message=String(value||'').trim();if(!message)return;
  sendingCompose[kind]=true;
  composeDraft[kind]=''; // clear draft BEFORE Firestore onSnapshot triggers a rerender
  if($(inputId))$(inputId).value='';
  try{await send(message);}
  catch(err){
    if(!composeDraft[kind]){
      composeDraft[kind]=message;
      if($(inputId))$(inputId).value=message;
    }
    notify(err?.message||'Message failed. Try again.');
  } finally {sendingCompose[kind]=false;}
}

function focusPageHeading() {
  const heading = document.querySelector?.('.workspace-layout .page h1');
  if (!heading) return;
  heading.tabIndex = -1;
  heading.focus({preventScroll: true});
}
function showPage(next,hash=next){
  if(current)stopWorker();
  page=next;
  if(location.hash!=='#'+hash)history.pushState(null,'','#'+hash);
  render();
  window.scrollTo(0,0);
  focusPageHeading();
}
function showGameTab(tab,room=selectedRoom){
  gameTab=tab;
  selectedRoom=room;
  showPage('game','game/'+tab+(tab==='teams'&&room?'/'+room:''));
}
function navigate(where){
  if(!user||!menuItems().some(([id])=>id===where))return;
  if(where==='leaderboard')refreshLeaderboardWeek();
  if(page==='friends'&&where!=='friends'){closeChat();composeDraft.friend='';}
  reportTarget=null;
  showPage(where,where==='game'?'game/'+gameTab:where);
}
// Individual lesson is a real route: rerenders must never replace the editor with the lesson list.
function openLesson(i){
  if(!Number.isInteger(i)||i<0||i>=LESSONS.length){notify('Lesson not found.');return;}
  if(!lessonAccess(i)){const needed=firstUnpassed(i);notify('Locked: complete checkpoint '+(needed+1)+' first.');navigate('learn');return;}
  lessonIndex=i;activeExercise=0;showPage('lesson','lesson/'+encodeURIComponent(LESSONS[i].id));
}
function syncLocation(){
  if(!user)return;
  let hash;
  try{hash=decodeURIComponent(location.hash.slice(1));}catch{hash='';}
  if(current)stopWorker();
  if(adminRole){
    page=hash==='account'?'account':'admin';
    render();
    return;
  }
  if(hash.startsWith('game/')){
    const [,tab,room]=hash.split('/');
    if(['closet','crates','teams'].includes(tab)){
      gameTab=tab;
      selectedRoom=tab==='teams'&&/^[A-Z]{6}$/.test(room||'')?room:null;
      page='game';render();return;
    }
  }
  if(hash.startsWith('challenge/')){
    const i=QUESTS.findIndex(x=>x.id===hash.slice(10));
    if(i>=0){questIndex=i;page='quest';render();return;}
  }
  if(hash.startsWith('lesson/')){
    const i=LESSONS.findIndex(x=>x.id===hash.slice(7));
    if(i>=0){if(lessonAccess(i)){lessonIndex=i;activeExercise=0;page='lesson';}else page='learn';render();return;}
  }
  if(hash.startsWith('checkpoint/')){
    const g=/^checkpoint\/(?:[0-9]|1[0-5])$/.test(hash)?Number(hash.slice(11)):-1;
    if(Number.isInteger(g)&&g>=0&&g<16){
      const completed=LESSONS.slice(g*4,g*4+4).every(l=>data.completed.includes(l.id));
      const earlier=Array.from({length:g},(_,i)=>i).every(checkpointCleared);
      if(checkpointPassed(g)||(completed&&earlier&&!checkpointSkipped(g))){checkpointGroup=g;checkpointAnswers=Array(8).fill(null);checkpointFeedback='';page='checkpoint';render();return;}
    }
    page='learn';render();return;
  }
  page=menuItems().some(([id])=>id===hash)?hash:'home';
  render();
}

window.addEventListener('hashchange',syncLocation);
function refresh(){if(current&&document.getElementById('code-input'))return;render();}
function codeForTask(){if(page==='quest')return {...QUESTS[questIndex],kind:'quest'};return page==='lesson'?currentLessonTask():labTask();}
function editorValue(){return $('code-input')?.value || '';}
function reset(){if(current)stopWorker();const task=codeForTask();const code=task?.starter??defaults().labCode;const key=page==='quest'?'quest-'+task.id:page==='lesson'?lessonDraftKey(task.id,activeExercise):task?'lab-'+task.id:null;if(key)data.drafts[key]=code;else data.labCode=code;save(key?{type:'draft',key,value:code}:{type:'lab',value:code});$('code-input').value=code;$('output').classList.remove('error');$('output').textContent='Click Run code to start.';$('feedback').innerHTML='';}
function ensureWorker(){
  if(worker)return;
  workerReady=false;
  worker=new Worker('python-worker.js');
  worker.onmessage=handleWorker;
  worker.onerror=()=>{finishError('The Python runner could not start. Reload PyQuest and try again.');stopWorker();};
}
function stopWorker(){
  clearTimeout(runTimer);
  worker?.terminate();
  worker=null;workerReady=false;current=null;
  if($('stop-code'))$('stop-code').hidden=true;
}
function finishError(message){if($('output')){$('output').textContent=message;$('output').classList.add('error');}notify(message);current=null;}
function run(check = false, example = null) {
  if(current){notify('Python is already running.');return;}
  const output = $('output');
  if (!output) return;
  const code = example ?? editorValue();
  const task = example === null ? codeForTask() : null;
  ensureWorker();
  current={id:++runId,task,check,lessonStep:activeExercise,lessonId:page==='lesson'?LESSONS[lessonIndex]?.id:null,context:page};
  if (example === null) {
    data.runs++;
    save({type:'run'});
    $('feedback').replaceChildren();
  }
  output.classList.remove('error');
  output.textContent = workerReady ? 'Running…' : 'Starting Python…';
  $('stop-code').hidden=false;
  worker.postMessage({type:'run',requestId:current.id,code,tests:check&&task?.kind==='quest'?task.tests:null});
  clearTimeout(runTimer);runTimer=setTimeout(()=>{finishError('Python took too long to start or finish.');stopWorker();},45000);
}
function handleWorker({data:msg}){
  if(msg.type==='ready'){workerReady=true;return;}
  if(msg.type==='load-error'){finishError('Could not load the bundled Python runtime. Try refreshing PyQuest.');stopWorker();return;}
  if(msg.type==='running'){if(current?.id===msg.requestId){clearTimeout(runTimer);runTimer=setTimeout(()=>{finishError('Python took too long. Check for an endless loop.');stopWorker();},11000);}return;}
  if(msg.type!=='result'||!current||current.id!==msg.requestId)return;
  clearTimeout(runTimer);
  const running=current;current=null;
  const error=String(msg.errors||'').trim();const out=String(msg.output||'').trim();
  if(!$('output'))return;
  $('stop-code').hidden=true;
  $('output').classList.toggle('error',!!error);$('output').textContent=error?([out,error].filter(Boolean).join('\n')):out||'(No output)';
  if(!running.check||!running.task)return;
  const isQuest=running.task.kind==='quest';
  const good=isQuest?(!error&&msg.testsPassed===true):(!error&&out===running.task.expected.trim());
  if(good){
    if(running.context==='lab'){
      $('feedback').innerHTML='<div class="feedback">Correct output.</div>';
      return;
    }
    if(running.context==='lesson' && running.lessonId){
      const completedNow=markPracticeStep(running.lessonId,running.lessonStep);
      let freshLesson=false;
      if(completedNow && !data.completed.includes(running.lessonId)){
        data.completed.push(running.lessonId);data.xp+=50;save({type:'lesson',id:running.lessonId});freshLesson=true;
      }
      const marks=practiceMarks(running.lessonId);
      const message=freshLesson?'All three exercises passed! Lesson complete. +50 XP':`Exercise ${running.lessonStep+1} passed (${marks.filter(Boolean).length}/3).`;
      const group = Math.floor(lessonIndex / LESSONS_PER_CHECKPOINT);
      const unit = courseUnits()[group];
      const nextAction=unit?.ready?` <button type="button" class="btn btn-primary btn-small" data-checkpoint="${group}">Take checkpoint ${group+1} →</button>`:'';
      $('feedback').innerHTML=`<div class="feedback">${escapeHTML(message)} ${nextAction}</div>`;
      notify(message);
      updateTotals();
      document.querySelectorAll('.lesson-activity-tabs [data-exercise]').forEach((button, index) => {
        button.classList.toggle('passed', !!marks[index]);
        button.querySelector('.exercise-number').textContent = marks[index] ? '✓' : index + 1;
        button.querySelector('.exercise-completion').hidden = !marks[index];
      });
      const progress=document.querySelector('.lesson-practice-progress strong');if(progress)progress.textContent=`${marks.filter(Boolean).length}/3 coding exercises passed`;
      const completionNote = document.querySelector('.lesson-practice-progress small');
      if (freshLesson && completionNote) completionNote.textContent = 'Lesson completion saved';
      const bar=document.querySelector('.lesson-progress-meter span');if(bar)bar.style.width=Math.round(marks.filter(Boolean).length/3*100)+'%';
    }else{
      const first=!data.questDone.includes(running.task.id);
      if(first){data.questDone.push(running.task.id);data.xp+=120;save({type:'quest',id:running.task.id});}
      const message=first?'Quest cleared! +120 XP':'Correct! Already completed.';
      $('feedback').innerHTML=`<div class="feedback">${escapeHTML(message)}</div>`;notify(message);
      updateTotals();
    }
  }
  else { const h=feedbackHint(running.task,error,out,isQuest); $('feedback').innerHTML='<div class="feedback bad">💡 '+escapeHTML(h)+onlineHint+'</div>'; }
}
function quizCheck(){
  if(quizChecked||quizChoice===null)return;
  const q=QUIZZES[quizIndex];
  if(quizChoice!==q.correct){
    quizFeedback=q.hint||hintForQuiz(q);
    quizChoice=null;
  }else{
    quizChecked=true;
    quizFeedback='';
    quizScore++;
    if(!data.quizCorrect.includes(quizIndex)){data.quizCorrect.push(quizIndex);save({type:'quiz',id:quizIndex});}
  }
  render();
}
function handle(action){switch(action){
  case 'toggle-directory':void socialAction(async()=>{await setDirectoryOptIn(!directoryState().listed,socialState().profile?.nickname);notify(directoryState().listed?'Classmate list updated.':'Discovery preference updated.');});return;
  case 'checkpoint-submit':{
    if(checkpointBusy)return;
    const qs=checkpointQuestions(checkpointGroup,LESSONS);if(checkpointAnswers.length!==qs.length||checkpointAnswers.some(x=>x===null))return;
    const score=qs.filter((q,i)=>q.correct===checkpointAnswers[i]).length;
    if(score>=6){const group=checkpointGroup;const answers=[...checkpointAnswers];checkpointBusy=true;checkpointFeedback='Saving your checkpoint…';render();
      void awardCheckpoint(group,answers).then(()=>{
        checkpointFeedback=`Passed ${score}/8! ${group===15?'You finished the final checkpoint.':'Your next four lessons are unlocked.'}`;
        notify('Checkpoint passed.');
      }).catch(err=>{checkpointFeedback='Could not save the checkpoint. '+err.message;})
      .finally(()=>{checkpointBusy=false;if(page==='checkpoint'&&checkpointGroup===group)render();});return;}
    const wrong=qs.findIndex((q,i)=>q.correct!==checkpointAnswers[i]);checkpointFeedback=`${score}/8 correct. You need at least 6/8. Review this topic: ${qs[wrong]?.why||'Review your lessons.'} Then try again.`;
    render();return;
  }
  case 'logout':void flushCloud().finally(()=>signOutStudent().catch(e=>notify(friendlyAuthError(e))));return;
  case 'retry-sync':void retryCloud();return;
  case 'level-begin':{if(levelBusy)return;if(!confirm('Start your only level-test attempt? You can resume it if unfinished, but after submitting you cannot take it again.'))return;levelBusy=true;render();void beginLevelTest().catch(e=>notify('Could not start: '+e.message)).finally(()=>{levelBusy=false;if(page==='leveltest')render();});return;}
  case 'level-prev':levelQuestion=Math.max(0,levelQuestion-1);render();return;
  case 'level-next':if(levelAnswers[levelQuestion]===null)return;levelQuestion=Math.min(LEVEL_TOTAL-1,levelQuestion+1);render();return;
  case 'level-finish':{if(levelBusy||levelAnswers.some(x=>x===null))return;if(!confirm('Submit your one-time level test? After submission you cannot retake it.'))return;levelBusy=true;render();void finishLevelTest([...levelAnswers]).then(()=>{notify('Your study plan is saved!');if(!localPreview)void getAILevelAdvice().catch(()=>{});}).catch(e=>notify('Could not save your test: '+e.message)).finally(()=>{levelBusy=false;if(page==='leveltest')render();});return;}
  case 'level-ai':void getAILevelAdvice().catch(()=>{});return;
  case 'join-leaderboard':void socialAction(async()=>{if(!cloudReady)throw Error('Wait until your progress is synced first.');await joinLeaderboard(socialState().profile?.nickname);notify('You joined the leaderboard!');});return;
  case 'leave-leaderboard':if(confirm('Leave the leaderboard? Your entry will be removed, but your learning progress will stay saved.'))void socialAction(async()=>{await leaveLeaderboard();notify('Your leaderboard entry was removed.');});return;
  case 'announcement-new':editingAnnouncementId='new';render();return;
  case 'announcement-cancel':editingAnnouncementId=null;render();return;
  case 'lesson-new':editingLessonId='new';render();return;
  case 'lesson-cancel':editingLessonId=null;render();return;
  case 'staff-reset':{const email=$('staff-email')?.value;void socialAction(async()=>{await sendStaffResetEmail(email);notify('If this is a staff account, check its inbox for a reset email.');});return;}
  case 'back-lessons':navigate('learn');return;
  case 'download-profile-backup':
    if (localPreview && user && page === 'account') void socialAction(downloadProfileBackup);
    return;
  case 'choose-profile-backup':
    if (localPreview && user && page === 'account') $('profile-backup-file')?.click();
    return;
  case 'close-chat':closeChat();reportTarget=null;render();return;
  case 'cancel-report':reportTarget=null;render();return;
  case 'submit-report':{const id=reportTarget;const reason=$('report-reason')?.value;if(!id)return;void socialAction(async()=>{await reportMessage(id,reason);reportTarget=null;notify('Report submitted for staff review.');render();});return;}
  case 'quest-hint':{const steps=[...document.querySelectorAll('.hint-step')];const next=steps.find(x=>x.hidden);if(next)next.hidden=false;else notify('All hints are shown.');return;}
  case 'previous':openLesson(lessonIndex-1);return;
  case 'next':openLesson(Math.min(lessonIndex+1,LESSONS.length-1));return;
  case 'igcse-check':checkIGCSE();return;
  case 'igcse-next':igcseQuestion=(igcseQuestion+1)%IGCSE_TOPICS[igcseTopic].questions.length;resetIGCSE();render();return;
  case 'ai-hint':void requestAIHint();return;
  case 'run':run(false);return;
  case 'check':run(true);return;
  case 'stop-code':stopWorker();$('output').textContent='Run stopped.';return;
  case 'reset':reset();return;
  case 'hint': {
    const hint = $('hint-text');
    if (!hint) return;
    hint.hidden = !hint.hidden;
    const toggle = document.querySelector('[data-action="hint"][aria-expanded]');
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(!hint.hidden));
      toggle.textContent = hint.hidden ? 'Show hint' : 'Hide hint';
    }
    return;
  }
  case 'check-quiz':quizCheck();return;
  case 'next-question':quizIndex++;quizChoice=null;quizChecked=false;quizFeedback='';render();return;
  case 'restart-quiz':quizIndex=0;quizChoice=null;quizChecked=false;quizScore=0;quizFeedback='';render();return;
}}
document.addEventListener('click',event=>{
  const previewButton = event.target.closest('[data-preview-step], [data-preview-move]');
  if (previewButton) {
    showTaskPreviewStep(previewButton);
    return;
  }
  const jump = event.target.closest('[data-jump-target]');
  if (jump) {
    const target = $(jump.dataset.jumpTarget);
    target?.scrollIntoView({block: 'start'});
    target?.focus({preventScroll: true});
    return;
  }
  const copy = event.target.closest('[data-copy-example]');
  if (copy) {
    void copyExample(Number(copy.dataset.copyExample));
    return;
  }
  const exampleButton = event.target.closest('[data-run-example]');
  if (exampleButton && page === 'home') {
    const index = Number(exampleButton.dataset.runExample);
    const example = LESSONS[index]?.example;
    if (index < fixedLessonCount && example) run(false, example);
    return;
  }
  const authTab=event.target.closest('[data-auth-mode]');if(authTab){authMode=authTab.dataset.authMode;render();return;}
  const levelChoice=event.target.closest('[data-level-choice]');if(levelChoice && page==='leveltest' && levelTestState().attempt?.status==='started' && !levelBusy){levelAnswers[levelQuestion]=Number(levelChoice.dataset.levelChoice);if(user)writeDraft(user.uid,levelAnswers);render();return;}
  const levelLesson=event.target.closest('[data-level-lesson]');if(levelLesson){const i=LESSONS.findIndex(l=>l.id===levelLesson.dataset.levelLesson);if(i>=0)openLesson(i);return;}
  const boardMode=event.target.closest('[data-board-mode]');if(boardMode){leaderboardMode=boardMode.dataset.boardMode==='week'?'week':'all';refreshLeaderboardWeek();render();return;}
  const nav=event.target.closest('[data-nav]');if(nav){event.preventDefault();navigate(nav.dataset.nav);return;}
  const profile=event.target.closest('[data-local-profile]');if(localPreview&&profile){void socialAction(()=>switchLocalProfile(profile.dataset.localProfile));return;}
  const noticeEdit=event.target.closest('[data-edit-announcement]');if(noticeEdit){editingAnnouncementId=noticeEdit.dataset.editAnnouncement;render();return;}
  const noticeStatus=event.target.closest('[data-announcement-status]');if(noticeStatus){const status=noticeStatus.dataset.nextStatus;if(status==='archived'&&!confirm('Archive this post? Students will no longer see it.'))return;void socialAction(async()=>{await setAnnouncementStatus(noticeStatus.dataset.announcementStatus,status);notify('Post '+status+'.');});return;}
  const edit=event.target.closest('[data-edit-lesson]');if(edit){editingLessonId=edit.dataset.editLesson;render();return;}
  const lessonStatus=event.target.closest('[data-lesson-status]');if(lessonStatus){const status=lessonStatus.dataset.nextStatus;if(status==='archived'&&!confirm('Archive this lesson? It will disappear for students until republished.'))return;void socialAction(async()=>{await setLessonStatus(lessonStatus.dataset.lessonStatus,status);notify('Lesson '+status+'.');});return;}
  const pwReview=event.target.closest('[data-pw-review]');if(pwReview){void socialAction(async()=>{await reviewPasswordHelp(pwReview.dataset.pwReview,pwReview.dataset.pwNext);notify('Request updated. This does not change a password.');});return;}
  const quest=event.target.closest('[data-quest]');if(quest){event.preventDefault();openQuest(Number(quest.dataset.quest));return;}
  const accept=event.target.closest('[data-accept]');if(accept){void socialAction(async()=>{await acceptFriend(accept.dataset.accept);notify('Friend added!');});return;}
  const remove=event.target.closest('[data-remove]');if(remove){void socialAction(async()=>{await removeFriend(remove.dataset.remove);notify('Request or friendship removed.');});return;}
  const block=event.target.closest('[data-block]');if(block){if(confirm('Block this person? They will not be able to chat with you.'))void socialAction(async()=>{await blockStudent(block.dataset.block);notify('Student blocked.');});return;}
  const unblock=event.target.closest('[data-unblock]');if(unblock){void socialAction(async()=>{await unblockStudent(unblock.dataset.unblock);notify('Student unblocked.');});return;}
  const chat=event.target.closest('[data-chat]');if(chat){reportTarget=null;composeDraft.friend='';try{openChat(chat.dataset.chat);}catch(e){notify(e.message);}return;}
  const report=event.target.closest('[data-report]');if(report){reportTarget=report.dataset.report;render();return;}
  const topicButton=event.target.closest('[data-topic]');if(topicButton){igcseTopic=Number(topicButton.dataset.topic);igcseQuestion=0;resetIGCSE();render();return;}
  const iq=event.target.closest('[data-igcse-choice]');if(iq&&!igcseAnswered){igcseChoice=Number(iq.dataset.igcseChoice);render();return;}
  const exerciseButton = event.target.closest('[data-exercise]');
  if (exerciseButton && page === 'lesson') {
    if (current) {
      notify('Finish running your code before switching exercises.');
      return;
    }
    const fromTab = exerciseButton.closest('.lesson-activity-tabs');
    activeExercise = Number(exerciseButton.dataset.exercise);
    render();
    if (fromTab) document.querySelector('.lesson-activity-tabs .current')?.focus({preventScroll: true});
    else $('lesson-exercises')?.focus();
    return;
  }
  const lesson=event.target.closest('[data-lesson]');if(lesson){openLesson(Number(lesson.dataset.lesson));return;}
  const choice=event.target.closest('[data-choice]');if(choice&&!quizChecked){quizChoice=Number(choice.dataset.choice);render();return;}
  const gameTabButton=event.target.closest('[data-game-tab]');if(gameTabButton){showGameTab(gameTabButton.dataset.gameTab);return;}
  const crateButton=event.target.closest('[data-crate]');if(crateButton){selectedCrate=crateButton.dataset.crate;showGameTab('crates');return;}
  const syncCoinsButton=event.target.closest('[data-sync-coins]');if(syncCoinsButton){void socialAction(async()=>{const result=await awardProgress();notify(result.added?`You earned ${result.added} GIS Points!`:'All your GIS Points are up to date.');});return;}
  const openCrateButton = event.target.closest('[data-open-crate]');
  if (openCrateButton) {
    const crate = CRATES.find(c => c.id === openCrateButton.dataset.openCrate);
    if (!crate || openCrateButton.disabled || !confirm(`Open ${crate.name} for ${crate.cost} GIS Points?`)) return;
    openCrateButton.disabled = true;
    void socialAction(async () => {
      try {
        const result = await openCrate(crate.id);
        const copies = result.quantity > 1 ? ` You now have ${result.quantity.toLocaleString()} copies.` : '';
        notify(`You got ${result.item.name} (${result.item.rarity}) for ${result.spent} GIS Points!${copies}`);
      } finally {
        openCrateButton.disabled = false;
      }
    });
    return;
  }
  const sellButton = event.target.closest('[data-sell-gear]');
  if (sellButton && localPreview && user && page === 'game' && gameTab === 'closet' && !sellButton.disabled) {
    const {uid} = user;
    const restoreFocus = document.activeElement === sellButton;
    sellButton.disabled = true;
    void socialAction(async () => {
      try {
        const sale = await sellGear(sellButton.dataset.sellGear);
        if (user?.uid !== uid) return;
        notify(`Sold one ${sale.item.name} for ${sale.soldFor} GIS Points.`);
        if (restoreFocus && page === 'game' && gameTab === 'closet') {
          ($(sellButton.id) ?? $('collection-title'))?.focus({preventScroll: true});
        }
      } finally {
        sellButton.disabled = false;
      }
    });
    return;
  }
  const equipButton=event.target.closest('[data-equip]');if(equipButton){void socialAction(async()=>{await equipItem(equipButton.dataset.equip);notify('Equipped!');});return;}
  const unEq=event.target.closest('[data-unequip]');if(unEq){void socialAction(async()=>{await removeEquipment(unEq.dataset.unequip);notify('Unequipped.');});return;}
  const checkpoint=event.target.closest('[data-checkpoint]');if(checkpoint){const g=Number(checkpoint.dataset.checkpoint);const complete=LESSONS.slice(g*4,g*4+4).every(l=>data.completed.includes(l.id));const prev=Array.from({length:g},(_,i)=>i).every(checkpointCleared);if(checkpointSkipped(g)&&!checkpointPassed(g)){notify('This checkpoint is already waived by your level-test placement. Keep learning!');return;}if(!checkpointCleared(g)&&(!complete||!prev)){notify('Finish the previous lessons and checkpoints first.');return;}checkpointGroup=g;checkpointAnswers=Array(checkpointQuestions(g,LESSONS).length).fill(null);checkpointFeedback='';checkpointBusy=false;showPage('checkpoint','checkpoint/'+g);return;}
  const cpchoice=event.target.closest('[data-cp-choice]');if(cpchoice){const [i,j]=cpchoice.dataset.cpChoice.split('-').map(Number);checkpointAnswers[i]=j;render();return;}
  const addUser=event.target.closest('[data-add-user]');if(addUser){void socialAction(async()=>{await sendFriendRequest(addUser.dataset.addUser);notify('Friend request sent!');});return;}
  const teamRoom=event.target.closest('[data-team-room]');if(teamRoom){showGameTab('teams',teamRoom.dataset.teamRoom);return;}
  const teamAnswer=event.target.closest('[data-team-answer]');if(teamAnswer){const [id,question,n]=teamAnswer.dataset.teamAnswer.split(':');void socialAction(()=>answerRoom(id,Number(n),Number(question)));return;}
  const teamClaim=event.target.closest('[data-team-claim]');if(teamClaim){const room=teamState().rooms.find(x=>x.id===teamClaim.dataset.teamClaim);if(!room)return;void socialAction(async()=>{await claimTeamReward(room);notify('Team game reward claimed!');});return;}
  const staffTarget=event.target.closest('[data-staff-target]');if(staffTarget){void socialAction(async()=>{await openStaffChat(staffTarget.dataset.staffTarget);});return;}
  const staffReport=event.target.closest('[data-staff-report]');if(staffReport){if(!confirm('Report this staff message to the school owner?'))return;void socialAction(async()=>{await reportStaffMessage(staffReport.dataset.staffReport);notify('Report submitted for school review.');});return;}
  const action=event.target.closest('[data-action]');if(action)handle(action.dataset.action);
});
document.addEventListener('input',event=>{
  const input=event.target;
  if(input.id==='chat-input'){composeDraft.friend=input.value;return;}
  if(input.id==='staff-message'){composeDraft.staff=input.value;return;}
  if(input.id==='auth-password'&&authMode==='signup'){
    const warning=$('school-password-warning');
    if(warning)warning.hidden=!looksLikeSchoolPassword(input.value);
    return;
  }
  if(input.id==='directory-search'){const ss=socialState(),ds=directoryState();const candidates=ds.list.filter(x=>x.id!==user.uid&&!ss.blocked.includes(x.id)&&!ss.friendships.some(fr=>fr.members.includes(x.id)));const box=$('directory-results');if(box)box.innerHTML=directoryEntriesHTML(candidates,input.value);return;}
  if(input.id!=='code-input')return;
  let change;
  if(page==='quest'){const key='quest-'+QUESTS[questIndex].id;data.drafts[key]=input.value;change={type:'draft',key,value:input.value};}
  else if(page==='lesson'){const key=lessonDraftKey(LESSONS[lessonIndex].id,activeExercise);data.drafts[key]=input.value;change={type:'draft',key,value:input.value};}
  else if(labSelection==='free'){data.labCode=input.value;change={type:'lab',value:input.value};}
  else {const key='lab-'+labSelection;data.drafts[key]=input.value;change={type:'draft',key,value:input.value};}
  save(change);
});
document.addEventListener('submit',event=>{
  if(event.target.id==='auth-form'){void submitAuthForm(event);return;}

  if(event.target.id==='nickname-form'){event.preventDefault();const name=$('new-nickname')?.value;void socialAction(async()=>{await renameProfile(name);await syncDirectoryName();void syncStudentStats(user).catch(()=>{});notify('Preferred name saved!');render();});}
  if(event.target.id==='help-form'){
    event.preventDefault();
    const adminId=$('help-admin')?.value,topic=$('help-topic')?.value,question=$('help-question')?.value;
    void socialAction(async()=>{await sendHelpRequest(adminId,topic,question);notify('Question sent to your selected admin.');if($('help-form'))$('help-form').reset();});return;
  }
  if(event.target.id==='password-change-form'){event.preventDefault();const old=$('current-password')?.value||'',nw=$('new-password')?.value||'',confirm=$('confirm-password')?.value||'';void socialAction(async()=>{await changeOwnPassword(old,nw,confirm);event.target.reset();notify('Password changed successfully.');});return;}
  if(event.target.id==='password-help-form'){event.preventDefault();const reason=$('password-help-reason')?.value;void socialAction(async()=>{await requestPasswordHelp(reason);notify('Password-help request sent. Do not share your password.');});return;}
  if(event.target.id==='admin-announcement-form'){
    event.preventDefault();
    const fields={title:$('announcement-title')?.value,body:$('announcement-body')?.value,kind:$('announcement-kind')?.value,status:$('announcement-status')?.value,dueDate:$('announcement-due')?.value,pinned:!!$('announcement-pinned')?.checked};
    void socialAction(async()=>{await saveAnnouncement(fields,editingAnnouncementId==='new'?null:editingAnnouncementId);editingAnnouncementId=null;notify('Announcement saved.');render();});return;
  }
  if(event.target.id==='admin-lesson-form'){event.preventDefault();const fields={};for(const name of ['title','tagline','level','emoji','description','example','prompt','starter','expected','hint','minutes','status'])fields[name]=$('lesson-'+name)?.value??'';void socialAction(async()=>{await saveManagedLesson(fields,editingLessonId==='new'?null:editingLessonId);editingLessonId=null;notify('Lesson saved.');render();});return;}
  if(event.target.id==='admin-rename-form'){
    event.preventDefault();
    const uid=$('admin-student')?.value,nickname=$('admin-new-name')?.value;
    void socialAction(async()=>{await adminRenameStudent(uid,nickname);notify('Student preferred name updated.');if($('admin-new-name'))$('admin-new-name').value='';});return;
  }
  if(event.target.matches('[data-reply-form]')){
    event.preventDefault();
    const id=event.target.dataset.replyForm;
    const answer=event.target.querySelector('textarea')?.value;
    void socialAction(async()=>{await answerHelpRequest(id,answer);notify('Reply saved. The student can see it now.');});return;
  }
  if(event.target.id==='team-create'){event.preventDefault();void socialAction(async()=>{const room=await createRoom($('team-mode')?.value);showGameTab('teams',room);notify('Room created. Your partner can join with the six-letter code.');});return;}
  if(event.target.id==='team-join'){event.preventDefault();void socialAction(async()=>{const room=await joinRoomByCode($('team-code')?.value);showGameTab('teams',room);notify('Joined room.');});return;}
  if(event.target.id==='staff-chat-form'){event.preventDefault();void sendComposeMessage('staff',$('staff-message')?.value,sendStaffMessage);return;}
  if(event.target.id==='chat-form'){event.preventDefault();void sendComposeMessage('friend',$('chat-input')?.value,sendMessage);return;}
});
document.addEventListener('change', event => {
  const control = event.target;
  if (control.id === 'profile-backup-file') {
    const file = control.files[0];
    control.value = '';
    if (localPreview && user && page === 'account' && file) {
      const profile = user;
      void socialAction(() => importProfileBackup(file, profile));
    }
    return;
  }
  if (control.id === 'lab-select') {
    if (current) stopWorker();
    labSelection = control.value;
    render();
    return;
  }
  if (control.name !== 'character-style' || !control.checked || page !== 'game' || gameTab !== 'closet' || !user) return;
  try {
    saveCharacterStyle(user.uid, control.value);
  } catch (error) {
    const saved = readCharacterStyle(user.uid);
    const previous = document.querySelector(`input[name="character-style"][value="${saved}"]`);
    if (previous) {
      previous.checked = true;
      previous.focus();
    }
    notify(error.message);
    return;
  }
  const character = document.querySelector('.game-hero-card .character-stage');
  if (character) character.outerHTML = avatarHTML(gameState().wallet, control.value);
});
const editorExit = new WeakSet();
document.addEventListener('keydown', event => {
  const editor = event.target;
  if (editor.id !== 'code-input' || event.isComposing) return;
  if (event.key === 'Escape') {
    editorExit.add(editor);
    return;
  }
  const leaving = editorExit.delete(editor);
  if (event.key === 'Tab' && !leaving && !event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault();
    editor.setRangeText('    ', editor.selectionStart, editor.selectionEnd, 'end');
    editor.dispatchEvent(new Event('input', {bubbles: true}));
  }
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    run(false);
  }
});
if(localPreview){
  let profile = activeLocalProfile();
  let error;
  const player = new URLSearchParams(location.search).get('player');
  if (player === '1' || player === '2') {
    const url = new URL(location.href);
    url.searchParams.delete('player');
    history.replaceState(null, '', url.href);
    try { profile = selectTeamProfile(player); }
    catch (failure) { error = failure; }
  }
  startLocalStudent(profile);
  if (error) notify(error.message);
}else{
  render();
  initializeLogin(
    newUser=>{void syncStudentAccount(newUser);},
    error=>{const msg=friendlyAuthError(error);if(msg)notify(msg);}
  );
  window.addEventListener('online',()=>{if(user&&!cloudReady)void retryCloud();else if(user&&!pendingEmpty())scheduleCloudSave();});
}

// One attempt per Firebase Auth account. Firestore rules enforce the lock.
// Scores are a learning guide only; not an exam mark, grade or diagnosis.
import {TEST_VERSION, TOPICS, QUESTIONS, scoreAnswers, studyPlan, localDiagnosticFeedback} from './level-test-questions.js';
import {localPreview, readLocal, mutateLocal, onLocalChange} from './local-preview.js';
const SDK='https://www.gstatic.com/firebasejs/12.19.0/';
let fs, db, account=null, onUpdate=()=>{}, offTest=null, offAdvice=null, generation=0;
const state={loading:false,attempt:null,advice:null,localAdvice:null,error:'',aiStatus:'',aiError:''};
const report=()=>onUpdate({...state});
async function connect(){
  if(fs&&db)return;
  const [app,firestore]=await Promise.all([import(SDK+'firebase-app.js'),import(SDK+'firebase-firestore.js')]);
  fs=firestore;db=fs.getFirestore(app.getApp());
}
const testDoc=uid=>fs.doc(db,'levelTests',uid);
const adviceDoc=uid=>fs.doc(db,'levelTestAdvice',uid);
export const localTestKey = uid => 'level-test:' + uid;
export const levelDraftKey = uid => 'pyquest-level-test-draft-' + uid;
function refreshLocalTest(uid) {
  state.attempt=readLocal(localTestKey(uid), {}).attempt ?? null;
  state.loading=false;
  report();
}
export function levelTestState(){return state;}
export function stopLevelTest(){
  generation++;try{offTest?.();}catch(_){}try{offAdvice?.();}catch(_){}
  offTest=offAdvice=null;account=null;onUpdate=()=>{};
  Object.assign(state,{loading:false,attempt:null,advice:null,localAdvice:null,error:'',aiStatus:'',aiError:''});
}
export async function startLevelTest(user,change){
  stopLevelTest();account=user;onUpdate=change;const gen=generation;
  if (localPreview) {
    refreshLocalTest(user.uid);
    offTest=onLocalChange(localTestKey(user.uid),()=>refreshLocalTest(user.uid));
    return;
  }
  state.loading=true;state.error='';report();
  try{
    await connect();if(gen!==generation)return;
    offTest=fs.onSnapshot(testDoc(user.uid),snap=>{
      if(gen!==generation)return;
      state.attempt=snap.exists()?{...snap.data(),id:snap.id}:null;
      state.loading=false;state.error='';report();
    },err=>{if(gen!==generation)return;state.loading=false;state.error=err.message;report();});
    offAdvice=fs.onSnapshot(adviceDoc(user.uid),snap=>{
      if(gen!==generation)return;
      state.advice=snap.exists()?snap.data():null;report();
    },err=>{if(gen!==generation)return;state.aiError=err.message;report();});
  }catch(e){if(gen!==generation)return;state.loading=false;state.error=e.message;report();}
}
export async function beginLevelTest(){
  if(!account)throw Error('Sign in with your student account.');
  if(localPreview){
    const uid=account.uid;
    await mutateLocal(localTestKey(uid), {}, saved=>{
      saved.attempt ??= {version:TEST_VERSION,status:'started',startedAt:Date.now()};
    });
    if(account?.uid===uid)refreshLocalTest(uid);
    return;
  }
  await connect();
  const uid=account.uid;
  await fs.runTransaction(db,async tx=>{
    const ref=testDoc(uid);const snap=await tx.get(ref);
    if(snap.exists())return; // Can't start a second attempt.
    tx.set(ref,{version:TEST_VERSION,status:'started',startedAt:fs.serverTimestamp()});
  });
}
export async function finishLevelTest(answers){
  if(!account)throw Error('Sign in first.');
  const {scores,correct}=scoreAnswers(answers);
  const plan=studyPlan(scores);
  if(localPreview){
    const uid=account.uid;
    await mutateLocal(localTestKey(uid), {}, saved=>{
      if(saved.attempt?.status==='completed')throw Error('This test was already submitted.');
      if(saved.attempt?.status!=='started' || saved.attempt.version!==TEST_VERSION)throw Error('Start the test first.');
      Object.assign(saved.attempt,{status:'completed',answers,correctCount:correct,scores,plan,completedAt:Date.now()});
    });
    try{localStorage.removeItem(levelDraftKey(uid));}catch(_){}
    if(account?.uid===uid)refreshLocalTest(uid);
    return {scores,correct,plan};
  }
  await connect();
  const uid=account.uid;
  await fs.runTransaction(db,async tx=>{
    const ref=testDoc(uid);const snap=await tx.get(ref);
    if(!snap.exists())throw Error('Start the test first.');
    if(snap.data().status==='completed')throw Error('This test was already submitted. You can review your saved results.');
    if(snap.data().status!=='started'||snap.data().version!==TEST_VERSION)throw Error('Invalid test state.');
    tx.update(ref,{status:'completed',answers,correctCount:correct,scores,plan,completedAt:fs.serverTimestamp()});
  });
  try{localStorage.removeItem(levelDraftKey(uid));}catch(_){}
  return {scores,correct,plan};
}
function cleanedAdvice(data){
  const summary=String(data?.summary||'').trim().slice(0,500);
  const tips=Array.isArray(data?.steps)?data.steps:[];
  const ids=new Set(TOPICS.map(x=>x.id));
  const steps=tips.filter(s=>ids.has(s?.topic)).slice(0,3).map(s=>({topic:s.topic,reason:String(s.reason||'').trim().slice(0,260)})).filter(s=>s.reason);
  if(!summary||!steps.length)throw Error('AI response was incomplete. Your built-in study plan is still available.');
  return {summary,steps};
}
export async function getAILevelAdvice(){
  if(!account)throw Error('Sign in first.');
  if(localPreview){
    if(state.attempt?.status!=='completed')throw Error('Finish your level test first.');
    return localDiagnosticFeedback(scoreAnswers(state.attempt.answers).scores);
  }
  if(state.advice)return state.advice;
  await connect();
  const uid=account.uid;
  // Use the cloud record when online. If Firebase is temporarily unreachable,
  // the already-loaded completed record can still power the local study coach.
  let savedData=state.attempt?.status==='completed'?state.attempt:null;
  try{
    const saved=await fs.getDocFromServer(testDoc(uid));
    if(saved.exists())savedData=saved.data();
  }catch(err){if(!savedData)throw Error('Your test result is not loaded yet. Reconnect and try again.');}
  if(!savedData||savedData.status!=='completed')throw Error('Finish your level test first.');
  state.aiStatus='loading';state.aiError='';report();
  try{
    // The endpoint verifies Firebase login, reads only the submitted aggregate
    // results and sends no student names, IDs, messages or code to the model.
    const token=await account.getIdToken();
    const resp=await fetch('/.netlify/functions/ai-level',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:'{}'});
    const json=await resp.json().catch(()=>({}));
    if(!resp.ok)throw Error(json.error||'AI feedback is not enabled yet.');
    const advice=cleanedAdvice(json);
    // Show good advice even when saving the optional AI response is denied.
    state.localAdvice=advice;state.aiStatus='ready';report();
    try{
      await fs.runTransaction(db,async tx=>{
        const ref=adviceDoc(uid),existing=await tx.get(ref);
        if(existing.exists())return;
        tx.set(ref,{...advice,version:TEST_VERSION,generatedAt:fs.serverTimestamp()});
      });
    }catch(err){console.warn('AI advice was shown but could not be cached:',err.message);}
    return advice;
  }catch(e){
    // The optional online model needs OPENAI_API_KEY in Netlify. A learner must
    // always receive a real, score-based explanation, even on the free tier.
    const result=scoreAnswers(savedData.answers);
    const fallback=localDiagnosticFeedback(result.scores);
    state.localAdvice=fallback;state.aiStatus='built-in';state.aiError=e?.message||'Online AI unavailable';report();
    return fallback;
  }
}
export function readDraft(uid){
  try{const draft=JSON.parse(localStorage.getItem(levelDraftKey(uid)));if(Array.isArray(draft)&&draft.length===QUESTIONS.length){return draft.map(x=>Number.isInteger(x)&&x>=0&&x<=3?x:null);}}catch(_){}
  return Array(QUESTIONS.length).fill(null);
}
export function writeDraft(uid,answers){
  try{localStorage.setItem(levelDraftKey(uid),JSON.stringify(answers));}catch(_){}
}

import {CRATES,itemById} from './game-items.js';
import {localPreview} from './local-preview.js';
import {emptyWallet} from './shared/pycoin-logic.js';
import {readLocalGame,watchLocalGame,syncLocalRewards,passLocalCheckpoint,openLocalCrate,equipLocalItem,removeLocalEquipment,sellLocalGear} from './local-game.js';
const SDK='https://www.gstatic.com/firebasejs/12.19.0/';
let api,db,account,unsubscribe,unsubscribeCheckpoints,change=()=>{},generation=0;
let state={ready:false,error:'',rewardError:'',wallet:null,checkpointsReady:false,checkpointError:'',passedCheckpoints:[]};
let localProgress;
export function gameState(){return state;}
function emit(){change({...state,wallet:state.wallet?{...state.wallet}:null,passedCheckpoints:[...state.passedCheckpoints]});}
async function connect(){if(api&&db)return;const [app,fs]=await Promise.all([import(SDK+'firebase-app.js'),import(SDK+'firebase-firestore.js')]);api=fs;db=api.getFirestore(app.getApp());}
const ref=()=>api.doc(db,'gameProfiles',account.uid);
const checkpointRef=group=>api.doc(db,'checkpointPasses',account.uid,'groups','g'+group);
export function stopGame(){++generation;unsubscribe?.();unsubscribeCheckpoints?.();unsubscribe=null;unsubscribeCheckpoints=null;account=null;state={ready:false,error:'',rewardError:'',wallet:null,checkpointsReady:false,checkpointError:'',passedCheckpoints:[]};emit();}
function refreshLocalGame(uid) {
  Object.assign(state, readLocalGame(uid), {ready:true,checkpointsReady:true});
  emit();
}
async function localGameAction(task) {
  const uid=account.uid;
  const result=await task(uid);
  if (account?.uid===uid) refreshLocalGame(uid);
  return result;
}
export async function startGame(user,onChange,progress){stopGame();account=user;change=onChange;const epoch=generation;
  if (localPreview) {
    localProgress=progress;
    refreshLocalGame(user.uid);
    unsubscribe=watchLocalGame(user.uid,()=>refreshLocalGame(user.uid));
    return;
  }
  try{await connect();if(epoch!==generation)return;
    unsubscribe=api.onSnapshot(ref(),s=>{if(epoch!==generation)return;state.ready=true;state.wallet=s.exists()?s.data():emptyWallet();state.error='';emit();},e=>{if(epoch!==generation)return;state.error=e.message;state.ready=false;emit();});
    unsubscribeCheckpoints=api.onSnapshot(api.collection(db,'checkpointPasses',user.uid,'groups'),snap=>{if(epoch!==generation)return;state.passedCheckpoints=snap.docs.filter(d=>/^g(?:[0-9]|1[0-5])$/.test(d.id)).map(d=>Number(d.id.slice(1)));state.checkpointsReady=true;state.checkpointError='';emit();},e=>{if(epoch!==generation)return;state.checkpointError=e.message;state.checkpointsReady=false;emit();});
  }catch(e){state.error=e.message;emit();}
}
function requireReady(){if(!account||(!localPreview&&!api))throw Error('Choose a local profile to save your game progress.');}
async function rewardRequest(payload){
  requireReady();
  const [app,authSdk]=await Promise.all([import(SDK+'firebase-app.js'),import(SDK+'firebase-auth.js')]);
  const signed=authSdk.getAuth(app.getApp()).currentUser;
  if(!signed || signed.uid!==account.uid)throw Error('Sign in again to collect PyCoins.');
  const idToken=await signed.getIdToken();
  let res;
  try{res=await fetch('/.netlify/functions/pycoins',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+idToken},body:JSON.stringify(payload)});}
  catch{throw Error('Reward server is unreachable. Check your connection or Netlify deployment.');}
  if(res.status===404)throw Error('The PyCoin server was not deployed. Follow PYCOINS_SETUP.md and deploy using Netlify CLI or Git.');
  const data=await res.json().catch(()=>({error:'Reward service unavailable.'}));
  if(!res.ok)throw Error(data.error||'Reward service unavailable.');
  state.rewardError='';emit();return data;
}
let syncInFlight=null;
// Called only AFTER cloud progress has been saved. Safe to retry and on sign-in:
// the server records each achievement exactly once.
export async function awardProgress(){
  if (localPreview) {
    requireReady();
    return localGameAction(uid=>syncLocalRewards(uid,localProgress));
  }
  if(syncInFlight)return syncInFlight;
  syncInFlight=rewardRequest({action:'sync'}).catch(e=>{state.rewardError=e.message;emit();throw e;}).finally(()=>{syncInFlight=null;});
  return syncInFlight;
}
// Checkpoint completion is independent from the currency wallet. The rules verify
// correct answers and allow a single immutable pass per group, even when the
// browser is forbidden to modify PyCoin balances.
export async function awardCheckpoint(group,answers){requireReady();
  if(!Number.isInteger(group)||group<0||group>15)throw Error('Invalid checkpoint.');
  if(!Array.isArray(answers)||answers.length!==8||answers.some(a=>!Number.isInteger(a)||a<0||a>3))throw Error('Complete all eight checkpoint questions first.');
  if (localPreview) return localGameAction(uid=>passLocalCheckpoint(uid,group,answers,localProgress));
  const refPass=checkpointRef(group);
  const existing=await api.getDoc(refPass);
  if(existing.exists())return {coinsAwarded:false,alreadyPassed:true};
  try{await api.setDoc(refPass,{answers,createdAt:api.serverTimestamp()});}
  catch(err){const check=await api.getDoc(refPass).catch(()=>null);if(!check?.exists())throw err;}
  // Lesson unlocking remains independent of reward-server availability.
  void awardProgress().catch(e=>console.warn('PyCoin checkpoint reward:',e.message));
  return {coinsAwarded:false,alreadyPassed:false};
}
export async function awardTeam(roomId){
  const result=await awardProgress();
  return result;
}
// Keep an opening's request ID on network errors so a retry cannot double-charge.
const pendingOpens = new Map();
export async function openCrate(crateId){
  requireReady();
  if(!CRATES.some(c=>c.id===crateId))throw Error('Unknown crate.');
  if (localPreview) return localGameAction(uid=>openLocalCrate(uid,crateId));
  const key=account.uid+':'+crateId;
  let requestId=pendingOpens.get(key);
  if(!requestId){requestId=crypto.randomUUID();pendingOpens.set(key,requestId);}
  try{
    const result=await rewardRequest({action:'open',crateId,requestId});
    pendingOpens.delete(key);
    return result;
  }catch(err){
    // On a known validation failure no coins were spent; a fresh request is safe.
    // For uncertain network/server failures, preserve the ID for a safe retry.
    if(/more PyCoins|Unknown crate|already own every|Invalid crate request/i.test(err.message))pendingOpens.delete(key);
    throw err;
  }
}
export async function sellGear(id) {
  requireReady();
  if (!localPreview) throw Error('Gear sales are available in the browser-local edition.');
  return localGameAction(uid => sellLocalGear(uid, id));
}
export async function equipItem(id){requireReady();const item=itemById(id);if(!item)throw Error('Cosmetic not found.');
  if (localPreview) return localGameAction(uid=>equipLocalItem(uid,id));
  await api.runTransaction(db,async tx=>{const s=await tx.get(ref());const w=s.exists()?s.data():emptyWallet();if(!(w.owned||[]).includes(id))throw Error('Open this item first.');
    tx.set(ref(),{...w,equipped:{...(w.equipped||{}),[item.slot]:id},updatedAt:api.serverTimestamp()});});
}
export async function removeEquipment(slot){requireReady();const allowed=['head','body','hands','legs','back','aura'];if(!allowed.includes(slot))return;
  if (localPreview) return localGameAction(uid=>removeLocalEquipment(uid,slot));
  await api.runTransaction(db,async tx=>{const s=await tx.get(ref());if(!s.exists())return;const w=s.data();const e={...(w.equipped||{})};delete e[slot];tx.set(ref(),{...w,equipped:e,updatedAt:api.serverTimestamp()});});
}

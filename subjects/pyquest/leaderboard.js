// Opt-in leaderboard. No student IDs, emails or private drafts are published.
// Score snapshots are cross-checked against each student's private Firestore
// progress in Firestore security rules. This is a friendly leaderboard, not an
// anti-cheat system: client-run lesson tests can be modified by a determined user.
const SDK = 'https://www.gstatic.com/firebasejs/12.19.0/';
let api, db, currentUser, stopMine, stopAll, stopWeek, onChange = () => {};
let generation = 0;
let state = {loading:false,error:'',me:null,all:[],weekly:[],week:''};
const emit = () => onChange({...state,all:[...state.all],weekly:[...state.weekly]});

// Monday-to-Sunday week in Malaysia's school timezone.
export function currentWeek(now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone:'Asia/Kuala_Lumpur',year:'numeric',month:'2-digit',day:'2-digit'
  }).formatToParts(now).filter(p=>p.type!=='literal').map(p=>[p.type,Number(p.value)]));
  const day = new Date(Date.UTC(parts.year,parts.month-1,parts.day));
  const weekday=day.getUTCDay()||7;
  day.setUTCDate(day.getUTCDate()+4-weekday);
  const year=day.getUTCFullYear();
  const first=new Date(Date.UTC(year,0,1));
  const week=Math.ceil((((day-first)/86400000)+1)/7);
  return `${year}-W${String(week).padStart(2,'0')}`;
}
export function leaderboardState(){return state;}
function ref(uid){return api.doc(db,'leaderboardEntries',uid);}
async function connect(){
  if(api&&db)return;
  const [app,fs]=await Promise.all([import(SDK+'firebase-app.js'),import(SDK+'firebase-firestore.js')]);
  api=fs;db=fs.getFirestore(app.getApp());
}
function scoring(raw){
  const unique = a => new Set(Array.isArray(a)?a:[]).size;
  const lessons=unique(raw.completed), quests=unique(raw.questDone);
  const quizzes=unique(raw.quizCorrect), igcse=unique(raw.igcseCorrect);
  return {xp:lessons*50+quests*120+quizzes*20+igcse*15,lessons,quests};
}
function safeName(name){
  const clean=String(name||'').trim();
  if(clean.length<2||clean.length>24||/[@<>\\/]/.test(clean)) throw new Error('Choose a preferred name of 2–24 characters in Friends first.');
  return clean;
}
function sorted(rows,key){return rows.sort((a,b)=>Number(b[key]||0)-Number(a[key]||0)||String(a.nickname||'').localeCompare(String(b.nickname||'')));}
export function stopLeaderboard(){
  ++generation;
  for(const stop of [stopMine,stopAll,stopWeek])try{stop?.();}catch(_){}
  stopMine=stopAll=stopWeek=null;currentUser=null;
  state={loading:false,error:'',me:null,all:[],weekly:[],week:''};emit();
}
export async function startLeaderboard(user,change){
  stopLeaderboard();const epoch=generation;currentUser=user;onChange=change;
  state.loading=true;state.week=currentWeek();emit();
  try{
    await connect();if(epoch!==generation)return;
    stopMine=api.onSnapshot(ref(user.uid),snap=>{
      if(epoch!==generation)return;
      state.me=snap.exists()?{id:snap.id,...snap.data()}:null;emit();
    },error=>{if(epoch!==generation)return;state.error=error.message;emit();});
    stopAll=api.onSnapshot(api.query(api.collection(db,'leaderboardEntries'),api.orderBy('xp','desc'),api.limit(250)),snap=>{
      if(epoch!==generation)return;
      state.all=sorted(snap.docs.map(d=>({id:d.id,...d.data()})),'xp');state.loading=false;emit();
    },error=>{if(epoch!==generation)return;state.error=error.message;state.loading=false;emit();});
    // A single-field week filter avoids requiring a manual composite Firestore index.
    // Suitable for school-sized groups of up to 250 students on the board.
    subscribeWeek(epoch);
  }catch(error){if(epoch!==generation)return;state.error=error.message;state.loading=false;emit();}
}
function subscribeWeek(epoch){
  stopWeek?.();
  const week=currentWeek();state.week=week;state.weekly=[];emit();
  stopWeek=api.onSnapshot(api.query(api.collection(db,'leaderboardEntries'),api.where('weekKey','==',week),api.limit(250)),snap=>{
    if(epoch!==generation || state.week!==week)return;
    state.weekly=sorted(snap.docs.map(d=>({id:d.id,...d.data()})),'weeklyXp');emit();
  },error=>{if(epoch!==generation)return;state.error=error.message;emit();});
}
export function refreshLeaderboardWeek(){
  if(currentUser&&api&&db&&state.week!==currentWeek()) subscribeWeek(generation);
}
async function studentScore(uid){
  const progress=await api.getDocFromServer(api.doc(db,'users',uid));
  if(!progress.exists())throw Error('Your progress has not synced yet. Retry progress sync.');
  return scoring(progress.data());
}
export async function joinLeaderboard(nickname){
  if(!currentUser)throw Error('Log in first.');
  await connect();
  const uid=currentUser.uid,score=await studentScore(uid),week=currentWeek();
  // Read the authoritative nickname so a stale Friends screen cannot cause
  // Firestore to reject the student's opt-in leaderboard entry.
  const profile = await api.getDocFromServer(api.doc(db,'profiles',uid));
  if(!profile.exists())throw Error('Your profile is not ready. Open Friends, then try again.');
  const name=safeName(profile.data().nickname);
  const staff = await api.getDocFromServer(api.doc(db,'admins',uid));
  if(staff.exists() && staff.data().active === true){
    throw Error('This account is an admin. Please use a separate student account for the leaderboard.');
  }
  try {
    await api.runTransaction(db,async tx=>{
      const entry=await tx.get(ref(uid));
      if(entry.exists())return;
      tx.set(ref(uid),{nickname:name,...score,weekKey:week,weeklyXp:0,
        joinedAt:api.serverTimestamp(),updatedAt:api.serverTimestamp()});
    });
  } catch(err) {
    if(err?.code==='permission-denied') {
      throw Error('Join was blocked by Firestore. Check that your new leaderboard rules are published and you are signed in with your student account.');
    }
    throw err;
  }
}
export async function leaveLeaderboard(){
  if(!currentUser)throw Error('Log in first.');
  await connect();await api.deleteDoc(ref(currentUser.uid));
}
export async function updateLeaderboard(nickname){
  if(!currentUser)return;
  await connect();
  const uid=currentUser.uid,name=safeName(nickname),score=await studentScore(uid),week=currentWeek();
  await api.runTransaction(db,async tx=>{
    const snap=await tx.get(ref(uid));
    if(!snap.exists())return; // Never turn privacy opt-out into an automatic sign-up.
    const old=snap.data();
    const delta=Math.max(0,score.xp-Number(old.xp||0));
    const weeklyXp=old.weekKey===week?Number(old.weeklyXp||0)+delta:delta;
    const unchanged=old.nickname===name&&old.xp===score.xp&&old.lessons===score.lessons&&old.quests===score.quests&&old.weekKey===week;
    if(unchanged)return;
    tx.update(ref(uid),{nickname:name,...score,weeklyXp,weekKey:week,updatedAt:api.serverTimestamp()});
  });
}

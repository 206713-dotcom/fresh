// School-approved admin roles, student name changes and private help requests.
// Permission checks in firestore.rules are authoritative; UI checks are advisory.
const SDK = 'https://www.gstatic.com/firebasejs/12.19.0/';
let fs, db, currentAccount = null, onUpdate = () => {};
let unsubAdmins, unsubTickets, unsubStudents;
let generation = 0;
const state = {role:null, admins:[], tickets:[], students:[], loading:false, error:''};
const report = () => onUpdate({...state});
const snapshotArray = snap => snap.docs.map(d => ({id:d.id, ...d.data()}));
const recentFirst = entries => [...entries].sort((a,b) => (b.createdAt?.toMillis?.()||0) - (a.createdAt?.toMillis?.()||0));
async function connect() {
  if (fs && db) return;
  const [app, firestore] = await Promise.all([import(SDK + 'firebase-app.js'), import(SDK + 'firebase-firestore.js')]);
  fs = firestore;
  db = fs.getFirestore(app.getApp());
}
export function helpDeskState(){return state;}
export async function fetchAdminRole(uid) {
  await connect();
  const d = await fs.getDoc(fs.doc(db,'admins',uid));
  return d.exists() && d.data().active === true ? {id:uid, ...d.data()} : null;
}
export function stopHelpDesk(){
  generation += 1;
  for(const off of [unsubAdmins,unsubTickets,unsubStudents]){try{off?.();}catch(_){}}
  unsubAdmins=unsubTickets=unsubStudents=null;
  currentAccount=null;onUpdate=()=>{};
  Object.assign(state,{role:null,admins:[],tickets:[],students:[],loading:false,error:''});
}
export async function startHelpDesk(account, role, changed){
  stopHelpDesk();
  const turn=generation;
  currentAccount=account;
  onUpdate=changed;
  Object.assign(state,{role,admins:[],tickets:[],students:[],loading:true,error:''});
  report();
  try {
    await connect();
    if(turn!==generation)return;
    // Students see only approved staff names and subjects, never their emails.
    const adminsQuery=fs.query(fs.collection(db,'admins'),fs.where('active','==',true),fs.limit(30));
    unsubAdmins=fs.onSnapshot(adminsQuery,snap=>{
      if(turn!==generation)return;
      state.admins=snapshotArray(snap);
      report();
    },err=>{if(turn!==generation)return;state.error='Admin directory unavailable: '+err.message;report();});
    const key=role?'adminId':'studentId';
    const requestsQuery=fs.query(fs.collection(db,'helpRequests'),fs.where(key,'==',account.uid),fs.limit(100));
    unsubTickets=fs.onSnapshot(requestsQuery,snap=>{
      if(turn!==generation)return;
      state.tickets=recentFirst(snapshotArray(snap));
      state.loading=false;
      report();
    },err=>{if(turn!==generation)return;state.error='Help requests unavailable: '+err.message;state.loading=false;report();});
    if(role){
      // Only approved admins can list student nicknames + friend codes.
      const profilesQuery=fs.query(fs.collection(db,'profiles'),fs.limit(100));
      unsubStudents=fs.onSnapshot(profilesQuery,snap=>{
        if(turn!==generation)return;
        state.students=snapshotArray(snap).sort((a,b)=>String(a.nickname).localeCompare(String(b.nickname)));
        report();
      },err=>{if(turn!==generation)return;state.error='Student roster unavailable: '+err.message;report();});
    }
  } catch(err) {
    if(turn!==generation)return;
    state.error='Help desk could not connect: '+err.message;
    state.loading=false;
    report();
  }
}
function signedIn(){if(!currentAccount||!db)throw new Error('Log in first.');}
export async function sendHelpRequest(adminId,topic,question){
  signedIn();
  if(state.role)throw new Error('Admin accounts answer questions; use a student account to ask.');
  const subject=String(topic||'').trim();
  const text=String(question||'').trim();
  if(!state.admins.some(x=>x.id===adminId&&x.active===true))throw new Error('Select an approved admin.');
  if(subject.length<4||subject.length>80)throw new Error('Use a topic of 4–80 characters.');
  if(text.length<10||text.length>1500)throw new Error('Write a question of 10–1500 characters.');
  await fs.addDoc(fs.collection(db,'helpRequests'),{
    studentId:currentAccount.uid,adminId,topic:subject,question:text,status:'open',
    createdAt:fs.serverTimestamp(),updatedAt:fs.serverTimestamp()
  });
}
export async function answerHelpRequest(id,reply){
  signedIn();
  if(!state.role)throw new Error('Only approved admins can reply.');
  const ticket=state.tickets.find(x=>x.id===id && x.adminId===currentAccount.uid);
  if(!ticket)throw new Error('Question not assigned to this admin.');
  const text=String(reply||'').trim();
  if(text.length<2||text.length>2000)throw new Error('Write a reply of 2–2000 characters.');
  await fs.updateDoc(fs.doc(db,'helpRequests',id),{
    reply:text,status:'answered',answeredAt:fs.serverTimestamp(),updatedAt:fs.serverTimestamp()
  });
}
export async function adminRenameStudent(uid,name){
  signedIn();
  if(!state.role)throw new Error('Only approved admins can change student names.');
  const student=state.students.find(x=>x.id===uid);
  if(!student)throw new Error('Select a student from the roster.');
  const nickname=String(name||'').trim();
  if(nickname.length<2||nickname.length>24)throw new Error('Preferred names must be 2–24 characters.');
  if(/[@<>\\/]/.test(nickname))throw new Error('Use a preferred name, not an email address.');
  if(nickname===student.nickname)throw new Error('That is already the current name.');
  const batch=fs.writeBatch(db);
  batch.update(fs.doc(db,'profiles',uid),{nickname});
  batch.set(fs.doc(fs.collection(db,'adminNameAudit')),{adminId:currentAccount.uid,studentUid:uid,
    previousName:student.nickname,newName:nickname,createdAt:fs.serverTimestamp()});
  await batch.commit();
}

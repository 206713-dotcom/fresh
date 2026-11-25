// Firebase Authentication manages passwords. No passwords are stored in Firestore.
// Student-ID aliases cannot receive email resets; a school-approved recovery
// process is needed if a student has forgotten their password.
const SDK='https://www.gstatic.com/firebasejs/12.19.0/';
let fs,db,current=null,role=null,detach=null,change=()=>{},generation=0;
const state={requests:[],loading:false,error:''};
export function passwordHelpState(){return state;}
async function connect(){if(fs)return;
  const [app,api]=await Promise.all([import(SDK+'firebase-app.js'),import(SDK+'firebase-firestore.js')]);
  fs=api;db=fs.getFirestore(app.getApp());
}
export function stopPasswordHelp(){generation++;detach?.();detach=null;current=null;role=null;change=()=>{};
  Object.assign(state,{requests:[],loading:false,error:''});}
export async function startPasswordHelp(account,adminRole,onChange){
  stopPasswordHelp();const g=generation;current=account;role=adminRole;change=onChange;
  state.loading=true;change();
  try {await connect();if(g!==generation)return;
    const base=fs.collection(db,'passwordHelpRequests');
    const query=adminRole?fs.query(base,fs.limit(100)):
      fs.query(base,fs.where('studentUid','==',account.uid),fs.limit(100));
    detach=fs.onSnapshot(query,snap=>{if(g!==generation)return;
      state.requests=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.toMillis?.()||0)-(a.createdAt?.toMillis?.()||0));
      state.loading=false;state.error='';change();
    },err=>{if(g!==generation)return;state.loading=false;state.error=err.message;change();});
  }catch(err){if(g!==generation)return;state.loading=false;state.error=err.message;change();}
}
export async function requestPasswordHelp(reason){
  if(!current || role || !fs)throw Error('Student login required.');
  if(!['password-change','account-access'].includes(reason))throw Error('Select a reason.');
  if(state.requests.some(x=>x.status==='open'))throw Error('You already have an open password-help request.');
  await fs.addDoc(fs.collection(db,'passwordHelpRequests'),{
    studentUid:current.uid,reason,status:'open',createdAt:fs.serverTimestamp(),updatedAt:fs.serverTimestamp()
  });
}
export async function reviewPasswordHelp(id,status){
  if(!current || !role || role.active!==true || !fs)throw Error('Approved admin login required.');
  if(!['reviewed','resolved'].includes(status))throw Error('Invalid request status.');
  if(!state.requests.some(x=>x.id===id))throw Error('Request not found.');
  await fs.updateDoc(fs.doc(db,'passwordHelpRequests',id),{
    status,adminUid:current.uid,updatedAt:fs.serverTimestamp()
  });
}

// Staff roster contains only learning summary fields; never passwords or drafts.
const SDK='https://www.gstatic.com/firebasejs/12.19.0/';
let api,db,account,unsub,listener=()=>{},generation=0;
let state={rows:[],loading:false,error:''};
export const rosterState=()=>state;
function emit(){listener({...state,rows:[...state.rows]});}
async function connect(){if(api&&db)return;const [app,fs]=await Promise.all([import(SDK+'firebase-app.js'),import(SDK+'firebase-firestore.js')]);api=fs;db=api.getFirestore(app.getApp());}
export function stopRoster(){++generation;unsub?.();unsub=null;account=null;state={rows:[],loading:false,error:''};emit();}
export async function startRoster(user,onChange){stopRoster();account=user;listener=onChange;const epoch=generation;state.loading=true;emit();
  try{await connect();if(epoch!==generation)return;unsub=api.onSnapshot(api.query(api.collection(db,'studentStats'),api.limit(100)),s=>{if(epoch!==generation)return;state.loading=false;state.rows=s.docs.map(d=>({uid:d.id,...d.data()})).sort((a,b)=>b.xp-a.xp);emit();},e=>{if(epoch!==generation)return;state.loading=false;state.error=e.message;emit();});}
  catch(e){state.loading=false;state.error=e.message;emit();}
}
export async function syncStudentStats(user,nickname){if(!user)return;await connect();const [p,profile]=await Promise.all([api.getDoc(api.doc(db,'users',user.uid)),api.getDoc(api.doc(db,'profiles',user.uid))]);
  if(!p.exists()||!profile.exists())return;
  const obj=p.data(),u=a=>new Set(Array.isArray(a)?a:[]).size;
  const lessons=u(obj.completed),quests=u(obj.questDone),quizzes=u(obj.quizCorrect),igcse=u(obj.igcseCorrect);
  const row={nickname:profile.data().nickname,lessons,quests,quizzes,igcse,xp:lessons*50+quests*120+quizzes*20+igcse*15,updatedAt:api.serverTimestamp()};
  await api.setDoc(api.doc(db,'studentStats',user.uid),row);
}

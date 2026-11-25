// Discover opted-in classmates by preferred name. No student IDs or email exposed.
const SDK='https://www.gstatic.com/firebasejs/12.19.0/';
let api,db,account,unsub,ownUnsub,onChange=()=>{},generation=0;
let state={loading:false,list:[],listed:false,error:''};
export function directoryState(){return state;}
function emit(){onChange({...state,list:[...state.list]});}
async function connect(){if(api&&db)return;const [app,fs]=await Promise.all([import(SDK+'firebase-app.js'),import(SDK+'firebase-firestore.js')]);api=fs;db=api.getFirestore(app.getApp());}
export function stopDirectory(){++generation;unsub?.();ownUnsub?.();unsub=ownUnsub=null;account=null;state={loading:false,list:[],listed:false,error:''};emit();}
export async function startDirectory(user,change){stopDirectory();account=user;onChange=change;const epoch=generation;state.loading=true;emit();
  try{await connect();if(epoch!==generation)return;
    ownUnsub=api.onSnapshot(api.doc(db,'directory',user.uid),s=>{if(epoch!==generation)return;state.listed=s.exists();emit();},e=>{state.error=e.message;emit();});
    unsub=api.onSnapshot(api.query(api.collection(db,'directory'),api.limit(100)),s=>{if(epoch!==generation)return;state.loading=false;state.list=s.docs.map(x=>({id:x.id,...x.data()}));emit();},e=>{if(epoch!==generation)return;state.loading=false;state.error=e.message;emit();});
  }catch(e){state.error=e.message;state.loading=false;emit();}
}
export async function setDirectoryOptIn(enabled,nickname){if(!account)throw Error('Log in first.');await connect();const ref=api.doc(db,'directory',account.uid);
  if(enabled){const p=await api.getDoc(api.doc(db,'profiles',account.uid));if(!p.exists())throw Error('Finish your preferred name first.');
    await api.setDoc(ref,{nickname:p.data().nickname,joinedAt:api.serverTimestamp()});}
  else await api.deleteDoc(ref);
}
export async function syncDirectoryName(){if(!account||!api||!state.listed)return;const p=await api.getDoc(api.doc(db,'profiles',account.uid));if(p.exists())await api.updateDoc(api.doc(db,'directory',account.uid),{nickname:p.data().nickname});}

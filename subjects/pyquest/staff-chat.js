// One-to-one private teacher/student messaging for authenticated school users.
const SDK='https://www.gstatic.com/firebasejs/12.19.0/';
let api,db,account,admin,stop,listener=()=>{},generation=0;
let state={target:null,messages:[],loading:false,error:''};
export const staffChatState=()=>state;
function emit(){listener({...state,messages:[...state.messages]});}
async function connect(){if(api&&db)return;const [app,fs]=await Promise.all([import(SDK+'firebase-app.js'),import(SDK+'firebase-firestore.js')]);api=fs;db=api.getFirestore(app.getApp());}
export function stopStaffChat(){++generation;stop?.();stop=null;account=null;admin=false;state={target:null,messages:[],loading:false,error:''};emit();}
export async function startStaffChat(user,isAdmin,onChange){stopStaffChat();account=user;admin=!!isAdmin;listener=onChange;await connect();if(!admin)openStaffChat(user.uid);}
export async function openStaffChat(uid){if(!account)throw Error('Log in.');await connect();if(!admin&&uid!==account.uid)throw Error('You can only open your own teacher chat.');
  stop?.();const epoch=++generation;state={target:uid,messages:[],loading:true,error:''};emit();
  const q=api.query(api.collection(db,'staffChats',uid,'messages'),api.orderBy('createdAt','desc'),api.limit(60));
  stop=api.onSnapshot(q,s=>{if(epoch!==generation)return;state.loading=false;state.messages=s.docs.map(d=>({id:d.id,...d.data()})).reverse();emit();},e=>{if(epoch!==generation)return;state.loading=false;state.error=e.message;emit();});
}
let lastSend=0;
export async function sendStaffMessage(text){if(!account||!state.target)throw Error('Select a chat.');let value=String(text||'').trim();if(!value||value.length>600)throw Error('Message must be 1–600 characters.');if(Date.now()-lastSend<1500)throw Error('Please wait before sending again.');lastSend=Date.now();
  await api.addDoc(api.collection(db,'staffChats',state.target,'messages'),{from:account.uid,text:value,createdAt:api.serverTimestamp()});
}
export async function reportStaffMessage(id){if(!account||!state.target||admin)throw Error('This report form is for students.');
  await api.addDoc(api.collection(db,'staffReports'),{studentUid:account.uid,messageId:id,createdAt:api.serverTimestamp()});
}

// School announcements / reminders, visible only to signed-in PyQuest accounts.
// Only approved admins can create or change notices (enforced by firestore.rules).
const SDK = 'https://www.gstatic.com/firebasejs/12.19.0/';
let fs, db, account=null, role=null, unsubscribe=null, generation=0, changed=()=>{};
const state={posts:[],loading:false,error:''};
export function announcementState(){ return state; }
async function connect(){
  if(fs && db) return;
  const [app,firestore]=await Promise.all([
    import(SDK+'firebase-app.js'),import(SDK+'firebase-firestore.js')
  ]);
  fs=firestore;
  db=fs.getFirestore(app.getApp());
}
export function stopAnnouncements(){
  generation++;
  try{unsubscribe?.();}catch(_){}
  unsubscribe=null;account=null;role=null;changed=()=>{};
  Object.assign(state,{posts:[],loading:false,error:''});
}
export async function startAnnouncements(newAccount,adminRole,onChanged){
  stopAnnouncements();
  const epoch=generation;
  account=newAccount;role=adminRole;changed=onChanged;
  state.loading=true;state.error='';changed();
  try{
    await connect();
    if(epoch!==generation)return;
    const ref=fs.collection(db,'announcements');
    const q=adminRole
      ? fs.query(ref,fs.limit(100))
      : fs.query(ref,fs.where('status','==','published'),fs.limit(100));
    unsubscribe=fs.onSnapshot(q,snapshot=>{
      if(epoch!==generation)return;
      state.posts=snapshot.docs.map(doc=>({id:doc.id,...doc.data()}))
        .filter(p=>adminRole || p.status==='published')
        .sort((a,b)=>{
          const pins=Number(!!b.pinned)-Number(!!a.pinned);
          return pins || (b.createdAt?.toMillis?.()||0)-(a.createdAt?.toMillis?.()||0);
        });
      state.loading=false;state.error='';changed();
    },err=>{
      if(epoch!==generation)return;
      state.loading=false;state.error='Announcements unavailable: '+err.message;changed();
    });
  }catch(err){
    if(epoch!==generation)return;
    state.loading=false;state.error='Announcements could not connect: '+err.message;changed();
  }
}
function requireAdmin(){
  if(!fs || !account || role?.active!==true)throw Error('Only approved school admins can manage announcements.');
}
function clean(value){return String(value??'').trim();}
function normalize(fields){
  const data={
    title:clean(fields.title),body:clean(fields.body),
    kind:fields.kind==='reminder'?'reminder':'announcement',
    status:fields.status==='published'?'published':'draft',
    pinned:fields.pinned===true,
    dueDate:clean(fields.dueDate)
  };
  if(data.title.length<4||data.title.length>100)throw Error('Title must be 4–100 characters.');
  if(data.body.length<10||data.body.length>1200)throw Error('Message must be 10–1,200 characters.');
  if(data.dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(data.dueDate))throw Error('Choose a valid date.');
  return data;
}
export async function saveAnnouncement(fields,id=null){
  requireAdmin();const data=normalize(fields);
  if(id){
    if(!state.posts.some(x=>x.id===id))throw Error('Announcement not found.');
    await fs.updateDoc(fs.doc(db,'announcements',id),{...data,updatedAt:fs.serverTimestamp()});
    return id;
  }
  const doc=fs.doc(fs.collection(db,'announcements'));
  await fs.setDoc(doc,{...data,createdBy:account.uid,createdAt:fs.serverTimestamp(),updatedAt:fs.serverTimestamp()});
  return doc.id;
}
export async function setAnnouncementStatus(id,status){
  requireAdmin();
  if(!['draft','published','archived'].includes(status))throw Error('Invalid announcement status.');
  if(!state.posts.some(x=>x.id===id))throw Error('Announcement not found.');
  await fs.updateDoc(fs.doc(db,'announcements',id),{status,updatedAt:fs.serverTimestamp()});
}

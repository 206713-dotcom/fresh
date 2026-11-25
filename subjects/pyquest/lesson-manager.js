// Real-time, admin-managed lessons (published lessons appear for students).
// Firestore rules (not the browser UI) enforce admin-only writes.
const SDK='https://www.gstatic.com/firebasejs/12.19.0/';
let fs, db, session=null, role=null, detach=null, generation=0, changed=()=>{};
const state={lessons:[],loading:false,error:''};
export function lessonManagerState(){return state;}
async function connect(){
  if(fs && db)return;
  const [app,firestore]=await Promise.all([import(SDK+'firebase-app.js'),import(SDK+'firebase-firestore.js')]);
  fs=firestore;db=fs.getFirestore(app.getApp());
}
export function stopLessonManager(){
  generation++;if(detach){detach();detach=null;}
  session=null;role=null;changed=()=>{};
  Object.assign(state,{lessons:[],loading:false,error:''});
}
export async function startLessonManager(account,adminRole,callback){
  stopLessonManager();
  const g=generation;session=account;role=adminRole;changed=callback;
  state.loading=true;state.error='';changed();
  try{
    await connect();if(g!==generation)return;
    const base=fs.collection(db,'customLessons');
    const query=adminRole
      ? fs.query(base,fs.limit(100))
      : fs.query(base,fs.where('status','==','published'),fs.limit(100));
    detach=fs.onSnapshot(query,snap=>{
      if(g!==generation)return;
      state.lessons=snap.docs.map(d=>({id:d.id,...d.data()}));
      state.lessons.sort((a,b)=>(a.createdAt?.toMillis?.()||0)-(b.createdAt?.toMillis?.()||0));
      state.loading=false;state.error='';changed();
    },error=>{if(g!==generation)return;state.loading=false;state.error='Lesson feed: '+error.message;changed();});
  }catch(error){if(g!==generation)return;state.loading=false;state.error=error.message;changed();}
}
function requireAdmin(){if(!session || !role || role.active!==true || !fs)throw Error('Only approved admins can manage lessons.');}
const text=(v)=>String(v||'').trim();
function validate(fields){
  const lesson={
    title:text(fields.title),tagline:text(fields.tagline),level:text(fields.level),emoji:text(fields.emoji)||'📘',
    description:text(fields.description),example:text(fields.example),
    prompt:text(fields.prompt),starter:String(fields.starter||''),expected:String(fields.expected||'').trim(),
    hint:text(fields.hint),status:fields.status==='published'?'published':'draft',
    minutes:Math.max(5,Math.min(60,Math.round(Number(fields.minutes)||10)))
  };
  if(lesson.title.length<3||lesson.title.length>80)throw Error('Title must have 3–80 characters.');
  if(lesson.tagline.length<3||lesson.tagline.length>120)throw Error('Subtitle must have 3–120 characters.');
  if(!['Beginner','Explorer','Advanced'].includes(lesson.level))throw Error('Choose a lesson level.');
  if(lesson.emoji.length>8)throw Error('Use one short emoji.');
  for(const key of ['description','example','prompt','starter','expected','hint']){
    if(!lesson[key] || lesson[key].length>3000)throw Error('Fill in '+key+' (maximum 3,000 characters).');
  }
  if(lesson.expected.length>500)throw Error('Expected output must be 500 characters or fewer.');
  return lesson;
}
export async function saveManagedLesson(fields,id=null){
  requireAdmin();const data=validate(fields);
  if(id){
    const existing=state.lessons.find(x=>x.id===id);
    if(!existing)throw Error('Lesson not found.');
    await fs.updateDoc(fs.doc(db,'customLessons',id),{...data,updatedAt:fs.serverTimestamp()});
    return id;
  }
  const ref=fs.doc(fs.collection(db,'customLessons'));
  await fs.setDoc(ref,{...data,createdBy:session.uid,createdAt:fs.serverTimestamp(),updatedAt:fs.serverTimestamp()});
  return ref.id;
}
export async function setLessonStatus(id,status){
  requireAdmin();
  if(!['draft','published','archived'].includes(status))throw Error('Invalid status.');
  if(!state.lessons.some(x=>x.id===id))throw Error('Lesson not found.');
  await fs.updateDoc(fs.doc(db,'customLessons',id),{status,updatedAt:fs.serverTimestamp()});
}

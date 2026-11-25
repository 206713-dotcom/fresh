// Private, mutual-friend messaging. No email search or public people directory.
// Firestore rules are the real access controls; UI checks are not security boundaries.
const SDK = 'https://www.gstatic.com/firebasejs/12.19.0/';
let api, db, signedIn, unsubFriends, unsubBlocks, unsubMessages, unsubProfile;
let onUpdate = () => {};
const state = {
  loading:false, error:'', profile:null, friendships:[], blocked:[], messages:[],
  selected:null, messageLoading:false, pending:false
};
const randomCode = () => {
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes=crypto.getRandomValues(new Uint8Array(10));
  return Array.from(bytes, b=>chars[b%chars.length]).join('');
};
const profileRef = uid=>api.doc(db,'profiles',uid);
const pairId = (a,b)=>[a,b].sort().join('_');
const friendshipRef = (a,b)=>api.doc(db,'friendships',pairId(a,b));
const blockRef = (a,b)=>api.doc(db,'blocks',a,'users',b);
const chatCollection = (pair)=>api.collection(db,'chats',pair,'messages');
const report = ()=>onUpdate({...state, friendships:[...state.friendships], blocked:[...state.blocked], messages:[...state.messages]});
export function socialState(){return state;}
export function stopSocial(){
  for(const unsub of [unsubFriends,unsubBlocks,unsubMessages,unsubProfile])try{unsub?.();}catch(_){}
  unsubFriends=unsubBlocks=unsubMessages=unsubProfile=null;
  signedIn=null;state.loading=false;state.error='';state.profile=null;state.friendships=[];
  state.blocked=[];state.messages=[];state.selected=null;state.messageLoading=false;report();
}
async function connect(){
  if(api && db)return;
  const [app,fs]=await Promise.all([import(SDK+'firebase-app.js'),import(SDK+'firebase-firestore.js')]);
  api=fs;db=fs.getFirestore(app.getApp());
}
function shortName(){return 'Coder '+signedIn.uid.slice(0,4).toUpperCase();}
async function ensureProfile(){
  const ref=profileRef(signedIn.uid);
  const existing=await api.getDoc(ref);
  if(existing.exists()){state.profile=existing.data();return;}
  for(let i=0;i<5;i++){
    const code=randomCode();const invite=api.doc(db,'inviteCodes',code);
    try {
      await api.runTransaction(db, async tx=>{
        const [p,c]=await Promise.all([tx.get(ref),tx.get(invite)]);
        if(p.exists()){state.profile=p.data();return;}
        if(c.exists())throw new Error('Code collision');
        const profile={nickname:shortName(),code,createdAt:api.serverTimestamp()};
        tx.set(ref,profile);
        tx.set(invite,{uid:signedIn.uid,createdAt:api.serverTimestamp()});
      });
      if(!state.profile){const doc=await api.getDoc(ref);state.profile=doc.data();}
      return;
    }catch(e){if(!String(e.message).includes('Code collision'))throw e;}
  }
  throw new Error('Could not create a friend code. Try again.');
}
export async function startSocial(account,change){
  stopSocial();signedIn=account;onUpdate=change;
  state.loading=true;report();
  try{
    await connect(); if(signedIn?.uid!==account.uid)return;
    await ensureProfile(); if(signedIn?.uid!==account.uid)return;
    // Keep the preferred name fresh when an approved admin changes it.
    unsubProfile=api.onSnapshot(profileRef(account.uid),snap=>{
      if(signedIn?.uid!==account.uid || !snap.exists())return;
      state.profile=snap.data();report();
    },err=>{if(signedIn?.uid!==account.uid)return;state.error='Profile refresh failed: '+err.message;report();});
    const fQuery=api.query(api.collection(db,'friendships'),api.where('members','array-contains',account.uid),api.limit(100));
    unsubFriends=api.onSnapshot(fQuery,snap=>{
      if(signedIn?.uid!==account.uid)return;
      state.friendships=snap.docs.map(x=>({id:x.id,...x.data()}));
      const active=state.friendships.find(x=>x.id===state.selected&&x.status==='accepted');
      if(state.selected&&!active){unsubMessages?.();unsubMessages=null;state.selected=null;state.messages=[];}
      state.loading=false;report();
    },e=>{state.error='Friends could not load: '+e.message;state.loading=false;report();});
    unsubBlocks=api.onSnapshot(api.collection(db,'blocks',account.uid,'users'),snap=>{
      if(signedIn?.uid!==account.uid)return;
      state.blocked=snap.docs.map(x=>x.id);
      if(state.selected){const f=state.friendships.find(x=>x.id===state.selected);const other=f?.members.find(x=>x!==account.uid);if(other&&state.blocked.includes(other))closeChat();}
      report();
    },e=>{state.error='Blocked users could not load: '+e.message;report();});
    report();
  }catch(e){if(signedIn?.uid!==account.uid)return;state.error=e.message;state.loading=false;report();}
}
function friend(uid){return state.friendships.find(x=>x.members?.includes(uid));}
function requiresSession(){if(!signedIn||!db)throw new Error('Log in first.');}
function otherUid(f){return f.members.find(id=>id!==signedIn.uid);}
export function friends(){if(!signedIn)return[];return state.friendships.filter(x=>x.status==='accepted'&&!state.blocked.includes(otherUid(x)));}
export function incoming(){if(!signedIn)return[];return state.friendships.filter(x=>x.status==='pending'&&x.initiatedBy!==signedIn.uid&&!state.blocked.includes(otherUid(x)));}
export function outgoing(){if(!signedIn)return[];return state.friendships.filter(x=>x.status==='pending'&&x.initiatedBy===signedIn.uid&&!state.blocked.includes(otherUid(x)));}
export function isBlocked(uid){return state.blocked.includes(uid);}
export async function lookupFriendCode(code){
  requiresSession();const safe=String(code||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  if(safe.length!==10)throw new Error('Enter a 10-character friend code.');
  const found=await api.getDoc(api.doc(db,'inviteCodes',safe));
  if(!found.exists())throw new Error('Friend code not found.');
  const uid=found.data().uid;
  if(uid===signedIn.uid)throw new Error("That's your own code.");
  if(isBlocked(uid))throw new Error('Unblock this student first.');
  if(friend(uid))throw new Error('You already have a request or friendship with this person.');
  const person=await api.getDoc(profileRef(uid));
  if(!person.exists())throw new Error('Student profile not available.');
  return {uid,code:safe,nickname:person.data().nickname||'Coder'};
}
export async function sendFriendRequest(uid){
  requiresSession();if(uid===signedIn.uid||friend(uid)||isBlocked(uid))throw new Error('Cannot send this request.');
  await api.setDoc(friendshipRef(signedIn.uid,uid),{
    members:[signedIn.uid,uid].sort(),initiatedBy:signedIn.uid,status:'pending',
    createdAt:api.serverTimestamp(),updatedAt:api.serverTimestamp()
  });
}
export async function acceptFriend(pair){
  requiresSession();const f=state.friendships.find(x=>x.id===pair);
  if(!f||f.status!=='pending'||f.initiatedBy===signedIn.uid)throw new Error('No friend request to accept.');
  await api.updateDoc(api.doc(db,'friendships',pair),{status:'accepted',updatedAt:api.serverTimestamp()});
}
export async function removeFriend(pair){requiresSession();await api.deleteDoc(api.doc(db,'friendships',pair));if(state.selected===pair)closeChat();}
export async function blockStudent(uid){
  requiresSession();if(uid===signedIn.uid)throw new Error('Cannot block yourself.');
  // Block first. Firestore security rules immediately deny message access both ways.
  await api.setDoc(blockRef(signedIn.uid,uid),{createdAt:api.serverTimestamp()});
  if(state.selected){const f=state.friendships.find(x=>x.id===state.selected);if(f?.members.includes(uid))closeChat();}
  // Request/friendship may remain in DB, but UI hides blocked accounts.
}
export async function unblockStudent(uid){requiresSession();await api.deleteDoc(blockRef(signedIn.uid,uid));}
export async function renameProfile(nickname){
  requiresSession();const name=String(nickname||'').trim();
  if(name.length<2||name.length>24)throw new Error('Choose a nickname with 2–24 characters.');
  if(/[@<>\\/]/.test(name))throw new Error('Use a nickname, not an email address.');
  await api.updateDoc(profileRef(signedIn.uid),{nickname:name});
  state.profile={...state.profile,nickname:name};report();
}
export async function getNickname(uid){
  requiresSession();const d=await api.getDoc(profileRef(uid));
  return d.exists()?(d.data().nickname||'Coder'):'Coder';
}
export function closeChat(){unsubMessages?.();unsubMessages=null;state.selected=null;state.messages=[];state.messageLoading=false;report();}
export function openChat(pair){
  requiresSession();const f=friends().find(x=>x.id===pair);
  if(!f)throw new Error('Messaging works only with accepted friends.');
  unsubMessages?.();state.selected=pair;state.messages=[];state.messageLoading=true;report();
  const q=api.query(chatCollection(pair),api.orderBy('createdAt','desc'),api.limit(50));
  unsubMessages=api.onSnapshot(q,snap=>{
    if(state.selected!==pair)return;
    state.messages=snap.docs.map(d=>({id:d.id,...d.data()})).reverse();
    state.messageLoading=false;report();
  },e=>{if(state.selected!==pair)return;state.messageLoading=false;state.error='Chat unavailable: '+e.message;report();});
}
let nextSendAt=0;
export async function sendMessage(text){
  requiresSession();const pair=state.selected;
  if(!friends().some(x=>x.id===pair))throw new Error('Choose an accepted friend.');
  const message=String(text||'').trim();
  if(!message||message.length>500)throw new Error('Messages must be 1–500 characters.');
  if(Date.now()<nextSendAt)throw new Error('Please slow down before sending again.');
  nextSendAt=Date.now()+1800;
  await api.addDoc(chatCollection(pair),{from:signedIn.uid,text:message,createdAt:api.serverTimestamp()});
}
export async function reportMessage(messageId,reason){
  requiresSession();const pair=state.selected;
  if(!friends().some(x=>x.id===pair))throw new Error('Only friend chats can be reported here.');
  const allowed=['Bullying','Inappropriate','Spam','Other'];
  if(!allowed.includes(reason))throw new Error('Choose a report reason.');
  if(!state.messages.some(x=>x.id===messageId))throw new Error('Select a message to report.');
  await api.addDoc(api.collection(db,'reports'),{
    reporter:signedIn.uid,pair,messageId,reason,createdAt:api.serverTimestamp()
  });
}

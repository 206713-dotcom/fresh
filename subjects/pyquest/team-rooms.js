import {awardTeam} from './game-state.js?v=balanced';
import {localPreview, localRoomsKey, localRoomsFor, mutateLocal, onLocalChange} from './local-preview.js';
const SDK='https://www.gstatic.com/firebasejs/12.19.0/';
export const GAME_QUESTIONS={
 python:[
  {q:'Which function shows text?',a:['print()','show()','echo()','speak()'],right:0,why:'print() displays output.'},
  {q:'What does 2 ** 3 evaluate to?',a:['6','8','9','5'],right:1,why:'** is exponentiation.'},
  {q:'Which is a valid list?',a:['(1;2)','{1:2}','[1,2]','<1,2>'],right:2,why:'Lists use square brackets.'},
  {q:'What is len("code")?',a:['2','3','4','5'],right:2,why:'Four characters.'},
  {q:'Which word begins a function definition?',a:['def','func','function','new'],right:0,why:'Use def.'},
  {q:'What does range(3) produce?',a:['1,2,3','0,1,2','0,1,2,3','3,2,1'],right:1,why:'range stops before 3.'},
  {q:'What is bool(0)?',a:['True','False','None','Error'],right:1,why:'Zero is falsy.'},
  {q:'Which catches an exception?',a:['if/else','try/except','while/for','with/as'],right:1,why:'try/except catches errors.'}
 ],
 igcse:[
  {q:'How many bits are in a byte?',a:['4','8','16','32'],right:1,why:'8 bits form one byte.'},
  {q:'What is binary 1101 in decimal?',a:['11','12','13','14'],right:2,why:'8+4+1=13.'},
  {q:'Which gate is true only if both inputs are true?',a:['OR','AND','XOR','NOT'],right:1,why:'AND needs both inputs.'},
  {q:'What is a primary key in a database?',a:['Unique identifier','Password','Backup','Software'],right:0,why:'A primary key identifies a record.'},
  {q:'Why use a checksum?',a:['Check transmission errors','Compress photos','Delete files','Cool CPUs'],right:0,why:'Checksums can detect corrupted data.'},
  {q:'Binary search needs data to be...',a:['Unsorted','Sorted','Encrypted','Random'],right:1,why:'Binary search assumes ordered data.'},
  {q:'Which memory is volatile?',a:['ROM','SSD','RAM','Optical disk'],right:2,why:'RAM loses data when power goes off.'},
  {q:'Which is a loop in pseudocode?',a:['REPEAT UNTIL','DECLARE','OUTPUT only','CONSTANT'],right:0,why:'REPEAT UNTIL is iteration.'}
 ]
};
let api,db,account,unsub,change=()=>{},generation=0;
let state={loading:false,error:'',rooms:[]};
export function teamState(){return state;}
function emit(){change({...state,rooms:[...state.rooms]});}
async function connect(){if(api&&db)return;const [app,fs]=await Promise.all([import(SDK+'firebase-app.js'),import(SDK+'firebase-firestore.js')]);api=fs;db=api.getFirestore(app.getApp());}
export function stopTeams(){++generation;unsub?.();unsub=null;account=null;state={loading:false,error:'',rooms:[]};emit();}
export async function startTeams(user,onChange){stopTeams();account=user;change=onChange;const epoch=generation;state.loading=true;emit();
  if(localPreview){
    refreshLocalRooms(user.uid);
    unsub=onLocalChange(localRoomsKey,()=>refreshLocalRooms(user.uid));
    return;
  }
  try{await connect();if(epoch!==generation)return;const q=api.query(api.collection(db,'teamRooms'),api.where('members','array-contains',user.uid),api.limit(40));
    unsub=api.onSnapshot(q,s=>{if(epoch!==generation)return;state.loading=false;state.rooms=s.docs.map(x=>({id:x.id,...x.data()})).sort((a,b)=>(b.updatedAt?.seconds||0)-(a.updatedAt?.seconds||0));emit();},e=>{if(epoch!==generation)return;state.loading=false;state.error=e.message;emit();});
  }catch(e){state.loading=false;state.error=e.message;emit();}
}
function randomCode(){const letters='ABCDEFGHJKLMNPQRSTUVWXYZ';let out='';for(let i=0;i<6;i++)out+=letters[Math.floor(Math.random()*letters.length)];return out;}
function refreshLocalRooms(uid){
  state.loading=false;
  state.rooms=localRoomsFor(uid).sort((a,b)=>b.updatedAt-a.updatedAt);
  emit();
}
async function changeLocalRooms(changeRoom){
  const uid=account.uid;
  const result=await mutateLocal(localRoomsKey, {}, rooms=>changeRoom(rooms,uid));
  if(account?.uid===uid)refreshLocalRooms(uid);
  return result;
}
function newRoom(code,uid,mode,timestamp){
  return {joinCode:code,members:[uid],host:uid,mode,status:'waiting',answers:{},createdAt:timestamp,updatedAt:timestamp};
}
export async function createRoom(mode){
  if(!account)throw Error('Log in first.');
  if(!Object.hasOwn(GAME_QUESTIONS,mode))throw Error('Choose a game type.');
  if(localPreview)return changeLocalRooms((rooms,uid)=>{
    let code=randomCode();
    while(Object.hasOwn(rooms,code))code=randomCode();
    rooms[code]={id:code,...newRoom(code,uid,mode,Date.now())};
    return code;
  });
  await connect();
  // Do not getDoc() before creating the room. Its document doesn't exist yet,
  // and our Firestore get rule deliberately denies reads of nonexistent rooms.
  const code=randomCode();
  const ref=api.doc(db,'teamRooms',code);
  try{
    // For a new code this is a Firestore CREATE. If the code already exists,
    // it would be an UPDATE, which the restricted room-update rule rejects.
    await api.setDoc(ref,newRoom(code,account.uid,mode,api.serverTimestamp()));
  }catch(error){
    if(error?.code==='permission-denied'){
      throw Error('Firebase blocked room creation. Check that the updated teamRooms Firestore rules are published. If they are, retry in case the room code was already used.');
    }
    throw error;
  }
  return code;
}
function joinedRoom(room,uid,updatedAt){
  if(!room)throw Error('Join code not found.');
  if(room.status!=='waiting')throw Error('This room is no longer waiting for a player.');
  if(room.host===uid)throw Error('Use a different profile to join your own room.');
  if(room.members.length>=2)throw Error('This room is already full.');
  return {members:[room.host,uid],status:'playing',updatedAt};
}
export async function joinRoomByCode(code){
  if(!account)throw Error('Log in first.');
  const clean=String(code||'').trim().toUpperCase();
  if(!/^[A-Z]{6}$/.test(clean))throw Error('Enter a 6-letter join code.');
  if(localPreview)return changeLocalRooms((rooms,uid)=>{
    const room=rooms[clean];
    Object.assign(room,joinedRoom(room,uid,Date.now()));
    return clean;
  });
  const uid=account.uid;
  const ref=api.doc(db,'teamRooms',clean);
  await api.runTransaction(db,async tx=>{
    const snap=await tx.get(ref);
    tx.update(ref,joinedRoom(snap.data(),uid,api.serverTimestamp()));
  });
  return clean;
}
function answeredRoom(room,uid,answer,question,updatedAt){
  if(!room)throw Error('Room not found.');
  if(room.status!=='playing'||!room.members.includes(uid))throw Error('Game not started.');
  const mine=room.answers?.[uid]||[];
  const size=GAME_QUESTIONS[room.mode].length;
  if(mine.length>=size)throw Error('You finished already.');
  if(question!==mine.length)throw Error('That question was already answered.');
  const answers={...room.answers,[uid]:[...mine,answer]};
  const finished=room.members.length===2&&room.members.every(id=>(answers[id]||[]).length===size);
  return {answers,status:finished?'done':'playing',updatedAt};
}
export async function answerRoom(roomId,answer,question){
  if(!account)throw Error('Log in first.');
  if(!Number.isInteger(answer)||answer<0||answer>3)throw Error('Choose one option.');
  if(localPreview)return changeLocalRooms((rooms,uid)=>{
    const room=rooms[roomId];
    Object.assign(room,answeredRoom(room,uid,answer,question,Date.now()));
  });
  const uid=account.uid;
  const ref=api.doc(db,'teamRooms',roomId);
  await api.runTransaction(db,async tx=>{
    const snap=await tx.get(ref);
    tx.update(ref,answeredRoom(snap.data(),uid,answer,question,api.serverTimestamp()));
  });
}
export function teamScore(room){const questions=GAME_QUESTIONS[room.mode]||[];return (room.members||[]).map(uid=>({uid,correct:(room.answers?.[uid]||[]).filter((answer,i)=>answer===questions[i]?.right).length,answered:(room.answers?.[uid]||[]).length}));}
export async function claimTeamReward(room){if(room.status!=='done'||!account||!room.members.includes(account.uid))throw Error('Finish the game together first.');
  await awardTeam(room.id);
}

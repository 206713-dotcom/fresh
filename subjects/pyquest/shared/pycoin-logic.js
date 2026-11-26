// Reward rules shared by the Netlify function and the local edition.
import {LESSONS,QUESTS,QUIZZES} from '../lessons.js';
import {IGCSE_TOPICS} from '../igcse.js';
import {IGCSE_DEPTH} from '../igcse-depth.js';
import {ITEMS,LEGACY_ITEMS} from '../game-items.js';
const allowedLessonIds=new Set(LESSONS.map(x=>x.id));
const allowedQuestIds=new Set(QUESTS.map(x=>x.id));
const validIgcseIds=new Set(IGCSE_TOPICS.flatMap((topic,index)=>{
  const n=topic.questions.length + (IGCSE_DEPTH[topic.id]?.questions?.length||0);
  return Array.from({length:n},(_,i)=>`${index+1}-${i}`);
}));
const validItems=new Map([...ITEMS,...LEGACY_ITEMS].map(x=>[x.id,x]));
const uniqueValid=(arr,valid)=>[...new Set(Array.isArray(arr)?arr:[])].filter(valid);
export const emptyWallet = () => ({coins:0, bonusXp:0, owned:[], equipped:{}, claimed:[], updatedAt:null});
export function eligibleClaims(progress,passed,completedRooms){
  const p=progress||{};
  return [
    ...uniqueValid(p.completed,x=>typeof x==='string'&&allowedLessonIds.has(x)).map(x=>['lesson',x]),
    ...uniqueValid(p.questDone,x=>typeof x==='string'&&allowedQuestIds.has(x)).map(x=>['quest',x]),
    ...uniqueValid(p.quizCorrect,x=>Number.isInteger(x)&&x>=0&&x<QUIZZES.length).map(x=>['quiz',x]),
    ...uniqueValid(p.igcseCorrect,x=>typeof x==='string'&&validIgcseIds.has(x)).map(x=>['igcse',x]),
    ...uniqueValid(passed,x=>typeof x==='string'&&/^g(?:[0-9]|1[0-5])$/.test(x)).map(x=>['checkpoint',Number(x.slice(1))]),
    ...uniqueValid(completedRooms,x=>typeof x==='string'&&/^[A-Z]{6}$/.test(x)).map(x=>['team',x])
  ];
}
export function itemBonus(equipped,slot){
  const x=validItems.get(equipped?.[slot]);
  return x&&x.slot===slot?x.bonus:0;
}
export function coinsFor(type,gear={}){
  const base={lesson:10,quest:20,quiz:3,igcse:3,checkpoint:15,team:15}[type];
  const coinSlot={lesson:'body',quest:'back',checkpoint:'aura',team:'hands'}[type];
  if(base===undefined)throw Error('Unsupported reward');
  return Math.round(base*(1+(coinSlot?itemBonus(gear,coinSlot):0)/100));
}
export function calculateRewards(wallet,eligible,maxClaims=2000){
  const claims=new Set(wallet.claimed||[]),breakdown={lesson:0,quest:0,quiz:0,igcse:0,checkpoint:0,team:0};
  let coins=wallet.coins,bonusXp=wallet.bonusXp||0,newClaims=0;
  for(const [type,id] of eligible){
    const token=`${type}:${id}`;
    if(claims.has(token)||claims.size>=maxClaims)continue;
    if(type==='team'&&[...claims].some(claim=>claim.startsWith('team:')))continue;
    const value=coinsFor(type,wallet.equipped||{});
    if(coins+value>1_000_000)break;
    coins+=value;breakdown[type]+=value;newClaims++;claims.add(token);
    if(type==='lesson'||type==='quest')bonusXp+=Math.round((type==='lesson'?50:120)*itemBonus(wallet.equipped,'legs')/100);
  }
  return {coins,added:coins-wallet.coins,bonusXp,newClaims,breakdown,claimed:[...claims]};
}

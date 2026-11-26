export const defaults=()=>({version:1,prefs:{tier:'extended',paper:6,year:2028,date:'',minutes:25,theme:'light'},read:{},notes:{},bookmarks:{},attempts:[],reviews:{},mistakes:{},custom:[],tasks:[],last:null});
export const KEY='fresh-biology-v1';
export function valid(s){return s&&s.version===1&&['core','extended'].includes(s.prefs?.tier)&&['light','dark'].includes(s.prefs?.theme)&&[5,6].includes(s.prefs?.paper)&&Number.isFinite(s.prefs?.minutes)&&['read','notes','bookmarks','reviews','mistakes'].every(k=>s[k]&&typeof s[k]==='object'&&!Array.isArray(s[k]))&&['attempts','custom','tasks'].every(k=>Array.isArray(s[k]));}
// The host can inject a storage adapter; only Biology's key is read or written.
export function createBiologyStore({storage,key=KEY}={}){
  let error='';
  const backend=()=>storage??globalThis.localStorage;
  return {
    get error(){return error},
    load(){try{const raw=backend().getItem(key);if(!raw)return defaults();const data=JSON.parse(raw);if(!valid(data))throw Error('Invalid Biology profile');return data}catch(e){error='Could not load saved Biology profile: '+e.message;return defaults()}},
    save(data){try{backend().setItem(key,JSON.stringify(data));error='';return true}catch(e){error='Saving failed. Export your Biology progress before leaving.';return false}}
  };
}
export function schedule(prev,rating,now=Date.now()){const old=Math.max(1,prev?.days||1);const days=rating==='Again'?0:Math.min(180,Math.max(rating==='Hard'?1:rating==='Good'?2:4,Math.round(old*({Hard:1.2,Good:2,Easy:3}[rating]||1))));return {days,due:now+(days?days*86400000:600000),rating,repetitions:(prev?.repetitions||0)+1,history:[...(prev?.history||[]),{rating,at:now}]}}
export function mark(q,a){if(a==null||String(a).trim()==='')return 0;if(q.type==='mcq')return a===q.correct?q.max:0;if(q.type==='numeric')return Number.isFinite(Number(a))&&Math.abs(Number(a)-q.correct)<=q.tolerance?q.max:0;return null}
export function accuracy(attempts){let earned=0,possible=0,pending=0;for(const a of attempts.filter(a=>a.submitted)){for(const q of a.items){const m=a.marks[q.id];if(m==null){pending+=q.max;continue}earned+=m;possible+=q.max}}return {earned,possible,pending,percent:possible?Math.round(earned/possible*100):null}}
export const eligible=(item,prefs)=>prefs.tier==='extended'||item.tier!=='supplement';
export function mistakes(s,a){for(const q of a.items){const m=a.marks[q.id],old=s.mistakes[q.id];if((m!==null&&m<q.max)||a.flags.includes(q.id)){s.mistakes[q.id]={...old,id:q.id,history:[...new Set([...(old?.history||[]),a.id])],resolved:false,last:Date.now()}}else if(old&&m===q.max&&!old.history.includes(a.id)){old.resolved=true;old.resolvedAt=Date.now()}}}

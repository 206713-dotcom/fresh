// Biology-only hash router. Preserve the old public deep links.
const legacy={'#topic-1':'/topics/t03','#topic-2':'/topics/t06','#topic-3':'/topics/t17'};
export function createRouter(win){
 let current='/';
 const read=()=>{const h=win.location.hash;if(h.startsWith('#/'))return h.slice(1);if(h in legacy)return legacy[h];if(!h)return '/';return current};
 current=read();
 return {getPath:()=>current,href:p=>'#'+p,navigate(p){if(typeof p!=='string'||!p.startsWith('/'))throw Error('Invalid Biology route');if(win.location.hash!=='#'+p)win.location.hash='#'+p;},subscribe(fn){const onHash=()=>{const next=read();if(next===current)return;current=next;fn();};win.addEventListener('hashchange',onHash);return ()=>win.removeEventListener('hashchange',onHash)}};
}
export function createLessonReward(getWallet){
 return async lessonId=>{if(typeof lessonId!=='string'||!/^lesson-[a-z0-9-]+$/.test(lessonId))return false;const wallet=getWallet();if(!wallet?.earn)return false;return wallet.earn('Biology',5,'Revision lesson completed','lesson:'+lessonId)};
}

import {mountBiology} from './src/index.js?v=balanced';
import {createRouter,createLessonReward} from './bridge.js?v=balanced';
const host=document.querySelector('#biology-section');
const loading=document.querySelector('#biology-loading');
try {
 const bio=mountBiology(host,{router:createRouter(window),localNavigation:true,localHeader:true,onLessonCompleted:createLessonReward(()=>window.FreshPoints),
   onPracticeCorrect: id => window.FreshPoints?.earn('Biology',3,'Correct practice answer','question:'+id),
   onCardRecalled: id => window.FreshPoints?.earn('Biology',2,'Flashcard recalled','flashcard:'+id)});
 loading?.remove();
 window.addEventListener('pagehide',e=>{if(!e.persisted)bio.unmount()});
} catch(error) {if(loading)loading.textContent='Biology could not load. Refresh or return to All subjects.';console.error(error);}

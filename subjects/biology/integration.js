import {mountBiology} from './src/index.js';
import {createRouter,createLessonReward} from './bridge.js';
const host=document.querySelector('#biology-section');
const loading=document.querySelector('#biology-loading');
try {
 const bio=mountBiology(host,{router:createRouter(window),localNavigation:true,localHeader:true,onLessonCompleted:createLessonReward(()=>window.FreshPoints)});
 loading?.remove();
 window.addEventListener('pagehide',e=>{if(!e.persisted)bio.unmount()});
} catch(error) {if(loading)loading.textContent='Biology could not load. Refresh or return to All subjects.';console.error(error);}

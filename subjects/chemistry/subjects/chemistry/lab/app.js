'use strict';
/* ===================== STATE ===================== */
let items=[],nextId=1,selId=null,showLabels=true,prevSession=null;
const listeners={};
const on=(ev,fn)=>(listeners[ev]=listeners[ev]||[]).push(fn);
const emit=(ev,p)=>(listeners[ev]||[]).forEach(f=>{try{f(p);}catch(e){console.error(e);}});
const byId=id=>items.find(i=>i.id===id);
const sel=()=>byId(selId);
const childrenOf=p=>items.filter(c=>c.mount&&c.mount.pid===p.id);
function descendants(id,set=new Set([id])){items.forEach(c=>{if(c.mount&&c.mount.pid===id&&!set.has(c.id)){set.add(c.id);descendants(c.id,set);}});return set;}
const defVariant=d=>d.variants?(d.defaultVariant||(d.variants.find(v=>v.id==='250')||d.variants[d.variants.length>1?1:0]).id):null;
function newItem(type,variant){const d=REG[type];
  return {id:'e'+(nextId++),type,variant:variant??defVariant(d),x:0,y:FLOOR,z:null,state:JSON.parse(JSON.stringify(d.defaults||{})),mount:null,
    jit:+((Math.random()-.5)*3).toFixed(2),...(d.initContents?{contents:JSON.parse(JSON.stringify(d.initContents))}:{})};}
/* where a stopper-type item plugs into a neck: offset from its bottom-centre */
function plugOf(it){const d=REG[it.type],{w,h}=dims(it);const p=typeof d.plug==='function'?d.plug(it,w,h):(d.plug||{dx:0,depth:0});return {dx:(p.dx||0)*(it.state.mirror?-1:1),depth:p.depth||0};}

function mountsWorld(p){const d=REG[p.type];if(!d.mounts)return [];const {w,h}=dims(p),mir=p.state.mirror?-1:1;
  return d.mounts(p,w,h).map((m,i)=>{const x=(m.x||0)*mir,x1=mir>0?(m.x1??0):-(m.x2??0),x2=mir>0?(m.x2??0):-(m.x1??0);
    return {...m,i,off:(p.state.flip&&m.type==='neck'),wx:p.x+x,wy:p.y-m.y,wx1:p.x+x1,wx2:p.x+x2};});}
const mountOf=c=>{const p=byId(c.mount.pid);return p?mountsWorld(p)[c.mount.mi]:null;};
const occupied=(pid,mi,self)=>items.some(c=>c.id!==self&&c.mount&&c.mount.pid===pid&&c.mount.mi===mi);
const accepts=(m,it)=>!m.accepts||m.accepts.some(t=>(REG[it.type].tags||[]).includes(t));

function layout(){const done=new Set();
  const place=it=>{if(done.has(it.id))return;done.add(it.id);if(!it.mount)return;
    const p=byId(it.mount.pid);if(!p){it.mount=null;return;}place(p);
    const m=mountsWorld(p)[it.mount.mi];if(!m){it.mount=null;return;}
    if(m.type==='surface'){it.x=p.x+Math.max(m.x1??0,Math.min(m.x2??0,it.mount.dx));it.y=m.wy;}
    else if(m.type==='slot'){it.x=m.wx;it.y=m.wy;}
    else if(m.type==='clamp'){it.x=m.wx;it.y=m.wy+it.mount.dy;}
    else if(m.type==='neck'){const pl=plugOf(it);it.x=m.wx-pl.dx;it.y=m.wy+pl.depth;}};
  items.forEach(place);}

function findSnap(it){const {h}=dims(it),ex=descendants(it.id);let best=null;
  for(const p of items){if(ex.has(p.id))continue;
    for(const m of mountsWorld(p)){if(m.off||!accepts(m,it))continue;let score=Infinity,pose=null;
      if(m.type==='surface'){if(it.x>=m.wx1&&it.x<=m.wx2){const dy=Math.abs(it.y-m.wy);if(dy<28){score=dy;pose={x:it.x,y:m.wy,mount:{pid:p.id,mi:m.i,dx:it.x-p.x,dy:0}};}}}
      else if(m.type==='slot'){if(occupied(p.id,m.i,it.id))continue;const dx=Math.abs(it.x-m.wx);
        if(dx<20&&it.y>m.wy-70&&it.y<m.wy+30){score=dx+Math.abs(it.y-m.wy)*0.15;pose={x:m.wx,y:m.wy,mount:{pid:p.id,mi:m.i,dx:0,dy:0}};}}
      else if(m.type==='clamp'){if(occupied(p.id,m.i,it.id))continue;const dx=Math.abs(it.x-m.wx);
        if(dx<26&&m.wy>it.y-h+6&&m.wy<it.y-6){score=dx;pose={x:m.wx,y:it.y,mount:{pid:p.id,mi:m.i,dx:0,dy:it.y-m.wy}};}}
      else if(m.type==='neck'){if(occupied(p.id,m.i,it.id))continue;const pl=plugOf(it),dd=Math.hypot(it.x+pl.dx-m.wx,it.y-(m.wy+pl.depth));
        if(dd<32){score=dd*0.8;pose={x:m.wx-pl.dx,y:m.wy+pl.depth,mount:{pid:p.id,mi:m.i,dx:0,dy:0}};}}
      if(pose&&score<(best?best.score:Infinity))best={score,pose,m};}}
  return best;}
/* free space: no gravity — an item stays where it is dropped unless it snaps to a mount */
function settle(it){const s=findSnap(it);if(s)Object.assign(it,s.pose);else it.mount=null;layout();}

/* mass & context passed to draw functions */
const baseMass=it=>{const d=REG[it.type],v=variantOf(it);return (d.massFn?d.massFn(it):(v?.mass??d.mass??0))+(it.jit||0)+contentsMass(it);};
const totalMass=it=>baseMass(it)+childrenOf(it).reduce((s,c)=>s+totalMass(c),0);
const loadOn=it=>childrenOf(it).reduce((s,c)=>s+totalMass(c),0);
const ctx={
  grip:it=>{const c=items.find(k=>k.mount&&k.mount.pid===it.id);return c?dims(c).w:12;},
  loadOn, childrenOf,
  balanceText:it=>{const g=loadOn(it);if(g>620)return 'OL';const v=g-(it.state.tare||0);return (Math.abs(v)<0.005?0:v).toFixed(2)+' g';}
};
ctx.phAt=it=>{const tip={x:it.x,y:it.y-9};for(const c of items){if(c===it||!isContainer(c))continue;const {w,h}=dims(c);
  if(Math.abs(tip.x-c.x)<w/2-2&&tip.y<c.y&&tip.y>c.y-h){const A=analyse(c);if(A.pH!=null&&tip.y>liquidTopWorld(c))return A.pH;}}return null;};
const iconCtx={grip:()=>12,loadOn:()=>0,childrenOf:()=>[],balanceText:()=>'0.00 g',phAt:()=>null};

/* ===================== HISTORY & STORAGE ===================== */
const KEY='chemlab.bench.v1';
const serialize=()=>JSON.stringify({items,nextId});
let past=[],future=[],last=null;
function restore(json){try{const o=JSON.parse(json);
  items=(o.items||[]).filter(i=>REG[i.type]).map(i=>({...i,state:{...JSON.parse(JSON.stringify(REG[i.type].defaults||{})),...(i.state||{})}}));
  nextId=Math.max(o.nextId||1,...items.map(i=>+String(i.id).slice(1)+1||1));
  if(!byId(selId))selId=null;layout();}catch(e){console.error(e);}}
function commit(){const s=serialize();if(s===last)return;if(last!==null){past.push(last);if(past.length>120)past.shift();}last=s;future=[];
  try{localStorage.setItem(KEY,s);}catch(e){}updateHistoryBtns();emit('change',items);}
function undo(){if(!past.length)return;future.push(last);last=past.pop();restore(last);persist();renderAll();}
function redo(){if(!future.length)return;past.push(last);last=future.pop();restore(last);persist();renderAll();}
const persist=()=>{try{localStorage.setItem(KEY,last);}catch(e){}updateHistoryBtns();};
function updateHistoryBtns(){$('#bUndo').disabled=!past.length;$('#bRedo').disabled=!future.length;}

/* ===================== VIEW ===================== */
const svg=$('#stage');
let view={x:0,y:0,s:1},fitted=false;
const vw=()=>svg.clientWidth||1,vh=()=>svg.clientHeight||1;
function applyView(){svg.setAttribute('viewBox',`${view.x} ${view.y} ${vw()/view.s} ${vh()/view.s}`);$('#zoomv').textContent=Math.round(view.s*100)+'%';updateGrid();renderLabels();}
function bbox(){if(!items.length)return {x0:0,x1:1000,y0:200,y1:700};let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;
  items.forEach(it=>{const {w,h}=dims(it);x0=Math.min(x0,it.x-w/2);x1=Math.max(x1,it.x+w/2);y0=Math.min(y0,it.y-h-(it.type==='bunsen'&&it.state.lit?60:0));y1=Math.max(y1,it.y);});
  return {x0:x0-60,x1:x1+60,y0:y0-60,y1:y1+70};}
function fit(){const b=bbox(),bw=Math.max(b.x1-b.x0,520),bh=b.y1-b.y0;
  let s=Math.min(vw()/bw,vh()/bh);if(vw()<640)s=Math.max(s,Math.min(vh()/bh,0.6));view.s=Math.max(0.08,Math.min(2.2,s));
  const W=vw()/view.s,H=vh()/view.s;view.x=W>=bw?(b.x0+b.x1)/2-W/2:b.x0;view.y=(b.y0+b.y1)/2-H/2;applyView();}
function zoomAt(f,px=vw()/2,py=vh()/2){const s2=Math.max(0.08,Math.min(6,view.s*f));const wx=view.x+px/view.s,wy=view.y+py/view.s;view.s=s2;view.x=wx-px/s2;view.y=wy-py/s2;applyView();}
function toWorld(e){const r=svg.getBoundingClientRect();return {x:view.x+(e.clientX-r.left)/view.s,y:view.y+(e.clientY-r.top)/view.s};}

/* ===================== RENDER ===================== */
$('#lBg').innerHTML=`<defs><pattern id="dots" patternUnits="userSpaceOnUse" width="40" height="40"><circle class="dotc" id="dotc" cx="20" cy="20" r="1.2"/></pattern></defs>
  <rect class="canvas-bg" id="bgRect"/><rect id="dotRect" fill="url(#dots)"/>`;
let showGrid=true;
function updateGrid(){const W=vw()/view.s,H=vh()/view.s,sp=view.s<0.18?400:view.s<0.45?200:40;
  ['bgRect','dotRect'].forEach(id=>{const r=document.getElementById(id);r.setAttribute('x',view.x-10);r.setAttribute('y',view.y-10);r.setAttribute('width',W+20);r.setAttribute('height',H+20);});
  const pat=document.getElementById('dots');pat.setAttribute('width',sp);pat.setAttribute('height',sp);
  const c=document.getElementById('dotc');c.setAttribute('cx',sp/2);c.setAttribute('cy',sp/2);c.setAttribute('r',(1.3/view.s).toFixed(2));
  document.getElementById('dotRect').style.display=showGrid?'':'none';}

function liquidSVG(it,w,h){const d=REG[it.type];if(!d.liquid||!(it.fill>0))return '';const L=d.liquid(w,h),top=L.bottom-(L.bottom-L.top)*Math.min(1,it.fill);
  return `<clipPath id="lq-${it.id}"><rect x="-5" y="${top}" width="${w+10}" height="${h}"/></clipPath><path class="g-liquid" d="${L.d}" clip-path="url(#lq-${it.id})" style="fill:${it.liquidColor||'var(--glass-edge)'}"/>`;}
function artOf(it){const d=REG[it.type],{w,h}=dims(it);
  const tr=it.state.flip?`translate(${w} ${h}) scale(-1 -1)`:it.state.mirror?`translate(${w} 0) scale(-1 1)`:'';
  if(tr)return `<rect class="hit" x="-5" y="-5" width="${w+10}" height="${h+10}"/><g transform="${tr}">`+d.draw(w,h,it,ctx)+'</g>';
  return `<rect class="hit" x="-5" y="-5" width="${w+10}" height="${h+10}"/>`+contentsSVG(it,w,h)+d.draw(w,h,it,ctx);}
const tf=it=>{const {w,h}=dims(it);return `translate(${(it.x-w/2).toFixed(2)}px,${(it.y-h).toFixed(2)}px)`;};
const zOf=it=>it.z??REG[it.type].z??5;
function renderOrder(){const out=[],byZ=(a,b)=>zOf(a)-zOf(b);
  const visit=it=>{const kids=childrenOf(it).sort(byZ),behind=kids.filter(k=>mountOf(k)?.behind);behind.forEach(visit);out.push(it);kids.filter(k=>!behind.includes(k)).forEach(visit);};
  items.filter(i=>!i.mount).sort(byZ).forEach(visit);return out;}

const nodes=new Map(),artCache=new Map();
function renderStage(){layout();const layer=$('#lItems'),order=renderOrder(),keep=new Set(order.map(i=>i.id));
  for(const [id,g] of nodes)if(!keep.has(id)){g.remove();nodes.delete(id);artCache.delete(id);}
  order.forEach(it=>{let g=nodes.get(it.id);
    if(!g){g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('class','it');g.dataset.id=it.id;g.style.transform=tf(it);nodes.set(it.id,g);}
    const a=artOf(it);if(artCache.get(it.id)!==a){g.innerHTML=a;artCache.set(it.id,a);}
    g.style.transform=tf(it);});
  const cur=[...layer.children];if(cur.length!==order.length||order.some((it,i)=>cur[i]!==nodes.get(it.id)))order.forEach(it=>layer.appendChild(nodes.get(it.id)));
  renderOverlay();renderLabels();$('#empty').hidden=items.length>0;}
function updatePositions(){layout();items.forEach(it=>{const g=nodes.get(it.id);if(g)g.style.transform=tf(it);});renderOverlay();renderLabels();}
let snapPreview=null,pourTarget=null;
function renderOverlay(){let s='';const it=sel();
  if(it){const {w,h}=dims(it);s+=`<rect class="sel-box" x="${it.x-w/2-6}" y="${it.y-h-6}" width="${w+12}" height="${h+12}" rx="6"/>`;}
  if(pourTarget){const {w,h}=dims(pourTarget),C=CHEM[drag?.it?.state?.chem];
    s+=`<rect class="sel-box" style="stroke-dasharray:none;stroke-width:2.5" x="${pourTarget.x-w/2-8}" y="${pourTarget.y-h-8}" width="${w+16}" height="${h+16}" rx="8"/>`;
    if(C)s+=`<text class="lbl on" style="font-size:${Math.max(10,12/view.s).toFixed(1)}px" x="${pourTarget.x}" y="${pourTarget.y-h-14}" text-anchor="middle">Add ${esc(fmtAmt(C,drag.it.state.pour))}</text>`;}
  if(snapPreview){const m=snapPreview.m;
    if(m.type==='surface')s+=`<line class="snap-line" x1="${m.wx1}" y1="${m.wy}" x2="${m.wx2}" y2="${m.wy}"/>`;
    else s+=`<circle class="snap-dot" cx="${m.wx}" cy="${m.wy}" r="6"/>`;}
  $('#lOver').innerHTML=s;}
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
function renderLabels(){if(!showLabels){$('#lLabels').innerHTML='';return;}let s='';const fs=Math.max(10,12/view.s).toFixed(1);
  items.forEach(it=>{const {w,h}=dims(it),c=it.id===selId?' on':'';
    if(!it.mount)s+=`<text class="lbl${c}" style="font-size:${fs}px" x="${it.x}" y="${it.y+fs*1.5}" text-anchor="middle">${esc(nameOf(it))}</text>`;
    else if(mountOf(it)?.type!=='slot'||c)s+=`<text class="lbl${c}" style="font-size:${fs}px" x="${it.x+w/2+6}" y="${it.y-h/2+4}">${esc(nameOf(it))}</text>`;});
  $('#lLabels').innerHTML=s;}

/* ===================== SHELF ===================== */
function iconSVG(type,it){const d=REG[type],fake=it||{id:'icon',type,variant:null,state:JSON.parse(JSON.stringify(d.defaults||{}))};
  if(!it&&d.variants)fake.variant=defVariant(d);const {w,h}=dims(fake),p=6;
  const tr=fake.state.flip?`translate(${w} ${h}) scale(-1 -1)`:fake.state.mirror?`translate(${w} 0) scale(-1 1)`:'';
  return `<svg viewBox="${-p} ${-p} ${w+2*p} ${h+2*p}" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><g transform="${tr}">${d.draw(w,h,fake,iconCtx)}</g></svg>`;}
const newItemVariant=d=>(d.variants.find(v=>v.id==='250')||d.variants[d.variants.length>1?1:0]).id;
let collapsed=new Set();try{collapsed=new Set(JSON.parse(localStorage.getItem('chemlab.shelf.collapsed')||'[]'));}catch(e){}
let shelfTab='equip';
function chemIcon(C){const k=bottleKind(C),{w,h}=BOTTLE[k],p=4;return `<svg viewBox="${-p} ${-p} ${w+2*p} ${h+2*p}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${bottleSVG(C,w,h,'i'+C.id)}</svg>`;}
function renderChemShelf(q){let s='';
  CHEM_CATS.forEach(([cid,cname])=>{const list=CHEM_ORDER.filter(id=>CHEM[id].cat===cid&&(!q||(CHEM[id].n+' '+CHEM[id].f).toLowerCase().includes(q)));if(!list.length)return;
    const key='c-'+cid,col=!q&&collapsed.has(key);
    s+=`<div class="cat${col?' collapsed':''}"><button class="cath" type="button" data-cat="${key}" aria-expanded="${!col}">${cname}<span class="n">${list.length}</span></button><div class="cards">${list.map(id=>{const C=CHEM[id];
      return `<button class="card chem" type="button" data-chem="${id}" title="${esc(C.n)}">${chemIcon(C)}<span>${esc(C.n)}</span><small>${esc(C.f)}${C.st!=='aq'?'':' (aq)'}</small></button>`;}).join('')}</div></div>`;});
  $('#shelf').innerHTML=s||`<p class="noresult">No chemical matches "${esc(q)}".</p>`;}
function renderShelf(q=''){q=q.trim().toLowerCase();let s='';if(shelfTab==='chem')return renderChemShelf(q);
  CATS.forEach(([cid,cname])=>{const list=ORDER.filter(id=>REG[id].cat===cid&&(!q||REG[id].name.toLowerCase().includes(q)));if(!list.length)return;
    const col=!q&&collapsed.has(cid);
    s+=`<div class="cat${col?' collapsed':''}"><button class="cath" type="button" data-cat="${cid}" aria-expanded="${!col}">${cname}<span class="n">${list.length}</span></button><div class="cards">${list.map(id=>`<button class="card" type="button" data-type="${id}" title="Add ${esc(REG[id].name)}">${iconSVG(id)}<span>${esc(REG[id].name)}</span></button>`).join('')}</div></div>`;});
  $('#shelf').innerHTML=s||`<p class="noresult">No equipment matches "${esc(q)}".</p>`;}

function freeSpot(w,h){const cx=view.x+vw()/view.s/2,cy=view.y+vh()/view.s/2+h/2;
  const free=(x,y)=>items.every(o=>{const d=dims(o);return Math.abs(x-o.x)>(w+d.w)/2+16||Math.abs((y-h/2)-(o.y-d.h/2))>(h+d.h)/2+16;});
  for(let r=0;r<=1600;r+=24){const n=r?Math.max(8,Math.round(r/12)):1;
    for(let k=0;k<n;k++){const a=k/n*Math.PI*2,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r*0.6;if(free(x,y))return {x,y};}}
  return {x:cx,y:cy};}
function addItem(type,at,init){const it=newItem(type);if(init)init(it);const {w,h}=dims(it);
  if(at){it.x=at.x;it.y=at.y+h/2;items.push(it);settle(it);}
  else{Object.assign(it,freeSpot(w,h));items.push(it);layout();}
  selId=it.id;commit();renderAll();return it;}

/* palette drag */
let pdrag=null,suppressClick=false;
$('#shelf').addEventListener('pointerdown',e=>{const c=e.target.closest('.card');if(!c||e.button>0)return;pdrag={type:c.dataset.type,chem:c.dataset.chem,x0:e.clientX,y0:e.clientY,ghost:null};});
const placeChem=(id,at)=>addItem('reagent',at,it=>{it.state.chem=id;it.state.pour=defPour(CHEM[id]);});
window.addEventListener('pointermove',e=>{if(!pdrag)return;
  if(!pdrag.ghost&&Math.hypot(e.clientX-pdrag.x0,e.clientY-pdrag.y0)>6){pdrag.ghost=document.createElement('div');pdrag.ghost.className='ghost';pdrag.ghost.innerHTML=pdrag.chem?chemIcon(CHEM[pdrag.chem]):iconSVG(pdrag.type);document.body.appendChild(pdrag.ghost);}
  if(pdrag.ghost){pdrag.ghost.style.left=e.clientX+'px';pdrag.ghost.style.top=e.clientY+'px';$('#bin').classList.add('ready');$('#bin').classList.toggle('hot',overBin(e));}});
window.addEventListener('pointerup',e=>{if(!pdrag)return;const d=pdrag;pdrag=null;if(!d.ghost)return;d.ghost.remove();suppressClick=true;setTimeout(()=>suppressClick=false,0);
  $('#bin').classList.remove('hot','ready');if(overBin(e))return;
  const r=svg.getBoundingClientRect();if(!(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom))return;
  if(d.chem){const c=containerAt(toWorld(e));if(c){if(pourChem(c,d.chem,defPour(CHEM[d.chem])))commit();renderAll();}else placeChem(d.chem,toWorld(e));return;}
  addItem(d.type,toWorld(e));});
window.addEventListener('pointercancel',()=>{if(pdrag?.ghost)pdrag.ghost.remove();pdrag=null;});
$('#shelf').addEventListener('click',e=>{const h=e.target.closest('.cath');
  if(h){const c=h.dataset.cat;collapsed.has(c)?collapsed.delete(c):collapsed.add(c);try{localStorage.setItem('chemlab.shelf.collapsed',JSON.stringify([...collapsed]));}catch(_){}
    h.parentElement.classList.toggle('collapsed');h.setAttribute('aria-expanded',!collapsed.has(c));return;}
  const c=e.target.closest('.card');if(!c||suppressClick)return;
  if(c.dataset.chem){const s0=sel();if(s0&&isContainer(s0)){if(pourChem(s0,c.dataset.chem,defPour(CHEM[c.dataset.chem])))commit();renderAll();}else placeChem(c.dataset.chem);return;}
  addItem(c.dataset.type);});
$('#search').addEventListener('input',e=>renderShelf(e.target.value));
function setTab(t){shelfTab=t;$('#tabEq').setAttribute('aria-selected',t==='equip');$('#tabCh').setAttribute('aria-selected',t==='chem');
  $('#search').placeholder=t==='chem'?'Search chemicals (name or formula)':'Search equipment';$('#shelfnote').hidden=t!=='chem';renderShelf($('#search').value);}
$('#tabEq').onclick=()=>setTab('equip');$('#tabCh').onclick=()=>setTab('chem');

/* ===================== STAGE INTERACTION ===================== */
let drag=null,pan=null,pinch=null;const pts=new Map();
function overBin(e){const r=$('#bin').getBoundingClientRect();return e.clientX>=r.left-10&&e.clientX<=r.right+10&&e.clientY>=r.top-10&&e.clientY<=r.bottom+10;}
svg.addEventListener('pointerdown',e=>{pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pts.size===2){ // two fingers: pinch-zoom (cancel any drag in progress)
    if(drag&&drag.moved){drag.it.x=drag.sx;drag.it.y=drag.sy;drag.it.mount=drag.smount;}
    drag=null;pan=null;snapPreview=null;svg.classList.remove('dragging','panning','over-bin');$('#bin').classList.remove('ready','hot');
    const [a,b]=[...pts.values()],r=svg.getBoundingClientRect();
    pinch={d0:Math.hypot(a.x-b.x,a.y-b.y),s0:view.s,mx:(a.x+b.x)/2-r.left,my:(a.y+b.y)/2-r.top,vx:view.x,vy:view.y};renderAll();return;}
  if(e.button>0&&e.button!==1)return;svg.focus({preventScroll:true});const g=e.button===1?null:e.target.closest('.it'),p=toWorld(e);
  try{svg.setPointerCapture(e.pointerId);}catch(_){}
  if(g){const it=byId(g.dataset.id);selId=it.id;drag={it,ox:p.x-it.x,oy:p.y-it.y,x0:e.clientX,y0:e.clientY,moved:false,sx:it.x,sy:it.y,smount:it.mount};renderOverlay();renderLabels();renderInspector();}
  else pan={x0:e.clientX,y0:e.clientY,vx:view.x,vy:view.y,moved:false};});
svg.addEventListener('pointermove',e=>{
  if(pts.has(e.pointerId))pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pinch&&pts.size>=2){const [a,b]=[...pts.values()],r=svg.getBoundingClientRect(),d=Math.hypot(a.x-b.x,a.y-b.y);
    const mx=(a.x+b.x)/2-r.left,my=(a.y+b.y)/2-r.top,s2=Math.max(0.08,Math.min(6,pinch.s0*d/pinch.d0));
    const wx=pinch.vx+pinch.mx/pinch.s0,wy=pinch.vy+pinch.my/pinch.s0;view.s=s2;view.x=wx-mx/s2;view.y=wy-my/s2;applyView();return;}
  if(drag){if(!drag.moved&&Math.hypot(e.clientX-drag.x0,e.clientY-drag.y0)<3)return;
    if(!drag.moved){drag.moved=true;drag.it.mount=null;svg.classList.add('dragging');$('#bin').classList.add('ready');
      descendants(drag.it.id).forEach(id=>nodes.get(id)?.classList.add('dragged'));}
    const p=toWorld(e);drag.it.x=p.x-drag.ox;drag.it.y=p.y-drag.oy;
    const ob=overBin(e);$('#bin').classList.toggle('hot',ob);svg.classList.toggle('over-bin',ob);
    if(drag.it.type==='reagent'){pourTarget=ob?null:containerAt(toWorld(e),drag.it);snapPreview=null;}else snapPreview=ob?null:findSnap(drag.it);updatePositions();}
  else if(pan){const dx=e.clientX-pan.x0,dy=e.clientY-pan.y0;if(Math.hypot(dx,dy)>3){pan.moved=true;svg.classList.add('panning');}
    view.x=pan.vx-dx/view.s;view.y=pan.vy-dy/view.s;applyView();}});
function endPointer(e){pts.delete(e.pointerId);
  if(pinch){if(pts.size<2)pinch=null;return;}
  if(drag){const ob=drag.moved&&overBin(e);
    if(ob)removeGroup(drag.it);
    else if(drag.moved&&drag.it.type==='reagent'&&pourTarget){const t=pourTarget;drag.it.x=drag.sx;drag.it.y=drag.sy;drag.it.mount=drag.smount;
      pourChem(t,drag.it.state.chem,drag.it.state.pour);selId=t.id;commit();}
    else if(drag.moved){if(drag.it.type==='reagent')drag.it.mount=null;else settle(drag.it);commit();}
    pourTarget=null;
    nodes.forEach(g=>g.classList.remove('dragged'));drag=null;snapPreview=null;svg.classList.remove('dragging','over-bin');$('#bin').classList.remove('ready','hot');renderAll();}
  else if(pan){if(!pan.moved){selId=null;renderAll();}pan=null;svg.classList.remove('panning');}}
svg.addEventListener('pointerup',endPointer);svg.addEventListener('pointercancel',endPointer);
svg.addEventListener('wheel',e=>{e.preventDefault();const r=svg.getBoundingClientRect();
  // pinch on a trackpad arrives as ctrl+wheel; a mouse wheel gives whole-line steps; a trackpad swipe pans
  const mouseWheel=e.deltaMode===1||(e.deltaX===0&&Number.isInteger(e.deltaY)&&Math.abs(e.deltaY)>=40);
  if(e.ctrlKey||e.metaKey||mouseWheel){const k=e.deltaMode===1?0.05:(e.ctrlKey?0.012:0.0022);zoomAt(Math.exp(-e.deltaY*k),e.clientX-r.left,e.clientY-r.top);}
  else{view.x+=e.deltaX/view.s;view.y+=e.deltaY/view.s;applyView();}},{passive:false});

/* ===================== ACTIONS ===================== */
function removeItem(it){const kids=childrenOf(it);items=items.filter(i=>i.id!==it.id);
  kids.forEach(k=>{k.mount=null;});layout();if(selId===it.id)selId=null;commit();renderAll();}
function removeGroup(it){const ids=descendants(it.id);items=items.filter(i=>!ids.has(i.id));if(ids.has(selId))selId=null;layout();commit();}
function duplicate(it){const c=newItem(it.type,it.variant);c.state=JSON.parse(JSON.stringify(it.state));delete c.state.tare;
  const {w,h}=dims(c);c.x=it.x+w+24;c.y=it.y;const f=freeSpot(w,h);if(items.some(o=>Math.abs(o.x-c.x)<w&&Math.abs(o.y-c.y)<h))Object.assign(c,f);
  items.push(c);layout();selId=c.id;commit();renderAll();}
function detach(it){if(!it.mount)return;const {w}=dims(it);it.mount=null;it.x+=w/2+40;layout();commit();renderAll();}
function restack(it,front){const zs=items.map(zOf);it.z=front?Math.max(...zs)+1:Math.min(...zs)-1;commit();renderAll();}
function nudge(it,dx,dy){if(it.mount){const m=mountOf(it);if(m?.type==='surface')it.mount.dx+=dx;else if(m?.type==='clamp')it.mount.dy+=dy;else return;}else{it.x+=dx;it.y+=dy;}layout();commit();renderAll();}

/* ===================== INSPECTOR ===================== */
let pourAmt=10;
function phBlock(pH){return `<div class="phbig"><b>${pH.toFixed(1)}</b><div class="phbar"><i style="left:${(pH/14*100).toFixed(1)}%"></i></div></div>`;}
function contentsHTML(it){const A=analyse(it),cs=it.contents||[];let h=`<div class="i-sec"><div class="i-lab">Contents</div>`;
  if(!cs.length)return h+`<p class="muted">Empty. Drag a chemical from the Chemicals tab onto it, or select it and tap a chemical.</p></div>`;
  h+=`<div class="clist">${cs.map(e=>{const C=CHEM[e.c];const dis=C.st==='s'&&A.dissolved.some(x=>x.c===e.c);
    return `<div class="crow"><span><i class="swatch" style="background:${C.ind&&A.pH!=null?(indColour(C.ind,A.pH)||'#f2f2f2'):(C.acol&&dis?C.acol:C.col)}"></i>${esc(C.n)}${C.st==='s'?(dis?' (dissolved)':''):''}</span><span>${fmtAmt(C,e.a)}</span></div>`;}).join('')}</div>`;
  h+=`<div class="crow" style="margin-top:4px"><span class="muted">Liquid volume</span><span>${A.V.toFixed(1)} cm³</span></div>`;
  if(A.Vorg>0&&A.Vaq>0)h+=`<p class="muted">Two layers: the organic liquid floats on the water layer.</p>`;
  if(A.solids.length)h+=`<p class="muted">Undissolved solid at the bottom${A.Vaq>0?' (insoluble, or it needs to react first)':''}.</p>`;
  h+='</div>';
  if(A.pH!=null){h+=`<div class="i-sec"><div class="i-lab">pH (calculated)</div>${phBlock(A.pH)}`;
    A.inds.forEach(([ind])=>{const C=CHEM_ORDER.map(k=>CHEM[k]).find(c=>c.ind===ind);h+=`<p class="muted">${esc(C.n)} is <b>${indName(ind,A.pH)}</b>.</p>`;});h+='</div>';}
  if(it.type==='burette'){const t=containerBelow(it);h+=`<div class="i-sec"><div class="i-lab">Run out of the tap</div>
    ${t?`<p class="muted">Into <b>${esc(nameOf(t))}</b> below.</p>`:`<p class="muted">Put a flask under the tap first.</p>`}
    <div class="seg">${[[0.05,'1 drop'],[0.1,'0.10 cm³'],[1,'1.00 cm³'],[5,'5.00 cm³']].map(([a,l])=>`<button type="button" class="act" data-run="${a}"${t&&A.V>0?'':' disabled'}>${l}</button>`).join('')}</div></div>`;}
  if(it.type==='sepfunnel'){const t=containerBelow(it);h+=`<div class="i-sec"><div class="i-lab">Run off the bottom layer</div>
    ${!it.state.tap?`<p class="muted">Open the tap first.</p>`:t?`<p class="muted">Into <b>${esc(nameOf(t))}</b> below.</p>`:`<p class="muted">Put a beaker or flask under the tap.</p>`}
    <div class="seg">${[[1,'1 cm³'],[5,'5 cm³'],[20,'20 cm³']].map(([a,l])=>`<button type="button" class="act" data-drain="${a}"${it.state.tap&&t&&A.V>0?'':' disabled'}>${l}</button>`).join('')}</div></div>`;}
  const others=items.filter(o=>o!==it&&isContainer(o));
  if(A.V>0){h+=`<div class="i-sec"><div class="i-lab">Pour into another container</div>
    <div class="seg">${[1,5,10,25,'all'].map(a=>`<button type="button" data-pamt="${a}" aria-pressed="${String(pourAmt)===String(a)}">${a==='all'?'All':a+' cm³'}</button>`).join('')}</div>
    ${others.length?`<div class="prow"><select class="tsel" id="pourTo">${others.map(o=>`<option value="${o.id}">${esc(nameOf(o))}</option>`).join('')}</select><button type="button" class="act" data-act2="pour">Pour</button></div>`:`<p class="muted">Put another container on the workspace to pour into it.</p>`}</div>`;}
  h+=`<div class="i-sec"><div class="acts"><button type="button" class="act del" data-act2="empty">Empty it</button></div></div>`;
  return h;}
function chemInspector(it){const C=CHEM[it.state.chem]||CHEM.water,k=bottleKind(C),cat=CHEM_CATS.find(c=>c[0]===C.cat)[1];
  let h=`<div class="i-head"><div class="i-icon">${chemIcon(C)}</div><div><div class="i-cat">Chemical · ${cat}</div><h2>${esc(C.n)}</h2></div></div>
  <div class="chem-f">${esc(C.f)}<span>(${C.st})</span></div>
  <dl class="ro"><dt>State</dt><dd>${stName[C.st]}</dd>${C.conc?`<dt>Concentration</dt><dd>${C.conc} mol/dm³</dd>`:''}${C.M&&C.cat!=='metal'?`<dt>Molar mass</dt><dd>${C.M} g/mol</dd>`:''}<dt>Looks like</dt><dd style="font-family:var(--f-ui)">${esc(C.look||'')}</dd></dl>
  <div class="i-sec"><div class="i-lab">Hazards</div><div class="chips">${(C.haz||['L']).map(z=>`<span class="hz ${z}">${HZ[z]}</span>`).join('')}</div></div>
  <div class="i-sec"><div class="i-lab">IGCSE notes</div><p>${esc(C.note)}</p></div>`;
  const cons=items.filter(isContainer);
  h+=`<div class="i-sec"><div class="i-lab">Amount to add</div><div class="seg">${POUR[k].map(([a,l])=>`<button type="button" data-cpour="${a}" aria-pressed="${it.state.pour===a}">${l}</button>`).join('')}</div>
    <div class="i-lab" style="margin-top:6px">Add to</div>${cons.length?`<div class="seg">${cons.map(c=>`<button type="button" class="act" data-addto="${c.id}">${esc(nameOf(c))}</button>`).join('')}</div>`:'<p class="muted">Put a beaker, flask or tube on the workspace first.</p>'}
    <p class="muted">Or drag this ${k==='gas'?'cylinder':k==='jar'?'jar':'bottle'} onto a container.</p></div>
  <div class="i-sec"><div class="acts"><button type="button" class="act" data-act="dup">Duplicate</button><button type="button" class="act del" data-act="del">Remove</button></div></div>`;
  return h;}
function renderInspector(){const el=$('#insp'),it=sel();
  if(!it){const n=items.length;
    el.innerHTML=`<div class="i-sec"><div class="i-lab">Workspace</div><p>${n?`${n} piece${n>1?'s':''} of equipment out.`:'Nothing out yet.'} Select something to see what it does and change its settings.</p></div>
    <div class="i-sec"><div class="i-lab">How to set up</div><ul class="howto">
      <li>Drag equipment from the shelf into the space, or tap it to place it. It stays wherever you drop it.</li>
      <li>Drop a gauze on a tripod, then a beaker on the gauze. They snap together and move as one.</li>
      <li>Drag a burette or tube onto the clamp jaws to clamp it.</li>
      <li>Tubes snap into the test-tube rack. Bungs, delivery tubes, funnels and the fractionating column snap into the necks of flasks and tubes.</li>
      <li>Turn a gas jar or tube upside down and drop it in the trough to collect gas over water.</li>
      <li>Drop anything on the bin to delete it, along with whatever it is holding.</li>
      <li>Scroll or pinch to zoom. Drag empty space to move around.</li>
      <li>Chemicals tab: drag a chemical onto a container to add it. Add an indicator to see the colour for the solution's pH.</li>
      <li>Titration: clamp a burette over a conical flask, fill it, then run it out drop by drop from the burette's panel.</li></ul></div>
    <div class="i-sec keys-sec"><div class="i-lab">Keys</div><div class="keys">
      <kbd>Del</kbd><span>Remove selected</span><kbd>Ctrl D</kbd><span>Duplicate</span><kbd>Ctrl Z</kbd><span>Undo</span>
      <kbd>Arrows</kbd><span>Nudge (Shift = more)</span><kbd>+ −</kbd><span>Zoom</span><kbd>0</kbd><span>Fit everything</span><kbd>L</kbd><span>Show or hide names</span><kbd>Esc</kbd><span>Deselect</span></div></div>`;return;}
  if(it.type==='reagent'){el.innerHTML=chemInspector(it);return;}
  const d=REG[it.type],v=variantOf(it),cat=CATS.find(c=>c[0]===d.cat)[1];
  let h=`<div class="i-head"><div class="i-icon">${iconSVG(it.type,it)}</div><div><div class="i-cat">${cat}</div><h2>${esc(nameOf(it))}</h2></div></div>`;
  if(d.orient){const cur=it.state.flip?'flip':it.state.mirror?'mirror':'normal',opts=[['normal','Normal'],...(d.orient.includes('mirror')?[['mirror','Mirrored']]:[]),...(d.orient.includes('flip')?[['flip','Upside down']]:[])];
    h+=`<div class="i-sec"><div class="i-lab">Orientation</div><div class="seg">${opts.map(([k,l])=>`<button type="button" data-orient="${k}" aria-pressed="${cur===k}">${l}</button>`).join('')}</div></div>`;}
  if(d.variants)h+=`<div class="i-sec"><div class="i-lab">${d.variantLabel||'Type'}</div><div class="seg">${d.variants.map(x=>`<button type="button" data-variant="${x.id}" aria-pressed="${x.id===v.id}">${x.label}</button>`).join('')}</div></div>`;
  (d.controls||[]).filter(c=>c.type!=='action').forEach(c=>{const val=it.state[c.key];h+=`<div class="i-sec"><div class="i-lab">${c.label}</div>`;
    if(c.type==='toggle')h+=`<div class="seg"><button type="button" class="tog" data-ctl="${c.key}" data-kind="toggle" aria-pressed="${!!val}">${val?c.on:c.off}</button></div>`;
    else if(c.type==='seg')h+=`<div class="seg">${c.options.map(([k,l])=>`<button type="button" data-ctl="${c.key}" data-kind="seg" data-val="${k}" aria-pressed="${val===k}">${l}</button>`).join('')}</div>`;
    else if(c.type==='range')h+=`<div class="rangerow"><input type="range" id="ctl-${c.key}" data-ctl="${c.key}" data-kind="range" min="${c.min}" max="${c.max}" step="${c.step}" value="${val}"><output id="out-${c.key}">${c.fmt?c.fmt(val):val+(c.unit?' '+c.unit:'')}</output></div>`;
    h+='</div>';});
  const acts=(d.controls||[]).filter(c=>c.type==='action');
  if(acts.length)h+=`<div class="i-sec"><div class="i-lab">Controls</div><div class="seg">${acts.map(c=>`<button type="button" class="act" data-ctl="${c.key}" data-kind="action">${c.labelFn?c.labelFn(it):c.label}</button>`).join('')}</div></div>`;
  if(d.readout){const ro=d.readout(it,ctx);if(ro.length)h+=`<div class="i-sec"><div class="i-lab">Readings</div><dl class="ro">${ro.map(([a,b])=>`<dt>${a}</dt><dd>${esc(b)}</dd>`).join('')}</dl></div>`;}
  if(isContainer(it)||it.type==='spirit')h+=contentsHTML(it);
  h+=`<div class="i-sec"><div class="i-lab">What it's for</div><p>${d.use}</p>${d.tip?`<p class="tip">${d.tip}</p>`:''}</div>`;
  if(it.mount){const p=byId(it.mount.pid),m=mountOf(it);h+=`<div class="i-sec"><div class="mount">${m?.type==='clamp'?'Clamped in':m?.type==='slot'?'Standing in':'Sitting on'} <b>${esc(nameOf(p))}</b><button type="button" class="act" data-act="detach">Take off</button></div></div>`;}
  const kids=childrenOf(it);if(kids.length)h+=`<div class="i-sec"><div class="mount">Holding <b>${kids.map(k=>esc(nameOf(k))).join(', ')}</b></div></div>`;
  h+=`<div class="i-sec"><div class="acts"><button type="button" class="act" data-act="dup">Duplicate</button><button type="button" class="act" data-act="front">Bring to front</button>
    <button type="button" class="act" data-act="back">Send to back</button><button type="button" class="act del" data-act="del">Remove</button></div></div>`;
  el.innerHTML=h;}
$('#insp').addEventListener('click',e=>{const it=sel();if(!it)return;const b=e.target.closest('button');if(!b||b.disabled)return;const d=REG[it.type];
  if(b.dataset.cpour){it.state.pour=+b.dataset.cpour;commit();renderInspector();return;}
  if(b.dataset.addto){const c=byId(b.dataset.addto);if(c&&pourChem(c,it.state.chem,it.state.pour)){commit();renderStage();}return;}
  if(b.dataset.pamt){pourAmt=b.dataset.pamt==='all'?'all':+b.dataset.pamt;renderInspector();return;}
  if(b.dataset.act2==='pour'){const t=byId($('#pourTo').value);if(!t)return;const v=transfer(it,t,pourAmt==='all'?1e9:pourAmt,false);
    toast(v>0?`Poured ${v.toFixed(1)} cm³ into ${nameOf(t)}`:`${nameOf(t)} is full.`);commit();renderAll();return;}
  if(b.dataset.act2==='empty'){it.contents=[];toast(`Emptied ${nameOf(it)}`);commit();renderAll();return;}
  if(b.dataset.run){const t=containerBelow(it);if(!t)return;const v=transfer(it,t,+b.dataset.run,true);if(v>0)toast(`Added ${v<0.1?'1 drop':v.toFixed(2)+' cm³'} to ${nameOf(t)}`);commit();renderAll();return;}
  if(b.dataset.drain){const t=containerBelow(it);if(!t)return;const v=transfer(it,t,+b.dataset.drain,true);if(v>0)toast(`Ran off ${v.toFixed(1)} cm³ from the bottom into ${nameOf(t)}`);commit();renderAll();return;}
  if(b.dataset.variant){it.variant=b.dataset.variant;layout();commit();renderAll();return;}
  if(b.dataset.orient){const o=b.dataset.orient;it.state.mirror=o==='mirror';it.state.flip=o==='flip';
    if(it.state.flip)childrenOf(it).forEach(c=>{if(mountOf(c)?.type==='neck')c.mount=null;});layout();commit();renderAll();return;}
  if(b.dataset.act){({dup:()=>duplicate(it),front:()=>restack(it,true),back:()=>restack(it,false),del:()=>removeItem(it),detach:()=>detach(it)})[b.dataset.act]();return;}
  const k=b.dataset.ctl;if(!k)return;
  if(b.dataset.kind==='toggle')it.state[k]=!it.state[k];
  else if(b.dataset.kind==='seg')it.state[k]=b.dataset.val;
  else if(b.dataset.kind==='action'&&d.onAction)d.onAction(it,k,ctx);
  layout();commit();renderAll();});
$('#insp').addEventListener('input',e=>{const t=e.target;if(t.dataset.kind!=='range')return;const it=sel();if(!it)return;
  const c=REG[it.type].controls.find(c=>c.key===t.dataset.ctl),v=+t.value;it.state[c.key]=v;
  $('#out-'+c.key).textContent=c.fmt?c.fmt(v):v+(c.unit?' '+c.unit:'');renderStage();
  const ro=$('#insp dl.ro');if(ro&&REG[it.type].readout)ro.innerHTML=REG[it.type].readout(it,ctx).map(([a,b])=>`<dt>${a}</dt><dd>${esc(b)}</dd>`).join('');});
$('#insp').addEventListener('change',e=>{if(e.target.dataset.kind==='range')commit();});

setInterval(()=>{if(!items.some(i=>i.type==='stopclock'&&i.state.run))return;renderStage();const it=sel();
  if(it&&it.type==='stopclock'){const ro=$('#insp dl.ro');if(ro)ro.innerHTML=REG.stopclock.readout(it).map(([a,b])=>`<dt>${a}</dt><dd>${esc(b)}</dd>`).join('');}},200);
function renderAll(){renderStage();renderInspector();$('#bRestore').hidden=!(prevSession&&!items.length);}

/* ===================== TOOLBAR & KEYS ===================== */
$('#bUndo').onclick=undo;$('#bRedo').onclick=redo;
$('#bZoomIn').onclick=()=>zoomAt(1.2);$('#bZoomOut').onclick=()=>zoomAt(1/1.2);$('#bFit').onclick=fit;
function setLabels(v){showLabels=v;$('#bLabels').setAttribute('aria-pressed',v);try{localStorage.setItem(KEY+'.labels',v?'1':'0');}catch(e){}renderLabels();}
$('#bLabels').onclick=()=>setLabels(!showLabels);
let clearArm=0;
$('#bClear').onclick=()=>{const b=$('#bClear');if(!items.length)return;
  if(!clearArm){b.textContent='Tap again to clear all';b.classList.add('warn');clearArm=setTimeout(()=>{clearArm=0;b.textContent='Clear all';b.classList.remove('warn');},2600);return;}
  clearTimeout(clearArm);clearArm=0;b.textContent='Clear all';b.classList.remove('warn');items=[];selId=null;commit();renderAll();};
$('#bExample').onclick=()=>{buildExample();commit();renderAll();fit();};
$('#bRestore').onclick=()=>{if(!prevSession)return;restore(prevSession);commit();renderAll();fit();};
$('#bin').onclick=()=>{const it=sel();if(it)removeItem(it);};
$('#bTheme').onclick=()=>{const d=document.documentElement.classList.toggle('dark');$('#bTheme').setAttribute('aria-pressed',d);};
document.addEventListener('keydown',e=>{const t=e.target;if(t.closest&&t.closest('input,textarea,select'))return;const it=sel(),mod=e.ctrlKey||e.metaKey;
  if(mod&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?redo():undo();return;}
  if(mod&&e.key.toLowerCase()==='y'){e.preventDefault();redo();return;}
  if(mod&&e.key.toLowerCase()==='d'&&it){e.preventDefault();duplicate(it);return;}
  if(mod)return;
  if((e.key==='Delete'||e.key==='Backspace')&&it){e.preventDefault();removeItem(it);}
  else if(e.key==='Escape'){selId=null;renderAll();}
  else if(e.key.startsWith('Arrow')&&it){e.preventDefault();const st=e.shiftKey?20:4;
    nudge(it,e.key==='ArrowLeft'?-st:e.key==='ArrowRight'?st:0,e.key==='ArrowUp'?-st:e.key==='ArrowDown'?st:0);}
  else if(e.key==='+'||e.key==='=')zoomAt(1.2);else if(e.key==='-'||e.key==='_')zoomAt(1/1.2);else if(e.key==='0')fit();
  else if(e.key.toLowerCase()==='l')setLabels(!showLabels);});

/* ===================== EXAMPLE SETUP ===================== */
function buildExample(){items=[];nextId=1;selId=null;
  const add=(type,x,y,o={})=>{const it=newItem(type,o.variant);it.x=x;it.y=y??FLOOR;Object.assign(it.state,o.state||{});items.push(it);layout();if(y!=null)settle(it);return it;};
  add('clamp',200,null,{state:{clampH:0.62}});add('conical',230,null,{variant:'250'});add('burette',230,505);
  add('bunsen',480,null,{state:{lit:true,air:'open'}});add('tripod',480,null);add('gauze',480,FLOOR-130);add('beaker',480,FLOOR-137,{variant:'250'});
  add('cylinder',614,null,{variant:'100'});
  add('rack',770,null);const sx=i=>770-75+22+i*26.5;add('testtube',sx(0),FLOOR-30);add('testtube',sx(2),FLOOR-30);add('boilingtube',sx(4),FLOOR-30);
  add('balance',1000,null);add('basin',1000,FLOOR-54);add('spatula',1135,null);add('washbottle',1245,null);layout();}

/* ===================== BOOT ===================== */
window.Lab={register,REG,get items(){return items},add:addItem,select:id=>{selId=id;renderAll();},render:renderAll,on,commit,layout,
  setFill(id,frac,color){const it=byId(id);if(!it)return;it.fill=frac;if(color)it.liquidColor=color;commit();renderStage();}};
function start(data){
  try{const l=localStorage.getItem(KEY+'.labels');if(l!==null)showLabels=l==='1';}catch(e){}
  $('#bLabels').setAttribute('aria-pressed',showLabels);
  // always open on an empty workspace; a previous session can be brought back from the empty state
  if(data&&data.bench)restore(data.bench);
  else{try{const p=localStorage.getItem(KEY);if(p&&JSON.parse(p).items?.length)prevSession=p;}catch(e){}}
  last=serialize();updateHistoryBtns();renderShelf();
  new ResizeObserver(()=>{if(!fitted&&vw()>10){fitted=true;fit();}else applyView();}).observe(svg);
  renderAll();if(vw()>10){fitted=true;fit();}
  window.claude?.hot?.snapshot?.(()=>({bench:serialize()}));}

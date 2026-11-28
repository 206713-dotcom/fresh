'use strict';
/* =====================================================================
   CHEM LAB BENCH — architecture notes (for future additions)
   ---------------------------------------------------------------------
   • Equipment is data-driven. Add new apparatus with Lab.register({...}):
       id, name, cat, tags[], w, h, mass, z, variants[], defaults{},
       controls[], mounts(item,w,h), draw(w,h,item,ctx), liquid(w,h),
       readout(item,ctx), use, tip
   • Items on the bench: {id,type,variant,x,y,z,state,mount,jit}
       (x,y) = bottom-centre in world units. The space is unbounded (no floor).
   • Mounts let items attach to each other:
       surface (tripod, gauze, balance pan) · slot (test-tube rack)
       clamp (clamp stand). Children move with their parent.
   • item.fill / item.liquidColor are already rendered for any def with
     liquid(w,h) — the hook for adding chemicals later.
   • Lab.on('change', fn) fires after every committed change.
   ===================================================================== */

const FLOOR=620;
const $=s=>document.querySelector(s);
const REG={},ORDER=[];
const CATS=[['contain','Containers'],['measure','Measuring'],['transfer','Transfer & handling'],['heat','Heating'],['support','Support & safety'],
  ['gas','Gases'],['separate','Separation'],['test','Testing'],['electric','Electricity']];
function register(def){ if(!def||!def.id||!def.draw) throw new Error('Equipment needs id and draw()'); REG[def.id]=def; if(!ORDER.includes(def.id)) ORDER.push(def.id); }

const fmtNum=v=>Number.isInteger(v)?String(v):String(+v.toFixed(2));
const near=(a,b)=>Math.abs(a-b)<1e-6;
function ticks(o){
  let s='';const n=Math.round((o.to-o.from)/o.minor);
  for(let i=o.zero?0:1;i<=n;i++){
    const v=o.from+i*o.minor,y=o.y0+(o.y1-o.y0)*(i/n);
    const maj=near(v/o.major,Math.round(v/o.major)),L=maj?o.lenMajor:o.len;
    s+=`<line class="g-tick" x1="${o.x}" y1="${y.toFixed(2)}" x2="${(o.x+L).toFixed(2)}" y2="${y.toFixed(2)}"/>`;
    const le=o.labelEvery??o.major;
    if(o.labels!==false&&near(v/le,Math.round(v/le))) s+=`<text class="g-num" x="${(o.labelX??o.x+L+1.4).toFixed(2)}" y="${(y+1.8).toFixed(2)}" text-anchor="${o.anchor||'start'}">${fmtNum(v)}</text>`;
  }
  return s;
}
const variantOf=it=>{const d=REG[it.type];return d.variants?(d.variants.find(v=>v.id===it.variant)||d.variants[0]):null;};
function dims(it){const d=REG[it.type];if(d.dimsFn)return d.dimsFn(it);const v=variantOf(it);return {w:v?.w??d.w,h:v?.h??d.h};}
const nameOf=it=>{const d=REG[it.type];if(d.nameFn)return d.nameFn(it);const v=variantOf(it);return d.name+(v?' '+v.label:'');};

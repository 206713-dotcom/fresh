import {investigationsC} from './investigations-c.js';
import {investigationsD} from './investigations-d.js';
import {investigationsE} from './investigations-e.js';
import {investigationsA} from './investigations-a.js';
import {investigationsB} from './investigations-b.js';
export const investigations=[...investigationsA,...investigationsB,...investigationsC,...investigationsD,...investigationsE].map(r=>{const [id,topic,title,aim,hypothesis,xLabel,yLabel,x,y,diagram,apparatus,method,controls,control,safety,observations,calculation,interpretation,limitations,question,rubric,mistake]=r;return {id,topicId:'t'+topic,title,aim,hypothesis,xLabel,yLabel,x,y,diagram,apparatus,method,controls,control,safety,observations,calculation,interpretation,limitations,question,rubric,mistake,source:'0610 2026–2028, practical assessment guidance; original teaching material; topic-specific editorial review pending'}});
export const practicalsFor=topic=>investigations.filter(m=>m.topicId===topic);
export const practicalById=id=>investigations.find(m=>m.id===id);
export const qualitative={
'food-tests':[['Iodine + starch','Blue-black'],['Benedict’s + glucose, heated','Orange / brick-red'],['Biuret + protein','Lilac'],['Ethanol emulsion + oil','Cloudy white'],['DCPIP + vitamin C','Colourless'],['Water controls','Original negative appearances']],
'ph-indicators':[['pH 3 reference','Orange / red'],['pH 7 reference','Green'],['pH 10 reference','Blue / purple'],['High CO₂ hydrogencarbonate indicator','Yellow'],['Atmospheric CO₂ indicator','Red-orange'],['Low CO₂ indicator','Purple']],
'leaf-starch':[['Exposed green area','Blue-black'],['Covered green area','Yellow-brown'],['Exposed non-green area','Yellow-brown']],
'gas-exchange':[['Ambient air, equal volume','Slight / slower cloudiness'],['Expired air, equal volume','More rapid cloudiness']],
'phototropism':[['Uniform light','Approximately upright'],['Light from left','Bends left towards source']],
'gravitropism':[['Upright','Root grows downwards'],['Rotated 90°','Root curves downwards']],
'flower':[['Anther','Pollen-bearing structure'],['Stigma','Pollen-receptive surface'],['Ovary','Contains ovules']],
'benedict':[['Water','Blue'],['Low glucose standard','Green'],['Medium glucose standard','Orange'],['High glucose standard','Brick-red'],['Unknown extract','Orange']],
'iodine':[['Water','Yellow-brown'],['Starch reference','Blue-black'],['Potato extract','Blue-black'],['Glucose reference','Yellow-brown']],
'biuret':[['Water','Blue'],['Albumin reference','Lilac'],['Bean extract','Lilac'],['Starch reference','Blue']],
'lipids':[['Water','Clear'],['Oil reference','Cloudy white'],['Nut extract','Cloudy white'],['Glucose reference','Clear']],
'vitamin-juices':[['Orange','1.5, 1.6, 1.7 → 1.6 cm³'],['Guava','0.7, 0.8, 0.9 → 0.8 cm³'],['Apple','4.0, 4.2, 4.4 → 4.2 cm³']],
'catalase':[['Untreated','12, 11, 13 → 12 cm³'],['Heated then cooled','1, 0, 2 → 1 cm³'],['No tissue','0, 0, 0 → 0 cm³']],
'chlorophyll':[['Exposed green','Blue-black'],['Exposed non-green','Yellow-brown']],
'stomata':[['Upper surface','8, 10, 9 → 45 stomata/mm²'],['Lower surface','20, 23, 23 → 110 stomata/mm²']],
'discontinuous':[['Yellow','36 seeds'],['Green','12 seeds']],
'seed':[['Seed coat','Protective covering'],['Cotyledons','Two large storage structures'],['Radicle','Embryonic root'],['Plumule','Embryonic shoot']]
};
export const mean=xs=>xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:NaN;
export function sampleMeasurement(m,index,trial=0){
 if(!m.y||!Number.isInteger(index)||index<0||index>=m.y.length)throw new RangeError('Invalid experimental condition');
 const base=m.y[index];
 // Deterministic synthetic measurements; no claim to actual biological observations.
 if(trial===0||['magnification','microscopy','variation','ecology','savr'].includes(m.id))return base;
 const factor=[1,.96,1.04,.98,1.02][trial%5];
 const decimals=m.id.startsWith('enzyme-')?4:2;
 const result=Number((base*factor).toFixed(decimals));
 return m.id==='germination'?Math.min(100,Math.max(0,Math.round(result/5)*5)):m.id==='diffusion'?Math.min(100,Math.max(0,result)):m.id==='transect'?Math.max(0,Math.round(result)):result;
}
export function summariseRecords(records){const groups=new Map();for(const r of records){if(!Number.isFinite(r.x)||!Number.isFinite(r.y))continue;const a=groups.get(r.x)||[];a.push(r.y);groups.set(r.x,a)}return [...groups].sort((a,b)=>a[0]-b[0]).map(([x,ys])=>({x,n:ys.length,y:mean(ys)}))}

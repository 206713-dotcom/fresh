'use strict';
/* ===================== EQUIPMENT ===================== */
register({id:'beaker',variantLabel:'Size',name:'Beaker',cat:'contain',tags:['surface-ok','container'],z:5,
  variants:[{id:'50',label:'50 cm³',w:44,h:54,mass:32,cap:50,minor:10,major:10},{id:'100',label:'100 cm³',w:52,h:66,mass:52,cap:100,minor:10,major:20},
            {id:'250',label:'250 cm³',w:68,h:88,mass:105,cap:250,minor:25,major:50},{id:'500',label:'500 cm³',w:86,h:112,mass:172,cap:500,minor:50,major:100}],
  draw(w,h,it){const v=variantOf(it),r=6,L=4.5,R=w-4.5,B=h-0.8;
    return `<path class="g-glass" d="M1.2,0.8 Q${L},1 ${L},4.5 L${L},${B-r} Q${L},${B} ${L+r},${B} L${R-r},${B} Q${R},${B} ${R},${B-r} L${R},1.5 L${R+1.2},0.8"/>
    <path class="g-hl" d="M${R-3.5},8 L${R-3.5},${B-8}"/>`+ticks({x:L+3,y0:B-3,y1:h*0.2,from:0,to:v.cap,minor:v.minor,major:v.major,len:3,lenMajor:6});},
  liquid(w,h){const r=6,L=5.7,R=w-5.7,B=h-2;return {d:`M${L},3 L${L},${B-r} Q${L},${B} ${L+r},${B} L${R-r},${B} Q${R},${B} ${R},${B-r} L${R},3 Z`,top:3,bottom:B};},
  readout:it=>[['Capacity',variantOf(it).label],['Volume marks','approximate only']],
  use:'Holding, mixing and gently heating liquids. Pour from the spout.',
  tip:'The marks are rough guides. Never use a beaker to measure a volume accurately.'});

function conicalGeom(w,h){const nw=w*0.34,nl=(w-nw)/2,nr=nl+nw,nh=h*0.3;return {nl,nr,nh};}
register({id:'conical',variantLabel:'Size',name:'Conical flask',cat:'contain',tags:['surface-ok','clampable','container'],z:5,mounts:(it,w,h)=>[{type:'neck',x:0,y:h,accepts:['stopper']}],
  variants:[{id:'100',label:'100 cm³',w:58,h:76,mass:70,cap:100,minor:25,major:50},{id:'250',label:'250 cm³',w:74,h:98,mass:118,cap:250,minor:50,major:100}],
  draw(w,h,it){const v=variantOf(it),{nl,nr,nh}=conicalGeom(w,h);
    const yTop=nh+(h-nh)*0.28,yBot=h-6;
    return `<path class="g-glass" d="M${nl-1.5},0.6 L${nl},2.6 L${nl},${nh} L3,${h-7} Q1.5,${h-1} 8,${h-1} L${w-8},${h-1} Q${w-1.5},${h-1} ${w-3},${h-7} L${nr},${nh} L${nr},2.6 L${nr+1.5},0.6"/>
    <path class="g-hl" d="M${nr-2},5 L${nr-2},${nh-2} L${w-7},${h-10}"/>`+ticks({x:w*0.36,y0:yBot,y1:yTop,from:0,to:v.cap,minor:v.minor,major:v.major,len:3,lenMajor:6});},
  liquid(w,h){const {nl,nr,nh}=conicalGeom(w,h);return {d:`M${nl+1.4},${nh} L4.6,${h-7} Q3.4,${h-2.4} 8,${h-2.4} L${w-8},${h-2.4} Q${w-3.4},${h-2.4} ${w-4.6},${h-7} L${nr-1.4},${nh} Z`,top:nh,bottom:h-2.4};},
  readout:it=>[['Capacity',variantOf(it).label]],
  use:'The titration flask. Its narrow neck lets you swirl the mixture without splashing.',
  tip:'Put it on a white tile under the burette so the colour change is easy to see.'});

function tubeDraw(w,h){const r=w/2-2;return `<path class="g-glass" d="M0,1 L2,2.6 L2,${h-w/2} A${r},${r} 0 0 0 ${w-2},${h-w/2} L${w-2},2.6 L${w},1"/><path class="g-hl" d="M${w-5},8 L${w-5},${h-w/2}"/>`;}
function tubeLiquid(w,h){const r=w/2-3.2;return {d:`M3.2,3 L3.2,${h-w/2} A${r},${r} 0 0 0 ${w-3.2},${h-w/2} L${w-3.2},3 Z`,top:3,bottom:h-3.2};}
register({id:'testtube',name:'Test tube',cat:'contain',tags:['tube','clampable','container','gas-collect'],z:5,orient:['flip'],mounts:(it,w,h)=>[{type:'neck',x:0,y:h,accepts:['stopper']}],w:16,h:110,mass:12,
  draw:tubeDraw,liquid:tubeLiquid,readout:()=>[['Holds','about 20 cm³']],
  use:'Small-scale reactions and tests with a few cm³ of liquid.',
  tip:'When heating: use a holder, point the mouth away from people, keep it a third full and heat gently.'});
register({id:'boilingtube',name:'Boiling tube',cat:'contain',tags:['tube','clampable','container','gas-collect'],z:5,orient:['flip'],mounts:(it,w,h)=>[{type:'neck',x:0,y:h,accepts:['stopper']}],w:24,h:132,mass:25,
  draw:tubeDraw,liquid:tubeLiquid,readout:()=>[['Holds','about 50 cm³']],
  use:'A wider, stronger test tube for heating larger volumes.',
  tip:'Less likely to spit liquid out when heated than a test tube.'});

register({id:'rbf',name:'Round-bottom flask',cat:'contain',tags:['clampable','container'],z:5,mounts:(it,w,h)=>[{type:'neck',x:0,y:h,accepts:['stopper']}],w:84,h:136,mass:110,
  draw(w,h){const cx=w/2,cy=h-42;return `<path class="g-glass" d="M${cx-11},0.6 L${cx-9},2.6 L${cx-9},${cy-40} A41,41 0 1 0 ${cx+9},${cy-40} L${cx+9},2.6 L${cx+11},0.6"/>
    <path class="g-hl" d="M${cx+22},${cy-26} Q${cx+34},${cy-12} ${cx+33},${cy+6}"/>`;},
  liquid(w,h){const cx=w/2,cy=h-42,r=39.4;return {d:`M${cx-r},${cy} a${r},${r} 0 1 0 ${2*r},0 a${r},${r} 0 1 0 ${-2*r},0`,top:cy-r,bottom:cy+r};},
  readout:()=>[['Capacity','250 cm³']],
  use:'Heats liquids evenly. Used for distillation and reflux.',
  tip:'It cannot stand on its own. Hold it in a clamp.'});

register({id:'basin',name:'Evaporating basin',cat:'contain',tags:['surface-ok','container'],z:5,w:86,h:30,mass:62,
  draw(w,h){return `<rect class="g-porc" x="${w/2-14}" y="${h-3}" width="28" height="3" rx="1"/>
    <path class="g-porc" d="M0,3 Q1,1 4,1 L${w-4},1 Q${w-1},1 ${w},3 Q${w-6},${h-2} ${w/2},${h-2} Q6,${h-2} 0,3 Z"/><path class="g-porc" d="M0,3 L-3.5,1.6 L1,1.2"/>`;},
  liquid(w,h){return {d:`M3,4 L${w-3},4 Q${w-8},${h-4} ${w/2},${h-4} Q8,${h-4} 3,4 Z`,top:4,bottom:h-4};},
  use:'Evaporates the water from a solution to leave the solid behind.',
  tip:'For crystals: heat until crystals start to form at the edge (point of crystallisation), then leave to cool.'});

register({id:'crucible',name:'Crucible',cat:'contain',tags:['surface-ok','container'],z:5,w:36,h:38,
  massFn:it=>it.state.lid?42:30,defaults:{lid:true},
  controls:[{key:'lid',type:'toggle',label:'Lid',on:'On',off:'Off'}],
  draw(w,h,it){let s=`<path class="g-porc" d="M4,11 L8,${h} L${w-8},${h} L${w-4},11 Z"/><rect class="g-porc" x="2.5" y="9.5" width="${w-5}" height="3" rx="1"/>`;
    if(it.state.lid) s+=`<path class="g-porc" d="M1.5,9.5 L${w-1.5},9.5 L${w-5},5 L5,5 Z"/><rect class="g-porc" x="${w/2-3}" y="1.5" width="6" height="4" rx="1.5"/>`;return s;},
  use:'Heating solids strongly, e.g. burning magnesium or finding a mass of water lost.',
  tip:'Lift the lid now and then to let air in while stopping solid escaping.'});

register({id:'watch',name:'Watch glass',cat:'contain',tags:['surface-ok'],z:5,w:66,h:12,mass:15,
  draw(w,h){return `<path class="g-glass" d="M0,1.5 Q${w/2},${h*1.55} ${w},1.5 Q${w/2},${h*1.1} 0,1.5 Z"/>`;},
  use:'Covers a beaker, or lets a few drops of solution evaporate slowly.',
  tip:'Slow evaporation gives bigger, better-shaped crystals.'});

register({id:'cylinder',variantLabel:'Size',name:'Measuring cylinder',cat:'measure',tags:['surface-ok','container','gas-collect'],z:5,orient:['flip'],mounts:(it,w,h)=>[{type:'neck',x:0,y:h,accepts:['stopper']}],
  variants:[{id:'10',label:'10 cm³',w:20,h:120,mass:32,cap:10,minor:0.2,major:1},{id:'25',label:'25 cm³',w:24,h:150,mass:58,cap:25,minor:0.5,major:5},
            {id:'50',label:'50 cm³',w:28,h:175,mass:85,cap:50,minor:1,major:10},{id:'100',label:'100 cm³',w:34,h:205,mass:130,cap:100,minor:2,major:10}],
  draw(w,h,it){const v=variantOf(it),tw=w*0.56,tx=(w-tw)/2,b=8;
    return `<path class="g-base" d="M0,${h} L${w},${h} L${w-4},${h-b} L4,${h-b} Z"/>
    <path class="g-glass" d="M${tx-2.5},1 Q${tx},1.2 ${tx},5 L${tx},${h-b} L${tx+tw},${h-b} L${tx+tw},3 L${tx+tw+1},1"/>
    <path class="g-hl" d="M${tx+tw-2.6},10 L${tx+tw-2.6},${h-b-6}"/>`+
    ticks({x:tx+1.2,y0:h-b-3,y1:18,from:0,to:v.cap,minor:v.minor,major:v.major,len:tw*0.28,lenMajor:tw*0.6,labelX:tx+tw+2});},
  liquid(w,h){const tw=w*0.56,tx=(w-tw)/2;return {d:`M${tx+1.2},4 L${tx+tw-1.2},4 L${tx+tw-1.2},${h-9} L${tx+1.2},${h-9} Z`,top:4,bottom:h-9};},
  readout:it=>{const v=variantOf(it),V=analyse(it).V;return [['Volume',V>0?(Math.round(V/(v.minor/2))*(v.minor/2)).toFixed(v.minor<1?1:0)+' cm³':'empty'],['Capacity',v.label],['Smallest division',fmtNum(v.minor)+' cm³'],['Read to','±'+fmtNum(v.minor/2)+' cm³']];},
  use:'Measures a volume of liquid more accurately than a beaker.',
  tip:'Read the bottom of the meniscus with your eye level with it. Turn it upside down in a trough to collect a gas over water.'});

register({id:'burette',name:'Burette',cat:'measure',tags:['clampable','container'],z:5,mounts:(it,w,h)=>[{type:'neck',x:0,y:h,accepts:['stopper']}],w:16,h:340,mass:80,
  draw(w,h){const tb=h-46;
    return `<rect class="g-glass" x="3" y="0" width="10" height="${tb}" rx="1.5"/>
    <path class="g-glass" d="M5.5,${tb+16} L7.2,${h} L8.8,${h} L10.5,${tb+16} Z"/>
    <rect class="g-glass" x="4.5" y="${tb-1}" width="7" height="18" rx="1"/>
    <rect class="g-tap" x="-5" y="${tb+6}" width="26" height="4" rx="2"/>
    <path class="g-hl" d="M10.6,6 L10.6,${tb-6}"/>`+ticks({x:3,y0:14,y1:tb-14,from:0,to:50,minor:1,major:5,len:2.5,lenMajor:5,labelEvery:10,labelX:15,zero:true});},
  liquid(w,h){return {d:`M4.2,2 L11.8,2 L11.8,${h-47} L4.2,${h-47} Z`,top:2,bottom:h-47};},
  readout:it=>{const r=buretteReading(it);return [['Reading',r==null?'empty':(Math.round(r*20)/20).toFixed(2)+' cm³'],['Capacity','50.00 cm³'],['Read to','±0.05 cm³']];},
  use:'Adds a variable, accurately known volume of solution. The key tool in titration.',
  tip:'Record readings to 2 d.p. (e.g. 23.45 cm³). Remove the funnel and clear air bubbles from the tip before starting.'});

register({id:'pipette',variantLabel:'Size',name:'Volumetric pipette',cat:'measure',tags:['clampable'],z:5,
  variants:[{id:'10',label:'10.0 cm³',w:20,h:220,mass:18,cap:10},{id:'25',label:'25.0 cm³',w:20,h:270,mass:30,cap:25}],
  draw(w,h,it){const v=variantOf(it),bc=h*0.52,br=h*0.14;
    return `<rect class="g-glass" x="8.5" y="0" width="3" height="${bc-br+3}" rx="1"/>
    <path class="g-glass" d="M8.5,${bc+br-3} L8.5,${h-16} L9.5,${h} L10.5,${h} L11.5,${h-16} L11.5,${bc+br-3} Z"/>
    <ellipse class="g-glass" cx="10" cy="${bc}" rx="9" ry="${br}"/>
    <line class="g-mark" x1="7" y1="${h*0.17}" x2="13" y2="${h*0.17}"/>
    <text class="g-num" x="10" y="${bc+2}" text-anchor="middle">${v.cap}</text>`;},
  readout:it=>[['Delivers',variantOf(it).label+' exactly']],
  use:'Transfers one exact volume of solution, e.g. 25.0 cm³ of alkali into the conical flask.',
  tip:'Always use a pipette filler. Line up the bottom of the meniscus with the mark.'});

register({id:'syringe',name:'Gas syringe',cat:'measure',tags:['clampable'],z:5,w:210,h:32,mass:95,defaults:{vol:0},
  controls:[{key:'vol',type:'range',label:'Gas collected',min:0,max:100,step:1,unit:'cm³'}],
  draw(w,h,it){const v=it.state.vol||0,hx=196-v*1.6;
    return `<rect class="g-glass" x="${hx-154}" y="5" width="4" height="22" rx="1.5"/>
    <rect class="g-glass" x="${hx-150}" y="14" width="147" height="4" rx="1"/>
    <rect class="g-glass" x="30" y="6" width="170" height="20" rx="3"/>
    <rect class="g-darkm" x="${hx-3}" y="7.5" width="3.2" height="17" rx="1"/>
    <rect class="g-glass" x="200" y="13" width="10" height="6" rx="1"/>`+
    Array.from({length:21},(_,i)=>{const x=196-i*8,maj=i%2===0;return `<line class="g-tick" x1="${x}" y1="6" x2="${x}" y2="${maj?11:8.5}"/>`+(i%4===0?`<text class="g-num" x="${x}" y="31" text-anchor="middle">${i*5}</text>`:'');}).join('');},
  readout:it=>[['Volume',(it.state.vol||0)+' cm³'],['Capacity','100 cm³'],['Read to','±1 cm³']],
  use:'Collects a gas and measures its volume directly, e.g. to follow the rate of a reaction.',
  tip:'The plunger must move freely. Take readings at regular time intervals.'});

register({id:'thermometer',name:'Thermometer',cat:'measure',tags:['clampable'],z:6,w:10,h:230,mass:15,defaults:{temp:20},
  draw(w,h,it){const top=14,bot=h-20,T=it.state.temp??20,ty=bot-(T+10)/120*(bot-top);
    return `<rect class="g-glass" x="2.5" y="0" width="5" height="${h-8}" rx="2.5"/>
    <rect class="g-alc" x="4.2" y="${ty.toFixed(2)}" width="1.6" height="${(h-8-ty).toFixed(2)}"/>
    <circle class="g-glass" cx="5" cy="${h-5}" r="4.6"/><circle class="g-alc" cx="5" cy="${h-5}" r="3"/>`+
    ticks({x:7.5,y0:bot,y1:top,from:-10,to:110,minor:5,major:10,len:1.6,lenMajor:3,labelEvery:50,labelX:11.5,zero:true}).replace('>-10<','>−10<');},
  readout:it=>[['Reading',(it.state.temp??20).toFixed(1)+' °C'],['Range','−10 to 110 °C'],['Read to','±0.5 °C']],
  use:'Measures temperature, e.g. the temperature change in an exothermic reaction.',
  tip:'Keep the bulb fully in the liquid and read at eye level. Stir before reading.'});

register({id:'balance',name:'Electronic balance',cat:'measure',tags:[],z:1,w:130,h:54,mass:0,defaults:{tare:0},
  controls:[{key:'tare',type:'action',label:'Tare (zero the display)'}],
  onAction(it,key,ctx){if(key==='tare') it.state.tare=ctx.loadOn(it);},
  mounts:(it,w,h)=>[{type:'surface',x1:-45,x2:45,y:h-5,accepts:['surface-ok']}],
  draw(w,h,it,ctx){const d=ctx.balanceText(it);
    return `<rect class="g-metal" x="${w/2-5}" y="9" width="10" height="9"/>
    <rect class="g-metal" x="18" y="5" width="${w-36}" height="4.5" rx="2"/>
    <path class="g-device" d="M2,${h} L${w-2},${h} L${w-8},17 L8,17 Z"/>
    <rect class="g-lcd" x="${w/2-34}" y="24" width="68" height="17" rx="3"/>
    <text class="g-lcdtext" x="${w/2+30}" y="36" text-anchor="end">${d}</text>
    <circle class="g-btn" cx="17" cy="${h-12}" r="3.2"/><circle class="g-btn" cx="${w-17}" cy="${h-12}" r="3.2"/>`;},
  readout:(it,ctx)=>[['Display',ctx.balanceText(it)],['Load on pan',ctx.loadOn(it).toFixed(2)+' g'],['Read to','0.01 g']],
  use:'Measures mass. Put containers on the pan to weigh what is inside them.',
  tip:'Put the empty container on first and press Tare. Then the display shows only what you add.'});

register({id:'dropper',name:'Dropping pipette',cat:'transfer',tags:[],z:6,w:14,h:90,mass:5,
  draw(w,h){return `<path class="g-glass" d="M3.5,28 L3.5,64 L6.2,${h} L7.8,${h} L10.5,64 L10.5,28 Z"/><rect class="g-rubber" x="1.5" y="0" width="11" height="31" rx="5.5"/>`;},
  use:'Adds liquid one drop at a time, e.g. indicator.',
  tip:'Not for measuring volumes.'});

register({id:'funnel',name:'Funnel',cat:'transfer',tags:['clampable','stopper'],z:5,defaults:{paper:true},defaultVariant:'filter',
  variants:[{id:'filter',label:'(filter)',w:76,h:92,mass:40},{id:'small',label:'(small, for burette)',w:40,h:52,mass:15}],
  plug:(it,w,h)=>({dx:0,depth:h*0.32}),
  controls:[{key:'paper',type:'toggle',label:'Filter paper',on:'In',off:'Out'}],
  draw(w,h,it){const s=w/2,cb=h*0.48;let p=`<path class="g-glass" d="M1,2 L${s-3.5},${cb} L${s-3.5},${h-4} L${s-2},${h} L${s+3.5},${h-2} L${s+3.5},${cb} L${w-1},2 Z"/>`;
    if(it.state.paper) p+=`<path class="g-paper" d="M6,5 L${s},${cb-4} L${w-6},5 Z"/>`;
    return p+`<path class="g-hl" d="M${w-9},6 L${s+5},${cb-3}"/>`;},
  use:'With folded filter paper, separates an insoluble solid from a liquid. The small one fills a burette.',
  tip:'The solid left in the paper is the residue; the liquid that passes through is the filtrate. Take the funnel out of the burette before reading it.'});

register({id:'rod',name:'Glass rod',cat:'transfer',tags:['surface-ok'],z:6,w:150,h:6,mass:10,
  draw(w){return `<rect class="g-glass" x="0" y="0.5" width="${w}" height="5" rx="2.5"/><path class="g-hl" d="M4,2 L${w-4},2"/>`;},
  use:'Stirs mixtures, and guides liquid down when pouring.',
  tip:'Rinse it between solutions so you do not contaminate them.'});

register({id:'spatula',name:'Spatula',cat:'transfer',tags:['surface-ok'],z:6,w:104,h:8,mass:15,
  draw(){return `<rect class="g-metal" x="0" y="2.6" width="64" height="2.8" rx="1.4"/><path class="g-metal" d="M60,1.2 L96,1.2 Q104,4 96,6.8 L60,6.8 Z"/>`;},
  use:'Transfers small amounts of a solid.',
  tip:'Use a clean, dry spatula for each chemical.'});

register({id:'washbottle',name:'Wash bottle',cat:'transfer',tags:['surface-ok'],z:5,w:54,h:108,mass:30,
  draw(w,h){return `<path class="g-nozzle" d="M27,24 L27,10 Q27,4 33,4 L46,4 L52,10"/><rect class="g-cap" x="18" y="22" width="18" height="10" rx="2"/>
    <rect class="g-plastic" x="5" y="30" width="44" height="${h-30}" rx="10"/><rect class="g-paper" x="12" y="54" width="30" height="20" rx="2"/>
    <text class="g-small" x="27" y="67" text-anchor="middle">H₂O</text>`;},
  use:'Squirts distilled water to rinse apparatus or make solutions up to the mark.',
  tip:'Use distilled water so no extra ions get into your solution.'});

register({id:'bunsen',name:'Bunsen burner',cat:'heat',tags:[],z:2,orient:['mirror'],w:48,h:112,mass:600,defaults:{lit:false,air:'open'},
  controls:[{key:'lit',type:'toggle',label:'Gas',on:'Lit',off:'Off'},{key:'air',type:'seg',label:'Air hole',options:[['closed','Closed'],['half','Half open'],['open','Open']]}],
  draw(w,h,it){const cx=w/2,air=it.state.air||'open',aw={closed:0,half:3.5,open:7}[air];let f='';
    if(it.state.lit){
      if(air==='open'){const H=30,C=13;f=`<g class="flame"><path class="fl-blue" d="M${cx-6},6 C${cx-8},-2 ${cx-3},${6-H*0.8} ${cx},${6-H} C${cx+3},${6-H*0.8} ${cx+8},-2 ${cx+6},6 Z"/><path class="fl-cone" d="M${cx-3.5},6 Q${cx},${6-C*1.6} ${cx+3.5},6 Z"/></g>`;}
      else if(air==='half'){const H=44;f=`<g class="flame"><path class="fl-half" d="M${cx-6.5},6 C${cx-9},-6 ${cx-3},${6-H*0.8} ${cx},${6-H} C${cx+3},${6-H*0.8} ${cx+9},-6 ${cx+6.5},6 Z"/><path class="fl-yellow" d="M${cx-2},${6-H*0.6} Q${cx},${6-H*1.02} ${cx+2},${6-H*0.6} Z"/></g>`;}
      else {const H=60;f=`<g class="flame calm"><path class="fl-yellow" d="M${cx-7},6 C${cx-12},${6-H*0.35} ${cx-3},${6-H*0.6} ${cx-3},${6-H*0.82} C${cx-2},${6-H*0.92} ${cx+1},${6-H} ${cx+1},${6-H} C${cx+5},${6-H*0.72} ${cx+11},${6-H*0.4} ${cx+7},6 Z"/><path class="fl-yellow-in" d="M${cx-3.5},6 Q${cx},${6-H*0.55} ${cx+3.5},6 Z"/></g>`;}
    }
    return f+`<rect class="g-metal" x="${cx-5}" y="6" width="10" height="${h-30}" rx="1"/><rect class="g-metal" x="${cx-6}" y="3.5" width="12" height="4" rx="1"/>
    <rect class="g-metal" x="${cx+5}" y="${h-20}" width="${w/2-5}" height="4.5" rx="2"/>
    <rect class="g-darkm" x="${cx-7.5}" y="${h-36}" width="15" height="14" rx="2"/>${aw?`<rect class="g-hole" x="${cx-aw/2}" y="${h-32}" width="${aw}" height="6" rx="1"/>`:''}
    <rect class="g-metal" x="${cx-5}" y="${h-22}" width="10" height="11"/><path class="g-darkm" d="M2,${h} L${w-2},${h} L${w-7},${h-11} L7,${h-11} Z"/>`;},
  readout:it=>[['Flame',!it.state.lit?'off':{open:'blue, roaring (hottest)',half:'blue with yellow tip',closed:'yellow, luminous (safety flame)'}[it.state.air||'open']]],
  use:'Heats things. Open the air hole for a hot blue flame; close it for the yellow safety flame.',
  tip:'Light it with the air hole closed. Turn back to the yellow flame when you are not heating, so people can see it.'});

register({id:'tripod',name:'Tripod',cat:'support',tags:[],z:3,w:96,h:130,mass:400,
  mounts:(it,w,h)=>[{type:'surface',x1:-w/2+3,x2:w/2-3,y:h,accepts:['surface-ok']}],
  draw(w,h){return `<path class="g-leg back" d="M${w/2},4 L${w/2+4},${h}"/><path class="g-leg" d="M9,4 L1.5,${h}"/><path class="g-leg" d="M${w-9},4 L${w-1.5},${h}"/><rect class="g-metal" x="0" y="0" width="${w}" height="5" rx="2"/>`;},
  use:'Holds a gauze and a container above a Bunsen burner.',
  tip:'It gets very hot. Let it cool before you move it.'});

register({id:'gauze',name:'Gauze',cat:'support',tags:['surface-ok'],z:5,w:104,h:7,mass:60,
  mounts:(it,w,h)=>[{type:'surface',x1:-w/2+4,x2:w/2-4,y:h-1,accepts:['surface-ok']}],
  draw(w){return `<rect class="g-gauze" x="0" y="2" width="${w}" height="3" rx="1"/><rect class="g-porc" x="${w/2-22}" y="1" width="44" height="5" rx="2"/>`;},
  use:'Sits on the tripod. Spreads the heat evenly and supports the container.',
  tip:'Put it on the tripod first, then the beaker on top.'});

const JX=90;
const jawY=(it,h)=>(h-12)-(it.state.clampH??0.55)*(h-40);
register({id:'clamp',name:'Clamp stand',cat:'support',tags:[],z:0,orient:['mirror'],w:120,h:400,mass:1500,defaults:{clampH:0.55},
  controls:[{key:'clampH',type:'range',label:'Clamp height',min:0.08,max:0.95,step:0.01,fmt:v=>Math.round(v*100)+'%'}],
  mounts:(it,w,h)=>[{type:'clamp',x:JX-w/2,y:h-jawY(it,h),accepts:['clampable'],behind:true}],
  draw(w,h,it,ctx){const jy=jawY(it,h),g=ctx.grip(it)/2+1.5,L=JX-g-4,R=JX+g;
    return `<rect class="g-darkm" x="0" y="${h-12}" width="${w}" height="12" rx="3"/><rect class="g-metal" x="14" y="0" width="7" height="${h-12}" rx="2"/>
    <rect class="g-metal" x="21" y="${jy-2.5}" width="${L-21}" height="5" rx="2"/><rect class="g-darkm" x="9" y="${jy-8}" width="17" height="16" rx="3"/>
    <path class="g-finger" d="M${L+2},${jy-10} L${R+2},${jy-10} M${L+2},${jy+10} L${R+2},${jy+10}"/>
    <rect class="g-cork" x="${L}" y="${jy-10}" width="4" height="20" rx="1.5"/><rect class="g-cork" x="${R}" y="${jy-10}" width="4" height="20" rx="1.5"/>
    <rect class="g-darkm" x="${R+4}" y="${jy-4}" width="5" height="8" rx="1"/>`;},
  readout:(it,ctx)=>{const c=ctx.childrenOf(it)[0];return [['Holding',c?nameOf(c):'nothing']];},
  use:'Holds apparatus steady, e.g. a burette above a conical flask.',
  tip:'Drag a burette, tube or flask onto the clamp jaws to clamp it. Don\'t overtighten around glass.'});

register({id:'rack',name:'Test-tube rack',cat:'support',tags:[],z:1,w:150,h:64,mass:180,
  mounts:(it,w)=>Array.from({length:5},(_,i)=>({type:'slot',x:22+i*26.5-w/2,y:6,accepts:['tube'],behind:true})),
  draw(w,h){let n='';for(let i=0;i<5;i++)n+=`<rect class="g-wooddark" x="${22+i*26.5-7}" y="8" width="14" height="2"/>`;
    return `<rect class="g-wood" x="0" y="${h-7}" width="${w}" height="7" rx="1.5"/><rect class="g-wood" x="2" y="10" width="6" height="${h-17}"/>
    <rect class="g-wood" x="${w-8}" y="10" width="6" height="${h-17}"/><rect class="g-wood" x="0" y="8" width="${w}" height="8" rx="1.5"/>`+n;},
  use:'Holds test tubes and boiling tubes upright.',
  tip:'Never heat a tube while it is standing in the rack.'});


/* ---------- containers ---------- */
register({id:'volflask',variantLabel:'Size',name:'Volumetric flask',cat:'contain',tags:['surface-ok','clampable','container'],z:5,defaultVariant:'250',
  variants:[{id:'100',label:'100 cm³',w:56,h:150,mass:60,cap:100},{id:'250',label:'250 cm³',w:72,h:190,mass:95,cap:250}],
  mounts:(it,w,h)=>[{type:'neck',x:0,y:h,accepts:['stopper']}],
  draw(w,h,it){const v=variantOf(it),cx=w/2,nw=5.5,ne=h-w*0.95;
    return `<path class="g-glass" d="M${cx-nw-1.5},0.6 L${cx-nw},2.6 L${cx-nw},${ne} C${cx-nw},${ne+w*0.22} 2,${h-w*0.5} 2,${h-w*0.26} Q2,${h-1} ${w*0.24},${h-1} L${w*0.76},${h-1} Q${w-2},${h-1} ${w-2},${h-w*0.26} C${w-2},${h-w*0.5} ${cx+nw},${ne+w*0.22} ${cx+nw},${ne} L${cx+nw},2.6 L${cx+nw+1.5},0.6"/>
    <line class="g-mark" x1="${cx-nw-1.5}" y1="${ne*0.45}" x2="${cx+nw+1.5}" y2="${ne*0.45}"/><path class="g-hl" d="M${w-9},${h-w*0.5} Q${w-6},${h-w*0.3} ${w-8},${h-10}"/>
    <text class="g-num" x="${cx}" y="${h-w*0.3}" text-anchor="middle">${v.cap} cm³</text>`;},
  liquid(w,h){const cx=w/2,nw=4.3,ne=h-w*0.95;return {d:`M${cx-nw},2 L${cx-nw},${ne} C${cx-nw},${ne+w*0.22} 3.3,${h-w*0.5} 3.3,${h-w*0.26} Q3.3,${h-2.3} ${w*0.24},${h-2.3} L${w*0.76},${h-2.3} Q${w-3.3},${h-2.3} ${w-3.3},${h-w*0.26} C${w-3.3},${h-w*0.5} ${cx+nw},${ne+w*0.22} ${cx+nw},${ne} L${cx+nw},2 Z`,top:ne*0.45,bottom:h-2.3};},
  readout:it=>[['Holds exactly',variantOf(it).label+' at the mark']],
  use:'Makes up a standard solution: an exactly known volume, so you know the exact concentration.',
  tip:'Dissolve the solid in a beaker first, transfer it in, then add distilled water until the bottom of the meniscus sits on the mark. Stopper and invert to mix.'});

register({id:'gasjar',name:'Gas jar',cat:'gas',tags:['surface-ok','container','gas-collect'],z:5,w:62,h:120,mass:180,defaults:{lid:true},orient:['flip'],
  massFn:it=>it.state.lid?205:180,controls:[{key:'lid',type:'toggle',label:'Glass cover',on:'On',off:'Off'}],
  draw(w,h,it){return `<path class="g-glass" d="M0,1 L${w},1 L${w},5 L${w-4},6.5 L${w-4},${h-6} Q${w-4},${h-1} ${w-10},${h-1} L10,${h-1} Q4,${h-1} 4,${h-6} L4,6.5 L0,5 Z"/>
    <path class="g-hl" d="M${w-9},12 L${w-9},${h-10}"/>`+(it.state.lid?`<rect class="g-glass" x="-4" y="-3" width="${w+8}" height="3.6" rx="1"/>`:'');},
  liquid(w,h){return {d:`M5.2,7 L${w-5.2},7 L${w-5.2},${h-6} Q${w-5.2},${h-2.2} ${w-10},${h-2.2} L10,${h-2.2} Q5.2,${h-2.2} 5.2,${h-6} Z`,top:7,bottom:h-2.2};},
  use:'Collects and holds a gas so you can test it.',
  tip:'Over water: fill it with water, turn it upside down in the trough, and let the gas push the water out. Use the glass cover to stop the gas escaping.'});

register({id:'polycup',name:'Polystyrene cup',cat:'contain',tags:['surface-ok','container'],z:5,w:46,h:58,mass:3,defaults:{lid:false},
  controls:[{key:'lid',type:'toggle',label:'Lid',on:'On',off:'Off'}],
  draw(w,h,it){return `<path class="g-poly" d="M2,5 L${w-2},5 L${w-7},${h} L7,${h} Z"/><rect class="g-poly" x="0" y="2.5" width="${w}" height="4" rx="2"/>`+
    (it.state.lid?`<path class="g-poly" d="M-1,2.5 L${w/2-3},2.5 L${w/2-3},-1 L-1,-1 Z M${w/2+3},2.5 L${w+1},2.5 L${w+1},-1 L${w/2+3},-1 Z"/>`:'');},
  liquid(w,h){return {d:`M4,8 L${w-4},8 L${w-8},${h-2} L8,${h-2} Z`,top:8,bottom:h-2};},
  use:'A simple calorimeter for reactions in solution, e.g. neutralisation or dissolving.',
  tip:'Polystyrene is a good insulator, so little heat is lost. A lid with a hole for the thermometer helps even more.'});

register({id:'coppercan',name:'Copper calorimeter',cat:'contain',tags:['clampable','container'],z:5,w:52,h:62,mass:85,
  draw(w,h){return `<rect class="g-copper" x="3" y="4" width="${w-6}" height="${h-4}" rx="3"/><rect class="g-copper" x="0" y="2" width="${w}" height="4" rx="2"/><path class="g-hl" d="M10,11 L10,${h-7}"/>`;},
  use:'Holds water heated by a spirit burner, to measure the energy released when a fuel burns.',
  tip:'Copper conducts heat well. Clamp it a fixed distance above the wick and stir the water.'});

/* ---------- measuring ---------- */
register({id:'filler',name:'Pipette filler',cat:'measure',tags:['stopper'],z:6,w:30,h:46,mass:20,plug:{dx:0,depth:4},
  draw(w,h){return `<rect class="g-rubber" x="${w/2-3}" y="28" width="6" height="${h-28}" rx="1.5"/><circle class="g-rubber" cx="${w/2}" cy="16" r="14"/>
    <text class="g-tiny" x="${w/2}" y="6.5" text-anchor="middle" style="fill:var(--paper)">A</text><text class="g-tiny" x="${w/2}" y="${h-3}" text-anchor="middle" style="fill:var(--paper)">S</text><text class="g-tiny" x="${w-3}" y="17" text-anchor="middle" style="fill:var(--paper)">E</text>`;},
  use:'Fits on top of a pipette to suck up and release liquid safely.',
  tip:'Squeeze A to empty the bulb, S to suck liquid up, E to let it out. Never pipette by mouth.'});

const clockMs=it=>(it.state.acc||0)+(it.state.run?Date.now()-(it.state.t0||Date.now()):0);
const clockTxt=ms=>{const t=ms/1000,m=Math.floor(t/60),s=t-m*60;return String(m).padStart(2,'0')+':'+s.toFixed(1).padStart(4,'0');};
register({id:'stopclock',name:'Stop clock',cat:'measure',tags:['surface-ok'],z:6,w:62,h:72,mass:110,defaults:{run:false,acc:0,t0:0},
  controls:[{key:'startstop',type:'action',labelFn:it=>it.state.run?'Stop':'Start'},{key:'reset',type:'action',label:'Reset'}],
  onAction(it,k){if(k==='startstop'){if(it.state.run){it.state.acc=clockMs(it);it.state.run=false;}else{it.state.t0=Date.now();it.state.run=true;}}
    else if(k==='reset'){it.state.acc=0;it.state.t0=Date.now();}},
  draw(w,h,it){const ms=clockMs(it),a=((ms/1000)%60)/60*Math.PI*2,cx=w/2,cy=h-30;let t='';
    for(let i=0;i<12;i++){const b=i/12*Math.PI*2;t+=`<line class="g-tick" x1="${(cx+Math.sin(b)*20).toFixed(2)}" y1="${(cy-Math.cos(b)*20).toFixed(2)}" x2="${(cx+Math.sin(b)*23).toFixed(2)}" y2="${(cy-Math.cos(b)*23).toFixed(2)}"/>`;}
    return `<rect class="g-darkm" x="${cx-4}" y="0" width="8" height="8" rx="1.5"/><circle class="g-device" cx="${cx}" cy="${cy}" r="29"/><circle class="g-face" cx="${cx}" cy="${cy}" r="25"/>${t}
    <text class="g-tiny" x="${cx}" y="${cy+12}" text-anchor="middle">${clockTxt(ms)}</text>
    <line class="g-hand" x1="${cx}" y1="${cy}" x2="${(cx+Math.sin(a)*21).toFixed(2)}" y2="${(cy-Math.cos(a)*21).toFixed(2)}"/><circle class="g-termr" cx="${cx}" cy="${cy}" r="2"/>`;},
  readout:it=>[['Time',clockTxt(clockMs(it))+' (mm:ss)'],['Read to','±0.1 s']],
  use:'Times reactions, e.g. how long until the cross disappears, or gas volume every 30 s.',
  tip:'Start the clock at the moment you mix the reactants.'});

register({id:'phmeter',name:'pH meter',cat:'measure',tags:['clampable'],z:6,w:64,h:170,mass:150,defaults:{ph:7},
  draw(w,h,it){const cx=w/2;return `<path class="g-wire" d="M${cx},40 C${cx},52 ${cx},52 ${cx},62" style="stroke-width:2.4"/>
    <rect class="g-darkm" x="${cx-3}" y="60" width="6" height="${h-74}" rx="2"/><circle class="g-glass" cx="${cx}" cy="${h-9}" r="7"/>
    <rect class="g-device" x="2" y="0" width="${w-4}" height="40" rx="6"/><rect class="g-lcd" x="10" y="8" width="${w-20}" height="17" rx="3"/>
    <text class="g-lcdtext" x="${w-14}" y="20.5" text-anchor="end">${(p=>p==null?'--.--':p.toFixed(2))(ctx.phAt(it))}</text><text class="g-tiny" x="${cx}" y="34" text-anchor="middle">pH</text>`;},
  readout:(it,c)=>{const p=c.phAt(it);return [['Reading',p==null?'probe not in a solution':'pH '+p.toFixed(2)],['Read to','0.01']];},
  use:'Measures pH accurately as a number, more precisely than universal indicator.',
  tip:'Lower the probe tip into a solution to read its pH. Rinse it with distilled water between solutions.'});

/* ---------- transfer & handling ---------- */
register({id:'mortar',name:'Mortar and pestle',cat:'transfer',tags:['surface-ok','container'],z:5,w:74,h:48,mass:300,
  draw(w,h){return `<line class="g-pestle" x1="${w*0.48}" y1="22" x2="${w*0.8}" y2="3"/><line class="g-pestle-in" x1="${w*0.48}" y1="22" x2="${w*0.8}" y2="3"/>
    <rect class="g-porc" x="${w/2-14}" y="${h-4}" width="28" height="4" rx="1"/><path class="g-porc" d="M2,14 L${w-2},14 Q${w-6},${h-4} ${w/2},${h-3} Q6,${h-4} 2,14 Z"/>`;},
  use:'Grinds solids into a powder, e.g. to increase surface area or extract plant dyes.',
  tip:'A powder has a bigger surface area, so it reacts faster.'});

register({id:'tongs',name:'Tongs',cat:'transfer',tags:['surface-ok'],z:6,w:120,h:16,mass:60,orient:['mirror'],
  draw(w){return `<path class="g-arm" d="M0,4 Q60,10 ${w-10},7 Q${w-2},6 ${w-1},10"/><path class="g-arm" d="M0,12 Q60,6 ${w-10},9 Q${w-2},10 ${w-1},6"/>`;},
  use:'Lifts hot crucibles and evaporating basins.',
  tip:'Never pick up hot apparatus with your hands.'});

register({id:'ttholder',name:'Test-tube holder',cat:'transfer',tags:['surface-ok'],z:6,w:112,h:18,mass:25,orient:['mirror'],
  draw(w){return `<rect class="g-wood" x="0" y="6" width="62" height="6" rx="3"/><path class="g-arm" d="M60,9 L104,3.5 Q111,9 104,14.5 Z"/><circle class="g-arm" cx="72" cy="9" r="3"/>`;},
  use:'Holds a test tube while you heat it in a flame.',
  tip:'Grip near the top of the tube and point its mouth away from everyone.'});

/* ---------- heating ---------- */
register({id:'spirit',name:'Spirit burner',cat:'heat',tags:['surface-ok'],z:4,w:52,h:64,mass:120,defaults:{lit:false},initContents:[{c:'ethanol',a:55}],
  controls:[{key:'lit',type:'toggle',label:'Wick',on:'Lit',off:'Out'}],
  draw(w,h,it){const cx=w/2;let f='';if(it.state.lit){const H=26;f=`<g class="flame calm"><path class="fl-yellow" d="M${cx-5},4 C${cx-9},${4-H*0.4} ${cx-2},${4-H*0.7} ${cx},${4-H} C${cx+2},${4-H*0.7} ${cx+9},${4-H*0.4} ${cx+5},4 Z"/><path class="fl-blue" d="M${cx-3},4 Q${cx},${4-H*0.3} ${cx+3},4 Z"/></g>`;}
    return f+`<rect class="g-wick" x="${cx-1.5}" y="3" width="3" height="10"/><rect class="g-metal" x="${cx-6}" y="12" width="12" height="9" rx="1.5"/>
    <path class="g-glass" d="M6,${h} L${w-6},${h} Q${w-2},${h} ${w-2},${h-6} L${w-4},27 Q${cx},16 4,27 L2,${h-6} Q2,${h} 6,${h} Z"/>`;},
  liquid(w,h){return {d:`M7,${h-1.4} L${w-7},${h-1.4} Q${w-3.4},${h-1.4} ${w-3.4},${h-6} L${w-5.4},28 Q${w/2},18 5.4,28 L3.4,${h-6} Q3.4,${h-1.4} 7,${h-1.4} Z`,top:20,bottom:h-1.4};},
  use:'Burns a liquid fuel such as ethanol. Weigh it before and after to find the mass of fuel burned.',
  tip:'Keep the cap on when it is not lit so the fuel does not evaporate and give a wrong mass.'});

register({id:'waterbath',name:'Water bath',cat:'heat',tags:[],z:2,w:170,h:92,mass:2500,defaults:{temp:40},
  controls:[{key:'temp',type:'range',label:'Set temperature',min:20,max:100,step:1,unit:'°C'}],
  mounts:(it,w,h)=>[{type:'surface',x1:-w/2+14,x2:w/2-14,y:h-14,accepts:['container','tube'],behind:true}],
  draw(w,h,it){return `<rect class="g-device" x="0" y="10" width="${w}" height="${h-10}" rx="6"/><rect class="g-metal" x="-2" y="7" width="${w+4}" height="5" rx="2"/>
    <rect class="g-lcd" x="16" y="${h-42}" width="52" height="18" rx="3"/><text class="g-lcdtext" x="62" y="${h-29}" text-anchor="end">${Math.round(it.state.temp)} °C</text>
    <circle class="g-btn" cx="${w-30}" cy="${h-33}" r="10"/><circle class="g-termr" cx="${w-56}" cy="${h-33}" r="3"/>`;},
  readout:it=>[['Water temperature',Math.round(it.state.temp)+' °C']],
  use:'Heats things gently and evenly to a set temperature. Safe for flammable liquids such as ethanol.',
  tip:'Use it instead of a Bunsen burner whenever the substance could catch fire.'});

/* ---------- support & safety ---------- */
register({id:'mat',name:'Heat-proof mat',cat:'support',tags:[],z:-2,w:190,h:8,mass:400,
  mounts:(it,w,h)=>[{type:'surface',x1:-w/2+4,x2:w/2-4,y:h}],
  draw(w,h){return `<rect class="g-mat" x="0" y="0" width="${w}" height="${h}" rx="2"/>`;},
  use:'Protects the bench from heat. Stand the Bunsen burner and tripod on it.',
  tip:'Anything can sit on it.'});
register({id:'triangle',name:'Pipeclay triangle',cat:'support',tags:['surface-ok'],z:5,w:84,h:8,mass:20,
  mounts:(it,w,h)=>[{type:'surface',x1:-w/2+10,x2:w/2-10,y:h-1,accepts:['surface-ok']}],
  draw(w){return `<line class="g-arm" x1="0" y1="4" x2="${w}" y2="4" style="stroke-width:1.6"/><rect class="g-porc" x="6" y="1.5" width="22" height="5" rx="2"/>
    <rect class="g-porc" x="${w/2-11}" y="1.5" width="22" height="5" rx="2"/><rect class="g-porc" x="${w-28}" y="1.5" width="22" height="5" rx="2"/>`;},
  use:'Sits on a tripod and holds a crucible over the flame.',
  tip:'Use it instead of a gauze when heating a crucible strongly.'});
register({id:'tile',name:'White tile',cat:'support',tags:['surface-ok'],z:1,w:92,h:6,mass:150,
  mounts:(it,w,h)=>[{type:'surface',x1:-w/2+4,x2:w/2-4,y:h,accepts:['surface-ok']}],
  draw(w,h){return `<rect class="g-paper" x="0" y="0" width="${w}" height="${h}" rx="1"/>`;},
  use:'Goes under the conical flask in a titration.',
  tip:'The white background makes the end-point colour change easy to see.'});

/* ---------- gases ---------- */
register({id:'bung',name:'Bung',cat:'gas',tags:['stopper'],z:6,w:24,h:14,mass:8,plug:{dx:0,depth:9},
  draw(w,h){return `<path class="g-bung" d="M0,0 L${w},0 L${w-4},${h} L4,${h} Z"/>`;},
  use:'Seals the top of a flask or tube.',
  tip:'Drop it on the neck of a flask or tube and it fits in.'});
register({id:'delivery',name:'Delivery tube',cat:'gas',tags:['stopper'],z:6,w:150,h:96,mass:20,orient:['mirror'],plug:(it,w)=>({dx:13-w/2,depth:9}),
  draw(w,h){const bx=13,d=`M${bx},${h-12} L${bx},14 Q${bx},6 ${bx+8},6 L${w-14},6 Q${w-6},6 ${w-6},14 L${w-6},${h-20}`;
    return `<path class="g-tube-o" d="${d}"/><path class="g-tube-i" d="${d}"/><path class="g-bung" d="M${bx-11},${h-14} L${bx+11},${h-14} L${bx+8},${h} L${bx-8},${h} Z"/>`;},
  use:'Carries gas from a reaction to where you collect or test it.',
  tip:'The bung end snaps into a flask or tube. Use Mirrored to point it the other way.'});
register({id:'trough',name:'Trough',cat:'gas',tags:[],z:1,w:210,h:72,mass:600,
  mounts:(it,w,h)=>[{type:'surface',x1:-w/2+12,x2:w/2-12,y:3,accepts:['gas-collect'],behind:true}],
  draw(w,h){const wl=h*0.25;return `<rect class="g-water" x="3" y="${wl}" width="${w-6}" height="${h-wl-3}"/><line class="g-waterline" x1="3" y1="${wl}" x2="${w-3}" y2="${wl}"/>
    <path class="g-glass" style="fill:none" d="M0,0 L0,${h-3} Q0,${h} 3,${h} L${w-3},${h} Q${w},${h} ${w},${h-3} L${w},0"/>`;},
  use:'A tank of water for collecting gas over water.',
  tip:'Stand an upside-down gas jar, boiling tube or measuring cylinder in it. Only for gases that are not very soluble in water.'});
register({id:'cotton',name:'Cotton wool',cat:'gas',tags:['stopper'],z:6,w:26,h:16,mass:1,plug:{dx:0,depth:8},
  draw(){return `<g class="g-paper"><circle cx="7" cy="10" r="6"/><circle cx="19" cy="10" r="6"/><circle cx="13" cy="7" r="7"/><circle cx="13" cy="11" r="5.5" style="stroke:none"/></g>`;},
  use:'Plugs a flask so gas can escape but liquid spray cannot.',
  tip:'Used when you follow a reaction by the mass lost on a balance.'});

/* ---------- separation ---------- */
register({id:'sepfunnel',name:'Separating funnel',cat:'separate',tags:['clampable','container'],z:5,w:62,h:210,mass:120,defaults:{tap:false},
  controls:[{key:'tap',type:'toggle',label:'Tap',on:'Open',off:'Closed'}],
  draw(w,h,it){const cx=w/2,b=h*0.66,yt=h*0.73;
    return `<path class="g-glass" d="M${cx-2.5},${b-2} L${cx-2.5},${h-6} L${cx-1},${h} L${cx+1},${h} L${cx+2.5},${h-6} L${cx+2.5},${b-2} Z"/>
    <path class="g-glass" d="M${cx-5},12 C${cx-30},44 ${cx-30},${h*0.55} ${cx-3},${b} L${cx+3},${b} C${cx+30},${h*0.55} ${cx+30},44 ${cx+5},12 Z"/>
    <rect class="g-glass" x="${cx-4}" y="0" width="8" height="13" rx="2"/><rect class="g-glass" x="${cx-5}" y="${yt-5}" width="10" height="10" rx="1.5"/>
    ${it.state.tap?`<rect class="g-tap" x="${cx-1.5}" y="${yt-10}" width="3" height="20" rx="1.5"/>`:`<rect class="g-tap" x="${cx-12}" y="${yt-1.5}" width="24" height="3" rx="1.5"/>`}
    <path class="g-hl" d="M${cx+14},44 Q${cx+20},${h*0.4} ${cx+12},${h*0.55}"/>`;},
  liquid(w,h){const cx=w/2,b=h*0.66;return {d:`M${cx-4},14 C${cx-28.5},45 ${cx-28.5},${h*0.55} ${cx-2.5},${b-1.4} L${cx+2.5},${b-1.4} C${cx+28.5},${h*0.55} ${cx+28.5},45 ${cx+4},14 Z`,top:14,bottom:b-1.4};},
  use:'Separates two liquids that do not mix (immiscible), such as oil and water.',
  tip:'Open the tap to run off the bottom (denser) layer, and close it just as the boundary reaches the tap.'});

register({id:'condenser',name:'Liebig condenser',cat:'separate',tags:['clampable'],z:5,w:240,h:110,mass:200,orient:['mirror'],
  draw(w,h){const L=Math.hypot(w-16,h-24),deg=Math.atan2(h-24,w-16)*180/Math.PI;
    return `<g transform="translate(8,12) rotate(${deg.toFixed(2)})">
    <rect class="g-glass" x="${L*0.79}" y="8" width="7" height="14" rx="1.5"/><rect class="g-glass" x="${L*0.19}" y="-22" width="7" height="14" rx="1.5"/>
    <rect class="g-glass" x="${L*0.13}" y="-10" width="${L*0.74}" height="20" rx="7"/><rect class="g-water" x="${L*0.13+2}" y="-8" width="${L*0.74-4}" height="16" rx="6"/>
    <rect class="g-glass" x="0" y="-3.2" width="${L}" height="6.4" rx="2"/>
    <text class="g-tiny" x="${L*0.79+10}" y="22">water in</text><text class="g-tiny" x="${L*0.19+10}" y="-14">water out</text></g>`;},
  use:'Cools vapour back into a liquid during distillation.',
  tip:'Cold water goes in at the bottom and out at the top, so the jacket stays full and cooling is most efficient.'});

register({id:'fraccol',name:'Fractionating column',cat:'separate',tags:['clampable','stopper'],z:5,w:44,h:230,mass:150,orient:['mirror'],plug:(it,w)=>({dx:14-w/2,depth:14}),
  draw(w,h){let b='';for(let y=34,i=0;y<h-18;y+=6.5,i++)b+=`<circle class="g-glass" cx="${i%2?16.5:11.5}" cy="${y}" r="2.6"/>`;
    return `<path class="g-tube-o" d="M20,16 L${w-3},28"/><path class="g-tube-i" d="M20,16 L${w-3},28"/><rect class="g-glass" x="8" y="0" width="12" height="${h}" rx="2"/>${b}<path class="g-hl" d="M17.5,6 L17.5,${h-8}"/>`;},
  use:'Separates a mixture of liquids with close boiling points, such as ethanol and water or crude oil.',
  tip:'The column is hottest at the bottom. Liquids with lower boiling points rise further and leave through the side arm first.'});

register({id:'chroma',name:'Chromatography paper',cat:'separate',tags:['clampable','surface-ok'],z:6,w:44,h:130,mass:1,
  draw(w,h){const y=h-20;return `<rect class="g-paper" x="0" y="0" width="${w}" height="${h}" rx="1"/><line class="g-pencil" x1="4" y1="${y}" x2="${w-4}" y2="${y}"/>
    <circle cx="11" cy="${y}" r="3" style="fill:var(--spot1)"/><circle cx="22" cy="${y}" r="3" style="fill:var(--spot2)"/><circle cx="33" cy="${y}" r="3" style="fill:var(--spot3)"/>`;},
  use:'Separates the coloured substances in a mixture, e.g. inks or food dyes.',
  tip:'Draw the start line in pencil (ink would run) and keep it above the solvent level. Rf = distance moved by spot ÷ distance moved by solvent.'});
register({id:'capillary',name:'Capillary tube',cat:'separate',tags:[],z:6,w:5,h:72,mass:1,
  draw(w,h){return `<rect class="g-glass" x="1" y="0" width="3" height="${h}" rx="1.2"/>`;},
  use:'Puts a tiny spot of a sample onto chromatography paper.',
  tip:'Keep spots small so they do not merge as they move.'});

/* ---------- testing ---------- */
register({id:'indpaper',name:'Indicator paper',cat:'test',tags:['surface-ok'],z:6,w:14,h:62,mass:0.2,defaultVariant:'red',
  variants:[{id:'red',label:'(red litmus)',col:'var(--litmus-red)'},{id:'blue',label:'(blue litmus)',col:'var(--litmus-blue)'},{id:'ui',label:'(universal)',col:'var(--ui-paper)'}],
  draw(w,h,it){return `<rect x="0" y="0" width="${w}" height="${h}" rx="1.2" style="fill:${variantOf(it).col};stroke:var(--porc-edge);stroke-width:.5"/>`;},
  use:'Shows whether something is acidic or alkaline. Damp it to test a gas.',
  tip:'Acid turns blue litmus red; alkali turns red litmus blue. Universal indicator gives the approximate pH (red 1 → green 7 → purple 14). Chlorine bleaches damp litmus.'});
register({id:'splint',name:'Wooden splint',cat:'test',tags:['surface-ok'],z:6,w:130,h:8,mass:1,defaults:{fire:'none'},orient:['mirror'],
  controls:[{key:'fire',type:'seg',label:'Splint',options:[['none','Unlit'],['glowing','Glowing'],['lit','Lit']]}],
  draw(w,h,it){const f=it.state.fire;let s=`<rect class="g-wood" x="0" y="2" width="${w}" height="4" rx="1.5"/>`;
    if(f!=='none')s+=`<rect class="g-darkm" x="${w-9}" y="2" width="9" height="4" rx="1.5"/>`;
    if(f==='glowing')s+=`<circle class="g-glowr" cx="${w-1}" cy="4" r="7"/><circle class="g-ember" cx="${w-1}" cy="4" r="3"/>`;
    if(f==='lit')s+=`<g class="flame calm"><path class="fl-yellow" d="M${w-7},4 C${w-10},-6 ${w-3},-12 ${w},-20 C${w+4},-12 ${w+8},-6 ${w+4},4 Z"/><path class="fl-yellow-in" d="M${w-4},4 Q${w},-6 ${w+2},4 Z"/></g>`;
    return s;},
  use:'Tests for gases.',
  tip:'Hydrogen: a lit splint gives a squeaky pop. Oxygen: a glowing splint relights. Carbon dioxide puts a lit splint out (but use limewater to confirm it).'});
register({id:'nichrome',name:'Nichrome wire',cat:'test',tags:['surface-ok'],z:6,w:122,h:12,mass:5,orient:['mirror'],
  draw(w){return `<rect class="g-darkm" x="0" y="3" width="54" height="6" rx="3"/><line class="g-wire" x1="54" y1="6" x2="${w-10}" y2="6"/><circle class="g-wire" cx="${w-5.5}" cy="6" r="4.5"/>`;},
  use:'Flame tests for metal ions.',
  tip:'Clean the loop in concentrated hydrochloric acid, dip it in the sample and hold it in a blue Bunsen flame. Li⁺ red, Na⁺ yellow, K⁺ lilac, Ca²⁺ orange-red, Ba²⁺ light green, Cu²⁺ blue-green.'});

/* ---------- electricity ---------- */
register({id:'powerpack',name:'Power supply',cat:'electric',tags:['surface-ok'],z:4,w:120,h:76,mass:1800,defaults:{on:false,volts:6},
  controls:[{key:'on',type:'toggle',label:'Power',on:'On',off:'Off'},{key:'volts',type:'range',label:'Voltage (d.c.)',min:0,max:12,step:1,unit:'V'}],
  draw(w,h,it){const v=it.state.volts,a=(-135+v/12*270)*Math.PI/180;
    return `<rect class="g-device" x="0" y="6" width="${w}" height="${h-6}" rx="6"/><rect class="g-darkm" x="${w/2-22}" y="0" width="44" height="8" rx="3"/>
    <rect class="g-lcd" x="12" y="18" width="52" height="18" rx="3"/><text class="g-lcdtext" x="58" y="31" text-anchor="end">${it.state.on?v.toFixed(1)+' V':'--'}</text>
    <circle class="g-btn" cx="${w-26}" cy="30" r="12"/><line class="g-hand" x1="${w-26}" y1="30" x2="${(w-26+Math.sin(a)*9).toFixed(2)}" y2="${(30-Math.cos(a)*9).toFixed(2)}" style="stroke:var(--panel)"/>
    <circle class="g-termr" cx="28" cy="${h-17}" r="6"/><circle class="g-termb" cx="56" cy="${h-17}" r="6"/>
    <text class="g-label7" x="28" y="${h-4}" text-anchor="middle">+</text><text class="g-label7" x="56" y="${h-4}" text-anchor="middle">−</text><text class="g-tiny" x="${w-26}" y="${h-8}" text-anchor="middle">d.c.</text>`;},
  readout:it=>[['Output',it.state.on?it.state.volts+' V d.c.':'off']],
  use:'Supplies direct current for electrolysis and conductivity tests.',
  tip:'The electrode joined to + is the anode; the one joined to − is the cathode.'});
register({id:'electrode',name:'Electrode',cat:'electric',tags:['clampable'],z:6,defaultVariant:'graphite',
  variants:[{id:'graphite',label:'(graphite)',w:12,h:150,mass:15,col:'var(--graphite)'},{id:'copper',label:'(copper)',w:12,h:150,mass:40,col:'var(--copper)'},{id:'platinum',label:'(platinum)',w:8,h:120,mass:10,col:'var(--platinum)'}],
  draw(w,h,it){return `<rect x="1" y="9" width="${w-2}" height="${h-9}" rx="2" style="fill:${variantOf(it).col};stroke:var(--dark-edge);stroke-width:.8"/><rect class="g-metal" x="${w/2-4}" y="0" width="8" height="12" rx="1.5"/>`;},
  readout:it=>[['Type',{graphite:'inert',copper:'active (copper anode dissolves)',platinum:'inert'}[variantOf(it).id]]],
  use:'Carries current into the electrolyte during electrolysis.',
  tip:'Graphite and platinum are inert. A copper anode dissolves, which is how copper is purified and objects are electroplated.'});
register({id:'bulb',name:'Bulb',cat:'electric',tags:['surface-ok'],z:5,w:40,h:66,mass:40,
  draw(w,h){const cx=w/2;return `<rect class="g-darkm" x="4" y="${h-18}" width="${w-8}" height="18" rx="3"/><circle class="g-metal" cx="9" cy="${h-9}" r="2.6"/><circle class="g-metal" cx="${w-9}" cy="${h-9}" r="2.6"/>
    <rect class="g-metal" x="${cx-8}" y="${h-29}" width="16" height="12" rx="2"/><circle class="g-glass" cx="${cx}" cy="20" r="18"/>
    <path class="g-wire" d="M${cx-5},${h-29} L${cx-5},24 L${cx-3},18 L${cx-1},24 L${cx+1},18 L${cx+3},24 L${cx+5},18 L${cx+5},${h-29}" style="stroke-width:1"/>`;},
  use:'Shows whether a substance conducts electricity.',
  tip:'Ionic compounds light the bulb only when molten or dissolved, because then the ions are free to move.'});
register({id:'ammeter',name:'Ammeter',cat:'electric',tags:['surface-ok'],z:5,w:76,h:64,mass:300,
  draw(w,h){const cx=w/2;let t='';for(let i=0;i<=10;i++){const a=(-60+i*12)*Math.PI/180;t+=`<line class="g-tick" x1="${(cx+Math.sin(a)*22).toFixed(2)}" y1="${(40-Math.cos(a)*22).toFixed(2)}" x2="${(cx+Math.sin(a)*(i%5?25:27)).toFixed(2)}" y2="${(40-Math.cos(a)*(i%5?25:27)).toFixed(2)}"/>`;}
    return `<rect class="g-device" x="0" y="0" width="${w}" height="${h}" rx="6"/><rect class="g-face" x="7" y="7" width="${w-14}" height="36" rx="3"/>${t}
    <line class="g-hand" x1="${cx}" y1="40" x2="${(cx+Math.sin(-60*Math.PI/180)*21).toFixed(2)}" y2="${(40-Math.cos(-60*Math.PI/180)*21).toFixed(2)}"/>
    <text class="g-label7" x="${cx}" y="38" text-anchor="middle">A</text><circle class="g-termr" cx="18" cy="${h-11}" r="5"/><circle class="g-termb" cx="${w-18}" cy="${h-11}" r="5"/>`;},
  readout:()=>[['Current','0.00 A']],
  use:'Measures the current flowing in a circuit.',
  tip:'Connect it in series. More current for longer means more product at the electrodes.'});

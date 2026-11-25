/* Model-driven scenes. Every scene control updates an existing gameplay input. */
(() => {
  'use strict';
  const root = document.getElementById('game-root');
  if (!root) return;
  const kinds = {island:'Resource management',market:'Market laboratory',policy:'Economic strategy',trade:'Port simulation',escape:'Archive adventure'};
  let active, view;
  const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  const clamp = (n,min,max) => Math.max(min,Math.min(max,n));
  const signed = n => (n>0?'+':'')+n;
  const text = (x,y,value,cls='') => `<text x="${x}" y="${y}" class="${cls}">${esc(value)}</text>`;
  const person = (x,y,colour='#fff2ce') => `<g transform="translate(${x} ${y})"><ellipse cy="13" rx="9" ry="3" fill="#132e4433"/><path d="M-5 4v9m10-9v9M-8 3l8-5 8 5" fill="none" stroke="${colour}" stroke-width="5" stroke-linecap="round"/><circle cy="-9" r="5" fill="#e8b68d"/></g>`;
  const tree = (x,y) => `<g transform="translate(${x} ${y})"><path d="M0 0v32" stroke="#81634e" stroke-width="7"/><ellipse cy="-2" rx="22" ry="28" fill="#267a64"/><ellipse cx="-9" cy="-8" rx="13" ry="19" fill="#399579"/></g>`;
  const crate = (x,y,c='#dfaf69') => `<g transform="translate(${x} ${y})"><path d="M0 0h26v23H0z" fill="${c}" stroke="#294956" stroke-width="2"/><path d="M3 4l20 15M23 4 3 19" stroke="#294956" stroke-width="1.5" opacity=".5"/></g>`;
  const svg = (game,title,description,content) => `<svg viewBox="0 0 900 480" role="img" aria-labelledby="${game}-art-title ${game}-art-desc"><title id="${game}-art-title">${esc(title)}</title><desc id="${game}-art-desc">${esc(description)}</desc>${content}</svg>`;
  function islandArt(v) {
    const s=v??{workers:8,assigned:4,crops:8,tools:4,event:'Normal harvest'};
    let plants='',people='',stores='';
    for(let i=0;i<24;i++){const x=210+i%6*26,y=239+Math.floor(i/6)*24;plants+=`<path d="M${x} ${y+8}v-14m0 7q-11-15-12-4m12 6q12-16 13-5" fill="none" stroke="${i<Math.round(24*s.assigned/s.workers)?'#d9eb98':'#698a5a'}" stroke-width="3" stroke-linecap="round"/>`;}
    for(let i=0;i<s.workers;i++)people+=person(i<s.assigned?220+(i%4)*35:567+(i-s.assigned)%4*34,i<s.assigned?357+Math.floor(i/4)*25:333+Math.floor((i-s.assigned)/4)*28,i<s.assigned?'#fff1bd':'#b5deef');
    for(let i=0;i<Math.min(s.tools,8);i++)stores+=crate(590+(i%4)*29,250+Math.floor(i/4)*25);
    return svg('island','Your island production plan',`${s.assigned} workers farm and ${s.workers-s.assigned} make tools. Output is ${s.crops} crop baskets and ${s.tools} tools.`,
      `<defs><linearGradient id="island-sea" x2="0" y2="1"><stop stop-color="#b8e3e7"/><stop offset="1" stop-color="#79bbc9"/></linearGradient></defs><rect width="900" height="480" fill="url(#island-sea)"/><g fill="none" stroke="#d5f0ed" stroke-width="2" opacity=".7"><path d="M30 370q80-14 135 0m540 35q75-14 150 0M650 96q70-14 150 0M30 100q70-14 110 0"/></g><path d="M112 340Q65 180 205 133Q305 77 432 125Q610 69 739 165Q860 271 765 365Q669 444 489 417Q234 464 112 340Z" fill="#e5d29e" stroke="#cae9df" stroke-width="12"/><path d="M134 326Q98 195 225 156Q330 107 431 150Q616 94 718 180Q813 269 741 345Q643 408 481 394Q254 435 134 326Z" fill="#8ab982"/><path d="M385 321q70-50 180-20" stroke="#d7cba5" stroke-width="26" fill="none"/><path d="M180 218h204v117H180z" fill="#658851" stroke="#d6c99f" stroke-width="8"/>${plants}<g><path d="M548 175h148v84H548z" fill="#c4e1df"/><path d="m532 180 91-63 91 63z" fill="#285771"/><path d="M579 211h31v48h-31z" fill="#244854"/><path d="M640 204h29v29h-29z" fill="#fff0c5"/><path d="M542 259h164" stroke="#37614e" stroke-width="6"/></g>${stores}${tree(437,192)}${tree(157,200)}${tree(733,276)}${people}<g class="sim-map-label"><rect x="211" y="178" width="140" height="33" rx="8" fill="#193e35"/>${text(235,201,'FARMLAND')}<rect x="557" y="97" width="145" height="33" rx="8" fill="#193e35"/>${text(579,120,'WORKSHOP')}</g>`);
  }
  function missionMarketArt(s) {
    const {a,c,b,e,baseA,baseC,point,original}=s.curve;
    const top = 64, left = 95, bottom = 390, right = 800;
    const maxQ = Math.ceil(Math.max(a,baseA,s.quantity+12,28)/8)*8;
    const maxP = Math.ceil(Math.max(a/b,baseA/b,s.campaign?.price??0,10)/6)*6;
    const x=q=>left+q/maxQ*(right-left), y=p=>bottom-p/maxP*(bottom-top);
    const curve=(start,slope,cls)=>`<path class="${cls}" d="M${x(start)} ${bottom}L${x(start+slope*maxP)} ${top}"/>`;
    const grid=Array.from({length:5},(_,i)=>{
      const price=maxP*i/4, units=maxQ*i/4;
      return `<path d="M${left} ${y(price)}H${right}M${x(units)} ${top}V${bottom}" stroke="#294b63"/>` +
        text(55,y(price)+5,price)+text(x(units)-4,bottom+26,units);
    }).join('');
    const markX=x(point.quantity),markY=y(point.price),baseX=x(original.quantity),baseY=y(original.price);
    return svg('market','Supply and demand for '+s.good,`Original equilibrium: ${s.baseline.price} credits, ${s.baseline.quantity} units. Current equilibrium: ${s.price} credits, ${s.quantity} units.`,
      `<defs><clipPath id="market-plot"><rect x="${left}" y="${top}" width="${right-left}" height="${bottom-top}"/></clipPath></defs>
      <rect width="900" height="480" fill="#102c40"/>${grid}
      <path d="M${left} ${top}V${bottom}H${right}" stroke="#a8c6d4" stroke-width="2"/>
      ${text(42,35,'Price · credits')}${text(622,455,'Quantity · units')}
      <g clip-path="url(#market-plot)">
        ${curve(baseA,-b,'sim-curve-base')}${curve(baseC,e,'sim-curve-base')}
        ${curve(a,-b,'sim-demand')}${curve(c,e,'sim-supply')}
        ${s.campaign?`<path d="M${left} ${y(s.campaign.price)}H${right}" class="sim-market-control"/>`:''}
        <circle cx="${baseX}" cy="${baseY}" r="8" fill="#102c40" stroke="#a8c6d4" stroke-width="2"/>
        <path d="M${left} ${markY}H${markX}V${bottom}" stroke="#b7ead5" stroke-width="1.5" stroke-dasharray="6 6"/>
        <circle cx="${markX}" cy="${markY}" r="7" fill="#c9f5de" stroke="#102c40" stroke-width="2"/>
      </g>${text(Math.min(markX+14,690),markY-13,'Equilibrium','sim-equilibrium-label')}`);
  }
  function marketArt(v) {
    const s=v??{d:0,supply:0,price:8,quantity:12};
    if (s.curve) return missionMarketArt(s);
    const x=q=>100+q/32*690,y=p=>388-p/28*320;
    const line=(d,supply,base=false)=>`<path d="M${x(0)} ${y(20+4*d)}L${x(20+4*d)} ${y(0)}" class="${base?'sim-curve-base':'sim-demand'}"/><path d="M${x(4+4*supply)} ${y(0)}L${x(28+4*supply)} ${y(24)}" class="${base?'sim-curve-base':'sim-supply'}"/>`;
    let grid='';for(let i=0;i<=4;i++){grid+=`<path d="M100 ${y(i*7)}H790M${x(i*8)} 68V388" stroke="#294b63" stroke-width="1"/>`+text(66,y(i*7)+5,i*7)+text(x(i*8)-5,416,i*8);}
    return svg('market','Interactive supply and demand model',`Your demand shift is ${s.d}; supply shift is ${s.supply}. Equilibrium is ${s.price} credits and ${s.quantity} crates.`,
      `<rect width="900" height="480" fill="#102c40"/>${grid}<path d="M100 58v330h705" stroke="#a8c6d4" stroke-width="2"/>${text(40,35,'Price · credits')}${text(615,455,'Quantity · crates')}${line(0,0,true)}${line(s.d,s.supply)}${s.campaign?'<path d="M100 '+y(s.campaign.price)+'H790" stroke="#fd9b9c" stroke-width="3" stroke-dasharray="5 7"/>'+text(584,y(s.campaign.price)-11,s.campaign.ceiling?'Price ceiling':'Price floor'):''}<path d="M100 ${y(s.price)}H${x(s.quantity)}V388" stroke="#b7ead5" stroke-width="1.5" stroke-dasharray="6 6"/><circle cx="${x(s.quantity)}" cy="${y(s.price)}" r="13" fill="#b7ead533"/><circle cx="${x(s.quantity)}" cy="${y(s.price)}" r="6" fill="#b7ead5"/>${text(x(s.quantity)+17,y(s.price)-14,'Equilibrium','sim-equilibrium-label')}${text(x(20+4*s.d)-10,370,'D','sim-demand-label')}${text(x(28+4*s.supply)-23,y(24)-14,'S','sim-supply-label')}`);
  }
  function policyArt(v) {
    const s=v??{economy:[5,7,1,-2,50],projected:[5,7,1,-2,50],selected:'rates-up',committed:false};
    let blocks='';const employment=clamp(1-(s.campaign?.after??s.projected)[1]/20,.15,1);
    for(let b=0;b<7;b++){const x=48+b*113,h=[115,164,128,205,150,183,110][b],y=350-h;blocks+=`<g><rect x="${x}" y="${y}" width="86" height="${h}" rx="3" fill="${b%2?'#4a7687':'#7393a0'}"/>`;for(let row=0;row<Math.floor(h/28)-1;row++)for(let col=0;col<3;col++)blocks+=`<rect x="${x+12+col*23}" y="${y+17+row*25}" width="12" height="13" fill="${(row*3+col)/18<employment?'#ffdf9c':'#345467'}"/>`;blocks+='</g>';}
    return svg('policy','A fictional economy and its public institutions',`Unemployment is ${s.economy[1]} percent and growth is ${s.economy[2]} percent. City lighting reflects projected employment in this illustrative model.`,
      `<defs><linearGradient id="policy-sky" x2="0" y2="1"><stop stop-color="#c1d9e4"/><stop offset="1" stop-color="#edf0dd"/></linearGradient></defs><rect width="900" height="480" fill="url(#policy-sky)"/><circle cx="726" cy="87" r="33" fill="#fff0bc"/><path d="M0 350h900v130H0z" fill="#365e66"/>${blocks}<path d="M0 397h900" stroke="#aec3b6" stroke-width="4" stroke-dasharray="34 22"/><g transform="translate(325 273)"><path d="M-25 0 68-60 160 0z" fill="#24465d"/><rect x="-8" width="151" height="93" fill="#d7dfd9"/><path d="M0 84h135M-14 98h163" stroke="#b9cbc8" stroke-width="12"/><path d="M13 13v65M49 13v65M85 13v65M121 13v65" stroke="#fff8df" stroke-width="14"/></g>${tree(257,320)}${tree(739,335)}<g class="sim-city-caption"><rect x="28" y="30" width="260" height="65" rx="12" fill="#142f43"/>${text(47,57,s.committed?'POLICY ENACTED':'POLICY PREVIEW')}${text(47,79,'Fictional economy · model effects')}</g>`);
  }
  function tradeArt(v) {
    const s=v??{capacity:6,units:4,domestic:2,port:'Miro',good:'fruit'};
    let home='',cargo='';for(let i=0;i<s.domestic;i++)home+=crate(108+i%3*29,285-Math.floor(i/3)*26,'#a7d4bc');
    for(let i=0;i<s.units;i++)cargo+=`<rect x="${414+i%4*32}" y="${260-Math.floor(i/4)*24}" width="30" height="22" rx="2" fill="${i%2?'#e9bb75':'#a5cfdb'}" stroke="#24495d"/><path d="M${420+i%4*32} ${264-Math.floor(i/4)*24}v14m8-14v14m8-14v14" stroke="#24495d" opacity=".35"/>`;
    return svg('trade','Your cargo allocation at the port',`${s.units} units are loaded for ${s.port}. ${s.domestic} units remain for domestic buyers.`,
      `<defs><linearGradient id="trade-water" x2="0" y2="1"><stop stop-color="#2a7586"/><stop offset="1" stop-color="#153e59"/></linearGradient></defs><rect width="900" height="480" fill="url(#trade-water)"/><path d="M0 0h230l28 142-30 95 32 94-32 149H0z" fill="#9dbdaa"/><path d="M900 0H720l-34 142 25 95-20 94 34 149h175z" fill="#a9c7ac"/><path d="M219 192H340v40H219M686 193H586v40h100" stroke="#d6cba5" stroke-width="16" fill="none"/><path d="M275 165Q451 63 632 165" fill="none" stroke="#bee9de" stroke-width="2" stroke-dasharray="10 10"/><g class="sim-route-dashes"><path d="M300 347q144 82 320 0" fill="none" stroke="#8cc6ca" stroke-width="2" stroke-dasharray="9 12"/></g><g><rect x="54" y="134" width="130" height="97" fill="#d1deda"/><path d="m42 134 77-43 77 43z" fill="#244d66"/><rect x="89" y="180" width="58" height="51" fill="#34626b"/></g>${home}<g class="sim-ship" style="--cargo-load:${s.units}"><path d="M377 285h215l-30 49H405z" fill="#1b3042"/><path d="M377 285h215" stroke="#e6ece1" stroke-width="8"/><rect x="553" y="227" width="25" height="53" fill="#edf0d5"/><rect x="557" y="235" width="12" height="13" fill="#2f697d"/>${cargo}<path d="M427 346h105" stroke="#b9e0db" stroke-width="3" stroke-linecap="round"/></g><g stroke="#e6c77d" stroke-width="7" fill="none"><path d="M750 275V128h90M750 128l75 62M825 128v62"/></g><g class="sim-map-label"><rect x="50" y="38" width="148" height="38" rx="8" fill="#142f43"/>${text(72,64,'HOME PORT')}<rect x="714" y="38" width="150" height="38" rx="8" fill="#142f43"/>${text(731,64,s.port.toUpperCase())}</g>`);
  }
  function escapeArt(v) {
    const s=v??{unlocked:false,round:1,name:'Workshop door'};let books='';
    for(let row=0;row<3;row++)for(let i=0;i<9;i++)books+=`<rect x="${80+i*18}" y="${135+row*58}" width="13" height="${34+i%3*4}" rx="2" fill="${['#769c9c','#bf9a6a','#668aa6'][i%3]}"/><path d="M${83+i*18} ${143+row*58}h7" stroke="#ded4b2"/>`;
    return svg('escape','The economics archive',s.unlocked?'The door is open. Continue to the next room.':'A locked door, an evidence desk and a hint book. Use the scene buttons to inspect them.',
      `<defs><radialGradient id="escape-light"><stop stop-color="#4c5d68"/><stop offset="1" stop-color="#172a3c"/></radialGradient></defs><rect width="900" height="480" fill="url(#escape-light)"/><path d="M0 378h900v102H0z" fill="#30404b"/><path d="M0 480 360 378m540 102L540 378M0 422h900" stroke="#52606b" stroke-width="2"/><path d="M65 115h188v241H65z" fill="#1e3443" stroke="#718a92" stroke-width="6"/>${books}<path d="M65 178h188M65 236h188M65 294h188" stroke="#718a92" stroke-width="5"/><path d="M347 113q104-72 208 0v265H347z" fill="#a5bea9" stroke="#839ea2" stroke-width="12"/><path d="M365 124q86-64 172 0v248H365z" fill="${s.unlocked?'#b4ecd5':'#203d51'}"/><g class="sim-vault-door${s.unlocked?' is-open':''}" style="transform-origin:365px 245px"><path d="M365 124q86-64 172 0v248H365z" fill="#355b70" stroke="#6c8c97" stroke-width="3"/><rect x="415" y="193" width="76" height="83" rx="10" fill="#172f43" stroke="#93b2b6" stroke-width="2"/><path d="M435 224v-13a18 18 0 0 1 36 0v13" fill="none" stroke="#d9d8b4" stroke-width="5"/><rect x="430" y="223" width="46" height="31" rx="4" fill="#d9bd78"/><circle cx="453" cy="236" r="4" fill="#233f50"/></g><g><path d="M635 285h190v22H635zM655 307v83m148-83v83" fill="none" stroke="#ae8e65" stroke-width="11"/><path d="M673 242h92v40h-92z" fill="#f0e1b5"/><path d="M686 253h61m-61 10h44" stroke="#65716a" stroke-width="3"/><path d="M785 227v56M770 245h30" stroke="#d2b66c" stroke-width="5"/><path d="M777 218h16l6 28h-28z" fill="#f5d89b"/></g><g class="sim-map-label"><rect x="358" y="30" width="185" height="35" rx="8" fill="#132c3f"/>${text(378,54,s.unlocked?'ACCESS GRANTED':'ARCHIVE SECURED')}</g>`);
  }
  const art={island:islandArt,market:marketArt,policy:policyArt,trade:tradeArt,escape:escapeArt};
  const metric = (label,value,note='') => `<div class="sim-metric"><span>${esc(label)}</span><strong>${esc(value)}</strong>${note?`<small>${esc(note)}</small>`:''}</div>`;
  const action = (name,label,disabled=false,accessibleLabel=label) => `<button type="button" data-sim-action="${name}" aria-label="${esc(accessibleLabel)}"${disabled?' disabled':''}>${esc(label)}</button>`;
  const forecastLabels=['Inflation','Unemployment','Growth','Budget balance','Living standards'];
  const forecastUnits=['%','%','%',' cr',''];
  function meter(label,value,target) {
    const maximum=Math.max(value,target,1);
    return '<div class="sim-goal" data-met="' + (value>=target?'yes':'no') + '"><span>' + esc(label) +
      '</span><strong>'+value+' / '+target+'</strong><meter aria-label="'+esc(label)+'" min="0" max="'+maximum+'" value="'+value+
      '"></meter></div>';
  }

  function indicatorHistory(values) {
    if (values.length<2) return '';
    const low=Math.min(...values),high=Math.max(...values);
    const coords=values.map((value,i)=>[5+i*70/(values.length-1),21-(high===low ? .5 : (value-low)/(high-low))*17]);
    return '<svg class="sim-indicator-trend" viewBox="0 0 80 26" role="img" aria-label="Quarter history: ' +
      values.map(esc).join(', ') + '"><polyline points="'+coords.map(point=>point.join(',')).join(' ')+'"/>' +
      coords.map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="2"/>').join('')+'</svg>';
  }

  function cabinetReadout(s,blocked) {
    const policyShortcuts=[['rates-up','Raise rates'],['rates-down','Cut rates'],['spending','Invest'],
      ['training','Training'],['tax','Raise taxes'],['targeted-support','Income support'],['competition','Ease entry barriers']];
    return '<div class="mission-data sim-forecast"><table><caption>Quarter forecast</caption><thead><tr><th scope="col">Indicator</th>' +
      '<th scope="col">Opening</th><th scope="col">No new policy</th><th scope="col">'+(s.committed?'Enacted':'Your plan')+
      '</th></tr></thead><tbody>' + forecastLabels.map((label,i)=>
      '<tr><th scope="row">'+label+indicatorHistory(s.trend.map(values=>values[i]))+'</th>'+
      [s.baseline,s.without,s.after].map(values=>'<td>'+values[i]+forecastUnits[i]+'</td>').join('')+'</tr>').join('') +
      '</tbody></table></div><div class="sim-toolbar">'+policyShortcuts.map(([id,label])=>action('policy-'+id,label,blocked)).join('')+'</div><p class="sim-event"><strong>'+(s.committed?'Decision enacted':'Current choice')+'</strong> '+esc(s.policyName)+'</p>'+
      (s.future.some(Boolean)?'<p class="sim-note">Effects due next quarter: '+s.future.map((value,i)=>
        value ? esc(forecastLabels[i]+' '+signed(value)+forecastUnits[i]) : '').filter(Boolean).join(' · ')+'.</p>':'')+
      '<p class="sim-note">Fictional effects. The skyline lights illustrate employment.</p>';
  }

  function dashboard(game,s) {
    const blocked=s.phase!=='playing'||s.committed;
    if(game==='policy'&&s.mission)return cabinetReadout(s,blocked);
    if(game==='island') {
      const outputs=s.mission ? '<div class="sim-goals">'+meter('Baskets available',s.food,s.minCrop)+meter('Tools available',s.stock,s.minTools)+'</div>' : '';
      return `<div class="sim-metrics">${metric('Farm workers',s.assigned)}${metric('Workshop workers',s.workers-s.assigned)}${metric('Crop harvest',s.crops)}${metric('Tools produced',s.tools)}</div>
        ${outputs}<div class="sim-toolbar">${action('farm','Assign to farm',blocked||s.assigned>=s.workers)}${action('workshop','Assign to workshop',blocked||s.assigned<=0)}</div>
        ${s.mission?'':'<p class="sim-event"><strong>Island conditions</strong> '+esc(s.event)+'</p>'}${s.mission&&s.campaign&&s.round<s.total?'<p class="sim-note">Next season: '+esc(s.next)+'</p>':''}`;
    }
    if(game==='market') {
      const notes=s.mission ? `<div class="sim-chart-key"><span>Demand</span><span>Supply</span><span>Original curves</span>${s.campaign?'<span>Price control</span>':''}</div>` : '';
      return `<div class="sim-metrics">${metric('Equilibrium price',s.price+' credits',s.baseline?'Original: '+s.baseline.price:'')}${metric('Equilibrium quantity',s.quantity+' units',s.baseline?'Original: '+s.baseline.quantity:'')}${metric('Demand',s.d<0?'Left':s.d>0?'Right':'Unchanged')}${metric('Supply',s.supply<0?'Left':s.supply>0?'Right':'Unchanged')}</div>
        ${notes}<div class="sim-curve-controls"><div><span class="sim-demand-key">Demand curve</span>${action('d-left','Shift left',blocked||s.d<=-1,'Shift demand left')}${action('d-right','Shift right',blocked||s.d>=1,'Shift demand right')}</div><div><span class="sim-supply-key">Supply curve</span>${action('s-left','Shift left',blocked||s.supply<=-1,'Shift supply left')}${action('s-right','Shift right',blocked||s.supply>=1,'Shift supply right')}</div>${action('market-reset','Reset curves',blocked)}</div>
        ${s.mission?'':'<p class="sim-event"><strong>Market news</strong> '+esc(s.news)+'</p>'}`;
    }
    if(game==='policy'){
      const labels=['Inflation','Unemployment','Growth','Budget balance','Living standards'],suffix=['%','%','%',' credits',' index'];
      return `<div class="sim-policy-metrics">${labels.map((label,i)=>{const n=(s.campaign?.after ?? s.projected)[i],current=s.economy[i],delta=s.committed&&s.before?n-s.before[i]:n-current;return `<div class="sim-metric"><span>${label}</span><strong>${esc(n+suffix[i])}</strong><small>${s.committed?'Enacted':current+suffix[i]+' now'} · ${signed(delta)} ${s.committed?'this turn':'projected'}</small></div>`;}).join('')}</div><div class="sim-toolbar">${action('policy-rates-up','Raise rates',blocked)}${action('policy-rates-down','Cut rates',blocked)}${action('policy-spending','Invest',blocked)}${action('policy-training','Train workers',blocked)}${action('policy-tax','Raise taxes',blocked)}</div><p class="sim-event"><strong>${s.committed?'Decision enacted':'Selected policy'}</strong> ${esc(s.policyName)}</p><p class="sim-note">${s.delayed?'Skills training takes one turn. The current turn includes any training effects already due.':'Projections include any training effects arriving this turn.'} The lights illustrate employment in the model.</p>`;
    }
    if(game==='trade') {
      const limit=s.route?.limit??s.capacity, reserve=s.reserve??2;
      const limits=s.mission?'<div class="sim-goals">'+meter('Domestic stock',s.domestic,reserve)+
        '<div class="sim-goal" data-met="'+(s.units<=limit?'yes':'no')+'"><span>Cargo limit</span><strong>'+
        s.units+' / '+limit+'</strong><meter aria-label="Cargo loaded" min="0" max="'+Math.max(s.units,limit)+
        '" value="'+s.units+'"></meter></div></div>':'';
      return `<div class="sim-metrics">${metric('Export cargo',s.units+' / '+s.capacity,s.route?'Contract: '+s.route.name:'')}${metric('Domestic supply',s.domestic+' units','Keep at least '+reserve)}${metric('Gross receipts',(s.campaign?.gross??s.receipts)+' credits')}${metric('Goods balance',signed(s.balance)+' credits','Cumulative')}</div>
        ${limits}<div class="sim-toolbar">${action('load','Load export unit',blocked||s.units>=s.capacity)}${action('unload','Return unit to home port',blocked||s.units<=0)}<p>${esc(s.good)} bound for ${esc(s.port)}.</p></div>
        <div class="sim-trade-invoice"><span>Import order: <strong>${s.importUnits} machines</strong></span><span>Exchange rate: <strong>${s.rate} foreign per home credit</strong></span><span>Tariff: <strong>${s.tariff} per machine</strong></span></div>`;
    }
    return `<div class="sim-room-route" aria-label="Room progress">${Array.from({length:s.total},(_,i)=>`<span class="${i+1<s.round?'is-past':i+1===s.round?'is-current':''}"${i+1===s.round?' aria-current="step"':''}>Room ${i+1}</span>`).join('')}</div><div class="sim-escape-summary"><strong>${esc(s.name)}</strong><span>${s.unlocked?'Door unlocked':s.committed?'Code rejected — try again':'Door locked'}</span></div><p class="sim-note">Select the evidence desk, hint book or vault lock in the scene. ${s.sequence?'This room uses a sequence lock.':'Enter your answer in the decision console.'}</p>`;
  }

  function campaignDashboard(game,s) {
    const plan=s.campaign;
    if(!plan)return '';
    let details='';
    if(game==='island'){
      details=metric('Tools from reserves',plan.stock)+metric('Tools after proposed spend',plan.available)+
        metric('Preparation',plan.project?(plan.funded?'Upgrade funded':'Needs unmet'):plan.ready?'Reserve ready':'Hold reserves');
      if(s.mission)details+=metric('Baskets from reserves',plan.foodReserve)+metric('Next season’s stores',
        plan.carried.food+' baskets · '+plan.carried.tools+' tools');
    }
    if(game==='market'){
      const gap=plan.gap>0?'shortage':plan.gap<0?'surplus':'no gap';
      details=metric('Price '+(plan.ceiling?'ceiling':'floor'),plan.price+' credits',plan.binding?'Binding in your model':'Non-binding in your model')+
        metric('Buyer demand',plan.buyers+' crates')+metric('Seller supply',plan.sellers+' crates')+
        metric('Projected result',Math.abs(plan.gap)+' · '+gap,plan.sold+' crates traded');
    }
    if(game==='policy'){
      details=metric('Second policy',plan.secondary??'None')+
        (s.mission?metric('Budget limit',s.allowance?'Up to '+s.allowance+' credits lower':'Hold or improve'):
          plan.future.map((value,i)=>value?metric('Next turn · '+forecastLabels[i],signed(value)):'').join(''));
    }
    if(game==='trade'){
      details=metric('Gross export receipts',plan.gross+' credits')+metric('Domestic setup fee',plan.fee+' credits');
    }
    if(game==='escape')details=metric('Locks in this room',s.unlocked?'Both unlocked':'Two codes required',
      s.mission&&s.attempts?s.attempts+' attempt'+(s.attempts===1?'':'s'):'');
    return '<section class="campaign-readout"><h2>Campaign dashboard</h2><div class="sim-policy-metrics">'+details+'</div></section>';
  }
  function hotspots(game,s) {
    if(game!=='escape')return '';
    if(s.phase!=='playing')return '';
    const disabled=false;
    return `<div class="sim-hotspots">${action('hint','Inspect hint book',disabled)}${action('lock',s.unlocked?'Return to console':'Use vault lock',disabled)}${action('evidence','Inspect evidence',disabled)}</div>`;
  }
  function update(game,s) {
    if(!s||game!==active)return;
    view=s;
    const visual=root.querySelector('#simulation-visual'),data=root.querySelector('#simulation-dashboard');
    if(visual)visual.innerHTML=art[game](s)+hotspots(game,s);
    if(data)data.innerHTML=dashboard(game,s)+campaignDashboard(game,s);
    if (game==='trade') root.querySelector('.sim-ship')?.classList.toggle('is-dispatched',s.phase==='playing' && s.committed);
  }
  window.updateGameScene=update;
  window.renderGameGui=(game,s) => {
    active=game;view=s;
    document.body.dataset.game=game??'hub';
    document.body.dataset.phase=s?.phase??'hub';
    if(!game){
      root.querySelectorAll('article.card').forEach(card=>{const slug=card.querySelector('a')?.getAttribute('href').split('/').pop();if(!art[slug])return;card.dataset.gameCard=slug;card.querySelector('.symbol')?.remove();const preview=document.createElement('div');preview.className='sim-card-art';preview.innerHTML=art[slug](null);card.prepend(preview);const label=document.createElement('p');label.className='sim-card-kind';label.textContent=kinds[slug];card.insertBefore(label,card.querySelector('h2'));});
      return;
    }
    const [navigation,heading,...controls]=[...root.children];
    const frame=document.createElement('section');frame.className='simulation-frame sim-'+game;
    frame.setAttribute('aria-labelledby','simulation-title');
    heading.querySelector('h1').id='simulation-title';
    const badge=document.createElement('span');badge.className='sim-mode';badge.textContent=s.phase==='intro'?kinds[game]:s.phase==='finished'?'Session complete':s.mode??(s.committed?'Decision reviewed':'Live simulation');heading.prepend(badge);
    const stage=document.createElement('div');stage.className='sim-stage';stage.innerHTML='<div class="sim-stage-top"><span>'+esc(kinds[game])+'</span><span>'+(s.phase==='playing'?'Round '+s.round+' of '+s.total:'Scene preview')+'</span>'+
      (s.phase==='playing'?'<button type="button" class="sim-jump" data-sim-action="decision">'+(s.committed?'Review decision':'Go to your decision')+'</button>':'')+
      '</div><div class="sim-visual" id="simulation-visual"></div><div id="simulation-dashboard"></div><div class="sim-inspector" id="simulation-inspector" tabindex="-1" hidden></div>';
    const consolePanel=document.createElement('div');consolePanel.className='sim-console';consolePanel.append(...controls);
    frame.append(navigation,heading);
    if (s.phase!=='finished') frame.append(stage);
    frame.append(consolePanel);root.append(frame);update(game,s);
  };
  function inputChange(name,change) {
    const form=root.querySelector('#game-turn');if(!form||!view||view.committed||view.phase!=='playing')return;
    const field=form.elements.namedItem(name);if(!field||field.disabled)return;
    field.value=String(change(Number(field.value)));
    field.dispatchEvent(new Event('input',{bubbles:true}));
  }
  root.addEventListener('click',event=>{
    const button=event.target.closest('[data-sim-action]');if(!button||button.disabled)return;
    const name=button.dataset.simAction;
    if(name==='farm'||name==='workshop'){inputChange('workers',n=>clamp(n+(name==='farm'?1:-1),0,view.workers));}
    else if(name==='load'||name==='unload'){inputChange('exports',n=>clamp(n+(name==='load'?1:-1),0,view.capacity));}
    else if(/^[ds]-(left|right)$/.test(name)){inputChange(name[0],n=>clamp(n+(name.endsWith('left')?-1:1),-1,1));}
    else if(name==='market-reset'){inputChange('d',()=>0);inputChange('s',()=>0);}
    else if(name.startsWith('policy-')){
      const form=root.querySelector('#game-turn'),field=form?.elements.namedItem('policy');if(!field||view.committed)return;
      field.value=name.slice('policy-'.length);field.dispatchEvent(new Event('input',{bubbles:true}));
    }else if(name==='hint'||name==='evidence'){
      const inspector=root.querySelector('#simulation-inspector');inspector.hidden=false;inspector.innerHTML='<div><h2>'+ (name==='hint'?'Hint book':'Evidence dossier')+'</h2>'+action('close-inspector','Close')+'</div><p>'+esc(name==='hint'?view.hint:view.clue)+'</p>';inspector.focus();
      const form=root.querySelector('#game-turn'),details=name==='evidence'?form?.querySelector('details.clue'):[...(form?.querySelectorAll('details')??[])].find(d=>d.querySelector('summary')?.textContent==='Hint');if(details)details.open=true;
    }else if(name==='decision'){
      const target=root.querySelector(view.committed?'.feedback':'#game-turn legend');
      target?.setAttribute('tabindex','-1');
      target?.focus();
    }else if(name==='close-inspector'){root.querySelector('#simulation-inspector').hidden=true;root.querySelector('[data-sim-action="evidence"]')?.focus({preventScroll:true});}
    else if(name==='lock'){
      const field=root.querySelector('#game-turn [data-lock-step]:not(:disabled)') ??
        root.querySelector('#game-turn input[name="answer"],#game-turn select[name="answer"],#game-turn select[name="step0"]');
      const target = view.committed ? root.querySelector('#game-next, #game-retry') : field;
      target?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});target?.focus({preventScroll:true});
    }
    // A scene refresh replaces controls; retain keyboard focus on the equivalent action.
    if (!['hint','evidence','lock','close-inspector','decision'].includes(name)) {
      const next=root.querySelector('[data-sim-action="'+name+'"]:not(:disabled)') ?? root.querySelector('#simulation-dashboard button:not(:disabled)');
      next?.focus({preventScroll:true});
    }
  });
})();

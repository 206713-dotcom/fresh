'use strict';
const games = {
  island: ['Scarcity Island','◈','Allocate workers between crops and tools. Balance basic needs as productive capacity changes.','1.2–1.4'],
  market: ['Market Mayhem','⇄','Move curves on a live graph and predict the new equilibrium.','2.2–2.7'],
  policy: ['Policy Panic','◷','Choose policies for a fictional economy and deal with their delayed effects.','4.1–4.7'],
  trade: ['Trade Tycoon','◎','Commit production to export contracts and balance imports, currency and tariffs.','5.1, 6.1–6.4'],
  escape: ['Economics Escape Room','✦','Open clues, decode calculations and assemble chains of reasoning to unlock rooms.','Units 1–6']
};
const root = document.querySelector('#game-root');
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const prefix = 'ecbiz-arcade-v1-';
const load = (key, fallback) => { try { return JSON.parse(localStorage.getItem(prefix + key)) ?? fallback; } catch { return fallback; } };
function save(key, value) {
  try { localStorage.setItem(prefix + key, JSON.stringify(value)); }
  catch { const status = document.querySelector('#storage-status'); if (status) status.textContent = 'Browser storage is unavailable. You can finish this session in this tab.'; }
}
const topics = ['Basic economic problem','Allocation of resources','Microeconomic decision-makers','Government and the macroeconomy','Economic development','International trade'];
const integer = (value, min, max) => Math.max(min, Math.min(max, Math.round(Number(value) || 0)));
const link = (title, href) => '<a class="button" href="' + href + '">' + escape(title) + '</a>';
const input = (name, label, min, max, value) => '<label>' + label + ' <input name="' + name + '" type="number" step="any" min="' + min + '" max="' + max + '" value="' + value + '" required></label>';
const select = (name, label, options) => '<label>' + label + ' <select name="' + name + '" required>' + options.map(([id, title]) => '<option value="' + id + '">' + escape(title) + '</option>').join('') + '</select></label>';
const stats = entries => '<div class="stats">' + entries.map(([name, value]) => '<span>' + escape(name) + ' <strong>' + escape(value) + '</strong></span>').join('') + '</div>';
const result = (points, explanation, topic) => ({points, explanation, topic});
const roundNumber = state => state.round + state.seed;
let activeGame;
let state;
let savedSession;

function graph(canvas, xLabel, yLabel, maxX, maxY, lines, point) {
  const context = canvas.getContext('2d');
  if (!context) return;
  const left = 57, right = 486, top = 20, bottom = 237;
  const x = n => left + n / maxX * (right - left);
  const y = n => bottom - n / maxY * (bottom - top);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = '13px system-ui';
  context.fillStyle = '#173541';
  context.strokeStyle = '#516e71';
  context.beginPath(); context.moveTo(left, top); context.lineTo(left, bottom); context.lineTo(right, bottom); context.stroke();
  for (let i = 0; i <= 4; i++) {
    context.fillText(String(Math.round(maxY * i / 4)), 27, y(maxY * i / 4) + 4);
    context.fillText(String(Math.round(maxX * i / 4)), x(maxX * i / 4) - 5, bottom + 17);
  }
  context.fillText(yLabel, 10, 14); context.fillText(xLabel, 340, 277);
  lines.forEach(({coords, color, label, dashed}) => {
    context.strokeStyle = context.fillStyle = color;
    context.lineWidth = 2.5;
    context.setLineDash(dashed ? [5, 5] : []);
    context.beginPath();
    coords.forEach(([a,b], i) => i ? context.lineTo(x(a), y(b)) : context.moveTo(x(a), y(b)));
    context.stroke();
    const [a,b] = coords.at(-1);
    context.fillText(label, Math.min(x(a)+4, 488), Math.max(y(b)-6, 18));
  });
  context.setLineDash([]);
  context.fillStyle = '#16323b'; context.beginPath(); context.arc(x(point[0]),y(point[1]),5,0,Math.PI*2); context.fill();
}
function chart(label) { return '<figure><canvas width="520" height="288" role="img" aria-label="' + label + '"></canvas><figcaption id="chart-description" aria-live="polite"></figcaption></figure>'; }

const islandEvents = [
  ['Normal harvest',0,0],['A crop machine arrives',0,1],['A storm reduces available land',-2,0],
  ['Toolmakers receive training',0,2],['Additional workers arrive',2,0],['A water shortage cuts usable plots',-1,0]
];
function islandModel(s) {
  const [event, plots, bonus] = islandEvents[roundNumber(s) % islandEvents.length];
  const workers = 8 + plots + (s.mode === 'challenge' ? 1 : 0);
  return {event, workers, crop: 2 + (bonus === 1 ? 1 : 0), tool: 1 + (bonus === 2 ? 1 : 0),
    minCrop: Math.ceil(workers / 2), minTools: 2 + (s.mode === 'challenge' ? 1 : 0)};
}
const island = {
  help:'Move the allocation slider. Each worker needs a usable plot and a kit. Aim for the food and tool targets, then explain the sacrifice.',
  render(s) {
    const m = islandModel(s);
    return '<div class="board"><div>' + stats([['Labour, plots and kits',m.workers],['Crops per worker',m.crop],['Tools per worker',m.tool]]) +
      '<p><strong>' + m.event + '.</strong> Supply at least ' + m.minCrop + ' baskets and ' + m.minTools + ' tools.</p>' +
      '<label>Workers assigned to crops <input type="range" name="workers" min="0" max="' + m.workers + '" value="' + Math.floor(m.workers/2) + '"></label>' +
      select('cost','If one worker moves from tools to crops, what is given up?', [['crop','Crop output'],['tools',m.tool + ' tool(s)'],['none','Nothing']]) +
      '</div>' + chart('Production possibility frontier, baskets on the horizontal axis and tools on the vertical axis') + '</div>';
  },
  preview(form,s) {
    const m = islandModel(s), crops = Number(form.elements.workers.value) * m.crop, tools = (m.workers - Number(form.elements.workers.value)) * m.tool;
    graph(form.querySelector('canvas'),'Tools','Crop baskets',m.workers*m.crop,m.workers*m.tool,[{coords:[[0,m.workers*m.tool],[m.workers*m.crop,0]],color:'#196e57',label:'PPC'}],[crops,tools]);
    form.querySelector('figcaption').textContent = 'Allocation produces ' + crops + ' baskets and ' + tools + ' tools. All workers are assigned.';
  },
  judge(data,s) {
    const m = islandModel(s), workers = integer(data.workers,0,m.workers);
    const crops = workers*m.crop, tools = (m.workers-workers)*m.tool;
    return result(Number(crops>=m.minCrop && tools>=m.minTools)+Number(data.cost==='tools'),
      'Your island produced ' + crops + ' baskets and ' + tools + ' tools. One extra worker in crops costs ' + m.tool +
      ' tool(s). Reallocating workers moves along the frontier. A change in usable inputs or productivity changes the frontier.', '1.4');
  }
};

const marketEvents = [
  ['A health campaign makes pears more popular.',1,0,'2.2'],
  ['A fungus destroys part of the pear harvest.',0,-1,'2.3'],
  ['Cheaper packaging reduces sellers’ costs.',0,1,'2.3'],
  ['A substitute becomes cheaper.',-1,0,'2.2'],
  ['A fashion trend raises demand while a crop disease cuts supply.',1,-1,'2.5'],
  ['Growers get better tools while tastes shift away from pears.',-1,1,'2.5']
];
function equilibrium(d,s) { return {price:(16 + 4*d - 4*s)/2, quantity:(24 + 4*d + 4*s)/2}; }
function marketEvent(s) { return marketEvents[roundNumber(s) % (s.mode === 'challenge' ? 6 : 4)]; }
const market = {
  help:'Set each curve to left, unchanged or right. The graph responds instantly. Predict the actual event’s price and quantity effects independently.',
  render(s) {
    return '<div class="board"><div><p><strong>Market news</strong> · ' + marketEvent(s)[0] + '</p>' +
      select('d','Shift demand',[['0','Unchanged'],['-1','Left'],['1','Right']]) +
      select('s','Shift supply',[['0','Unchanged'],['-1','Left'],['1','Right']]) +
      select('prediction','Predict equilibrium price and quantity', [['up/up','Both rise'],['up/down','Price rises, quantity falls'],['down/up','Price falls, quantity rises'],['down/down','Both fall'],['up/same','Price rises, quantity stays unchanged'],['down/same','Price falls, quantity stays unchanged']]) +
      (s.mode === 'challenge' ? input('elasticity','If quantity demanded falls 12% after a 6% price rise, what is the magnitude of PED?',0,9,'') : '') +
      '</div>' + chart('Pear market, quantity on the horizontal axis and price on the vertical axis') + '</div>';
  },
  preview(form) {
    const d=Number(form.elements.d.value), s=Number(form.elements.s.value), e=equilibrium(d,s);
    graph(form.querySelector('canvas'),'Price (credits)','Quantity (crates)',32,28,[
      {coords:[[0,20],[20,0]],color:'#56716a',label:'D₀',dashed:true},
      {coords:[[4,0],[32,28]],color:'#56716a',label:'S₀',dashed:true},
      {coords:[[0,20+4*d],[20+4*d,0]],color:'#1d7059',label:'D'},
      {coords:[[4+4*s,0],[28+4*s,24]],color:'#32578c',label:'S'}
    ],[e.quantity,e.price]);
    form.querySelector('figcaption').textContent = 'Original: 8 credits, 12 crates. Your model: ' + e.price + ' credits, ' + e.quantity + ' crates.';
  },
  judge(data,s) {
    const [news,d,shift,topic] = marketEvent(s), e=equilibrium(d,shift);
    const direction = (a,b) => a>b?'up':a<b?'down':'same';
    const correct = direction(e.price,8)+'/'+direction(e.quantity,12);
    const describe = delta => delta>0?'right':delta<0?'left':'unchanged';
    return result(Number(Number(data.d)===d && Number(data.s)===shift)+Number(data.prediction===correct)+
      Number(s.mode==='challenge' && Number(data.elasticity)===2),
      news + ' Demand: ' + describe(d) + '. Supply: ' + describe(shift) + '. The curves intersect at ' + e.price +
      ' credits and ' + e.quantity + ' crates. Changing the product’s own price causes a movement along a curve.' +
      (s.mode==='challenge'?' PED magnitude = 12 ÷ 6 = 2, so demand is elastic.':''),topic);
  }
};

const policies = [
  ['rates-up','Raise interest rates','Borrowing costs rise, so spending can fall. Inflation pressure eases, with a risk of weaker hiring.',[-1,1,-1,0,-1],0],
  ['rates-down','Cut interest rates','Cheaper borrowing can boost spending and jobs, with a risk of higher inflation.',[1,-1,1,0,1],0],
  ['spending','Increase public investment','Public orders raise demand and jobs. Borrowing needs may rise, while infrastructure can improve living standards.',[1,-1,1,-2,1],0],
  ['training','Fund skills training','Skills can improve job matching and productivity after a delay. Funding reduces the budget balance.',[0,-2,1,-1,1],1],
  ['tax','Raise broad-based taxes','Disposable income and demand can fall. Public revenue rises, but growth and employment can weaken.',[-1,1,-1,2,-1],0]
];
const crises = [
  ['Demand is rising faster than capacity. Ease inflation.','inflation',0,-1,0,'4.7'],
  ['Shops report weak sales and temporary layoffs. Support employment this turn.','jobs',1,-1,0,'4.6'],
  ['Vacancies remain open because applicants lack the required skills. Improve job matching.','skills',1,-1,1,'4.4'],
  ['The budget deficit is growing. Improve the budget balance this turn.','budget',3,1,0,'4.2'],
  ['Output has stagnated and firms have spare capacity. Support growth this turn.','growth',2,1,0,'4.5'],
  ['Outdated skills are holding down living standards. Improve productivity over time.','skills',1,-1,1,'4.4']
];
const indicatorNames = ['Inflation %','Unemployment %','Growth %','Budget balance (credits)','Living standards index'];
const policy = {
  help:'Choose a policy and the causal chain that justifies it. Training takes one turn. Indicators carry forward. Each effect is a fictional model assumption.',
  render(s) {
    const [crisis] = crises[roundNumber(s)%crises.length];
    return stats(indicatorNames.map((name,i)=>[name,s.economy[i]])) + '<p class="clue">' + crisis + '</p>' +
      (s.pending ? '<p>Last turn’s training effects arrive when you confirm this turn.</p>' : '') +
      select('policy','Cabinet decision',policies.map(([id,label])=>[id,label])) +
      select('reason','Your causal chain',policies.map(([id,,reason])=>[id,reason]).reverse());
  },
  judge(data,s) {
    const [,goal,indicator,direction,delayed,topic]=crises[roundNumber(s)%crises.length];
    const [id,label,reason,effect,delay]=policies.find(p=>p[0]===data.policy);
    const previous=s.pending ?? [0,0,0,0,0];
    s.economy=s.economy.map((value,i)=>i<2 ? Math.max(0,value+previous[i]+(delay?0:effect[i])) : value+previous[i]+(delay?0:effect[i]));
    s.pending=delay ? effect : null;
    const fits=Math.sign(effect[indicator])===direction && delay===delayed && (goal!=='skills'||id==='training');
    return result(Number(fits)+Number(data.reason===id),label+'. '+reason+' '+(fits?'This fits the stated objective.':'Compare this policy’s timing and effect with the crisis objective.')+' Model dashboard: '+indicatorNames.map((name,i)=>name+' '+s.economy[i]).join(', ')+'. Actual effects depend on spare capacity, confidence and implementation.',topic);
  }
};

const ports=[
  ['Miro','fruit',8,2,0],['Tava','cloth',12,3,0],['Orin','fruit',10,2,2],
  ['Selka','cloth',12,4,1],['Daro','fruit',15,3,3],['Nera','cloth',14,2,2]
];
function tradeModel(s) {
  const [port,good,price,rate,tariff]=ports[roundNumber(s)%ports.length];
  return {port,good,price,rate,tariff,capacity:s.mode==='challenge'?8:6, importUnits:2+(s.round%2), foreignCost:12};
}
const trade={
  help:'Allocate limited production between a confirmed export order and domestic supply. Convert the import price by dividing by the rate, then add the tariff. The trade balance counts exports minus import value before domestic tariffs.',
  render(s) {
    const m=tradeModel(s);
    return stats([['Capacity',m.capacity],['Foreign credits per home credit',m.rate],['Cumulative goods balance',s.balance]]) +
      '<p class="clue">Fictional partner '+m.port+' orders '+m.good+' at '+m.price+' home credits per unit. Keep at least two units for domestic supply.</p>' +
      '<p>Import '+m.importUnits+' machines at '+m.foreignCost+' foreign credits each. Your government charges '+m.tariff+' home credits per machine.</p>' +
      input('exports','Units for export',0,m.capacity,Math.max(0,m.capacity-2)) +
      input('cost','Landed import cost in home credits',0,500,'') +
      '<p class="trade-preview" aria-live="polite"></p>';
  },
  preview(form,s) {
    const m=tradeModel(s), units=integer(form.elements.exports.value,0,m.capacity);
    form.querySelector('.trade-preview').textContent=(m.capacity-units)+' units stay at home. Export receipts: '+units*m.price+' home credits.';
  },
  judge(data,s) {
    const m=tradeModel(s), units=integer(data.exports,0,m.capacity);
    const imports=m.importUnits*m.foreignCost/m.rate, cost=imports+m.importUnits*m.tariff, exports=units*m.price;
    s.balance+=exports-imports;
    return result(Number(units===m.capacity-2)+Number(Number(data.cost)===cost),
      'Export receipts '+exports+' and import value '+imports+' give a goods balance of '+(exports-imports)+
      '. Landed cost is '+cost+' home credits, including '+(m.importUnits*m.tariff)+' in domestic tariffs. You kept '+(m.capacity-units)+
      ' units for local buyers. The full current account also includes services and income flows. A stronger currency can reduce import costs, all else equal.','6.4');
  }
};

const rooms=[
  ['1.3','Workshop door','The council funds a clinic. Ranked alternatives were a bus depot, then a park.','Read the order of preference.','Which project is the next-best alternative?', ['Bus depot','Park','Clinic'],0,'Only the best option forgone is the opportunity cost.'],
  ['2.6','Market vault','Pear prices rose 5%. Crates sold fell 15%.','The two changes are percentages. Use the magnitude.','Enter the PED magnitude.',null,3,'15 ÷ 5 = 3. Demand is elastic.'],
  ['3.6','Factory lock','Output is 100 units. Total cost is 700 credits and total revenue is 900 credits.','Profit uses totals.','Enter profit in credits.',null,200,'Revenue minus cost is 900 − 700 = 200 credits.'],
  ['4.6','Employment office','A downturn reduces household spending. Employers face falling sales.','Start with the change in demand.','Put the events in causal order.',['Firms reduce hiring','Sales fall','Households cut spending'],[2,1,0],'Lower spending cuts sales, so firms reduce hiring. This can increase cyclical unemployment.'],
  ['5.1','Development archive','Real GDP per head rose. The extra income mainly went to a small group.','An average says little about how gains are shared.','Which evidence limits the conclusion that everyone is better off?',['Income gains were concentrated','GDP was adjusted for prices','The population has an average income'],0,'An average can rise while many people see no improvement.'],
  ['6.3','Currency safe','One home credit buys 4 foreign credits. A machine costs 48 foreign credits.','Divide the foreign price by the exchange rate.','Enter the machine price in home credits.',null,12,'48 ÷ 4 = 12 home credits.'],
  ['2.5','Final control room','Cheaper electricity lowers production costs. Demand for local goods stays unchanged.','Trace production costs through the supply curve to the new market outcome.','Rebuild the sequence.',['Equilibrium price falls','Supply shifts right','Production costs fall'],[2,1,0],'Lower costs increase supply at each price. With demand unchanged, equilibrium price falls and quantity rises.']
];
function roomFor(s) {
  if (s.unit !== 'mixed') {
    const room=rooms[Number(s.unit)];
    return s.round===0 ? room : extraRooms[Number(s.unit)][(s.round-1)%2];
  }
  return s.round === 6 ? rooms[6] : rooms[roundNumber(s) % 6];
}
const extraRooms=[
  [['1.4','Frontier gate','A machine lets workers make more tools with the same labour.','Capacity changes.','Which frontier change follows?',['Outward towards tools','Inward towards tools','No change'],0,'Greater tool productivity expands what can be produced.'],['1.2','Input store','A bakery uses an oven, workers and a leased plot.','Look for a produced input.','Which is capital?',['Oven','Workers','Plot'],0,'The oven is equipment used to produce goods.']],
  [['2.4','Equilibrium gate','At 5 credits, 25 units are supplied and 17 are demanded.','Compare the two quantities.','Enter the size of the surplus.',null,8,'25 − 17 = 8 units.'],['2.3','Supply store','A fuel price rise raises delivery costs.','An input cost changed.','Which change follows?',['Supply shifts left','Demand shifts right','Supply shifts right'],0,'Higher costs reduce supply at each price.']],
  [['3.5','Productivity gate','A team makes 360 items in 90 hours.','Divide output by hours.','Enter output per hour.',null,4,'360 ÷ 90 = 4 items per hour.'],['3.6','Average cost safe','A workshop makes 80 chairs for a total cost of 400 credits.','Divide the total by output.','Enter cost per chair.',null,5,'400 ÷ 80 = 5 credits.']],
  [['4.7','Price index safe','The price index moves from 125 to 130.','The starting index is the base for the percentage change.','Enter inflation as a percentage.',null,4,'5 ÷ 125 × 100 = 4%.'],['4.2','Budget gate','Government spending is 91 credits and revenue is 84 credits.','Deficit means spending exceeds revenue.','Enter the size of the deficit.',null,7,'91 − 84 = 7 credits.']],
  [['5.3','Population gate','A town records 28 births and 17 deaths, with no migration.','Subtract deaths from births.','Enter the natural increase.',null,11,'28 − 17 = 11.'],['5.2','Poverty archive','A household can afford basic necessities but earns much less than typical households in its country.','Compare with the local standard.','Which concept is illustrated?',['Relative poverty','Absolute poverty','Inflation'],0,'Relative poverty compares a household with the standard in its society.']],
  [['6.4','Goods ledger','Goods exports are 70 credits and goods imports are 42 credits.','Subtract imports from exports.','Enter the balance on goods.',null,28,'70 − 42 = 28 credits.'],['6.2','Border gate','The government caps annual imports of shoes at 2,000 pairs.','The policy limits quantity.','Which measure is this?',['Quota','Tariff','Subsidy'],0,'A quota limits how much can be imported.']]
];
const escapeRoom={
  help:'Open the evidence clue and solve the lock. For sequence locks, choose each step in order. You can retry without a timer.',
  render(s) {
    const [,room,clue,hint,prompt,options,key]=roomFor(s);
    return '<h2>'+room+'</h2><details class="clue"><summary>Inspect evidence</summary><p>'+clue+'</p></details>'+
      '<p><strong>'+prompt+'</strong></p>'+
      (Array.isArray(key) ? key.map((_,i)=>select('step'+i,'Step '+(i+1),[['','Choose…'],...options.map((o,j)=>[j,o])])).join('') :
        options ? select('answer','Unlock with', [['','Choose…'],...options.map((o,j)=>[j,o])]) : input('answer','Lock code',0,9999,''))+
      '<details><summary>Hint</summary><p>'+hint+'</p></details>';
  },
  judge(data,s) {
    const [topic,,,,,,key,why]=roomFor(s);
    const correct=Array.isArray(key)?key.every((v,i)=>String(v)===data['step'+i]):data.answer!==''&&Number(data.answer)===key;
    return result(correct?2:0,(correct?'Door unlocked. ':'Door still locked. ')+why,topic);
  }
};

const engines={island,market,policy,trade,escape:escapeRoom};
function roundCount(s) {
  if (activeGame==='escape') return s.unit==='mixed' ? (s.mode==='challenge'?7:4) : 3;
  return s.mode==='challenge'?6:3;
}
function roundMaximum(s) { return activeGame==='market' && s.mode==='challenge' ? 3 : 2; }
function validSession(value) {
  return value && ['practice','challenge'].includes(value.mode) && Number.isInteger(value.round) &&
    value.round>=0 && value.round<roundCount(value) && Array.isArray(value.history) && Number.isInteger(value.seed);
}
function changePage() {
  const [,slug] = location.hash.split('/');
  activeGame=Object.hasOwn(games,slug) ? slug : null;
  savedSession=activeGame ? load(activeGame,null) : null;
  state=null;
  render();
  window.scrollTo(0,0);
}
function render() {
  renderGameContent();
  window.renderGameGui(activeGame);
}
function renderGameContent() {
  if (!activeGame) {
    root.innerHTML='<div class="hero"><h1>Economics Games</h1><p>Run an island, move markets and solve economic puzzles using fictional scenarios.</p></div><div class="grid">'+
      Object.entries(games).map(([slug,[name,icon,description,tag]])=>{
        const best=load(slug+'-best',null);
        return '<article class="card"><span class="symbol" aria-hidden="true">'+icon+'</span><h2>'+name+'</h2><p>'+description+
          '</p><p><small>Syllabus '+tag+' · Practice or challenge<br>Best: '+(best===null?'—':best+'%')+
          '</small></p>'+link('Play '+name,'#games/'+slug)+'</article>';
      }).join('')+'</div>';
    return;
  }
  const [name,,description,tag]=games[activeGame];
  const engine=engines[activeGame];
  const title='<div class="actions">'+link('← All games','#games')+'</div><header class="hero"><h1>'+name+'</h1><p>'+description+'</p></header>';
  const status='<p id="storage-status" role="status"></p>';
  if (!state) {
    root.innerHTML=title+'<section class="panel"><h2>How to play</h2><p>'+engine.help+'</p><p>Syllabus '+tag+'</p>'+
      '<form id="game-start">'+select('mode','Mode',[['practice','Practice · 3–5 minutes'],['challenge','Challenge · more rounds']])+
      (activeGame==='escape'?select('unit','Room pack',[['mixed','Mixed review'],...topics.map((topic,index)=>[index,topic])]):'')+
      '<div class="actions"><button class="primary">Start new game</button>'+
      (validSession(savedSession)?'<button type="button" id="game-continue">Continue session</button>':'')+'</div></form></section>'+status;
    return;
  }
  if (state.finished) {
    const points=state.history.reduce((n,row)=>n+row.points,0);
    root.innerHTML=title+'<section class="panel"><h2>Game complete</h2><p>'+points+' of '+roundCount(state)*roundMaximum(state)+
      ' game points</p><ol>'+state.history.map(row=>'<li><p>'+escape(row.explanation)+' '+link('Revise '+row.topic,'economics.html#revision-topics/'+row.topic)+'</p></li>').join('')+
      '</ol><div class="actions"><button id="game-replay" class="primary">Play again</button>'+link('Choose another game','#games')+'</div></section>'+status;
    return;
  }
  root.innerHTML=title+'<div class="stats"><span>Round '+(state.round+1)+' of '+roundCount(state)+'</span><span>'+
    state.history.reduce((n,row)=>n+row.points,0)+' game points</span></div><section class="panel"><details><summary>Help</summary><p>'+engine.help+
    '</p></details><form id="game-turn"><fieldset '+(state.feedback?'disabled':'')+'><legend>Your decision</legend>'+engine.render(state)+
    '</fieldset><button class="primary" '+(state.feedback?'hidden':'')+'>'+(activeGame==='escape'?'Try the lock':'Confirm decision')+
    '</button></form>'+(state.feedback?'<div class="feedback" role="status"><strong>'+state.feedback.points+' of '+roundMaximum(state)+
      ' game points</strong><p>'+escape(state.feedback.explanation)+'</p></div><div class="actions">'+
      (activeGame==='escape' && state.feedback.points===0 ? '<button id="game-retry" class="primary">Try again</button>' :
        '<button id="game-next" class="primary">'+(state.round+1===roundCount(state)?'See results':'Next round')+'</button>')+
      (activeGame!=='escape' && state.mode==='practice' && state.feedback.points<roundMaximum(state)?'<button id="game-retry">Retry this round</button>':'')+
      '</div>':'')+'<p><button id="game-pause">Save and pause</button></p></section>'+status;
  const form=root.querySelector('#game-turn');
  if (state.draft) {
    Object.entries(state.draft).forEach(([key,value])=>{const field=form.elements.namedItem(key); if(field)field.value=value;});
  }
  engine.preview?.(form,state);
}
root.addEventListener('input',event=>{
  const form=event.target.closest('#game-turn');
  if (!form || state.feedback) return;
  state.draft=Object.fromEntries(new FormData(form));
  engines[activeGame].preview?.(form,state);
  save(activeGame,state);
});
root.addEventListener('submit',event=>{
  event.preventDefault();
  const data=Object.fromEntries(new FormData(event.target));
  if(event.target.id==='game-start'){
    state={mode:data.mode,unit:data.unit??'mixed',round:0,seed:Math.floor(Math.random()*6),history:[],economy:[5,7,1,-2,50],balance:0};
  }else{
    state.draft=data;
    state.before={economy:state.economy,balance:state.balance,pending:state.pending??null};
    state.feedback=engines[activeGame].judge(data,state);
  }
  render();
  save(activeGame,state);
  const destination = root.querySelector('.feedback') ?? root.querySelector('#game-turn legend');
  destination?.setAttribute('tabindex','-1');
  destination?.focus();
});
root.addEventListener('click',event=>{
  const action=event.target.closest('button')?.id;
  if (!action) return;
  switch(action){
    case 'game-continue': state=savedSession; break;
    case 'game-pause': savedSession=state; state=null; break;
    case 'game-replay': state=null; savedSession=null; break;
    case 'game-retry':
      Object.assign(state,state.before);
      state.feedback=null;
      break;
    case 'game-next': {
      state.history.push(state.feedback);
      state.feedback=null;
      state.draft=null;
      state.round++;
      if(state.round===roundCount(state)){
        state.finished=true;
        const score=Math.round(100*state.history.reduce((n,row)=>n+row.points,0)/(state.round*roundMaximum(state)));
        save(activeGame+'-best',Math.max(score,load(activeGame+'-best',0)));
      }
      break;
    }
    default: return;
  }
  render();
  save(activeGame,state??savedSession);
  const nextFocus = root.querySelector('#game-continue') ?? root.querySelector('#game-turn legend') ?? root.querySelector('.game-scene h1');
  nextFocus?.setAttribute('tabindex','-1');
  nextFocus?.focus();
});
window.addEventListener('hashchange',changePage);
document.addEventListener('DOMContentLoaded', changePage, {once:true});

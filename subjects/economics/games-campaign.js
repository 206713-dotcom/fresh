
/* Extra choices and consequences for Campaign mode. The original modes use their existing rules. */
const campaignBriefs = {
  island: 'Keep the island supplied while investing spare tools in future production.',
  market: 'Model the market shock, then calculate the effect of a price ceiling or floor.',
  policy: 'Combine two policies and meet the cabinet’s objective within its budget constraint.',
  trade: 'Compare export contracts, protect domestic stock and work out your import bill.',
  escape: 'Solve the room lock and use the evidence to solve a second code.'
};
const islandProjects = [
  ['none', 'No investment'], ['irrigation', 'Irrigation · 3 tools'], ['workshop', 'Workshop upgrade · 3 tools']
];
const premiumSetupFees = [9,15,18,21,24,12];
function premiumSetupFee(s) { return premiumSetupFees[roundNumber(s)%premiumSetupFees.length]; }
function campaignChoice(name, label, options) {
  return select(name, label, [['', 'Choose…'], ...options]);
}
function islandInvestment(s, data) {
  const model = islandModel(s);
  const workers = integer(data.workers ?? Math.floor(model.workers/2), 0, model.workers);
  const output = (model.workers-workers)*model.tool;
  const project = islandProjects.find(([key]) => key === data.project && key!=='none')?.[0];
  const stock = s.feedback ? (s.before?.projects?.stock ?? 0) : (s.projects?.stock ?? 0);
  const tools = output + stock;
  const projectCost = project ? 3 : 0;
  return {project, stock, tools, projectCost, available: tools-projectCost,
    funded: workers*model.crop >= model.minCrop && tools-projectCost >= model.minTools};
}
function priceControl(s, demand, supply) {
  const ceiling = s.round % 2 === 0;
  const price = ceiling ? 7 : 9;
  const eq = equilibrium(demand,supply).price;
  const binding = ceiling ? price < eq : price > eq;
  const actual = binding ? price : eq;
  const buyers = Math.max(0,20+4*demand-actual);
  const sellers = Math.max(0,actual+4+4*supply);
  return {ceiling,price,binding,buyers,sellers,gap:buyers-sellers,sold:Math.min(buyers,sellers)};
}
function campaignPolicy(s, data) {
  const primary = policies.find(([id])=>id===data.policy) ?? policies[0];
  const secondary = policies.find(([id])=>id===data.companion && id!==primary[0]);
  const before = s.feedback ? (s.before ?? s) : s;
  const remaining = before.pending ?? [0,0,0,0,0];
  const immediate = [0,0,0,0,0];
  const future = [0,0,0,0,0];
  for (const choice of [primary,secondary].filter(Boolean)) {
    choice[3].forEach((value,i)=>{
      if (choice[4] && i!==3) future[i]+=value;
      else immediate[i]+=value;
    });
  }
  const after = before.economy.map((v,i)=>{
    const n=v+immediate[i]+remaining[i];
    return i===1 ? Math.max(0,n) : n;
  });
  const [,goal,index,direction,delayed,topic] = crises[roundNumber(s)%crises.length];
  const atFullEmployment = goal==='jobs' && before.economy[1]===0 && after[1]===0;
  const meets = delayed ? Math.sign(future[index])===direction
    : atFullEmployment || Math.sign(after[index]-before.economy[index])===direction;
  return {primary,secondary,after,future,meets,budget:after[3]>=before.economy[3],topic};
}
function campaignTrade(s,data) {
  const m=tradeModel(s);
  const units=integer(data.exports??m.capacity-2,0,m.capacity);
  const premium=data.contract==='premium';
  const domestic=m.capacity-units;
  const imports=m.importUnits*m.foreignCost/m.rate;
  const gross=units*(m.price+(premium?3:0));
  const setup=premiumSetupFee(s);
  const fee=premium?setup:0;
  return {m,units,domestic,gross,fee,imports,landed:imports+m.importUnits*m.tariff,
    best:(m.capacity-2)*m.price+Math.max(0,(m.capacity-2)*3-setup)};
}
function secondaryLock(s) {
  const unit=Number(roomFor(s)[0].split('.')[0]);
  const amount=2+(roundNumber(s)%5);
  switch(unit){
    case 1: return ['The workshop now gives up '+amount+' tools to make one extra basket. How many tools are forgone for three extra baskets?', 3*amount];
    case 2: return ['At the posted price, sellers offer '+(14+amount)+' crates and customers demand 14. How many crates are in surplus?', amount];
    case 3: return ['A firm sells '+amount+' units at 15 credits each. Total costs are 10 credits per unit. What is total profit?', 5*amount];
    case 4: return ['The price index starts at 100 and rises to '+(100+amount)+'. What is inflation as a percentage?', amount];
    case 5: return ['The town records '+(21+amount)+' births and 21 deaths, with no migration. What is the natural increase?', amount];
    default: return ['A machine costs '+(4*amount)+' foreign credits. One home credit buys four foreign credits. What is the price in home credits?', amount];
  }
}
function campaignControls(game,s) {
  if(!s.campaign)return '';
  let content;
  if(game==='island')content=select('project','Next-round investment',islandProjects)+
    '<p>Invest only after covering basic needs. Each upgrade adds 1 unit per worker in its sector in later rounds. Spare tools carry over.</p>';
  if(game==='market'){
    const rule=priceControl(s,0,0);
    content='<p>The government sets a price '+(rule.ceiling?'ceiling':'floor')+' of '+rule.price+' credits. Use the curves for the news event.</p>'+
      campaignChoice('marketGap','Effect of the price control',[['shortage','Shortage'],['surplus','Surplus'],['none','No gap']])+
      input('gapSize','Size of the gap in crates',0,32,'');
  }
  if(game==='policy')content=select('companion','Second policy',[['none','No second policy'],...policies.map(([id,name])=>[id,name])])+
    '<p>Meet the stated objective without worsening the budget balance. A duplicate decision counts once. Training costs are paid now and the benefits arrive next turn.</p>';
  if(game==='trade')content=campaignChoice('contract','Export contract',[
    ['local','Standard contract'],['premium','Premium contract · +3 credits per unit, '+premiumSetupFee(s)+'-credit setup cost']
  ])+
    '<p>Maximise export receipts after the domestic setup cost while keeping at least two units at home. The domestic fee is excluded from the balance on goods.</p>'+
    input('netExport','Export receipts after the domestic fee',0,500,'');
  if(game==='escape')content='<p>'+escape(secondaryLock(s)[0])+'</p>'+input('secondCode','Second lock code',0,9999,'');
  return '<section class="campaign-challenge"><h2>Campaign decision</h2>'+content+'</section>';
}
function campaignJudge(game,data,s) {
  if(!s.campaign)return engines[game].judge(data,s);
  if(game==='island'){
    const plan=islandInvestment(s,data), original=engines.island.judge(data,s);
    const invested=Boolean(plan.project&&plan.funded);
    const upgrades=s.projects??{irrigation:0,workshop:0,stock:0};
    const model=islandModel(s);
    s.projects={...upgrades,stock:Math.max(0,plan.tools-model.minTools-(invested?3:0))};
    if(invested)s.projects[plan.project]++;
    const points=Number(plan.funded)+Number(data.cost==='tools')+Number(invested);
    return result(points,original.explanation+' '+(invested?'Upgrade funded.':'No upgrade funded.')+' '+s.projects.stock+' spare tools carried forward.',original.topic);
  }
  if(game==='market'){
    const original=engines.market.judge(data,s);
    const [,d,shift]=marketEvent(s), control=priceControl(s,d,shift);
    const gap=control.gap>0?'shortage':control.gap<0?'surplus':'none';
    const correct=data.marketGap===gap&&data.gapSize!==''&&Number(data.gapSize)===Math.abs(control.gap);
    return result(original.points+Number(correct),original.explanation+' At the trading price, buyers want '+control.buyers+' crates and sellers offer '+control.sellers+'. '+(gap==='none'?'There is no gap.':'There is a '+gap+' of '+Math.abs(control.gap)+' crates.'),original.topic);
  }
  if(game==='policy'){
    const p=campaignPolicy(s,data);
    s.economy=p.after;
    s.pending=p.future.some(Boolean)?p.future:null;
    const points=Number(p.meets)+Number(data.reason===p.primary[0]||data.reason===p.secondary?.[0])+Number(p.budget);
    const applied=[p.primary,p.secondary].filter(Boolean).map(choice=>choice[1]+'. '+choice[2]).join(' ');
    return result(points,applied+' '+(p.meets?'The package meets the objective.':'The package misses the objective.')+' '+(p.budget?'The budget balance holds or improves.':'The budget balance worsens.'),p.topic);
  }
  if(game==='trade'){
    const p=campaignTrade(s,data), net=p.gross-p.fee;
    s.balance+=p.gross-p.imports;
    return result(Number(p.domestic>=2&&net===p.best)+Number(data.cost!==''&&Number(data.cost)===p.landed)+Number(data.netExport!==''&&Number(data.netExport)===net),
      'The shipment earns '+p.gross+' credits gross and '+net+' after the setup fee. The best feasible net receipts were '+p.best+'. The landed import bill was '+p.landed+' and the balance on goods this round was '+(p.gross-p.imports)+'.','6.4');
  }
  const first=engines.escape.judge(data,s), second=data.secondCode!==''&&Number(data.secondCode)===secondaryLock(s)[1];
  const explanation=first.points&&second ? first.explanation+' The second code was '+secondaryLock(s)[1]+'.' :
    'Check the '+(!first.points&&!second?'room lock and the second calculation':!first.points?'room lock':'second calculation')+' before trying again.';
  return result(first.points&&second?2:0,explanation,first.topic);
}
function campaignScene(game,s,data) {
  if(!s.campaign)return null;
  if(game==='island')return islandInvestment(s,data);
  if(game==='market')return priceControl(s,Number(data.d??0),Number(data.s??0));
  if(game==='policy'){
    const {after,secondary,future}=campaignPolicy(s,data);
    return {after,secondary:secondary?.[1],future};
  }
  if(game==='trade'){
    const {gross,fee}=campaignTrade(s,data);
    return {gross,fee};
  }
  return {twoLocks:true};
}

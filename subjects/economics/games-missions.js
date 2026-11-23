/* Mission rules for new sessions. Original sessions keep their saved rules. */
const missionEngines = (() => {
  const within = (value, min, max) => Math.max(min, Math.min(max, value));
  const decimal = value => Number(value.toFixed(1));
  const signed = value => (value > 0 ? '+' : '') + value;
  const correctNumber = (value, answer) => value != null && String(value).trim() !== '' &&
    Number.isFinite(Number(value)) && Math.abs(Number(value) - answer) < 0.05;
  const choice = (name, label, options) => campaignChoice(name, label, options);
  const header = (title, context) => '<div class="mission-brief"><h2>' + escape(title) + '</h2><p>' + escape(context) + '</p></div>';
  const score = (title, topic, explanation, checks, extras = {}) => ({
    title, topic, explanation, checks: checks.map(([label, met]) => ({label, met:Boolean(met)})),
    points: checks.filter(([,met]) => met).length, ...extras
  });
  function order(items, seed) {
    const list = [...items];
    let value = (seed + 1) >>> 0;
    for (let i = list.length - 1; i > 0; i--) {
      value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
      const j = Math.floor(value / 4294967296 * (i + 1));
      [list[i],list[j]] = [list[j],list[i]];
    }
    return list;
  }
  const pick = (items,s) => order(items,s.seed)[s.round % items.length];

  const islandMissions = [
    ['Late monsoon','Rain has arrived late. The food store needs restocking before boats return.',8,1,2,5,3],
    ['New fishing season','The workshop must supply equipment for the fishing fleet. Farm output per worker is steady.',11,2,1,9,4],
    ['Bumper harvest','Good growing conditions raise farm productivity. Local demand is high this turn.',8,3,1,12,3],
    ['Workshop apprenticeship','Newly trained toolmakers can produce more with the same hours.',8,2,2,8,5],
    ['A smaller workforce','Several workers are repairing storm damage. Fewer are available for both sectors.',6,2,2,6,3],
    ['The settlement expands','More households need food and tools. Extra workers are available this season.',12,2,1,11,4],
    ['Water restrictions','Farms use less water and yield less per worker. The workshop can produce at its usual rate.',10,1,2,7,3],
    ['An open trade route','Longer delivery routes make local tool reserves valuable. Growing conditions improve.',10,3,1,11,4],
    ['Repairs before winter','The workshop has better equipment, but repairs around the island increase tool demand.',9,2,2,8,7],
    ['Returning harvest crew','Returning workers raise available labour. The settlement must supply a busy market.',12,2,1,13,3]
  ];
  function islandPlan(s,data) {
    const [title,event,workers,baseCrop,baseTool,minCrop,minTools] = pick(islandMissions,s);
    const reserves = (s.feedback ? s.before?.projects : s.projects) ?? {};
    const crop = baseCrop + (reserves.irrigation ?? 0);
    const tool = baseTool + (reserves.workshop ?? 0);
    const assigned = integer(data.workers ?? Math.floor(workers / 2),0,workers);
    const crops = assigned * crop, tools = (workers - assigned) * tool;
    const food = crops + (reserves.food ?? 0), stock = tools + (reserves.tools ?? 0);
    const fed = food >= minCrop, equipped = stock >= minTools;
    const project = ['irrigation','workshop'].includes(data.project) ? data.project : null;
    const invested = s.campaign && project && fed && stock >= minTools + 3;
    const bank = {
      food: within(food - minCrop,0,8),
      tools: within(stock - minTools - (invested ? 3 : 0),0,8),
      irrigation: (reserves.irrigation ?? 0) + Number(invested && project === 'irrigation'),
      workshop: (reserves.workshop ?? 0) + Number(invested && project === 'workshop')
    };
    // Either an affordable upgrade or a useful buffer is a sound preparedness decision.
    const ready = Boolean(invested || (!project && fed && equipped && bank.food + bank.tools >= 3));
    return {title,event,workers,crop,tool,minCrop,minTools,assigned,crops,tools,food,stock,reserves,fed,equipped,
      project,invested,bank,ready};
  }
  const island = {
    help:'Allocate every worker. Compare the live frontier and projected output with the settlement’s needs. In Campaign, spend spare tools on upgrades or carry reserves forward.',
    render(s) {
      const p = islandPlan(s,{});
      return header(p.title,p.event) + '<p>Supply <b>' + p.minCrop + ' crop baskets</b> and <b>' + p.minTools + ' tools</b>.</p>' +
        '<label>Workers assigned to farming<input type="range" name="workers" min="0" max="' + p.workers + '" value="' + p.assigned + '"></label>' +
        choice('cost','What is given up if one worker moves from tools to crops?',[
          ['crops',p.crop + ' crop basket(s)'],['tools',p.tool + ' tool(s)'],['none','No output']]) +
        (s.campaign ? select('project','Preparation for the next season',islandProjects.map(([id,label]) =>
          [id,id==='none'?'Hold reserves':label])) +
          '<p class="mission-note">After meeting both needs, invest 3 tools or keep at least 3 surplus items in reserves. Stores can hold up to 8 baskets and 8 tools. Upgrades add one unit per worker in that sector from next season.</p>' : '') +
        chart('Production possibility curve showing the attainable combinations of baskets and tools');
    },
    preview(form,s) {
      const p = islandPlan(s,{workers:form.elements.workers.value});
      graph(form.querySelector('canvas'),'Crop baskets','Tools',p.workers*p.crop,p.workers*p.tool,
        [{coords:[[0,p.workers*p.tool],[p.workers*p.crop,0]],color:'#196e57',label:'PPC'}],[p.crops,p.tools]);
      form.querySelector('figcaption').textContent = p.crops + ' baskets and ' + p.tools + ' tools produced. A move along the frontier reallocates labour.';
    },
    snapshot(s,data) {
      const p = islandPlan(s,data);
      const next = pick(islandMissions,{...s,round:s.round+1})[0];
      return {...p,next, campaign:s.campaign ? {stock:p.reserves.tools ?? 0,
        available:p.stock-(p.project?3:0),project:p.project,funded:Boolean(p.invested),
        foodReserve:p.reserves.food ?? 0,carried:p.bank,ready:p.ready} : null};
    },
    judge(data,s) {
      const p = islandPlan(s,data);
      if (s.campaign) s.projects = p.bank;
      return score(p.title,'1.4',
        'You produced ' + p.crops + ' baskets and ' + p.tools + ' tools. With reserves, you had ' +
        p.food + ' baskets and ' + p.stock + ' tools before consumption. Moving one toolmaker to farming gains ' +
        p.crop + ' basket(s) and gives up ' + p.tool + ' tool(s). Improvements in output per worker shift the frontier.' +
        (s.campaign ? ' You carried ' + p.bank.food + ' baskets and ' + p.bank.tools + ' tools forward.' +
          (p.invested ? ' The upgrade raises next season’s capacity.' : '') : ''),
        [['Supply both essentials',p.fed && p.equipped],['Identify the opportunity cost',data.cost==='tools'],
          ...(s.campaign ? [['Fund an upgrade or build a reserve',p.ready]] : [])]);
    }
  };

  // Qd = A - bP, Qs = C + eP. Shifts change the intercepts in quantity units.
  const marketMissions = [
    ['Pear harvest','A fungus damages the pear crop.','pears',32,4,2,2,4,8,0,-1,6,true, 8,16,'demand'],
    ['Bicycle commute','A new cycle route makes bicycles more popular.','bicycles',32,4,2,2,8,4,1,0,10,true, 10,5,'supply'],
    ['Lamp assembly','Cheaper components reduce lamp makers’ unit costs.','lamps',36,3,3,1,6,7,0,1,9,false, 5,15,'demand'],
    ['Train tickets','Bus fares fall. Rail travel and bus travel are substitutes.','rail tickets',28,4,2,2,8,4,-1,0,8,false, 20,5,'supply'],
    ['Berry market','A popular recipe raises demand. A poor harvest cuts supply.','berries',34,4,2,2,6,4,1,-1,9,true, 12,6,'demand'],
    ['Used tablets','Cheaper new tablets reduce demand for used ones. A repair technique also makes refurbishment cheaper.','used tablets',38,4,3,1,7,11,-1,1,8,true, 10,15,'supply'],
    ['Bakery orders','Tourist demand rises and bakeries open an extra shift.','bread',31,4,2,1,7,8,1,1,9,false, 4,12,'demand'],
    ['Ferry fares','A bridge opens and reduces passenger demand. Higher fuel costs also reduce ferry supply.','ferry trips',42,5,3,2,8,3,-1,-1,9,false, 20,10,'supply'],
    ['Heating oil','A cold spell raises demand for heating oil while supply remains stable.','heating oil',42,3,3,2,5,4,1,0,10,true, 15,3,'demand'],
    ['Refurbished desks','More schools buy refurbished desks. At the same time, higher delivery costs reduce supply.','desks',37,4,2,3,6,9,1,-1,11,true, 5,10,'supply'],
    ['Greenhouse tomatoes','A new greenhouse reduces costs, raising supply. Demand is steady.','tomatoes',40,4,2,2,6,8,0,1,6,true, 8,4,'demand'],
    ['Cinema visits','Households cut spending on cinema visits during a downturn.','cinema tickets',42,5,4,1,7,4,-1,0,8,false, 12,9,'supply']
  ];
  const marketFrom = ([title,news,good,a,c,b,e,demandStep,supplyStep,actualD,actualS,controlPrice,ceiling,pctP,pctQ,elasticity]) =>
    ({title,news,good,a,c,b,e,demandStep,supplyStep,actualD,actualS,controlPrice,ceiling,pctP,pctQ,elasticity});
  function shiftedMarket(m,d,s) {
    const a = m.a + m.demandStep*d, c = m.c + m.supplyStep*s;
    const price = (a - c) / (m.b + m.e);
    const quantity = a - m.b*price;
    const binding = m.ceiling ? m.controlPrice < price : m.controlPrice > price;
    const tradedAt = binding ? m.controlPrice : price;
    const buyers = Math.max(0,a - m.b*tradedAt);
    const sellers = Math.max(0,c + m.e*tradedAt);
    return {a,c,price,quantity,control:{ceiling:m.ceiling,price:m.controlPrice,binding, buyers:decimal(buyers),sellers:decimal(sellers),
      gap:decimal(buyers-sellers),sold:decimal(Math.min(buyers,sellers))}};
  }
  const direction = value => Math.abs(value)<1e-6 ? 'same' : value>0 ? 'up' : 'down';
  const directionText = {up:'rises',down:'falls',same:'is unchanged'};
  const shifts = [['0','Unchanged'],['-1','Left'],['1','Right']];
  const market = {
    help:'Read the headline, move demand and supply independently, and use the live graph to compare equilibria. Each mission specifies the size of one shift.',
    render(s) {
      const m = marketFrom(pick(marketMissions,s));
      const variable = m.elasticity === 'demand' ? 'demanded' : 'supplied';
      return header(m.title,m.news) + '<p class="mission-note">One demand shift moves quantity by ' + m.demandStep +
        ' units at every price. One supply shift moves it by ' + m.supplyStep + '.</p>' +
        select('d','Demand curve',shifts) + select('s','Supply curve',shifts) +
        choice('priceDirection','Compared with the original equilibrium, price…',Object.entries(directionText)) +
        choice('quantityDirection','Compared with the original equilibrium, quantity…',Object.entries(directionText)) +
        (s.mode==='challenge' ? input('elasticity','Price rose ' + m.pctP + '%. Quantity ' + variable +
          (m.elasticity==='demand'?' fell ':' rose ') + m.pctQ + '%. Find the magnitude of price elasticity.',0,10,'') : '') +
        (s.campaign ? '<div class="campaign-challenge"><h2>Price control</h2><p>Apply a ' + (m.ceiling?'maximum':'minimum') +
          ' price of ' + m.controlPrice + ' credits to the correctly shifted market.</p>' +
          choice('marketGap','Effect at the trading price',[['shortage','Shortage'],['surplus','Surplus'],['none','No gap']]) +
          input('gapSize','Size of the gap (units, to one decimal if needed)',0,100,'') + '</div>' : '');
    },
    snapshot(s,data) {
      const m = marketFrom(pick(marketMissions,s));
      const d = Number(data.d ?? 0), supply = Number(data.s ?? 0);
      const baseline = shiftedMarket(m,0,0), view = shiftedMarket(m,d,supply);
      const solved = shiftedMarket(m,m.actualD,m.actualS);
      const selected = s.feedback ? solved : view;
      return {...m,d:s.feedback?m.actualD:d,supply:s.feedback?m.actualS:supply,price:decimal(selected.price),
        quantity:decimal(selected.quantity),curve:{a:selected.a,c:selected.c,b:m.b,e:m.e,baseA:m.a,baseC:m.c,point:selected,original:baseline},
        baseline:{price:decimal(baseline.price),quantity:decimal(baseline.quantity)},
        campaign:s.campaign ? selected.control : null};
    },
    judge(data,s) {
      const m = marketFrom(pick(marketMissions,s));
      const original = shiftedMarket(m,0,0), actual = shiftedMarket(m,m.actualD,m.actualS);
      const p = direction(actual.price-original.price), q = direction(actual.quantity-original.quantity);
      const gap = actual.control.gap;
      const gapType = gap>0?'shortage':gap<0?'surplus':'none';
      const movement = value => value>0?'shifts right':value<0?'shifts left':'stays in place';
      const elasticity = m.pctQ / m.pctP;
      return score(m.title,s.campaign?'2.10':s.mode==='challenge'?(m.elasticity==='demand'?'2.6':'2.7'):'2.5',
        'Demand ' + movement(m.actualD) + ' and supply ' + movement(m.actualS) + '. Equilibrium price ' + directionText[p] +
        ' (' + decimal(original.price) + ' → ' + decimal(actual.price) + ' credits). Quantity ' + directionText[q] +
        ' (' + decimal(original.quantity) + ' → ' + decimal(actual.quantity) + ' units).' +
        (s.mode==='challenge' ? ' The elasticity magnitude is ' + m.pctQ + ' ÷ ' + m.pctP + ' = ' + elasticity + '.' : '') +
        (s.campaign ? ' At the trading price, quantity demanded is ' + actual.control.buyers + ' and quantity supplied is ' +
          actual.control.sellers + '. ' + (gap ? 'The '+gapType+' is '+Math.abs(gap)+' units.' : 'There is no gap.') : ''),
        [['Place both curves',Number(data.d)===m.actualD && Number(data.s)===m.actualS],
          ['Predict both equilibrium changes',data.priceDirection===p && data.quantityDirection===q],
          ...(s.mode==='challenge'?[['Calculate price elasticity',correctNumber(data.elasticity,elasticity)]]:[]),
          ...(s.campaign?[['Identify the price-control result',data.marketGap===gapType && correctNumber(data.gapSize,Math.abs(gap))]]:[])]);
    }
  };

  const cabinetPolicies = [
    {id:'rates-up',name:'Raise interest rates',reason:'Dearer credit can cool borrowing and spending, easing demand-pull inflation.',now:[-2,1,-1,0,0]},
    {id:'rates-down',name:'Cut interest rates',reason:'Cheaper credit can raise spending and output, supporting jobs.',now:[1,-1,1,0,0]},
    {id:'spending',name:'Increase public investment',reason:'Public orders support output and jobs now. Better infrastructure can raise later capacity.',now:[1,-1,2,-2,1],later:[0,0,1,0,1]},
    {id:'training',name:'Fund skills training',reason:'Training costs money now. Better skills improve productivity and help workers match vacancies later.',now:[0,0,0,-1,0],later:[0,-2,1,0,1]},
    {id:'tax',name:'Raise broad-based taxes',reason:'Higher taxes collect revenue and reduce household spending, weakening demand.',now:[-1,1,-1,3,-1]},
    {id:'targeted-support',name:'Target income support',reason:'Transfers raise purchasing power and can improve material living standards for low-income households.',now:[1,0,1,-1,2]},
    {id:'competition',name:'Ease barriers to entry',reason:'More firms can enter after adjustment, expanding capacity and increasing competitive pressure on prices.',now:[0,0,0,0,0],later:[-1,-1,1,0,1]}
  ];
  const cabinetMissions = [
    ['Demand is overheating','Retail spending is racing ahead of capacity. Ease inflation this quarter.',[2,0,1,0,0],0,-1,false,0,'4.7'],
    ['A jobs slowdown','Retailers report weak sales. Reduce unemployment or keep it at the model’s 2% floor this quarter.',[0,2,-1,0,0],1,-1,false,2,'4.6'],
    ['Skills mismatch','Employers have vacancies that many applicants cannot fill. Improve job matching through a delayed reduction in unemployment.',[0,2,-1,0,0],1,-1,true,1,'4.4'],
    ['Financing public services','A spending overrun worsens public finances. Improve the budget balance this quarter.',[0,0,0,-2,0],3,1,false,0,'4.2'],
    ['Factories have spare capacity','Utilisation is low and output growth is weak. Raise growth this quarter.',[0,1,-2,0,0],2,1,false,2,'4.5'],
    ['Households under pressure','Low-income households have lost purchasing power. Improve the living standards index this quarter.',[0,0,0,0,-3],4,1,false,1,'5.2'],
    ['Small firms need space to grow','Firms face barriers to expanding output. Raise longer-run growth through a policy with delayed benefits.',[0,0,-1,0,-1],2,1,true,2,'4.4'],
    ['Price pressures persist','Demand grew strongly last quarter. Reduce inflation this quarter while protecting the budget.',[1,0,1,0,0],0,-1,false,0,'4.3'],
    ['Incomes recover slowly','Recovery has been uneven. Improve living standards through action with a delayed effect.',[0,0,0,0,-2],4,1,true,2,'5.1'],
    ['New orders are falling','Businesses are cancelling orders as spending weakens. Raise growth this quarter.',[0,1,-1,0,0],2,1,false,2,'4.5']
  ];
  const zero = [0,0,0,0,0];
  const addEconomy = (values,...adjustments) => values.map((n,i) => {
    const value = n + adjustments.reduce((sum,change) => sum + (change?.[i] ?? 0),0);
    return i===1 ? Math.max(2,value) : value;
  });
  function cabinetPlan(s,data) {
    const [title,crisis,shock,index,desired,delayed,allowance,topic] = pick(cabinetMissions,s);
    const previous = s.feedback ? (s.before ?? s) : s;
    const baseline = addEconomy(previous.economy,shock);
    const primary = cabinetPolicies.find(policy => policy.id===data.policy);
    const secondary = s.campaign ? cabinetPolicies.find(policy => policy.id===data.companion && policy!==primary) : undefined;
    const packagePolicies = [primary,secondary].filter(Boolean);
    const incoming = previous.pending ?? zero;
    const without = addEconomy(baseline,incoming);
    const after = addEconomy(without,...packagePolicies.map(policy=>policy.now));
    const future = zero.map((_,i)=>packagePolicies.reduce((sum,policy)=>sum+(policy.later?.[i] ?? 0),0));
    const meets = Boolean(primary && (delayed ? Math.sign(future[index])===desired :
      Math.sign(after[index]-without[index])===desired ||
      (index===1 && without[1]===2 && packagePolicies.some(policy=>policy.now[1]<0) && after[1]===2)));
    return {title,crisis,topic,delayed,allowance,primary,secondary,baseline,without,after,future,meets,
      budget:after[3]>=baseline[3]-allowance,pending:Boolean(previous.pending?.some(Boolean))};
  }
  const policy = {
    help:'Use the cabinet brief to choose a policy and the mechanism behind it. Read the forecast against the no-new-policy path. Some policies take a quarter to work.',
    render(s) {
      const p = cabinetPlan(s,{});
      return header(p.title,p.crisis) +
        '<p class="mission-note">' + (p.pending ? 'The previous package has delayed effects arriving in this quarter. ' : '') +
        (s.campaign ? (p.allowance?'The budget balance may worsen by at most ' + p.allowance + ' credits.':'Keep the budget balance at least as high as it is now.') : '') +
        '</p>' +
        choice('policy','Primary policy',cabinetPolicies.map(({id,name})=>[id,name])) +
        (s.campaign ? select('companion','Second policy',[['none','No second policy'],...cabinetPolicies.map(({id,name})=>[id,name])]) : '') +
        choice('reason','Which mechanism supports a policy you chose?',order(cabinetPolicies,s.seed+s.round).map(({id,reason})=>[id,reason]));
    },
    snapshot(s,data) {
      const p = cabinetPlan(s,data);
      return {...p,economy:s.feedback?s.economy:p.baseline,projected:p.after,before:p.baseline,selected:p.primary?.id,
        policyName:p.primary?.name ?? 'Choose a policy',trend:s.history.map(row=>row.economy).filter(Boolean),campaign:s.campaign ? {after:p.after,secondary:p.secondary?.name,future:p.future} : null};
    },
    judge(data,s) {
      const p = cabinetPlan(s,data);
      s.economy = p.after;
      s.pending = p.future.some(Boolean) ? p.future : null;
      const applied = [p.primary,p.secondary].filter(Boolean);
      return score(p.title,p.topic,applied.map(policy=>policy.name + '. ' + policy.reason).join(' ') +
        ' ' + (p.meets?'The package meets the stated objective.':'The package misses the stated objective or takes effect at the wrong time.') +
        ' The budget balance moves from ' + p.baseline[3] + ' to ' + p.after[3] + ' credits.' +
        (s.pending ? ' Delayed effects carry into the next quarter.' : ''),
        [['Meet the objective at the right time',p.meets],['Match a policy to its mechanism',applied.some(policy=>policy.id===data.reason)],
          ...(s.campaign?[['Stay within the budget limit',p.budget]]:[])],{economy:p.after});
    }
  };

  // Home credits unless a value is explicitly quoted in foreign credits.
  const tradeMissions = [
    ['Orin’s fruit order','Orin','fruit',9,3,3,3,18,2,6,9,5,13,17,[6,-4,2]],
    ['Tava’s textile fair','Tava','cloth',10,4,4,2,28,1,6,8,4,14,20,[3,-7,-2]],
    ['Selka’s bicycle docks','Selka','bicycles',11,3,2,4,18,2,7,10,6,15,18,[5,-8,0]],
    ['Daro’s coffee festival','Daro','coffee',9,2,5,3,25,3,4,12,7,13,12,[-4,-6,3]],
    ['The Miro ceramics route','Miro','ceramics',8,3,3,2,21,0,5,11,4,16,18,[4,-5,-5]],
    ['The Nera machine tender','Nera','machine parts',12,4,4,4,32,2,8,9,6,12,25,[-3,-3,2]],
    ['The Havo lantern run','Havo','lanterns',10,3,2,3,16,2,7,8,5,14,26,[1,-8,-1]],
    ['The Vela carpet order','Vela','carpets',9,3,5,2,30,1,5,10,6,12,17,[5,-4,-2]],
    ['Alna’s glassworks','Alna','glass panels',12,3,4,3,36,3,7,12,7,15,21,[-6,-4,3]],
    ['The Sera paper route','Sera','paper',8,2,3,4,15,2,5,8,4,12,9,[2,-5,1]]
  ];
  function shippingPlan(s,data) {
    const [title,port,good,capacity,reserve,rate,importUnits,foreignCost,tariff,baseLimit,basePrice,
      premiumLimit,premiumPrice,fee,flows] = pick(tradeMissions,s);
    const routes = [
      {id:'local',name:'Standard freight',limit:baseLimit,price:basePrice,fee:0},
      {id:'premium',name:'Priority freight',limit:premiumLimit,price:premiumPrice,fee}
    ];
    const route = routes.find(route=>route.id===data.contract) ?? routes[0];
    const imports = importUnits*foreignCost/rate;
    const landed = imports + importUnits*tariff;
    const exportCap = Math.min(capacity-reserve,route.limit);
    const units = integer(data.exports ?? Math.min(Math.floor(capacity/2),exportCap),0,capacity);
    const shipped = Math.min(units,route.limit);
    const gross = shipped*route.price;
    const balance = gross-imports;
    const current = flows.reduce((sum,flow)=>sum+flow,balance);
    const setup = units ? route.fee : 0;
    const best = Math.max(...(s.campaign?routes:routes.slice(0,1)).map(route=>Math.min(capacity-reserve,route.limit)*route.price-route.fee));
    return {title,port,good,capacity,reserve,rate,importUnits,foreignCost,tariff,routes,route,imports,landed,units,shipped,
      domestic:capacity-units,gross,balance,current,flows,setup,best,feasible:units<=exportCap};
  }
  const trade = {
    help:'Choose how many units to reserve for domestic buyers and how many to load. Contract limits, currency conversion and domestic fees all affect the outcome.',
    render(s) {
      const p = shippingPlan(s,{});
      return header(p.title,p.port + ' is buying ' + p.good + '. Keep at least ' + p.reserve + ' units for domestic buyers.') +
        '<div class="mission-data"><table><thead><tr><th scope="col">Contract</th><th scope="col">Unit price</th><th scope="col">Limit</th><th scope="col">Setup fee</th></tr></thead><tbody>' +
        (s.campaign?p.routes:p.routes.slice(0,1)).map(route=>'<tr><th scope="row">'+route.name+'</th><td>'+route.price+
          '</td><td>'+route.limit+'</td><td>'+route.fee+'</td></tr>').join('') + '</tbody></table></div>' +
        (s.campaign ? choice('contract','Export contract',p.routes.map(({id,name})=>[id,name])) : '') +
        input('exports','Units to load',0,p.capacity,p.units,1) +
        '<p class="mission-note">Import ' + p.importUnits + ' machines at ' + p.foreignCost + ' foreign credits each. ' +
        'One home credit buys ' + p.rate + ' foreign credits. The tariff is ' + p.tariff + ' home credits per machine.</p>' +
        input('cost','Landed bill in home credits',0,500,'') +
        (s.mode==='challenge' ? '<p class="mission-note">Net services ' + signed(p.flows[0]) + ', net primary income ' +
          signed(p.flows[1]) + ', net secondary income ' + signed(p.flows[2]) + ' home credits.</p>' +
          input('current','Current account balance in home credits',-500,500,'') : '') +
        (s.campaign ? input('netExport','Export receipts after the domestic setup fee',0,500,'') : '');
    },
    snapshot(s,data) {
      const p = shippingPlan(s,data);
      return {...p,receipts:p.gross,balance:s.balance,goodsDelta:p.balance,
        campaign:s.campaign?{gross:p.gross,fee:p.setup}:null};
    },
    judge(data,s) {
      const p = shippingPlan(s,data);
      s.balance += p.balance;
      return score(p.title,'6.4','You allocated ' + p.units + ' units for export and kept ' + p.domestic +
        ' units at home. ' + p.shipped + ' units fit the contract, earning ' + p.gross + ' credits. ' +
        (p.feasible?'The shipping and domestic limits were met.':'You exceeded the shipping limit or cut too deeply into domestic stock.') +
        ' Imported goods are worth ' + p.imports + ' credits. The landed bill is ' + p.landed +
        ' after the domestic tariff. The goods balance is ' + signed(p.balance) + '.' +
        (s.mode==='challenge' ? ' Adding services and income gives a current account balance of ' + signed(p.current) + '.' : '') +
        (s.campaign ? ' The shipment earns ' + (p.gross-p.setup) + ' after the domestic fee. The best feasible contract earns ' + p.best + '.' : ''),
        [['Maximise feasible export earnings',p.feasible && p.gross-p.setup===p.best],
          ['Calculate the tariff-inclusive import bill',correctNumber(data.cost,p.landed)],
          ...(s.mode==='challenge'?[['Calculate the current account',correctNumber(data.current,p.current)]]:[]),
          ...(s.campaign?[['Calculate net contract receipts',correctNumber(data.netExport,p.gross-p.setup) && data.contract===p.route.id]]:[])]);
    }
  };

  const newRooms = [
    [
      ['1.4','The idle machinery floor','A factory has idle machines and workers. It currently produces inside its PPC.','Compare actual and maximum possible production.','What does the point show?',['Some resources are underused','Output is unattainable','All available resources are fully used'],0,'A point inside the frontier is possible, but available resources are underused.'],
      ['1.3','The printing schedule','A workshop can make 18 signs and 12 posters, or 14 signs and 20 posters. Both combinations are on its PPC.','Measure what was given up when poster production increased.','How many signs are forgone when output rises from 12 to 20 posters?',null,4,'The workshop gives up 18 − 14 = 4 signs.'],
      ['1.2','The harbour lease','A business leases a naturally sheltered bay, buys a crane and employs dockworkers.','Land includes natural inputs used in production.','Which item belongs to land?',['The sheltered bay','The crane','The dockworkers'],0,'The bay is a natural resource. The crane is capital and the dockworkers provide labour.'],
      ['1.4','The engineering annex','Better equipment raises how many tools workers can make. Maximum food output is unchanged.','Compare the intercepts before and after the change.','Which part of the PPC moves out?',['The tools intercept','The food intercept only','Both intercepts by the same amount'],0,'Tool-making capacity rises, so the PPC extends towards tools while the food intercept stays the same.']
    ],
    [
      ['2.7','The storage terminal','Price rises 8%. Quantity supplied rises 4% as firms release some stock.','Divide the quantity response by the price change.','How many times as large as the quantity change is the price change?',null,2,'Price changes twice as much as quantity. PES is 4 ÷ 8 = 0.5, so supply is price inelastic.'],
      ['2.10','The rent ledger','A legal maximum rent of 60 credits is below equilibrium rent of 80 credits. At 60, 36 homes are demanded and 24 are supplied.','At the legal price, compare the quantities buyers and sellers want to trade.','Enter the shortage in homes.',null,12,'The maximum is binding. Quantity demanded exceeds supply by 36 − 24 = 12 homes.'],
      ['2.5','The greenhouse valve','Growers adopt cheaper irrigation. Consumer tastes for the crop stay the same.','Identify the change at each price before thinking about equilibrium.','Put the events in order.',['Equilibrium price falls','Input costs fall','Supply shifts right'],[1,2,0],'Cheaper irrigation reduces costs, increasing supply at each price. The equilibrium price falls.'],
      ['2.9','The pollution docket','Factory smoke damages nearby houses. The factory pays for its fuel, but residents pay for cleaning.','Identify a cost borne by someone outside the transaction.','Which item is an external cost of production?',['Residents’ cleaning costs','The plant’s fuel bill','Salaries of plant employees'],0,'Residents bear the cleaning cost even though they are outside the production decision.']
    ],
    [
      ['3.1','The payments terminal','A shop records the prices of its stock in credits, allowing customers to compare values.','Focus on what allows comparison.','Which function of money is used?',['Unit of account','Store of value','Standard for deferred payment'],0,'Quoting prices in a common unit lets buyers compare the values of different goods.'],
      ['3.6','The sales receipt','A firm sells 24 chairs at 15 credits each. Total cost is 280 credits.','Calculate total revenue before subtracting cost.','Find total profit.',null,80,'Total revenue is 24 × 15 = 360. Profit is 360 − 280 = 80 credits.'],
      ['3.3','The recruitment board','A new employer seeks more electricians in a town. The supply of electricians is unchanged.','Consider what employers must do to attract scarce workers.','Put the events in order.',['The equilibrium wage rises','Demand for electricians increases','Employers compete for available workers'],[1,2,0],'Higher demand makes employers compete for available workers, raising equilibrium wages with supply unchanged.'],
      ['3.7','The sole supplier','One firm supplies a local service. High costs make it difficult for rivals to enter.','Consider the choices a customer has when the firm raises its price.','What gives this firm pricing power?',['Few alternatives for customers','All firms must charge the same price','The industry has many close rivals'],0,'Barriers to entry and few close alternatives limit the competition this supplier faces.']
    ],
    [
      ['4.6','The labour register','The labour force is 1,200. There are 96 unemployed people actively looking for work.','The labour force includes the employed and unemployed.','Find the unemployment rate as a whole percentage.',null,8,'Unemployment is 96 ÷ 1,200 × 100 = 8%.'],
      ['4.3','The central bank switchboard','The central bank raises interest rates during a period of strong consumer demand.','Start with the effect on a household taking out a loan.','Put the events in order.',['Spending on credit tends to fall','Borrowing becomes more expensive','Demand-pull inflation pressure eases'],[1,0,2],'Dearer credit can slow spending, so demand puts less pressure on prices.'],
      ['4.5','The growth monitor','Real GDP grew from 250 to 270 billion credits.','Use real GDP in the starting year as the denominator.','Find the growth rate as a whole percentage.',null,8,'The increase is 20 out of 250. The growth rate is 8%.'],
      ['4.7','The price index vault','The consumer prices index falls from 160 to 152.','Use the starting value as the base.','By what percentage did the price level fall?',null,5,'The index fell by 8. Dividing by 160 and multiplying by 100 gives a 5% fall.']
    ],
    [
      ['5.3','The population register','There were 56 births, 29 deaths, 13 immigrants and 18 emigrants.','Add natural change and net migration.','Calculate the overall population increase.',null,22,'Natural increase is 27 and net migration is −5, so population rises by 22.'],
      ['5.2','The family budget','A household’s income is too low to afford enough food and safe shelter to meet basic needs.','Identify whether the comparison is with basic needs or with the typical household.','Which form of poverty does the evidence directly show?',['Absolute poverty','Relative poverty only','A rise in the unemployment rate'],0,'Absolute poverty is an inability to meet basic needs such as sufficient food and shelter.'],
      ['5.1','The development monitor','Real GDP per person rose, but average life expectancy fell.','Wellbeing can change in several dimensions at once.','Which conclusion is justified?',['Average output rose while one health measure fell','Everyone has a higher living standard','Higher GDP proves better health'],0,'An increase in output per person does not remove the decline shown by the health indicator.'],
      ['5.4','The training library','Employers need skilled workers. Better schooling helps new workers operate advanced equipment.','Connect workers’ skills to how much they can produce.','Put the events in order.',['Output per worker can rise','Workers use equipment more effectively','Schooling develops relevant skills'],[2,1,0],'Relevant skills can help workers use capital more effectively, raising labour productivity.']
    ],
    [
      ['6.3','The exchange kiosk','One home credit used to buy 3 foreign credits. It now buys 4. A machine still costs 48 foreign credits.','Compute the home-currency cost using each exchange rate.','How many home credits cheaper is the machine now?',null,4,'The home cost falls from 48 ÷ 3 = 16 to 48 ÷ 4 = 12, a fall of 4.'],
      ['6.4','The external accounts room','The goods balance is −24, services are +18, primary income is +4 and secondary income is −3.','Keep the signs of each balance when adding them.','Enter the magnitude of the current account deficit.',null,5,'−24 + 18 + 4 − 3 = −5, a deficit of 5 credits.'],
      ['6.2','The import desk','A government charges 3 credits on each imported coat. The country still accepts any quantity of coats.','Determine whether the measure is a tax or a quantity limit.','Which trade measure is this?',['A tariff','An import quota','An export subsidy'],0,'A tariff is a tax on imports. The charge applies per imported coat.'],
      ['6.3','The exporters’ office','The home currency depreciates. Exporters keep their prices unchanged in home currency.','Track the price a customer abroad pays.','Put the events in order.',['Overseas buyers may order more','Home currency depreciates','The foreign-currency price of exports falls'],[1,2,0],'Depreciation can lower foreign-currency export prices and raise quantity demanded if overseas buyers respond.']
    ]
  ];
  function puzzleRoute(s) {
    const packs = newRooms.map((entries,index)=>[rooms[index],...extraRooms[index],...entries]);
    if (s.unit !== 'mixed') return order(packs[Number(s.unit)] ?? packs[0],s.seed);
    const first = order(packs.map((pack,i)=>order(pack,s.seed+i*11)[0]),s.seed+13);
    const remaining = order(packs.flat().filter(room=>!first.includes(room)),s.seed+29);
    return first.concat(remaining,rooms[6]);
  }
  function lockModel(s) {
    const route = puzzleRoute(s);
    const final = s.unit==='mixed' && s.campaign && s.round===7;
    const [topic,name,clue,hint,prompt,options,key,why] = final ? rooms[6] : route[s.round];
    const tokens = options ? order(options.map((label,index)=>[String(index),label]),s.seed+s.round+21) : null;
    const n = 3+((s.seed+s.round*7)%8);
    const extra = [
      ['A team gives up ' + n + ' tools per extra basket. How many tools does it give up for four baskets?',4*n],
      ['Sellers offer ' + (22+n) + ' units and buyers want 22 at the posted price. What is the surplus?',n],
      ['A firm earns 22 credits per unit on ' + n + ' units. Cost is 14 credits per unit. What is total profit?',8*n],
      ['The price index rises from 100 to ' + (100+n) + '. What is the inflation rate as a percentage?',n],
      ['A town records ' + (34+n) + ' births, 30 deaths and net migration of −4. How much does the population grow?',n],
      ['A shipment costs ' + (n*6) + ' foreign credits. One home credit buys 6 foreign credits. What is the home cost?',n]
    ][Number(topic.split('.')[0])-1];
    return {topic,name,clue,hint,prompt,key,options,tokens,why,extra,sequence:Array.isArray(key)};
  }
  function keyInput(name,label) {
    return input(name,label,0,9999,'',1) + '<div class="mission-keypad" role="group" aria-label="' + escape(label) + ' keypad">' +
      ['1','2','3','4','5','6','7','8','9','Clear','0','Delete'].map(digit =>
        '<button type="button" data-lock-key="' + digit + '" data-lock-field="' + name + '">' + digit + '</button>').join('') + '</div>';
  }
  const escapeRoom = {
    help:'Inspect the evidence, then solve the numerical, multiple-choice or sequence lock. Use the hint when needed. After a failed attempt you can retry or reveal a worked solution to continue.',
    render(s) {
      const r = lockModel(s);
      const controls = r.sequence ?
        '<div class="mission-sequence" role="group" aria-label="Sequence controls"><ol aria-label="Selected steps"></ol><div class="mission-sequence-choices">' +
        r.tokens.map(([id,label])=>'<button type="button" data-lock-step="' + id + '">' + escape(label) + '</button>').join('') +
        '</div><div class="actions"><button type="button" data-lock-undo>Undo last step</button>' +
        '<button type="button" data-lock-clear>Clear sequence</button></div></div><details class="mission-step-menus"><summary>Choose steps with menus</summary>' +
        r.key.map((_,i)=>select('step'+i,'Step '+(i+1),[['','Choose…'],...r.tokens],false)).join('') + '</details>' :
        r.options ? choice('answer','Your answer',r.tokens) : keyInput('answer','Lock code');
      return '<h2 class="mission-room-title">' + escape(r.name) + '</h2><details class="clue"><summary>Inspect evidence</summary><p>' +
        escape(r.clue) + '</p></details><p><strong>' + escape(r.prompt) + '</strong></p>' + controls +
        (s.campaign ? '<div class="campaign-challenge"><h2>Second lock</h2><p>' + escape(r.extra[0]) + '</p>' +
          keyInput('secondCode','Second lock code') + '</div>' : '') +
        '<details><summary>Hint</summary><p>' + escape(r.hint) + '</p></details>';
    },
    snapshot(s) {
      const r = lockModel(s);
      return {...r,unlocked:Boolean(s.feedback?.unlocked),attempts:s.attempts??0,campaign:s.campaign?{twoLocks:true}:null};
    },
    judge(data,s) {
      const r = lockModel(s);
      const first = r.sequence ? r.key.every((value,i)=>String(value)===data['step'+i]) :
        r.options ? String(r.key)===data.answer : correctNumber(data.answer,r.key);
      const second = !s.campaign || correctNumber(data.secondCode,r.extra[1]);
      return score(r.name,r.topic,first&&second?r.why+(s.campaign?' The second code was '+r.extra[1]+'.':''):
        (!first&&!second?'Both locks need another attempt.':!first?'The evidence lock needs another attempt.':'The evidence lock is right. Recheck the second calculation.'),
        [['Solve the evidence lock',first],...(s.campaign?[['Solve the second lock',second]]:[])],
        {unlocked:first&&second,points:s.campaign?Number(first)+Number(second):first?2:0});
    },
    walkthrough(s) {
      const r = lockModel(s);
      return score(r.name,r.topic,r.why+(s.campaign?' The second code was '+r.extra[1]+'.':''),
        [],{unlocked:true,assisted:true,points:0});
    }
  };

  return {island,market,policy,trade,escape:escapeRoom};
})();

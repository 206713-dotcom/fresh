const revisionLab = (() => {
  // Each row supplies an original application task and an explanation for every option.
  // First option in the source is the key. Display order rotates by topic.
  const topics = [
    ['1.1','Scarcity','Limited productive resources force households, firms and governments to choose how to use them.','A town has enough water for only one of two projects. Which concept explains why it must choose?','Scarcity|Available water cannot meet all planned uses.','Inflation|No change in the general price level is described.','Specialisation|The issue is limited resources, not focusing production.'],
    ['1.2','Factors of production','Land is natural resources, labour is human effort, capital is produced equipment and enterprise organises production and takes risks. Their rewards are rent, wages, interest and profit respectively.','Which factor is the cold-storage equipment used by a fruit grower?','Capital|It is a manufactured input used to produce or deliver goods.','Land|The land and other natural resources are separate inputs.','Enterprise|Enterprise is the organisation and risk-taking.'],
    ['1.3','Opportunity cost','Identify the most valuable alternative given up when making a choice.','A council funds a library. Its next preference was a clinic, followed by a park. What is the opportunity cost?','The clinic|It was the highest-ranked alternative forgone.','The park|It was ranked below the clinic.','Both projects|Opportunity cost refers to the next best alternative.'],
    ['1.4','Production possibility curves','A move along the frontier reallocates resources. More or better resources can shift it outwards. A point inside is attainable with resources underused.','A country puts idle machines back into use with unchanged productive capacity. How might its production point move?','From inside towards the PPC|Existing resources are now used more fully.','Outside the PPC|An outside point remains beyond current capacity.','The entire PPC shifts outward|The country is using existing capacity.'],
    ['2.1','Resource allocation','Prices influence how scarce inputs are allocated through decisions about what to produce, how to produce it and who buys it.','A higher selling price makes growing beans more profitable than growing peas. What might growers do?','Allocate more land to beans|The price change gives firms an incentive to redirect inputs.','Automatically buy more beans|The example describes growers deciding what to produce.','Reduce bean output because price rose|A higher selling price can encourage producers to expand output.'],
    ['2.2','Demand','An own-price change moves buyers along demand. Income, tastes and prices of related goods can shift demand.','What happens to demand for bus travel if the price of a substitute rail journey rises?','It shifts right|Some rail users switch to bus travel at each bus fare.','It shifts left|The substitute has become relatively more expensive.','There is a movement along bus demand|The bus fare itself did not change.'],
    ['2.3','Supply','Input costs, productivity, taxes and subsidies can shift supply. An own-price change moves sellers along supply.','Electricity becomes cheaper for bakeries. How does this affect the supply of bread?','It shifts right|Lower production costs make greater supply profitable at each price.','It shifts left|Lower costs encourage rather than discourage supply.','There is only a movement along supply|A change in the selling price would cause that movement.'],
    ['2.4','Equilibrium','Equilibrium is where quantity demanded equals quantity supplied. A shortage creates upward pressure on price and a surplus creates downward pressure.','At $4 buyers want 90 units and sellers offer 120. What is the market imbalance?','A surplus of 30 units|120 supplied minus 90 demanded gives 30.','A shortage of 30 units|Supply exceeds demand.','A surplus of 210 units|Use the difference between the quantities.'],
    ['2.5','Changes in price','Shift the curve affected by the event, then compare the new equilibrium price and quantity with the old ones.','A frost reduces orange harvests. Demand is unchanged. What happens at the new equilibrium?','Price rises and quantity falls|Supply shifts left along the unchanged demand curve.','Price and quantity both rise|Buyers purchase less at the higher price.','Price falls and quantity rises|These are the usual results of an increase in supply.'],
    ['2.6','Price elasticity of demand','Divide percentage change in quantity demanded by percentage change in price. Compare the magnitude with 1, then consider the implications for expenditure and revenue.','Price rises 10% and quantity demanded falls 4%. What is the magnitude of PED?','0.4|Divide 4 by 10. Demand is price inelastic.','2.5|The numerator and denominator are reversed.','6|Elasticity uses a ratio of percentage changes.'],
    ['2.7','Price elasticity of supply','Divide percentage change in quantity supplied by percentage change in price. Spare capacity and time to adjust can make supply more responsive.','Price rises 5% and quantity supplied rises 15%. What is PES?','3|15 divided by 5 equals 3, so supply is elastic.','0.33|This divides price change by quantity change.','10|This subtracts the percentage changes.'],
    ['2.8','Market economies','Prices and profit incentives guide private decisions. Outcomes depend on market conditions and purchasing power.','Who is most likely to receive a scarce good in a market economy?','Buyers willing and able to pay the market price|Price rations scarce goods.','Everyone who needs the good equally|A market allocates by effective demand.','Buyers selected through a national production plan|Private decisions guide a market economy.'],
    ['2.9','Market failure','External costs and benefits affect third parties. Information gaps, public goods and monopoly can also cause inefficient allocation.','A workshop’s fumes cause nearby households to pay for extra cleaning. How should that cost be classified?','External cost|Households outside the transaction bear part of the cost.','Private cost to the workshop|The cost in the question is paid by neighbours.','External benefit|The impact on neighbours is harmful.'],
    ['2.10','Mixed economies','Compare a policy’s effect on incentives or access with its fiscal cost, enforcement needs and possible unintended effects.','What may happen when a rent ceiling is set below equilibrium?','A shortage of rentals|At that rent more tenants want homes than landlords offer.','A surplus of rentals|The rent is below equilibrium, so quantity demanded exceeds quantity supplied.','The demand curve must shift right|A lower rent changes quantity demanded along the curve.'],
    ['3.1','Money and banking','Money facilitates exchange, records value, stores purchasing power and allows payments to be agreed for later. Central and commercial banks serve different roles.','Which function of money helps shoppers compare the prices of two laptops?','Unit of account|A common unit expresses both prices.','Store of value|This concerns keeping purchasing power for later.','Standard of deferred payment|This concerns settling obligations in the future.'],
    ['3.2','Household choices','Spending, saving and borrowing can respond to disposable income, confidence, interest rates, age and cultural habits.','Why might households with variable incomes save more when they can?','To build a buffer for months with lower earnings|Precautionary saving helps smooth spending over time.','To raise the current price level|The decision is about future spending security.','Because saving always increases current consumption|Saving sets aside part of current income.'],
    ['3.3','Workers','Wages depend on labour demand and supply. A legal minimum above equilibrium can create excess labour supply under competitive conditions.','If training for a specialised job takes several years, what is the immediate effect on labour supply after wages rise?','It may increase only a little|New entrants need time to qualify.','It must double|No evidence establishes a proportional change.','It must fall|Higher wages give an incentive to enter, even if entry is slow.'],
    ['3.4','Firms','Firms can be classified by ownership, size and sector. A horizontal merger combines firms at the same stage in the same industry.','Two rival furniture retailers combine. What type of merger is this?','Horizontal|Both firms sell furniture at the same stage.','Vertical|Neither is described as the other’s supplier or distributor.','Conglomerate|The firms are in the same line of business.'],
    ['3.5','Production and productivity','Production is total output. Productivity is output per unit of input. Investment and specialisation can change how much each input produces.','A factory increases output from 400 to 450 items while labour hours rise from 100 to 125. What happens to labour productivity?','It falls from 4 to 3.6 items per hour|Divide each output figure by its corresponding labour hours.','It rises by 50 items per hour|50 is the increase in total output.','It remains unchanged|Output and labour hours changed by different proportions.'],
    ['3.6','Costs, revenue and objectives','Total cost equals fixed plus variable cost. Average total cost equals total cost divided by output. Profit equals total revenue minus total cost.','A firm sells 80 units for $5 each and incurs total costs of $340. What is its profit?','$60|80 × $5 gives $400 revenue. Subtract $340.','$400|That is total revenue.','$4.25|That is average total cost per unit.'],
    ['3.7','Market structures','Compare competition and monopoly in terms of price, choice, quality and profit. Scale economies may affect the comparison.','Which change could increase a monopolist’s market power?','A higher barrier to entry|Potential rivals face greater difficulty entering.','More close substitutes|Buyers gain alternatives.','Many new competing suppliers|Competition makes it harder for one firm to control supply.'],
    ['4.1','Macroeconomic aims','Governments may pursue growth, employment, price stability, a sustainable external position, redistribution and environmental sustainability. The aims can conflict.','Why could rapid growth based on coal-fired production conflict with another government aim?','Rising emissions can undermine environmental sustainability|The production method can impose environmental damage.','Growth automatically raises unemployment|Growing output often increases labour demand.','Growth necessarily lowers prices|Effects on prices depend on demand, costs and capacity.'],
    ['4.2','Fiscal policy','Fiscal policy uses taxation and government spending. Compare revenue with spending to calculate a surplus or deficit.','A government collects $38bn and spends $44bn. What is its budget position?','$6bn deficit|Spending exceeds revenue by $6bn.','$6bn surplus|A surplus requires revenue to exceed spending.','$82bn deficit|The budget balance is the difference.'],
    ['4.3','Monetary policy','Changes in interest rates, money supply or the exchange rate can influence spending, inflation and net exports.','How could raising interest rates reduce demand-pull inflation?','Borrowing becomes more expensive and spending may slow|Lower demand eases upward pressure on prices.','Household debt repayments necessarily fall|Variable-rate payments typically increase.','It immediately increases productive capacity|Its immediate channel here is spending.'],
    ['4.4','Supply-side policy','Education, infrastructure and other measures can improve productivity or incentives, but their effects can take time.','A port upgrade reduces the time exporters wait to ship goods. How can it raise productive capacity?','Firms spend fewer resources on delays per shipment|The same resources can handle more output.','It guarantees higher import tariffs|No change in trade taxes is described.','It reduces worker skills|The measure improves infrastructure.'],
    ['4.5','Growth and recession','Track changes in real GDP. Demand changes affect use of spare capacity, while changes in the quantity or quality of resources affect potential output.','Nominal GDP rises by 6% while the GDP price level rises by 8%. What happens to real output?','It falls|Nominal output rose more slowly than the relevant price index.','It rises by 6%|This is the growth rate before adjusting for prices.','It is unchanged|Nominal GDP and prices rose at different rates.'],
    ['4.6','Unemployment','The unemployment rate is unemployed people as a share of the labour force. Distinguish cyclical, structural, seasonal and frictional causes.','Of 800 people in the labour force, 48 are unemployed. What is the unemployment rate?','6%|48 ÷ 800 × 100 equals 6.','48%|48 is a headcount.','94%|This is the employed share of the labour force.'],
    ['4.7','Inflation','Inflation is a rise in the general price level. CPI changes measure consumer-price inflation. Cost-push and demand-pull inflation have different causes.','The CPI rises from 125 to 130. What is the inflation rate?','4%|Divide the 5-point change by 125 and multiply by 100.','5%|The difference is five index points.','30%|This measures the rise from a base of 100, not from 125.'],
    ['5.1','Living standards','Compare real GDP per head with HDI, which includes health, education and income. Both measures can conceal inequality.','Why might real GDP per head rise while many residents see little improvement?','Most additional income goes to a small group|An average hides how income is distributed.','Real GDP per head is an individual income guarantee|It is an economy-wide average.','Higher average output means every income rises equally|The income distribution may change.'],
    ['5.2','Poverty','Absolute poverty refers to inability to meet basic needs. Relative poverty compares resources with the standard in the society.','A household can afford essentials but has income far below the norm in its country. Which concept is most directly illustrated?','Relative poverty|The comparison is with the prevailing national standard.','Absolute poverty|The household is described as able to meet basic needs.','Structural unemployment|No employment status is given.'],
    ['5.3','Population','Births, deaths and net migration determine population change. The age structure influences demand for services and the size of the workforce.','A region records 900 births, 700 deaths and net outward migration of 300 people. What is the total population change?','A fall of 100|Natural increase is 200, then 300 are lost through net migration.','A rise of 200|That excludes net migration.','A rise of 500|Net outward migration must be subtracted.'],
    ['5.4','Development differences','Differences in resources, infrastructure, investment, productivity, health and education help explain development differences.','How can unreliable electricity hold back economic development?','It disrupts production and discourages investment|Interruptions reduce effective capacity and expected returns.','It raises labour productivity automatically|Power interruptions can leave labour and machines idle.','It guarantees more years of schooling|Unreliable power can also disrupt education.'],
    ['6.1','Specialisation and free trade','Specialisation concentrates resources on fewer products. Trade allows exchange for other products, but reliance on a narrow export base adds risk.','What is a risk for a country that earns most of its export income from tea?','A global fall in tea prices can sharply reduce export revenue|Few other exports offset the decline.','It cannot import any other goods|Trade allows it to buy other goods.','Specialisation eliminates scale economies|Producing more of one good may allow scale economies.'],
    ['6.2','Globalisation and trade restrictions','Lower transport and communication costs can increase cross-border activity. Tariffs, quotas and other restrictions change the costs or volume of trade.','A government limits imported bicycles to 40,000 per year. What has it introduced?','An import quota|The policy directly limits quantity.','A tariff|A tariff taxes imports.','An export subsidy|This would support sellers exporting goods.'],
    ['6.3','Exchange rates','In a floating system currency demand and supply determine the exchange rate. Appreciation can lower import prices and make exports more expensive abroad, other things equal.','One domestic unit goes from buying $0.50 to $0.60 abroad. What happened to the domestic currency?','It appreciated|Each domestic unit now buys more foreign currency.','It depreciated|Depreciation would mean it buys less.','Its exchange rate was unchanged|The price of the currency changed.'],
    ['6.4','Current account','The current account records trade in goods and services and flows of primary and secondary income. A deficit occurs when total debits exceed credits.','Goods balance is −$5bn, services +$4bn, primary income +$2bn and secondary income −$2bn. What is the current account balance?','−$1bn|Add the four signed balances.','+$1bn|The combined balance is negative.','−$5bn|This includes only trade in goods.']
  ].map(([code, title, summary, prompt, ...options], index) => ({
    code, title, summary, prompt,
    options: options.map((_, position) => options[(position + index) % options.length].split('|')),
    answer: (options.length - index % options.length) % options.length
  }));

  return { topics };
})();

const revisionPaper2 = [
  {
    title: 'Section A · Water and farming in Ardin',
    stimulus: 'Ardin is a fictional economy. During a drought, the market price of vegetables rose and monthly sales fell from 8,000 to 6,400 crates. Farms use pumps and refrigerated vans. Some farms installed drip irrigation and produced the same harvest with fewer worker-hours. Farm employment was 1,000 in the north, where rainfall fell 5%, and 700 in the south, where rainfall fell 20%. The government is considering a subsidy for water-saving equipment.',
    parts: [
      [2, 'Calculate the percentage fall in monthly vegetable sales.', '1 mark for (8,000 − 6,400) ÷ 8,000 × 100. 1 mark for 20%.'],
      [2, 'Identify two capital goods used by farms in Ardin.', '1 mark each for pumps and refrigerated vans.'],
      [2, 'Explain why labour productivity rose on farms that installed drip irrigation.', '1 mark for maintaining output with fewer worker-hours. 1 mark for linking this to higher output per worker-hour.'],
      [4, 'Draw and explain a demand and supply diagram showing how the drought could raise vegetable prices.', 'Award 1 mark each for labelled price and quantity axes, correctly labelled initial demand and supply curves, a leftward shift of supply, and a higher equilibrium price shown at the new intersection.'],
      [4, 'Analyse what the regional data suggest about rainfall and farm employment.', 'Credit the contrast in rainfall falls and employment levels, the suggested association, and the limitation that the figures compare different regions. Different initial farm sizes or other differences may explain the employment gap. Award up to 4 for distinct valid points.'],
      [6, 'Discuss whether Ardin should subsidise water-saving equipment.', 'Develop the case that lower purchase costs encourage adoption and reduce pressure on water supplies. Consider fiscal opportunity cost or a rebound effect if farms expand irrigation. Up to 3 per side for a relevant point and a developed chain.']
    ]
  },
  {
    title: 'Section B · Public transport',
    stimulus: 'The city of Vela has crowded roads. It is considering a subsidy for public bus operators and a charge on drivers entering the centre.',
    parts: [
      [2, 'Define an external cost.', '1 mark for a cost affecting a third party. 1 mark for linking it to a production or consumption decision outside that party’s transaction.'],
      [4, 'Explain two possible reasons why commuters may continue driving after bus fares fall.', 'Up to 2 per reason. Credit examples such as poor route coverage or long journey times, each linked to why driving remains more attractive.'],
      [6, 'Analyse how a subsidy to bus operators could affect the market for bus journeys.', 'Credit a lower effective cost of supplying journeys, a rightward supply shift, a lower equilibrium fare, higher equilibrium quantity, and developed links explaining passenger or operator responses. Up to 6 for distinct valid points.'],
      [8, 'Discuss whether a charge on drivers entering the centre would benefit Vela.', 'Develop benefits such as less traffic or pollution as drivers switch modes. Develop drawbacks such as effects on workers with few alternatives or displacement of traffic. Evaluate whether public transport can absorb displaced trips. Use the discussion bands below.']
    ]
  },
  {
    title: 'Section B · Jobs and skills',
    stimulus: 'Talden has lost jobs in clothing manufacture while demand for technicians in other industries has increased. The government is considering training grants and higher public spending.',
    parts: [
      [2, 'Define structural unemployment.', '1 mark for unemployment caused by changes in the structure of the economy. 1 mark for explaining the resulting mismatch between workers and available jobs.'],
      [4, 'Explain two effects of rising unemployment on the government’s budget.', 'Up to 2 per effect. Lower employment can reduce income-tax receipts. More qualifying claimants may raise spending on unemployment support.'],
      [6, 'Analyse how training grants could reduce structural unemployment.', 'Credit lower cost of training, increased participation, acquisition of skills demanded by firms, better matching of vacancies, higher hiring and a fall in structural unemployment. Award up to 6 for developed, distinct links.'],
      [8, 'Discuss whether higher government spending would be the most effective way to reduce unemployment in Talden.', 'Develop how demand stimulus may increase vacancies. Compare this with targeted training or relocation support when skills or geography are the main barriers. Consider time lags or spare capacity. Use the discussion bands below.']
    ]
  },
  {
    title: 'Section B · A growing producer',
    stimulus: 'An appliance maker is deciding whether to expand production at a larger plant or merge with a competitor.',
    parts: [
      [2, 'Define a horizontal merger.', '1 mark for combining firms in the same industry. 1 mark for the same stage of production.'],
      [4, 'Explain two reasons why average costs could fall as output expands.', 'Up to 2 per reason. Credit bulk discounts lowering input cost per unit or spreading fixed costs across more units, with other valid alternatives.'],
      [6, 'Analyse how a sustained rise in wages could affect the firm’s profit.', 'Credit higher labour costs, effects on total cost and profit with revenue unchanged, and a developed response such as price changes affecting demand or higher wages improving retention and productivity. Up to 6 for valid links.'],
      [8, 'Discuss whether consumers would benefit if the two producers merged.', 'Develop possible cost savings passed on through prices or improved investment. Contrast with less choice or greater pricing power. Consider remaining competitors and barriers to entry. Use the discussion bands below.']
    ]
  },
  {
    title: 'Section B · Trade and prices',
    stimulus: 'Nerin imports fuel and exports processed fruit. Its currency depreciates while local food producers are asking for greater protection from overseas competition.',
    parts: [
      [2, 'Define currency depreciation.', '1 mark for a fall in the value of the domestic currency relative to other currencies. 1 mark for identifying the change as arising in a floating exchange-rate system.'],
      [4, 'Explain two reasons why firms in Nerin buy foreign currency.', 'Up to 2 per reason, for example to pay foreign suppliers for imports or to purchase equipment or assets abroad, with the link to payment in foreign currency.'],
      [6, 'Analyse how depreciation could affect the domestic price level.', 'Credit higher domestic-currency import costs, more expensive fuel and other inputs, higher costs across firms, firms passing on costs and a rise in the general price level. Other valid developed channels include higher export demand and pressure on capacity. Up to 6.'],
      [8, 'Discuss whether a tariff on imported food would improve living standards in Nerin.', 'Develop how domestic production and jobs may benefit or how tariff revenue could fund services. Develop costs such as higher food prices, inefficiency or retaliation. Consider the availability of domestic substitutes and impacts on poorer households. Use the discussion bands below.']
    ]
  }
];

const revisionSources = [
  ['2027–2029 syllabus', syllabus],
  ['Paper 1 specimen', 'https://www.cambridgeinternational.org/Images/718808-2027-specimen-paper-1.pdf'],
  ['Paper 1 specimen mark scheme', 'https://www.cambridgeinternational.org/Images/718804-2027-specimen-paper-1-mark-scheme.pdf'],
  ['Paper 2 specimen', 'https://www.cambridgeinternational.org/Images/718809-2027-specimen-paper-2.pdf'],
  ['Paper 2 specimen mark scheme', 'https://www.cambridgeinternational.org/Images/718805-2027-specimen-paper-2-mark-scheme.pdf'],
  ['Cambridge past papers and examiner reports', papers],
  ['Save My Exams revision notes for first exams 2027', notesUrl]
];

function revisionState(key, fallback) {
  try { return JSON.parse(localStorage.getItem('ecbiz-revision-' + key)) ?? fallback; }
  catch { return fallback; }
}

function saveRevisionState(key, value) {
  try {
    localStorage.setItem('ecbiz-revision-' + key, JSON.stringify(value));
    return true;
  } catch {
    const status = document.querySelector('#revision-save-status');
    if (status) status.textContent = 'This browser could not save your progress.';
    return false;
  }
}

function revisionNotesLinks(code) {
  return Object.entries(syllabusNotes).filter(([, note]) => note.codes.some(id => id.startsWith(code + '.')))
    .map(([id]) => lessons.find(lesson => lesson.id === Number(id)))
    .filter(Boolean)
    .map(lesson => link(lesson.title, '#lesson/' + lesson.id)).join('');
}

function revisionHeading(label, title, description) {
  return '<header class="revision-heading"><p class="eyebrow">' + label + '</p><h1>' + title +
    '</h1><p>' + description + '</p></header>';
}

function renderRevisionTool(page, id) {
  if (page === 'revision') return revisionHub();
  const icons = {
    'revision-checklist': '✓', 'revision-topics': '▤', 'revision-test': '◷', 'revision-papers': '↗',
    'revision-mistakes': '↺', 'revision-retry': '↺', 'revision-writing': '✎', 'revision-teach': '◇'
  };
  return '<div class="revision-workspace" data-tool="' + page + '">' +
    '<div class="revision-toolbar">' + link('← Revision Tools', '#revision', 'revision-back') +
    '<span class="revision-workspace-icon" aria-hidden="true">' + icons[page] + '</span></div>' +
    revisionRoutes[page](id) + '</div>';
}

function revisionHub() {
  const groups = [
    ['Review the syllabus', [
      ['▤', 'Cheatsheets and interactive checks', 'Refresh a topic, then test your understanding with instant feedback.', '#revision-topics'],
      ['◇', 'Teach Jojo', 'Explain a concept in your own words and compare it with worked reasoning.', '#revision-teach']
    ]],
    ['Practise for the exam', [
      ['◷', 'Test builder and original mocks', 'Build a custom quiz or sit a timed 2027-style paper.', '#revision-test'],
      ['↗', 'Past papers and specimen materials', 'Find Cambridge’s specimen papers, mark schemes and past-paper directory.', '#revision-papers']
    ]],
    ['Improve your answers', [
      ['↺', 'Mistakes log', 'Retry questions you missed in topic checks and submitted tests.', '#revision-mistakes'],
      ['✎', 'Written-answer review', 'Get a mark and feedback for each saved version.', '#revision-writing']
    ]]
  ];
  return '<div class="revision-hub"><header class="revision-hero"><div><p class="eyebrow">Cambridge IGCSE · 0455</p>' +
    '<h1>Revision Tools</h1><p>Review the six syllabus chapters, practise under exam conditions and revisit questions you missed.</p>' +
    '</div><span class="revision-edition">2027–2029 syllabus</span></header><div class="revision-tool-groups">' +
    groups.map(([title, tools]) => '<section class="revision-tool-group"><h2>' + escapeHtml(title) + '</h2>' +
      tools.map(([symbol, name, description, href]) => '<a class="revision-tool-card" href="' + href + '">' +
        '<span class="revision-tool-icon" aria-hidden="true">' + symbol + '</span><h3>' + escapeHtml(name) + '</h3>' +
        '<p>' + escapeHtml(description) + '</p><span class="revision-tool-arrow" aria-hidden="true">→</span></a>').join('') +
      '</section>').join('') + '</div></div>';
}

function revisionTopics(code) {
  const topic = revisionLab.topics.find(item => item.code === code);
  if (!topic) {
    return revisionHeading('Quick revision', 'Cheatsheets and interactive checks', 'Pick a topic to review and try an application question.') +
      '<div class="revision-collection">' + catalog.slice(0, 6).map((chapter, index) => '<section class="group"><h2>' + escapeHtml(chapter.title) + '</h2>' +
        revisionLab.topics.filter(item => item.code.startsWith(index + 1 + '.')).map(item =>
          link(item.code + ' · ' + item.title, '#revision-topics/' + item.code, 'coverage-link')).join('') + '</section>').join('') + '</div>';
  }
  const complete = revisionState('topics', {})[code] === true;
  return link('← All topics', '#revision-topics', 'text-link') +
    revisionHeading('Syllabus topic ' + topic.code, escapeHtml(topic.title), complete ? 'Application check completed' : 'Cheatsheet and application check') +
    '<div class="revision-columns"><article class="panel revision-recap"><h2>Quick recap</h2><p>' + escapeHtml(topic.summary) + '</p><div class="row">' + revisionNotesLinks(code) + '</div></article>' +
    '<form id="revision-topic-form" class="panel"><h2>' + escapeHtml(topic.prompt) + '</h2>' +
    topic.options.map(([option], index) => '<label class="choice"><input required type="radio" name="answer" value="' + index + '"> ' +
      escapeHtml(option) + '</label>').join('') +
    '<button class="primary">Check answer</button><div class="feedback" role="status" hidden></div><p id="revision-save-status" role="status"></p></form></div>';
}

function recordRevisionMistake(id, text, href, missed) {
  const mistakes = revisionState('mistakes', {});
  if (missed) mistakes[id] = { text, href };
  else delete mistakes[id];
  saveRevisionState('mistakes', mistakes);
}

function setupRevisionTopic(code) {
  const form = document.querySelector('#revision-topic-form');
  if (!form) return;
  const topic = revisionLab.topics.find(item => item.code === code);
  form.onsubmit = event => {
    event.preventDefault();
    const choice = Number(new FormData(form).get('answer'));
    const correct = choice === topic.answer;
    const feedback = form.querySelector('.feedback');
    feedback.hidden = false;
    feedback.innerHTML = '<strong>' + (correct ? 'Correct' : 'Try again') + '</strong><ul>' + topic.options.map(([option, why], index) =>
      '<li><strong>' + escapeHtml(option) + (index === topic.answer ? ' ✓' : '') + '</strong> — ' + escapeHtml(why) + '</li>').join('') + '</ul>';
    recordRevisionMistake('topic-' + code, topic.prompt, '#revision-topics/' + code, !correct);
    if (correct) saveRevisionState('topics', {...revisionState('topics', {}), [code]: true});
  };
}

function revisionMistakes() {
  const entries = Object.values(revisionState('mistakes', {}));
  return revisionHeading('Review', 'Mistakes log', 'This browser stores missed topic checks and multiple-choice test answers.') +
    '<section class="panel revision-queue">' + (entries.length ? '<h2>' + entries.length + (entries.length === 1 ? ' question to retry' : ' questions to retry') + '</h2><ul>' + entries.map(item =>
      '<li>' + link(item.text, item.href, 'text-link') + '</li>').join('') + '</ul>' : '<div class="revision-empty"><h2>No missed questions to review yet</h2>' + link('Try a topic check', '#revision-topics') + '</div>') + '</section>';
}

function revisionPapers() {
  const resource = ([title, href]) => '<li>' + link(title + ' ↗', href, 'text-link') + '</li>';
  const specimen = (title, format, start) => '<section class="panel"><h2>' + title +
    '</h2><p class="revision-spec">' + format + '</p><ul>' +
    revisionSources.slice(start, start + 2).map(resource).join('') + '</ul></section>';
  return revisionHeading('Cambridge 0455', 'Past papers and specimens', 'Use the specimens to practise the 2027 format. Older papers can have different timings, marks and content.') +
    '<div class="revision-collection">' + specimen('Paper 1', 'Multiple choice · 40 marks · 60 minutes', 1) +
    specimen('Paper 2', 'Structured questions · 80 marks · 120 minutes', 3) + '</div>' +
    '<section class="panel revision-resource"><h2>Further reading and practice</h2><ul>' +
    [revisionSources[0], ...revisionSources.slice(5)].map(resource).join('') + '</ul></section>';
}

function revisionWriting(id) {
  const selected = questions.find(question => question.id === id && !question.options);
  if (!selected) {
    return revisionHeading('Automatic marking', 'Written-answer review', 'Choose a question to answer and revise with feedback.') +
      '<div class="revision-collection">' + catalog.slice(0, 6).map((chapter, index) => '<section class="group"><h2>' + escapeHtml(chapter.title) + '</h2>' +
        [2, 4, 6, 8].map(marks => questions.find(question => question.c === index && question.marks === marks && !question.options))
          .filter(Boolean).map(question => link(question.marks + ' marks · ' + question.q, '#revision-writing/' + question.id, 'coverage-link')).join('') + '</section>').join('') + '</div>';
  }
  const versions = revisionState('writing-' + id, []);
  return link('← Choose another question', '#revision-writing', 'text-link') +
    revisionHeading('Automatic marking · ' + selected.marks + ' marks', 'Review your answer', escapeHtml(selected.q)) +
    '<div class="revision-columns revision-writing-columns"><form class="panel" id="revision-writing-form">' + (selected.case ? '<p>' + escapeHtml(selected.case) + '</p>' : '') +
    '<label class="field">Your response<textarea name="response" maxlength="8000" required>' + escapeHtml(versions.at(-1)?.answer ?? versions.at(-1) ?? '') + '</textarea></label>' +
    '<button class="primary">Mark and save version</button><p id="revision-save-status" role="status"></p></form>' +
    '<div id="revision-writing-guide">' + (versions.length ? revisionWritingGuide(selected, versions) : '<section class="panel revision-empty"><h2>Mark scheme</h2><p>Submit an answer to see your mark and feedback.</p></section>') + '</div></div>';
}

function revisionWritingGuide(question, versions) {
  return '<section class="panel"><h2>Question-specific mark scheme</h2><div class="mark-scheme">' + escapeHtml(question.scheme) +
    '</div>' + (question.note ? '<p>' + escapeHtml(question.note) + '</p>' : '') +
    '<h3>Compare your versions</h3>' + versions.map((version, index) => '<details><summary>Version ' + (index + 1) +
      '</summary><p class="mark-scheme">' + escapeHtml(version.answer ?? version) + '</p>' +
      (version.grade ? '<div class="feedback">' + ecbizMarking.feedback(version.grade, question.marks) + '</div>' : '') + '</details>').join('') + '</section>';
}

function setupRevisionWriting(id) {
  const form = document.querySelector('#revision-writing-form');
  if (!form) return;
  form.onsubmit = async event => {
    event.preventDefault();
    const response = new FormData(form).get('response').trim();
    const button = form.querySelector('button.primary');
    if (!response || button.disabled) return;
    const key = 'writing-' + id;
    const status = form.querySelector('#revision-save-status');
    const versions = revisionState(key, []);
    const latest = versions.at(-1);
    button.disabled = true;
    status.textContent = 'Marking your answer…';
    try {
      if (latest?.answer !== response || !latest.grade) {
        const grade = await ecbizMarking.grade(id, response);
        if (latest === response) versions.pop();
        versions.push({ answer: response, grade });
        if (!saveRevisionState(key, versions)) return;
      }
      if (!form.isConnected) return;
      status.textContent = 'Answer marked and saved.';
      const guide = document.querySelector('#revision-writing-guide');
      guide.innerHTML = revisionWritingGuide(questions.find(question => question.id === id), versions);
      guide.querySelector('details:last-child').open = true;
    } catch (error) {
      status.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  };
}

function revisionTeach(code) {
  const topic = revisionLab.topics.find(item => item.code === code);
  return revisionHeading('Explain in your own words', 'Teach Jojo', 'Submit your explanation to get a mark out of 2 and feedback.') +
    '<form class="panel" id="revision-teach-form"><label class="field">Topic<select name="topic">' +
    revisionLab.topics.map(item => '<option value="' + item.code + '"' + (item === topic ? ' selected' : '') + '>' +
      escapeHtml(item.title) + '</option>').join('') + '</select></label>' +
    (topic ? '<h2>' + escapeHtml(topic.prompt) + '</h2><label class="field">Your explanation<textarea maxlength="8000" required name="explanation"></textarea></label>' +
      '<button class="primary">Mark my explanation</button><div class="feedback" role="status" hidden></div>' :
      '<button class="primary">Open explanation task</button>') + '</form>';
}

function setupRevisionTeach(code) {
  const form = document.querySelector('#revision-teach-form');
  if (!form) return;
  const select = form.elements.namedItem('topic');
  select.onchange = () => { location.hash = '#revision-teach/' + select.value; };
  form.onsubmit = async event => {
    event.preventDefault();
    if (!code) { location.hash = '#revision-teach/' + select.value; return; }
    const topic = revisionLab.topics.find(item => item.code === code);
    const explanation = form.elements.namedItem('explanation').value.trim();
    const button = form.querySelector('button.primary');
    if (!topic || !explanation || button.disabled) return;
    const feedback = form.querySelector('.feedback');
    const [answer, reason] = topic.options[topic.answer];
    button.disabled = true;
    feedback.hidden = false;
    feedback.textContent = 'Marking your explanation…';
    try {
      const grade = await ecbizMarking.grade('teach-' + code, explanation);
      feedback.innerHTML = ecbizMarking.feedback(grade, 2) +
        ecbizMarking.scheme({ scheme: answer + '\n' + reason }) + revisionNotesLinks(code);
    } catch (error) {
      feedback.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  };
}

const revisionMockModes = { p1: 60, p2: 120 };

function revisionTest() {
  const state = revisionState('test', null);
  if (state) return revisionAttempt(state);
  return revisionHeading('Exam practice', 'Test builder and original mocks', 'Answers and the timer are saved in this browser.') +
    '<div class="revision-columns revision-test-columns"><section class="panel revision-mocks"><h2>2027 mock papers</h2><p>Paper 1 uses 40 questions selected from the EcBiz bank. Paper 2 uses an original case and four structured choices.</p>' +
    '<div class="revision-mock-options"><button type="button" data-revision-mock="p1"><strong>Paper 1</strong><span>40 marks · 60 minutes</span></button>' +
    '<button type="button" data-revision-mock="p2"><strong>Paper 2</strong><span>80 marks · 120 minutes</span></button></div></section>' +
    '<form class="panel" id="revision-test-builder"><h2>Custom practice</h2><div class="row">' +
    '<label class="field">Topic<select name="topic"><option value="">All topics</option>' +
    revisionLab.topics.map(topic => '<option value="' + topic.code + '">' + escapeHtml(topic.title) + '</option>').join('') +
    '</select></label><label class="field">Format<select name="format"><option value="mcq">Multiple choice</option><option value="written">Structured</option></select></label>' +
    '<label class="field">Questions<input name="count" type="number" min="1" max="40" value="10" required></label>' +
    '<label class="field">Minutes (0 for untimed)<input name="minutes" type="number" min="0" max="180" value="0" required></label></div>' +
    '<button class="primary">Start test</button><p id="revision-save-status" role="status"></p></form></div>';
}

const pendingRevisionTests = new Map();

function revisionWrittenItems(state) {
  if (state.mode === 'p2') {
    return revisionPaper2.flatMap((group, index) => index === 0 || state.selection.includes(index)
      ? group.parts.map(([marks], part) => ({ key: index + '-' + part, id: 'mock-' + index + '-' + part, marks }))
      : []);
  }
  return state.ids.map(id => questions.find(question => question.id === id))
    .filter(question => question && !question.options)
    .map(({ id, marks }) => ({ key: id, id, marks }));
}

function markRevisionTest(state, status, retry) {
  const items = revisionWrittenItems(state).filter(({ key }) => !state.grades?.[key] &&
    (state.answers[key]?.trim() || state.images?.[key]));
  if (!items.length) return;
  const attemptId = state.attemptId;
  status.textContent = 'Marking ' + items.length + ' written answers…';
  retry.hidden = true;

  if (!pendingRevisionTests.has(attemptId)) {
    const run = async () => {
      let next = 0;
      async function worker() {
        while (next < items.length) {
          const { key, id } = items[next++];
          try {
            const grade = await ecbizMarking.grade(id, state.answers[key]?.trim() || '', state.images?.[key]);
            const current = revisionState('test', null);
            if (!current || current.attemptId !== attemptId) return;
            current.grades = { ...current.grades, [key]: grade };
            if (!saveRevisionState('test', current)) return;
          } catch {
            // Leave unsuccessful items pending so the saved answers can be retried.
          }
        }
      }
      await Promise.all(Array.from({ length: Math.min(3, items.length) }, worker));
    };
    pendingRevisionTests.set(attemptId, run().finally(() => pendingRevisionTests.delete(attemptId)));
  }
  pendingRevisionTests.get(attemptId).then(() => {
    if (!status.isConnected) return;
    const latest = revisionState('test', null);
    if (!latest) return;
    if (items.some(({ key }) => latest.grades?.[key])) {
      render(false);
    } else {
      status.textContent = 'Some written answers could not be marked. Your answers are saved.';
      retry.hidden = false;
    }
  });
}

function revisionAttempt(state) {
  const review = state.finished;
  const mock2 = state.mode === 'p2';
  const groups = mock2 ? revisionPaper2.map((group, index) => ({...group, index})) : [];
  const bank = state.ids.map(id => questions.find(question => question.id === id)).filter(Boolean);
  const selected = mock2 ? groups.filter(group => group.index === 0 || state.selection.includes(group.index)) : [];
  const score = bank.filter(q => q.options && state.answers[q.id] === String(q.answer)).length;
  const marks = mock2 ? 80 : bank.reduce((total, question) => total + question.marks, 0);
  const written = revisionWrittenItems(state);
  const isPending = key => !state.grades?.[key] && (state.answers[key]?.trim() || state.images?.[key]);
  const pending = written.filter(({ key }) => isPending(key)).length;
  const earned = score + written.reduce((total, { key }) => total + (state.grades?.[key]?.score ?? 0), 0);
  const writtenFeedback = (key, max, scheme) => review
    ? '<div class="feedback">' + (isPending(key) ? '<p>Awaiting marking.</p>' :
      ecbizMarking.feedback(state.grades?.[key] ?? ecbizMarking.blank, max) + ecbizMarking.scheme({ scheme })) + '</div>'
    : '';
  const input = (id, value) => '<label class="field">Your answer<textarea maxlength="8000" name="' + escapeHtml(id) + '"' +
    (review ? ' readonly' : '') + '>' + escapeHtml(value ?? '') + '</textarea></label>';
  const reviewScheme = text => review ? '<div class="feedback mark-scheme">' + escapeHtml(text) + '</div>' : '';
  const body = mock2 ? (review ? selected : groups).map(group => {
    const active = group.index === 0 || state.selection.includes(group.index);
    return '<section class="panel"><h2>' + escapeHtml(group.title) + '</h2><p>' + escapeHtml(group.stimulus) + '</p>' +
      (!review && group.index ? '<label class="choice"><input type="checkbox" data-section="' + group.index + '"' +
        (active ? ' checked' : '') + '> Answer this question</label>' : '') +
      '<fieldset' + (active ? '' : ' hidden disabled') + '><legend>Question ' + (group.index + 1) + '</legend>' +
      group.parts.map(([points, prompt, guide], part) => {
        const key = group.index + '-' + part;
        return '<p><strong>' + String.fromCharCode(97 + part) + '.</strong> ' + escapeHtml(prompt) + ' [' + points + ']</p>' +
          (group.index === 0 && part === 3 ? (review
            ? (state.images?.[key] ? '<p>Submitted diagram</p><img style="max-width:100%" alt="Your submitted diagram" src="' + escapeHtml(state.images[key]) + '">' : '')
            : '<label class="field">Upload a photo of your diagram<input type="file" accept="image/png,image/jpeg,image/webp" id="revision-diagram" aria-describedby="revision-diagram-status"></label><p id="revision-diagram-status" role="status">' +
              (state.images?.[key] ? 'Diagram saved with your answer.' : '') + '</p>') : '') +
          input(key, state.answers[key]) + writtenFeedback(key, points, guide);
      }).join('') + '</fieldset></section>';
  }).join('') : bank.map((question, index) =>
    '<section class="panel"><h2>' + (index + 1) + '. ' + escapeHtml(question.q) + ' [' + question.marks + ']</h2>' +
    (question.case ? '<p>' + escapeHtml(question.case) + '</p>' : '') +
    (question.options ? question.options.map((option, i) => '<label class="choice"><input type="radio" name="' +
      escapeHtml(question.id) + '" value="' + i + '"' + (state.answers[question.id] === String(i) ? ' checked' : '') +
      (review ? ' disabled' : '') + '> ' + escapeHtml(option) + '</label>').join('') : input(question.id, state.answers[question.id])) +
    (question.options ? reviewScheme((state.answers[question.id] === String(question.answer) ? 'Correct · 1/1' : '0/1') +
      '\nCorrect answer: ' + question.options[question.answer] + '\n' + question.why) :
      writtenFeedback(question.id, question.marks, question.scheme)) +
    '</section>').join('');
  const title = state.mode === 'p1' ? 'EcBiz Paper 1 mock' : mock2 ? 'EcBiz Paper 2 mock' : 'Custom practice test';
  return revisionHeading('Original EcBiz practice', title, marks + ' marks' + (review ? (pending ? ' · ' + pending + ' awaiting marking' : ' · Score ' + earned + '/' + marks) : '')) +
    (mock2 ? '<p>Answer all of Section A and choose three Section B questions.</p>' : '') +
    (!review && state.deadline ? '<p id="revision-clock" role="timer"></p>' : '') +
    (review ? '<button id="revision-test-reset" type="button">Build another test</button>' +
      (pending ? '<button id="revision-test-retry" type="button" hidden>Retry marking</button>' : '') : '') +
    '<p id="revision-save-status" role="status"></p><form id="revision-attempt">' + body +
    (!review ? '<button class="primary">Finish and mark</button><button id="revision-test-reset" type="button">Discard attempt</button>' : '') +
    '</form>' + (review && mock2 ? '<section class="panel"><h2>8-mark discussion bands</h2><p>6–8 for developed analysis of both sides, 3–5 for some developed reasoning with limited depth or balance, 1–2 for relevant undeveloped points, 0 for no creditworthy material.</p></section>' : '');
}

function setupRevisionTest(_id, autoMark = true) {
  const builder = document.querySelector('#revision-test-builder');
  function start(mode, pool, count, minutes) {
    if (pool.length < count) {
      document.querySelector('#revision-save-status').textContent = 'Only ' + pool.length + ' questions match these options.';
      return;
    }
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const state = { mode, attemptId: crypto.randomUUID(), ids: shuffled.slice(0, count).map(q => q.id), answers: {}, selection: [],
      deadline: minutes ? Date.now() + minutes * 60000 : null, finished: false };
    if (saveRevisionState('test', state)) render();
  }
  if (builder) {
    builder.onsubmit = event => {
      event.preventDefault();
      const data = new FormData(builder);
      const pool = questions.filter(q => Boolean(q.options) === (data.get('format') === 'mcq') &&
        (!data.get('topic') || q.topic === data.get('topic')));
      start('custom', pool, Number(data.get('count')), Number(data.get('minutes')));
    };
    document.querySelectorAll('[data-revision-mock]').forEach(button => button.onclick = () => {
      const mode = button.dataset.revisionMock;
      const mcqs = mode === 'p1' ? catalog.slice(0, 6).flatMap((_, chapter) => {
        const pool = questions.filter(q => q.options && q.c === chapter);
        const byTopic = new Map();
        for (const question of pool) {
          if (!byTopic.has(question.topic)) byTopic.set(question.topic, []);
          byTopic.get(question.topic).push(question);
        }
        const queues = [...byTopic.values()].map(queue => {
          const offset = Math.floor(Math.random() * queue.length);
          return queue.slice(offset).concat(queue.slice(0, offset));
        });
        const target = chapter < 4 ? 7 : 6;
        return Array.from({length: target}, (_, i) => queues[i % queues.length][Math.floor(i / queues.length)]);
      }) : [];
      start(mode, mcqs, mode === 'p1' ? 40 : 0, revisionMockModes[mode]);
    });
    return;
  }
  const state = revisionState('test', null);
  const reset = document.querySelector('#revision-test-reset');
  reset.onclick = () => {
    if ((state.finished || confirm('Discard this test and its answers?')) && saveRevisionState('test', null)) render();
  };
  if (state.finished) {
    const retry = document.querySelector('#revision-test-retry');
    if (!retry) return;
    if (!state.attemptId) {
      state.attemptId = crypto.randomUUID();
      if (!saveRevisionState('test', state)) return;
    }
    const status = document.querySelector('#revision-save-status');
    retry.onclick = () => markRevisionTest(revisionState('test', state), status, retry);
    if (autoMark) retry.click();
    else {
      status.textContent = 'Some written answers could not be marked. Your answers are saved.';
      retry.hidden = false;
    }
    return;
  }
  const form = document.querySelector('#revision-attempt');
  const diagram = form.querySelector('#revision-diagram');
  let loadingDiagram = false;
  if (diagram) diagram.onchange = async () => {
    const file = diagram.files[0];
    if (!file) return;
    const status = form.querySelector('#revision-diagram-status');
    loadingDiagram = true;
    diagram.disabled = true;
    status.textContent = 'Preparing diagram…';
    try {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 12000000) {
        throw new Error('Choose a JPEG, PNG or WebP image under 12 MB.');
      }
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      const image = canvas.toDataURL('image/jpeg', 0.78);
      if (image.length > 530000) throw new Error('Choose a smaller or more tightly cropped image.');
      if (!form.isConnected) return;
      const images = { ...state.images, '0-3': image };
      if (saveRevisionState('test', { ...state, images })) {
        state.images = images;
        status.textContent = 'Diagram saved with your answer.';
      } else {
        status.textContent = 'The diagram could not be saved in this browser.';
      }
    } catch (error) {
      status.textContent = 'Diagram could not be attached. ' + error.message;
    } finally {
      loadingDiagram = false;
      diagram.disabled = false;
    }
  };
  const clock = document.querySelector('#revision-clock');
  function finish() {
    if (!saveRevisionState('test', {...state, finished: true})) return;
    const mistakes = revisionState('mistakes', {});
    const tested = new Set(state.ids);
    for (const q of questions) {
      if (!tested.has(q.id) || !q.options) continue;
      if (state.answers[q.id] === String(q.answer)) delete mistakes[q.id];
      else mistakes[q.id] = {text: q.q, href: '#revision-retry/' + q.id};
    }
    saveRevisionState('mistakes', mistakes);
    render();
  }
  form.oninput = event => {
    const input = event.target;
    if (input.dataset.section) {
      const index = Number(input.dataset.section);
      if (input.checked && state.selection.length === 3) {
        input.checked = false;
        document.querySelector('#revision-save-status').textContent = 'Deselect a Section B question before choosing another.';
        return;
      }
      state.selection = input.checked ? [...state.selection, index] : state.selection.filter(value => value !== index);
      const fields = input.closest('section').querySelector('fieldset');
      fields.hidden = fields.disabled = !input.checked;
      document.querySelector('#revision-save-status').textContent = '';
    } else if (input.name) {
      state.answers[input.name] = input.value;
    }
    saveRevisionState('test', state);
  };
  form.onsubmit = event => {
    event.preventDefault();
    if (loadingDiagram) {
      document.querySelector('#revision-save-status').textContent = 'Wait for the diagram to finish attaching.';
      return;
    }
    if (state.mode === 'p2' && state.selection.length !== 3) {
      document.querySelector('#revision-save-status').textContent = 'Choose three Section B questions before submitting.';
      return;
    }
    finish();
  };
  if (clock) {
    function tick() {
      if (!clock.isConnected) return;
      const left = Math.max(0, Math.ceil((state.deadline - Date.now()) / 1000));
      clock.textContent = 'Time remaining ' + Math.floor(left / 60) + ':' + pad(left % 60);
      if (left || loadingDiagram) window.setTimeout(tick, 250);
      else finish();
    }
    tick();
  }
}

function revisionRetry(id) {
  const question = questions.find(q => q.id === id && q.options);
  if (!question) return revisionMistakes();
  return link('← Mistakes log', '#revision-mistakes', 'text-link') +
    revisionHeading('Retry', 'Try the question again', escapeHtml(question.q)) +
    '<form id="revision-retry-form" class="panel">' + (question.case ? '<p>' + escapeHtml(question.case) + '</p>' : '') + question.options.map((option, index) =>
      '<label class="choice"><input type="radio" name="answer" value="' + index + '" required> ' +
      escapeHtml(option) + '</label>').join('') +
    '<button class="primary">Check answer</button><p class="feedback" role="status" hidden></p><p id="revision-save-status" role="status"></p></form>';
}

function setupRevisionRetry(id) {
  const form = document.querySelector('#revision-retry-form');
  if (!form) return;
  const question = questions.find(q => q.id === id);
  form.onsubmit = event => {
    event.preventDefault();
    const correct = new FormData(form).get('answer') === String(question.answer);
    const feedback = form.querySelector('.feedback');
    feedback.hidden = false;
    feedback.textContent = (correct ? 'Correct. ' : 'Try again. ') + question.why;
    recordRevisionMistake(id, question.q, '#revision-retry/' + id, !correct);
  };
}

// Cambridge 0455, 2027–2029 syllabus, page 8.
const officialSyllabusChapters = [
  ["The basic economic problem", "The nature of the basic economic problem", "Factors of production", "Opportunity cost", "Production possibility curve (PPC) diagrams"],
  ["The allocation of resources", "The role of markets in allocating resources", "Demand", "Supply", "Price determination", "Price changes", "Price elasticity of demand (PED)", "Price elasticity of supply (PES)", "Market economic system", "Market failure", "Mixed economic system"],
  ["Microeconomic decision-makers", "Money and banking", "Households", "Workers", "Firms", "Firms and production", "Firms’ costs, revenue and objectives", "Types of markets"],
  ["Government and the macroeconomy", "Government macroeconomic intervention", "Fiscal policy", "Monetary policy", "Supply-side policy", "Economic growth", "Employment and unemployment", "Inflation"],
  ["Economic development", "Living standards", "Poverty", "Population", "Differences in economic development between countries"],
  ["International trade and globalisation", "Specialisation and free trade", "Globalisation and trade restrictions", "Foreign exchange rates", "Current account of the balance of payments"]
].map(([title, ...topics], chapter) => ({
  title,
  topics: topics.map((title, topic) => ({code: (chapter + 1) + '.' + (topic + 1), title}))
}));

const checklistOutcomes = [
  ["1.1.1","Finite resources and infinite wants                                                            • definition of the basic economic problem                             • the concept of scarcity                                                                           • examples of the basic economic problem in the context of:                                                                                                                      – consumers                                                                                      – workers                                                                                                                      – producers/firms                                                                                   – governments"],
  ["1.1.2","Resource allocation decisions\nThe three basic economic questions which determine resource allocation:\n• what to produce\n• how to produce\n• who to produce for"],
  ["1.1.3","Economic goods and free goods                                                  • the difference between economic goods and free goods"],
  ["1.2.1","Factors of production and their rewards\n• definitions of factors of production: land, labour, capital and enterprise\n• rewards to factors of production: rent, wages, interest and profit"],
  ["1.2.2","Quantity and quality of factors of production\n• causes of changes in the quantity and quality of factors of production"],
  ["1.3.1","Opportunity cost\n• definition of opportunity cost\n• examples of opportunity cost in different contexts"],
  ["1.3.2","The influence of opportunity cost on decision-making\n• decisions made by consumers, workers, producers/firms and governments when allocating their resources"],
  ["1.4.1","Production possibility curves (PPC)\n• definition\n• drawing and interpretation of the PPC diagram"],
  ["1.4.2","Points under, on and beyond a PPC\n• the significance of the location of different production points"],
  ["1.4.3","Movements along a PPC\n• the significance of movements along a PPC and opportunity cost"],
  ["1.4.4","Shifts of a PPC\n• causes and consequences of shifts of a PPC in terms of an economy’s growth"],
  ["2.1.1","How markets work\n• definition of a market\n• examples of markets\n• roles of buyers and sellers"],
  ["2.2.1","Individual and market demand\n• definition of demand\n• link between individual demand and market demand\n• drawing and interpretation of the demand diagram"],
  ["2.2.2","Movements along a demand curve\n• causes of extensions and contractions in demand\n• diagrams that illustrate movements along a demand curve"],
  ["2.2.3","Shifts of a demand curve\n• causes of decreases and increases in demand\n• diagrams that illustrate shifts of a demand curve"],
  ["2.3.1","Individual and market supply\n• definition of supply\n• link between individual supply and market supply\n• drawing and interpretation of the supply diagram"],
  ["2.3.2","Movements along a supply curve\n• causes of extensions and contractions in supply\n• diagrams that illustrate movements along a supply curve"],
  ["2.3.3","Shifts of a supply curve\n• causes of decreases and increases in supply\n• diagrams that illustrate shifts of a supply curve"],
  ["2.4.1","Price mechanism\n• how the price mechanism provides answers to the basic resource allocation decisions of what, how and for whom to produce"],
  ["2.4.2","Market equilibrium\n• equilibrium price and equilibrium quantity in a market:\n– definition of market equilibrium\n– interpretation of equilibrium using demand and supply schedules\n– drawing and interpretation of equilibrium using demand and supply curves"],
  ["2.4.3","Market disequilibrium\n• disequilibrium prices and quantities:\n– definition of market disequilibrium\n– interpretation of disequilibrium using demand and supply schedules\n– drawing and interpretation of disequilibrium using demand and supply curves\n• shortages (demand exceeding supply) and surpluses (supply exceeding demand)"],
  ["2.5.1","Causes of price changes\n• how price changes are caused by changes in demand and supply"],
  ["2.5.2","Consequences of price changes\n• effect of price changes on sales\n• use of demand and supply diagrams to illustrate the impact of changes in market conditions"],
  ["2.6.1","Definition of PED"],
  ["2.6.2","Calculation of PED\n• calculation of PED using the formula\n• interpretation of the significance of the PED value: perfectly inelastic, inelastic, unitary, elastic, perfectly elastic\n• drawing and interpretation of demand curve diagrams to show different PED"],
  ["2.6.3","Determinants of PED\n• main influences on whether demand is elastic or inelastic"],
  ["2.6.4","PED, consumer expenditure and firms’ revenue\n• effect of price changes on the amount spent by consumers and revenue raised by firms, shown both in a diagram and as a calculation\n• relationship between PED and the amount spent by consumers and revenue raised by firms"],
  ["2.6.5","Significance of PED\n• implications of PED for decision-making by consumers, workers, producers/firms and government"],
  ["2.7.1","Definition of PES"],
  ["2.7.2","Calculation of PES\n• calculation of PES using the formula\n• interpretation of the significance of the PES value: perfectly inelastic, inelastic, unitary, elastic, perfectly elastic\n• drawing and interpretation of supply curve diagrams to show different PES"],
  ["2.7.3","Determinants of PES\n• main influences on whether supply is elastic or inelastic"],
  ["2.8.1","Definition of the market economic system"],
  ["2.8.2","Arguments for and against the market economic system\n• advantages of the market economic system\n• disadvantages of the market economic system"],
  ["2.9.1","Definition of market failure"],
  ["2.9.2","Definitions of terms associated with market failure:\n• public goods, merit goods, demerit goods, private benefits, external benefits, social benefits,\nprivate costs, external costs, social costs, monopoly"],
  ["2.9.3","Causes of market failure\n• causes relating to public goods, merit goods, demerit goods, external costs and external benefits, abuse of monopoly power"],
  ["2.9.4","Consequences of market failure\n• implications of misallocation of resources in relation to:\n– the over-consumption of demerit goods and goods with external costs\n– the under-consumption of merit goods and goods with external benefits\n– the non-provision of public goods\n– restricted supply causing higher prices under a monopoly\nNote: demand and supply diagrams relating to market failure are not required."],
  ["2.10.1","Definition of the mixed economic system"],
  ["2.10.2","Arguments for and against the mixed economic system\n• advantages of the mixed economic system\n• disadvantages of the mixed economic system"],
  ["2.10.3","Government intervention to address market failure\n• definitions, drawing and interpretation of diagrams, advantages and disadvantages of:\n– maximum and minimum prices in product markets\n– indirect taxation\n– subsidies\n• definitions, advantages and disadvantages of:\n– regulation\n– privatisation\n– nationalisation\n– direct provision of goods and services\n– quotas, e.g. for the extraction of natural resources"],
  ["3.1.1","Money\n• forms, functions and characteristics of money"],
  ["3.1.2","Banking\n• role and importance of central banks\n• role and importance of commercial banks"],
  ["3.2.1","Influences on households’ spending, saving and borrowing\n• income\n• rate of interest\n• confidence\n• age\n• culture"],
  ["3.3.1","Factors affecting an individual’s choice of occupation\n• wage and non-wage factors"],
  ["3.3.2","Wage determination\n• influences of the demand for labour and the supply of labour\n• trade unions and their relative bargaining power\n• government policy, including national minimum wage (NMW)\n• drawing and interpretation of diagrams that illustrate the effects of:\n– changes in demand and supply in the labour market\n– national minimum wages"],
  ["3.3.3","Reasons for differences in wages\n• reasons for differences:\n– demand for and supply of labour\n– relative bargaining strengths\n– discrimination, e.g. male/female\n– government policy\n• how these reasons influence the wages of workers, depending on:\n– level of skills of workers\n– economic sector workers operate in: primary/secondary/tertiary\n– discrimination between workers, e.g. male/female\n– whether the worker is working in the private sector or public sector"],
  ["3.3.4","Mobility of labour\n• causes of changes in the occupational and geographical mobility of labour\n• consequences of changes in the occupational and geographical mobility of labour"],
  ["3.3.5","Division of labour\n• definition of division of labour (worker specialisation)\n• advantages and disadvantages of division of labour"],
  ["3.4.1","Different types of firms\n• primary/secondary/tertiary sector firms\n• private sector/public sector firms\n• advantages and disadvantages of small and large firms"],
  ["3.4.2","Mergers\n• definitions, examples, advantages and disadvantages of different types of mergers: horizontal, vertical and conglomerate"],
  ["3.4.3","Economies and diseconomies of scale\n• how internal and external economies and diseconomies of scale can affect a firm/industry as the scale of production changes\n• drawing and interpretation of average total cost (ATC) diagrams to illustrate economies and diseconomies of scale"],
  ["3.5.1","Demand for factors of production\n• influences to include demand for the product, the price of different factors of production, their availability and their productivity"],
  ["3.5.2","Labour-intensive and capital-intensive production\n• reasons for adopting the different forms of production\n• advantages and disadvantages of the different forms of production"],
  ["3.5.3","Production and productivity\n• the difference between production and productivity\n• influences on production and productivity\n• effects of changes in investment on productivity"],
  ["3.6.1","Definitions of costs of production\n• total cost (TC), average total cost (ATC), fixed cost (FC), average fixed cost (AFC), variable cost (VC), average variable cost (AVC)"],
  ["3.6.2","Calculation of costs of production\n• calculation of TC, ATC, FC, AFC, VC and AVC\n• drawing and interpretation of diagrams that show how changes in output affect costs of production"],
  ["3.6.3","Definition of revenue\n• definitions of total revenue (TR) and average revenue (AR)"],
  ["3.6.4","Calculation of revenue\n• calculation of TR and AR\n• the influence of sales on revenue"],
  ["3.6.5","Objectives of firms\n• survival, social welfare, profit maximisation and growth"],
  ["3.7.1","Competitive markets\n• characteristics, advantages and disadvantages of competitive markets\n• effect of having a high number of firms on price, quality, choice, profit\nNote: diagrams / perfect or imperfect competition theory are not required."],
  ["3.7.2","Monopoly markets\n• characteristics, advantages and disadvantages of monopoly markets\n• effect of having only one firm on price, quality, choice, profit\nNote: diagrams are not required."],
  ["4.1.1","Macroeconomic aims\n• the macroeconomic aims of government:\n– economic growth\n– full employment/low unemployment\n– stable prices/low inflation\n– balance of payments stability\n– redistribution of income\n– environmental sustainability\n• reasons behind the choice of aims and the criteria that governments may set for meeting each aim\n• possible conflicts between macroeconomic aims:\n– full employment and stable prices\n– economic growth and environmental sustainability\n– full employment and balance of payments stability"],
  ["4.2.1","Government budget\n• definitions of:\n– government budget\n– government budget deficit\n– government budget surplus\n• calculations of the size of a government budget deficit/surplus"],
  ["4.2.2","Reasons for government spending\n• main areas of government spending and the reasons for and effects of spending in these areas"],
  ["4.2.3","Taxation\n• reasons for taxation: raising revenue, discouraging consumption of demerit goods, reducing\nimports, redistributing income, influencing total demand, encouraging environmental sustainability\n• examples of the different classifications of tax: progressive, regressive, proportional; direct, indirect\n• impact of taxation on consumers, workers, producers/firms, the government and the economy"],
  ["4.2.4","Definition of fiscal policy"],
  ["4.2.5","Fiscal policy measures\n• changes in:\n– taxes\n– government spending"],
  ["4.2.6","Effects of fiscal policy on government macroeconomic aims\n• how fiscal policy measures may enable a government to achieve its macroeconomic aims"],
  ["4.3.1","Definitions of money supply and monetary policy"],
  ["4.3.2","Monetary policy measures\n• changes in:\n– interest rate\n– money supply\n– foreign exchange rate"],
  ["4.3.3","Effect of monetary policy on government macroeconomic aims\n• how monetary policy measures may enable a government to achieve its macroeconomic aims"],
  ["4.4.1","Definition of supply-side policy"],
  ["4.4.2","Supply-side policy measures\n• education and training\n• infrastructure spending\n• labour market reforms\n• lower direct taxes\n• deregulation\n• improving incentives to work and invest\n• privatisation"],
  ["4.4.3","ffects of supply-side policy measures on government macroeconomic aims\n• how supply-side policy measures may enable a government to achieve its macroeconomic aims"],
  ["4.5.1","Definition of economic growth"],
  ["4.5.2","Measurement of economic growth\n• real Gross Domestic Product (GDP)"],
  ["4.5.3","Causes and consequences of economic growth\n• how economic growth may be caused by an increase in total demand, an increase in the quantity of resources or an increase in the quality of resources\n• advantages and disadvantages of economic growth"],
  ["4.5.4","Causes and consequences of recession\n• definition of recession\n• how a recession may be caused by a decrease in total demand, a decrease in the quantity of resources or a decrease in the quality of resources\n• consequences of recession for consumers, workers, producers/firms and the government"],
  ["4.5.5","Policies to promote economic growth\n• the range of policies available to promote economic growth and their effectiveness"],
  ["4.6.1","Definitions of employment, unemployment and full employment"],
  ["4.6.2","Measurement of unemployment\n• how unemployment is measured (labour force survey)\n• formula for the unemployment rate"],
  ["4.6.3","Causes/types of unemployment\n• frictional unemployment\n• structural unemployment\n• cyclical unemployment\n• seasonal unemployment"],
  ["4.6.4","Consequences of unemployment\n• consequences of unemployment for the individual, producers/firms, the government and the economy"],
  ["4.6.5","Policies to reduce unemployment\n• the range of policies available to reduce unemployment and their effectiveness"],
  ["4.7.1","Definitions of inflation and deflation"],
  ["4.7.2","Measurement of inflation\n• measurement of inflation using the Consumer Prices Index (CPI)"],
  ["4.7.3","Causes of inflation\n• demand-pull\n• cost-push"],
  ["4.7.4","Consequences of inflation\n• how inflation affects savers, lenders and borrowers\n• consequences of inflation for consumers, workers, producers/firms and the economy"],
  ["4.7.5","Policies to control inflation\n• the range of policies available to control inflation and their effectiveness"],
  ["5.1.1","Indicators of living standards\n• real Gross Domestic Product (GDP) per head\n• Human Development Index (HDI) and its components\n• advantages and disadvantages of real GDP per head and HDI as indicators"],
  ["5.1.2","Comparing living standards and income distribution\n• reasons for differences in living standards and income distribution within and between countries"],
  ["5.2.1","Definitions of absolute and relative poverty\n• difference between absolute poverty and relative poverty"],
  ["5.2.2","Causes of poverty\n• unemployment\n• low wages\n• illness\n• age\n• environmental factors"],
  ["5.2.3","Policies to alleviate poverty and redistribute income\n• promoting economic growth\n• improved education\n• improved healthcare provision\n• more generous state benefits\n• progressive taxation\n• national minimum wage (NMW)"],
  ["5.3.1","Factors that affect population growth\n• definitions of:\n– birth rate\n– death rate\n– net migration, immigration and emigration\n• how birth rates, death rates and net migration can vary between countries\n• reasons why birth rates, death rates and net migration rates can vary between countries"],
  ["5.3.2","The effects of changes in the size and structure of populations\n• the concept of an optimum population\n• the effects of increases and decreases in population size and changes in the age and gender distribution of population"],
  ["5.4.1","Causes and consequences of international differences\n• differences in:\n– income\n– productivity\n– population growth\n– size of primary, secondary and tertiary sectors\n– saving and investment\n– education\n– healthcare\n– natural resources"],
  ["6.1.1","Specialisation by country\n• definition of specialisation by country\n• the basis for specialisation by country in terms of the best resource allocation and/or low-cost production\n• advantages and disadvantages of specialisation"],
  ["6.1.2","Free trade\n• definition of free trade\n• advantages and disadvantages of free trade"],
  ["6.2.1","Definition of globalisation"],
  ["6.2.2","Causes and consequences of changes in globalisation\n• causes of changes in globalisation:\n– changes in trade restrictions\n– changes in transport costs\n– changes in communication costs\n– movement of multinational companies (MNCs)\n• effects of changes in globalisation on:\n– international trade\n– competition\n– the environment\n– migration\n– income distribution\n– economic development"],
  ["6.2.3"," Role of multinational companies (MNCs)\n• MNCs and their advantages and disadvantages to host countries and home countries"],
  ["6.2.4","Types of trade restrictions / methods of protection\n• tariffs\n• import quotas\n• subsidies\n• embargoes"],
  ["6.2.5","Reasons for trade restrictions\n• protect infant (sunrise) industries\n• protect declining (sunset) industries\n• protect strategic industries\n• avoid dumping\n• reduce a deficit on the current account of the balance of payments\n• raise tax revenue\n• restrict the import of demerit goods\n• promote environmental sustainability"],
  ["6.2.6","Consequences of trade restrictions\n• impact of trade restrictions on the home country and its trading partners\n• advantages and disadvantages of restricting free trade"],
  ["6.3.1","Definition of foreign exchange rate"],
  ["6.3.2","Reasons for buying and selling foreign currencies\n• trade in goods and services\n• speculation\n• government intervention in currency markets\n• payment of profit, interest and dividends between countries\n• workers’ remittances\n• investment in capital goods between countries"],
  ["6.3.3","Determination of foreign exchange rate in foreign exchange market\n• definitions of floating exchange rate, appreciation and depreciation\n• the demand for and supply of a currency\n• the determination of the equilibrium foreign exchange rate\n• causes of foreign exchange rate fluctuations\n– changes in demand for exports and imports\n– changes in the interest rate\n– speculation"],
  ["6.3.4"," Consequences of changes in foreign exchange rates\n• effects of changes in foreign exchange rates on prices and demand for exports and imports"],
  ["6.4.1","Structure of the current account of the balance of payments\n• components of the current account of the balance of payments:\n– trade in goods\n– trade in services\n– primary income\n– secondary income\n• calculation of deficits and surpluses on the current account of the balance of payments and its component sections "],
  ["6.4.2","Causes of current account deficit and surplus\n• reasons for current account deficits and surpluses"],
  ["6.4.3","Consequences of current account deficit and surplus\n• impact on GDP, employment, inflation and foreign exchange rate"],
  ["6.4.4","Policies to achieve balance of payments stability\n• the range of policies available to achieve balance of payments stability and their effectiveness"]
];
const checklistColumns = ["Theory reviewed","Summary notes/flashcards completed","Past paper questions practised"];
const checklistKey = 'checklist-0455-workbook';

function revisionChecklist() {
  const previous = new Set(revisionState('checklist-0455-2027', []));
  const checked = new Set(revisionState(checklistKey, null) ??
    checklistOutcomes.filter(([code]) => previous.has(code.split('.').slice(0, 2).join('.')))
      .map(([code]) => code + ':0'));
  const total = checklistOutcomes.length * checklistColumns.length;
  const count = checklistOutcomes.reduce((sum, [code]) =>
    sum + checklistColumns.filter((_, column) => checked.has(code + ':' + column)).length, 0);
  return revisionHeading('Cambridge IGCSE · 0455', 'Syllabus checklist',
    'Track theory, summary notes or flashcards, and past-paper practice for each syllabus item. Progress is saved in this browser.') +
    '<section class="panel checklist-progress"><div><h2>Overall progress</h2><p id="checklist-count" role="status">' +
    count + ' of ' + total + ' tasks complete</p></div>' +
    '<progress id="checklist-progress" aria-label="Checklist tasks complete" value="' + count + '" max="' + total + '"></progress>' +
    link('Official 2027–2029 syllabus ↗', syllabus) + '<p id="revision-save-status" role="status"></p></section>' +
    '<div id="syllabus-checklist">' + officialSyllabusChapters.map(chapter =>
      '<section class="panel checklist-chapter"><h2>' + escapeHtml(chapter.title) + '</h2>' +
      chapter.topics.map(topic => {
        const items = checklistOutcomes.filter(([code]) => code.startsWith(topic.code + '.'));
        return '<details class="workbook-topic"><summary>' + topic.code + ' ' + escapeHtml(topic.title) + '</summary>' +
          '<ul>' + items.map(([code, wording]) =>
            '<li><div class="workbook-outcome"><strong>' + code + '</strong><div class="workbook-wording">' +
            escapeHtml(wording.replace(/ {3,}(?=[•–])/g, '\n').trim()) +
            '</div></div><div class="workbook-ticks" role="group" aria-label="Progress for ' + code + '">' +
            checklistColumns.map((label, column) => {
              const value = code + ':' + column;
              return '<label><input type="checkbox" value="' + value + '"' +
                (checked.has(value) ? ' checked' : '') + '><span>' + escapeHtml(label) + '</span></label>';
            }).join('') + '</div></li>').join('') + '</ul><div class="row">' +
          link('Quick recap and check', '#revision-topics/' + topic.code) + revisionNotesLinks(topic.code) +
          '</div></details>';
      }).join('') + '</section>'
    ).join('') + '</div>';
}

function setupRevisionChecklist() {
  const checklist = document.querySelector('#syllabus-checklist');
  if (!checklist) return;
  checklist.onchange = event => {
    if (!event.target.matches('input[type="checkbox"]')) return;
    const checked = [...checklist.querySelectorAll('input:checked')].map(input => input.value);
    document.querySelector('#revision-save-status').textContent = '';
    saveRevisionState(checklistKey, checked);
    const progress = document.querySelector('#checklist-progress');
    progress.value = checked.length;
    document.querySelector('#checklist-count').textContent =
      checked.length + ' of ' + progress.max + ' tasks complete';
  };
}

const revisionRoutes = {
  'revision-checklist': revisionChecklist,
  revision: revisionHub, 'revision-topics': revisionTopics, 'revision-mistakes': revisionMistakes,
  'revision-papers': revisionPapers, 'revision-writing': revisionWriting, 'revision-teach': revisionTeach,
  'revision-test': revisionTest, 'revision-retry': revisionRetry
};
const revisionSetups = {
  'revision-checklist': setupRevisionChecklist,
  'revision-topics': setupRevisionTopic, 'revision-writing': setupRevisionWriting,
  'revision-teach': setupRevisionTeach, 'revision-test': setupRevisionTest, 'revision-retry': setupRevisionRetry
};

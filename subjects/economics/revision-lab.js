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

function revisionHub() {
  const tools = [
    ['Cheatsheets and interactive checks', 'Review a topic, make a prediction and check the reasoning.', '#revision-topics'],
    ['Test builder and original mocks', 'Build a quiz from the practice bank or sit a timed mock.', '#revision-test'],
    ['Mistakes log', 'Retry questions missed in topic checks and submitted tests.', '#revision-mistakes'],
    ['Past papers and specimen materials', 'Open Cambridge papers, mark schemes and the 2027 specifications.', '#revision-papers'],
    ['Written-answer review', 'Compare your answer with a question-specific mark scheme.', '#revision-writing'],
    ['Teach Jojo', 'Explain a concept and compare it with a worked reasoning check.', '#revision-teach']
  ];
  return heading('Economics 0455', 'Revision tools', 'Cambridge IGCSE Economics · Exams from 2027') +
    '<div class="study-tools">' + tools.map(([title, description, href]) =>
      '<a class="study-tool" href="' + href + '"><strong>' + escapeHtml(title) + '</strong><span class="muted">' +
      escapeHtml(description) + '</span></a>').join('') + '</div>';
}

function revisionTopics(code) {
  const topic = revisionLab.topics.find(item => item.code === code);
  if (!topic) {
    return heading('Quick revision', 'Cheatsheets and interactive checks', 'Pick a topic to review and try an application question.') +
      catalog.slice(0, 6).map((chapter, index) => '<section class="group"><h2>' + escapeHtml(chapter.title) + '</h2>' +
        revisionLab.topics.filter(item => item.code.startsWith(index + 1 + '.')).map(item =>
          link(item.code + ' · ' + item.title, '#revision-topics/' + item.code, 'coverage-link')).join('') + '</section>').join('');
  }
  const complete = revisionState('topics', {})[code] === true;
  return link('← All topics', '#revision-topics', 'text-link') +
    heading('Syllabus topic ' + topic.code, escapeHtml(topic.title), complete ? 'Application check completed' : 'Cheatsheet and application check') +
    '<article class="panel"><h2>Quick recap</h2><p>' + escapeHtml(topic.summary) + '</p><div class="row">' + revisionNotesLinks(code) + '</div></article>' +
    '<form id="revision-topic-form" class="panel"><h2>' + escapeHtml(topic.prompt) + '</h2>' +
    topic.options.map(([option], index) => '<label class="choice"><input required type="radio" name="answer" value="' + index + '"> ' +
      escapeHtml(option) + '</label>').join('') +
    '<button class="primary">Check answer</button><div class="feedback" role="status" hidden></div><p id="revision-save-status" role="status"></p></form>';
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
  return heading('Review', 'Mistakes log', 'This browser stores missed topic checks and multiple-choice test answers.') +
    '<section class="panel">' + (entries.length ? '<ul>' + entries.map(item =>
      '<li>' + link(item.text, item.href, 'text-link') + '</li>').join('') + '</ul>' : '<p>No missed questions to review yet.</p>') + '</section>';
}

function revisionPapers() {
  return heading('Cambridge 0455', 'Past papers and specimens', 'Use the specimens to practise the 2027 format. Older papers can have different timings, marks and content.') +
    '<section class="panel"><h2>From 2027</h2><p>Paper 1: 40 marks in 60 minutes. Paper 2: 80 marks in 120 minutes. Complete the compulsory Section A and three of the four Section B questions.</p><ul>' +
    revisionSources.slice(0, 5).map(([title, href]) => '<li>' + link(title, href, 'text-link') + '</li>').join('') +
    '</ul><h2>Further reading and practice</h2><ul>' + revisionSources.slice(5).map(([title, href]) =>
      '<li>' + link(title, href, 'text-link') + '</li>').join('') + '</ul></section>';
}

function revisionWriting(id) {
  const selected = questions.find(question => question.id === id && !question.options);
  if (!selected) {
    return heading('Self-assessment', 'Written-answer review', 'Choose a question to write, compare and revise your answer.') +
      catalog.slice(0, 6).map((chapter, index) => '<section class="group"><h2>' + escapeHtml(chapter.title) + '</h2>' +
        [2, 4, 6, 8].map(marks => questions.find(question => question.c === index && question.marks === marks && !question.options))
          .filter(Boolean).map(question => link(question.marks + ' marks · ' + question.q, '#revision-writing/' + question.id, 'coverage-link')).join('') + '</section>').join('');
  }
  const versions = revisionState('writing-' + id, []);
  return link('← Choose another question', '#revision-writing', 'text-link') +
    heading('Self-assessment · ' + selected.marks + ' marks', 'Review your answer', escapeHtml(selected.q)) +
    '<form class="panel" id="revision-writing-form">' + (selected.case ? '<p>' + escapeHtml(selected.case) + '</p>' : '') +
    '<label class="field">Your response<textarea name="response" required>' + escapeHtml(versions.at(-1) || '') + '</textarea></label>' +
    '<button class="primary">Save version and view guidance</button><p id="revision-save-status" role="status"></p></form>' +
    '<div id="revision-writing-guide">' + (versions.length ? revisionWritingGuide(selected, versions) : '') + '</div>';
}

function revisionWritingGuide(question, versions) {
  return '<section class="panel"><h2>Question-specific mark scheme</h2><div class="mark-scheme">' + escapeHtml(question.scheme) +
    '</div>' + (question.note ? '<p>' + escapeHtml(question.note) + '</p>' : '') +
    '<h3>Compare your versions</h3>' + versions.map((version, index) => '<details><summary>Version ' + (index + 1) +
      '</summary><p class="mark-scheme">' + escapeHtml(version) + '</p></details>').join('') + '</section>';
}

function setupRevisionWriting(id) {
  const form = document.querySelector('#revision-writing-form');
  if (!form) return;
  form.onsubmit = event => {
    event.preventDefault();
    const response = new FormData(form).get('response').trim();
    if (!response) return;
    const key = 'writing-' + id;
    const versions = revisionState(key, []);
    if (response !== versions.at(-1)) versions.push(response);
    saveRevisionState(key, versions);
    document.querySelector('#revision-writing-guide').innerHTML =
      revisionWritingGuide(questions.find(question => question.id === id), versions);
  };
}

function revisionTeach(code) {
  const topic = revisionLab.topics.find(item => item.code === code);
  return heading('Explain in your own words', 'Teach Jojo', 'Write your reasoning, then use the worked check to review your explanation.') +
    '<form class="panel" id="revision-teach-form"><label class="field">Topic<select name="topic">' +
    revisionLab.topics.map(item => '<option value="' + item.code + '"' + (item === topic ? ' selected' : '') + '>' +
      escapeHtml(item.title) + '</option>').join('') + '</select></label>' +
    (topic ? '<h2>' + escapeHtml(topic.prompt) + '</h2><label class="field">Your explanation<textarea required name="explanation"></textarea></label>' +
      '<button class="primary">Compare my reasoning</button><div class="feedback" role="status" hidden></div>' :
      '<button class="primary">Open explanation task</button>') + '</form>';
}

function setupRevisionTeach(code) {
  const form = document.querySelector('#revision-teach-form');
  if (!form) return;
  const select = form.elements.namedItem('topic');
  select.onchange = () => { location.hash = '#revision-teach/' + select.value; };
  form.onsubmit = event => {
    event.preventDefault();
    if (!code) { location.hash = '#revision-teach/' + select.value; return; }
    const topic = revisionLab.topics.find(item => item.code === code);
    if (!topic || !form.elements.namedItem('explanation').value.trim()) return;
    const [answer, reason] = topic.options[topic.answer];
    const feedback = form.querySelector('.feedback');
    feedback.hidden = false;
    feedback.innerHTML = '<h3>Worked reasoning</h3><p><strong>' + escapeHtml(answer) + '</strong> — ' + escapeHtml(reason) +
      '</p><p>Check that your answer states the outcome and explains the economic link. Change one assumption and explain whether your conclusion still holds.</p>' +
      revisionNotesLinks(code);
  };
}

const revisionMockModes = { p1: 60, p2: 120 };

function revisionTest() {
  const state = revisionState('test', null);
  if (state) return revisionAttempt(state);
  return heading('Exam practice', 'Test builder and original mocks', 'Answers and the timer are saved in this browser.') +
    '<section class="panel"><h2>2027 mock papers</h2><p>Paper 1 uses 40 questions selected from the EcBiz bank. Paper 2 uses an original case and four structured choices.</p>' +
    '<div class="row"><button type="button" data-revision-mock="p1">Paper 1 · 60 minutes</button>' +
    '<button type="button" data-revision-mock="p2">Paper 2 · 120 minutes</button></div></section>' +
    '<form class="panel" id="revision-test-builder"><h2>Custom practice</h2><div class="row">' +
    '<label class="field">Topic<select name="topic"><option value="">All topics</option>' +
    revisionLab.topics.map(topic => '<option value="' + topic.code + '">' + escapeHtml(topic.title) + '</option>').join('') +
    '</select></label><label class="field">Format<select name="format"><option value="mcq">Multiple choice</option><option value="written">Structured</option></select></label>' +
    '<label class="field">Questions<input name="count" type="number" min="1" max="40" value="10" required></label>' +
    '<label class="field">Minutes (0 for untimed)<input name="minutes" type="number" min="0" max="180" value="0" required></label></div>' +
    '<button class="primary">Start test</button><p id="revision-save-status" role="status"></p></form>';
}

function revisionAttempt(state) {
  const review = state.finished;
  const mock2 = state.mode === 'p2';
  const groups = mock2 ? revisionPaper2.map((group, index) => ({...group, index})) : [];
  const bank = state.ids.map(id => questions.find(question => question.id === id)).filter(Boolean);
  const selected = mock2 ? groups.filter(group => group.index === 0 || state.selection.includes(group.index)) : [];
  const score = bank.filter(q => q.options && state.answers[q.id] === String(q.answer)).length;
  const mcqs = bank.filter(q => q.options).length;
  const marks = mock2 ? 80 : bank.reduce((total, question) => total + question.marks, 0);
  const input = (id, value) => '<label class="field">Your answer<textarea name="' + escapeHtml(id) + '"' +
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
          (group.index === 0 && part === 3 && !review ? '<p>Draw your diagram on paper and describe the key changes here.</p>' : '') +
          input(key, state.answers[key]) + reviewScheme(guide);
      }).join('') + '</fieldset></section>';
  }).join('') : bank.map((question, index) =>
    '<section class="panel"><h2>' + (index + 1) + '. ' + escapeHtml(question.q) + ' [' + question.marks + ']</h2>' +
    (question.case ? '<p>' + escapeHtml(question.case) + '</p>' : '') +
    (question.options ? question.options.map((option, i) => '<label class="choice"><input type="radio" name="' +
      escapeHtml(question.id) + '" value="' + i + '"' + (state.answers[question.id] === String(i) ? ' checked' : '') +
      (review ? ' disabled' : '') + '> ' + escapeHtml(option) + '</label>').join('') : input(question.id, state.answers[question.id])) +
    reviewScheme(question.options ? 'Correct answer: ' + question.options[question.answer] + '\n' + question.why : question.scheme) +
    '</section>').join('');
  const title = state.mode === 'p1' ? 'EcBiz Paper 1 mock' : mock2 ? 'EcBiz Paper 2 mock' : 'Custom practice test';
  return heading('Original EcBiz practice', title, marks + ' marks' + (review && mcqs ? ' · Score ' + score + '/' + mcqs : '')) +
    (mock2 ? '<p>Answer all of Section A and choose three Section B questions.</p>' : '') +
    (!review && state.deadline ? '<p id="revision-clock"></p>' : '') +
    (review ? '<button id="revision-test-reset" type="button">Build another test</button>' : '') +
    '<p id="revision-save-status" role="status"></p><form id="revision-attempt">' + body +
    (!review ? '<button class="primary">Finish and review</button><button id="revision-test-reset" type="button">Discard attempt</button>' : '') +
    '</form>' + (review && mock2 ? '<section class="panel"><h2>8-mark discussion bands</h2><p>6–8 for developed analysis of both sides, 3–5 for some developed reasoning with limited depth or balance, 1–2 for relevant undeveloped points, 0 for no creditworthy material.</p></section>' : '');
}

function setupRevisionTest() {
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
    const state = { mode, ids: shuffled.slice(0, count).map(q => q.id), answers: {}, selection: [],
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
  if (state.finished) return;
  const form = document.querySelector('#revision-attempt');
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
      if (left) window.setTimeout(tick, 250);
      else finish();
    }
    tick();
  }
}

function revisionRetry(id) {
  const question = questions.find(q => q.id === id && q.options);
  if (!question) return revisionMistakes();
  return link('← Mistakes log', '#revision-mistakes', 'text-link') +
    heading('Retry', 'Try the question again', escapeHtml(question.q)) +
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

const revisionRoutes = {
  revision: revisionHub, 'revision-topics': revisionTopics, 'revision-mistakes': revisionMistakes,
  'revision-papers': revisionPapers, 'revision-writing': revisionWriting, 'revision-teach': revisionTeach,
  'revision-test': revisionTest, 'revision-retry': revisionRetry
};
const revisionSetups = {
  'revision-topics': setupRevisionTopic, 'revision-writing': setupRevisionWriting,
  'revision-teach': setupRevisionTeach, 'revision-test': setupRevisionTest, 'revision-retry': setupRevisionRetry
};

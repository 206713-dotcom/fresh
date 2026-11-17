// Original practice for Cambridge 0455 (first examination 2027).
// Topic codes follow the Cambridge syllabus and the Save My Exams 2027 revision notes.
// Numerical items use exact values. Alternatives model common sign, denominator,
// classification, or direction errors. The marked option and working travel together.
(() => {
  const topics = new Map(questions.map(item => [item.topic, {
    c: item.c, chapter: item.chapter, topic: item.topic, topicName: item.topicName
  }]));

  // Retain legacy scenario sets whose focus is a named syllabus concept.
  // Scenario numbers match across the 4-, 6- and 8-mark banks.
  const retainedScenarios = [
    [17, 18, 19, 21, 24, 25, 26, 27, 30],
    [11, 13, 16, 17, 19, 20, 22, 25, 26, 27, 28, 29, 30],
    [8, 10, 12, 13, 14, 18, 20, 21, 22, 25, 27, 28, 29, 30],
    [2, 4, 7, 8, 9, 10, 11, 14, 15, 16, 18, 19, 21, 24, 25, 26, 27, 28],
    [2, 7, 8, 10, 12, 13, 14, 16, 19, 22, 23, 24, 26, 27, 28, 30],
    [1, 3, 4, 5, 9, 12, 13, 14, 15, 16, 18, 19, 23, 25, 29, 30]
  ];
  const excludedShort = new Set([
    '0455-C01-P2-M02-0019', // Duplicates the opportunity-cost definition.
    '0455-C06-P2-M02-0006'  // Import dependence as a standalone definition.
  ]);
  const genericStem = /^(?:A decision-maker plans|Which of the following best supports a proposal|Which factor might make the proposal|An economist is considering whether|Which economic explanation is most directly linked to|A case study states:)/i;
  const legacy = questions.filter(item => {
    if (item.marks === 1) {
      return !genericStem.test(item.q)
        && !(item.c === 1 && /total sales revenue\?$/.test(item.q))
        && new Set(item.options).size === 4
        && !/renewable-energy equipment|fixed exchange rate|perfect competition|marginal (?:cost|rate)|comparative advantage|absolute advantage/i.test(
          [item.q, ...item.options, item.why].join(' ')
        );
    }
    if (item.marks === 2) return !excludedShort.has(item.id);
    return retainedScenarios[item.c].includes(Number(item.id.slice(-4)));
  });
  questions.length = 0;
  questions.push(...legacy);

  const rotate = (values, index) => values[index % values.length];
  const pair = (values, index) => [
    rotate(values, index),
    rotate(values, index + 1 + Math.floor(index / values.length) % (values.length - 1))
  ];
  const pick = (index, values) => rotate(values, index);
  const directional = ['Higher price and higher quantity', 'Higher price and lower quantity',
    'Lower price and higher quantity', 'Lower price and lower quantity'];
  const choice = (stem, options, answer, why) => ({
    stem, correct: options[answer], wrong: options.filter((_, index) => index !== answer), why
  });
  const units = (values, unit) => values.map(value => value + ' ' + unit);
  const money = values => values.map(value => '$' + value);

  const report = ['school', 'hospital', 'public library', 'sports centre', 'bus station',
    'flood barrier', 'water treatment plant', 'public park', 'recycling centre', 'health clinic',
    'bridge', 'drainage system', 'fire station', 'public swimming pool', 'rail station',
    'vocational college'];
  const goods = ['bicycles', 'lamps', 'chairs', 'desks', 'kettles', 'backpacks', 'umbrellas',
    'shoes', 'jackets', 'computers', 'televisions', 'fans', 'radios', 'washing machines',
    'books', 'scooters', 'water filters', 'phones', 'tables', 'printers'];
  const foods = ['apples', 'pears', 'tomatoes', 'potatoes', 'oranges', 'onions', 'bananas',
    'cucumbers', 'berries', 'lemons', 'mangoes', 'peaches', 'carrots', 'peppers',
    'melons', 'plums', 'cabbages', 'beans', 'cherries', 'avocados'];
  const occupations = ['builders', 'nurses', 'mechanics', 'teachers', 'drivers', 'electricians',
    'plumbers', 'bakers', 'programmers', 'carpenters', 'accountants', 'chefs', 'designers',
    'engineers', 'technicians', 'tailors', 'painters', 'machinists', 'gardeners', 'dentists'];

  const basic = [
    ['1.1', i => {
      const [first, second] = pair(report, i);
      const budget = 14 + i * 2;
      return choice('A council has $' + budget + 'm. It can build a ' + first + ' or a ' + second
        + ', but it cannot finance both. Why must it choose?',
      ['Resources are scarce relative to wants.', 'Goods provided by a council are free goods.',
        'The wants of local residents are already satisfied.', 'Every project uses the same factors of production.'],
      0, 'The council’s limited budget cannot finance all the projects it wants.');
    }],
    ['1.1', i => {
      const [first, second] = pair(goods, i);
      const n = 20 + i;
      return choice('A firm has enough inputs to make ' + n + ' more ' + first + ' or ' + n
        + ' more ' + second + '. It decides to make more ' + first + '. Which resource allocation question does this decision answer?',
      ['What to produce?', 'How to produce?', 'For whom to produce?', 'How should the product be transported?'],
      0, 'Choosing between products determines what is produced.');
    }],
    ['1.1', i => {
      const [first, second] = pair(foods, i);
      const farm = 'A farm grows ' + first + ' and ' + second + '. ';
      const variants = [
        ['It changes from hand harvesting to machine harvesting.', 1, 'Choosing a production method answers how to produce.'],
        ['It allocates more land to ' + second + '.', 0, 'Choosing its output mix answers what to produce.'],
        ['It sets aside part of each harvest for low-income households.', 2, 'Choosing the intended consumers answers for whom to produce.']
      ];
      const [event, answer, why] = pick(i, variants);
      return choice(farm + event + ' Which basic economic question does this decision address?',
        ['What to produce?', 'How to produce?', 'For whom to produce?', 'What is the reward for land?'], answer, why);
    }],
    ['1.2', i => {
      const [good, other] = pair(goods, i);
      const resources = ['The land on which its factory stands', 'The assembly-line workers',
        'The equipment used to assemble the products', 'The owner who organises production and bears the risk'];
      const factors = ['land', 'labour', 'capital', 'enterprise'];
      const definitions = ['Land includes natural resources used in production.',
        'Labour is human effort used in production.', 'Capital consists of human-made aids to production.',
        'Enterprise organises resources and bears business risk.'];
      const answer = i % factors.length;
      return choice('A factory makes ' + good + ' and ' + other + '. Which input is an example of ' + factors[answer] + '?',
        resources, answer, definitions[answer]);
    }],
    ['1.2', i => {
      const [crop, other] = pair(foods, i);
      const items = ['the owner of a field used to grow both crops', 'workers who harvest both crops',
        'a lender who provides funds for harvesting machinery', 'the owner who takes the risk of running the business'];
      const rewards = ['Rent', 'Wages', 'Interest', 'Profit'];
      const answer = i % rewards.length;
      return choice('A farm produces ' + crop + ' and ' + other + '. Which factor reward is earned by ' + items[answer] + '?',
        rewards, answer, rewards[answer] + ' is the reward for ' + ['land.', 'labour.', 'capital.', 'enterprise.'][answer]);
    }],
    ['1.3', i => {
      const [first, second] = pair(report, i);
      const budget = 12 + i;
      return choice('A council can spend its $' + budget + 'm budget on only one project. It ranks a '
        + first + ' first and a ' + second + ' second. It funds its first choice. What is the opportunity cost?',
      ['The benefits of the ' + second, 'The benefits of the ' + first,
        'The benefits of both projects', 'The total cost of building both projects'],
      0, 'The benefits of the second-ranked project are the next best alternative forgone.');
    }],
    ['1.3', i => {
      const [job, other] = pair(occupations, i);
      const high = 140 + 5 * i;
      return choice('Two one-day jobs for ' + job + ' and ' + other
        + ' respectively are open to a worker qualified for both. They pay $' + high + ' and $'
        + (high - 25) + '. The worker can do only one and chooses the first. If pay is all that matters, what is the opportunity cost?',
      money([high - 25, high, 25, 2 * high - 25]), 0, 'The worker forgoes the pay from the next best available job.');
    }],
    ['1.4', i => {
      const [a, b] = pair(goods, i);
      const start = 40 + i * 2;
      const gain = 6 + i % 7;
      const loss = 2 + i % 3;
      return choice('Two points on a production possibility curve show (' + start + ' ' + a + ', ' + start
        + ' ' + b + ') and (' + (start + gain) + ' ' + a + ', ' + (start - loss) + ' ' + b
        + '). What is the opportunity cost of the extra ' + a + ' when moving from the first point to the second?',
      [loss + ' ' + b, gain + ' ' + a, (start - loss) + ' ' + b, start + ' ' + a],
      0, start + ' − ' + (start - loss) + ' = ' + loss + ' units of the other product forgone.');
    }],
    ['1.4', i => {
      const [a, b] = pair(goods, i);
      const cases = [
        ['Training raises productivity in both industries.', 0],
        ['A disaster destroys productive capital in both industries.', 1],
        ['Resources move between the industries while remaining fully employed.', 2],
        ['Idle workers enter production. Resources and technology are unchanged.', 3]
      ];
      const moves = ['An outward shift', 'An inward shift', 'A movement along the curve',
        'A movement from inside the curve towards the curve'];
      const [event, key] = pick(i, cases);
      return choice('An economy produces ' + a + ' and ' + b + '. ' + event
        + ' How would this be represented using its production possibility curve?', moves, key,
      ['Higher productivity expands maximum possible output.', 'Losing capital reduces maximum possible output.',
        'A different efficient mix is produced with the same capacity.', 'Using idle labour raises actual output without increasing productive capacity.'][key]);
    }]
  ];

  const markets = [
    ['2.1', i => {
      const [a, b] = pair(foods, i);
      return choice('In a street market, retailers buy ' + a + ' and ' + b + ' from growers. What is a role of the retail buyers in this market?',
        ['They decide how much they are willing and able to purchase at each price.',
          'They fix every grower’s costs of production.', 'They determine how much each grower can harvest.',
          'They prevent growers from selling to competing retailers.'], 0,
        'Buyers express demand through their willingness and ability to pay.');
    }],
    ['2.2', i => {
      const [a, b] = pair(goods, i);
      return choice('Consumers view two brands of ' + a + ' as substitutes. One brand cuts its price by '
        + (5 + i) + '%. The other brand keeps its price unchanged and also sells ' + b
        + '. What happens to the demand curve for the other brand’s ' + a + '?',
      ['It shifts left.', 'It shifts right.', 'There is an extension along it.', 'There is a contraction along it.'],
      0, 'A substitute has become cheaper, reducing demand for this brand at each own price.');
    }],
    ['2.3', i => {
      const [a, b] = pair(foods, i);
      const effect = i % 2;
      const changes = ['fall', 'rise'];
      return choice('Transport costs ' + changes[effect] + ' by $' + (8 + i) + ' per delivery for producers of '
        + a + ' and ' + b + '. Selling prices are unchanged. How does this affect supply of ' + a + '?',
      ['The curve shifts right.', 'The curve shifts left.', 'Quantity supplied moves up the existing curve.',
        'Quantity supplied moves down the existing curve.'], effect,
      'A change in production or distribution costs changes quantity supplied at each price.');
    }],
    ['2.4', i => {
      const product = pick(i, goods);
      const a = 100 + i * 4;
      const b = 13 + i % 23;
      const shortage = i % 2 === 0;
      return choice('At $' + (15 + i) + ', ' + (shortage ? a + b : a) + ' ' + product
        + ' are demanded and ' + (shortage ? a : a + b) + ' are supplied. What exists at this price?',
      ['A shortage of ' + b, 'A surplus of ' + b, 'An equilibrium quantity of ' + a,
        'A shortage of ' + (2 * a + b)], shortage ? 0 : 1,
      (shortage ? 'Quantity demanded exceeds quantity supplied' : 'Quantity supplied exceeds quantity demanded')
        + ' by ' + (a + b) + ' − ' + a + ' = ' + b + '.');
    }],
    ['2.5', i => {
      const [a, b] = pair(goods, i);
      const situations = [
        ['A rise in consumer incomes raises demand for both normal goods. Supply stays the same.', 0],
        ['Input costs rise for producers of both goods. Demand stays the same.', 1],
        ['New machinery cuts production costs for both goods. Demand stays the same.', 2],
        ['A substitute for ' + a + ' becomes cheaper. Supply of both goods stays the same.', 3]
      ];
      const [event, answer] = pick(i, situations);
      return choice('A market sells ' + a + ' and ' + b + '. ' + event
        + ' What happens to the equilibrium price and quantity of ' + a + '?', directional, answer,
      ['Demand shifts right.', 'Supply shifts left.', 'Supply shifts right.', 'Demand shifts left.'][answer]);
    }],
    ['2.6', i => {
      const n = 100 * (8 + i);
      const p = pick(i, [4, 5, 8, 10, 20]);
      const q = p * pick(Math.floor(i / 5), [2, 3, 4]);
      return choice('Weekly sales of ' + pick(i, goods) + ' rise from ' + n + ' to ' + (n + n * q / 100)
        + ' when their price falls by ' + p + '%. What is the magnitude of price elasticity of demand?',
      [String(q / p), String(+(p / q).toFixed(2)), String(q - p), String(q + p)], 0,
      'Quantity demanded rises by ' + q + '%. The size of PED is ' + q + ' ÷ ' + p + ' = ' + q / p + '.');
    }],
    ['2.7', i => {
      const n = 100 * (6 + i);
      const p = pick(i, [10, 20, 30, 40]);
      const q = p / 2;
      return choice('A rise in price of ' + p + '% raises weekly quantity supplied of ' + pick(i, foods) + ' from '
        + n + ' kg to ' + (n + n * q / 100) + ' kg. What is the price elasticity of supply?',
      [String(q / p), String(p / q), String(p - q), String(q + p)], 0,
      'Quantity supplied rises by ' + q + '%. PES = ' + q + ' ÷ ' + p + ' = ' + q / p + '.');
    }],
    ['2.8', i => {
      const [a, b] = pair(goods, i);
      return choice('In a market economy, consumers switch their spending from ' + a + ' to ' + b
        + '. What is most likely to encourage firms to devote more resources to making ' + b + '?',
      ['The prospect of higher profits from ' + b, 'A government order to make more ' + a,
        'A fall in demand for ' + b, 'A rule requiring an equal output of both goods'], 0,
      'Higher demand can raise selling prices and the expected profitability of expanding output.');
    }],
    ['2.9', i => {
      const [a, b] = pair(goods, i);
      const harms = ['noise suffered by local residents', 'damage to neighbouring crops from factory pollution',
        'clean-up costs paid by residents after factory waste enters a river',
        'health costs borne by nearby households because of air pollution'];
      return choice('A factory produces ' + a + ' and ' + b + '. Which is an external cost of its production?',
        [pick(i, harms), 'The factory’s wage bill', 'The factory’s electricity bill', 'The rent paid by the factory'],
        0, 'The cost falls on a third party outside the production decision.');
    }],
    ['2.10', i => {
      const [a, b] = pair(goods, i);
      return choice('Private firms sell ' + a + ' and ' + b + '. The government taxes their sale and uses tax revenue to provide schools. Which system does this illustrate?',
        ['A mixed economic system', 'A market system with no government intervention',
          'An economy in which all output is publicly owned', 'An economy organised entirely by barter'], 0,
        'Private market activity exists alongside government intervention and public provision.');
    }]
  ];

  const micro = [
    ['3.1', i => {
      const [a, b] = pair(goods, i);
      const situations = [
        ['uses cash to pay a supplier', 'The cash is accepted in payment for goods.'],
        ['uses dollar prices to compare the value of its products', 'The prices are measured in the same monetary units.'],
        ['holds cash to spend next month', 'Money allows purchasing power to be transferred to the future.'],
        ['signs an agreement to pay a fixed dollar amount in six months', 'Money is used to specify the amount owed in a future payment.']
      ];
      const key = i % situations.length;
      return choice('A retailer sells ' + a + ' and ' + b + '. Which function of money is illustrated when it '
        + situations[key][0] + '?', ['Medium of exchange', 'Unit of account', 'Store of value',
        'Standard of deferred payment'], key, situations[key][1]);
    }],
    ['3.2', i => {
      const borrowed = 500 + 20 * i;
      return choice('A household needs to borrow $' + borrowed + '. Interest rates on new loans rise. Other influences are unchanged. How is the household most likely to respond?',
        ['Borrow less because the cost of credit is higher.', 'Borrow more because the cost of credit is lower.',
          'Save less because the return to saving necessarily falls.', 'Borrow more because its income must have risen.'], 0,
        'Higher interest rates increase the cost of new borrowing and make some purchases on credit less attractive.');
    }],
    ['3.3', i => {
      const [job, other] = pair(occupations, i);
      const cases = [
        [' demand for ', ' rises while its supply is unchanged', 0, 'Stronger demand raises the equilibrium wage and employment.'],
        [' demand for ', ' falls while its supply is unchanged', 1, 'Weaker demand lowers the equilibrium wage and employment.'],
        [' the supply of ', ' rises while demand is unchanged', 2, 'A rise in labour supply lowers the equilibrium wage and raises employment.'],
        [' the supply of ', ' falls while demand is unchanged', 3, 'A fall in labour supply raises the equilibrium wage and lowers employment.']
      ];
      const [before, after, key, why] = pick(i, cases);
      return choice('In a competitive labour market for ' + job + ' and a separate market for ' + other
        + ',' + before + job + after + '. What happens in the market for ' + job + '?',
        ['Higher wages and higher employment', 'Lower wages and lower employment',
          'Lower wages and higher employment', 'Higher wages and lower employment'], key, why);
    }],
    ['3.4', i => {
      const [a, b] = pair(foods, i);
      const events = ['a rival canning firm', 'a farm supplying the crops it cans',
        'a wholesaler distributing the cans it produces', 'an unrelated insurance company'];
      const key = i % events.length;
      return choice('A firm that cans ' + a + ' and ' + b + ' merges with ' + events[key] + '. What type of merger is this?',
        ['Horizontal', 'Vertical backward', 'Vertical forward', 'Conglomerate'], key,
        ['The rival operates at the same production stage in the same industry.',
          'The farm is at an earlier stage in the same supply chain.',
          'Distribution is a later stage in the same supply chain.',
          'The businesses are in unrelated industries.'][key]);
    }],
    ['3.5', i => {
      const workers = 8 + i;
      const before = 10 + i % 11;
      const after = before + 3;
      return choice('A factory with ' + workers + ' workers raises daily output of ' + pick(i, goods) + ' from '
        + workers * before + ' to ' + workers * after + ' without changing staff numbers. What is labour productivity after the change?',
      units([after, before, 3 * workers, after * workers], 'units per worker per day'), 0,
      workers * after + ' ÷ ' + workers + ' = ' + after + ' units per worker per day.');
    }],
    ['3.6', i => {
      const quantity = 30 + i * 3;
      const avc = 3 + i % 7;
      const afc = 1 + i % 2;
      return choice('A firm makes ' + quantity + ' ' + pick(i, goods) + '. Its total fixed cost is $' + quantity * afc
        + ' and its total variable cost is $' + quantity * avc + '. What is its average total cost?',
      money([afc + avc, afc, avc, quantity * (afc + avc)]), 0,
      'Add fixed and variable cost, then divide by output: (' + quantity * afc + ' + ' + quantity * avc
        + ') ÷ ' + quantity + ' = $' + (afc + avc) + '.');
    }],
    ['3.6', i => {
      const quantity = 40 + i * 3;
      const price = 8 + i % 14;
      return choice('A firm sells ' + quantity + ' ' + pick(i, goods) + ' at $' + price + ' each. What is its total revenue?',
        money([quantity * price, quantity + price, quantity * (price - 1), price]), 0,
        'Total revenue = price × quantity sold = $' + price + ' × ' + quantity + ' = $' + quantity * price + '.');
    }],
    ['3.7', i => {
      const [a, b] = pair(goods, i);
      return choice('A single firm supplies ' + a + '. Many small firms sell ' + b
        + '. Which feature best explains why the sole supplier may be able to charge a relatively high price?',
      ['Buyers have no rival suppliers of that product.', 'It must sell all its output at a fixed market price.',
        'Any higher price is immediately matched by entry from new firms.',
        'There are more firms competing to sell this product.'], 0,
      'A monopoly faces no direct competition from other suppliers in its market.');
    }]
  ];

  const macro = [
    ['4.1', i => {
      const initial = 20 + i;
      const final = initial + 8;
      return choice('Exports stay unchanged while an increase in employment raises household spending. Imports rise from $'
        + initial + 'bn to $' + final + 'bn. Other current account items are unchanged. Which pair of government aims does this illustrate a potential conflict between?',
      ['Lower unemployment and current account stability',
        'Lower inflation and environmental sustainability',
        'Redistribution of income and environmental sustainability',
        'Lower inflation and redistribution of income'], 0,
      'More import spending without higher receipts worsens the current account balance.');
    }],
    ['4.2', i => {
      const revenue = 60 + i * 2;
      const difference = 5 + i % 11;
      const deficit = i % 2 === 0;
      const spending = revenue + (deficit ? difference : -difference);
      return choice('A government receives $' + revenue + 'bn in revenue and spends $' + spending
        + 'bn. What is its budget balance?', ['$' + difference + 'bn deficit', '$' + difference + 'bn surplus',
        '$' + (revenue + spending) + 'bn surplus', 'A balanced budget'], deficit ? 0 : 1,
      'Government revenue minus expenditure is $' + revenue + 'bn − $' + spending + 'bn.');
    }],
    ['4.3', i => {
      const start = 4 + i % 5;
      const end = start + 0.25 * (1 + Math.floor(i / 5) % 7);
      const [a, b] = pair(goods, i);
      return choice('The central bank raises the policy interest rate from ' + start + '% to ' + end
        + '%. Households often buy ' + a + ' and ' + b + ' on credit. What is the likely initial effect on their spending on these products?',
      ['Spending falls because borrowing becomes more expensive.', 'Spending rises because borrowing becomes cheaper.',
        'Spending rises because saving becomes less attractive.', 'Spending is unaffected because interest only affects firms.'], 0,
      'Higher loan rates increase repayment costs, discouraging some credit-financed consumption.');
    }],
    ['4.4', i => {
      const [job, other] = pair(occupations, i);
      const cases = [
        ['funds training for ' + job + ' and ' + other,
          'Workers can become more productive as they gain relevant skills.'],
        ['improves public transport to workplaces employing ' + job + ' and ' + other,
          'Improved transport can reduce the cost of getting to work and make more jobs accessible.'],
        ['subsidises apprenticeships for ' + job + ' and ' + other,
          'Apprenticeships can expand the supply of trained workers and improve productive capacity.']
      ];
      const [event, why] = pick(i, cases);
      return choice('A government ' + event + '. How could the policy increase productive capacity?',
        [why, 'It must reduce the number of economically active workers.',
          'It makes it harder for workers to find suitable jobs.',
          'It increases capacity by raising the general price level.'], 0, why);
    }],
    ['4.5', i => {
      const initial = 100 * (i + 7);
      const growth = 2 + i % 8;
      return choice('Real GDP rises from $' + initial + 'm to $' + (initial + initial * growth / 100)
        + 'm. What is the rate of economic growth?', [growth + '%', (100 + growth) + '%',
        (initial * growth / 100) + '%', '−' + growth + '%'], 0,
      'Divide the change in real GDP by its initial value and multiply by 100.');
    }],
    ['4.6', i => {
      const workforce = 1000 * (10 + i);
      const rate = 4 + i % 16;
      const unemployed = workforce * rate / 100;
      return choice('There are ' + (workforce - unemployed) + ' employed people, ' + unemployed
        + ' unemployed people actively seeking work and ' + workforce + ' people outside the labour force. What is the unemployment rate?',
      [rate + '%', rate / 2 + '%', (100 - rate) + '%', (rate * 2) + '%'], 0,
      'The labour force includes ' + (workforce - unemployed) + ' employed and ' + unemployed
        + ' unemployed people. The rate is ' + unemployed + ' ÷ ' + workforce + ' × 100 = ' + rate + '%.');
    }],
    ['4.7', i => {
      const prior = 100 + i * 4;
      const rate = 2 + i % 7;
      const current = (prior * (100 + rate) / 100).toFixed(2);
      return choice('The consumer price index rises from ' + prior + ' to ' + current
        + ' over a year. What is the annual inflation rate?',
      [rate + '%', (rate + 1) + '%', (rate * 2) + '%', '−' + rate + '%'], 0,
      '(' + current + ' − ' + prior + ') ÷ ' + prior + ' × 100 = ' + rate + '%.');
    }]
  ];

  const development = [
    ['5.1', i => {
      const population = 2 + i % 14;
      const perHead = 1000 * (4 + i);
      return choice('A country with ' + population + ' million people has real GDP of $'
        + population * perHead + ' million. What is real GDP per head?',
      money([perHead, population * perHead, perHead * (population + 1), perHead + 500]), 0,
      'Divide total real GDP by population: $' + population * perHead + ' million ÷ '
        + population + ' million = $' + perHead + '.');
    }],
    ['5.1', i => {
      const level = 50 + i % 29;
      const rise = 2 + Math.floor(i / 29);
      return choice('Average life expectancy rises from ' + level + ' to ' + (level + rise)
        + ' years. Education and income measures used in the Human Development Index stay unchanged. What happens to HDI?',
      ['It rises because the health component improves.', 'It falls because the education component falls.',
        'It stays constant because HDI only measures GDP per head.',
        'It rises because a larger population directly raises HDI.'], 0,
      'Life expectancy measures the health dimension of HDI.');
    }],
    ['5.2', i => {
      const threshold = 450 + 10 * i;
      const gap = 20 + i % 11;
      return choice('The minimum monthly income required to meet basic needs is $' + threshold
        + '. A household receives $' + (threshold - gap) + ' per month and has no other resources. Which conclusion follows?',
      ['It is in absolute poverty.', 'It is in relative poverty only.',
        'It is in neither absolute nor relative poverty.',
        'It cannot be in absolute poverty unless its income is zero.'], 0,
      'The household’s resources are below the amount needed to afford basic necessities.');
    }],
    ['5.2', i => {
      const threshold = 600 + i * 11;
      return choice('A household has a monthly disposable income of $' + (threshold - 85) + '. The relative poverty threshold is $' + threshold
        + '. Which measure would immediately bring this household’s income up to the threshold?',
      ['Increasing its monthly cash benefit by $85', 'Increasing its monthly income tax by $85',
        'Increasing its monthly cash benefit by $75', 'Reducing its monthly cash benefit by $75'], 0,
      'The household needs an extra $85 per month to reach the threshold.');
    }],
    ['5.3', i => {
      const births = 900 + i * 17;
      const deaths = 700 + i * 13;
      const arrivals = 440 + i * 4;
      const departures = 340 + i * 4 - (i % 2 ? -50 : 50);
      const natural = births - deaths;
      const net = arrivals - departures;
      return choice('A country records ' + births + ' births, ' + deaths + ' deaths, ' + arrivals
        + ' immigrants and ' + departures + ' emigrants in one year. By how many people does its population increase?',
      [natural + net, natural, net, natural - net].map(String), 0,
      'Natural increase is ' + natural + ' and net migration is ' + net + '. The population increases by ' + (natural + net) + '.');
    }],
    ['5.3', i => {
      const start = 8 + i % 16;
      const end = start + (4 + Math.floor(i / 16));
      const variants = [
        ['Government pension expenditure may rise.', 'An increase in the number receiving pensions can increase public expenditure.'],
        ['Demand for services for elderly patients may rise.', 'A larger older population can increase demand for elderly healthcare.']
      ];
      const [correct, why] = pick(i, variants);
      return choice('The share of a country’s fixed population aged 65 or over rises from ' + start + '% to '
        + end + '%. Which is a likely consequence of this demographic change?',
      [correct, 'The number of older residents decreases.', 'The proportion of older residents has stayed the same.',
        'The total population must increase.'], 0, why);
    }],
    ['5.4', i => {
      const [a, b] = pair(occupations, i);
      const graduates = 300 + i * 19;
      return choice('Country X trains ' + graduates + ' additional ' + a + ' and ' + b
        + ' each year. Country Y, with otherwise similar resources, lacks these skills. How can the additional training help explain a difference in development?',
      ['It may raise output per worker by improving skills.', 'It necessarily reduces worker productivity.',
        'It eliminates the need to use capital equipment.', 'It reduces the supply of skilled workers.'], 0,
      'Differences in education and training can lead to differences in labour productivity and real output per head.');
    }]
  ];

  const trade = [
    ['6.1', i => {
      const [a, b] = pair(foods, i);
      return choice('A country specialises in producing ' + a + ' for export and imports most of its ' + b
        + '. What is a possible disadvantage of this specialisation?',
      ['A fall in world demand for ' + a + ' may sharply reduce export earnings.',
        'All goods used domestically must now be produced domestically.',
        'The country necessarily loses all gains from economies of scale.',
        'Prices for its exports can never change.'], 0,
      'Reliance on a narrow group of exports exposes the economy to changes in world demand for those products.');
    }],
    ['6.2', i => {
      const [a, b] = pair(goods, i);
      const tools = ['charges a tax on imported ' + a, 'sets a maximum number of imported ' + a,
        'prohibits all imports of ' + a, 'pays domestic producers of ' + a + ' for each unit they sell'];
      const key = i % tools.length;
      return choice('A country imports ' + a + ' and ' + b + '. Its government ' + tools[key]
        + '. Which trade measure is it using for ' + a + '?',
      ['A tariff', 'An import quota', 'An embargo', 'A subsidy for domestic firms'], key,
      ['A tariff is a tax on imports.', 'A quota sets a quantity limit on imports.',
        'An embargo bans specified trade.', 'An output payment to domestic producers is a subsidy.'][key]);
    }],
    ['6.2', i => {
      const [a, b] = pair(goods, i);
      return choice('A multinational that makes ' + a + ' and ' + b
        + ' opens a factory in a host country with high unemployment. What is a potential benefit to the host country?',
      ['Employment may rise when the factory recruits local workers.',
        'All profits are guaranteed to stay in the host country.', 'The host government must lose all tax revenue.',
        'The number of domestic jobs automatically falls by the number the firm creates.'], 0,
      'The investment can create jobs directly by increasing demand for labour in the host country.');
    }],
    ['6.3', i => {
      const initial = 2 + i % 6;
      const price = initial * (initial + 1) * (8 + i);
      return choice('A firm exports ' + pick(i, goods) + ' at ' + price + ' domestic currency units per item. The exchange rate moves from '
        + initial + ' to ' + (initial + 1) + ' domestic units per US dollar. If the domestic price is unchanged, what is the new US dollar price?',
      money([price / (initial + 1), price / initial, price * (initial + 1), price]), 0,
      'Divide the domestic price by the new number of domestic currency units per US dollar.');
    }],
    ['6.3', i => {
      const [a, b] = pair(goods, i);
      const events = [
        ['Demand abroad for its exports of ' + a + ' rises.', 'Demand for its currency rises, tending to cause appreciation.'],
        ['Domestic consumers buy fewer imported ' + b + '.', 'Less domestic currency is sold to buy foreign currency, tending to cause appreciation.']
      ];
      const [event, why] = pick(i, events);
      return choice('A country has a floating exchange rate. It both imports and exports ' + a + ' and ' + b
        + '. ' + event + ' What is the likely effect on the domestic currency, other things equal?',
      ['It appreciates.', 'It depreciates.', 'Its value is fixed by the government.',
        'Its value cannot change unless banknotes are replaced.'], 0, why);
    }],
    ['6.4', i => {
      const goodsBalance = 12 + i;
      const services = 4 + i % 7;
      const primary = 2 + i % 4;
      const secondary = 1;
      const current = -goodsBalance + services - primary + secondary;
      return choice('A country has a goods deficit of $' + goodsBalance + 'bn, a services surplus of $' + services
        + 'bn, a primary income deficit of $' + primary + 'bn and a secondary income surplus of $' + secondary
        + 'bn. What is its current account balance?',
      ['$' + -current + 'bn deficit', '$' + -current + 'bn surplus',
        '$' + (goodsBalance + services + primary + secondary) + 'bn deficit', '$' + (goodsBalance - services) + 'bn deficit'],
      0, 'Add the signed balances: −' + goodsBalance + ' + ' + services + ' − ' + primary + ' + ' + secondary + ' = −' + -current + '.');
    }],
    ['6.4', i => {
      const [a, b] = pair(goods, i);
      return choice('A country exports ' + a + ' and ' + b + '. Overseas demand for both goods increases. What happens to its current account if export receipts increase and all other items are unchanged?',
      ['Its balance improves.', 'Its balance worsens.', 'Its balance is unchanged.',
        'Its balance must become exactly zero.'], 0,
      'Higher goods export receipts improve the trade-in-goods balance and, other things equal, the current account balance.');
    }]
  ];

  // Allocate 2,000 variants to each chapter, cycling through its authored
  // question patterns so the first page of each chapter covers several topics.
  const templates = [basic, markets, micro, macro, development, trade];
  for (const [chapter, chapterTemplates] of templates.entries()) {
    for (let serial = 0; serial < 2000; serial++) {
      const [topic, makeQuestion] = rotate(chapterTemplates, serial);
      const index = Math.floor(serial / chapterTemplates.length);
      const {stem, correct, wrong, why} = makeQuestion(index);
      // Stable option order, distributed across positions for all question patterns.
      const seed = ((chapter + 1) << 16) + serial + 1;
      let hash = Math.imul(seed ^ (seed >>> 16), 0x45d9f3b);
      hash = Math.imul(hash ^ (hash >>> 16), 0x45d9f3b);
      hash = (hash ^ (hash >>> 16)) >>> 0;
      const answer = hash % 4;
      const options = wrong.slice(hash % 3).concat(wrong.slice(0, hash % 3));
      options.splice(answer, 0, correct);
      questions.push({
        id: '0455-2027-MCQ-C0' + (chapter + 1) + '-' + String(serial + 1).padStart(4, '0'),
        ...topics.get(topic), paper: '1', type: 'MCQ', marks: 1, case: '', q: stem,
        options, answer, why, scheme: 'Award 1 mark for option ' + 'ABCD'[answer] + '.', note: ''
      });
    }
  }

  const structured = [
    ['BASIC-PPC-4', '1.4', 4, 'Explain two causes of an outward shift of a production possibility curve.',
      'Award up to 2 marks for each of two distinct causes. More workers available (1) allow more output with a larger labour force (1). More capital goods (1) give the economy more equipment with which to produce (1). Better technology (1) increases output per unit of input (1). Better education or training (1) raises worker productivity (1). Credit equivalent explanations of increased capacity.'],
    ['BASIC-PPC-8', '1.4', 8, 'Discuss whether a country should produce more capital goods and fewer consumer goods.',
      'For: more machinery can increase productivity and productive capacity, shifting the PPC outwards. Lower production costs could improve competitiveness and future consumption. Against: fewer consumer goods are available now, which may lower living standards. Capital goods may be unsuitable or underused if firms lack skilled workers or demand. Weigh the current opportunity cost against future output gains, taking account of the initial availability of consumer goods and existing spare capacity.'],
    ['MARKETS-PED-4', '2.6', 4, 'Explain two reasons why demand for a product may be price elastic.',
      'Award 1 mark for each distinct determinant and 1 for its explanation, up to 4. Many close substitutes (1) make it easier for buyers to switch after a price increase (1). A large share of household spending (1) gives buyers a strong incentive to cut purchases if the price rises (1). The purchase can be delayed (1) so consumers can wait or go without when prices rise (1). More time to respond (1) allows changes in habits or switching suppliers (1).'],
    ['MARKETS-PUBLIC-6', '2.9', 6, 'Analyse why a market economy may underprovide public goods.',
      'Award up to 6 for distinct linked analysis. Non-excludability (1) makes it hard to prevent non-payers benefiting (1). People have an incentive to free ride (1), limiting revenue from voluntary payments (1), so firms may not cover the costs of providing the good (1) and may provide too little or none (1). Where linked to underprovision, credit an additional user not reducing availability for others (1) or social benefits that exceed the benefits captured by a private supplier (1).'],
    ['MICRO-LABOUR-4', '3.3', 4, 'Explain two reasons why workers in one occupation may earn more than those in another.',
      'Award up to 2 per distinct reason. A greater need for qualifications (1) restricts the supply of suitably trained workers (1). Higher demand for the product workers make (1) increases derived demand for that labour (1). Poor working conditions or high risk (1) may require employers to pay more to attract workers (1). Stronger trade union bargaining power (1) may secure higher wage rates (1).'],
    ['MICRO-COST-6', '3.4', 6, 'Analyse how economies and diseconomies of scale could affect a firm as it expands.',
      'Award up to 6 marks, crediting coherent links to average cost. Larger orders (1) may secure supplier discounts (1), lowering input cost per unit (1). Larger firms can afford specialist equipment or staff (1), raising productivity (1) and lowering average cost (1). Very large operations may add layers of management (1), slowing communication and decisions (1), increasing errors, waste or average cost (1). A larger workforce may feel less recognised (1), reducing motivation and productivity (1), which may raise average costs (1).'],
    ['MACRO-SUPPLY-8', '4.4', 8, 'Discuss whether government supply-side policies are likely to improve an economy’s performance.',
      'Reasons they might: education and training raise skills and productivity, which may increase potential output and reduce structural unemployment if training matches vacancies. Better infrastructure reduces transport costs and can raise competitiveness, investment and exports. Lower unit costs may ease cost-push inflation. Reasons gains may be limited: training and infrastructure take time and use tax revenue that could fund other services. More capacity may sit idle when weak demand is the main problem. Deregulation may increase pollution if it weakens environmental standards. Weigh effectiveness against the policy chosen, the causes of weak performance, the time horizon and its opportunity cost.'],
    ['MACRO-FISCAL-6', '4.2', 6, 'Analyse how an increase in government spending could affect unemployment and inflation.',
      'Award up to 6 for distinct links. Higher government purchases increase total demand (1). Firms respond to increased sales by producing more (1) and hiring more workers (1), reducing cyclical unemployment (1). Near full capacity, extra demand may outpace output (1), causing demand-pull inflation (1). Credit that spending on training or infrastructure (1) can increase capacity (1), easing price pressures as more output can be supplied (1). Credit alternative valid links within the cap.'],
    ['DEVELOPMENT-POPULATION-4', '5.3', 4, 'Explain two possible effects of net immigration on the host economy.',
      'Award up to 2 for each distinct effect. A larger working-age population (1) may expand labour supply and productive capacity (1). More consumers (1) may increase demand for goods and services (1). More residents (1) may put pressure on housing or public services if capacity does not grow (1). Additional workers in employment (1) may increase tax revenue (1). Credit effects with a convincing explanation and avoid double counting.'],
    ['DEVELOPMENT-GDP-8', '5.1', 8, 'Discuss whether real GDP per head is a good measure for comparing living standards between countries.',
      'For: it estimates real output per person, adjusts for population size and separates price-level change over time from changes in output. More real output per person can mean more material goods and resources to fund services. Against: an average hides income inequality. Health, education, unpaid work and environmental quality are not adequately represented by the measure. International comparisons of purchasing power can be misleading if price levels are ignored. Weigh the value of the measure for material living standards against what a wider set of measures such as HDI would reveal.'],
    ['TRADE-RESTRICTIONS-4', '6.2', 4, 'Explain two reasons why a government may impose tariffs on imports.',
      'Award 1 mark for each of two distinct reasons and 1 for each linked explanation. Protect infant industries (1) by giving new domestic producers time to develop and lower costs (1). Raise public revenue (1) by collecting tax on goods that are still imported (1). Protect strategic industries (1) by supporting domestic capacity for essential supplies (1). Discourage consumption of imported demerit goods (1) by raising their price and reducing purchases (1).'],
    ['TRADE-EXCHANGE-8', '6.3', 8, 'Discuss whether depreciation of its currency is likely to benefit a country.',
      'For: export prices in foreign currency may fall, increasing export sales and employment. Higher import prices may encourage buying from domestic suppliers and improve the current account if volumes respond sufficiently. Against: dearer imported goods reduce purchasing power and dearer imported inputs raise production costs, possibly causing cost-push inflation. Export supply may be constrained, or buyers may respond only slowly to price changes. Weigh the effects using responsiveness to prices, spare capacity and dependence on indispensable imported inputs.']
  ];
  const levels = 'Use Cambridge’s 8-mark discussion bands. 6–8: developed two-sided reasoning with accurate economic analysis. 3–5: relevant, reasoned analysis with some depth, which may be one-sided. 1–2: relevant definitions or undeveloped statements. 0: no creditworthy content. Credit other valid economic arguments.';
  for (const [id, topic, marks, q, scheme] of structured) {
    questions.push({
      id: '0455-2027-P2-' + id, ...topics.get(topic),
      paper: '2', type: 'Structured', marks, q, case: '', scheme,
      note: marks === 8 ? levels : 'Accept equivalent economically valid reasoning within the mark cap.'
    });
  }
})();

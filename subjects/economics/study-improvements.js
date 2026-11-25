/* Local study evidence and flashcard scheduling. */
function topicEvidence(attempts, history, checks, bank) {
  const topics = new Map();
  const add = (code, earned, max, source) => {
    if (!/^[1-6]\.\d+$/.test(code) || !Number.isInteger(max) || max <= 0 ||
      !Number.isInteger(earned) || earned < 0 || earned > max) return;
    const entry = topics.get(code) ?? {code, earned:0, max:0, practice:0, mock:0};
    entry.earned += earned;
    entry.max += max;
    entry[source] += max;
    topics.set(code, entry);
  };
  const seen = new Set();
  for (const q of bank) {
    const entry = attempts[q.id];
    if (!entry?.answer || !Number.isInteger(entry.score)) continue;
    seen.add(q.id);
    add(q.topic, entry.score, q.marks, 'practice');
  }
  for (const [id, entry] of Object.entries(checks)) {
    if (!seen.has(id)) add(entry.topic, entry.score, 1, 'practice');
  }
  for (const mock of history.slice(0, 5)) {
    for (const [code, row] of Object.entries(mock.topics ?? {})) {
      add(code, row.earned, row.max, 'mock');
    }
  }
  return [...topics.values()].sort((a,b) => {
    // A single missed mark carries less weight than repeated misses.
    const priority = row => (row.max - row.earned) / (row.max + 3);
    return priority(b) - priority(a) || b.max - a.max || a.code.localeCompare(b.code, undefined, {numeric:true});
  });
}

function recordTopicCheck(id, topic, correct) {
  const checks = revisionState('topic-check-results', {});
  return saveRevisionState('topic-check-results', {...checks, [id]:{topic, score:Number(correct)}});
}

function questionFingerprint(question) {
  const words = text => (text ?? '').normalize('NFKC').trim().toLowerCase().replace(/\s+/g,' ');
  return [words(question.q ?? question.prompt), words(question.case),
    ...[...(question.options ?? [])].map(words).sort()].join('\u0001');
}

function questionPattern(question) {
  return question.variantKey ?? questionFingerprint(question);
}

function distinctQuestionPatterns(items, itemQuestion) {
  const seen = new Set();
  return items.filter(item => {
    const pattern = questionPattern(itemQuestion(item));
    if (seen.has(pattern)) return false;
    seen.add(pattern);
    return true;
  });
}

function freshTopicQuestion(topic, seen, exemplar, multipleChoice = true) {
  const familiar = new Set();
  const available = [];
  if (exemplar) familiar.add(questionPattern(exemplar));
  for (const q of questions) {
    if (q.topic !== topic || Boolean(q.options) !== multipleChoice) continue;
    if (seen.has(q.id) || q.id === exemplar?.id) familiar.add(questionPattern(q));
    else available.push(q);
  }
  const varied = available.filter(q => !familiar.has(questionPattern(q)));
  const original = exemplar && questionFingerprint(exemplar);
  const different = available.filter(q => !original || questionFingerprint(q) !== original);
  return varied.find(q => q.marks === exemplar?.marks) ?? varied[0] ??
    different.find(q => q.marks === exemplar?.marks) ?? different[0];
}

function weakTopicsPanel() {
  const attempts = readPracticeAnswers(), history = mockHistory();
  const evidence = topicEvidence(attempts, history, revisionState('topic-check-results', {}), questions);
  const gaps = evidence.filter(row => row.earned < row.max);
  const seen = new Set([...Object.keys(attempts), ...revisionState('reviewed-questions', []), ...history.flatMap(mock => mock.ids ?? [])]);
  const intro = '<h2 id="weak-topics-title">Weak topics</h2>';
  if (!gaps.length) {
    const message = evidence.length
      ? 'You earned all the marked points in this sample. Try another topic to see how you do.'
      : 'Finish a practice question, topic check or mock to see which topics need attention.';
    return '<section id="progress-weak-topics" class="progress-panel fx-weak-topics" tabindex="-1" aria-labelledby="weak-topics-title">' + intro +
      '<p>' + message + '</p>' + link('Open topic checks','#revision-topics') + '</section>';
  }
  const rows = gaps.slice(0, 6).map(row => {
    const fresh = freshTopicQuestion(row.code, seen);
    const missed = row.max - row.earned;
    const signals = [row.practice ? 'Practice: ' + row.practice + ' marked' : '', row.mock ? 'Mocks: ' + row.mock + ' marked' : ''].filter(Boolean);
    return '<li><div><h3>' + escapeHtml(studyTopicName(row.code)) + '</h3><p><strong>' + missed + ' of ' +
      row.max + ' marks missed</strong> · ' + signals.join(' · ') + (row.max < 3 ? ' · Small sample' : '') + '</p></div>' +
      '<div class="row">' + link('Review topic','#revision-review/' + row.code,'button primary') +
      (fresh ? link('Try a fresh question','#practice/question/' + encodeURIComponent(fresh.id)) : '') + '</div></li>';
  }).join('');
  return '<section id="progress-weak-topics" class="progress-panel fx-weak-topics" tabindex="-1" aria-labelledby="weak-topics-title">' + intro +
    '<p>Based on your saved practice results and five most recent mocks. Answers awaiting marking are excluded.</p>' +
    '<ol>' + rows + '</ol>' + link('Open mock corrections','#revision-corrections','text-link') + '</section>';
}

const flashcardReviewKey = 'flashcard-review';
const flashcardDay = 86400000;
const flashcardAgain = 600000;
const flashcardReviewLimit = 12;

function flashcardRating(previous, rating, now) {
  const last = previous?.interval ?? 0;
  const interval = rating === 'again' ? 0 : rating === 'hard'
    ? Math.min(90, Math.max(1, Math.ceil(last * 1.25))) : Math.min(90, Math.max(3, last * 2));
  return {interval, due:now + (interval ? interval * flashcardDay : flashcardAgain), reviewed:now};
}

function reviewEntries() {
  return revisionState(flashcardReviewKey, {});
}

function saveCardRating(deck, index, rating) {
  const entries = reviewEntries();
  const key = deck + '-' + index;
  const next = flashcardRating(entries[key], rating, Date.now());
  return saveRevisionState(flashcardReviewKey, {...entries, [key]:next}) ? next : null;
}

function scheduledFlashcards(entries, decks, now) {
  const due = [], unseen = [];
  for (const [deck, cards] of Object.entries(decks)) {
    cards.forEach((card, index) => {
      const schedule = entries[deck + '-' + index];
      const item = {deck,index,card,due:schedule?.due};
      if (!schedule) unseen.push(item);
      else if (schedule.due <= now) due.push(item);
    });
  }
  return {due:due.sort((a,b)=>a.due-b.due), unseen};
}

function flashcardSchedule() {
  return scheduledFlashcards(reviewEntries(), flashcardDecks, Date.now());
}

function flashcardRatings() {
  return '<div data-flashcard-ratings class="row fx-card-ratings" hidden aria-label="How well did you recall this answer?">' +
    '<button type="button" data-card-rating="again">Again</button><button type="button" data-card-rating="hard">Hard</button>' +
    '<button type="button" class="primary" data-card-rating="got-it">Got it</button></div>';
}

function flashcardRatingMessage(next) {
  if (!next) return 'This browser could not save your rating. Try again.';
  if (!next.interval) return 'Scheduled again in 10 minutes.';
  return 'Next review in ' + next.interval + (next.interval === 1 ? ' day.' : ' days.');
}

function flashcardReviewCallout() {
  const {due} = flashcardSchedule();
  const summary = due.length ? due.length + (due.length === 1 ? ' card is due.' : ' cards are due.') : 'Rate your recall to schedule the next review.';
  return '<section class="panel fx-daily-callout"><div><h2>Daily flashcard review</h2><p>' + summary + '</p></div>' +
    link('Start daily review','#flashcard-review','button primary') + '</section>';
}

function dailyFlashcards() {
  return '<section class="panel fx-daily-review" id="daily-flashcards"><h1 class="page-title">Daily flashcard review</h1>' +
    '<p>Review due cards first, then study new ones.</p>' +
    link('All flashcard decks','#flashcards','text-link') + '<p data-daily-progress role="status"></p>' +
    '<button type="button" class="flash" hidden></button>' + flashcardRatings() +
    '<p data-daily-status role="status"></p></section>';
}

function setupDailyFlashcards() {
  const root = document.querySelector('#daily-flashcards');
  const {due, unseen} = flashcardSchedule();
  const queue = [...due, ...unseen.slice(0, 4)].slice(0, flashcardReviewLimit);
  const card = root.querySelector('.flash'), ratings = root.querySelector('[data-flashcard-ratings]');
  const progress = root.querySelector('[data-daily-progress]'), status = root.querySelector('[data-daily-status]');
  let index = 0, revealed = false;
  function paint(focus = false) {
    const current = queue[index];
    card.hidden = !current;
    ratings.hidden = !current || !revealed;
    if (!current) {
      progress.textContent = queue.length ? 'Review complete. You rated ' + queue.length + ' cards.' : 'You’re caught up. Come back when more cards are due.';
      if (focus) root.querySelector('a').focus();
      return;
    }
    const lessonName = lessons.find(lesson => lesson.id === Number(current.deck))?.title ?? '';
    progress.textContent = 'Card ' + (index + 1) + ' of ' + queue.length + ' · ' + lessonName;
    const value = current.card[Number(revealed)];
    card.classList.toggle('reveal',revealed);
    card.innerHTML = '<small>' + (revealed ? 'Answer · click to see prompt' : 'Prompt · click to reveal') +
      '</small><span class="flash-text">' + escapeHtml(value) + '</span>';
    card.setAttribute('aria-label',(revealed ? 'Answer: ' : 'Question: ') + value + '. Activate to flip.');
    if (focus) card.focus();
  }
  card.onclick = () => { revealed = !revealed; paint(); };
  ratings.onclick = event => {
    const rating = event.target.closest('[data-card-rating]')?.dataset.cardRating;
    const current = queue[index];
    if (!rating || !current || !revealed) return;
    const result = saveCardRating(current.deck,current.index,rating);
    status.textContent = flashcardRatingMessage(result);
    if (!result) return;
    index++;
    revealed = false;
    paint(true);
  };
  paint();
}

/* Authored examples illustrate how different mark levels are reached. */
const markedAnswerExamples = [
  {marks:2, topic:'Opportunity cost', prompt:'Define opportunity cost.', answers:[
    ['1/2',[['It is the alternative forgone.','Identifies that an alternative is given up.']]],
    ['2/2',[['It is the next best alternative forgone when a choice is made.','“Next best” distinguishes the best rejected option from all other alternatives.']]]
  ]},
  {marks:2, topic:'Labour markets', prompt:'Identify two factors that can affect the choice of occupation.', answers:[
    ['1/2',[['The wage paid.','Identifies one valid factor.']]],
    ['2/2',[['The wage paid.','Identifies a financial factor.'],['The hours of work.','Identifies a distinct non-financial factor.']]]
  ]},
  {marks:4, topic:'Price elasticity of demand', prompt:'Explain two reasons why demand for a product may be price elastic.', answers:[
    ['2/4',[['The product has many close substitutes.','Identifies one determinant.'],['It takes up a large share of household spending.','Identifies a second determinant.']]],
    ['4/4',[['The product has many close substitutes, so when its price rises buyers can switch easily, causing a relatively large fall in quantity demanded.','Links substitutes to a large quantity response.'],['If it takes up a large share of income, a price rise makes a large difference to household budgets, so buyers are more likely to cut back sharply.','Explains the separate effect of the product’s budget share.']]]
  ]},
  {marks:4, topic:'Trade restrictions', prompt:'Explain two reasons why a government may impose tariffs on imports.', answers:[
    ['2/4',[['A tariff can protect infant industries.','Identifies protection of infant industries.'],['It can also raise government revenue.','Identifies a separate reason.']]],
    ['4/4',[['A tariff raises the price of competing imports, giving new domestic firms time to expand and lower their costs.','Explains how the tariff gives an infant industry temporary protection.'],['The government also collects tax on imports that are still bought, raising revenue it can use to fund public services.','Explains how the tariff generates revenue.']]]
  ]},
  {marks:6, topic:'Fiscal policy', prompt:'Analyse how an increase in government spending could affect unemployment and inflation.', answers:[
    ['3/6',[['Higher government spending increases total demand. Firms sell more, so they expand output and hire more workers.','Develops three links through demand, output and hiring.']]],
    ['6/6',[['Higher government purchases increase total demand. Firms sell more and expand output.','Links the policy to higher demand, sales and output.'],['Firms need more workers to produce this output, which can reduce cyclical unemployment.','Carries the chain through to employment.'],['If the economy is close to full capacity, output can only rise a little. The extra demand then pushes up the general price level, causing demand-pull inflation.','Explains the inflation effect and the capacity condition.']]]
  ]},
  {marks:6, topic:'Market failure', prompt:'Analyse why a market economy may underprovide public goods.', answers:[
    ['3/6',[['People cannot easily be excluded from using a public good. They can benefit without paying, so they have an incentive to free ride.','Develops non-excludability into the free-rider problem.']]],
    ['6/6',[['A public good is non-excludable, so people can benefit even if they do not pay. This gives them an incentive to free ride.','Explains why users may choose not to pay.'],['As fewer people pay voluntarily, a private supplier may receive too little revenue to cover its costs. Firms may therefore supply little or none of the good.','Links free riding to lost revenue, inadequate cost recovery and underprovision.']]]
  ]},
  {marks:8, topic:'Exchange rates', prompt:'Discuss whether depreciation of its currency is likely to benefit a country.', answers:[
    ['Middle band · 3–5',[['A depreciation can make exports cheaper for foreign buyers. They may buy more, so exporting firms may expand production and employ more workers.','Develops one side by linking relative price, demand, output and jobs.']]],
    ['Upper band · 6–8',[['A depreciation can make exports cheaper in foreign currency. If foreign demand responds strongly, export sales can increase. Firms may raise output and hire more workers, especially when they have spare capacity.','Develops a benefit and states when it is likely.'],['Imports become more expensive. Households lose purchasing power, and firms using imported fuel or raw materials face higher costs that may raise the general price level.','Develops a counterargument through households and firms.'],['The country is more likely to benefit if its export industries can expand and demand is responsive to price. Heavy reliance on essential imports makes the cost increase harder to avoid.','Weighs the competing effects with a clear condition.']]]
  ]},
  {marks:8, topic:'Living standards', prompt:'Discuss whether real GDP per head is a good measure for comparing living standards between countries.', answers:[
    ['Middle band · 3–5',[['Real GDP per head measures average output per person. A country with more output per person may have more goods available for people to consume.','Explains one way the measure captures material living standards.']]],
    ['Upper band · 6–8',[['Real GDP per head adjusts for population size and removes the effect of price changes over time. If purchasing power is also comparable, higher output per person can indicate greater access to goods and resources to fund services.','Develops the benefit for international comparisons.'],['An average can hide uneven income distribution. A country may have high output per head while many households have low incomes. The measure also misses outcomes such as health or education.','Develops limitations and explains why the average may mislead.'],['It is a useful starting point for comparing material living standards, especially with purchasing-power adjustment. I would combine it with measures of distribution, life expectancy and education to compare living standards more broadly.','Makes a supported judgement about when and how to use the measure.']]]
  ]}
];

function answerComparisonLink(marks) {
  return [2,4,6,8].includes(marks)
    ? link('Compare sample ' + marks + '-mark answers','#revision-examples/' + marks,'text-link') : '';
}

function answerComparisons(id) {
  const marks = Number(id);
  const examples = markedAnswerExamples.filter(example => ![2,4,6,8].includes(marks) || example.marks === marks);
  const filters = [0,2,4,6,8].map(value => {
    const href = '#revision-examples' + (value ? '/' + value : '');
    return '<a class="button" href="' + href + '"' + (location.hash === href ? ' aria-current="page"' : '') +
      '>' + (value ? value + ' marks' : 'All examples') + '</a>';
  }).join('');
  const examplesHtml = examples.map(example => '<article class="panel fx-answer-example"><p class="eyebrow">' + escapeHtml(example.topic) +
    ' · ' + example.marks + ' marks</p><h2>' + escapeHtml(example.prompt) + '</h2><div class="fx-answer-pair">' +
    example.answers.map(([score, rows]) => '<section><h3>' + escapeHtml(score) + '</h3>' + rows.map(([answer, note]) =>
      '<div class="fx-answer-line"><p>' + escapeHtml(answer) + '</p><p><strong>Marking note</strong> ' + escapeHtml(note) +
      '</p></div>').join('') + '</section>').join('') + '</div></article>').join('');
  return revisionHeading('Exam technique','Compare sample answers','See how an answer earns credit line by line. These worked examples show indicative marks.') +
    '<nav class="row fx-example-filters" aria-label="Filter sample answers">' + filters + '</nav>' + examplesHtml;
}

/* Deterministic checks for diagrams drawn in the editor. */
const diagramLetters = value => value.normalize('NFKC').toLowerCase().replace(/[^a-z0-9]/g,'');

function sketchDistance(point, points) {
  return Math.min(...points.slice(1).map(([x,y], index) => {
    const [a,b] = points[index];
    const dx = x - a, dy = y - b;
    const t = Math.max(0,Math.min(1,((point[0]-a)*dx+(point[1]-b)*dy)/(dx*dx+dy*dy || 1)));
    return Math.hypot(point[0]-a-t*dx,point[1]-b-t*dy);
  }));
}

function sketchCurve(diagram, name, direction) {
  const lines = diagram.shapes.filter(shape => {
    if (!['stroke','line'].includes(shape.kind) || shape.points.length < 2) return false;
    const first = shape.points[0], last = shape.points.at(-1);
    return Math.abs(last[0]-first[0]) >= 30 && Math.abs(last[1]-first[1]) >= 15 &&
      Math.sign((last[0]-first[0])*(last[1]-first[1])) === direction;
  });
  const otherLabels = name.endsWith('1') ? [name,name.slice(0,-1)] : [name];
  const valid = shape => otherLabels.includes(diagramLetters(shape.text ?? ''));
  const direct = lines.find(valid);
  if (direct) return direct;
  const label = diagram.shapes.find(shape=>shape.kind==='label' && valid(shape));
  if (!label) return null;
  const nearest = lines.filter(shape=>!shape.text).map(shape => [shape,sketchDistance(label.points[0],shape.points)]).sort((a,b)=>a[1]-b[1])[0];
  return nearest && nearest[1] <= 42 ? nearest[0] : null;
}

function sharedCurveOffsets(before, after, axis) {
  const values = (line, position) => line.points.slice(1).flatMap((point, i) => {
    const start=line.points[i], range=point[axis]-start[axis];
    if (!range) return [];
    const t=(position-start[axis])/range;
    return t>=0&&t<=1 ? [start[1-axis]+t*(point[1-axis]-start[1-axis])] : [];
  });
  const coordinates = [before,after].map(line=>line.points.map(point=>point[axis]));
  const min = Math.max(...coordinates.map(points=>Math.min(...points)));
  const max = Math.min(...coordinates.map(points=>Math.max(...points)));
  if (max-min<40) return [];
  return [.25,.5,.75].map(fraction => {
    const position=min+(max-min)*fraction;
    return values(after,position)[0]-values(before,position)[0];
  });
}

function curveIntersection(first, second) {
  for (const [i,[a,b]] of first.points.slice(0,-1).entries()) {
    const [x,y]=first.points[i+1], dx=x-a, dy=y-b;
    for (const [j,[c,d]] of second.points.slice(0,-1).entries()) {
      const [u,v]=second.points[j+1], ex=u-c, ey=v-d;
      const denominator=dx*ey-dy*ex;
      if (!denominator) continue;
      const t=((c-a)*ey-(d-b)*ex)/denominator;
      const s=((c-a)*dy-(d-b)*dx)/denominator;
      if(t>=0 && t<=1 && s>=0 && s<=1) return [a+t*dx,b+t*dy];
    }
  }
  return null;
}

function sketchEquilibrium(diagram, label, first, second) {
  const crossing = first && second && curveIntersection(first,second);
  if (!crossing) return false;
  const eligible = diagram.shapes.filter(shape => ['point','label'].includes(shape.kind));
  const target = eligible.find(shape=>diagramLetters(shape.text ?? '')===label);
  return Boolean(target && Math.hypot(target.points[0][0]-crossing[0],target.points[0][1]-crossing[1])<=25);
}

function diagramDrawingChecks(diagram, spec) {
  const ppc = spec.kind==='ppc';
  const labor = spec.labor;
  const horizontal = ppc ? /^(consumergoods|consumptiongoods|outputofconsumergoods)$/ :
    labor ? /^(quantityoflabou?r|labou?r|employment|numberofworkers|quantity|q)$/ : /^(quantity|quantityof.+|output|q)$/;
  const vertical = ppc ? /^(capitalgoods|outputofcapitalgoods|investmentgoods)$/ :
    labor ? /^(wage|wagerate|wages|priceoflabou?r|w)$/ : /^(price|priceof.+|marketprice|p)$/;
  const axisX = ppc ? 'consumer goods' : labor ? 'quantity of labour' : 'quantity';
  const axisY = ppc ? 'capital goods' : labor ? 'wage rate' : 'price';
  const checks = [
    ['Horizontal axis',horizontal.test(diagramLetters(diagram.x)), 'Label the horizontal axis ' + axisX + '.'],
    ['Vertical axis',vertical.test(diagramLetters(diagram.y)), 'Label the vertical axis ' + axisY + '.']
  ];
  const moving = ppc ? 'ppc' : spec.changing==='demand' ? 'd' : 's';
  const initial = sketchCurve(diagram,moving+'1',moving==='s'?-1:1);
  const newCurve = sketchCurve(diagram,moving+'2',moving==='s'?-1:1);
  const other = ppc ? null : sketchCurve(diagram,moving==='d'?'s1':'d1',moving==='d'?-1:1);
  const curveName = ppc ? 'PPC' : moving==='d' ? 'demand' : 'supply';
  const valid = Boolean(initial && newCurve && initial!==newCurve);
  checks.push(['Curves and labels',valid && (ppc || Boolean(other)),ppc ?
    'Draw two downward-sloping frontiers. Label them PPC₁ and PPC₂.' :
    'Draw and label downward demand and upward supply. Label the shifted ' + curveName + ' curve ' + moving.toUpperCase() + '₂.']);
  const offsets = valid ? sharedCurveOffsets(initial,newCurve,ppc?0:1) : [];
  const direction = ppc ? (spec.shift==='in' ? 1 : -1) : spec.increase ? 1 : -1;
  checks.push(['Shift direction',offsets.filter(value=>value*direction>10).length>=2,ppc ?
    'Place PPC₂ ' + (spec.shift==='in' ? 'inside' : 'outside') + ' PPC₁.' :
    'At the same ' + axisY + ', the new ' + curveName + ' curve should be to the ' + (spec.increase ? 'right' : 'left') + ' of the original.']);
  if (!ppc) {
    const before = sketchEquilibrium(diagram,'e1',initial,other);
    const after = sketchEquilibrium(diagram,'e2',newCurve,other);
    checks.push(['Original equilibrium',before,'Mark E₁ where the two original curves cross.']);
    checks.push(['New equilibrium',after,'Mark E₂ where the new curve crosses the unchanged curve.']);
  }
  return checks;
}

function drawingFeedback(diagram, spec) {
  if (!diagram?.shapes.length) return '';
  const checks = diagramDrawingChecks(diagram,spec);
  return '<section class="fx-drawing-feedback"><h3>Drawing checks</h3><p>Automated checks on your drawn lines and labels.</p><ul>' +
    checks.map(([label,correct,hint])=>'<li>' + outcomeBadge(correct?'correct':'incorrect',correct?'Met':'Revise') +
      '<div><strong>' + label + '</strong>' + (correct?'':'<p>' + hint + '</p>') + '</div></li>').join('') +
    '</ul></section>';
}

function markReviewReason(result, answer) {
  if (result.reviewNote) return result.reviewNote;
  if (result.reviewUnavailable || result.modelPlan) return 'See the mark scheme for the points to include.';
  if (result.diagram && result.provisional) return 'Check the visual assessment against the model diagram and mark scheme.';
  if (result.provisional && result.score>0 && !creditedEvidence(answer,result).length) {
    return 'The marker awarded credit without a verifiable quotation from your answer.';
  }
  return '';
}


import { core, depths, prescribed } from './history-content.js';
import { modelAnswers, questions } from './history-practice.js';
import { markHistory } from './history-marker.js';
import { recallQuestions, studyTopics } from './history-study.js?v=2027';
import { paperOneMocks, paperTwoMocks, paperFourMocks } from './history-mocks.js?v=2027';
import { renderMockExams } from './history-mock-view.js?v=2027';

const byId = (id) => document.getElementById(id);
const storageKey = 'fresh.history.0470.v1';
let stored = {};
try {
  stored = JSON.parse(localStorage.getItem(storageKey)) || {};
} catch {
  // Study tools remain usable when browser storage is unavailable.
}
const state = { course: {}, completed: {}, review: {}, drafts: {}, mockRuns: {}, last: '', ...stored };
const settings = byId('history-settings');
const form = byId('history-form');
const search = byId('history-search');
const practiceLinks = [...document.querySelectorAll('.history-practice-nav a')];
const allTopics = [...core.A, ...core.B, ...Object.values(depths)];
const topicTitles = Object.fromEntries(allTopics.map(([id, title]) => [id, title]));
const allQuestions = [...recallQuestions, ...questions];

function courseTopics() {
  const { core: option, depth } = state.course;
  return [...(core[option] || [...core.A, ...core.B]), ...(depths[depth] ? [depths[depth]] : Object.values(depths))];
}

function link(text, href, className) {
  const anchor = element('a', text, className);
  anchor.href = href;
  return anchor;
}

function topicSelector(topics, label, selected) {
  const field = element('label', label, 'history-writing');
  const select = element('select');
  for (const [id, name] of topics) {
    const option = element('option', name);
    option.value = id;
    select.append(option);
  }
  if (topics.some(([id]) => id === selected)) select.value = selected;
  field.append(select);
  return { field, select };
}

const topicPreviews = {
  revolutions: ['movement', 'Reform, rebellion and the conservative response'],
  italy: ['territory', 'Piedmont, Garibaldi and the unification of Italy'],
  'german-unification': ['territory', 'Prussia and the creation of the German Empire'],
  'civil-war': ['rivalry', 'Slavery, secession and the fight to preserve the Union'],
  empires: ['globe', 'Imperial rivalry, expansion and resistance'],
  'ww1-origins': ['rivalry', 'Alliances, Balkan tensions and the July Crisis'],
  versailles: ['settlement', 'The peacemakers’ aims and the terms imposed on Germany'],
  league: ['globe', 'Collective security, diplomacy and the limits of sanctions'],
  'outbreak-1939': ['rivalry', 'Appeasement, German expansion and the invasion of Poland'],
  'cold-war': ['rivalry', 'The wartime alliance breaks down over Europe'],
  containment: ['globe', 'US policy in Korea, Cuba and Vietnam'],
  'eastern-europe': ['movement', 'Soviet control, resistance and reform'],
  ww1: ['territory', 'Trench warfare, global fronts and the armistice'],
  germany: ['movement', 'From the Weimar Republic to dictatorship and war'],
  russia: ['movement', 'Revolution, civil war and Stalin’s rule'],
  usa: ['economy', 'The boom, the Great Depression and the New Deal'],
  ww2: ['territory', 'Turning points, occupation and Allied victory'],
};


function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    byId('history-status').textContent = 'Browser storage is unavailable. Changes may be lost when you leave.';
  }
}

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function action(text, handler) {
  const button = element('button', text, 'history-action');
  button.type = 'button';
  button.addEventListener('click', handler);
  return button;
}

function reveal(label, text) {
  const details = element('details');
  details.append(element('summary', label), element('p', text));
  return details;
}

function openTopic(id) {
  if (location.hash !== '#history-topic-' + id) {
    location.hash = 'history-topic-' + id;
    return;
  }
  const [, title, overview, question, advice] = allTopics.find(([topic]) => id === topic);
  const heading = byId('history-notes-title');
  const notes = byId('history-notes-content');
  heading.textContent = title;
  notes.replaceChildren(element('p', overview));
  const cards = link('Study flashcards', '#history-flashcards', 'gallery-button');
  cards.addEventListener('click', () => renderFlashcards(id));
  const exam = link('Practise this topic', '#history-paper-1', 'gallery-button');
  exam.addEventListener('click', () => {
    const topicSelect = byId('history-practice-topic');
    if (!topicSelect.querySelector('option[value="' + id + '"]')) {
      const option = element('option', title);
      option.value = id;
      topicSelect.append(option);
    }
    topicSelect.value = id;
    topicSelect.dispatchEvent(new Event('change'));
  });
  const tools = element('div', '', 'history-section-links');
  tools.append(cards, exam);
  notes.append(tools);
  for (const { title: sectionTitle, facts } of studyTopics[id]) {
    const section = element('section', '', 'history-note-section');
    section.append(element('h3', sectionTitle));
    const evidence = element('dl');
    for (const { answer, explanation } of facts) {
      evidence.append(element('dt', answer), element('dd', explanation));
    }
    section.append(evidence);
    notes.append(section);
  }
  if (id === 'versailles') versaillesLesson(notes);
  notes.append(element('h3', 'Build an argument'), element('p', question),
    reveal('Show planning guidance', advice), reveal('Show model answer', modelAnswers[id]));
  const actions = element('div', '', 'history-notes-actions');
  actions.append(studiedButton(id));
  if (id !== 'versailles') actions.append(flagButton('topic-' + id, title));
  notes.append(actions);
  if (state.last !== id) {
    state.last = id;
    renderResume();
    save();
  }
  showView('history-notes');
  window.scrollTo(0, 0);
  heading.focus({ preventScroll: true });
}

function renderReview() {
  const count = Object.keys(state.completed).length;
  byId('history-progress').textContent = count === 1 ? '1 topic marked studied.' : count + ' topics marked studied.';
  const list = byId('history-review-list');
  list.replaceChildren();
  const items = Object.entries(state.review).filter(([id]) => id.startsWith('topic-') || byId('history-' + id));
  if (!items.length) list.append(element('li', 'Items you flag for review will appear here.'));
  for (const [id, label] of items) {
    const item = element('li');
    const link = element('a', label);
    link.href = '#history-' + id;
    if (id.startsWith('topic-')) {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        openTopic(id.slice(6));
      });
    }
    item.append(link);
    list.append(item);
  }
}

function flagButton(id, title) {
  const button = action('', () => {
    if (state.review[id]) delete state.review[id];
    else state.review[id] = title;
    update();
    renderReview();
    save();
  });
  function update() {
    button.textContent = state.review[id] ? 'Remove review flag' : 'Flag for review';
    button.setAttribute('aria-pressed', String(Boolean(state.review[id])));
  }
  update();
  return button;
}

function writing(id, labelText) {
  const label = element('label', labelText, 'history-writing');
  const input = element('textarea');
  input.value = state.drafts[id] || '';
  input.addEventListener('input', () => {
    state.drafts[id] = input.value;
    save();
  });
  label.append(input);
  return label;
}

function versaillesLesson(card) {
  card.append(element('h3', 'From armistice to treaty'));
  const timeline = element('ol');
  for (const event of [
    'November 1918 · The Armistice ended fighting on the Western Front.',
    'January 1919 · The Paris Peace Conference opened.',
    'June 1919 · Germany signed the Treaty of Versailles.'
  ]) timeline.append(element('li', event));
  card.append(timeline, element('h3', 'Evidence to use'));
  const evidence = element('ul');
  for (const fact of [
    'Germany’s army was limited to 100,000 men. France could point to this limit as protection against a renewed attack.',
    'Alsace-Lorraine returned to France, reversing the territorial loss of 1871.',
    'Article 231 established responsibility for losses and damage as the basis for reparations. The reparations total was settled separately in 1921.'
  ]) evidence.append(element('li', fact));
  card.append(evidence);
  const quiz = element('fieldset');
  quiz.append(element('legend', 'When was the treaty signed?'));
  const feedback = element('p');
  feedback.setAttribute('role', 'status');
  for (const year of ['1918', '1919', '1921']) {
    const label = element('label');
    const answer = element('input');
    answer.type = 'radio';
    answer.name = 'history-versailles-year';
    answer.addEventListener('change', () => {
      feedback.textContent = year === '1919' ? 'Correct. The treaty was signed in June 1919.' : 'Try again. The treaty came after the Armistice and before the final reparations figure.';
      if (year !== '1919' && !state.review['topic-versailles']) {
        review.click();
      }
    });
    label.append(answer, ' ' + year);
    quiz.append(label);
  }
  const review = flagButton('topic-versailles', 'The Treaty of Versailles');
  quiz.append(feedback);
  card.append(quiz, review);
}

function renderResume() {
  const last = allTopics.find(([id]) => id === state.last);
  const link = byId('history-resume');
  byId('history-resume-label').textContent = last ? 'Resume ' + last[1] : 'Browse topics';
  link.href = last ? '#history-topic-' + last[0] : '#history-topics';
  link.onclick = last ? (event) => {
    event.preventDefault();
    openTopic(last[0]);
  } : null;
}

function topicCard(id, title) {
  const [icon, preview] = topicPreviews[id] || ['topics', ''];
  const item = element('li');
  const link = element('a', '', 'history-topic-button');
  link.href = '#history-topic-' + id;
  const artwork = element('span', '', 'history-topic-art');
  artwork.setAttribute('aria-hidden', 'true');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  svg.setAttribute('class', 'gallery-icon');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('focusable', 'false');
  use.setAttribute('href', '#gallery-icon-' + icon);
  svg.append(use);
  artwork.append(svg);

  const label = element('span', title, 'history-topic-title');
  label.id = 'history-topic-label-' + id;
  link.setAttribute('aria-labelledby', label.id);
  const description = element('span', preview, 'history-topic-preview');
  description.id = 'history-topic-preview-' + id;
  if (preview) link.setAttribute('aria-describedby', description.id);
  const caption = element('span', '', 'history-topic-caption');
  const cue = element('span', 'Read notes', 'history-topic-cue');
  cue.setAttribute('aria-hidden', 'true');
  caption.append(label);
  if (preview) caption.append(description);
  caption.append(cue);
  link.append(artwork, caption);
  item.append(link);
  return item;
}

function renderTopics() {
  const output = byId('history-topic-list');
  const query = search.value.trim().toLowerCase();
  output.replaceChildren();
  const groups = query ? [['search', 'Search results', allTopics]] : [
    ...Object.entries(core).filter(([option]) => !state.course.core || option === state.course.core)
      .map(([option, topics]) => [option.toLowerCase(), 'Core option ' + option, topics]),
    ['depth', 'Depth studies', depths[state.course.depth] ? [depths[state.course.depth]] : Object.values(depths)]
  ];
  for (const [key, name, topics] of groups) {
    const section = element('section', '', 'history-topic-group');
    section.dataset.group = key;
    const heading = element('h3', name);
    heading.id = 'history-topic-group-' + key;
    section.setAttribute('aria-labelledby', heading.id);
    section.append(heading);
    const grid = element('ul', '', 'history-topic-grid');
    for (const [id, title, overview, question, advice] of topics) {
      const preview = topicPreviews[id]?.[1];
      const notes = query ? studyTopics[id].flatMap(({ title, facts }) =>
        [title, ...facts.flatMap(({ answer, explanation }) => [answer, explanation])]) : [];
      if (![title, preview, overview, question, advice, ...notes].join(' ').toLowerCase().includes(query)) continue;
      grid.append(topicCard(id, title));
    }
    section.append(grid.childElementCount ? grid : element('p', 'No matching topics. Try a different search.'));
    output.append(section);
  }
}

function studiedButton(id) {
  const button = action('', () => {
    if (state.completed[id]) delete state.completed[id];
    else state.completed[id] = true;
    update();
    renderReview();
    save();
  });
  function update() {
    button.textContent = state.completed[id] ? 'Studied · undo' : 'Mark as studied';
    button.setAttribute('aria-pressed', String(Boolean(state.completed[id])));
  }
  update();
  return button;
}

function markedWriting(id, label, question, guidance, example, source) {
  const draft = writing(id, label);
  const input = draft.querySelector('textarea');
  const feedback = element('div', '', 'history-marking');
  const status = element('p');
  status.setAttribute('role', 'status');
  const results = element('div');
  const criteria = source
    ? [['Use of source evidence', 4], ['Evaluation of usefulness and context', 6]]
    : [['Accurate and relevant historical evidence', 4], ['Explanation and direct response to the question', 6]];
  const mark = action('AI mark my answer', async () => {
    const answer = input.value.trim();
    results.replaceChildren();
    if (!answer || answer.length > 10000) {
      status.textContent = answer ? 'Keep your answer under 10,000 characters for AI marking.' : 'Write an answer first.';
      return;
    }
    mark.disabled = true;
    status.textContent = 'Starting the on-device marker…';
    try {
      const result = await markHistory({
        subject: 'history', prompt: question, source, criteria, target: guidance, example
      }, answer, (message) => { status.textContent = message; });
      if (input.value.trim() !== answer) {
        status.textContent = 'Your draft changed during marking. Submit the revised draft for feedback.';
        return;
      }
      status.textContent = 'AI practice estimate · ' + result.total + '/10';
      for (const item of result.criteria) {
        results.append(element('p', item.name + ' · ' + item.mark + '/' + item.max + '. ' + item.comment));
        if (item.evidence) results.append(element('blockquote', item.evidence));
      }
      results.append(element('p', 'Next step: ' + result.nextStep));
    } catch (error) {
      status.textContent = error.message;
    } finally {
      mark.disabled = false;
    }
  });
  input.addEventListener('input', () => {
    results.replaceChildren();
    if (!mark.disabled) status.textContent = '';
  });
  feedback.append(mark, element('p', 'Uses a model on your device. The first use downloads the model and requires WebGPU. Scores use a 10-point practice rubric.'), status, results);
  return [draft, feedback, reveal('Show planning guidance', guidance), reveal('Show model answer', example)];
}

function renderFlashcards(selected = state.flashcardTopic) {
  const topics = courseTopics();
  if (selected && studyTopics[selected] && !topics.some(([id]) => id === selected)) {
    topics.push(allTopics.find(([id]) => id === selected));
  }
  const { field, select } = topicSelector(topics, 'Flashcard topic', selected);
  const panel = element('section', '', 'history-card history-study-panel');
  const position = element('p');
  position.setAttribute('role', 'status');
  const sectionTitle = element('p', '', 'history-study-label');
  const prompt = element('h3');
  const answer = element('div');
  answer.id = 'history-flashcard-answer';
  const controls = element('div', '', 'history-section-links');
  let facts = [];
  let index = 0;
  const previous = action('Previous', () => move(-1));
  const next = action('Next', () => move(1));
  const flip = action('Show answer', () => {
    answer.hidden = !answer.hidden;
    flip.textContent = answer.hidden ? 'Show answer' : 'Hide answer';
    flip.setAttribute('aria-expanded', String(!answer.hidden));
  });
  flip.setAttribute('aria-controls', answer.id);
  controls.append(previous, flip, next);
  panel.append(position, sectionTitle, prompt, answer, controls);

  function renderCard() {
    const fact = facts[index];
    position.textContent = 'Card ' + (index + 1) + ' of ' + facts.length;
    sectionTitle.textContent = fact.title;
    prompt.textContent = fact.prompt;
    answer.replaceChildren(element('strong', fact.answer), element('p', fact.explanation));
    answer.hidden = true;
    flip.textContent = 'Show answer';
    flip.setAttribute('aria-expanded', 'false');
    previous.disabled = index === 0;
    next.disabled = index === facts.length - 1;
  }

  function move(offset) {
    index += offset;
    renderCard();
    if (next.disabled && offset > 0 || previous.disabled && offset < 0) flip.focus();
  }

  function loadDeck() {
    state.flashcardTopic = select.value;
    facts = studyTopics[select.value].flatMap(({ title, facts }) => facts.map((fact) => ({ ...fact, title })));
    index = 0;
    renderCard();
  }

  select.addEventListener('change', () => {
    loadDeck();
    save();
  });
  const notes = link('Read topic notes', '#history-topic-' + select.value, 'gallery-button');
  select.addEventListener('change', () => { notes.href = '#history-topic-' + select.value; });
  loadDeck();
  byId('history-flashcards-list').replaceChildren(field, panel, notes);
}

function renderQuiz() {
  const output = byId('history-quiz-list');
  const topics = courseTopics();
  const { field, select } = topicSelector([['all', 'All course topics'], ...topics], 'Quiz topic', state.quizTopic);
  const { field: setField, select: setSelect } = topicSelector([], 'Question set');
  const controls = element('div', '', 'history-study-filters');
  controls.append(field, setField);
  const body = element('div');
  output.replaceChildren(controls, body);
  const setSize = 10;
  let bank = [];

  function renderSet() {
    const start = Number(setSelect.value) * setSize;
    const quiz = element('form', '', 'history-quiz-form');
    const score = element('p');
    score.setAttribute('role', 'status');
    const cards = bank.slice(start, start + setSize).map(([id, question, choices, correct, explanation], index) => {
      const fieldset = element('fieldset', '', 'history-card');
      const name = 'quiz-question-' + (start + index + 1);
      fieldset.append(element('legend', question));
      for (const [choiceIndex, choice] of choices.entries()) {
        const label = element('label');
        const radio = element('input');
        radio.type = 'radio';
        radio.name = name;
        radio.value = String(choiceIndex);
        radio.required = true;
        label.append(radio, ' ' + choice);
        fieldset.append(label);
      }
      const feedback = element('p');
      feedback.hidden = true;
      fieldset.append(feedback);
      quiz.append(fieldset);
      return { id, name, choices, correct, explanation, fieldset, feedback };
    });
    const submit = element('button', 'Check answers', 'history-action');
    const reset = action('Try again', () => {
      quiz.reset();
      score.textContent = '';
      for (const { fieldset, feedback } of cards) {
        fieldset.disabled = false;
        fieldset.classList.remove('history-correct', 'history-missed');
        feedback.hidden = true;
      }
      submit.hidden = false;
      reset.hidden = true;
      quiz.querySelector('input').focus();
    });
    reset.hidden = true;
    const next = action('Next set', () => {
      setSelect.selectedIndex++;
      renderSet();
      setSelect.focus();
    });
    next.hidden = true;
    const actions = element('div', '', 'history-section-links');
    actions.append(submit, reset, next);
    quiz.append(actions, score);
    quiz.addEventListener('submit', (event) => {
      event.preventDefault();
      const answers = new FormData(quiz);
      let correctCount = 0;
      for (const { id, name, choices, correct, explanation, fieldset, feedback } of cards) {
        const isCorrect = answers.get(name) === String(correct);
        if (isCorrect) correctCount++;
        else state.review['topic-' + id] = topicTitles[id];
        fieldset.disabled = true;
        fieldset.classList.add(isCorrect ? 'history-correct' : 'history-missed');
        feedback.textContent = (isCorrect ? 'Correct. ' : 'Correct answer: ' + choices[correct] + '. ') + explanation;
        feedback.hidden = false;
      }
      score.textContent = correctCount + '/' + cards.length + ' correct';
      submit.hidden = true;
      reset.hidden = false;
      next.hidden = setSelect.selectedIndex === setSelect.options.length - 1;
      reset.focus();
      renderReview();
      save();
    });
    body.replaceChildren(quiz);
  }

  function updateTopic() {
    state.quizTopic = select.value;
    const included = new Set(select.value === 'all' ? topics.map(([id]) => id) : [select.value]);
    bank = allQuestions.filter(([id]) => included.has(id));
    setSelect.replaceChildren();
    for (let start = 0; start < bank.length; start += setSize) {
      const option = element('option', 'Questions ' + (start + 1) + '–' + Math.min(start + setSize, bank.length) + ' of ' + bank.length);
      option.value = String(start / setSize);
      setSelect.append(option);
    }
    renderSet();
  }

  select.addEventListener('change', () => {
    updateTopic();
    save();
  });
  setSelect.addEventListener('change', renderSet);
  updateTopic();
}

function practiceCard(id, title, description) {
  const card = element('article', '', 'history-card');
  card.id = 'history-' + id;
  card.append(element('h3', title), element('p', description));
  return card;
}

function renderPractice(focus) {
  const output = byId('history-practice-list');
  output.replaceChildren();
  const depth = depths[state.course.depth];
  const practiceTopics = courseTopics();
  if (state.practiceTopic && studyTopics[state.practiceTopic] && !practiceTopics.some(([id]) => id === state.practiceTopic)) {
    practiceTopics.push(allTopics.find(([id]) => id === state.practiceTopic));
  }
  const grid = element('div', '', 'history-grid');

  const paper1 = practiceCard('paper-1', 'Paper 1 · Structured questions', '2 hours · 60 marks. Practise describing, explaining and evaluating.');
  const { field: topicLabel, select: topicSelect } = topicSelector(practiceTopics, 'Practice topic', state.practiceTopic);
  topicSelect.id = 'history-practice-topic';
  const { field: taskLabel, select: taskSelect } = topicSelector([], 'Question');
  const prompt = element('div');
  const markAdvice = {
    4: 'Describe the requested features using distinct, relevant historical details.',
    6: 'Explain how or why the factors mattered. Develop each link with specific evidence.',
    10: 'Explain different sides with evidence, then justify your overall judgement.'
  };
  let parts = [];

  function updatePrompt() {
    const id = topicSelect.value;
    if (taskSelect.value === 'ai') {
      const [, , , question, guidance] = allTopics.find(([key]) => key === id);
      prompt.replaceChildren(element('p', question),
        ...markedWriting('paper-1-' + id, 'Your answer', question, guidance, modelAnswers[id]));
      return;
    }
    const { marks, prompt: question, guidance } = parts[Number(taskSelect.value)];
    prompt.replaceChildren(element('p', question + ' [' + marks + ']'),
      writing('structured-' + id + '-' + taskSelect.value, 'Your answer'),
      reveal('Show marking guidance', markAdvice[marks] + ' ' + guidance));
  }

  function updateQuestions() {
    parts = [];
    taskSelect.replaceChildren();
    for (const { title, parts: topicParts } of studyTopics[topicSelect.value]) {
      const group = element('optgroup');
      group.label = title;
      for (const part of topicParts) {
        const option = element('option', (parts.length + 1) + '. ' + part.prompt + ' [' + part.marks + ']');
        option.value = String(parts.length);
        parts.push(part);
        group.append(option);
      }
      taskSelect.append(group);
    }
    const original = element('option', 'Writing drill with AI feedback');
    original.value = 'ai';
    taskSelect.append(original);
    updatePrompt();
  }

  topicSelect.addEventListener('change', () => {
    state.practiceTopic = topicSelect.value;
    updateQuestions();
    save();
  });
  taskSelect.addEventListener('change', updatePrompt);
  updateQuestions();
  paper1.append(topicLabel, taskLabel, prompt, flagButton('paper-1', 'Paper 1 writing practice'));
  grid.append(paper1);

  const paper2 = practiceCard('paper-2', 'Paper 2 · Document questions', '1 hour 45 minutes · 40 marks. Try this standalone Versailles source drill.');
  if (focus) paper2.append(element('p', 'Your prescribed topic: ' + focus[1] + '.'));
  const source = element('blockquote', 'The world must be made safe for democracy. Its peace must be planted upon the tested foundations of political liberty.');
  const provenance = 'Woodrow Wilson, address to the US Congress asking for a declaration of war, 2 April 1917.';
  const sourceQuestion = 'How useful is this speech for understanding US aims before the Paris Peace Conference? Use the wording and the occasion.';
  const sourceGuidance = 'Explain what the wording reveals, why Wilson made the speech in 1917, and what it can tell us about his later negotiating aims.';
  paper2.append(source, element('p', provenance), element('p', sourceQuestion),
    ...markedWriting('paper-2-versailles', 'Your answer', sourceQuestion, sourceGuidance, modelAnswers.source, provenance + '\n' + source.textContent),
    flagButton('paper-2', 'Paper 2 source practice'));
  grid.append(paper2);

  if (state.course.route !== '3') {
    const paper4 = practiceCard('paper-4', 'Paper 4 · Alternative to Coursework', '1 hour · 40 marks. Practise a structured account followed by an assessment of significance.');
    if (depth) {
      paper4.append(element('h4', depth[1]), element('p', depth[3]),
        ...markedWriting('paper-4-' + depth[0], 'Your plan or answer', depth[3], depth[4], modelAnswers[depth[0]]),
        flagButton('paper-4', 'Paper 4 depth-study practice'));
    } else paper4.append(element('p', 'Choose a depth study in Course settings to see the writing prompt.'));
    grid.append(paper4);
  }

  if (state.course.route !== '4') {
    const coursework = practiceCard('coursework', 'Component 3 · Coursework', 'Use your school’s assignment question to organise your own research.');
    coursework.append(writing('coursework-log', 'Research log · Record the source, page number, and how the evidence relates to your argument'),
      reveal('Show revision checklist', 'Check your argument answers the exact question, supports each judgement with evidence, and gives complete references.'),
      flagButton('coursework', 'Coursework research log'));
    grid.append(coursework);
  }
  const mocks = practiceCard('mocks', 'Mock exams', 'Original Cambridge-style papers with a timer and marking guidance.');
  const exams = [...paperOneMocks, ...paperTwoMocks, ...(state.course.route === '3' ? [] : paperFourMocks)];
  mocks.append(renderMockExams(exams, state, { element, action, link, reveal, save, topicSelector, writing }));
  const resources = element('nav', '', 'history-section-links');
  resources.setAttribute('aria-label', 'History teaching and exam references');
  resources.append(
    link('Cambridge 2027–2028 syllabus', 'https://www.cambridgeinternational.org/Images/721327-2027-2028-syllabus.pdf'),
    link('Cambridge past papers', 'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-history-0470/past-papers/'),
    link('Save My Exams revision notes', 'https://www.savemyexams.com/igcse/history/cie/18/revision-notes/')
  );
  mocks.append(resources);
  grid.append(mocks);
  output.append(grid);
}

function renderCourse() {
  const { year, series, core: option, depth, route } = state.course;
  const description = [year === 'other' ? 'Other exam year' : year, series, option && 'Option ' + option,
    depths[depth]?.[1], route === '3' ? 'Coursework' : route === '4' ? 'Paper 4' : ''].filter(Boolean);
  byId('history-course').textContent = description.join(' · ') || 'Choose the course your school teaches.';
  const focusId = prescribed[year]?.[series]?.[option];
  const focus = allTopics.find(([id]) => id === focusId);
  byId('history-focus').textContent = focus ? focus[1] : year === 'other'
    ? 'Use Cambridge’s syllabus for your exam year to check the prescribed topic.'
    : 'Select your exam year, series, and Core option.';
  renderTopics();
  renderPractice(focus);
  const coursework = route === '3';
  byId('gallery-route').href = coursework ? '#history-coursework' : '#history-paper-4';
  byId('gallery-route-title').textContent = coursework ? 'Coursework' : 'Paper 4';
  byId('gallery-route-description').textContent = coursework ? 'Research log and checklist' : 'Depth-study practice';
  byId('gallery-route-time').hidden = coursework;
  selectPracticePaper(location.hash.slice(1));
  renderQuiz();
  renderFlashcards();
  renderResume();
  renderReview();
}

for (const control of form.querySelectorAll('select')) control.value = state.course[control.name] || '';
form.addEventListener('submit', (event) => {
  event.preventDefault();
  state.course = Object.fromEntries(new FormData(form));
  save();
  renderCourse();
  settings.open = false;
  settings.querySelector('summary').focus();
});
search.addEventListener('input', renderTopics);
renderCourse();
const views = [...document.querySelectorAll('.history-view')];
const tabs = [...document.querySelectorAll('.history-nav a')];

function showView(id) {
  for (const view of views) view.hidden = view.id !== id;
  const tabId = id === 'history-notes' ? 'history-topics' : id === 'history-flashcards' ? 'history-review' : id;
  for (const tab of tabs) {
    if (tab.hash === '#' + tabId) tab.setAttribute('aria-current', 'page');
    else tab.removeAttribute('aria-current');
  }
}

function selectPracticePaper(id) {
  const papers = [...byId('history-practice-list').querySelectorAll('.history-grid > article')];
  const selected = papers.find((paper) => paper.id === id);
  const currentHash = selected ? '#' + selected.id : '#history-practice';
  for (const paper of papers) paper.hidden = Boolean(selected && paper !== selected);
  for (const link of practiceLinks) {
    link.hidden = link.hash !== '#history-practice' && !papers.some((paper) => '#' + paper.id === link.hash);
    if (link.hash === currentHash) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  return selected;
}

function navigate() {
  const id = location.hash.slice(1);
  if (id.startsWith('history-topic-') && allTopics.some(([topic]) => id === 'history-topic-' + topic)) {
    openTopic(id.slice(14));
    return;
  }
  const leavingNotes = !byId('history-notes').hidden;
  const paper = selectPracticePaper(id);
  const unavailablePaper = !paper && practiceLinks.some((link) => link.hash === '#' + id);
  const targetId = id === 'history-notes' ? 'history-topics' : id;
  const target = byId(unavailablePaper ? 'history-practice' : targetId);
  const view = target?.closest('.history-view');
  showView(view?.id || 'history-home');
  if (target === settings) {
    settings.open = true;
    settings.querySelector('summary').focus({ preventScroll: true });
  }
  if (leavingNotes && target?.id === 'history-topics') byId('history-topics-title').focus({ preventScroll: true });
  if (target === view && view) window.scrollTo(0, 0);
  else if (view) target.scrollIntoView();
}

const exhibitDialog = byId('history-exhibit-dialog');
for (const exhibit of document.querySelectorAll('[data-exhibit]')) {
  exhibit.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || typeof exhibitDialog.showModal !== 'function') return;
    const topic = allTopics.find(([id]) => exhibit.hash === '#history-topic-' + id);
    if (!topic) return;
    event.preventDefault();
    const [id, title, overview, question] = topic;
    const content = byId('history-exhibit-content');
    const heading = element('h2', exhibit.querySelector('h3')?.textContent || title);
    heading.id = 'history-exhibit-title';
    const illustration = (exhibit.querySelector('svg') || document.querySelector('.gallery-pedestal svg')).cloneNode(true);
    const art = element('div', '', 'gallery-dialog-art');
    art.append(illustration);
    const lesson = element('a', 'Open full lesson', 'history-action');
    lesson.href = exhibit.hash;
    lesson.addEventListener('click', (lessonEvent) => {
      if (lessonEvent.metaKey || lessonEvent.ctrlKey || lessonEvent.shiftKey || lessonEvent.altKey) return;
      lessonEvent.preventDefault();
      exhibitDialog.close();
      openTopic(id);
    });
    const label = element('span', exhibit.querySelector('small')?.textContent || '1919 / Peace settlements', 'gallery-eyebrow');
    content.replaceChildren(label, heading, art, element('p', overview),
      element('p', question), studiedButton(id), lesson);
    exhibitDialog.showModal();
  });
}

document.querySelector('.skip').addEventListener('click', (event) => {
  event.preventDefault();
  const main = byId('main');
  main.focus({ preventScroll: true });
  main.scrollIntoView();
});
document.querySelector('.gallery-nav-settings').addEventListener('click', (event) => {
  if (location.hash === '#history-settings' && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
    event.preventDefault();
    navigate();
  }
});
window.addEventListener('hashchange', navigate);
navigate();

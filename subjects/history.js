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
const state = { course: {}, completed: {}, review: {}, drafts: {}, mockRuns: {}, flashcardProgress: {}, practiceSelections: {}, last: '', ...stored };
const settings = byId('history-settings');
const form = byId('history-form');
const search = byId('history-search');
const topicScope = byId('history-topic-scope');
const practiceLinks = [...document.querySelectorAll('.history-practice-nav a')];
const topicGroups = [
  ['a', 'Core option A', core.A],
  ['b', 'Core option B', core.B],
  ['depth', 'Depth studies', Object.values(depths)]
];
const allTopics = topicGroups.flatMap(([, , topics]) => topics);
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

function topicSelector(topics, label, selected, groups = []) {
  const field = element('label', label, 'history-writing');
  const select = element('select');
  addOptions(select, topics);
  for (const [name, entries] of groups) {
    if (!entries.length) continue;
    const group = element('optgroup');
    group.label = name;
    addOptions(group, entries);
    select.append(group);
  }
  if ([...select.options].some((option) => option.value === selected)) select.value = selected;
  field.append(select);
  return { field, select };
}

function addOptions(container, entries) {
  for (const [id, name] of entries) {
    const option = element('option', name);
    option.value = id;
    container.append(option);
  }
}

function groupedTopicSelector(label, selected, first = []) {
  const courseIds = new Set(courseTopics().map(([id]) => id));
  const groups = topicGroups.map(([, name, topics]) => [name, topics.filter(([id]) => courseIds.has(id))]);
  const other = allTopics.filter(([id]) => !courseIds.has(id));
  return topicSelector(first, label, selected, [...groups, ['Other syllabus topics', other]]);
}

function matchingText(value) {
  return value.normalize('NFD').replace(/\p{M}/gu, '').replace(/[’‘]/g, "'").trim().toLowerCase();
}

function toolLinks(topic, current) {
  const nav = element('nav', '', 'history-section-links history-topic-tools');
  nav.setAttribute('aria-label', 'More ways to study ' + topicTitles[topic]);
  const fromNotes = current === 'notes';
  const destinations = [
    ['notes', 'Notes'],
    ['flashcards', fromNotes ? 'Review flashcards' : 'Flashcards'],
    ['paper-1', fromNotes ? 'Practise written answers' : 'Structured questions'],
    ['quiz', fromNotes ? 'Take an MCQ quiz' : 'MCQs']
  ];
  for (const [view, label] of destinations) {
    if (view === current) continue;
    const href = view === 'notes' ? '#history-topic-' + topic : '#history-' + view + '/' + topic;
    const anchor = link(label, href, 'gallery-button');
    anchor.setAttribute('aria-label', label + ' for ' + topicTitles[topic]);
    if (fromNotes) {
      const arrow = element('span', '→', 'history-notes-arrow');
      arrow.setAttribute('aria-hidden', 'true');
      anchor.append(arrow);
    }
    nav.append(anchor);
  }
  return nav;
}

function rememberToolTopic(view, topic) {
  const [route] = location.hash.slice(1).split('/');
  if (route !== view) return;
  window.history.replaceState(null, '', '#' + view + (topic === 'all' ? '' : '/' + topic));
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

function openTopic(id, sectionId = '') {
  const hash = '#history-topic-' + id + (sectionId ? '/' + sectionId : '');
  if (location.hash !== hash) {
    location.hash = hash;
    return;
  }
  const [, title, overview, question, advice] = allTopics.find(([topic]) => id === topic);
  const heading = byId('history-notes-title');
  const notes = byId('history-notes-content');
  if (notes.dataset.topic !== id) {
    notes.dataset.topic = id;
    heading.textContent = title;
    const { field, select } = groupedTopicSelector('Open another topic', id);
    select.addEventListener('change', () => openTopic(select.value));
    const contents = element('nav', '', 'history-notes-contents');
    contents.setAttribute('aria-label', 'Sections in this topic');
    const list = element('ol');
    for (const [index, section] of studyTopics[id].entries()) {
      const item = element('li');
      item.append(link(section.title, '#history-topic-' + id + '/section-' + (index + 1)));
      list.append(item);
    }
    const argumentLink = element('li');
    argumentLink.append(link('Build an argument', '#history-topic-' + id + '/argument'));
    list.append(argumentLink);
    contents.append(element('strong', 'In this topic'), list);
    notes.replaceChildren(element('p', overview), toolLinks(id, 'notes'), field, contents);
    for (const [index, { title: sectionTitle, facts }] of studyTopics[id].entries()) {
      const section = element('section', '', 'history-note-section');
      const subheading = element('h3', sectionTitle);
      subheading.id = 'history-note-section-' + (index + 1);
      subheading.tabIndex = -1;
      section.append(subheading);
      const evidence = element('dl');
      for (const { answer, explanation } of facts) {
        evidence.append(element('dt', answer), element('dd', explanation));
      }
      section.append(evidence);
      notes.append(section);
    }
    if (id === 'versailles') versaillesLesson(notes);
    const argument = element('h3', 'Build an argument');
    argument.id = 'history-note-argument';
    argument.tabIndex = -1;
    notes.append(argument, element('p', question),
      reveal('Show planning guidance', advice), reveal('Show model answer', modelAnswers[id]));
    const actions = element('div', '', 'history-notes-actions');
    actions.append(studiedButton(id));
    if (id !== 'versailles') actions.append(flagButton('topic-' + id, title));
    actions.append(link('Back to top of notes', '#history-topic-' + id, 'gallery-button'));
    notes.append(actions);
  }
  if (state.last !== id) {
    state.last = id;
    renderResume();
    save();
  }
  showView('history-notes');
  const target = sectionId && byId('history-note-' + sectionId);
  for (const shortcut of notes.querySelectorAll('.history-notes-contents a')) {
    if (target && shortcut.hash === hash) shortcut.setAttribute('aria-current', 'location');
    else shortcut.removeAttribute('aria-current');
  }
  if (target) target.scrollIntoView({ block: 'start' });
  else window.scrollTo(0, 0);
  (target || heading).focus({ preventScroll: true });
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
  const query = matchingText(search.value);
  const selected = topicScope.value;
  const courseIds = new Set(courseTopics().map(([id]) => id));
  output.replaceChildren();
  let count = 0;
  for (const [key, name, topics] of topicGroups) {
    if (['a', 'b', 'depth'].includes(selected) && key !== selected) continue;
    const grid = element('ul', '', 'history-topic-grid');
    for (const [id, title, overview] of topics) {
      if (selected === 'course' && !courseIds.has(id)) continue;
      if (query) {
        const text = [title, topicPreviews[id]?.[1], overview];
        for (const { title: section, facts } of studyTopics[id]) {
          text.push(section, ...facts.flatMap(({ answer, explanation }) => [answer, explanation]));
        }
        const haystack = matchingText(text.join(' '));
        if (!query.split(/\s+/).every((term) => haystack.includes(term))) continue;
      }
      grid.append(topicCard(id, title));
      count++;
    }
    if (!grid.childElementCount) continue;
    const section = element('section', '', 'history-topic-group');
    section.dataset.group = key;
    const heading = element('h3', name);
    heading.id = 'history-topic-group-' + key;
    section.setAttribute('aria-labelledby', heading.id);
    section.append(heading, grid);
    output.append(section);
  }
  byId('history-topic-count').textContent = count === 1 ? '1 topic' : count + ' topics';
  if (!count) output.append(element('p', 'No matching topics. Try another search or choose a different topic group.'));
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

function renderFlashcards() {
  const { field, select } = groupedTopicSelector('Flashcard topic', state.flashcardTopic);
  select.id = 'history-flashcard-topic';
  const { field: sectionField, select: sectionSelect } = topicSelector([], 'Section');
  const { field: jumpField, select: jumpSelect } = topicSelector([], 'Jump to a card');
  const filters = element('div', '', 'history-study-filters');
  filters.append(field, sectionField);
  const panel = element('section', '', 'history-card history-study-panel');
  const position = element('p');
  position.setAttribute('role', 'status');
  const sectionTitle = element('p', '', 'history-study-label');
  const prompt = element('h3');
  const answer = element('div');
  answer.id = 'history-flashcard-answer';
  const controls = element('div', '', 'history-section-links');
  const related = element('div', '', 'history-study-related');
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
  panel.append(position, sectionTitle, prompt, answer, controls, jumpField);

  function renderCard() {
    const fact = facts[index];
    position.textContent = 'Card ' + (index + 1) + ' of ' + facts.length;
    sectionTitle.textContent = fact.title;
    prompt.textContent = fact.prompt;
    answer.replaceChildren(element('strong', fact.answer), element('p', fact.explanation));
    answer.hidden = true;
    flip.textContent = 'Show answer';
    flip.setAttribute('aria-expanded', 'false');
    jumpSelect.value = String(index);
    previous.disabled = index === 0;
    next.disabled = index === facts.length - 1;
  }

  function progress() {
    return state.flashcardProgress[select.value] ??= { section: 'all', cards: {} };
  }

  function move(offset) {
    index += offset;
    progress().cards[sectionSelect.value] = index;
    renderCard();
    save();
    if ((next.disabled && offset > 0) || (previous.disabled && offset < 0)) flip.focus();
  }

  function loadSection() {
    const sections = studyTopics[select.value];
    const current = sectionSelect.value;
    facts = (current === 'all' ? sections : [sections[Number(current)]])
      .flatMap(({ title, facts }) => facts.map((fact) => ({ ...fact, title })));
    index = Math.min(progress().cards[current] ?? 0, facts.length - 1);
    jumpSelect.replaceChildren();
    addOptions(jumpSelect, facts.map((fact, number) => [String(number), (number + 1) + '. ' + fact.prompt]));
    renderCard();
  }

  function loadDeck() {
    state.flashcardTopic = select.value;
    sectionSelect.replaceChildren();
    addOptions(sectionSelect, [['all', 'All sections'], ...studyTopics[select.value].map(({ title }, index) => [String(index), title])]);
    sectionSelect.value = progress().section;
    loadSection();
    related.replaceChildren(toolLinks(select.value, 'flashcards'));
  }

  select.addEventListener('change', () => {
    loadDeck();
    rememberToolTopic('history-flashcards', select.value);
    save();
  });
  sectionSelect.addEventListener('change', () => {
    progress().section = sectionSelect.value;
    loadSection();
    save();
  });
  jumpSelect.addEventListener('change', () => move(Number(jumpSelect.value) - index));
  loadDeck();
  byId('history-flashcards-list').replaceChildren(filters, related, panel);
}

function renderQuiz() {
  const output = byId('history-quiz-list');
  const topics = courseTopics();
  const { field, select } = groupedTopicSelector('Quiz topic', state.quizTopic, [['all', 'All course topics']]);
  select.id = 'history-quiz-topic';
  const { field: setField, select: setSelect } = topicSelector([], 'Question set');
  const controls = element('div', '', 'history-study-filters');
  controls.append(field, setField);
  const body = element('div');
  const related = element('div', '', 'history-study-related');
  output.replaceChildren(controls, related, body);
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
      fieldset.append(element('legend', (start + index + 1) + '. ' + question));
      if (select.value === 'all') fieldset.append(element('p', topicTitles[id], 'history-study-label'));
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
    function moveSet(offset) {
      setSelect.selectedIndex += offset;
      renderSet();
      setSelect.focus();
    }
    const previous = action('Previous set', () => moveSet(-1));
    const next = action('Next set', () => moveSet(1));
    previous.disabled = setSelect.selectedIndex === 0;
    next.disabled = setSelect.selectedIndex === setSelect.options.length - 1;
    const actions = element('div', '', 'history-section-links');
    actions.append(submit, reset, previous, next);
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
    related.replaceChildren(select.value === 'all' ? link('Browse topic notes', '#history-topics', 'gallery-button') : toolLinks(select.value, 'quiz'));
    renderSet();
  }

  select.addEventListener('change', () => {
    updateTopic();
    rememberToolTopic('history-quiz', select.value);
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
  const grid = element('div', '', 'history-grid');

  const paper1 = practiceCard('paper-1', 'Paper 1 · Structured questions', '2 hours · 60 marks. Choose a topic and question to practise.');
  const { field: topicLabel, select: topicSelect } = groupedTopicSelector('Practice topic', state.practiceTopic);
  topicSelect.id = 'history-practice-topic';
  const { field: marksLabel, select: marksSelect } = topicSelector([
    ['all', 'Any mark value'], ['4', '4 marks · Describe'], ['6', '6 marks · Explain'],
    ['10', '10 marks · Evaluate'], ['ai', 'Writing drill with AI feedback']
  ], 'Question type');
  const searchLabel = element('label', 'Search questions in this topic', 'history-writing');
  const questionSearch = element('input');
  questionSearch.type = 'search';
  questionSearch.placeholder = 'Try reparations or migration';
  searchLabel.append(questionSearch);
  const filters = element('div', '', 'history-study-filters');
  filters.append(topicLabel, marksLabel, searchLabel);

  const browser = element('div', '', 'history-question-browser');
  const results = element('div', '', 'history-question-results');
  const count = element('p', '', 'history-question-count');
  count.setAttribute('role', 'status');
  const list = element('div', '', 'history-question-list');
  results.append(count, list);
  const prompt = element('section', '', 'history-question-workspace');
  prompt.setAttribute('aria-label', 'Write your answer');
  browser.append(results, prompt);
  const related = element('div', '', 'history-study-related');
  const markAdvice = {
    4: 'Describe the requested features using distinct, relevant historical details.',
    6: 'Explain how or why the factors mattered. Develop each link with specific evidence.',
    10: 'Explain different sides with evidence, then justify your overall judgement.'
  };
  let entries = [];

  function questionMeta(entry) {
    return [entry.marks && entry.marks + ' marks', state.drafts[entry.draftId]?.trim() && 'Saved draft'].filter(Boolean).join(' · ');
  }

  function showQuestion(entry, focusHeading = false) {
    const id = topicSelect.value;
    state.practiceSelections[id] = entry.key;
    prompt.dataset.key = id + '/' + entry.key;
    const heading = element('h4', entry.prompt);
    heading.tabIndex = -1;
    prompt.replaceChildren(element('p', entry.section + (entry.marks ? ' · ' + entry.marks + ' marks' : ''), 'history-study-label'), heading);
    if (entry.marks) {
      prompt.append(writing(entry.draftId, 'Your answer'),
        reveal('Show marking guidance', markAdvice[entry.marks] + ' ' + entry.guidance));
    } else {
      prompt.append(...markedWriting(entry.draftId, 'Your answer', entry.prompt, entry.guidance, modelAnswers[id]));
    }
    for (const button of list.querySelectorAll('button')) {
      if (button.dataset.key === entry.key) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    }
    prompt.querySelector('textarea').addEventListener('input', () => {
      const active = list.querySelectorAll('button');
      const button = [...active].find((button) => button.dataset.key === entry.key);
      if (button) button.querySelector('small').textContent = questionMeta(entry);
    });
    if (focusHeading) {
      heading.scrollIntoView({ block: 'nearest' });
      heading.focus({ preventScroll: true });
    }
  }

  function showMatches() {
    const id = topicSelect.value;
    const query = matchingText(questionSearch.value);
    const type = marksSelect.value;
    list.replaceChildren();
    const matches = entries.filter(({ key, marks, prompt, section }) =>
      (type === 'all' || (type === 'ai' ? key === 'ai' : type === String(marks))) &&
      matchingText(prompt + ' ' + section).includes(query));
    count.textContent = matches.length === 1 ? '1 question' : matches.length + ' questions';
    let group;
    for (const entry of matches) {
      if (group?.dataset.section !== entry.section) {
        group = element('section', '', 'history-question-group');
        group.dataset.section = entry.section;
        group.append(element('h4', entry.section));
        list.append(group);
      }
      const button = action('', () => {
        showQuestion(entry, true);
        save();
      });
      button.className = 'history-question-choice';
      button.dataset.key = entry.key;
      button.append(element('span', entry.prompt),
        element('small', questionMeta(entry)));
      group.append(button);
    }
    if (!matches.length) list.append(element('p', 'No questions match. Try another search or question type.'));
    const selected = matches.find(({ key }) => key === state.practiceSelections[id]);
    if (selected) {
      if (prompt.dataset.key !== id + '/' + selected.key) showQuestion(selected);
      [...list.querySelectorAll('button')].find((button) => button.dataset.key === selected.key)?.setAttribute('aria-current', 'true');
    } else {
      prompt.dataset.key = '';
      prompt.replaceChildren(element('p', 'Choose a question to open its answer box and marking guidance.'));
    }
  }

  function updateTopic() {
    const id = topicSelect.value;
    state.practiceTopic = id;
    entries = studyTopics[id].flatMap(({ title: section, parts }) => parts.map((part) => ({ ...part, section })))
      .map((part, index) => ({ ...part, key: String(index), draftId: 'structured-' + id + '-' + index }));
    const [, , , question, guidance] = allTopics.find(([key]) => key === id);
    entries.push({ section: 'Writing drill with AI feedback', key: 'ai', prompt: question, guidance, draftId: 'paper-1-' + id });
    related.replaceChildren(toolLinks(id, 'paper-1'));
    showMatches();
  }

  topicSelect.addEventListener('change', () => {
    questionSearch.value = '';
    marksSelect.value = 'all';
    updateTopic();
    rememberToolTopic('history-paper-1', topicSelect.value);
    save();
  });
  marksSelect.addEventListener('change', showMatches);
  questionSearch.addEventListener('input', showMatches);
  updateTopic();
  paper1.append(filters, related, browser, flagButton('paper-1', 'Paper 1 writing practice'));
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
  delete byId('history-notes-content').dataset.topic;
  renderTopics();
  renderPractice(focus);
  const coursework = route === '3';
  byId('gallery-route').href = coursework ? '#history-coursework' : '#history-paper-4';
  byId('gallery-route-title').textContent = coursework ? 'Coursework' : 'Paper 4';
  byId('gallery-route-description').textContent = coursework ? 'Research log and checklist' : 'Depth-study practice';
  byId('gallery-route-time').hidden = coursework;
  selectPracticePaper(location.hash.slice(1).split('/')[0]);
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
topicScope.addEventListener('change', renderTopics);
renderCourse();
const views = [...document.querySelectorAll('.history-view')];
const tabs = [...document.querySelectorAll('.history-nav a')];

function showView(id) {
  for (const view of views) view.hidden = view.id !== id;
  const tabId = id === 'history-notes' ? 'history-topics' : id;
  for (const tab of tabs) {
    if (tab.hash === '#' + tabId) tab.setAttribute('aria-current', 'page');
    else tab.removeAttribute('aria-current');
  }
}

function selectPracticePaper(id) {
  const papers = [...byId('history-practice-list').querySelectorAll('.history-grid > article')];
  const selected = papers.find((paper) => paper.id === id);
  const currentHash = selected ? '#' + selected.id : '#history-practice';
  byId('history-practice-list').classList.toggle('history-single-paper', Boolean(selected));
  for (const paper of papers) paper.hidden = Boolean(selected && paper !== selected);
  for (const link of practiceLinks) {
    link.hidden = link.hash !== '#history-practice' && !papers.some((paper) => '#' + paper.id === link.hash);
    if (link.hash === currentHash) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  return selected;
}

function navigate() {
  const [id, detail] = location.hash.slice(1).split('/');
  if (id.startsWith('history-topic-') && Object.hasOwn(topicTitles, id.slice(14))) {
    openTopic(id.slice(14), detail);
    return;
  }
  const selectors = {
    'history-paper-1': 'history-practice-topic',
    'history-flashcards': 'history-flashcard-topic',
    'history-quiz': 'history-quiz-topic'
  };
  if (Object.hasOwn(selectors, id) && Object.hasOwn(topicTitles, detail)) {
    const select = byId(selectors[id]);
    if (select.value !== detail) {
      select.value = detail;
      select.dispatchEvent(new Event('change'));
    }
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
  if (Object.hasOwn(selectors, id) && view) {
    const heading = target.querySelector(id === 'history-paper-1' ? 'h3' : 'h2');
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }
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

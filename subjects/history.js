import { core, depths, prescribed } from './history-content.js';

const byId = (id) => document.getElementById(id);
const storageKey = 'fresh.history.0470.v1';
let stored = {};
try {
  stored = JSON.parse(localStorage.getItem(storageKey)) || {};
} catch {
  // Study tools remain usable when browser storage is unavailable.
}
const state = { course: {}, completed: {}, review: {}, drafts: {}, last: '', ...stored };
const settings = byId('history-settings');
const form = byId('history-form');
const search = byId('history-search');
const allTopics = [...core.A, ...core.B, ...Object.values(depths)];

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
  search.value = '';
  renderTopics(id);
  const card = byId('history-topic-' + id);
  if (!card) return;
  card.open = true;
  location.hash = card.id;
  card.scrollIntoView();
  card.querySelector('summary').focus({ preventScroll: true });
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
  card.append(element('h4', 'From armistice to treaty'));
  const timeline = element('ol');
  for (const event of [
    'November 1918 · The Armistice ended fighting on the Western Front.',
    'January 1919 · The Paris Peace Conference opened.',
    'June 1919 · Germany signed the Treaty of Versailles.'
  ]) timeline.append(element('li', event));
  card.append(timeline, element('h4', 'Evidence to use'));
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
  link.textContent = last ? 'Resume ' + last[1] : 'Explore topics';
  link.href = last ? '#history-topic-' + last[0] : '#history-topics';
  link.onclick = last ? (event) => {
    event.preventDefault();
    openTopic(last[0]);
  } : null;
}

function renderTopics(revealId) {
  const output = byId('history-topic-list');
  const query = search.value.trim().toLowerCase();
  const opened = new Set([...output.querySelectorAll('[open]')].map((node) => node.id));
  output.replaceChildren();
  const groups = query ? [['Search results', allTopics]] : [
    ...Object.entries(core).filter(([option]) => !state.course.core || option === state.course.core)
      .map(([option, topics]) => ['Core option ' + option, topics]),
    ['Depth studies', depths[state.course.depth] ? [depths[state.course.depth]] : Object.values(depths)]
  ];
  if (typeof revealId === 'string' && !groups.some(([, topics]) => topics.some(([id]) => id === revealId))) {
    groups.push(['Saved topic', allTopics.filter(([id]) => id === revealId)]);
  }
  for (const [name, topics] of groups) {
    output.append(element('h3', name));
    const grid = element('div', '', 'history-grid');
    for (const [id, title, overview, question, advice] of topics) {
      if (![title, overview, question, advice].join(' ').toLowerCase().includes(query)) continue;
      const card = element('details', '', 'history-card');
      card.id = 'history-topic-' + id;
      card.open = opened.has(card.id);
      card.addEventListener('toggle', () => {
        if (!card.open || !card.isConnected) return;
        state.last = id;
        renderResume();
        save();
      });
      card.append(element('summary', title), element('p', overview));
      if (id === 'versailles') versaillesLesson(card);
      else card.append(reveal('Recall check', 'From memory, explain one event or idea in the summary. Then reread it and add one specific detail.'));
      card.append(element('h4', 'Build an argument'), element('p', question),
        reveal('Show planning guidance', advice));
      const completed = action(state.completed[id] ? 'Studied · undo' : 'Mark as studied', () => {
        if (state.completed[id]) delete state.completed[id];
        else state.completed[id] = true;
        completed.textContent = state.completed[id] ? 'Studied · undo' : 'Mark as studied';
        completed.setAttribute('aria-pressed', String(Boolean(state.completed[id])));
        renderReview();
        save();
      });
      completed.setAttribute('aria-pressed', String(Boolean(state.completed[id])));
      card.append(completed);
      if (id !== 'versailles') card.append(flagButton('topic-' + id, title));
      grid.append(card);
    }
    output.append(grid.childElementCount ? grid : element('p', 'No matching topics. Try a different search.'));
  }
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
  const practiceTopics = [...(core[state.course.core] || [...core.A, ...core.B]), ...(depth ? [depth] : [])];
  const grid = element('div', '', 'history-grid');

  const paper1 = practiceCard('paper-1', 'Paper 1 · Structured questions', '2 hours · 60 marks. Practise describing, explaining and evaluating.');
  const topicLabel = element('label', 'Practice topic', 'history-writing');
  const topicSelect = element('select');
  const prompt = element('div');
  for (const [id, title] of practiceTopics) {
    const option = element('option', title);
    option.value = id;
    topicSelect.append(option);
  }
  topicSelect.value = practiceTopics.some(([id]) => id === state.practiceTopic) ? state.practiceTopic : practiceTopics[0][0];
  function updatePrompt() {
    const [id, , , question, guidance] = practiceTopics.find(([id]) => id === topicSelect.value);
    prompt.replaceChildren(element('p', question), writing('paper-1-' + id, 'Your answer'),
      reveal('Show planning guidance', guidance));
  }
  topicSelect.addEventListener('change', () => {
    state.practiceTopic = topicSelect.value;
    updatePrompt();
    save();
  });
  topicLabel.append(topicSelect);
  updatePrompt();
  paper1.append(topicLabel, prompt, flagButton('paper-1', 'Paper 1 writing practice'));
  grid.append(paper1);

  const paper2 = practiceCard('paper-2', 'Paper 2 · Document questions', '1 hour 45 minutes · 40 marks. Try this standalone Versailles source drill.');
  if (focus) paper2.append(element('p', 'Your prescribed topic: ' + focus[1] + '.'));
  const source = element('blockquote', 'The world must be made safe for democracy. Its peace must be planted upon the tested foundations of political liberty.');
  paper2.append(source, element('p', 'Woodrow Wilson, address to the US Congress asking for a declaration of war, 2 April 1917.'),
    element('p', 'How useful is this speech for understanding US aims before the Paris Peace Conference? Use the wording and the occasion.'),
    writing('paper-2-versailles', 'Your answer'),
    reveal('Show planning guidance', '“Political liberty” helps identify a principle Wilson publicly promoted. The speech was intended to win support for entering the war in 1917, so compare it with his 1919 negotiating positions before drawing conclusions about the treaty.'),
    flagButton('paper-2', 'Paper 2 source practice'));
  grid.append(paper2);

  if (state.course.route !== '3') {
    const paper4 = practiceCard('paper-4', 'Paper 4 · Alternative to Coursework', '1 hour · 40 marks. Practise a structured account followed by an assessment of significance.');
    if (depth) {
      paper4.append(element('h4', depth[1]), element('p', depth[3]),
        writing('paper-4-' + depth[0], 'Your plan or answer'), reveal('Show planning guidance', depth[4]),
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
  byId('history-focus').nextElementSibling.href = '#history-paper-2';
  renderTopics();
  renderPractice(focus);
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
if (location.hash.startsWith('#history-topic-')) openTopic(location.hash.slice(15));

import { drills, scenarios, writtenQuestions } from './questions.mjs';
import { markHistory as markAnswer } from '../../history-marker.js';

const get = (id) => document.getElementById(id);

function node(tag, text = '') {
  const element = document.createElement(tag);
  element.textContent = text;
  return element;
}

function button(text) {
  const element = node('button', text);
  element.type = 'button';
  element.className = 'cs-action';
  return element;
}

function selectControl(label, options) {
  const wrapper = node('label', label);
  const select = node('select');
  for (const [value, title] of options) {
    const option = node('option', title);
    option.value = value;
    select.append(option);
  }
  wrapper.append(select);
  return { wrapper, select };
}

function details(label, content) {
  const element = node('details');
  element.append(node('summary', label), content);
  return element;
}

function editor(label, key) {
  const wrapper = node('label', label);
  const input = node('textarea');
  input.spellcheck = false;
  const status = node('small');
  status.setAttribute('role', 'status');
  try {
    input.value = localStorage.getItem(key) ?? '';
  } catch {
    status.textContent = 'Draft storage is unavailable.';
  }
  input.addEventListener('input', () => {
    try {
      localStorage.setItem(key, input.value);
    } catch {
      status.textContent = 'Draft storage is unavailable.';
    }
  });
  wrapper.append(input, status);
  return { wrapper, input };
}

function renderDrills() {
  const output = get('drills');
  const { wrapper, select } = selectControl('Skill', drills.map(([title], index) => [index, title]));
  const body = node('div');
  function render() {
    const [title, prompt, code, expected, solution] = drills[Number(select.value)];
    body.replaceChildren(node('h3', title), node('p', prompt));
    if (!code) {
      const draft = editor('Your pseudocode', 'fresh:0478:drill-loop');
      draft.input.className = 'cs-code';
      body.append(draft.wrapper, details('Show worked solution', node('pre', solution)));
      return;
    }
    const label = node('label', 'Output');
    const input = node('input');
    input.type = 'text';
    label.append(input);
    const check = button('Check output');
    const status = node('p');
    status.setAttribute('role', 'status');
    function checkOutput() {
      const value = input.value.trim().replace(/^["']|["']$/g, '');
      status.textContent = !value ? 'Enter your predicted output first.'
        : value.toLowerCase() === expected.toLowerCase() ? 'Correct. ' + solution
        : 'Try again. Trace each line or open the explanation.';
    }
    check.addEventListener('click', checkOutput);
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') checkOutput();
    });
    body.append(node('pre', code), label, check, status, details('Show explanation', node('p', solution)));
  }
  select.addEventListener('change', render);
  output.append(wrapper, body);
  render();
}

function questionView(task, coding) {
  const view = node('article');
  const draft = editor(coding ? 'Your solution' : 'Your answer', 'fresh:0478:' + task.id);
  if (coding) draft.input.className = 'cs-code';
  const mark = button('AI mark my answer');
  const status = node('p');
  status.setAttribute('role', 'status');
  const results = node('div');
  const rubric = node('ul');
  for (const [name, cap] of task.criteria) rubric.append(node('li', name + ' · ' + cap + ' marks'));
  draft.input.addEventListener('input', () => {
    results.replaceChildren();
    if (!mark.disabled) status.textContent = '';
  });
  mark.addEventListener('click', async () => {
    const answer = draft.input.value.trim();
    if (!answer || answer.length > 10000) {
      status.textContent = answer ? 'Keep your answer under 10,000 characters for marking.' : 'Write an answer first.';
      return;
    }
    results.replaceChildren();
    mark.disabled = true;
    status.textContent = 'Starting the on-device marker…';
    try {
      const result = await markAnswer({
        subject: 'computer-science', prompt: task.prompt, criteria: task.criteria,
        example: task.model, target: coding ? 'Scenario algorithm for Paper 2.' : 'Extended written answer.'
      }, answer, (message) => { status.textContent = message; });
      if (draft.input.value.trim() !== answer) {
        status.textContent = 'Your draft changed during marking. Submit it again for updated feedback.';
        return;
      }
      status.textContent = 'AI practice estimate · ' + result.total + '/' + task.marks;
      for (const item of result.criteria) {
        results.append(node('p', item.name + ' · ' + item.mark + '/' + item.max + '. ' + item.comment));
        if (item.evidence) results.append(node('blockquote', item.evidence));
      }
      results.append(node('p', 'Next step: ' + result.nextStep));
    } catch (error) {
      status.textContent = error.message;
    } finally {
      mark.disabled = false;
    }
  });
  view.append(node('h3', task.title + ' · ' + task.marks + ' marks'), node('p', task.prompt),
    draft.wrapper, mark, node('p', 'AI marking requires WebGPU and downloads a model on first use. Your draft is marked on your device.'),
    status, results, details('Show model answer', node(coding ? 'pre' : 'p', task.model)),
    details('Show practice rubric', rubric));
  return view;
}

function mountQuestions(id, label, bank, coding) {
  const { wrapper, select } = selectControl(label, bank.map((task, index) =>
    [index, task.title]));
  const body = node('div');
  function render() {
    body.replaceChildren(questionView(bank[Number(select.value)], coding));
  }
  select.addEventListener('change', render);
  get(id).append(wrapper, body);
  render();
}

const tabs = [...document.querySelectorAll('.cs-tabs a')];
function showSection() {
  const active = tabs.find((tab) => tab.hash === location.hash) ?? tabs[0];
  for (const tab of tabs) {
    const selected = tab === active;
    get(tab.hash.slice(1)).hidden = !selected;
    if (selected) tab.setAttribute('aria-current', 'page');
    else tab.removeAttribute('aria-current');
  }
}
window.addEventListener('hashchange', showSection);
renderDrills();
mountQuestions('scenarios', 'Scenario', scenarios, true);
const writtenOutput = get('written-questions');
const marks = [...new Set(writtenQuestions.map((task) => task.marks))].sort((a, b) => a - b);
const markFilter = selectControl('Marks per question', marks.map((mark) => [mark, mark + ' marks']));
const writtenTask = node('div');
writtenOutput.append(markFilter.wrapper, writtenTask);
function renderWritten() {
  writtenTask.replaceChildren();
  mountQuestions('current-written-task', 'Question', writtenQuestions.filter((task) => task.marks === Number(markFilter.select.value)), false);
}
writtenTask.id = 'current-written-task';
markFilter.select.addEventListener('change', renderWritten);
renderWritten();
showSection();

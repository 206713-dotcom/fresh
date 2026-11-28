import { drills, scenarios, writtenQuestions } from './questions.mjs';
import { pythonModels } from './python-models.mjs';
import { tables, flowcharts, sql, books } from './skills.mjs';
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

function questionView(task, coding, language) {
  const view = node('article');
  const draft = editor(coding ? 'Your solution' : 'Your answer', 'fresh:0478:' + task.id + (language === 'Python' ? ':python' : ''));
  if (coding) draft.input.className = 'cs-code';
  const model = language === 'Python' ? pythonModels[task.id] : task.model;
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
        example: model, target: coding ? 'Paper 2 scenario algorithm written in ' + language + '.' : 'Extended written answer.'
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
    status, results, details(coding ? 'Show ' + language + ' model answer' : 'Show model answer', node(coding ? 'pre' : 'p', model)),
    details('Show practice rubric', rubric));
  return view;
}

function mountQuestions(id, label, bank, coding) {
  const { wrapper, select } = selectControl(label, bank.map((task, index) =>
    [index, task.title]));
  const body = node('div');
  const language = coding ? selectControl('Answer language', [['Pseudocode', 'Pseudocode'], ['Python', 'Python']]) : null;
  function render() {
    body.replaceChildren(questionView(bank[Number(select.value)], coding, language?.select.value));
  }
  if (language) {
    language.select.addEventListener('change', render);
  }
  select.addEventListener('change', render);
  const output = get(id);
  output.append(wrapper);
  if (language) output.append(language.wrapper);
  output.append(body);
  render();
}

function dataTable(headers, rows, cellContent = (value) => String(value)) {
  const table = node('table');
  const head = node('thead');
  const headings = node('tr');
  for (const header of headers) {
    const cell = node('th', header);
    cell.scope = 'col';
    headings.append(cell);
  }
  head.append(headings);
  const body = node('tbody');
  rows.forEach((row, rowIndex) => {
    const tr = node('tr');
    row.forEach((value, column) => {
      const cell = node('td');
      cell.append(cellContent(value, rowIndex, column));
      tr.append(cell);
    });
    body.append(tr);
  });
  table.append(head, body);
  const scroll = node('div');
  scroll.className = 'cs-table';
  scroll.append(table);
  return scroll;
}

function skillsDrill(id, bank, title, render) {
  const { wrapper, select } = selectControl(title, bank.map((item, index) => [index, item.title ?? item[0]]));
  const body = node('div');
  get(id + '-exercises').append(wrapper, body);
  function update() {
    body.replaceChildren(...render(bank[Number(select.value)], Number(select.value)));
  }
  select.addEventListener('change', update);
  update();
}

function checkAnswers(entries) {
  const check = button('Check answers');
  const status = node('p');
  status.setAttribute('role', 'status');
  check.addEventListener('click', () => {
    let correct = 0;
    for (const [input, expected] of entries) {
      const matches = input.value.trim() === String(expected);
      if (matches) correct++;
      if (matches) input.removeAttribute('aria-invalid');
      else input.setAttribute('aria-invalid', 'true');
    }
    status.textContent = correct + ' of ' + entries.length + ' correct.' +
      (correct === entries.length ? '' : ' Recheck the highlighted answers.');
  });
  return [check, status];
}

for (const [id, bank] of Object.entries(tables)) {
  skillsDrill(id, bank, 'Exercise', ([, prompt, code, headers, rows, explanation]) => {
    const entries = [];
    const table = dataTable(headers, rows, (value, row, column) => {
      const heading = headers[column];
      const trace = id === 'trace-tables';
      if (trace ? heading === 'I' : !['X', 'Q'].includes(heading)) return String(value);
      const input = node('input');
      input.inputMode = 'numeric';
      input.setAttribute('aria-label', heading + ', row ' + (row + 1));
      entries.push([input, value]);
      return input;
    });
    const worked = node('div');
    worked.append(dataTable(headers, rows), node('p', explanation));
    return [node('p', prompt), node('pre', code), table, ...checkAnswers(entries), details('Show completed table', worked)];
  });
}

skillsDrill('flowcharts', flowcharts, 'Exercise', ({ prompt, steps, explanation }) => {
  const chart = node('ol');
  chart.className = 'cs-flowchart';
  const entries = [];
  for (const [label, shape, choices] of steps) {
    const step = node('li');
    step.className = 'cs-flow-' + shape;
    if (label.endsWith(' branch')) step.classList.add('cs-flow-branch');
    if (choices) {
      const options = choices.map((answer, index) => [String(index), answer]);
      if (label === 'Yes branch') options.reverse();
      const { wrapper, select } = selectControl(label, [['', 'Choose a step'], ...options]);
      step.append(wrapper);
      entries.push([select, '0']);
    } else step.append(node('span', label));
    chart.append(step);
  }
  const worked = node('ol');
  for (const [label, , choices] of steps) worked.append(node('li', choices ? label + ' · ' + choices[0] : label));
  const solution = node('div');
  solution.append(worked, node('p', explanation));
  return [node('p', prompt), chart, ...checkAnswers(entries), details('Show worked flowchart', solution)];
});

skillsDrill('sql', sql, 'Exercise', ([, prompt, query, headers, rows], index) => {
  const draft = editor('Your SQL query', 'fresh:0478:sql:' + index);
  draft.input.className = 'cs-code';
  const worked = node('div');
  worked.append(node('pre', query), node('h3', 'Expected output'), dataTable(headers, rows));
  return [node('p', prompt), node('h3', 'Books table'), dataTable(['Title', 'Category', 'Price'], books),
    draft.wrapper, details('Show model query and expected output', worked)];
});

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

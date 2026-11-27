import { groupedQuestions, setupClearWriting, setupNewQuestion } from './question-controls.mjs?v=question-bank';
import { countWords, papers, rubricVersion, tasks } from './practice.mjs?v=question-bank';
import { setupLearningTools, updateMetrics } from './learning.mjs?v=question-bank';
import { read, write as writeStorage } from './storage.mjs';
import { setupWorkshop } from './workshop.mjs?v=question-bank';
import { readAttempt, timeRemaining } from './exam.mjs';

const get = id => document.getElementById(id);
const select = get('task');
const editor = get('response');
const feedback = get('feedback');
const status = get('mark-status');
const storage = get('storage');
let task;
let worker;
let timeout;
let remaining;
let deadline;
let interval;
let attempt;

function write(key, value, messageTarget = storage) {
  writeStorage(key, value, messageTarget);
}

const legacyToolPages = {
  '#reading-lab': 'english-reading-lab.html',
  '#notebook': 'english-mistake-notebook.html',
};

function redirectLegacyTool() {
  const page = legacyToolPages[location.hash];
  if (page && !examActive()) location.replace(page + location.search);
}

groupedQuestions(select, tasks, exercise => [
  exercise.group ?? papers.find(paper => paper.id === exercise.paper).title,
  exercise.id,
  exercise.group ? exercise.title : exercise.number + ' · ' + exercise.title,
]);

function updateWords() {
  const count = countWords(editor.value);
  const target = task.target;
  const hint = !target ? '' : target[0] === 0 ? ' · maximum ' + target[1] : ' · target ' + target.join('–');
  get('words').textContent = count + (count === 1 ? ' word' : ' words') + hint;
  get('download').disabled = !editor.value;
  if (get('analysis').open) updateMetrics(get('metrics'), editor.value);
}

function updateCompletion() {
  const reviewed = read('review:' + task.id) === '1';
  get('reviewed').setAttribute('aria-pressed', String(reviewed));
  get('reviewed').textContent = reviewed ? 'Undo reviewed status' : 'Mark as reviewed';
  const total = tasks.filter(item => read('review:' + item.id) === '1').length;
  const summary = total + ' of ' + tasks.length + ' tasks reviewed';
  get('completion').textContent = summary;
  get('home-completion').textContent = summary;
}

function stopTimer() {
  clearInterval(interval);
  deadline = undefined;
  get('timer-toggle').textContent = 'Start timer';
}

function updateClock() {
  if (deadline) remaining = timeRemaining(deadline);
  const minutes = Math.floor(remaining / 60);
  const seconds = String(remaining % 60).padStart(2, '0');
  get('timer').textContent = remaining ? minutes + ':' + seconds : 'Time’s up';
  get('timer-toggle').disabled = !remaining;
  if (!remaining) {
    stopTimer();
    if (examActive()) submitAttempt();
  }
}

function resetTimer() {
  stopTimer();
  remaining = task.timing * 60;
  updateClock();
}

function cancelFeedback() {
  clearTimeout(timeout);
  worker?.terminate();
  worker = undefined;
  get('mark').disabled = false;
  get('mark-cancel').hidden = true;
  feedback.replaceChildren();
  status.textContent = '';
}

const deskWorkspace = document.querySelector('.desk-workspace');
const deskSwitch = document.querySelector('.desk-switch');
const deskButtons = [...deskSwitch.querySelectorAll('button')];

function showDeskPane(pane) {
  deskWorkspace.dataset.pane = pane;
  for (const button of deskButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.deskPane === pane));
  }
}

for (const button of deskButtons) {
  button.addEventListener('click', () => showDeskPane(button.dataset.deskPane));
}
showDeskPane('source');
deskSwitch.hidden = false;

function focusDeskEditor() {
  showDeskPane('write');
  editor.focus();
}

function showTask() {
  task = tasks.find(item => item.id === select.value) ?? tasks[0];
  const notebookQuery = new URLSearchParams({ task:task.id });
  for (const link of document.querySelectorAll('[data-studio-notebook]')) link.search = notebookQuery;
  get('task-title').textContent = task.title;
  get('task-meta').textContent = (task.paper === 'p1' ? 'Paper 1' : 'Paper 2') + ' · Question ' + task.number + ' · ' + task.marks + ' practice marks';
  get('prompt').textContent = task.prompt;
  get('task-objectives').textContent = 'Assessment objectives · ' + task.objectives.join(', ');
  get('rubric-version').textContent = rubricVersion;
  get('specimen-scheme').href = papers.find(paper => paper.id === task.paper).markScheme;
  get('source-panel').hidden = !task.source;
  get('source').textContent = task.source ?? '';
  editor.value = attempt?.answer ?? read('draft:' + task.id) ?? '';
  storage.textContent = editor.value ? 'Draft restored' : '';
  get('example').textContent = task.example;
  get('review').open = false;
  get('criteria').replaceChildren(...task.criteria.map(([name, max, guidance]) => {
    const text = document.createElement('p');
    text.textContent = name + ' · ' + max + ' marks. ' + guidance;
    return text;
  }));
  cancelFeedback();
  resetTimer();
  updateWords();
  updateCompletion();
  updateContinue();
  showAttempt();
  showAttemptList();
}

function updateContinue() {
  const previous = tasks.find(item => item.id === read('last-practice'));
  if (!previous) return;
  const title = previous.title + ' · Question ' + previous.number;
  get('continue-detail').textContent = title;
  get('home-practice-detail').textContent = title;
  get('home-resume-practice').textContent = 'Resume practice';
  get('continue-practice').textContent = 'Resume practice';
}

function resumePractice() {
  const previous = tasks.find(item => item.id === read('last-practice'));
  if (previous && !attempt && previous.id !== task.id) {
    select.value = previous.id;
    showTask();
  }
}
get('continue-practice').addEventListener('click', resumePractice);
get('home-resume-practice').addEventListener('click', resumePractice);
select.addEventListener('change', () => {
  write('last-practice', select.value, null);
  showTask();
});
setupNewQuestion(get('desk-new-question'), select);
setupClearWriting(get('desk-clear'), [editor]);
get('analysis').addEventListener('toggle', () => {
  if (get('analysis').open) updateMetrics(get('metrics'), editor.value);
});
editor.addEventListener('input', () => {
  write('last-practice', task.id, null);
  updateContinue();
  if (examActive()) {
    if (!timeRemaining(attempt.endsAt)) {
      editor.value = attempt.answer;
      submitAttempt();
      return;
    }
    attempt.answer = editor.value;
    saveAttempt();
  } else if (!attempt) {
    write('draft:' + task.id, editor.value);
  }
  updateWords();
  if (!get('mark').disabled) {
    feedback.replaceChildren();
    status.textContent = '';
  }
});
get('reviewed').addEventListener('click', () => {
  const reviewed = read('review:' + task.id) !== '1';
  write('review:' + task.id, reviewed ? '1' : '0');
  if (reviewed && editor.value.trim()) {
    void window.FreshPoints?.earn('First Language English', 10, 'Written response reviewed', 'review:' + task.id);
  }
  updateCompletion();
});
get('timer-toggle').addEventListener('click', () => {
  if (deadline) {
    updateClock();
    stopTimer();
  } else {
    deadline = Date.now() + remaining * 1000;
    get('timer-toggle').textContent = 'Pause timer';
    interval = setInterval(updateClock, 250);
  }
});
get('timer-reset').addEventListener('click', resetTimer);
get('download').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([task.prompt, '\n\n', editor.value], { type: 'text/plain' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = task.id + '-draft.txt';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

function appendText(parent, tag, text) {
  const item = document.createElement(tag);
  item.textContent = text;
  parent.append(item);
}

get('mark-cancel').addEventListener('click', () => {
  cancelFeedback();
  status.textContent = 'Marking cancelled. Your response is still available.';
  get('mark').focus();
});
get('mark').addEventListener('click', () => {
  if (examActive()) return;
  const answer = editor.value.trim();
  if (!answer) {
    status.textContent = 'Write a response before requesting feedback.';
    focusDeskEditor();
    return;
  }
  if (!navigator.gpu) {
    status.textContent = 'WebGPU is unavailable in this browser. The self-marking guide is available below.';
    return;
  }
  const button = get('mark');
  button.disabled = true;
  get('mark-cancel').hidden = false;
  feedback.replaceChildren();
  status.textContent = 'Starting the on-device marker…';
  const fail = message => {
    cancelFeedback();
    status.textContent = message + ' You can use the self-marking guide or try again.';
  };
  try {
    worker ??= new Worker(new URL('./marker-worker.mjs', import.meta.url), { type: 'module' });
    worker.onerror = () => fail('The marking engine could not load.');
    worker.onmessage = ({ data }) => {
      if (data.progress) {
        status.textContent = data.progress;
        return;
      }
      clearTimeout(timeout);
      if (data.error) {
        fail(data.error);
        return;
      }
      button.disabled = false;
      get('mark-cancel').hidden = true;
      if (editor.value.trim() !== answer) {
        status.textContent = 'The draft changed during marking. Request feedback on the revised draft.';
        return;
      }
      const { total, criteria, nextStep } = data.result;
      status.textContent = '';
      appendText(feedback, 'h4', 'Estimated practice mark · ' + total + '/' + task.marks);
      for (const { name, max, mark, evidence, comment } of criteria) {
        const item = document.createElement('section');
        appendText(item, 'strong', name + ' · ' + mark + '/' + max);
        appendText(item, 'p', comment);
        if (evidence) appendText(item, 'blockquote', evidence);
        feedback.append(item);
      }
      appendText(feedback, 'p', 'Next step · ' + nextStep);
    };
    timeout = setTimeout(() => fail('The marker timed out.'), 300000);
    worker.postMessage({ task, answer });
  } catch {
    fail('The marking engine could not start.');
  }
});

function examActive() {
  return attempt?.submittedAt === null;
}

function saveAttempt() {
  write('active-attempt', JSON.stringify(attempt));
}

function showAttempt() {
  stopTimer();
  const active = examActive();
  document.documentElement.toggleAttribute('data-exam-active', active);
  showStudioView();
  select.disabled = Boolean(attempt);
  get('desk-new-question').disabled = select.disabled;
  editor.readOnly = Boolean(attempt && !active);
  get('desk-clear').disabled = editor.readOnly;
  editor.spellcheck = !attempt;
  editor.setAttribute('autocorrect', attempt ? 'off' : 'on');
  get('exam-start').hidden = Boolean(attempt);
  get('exam-submit').hidden = !active;
  get('exam-return').hidden = !attempt || active;
  get('timer-toggle').hidden = Boolean(attempt);
  get('timer-reset').hidden = Boolean(attempt);
  get('download').hidden = active;
  get('exam-status').textContent = active
    ? 'Timed attempt in progress. Submit it to unlock examples and feedback.'
    : attempt
      ? 'Attempt submitted. Review your response or return to your saved practice draft.'
      : 'Exam-style attempts start with a blank answer and a running timer. Your practice draft is kept.';
  if (active) {
    deadline = attempt.endsAt;
    interval = setInterval(updateClock, 250);
    updateClock();
  } else if (attempt) {
    get('timer').textContent = 'Submitted';
  }
}

function submitAttempt() {
  if (!examActive()) return;
  attempt.submittedAt = Math.min(Date.now(), attempt.endsAt);
  if (location.hash !== '#practice') history.replaceState(null, '', '#practice');
  saveAttempt();
  write('submitted:' + task.id, JSON.stringify(attempt), null);
  showAttempt();
  showAttemptList();
  get('review').querySelector('summary').focus();
}

get('exam-start').addEventListener('click', () => {
  write('last-practice', task.id, null);
  attempt = { task:task.id, answer:'', endsAt:Date.now() + task.timing * 60_000, submittedAt:null };
  get('analysis').open = false;
  saveAttempt();
  showTask();
  focusDeskEditor();
});
get('exam-submit').addEventListener('click', submitAttempt);
get('exam-return').addEventListener('click', () => {
  attempt = null;
  saveAttempt();
  showTask();
  select.focus();
});

function showAttemptList() {
  const list = get('attempt-list');
  const saved = tasks.map(item => readAttempt(read('submitted:' + item.id), tasks))
    .filter(item => item?.submittedAt != null)
    .sort((a,b) => b.submittedAt - a.submittedAt);
  list.replaceChildren();
  if (!saved.length) appendText(list, 'li', 'Completed exam-style attempts will appear here.');
  for (const item of saved) {
    const exercise = tasks.find(entry => entry.id === item.task);
    const row = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Review ' + exercise.title + ' · Question ' + exercise.number;
    button.addEventListener('click', () => {
      attempt = item;
      saveAttempt();
      select.value = item.task;
      get('saved-attempts').open = false;
      showTask();
      focusDeskEditor();
    });
    row.append(button, ' · ' + new Date(item.submittedAt).toLocaleDateString());
    list.append(row);
  }
}

attempt = readAttempt(read('active-attempt'), tasks);
redirectLegacyTool();
const initialTask = attempt?.task ?? new URLSearchParams(location.search).get('task');
if (tasks.some(item => item.id === initialTask)) select.value = initialTask;
showTask();
setupLearningTools({ read, write });
setupWorkshop(read, write);

function showStudioView() {
  const main = get('main');
  const panels = Array.from(main.querySelectorAll(':scope > section'));
  const target = get(location.hash.slice(1));
  const requested = panels.find(panel => panel.contains(target));
  const active = examActive() ? get('practice') : requested ?? get('reading-room');

  for (const panel of panels) panel.hidden = panel !== active;
  for (const link of document.querySelectorAll('.studio-header-nav a')) {
    if (link.hash === '#' + active.id) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  return active.contains(target) ? target : null;
}

window.addEventListener('hashchange', () => {
  redirectLegacyTool();
  const target = showStudioView();
  if (target && !target.matches('main > section')) target.scrollIntoView();
  else window.scrollTo(0, 0);
});
const initialTarget = showStudioView();
if (initialTarget && !initialTarget.matches('main > section')) initialTarget.scrollIntoView();

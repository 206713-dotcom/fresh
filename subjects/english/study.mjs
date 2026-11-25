import { countWords, papers, rubricVersion, tasks } from './practice.mjs';
import { setupLearningTools, updateMetrics } from './learning.mjs';
import { setupWorkshop } from './workshop.mjs';

const get = id => document.getElementById(id);
const select = get('task');
const editor = get('response');
const feedback = get('feedback');
const status = get('mark-status');
const storage = get('storage');
const prefix = 'fresh-english-0500:';
const session = new Map();
let task;
let worker;
let timeout;
let remaining;
let deadline;
let interval;

function read(key) {
  try { return localStorage.getItem(prefix + key) ?? session.get(key); }
  catch { return session.get(key); }
}

function write(key, value, messageTarget = storage) {
  session.set(key, value);
  try {
    localStorage.setItem(prefix + key, value);
    if (messageTarget) messageTarget.textContent = 'Saved on this device';
  } catch {
    if (messageTarget) messageTarget.textContent = 'Storage unavailable. Changes last for this session.';
  }
}

for (const paper of papers) {
  const group = document.createElement('optgroup');
  group.label = paper.title;
  for (const exercise of tasks.filter(item => item.paper === paper.id)) {
    group.append(new Option(exercise.number + ' · ' + exercise.title, exercise.id));
  }
  select.append(group);
}

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
  get('completion').textContent = total + ' of ' + tasks.length + ' tasks reviewed';
}

function stopTimer() {
  clearInterval(interval);
  deadline = undefined;
  get('timer-toggle').textContent = 'Start timer';
}

function updateClock() {
  if (deadline) remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
  const minutes = Math.floor(remaining / 60);
  const seconds = String(remaining % 60).padStart(2, '0');
  get('timer').textContent = remaining ? minutes + ':' + seconds : 'Time’s up';
  get('timer-toggle').disabled = !remaining;
  if (!remaining) stopTimer();
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
  feedback.replaceChildren();
  status.textContent = '';
}

function showTask() {
  task = tasks.find(item => item.id === select.value) ?? tasks[0];
  get('task-title').textContent = task.title;
  get('task-meta').textContent = (task.paper === 'p1' ? 'Paper 1' : 'Paper 2') + ' · Question ' + task.number + ' · ' + task.marks + ' practice marks';
  get('prompt').textContent = task.prompt;
  get('task-objectives').textContent = 'Assessment objectives · ' + task.objectives.join(', ');
  get('rubric-version').textContent = rubricVersion;
  get('specimen-scheme').href = papers.find(paper => paper.id === task.paper).markScheme;
  get('source-panel').hidden = !task.source;
  get('source').textContent = task.source ?? '';
  editor.value = read('draft:' + task.id) ?? '';
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
}

select.addEventListener('change', showTask);
get('analysis').addEventListener('toggle', () => {
  if (get('analysis').open) updateMetrics(get('metrics'), editor.value);
});
editor.addEventListener('input', () => {
  write('draft:' + task.id, editor.value);
  updateWords();
  if (!get('mark').disabled) {
    feedback.replaceChildren();
    status.textContent = '';
  }
});
get('reviewed').addEventListener('click', () => {
  write('review:' + task.id, read('review:' + task.id) === '1' ? '0' : '1');
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

get('mark').addEventListener('click', () => {
  const answer = editor.value.trim();
  if (!answer) {
    status.textContent = 'Write a response before requesting feedback.';
    editor.focus();
    return;
  }
  if (!navigator.gpu) {
    status.textContent = 'WebGPU is unavailable in this browser. The self-marking guide is available below.';
    return;
  }
  const button = get('mark');
  button.disabled = true;
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

const initialTask = new URLSearchParams(location.search).get('task');
if (tasks.some(item => item.id === initialTask)) select.value = initialTask;
showTask();
setupLearningTools({ read, write, currentTask: () => task });
setupWorkshop(read, write);

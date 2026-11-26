import { chooseDifferent, groupedQuestions, setupClearWriting, setupNewQuestion } from './question-controls.mjs?v=question-bank';
import { countWords, tasks } from './practice.mjs?v=question-bank';
import { labPassages, notebookExercises } from './tool-questions.mjs?v=question-bank';

const objectives = [
  ['R1','Understand explicit meanings','comprehension'],
  ['R2','Infer meanings and attitudes','attitude'],
  ['R3','Analyse, evaluate and develop ideas with support','evaluation'],
  ['R4','Explain writers’ effects','language'],
  ['R5','Select relevant information for a purpose','summary'],
  ['W1','Express experiences, feelings and ideas','narrative'],
  ['W2','Organise writing for deliberate effect','descriptive'],
  ['W3','Choose suitable vocabulary and sentence structures','extended'],
  ['W4','Adapt language to purpose and audience','directed'],
  ['W5','Use accurate spelling, punctuation and grammar','narrative'],
];

const get = id => document.getElementById(id);
const element = (tag, text) => {
  const node = document.createElement(tag);
  node.textContent = text;
  return node;
};

function action(text, callback) {
  const button = element('button', text);
  button.type = 'button';
  button.addEventListener('click', callback);
  return button;
}

export function analyseDraft(value) {
  const sentences = typeof Intl.Segmenter === 'function'
    ? [...new Intl.Segmenter('en', { granularity:'sentence' }).segment(value)].map(item => item.segment)
    : value.split(/[.!?]+/);
  const lengths = sentences.map(countWords).filter(Boolean);
  const tokens = value.toLowerCase().replaceAll('’', "'").match(/[\p{L}\p{N}]+(?:['-][\p{L}\p{N}]+)*/gu) ?? [];
  const counts = new Map();
  for (const token of tokens) counts.set(token, (counts.get(token) ?? 0) + 1);
  return {
    words: tokens.length,
    sentences: lengths.length,
    average: lengths.length ? tokens.length / lengths.length : 0,
    distribution: [lengths.filter(n => n <= 10).length, lengths.filter(n => n > 10 && n <= 20).length, lengths.filter(n => n > 20).length],
    distinct: counts.size,
    repeated: [...counts].filter(([word, n]) => word.length >= 4 && n > 1).sort((a,b) => b[1] - a[1]).slice(0,5),
  };
}

export function updateMetrics(container, value) {
  const result = analyseDraft(value);
  if (!result.words) {
    container.replaceChildren(element('p','Write a draft to see its sentence and vocabulary patterns.'));
    return;
  }
  const [short, medium, long] = result.distribution;
  container.replaceChildren(
    element('p', result.words + ' words · ' + result.sentences + ' sentences · ' + result.average.toFixed(1) + ' words per sentence'),
    element('p', 'Sentence lengths · ' + short + ' up to 10 words, ' + medium + ' at 11–20 words, ' + long + ' over 20 words'),
    element('p', result.distinct + ' distinct words after ignoring case · ' + Math.round(result.distinct / result.words * 100) + '% of total words'),
    element('p', result.repeated.length ? 'Repeated words of four or more letters · ' + result.repeated.map(([word,n]) => word + ' (' + n + ')').join(', ') : 'No repeated words of four or more letters.'),
  );
}

function storedRecords(read, key) {
  try {
    const data = JSON.parse(read(key) ?? '[]');
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function setupReadingLab(read, write) {
  const originals = [
    ['comprehension', 'The harbour repair workshop'],
    ['summary', 'The station library'],
    ['short-language', 'The river crossing'],
    ['evaluation', 'The evening market debate'],
  ].map(([id, title]) => ({ id, title, source:tasks.find(task => task.id === id).source }));
  const collection = new Map([...originals, ...labPassages].map(item => [item.id, item]));
  const selector = get('lab-passage');
  selector.append(...Array.from(collection.values(), item => new Option(item.title, item.id)));
  const questions = get('lab-questions');
  const questionPool = labPassages.flatMap(item => item.questions.map((_, index) => ({ passage:item.id, index })));
  let currentQuestion;
  let currentPassage = selector.value;

  function showQuestions() {
    const prompts = collection.get(selector.value).questions ?? [];
    const list = document.createElement('ol');
    for (const [index, [question, answer]] of prompts.entries()) {
      const item = document.createElement('li');
      const example = document.createElement('details');
      example.append(element('summary', 'Show example answer'), element('p', answer));
      const prompt = element('p', question);
      if (currentQuestion?.index === index && currentQuestion.passage === selector.value) {
        prompt.tabIndex = -1;
        prompt.className = 'lab-current-question';
      }
      item.append(prompt, example);
      list.append(item);
    }
    questions.replaceChildren(element('h3', 'Passage questions'), list);
    questions.hidden = !prompts.length;
    list.querySelectorAll('details').forEach((example, index) => {
      window.FreshPoints?.mountReview?.(example, 'First Language English', 'reading-lab:' + selector.value + ':' + index);
    });
  }

  const paragraph = get('annotation-paragraph');
  const quote = get('annotation-quote');
  const note = get('annotation-note');
  const status = get('annotation-status');
  const list = get('annotations');
  const passage = get('lab-text');
  const form = get('annotation-form');
  const cancel = get('annotation-cancel');
  let records = storedRecords(read,'annotations');
  let editing;

  function paragraphs() {
    return collection.get(selector.value).source.split(/\n\s*\n/);
  }

  function reset() {
    editing = undefined;
    quote.value = '';
    note.value = '';
    cancel.hidden = true;
  }

  function render() {
    const relevant = records.filter(item => item.passage === selector.value);
    const lines = paragraphs();
    const selected = paragraph.value;
    paragraph.replaceChildren(...lines.map((_, index) => new Option('Paragraph ' + (index + 1),index)));
    if (lines[selected]) paragraph.value = selected;
    passage.replaceChildren(...lines.map((line,index) => {
      const row = document.createElement('li');
      const spans = relevant.filter(item => item.paragraph === index).map(item => {
        const start = line.indexOf(item.quote);
        return [start, start + item.quote.length];
      }).filter(([start]) => start >= 0).sort(([a],[b]) => a - b);
      let cursor = 0;
      for (const [start,end] of spans) {
        if (end <= cursor) continue;
        if (start > cursor) row.append(line.slice(cursor,start));
        row.append(element('mark',line.slice(Math.max(start,cursor),end)));
        cursor = end;
      }
      row.append(line.slice(cursor));
      return row;
    }));
    list.replaceChildren(...relevant.map(item => {
      const row = document.createElement('li');
      const buttons = document.createElement('div');
      buttons.className = 'actions';
      buttons.append(action('Edit annotation', () => {
        editing = item.id;
        paragraph.value = item.paragraph;
        quote.value = item.quote;
        note.value = item.note;
        cancel.hidden = false;
        quote.focus();
      }), action('Delete annotation', () => {
        records = records.filter(record => record.id !== item.id);
        if (editing === item.id) reset();
        write('annotations',JSON.stringify(records),status);
        render();
      }));
      row.append(element('strong',item.quote),element('p',item.note),buttons);
      return row;
    }));
  }

  document.addEventListener('selectionchange', () => {
    const selection = document.getSelection();
    const anchor = selection?.anchorNode;
    const focus = selection?.focusNode;
    if (!anchor || !focus) return;
    const row = (anchor.parentElement)?.closest('li');
    const selected = selection.toString().trim();
    if (editing === undefined && row?.parentElement === passage && row.contains(focus) && selected && selected.length <= 200) {
      paragraph.value = Array.from(passage.children).indexOf(row);
      quote.value = selected;
    }
  });
  function changePassage(id) {
    selector.value = currentPassage;
    if (id === currentPassage) return true;
    if ((quote.value || note.value) && !window.confirm('Switch passages and discard this unsaved annotation?')) return false;
    selector.value = id;
    currentPassage = id;
    reset();
    status.textContent = '';
    render();
    return true;
  }

  selector.addEventListener('change', () => {
    if (!changePassage(selector.value)) return;
    currentQuestion = undefined;
    showQuestions();
  });
  get('lab-new-question').addEventListener('click', () => {
    const next = chooseDifferent(questionPool, currentQuestion);
    if (!next || !changePassage(next.passage)) return;
    currentQuestion = next;
    showQuestions();
    questions.querySelector('.lab-current-question').focus();
  });
  setupClearWriting(get('lab-clear'), [quote, note]);
  cancel.addEventListener('click', reset);
  form.addEventListener('submit', event => {
    event.preventDefault();
    const index = Number(paragraph.value);
    const text = quote.value.trim();
    if (!text || !note.value.trim() || !paragraphs()[index]?.includes(text)) {
      status.textContent = 'Enter a phrase exactly as it appears in the selected paragraph, then add your note.';
      return;
    }
    const record = { id:editing ?? crypto.randomUUID(), passage:selector.value, paragraph:index, quote:text, note:note.value.trim() };
    records = [...records.filter(item => item.id !== record.id),record];
    write('annotations',JSON.stringify(records),status);
    reset();
    render();
  });
  render();
  showQuestions();
}

export function setupNotebook(read, write, taskId) {
  const select = get('mistake-skill');
  const excerpt = get('mistake-excerpt');
  const next = get('mistake-next');
  const status = get('notebook-status');
  let records = storedRecords(read,'mistakes');
  select.append(...objectives.map(([id,title]) => new Option(id + ' · ' + title,id)));

  const questions = get('notebook-question');
  groupedQuestions(questions, notebookExercises, (item, index) => [item.group ?? 'Core exercises', index, item.title]);

  function showQuestion() {
    const item = notebookExercises[questions.value];
    get('notebook-example-excerpt').textContent = item.excerpt;
    get('notebook-question-text').textContent = item.question;
    const source = get('notebook-question-source');
    source.textContent = item.context ?? '';
    source.hidden = !item.context;
    get('notebook-example-text').textContent = item.example;
    get('notebook-example').open = false;
  }

  questions.addEventListener('change', showQuestion);
  setupNewQuestion(get('notebook-new-question'), questions);
  setupClearWriting(get('notebook-clear'), [excerpt, next]);
  const useExcerpt = get('notebook-use-excerpt');
  function updateExcerptButton() {
    useExcerpt.disabled = Boolean(excerpt.value.trim() || next.value.trim());
  }
  excerpt.addEventListener('input', updateExcerptButton);
  next.addEventListener('input', updateExcerptButton);
  useExcerpt.addEventListener('click', () => {
    const item = notebookExercises[questions.value];
    select.value = item.skill;
    excerpt.value = item.excerpt;
    updateExcerptButton();
    next.focus();
  });
  showQuestion();
  updateExcerptButton();
  get('notebook-exercises').hidden = false;

  function save() {
    write('mistakes',JSON.stringify(records),status);
    render();
  }

  const filter = get('notebook-filter');
  filter.addEventListener('change', render);

  function render() {
    const visible = records.filter(item => filter.value === 'all' || item.resolved === (filter.value === 'resolved'));
    get('notebook-count').textContent = visible.length + (visible.length === 1 ? ' note' : ' notes');
    get('mistakes').replaceChildren(...(visible.length ? visible.map(item => {
      const row = document.createElement('li');
      const objective = objectives.find(([id]) => id === item.skill);
      const task = tasks.find(entry => entry.id === item.task);
      const link = element('a','Practise this skill');
      link.href = 'english-language.html?task=' + encodeURIComponent(objective[2]) + '#practice';
      const buttons = document.createElement('div');
      buttons.className = 'actions';
      buttons.append(action(item.resolved ? 'Reopen note' : 'Mark as resolved', () => {
        item.resolved = !item.resolved;
        save();
        filter.focus();
      }), action('Delete note', () => {
        records = records.filter(record => record.id !== item.id);
        save();
        filter.focus();
      }));
      const state = element('span',item.resolved ? 'Resolved' : 'To revise');
      state.className = 'journal-state';
      state.dataset.resolved = String(item.resolved);
      const header = document.createElement('div');
      header.className = 'journal-card-heading';
      header.append(element('h3',objective[1]),state);
      const original = document.createElement('blockquote');
      original.textContent = item.excerpt;
      const comparison = document.createElement('div');
      comparison.className = 'journal-comparison';
      for (const [label, text] of [['Original excerpt', original], ['What I’ll change', element('p',item.next)]]) {
        const column = document.createElement('div');
        column.append(element('strong',label),text);
        comparison.append(column);
      }
      const taskContext = element('p','Practice task when saved · ' + task.title);
      taskContext.className = 'note';
      row.append(header,comparison,taskContext,link,buttons);
      return row;
    }) : [element('li',filter.value === 'all' ? 'Saved notes will appear here.' : 'No notes match this filter.')]));
  }

  get('notebook-form').addEventListener('submit', event => {
    event.preventDefault();
    if (!excerpt.value.trim() || !next.value.trim()) {
      status.textContent = 'Enter an excerpt and a revision step.';
      return;
    }
    records.unshift({ id:crypto.randomUUID(), skill:select.value, excerpt:excerpt.value.trim(), next:next.value.trim(), task:taskId, resolved:false });
    excerpt.value = '';
    next.value = '';
    updateExcerptButton();
    save();
  });
  render();
}

export function setupTheme(read, write) {
  const theme = get('theme');
  function setTheme(dark) {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    theme.setAttribute('aria-pressed',String(dark));
    theme.textContent = dark ? 'Light mode' : 'Dark mode';
  }
  setTheme((read('theme') ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark');
  theme.addEventListener('click', () => {
    const dark = theme.getAttribute('aria-pressed') !== 'true';
    setTheme(dark);
    write('theme',dark ? 'dark' : 'light',null);
  });
}

export function setupStudyDisplay(read, write) {
  for (const [id,attribute] of [
    ['study-size','studySize'], ['study-font','studyFont'], ['study-spacing','studySpacing'],
  ]) {
    const select = get(id);
    const saved = read(id);
    if (!select) {
      if (saved) document.documentElement.dataset[attribute] = saved;
      continue;
    }
    if ([...select.options].some(option => option.value === saved)) select.value = saved;
    document.documentElement.dataset[attribute] = select.value;
    select.addEventListener('change', () => {
      document.documentElement.dataset[attribute] = select.value;
      write(id,select.value,null);
    });
  }
}

export function setupLearningTools({ read, write }) {
  setupTheme(read, write);
  setupStudyDisplay(read, write);

  for (const [id,title,exercise] of objectives) {
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.id = 'objective-' + id;
    box.checked = read(box.id) === '1';
    box.addEventListener('change', () => write(box.id,box.checked ? '1' : '0',null));
    const label = element('label',id + ' · ' + title);
    label.htmlFor = box.id;
    const link = element('a','Practise');
    link.href = '?task=' + encodeURIComponent(exercise) + '#practice';
    link.setAttribute('aria-label','Practise ' + title.toLowerCase());
    const row = document.createElement('div');
    row.append(box,label,link);
    get('objectives').append(row);
  }
}

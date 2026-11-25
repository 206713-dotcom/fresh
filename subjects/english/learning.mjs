import { countWords, tasks } from './practice.mjs';

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

function setupReadingLab(read, write) {
  const collection = new Map();
  for (const task of tasks) {
    if (task.source && ![...collection.values()].some(item => item.source === task.source)) collection.set(task.id, task);
  }
  const names = ['The harbour repair workshop','The station library','The river crossing','The evening market debate'];
  const selector = get('lab-passage');
  [...collection.keys()].forEach((id,index) => selector.append(new Option(names[index],id)));
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

  passage.addEventListener('pointerup', () => {
    const selection = document.getSelection();
    const anchor = selection?.anchorNode;
    const focus = selection?.focusNode;
    if (!anchor || !focus) return;
    const row = (anchor.parentElement)?.closest('li');
    const selected = selection.toString().trim();
    if (row?.parentElement === passage && row.contains(focus) && selected && selected.length <= 200) {
      paragraph.value = Array.from(passage.children).indexOf(row);
      quote.value = selected;
    }
  });
  selector.addEventListener('change', () => {
    reset();
    status.textContent = '';
    render();
  });
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
}

function setupNotebook(read, write, currentTask) {
  const select = get('mistake-skill');
  const excerpt = get('mistake-excerpt');
  const next = get('mistake-next');
  const status = get('notebook-status');
  let records = storedRecords(read,'mistakes');
  select.append(...objectives.map(([id,title]) => new Option(id + ' · ' + title,id)));

  function save() {
    write('mistakes',JSON.stringify(records),status);
    render();
  }

  function render() {
    get('mistakes').replaceChildren(...(records.length ? records.map(item => {
      const row = document.createElement('li');
      const objective = objectives.find(([id]) => id === item.skill);
      const task = tasks.find(entry => entry.id === item.task);
      const link = element('a','Practise this skill');
      link.href = '?task=' + encodeURIComponent(objective[2]) + '#practice';
      const buttons = document.createElement('div');
      buttons.className = 'actions';
      buttons.append(action(item.resolved ? 'Reopen note' : 'Mark as resolved', () => {
        item.resolved = !item.resolved;
        save();
      }), action('Delete note', () => {
        records = records.filter(record => record.id !== item.id);
        save();
      }));
      row.append(element('strong',item.skill + (item.resolved ? ' · Resolved' : ' · To revise')),element('p',item.excerpt),element('p',item.next),element('p','Practice task when saved · ' + task.title),link,buttons);
      return row;
    }) : [element('li','Saved notes will appear here.')]));
  }

  get('notebook-form').addEventListener('submit', event => {
    event.preventDefault();
    if (!excerpt.value.trim() || !next.value.trim()) {
      status.textContent = 'Enter an excerpt and a revision step.';
      return;
    }
    records.unshift({ id:crypto.randomUUID(), skill:select.value, excerpt:excerpt.value.trim(), next:next.value.trim(), task:currentTask().id, resolved:false });
    excerpt.value = '';
    next.value = '';
    save();
  });
  render();
}

export function setupLearningTools({ read, write, currentTask }) {
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

  setupReadingLab(read,write);
  setupNotebook(read,write,currentTask);
}

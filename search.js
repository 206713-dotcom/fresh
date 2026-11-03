const filters = document.querySelector('.filters');
const search = document.querySelector('#search');
const group = document.querySelector('#group');
const count = document.querySelector('#count');
const empty = document.querySelector('#empty');
const cards = [...document.querySelectorAll('.card')].map(element => ({
  element,
  name: element.querySelector('h3').textContent.toLowerCase(),
  code: element.querySelector('.code').textContent,
}));

function filterSubjects() {
  const query = search.value.trim().toLowerCase();
  let visible = 0;
  for (const { element, name, code } of cards) {
    const matchesGroup = !group.value || element.dataset.group === group.value;
    const matchesSearch = name.includes(query) || code.includes(query)
      || (element.dataset.group === 'technology' && code === '0417' && 'ict'.includes(query));
    element.hidden = !(matchesGroup && matchesSearch);
    if (!element.hidden) visible += 1;
  }
  count.textContent = visible === 1 ? '1 subject' : `${visible} subjects`;
  empty.hidden = visible > 0;
}

search.addEventListener('input', filterSubjects);
group.addEventListener('change', filterSubjects);
filters.hidden = false;
filterSubjects();

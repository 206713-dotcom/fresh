document.addEventListener('DOMContentLoaded', () => {
  const dialog = document.querySelector('#topic-search');
  const openButton = document.querySelector('#topic-search-open');
  const input = document.querySelector('#topic-search-input');
  const status = document.querySelector('#topic-search-status');
  const results = document.querySelector('#topic-search-results');
  const popular = ['1.3', '2.2', '2.6', '4.7', '6.3'];
  const topics = officialSyllabusChapters.flatMap(chapter => chapter.topics.map(topic => {
    const notes = syllabusTopicLessons(topic.code);
    const terms = notes.flatMap(lesson => [lesson.title, syllabusNotes[lesson.id].title, ...syllabusNotes[lesson.id].codes]);
    return { ...topic, notes, searchText: [topic.code, topic.title, ...terms].join(' ').toLowerCase() };
  }));

  function updateResults() {
    const query = input.value.toLowerCase().trim();
    const words = query.split(/\s+/);
    const matches = query
      ? topics.filter(topic => words.every(word => topic.searchText.includes(word)))
        .sort((a, b) => Number(b.title.toLowerCase().startsWith(query)) - Number(a.title.toLowerCase().startsWith(query)))
      : topics.filter(topic => popular.includes(topic.code));
    status.textContent = !query ? 'Common topics' : !matches.length ? 'No topics found. Try a concept or syllabus code.'
      : matches.length > 8 ? 'Showing 8 of ' + matches.length + ' topics. Keep typing to narrow your search.'
      : matches.length + (matches.length === 1 ? ' topic found' : ' topics found');
    results.innerHTML = matches.slice(0, 8).map(topic => {
      const lesson = topic.notes.find(item => syllabusNotes[item.id].codes.includes(query) || item.title.toLowerCase().includes(query)) ?? topic.notes[0];
      const notes = lesson ? link('Notes', '#lesson/' + lesson.id) : link('Quick recap', '#revision-topics/' + topic.code);
      const cards = lesson && flashcardDecks[lesson.id] ? link('Flashcards', '#lesson/' + lesson.id + '/cards') : '';
      return `<li>
        <div class="topic-result-title"><span>${topic.code}</span><strong>${escapeHtml(topic.title)}</strong></div>
        <div class="topic-result-links">${notes}${cards}${link('Practice', '#practice/topic/' + topic.code)}${link('Checklist', '#revision-checklist/' + topic.code)}</div>
      </li>`;
    }).join('');
  }

  function openSearch() {
    dialog.showModal();
    input.select();
  }

  openButton.onclick = openSearch;
  input.oninput = updateResults;
  input.onkeydown = event => {
    if (event.key !== 'Enter' || !input.value.trim()) return;
    event.preventDefault();
    results.querySelector('a')?.click();
  };
  results.onclick = event => {
    if (event.target.closest('a')) dialog.close();
  };
  document.addEventListener('keydown', event => {
    if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey || event.isComposing || dialog.open ||
        event.defaultPrevented || event.target.closest('input, textarea, select, button, [contenteditable]')) return;
    event.preventDefault();
    openButton.focus({ preventScroll: true });
    openSearch();
  });
  updateResults();
}, { once: true });

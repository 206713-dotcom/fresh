function economicsProgress() {
  const saved = readPracticeAnswers();
  const attempts = questions.filter(question => typeof saved[question.id]?.answer === 'string' && saved[question.id].answer.trim());
  const checked = checklistProgress();
  const taskCount = checklistOutcomes.length * checklistColumns.length;
  const complete = checklistOutcomes.reduce((count, [code]) => count + checklistColumns.filter((_, column) => checked.has(code + ':' + column)).length, 0);
  const decks = lessons.flatMap(lesson => {
    try {
      const value = localStorage.getItem('ecbiz-economics-flashcard-' + lesson.id);
      const position = Number(value);
      const cards = flashcardDecks[lesson.id];
      return value !== null && cards && Number.isInteger(position) && position >= 0 && position < cards.length
        ? [{ ...lesson, position, total: cards.length }] : [];
    } catch { return []; }
  });
  const stats = [
    [attempts.length, 'Questions started', 'Review saved answers', 'progress-answers'],
    [Math.round(1000 * complete / taskCount) / 10 + '%', 'Checklist tasks complete', complete + ' of ' + taskCount + ' tasks', 'progress-checklist'],
    [decks.length, 'Flashcard decks opened', 'Continue a saved deck', 'progress-flashcards'],
  ];
  return `
    <header class="progress-heading">
      <div><h1>My progress</h1><p>Saved in this browser. Clearing site data removes it.</p></div>
      <div><button type="button" class="primary" data-export-economics>Export progress CSV</button><p id="revision-save-status" role="status"></p></div>
    </header>
    ${weakTopicsPanel()}
    <section class="progress-panel" id="progress-backup"><h2>Back up or restore progress</h2>
      <p>Transfer your mocks, saved answers, flashcards, checklist and game progress to another browser.</p>
      <div class="row"><button type="button" data-ecbiz-backup>Download backup</button>
      <label class="field">Choose an EcBiz backup<input type="file" data-ecbiz-backup-file accept=".json,application/json"></label>
      <button type="button" data-ecbiz-restore disabled>Restore selected backup</button></div>
      <p class="muted">Restore fills gaps in this browser, combines mock histories and keeps your highest game scores.</p>
      <p role="status"></p>
    </section>
    <section class="progress-panel study-next"><h2>What should I study next?</h2>
      <p>Recall a topic, review three flashcards and answer a fresh question.</p>
      <div class="row">${link('Start a 10-minute review','#revision-review','button primary')}
      ${link('Practise diagrams','#revision-diagrams')}${link('View mock history','#revision-history')}${link('Mock corrections','#revision-corrections')}</div>
    </section>
    <nav class="progress-shortcuts" aria-label="Progress sections">
      <button type="button" data-progress-target="progress-answers">Saved answers</button>
      <button type="button" data-progress-target="progress-checklist">Syllabus progress</button>
      <button type="button" data-progress-target="progress-flashcards">Flashcards</button>
    </nav>
    <div class="progress-stat-grid">
      ${stats.map(([number, title, detail, target]) => `<button type="button" class="progress-stat" data-progress-target="${target}">
        <span>${title}</span><strong>${number}</strong><small>${detail} <span aria-hidden="true">→</span></small>
      </button>`).join('')}
    </div>
    <section class="progress-panel" id="progress-answers" tabindex="-1" aria-labelledby="progress-answers-title">
      <div class="section-head"><h2 id="progress-answers-title">Saved answers</h2>${link('Continue practice →', '#practice', 'text-link')}</div>
      ${attempts.length ? `<div class="progress-answer-list">${attempts.map(question => `<a href="#practice/question/${escapeHtml(question.id)}">
        <span><small>${escapeHtml(question.topic)} · ${question.options ? 'Paper 1' : 'Paper 2'}</small><strong>${escapeHtml(question.q)}</strong></span>
        <span class="progress-answer-status">${saved[question.id].feedback ? 'Feedback saved' : 'Draft saved'} <span aria-hidden="true">→</span></span>
      </a>`).join('')}</div>` : '<p class="muted">Your answers will appear here when you start a practice question.</p>'}
    </section>
    <section class="progress-panel" id="progress-checklist" tabindex="-1" aria-labelledby="progress-checklist-title">
      <div class="section-head"><h2 id="progress-checklist-title">Syllabus progress</h2>${link('Open checklist →', '#revision-checklist', 'text-link')}</div>
      <div class="progress-chapters">${officialSyllabusChapters.map(chapter => {
        const items = checklistOutcomes.filter(([code]) => chapter.topics.some(topic => code.startsWith(topic.code + '.')));
        const done = items.reduce((count, [code]) => count + checklistColumns.filter((_, column) => checked.has(code + ':' + column)).length, 0);
        return `<a href="#revision-checklist/${chapter.topics[0].code}"><strong>${escapeHtml(chapter.title)}</strong>
          <span>${done} / ${items.length * checklistColumns.length} tasks</span>
          <progress value="${done}" max="${items.length * checklistColumns.length}" aria-label="${escapeHtml(chapter.title)} tasks complete"></progress>
        </a>`;
      }).join('')}</div>
    </section>
    <section class="progress-panel" id="progress-flashcards" tabindex="-1" aria-labelledby="progress-flashcards-title">
      <div class="section-head"><h2 id="progress-flashcards-title">Your flashcards</h2>${link('Browse decks →', '#flashcards', 'text-link')}</div>
      <p>${link('Start daily flashcard review','#flashcard-review')}</p>
      ${decks.length ? '<div class="progress-answer-list">' + decks.map(deck => `<a href="#lesson/${deck.id}/cards"><strong>${escapeHtml(deck.title)}</strong><span>Card ${deck.position + 1} of ${deck.total} →</span></a>`).join('') + '</div>' : '<p class="muted">Open a flashcard deck to save your place and continue it here.</p>'}
    </section>`;
}

document.addEventListener('click', event => {
  const button = event.target.closest('[data-progress-target]');
  if (!button) return;
  const section = document.getElementById(button.dataset.progressTarget);
  section.focus({ preventScroll: true });
  section.scrollIntoView({ block: 'start' });
});

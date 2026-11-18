import { downloadProgressCsv } from '../progress-csv.js';

document.addEventListener('click', event => {
  const button = event.target.closest('[data-export-economics]');
  if (!button) return;
  const status = document.querySelector('#revision-save-status');
  try {
    const rows = [];
    const checked = checklistProgress();
    for (const [code, wording] of checklistOutcomes) {
      checklistColumns.forEach((label, column) => {
        rows.push(['Syllabus checklist', code, checked.has(code + ':' + column) ? 'Complete' : 'To do', '', label + '\n' + wording, '']);
      });
    }
    const attempts = JSON.parse(localStorage.getItem('ecbiz-economics-practice-answers') || '{}');
    for (const question of questions) {
      const saved = attempts?.[question.id];
      if (typeof saved?.answer !== 'string') continue;
      const feedback = new DOMParser().parseFromString(saved.feedback || '', 'text/html').body.textContent;
      rows.push(['Exam practice', question.id, saved.feedback ? 'Reviewed' : 'In progress', saved.answer, question.q + '\n' + feedback, '']);
    }
    for (const lesson of lessons) {
      const position = localStorage.getItem('ecbiz-economics-flashcard-' + lesson.id);
      if (position !== null) rows.push(['Flashcards', lesson.id, 'Card ' + (Number(position) + 1), '', lesson.title, '']);
    }
    for (const key of Object.keys(localStorage).sort()) {
      if (key.startsWith('ecbiz-arcade-v1-') || key.startsWith('ecbiz-revision-')) {
        if (key === 'ecbiz-revision-' + checklistKey || key === 'ecbiz-revision-checklist-0455-2027') continue;
        rows.push(['Revision and games', key, 'Saved', '', localStorage.getItem(key), '']);
      }
    }
    downloadProgressCsv('Economics', rows);
    status.textContent = 'Progress CSV downloaded to this device.';
  } catch {
    status.textContent = 'This browser could not export your progress. Check whether site storage and downloads are available.';
  }
});

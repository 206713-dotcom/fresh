import test from 'node:test';
import assert from 'node:assert/strict';
import { countWords, papers, tasks } from '../subjects/english/practice.mjs';
import { validateFeedback } from '../subjects/english/marking.mjs';

test('every practice task has a unique ID, known paper and consistent mark allocation', () => {
  assert.equal(new Set(tasks.map(task => task.id)).size, tasks.length);
  for (const task of tasks) {
    assert.ok(papers.some(paper => paper.id === task.paper));
    assert.equal(task.criteria.reduce((sum, [, max]) => sum + max, 0), task.marks);
    assert.ok(task.timing > 0 && task.example && task.prompt);
  }
  assert.deepEqual(tasks.find(task => task.id === 'summary').target, [0, 120]);
  assert.deepEqual(tasks.filter(task => task.marks === 40).map(task => task.number), ['2', '3', '4', '5']);
});

test('word counts handle punctuation, contractions and blank drafts', () => {
  assert.equal(countWords(''), 0);
  assert.equal(countWords('“Don’t stop,” she said. Twenty-five!'), 5);
});

test('mark totals are computed from bounded marks with exact evidence', () => {
  const task = tasks.find(task => task.id === 'extended');
  const answer = 'Alma closed the footpath. The council was told.';
  const valid = {
    criteria: [
      { mark: 2, evidence: 'Alma closed the footpath', comment: 'One relevant action.' },
      { mark: 3, evidence: 'The council was told.', comment: 'The expression is straightforward.' },
    ],
    nextStep: 'Develop the risks behind the actions.',
  };
  assert.equal(validateFeedback(valid, task, answer).total, 5);
  for (const invalid of [{ mark: 11 }, { mark: 2.5 }, { evidence: 'Invented quotation' }, { evidence: '' }]) {
    assert.throws(() => validateFeedback({
      ...valid,
      criteria: [{ ...valid.criteria[0], ...invalid }, valid.criteria[1]],
    }, task, answer));
  }
  assert.throws(() => validateFeedback({ ...valid, criteria: [] }, task, answer));
  assert.throws(() => validateFeedback({ ...valid, nextStep: '' }, task, answer));
});

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
  assert.deepEqual(tasks.filter(task => task.marks === 40 && !task.group).map(task => task.number), ['2', '3', '4', '5']);
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

test('draft analysis counts sentences, length bands and case-insensitive repetitions', async () => {
  const { analyseDraft } = await import('../subjects/english/learning.mjs');
  const result = analyseDraft('River water rose. The river moved.');
  assert.deepEqual(result, {
    words: 6, sentences: 2, average: 3, distribution: [2, 0, 0], distinct: 5, repeated: [['river', 2]],
  });
  assert.equal(analyseDraft(' ').sentences, 0);
});

test('exam attempts recover a valid task and preserve an absolute deadline', async () => {
  const { readAttempt, timeRemaining } = await import('../subjects/english/exam.mjs');
  const saved = { task: tasks[0].id, answer: 'An answer.', endsAt: 2000, submittedAt: null };
  assert.deepEqual(readAttempt(JSON.stringify(saved), tasks), saved);
  assert.equal(readAttempt('{invalid', tasks), null);
  assert.equal(readAttempt(JSON.stringify({ ...saved, task: 'missing' }), tasks), null);
  assert.equal(timeRemaining(saved.endsAt, 1100), 1);
  assert.equal(timeRemaining(saved.endsAt, 2100), 0);
});

test('evaluation reports error and agreement while rejecting leaked passage groups', async () => {
  const { evaluateMarking } = await import('../scripts/evaluate-english-0500.mjs');
  const { rubricVersion } = await import('../subjects/english/practice.mjs');
  const input = {
    rubricVersion, markerVersion:'test model', calibrationGroups:['training'],
    cases:[
      { id:'a', task:'comprehension', passageGroup:'test A', reference:'fixture A', human:[4], model:[2], repeat:[2] },
      { id:'b', task:'comprehension', passageGroup:'test B', reference:'fixture B', human:[3], model:[3], repeat:[4] },
    ],
  };
  assert.deepEqual(evaluateMarking(input).tasks.comprehension, {
    cases:2, passageGroups:2, exact:1, withinOne:1, withinTwo:2,
    meanAbsoluteError:1, meanSignedError:-1, repeatCases:2, repeatExact:1,
  });
  assert.throws(() => evaluateMarking({ ...input, calibrationGroups:['test A'] }), /held-out/);
  assert.throws(() => evaluateMarking({ ...input, cases:[{ ...input.cases[0], model:[5] }] }), /criterion marks/);
});

test('the expanded bank has 400 questions per workspace and valid timed-task links', async () => {
  const { extraLabPassages, extraNotebookExercises, extraWorkshopCases, extraDeskTasks } =
    await import('../subjects/english/expanded-bank.mjs');
  assert.equal(extraLabPassages.reduce((count, item) => count + item.questions.length, 0), 400);
  const timedIds = new Set(extraDeskTasks.map(task => task.id));
  assert.equal(timedIds.size, 400);
  assert.equal(extraNotebookExercises.length, 400);
  assert.equal(new Set(extraWorkshopCases.map(item => item.id)).size, 400);
  assert.ok(extraWorkshopCases.every(item => timedIds.has(item.task) && item.source && item.versions.length === 3));
  assert.ok(extraLabPassages.every(item => item.source && item.questions.every(([question, answer]) => question && answer)));
  assert.ok(extraNotebookExercises.every(item => item.question && item.context && item.example));
});

import {courseLessons, courseUnit, courseUnits} from './curriculum.js';

// Bayesian knowledge tracing with fixed teaching priors, guess and slip rates.
function observe(mastered, correct) {
  const know = mastered * (correct ? 0.87 : 0.13);
  const learning = (1 - mastered) * (correct ? 0.25 : 0.75);
  return know / (know + learning);
}

export function estimate(lesson, report, practice) {
  let p = lesson.tier === 'additional' ? 0.42 : 0.52;
  const result = report?.results[lesson.id];
  if (typeof result === 'boolean') p = observe(p, result);
  for (const item of practice[lesson.id]?.questions ?? []) {
    if (!item) continue;
    p = observe(p, item.firstCorrect);
    if (item.solved) p += (1 - p) * (item.firstCorrect ? 0.12 : 0.28);
  }
  return p;
}

export function buildPlan(course, report, practice) {
  const lessons = courseLessons(course);
  const estimates = new Map(lessons.map(lesson => [lesson.id, estimate(lesson, report, practice)]));
  const lessonMap = new Map(lessons.map(lesson => [lesson.id, lesson]));
  const dependencyCount = new Map();
  for (const lesson of lessons) {
    for (const id of lesson.requires) dependencyCount.set(id, (dependencyCount.get(id) ?? 0) + 1);
  }
  const topics = courseUnits(course).map(id => {
    const members = lessons.filter(lesson => courseUnit(course,lesson) === id);
    return {
      id,
      score:members.filter(lesson => report?.results[lesson.id] === true).length,
      answered:members.filter(lesson => typeof report?.results[lesson.id] === 'boolean').length,
      total:members.length
    };
  });
  const weak = new Set(topics.filter(topic => topic.answered && topic.score / topic.answered < 0.6).map(topic => topic.id));
  const priority = lesson => (1 - estimates.get(lesson.id)) +
    Math.min(dependencyCount.get(lesson.id) ?? 0, 5) * 0.024 +
    (weak.has(courseUnit(course,lesson)) ? 0.08 : 0);
  const ranked = lessons.filter(lesson => !practice[lesson.id]?.complete)
    .sort((a,b) => priority(b) - priority(a));
  const steps = [];
  const scheduled = new Set();

  function visit(lesson, supports) {
    if (scheduled.has(lesson.id) || practice[lesson.id]?.complete) return;
    scheduled.add(lesson.id);
    for (const id of lesson.requires) {
      if (estimates.has(id) && estimates.get(id) < 0.66) visit(lessonMap.get(id), lesson);
    }
    const result = report?.results[lesson.id];
    let reason = 'Build fluency with a worked example and ' + lesson.practice.length + ' practice questions.';
    if (result === false) reason = 'You missed this skill on the level test.';
    if (result === null) reason = 'You skipped this skill. Try it with a worked example.';
    if (result === true) reason = 'You answered this correctly. Practise to make it stick.';
    if (supports) reason += ' This prepares you for ' + supports.title.toLowerCase() + '.';
    steps.push({lesson, reason, mastery:estimates.get(lesson.id), supports:supports?.id});
  }

  for (const lesson of ranked) visit(lesson);
  return {steps, topics};
}

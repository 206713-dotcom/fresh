import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { rubricVersion, tasks } from '../subjects/english/practice.mjs';

export function evaluateMarking(data) {
  if (data?.rubricVersion !== rubricVersion || typeof data?.markerVersion !== 'string' ||
      !data.markerVersion.trim() || !Array.isArray(data?.cases) || !data.cases.length) {
    throw new Error('Supply the current rubric version, a marker version and at least one scored case.');
  }
  if (!Array.isArray(data.calibrationGroups) ||
      data.calibrationGroups.some(group => typeof group !== 'string' || !group.trim())) {
    throw new Error('List calibration passage groups, using an empty array for a rubric-only baseline.');
  }
  const groups = new Set(data.calibrationGroups);
  const ids = new Set();
  const byTask = new Map();
  for (const item of data.cases) {
    const task = tasks.find(entry => entry.id === item?.task);
    if (!task || typeof item.id !== 'string' || !item.id.trim() || ids.has(item.id) ||
        typeof item.passageGroup !== 'string' || !item.passageGroup.trim() || groups.has(item.passageGroup) ||
        typeof item.reference !== 'string' || !item.reference.trim()) {
      throw new Error('Each case needs a known task, unique ID, reference and held-out passage group.');
    }
    ids.add(item.id);
    for (const [label,marks] of Object.entries({ human:item.human, model:item.model, repeat:item.repeat })) {
      if (label === 'repeat' && marks === undefined) continue;
      if (!Array.isArray(marks) || marks.length !== task.criteria.length ||
          marks.some((mark,index) => !Number.isInteger(mark) || mark < 0 || mark > task.criteria[index][1])) {
        throw new Error('Invalid ' + label + ' criterion marks in ' + item.id + '.');
      }
    }
    const rows = byTask.get(task.id) ?? [];
    rows.push(item);
    byTask.set(task.id, rows);
  }
  const total = marks => marks.reduce((sum,mark) => sum + mark, 0);
  return {
    markerVersion: data.markerVersion,
    rubricVersion,
    tasks: Object.fromEntries([...byTask].map(([task,rows]) => {
      const errors = rows.map(row => total(row.model) - total(row.human));
      const repeats = rows.filter(row => row.repeat);
      return [task,{
        cases:rows.length,
        passageGroups:new Set(rows.map(row => row.passageGroup)).size,
        exact:errors.filter(error => error === 0).length,
        withinOne:errors.filter(error => Math.abs(error) <= 1).length,
        withinTwo:errors.filter(error => Math.abs(error) <= 2).length,
        meanAbsoluteError:errors.reduce((sum,error) => sum + Math.abs(error), 0) / rows.length,
        meanSignedError:errors.reduce((sum,error) => sum + error, 0) / rows.length,
        repeatCases:repeats.length,
        repeatExact:repeats.filter(row => row.model.every((mark,index) => mark === row.repeat[index])).length,
      }];
    })),
  };
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  try {
    if (!process.argv[2]) throw new Error('Usage: node scripts/evaluate-english-0500.mjs <private-results.json>');
    console.log(JSON.stringify(evaluateMarking(JSON.parse(await readFile(process.argv[2],'utf8'))),null,2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

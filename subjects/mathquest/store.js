import {ASSESSMENT_VERSION, COURSES, LESSONS, assessmentItems, questionByKey, courseUnits} from './curriculum.js';
import {itemById, SLOTS} from './game-items.js';
import {emptyWallet} from './rewards.js';
import {MAX_PYCOINS} from './shared/gear-crates.js';

export const KEY = 'mathquest.igcse.v1';
const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const int = (value,max) => Number.isSafeInteger(value) && value >= 0 ? Math.min(value,max) : 0;
const known = (table,id) => typeof id === 'string' && Object.hasOwn(table,id);
const fresh = () => ({version:1, courseId:null, practice:{}, drafts:{}, reports:{}, rounds:{}, wallet:emptyWallet()});

export function choices(question) {
  return [question.answer, ...question.distractors];
}

export function clean(raw) {
  if (raw?.version !== 1) return fresh();
  const state = fresh();
  state.courseId = known(COURSES,raw.courseId) ? raw.courseId : null;
  for (const [id, entry] of Object.entries(object(raw.practice))) {
    if (!known(LESSONS,id) || !Array.isArray(entry?.questions)) continue;
    const questions = LESSONS[id].practice.map((question,i) => {
      const saved = entry.questions[i];
      if (!saved || !int(saved.attempts, 100) || !choices(question).includes(saved.last)) return null;
      return {
        attempts:int(saved.attempts,100),
        firstCorrect:saved.firstCorrect === true,
        solved:saved.solved === true && saved.last === question.answer,
        last:saved.last
      };
    });
    // Lessons completed with the original two questions keep their credit.
    const completedBeforeExpansion = entry.complete === true && questions[0]?.solved && questions[1]?.solved;
    state.practice[id] = {questions, complete:completedBeforeExpansion || questions.every(q => q?.solved)};
  }
  for (const [id, course] of Object.entries(COURSES)) {
    const draft = object(raw.drafts)[id];
    if (draft && Number.isInteger(draft.seed)) {
      const assessmentVersion = draft.assessmentVersion === ASSESSMENT_VERSION ? ASSESSMENT_VERSION : 1;
      const items = assessmentItems(course,assessmentVersion);
      const answers = {};
      for (const item of items) {
        const answer = object(draft.answers)[item.id];
        if (answer === null || choices(item.diagnostic).includes(answer)) answers[item.id] = answer;
      }
      state.drafts[id] = {seed:draft.seed, index:int(draft.index,items.length - 1), answers,assessmentVersion};
    }
    const report = object(raw.reports)[id];
    if (report && Number.isSafeInteger(report.at) && report.at > 0 && report.at <= 8_640_000_000_000_000) {
      const assessmentVersion = report.assessmentVersion === ASSESSMENT_VERSION ? ASSESSMENT_VERSION : 1;
      const answers = {};
      const results = {};
      for (const item of assessmentItems(course,assessmentVersion)) {
        const answer = object(report.answers)[item.id];
        answers[item.id] = choices(item.diagnostic).includes(answer) ? answer : null;
        results[item.id] = answers[item.id] === null ? null : answers[item.id] === item.diagnostic.answer;
      }
      state.reports[id] = {at:report.at, answers, results,assessmentVersion};
    }
    const round = object(raw.rounds)[id];
    if (round && ['checkpoint','quest','team'].includes(round.mode) &&
        courseUnits(course).includes(round.unit) && Array.isArray(round.keys) &&
        round.keys.length === (round.mode === 'team' ? 16 : 8) &&
        round.keys.every(questionByKey) && Number.isInteger(round.seed)) {
      const answers = round.keys.map((key,i) => {
        const answer = round.answers?.[i];
        return choices(questionByKey(key).question).includes(answer) ? answer : null;
      });
      state.rounds[id] = {
        mode:round.mode, unit:round.unit, keys:round.keys, answers, seed:round.seed,
        index:int(round.index,round.keys.length - 1), done:round.done === true && answers.every(Boolean),
        reward:int(round.reward,1000)
      };
    }
  }
  const w = object(raw.wallet);
  state.wallet.coins = int(w.coins,MAX_PYCOINS);
  state.wallet.bonusXp = int(w.bonusXp,1_000_000);
  const legacyOwned = Array.isArray(w.owned) ? w.owned : [];
  const savedCounts = object(w.gearCounts);
  for (const id of new Set([...legacyOwned, ...Object.keys(savedCounts)])) {
    if (!itemById(id)) continue;
    const count = Object.hasOwn(savedCounts,id) ? int(savedCounts[id],Number.MAX_SAFE_INTEGER) : 1;
    if (count) state.wallet.gearCounts[id] = count;
  }
  state.wallet.owned = Object.keys(state.wallet.gearCounts);
  for (const slot of SLOTS) {
    const equipped = object(w.equipped)[slot.id];
    if (Object.hasOwn(state.wallet.gearCounts,equipped) && itemById(equipped)?.slot === slot.id) {
      state.wallet.equipped[slot.id] = equipped;
    }
  }
  state.wallet.claimed = [...new Set((Array.isArray(w.claimed) ? w.claimed : [])
    .filter(key => typeof key === 'string' && /^(?:lesson|igcse|checkpoint|quest|team):[a-z0-9:\-]+$/.test(key)))].slice(0,2000);
  return state;
}

let storageOK = true;
let state = fresh();

function read() {
  let raw;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    storageOK = false;
    return state;
  }
  if (!raw) return fresh();
  try { return clean(JSON.parse(raw)); } catch { return state; }
}

try {
  const probe = KEY + '.probe';
  localStorage.setItem(probe,'1');
  localStorage.removeItem(probe);
} catch { storageOK = false; }
state = read();

export const current = () => state;
export const hasStorage = () => storageOK;

export function update(mutator) {
  const apply = () => {
    const next = structuredClone(storageOK ? read() : state);
    const result = mutator(next);
    state = next;
    try {
      localStorage.setItem(KEY,JSON.stringify(next));
      storageOK = true;
    } catch { storageOK = false; }
    return result;
  };
  if (!navigator.locks) return Promise.resolve().then(apply);
  let entered = false;
  return navigator.locks.request(KEY, () => {
    entered = true;
    return apply();
  }).catch(error => {
    if (!entered && ['SecurityError','NotSupportedError'].includes(error.name)) return apply();
    throw error;
  });
}

export function syncFromStorage() {
  if (storageOK) state = read();
}

export function decodeBackup(raw) {
  const parsed = JSON.parse(raw);
  if (parsed?.app !== 'MathQuest' || parsed.data?.version !== 1 || !parsed.data.wallet || !parsed.data.practice) {
    throw new Error('Choose a MathQuest progress backup.');
  }
  return clean(parsed.data);
}

import {LESSONS} from './lessons.js';
import {SLOTS, itemById} from './game-items.js';
import {emptyWallet} from './shared/pycoin-logic.js';
import {gearQuantities} from './shared/gear-crates.js';
import {localGameKey, readLocalGame} from './local-game.js';
import {levelDraftKey, localTestKey, readDraft} from './level-test.js';
import {TEST_VERSION, TOTAL, scoreAnswers, studyPlan} from './level-test-questions.js';
import {characterStyleKey, localRecordKey, readCharacterStyle, readLocal} from './local-preview.js';

export const progressStorageKey = uid => 'pyquest-simple-' + uid;
export const maxBackupBytes = 16 * 1024 * 1024;
const version = 1;
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const count = value => Number.isSafeInteger(value) && value >= 0 ? value : 0;
const courseUnits = Math.floor(LESSONS.length / 4);
const validAnswer = value => Number.isInteger(value) && value >= 0 && value <= 3;
const claimKey = /^(?:(?:lesson|quest):[a-z0-9-]+|quiz:\d+|igcse:\d+-\d+|checkpoint:\d+|team:[A-Z]{6})$/;

export function browserStorageAvailable() {
  try {
    const key = localRecordKey('storage-check');
    localStorage.setItem(key, '1');
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function backupProgress(progress) {
  return {
    completed: progress.completed,
    questDone: progress.questDone,
    quizCorrect: progress.quizCorrect,
    igcseCorrect: progress.igcseCorrect,
    runs: count(progress.runs),
    labCode: progress.labCode,
    drafts: Object.fromEntries(Object.entries(progress.drafts).filter(([key, value]) =>
      /^[a-z0-9][a-z0-9:-]{0,89}$/i.test(key) && typeof value === 'string'))
  };
}

function backupGame(game) {
  const saved = game.wallet;
  const wallet = emptyWallet();
  wallet.coins = Math.min(count(saved.coins), 1_000_000);
  wallet.bonusXp = count(saved.bonusXp);
  wallet.quantities = gearQuantities(saved);
  wallet.owned = Object.keys(wallet.quantities);
  for (const {id: slot} of SLOTS) {
    const id = saved.equipped[slot];
    if (wallet.owned.includes(id) && itemById(id)?.slot === slot) wallet.equipped[slot] = id;
  }
  wallet.claimed = [...new Set(saved.claimed.filter(key => typeof key === 'string' && claimKey.test(key)))].slice(0, 2000);
  const passedCheckpoints = [...new Set(game.passedCheckpoints.filter(group =>
    Number.isInteger(group) && group >= 0 && group < courseUnits))];
  return {wallet, passedCheckpoints};
}

function backupAttempt(saved) {
  if (saved === null) return null;
  if (!record(saved) || saved.version !== TEST_VERSION || !['started', 'completed'].includes(saved.status)) {
    throw new Error('This backup contains an unsupported level test.');
  }
  const attempt = {version: TEST_VERSION, status: saved.status, startedAt: count(saved.startedAt)};
  if (saved.status === 'completed') {
    const {scores, correct} = scoreAnswers(saved.answers);
    Object.assign(attempt, {
      answers: saved.answers, scores, correctCount: correct, plan: studyPlan(scores), completedAt: count(saved.completedAt)
    });
  }
  return attempt;
}

export function createProfileBackup(uid, progress) {
  const game = readLocalGame(uid);
  const attempt = readLocal(localTestKey(uid), {}).attempt ?? null;
  const data = {
    progress: backupProgress(progress),
    game: backupGame(game),
    levelTest: backupAttempt(attempt),
    levelDraft: readDraft(uid),
    characterStyle: readCharacterStyle(uid)
  };
  return JSON.stringify({app: 'PyQuest', version, data}, null, 2);
}

export function decodeProfileBackup(text) {
  const saved = JSON.parse(text);
  const data = saved?.data;
  const progress = data?.progress;
  const game = data?.game;
  const wallet = game?.wallet;
  if (saved?.app !== 'PyQuest' || saved.version !== version || !record(progress) || !record(wallet) ||
      !record(progress.drafts) || typeof progress.labCode !== 'string' ||
      ![progress.completed, progress.questDone, progress.quizCorrect, progress.igcseCorrect,
        game.passedCheckpoints, wallet.owned, wallet.claimed].every(Array.isArray) || !record(wallet.equipped) ||
      !Array.isArray(data.levelDraft) || data.levelDraft.length !== TOTAL ||
      !data.levelDraft.every(answer => answer === null || validAnswer(answer)) ||
      !['boy', 'girl'].includes(data.characterStyle)) {
    throw new Error('Choose a valid PyQuest progress backup.');
  }
  return {
    progress: backupProgress(progress),
    game: backupGame(game),
    levelTest: backupAttempt(data.levelTest),
    levelDraft: data.levelDraft,
    characterStyle: data.characterStyle
  };
}

function replaceRecords(entries) {
  // Write the smaller records first so a restore can reuse the space it frees.
  const size = value => value?.length ?? 0;
  const changes = entries.map(([key, value]) => ({
    key, next: value === null ? null : JSON.stringify(value), previous: localStorage.getItem(key)
  })).sort((a, b) => size(a.next) - size(a.previous) - (size(b.next) - size(b.previous)));
  const write = (key, value) => value === null ? localStorage.removeItem(key) : localStorage.setItem(key, value);
  const applied = [];
  try {
    for (const change of changes) {
      write(change.key, change.next);
      applied.push(change);
    }
  } catch {
    for (const change of applied.reverse()) write(change.key, change.previous);
    throw new Error('The browser could not save this backup. Check its site storage settings.');
  }
}

export function restoreProfileBackup(uid, backup, normalizedProgress) {
  const gameKey = localRecordKey(localGameKey(uid));
  const testKey = localRecordKey(localTestKey(uid));
  const apply = () => replaceRecords([
    [progressStorageKey(uid), normalizedProgress],
    [gameKey, backup.game],
    [testKey, backup.levelTest ? {attempt: backup.levelTest} : null],
    [levelDraftKey(uid), backup.levelDraft.some(validAnswer) ? backup.levelDraft : null],
    [localRecordKey(characterStyleKey(uid)), backup.characterStyle]
  ]);
  return navigator.locks
    ? navigator.locks.request(gameKey, () => navigator.locks.request(testKey, apply))
    : Promise.resolve().then(apply);
}

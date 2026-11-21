/**
 * Shared persistence for the MCQ "Wrong Only" bank and the Boss Battle
 * mistake review page.
 *
 * Rules:
 *  - A question answered wrong in the normal MCQ drill goes straight into the
 *    Wrong Only bank (`ecbiz_mcq_wrong`).
 *  - To leave Wrong Only it must be answered correctly on two *different*
 *    calendar days. Two correct answers on the same day only count once, and
 *    a wrong answer resets the progress back to zero.
 *  - A question answered wrong in Boss Battle is banked on the review page
 *    (`ecbiz_mcq_review`) instead. The student can practise it there and
 *    choose whether to move it into the Wrong Only bank.
 */

export const MCQ_WRONG_KEY = "ecbiz_mcq_wrong";
export const MCQ_REVIEW_KEY = "ecbiz_mcq_review";

/** Number of different days a question must be answered correctly before it leaves Wrong Only. */
export const MASTERY_DAYS_REQUIRED = 2;

export interface WrongAnswerEntry {
  id: string;
  /** Local calendar day keys (YYYY-MM-DD) on which the item was answered correctly since the last miss. */
  correctDates: string[];
  missedAt: number;
}

export type WrongAnswerMap = Record<string, WrongAnswerEntry>;

export interface ReviewAnswerEntry {
  id: string;
  question: string;
  /** The options exactly as they were presented in Boss Battle (they are shuffled there). */
  options: string[];
  correctIndex: number;
  chapter: string;
  unit: string;
  explanation: string;
  difficulty: string;
  missedAt: number;
  missCount: number;
}

export type ReviewAnswerMap = Record<string, ReviewAnswerEntry>;

/** Local calendar day key so "different days" follows the student's own clock. */
export function localDayKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/* ------------------------------------------------------------------ */
/* Wrong Only bank                                                     */
/* ------------------------------------------------------------------ */

export function saveWrongAnswers(map: WrongAnswerMap): void {
  try {
    localStorage.setItem(MCQ_WRONG_KEY, JSON.stringify(map));
  } catch {
    /* storage unavailable */
  }
}

export function loadWrongAnswers(): WrongAnswerMap {
  try {
    const raw = localStorage.getItem(MCQ_WRONG_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);

    // Legacy format was a plain array of question ids.
    if (Array.isArray(parsed)) {
      const map: WrongAnswerMap = {};
      for (const id of parsed) {
        if (typeof id === "string") {
          map[id] = { id, correctDates: [], missedAt: Date.now() };
        }
      }
      saveWrongAnswers(map);
      return map;
    }

    if (parsed && typeof parsed === "object") {
      const map: WrongAnswerMap = {};
      for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
        if (value && typeof value === "object") {
          const rawEntry = value as Partial<WrongAnswerEntry>;
          map[id] = {
            id,
            correctDates: Array.isArray(rawEntry.correctDates)
              ? rawEntry.correctDates.filter((d): d is string => typeof d === "string")
              : [],
            missedAt: typeof rawEntry.missedAt === "number" ? rawEntry.missedAt : Date.now(),
          };
        }
      }
      return map;
    }
  } catch {
    /* malformed data */
  }
  return {};
}

export function getWrongAnswerIds(): string[] {
  return Object.keys(loadWrongAnswers());
}

export function isWrongAnswer(id: string): boolean {
  return Boolean(loadWrongAnswers()[id]);
}

/** Number of distinct correct days banked for a question (0, 1 or 2). */
export function getWrongAnswerCorrectDays(id: string): number {
  return loadWrongAnswers()[id]?.correctDates?.length ?? 0;
}

/** Add a question to Wrong Only, or reset its mastery progress after another miss. */
export function addWrongAnswer(id: string): void {
  if (!id) return;
  const map = loadWrongAnswers();
  map[id] = { id, correctDates: [], missedAt: Date.now() };
  saveWrongAnswers(map);
}

/** A wrong answer in the MCQ drill resets progress (and adds the question if new). */
export function recordWrongAnswerIncorrect(id: string): void {
  addWrongAnswer(id);
}

/** Reset progress for an existing Wrong Only item without adding new items (used by Boss Battle). */
export function resetWrongAnswerProgress(id: string): void {
  const map = loadWrongAnswers();
  if (!map[id]) return;
  map[id] = { ...map[id], correctDates: [], missedAt: Date.now() };
  saveWrongAnswers(map);
}

export interface WrongAnswerProgress {
  mastered: boolean;
  days: number;
  remaining: number;
}

/**
 * Record a correct answer for a Wrong Only question. A day only counts once,
 * so the question must be answered correctly on two different days to leave
 * the bank. Returns the updated progress so the UI can show "1/2 days".
 */
export function recordWrongAnswerCorrect(id: string): WrongAnswerProgress {
  const map = loadWrongAnswers();
  const entry = map[id];
  if (!entry) return { mastered: false, days: 0, remaining: MASTERY_DAYS_REQUIRED };

  const dates = [...(entry.correctDates ?? [])];
  const today = localDayKey();
  if (!dates.includes(today)) dates.push(today);

  if (dates.length >= MASTERY_DAYS_REQUIRED) {
    delete map[id];
    saveWrongAnswers(map);
    return { mastered: true, days: dates.length, remaining: 0 };
  }

  map[id] = { ...entry, correctDates: dates };
  saveWrongAnswers(map);
  return {
    mastered: false,
    days: dates.length,
    remaining: MASTERY_DAYS_REQUIRED - dates.length,
  };
}

/* ------------------------------------------------------------------ */
/* Boss Battle mistake review page                                    */
/* ------------------------------------------------------------------ */

export function saveReviewAnswers(map: ReviewAnswerMap): void {
  try {
    localStorage.setItem(MCQ_REVIEW_KEY, JSON.stringify(map));
  } catch {
    /* storage unavailable */
  }
}

export function loadReviewAnswers(): ReviewAnswerMap {
  try {
    const raw = localStorage.getItem(MCQ_REVIEW_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const map: ReviewAnswerMap = {};
      for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
        if (value && typeof value === "object") map[id] = value as ReviewAnswerEntry;
      }
      return map;
    }
  } catch {
    /* malformed data */
  }
  return {};
}

export function getReviewAnswerCount(): number {
  return Object.keys(loadReviewAnswers()).length;
}

/** Bank a Boss Battle miss on the review page. Repeat misses increment the counter. */
export function recordReviewMiss(
  data: Omit<ReviewAnswerEntry, "missedAt" | "missCount">
): void {
  const map = loadReviewAnswers();
  const previous = map[data.id];
  map[data.id] = {
    ...data,
    missedAt: Date.now(),
    missCount: (previous?.missCount ?? 0) + 1,
  };
  saveReviewAnswers(map);
}

export function recordReviewPracticeMiss(id: string): void {
  const map = loadReviewAnswers();
  const entry = map[id];
  if (!entry) return;
  map[id] = { ...entry, missCount: entry.missCount + 1, missedAt: Date.now() };
  saveReviewAnswers(map);
}

export function removeReviewAnswer(id: string): void {
  const map = loadReviewAnswers();
  delete map[id];
  saveReviewAnswers(map);
}

export function clearReviewAnswers(): void {
  saveReviewAnswers({});
}

/** Move a reviewed mistake into the MCQ Wrong Only bank. */
export function moveReviewAnswerToWrong(id: string): boolean {
  const map = loadReviewAnswers();
  if (!map[id]) return false;
  delete map[id];
  saveReviewAnswers(map);
  addWrongAnswer(id);
  return true;
}

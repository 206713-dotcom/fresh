/**
 * Local persistence for the question flag/report workflow.
 *
 * A question can only be flagged once per student, ever — even across
 * sessions — so we keep a compact id list in localStorage.
 */

const FLAGGED_KEY = "ecbiz_flagged_question_ids";
const MAX_TRACKED = 500;

export function getFlaggedQuestionIds(): string[] {
  try {
    const raw = localStorage.getItem(FLAGGED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function isQuestionFlagged(questionId: string): boolean {
  return getFlaggedQuestionIds().includes(questionId);
}

export function markQuestionFlagged(questionId: string): void {
  try {
    const ids = getFlaggedQuestionIds();
    if (ids.includes(questionId)) return;
    ids.unshift(questionId);
    localStorage.setItem(FLAGGED_KEY, JSON.stringify(ids.slice(0, MAX_TRACKED)));
  } catch {
    /* storage unavailable */
  }
}

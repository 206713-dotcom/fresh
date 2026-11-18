/**
 * Local persistence for the question flag/report workflow.
 *
 * Question notes and their IDs remain in this browser.
 */

const FLAGGED_KEY = "ecbiz_flagged_question_ids";
const FLAG_NOTES_KEY = "ecbiz_question_flags";
const MAX_TRACKED = 500;

export function getFlaggedQuestionIds(): string[] {
  try {
    const legacy = JSON.parse(localStorage.getItem(FLAGGED_KEY) || "[]");
    const notes = JSON.parse(localStorage.getItem(FLAG_NOTES_KEY) || "[]");
    const ids = [
      ...(Array.isArray(legacy) ? legacy : []),
      ...(Array.isArray(notes) ? notes.map(note => note?.questionId) : []),
    ];
    return [...new Set(ids.filter((id): id is string => typeof id === "string"))];
  } catch {
    return [];
  }
}

export function isQuestionFlagged(questionId: string): boolean {
  return getFlaggedQuestionIds().includes(questionId);
}

export function saveLocalQuestionFlag(entry: {
  questionId: string;
  reason: string;
  confidence: string;
  note: string;
}): void {
  const parsed = JSON.parse(localStorage.getItem(FLAG_NOTES_KEY) || "[]");
  const notes = Array.isArray(parsed) ? parsed : [];
  localStorage.setItem(FLAG_NOTES_KEY, JSON.stringify([
    { ...entry, timestamp: new Date().toISOString() },
    ...notes.filter(note => note.questionId !== entry.questionId),
  ].slice(0, MAX_TRACKED)));
}

/**
 * Shared on-screen layout preference for the mock exam and the Paper 1 / Paper 2
 * practice studios.
 *
 *  - "stacked": case study text at the top, question below.
 *  - "columns": case study text on the left, question on the right.
 *
 * Both layouts activate from the `md` breakpoint (768px) upward so they work
 * on iPad-sized screens; below that they fall back to a single column.
 */

export type ExamLayout = "stacked" | "columns";

export const EXAM_LAYOUT_KEY = "ecbiz_exam_layout";
/** Legacy key written by the earlier mock-only layout picker. */
const LEGACY_LAYOUT_KEY = "ecbiz_mock_layout";

function isLayout(value: string | null): value is ExamLayout {
  return value === "stacked" || value === "columns";
}

export function loadExamLayout(): ExamLayout {
  if (typeof window === "undefined") return "stacked";
  try {
    const current = localStorage.getItem(EXAM_LAYOUT_KEY);
    if (isLayout(current)) return current;
    const legacy = localStorage.getItem(LEGACY_LAYOUT_KEY);
    if (isLayout(legacy)) {
      localStorage.setItem(EXAM_LAYOUT_KEY, legacy);
      localStorage.removeItem(LEGACY_LAYOUT_KEY);
      return legacy;
    }
  } catch {
    /* storage unavailable */
  }
  return "stacked";
}

export function saveExamLayout(layout: ExamLayout): void {
  try {
    localStorage.setItem(EXAM_LAYOUT_KEY, layout);
  } catch {
    /* storage unavailable */
  }
}

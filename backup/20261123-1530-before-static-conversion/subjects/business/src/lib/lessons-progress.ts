import type { InteractiveLesson, LessonSectionCode, SelfAssessment } from "./data/interactive-lessons";
import { ALL_LESSONS } from "./data/interactive-lessons";

export interface LessonProgressEntry {
  rating: SelfAssessment;
  completedAt: string;
}

export type LessonProgressMap = Record<string, LessonProgressEntry>;

const PROGRESS_KEY = "ecbiz_interactive_lessons_progress_v1";
const HINTS_KEY = "ecbiz_interactive_lessons_hints_v1";
const ACTIVE_LESSON_KEY = "ecbiz_interactive_lessons_active_v1";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable in private browsing; the page still works in-session.
  }
}

export function loadLessonProgress(): LessonProgressMap {
  const parsed = readJson<LessonProgressMap>(PROGRESS_KEY, {});
  if (!parsed || typeof parsed !== "object") return {};
  return parsed;
}

export function saveLessonProgress(progress: LessonProgressMap): void {
  writeJson(PROGRESS_KEY, progress);
}

export function loadHintReveals(): Record<string, number[]> {
  const parsed = readJson<Record<string, unknown>>(HINTS_KEY, {});
  if (!parsed || typeof parsed !== "object") return {};
  const clean: Record<string, number[]> = {};
  Object.entries(parsed).forEach(([key, value]) => {
    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
      clean[key] = Array.from({ length: Math.floor(value) }, (_, index) => index);
    } else if (Array.isArray(value)) {
      const indices = Array.from(
        new Set(
          value.filter(
            (item): item is number =>
              typeof item === "number" && Number.isInteger(item) && item >= 0,
          ),
        ),
      ).sort((a, b) => a - b);
      if (indices.length > 0) {
        clean[key] = indices;
      }
    }
  });
  return clean;
}

export function saveHintReveals(hints: Record<string, number[]>): void {
  writeJson(HINTS_KEY, hints);
}

export function loadActiveLessonId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(ACTIVE_LESSON_KEY);
  } catch {
    return null;
  }
}

export function saveActiveLessonId(lessonId: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ACTIVE_LESSON_KEY, lessonId);
  } catch {
    // Ignore storage failures.
  }
}

export function clearLessonProgress(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PROGRESS_KEY);
    window.localStorage.removeItem(HINTS_KEY);
    window.localStorage.removeItem(ACTIVE_LESSON_KEY);
  } catch {
    // Ignore storage failures.
  }
}

export function countCompletedLessons(progress: LessonProgressMap): number {
  return ALL_LESSONS.filter((lesson) => Boolean(progress[lesson.id]?.rating)).length;
}

export function getSectionCompletion(
  sectionCode: LessonSectionCode,
  progress: LessonProgressMap,
): { completed: number; total: number; percentage: number } {
  const lessons = ALL_LESSONS.filter((lesson) => lesson.sectionCode === sectionCode);
  const completed = lessons.filter((lesson) => Boolean(progress[lesson.id]?.rating)).length;
  const total = lessons.length;
  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

export function getNextIncompleteLesson(
  progress: LessonProgressMap,
  afterLesson?: InteractiveLesson,
): InteractiveLesson {
  const ordered = afterLesson
    ? [...ALL_LESSONS.slice(ALL_LESSONS.findIndex((lesson) => lesson.id === afterLesson.id) + 1), ...ALL_LESSONS.slice(0, ALL_LESSONS.findIndex((lesson) => lesson.id === afterLesson.id))]
    : ALL_LESSONS;
  return ordered.find((lesson) => !progress[lesson.id]?.rating) ?? ALL_LESSONS[0];
}

export function formatCompletedDate(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(isoDate));
  } catch {
    return "";
  }
}

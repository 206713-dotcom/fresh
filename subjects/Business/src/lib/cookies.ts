import { StudentSubmissionRecord, UserPreferences } from "./types";

const COOKIE_PREFIX = "ecbiz_";
const MAX_AGE_SECONDS = 34560000; // 400 days (RFC 6265bis maximum allowed)

/**
 * Write a permanent cookie with 400-day expiry and Lax SameSite
 */
export function setPermanentCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;
  const encoded = encodeURIComponent(value);
  document.cookie = `${COOKIE_PREFIX}${name}=${encoded}; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax`;
  try {
    localStorage.setItem(`${COOKIE_PREFIX}${name}`, value);
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Read a permanent cookie with localStorage fallback
 */
export function getPermanentCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const cookieName = `${COOKIE_PREFIX}${name}=`;
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(cookieName) === 0) {
      return decodeURIComponent(cookie.substring(cookieName.length));
    }
  }
  // Fallback to localStorage if cookie was stripped
  try {
    return localStorage.getItem(`${COOKIE_PREFIX}${name}`);
  } catch {
    return null;
  }
}

/**
 * Save submissions array to permanent storage
 */
export function saveSubmissions(submissions: StudentSubmissionRecord[]): void {
  // Store the last 50 submissions to stay within browser safe cookie limits
  const trimmed = submissions.slice(0, 50);
  const serialized = JSON.stringify(trimmed);
  setPermanentCookie("submissions", serialized);
}

/**
 * Get student submissions
 */
export function loadSubmissions(): StudentSubmissionRecord[] {
  const data = getPermanentCookie("submissions");
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Save mastered glossary terms
 */
export function saveMasteredTerms(terms: string[]): void {
  setPermanentCookie("mastered_terms", JSON.stringify(terms));
}

export function loadMasteredTerms(): string[] {
  const data = getPermanentCookie("mastered_terms");
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Save bookmarked questions
 */
export function saveBookmarkedQuestionIds(ids: string[]): void {
  setPermanentCookie("bookmarked_questions", JSON.stringify(ids));
}

export function loadBookmarkedQuestionIds(): string[] {
  const data = getPermanentCookie("bookmarked_questions");
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Save user preferences
 */
export function saveUserPreferences(prefs: UserPreferences): void {
  setPermanentCookie("prefs", JSON.stringify(prefs));
}

export function loadUserPreferences(): UserPreferences {
  const defaultPrefs: UserPreferences = {
    activeSubject: null,
    theme: "light",
    lastMarkTier: 8,
    timerEnabled: true,
    modelType: "instant",
  };
  const data = getPermanentCookie("prefs");
  if (!data) return defaultPrefs;
  try {
    return { ...defaultPrefs, ...JSON.parse(data) };
  } catch {
    return defaultPrefs;
  }
}

export function saveTheme(theme: "light" | "dark"): void {
  setPermanentCookie("theme", theme);
}

export function loadTheme(): "light" | "dark" {
  const t = getPermanentCookie("theme");
  return t === "dark" ? "dark" : "light";
}

export function saveSelectedSubject(subject: "business" | "econs" | null): void {
  setPermanentCookie("selected_subject", subject || "");
}

export function loadSelectedSubject(): "business" | "econs" | null {
  const s = getPermanentCookie("selected_subject");
  if (s === "business" || s === "econs") return s;
  return null;
}


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
 * Save submissions array to permanent storage (prioritizes localStorage for large multi-essay storage)
 */
export function saveSubmissions(submissions: StudentSubmissionRecord[]): void {
  // Store up to 100 submissions in localStorage
  const trimmed = submissions.slice(0, 100);
  const serialized = JSON.stringify(trimmed);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`${COOKIE_PREFIX}submissions`, serialized);
    } catch {
      // Ignore storage quota
    }
  }
  // Also write top 20 to cookie as lightweight fallback
  try {
    setPermanentCookie("submissions", JSON.stringify(trimmed.slice(0, 20)));
  } catch {}
}

/**
 * Get student submissions (prioritizes localStorage for complete fidelity)
 */
export function loadSubmissions(): StudentSubmissionRecord[] {
  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem(`${COOKIE_PREFIX}submissions`);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
  }
  const data = getPermanentCookie("submissions");
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// ========================================================
// LOCAL STORAGE AUTOSAVE SYSTEM FOR DRAFTS & IN-PROGRESS DATA
// ========================================================
const DRAFT_PREFIX = "ecbiz_draft_";
const FINANCE_EXAM_DRAFT_KEY = "ecbiz_finance_exam_draft";
const PRACTICE_STATE_KEY = "ecbiz_practice_session_state";
const QUICK_QUIZ_KEY = "ecbiz_quickquiz_state";

/**
 * Save a question response draft in localStorage so student work is never lost on refresh
 */
export function saveAnswerDraft(questionId: string, answer: string): void {
  if (typeof window === "undefined" || !questionId) return;
  try {
    if (!answer || !answer.trim()) {
      localStorage.removeItem(`${DRAFT_PREFIX}${questionId}`);
    } else {
      localStorage.setItem(`${DRAFT_PREFIX}${questionId}`, answer);
    }
  } catch (e) {
    console.warn("Could not save draft to localStorage:", e);
  }
}

/**
 * Retrieve a question response draft from localStorage
 */
export function loadAnswerDraft(questionId: string): string {
  if (typeof window === "undefined" || !questionId) return "";
  try {
    return localStorage.getItem(`${DRAFT_PREFIX}${questionId}`) || "";
  } catch {
    return "";
  }
}

/**
 * Remove an answer draft from localStorage (e.g. upon assessment submission)
 */
export function removeAnswerDraft(questionId: string): void {
  if (typeof window === "undefined" || !questionId) return;
  try {
    localStorage.removeItem(`${DRAFT_PREFIX}${questionId}`);
  } catch {}
}

export interface PracticeSessionState {
  practiceMode?: "paper1_database" | "paper2_case_study" | "verified_archive";
  activeScenarioId?: string;
  activePart?: "a" | "b" | "c" | "d";
  selectedUnit?: 1 | 2 | 3 | 4 | 5 | 6;
  activePaper2QIndex?: number;
  currentVerifiedIndex?: number;
  verifiedMarkFilter?: number;
}

/**
 * Remember student's position in Practice Studio (active question, scenario, part)
 */
export function savePracticeSessionState(state: PracticeSessionState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PRACTICE_STATE_KEY, JSON.stringify(state));
  } catch {}
}

export function loadPracticeSessionState(): PracticeSessionState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PRACTICE_STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export interface FinanceExamDraftState {
  answers: Record<string, string>;
  timeLeftSeconds: number;
  currentIdx: number;
  caseTab?: "narrative" | "app1" | "app2" | "app3" | "hooks";
  lastSavedAt: number;
}

export function saveFinanceExamDraft(data: FinanceExamDraftState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FINANCE_EXAM_DRAFT_KEY, JSON.stringify(data));
  } catch {}
}

export function loadFinanceExamDraft(): FinanceExamDraftState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(FINANCE_EXAM_DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearFinanceExamDraft(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(FINANCE_EXAM_DRAFT_KEY);
  } catch {}
}



export function saveQuickQuizDraft(data: any): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(QUICK_QUIZ_KEY, JSON.stringify(data));
  } catch {}
}

export function loadQuickQuizDraft(): any {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(QUICK_QUIZ_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearQuickQuizDraft(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(QUICK_QUIZ_KEY);
  } catch {}
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

export function saveSelectedSubject(subject: "business" | null): void {
  setPermanentCookie("selected_subject", subject || "business");
}

export function loadSelectedSubject(): "business" {
  return "business";
}

// ========================================================
// SYLLABUS REVISION CHECKLIST (LOCAL STORAGE SYSTEM)
// ========================================================
const REVISED_TOPICS_KEY = "ecbiz_revised_topics";

export function loadRevisedTopics(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REVISED_TOPICS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function saveRevisedTopics(topics: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(REVISED_TOPICS_KEY, JSON.stringify(topics));
  } catch {}
}

export function toggleRevisedTopic(topicCode: string): string[] {
  const current = loadRevisedTopics();
  let next: string[];
  if (current.includes(topicCode)) {
    next = current.filter((t) => t !== topicCode);
  } else {
    next = [...current, topicCode];
  }
  saveRevisedTopics(next);
  return next;
}

export type SyllabusPointRating = "easy" | "moderate" | "hard";
export type SyllabusRatingsMap = Record<string, SyllabusPointRating>;

const SYLLABUS_RATINGS_KEY = "ecbiz_subpoint_ratings_v2";

export function loadSyllabusRatings(): SyllabusRatingsMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(SYLLABUS_RATINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch {}
  return {};
}

export function saveSyllabusRatings(ratings: SyllabusRatingsMap): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SYLLABUS_RATINGS_KEY, JSON.stringify(ratings));
  } catch {}
}

export function setSyllabusRating(pointId: string, rating: SyllabusPointRating | null): SyllabusRatingsMap {
  const current = loadSyllabusRatings();
  if (rating === null) {
    delete current[pointId];
  } else {
    current[pointId] = rating;
  }
  saveSyllabusRatings(current);
  return current;
}

// ========================================================
// DAILY & WEEKLY GLOBAL CHALLENGE PERSISTENCE
// ========================================================
const CHALLENGE_HISTORY_KEY = "ecbiz_challenge_history";

export interface ChallengeCompletionRecord {
  challengeId: string; // e.g. "daily-2026-11-01" or "weekly-2026-W44"
  dateCompleted: string;
  isCorrect: boolean;
  timeRemainingSeconds: number;
  bonusCoinsEarned: number;
  selectedOption: string;
}

export function loadChallengeHistory(): Record<string, ChallengeCompletionRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CHALLENGE_HISTORY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch {}
  return {};
}

export function saveChallengeRecord(record: ChallengeCompletionRecord): void {
  if (typeof window === "undefined") return;
  try {
    const history = loadChallengeHistory();
    history[record.challengeId] = record;
    localStorage.setItem(CHALLENGE_HISTORY_KEY, JSON.stringify(history));
  } catch {}
}

export function getStudyCoins(): number {
  if (typeof window === "undefined") return 50;
  try {
    const currentRaw = localStorage.getItem("ecbiz_study_coins");
    return currentRaw !== null ? parseInt(currentRaw, 10) || 0 : 50;
  } catch {
    return 50;
  }
}

export function awardBonusStudyCoins(amount: number): number {
  if (typeof window === "undefined" || amount <= 0) return getStudyCoins();
  try {
    const current = getStudyCoins();
    const updated = current + amount;
    localStorage.setItem("ecbiz_study_coins", String(updated));
    // Dispatch custom event so all active components update coin counter immediately
    window.dispatchEvent(new CustomEvent("ecbiz_coins_updated", { detail: { coins: updated, delta: amount } }));
    return updated;
  } catch {
    return 0;
  }
}

export function deductStudyCoins(amount: number): boolean {
  if (typeof window === "undefined" || amount <= 0) return false;
  try {
    const current = getStudyCoins();
    if (current < amount) return false;
    const updated = current - amount;
    localStorage.setItem("ecbiz_study_coins", String(updated));
    window.dispatchEvent(new CustomEvent("ecbiz_coins_updated", { detail: { coins: updated, delta: -amount } }));
    return true;
  } catch {
    return false;
  }
}

// Character Customizer Persistence
export interface CharacterCustomizationState {
  skinToneId: string;
  hairId: string;
  topId: string;
  bottomId: string;
  shoeId: string;
  unlockedItems: string[]; // List of item IDs unlocked by purchasing
}

export const DEFAULT_CUSTOMIZATION: CharacterCustomizationState = {
  skinToneId: "skin-1",
  hairId: "hair-1",
  topId: "top-1",
  bottomId: "bot-1",
  shoeId: "shoe-1",
  unlockedItems: [
    "skin-1",
    "skin-2",
    "skin-3",
    "skin-4",
    "skin-5",
    "skin-6",
    "hair-1",
    "top-1",
    "bot-1",
    "shoe-1",
  ],
};

export function loadCustomizerState(): CharacterCustomizationState {
  if (typeof window === "undefined") return DEFAULT_CUSTOMIZATION;
  try {
    const raw = localStorage.getItem("ecbiz_avatar_customization");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        // Automatically ensure all free skin tones are included in unlockedItems
        const freeSkins = ["skin-1", "skin-2", "skin-3", "skin-4", "skin-5", "skin-6"];
        const combinedUnlocked = Array.isArray(parsed.unlockedItems)
          ? Array.from(new Set([...DEFAULT_CUSTOMIZATION.unlockedItems, ...freeSkins, ...parsed.unlockedItems]))
          : DEFAULT_CUSTOMIZATION.unlockedItems;
        return {
          ...DEFAULT_CUSTOMIZATION,
          ...parsed,
          unlockedItems: combinedUnlocked,
        };
      }
    }
  } catch {}
  return DEFAULT_CUSTOMIZATION;
}

export function saveCustomizerState(state: CharacterCustomizationState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("ecbiz_avatar_customization", JSON.stringify(state));
  } catch {}
}

// ========================================================
// ACHIEVEMENTS PERSISTENCE SYSTEM
// ========================================================
const CLAIMED_ACHIEVEMENTS_KEY = "ecbiz_claimed_achievements";

export function loadClaimedAchievements(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CLAIMED_ACHIEVEMENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function saveClaimedAchievements(claimed: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CLAIMED_ACHIEVEMENTS_KEY, JSON.stringify(claimed));
    window.dispatchEvent(new CustomEvent("ecbiz_achievements_updated", { detail: { claimed } }));
  } catch {}
}

export function claimAchievement(achievementId: string, rewardPoints: number): boolean {
  if (typeof window === "undefined" || !achievementId || rewardPoints <= 0) return false;
  try {
    const claimed = loadClaimedAchievements();
    if (claimed.includes(achievementId)) return false;
    const nextClaimed = [...claimed, achievementId];
    saveClaimedAchievements(nextClaimed);
    awardBonusStudyCoins(rewardPoints);
    return true;
  } catch {
    return false;
  }
}

// Study Space Completed Sessions Tracker
const COMPLETED_SESSIONS_KEY = "ecbiz_completed_focus_sessions";

export function getCompletedFocusSessionsCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(COMPLETED_SESSIONS_KEY);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

export function incrementCompletedFocusSessions(): number {
  if (typeof window === "undefined") return 0;
  try {
    const next = getCompletedFocusSessionsCount() + 1;
    localStorage.setItem(COMPLETED_SESSIONS_KEY, String(next));
    window.dispatchEvent(new CustomEvent("ecbiz_focus_session_done", { detail: { count: next } }));
    return next;
  } catch {
    return 0;
  }
}

// ==========================================
// PAPER 1 & PAPER 2 POSITION PERSISTENCE
// ==========================================
const P1_LAST_POSITION_KEY = "ecbiz_p1_last_position";
const P2_LAST_POSITION_KEY = "ecbiz_p2_last_position";
const P2_ANSWERS_PREFIX = "ecbiz_p2_answers_";

export interface Paper1LastPosition {
  scenarioId: string;
  part: "a" | "b" | "c" | "d";
  sectionCode?: string;
  updatedAt: number;
}

export function savePaper1Position(data: { scenarioId: string; part: "a" | "b" | "c" | "d"; sectionCode?: string }): void {
  if (typeof window === "undefined") return;
  try {
    const payload: Paper1LastPosition = { ...data, updatedAt: Date.now() };
    localStorage.setItem(P1_LAST_POSITION_KEY, JSON.stringify(payload));
    setPermanentCookie("p1_scenario", data.scenarioId);
    setPermanentCookie("p1_part", data.part);
    if (data.sectionCode) {
      setPermanentCookie("p1_section", data.sectionCode);
    }
  } catch {}
}

export function loadPaper1Position(): Paper1LastPosition | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(P1_LAST_POSITION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.scenarioId) return parsed;
    }
    const cookieScenario = getPermanentCookie("p1_scenario");
    const cookiePart = (getPermanentCookie("p1_part") as "a" | "b" | "c" | "d") || "b";
    const cookieSection = getPermanentCookie("p1_section") || undefined;
    if (cookieScenario) {
      return { scenarioId: cookieScenario, part: cookiePart, sectionCode: cookieSection, updatedAt: Date.now() };
    }
    return null;
  } catch {
    return null;
  }
}

export interface Paper2LastPosition {
  scenarioId: string;
  questionIdx: number;
  updatedAt: number;
}

export function savePaper2Position(data: { scenarioId: string; questionIdx: number }): void {
  if (typeof window === "undefined") return;
  try {
    const payload: Paper2LastPosition = { ...data, updatedAt: Date.now() };
    localStorage.setItem(P2_LAST_POSITION_KEY, JSON.stringify(payload));
    setPermanentCookie("p2_scenario", data.scenarioId);
    setPermanentCookie("p2_qidx", String(data.questionIdx));
  } catch {}
}

export function loadPaper2Position(): Paper2LastPosition | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(P2_LAST_POSITION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.scenarioId) return parsed;
    }
    const cookieScenario = getPermanentCookie("p2_scenario");
    const cookieQIdx = getPermanentCookie("p2_qidx");
    if (cookieScenario) {
      return {
        scenarioId: cookieScenario,
        questionIdx: cookieQIdx ? parseInt(cookieQIdx, 10) || 0 : 0,
        updatedAt: Date.now(),
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function savePaper2Answers(scenarioId: string, answers: Record<number, string>): void {
  if (typeof window === "undefined" || !scenarioId) return;
  try {
    localStorage.setItem(`${P2_ANSWERS_PREFIX}${scenarioId}`, JSON.stringify(answers));
  } catch {}
}

export function loadPaper2Answers(scenarioId: string): Record<number, string> {
  if (typeof window === "undefined" || !scenarioId) return {};
  try {
    const raw = localStorage.getItem(`${P2_ANSWERS_PREFIX}${scenarioId}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}




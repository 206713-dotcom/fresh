/**
 * Shared engine for the Boss Battle question system.
 *
 * - Classifies MCQ bank items into recall / application / analysis levels and
 *   application / calculation / definition focus modes.
 * - Filters the bank by unit, subsection and focus mode.
 * - Picks questions with spaced-repetition weighting for previously missed
 *   questions (stored in localStorage as `ecbiz_boss_wrong_questions`).
 * - Mirrors misses to the `Boss_Wrong_Questions` sheet tab (best effort).
 */

import { MCQ_BANK, MCQItem } from "./data/mcq-bank";

export type DifficultyTier = "foundation" | "higher" | "nightmare";
export type BossFocusMode = "all" | "missed" | "definitions" | "calculations" | "application";

/** Seconds a student gets to answer one question on each difficulty tier. */
export const TIER_QUESTION_SECONDS: Record<DifficultyTier, number> = {
  foundation: 40,
  higher: 25,
  nightmare: 14,
};

/**
 * Timer pressure tightens with every stage: each stage trims 5% off the tier's
 * base time (floor of 70%, minimum 8 seconds), so later levels hit harder.
 */
export function questionSecondsForStage(difficulty: DifficultyTier, stage: number): number {
  const base = TIER_QUESTION_SECONDS[difficulty];
  const scale = Math.max(0.7, 1 - 0.05 * Math.max(0, stage - 1));
  return Math.max(8, Math.round(base * scale));
}

export const TIER_LABELS: Record<DifficultyTier, string> = {
  foundation: "Foundation",
  higher: "Higher Tier",
  nightmare: "A* Nightmare",
};

export interface BossFilter {
  /** Unit numbers ("1".."6"). Empty array = every unit. */
  units: string[];
  /** Chapter string ("4.2 Costs, ..."), or "all". */
  subsection: string;
  focus: BossFocusMode;
}

export const DEFAULT_BOSS_FILTER: BossFilter = { units: [], subsection: "all", focus: "all" };

export interface BossWrongEntry {
  id: string;
  unit: string;
  chapter: string;
  difficulty: DifficultyTier;
  question: string;
  correctAnswer: string;
  missCount: number;
  lastMissedAt: number;
}

export type BossWrongMap = Record<string, BossWrongEntry>;

export const BOSS_WRONG_KEY = "ecbiz_boss_wrong_questions";
export const BOSS_FILTER_KEY = "ecbiz_boss_filters";

/* ------------------------------------------------------------------ */
/* Wrong-question persistence (localStorage, synced via `ecbiz_*`)     */
/* ------------------------------------------------------------------ */

export function loadBossWrongQuestions(): BossWrongMap {
  try {
    const raw = localStorage.getItem(BOSS_WRONG_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as BossWrongMap) : {};
  } catch {
    return {};
  }
}

export function saveBossWrongQuestions(map: BossWrongMap) {
  try {
    localStorage.setItem(BOSS_WRONG_KEY, JSON.stringify(map));
  } catch {
    /* storage unavailable */
  }
}

export function recordBossMiss(item: MCQItem, difficulty: DifficultyTier): BossWrongEntry {
  const map = loadBossWrongQuestions();
  const existing = map[item.id];
  const entry: BossWrongEntry = {
    id: item.id,
    unit: item.section,
    chapter: item.chapter,
    difficulty,
    question: item.question,
    correctAnswer: item.correctAnswer,
    missCount: (existing?.missCount ?? 0) + 1,
    lastMissedAt: Date.now(),
  };
  map[item.id] = entry;
  saveBossWrongQuestions(map);
  return entry;
}

/** Decrement the miss weight; removes the entry once it reaches zero. Returns the updated entry or null when mastered. */
export function recordBossHit(itemId: string): BossWrongEntry | null {
  const map = loadBossWrongQuestions();
  const existing = map[itemId];
  if (!existing) return null;
  const nextMiss = existing.missCount - 1;
  if (nextMiss <= 0) {
    delete map[itemId];
    saveBossWrongQuestions(map);
    return null; // mastered
  }
  const updated = { ...existing, missCount: nextMiss };
  map[itemId] = updated;
  saveBossWrongQuestions(map);
  return updated;
}

/* ------------------------------------------------------------------ */
/* Unit / subsection catalogue                                         */
/* ------------------------------------------------------------------ */

export interface SubsectionOption {
  /** Chapter code, e.g. "4.2" */
  code: string;
  /** Full chapter label */
  chapter: string;
  count: number;
}

const SECTION_TITLES: Record<string, string> = {
  "1": "1 · Understanding business activity",
  "2": "2 · People in business",
  "3": "3 · Marketing",
  "4": "4 · Operations management",
  "5": "5 · Financial information and decisions",
  "6": "6 · External influences",
};

export const UNIT_OPTIONS = ["1", "2", "3", "4", "5", "6"].map((code) => ({
  code,
  label: SECTION_TITLES[code] ?? `Unit ${code}`,
}));

export function getSubsections(units: string[]): SubsectionOption[] {
  const selected = units.length > 0 ? new Set(units) : null;
  const tally = new Map<string, SubsectionOption>();
  for (const item of MCQ_BANK) {
    if (selected && !selected.has(item.section)) continue;
    const code = item.chapter.split(" ")[0] ?? item.chapter;
    const existing = tally.get(code);
    if (existing) {
      existing.count += 1;
    } else {
      tally.set(code, { code, chapter: item.chapter, count: 1 });
    }
  }
  return [...tally.values()].sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
}

/* ------------------------------------------------------------------ */
/* Question classification                                             */
/* ------------------------------------------------------------------ */

export type QuestionLevel = 1 | 2 | 3;

const RECALL_RE = /\b(define|state|name|which of the following|what is|identify|select the|choose the|match)\b/i;
const CALC_RE = /\b(calculate|compute|ratio|margin|percentage|percent|contribution|break-?even|average|profit|rate of)\b/i;
const APPLY_RE = /\b(recommend|justify|evaluate|assess|analyse|analyze|discuss|to what extent|most important|best|overall)\b/i;

/** 1 = recall/definition · 2 = application · 3 = analysis/evaluation */
export function questionLevel(item: MCQItem): QuestionLevel {
  const q = item.question.toLowerCase();
  let score = 0;
  if (CALC_RE.test(q)) score += 2;
  if (APPLY_RE.test(q)) score += 2;
  else if (/\b(explain|why|how)\b/.test(q)) score += 1;
  if (RECALL_RE.test(q)) score -= 1;
  if (score <= 0) return 1;
  if (score === 1) return 2;
  return 3;
}

export type QuestionFocus = "definitions" | "calculations" | "application" | null;

function matchesFocus(item: MCQItem, focus: QuestionFocus): boolean {
  const q = item.question.toLowerCase();
  if (focus === "definitions") return RECALL_RE.test(q);
  if (focus === "calculations") return CALC_RE.test(q);
  if (focus === "application") return APPLY_RE.test(q) || /\b(explain|analyse|analyze)\b/.test(q);
  return true;
}

/* ------------------------------------------------------------------ */
/* Filtering + weighted picking                                       */
/* ------------------------------------------------------------------ */

export interface FilteredPool {
  items: MCQItem[];
  /** true when the filter produced too few questions and the pool was widened */
  widened: boolean;
}

export function buildPool(filter: BossFilter): FilteredPool {
  const units = filter.units.length > 0 ? new Set(filter.units) : null;
  const subsection = filter.subsection === "all" ? null : filter.subsection;
  const focus = filter.focus === "all" ? null : (filter.focus as QuestionFocus);

  let pool = MCQ_BANK.filter((item) => {
    if (units && !units.has(item.section)) return false;
    if (subsection && !item.chapter.startsWith(subsection)) return false;
    if (filter.focus === "missed") return true; // narrowed by the wrong map instead
    if (focus && !matchesFocus(item, focus)) return false;
    return true;
  });

  let widened = false;
  if (pool.length === 0 && (subsection || focus)) {
    // Back off subsection, then focus, then units — the battle must always have questions.
    widened = true;
    pool = MCQ_BANK.filter((item) => {
      if (units && !units.has(item.section)) return false;
      if (focus && !matchesFocus(item, focus)) return false;
      return true;
    });
    if (pool.length === 0) pool = units ? MCQ_BANK.filter((item) => units.has(item.section)) : MCQ_BANK.slice();
  }
  return { items: pool, widened };
}

export interface PickContext {
  filter: BossFilter;
  wrong: BossWrongMap;
  stage: number;
  rage: number;
  recentIds?: string[];
}

/**
 * Draw the next boss question respecting the unit/subsection/focus filters,
 * spaced-repetition weights, and the level curve (early levels lean on recall,
 * later ones on application/analysis).
 */
export function drawBossQuestion(ctx: PickContext): MCQItem {
  const { filter, wrong, stage, rage } = ctx;

  let pool = buildPool(filter).items;
  if (filter.focus === "missed") {
    const missed = pool.filter((item) => wrong[item.id]);
    if (missed.length > 0) pool = missed;
  }

  const recent = new Set(ctx.recentIds ?? []);
  const candidates = pool.filter((item) => !recent.has(item.id));
  const usable = candidates.length > 0 ? candidates : pool;

  // The escalation curve: stages 1-2 recall, 3-4 application, 5+ analysis.
  const prefer = Math.min(3, Math.max(1, Math.floor((stage - 1) / 2) + 1 + (rage >= 6 ? 1 : 0)));

  const weightOf = (item: MCQItem) => {
    const entry = wrong[item.id];
    const missBoost = entry ? Math.pow(entry.missCount + 1, 1.6) : 1;
    const lvl = questionLevel(item);
    const lvlWeight = lvl === prefer ? 3 : Math.abs(lvl - prefer) === 1 ? 1.5 : 0.7;
    return missBoost * lvlWeight;
  };

  let total = 0;
  for (const item of usable) total += weightOf(item);
  if (total <= 0) return usable[Math.floor(Math.random() * usable.length)];

  let r = Math.random() * total;
  for (const item of usable) {
    r -= weightOf(item);
    if (r <= 0) return item;
  }
  return usable[usable.length - 1];
}

/** Count available questions for the current filter (used for the live "pool size" hint). */
export function countPool(filter: BossFilter): number {
  return buildPool(filter).items.length;
}

/* ------------------------------------------------------------------ */
/* Persisted setup filters                                            */
/* ------------------------------------------------------------------ */

export function loadBossFilter(): BossFilter {
  try {
    const raw = localStorage.getItem(BOSS_FILTER_KEY);
    if (!raw) return { ...DEFAULT_BOSS_FILTER };
    const parsed = JSON.parse(raw) as Partial<BossFilter>;
    return {
      units: Array.isArray(parsed.units) ? parsed.units.filter((u) => typeof u === "string") : [],
      subsection: typeof parsed.subsection === "string" ? parsed.subsection : "all",
      focus: (["all", "missed", "definitions", "calculations", "application"] as BossFocusMode[]).includes(parsed.focus as BossFocusMode)
        ? (parsed.focus as BossFocusMode)
        : "all",
    };
  } catch {
    return { ...DEFAULT_BOSS_FILTER };
  }
}

export function saveBossFilter(filter: BossFilter) {
  try {
    localStorage.setItem(BOSS_FILTER_KEY, JSON.stringify(filter));
  } catch {
    /* storage unavailable */
  }
}

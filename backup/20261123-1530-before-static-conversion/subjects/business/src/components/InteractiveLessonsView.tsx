"use client";

import React, { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import {
  ArrowRight,
  CheckCircle2,
  ListChecks,
  RotateCcw,
  Target,
} from "lucide-react";
import {
  ALL_LESSONS,
  LESSON_SECTIONS,
  TOTAL_LESSONS,
  getLessonById,
  getSectionByCode,
  type InteractiveLesson,
  type LessonSectionCode,
  type SelfAssessment,
} from "../lib/data/interactive-lessons";
import {
  clearLessonProgress,
  countCompletedLessons,
  getNextIncompleteLesson,
  getSectionCompletion,
  loadActiveLessonId,
  loadHintReveals,
  loadLessonProgress,
  saveActiveLessonId,
  saveHintReveals,
  saveLessonProgress,
  type LessonProgressMap,
} from "../lib/lessons-progress";
import { awardBonusStudyCoins } from "../lib/cookies";
import { InteractiveLessonCard } from "./InteractiveLessonCard";

interface InteractiveLessonsViewProps {
  onOpenPractice?: (sectionCode: string) => void;
  onOpenChecklist?: () => void;
}

const TOTAL_MINUTES = ALL_LESSONS.reduce((sum, lesson) => sum + lesson.minutes, 0);

function getFirstLessonInSection(
  sectionCode: LessonSectionCode,
  progress: LessonProgressMap,
): InteractiveLesson {
  const section = getSectionByCode(sectionCode);
  if (!section) return ALL_LESSONS[0];
  return section.lessons.find((lesson) => !progress[lesson.id]?.rating) ?? section.lessons[0];
}

function resolveInitialLesson(): InteractiveLesson {
  if (typeof window !== "undefined") {
    try {
      const params = new URLSearchParams(window.location.search);
      const lessonParam = params.get("lesson");
      const lessonFromQuery = lessonParam ? getLessonById(lessonParam) : undefined;
      if (lessonFromQuery) return lessonFromQuery;

      const sectionParam = params.get("section");
      if (sectionParam && ["1", "2", "3", "4", "5", "6"].includes(sectionParam)) {
        return getFirstLessonInSection(sectionParam as LessonSectionCode, loadLessonProgress());
      }
    } catch {
      // Ignore malformed URLs and fall back to saved progress.
    }

    const savedLessonId = loadActiveLessonId();
    if (savedLessonId) {
      const savedLesson = getLessonById(savedLessonId);
      if (savedLesson) return savedLesson;
    }
  }

  return getNextIncompleteLesson(loadLessonProgress());
}

export function InteractiveLessonsView({
  onOpenPractice,
  onOpenChecklist,
}: InteractiveLessonsViewProps) {
  const [progress, setProgress] = useState<LessonProgressMap>(() => loadLessonProgress());
  const [hints, setHints] = useState<Record<string, number[]>>(() => loadHintReveals());
  const [activeLesson, setActiveLesson] = useState<InteractiveLesson>(resolveInitialLesson);
  const [resetNonce, setResetNonce] = useState(0);
  const [confirmingReset, setConfirmingReset] = useState(false);

  // Keep the last-read lesson available when the student returns to this tab.
  useEffect(() => {
    saveActiveLessonId(activeLesson.id);
  }, [activeLesson.id]);

  const activeSection = getSectionByCode(activeLesson.sectionCode) ?? LESSON_SECTIONS[0];
  const sectionLessons = activeSection.lessons;
  const sectionProgress = getSectionCompletion(activeSection.code, progress);
  const completedCount = countCompletedLessons(progress);
  const overallPercentage = Math.round((completedCount / TOTAL_LESSONS) * 100);
  const allComplete = completedCount === TOTAL_LESSONS;

  const nextIncomplete = useMemo(() => getNextIncompleteLesson(progress), [progress]);
  const activeIndex = ALL_LESSONS.findIndex((lesson) => lesson.id === activeLesson.id);
  const previousLesson = activeIndex > 0 ? ALL_LESSONS[activeIndex - 1] : undefined;
  const nextLesson =
    activeIndex >= 0 && activeIndex < ALL_LESSONS.length - 1
      ? ALL_LESSONS[activeIndex + 1]
      : undefined;
  const positionInSection = sectionLessons.findIndex((lesson) => lesson.id === activeLesson.id) + 1;

  const confidenceCounts = useMemo(() => {
    const counts: Record<SelfAssessment, number> = { easy: 0, medium: 0, hard: 0 };
    Object.values(progress).forEach((entry) => {
      if (entry?.rating && entry.rating in counts) {
        counts[entry.rating] += 1;
      }
    });
    return counts;
  }, [progress]);

  const selectLesson = (lesson: InteractiveLesson, scrollToReader = false) => {
    setActiveLesson(lesson);
    saveActiveLessonId(lesson.id);

    if (typeof window !== "undefined") {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("tab", "lessons");
        url.searchParams.set("lesson", lesson.id);
        url.searchParams.delete("section");
        url.searchParams.delete("open");
        window.history.replaceState(null, "", url.toString());
      } catch {
        // History updates are a convenience; selection still works without them.
      }
    }

    if (scrollToReader) {
      window.requestAnimationFrame(() => {
        document
          .getElementById("lesson-reader")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  const handleSelectSection = (sectionCode: LessonSectionCode) => {
    selectLesson(getFirstLessonInSection(sectionCode, progress));
  };

  const handleHint = (conceptId: string, totalTerms: number) => {
    if (totalTerms <= 0) return;
    setHints((current) => {
      const revealedSet = new Set(
        (current[conceptId] ?? []).filter((idx) => idx >= 0 && idx < totalTerms),
      );
      const hiddenIndices: number[] = [];
      for (let i = 0; i < totalTerms; i += 1) {
        if (!revealedSet.has(i)) hiddenIndices.push(i);
      }
      if (hiddenIndices.length === 0) return current;
      const step = Math.max(1, Math.ceil(totalTerms * 0.25));
      hiddenIndices.slice(0, step).forEach((idx) => revealedSet.add(idx));
      const next = {
        ...current,
        [conceptId]: Array.from(revealedSet).sort((a, b) => a - b),
      };
      saveHintReveals(next);
      return next;
    });
  };

  const handleHideConcept = (conceptId: string) => {
    setHints((current) => {
      if (!current[conceptId] || current[conceptId].length === 0) return current;
      const next = { ...current };
      delete next[conceptId];
      saveHintReveals(next);
      return next;
    });
  };

  const handleToggleTerm = (conceptId: string, termIndex: number, totalTerms: number) => {
    if (termIndex < 0 || termIndex >= totalTerms) return;
    setHints((current) => {
      const revealedSet = new Set(
        (current[conceptId] ?? []).filter((idx) => idx >= 0 && idx < totalTerms),
      );
      if (revealedSet.has(termIndex)) {
        revealedSet.delete(termIndex);
      } else {
        revealedSet.add(termIndex);
      }
      const next = { ...current };
      if (revealedSet.size === 0) {
        delete next[conceptId];
      } else {
        next[conceptId] = Array.from(revealedSet).sort((a, b) => a - b);
      }
      saveHintReveals(next);
      return next;
    });
  };

  const handleResetLessonTerms = (conceptIds: string[]) => {
    setHints((current) => {
      let changed = false;
      const next = { ...current };
      for (const id of conceptIds) {
        if (next[id] && next[id].length > 0) {
          delete next[id];
          changed = true;
        }
      }
      if (!changed) return current;
      saveHintReveals(next);
      return next;
    });
  };

  const handleRateLesson = (lessonId: string, rating: SelfAssessment) => {
    const existing = progress[lessonId];
    if (existing?.rating === rating) return;

    const next: LessonProgressMap = {
      ...progress,
      [lessonId]: {
        rating,
        completedAt: new Date().toISOString(),
      },
    };
    setProgress(next);
    saveLessonProgress(next);

    if (!existing?.rating) {
      awardBonusStudyCoins(15);
      confetti({
        particleCount: 70,
        spread: 62,
        origin: { y: 0.78 },
        colors: ["#203e32", "#e4eeb2", "#f6bb83", "#97532b"],
      });
    }
  };

  const handleConfirmResetProgress = () => {
    clearLessonProgress();
    setProgress({});
    setHints({});
    setConfirmingReset(false);
    setResetNonce((value) => value + 1);
    setActiveLesson(ALL_LESSONS[0]);
    saveActiveLessonId(ALL_LESSONS[0].id);

    if (typeof window !== "undefined") {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete("lesson");
        url.searchParams.delete("section");
        window.history.replaceState(null, "", url.toString());
      } catch {
        // History updates are a convenience; the reset still works without them.
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="study-page">
      {/* Sleek Hero Header matching Paper 1 Examination Studio with desk diagram */}
      <header className="study-hero">
        <div className="study-hero-content">
          <p className="study-hero-kicker">Cambridge IGCSE Business Studies · 0264</p>
          <h1 className="study-title">
            Interactive <span>Lessons Studio</span>
          </h1>
          <p className="study-description">
            Build business judgement across {TOTAL_LESSONS} guided lessons with hidden-term
            hints, gap-fill drills and scenario practice.
          </p>
          <div className="study-hero-actions">
            <button
              type="button"
              onClick={() =>
                allComplete
                  ? onOpenPractice?.(activeSection.code)
                  : selectLesson(nextIncomplete, true)
              }
              className="study-action btn-primary whitespace-nowrap shrink-0"
            >
              <span>
                {allComplete ? "Open Practice Studio" : `Resume Lesson ${nextIncomplete.id}`}
              </span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>

            {onOpenChecklist && (
              <button
                type="button"
                onClick={onOpenChecklist}
                className="study-action study-secondary-action whitespace-nowrap shrink-0"
              >
                <ListChecks size={16} aria-hidden="true" />
                <span>0264 Syllabus Checklist</span>
              </button>
            )}
          </div>
          <p className="mt-3 font-mono text-[11px] font-semibold tabular-nums text-white/75">
            {completedCount} of {TOTAL_LESSONS} completed · {overallPercentage}% mastered ·{" "}
            {LESSON_SECTIONS.length} sections · ~{Math.round(TOTAL_MINUTES / 60)} hrs
          </p>
        </div>
        <div className="study-hero-image" aria-hidden="true" />
      </header>

      {/* Unified Studio Workspace */}
      <div className="study-studio">
        {/* Top Bar: 6 Syllabus Section Tabs + Compact Progress Summary */}
        <div className="study-mode-bar">
          <div
            role="group"
            aria-label="Syllabus section navigation"
            className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-w-0 flex-1"
          >
            {LESSON_SECTIONS.map((section) => {
              const completion = getSectionCompletion(section.code, progress);
              const isActive = section.code === activeLesson.sectionCode;
              return (
                <button
                  key={section.code}
                  type="button"
                  onClick={() => handleSelectSection(section.code)}
                  aria-pressed={isActive}
                  title={`${section.title} — ${completion.completed} of ${completion.total} lessons complete`}
                  className="study-mode-button whitespace-nowrap shrink-0 max-sm:!flex-row max-sm:!min-h-[2.875rem] max-sm:!px-2.5 max-sm:!py-1.5 max-sm:!gap-1.5"
                >
                  <span className="font-mono text-[11px] opacity-70 tabular-nums">
                    0{section.code}
                  </span>
                  <span>{section.shortTitle}</span>
                  <small className="font-mono text-[10px] opacity-65 tabular-nums">
                    {completion.completed}/{completion.total}
                  </small>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5 py-2 shrink-0">
            <div className="flex items-center gap-2 rounded-lg bg-[var(--surface-practice)] px-2.5 py-1.5 text-[11px] font-mono font-semibold tabular-nums text-[var(--surface-text)]">
              <div
                role="progressbar"
                aria-label="Overall lesson completion"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={overallPercentage}
                className="h-1.5 w-14 overflow-hidden rounded-full bg-[var(--surface-line)]"
              >
                <div
                  className="h-full rounded-full bg-[var(--green)] dark:bg-[#e4eeb2] transition-[width] duration-500"
                  style={{ width: `${overallPercentage}%` }}
                />
              </div>
              <span>{overallPercentage}%</span>
              {completedCount > 0 && (
                <span className="hidden xl:inline text-[var(--surface-muted)]">
                  · {confidenceCounts.easy}E/{confidenceCounts.medium}M/{confidenceCounts.hard}H
                </span>
              )}
            </div>

            {completedCount > 0 &&
              (!confirmingReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmingReset(true)}
                  title="Reset all lesson progress and hint reveals"
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-[var(--surface-muted)] transition-colors hover:bg-[var(--surface-practice)] hover:text-[#8b3e2f] dark:hover:text-[#efc6b8] cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              ) : (
                <div className="flex items-center gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={handleConfirmResetProgress}
                    className="rounded-md bg-[#97532b] px-2 py-1 font-semibold text-white hover:bg-[#7b4220] cursor-pointer whitespace-nowrap"
                  >
                    Confirm reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingReset(false)}
                    className="rounded-md px-2 py-1 font-semibold text-[var(--surface-muted)] hover:bg-[var(--surface-practice)] cursor-pointer whitespace-nowrap"
                  >
                    Cancel
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Workspace Split: Left Section Lesson Rail + Right Active Lesson Reader */}
        <div className="study-workspace">
          <aside className="study-section-rail" aria-label="Section lessons navigation">
            <div>
              <div className="flex items-baseline justify-between gap-2 px-1">
                <h2 className="study-panel-kicker !m-0">
                  Section {activeSection.code}
                </h2>
                <span className="font-mono text-[10px] font-semibold tabular-nums text-[var(--surface-muted)]">
                  {sectionProgress.completed}/{sectionProgress.total} done
                </span>
              </div>

              <p className="mt-1 px-1 text-xs font-semibold leading-snug text-[var(--surface-text)]">
                {activeSection.title}
              </p>

              <div className="mx-1 mt-2 mb-3 h-1 overflow-hidden rounded-full bg-[var(--surface-line)]">
                <div
                  className="h-full rounded-full bg-[var(--green)] dark:bg-[#e4eeb2] transition-[width] duration-500"
                  style={{ width: `${sectionProgress.percentage}%` }}
                />
              </div>

              {/* Mobile lesson dropdown */}
              <div className="lg:hidden mb-3">
                <label
                  htmlFor="lesson-picker"
                  className="block px-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--surface-muted)]"
                >
                  Select lesson ({positionInSection} of {sectionLessons.length})
                </label>
                <select
                  id="lesson-picker"
                  value={activeLesson.id}
                  onChange={(event) => {
                    const next = getLessonById(event.target.value);
                    if (next) selectLesson(next, true);
                  }}
                  className="mt-1 w-full cursor-pointer rounded-lg border border-[var(--surface-line)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--surface-text)]"
                >
                  {sectionLessons.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.id} — {lesson.title}
                      {progress[lesson.id]?.rating ? " ✓" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Desktop / Tablet vertical lesson rail */}
              <div
                role="group"
                aria-label="Lessons in current section"
                className="study-sections hidden lg:grid"
              >
                {sectionLessons.map((lesson) => {
                  const isActive = lesson.id === activeLesson.id;
                  const entry = progress[lesson.id];
                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => selectLesson(lesson, true)}
                      aria-pressed={isActive}
                      aria-current={isActive ? "page" : undefined}
                      className="study-section-button"
                    >
                      <span>{lesson.id}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-1">
                          <strong className="line-clamp-2 font-semibold text-[12px] leading-snug text-left">
                            {lesson.title}
                          </strong>
                          {entry?.rating && (
                            <CheckCircle2
                              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#5d7d48] dark:text-[#c9dfb2]"
                              aria-label="Completed"
                            />
                          )}
                        </div>
                        <small className="mt-0.5 block font-mono text-[10px] text-[var(--surface-muted)]">
                          {lesson.minutes} min
                          {entry?.rating ? ` · ${entry.rating}` : ""}
                        </small>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="study-mode-shortcuts">
              {onOpenPractice && (
                <button
                  type="button"
                  onClick={() => onOpenPractice(activeSection.code)}
                  className="study-shortcut"
                >
                  <Target size={16} aria-hidden="true" />
                  <span>Practice Section {activeSection.code}</span>
                </button>
              )}
              {onOpenChecklist && (
                <button
                  type="button"
                  onClick={onOpenChecklist}
                  className="study-shortcut"
                >
                  <ListChecks size={16} aria-hidden="true" />
                  <span>0264 Syllabus Checklist</span>
                </button>
              )}
            </div>
          </aside>

          {/* Right Main Reader Column */}
          <div className="min-w-0">
            <InteractiveLessonCard
              key={`${activeLesson.id}-${resetNonce}`}
              lesson={activeLesson}
              section={activeSection}
              progressEntry={progress[activeLesson.id]}
              hints={hints}
              onHint={handleHint}
              onHideConcept={handleHideConcept}
              onToggleTerm={handleToggleTerm}
              onResetLessonTerms={handleResetLessonTerms}
              onRate={handleRateLesson}
              onPrevious={() => previousLesson && selectLesson(previousLesson, true)}
              onNext={() => nextLesson && selectLesson(nextLesson, true)}
              previousLesson={previousLesson}
              nextLesson={nextLesson}
              onOpenPractice={onOpenPractice ?? (() => {})}
              onOpenChecklist={onOpenChecklist ?? (() => {})}
              positionInSection={positionInSection}
              totalInSection={sectionLessons.length}
            />
          </div>
        </div>
      </div>

      <p className="mx-auto mt-5 max-w-3xl text-center text-[11px] leading-relaxed text-[var(--muted,#4b5c54)] dark:text-neutral-500">
        Lesson content follows the Cambridge IGCSE Business 0264 syllabus for examination
        in 2027–2029 and the Sixth Edition textbook. Progress, confidence ratings and hint
        reveals are stored locally in this browser.
      </p>
    </div>
  );
}

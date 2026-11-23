import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  RotateCcw,
  Swords,
  Target,
  Trash2,
  XCircle,
} from "lucide-react";
import {
  clearReviewAnswers,
  loadReviewAnswers,
  MASTERY_DAYS_REQUIRED,
  moveReviewAnswerToWrong,
  recordReviewPracticeMiss,
  removeReviewAnswer,
  type ReviewAnswerEntry,
} from "../lib/mcq-review";

interface MistakeReviewProps {
  onOpenBossBattle?: () => void;
  onOpenMcq?: () => void;
}

function sortByRecent(list: ReviewAnswerEntry[]): ReviewAnswerEntry[] {
  return [...list].sort((a, b) => b.missedAt - a.missedAt);
}

export function MistakeReview({ onOpenBossBattle, onOpenMcq }: MistakeReviewProps) {
  const [entries, setEntries] = useState<ReviewAnswerEntry[]>(() =>
    sortByRecent(Object.values(loadReviewAnswers()))
  );
  const [view, setView] = useState<"list" | "practice">("list");
  const [practiceIds, setPracticeIds] = useState<string[]>([]);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const refresh = () => setEntries(sortByRecent(Object.values(loadReviewAnswers())));

  const handleMoveToWrong = (id: string) => {
    if (moveReviewAnswerToWrong(id)) {
      setNotice(
        `Moved to MCQ Wrong Only. Answer it correctly on ${MASTERY_DAYS_REQUIRED} different days to clear it.`
      );
      refresh();
    }
  };

  const handleMoveAll = () => {
    const all = Object.values(loadReviewAnswers());
    if (all.length === 0) return;
    all.forEach((entry) => moveReviewAnswerToWrong(entry.id));
    setNotice(
      `Moved ${all.length} question${all.length === 1 ? "" : "s"} to MCQ Wrong Only.`
    );
    refresh();
  };

  const handleDismiss = (id: string) => {
    removeReviewAnswer(id);
    refresh();
  };

  const handleClearAll = () => {
    if (!window.confirm("Remove every question from your review list?")) return;
    clearReviewAnswers();
    refresh();
  };

  const startPractice = (ids: string[]) => {
    if (ids.length === 0) return;
    setPracticeIds(ids);
    setPracticeIndex(0);
    setSelectedIndex(null);
    setFeedback(null);
    setNotice(null);
    setView("practice");
  };

  const handlePracticeAnswer = (index: number) => {
    if (feedback || selectedIndex !== null) return;
    const entry = entries.find((item) => item.id === practiceIds[practiceIndex]);
    if (!entry) return;
    setSelectedIndex(index);

    if (index === entry.correctIndex) {
      removeReviewAnswer(entry.id);
      refresh();
      setFeedback({
        correct: true,
        message: "Correct — this question has been cleared from your review list.",
      });
    } else {
      recordReviewPracticeMiss(entry.id);
      refresh();
      setFeedback({
        correct: false,
        message: "Not quite. It stays in your review list so you can try again another time.",
      });
    }
  };

  const handleNextPractice = () => {
    if (practiceIndex < practiceIds.length - 1) {
      setPracticeIndex((i) => i + 1);
      setSelectedIndex(null);
      setFeedback(null);
    } else {
      setView("list");
      setPracticeIds([]);
      setPracticeIndex(0);
      setSelectedIndex(null);
      setFeedback(null);
      refresh();
    }
  };

  const activeEntry = entries.find((item) => item.id === practiceIds[practiceIndex]);

  return (
    <div className="study-page">
      <header className="study-hero">
        <div className="study-hero-content">
          <p className="study-hero-kicker">Cambridge IGCSE Business Studies · Mistake review</p>
          <h1 className="study-title">
            Mistake <span>Review</span>
          </h1>
          <p className="study-description">
            Questions you get wrong in Boss Battle land here. Review the mark scheme answer,
            practise them again, and decide which ones deserve a place in the MCQ Wrong Only bank.
          </p>
          <div className="study-hero-actions">
            {onOpenBossBattle && (
              <button
                type="button"
                onClick={onOpenBossBattle}
                className="study-action btn-primary whitespace-nowrap shrink-0"
              >
                <Swords size={16} aria-hidden="true" />
                <span>Back to Boss Battle</span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            )}
            {onOpenMcq && (
              <button
                type="button"
                onClick={onOpenMcq}
                className="study-action study-secondary-action whitespace-nowrap shrink-0"
              >
                <Target size={16} aria-hidden="true" />
                <span>Open MCQ Drills</span>
              </button>
            )}
          </div>
          <p className="mt-3 font-mono text-[11px] font-semibold tabular-nums text-white/75">
            {entries.length} question{entries.length === 1 ? "" : "s"} waiting for review
          </p>
        </div>
        <div className="study-hero-image" aria-hidden="true" />
      </header>

      <div className="study-studio">
        <div className="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-practice)] p-4 text-xs leading-relaxed text-[var(--surface-muted)]">
          <strong className="text-[var(--surface-text)]">How it works:</strong> practise a mistake here
          until you are happy with it, then choose <em>Move to Wrong Only</em> to drill it in the MCQ
          bank. A question only leaves Wrong Only after you answer it correctly on{" "}
          {MASTERY_DAYS_REQUIRED} different days — getting it wrong resets the count.
        </div>

        {notice && (
          <div
            role="status"
            className="mt-3 rounded-xl border border-[var(--surface-accent)] bg-[var(--sheet-sage)] p-3 text-xs font-semibold text-[var(--surface-text)]"
          >
            {notice}
          </div>
        )}

        <div className="study-mode-bar mt-4">
          <div role="group" aria-label="Review view" className="study-mode-options max-sm:!grid-cols-2">
            <button
              type="button"
              onClick={() => setView("list")}
              aria-pressed={view === "list"}
              className="study-mode-button"
            >
              <ClipboardList size={17} aria-hidden="true" />
              <span>Review list</span>
              <small className="font-mono text-[10px] opacity-70 tabular-nums">{entries.length}</small>
            </button>
            <button
              type="button"
              onClick={() => startPractice(entries.map((entry) => entry.id))}
              disabled={entries.length === 0}
              aria-pressed={view === "practice"}
              className="study-mode-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw size={17} aria-hidden="true" />
              <span>Practise all</span>
              <small className="font-mono text-[10px] opacity-70 tabular-nums">{entries.length}</small>
            </button>
          </div>
        </div>

        {view === "list" ? (
          <div className="study-panel-padding">
            {entries.length === 0 ? (
              <div className="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-practice)] p-6 sm:p-8 text-center">
                <p className="study-panel-kicker">Nothing to review</p>
                <h3 className="mt-1 font-[var(--font-serif)] text-xl font-semibold text-[var(--surface-text)]">
                  Your review list is empty
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-[var(--surface-muted)]">
                  Any question you answer incorrectly in Boss Battle will appear here for review and
                  practice.
                </p>
                {onOpenBossBattle && (
                  <button
                    type="button"
                    onClick={onOpenBossBattle}
                    className="study-action btn-primary mt-5"
                  >
                    <Swords size={15} aria-hidden="true" />
                    <span>Play Boss Battle</span>
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-[var(--surface-muted)]">
                    {entries.length} mistake{entries.length === 1 ? "" : "s"} banked from Boss Battle.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleMoveAll}
                      className="study-action btn-primary !min-h-[2rem] !py-1 !px-2.5 text-xs whitespace-nowrap"
                    >
                      <Target size={13} aria-hidden="true" />
                      <span>Move all to Wrong Only</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="study-action study-secondary-action !min-h-[2rem] !py-1 !px-2.5 text-xs whitespace-nowrap"
                    >
                      <Trash2 size={13} aria-hidden="true" />
                      <span>Clear review list</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-soft)] p-4 sm:p-5 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-[11px] font-semibold text-[var(--surface-muted)] tabular-nums">
                          {entry.unit ? `Unit ${entry.unit} · ` : ""}
                          {entry.chapter} · missed {entry.missCount}×
                        </span>
                        <span className="font-mono text-[11px] text-[var(--surface-muted)]">
                          {new Date(entry.missedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="study-prompt text-[var(--surface-text)]">{entry.question}</h3>

                      <div className="space-y-1.5">
                        {entry.options.map((option, index) => (
                          <div
                            key={index}
                            className={`flex items-start gap-2.5 rounded-lg border p-2.5 text-xs sm:text-sm leading-relaxed ${
                              index === entry.correctIndex
                                ? "border-[var(--surface-accent)] bg-[var(--sheet-sage)] text-[var(--surface-text)] font-medium"
                                : "border-[var(--surface-line)] bg-[var(--surface)] text-[var(--surface-text)]"
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-md border flex items-center justify-center font-mono text-[11px] font-bold shrink-0 ${
                                index === entry.correctIndex
                                  ? "bg-[var(--surface-accent)] border-transparent text-[var(--hero-text)] dark:text-[var(--primary-btn-text)]"
                                  : "bg-[var(--surface-soft)] border-[var(--surface-line)] text-[var(--surface-muted)]"
                              }`}
                            >
                              {index === entry.correctIndex ? (
                                <CheckCircle2 size={13} aria-hidden="true" />
                              ) : (
                                String.fromCharCode(65 + index)
                              )}
                            </span>
                            <span>{option}</span>
                          </div>
                        ))}
                      </div>

                      <p className="text-xs text-[var(--surface-accent)]">
                        <strong className="font-mono mr-1.5">Mark scheme:</strong>
                        {entry.explanation}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[var(--surface-line)]">
                        <button
                          type="button"
                          onClick={() => startPractice([entry.id])}
                          className="study-action btn-primary !min-h-[2rem] !py-1 !px-2.5 text-xs whitespace-nowrap"
                        >
                          <RotateCcw size={13} aria-hidden="true" />
                          <span>Practise this</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveToWrong(entry.id)}
                          className="study-action study-secondary-action !min-h-[2rem] !py-1 !px-2.5 text-xs whitespace-nowrap"
                        >
                          <Target size={13} aria-hidden="true" />
                          <span>Move to Wrong Only</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDismiss(entry.id)}
                          className="text-xs font-semibold text-[#97532b] dark:text-[#f6bb83] hover:underline px-2 py-1 whitespace-nowrap"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="study-panel-padding">
            {!activeEntry ? (
              <div className="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-practice)] p-6 sm:p-8 text-center">
                <p className="text-sm text-[var(--surface-muted)]">
                  This question has already been cleared from your review list.
                </p>
                <button
                  type="button"
                  onClick={handleNextPractice}
                  className="study-action btn-primary mt-4"
                >
                  <span>Continue</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-[var(--surface-text)] tabular-nums">
                    Question {practiceIndex + 1} of {practiceIds.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setView("list");
                      setFeedback(null);
                      setSelectedIndex(null);
                    }}
                    className="text-xs font-semibold text-[var(--surface-muted)] hover:underline flex items-center gap-1"
                  >
                    <ArrowLeft size={13} aria-hidden="true" />
                    Back to review list
                  </button>
                </div>

                <div className="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-soft)] p-4 sm:p-5">
                  <p className="study-panel-kicker mb-2">
                    {activeEntry.unit ? `Unit ${activeEntry.unit} · ` : ""}
                    {activeEntry.chapter}
                  </p>
                  <h3 className="study-prompt text-[var(--surface-text)]">{activeEntry.question}</h3>
                </div>

                <div className="space-y-2.5">
                  {activeEntry.options.map((option, index) => {
                    const isSelected = selectedIndex === index;
                    const isCorrect = index === activeEntry.correctIndex;
                    let classes =
                      "bg-[var(--surface)] border-[var(--surface-line)] hover:border-[var(--surface-accent)] hover:bg-[var(--surface-practice)]/55 text-[var(--surface-text)]";
                    if (feedback) {
                      if (isCorrect) {
                        classes =
                          "bg-[var(--sheet-sage)] border-[var(--surface-accent)] text-[var(--surface-text)] font-medium";
                      } else if (isSelected) {
                        classes =
                          "bg-[var(--sheet-rose)] border-[var(--sheet-rose-line)] text-[var(--surface-text)]";
                      } else {
                        classes = "opacity-55 bg-[var(--surface-soft)] border-[var(--surface-line)] text-[var(--surface-muted)]";
                      }
                    }

                    return (
                      <button
                        key={index}
                        type="button"
                        disabled={Boolean(feedback)}
                        onClick={() => handlePracticeAnswer(index)}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm leading-relaxed transition-colors flex items-start gap-3 ${classes} ${
                          feedback ? "cursor-default" : "cursor-pointer"
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-md border flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 ${
                            feedback && isCorrect
                              ? "bg-[var(--surface-accent)] border-transparent text-[var(--hero-text)] dark:text-[var(--primary-btn-text)]"
                              : feedback && isSelected
                                ? "bg-[#97532b] border-transparent text-white"
                                : "bg-[var(--surface-soft)] border-[var(--surface-line)] text-[var(--surface-muted)]"
                          }`}
                        >
                          {feedback && isCorrect ? (
                            <CheckCircle2 size={14} aria-hidden="true" />
                          ) : feedback && isSelected ? (
                            <XCircle size={14} aria-hidden="true" />
                          ) : (
                            String.fromCharCode(65 + index)
                          )}
                        </span>
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>

                {feedback && (
                  <div
                    role="status"
                    className={`rounded-xl border p-4 text-xs ${
                      feedback.correct
                        ? "border-[var(--sheet-sage-line)] bg-[var(--sheet-sage)]"
                        : "border-[var(--sheet-rose-line)] bg-[var(--sheet-rose)]"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold text-sm text-[var(--surface-text)]">
                      {feedback.correct ? (
                        <CheckCircle2 size={16} className="shrink-0 text-[var(--surface-accent)]" aria-hidden="true" />
                      ) : (
                        <XCircle size={16} className="shrink-0 text-[#97532b] dark:text-[#f6bb83]" aria-hidden="true" />
                      )}
                      <span>{feedback.message}</span>
                    </div>
                    <p className="mt-2 text-[var(--surface-muted)]">{activeEntry.explanation}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleNextPractice}
                        className="study-action btn-primary whitespace-nowrap"
                      >
                        <span>
                          {practiceIndex < practiceIds.length - 1 ? "Next Question" : "Finish Practice"}
                        </span>
                        <ArrowRight size={15} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveToWrong(activeEntry.id)}
                        className="study-action study-secondary-action whitespace-nowrap"
                      >
                        <Target size={15} aria-hidden="true" />
                        <span>Move to Wrong Only</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

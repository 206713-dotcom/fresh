import React, { useState, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
import {
  ArrowRight,
  CheckCircle2,
  Headphones,
  Layers,
  RotateCcw,
  Target,
  XCircle,
  Zap,
} from "lucide-react";
import { MCQ_BANK, MCQItem } from "../lib/data/mcq-bank";
import {
  saveQuickQuizDraft,
  loadQuickQuizDraft,
  clearQuickQuizDraft,
  awardBonusStudyCoins,
} from "../lib/cookies";
import { DailyWeeklyChallenge } from "./DailyWeeklyChallenge";

interface DailyQuickQuizProps {
  onOpenFullGlossary?: () => void;
  onOpenStudySpace?: () => void;
  onOpenPractice?: () => void;
}

export interface QuizQuestionInstance {
  item: MCQItem;
  options: string[];
  correctAnswer: string;
}

const SECTION_LABELS: Record<string, string> = {
  "1": "Business Activity",
  "2": "People in Business",
  "3": "Marketing",
  "4": "Operations",
  "5": "Finance",
  "6": "External Influences",
};

/**
 * Generate 3 tricky distractors for a target MCQItem
 * Pulls from the same or related chapters to test true exact knowledge
 */
function generateTrickyDistractors(target: MCQItem, allItems: MCQItem[]): string[] {
  const sameChapterCandidates = allItems.filter(
    (item) => item.id !== target.id && item.chapter === target.chapter && item.correctAnswer !== target.correctAnswer,
  );

  const otherCandidates = allItems.filter(
    (item) => item.id !== target.id && item.chapter !== target.chapter && item.correctAnswer !== target.correctAnswer,
  );

  const distractors: string[] = [];

  const shuffledSame = [...sameChapterCandidates].sort(() => 0.5 - Math.random());
  for (let i = 0; i < Math.min(2, shuffledSame.length); i++) {
    if (!distractors.includes(shuffledSame[i].correctAnswer)) {
      distractors.push(shuffledSame[i].correctAnswer);
    }
  }

  const shuffledOthers = [...otherCandidates].sort(() => 0.5 - Math.random());
  for (let i = 0; i < shuffledOthers.length && distractors.length < 3; i++) {
    if (!distractors.includes(shuffledOthers[i].correctAnswer)) {
      distractors.push(shuffledOthers[i].correctAnswer);
    }
  }

  while (distractors.length < 3) {
    const randomPick = allItems[Math.floor(Math.random() * allItems.length)];
    if (randomPick.correctAnswer !== target.correctAnswer && !distractors.includes(randomPick.correctAnswer)) {
      distractors.push(randomPick.correctAnswer);
    }
  }

  return distractors;
}

/**
 * Build a set of quiz questions with shuffled options
 */
function buildQuizSet(pool: MCQItem[], count: number): QuizQuestionInstance[] {
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return selected.map((item) => {
    const distractors = generateTrickyDistractors(item, MCQ_BANK);
    const options = [item.correctAnswer, ...distractors].sort(() => 0.5 - Math.random());
    return {
      item,
      options,
      correctAnswer: item.correctAnswer,
    };
  });
}

export function DailyQuickQuiz({
  onOpenFullGlossary,
  onOpenStudySpace,
  onOpenPractice,
}: DailyQuickQuizProps) {
  const [activeMode, setActiveMode] = useState<"challenge" | "drill">("challenge");

  const savedDraft = useMemo(() => loadQuickQuizDraft(), []);

  const WRONG_KEY = "ecbiz_mcq_wrong";
  const [wrongIds, setWrongIds] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(WRONG_KEY) || "[]"));
    } catch {
      return new Set();
    }
  });
  const [wrongOnly, setWrongOnly] = useState<boolean>(false);

  const [selectedSection, setSelectedSection] = useState<string>(() => savedDraft?.selectedSection || "all");
  const [selectedSubTopic, setSelectedSubTopic] = useState<string>(() => savedDraft?.selectedSubTopic || "all");
  const [quizSize, setQuizSize] = useState<number>(() => savedDraft?.quizSize || 3);

  // Extract all unique sections (1-6)
  const allSections = useMemo(() => {
    const set = new Set<string>();
    MCQ_BANK.forEach((q) => set.add(q.section));
    return Array.from(set).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  }, []);

  // Sub-topics available for the currently selected section
  const subTopicsForSelection = useMemo(() => {
    const set = new Set<string>();
    MCQ_BANK.forEach((q) => {
      if (selectedSection === "all" || q.section === selectedSection) {
        set.add(q.chapter);
      }
    });
    return Array.from(set).sort();
  }, [selectedSection]);

  // Active quiz pool
  const filteredPool = useMemo(() => {
    return MCQ_BANK.filter((q) => {
      if (selectedSection !== "all" && q.section !== selectedSection) return false;
      if (selectedSubTopic !== "all" && q.chapter !== selectedSubTopic) return false;
      if (wrongOnly && !wrongIds.has(q.id)) return false;
      return true;
    });
  }, [selectedSection, selectedSubTopic, wrongOnly, wrongIds]);

  // Quiz state
  const [questions, setQuestions] = useState<QuizQuestionInstance[]>(() => {
    if (savedDraft?.questions && savedDraft.questions.length > 0) {
      return savedDraft.questions;
    }
    return buildQuizSet(MCQ_BANK, 3);
  });
  const [currentIndex, setCurrentIndex] = useState<number>(() => savedDraft?.currentIndex || 0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(() => savedDraft?.score || 0);
  const [streak, setStreak] = useState<number>(() => savedDraft?.streak || 0);
  const [maxStreak, setMaxStreak] = useState<number>(() => savedDraft?.maxStreak || 0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [answersHistory, setAnswersHistory] = useState<
    {
      item: MCQItem;
      selected: string;
      isCorrect: boolean;
    }[]
  >(() => savedDraft?.answersHistory || []);

  // Autosave quiz in-progress state to localStorage
  useEffect(() => {
    if (!quizCompleted && questions.length > 0 && answersHistory.length > 0) {
      saveQuickQuizDraft({
        questions,
        currentIndex,
        score,
        streak,
        maxStreak,
        answersHistory,
        quizSize,
        selectedSection,
        selectedSubTopic,
      });
    }
  }, [
    questions,
    currentIndex,
    score,
    streak,
    maxStreak,
    answersHistory,
    quizSize,
    selectedSection,
    selectedSubTopic,
    quizCompleted,
  ]);

  // Start new quiz
  const handleStartNewQuiz = (
    newSize?: number,
    newSection?: string,
    newSubTopic?: string,
    nextWrongOnly?: boolean,
  ) => {
    clearQuickQuizDraft();
    const size = newSize ?? quizSize;
    const section = newSection ?? selectedSection;
    const sub = newSubTopic ?? selectedSubTopic;
    const onlyWrong = nextWrongOnly ?? wrongOnly;
    const pool = MCQ_BANK.filter((q) => {
      if (section !== "all" && q.section !== section) return false;
      if (sub !== "all" && q.chapter !== sub) return false;
      if (onlyWrong && !wrongIds.has(q.id)) return false;
      return true;
    });
    const newQuestions = buildQuizSet(pool, size);

    setQuestions(newQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setQuizCompleted(false);
    setAnswersHistory([]);
  };

  const handleSelectOption = (option: string) => {
    if (hasAnswered) return;
    setSelectedOption(option);
    setHasAnswered(true);

    const current = questions[currentIndex];
    const isCorrect = option === current.correctAnswer;

    // Track MCQ progress for Google Sheet sync
    try {
      const completed = Number(localStorage.getItem("ecbiz_mcq_completed") || "0") + 1;
      localStorage.setItem("ecbiz_mcq_completed", String(completed));
    } catch {}

    if (isCorrect) {
      setScore((s) => s + 1);
      setStreak((st) => {
        const next = st + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
      setWrongIds((prev) => {
        const next = new Set(prev);
        next.delete(current.item.id);
        try {
          localStorage.setItem(WRONG_KEY, JSON.stringify([...next]));
        } catch {}
        return next;
      });
      awardBonusStudyCoins(15);
    } else {
      setStreak(0);
      setWrongIds((prev) => {
        const next = new Set(prev);
        next.add(current.item.id);
        try {
          localStorage.setItem(WRONG_KEY, JSON.stringify([...next]));
        } catch {}
        return next;
      });
      awardBonusStudyCoins(5);
    }

    setAnswersHistory((h) => [
      ...h,
      {
        item: current.item,
        selected: option,
        isCorrect,
      },
    ]);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      setQuizCompleted(true);
      clearQuickQuizDraft();
      awardBonusStudyCoins(25);
      const finalScore = score + (selectedOption === questions[currentIndex]?.correctAnswer ? 0 : 0);
      const pct = questions.length > 0 ? (finalScore / questions.length) * 100 : 0;
      if (pct >= 70) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#203e32", "#e4eeb2", "#f6bb83", "#97532b"],
        });
      }
    }
  };

  const switchModeAndFocus = (mode: "challenge" | "drill") => {
    setActiveMode(mode);
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        document.getElementById("quiz-studio-workspace")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  };

  const currentQ = questions[currentIndex];
  const scorePercent = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  return (
    <div className="study-page">
      {/* Studio Hero Header matching Paper 1, Paper 2, and Interactive Lessons */}
      <header className="study-hero">
        <div className="study-hero-content">
          <p className="study-hero-kicker">Cambridge IGCSE Business Studies · 0264 / 0450</p>
          <h1 className="study-title">
            Quick Quiz <span>&amp; Daily Challenge</span>
          </h1>
          <p className="study-description">
            Test active recall under 60-second timed exam conditions or drill{" "}
            {MCQ_BANK.length.toLocaleString()} syllabus MCQs across all six Business Studies units.
          </p>

          <div className="study-hero-actions">
            {activeMode === "challenge" ? (
              <button
                type="button"
                onClick={() => switchModeAndFocus("drill")}
                className="study-action btn-primary whitespace-nowrap shrink-0"
              >
                <Target size={16} aria-hidden="true" />
                <span>Start Chapter Drill</span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => switchModeAndFocus("challenge")}
                className="study-action btn-primary whitespace-nowrap shrink-0"
              >
                <Zap size={16} aria-hidden="true" />
                <span>Open 60s Challenge</span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            )}

            {onOpenFullGlossary && (
              <button
                type="button"
                onClick={onOpenFullGlossary}
                className="study-action study-secondary-action whitespace-nowrap shrink-0"
              >
                <Layers size={16} aria-hidden="true" />
                <span>0264 Flashcards</span>
              </button>
            )}

            {onOpenPractice && (
              <button
                type="button"
                onClick={onOpenPractice}
                className="study-action study-secondary-action whitespace-nowrap shrink-0"
              >
                <span>Practice Studio</span>
                <ArrowRight size={15} aria-hidden="true" />
              </button>
            )}
          </div>

          <p className="mt-3 font-mono text-[11px] font-semibold tabular-nums text-white/75">
            {MCQ_BANK.length.toLocaleString()} MCQ questions · {allSections.length} sections ·{" "}
            {wrongIds.size} flagged for review
          </p>
        </div>
        <div className="study-hero-image" aria-hidden="true" />
      </header>

      {/* Unified Examination Studio Workspace */}
      <div id="quiz-studio-workspace" className="study-studio">
        <div className="study-mode-bar">
          <div role="group" aria-label="Quiz mode" className="study-mode-options max-sm:!grid-cols-2">
            <button
              type="button"
              onClick={() => setActiveMode("challenge")}
              aria-pressed={activeMode === "challenge"}
              className="study-mode-button max-sm:!flex-row max-sm:!justify-center max-sm:!min-h-[3rem] max-sm:!px-2.5 max-sm:!gap-1.5"
            >
              <Zap size={17} aria-hidden="true" />
              <span>Daily &amp; Weekly Challenge</span>
              <small className="font-mono text-[10px] opacity-70 tabular-nums">60s</small>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode("drill")}
              aria-pressed={activeMode === "drill"}
              className="study-mode-button max-sm:!flex-row max-sm:!justify-center max-sm:!min-h-[3rem] max-sm:!px-2.5 max-sm:!gap-1.5"
            >
              <Target size={17} aria-hidden="true" />
              <span>Chapter Active Recall Drills</span>
              <small className="font-mono text-[10px] opacity-70 tabular-nums">
                {MCQ_BANK.length.toLocaleString()}
              </small>
            </button>
          </div>

          <div className="py-2 font-mono text-[11px] font-semibold tabular-nums text-[var(--surface-muted)]">
            {activeMode === "challenge"
              ? "UTC synchronized · +50 daily / +150 weekly coins"
              : `${filteredPool.length.toLocaleString()} matching questions`}
          </div>
        </div>

        {activeMode === "challenge" ? (
          <DailyWeeklyChallenge
            onOpenStudySpace={onOpenStudySpace}
            onNavigateToPractice={onOpenPractice}
          />
        ) : (
          <div className="study-workspace">
            {/* Left Section Rail */}
            <aside className="study-section-rail" aria-label="Syllabus section filter">
              <div>
                <h2 className="study-panel-kicker">Syllabus sections</h2>
                <div role="group" aria-label="Filter drills by syllabus section" className="study-sections">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSection("all");
                      setSelectedSubTopic("all");
                      handleStartNewQuiz(quizSize, "all", "all");
                    }}
                    aria-pressed={selectedSection === "all"}
                    className="study-section-button"
                  >
                    <span>All</span>
                    <strong className="font-semibold text-[12px] leading-tight truncate text-left">
                      All Units
                    </strong>
                  </button>

                  {allSections.map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => {
                        setSelectedSection(sec);
                        setSelectedSubTopic("all");
                        handleStartNewQuiz(quizSize, sec, "all");
                      }}
                      aria-pressed={selectedSection === sec}
                      className="study-section-button"
                    >
                      <span>0{sec}</span>
                      <strong className="font-semibold text-[12px] leading-tight truncate text-left">
                        {SECTION_LABELS[sec] || `Section ${sec}`}
                      </strong>
                    </button>
                  ))}
                </div>
              </div>

              <div className="study-mode-shortcuts">
                <button
                  type="button"
                  onClick={() => {
                    const next = !wrongOnly;
                    setWrongOnly(next);
                    handleStartNewQuiz(quizSize, selectedSection, selectedSubTopic, next);
                  }}
                  aria-pressed={wrongOnly}
                  title="Practice only questions you previously answered incorrectly"
                  className={`study-shortcut justify-between ${
                    wrongOnly
                      ? "bg-[var(--sheet-rose)] text-[var(--surface-text)] border border-[var(--sheet-rose-line)]"
                      : ""
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <XCircle size={15} className="shrink-0" aria-hidden="true" />
                    <span className="truncate">{wrongOnly ? "Wrong Only (Active)" : "Wrong Only"}</span>
                  </span>
                  <small className="font-mono text-[10px] opacity-75 tabular-nums">
                    {wrongIds.size}
                  </small>
                </button>

                {onOpenFullGlossary && (
                  <button type="button" onClick={onOpenFullGlossary} className="study-shortcut">
                    <Layers size={15} aria-hidden="true" />
                    <span>0264 Flashcards</span>
                  </button>
                )}

                {onOpenPractice && (
                  <button type="button" onClick={onOpenPractice} className="study-shortcut">
                    <ArrowRight size={15} aria-hidden="true" />
                    <span>Practice Studio</span>
                  </button>
                )}

                {onOpenStudySpace && (
                  <button type="button" onClick={onOpenStudySpace} className="study-shortcut">
                    <Headphones size={15} aria-hidden="true" />
                    <span>Study Space</span>
                  </button>
                )}
              </div>
            </aside>

            {/* Right Main Drill Stage */}
            <div className="min-w-0 study-paper-one-editor">
              {/* Flush Filter Toolbar */}
              <div className="study-panel-header border-b border-[var(--surface-line)] bg-[var(--surface-soft)]/55">
                <div className="min-w-0">
                  <p className="study-panel-kicker">Cambridge Active Recall MCQ Bank</p>
                  <h2 className="study-panel-title text-[var(--surface-text)] mt-0.5 truncate">
                    {selectedSubTopic !== "all"
                      ? selectedSubTopic
                      : selectedSection === "all"
                        ? "All Syllabus Sub-topics"
                        : `Section ${selectedSection}: ${SECTION_LABELS[selectedSection] || ""}`}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Sub-topic Filter */}
                  <select
                    aria-label="Filter by sub-topic"
                    value={selectedSubTopic}
                    onChange={(e) => {
                      const sub = e.target.value;
                      setSelectedSubTopic(sub);
                      handleStartNewQuiz(quizSize, selectedSection, sub);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--surface-line)] bg-[var(--surface)] text-[var(--surface-text)] max-w-[210px] truncate cursor-pointer"
                  >
                    <option value="all">All Sub-topics</option>
                    {subTopicsForSelection.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>

                  {/* Quiz Size Segmented Control matching .study-engine */}
                  <div role="group" aria-label="Number of questions" className="study-engine">
                    {[3, 5, 10, 20].map((size) => (
                      <button
                        key={size}
                        type="button"
                        aria-pressed={quizSize === size}
                        onClick={() => {
                          setQuizSize(size);
                          handleStartNewQuiz(size, selectedSection, selectedSubTopic);
                        }}
                        className="study-engine-option font-mono tabular-nums"
                      >
                        {size}Q
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStartNewQuiz()}
                    title="Randomize new question set"
                    className="study-action study-secondary-action !min-h-[2rem] !py-1 !px-2.5 text-xs whitespace-nowrap"
                  >
                    <RotateCcw size={13} aria-hidden="true" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              <div className="study-panel-padding">
                {questions.length === 0 ? (
                  <div className="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-practice)] p-6 sm:p-8 text-center">
                    <p className="study-panel-kicker">No Questions Matching Filter</p>
                    <h3 className="mt-1 font-[var(--font-serif)] text-xl font-semibold text-[var(--surface-text)]">
                      {wrongOnly
                        ? "You have no flagged mistakes in this selection"
                        : "No MCQs found for this filter"}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-[var(--surface-muted)]">
                      {wrongOnly
                        ? "Every question answered wrong goes into your review bank until you get it right."
                        : "Try broadening your section or sub-topic filter to start a drill."}
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                      {wrongOnly && (
                        <button
                          type="button"
                          onClick={() => {
                            setWrongOnly(false);
                            handleStartNewQuiz(quizSize, selectedSection, selectedSubTopic, false);
                          }}
                          className="study-action btn-primary"
                        >
                          Show All Matching Questions
                        </button>
                      )}
                      {selectedSubTopic !== "all" && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSubTopic("all");
                            handleStartNewQuiz(quizSize, selectedSection, "all");
                          }}
                          className="study-action study-secondary-action"
                        >
                          Reset Sub-topic Filter
                        </button>
                      )}
                    </div>
                  </div>
                ) : !quizCompleted && currentQ ? (
                  <div className="space-y-5">
                    {/* Progress & Score Strip */}
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--surface-muted)] mb-2 font-mono tabular-nums">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[var(--surface-text)]">
                            Question {currentIndex + 1} of {questions.length}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>
                            Score{" "}
                            <strong className="text-[var(--surface-accent)]">
                              {score} / {currentIndex}
                            </strong>
                          </span>
                        </div>

                        {streak >= 2 && (
                          <span className="font-bold text-[#97532b] dark:text-[#f6bb83]">
                            {streak} question streak
                          </span>
                        )}
                      </div>

                      <div
                        role="progressbar"
                        aria-label="Quiz progress"
                        aria-valuemin={1}
                        aria-valuemax={questions.length}
                        aria-valuenow={currentIndex + 1}
                        className="w-full h-1.5 rounded-full bg-[var(--surface-line)] overflow-hidden"
                      >
                        <div
                          className="h-full rounded-full bg-[var(--surface-accent)] transition-[width] duration-300"
                          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Question Prompt Card */}
                    <div className="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-soft)] p-4 sm:p-5">
                      <p className="study-panel-kicker mb-2">
                        Question #{currentQ.item.questionNumber} · {currentQ.item.chapter} ·{" "}
                        {currentQ.item.questionType || "Definition"}
                      </p>

                      <h3 className="study-prompt text-[var(--surface-text)]">
                        {currentQ.item.question}
                      </h3>

                      <p className="mt-1.5 text-xs text-[var(--surface-muted)]">
                        Select the exact textbook definition or mark scheme answer below.
                      </p>
                    </div>

                    {/* Shuffled MCQ Options */}
                    <div className="space-y-2.5">
                      {currentQ.options.map((option, idx) => {
                        const isSelected = selectedOption === option;
                        const isCorrect = option === currentQ.correctAnswer;
                        const letter = String.fromCharCode(65 + idx);

                        let cardClasses =
                          "bg-[var(--surface)] border-[var(--surface-line)] hover:border-[var(--surface-accent)] hover:bg-[var(--surface-practice)]/55 text-[var(--surface-text)]";
                        let keyCapClasses =
                          "bg-[var(--surface-soft)] border-[var(--surface-line)] text-[var(--surface-muted)]";

                        if (hasAnswered) {
                          if (isCorrect) {
                            cardClasses =
                              "bg-[var(--sheet-sage)] border-[var(--surface-accent)] text-[var(--surface-text)] font-medium";
                            keyCapClasses =
                              "bg-[var(--surface-accent)] border-transparent text-[var(--hero-text)] dark:text-[var(--primary-btn-text)]";
                          } else if (isSelected && !isCorrect) {
                            cardClasses =
                              "bg-[var(--sheet-rose)] border-[var(--sheet-rose-line)] text-[var(--surface-text)]";
                            keyCapClasses =
                              "bg-[#97532b] border-transparent text-white";
                          } else {
                            cardClasses =
                              "opacity-55 bg-[var(--surface-soft)] border-[var(--surface-line)] text-[var(--surface-muted)]";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={hasAnswered}
                            onClick={() => handleSelectOption(option)}
                            className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm leading-relaxed transition-colors flex items-start gap-3 ${cardClasses} ${
                              hasAnswered ? "cursor-default" : "cursor-pointer"
                            }`}
                          >
                            <span
                              className={`w-7 h-7 rounded-md border flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 ${keyCapClasses}`}
                            >
                              {hasAnswered && isCorrect ? (
                                <CheckCircle2 size={14} aria-hidden="true" />
                              ) : hasAnswered && isSelected ? (
                                <XCircle size={14} aria-hidden="true" />
                              ) : (
                                letter
                              )}
                            </span>
                            <div className="flex-1 min-w-0">
                              <span>{option}</span>
                              {hasAnswered && isCorrect && (
                                <span className="block mt-1 font-mono text-[11px] font-bold text-[var(--surface-accent)]">
                                  Exact Cambridge mark scheme definition
                                </span>
                              )}
                              {hasAnswered && isSelected && !isCorrect && (
                                <span className="block mt-1 font-mono text-[11px] font-bold text-[#97532b] dark:text-[#f6bb83]">
                                  Distractor selected — review the correct definition above
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Examiner Guidance */}
                    {hasAnswered && (
                      <div className="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-practice)] p-4 text-xs space-y-1.5">
                        <div className="flex items-center gap-2 font-semibold text-sm text-[var(--surface-text)]">
                          {selectedOption === currentQ.correctAnswer ? (
                            <>
                              <CheckCircle2
                                size={16}
                                className="shrink-0 text-[var(--surface-accent)]"
                                aria-hidden="true"
                              />
                              <span>Full marks awarded — exact Cambridge knowledge (AO1/AO2).</span>
                            </>
                          ) : (
                            <>
                              <XCircle
                                size={16}
                                className="shrink-0 text-[#97532b] dark:text-[#f6bb83]"
                                aria-hidden="true"
                              />
                              <span>Incorrect option selected — added to Wrong Only review bank.</span>
                            </>
                          )}
                        </div>
                        <p className="text-[var(--surface-muted)] leading-relaxed">
                          <strong className="text-[var(--surface-text)]">Examiner guidance: </strong>
                          In Cambridge Business Studies (0264 / 0450), mark schemes penalise vague
                          or colloquial phrasing. Precision on technical terms and direct business
                          context protects full AO1 and AO2 credit.
                        </p>
                      </div>
                    )}

                    {/* Bottom Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--surface-line)]">
                      <span className="text-xs text-[var(--surface-muted)]">
                        {hasAnswered
                          ? "Review the mark scheme above before moving on."
                          : "Choose one of the four options above."}
                      </span>

                      {hasAnswered && (
                        <button
                          type="button"
                          onClick={handleNextQuestion}
                          className="study-action btn-primary whitespace-nowrap"
                        >
                          <span>
                            {currentIndex < questions.length - 1
                              ? "Next Question"
                              : "Finish Quiz & View Results"}
                          </span>
                          <ArrowRight size={15} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Results Screen */
                  <div className="space-y-6">
                    <div className="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-practice)] p-6 sm:p-8 text-center">
                      <p className="study-panel-kicker">Active Recall Assessment Complete</p>
                      <h3 className="mt-2 font-[var(--font-serif)] text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--surface-text)] tabular-nums">
                        {score} / {questions.length} ({scorePercent}%)
                      </h3>
                      <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-[var(--surface-muted)] leading-relaxed">
                        {score === questions.length
                          ? "100% precision. You nailed every Cambridge definition and avoided every distractor trap."
                          : scorePercent >= 70
                            ? "Strong performance. You accurately identified the majority of verified syllabus definitions."
                            : "Active recall improves rapidly with repetition. Use Wrong Only mode to drill missed items."}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleStartNewQuiz()}
                          className="study-action btn-primary whitespace-nowrap"
                        >
                          <RotateCcw size={15} aria-hidden="true" />
                          <span>Take Another {quizSize} Questions</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setQuizSize(10);
                            handleStartNewQuiz(10);
                          }}
                          className="study-action study-secondary-action whitespace-nowrap"
                        >
                          <Target size={15} aria-hidden="true" />
                          <span>10-Question Master Drill</span>
                        </button>

                        {onOpenFullGlossary && (
                          <button
                            type="button"
                            onClick={onOpenFullGlossary}
                            className="study-action study-secondary-action whitespace-nowrap"
                          >
                            <Layers size={15} aria-hidden="true" />
                            <span>Browse Flashcards</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Detailed Question Review Ledger */}
                    <div>
                      <h4 className="font-[var(--font-serif)] text-base font-semibold text-[var(--surface-text)] mb-3">
                        Session answers review
                      </h4>
                      <div className="space-y-2.5">
                        {answersHistory.map((ans, idx) => (
                          <div
                            key={idx}
                            className={`p-4 rounded-xl border text-xs ${
                              ans.isCorrect
                                ? "bg-[var(--sheet-sage)] border-[var(--sheet-sage-line)]"
                                : "bg-[var(--sheet-rose)] border-[var(--sheet-rose-line)]"
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                              <span className="font-mono text-[11px] font-semibold text-[var(--surface-muted)] tabular-nums">
                                Q{idx + 1} · {ans.item.chapter} · #{ans.item.questionNumber}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 font-mono text-[11px] font-bold ${
                                  ans.isCorrect
                                    ? "text-[var(--surface-accent)]"
                                    : "text-[#97532b] dark:text-[#f6bb83]"
                                }`}
                              >
                                {ans.isCorrect ? (
                                  <>
                                    <CheckCircle2 size={13} aria-hidden="true" />
                                    <span>Correct (+1)</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle size={13} aria-hidden="true" />
                                    <span>Incorrect (0)</span>
                                  </>
                                )}
                              </span>
                            </div>

                            <strong className="block font-[var(--font-serif)] text-sm text-[var(--surface-text)] mb-2 leading-snug">
                              {ans.item.question}
                            </strong>

                            <div className="space-y-1 text-[var(--surface-text)]">
                              <div>
                                <strong className="font-mono text-[11px] uppercase tracking-wider text-[var(--surface-accent)]">
                                  Exact mark scheme:{" "}
                                </strong>
                                <span>{ans.item.correctAnswer}</span>
                              </div>
                              {!ans.isCorrect && (
                                <div className="text-[var(--surface-muted)]">
                                  <strong className="font-mono text-[11px] uppercase tracking-wider text-[#97532b] dark:text-[#f6bb83]">
                                    Your selection:{" "}
                                  </strong>
                                  <span>{ans.selected}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="mx-auto mt-5 max-w-3xl text-center text-[11px] leading-relaxed text-[var(--muted,#4b5c54)] dark:text-neutral-500">
        Active recall questions align with Cambridge IGCSE Business Studies (0264 / 0450). Flagged
        mistakes and Study Coin rewards are saved locally in this browser.
      </p>
    </div>
  );
}

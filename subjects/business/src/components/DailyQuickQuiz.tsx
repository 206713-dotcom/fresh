import React, { useState, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
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
}

export interface QuizQuestionInstance {
  item: MCQItem;
  options: string[];
  correctAnswer: string;
}

/**
 * Generate 3 tricky distractors for a target MCQItem
 * Pulls from the same or related chapters to test true exact knowledge
 */
function generateTrickyDistractors(target: MCQItem, allItems: MCQItem[]): string[] {
  // 1. Same chapter candidates
  const sameChapterCandidates = allItems.filter(
    (item) => item.id !== target.id && item.chapter === target.chapter && item.correctAnswer !== target.correctAnswer
  );

  // 2. Different chapter candidates
  const otherCandidates = allItems.filter(
    (item) => item.id !== target.id && item.chapter !== target.chapter && item.correctAnswer !== target.correctAnswer
  );

  const distractors: string[] = [];

  // Pick up to 2 from same chapter if available
  const shuffledSame = [...sameChapterCandidates].sort(() => 0.5 - Math.random());
  for (let i = 0; i < Math.min(2, shuffledSame.length); i++) {
    if (!distractors.includes(shuffledSame[i].correctAnswer)) {
      distractors.push(shuffledSame[i].correctAnswer);
    }
  }

  // Fill remaining slots with other candidates from across syllabus
  const shuffledOthers = [...otherCandidates].sort(() => 0.5 - Math.random());
  for (let i = 0; i < shuffledOthers.length && distractors.length < 3; i++) {
    if (!distractors.includes(shuffledOthers[i].correctAnswer)) {
      distractors.push(shuffledOthers[i].correctAnswer);
    }
  }

  // Fallback if needed
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

export function DailyQuickQuiz({ onOpenFullGlossary, onOpenStudySpace }: DailyQuickQuizProps) {
  const [activeMode, setActiveMode] = useState<"challenge" | "drill">("challenge");

  // Extract all unique numbered chapters for filter dropdown
  const allChapters = useMemo(() => {
    const set = new Set<string>();
    MCQ_BANK.forEach((q) => {
      if (q.chapter && /^\d+\s/.test(q.chapter)) {
        set.add(q.chapter);
      }
    });
    return Array.from(set).sort((a, b) => parseInt(a) - parseInt(b));
  }, []);

  const savedDraft = useMemo(() => loadQuickQuizDraft(), []);

  const [selectedChapter, setSelectedChapter] = useState<string>(() => savedDraft?.selectedChapter || "all");
  const [quizSize, setQuizSize] = useState<number>(() => savedDraft?.quizSize || 3);

  // Active quiz pool (strictly numbered questions)
  const filteredPool = useMemo(() => {
    const validBase = MCQ_BANK.filter((q) => q.questionNumber && /^\d+$/.test(q.questionNumber));
    if (selectedChapter === "all") return validBase;
    return validBase.filter((q) => q.chapter === selectedChapter);
  }, [selectedChapter]);

  // Quiz state
  const [questions, setQuestions] = useState<QuizQuestionInstance[]>(() => {
    if (savedDraft?.questions && savedDraft.questions.length > 0) {
      return savedDraft.questions;
    }
    return buildQuizSet(MCQ_BANK.filter((q) => q.questionNumber && /^\d+$/.test(q.questionNumber)), 3);
  });
  const [currentIndex, setCurrentIndex] = useState<number>(() => savedDraft?.currentIndex || 0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(() => savedDraft?.score || 0);
  const [streak, setStreak] = useState<number>(() => savedDraft?.streak || 0);
  const [maxStreak, setMaxStreak] = useState<number>(() => savedDraft?.maxStreak || 0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [answersHistory, setAnswersHistory] = useState<{
    item: MCQItem;
    selected: string;
    isCorrect: boolean;
  }[]>(() => savedDraft?.answersHistory || []);

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
        selectedChapter,
      });
    }
  }, [questions, currentIndex, score, streak, maxStreak, answersHistory, quizSize, selectedChapter, quizCompleted]);

  // Start new quiz
  const handleStartNewQuiz = (newSize?: number, newChapter?: string) => {
    clearQuickQuizDraft();
    const size = newSize ?? quizSize;
    const chapter = newChapter ?? selectedChapter;
    const validBase = MCQ_BANK.filter((q) => q.questionNumber && /^\d+$/.test(q.questionNumber));
    const pool = chapter === "all" ? validBase : validBase.filter((q) => q.chapter === chapter);
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

    if (isCorrect) {
      setScore((s) => s + 1);
      setStreak((st) => {
        const next = st + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
      // Award study coins for answering correctly
      awardBonusStudyCoins(15);
    } else {
      setStreak(0);
      // Effort reward for revision attempts
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
      // Quiz completion bonus coins
      awardBonusStudyCoins(25);
      const finalScore = score + (selectedOption === questions[currentIndex]?.correctAnswer ? 0 : 0);
      const pct = (finalScore / questions.length) * 100;
      if (pct >= 70) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="space-y-6">
      {/* Top Mode Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveMode("challenge")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeMode === "challenge"
              ? "bg-[#0F2042] dark:bg-white text-white dark:text-black shadow-xs font-bold"
              : "text-[#57534E] dark:text-neutral-400 hover:text-black dark:hover:text-white"
          }`}
        >
          <span>⚡ Global Daily & Weekly Challenge</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold">
            1-Min Timed
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode("drill")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeMode === "drill"
              ? "bg-[#0F2042] dark:bg-white text-white dark:text-black shadow-xs font-bold"
              : "text-[#57534E] dark:text-neutral-400 hover:text-black dark:hover:text-white"
          }`}
        >
          <span>🎯 Chapter Active Recall Drills</span>
          <span className="text-[10px] font-mono opacity-80">
            ({MCQ_BANK.length} Questions)
          </span>
        </button>
      </div>

      {activeMode === "challenge" ? (
        <DailyWeeklyChallenge onOpenStudySpace={onOpenStudySpace} />
      ) : (
        <div className="bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 rounded-2xl p-6 sm:p-7 shadow-xs transition-colors">
          {/* Quiz Header Deck */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 mb-6 border-b border-[#E7E5E4] dark:border-neutral-800">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8B1E1E] dark:bg-rose-500 animate-pulse"></span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8B1E1E] dark:text-rose-400">
                Cambridge Active Recall MCQ Bank
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#8B1E1E]/10 dark:bg-white/10 text-[#8B1E1E] dark:text-white">
                {MCQ_BANK.length} Questions
              </span>
            </div>
            <h2 className="font-academic-serif text-lg sm:text-xl font-bold text-[#0F2042] dark:text-white mt-0.5">
              Exact Definition & Knowledge Recall Drills
            </h2>
          </div>
        </div>

        {/* Filter Controls: Question Length & Chapter Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quiz Size Selector */}
          <div className="flex items-center gap-1 bg-[#FAF9F6] dark:bg-black p-1 rounded-lg border border-[#E7E5E4] dark:border-neutral-700 text-xs">
            {[3, 5, 10, 20].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => {
                  setQuizSize(size);
                  handleStartNewQuiz(size, selectedChapter);
                }}
                className={`px-2.5 py-1 rounded-md font-mono font-bold transition-all cursor-pointer ${
                  quizSize === size
                    ? "bg-[#0F2042] text-white dark:bg-white dark:text-black shadow-xs"
                    : "text-[#57534E] dark:text-neutral-400 hover:text-[#0F2042] dark:hover:text-white"
                }`}
              >
                {size}Q
              </button>
            ))}
          </div>

          {/* Chapter Filter Dropdown */}
          <select
            value={selectedChapter}
            onChange={(e) => {
              const ch = e.target.value;
              setSelectedChapter(ch);
              handleStartNewQuiz(quizSize, ch);
            }}
            className="px-3 py-1.5 text-xs rounded-lg border border-[#E7E5E4] dark:border-neutral-700 bg-[#FAF9F6] dark:bg-black text-[#1C1917] dark:text-white font-medium max-w-[200px] truncate cursor-pointer"
          >
            <option value="all">All 25 Chapters ({MCQ_BANK.length})</option>
            {allChapters.map((ch, idx) => (
              <option key={idx} value={ch}>
                {ch}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => handleStartNewQuiz()}
            title="Randomize New Question Set"
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-black hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-[#0F2042] dark:text-white transition-colors cursor-pointer"
          >
            ↺ Refresh
          </button>
        </div>
      </div>

      {/* Ongoing Quiz State */}
      {!quizCompleted && currentQ ? (
        <div>
          {/* Progress & Live Score Indicator */}
          <div className="flex items-center justify-between text-xs text-[#78716C] dark:text-neutral-400 mb-3 font-mono">
            <div className="flex items-center gap-3">
              <span className="font-bold text-[#0F2042] dark:text-white">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span>·</span>
              <span>
                Score: <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{score}</strong> / {currentIndex}
              </span>
            </div>

            {streak >= 2 && (
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-[11px] animate-pulse">
                <span>🔥</span>
                <span>{streak} Streak!</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-[#E7E5E4] dark:border-neutral-800 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-[#0F2042] dark:bg-white transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Prompt Deck with Explicit Question # and Chapter */}
          <div className="mb-6 p-4 sm:p-5 bg-[#FAF9F6] dark:bg-black rounded-xl border border-[#E7E5E4] dark:border-neutral-800">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded bg-[#0F2042] text-white dark:bg-white dark:text-black font-mono font-bold text-[10px] uppercase">
                Question #{currentQ.item.questionNumber}
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-neutral-800 text-blue-800 dark:text-neutral-200 font-mono font-bold text-[10px] uppercase">
                {currentQ.item.chapter}
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-neutral-800 text-purple-800 dark:text-neutral-200 font-mono font-bold text-[10px] uppercase">
                {currentQ.item.questionType || "Definition"}
              </span>
            </div>

            <h3 className="font-academic-serif text-xl sm:text-2xl font-bold text-[#0F2042] dark:text-white leading-snug">
              {currentQ.item.question}
            </h3>
            <p className="text-xs text-[#78716C] dark:text-neutral-400 mt-1 italic">
              Select the exact textbook definition or mark scheme answer below:
            </p>
          </div>

          {/* Shuffled MCQ Options with Distractors */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrect = option === currentQ.correctAnswer;

              let buttonStyle =
                "bg-[#FAF9F6] dark:bg-black border-[#D6D3D1] dark:border-neutral-700 hover:border-[#0F2042] dark:hover:border-white text-[#1C1917] dark:text-white";

              if (hasAnswered) {
                if (isCorrect) {
                  buttonStyle =
                    "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-medium ring-2 ring-emerald-500/30";
                } else if (isSelected && !isCorrect) {
                  buttonStyle =
                    "bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-950 dark:text-rose-100 line-through opacity-90";
                } else {
                  buttonStyle =
                    "opacity-45 bg-[#FAF9F6] dark:bg-black border-[#E7E5E4] dark:border-neutral-800 text-[#78716C] dark:text-neutral-500";
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={hasAnswered}
                  onClick={() => handleSelectOption(option)}
                  className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm leading-relaxed transition-all flex items-start gap-3 cursor-pointer ${buttonStyle}`}
                >
                  <span className="font-mono text-xs font-bold shrink-0 mt-0.5 px-2 py-0.5 rounded bg-black/5 dark:bg-white/10">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="flex-1">
                    <span>{option}</span>
                    {hasAnswered && isCorrect && (
                      <span className="block mt-1 text-[11px] text-emerald-700 dark:text-emerald-300 font-bold">
                        ✓ Exact Cambridge Mark Scheme Definition
                      </span>
                    )}
                    {hasAnswered && isSelected && !isCorrect && (
                      <span className="block mt-1 text-[11px] text-rose-700 dark:text-rose-300 font-bold">
                        ✗ Plausible Distractor / Related Concept (Incorrect for this prompt)
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback & Examiner Advice */}
          {hasAnswered && (
            <div className="p-4 bg-[#F8FAFC] dark:bg-black border border-[#CBD5E1] dark:border-neutral-800 rounded-xl text-xs space-y-2 mb-5 animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                {selectedOption === currentQ.correctAnswer ? (
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm flex items-center gap-1.5">
                    <span>✓</span> Full Marks Awarded! Exact Cambridge Knowledge (AO1).
                  </span>
                ) : (
                  <span className="font-bold text-rose-700 dark:text-rose-400 text-sm flex items-center gap-1.5">
                    <span>✗</span> Incorrect Option Selected.
                  </span>
                )}
              </div>
              <p className="text-[#475569] dark:text-neutral-300 text-xs leading-relaxed">
                <strong>Examiner Guidance: </strong>
                In Cambridge Business Studies (0264 / 0450), mark schemes penalise colloquial or vague phrasing. You must remember the specific technical characteristics (e.g. factors of production, separate legal identity, contribution, or opportunity cost).
              </p>
            </div>
          )}

          {/* Navigation Action */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-[#78716C] dark:text-neutral-400">
              {hasAnswered ? "Review the mark scheme above and proceed" : "Select one of the 4 options above"}
            </span>

            {hasAnswered && (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="bg-[#0F2042] dark:bg-white hover:bg-[#1E3A8A] dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-xs py-2.5 px-6 rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                {currentIndex < questions.length - 1 ? "Next Question →" : "Finish Quiz & View Results →"}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results Screen */
        <div className="py-6">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-mono uppercase tracking-wider text-[#78716C] dark:text-neutral-400">
              Active Recall Assessment Complete
            </span>
            <h3 className="font-academic-serif text-3xl sm:text-4xl font-bold text-[#0F2042] dark:text-white my-2">
              You Scored {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
            </h3>
            <p className="text-xs sm:text-sm text-[#57534E] dark:text-neutral-300 leading-relaxed">
              {score === questions.length
                ? "Outstanding! 100% precision. You have mastered exact Cambridge definitions and successfully avoided all distractor traps."
                : (score / questions.length) >= 0.7
                ? "Strong performance! You correctly identified the majority of exact syllabus definitions."
                : "Active recall requires repetition. Regular exposure to definitions ensures you score maximum easy marks in Paper 1."}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => handleStartNewQuiz()}
                className="bg-[#0F2042] dark:bg-white hover:bg-[#1E3A8A] dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-xs py-2.5 px-5 rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                Take Another {quizSize} Questions ↺
              </button>

              <button
                type="button"
                onClick={() => handleStartNewQuiz(10)}
                className="bg-white dark:bg-black border border-[#D6D3D1] dark:border-neutral-700 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-[#0F2042] dark:text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-colors cursor-pointer"
              >
                10-Question Master Drill 🎯
              </button>

              {onOpenFullGlossary && (
                <button
                  type="button"
                  onClick={onOpenFullGlossary}
                  className="bg-[#FAF9F6] dark:bg-black border border-[#E7E5E4] dark:border-neutral-700 text-[#57534E] dark:text-neutral-300 font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
                >
                  Browse Flashcards 🎴
                </button>
              )}
            </div>
          </div>

          {/* Detailed Question Review Ledger */}
          <div className="border-t border-[#E7E5E4] dark:border-neutral-800 pt-6">
            <h4 className="font-academic-serif text-sm font-bold text-[#0F2042] dark:text-white mb-4">
              Session Answers Review:
            </h4>
            <div className="space-y-3">
              {answersHistory.map((ans, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border text-xs ${
                    ans.isCorrect
                      ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800"
                      : "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold text-[#78716C] dark:text-neutral-400">
                      Q{idx + 1} · {ans.item.chapter} · #{ans.item.questionNumber}
                    </span>
                    <span
                      className={`font-bold text-[11px] ${
                        ans.isCorrect ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"
                      }`}
                    >
                      {ans.isCorrect ? "✓ Correct (+1)" : "✗ Incorrect (0)"}
                    </span>
                  </div>

                  <strong className="block text-sm text-[#0F2042] dark:text-white mb-2 font-academic-serif">
                    {ans.item.question}
                  </strong>

                  <div className="space-y-1">
                    <div className="text-emerald-800 dark:text-emerald-300">
                      <strong>Exact Mark Scheme: </strong>
                      {ans.item.correctAnswer}
                    </div>
                    {!ans.isCorrect && (
                      <div className="text-rose-700 dark:text-rose-400 text-[11px] line-through">
                        <strong>Your Selection: </strong>
                        {ans.selected}
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
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
import { MCQ_BANK, MCQItem } from "../lib/data/mcq-bank";
import {
  loadChallengeHistory,
  saveChallengeRecord,
  awardBonusStudyCoins,
  ChallengeCompletionRecord,
} from "../lib/cookies";
import {
  Sparkles,
  Timer,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Flame,
  Coins,
  ArrowRight,
  ShieldAlert,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";

interface DailyWeeklyChallengeProps {
  onOpenStudySpace?: () => void;
  onNavigateToPractice?: () => void;
  className?: string;
}

/**
 * Deterministic pseudo-random number generator (Mulberry32)
 */
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 32-bit FNV-1a hash function for strings
 */
function getDeterministicHash(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return Math.abs(h);
}

/**
 * Get current ISO week number (e.g. "2026-W44")
 */
function getISOWeekString(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

export function DailyWeeklyChallenge({
  onOpenStudySpace,
  onNavigateToPractice,
  className = "",
}: DailyWeeklyChallengeProps) {
  const [challengeType, setChallengeType] = useState<"daily" | "weekly">("daily");

  // Timer states
  const TIMER_SECONDS = 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(TIMER_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // History & past completions
  const [history, setHistory] = useState<Record<string, ChallengeCompletionRecord>>({});

  useEffect(() => {
    setHistory(loadChallengeHistory());
  }, []);

  // Compute UTC strings
  const todayUTC = useMemo(() => {
    const now = new Date();
    return now.toISOString().slice(0, 10); // "YYYY-MM-DD"
  }, []);

  const weekUTC = useMemo(() => {
    return getISOWeekString(new Date()); // "YYYY-Www"
  }, []);

  const challengeId = useMemo(() => {
    return challengeType === "daily" ? `daily-${todayUTC}` : `weekly-${weekUTC}`;
  }, [challengeType, todayUTC, weekUTC]);

  const existingRecord = history[challengeId];

  // Filter numbered questions
  const candidatePool = useMemo(() => {
    return MCQ_BANK.filter((q) => /^\d+\s/.test(q.chapter));
  }, []);

  // Deterministically select the global question & options
  const currentChallengeQuestion = useMemo(() => {
    if (candidatePool.length === 0) return null;

    const seed = getDeterministicHash(challengeId);
    const rng = mulberry32(seed);

    // Pick target question
    // For weekly, prioritize 4-mark / 6-mark / comprehensive definitions
    let targetPool = candidatePool;
    if (challengeType === "weekly") {
      const advanced = candidatePool.filter((q) => q.questionType !== "2-Mark");
      if (advanced.length > 0) targetPool = advanced;
    }

    const questionIndex = Math.floor(rng() * targetPool.length);
    const target = targetPool[questionIndex];

    // Pick 3 deterministic distractors
    const otherCandidates = candidatePool.filter(
      (c) => c.id !== target.id && c.correctAnswer !== target.correctAnswer
    );

    // Deterministically shuffle candidates
    const shuffledOthers = [...otherCandidates].sort(() => rng() - 0.5);
    const distractors: string[] = [];

    // Prefer same chapter if available
    const sameChapter = shuffledOthers.filter((c) => c.chapter === target.chapter);
    for (let i = 0; i < Math.min(2, sameChapter.length); i++) {
      distractors.push(sameChapter[i].correctAnswer);
    }

    // Fill up to 3
    for (let i = 0; i < shuffledOthers.length && distractors.length < 3; i++) {
      if (!distractors.includes(shuffledOthers[i].correctAnswer)) {
        distractors.push(shuffledOthers[i].correctAnswer);
      }
    }

    // Shuffle all 4 options deterministically with seeded RNG
    const allOptions = [target.correctAnswer, ...distractors].sort(() => rng() - 0.5);

    return {
      target,
      options: allOptions,
      correctAnswer: target.correctAnswer,
    };
  }, [candidatePool, challengeId, challengeType]);

  // Handle switching tabs
  const handleSelectChallengeType = (type: "daily" | "weekly") => {
    setChallengeType(type);
    setIsRevealed(false);
    setIsTimerRunning(false);
    setSecondsRemaining(TIMER_SECONDS);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
  };

  // Beep synthesizer using Web Audio API for timer pulse
  const playBeep = useCallback((freq: number = 800, duration: number = 0.08) => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }, [soundEnabled]);

  // Timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && secondsRemaining > 0 && !isAnswerSubmitted) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Time expired!
            setIsTimerRunning(false);
            setIsAnswerSubmitted(true);
            playBeep(300, 0.2);

            // Save record as expired/incorrect
            const rec: ChallengeCompletionRecord = {
              challengeId,
              dateCompleted: new Date().toISOString(),
              isCorrect: false,
              timeRemainingSeconds: 0,
              bonusCoinsEarned: 0,
              selectedOption: "TIME_EXPIRED",
            };
            saveChallengeRecord(rec);
            setHistory(loadChallengeHistory());

            return 0;
          }
          if (prev <= 10) {
            playBeep(950, 0.05); // Urgency beeps
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, secondsRemaining, isAnswerSubmitted, challengeId, playBeep]);

  // Click "Reveal Question"
  const handleRevealAndStart = () => {
    setIsRevealed(true);
    setIsTimerRunning(true);
    setSecondsRemaining(TIMER_SECONDS);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    playBeep(600, 0.1);
  };

  // Select an option
  const handleSelectOption = (opt: string) => {
    if (isAnswerSubmitted || secondsRemaining <= 0 || !currentChallengeQuestion) return;

    setSelectedOption(opt);
    setIsTimerRunning(false);
    setIsAnswerSubmitted(true);

    const isCorrect = opt === currentChallengeQuestion.correctAnswer;
    const bonusCoins = isCorrect ? (challengeType === "daily" ? 50 : 150) : 0;

    if (isCorrect) {
      awardBonusStudyCoins(bonusCoins);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#10B981", "#3B82F6", "#F59E0B"],
        });
      } catch {}
      playBeep(1200, 0.15);
    } else {
      playBeep(250, 0.15);
    }

    const rec: ChallengeCompletionRecord = {
      challengeId,
      dateCompleted: new Date().toISOString(),
      isCorrect,
      timeRemainingSeconds: secondsRemaining,
      bonusCoinsEarned: bonusCoins,
      selectedOption: opt,
    };

    saveChallengeRecord(rec);
    setHistory(loadChallengeHistory());
  };

  if (!currentChallengeQuestion) return null;

  const target = currentChallengeQuestion.target;
  const isCompleted = Boolean(existingRecord);
  const wasExistingCorrect = existingRecord?.isCorrect;
  const bonusRewardAmount = challengeType === "daily" ? 50 : 150;

  // Timer color indicator
  const timerColor =
    secondsRemaining > 30
      ? "text-emerald-500 border-emerald-500/30"
      : secondsRemaining > 10
      ? "text-amber-500 border-amber-500/30"
      : "text-red-500 border-red-500/50 animate-pulse";

  return (
    <div className={`bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 rounded-2xl p-5 sm:p-7 shadow-xs transition-colors ${className}`}>
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E7E5E4] dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F2042] dark:text-[#38BDF8]">
              Worldwide Synchronized Assessment
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-semibold">
              Same Question Globally Today
            </span>
          </div>
          <h2 className="font-academic-serif text-xl sm:text-2xl font-bold text-[#0F2042] dark:text-white flex items-center gap-2">
            <span>Daily & Weekly Timed Challenge</span>
            <span className="text-sm font-sans font-normal text-amber-600 dark:text-amber-400">⚡</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] dark:text-neutral-400 mt-0.5">
            Test your active recall under strict 1-minute exam conditions. Reveal the question, beat the 60s clock, and earn bonus Study Coins.
          </p>
        </div>

        {/* Tab Switcher: Daily vs Weekly */}
        <div className="flex items-center p-1 rounded-xl bg-[#FAF9F6] dark:bg-black border border-[#E7E5E4] dark:border-neutral-800 self-start sm:self-auto">
          <button
            onClick={() => handleSelectChallengeType("daily")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              challengeType === "daily"
                ? "bg-[#0F2042] dark:bg-white text-white dark:text-black shadow-xs"
                : "text-[#57534E] dark:text-neutral-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <span>⚡ Daily Blitz</span>
            <span className="text-[10px] opacity-80">(+50 🪙)</span>
          </button>
          <button
            onClick={() => handleSelectChallengeType("weekly")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              challengeType === "weekly"
                ? "bg-[#0F2042] dark:bg-white text-white dark:text-black shadow-xs"
                : "text-[#57534E] dark:text-neutral-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <span>🏆 Weekly Master</span>
            <span className="text-[10px] opacity-80">(+150 🪙)</span>
          </button>
        </div>
      </div>

      {/* Challenge Status Bar */}
      <div className="my-5 p-4 rounded-xl bg-[#FAF9F6] dark:bg-black/50 border border-[#E7E5E4] dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-md bg-[#0F2042] text-white dark:bg-white dark:text-black text-xs font-mono font-bold">
            {challengeType === "daily" ? `DATE: ${todayUTC}` : `WEEK: ${weekUTC}`}
          </span>
          <span className="text-xs font-mono text-[#78716C] dark:text-neutral-400">
            {target.chapter}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Bonus coins badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-300 text-xs font-semibold">
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>+{bonusRewardAmount} Bonus Coins</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-800 text-[#78716C] dark:text-neutral-300 hover:text-black dark:hover:text-white transition cursor-pointer"
            title={soundEnabled ? "Mute Timer Ticks" : "Enable Timer Ticks"}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. CONCEALED SHIELD (Before Reveal or If Already Completed)                */}
      {/* ========================================================================= */}
      {!isRevealed && !isCompleted && (
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0F2042] text-white text-center shadow-lg relative overflow-hidden">
          {/* Ambient background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl mb-4 shadow-inner">
              ⚡
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>1-Minute Active Recall Timer</span>
            </div>

            <h3 className="font-academic-serif text-2xl font-bold mb-2">
              {challengeType === "daily" ? "Today's Global Blitz Challenge" : "This Week's Master Challenge"}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Every student globally receives this exact question today. Once you click Reveal, you have{" "}
              <strong className="text-amber-300">exactly 60 seconds</strong> to select the verified Cambridge mark scheme answer.
            </p>

            {/* Big Tactile Reveal Button */}
            <button
              onClick={handleRevealAndStart}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm sm:text-base shadow-xl transition-all active:scale-95 cursor-pointer flex items-center gap-2 group"
            >
              <span>⚡ Reveal Question & Start 60s Clock</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ALREADY COMPLETED STATE (Review Mode)                                  */}
      {/* ========================================================================= */}
      {!isRevealed && isCompleted && (
        <div className={`p-6 rounded-2xl border ${wasExistingCorrect ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/40" : "bg-red-50/50 dark:bg-red-950/20 border-red-500/40"}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-black/10 dark:border-white/10">
            <div className="flex items-center gap-3">
              {wasExistingCorrect ? (
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-sm shrink-0">
                  ✓
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center text-2xl shadow-sm shrink-0">
                  ✕
                </div>
              )}
              <div>
                <h3 className="font-academic-serif font-bold text-lg text-[#0F2042] dark:text-white">
                  {wasExistingCorrect ? "Challenge Completed with Full Marks! 🎉" : "Challenge Completed"}
                </h3>
                <p className="text-xs text-[#57534E] dark:text-neutral-400">
                  {wasExistingCorrect
                    ? `Answered with ${existingRecord.timeRemainingSeconds}s remaining • +${existingRecord.bonusCoinsEarned} Study Coins credited!`
                    : "Time expired or distractor chosen. Review the verified syllabus mark scheme below."}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsRevealed(true)}
              className="px-4 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-[#D6D3D1] dark:border-neutral-700 text-xs font-semibold text-[#0F2042] dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-700 transition cursor-pointer self-start sm:self-auto"
            >
              Review Question & Answer
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ACTIVE TICKING QUESTION OR COMPLETED REVEAL                             */}
      {/* ========================================================================= */}
      {isRevealed && (
        <div className="space-y-6">
          {/* Active 60s Progress Bar & Clock */}
          {!isAnswerSubmitted && (
            <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Timer className={`w-5 h-5 ${secondsRemaining <= 10 ? "text-red-400 animate-spin" : "text-amber-400"}`} />
                <span className="font-mono text-xs uppercase tracking-wider text-slate-300">
                  Active Recall Countdown:
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Progress bar */}
                <div className="w-32 sm:w-48 bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      secondsRemaining > 30 ? "bg-emerald-400" : secondsRemaining > 10 ? "bg-amber-400" : "bg-red-500 animate-pulse"
                    }`}
                    style={{ width: `${(secondsRemaining / TIMER_SECONDS) * 100}%` }}
                  />
                </div>

                {/* Digital Seconds */}
                <div className={`font-mono text-xl font-black px-2.5 py-0.5 rounded-lg border bg-black/40 tabular-nums ${timerColor}`}>
                  {String(Math.floor(secondsRemaining / 60)).padStart(2, "0")}:{String(secondsRemaining % 60).padStart(2, "0")}
                </div>
              </div>
            </div>
          )}

          {/* Question Prompt Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF9F6] dark:bg-black/40 border border-[#E7E5E4] dark:border-neutral-800">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-white dark:bg-neutral-800 border border-[#E7E5E4] dark:border-neutral-700 text-[#0F2042] dark:text-[#38BDF8]">
                Question #{target.questionNumber} · {target.questionType}
              </span>
              <span className="text-xs text-[#78716C] dark:text-neutral-400">
                1 Correct Answer · 3 Tricky Distractors
              </span>
            </div>

            <h3 className="font-academic-serif text-lg sm:text-xl font-bold text-[#1C1917] dark:text-white leading-relaxed">
              {target.question}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3">
            {currentChallengeQuestion.options.map((option, idx) => {
              const letter = ["A", "B", "C", "D"][idx];
              const isSelected = selectedOption === option;
              const isCorrectAnswer = option === currentChallengeQuestion.correctAnswer;

              let buttonStyle = "bg-white dark:bg-neutral-900 border-[#E7E5E4] dark:border-neutral-800 hover:border-[#0F2042]/50 dark:hover:border-neutral-600";

              if (isAnswerSubmitted) {
                if (isCorrectAnswer) {
                  buttonStyle = "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500";
                } else if (isSelected) {
                  buttonStyle = "bg-red-50 dark:bg-red-950/40 border-red-500 text-red-950 dark:text-red-100 ring-2 ring-red-500";
                } else {
                  buttonStyle = "opacity-50 bg-[#FAF9F6] dark:bg-neutral-900 border-[#E7E5E4] dark:border-neutral-800";
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswerSubmitted}
                  onClick={() => handleSelectOption(option)}
                  className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${buttonStyle} ${
                    !isAnswerSubmitted ? "cursor-pointer active:scale-[0.99]" : "cursor-default"
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 transition ${
                      isAnswerSubmitted && isCorrectAnswer
                        ? "bg-emerald-600 text-white"
                        : isAnswerSubmitted && isSelected
                        ? "bg-red-600 text-white"
                        : "bg-slate-100 dark:bg-neutral-800 text-[#0F2042] dark:text-neutral-200"
                    }`}
                  >
                    {isAnswerSubmitted && isCorrectAnswer ? "✓" : isAnswerSubmitted && isSelected ? "✕" : letter}
                  </span>

                  <div className="flex-1 text-xs sm:text-sm leading-relaxed text-[#1C1917] dark:text-neutral-100 font-medium">
                    {option}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Senior Examiner Debrief (After Submit) */}
          {isAnswerSubmitted && (
            <div className={`p-5 rounded-2xl border animate-in fade-in zoom-in-95 ${
              selectedOption === currentChallengeQuestion.correctAnswer
                ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-500/40"
                : "bg-amber-50/60 dark:bg-amber-950/30 border-amber-500/40"
            }`}>
              <div className="flex items-start gap-3 mb-3">
                <span className="text-xl mt-0.5">
                  {selectedOption === currentChallengeQuestion.correctAnswer ? "🎉" : "📋"}
                </span>
                <div>
                  <h4 className="font-academic-serif font-bold text-base text-[#0F2042] dark:text-white">
                    {selectedOption === currentChallengeQuestion.correctAnswer
                      ? `Senior Examiner Assessment: Full Marks (+${bonusRewardAmount} Coins)`
                      : "Senior Examiner Assessment & Mark Scheme Explanation"}
                  </h4>
                  <p className="text-xs text-[#57534E] dark:text-neutral-300 mt-0.5">
                    {selectedOption === currentChallengeQuestion.correctAnswer
                      ? "Flawless active recall! You selected the precise Cambridge verified syllabus definition."
                      : "A common exam distractor was selected. Carefully study the official Cambridge mark scheme wording below."}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-xs sm:text-sm leading-relaxed text-[#1C1917] dark:text-white mb-3">
                <strong className="text-emerald-700 dark:text-emerald-400 font-mono text-xs block mb-1">
                  OFFICIAL CAMBRIDGE MARK SCHEME:
                </strong>
                {currentChallengeQuestion.correctAnswer}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  {onOpenStudySpace && (
                    <button
                      onClick={onOpenStudySpace}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>🎧 Spend Coins in Study Space</span>
                    </button>
                  )}
                  {onNavigateToPractice && (
                    <button
                      onClick={onNavigateToPractice}
                      className="px-3.5 py-1.5 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold text-[#0F2042] dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-700 transition cursor-pointer"
                    >
                      More Practice Questions →
                    </button>
                  )}
                </div>

                <span className="text-[11px] font-mono text-[#78716C] dark:text-neutral-400">
                  Next global challenge unlocks at 00:00 UTC
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

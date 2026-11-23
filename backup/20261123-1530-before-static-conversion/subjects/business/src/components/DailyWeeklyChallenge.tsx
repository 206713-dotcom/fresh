"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import confetti from "canvas-confetti";
import { MCQ_BANK } from "../lib/data/mcq-bank";
import {
  loadChallengeHistory,
  saveChallengeRecord,
  awardBonusStudyCoins,
  ChallengeCompletionRecord,
} from "../lib/cookies";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Coins,
  Headphones,
  Timer,
  Volume2,
  VolumeX,
  XCircle,
  Zap,
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

  const TIMER_SECONDS = 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(TIMER_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const [history, setHistory] = useState<Record<string, ChallengeCompletionRecord>>({});

  useEffect(() => {
    setHistory(loadChallengeHistory());
  }, []);

  const todayUTC = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const weekUTC = useMemo(() => getISOWeekString(new Date()), []);

  const challengeId = useMemo(
    () => (challengeType === "daily" ? `daily-${todayUTC}` : `weekly-${weekUTC}`),
    [challengeType, todayUTC, weekUTC],
  );

  const existingRecord = history[challengeId];

  const candidatePool = useMemo(() => MCQ_BANK, []);

  // Deterministically select the global question & options
  const currentChallengeQuestion = useMemo(() => {
    if (candidatePool.length === 0) return null;

    const seed = getDeterministicHash(challengeId);
    const rng = mulberry32(seed);

    let targetPool = candidatePool;
    if (challengeType === "weekly") {
      const advanced = candidatePool.filter((q) => q.questionType !== "2-Mark");
      if (advanced.length > 0) targetPool = advanced;
    }

    const questionIndex = Math.floor(rng() * targetPool.length);
    const target = targetPool[questionIndex];

    const otherCandidates = candidatePool.filter(
      (c) => c.id !== target.id && c.correctAnswer !== target.correctAnswer,
    );

    const shuffledOthers = [...otherCandidates].sort(() => rng() - 0.5);
    const distractors: string[] = [];

    const sameChapter = shuffledOthers.filter((c) => c.chapter === target.chapter);
    for (let i = 0; i < Math.min(2, sameChapter.length); i++) {
      distractors.push(sameChapter[i].correctAnswer);
    }

    for (let i = 0; i < shuffledOthers.length && distractors.length < 3; i++) {
      if (!distractors.includes(shuffledOthers[i].correctAnswer)) {
        distractors.push(shuffledOthers[i].correctAnswer);
      }
    }

    const allOptions = [target.correctAnswer, ...distractors].sort(() => rng() - 0.5);

    return {
      target,
      options: allOptions,
      correctAnswer: target.correctAnswer,
    };
  }, [candidatePool, challengeId, challengeType]);

  const handleSelectChallengeType = (type: "daily" | "weekly") => {
    setChallengeType(type);
    setIsRevealed(false);
    setIsTimerRunning(false);
    setSecondsRemaining(TIMER_SECONDS);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
  };

  // Web Audio countdown tone
  const playBeep = useCallback(
    (freq: number = 800, duration: number = 0.08) => {
      if (!soundEnabled || typeof window === "undefined") return;
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
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
    },
    [soundEnabled],
  );

  // Timer loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && secondsRemaining > 0 && !isAnswerSubmitted) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setIsAnswerSubmitted(true);
            playBeep(300, 0.2);

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
            playBeep(950, 0.05);
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, secondsRemaining, isAnswerSubmitted, challengeId, playBeep]);

  const handleRevealAndStart = () => {
    setIsRevealed(true);
    setIsTimerRunning(true);
    setSecondsRemaining(TIMER_SECONDS);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    playBeep(600, 0.1);
  };

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
          particleCount: 85,
          spread: 68,
          origin: { y: 0.65 },
          colors: ["#203e32", "#e4eeb2", "#f6bb83", "#97532b"],
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

  // Countdown bar fill & text tone
  const timerBarColor =
    secondsRemaining > 30
      ? "bg-[var(--primary-btn-bg,#e4eeb2)]"
      : secondsRemaining > 10
        ? "bg-[#f6bb83]"
        : "bg-[#ef4444]";

  const timerTextTone =
    secondsRemaining > 30
      ? "text-[var(--primary-btn-bg,#e4eeb2)]"
      : secondsRemaining > 10
        ? "text-[#f6bb83]"
        : "text-[#fca5a5]";

  const effectiveSelected = selectedOption ?? existingRecord?.selectedOption ?? null;
  const effectiveIsCorrect = isAnswerSubmitted
    ? selectedOption === currentChallengeQuestion.correctAnswer
    : Boolean(wasExistingCorrect);

  return (
    <div className={className}>
      {/* Top Studio Sub-toolbar inside .study-studio */}
      <div className="study-panel-header border-b border-[var(--surface-line)] bg-[var(--surface-soft)]/55">
        <div className="min-w-0">
          <p className="study-panel-kicker">
            Synchronized Global Assessment · Same Question Worldwide Today
          </p>
          <h2 className="study-panel-title text-[var(--surface-text)] mt-0.5">
            Daily &amp; Weekly Timed Challenge
          </h2>
          <p className="mt-1 font-mono text-[11px] text-[var(--surface-muted)] tabular-nums">
            {challengeType === "daily" ? `Date: ${todayUTC}` : `Week: ${weekUTC}`} ·{" "}
            {target.chapter} · +{bonusRewardAmount} Study Coins
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div role="group" aria-label="Challenge cadence" className="study-engine">
            <button
              type="button"
              onClick={() => handleSelectChallengeType("daily")}
              aria-pressed={challengeType === "daily"}
              className="study-engine-option"
            >
              <Zap size={13} aria-hidden="true" />
              <span>Daily Blitz</span>
              <span className="font-mono text-[10px] opacity-75">+50</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectChallengeType("weekly")}
              aria-pressed={challengeType === "weekly"}
              className="study-engine-option"
            >
              <Award size={13} aria-hidden="true" />
              <span>Weekly Master</span>
              <span className="font-mono text-[10px] opacity-75">+150</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="study-pager-button"
            title={soundEnabled ? "Mute timer countdown ticks" : "Enable timer countdown ticks"}
            aria-label={soundEnabled ? "Mute timer countdown ticks" : "Enable timer countdown ticks"}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
        </div>
      </div>

      {/* Main Challenge Stage */}
      <div className="study-panel-padding">
        <div className="mx-auto max-w-4xl space-y-5">
          {/* 1. CONCEALED SHIELD */}
          {!isRevealed && !isCompleted && (
            <div
              className="rounded-xl p-7 sm:p-10 text-center"
              style={{
                background: "var(--hero-bg)",
                color: "var(--hero-text)",
              }}
            >
              <div className="mx-auto max-w-xl flex flex-col items-center">
                <p
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider mb-2"
                  style={{ color: "var(--primary-btn-bg)" }}
                >
                  <Clock size={14} aria-hidden="true" />
                  <span>1-Minute Active Recall Timer</span>
                </p>

                <h3 className="font-[var(--font-serif)] text-2xl sm:text-3xl font-semibold tracking-tight text-balance">
                  {challengeType === "daily"
                    ? "Today's Global Blitz Challenge"
                    : "This Week's Master Challenge"}
                </h3>

                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed opacity-90">
                  Every student worldwide receives this exact {target.chapter} question. Once you
                  reveal it, you have <strong>exactly 60 seconds</strong> to pick the verified
                  Cambridge mark scheme answer for{" "}
                  <span className="font-mono font-semibold">+{bonusRewardAmount} coins</span>.
                </p>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleRevealAndStart}
                    className="study-action btn-primary whitespace-nowrap"
                  >
                    <Zap size={16} aria-hidden="true" />
                    <span>Reveal Question &amp; Start 60s Clock</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. ALREADY COMPLETED SUMMARY */}
          {!isRevealed && isCompleted && (
            <div
              className={`rounded-xl border p-5 sm:p-6 ${
                wasExistingCorrect
                  ? "bg-[var(--sheet-sage)] border-[var(--sheet-sage-line)]"
                  : "bg-[var(--sheet-rose)] border-[var(--sheet-rose-line)]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      wasExistingCorrect
                        ? "bg-[var(--hero-bg)] text-[var(--hero-text)]"
                        : "bg-[#97532b] text-white"
                    }`}
                  >
                    {wasExistingCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                  </div>
                  <div>
                    <p className="study-panel-kicker">
                      {challengeType === "daily" ? "Daily Blitz Complete" : "Weekly Master Complete"}
                    </p>
                    <h3 className="font-[var(--font-serif)] text-lg sm:text-xl font-semibold text-[var(--surface-text)] mt-0.5">
                      {wasExistingCorrect
                        ? "Challenge completed with full marks"
                        : "Challenge completed — review mark scheme"}
                    </h3>
                    <p className="mt-1 text-xs text-[var(--surface-muted)] tabular-nums">
                      {wasExistingCorrect
                        ? `Answered with ${existingRecord.timeRemainingSeconds}s remaining · +${existingRecord.bonusCoinsEarned} Study Coins credited`
                        : "Time expired or a distractor was selected. Inspect the official Cambridge mark scheme below."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsRevealed(true);
                    setIsAnswerSubmitted(true);
                    if (existingRecord?.selectedOption && existingRecord.selectedOption !== "TIME_EXPIRED") {
                      setSelectedOption(existingRecord.selectedOption);
                    }
                  }}
                  className="study-action btn-primary whitespace-nowrap shrink-0 self-start sm:self-center"
                >
                  <span>Review Question &amp; Answer</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* 3. ACTIVE TICKING QUESTION OR COMPLETED REVEAL */}
          {isRevealed && (
            <div className="space-y-5">
              {/* Active 60s Countdown Bar */}
              {!isAnswerSubmitted && (
                <div
                  className="rounded-xl px-4 py-3.5 flex flex-wrap items-center justify-between gap-4"
                  style={{
                    background: "var(--hero-bg)",
                    color: "var(--hero-text)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Timer size={18} className={timerTextTone} aria-hidden="true" />
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider opacity-90">
                      Active Recall Countdown
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-32 sm:w-52 h-2 rounded-full bg-white/15 overflow-hidden">
                      <div
                        className={`h-full transition-[width] duration-1000 ${timerBarColor}`}
                        style={{ width: `${(secondsRemaining / TIMER_SECONDS) * 100}%` }}
                      />
                    </div>

                    <div
                      className={`font-mono text-lg font-bold tabular-nums px-2.5 py-0.5 rounded-md bg-black/25 ${timerTextTone}`}
                    >
                      {String(Math.floor(secondsRemaining / 60)).padStart(2, "0")}:
                      {String(secondsRemaining % 60).padStart(2, "0")}
                    </div>
                  </div>
                </div>
              )}

              {/* Question Prompt Deck */}
              <div className="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-soft)] p-5">
                <p className="study-panel-kicker mb-2">
                  Question #{target.questionNumber} · {target.questionType || "MCQ"} · 1 correct ·
                  3 distractors
                </p>

                <h3 className="study-prompt text-[var(--surface-text)]">{target.question}</h3>
              </div>

              {/* Options Grid */}
              <div className="space-y-2.5">
                {currentChallengeQuestion.options.map((option, idx) => {
                  const letter = ["A", "B", "C", "D"][idx];
                  const isSelected = effectiveSelected === option;
                  const isCorrectAnswer = option === currentChallengeQuestion.correctAnswer;

                  let cardClasses =
                    "bg-[var(--surface)] border-[var(--surface-line)] hover:border-[var(--surface-accent)] hover:bg-[var(--surface-practice)]/55 text-[var(--surface-text)]";
                  let keyCapClasses =
                    "bg-[var(--surface-soft)] border-[var(--surface-line)] text-[var(--surface-muted)]";

                  if (isAnswerSubmitted) {
                    if (isCorrectAnswer) {
                      cardClasses =
                        "bg-[var(--sheet-sage)] border-[var(--surface-accent)] text-[var(--surface-text)] font-medium";
                      keyCapClasses =
                        "bg-[var(--surface-accent)] border-transparent text-[var(--hero-text)] dark:text-[var(--primary-btn-text)]";
                    } else if (isSelected) {
                      cardClasses =
                        "bg-[var(--sheet-rose)] border-[var(--sheet-rose-line)] text-[var(--surface-text)]";
                      keyCapClasses = "bg-[#97532b] border-transparent text-white";
                    } else {
                      cardClasses =
                        "opacity-55 bg-[var(--surface-soft)] border-[var(--surface-line)] text-[var(--surface-muted)]";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelectOption(option)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm leading-relaxed transition-colors flex items-start gap-3 ${cardClasses} ${
                        !isAnswerSubmitted ? "cursor-pointer" : "cursor-default"
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-md border flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 ${keyCapClasses}`}
                      >
                        {isAnswerSubmitted && isCorrectAnswer ? (
                          <CheckCircle2 size={14} aria-hidden="true" />
                        ) : isAnswerSubmitted && isSelected ? (
                          <XCircle size={14} aria-hidden="true" />
                        ) : (
                          letter
                        )}
                      </span>

                      <div className="flex-1 min-w-0">
                        <span>{option}</span>
                        {isAnswerSubmitted && isCorrectAnswer && (
                          <span className="block mt-1 font-mono text-[11px] font-bold text-[var(--surface-accent)]">
                            Exact Cambridge mark scheme answer
                          </span>
                        )}
                        {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                          <span className="block mt-1 font-mono text-[11px] font-bold text-[#97532b] dark:text-[#f6bb83]">
                            Your selection — distractor
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Senior Examiner Debrief */}
              {isAnswerSubmitted && (
                <div className="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-practice)] p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    {effectiveIsCorrect ? (
                      <CheckCircle2
                        size={20}
                        className="mt-0.5 shrink-0 text-[var(--surface-accent)]"
                        aria-hidden="true"
                      />
                    ) : (
                      <XCircle
                        size={20}
                        className="mt-0.5 shrink-0 text-[#97532b] dark:text-[#f6bb83]"
                        aria-hidden="true"
                      />
                    )}
                    <div>
                      <h4 className="font-[var(--font-serif)] text-base sm:text-lg font-semibold text-[var(--surface-text)]">
                        {effectiveIsCorrect
                          ? `Senior Examiner Assessment: Full Marks (+${bonusRewardAmount} Coins)`
                          : "Senior Examiner Assessment & Mark Scheme"}
                      </h4>
                      <p className="text-xs text-[var(--surface-muted)] mt-0.5">
                        {effectiveIsCorrect
                          ? "Flawless active recall under timed conditions. You matched the Cambridge mark scheme."
                          : "Time expired or a distractor was selected. Study the official mark scheme phrasing below."}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-[var(--surface-line)] bg-[var(--surface)] p-4 text-xs sm:text-sm leading-relaxed text-[var(--surface-text)]">
                    <span className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--surface-accent)] mb-1">
                      Official Cambridge Mark Scheme
                    </span>
                    {currentChallengeQuestion.correctAnswer}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {onOpenStudySpace && (
                        <button
                          type="button"
                          onClick={onOpenStudySpace}
                          className="study-action btn-primary whitespace-nowrap"
                        >
                          <Headphones size={15} aria-hidden="true" />
                          <span>Spend Coins in Study Space</span>
                        </button>
                      )}
                      {onNavigateToPractice && (
                        <button
                          type="button"
                          onClick={onNavigateToPractice}
                          className="study-action study-secondary-action whitespace-nowrap"
                        >
                          <span>More Practice Questions</span>
                          <ArrowRight size={15} aria-hidden="true" />
                        </button>
                      )}
                    </div>

                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--surface-muted)] tabular-nums">
                      <Coins size={13} aria-hidden="true" />
                      <span>Next global challenge unlocks at 00:00 UTC</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

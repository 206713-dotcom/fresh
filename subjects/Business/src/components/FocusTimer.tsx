"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface FocusTimerProps {
  onSessionComplete?: (durationSeconds: number) => void;
  className?: string;
  isCompactInitially?: boolean;
}

// Built-in exam study presets in minutes
const PRESETS = [
  { label: "5m Drill", minutes: 5, description: "Quick definition recall" },
  { label: "15m Sprint", minutes: 15, description: "Paper 1 8-mark question" },
  { label: "25m Pomodoro", minutes: 25, description: "Standard deep focus block" },
  { label: "45m Case Study", minutes: 45, description: "Paper 2 Section A analysis" },
  { label: "90m Full Mock", minutes: 90, description: "Authentic CIE 1h 30m exam" },
];

export function FocusTimer({
  onSessionComplete,
  className = "",
  isCompactInitially = false,
}: FocusTimerProps) {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(25);
  const [totalSeconds, setTotalSeconds] = useState<number>(25 * 60);
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [customInput, setCustomInput] = useState<string>("25");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isCompactInitially);
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(0);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play a gentle two-tone chime via Web Audio API on completion
  const playGentleChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // First note (G5 = 783.99 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(783.99, ctx.currentTime);
      gain1.gain.setValueAtTime(0.15, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.6);

      // Second note (C6 = 1046.50 Hz) after 0.2s
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.2);
      gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.2);
      osc2.stop(ctx.currentTime + 0.9);
    } catch {
      // AudioContext unavailable or blocked by browser policy
    }
  };

  // Timer tick effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            setCompletedSessionsCount((c) => c + 1);
            playGentleChime();
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 },
            });
            if (onSessionComplete) {
              onSessionComplete(totalSeconds);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft, totalSeconds, onSessionComplete, soundEnabled]);

  const handleSelectPreset = (minutes: number) => {
    setSelectedMinutes(minutes);
    setCustomInput(minutes.toString());
    const secs = minutes * 60;
    setTotalSeconds(secs);
    setSecondsLeft(secs);
    setIsRunning(false);
    setIsCompleted(false);
  };

  const handleApplyCustomMinutes = () => {
    const mins = parseInt(customInput, 10);
    if (!isNaN(mins) && mins > 0 && mins <= 180) {
      handleSelectPreset(mins);
    }
  };

  const handleTogglePlay = () => {
    if (isCompleted) {
      // Reset first if completed
      setSecondsLeft(totalSeconds);
      setIsCompleted(false);
      setIsRunning(true);
      return;
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
    setIsCompleted(false);
  };

  const handleAddMinutes = (mins: number) => {
    const addedSecs = mins * 60;
    setTotalSeconds((prev) => prev + addedSecs);
    setSecondsLeft((prev) => prev + addedSecs);
    setIsCompleted(false);
  };

  // Format MM:SS or HH:MM:SS
  const formatCountdown = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const remainingSeconds = secs % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate circular SVG progress
  const progressRatio = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  // Visual status color
  const percentageRemaining = totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 0;
  let strokeColor = "#0F2042"; // Navy
  let badgeColor = "text-[#0F2042] dark:text-[#38BDF8]";

  if (isCompleted) {
    strokeColor = "#10B981"; // Emerald
    badgeColor = "text-emerald-600 dark:text-emerald-400";
  } else if (percentageRemaining < 15 || secondsLeft <= 60) {
    strokeColor = "#EF4444"; // Red
    badgeColor = "text-red-600 dark:text-red-400";
  } else if (percentageRemaining < 30) {
    strokeColor = "#F59E0B"; // Amber
    badgeColor = "text-amber-600 dark:text-amber-400";
  }

  return (
    <div
      className={`bg-white dark:bg-[#162032] border border-[#E7E5E4] dark:border-[#1E293B] rounded-2xl shadow-sm transition-all overflow-hidden ${className}`}
    >
      {/* Top Bar / Header */}
      <div className="px-5 py-3.5 border-b border-[#E7E5E4] dark:border-[#1E293B] flex items-center justify-between gap-3 bg-[#FAF9F6]/50 dark:bg-[#0F172A]/40">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              isRunning
                ? "bg-emerald-500 animate-pulse"
                : isCompleted
                ? "bg-emerald-500"
                : "bg-[#78716C] dark:bg-[#94A3B8]"
            }`}
          />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F2042] dark:text-[#38BDF8]">
            Exam Focus Timer
          </span>
          <span className="text-xs text-[#78716C] dark:text-[#94A3B8] hidden sm:inline">
            · {selectedMinutes}m Study Session
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Chime Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Mute notification chime" : "Enable chime on completion"}
            className="p-1.5 rounded-md hover:bg-[#F5F5F4] dark:hover:bg-[#1E293B] text-xs text-[#78716C] dark:text-[#94A3B8] transition-colors"
          >
            {soundEnabled ? "🔔" : "🔕"}
          </button>

          {/* Quick Collapse / Expand Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-xs font-semibold px-2.5 py-1 rounded border border-[#E7E5E4] dark:border-[#334155] bg-white dark:bg-[#162032] hover:bg-[#F5F5F4] dark:hover:bg-[#1E293B] text-[#57534E] dark:text-[#CBD5E1] transition-colors"
          >
            {isCollapsed ? "Expand ⏱" : "Compact"}
          </button>
        </div>
      </div>

      {/* Main Body */}
      {!isCollapsed ? (
        <div className="p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Visual Countdown Dial */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* SVG Progress Ring */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                  {/* Background Track */}
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-[#E7E5E4] dark:text-[#1E293B]"
                  />
                  {/* Animated Progress Stroke */}
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    stroke={strokeColor}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-linear dark:stroke-[#38BDF8]"
                  />
                </svg>

                {/* Digital Time Inside Dial */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
                  <span
                    className={`font-mono text-3xl font-bold tracking-tight ${badgeColor} transition-colors`}
                  >
                    {formatCountdown(secondsLeft)}
                  </span>
                  <span className="text-[11px] font-mono text-[#78716C] dark:text-[#94A3B8] uppercase mt-0.5">
                    {isCompleted
                      ? "Complete! 🎉"
                      : isRunning
                      ? "In Session"
                      : secondsLeft === totalSeconds
                      ? "Ready"
                      : "Paused"}
                  </span>
                </div>
              </div>

              {/* Quick +1m / +5m Extenders */}
              <div className="flex items-center gap-1.5 mt-3">
                <button
                  onClick={() => handleAddMinutes(1)}
                  title="Add 1 minute to current timer"
                  className="px-2 py-0.5 rounded text-[11px] font-mono border border-[#E7E5E4] dark:border-[#334155] bg-[#FAF9F6] dark:bg-[#0F172A] hover:bg-[#F5F5F4] dark:hover:bg-[#1E293B] text-[#57534E] dark:text-[#94A3B8] transition-colors"
                >
                  +1m
                </button>
                <button
                  onClick={() => handleAddMinutes(5)}
                  title="Add 5 minutes to current timer"
                  className="px-2 py-0.5 rounded text-[11px] font-mono border border-[#E7E5E4] dark:border-[#334155] bg-[#FAF9F6] dark:bg-[#0F172A] hover:bg-[#F5F5F4] dark:hover:bg-[#1E293B] text-[#57534E] dark:text-[#94A3B8] transition-colors"
                >
                  +5m
                </button>
                {completedSessionsCount > 0 && (
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 pl-1">
                    ✓ {completedSessionsCount} done
                  </span>
                )}
              </div>
            </div>

            {/* Interval Configuration & Presets */}
            <div className="flex-1 w-full space-y-4">
              <div>
                <span className="text-xs font-mono font-semibold text-[#78716C] dark:text-[#94A3B8] uppercase tracking-wider block mb-2">
                  Choose Practice Interval:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {PRESETS.map((p) => {
                    const isSelected = selectedMinutes === p.minutes;
                    return (
                      <button
                        key={p.minutes}
                        onClick={() => handleSelectPreset(p.minutes)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0F172A] border-[#0F2042] dark:border-[#38BDF8] shadow-sm font-semibold"
                            : "bg-[#FAF9F6] dark:bg-[#0F172A] border-[#E7E5E4] dark:border-[#334155] hover:border-[#0F2042] dark:hover:border-[#38BDF8] text-[#1C1917] dark:text-[#E2E8F0]"
                        }`}
                      >
                        <span className="block text-xs font-bold leading-tight">{p.label}</span>
                        <span
                          className={`block text-[10px] leading-tight mt-1 truncate ${
                            isSelected
                              ? "text-white/80 dark:text-[#0F172A]/80"
                              : "text-[#78716C] dark:text-[#94A3B8]"
                          }`}
                        >
                          {p.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Minutes Input & Primary Controls */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#E7E5E4] dark:border-[#1E293B]">
                {/* Custom Minutes */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#78716C] dark:text-[#94A3B8] whitespace-nowrap">
                    Custom minutes:
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCustomMinutes()}
                    className="w-16 px-2.5 py-1 text-xs font-mono font-bold bg-[#FAF9F6] dark:bg-[#0F172A] border border-[#D6D3D1] dark:border-[#334155] rounded-md text-[#1C1917] dark:text-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#0F2042] dark:focus:ring-[#38BDF8]"
                  />
                  <button
                    onClick={handleApplyCustomMinutes}
                    className="px-2.5 py-1 text-xs font-semibold rounded-md bg-[#F5F5F4] dark:bg-[#1E293B] hover:bg-[#E7E5E4] dark:hover:bg-[#334155] text-[#1C1917] dark:text-[#E2E8F0] border border-[#D6D3D1] dark:border-[#334155] transition-colors"
                  >
                    Set
                  </button>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 text-xs font-semibold rounded-lg border border-[#D6D3D1] dark:border-[#334155] bg-white dark:bg-[#162032] hover:bg-[#F5F5F4] dark:hover:bg-[#1E293B] text-[#57534E] dark:text-[#CBD5E1] transition-colors"
                  >
                    Reset ↺
                  </button>

                  <button
                    onClick={handleTogglePlay}
                    className={`px-6 py-2 text-xs font-bold rounded-lg transition-all shadow-sm flex items-center gap-1.5 ${
                      isRunning
                        ? "bg-amber-600 hover:bg-amber-700 text-white"
                        : "bg-[#0F2042] hover:bg-[#1E3A8A] dark:bg-[#38BDF8] dark:hover:bg-[#0284C7] text-white dark:text-[#0F172A]"
                    }`}
                  >
                    <span>{isRunning ? "Pause ⏸" : isCompleted ? "Restart ↻" : "Start Session ▶"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Compact Floating / Minimized Strip */
        <div className="p-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className={`font-mono text-xl font-bold tracking-tight ${badgeColor} transition-colors`}
            >
              {formatCountdown(secondsLeft)}
            </span>
            <span className="text-xs text-[#78716C] dark:text-[#94A3B8]">
              {selectedMinutes}m Focus Session
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                isRunning
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : "bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0F172A]"
              }`}
            >
              {isRunning ? "Pause" : "Start"}
            </button>
            <button
              onClick={handleReset}
              className="px-2.5 py-1.5 text-xs font-medium rounded-md border border-[#D6D3D1] dark:border-[#334155] bg-white dark:bg-[#162032] text-[#57534E] dark:text-[#CBD5E1]"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

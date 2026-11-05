"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Trophy,
  X,
  Sparkles,
  Check,
  Lock,
  ChevronRight,
  Flame,
  Award,
  BookOpen,
  Target,
  Swords,
  Clock,
  Shirt,
  Star,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  getStudyCoins,
  loadClaimedAchievements,
  claimAchievement,
  loadSubmissions,
  loadSyllabusRatings,
  loadCustomizerState,
  loadMasteredTerms,
  getCompletedFocusSessionsCount,
} from "../lib/cookies";

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  category: "exam" | "syllabus" | "focus" | "combat" | "scholar";
  rewardCoins: number;
  icon: string;
  requirement: number;
  getProgress: () => { current: number; total: number };
}

export function getAchievementsDefinitions(): AchievementDefinition[] {
  const submissions = typeof window !== "undefined" ? loadSubmissions() : [];
  const syllabusRatings = typeof window !== "undefined" ? loadSyllabusRatings() : {};
  const ratedCount = Object.keys(syllabusRatings).length;
  const customizer = typeof window !== "undefined" ? loadCustomizerState() : null;
  const masteredTerms = typeof window !== "undefined" ? loadMasteredTerms() : [];
  const focusSessions = typeof window !== "undefined" ? getCompletedFocusSessionsCount() : 0;

  // Calculate highest score in submissions
  let highestScorePct = 0;
  let hasPassedAO2 = false;
  submissions.forEach((s) => {
    if (s.result) {
      const pct = s.result.percentage || (s.result.maxMarks > 0 ? Math.round((s.result.totalScore / s.result.maxMarks) * 100) : 0);
      if (pct > highestScorePct) highestScorePct = pct;
      if (s.result.ruleEnforcement?.appWordsPassed || (s.result.aoBreakdown?.ao2?.score && s.result.aoBreakdown.ao2.score > 0)) {
        hasPassedAO2 = true;
      }
    }
  });

  // Check customizer changes (unlocked more items or changed from defaults)
  const isAvatarStyled =
    customizer !== null &&
    (customizer.unlockedItems.length > 6 ||
      customizer.hairId !== "hair-1" ||
      customizer.topId !== "top-1" ||
      customizer.bottomId !== "bot-1" ||
      customizer.shoeId !== "shoe-1");

  // Check boss battles count
  let bossBattlesCount = 0;
  if (typeof window !== "undefined") {
    try {
      bossBattlesCount = parseInt(localStorage.getItem("ecbiz_boss_battles_count") || "0", 10);
    } catch {}
  }

  // Check custom focus time usage
  let usedCustomTimer = false;
  if (typeof window !== "undefined") {
    try {
      usedCustomTimer = localStorage.getItem("ecbiz_used_custom_timer") === "true";
    } catch {}
  }

  return [
    {
      id: "first_submission",
      title: "First Exam Step",
      description: "Submit your first Cambridge Paper 1 or Paper 2 question response.",
      category: "exam",
      rewardCoins: 30,
      icon: "✍️",
      requirement: 1,
      getProgress: () => ({ current: Math.min(submissions.length, 1), total: 1 }),
    },
    {
      id: "ao2_keyword_scan",
      title: "Context Champion",
      description: "Incorporate authentic case study facts to satisfy the strict AO2 application rules.",
      category: "exam",
      rewardCoins: 40,
      icon: "🎯",
      requirement: 1,
      getProgress: () => ({ current: hasPassedAO2 ? 1 : 0, total: 1 }),
    },
    {
      id: "merit_scholar_70",
      title: "Merit Scholar",
      description: "Score 70% or higher on any Cambridge examination question response.",
      category: "exam",
      rewardCoins: 50,
      icon: "🏅",
      requirement: 70,
      getProgress: () => ({ current: Math.min(highestScorePct, 70), total: 70 }),
    },
    {
      id: "distinction_full_marks",
      title: "Distinction Mastery",
      description: "Achieve a perfect 100% full-marks score on any assessment question.",
      category: "exam",
      rewardCoins: 75,
      icon: "🌟",
      requirement: 100,
      getProgress: () => ({ current: Math.min(highestScorePct, 100), total: 100 }),
    },
    {
      id: "submissions_5",
      title: "Dedicated Candidate",
      description: "Complete 5 or more total question submissions across the revision studio.",
      category: "exam",
      rewardCoins: 100,
      icon: "📚",
      requirement: 5,
      getProgress: () => ({ current: Math.min(submissions.length, 5), total: 5 }),
    },
    {
      id: "submissions_10",
      title: "Cambridge Veteran",
      description: "Complete 10 or more total verified question responses.",
      category: "exam",
      rewardCoins: 150,
      icon: "🏆",
      requirement: 10,
      getProgress: () => ({ current: Math.min(submissions.length, 10), total: 10 }),
    },
    {
      id: "checklist_5",
      title: "Syllabus Triage",
      description: "Rate 5 syllabus subpoints (Easy, Moderate, Hard) in the 0264 Checklist.",
      category: "syllabus",
      rewardCoins: 35,
      icon: "📋",
      requirement: 5,
      getProgress: () => ({ current: Math.min(ratedCount, 5), total: 5 }),
    },
    {
      id: "checklist_15",
      title: "Confidence Auditor",
      description: "Rate 15 syllabus subpoints to clearly pinpoint your knowledge gaps.",
      category: "syllabus",
      rewardCoins: 60,
      icon: "🔍",
      requirement: 15,
      getProgress: () => ({ current: Math.min(ratedCount, 15), total: 15 }),
    },
    {
      id: "checklist_25",
      title: "Curriculum Cartographer",
      description: "Rate 25 syllabus subpoints across Section 1 & Section 2.",
      category: "syllabus",
      rewardCoins: 100,
      icon: "🗺️",
      requirement: 25,
      getProgress: () => ({ current: Math.min(ratedCount, 25), total: 25 }),
    },
    {
      id: "focus_session_done",
      title: "Deep Focus Novice",
      description: "Complete at least one timed focus session in the Lo-Fi Study Space.",
      category: "focus",
      rewardCoins: 50,
      icon: "🎧",
      requirement: 1,
      getProgress: () => ({ current: Math.min(focusSessions, 1), total: 1 }),
    },
    {
      id: "custom_focus_time",
      title: "Tailored Pacing",
      description: "Use a custom focus duration (e.g. 12m, 13m, 15m) in Study Space.",
      category: "focus",
      rewardCoins: 30,
      icon: "⏱️",
      requirement: 1,
      getProgress: () => ({ current: usedCustomTimer ? 1 : 0, total: 1 }),
    },
    {
      id: "boss_battle_init",
      title: "Arena Contender",
      description: "Enter and fight in the 2D Boss Battle Arena against the Syllabus Overlords.",
      category: "combat",
      rewardCoins: 60,
      icon: "⚔️",
      requirement: 1,
      getProgress: () => ({ current: Math.min(bossBattlesCount, 1), total: 1 }),
    },
    {
      id: "avatar_stylist",
      title: "Cambridge Couturier",
      description: "Personalise your student avatar with distinct hairstyles, clothing, or skin tones.",
      category: "scholar",
      rewardCoins: 40,
      icon: "🎨",
      requirement: 1,
      getProgress: () => ({ current: isAvatarStyled ? 1 : 0, total: 1 }),
    },
    {
      id: "mastered_glossary_5",
      title: "Terminology Master",
      description: "Mark 5 or more key Cambridge business concepts as mastered in the Glossary.",
      category: "scholar",
      rewardCoins: 45,
      icon: "📖",
      requirement: 5,
      getProgress: () => ({ current: Math.min(masteredTerms.length, 5), total: 5 }),
    },
  ];
}

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AchievementsModal({ isOpen, onClose }: AchievementsModalProps) {
  const [coins, setCoins] = useState<number>(() => getStudyCoins());
  const [claimedIds, setClaimedIds] = useState<string[]>(() => loadClaimedAchievements());
  const [activeFilter, setActiveFilter] = useState<"all" | "claimable" | "in_progress" | "claimed">("all");
  const [claimedToast, setClaimedToast] = useState<{ title: string; coins: number } | null>(null);

  // Sync coins & claims
  useEffect(() => {
    const handleCoinsUpdate = () => setCoins(getStudyCoins());
    const handleAchievementsUpdate = () => setClaimedIds(loadClaimedAchievements());
    window.addEventListener("ecbiz_coins_updated", handleCoinsUpdate);
    window.addEventListener("ecbiz_achievements_updated", handleAchievementsUpdate);
    return () => {
      window.removeEventListener("ecbiz_coins_updated", handleCoinsUpdate);
      window.removeEventListener("ecbiz_achievements_updated", handleAchievementsUpdate);
    };
  }, []);

  const definitions = useMemo(() => getAchievementsDefinitions(), [isOpen, claimedIds]);

  const claimableCount = useMemo(() => {
    return definitions.filter((d) => {
      const isClaimed = claimedIds.includes(d.id);
      const progress = d.getProgress();
      const isComplete = progress.current >= d.requirement;
      return isComplete && !isClaimed;
    }).length;
  }, [definitions, claimedIds]);

  if (!isOpen) return null;

  const handleClaim = (ach: AchievementDefinition) => {
    const success = claimAchievement(ach.id, ach.rewardCoins);
    if (success) {
      setClaimedIds(loadClaimedAchievements());
      setCoins(getStudyCoins());
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
      setClaimedToast({ title: ach.title, coins: ach.rewardCoins });
      setTimeout(() => setClaimedToast(null), 3000);
    }
  };

  const handleClaimAll = () => {
    let totalClaimedCoins = 0;
    definitions.forEach((ach) => {
      if (!claimedIds.includes(ach.id)) {
        const progress = ach.getProgress();
        if (progress.current >= ach.requirement) {
          claimAchievement(ach.id, ach.rewardCoins);
          totalClaimedCoins += ach.rewardCoins;
        }
      }
    });

    if (totalClaimedCoins > 0) {
      setClaimedIds(loadClaimedAchievements());
      setCoins(getStudyCoins());
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });
      setClaimedToast({ title: "All Available Rewards", coins: totalClaimedCoins });
      setTimeout(() => setClaimedToast(null), 3500);
    }
  };

  const filteredDefinitions = definitions.filter((ach) => {
    const isClaimed = claimedIds.includes(ach.id);
    const progress = ach.getProgress();
    const isComplete = progress.current >= ach.requirement;

    if (activeFilter === "claimable") return isComplete && !isClaimed;
    if (activeFilter === "in_progress") return !isComplete;
    if (activeFilter === "claimed") return isClaimed;
    return true;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="achievements-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-[#FAF9F6] dark:bg-black border border-[#E7E5E4] dark:border-neutral-800 rounded-3xl w-full max-w-4xl max-h-[92vh] shadow-2xl flex flex-col overflow-hidden text-[#1C1917] dark:text-neutral-100">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#E7E5E4] dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-neutral-900 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 text-xl font-bold shadow-xs">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="achievements-modal-title" className="text-base sm:text-lg font-bold font-academic-serif">
                  Achievements & Milestones
                </h2>
                {claimableCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500 text-white animate-pulse">
                    {claimableCount} Ready to Claim!
                  </span>
                )}
              </div>
              <p className="text-xs text-[#78716C] dark:text-neutral-400">
                Accomplish study targets to claim bonus Study Coins for cosmetics & themes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Coins Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-bold font-mono">
              <span>🪙</span>
              <span>{coins}</span>
              <span className="text-[10px] text-amber-600/70 hidden sm:inline">Coins</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              title="Close Achievements"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Claim Toast Notification */}
        {claimedToast && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-semibold flex items-center justify-between animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>
                Claimed reward for <strong className="font-bold">{claimedToast.title}</strong>!
              </span>
            </div>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
              +{claimedToast.coins} Coins 🪙
            </span>
          </div>
        )}

        {/* Filter Navigation & Claim All Button */}
        <div className="px-6 py-3 border-b border-[#E7E5E4] dark:border-neutral-800 bg-[#FAF9F6] dark:bg-black flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeFilter === "all"
                  ? "bg-[#0F2042] dark:bg-white text-white dark:text-black shadow-xs"
                  : "bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 text-[#57534E] dark:text-neutral-300 hover:bg-neutral-100"
              }`}
            >
              All ({definitions.length})
            </button>
            <button
              onClick={() => setActiveFilter("claimable")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeFilter === "claimable"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
              }`}
            >
              <span>Ready to Claim</span>
              {claimableCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white font-bold">
                  {claimableCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveFilter("in_progress")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeFilter === "in_progress"
                  ? "bg-[#0F2042] dark:bg-white text-white dark:text-black shadow-xs"
                  : "bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 text-[#57534E] dark:text-neutral-300 hover:bg-neutral-100"
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setActiveFilter("claimed")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeFilter === "claimed"
                  ? "bg-[#0F2042] dark:bg-white text-white dark:text-black shadow-xs"
                  : "bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 text-[#57534E] dark:text-neutral-300 hover:bg-neutral-100"
              }`}
            >
              Claimed ({claimedIds.length})
            </button>
          </div>

          {claimableCount > 0 && (
            <button
              onClick={handleClaimAll}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Claim All Rewards ({claimableCount})</span>
            </button>
          )}
        </div>

        {/* Scrollable Achievements Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredDefinitions.length === 0 ? (
            <div className="text-center py-12 text-[#78716C] dark:text-neutral-400 text-sm">
              <Trophy className="w-10 h-10 mx-auto opacity-30 mb-2" />
              <p>No achievements match this filter.</p>
            </div>
          ) : (
            filteredDefinitions.map((ach) => {
              const isClaimed = claimedIds.includes(ach.id);
              const progress = ach.getProgress();
              const isComplete = progress.current >= ach.requirement;
              const pct = Math.min(100, Math.round((progress.current / ach.requirement) * 100));

              return (
                <div
                  key={ach.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isClaimed
                      ? "bg-white/60 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 opacity-75"
                      : isComplete
                      ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/40 ring-1 ring-emerald-500/20 shadow-sm"
                      : "bg-white dark:bg-neutral-900 border-[#E7E5E4] dark:border-neutral-800 shadow-xs"
                  }`}
                >
                  {/* Left: Icon & Description */}
                  <div className="flex items-start gap-3.5 flex-1">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border ${
                        isClaimed
                          ? "bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                          : isComplete
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600"
                          : "bg-[#FAF9F6] dark:bg-black border-[#E7E5E4] dark:border-neutral-800"
                      }`}
                    >
                      <span>{ach.icon}</span>
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-[#0F2042] dark:text-white font-academic-serif">
                          {ach.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          +{ach.rewardCoins} Coins
                        </span>
                      </div>
                      <p className="text-xs text-[#57534E] dark:text-neutral-400 leading-relaxed">
                        {ach.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="pt-1.5 flex items-center gap-2.5 max-w-sm">
                        <div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${
                              isClaimed
                                ? "bg-neutral-400 dark:bg-neutral-600"
                                : isComplete
                                ? "bg-emerald-500"
                                : "bg-indigo-500"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                          {progress.current} / {ach.requirement}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Action Button or Claim Status */}
                  <div className="shrink-0 self-end sm:self-center">
                    {isClaimed ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-xs font-semibold">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Claimed</span>
                      </div>
                    ) : isComplete ? (
                      <button
                        onClick={() => handleClaim(ach)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition active:scale-95 cursor-pointer animate-pulse"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Claim +{ach.rewardCoins} 🪙</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 text-neutral-400 text-xs font-medium border border-neutral-200/50 dark:border-neutral-700/50">
                        <Lock className="w-3 h-3 opacity-60" />
                        <span>{pct}% Done</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary */}
        <div className="px-6 py-3.5 border-t border-[#E7E5E4] dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between text-xs text-[#78716C] dark:text-neutral-400">
          <div>
            Total Unlocked:{" "}
            <span className="font-bold text-[#0F2042] dark:text-white">
              {claimedIds.length} / {definitions.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-200 font-semibold cursor-pointer transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

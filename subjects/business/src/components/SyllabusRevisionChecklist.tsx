"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import confetti from "canvas-confetti";
import {
  DETAILED_0264_SYLLABUS,
  DetailedSection,
  DetailedTopic,
  DetailedSubtopic,
  SyllabusBulletPoint,
} from "../lib/data/detailed-syllabus-0264";

import {
  loadRevisedTopics,
  saveRevisedTopics,
  loadSyllabusRatings,
  saveSyllabusRatings,
  SyllabusPointRating,
  SyllabusRatingsMap,
  awardBonusStudyCoins,
} from "../lib/cookies";
import { GLOSSARY_TERMS } from "../lib/data/glossary";
import { FactorsOfProductionDiagram } from "./FactorsOfProductionDiagram";
import {
  Check,
  RotateCcw,
  ArrowRight,
  ExternalLink,
  Brain,
  Eye,
  CheckCircle2,
  X,
  Search,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export interface GranularPointItem {
  id: string; // e.g. "1.2.1-pt-1"
  sectionCode: string; // e.g. "1"
  sectionTitle: string; // e.g. "1. Understanding business activity"
  topicCode: string; // e.g. "1.2"
  topicTitle: string; // e.g. "Economic sectors"
  subtopicCode: string; // e.g. "1.2.1"
  subtopicTitle: string; // e.g. "Types of economic sector"
  text: string; // e.g. "primary, secondary and tertiary sectors"
  subject: "business";
}

interface SyllabusRevisionChecklistProps {
  onSelectTopicForPractice?: (subject: "business", sectionCode: string, topicCode: string) => void;
  initialSubject?: "business";
  className?: string;
}

export function SyllabusRevisionChecklist({
  onSelectTopicForPractice,
  initialSubject = "business",
  className = "",
}: SyllabusRevisionChecklistProps) {
  const [activeSubject] = useState<"business">("business");
  const [revisedTopicCodes, setRevisedTopicCodes] = useState<string[]>([]);
  const [ratings, setRatings] = useState<SyllabusRatingsMap>({});
  const [filterRating, setFilterRating] = useState<"all" | "hard" | "moderate" | "easy" | "unrated">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Accordion open/close state for sections and topics
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "1": true,
    "2": true,
    "3": false,
    "4": false,
    "5": false,
    "6": false,
    "E1": true,
    "E2": true,
  });

  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({
    "1.1": true,
    "1.2": true,
    "1.3": true,
  });

  // Active Recall Drill Modal / Card State
  const [drillTarget, setDrillTarget] = useState<{
    tier: "hard" | "moderate" | "easy" | "all";
    currentIndex: number;
    points: GranularPointItem[];
  } | null>(null);

  const [drillAnswer, setDrillAnswer] = useState<string>("");
  const [showMarkScheme, setShowMarkScheme] = useState<boolean>(false);
  const [showFactorsModal, setShowFactorsModal] = useState<boolean>(false);

  // Load ratings and checked topics on mount
  useEffect(() => {
    setRevisedTopicCodes(loadRevisedTopics());
    setRatings(loadSyllabusRatings());
  }, []);

  // Flatten all granular bullet points for Cambridge 0264 Business Studies
  const allGranularPoints: GranularPointItem[] = useMemo(() => {
    const list: GranularPointItem[] = [];

    DETAILED_0264_SYLLABUS.forEach((sec) => {
      sec.topics.forEach((top) => {
        top.subtopics.forEach((sub) => {
          sub.bulletPoints.forEach((pt) => {
            list.push({
              id: pt.id,
              sectionCode: sec.code,
              sectionTitle: sec.title,
              topicCode: top.code,
              topicTitle: top.title,
              subtopicCode: sub.code,
              subtopicTitle: sub.title,
              text: pt.text,
              subject: "business",
            });
          });
        });
      });
    });

    return list;
  }, []);

  // Categorize points by rating
  const hardPoints = useMemo(() => allGranularPoints.filter((p) => ratings[p.id] === "hard"), [allGranularPoints, ratings]);
  const moderatePoints = useMemo(() => allGranularPoints.filter((p) => ratings[p.id] === "moderate"), [allGranularPoints, ratings]);
  const easyPoints = useMemo(() => allGranularPoints.filter((p) => ratings[p.id] === "easy"), [allGranularPoints, ratings]);
  const unratedPoints = useMemo(() => allGranularPoints.filter((p) => !ratings[p.id]), [allGranularPoints, ratings]);

  const totalPointsCount = allGranularPoints.length;
  const ratedPointsCount = totalPointsCount - unratedPoints.length;
  const progressPercentage = totalPointsCount > 0
    ? Math.round((ratedPointsCount / totalPointsCount) * 100)
    : 0;

  // Rate an individual granular point
  const handleRatePoint = (pointId: string, rating: SyllabusPointRating) => {
    const nextRatings = { ...ratings };
    if (nextRatings[pointId] === rating) {
      delete nextRatings[pointId]; // Toggle off
    } else {
      nextRatings[pointId] = rating;
      // Award study coins for active syllabus evaluation
      awardBonusStudyCoins(5);
    }
    setRatings(nextRatings);
    saveSyllabusRatings(nextRatings);
  };

  // Toggle topic revised checkbox
  const handleToggleTopic = useCallback((topicCode: string) => {
    setRevisedTopicCodes((prev) => {
      let next: string[];
      const isChecking = !prev.includes(topicCode);
      if (isChecking) {
        next = [...prev, topicCode];
        // Award bonus coins for completing a syllabus topic revision
        awardBonusStudyCoins(10);
      } else {
        next = prev.filter((c) => c !== topicCode);
      }
      saveRevisedTopics(next);
      return next;
    });
  }, []);

  // Reset ratings for current subject
  const handleResetRatings = () => {
    if (confirm("Reset all memory ratings (Hard/Moderate/Easy) for Business Studies (0264)?")) {
      const nextRatings = { ...ratings };
      allGranularPoints.forEach((p) => {
        delete nextRatings[p.id];
      });
      setRatings(nextRatings);
      saveSyllabusRatings(nextRatings);
    }
  };

  const toggleSectionAccordion = (secCode: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [secCode]: !prev[secCode],
    }));
  };

  const toggleTopicAccordion = (topCode: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topCode]: !prev[topCode],
    }));
  };

  const handleExpandAll = () => {
    const nextSec: Record<string, boolean> = {};
    const nextTop: Record<string, boolean> = {};
    DETAILED_0264_SYLLABUS.forEach((sec) => {
      nextSec[sec.code] = true;
      sec.topics.forEach((t) => {
        nextTop[t.code] = true;
      });
    });
    setExpandedSections(nextSec);
    setExpandedTopics(nextTop);
  };

  const handleCollapseAll = () => {
    setExpandedSections({});
    setExpandedTopics({});
  };

  // Launch targeted drill session for a tier
  const handleStartDrill = (tier: "hard" | "moderate" | "easy" | "all") => {
    let targetList: GranularPointItem[] = [];
    if (tier === "hard") targetList = hardPoints;
    else if (tier === "moderate") targetList = moderatePoints;
    else if (tier === "easy") targetList = easyPoints;
    else targetList = allGranularPoints;

    if (targetList.length === 0) {
      if (tier === "hard") {
        alert("You currently have 0 points rated 'Hard'. Rate sub-points below as Hard (🔴) to practice them!");
      } else if (tier === "moderate") {
        alert("You currently have 0 points rated 'Moderate'. Rate sub-points below as Moderate (🟡) to practice them!");
      } else if (tier === "easy") {
        alert("You currently have 0 points rated 'Easy'. Rate sub-points below as Easy (🟢) to practice them!");
      }
      return;
    }

    setDrillTarget({
      tier,
      currentIndex: 0,
      points: targetList,
    });
    setDrillAnswer("");
    setShowMarkScheme(false);
  };

  // Launch drill for a single specific sub-point
  const handleDrillSinglePoint = (point: GranularPointItem) => {
    setDrillTarget({
      tier: "all",
      currentIndex: 0,
      points: [point],
    });
    setDrillAnswer("");
    setShowMarkScheme(false);
  };

  const currentDrillPoint = drillTarget ? drillTarget.points[drillTarget.currentIndex] : null;

  // Find glossary term matching current drill point
  const matchedGlossaryTerm = useMemo(() => {
    if (!currentDrillPoint) return null;
    const q = currentDrillPoint.text.toLowerCase();
    return GLOSSARY_TERMS.find(
      (t) =>
        t.term.toLowerCase() === q ||
        q.includes(t.term.toLowerCase()) ||
        t.term.toLowerCase().includes(q)
    );
  }, [currentDrillPoint]);

  return (
    <div className={`bg-white dark:bg-black border border-[#E7E5E4] dark:border-neutral-800 rounded-2xl p-4 sm:p-7 shadow-xs transition-colors ${className}`}>
      {/* Top Banner & Subject Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E7E5E4] dark:border-neutral-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F2042] dark:text-neutral-200">
              CIE Cambridge 0264 Full Granular Syllabus Checklist
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-300/40 dark:border-emerald-700/40">
              {totalPointsCount} Granular Syllabus Detail Points
            </span>
          </div>
          <h2 className="font-academic-serif text-xl sm:text-2xl font-bold text-[#0F2042] dark:text-white">
            IGCSE 0264 Complete Syllabus Checklist
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] dark:text-neutral-400 mt-1">
            Every official syllabus subtopic (e.g. <strong>1.2.1 Types of economic sector</strong>) and its specific detailed points (<strong>primary, secondary and tertiary sectors</strong>, <strong>private and public sectors</strong>, etc.). Rate how well you remember each point, then click the buttons below to test and answer the points you find hard, moderate, or easy!
          </p>
        </div>

        {/* Cambridge 0264 Syllabus Badge & Top Feedback Link */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
          <span className="px-3.5 py-1.5 rounded-xl bg-[#0F2042] dark:bg-white text-white dark:text-black font-semibold text-xs shadow-xs font-mono">
            Cambridge 0264 / 0450
          </span>
          <a
            href="https://forms.gle/6X2CAR1LkSQGRBx68"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/80 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-semibold text-xs transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
            title="Report a bug or suggest an improvement"
          >
            <span>💡</span>
            <span>Bug / Suggestion</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TARGETED DRILL BUTTONS: ANSWER HARD, MODERATE & EASY      */}
      {/* ========================================================= */}
      <div className="my-5 p-4 sm:p-5 rounded-2xl bg-[#FAF9F6] dark:bg-neutral-900/60 border-2 border-indigo-500/20 dark:border-neutral-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-academic-serif text-base sm:text-lg font-bold text-[#0F2042] dark:text-white">
                Active Recall Drill: Answer by Memory Strength
              </h3>
            </div>
            <p className="text-xs text-[#57534E] dark:text-neutral-400 mt-1">
              Click a button below to launch an active recall question session on the syllabus points you find hard, moderate, or easy:
            </p>
          </div>

          {/* 3 Core Action Buttons to Answer Points */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Button 1: Answer Hard Points */}
            <button
              type="button"
              onClick={() => handleStartDrill("hard")}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm shadow-rose-600/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-rose-500"
              title="Practice all syllabus points you rated Hard to remember"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>Answer Hard Points</span>
              <span className="px-1.5 py-0.5 rounded-full bg-rose-800 text-[10px] font-mono">
                {hardPoints.length}
              </span>
            </button>

            {/* Button 2: Answer Moderate Points */}
            <button
              type="button"
              onClick={() => handleStartDrill("moderate")}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shadow-sm shadow-amber-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-amber-400"
              title="Practice all syllabus points you rated Moderate"
            >
              <span>Answer Moderate</span>
              <span className="px-1.5 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-mono">
                {moderatePoints.length}
              </span>
            </button>

            {/* Button 3: Answer Easy Points */}
            <button
              type="button"
              onClick={() => handleStartDrill("easy")}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-emerald-500"
              title="Quick refresher on syllabus points you rated Easy"
            >
              <span>Answer Easy</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-800 text-[10px] font-mono">
                {easyPoints.length}
              </span>
            </button>
          </div>
        </div>

        {/* Memory Tier Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-[#E7E5E4] dark:border-neutral-800 text-xs">
          <div className="p-2.5 rounded-xl bg-white dark:bg-black border border-rose-200 dark:border-rose-950/40 flex items-center justify-between">
            <span className="font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Hard to Remember
            </span>
            <span className="font-mono font-bold text-sm text-rose-700 dark:text-rose-300">
              {hardPoints.length}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-black border border-amber-200 dark:border-amber-950/40 flex items-center justify-between">
            <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Moderate
            </span>
            <span className="font-mono font-bold text-sm text-amber-700 dark:text-amber-300">
              {moderatePoints.length}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-black border border-emerald-200 dark:border-emerald-950/40 flex items-center justify-between">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Easy to Remember
            </span>
            <span className="font-mono font-bold text-sm text-emerald-700 dark:text-emerald-300">
              {easyPoints.length}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-black border border-[#E7E5E4] dark:border-neutral-800 flex items-center justify-between">
            <span className="text-[#78716C] dark:text-neutral-400">
              Unrated Points
            </span>
            <span className="font-mono font-bold text-sm text-[#1C1917] dark:text-white">
              {unratedPoints.length} / {totalPointsCount}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* INTERACTIVE DRILL POPUP / STUDIO (WHEN ACTIVE)            */}
      {/* ========================================================= */}
      {drillTarget && currentDrillPoint && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-neutral-900 border-2 border-[#0F2042] dark:border-neutral-700 rounded-2xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Drill Header */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#E7E5E4] dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  Targeted Drill ({drillTarget.tier.toUpperCase()})
                </span>
                <span className="text-xs font-mono text-[#78716C] dark:text-neutral-400">
                  Point {drillTarget.currentIndex + 1} of {drillTarget.points.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setDrillTarget(null)}
                className="p-1 rounded-lg text-[#78716C] dark:text-neutral-400 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 cursor-pointer"
                title="Close Drill"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-Point Prompt Details */}
            <div className="mt-4">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                <span>{currentDrillPoint.subtopicCode}</span>
                <span>•</span>
                <span>{currentDrillPoint.subtopicTitle}</span>
              </div>

              <h3 className="font-academic-serif text-lg sm:text-xl font-bold text-[#0F2042] dark:text-white mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                <span>{currentDrillPoint.text}</span>
              </h3>

              <div className="p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-black border border-[#E7E5E4] dark:border-neutral-800 text-xs sm:text-sm text-[#1C1917] dark:text-neutral-200 mb-4">
                <strong>Active Recall Prompt:</strong>
                <p className="mt-1 text-[#57534E] dark:text-neutral-300">
                  {matchedGlossaryTerm
                    ? `Define and explain "${currentDrillPoint.text}". State core characteristics, practical business applications, and common examiner questions.`
                    : `Explain the key business principles behind "${currentDrillPoint.text}". State 2 key explanations or examples that a Cambridge examiner looks for in Paper 1 or Paper 2.`}
                </p>
              </div>

              {/* Student Answer Textarea */}
              <div className="mb-4">
                <label className="block text-xs font-mono font-semibold text-[#57534E] dark:text-neutral-400 mb-1.5">
                  Your Answer / Active Recall Notes:
                </label>
                <textarea
                  value={drillAnswer}
                  onChange={(e) => setDrillAnswer(e.target.value)}
                  placeholder="Type your explanation, definitions, or bullet points here..."
                  rows={4}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-neutral-700 bg-white dark:bg-black text-[#1C1917] dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2042] dark:focus:ring-white resize-y"
                />
              </div>

              {/* Reveal Mark Scheme Button */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setShowMarkScheme(!showMarkScheme)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#0F2042] dark:border-white text-[#0F2042] dark:text-white text-xs font-semibold hover:bg-slate-50 dark:hover:bg-neutral-800 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showMarkScheme ? "Hide Mark Scheme" : "Show CIE Mark Scheme & Notes"}</span>
                </button>

                {onSelectTopicForPractice && (
                  <button
                    type="button"
                    onClick={() => {
                      setDrillTarget(null);
                      onSelectTopicForPractice(currentDrillPoint.subject, currentDrillPoint.sectionCode, currentDrillPoint.topicCode);
                    }}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <span>Practice full exam question in Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Mark Scheme Dropdown Card */}
              {showMarkScheme && (
                <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/30 text-xs text-[#1C1917] dark:text-neutral-200 mb-4 animate-in fade-in">
                  <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>CIE Marking Guidance & Model Content</span>
                  </div>

                  {matchedGlossaryTerm ? (
                    <div className="space-y-2 mt-2">
                      <div>
                        <strong>Official Definition:</strong>
                        <p className="mt-0.5 text-[#334155] dark:text-neutral-300 font-serif">
                          "{matchedGlossaryTerm.definition}"
                        </p>
                      </div>
                      {matchedGlossaryTerm.exampleContext && (
                        <div>
                          <strong>Contextual Example:</strong>
                          <p className="mt-0.5 text-[#334155] dark:text-neutral-300">
                            {matchedGlossaryTerm.exampleContext}
                          </p>
                        </div>
                      )}
                      {matchedGlossaryTerm.examAdvice && (
                        <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300">
                          <strong>Examiner Tip:</strong> {matchedGlossaryTerm.examAdvice}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="mt-1 text-[#334155] dark:text-neutral-300">
                      Ensure you state the clear definition, explain the causal impact on business costs, revenue, or stakeholders, and provide relevant context.
                    </p>
                  )}
                </div>
              )}

              {/* Rate / Update Memory Rating for this sub-point */}
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-black border border-[#E7E5E4] dark:border-neutral-800 mb-5">
                <span className="block text-xs font-mono font-bold uppercase tracking-wider text-[#0F2042] dark:text-neutral-300 mb-2">
                  Update Memory Strength for this Point:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleRatePoint(currentDrillPoint.id, "hard")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                      ratings[currentDrillPoint.id] === "hard"
                        ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                        : "bg-white dark:bg-neutral-800 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-900"
                    }`}
                  >
                    <span>🔴 Still Hard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRatePoint(currentDrillPoint.id, "moderate")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                      ratings[currentDrillPoint.id] === "moderate"
                        ? "bg-amber-500 text-black border-amber-500 shadow-xs"
                        : "bg-white dark:bg-neutral-800 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-900"
                    }`}
                  >
                    <span>🟡 Moderate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRatePoint(currentDrillPoint.id, "easy")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                      ratings[currentDrillPoint.id] === "easy"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-white dark:bg-neutral-800 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-900"
                    }`}
                  >
                    <span>🟢 Easy / Mastered</span>
                  </button>
                </div>
              </div>

              {/* Navigation Between Drill Points */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#E7E5E4] dark:border-neutral-800">
                <button
                  type="button"
                  disabled={drillTarget.currentIndex === 0}
                  onClick={() => {
                    setDrillTarget((prev) => prev ? { ...prev, currentIndex: prev.currentIndex - 1 } : null);
                    setDrillAnswer("");
                    setShowMarkScheme(false);
                  }}
                  className="px-3.5 py-2 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 text-xs font-semibold text-[#57534E] dark:text-neutral-300 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 disabled:opacity-40 cursor-pointer"
                >
                  ← Previous Point
                </button>

                <button
                  type="button"
                  disabled={drillTarget.currentIndex >= drillTarget.points.length - 1}
                  onClick={() => {
                    setDrillTarget((prev) => prev ? { ...prev, currentIndex: prev.currentIndex + 1 } : null);
                    setDrillAnswer("");
                    setShowMarkScheme(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#0F2042] dark:bg-white text-white dark:text-black text-xs font-bold hover:bg-[#1E3A8A] dark:hover:bg-neutral-200 disabled:opacity-40 cursor-pointer"
                >
                  Next Point →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SEARCH, FILTER CONTROLS & EXPAND/COLLAPSE ALL             */}
      {/* ========================================================= */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search syllabus sub-points (e.g. sectors, business plan, break-even)..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs text-[#1C1917] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F2042] dark:focus:ring-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-black dark:hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        {/* Expand / Collapse & Reset Actions */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            type="button"
            onClick={handleExpandAll}
            className="px-2.5 py-1 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[11px] font-semibold text-[#57534E] dark:text-neutral-300 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 cursor-pointer"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={handleCollapseAll}
            className="px-2.5 py-1 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[11px] font-semibold text-[#57534E] dark:text-neutral-300 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 cursor-pointer"
          >
            Collapse All
          </button>
          <button
            type="button"
            onClick={handleResetRatings}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[11px] text-[#78716C] dark:text-neutral-400 hover:text-red-600 hover:border-red-300 transition cursor-pointer"
            title="Reset memory ratings"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Memory Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 mb-5 pb-3 border-b border-[#E7E5E4] dark:border-neutral-800">
        <span className="text-xs font-mono text-[#78716C] dark:text-neutral-400 mr-1">
          Filter View:
        </span>
        <button
          type="button"
          onClick={() => setFilterRating("all")}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
            filterRating === "all"
              ? "bg-[#0F2042] text-white dark:bg-white dark:text-black border-transparent shadow-xs"
              : "bg-white dark:bg-neutral-900 text-[#57534E] dark:text-neutral-400 border-[#E7E5E4] dark:border-neutral-800 hover:border-slate-400"
          }`}
        >
          All Points ({allGranularPoints.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterRating("hard")}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
            filterRating === "hard"
              ? "bg-rose-600 text-white border-transparent shadow-xs"
              : "bg-white dark:bg-neutral-900 text-rose-600 dark:text-rose-400 border-[#E7E5E4] dark:border-neutral-800 hover:border-rose-400"
          }`}
        >
          🔴 Hard ({hardPoints.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterRating("moderate")}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
            filterRating === "moderate"
              ? "bg-amber-500 text-black border-transparent shadow-xs"
              : "bg-white dark:bg-neutral-900 text-amber-600 dark:text-amber-400 border-[#E7E5E4] dark:border-neutral-800 hover:border-amber-400"
          }`}
        >
          🟡 Moderate ({moderatePoints.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterRating("easy")}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
            filterRating === "easy"
              ? "bg-emerald-600 text-white border-transparent shadow-xs"
              : "bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 border-[#E7E5E4] dark:border-neutral-800 hover:border-emerald-400"
          }`}
        >
          🟢 Easy ({easyPoints.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterRating("unrated")}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
            filterRating === "unrated"
              ? "bg-slate-700 text-white dark:bg-neutral-200 dark:text-black border-transparent shadow-xs"
              : "bg-white dark:bg-neutral-900 text-[#78716C] dark:text-neutral-400 border-[#E7E5E4] dark:border-neutral-800"
          }`}
        >
          ⚪ Unrated ({unratedPoints.length})
        </button>
      </div>

      {/* ========================================================= */}
      {/* SECTIONS, SUBTOPICS & GRANULAR BULLET POINTS              */}
      {/* ========================================================= */}
      <div className="space-y-4">
        {DETAILED_0264_SYLLABUS.map((section) => {
            const isSecExpanded = expandedSections[section.code] ?? true;

            // Filter topics by search and rating
            const matchingTopics = section.topics.filter((topic) => {
              return topic.subtopics.some((sub) => {
                return sub.bulletPoints.some((pt) => {
                  const matchesSearch = !searchQuery ||
                    pt.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    sub.code.includes(searchQuery) ||
                    topic.title.toLowerCase().includes(searchQuery.toLowerCase());

                  if (!matchesSearch) return false;

                  const r = ratings[pt.id];
                  if (filterRating === "all") return true;
                  if (filterRating === "unrated") return !r;
                  return r === filterRating;
                });
              });
            });

            if (matchingTopics.length === 0 && (searchQuery || filterRating !== "all")) {
              return null;
            }

            return (
              <div
                key={section.code}
                className="rounded-xl border border-[#E7E5E4] dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs"
              >
                {/* Section Header */}
                <div
                  onClick={() => toggleSectionAccordion(section.code)}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-3 bg-[#FAF9F6]/80 dark:bg-black/40 border-b border-[#E7E5E4] dark:border-neutral-800 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <h3 className="font-academic-serif font-bold text-sm sm:text-base text-[#0F2042] dark:text-white">
                      {section.title}
                    </h3>
                    <span className="text-xs font-mono text-[#78716C] dark:text-neutral-400">
                      ({section.topics.length} topics)
                    </span>
                  </div>

                  <button
                    type="button"
                    className="p-1 rounded text-[#78716C] dark:text-neutral-400 hover:text-black dark:hover:text-white transition"
                    aria-label="Toggle section"
                  >
                    <span className={`inline-block transition-transform duration-200 ${isSecExpanded ? "rotate-180" : ""}`}>
                      ▾
                    </span>
                  </button>
                </div>

                {/* Section Topics */}
                {isSecExpanded && (
                  <div className="p-3 sm:p-4 space-y-4">
                    {matchingTopics.map((topic) => {
                      const isTopExpanded = expandedTopics[topic.code] ?? true;

                      return (
                        <div
                          key={topic.code}
                          className="rounded-xl border border-[#E7E5E4] dark:border-neutral-800 bg-[#FAF9F6]/40 dark:bg-black/30 overflow-hidden"
                        >
                          {/* Topic Header Bar */}
                          <div
                            onClick={() => toggleTopicAccordion(topic.code)}
                            className="p-3 flex items-center justify-between gap-2.5 bg-white dark:bg-neutral-900/90 border-b border-[#E7E5E4] dark:border-neutral-800 cursor-pointer select-none"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 text-[#0F2042] dark:text-[#38BDF8] border border-slate-200 dark:border-neutral-700">
                                {topic.code}
                              </span>
                              <h4 className="font-academic-serif text-xs sm:text-sm font-bold text-[#0F2042] dark:text-white">
                                {topic.title}
                              </h4>
                            </div>

                            <div className="flex items-center gap-3">
                              {topic.code === "1.1" && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowFactorsModal(true);
                                  }}
                                  className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 px-2 py-0.5 rounded-md hover:bg-amber-100 dark:hover:bg-amber-900/60 flex items-center gap-1 cursor-pointer"
                                  title="Open interactive Factors of Production & Rewards diagram"
                                >
                                  <span>📊 Factors Diagram</span>
                                </button>
                              )}
                              {onSelectTopicForPractice && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectTopicForPractice("business", section.code, topic.code);
                                  }}
                                  className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  <span>Practice in Studio</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                              <span className={`text-slate-400 transition-transform ${isTopExpanded ? "rotate-180" : ""}`}>
                                ▾
                              </span>
                            </div>
                          </div>

                          {/* Subtopics & Detailed Bullets */}
                          {isTopExpanded && (
                            <div className="p-3 sm:p-4 space-y-3.5">
                              {topic.subtopics.map((sub) => {
                                // Filter bullets
                                const filteredBullets = sub.bulletPoints.filter((pt) => {
                                  const matchesSearch = !searchQuery ||
                                    pt.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    sub.code.includes(searchQuery);

                                  if (!matchesSearch) return false;

                                  const r = ratings[pt.id];
                                  if (filterRating === "all") return true;
                                  if (filterRating === "unrated") return !r;
                                  return r === filterRating;
                                });

                                if (filteredBullets.length === 0 && (searchQuery || filterRating !== "all")) {
                                  return null;
                                }

                                return (
                                  <div
                                    key={sub.code}
                                    className="p-3 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xs"
                                  >
                                    {/* Subtopic Title (e.g. 1.2.1 Types of economic sector) */}
                                    <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100 dark:border-neutral-800">
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                          {sub.code}
                                        </span>
                                        <span className="font-academic-serif text-xs sm:text-sm font-bold text-[#0F2042] dark:text-neutral-100">
                                          {sub.title}
                                        </span>
                                      </div>
                                      <span className="text-[10px] font-mono text-slate-400">
                                        {filteredBullets.length} points
                                      </span>
                                    </div>

                                    {/* Detailed Bullet Points List */}
                                    <div className="space-y-2">
                                      {filteredBullets.map((pt) => {
                                        const currentRating = ratings[pt.id];
                                        const granularItem: GranularPointItem = {
                                          id: pt.id,
                                          sectionCode: section.code,
                                          sectionTitle: section.title,
                                          topicCode: topic.code,
                                          topicTitle: topic.title,
                                          subtopicCode: sub.code,
                                          subtopicTitle: sub.title,
                                          text: pt.text,
                                          subject: "business",
                                        };

                                        return (
                                          <div
                                            key={pt.id}
                                            className={`min-h-[40px] px-3 py-2 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                                              currentRating === "hard"
                                                ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/60"
                                                : currentRating === "moderate"
                                                ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900/60"
                                                : currentRating === "easy"
                                                ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900/60"
                                                : "bg-[#FAF9F6] dark:bg-black/40 border-[#E7E5E4] dark:border-neutral-800"
                                            }`}
                                          >
                                            {/* Bullet Text perfectly aligned */}
                                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-neutral-500 shrink-0 self-start sm:self-center mt-1 sm:mt-0" />
                                              <span className="text-xs font-medium text-[#1C1917] dark:text-neutral-200 leading-snug">
                                                {pt.text}
                                              </span>
                                            </div>

                                            {/* Action Buttons: Rate Hard / Moderate / Easy + Answer ✍ */}
                                            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                                              {/* Answer Prompt Button */}
                                              <button
                                                type="button"
                                                onClick={() => handleDrillSinglePoint(granularItem)}
                                                className="px-2 py-1 rounded text-[10px] font-mono font-semibold bg-indigo-50 dark:bg-neutral-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-white dark:hover:text-black transition cursor-pointer"
                                                title="Answer recall question on this syllabus point"
                                              >
                                                Answer ✍
                                              </button>

                                              {/* Hard Button */}
                                              <button
                                                type="button"
                                                onClick={() => handleRatePoint(pt.id, "hard")}
                                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition cursor-pointer border ${
                                                  currentRating === "hard"
                                                    ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                                                    : "bg-white dark:bg-neutral-800 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900 hover:bg-rose-50"
                                                }`}
                                                title="Mark as Hard to remember"
                                              >
                                                🔴 Hard
                                              </button>

                                              {/* Moderate Button */}
                                              <button
                                                type="button"
                                                onClick={() => handleRatePoint(pt.id, "moderate")}
                                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition cursor-pointer border ${
                                                  currentRating === "moderate"
                                                    ? "bg-amber-500 text-black border-amber-500 shadow-xs"
                                                    : "bg-white dark:bg-neutral-800 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900 hover:bg-amber-50"
                                                }`}
                                                title="Mark as Moderate to remember"
                                              >
                                                🟡 Moderate
                                              </button>

                                              {/* Easy Button */}
                                              <button
                                                type="button"
                                                onClick={() => handleRatePoint(pt.id, "easy")}
                                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition cursor-pointer border ${
                                                  currentRating === "easy"
                                                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                                                    : "bg-white dark:bg-neutral-800 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900 hover:bg-emerald-50"
                                                }`}
                                                title="Mark as Easy to remember"
                                              >
                                                🟢 Easy
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Footer feedback link */}
      <div className="mt-8 pt-4 border-t border-[#E7E5E4] dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#78716C] dark:text-neutral-400">
        <div>
          Official CIE Cambridge 0264 syllabus specification structure with 278 verified granular points.
        </div>
        <a
          href="https://forms.gle/6X2CAR1LkSQGRBx68"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0F2042] dark:text-[#38BDF8] hover:underline font-semibold inline-flex items-center gap-1 transition"
        >
          <span>💡 Report bug or suggest an improvement</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Factors of Production Modal (Chapter 1) */}
      <FactorsOfProductionDiagram
        isOpen={showFactorsModal}
        onClose={() => setShowFactorsModal(false)}
      />
    </div>
  );
}

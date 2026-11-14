"use client";

import React, { useState } from "react";
import {
  Users,
  TrendingUp,
  BarChart3,
  Layers,
  DollarSign,
  Globe,
  Building2,
  Target,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowDown,
  HelpCircle,
  Info,
  Sparkles,
  Calculator,
  RefreshCw,
  Sliders,
  X,
  Briefcase,
  Award,
  Scale,
  Smile,
  Frown,
  Check,
  Zap,
} from "lucide-react";

// ============================================================================
// SECTION 2: PEOPLE IN BUSINESS VISUALS
// ============================================================================

/** 1. Real 5-Tier Maslow Pyramid with Interactive Inspection */
function MaslowPyramidVisual() {
  const [selectedTier, setSelectedTier] = useState<number>(5);

  const tiers = [
    {
      level: 5,
      name: "Self-Actualisation",
      sub: "Peak of Potential",
      color: "bg-purple-600 dark:bg-purple-500",
      lightColor: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800",
      textColor: "text-purple-700 dark:text-purple-300",
      widthClass: "w-[44%]",
      desc: "Reaching one's personal maximum potential, creative fulfillment, and personal development.",
      workplaceExample: "Challenging projects, autonomy to innovate, sabbatical to master a craft, leading strategic initiatives.",
      examTip: "Cambridge Tip: Higher needs only act as motivators once lower needs are satisfied. A bonus will not satisfy self-actualisation.",
    },
    {
      level: 4,
      name: "Esteem Needs",
      sub: "Status & Recognition",
      color: "bg-indigo-600 dark:bg-indigo-500",
      lightColor: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800",
      textColor: "text-indigo-700 dark:text-indigo-300",
      widthClass: "w-[58%]",
      desc: "Respect from others, feeling valued, having status, self-confidence, and public acknowledgment.",
      workplaceExample: "Prestigious job title, 'Employee of the Month', public praise in meetings, promotion, private office or company car.",
      examTip: "Esteem is a non-financial motivator. Praise and recognition cost the firm nothing but boost retention significantly.",
    },
    {
      level: 3,
      name: "Social / Belonging Needs",
      sub: "Love & Acceptance",
      color: "bg-blue-600 dark:bg-blue-500",
      lightColor: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
      textColor: "text-blue-700 dark:text-blue-300",
      widthClass: "w-[72%]",
      desc: "Friendship, acceptance by peer groups, belonging to a team, and feeling part of a community.",
      workplaceExample: "Team-working structures, collegial work environment, social events, staff canteen, company sports clubs.",
      examTip: "Taylor's scientific management ignored social needs, treating workers like machines. Maslow proved isolation lowers morale.",
    },
    {
      level: 2,
      name: "Safety & Security Needs",
      sub: "Protection & Stability",
      color: "bg-teal-600 dark:bg-teal-500",
      lightColor: "bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800",
      textColor: "text-teal-700 dark:text-teal-300",
      widthClass: "w-[86%]",
      desc: "Physical safety, financial stability, certainty of employment, and freedom from danger or arbitrary dismissal.",
      workplaceExample: "Permanent employment contract (vs zero-hours), safe protective gear (PPE), pension scheme, clear grievance procedures.",
      examTip: "If a business announces redundancies, employees drop straight back to Safety needs and stop caring about Esteem or Teamwork.",
    },
    {
      level: 1,
      name: "Physiological Needs",
      sub: "Basic Survival Foundation",
      color: "bg-emerald-600 dark:bg-emerald-500",
      lightColor: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
      textColor: "text-emerald-700 dark:text-emerald-300",
      widthClass: "w-[100%]",
      desc: "The essential physical requirements for human survival: food, water, warmth, shelter, and rest.",
      workplaceExample: "Fair living wage (basic pay), clean drinking water, adequate restroom facilities, heating/ventilation, mandated rest breaks.",
      examTip: "Foundation of the pyramid: if workers cannot afford food or shelter on their basic wage, no other motivator will work.",
    },
  ];

  const active = tiers.find((t) => t.level === selectedTier) ?? tiers[0];

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-800/60 border border-slate-200 dark:border-neutral-700 text-xs text-slate-700 dark:text-neutral-300 leading-relaxed flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white font-semibold">How Maslow's Hierarchy Works in Cambridge Business Studies:</strong>
          <p className="mt-0.5">
            Human needs are structured like a pyramid from foundation to peak. <strong>Lower-level needs must be satisfied first</strong>. Once a level is met, it no longer motivates the worker, and they seek the next tier above. Click any tier below to explore.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Pyramid visual */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-xs space-y-2">
          <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span>Peak: Higher-order needs</span>
            <span>▲ Progression</span>
          </div>

          {tiers.map((tier) => {
            const isSelected = tier.level === selectedTier;
            return (
              <button
                key={tier.level}
                type="button"
                onClick={() => setSelectedTier(tier.level)}
                className={`group relative ${tier.widthClass} py-3 px-3 rounded-xl transition-all duration-200 cursor-pointer text-center text-white font-semibold shadow-xs flex flex-col items-center justify-center ${
                  tier.color
                } ${
                  isSelected
                    ? "ring-4 ring-offset-2 ring-blue-500 scale-[1.03] z-10 brightness-110"
                    : "opacity-85 hover:opacity-100 hover:scale-[1.01]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/25 text-[10px] flex items-center justify-center font-mono">
                    {tier.level}
                  </span>
                  <span className="text-xs sm:text-sm font-bold tracking-wide">{tier.name}</span>
                </div>
                <span className="text-[10px] text-white/80 font-normal mt-0.5 hidden sm:block">{tier.sub}</span>
              </button>
            );
          })}

          <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
            <span>Base: Fundamental survival needs</span>
            <span>Foundation ▼</span>
          </div>
        </div>

        {/* Selected Tier Detail Card */}
        <div className="lg:col-span-5 space-y-3">
          <div className={`p-5 rounded-2xl border ${active.lightColor} space-y-3 shadow-xs`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 dark:bg-black/40 border border-current">
                Level {active.level} of 5
              </span>
              <span className="text-xs font-semibold text-slate-500">Tier #{active.level}</span>
            </div>

            <h4 className={`text-xl font-bold font-academic-serif ${active.textColor}`}>
              {active.name}
            </h4>

            <p className="text-xs text-slate-700 dark:text-neutral-300 leading-relaxed">
              {active.desc}
            </p>

            <div className="pt-2 border-t border-slate-200 dark:border-neutral-700/60 space-y-1.5">
              <div className="text-[11px] font-mono font-bold uppercase text-slate-500">
                🏢 Workplace Solution:
              </div>
              <p className="text-xs font-medium text-slate-800 dark:text-neutral-100 bg-white/60 dark:bg-black/30 p-2.5 rounded-lg border border-slate-200 dark:border-neutral-800">
                {active.workplaceExample}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
              <strong className="block font-bold mb-0.5">🎓 Cambridge 0264 Exam Rule:</strong>
              {active.examTip}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 2. Herzberg's Two-Factor Theory Dual Scale */
function HerzbergDualScaleVisual() {
  const [interactiveMode, setInteractiveMode] = useState<"both" | "hygieneOnly" | "motivatorOnly">("both");

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-800/60 border border-slate-200 dark:border-neutral-700 text-xs text-slate-700 dark:text-neutral-300 leading-relaxed">
        <strong>Herzberg's Key Discovery:</strong> Satisfaction and Dissatisfaction are <strong>NOT opposites</strong>! They are controlled by two entirely different sets of factors: <strong>Hygiene factors</strong> (which only prevent dissatisfaction) and <strong>Motivators</strong> (which create genuine drive).
      </div>

      {/* Interactive Scenario Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono font-bold uppercase text-slate-500">Test Scenario:</span>
        <button
          type="button"
          onClick={() => setInteractiveMode("both")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            interactiveMode === "both"
              ? "bg-[#0F2042] text-white dark:bg-white dark:text-black shadow-xs"
              : "bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-neutral-300"
          }`}
        >
          Optimal: Good Hygiene + Strong Motivators
        </button>
        <button
          type="button"
          onClick={() => setInteractiveMode("hygieneOnly")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            interactiveMode === "hygieneOnly"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-neutral-300"
          }`}
        >
          Common Mistake: Only Paid Higher Wages
        </button>
        <button
          type="button"
          onClick={() => setInteractiveMode("motivatorOnly")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            interactiveMode === "motivatorOnly"
              ? "bg-rose-600 text-white shadow-xs"
              : "bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-neutral-300"
          }`}
        >
          Unstable: Given Responsibility but Poor Pay
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Scale 1: Hygiene Factors */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-slate-100 dark:bg-neutral-800 text-lg">🧼</span>
              <div>
                <h4 className="font-bold text-[#0F2042] dark:text-white text-base">Hygiene Factors</h4>
                <p className="text-[11px] text-slate-500 font-mono">Maintenance / Context Factors</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300">
              {interactiveMode === "motivatorOnly" ? "❌ Poor (-)" : "✅ Satisfied (0)"}
            </span>
          </div>

          <div className="space-y-1 text-xs">
            {["Salary / Hourly Pay", "Working Conditions & Safety", "Job Security", "Company Policies & Administration", "Relationship with Supervisor"].map((item) => (
              <div key={item} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-neutral-800/50 text-slate-700 dark:text-neutral-300">
                <span className={interactiveMode === "motivatorOnly" ? "text-rose-500" : "text-emerald-500"}>
                  {interactiveMode === "motivatorOnly" ? "✗" : "✓"}
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Visual Gauge */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-xs space-y-1.5">
            <div className="flex justify-between font-mono text-[10px] text-slate-500">
              <span>Severe Dissatisfaction (-5)</span>
              <span>Neutral / Zero (0)</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-neutral-700 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  interactiveMode === "motivatorOnly" ? "w-1/5 bg-rose-500" : "w-full bg-blue-500"
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-600 dark:text-neutral-400 leading-snug">
              {interactiveMode === "motivatorOnly"
                ? "⚠️ Workers are actively complaining, taking sick leave, or striking because pay or safety is inadequate."
                : "✅ Hygiene is sufficient. Workers are NOT dissatisfied, but this alone does NOT inspire peak effort!"}
            </p>
          </div>
        </div>

        {/* Scale 2: Motivator Factors */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-lg">🚀</span>
              <div>
                <h4 className="font-bold text-[#0F2042] dark:text-white text-base">Motivator Factors</h4>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-mono">Growth / Job Content</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200">
              {interactiveMode === "hygieneOnly" ? "❌ Absent (0)" : "🌟 Active (+5)"}
            </span>
          </div>

          <div className="space-y-1 text-xs">
            {["Sense of Personal Achievement", "Recognition & Meaningful Praise", "Challenging & Fulfilling Work", "Increased Responsibility", "Opportunity for Advancement / Promotion"].map((item) => (
              <div key={item} className="flex items-center gap-2 p-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 text-slate-700 dark:text-neutral-300">
                <span className={interactiveMode === "hygieneOnly" ? "text-slate-400" : "text-amber-600"}>
                  {interactiveMode === "hygieneOnly" ? "○" : "★"}
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Visual Gauge */}
          <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs space-y-1.5">
            <div className="flex justify-between font-mono text-[10px] text-amber-700 dark:text-amber-400">
              <span>Neutral / No Extra Drive (0)</span>
              <span>High Motivation & Pride (+5)</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-neutral-700 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  interactiveMode === "hygieneOnly" ? "w-0 bg-slate-400" : "w-full bg-amber-500"
                }`}
              />
            </div>
            <p className="text-[11px] text-amber-900 dark:text-amber-200 leading-snug">
              {interactiveMode === "hygieneOnly"
                ? "⚠️ Workers turn up on time for the paycheck, but will NOT offer initiative, creativity, or overtime."
                : "🌟 Workers take personal pride in quality, innovate solutions, and willingly go beyond basic duties."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 3. Interactive Organisational Hierarchy (Tall vs Flat vs Delayering) */
function OrgHierarchyTreeVisual() {
  const [orgType, setOrgType] = useState<"tall" | "flat" | "delayered">("tall");
  const [highlight, setHighlight] = useState<"none" | "chain" | "span">("none");

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase">Structure:</span>
          <button
            type="button"
            onClick={() => setOrgType("tall")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              orgType === "tall"
                ? "bg-[#0F2042] text-white dark:bg-white dark:text-black"
                : "bg-white dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700"
            }`}
          >
            🏢 Tall Structure (4 Levels)
          </button>
          <button
            type="button"
            onClick={() => setOrgType("flat")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              orgType === "flat"
                ? "bg-emerald-700 text-white"
                : "bg-white dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700"
            }`}
          >
            ↔️ Flat Structure (2 Levels)
          </button>
          <button
            type="button"
            onClick={() => setOrgType("delayered")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              orgType === "delayered"
                ? "bg-amber-600 text-white"
                : "bg-white dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700"
            }`}
          >
            ✂️ Delayering (Middle Cut)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase">Inspect:</span>
          <button
            type="button"
            onClick={() => setHighlight(highlight === "chain" ? "none" : "chain")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
              highlight === "chain" ? "bg-red-600 text-white" : "bg-white dark:bg-neutral-900 text-red-600 border border-red-300"
            }`}
          >
            ↓ Chain of Command
          </button>
          <button
            type="button"
            onClick={() => setHighlight(highlight === "span" ? "none" : "span")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
              highlight === "span" ? "bg-blue-600 text-white" : "bg-white dark:bg-neutral-900 text-blue-600 border border-blue-300"
            }`}
          >
            ↔ Span of Control
          </button>
        </div>
      </div>

      {/* Interactive Visual Canvas */}
      <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-xs flex flex-col items-center">
        {orgType === "tall" && (
          <div className="w-full max-w-xl flex flex-col items-center space-y-3 relative">
            {/* Level 1 */}
            <div className={`px-4 py-2 rounded-xl text-center font-bold text-xs shadow-xs text-white bg-[#0F2042] dark:bg-blue-900 ${
              highlight === "chain" ? "ring-4 ring-red-500" : ""
            }`}>
              Managing Director (CEO)
            </div>

            <div className={`w-0.5 h-4 ${highlight === "chain" ? "bg-red-500 w-1" : "bg-slate-300 dark:bg-neutral-700"}`} />

            {/* Level 2 */}
            <div className="w-full flex justify-around">
              <div className={`px-3 py-1.5 rounded-lg text-center font-semibold text-[11px] text-white bg-blue-800 ${
                highlight === "chain" ? "ring-4 ring-red-500" : ""
              }`}>
                Operations Director
              </div>
              <div className="px-3 py-1.5 rounded-lg text-center font-semibold text-[11px] text-white bg-blue-800">
                Marketing Director
              </div>
            </div>

            <div className={`w-0.5 h-4 ${highlight === "chain" ? "bg-red-500 w-1" : "bg-slate-300 dark:bg-neutral-700"}`} />

            {/* Level 3 */}
            <div className={`w-full flex justify-around p-2 rounded-xl ${
              highlight === "span" ? "bg-blue-50 dark:bg-blue-950/60 ring-2 ring-blue-500" : ""
            }`}>
              {["Factory Mgr A", "Factory Mgr B", "Regional Mgr A", "Regional Mgr B"].map((mgr, i) => (
                <div key={mgr} className={`px-2.5 py-1 rounded-md text-center text-[10px] font-medium bg-slate-100 dark:bg-neutral-800 text-slate-800 dark:text-neutral-200 border border-slate-300 dark:border-neutral-700 ${
                  i === 0 && highlight === "chain" ? "ring-2 ring-red-500 font-bold" : ""
                }`}>
                  {mgr}
                </div>
              ))}
            </div>

            <div className={`w-0.5 h-4 ${highlight === "chain" ? "bg-red-500 w-1" : "bg-slate-300 dark:bg-neutral-700"}`} />

            {/* Level 4 */}
            <div className="w-full grid grid-cols-8 gap-1 text-[9px] text-center">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={`py-1 rounded bg-slate-50 dark:bg-neutral-800/80 border border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-400 ${
                  i === 0 && highlight === "chain" ? "ring-2 ring-red-500 font-bold text-red-600" : ""
                }`}>
                  Worker {i + 1}
                </div>
              ))}
            </div>
          </div>
        )}

        {orgType === "flat" && (
          <div className="w-full max-w-xl flex flex-col items-center space-y-4">
            {/* CEO */}
            <div className={`px-5 py-2.5 rounded-xl text-center font-bold text-xs text-white bg-emerald-800 ${
              highlight === "chain" ? "ring-4 ring-red-500" : ""
            }`}>
              Managing Director (Wide Span of 6 Leads)
            </div>

            <div className="w-4/5 h-0.5 bg-emerald-400 dark:bg-emerald-700" />

            {/* Flat team */}
            <div className={`w-full grid grid-cols-6 gap-2 p-2 rounded-xl ${
              highlight === "span" ? "bg-blue-50 dark:bg-blue-950/60 ring-2 ring-blue-500" : ""
            }`}>
              {["Production", "Sales", "HR", "Finance", "Logistics", "Digital"].map((dept) => (
                <div key={dept} className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center">
                  <div className="font-bold text-[11px] text-emerald-900 dark:text-emerald-200">{dept}</div>
                  <div className="text-[9px] text-slate-500 mt-1">Direct to CEO</div>
                </div>
              ))}
            </div>

            <div className="text-center text-xs text-slate-500 font-mono">
              ↓ Frontline staff report directly to empowered Department Leads (Only 2 levels!)
            </div>
          </div>
        )}

        {orgType === "delayered" && (
          <div className="w-full max-w-xl flex flex-col items-center space-y-3">
            <div className="px-4 py-2 rounded-xl text-center font-bold text-xs text-white bg-[#0F2042]">
              Managing Director
            </div>

            <div className="w-0.5 h-3 bg-slate-300 dark:bg-neutral-700" />

            {/* Cut Layer */}
            <div className="w-full p-2.5 rounded-xl border-2 border-dashed border-rose-400 bg-rose-50 dark:bg-rose-950/30 flex items-center justify-between text-xs text-rose-800 dark:text-rose-300">
              <div className="flex items-center gap-2">
                <span className="text-lg">✂️</span>
                <strong>DELARED LAYER:</strong> Middle Supervisors & Deputy Managers Removed
              </div>
              <span className="font-mono text-[10px] bg-rose-200 dark:bg-rose-900 px-2 py-0.5 rounded">
                Wage Overhead Saved ($$$)
              </span>
            </div>

            <div className="w-0.5 h-3 bg-slate-300 dark:bg-neutral-700" />

            {/* Widened Span */}
            <div className="w-full p-3 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 text-center text-xs text-slate-700 dark:text-neutral-300">
              Remaining Managers now directly supervise wider frontline teams!
              <div className="font-mono text-[11px] text-blue-600 dark:text-blue-400 mt-1">
                Result: Shorter chain of command + delegation required + risk of managerial overload.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comparison metrics table */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-1">
          <strong className="text-slate-900 dark:text-white block">Vertical Chain of Command:</strong>
          <p className="text-slate-600 dark:text-neutral-400 text-[11px]">
            {orgType === "tall"
              ? "Long: 4+ levels. Messages pass slowly and can get distorted before reaching workers."
              : "Short: 2 levels. Fast direct messages between boardroom and frontline."}
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-1">
          <strong className="text-slate-900 dark:text-white block">Horizontal Span of Control:</strong>
          <p className="text-slate-600 dark:text-neutral-400 text-[11px]">
            {orgType === "tall"
              ? "Narrow (2-3 people). Tight supervision, less employee autonomy."
              : "Wide (6+ people). Manager cannot micro-manage; delegation is mandatory."}
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-1">
          <strong className="text-slate-900 dark:text-white block">Cambridge Decision Advice:</strong>
          <p className="text-slate-600 dark:text-neutral-400 text-[11px]">
            Recommend <strong>Flat</strong> for innovative firms requiring fast responses; recommend <strong>Tall</strong> where strict military/safety protocols must be monitored.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SECTION 3: MARKETING VISUALS
// ============================================================================

/** Interactive Product Life Cycle with Extension Strategy */
function ProductLifeCycleVisual() {
  const [showExtension, setShowExtension] = useState<boolean>(true);
  const [selectedStage, setSelectedStage] = useState<string>("maturity");

  const stageData: Record<string, { name: string; sales: string; profit: string; pricing: string; promo: string; tip: string }> = {
    intro: {
      name: "1. Introduction",
      sales: "Low and slow growth. Brand is unknown to market.",
      profit: "Negative / Loss. Heavy initial development and launch costs.",
      pricing: "Price Skimming (if novel/unique) OR Penetration (if entering mass market).",
      promo: "High informative advertising to educate potential buyers.",
      tip: "Cash flow is negative. The product is a drain on cash reserves (Boston 'Problem Child').",
    },
    growth: {
      name: "2. Growth",
      sales: "Rising exponentially as repeat purchases and word-of-mouth kick in.",
      profit: "Turns positive and grows rapidly as economies of scale reduce unit costs.",
      pricing: "Competitive pricing or maintaining skimming price while rivals enter.",
      promo: "Persuasive advertising to build brand loyalty over emerging rivals.",
      tip: "Rivals start copying the product. Distribution channels ('Place') must widen fast.",
    },
    maturity: {
      name: "3. Maturity & Saturation",
      sales: "Peak sales. Market is saturated; most potential buyers already own it.",
      profit: "Maximum profitability. Production is efficient and launch costs are paid off.",
      pricing: "Competitive pricing, price wars, or defensive discounts.",
      promo: "Reminder advertising, sales promotions, BOGOF, loyalty cards.",
      tip: "The product is a Boston 'Cash Cow'. Profits earned here should fund new products!",
    },
    decline: {
      name: "4. Decline",
      sales: "Falling steadily due to changing consumer tastes or obsolete technology.",
      profit: "Shrinking towards zero or loss-making.",
      pricing: "Discounting and promotional markdowns to clear surplus inventory.",
      promo: "Minimal to zero advertising spend; harvest remaining brand equity.",
      tip: "Management must decide: divest/discontinue, or deploy an Extension Strategy!",
    },
  };

  const current = stageData[selectedStage];

  return (
    <div className="space-y-4">
      {/* Visual Canvas SVG */}
      <div className="p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
            <span className="text-xs font-bold text-slate-800 dark:text-neutral-200">Sales Revenue</span>
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block ml-3" />
            <span className="text-xs font-bold text-slate-800 dark:text-neutral-200">Net Profit</span>
          </div>

          <button
            type="button"
            onClick={() => setShowExtension(!showExtension)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              showExtension
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300"
            }`}
          >
            {showExtension ? "✓ Extension Strategy Active" : "+ Show Extension Strategy"}
          </button>
        </div>

        {/* SVG Curve */}
        <div className="relative w-full aspect-[21/9] max-h-64">
          <svg viewBox="0 0 700 280" className="w-full h-full">
            {/* Grid & Axes */}
            <line x1="50" y1="230" x2="680" y2="230" stroke="#CBD5E1" strokeWidth="2" />
            <line x1="50" y1="20" x2="50" y2="230" stroke="#CBD5E1" strokeWidth="2" />
            <line x1="50" y1="180" x2="680" y2="180" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
            <text x="56" y="176" fontSize="10" className="fill-slate-400 font-mono">Break-even / Profit = $0</text>

            {/* Vertical Stage Divisors */}
            <line x1="180" y1="20" x2="180" y2="230" stroke="#F1F5F9" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="330" y1="20" x2="330" y2="230" stroke="#F1F5F9" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="490" y1="20" x2="490" y2="230" stroke="#F1F5F9" strokeWidth="2" strokeDasharray="3 3" />

            {/* Profit Curve (starts below zero) */}
            <path
              d="M 50 215 C 100 225, 140 210, 200 165 C 280 110, 360 80, 420 85 C 470 95, 520 140, 600 200"
              fill="none"
              stroke="#059669"
              strokeWidth="2.5"
            />

            {/* Main Sales Curve */}
            <path
              d="M 50 220 C 110 215, 150 180, 240 110 C 310 60, 390 45, 460 50 C 510 60, 560 110, 620 200"
              fill="none"
              stroke="#2563EB"
              strokeWidth="3.5"
            />

            {/* Extension Strategy dashed bounce */}
            {showExtension && (
              <path
                d="M 450 50 C 500 40, 560 30, 610 40 C 650 50, 675 80, 690 140"
                fill="none"
                stroke="#9333EA"
                strokeWidth="3"
                strokeDasharray="5 4"
              />
            )}

            {showExtension && (
              <g transform="translate(540, 25)">
                <rect x="0" y="0" width="130" height="22" rx="4" fill="#9333EA" />
                <text x="65" y="15" fill="#FFFFFF" fontSize="10" textAnchor="middle" fontWeight="bold">
                  Extension Strategy! 🚀
                </text>
              </g>
            )}

            {/* Clickable Stage Footers */}
            <text x="115" y="250" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-slate-600 dark:fill-neutral-300">
              1. Introduction
            </text>
            <text x="255" y="250" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-slate-600 dark:fill-neutral-300">
              2. Growth
            </text>
            <text x="410" y="250" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-slate-600 dark:fill-neutral-300">
              3. Maturity
            </text>
            <text x="560" y="250" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-slate-600 dark:fill-neutral-300">
              4. Decline
            </text>
          </svg>
        </div>

        {/* Stage Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-neutral-800">
          {[
            { id: "intro", label: "Introduction" },
            { id: "growth", label: "Growth" },
            { id: "maturity", label: "Maturity & Peak" },
            { id: "decline", label: "Decline" },
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedStage(s.id)}
              className={`p-2 rounded-lg text-xs font-semibold cursor-pointer text-center transition-all ${
                selectedStage === s.id
                  ? "bg-[#0F2042] text-white dark:bg-white dark:text-black shadow-xs"
                  : "bg-slate-50 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 hover:bg-slate-100"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Stage Marketing Mix Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-2">
          <h4 className="font-academic-serif text-base font-bold text-[#0F2042] dark:text-white">
            {current.name} Dynamics
          </h4>
          <div className="space-y-1.5">
            <div>
              <span className="font-bold text-slate-500 font-mono text-[11px] block">Sales Trend:</span>
              <span className="text-slate-800 dark:text-neutral-200">{current.sales}</span>
            </div>
            <div>
              <span className="font-bold text-slate-500 font-mono text-[11px] block">Profitability:</span>
              <span className="text-slate-800 dark:text-neutral-200">{current.profit}</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-2">
          <h4 className="font-academic-serif text-base font-bold text-[#0F2042] dark:text-white">
            Recommended 4Ps Response
          </h4>
          <div className="space-y-1.5">
            <div>
              <span className="font-bold text-slate-500 font-mono text-[11px] block">Pricing Strategy:</span>
              <span className="text-slate-800 dark:text-neutral-200">{current.pricing}</span>
            </div>
            <div>
              <span className="font-bold text-slate-500 font-mono text-[11px] block">Promotion Strategy:</span>
              <span className="text-slate-800 dark:text-neutral-200">{current.promo}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SECTION 4: OPERATIONS & BREAK-EVEN SIMULATOR
// ============================================================================

function BreakEvenSimulatorVisual() {
  const [fixedCosts, setFixedCosts] = useState<number>(20000);
  const [sellingPrice, setSellingPrice] = useState<number>(50);
  const [variableCost, setVariableCost] = useState<number>(25);
  const [currentOutput, setCurrentOutput] = useState<number>(1000);

  const contribution = Math.max(1, sellingPrice - variableCost);
  const breakEvenUnits = Math.round(fixedCosts / contribution);
  const marginOfSafety = currentOutput - breakEvenUnits;
  const totalRevenue = currentOutput * sellingPrice;
  const totalCost = fixedCosts + currentOutput * variableCost;
  const profitOrLoss = totalRevenue - totalCost;

  return (
    <div className="space-y-4">
      {/* Sliders Control Bar */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800/60 border border-slate-200 dark:border-neutral-700 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-slate-500">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-blue-600" />
            Interactive Break-Even Variables (Slide to Test)
          </span>
          <button
            type="button"
            onClick={() => {
              setFixedCosts(20000);
              setSellingPrice(50);
              setVariableCost(25);
              setCurrentOutput(1000);
            }}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span>Fixed Costs:</span>
              <span className="font-mono text-blue-600 dark:text-blue-400">${fixedCosts.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="40000"
              step="1000"
              value={fixedCosts}
              onChange={(e) => setFixedCosts(Number(e.target.value))}
              className="w-full accent-[#0F2042] dark:accent-blue-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span>Selling Price / unit:</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">${sellingPrice}</span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              step="1"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span>Variable Cost / unit:</span>
              <span className="font-mono text-amber-600 dark:text-amber-400">${variableCost}</span>
            </div>
            <input
              type="range"
              min="5"
              max={sellingPrice - 1}
              step="1"
              value={variableCost}
              onChange={(e) => setVariableCost(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Live Calculated Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-center">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Contribution / Unit</span>
          <span className="text-lg font-bold font-mono text-[#0F2042] dark:text-white">${contribution}</span>
          <span className="text-[9px] text-slate-500 block">Price − Variable</span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-center">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Break-Even Output</span>
          <span className="text-lg font-bold font-mono text-red-600 dark:text-red-400">{breakEvenUnits.toLocaleString()} units</span>
          <span className="text-[9px] text-slate-500 block">Fixed ÷ Contribution</span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-center">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Margin of Safety</span>
          <span className={`text-lg font-bold font-mono ${marginOfSafety >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {marginOfSafety > 0 ? `+${marginOfSafety.toLocaleString()}` : marginOfSafety.toLocaleString()} units
          </span>
          <span className="text-[9px] text-slate-500 block">Current − Break-Even</span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-center">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Profit / (Loss)</span>
          <span className={`text-lg font-bold font-mono ${profitOrLoss >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            ${profitOrLoss.toLocaleString()}
          </span>
          <span className="text-[9px] text-slate-500 block">Total Rev − Total Cost</span>
        </div>
      </div>

      {/* Break-Even Visual Diagram */}
      <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-xs">
        <svg viewBox="0 0 650 250" className="w-full h-auto">
          {/* Shaded Loss & Profit Areas */}
          <polygon points="50,150 280,105 50,220" fill="#FEE2E2" opacity="0.6" />
          <polygon points="280,105 600,20 600,60" fill="#DCFCE7" opacity="0.6" />

          {/* Axes */}
          <line x1="50" y1="220" x2="620" y2="220" stroke="#94A3B8" strokeWidth="2" />
          <line x1="50" y1="20" x2="50" y2="220" stroke="#94A3B8" strokeWidth="2" />

          {/* Fixed Cost Line (horizontal) */}
          <line x1="50" y1="150" x2="600" y2="150" stroke="#D97706" strokeWidth="2" strokeDasharray="5 4" />
          <text x="605" y="154" fontSize="11" fontWeight="bold" fill="#D97706">Fixed Cost</text>

          {/* Total Cost Line */}
          <line x1="50" y1="150" x2="600" y2="60" stroke="#1E3A8A" strokeWidth="2.5" />
          <text x="605" y="64" fontSize="11" fontWeight="bold" fill="#1E3A8A">Total Cost</text>

          {/* Total Revenue Line */}
          <line x1="50" y1="220" x2="600" y2="20" stroke="#059669" strokeWidth="2.5" />
          <text x="605" y="24" fontSize="11" fontWeight="bold" fill="#059669">Total Revenue</text>

          {/* Break-Even Point */}
          <circle cx="280" cy="105" r="5.5" fill="#DC2626" />
          <text x="290" y="100" fontSize="11" fontWeight="bold" fill="#DC2626">Break-Even Point</text>

          {/* Margin of Safety Bracket */}
          <line x1="280" y1="220" x2="280" y2="230" stroke="#2563EB" strokeWidth="1.5" />
          <line x1="450" y1="220" x2="450" y2="230" stroke="#2563EB" strokeWidth="1.5" />
          <line x1="280" y1="230" x2="450" y2="230" stroke="#2563EB" strokeWidth="1.5" />
          <text x="365" y="242" fontSize="10" textAnchor="middle" fontWeight="bold" fill="#2563EB">
            Margin of Safety Bracket
          </text>
        </svg>
      </div>
    </div>
  );
}

// ============================================================================
// SECTION 5: FINANCE & ACCOUNTS VISUALS
// ============================================================================

function SourcesOfFinanceMatrixVisual() {
  const [selectedTerm, setSelectedTerm] = useState<"all" | "short" | "long">("all");
  const [selectedSource, setSelectedSource] = useState<string>("overdraft");

  const sources: Record<string, { name: string; term: string; origin: string; cost: string; control: string; idealFor: string }> = {
    overdraft: {
      name: "Bank Overdraft",
      term: "Short-Term (< 1 Year)",
      origin: "External",
      cost: "High daily interest rate; repayable immediately if recalled.",
      control: "No loss of ownership or voting control.",
      idealFor: "Emergency temporary cash shortages; paying late supplier bills until customers pay.",
    },
    tradeCredit: {
      name: "Trade Credit (e.g. 30–60 Days)",
      term: "Short-Term (< 1 Year)",
      origin: "External",
      cost: "Interest-free if paid on time, but loses early-settlement discounts.",
      control: "Zero loss of control.",
      idealFor: "Purchasing raw materials or retail stock without paying immediate cash upfront.",
    },
    retainedProfit: {
      name: "Retained Profit",
      term: "Long-Term",
      origin: "Internal",
      cost: "Zero interest to pay, but opportunity cost (shareholders miss dividends).",
      control: "100% control kept by current owners; zero new debt.",
      idealFor: "Funding sustainable long-term factory expansions or R&D without gearing risk.",
    },
    shares: {
      name: "Ordinary Shares (Share Capital)",
      term: "Permanent Long-Term",
      origin: "External",
      cost: "No interest; dividends only paid if profitable, but expensive legal prospectus fees.",
      control: "Dilutes voting control; risk of hostile takeover if plc.",
      idealFor: "Massive capital expenditure (e.g. building a new international terminal or factory).",
    },
    bankLoan: {
      name: "Long-Term Bank Loan (Mortgage)",
      term: "Long-Term (5–25 Years)",
      origin: "External",
      cost: "Fixed or variable interest rate; requires fixed collateral (security).",
      control: "No ownership dilution, but bank can seize premises if loan is defaulted.",
      idealFor: "Purchasing freehold land and buildings with fixed monthly repayments.",
    },
    leasing: {
      name: "Leasing / Hire Purchase",
      term: "Medium-Term (2–5 Years)",
      origin: "External",
      cost: "Monthly rental fees; more expensive overall than buying outright.",
      control: "Zero loss of ownership control.",
      idealFor: "Delivery vans, photocopiers, and high-tech machines that become obsolete quickly.",
    },
  };

  const current = sources[selectedSource] ?? sources.overdraft;

  return (
    <div className="space-y-4">
      {/* 2x2 Concept Matrix Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
          <strong className="text-blue-900 dark:text-blue-200 font-bold block mb-1">
            ⏱️ Short-Term Finance Needs:
          </strong>
          <p className="text-slate-600 dark:text-neutral-300 text-[11px] leading-relaxed">
            Revenue expenditure: Day-to-day bills, inventory stock, staff wages, temporary cash-flow dips. Sources: Overdraft, Trade Credit, Debt Factoring.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
          <strong className="text-emerald-900 dark:text-emerald-200 font-bold block mb-1">
            🏗️ Long-Term Finance Needs:
          </strong>
          <p className="text-slate-600 dark:text-neutral-300 text-[11px] leading-relaxed">
            Capital expenditure: Buying fixed non-current assets (factories, machines, acquisitions). Sources: Retained Profit, Share Capital, Long-Term Loans.
          </p>
        </div>
      </div>

      {/* Source Selector Pills */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(sources).map(([key, s]) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelectedSource(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              selectedSource === key
                ? "bg-[#0F2042] text-white dark:bg-white dark:text-black shadow-xs"
                : "bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-neutral-300"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Selected Source Deep Dive */}
      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-neutral-800 pb-2">
          <h4 className="font-academic-serif text-lg font-bold text-[#0F2042] dark:text-white">
            {current.name}
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
              {current.term}
            </span>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
              {current.origin}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-800">
            <span className="font-bold text-slate-500 font-mono text-[10px] uppercase block">Cost & Gearing Risk:</span>
            <span className="text-slate-800 dark:text-neutral-200 mt-1 block">{current.cost}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-800">
            <span className="font-bold text-slate-500 font-mono text-[10px] uppercase block">Impact on Ownership & Control:</span>
            <span className="text-slate-800 dark:text-neutral-200 mt-1 block">{current.control}</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
            <span className="font-bold text-amber-800 dark:text-amber-300 font-mono text-[10px] uppercase block">When to Recommend:</span>
            <span className="text-amber-900 dark:text-amber-200 mt-1 block">{current.idealFor}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SECTION 6: EXTERNAL INFLUENCES & EXCHANGE RATE VISUALS
// ============================================================================

function BusinessCycleAndExchangeVisual() {
  const [exchangeState, setExchangeState] = useState<"spiced" | "wpidec">("spiced");

  return (
    <div className="space-y-5">
      {/* 1. Business Cycle 4-Phase Wave */}
      <div className="p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-xs space-y-3">
        <h4 className="font-academic-serif text-base font-bold text-[#0F2042] dark:text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-600" />
          The Business Cycle Wave & Business Reactions
        </h4>

        <div className="relative w-full aspect-[21/7] max-h-48">
          <svg viewBox="0 0 650 180" className="w-full h-full">
            <line x1="30" y1="150" x2="620" y2="150" stroke="#CBD5E1" strokeWidth="2" />
            <line x1="30" y1="20" x2="30" y2="150" stroke="#CBD5E1" strokeWidth="2" />
            <line x1="30" y1="95" x2="620" y2="95" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
            <text x="35" y="90" fontSize="9" fill="#94A3B8" className="font-mono">Long-term Trend Growth</text>

            {/* Economic Cycle Wave */}
            <path
              d="M 40 120 C 100 135, 140 70, 200 40 C 260 20, 310 90, 370 130 C 430 160, 480 130, 540 80 C 580 40, 610 30, 620 25"
              fill="none"
              stroke="#0F2042"
              strokeWidth="3.5"
            />

            {/* Stage Markers */}
            <circle cx="200" cy="40" r="5" fill="#059669" />
            <text x="200" y="25" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#059669">1. Boom 🌟</text>

            <circle cx="310" cy="90" r="5" fill="#D97706" />
            <text x="310" y="80" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#D97706">2. Recession 📉</text>

            <circle cx="430" cy="155" r="5" fill="#DC2626" />
            <text x="430" y="172" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#DC2626">3. Slump ⚠️</text>

            <circle cx="540" cy="80" r="5" fill="#2563EB" />
            <text x="540" y="70" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2563EB">4. Recovery 🚀</text>
          </svg>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200">
            <strong className="text-emerald-900 dark:text-emerald-200 block font-bold">1. Boom</strong>
            High GDP, low unemployment, high wages, risk of inflation. Firms expand.
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200">
            <strong className="text-amber-900 dark:text-amber-200 block font-bold">2. Recession</strong>
            GDP falls for 2 consecutive quarters. Spending drops, firms cut investment.
          </div>
          <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200">
            <strong className="text-rose-900 dark:text-rose-200 block font-bold">3. Slump</strong>
            Peak unemployment, low consumer confidence. Survival objective for weak firms.
          </div>
          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200">
            <strong className="text-blue-900 dark:text-blue-200 block font-bold">4. Recovery</strong>
            GDP starts climbing again, business confidence revives, hiring resumes.
          </div>
        </div>
      </div>

      {/* 2. SPICED vs WPIDEC Exchange Rate Simulator */}
      <div className="p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-academic-serif text-base font-bold text-[#0F2042] dark:text-white">
            💱 Exchange Rate Movement Simulator (SPICED vs WPIDEC)
          </h4>
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-neutral-800 text-xs">
            <button
              type="button"
              onClick={() => setExchangeState("spiced")}
              className={`px-3 py-1 rounded-md font-bold cursor-pointer transition-all ${
                exchangeState === "spiced" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 dark:text-neutral-400"
              }`}
            >
              SPICED (Currency Appreciates)
            </button>
            <button
              type="button"
              onClick={() => setExchangeState("wpidec")}
              className={`px-3 py-1 rounded-md font-bold cursor-pointer transition-all ${
                exchangeState === "wpidec" ? "bg-amber-600 text-white shadow-xs" : "text-slate-600 dark:text-neutral-400"
              }`}
            >
              WPIDEC (Currency Depreciates)
            </button>
          </div>
        </div>

        {exchangeState === "spiced" ? (
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-2">
            <div className="text-sm font-bold text-blue-900 dark:text-blue-200 font-mono">
              🔤 SPICED: Stronger Pound → Imports Cheaper, Exports Dearer
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-blue-200 dark:border-blue-800">
                <span className="font-bold text-emerald-600 block mb-1">🎉 Winners: Importing Businesses</span>
                <p className="text-slate-700 dark:text-neutral-300 text-[11px]">
                  Firms buying raw materials or components from abroad pay less in local currency. Costs fall!
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-blue-200 dark:border-blue-800">
                <span className="font-bold text-rose-600 block mb-1">⚠️ Losers: Exporting Businesses</span>
                <p className="text-slate-700 dark:text-neutral-300 text-[11px]">
                  Goods become more expensive for overseas buyers. Sales volumes drop unless prices are slashed.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 space-y-2">
            <div className="text-sm font-bold text-amber-900 dark:text-amber-200 font-mono">
              🔤 WPIDEC: Weaker Pound → Imports Dearer, Exports Cheaper
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-amber-200 dark:border-amber-800">
                <span className="font-bold text-emerald-600 block mb-1">🎉 Winners: Exporting Businesses</span>
                <p className="text-slate-700 dark:text-neutral-300 text-[11px]">
                  Products become cheaper abroad. Competitive edge boosts international sales and foreign revenue!
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-amber-200 dark:border-amber-800">
                <span className="font-bold text-rose-600 block mb-1">⚠️ Losers: Importing Businesses</span>
                <p className="text-slate-700 dark:text-neutral-300 text-[11px]">
                  Imported supplies, oil, and parts cost far more. Cost-push inflation squeezes profit margins.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN SECTION CONCEPT DIAGRAM MODAL
// ============================================================================

interface SectionConceptDiagramProps {
  sectionCode: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function SectionConceptDiagram({
  sectionCode,
  isOpen,
  onClose,
}: SectionConceptDiagramProps) {
  // Navigation tabs for each section
  const sectionMeta: Record<
    string,
    { title: string; subtitle: string; icon: string; tabs: { id: string; label: string }[] }
  > = {
    "2": {
      title: "Section 2: People in Business Visuals",
      subtitle: "Maslow's Pyramid, Herzberg's Dual Scale, Tall vs Flat Hierarchy & Delayering",
      icon: "👥",
      tabs: [
        { id: "maslow", label: "🔺 Maslow Pyramid" },
        { id: "herzberg", label: "⚖️ Herzberg Two-Factor" },
        { id: "org", label: "🏢 Org Hierarchy & Delayering" },
      ],
    },
    "3": {
      title: "Section 3: Marketing & Strategy Visuals",
      subtitle: "Product Life Cycle, Extension Strategies, 4Ps Alignment & Boston Matrix",
      icon: "📣",
      tabs: [
        { id: "plc", label: "📈 Product Life Cycle & Extension" },
      ],
    },
    "4": {
      title: "Section 4: Operations Management Visuals",
      subtitle: "Interactive Break-Even Simulator, Margin of Safety & Production Methods",
      icon: "🏭",
      tabs: [
        { id: "breakeven", label: "🧮 Break-Even Simulator" },
      ],
    },
    "5": {
      title: "Section 5: Finance & Accounts Visuals",
      subtitle: "Short vs Long-Term Sources of Finance, Gearing & Working Capital",
      icon: "💹",
      tabs: [
        { id: "sources", label: "💰 Sources of Finance Matrix" },
      ],
    },
    "6": {
      title: "Section 6: External Influences Visuals",
      subtitle: "Business Cycle Wave, SPICED vs WPIDEC Exchange Rates & Economic Policies",
      icon: "🌍",
      tabs: [
        { id: "cycle", label: "〰️ Business Cycle & SPICED" },
      ],
    },
  };

  const meta = sectionMeta[sectionCode] ?? sectionMeta["2"];
  const [activeTab, setActiveTab] = useState<string>(meta.tabs[0].id);

  if (isOpen !== undefined && !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#FAF9F6] dark:bg-black border border-slate-200 dark:border-neutral-800 shadow-2xl my-auto">
        {/* Modal Top Header */}
        <div className="sticky top-0 z-20 bg-[#0F2042] dark:bg-neutral-950 text-white px-5 sm:px-6 py-4 border-b border-blue-900/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-white/10 text-2xl border border-white/15">
              {meta.icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-[#0F172A]">
                  Cambridge 0264 Visual Studio
                </span>
                <span className="text-xs text-blue-200 hidden sm:inline">Section {sectionCode}</span>
              </div>
              <h2 className="font-academic-serif text-lg sm:text-xl font-bold text-white mt-0.5">
                {meta.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Sub-tabs selector */}
        {meta.tabs.length > 1 && (
          <div className="px-5 sm:px-6 pt-4 pb-2 flex flex-wrap gap-2 border-b border-slate-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
            {meta.tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  activeTab === tab.id
                    ? "bg-[#0F2042] text-white dark:bg-white dark:text-black shadow-xs"
                    : "bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-neutral-300 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-5 sm:p-7 space-y-6">
          {sectionCode === "2" && (
            <>
              {activeTab === "maslow" && <MaslowPyramidVisual />}
              {activeTab === "herzberg" && <HerzbergDualScaleVisual />}
              {activeTab === "org" && <OrgHierarchyTreeVisual />}
            </>
          )}

          {sectionCode === "3" && <ProductLifeCycleVisual />}

          {sectionCode === "4" && <BreakEvenSimulatorVisual />}

          {sectionCode === "5" && <SourcesOfFinanceMatrixVisual />}

          {sectionCode === "6" && <BusinessCycleAndExchangeVisual />}
        </div>
      </div>
    </div>
  );
}

export const SECTION_VISUAL_LABELS: Record<string, string> = {
  "2": "People & Organisation Visuals",
  "3": "Marketing & Strategy Visuals",
  "4": "Operations & Break-Even Visuals",
  "5": "Finance & Accounts Visuals",
  "6": "Economy & Global Trade Visuals",
};

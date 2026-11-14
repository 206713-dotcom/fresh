"use client";

import React, { useState } from "react";

interface FactorsOfProductionDiagramProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
  isModal?: boolean;
}

export function FactorsOfProductionDiagram({
  isOpen,
  onClose,
  className = "",
  isModal = false,
}: FactorsOfProductionDiagramProps) {
  if (isOpen !== undefined && !isOpen) return null;
  const isModalMode = isModal || isOpen !== undefined;

  const [selectedFactor, setSelectedFactor] = useState<"land" | "labour" | "capital" | "enterprise">("land");
  const [activeTab, setActiveTab] = useState<"factors" | "circular">("factors");

  const factorsData = {
    land: {
      title: "Land",
      reward: "Rent",
      icon: "🏞️",
      tagline: "Natural Resources provided by Earth",
      color: "emerald",
      badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500",
      definition:
        "All natural resources and gifts of nature available for production without human intervention.",
      examples: [
        "Agricultural land and forests",
        "Mineral deposits (iron ore, bauxite, lithium, crude oil)",
        "Water bodies (rivers, oceans for fishing and shipping)",
        "Climate and solar/wind energy sites",
      ],
      rewardExplanation:
        "Rent is the financial payment made to landowners or resource proprietors for the productive use of natural resources and commercial land plots.",
      examTip:
        "CIE Warning: In Business Studies, 'Land' is NOT just soil. It includes underground minerals, oceans, and natural atmospheric resources. Capital goods (like tractors or irrigation pipes) are NOT land—they are capital!",
    },
    labour: {
      title: "Labour",
      reward: "Wages & Salaries",
      icon: "👷",
      tagline: "Human Physical and Mental Productive Effort",
      color: "blue",
      badgeClass: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500",
      definition:
        "The human intellectual, physical, and technical effort exerted in the manufacturing of goods and delivery of services.",
      examples: [
        "Skilled professionals (surgeons, civil engineers, corporate accountants)",
        "Manual and assembly workers (factory machinists, carpenters, bricklayers)",
        "Service personnel (teachers, pilots, delivery drivers, nurses)",
        "Software engineers and creative designers",
      ],
      rewardExplanation:
        "Wages (time-rate, piece-rate, or hourly pay) and salaries (fixed monthly compensation) represent the return earned by workers for their productive labor time and human capital.",
      examTip:
        "Labour is human effort used in production. In a definition, say what the worker does, and name wages as the reward. Do not treat money itself as labour.",
    },
    capital: {
      title: "Capital",
      reward: "Interest",
      icon: "🏭",
      tagline: "Man-Made Goods Used to Produce Other Goods",
      color: "amber",
      badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500",
      definition:
        "Man-made physical aids to production used to manufacture finished goods or provide commercial services.",
      examples: [
        "Heavy machinery and automated assembly robots",
        "Commercial delivery fleets (vans, cargo ships, aeroplanes)",
        "Factories, warehouses, and office buildings",
        "Computing servers, telecommunications hardware, and tools",
      ],
      rewardExplanation:
        "Interest is the financial reward paid to investors or financial institutions for loaning funds used to purchase capital equipment, or the return earned on capital investment capital.",
      examTip:
        "CIE Warning: MONEY IS NOT A FACTOR OF PRODUCTION. Money facilitates transactions, but money itself cannot produce anything. Capital refers strictly to real physical capital goods (machines, factories, tools).",
    },
    enterprise: {
      title: "Enterprise",
      reward: "Profit",
      icon: "🚀",
      tagline: "The Catalyst: Risk-Taking, Innovation & Coordination",
      color: "purple",
      badgeClass: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500",
      definition:
        "The special human ability to organize and combine the other three factors of production (Land, Labour, Capital) while bearing the financial risk of business failure.",
      examples: [
        "Entrepreneurs who launch startups and identify market gaps",
        "Corporate innovators introducing new patents and business models",
        "Small business owners who invest personal capital into partnerships or sole proprietorships",
        "Franchisors expanding branded concepts nationwide",
      ],
      rewardExplanation:
        "Profit is the residual return earned by the entrepreneur after all other costs (Rent for land, Wages for labour, Interest for capital) have been fully paid. It is the reward for successful risk-taking.",
      examTip:
        "CIE Exam Tip: In Paper 1 (2-mark definitions), always mention both key elements: (1) combining the other 3 factors of production, and (2) taking the financial risk of business failure.",
    },
  };

  const current = factorsData[selectedFactor];

  const mainContent = (
    <div className={`bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden transition-all ${className}`}>
      {/* Top Header Banner */}
      <div className="bg-[#0F2042] dark:bg-black text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-900/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-2xl">
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500 text-[#0F172A] text-[10px] font-mono font-bold uppercase tracking-wider">
                Cambridge Syllabus Core 1.1 / Unit 1
              </span>
              <span className="text-xs text-blue-200 font-mono hidden sm:inline">
                Syllabus 0264 · 0450
              </span>
            </div>
            <h2 className="font-academic-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
              The 4 Factors of Production & Factor Rewards
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Subtabs */}
          <div className="flex items-center p-1 rounded-lg bg-white/10 text-xs font-medium">
            <button
              onClick={() => setActiveTab("factors")}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === "factors"
                  ? "bg-white text-[#0F2042] font-bold shadow-xs"
                  : "text-blue-100 hover:text-white"
              }`}
            >
              Factors & Rewards
            </button>
            <button
              onClick={() => setActiveTab("circular")}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === "circular"
                  ? "bg-white text-[#0F2042] font-bold shadow-xs"
                  : "text-blue-100 hover:text-white"
              }`}
            >
              Flow Diagram
            </button>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-sm"
              title="Close Diagram"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
        {activeTab === "factors" && (
          <div>
            {/* 4 Factor Selector Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              {(["land", "labour", "capital", "enterprise"] as const).map((key) => {
                const item = factorsData[key];
                const isSelected = selectedFactor === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedFactor(key)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? "border-[#0F2042] dark:border-[#38BDF8] bg-slate-50 dark:bg-neutral-800 shadow-md ring-2 ring-[#0F2042]/20 dark:ring-[#38BDF8]/40"
                        : "border-slate-200 dark:border-neutral-800 bg-[#FAF9F6] dark:bg-black hover:border-slate-400 dark:hover:border-neutral-600"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 text-[#0F2042] dark:text-[#38BDF8]">
                        Reward: {item.reward.split(" ")[0]}
                      </span>
                    </div>

                    <h3 className="font-academic-serif font-bold text-base sm:text-lg text-[#0F2042] dark:text-white">
                      {item.title}
                    </h3>

                    <div className="mt-2 pt-2 border-t border-slate-200/80 dark:border-neutral-800 flex items-center justify-between text-xs">
                      <span className="text-[#78716C] dark:text-neutral-400 font-mono text-[11px]">
                        Factor Reward:
                      </span>
                      <span className="font-bold text-[#0F2042] dark:text-[#38BDF8]">
                        {item.reward}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="absolute top-0 right-0 w-2 h-2 bg-[#0F2042] dark:bg-[#38BDF8] rounded-bl-sm" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Detailed Selected Factor Display */}
            <div className="bg-[#FAF9F6] dark:bg-black border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-xs">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                {/* Left Detail */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
                      {current.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
                          Cambridge Factor of Production
                        </span>
                      </div>
                      <h3 className="font-academic-serif text-2xl font-bold text-[#0F2042] dark:text-white">
                        {current.title} · <span className="text-blue-600 dark:text-blue-400">Reward: {current.reward}</span>
                      </h3>
                      <p className="text-xs text-[#78716C] dark:text-neutral-400 mt-0.5">
                        {current.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 block mb-1">
                      Cambridge Textbook Definition:
                    </span>
                    <p className="font-academic-serif text-sm text-[#1C1917] dark:text-neutral-100 leading-relaxed">
                      "{current.definition}"
                    </p>
                  </div>

                  {/* Factor Reward Mechanism */}
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                    <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                      <span>💰 Why is the Factor Reward called "{current.reward}"?</span>
                    </div>
                    <p className="text-emerald-800/90 dark:text-emerald-300 leading-relaxed">
                      {current.rewardExplanation}
                    </p>
                  </div>

                  {/* Examples */}
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F2042] dark:text-neutral-300 block mb-2">
                      Real-World Cambridge Case Examples:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {current.examples.map((ex, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 p-2.5 rounded-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-[#44403C] dark:text-neutral-300"
                        >
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>{ex}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Visual Infographic & Exam Traps */}
                <div className="w-full lg:w-80 space-y-4 shrink-0">
                  {/* Visual SVG Graphic Card */}
                  <div className="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-slate-200 dark:border-neutral-800 shadow-xs flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center text-4xl mb-3 shadow-inner">
                      {current.icon}
                    </div>

                    <span className="font-academic-serif text-lg font-bold text-[#0F2042] dark:text-white">
                      {current.title}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-neutral-400 font-mono mt-0.5">
                      Yields Factor Payment
                    </span>

                    <div className="w-full my-3 border-t border-dashed border-slate-200 dark:border-neutral-800" />

                    <div className="w-full p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-center">
                      <span className="text-[10px] font-mono uppercase text-blue-700 dark:text-blue-300 block font-bold">
                        Income Reward to Household
                      </span>
                      <span className="font-mono text-xl font-bold text-blue-900 dark:text-blue-100">
                        {current.reward}
                      </span>
                    </div>
                  </div>

                  {/* Exam Tip & Trap Warning */}
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200 mb-1">
                      <span>⚠️ Senior Examiner Advice</span>
                    </div>
                    <p className="text-amber-900/80 dark:text-amber-300 leading-relaxed text-[11px]">
                      {current.examTip}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Circular Flow of Factor Markets Diagram */}
        {activeTab === "circular" && (
          <div className="bg-[#FAF9F6] dark:bg-black border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
                Syllabus 1.1 · Factors and their rewards
              </span>
              <h3 className="font-academic-serif text-2xl font-bold text-[#0F2042] dark:text-white">
                Who supplies each factor, and what they are paid
              </h3>
              <p className="text-xs text-[#57534E] dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
                Households supply land, labour, capital and enterprise. Firms use them to produce goods and services, and pay rent, wages, interest and profit.
              </p>
            </div>

            {/* Circular Flow SVG Diagram */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-slate-200 dark:border-neutral-800 flex flex-col items-center justify-center">
              <svg viewBox="0 0 700 360" className="w-full max-w-2xl h-auto select-none">
                {/* Households Box */}
                <rect x="40" y="110" width="160" height="140" rx="16" className="fill-[#0F2042] dark:fill-blue-950 stroke-blue-700" strokeWidth="2" />
                <text x="120" y="155" textAnchor="middle" className="fill-white font-bold text-[16px] font-sans">🏠 HOUSEHOLDS</text>
                <text x="120" y="180" textAnchor="middle" className="fill-blue-200 text-[11px] font-mono">Owners of Factors</text>
                <text x="120" y="205" textAnchor="middle" className="fill-blue-300 text-[10px]">Supply Land, Labour,</text>
                <text x="120" y="222" textAnchor="middle" className="fill-blue-300 text-[10px]">Capital & Enterprise</text>

                {/* Firms Box */}
                <rect x="500" y="110" width="160" height="140" rx="16" className="fill-emerald-800 dark:fill-emerald-950 stroke-emerald-600" strokeWidth="2" />
                <text x="580" y="155" textAnchor="middle" className="fill-white font-bold text-[16px] font-sans">🏭 FIRMS</text>
                <text x="580" y="180" textAnchor="middle" className="fill-emerald-200 text-[11px] font-mono">Producers of Goods</text>
                <text x="580" y="205" textAnchor="middle" className="fill-emerald-300 text-[10px]">Combine Factors to</text>
                <text x="580" y="222" textAnchor="middle" className="fill-emerald-300 text-[10px]">Produce Output</text>

                {/* Top Arrow: Factors of Production flow (Households -> Firms) */}
                <path d="M 170 100 Q 350 20 530 100" fill="none" stroke="#2563EB" strokeWidth="3" markerEnd="url(#arrow-blue)" />
                <rect x="250" y="32" width="200" height="36" rx="8" className="fill-blue-50 dark:fill-blue-950 stroke-blue-400" strokeWidth="1" />
                <text x="350" y="54" textAnchor="middle" className="fill-blue-900 dark:fill-blue-200 font-bold text-[11px] font-mono">
                  → FACTORS OF PRODUCTION →
                </text>

                {/* Bottom Arrow: Factor Rewards flow (Firms -> Households) */}
                <path d="M 530 260 Q 350 340 170 260" fill="none" stroke="#059669" strokeWidth="3" markerEnd="url(#arrow-green)" />
                <rect x="235" y="292" width="230" height="36" rx="8" className="fill-emerald-50 dark:fill-emerald-950 stroke-emerald-400" strokeWidth="1" />
                <text x="350" y="314" textAnchor="middle" className="fill-emerald-900 dark:fill-emerald-200 font-bold text-[11px] font-mono">
                  ← FACTOR REWARDS (INCOME) ←
                </text>

                {/* Center Rewards Pill Stack */}
                <g transform="translate(240, 105)">
                  <rect width="220" height="150" rx="12" className="fill-slate-50 dark:fill-neutral-800 stroke-slate-300 dark:stroke-neutral-700" strokeWidth="1" />
                  <text x="110" y="24" textAnchor="middle" className="fill-[#0F2042] dark:fill-white font-mono font-bold text-[11px] uppercase">
                    4 Factor Rewards
                  </text>
                  <text x="110" y="52" textAnchor="middle" className="fill-emerald-600 dark:text-emerald-400 font-mono text-[12px] font-bold">
                    🏞️ Land → RENT
                  </text>
                  <text x="110" y="78" textAnchor="middle" className="fill-blue-600 dark:text-blue-400 font-mono text-[12px] font-bold">
                    👷 Labour → WAGES
                  </text>
                  <text x="110" y="104" textAnchor="middle" className="fill-amber-600 dark:text-amber-400 font-mono text-[12px] font-bold">
                    🏭 Capital → INTEREST
                  </text>
                  <text x="110" y="130" textAnchor="middle" className="fill-purple-600 dark:text-purple-400 font-mono text-[12px] font-bold">
                    🚀 Enterprise → PROFIT
                  </text>
                </g>

                {/* Defs for arrow markers */}
                <defs>
                  <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#2563EB" />
                  </marker>
                  <marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#059669" />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isModalMode) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
        <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl my-auto">
          {mainContent}
        </div>
      </div>
    );
  }

  return mainContent;
}

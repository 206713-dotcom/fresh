"use client";

import React from "react";

export function EconomicsCoOp() {
  const econsUnits = [
    {
      unit: "Unit 1: The basic economic problem",
      topics: "Scarcity, choice, opportunity cost, PPC (Production Possibility Curve) diagrams, factors of production.",
      questionType: "2-mark definitions & 4-mark PPC shift analysis",
    },
    {
      unit: "Unit 2: The allocation of resources",
      topics: "Microeconomics, demand & supply curves, equilibrium price, price elasticity of demand (PED) & supply (PES), market failure.",
      questionType: "6-mark elasticity calculations & diagram explanations",
    },
    {
      unit: "Unit 3: Microeconomic decision makers",
      topics: "Banks, households, workers, trade unions, business firms, market structures, competitive vs monopoly markets.",
      questionType: "8-mark discussion on wage determination & union impact",
    },
    {
      unit: "Unit 4: Government and the macroeconomy",
      topics: "Macroeconomic objectives (GDP growth, low unemployment, stable inflation, balance of payments), fiscal and monetary policies.",
      questionType: "8-mark & 12-mark macro policy evaluation essays",
    },
    {
      unit: "Unit 5: Economic development",
      topics: "Living standards, Human Development Index (HDI), poverty, population demographics, developing vs developed economies.",
      questionType: "6-mark comparative analyses & living standard metrics",
    },
    {
      unit: "Unit 6: International trade and globalisation",
      topics: "Specialisation, free trade vs protectionism (tariffs, quotas), foreign exchange rates, current account balance of payments.",
      questionType: "8-mark trade policy and exchange rate impact essays",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="max-w-3xl mb-10">
        <div className="flex items-center gap-2 mb-2 text-xs font-mono text-[#78716C]">
          <span className="font-semibold text-[#8B1E1E]">BRANCH: econs</span>
          <span aria-hidden="true">·</span>
          <span>Target: main</span>
          <span aria-hidden="true">·</span>
          <span>Syllabus 0455 & 2281</span>
        </div>
        <h1 className="font-academic-serif text-3xl font-bold text-[#0F2042] mb-3">
          Economics Feature Branch (Co-Developer Hub)
        </h1>
        <p className="text-sm text-[#57534E] leading-relaxed">
          Welcome to the collaborative feature branch for Economics question templates. As agreed in the team repository branching model, Business Studies (branch: <code className="bg-[#FAF9F6] px-1.5 py-0.5 rounded border border-[#E7E5E4] font-mono text-xs text-[#0F2042]">business</code>) and Economics (branch: <code className="bg-[#FAF9F6] px-1.5 py-0.5 rounded border border-[#E7E5E4] font-mono text-xs text-[#0F2042]">econs</code>) merge into <code className="bg-[#FAF9F6] px-1.5 py-0.5 rounded border border-[#E7E5E4] font-mono text-xs text-[#0F2042]">main</code> via GitHub Pull Requests with automated Vercel deployments.
        </p>
      </div>

      {/* GitHub & Vercel Collaboration Status Box */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-6 shadow-sm mb-10">
        <h2 className="font-academic-serif text-lg font-bold text-[#0F2042] mb-3">
          Team Pipeline & Repository Status
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-[#FAF9F6] rounded-lg border border-[#E7E5E4]">
            <span className="text-[#78716C] block mb-1">GitHub Repositories</span>
            <span className="font-mono font-bold text-[#0F2042] block">
              205737-cmyk/EcBiz & ecbiz1
            </span>
            <span className="text-[11px] text-[#57534E] mt-1 block">
              Shared deployment keys & webhooks
            </span>
          </div>

          <div className="p-3.5 bg-[#FAF9F6] rounded-lg border border-[#E7E5E4]">
            <span className="text-[#78716C] block mb-1">Business Branch</span>
            <span className="font-mono font-bold text-emerald-700 block">
              branch/business · Complete
            </span>
            <span className="text-[11px] text-[#57534E] mt-1 block">
              0264 Glossary, Two-Pass Engine, 189 Papers
            </span>
          </div>

          <div className="p-3.5 bg-[#FAF9F6] rounded-lg border border-[#E7E5E4]">
            <span className="text-[#78716C] block mb-1">Economics Branch</span>
            <span className="font-mono font-bold text-[#2563EB] block">
              branch/econs · Active Co-Op
            </span>
            <span className="text-[11px] text-[#57534E] mt-1 block">
              0455 question templates & blueprints
            </span>
          </div>
        </div>
      </div>

      {/* Blueprint Architecture for Economics */}
      <h2 className="font-academic-serif text-2xl font-bold text-[#0F2042] mb-6">
        Planned Cambridge 0455 Blueprint Architecture
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {econsUnits.map((u, i) => (
          <div
            key={i}
            className="bg-white border border-[#E7E5E4] rounded-xl p-6 shadow-sm flex flex-col justify-between"
          >
            <div>
              <span className="text-[11px] font-mono text-[#8B1E1E] uppercase font-semibold">
                CIE Syllabus 0455 / 2281
              </span>
              <h3 className="font-academic-serif text-lg font-bold text-[#0F2042] mt-1 mb-2">
                {u.unit}
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed mb-4">
                {u.topics}
              </p>
            </div>

            <div className="pt-3 border-t border-[#E7E5E4] text-[11px] flex items-center justify-between">
              <span className="text-[#78716C]">Blueprint Format:</span>
              <span className="font-mono font-medium text-[#0F2042]">{u.questionType}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

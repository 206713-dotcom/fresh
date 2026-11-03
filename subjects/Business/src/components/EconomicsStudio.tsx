"use client";

import React, { useState } from "react";
import { ECONS_BLUEPRINTS, ECONS_GLOSSARY, EconsBlueprint } from "../lib/data/econs-data";

export function EconomicsStudio() {
  const [activeSubTab, setActiveSubTab] = useState<"practice" | "diagrams" | "glossary">("practice");
  const [selectedBlueprint, setSelectedBlueprint] = useState<EconsBlueprint>(ECONS_BLUEPRINTS[0]);
  const [studentAnswer, setStudentAnswer] = useState<string>("");
  const [evaluatedScore, setEvaluatedScore] = useState<number | null>(null);
  const [evaluationFeedback, setEvaluationFeedback] = useState<string>("");

  // Interactive Supply & Demand Simulation State
  const [demandShift, setDemandShift] = useState<number>(0); // -5 to +5
  const [supplyShift, setSupplyShift] = useState<number>(0); // -5 to +5

  // Calculations for equilibrium
  const basePrice = 20;
  const baseQuantity = 100;
  // Shift effects: Higher demand increases P & Q; Higher supply reduces P & increases Q
  const currentPrice = Math.max(5, basePrice + demandShift * 2 - supplyShift * 1.5);
  const currentQuantity = Math.max(10, baseQuantity + demandShift * 5 + supplyShift * 6);

  // Simple marking for economics answers
  const handleEvaluateEcons = () => {
    const text = studentAnswer.trim().toLowerCase();
    const wordCount = text ? text.split(/\s+/).length : 0;
    if (wordCount < 10) {
      setEvaluatedScore(1);
      setEvaluationFeedback("Response is very brief. Develop your economic chain of reasoning.");
      return;
    }

    const keyTerms = ["demand", "supply", "price", "revenue", "cost", "elastic", "inelastic", "fiscal", "tax", "inflation", "unemployment", "opportunity cost", "equilibrium"];
    let matches = 0;
    keyTerms.forEach((k) => {
      if (text.includes(k)) matches++;
    });

    const max = selectedBlueprint.marks;
    let score = Math.min(max, Math.max(1, Math.round((matches / 4) * max)));
    if (wordCount > 60 && score < max) score = Math.min(max, score + 1);

    setEvaluatedScore(score);
    setEvaluationFeedback(
      score >= max * 0.75
        ? "Excellent application of economic theory and causal mechanisms."
        : "Good starting points; ensure you explain the transmission mechanism to final macroeconomic or firm outcomes."
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 transition-colors">
      {/* Editorial Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#8B1E1E] dark:text-[#F87171]">
              CIE Cambridge 0455 & 2281
            </span>
            <span className="text-xs text-[#78716C] dark:text-[#94A3B8]">·</span>
            <span className="text-xs text-[#57534E] dark:text-[#94A3B8]">Economics Module</span>
          </div>
          <h1 className="font-academic-serif text-3xl font-bold text-[#0F2042] dark:text-[#F1F5F9]">
            Economics Examination Hub
          </h1>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-1 bg-[#F5F5F4] dark:bg-[#1E293B] p-1.5 rounded-lg border border-[#E7E5E4] dark:border-[#334155] text-xs">
          <button
            onClick={() => setActiveSubTab("practice")}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              activeSubTab === "practice"
                ? "bg-white dark:bg-[#0F172A] text-[#0F2042] dark:text-[#38BDF8] shadow-sm font-semibold"
                : "text-[#57534E] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-white"
            }`}
          >
            Question Blueprints
          </button>
          <button
            onClick={() => setActiveSubTab("diagrams")}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              activeSubTab === "diagrams"
                ? "bg-white dark:bg-[#0F172A] text-[#0F2042] dark:text-[#38BDF8] shadow-sm font-semibold"
                : "text-[#57534E] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-white"
            }`}
          >
            Interactive Diagrams
          </button>
          <button
            onClick={() => setActiveSubTab("glossary")}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              activeSubTab === "glossary"
                ? "bg-white dark:bg-[#0F172A] text-[#0F2042] dark:text-[#38BDF8] shadow-sm font-semibold"
                : "text-[#57534E] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-white"
            }`}
          >
            0455 Glossary
          </button>
        </div>
      </div>

      {/* View 1: Question Blueprints Practice */}
      {activeSubTab === "practice" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            {/* Blueprint Selector */}
            <div className="bg-white dark:bg-[#162032] border border-[#D6D3D1] dark:border-[#1E293B] rounded-xl p-6 shadow-sm">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] dark:text-[#94A3B8] mb-2">
                Select Economics Question Tier
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                {ECONS_BLUEPRINTS.map((bp) => (
                  <button
                    key={bp.id}
                    onClick={() => {
                      setSelectedBlueprint(bp);
                      setStudentAnswer("");
                      setEvaluatedScore(null);
                    }}
                    className={`p-2.5 rounded-lg border text-left transition-colors ${
                      selectedBlueprint.id === bp.id
                        ? "bg-[#0F2042] text-white border-[#0F2042] dark:bg-[#38BDF8] dark:text-[#0F172A] dark:border-[#38BDF8]"
                        : "bg-[#FAF9F6] dark:bg-[#0F172A] border-[#E7E5E4] dark:border-[#1E293B] text-[#1C1917] dark:text-[#E2E8F0] hover:border-[#A8A29E]"
                    }`}
                  >
                    <span className="font-mono text-xs font-bold block">
                      {bp.marks} Marks
                    </span>
                    <span className="text-[10px] opacity-80 truncate block">
                      {bp.commandWord}
                    </span>
                  </button>
                ))}
              </div>

              {/* Question Context & Prompt */}
              <div className="mb-4 p-4 bg-[#F8FAFC] dark:bg-[#0F172A] border-l-2 border-[#0F2042] dark:border-[#38BDF8] rounded-r-md text-xs">
                <span className="font-mono text-[#0F2042] dark:text-[#38BDF8] font-bold block mb-1">
                  {selectedBlueprint.unit}
                </span>
                <p className="text-[#334155] dark:text-[#94A3B8] leading-relaxed">
                  {selectedBlueprint.context}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-academic-serif text-lg sm:text-xl font-bold text-[#1C1917] dark:text-[#F1F5F9] leading-snug">
                  {selectedBlueprint.prompt}
                </h3>
              </div>

              {/* Student Essay Input */}
              <div className="border-t border-[#E7E5E4] dark:border-[#1E293B] pt-4">
                <textarea
                  rows={8}
                  value={studentAnswer}
                  onChange={(e) => setStudentAnswer(e.target.value)}
                  placeholder="Write your economics answer here... Use key terminology (e.g., aggregate demand, PED, opportunity cost, PPC shift) to develop your causal chain."
                  className="w-full bg-[#FAF9F6] dark:bg-[#0F172A] border border-[#D6D3D1] dark:border-[#334155] rounded-lg p-3.5 text-xs sm:text-sm text-[#1C1917] dark:text-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#0F2042] dark:focus:ring-[#38BDF8]"
                ></textarea>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs font-mono text-[#78716C] dark:text-[#94A3B8]">
                    Words: {studentAnswer.trim() ? studentAnswer.trim().split(/\s+/).length : 0}
                  </span>
                  <button
                    disabled={!studentAnswer.trim()}
                    onClick={handleEvaluateEcons}
                    className="bg-[#0F2042] dark:bg-[#38BDF8] hover:bg-[#1E3A8A] dark:hover:bg-[#0284C7] text-white dark:text-[#0F172A] text-xs font-semibold py-2 px-5 rounded-lg transition-colors disabled:opacity-40"
                  >
                    Assess Economics Essay
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Indicative Rubric & Evaluation */}
          <div className="lg:col-span-5 space-y-6">
            {evaluatedScore !== null ? (
              <div className="bg-white dark:bg-[#162032] border border-[#D6D3D1] dark:border-[#1E293B] rounded-xl p-6 shadow-sm">
                <span className="text-xs font-mono uppercase text-[#78716C] dark:text-[#94A3B8]">
                  Assessment Result
                </span>
                <div className="flex items-baseline gap-2 my-2">
                  <span className="font-academic-serif text-4xl font-bold text-[#0F2042] dark:text-[#38BDF8]">
                    {evaluatedScore}
                  </span>
                  <span className="text-sm font-mono text-[#78716C] dark:text-[#94A3B8]">
                    / {selectedBlueprint.marks} marks
                  </span>
                </div>
                <p className="text-xs text-[#57534E] dark:text-[#94A3B8] leading-relaxed mb-4">
                  {evaluationFeedback}
                </p>

                <div className="p-3 bg-[#FAF9F6] dark:bg-[#0F172A] border border-[#E7E5E4] dark:border-[#1E293B] rounded-lg text-xs">
                  <span className="font-semibold text-[#0F2042] dark:text-[#38BDF8] block mb-1">
                    CIE Marking Scheme Expectations:
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-[#57534E] dark:text-[#94A3B8] text-[11px]">
                    {selectedBlueprint.indicativeRubric.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#162032] border border-[#D6D3D1] dark:border-[#1E293B] rounded-xl p-6 shadow-sm text-xs space-y-3">
                <h3 className="font-academic-serif text-base font-bold text-[#0F2042] dark:text-[#F1F5F9]">
                  Cambridge 0455 Marking Criteria
                </h3>
                <p className="text-[#57534E] dark:text-[#94A3B8] leading-relaxed">
                  Cambridge Economics requires candidates to explain both the micro and macroeconomic transmission mechanism.
                </p>
                <div className="p-3 bg-[#FAF9F6] dark:bg-[#0F172A] border border-[#E7E5E4] dark:border-[#1E293B] rounded-lg">
                  <strong className="text-[#0F2042] dark:text-[#38BDF8] block mb-1">
                    Indicative Rubric Criteria:
                  </strong>
                  <ul className="list-disc pl-4 space-y-1 text-[#57534E] dark:text-[#94A3B8] text-[11px]">
                    {selectedBlueprint.indicativeRubric.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View 2: Interactive Diagrams Simulator */}
      {activeSubTab === "diagrams" && (
        <div className="bg-white dark:bg-[#162032] border border-[#D6D3D1] dark:border-[#1E293B] rounded-xl p-6 sm:p-8 shadow-sm">
          <h2 className="font-academic-serif text-2xl font-bold text-[#0F2042] dark:text-[#F1F5F9] mb-2">
            Market Equilibrium Shift Simulator
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#94A3B8] mb-6">
            Drag the demand and supply determinants below to observe the graphical and numerical changes to equilibrium price and quantity.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* SVG Diagram Canvas (7 cols) */}
            <div className="lg:col-span-7 bg-[#FAF9F6] dark:bg-[#0F172A] p-6 rounded-xl border border-[#E7E5E4] dark:border-[#1E293B] flex flex-col items-center justify-center">
              <svg viewBox="0 0 400 300" className="w-full max-w-md h-auto">
                {/* Axes */}
                <line x1="50" y1="20" x2="50" y2="250" stroke="currentColor" strokeWidth="2" className="text-[#78716C] dark:text-[#64748B]" />
                <line x1="50" y1="250" x2="370" y2="250" stroke="currentColor" strokeWidth="2" className="text-[#78716C] dark:text-[#64748B]" />

                {/* Axis Labels */}
                <text x="20" y="30" className="fill-current text-[#0F2042] dark:text-[#38BDF8] text-[12px] font-mono font-bold">P ($)</text>
                <text x="360" y="275" className="fill-current text-[#0F2042] dark:text-[#38BDF8] text-[12px] font-mono font-bold">Q</text>

                {/* Base Demand Curve (D0) */}
                <line x1="80" y1="50" x2="340" y2="230" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 4" />
                {/* Base Supply Curve (S0) */}
                <line x1="80" y1="230" x2="340" y2="50" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 4" />

                {/* Shifted Demand Curve (D1) */}
                <line
                  x1={80 + demandShift * 12}
                  y1="50"
                  x2={340 + demandShift * 12}
                  y2="230"
                  stroke="#2563EB"
                  strokeWidth="2.5"
                />
                <text x={345 + demandShift * 12} y="235" className="fill-blue-600 font-mono font-bold text-[12px]">D</text>

                {/* Shifted Supply Curve (S1) */}
                <line
                  x1={80 - supplyShift * 12}
                  y1="230"
                  x2={340 - supplyShift * 12}
                  y2="50"
                  stroke="#DC2626"
                  strokeWidth="2.5"
                />
                <text x={345 - supplyShift * 12} y="55" className="fill-red-600 font-mono font-bold text-[12px]">S</text>

                {/* Equilibrium Point */}
                {(() => {
                  const eqX = 210 + demandShift * 6 - supplyShift * 6;
                  const eqY = 140 - demandShift * 8 + supplyShift * 6;
                  return (
                    <g>
                      <circle cx={eqX} cy={eqY} r="5" className="fill-[#0F2042] dark:fill-[#38BDF8]" />
                      <line x1="50" y1={eqY} x2={eqX} y2={eqY} stroke="#94A3B8" strokeDasharray="3 3" />
                      <line x1={eqX} y1={eqY} x2={eqX} y2="250" stroke="#94A3B8" strokeDasharray="3 3" />
                      <text x={eqX + 8} y={eqY - 8} className="fill-current text-[#0F2042] dark:text-[#38BDF8] font-mono text-[11px] font-bold">
                        E1 (${currentPrice}, {currentQuantity})
                      </text>
                    </g>
                  );
                })()}
              </svg>

              <div className="flex items-center gap-6 mt-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-blue-600">
                  <span className="w-3 h-0.5 bg-blue-600 inline-block"></span> Demand Curve
                </span>
                <span className="flex items-center gap-1.5 text-red-600">
                  <span className="w-3 h-0.5 bg-red-600 inline-block"></span> Supply Curve
                </span>
              </div>
            </div>

            {/* Sliders and Metrics Control (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Equilibrium Results Box */}
              <div className="p-4 bg-[#F8FAFC] dark:bg-[#0F172A] rounded-xl border border-[#CBD5E1] dark:border-[#1E293B]">
                <span className="text-xs font-mono uppercase text-[#78716C] dark:text-[#94A3B8] block mb-1">
                  Equilibrium Outcomes
                </span>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <span className="text-[10px] text-[#64748B] block">Price (P*):</span>
                    <span className="font-mono text-2xl font-bold text-[#0F2042] dark:text-[#38BDF8] tabular-nums">
                      ${currentPrice}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748B] block">Quantity (Q*):</span>
                    <span className="font-mono text-2xl font-bold text-[#0F2042] dark:text-[#38BDF8] tabular-nums">
                      {currentQuantity} units
                    </span>
                  </div>
                </div>
              </div>

              {/* Demand Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1C1917] dark:text-[#F1F5F9]">
                    Demand Shift (Consumer Income / Tastes)
                  </span>
                  <span className="font-mono text-blue-600 font-bold">
                    {demandShift > 0 ? `+${demandShift} Right` : demandShift < 0 ? `${demandShift} Left` : "Neutral"}
                  </span>
                </div>
                <input
                  type="range"
                  min="-4"
                  max="4"
                  value={demandShift}
                  onChange={(e) => setDemandShift(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Supply Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1C1917] dark:text-[#F1F5F9]">
                    Supply Shift (Production Costs / Technology)
                  </span>
                  <span className="font-mono text-red-600 font-bold">
                    {supplyShift > 0 ? `+${supplyShift} Right` : supplyShift < 0 ? `${supplyShift} Left` : "Neutral"}
                  </span>
                </div>
                <input
                  type="range"
                  min="-4"
                  max="4"
                  value={supplyShift}
                  onChange={(e) => setSupplyShift(Number(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
              </div>

              <button
                onClick={() => {
                  setDemandShift(0);
                  setSupplyShift(0);
                }}
                className="text-xs font-semibold text-[#78716C] dark:text-[#94A3B8] hover:text-[#0F2042] dark:hover:text-[#38BDF8] underline"
              >
                Reset to Original Equilibrium (E0)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View 3: Economics 0455 Glossary */}
      {activeSubTab === "glossary" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ECONS_GLOSSARY.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#162032] border border-[#E7E5E4] dark:border-[#1E293B] rounded-xl p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-mono text-[#8B1E1E] dark:text-[#F87171] uppercase font-semibold">
                  {item.unit}
                </span>
                <h3 className="font-academic-serif text-xl font-bold text-[#0F2042] dark:text-[#F1F5F9] my-2">
                  {item.term}
                </h3>
                <p className="text-xs sm:text-sm text-[#1C1917] dark:text-[#E2E8F0] leading-relaxed mb-4">
                  {item.definition}
                </p>

                {item.formula && (
                  <div className="mb-3 p-2 bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#CBD5E1] dark:border-[#334155] rounded text-xs font-mono text-[#0F172A] dark:text-[#38BDF8]">
                    <strong>Formula:</strong> {item.formula}
                  </div>
                )}

                <div className="p-3 bg-[#FAF9F6] dark:bg-[#0F172A] border border-[#E7E5E4] dark:border-[#1E293B] rounded-lg text-xs text-[#57534E] dark:text-[#94A3B8]">
                  <strong className="text-[#0F2042] dark:text-[#38BDF8] block mb-0.5">
                    Examiner Tip:
                  </strong>
                  {item.examAdvice}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import { AssessmentObjectivesBreakdown } from "../lib/types";

interface AOHighlightViewerProps {
  text: string;
  isModelAnswer?: boolean;
  isStudentAnswer?: boolean;
  validAppWords?: string[];
  aoBreakdown?: AssessmentObjectivesBreakdown;
  className?: string;
  title?: string;
}

// Common causal analysis connectives used in Cambridge business & economics essays
const ANALYSIS_CONNECTIVES = [
  "this leads to",
  "as a result",
  "consequently",
  "therefore",
  "this means that",
  "meaning that",
  "which enables",
  "enabling the business to",
  "enabling them to",
  "enables the business to",
  "resulting in",
  "because of this",
  "leading to",
  "this results in",
  "which causes",
  "in turn",
  "which leads to",
  "this allows the business to",
  "this reduces",
  "this increases",
  "which helps",
  "subsequently",
  "due to this",
  "thereby",
  "because",
  "due to",
  "in order to",
  "allowing",
  "which impacts",
  "which lowers",
  "impact on profit",
  "affects cash flow",
  "loss of customers",
  "lower costs",
  "higher revenue",
  "higher profit",
  "reduces financial risk",
  "delays operations",
  "lowers unit costs",
  "increased productivity",
  "improves cash flow",
  "competitive advantage",
  "loss of reputation",
];

// Common evaluation connectives used for AO4 judgment
const EVALUATION_CONNECTIVES = [
  "on balance",
  "in conclusion",
  "to conclude",
  "overall",
  "however",
  "weighing up",
  "weighing",
  "depends on",
  "depends upon",
  "it depends on",
  "the deciding factor",
  "deciding factor",
  "greater than",
  "outweigh",
  "outweighs",
  "short run",
  "long run",
  "in the short term",
  "in the long term",
  "in the short run",
  "in the long run",
  "ultimately",
  "despite this",
  "nevertheless",
  "on the other hand",
  "in contrast",
  "although",
  "vital that",
  "crucial factor",
  "vital factor",
  "most important factor",
  "most critical factor",
  "best option",
  "recommend",
  "justified because",
  "advantages are greater",
  "disadvantages are greater",
  "preferable",
  "superior",
  "decisive",
];

// Core business knowledge terms to flag as AO1
const KNOWLEDGE_TERMS = [
  "fixed costs",
  "variable costs",
  "fixed cost",
  "variable cost",
  "revenue",
  "profit",
  "break-even",
  "margin of safety",
  "market segmentation",
  "niche market",
  "mass market",
  "economies of scale",
  "diseconomies of scale",
  "product life cycle",
  "price elasticity",
  "demand",
  "supply",
  "equilibrium",
  "sole trader",
  "unlimited liability",
  "limited liability",
  "partnership",
  "private limited company",
  "public limited company",
  "plc",
  "ltd",
  "joint venture",
  "franchise",
  "franchisee",
  "franchisor",
  "quality control",
  "quality assurance",
  "total quality management",
  "tqm",
  "just-in-time",
  "jit",
  "batch production",
  "flow production",
  "job production",
  "lean production",
  "kaizen",
  "buffer stock",
  "boston matrix",
  "cash cow",
  "cash dog",
  "star",
  "problem child",
  "opportunity cost",
  "factors of production",
  "land",
  "labour",
  "labor",
  "capital",
  "enterprise",
  "rent",
  "wages",
  "interest",
  "salary",
  "commission",
  "piece rate",
  "bonus",
  "fringe benefits",
  "profit sharing",
  "motivation",
  "maslow",
  "taylor",
  "herzberg",
  "hierarchy of needs",
  "hygiene factors",
  "job rotation",
  "job enrichment",
  "span of control",
  "chain of command",
  "delegation",
  "centralised",
  "decentralised",
  "autocratic",
  "democratic",
  "paternalistic",
  "laissez-faire",
  "trade union",
  "industrial action",
  "strike",
  "overtime",
  "recruitment",
  "redundancy",
  "dismissal",
  "contract of employment",
  "market research",
  "primary research",
  "secondary research",
  "sampling",
  "random sample",
  "quota sample",
  "market share",
  "marketing mix",
  "product",
  "price",
  "promotion",
  "place",
  "penetration pricing",
  "price skimming",
  "cost-plus pricing",
  "competitive pricing",
  "promotional mix",
  "branding",
  "brand image",
  "e-commerce",
  "distribution channel",
  "wholesaler",
  "retailer",
  "cash flow",
  "cash flow forecast",
  "working capital",
  "liquidity",
  "overdraft",
  "bank loan",
  "retained profit",
  "share capital",
  "income statement",
  "gross profit",
  "net profit",
  "balance sheet",
  "current ratio",
  "acid test ratio",
  "return on capital employed",
  "roce",
  "inflation",
  "unemployment",
  "economic growth",
  "gross domestic product",
  "gdp",
  "exchange rate",
  "appreciation",
  "depreciation",
  "tariff",
  "quota",
  "added value",
  "specialisation",
  "division of labour",
  "primary sector",
  "secondary sector",
  "tertiary sector",
];

export function AOHighlightViewer({
  text,
  isModelAnswer = false,
  isStudentAnswer,
  validAppWords = [],
  aoBreakdown,
  className = "",
  title,
}: AOHighlightViewerProps) {
  const isModel = isStudentAnswer !== undefined ? !isStudentAnswer : isModelAnswer;

  // Toggle filters for individual AOs
  const [showAO1, setShowAO1] = useState(true);
  const [showAO2, setShowAO2] = useState(true);
  const [showAO3, setShowAO3] = useState(true);
  const [showAO4, setShowAO4] = useState(true);

  // If text contains bracket annotations: [k], [app], [an], [eval], [1], [2], [4]
  const hasBracketAnnotations = /\[(?:k|app|an|eval|ao1|ao2|ao3|ao4|1|2|3|4|6|8)\]/i.test(text);

  const parsedModelChunks = useMemo(() => {
    if (!hasBracketAnnotations && !isModel) return null;

    // Split text by bracket annotations while keeping them
    const regex = /(\[(?:k|app|an|eval|ao1|ao2|ao3|ao4|1|2|3|4|6|8)\])/gi;
    const parts = text.split(regex);
    const chunks: Array<{ text: string; ao: "ao1" | "ao2" | "ao3" | "ao4" | "none"; tag?: string }> = [];

    let currentText = "";
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const match = part.match(/^\[(k|app|an|eval|ao1|ao2|ao3|ao4|1|2|3|4|6|8)\]$/i);

      if (match) {
        const tag = match[1].toLowerCase();
        let ao: "ao1" | "ao2" | "ao3" | "ao4" | "none" = "none";
        if (tag === "k" || tag === "ao1" || tag === "1" || tag === "2") ao = "ao1";
        else if (tag === "app" || tag === "ao2") ao = "ao2";
        else if (tag === "an" || tag === "ao3") ao = "ao3";
        else if (tag === "eval" || tag === "ao4") ao = "ao4";

        if (currentText) {
          chunks.push({ text: currentText, ao, tag: `[${tag.toUpperCase()}]` });
          currentText = "";
        }
      } else {
        currentText += part;
      }
    }

    if (currentText) {
      chunks.push({ text: currentText, ao: "none" });
    }

    return chunks;
  }, [text, isModel, hasBracketAnnotations]);

  // For student answers: identify detected keywords and causal links
  const studentHighlights = useMemo(() => {
    if (isModel || !text) return null;

    const lower = text.toLowerCase();
    const appMatches: string[] = [];
    const anMatches: string[] = [];
    const evalMatches: string[] = [];
    const kMatches: string[] = [];

    // Check application words
    if (validAppWords && validAppWords.length > 0) {
      for (const w of validAppWords) {
        if (w && lower.includes(w.toLowerCase()) && !appMatches.includes(w.toLowerCase())) {
          appMatches.push(w.toLowerCase());
        }
      }
    }

    // Check analysis connectives
    for (const c of ANALYSIS_CONNECTIVES) {
      if (lower.includes(c)) {
        anMatches.push(c);
      }
    }

    // Check evaluation connectives
    for (const e of EVALUATION_CONNECTIVES) {
      if (lower.includes(e)) {
        evalMatches.push(e);
      }
    }

    // Check knowledge terms
    for (const k of KNOWLEDGE_TERMS) {
      if (lower.includes(k)) {
        kMatches.push(k);
      }
    }

    return {
      appCount: appMatches.length,
      anCount: anMatches.length,
      evalCount: evalMatches.length,
      kCount: kMatches.length,
      appMatches,
      anMatches,
      evalMatches,
      kMatches,
    };
  }, [text, isModelAnswer, validAppWords]);

  return (
    <div className={`rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 p-4 sm:p-5 shadow-xs transition-colors ${className}`}>
      {/* Top Header with AO Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-academic-serif text-sm font-bold text-[#0F2042] dark:text-white">
              {title || (isModelAnswer ? "Cambridge Examiner Model Answer · AO Breakdown" : "Candidate Response · Visual AO Highlighter")}
            </span>
          </div>
          <span className="text-[11px] text-[#78716C] dark:text-neutral-400">
            {isModelAnswer
              ? "Official Cambridge rubric annotations highlighting exact mark awards."
              : "Live visual mapping of Knowledge (AO1), Application (AO2), Analysis (AO3), and Evaluation (AO4)."}
          </span>
        </div>

        {/* Interactive AO Legend Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <button
            type="button"
            onClick={() => setShowAO1(!showAO1)}
            className={`px-2 py-0.5 rounded border transition-all cursor-pointer flex items-center gap-1 ${
              showAO1
                ? "bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-300 font-bold"
                : "bg-slate-100 dark:bg-neutral-800 border-slate-300 dark:border-neutral-700 text-slate-400 opacity-60"
            }`}
            title="Toggle AO1 Knowledge highlight"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>AO1 Knowledge</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAO2(!showAO2)}
            className={`px-2 py-0.5 rounded border transition-all cursor-pointer flex items-center gap-1 ${
              showAO2
                ? "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold"
                : "bg-slate-100 dark:bg-neutral-800 border-slate-300 dark:border-neutral-700 text-slate-400 opacity-60"
            }`}
            title="Toggle AO2 Application highlight"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>AO2 Context (App)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAO3(!showAO3)}
            className={`px-2 py-0.5 rounded border transition-all cursor-pointer flex items-center gap-1 ${
              showAO3
                ? "bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300 font-bold"
                : "bg-slate-100 dark:bg-neutral-800 border-slate-300 dark:border-neutral-700 text-slate-400 opacity-60"
            }`}
            title="Toggle AO3 Analysis highlight"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>AO3 Analysis</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAO4(!showAO4)}
            className={`px-2 py-0.5 rounded border transition-all cursor-pointer flex items-center gap-1 ${
              showAO4
                ? "bg-purple-500/10 border-purple-500 text-purple-700 dark:text-purple-300 font-bold"
                : "bg-slate-100 dark:bg-neutral-800 border-slate-300 dark:border-neutral-700 text-slate-400 opacity-60"
            }`}
            title="Toggle AO4 Evaluation highlight"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            <span>AO4 Evaluation</span>
          </button>
        </div>
      </div>

      {/* Student Highlights Summary Stat Pill (only for student answers) */}
      {!isModelAnswer && studentHighlights && (
        <div className="flex flex-wrap items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-neutral-800/80 text-[11px] font-mono">
          <span className="text-slate-500 dark:text-neutral-400 font-sans">Detected elements:</span>
          <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 font-bold">
            {studentHighlights.kCount} AO1 Concept{studentHighlights.kCount !== 1 ? "s" : ""}
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 font-bold">
            {studentHighlights.appCount} AO2 Case Context Fact{studentHighlights.appCount !== 1 ? "s" : ""}
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 font-bold">
            {studentHighlights.anCount} AO3 Causal Chain{studentHighlights.anCount !== 1 ? "s" : ""}
          </span>
          <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900 font-bold">
            {studentHighlights.evalCount} AO4 Evaluative Phrase{studentHighlights.evalCount !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Render Text Content */}
      <div className="text-sm leading-relaxed font-sans font-normal text-[#1C1917] dark:text-neutral-200">
        {parsedModelChunks ? (
          // ANNOTATED BRACKET RENDER (AO1, AO2, AO3, AO4)
          <div className="space-y-1.5">
            {parsedModelChunks.map((chunk, idx) => {
              if (chunk.ao === "ao1" && showAO1) {
                return (
                  <span
                    key={idx}
                    className="inline bg-blue-50 dark:bg-blue-950/60 text-blue-950 dark:text-blue-100 border-b-2 border-blue-500 px-1 py-0.5 rounded-xs mr-1"
                  >
                    {chunk.text}
                    <span className="ml-1 inline-flex items-center px-1 rounded bg-blue-600 text-white text-[9px] font-mono font-bold tracking-tight">
                      AO1 K
                    </span>
                  </span>
                );
              }
              if (chunk.ao === "ao2" && showAO2) {
                return (
                  <span
                    key={idx}
                    className="inline bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 border-b-2 border-emerald-500 px-1 py-0.5 rounded-xs mr-1"
                  >
                    {chunk.text}
                    <span className="ml-1 inline-flex items-center px-1 rounded bg-emerald-600 text-white text-[9px] font-mono font-bold tracking-tight">
                      AO2 APP
                    </span>
                  </span>
                );
              }
              if (chunk.ao === "ao3" && showAO3) {
                return (
                  <span
                    key={idx}
                    className="inline bg-amber-50 dark:bg-amber-950/60 text-amber-950 dark:text-amber-100 border-b-2 border-amber-500 px-1 py-0.5 rounded-xs mr-1"
                  >
                    {chunk.text}
                    <span className="ml-1 inline-flex items-center px-1 rounded bg-amber-600 text-white text-[9px] font-mono font-bold tracking-tight">
                      AO3 AN
                    </span>
                  </span>
                );
              }
              if (chunk.ao === "ao4" && showAO4) {
                return (
                  <span
                    key={idx}
                    className="inline bg-purple-50 dark:bg-purple-950/60 text-purple-950 dark:text-purple-100 border-b-2 border-purple-500 px-1 py-0.5 rounded-xs mr-1"
                  >
                    {chunk.text}
                    <span className="ml-1 inline-flex items-center px-1 rounded bg-purple-600 text-white text-[9px] font-mono font-bold tracking-tight">
                      AO4 EVAL
                    </span>
                  </span>
                );
              }
              return <span key={idx}>{chunk.text} </span>;
            })}
          </div>
        ) : (
          // STUDENT ANSWER RENDER WITH DYNAMIC HIGHLIGHT MATCHING
          <div className="whitespace-pre-wrap leading-relaxed">
            {text ? (
              // Break text into sentences/words and highlight matches
              renderStudentWithHighlights(
                text,
                validAppWords,
                showAO1,
                showAO2,
                showAO3,
                showAO4
              )
            ) : (
              <span className="italic text-slate-400">No student response text provided.</span>
            )}
          </div>
        )}
      </div>

      {/* AO Score Feedback Cards if evaluation is provided */}
      {aoBreakdown && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-neutral-800 text-xs">
          <div className="p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40">
            <div className="flex items-center justify-between text-blue-900 dark:text-blue-300 font-bold mb-1">
              <span>AO1 Knowledge</span>
              <span>{aoBreakdown.ao1.score} / {aoBreakdown.ao1.max}</span>
            </div>
            <p className="text-[11px] text-blue-800/80 dark:text-blue-300/80 line-clamp-2">
              {aoBreakdown.ao1.feedback}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40">
            <div className="flex items-center justify-between text-emerald-900 dark:text-emerald-300 font-bold mb-1">
              <span>AO2 Context</span>
              <span>{aoBreakdown.ao2.score} / {aoBreakdown.ao2.max}</span>
            </div>
            <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 line-clamp-2">
              {aoBreakdown.ao2.feedback}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40">
            <div className="flex items-center justify-between text-amber-900 dark:text-amber-300 font-bold mb-1">
              <span>AO3 Analysis</span>
              <span>{aoBreakdown.ao3.score} / {aoBreakdown.ao3.max}</span>
            </div>
            <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 line-clamp-2">
              {aoBreakdown.ao3.feedback}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-900/40">
            <div className="flex items-center justify-between text-purple-900 dark:text-purple-300 font-bold mb-1">
              <span>AO4 Evaluation</span>
              <span>{aoBreakdown.ao4.score} / {aoBreakdown.ao4.max}</span>
            </div>
            <p className="text-[11px] text-purple-800/80 dark:text-purple-300/80 line-clamp-2">
              {aoBreakdown.ao4.feedback}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper to highlight words and connectives in student answer
function renderStudentWithHighlights(
  text: string,
  appWords: string[] = [],
  showAO1: boolean,
  showAO2: boolean,
  showAO3: boolean,
  showAO4: boolean
) {
  // Collect all patterns to match
  const patterns: Array<{ regex: RegExp; ao: "ao1" | "ao2" | "ao3" | "ao4"; label: string }> = [];

  // AO4 Evaluation
  if (showAO4) {
    for (const c of EVALUATION_CONNECTIVES) {
      patterns.push({
        regex: new RegExp(`\\b${escapeRegExp(c)}\\b`, "gi"),
        ao: "ao4",
        label: "AO4 Eval",
      });
    }
  }

  // AO3 Analysis
  if (showAO3) {
    for (const c of ANALYSIS_CONNECTIVES) {
      patterns.push({
        regex: new RegExp(`\\b${escapeRegExp(c)}\\b`, "gi"),
        ao: "ao3",
        label: "AO3 Analysis",
      });
    }
  }

  // AO2 Application
  if (showAO2 && appWords.length > 0) {
    for (const w of appWords) {
      if (w && w.trim().length > 1) {
        patterns.push({
          regex: new RegExp(`\\b${escapeRegExp(w)}\\b`, "gi"),
          ao: "ao2",
          label: "AO2 App",
        });
      }
    }
  }

  // AO1 Knowledge
  if (showAO1) {
    for (const k of KNOWLEDGE_TERMS) {
      patterns.push({
        regex: new RegExp(`\\b${escapeRegExp(k)}\\b`, "gi"),
        ao: "ao1",
        label: "AO1 K",
      });
    }
  }

  // Find all matches with positions
  interface MatchItem {
    start: number;
    end: number;
    ao: "ao1" | "ao2" | "ao3" | "ao4";
    label: string;
    matchText: string;
  }

  const allMatches: MatchItem[] = [];

  for (const p of patterns) {
    let match: RegExpExecArray | null;
    p.regex.lastIndex = 0;
    while ((match = p.regex.exec(text)) !== null) {
      allMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        ao: p.ao,
        label: p.label,
        matchText: match[0],
      });
    }
  }

  // Sort matches by start position
  allMatches.sort((a, b) => a.start - b.start);

  // Filter overlapping matches (prefer longer/earlier match)
  const nonOverlapping: MatchItem[] = [];
  let lastEnd = 0;
  for (const m of allMatches) {
    if (m.start >= lastEnd) {
      nonOverlapping.push(m);
      lastEnd = m.end;
    }
  }

  // Build JSX
  const elements: React.ReactNode[] = [];
  let currentIndex = 0;

  for (let i = 0; i < nonOverlapping.length; i++) {
    const m = nonOverlapping[i];
    if (m.start > currentIndex) {
      elements.push(text.substring(currentIndex, m.start));
    }

    let highlightClasses = "";
    if (m.ao === "ao1") {
      highlightClasses = "bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-200 border-b-2 border-blue-500 font-semibold";
    } else if (m.ao === "ao2") {
      highlightClasses = "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border-b-2 border-emerald-500 font-semibold";
    } else if (m.ao === "ao3") {
      highlightClasses = "bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-b-2 border-amber-500 font-semibold";
    } else if (m.ao === "ao4") {
      highlightClasses = "bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-200 border-b-2 border-purple-500 font-semibold";
    }

    elements.push(
      <span key={`match-${i}`} className={`px-1 py-0.5 rounded-xs transition-colors relative group inline ${highlightClasses}`}>
        {text.substring(m.start, m.end)}
        <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5 left-0 px-1 py-0.2 rounded bg-slate-900 text-white text-[9px] font-mono pointer-events-none whitespace-nowrap z-20 shadow-md">
          {m.label}
        </span>
      </span>
    );

    currentIndex = m.end;
  }

  if (currentIndex < text.length) {
    elements.push(text.substring(currentIndex));
  }

  return elements;
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

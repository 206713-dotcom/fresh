"use client";

import React, { useState, useEffect } from "react";
import { SYLLABUS_SECTIONS, SyllabusSection, SyllabusTopic } from "../lib/data/syllabus-topics";
import { loadRevisedTopics, toggleRevisedTopic } from "../lib/cookies";

interface SectionBreakdownBoxProps {
  activeSectionCode: string;
  onSelectSection: (sectionCode: string) => void;
  activeTopicCode?: string;
  onSelectTopic?: (topicCode: string) => void;
  onOpenFinanceExam?: () => void;
  className?: string;
}

export function SectionBreakdownBox({
  activeSectionCode,
  onSelectSection,
  activeTopicCode,
  onSelectTopic,
  onOpenFinanceExam,
  className = "",
}: SectionBreakdownBoxProps) {
  const [revisedCodes, setRevisedCodes] = useState<string[]>([]);

  useEffect(() => {
    setRevisedCodes(loadRevisedTopics());
  }, []);

  const handleToggleRevised = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = toggleRevisedTopic(code);
    setRevisedCodes(next);
  };

  const currentSection: SyllabusSection =
    SYLLABUS_SECTIONS.find((s) => s.code === activeSectionCode) || SYLLABUS_SECTIONS[0];

  return (
    <div
      className={`bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 rounded-2xl p-6 lg:p-7 shadow-sm transition-colors ${className}`}
    >
      {/* Section Switcher Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-[#E7E5E4] dark:border-neutral-800">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#78716C] dark:text-neutral-400 mr-1">
          Sections:
        </span>
        {SYLLABUS_SECTIONS.map((sec) => {
          const isSelected = sec.code === activeSectionCode;
          return (
            <button
              key={sec.code}
              onClick={() => onSelectSection(sec.code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isSelected
                  ? "bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0F172A] shadow-sm"
                  : "bg-[#FAF9F6] dark:bg-black border border-[#E7E5E4] dark:border-neutral-700 text-[#57534E] dark:text-neutral-400 hover:border-[#0F2042] dark:hover:border-[#38BDF8]"
              }`}
            >
              <span>Sec {sec.code}</span>
              {sec.consolidationDocUrl && (
                <span
                  title="Consolidation Document Available"
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSelected ? "bg-amber-300 dark:bg-black" : "bg-blue-500 dark:bg-sky-400"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Header Area with Section Title & Consolidation Document Link at the Side */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-[#E7E5E4] dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#0F2042]/10 dark:bg-[#38BDF8]/10 text-[#0F2042] dark:text-[#38BDF8] uppercase">
              Section {currentSection.code} Breakdown
            </span>
            <span className="text-xs text-[#78716C] dark:text-neutral-400">
              {currentSection.topics.length} Key Syllabus Topics
            </span>
          </div>

          <h3 className="font-academic-serif text-xl sm:text-2xl font-bold text-[#0F2042] dark:text-white">
            {currentSection.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#57534E] dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            {currentSection.description}
          </p>
        </div>

        {/* At the side next to the header: Consolidation Document Link for each section (leave section 6 blank) */}
        <div className="shrink-0 flex flex-wrap items-center gap-2.5">
          {currentSection.code === "5" && onOpenFinanceExam && (
            <button
              onClick={onOpenFinanceExam}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-semibold text-xs transition-all shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Finance Exam Pop-up (5.1 & 5.2) 📝</span>
            </button>
          )}

          {currentSection.consolidationDocUrl ? (
            <a
              href={currentSection.consolidationDocUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/80 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 font-semibold text-xs transition-all shadow-sm group"
            >
              <span className="text-sm">📄</span>
              <div className="text-left">
                <span className="block font-bold leading-tight group-hover:underline">
                  Consolidation Document
                </span>
                <span className="block text-[10px] text-blue-600 dark:text-blue-300 font-normal">
                  Google Docs · Section {currentSection.code} ↗
                </span>
              </div>
            </a>
          ) : (
            <div className="px-3.5 py-2 rounded-xl bg-[#FAF9F6] dark:bg-black border border-dashed border-[#D6D3D1] dark:border-neutral-700 text-xs text-[#78716C] dark:text-[#64748B] italic">
              Consolidation Document: Blank for now
            </div>
          )}
        </div>
      </div>

      {/* What the key topics are under this section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#78716C] dark:text-neutral-400">
            Key Topics Under Section {currentSection.code}:
          </span>
          {onSelectTopic && (
            <span className="text-[11px] text-[#78716C] dark:text-neutral-400">
              Click any topic to practice questions
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {currentSection.topics.map((topic: SyllabusTopic) => {
            const isTopicActive = activeTopicCode === topic.code;
            const isRevised = revisedCodes.includes(topic.code);
            return (
              <div
                key={topic.code}
                onClick={() => onSelectTopic && onSelectTopic(topic.code)}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  onSelectTopic ? "cursor-pointer" : ""
                } ${
                  isTopicActive
                    ? "bg-slate-50 dark:bg-slate-900/70 border-[#0F2042] dark:border-[#38BDF8] shadow-sm ring-1 ring-[#0F2042] dark:ring-[#38BDF8]"
                    : isRevised
                    ? "bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60"
                    : "bg-[#FAF9F6] dark:bg-black border-[#E7E5E4] dark:border-neutral-700 hover:border-[#0F2042]/50 dark:hover:border-[#38BDF8]/50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-700 text-[#0F2042] dark:text-[#38BDF8]">
                      Topic {topic.code}
                    </span>

                    {/* Interactive Revision Checkbox */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleRevised(topic.code, e)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-all flex items-center gap-1.5 border cursor-pointer ${
                        isRevised
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          : "bg-white dark:bg-neutral-800 border-[#D6D3D1] dark:border-neutral-700 text-[#78716C] dark:text-neutral-400 hover:border-emerald-500"
                      }`}
                      title={isRevised ? "Mark as unrevised" : "Mark as revised"}
                    >
                      <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] font-bold ${isRevised ? "bg-white text-emerald-700" : "border border-neutral-400"}`}>
                        {isRevised ? "✓" : ""}
                      </span>
                      <span>{isRevised ? "Revised" : "To Revise"}</span>
                    </button>
                  </div>

                  <h4 className={`font-academic-serif text-sm font-bold mb-2 leading-snug transition-colors ${
                    isRevised ? "text-emerald-900 dark:text-emerald-200 line-through opacity-80" : "text-[#1C1917] dark:text-white"
                  }`}>
                    {topic.title}
                  </h4>

                  {/* Core Concepts Breakdown */}
                  <div className="space-y-1 mb-3">
                    <span className="text-[10px] font-mono uppercase text-[#78716C] dark:text-neutral-400 block">
                      Core Key Concepts:
                    </span>
                    <ul className="text-xs text-[#57534E] dark:text-neutral-300 space-y-1 pl-3.5 list-disc">
                      {topic.keyConcepts.slice(0, 4).map((kc, idx) => (
                        <li key={idx} className="leading-snug">
                          {kc}
                        </li>
                      ))}
                      {topic.keyConcepts.length > 4 && (
                        <li className="text-[11px] text-[#78716C] dark:text-neutral-400 italic list-none -ml-3.5 pt-0.5">
                          + {topic.keyConcepts.length - 4} more key concepts
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-[#E7E5E4] dark:border-neutral-800 flex items-center justify-between text-[11px] text-[#78716C] dark:text-neutral-400">
                  <span className="font-mono">
                    Commands: {topic.commandWordEmphasis.slice(0, 2).join(", ")}
                  </span>
                  {onSelectTopic && (
                    <span className="text-[#0F2042] dark:text-[#38BDF8] font-semibold hover:underline">
                      Practice →
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

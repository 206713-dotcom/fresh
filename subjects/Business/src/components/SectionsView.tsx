"use client";

import React, { useState } from "react";
import { SectionBreakdownBox } from "./SectionBreakdownBox";
import { SYLLABUS_SECTIONS } from "../lib/data/syllabus-topics";

interface SectionsViewProps {
  onSelectTopicForPractice: (sectionCode: string, topicCode: string) => void;
  onOpenFinanceExam: () => void;
  onReturnToPractice: () => void;
  initialSectionCode?: string;
}

export function SectionsView({
  onSelectTopicForPractice,
  onOpenFinanceExam,
  onReturnToPractice,
  initialSectionCode = "1",
}: SectionsViewProps) {
  const [activeSectionCode, setActiveSectionCode] = useState<string>(initialSectionCode);
  const [viewMode, setViewMode] = useState<"focused" | "all">("focused");

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 transition-colors">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#0F2042] dark:bg-[#38BDF8]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F2042] dark:text-[#38BDF8]">
              Cambridge 0264 / 0450 Syllabus Directory
            </span>
          </div>
          <h1 className="font-academic-serif text-3xl font-bold text-[#0F2042] dark:text-[#F1F5F9]">
            Sections & Chapters Breakdown
          </h1>
          <p className="text-sm text-[#57534E] dark:text-[#94A3B8] mt-0.5">
            Access official consolidation documents, core chapter concepts, and targeted practice questions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setViewMode(viewMode === "focused" ? "all" : "focused")}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-[#D6D3D1] dark:border-[#334155] bg-white dark:bg-[#162032] hover:bg-[#F5F5F4] dark:hover:bg-[#1E293B] text-[#57534E] dark:text-[#CBD5E1] transition-colors"
          >
            {viewMode === "focused" ? "View All Sections (1–6)" : "Focus Mode"}
          </button>

          <button
            onClick={onReturnToPractice}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#0F2042] dark:bg-[#38BDF8] hover:bg-[#1E3A8A] dark:hover:bg-[#0284C7] text-white dark:text-[#0F172A] transition-colors shadow-sm"
          >
            Practice Studio →
          </button>
        </div>
      </div>

      {/* Primary Section Breakdown Box */}
      {viewMode === "focused" ? (
        <div className="space-y-6">
          <SectionBreakdownBox
            activeSectionCode={activeSectionCode}
            onSelectSection={setActiveSectionCode}
            onSelectTopic={(topicCode) => onSelectTopicForPractice(activeSectionCode, topicCode)}
            onOpenFinanceExam={onOpenFinanceExam}
          />
        </div>
      ) : (
        /* All 6 Sections Expanded View */
        <div className="space-y-8">
          {SYLLABUS_SECTIONS.map((sec) => (
            <SectionBreakdownBox
              key={sec.code}
              activeSectionCode={sec.code}
              onSelectSection={setActiveSectionCode}
              onSelectTopic={(topicCode) => onSelectTopicForPractice(sec.code, topicCode)}
              onOpenFinanceExam={onOpenFinanceExam}
            />
          ))}
        </div>
      )}
    </div>
  );
}

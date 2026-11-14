"use client";

import React, { useState } from "react";
import { SectionBreakdownBox } from "./SectionBreakdownBox";
import { OnePageSheets } from "./OnePageSheets";
import { SYLLABUS_SECTIONS } from "../lib/data/syllabus-topics";

interface SectionsViewProps {
  onSelectTopicForPractice: (sectionCode: string, topicCode: string) => void;
  onReturnToPractice: () => void;
  onOpenCompare?: (sectionCode: string) => void;
  initialSectionCode?: string;
}

export function SectionsView({
  onSelectTopicForPractice,
  onReturnToPractice,
  onOpenCompare,
  initialSectionCode = "1",
}: SectionsViewProps) {
  const [activeSectionCode, setActiveSectionCode] = useState<string>(initialSectionCode);
  const [viewMode, setViewMode] = useState<"focused" | "all" | "sheets">("focused");
  const [sheetSection, setSheetSection] = useState(initialSectionCode);

  const openSheet = (code: string) => {
    setSheetSection(code);
    setActiveSectionCode(code);
    setViewMode("sheets");
  };

  if (viewMode === "sheets") {
    return (
      <OnePageSheets
        initialSectionCode={sheetSection}
        onBack={() => setViewMode("focused")}
      />
    );
  }

  return (
    <div className="study-page">
      {/* Top Header */}
      <div className="study-page-heading">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#0F2042] dark:bg-[#38BDF8]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F2042] dark:text-[#38BDF8]">
              Cambridge 0264 / 0450 Syllabus Directory
            </span>
          </div>
          <h1 className="study-title">
            Sections & Chapters Breakdown
          </h1>
          <p className="study-description">
            Access official consolidation documents, core chapter concepts, and targeted practice questions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => openSheet(activeSectionCode)}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-[#0F2042]/30 dark:border-[#38BDF8]/40 bg-white dark:bg-neutral-900 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-[#0F2042] dark:text-[#38BDF8] transition-colors"
          >
            1-page sheets
          </button>

          <button
            onClick={() => setViewMode(viewMode === "focused" ? "all" : "focused")}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-[#57534E] dark:text-neutral-300 transition-colors"
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
            onOpenOnePageSheet={openSheet}
            onOpenCompare={onOpenCompare}
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
              onOpenOnePageSheet={openSheet}
              onOpenCompare={onOpenCompare}
            />
          ))}
        </div>
      )}
    </div>
  );
}

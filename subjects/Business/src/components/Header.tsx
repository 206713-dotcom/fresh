"use client";

import React from "react";

interface HeaderProps {
  currentSubject: "business" | "econs";
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onSwitchSubject: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  submissionCount: number;
}

export function Header({
  currentSubject,
  activeTab,
  setActiveTab,
  onSwitchSubject,
  theme,
  onToggleTheme,
  submissionCount,
}: HeaderProps) {
  const isBusiness = currentSubject === "business";

  return (
    <header className="sticky top-0 z-50 bg-[#FAF9F6]/95 dark:bg-[#0C1322]/95 backdrop-blur-md border-b border-[#E7E5E4] dark:border-[#1E293B] px-6 lg:px-12 py-3.5 flex items-center justify-between gap-8 transition-colors">
      {/* Zone 1: Single text element wordmark tailored solely to active subject */}
      <div className="flex items-center gap-3">
        <button
          onClick={onSwitchSubject}
          title="Return to Subject Selection"
          className="text-left group flex items-center gap-2.5 focus:outline-none"
        >
          <span className="font-academic-serif text-xl font-bold tracking-tight text-[#0F2042] dark:text-[#F1F5F9] whitespace-nowrap shrink-0">
            {isBusiness ? "EcBiz · Business" : "EcBiz · Economics"}
          </span>
          <span className="text-xs font-mono text-[#78716C] dark:text-[#94A3B8] border-l border-[#D6D3D1] dark:border-[#334155] pl-2.5 hidden sm:inline">
            {isBusiness ? "CIE 0264 / 0450" : "CIE 0455 / 2281"}
          </span>
        </button>
      </div>

      {/* Zone 2: Navigation links solely for the active subject */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#57534E] dark:text-[#94A3B8]">
        {isBusiness ? (
          <>
            <button
              onClick={() => setActiveTab("practice")}
              className={`hover:text-[#0F2042] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeTab === "practice"
                  ? "text-[#0F2042] dark:text-[#38BDF8] border-b-2 border-[#0F2042] dark:border-[#38BDF8] font-semibold"
                  : ""
              }`}
            >
              Practice Studio
            </button>
            <button
              onClick={() => setActiveTab("quick-quiz")}
              className={`hover:text-[#0F2042] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 flex items-center gap-1.5 ${
                activeTab === "quick-quiz"
                  ? "text-[#0F2042] dark:text-[#38BDF8] border-b-2 border-[#0F2042] dark:border-[#38BDF8] font-semibold"
                  : "text-[#8B1E1E] dark:text-[#F87171] font-semibold"
              }`}
            >
              <span>⚡ Quick Quiz</span>
            </button>
            <button
              onClick={() => setActiveTab("sections")}
              className={`hover:text-[#0F2042] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 flex items-center gap-1.5 ${
                activeTab === "sections"
                  ? "text-[#0F2042] dark:text-[#38BDF8] border-b-2 border-[#0F2042] dark:border-[#38BDF8] font-semibold"
                  : ""
              }`}
            >
              <span>Sections & Chapters</span>
            </button>
            <button
              onClick={() => setActiveTab("glossary")}
              className={`hover:text-[#0F2042] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeTab === "glossary"
                  ? "text-[#0F2042] dark:text-[#38BDF8] border-b-2 border-[#0F2042] dark:border-[#38BDF8] font-semibold"
                  : ""
              }`}
            >
              0264 Glossary
            </button>
            <button
              onClick={() => setActiveTab("archive")}
              className={`hover:text-[#0F2042] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeTab === "archive"
                  ? "text-[#0F2042] dark:text-[#38BDF8] border-b-2 border-[#0F2042] dark:border-[#38BDF8] font-semibold"
                  : ""
              }`}
            >
              Specimen Papers & PDFs
            </button>
            <button
              onClick={() => setActiveTab("progress")}
              className={`hover:text-[#0F2042] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeTab === "progress"
                  ? "text-[#0F2042] dark:text-[#38BDF8] border-b-2 border-[#0F2042] dark:border-[#38BDF8] font-semibold"
                  : ""
              }`}
            >
              Progress Ledger
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab("econs-practice")}
              className={`hover:text-[#0F2042] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeTab === "econs-practice"
                  ? "text-[#0F2042] dark:text-[#38BDF8] border-b-2 border-[#0F2042] dark:border-[#38BDF8] font-semibold"
                  : ""
              }`}
            >
              Econs Studio
            </button>
            <button
              onClick={() => setActiveTab("econs-diagrams")}
              className={`hover:text-[#0F2042] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeTab === "econs-diagrams"
                  ? "text-[#0F2042] dark:text-[#38BDF8] border-b-2 border-[#0F2042] dark:border-[#38BDF8] font-semibold"
                  : ""
              }`}
            >
              Market Diagrams
            </button>
            <button
              onClick={() => setActiveTab("econs-glossary")}
              className={`hover:text-[#0F2042] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeTab === "econs-glossary"
                  ? "text-[#0F2042] dark:text-[#38BDF8] border-b-2 border-[#0F2042] dark:border-[#38BDF8] font-semibold"
                  : ""
              }`}
            >
              0455 Glossary
            </button>
            <button
              onClick={() => setActiveTab("econs-branch")}
              className={`hover:text-[#0F2042] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeTab === "econs-branch"
                  ? "text-[#0F2042] dark:text-[#38BDF8] border-b-2 border-[#0F2042] dark:border-[#38BDF8] font-semibold"
                  : ""
              }`}
            >
              Branch Overview
            </button>
          </>
        )}
      </nav>

      {/* Zone 3: Actions (Theme Toggle + Switch Subject) */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onToggleTheme}
          aria-label="Toggle Dark Mode"
          className="p-2 rounded-lg border border-[#D6D3D1] dark:border-[#334155] bg-white dark:bg-[#162032] text-xs text-[#57534E] dark:text-[#94A3B8] hover:bg-[#F5F5F4] dark:hover:bg-[#1E293B] transition-colors"
          title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
        >
          {theme === "dark" ? "☀" : "🌙"}
        </button>

        <button
          onClick={onSwitchSubject}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#D6D3D1] dark:border-[#334155] bg-white dark:bg-[#162032] text-[#0F2042] dark:text-[#38BDF8] hover:bg-[#F5F5F4] dark:hover:bg-[#1E293B] transition-colors whitespace-nowrap shrink-0"
        >
          ⇄ Switch Subject
        </button>

        {isBusiness && submissionCount > 0 && (
          <button
            onClick={() => setActiveTab("progress")}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded-lg bg-[#0F2042] text-white dark:bg-[#38BDF8] dark:text-[#0F172A] transition-colors"
          >
            <span>Ledger</span>
            <span className="px-1 py-0.2 bg-white/20 dark:bg-black/20 rounded text-[10px]">
              {submissionCount}
            </span>
          </button>
        )}
      </div>
    </header>
  );
}

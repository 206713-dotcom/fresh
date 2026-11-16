"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  Printer,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { ONE_PAGE_SHEETS } from "../lib/data/one-page-sheets";
import { OnePageSheetBlockCard } from "./OnePageSheetBlock";

interface OnePageSheetsProps {
  initialSectionCode?: string;
  onBack: () => void;
}

function getBlockSearchText(block: (typeof ONE_PAGE_SHEETS)[number]["blocks"][number]) {
  return JSON.stringify(block).toLowerCase().replaceAll("**", "");
}

export function OnePageSheets({ initialSectionCode = "1", onBack }: OnePageSheetsProps) {
  const [activeCode, setActiveCode] = useState(initialSectionCode);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setActiveCode(initialSectionCode);
  }, [initialSectionCode]);

  const activeSheet = useMemo(
    () => ONE_PAGE_SHEETS.find((s) => s.code === activeCode) ?? ONE_PAGE_SHEETS[0],
    [activeCode]
  );

  const activeIndex = useMemo(
    () => ONE_PAGE_SHEETS.findIndex((s) => s.code === activeCode),
    [activeCode]
  );

  const prevSheet = activeIndex > 0 ? ONE_PAGE_SHEETS[activeIndex - 1] : null;
  const nextSheet =
    activeIndex < ONE_PAGE_SHEETS.length - 1 ? ONE_PAGE_SHEETS[activeIndex + 1] : null;

  const filteredBlocks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return activeSheet.blocks;
    return activeSheet.blocks.filter((block) =>
      getBlockSearchText(block).includes(query)
    );
  }, [activeSheet, searchQuery]);

  const visualCount = activeSheet.blocks.reduce(
    (total, block) => total + block.visuals.length,
    0
  );
  const ideaCount = activeSheet.blocks.reduce(
    (total, block) => total + block.points.length,
    0
  );
  const hasCharts = activeSheet.blocks.some((block) =>
    block.visuals.some((visual) => visual.kind === "chart")
  );

  const selectSection = (code: string) => {
    setActiveCode(code);
    setSearchQuery("");
  };

  return (
    <div className="one-page-sheet-root mx-auto w-full max-w-7xl px-3 py-6 transition-colors sm:px-4 sm:py-8">
      {/* ========================================================= */}
      {/* 1. BRAND HEADER & CONTROLS                                */}
      {/* ========================================================= */}
      <div className="sheet-chrome mb-4 space-y-2.5">
        <div className="rounded-xl border border-[var(--line)] bg-[var(--white)] p-3 shadow-xs dark:bg-neutral-900 sm:px-4 sm:py-3">
          <div className="flex flex-col justify-between gap-2.5 sm:flex-row sm:items-center">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-academic-serif text-xl font-bold leading-none tracking-tight text-[var(--green)] dark:text-white">
                    EcBiz
                  </span>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-wide text-[var(--sheet-ink-soft)]">
                    · Chapter Summary · Visual Revision Document
                  </span>
                </div>
                <span className="mt-0.5 font-mono text-[9px] text-[var(--muted)] dark:text-neutral-400">
                  Cambridge IGCSE&trade; Business 0264 / 0450
                </span>
              </div>

              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--paper)] px-2.5 py-1.5 text-[10px] font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--sheet-surface)] sm:hidden dark:bg-neutral-800 dark:text-neutral-200"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
            </div>

            <div className="flex w-full items-center gap-2 sm:w-auto">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--green)] px-2.5 py-1.5 text-[10px] font-semibold text-white transition-colors hover:opacity-90 dark:bg-[#e4eeb2] dark:text-[#203e32]"
                title="Print this chapter summary or save it as a PDF"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print summary</span>
              </button>
              <div className="relative flex-1 sm:w-56">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)] dark:text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search this sheet..."
                  aria-label="Search this summary sheet"
                  className="w-full rounded-lg border border-[var(--line)] bg-[var(--paper)] py-1.5 pl-8 pr-8 text-[10.5px] text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[#97532b] focus:outline-none dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-[var(--muted)] hover:text-[var(--ink)] dark:text-neutral-400 dark:hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={onBack}
                className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--white)] px-3 py-1.5 text-[10px] font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--sheet-surface)] dark:bg-neutral-900 dark:text-neutral-200 sm:inline-flex"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Sections</span>
              </button>

              <button
                type="button"
                onClick={onBack}
                aria-label="Close chapter summaries"
                title="Close (Esc)"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[var(--line)] bg-[var(--white)] text-[var(--muted)] transition-colors hover:bg-[var(--sheet-surface)] hover:text-[var(--ink)] dark:bg-neutral-900 dark:text-neutral-300 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Section navigation */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--white)] p-2 shadow-xs dark:bg-neutral-900">
          <div className="flex items-center justify-between px-1.5 pb-1.5">
            <span className="font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-[var(--muted)] dark:text-neutral-400">
              Six visual chapter summaries
            </span>
            <span className="hidden font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-[var(--muted)] dark:text-neutral-400 sm:inline">
              {activeSheet.blocks.length} sub-topics · {visualCount} diagrams
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {ONE_PAGE_SHEETS.map((sheet) => {
              const isActive = sheet.code === activeCode;
              return (
                <button
                  key={sheet.code}
                  type="button"
                  onClick={() => selectSection(sheet.code)}
                  aria-pressed={isActive}
                  className={`group relative overflow-hidden rounded-lg border px-2.5 py-1.5 text-left transition-all ${
                    isActive
                      ? "border-[var(--green)] bg-[var(--green)] text-white shadow-sm"
                      : "border-[var(--line)] bg-[var(--white)] text-[var(--ink)] hover:border-[var(--sheet-blush-line)] hover:bg-[var(--sheet-surface)] dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span
                      className={`font-mono text-[8px] font-bold uppercase tracking-[0.08em] ${
                        isActive
                          ? "text-[#e4eeb2]"
                          : "text-[var(--sheet-ink-soft)] dark:text-[#e7c9cf]"
                      }`}
                    >
                      Section {sheet.code}
                    </span>
                    <span
                      className={`font-mono text-[7.5px] font-bold ${
                        isActive
                          ? "text-[#e4eeb2]"
                          : "text-[var(--muted)] dark:text-neutral-400"
                      }`}
                    >
                      {sheet.blocks.length}
                    </span>
                  </div>
                  <span
                    className={`mt-0.5 line-clamp-1 block text-[10px] font-semibold leading-tight ${
                      isActive ? "text-white" : ""
                    }`}
                  >
                    {sheet.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. THE CHAPTER SUMMARY DOCUMENT                            */}
      {/* ========================================================= */}
      {filteredBlocks.length > 0 ? (
        <article className="chapter-summary-page screen-sheet-document mx-auto flex w-full flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--white)] shadow-xl dark:bg-[#111915]">
          {/* Masthead */}
          <header className="relative shrink-0 border-b-2 border-[var(--green)] bg-[var(--sheet-surface)] px-5 pb-3 pt-5 sm:px-7 dark:bg-neutral-900">
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[var(--green)] via-[var(--sheet-blush)] to-[var(--sheet-sage)]" />
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.12em]">
                  <span className="rounded bg-[var(--sheet-blush)] px-1.5 py-0.5 text-[var(--sheet-ink-soft)]">
                    EcBiz · Section {activeSheet.code} of 6
                  </span>
                  <span className="text-[var(--muted)] dark:text-neutral-400">
                    Cambridge IGCSE Business 0264 / 0450
                  </span>
                </div>
                <h1 className="mt-1 font-academic-serif text-xl font-bold leading-tight tracking-tight text-[var(--green)] dark:text-white sm:text-[26px]">
                  {activeSheet.title}
                </h1>
                <p className="mt-0.5 max-w-2xl text-[10.5px] leading-snug text-[var(--muted)] dark:text-neutral-300">
                  {activeSheet.strap}
                </p>
              </div>

              <div className="grid shrink-0 grid-cols-3 gap-1.5 sm:flex">
                <div className="min-w-[50px] rounded-md border border-[var(--sheet-blush-line)] bg-[var(--sheet-blush)] px-2 py-1 text-center">
                  <div className="font-academic-serif text-base font-bold leading-none tabular-nums text-[var(--green)] dark:text-[#e7c9cf]">
                    0{activeSheet.code}
                    <span className="text-[9.5px] opacity-70">/06</span>
                  </div>
                  <div className="mt-0.5 font-mono text-[6.5px] font-bold uppercase tracking-wide text-[var(--sheet-ink-soft)]">
                    Section
                  </div>
                </div>
                <div className="min-w-[50px] rounded-md border border-[var(--sheet-sand-line)] bg-[var(--sheet-sand)] px-2 py-1 text-center">
                  <div className="font-academic-serif text-base font-bold leading-none tabular-nums text-[var(--green)] dark:text-[#e0c58f]">
                    {visualCount}
                  </div>
                  <div className="mt-0.5 font-mono text-[6.5px] font-bold uppercase tracking-wide text-[#8a6a33] dark:text-[#e0c58f]">
                    Visuals
                  </div>
                </div>
                <div className="min-w-[50px] rounded-md border border-[var(--sheet-sage-line)] bg-[var(--sheet-sage)] px-2 py-1 text-center">
                  <div className="font-academic-serif text-base font-bold leading-none tabular-nums text-[var(--green)] dark:text-[#c9dfb2]">
                    {activeSheet.blocks.length}
                  </div>
                  <div className="mt-0.5 font-mono text-[6.5px] font-bold uppercase tracking-wide text-[#4f6b3a] dark:text-[#c9dfb2]">
                    Topics
                  </div>
                </div>
              </div>
            </div>

            {/* Color Key Bar */}
            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-dashed border-[var(--line)] pt-2 font-mono text-[7.5px] font-bold uppercase tracking-wide text-[var(--muted)] dark:text-neutral-400">
              <span className="inline-flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5 shrink-0 text-[#97532b]" />
                {hasCharts
                  ? "Interactive stages & pyramid tiers"
                  : "Visual formulas & exam comparisons"}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm border border-[var(--sheet-blush-line)] bg-[var(--sheet-blush)]" />
                Blush = topic header
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm border border-[var(--sheet-sand-line)] bg-[var(--sheet-sand)]" />
                Sand = concepts
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm border border-[var(--sheet-rose-line)] bg-[var(--sheet-rose)]" />
                Rose = risks
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm border border-[var(--sheet-sage-line)] bg-[var(--sheet-sage)]" />
                Sage = exam takeaway
              </span>
              <span className="ml-auto hidden font-mono text-[7.5px] text-[var(--muted)] sm:inline">
                Complete chapter coverage
              </span>
            </div>
          </header>

          {/* Body */}
          <div className="chapter-summary-body bg-[var(--white)] px-4 py-4 dark:bg-[#111915] sm:px-6 sm:py-5 lg:px-8">
            {searchQuery && (
              <div
                role="status"
                aria-live="polite"
                className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-[var(--line)] bg-[var(--sheet-surface)] px-3 py-1.5 text-[9.5px] text-[var(--muted)] dark:bg-neutral-900 dark:text-neutral-400"
              >
                <span>
                  {filteredBlocks.length} of {activeSheet.blocks.length} sub-topics
                  match &ldquo;{searchQuery}&rdquo;
                </span>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="font-semibold text-[#97532b] hover:underline dark:text-[#e6b39b]"
                >
                  Clear
                </button>
              </div>
            )}
            <div className="space-y-3">
              {filteredBlocks.map((block) => (
                <OnePageSheetBlockCard key={block.code} block={block} />
              ))}
            </div>
          </div>

          {/* Footer */}
          <footer className="flex shrink-0 flex-row items-center justify-between gap-2 border-t border-[var(--green)]/30 bg-[var(--sheet-surface)] px-5 py-2.5 font-mono text-[7.5px] text-[var(--muted)] dark:bg-neutral-900 dark:text-neutral-400 sm:px-7">
            <span className="truncate">
              EcBiz · Section {activeSheet.code} Chapter Summary · Cambridge IGCSE™ Business 0264 / 0450
            </span>
            <span className="inline-flex shrink-0 items-center gap-1.5">
              <Lightbulb className="h-3 w-3 text-[#97532b]" />
              <span className="hidden sm:inline">{ideaCount} key ideas · </span>
              Study &amp; revise
            </span>
          </footer>
        </article>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--sheet-surface)] px-5 py-10 text-center dark:bg-neutral-900">
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[var(--sheet-sage)] text-[var(--green)] dark:text-[#dce9c8]">
            <Search className="h-4 w-4" />
          </div>
          <p className="mt-2 text-xs font-semibold text-[var(--ink)] dark:text-white">
            No sub-topics matched &ldquo;{searchQuery}&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="mt-2 text-[10px] font-semibold text-[#97532b] hover:underline dark:text-[#e6b39b]"
          >
            Clear search filter
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. PAGER                                                  */}
      {/* ========================================================= */}
      <div className="sheet-chrome mt-5 flex items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
        {prevSheet ? (
          <button
            type="button"
            onClick={() => selectSection(prevSheet.code)}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--white)] px-3 py-2 text-left text-[10px] font-semibold text-[var(--ink)] shadow-xs transition-colors hover:bg-[var(--sheet-surface)] dark:bg-neutral-900 dark:text-neutral-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>
              <span className="block font-mono text-[7.5px] font-bold uppercase tracking-wide text-[var(--muted)]">
                Previous
              </span>
              Section {prevSheet.code}: {prevSheet.title}
            </span>
          </button>
        ) : (
          <div />
        )}

        {nextSheet ? (
          <button
            type="button"
            onClick={() => selectSection(nextSheet.code)}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--white)] px-3 py-2 text-right text-[10px] font-semibold text-[var(--ink)] shadow-xs transition-colors hover:bg-[var(--sheet-surface)] dark:bg-neutral-900 dark:text-neutral-200"
          >
            <span>
              <span className="block font-mono text-[7.5px] font-bold uppercase tracking-wide text-[var(--muted)]">
                Next
              </span>
              Section {nextSheet.code}: {nextSheet.title}
            </span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

export { OnePageSheets as OnePageSummary };
export default OnePageSheets;

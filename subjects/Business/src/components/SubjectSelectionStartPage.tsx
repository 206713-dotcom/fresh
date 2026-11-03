import React from "react";
import { QUIZLET_FOLDER_URL } from "../lib/data/glossary";

interface SubjectSelectionStartPageProps {
  onSelectBusiness: () => void;
  onSelectEcons: () => void;
  onOpenBusinessGlossary: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function SubjectSelectionStartPage({
  onSelectBusiness,
  onSelectEcons,
  onOpenBusinessGlossary,
  theme,
  onToggleTheme,
}: SubjectSelectionStartPageProps) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0C1322] text-[#1C1917] dark:text-[#E2E8F0] transition-colors">
      {/* Top Banner with Dark Mode Toggle */}
      <div className="border-b border-[#E7E5E4] dark:border-[#1E293B] px-6 lg:px-12 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="font-academic-serif text-xl font-bold tracking-tight text-[#0F2042] dark:text-[#F1F5F9]">
            EcBiz Study
          </span>
          <span className="text-xs font-mono text-[#78716C] dark:text-[#94A3B8] border-l border-[#D6D3D1] dark:border-[#334155] pl-2.5">
            CIE Assessment Gateway
          </span>
        </div>

        <button
          onClick={onToggleTheme}
          aria-label="Toggle Dark Mode"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D6D3D1] dark:border-[#334155] bg-white dark:bg-[#162032] text-xs font-medium text-[#44403C] dark:text-[#E2E8F0] hover:bg-[#F5F5F4] dark:hover:bg-[#1E293B] transition-colors"
        >
          {theme === "dark" ? (
            <>
              <span>☀ Light Theme</span>
            </>
          ) : (
            <>
              <span>🌙 Dark Theme</span>
            </>
          )}
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
        {/* Editorial Headline */}
        <div className="max-w-3xl mb-12">
          <p className="text-xs uppercase tracking-wider font-semibold text-[#8B1E1E] dark:text-[#F87171] mb-2">
            Cambridge Assessment International Education · Practice Gateway
          </p>
          <h1 className="font-academic-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#0F2042] dark:text-[#F1F5F9] leading-[1.15] mb-4">
            Select Your Cambridge Discipline
          </h1>
          <p className="text-base sm:text-lg text-[#57534E] dark:text-[#94A3B8] leading-relaxed">
            Choose between Business Studies and Economics to access dedicated mark-tier studios, syllabus glossaries, two-pass rubric evaluation, and interactive economic simulations.
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#78716C] dark:text-[#94A3B8] mt-4 font-mono">
            <span>$0 Server Cost</span>
            <span aria-hidden="true">·</span>
            <span>Permanent Local Cookies</span>
            <span aria-hidden="true">·</span>
            <span>No Login or Verification Required</span>
            <span aria-hidden="true">·</span>
            <span>Dark Theme Supported</span>
          </div>
        </div>

        {/* Two Dedicated Subject Portals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Option A: Business Studies (0264 / 0450) */}
          <div className="bg-white dark:bg-[#162032] border-2 border-[#0F2042] dark:border-[#38BDF8] rounded-2xl p-8 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0F172A] px-3.5 py-1 text-[11px] font-mono tracking-wide rounded-bl-lg font-bold">
              SYLLABUS 0264 / 0450
            </div>

            <div>
              <div className="text-xs font-mono text-[#0F2042] dark:text-[#38BDF8] uppercase tracking-wider mb-2 font-semibold">
                Cambridge IGCSE & O Level
              </div>
              <h2 className="font-academic-serif text-3xl font-bold text-[#0F2042] dark:text-[#F1F5F9] mb-3">
                Business Studies
              </h2>
              <p className="text-sm text-[#57534E] dark:text-[#94A3B8] leading-relaxed mb-6">
                Comprehensive examination environment with 10 two-pass AI blueprints, 189 verified past paper questions, official 2027 specimen papers, and the complete 0264 textbook glossary.
              </p>

              <div className="space-y-2.5 text-xs text-[#44403C] dark:text-[#CBD5E1] mb-8">
                <div className="flex items-start gap-2">
                  <span className="font-mono text-[#0F2042] dark:text-[#38BDF8] font-bold">✓</span>
                  <span><strong>Mark Tiers:</strong> 2, 4, 6, 8 (Paper 1 & 2), and 12-mark case evaluations</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-[#0F2042] dark:text-[#38BDF8] font-bold">✓</span>
                  <span><strong>Two-Pass AI Engine:</strong> Dynamic CIE scenarios + instant AO1–AO4 marking</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-[#0F2042] dark:text-[#38BDF8] font-bold">✓</span>
                  <span><strong>0264 Glossary:</strong> Complete definitions + Jayden_TAN53 Quizlet folder</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E7E5E4] dark:border-[#1E293B] flex flex-col sm:flex-row gap-3">
              <button
                onClick={onSelectBusiness}
                className="flex-1 bg-[#0F2042] hover:bg-[#1E3A8A] text-white font-semibold text-sm py-3 px-5 rounded-xl transition-colors text-center"
              >
                Enter Business Studies →
              </button>
              <button
                onClick={onOpenBusinessGlossary}
                className="bg-[#F5F5F4] dark:bg-[#1E293B] hover:bg-[#E7E5E4] dark:hover:bg-[#334155] text-[#1C1917] dark:text-[#F1F5F9] font-semibold text-sm py-3 px-5 rounded-xl transition-colors text-center"
              >
                0264 Glossary
              </button>
            </div>
          </div>

          {/* Option B: Economics (0455 / 2281) */}
          <div className="bg-white dark:bg-[#162032] border border-[#D6D3D1] dark:border-[#334155] rounded-2xl p-8 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-[#0F2042] dark:hover:border-[#38BDF8] hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 bg-[#E7E5E4] dark:bg-[#1E293B] text-[#57534E] dark:text-[#94A3B8] px-3.5 py-1 text-[11px] font-mono tracking-wide rounded-bl-lg font-bold">
              SYLLABUS 0455 / 2281
            </div>

            <div>
              <div className="text-xs font-mono text-[#78716C] dark:text-[#94A3B8] uppercase tracking-wider mb-2 font-semibold">
                Cambridge IGCSE & O Level
              </div>
              <h2 className="font-academic-serif text-3xl font-bold text-[#1C1917] dark:text-[#F1F5F9] mb-3">
                Economics
              </h2>
              <p className="text-sm text-[#57534E] dark:text-[#94A3B8] leading-relaxed mb-6">
                Dedicated workspace for micro and macroeconomic analysis, supply & demand curve shift diagrams, price elasticity calculations, and government policy evaluation essays.
              </p>

              <div className="space-y-2.5 text-xs text-[#44403C] dark:text-[#CBD5E1] mb-8">
                <div className="flex items-start gap-2">
                  <span className="font-mono text-[#2563EB] dark:text-[#60A5FA] font-bold">·</span>
                  <span><strong>Interactive Diagrams:</strong> Real-time supply & demand equilibrium simulator</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-[#2563EB] dark:text-[#60A5FA] font-bold">·</span>
                  <span><strong>Question Blueprints:</strong> 2, 4, 6, and 8-mark structured economics questions</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-[#2563EB] dark:text-[#60A5FA] font-bold">·</span>
                  <span><strong>0455 Vocabulary:</strong> PED formulas, PPC, macro policies, and trade balance</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E7E5E4] dark:border-[#1E293B]">
              <button
                onClick={onSelectEcons}
                className="w-full bg-[#FAF9F6] dark:bg-[#0F172A] hover:bg-[#F5F5F4] dark:hover:bg-[#1E293B] text-[#0F2042] dark:text-[#38BDF8] border border-[#D6D3D1] dark:border-[#334155] font-semibold text-sm py-3 px-5 rounded-xl transition-colors text-center"
              >
                Enter Economics →
              </button>
            </div>
          </div>
        </div>



        {/* Resources & Quizlet Strip */}
        <div className="border-t border-[#E7E5E4] dark:border-[#1E293B] pt-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white dark:bg-[#162032] border border-[#E7E5E4] dark:border-[#1E293B] rounded-xl shadow-sm">
            <div>
              <span className="text-xs font-mono font-bold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider block mb-1">
                Official Quizlet Integration
              </span>
              <p className="text-xs sm:text-sm text-[#1C1917] dark:text-[#E2E8F0]">
                Access Jayden_TAN53's official digital flashcards for Cambridge Business Studies 0264.
              </p>
            </div>
            <a
              href={QUIZLET_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs py-2.5 px-5 rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <span>Open Quizlet 0264 Folders</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

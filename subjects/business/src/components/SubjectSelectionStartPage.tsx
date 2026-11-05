import React from "react";
import { SyllabusRevisionChecklist } from "./SyllabusRevisionChecklist";
import { DailyWeeklyChallenge } from "./DailyWeeklyChallenge";

interface SubjectSelectionStartPageProps {
  onSelectBusiness: () => void;
  onSelectEcons: () => void;
  onOpenBusinessGlossary: () => void;
  onSelectOfficialPastPapers?: () => void;
  onSelectPaper2?: () => void;
  onSelectEconsDiagrams?: () => void;
  onSelectEconsGlossary?: () => void;
  onSelectEconsBranch?: () => void;
  onSelectBusinessSection?: (sectionCode: string, topicCode?: string) => void;
  onSelectEconsSection?: (sectionCode: string, topicCode?: string) => void;
  onOpenFinanceExam?: () => void;
  onOpenStudySpace?: () => void;
  onOpenAvatarCustomizer?: () => void;
  onOpenAchievements?: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function SubjectSelectionStartPage({
  onSelectBusiness,
  onSelectEcons,
  onOpenBusinessGlossary,
  onSelectEconsGlossary,
  onSelectEconsDiagrams,
  onSelectBusinessSection,
  onSelectEconsSection,
  theme,
  onToggleTheme,
  onOpenStudySpace,
  onOpenAvatarCustomizer,
  onOpenAchievements,
}: SubjectSelectionStartPageProps) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-black text-[#1C1917] dark:text-neutral-100 transition-colors flex flex-col justify-between">
      {/* Top Banner Navigation: Compact, responsive, fits on all screen sizes */}
      <header className="border-b border-[#E7E5E4] dark:border-neutral-800 bg-[#FAF9F6]/95 dark:bg-black/95 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#0F2042] dark:text-white">
              EcBiz Study
            </span>
            <span className="text-[11px] font-mono text-[#78716C] dark:text-neutral-400 border-l border-[#D6D3D1] dark:border-neutral-700 pl-2 hidden sm:inline">
              Cambridge 0264 · 0455
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAchievements && (
              <button
                type="button"
                onClick={onOpenAchievements}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold transition active:scale-95 cursor-pointer"
                title="View Achievements & Claim Bonus Coins"
              >
                <span>🏆</span>
                <span className="hidden md:inline">Achievements</span>
              </button>
            )}

            {onOpenAvatarCustomizer && (
              <button
                type="button"
                onClick={onOpenAvatarCustomizer}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition active:scale-95 cursor-pointer"
                title="Customise Scholar Avatar"
              >
                <span>🎨</span>
                <span className="hidden md:inline">Avatar</span>
              </button>
            )}

            {onOpenStudySpace && (
              <button
                type="button"
                onClick={onOpenStudySpace}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0F2042] dark:bg-neutral-800 hover:bg-[#1E3A8A] text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
                title="Open Study Space with Lo-Fi & Pomodoro"
              >
                <span>🎧</span>
                <span>Study Space</span>
              </button>
            )}

            <a
              href="https://forms.gle/6X2CAR1LkSQGRBx68"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-medium text-[#44403C] dark:text-neutral-200 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 transition"
              title="Report a bug or suggest an improvement"
            >
              <span className="text-amber-600 dark:text-amber-400">💡</span>
              <span className="hidden md:inline">Feedback</span>
              <span className="text-[10px] opacity-70">↗</span>
            </a>

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label="Toggle Dark Mode"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-medium text-[#44403C] dark:text-neutral-200 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 transition cursor-pointer"
            >
              {theme === "dark" ? <span>☀ Light</span> : <span>🌙 Dark</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Main Start Screen Container: Compact and responsive */}
      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col justify-start">
        {/* Compact Editorial Subheader */}
        <div className="text-center max-w-lg mx-auto mb-5">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-neutral-300 text-[10px] font-mono font-semibold uppercase tracking-wider mb-1.5">
            <span>●</span>
            <span>CIE Cambridge Assessment Platform</span>
          </div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#0F2042] dark:text-white mb-1">
            Select Your Examination Subject
          </h1>
          <p className="text-xs text-[#57534E] dark:text-neutral-400">
            Practice with 80 verified Paper 1 case studies, Senior Examiner AI, and 0264 syllabus checklists.
          </p>
        </div>

        {/* Two-Column Grid: Business Studies on the Left, Economics on the Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch mb-6">
          {/* ========================================================= */}
          {/* LEFT CARD: BUSINESS STUDIES                               */}
          {/* ========================================================= */}
          <div className="flex flex-col justify-between bg-white dark:bg-neutral-900 border-2 border-[#0F2042] dark:border-white rounded-xl p-5 shadow-xs">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-[#0F2042] text-white dark:bg-white dark:text-black text-[10px] font-mono font-bold uppercase tracking-wider">
                  CIE Cambridge 0264 / 0450
                </span>
                <span className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Suite
                </span>
              </div>

              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#0F2042] dark:text-white mb-1">
                Business Studies
              </h2>
              <p className="text-xs text-[#57534E] dark:text-neutral-400 leading-relaxed mb-3">
                80 authentic case scenarios across Sections 1 to 4 with 320 verified prompts and Senior Examiner AI evaluation.
              </p>

              <div className="space-y-1 mb-4 text-xs text-[#334155] dark:text-neutral-300">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span><strong>80 Case Scenarios:</strong> Complete stems with parts (a) to (d)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span><strong>Strict Mark Scheme:</strong> AO2 keyword scan &amp; AO4 evaluation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span><strong>Senior Examiner AI:</strong> Instant formative feedback</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-3 border-t border-[#E7E5E4] dark:border-neutral-800">
              <button
                type="button"
                onClick={onSelectBusiness}
                className="w-full py-2 px-4 rounded-lg bg-[#0F2042] dark:bg-white text-white dark:text-black font-semibold text-xs shadow-xs hover:bg-[#1E3A8A] dark:hover:bg-neutral-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Enter Business Studies Studio</span>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={onOpenBusinessGlossary}
                className="w-full py-2 px-4 rounded-lg bg-[#FAF9F6] dark:bg-black border border-slate-300 dark:border-neutral-700 text-[#0F2042] dark:text-white text-xs font-semibold hover:border-[#0F2042] dark:hover:border-white transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>📖 0264 Syllabus Glossary &amp; Definitions</span>
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT CARD: ECONOMICS                                     */}
          {/* ========================================================= */}
          <div className="flex flex-col justify-between bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 rounded-xl p-5 shadow-xs">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                  CIE Cambridge 0455 / 2281
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-neutral-400">
                  Reference Suite
                </span>
              </div>

              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#0F2042] dark:text-white mb-1">
                Economics
              </h2>
              <p className="text-xs text-[#57534E] dark:text-neutral-400 leading-relaxed mb-3">
                Cambridge 0455 Economics syllabus modules, interactive diagram curves, formulas, and past paper tools.
              </p>

              <div className="space-y-1 mb-4 text-xs text-[#334155] dark:text-neutral-300">
                <div className="flex items-center gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
                  <span><strong>Microeconomics:</strong> PPC, demand, supply, equilibrium</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
                  <span><strong>Macroeconomics:</strong> Inflation, growth, trade, monetary policy</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
                  <span><strong>Diagrams:</strong> Interactive shiftable curves &amp; blueprints</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-3 border-t border-[#E7E5E4] dark:border-neutral-800">
              <button
                type="button"
                onClick={onSelectEcons}
                className="w-full py-2 px-4 rounded-lg bg-[#0F2042] dark:bg-white text-white dark:text-black font-semibold text-xs shadow-xs hover:bg-[#1E3A8A] dark:hover:bg-neutral-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Enter Economics Studio</span>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={onSelectEconsDiagrams || onSelectEcons}
                className="w-full py-2 px-4 rounded-lg bg-[#FAF9F6] dark:bg-black border border-slate-300 dark:border-neutral-700 text-[#0F2042] dark:text-white text-xs font-semibold hover:border-[#0F2042] dark:hover:border-white transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>📈 Interactive Economic Diagrams &amp; Curves</span>
              </button>
            </div>
          </div>
        </div>

        {/* Daily & Weekly Challenge Module */}
        <div className="mb-6">
          <DailyWeeklyChallenge
            onOpenStudySpace={onOpenStudySpace}
            onNavigateToPractice={onSelectBusiness}
          />
        </div>

        {/* Interactive Syllabus Revision Checklist */}
        <div id="syllabus-checklist-section" className="mb-6">
          <SyllabusRevisionChecklist
            onSelectTopicForPractice={(subject, secCode, topCode) => {
              if (subject === "business" && onSelectBusinessSection) {
                onSelectBusinessSection(secCode, topCode);
              } else if (subject === "econs" && onSelectEconsSection) {
                onSelectEconsSection(secCode, topCode);
              } else {
                if (subject === "business") {
                  onSelectBusiness();
                } else {
                  onSelectEcons();
                }
              }
            }}
          />
        </div>

        {/* Compact Footer */}
        <div className="pt-3 border-t border-[#E7E5E4] dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#78716C] dark:text-neutral-500">
          <div>EcBiz Study · CIE Cambridge 0264 Business Studies &amp; 0455 Economics</div>
          <a
            href="https://forms.gle/6X2CAR1LkSQGRBx68"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0F2042] dark:text-[#38BDF8] hover:underline font-medium inline-flex items-center gap-1"
          >
            <span>💡 Report Bug or Suggestion</span>
            <span className="text-[10px]">↗</span>
          </a>
        </div>
      </main>
    </div>
  );
}

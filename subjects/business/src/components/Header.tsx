"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Menu,
  X,
  BookOpen,
  Sparkles,
  FileText,
  BarChart3,
  Layers,
  HelpCircle,
  Sun,
  Moon,
  CheckSquare,
  Swords,
  Palette,
  Trophy,
  Cpu,
  ExternalLink,
} from "lucide-react";
import { getStudyCoins } from "../lib/cookies";

interface HeaderProps {
  currentSubject?: "business";
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onSwitchSubject?: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  submissionCount: number;
  onOpenStudySpace?: () => void;
  onOpenAvatarCustomizer?: () => void;
  onOpenAchievements?: () => void;
}

export function Header({
  activeTab,
  setActiveTab,
  theme,
  onToggleTheme,
  submissionCount,
  onOpenStudySpace,
  onOpenAvatarCustomizer,
  onOpenAchievements,
}: HeaderProps) {
  // Dropdown open states for desktop & mobile
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Live coins balance across all activities
  const [studyCoins, setStudyCoins] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return getStudyCoins();
    }
    return 100;
  });

  useEffect(() => {
    const handleCoinsChange = () => {
      setStudyCoins(getStudyCoins());
    };
    window.addEventListener("ecbiz_coins_updated", handleCoinsChange);
    return () => window.removeEventListener("ecbiz_coins_updated", handleCoinsChange);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = (menuName: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenDropdown(menuName);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const handleToggleClick = (menuName: string) => {
    setOpenDropdown((prev) => (prev === menuName ? null : menuName));
  };

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };

  const handleStudySpaceClick = () => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    if (onOpenStudySpace) {
      onOpenStudySpace();
    }
  };

  const isQuestionsActive = ["practice", "paper2", "quick-quiz"].includes(activeTab);
  const isResourcesActive = ["glossary", "archive", "progress"].includes(activeTab);
  const freshHubHref =
    typeof window !== "undefined" && /Business\.html$/i.test(window.location.pathname)
      ? "../index.html#subjects"
      : "../../index.html#subjects";

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 dark:bg-black/95 backdrop-blur-md border-b border-[#E7E5E4] dark:border-neutral-800 px-4 sm:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* ========================================================= */}
        {/* ZONE 1: BRAND / WORDMARK */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href={freshHubHref}
            title="Return to Fresh"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#0F2042] dark:text-neutral-200 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 transition-colors"
          >
            <span aria-hidden="true">←</span>
            <span className="hidden sm:inline">Fresh</span>
          </a>
          <button
            onClick={() => handleSelectTab("practice")}
            title="EcBiz"
            className="text-left group flex items-center gap-2 focus:outline-none cursor-pointer"
          >
            <span className="font-academic-serif text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[#0F2042] dark:text-white whitespace-nowrap">
              EcBiz
            </span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* ZONE 2: DESKTOP NAVIGATION BAR */}
        {/* ========================================================= */}
        <nav
          ref={navRef}
          className="hidden md:flex items-center gap-1.5 lg:gap-2.5 text-xs sm:text-sm font-medium"
        >
          {/* DROPDOWN 1: Questions (Topical Questions, Paper 2, Quick Quiz) */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("questions")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => handleToggleClick("questions")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                isQuestionsActive
                  ? "bg-[#0F2042] text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                  : "text-[#57534E] dark:text-neutral-300 hover:text-[#0F2042] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Questions</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openDropdown === "questions" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown === "questions" && (
              <div className="absolute top-full left-0 mt-1 w-64 p-2 rounded-2xl bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-700 shadow-xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => handleSelectTab("practice")}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-start gap-2.5 transition cursor-pointer ${
                    activeTab === "practice"
                      ? "bg-[#0F2042] text-white dark:bg-white dark:text-black font-semibold"
                      : "text-[#1C1917] dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  <Layers className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />
                  <div>
                    <div className="text-xs font-bold">Topical Questions</div>
                    <div className="text-[10px] opacity-75">Paper 1 · 1–40 sets (Sections 1–6)</div>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectTab("paper2")}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-start gap-2.5 transition cursor-pointer mt-1 ${
                    activeTab === "paper2"
                      ? "bg-purple-700 text-white font-semibold"
                      : "text-[#1C1917] dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  <FileText className="w-4 h-4 mt-0.5 shrink-0 text-purple-600 dark:text-purple-400" />
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <span>Paper 2 Practice</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-mono">
                        Sets 1–100
                      </span>
                    </div>
                    <div className="text-[10px] opacity-75">Case studies with Appendices 1–3</div>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectTab("quick-quiz")}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-start gap-2.5 transition cursor-pointer mt-1 text-[#8B1E1E] dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 ${
                    activeTab === "quick-quiz" ? "bg-rose-50 dark:bg-rose-950/50 font-semibold" : ""
                  }`}
                >
                  <Sparkles className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">⚡ Daily Challenge & Quick Quiz</div>
                    <div className="text-[10px] opacity-80">1-min timed active recall drill</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* TAB 3: Syllabus Sections Overview */}
          <button
            type="button"
            onClick={() => handleSelectTab("sections")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer text-xs sm:text-sm font-medium ${
              activeTab === "sections"
                ? "bg-[#0F2042] text-white dark:bg-white dark:text-black shadow-xs"
                : "text-[#57534E] dark:text-neutral-300 hover:text-[#0F2042] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Sections (1–6)</span>
          </button>

          {/* TAB 4: 0264 Syllabus Checklist */}
          <button
            type="button"
            onClick={() => handleSelectTab("checklist")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer text-xs sm:text-sm font-medium ${
              activeTab === "checklist"
                ? "bg-[#0F2042] text-white dark:bg-white dark:text-black shadow-xs"
                : "text-[#57534E] dark:text-neutral-300 hover:text-[#0F2042] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Checklist</span>
          </button>

          {/* TAB 5: 2D Boss Battle Fighting Game */}
          <button
            type="button"
            onClick={() => handleSelectTab("boss-battle")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer text-xs sm:text-sm font-semibold ${
              activeTab === "boss-battle"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Boss Battle ⚔️</span>
          </button>

          {/* DROPDOWN: Resources & Archive */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("resources")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => handleToggleClick("resources")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                isResourcesActive
                  ? "bg-[#0F2042]/10 dark:bg-white/10 text-[#0F2042] dark:text-white font-semibold"
                  : "text-[#57534E] dark:text-neutral-300 hover:text-[#0F2042] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <span>Resources</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openDropdown === "resources" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown === "resources" && (
              <div className="absolute top-full right-0 mt-1 w-60 p-2 rounded-2xl bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-700 shadow-xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => handleSelectTab("glossary")}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-start gap-2.5 transition cursor-pointer ${
                    activeTab === "glossary"
                      ? "bg-[#0F2042] text-white dark:bg-white dark:text-black font-semibold"
                      : "text-[#1C1917] dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  <BookOpen className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />
                  <div>
                    <div className="text-xs font-semibold">0264 Glossary</div>
                    <div className="text-[10px] opacity-70">Cambridge syllabus definitions</div>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectTab("archive")}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-start gap-2.5 transition cursor-pointer mt-1 ${
                    activeTab === "archive"
                      ? "bg-[#0F2042] text-white dark:bg-white dark:text-black font-semibold"
                      : "text-[#1C1917] dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  <FileText className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />
                  <div>
                    <div className="text-xs font-semibold">Past Papers & Archive</div>
                    <div className="text-[10px] opacity-70">Official Cambridge past exams</div>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectTab("progress")}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-start gap-2.5 transition cursor-pointer mt-1 ${
                    activeTab === "progress"
                      ? "bg-[#0F2042] text-white dark:bg-white dark:text-black font-semibold"
                      : "text-[#1C1917] dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  <BarChart3 className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />
                  <div>
                    <div className="text-xs font-semibold">Progress Ledger</div>
                    <div className="text-[10px] opacity-70">{submissionCount} evaluated answers</div>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectTab("quick-quiz")}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-start gap-2.5 transition cursor-pointer mt-1 text-[#8B1E1E] dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 ${
                    activeTab === "quick-quiz" ? "bg-rose-50 dark:bg-rose-950/50 font-semibold" : ""
                  }`}
                >
                  <Sparkles className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold">⚡ Daily Challenge</div>
                    <div className="text-[10px] opacity-80">1-min timed recall drill</div>
                  </div>
                </button>

                {/* Bug / Suggestion Link in Resources */}
                <a
                  href="https://forms.gle/6X2CAR1LkSQGRBx68"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-left px-3 py-2 rounded-xl flex items-start gap-2.5 transition cursor-pointer mt-1 text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 border-t border-neutral-100 dark:border-neutral-800 pt-2"
                >
                  <span className="text-sm mt-0.5 shrink-0">💡</span>
                  <div>
                    <div className="text-xs font-semibold flex items-center gap-1">
                      <span>Bug / Suggestion</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </div>
                    <div className="text-[10px] opacity-75">Send feedback or report an issue ↗</div>
                  </div>
                </a>
              </div>
            )}
          </div>
        </nav>

        {/* ========================================================= */}
        {/* ZONE 3: ACTIONS & UTILITIES */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2">
          {/* Bug / Suggestion Button at Top */}
          <a
            href="https://forms.gle/6X2CAR1LkSQGRBx68"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700/80 bg-amber-50/90 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-2xs group cursor-pointer"
            title="Report a bug or suggest an improvement (Google Forms)"
          >
            <span className="text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">💡</span>
            <span className="hidden sm:inline">Bug / Suggestion</span>
            <span className="sm:hidden">Bug</span>
            <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
          </a>

          {/* Study Coins Pill */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100/70 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 font-mono text-xs font-bold shadow-2xs"
            title="Earn coins by completing Topical and Paper 2 questions"
          >
            <span>🪙</span>
            <span>{studyCoins}</span>
          </div>

          {/* Study Space Floating Trigger */}
          {onOpenStudySpace && (
            <button
              onClick={handleStudySpaceClick}
              className="px-2.5 py-1.5 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-[#57534E] dark:text-neutral-300 transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              title="Open Focus Realm & Ambient Sounds"
            >
              <span>🎧</span>
              <span className="hidden sm:inline">Study Space</span>
            </button>
          )}

          {/* Scholar Wardrobe Modal */}
          {onOpenAvatarCustomizer && (
            <button
              onClick={onOpenAvatarCustomizer}
              className="p-1.5 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-[#57534E] dark:text-neutral-300 transition-colors cursor-pointer"
              title="Scholar Avatar & Costumes"
            >
              <Palette className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </button>
          )}

          {/* Achievements Modal */}
          {onOpenAchievements && (
            <button
              onClick={onOpenAchievements}
              className="p-1.5 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-[#57534E] dark:text-neutral-300 transition-colors cursor-pointer"
              title="Milestones & Achievements"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
            </button>
          )}

          {/* Light/Dark Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-[#57534E] dark:text-neutral-300 transition-colors cursor-pointer"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#1C1917] dark:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE EXPANDED MENU                                     */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-[#E7E5E4] dark:border-neutral-800 space-y-1.5">
          <a
            href={freshHubHref}
            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border border-[#D6D3D1] dark:border-neutral-700 text-[#0F2042] dark:text-neutral-200"
          >
            <span aria-hidden="true">←</span>
            <span>Fresh</span>
          </a>
          {/* Bug / Suggestion Link in Mobile Menu */}
          <a
            href="https://forms.gle/6X2CAR1LkSQGRBx68"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 shadow-2xs mb-2 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className="text-sm">💡</span>
              <span>Report Bug / Suggestion</span>
            </span>
            <span className="text-[10px] opacity-75 font-mono flex items-center gap-1">
              <span>Feedback ↗</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </a>

          {/* Questions Group */}
          <div className="px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400">
            Questions
          </div>
          <button
            onClick={() => handleSelectTab("practice")}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between ${
              activeTab === "practice"
                ? "bg-[#0F2042] text-white"
                : "text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <span>Topical Questions (Paper 1 · 1–40 sets)</span>
            <span className="text-[10px] opacity-75 font-mono">Sec 1–6</span>
          </button>

          <button
            onClick={() => handleSelectTab("paper2")}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between ${
              activeTab === "paper2"
                ? "bg-purple-700 text-white"
                : "text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30"
            }`}
          >
            <span>Paper 2 Practice</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-mono">
              Sets 1–100
            </span>
          </button>

          <button
            onClick={() => handleSelectTab("quick-quiz")}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 ${
              activeTab === "quick-quiz" ? "bg-rose-50 dark:bg-rose-950/40" : ""
            }`}
          >
            ⚡ Daily Challenge & Quick Quiz
          </button>

          <div className="pt-2 border-t border-[#E7E5E4] dark:border-neutral-800"></div>

          <button
            onClick={() => handleSelectTab("sections")}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
              activeTab === "sections"
                ? "bg-[#0F2042] text-white"
                : "text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            Sections & Chapters (1–6)
          </button>

          <button
            onClick={() => handleSelectTab("checklist")}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
              activeTab === "checklist"
                ? "bg-[#0F2042] text-white"
                : "text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            0264 Syllabus Checklist
          </button>

          <button
            onClick={() => handleSelectTab("boss-battle")}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-rose-600 ${
              activeTab === "boss-battle" ? "bg-rose-50" : ""
            }`}
          >
            Boss Battle Arena ⚔️
          </button>

          <button
            onClick={() => handleSelectTab("glossary")}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
              activeTab === "glossary"
                ? "bg-[#0F2042] text-white"
                : "text-neutral-800 dark:text-neutral-200"
            }`}
          >
            0264 Glossary
          </button>

          <button
            onClick={() => handleSelectTab("archive")}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
              activeTab === "archive"
                ? "bg-[#0F2042] text-white"
                : "text-neutral-800 dark:text-neutral-200"
            }`}
          >
            Past Papers Archive
          </button>

          <button
            onClick={() => handleSelectTab("progress")}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
              activeTab === "progress"
                ? "bg-[#0F2042] text-white"
                : "text-neutral-800 dark:text-neutral-200"
            }`}
          >
            Progress Ledger ({submissionCount})
          </button>
        </div>
      )}
    </header>
  );
}

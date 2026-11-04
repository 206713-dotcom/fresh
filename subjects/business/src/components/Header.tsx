"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Menu,
  X,
  Headphones,
  BookOpen,
  Sparkles,
  FileText,
  BarChart3,
  Layers,
  HelpCircle,
  Sun,
  Moon,
  ExternalLink,
  ArrowLeftRight,
  CheckSquare,
  Swords,
  Palette,
  Trophy,
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

  // Handle desktop hover with a slight grace delay so mouse movement between trigger and menu is seamless
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

  // Toggle on click (essential for mobile & touch devices)
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

  // Check if active tab belongs to a category
  const isPracticeActive = ["practice", "quick-quiz", "sections"].includes(activeTab);
  const isResourcesActive = ["glossary", "archive", "progress"].includes(activeTab);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 dark:bg-black/95 backdrop-blur-md border-b border-[#E7E5E4] dark:border-neutral-800 px-4 sm:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* ========================================================= */}
        {/* ZONE 1: BRAND / WORDMARK & FRESH HUB LINK */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="../index.html#subjects"
            title="Return to Fresh IGCSE Hub (All 12 Subjects)"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#0F2042] dark:text-neutral-200 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 transition-colors shadow-xs"
          >
            <span aria-hidden="true">←</span>
            <span>Fresh Hub</span>
          </a>
          <div className="flex items-center gap-2">
            <span className="font-academic-serif text-base sm:text-lg md:text-xl font-bold tracking-tight text-[#0F2042] dark:text-white whitespace-nowrap">
              EcBiz · Business
            </span>
            <span className="text-[11px] font-mono text-[#78716C] dark:text-neutral-400 border-l border-[#D6D3D1] dark:border-neutral-700 pl-2 hidden sm:inline">
              0264 / 0450
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ZONE 2: DESKTOP DROPDOWN NAVIGATION BAR */}
        {/* ========================================================= */}
        <nav
          ref={navRef}
          className="hidden md:flex items-center gap-2 lg:gap-3 text-xs sm:text-sm font-medium"
        >
          {/* DROPDOWN 1: Practice & Questions */}
          <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("practice")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => handleToggleClick("practice")}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isPracticeActive
                      ? "bg-[#0F2042]/10 dark:bg-white/10 text-[#0F2042] dark:text-white font-semibold"
                      : "text-[#57534E] dark:text-neutral-300 hover:text-[#0F2042] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <span>Practice & Drills</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      openDropdown === "practice" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {openDropdown === "practice" && (
                  <div className="absolute top-full left-0 mt-1 w-60 p-2 rounded-2xl bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-700 shadow-xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
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
                        <div className="text-xs font-semibold">Practice Studio</div>
                        <div className="text-[10px] opacity-70">Topical database & case studies</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSelectTab("quick-quiz")}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-start gap-2.5 transition cursor-pointer mt-1 ${
                        activeTab === "quick-quiz"
                          ? "bg-[#0F2042] text-white dark:bg-white dark:text-black font-semibold"
                          : "text-[#8B1E1E] dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      }`}
                    >
                      <Sparkles className="w-4 h-4 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-semibold">⚡ Daily Challenge & Quick Quiz</div>
                        <div className="text-[10px] opacity-80">1-min timed blitz & active recall drills</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSelectTab("sections")}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-start gap-2.5 transition cursor-pointer mt-1 ${
                        activeTab === "sections"
                          ? "bg-[#0F2042] text-white dark:bg-white dark:text-black font-semibold"
                          : "text-[#1C1917] dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800"
                      }`}
                    >
                      <BookOpen className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />
                      <div>
                        <div className="text-xs font-semibold">Sections & Chapters</div>
                        <div className="text-[10px] opacity-70">1.1 to 4.4 breakdown & docs</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* TOP TAB BUTTON: 0264 Syllabus Checklist */}
              <button
                type="button"
                onClick={() => handleSelectTab("checklist")}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer text-xs sm:text-sm font-medium ${
                  activeTab === "checklist"
                    ? "bg-[#0F2042] text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                    : "text-[#57534E] dark:text-neutral-300 hover:text-[#0F2042] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                }`}
                title="Syllabus Checklist: Rate Easy, Moderate, Hard and Answer Practice Points"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>0264 Checklist</span>
              </button>

              {/* TOP TAB BUTTON: 2D Boss Battle Fighting Game */}
              <button
                type="button"
                onClick={() => handleSelectTab("boss-battle")}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer text-xs sm:text-sm font-semibold ${
                  activeTab === "boss-battle"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                }`}
                title="Boss Battle Arena: 2D Arcade with Cambridge Question Attacks & Armour Upgrades"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Boss Battle ⚔️</span>
              </button>

              {/* DROPDOWN 2: Resources & Records */}
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
                  <span>Resources & Archive</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      openDropdown === "resources" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {openDropdown === "resources" && (
                  <div className="absolute top-full left-0 mt-1 w-60 p-2 rounded-2xl bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-700 shadow-xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
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
                        <div className="text-xs font-semibold">Specimen Papers & PDFs</div>
                        <div className="text-[10px] opacity-70">Official archives & past papers</div>
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
                        <div className="text-[10px] opacity-70">{submissionCount} saved submissions</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* TOP TAB BUTTON: 2D Boss Battle Fighting Game */}
              <button
                type="button"
                onClick={() => handleSelectTab("boss-battle")}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer text-xs sm:text-sm font-semibold ${
                  activeTab === "boss-battle"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                }`}
                title="Boss Battle Arena: 2D Arcade with Cambridge Question Attacks & Armour Upgrades"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Boss Battle ⚔️</span>
              </button>


          {/* HIGH-VISIBILITY STUDY SPACE BUTTON IN CENTER NAV */}
          {onOpenStudySpace && (
            <button
              onClick={handleStudySpaceClick}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all transform active:scale-95 flex items-center gap-1.5 cursor-pointer ml-1"
              title="Launch Aesthetic Lo-Fi Study Space & Pomodoro"
            >
              <Headphones className="w-3.5 h-3.5 text-indigo-100" />
              <span>Study Space</span>
            </button>
          )}
        </nav>

        {/* ========================================================= */}
        {/* ZONE 3: ACTIONS (FEEDBACK, THEME, SWITCH, MOBILE MENU) */}
        {/* ========================================================= */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Avatar Wardrobe & Coins Pill */}
          {onOpenAvatarCustomizer && (
            <button
              onClick={onOpenAvatarCustomizer}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold font-mono transition cursor-pointer shadow-xs active:scale-95"
              title="Customise Scholar Avatar (Hair, Tops, Pants, Shoes) & Spend Coins"
            >
              <span>🪙 {studyCoins}</span>
              <Palette className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline font-sans text-[11px] font-semibold">Avatar</span>
            </button>
          )}

          {/* Achievements & Milestones Button */}
          {onOpenAchievements && (
            <button
              onClick={onOpenAchievements}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold transition cursor-pointer shadow-xs active:scale-95"
              title="Achievements & Milestones: Earn bonus Study Coins!"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline font-sans text-[11px] font-semibold">Achievements</span>
            </button>
          )}

          {/* Quick Study Space Button for mobile/compact headers */}
          {onOpenStudySpace && (
            <button
              onClick={handleStudySpaceClick}
              className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-xs transition active:scale-95"
              title="Study Space"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Study</span>
            </button>
          )}

          {/* Feedback & Bug Report Link */}
          <a
            href="https://forms.gle/6X2CAR1LkSQGRBx68"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#0F2042] dark:text-neutral-200 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 transition-colors shadow-xs"
            title="Report a bug or suggest an improvement"
          >
            <span className="text-amber-500 text-xs">💡</span>
            <span className="hidden sm:inline">Report Bug / Suggestion</span>
            <span className="sm:hidden">Feedback</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
            className="p-1.5 sm:p-2 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#57534E] dark:text-neutral-300 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
          </button>


          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#1C1917] dark:text-white"
            aria-label="Toggle Mobile Navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE EXPANDED DRAWER (Works seamlessly on touch screens) */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-3 pb-2 border-t border-[#E7E5E4] dark:border-neutral-800 mt-2.5 space-y-2 animate-in fade-in duration-150">
          {/* Link back to Fresh IGCSE Hub */}
          <a
            href="../index.html#subjects"
            className="w-full py-2 px-3 rounded-xl border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#0F2042] dark:text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs"
          >
            <span>← All Subjects (Fresh IGCSE Hub)</span>
          </a>

          {/* Study Space Banner for Mobile */}
          {onOpenStudySpace && (
            <button
              onClick={handleStudySpaceClick}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
            >
              <Headphones className="w-4 h-4" />
              <span>Launch Aesthetic Study Space & Pomodoro</span>
            </button>
          )}

          {/* Avatar Wardrobe Banner for Mobile */}
          {onOpenAvatarCustomizer && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAvatarCustomizer();
              }}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-800 dark:text-amber-200 text-xs font-bold flex items-center justify-between gap-2 shadow-xs cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Customize Scholar Avatar & Wardrobe</span>
              </div>
              <span className="font-mono text-[11px] bg-amber-500/30 px-2 py-0.5 rounded-full">🪙 {studyCoins}</span>
            </button>
          )}

          <div className="space-y-1 text-xs">
            <div className="text-[10px] font-mono uppercase font-bold text-slate-400 px-2 pt-1">
                Practice & Drills
              </div>
              <button
                onClick={() => handleSelectTab("practice")}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
                  activeTab === "practice"
                    ? "bg-[#0F2042] text-white font-semibold"
                    : "text-slate-800 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Practice Studio (Case Studies)</span>
              </button>
              <button
                onClick={() => handleSelectTab("quick-quiz")}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
                  activeTab === "quick-quiz"
                    ? "bg-[#0F2042] text-white font-semibold"
                    : "text-[#8B1E1E] dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>⚡ Daily Challenge & Quick Quiz</span>
              </button>
              <button
                onClick={() => handleSelectTab("sections")}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
                  activeTab === "sections"
                    ? "bg-[#0F2042] text-white font-semibold"
                    : "text-slate-800 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Sections & Chapters</span>
              </button>
              <button
                onClick={() => handleSelectTab("checklist")}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
                  activeTab === "checklist"
                    ? "bg-[#0F2042] text-white font-semibold"
                    : "text-slate-800 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800"
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>✓ 0264 Syllabus Checklist</span>
              </button>
              <button
                onClick={() => handleSelectTab("boss-battle")}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
                  activeTab === "boss-battle"
                    ? "bg-rose-600 text-white font-bold"
                    : "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-semibold"
                }`}
              >
                <Swords className="w-3.5 h-3.5" />
                <span>🎮 2D Boss Battle Fighting Game</span>
              </button>
              {onOpenAchievements && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAchievements();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 font-semibold"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>🏆 Achievements & Milestones (+Coins)</span>
                </button>
              )}

              <div className="text-[10px] font-mono uppercase font-bold text-slate-400 px-2 pt-2">
                Resources & Archive
              </div>
              <button
                onClick={() => handleSelectTab("glossary")}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
                  activeTab === "glossary"
                    ? "bg-[#0F2042] text-white font-semibold"
                    : "text-slate-800 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>0264 Syllabus Glossary</span>
              </button>
              <button
                onClick={() => handleSelectTab("archive")}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
                  activeTab === "archive"
                    ? "bg-[#0F2042] text-white font-semibold"
                    : "text-slate-800 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Specimen Papers & PDFs</span>
              </button>
              <button
                onClick={() => handleSelectTab("progress")}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
                  activeTab === "progress"
                    ? "bg-[#0F2042] text-white font-semibold"
                    : "text-slate-800 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Progress Ledger ({submissionCount})</span>
              </button>
            </div>
        </div>
      )}
    </header>
  );
}

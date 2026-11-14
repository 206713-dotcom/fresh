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
  Scale,
  Timer,
  GraduationCap,
  LogIn,
  LogOut,
  CloudCheck,
  AlertTriangle,
  RefreshCw,
  UserRound,
  Paintbrush,
  Check,
  ArrowLeft,
} from "lucide-react";
import { deductStudyCoins, getStudyCoins } from "../lib/cookies";
import { clearSession, getSession } from "../lib/auth";
import { getSyncSnapshot, type SyncSnapshot } from "../lib/sheetSync";
import {
  APP_THEMES,
  getTheme,
  loadUnlockedThemes,
  unlockTheme,
  type ThemeId,
} from "../lib/themes";

interface HeaderProps {
  currentSubject?: "business";
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onSwitchSubject?: () => void;
  theme: ThemeId;
  onSelectTheme: (id: ThemeId) => void;
  submissionCount: number;
  onOpenStudySpace?: () => void;
  onOpenAvatarCustomizer?: () => void;
  onOpenAchievements?: () => void;
  onOpenCompare?: (sectionCode: string) => void;
  onStartMockExam?: () => void;
}

export function Header({
  activeTab,
  setActiveTab,
  theme,
  onSelectTheme,
  submissionCount,
  onOpenStudySpace,
  onOpenAvatarCustomizer,
  onOpenAchievements,
  onOpenCompare,
  onStartMockExam,
}: HeaderProps) {
  // Dropdown open states for desktop & mobile
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [chaptersOpen, setChaptersOpen] = useState<boolean>(false);
  const navRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [accountOpen, setAccountOpen] = useState<boolean>(false);

  // Theme shop: which looks the student owns, and any purchase message.
  const [themeShopOpen, setThemeShopOpen] = useState<boolean>(false);
  const [themeNotice, setThemeNotice] = useState<string | null>(null);
  const [unlockedThemes, setUnlockedThemes] = useState<ThemeId[]>(() =>
    loadUnlockedThemes()
  );

  // Signed-in student (6-digit number). Read from localStorage on mount.
  const [session, setSession] = useState(() => getSession());

  // Live Google Sheet save status, so a failed save is never silent.
  const [sync, setSync] = useState<SyncSnapshot>(() => getSyncSnapshot());

  useEffect(() => {
    const onSyncState = (event: Event) => {
      const detail = (event as CustomEvent<SyncSnapshot>).detail;
      setSync(detail ?? getSyncSnapshot());
      // An `unauthorized` reply clears the session; reflect that immediately.
      setSession(getSession());
    };
    const refreshSession = () => setSession(getSession());

    window.addEventListener("ecbiz_sync_state", onSyncState);
    window.addEventListener("focus", refreshSession);
    window.addEventListener("storage", refreshSession);
    return () => {
      window.removeEventListener("ecbiz_sync_state", onSyncState);
      window.removeEventListener("focus", refreshSession);
      window.removeEventListener("storage", refreshSession);
    };
  }, []);

  // Collapse the chapter list whenever the Checklist dropdown closes.
  useEffect(() => {
    if (openDropdown !== "checklist") setChaptersOpen(false);
  }, [openDropdown]);

  const handleSignOut = () => {
    clearSession();
    setSession(null);
    setAccountOpen(false);
    setMobileMenuOpen(false);
    setActiveTab("practice");
  };

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

  // Close dropdowns (and the account popover) when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (navRef.current && !navRef.current.contains(target)) {
        setOpenDropdown(null);
      }
      if (accountRef.current && !accountRef.current.contains(target)) {
        setAccountOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(target)) {
        setThemeShopOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent background scroll bleeding when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [mobileMenuOpen]);

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
    setAccountOpen(false);
    setThemeShopOpen(false);
    setMobileMenuOpen(false);
  };

  /**
   * Apply a theme, buying it first when it is premium and still locked.
   * Free themes and owned themes are one click; premium ones show their price
   * inline so a purchase is never a surprise.
   */
  const handleThemePick = (id: ThemeId) => {
    const definition = getTheme(id);
    const owned = unlockedThemes.includes(id);

    if (owned || definition.price === 0) {
      if (!owned) {
        unlockTheme(id);
        setUnlockedThemes(loadUnlockedThemes());
      }
      onSelectTheme(id);
      setThemeNotice(null);
      return;
    }

    const balance = getStudyCoins();
    if (balance < definition.price) {
      setThemeNotice(
        `Need ${definition.price - balance} more coins to unlock ${definition.name}.`
      );
      return;
    }

    if (!deductStudyCoins(definition.price)) {
      setThemeNotice("Could not spend your coins — please try again.");
      return;
    }

    unlockTheme(id);
    setUnlockedThemes(loadUnlockedThemes());
    onSelectTheme(id);
    setThemeNotice(`Unlocked ${definition.name} for ${definition.price} coins!`);
  };

  const handleStudySpaceClick = () => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    if (onOpenStudySpace) {
      onOpenStudySpace();
    }
  };

  const isQuestionsActive = ["practice", "paper2", "quick-quiz", "lessons"].includes(activeTab);
  const isResourcesActive = ["glossary", "archive", "progress"].includes(activeTab);
  const isChecklistActive = ["checklist", "compare", "sections"].includes(activeTab);

  const openCompare = (sectionCode: string) => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    if (onOpenCompare) onOpenCompare(sectionCode);
    else setActiveTab("compare");
  };

  // Shared copy for the avatar dot and its popover.
  const syncLabel =
    sync.state === "error"
      ? "Not saved"
      : sync.state === "syncing"
        ? "Saving…"
        : sync.state === "saved"
          ? "Synced"
          : "Signed in";

  const syncDetail =
    sync.state === "error"
      ? sync.message || "Could not save to the Google Sheet."
      : sync.state === "syncing"
        ? "Saving your progress to the Google Sheet…"
        : sync.state === "saved"
          ? `Saved to the Google Sheet${
              sync.lastSyncedAt
                ? ` at ${new Date(sync.lastSyncedAt).toLocaleTimeString()}`
                : ""
            }`
          : "Signed in — waiting for the first save";

  return (
    <header className="site-header sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="site-header-inner">
        {/* ========================================================= */}
        {/* ZONE 1: BRAND / WORDMARK */}
        {/* ========================================================= */}
        <div className="shrink-0 flex items-center gap-2">
          <a
            href="../../index.html"
            title="Back to Fresh"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 px-2.5 py-1.5 text-sm font-medium text-[#1C1917] dark:text-white hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            <span className="whitespace-nowrap">Fresh</span>
          </a>
          <button
            onClick={() => handleSelectTab("practice")}
            title="EcBiz"
            className="site-brand"
          >
            <span className="site-brand-icon" aria-hidden="true"><BookOpen size={18} strokeWidth={1.8} /></span>
            <span className="font-academic-serif font-bold tracking-tight whitespace-nowrap">
              EcBiz
            </span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* ZONE 2: DESKTOP NAVIGATION BAR */}
        {/* ========================================================= */}
        <nav
          ref={navRef}
          aria-label="Study navigation"
          className="hidden lg:flex items-center gap-1.5 text-sm font-medium"
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
              aria-expanded={openDropdown === "questions"}
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
                  onClick={() => handleSelectTab("lessons")}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-start gap-2.5 transition cursor-pointer ${
                    activeTab === "lessons"
                      ? "bg-[#203e32] text-white font-semibold"
                      : "text-[#1C1917] dark:text-neutral-200 hover:bg-[#f4f8ec] dark:hover:bg-neutral-800"
                  }`}
                >
                  <GraduationCap
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      activeTab === "lessons"
                        ? "text-[#e4eeb2]"
                        : "text-[#5f7d4a] dark:text-[#b9d3a3]"
                    }`}
                  />
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <span>Interactive Lessons</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#e4eeb2] text-[#213b30] font-mono">
                        24
                      </span>
                    </div>
                    <div className="text-[10px] opacity-75">
                      Guided concept + practice cards (Sections 1–6)
                    </div>
                  </div>
                </button>

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

                {onStartMockExam && (
                  <button
                    onClick={() => {
                      handleSelectTab("practice");
                      onStartMockExam();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl flex items-start gap-2.5 transition cursor-pointer mt-1 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-t border-neutral-100 dark:border-neutral-800 pt-2"
                  >
                    <Timer className="w-4 h-4 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">Mock Exam</div>
                      <div className="text-[10px] opacity-75">Timed Paper 1 / Paper 2 under exam conditions</div>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* DROPDOWN: Checklist (Syllabus Checklist + Sections + Advantages & Disadvantages) */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("checklist")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => handleToggleClick("checklist")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                isChecklistActive
                  ? "bg-[#0F2042] text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                  : "text-[#57534E] dark:text-neutral-300 hover:text-[#0F2042] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Checklist</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openDropdown === "checklist" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown === "checklist" && (
              <div className="absolute top-full left-0 mt-1 w-72 p-2 rounded-2xl bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-700 shadow-xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => handleSelectTab("checklist")}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-start gap-2.5 transition cursor-pointer ${
                    activeTab === "checklist"
                      ? "bg-[#0F2042] text-white dark:bg-white dark:text-black font-semibold"
                      : "text-[#1C1917] dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  <CheckSquare className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />
                  <div>
                    <div className="text-xs font-bold">0264 Syllabus Checklist</div>
                    <div className="text-[10px] opacity-75">Rate and track every syllabus point</div>
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
                    <div className="text-xs font-bold">Sections & Chapters (1–6)</div>
                    <div className="text-[10px] opacity-75">Syllabus overview for every section</div>
                  </div>
                </button>

                <div className="mt-1 border-t border-neutral-100 dark:border-neutral-800 pt-1">
                  <button
                    type="button"
                    onClick={() => setChaptersOpen((prev) => !prev)}
                    aria-expanded={chaptersOpen}
                    className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 transition cursor-pointer text-[#1C1917] dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800"
                  >
                    <Scale className="w-4 h-4 shrink-0 opacity-70" />
                    <div className="flex-1">
                      <div className="text-xs font-bold">Advantages & Disadvantages</div>
                      <div className="text-[10px] opacity-75">
                        {chaptersOpen ? "Hide sections" : "Choose a section"}
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                        chaptersOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {chaptersOpen && (
                    <div className="mt-1 mb-1 rounded-xl border border-[#E7E5E4] dark:border-neutral-700 bg-[#FAF9F6] dark:bg-neutral-800/60 p-1.5">
                      <div className="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#78716C] dark:text-neutral-400">
                        Chapter breakdown
                      </div>
                      {["1", "2", "3", "4", "5", "6"].map((code) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => openCompare(code)}
                          className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold text-[#1C1917] dark:text-neutral-200 hover:bg-white dark:hover:bg-neutral-700 cursor-pointer"
                        >
                          Section {code}
                          <span className="block text-[10px] font-normal opacity-70">
                            {
                              {
                                "1": "Business activity, ownership, objectives",
                                "2": "Motivation, structure, people, communication",
                                "3": "Marketing mix, research, strategy",
                                "4": "Production, costs, quality, location",
                                "5": "Finance, cash flow, accounts, ratios",
                                "6": "Economy, ethics, global trade",
                              }[code]
                            }
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

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
        <div className="site-utilities">
          {/* Account: a round avatar showing the 6-digit student number.
              Ordered last so it sits at the far right of the header. */}
          <div ref={accountRef} className="site-account relative order-last">
            {session ? (
              <>
                <button
                  type="button"
                  onClick={() => setAccountOpen((prev) => !prev)}
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  className="relative h-11 w-11 rounded-full bg-gradient-to-br from-[#203e32] to-[#356b55] dark:from-emerald-700 dark:to-emerald-950 text-[#f4f8ee] ring-2 ring-[#dce7d2] dark:ring-emerald-900 hover:ring-[#c4d7b4] dark:hover:ring-emerald-700 shadow-sm transition-all flex items-center justify-center cursor-pointer"
                  title={`Student ${session.code} — open your account menu`}
                >
                  <span className="font-mono text-[11px] font-bold leading-none tracking-[-0.06em]">
                    {session.code}
                  </span>
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#FAF9F6] dark:border-black ${
                      sync.state === "error"
                        ? "bg-rose-500"
                        : sync.state === "syncing"
                          ? "bg-amber-400 animate-pulse"
                          : sync.state === "saved"
                            ? "bg-emerald-500"
                            : "bg-neutral-300 dark:bg-neutral-500"
                    }`}
                  />
                </button>

                {accountOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-[#E7E5E4] dark:border-neutral-800 bg-[#FAF9F6] dark:bg-neutral-950 shadow-xl p-2 z-50"
                  >
                    <div className="flex items-center gap-2.5 px-2 py-2">
                      <span className="h-9 w-9 shrink-0 rounded-full bg-[#edf2e7] dark:bg-emerald-950/60 text-[#203e32] dark:text-emerald-200 flex items-center justify-center">
                        <UserRound className="w-4 h-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-bold text-[#1C1917] dark:text-white truncate">
                          {session.name || "Student"}
                        </span>
                        <span className="block text-[11px] font-mono text-[#78716C] dark:text-neutral-400">
                          Student {session.code}
                        </span>
                      </span>
                    </div>

                    <div
                      title={syncDetail}
                      className={`mx-1 mb-1 flex items-start gap-2 rounded-xl px-2 py-1.5 text-[11px] font-semibold ${
                        sync.state === "error"
                          ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300"
                          : "bg-white dark:bg-neutral-900 text-[#57534E] dark:text-neutral-300"
                      }`}
                    >
                      {sync.state === "error" ? (
                        <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      ) : sync.state === "syncing" ? (
                        <RefreshCw className="w-3.5 h-3.5 mt-0.5 shrink-0 animate-spin" />
                      ) : (
                        <CloudCheck className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      )}
                      <span className="min-w-0 break-words">{syncDetail}</span>
                    </div>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleSelectTab("progress")}
                      className="w-full text-left px-2 py-2 rounded-xl text-xs font-semibold text-[#203e32] dark:text-emerald-200 hover:bg-[#edf2e7] dark:hover:bg-emerald-950/50 flex items-center gap-2 cursor-pointer"
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      Progress Ledger
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      className="w-full text-left px-2 py-2 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <a
                href="/sign-in"
                className="h-11 w-11 rounded-full bg-[#203e32] dark:bg-emerald-800 hover:bg-[#1a332a] dark:hover:bg-emerald-700 text-white ring-2 ring-[#dce7d2] dark:ring-emerald-900 shadow-sm transition-all flex items-center justify-center cursor-pointer"
                title="Sign in with your 6-digit student number"
              >
                <LogIn className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Bug / Suggestion Button at Top */}
          <a
            href="https://forms.gle/6X2CAR1LkSQGRBx68"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden 2xl:flex px-2.5 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700/80 bg-amber-50/90 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 transition-colors text-xs font-semibold items-center gap-1.5 group cursor-pointer"
            title="Report a bug or suggest an improvement (Google Forms)"
          >
            <span className="text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">💡</span>
            <span>Bug / Suggestion</span>
            <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
          </a>

          {/* Study Coins Sticker Badge */}
          <div
            className="site-coin-balance sticker-badge font-mono text-xs font-bold cursor-default"
            title="Earn coins by completing Topical and Paper 2 questions"
          >
            <span>🪙</span>
            <span>{studyCoins}</span>
          </div>

          {/* Study Space Floating Trigger */}
          {onOpenStudySpace && (
            <button
              onClick={handleStudySpaceClick}
              className="site-utility-button px-2.5 py-1.5 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-[#57534E] dark:text-neutral-300 transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              title="Open Focus Realm & Ambient Sounds"
              aria-label="Study Space"
            >
              <span>🎧</span>
              <span className="hidden 2xl:inline">Study Space</span>
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

          {/* Theme shop — free day/night, premium looks bought with coins */}
          <div ref={themeRef} className="site-theme-control">
            <button
              type="button"
              onClick={() => {
                setThemeShopOpen((prev) => !prev);
                setThemeNotice(null);
              }}
              aria-haspopup="menu"
              aria-expanded={themeShopOpen}
              className="p-1.5 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-[#57534E] dark:text-neutral-300 transition-colors cursor-pointer"
              title={`Theme shop — ${getTheme(theme).name}`}
            >
              <Paintbrush className="w-4 h-4" />
            </button>

            {themeShopOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-1.75rem)] rounded-2xl border border-[#E7E5E4] dark:border-neutral-800 bg-[#FAF9F6] dark:bg-neutral-950 shadow-xl p-2 z-50"
              >
                <div className="flex items-center justify-between px-2 py-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Theme shop
                  </span>
                  <span className="text-[11px] font-bold text-[#57534E] dark:text-neutral-300">
                    🪙 {studyCoins}
                  </span>
                </div>

                <div className="space-y-1 max-h-80 overflow-y-auto overscroll-contain">
                  {APP_THEMES.map((option) => {
                    const owned = unlockedThemes.includes(option.id);
                    const active = theme === option.id;
                    const affordable = studyCoins >= option.price;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="menuitem"
                        onClick={() => handleThemePick(option.id)}
                        className={`w-full text-left px-2 py-2 rounded-xl border flex items-center gap-2.5 transition-colors cursor-pointer ${
                          active
                            ? "border-[#203e32]/40 dark:border-emerald-700 bg-[#edf2e7] dark:bg-emerald-950/50"
                            : "border-transparent hover:bg-white dark:hover:bg-neutral-900"
                        }`}
                      >
                        <span className="flex -space-x-1.5 shrink-0">
                          {option.swatch.map((colour) => (
                            <span
                              key={colour}
                              className="h-4 w-4 rounded-full border border-black/10 dark:border-white/20"
                              style={{ backgroundColor: colour }}
                            />
                          ))}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1 text-xs font-bold text-[#1C1917] dark:text-white">
                            <span className="truncate">{option.name}</span>
                            {option.dark ? (
                              <Moon className="w-3 h-3 shrink-0 opacity-60" />
                            ) : (
                              <Sun className="w-3 h-3 shrink-0 opacity-60" />
                            )}
                            {active && (
                              <Check className="w-3 h-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
                            )}
                          </span>
                          <span className="block text-[10px] leading-snug text-[#78716C] dark:text-neutral-400">
                            {option.blurb}
                          </span>
                        </span>

                        <span
                          className={`shrink-0 text-[10px] font-mono font-bold ${
                            active
                              ? "text-emerald-700 dark:text-emerald-400"
                              : owned
                                ? "text-[#78716C] dark:text-neutral-400"
                                : affordable
                                  ? "text-amber-700 dark:text-amber-300"
                                  : "text-rose-500 dark:text-rose-400"
                          }`}
                        >
                          {active ? "Active" : owned ? "Owned" : `🪙 ${option.price}`}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {themeNotice && (
                  <p className="px-2 pt-1.5 text-[10px] font-semibold leading-snug text-amber-700 dark:text-amber-300">
                    {themeNotice}
                  </p>
                )}
                <p className="px-2 pt-1.5 pb-1 text-[10px] leading-snug text-neutral-500 dark:text-neutral-400">
                  Unlock a look once and it stays yours. Themes sync with your
                  progress to the Google Sheet.
                </p>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#1C1917] dark:text-white"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close study navigation" : "Open study navigation"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE EXPANDED MENU                                     */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <nav aria-label="Study navigation" className="site-mobile-navigation lg:hidden pt-3 border-t border-[#E7E5E4] dark:border-neutral-800 space-y-1.5 overscroll-contain max-h-[calc(100dvh-4.5rem)] overflow-y-auto">
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

          {/* Account row in mobile menu */}
          {session ? (
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => handleSelectTab("progress")}
                className="flex-1 text-left px-3 py-2 rounded-xl text-xs font-bold bg-[#edf2e7] dark:bg-emerald-950/40 border border-[#203e32]/20 dark:border-emerald-800 text-[#203e32] dark:text-emerald-200 flex items-center gap-2"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Progress Ledger · <span className="font-mono">{session.code}</span>
              </button>
              <button
                onClick={handleSignOut}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-[#D6D3D1] dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </button>
            </div>
          ) : (
            <a
              href="/sign-in"
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between bg-[#203e32] dark:bg-emerald-800 text-white mb-2"
            >
              <span className="flex items-center gap-2">
                <LogIn className="w-3.5 h-3.5" />
                Sign in with your student number
              </span>
              <span className="text-[10px] opacity-80 font-mono">6 digits</span>
            </a>
          )}

          {/* Questions Group */}
          <div className="px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400">
            Questions
          </div>
          <button
            onClick={() => handleSelectTab("lessons")}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between ${
              activeTab === "lessons"
                ? "bg-[#203e32] text-white"
                : "text-[#203e32] dark:text-[#e4eeb2] hover:bg-[#f4f8ec] dark:hover:bg-neutral-800"
            }`}
          >
            <span className="flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5" />
              Interactive Lessons
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#e4eeb2] text-[#213b30] font-mono">
              24
            </span>
          </button>

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

          {onStartMockExam && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onStartMockExam();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300"
            >
              <span className="flex items-center gap-2">
                <Timer className="w-3.5 h-3.5" />
                <span>Start Mock Exam</span>
              </span>
              <span className="text-[10px] font-mono opacity-80">P1 / P2 timed</span>
            </button>
          )}

          <div className="pt-2 border-t border-[#E7E5E4] dark:border-neutral-800"></div>

          <div className="px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400">
            Checklist
          </div>

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
            onClick={() => handleSelectTab("sections")}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
              activeTab === "sections"
                ? "bg-[#0F2042] text-white"
                : "text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            Sections & Chapters (1–6)
          </button>

          <details className="rounded-xl border border-[#E7E5E4] dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/60 mx-0">
            <summary className="px-3 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 cursor-pointer flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              Advantages & Disadvantages
            </summary>
            <div className="px-2 pb-2">
              <div className="px-1 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                Chapter breakdown
              </div>
              {["1", "2", "3", "4", "5", "6"].map((code) => (
                <button
                  key={code}
                  onClick={() => openCompare(code)}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Section {code}
                </button>
              ))}
            </div>
          </details>

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
        </nav>
      )}
    </header>
  );
}

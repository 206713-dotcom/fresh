import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { PracticeStudio } from "./components/PracticeStudio";
import { Paper2PracticeView } from "./components/Paper2PracticeView";
import { GlossaryView } from "./components/GlossaryView";
import { DocumentArchive } from "./components/DocumentArchive";
import { ProgressDashboard } from "./components/ProgressDashboard";
import { DailyQuickQuiz } from "./components/DailyQuickQuiz";
import { SectionsView } from "./components/SectionsView";
import { SyllabusRevisionChecklist } from "./components/SyllabusRevisionChecklist";
import { CompareNotesView } from "./components/CompareNotesView";
import { InteractiveLessonsView } from "./components/InteractiveLessonsView";
import { BossBattleArena } from "./components/BossBattleArena";
import { AvatarCustomizerModal } from "./components/AvatarCustomizerModal";
import { AchievementsModal } from "./components/AchievementsModal";
import { MockExamMode } from "./components/MockExamMode";
import StudySpace from "./components/StudySpace";
import { GLOSSARY_TERMS } from "./lib/data/glossary";
import {
  loadBookmarkedQuestionIds,
  loadMasteredTerms,
  loadSubmissions,
  saveBookmarkedQuestionIds,
  saveMasteredTerms,
  saveSubmissions,
} from "./lib/cookies";
import {
  getTheme,
  isThemeUsable,
  loadThemeId,
  saveThemeId,
  type ThemeId,
} from "./lib/themes";
import { StudentSubmissionRecord } from "./lib/types";

export type BusinessTab =
  | "practice"
  | "paper2"
  | "quick-quiz"
  | "sections"
  | "checklist"
  | "glossary"
  | "archive"
  | "progress"
  | "boss-battle"
  | "compare"
  | "lessons";

export default function App() {
  const [theme, setTheme] = useState<ThemeId>(() => {
    if (typeof window !== "undefined") {
      const saved = loadThemeId();
      return isThemeUsable(saved) ? saved : "daylight";
    }
    return "daylight";
  });

  // Business Tab state: "practice" | "paper2" | "quick-quiz" | "sections" | "checklist" | "glossary" | "archive" | "progress" | "boss-battle" | "compare" | "lessons"
  const [businessTab, setBusinessTab] = useState<BusinessTab>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ecbiz_business_tab");
      if (
        saved &&
        [
          "practice",
          "paper2",
          "quick-quiz",
          "sections",
          "checklist",
          "glossary",
          "archive",
          "progress",
          "boss-battle",
          "compare",
          "lessons",
        ].includes(saved)
      ) {
        return saved as BusinessTab;
      }
    }
    return "practice";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ecbiz_business_tab", businessTab);
    }
  }, [businessTab]);

  // Practice Studio initial mode: "paper1_database" (topical) | "verified_archive" (official past papers) | "paper2_case_study"
  const [practiceMode, setPracticeMode] = useState<"paper1_database" | "paper2_case_study" | "verified_archive">(
    "paper1_database"
  );

  // Modals & Study Space State
  const [showAvatarCustomizerModal, setShowAvatarCustomizerModal] = useState<boolean>(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState<boolean>(false);
  const [isMockExamMode, setIsMockExamMode] = useState<boolean>(false);
  const [isStudySpaceExpanded, setIsStudySpaceExpanded] = useState<boolean>(false);
  const [isStudySpaceActive, setIsStudySpaceActive] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ecbiz_studyspace_active") === "true";
    }
    return false;
  });

  const handleOpenStudySpace = () => {
    setIsStudySpaceActive(true);
    setIsStudySpaceExpanded(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("ecbiz_studyspace_active", "true");
    }
  };

  const handleCloseStudySpaceWidget = () => {
    setIsStudySpaceActive(false);
    setIsStudySpaceExpanded(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("ecbiz_studyspace_active", "false");
    }
  };

  const [compareSection, setCompareSection] = useState<string>("1");
  const [selectedPracticeSection, setSelectedPracticeSection] = useState<string>("1");
  const [selectedPracticeTopic, setSelectedPracticeTopic] = useState<string | undefined>("1.1");

  // Persistent States via permanent cookies / localStorage
  const [submissions, setSubmissions] = useState<StudentSubmissionRecord[]>([]);
  const [masteredTerms, setMasteredTerms] = useState<string[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Synchronize documentElement, body, and storage with theme
  useEffect(() => {
    const active = getTheme(theme);
    document.documentElement.classList.toggle("dark", active.dark);
    document.body.classList.toggle("dark", active.dark);
    document.documentElement.style.colorScheme = active.dark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    saveThemeId(theme);
  }, [theme]);

  // Load records from cookies/storage on mount and handle URL routing params
  useEffect(() => {
    setSubmissions(loadSubmissions());
    setMasteredTerms(loadMasteredTerms());
    setBookmarkedIds(loadBookmarkedQuestionIds());

    if (typeof window !== "undefined") {
      try {
        const params = new URLSearchParams(window.location.search);
        const openParam = params.get("open") || params.get("tab");
        if (openParam === "paper2") {
          setBusinessTab("paper2");
        } else if (openParam === "lessons") {
          setBusinessTab("lessons");
        } else if (openParam === "practice") {
          setBusinessTab("practice");
        } else if (openParam === "glossary") {
          setBusinessTab("glossary");
        } else if (openParam === "studyspace") {
          handleOpenStudySpace();
        } else if (openParam === "quiz" || openParam === "challenge") {
          setBusinessTab("quick-quiz");
        } else if (openParam === "compare") {
          setBusinessTab("compare");
          const sectionParam = params.get("section");
          if (sectionParam && ["1", "2", "3", "4", "5", "6"].includes(sectionParam)) {
            setCompareSection(sectionParam);
          }
        }
      } catch {}
    }
  }, []);

  // Listen for ESC to close modals / shrink study space
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showAvatarCustomizerModal) setShowAvatarCustomizerModal(false);
        if (showAchievementsModal) setShowAchievementsModal(false);
        if (isStudySpaceExpanded) setIsStudySpaceExpanded(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showAvatarCustomizerModal, showAchievementsModal, isStudySpaceExpanded]);

  // Keep the wrapper in sync with the active theme's dark flag so Tailwind
  // dark: variants work even on the root container.
  const themeIsDark = getTheme(theme).dark;

  const handleSelectBusinessSection = (sectionCode: string, topicCode?: string) => {
    setSelectedPracticeSection(sectionCode);
    if (topicCode) setSelectedPracticeTopic(topicCode);
    setBusinessTab("practice");
    if (["1", "2", "3", "4", "5", "6"].includes(sectionCode)) {
      setPracticeMode("paper1_database");
    } else {
      setPracticeMode("verified_archive");
    }
  };

  const handleSaveSubmission = (record: StudentSubmissionRecord) => {
    const existingIndex = submissions.findIndex((s) => s.id === record.id);
    let updated: StudentSubmissionRecord[];
    if (existingIndex >= 0) {
      updated = [...submissions];
      updated[existingIndex] = record;
    } else {
      updated = [record, ...submissions];
    }
    setSubmissions(updated);
    saveSubmissions(updated);
  };

  const handleToggleMastered = (id: string) => {
    let updated: string[];
    if (masteredTerms.includes(id)) {
      updated = masteredTerms.filter((item) => item !== id);
    } else {
      updated = [...masteredTerms, id];
    }
    setMasteredTerms(updated);
    saveMasteredTerms(updated);
  };

  const handleToggleBookmark = (id: string) => {
    let updated: string[];
    if (bookmarkedIds.includes(id)) {
      updated = bookmarkedIds.filter((item) => item !== id);
    } else {
      updated = [...bookmarkedIds, id];
    }
    setBookmarkedIds(updated);
    saveBookmarkedQuestionIds(updated);
  };

  const handleClearSubmissions = () => {
    setSubmissions([]);
    saveSubmissions([]);
  };

  // Timed Mock Exam Mode deliberately strips away all navigation, study-space
  // widgets and modals so the student sits the paper under strict conditions.
  if (isMockExamMode) {
    return <MockExamMode onExit={() => setIsMockExamMode(false)} />;
  }

  return (
    <div
      className={`min-h-screen flex flex-col justify-between bg-[var(--paper,#f6f4ed)] dark:bg-[#0d1613] text-[var(--ink,#192e28)] dark:text-white transition-colors ${
        themeIsDark ? "dark" : ""
      }`}
    >
      <div>
        {/* Top Navigation Bar */}
        <Header
          activeTab={businessTab}
          setActiveTab={(tab) => setBusinessTab(tab)}
          theme={theme}
          onSelectTheme={(id) => setTheme(id)}
          submissionCount={submissions.length}
          onOpenStudySpace={handleOpenStudySpace}
          onOpenAvatarCustomizer={() => setShowAvatarCustomizerModal(true)}
          onOpenAchievements={() => setShowAchievementsModal(true)}
          onOpenCompare={(sectionCode) => {
            setCompareSection(sectionCode);
            setBusinessTab("compare");
          }}
          onStartMockExam={() => setIsMockExamMode(true)}
        />

        {/* View Routing for Business Studies Platform */}
        <main>
          {/* TAB 1: Topical Questions (Sections 1-6) */}
          {businessTab === "practice" && (
            <PracticeStudio
              onSaveSubmission={handleSaveSubmission}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={handleToggleBookmark}
              onOpenQuickQuiz={() => setBusinessTab("quick-quiz")}
              onOpenSections={() => setBusinessTab("sections")}
              initialSectionCode={selectedPracticeSection}
              initialTopicCode={selectedPracticeTopic}
              initialPracticeMode={practiceMode}
              onOpenStudySpace={handleOpenStudySpace}
              onOpenMockExam={() => setIsMockExamMode(true)}
            />
          )}

          {/* TAB 2: Dedicated Paper 2 Practice Studio (100 Case Studies, Appendices 1-3, Qwen 3.5 0.8B) */}
          {businessTab === "paper2" && (
            <Paper2PracticeView onOpenStudySpace={handleOpenStudySpace} />
          )}

          {/* TAB: Interactive Lessons (24 guided concept + practice cards) */}
          {businessTab === "lessons" && (
            <InteractiveLessonsView
              onOpenPractice={(sectionCode) => {
                setSelectedPracticeSection(sectionCode);
                setSelectedPracticeTopic(undefined);
                setPracticeMode("paper1_database");
                setBusinessTab("practice");
              }}
              onOpenChecklist={() => setBusinessTab("checklist")}
            />
          )}

          {/* TAB 3: Sections & Chapters Breakdown (Sections 1-6) */}
          {businessTab === "sections" && (
            <SectionsView
              initialSectionCode={selectedPracticeSection || "1"}
              onSelectTopicForPractice={(sectionCode, topicCode) => {
                setSelectedPracticeSection(sectionCode);
                setSelectedPracticeTopic(topicCode);
                setBusinessTab("practice");
              }}
              onReturnToPractice={() => setBusinessTab("practice")}
              onOpenCompare={(sectionCode) => {
                setCompareSection(sectionCode);
                setBusinessTab("compare");
              }}
            />
          )}

          {/* TAB 4: Daily Quick Quiz */}
          {businessTab === "quick-quiz" && (
            <DailyQuickQuiz
              onOpenFullGlossary={() => setBusinessTab("glossary")}
              onOpenStudySpace={handleOpenStudySpace}
              onOpenPractice={() => setBusinessTab("practice")}
            />
          )}

          {/* TAB 5: 0264 Syllabus Revision Checklist */}
          {businessTab === "checklist" && (
            <div className="study-page">
              <SyllabusRevisionChecklist
                onSelectTopicForPractice={(_subj, secCode, topCode) => {
                  setSelectedPracticeSection(secCode);
                  setSelectedPracticeTopic(topCode);
                  setBusinessTab("practice");
                }}
              />
            </div>
          )}

          {/* TAB 6: Key Terms & Glossary */}
          {businessTab === "glossary" && (
            <GlossaryView
              masteredIds={masteredTerms}
              onToggleMastered={handleToggleMastered}
              onOpenQuickQuiz={() => setBusinessTab("quick-quiz")}
            />
          )}

          {/* TAB 7: Official Past Papers Archive */}
          {businessTab === "archive" && <DocumentArchive />}

          {/* TAB 8: Student Progress & Records Ledger */}
          {businessTab === "progress" && (
            <ProgressDashboard
              submissions={submissions}
              masteredTermsCount={masteredTerms.length}
              totalTermsCount={GLOSSARY_TERMS.length}
              onClearSubmissions={handleClearSubmissions}
              onSelectPractice={() => setBusinessTab("practice")}
            />
          )}

          {/* TAB 9: 2D Boss Battle Fighting Game */}
          {businessTab === "boss-battle" && (
            <BossBattleArena onBackToStudio={() => setBusinessTab("practice")} />
          )}

          {businessTab === "compare" && (
            <CompareNotesView
              section={compareSection}
              onSectionChange={setCompareSection}
            />
          )}
        </main>

        {/* Persistent Study Space Floating Realm or Movable Mini Widget */}
        <StudySpace
          isExpanded={isStudySpaceExpanded}
          onToggleExpand={setIsStudySpaceExpanded}
          isVisible={isStudySpaceActive}
          onClose={handleCloseStudySpaceWidget}
          onOpenAchievements={() => setShowAchievementsModal(true)}
        />

        {/* Scholar Avatar Wardrobe & Customizer Modal */}
        <AvatarCustomizerModal
          isOpen={showAvatarCustomizerModal}
          onClose={() => setShowAvatarCustomizerModal(false)}
        />

        {/* Achievements & Milestones Modal */}
        <AchievementsModal
          isOpen={showAchievementsModal}
          onClose={() => setShowAchievementsModal(false)}
        />

      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--line,#d4d9cf)] dark:border-neutral-800 bg-[var(--paper,#f6f4ed)] dark:bg-[#0d1613] py-4 px-6 text-center text-xs text-[var(--muted,#4b5c54)] dark:text-neutral-400">
        <p>
          EcBiz • Powered by Local in-Browser Qwen 3.5 0.8B AI •{" "}
          <a href="/dashboard" className="font-semibold underline hover:text-[#8B1E1E]">
            Student Dashboard
          </a>
        </p>
      </footer>
    </div>
  );
}

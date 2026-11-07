import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { PracticeStudio } from "./components/PracticeStudio";
import { Paper2PracticeView } from "./components/Paper2PracticeView";
import { GlossaryView } from "./components/GlossaryView";
import { DocumentArchive } from "./components/DocumentArchive";
import { ProgressDashboard } from "./components/ProgressDashboard";
import { FinanceExamStudio } from "./components/FinanceExamStudio";
import { DailyQuickQuiz } from "./components/DailyQuickQuiz";
import { SectionsView } from "./components/SectionsView";
import { SyllabusRevisionChecklist } from "./components/SyllabusRevisionChecklist";
import { BossBattleArena } from "./components/BossBattleArena";
import { AvatarCustomizerModal } from "./components/AvatarCustomizerModal";
import { AchievementsModal } from "./components/AchievementsModal";
import StudySpace from "./components/StudySpace";
import { GLOSSARY_TERMS } from "./lib/data/glossary";
import {
  loadBookmarkedQuestionIds,
  loadMasteredTerms,
  loadSubmissions,
  loadTheme,
  saveBookmarkedQuestionIds,
  saveMasteredTerms,
  saveSubmissions,
  saveTheme,
} from "./lib/cookies";
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
  | "boss-battle";

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return loadTheme();
    }
    return "light";
  });

  // Business Tab state: "practice" | "paper2" | "quick-quiz" | "sections" | "checklist" | "glossary" | "archive" | "progress" | "boss-battle"
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
  const [showFinanceExamModal, setShowFinanceExamModal] = useState<boolean>(false);
  const [showAvatarCustomizerModal, setShowAvatarCustomizerModal] = useState<boolean>(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState<boolean>(false);
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

  const [selectedPracticeSection, setSelectedPracticeSection] = useState<string>("1");
  const [selectedPracticeTopic, setSelectedPracticeTopic] = useState<string | undefined>("1.1");

  // Persistent States via permanent cookies / localStorage
  const [submissions, setSubmissions] = useState<StudentSubmissionRecord[]>([]);
  const [masteredTerms, setMasteredTerms] = useState<string[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Synchronize documentElement, body, and storage with theme
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
    saveTheme(theme);
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
        } else if (openParam === "practice") {
          setBusinessTab("practice");
        } else if (openParam === "glossary") {
          setBusinessTab("glossary");
        } else if (openParam === "studyspace") {
          handleOpenStudySpace();
        } else if (openParam === "quiz" || openParam === "challenge") {
          setBusinessTab("quick-quiz");
        }
      } catch {}
    }
  }, []);

  // Listen for ESC to close modals / shrink study space
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showFinanceExamModal) setShowFinanceExamModal(false);
        if (showAvatarCustomizerModal) setShowAvatarCustomizerModal(false);
        if (showAchievementsModal) setShowAchievementsModal(false);
        if (isStudySpaceExpanded) setIsStudySpaceExpanded(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showFinanceExamModal, showAvatarCustomizerModal, showAchievementsModal, isStudySpaceExpanded]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

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

  return (
    <div
      className={`min-h-screen flex flex-col justify-between bg-[#FAF9F6] dark:bg-black text-[#1C1917] dark:text-white transition-colors ${
        theme === "dark" ? "dark" : ""
      }`}
    >
      <div>
        {/* Top Navigation Bar */}
        <Header
          activeTab={businessTab}
          setActiveTab={(tab) => setBusinessTab(tab)}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          submissionCount={submissions.length}
          onOpenStudySpace={handleOpenStudySpace}
          onOpenAvatarCustomizer={() => setShowAvatarCustomizerModal(true)}
          onOpenAchievements={() => setShowAchievementsModal(true)}
        />

        {/* View Routing for Business Studies Platform */}
        <main>
          {/* TAB 1: Topical Questions (Sections 1-6) */}
          {businessTab === "practice" && (
            <PracticeStudio
              onSaveSubmission={handleSaveSubmission}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={handleToggleBookmark}
              onOpenFinanceTest={() => setShowFinanceExamModal(true)}
              onOpenQuickQuiz={() => setBusinessTab("quick-quiz")}
              onOpenSections={() => setBusinessTab("sections")}
              initialSectionCode={selectedPracticeSection}
              initialTopicCode={selectedPracticeTopic}
              initialPracticeMode={practiceMode}
              onOpenStudySpace={handleOpenStudySpace}
            />
          )}

          {/* TAB 2: Dedicated Paper 2 Practice Studio (100 Case Studies, Appendices 1-3, Qwen 3.5 0.8B) */}
          {businessTab === "paper2" && (
            <Paper2PracticeView onOpenStudySpace={handleOpenStudySpace} />
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
              onOpenFinanceExam={() => setShowFinanceExamModal(true)}
              onReturnToPractice={() => setBusinessTab("practice")}
            />
          )}

          {/* TAB 4: Daily Quick Quiz */}
          {businessTab === "quick-quiz" && (
            <div className="max-w-4xl mx-auto px-6 py-10 transition-colors">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono font-semibold text-[#8B1E1E] dark:text-[#F87171] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#8B1E1E] dark:bg-[#EF4444]"></span>
                    Cambridge 0264 Active Recall
                  </div>
                  <h1 className="font-academic-serif text-3xl font-bold text-[#0F2042] dark:text-white">
                    EcBiz Quick Quiz
                  </h1>
                  <p className="text-sm text-[#57534E] dark:text-neutral-400">
                    Master essential definitions with randomized active recall drills.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setBusinessTab("glossary")}
                    className="px-3.5 py-2 bg-white dark:bg-neutral-900 border border-[#D6D3D1] dark:border-neutral-700 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-xs font-semibold rounded-lg text-[#0F2042] dark:text-[#38BDF8] transition-colors"
                  >
                    0264 Flashcards 🎴
                  </button>
                  <button
                    onClick={() => setBusinessTab("practice")}
                    className="px-3.5 py-2 bg-[#0F2042] hover:bg-[#1E3A8A] dark:bg-[#38BDF8] dark:hover:bg-[#0284C7] text-white dark:text-[#0F172A] text-xs font-semibold rounded-lg transition-colors"
                  >
                    Practice Studio →
                  </button>
                </div>
              </div>

              <DailyQuickQuiz
                onOpenFullGlossary={() => setBusinessTab("glossary")}
                onOpenStudySpace={handleOpenStudySpace}
              />
            </div>
          )}

          {/* TAB 5: 0264 Syllabus Revision Checklist */}
          {businessTab === "checklist" && (
            <SyllabusRevisionChecklist
              onSelectTopicForPractice={(_subj, secCode, topCode) => {
                setSelectedPracticeSection(secCode);
                setSelectedPracticeTopic(topCode);
                setBusinessTab("practice");
              }}
            />
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

        {/* Finance Exam Pop-up Modal */}
        {showFinanceExamModal && (
          <FinanceExamStudio
            onReturnToPractice={() => setShowFinanceExamModal(false)}
            onSaveSubmission={handleSaveSubmission}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#E7E5E4] dark:border-neutral-800 bg-[#FAF9F6] dark:bg-black py-4 px-6 text-center text-xs text-[#78716C] dark:text-neutral-500">
        <p>EcBiz • Powered by Local in-Browser Qwen 3.5 0.8B AI</p>
      </footer>
    </div>
  );
}

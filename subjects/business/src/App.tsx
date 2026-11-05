import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { SubjectSelectionStartPage } from "./components/SubjectSelectionStartPage";
import { PracticeStudio } from "./components/PracticeStudio";
import { GlossaryView } from "./components/GlossaryView";
import { DocumentArchive } from "./components/DocumentArchive";
import { EconomicsStudio } from "./components/EconomicsStudio";
import { EconomicsCoOp } from "./components/EconomicsCoOp";
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
  loadSelectedSubject,
  saveBookmarkedQuestionIds,
  saveMasteredTerms,
  saveSubmissions,
  saveTheme,
  saveSelectedSubject,
} from "./lib/cookies";
import { StudentSubmissionRecord } from "./lib/types";

export default function App() {
  const [selectedSubject, setSelectedSubject] = useState<"business" | "econs" | null>(() => {
    if (typeof window !== "undefined") {
      return loadSelectedSubject();
    }
    return null;
  });
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return loadTheme();
    }
    return "light";
  });

  // Tab state within active subject
  // Business tabs: "practice" | "quick-quiz" | "sections" | "checklist" | "glossary" | "archive" | "progress" | "boss-battle"
  // Economics tabs: "econs-practice" | "econs-diagrams" | "econs-glossary" | "econs-branch"
  const [businessTab, setBusinessTab] = useState<"practice" | "quick-quiz" | "sections" | "checklist" | "glossary" | "archive" | "progress" | "boss-battle">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ecbiz_business_tab");
      if (saved && ["practice", "quick-quiz", "sections", "checklist", "glossary", "archive", "progress", "boss-battle"].includes(saved)) {
        return saved as any;
      }
    }
    return "practice";
  });
  const [econsTab, setEconsTab] = useState<"econs-practice" | "econs-diagrams" | "econs-glossary" | "econs-branch">("econs-practice");

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ecbiz_business_tab", businessTab);
    }
  }, [businessTab]);

  // Practice Studio initial mode: "paper1_database" (topical) | "verified_archive" (official past papers) | "paper2_case_study"
  const [practiceMode, setPracticeMode] = useState<"paper1_database" | "paper2_case_study" | "verified_archive">("paper1_database");

  // Finance Exam Pop-up Modal State
  const [showFinanceExamModal, setShowFinanceExamModal] = useState<boolean>(false);
  // Scholar Avatar Wardrobe & Customizer Modal State
  const [showAvatarCustomizerModal, setShowAvatarCustomizerModal] = useState<boolean>(false);
  // Achievements & Milestones Modal State
  const [showAchievementsModal, setShowAchievementsModal] = useState<boolean>(false);
  // Persistent Study Space State: Expanded (fullscreen) vs Minimized (movable floating widget)
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
        if (openParam === "practice") {
          setSelectedSubject("business");
          setBusinessTab("practice");
        } else if (openParam === "glossary") {
          setSelectedSubject("business");
          setBusinessTab("glossary");
        } else if (openParam === "studyspace") {
          handleOpenStudySpace();
        } else if (openParam === "quiz" || openParam === "challenge") {
          setSelectedSubject("business");
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

  const handleSelectSubject = (subj: "business" | "econs") => {
    setSelectedSubject(subj);
    saveSelectedSubject(subj);
    if (subj === "business") setBusinessTab("practice");
    if (subj === "econs") setEconsTab("econs-practice");
  };

  const handleSelectBusinessSection = (sectionCode: string, topicCode?: string) => {
    setSelectedSubject("business");
    saveSelectedSubject("business");
    setSelectedPracticeSection(sectionCode);
    if (topicCode) setSelectedPracticeTopic(topicCode);
    setBusinessTab("practice");
    if (["1", "2", "3", "4"].includes(sectionCode)) {
      setPracticeMode("paper1_database");
    } else {
      setPracticeMode("verified_archive");
    }
  };

  const handleSelectEconsSection = (unitCode: string, chapterCode?: string) => {
    setSelectedSubject("econs");
    saveSelectedSubject("econs");
    setEconsTab("econs-practice");
  };

  const handleReturnToSubjectSelection = () => {
    setSelectedSubject(null);
    saveSelectedSubject(null);
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

  // If no subject selected yet, show dedicated Subject Selection Start Page with SECTIONS FIRST
  if (!selectedSubject) {
    return (
      <>
        <div className={`min-h-screen ${theme === "dark" ? "dark bg-black text-white" : "bg-[#FAF9F6] text-[#1C1917]"}`}>
          <SubjectSelectionStartPage
            onSelectBusiness={() => {
              handleSelectSubject("business");
              setBusinessTab("practice");
              setPracticeMode("paper1_database");
            }}
            onSelectBusinessSection={handleSelectBusinessSection}
            onSelectEconsSection={handleSelectEconsSection}
            onOpenFinanceExam={() => setShowFinanceExamModal(true)}
            onSelectOfficialPastPapers={() => {
              handleSelectSubject("business");
              setBusinessTab("practice");
              setPracticeMode("verified_archive");
            }}
            onSelectPaper2={() => {
              handleSelectSubject("business");
              setBusinessTab("practice");
              setPracticeMode("paper2_case_study");
            }}
            onOpenBusinessGlossary={() => {
              handleSelectSubject("business");
              setBusinessTab("glossary");
            }}
            onSelectEcons={() => {
              handleSelectSubject("econs");
              setEconsTab("econs-practice");
            }}
            onSelectEconsDiagrams={() => {
              handleSelectSubject("econs");
              setEconsTab("econs-diagrams");
            }}
            onSelectEconsGlossary={() => {
              handleSelectSubject("econs");
              setEconsTab("econs-glossary");
            }}
            onSelectEconsBranch={() => {
              handleSelectSubject("econs");
              setEconsTab("econs-branch");
            }}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            onOpenStudySpace={handleOpenStudySpace}
            onOpenAvatarCustomizer={() => setShowAvatarCustomizerModal(true)}
            onOpenAchievements={() => setShowAchievementsModal(true)}
          />
        </div>

        {/* Persistent Study Space Component (Fullscreen Realm or Movable Draggable Mini Widget) */}
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
      </>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col justify-between bg-[#FAF9F6] dark:bg-black text-[#1C1917] dark:text-white transition-colors ${theme === "dark" ? "dark" : ""}`}
    >
      <div>
        {/* Top Navigation Bar: SOLELY for the active subject */}
        <Header
          currentSubject={selectedSubject}
          activeTab={selectedSubject === "business" ? businessTab : econsTab}
          setActiveTab={(tab) => {
            if (selectedSubject === "business") {
              setBusinessTab(tab);
            } else {
              setEconsTab(tab);
            }
          }}
          onSwitchSubject={handleReturnToSubjectSelection}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          submissionCount={submissions.length}
          onOpenStudySpace={handleOpenStudySpace}
          onOpenAvatarCustomizer={() => setShowAvatarCustomizerModal(true)}
          onOpenAchievements={() => setShowAchievementsModal(true)}
        />

        {/* View Routing for Business */}
        {selectedSubject === "business" && (
          <main>
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

            {businessTab === "quick-quiz" && (
              <div className="max-w-4xl mx-auto px-6 py-10 transition-colors">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-mono font-semibold text-[#8B1E1E] dark:text-[#F87171] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#8B1E1E] dark:bg-[#EF4444]"></span>
                      Cambridge 0264 Active Recall
                    </div>
                    <h1 className="font-academic-serif text-3xl font-bold text-[#0F2042] dark:text-white">
                      Business Quick Quiz
                    </h1>
                    <p className="text-sm text-[#57534E] dark:text-neutral-400">
                      Master essential 2-mark definitions with randomized 3-question active recall drills.
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

            {businessTab === "checklist" && (
              <SyllabusRevisionChecklist
                initialSubject="business"
                onSelectTopicForPractice={(subject, secCode, topCode) => {
                  setSelectedPracticeSection(secCode);
                  setSelectedPracticeTopic(topCode);
                  setBusinessTab("practice");
                }}
              />
            )}

            {businessTab === "glossary" && (
              <GlossaryView
                masteredIds={masteredTerms}
                onToggleMastered={handleToggleMastered}
                onOpenQuickQuiz={() => setBusinessTab("quick-quiz")}
              />
            )}

            {businessTab === "archive" && <DocumentArchive />}

            {businessTab === "progress" && (
              <ProgressDashboard
                submissions={submissions}
                masteredTermsCount={masteredTerms.length}
                totalTermsCount={GLOSSARY_TERMS.length}
                onClearSubmissions={handleClearSubmissions}
                onSelectPractice={() => setBusinessTab("practice")}
              />
            )}

            {businessTab === "boss-battle" && (
              <BossBattleArena
                onBackToStudio={() => setBusinessTab("practice")}
              />
            )}
          </main>
        )}

        {/* View Routing for Economics */}
        {selectedSubject === "econs" && (
          <main>
            {(econsTab === "econs-practice" ||
              econsTab === "econs-diagrams" ||
              econsTab === "econs-glossary") && <EconomicsStudio />}

            {econsTab === "econs-branch" && <EconomicsCoOp />}
          </main>
        )}
      </div>

      {/* Quiet Scholastic Footer */}
      <footer className="border-t border-[#E7E5E4] dark:border-neutral-800 py-8 px-6 lg:px-12 bg-white dark:bg-neutral-900 mt-16 text-xs text-[#78716C] dark:text-neutral-400 transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-academic-serif font-bold text-[#0F2042] dark:text-[#38BDF8]">
              EcBiz Study
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {selectedSubject === "business"
                ? "Cambridge Business (0264) Studio"
                : "Cambridge Economics (0455 / 2281) Studio"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[#57534E] dark:text-neutral-400">
            <a
              href="https://forms.gle/6X2CAR1LkSQGRBx68"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0F2042] dark:text-[#38BDF8] hover:underline transition-colors inline-flex items-center gap-1 font-semibold"
            >
              <span>💡 Report Bug / Improvement</span>
              <span className="text-[10px] opacity-75">↗</span>
            </a>
            <button
              onClick={handleReturnToSubjectSelection}
              className="hover:text-[#0F2042] dark:hover:text-[#38BDF8] transition-colors cursor-pointer"
            >
              Switch Subject
            </button>
            {selectedSubject === "business" && (
              <a
                href="https://quizlet.com/user/Jayden_TAN53/folders/business-studies-0264"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#0F2042] dark:hover:text-[#38BDF8] transition-colors"
              >
                Quizlet Folders ↗
              </a>
            )}
            <button
              onClick={handleToggleTheme}
              className="hover:text-[#0F2042] dark:hover:text-[#38BDF8] transition-colors cursor-pointer"
            >
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      </footer>

      {/* Finance Exam Pop-up Modal */}
      {showFinanceExamModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="finance-exam-title"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-start justify-center p-3 sm:p-5 md:p-8"
        >
          {/* Overlay Backdrop Click area */}
          <div
            className="fixed inset-0 -z-10"
            onClick={() => setShowFinanceExamModal(false)}
          />

          <div className="relative bg-[#FAF9F6] dark:bg-black border border-[#E7E5E4] dark:border-neutral-800 rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Top Bar */}
            <div className="bg-[#0F2042] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-blue-900/50 sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-lg">📝</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-[#0F172A] text-[10px] font-mono font-bold uppercase tracking-wider">
                      Pop-up Benchmark Exam
                    </span>
                    <span className="text-xs text-blue-200 font-mono">Topics 5.1 & 5.2</span>
                  </div>
                  <h2 id="finance-exam-title" className="font-academic-serif text-lg sm:text-xl font-bold text-white">
                    Paper 2 Finance Benchmark Examination
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-blue-200 font-mono hidden md:inline">
                  Press ESC or click button to exit
                </span>
                <button
                  onClick={() => setShowFinanceExamModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-white/15"
                >
                  <span>✕ Close Pop-up</span>
                </button>
              </div>
            </div>

            {/* Modal Body: Full-featured Finance Exam Studio */}
            <div className="p-4 sm:p-6 max-h-[82vh] overflow-y-auto">
              <FinanceExamStudio
                onSaveSubmission={handleSaveSubmission}
                onReturnToPractice={() => setShowFinanceExamModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Persistent Aesthetic Study Space: Fullscreen Realm or Movable Draggable Mini Widget */}
      <StudySpace
        isExpanded={isStudySpaceExpanded}
        onToggleExpand={setIsStudySpaceExpanded}
        isVisible={isStudySpaceActive}
        onClose={handleCloseStudySpaceWidget}
        onOpenAchievements={() => setShowAchievementsModal(true)}
      />

      {/* Global Scholar Avatar Wardrobe & Customizer Modal */}
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
  );
}

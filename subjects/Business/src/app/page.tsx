"use client";

import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { SubjectSelectionStartPage } from "../components/SubjectSelectionStartPage";
import { PracticeStudio } from "../components/PracticeStudio";
import { GlossaryView } from "../components/GlossaryView";
import { DocumentArchive } from "../components/DocumentArchive";
import { EconomicsStudio } from "../components/EconomicsStudio";
import { EconomicsCoOp } from "../components/EconomicsCoOp";
import { ProgressDashboard } from "../components/ProgressDashboard";
import { FinanceExamStudio } from "../components/FinanceExamStudio";
import { DailyQuickQuiz } from "../components/DailyQuickQuiz";
import { SectionsView } from "../components/SectionsView";
import { GLOSSARY_TERMS } from "../lib/data/glossary";
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
} from "../lib/cookies";
import { StudentSubmissionRecord } from "../lib/types";

export default function Home() {
  const [selectedSubject, setSelectedSubject] = useState<"business" | "econs" | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Tab state within active subject
  // Business tabs: "practice" | "quick-quiz" | "sections" | "glossary" | "archive" | "progress"
  // Economics tabs: "econs-practice" | "econs-diagrams" | "econs-glossary" | "econs-branch"
  const [businessTab, setBusinessTab] = useState<"practice" | "quick-quiz" | "sections" | "glossary" | "archive" | "progress">("practice");
  const [econsTab, setEconsTab] = useState<"econs-practice" | "econs-diagrams" | "econs-glossary" | "econs-branch">("econs-practice");

  // Finance Exam Pop-up Modal State
  const [showFinanceExamModal, setShowFinanceExamModal] = useState<boolean>(false);
  const [selectedPracticeSection, setSelectedPracticeSection] = useState<string>("5");
  const [selectedPracticeTopic, setSelectedPracticeTopic] = useState<string | undefined>("5.1");

  // Persistent States via permanent cookies
  const [submissions, setSubmissions] = useState<StudentSubmissionRecord[]>([]);
  const [masteredTerms, setMasteredTerms] = useState<string[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from cookies on mount
  useEffect(() => {
    const savedSubject = loadSelectedSubject();
    const savedTheme = loadTheme();
    setSelectedSubject(savedSubject);
    setTheme(savedTheme);

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    setSubmissions(loadSubmissions());
    setMasteredTerms(loadMasteredTerms());
    setBookmarkedIds(loadBookmarkedQuestionIds());
    setIsLoaded(true);
  }, []);

  const handleToggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    saveTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSelectSubject = (subj: "business" | "econs") => {
    setSelectedSubject(subj);
    saveSelectedSubject(subj);
    if (subj === "business") setBusinessTab("practice");
    if (subj === "econs") setEconsTab("econs-practice");
  };

  const handleReturnToSubjectSelection = () => {
    setSelectedSubject(null);
    saveSelectedSubject(null);
  };

  const handleSaveSubmission = (record: StudentSubmissionRecord) => {
    const updated = [record, ...submissions];
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

  // If no subject selected yet, show dedicated Subject Selection Start Page
  if (!selectedSubject) {
    return (
      <div className={theme === "dark" ? "dark" : ""} suppressHydrationWarning>
        <SubjectSelectionStartPage
          onSelectBusiness={() => handleSelectSubject("business")}
          onSelectEcons={() => handleSelectSubject("econs")}
          onOpenBusinessGlossary={() => {
            handleSelectSubject("business");
            setBusinessTab("glossary");
          }}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col justify-between bg-[#FAF9F6] dark:bg-[#0C1322] text-[#1C1917] dark:text-[#E2E8F0] transition-colors ${theme === "dark" ? "dark" : ""}`}
      suppressHydrationWarning
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
        />

        {/* View Routing for Business Studies */}
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
                    <h1 className="font-academic-serif text-3xl font-bold text-[#0F2042] dark:text-[#F1F5F9]">
                      Business Studies Quick Quiz
                    </h1>
                    <p className="text-sm text-[#57534E] dark:text-[#94A3B8]">
                      Master essential 2-mark definitions with randomized 3-question active recall drills.
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setBusinessTab("glossary")}
                      className="px-3.5 py-2 bg-white dark:bg-[#162032] border border-[#D6D3D1] dark:border-[#334155] hover:bg-[#F5F5F4] dark:hover:bg-[#1E293B] text-xs font-semibold rounded-lg text-[#0F2042] dark:text-[#38BDF8] transition-colors"
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

                <DailyQuickQuiz onOpenFullGlossary={() => setBusinessTab("glossary")} />
              </div>
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
      <footer className="border-t border-[#E7E5E4] dark:border-[#1E293B] py-8 px-6 lg:px-12 bg-white dark:bg-[#162032] mt-16 text-xs text-[#78716C] dark:text-[#94A3B8] transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-academic-serif font-bold text-[#0F2042] dark:text-[#38BDF8]">
              EcBiz Study
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {selectedSubject === "business"
                ? "Cambridge Business Studies (0264 / 0450) Studio"
                : "Cambridge Economics (0455 / 2281) Studio"}
            </span>
          </div>

          <div className="flex items-center gap-6 text-[#57534E] dark:text-[#94A3B8]">
            <button
              onClick={handleReturnToSubjectSelection}
              className="hover:text-[#0F2042] dark:hover:text-[#38BDF8] transition-colors"
            >
              Switch Subject
            </button>
            <a
              href="https://quizlet.com/user/Jayden_TAN53/folders/business-studies-0264"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0F2042] dark:hover:text-[#38BDF8] transition-colors"
            >
              Quizlet Folders ↗
            </a>
            <button
              onClick={handleToggleTheme}
              className="hover:text-[#0F2042] dark:hover:text-[#38BDF8] transition-colors"
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
          aria-labelledby="modal-finance-title"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-start justify-center p-3 sm:p-5 md:p-8"
        >
          <div
            className="fixed inset-0 -z-10"
            onClick={() => setShowFinanceExamModal(false)}
          />

          <div className="relative bg-[#FAF9F6] dark:bg-[#0C1322] border border-[#E7E5E4] dark:border-[#1E293B] rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
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
                  <h2 id="modal-finance-title" className="font-academic-serif text-lg sm:text-xl font-bold text-white">
                    Paper 2 Finance Benchmark Examination
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFinanceExamModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-white/15"
                >
                  <span>✕ Close Pop-up</span>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 max-h-[82vh] overflow-y-auto">
              <FinanceExamStudio
                onSaveSubmission={handleSaveSubmission}
                onReturnToPractice={() => setShowFinanceExamModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

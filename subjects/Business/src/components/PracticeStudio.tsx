"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Blueprint,
  DynamicScenario,
  EvaluationResult,
  MarkTier,
  PaperNumber,
  QuestionRubric,
  StudentSubmissionRecord,
} from "../lib/types";
import { BLUEPRINTS, generateScenario } from "../lib/data/blueprints";
import { VERIFIED_QUESTIONS, VerifiedQuestion } from "../lib/data/verified-questions";
import {
  SYLLABUS_SECTIONS,
  getTopicsForSection,
  getTopicByCode,
  SyllabusTopic,
} from "../lib/data/syllabus-topics";
import {
  OFFICIAL_2027_SPECIMEN_PAPER_2,
  getAllPaper2CaseStudies,
  Paper2CaseStudy,
  Paper2QuestionPart,
} from "../lib/data/paper2-case-studies";
import { evaluateStudentEssay } from "../lib/engine/evaluator";
import { checkWebGPUSupport, initializeWebLLM, WebLLMStatus } from "../lib/engine/webllm";
import { formatTime } from "../lib/utils";
import { FocusTimer } from "./FocusTimer";

interface PracticeStudioProps {
  onSaveSubmission: (record: StudentSubmissionRecord) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
  onOpenFinanceTest?: () => void;
  onOpenQuickQuiz?: () => void;
  onOpenSections?: () => void;
  initialSectionCode?: string;
  initialTopicCode?: string;
}

export function PracticeStudio({
  onSaveSubmission,
  bookmarkedIds,
  onToggleBookmark,
  onOpenFinanceTest,
  onOpenQuickQuiz,
  onOpenSections,
  initialSectionCode,
  initialTopicCode,
}: PracticeStudioProps) {
  // Navigation / Practice Mode
  // "topical_practice" = Practice by Paper 1 or Paper 2 with explicit 2m/4m/6m/8m/12m mark tiers
  // "paper2_case_study" = Authentic Paper 2 with full-length Case Study Insert & 8m/12m questions
  // "verified_archive" = Browse verified past paper questions
  const [practiceMode, setPracticeMode] = useState<"topical_practice" | "paper2_case_study" | "verified_archive">(
    "topical_practice"
  );

  // Focus Timer toggle state
  const [showFocusTimer, setShowFocusTimer] = useState<boolean>(true);

  // Paper & Mark Tier Selection States
  const [selectedPaper, setSelectedPaper] = useState<PaperNumber>(1);
  const [selectedMarkTier, setSelectedMarkTier] = useState<MarkTier>(4);
  const [selectedSectionCode, setSelectedSectionCode] = useState<string>(initialSectionCode || "1");
  const [selectedTopicCode, setSelectedTopicCode] = useState<string>(initialTopicCode || "1.1");

  // Sync initial props if changed from parent
  useEffect(() => {
    if (initialSectionCode) {
      setSelectedSectionCode(initialSectionCode);
      if (initialTopicCode) {
        setSelectedTopicCode(initialTopicCode);
      } else {
        const topics = getTopicsForSection(initialSectionCode);
        if (topics.length > 0) setSelectedTopicCode(topics[0].code);
      }
      setPracticeMode("topical_practice");
    }
  }, [initialSectionCode, initialTopicCode]);

  // Paper 2 Case Study States
  const paper2Studies = getAllPaper2CaseStudies();
  const [selectedCaseStudyId, setSelectedCaseStudyId] = useState<string>(OFFICIAL_2027_SPECIMEN_PAPER_2.id);
  const activeCaseStudy: Paper2CaseStudy =
    paper2Studies.find((c) => c.id === selectedCaseStudyId) || OFFICIAL_2027_SPECIMEN_PAPER_2;
  const [activeCaseTab, setActiveCaseTab] = useState<"overview" | "workforce" | "app1" | "app2" | "app3" | "hooks">("overview");
  const [activePaper2QIndex, setActivePaper2QIndex] = useState<number>(0);
  const activePaper2Question: Paper2QuestionPart =
    activeCaseStudy.questions[activePaper2QIndex] || activeCaseStudy.questions[0];

  // Dynamic Blueprint Scenario state
  const [currentDynamicScenario, setCurrentDynamicScenario] = useState<DynamicScenario | null>(null);

  // Verified Question state
  const [currentVerifiedIndex, setCurrentVerifiedIndex] = useState<number>(0);
  const [filteredVerifiedList, setFilteredVerifiedList] = useState<VerifiedQuestion[]>([]);

  // Student Answering & Evaluation States
  const [studentAnswer, setStudentAnswer] = useState<string>("");
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [showRubric, setShowRubric] = useState<boolean>(false);

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // WebLLM State
  const [aiEngineType, setAiEngineType] = useState<"instant" | "webllm">("instant");
  const [webllmStatus, setWebllmStatus] = useState<WebLLMStatus>({
    isSupported: false,
    isLoading: false,
    isReady: false,
    progressText: "",
    progressPercent: 0,
    error: null,
  });
  const [webllmEngine, setWebllmEngine] = useState<any>(null);

  // Topics for current section
  const availableTopics = getTopicsForSection(selectedSectionCode);
  const activeTopicInfo: SyllabusTopic | undefined = getTopicByCode(selectedTopicCode);

  // Initialize WebGPU detection
  useEffect(() => {
    checkWebGPUSupport().then((supported) => {
      setWebllmStatus((prev) => ({ ...prev, isSupported: supported }));
    });
  }, []);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  // When section changes, default topic to first topic in that section
  const handleSectionChange = (newSecCode: string) => {
    setSelectedSectionCode(newSecCode);
    const topics = getTopicsForSection(newSecCode);
    if (topics.length > 0) {
      setSelectedTopicCode(topics[0].code);
    } else {
      setSelectedTopicCode("all");
    }
  };

  // Reload question when filters change
  useEffect(() => {
    if (practiceMode === "topical_practice") {
      generateTopicalQuestion();
    } else if (practiceMode === "verified_archive") {
      filterVerifiedQuestions();
    }
    setStudentAnswer("");
    setEvaluationResult(null);
    setTimerSeconds(0);
    setTimerRunning(false);
  }, [selectedSectionCode, selectedTopicCode, selectedMarkTier, selectedPaper, practiceMode]);

  // Generate topical question
  const generateTopicalQuestion = () => {
    const scenario = generateScenario(undefined, selectedMarkTier, selectedPaper);
    setCurrentDynamicScenario(scenario);
  };

  // Filter verified past questions
  const filterVerifiedQuestions = () => {
    const list = VERIFIED_QUESTIONS.filter((q) => {
      const matchMark = q.marks === selectedMarkTier;
      const matchPaper = q.paper === selectedPaper;
      return matchMark && matchPaper;
    });
    setFilteredVerifiedList(list.length > 0 ? list : VERIFIED_QUESTIONS.slice(0, 10));
    setCurrentVerifiedIndex(0);
  };

  // Switch Paper 2 Question
  const handleSelectPaper2Question = (index: number) => {
    setActivePaper2QIndex(index);
    setStudentAnswer("");
    setEvaluationResult(null);
    setTimerSeconds(0);
    setTimerRunning(false);
  };

  // Load WebLLM
  const handleLoadWebLLM = async () => {
    const engine = await initializeWebLLM((status) => {
      setWebllmStatus(status);
    });
    if (engine) {
      setWebllmEngine(engine);
      setAiEngineType("webllm");
    }
  };

  // Submit Evaluation
  const handleSubmitEvaluation = async () => {
    if (!studentAnswer.trim()) return;

    setIsEvaluating(true);
    setTimerRunning(false);

    try {
      let title = "";
      let prompt = "";
      let context = "";
      let rubric: QuestionRubric;
      let questionId = "";
      let unit = "";
      let targetMarks = selectedMarkTier;

      if (practiceMode === "paper2_case_study") {
        title = `${activeCaseStudy.businessName} — ${activePaper2Question.partNumber} (${activePaper2Question.marks} marks)`;
        prompt = activePaper2Question.questionText;
        context = `${activeCaseStudy.businessName} (${activeCaseStudy.businessType}, ${activeCaseStudy.industry}). ${activeCaseStudy.overviewSummary}\n${activeCaseStudy.operationsAndWorkforce}`;
        questionId = activePaper2Question.id;
        targetMarks = activePaper2Question.marks as MarkTier;
        unit = `Topic ${activePaper2Question.topicCode}`;

        rubric = {
          totalMarks: activePaper2Question.marks,
          ao1Max: activePaper2Question.rubric.ao1Max,
          ao2Max: activePaper2Question.rubric.ao2Max,
          ao3Max: activePaper2Question.rubric.ao3Max,
          ao4Max: activePaper2Question.rubric.ao4Max,
          descriptors: {
            ao1: ["Demonstrates accurate Cambridge business terminology."],
            ao2: ["Explicitly applies points to specific case facts, numbers, or characters."],
            ao3: ["Develops multi-step causal analytical chains ('this leads to... as a result...')."],
          },
          indicativeContent: activePaper2Question.rubric.indicativeContent,
          sampleStrongPoint: activePaper2Question.rubric.sampleStrongAnswer,
        };
      } else if (practiceMode === "topical_practice" && currentDynamicScenario) {
        title = currentDynamicScenario.title;
        prompt = currentDynamicScenario.questionPrompt;
        context = `${currentDynamicScenario.businessName} (${currentDynamicScenario.businessType}, ${currentDynamicScenario.industry}). ${currentDynamicScenario.scenarioContext}`;
        rubric = currentDynamicScenario.rubric;
        questionId = currentDynamicScenario.id;
        unit = currentDynamicScenario.unit;
        targetMarks = currentDynamicScenario.marks;
      } else {
        const vq = filteredVerifiedList[currentVerifiedIndex] || VERIFIED_QUESTIONS[0];
        title = `${vq.syllabus} ${vq.paper_code} Q${vq.question} (${vq.marks} marks)`;
        prompt = vq.question_paraphrase;
        context = vq.case_context || "General Cambridge business scenario.";
        questionId = vq.id;
        unit = vq.unit;
        targetMarks = vq.marks as MarkTier;

        const bp = BLUEPRINTS.find((b) => b.marks === vq.marks) || BLUEPRINTS[0];
        rubric = bp.rubric;
      }

      const result = await evaluateStudentEssay({
        questionTitle: title,
        questionPrompt: prompt,
        caseContext: context,
        marks: targetMarks,
        rubric,
        studentAnswer,
        webllmEngine: aiEngineType === "webllm" ? webllmEngine : undefined,
      });

      setEvaluationResult(result);

      // Save submission record
      const record: StudentSubmissionRecord = {
        id: `sub-${Date.now()}`,
        questionId,
        questionTitle: title,
        marks: targetMarks,
        paper: practiceMode === "paper2_case_study" ? 2 : selectedPaper,
        syllabus: "0264",
        unit,
        studentAnswer,
        wordCount: studentAnswer.trim().split(/\s+/).length,
        timeSpentSeconds: timerSeconds,
        result,
        timestamp: new Date().toISOString(),
      };
      onSaveSubmission(record);

      if (result.percentage >= 70) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } catch (err) {
      console.error("Evaluation error:", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const wordCount = studentAnswer.trim() ? studentAnswer.trim().split(/\s+/).length : 0;
  const currentActiveId =
    practiceMode === "paper2_case_study"
      ? activePaper2Question.id
      : practiceMode === "topical_practice"
      ? currentDynamicScenario?.id || ""
      : filteredVerifiedList[currentVerifiedIndex]?.id || "";
  const isBookmarked = bookmarkedIds.includes(currentActiveId);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 transition-colors">
      {/* Pop-up Exam Quick Launcher */}
      {onOpenFinanceTest && (
        <div className="mb-6 p-3.5 bg-gradient-to-r from-emerald-950/80 via-[#0F2042] to-slate-900 border border-emerald-500/30 text-white rounded-xl shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-base shrink-0">📝</span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-[#0F172A] text-[9px] font-mono font-bold uppercase">
                Pop-up Benchmark Exam
              </span>
              <span className="font-academic-serif font-bold text-xs text-white">
                Paper 2 Finance Test (Topics 5.1 & 5.2: Needs, Sources & Cash-Flow)
              </span>
            </div>
          </div>
          <button
            onClick={onOpenFinanceTest}
            className="px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold text-xs rounded-lg transition-all shrink-0 shadow-xs whitespace-nowrap"
          >
            Launch Pop-up ↗
          </button>
        </div>
      )}

      {/* Main Mode Switcher Deck */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-academic-serif text-3xl font-bold text-[#0F2042] dark:text-[#F1F5F9]">
            CIE Business Practice Studio
          </h1>
          <p className="text-sm text-[#57534E] dark:text-[#94A3B8]">
            Cambridge 0264 / 0450 · Authentic Paper 2 Case Studies & Topical Syllabus Engine
          </p>
        </div>

        {/* Focus Timer & Engine Selectors */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowFocusTimer(!showFocusTimer)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1.5 ${
              showFocusTimer
                ? "bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0F172A] border-[#0F2042] dark:border-[#38BDF8] shadow-sm"
                : "bg-white dark:bg-[#162032] text-[#1C1917] dark:text-[#E2E8F0] border-[#D6D3D1] dark:border-[#334155] hover:bg-[#F5F5F4]"
            }`}
          >
            <span>⏱ Focus Countdown</span>
            <span className="text-[10px] opacity-80">{showFocusTimer ? "Hide" : "Show"}</span>
          </button>

          {/* Engine Selector */}
          <div className="flex items-center gap-2 bg-[#F5F5F4] dark:bg-[#1E293B] p-1.5 rounded-lg border border-[#E7E5E4] dark:border-[#334155] text-xs">
            <button
              onClick={() => setAiEngineType("instant")}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
                aiEngineType === "instant"
                  ? "bg-white dark:bg-[#0F172A] text-[#0F2042] dark:text-[#38BDF8] shadow-sm font-semibold"
                  : "text-[#57534E] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-white"
              }`}
            >
              Instant CIE Examiner
            </button>
            <button
              onClick={() => {
                if (!webllmEngine && webllmStatus.isSupported) {
                  handleLoadWebLLM();
                } else if (webllmEngine) {
                  setAiEngineType("webllm");
                }
              }}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
                aiEngineType === "webllm"
                  ? "bg-white dark:bg-[#0F172A] text-[#0F2042] dark:text-[#38BDF8] shadow-sm font-semibold"
                  : "text-[#57534E] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-white"
              }`}
            >
              Local Qwen 2.5 WebGPU
            </button>
          </div>
        </div>
      </div>

      {/* Focus Timer Component */}
      {showFocusTimer && (
        <div className="mb-8">
          <FocusTimer />
        </div>
      )}

      {/* Practice Mode Selector Tabs */}
      <div className="flex flex-wrap items-center gap-3 p-1.5 bg-[#F5F5F4] dark:bg-[#1E293B] rounded-xl border border-[#E7E5E4] dark:border-[#334155] mb-8 text-xs font-medium">
        <button
          onClick={() => setPracticeMode("paper2_case_study")}
          className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
            practiceMode === "paper2_case_study"
              ? "bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0C1322] font-bold shadow-sm"
              : "text-[#57534E] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-white"
          }`}
        >
          <span>📋 2027 Official Paper 2 Case Study</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/20 dark:bg-black/20">
            Tasty Treats (TT)
          </span>
        </button>

        <button
          onClick={() => setPracticeMode("topical_practice")}
          className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
            practiceMode === "topical_practice"
              ? "bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0C1322] font-bold shadow-sm"
              : "text-[#57534E] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-white"
          }`}
        >
          <span>🔍 Topical Questions by Syllabus</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
            Sections 1–6 Dropdown
          </span>
        </button>

        <button
          onClick={() => setPracticeMode("verified_archive")}
          className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
            practiceMode === "verified_archive"
              ? "bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0C1322] font-bold shadow-sm"
              : "text-[#57534E] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-white"
          }`}
        >
          <span>📚 Verified Past Paper Bank (189 Questions)</span>
        </button>

        <div className="ml-auto flex items-center gap-2">
          {onOpenSections && (
            <button
              onClick={onOpenSections}
              className="px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 text-sky-800 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60"
            >
              <span>📑 Sections (1–6)</span>
            </button>
          )}

          {onOpenQuickQuiz && (
            <button
              onClick={onOpenQuickQuiz}
              className="px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60"
            >
              <span>⚡ Quick Quiz</span>
            </button>
          )}
        </div>
      </div>

      {/* MODE 1: PAPER 2 CASE STUDY ENGINE (2027 SPECIMEN CASE INSERT) */}
      {practiceMode === "paper2_case_study" && (
        <div className="space-y-8">
          {/* Case Study Header & Insert Viewer */}
          <div className="bg-white dark:bg-[#162032] border border-[#E7E5E4] dark:border-[#1E293B] rounded-2xl p-6 lg:p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E7E5E4] dark:border-[#1E293B]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-mono font-bold text-xs uppercase">
                    Official Cambridge Paper 2 Insert
                  </span>
                  <span className="text-xs text-[#78716C] dark:text-[#94A3B8] font-mono">
                    {activeCaseStudy.session}
                  </span>
                </div>
                <h2 className="font-academic-serif text-2xl font-bold text-[#0F2042] dark:text-[#F1F5F9]">
                  {activeCaseStudy.title}
                </h2>
                <p className="text-xs text-[#57534E] dark:text-[#94A3B8] mt-0.5">
                  Business: {activeCaseStudy.businessName} · Legal Status: {activeCaseStudy.businessType} · Sector: {activeCaseStudy.industry}
                </p>
              </div>

              {/* Case study selector if more than 1 */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#78716C] dark:text-[#94A3B8]">Select Case:</span>
                <select
                  value={selectedCaseStudyId}
                  onChange={(e) => {
                    setSelectedCaseStudyId(e.target.value);
                    setActivePaper2QIndex(0);
                  }}
                  className="px-3 py-1.5 text-xs rounded-lg border border-[#E7E5E4] dark:border-[#334155] bg-[#FAF9F6] dark:bg-[#0C1322] text-[#1C1917] dark:text-[#E2E8F0] font-medium"
                >
                  {paper2Studies.map((cs) => (
                    <option key={cs.id} value={cs.id}>
                      {cs.businessName} ({cs.year} {cs.syllabus})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Case Study Insert Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-2 border-b border-[#E7E5E4] dark:border-[#1E293B] text-xs">
              <button
                onClick={() => setActiveCaseTab("overview")}
                className={`px-3 py-2 border-b-2 font-medium transition-all ${
                  activeCaseTab === "overview"
                    ? "border-[#0F2042] dark:border-[#38BDF8] text-[#0F2042] dark:text-[#38BDF8] font-bold"
                    : "border-transparent text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917]"
                }`}
              >
                📖 Business Background & Story
              </button>
              <button
                onClick={() => setActiveCaseTab("workforce")}
                className={`px-3 py-2 border-b-2 font-medium transition-all ${
                  activeCaseTab === "workforce"
                    ? "border-[#0F2042] dark:border-[#38BDF8] text-[#0F2042] dark:text-[#38BDF8] font-bold"
                    : "border-transparent text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917]"
                }`}
              >
                👥 Workforce, Costs & Expansion
              </button>
              <button
                onClick={() => setActiveCaseTab("app1")}
                className={`px-3 py-2 border-b-2 font-medium transition-all ${
                  activeCaseTab === "app1"
                    ? "border-[#0F2042] dark:border-[#38BDF8] text-[#0F2042] dark:text-[#38BDF8] font-bold"
                    : "border-transparent text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917]"
                }`}
              >
                📊 Appendix 1: Balance Sheet 2024 vs 2025
              </button>
              <button
                onClick={() => setActiveCaseTab("app2")}
                className={`px-3 py-2 border-b-2 font-medium transition-all ${
                  activeCaseTab === "app2"
                    ? "border-[#0F2042] dark:border-[#38BDF8] text-[#0F2042] dark:text-[#38BDF8] font-bold"
                    : "border-transparent text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917]"
                }`}
              >
                📝 Appendix 2: Operations Memo
              </button>
              <button
                onClick={() => setActiveCaseTab("app3")}
                className={`px-3 py-2 border-b-2 font-medium transition-all ${
                  activeCaseTab === "app3"
                    ? "border-[#0F2042] dark:border-[#38BDF8] text-[#0F2042] dark:text-[#38BDF8] font-bold"
                    : "border-transparent text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917]"
                }`}
              >
                📈 Appendix 3: Economic Forecast
              </button>
              <button
                onClick={() => setActiveCaseTab("hooks")}
                className={`px-3 py-2 border-b-2 font-medium transition-all ${
                  activeCaseTab === "hooks"
                    ? "border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold"
                    : "border-transparent text-emerald-800 dark:text-emerald-400 hover:text-emerald-900"
                }`}
              >
                🎯 Application Points (AO2 Hooks)
              </button>
            </div>

            {/* Case Insert Content Display Area */}
            <div className="py-5 text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
              {activeCaseTab === "overview" && (
                <div className="space-y-4">
                  <p className="whitespace-pre-line">{activeCaseStudy.backgroundStory}</p>
                  <p className="whitespace-pre-line">{activeCaseStudy.marketAndStrategy}</p>
                </div>
              )}

              {activeCaseTab === "workforce" && (
                <div className="space-y-4">
                  <p className="whitespace-pre-line">{activeCaseStudy.operationsAndWorkforce}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 font-mono text-xs">
                    {activeCaseStudy.financialHighlights.map((fh, i) => (
                      <div key={i} className="p-3 bg-[#FAF9F6] dark:bg-[#0C1322] rounded-lg border border-[#E7E5E4] dark:border-[#334155]">
                        <span className="text-[#78716C] dark:text-[#94A3B8] block text-[11px]">{fh.label}</span>
                        <strong className="text-[#0F2042] dark:text-[#38BDF8] text-sm block">{fh.value}</strong>
                        <span className="text-[10px] text-[#57534E] dark:text-[#94A3B8]">{fh.changeOrContext}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeCaseTab === "app1" && (
                <div>
                  <h4 className="font-bold text-[#0F2042] dark:text-[#F1F5F9] mb-3">
                    {activeCaseStudy.appendices[0]?.title}
                  </h4>
                  <div className="overflow-x-auto border border-[#E7E5E4] dark:border-[#334155] rounded-lg font-mono text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-[#F5F5F4] dark:bg-[#1E293B] text-[#1C1917] dark:text-[#F1F5F9] font-bold">
                        <tr>
                          <th className="p-3">Financial Position Item</th>
                          <th className="p-3">31 March 2024</th>
                          <th className="p-3">31 March 2025</th>
                          <th className="p-3 font-sans">Examiner Notes & Trends</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E7E5E4] dark:divide-[#334155]">
                        {activeCaseStudy.appendices[0]?.dataRows?.map((row, i) => (
                          <tr key={i} className={row.label.includes("Total") ? "font-bold bg-slate-50 dark:bg-slate-900" : ""}>
                            <td className="p-3 font-sans text-[#1C1917] dark:text-[#E2E8F0]">{row.label}</td>
                            <td className="p-3">{row.col2024}</td>
                            <td className="p-3 text-[#0F2042] dark:text-[#38BDF8] font-bold">{row.col2025}</td>
                            <td className="p-3 font-sans text-xs text-[#57534E] dark:text-[#94A3B8]">{row.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeCaseTab === "app2" && (
                <div className="p-5 bg-[#FAF9F6] dark:bg-[#0C1322] border border-[#E7E5E4] dark:border-[#334155] rounded-xl">
                  <h4 className="font-bold text-[#0F2042] dark:text-[#F1F5F9] mb-2">
                    {activeCaseStudy.appendices[1]?.title}
                  </h4>
                  <div className="whitespace-pre-line text-xs font-mono leading-relaxed text-[#44403C] dark:text-[#CBD5E1]">
                    {activeCaseStudy.appendices[1]?.content}
                  </div>
                </div>
              )}

              {activeCaseTab === "app3" && (
                <div className="p-5 bg-[#FAF9F6] dark:bg-[#0C1322] border border-[#E7E5E4] dark:border-[#334155] rounded-xl">
                  <h4 className="font-bold text-[#0F2042] dark:text-[#F1F5F9] mb-2">
                    {activeCaseStudy.appendices[2]?.title}
                  </h4>
                  <div className="whitespace-pre-line text-xs font-mono leading-relaxed text-[#44403C] dark:text-[#CBD5E1]">
                    {activeCaseStudy.appendices[2]?.content}
                  </div>
                </div>
              )}

              {activeCaseTab === "hooks" && (
                <div className="space-y-3">
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                    Cambridge examiners award AO2 (Application) marks only when candidates quote specific figures, operations, or characters from the case. Use these facts in your answer:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {activeCaseStudy.applicationHooks.map((hook, i) => (
                      <div
                        key={i}
                        className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-lg text-emerald-950 dark:text-emerald-200 flex items-start gap-2"
                      >
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{hook}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Paper 2 Question Navigation Bar */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-[#94A3B8]">
                Select Paper 2 Question ({activeCaseStudy.questions.length} parts):
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#78716C] dark:text-[#94A3B8]">
                  Part {activePaper2QIndex + 1} of {activeCaseStudy.questions.length}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeCaseStudy.questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => handleSelectPaper2Question(idx)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    idx === activePaper2QIndex
                      ? "bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0C1322] font-bold shadow-sm"
                      : "bg-white dark:bg-[#162032] text-[#57534E] dark:text-[#94A3B8] border border-[#E7E5E4] dark:border-[#334155] hover:bg-[#FAF9F6]"
                  }`}
                >
                  <span>{q.partNumber}</span>
                  <span className="font-mono opacity-80">({q.marks}m)</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Paper 2 Question Card */}
          <div className="bg-white dark:bg-[#162032] border border-[#E7E5E4] dark:border-[#1E293B] rounded-2xl p-6 lg:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-[#E7E5E4] dark:border-[#1E293B]">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-[#0F2042]/10 dark:bg-[#38BDF8]/10 text-[#0F2042] dark:text-[#38BDF8] text-xs font-bold font-mono">
                  {activePaper2Question.partNumber} · Topic {activePaper2Question.topicCode}
                </span>
                <span className="px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 text-xs font-bold font-mono">
                  {activePaper2Question.marks} Marks
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-[#78716C] dark:text-[#94A3B8] font-mono">
                  {activePaper2Question.aoFocus}
                </span>
                <button
                  onClick={() => onToggleBookmark(activePaper2Question.id)}
                  title={isBookmarked ? "Remove Bookmark" : "Bookmark Question"}
                  className={`text-sm px-2.5 py-1 rounded border transition-colors ${
                    isBookmarked
                      ? "bg-amber-50 dark:bg-amber-950 text-amber-600 border-amber-300"
                      : "border-[#E7E5E4] dark:border-[#334155] text-[#78716C]"
                  }`}
                >
                  {isBookmarked ? "★ Bookmarked" : "☆ Bookmark"}
                </button>
              </div>
            </div>

            <h3 className="font-academic-serif text-lg lg:text-xl font-bold text-[#1C1917] dark:text-[#F1F5F9] mb-4 leading-relaxed whitespace-pre-line">
              {activePaper2Question.questionText}
            </h3>

            {/* Answer Editor Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#78716C] dark:text-[#94A3B8]">
                <span>Your Cambridge Examination Answer:</span>
                <div className="flex items-center gap-4">
                  <span>Words: {wordCount}</span>
                  <span className="font-mono">Time: {formatTime(timerSeconds)}</span>
                  {!timerRunning ? (
                    <button
                      onClick={() => setTimerRunning(true)}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400"
                    >
                      ▶ Start Timer
                    </button>
                  ) : (
                    <button
                      onClick={() => setTimerRunning(false)}
                      className="text-xs font-semibold text-amber-600 dark:text-amber-400"
                    >
                      ⏸ Pause Timer
                    </button>
                  )}
                </div>
              </div>

              <textarea
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Write your essay answer here. Remember to explicitly incorporate specific case study facts (numbers, names, business challenges) to secure all AO2 Application marks..."
                rows={activePaper2Question.marks >= 12 ? 12 : 8}
                className="w-full p-4 bg-[#FAF9F6] dark:bg-[#0C1322] border border-[#E7E5E4] dark:border-[#334155] rounded-xl text-sm leading-relaxed text-[#1C1917] dark:text-[#E2E8F0] focus:ring-2 focus:ring-[#0F2042] dark:focus:ring-[#38BDF8] focus:outline-none transition-all font-sans"
              />
            </div>

            {/* Submission & Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-[#E7E5E4] dark:border-[#1E293B]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowRubric(!showRubric)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-[#E7E5E4] dark:border-[#334155] text-[#57534E] dark:text-[#94A3B8] hover:bg-[#FAF9F6] transition-colors"
                >
                  {showRubric ? "Hide Mark Scheme Tips" : "Preview Mark Scheme Rubric"}
                </button>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  disabled={isEvaluating || !studentAnswer.trim()}
                  onClick={handleSubmitEvaluation}
                  className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold rounded-lg bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0C1322] hover:opacity-95 disabled:opacity-40 shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  {isEvaluating ? "Evaluating with CIE Rubric..." : "Submit for AO1–AO4 Marking ✓"}
                </button>
              </div>
            </div>

            {/* Rubric Preview */}
            {showRubric && (
              <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs space-y-2">
                <strong className="text-slate-800 dark:text-slate-200 block">
                  Mark Scheme Indicative Content ({activePaper2Question.marks} marks total):
                </strong>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                  {activePaper2Question.rubric.indicativeContent.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 2: TOPICAL PRACTICE (PAPER 1 & PAPER 2 TARGET MARK TIERS) */}
      {practiceMode === "topical_practice" && (
        <div className="space-y-6">
          {/* Paper Selector & Target Mark Tier Controls */}
          <div className="bg-white dark:bg-[#162032] border border-[#E7E5E4] dark:border-[#1E293B] rounded-2xl p-6 shadow-sm space-y-5">
            {/* Step 1: Paper Selection Option */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E7E5E4] dark:border-[#1E293B]">
              <div>
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0F2042] dark:text-[#38BDF8] mb-0.5">
                  Examination Paper Selection
                </div>
                <h3 className="font-academic-serif text-lg font-bold text-[#0F2042] dark:text-[#F1F5F9]">
                  Select Cambridge Paper: Paper 1 or Paper 2
                </h3>
                <p className="text-xs text-[#57534E] dark:text-[#94A3B8]">
                  Choose which paper type and syllabus mark tier you wish to practice today.
                </p>
              </div>

              {/* Paper 1 vs Paper 2 Interactive Buttons */}
              <div className="flex items-center gap-2 bg-[#FAF9F6] dark:bg-[#0C1322] p-1.5 rounded-xl border border-[#E7E5E4] dark:border-[#334155] shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPaper(1);
                    if (selectedMarkTier === 12) setSelectedMarkTier(6);
                  }}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                    selectedPaper === 1
                      ? "bg-[#0F2042] text-white dark:bg-[#38BDF8] dark:text-[#0C1322] shadow-sm ring-1 ring-[#0F2042]"
                      : "text-[#57534E] dark:text-[#94A3B8] hover:text-[#0F2042] dark:hover:text-white"
                  }`}
                >
                  <span className="text-sm">📄</span>
                  <div className="text-left">
                    <div className="leading-tight">Paper 1</div>
                    <div className="text-[10px] opacity-80 font-normal">Short Answer (2m · 4m · 6m · 8m)</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPaper(2);
                    if (selectedMarkTier === 2) setSelectedMarkTier(8);
                  }}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                    selectedPaper === 2
                      ? "bg-[#0F2042] text-white dark:bg-[#38BDF8] dark:text-[#0C1322] shadow-sm ring-1 ring-[#0F2042]"
                      : "text-[#57534E] dark:text-[#94A3B8] hover:text-[#0F2042] dark:hover:text-white"
                  }`}
                >
                  <span className="text-sm">📋</span>
                  <div className="text-left">
                    <div className="leading-tight">Paper 2</div>
                    <div className="text-[10px] opacity-80 font-normal">Case Study (4m · 6m · 8m · 12m)</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 2: Target Mark Tier Selection & Topic Filter */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-mono font-bold uppercase text-[#78716C] dark:text-[#94A3B8]">
                  Target Mark Tier:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {(selectedPaper === 1 ? [2, 4, 6, 8] : [4, 6, 8, 12]).map((m) => {
                    const isSelected = selectedMarkTier === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setSelectedMarkTier(m as MarkTier)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-[#0F2042] text-white dark:bg-[#38BDF8] dark:text-[#0C1322] shadow-sm ring-2 ring-[#0F2042] dark:ring-[#38BDF8]"
                            : "bg-[#FAF9F6] dark:bg-[#0C1322] text-[#57534E] dark:text-[#94A3B8] border border-[#E7E5E4] dark:border-[#334155] hover:border-[#0F2042] dark:hover:border-[#38BDF8]"
                        }`}
                      >
                        <span className="text-sm font-extrabold">{m} Marks</span>
                        <span className="text-[10px] opacity-75 font-normal">
                          {m === 2 && "(AO1 Knowledge)"}
                          {m === 4 && "(AO1+AO2 Outline)"}
                          {m === 6 && "(AO1+AO2+AO3 Analysis)"}
                          {m === 8 && "(AO1–AO4 Evaluation)"}
                          {m === 12 && "(AO1–AO4 Level 3 Justified Decision)"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Topic Selector & Scenario Refresh */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedTopicCode}
                  onChange={(e) => setSelectedTopicCode(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-[#E7E5E4] dark:border-[#334155] bg-[#FAF9F6] dark:bg-[#0C1322] text-[#1C1917] dark:text-[#E2E8F0] font-medium"
                >
                  <option value="1.1">Topic 1.1 Business Activity</option>
                  <option value="1.2">Topic 1.2 Classification of Business</option>
                  <option value="1.3">Topic 1.3 Enterprise & Growth</option>
                  <option value="1.4">Topic 1.4 Business Organisation</option>
                  <option value="1.5">Topic 1.5 Objectives & Stakeholders</option>
                  <option value="2.1">Topic 2.1 Motivating Employees</option>
                  <option value="2.2">Topic 2.2 Organisation & Management</option>
                  <option value="2.3">Topic 2.3 Recruitment & Selection</option>
                  <option value="2.4">Topic 2.4 Internal & External Communication</option>
                  <option value="3.1">Topic 3.1 Marketing & Market Research</option>
                  <option value="3.2">Topic 3.2 Product & Pricing Strategies</option>
                  <option value="3.3">Topic 3.3 Distribution & Promotion</option>
                  <option value="4.1">Topic 4.1 Production & Efficiency</option>
                  <option value="4.2">Topic 4.2 Costs, Scale & Break-Even</option>
                  <option value="5.1">Topic 5.1 Business Finance & Needs</option>
                  <option value="5.2">Topic 5.2 Cash-Flow Forecasting</option>
                  <option value="5.3">Topic 5.3 Income Statements & Balance Sheets</option>
                  <option value="6.1">Topic 6.1 Economic & Government Influences</option>
                </select>

                <button
                  type="button"
                  onClick={generateTopicalQuestion}
                  className="px-4 py-2 bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0C1322] rounded-xl text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm whitespace-nowrap shrink-0"
                >
                  <span>New {selectedMarkTier}m Prompt (Paper {selectedPaper}) ⟳</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Topical Scenario Question Card */}
          {currentDynamicScenario && (
            <div className="bg-white dark:bg-[#162032] border border-[#E7E5E4] dark:border-[#1E293B] rounded-2xl p-6 lg:p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-[#E7E5E4] dark:border-[#1E293B]">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-[#0F2042]/10 dark:bg-[#38BDF8]/10 text-[#0F2042] dark:text-[#38BDF8] text-xs font-bold font-mono">
                    Topic {selectedTopicCode} · {currentDynamicScenario.title}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 text-xs font-bold font-mono">
                    {currentDynamicScenario.marks} Marks
                  </span>
                </div>
              </div>

              {/* Case Context Strip */}
              <div className="mb-4 p-4 bg-[#FAF9F6] dark:bg-[#0C1322] rounded-xl border border-[#E7E5E4] dark:border-[#334155]">
                <strong className="text-xs text-[#0F2042] dark:text-[#38BDF8] block mb-1">
                  Context: {currentDynamicScenario.businessName} ({currentDynamicScenario.businessType})
                </strong>
                <p className="text-xs text-[#57534E] dark:text-[#CBD5E1] leading-relaxed">
                  {currentDynamicScenario.scenarioContext}
                </p>
              </div>

              <h3 className="font-academic-serif text-lg font-bold text-[#1C1917] dark:text-[#F1F5F9] mb-4 leading-relaxed">
                {currentDynamicScenario.questionPrompt}
              </h3>

              {/* Textarea */}
              <textarea
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Write your answer..."
                rows={selectedMarkTier >= 8 ? 10 : 6}
                className="w-full p-4 bg-[#FAF9F6] dark:bg-[#0C1322] border border-[#E7E5E4] dark:border-[#334155] rounded-xl text-sm leading-relaxed text-[#1C1917] dark:text-[#E2E8F0] focus:ring-2 focus:ring-[#0F2042] dark:focus:ring-[#38BDF8] focus:outline-none transition-all font-sans"
              />

              {/* Action */}
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-[#78716C] dark:text-[#94A3B8]">Words: {wordCount}</span>
                <button
                  disabled={isEvaluating || !studentAnswer.trim()}
                  onClick={handleSubmitEvaluation}
                  className="px-6 py-2.5 text-xs font-bold rounded-lg bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0C1322] hover:opacity-95 disabled:opacity-40 shadow-sm"
                >
                  {isEvaluating ? "Marking..." : "Submit Response ✓"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: VERIFIED ARCHIVE (189 Questions) */}
      {practiceMode === "verified_archive" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-[#162032] border border-[#E7E5E4] dark:border-[#1E293B] rounded-xl text-xs">
            <span className="text-[#57534E] dark:text-[#94A3B8]">
              Verified Cambridge Question {currentVerifiedIndex + 1} of {filteredVerifiedList.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentVerifiedIndex === 0}
                onClick={() => setCurrentVerifiedIndex((i) => i - 1)}
                className="px-3 py-1.5 rounded border border-[#E7E5E4] dark:border-[#334155] disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={currentVerifiedIndex >= filteredVerifiedList.length - 1}
                onClick={() => setCurrentVerifiedIndex((i) => i + 1)}
                className="px-3 py-1.5 rounded bg-[#0F2042] text-white dark:bg-[#38BDF8] dark:text-[#0C1322] disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>

          {filteredVerifiedList[currentVerifiedIndex] && (
            <div className="bg-white dark:bg-[#162032] border border-[#E7E5E4] dark:border-[#1E293B] rounded-2xl p-6 lg:p-8 shadow-sm">
              <div className="mb-4 text-xs font-mono text-[#0F2042] dark:text-[#38BDF8] font-bold">
                {filteredVerifiedList[currentVerifiedIndex].syllabus} {filteredVerifiedList[currentVerifiedIndex].paper_code} Q{filteredVerifiedList[currentVerifiedIndex].question} ({filteredVerifiedList[currentVerifiedIndex].marks} marks)
              </div>
              <p className="text-xs text-[#57534E] dark:text-[#CBD5E1] mb-3 italic">
                Context: {filteredVerifiedList[currentVerifiedIndex].case_context}
              </p>
              <h3 className="font-academic-serif text-lg font-bold text-[#1C1917] dark:text-[#F1F5F9] mb-4">
                {filteredVerifiedList[currentVerifiedIndex].question_paraphrase}
              </h3>

              <textarea
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Write your answer..."
                rows={6}
                className="w-full p-4 bg-[#FAF9F6] dark:bg-[#0C1322] border border-[#E7E5E4] dark:border-[#334155] rounded-xl text-sm leading-relaxed text-[#1C1917] dark:text-[#E2E8F0] focus:ring-2 focus:ring-[#0F2042] dark:focus:ring-[#38BDF8] focus:outline-none"
              />

              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-[#78716C] dark:text-[#94A3B8]">Words: {wordCount}</span>
                <button
                  disabled={isEvaluating || !studentAnswer.trim()}
                  onClick={handleSubmitEvaluation}
                  className="px-6 py-2.5 text-xs font-bold rounded-lg bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0C1322] hover:opacity-95 disabled:opacity-40"
                >
                  {isEvaluating ? "Marking..." : "Submit Response ✓"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Evaluation Results Drawer */}
      {evaluationResult && (
        <div className="mt-8 bg-white dark:bg-[#162032] border border-[#E7E5E4] dark:border-[#1E293B] rounded-2xl p-6 lg:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[#E7E5E4] dark:border-[#1E293B]">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-emerald-700 dark:text-emerald-400">
                Cambridge Assessment Result
              </span>
              <h3 className="font-academic-serif text-2xl font-bold text-[#0F2042] dark:text-[#F1F5F9] mt-0.5">
                Score: {evaluationResult.totalScore} / {evaluationResult.maxMarks} ({evaluationResult.percentage}%)
              </h3>
              <p className="text-xs text-[#57534E] dark:text-[#94A3B8] mt-1">
                {evaluationResult.examinerNotes}
              </p>
            </div>
          </div>

          {/* AO Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 font-mono text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block">AO1 Knowledge</span>
              <strong className="text-base text-slate-800 dark:text-slate-200">
                {evaluationResult.aoBreakdown.ao1.score} / {evaluationResult.aoBreakdown.ao1.max}
              </strong>
              <p className="text-[11px] font-sans text-slate-600 dark:text-slate-400 mt-1">
                {evaluationResult.aoBreakdown.ao1.feedback}
              </p>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-900">
              <span className="text-[10px] text-blue-500 block">AO2 Application</span>
              <strong className="text-base text-blue-800 dark:text-blue-200">
                {evaluationResult.aoBreakdown.ao2.score} / {evaluationResult.aoBreakdown.ao2.max}
              </strong>
              <p className="text-[11px] font-sans text-blue-600 dark:text-blue-400 mt-1">
                {evaluationResult.aoBreakdown.ao2.feedback}
              </p>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-900">
              <span className="text-[10px] text-amber-500 block">AO3 Analysis</span>
              <strong className="text-base text-amber-800 dark:text-amber-200">
                {evaluationResult.aoBreakdown.ao3.score} / {evaluationResult.aoBreakdown.ao3.max}
              </strong>
              <p className="text-[11px] font-sans text-amber-600 dark:text-amber-400 mt-1">
                {evaluationResult.aoBreakdown.ao3.feedback}
              </p>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-900">
              <span className="text-[10px] text-emerald-500 block">AO4 Evaluation</span>
              <strong className="text-base text-emerald-800 dark:text-emerald-200">
                {evaluationResult.aoBreakdown.ao4.score} / {evaluationResult.aoBreakdown.ao4.max}
              </strong>
              <p className="text-[11px] font-sans text-emerald-600 dark:text-emerald-400 mt-1">
                {evaluationResult.aoBreakdown.ao4.feedback}
              </p>
            </div>
          </div>

          {/* Model Answer Snippet */}
          <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs space-y-2">
            <strong className="text-emerald-900 dark:text-emerald-300 block">
              Official Cambridge Model Answer Outline:
            </strong>
            <p className="text-emerald-950 dark:text-emerald-100 italic leading-relaxed whitespace-pre-wrap">
              "{evaluationResult.modelAnswerSnippet}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
import { BookOpen, ChevronLeft, ChevronRight, FileText, Headphones, Landmark, Search, Timer, Zap } from "lucide-react";
import {
  EvaluationResult,
  ManualOverrideData,
  MarkTier,
  PaperNumber,
  QuestionRubric,
  StudentSubmissionRecord,
} from "../lib/types";
import { AOHighlightViewer } from "./AOHighlightViewer";
import { MarkOverrideModal } from "./MarkOverrideModal";
import { FactorsOfProductionDiagram } from "./FactorsOfProductionDiagram";
import {
  PAPER1_DATABASE,
  Paper1ScenarioSet,
  Paper1Question,
  getPaper1ScenariosByUnit,
  getRandomPaper1Scenario,
} from "../lib/data/paper1-database";
import {
  OFFICIAL_2027_SPECIMEN_PAPER_2,
  getAllPaper2CaseStudies,
  Paper2CaseStudy,
  Paper2QuestionPart,
} from "../lib/data/paper2-case-studies";
import { VERIFIED_QUESTIONS, VerifiedQuestion } from "../lib/data/verified-questions";
import {
  getVerifiedCaseStudy,
  getVerifiedFullContextText,
  VerifiedCaseStudy,
} from "../lib/data/verified-case-studies";
import { evaluateStudentEssay, scanApplicationKeywords, scanEvaluationKeywords } from "../lib/engine/evaluator";
import { checkWebGPUSupport, initializeWebLLM, WebLLMStatus, isQwenCachedLocally } from "../lib/engine/webllm";
import { formatTime } from "../lib/utils";
import {
  saveAnswerDraft,
  loadAnswerDraft,
  removeAnswerDraft,
  savePracticeSessionState,
  loadPracticeSessionState,
  savePaper1Position,
  loadPaper1Position,
  awardBonusStudyCoins,
} from "../lib/cookies";

interface PracticeStudioProps {
  onSaveSubmission: (record: StudentSubmissionRecord) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
  onOpenFinanceTest?: () => void;
  onOpenQuickQuiz?: () => void;
  onOpenSections?: () => void;
  onOpenStudySpace?: () => void;
  onOpenMockExam?: () => void;
  initialSectionCode?: string;
  initialTopicCode?: string;
  initialPracticeMode?: "paper1_database" | "paper2_case_study" | "verified_archive";
}

export function PracticeStudio({
  onSaveSubmission,
  bookmarkedIds,
  onToggleBookmark,
  onOpenFinanceTest,
  onOpenQuickQuiz,
  onOpenSections,
  onOpenStudySpace,
  onOpenMockExam,
  initialSectionCode,
  initialPracticeMode,
}: PracticeStudioProps) {
  // Practice Modes:
  // "paper1_database" = Paper 1 authentic 40-scenario database for Sections 1 & 2 (Topical Questions)
  // "verified_archive" = Separate Official Past Papers Archive (189 Questions)
  // "paper2_case_study" = Paper 2 authentic specimen case study insert (Paper 2 database coming later)
  const [practiceMode, setPracticeMode] = useState<"paper1_database" | "paper2_case_study" | "verified_archive">(
    initialPracticeMode || "paper1_database"
  );

  useEffect(() => {
    if (initialPracticeMode) {
      setPracticeMode(initialPracticeMode);
    }
  }, [initialPracticeMode]);

  // ==========================================
  // PAPER 1 AUTHENTIC DATABASE STATES
  // ==========================================
  const [activeScenarioId, setActiveScenarioId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = loadPaper1Position();
      if (saved?.scenarioId && PAPER1_DATABASE.some((s) => s.scenario_id === saved.scenarioId)) {
        if (!initialSectionCode || saved.sectionCode === initialSectionCode) {
          return saved.scenarioId;
        }
      }
    }
    if (initialSectionCode === "6") return "P1_U6_SET_01";
    if (initialSectionCode === "5") return "P1_U5_SET_01";
    if (initialSectionCode === "4") return "P1_U4_SET_01";
    if (initialSectionCode === "3") return "P1_U3_SET_01";
    if (initialSectionCode === "2") return "P1_U2_SET_01";
    return "P1_U1_SET_01";
  });

  const activePaper1Scenario: Paper1ScenarioSet = useMemo(() => {
    return PAPER1_DATABASE.find((s) => s.scenario_id === activeScenarioId) || PAPER1_DATABASE[0];
  }, [activeScenarioId]);

  const selectedUnit: 1 | 2 | 3 | 4 | 5 | 6 = useMemo(() => {
    if (activePaper1Scenario.unit.includes("Unit 6")) return 6;
    if (activePaper1Scenario.unit.includes("Unit 5")) return 5;
    if (activePaper1Scenario.unit.includes("Unit 4")) return 4;
    if (activePaper1Scenario.unit.includes("Unit 3")) return 3;
    if (activePaper1Scenario.unit.includes("Unit 2")) return 2;
    return 1;
  }, [activePaper1Scenario]);

  // Scenarios belonging to current unit
  const currentUnitScenarios = useMemo(() => {
    return PAPER1_DATABASE.filter((s) => s.unit.includes(`Unit ${selectedUnit}`));
  }, [selectedUnit]);

  // Current index in current unit
  const currentIndexInUnit = useMemo(() => {
    const idx = currentUnitScenarios.findIndex((s) => s.scenario_id === activeScenarioId);
    return idx >= 0 ? idx : 0;
  }, [currentUnitScenarios, activeScenarioId]);

  // Active Part: "a" (2m) | "b" (4m) | "c" (6m) | "d" (8m) (loaded from storage if available)
  const [activePart, setActivePart] = useState<"a" | "b" | "c" | "d">(() => {
    if (typeof window !== "undefined") {
      const saved = loadPaper1Position();
      if (saved?.part && ["a", "b", "c", "d"].includes(saved.part)) {
        return saved.part;
      }
    }
    return "b";
  });
  const activePaper1Question: Paper1Question = useMemo(() => {
    return activePaper1Scenario.questions.find((q) => q.part === activePart) || activePaper1Scenario.questions[1];
  }, [activePaper1Scenario, activePart]);

  // Persist Paper 1 active position whenever scenario or part changes
  useEffect(() => {
    savePaper1Position({
      scenarioId: activeScenarioId,
      part: activePart,
      sectionCode: String(selectedUnit),
    });
  }, [activeScenarioId, activePart, selectedUnit]);

  // Sync initial section code from parent if explicitly requested and different
  useEffect(() => {
    if (!initialSectionCode) return;
    const currentUnitStr = `Unit ${initialSectionCode}`;
    if (activePaper1Scenario.unit.includes(currentUnitStr)) return;
    const target = PAPER1_DATABASE.find((s) => s.unit.includes(currentUnitStr));
    if (target) {
      setActiveScenarioId(target.scenario_id);
    }
  }, [initialSectionCode]);

  // ==========================================
  // PAPER 2 SPECIMEN STATES
  // ==========================================
  const paper2Studies = getAllPaper2CaseStudies();
  const [selectedCaseStudyId, setSelectedCaseStudyId] = useState<string>(OFFICIAL_2027_SPECIMEN_PAPER_2.id);
  const activeCaseStudy: Paper2CaseStudy =
    paper2Studies.find((c) => c.id === selectedCaseStudyId) || OFFICIAL_2027_SPECIMEN_PAPER_2;
  const [activeCaseTab, setActiveCaseTab] = useState<"overview" | "workforce" | "app1" | "app2" | "app3" | "hooks">("overview");
  const [activePaper2QIndex, setActivePaper2QIndex] = useState<number>(0);
  const activePaper2Question: Paper2QuestionPart =
    activeCaseStudy.questions[activePaper2QIndex] || activeCaseStudy.questions[0];

  // ==========================================
  // VERIFIED ARCHIVE STATES (OFFICIAL PAST PAPERS)
  // ==========================================
  const [currentVerifiedIndex, setCurrentVerifiedIndex] = useState<number>(0);
  const [verifiedMarkFilter, setVerifiedMarkFilter] = useState<MarkTier | "all">("all");
  const [verifiedUnitFilter, setVerifiedUnitFilter] = useState<string>(() =>
    initialSectionCode && ["1", "2", "3", "4", "5", "6"].includes(initialSectionCode)
      ? initialSectionCode
      : "all"
  );
  const [verifiedPaperFilter, setVerifiedPaperFilter] = useState<1 | 2 | "all">("all");
  const [activeVerifiedCaseTab, setActiveVerifiedCaseTab] = useState<"main" | number>("main");

  const filteredVerifiedQuestions: VerifiedQuestion[] = useMemo(() => {
    return VERIFIED_QUESTIONS.filter((q) => {
      if (verifiedUnitFilter !== "all" && !q.unit.includes(`Unit ${verifiedUnitFilter}`)) {
        return false;
      }
      if (verifiedPaperFilter !== "all" && q.paper !== verifiedPaperFilter) {
        return false;
      }
      if (verifiedMarkFilter !== "all" && q.marks !== verifiedMarkFilter) {
        return false;
      }
      return true;
    });
  }, [verifiedUnitFilter, verifiedPaperFilter, verifiedMarkFilter]);

  const safeVerifiedIndex =
    filteredVerifiedQuestions.length > 0
      ? currentVerifiedIndex % filteredVerifiedQuestions.length
      : 0;
  const activeVerifiedQuestion: VerifiedQuestion | null =
    filteredVerifiedQuestions[safeVerifiedIndex] ?? null;

  const activeVerifiedCaseStudy: VerifiedCaseStudy | null = useMemo(
    () => (activeVerifiedQuestion ? getVerifiedCaseStudy(activeVerifiedQuestion) : null),
    [activeVerifiedQuestion]
  );

  // Reset case study tab back to main story when navigating to another paper/question
  useEffect(() => {
    setActiveVerifiedCaseTab("main");
  }, [activeVerifiedQuestion?.id]);

  const extractVerifiedAppWords = (cs: VerifiedCaseStudy | null, vq: VerifiedQuestion | null): string[] => {
    if (!cs || !vq) return [];
    const tokens = new Set<string>();
    const titleMatches = cs.businessTitle.match(/\b[A-Z][A-Za-z0-9&]{1,}\b/g) || [];
    titleMatches.forEach((w) => tokens.add(w));
    const numMatches = (cs.mainCase + " " + (cs.table || "")).match(/\$?\d[\d,.]*(?:\s*(?:million|m|%|workers|employees|shops|cafes|units))?/gi) || [];
    numMatches.slice(0, 8).forEach((n) => tokens.add(n.trim()));
    return Array.from(tokens).slice(0, 12);
  };

  // ==========================================
  // ACTIVE QUESTION DETERMINATION & DRAFT STORAGE
  // ==========================================
  const currentActiveId = useMemo(() => {
    if (practiceMode === "paper1_database") {
      return `${activePaper1Scenario.scenario_id}_${activePaper1Question.part}`;
    }
    if (practiceMode === "paper2_case_study") {
      return activePaper2Question.id;
    }
    return activeVerifiedQuestion ? `vq_${activeVerifiedQuestion.id}` : "vq_empty";
  }, [
    practiceMode,
    activePaper1Scenario.scenario_id,
    activePaper1Question.part,
    activePaper2Question.id,
    activeVerifiedQuestion,
  ]);

  // Student answer initialized from localStorage draft
  const [studentAnswer, setStudentAnswer] = useState<string>(() => {
    return loadAnswerDraft(
      practiceMode === "paper1_database"
        ? `${activeScenarioId}_${activePart}`
        : practiceMode === "paper2_case_study"
        ? activePaper2Question.id
        : activeVerifiedQuestion
        ? `vq_${activeVerifiedQuestion.id}`
        : "vq_empty"
    );
  });

  const [draftSavedAt, setDraftSavedAt] = useState<number | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [showMarkScheme, setShowMarkScheme] = useState<boolean>(false);
  const [showAllQuestions, setShowAllQuestions] = useState<boolean>(true);

  // Manual Override & AO Highlight & Diagram States
  const [showOverrideModal, setShowOverrideModal] = useState<boolean>(false);
  const [showFactorsDiagramModal, setShowFactorsDiagramModal] = useState<boolean>(false);
  const [showLiveStudentAoHighlight, setShowLiveStudentAoHighlight] = useState<boolean>(false);
  const [latestSubmissionId, setLatestSubmissionId] = useState<string | null>(null);
  const [lastCoinsEarned, setLastCoinsEarned] = useState<number | null>(null);

  const handleApplyOverride = (override: ManualOverrideData) => {
    if (!evaluationResult) return;

    // Use custom breakdown if provided, otherwise distribute newScore across AOs
    const bd = override.customBreakdown || {
      ao1: Math.min(evaluationResult.aoBreakdown.ao1.max, override.newScore),
      ao2: Math.min(
        evaluationResult.aoBreakdown.ao2.max,
        Math.max(0, override.newScore - evaluationResult.aoBreakdown.ao1.max)
      ),
      ao3: Math.min(
        evaluationResult.aoBreakdown.ao3.max,
        Math.max(
          0,
          override.newScore -
            evaluationResult.aoBreakdown.ao1.max -
            evaluationResult.aoBreakdown.ao2.max
        )
      ),
      ao4: Math.min(
        evaluationResult.aoBreakdown.ao4.max,
        Math.max(
          0,
          override.newScore -
            evaluationResult.aoBreakdown.ao1.max -
            evaluationResult.aoBreakdown.ao2.max -
            evaluationResult.aoBreakdown.ao3.max
        )
      ),
    };

    const updatedAoBreakdown = {
      ao1: {
        ...evaluationResult.aoBreakdown.ao1,
        score: bd.ao1,
        feedback:
          bd.ao1 > evaluationResult.aoBreakdown.ao1.score
            ? `Mark updated to ${bd.ao1}/${evaluationResult.aoBreakdown.ao1.max} (${
                override.bodApplied ? "BOD applied" : "Examiner override"
              }).`
            : evaluationResult.aoBreakdown.ao1.feedback,
      },
      ao2: {
        ...evaluationResult.aoBreakdown.ao2,
        score: bd.ao2,
        feedback:
          bd.ao2 > evaluationResult.aoBreakdown.ao2.score
            ? `Mark updated to ${bd.ao2}/${evaluationResult.aoBreakdown.ao2.max} (${
                override.bodApplied ? "BOD applied" : "Examiner override"
              }).`
            : evaluationResult.aoBreakdown.ao2.feedback,
      },
      ao3: {
        ...evaluationResult.aoBreakdown.ao3,
        score: bd.ao3,
        feedback:
          bd.ao3 > evaluationResult.aoBreakdown.ao3.score
            ? `Mark updated to ${bd.ao3}/${evaluationResult.aoBreakdown.ao3.max} (${
                override.bodApplied ? "BOD applied" : "Examiner override"
              }).`
            : evaluationResult.aoBreakdown.ao3.feedback,
      },
      ao4: {
        ...evaluationResult.aoBreakdown.ao4,
        score: bd.ao4,
        feedback:
          bd.ao4 > evaluationResult.aoBreakdown.ao4.score
            ? `Mark updated to ${bd.ao4}/${evaluationResult.aoBreakdown.ao4.max} (${
                override.bodApplied ? "BOD applied" : "Examiner override"
              }).`
            : evaluationResult.aoBreakdown.ao4.feedback,
      },
    };

    const updatedRuleEnforcement = evaluationResult.ruleEnforcement
      ? {
          ...evaluationResult.ruleEnforcement,
          ao2CappedToZero: bd.ao2 > 0 ? false : evaluationResult.ruleEnforcement.ao2CappedToZero,
          ao4CappedToZero: bd.ao4 > 0 ? false : evaluationResult.ruleEnforcement.ao4CappedToZero,
          ruleNotes: [
            ...(evaluationResult.ruleEnforcement.ruleNotes || []),
            override.bodApplied
              ? `[Examiner Discretion] +1 BOD awarded. Adjusted score: ${override.newScore}/${evaluationResult.maxMarks}.`
              : `[Manual Override] Mark adjusted to ${override.newScore}/${evaluationResult.maxMarks}. Reason: ${override.reason}`,
          ],
        }
      : undefined;

    const updatedResult: EvaluationResult = {
      ...evaluationResult,
      totalScore: override.newScore,
      percentage: Math.round((override.newScore / evaluationResult.maxMarks) * 100),
      manualOverride: override,
      aoBreakdown: updatedAoBreakdown,
      ruleEnforcement: updatedRuleEnforcement,
    };
    setEvaluationResult(updatedResult);

    if (latestSubmissionId) {
      const record: StudentSubmissionRecord = {
        id: latestSubmissionId,
        questionId: currentActiveId,
        questionTitle:
          practiceMode === "paper1_database"
            ? `Set ${currentIndexInUnit + 1} (${activePart.toUpperCase()})`
            : "Cambridge Practice",
        marks: updatedResult.maxMarks,
        paper: practiceMode === "paper2_case_study" ? 2 : 1,
        syllabus: "0264",
        unit: activePaper1Scenario.unit,
        studentAnswer,
        wordCount: studentAnswer.trim().split(/\s+/).length,
        timeSpentSeconds: timerSeconds,
        result: updatedResult,
        timestamp: new Date().toISOString(),
      };
      onSaveSubmission(record);
    }
  };

  const handleResetOverride = () => {
    if (!evaluationResult || !evaluationResult.manualOverride) return;
    const original = evaluationResult.manualOverride.originalScore;
    const updatedResult: EvaluationResult = {
      ...evaluationResult,
      totalScore: original,
      percentage: Math.round((original / evaluationResult.maxMarks) * 100),
      manualOverride: undefined,
    };
    setEvaluationResult(updatedResult);

    if (latestSubmissionId) {
      const record: StudentSubmissionRecord = {
        id: latestSubmissionId,
        questionId: currentActiveId,
        questionTitle:
          practiceMode === "paper1_database"
            ? `Set ${currentIndexInUnit + 1} (${activePart.toUpperCase()})`
            : "Cambridge Practice",
        marks: updatedResult.maxMarks,
        paper: practiceMode === "paper2_case_study" ? 2 : 1,
        syllabus: "0264",
        unit: activePaper1Scenario.unit,
        studentAnswer,
        wordCount: studentAnswer.trim().split(/\s+/).length,
        timeSpentSeconds: timerSeconds,
        result: updatedResult,
        timestamp: new Date().toISOString(),
      };
      onSaveSubmission(record);
    }
  };

  // Automatically restore saved draft whenever currentActiveId changes
  useEffect(() => {
    const draft = loadAnswerDraft(currentActiveId);
    setStudentAnswer(draft);
    setEvaluationResult(null);
  }, [currentActiveId]);

  // Persist session navigation state to localStorage
  useEffect(() => {
    savePracticeSessionState({
      practiceMode,
      activeScenarioId,
      activePart,
      selectedUnit,
      activePaper2QIndex,
      currentVerifiedIndex,
      verifiedMarkFilter,
      verifiedUnitFilter,
      verifiedPaperFilter,
    });
  }, [
    practiceMode,
    activeScenarioId,
    activePart,
    selectedUnit,
    activePaper2QIndex,
    currentVerifiedIndex,
    verifiedMarkFilter,
    verifiedUnitFilter,
    verifiedPaperFilter,
  ]);

  // Handle student answer input & immediately persist to localStorage
  const handleAnswerChange = (val: string) => {
    setStudentAnswer(val);
    saveAnswerDraft(currentActiveId, val);
    setDraftSavedAt(Date.now());
  };

  const handleClearDraft = () => {
    removeAnswerDraft(currentActiveId);
    setStudentAnswer("");
    setDraftSavedAt(null);
  };

  // Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Engine: Instant CIE Examiner vs Local Qwen 3.5 0.8B (WebLLM)
  const [aiEngineType, setAiEngineType] = useState<"instant" | "webllm">(() => {
    return isQwenCachedLocally() ? "webllm" : "webllm";
  });
  const [webllmStatus, setWebllmStatus] = useState<WebLLMStatus>({
    isSupported: false,
    isLoading: false,
    isReady: false,
    progressText: "",
    progressPercent: 0,
    error: null,
  });
  const [webllmEngine, setWebllmEngine] = useState<any>(null);

  // Initialize WebGPU detection and auto-load Qwen 3.5 0.8B if supported/cached
  useEffect(() => {
    checkWebGPUSupport().then((supported) => {
      setWebllmStatus((prev) => ({ ...prev, isSupported: supported }));
      if (supported && isQwenCachedLocally()) {
        initializeWebLLM((status) => setWebllmStatus(status))
          .then((engine) => {
            if (engine) {
              setWebllmEngine(engine);
              setAiEngineType("webllm");
            }
          })
          .catch((err) => console.warn("Qwen 3.5 0.8B initial check skipped:", err));
      }
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

  // Load WebLLM (Qwen 3.5 0.8B)
  const handleLoadWebLLM = async () => {
    try {
      setWebllmStatus((prev) => ({
        ...prev,
        isLoading: true,
        progressText: "Loading Qwen 3.5 0.8B weights...",
      }));
      const engine = await initializeWebLLM((status) => {
        setWebllmStatus(status);
      });
      if (engine) {
        setWebllmEngine(engine);
        setAiEngineType("webllm");
      }
    } catch (e) {
      console.error("WebLLM load error:", e);
    }
  };

  // Switch Unit / Scenario / Part (Preserves drafts via currentActiveId effect)
  const handleSelectScenarioId = (id: string) => {
    setActiveScenarioId(id);
    setEvaluationResult(null);
    setTimerSeconds(0);
    setTimerRunning(false);
  };

  const handleSelectUnit = (unitNum: 1 | 2 | 3 | 4 | 5 | 6) => {
    let targetScenarioId = "P1_U1_SET_01";
    if (unitNum === 2) targetScenarioId = "P1_U2_SET_01";
    if (unitNum === 3) targetScenarioId = "P1_U3_SET_01";
    if (unitNum === 4) targetScenarioId = "P1_U4_SET_01";
    if (unitNum === 5) targetScenarioId = "P1_U5_SET_01";
    if (unitNum === 6) targetScenarioId = "P1_U6_SET_01";

    const target = PAPER1_DATABASE.find((s) => s.scenario_id === targetScenarioId) ||
      PAPER1_DATABASE.find((s) => s.unit.includes(`Unit ${unitNum}`)) ||
      PAPER1_DATABASE[0];

    setActiveScenarioId(target.scenario_id);
    setEvaluationResult(null);
    setTimerSeconds(0);
    setTimerRunning(false);
  };

  const handleRandomScenario = () => {
    if (currentUnitScenarios.length === 0) return;
    let randomIdx = Math.floor(Math.random() * currentUnitScenarios.length);
    if (randomIdx === currentIndexInUnit && currentUnitScenarios.length > 1) {
      randomIdx = (randomIdx + 1) % currentUnitScenarios.length;
    }
    setActiveScenarioId(currentUnitScenarios[randomIdx].scenario_id);
    setEvaluationResult(null);
    setTimerSeconds(0);
    setTimerRunning(false);
  };

  // Prev Question: Loops backwards within the active section (wraps from 1 back to 20, never exits section)
  const handlePrevScenario = () => {
    if (currentUnitScenarios.length === 0) return;
    const prevIdx = (currentIndexInUnit - 1 + currentUnitScenarios.length) % currentUnitScenarios.length;
    setActiveScenarioId(currentUnitScenarios[prevIdx].scenario_id);
    setEvaluationResult(null);
    setTimerSeconds(0);
    setTimerRunning(false);
  };

  // Next Question: Loops forwards within the active section (wraps after 20 back to 1, never exits section)
  const handleNextScenario = () => {
    if (currentUnitScenarios.length === 0) return;
    const nextIdx = (currentIndexInUnit + 1) % currentUnitScenarios.length;
    setActiveScenarioId(currentUnitScenarios[nextIdx].scenario_id);
    setEvaluationResult(null);
    setTimerSeconds(0);
    setTimerRunning(false);
  };

  // Select Prompt Part (2, 4, 6, 8 marks)
  const handleSelectPart = (part: "a" | "b" | "c" | "d") => {
    setActivePart(part);
    setEvaluationResult(null);
    setTimerSeconds(0);
    setTimerRunning(false);
  };

  // Live Rule Matching Preview as student types
  const liveAppScan = useMemo(() => {
    if (practiceMode !== "paper1_database") return { passed: true, foundWords: [] };
    return scanApplicationKeywords(studentAnswer, activePaper1Question.qwen_marking_keys?.valid_app_words);
  }, [studentAnswer, activePaper1Question, practiceMode]);

  const liveEvalScan = useMemo(() => {
    if (practiceMode !== "paper1_database" || activePaper1Question.mark_value !== 8) {
      return { passed: true, foundWords: [] };
    }
    return scanEvaluationKeywords(studentAnswer);
  }, [studentAnswer, activePaper1Question, practiceMode]);

  // Submit Answer for Assessment
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
      let targetMarks: MarkTier = 4;
      let validAppWords: string[] | undefined;
      let deterministicRules: any;
      let modelAnswer = "";
      let indicativeKnowledgePoints: string[] = [];

      if (practiceMode === "paper1_database") {
        title = `${activePaper1Scenario.scenario_id} Part (${activePaper1Question.part.toUpperCase()}) — ${activePaper1Question.mark_value} Marks`;
        prompt = activePaper1Question.question_text;
        context = activePaper1Scenario.scenario_stem;
        questionId = `${activePaper1Scenario.scenario_id}_${activePaper1Question.part}`;
        unit = activePaper1Scenario.unit;
        targetMarks = activePaper1Question.mark_value as MarkTier;
        validAppWords = activePaper1Question.qwen_marking_keys?.valid_app_words;
        deterministicRules = activePaper1Question.qwen_marking_keys?.deterministic_rules;
        modelAnswer = activePaper1Question.model_answer;
        indicativeKnowledgePoints = activePaper1Question.mark_scheme.knowledge_max_2 || [];

        // Build CIE Rubric according to mark tier
        const ao1Max = 2;
        const ao2Max = targetMarks >= 4 ? 2 : 0;
        const ao3Max = targetMarks >= 6 ? 2 : 0;
        const ao4Max = targetMarks >= 8 ? 2 : 0;

        rubric = {
          totalMarks: targetMarks,
          ao1Max,
          ao2Max,
          ao3Max,
          ao4Max,
          descriptors: {
            ao1: activePaper1Question.mark_scheme.knowledge_max_2 || ["Knowledge of core business syllabus terms."],
            ao2: activePaper1Question.mark_scheme.application_max_2 || ["Application to named case study context."],
            ao3: activePaper1Question.mark_scheme.analysis_max_2 || ["Analytical cause-and-effect reasoning."],
            ao4: activePaper1Question.mark_scheme.evaluation_max_2 || ["Balanced evaluative judgment."],
          },
          indicativeContent: [
            ...(activePaper1Question.mark_scheme.knowledge_max_2 || []),
            ...(activePaper1Question.mark_scheme.application_max_2 || []),
          ],
          sampleStrongPoint: activePaper1Question.model_answer,
        };
      } else if (practiceMode === "paper2_case_study") {
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
            ao1: ["Accurate Cambridge business terminology."],
            ao2: ["Explicitly applies points to specific case facts and numbers."],
            ao3: ["Develops multi-step causal analytical chains."],
          },
          indicativeContent: activePaper2Question.rubric.indicativeContent,
          sampleStrongPoint: activePaper2Question.rubric.sampleStrongAnswer,
        };
      } else {
        const vq = activeVerifiedQuestion || VERIFIED_QUESTIONS[0];
        const vqCase = activeVerifiedCaseStudy || getVerifiedCaseStudy(vq);
        title = `${vq.syllabus} ${vq.paper_code} Q${vq.question} (${vq.marks} marks)`;
        prompt = vq.question_paraphrase;
        context = getVerifiedFullContextText(vq);
        questionId = vq.id;
        unit = vq.unit;
        targetMarks = vq.marks as MarkTier;
        if (targetMarks >= 4) {
          validAppWords = extractVerifiedAppWords(vqCase, vq);
        }
        const ao1Max = 2;
        const ao2Max = targetMarks >= 4 ? 2 : 0;
        const ao3Max = targetMarks >= 12 ? 4 : targetMarks === 8 && vq.paper === 2 ? 4 : targetMarks >= 6 ? 2 : 0;
        const ao4Max = targetMarks >= 12 ? 4 : targetMarks === 8 && vq.paper === 1 ? 2 : 0;
        rubric = {
          totalMarks: targetMarks,
          ao1Max,
          ao2Max,
          ao3Max,
          ao4Max,
          descriptors: {
            ao1: ["Demonstrates accurate Cambridge syllabus knowledge."],
            ao2: [`Explicitly applies answer to ${vqCase?.businessTitle || "the named case study"} context and figures.`],
            ao3: ["Develops causal analytical chains explaining business impact."],
            ...(ao4Max > 0 ? { ao4: ["Weighs trade-offs and gives a justified conclusion/recommendation."] } : {}),
          },
          indicativeContent: [vq.question_paraphrase],
          sampleStrongPoint: "Clear explanation grounded in the case study data with relevant Cambridge terminology.",
        };
      }

      let engineToUse = webllmEngine;
      if (aiEngineType === "webllm" && !engineToUse && webllmStatus.isSupported) {
        try {
          engineToUse = await initializeWebLLM((status) => setWebllmStatus(status));
          if (engineToUse) {
            setWebllmEngine(engineToUse);
          }
        } catch (e) {
          console.warn("Could not initialize Qwen 3.5 0.8B, using fallback examiner:", e);
        }
      }

      const result = await evaluateStudentEssay({
        questionTitle: title,
        questionPrompt: prompt,
        caseContext: context,
        marks: targetMarks,
        rubric,
        studentAnswer,
        webllmEngine: aiEngineType === "webllm" ? (engineToUse || undefined) : undefined,
        validAppWords,
        deterministicRules,
        modelAnswer,
        indicativeKnowledgePoints,
      });

      setEvaluationResult(result);

      // Save submission record to database
      const record: StudentSubmissionRecord = {
        id: `sub-${Date.now()}`,
        questionId,
        questionTitle: title,
        marks: targetMarks,
        paper:
          practiceMode === "paper2_case_study"
            ? 2
            : practiceMode === "verified_archive" && activeVerifiedQuestion
            ? (activeVerifiedQuestion.paper as PaperNumber)
            : 1,
        syllabus:
          practiceMode === "verified_archive" && activeVerifiedQuestion
            ? activeVerifiedQuestion.syllabus
            : "0264",
        unit,
        studentAnswer,
        wordCount: studentAnswer.trim().split(/\s+/).length,
        timeSpentSeconds: timerSeconds,
        result,
        timestamp: new Date().toISOString(),
      };
      setLatestSubmissionId(record.id);
      onSaveSubmission(record);

      // Award study points/coins for answering this question!
      const earnedCoins = 20 + Math.max(5, result.totalScore * 5);
      awardBonusStudyCoins(earnedCoins);
      setLastCoinsEarned(earnedCoins);

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
  const isBookmarked = bookmarkedIds.includes(currentActiveId);

  return (
    <div className="study-page">
      {/* Top Header & Quick Launcher */}
      <header className="study-hero">
        <div className="study-hero-content">
          <p className="study-hero-kicker">Cambridge IGCSE Business Studies · 0264 / 0450</p>
          <h1 className="study-title">Paper 1 <span>Examination Studio</span></h1>
          <p className="study-description">
            Practise 2-, 4-, 6- and 8-mark questions using business case studies.
          </p>
          <div className="study-hero-actions">
            {onOpenMockExam && (
              <button
                onClick={onOpenMockExam}
                className="study-action btn-primary"
                title="Open the timed Paper 1 or Paper 2 mock exam chooser with full case study and appendices"
              >
                <Timer size={16} aria-hidden="true" />
                <span>Start Mock Exam</span>
              </button>
            )}

            {onOpenStudySpace && (
              <button
                onClick={onOpenStudySpace}
                className="study-action study-secondary-action"
                title="Launch Aesthetic Study Space & Focus Pomodoro Timer"
              >
                <Headphones size={16} aria-hidden="true" />
                <span>Study Space</span>
              </button>
            )}
          </div>

        </div>
        <div className="study-hero-image" aria-hidden="true" />
      </header>

      <div className="study-studio">
        <div className="study-mode-bar">
          <div role="group" aria-label="Practice mode" className="study-mode-options">
            <button
              onClick={() => setPracticeMode("paper1_database")}
              aria-pressed={practiceMode === "paper1_database"}
              className="study-mode-button"
            >
              <Search size={17} aria-hidden="true" />
              Topical Questions
            </button>

            <button
              onClick={() => setPracticeMode("verified_archive")}
              aria-pressed={practiceMode === "verified_archive"}
              className="study-mode-button"
            >
              <Landmark size={17} aria-hidden="true" />
              Official Past Papers
            </button>

            <button
              onClick={() => setPracticeMode("paper2_case_study")}
              aria-pressed={practiceMode === "paper2_case_study"}
              className="study-mode-button"
            >
              <FileText size={17} aria-hidden="true" />
              Paper 2 Specimen Insert
            </button>
          </div>

          <div role="group" aria-label="Marking engine" className="study-engine">
            <button
              onClick={() => {
                if (!webllmEngine && webllmStatus.isSupported) {
                  handleLoadWebLLM();
                } else {
                  setAiEngineType("webllm");
                }
              }}
              aria-pressed={aiEngineType === "webllm"}
              className="study-engine-option"
            >
              <span>Local Qwen 3.5 0.8B</span>
              {webllmStatus.isLoading && (
                <span className="text-[10px] text-amber-500 font-mono animate-pulse">({webllmStatus.progressPercent}%)</span>
              )}
              {webllmStatus.isReady && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Qwen 3.5 0.8B Active" />
              )}
            </button>
            <button
              onClick={() => setAiEngineType("instant")}
              aria-pressed={aiEngineType === "instant"}
              className="study-engine-option"
            >
              Instant Examiner
            </button>
          </div>
        </div>

        <div className="study-workspace">
          <aside className="study-section-rail" aria-label="Practice navigation">
            {practiceMode === "paper1_database" && (
              <div>
                <h2 className="study-panel-kicker">Syllabus sections</h2>
                <div role="group" aria-label="Syllabus sections" className="study-sections">
                  <button
                    type="button"
                    onClick={() => handleSelectUnit(1)}
                    aria-pressed={selectedUnit === 1}
                    className="study-section-button"
                  >
                    <span>01</span> Business Activity
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectUnit(2)}
                    aria-pressed={selectedUnit === 2}
                    className="study-section-button"
                  >
                    <span>02</span> People in Business
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectUnit(3)}
                    aria-pressed={selectedUnit === 3}
                    className="study-section-button"
                  >
                    <span>03</span> Marketing
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectUnit(4)}
                    aria-pressed={selectedUnit === 4}
                    className="study-section-button"
                  >
                    <span>04</span> Operations
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectUnit(5)}
                    aria-pressed={selectedUnit === 5}
                    className="study-section-button"
                  >
                    <span>05</span> Finance
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectUnit(6)}
                    aria-pressed={selectedUnit === 6}
                    className="study-section-button"
                  >
                    <span>06</span> External Influences
                  </button>
                </div>
              </div>
            )}

            {practiceMode === "verified_archive" && (
              <div>
                <h2 className="study-panel-kicker">Topical filter</h2>
                <div role="group" aria-label="Official past papers topical filter" className="study-sections">
                  {[
                    { code: "all", num: "All", label: "All Topics" },
                    { code: "1", num: "01", label: "Business Activity" },
                    { code: "2", num: "02", label: "People in Business" },
                    { code: "3", num: "03", label: "Marketing" },
                    { code: "4", num: "04", label: "Operations" },
                    { code: "5", num: "05", label: "Finance" },
                    { code: "6", num: "06", label: "External Influences" },
                  ].map((item) => {
                    const count = VERIFIED_QUESTIONS.filter((q) => {
                      if (item.code !== "all" && !q.unit.includes(`Unit ${item.code}`)) return false;
                      if (verifiedPaperFilter !== "all" && q.paper !== verifiedPaperFilter) return false;
                      if (verifiedMarkFilter !== "all" && q.marks !== verifiedMarkFilter) return false;
                      return true;
                    }).length;
                    return (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => {
                          setVerifiedUnitFilter(item.code);
                          setCurrentVerifiedIndex(0);
                        }}
                        aria-pressed={verifiedUnitFilter === item.code}
                        className="study-section-button"
                      >
                        <span>{item.num}</span>
                        <div className="min-w-0 flex-1 flex items-center justify-between gap-1.5">
                          <strong className="font-semibold text-[12px] leading-tight truncate text-left">
                            {item.label}
                          </strong>
                          <small className="font-mono text-[10px] opacity-70 tabular-nums shrink-0">
                            {count}
                          </small>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="study-mode-shortcuts">
              {onOpenSections && (
                <button onClick={onOpenSections} className="study-shortcut">
                  <BookOpen size={16} aria-hidden="true" /> Syllabus Chapters
                </button>
              )}
              {onOpenQuickQuiz && (
                <button onClick={onOpenQuickQuiz} className="study-shortcut">
                  <Zap size={16} aria-hidden="true" /> Quick Quiz
                </button>
              )}
            </div>
          </aside>

          <div className="min-w-0">
            {practiceMode === "paper1_database" && (
              <div className="study-columns study-paper-one-columns">
                <section className="study-case-panel" aria-labelledby="paper-one-case-title">
                  <div className="study-panel-header">
                    <div>
                      <p className="study-panel-kicker">{activePaper1Scenario.unit}</p>
                      <h2 id="paper-one-case-title" className="study-panel-title">Case study</h2>
                    </div>
                    <div role="group" aria-label="Case study navigation" className="study-pager">
                      <button
                        type="button"
                        onClick={handlePrevScenario}
                        className="study-pager-button"
                        aria-label="Previous question"
                        title="Previous question"
                      >
                        <ChevronLeft size={18} aria-hidden="true" />
                      </button>
                      <span className="study-page-count">
                        {currentIndexInUnit + 1} / {currentUnitScenarios.length}
                      </span>
                      <button
                        type="button"
                        onClick={handleNextScenario}
                        className="study-pager-button"
                        aria-label="Next question"
                        title="Next question"
                      >
                        <ChevronRight size={18} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <div className="study-case-text">{activePaper1Scenario.scenario_stem}</div>
                </section>

                <div className="study-paper-one-editor">
                  <section className="study-answer space-y-4" aria-labelledby="paper-one-active-question">
                    <div className="study-question-header">
                      <h2 className="study-panel-title">Questions</h2>
                      <button
                        type="button"
                        onClick={() => onToggleBookmark(currentActiveId)}
                        aria-pressed={isBookmarked}
                        className="study-bookmark"
                      >
                        {isBookmarked ? "★ Bookmarked" : "☆ Bookmark"}
                      </button>
                    </div>
                    <div role="group" aria-label="Question parts" className="study-question-options">
                      {activePaper1Scenario.questions.map((q) => {
                        const isCurrent = activePart === q.part;
                        return (
                          <button
                            key={q.part}
                            type="button"
                            onClick={() => handleSelectPart(q.part)}
                            aria-pressed={isCurrent}
                            aria-label={`Part ${q.part.toUpperCase()}, ${q.mark_value} marks. ${q.question_text}`}
                            title={q.question_text}
                            className="study-question-button"
                          >
                            <strong>Part {q.part.toUpperCase()}</strong>
                            <small>{q.mark_value} marks</small>
                          </button>
                        );
                      })}
                    </div>
                    {/* Question Text */}
                    <h2 id="paper-one-active-question" className="study-prompt">
                      {activePaper1Question.question_text}
                    </h2>

                    {/* Answer Editor Area */}
                    <div className="space-y-2">
                      <div className="study-answer-meta">
                        <div className="flex flex-wrap items-center gap-2">
                          <label htmlFor="paper-one-response">Your response</label>
                          {studentAnswer.trim() ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-mono">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Draft auto-saved locally
                            </span>
                          ) : null}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono">
                          <span>Words: {wordCount}</span>
                          <span>Time: {formatTime(timerSeconds)}</span>
                          {studentAnswer.trim() && (
                            <button
                              type="button"
                              onClick={handleClearDraft}
                              className="text-[11px] text-slate-400 hover:text-rose-500 cursor-pointer underline transition-colors"
                              title="Clear your current draft response"
                            >
                              Clear Draft
                            </button>
                          )}
                          {!timerRunning ? (
                            <button
                              type="button"
                              onClick={() => setTimerRunning(true)}
                              className="text-xs font-semibold text-blue-600 dark:text-sky-400 cursor-pointer"
                            >
                              ▶ Start Timer
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setTimerRunning(false)}
                              className="text-xs font-semibold text-amber-600 dark:text-amber-400 cursor-pointer"
                            >
                              ⏸ Pause Timer
                            </button>
                          )}
                        </div>
                      </div>

                      <textarea
                        id="paper-one-response"
                        value={studentAnswer}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        placeholder={
                          activePaper1Question.mark_value === 2
                            ? "Write the textbook definition here..."
                            : activePaper1Question.mark_value === 4
                            ? "State Reason 1 and apply to the case facts [k + app], then state Reason 2 and apply [k + app]..."
                            : activePaper1Question.mark_value === 6
                            ? "Explain Benefit 1 with case application and causal analysis ('this leads to... as a result...') [k + app + an], then Benefit 2..."
                            : "Analyze the advantages with case facts [k + app + an], analyze the disadvantages [k + app + an], then provide a justified overall conclusion weighing the trade-offs [eval]..."
                        }
                        rows={activePaper1Question.mark_value >= 6 ? 9 : 5}
                        className="study-response"
                      />
                    </div>

                    {/* Bottom Actions Bar */}
                    <div className="study-answer-actions">
                      <button
                        type="button"
                        onClick={() => setShowMarkScheme(!showMarkScheme)}
                        className="study-action study-secondary-action"
                      >
                        {showMarkScheme ? "Hide mark scheme" : "View mark scheme"}
                      </button>

                      <button
                        type="button"
                        disabled={isEvaluating || !studentAnswer.trim()}
                        onClick={handleSubmitEvaluation}
                        className="study-action btn-primary disabled:opacity-40"
                      >
                        {isEvaluating ? "Assessing response…" : "Submit for assessment"}
                      </button>
                    </div>
                  </section>
                  {/* Mark Scheme Preview (if requested) */}
                  {showMarkScheme && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs space-y-3">
                      <div>
                        <strong className="text-slate-900 dark:text-slate-100 block mb-1 font-mono uppercase text-[11px]">
                          Cambridge Mark Scheme Outline ({activePaper1Question.mark_value} Marks):
                        </strong>
                        <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-slate-300">
                          {activePaper1Question.mark_scheme.knowledge_max_2 && (
                            <li>
                              <strong>AO1 Knowledge (max 2):</strong> {activePaper1Question.mark_scheme.knowledge_max_2.join("; ")}
                            </li>
                          )}
                          {activePaper1Question.mark_scheme.application_max_2 && (
                            <li>
                              <strong>AO2 Application (max 2):</strong> {activePaper1Question.mark_scheme.application_max_2.join("; ")}
                            </li>
                          )}
                          {activePaper1Question.mark_scheme.analysis_max_2 && (
                            <li>
                              <strong>AO3 Analysis (max 2):</strong> {activePaper1Question.mark_scheme.analysis_max_2.join("; ")}
                            </li>
                          )}
                          {activePaper1Question.mark_scheme.evaluation_max_2 && (
                            <li>
                              <strong>AO4 Evaluation (max 2):</strong> {activePaper1Question.mark_scheme.evaluation_max_2.join("; ")}
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                        <strong className="text-emerald-900 dark:text-emerald-300 block mb-1">
                          Exemplar Model Answer:
                        </strong>
                        <p className="italic text-slate-800 dark:text-slate-200 leading-relaxed">
                          "{activePaper1Question.model_answer}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODE 2: PAPER 2 CASE STUDY SPECIMEN INSERT               */}
            {/* ======================================================== */}
            {practiceMode === "paper2_case_study" && (
              <div className="study-alternate-mode space-y-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl text-xs text-blue-950 dark:text-blue-200 flex items-center justify-between">
                  <div>
                    <strong>Paper 2 Case Study Mode:</strong> The full Paper 1 database (Sections 1 & 2) is active above. Paper 2 full database will be added when provided.
                  </div>
                  <button
                    onClick={() => setPracticeMode("paper1_database")}
                    className="px-3 py-1 bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0C1322] font-bold rounded-lg shrink-0 ml-3"
                  >
                    Switch to Paper 1 Database →
                  </button>
                </div>

                <div className="bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 rounded-2xl p-6 lg:p-8 shadow-xs">
                  <h2 className="font-academic-serif text-2xl font-bold text-[#0F2042] dark:text-white mb-2">
                    {activeCaseStudy.title}
                  </h2>
                  <p className="text-xs text-[#57534E] dark:text-neutral-400 mb-4">
                    Business: {activeCaseStudy.businessName} · Sector: {activeCaseStudy.industry} · {activeCaseStudy.session}
                  </p>

                  <div className="p-4 bg-[#FAF9F6] dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl text-sm leading-relaxed mb-6 font-academic-serif whitespace-pre-line">
                    {activeCaseStudy.backgroundStory}
                    {"\n\n"}
                    {activeCaseStudy.operationsAndWorkforce}
                  </div>

                  {/* Questions for Paper 2 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {activeCaseStudy.questions.map((q, idx) => (
                      <button
                        key={q.id}
                        onClick={() => {
                          setActivePaper2QIndex(idx);
                          setEvaluationResult(null);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          idx === activePaper2QIndex
                            ? "bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0C1322]"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        {q.partNumber} ({q.marks}m)
                      </button>
                    ))}
                  </div>

                  <h3 className="font-academic-serif text-lg font-bold mb-4">
                    {activePaper2Question.questionText}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-[#78716C] dark:text-neutral-400 mb-2">
                    <div className="flex items-center gap-2">
                      <span>Student Response:</span>
                      {studentAnswer.trim() ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Draft auto-saved locally
                        </span>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono">Words: {wordCount}</span>
                      {studentAnswer.trim() && (
                        <button
                          type="button"
                          onClick={handleClearDraft}
                          className="text-[11px] text-slate-400 hover:text-rose-500 cursor-pointer underline transition-colors"
                        >
                          Clear Draft
                        </button>
                      )}
                    </div>
                  </div>

                  <textarea
                    value={studentAnswer}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="Write your Paper 2 answer..."
                    rows={8}
                    className="w-full p-4 bg-[#FAF9F6] dark:bg-black border border-[#E7E5E4] dark:border-neutral-700 rounded-xl text-sm leading-relaxed text-[#1C1917] dark:text-white focus:ring-2 focus:ring-[#0F2042] dark:focus:ring-white focus:outline-none transition-all font-sans"
                  />

                  <div className="flex justify-end mt-4">
                    <button
                      disabled={isEvaluating || !studentAnswer.trim()}
                      onClick={handleSubmitEvaluation}
                      className="px-6 py-2.5 text-xs font-bold rounded-lg bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0C1322] disabled:opacity-40 cursor-pointer shadow-xs"
                    >
                      {isEvaluating ? "Evaluating..." : "Submit Answer ✓"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODE 3: OFFICIAL PAST PAPERS ARCHIVE WITH CASE STUDIES   */}
            {/* ======================================================== */}
            {practiceMode === "verified_archive" && (
              <div className="flex flex-col">
                {/* Paper & Mark Tier Filter Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--sheet-surface)] dark:bg-neutral-900/60 px-4 py-3 text-xs">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1" role="group" aria-label="Filter by paper">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mr-1">
                        Paper:
                      </span>
                      {(["all", 1, 2] as const).map((p) => (
                        <button
                          key={String(p)}
                          type="button"
                          onClick={() => {
                            setVerifiedPaperFilter(p);
                            setCurrentVerifiedIndex(0);
                          }}
                          aria-pressed={verifiedPaperFilter === p}
                          className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                            verifiedPaperFilter === p
                              ? "bg-[var(--green)] text-white"
                              : "bg-[var(--white)] dark:bg-neutral-800 border border-[var(--line)] text-[var(--ink)] dark:text-neutral-200 hover:bg-[var(--practice-bg)]"
                          }`}
                        >
                          {p === "all" ? "All Papers" : `Paper ${p}`}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1" role="group" aria-label="Filter by marks">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mr-1">
                        Marks:
                      </span>
                      {(["all", 2, 4, 6, 8, 12] as const).map((m) => (
                        <button
                          key={String(m)}
                          type="button"
                          onClick={() => {
                            setVerifiedMarkFilter(m as MarkTier | "all");
                            setCurrentVerifiedIndex(0);
                          }}
                          aria-pressed={verifiedMarkFilter === m}
                          className={`px-2 py-1 rounded-md font-mono font-bold transition-colors cursor-pointer ${
                            verifiedMarkFilter === m
                              ? "bg-[var(--green)] text-white"
                              : "bg-[var(--white)] dark:bg-neutral-800 border border-[var(--line)] text-[var(--ink)] dark:text-neutral-200 hover:bg-[var(--practice-bg)]"
                          }`}
                        >
                          {m === "all" ? "All" : `${m}m`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="font-mono text-[11px] text-[var(--muted)] tabular-nums">
                    {filteredVerifiedQuestions.length} of {VERIFIED_QUESTIONS.length} questions
                  </div>
                </div>

                {activeVerifiedQuestion ? (
                  <div className="study-columns study-paper-one-columns">
                    {/* LEFT COLUMN: FULL CASE STUDY & APPENDICES */}
                    <section className="study-case-panel" aria-labelledby="verified-case-title">
                      <div className="study-panel-header">
                        <div className="min-w-0">
                          <p className="study-panel-kicker">
                            {activeVerifiedQuestion.syllabus} · {activeVerifiedQuestion.paper_code} ·{" "}
                            {activeVerifiedQuestion.series} {activeVerifiedQuestion.year}
                          </p>
                          <h2 id="verified-case-title" className="study-panel-title">
                            {activeVerifiedCaseStudy?.businessTitle || "Case Study"}
                          </h2>
                        </div>
                        <div role="group" aria-label="Past paper question navigation" className="study-pager">
                          <button
                            type="button"
                            onClick={() =>
                              setCurrentVerifiedIndex((i) =>
                                filteredVerifiedQuestions.length > 0
                                  ? (i - 1 + filteredVerifiedQuestions.length) % filteredVerifiedQuestions.length
                                  : 0
                              )
                            }
                            className="study-pager-button"
                            aria-label="Previous question"
                            title="Previous question"
                          >
                            <ChevronLeft size={18} aria-hidden="true" />
                          </button>
                          <span className="study-page-count">
                            {safeVerifiedIndex + 1} / {filteredVerifiedQuestions.length}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setCurrentVerifiedIndex((i) =>
                                filteredVerifiedQuestions.length > 0
                                  ? (i + 1) % filteredVerifiedQuestions.length
                                  : 0
                              )
                            }
                            className="study-pager-button"
                            aria-label="Next question"
                            title="Next question"
                          >
                            <ChevronRight size={18} aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      {/* Appendix Tabs for Paper 2 Case Studies */}
                      {activeVerifiedCaseStudy?.appendices && activeVerifiedCaseStudy.appendices.length > 0 && (
                        <div className="px-4 sm:px-6 pb-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Case study documents">
                          <button
                            type="button"
                            role="tab"
                            aria-selected={activeVerifiedCaseTab === "main"}
                            onClick={() => setActiveVerifiedCaseTab("main")}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                              activeVerifiedCaseTab === "main"
                                ? "bg-[var(--green)] text-white"
                                : "bg-[var(--paper)] dark:bg-neutral-800 border border-[var(--line)] text-[var(--ink)] dark:text-neutral-200 hover:bg-[var(--practice-bg)]"
                            }`}
                          >
                            Case Study
                          </button>
                          {activeVerifiedCaseStudy.appendices.map((app, idx) => (
                            <button
                              key={app.label}
                              type="button"
                              role="tab"
                              aria-selected={activeVerifiedCaseTab === idx}
                              onClick={() => setActiveVerifiedCaseTab(idx)}
                              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                                activeVerifiedCaseTab === idx
                                  ? "bg-[var(--green)] text-white"
                                  : "bg-[var(--paper)] dark:bg-neutral-800 border border-[var(--line)] text-[var(--ink)] dark:text-neutral-200 hover:bg-[var(--practice-bg)]"
                              }`}
                            >
                              {app.label}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Case Study Narrative / Appendix Content */}
                      <div className="study-case-text space-y-3">
                        {activeVerifiedCaseTab === "main" ? (
                          <>
                            <div>{activeVerifiedCaseStudy?.mainCase || activeVerifiedQuestion.case_context}</div>
                            {activeVerifiedCaseStudy?.table && (
                              <div className="mt-3 overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--paper)] dark:bg-neutral-900 p-3">
                                <pre className="font-mono text-[11px] sm:text-xs leading-relaxed text-[var(--ink)] dark:text-neutral-200 whitespace-pre">
                                  {activeVerifiedCaseStudy.table}
                                </pre>
                              </div>
                            )}
                          </>
                        ) : (
                          activeVerifiedCaseStudy?.appendices?.[activeVerifiedCaseTab] && (
                            <div className="overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--paper)] dark:bg-neutral-900 p-3.5">
                              <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mb-2">
                                {activeVerifiedCaseStudy.appendices[activeVerifiedCaseTab].label}
                              </div>
                              <pre className="font-mono text-[11px] sm:text-xs leading-relaxed text-[var(--ink)] dark:text-neutral-200 whitespace-pre-wrap">
                                {activeVerifiedCaseStudy.appendices[activeVerifiedCaseTab].body}
                              </pre>
                            </div>
                          )
                        )}

                        {(activeVerifiedQuestion.question_pdf || activeVerifiedQuestion.insert_pdf || activeVerifiedQuestion.mark_scheme_pdf) && (
                          <div className="pt-3 border-t border-dashed border-[var(--line)] flex flex-wrap gap-3 font-mono text-[11px]">
                            {activeVerifiedQuestion.question_pdf && (
                              <a
                                href={activeVerifiedQuestion.question_pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-[var(--green)] dark:text-[#e4eeb2] hover:underline"
                              >
                                Question Paper PDF ↗
                              </a>
                            )}
                            {activeVerifiedQuestion.insert_pdf && (
                              <a
                                href={activeVerifiedQuestion.insert_pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-[var(--green)] dark:text-[#e4eeb2] hover:underline"
                              >
                                Case Insert PDF ↗
                              </a>
                            )}
                            {activeVerifiedQuestion.mark_scheme_pdf && (
                              <a
                                href={activeVerifiedQuestion.mark_scheme_pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-[#97532b] dark:text-[#e6b39b] hover:underline"
                              >
                                Mark Scheme PDF ↗
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </section>

                    {/* RIGHT COLUMN: QUESTION PROMPT & ANSWER EDITOR */}
                    <div className="study-paper-one-editor">
                      <section className="study-answer space-y-4" aria-labelledby="verified-active-question">
                        <div className="study-question-header">
                          <div className="text-xs font-mono font-semibold text-[var(--muted)]">
                            {activeVerifiedQuestion.unit} · Question {activeVerifiedQuestion.question} ·{" "}
                            <strong className="text-[var(--ink)] dark:text-white">
                              {activeVerifiedQuestion.marks} marks
                            </strong>
                          </div>
                          <button
                            type="button"
                            onClick={() => onToggleBookmark(currentActiveId)}
                            aria-pressed={isBookmarked}
                            className="study-bookmark"
                          >
                            {isBookmarked ? "★ Bookmarked" : "☆ Bookmark"}
                          </button>
                        </div>

                        <h2 id="verified-active-question" className="study-prompt">
                          {activeVerifiedQuestion.question_paraphrase}
                        </h2>

                        <div className="space-y-2">
                          <div className="study-answer-meta">
                            <div className="flex flex-wrap items-center gap-2">
                              <label htmlFor="verified-archive-response">Your response</label>
                              {studentAnswer.trim() ? (
                                <span className="font-mono text-[11px] text-[var(--muted)]">
                                  · Draft saved locally
                                </span>
                              ) : null}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono">
                              <span>Words: {wordCount}</span>
                              <span>Time: {formatTime(timerSeconds)}</span>
                              {studentAnswer.trim() && (
                                <button
                                  type="button"
                                  onClick={handleClearDraft}
                                  className="text-[11px] text-slate-400 hover:text-rose-500 cursor-pointer underline transition-colors"
                                >
                                  Clear Draft
                                </button>
                              )}
                              {!timerRunning ? (
                                <button
                                  type="button"
                                  onClick={() => setTimerRunning(true)}
                                  className="text-xs font-semibold text-blue-600 dark:text-sky-400 cursor-pointer"
                                >
                                  ▶ Start Timer
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setTimerRunning(false)}
                                  className="text-xs font-semibold text-amber-600 dark:text-amber-400 cursor-pointer"
                                >
                                  ⏸ Pause Timer
                                </button>
                              )}
                            </div>
                          </div>

                          <textarea
                            id="verified-archive-response"
                            value={studentAnswer}
                            onChange={(e) => handleAnswerChange(e.target.value)}
                            placeholder={
                              activeVerifiedQuestion.marks <= 2
                                ? "Write a clear, precise definition or state the required points..."
                                : activeVerifiedQuestion.marks === 4
                                ? `State Point 1 applied to ${activeVerifiedCaseStudy?.businessTitle || "the case"}, then Point 2 applied to the case...`
                                : activeVerifiedQuestion.marks <= 8
                                ? `Apply each point to ${activeVerifiedCaseStudy?.businessTitle || "the case facts & figures"} and develop causal chains ('this leads to... as a result...')...`
                                : `Compare each option using ${activeVerifiedCaseStudy?.businessTitle || "case facts and appendix figures"}, weigh trade-offs, and finish with a justified recommendation...`
                            }
                            rows={activeVerifiedQuestion.marks >= 8 ? 9 : 6}
                            className="study-response"
                          />
                        </div>

                        <div className="study-answer-actions">
                          <div className="font-mono text-[11px] text-[var(--muted)]">
                            {activeVerifiedQuestion.paper === 2
                              ? "Use case study & appendices in your answer"
                              : "Refer directly to the business context"}
                          </div>
                          <button
                            type="button"
                            disabled={isEvaluating || !studentAnswer.trim()}
                            onClick={handleSubmitEvaluation}
                            className="study-action btn-primary disabled:opacity-40"
                          >
                            {isEvaluating ? "Assessing response…" : "Submit for assessment"}
                          </button>
                        </div>
                      </section>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-3">
                    <p className="text-sm font-semibold text-[var(--ink)] dark:text-white">
                      No past paper questions match the selected topic, paper, and mark filters.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setVerifiedUnitFilter("all");
                        setVerifiedPaperFilter("all");
                        setVerifiedMarkFilter("all");
                        setCurrentVerifiedIndex(0);
                      }}
                      className="study-action btn-primary"
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ASSESSMENT RESULTS DRAWER (RULE SCAN + QWEN INTERPRET)   */}
      {/* ======================================================== */}
      {evaluationResult && (
        <div className="mt-8 bg-white dark:bg-neutral-900 border-2 border-[#0F2042] dark:border-white rounded-2xl p-6 lg:p-8 shadow-md space-y-6">
          {/* Top Score Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E5E4] dark:border-neutral-800">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Cambridge Assessment Score Result
                </span>
                {lastCoinsEarned && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold font-mono border border-amber-500/30 flex items-center gap-1 shadow-xs animate-bounce">
                    <span>🪙 +{lastCoinsEarned} Coins Earned!</span>
                  </span>
                )}
                {evaluationResult.manualOverride?.isOverridden && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold font-mono border border-amber-500/30">
                    ⚖️ Manual Override Applied {evaluationResult.manualOverride.bodApplied ? "(+BOD)" : ""}
                  </span>
                )}
              </div>
              <h3 className="font-academic-serif text-3xl font-bold text-[#0F2042] dark:text-white mt-1">
                Score: {evaluationResult.totalScore} / {evaluationResult.maxMarks} Marks ({evaluationResult.percentage}%)
              </h3>
              <p className="text-xs text-[#57534E] dark:text-neutral-400 mt-1 font-mono">
                {evaluationResult.examinerNotes}
              </p>
              {evaluationResult.manualOverride?.isOverridden && (
                <div className="mt-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg p-2.5 font-sans">
                  <strong>Examiner Justification:</strong> {evaluationResult.manualOverride.reason}
                  <span className="text-neutral-400 dark:text-neutral-500 ml-2">
                    (AI original: {evaluationResult.manualOverride.originalScore}/{evaluationResult.maxMarks})
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowOverrideModal(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
                title="Override AI marks, award BOD (Benefit of the Doubt), or adjust score"
              >
                <span>⚖️ Override / BOD Mark</span>
              </button>

              <span className="px-3 py-1.5 rounded-xl bg-[#FAF9F6] dark:bg-black border border-[#E7E5E4] dark:border-neutral-700 text-xs font-mono font-bold text-[#0F2042] dark:text-white">
                {evaluationResult.isAiEvaluated ? "Qwen 3.5 0.8B WebGPU + Rules" : "Website Rules + CIE Examiner"}
              </span>
            </div>
          </div>

          {/* Rule Enforcement Status Cards */}
          {evaluationResult.ruleEnforcement && (
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <strong className="text-slate-900 dark:text-slate-100 block font-mono text-[11px] uppercase tracking-wider">
                Website Code Rules Enforcement Audit:
              </strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Application Rule result */}
                <div
                  className={`p-3 rounded-lg border ${
                    evaluationResult.ruleEnforcement.appWordsRequired.length === 0
                      ? "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                      : evaluationResult.ruleEnforcement.appWordsPassed
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200"
                      : "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200"
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>AO2 Application Keyword Scan:</span>
                    <span>
                      {evaluationResult.ruleEnforcement.appWordsRequired.length === 0
                        ? "N/A (Pure Definition)"
                        : evaluationResult.ruleEnforcement.appWordsPassed
                        ? "✓ Rule Passed"
                        : "✕ Capped to 0"}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px]">
                    {evaluationResult.ruleEnforcement.appWordsRequired.length === 0 ? (
                      "No application words required for this mark tier."
                    ) : evaluationResult.ruleEnforcement.appWordsPassed ? (
                      <span>
                        Found case keywords: <strong className="font-mono">[{evaluationResult.ruleEnforcement.appWordsFound.join(", ")}]</strong>. Awarded AO2 application marks ({evaluationResult.aoBreakdown.ao2.score}/{evaluationResult.aoBreakdown.ao2.max}).
                      </span>
                    ) : (
                      <span>
                        Required words missing ({evaluationResult.ruleEnforcement.appWordsRequired.slice(0, 4).join(", ")}). <strong>Application score automatically set to 0.</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Evaluation Rule result */}
                {evaluationResult.ruleEnforcement.evalWordRequired ? (
                  <div
                    className={`p-3 rounded-lg border ${
                      evaluationResult.ruleEnforcement.evalWordPassed
                        ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200"
                        : "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200"
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>AO4 Evaluation Judgment Scan:</span>
                      <span>
                        {evaluationResult.ruleEnforcement.evalWordPassed ? "✓ Rule Passed" : "✕ Capped to 0"}
                      </span>
                    </div>
                    <div className="mt-1 text-[11px]">
                      {evaluationResult.ruleEnforcement.evalWordPassed ? (
                        <span>
                          Found judgment phrasing: <strong className="font-mono">[{evaluationResult.ruleEnforcement.evalWordsFound?.join(", ")}]</strong>. Awarded AO4 evaluation marks ({evaluationResult.aoBreakdown.ao4.score}/{evaluationResult.aoBreakdown.ao4.max}).
                        </span>
                      ) : (
                        <span>
                          No evaluative judgment phrasing found. <strong>Evaluation score automatically capped at 0.</strong>
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300">
                    <div className="font-bold">Interpretation Status:</div>
                    <div className="mt-1 text-[11px]">
                      Core business concept understanding interpreted and combined with rule scan to compute total score.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Assessment Objectives Breakdown (AO1, AO2, AO3, AO4) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block">AO1 Knowledge</span>
              <strong className="text-lg text-slate-800 dark:text-slate-200">
                {evaluationResult.aoBreakdown.ao1.score} / {evaluationResult.aoBreakdown.ao1.max}
              </strong>
              <p className="text-[11px] font-sans text-slate-600 dark:text-slate-400 mt-1">
                {evaluationResult.aoBreakdown.ao1.feedback}
              </p>
            </div>

            <div
              className={`p-3 rounded-xl border ${
                evaluationResult.ruleEnforcement?.ao2CappedToZero
                  ? "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900"
                  : "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-blue-500 block">AO2 Application</span>
                {evaluationResult.ruleEnforcement?.ao2CappedToZero && (
                  <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 uppercase">
                    Capped
                  </span>
                )}
              </div>
              <strong className="text-lg text-blue-800 dark:text-blue-200">
                {evaluationResult.aoBreakdown.ao2.score} / {evaluationResult.aoBreakdown.ao2.max}
              </strong>
              <p className="text-[11px] font-sans text-blue-600 dark:text-blue-400 mt-1">
                {evaluationResult.aoBreakdown.ao2.feedback}
              </p>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900">
              <span className="text-[10px] text-amber-500 block">AO3 Analysis</span>
              <strong className="text-lg text-amber-800 dark:text-amber-200">
                {evaluationResult.aoBreakdown.ao3.score} / {evaluationResult.aoBreakdown.ao3.max}
              </strong>
              <p className="text-[11px] font-sans text-amber-600 dark:text-amber-400 mt-1">
                {evaluationResult.aoBreakdown.ao3.feedback}
              </p>
            </div>

            <div
              className={`p-3 rounded-xl border ${
                evaluationResult.ruleEnforcement?.ao4CappedToZero
                  ? "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900"
                  : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-emerald-500 block">AO4 Evaluation</span>
                {evaluationResult.ruleEnforcement?.ao4CappedToZero && (
                  <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 uppercase">
                    Capped
                  </span>
                )}
              </div>
              <strong className="text-lg text-emerald-800 dark:text-emerald-200">
                {evaluationResult.aoBreakdown.ao4.score} / {evaluationResult.aoBreakdown.ao4.max}
              </strong>
              <p className="text-[11px] font-sans text-emerald-600 dark:text-emerald-400 mt-1">
                {evaluationResult.aoBreakdown.ao4.feedback}
              </p>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl space-y-1.5">
              <strong className="text-emerald-900 dark:text-emerald-200 block text-[11px] font-mono uppercase">
                Demonstrated Strengths:
              </strong>
              <ul className="space-y-1 text-emerald-800 dark:text-emerald-300">
                {evaluationResult.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span>✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl space-y-1.5">
              <strong className="text-amber-900 dark:text-amber-200 block text-[11px] font-mono uppercase">
                Key Improvements to Access Higher Mark Band:
              </strong>
              <ul className="space-y-1 text-amber-800 dark:text-amber-300">
                {evaluationResult.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span>→</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Student Response Live AO Highlighter Toggle & Viewer */}
          <div className="space-y-3 pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowLiveStudentAoHighlight(!showLiveStudentAoHighlight)}
                className="px-3.5 py-1.5 rounded-lg border border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>{showLiveStudentAoHighlight ? "▼ Hide" : "▶ Inspect"} Student Answer AO Highlighting</span>
                <span className="text-[10px] font-mono opacity-80">(AO1, AO2, AO3, AO4)</span>
              </button>
              <span className="text-[11px] text-neutral-400 font-mono">
                Real-time Cambridge rubric color scanner
              </span>
            </div>

            {showLiveStudentAoHighlight && (
              <AOHighlightViewer
                title="Your Submitted Response — Live AO Structure Analysis"
                text={studentAnswer}
                isStudentAnswer={true}
              />
            )}
          </div>

          {/* Official Cambridge Model Answer Outline with AO Color Coding */}
          <AOHighlightViewer
            title="Official Cambridge Model Answer Outline"
            text={evaluationResult.modelAnswerSnippet}
            isStudentAnswer={false}
          />
        </div>
      )}

      {/* Manual Mark Override & BOD Credit Modal */}
      {evaluationResult && (
        <MarkOverrideModal
          isOpen={showOverrideModal}
          onClose={() => setShowOverrideModal(false)}
          result={evaluationResult}
          onApplyOverride={handleApplyOverride}
          onResetOverride={handleResetOverride}
        />
      )}

      {/* Factors of Production & Factor Rewards Diagram Modal */}
      <FactorsOfProductionDiagram
        isOpen={showFactorsDiagramModal}
        onClose={() => setShowFactorsDiagramModal(false)}
      />
    </div>
  );
}

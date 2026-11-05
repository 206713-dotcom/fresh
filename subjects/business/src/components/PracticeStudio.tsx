"use client";

import React, { useState, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
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
import { evaluateStudentEssay, scanApplicationKeywords, scanEvaluationKeywords } from "../lib/engine/evaluator";
import { checkWebGPUSupport, initializeWebLLM, WebLLMStatus } from "../lib/engine/webllm";
import { formatTime } from "../lib/utils";
import {
  saveAnswerDraft,
  loadAnswerDraft,
  removeAnswerDraft,
  savePracticeSessionState,
  loadPracticeSessionState,
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
    if (initialSectionCode === "4") return "P1_U4_SET_01";
    if (initialSectionCode === "3") return "P1_U3_SET_01";
    if (initialSectionCode === "2") return "P1_U2_SET_21";
    return "P1_U1_SET_01";
  });

  const activePaper1Scenario: Paper1ScenarioSet = useMemo(() => {
    return PAPER1_DATABASE.find((s) => s.scenario_id === activeScenarioId) || PAPER1_DATABASE[0];
  }, [activeScenarioId]);

  const selectedUnit: 1 | 2 | 3 | 4 = useMemo(() => {
    if (activePaper1Scenario.unit.includes("Unit 4")) return 4;
    if (activePaper1Scenario.unit.includes("Unit 3")) return 3;
    if (activePaper1Scenario.unit.includes("Unit 2")) return 2;
    return 1;
  }, [activePaper1Scenario]);

  // Scenarios belonging to current unit (strictly isolated 20 scenarios per section)
  const currentUnitScenarios = useMemo(() => {
    return PAPER1_DATABASE.filter((s) => s.unit.includes(`Unit ${selectedUnit}`));
  }, [selectedUnit]);

  // Current index in current unit (0 to 19)
  const currentIndexInUnit = useMemo(() => {
    const idx = currentUnitScenarios.findIndex((s) => s.scenario_id === activeScenarioId);
    return idx >= 0 ? idx : 0;
  }, [currentUnitScenarios, activeScenarioId]);

  // Active Part: "a" (2m) | "b" (4m) | "c" (6m) | "d" (8m)
  const [activePart, setActivePart] = useState<"a" | "b" | "c" | "d">("b");
  const activePaper1Question: Paper1Question = useMemo(() => {
    return activePaper1Scenario.questions.find((q) => q.part === activePart) || activePaper1Scenario.questions[1];
  }, [activePaper1Scenario, activePart]);

  // Sync initial section code from parent if provided
  useEffect(() => {
    if (initialSectionCode === "4") {
      setActiveScenarioId("P1_U4_SET_01");
    } else if (initialSectionCode === "3") {
      setActiveScenarioId("P1_U3_SET_01");
    } else if (initialSectionCode === "2") {
      setActiveScenarioId("P1_U2_SET_21");
    } else if (initialSectionCode === "1") {
      setActiveScenarioId("P1_U1_SET_01");
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
  // VERIFIED ARCHIVE STATES
  // ==========================================
  const [currentVerifiedIndex, setCurrentVerifiedIndex] = useState<number>(0);
  const [verifiedMarkFilter, setVerifiedMarkFilter] = useState<MarkTier>(4);

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
    const list = VERIFIED_QUESTIONS.filter((q) => q.marks === verifiedMarkFilter);
    const vq = list[currentVerifiedIndex % list.length] || VERIFIED_QUESTIONS[0];
    return `vq_${vq.id || currentVerifiedIndex}`;
  }, [practiceMode, activePaper1Scenario.scenario_id, activePaper1Question.part, activePaper2Question.id, verifiedMarkFilter, currentVerifiedIndex]);

  // Student answer initialized from localStorage draft
  const [studentAnswer, setStudentAnswer] = useState<string>(() => {
    return loadAnswerDraft(
      practiceMode === "paper1_database"
        ? `${activeScenarioId}_${activePart}`
        : practiceMode === "paper2_case_study"
        ? activePaper2Question.id
        : `vq_0`
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
    });
  }, [practiceMode, activeScenarioId, activePart, selectedUnit, activePaper2QIndex, currentVerifiedIndex, verifiedMarkFilter]);

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

  // Engine: Instant CIE Examiner vs Local Qwen 2.5 0.5B (WebLLM)
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

  // Load WebLLM
  const handleLoadWebLLM = async () => {
    try {
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

  const handleSelectUnit = (unitNum: 1 | 2 | 3 | 4) => {
    let targetScenarioId = "P1_U1_SET_01";
    if (unitNum === 2) targetScenarioId = "P1_U2_SET_21";
    if (unitNum === 3) targetScenarioId = "P1_U3_SET_01";
    if (unitNum === 4) targetScenarioId = "P1_U4_SET_01";

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
        const vq = VERIFIED_QUESTIONS.filter((q) => q.marks === verifiedMarkFilter)[currentVerifiedIndex] || VERIFIED_QUESTIONS[0];
        title = `${vq.syllabus} ${vq.paper_code} Q${vq.question} (${vq.marks} marks)`;
        prompt = vq.question_paraphrase;
        context = vq.case_context || "General Cambridge business scenario.";
        questionId = vq.id;
        unit = vq.unit;
        targetMarks = vq.marks as MarkTier;
        rubric = {
          totalMarks: targetMarks,
          ao1Max: 2,
          ao2Max: targetMarks >= 4 ? 2 : 0,
          ao3Max: targetMarks >= 6 ? 2 : 0,
          ao4Max: targetMarks >= 8 ? 2 : 0,
          descriptors: {
            ao1: ["Demonstrates syllabus knowledge."],
            ao2: ["Applies context."],
            ao3: ["Analyzes outcomes."],
          },
          indicativeContent: [vq.question_paraphrase],
          sampleStrongPoint: "Clear explanation with relevant Cambridge terminology.",
        };
      }

      const result = await evaluateStudentEssay({
        questionTitle: title,
        questionPrompt: prompt,
        caseContext: context,
        marks: targetMarks,
        rubric,
        studentAnswer,
        webllmEngine: aiEngineType === "webllm" ? webllmEngine : undefined,
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
        paper: practiceMode === "paper2_case_study" ? 2 : 1,
        syllabus: "0264",
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 transition-colors">
      {/* Top Header & Quick Launcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              CIE Cambridge 0264 Practice Platform
            </span>
          </div>
          <h1 className="font-academic-serif text-2xl sm:text-3xl font-bold text-[#0F2042] dark:text-white">
            Paper 1 Examination Studio
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] dark:text-neutral-400">
            Paper 1 Topical Case Studies · 2, 4, 6, 8 Mark Prompts · Rule-Based Application & Qwen 0.5B Interpretation
          </p>
        </div>

        {/* Engine & Timer Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Factors of Production Diagram Drawer Button */}
          <button
            onClick={() => setShowFactorsDiagramModal(true)}
            className="px-3.5 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            title="Interactive Diagram & Visuals: Land -> Rent, Labour -> Wages, Capital -> Interest, Enterprise -> Profit"
          >
            <span>📊 Factors of Production & Rewards</span>
          </button>

          {onOpenStudySpace && (
            <button
              onClick={onOpenStudySpace}
              className="px-3.5 py-1.5 rounded-lg border border-indigo-500/40 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              title="Launch Aesthetic Study Space & Focus Pomodoro Timer"
            >
              <span>🎧 Study Space & Timer</span>
            </button>
          )}

          {/* AI Engine Switcher */}
          <div className="flex items-center gap-1.5 bg-[#F5F5F4] dark:bg-neutral-900 p-1 rounded-lg border border-[#E7E5E4] dark:border-neutral-700 text-xs">
            <button
              onClick={() => setAiEngineType("instant")}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                aiEngineType === "instant"
                  ? "bg-white dark:bg-black text-[#0F2042] dark:text-white shadow-xs font-semibold"
                  : "text-[#57534E] dark:text-neutral-400 hover:text-[#1C1917] dark:hover:text-white"
              }`}
            >
              Instant Examiner
            </button>
            <button
              onClick={() => {
                if (!webllmEngine && webllmStatus.isSupported) {
                  handleLoadWebLLM();
                } else if (webllmEngine) {
                  setAiEngineType("webllm");
                }
              }}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                aiEngineType === "webllm"
                  ? "bg-white dark:bg-black text-[#0F2042] dark:text-white shadow-xs font-semibold"
                  : "text-[#57534E] dark:text-neutral-400 hover:text-[#1C1917] dark:hover:text-white"
              }`}
            >
              <span>Local Qwen 0.5B</span>
              {webllmStatus.isLoading && (
                <span className="text-[10px] text-amber-500 font-mono animate-pulse">({webllmStatus.progressPercent}%)</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Paper & Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 bg-[#F5F5F4] dark:bg-neutral-900 rounded-xl border border-[#E7E5E4] dark:border-neutral-800 mb-6 text-xs font-medium">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setPracticeMode("paper1_database")}
            className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              practiceMode === "paper1_database"
                ? "bg-[#0F2042] dark:bg-white text-white dark:text-black font-bold shadow-xs"
                : "text-[#57534E] dark:text-neutral-400 hover:text-[#1C1917] dark:hover:text-white"
            }`}
          >
            <span>🔍 Topical Questions</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold">
              Topical Case Studies
            </span>
          </button>

          <button
            onClick={() => setPracticeMode("verified_archive")}
            className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              practiceMode === "verified_archive"
                ? "bg-[#0F2042] dark:bg-white text-white dark:text-black font-bold shadow-xs"
                : "text-[#57534E] dark:text-neutral-400 hover:text-[#1C1917] dark:hover:text-white"
            }`}
          >
            <span>🏛 Official Past Papers (Separate Archive)</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-800 dark:text-blue-300 font-bold">
              189 Questions
            </span>
          </button>

          <button
            onClick={() => setPracticeMode("paper2_case_study")}
            className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              practiceMode === "paper2_case_study"
                ? "bg-[#0F2042] dark:bg-white text-white dark:text-black font-bold shadow-xs"
                : "text-[#57534E] dark:text-neutral-400 hover:text-[#1C1917] dark:hover:text-white"
            }`}
          >
            <span>📋 Paper 2 Specimen Insert</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300">
              Tasty Treats (TT)
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {onOpenSections && (
            <button
              onClick={onOpenSections}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 text-sky-800 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60"
            >
              📑 Syllabus Chapters (1–6)
            </button>
          )}
          {onOpenQuickQuiz && (
            <button
              onClick={onOpenQuickQuiz}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60"
            >
              ⚡ Quick Quiz
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODE 1: PAPER 1 AUTHENTIC DATABASE (SECTIONS 1, 2, 3 & 4) */}
      {/* ======================================================== */}
      {practiceMode === "paper1_database" && (
        <div className="space-y-6">
          {/* Scenario Navigator: Concise Question X of 20 with Section Toggles */}
          <div className="bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 rounded-xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Unit Toggles for Sections 1, 2, 3, and 4 */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectUnit(1)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedUnit === 1
                      ? "bg-[#0F2042] dark:bg-white text-white dark:text-black shadow-xs"
                      : "bg-[#FAF9F6] dark:bg-black text-[#57534E] dark:text-neutral-400 border border-[#E7E5E4] dark:border-neutral-800 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800"
                  }`}
                >
                  Section 1: Business Activity (1–20)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectUnit(2)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedUnit === 2
                      ? "bg-[#0F2042] dark:bg-white text-white dark:text-black shadow-xs"
                      : "bg-[#FAF9F6] dark:bg-black text-[#57534E] dark:text-neutral-400 border border-[#E7E5E4] dark:border-neutral-800 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800"
                  }`}
                >
                  Section 2: People in Business (1–20)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectUnit(3)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedUnit === 3
                      ? "bg-[#0F2042] dark:bg-white text-white dark:text-black shadow-xs"
                      : "bg-[#FAF9F6] dark:bg-black text-[#57534E] dark:text-neutral-400 border border-[#E7E5E4] dark:border-neutral-800 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800"
                  }`}
                >
                  Section 3: Marketing (1–20)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectUnit(4)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedUnit === 4
                      ? "bg-[#0F2042] dark:bg-white text-white dark:text-black shadow-xs"
                      : "bg-[#FAF9F6] dark:bg-black text-[#57534E] dark:text-neutral-400 border border-[#E7E5E4] dark:border-neutral-800 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800"
                  }`}
                >
                  Section 4: Operations (1–20)
                </button>
              </div>

              {/* Stable Question Navigation: Prev / Next with fixed indicator */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handlePrevScenario}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-neutral-700 bg-white dark:bg-black text-xs font-semibold hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-[#1C1917] dark:text-white cursor-pointer transition-colors active:scale-95"
                  title="Previous question"
                >
                  ← Prev
                </button>
                <span className="text-xs font-mono font-bold px-2.5 py-1.5 rounded-lg bg-[#FAF9F6] dark:bg-black border border-slate-200 dark:border-neutral-800 text-[#0F2042] dark:text-white min-w-[72px] text-center">
                  {currentIndexInUnit + 1} / {currentUnitScenarios.length}
                </span>
                <button
                  type="button"
                  onClick={handleNextScenario}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-neutral-700 bg-white dark:bg-black text-xs font-semibold hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-[#1C1917] dark:text-white cursor-pointer transition-colors active:scale-95"
                  title="Next question"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* TWO-COLUMN LAYOUT: CASE STUDY ON LEFT, QUESTIONS ON RIGHT */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: FULL VISIBLE CASE STUDY CONTEXT */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white dark:bg-neutral-900 border border-slate-300 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#E7E5E4] dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-[#0F2042] text-white dark:bg-white dark:text-black font-mono font-bold text-xs">
                      Question {currentIndexInUnit + 1}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#57534E] dark:text-neutral-400">
                      {activePaper1Scenario.unit.split(":")[0]}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono text-[11px] font-bold">
                    {activePaper1Scenario.scenario_stem.split(/\s+/).length} Words (Case Study)
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-neutral-400 block mb-2 font-bold">
                    Authentic Cambridge Scenario Narrative:
                  </span>
                  {/* Full Case Study Stem Paragraphs */}
                  <div className="text-sm sm:text-base leading-relaxed text-[#1C1917] dark:text-neutral-100 font-academic-serif whitespace-pre-line bg-[#FAF9F6] dark:bg-black p-4 sm:p-5 rounded-lg border border-slate-200 dark:border-neutral-800 shadow-inner">
                    {activePaper1Scenario.scenario_stem}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: 4 QUESTIONS ON TOP, THEN ACTIVE QUESTION ANSWERING CARD */}
            <div className="lg:col-span-7 space-y-4">
              {/* All 4 Questions for this Case Study */}
              <div className="bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 rounded-xl p-4 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#E7E5E4] dark:border-neutral-800">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F2042] dark:text-white">
                    All 4 Questions for this Case Study:
                  </span>
                  <span className="text-[11px] text-[#78716C] dark:text-neutral-400 font-medium">
                    Click to answer
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activePaper1Scenario.questions.map((q) => {
                    const isCurrent = activePart === q.part;
                    return (
                      <button
                        key={q.part}
                        type="button"
                        onClick={() => handleSelectPart(q.part)}
                        className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                          isCurrent
                            ? "bg-[#0F2042]/5 dark:bg-neutral-800 border-[#0F2042] dark:border-white ring-1 ring-[#0F2042] dark:ring-white"
                            : "bg-[#FAF9F6] dark:bg-black border-slate-200 dark:border-neutral-800 hover:border-slate-400 dark:hover:border-neutral-600"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-mono font-bold text-xs text-[#0F2042] dark:text-white">
                            Part ({q.part.toUpperCase()}) — {q.mark_value} Marks
                          </span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-600 text-white">
                              CURRENT QUESTION
                            </span>
                          )}
                        </div>
                        <p className="font-academic-serif text-xs text-[#1C1917] dark:text-neutral-200 line-clamp-2 leading-snug">
                          {q.question_text}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
                {/* Header info */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E7E5E4] dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-[#0F2042]/10 dark:bg-white/10 text-[#0F2042] dark:text-white text-xs font-bold font-mono">
                      Part ({activePaper1Question.part.toUpperCase()})
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 text-xs font-bold font-mono">
                      {activePaper1Question.mark_value} Marks Total
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onToggleBookmark(currentActiveId)}
                      className={`text-xs px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                        isBookmarked
                          ? "bg-amber-50 dark:bg-amber-950 text-amber-600 border-amber-300"
                          : "border-[#E7E5E4] dark:border-neutral-700 text-[#78716C] dark:text-neutral-400"
                      }`}
                    >
                      {isBookmarked ? "★ Bookmarked" : "☆ Bookmark"}
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <h2 className="font-academic-serif text-lg sm:text-xl font-bold text-[#1C1917] dark:text-white leading-relaxed">
                  {activePaper1Question.question_text}
                </h2>

                {/* Answer Editor Area */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#78716C] dark:text-neutral-400">
                    <div className="flex items-center gap-2">
                      <span>Student Response:</span>
                      {studentAnswer.trim() ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Draft auto-saved locally
                        </span>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-3 font-mono">
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
                    className="w-full p-4 bg-[#FAF9F6] dark:bg-black border border-[#E7E5E4] dark:border-neutral-700 rounded-xl text-sm leading-relaxed text-[#1C1917] dark:text-white focus:ring-2 focus:ring-[#0F2042] dark:focus:ring-white focus:outline-none transition-all font-sans"
                  />
                </div>

                {/* Bottom Actions Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3.5 border-t border-[#E7E5E4] dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setShowMarkScheme(!showMarkScheme)}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-[#E7E5E4] dark:border-neutral-700 text-[#57534E] dark:text-neutral-300 hover:bg-[#FAF9F6] dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    {showMarkScheme ? "Hide Mark Scheme Tips" : "Preview Cambridge Mark Scheme & Model Answer"}
                  </button>

                  <button
                    type="button"
                    disabled={isEvaluating || !studentAnswer.trim()}
                    onClick={handleSubmitEvaluation}
                    className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold rounded-lg bg-[#0F2042] dark:bg-white text-white dark:text-black hover:opacity-95 disabled:opacity-40 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isEvaluating ? "Evaluating with Rules & Qwen Interpretation..." : "Submit for Assessment ✓"}
                  </button>
                </div>

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
      </div>
    </div>
  )}

      {/* ======================================================== */}
      {/* MODE 2: PAPER 2 CASE STUDY SPECIMEN INSERT               */}
      {/* ======================================================== */}
      {practiceMode === "paper2_case_study" && (
        <div className="space-y-6">
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
      {/* MODE 3: SEPARATE OFFICIAL PAST PAPERS ARCHIVE            */}
      {/* ======================================================== */}
      {practiceMode === "verified_archive" && (
        <div className="space-y-6">
          {/* Header Notice explicitly stating this is separate from the topical database */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-1 rounded-md bg-blue-600 text-white font-bold text-xs shrink-0">🏛</span>
              <span className="text-blue-950 dark:text-blue-200">
                <strong>Separate Official Past Papers Archive (189 Questions):</strong> Authentic Cambridge examination questions from official past papers (0264) with actual exam codes (e.g. 0264/11/M/J/22). (Use the <em>Topical Questions Database</em> tab above for Section 1 & 2 case study scenario sets).
              </span>
            </div>
            <button
              onClick={() => setPracticeMode("paper1_database")}
              className="px-3 py-1.5 bg-white dark:bg-neutral-900 border border-blue-300 dark:border-blue-800 text-blue-800 dark:text-blue-300 font-bold rounded-lg shrink-0 cursor-pointer hover:bg-blue-50"
            >
              Topical Database →
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold">Filter Marks:</span>
              {([2, 4, 6, 8] as MarkTier[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setVerifiedMarkFilter(m);
                    setCurrentVerifiedIndex(0);
                  }}
                  className={`px-2.5 py-1 rounded font-mono font-bold ${
                    verifiedMarkFilter === m
                      ? "bg-[#0F2042] text-white dark:bg-[#38BDF8] dark:text-[#0C1322]"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentVerifiedIndex === 0}
                onClick={() => setCurrentVerifiedIndex((i) => i - 1)}
                className="px-3 py-1 rounded border disabled:opacity-40"
              >
                ← Prev
              </button>
              <button
                onClick={() => setCurrentVerifiedIndex((i) => i + 1)}
                className="px-3 py-1 rounded bg-[#0F2042] text-white dark:bg-[#38BDF8] dark:text-[#0C1322]"
              >
                Next →
              </button>
            </div>
          </div>

          {(() => {
            const list = VERIFIED_QUESTIONS.filter((q) => q.marks === verifiedMarkFilter);
            const vq = list[currentVerifiedIndex % list.length] || VERIFIED_QUESTIONS[0];
            return (
              <div className="bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[#0F2042] dark:text-[#38BDF8]">
                  <span>{vq.syllabus} {vq.paper_code} Q{vq.question} ({vq.marks} marks)</span>
                  <span>{vq.unit}</span>
                </div>
                {vq.case_context && (
                  <p className="text-xs italic text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                    Context: {vq.case_context}
                  </p>
                )}
                <h3 className="font-academic-serif text-lg font-bold">
                  {vq.question_paraphrase}
                </h3>
                <div className="flex items-center justify-between text-xs text-[#78716C] dark:text-neutral-400">
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
                  placeholder="Write your answer..."
                  rows={6}
                  className="w-full p-4 bg-[#FAF9F6] dark:bg-black border border-[#E7E5E4] dark:border-neutral-700 rounded-xl text-sm leading-relaxed text-[#1C1917] dark:text-white focus:ring-2 focus:ring-[#0F2042] dark:focus:ring-white focus:outline-none transition-all font-sans"
                />
                <div className="flex justify-end">
                  <button
                    disabled={isEvaluating || !studentAnswer.trim()}
                    onClick={handleSubmitEvaluation}
                    className="px-6 py-2.5 text-xs font-bold rounded-lg bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0C1322] disabled:opacity-40 cursor-pointer shadow-xs"
                  >
                    Submit Response ✓
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

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
                {evaluationResult.isAiEvaluated ? "Qwen 0.5B WebGPU + Rules" : "Website Rules + CIE Examiner"}
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

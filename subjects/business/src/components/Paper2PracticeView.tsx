"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import confetti from "canvas-confetti";
import {
  BookOpen,
  FileText,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  AlertCircle,
  HelpCircle,
  Eye,
  RotateCcw,
  ListOrdered,
  Award,
  Layers,
  Search,
  Check,
  Cpu,
  BarChart2,
  ShieldCheck,
} from "lucide-react";
import {
  PAPER2_DATABASE,
  Paper2Scenario,
  Paper2Question,
  Paper2AppendixTable,
} from "../lib/data/paper2-database";
import {
  evaluatePaper2Answer,
  Paper2EvaluationResult,
} from "../lib/engine/evaluator";
import {
  initializeWebLLM,
  isQwenCachedLocally,
  setQwenCachedLocally,
  checkWebGPUSupport,
  WebLLMStatus,
} from "../lib/engine/webllm";
import {
  awardBonusStudyCoins,
  savePaper2Position,
  loadPaper2Position,
  savePaper2Answers,
  loadPaper2Answers,
} from "../lib/cookies";

interface Paper2PracticeViewProps {
  initialScenarioId?: string;
  onOpenStudySpace?: () => void;
}

export function Paper2PracticeView({
  initialScenarioId = "P2_SET_01",
  onOpenStudySpace,
}: Paper2PracticeViewProps) {
  // Active Scenario from the 100 available sets (resumes from saved position)
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = loadPaper2Position();
      if (saved?.scenarioId && PAPER2_DATABASE.some((s) => s.scenario_id === saved.scenarioId)) {
        return saved.scenarioId;
      }
    }
    return initialScenarioId || "P2_SET_01";
  });
  const activeScenario: Paper2Scenario = useMemo(() => {
    return PAPER2_DATABASE.find((s) => s.scenario_id === selectedScenarioId) || PAPER2_DATABASE[0];
  }, [selectedScenarioId]);

  // Case Study Pane tab: "main" | "app1" | "app2" | "app3"
  const [caseTab, setCaseTab] = useState<"main" | "app1" | "app2" | "app3">("main");

  // Step-by-step sequential questions: index 0 to 7 (1a, 1b, 2a, 2b, 3a, 3b, 4a, 4b) (resumes from saved position)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = loadPaper2Position();
      if (typeof saved?.questionIdx === "number" && saved.questionIdx >= 0 && saved.questionIdx < 8) {
        return saved.questionIdx;
      }
    }
    return 0;
  });
  const activeQuestion: Paper2Question = useMemo(() => {
    return activeScenario.questions[currentQuestionIdx] || activeScenario.questions[0];
  }, [activeScenario, currentQuestionIdx]);

  // Candidate answers stored per question index (loaded from storage for this scenario)
  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    if (typeof window !== "undefined") {
      const saved = loadPaper2Position();
      const scenId = saved?.scenarioId || initialScenarioId || "P2_SET_01";
      return loadPaper2Answers(scenId);
    }
    return {};
  });
  // Evaluations stored per question index
  const [evaluations, setEvaluations] = useState<Record<number, Paper2EvaluationResult>>({});
  // Completed questions tracking (submitted)
  const [completedIndices, setCompletedIndices] = useState<number[]>([]);
  // Whether model answer is revealed for current question
  const [showModelAnswer, setShowModelAnswer] = useState<boolean>(false);
  // Whether exact 0264 mark scheme rubric is revealed for current question
  const [showMarkSchemeRubric, setShowMarkSchemeRubric] = useState<boolean>(false);

  // Manual score override & self-assessment panel state
  const [showOverridePanel, setShowOverridePanel] = useState<boolean>(false);
  const [overrideScore, setOverrideScore] = useState<number>(0);
  const [overrideReason, setOverrideReason] = useState<string>("");

  // Scenario Selector Drawer/Modal State
  const [showScenarioPicker, setShowScenarioPicker] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Qwen AI Engine State
  const [webllmEngine, setWebllmEngine] = useState<any>(null);
  const [isWebGPUSupported, setIsWebGPUSupported] = useState<boolean>(true);
  const [isModelDownloaded, setIsModelDownloaded] = useState<boolean>(() => {
    return isQwenCachedLocally();
  });
  const [showDownloadPromptModal, setShowDownloadPromptModal] = useState<boolean>(false);
  const [webllmStatus, setWebllmStatus] = useState<WebLLMStatus>({
    isSupported: true,
    isLoading: false,
    isReady: false,
    progressText: "",
    progressPercent: 0,
    error: null,
  });
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Check WebGPU capability on mount
  useEffect(() => {
    checkWebGPUSupport().then((supported) => {
      setIsWebGPUSupported(supported);
    });
  }, []);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // Format timer
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Handler to start loading Qwen 3.5 0.8B
  const handleDownloadQwenModel = async () => {
    try {
      setShowDownloadPromptModal(false);
      setWebllmStatus((prev) => ({
        ...prev,
        isLoading: true,
        progressText: "Initiating Qwen 3.5 0.8B download...",
        progressPercent: 5,
      }));

      const engine = await initializeWebLLM((status) => {
        setWebllmStatus(status);
        if (status.isReady) {
          setIsModelDownloaded(true);
          setQwenCachedLocally(true);
        }
      });

      setWebllmEngine(engine);
      setIsModelDownloaded(true);
      setQwenCachedLocally(true);
      setWebllmStatus({
        isSupported: true,
        isLoading: false,
        isReady: true,
        progressText: "Qwen 3.5 0.8B Cached and Ready",
        progressPercent: 100,
        error: null,
      });
    } catch (err: any) {
      console.error("Failed to load Qwen model:", err);
      setWebllmStatus({
        isSupported: false,
        isLoading: false,
        isReady: false,
        progressText: "Could not initialize WebGPU pipeline.",
        progressPercent: 0,
        error: err?.message || "WebGPU initialization failed.",
      });
    }
  };

  // Trigger evaluation
  const handleSubmitCurrentQuestion = async () => {
    const text = (answers[currentQuestionIdx] || "").trim();
    if (!text) return;

    // If Qwen is not loaded yet, prompt student once
    if (!webllmEngine && !isModelDownloaded && !localStorage.getItem("qwen_prompt_dismissed")) {
      setShowDownloadPromptModal(true);
      return;
    }

    setIsEvaluating(true);
    setTimerActive(false);

    try {
      const evalRes = await evaluatePaper2Answer({
        questionNumber: activeQuestion.number,
        questionText: activeQuestion.question_text,
        markValue: activeQuestion.mark_value,
        markScheme: activeQuestion.mark_scheme,
        modelAnswer: activeQuestion.model_answer,
        validAppWords: activeQuestion.qwen_marking_keys?.valid_app_words || [],
        studentAnswer: text,
        caseMainStem: activeScenario.case_study_insert.main_stem,
        webllmEngine: webllmEngine,
      });

      setEvaluations((prev) => ({ ...prev, [currentQuestionIdx]: evalRes }));
      if (!completedIndices.includes(currentQuestionIdx)) {
        setCompletedIndices((prev) => [...prev, currentQuestionIdx]);
      }

      // Bonus coins for completing a Paper 2 question
      const coinsEarned = evalRes.totalScore * 5 + 10;
      awardBonusStudyCoins(coinsEarned);

      // Trigger confetti if high level achieved
      if (evalRes.level.includes("Level 3") || evalRes.level.includes("Band 3") || evalRes.totalScore >= 7) {
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

  // Sync override score when current question or scenario changes
  useEffect(() => {
    const cur = evaluations[currentQuestionIdx];
    if (cur) {
      setOverrideScore(cur.totalScore);
    } else {
      setOverrideScore(activeQuestion.mark_value === 12 ? 8 : 5);
    }
    setOverrideReason("");
    setShowOverridePanel(false);
    setShowMarkSchemeRubric(false);
  }, [currentQuestionIdx, activeScenario]);

  // Handle manual score override / self-assessment
  const handleApplyManualOverride = (newScore: number, customReason?: string) => {
    const maxMarks = activeQuestion.mark_value;
    const clampedScore = Math.max(0, Math.min(maxMarks, Math.round(newScore)));
    const existingEval = evaluations[currentQuestionIdx];
    const originalAiScore = existingEval?.originalAiScore ?? existingEval?.totalScore;

    let levelName = "";
    let levelDesc = "";
    if (maxMarks === 12) {
      if (clampedScore >= 9) {
        levelName = "Level 3 (9–12 marks)";
        levelDesc = "Detailed discussion of all options in context with a fully supported recommendation.";
      } else if (clampedScore >= 5) {
        levelName = "Level 2 (5–8 marks)";
        levelDesc = "Detailed analysis of advantages/disadvantages of options in business context.";
      } else if (clampedScore >= 1) {
        levelName = "Level 1 (1–4 marks)";
        levelDesc = "Outline of concepts or generic points with limited business application.";
      } else {
        levelName = "Level 0 (0 marks)";
        levelDesc = "No creditable points identified.";
      }
    } else {
      if (clampedScore >= 7) {
        levelName = "Maximum Band (7–8 marks)";
        levelDesc = "Exemplar knowledge, strong application to case facts, and thorough developed analysis.";
      } else if (clampedScore >= 5) {
        levelName = "Strong Band (5–6 marks)";
        levelDesc = "Accurate business concepts with applied analytical reasoning.";
      } else if (clampedScore >= 3) {
        levelName = "Moderate Band (3–4 marks)";
        levelDesc = "Basic knowledge with limited contextual application.";
      } else if (clampedScore >= 1) {
        levelName = "Basic Band (1–2 marks)";
        levelDesc = "Identification of points without development.";
      } else {
        levelName = "0 marks";
        levelDesc = "No creditable response.";
      }
    }

    const ao1Max = 2;
    const ao2Max = maxMarks === 12 ? 3 : 2;
    const ao3Max = 4;
    const ao4Max = maxMarks === 12 ? 3 : 0;

    const ao1Score = Math.min(ao1Max, Math.round((clampedScore / maxMarks) * ao1Max));
    const ao2Score = Math.min(ao2Max, Math.round((clampedScore / maxMarks) * ao2Max));
    const ao3Score = Math.min(ao3Max, Math.round((clampedScore / maxMarks) * ao3Max));
    const ao4Score = maxMarks === 12 ? Math.max(0, clampedScore - (ao1Score + ao2Score + ao3Score)) : 0;

    const reasonText = customReason?.trim() || overrideReason.trim();

    const updatedEval: Paper2EvaluationResult = {
      totalScore: clampedScore,
      maxMarks: maxMarks,
      level: levelName,
      levelDescription: levelDesc,
      percentage: Math.round((clampedScore / maxMarks) * 100),
      aoBreakdown: {
        ao1: {
          score: ao1Score,
          max: ao1Max,
          feedback: `Knowledge & Understanding self-assessed against 0264 mark scheme (${ao1Score}/${ao1Max}).`,
        },
        ao2: {
          score: ao2Score,
          max: ao2Max,
          feedback: `Contextual application to case scenario verified by student (${ao2Score}/${ao2Max}).`,
        },
        ao3: {
          score: ao3Score,
          max: ao3Max,
          feedback: `Chain of analytical cause-and-effect reasoning self-assessed (${ao3Score}/${ao3Max}).`,
        },
        ...(maxMarks === 12
          ? {
              ao4: {
                score: ao4Score,
                max: ao4Max,
                feedback: `Evaluation & justified recommendation self-assessed (${ao4Score}/${ao4Max}).`,
              },
            }
          : {}),
      },
      strengths: existingEval?.strengths?.length
        ? existingEval.strengths
        : ["Self-assessed response aligned with official Cambridge 0264 Paper 2 rubric."],
      improvements: existingEval?.improvements?.length
        ? existingEval.improvements
        : ["Ensure direct references to case facts and figures under strict exam conditions."],
      examinerNotes: `[Student Self-Assessed Override] Awarded ${clampedScore}/${maxMarks} marks (${levelName}).${
        originalAiScore !== undefined ? ` (Original automated AI score: ${originalAiScore}/${maxMarks}).` : ""
      }${reasonText ? ` Override reason: "${reasonText}"` : ""}`,
      isAiEvaluated: existingEval?.isAiEvaluated ?? false,
      appWordsFound: existingEval?.appWordsFound || activeQuestion.qwen_marking_keys?.valid_app_words || [],
      evaluatedAt: new Date().toISOString(),
      isManuallyOverridden: true,
      originalAiScore: originalAiScore,
      overrideReason: reasonText,
    };

    setEvaluations((prev) => ({ ...prev, [currentQuestionIdx]: updatedEval }));
    if (!completedIndices.includes(currentQuestionIdx)) {
      setCompletedIndices((prev) => [...prev, currentQuestionIdx]);
    }

    const previousScore = existingEval?.totalScore ?? 0;
    if (clampedScore > previousScore) {
      const diff = clampedScore - previousScore;
      awardBonusStudyCoins(diff * 5);
    }

    if (clampedScore >= (maxMarks === 12 ? 9 : 7)) {
      confetti({ particleCount: 45, spread: 55, origin: { y: 0.7 } });
    }

    setShowOverridePanel(false);
  };

  const handleResetToAiScore = () => {
    const existingEval = evaluations[currentQuestionIdx];
    if (existingEval && existingEval.originalAiScore !== undefined) {
      handleApplyManualOverride(existingEval.originalAiScore, "Restored original AI evaluation mark.");
    }
  };

  // Navigate to next question (only if current is completed or has evaluation)
  const handleNextQuestion = () => {
    if (currentQuestionIdx < activeScenario.questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setShowModelAnswer(false);
      setShowMarkSchemeRubric(false);
      setShowOverridePanel(false);
      setTimerSeconds(0);
      setTimerActive(true);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx((prev) => prev - 1);
      setShowModelAnswer(false);
      setShowMarkSchemeRubric(false);
      setShowOverridePanel(false);
    }
  };

  // Current Scenario index (0 to 99, representing Q1 to Q100)
  const currentScenarioIdx = useMemo(() => {
    const idx = PAPER2_DATABASE.findIndex((s) => s.scenario_id === selectedScenarioId);
    return idx >= 0 ? idx : 0;
  }, [selectedScenarioId]);

  // Stepper handlers to move between Q1 and Q100
  const handlePrevScenario = () => {
    const prevIdx = (currentScenarioIdx - 1 + PAPER2_DATABASE.length) % PAPER2_DATABASE.length;
    handleSelectScenario(PAPER2_DATABASE[prevIdx].scenario_id);
  };

  const handleNextScenario = () => {
    const nextIdx = (currentScenarioIdx + 1) % PAPER2_DATABASE.length;
    handleSelectScenario(PAPER2_DATABASE[nextIdx].scenario_id);
  };

  // Switch active scenario
  const handleSelectScenario = (id: string) => {
    setSelectedScenarioId(id);
    setCurrentQuestionIdx(0);
    const savedAnswers = loadPaper2Answers(id);
    setAnswers(savedAnswers);
    setEvaluations({});
    setCompletedIndices([]);
    setShowModelAnswer(false);
    setShowMarkSchemeRubric(false);
    setShowOverridePanel(false);
    setShowScenarioPicker(false);
    setCaseTab("main");
  };

  // Jump to a random scenario set (matching Paper 1 random capability)
  const handleRandomScenario = () => {
    const total = PAPER2_DATABASE.length;
    if (total <= 1) return;
    let rand = Math.floor(Math.random() * total);
    if (rand === currentScenarioIdx) {
      rand = (rand + 1) % total;
    }
    handleSelectScenario(PAPER2_DATABASE[rand].scenario_id);
  };

  // Persist Paper 2 position to cookies and localStorage
  useEffect(() => {
    savePaper2Position({
      scenarioId: selectedScenarioId,
      questionIdx: currentQuestionIdx,
    });
  }, [selectedScenarioId, currentQuestionIdx]);

  // Persist candidate answers for the current scenario
  useEffect(() => {
    savePaper2Answers(selectedScenarioId, answers);
  }, [selectedScenarioId, answers]);

  // Filtered scenarios for search
  const filteredScenarios = useMemo(() => {
    if (!searchQuery.trim()) return PAPER2_DATABASE;
    const q = searchQuery.toLowerCase();
    return PAPER2_DATABASE.filter(
      (s) =>
        s.scenario_id.toLowerCase().includes(q) ||
        s.case_study_insert.main_stem.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const currentEval = evaluations[currentQuestionIdx];
  const isCurrentQuestionCompleted = completedIndices.includes(currentQuestionIdx);

  // Render Appendix 2 table nicely if formatted as table
  const renderAppendix2Content = (data: any) => {
    if (!data) return <p className="text-sm italic text-neutral-500">No financial data provided.</p>;
    if (typeof data === "string") {
      return <p className="text-sm leading-relaxed whitespace-pre-line text-neutral-800 dark:text-neutral-200">{data}</p>;
    }
    const table: Paper2AppendixTable = data;
    return (
      <div className="space-y-3">
        {table.title && (
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F2042] dark:text-[#38BDF8]">
            {table.title}
          </h4>
        )}
        {table.headers && table.rows && (
          <div className="overflow-x-auto rounded-lg border border-[#E7E5E4] dark:border-neutral-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F5F5F4] dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 font-bold border-b border-[#E7E5E4] dark:border-neutral-800">
                <tr>
                  {table.headers.map((h, idx) => (
                    <th key={idx} className="px-3 py-2">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5E4] dark:divide-neutral-800 font-mono">
                {table.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className={`px-3 py-2 ${cIdx === 0 ? "font-sans font-medium text-neutral-800 dark:text-neutral-200" : "text-neutral-600 dark:text-neutral-400"}`}
                      >
                        {String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="study-page">
      {/* Top Banner / Header */}
      <header className="study-hero">
        <div className="study-hero-content">
          <p className="study-hero-kicker">Cambridge IGCSE Business Studies · 0264 / 0450</p>
          <h1 className="study-title">Paper 2 <span>Practice Studio</span></h1>
          <p className="study-description">
            Work through 100 case studies with appendices and step-by-step questions.
          </p>
          <div className="study-hero-actions">
            <button
              type="button"
              onClick={() => {
                if (!webllmEngine) {
                  handleDownloadQwenModel();
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                webllmEngine || isModelDownloaded
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800"
                  : webllmStatus.isLoading
                  ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800"
                  : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50"
              }`}
              title="Local in-browser Qwen 3.5 0.8B AI model status"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>
                {webllmEngine
                  ? "Qwen 3.5 0.8B Active"
                  : isModelDownloaded
                  ? "Qwen 3.5 0.8B Cached"
                  : webllmStatus.isLoading
                  ? `Downloading (${webllmStatus.progressPercent}%)`
                  : "Download Qwen 3.5 0.8B"}
              </span>
              {(webllmEngine || isModelDownloaded) && <Check className="w-3.5 h-3.5 text-emerald-500" />}
            </button>
          </div>
        </div>
        <div className="study-hero-image" aria-hidden="true" />
      </header>

      {/* Scenario Navigator: Stepper (Prev / Next) + Dropdown (Q1 to Q100) */}
      <div className="study-studio study-paper-two-toolbar">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Case study descriptor and quick indicator */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="text-xs truncate">
              <span className="font-bold text-[#0F2042] dark:text-white mr-1.5 font-mono">
                Set {currentScenarioIdx + 1}
              </span>
              <span className="text-neutral-500 dark:text-neutral-400 hidden sm:inline truncate">
                — {activeScenario.case_study_insert.main_stem.slice(0, 65)}...
              </span>
            </div>
          </div>

          {/* Right: Stepper (Prev / X of 100 / Next) + Random + Search (matches Paper 1 style) */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrevScenario}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-300 dark:border-neutral-700 bg-white dark:bg-black text-xs font-semibold hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-[#1C1917] dark:text-white cursor-pointer transition-colors active:scale-95"
              title="Previous Set (Set 1–100)"
            >
              ← Prev
            </button>

            {/* Set Indicator: X / 100 (matching Paper 1 style) */}
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-[#FAF9F6] dark:bg-black border border-slate-200 dark:border-neutral-800 text-[#0F2042] dark:text-white min-w-[76px] text-center shadow-2xs">
              {currentScenarioIdx + 1} / {PAPER2_DATABASE.length}
            </span>

            <button
              type="button"
              onClick={handleNextScenario}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-300 dark:border-neutral-700 bg-white dark:bg-black text-xs font-semibold hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-[#1C1917] dark:text-white cursor-pointer transition-colors active:scale-95"
              title="Next Set (Set 1–100)"
            >
              Next →
            </button>

            {/* Random Set Button (matches Paper 1 style) */}
            <button
              type="button"
              onClick={handleRandomScenario}
              className="px-2.5 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800/80 bg-purple-50/70 hover:bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
              title="Jump to a random Case Study Set"
            >
              <span>🎲 Random</span>
            </button>

            {/* Search drawer toggle button */}
            <button
              type="button"
              onClick={() => setShowScenarioPicker(true)}
              className="p-1.5 rounded-lg border border-slate-300 dark:border-neutral-700 bg-white dark:bg-black text-neutral-600 dark:text-neutral-300 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 cursor-pointer"
              title="Search and browse all 100 sets"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Model Loading Progress Bar (if loading) */}
      {webllmStatus.isLoading && (
        <div className="p-4 border-x border-amber-200 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/30">
          <div className="flex items-center justify-between text-xs font-medium text-amber-800 dark:text-amber-300 mb-2">
            <span className="flex items-center gap-2">
              <Download className="w-3.5 h-3.5 animate-bounce" />
              {webllmStatus.progressText || "Downloading Qwen 3.5 0.8B AI model weights into persistent browser cache..."}
            </span>
            <span className="font-mono font-bold">{webllmStatus.progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-amber-200 dark:bg-amber-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 dark:bg-amber-400 transition-all duration-300"
              style={{ width: `${webllmStatus.progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1.5">
            Once downloaded, model weights stay cached permanently in your browser storage. You won't have to download them again!
          </p>
        </div>
      )}

      {/* Main Split-Screen Workspace */}
      <div className="study-studio study-columns study-paper-two-columns">
        {/* ======================================================== */}
        {/* LEFT COLUMN (COL 1-5): CASE STUDY AREA WITH APPENDIX TABS */}
        {/* ======================================================== */}
        <section className="study-paper-two-case" aria-labelledby="paper-two-case-title">
          {/* Header Bar with Case ID and Appendix Navigation Buttons */}
          <div className="study-panel-padding border-b border-line dark:border-neutral-800">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h2 id="paper-two-case-title" className="study-panel-title">Case study insert</h2>
              <button
                type="button"
                onClick={() => setShowScenarioPicker(true)}
                className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 underline cursor-pointer"
              >
                All 100 Sets ↗
              </button>
            </div>

            {/* Case Study & Appendix Buttons */}
            <div className="grid grid-cols-2 min-[360px]:grid-cols-4 gap-1 p-1 bg-neutral-200/60 dark:bg-neutral-800 rounded-lg">
              <button
                type="button"
                onClick={() => setCaseTab("main")}
                aria-pressed={caseTab === "main"}
                className={`py-1.5 px-2 text-[11px] font-bold rounded-md transition-all cursor-pointer truncate ${
                  caseTab === "main"
                    ? "bg-white dark:bg-neutral-900 text-[#0F2042] dark:text-white shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
                }`}
                title="Main Case Study Scenario"
              >
                Main Stem
              </button>
              <button
                type="button"
                onClick={() => setCaseTab("app1")}
                aria-pressed={caseTab === "app1"}
                className={`py-1.5 px-2 text-[11px] font-bold rounded-md transition-all cursor-pointer truncate ${
                  caseTab === "app1"
                    ? "bg-white dark:bg-neutral-900 text-[#0F2042] dark:text-white shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
                }`}
                title="Appendix 1: Marketing & Operations Data"
              >
                Appendix 1
              </button>
              <button
                type="button"
                onClick={() => setCaseTab("app2")}
                aria-pressed={caseTab === "app2"}
                className={`py-1.5 px-2 text-[11px] font-bold rounded-md transition-all cursor-pointer truncate ${
                  caseTab === "app2"
                    ? "bg-white dark:bg-neutral-900 text-[#0F2042] dark:text-white shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
                }`}
                title="Appendix 2: Financial Accounts & Balance Sheet"
              >
                Appendix 2
              </button>
              <button
                type="button"
                onClick={() => setCaseTab("app3")}
                aria-pressed={caseTab === "app3"}
                className={`py-1.5 px-2 text-[11px] font-bold rounded-md transition-all cursor-pointer truncate ${
                  caseTab === "app3"
                    ? "bg-white dark:bg-neutral-900 text-[#0F2042] dark:text-white shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
                }`}
                title="Appendix 3: External Environment & Economic Gazette"
              >
                Appendix 3
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="study-panel-padding flex-1 overflow-auto space-y-4 text-neutral-800 dark:text-neutral-200">
            {caseTab === "main" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0F2042] dark:bg-[#38BDF8]" />
                  <h3 className="font-academic-serif text-lg font-bold text-[#0F2042] dark:text-white">
                    Primary Business Scenario
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 font-sans">
                  {activeScenario.case_study_insert.main_stem}
                </p>
                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400">
                  <p className="font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                    Examiner Context Reminder:
                  </p>
                  Use specific business metrics, product names, monetary sums, and employee details in your answers to score full AO2 Application marks.
                </div>
              </div>
            )}

            {caseTab === "app1" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <h3 className="font-academic-serif text-lg font-bold text-[#0F2042] dark:text-white">
                    Appendix 1: Marketing & Operations Extract
                  </h3>
                </div>
                <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 font-sans whitespace-pre-line">
                  {typeof activeScenario.case_study_insert.appendix_1_marketing_ops === "string"
                    ? activeScenario.case_study_insert.appendix_1_marketing_ops
                    : JSON.stringify(activeScenario.case_study_insert.appendix_1_marketing_ops, null, 2)}
                </div>
              </div>
            )}

            {caseTab === "app2" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <h3 className="font-academic-serif text-lg font-bold text-[#0F2042] dark:text-white">
                    Appendix 2: Financial Information & Accounts
                  </h3>
                </div>
                {renderAppendix2Content(activeScenario.case_study_insert.appendix_2_financial_data)}
              </div>
            )}

            {caseTab === "app3" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <h3 className="font-academic-serif text-lg font-bold text-[#0F2042] dark:text-white">
                    Appendix 3: External Environment & Economic Conditions
                  </h3>
                </div>
                <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/50 dark:bg-purple-950/20 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 font-sans whitespace-pre-line">
                  {typeof activeScenario.case_study_insert.appendix_3_external_environment === "string"
                    ? activeScenario.case_study_insert.appendix_3_external_environment
                    : JSON.stringify(activeScenario.case_study_insert.appendix_3_external_environment, null, 2)}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ======================================================== */}
        {/* RIGHT COLUMN (COL 6-12): STEP-BY-STEP QUESTION INTERFACE */}
        {/* ======================================================== */}
        <div className="study-question-column study-paper-two-editor">
          {/* Question Sequence Nav (1a, 1b, 2a, 2b, 3a, 3b, 4a, 4b) */}
          <section className="study-panel-padding" aria-labelledby="paper-two-questions-title">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h2 id="paper-two-questions-title" className="study-panel-title">Questions</h2>
              <div className="flex items-center gap-2 text-xs font-mono font-medium text-neutral-500">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(timerSeconds)}</span>
              </div>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">Submit each answer before moving to the next question.</p>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {activeScenario.questions.map((q, idx) => {
                const isSelected = idx === currentQuestionIdx;
                const isCompleted = completedIndices.includes(idx);
                const ev = evaluations[idx];
                const hasScore = ev !== undefined;

                return (
                  <button
                    key={idx}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      setCurrentQuestionIdx(idx);
                      setShowModelAnswer(false);
                      setShowMarkSchemeRubric(false);
                      setShowOverridePanel(false);
                    }}
                    className={`py-2 px-1 text-center rounded-lg border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? "bg-[#0F2042] dark:bg-white text-white dark:text-black border-[#0F2042] dark:border-white shadow-xs"
                        : isCompleted
                        ? ev?.isManuallyOverridden
                          ? "bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700"
                          : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                        : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center gap-0.5">
                      <span>{q.number}</span>
                      {ev?.isManuallyOverridden && <span className="text-[9px]">✏️</span>}
                    </div>
                    <span className="text-[10px] opacity-75 font-normal">
                      {hasScore ? `${ev.totalScore}/${q.mark_value}` : `${q.mark_value}m`}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Active Question Box (Practice Container) */}
          <div className="study-answer space-y-4">
            {/* Question Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7E5E4] dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-black">
                  Question {activeQuestion.number}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono">
                  {activeQuestion.mark_value} Marks
                </span>
                {activeQuestion.mark_value === 12 && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                    Level 1–3 Marked
                  </span>
                )}
              </div>

              {isCurrentQuestionCompleted && currentEval && (
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      currentEval.isManuallyOverridden
                        ? "bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 flex items-center gap-1"
                        : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                    }`}
                  >
                    {currentEval.isManuallyOverridden && <span>✏️</span>}
                    <span>
                      {currentEval.isManuallyOverridden ? "Self-Assessed: " : "Awarded: "}
                      {currentEval.totalScore}/{activeQuestion.mark_value} marks ({currentEval.level})
                    </span>
                  </span>
                </div>
              )}
            </div>

            {/* Question Prompt */}
            <h2 className="study-prompt">
              {activeQuestion.question_text}
            </h2>

            {/* Candidate Response Textarea */}
            <div className="space-y-1.5">
              <div className="study-answer-meta">
                <label htmlFor="paper-two-response">Your response</label>
                <span className="font-mono">
                  {((answers[currentQuestionIdx] || "").trim().split(/\s+/).filter(Boolean).length)} words
                </span>
              </div>
              <textarea
                id="paper-two-response"
                value={answers[currentQuestionIdx] || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setAnswers((prev) => ({ ...prev, [currentQuestionIdx]: val }));
                  if (!timerActive && val.trim().length > 0) {
                    setTimerActive(true);
                  }
                }}
                disabled={isEvaluating}
                rows={7}
                placeholder={`Draft your structured answer here for ${activeQuestion.mark_value} marks. Use specific case data and causal connectives...`}
                className="study-response"
              />
            </div>

            {/* Submission & Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleSubmitCurrentQuestion}
                  disabled={isEvaluating || !(answers[currentQuestionIdx] || "").trim()}
                  className="btn-primary px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm flex items-center gap-2"
                >
                  {isEvaluating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Assessing with Qwen 3.5 0.8B...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{currentEval ? "Re-evaluate Response" : "Submit for Assessment"}</span>
                    </>
                  )}
                </button>

                {/* 0264 Exact Mark Scheme Rubric Button */}
                <button
                  type="button"
                  onClick={() => setShowMarkSchemeRubric((prev) => !prev)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                    showMarkSchemeRubric
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "border-indigo-300 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60"
                  }`}
                  title="View exact Cambridge 0264 Paper 2 Mark Scheme Rubric & Level criteria"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{showMarkSchemeRubric ? "Hide Rubric" : "0264 Mark Scheme Rubric"}</span>
                </button>

                {/* Manual Override / Self-Assessment Button */}
                <button
                  type="button"
                  onClick={() => {
                    setShowOverridePanel((prev) => !prev);
                    if (!showOverridePanel) {
                      setOverrideScore(currentEval ? currentEval.totalScore : (activeQuestion.mark_value === 12 ? 8 : 5));
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                    showOverridePanel
                      ? "bg-amber-500 text-black border-amber-500 shadow-xs font-bold"
                      : "border-amber-300 dark:border-amber-700 bg-amber-50/80 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60"
                  }`}
                  title="Override score or self-assess if marking was inaccurate"
                >
                  <span>✏️</span>
                  <span>{showOverridePanel ? "Close Override Panel" : currentEval ? "Override Score" : "Self-Assess / Grade"}</span>
                </button>

                {/* Model Answer Exemplar Button */}
                <button
                  type="button"
                  onClick={() => setShowModelAnswer((prev) => !prev)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showModelAnswer ? "Hide Model Answer" : "Reveal Model Answer"}</span>
                </button>
              </div>

              {/* Prev / Next Question Step Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIdx === 0}
                  className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIdx === activeScenario.questions.length - 1}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isCurrentQuestionCompleted
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                      : "border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Exact 0264 Paper 2 Mark Scheme Rubric Panel */}
            {showMarkSchemeRubric && (
              <div className="mt-4 p-5 rounded-2xl border-2 border-indigo-200 dark:border-indigo-900 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 dark:from-neutral-900 dark:via-neutral-900 dark:to-indigo-950/30 space-y-4 shadow-sm animate-in fade-in">
                {/* Rubric Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-indigo-100 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-indigo-600 text-white font-mono text-xs font-bold">
                      0264
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        Official Cambridge 0264 Paper 2 Mark Scheme & Rubric
                      </h4>
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        Exact mark allocation criteria from 0264 Paper 2 database
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                      Max: {activeQuestion.mark_value} Marks
                    </span>
                  </div>
                </div>

                {/* Question-Specific Level / Criteria Rubric */}
                {activeQuestion.mark_value === 12 ? (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
                      Specific Level Criteria for Question {activeQuestion.number} (12 Marks)
                    </div>

                    {/* Level 3: 9-12 marks */}
                    <div className="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                          Level 3 (9–12 marks): Comprehensive Evaluation & Supported Justification
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 font-bold">
                          9–12 marks
                        </span>
                      </div>
                      <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">
                        {activeQuestion.mark_scheme.level_3_9_to_12 ||
                          "Detailed discussion of all options in context with a fully supported recommendation."}
                      </p>
                    </div>

                    {/* Level 2: 5-8 marks */}
                    <div className="p-3.5 rounded-xl border border-blue-300 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/30">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                          Level 2 (5–8 marks): Contextual Analysis of Benefits & Drawbacks
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-bold">
                          5–8 marks
                        </span>
                      </div>
                      <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">
                        {activeQuestion.mark_scheme.level_2_5_to_8 ||
                          "Detailed discussion of advantages/disadvantages of options in business context."}
                      </p>
                    </div>

                    {/* Level 1: 1-4 marks */}
                    <div className="p-3.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                          Level 1 (1–4 marks): Basic Outline Knowledge
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-bold">
                          1–4 marks
                        </span>
                      </div>
                      <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">
                        {activeQuestion.mark_scheme.level_1_1_to_4 ||
                          "Outline points with limited or no application to the business."}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* 8-mark questions */
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
                      Specific Mark Allocation for Question {activeQuestion.number} (8 Marks)
                    </div>

                    {/* AO1 Knowledge */}
                    {activeQuestion.mark_scheme.knowledge_max_2 && (
                      <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
                            AO1: Knowledge & Understanding (Max 2 Marks)
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-200 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100 font-bold">
                            Max 2 marks
                          </span>
                        </div>
                        <ul className="list-disc list-inside text-xs text-neutral-700 dark:text-neutral-300 space-y-1">
                          {Array.isArray(activeQuestion.mark_scheme.knowledge_max_2)
                            ? activeQuestion.mark_scheme.knowledge_max_2.map((pt: string, idx: number) => (
                                <li key={idx}>{pt}</li>
                              ))
                            : <li>{String(activeQuestion.mark_scheme.knowledge_max_2)}</li>}
                        </ul>
                      </div>
                    )}

                    {/* AO2 & AO3 Application & Analysis */}
                    {activeQuestion.mark_scheme.application_analysis_max_6 && (
                      <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-purple-900 dark:text-purple-300">
                            AO2 & AO3: Application & Analysis (Max 6 Marks)
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-100 font-bold">
                            Max 6 marks
                          </span>
                        </div>
                        <ul className="list-disc list-inside text-xs text-neutral-700 dark:text-neutral-300 space-y-1">
                          {Array.isArray(activeQuestion.mark_scheme.application_analysis_max_6)
                            ? activeQuestion.mark_scheme.application_analysis_max_6.map((pt: string, idx: number) => (
                                <li key={idx}>{pt}</li>
                              ))
                            : <li>{String(activeQuestion.mark_scheme.application_analysis_max_6)}</li>}
                        </ul>
                      </div>
                    )}

                    {/* Calculation working marks if present */}
                    {activeQuestion.mark_scheme.working_marks && (
                      <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-blue-900 dark:text-blue-300">
                            Method & Working Marks
                          </span>
                        </div>
                        <ul className="list-disc list-inside text-xs text-neutral-700 dark:text-neutral-300 space-y-1">
                          {Array.isArray(activeQuestion.mark_scheme.working_marks)
                            ? activeQuestion.mark_scheme.working_marks.map((pt: string, idx: number) => (
                                <li key={idx}>{pt}</li>
                              ))
                            : <li>{String(activeQuestion.mark_scheme.working_marks)}</li>}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Context Application Keywords (AO2 Case Facts) */}
                {activeQuestion.qwen_marking_keys?.valid_app_words?.length > 0 && (
                  <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                        🎯 Creditable Application Case Facts (AO2 Keywords)
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        Used by Cambridge Examiners
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mb-2">
                      To score Level 2 / Level 3, candidates must explicitly reference these specific case metrics or business facts:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {activeQuestion.qwen_marking_keys.valid_app_words.map((kw: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cambridge 0264 Assessment Objectives Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <div className="font-bold text-[#0F2042] dark:text-[#38BDF8]">AO1 Knowledge</div>
                    <div className="text-[10px] text-neutral-500">Definitions & concepts accurately stated.</div>
                  </div>
                  <div className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <div className="font-bold text-[#0F2042] dark:text-[#38BDF8]">AO2 Application</div>
                    <div className="text-[10px] text-neutral-500">Case facts, products, figures & staff context.</div>
                  </div>
                  <div className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <div className="font-bold text-[#0F2042] dark:text-[#38BDF8]">AO3 Analysis</div>
                    <div className="text-[10px] text-neutral-500">Cause-and-effect chains & financial impacts.</div>
                  </div>
                  <div className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <div className="font-bold text-[#0F2042] dark:text-[#38BDF8]">AO4 Evaluation</div>
                    <div className="text-[10px] text-neutral-500">Justified recommendation & trade-offs weighed.</div>
                  </div>
                </div>
              </div>
            )}

            {/* Manual Override & Self-Assessment Panel */}
            {showOverridePanel && (
              <div className="mt-4 p-5 rounded-2xl border-2 border-amber-300 dark:border-amber-700 bg-amber-50/60 dark:bg-amber-950/30 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs">
                      ✏️
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">
                        Manual Score Override & Self-Assessment
                      </h4>
                      <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                        If the automated marking was inaccurate, too strict, or missed your context points, select the score you deserve.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowOverridePanel(false)}
                    className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Quick Score Selector Buttons */}
                <div>
                  <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                    Choose Your Overridden Score (0 to {activeQuestion.mark_value} Marks):
                  </label>
                  <div className="grid grid-cols-7 sm:grid-cols-13 gap-1.5">
                    {Array.from({ length: activeQuestion.mark_value + 1 }, (_, i) => i).map((score) => {
                      const isSelected = overrideScore === score;
                      const isLevel3 = activeQuestion.mark_value === 12 && score >= 9;
                      const isLevel2 = activeQuestion.mark_value === 12 && score >= 5 && score <= 8;
                      const isLevel1 = activeQuestion.mark_value === 12 && score >= 1 && score <= 4;

                      return (
                        <button
                          key={score}
                          type="button"
                          onClick={() => setOverrideScore(score)}
                          className={`py-2 px-1 text-center rounded-lg border font-mono font-bold text-xs transition-all cursor-pointer flex flex-col items-center justify-center ${
                            isSelected
                              ? "bg-[#0F2042] text-white dark:bg-amber-400 dark:text-black border-[#0F2042] dark:border-amber-400 scale-105 shadow-md"
                              : isLevel3
                              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400"
                              : isLevel2
                              ? "bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:border-blue-400"
                              : isLevel1
                              ? "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:border-amber-400"
                              : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400"
                          }`}
                        >
                          <span className="text-sm">{score}</span>
                          <span className="text-[9px] opacity-75 font-sans">
                            {activeQuestion.mark_value === 12
                              ? score >= 9
                                ? "L3"
                                : score >= 5
                                ? "L2"
                                : score >= 1
                                ? "L1"
                                : "0m"
                              : `${Math.round((score / activeQuestion.mark_value) * 100)}%`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Score Preview & Level Descriptor */}
                <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-amber-200 dark:border-amber-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-neutral-900 dark:text-white">
                        Selected Score:{" "}
                        <span className="font-mono text-amber-700 dark:text-amber-400">
                          {overrideScore} / {activeQuestion.mark_value} marks
                        </span>
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {Math.round((overrideScore / activeQuestion.mark_value) * 100)}%
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {activeQuestion.mark_value === 12
                        ? overrideScore >= 9
                          ? "Level 3: Comprehensive analysis with fully justified recommendation."
                          : overrideScore >= 5
                          ? "Level 2: Good contextual discussion of advantages/disadvantages."
                          : overrideScore >= 1
                          ? "Level 1: Outline knowledge with limited or generic business context."
                          : "0 Marks: No valid response."
                        : overrideScore >= 7
                        ? "Maximum Band: Strong knowledge, detailed context and analysis."
                        : overrideScore >= 5
                        ? "Strong Band: Good knowledge and contextual application."
                        : overrideScore >= 3
                        ? "Moderate Band: Basic knowledge with some application."
                        : "Basic Band: Points identified."}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleApplyManualOverride(overrideScore)}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save My Override</span>
                    </button>

                    {currentEval?.originalAiScore !== undefined && (
                      <button
                        type="button"
                        onClick={handleResetToAiScore}
                        className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        title="Restore original AI evaluation score"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset ({currentEval.originalAiScore}m)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Optional Reason Input */}
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Self-Assessment Note / Reason for Override (Optional):
                  </label>
                  <input
                    type="text"
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="e.g. AI overlooked my application to the 50 cafe branches and 100% recyclable packaging..."
                    className="w-full px-3 py-1.5 rounded-lg border border-amber-200 dark:border-neutral-700 bg-white dark:bg-black text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}

            {/* Model Answer Box (if toggled) */}
            {showModelAnswer && (
              <div className="mt-4 p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Official Cambridge Mark Scheme Exemplar
                  </span>
                  <span className="text-[11px] font-mono text-blue-700 dark:text-blue-400">
                    Max: {activeQuestion.mark_value} Marks
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 whitespace-pre-line leading-relaxed font-sans">
                  {activeQuestion.model_answer}
                </p>
              </div>
            )}

            {/* Evaluation Results Card (if evaluated) */}
            {currentEval && (
              <div className="mt-6 border border-[#E7E5E4] dark:border-neutral-800 rounded-2xl p-5 bg-[#FAF9F6] dark:bg-black/60 space-y-4">
                {/* Score & Level Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                          currentEval.isManuallyOverridden
                            ? "bg-amber-500 text-black flex items-center gap-1"
                            : "bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-black"
                        }`}
                      >
                        {currentEval.isManuallyOverridden && <span>✏️</span>}
                        <span>{currentEval.level}</span>
                      </span>

                      {currentEval.isManuallyOverridden ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                          Student Overridden Score
                        </span>
                      ) : (
                        <span className="text-xs text-neutral-500 font-medium">
                          {currentEval.isAiEvaluated ? "Evaluated with Qwen 3.5 0.8B Local AI" : "Evaluated with Cambridge Senior Examiner"}
                        </span>
                      )}

                      {currentEval.originalAiScore !== undefined && (
                        <span className="text-[11px] text-neutral-500 font-mono">
                          (Original AI: {currentEval.originalAiScore}/{currentEval.maxMarks})
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      {currentEval.levelDescription}
                    </p>

                    {currentEval.overrideReason && (
                      <div className="text-[11px] text-amber-800 dark:text-amber-300 italic pt-0.5">
                        Override note: "{currentEval.overrideReason}"
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold font-mono text-[#0F2042] dark:text-[#38BDF8]">
                        {currentEval.totalScore} / {currentEval.maxMarks}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-mono font-medium">
                        {currentEval.percentage}% Mark
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setShowOverridePanel(true);
                          setOverrideScore(currentEval.totalScore);
                        }}
                        className="px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/60 transition cursor-pointer flex items-center gap-1"
                        title="Override or change this score"
                      >
                        <span>✏️ Override</span>
                      </button>

                      {currentEval.originalAiScore !== undefined && (
                        <button
                          type="button"
                          onClick={handleResetToAiScore}
                          className="px-2 py-1 rounded-lg border border-neutral-300 dark:border-neutral-700 text-[11px] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer flex items-center gap-1"
                          title="Restore AI evaluation mark"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset AI</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* AO Breakdown Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                      <span>AO1: Knowledge</span>
                      <span className="font-mono text-[#0F2042] dark:text-[#38BDF8]">
                        {currentEval.aoBreakdown.ao1.score} / {currentEval.aoBreakdown.ao1.max}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      {currentEval.aoBreakdown.ao1.feedback}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                      <span>AO2: Application</span>
                      <span className="font-mono text-[#0F2042] dark:text-[#38BDF8]">
                        {currentEval.aoBreakdown.ao2.score} / {currentEval.aoBreakdown.ao2.max}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      {currentEval.aoBreakdown.ao2.feedback}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                      <span>AO3: Analysis</span>
                      <span className="font-mono text-[#0F2042] dark:text-[#38BDF8]">
                        {currentEval.aoBreakdown.ao3.score} / {currentEval.aoBreakdown.ao3.max}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      {currentEval.aoBreakdown.ao3.feedback}
                    </p>
                  </div>

                  {currentEval.aoBreakdown.ao4 && (
                    <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                      <div className="flex items-center justify-between text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                        <span>AO4: Evaluation</span>
                        <span className="font-mono text-[#0F2042] dark:text-[#38BDF8]">
                          {currentEval.aoBreakdown.ao4.score} / {currentEval.aoBreakdown.ao4.max}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        {currentEval.aoBreakdown.ao4.feedback}
                      </p>
                    </div>
                  )}
                </div>

                {/* Examiner Commentary */}
                <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Senior Examiner Notes & Recommendations
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">
                    {currentEval.examinerNotes}
                  </p>

                  {currentEval.improvements.length > 0 && (
                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                        Key Next Steps:
                      </span>
                      <ul className="list-disc list-inside text-xs text-neutral-600 dark:text-neutral-400 space-y-0.5 mt-1">
                        {currentEval.improvements.map((imp, idx) => (
                          <li key={idx}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SCENARIO PICKER MODAL (100 Authentic Case Studies)       */}
      {/* ======================================================== */}
      {showScenarioPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="font-academic-serif text-xl font-bold text-neutral-900 dark:text-white">
                  Cambridge 0264 Paper 2 Case Studies
                </h3>
                <p className="text-xs text-neutral-500">
                  Select from 100 comprehensive case study sets with full 8-question sequences.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowScenarioPicker(false)}
                className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Search filter input */}
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-[#FAF9F6] dark:bg-neutral-950">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search case study ID, business type, or scenario keywords..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F2042]"
                />
              </div>
            </div>

            {/* Scenarios Grid */}
            <div className="p-4 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredScenarios.map((scen) => {
                const isCurrent = scen.scenario_id === selectedScenarioId;
                const snippet = scen.case_study_insert.main_stem.slice(0, 130) + "...";
                return (
                  <button
                    key={scen.scenario_id}
                    type="button"
                    onClick={() => handleSelectScenario(scen.scenario_id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isCurrent
                        ? "bg-[#0F2042] text-white border-[#0F2042] shadow-sm"
                        : "bg-white dark:bg-neutral-800/40 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[11px] font-mono font-bold ${isCurrent ? "text-blue-200" : "text-[#0F2042] dark:text-[#38BDF8]"}`}>
                          {`Set ${PAPER2_DATABASE.findIndex((s) => s.scenario_id === scen.scenario_id) + 1} (${PAPER2_DATABASE.findIndex((s) => s.scenario_id === scen.scenario_id) + 1} / 100)`}
                        </span>
                        <span className="text-[10px] opacity-75 font-mono">8 questions</span>
                      </div>
                      <p className={`text-xs line-clamp-3 leading-relaxed ${isCurrent ? "text-neutral-200" : "text-neutral-600 dark:text-neutral-400"}`}>
                        {snippet}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* QWEN 3.5 0.8B DOWNLOAD PROMPT MODAL                     */}
      {/* ======================================================== */}
      {showDownloadPromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-[#0F2042] dark:text-[#38BDF8]">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-academic-serif text-lg font-bold text-neutral-900 dark:text-white">
                  Download Local AI Model: Qwen 3.5 0.8B
                </h3>
                <p className="text-xs text-neutral-500">
                  Runs 100% locally in-browser via WebGPU • Zero server cost
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-300 space-y-2">
              <p>
                Paper 2 Senior Examiner uses local in-browser <strong>Qwen 3.5 0.8B</strong> to mark your answers directly against Cambridge mark schemes and determine your Level (Level 1, Level 2, or Level 3).
              </p>
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium">
                <Check className="w-4 h-4 shrink-0" />
                <span>Once downloaded (~320 MB), weights stay cached permanently so you never have to re-download.</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleDownloadQwenModel}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-black hover:bg-[#1E3A8A] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download Qwen 3.5 0.8B (~320MB)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem("qwen_prompt_dismissed", "true");
                  setShowDownloadPromptModal(false);
                  handleSubmitCurrentQuestion();
                }}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
              >
                Instant Examiner (No Download)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  FileText,
  Flag,
  ListChecks,
  LogOut,
  RotateCcw,
  ShieldAlert,
  Timer,
} from "lucide-react";
import { PAPER1_DATABASE } from "../lib/data/paper1-database";
import { PAPER2_DATABASE } from "../lib/data/paper2-database";
import type { Paper1Question } from "../lib/data/paper1-database";
import type {
  Paper2AppendixTable,
  Paper2CaseStudyInsert,
} from "../lib/data/paper2-database";
import { formatTime } from "../lib/utils";

type ExamId = "paper1" | "paper2_full" | "paper2_short";
type ExamStage = "select" | "active" | "finished";

interface ExamConfig {
  id: ExamId;
  paperLabel: string;
  title: string;
  durationSeconds: number;
  durationLabel: string;
  totalMarks: number;
  questionMix: string;
  description: string;
}

const EXAM_CONFIGS: ExamConfig[] = [
  {
    id: "paper1",
    paperLabel: "Paper 1",
    title: "Paper 1 Mock",
    durationSeconds: 30 * 60,
    durationLabel: "30 minutes",
    totalMarks: 20,
    questionMix: "1 × 2-mark · 1 × 4-mark · 1 × 6-mark · 1 × 8-mark",
    description:
      "One full Paper 1 case study, followed by all four structured questions in the same order as the real exam.",
  },
  {
    id: "paper2_full",
    paperLabel: "Paper 2 · Full",
    title: "Paper 2 Full Mock",
    durationSeconds: 60 * 60,
    durationLabel: "1 hour",
    totalMarks: 40,
    questionMix: "2 × 8-mark · 2 × 12-mark",
    description:
      "Full Paper 2 case study insert with Appendices 1–3, two 8-mark questions and two 12-mark questions.",
  },
  {
    id: "paper2_short",
    paperLabel: "Paper 2 · Short",
    title: "Paper 2 Short Mock",
    durationSeconds: 30 * 60,
    durationLabel: "30 minutes",
    totalMarks: 20,
    questionMix: "1 × 8-mark · 1 × 12-mark",
    description:
      "Short Paper 2 case study insert with Appendices 1–3, one 8-mark question and one 12-mark question.",
  },
];

const CARD_ACCENTS: Record<
  ExamId,
  { border: string; badge: string; iconBg: string; text: string }
> = {
  paper1: {
    border: "border-indigo-300/70 dark:border-indigo-800/80",
    badge:
      "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300",
    iconBg:
      "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300",
    text: "text-indigo-700 dark:text-indigo-300",
  },
  paper2_full: {
    border: "border-emerald-300/70 dark:border-emerald-800/80",
    badge:
      "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300",
    iconBg:
      "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  paper2_short: {
    border: "border-amber-300/70 dark:border-amber-800/80",
    badge:
      "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300",
    iconBg:
      "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300",
    text: "text-amber-700 dark:text-amber-300",
  },
};

interface MockExamPart {
  id: string;
  label: string;
  marks: number;
  questionText: string;
  modelAnswer: string;
}

interface MarkSchemeGroup {
  label: string;
  points: string[];
}

interface MockExamQuestion {
  id: string;
  number: string;
  marks: number;
  parts: MockExamPart[];
  markScheme: MarkSchemeGroup[];
}

interface MockExamAppendix {
  id: string;
  title: string;
  body?: string;
  table?: Paper2AppendixTable;
}

interface MockExamPaper {
  id: ExamId;
  paper: 1 | 2;
  title: string;
  durationSeconds: number;
  totalMarks: number;
  scenarioId: string;
  unit: string;
  caseStem: string;
  appendices: MockExamAppendix[];
  questions: MockExamQuestion[];
}

interface Paper2SubPart {
  part: string;
  marks: number;
  question_text?: string;
  model_answer?: string;
}

interface Paper2RawQuestion {
  number: string;
  mark_value: 8 | 12;
  question_text?: string;
  model_answer?: string;
  mark_scheme?: Record<string, unknown>;
  sub_parts?: Paper2SubPart[];
}

interface Paper2RawScenario {
  scenario_id: string;
  unit: string;
  case_study_insert: Paper2CaseStudyInsert;
  questions: Paper2RawQuestion[];
}

const PAPER2_SCENARIOS = PAPER2_DATABASE as unknown as Paper2RawScenario[];

const MARK_SCHEME_LABELS: Record<string, string> = {
  knowledge_max_1: "Knowledge (AO1)",
  knowledge_max_2: "Knowledge (AO1)",
  application_max_1: "Application (AO2)",
  application_max_2: "Application (AO2)",
  analysis_max_2: "Analysis (AO3)",
  evaluation_max_2: "Evaluation (AO4)",
  application_analysis_max_6: "Application & Analysis (AO2/AO3)",
  level_1_1_to_4: "Level 1 (1–4 marks)",
  level_2_5_to_8: "Level 2 (5–8 marks)",
  level_3_9_to_12: "Level 3 (9–12 marks)",
  working_marks: "Working & Method",
};

function humaniseKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function flattenMarkScheme(scheme: object | undefined): MarkSchemeGroup[] {
  if (!scheme) return [];

  return Object.entries(scheme as Record<string, unknown>).flatMap(
    ([key, value]) => {
      let points: string[] = [];
      if (Array.isArray(value)) {
        points = value.map((entry) => String(entry)).filter(Boolean);
      } else if (typeof value === "string" && value.trim()) {
        points = [value];
      }

      if (points.length === 0) return [];
      return [
        {
          label: MARK_SCHEME_LABELS[key] ?? humaniseKey(key),
          points,
        },
      ];
    },
  );
}

function pickRandom<T>(items: T[], count: number): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

function createPaper1Exam(): MockExamPaper {
  const scenario =
    PAPER1_DATABASE[Math.floor(Math.random() * PAPER1_DATABASE.length)];

  const picked: Paper1Question[] = [];
  for (const mark of [2, 4, 6, 8]) {
    const match = scenario.questions.find(
      (question) => question.mark_value === mark,
    );
    if (match) picked.push(match);
  }

  const sourceQuestions =
    picked.length === 4 ? picked : scenario.questions;

  const questions: MockExamQuestion[] = sourceQuestions.map(
    (question, index) => {
      const id = `${scenario.scenario_id}-${question.part}`;
      return {
        id,
        number: `Question ${index + 1} (${question.part})`,
        marks: question.mark_value,
        parts: [
          {
            id,
            label: "",
            marks: question.mark_value,
            questionText: question.question_text,
            modelAnswer: question.model_answer,
          },
        ],
        markScheme: flattenMarkScheme(question.mark_scheme),
      };
    },
  );

  return {
    id: "paper1",
    paper: 1,
    title: "Paper 1 Mock Exam",
    durationSeconds: 30 * 60,
    totalMarks: questions.reduce((sum, question) => sum + question.marks, 0),
    scenarioId: scenario.scenario_id,
    unit: scenario.unit,
    caseStem: scenario.scenario_stem,
    appendices: [],
    questions,
  };
}

function normalisePaper2Question(
  scenarioId: string,
  question: Paper2RawQuestion,
): MockExamQuestion {
  const parts: MockExamPart[] =
    Array.isArray(question.sub_parts) && question.sub_parts.length > 0
      ? question.sub_parts.map((subPart, index) => ({
          id: `${scenarioId}-${question.number}-${index}`,
          label: subPart.part,
          marks: subPart.marks,
          questionText: subPart.question_text ?? "",
          modelAnswer: subPart.model_answer ?? "",
        }))
      : [
          {
            id: `${scenarioId}-${question.number}`,
            label: "",
            marks: question.mark_value,
            questionText: question.question_text ?? "",
            modelAnswer: question.model_answer ?? "",
          },
        ];

  return {
    id: `${scenarioId}-${question.number}`,
    number: question.number,
    marks: question.mark_value,
    parts,
    markScheme: flattenMarkScheme(question.mark_scheme),
  };
}

function buildAppendices(
  insert: Paper2CaseStudyInsert,
): MockExamAppendix[] {
  const appendices: MockExamAppendix[] = [];

  const marketing = insert.appendix_1_marketing_ops;
  if (typeof marketing === "string" && marketing.trim()) {
    appendices.push({
      id: "appendix-1",
      title: "Appendix 1 — Marketing & Operations",
      body: marketing,
    });
  }

  const financial = insert.appendix_2_financial_data;
  if (typeof financial === "string" && financial.trim()) {
    appendices.push({
      id: "appendix-2",
      title: "Appendix 2 — Financial Data",
      body: financial,
    });
  } else if (financial && typeof financial === "object") {
    appendices.push({
      id: "appendix-2",
      title: "Appendix 2 — Financial Data",
      table: financial as Paper2AppendixTable,
    });
  }

  const external = insert.appendix_3_external_environment;
  if (typeof external === "string" && external.trim()) {
    appendices.push({
      id: "appendix-3",
      title: "Appendix 3 — External Environment",
      body: external,
    });
  }

  return appendices;
}

function createPaper2Exam(mode: "full" | "short"): MockExamPaper {
  const scenario =
    PAPER2_SCENARIOS[Math.floor(Math.random() * PAPER2_SCENARIOS.length)];

  // Paper 2 questions are arranged in topic pairs: 1(a)/1(b), 2(a)/2(b), etc.
  // Each pair contains one 8-mark and one 12-mark question. Choosing whole
  // pairs guarantees the exact 2×8 + 2×12 or 1×8 + 1×12 structure while
  // keeping each question attached to its related topic.
  const pairs = new Map<string, Paper2RawQuestion[]>();
  for (const question of scenario.questions) {
    const pairKey = question.number.split("(")[0] || question.number;
    const group = pairs.get(pairKey) ?? [];
    group.push(question);
    pairs.set(pairKey, group);
  }

  const completePairs = Array.from(pairs.values()).filter(
    (pair) =>
      pair.some((question) => question.mark_value === 8) &&
      pair.some((question) => question.mark_value === 12),
  );

  const chosenPairs = pickRandom(completePairs, mode === "full" ? 2 : 1);
  const selectedNumbers = new Set(
    chosenPairs.flat().map((question) => question.number),
  );

  const questions = scenario.questions
    .filter((question) => selectedNumbers.has(question.number))
    .map((question) => normalisePaper2Question(scenario.scenario_id, question));

  return {
    id: mode === "full" ? "paper2_full" : "paper2_short",
    paper: 2,
    title:
      mode === "full" ? "Paper 2 Full Mock Exam" : "Paper 2 Short Mock Exam",
    durationSeconds: mode === "full" ? 60 * 60 : 30 * 60,
    totalMarks: questions.reduce((sum, question) => sum + question.marks, 0),
    scenarioId: scenario.scenario_id,
    unit: scenario.unit,
    caseStem: scenario.case_study_insert.main_stem,
    appendices: buildAppendices(scenario.case_study_insert),
    questions,
  };
}

function createExam(id: ExamId): MockExamPaper {
  if (id === "paper1") return createPaper1Exam();
  return createPaper2Exam(id === "paper2_full" ? "full" : "short");
}

function AppendixTable({ table }: { table: Paper2AppendixTable }) {
  if (!table.headers?.length || !table.rows?.length) return null;

  return (
    <div className="space-y-2">
      {table.title && (
        <p className="text-[11px] font-semibold text-[#0F2042] dark:text-neutral-200">
          {table.title}
        </p>
      )}
      <div className="overflow-x-auto rounded-lg border border-[#E7E5E4] dark:border-neutral-700">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr>
              {table.headers.map((header, index) => (
                <th
                  key={`${header}-${index}`}
                  className="border-b border-r border-[#E7E5E4] dark:border-neutral-700 bg-[#0F2042] dark:bg-neutral-800 px-2.5 py-1.5 text-left font-mono font-bold text-white last:border-r-0"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={
                  rowIndex % 2 === 0
                    ? "bg-white dark:bg-neutral-900"
                    : "bg-[#FAF9F6] dark:bg-black/30"
                }
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${rowIndex}-${cellIndex}`}
                    className="border-b border-r border-[#E7E5E4] dark:border-neutral-800 px-2.5 py-1.5 text-[#44403C] dark:text-neutral-300 last:border-r-0"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CaseStudyPanel({
  exam,
  open,
  onToggle,
}: {
  exam: MockExamPaper;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[#E7E5E4] dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden mb-5">
      <button
        type="button"
        onClick={onToggle}
        className={`w-full px-4 py-3 flex items-center justify-between gap-3 bg-[#FAF9F6]/70 dark:bg-black/30 cursor-pointer ${
          open
            ? "border-b border-[#E7E5E4] dark:border-neutral-800"
            : ""
        }`}
      >
        <span className="flex items-center gap-2 text-left">
          <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>
            <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#0F2042] dark:text-neutral-300">
              {exam.paper === 1 ? "Case Study" : "Case Study Insert"}
            </span>
            <span className="block text-[10px] text-[#78716C] dark:text-neutral-400">
              {exam.scenarioId} · {exam.unit}
            </span>
          </span>
        </span>
        <span className="text-[10px] font-mono font-semibold text-[#57534E] dark:text-neutral-400 flex items-center gap-1 shrink-0">
          {open ? "Hide" : "Show"}
          {open ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </span>
      </button>

      {open && (
        <div className="p-4 sm:p-5 space-y-4">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#57534E] dark:text-neutral-400 mb-1.5">
              Business background
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-[#44403C] dark:text-neutral-300 whitespace-pre-line">
              {exam.caseStem}
            </p>
          </div>

          {exam.appendices.map((appendix) => (
            <div
              key={appendix.id}
              className="rounded-xl border border-[#E7E5E4] dark:border-neutral-800 bg-[#FAF9F6] dark:bg-black/40 overflow-hidden"
            >
              <div className="px-3 py-2 border-b border-[#E7E5E4] dark:border-neutral-800 text-[10px] font-mono font-bold uppercase tracking-wider text-[#0F2042] dark:text-neutral-300">
                {appendix.title}
              </div>
              <div className="p-3">
                {appendix.body && (
                  <p className="text-xs leading-relaxed text-[#44403C] dark:text-neutral-300 whitespace-pre-line">
                    {appendix.body}
                  </p>
                )}
                {appendix.table && <AppendixTable table={appendix.table} />}
              </div>
            </div>
          ))}

          <p className="text-[10px] text-[#78716C] dark:text-neutral-400 leading-snug">
            Use specific facts, figures, business names and appendix data from
            this insert in every answer to earn application marks.
          </p>
        </div>
      )}
    </div>
  );
}

interface MockExamModeProps {
  onExit: () => void;
}

export function MockExamMode({ onExit }: MockExamModeProps) {
  const [stage, setStage] = useState<ExamStage>("select");
  const [exam, setExam] = useState<MockExamPaper | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [deadline, setDeadline] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [ranOutOfTime, setRanOutOfTime] = useState<boolean>(false);
  const [showCaseStudy, setShowCaseStudy] = useState<boolean>(true);

  const currentQuestion = exam?.questions[currentIndex];

  // Start every stage at the top of the page so the timer, case study and
  // first question are visible the moment the screen changes.
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [stage]);

  const answeredQuestions = useMemo(() => {
    if (!exam) return 0;
    return exam.questions.filter((question) =>
      question.parts.every(
        (part) => (answers[part.id] ?? "").trim().length > 0,
      ),
    ).length;
  }, [answers, exam]);

  const answeredParts = useMemo(() => {
    if (!exam) return 0;
    return exam.questions.reduce(
      (total, question) =>
        total +
        question.parts.filter(
          (part) => (answers[part.id] ?? "").trim().length > 0,
        ).length,
      0,
    );
  }, [answers, exam]);

  const totalParts = useMemo(
    () =>
      exam
        ? exam.questions.reduce(
            (total, question) => total + question.parts.length,
            0,
          )
        : 0,
    [exam],
  );

  const timeUsed = exam
    ? Math.max(0, exam.durationSeconds - timeLeft)
    : 0;

  // Accurate countdown based on a real deadline so background throttling
  // does not make the clock drift.
  useEffect(() => {
    if (stage !== "active" || !deadline) return;

    const tick = () => {
      const remaining = Math.max(
        0,
        Math.ceil((deadline - Date.now()) / 1000),
      );
      setTimeLeft(remaining);
      if (remaining <= 0) {
        setRanOutOfTime(true);
        setShowCaseStudy(false);
        setStage("finished");
      }
    };

    tick();
    const interval = window.setInterval(tick, 500);
    return () => window.clearInterval(interval);
  }, [deadline, stage]);

  const startExam = (id: ExamId) => {
    const generated = createExam(id);
    setExam(generated);
    setAnswers({});
    setCurrentIndex(0);
    setRanOutOfTime(false);
    setShowCaseStudy(true);
    setTimeLeft(generated.durationSeconds);
    setDeadline(Date.now() + generated.durationSeconds * 1000);
    setStage("active");
  };

  const handleAnswerChange = (partId: string, value: string) => {
    setAnswers((previous) => ({ ...previous, [partId]: value }));
  };

  const handleExit = () => {
    if (
      stage === "active" &&
      !window.confirm(
        "Exit Mock Exam Mode? Your current answers will be discarded.",
      )
    ) {
      return;
    }
    onExit();
  };

  const handleSubmit = () => {
    if (!exam || stage !== "active") return;
    const unanswered = exam.questions.length - answeredQuestions;
    if (
      unanswered > 0 &&
      !window.confirm(
        `You still have ${unanswered} unanswered question${
          unanswered === 1 ? "" : "s"
        }. Submit the exam anyway?`,
      )
    ) {
      return;
    }
    setShowCaseStudy(false);
    setStage("finished");
  };

  const handleRetake = () => {
    if (!exam) return;
    startExam(exam.id);
  };

  const handleChooseAnother = () => {
    setExam(null);
    setAnswers({});
    setCurrentIndex(0);
    setRanOutOfTime(false);
    setTimeLeft(0);
    setDeadline(0);
    setStage("select");
  };

  const timerTone =
    timeLeft <= 60
      ? "bg-rose-600 text-white border-rose-500 animate-pulse"
      : timeLeft <= 300
        ? "bg-amber-500 text-black border-amber-400"
        : "bg-[#0F2042] text-white border-[#0F2042] dark:bg-white dark:text-black dark:border-white";

  // =========================================================
  // STAGE 1: CHOOSE THE MOCK EXAM
  // =========================================================
  if (stage === "select") {
    return (
      <div className="min-h-screen bg-[#FAF9F6] dark:bg-black text-[#1C1917] dark:text-white flex flex-col transition-colors">
        <header className="sticky top-0 z-30 border-b border-[#E7E5E4] dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md px-4 sm:px-6 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="px-2.5 py-1 rounded-lg bg-[#8B1E1E] text-white text-[10px] font-mono font-bold uppercase tracking-wider shrink-0">
                Mock Exam
              </span>
              <span className="text-xs font-mono text-[#78716C] dark:text-neutral-400 hidden sm:inline truncate">
                Distraction-free timed practice · Test Builder
              </span>
            </div>
            <button
              type="button"
              onClick={handleExit}
              className="px-3 py-1.5 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-semibold hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </header>

        <main className="study-page">
          <header className="study-hero">
            <div className="study-hero-content">
              <p className="study-hero-kicker">Cambridge IGCSE Business Studies · 0264 / 0450</p>
              <h1 className="study-title">Choose your <span>mock exam</span></h1>
              <p className="study-description">The countdown starts when you choose a paper. Each mock includes its case study and relevant appendices.</p>
            </div>
            <div className="study-hero-image" aria-hidden="true" />
          </header>

          <div className="grid md:grid-cols-3 gap-4">
            {EXAM_CONFIGS.map((config) => {
              const accent = CARD_ACCENTS[config.id];
              return (
                <button
                  key={config.id}
                  type="button"
                  onClick={() => startExam(config.id)}
                  className={`study-mock-card text-left border ${accent.border} bg-white dark:bg-neutral-900 flex flex-col transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group`}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${accent.badge}`}
                    >
                      {config.paperLabel}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-[#78716C] dark:text-neutral-400">
                      {config.durationLabel}
                    </span>
                  </div>

                  <div
                    className={`w-9 h-9 rounded-lg ${accent.iconBg} flex items-center justify-center mb-3`}
                  >
                    <FileText className="w-4 h-4" />
                  </div>

                  <h2 className="study-panel-title text-[#0F2042] dark:text-white">
                    {config.title}
                  </h2>
                  <div className="mt-1 text-xs font-mono font-bold text-[#57534E] dark:text-neutral-400">
                    {config.totalMarks} marks
                  </div>

                  <p className="mt-3 text-[11px] font-semibold text-[#0F2042] dark:text-neutral-200">
                    {config.questionMix}
                  </p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-[#57534E] dark:text-neutral-400">
                    {config.description}
                  </p>

                  <div
                    className={`mt-4 pt-3 border-t border-[#E7E5E4] dark:border-neutral-800 text-xs font-bold flex items-center gap-1.5 ${accent.text}`}
                  >
                    Start this mock
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/20 p-4 flex gap-3">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Strict exam conditions
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-amber-900/80 dark:text-amber-200/80">
                Navigation, Study Space and all other distractions are hidden
                while the timer runs. The paper submits automatically when the
                countdown reaches zero.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!exam) return null;

  // =========================================================
  // STAGE 2: RESULTS & MODEL ANSWERS
  // =========================================================
  if (stage === "finished") {
    return (
      <div className="min-h-screen bg-[#FAF9F6] dark:bg-black text-[#1C1917] dark:text-white flex flex-col transition-colors">
        <header className="sticky top-0 z-30 border-b border-[#E7E5E4] dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md px-4 sm:px-6 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider shrink-0">
                Mock Exam Complete
              </span>
              <span className="text-xs font-mono text-[#78716C] dark:text-neutral-400 hidden sm:inline truncate">
                {exam.title} · {exam.totalMarks} marks
              </span>
            </div>
            <button
              type="button"
              onClick={onExit}
              className="px-3 py-1.5 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 text-xs font-semibold hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Exit Exam
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
          <div className="mb-6">
            <p className="text-xs font-mono font-semibold uppercase tracking-wider text-[#8B1E1E] dark:text-[#F87171] mb-1">
              Exam review · {exam.title}
            </p>
            <h1 className="font-academic-serif text-3xl font-bold text-[#0F2042] dark:text-white">
              {ranOutOfTime ? "Time's up!" : "Exam submitted"}
            </h1>
            <p className="mt-2 text-sm text-[#57534E] dark:text-neutral-400 max-w-3xl">
              {ranOutOfTime
                ? "The countdown reached zero and your paper was submitted automatically. "
                : "Your answers are below next to the Cambridge model answers. "}
              Compare each response against the mark scheme to see where you
              earned knowledge, application, analysis, and evaluation credit.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="rounded-xl border border-[#E7E5E4] dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] dark:text-neutral-400 mb-1">
                Time used
              </div>
              <div className="text-xl font-bold text-[#0F2042] dark:text-white font-mono">
                {formatTime(timeUsed)}
              </div>
            </div>
            <div className="rounded-xl border border-[#E7E5E4] dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] dark:text-neutral-400 mb-1">
                Questions answered
              </div>
              <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                {answeredQuestions} / {exam.questions.length}
              </div>
            </div>
            <div className="rounded-xl border border-[#E7E5E4] dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] dark:text-neutral-400 mb-1">
                Marks available
              </div>
              <div className="text-xl font-bold text-[#0F2042] dark:text-white font-mono">
                {exam.totalMarks}
              </div>
            </div>
            <div className="rounded-xl border border-[#E7E5E4] dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] dark:text-neutral-400 mb-1">
                Words written
              </div>
              <div className="text-xl font-bold text-indigo-700 dark:text-indigo-400 font-mono">
                {Object.values(answers).reduce(
                  (sum, answer) => sum + countWords(answer),
                  0,
                )}
              </div>
            </div>
          </div>

          <CaseStudyPanel
            exam={exam}
            open={showCaseStudy}
            onToggle={() => setShowCaseStudy((previous) => !previous)}
          />

          <div className="space-y-5">
            {exam.questions.map((question, index) => (
              <article
                key={question.id}
                className="rounded-2xl border border-[#E7E5E4] dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden"
              >
                <header className="px-4 sm:px-5 py-3 border-b border-[#E7E5E4] dark:border-neutral-800 bg-[#FAF9F6]/70 dark:bg-black/30 flex flex-wrap items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0F2042] dark:bg-white text-white dark:text-black text-[11px] font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {question.number}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                    {question.marks} marks
                  </span>
                  <span className="text-[10px] font-mono text-[#78716C] dark:text-neutral-400">
                    {exam.scenarioId}
                  </span>
                </header>

                <div className="p-4 sm:p-5 space-y-4">
                  {question.parts.map((part) => {
                    const answer = (answers[part.id] ?? "").trim();
                    return (
                      <div
                        key={part.id}
                        className={
                          question.parts.length > 1
                            ? "rounded-xl border border-[#E7E5E4] dark:border-neutral-800 bg-[#FAF9F6]/50 dark:bg-black/20 p-3"
                            : ""
                        }
                      >
                        {part.label && (
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#0F2042] text-white dark:bg-white dark:text-black">
                              {part.label}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-[#78716C] dark:text-neutral-400">
                              {part.marks} marks
                            </span>
                          </div>
                        )}

                        <h3 className="text-sm sm:text-base font-bold text-[#0F2042] dark:text-white leading-relaxed">
                          {part.questionText}
                        </h3>

                        <div className="grid lg:grid-cols-2 gap-4 mt-3">
                          <div>
                            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#57534E] dark:text-neutral-400 mb-1.5">
                              Your answer
                            </div>
                            <div
                              className={`rounded-xl border p-3 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap min-h-[84px] ${
                                answer
                                  ? "border-[#E7E5E4] dark:border-neutral-700 bg-[#FAF9F6] dark:bg-black text-[#1C1917] dark:text-neutral-200"
                                  : "border-dashed border-rose-300 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 italic"
                              }`}
                            >
                              {answer || "No answer submitted."}
                            </div>
                          </div>

                          <div>
                            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1.5 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3" />
                              Cambridge model answer
                            </div>
                            <div className="rounded-xl border border-emerald-300/60 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 text-xs sm:text-sm leading-relaxed text-[#1C1917] dark:text-neutral-200 whitespace-pre-line">
                              {part.modelAnswer || "No model answer available."}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {question.markScheme.length > 0 && (
                    <div>
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#57534E] dark:text-neutral-400 mb-1.5">
                        Mark scheme points
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {question.markScheme.map((group, groupIndex) => (
                          <div
                            key={`${group.label}-${groupIndex}`}
                            className="rounded-lg border border-[#E7E5E4] dark:border-neutral-800 bg-[#FAF9F6] dark:bg-black/40 p-2.5"
                          >
                            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0F2042] dark:text-neutral-300 mb-1">
                              {group.label}
                            </div>
                            <ul className="space-y-1">
                              {group.points.map((point, pointIndex) => (
                                <li
                                  key={`${point}-${pointIndex}`}
                                  className="text-[11px] leading-snug text-[#57534E] dark:text-neutral-400 flex gap-1.5"
                                >
                                  <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleRetake}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0F2042] dark:bg-white text-white dark:text-black text-sm font-bold hover:bg-[#1E3A8A] dark:hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Retake with new questions
            </button>
            <button
              type="button"
              onClick={handleChooseAnother}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-semibold hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              Choose another paper
            </button>
            <button
              type="button"
              onClick={onExit}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-semibold hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Return to Study Studio
            </button>
          </div>
        </main>
      </div>
    );
  }

  // =========================================================
  // STAGE 3: ACTIVE TIMED EXAM
  // =========================================================
  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-black text-[#1C1917] dark:text-white flex flex-col transition-colors">
      <header className="sticky top-0 z-30 border-b border-[#E7E5E4] dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="px-2.5 py-1 rounded-lg bg-[#8B1E1E] text-white text-[10px] font-mono font-bold uppercase tracking-wider shrink-0">
              {exam.paper === 1 ? "Paper 1" : "Paper 2"}
            </span>
            <span className="text-xs font-mono text-[#78716C] dark:text-neutral-400 hidden sm:inline truncate">
              {exam.title} · {exam.totalMarks} marks ·{" "}
              {Math.round(exam.durationSeconds / 60)} minutes
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-sm font-bold tabular-nums ${timerTone}`}
              title="Time remaining"
            >
              <Timer className="w-4 h-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>
            <button
              type="button"
              onClick={handleExit}
              className="px-3 py-1.5 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-semibold hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 flex items-center gap-1.5 cursor-pointer"
              title="Exit mock exam"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 grid lg:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start">
        <section className="min-w-0">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="text-xs font-mono font-semibold text-[#57534E] dark:text-neutral-400">
              Question {currentIndex + 1} of {exam.questions.length}
            </span>
            <span className="text-xs font-mono text-[#78716C] dark:text-neutral-400">
              {answeredQuestions} / {exam.questions.length} questions answered
            </span>
          </div>

          <div className="h-1.5 rounded-full bg-[#E7E5E4] dark:bg-neutral-800 overflow-hidden mb-5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / exam.questions.length) * 100}%`,
              }}
            />
          </div>

          <CaseStudyPanel
            exam={exam}
            open={showCaseStudy}
            onToggle={() => setShowCaseStudy((previous) => !previous)}
          />

          <div className="rounded-2xl border-2 border-[#0F2042]/20 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-4 sm:p-5 shadow-xs">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded bg-[#0F2042] text-white dark:bg-white dark:text-black text-[10px] font-mono font-bold uppercase">
                {currentQuestion.number}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold">
                {currentQuestion.marks} marks
              </span>
              {currentQuestion.parts.length > 1 && (
                <span className="text-[10px] font-mono text-[#78716C] dark:text-neutral-400">
                  {currentQuestion.parts.length} sub-parts
                </span>
              )}
            </div>

            <div className="space-y-5">
              {currentQuestion.parts.map((part) => (
                <div key={part.id}>
                  {part.label && (
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono font-bold text-[#0F2042] dark:text-white">
                        {part.label}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#78716C] dark:text-neutral-400">
                        {part.marks} marks
                      </span>
                    </div>
                  )}

                  <h2 className="font-academic-serif text-base sm:text-lg font-bold text-[#0F2042] dark:text-white leading-relaxed mb-3">
                    {part.questionText}
                  </h2>

                  <label
                    htmlFor={`mock-answer-${part.id}`}
                    className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#57534E] dark:text-neutral-400 mb-1.5"
                  >
                    Your answer
                  </label>
                  <textarea
                    id={`mock-answer-${part.id}`}
                    value={answers[part.id] ?? ""}
                    onChange={(event) =>
                      handleAnswerChange(part.id, event.target.value)
                    }
                    placeholder="Type your full answer here under exam conditions..."
                    rows={part.label ? 4 : 9}
                    className="w-full p-3 rounded-xl border border-[#D6D3D1] dark:border-neutral-700 bg-[#FAF9F6] dark:bg-black text-sm text-[#1C1917] dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0F2042] dark:focus:ring-white resize-y"
                  />
                  <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-[#78716C] dark:text-neutral-400">
                    <span>
                      {countWords(answers[part.id] ?? "")} words
                    </span>
                    <span className="hidden sm:inline">
                      Aim for about {part.marks * 10}–{part.marks * 18} words
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() =>
                setCurrentIndex((index) => Math.max(0, index - 1))
              }
              className="px-4 py-2 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-semibold hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {currentIndex < exam.questions.length - 1 ? (
              <button
                type="button"
                onClick={() =>
                  setCurrentIndex((index) =>
                    Math.min(exam.questions.length - 1, index + 1),
                  )
                }
                className="px-4 py-2 rounded-lg bg-[#0F2042] dark:bg-white text-white dark:text-black text-xs font-bold hover:bg-[#1E3A8A] dark:hover:bg-neutral-200 flex items-center gap-1.5 cursor-pointer"
              >
                Next Question
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Flag className="w-4 h-4" />
                Finish Exam
              </button>
            )}
          </div>
        </section>

        <aside className="lg:sticky lg:top-20 space-y-4">
          <div className="rounded-2xl border border-[#E7E5E4] dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F2042] dark:text-neutral-200">
                Countdown
              </h3>
            </div>
            <div
              className={`rounded-xl border px-3 py-3 text-center font-mono text-3xl font-bold tabular-nums ${timerTone}`}
            >
              {formatTime(timeLeft)}
            </div>
            <p className="mt-2 text-[10px] text-[#78716C] dark:text-neutral-400 leading-snug">
              The exam auto-submits when the timer reaches zero. The case study
              and appendices stay available throughout.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E7E5E4] dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
            <div className="flex items-center gap-2 mb-3">
              <ListChecks className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F2042] dark:text-neutral-200">
                Question Navigator
              </h3>
            </div>
            <div className="space-y-2">
              {exam.questions.map((question, index) => {
                const answered = question.parts.every(
                  (part) => (answers[part.id] ?? "").trim().length > 0,
                );
                const isCurrent = index === currentIndex;
                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-semibold flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      isCurrent
                        ? "border-[#0F2042] dark:border-white bg-[#0F2042] text-white dark:bg-white dark:text-black"
                        : answered
                          ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/70 dark:hover:bg-emerald-950/50"
                          : "border-[#E7E5E4] dark:border-neutral-800 bg-[#FAF9F6] dark:bg-black text-[#57534E] dark:text-neutral-400 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-black/10 dark:bg-white/10 text-[10px] font-mono flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span>
                        {question.number} · {question.marks}m
                      </span>
                    </span>
                    {answered && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-[#E7E5E4] dark:border-neutral-800">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#78716C] dark:text-neutral-400 mb-1.5">
                <span>Parts answered</span>
                <span>
                  {answeredParts} / {totalParts}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-[#E7E5E4] dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-600 transition-all duration-300"
                  style={{
                    width: `${
                      totalParts > 0
                        ? (answeredParts / totalParts) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="mt-4 w-full px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Flag className="w-4 h-4" />
              Finish & See Model Answers
            </button>
          </div>

          <div className="rounded-2xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/20 p-3 flex gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[10px] leading-snug text-amber-900 dark:text-amber-200">
              Strict conditions: work independently, no notes. Use the case
              study facts, figures and appendices in your answers.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}

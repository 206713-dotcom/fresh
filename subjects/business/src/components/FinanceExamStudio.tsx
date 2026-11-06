"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  FINANCE_EXAM_PAPER_2_SPEC,
  FinanceExamQuestion,
} from "../lib/data/finance-exam";
import { evaluateStudentEssay } from "../lib/engine/evaluator";
import { EvaluationResult, StudentSubmissionRecord } from "../lib/types";
import { formatTime, getGradeFromPercentage } from "../lib/utils";
import {
  saveFinanceExamDraft,
  loadFinanceExamDraft,
  clearFinanceExamDraft,
  awardBonusStudyCoins,
} from "../lib/cookies";

interface FinanceExamStudioProps {
  onSaveSubmission: (record: StudentSubmissionRecord) => void;
  onReturnToPractice?: () => void;
}

export function FinanceExamStudio({
  onSaveSubmission,
  onReturnToPractice,
}: FinanceExamStudioProps) {
  const exam = FINANCE_EXAM_PAPER_2_SPEC;
  const caseData = exam.caseInsert;

  // Active question index (0 to 3 for 4 Paper 2 questions)
  const [currentIdx, setCurrentIdx] = useState<number>(() => {
    const draft = loadFinanceExamDraft();
    return typeof draft?.currentIdx === "number" ? draft.currentIdx : 0;
  });
  const currentQ: FinanceExamQuestion = exam.questions[currentIdx] || exam.questions[0];

  // Case Study Tab State
  const [caseTab, setCaseTab] = useState<"narrative" | "app1" | "app2" | "app3" | "hooks">(() => {
    const draft = loadFinanceExamDraft();
    return draft?.caseTab || "narrative";
  });

  // Collapse/Expand Case Study Toggle
  const [isCaseCollapsed, setIsCaseCollapsed] = useState<boolean>(false);

  // Student Answers state (restored from localStorage draft so student typing is NEVER lost)
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const draft = loadFinanceExamDraft();
    return draft?.answers || {
      "p2-fe-q1a": "",
      "p2-fe-q1b": "",
      "p2-fe-q2a": "",
      "p2-fe-q2b": "",
    };
  });

  // Exam Timer: 45 minutes countdown (restored from localStorage draft)
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(() => {
    const draft = loadFinanceExamDraft();
    return typeof draft?.timeLeftSeconds === "number" && draft.timeLeftSeconds > 0
      ? draft.timeLeftSeconds
      : exam.timeAllowedMinutes * 60;
  });
  const [timerRunning, setTimerRunning] = useState<boolean>(true);

  // Evaluation & Results State
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [resultsByQuestion, setResultsByQuestion] = useState<Record<string, EvaluationResult>>({});
  const [totalEarnedMarks, setTotalEarnedMarks] = useState<number>(0);

  // Autosave answers & timer state to localStorage
  useEffect(() => {
    if (!isFinished) {
      saveFinanceExamDraft({
        answers,
        timeLeftSeconds,
        currentIdx,
        caseTab,
        lastSavedAt: Date.now(),
      });
    }
  }, [answers, timeLeftSeconds, currentIdx, caseTab, isFinished]);

  // Sync Q2(a) table inputs into main answer box
  const handleAutoInsertCalculations = () => {
    const text = `(i) Net Cash Flow Calculations:\n• Month 2 (August): $42,000 - $48,000 = -$6,000 (negative $6,000)\n• Month 3 (September): $30,000 - $44,000 = -$14,000 (negative $14,000)\n\n(ii) Closing Bank Balance Calculations:\n• Month 2: Opening $8,000 + Net (-$6,000) = $2,000\n• Month 3: Opening $2,000 + Net (-$14,000) = -$12,000 (overdraft of $12,000)\n\n(iii) Explanation of Difference between Profit and Cash:\n`;
    const existing = answers["p2-fe-q2a"] || "";
    if (!existing.includes("(i) Net Cash Flow")) {
      const updated = {
        ...answers,
        "p2-fe-q2a": text + existing,
      };
      setAnswers(updated);
      saveFinanceExamDraft({
        answers: updated,
        timeLeftSeconds,
        currentIdx,
        caseTab,
        lastSavedAt: Date.now(),
      });
    }
  };

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timeLeftSeconds > 0 && !isFinished) {
      interval = setInterval(() => {
        setTimeLeftSeconds((t) => (t > 0 ? t - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeftSeconds, isFinished]);

  const handleAnswerChange = (text: string) => {
    const updated = { ...answers, [currentQ.id]: text };
    setAnswers(updated);
    saveFinanceExamDraft({
      answers: updated,
      timeLeftSeconds,
      currentIdx,
      caseTab,
      lastSavedAt: Date.now(),
    });
  };

  const handleResetExam = () => {
    if (window.confirm("Are you sure you want to reset all answers and restart the 45-minute exam? Your current draft will be erased.")) {
      clearFinanceExamDraft();
      setAnswers({
        "p2-fe-q1a": "",
        "p2-fe-q1b": "",
        "p2-fe-q2a": "",
        "p2-fe-q2b": "",
      });
      setCurrentIdx(0);
      setTimeLeftSeconds(exam.timeAllowedMinutes * 60);
      setIsFinished(false);
      setTimerRunning(true);
      setResultsByQuestion({});
    }
  };

  const handleFinishExam = async () => {
    setIsGrading(true);
    setTimerRunning(false);

    try {
      const results: Record<string, EvaluationResult> = {};
      let total = 0;

      for (const q of exam.questions) {
        const studentText = answers[q.id]?.trim() || "No candidate answer provided.";
        const rubricForEngine = {
          totalMarks: q.marks,
          ao1Max: q.rubric.ao1Max,
          ao2Max: q.rubric.ao2Max,
          ao3Max: q.rubric.ao3Max,
          ao4Max: q.rubric.ao4Max,
          descriptors: {
            ao1: ["Evaluated against Cambridge 5.1/5.2 Paper 2 syllabus criteria."],
            ao2: ["Evaluated for specific context and application to VCI."],
            ao3: ["Evaluated for cause-and-effect reasoning linking decisions to financial outcomes."],
          },
          indicativeContent: q.rubric.indicativePoints,
          sampleStrongPoint: q.rubric.sampleModelAnswer,
        };

        const res = await evaluateStudentEssay({
          questionTitle: `${q.questionNumber} (${q.marks} marks)`,
          questionPrompt: q.prompt,
          caseContext: `${caseData.businessName} (${caseData.businessType}, ${caseData.industry}). ${caseData.narrativeBackground}\n${caseData.operationalContext}`,
          marks: q.marks,
          rubric: rubricForEngine,
          studentAnswer: studentText,
        });

        results[q.id] = res;
        total += res.totalScore;
      }

      setResultsByQuestion(results);
      setTotalEarnedMarks(total);
      setIsFinished(true);

      const overallPercent = Math.round((total / exam.totalMarks) * 100);
      const gradeInfo = getGradeFromPercentage(overallPercent);

      // Save submission record
      const record: StudentSubmissionRecord = {
        id: `fin-p2-${Date.now()}`,
        questionId: exam.id,
        questionTitle: exam.title,
        marks: exam.totalMarks,
        paper: 2,
        syllabus: "0264",
        unit: "Unit 5: Financial information and decisions (Paper 2 Exam)",
        studentAnswer: Object.entries(answers)
          .map(([qid, ans]) => `[${qid}]: ${ans}`)
          .join("\n\n"),
        wordCount: Object.values(answers).reduce(
          (sum, a) => sum + (a.trim() ? a.trim().split(/\s+/).length : 0),
          0
        ),
        timeSpentSeconds: exam.timeAllowedMinutes * 60 - timeLeftSeconds,
        result: {
          totalScore: total,
          maxMarks: exam.totalMarks,
          percentage: overallPercent,
          aoBreakdown: {
            ao1: { score: 0, max: 0, feedback: "Assessed across Paper 2 criteria" },
            ao2: { score: 0, max: 0, feedback: "Directly applied to VCI guitar manufacturing" },
            ao3: { score: 0, max: 0, feedback: "Financial cause and effect chains" },
            ao4: { score: 0, max: 0, feedback: "Justified evaluation and recommendations" },
          },
          strengths: ["Completed full Cambridge Paper 2 Finance Examination."],
          improvements: ["Compare responses against official model outlines below."],
          examinerNotes: `Final Grade: ${gradeInfo.grade}. Earned ${total}/${exam.totalMarks} marks (${overallPercent}%).`,
          modelAnswerSnippet: "See model answers for Question 1 and Question 2.",
          isAiEvaluated: false,
          evaluatedAt: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      };
      onSaveSubmission(record);
      clearFinanceExamDraft();

      // Award study coins for completing official Cambridge finance exam questions
      const earnedCoins = 30 + Math.max(10, total * 4);
      awardBonusStudyCoins(earnedCoins);

      if (overallPercent >= 70) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (e) {
      console.error("Exam evaluation failed:", e);
    } finally {
      setIsGrading(false);
    }
  };

  const handleRetake = () => {
    clearFinanceExamDraft();
    setAnswers({
      "p2-fe-q1a": "",
      "p2-fe-q1b": "",
      "p2-fe-q2a": "",
      "p2-fe-q2b": "",
    });
    setTimeLeftSeconds(exam.timeAllowedMinutes * 60);
    setTimerRunning(true);
    setIsFinished(false);
    setResultsByQuestion({});
    setTotalEarnedMarks(0);
    setCurrentIdx(0);
  };

  const overallPercentage = Math.round((totalEarnedMarks / exam.totalMarks) * 100);
  const gradeInfo = getGradeFromPercentage(overallPercentage);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 transition-colors">
      {/* Top Banner: Examination Meta Header */}
      <div className="bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 rounded-xl px-5 py-3.5 mb-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0F2042] text-white flex items-center justify-center font-bold text-sm shrink-0">
            P2
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-mono text-[11px] font-bold uppercase">
                Cambridge Paper 2 Case Exam
              </span>
              <span className="text-xs text-[#78716C] dark:text-neutral-400 font-mono">
                Topics 5.1 & 5.2 · 40 Marks
              </span>
            </div>
            <h1 className="font-academic-serif font-bold text-lg text-[#0F2042] dark:text-white leading-tight mt-0.5">
              {caseData.businessName} — Financial Strategy & Cash-Flow Examination
            </h1>
          </div>
        </div>

        {/* Right Controls: Timer & Exit */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Live Exam Clock */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs border ${
              timeLeftSeconds < 300
                ? "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900 animate-pulse font-bold"
                : "bg-[#FAF9F6] dark:bg-black text-[#1C1917] dark:text-neutral-200 border-[#E7E5E4] dark:border-neutral-700"
            }`}
          >
            <span className="text-[10px] uppercase font-sans font-semibold text-[#78716C] dark:text-neutral-400">
              Clock:
            </span>
            <span className="text-sm font-bold">{formatTime(timeLeftSeconds)}</span>
            {!isFinished && (
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="text-[10px] underline text-[#57534E] dark:text-neutral-400 ml-1 cursor-pointer"
              >
                {timerRunning ? "Pause" : "Play"}
              </button>
            )}
          </div>

          {!isFinished && (
            <button
              onClick={handleResetExam}
              className="text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-2.5 py-1.5 border border-rose-200 dark:border-rose-900/60 rounded-lg transition-colors cursor-pointer"
              title="Reset exam answers and timer"
            >
              Reset Exam
            </button>
          )}

          {onReturnToPractice && (
            <button
              onClick={onReturnToPractice}
              className="text-xs text-[#57534E] dark:text-neutral-400 hover:text-[#0F2042] dark:hover:text-white px-3 py-1.5 border border-[#E7E5E4] dark:border-neutral-700 rounded-lg transition-colors cursor-pointer"
            >
              Exit
            </button>
          )}
        </div>
      </div>

      {!isFinished ? (
        <div className="space-y-5">
          {/* CASE STUDY INSERT CARD: PLACED DIRECTLY RIGHT ABOVE THE QUESTION */}
          <div className="bg-white dark:bg-neutral-900 border-2 border-[#0F2042]/20 dark:border-[#38BDF8]/30 rounded-2xl p-5 shadow-sm transition-all">
            {/* Case Insert Header Bar */}
            <div className="pb-3 border-b border-[#E7E5E4] dark:border-neutral-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded bg-[#0F2042] text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                  Paper 2 Case Study Insert
                </span>
                <h2 className="font-academic-serif font-bold text-base text-[#0F2042] dark:text-white">
                  {caseData.businessName} ({caseData.businessType})
                </h2>
                <span className="text-xs text-[#78716C] dark:text-neutral-400 hidden sm:inline">
                  · {caseData.industry}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCaseCollapsed(!isCaseCollapsed)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-md border border-[#E7E5E4] dark:border-neutral-700 text-[#57534E] dark:text-neutral-400 hover:bg-[#FAF9F6] dark:hover:bg-[#0C1322] transition-colors"
                >
                  {isCaseCollapsed ? "▼ Expand Case Insert" : "▲ Collapse Case Insert"}
                </button>
              </div>
            </div>

            {/* If not collapsed, display tabs and case content */}
            {!isCaseCollapsed && (
              <div className="mt-3">
                {/* Case Study Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 pb-2.5 border-b border-[#E7E5E4] dark:border-neutral-800 text-[11px] font-medium">
                  <button
                    onClick={() => setCaseTab("narrative")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      caseTab === "narrative"
                        ? "bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0C1322] font-bold shadow-sm"
                        : "bg-[#F5F5F4] dark:bg-neutral-900 text-[#57534E] dark:text-neutral-400 hover:bg-[#E7E5E4]"
                    }`}
                  >
                    📖 Business Background & Setup
                  </button>
                  <button
                    onClick={() => setCaseTab("app1")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      caseTab === "app1"
                        ? "bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0C1322] font-bold shadow-sm"
                        : "bg-[#F5F5F4] dark:bg-neutral-900 text-[#57534E] dark:text-neutral-400 hover:bg-[#E7E5E4]"
                    }`}
                  >
                    📊 Appendix 1: Q3 Cash Forecast Table
                  </button>
                  <button
                    onClick={() => setCaseTab("app2")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      caseTab === "app2"
                        ? "bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0C1322] font-bold shadow-sm"
                        : "bg-[#F5F5F4] dark:bg-neutral-900 text-[#57534E] dark:text-neutral-400 hover:bg-[#E7E5E4]"
                    }`}
                  >
                    📝 Appendix 2: Director Memo
                  </button>
                  <button
                    onClick={() => setCaseTab("app3")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      caseTab === "app3"
                        ? "bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0C1322] font-bold shadow-sm"
                        : "bg-[#F5F5F4] dark:bg-neutral-900 text-[#57534E] dark:text-neutral-400 hover:bg-[#E7E5E4]"
                    }`}
                  >
                    📑 Appendix 3: Financing Terms
                  </button>
                  <button
                    onClick={() => setCaseTab("hooks")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      caseTab === "hooks"
                        ? "bg-emerald-700 text-white font-bold"
                        : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                    }`}
                  >
                    🎯 AO2 Key Facts & Figures
                  </button>
                </div>

                {/* Case Insert Content Container (Scrollable viewport right above the question) */}
                <div className="py-3 max-h-72 overflow-y-auto pr-1 text-xs text-[#334155] dark:text-neutral-300 leading-relaxed">
                  {caseTab === "narrative" && (
                    <div className="space-y-2.5">
                      <p className="whitespace-pre-line">{caseData.narrativeBackground}</p>
                      <p className="whitespace-pre-line">{caseData.operationalContext}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                        {caseData.financialHighlights.map((fh, i: number) => (
                          <div
                            key={i}
                            className="p-2 bg-[#FAF9F6] dark:bg-black rounded border border-[#E7E5E4] dark:border-neutral-700"
                          >
                            <span className="text-[#78716C] dark:text-neutral-400 block text-[10px]">{fh.label}</span>
                            <strong className="text-[#0F2042] dark:text-[#38BDF8]">{fh.value}</strong>
                            <span className="text-[10px] text-[#57534E] dark:text-neutral-400 block">{fh.detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {caseTab === "app1" && (
                    <div>
                      <h4 className="font-bold text-[#0F2042] dark:text-white mb-1.5">
                        {caseData.appendix1CashFlow.title}
                      </h4>
                      <div className="overflow-x-auto border border-[#E7E5E4] dark:border-neutral-700 rounded-lg font-mono text-[11px]">
                        <table className="w-full text-left">
                          <thead className="bg-[#F5F5F4] dark:bg-neutral-900 text-[#1C1917] dark:text-white font-bold">
                            <tr>
                              {caseData.appendix1CashFlow.headers.map((h: string, i: number) => (
                                <th key={i} className="p-2">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E7E5E4] dark:divide-[#334155]">
                            {caseData.appendix1CashFlow.rows.map((row, i: number) => (
                              <tr
                                key={i}
                                className={
                                  row.isCalculated
                                    ? "font-bold bg-amber-50/60 dark:bg-amber-950/30 text-[#0F2042] dark:text-[#38BDF8]"
                                    : ""
                                }
                              >
                                <td className="p-2 font-sans">{row.item}</td>
                                <td className="p-2">{row.m1}</td>
                                <td className="p-2">{row.m2}</td>
                                <td className="p-2">{row.m3}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <ul className="list-disc pl-4 mt-2 space-y-0.5 text-[11px] text-[#57534E] dark:text-neutral-400">
                        {caseData.appendix1CashFlow.notes.map((note: string, idx: number) => (
                          <li key={idx}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {caseTab === "app2" && (
                    <div className="p-3 bg-[#FAF9F6] dark:bg-black border border-[#E7E5E4] dark:border-neutral-700 rounded-xl font-mono text-xs">
                      <div className="pb-1.5 mb-1.5 border-b border-[#E7E5E4] dark:border-neutral-700 text-[11px] text-[#78716C] dark:text-neutral-400">
                        <div>FROM: {caseData.appendix2Memo.from} · TO: {caseData.appendix2Memo.to}</div>
                        <div>DATE: {caseData.appendix2Memo.date} · SUBJECT: {caseData.appendix2Memo.subject}</div>
                      </div>
                      <p className="whitespace-pre-line leading-relaxed text-[#1C1917] dark:text-neutral-200">
                        {caseData.appendix2Memo.body}
                      </p>
                    </div>
                  )}

                  {caseTab === "app3" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {caseData.appendix3Terms.options.map((opt, i: number) => (
                        <div
                          key={i}
                          className="p-2.5 bg-[#FAF9F6] dark:bg-black border border-[#E7E5E4] dark:border-neutral-700 rounded-lg"
                        >
                          <strong className="text-[#0F2042] dark:text-[#38BDF8] block text-xs">
                            {opt.name}
                          </strong>
                          <p className="text-[11px] text-[#44403C] dark:text-neutral-300 mt-0.5">{opt.terms}</p>
                          <span className="text-[10px] text-red-600 dark:text-red-400 block mt-1">
                            Risk: {opt.risk}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {caseTab === "hooks" && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block">
                        Use these facts in your essay for AO2 Application marks:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {caseData.applicationHooks.map((h: string, i: number) => (
                          <div
                            key={i}
                            className="p-1.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 text-[11px] flex items-center gap-1.5"
                          >
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* QUESTION STEPPER TABS: DIRECTLY BELOW CASE STUDY */}
          <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-neutral-900 p-2 rounded-xl border border-[#E7E5E4] dark:border-neutral-800">
            {exam.questions.map((q: FinanceExamQuestion, idx: number) => {
              const isAnswered = !!answers[q.id]?.trim();
              const isCurrent = idx === currentIdx;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isCurrent
                      ? "bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0C1322] font-bold shadow-sm"
                      : isAnswered
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      : "bg-[#FAF9F6] dark:bg-black text-[#57534E] dark:text-neutral-400 border border-[#E7E5E4] dark:border-neutral-700 hover:bg-white"
                  }`}
                >
                  <span>{q.questionNumber}</span>
                  <span className="opacity-80">({q.marks}m)</span>
                  {isAnswered && <span className="text-[10px]">✓</span>}
                </button>
              );
            })}
          </div>

          {/* ACTIVE QUESTION BOX */}
          <div className="bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-[#E7E5E4] dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-[#0F2042]/10 dark:bg-[#38BDF8]/10 text-[#0F2042] dark:text-[#38BDF8] text-xs font-bold font-mono">
                  {currentQ.questionNumber} · {currentQ.topicTitle}
                </span>
                <span className="px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 text-xs font-bold font-mono">
                  {currentQ.marks} Marks
                </span>
              </div>
              <span className="text-xs text-[#78716C] dark:text-neutral-400 font-mono">
                {currentQ.aoTarget}
              </span>
            </div>

            <div className="mb-4">
              <h3 className="font-academic-serif text-base sm:text-lg font-bold text-[#1C1917] dark:text-white leading-relaxed whitespace-pre-line">
                {currentQ.prompt}
              </h3>
            </div>

            {/* Special interactive calculation helper for Question 2(a) */}
            {currentQ.id === "p2-fe-q2a" && (
              <div className="mb-4 p-4 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <strong className="text-amber-900 dark:text-amber-300">
                    Interactive Calculation Helper (Parts i & ii):
                  </strong>
                  <button
                    onClick={handleAutoInsertCalculations}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-bold"
                  >
                    Insert Formatted Calculations into Essay Box ↳
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                  <div className="bg-white dark:bg-black p-2 rounded border border-amber-300 dark:border-amber-800">
                    <span className="text-[10px] text-slate-500 block">Month 2 Net Cash:</span>
                    <span className="font-bold text-red-600 dark:text-red-400">-$6,000</span>
                    <span className="text-[9px] text-slate-400 block">($42k - $48k)</span>
                  </div>
                  <div className="bg-white dark:bg-black p-2 rounded border border-amber-300 dark:border-amber-800">
                    <span className="text-[10px] text-slate-500 block">Month 3 Net Cash:</span>
                    <span className="font-bold text-red-600 dark:text-red-400">-$14,000</span>
                    <span className="text-[9px] text-slate-400 block">($30k - $44k)</span>
                  </div>
                  <div className="bg-white dark:bg-black p-2 rounded border border-amber-300 dark:border-amber-800">
                    <span className="text-[10px] text-slate-500 block">Month 2 Closing:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">+$2,000</span>
                    <span className="text-[9px] text-slate-400 block">($8k + (-$6k))</span>
                  </div>
                  <div className="bg-white dark:bg-black p-2 rounded border border-amber-300 dark:border-amber-800">
                    <span className="text-[10px] text-slate-500 block">Month 3 Closing:</span>
                    <span className="font-bold text-red-600 dark:text-red-400">-$12,000</span>
                    <span className="text-[9px] text-slate-400 block">($2k + (-$14k))</span>
                  </div>
                </div>
                <p className="text-[11px] text-amber-900/80 dark:text-amber-200/80 italic">
                  Tip for Part (iii): Explain that sales profit is recognized upon guitar delivery (revenue), but customer receipts are delayed by 60-day credit, while timber purchases required immediate cash outflow.
                </p>
              </div>
            )}

            {/* Candidate Essay Response Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#78716C] dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <span>Your Paper 2 Candidate Response:</span>
                  {answers[currentQ.id]?.trim() ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Draft auto-saved locally
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono">
                    Words: {answers[currentQ.id]?.trim() ? answers[currentQ.id].trim().split(/\s+/).length : 0}
                  </span>
                  {answers[currentQ.id]?.trim() && (
                    <button
                      type="button"
                      onClick={() => handleAnswerChange("")}
                      className="text-[11px] text-slate-400 hover:text-rose-500 cursor-pointer underline transition-colors"
                      title="Clear answer for this question part"
                    >
                      Clear Part
                    </button>
                  )}
                </div>
              </div>
              <textarea
                value={answers[currentQ.id] || ""}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder={
                  currentQ.marks === 8
                    ? "Develop two detailed points for internal sources and two for external sources. Use the case figures ($45,000 retained profit, $180,000 CNC machine, 120 guitars) to secure all AO2 Application marks..."
                    : "Evaluate all three options thoroughly. Weigh advantages vs disadvantages with chains of reasoning ('this leads to... as a result...'). Conclude with a definitive, justified recommendation tailored to VCI..."
                }
                rows={currentQ.marks >= 12 ? 14 : 9}
                className="w-full p-4 bg-[#FAF9F6] dark:bg-black border border-[#E7E5E4] dark:border-neutral-700 rounded-xl text-sm leading-relaxed text-[#1C1917] dark:text-neutral-200 focus:ring-2 focus:ring-[#0F2042] dark:focus:ring-[#38BDF8] focus:outline-none transition-all font-sans"
              />
            </div>

            {/* Navigation & Submit Bar */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#E7E5E4] dark:border-neutral-800">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((i) => i - 1)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-[#E7E5E4] dark:border-neutral-700 text-[#57534E] dark:text-neutral-400 hover:bg-[#FAF9F6] dark:hover:bg-neutral-800 disabled:opacity-40 transition-colors"
              >
                ← Previous Part
              </button>

              <div className="flex items-center gap-3">
                {currentIdx < exam.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx((i) => i + 1)}
                    className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0C1322] hover:opacity-90 shadow-sm transition-all"
                  >
                    Next Part →
                  </button>
                ) : (
                  <button
                    onClick={handleFinishExam}
                    disabled={isGrading}
                    className="px-6 py-2.5 text-xs font-bold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-md transition-all flex items-center gap-2"
                  >
                    {isGrading ? "Marking All 4 Parts..." : "Finish & Submit Paper 2 Exam ✓"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 rounded-2xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#E7E5E4] dark:border-neutral-800">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-emerald-700 dark:text-emerald-400">
                  Cambridge Paper 2 Assessment
                </span>
                <h2 className="font-academic-serif text-3xl font-bold text-[#0F2042] dark:text-white mt-1">
                  Final Result: Grade {gradeInfo.grade} ({gradeInfo.label})
                </h2>
                <p className="text-sm text-[#57534E] dark:text-neutral-400 mt-1">
                  CIE Business Studies 0264 / 0450 · Paper 2 Finance Examination (40 Marks)
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center px-6 py-3 bg-[#FAF9F6] dark:bg-black rounded-xl border border-[#E7E5E4] dark:border-neutral-700">
                  <span className="text-xs text-[#78716C] dark:text-neutral-400 block">Total Score</span>
                  <span className="text-3xl font-extrabold text-[#0F2042] dark:text-[#38BDF8]">
                    {totalEarnedMarks} / {exam.totalMarks}
                  </span>
                </div>
                <div className="text-center px-6 py-3 bg-[#FAF9F6] dark:bg-black rounded-xl border border-[#E7E5E4] dark:border-neutral-700">
                  <span className="text-xs text-[#78716C] dark:text-neutral-400 block">Percentage</span>
                  <span className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">
                    {overallPercentage}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <span className="text-xs text-[#78716C] dark:text-neutral-400">
                Examiner's Summary: {overallPercentage >= 70 ? "Superb paper demonstrating thorough financial reasoning, case application, and supported evaluative judgment." : "Good effort. Review cash-flow forecasting timing differences and practice justified conclusions."}
              </span>
              <button
                onClick={handleRetake}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0C1322] hover:opacity-90 transition-all"
              >
                Retake Paper 2 Examination ⟳
              </button>
            </div>
          </div>

          {/* Question Review Cards */}
          <div className="space-y-5">
            {exam.questions.map((q: FinanceExamQuestion) => {
              const res = resultsByQuestion[q.id];
              const studentAns = answers[q.id] || "No candidate answer provided.";

              return (
                <div
                  key={q.id}
                  className="bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 rounded-xl p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-[#E7E5E4] dark:border-neutral-800">
                    <span className="font-bold text-sm text-[#0F2042] dark:text-white">
                      {q.questionNumber}: {q.prompt.split("\n")[0]}
                    </span>
                    <span className="px-2.5 py-1 rounded bg-[#0F2042]/10 dark:bg-[#38BDF8]/10 text-[#0F2042] dark:text-[#38BDF8] text-xs font-bold font-mono">
                      {res ? res.totalScore : 0} / {q.marks} Marks
                    </span>
                  </div>

                  <div className="mb-3">
                    <span className="text-[11px] font-bold text-[#78716C] dark:text-neutral-400 block mb-1">
                      Your Response:
                    </span>
                    <div className="p-3 bg-[#FAF9F6] dark:bg-black rounded-lg border border-[#E7E5E4] dark:border-neutral-700 text-xs leading-relaxed text-[#1C1917] dark:text-neutral-200 whitespace-pre-wrap">
                      {studentAns}
                    </div>
                  </div>

                  {res && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 font-mono text-xs">
                      <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-500 block">AO1 Knowledge</span>
                        <strong className="text-slate-800 dark:text-slate-200">{res.aoBreakdown.ao1.score} / {res.aoBreakdown.ao1.max}</strong>
                      </div>
                      <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded border border-blue-200 dark:border-blue-900">
                        <span className="text-[10px] text-blue-500 block">AO2 Application</span>
                        <strong className="text-blue-800 dark:text-blue-200">{res.aoBreakdown.ao2.score} / {res.aoBreakdown.ao2.max}</strong>
                      </div>
                      <div className="p-2 bg-amber-50 dark:bg-amber-950/40 rounded border border-amber-200 dark:border-amber-900">
                        <span className="text-[10px] text-amber-500 block">AO3 Analysis</span>
                        <strong className="text-amber-800 dark:text-amber-200">{res.aoBreakdown.ao3.score} / {res.aoBreakdown.ao3.max}</strong>
                      </div>
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded border border-emerald-200 dark:border-emerald-900">
                        <span className="text-[10px] text-emerald-500 block">AO4 Evaluation</span>
                        <strong className="text-emerald-800 dark:text-emerald-200">{res.aoBreakdown.ao4.score} / {res.aoBreakdown.ao4.max}</strong>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-lg text-xs space-y-2">
                    <strong className="text-emerald-900 dark:text-emerald-300 block">
                      Cambridge Model Answer Outline:
                    </strong>
                    <p className="text-emerald-950 dark:text-emerald-100 italic leading-relaxed whitespace-pre-wrap">
                      "{q.rubric.sampleModelAnswer}"
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

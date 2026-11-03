"use client";

import React, { useState } from "react";
import { StudentSubmissionRecord } from "../lib/types";
import { getGradeFromPercentage, formatTime, formatDate } from "../lib/utils";


interface ProgressDashboardProps {
  submissions: StudentSubmissionRecord[];
  masteredTermsCount: number;
  totalTermsCount: number;
  onClearSubmissions: () => void;
  onSelectPractice: () => void;
}

export function ProgressDashboard({
  submissions,
  masteredTermsCount,
  totalTermsCount,
  onClearSubmissions,
  onSelectPractice,
}: ProgressDashboardProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalAttempts = submissions.length;
  const totalEarned = submissions.reduce((acc, s) => acc + s.result.totalScore, 0);
  const totalMax = submissions.reduce((acc, s) => acc + s.result.maxMarks, 0);
  const averagePercentage =
    totalMax > 0 ? Math.round((totalEarned / totalMax) * 100) : 0;

  // AO Competency Calculation
  let ao1Earned = 0, ao1Max = 0;
  let ao2Earned = 0, ao2Max = 0;
  let ao3Earned = 0, ao3Max = 0;
  let ao4Earned = 0, ao4Max = 0;

  submissions.forEach((s) => {
    ao1Earned += s.result.aoBreakdown.ao1.score;
    ao1Max += s.result.aoBreakdown.ao1.max;
    ao2Earned += s.result.aoBreakdown.ao2.score;
    ao2Max += s.result.aoBreakdown.ao2.max;
    ao3Earned += s.result.aoBreakdown.ao3.score;
    ao3Max += s.result.aoBreakdown.ao3.max;
    ao4Earned += s.result.aoBreakdown.ao4.score;
    ao4Max += s.result.aoBreakdown.ao4.max;
  });

  const getPercent = (earned: number, max: number) =>
    max > 0 ? Math.round((earned / max) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-academic-serif text-3xl font-bold text-[#0F2042] dark:text-[#F1F5F9]">
            Candidate Progress Ledger
          </h1>
          <p className="text-sm text-[#57534E] dark:text-[#94A3B8]">
            Permanently stored locally via client cookies · No login or password required
          </p>
        </div>

        {totalAttempts > 0 && (
          <button
            onClick={() => {
              if (confirm("Are you sure you want to clear your local submission history?")) {
                onClearSubmissions();
              }
            }}
            className="text-xs text-rose-700 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 font-semibold"
          >
            Clear History
          </button>
        )}
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="bg-white dark:bg-[#162032] border border-[#E7E5E4] dark:border-[#1E293B] rounded-xl p-5 shadow-sm">
          <span className="text-xs font-mono uppercase text-[#78716C] dark:text-[#94A3B8]">
            Questions Practiced
          </span>
          <div className="font-academic-serif text-3xl font-bold text-[#0F2042] dark:text-[#F1F5F9] mt-1 tabular-nums">
            {totalAttempts}
          </div>
          <span className="text-[11px] text-[#57534E] dark:text-[#94A3B8] mt-1 block">
            Across 2, 4, 6, 8, and 12-mark tiers
          </span>
        </div>

        <div className="bg-white dark:bg-[#162032] border border-[#E7E5E4] dark:border-[#1E293B] rounded-xl p-5 shadow-sm">
          <span className="text-xs font-mono uppercase text-[#78716C] dark:text-[#94A3B8]">
            Average Mark Score
          </span>
          <div className="font-academic-serif text-3xl font-bold text-[#0F2042] dark:text-[#38BDF8] mt-1 tabular-nums">
            {averagePercentage}%
          </div>
          <span className="text-[11px] text-[#57534E] dark:text-[#94A3B8] mt-1 block">
            {totalEarned} / {totalMax} total marks earned
          </span>
        </div>

        <div className="bg-white dark:bg-[#162032] border border-[#E7E5E4] dark:border-[#1E293B] rounded-xl p-5 shadow-sm">
          <span className="text-xs font-mono uppercase text-[#78716C] dark:text-[#94A3B8]">
            Projected Grade
          </span>
          <div className="font-academic-serif text-3xl font-bold text-[#0F2042] dark:text-[#F1F5F9] mt-1">
            {totalAttempts > 0 ? getGradeFromPercentage(averagePercentage).grade : "—"}
          </div>
          <span className="text-[11px] text-[#57534E] dark:text-[#94A3B8] mt-1 block">
            {totalAttempts > 0 ? getGradeFromPercentage(averagePercentage).label : "Complete 1 practice"}
          </span>
        </div>

        <div className="bg-white dark:bg-[#162032] border border-[#E7E5E4] dark:border-[#1E293B] rounded-xl p-5 shadow-sm">
          <span className="text-xs font-mono uppercase text-[#78716C] dark:text-[#94A3B8]">
            0264 Glossary Mastery
          </span>
          <div className="font-academic-serif text-3xl font-bold text-[#0F2042] dark:text-[#F1F5F9] mt-1 tabular-nums">
            {masteredTermsCount} / {totalTermsCount}
          </div>
          <span className="text-[11px] text-[#57534E] dark:text-[#94A3B8] mt-1 block">
            {Math.round((masteredTermsCount / (totalTermsCount || 1)) * 100)}% syllabus vocabulary mastered
          </span>
        </div>
      </div>

      {/* AO Performance Matrix */}
      <div className="bg-white dark:bg-[#162032] border border-[#E7E5E4] dark:border-[#1E293B] rounded-xl p-6 shadow-sm mb-10">
        <h2 className="font-academic-serif text-xl font-bold text-[#0F2042] dark:text-[#F1F5F9] mb-4">
          Assessment Objectives (AO) Competency Mastery
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-[#FAF9F6] dark:bg-[#0F172A] rounded-lg border border-[#E7E5E4] dark:border-[#1E293B]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-[#0F2042] dark:text-[#38BDF8]">AO1 Knowledge</span>
              <span className="font-mono font-bold text-[#0F2042] dark:text-[#38BDF8]">{getPercent(ao1Earned, ao1Max)}%</span>
            </div>
            <div className="w-full bg-[#E7E5E4] dark:bg-[#1E293B] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0F2042] dark:bg-[#38BDF8] h-full"
                style={{ width: `${getPercent(ao1Earned, ao1Max)}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-[#78716C] dark:text-[#94A3B8] mt-2 block">
              {ao1Earned} / {ao1Max} marks (Vocabulary & Definitions)
            </span>
          </div>

          <div className="p-4 bg-[#FAF9F6] dark:bg-[#0F172A] rounded-lg border border-[#E7E5E4] dark:border-[#1E293B]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-[#0F2042] dark:text-[#38BDF8]">AO2 Application</span>
              <span className="font-mono font-bold text-[#0F2042] dark:text-[#38BDF8]">{getPercent(ao2Earned, ao2Max)}%</span>
            </div>
            <div className="w-full bg-[#E7E5E4] dark:bg-[#1E293B] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0F2042] dark:bg-[#38BDF8] h-full"
                style={{ width: `${getPercent(ao2Earned, ao2Max)}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-[#78716C] dark:text-[#94A3B8] mt-2 block">
              {ao2Earned} / {ao2Max} marks (Case Study Integration)
            </span>
          </div>

          <div className="p-4 bg-[#FAF9F6] dark:bg-[#0F172A] rounded-lg border border-[#E7E5E4] dark:border-[#1E293B]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-[#0F2042] dark:text-[#38BDF8]">AO3 Analysis</span>
              <span className="font-mono font-bold text-[#0F2042] dark:text-[#38BDF8]">{getPercent(ao3Earned, ao3Max)}%</span>
            </div>
            <div className="w-full bg-[#E7E5E4] dark:bg-[#1E293B] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0F2042] dark:bg-[#38BDF8] h-full"
                style={{ width: `${getPercent(ao3Earned, ao3Max)}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-[#78716C] dark:text-[#94A3B8] mt-2 block">
              {ao3Earned} / {ao3Max} marks (Causal Chains of Reasoning)
            </span>
          </div>

          <div className="p-4 bg-[#FAF9F6] dark:bg-[#0F172A] rounded-lg border border-[#E7E5E4] dark:border-[#1E293B]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-[#0F2042] dark:text-[#38BDF8]">AO4 Evaluation</span>
              <span className="font-mono font-bold text-[#0F2042] dark:text-[#38BDF8]">{getPercent(ao4Earned, ao4Max)}%</span>
            </div>
            <div className="w-full bg-[#E7E5E4] dark:bg-[#1E293B] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0F2042] dark:bg-[#38BDF8] h-full"
                style={{ width: `${getPercent(ao4Earned, ao4Max)}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-[#78716C] dark:text-[#94A3B8] mt-2 block">
              {ao4Earned} / {ao4Max} marks (Justified Recommendations)
            </span>
          </div>
        </div>
      </div>

      {/* Submission Log Table */}
      <div className="bg-white dark:bg-[#162032] border border-[#E7E5E4] dark:border-[#1E293B] rounded-xl p-6 shadow-sm">
        <h2 className="font-academic-serif text-xl font-bold text-[#0F2042] dark:text-[#F1F5F9] mb-4">
          Submission History & Examiner Feedback
        </h2>

        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-[#78716C] dark:text-[#94A3B8] mb-4">
              No essays or questions completed yet.
            </p>
            <button
              onClick={onSelectPractice}
              className="bg-[#0F2042] dark:bg-[#38BDF8] hover:bg-[#1E3A8A] dark:hover:bg-[#0284C7] text-white dark:text-[#0F172A] text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Start Your First Question
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => {
              const grade = getGradeFromPercentage(sub.result.percentage);
              const isExpanded = expandedId === sub.id;

              return (
                <div
                  key={sub.id}
                  className="border border-[#E7E5E4] dark:border-[#1E293B] rounded-lg p-4 bg-[#FAF9F6] dark:bg-[#0F172A] text-xs transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E7E5E4] dark:border-[#1E293B]">
                    <div>
                      <span className="font-semibold text-[#0F2042] dark:text-[#F1F5F9] text-sm block">
                        {sub.questionTitle}
                      </span>
                      <span className="text-[#78716C] dark:text-[#94A3B8] text-[11px]">
                        {formatDate(sub.timestamp)} · {sub.wordCount} words · Time: {formatTime(sub.timeSpentSeconds)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-[#0F2042] dark:text-[#38BDF8]">
                        {sub.result.totalScore} / {sub.marks} marks
                      </span>
                      <span className={`px-2.5 py-0.5 rounded font-mono font-bold ${grade.color}`}>
                        {grade.grade}
                      </span>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                        className="text-xs font-semibold text-[#0F2042] dark:text-[#38BDF8] hover:underline"
                      >
                        {isExpanded ? "Collapse ▲" : "Review Answer ▼"}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-2 space-y-4">
                      {/* Candidate Essay */}
                      <div className="p-3 bg-white dark:bg-[#162032] rounded border border-[#E7E5E4] dark:border-[#1E293B]">
                        <span className="font-semibold text-[#44403C] dark:text-[#94A3B8] block mb-1">
                          Candidate Submission:
                        </span>
                        <p className="whitespace-pre-wrap text-[#1C1917] dark:text-[#E2E8F0] leading-relaxed">
                          {sub.studentAnswer}
                        </p>
                      </div>

                      {/* Examiner Notes */}
                      <div className="p-3 bg-white dark:bg-[#162032] rounded border border-[#E7E5E4] dark:border-[#1E293B]">
                        <span className="font-semibold text-[#0F2042] dark:text-[#38BDF8] block mb-1">
                          Examiner Assessment:
                        </span>
                        <p className="text-[#57534E] dark:text-[#94A3B8] leading-relaxed mb-2">
                          {sub.result.examinerNotes}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#E7E5E4] dark:border-[#1E293B]">
                          <div>
                            <span className="text-[10px] text-[#78716C] dark:text-[#94A3B8] block">AO1:</span>
                            <span className="font-mono font-bold text-[#0F2042] dark:text-[#38BDF8]">
                              {sub.result.aoBreakdown.ao1.score} / {sub.result.aoBreakdown.ao1.max}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#78716C] dark:text-[#94A3B8] block">AO2:</span>
                            <span className="font-mono font-bold text-[#0F2042] dark:text-[#38BDF8]">
                              {sub.result.aoBreakdown.ao2.score} / {sub.result.aoBreakdown.ao2.max}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#78716C] dark:text-[#94A3B8] block">AO3:</span>
                            <span className="font-mono font-bold text-[#0F2042] dark:text-[#38BDF8]">
                              {sub.result.aoBreakdown.ao3.score} / {sub.result.aoBreakdown.ao3.max}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#78716C] dark:text-[#94A3B8] block">AO4:</span>
                            <span className="font-mono font-bold text-[#0F2042] dark:text-[#38BDF8]">
                              {sub.result.aoBreakdown.ao4.score} / {sub.result.aoBreakdown.ao4.max}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

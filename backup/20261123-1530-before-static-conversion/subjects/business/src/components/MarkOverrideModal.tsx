import React, { useState } from "react";
import { EvaluationResult, ManualOverrideData } from "../lib/types";

interface MarkOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: EvaluationResult;
  onApplyOverride: (override: ManualOverrideData) => void;
  onResetOverride?: () => void;
}

export const MarkOverrideModal: React.FC<MarkOverrideModalProps> = ({
  isOpen,
  onClose,
  result,
  onApplyOverride,
  onResetOverride,
}) => {
  const originalScore = result.manualOverride?.originalScore ?? result.totalScore;
  const currentTotal = result.totalScore;
  const maxMarks = result.maxMarks;

  const [score, setScore] = useState<number>(currentTotal);
  const [bodApplied, setBodApplied] = useState<boolean>(result.manualOverride?.bodApplied ?? false);
  const [reason, setReason] = useState<string>(
    result.manualOverride?.reason ?? "Candidate demonstrated valid alternative reasoning per mark scheme guidance."
  );

  // Individual AO adjustments
  const [ao1Score, setAo1Score] = useState<number>(
    result.manualOverride?.customBreakdown?.ao1 ?? result.aoBreakdown.ao1.score
  );
  const [ao2Score, setAo2Score] = useState<number>(
    result.manualOverride?.customBreakdown?.ao2 ?? result.aoBreakdown.ao2.score
  );
  const [ao3Score, setAo3Score] = useState<number>(
    result.manualOverride?.customBreakdown?.ao3 ?? result.aoBreakdown.ao3.score
  );
  const [ao4Score, setAo4Score] = useState<number>(
    result.manualOverride?.customBreakdown?.ao4 ?? result.aoBreakdown.ao4.score
  );

  const [useDetailedAO, setUseDetailedAO] = useState<boolean>(false);

  if (!isOpen) return null;

  const max1 = result.aoBreakdown.ao1.max;
  const max2 = result.aoBreakdown.ao2.max;
  const max3 = result.aoBreakdown.ao3.max;
  const max4 = result.aoBreakdown.ao4.max;

  const quickReasons = [
    { label: "BOD (Benefit of Doubt)", desc: "Plausible contextual phrasing that AI didn't catch" },
    { label: "Valid Alternative", desc: "Mark scheme explicitly accepts 'other valid answers'" },
    { label: "Case Context Present", desc: "Student applied scenario facts that AI missed" },
    { label: "Clear Cause & Effect", desc: "Analysis link (AO3) is coherent despite non-standard wording" },
  ];

  // Helper to rebalance AOs whenever a total score is set directly
  const distributeScoreToAOs = (newTotal: number) => {
    if (newTotal >= maxMarks) {
      setAo1Score(max1);
      setAo2Score(max2);
      setAo3Score(max3);
      setAo4Score(max4);
      return;
    }
    if (newTotal <= 0) {
      setAo1Score(0);
      setAo2Score(0);
      setAo3Score(0);
      setAo4Score(0);
      return;
    }

    // Start with current scores, and adjust step-by-step
    let a1 = Math.min(max1, ao1Score);
    let a2 = Math.min(max2, ao2Score);
    let a3 = Math.min(max3, ao3Score);
    let a4 = Math.min(max4, ao4Score);

    let currentSum = a1 + a2 + a3 + a4;

    // Need to add marks? Priority: AO3 (Analysis) -> AO2 (Application) -> AO1 (Knowledge) -> AO4 (Evaluation)
    while (currentSum < newTotal) {
      if (a3 < max3) { a3++; currentSum++; }
      else if (a2 < max2) { a2++; currentSum++; }
      else if (a1 < max1) { a1++; currentSum++; }
      else if (a4 < max4) { a4++; currentSum++; }
      else break;
    }

    // Need to subtract marks?
    while (currentSum > newTotal) {
      if (a4 > 0) { a4--; currentSum--; }
      else if (a3 > 0) { a3--; currentSum--; }
      else if (a2 > 0) { a2--; currentSum--; }
      else if (a1 > 0) { a1--; currentSum--; }
      else break;
    }

    setAo1Score(a1);
    setAo2Score(a2);
    setAo3Score(a3);
    setAo4Score(a4);
  };

  const handleApplyBOD = () => {
    const newScore = Math.min(maxMarks, score + 1);
    setScore(newScore);
    setBodApplied(true);
    setReason("BOD (Benefit of the Doubt) awarded: Candidate's explanation is valid in Cambridge examiner discretion.");

    // Increment an AO with remaining room, prioritizing Analysis (AO3), then Application (AO2), Knowledge (AO1), Evaluation (AO4)
    if (ao3Score < max3) {
      setAo3Score(ao3Score + 1);
    } else if (ao2Score < max2) {
      setAo2Score(ao2Score + 1);
    } else if (ao1Score < max1) {
      setAo1Score(ao1Score + 1);
    } else if (ao4Score < max4) {
      setAo4Score(ao4Score + 1);
    }
  };

  const handleAwardFullMarks = () => {
    setScore(maxMarks);
    setAo1Score(max1);
    setAo2Score(max2);
    setAo3Score(max3);
    setAo4Score(max4);
    setReason("Candidate full credit awarded: thorough answer covering all assessment objectives (AO1, AO2, AO3, AO4).");
  };

  const handleScoreChange = (val: number) => {
    const clamped = Math.max(0, Math.min(maxMarks, val));
    setScore(clamped);
    distributeScoreToAOs(clamped);
  };

  const handleDetailedAoChange = (ao: "ao1" | "ao2" | "ao3" | "ao4", val: number) => {
    let next1 = ao === "ao1" ? val : ao1Score;
    let next2 = ao === "ao2" ? val : ao2Score;
    let next3 = ao === "ao3" ? val : ao3Score;
    let next4 = ao === "ao4" ? val : ao4Score;

    if (ao === "ao1") setAo1Score(val);
    if (ao === "ao2") setAo2Score(val);
    if (ao === "ao3") setAo3Score(val);
    if (ao === "ao4") setAo4Score(val);

    const calculatedSum = Math.min(maxMarks, next1 + next2 + next3 + next4);
    setScore(calculatedSum);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Always provide customBreakdown so table marks (AO1, AO2, AO3, AO4) update immediately
    const overrideData: ManualOverrideData = {
      isOverridden: true,
      originalScore,
      newScore: score,
      reason,
      bodApplied,
      overriddenAt: new Date().toISOString(),
      customBreakdown: {
        ao1: ao1Score,
        ao2: ao2Score,
        ao3: ao3Score,
        ao4: ao4Score,
      },
    };
    onApplyOverride(overrideData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-800/40">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-lg font-bold">
              ⚖️
            </span>
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-white text-base">
                Manual Mark Override & BOD Credit
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Correct AI under-marking, award examiner BOD, or adjust marks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Comparison banner */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-neutral-100 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700/60">
            <div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Original AI Mark</div>
              <div className="text-2xl font-extrabold text-neutral-800 dark:text-neutral-200">
                {originalScore} <span className="text-xs font-normal text-neutral-400">/ {maxMarks}</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">New Adjusted Mark</div>
              <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {score} <span className="text-xs font-normal text-amber-500/70">/ {maxMarks}</span>
                {bodApplied && (
                  <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-full">
                    BOD
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Quick Mark Actions
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleApplyBOD}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold shadow-sm transition-transform active:scale-95"
              >
                <span>➕ +1 Mark BOD</span>
                <span className="text-[10px] bg-black/20 px-1.5 py-0.2 rounded font-mono">Examiner Discretion</span>
              </button>

              <button
                type="button"
                onClick={handleAwardFullMarks}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-transform active:scale-95"
              >
                💯 Award Full Marks ({maxMarks}/{maxMarks})
              </button>

              {result.manualOverride?.isOverridden && onResetOverride && (
                <button
                  type="button"
                  onClick={() => {
                    onResetOverride();
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-semibold transition"
                >
                  ↺ Reset to AI Mark
                </button>
              )}
            </div>
          </div>

          {/* Score Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-neutral-800 dark:text-neutral-200">
                Adjusted Total Score:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max={maxMarks}
                  value={score}
                  onChange={(e) => handleScoreChange(Number(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-center font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <span className="text-neutral-500">/ {maxMarks}</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max={maxMarks}
              value={score}
              onChange={(e) => handleScoreChange(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Detailed AO Toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setUseDetailedAO(!useDetailedAO)}
              className="text-xs text-sky-600 dark:text-sky-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>{useDetailedAO ? "▼ Hide Detailed AO Breakdown" : "▶ Customize AO1 / AO2 / AO3 / AO4 Marks Individually"}</span>
            </button>

            {useDetailedAO && (
              <div className="mt-3 p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-2.5">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-neutral-600 dark:text-neutral-300 font-medium block mb-1">
                      AO1 Knowledge ({result.aoBreakdown.ao1.max} max):
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={result.aoBreakdown.ao1.max}
                      value={ao1Score}
                      onChange={(e) => handleDetailedAoChange("ao1", Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-600 dark:text-neutral-300 font-medium block mb-1">
                      AO2 Application ({result.aoBreakdown.ao2.max} max):
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={result.aoBreakdown.ao2.max}
                      value={ao2Score}
                      onChange={(e) => handleDetailedAoChange("ao2", Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-600 dark:text-neutral-300 font-medium block mb-1">
                      AO3 Analysis ({result.aoBreakdown.ao3.max} max):
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={result.aoBreakdown.ao3.max}
                      value={ao3Score}
                      onChange={(e) => handleDetailedAoChange("ao3", Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                    />
                  </div>
                  {result.aoBreakdown.ao4.max > 0 && (
                    <div>
                      <label className="text-neutral-600 dark:text-neutral-300 font-medium block mb-1">
                        AO4 Evaluation ({result.aoBreakdown.ao4.max} max):
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={result.aoBreakdown.ao4.max}
                        value={ao4Score}
                        onChange={(e) => handleDetailedAoChange("ao4", Number(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Reason selection */}
          <div className="space-y-2">
            <label className="font-semibold text-neutral-800 dark:text-neutral-200 block text-xs uppercase tracking-wider">
              Reason / Cambridge Marking Justification
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {quickReasons.map((qr) => (
                <button
                  type="button"
                  key={qr.label}
                  onClick={() => setReason(`${qr.label}: ${qr.desc}`)}
                  className="text-left p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-amber-400 dark:hover:border-amber-500 bg-white dark:bg-neutral-800/40 text-xs transition"
                >
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200">{qr.label}</div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">{qr.desc}</div>
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why is this mark adjustment justified? (e.g. AI did not recognise alternative term for diseconomies of scale)"
              className="w-full p-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <span>Save & Apply Score</span>
              <span>✓</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

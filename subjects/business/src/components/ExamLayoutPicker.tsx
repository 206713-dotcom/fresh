import React from "react";
import { Columns2, Rows2 } from "lucide-react";
import type { ExamLayout } from "../lib/exam-layout";

interface ExamLayoutPickerProps {
  layout: ExamLayout;
  onChange: (next: ExamLayout) => void;
  /** Short label shown next to the toggle. */
  label?: string;
}

/**
 * Compact switch between the two on-screen arrangements used by the mock exam
 * and both practice studios: case study above the question, or beside it.
 */
export function ExamLayoutPicker({
  layout,
  onChange,
  label = "Layout",
}: ExamLayoutPickerProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="hidden sm:inline text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--surface-muted)]">
        {label}
      </span>
      <div
        role="group"
        aria-label="Case study layout"
        className="flex items-center gap-0.5 rounded-lg border border-[var(--surface-line)] bg-[var(--surface-soft)] p-0.5"
      >
        <button
          type="button"
          aria-pressed={layout === "stacked"}
          title="Text at top, question below"
          aria-label="Text at top, question below"
          onClick={() => onChange("stacked")}
          className={`p-1.5 rounded-md cursor-pointer ${
            layout === "stacked"
              ? "bg-[#0F2042] text-white dark:bg-white dark:text-black"
              : "text-[var(--surface-muted)] hover:bg-black/5 dark:hover:bg-white/10"
          }`}
        >
          <Rows2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          aria-pressed={layout === "columns"}
          title="Text left, question right"
          aria-label="Text left, question right"
          onClick={() => onChange("columns")}
          className={`p-1.5 rounded-md cursor-pointer ${
            layout === "columns"
              ? "bg-[#0F2042] text-white dark:bg-white dark:text-black"
              : "text-[var(--surface-muted)] hover:bg-black/5 dark:hover:bg-white/10"
          }`}
        >
          <Columns2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

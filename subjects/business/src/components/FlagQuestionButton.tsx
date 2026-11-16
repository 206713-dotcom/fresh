import { useEffect, useState } from "react";
import { Check, Flag, Loader2, X } from "lucide-react";
import { isQuestionFlagged, markQuestionFlagged } from "../lib/flags";
import { logFlaggedQuestion } from "../lib/sheetSync";

const REASONS = [
  "Typo in question",
  "Mark scheme issue",
  "Wrong unit / tag",
  "Other",
] as const;

const CONFIDENCES = ["Pretty sure", "Very confident", "100% certain"] as const;

const MAX_NOTE = 240;

export function FlagQuestionButton({ questionId }: { questionId: string }) {
  const [open, setOpen] = useState(false);
  const [flagged, setFlagged] = useState(() => isQuestionFlagged(questionId));
  const [reason, setReason] = useState<(typeof REASONS)[number]>("Typo in question");
  const [confidence, setConfidence] = useState<(typeof CONFIDENCES)[number]>("Pretty sure");
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  // Re-sync when a different question renders on screen
  useEffect(() => {
    setFlagged(isQuestionFlagged(questionId));
    setState("idle");
    setReason("Typo in question");
    setConfidence("Pretty sure");
    setNote("");
  }, [questionId]);

  // Escape closes the popover + lock background scroll while open
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const submit = async () => {
    if (state === "sending" || flagged) return;
    setState("sending");
    try {
      await logFlaggedQuestion({ questionId, reason, confidence, note: note.trim().slice(0, MAX_NOTE) });
      markQuestionFlagged(questionId);
      setFlagged(true);
      setState("done");
    } catch {
      setState("error");
    }
  };

  // Already reported for this question — show a subtle, non-intrusive badge
  if (flagged && state !== "done") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300" role="status">
        <Check className="h-3 w-3" aria-hidden="true" /> Reported
      </span>
    );
  }

  if (state === "done") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300" role="status">
        <Check className="h-3 w-3" aria-hidden="true" /> Reported — thanks!
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Report an issue with this question"
        aria-haspopup="dialog"
        aria-expanded={open}
        className="inline-flex items-center gap-1 rounded-md border border-transparent px-2 py-1 text-[11px] font-semibold text-[var(--muted)] transition-colors hover:border-[var(--line)] hover:bg-[var(--sheet-surface)] hover:text-[var(--ink)] dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
      >
        <Flag className="h-3 w-3" aria-hidden="true" />
        Flag issue
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="presentation">
          {/* Backdrop */}
          <button type="button" aria-label="Close report dialog" className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" onClick={() => setOpen(false)} />

          {/* Dialog */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="flag-question-title"
            className="relative m-0 w-full max-w-md rounded-t-2xl border border-neutral-200 bg-white p-5 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 sm:m-4 sm:rounded-2xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-neutral-200 pb-3 dark:border-neutral-800">
              <h3 id="flag-question-title" className="flex items-center gap-2 font-academic-serif text-base font-bold text-[var(--green)] dark:text-white">
                <Flag className="h-4 w-4" aria-hidden="true" /> Report question issue
              </h3>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
              {questionId}
            </p>

            {/* Reason */}
            <fieldset className="mt-3">
              <legend className="text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
                What's wrong?
              </legend>
              <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                {REASONS.map((r) => (
                  <label
                    key={r}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-[11px] font-semibold transition-all ${
                      reason === r
                        ? "border-[var(--green)] bg-[var(--green)] text-white dark:border-[#38BDF8] dark:bg-[#38BDF8] dark:text-[#0F172A]"
                        : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-neutral-700"
                    }`}
                  >
                    <input type="radio" name="flag-reason" value={r} checked={reason === r} onChange={() => setReason(r)} className="sr-only" />
                    {r}
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Confidence */}
            <fieldset className="mt-3">
              <legend className="text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
                How sure are you?
              </legend>
              <div className="mt-1.5 inline-flex w-full rounded-lg border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-800" role="radiogroup" aria-label="Confidence level">
                {CONFIDENCES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    role="radio"
                    aria-checked={confidence === c}
                    onClick={() => setConfidence(c)}
                    className={`flex-1 rounded-md px-2 py-1.5 text-[11px] font-bold transition-all ${
                      confidence === c
                        ? "bg-white text-[var(--green)] shadow-sm dark:bg-neutral-900 dark:text-[#38BDF8]"
                        : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Note */}
            <label className="mt-3 block text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400" htmlFor="flag-note">
              Note (optional)
            </label>
            <textarea
              id="flag-note"
              rows={2}
              maxLength={MAX_NOTE}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="What exactly is wrong? e.g. option B and the mark scheme disagree about the formula…"
              className="mt-1.5 w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:border-[var(--green)] focus:outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
            />

            {/* Footer actions */}
            <div className="mt-4 flex items-center justify-between gap-2 border-t border-neutral-200 pt-3 dark:border-neutral-800">
              <span className="font-mono text-[10px] text-neutral-400">{note.length}/{MAX_NOTE}</span>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submit}
                  disabled={state === "sending"}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--green)] px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:opacity-90 disabled:opacity-50"
                >
                  {state === "sending" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Flag className="h-3.5 w-3.5" />}
                  {state === "sending" ? "Sending…" : "Send report"}
                </button>
              </div>
            </div>

            {state === "error" && (
              <p role="alert" className="mt-2 text-[10px] font-semibold text-rose-600 dark:text-rose-400">
                Could not send the report — it has been saved locally and will retry automatically when you're online.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

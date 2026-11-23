import React, { useMemo, useState } from "react";
import {
  Check,
  CheckCircle2,
  GripVertical,
  MousePointerClick,
  RotateCcw,
  XCircle,
} from "lucide-react";
import type { InteractiveLesson } from "../lib/data/interactive-lessons";

/**
 * Drag-the-word gap fill built from the lesson's [[hidden terms]].
 *
 * Two extra decoy words are added to the bank, so a student cannot simply
 * place every tile by elimination — they have to know which word belongs in
 * which gap.
 */

interface Gap {
  id: string;
  answer: string;
}

interface Segment {
  kind: "text" | "term" | "blank";
  value: string;
  gapId?: string;
}

interface ParsedConcept {
  id: string;
  lead: string;
  segments: Segment[];
}

const MAX_GAPS = 12;
const MAX_GAPS_PER_CONCEPT = 3;
const MIN_DECOY_COUNT = 5;

const DECOY_POOL = [
  "opportunity cost",
  "cash flow",
  "market share",
  "interest rate",
  "brand image",
  "supplier",
  "revenue",
  "profit margin",
  "motivation",
  "quality control",
  "break-even",
  "liquidity",
  "stakeholder",
  "added value",
  "division of labour",
  "fixed costs",
  "variable costs",
  "customer loyalty",
  "net profit",
  "market research",
  "sole trader",
  "unlimited liability",
  "limited liability",
  "economies of scale",
  "span of control",
  "chain of command",
  "autocratic",
  "democratic",
  "job rotation",
  "job enrichment",
  "piece rates",
  "price skimming",
  "penetration pricing",
  "focus group",
  "batch production",
  "flow production",
  "lean production",
  "working capital",
  "acid test",
  "appreciation",
  "depreciation",
  "import tariff",
  "import quota",
  "pressure group",
];

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const result = [...items];
  let state = seed || 1;
  for (let i = result.length - 1; i > 0; i--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function splitText(text: string): Array<{ kind: "text" | "term"; value: string }> {
  const parts: Array<{ kind: "text" | "term"; value: string }> = [];
  const pattern = /\[\[([^\]]+)\]\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ kind: "text", value: text.slice(lastIndex, match.index) });
    }
    parts.push({ kind: "term", value: match[1] });
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ kind: "text", value: text.slice(lastIndex) });
  }

  return parts;
}

function normalise(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

export function WordDropExercise({ lesson }: { lesson: InteractiveLesson }) {
  const { concepts, gaps, words, decoyCount } = useMemo(() => {
    const splitConcepts = lesson.concepts.map((concept) => ({
      concept,
      parts: splitText(concept.text),
    }));

    // Round-robin pass across all concept bullets so every bullet (1, 2, 3, 4, 5...) gets gaps evenly.
    const selectedTermIndices = splitConcepts.map(() => new Set<number>());
    const seenAnswers = new Set<string>();
    let budget = MAX_GAPS;

    for (let round = 0; round < MAX_GAPS_PER_CONCEPT && budget > 0; round += 1) {
      let pickedAnyThisRound = false;

      splitConcepts.forEach(({ parts }, conceptIdx) => {
        if (budget <= 0) return;

        let termIndex = 0;
        for (const part of parts) {
          if (part.kind !== "term") continue;
          const norm = normalise(part.value);
          if (!selectedTermIndices[conceptIdx].has(termIndex) && !seenAnswers.has(norm)) {
            selectedTermIndices[conceptIdx].add(termIndex);
            seenAnswers.add(norm);
            budget -= 1;
            pickedAnyThisRound = true;
            break;
          }
          termIndex += 1;
        }
      });

      if (!pickedAnyThisRound) break;
    }

    const builtGaps: Gap[] = [];
    const parsed: ParsedConcept[] = [];

    splitConcepts.forEach(({ concept, parts }, conceptIdx) => {
      let termIndex = 0;
      const segments: Segment[] = [];

      for (const part of parts) {
        if (part.kind === "text") {
          segments.push({ kind: "text", value: part.value });
          continue;
        }

        if (selectedTermIndices[conceptIdx].has(termIndex)) {
          const gap: Gap = { id: `${concept.id}-gap-${termIndex}`, answer: part.value };
          builtGaps.push(gap);
          segments.push({ kind: "blank", value: part.value, gapId: gap.id });
        } else {
          segments.push({ kind: "term", value: part.value });
        }

        termIndex += 1;
      }

      parsed.push({ id: concept.id, lead: concept.lead, segments });
    });

    const answers = builtGaps.map((gap) => gap.answer);
    const decoyTarget = Math.max(MIN_DECOY_COUNT, Math.ceil(builtGaps.length * 0.5));
    const availableDecoys = DECOY_POOL.filter(
      (word) => !answers.some((answer) => normalise(answer) === normalise(word)),
    );
    const decoys = seededShuffle(
      availableDecoys,
      hashString(`${lesson.id}-decoys`),
    ).slice(0, decoyTarget);

    const bank = seededShuffle([...answers, ...decoys], hashString(lesson.id));

    return { concepts: parsed, gaps: builtGaps, words: bank, decoyCount: decoys.length };
  }, [lesson]);

  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [dragOverGap, setDragOverGap] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const usedWords = new Set(Object.values(assignments).map(normalise));
  const filledCount = gaps.filter((gap) => assignments[gap.id]).length;
  const correctCount = checked
    ? gaps.filter((gap) => normalise(assignments[gap.id]) === normalise(gap.answer)).length
    : 0;

  const assign = (gapId: string, word: string) => {
    if (checked) return;
    setAssignments((current) => {
      const next: Record<string, string> = {};
      for (const [key, value] of Object.entries(current)) {
        if (normalise(value) !== normalise(word)) next[key] = value;
      }
      next[gapId] = word;
      return next;
    });
    setSelectedWord(null);
  };

  const clearGap = (gapId: string) => {
    if (checked) return;
    setAssignments((current) => {
      const next = { ...current };
      delete next[gapId];
      return next;
    });
  };

  const reset = () => {
    setAssignments({});
    setSelectedWord(null);
    setChecked(false);
  };

  if (gaps.length === 0) return null;

  return (
    <section
      className="border-t border-[var(--surface-line,#d4d9cf)] bg-[var(--surface-soft,#f6f4ed)]/55 p-5 dark:bg-[#121c16] sm:p-7"
      aria-labelledby={`worddrop-${lesson.id}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--surface-line,#d4d9cf)] bg-[var(--surface,#fffefa)] text-[var(--green,#203e32)] dark:border-[#3d5137] dark:bg-[#1a2915] dark:text-[#d4e6bd]">
            <GripVertical className="h-4 w-4" />
          </span>
          <div>
            <h3
              id={`worddrop-${lesson.id}`}
              className="font-academic-serif text-lg font-bold text-[var(--surface-text,#192e28)]"
            >
              Drag the words into the gaps
            </h3>
            <p className="mt-0.5 flex flex-wrap items-center gap-1 text-[11px] text-[var(--surface-muted,#4b5c54)]">
              <MousePointerClick className="h-3 w-3 shrink-0" />
              Drag a word, or tap a word then tap a gap. {decoyCount} extra words are decoys.
            </p>
          </div>
        </div>

        <span className="font-mono text-[11px] font-semibold tabular-nums text-[var(--surface-muted,#4b5c54)]">
          {checked ? `${correctCount}/${gaps.length} correct` : `${filledCount}/${gaps.length} filled`}
        </span>
      </div>

      <ol className="mt-4 space-y-3">
        {concepts.map((concept, index) => (
          <li key={concept.id} className="flex gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#cbd6c2] bg-white font-mono text-[10px] font-bold text-[#4f6944] dark:border-[#3d5137] dark:bg-[#1a2915] dark:text-[#c9dcb4]">
              {index + 1}
            </span>
            <p className="text-sm leading-8 text-[#33463d] dark:text-neutral-300">
              <span className="font-semibold text-[var(--ink,#192e28)] dark:text-white">
                {concept.lead}.{" "}
              </span>
              {concept.segments.map((segment, segmentIndex) => {
                if (segment.kind === "text") {
                  return (
                    <React.Fragment key={`${concept.id}-t-${segmentIndex}`}>
                      {segment.value}
                    </React.Fragment>
                  );
                }

                if (segment.kind === "term") {
                  return (
                    <span
                      key={`${concept.id}-w-${segmentIndex}`}
                      className="font-semibold text-[#4a6157] dark:text-neutral-200"
                    >
                      {segment.value}
                    </span>
                  );
                }

                const gapId = segment.gapId as string;
                const value = assignments[gapId];
                const isCorrect = checked && normalise(value) === normalise(segment.value);
                const isWrong = checked && Boolean(value) && !isCorrect;

                return (
                  <button
                    key={`${concept.id}-g-${segmentIndex}`}
                    type="button"
                    onClick={() => (value ? clearGap(gapId) : selectedWord && assign(gapId, selectedWord))}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDragOverGap(gapId);
                    }}
                    onDragLeave={() => setDragOverGap((current) => (current === gapId ? null : current))}
                    onDrop={(event) => {
                      event.preventDefault();
                      const word = event.dataTransfer.getData("text/plain");
                      if (word) assign(gapId, word);
                      setDragOverGap(null);
                    }}
                    aria-label={
                      value
                        ? `Gap filled with ${value}. Tap to remove.`
                        : `Empty gap for ${segment.value.length} characters. Tap to place the selected word.`
                    }
                    disabled={checked}
                    className={`mx-0.5 inline-flex min-h-7 min-w-[84px] translate-y-0.5 items-center justify-center rounded-md border px-2 align-baseline text-[13px] font-semibold transition-colors ${
                      checked
                        ? isCorrect
                          ? "border-[#5f8a4b] bg-[#e6f2dc] text-[#2f5323] dark:border-[#5f8a4b] dark:bg-[#1e3117] dark:text-[#cfe8bd]"
                          : isWrong
                            ? "border-[#b46a55] bg-[#f9e5de] text-[#7b3b2b] dark:border-[#8a4f3f] dark:bg-[#2d1a15] dark:text-[#efc6b8]"
                            : "border-dashed border-[#96a48f] bg-white text-[#879487] dark:border-[#5e7058] dark:bg-[#1e2922] dark:text-[#8fa18c]"
                        : value
                          ? "border-[#8ba577] bg-white text-[var(--ink,#192e28)] shadow-xs dark:border-[#4e6740] dark:bg-[#1c2b20] dark:text-white"
                          : dragOverGap === gapId
                            ? "border-[#203e32] bg-[#e4eeb2] text-[#213b30] dark:border-[#b9d3a3]"
                            : "border-dashed border-[#96a48f] bg-white/70 text-[#96a48f] hover:border-[#203e32] hover:bg-white dark:border-[#5e7058] dark:bg-[#1e2922] dark:text-[#8fa18c]"
                    }`}
                  >
                    {value ?? "drop here"}
                  </button>
                );
              })}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-5 rounded-xl border border-[#d7e2c9] bg-white p-3 dark:border-[#34452e] dark:bg-neutral-900">
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#5c7546] dark:text-[#bdd5a5]">
          Word bank
          <span className="normal-case tracking-normal opacity-70">
            — {words.length - usedWords.size} left
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {words.map((word) => {
            const isUsed = usedWords.has(normalise(word));
            const isSelected = selectedWord === word;

            return (
              <button
                key={word}
                type="button"
                draggable={!isUsed && !checked}
                onDragStart={(event) => {
                  event.dataTransfer.setData("text/plain", word);
                  event.dataTransfer.effectAllowed = "move";
                  setSelectedWord(word);
                }}
                onDragEnd={() => setSelectedWord(null)}
                onClick={() => {
                  if (isUsed || checked) return;
                  setSelectedWord((current) => (current === word ? null : word));
                }}
                disabled={isUsed || checked}
                className={`cursor-grab rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors active:cursor-grabbing ${
                  isUsed
                    ? "border-dashed border-[#d4d9cf] bg-[#f4f4ef] text-[#b3b8ae] line-through dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-600"
                    : isSelected
                      ? "border-[#203e32] bg-[#e4eeb2] text-[#213b30] ring-2 ring-[#203e32]/30 dark:border-[#b9d3a3] dark:text-[#dce9c8]"
                      : "border-[#b9c9a5] bg-[#f6f9ef] text-[#31502f] hover:bg-[#edf2e7] dark:border-[#4e6740] dark:bg-[#1a2915] dark:text-[#d4e6bd] dark:hover:bg-[#213522]"
                }`}
              >
                {word}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setChecked(true)}
          disabled={filledCount !== gaps.length || checked}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#203e32] px-3 py-1.5 text-xs font-bold text-[#e4eeb2] transition-colors hover:bg-[#1a332a] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#b9d3a3] dark:text-[#16281d]"
        >
          <Check className="h-3.5 w-3.5" />
          Check answers
        </button>

        <button
          type="button"
          onClick={reset}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#cbd6c2] bg-white px-3 py-1.5 text-xs font-semibold text-[#31502f] transition-colors hover:bg-[#edf2e7] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {checked ? "Try again" : "Clear"}
        </button>

        {checked && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold ${
              correctCount === gaps.length
                ? "bg-[#e6f2dc] text-[#2f5323] dark:bg-[#1e3117] dark:text-[#cfe8bd]"
                : "bg-[#f9e5de] text-[#7b3b2b] dark:bg-[#2d1a15] dark:text-[#efc6b8]"
            }`}
          >
            {correctCount === gaps.length ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                All gaps correct
              </>
            ) : (
              <>
                <XCircle className="h-3.5 w-3.5" />
                {gaps.length - correctCount} to fix — reset and retry
              </>
            )}
          </span>
        )}
      </div>

      {checked && correctCount !== gaps.length && (
        <p className="mt-2 text-[11px] text-[var(--muted,#4b5c54)] dark:text-neutral-400">
          Red gaps are wrong or empty. Press <strong>Try again</strong> to keep practising with the same words.
        </p>
      )}
    </section>
  );
}

"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  GraduationCap,
  Lightbulb,
  ListChecks,
  RotateCcw,
  Target,
  XCircle,
} from "lucide-react";
import type {
  InteractiveLesson,
  LessonSection,
  SelfAssessment,
} from "../lib/data/interactive-lessons";
import { formatCompletedDate, type LessonProgressEntry } from "../lib/lessons-progress";
import { WordDropExercise } from "./WordDropExercise";

interface InteractiveLessonCardProps {
  lesson: InteractiveLesson;
  section: LessonSection;
  progressEntry?: LessonProgressEntry;
  hints: Record<string, number[]>;
  onHint: (conceptId: string, totalTerms: number) => void;
  onHideConcept: (conceptId: string) => void;
  onToggleTerm: (conceptId: string, termIndex: number, totalTerms: number) => void;
  onResetLessonTerms: (conceptIds: string[]) => void;
  onRate: (lessonId: string, rating: SelfAssessment) => void;
  onPrevious: () => void;
  onNext: () => void;
  previousLesson?: InteractiveLesson;
  nextLesson?: InteractiveLesson;
  onOpenPractice: (sectionCode: string) => void;
  onOpenChecklist: () => void;
  positionInSection: number;
  totalInSection: number;
}

type ConceptToken =
  | { kind: "text"; value: string }
  | { kind: "term"; value: string };

const RATING_OPTIONS: Array<{
  value: SelfAssessment;
  label: string;
  description: string;
  activeClass: string;
  dotClass: string;
}> = [
  {
    value: "easy",
    label: "Easy",
    description: "I can explain it",
    activeClass:
      "border-[#a9bb8b] bg-[#edf2e7] text-[#2c4a28] dark:border-[#617b4d] dark:bg-[#1c2b18] dark:text-[#dce9c8]",
    dotClass: "bg-[#6e8b58]",
  },
  {
    value: "medium",
    label: "Medium",
    description: "Mostly clear",
    activeClass:
      "border-[#d8bd80] bg-[#faf1d7] text-[#6e5017] dark:border-[#7e693b] dark:bg-[#2c2514] dark:text-[#f0dca8]",
    dotClass: "bg-[#c49a4a]",
  },
  {
    value: "hard",
    label: "Hard",
    description: "Needs review",
    activeClass:
      "border-[#d7a596] bg-[#f7e7e1] text-[#7b3b2b] dark:border-[#7d5145] dark:bg-[#2d1c18] dark:text-[#efc6b8]",
    dotClass: "bg-[#b46a55]",
  },
];

const RATING_LABELS: Record<SelfAssessment, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

const COMMAND_WORD_GUIDANCE: Record<string, string> = {
  calculate:
    "Show the formula, substitute the figures, then state the unit or percentage.",
  explain: "Make a point, then develop it with a reason or consequence.",
  identify: "Name or state the correct answer — no development is needed.",
  recommend:
    "Make a decision and justify it with evidence from the scenario, weighing up the alternative.",
  evaluate:
    "Give both sides of the argument, then reach a supported judgement.",
  analyse: "Break the issue into parts and explain how they connect.",
  discuss: "Present both sides and support each with business reasoning.",
  justify: "Support your choice with evidence and compare it with the alternative.",
};

function splitConceptTokens(text: string): ConceptToken[] {
  const tokens: ConceptToken[] = [];
  const pattern = /\[\[([^\]]+)\]\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ kind: "text", value: text.slice(lastIndex, match.index) });
    }
    tokens.push({ kind: "term", value: match[1] });
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push({ kind: "text", value: text.slice(lastIndex) });
  }

  return tokens;
}

function hiddenTermDots(term: string): string {
  return "\u2022".repeat(Math.min(7, Math.max(3, Math.ceil(term.length / 2))));
}

export function InteractiveLessonCard({
  lesson,
  section,
  progressEntry,
  hints,
  onHint,
  onHideConcept,
  onToggleTerm,
  onResetLessonTerms,
  onRate,
  onPrevious,
  onNext,
  previousLesson,
  nextLesson,
  onOpenPractice,
  onOpenChecklist,
  positionInSection,
  totalInSection,
}: InteractiveLessonCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const parsedConcepts = useMemo(
    () =>
      lesson.concepts.map((concept) => {
        const tokens = splitConceptTokens(concept.text);
        return {
          ...concept,
          tokens,
          termCount: tokens.filter((token) => token.kind === "term").length,
        };
      }),
    [lesson],
  );

  const totalTerms = parsedConcepts.reduce((sum, concept) => sum + concept.termCount, 0);
  const revealedTerms = parsedConcepts.reduce((sum, concept) => {
    const validRevealed = (hints[concept.id] ?? []).filter(
      (idx) => idx >= 0 && idx < concept.termCount,
    );
    return sum + new Set(validRevealed).size;
  }, 0);
  const isCompleted = Boolean(progressEntry?.rating);
  const isCorrect = selectedOption === lesson.practice.correctIndex;
  const practiceHeadingId = `practice-heading-${lesson.id}`;
  const questionId = `practice-question-${lesson.id}`;

  return (
    <article
      id="lesson-reader"
      className="scroll-mt-24 flex flex-col"
      aria-labelledby={`lesson-title-${lesson.id}`}
    >
      {/* Sleek studio header band */}
      <header className="border-b border-[var(--surface-line,#d4d9cf)] px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] font-semibold text-[var(--surface-muted,#4b5c54)] tabular-nums">
            <span className="text-[var(--surface-accent,#203e32)] font-bold">
              Section {section.code} · Lesson {lesson.id}
            </span>
            <span aria-hidden="true">·</span>
            <span>0264 {lesson.syllabusCodes.join(", ")}</span>
            <span aria-hidden="true">·</span>
            <span>{lesson.chapter}</span>
            <span aria-hidden="true">·</span>
            <span>{lesson.minutes} min</span>
            <span aria-hidden="true">·</span>
            <span>
              {positionInSection}/{totalInSection} in section
            </span>
            {isCompleted && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 font-bold text-[#38532f] dark:text-[#d4e6bd]">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Completed ({RATING_LABELS[progressEntry!.rating]})
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onPrevious}
              disabled={!previousLesson}
              title={previousLesson ? `Previous: ${previousLesson.id} ${previousLesson.title}` : "First lesson"}
              className="study-pager-button disabled:opacity-35 disabled:cursor-not-allowed"
              aria-label="Previous lesson"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!nextLesson}
              title={nextLesson ? `Next: ${nextLesson.id} ${nextLesson.title}` : "Last lesson"}
              className="study-pager-button disabled:opacity-35 disabled:cursor-not-allowed"
              aria-label="Next lesson"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <h2
          id={`lesson-title-${lesson.id}`}
          className="mt-2 font-academic-serif text-2xl font-bold leading-tight tracking-tight text-[var(--surface-text,#192e28)] sm:text-[1.85rem]"
          style={{ textWrap: "balance" }}
        >
          {lesson.title}
        </h2>

        <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[var(--surface-muted,#4b5c54)]">
          <strong className="font-semibold text-[var(--surface-text,#192e28)]">
            Learning objective:
          </strong>{" "}
          {lesson.objective}
        </p>
      </header>

      {/* Two-column flush split matching Paper 1 Studio */}
      <div className="study-columns study-paper-one-columns">
        {/* LEFT: Concept Explanation */}
        <section
          className="study-case-panel p-5 sm:p-7"
          aria-labelledby={`concepts-${lesson.id}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--surface-line,#d4d9cf)]">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--surface-line,#d4d9cf)] bg-[var(--surface-practice,#edf2e7)] text-[var(--green,#203e32)] dark:text-[#d4e6bd]">
                <BookOpen className="h-4 w-4" />
              </span>
              <div>
                <h3
                  id={`concepts-${lesson.id}`}
                  className="font-academic-serif text-lg font-bold text-[var(--surface-text,#192e28)]"
                >
                  Concept explanation
                </h3>
                <p className="text-[11px] text-[var(--surface-muted,#4b5c54)]">
                  Use Hint or tap any blank to reveal terms; tap a shown term or Hide to quiz yourself.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-[11px] font-semibold tabular-nums text-[var(--surface-muted,#4b5c54)]">
                {revealedTerms}/{totalTerms} terms revealed
              </span>
              {totalTerms > 0 && (
                <button
                  type="button"
                  onClick={() => onResetLessonTerms(parsedConcepts.map((c) => c.id))}
                  disabled={revealedTerms === 0}
                  title={
                    revealedTerms === 0
                      ? "All terms in this lesson are already hidden"
                      : "Hide all revealed terms in this lesson to quiz yourself again"
                  }
                  className="inline-flex min-h-7 items-center gap-1 rounded-lg border border-[var(--surface-line,#d4d9cf)] bg-[var(--surface,#fffefa)] px-2.5 py-1 text-[11px] font-semibold text-[var(--surface-text,#192e28)] transition-colors hover:bg-[var(--surface-practice,#edf2e7)] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset all terms</span>
                </button>
              )}
            </div>
          </div>

          <ol className="mt-5 space-y-5">
            {parsedConcepts.map((concept, conceptIndex) => {
              const revealedSet = new Set(
                (hints[concept.id] ?? []).filter(
                  (idx) => idx >= 0 && idx < concept.termCount,
                ),
              );
              const revealed = revealedSet.size;
              const remaining = concept.termCount - revealed;
              const step = Math.max(1, Math.ceil(concept.termCount * 0.25));
              let termCursor = 0;

              return (
                <li key={concept.id} className="relative flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[var(--surface-line,#d4d9cf)] bg-[var(--surface-practice,#edf2e7)] font-mono text-[10px] font-bold text-[#35512e] dark:text-[#c9dcb4]">
                    {conceptIndex + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
                      <h4 className="font-academic-serif text-[15.5px] font-bold leading-snug text-[var(--surface-text,#192e28)]">
                        {concept.lead}
                      </h4>

                      {concept.termCount > 0 && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          {remaining > 0 ? (
                            <>
                              <button
                                type="button"
                                onClick={() => onHint(concept.id, concept.termCount)}
                                title={`Reveal ${Math.min(step, remaining)} more hidden term${Math.min(step, remaining) === 1 ? "" : "s"}`}
                                className="inline-flex min-h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--green,#203e32)] bg-[var(--surface,#fffefa)] px-2.5 py-1 text-[11px] font-semibold text-[var(--green,#203e32)] whitespace-nowrap transition-colors hover:bg-[var(--surface-practice,#edf2e7)] dark:border-[#b9d3a3] dark:text-[#d4e6bd]"
                                aria-label={`Hint: reveal ${Math.min(step, remaining)} of ${remaining} hidden terms`}
                              >
                                <Eye className="h-3 w-3" />
                                <span>Hint</span>
                                <span className="font-mono text-[10px] opacity-75 tabular-nums">
                                  {revealed}/{concept.termCount}
                                </span>
                              </button>
                              {revealed > 0 && (
                                <button
                                  type="button"
                                  onClick={() => onHideConcept(concept.id)}
                                  title="Hide revealed terms in this bullet to quiz yourself again"
                                  className="inline-flex min-h-7 shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-[var(--surface-line,#d4d9cf)] bg-[var(--surface-soft,#f6f4ed)] px-2 py-1 text-[11px] font-semibold text-[var(--surface-muted,#4b5c54)] whitespace-nowrap transition-colors hover:bg-[var(--surface-practice,#edf2e7)] hover:text-[var(--surface-text,#192e28)]"
                                  aria-label="Hide revealed terms in this bullet"
                                >
                                  <EyeOff className="h-3 w-3" />
                                  <span>Hide</span>
                                </button>
                              )}
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onHideConcept(concept.id)}
                              title="Hide all terms in this bullet to quiz yourself again"
                              className="inline-flex min-h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--surface-line,#d4d9cf)] bg-[var(--surface-practice,#edf2e7)] px-2.5 py-1 text-[11px] font-semibold text-[#38532f] whitespace-nowrap transition-colors hover:border-[#203e32] hover:bg-[#e4eeb2]/55 dark:text-[#d4e6bd]"
                              aria-label="Hide all revealed terms in this bullet"
                            >
                              <EyeOff className="h-3 w-3" />
                              <span>Hide</span>
                              <span className="font-mono text-[10px] opacity-75 tabular-nums">
                                {revealed}/{concept.termCount}
                              </span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <p className="mt-1.5 text-[14.5px] leading-7 text-[#33463d] dark:text-neutral-200">
                      {concept.tokens.map((token, tokenIndex) => {
                        if (token.kind === "text") {
                          return (
                            <React.Fragment key={`${concept.id}-text-${tokenIndex}`}>
                              {token.value}
                            </React.Fragment>
                          );
                        }

                        const currentTermIndex = termCursor;
                        const isRevealed = revealedSet.has(currentTermIndex);
                        termCursor += 1;

                        if (isRevealed) {
                          return (
                            <button
                              key={`${concept.id}-term-${tokenIndex}`}
                              type="button"
                              onClick={() =>
                                onToggleTerm(concept.id, currentTermIndex, concept.termCount)
                              }
                              title="Click to hide this term again"
                              aria-label={`Hide term: ${token.value}`}
                              className="mx-0.5 inline cursor-pointer rounded align-baseline bg-transparent p-0 text-left"
                            >
                              <mark className="lesson-revealed-term rounded bg-[#e4eeb2] px-1.5 py-0.5 font-semibold text-[#213b30] transition-colors hover:bg-[#d8e69a] [box-decoration-break:clone]">
                                {token.value}
                              </mark>
                            </button>
                          );
                        }

                        return (
                          <button
                            key={`${concept.id}-term-${tokenIndex}`}
                            type="button"
                            onClick={() =>
                              onToggleTerm(concept.id, currentTermIndex, concept.termCount)
                            }
                            className="mx-0.5 inline-flex cursor-pointer select-none items-center justify-center rounded border-b-2 border-dashed border-[#96a48f] bg-[#f0f2e9] px-1.5 align-baseline font-mono text-[11px] leading-5 tracking-[0.16em] text-[#879487] transition-colors hover:border-[#203e32] hover:bg-[#e8ece0] hover:text-[#203e32] dark:border-[#5e7058] dark:bg-[#1e2922] dark:text-[#8fa18c] dark:hover:border-[#b9d3a3] dark:hover:text-[#dce9c8]"
                            title="Hidden term — click or use Hint to reveal"
                          >
                            <span aria-hidden="true">{hiddenTermDots(token.value)}</span>
                            <span className="sr-only">Reveal hidden term</span>
                          </button>
                        );
                      })}
                    </p>

                    {concept.note && (
                      <p className="mt-2 flex gap-2 text-xs leading-relaxed text-[var(--surface-muted,#4b5c54)]">
                        <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#a3701f] dark:text-[#e1b969]" />
                        <span>{concept.note}</span>
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-6 rounded-xl border border-[var(--surface-line,#d4d9cf)] bg-[var(--surface-practice,#edf2e7)] p-4">
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#4f6944] dark:text-[#bdd5a5]">
              <GraduationCap className="h-3.5 w-3.5" />
              Exam tip
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--surface-text,#192e28)]">
              {lesson.examTip}
            </p>
          </div>
        </section>

        {/* RIGHT: Practice It Now */}
        <section
          className="study-paper-one-editor bg-[var(--surface-practice,#edf2e7)]/70 p-5 dark:bg-[#15221b] sm:p-7"
          aria-labelledby={practiceHeadingId}
        >
          <div className="lg:sticky lg:top-24">
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-[var(--surface-line,#d4d9cf)]">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--surface-line,#d4d9cf)] bg-[var(--surface,#fffefa)] text-[#31502f] dark:text-[#d4e6bd]">
                  <Target className="h-4 w-4" />
                </span>
                <div>
                  <h3
                    id={practiceHeadingId}
                    className="font-academic-serif text-lg font-bold text-[var(--surface-text,#192e28)]"
                  >
                    Practice it now
                  </h3>
                  <p className="text-[11px] text-[var(--surface-muted,#4b5c54)]">
                    Apply the concept to a business scenario.
                  </p>
                </div>
              </div>

              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--surface-accent,#203e32)]">
                {lesson.practice.commandWord}
              </span>
            </div>

            <div className="mt-4 rounded-xl border border-[var(--surface-line,#d4d9cf)] bg-[var(--surface,#fffefa)] p-4">
              <p className="text-sm leading-relaxed text-[#33463d] dark:text-neutral-200">
                {lesson.practice.scenario}
              </p>
            </div>

            <h4
              id={questionId}
              className="mt-4 font-academic-serif text-base font-bold leading-snug text-[var(--surface-text,#192e28)] sm:text-[1.0625rem]"
            >
              {lesson.practice.question}
            </h4>

            <div
              className="mt-3 space-y-2"
              role="group"
              aria-labelledby={questionId}
            >
              {lesson.practice.options.map((option, optionIndex) => {
                const isSelected = selectedOption === optionIndex;
                const isThisCorrect = optionIndex === lesson.practice.correctIndex;
                const optionState = !isSelected
                  ? "border-[var(--surface-line,#d4d9cf)] bg-[var(--surface,#fffefa)] text-[#33463d] hover:border-[#203e32] hover:bg-[#f7faf1] dark:text-neutral-200 dark:hover:border-[#b9d3a3] dark:hover:bg-[#1b281f]"
                  : isThisCorrect
                    ? "border-[#7e9b67] bg-[#f3f8ec] text-[#2d4a26] ring-1 ring-[#a9bb8b] dark:border-[#7e9b67] dark:bg-[#1d2b18] dark:text-[#e0eccb]"
                    : "border-[#c58f80] bg-[#fdf1ed] text-[#74392b] ring-1 ring-[#d7a596] dark:border-[#8b5a4b] dark:bg-[#2b1b17] dark:text-[#f0c8ba]";

                return (
                  <button
                    key={`${lesson.id}-option-${optionIndex}`}
                    type="button"
                    onClick={() => setSelectedOption(optionIndex)}
                    aria-pressed={isSelected}
                    className={`flex w-full cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-left text-sm leading-snug transition-colors ${optionState}`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border font-mono text-[10px] font-bold ${
                        isSelected
                          ? isThisCorrect
                            ? "border-[#7e9b67] bg-[#203e32] text-[#e4eeb2]"
                            : "border-[#c58f80] bg-[#b46a55] text-white"
                          : "border-[var(--surface-line,#d4d9cf)] bg-[var(--surface-soft,#f6f4ed)] text-[#5c6e63] dark:text-neutral-300"
                      }`}
                    >
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                    <span className="min-w-0 flex-1 pt-0.5">{option}</span>
                    {isSelected &&
                      (isThisCorrect ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#5d7d48]" />
                      ) : (
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#b46a55]" />
                      ))}
                  </button>
                );
              })}
            </div>

            {selectedOption === null ? (
              <p className="mt-3 flex items-center gap-1.5 text-[11px] text-[var(--surface-muted,#4b5c54)]">
                <ListChecks className="h-3.5 w-3.5" />
                Choose an answer to check your reasoning.
              </p>
            ) : (
              <div
                className={`mt-3 rounded-xl border p-3.5 ${
                  isCorrect
                    ? "border-[#b9cdab] bg-[#f4f9ee] dark:border-[#4e6740] dark:bg-[#1a2918]"
                    : "border-[#d9bcb3] bg-[#fcf2ee] dark:border-[#7d5145] dark:bg-[#2a1b17]"
                }`}
                role="status"
                aria-live="polite"
              >
                <div
                  className={`flex items-center gap-1.5 text-xs font-bold ${
                    isCorrect
                      ? "text-[#35522d] dark:text-[#cfe2b8]"
                      : "text-[#7b3b2b] dark:text-[#efc6b8]"
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  {isCorrect ? "Correct — well reasoned." : "Not quite — check the explanation."}
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-[#3b4d42] dark:text-neutral-200">
                  {lesson.practice.explanation}
                </p>

                <details className="group mt-3 rounded-lg border border-[var(--surface-line,#d4d9cf)] bg-[var(--surface,#fffefa)]/80 px-3 py-2">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-[11px] font-bold text-[#415a34] dark:text-[#cfe2b8] [&::-webkit-details-marker]:hidden">
                    <span>View model answer</span>
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-2 text-xs leading-relaxed text-[#3b4d42] dark:text-neutral-200">
                    {lesson.practice.modelAnswer}
                  </p>
                </details>

                <button
                  type="button"
                  onClick={() => setSelectedOption(null)}
                  className="mt-2.5 cursor-pointer text-[11px] font-semibold text-[var(--surface-muted,#4b5c54)] underline decoration-dotted underline-offset-2 hover:text-[var(--surface-text,#192e28)]"
                >
                  Clear answer and try again
                </button>
              </div>
            )}

            <div className="mt-4 rounded-xl border border-[var(--surface-line,#d4d9cf)] bg-[var(--surface,#fffefa)]/75 p-3.5">
              <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#5c7546] dark:text-[#bdd5a5]">
                <GraduationCap className="h-3.5 w-3.5" />
                Command word coach
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-[#3b4d42] dark:text-neutral-200">
                <strong className="font-bold text-[var(--surface-text,#192e28)]">
                  {lesson.practice.commandWord}:
                </strong>{" "}
                {COMMAND_WORD_GUIDANCE[lesson.practice.commandWord.toLowerCase()] ??
                  "Read the command word carefully, then structure your answer to match what it asks you to do."}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Drag-the-word gap fill with decoy words */}
      <WordDropExercise lesson={lesson} />

      {/* Confidence self-assessment */}
      <footer className="border-t border-[var(--surface-line,#d4d9cf)] p-5 sm:p-7">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--surface-line,#d4d9cf)] bg-[var(--surface-practice,#edf2e7)] text-[#31502f] dark:text-[#d4e6bd]">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <h3 className="font-academic-serif text-lg font-bold text-[var(--surface-text,#192e28)]">
                How confident are you?
              </h3>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-[var(--surface-muted,#4b5c54)]">
              Rate this lesson to mark it complete. You can change your rating at any time.
            </p>
            {progressEntry && (
              <p className="mt-1 font-mono text-[11px] font-semibold text-[#557247] dark:text-[#bdd5a5]">
                Completed {formatCompletedDate(progressEntry.completedAt)} · rated{" "}
                {RATING_LABELS[progressEntry.rating]}
              </p>
            )}
          </div>

          <div
            className="grid w-full grid-cols-3 gap-2 xl:max-w-[430px]"
            role="group"
            aria-label="Lesson confidence rating"
          >
            {RATING_OPTIONS.map((option) => {
              const isActive = progressEntry?.rating === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onRate(lesson.id, option.value)}
                  aria-pressed={isActive}
                  className={`group flex cursor-pointer flex-col items-center gap-0.5 rounded-xl border px-2 py-2.5 text-center transition-colors ${
                    isActive
                      ? option.activeClass
                      : "border-[var(--surface-line,#d4d9cf)] bg-[var(--surface,#fffefa)] text-[var(--surface-muted,#4b5c54)] hover:border-[#aab7a3] hover:bg-[var(--surface-practice,#edf2e7)]/50"
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-sm font-bold">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${isActive ? option.dotClass : "bg-[#b9c2b5] dark:bg-neutral-600"}`}
                    />
                    {option.label}
                    {isActive && <Check className="h-3 w-3" />}
                  </span>
                  <span className="text-[10px] leading-tight opacity-80">
                    {option.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </footer>

      {/* Lesson navigation and cross-links */}
      <div className="flex flex-col gap-3 border-t border-[var(--surface-line,#d4d9cf)] bg-[var(--surface-soft,#f6f4ed)]/50 px-5 py-4 dark:bg-[#111a16] sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevious}
            disabled={!previousLesson}
            title={previousLesson ? `Previous: ${previousLesson.id} ${previousLesson.title}` : undefined}
            className="study-action study-secondary-action disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!nextLesson}
            title={nextLesson ? `Next: ${nextLesson.id} ${nextLesson.title}` : undefined}
            className="study-action study-secondary-action disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span>Next</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenPractice(section.code)}
            className="study-action btn-primary"
          >
            <Target className="h-3.5 w-3.5" />
            <span>Practice Section {section.code}</span>
          </button>
          <button
            type="button"
            onClick={onOpenChecklist}
            className="study-action study-secondary-action"
          >
            <ListChecks className="h-3.5 w-3.5" />
            <span>Syllabus checklist</span>
          </button>
        </div>
      </div>
    </article>
  );
}

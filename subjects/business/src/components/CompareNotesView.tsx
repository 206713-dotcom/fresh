"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  COMPARE_NOTES,
  COMPARE_SECTION_LABELS,
  CompareNote,
} from "../lib/data/compare-notes";
import { REVISION_SUMMARIES } from "../lib/data/revision-summaries";

const SECTIONS = ["1", "2", "3", "4", "5", "6"] as const;

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong
            key={index}
            className="font-semibold text-[#0F2042] dark:text-white"
          >
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

function displayName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/** Return roughly the first quarter of the words in an answer point. */
function firstQuarterHint(text: string): string {
  const plain = text.replace(/\*\*/g, "").trim();
  if (!plain) return "";
  const words = plain.split(/\s+/);
  const count = Math.max(1, Math.ceil(words.length * 0.25));
  return words.slice(0, count).join(" ");
}

/**
 * Complete, untruncated rendering of the 3 sub-sections under each topic in the Notes View:
 * 1. Purpose block (Blue container)
 * 2. Advantages block (Green container)
 * 3. Disadvantages block (Red container)
 */
function TopicContentBlocks({ note }: { note: CompareNote }) {
  const title = displayName(note.name);
  return (
    <div className="space-y-4">
      {/* 1. Purpose block (Blue container) */}
      <section className="rounded-xl border border-sky-200 dark:border-sky-900/70 bg-sky-50/70 dark:bg-sky-950/20 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3 border-b border-sky-200/60 dark:border-sky-900/60 pb-2">
          <h4 className="text-sm font-bold text-sky-900 dark:text-sky-300 flex items-center gap-2">
            <span>🎯</span>
            <span>Purpose of {title}</span>
          </h4>
          <span className="text-[10px] font-mono text-sky-700 dark:text-sky-400 font-semibold">
            {note.purpose.length} {note.purpose.length === 1 ? "point" : "points"}
          </span>
        </div>
        <ul className="space-y-2.5">
          {note.purpose.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-[#292524] dark:text-neutral-200"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600 dark:bg-sky-400" />
              <div className="flex-1 min-w-0">
                <RichText text={item} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 2. Advantages block (Green container) */}
      <section className="rounded-xl border border-emerald-200 dark:border-emerald-900/70 bg-emerald-50/70 dark:bg-emerald-950/20 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3 border-b border-emerald-200/60 dark:border-emerald-900/60 pb-2">
          <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
            <span>✅</span>
            <span>Advantages of {title}</span>
          </h4>
          <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
            {note.advantages.length} {note.advantages.length === 1 ? "point" : "points"}
          </span>
        </div>
        <ul className="space-y-2.5">
          {note.advantages.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-[#292524] dark:text-neutral-200"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              <div className="flex-1 min-w-0">
                <RichText text={item} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. Disadvantages block (Red container) */}
      <section className="rounded-xl border border-rose-200 dark:border-rose-900/70 bg-rose-50/70 dark:bg-rose-950/20 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3 border-b border-rose-200/60 dark:border-rose-900/60 pb-2">
          <h4 className="text-sm font-bold text-rose-900 dark:text-rose-300 flex items-center gap-2">
            <span>⚠️</span>
            <span>Disadvantages of {title}</span>
          </h4>
          <span className="text-[10px] font-mono text-rose-700 dark:text-rose-400 font-semibold">
            {note.disadvantages.length} {note.disadvantages.length === 1 ? "point" : "points"}
          </span>
        </div>
        <ul className="space-y-2.5">
          {note.disadvantages.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-[#292524] dark:text-neutral-200"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-600 dark:bg-rose-400" />
              <div className="flex-1 min-w-0">
                <RichText text={item} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function NoteCard({ note }: { note: CompareNote }) {
  const title = displayName(note.name);
  return (
    <article className="rounded-2xl border border-[#E7E5E4] dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-xs overflow-hidden">
      <header className="px-5 py-3.5 border-b border-[#E7E5E4] dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2 bg-[#FAF9F6] dark:bg-neutral-900/60">
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-[#0F2042] text-white dark:bg-white dark:text-black">
            Topic {note.topic}
          </span>
          <h3 className="font-academic-serif text-lg sm:text-xl font-bold text-[#0F2042] dark:text-white">
            {title}
          </h3>
        </div>
      </header>

      <div className="p-5">
        <TopicContentBlocks note={note} />
      </div>

      {note.uses && note.uses.length > 0 && (
        <details className="border-t border-[#E7E5E4] dark:border-neutral-800 bg-[#F8F7F4] dark:bg-neutral-900">
          <summary className="cursor-pointer px-5 py-3 text-sm font-semibold text-[#0F2042] dark:text-white hover:text-blue-600 dark:hover:text-sky-300">
            How to recommend and justify {title} (Exam Technique)
          </summary>
          <div className="px-5 pb-4">
            <ul className="space-y-2">
              {note.uses.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm leading-relaxed text-[#44403C] dark:text-neutral-300"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                  <div className="flex-1 min-w-0">
                    <RichText text={item} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </details>
      )}
    </article>
  );
}

type Recall = "easy" | "medium" | "hard";

const RECALL_KEY = "ecbiz_recall_ratings";

const RECALL_COLUMNS: { id: Recall; label: string; hint: string; head: string; cell: string }[] = [
  {
    id: "easy",
    label: "Easy",
    hint: "I can recall this",
    head: "bg-emerald-700 text-white",
    cell: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    id: "medium",
    label: "Medium",
    hint: "I remember some of it",
    head: "bg-amber-600 text-white",
    cell: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    id: "hard",
    label: "Hard",
    hint: "I need to revise this",
    head: "bg-rose-700 text-white",
    cell: "bg-rose-50 dark:bg-rose-950/30",
  },
];

function loadRatings(): Record<string, Recall> {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(localStorage.getItem(RECALL_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

type FlashcardKind = "purpose" | "advantages" | "disadvantages";

interface SplitFlashcard {
  id: string;
  noteId: string;
  section: CompareNote["section"];
  topic: string;
  name: string;
  kind: FlashcardKind;
  questionTitle: string;
  kindLabel: string;
  colorTheme: {
    badge: string;
    border: string;
    bg: string;
    text: string;
    dot: string;
  };
  items: string[];
}

/**
 * Deconstruct each topic note into 3 individual, focused flashcards:
 * - Card A: Purpose of [Topic Name]
 * - Card B: Advantages of [Topic Name]
 * - Card C: Disadvantages of [Topic Name]
 */
function buildSplitFlashcards(notes: CompareNote[]): SplitFlashcard[] {
  const cards: SplitFlashcard[] = [];
  for (const note of notes) {
    const title = displayName(note.name);

    // Card A: Purpose
    cards.push({
      id: `${note.id}-purpose`,
      noteId: note.id,
      section: note.section,
      topic: note.topic,
      name: note.name,
      kind: "purpose",
      questionTitle: `Purpose of ${title}`,
      kindLabel: "Purpose",
      colorTheme: {
        badge:
          "bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-300 dark:border-sky-800",
        border: "border-sky-300 dark:border-sky-800",
        bg: "bg-sky-50/70 dark:bg-sky-950/25",
        text: "text-sky-900 dark:text-sky-300",
        dot: "bg-sky-600 dark:bg-sky-400",
      },
      items: note.purpose,
    });

    // Card B: Advantages
    cards.push({
      id: `${note.id}-advantages`,
      noteId: note.id,
      section: note.section,
      topic: note.topic,
      name: note.name,
      kind: "advantages",
      questionTitle: `Advantages of ${title}`,
      kindLabel: "Advantages",
      colorTheme: {
        badge:
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800",
        border: "border-emerald-300 dark:border-emerald-800",
        bg: "bg-emerald-50/70 dark:bg-emerald-950/25",
        text: "text-emerald-900 dark:text-emerald-300",
        dot: "bg-emerald-600 dark:bg-emerald-400",
      },
      items: note.advantages,
    });

    // Card C: Disadvantages
    cards.push({
      id: `${note.id}-disadvantages`,
      noteId: note.id,
      section: note.section,
      topic: note.topic,
      name: note.name,
      kind: "disadvantages",
      questionTitle: `Disadvantages of ${title}`,
      kindLabel: "Disadvantages",
      colorTheme: {
        badge:
          "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800",
        border: "border-rose-300 dark:border-rose-800",
        bg: "bg-rose-50/70 dark:bg-rose-950/25",
        text: "text-rose-900 dark:text-rose-300",
        dot: "bg-rose-600 dark:bg-rose-400",
      },
      items: note.disadvantages,
    });
  }
  return cards;
}

function RecallFlashcards({ section }: { section: CompareNote["section"] }) {
  const notes = useMemo(
    () => COMPARE_NOTES.filter((note) => note.section === section),
    [section],
  );

  const cards = useMemo(() => buildSplitFlashcards(notes), [notes]);

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showFrontHint, setShowFrontHint] = useState(false);
  const [ratings, setRatings] = useState<Record<string, Recall>>(() => loadRatings());

  useEffect(() => {
    setIndex(0);
    setFlipped(false);
    setShowFrontHint(false);
  }, [section]);

  const currentCard = cards[index] ?? cards[0];

  const rate = (level: Recall) => {
    if (!currentCard) return;
    const next = { ...ratings, [currentCard.id]: level };
    setRatings(next);
    localStorage.setItem(RECALL_KEY, JSON.stringify(next));
    setFlipped(false);
    setShowFrontHint(false);
    setIndex((current) => (current + 1) % Math.max(cards.length, 1));
  };

  const openCard = (id: string) => {
    const position = cards.findIndex((c) => c.id === id);
    if (position >= 0) {
      setIndex(position);
      setFlipped(true);
      setShowFrontHint(false);
    }
  };

  return (
    <div>
      {currentCard && (
        <div className="max-w-2xl mx-auto">
          {/* Top Bar: Flashcard Index Counter (e.g. Card 1 of 27) and Navigation */}
          <div className="flex items-center justify-between text-xs text-[#78716C] dark:text-neutral-400 mb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIndex((prev) => (prev > 0 ? prev - 1 : cards.length - 1));
                  setFlipped(false);
                  setShowFrontHint(false);
                }}
                className="px-2.5 py-1 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-[11px] font-semibold cursor-pointer shadow-2xs"
              >
                ← Prev
              </button>
              <span className="font-mono font-bold text-[#0F2042] dark:text-white px-1">
                Card {index + 1} of {cards.length}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIndex((prev) => (prev + 1) % cards.length);
                  setFlipped(false);
                  setShowFrontHint(false);
                }}
                className="px-2.5 py-1 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-[11px] font-semibold cursor-pointer shadow-2xs"
              >
                Next →
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 font-bold text-[#0F2042] dark:text-[#38BDF8]">
                Topic {currentCard.topic}
              </span>
              <span
                className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${currentCard.colorTheme.badge}`}
              >
                {currentCard.kindLabel}
              </span>
            </div>
          </div>

          {/* Main Flashcard Box Shell */}
          <div
            onClick={() => {
              if (!flipped) {
                setFlipped(true);
              }
            }}
            className={`w-full text-left rounded-3xl border transition-all ${
              flipped
                ? `${currentCard.colorTheme.border} bg-white dark:bg-neutral-950`
                : "border-[#E7E5E4] dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-[#0F2042] dark:hover:border-[#38BDF8] cursor-pointer"
            } shadow-sm min-h-[320px] p-6 sm:p-8 flex flex-col justify-between`}
          >
            {!flipped ? (
              /* FRONT SIDE: Recall Prompt View with Hint Button in Bottom-Left Corner */
              <>
                {/* Top Badge within Card Box */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#8B1E1E] text-white">
                    Recall This Term
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-[#78716C] dark:text-neutral-400">
                    Topic {currentCard.topic}
                  </span>
                </div>

                {/* Center Recall Prompt Content */}
                <div className="flex-1 flex flex-col items-center justify-center text-center py-6 sm:py-8">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#78716C] dark:text-neutral-400 mb-1">
                    {currentCard.name}
                  </span>
                  <h2 className="font-academic-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F2042] dark:text-white mt-1 mb-3">
                    {currentCard.questionTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#78716C] dark:text-neutral-400 max-w-md leading-relaxed">
                    {currentCard.kind === "purpose" &&
                      "What is the core role, definition, or primary objective of this term in business?"}
                    {currentCard.kind === "advantages" &&
                      "What are the key benefits, strategic upsides, or cost advantages?"}
                    {currentCard.kind === "disadvantages" &&
                      "What are the main drawbacks, operational limitations, or financial risks?"}
                  </p>

                  {/* Dynamic Clue Reveal if Hint is toggled on front */}
                  {showFrontHint && (
                    <div className="mt-4 p-3.5 rounded-xl border border-amber-300 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/40 text-left max-w-md w-full shadow-2xs">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200 mb-1">
                        <span>💡</span>
                        <span>First Point Clue</span>
                      </div>
                      <p className="text-xs text-amber-950 dark:text-amber-100 font-medium leading-relaxed">
                        Starts with: &ldquo;{firstQuarterHint(currentCard.items[0])}…&rdquo;
                      </p>
                      <p className="text-[10px] text-amber-800 dark:text-amber-300 mt-1">
                        ({currentCard.items.length} total points on back of card)
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Row Inside Card: Hint button strictly anchored in bottom-left */}
                <div className="pt-3 border-t border-slate-100 dark:border-neutral-900 flex items-center justify-between gap-3">
                  {/* Hint Button in Bottom-Left Corner inside the main card box */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowFrontHint((prev) => !prev);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 text-xs font-mono font-bold text-amber-900 dark:text-amber-200 transition-colors shadow-2xs cursor-pointer"
                    title="Reveal a clue before flipping"
                  >
                    <span>💡</span>
                    <span>{showFrontHint ? "Hide Hint" : "Hint"}</span>
                  </button>

                  <span className="text-[11px] font-mono text-[#78716C] dark:text-neutral-500">
                    Tap anywhere on card to flip ↵
                  </span>
                </div>
              </>
            ) : (
              /* BACK SIDE: Focused Answer Rendering for the Single Sub-Topic */
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-3 border-slate-100 dark:border-neutral-900">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${currentCard.colorTheme.badge}`}
                      >
                        {currentCard.kindLabel}
                      </span>
                      <span className="text-[10px] font-mono text-[#78716C] dark:text-neutral-400">
                        Topic {currentCard.topic}
                      </span>
                    </div>
                    <h2 className="font-academic-serif text-xl sm:text-2xl font-bold text-[#0F2042] dark:text-white">
                      {currentCard.questionTitle}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setFlipped(false);
                      setShowFrontHint(false);
                    }}
                    className="shrink-0 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-[#57534E] dark:text-neutral-300 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 cursor-pointer shadow-2xs"
                  >
                    Flip back
                  </button>
                </div>

                {/* Themed Answer Container for the Active Sub-Card */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl border ${currentCard.colorTheme.border} ${currentCard.colorTheme.bg}`}
                >
                  <div className="flex items-center justify-between mb-3 border-b border-black/5 dark:border-white/10 pb-2">
                    <h3 className={`text-sm font-bold ${currentCard.colorTheme.text}`}>
                      Key {currentCard.kindLabel} Points
                    </h3>
                    <span className="text-[10px] font-mono opacity-80">
                      {currentCard.items.length} {currentCard.items.length === 1 ? "point" : "points"}
                    </span>
                  </div>

                  <ul className="space-y-2.5">
                    {currentCard.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-[#292524] dark:text-neutral-200"
                      >
                        <span
                          className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${currentCard.colorTheme.dot}`}
                        />
                        <div className="flex-1 min-w-0">
                          <RichText text={item} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Self-Assessment Rating Controls (Easy / Medium / Hard) */}
          <div className="mt-4">
            <p className="text-sm font-medium text-[#0F2042] dark:text-neutral-200 mb-2">
              {flipped
                ? `How well did you remember ${currentCard.questionTitle}?`
                : "Turn the card over, then rate how well you remembered it:"}
            </p>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {RECALL_COLUMNS.map((column) => (
                <button
                  key={column.id}
                  type="button"
                  onClick={() => rate(column.id)}
                  disabled={!flipped}
                  className={`px-3 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs text-center ${column.head}`}
                >
                  <div className="font-bold">{column.label}</div>
                  <span className="block text-[10px] font-normal opacity-90 mt-0.5">
                    {column.hint}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recall Table by Rating */}
      <div className="mt-8 overflow-x-auto max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-academic-serif text-base font-bold text-[#0F2042] dark:text-white">
            Your Revision Progress
          </h3>
          <span className="text-xs font-mono text-[#78716C] dark:text-neutral-400">
            Section {section} · {cards.length} Total Flashcards
          </span>
        </div>
        <table className="w-full border-collapse text-sm rounded-xl overflow-hidden border border-[#E7E5E4] dark:border-neutral-800">
          <thead>
            <tr>
              {RECALL_COLUMNS.map((column) => (
                <th key={column.id} className={`px-3.5 py-2.5 text-left font-semibold ${column.head}`}>
                  <div className="flex items-center justify-between">
                    <span>{column.label}</span>
                    <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-black/20 text-white font-bold">
                      {cards.filter((item) => ratings[item.id] === column.id).length}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="align-top">
              {RECALL_COLUMNS.map((column) => {
                const matchingCards = cards.filter((item) => ratings[item.id] === column.id);
                return (
                  <td
                    key={column.id}
                    className={`px-3.5 py-3 border border-[#E7E5E4] dark:border-neutral-800 ${column.cell}`}
                  >
                    {matchingCards.length === 0 ? (
                      <p className="text-xs text-[#78716C] dark:text-neutral-500 italic">None yet</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {matchingCards.map((item) => (
                          <li key={item.id}>
                            <button
                              type="button"
                              onClick={() => openCard(item.id)}
                              className="text-left text-xs font-medium text-[#0F2042] dark:text-white hover:underline cursor-pointer block leading-snug"
                            >
                              {item.questionTitle}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface CompareNotesViewProps {
  section: string;
  onSectionChange: (section: string) => void;
}

export function CompareNotesView({ section, onSectionChange }: CompareNotesViewProps) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string>("all");
  const [mode, setMode] = useState<"notes" | "cards">("notes");

  const activeSection = (SECTIONS as readonly string[]).includes(section) ? section : "1";

  useEffect(() => {
    setTopic("all");
  }, [activeSection]);

  const sectionNotes = useMemo(
    () => COMPARE_NOTES.filter((note) => note.section === activeSection),
    [activeSection],
  );

  const topics = useMemo(
    () => Array.from(new Set(sectionNotes.map((note) => note.topic))),
    [sectionNotes],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sectionNotes.filter((note) => {
      if (topic !== "all" && note.topic !== topic) return false;
      if (!q) return true;
      const haystack = [
        note.name,
        note.topic,
        ...note.purpose,
        ...note.advantages,
        ...note.disadvantages,
        ...(note.uses ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [sectionNotes, topic, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, CompareNote[]>();
    for (const note of visible) {
      const list = map.get(note.topic) ?? [];
      list.push(note);
      map.set(note.topic, list);
    }
    return Array.from(map.entries());
  }, [visible]);

  return (
    <div className="study-page">
      <div className="study-page-heading">
        <div>
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-[#8B1E1E] dark:text-[#F87171] mb-1">
            Cambridge 0264 Revision
          </p>
          <h1 className="study-title">
            Advantages, Disadvantages, and Purpose
          </h1>
          <p className="study-description">
            Follow the Cambridge 0264 syllabus specification. In Notes mode, review the full untruncated purpose, advantages, and disadvantages for each syllabus topic. In Flashcards mode, practice single-concept recall (Purpose, Advantages, and Disadvantages split individually) with prompt clues and self-assessment tracking.
          </p>
        </div>
      </div>

      {/* Mode Switcher: Notes vs Flashcards */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMode("notes")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
            mode === "notes"
              ? "bg-[#0F2042] text-white dark:bg-white dark:text-black shadow-xs font-bold"
              : "bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-700 text-[#57534E] dark:text-neutral-300 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800"
          }`}
        >
          📖 Full Notes
        </button>
        <button
          type="button"
          onClick={() => setMode("cards")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
            mode === "cards"
              ? "bg-[#0F2042] text-white dark:bg-white dark:text-black shadow-xs font-bold"
              : "bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-700 text-[#57534E] dark:text-neutral-300 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800"
          }`}
        >
          🎴 Flashcard Deck
        </button>
      </div>

      {/* Section Switcher (Sections 1–6) */}
      <div className="flex flex-wrap gap-2 mb-4">
        {SECTIONS.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => {
              onSectionChange(code);
              setTopic("all");
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeSection === code
                ? "bg-[#0F2042] text-white dark:bg-white dark:text-black shadow-xs font-bold"
                : "bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-700 text-[#44403C] dark:text-neutral-200 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800"
            }`}
          >
            Section {code}
          </button>
        ))}
      </div>

      <p className="text-sm font-semibold text-[#0F2042] dark:text-neutral-200 mb-5">
        Section {activeSection}: {COMPARE_SECTION_LABELS[activeSection as CompareNote["section"]]}
      </p>

      {/* MODE 1: FLASHCARDS (3 Split Cards per Topic: Purpose, Advantages, Disadvantages) */}
      {mode === "cards" && (
        <RecallFlashcards section={activeSection as CompareNote["section"]} />
      )}

      {/* MODE 2: NOTES VIEW (Complete Section Rendering: Blue, Green, Red blocks fully rendered) */}
      {mode === "notes" && (
        <>
          <div className="flex flex-col sm:flex-row gap-2 mb-5">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a concept, method, or key term..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-[#1C1917] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F2042] dark:focus:ring-[#38BDF8]"
            />
            <select
              value={topics.includes(topic) ? topic : "all"}
              onChange={(event) => setTopic(event.target.value)}
              className="px-3.5 py-2 rounded-xl border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-[#1C1917] dark:text-white cursor-pointer"
            >
              <option value="all">All topics in Section {activeSection}</option>
              {topics.map((code) => (
                <option key={code} value={code}>
                  Topic {code}
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs text-[#78716C] dark:text-neutral-500 mb-4">
            {visible.length} {visible.length === 1 ? "entry" : "entries"} in Section {activeSection}
          </p>

          <div className="space-y-8">
            {grouped.map(([topicCode, notes]) => {
              const summary = REVISION_SUMMARIES.find(
                (item) => item.section === activeSection && item.topic === topicCode,
              );
              return (
                <section key={topicCode} className="space-y-4">
                  <div className="border-b border-[#E7E5E4] dark:border-neutral-800 pb-2">
                    <h2 className="font-academic-serif text-xl font-bold text-[#0F2042] dark:text-white">
                      Topic {topicCode}
                      {summary ? `: ${summary.title}` : ""}
                    </h2>
                  </div>

                  {summary && (
                    <details className="rounded-xl border border-[#E7E5E4] dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-2xs">
                      <summary className="cursor-pointer px-4 py-2.5 text-xs font-semibold text-[#0F2042] dark:text-white hover:text-blue-600 dark:hover:text-sky-300">
                        Topic {topicCode} Syllabus Summary Overview
                      </summary>
                      <ul className="px-4 pb-3.5 space-y-1.5">
                        {summary.points.map((point) => (
                          <li
                            key={point}
                            className="flex gap-2 text-xs leading-relaxed text-[#44403C] dark:text-neutral-300"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F2042] dark:bg-white" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}

                  <div className="space-y-5">
                    {notes.map((note) => (
                      <NoteCard key={note.id} note={note} />
                    ))}
                  </div>
                </section>
              );
            })}

            {grouped.length === 0 && (
              <div className="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-neutral-700 text-center">
                <p className="text-sm text-[#57534E] dark:text-neutral-400">
                  No notes match &ldquo;{query}&rdquo; in Section {activeSection}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setTopic("all");
                  }}
                  className="mt-2 text-xs font-semibold text-blue-600 dark:text-sky-400 hover:underline cursor-pointer"
                >
                  Clear search filters
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

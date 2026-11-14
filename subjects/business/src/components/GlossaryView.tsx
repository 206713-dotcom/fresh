"use client";

import React, { useState } from "react";
import { GLOSSARY_TERMS, QUIZLET_FOLDER_URL } from "../lib/data/glossary";
import { GlossaryTerm } from "../lib/types";

interface GlossaryViewProps {
  masteredIds: string[];
  onToggleMastered: (id: string) => void;
  onOpenQuickQuiz?: () => void;
}

export function GlossaryView({
  masteredIds,
  onToggleMastered,
  onOpenQuickQuiz,
}: GlossaryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<string>("all");
  const [isFlashcardMode, setIsFlashcardMode] = useState<boolean>(false);
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Filtered terms
  const filteredTerms = GLOSSARY_TERMS.filter((item) => {
    const matchUnit = selectedUnit === "all" ? true : item.unit === selectedUnit;
    const matchSearch =
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.syllabusRef.toLowerCase().includes(searchQuery.toLowerCase());
    return matchUnit && matchSearch;
  });

  const currentFlashcard: GlossaryTerm | undefined = filteredTerms[flashcardIndex];

  return (
    <div className="study-page">
      {/* Editorial Header */}
      <div className="mb-8">
        <div className="study-page-heading">
          <div>
            <h1 className="study-title">
              Cambridge 0264 Syllabus Glossary
            </h1>
            <p className="study-description">
              Official textbook key terminology, 2-mark definitions, and calculation formulae
            </p>
          </div>

          {/* Action Buttons: Flashcard Toggle & Quick Quiz Drill */}
          <div className="flex flex-wrap items-center gap-2.5">
            {onOpenQuickQuiz && (
              <button
                onClick={onOpenQuickQuiz}
                className="px-3.5 py-2 text-xs font-semibold rounded-md border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors flex items-center gap-1.5"
              >
                <span>⚡ Quick Quiz Drill</span>
              </button>
            )}

            <button
              onClick={() => {
                setIsFlashcardMode(!isFlashcardMode);
                setFlashcardIndex(0);
                setIsFlipped(false);
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-md border transition-colors ${
                isFlashcardMode
                  ? "bg-[#0F2042] dark:bg-[#38BDF8] text-white dark:text-[#0F172A] border-[#0F2042] dark:border-[#38BDF8]"
                  : "bg-white dark:bg-neutral-900 text-[#1C1917] dark:text-neutral-200 border-[#D6D3D1] dark:border-neutral-700 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800"
              }`}
            >
              {isFlashcardMode ? "Switch to Full Index View" : "Launch Flashcard Mode 🎴"}
            </button>
          </div>
        </div>

        {/* Quizlet Folder Callout Banner */}
        <div className="bg-[#EFF6FF] dark:bg-neutral-900 border border-[#BFDBFE] dark:border-neutral-700 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono font-semibold text-[#1D4ED8] dark:text-[#60A5FA] uppercase tracking-wider mb-1">
              Official Quizlet Folder Available
            </div>
            <p className="text-sm text-[#1E3A8A] dark:text-[#93C5FD]">
              Study Jayden_TAN53's curated Cambridge Business Studies 0264 digital flashcard sets and spaced repetition decks on Quizlet.
            </p>
          </div>

          <a
            href={QUIZLET_FOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors inline-flex items-center gap-1.5"
          >
            <span>Open Quizlet 0264 Folder</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-[#E7E5E4] dark:border-neutral-800 shadow-sm mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-1/2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setFlashcardIndex(0);
            }}
            placeholder="Search key terms, definitions, formulas (e.g. Added Value, ROCE, JIT)..."
            className="w-full bg-[#FAF9F6] dark:bg-black border border-[#D6D3D1] dark:border-neutral-700 rounded-lg px-3.5 py-2 text-sm text-[#1C1917] dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#0F2042] dark:focus:ring-[#38BDF8]"
          />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-3">
          <select
            value={selectedUnit}
            onChange={(e) => {
              setSelectedUnit(e.target.value);
              setFlashcardIndex(0);
            }}
            className="w-full sm:w-auto bg-[#FAF9F6] dark:bg-black border border-[#D6D3D1] dark:border-neutral-700 rounded-lg px-3 py-2 text-xs font-medium text-[#1C1917] dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#0F2042] dark:focus:ring-[#38BDF8]"
          >
            <option value="all">All Syllabus Units ({GLOSSARY_TERMS.length})</option>
            <option value="Unit 1: Understanding business activity">Unit 1: Business Activity</option>
            <option value="Unit 2: People in business">Unit 2: People in Business</option>
            <option value="Unit 3: Marketing">Unit 3: Marketing</option>
            <option value="Unit 4: Operations management">Unit 4: Operations Management</option>
            <option value="Unit 5: Financial information and decisions">Unit 5: Financial Decisions</option>
            <option value="Unit 6: External influences on business activity">Unit 6: External Influences</option>
          </select>

          <span className="text-xs font-mono text-[#78716C] dark:text-neutral-400 whitespace-nowrap">
            Showing {filteredTerms.length} terms
          </span>
        </div>
      </div>

      {/* Flashcard Study Mode */}
      {isFlashcardMode ? (
        <div className="max-w-xl mx-auto py-6">
          {currentFlashcard ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-mono text-[#78716C] dark:text-neutral-400">
                <span>
                  Card {flashcardIndex + 1} of {filteredTerms.length}
                </span>
                <span>
                  Mastered: {masteredIds.filter((id) => filteredTerms.some((t) => t.id === id)).length}
                </span>
              </div>

              {/* Flip Card Container */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="bg-white dark:bg-neutral-900 border-2 border-[#0F2042] dark:border-[#38BDF8] rounded-2xl p-8 min-h-[320px] flex flex-col justify-between shadow-sm cursor-pointer hover:border-[#1E3A8A] dark:hover:border-[#60A5FA] transition-all select-none"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#78716C] dark:text-neutral-400 mb-4">
                    <span className="font-mono text-[#0F2042] dark:text-[#38BDF8] uppercase font-bold">
                      {currentFlashcard.syllabusRef}
                    </span>
                    <span className="text-[11px] bg-[#FAF9F6] dark:bg-black px-2 py-0.5 rounded border border-[#E7E5E4] dark:border-neutral-700 text-[#57534E] dark:text-neutral-300">
                      {isFlipped ? "Definition Side" : "Term Side · Click to Flip"}
                    </span>
                  </div>

                  {!isFlipped ? (
                    <div className="my-8 text-center">
                      <h2 className="font-academic-serif text-3xl sm:text-4xl font-bold text-[#0F2042] dark:text-white mb-3">
                        {currentFlashcard.term}
                      </h2>
                      <span className="text-xs text-[#78716C] dark:text-neutral-400">
                        {currentFlashcard.unit}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="font-academic-serif text-xl font-bold text-[#0F2042] dark:text-[#38BDF8]">
                        {currentFlashcard.term}
                      </h3>
                      <p className="text-base text-[#1C1917] dark:text-neutral-200 leading-relaxed">
                        {currentFlashcard.definition}
                      </p>

                      {currentFlashcard.formula && (
                        <div className="p-3 bg-[#F8FAFC] dark:bg-black border border-[#CBD5E1] dark:border-neutral-700 rounded-lg text-xs font-mono text-[#0F172A] dark:text-[#38BDF8]">
                          <strong>Formula:</strong> {currentFlashcard.formula}
                        </div>
                      )}

                      <div className="p-3 bg-[#FAF9F6] dark:bg-black rounded-lg border border-[#E7E5E4] dark:border-neutral-800 text-xs text-[#57534E] dark:text-neutral-400">
                        <strong className="text-[#8B1E1E] dark:text-[#F87171] block mb-0.5">Cambridge Exam Tip:</strong>
                        {currentFlashcard.examAdvice}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#E7E5E4] dark:border-neutral-800 flex items-center justify-between text-xs text-[#78716C] dark:text-neutral-400">
                  <span>Click card to reveal definition</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleMastered(currentFlashcard.id);
                    }}
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      masteredIds.includes(currentFlashcard.id)
                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                        : "bg-[#F5F5F4] dark:bg-neutral-900 text-[#44403C] dark:text-neutral-200 hover:bg-[#E7E5E4] dark:hover:bg-[#334155]"
                    }`}
                  >
                    {masteredIds.includes(currentFlashcard.id) ? "✓ Mastered" : "+ Mark as Mastered"}
                  </button>
                </div>
              </div>

              {/* Flashcard Navigation Deck */}
              <div className="flex items-center justify-between gap-4">
                <button
                  disabled={flashcardIndex <= 0}
                  onClick={() => {
                    setFlashcardIndex((prev) => Math.max(0, prev - 1));
                    setIsFlipped(false);
                  }}
                  className="flex-1 py-2.5 px-4 bg-white dark:bg-neutral-900 border border-[#D6D3D1] dark:border-neutral-700 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-xs font-semibold rounded-lg disabled:opacity-30 transition-colors text-[#1C1917] dark:text-neutral-200"
                >
                  ← Previous Card
                </button>
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="py-2.5 px-6 bg-[#FAF9F6] dark:bg-black border border-[#D6D3D1] dark:border-neutral-700 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-xs font-semibold rounded-lg transition-colors text-[#1C1917] dark:text-neutral-200"
                >
                  Flip
                </button>
                <button
                  disabled={flashcardIndex >= filteredTerms.length - 1}
                  onClick={() => {
                    setFlashcardIndex((prev) =>
                      Math.min(filteredTerms.length - 1, prev + 1)
                    );
                    setIsFlipped(false);
                  }}
                  className="flex-1 py-2.5 px-4 bg-[#0F2042] dark:bg-[#38BDF8] hover:bg-[#1E3A8A] dark:hover:bg-[#0284C7] text-white dark:text-[#0F172A] text-xs font-semibold rounded-lg disabled:opacity-30 transition-colors"
                >
                  Next Card →
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[#78716C] dark:text-neutral-400">
              No terms match the selected criteria.
            </div>
          )}
        </div>
      ) : (
        /* Full Index Dictionary Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTerms.map((term) => {
            const isMastered = masteredIds.includes(term.id);
            return (
              <div
                key={term.id}
                className="bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:border-[#0F2042] dark:hover:border-[#38BDF8] transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono text-[#78716C] dark:text-neutral-400 uppercase">
                      {term.syllabusRef}
                    </span>
                    <button
                      onClick={() => onToggleMastered(term.id)}
                      className={`text-xs px-2.5 py-0.5 rounded font-mono transition-colors ${
                        isMastered
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800"
                          : "text-[#78716C] dark:text-neutral-400 hover:text-[#1C1917] dark:hover:text-white bg-[#F5F5F4] dark:bg-neutral-900"
                      }`}
                    >
                      {isMastered ? "✓ Mastered" : "Learn"}
                    </button>
                  </div>

                  <h3 className="font-academic-serif text-xl font-bold text-[#0F2042] dark:text-white mb-2.5">
                    {term.term}
                  </h3>

                  <p className="text-sm text-[#1C1917] dark:text-neutral-200 leading-relaxed mb-4">
                    {term.definition}
                  </p>

                  {term.formula && (
                    <div className="mb-4 p-2.5 bg-[#F8FAFC] dark:bg-black border border-[#CBD5E1] dark:border-neutral-700 rounded-md text-xs font-mono text-[#0F172A] dark:text-[#38BDF8]">
                      <strong>Formula:</strong> {term.formula}
                    </div>
                  )}

                  <div className="p-3 bg-[#FAF9F6] dark:bg-black border border-[#E7E5E4] dark:border-neutral-800 rounded-lg text-xs text-[#57534E] dark:text-neutral-400 space-y-1 mb-2">
                    <div className="text-[11px]">
                      <span className="font-semibold text-[#8B1E1E] dark:text-[#F87171]">Exam Guidance: </span>
                      <span>{term.examAdvice}</span>
                    </div>
                    {term.exampleContext && (
                      <div className="text-[11px] text-[#78716C] dark:text-neutral-400">
                        <span className="font-semibold">Context Example: </span>
                        <span>{term.exampleContext}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E7E5E4] dark:border-neutral-800 flex items-center justify-between text-[11px] text-[#78716C] dark:text-neutral-400">
                  <span>{term.unit}</span>
                  <a
                    href={QUIZLET_FOLDER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2563EB] dark:text-[#60A5FA] hover:underline"
                  >
                    Quizlet Card ↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

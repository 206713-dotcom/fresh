import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, ClipboardCheck, ExternalLink, FileText, GraduationCap, Swords, Target, Timer, X, Zap } from "lucide-react";
import type { BusinessTab } from "../App";
import { SYLLABUS_SECTIONS } from "../lib/data/syllabus-topics";
import { MCQ_BANK } from "../lib/data/mcq-bank";
import { OnePageSheets } from "./OnePageSheets";
import { SectionConceptDiagram } from "./SectionConceptDiagram";
import { FactorsOfProductionDiagram } from "./FactorsOfProductionDiagram";

const papers = [
  { tab: "practice", title: "Paper 1 practice", description: "Choose a syllabus topic and work through short, structured questions.", Icon: FileText },
  { tab: "paper2", title: "Paper 2 case studies", description: "Read the case and appendices, then practise applying the evidence in longer answers.", Icon: BookOpen },
] as const;

const revisionTools = [
  { tab: "lessons", title: "Interactive lessons", description: "Learn a topic step by step.", Icon: GraduationCap },
  { tab: "quick-quiz", title: "Quick Quiz", description: "Test what you remember.", Icon: Zap },
  { tab: "checklist", title: "Syllabus checklist", description: "Track what you still need to cover.", Icon: ClipboardCheck },
] as const;

interface BusinessOverviewProps {
  onNavigate: (tab: BusinessTab) => void;
  onStartMockExam: () => void;
  onOpenActiveRecallDrills: () => void;
}

const sectionShortTitle = (title: string) => title.replace(/^\d+\.\s*/, "");

export function BusinessOverview({ onNavigate, onStartMockExam, onOpenActiveRecallDrills }: BusinessOverviewProps) {
  // Section revision pack: 1-page summaries, per-section diagrams, consolidation documents and MCQ practice
  const [summarySection, setSummarySection] = useState<string | null>(null);
  const [diagramSection, setDiagramSection] = useState<string>("1");
  const [diagramTarget, setDiagramTarget] = useState<string | null>(null);
  const [consolidationSection, setConsolidationSection] = useState<string>("1");

  const openDiagram = (code: string) => setDiagramTarget(code);
  const selectedConsolidation = SYLLABUS_SECTIONS.find((section) => section.code === consolidationSection);

  // Close the 1-page summary overlay with Escape and lock body scroll while open
  useEffect(() => {
    if (!summarySection) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSummarySection(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [summarySection]);


  return (
    <div className="study-page business-overview">
      <header className="study-hero business-overview-hero">
        <div className="study-hero-content">
          <p className="study-hero-kicker">Cambridge IGCSE · 0264 / 0450</p>
          <h1 className="study-title">Business<br />Studies</h1>
          <p className="study-description">
            Revise a topic, practise with case studies, and get feedback on your answers.
          </p>
          <div className="study-hero-actions">
            <button className="study-action btn-primary" type="button" onClick={() => onNavigate("practice")}>
              Practise Paper 1 <ArrowRight size={17} aria-hidden="true" />
            </button>
            <button className="study-action study-secondary-action" type="button" onClick={onStartMockExam}>
              <Timer size={17} aria-hidden="true" /> Start a mock exam
            </button>
          </div>
        </div>
        <div className="study-hero-image" aria-hidden="true" />
      </header>

      <button type="button" className="boss-cta boss-overview-button" onClick={() => onNavigate("boss-battle")}>
        <Swords size={25} aria-hidden="true" />
        <span><strong>Boss Battle</strong><small>Fight with Business questions and earn Study Coins.</small></span>
        <ArrowRight size={23} aria-hidden="true" />
      </button>

      <section className="business-overview-section" aria-labelledby="business-papers">
        <h2 id="business-papers">Exam practice</h2>
        <div className="business-overview-papers">
          {papers.map(({ tab, title, description, Icon }) => (
            <button className="business-overview-card business-paper-card" key={tab} type="button" onClick={() => onNavigate(tab)}>
              <span className="business-overview-icon"><Icon size={23} aria-hidden="true" /></span>
              <span className="business-overview-card-copy"><strong>{title}</strong><span>{description}</span></span>
              <ArrowRight className="business-overview-arrow" size={20} aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>

      <section className="business-overview-section" aria-labelledby="business-revision">
        <h2 id="business-revision">Revision tools</h2>
        <div className="business-overview-tools">
          {revisionTools.map(({ tab, title, description, Icon }) => (
            <button className="business-overview-card business-tool-card" key={tab} type="button" onClick={() => onNavigate(tab)}>
              <span className="business-overview-icon"><Icon size={20} aria-hidden="true" /></span>
              <span className="business-overview-card-copy"><strong>{title}</strong><span>{description}</span></span>
              <ArrowRight className="business-overview-arrow" size={17} aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>

      <section className="business-overview-section" aria-labelledby="business-revision-pack">
        <h2 id="business-revision-pack">Section revision pack</h2>
        <div className="business-revision-pack">
          {/* Bottom left: 1-page summary */}
          <div className="business-pack-card">
            <span className="business-overview-icon"><FileText size={22} aria-hidden="true" /></span>
            <span className="business-pack-copy">
              <strong>1-Page Summary</strong>
              <span>Six A4 visual revision sheets — one for each section of the syllabus.</span>
            </span>
            <button type="button" className="business-pack-action" onClick={() => setSummarySection("1")}>
              Open 1-page summaries <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>

          {/* Middle: section diagrams with a dropdown picker */}
          <div className="business-pack-card">
            <span className="business-overview-icon"><GraduationCap size={22} aria-hidden="true" /></span>
            <span className="business-pack-copy">
              <strong>Section Diagrams</strong>
              <span>Interactive diagram for each section. Choose a section below.</span>
            </span>
            <label className="business-pack-field">
              <span className="business-pack-label">Choose a section</span>
              <select
                className="business-pack-select"
                value={diagramSection}
                onChange={(event) => setDiagramSection(event.target.value)}
                aria-label="Choose which section diagram to open"
              >
                {SYLLABUS_SECTIONS.map((section) => (
                  <option key={section.code} value={section.code}>
                    Section {section.code} — {sectionShortTitle(section.title)}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className="business-pack-action" onClick={() => openDiagram(diagramSection)}>
              Open diagram <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>

          {/* Bottom right: consolidation documents — same picker format as the diagram card */}
          <div className="business-pack-card">
            <span className="business-overview-icon"><BookOpen size={22} aria-hidden="true" /></span>
            <span className="business-pack-copy">
              <strong>Consolidation Documents</strong>
              <span>Official Google Docs consolidation sheet for the section you pick.</span>
            </span>
            <label className="business-pack-field">
              <span className="business-pack-label">Choose a section</span>
              <select
                className="business-pack-select"
                value={consolidationSection}
                onChange={(event) => setConsolidationSection(event.target.value)}
                aria-label="Choose which section's consolidation document to open"
              >
                {SYLLABUS_SECTIONS.map((section) => (
                  <option key={section.code} value={section.code}>
                    Section {section.code} — {sectionShortTitle(section.title)}
                  </option>
                ))}
              </select>
            </label>
            {selectedConsolidation?.consolidationDocUrl ? (
              <a
                className="business-pack-action"
                href={selectedConsolidation.consolidationDocUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open consolidation document <ExternalLink size={16} aria-hidden="true" />
              </a>
            ) : (
              <span className="business-pack-action business-pack-action-static business-pack-action-disabled" aria-disabled="true">
                Consolidation doc coming soon
              </span>
            )}
          </div>
        </div>

        {/* MCQ knowledge practice — links to Chapter Active Recall Drills in Quick Quiz */}
        <button type="button" className="business-mcq-link" onClick={onOpenActiveRecallDrills}>
          <span className="business-overview-icon business-mcq-link-icon"><Target size={24} aria-hidden="true" /></span>
          <span className="business-mcq-link-copy">
            <strong>MCQ Knowledge Practice</strong>
            <span>
              Chapter Active Recall Drills — {MCQ_BANK.length.toLocaleString()} syllabus MCQs across all six
              sections, with instant feedback and a Wrong-Only mode.
            </span>
          </span>
          <span className="business-pack-action business-pack-action-static">
            Start Active Recall Drills <ArrowRight size={16} aria-hidden="true" />
          </span>
        </button>
      </section>

      {/* 1-Page Summary overlay (A4 sheets) */}
      {summarySection && (
        <div className="business-pack-sheet-overlay" role="dialog" aria-modal="true" aria-label="1-page summaries">
          <button type="button" className="business-pack-sheet-close" onClick={() => setSummarySection(null)} aria-label="Close 1-page summaries">
            <X size={20} aria-hidden="true" />
          </button>
          <OnePageSheets initialSectionCode={summarySection} onBack={() => setSummarySection(null)} />
        </div>
      )}

      {/* Section diagram overlays (section 1 uses the Factors of Production visual) */}
      {diagramTarget === "1" && (
        <FactorsOfProductionDiagram isOpen onClose={() => setDiagramTarget(null)} />
      )}
      {diagramTarget && diagramTarget !== "1" && (
        <SectionConceptDiagram
          key={diagramTarget}
          sectionCode={diagramTarget}
          isOpen
          onClose={() => setDiagramTarget(null)}
        />
      )}
    </div>
  );
}

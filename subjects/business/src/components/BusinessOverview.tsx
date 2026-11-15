import { ArrowRight, BookOpen, ClipboardCheck, FileText, GraduationCap, Swords, Timer, Zap } from "lucide-react";
import type { BusinessTab } from "../App";

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
}

export function BusinessOverview({ onNavigate, onStartMockExam }: BusinessOverviewProps) {
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
    </div>
  );
}

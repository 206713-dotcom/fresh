import { useEffect, useRef, useState } from "react";
import { ArrowRight, Brain, Check, ChevronRight, Image as ImageIcon, ListChecks, RotateCcw, Search, X } from "lucide-react";
import { DETAILED_0264_SYLLABUS } from "../lib/data/detailed-syllabus-0264";
import { GLOSSARY_TERMS } from "../lib/data/glossary";
import {
  awardBonusStudyCoins,
  loadSyllabusRatings,
  saveSyllabusRatings,
  type SyllabusPointRating,
} from "../lib/cookies";
import { FactorsOfProductionDiagram } from "./FactorsOfProductionDiagram";
import { SECTION_VISUAL_LABELS, SectionConceptDiagram } from "./SectionConceptDiagram";
import "../checklist.css";

type RatingFilter = "all" | "unrated" | SyllabusPointRating;

const RATING_OPTIONS = [
  { value: "hard", label: "Hard" },
  { value: "moderate", label: "Moderate" },
  { value: "easy", label: "Easy" },
] as const;

const FILTER_OPTIONS = [
  { value: "all", label: "All points" },
  { value: "unrated", label: "Unrated" },
  ...RATING_OPTIONS,
] as const;

const SECTIONS = DETAILED_0264_SYLLABUS.map((section) => ({
  ...section,
  label: section.title.replace(/^\d+\.\s*/, ""),
  pointIds: section.topics.flatMap((topic) => topic.subtopics.flatMap((subtopic) => subtopic.bulletPoints.map((point) => point.id))),
}));

const POINTS = SECTIONS.flatMap((section) =>
  section.topics.flatMap((topic) =>
    topic.subtopics.flatMap((subtopic) =>
      subtopic.bulletPoints.map((point) => ({
        ...point,
        subtopicTitle: subtopic.title,
        searchText: [section.title, topic.code, topic.title, subtopic.code, subtopic.title, point.text].join(" ").toLowerCase(),
      })),
    ),
  ),
);

type RecallPoint = (typeof POINTS)[number];
const POINT_BY_ID = new Map(POINTS.map((point) => [point.id, point]));

interface ChecklistProps {
  onSelectTopicForPractice: (sectionCode: string, topicCode: string) => void;
}

export function SyllabusRevisionChecklist({ onSelectTopicForPractice }: ChecklistProps) {
  const [ratings, setRatings] = useState(loadSyllabusRatings);
  const [sectionCode, setSectionCode] = useState("all");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ "1.1": true });
  const [drill, setDrill] = useState<{ points: RecallPoint[]; index: number } | null>(null);
  const [drillAnswer, setDrillAnswer] = useState("");
  const [showFactors, setShowFactors] = useState(false);
  const [visualSection, setVisualSection] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const drillOpen = Boolean(drill);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (drillOpen && !dialog.open) dialog.showModal();
    if (!drillOpen && dialog.open) dialog.close();
  }, [drillOpen]);

  const counts = POINTS.reduce(
    (result, point) => {
      result[ratings[point.id] || "unrated"]++;
      return result;
    },
    { all: POINTS.length, unrated: 0, hard: 0, moderate: 0, easy: 0 },
  );
  const rated = counts.all - counts.unrated;
  const percent = Math.round((rated / counts.all) * 100);
  const queryWords = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const isSearching = queryWords.length > 0 || ratingFilter !== "all";
  const scopedPoints = POINTS.filter((point) =>
    (sectionCode === "all" || point.sectionCode === sectionCode) &&
    queryWords.every((word) => point.searchText.includes(word)),
  );
  const scopedCounts = { all: scopedPoints.length, unrated: 0, hard: 0, moderate: 0, easy: 0 };
  for (const point of scopedPoints) scopedCounts[ratings[point.id] || "unrated"]++;
  const visiblePoints = ratingFilter === "all"
    ? scopedPoints
    : scopedPoints.filter((point) => (ratings[point.id] || "unrated") === ratingFilter);
  const visibleIds = new Set(visiblePoints.map((point) => point.id));
  const visibleTopicCodes = [...new Set(visiblePoints.map((point) => point.topicCode))];
  const expansionKey = (code: string) => `${isSearching ? "filtered-" : ""}${code}`;
  const allExpanded = visibleTopicCodes.every((code) => expanded[expansionKey(code)] ?? isSearching);

  const ratePoint = (id: string, rating: SyllabusPointRating) => {
    const next = { ...ratings };
    if (next[id] === rating) {
      delete next[id];
    } else {
      next[id] = rating;
      awardBonusStudyCoins(5);
    }
    setRatings(next);
    saveSyllabusRatings(next);
  };

  const resetRatings = () => {
    if (!window.confirm("Reset all Business syllabus confidence ratings?")) return;
    const next = { ...ratings };
    for (const point of POINTS) delete next[point.id];
    setRatings(next);
    saveSyllabusRatings(next);
  };

  const startRecall = (points: RecallPoint[]) => {
    setDrillAnswer("");
    setDrill({ points, index: 0 });
  };

  const currentPoint = drill?.points[drill.index];
  const term = currentPoint?.text.toLowerCase();
  const glossary = term && GLOSSARY_TERMS.find(({ term: name }) => name.toLowerCase() === term || term.includes(name.toLowerCase()));

  const renderRatings = (id: string) => (
    <div className="checklist-rating-buttons" role="group" aria-label="Confidence rating">
      {RATING_OPTIONS.map(({ value, label }) => (
        <button key={value} type="button" data-rating={value} aria-pressed={ratings[id] === value} onClick={() => ratePoint(id, value)}>
          <span aria-hidden="true" />{label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="checklist">
      <header className="checklist-hero">
        <div className="checklist-hero-copy">
          <p className="checklist-kicker">Cambridge IGCSE Business · 0264</p>
          <h1>Revision checklist</h1>
          <p>Rate what you remember, then quiz yourself on the points that need more practice.</p>
          {counts.hard > 0 && (
            <button type="button" className="checklist-hero-action" onClick={() => startRecall(POINTS.filter((point) => ratings[point.id] === "hard"))}>
              <Brain size={18} aria-hidden="true" /> Review hard points <ArrowRight size={17} aria-hidden="true" />
            </button>
          )}
        </div>
        <div className="checklist-hero-visual">
          <div className="checklist-progress-card">
            <div className="checklist-progress-head">
              <div><ListChecks size={18} aria-hidden="true" /> Points rated</div>
              <strong>{rated > 0 && percent === 0 ? "<1" : percent}%</strong>
            </div>
            <progress aria-label="Syllabus points rated" value={rated} max={counts.all} />
            <p>{rated} of {counts.all} syllabus points</p>
          </div>
        </div>
      </header>

      <div className="checklist-workspace">
        <aside className="checklist-rail" aria-labelledby="checklist-section-title">
          <h2 id="checklist-section-title">Syllabus sections</h2>
          <label className="checklist-scope-label">
            <span className="sr-only">Syllabus section</span>
            <select aria-label="Syllabus section" value={sectionCode} onChange={(event) => setSectionCode(event.target.value)}>
              <option value="all">All sections</option>
              {SECTIONS.map((section) => <option key={section.code} value={section.code}>{section.title}</option>)}
            </select>
          </label>
          <nav className="checklist-section-list" aria-label="Syllabus sections">
            <button type="button" aria-pressed={sectionCode === "all"} onClick={() => setSectionCode("all")}>
              <ListChecks size={17} aria-hidden="true" /><strong>All sections</strong>
            </button>
            {SECTIONS.map((section) => {
              const sectionRated = section.pointIds.filter((id) => ratings[id]).length;
              return (
                <button key={section.code} type="button" aria-pressed={sectionCode === section.code} onClick={() => setSectionCode(section.code)}>
                  <span className="checklist-section-code">{section.code}</span>
                  <span className="checklist-section-label">
                    <strong>{section.label}</strong>
                    <small>{sectionRated} of {section.pointIds.length} rated</small>
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="checklist-content">
          <div className="checklist-toolbar">
            <label className="checklist-search">
              <Search size={19} aria-hidden="true" />
              <input type="search" aria-label="Search the syllabus" placeholder="Search terms or topic codes" value={query} onChange={(event) => setQuery(event.target.value)} />
            </label>
            <div className="checklist-filters" role="group" aria-label="Filter by confidence">
              {FILTER_OPTIONS.map(({ value, label }) => (
                <button key={value} type="button" data-rating={value} aria-pressed={ratingFilter === value} onClick={() => setRatingFilter(value)}>
                  <span aria-hidden="true" />{label} <small>{scopedCounts[value]}</small>
                </button>
              ))}
            </div>
            <div className="checklist-toolbar-footer">
              <p role="status">{visiblePoints.length} {visiblePoints.length === 1 ? "matching point" : "matching points"}</p>
              <div>
                {visibleTopicCodes.length > 0 && (
                  <button type="button" className="checklist-secondary" onClick={() => {
                    const changes = Object.fromEntries(visibleTopicCodes.map((code) => [expansionKey(code), !allExpanded]));
                    setExpanded((current) => ({ ...current, ...changes }));
                  }}>
                    {allExpanded ? "Collapse topics" : "Expand topics"}
                  </button>
                )}
                {rated > 0 && (
                  <button type="button" className="checklist-reset" onClick={resetRatings}>
                    <RotateCcw size={14} aria-hidden="true" /> Reset ratings
                  </button>
                )}
                <button type="button" className="checklist-primary" disabled={visiblePoints.length === 0} onClick={() => startRecall(visiblePoints)}>
                  <Brain size={17} aria-hidden="true" /> Start recall
                </button>
              </div>
            </div>
          </div>

          {visiblePoints.length === 0 && (
            <div className="checklist-empty">
              <h2>No matching points</h2>
              <p>Try a different search, section or confidence filter.</p>
              <button type="button" className="checklist-secondary" onClick={() => { setQuery(""); setSectionCode("all"); setRatingFilter("all"); }}>Clear filters</button>
            </div>
          )}

          {SECTIONS.map((section) => {
            const topics = section.topics.filter((topic) => topic.subtopics.some((subtopic) => subtopic.bulletPoints.some((point) => visibleIds.has(point.id))));
            if (!topics.length) return null;
            return (
              <section key={section.code} className="checklist-unit" aria-labelledby={`checklist-unit-${section.code}`}>
                <div className="checklist-unit-heading">
                  <h2 id={`checklist-unit-${section.code}`}><span>{section.code}</span>{section.label}</h2>
                  {SECTION_VISUAL_LABELS[section.code] && (
                    <button className="checklist-secondary" type="button" onClick={() => setVisualSection(section.code)}>
                      <ImageIcon size={16} aria-hidden="true" /> {SECTION_VISUAL_LABELS[section.code]}
                    </button>
                  )}
                </div>
                {topics.map((topic) => {
                  const topicId = `checklist-topic-${topic.code}`;
                  const isOpen = expanded[expansionKey(topic.code)] ?? isSearching;
                  const topicPoints = topic.subtopics.flatMap((subtopic) => subtopic.bulletPoints);
                  const topicRated = topicPoints.filter((point) => ratings[point.id]).length;
                  return (
                    <div className="checklist-topic" key={topic.code}>
                      <h3>
                        <button type="button" aria-expanded={isOpen} aria-controls={topicId} onClick={() => {
                          const key = expansionKey(topic.code);
                          setExpanded((current) => ({ ...current, [key]: !isOpen }));
                        }}>
                          <span className="checklist-topic-code">{topic.code}</span>
                          <strong>{topic.title}</strong>
                          <small>{topicRated}/{topicPoints.length} rated</small>
                          <ChevronRight size={18} aria-hidden="true" />
                        </button>
                      </h3>
                      <div id={topicId} hidden={!isOpen} className="checklist-topic-body">
                        {isOpen && (
                          <>
                            <div className="checklist-topic-actions">
                              {topic.code === "1.1" && (
                                <button type="button" className="checklist-secondary" onClick={() => setShowFactors(true)}>
                                  <ImageIcon size={15} aria-hidden="true" /> Factors of production diagram
                                </button>
                              )}
                              <button type="button" className="checklist-secondary" onClick={() => onSelectTopicForPractice(section.code, topic.code)}>
                                Practise exam questions <ArrowRight size={15} aria-hidden="true" />
                              </button>
                            </div>
                            {topic.subtopics.map((subtopic) => {
                              const points = subtopic.bulletPoints.filter((point) => visibleIds.has(point.id));
                              if (!points.length) return null;
                              return (
                                <div key={subtopic.code} className="checklist-subtopic">
                                  <h4><span>{subtopic.code}</span>{subtopic.title}</h4>
                                  <ul>
                                    {points.map((point) => (
                                      <li className="checklist-point" key={point.id}>
                                        <p>{point.text}</p>
                                        <div className="checklist-point-actions">
                                          {renderRatings(point.id)}
                                          <button type="button" className="checklist-recall-button" aria-label={`Recall: ${point.text}`} onClick={() => startRecall([POINT_BY_ID.get(point.id)!])}>Recall <ArrowRight size={14} aria-hidden="true" /></button>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              );
                            })}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </section>
            );
          })}
        </div>
      </div>

      <dialog ref={dialogRef} className="checklist-dialog" aria-labelledby="checklist-recall-title" onCancel={(event) => { event.preventDefault(); setDrill(null); }}>
        {drill && currentPoint && (
          <div className="checklist-dialog-content">
            <header>
              <div><p className="checklist-kicker">Active recall · {drill.index + 1} of {drill.points.length}</p><h2 id="checklist-recall-title">{currentPoint.subtopicTitle}</h2></div>
              <button type="button" className="checklist-secondary" aria-label="Close recall" onClick={() => setDrill(null)}><X size={19} aria-hidden="true" /></button>
            </header>
            <p className="checklist-recall-prompt">Explain what you remember about <strong>{currentPoint.text}</strong>.</p>
            <label>Your answer
              <textarea rows={4} value={drillAnswer} onChange={(event) => setDrillAnswer(event.target.value)} />
            </label>
            <details key={currentPoint.id}>
              <summary>Show guidance</summary>
              <p>{glossary ? glossary.definition : "State the key idea, explain its effect on a business, and support it with a relevant example."}</p>
              {glossary && glossary.exampleContext && <p>{glossary.exampleContext}</p>}
              {glossary && glossary.examAdvice && <p>{glossary.examAdvice}</p>}
            </details>
            {renderRatings(currentPoint.id)}
            <footer>
              <button type="button" className="checklist-secondary" disabled={drill.index === 0} onClick={() => { setDrillAnswer(""); setDrill({ ...drill, index: drill.index - 1 }); }}>Previous</button>
              <button type="button" className="checklist-secondary" onClick={() => onSelectTopicForPractice(currentPoint.sectionCode, currentPoint.topicCode)}>Exam practice</button>
              <button type="button" className="checklist-primary" onClick={() => { setDrillAnswer(""); setDrill(drill.index + 1 === drill.points.length ? null : { ...drill, index: drill.index + 1 }); }}>
                {drill.index + 1 === drill.points.length ? <><Check size={16} aria-hidden="true" /> Finish</> : <>Next <ArrowRight size={16} aria-hidden="true" /></>}
              </button>
            </footer>
          </div>
        )}
      </dialog>

      <FactorsOfProductionDiagram isOpen={showFactors} onClose={() => setShowFactors(false)} />
      {visualSection && <SectionConceptDiagram key={visualSection} sectionCode={visualSection} isOpen onClose={() => setVisualSection(null)} />}
    </div>
  );
}

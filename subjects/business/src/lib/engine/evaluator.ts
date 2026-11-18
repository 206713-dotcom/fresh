import {
  AssessmentObjectivesBreakdown,
  DynamicScenario,
  EvaluationResult,
  GradingQuestionType,
  ParagraphAuditItem,
  QuestionRubric,
  RuleEnforcementResult,
} from "../types";
import {
  CAMBRIDGE_0264_SYSTEM_PROMPT,
  buildParagraphAuditUserPrompt,
  computeRecommendedMaxTokens,
  evaluateEssayWebLLM,
  getActiveQwenConfig,
  parseParagraphAuditResponse,
  completeParagraphAudit,
  QwenParagraphAuditResult,
  resolveGradingQuestionType,
  runQwenChatCompletion,
  WebLLMEvaluationError,
} from "./webllm";
import { Paper1DeterministicRules } from "../data/paper1-database";
import { splitEssayParagraphs, splitResponsePoints } from "./paragraphs";

export { splitEssayParagraphs, splitResponsePoints } from "./paragraphs";

export interface EvaluatorInput {
  questionTitle: string;
  questionPrompt: string;
  caseContext: string;
  marks: number;
  rubric: QuestionRubric;
  studentAnswer: string;
  webllmEngine?: any;
  validAppWords?: string[];
  deterministicRules?: Paper1DeterministicRules;
  modelAnswer?: string;
  indicativeKnowledgePoints?: string[];
}

// Generic words that should NOT count on their own as mark-scheme syllabus knowledge mastery
const GENERIC_FILLER_WORDS = new Set([
  "the", "and", "for", "with", "from", "that", "this", "these", "those", "have", "been",
  "which", "will", "would", "could", "should", "they", "their", "them", "there", "here",
  "into", "over", "under", "more", "less", "most", "some", "many", "such", "also", "very",
  "business", "businesses", "company", "companies", "firm", "firms", "organization",
  "profit", "profits", "cost", "costs", "price", "prices", "money", "sales", "revenue",
  "customer", "customers", "worker", "workers", "staff", "employee", "employees", "people",
  "market", "markets", "product", "products", "service", "services", "good", "goods",
  "increase", "increases", "increased", "increasing", "decrease", "decreases", "decreased",
  "higher", "lower", "better", "worse", "greater", "smaller", "large", "small", "high", "low",
  "benefit", "benefits", "advantage", "advantages", "disadvantage", "disadvantages",
  "reason", "reasons", "factor", "factors", "impact", "effect", "result", "cause",
  "because", "therefore", "however", "overall", "although", "whereas", "while", "when",
  "using", "used", "make", "making", "made", "need", "needs", "help", "helps", "able",
  "allow", "allows", "allowing", "lead", "leads", "leading", "mean", "means", "meaning",
  "may", "might", "can", "could", "one", "two", "three", "four", "first", "second",
]);

/**
 * Normalizes text for matching keywords, punctuation, and currency amounts
 */
function normalizeForMatching(text: string): string {
  return text
    .toLowerCase()
    .replace(/[,\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
    .replace(/\s+/g, " ");
}

const GENERIC_CASE_CONTEXT_WORDS = new Set([
  "the", "this", "that", "these", "those", "in", "on", "at", "to", "for", "from", "with",
  "by", "as", "an", "and", "but", "or", "if", "it", "its", "each", "every", "many",
  "most", "some", "all", "one", "two", "three", "four", "five", "six", "seven", "eight",
  "country", "company", "business", "context", "overview", "current", "human", "exit", "new",
  "today", "however", "although", "despite", "overall", "therefore", "because", "whereas",
  "initiative", "appendix", "appendices", "table", "figure", "year", "years", "month", "months",
  "week", "weeks", "weekly", "annual", "annually", "average", "total", "percent", "percentage",
  "million", "billion", "option", "options", "method", "methods", "strategy", "strategies",
  "sector", "primary", "secondary", "tertiary", "revenue", "profit", "profits", "sales",
  "cost", "costs", "price", "prices", "capital", "reserves", "budget", "overheads", "growth",
  "survival", "expansion", "decision", "decisions", "management", "manager", "managers",
  "director", "directors", "owner", "owners", "partner", "partners", "partnership",
  "shareholder", "shareholders", "stakeholder", "stakeholders", "dividend", "dividends",
  "worker", "workers", "employee", "employees", "staff", "workforce", "customer", "customers",
  "client", "clients", "supplier", "suppliers", "competitor", "competitors", "market", "markets",
  "product", "products", "service", "services", "demand", "supply", "quality", "control",
  "research", "training", "objective", "objectives", "conflict", "conflicts", "challenge",
  "challenges", "dilemma", "problem", "problems", "issue", "issues", "risk", "risks",
  "benefit", "benefits", "advantage", "advantages", "disadvantage", "disadvantages",
  "opportunity", "standard", "standards", "measure", "measures", "factor", "factors",
  "short", "long", "term", "large", "small", "high", "low", "higher", "lower", "better",
  "best", "worse", "worst", "full", "time", "part", "local", "global", "national", "city",
  "center", "centre", "area", "region", "regional", "district", "port", "major", "minor",
  "good", "goods", "main", "core", "key", "other", "another", "furthermore", "also", "while",
  "currently", "recently", "presently", "wants", "want", "needs", "need", "plans", "plan",
  "prefers", "prefer", "considering", "consider", "evaluating", "evaluate", "weighing",
  "weigh", "facing", "faces", "creating", "creates", "generating", "generates", "employing",
  "employs", "operating", "operates", "founded", "managed", "owned", "based", "established",
  "allocated", "converting", "converted", "exiting", "scaling", "scale", "limited", "private",
  "public", "sole", "trader", "franchise", "franchisee", "franchisor", "royalty", "grant",
  "loan", "overdraft", "equity", "shares", "debt", "interest", "rate", "rates", "union", "unions",
  "imports", "exports", "social", "enterprise", "community", "government", "support", "advice",
  "failure", "success", "size", "numbers", "values", "value", "amount", "amounts", "level",
  "levels", "system", "systems", "process", "processes", "operation", "operations", "activity",
  "activities", "information", "data", "report", "reports", "increase", "increased", "increasing",
  "decrease", "decreased", "decreasing", "reduce", "reduced", "reducing", "improve", "improved",
  "improving", "growing", "declining", "rapidly", "quickly", "slowly", "significantly",
  "severely", "strict", "strong", "weak", "initial", "ongoing", "permanent", "additional",
  "extra", "new", "old", "existing", "established", "recognised", "recognized", "traditional",
  "modern", "commercial", "industrial", "corporate", "financial", "operational", "strategic",
  "internal", "external", "relative", "future", "long-term", "short-term", "full-time",
  "part-time", "start-up", "low-cost", "high-quality", "large-scale", "decision-making",
  "break-even", "breakeven", "ltd", "plc", "inc", "corp", "group", "co",
]);

const CONCRETE_CASE_NOUNS = new Set([
  "kiln", "kilns", "clay", "pottery", "ceramic", "ceramics", "tableware", "vases", "vase",
  "showroom", "workshop", "studio", "artisan", "artisans", "craft", "crafts", "guilds",
  "truck", "trucks", "driver", "drivers", "refrigerated", "cold-storage", "produce", "fleet",
  "farming", "farm", "farms", "agricultural", "agriculture", "cornstarch", "packaging",
  "plastic", "plastics", "molding", "machinery", "machine", "machines", "chemical",
  "laboratory", "technician", "technicians", "cleaning", "janitorial", "sanitization",
  "offices", "office", "cotton", "fabric", "fabrics", "garment", "garments", "weaving",
  "looms", "loom", "textiles", "textile", "vans", "van", "electric", "delivery", "assembly",
  "vehicle", "vehicles", "electronic", "electronics", "computer", "computers", "hardware",
  "refurbish", "refurbished", "circuit", "scanner", "diagnostic", "literacy", "youth",
  "ocean", "fish", "fishing", "trawler", "trawlers", "seafood", "freeze", "frozen", "shops",
  "shop", "carpenter", "woodworker", "woodworkers", "wooden", "furniture", "cabinetry",
  "wood-router", "router", "timber", "lumber", "logger", "loggers", "sawmill", "mill",
  "pallet", "pallets", "espresso", "coffee", "roastery", "beans", "cafe", "cafes",
  "bakery", "bread", "pastry", "pastries", "gelato", "dairy", "milk", "cheese", "solar",
  "panel", "panels", "battery", "batteries", "charger", "bioreactor", "bioreactors",
  "bio-engineer", "bio-engineers", "engineer", "engineers", "robot", "robots", "warehouse",
  "warehouses", "factory", "factories", "plant", "plants", "store", "stores", "restaurant",
  "restaurants", "hotel", "hotels", "rooms", "guests", "airline", "airlines", "ferry",
  "mine", "mines", "quarry", "tractor", "greenhouse", "leather", "shoes", "clothing",
  "bicycles", "motorcycles", "boats", "drones", "cameras", "phones", "tablets", "pharmacy",
  "clinic", "gym", "salon", "printing", "books", "paper", "glass", "steel", "aluminum",
  "tea", "cocoa", "chocolate", "juice", "bottles", "cans", "waste", "recycling", "recycle",
  "hand-painted", "handcrafted", "biodegradable", "eco-friendly", "automated",
]);

const COMPANY_SUFFIX_WORDS = new Set([
  "ltd", "plc", "inc", "co", "corp", "corporation", "group", "holdings", "motors",
  "mobility", "tech", "robotics", "systems", "foods", "airlines", "logistics", "retail",
  "solutions", "industries", "enterprises", "treats", "brew", "cafe", "coffee",
  "services", "works", "innovations", "textiles", "seafoods", "furniture", "studios",
  "ventures", "supplies", "craft", "pottery",
]);

export interface ActiveCaseContextSet {
  validAppWords?: string[];
  caseContext?: string;
  ao2Max?: number;
}

export interface CaseContextMatch {
  keyword: string;
  matchedText: string;
  start: number;
  end: number;
  isFallbackMatch?: boolean;
}

export interface CaseContextDetectionResult {
  passed: boolean;
  foundWords: string[];
  spans: CaseContextMatch[];
  activeKeywords: string[];
}

const LEFT_BOUND = "(?<![A-Za-z0-9_]|\\d,|\\d\\.)";
const RIGHT_BOUND = "(?![A-Za-z0-9_]|,\\d|\\.\\d)";

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const EXCLUDED_CONTEXT_ACRONYMS = new Set([
  "PLC", "LTD", "LLP", "INC", "GDP", "ROI", "ROCE", "ARR", "NPV", "USP",
  "TQM", "JIT", "HRM", "B2B", "B2C", "CEO", "CFO", "COO", "CSR", "SWOT",
  "PEST", "USD", "EUR", "GBP", "IGCSE", "CIE", "USA", "UK", "EU", "UN",
  "IT", "AI", "HR", "PR", "RD", "AO1", "AO2", "AO3", "AO4", "N/A",
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
]);

/**
 * Identifies business/brand names & standalone acronyms in caseContext so
 * pure name-dropping (e.g. "TimberCraft should...") cannot score AO2 marks.
 */
export function extractCompanyNames(caseContext?: string): Set<string> {
  const names = new Set<string>();
  if (!caseContext || !caseContext.trim()) return names;

  const addName = (raw: string, includeDistinctiveParts = false) => {
    const clean = raw.replace(/[.,;:]+$/g, "").replace(/\s+/g, " ").trim();
    if (!clean || clean.length < 2) return;
    names.add(clean.toLowerCase());
    if (includeDistinctiveParts) {
      for (const tok of clean.split(/\s+/)) {
        const lowerTok = tok.replace(/[^A-Za-z0-9&-]/g, "").toLowerCase();
        if (
          lowerTok.length >= 3 &&
          !COMPANY_SUFFIX_WORDS.has(lowerTok) &&
          !GENERIC_CASE_CONTEXT_WORDS.has(lowerTok) &&
          !CONCRETE_CASE_NOUNS.has(lowerTok)
        ) {
          names.add(lowerTok);
        }
      }
    }
  };

  // 1. Name paired with acronym: "BioCell Tech (BCT)"
  const parenEntityRegex =
    /\b([A-Z][A-Za-z0-9&'.-]*(?:\s+[A-Z][A-Za-z0-9&'.-]*){0,3})\s*\(([A-Z]{2,6})\)/g;
  let parenMatch: RegExpExecArray | null;
  while ((parenMatch = parenEntityRegex.exec(caseContext)) !== null) {
    addName(parenMatch[1], true);
    if (!EXCLUDED_CONTEXT_ACRONYMS.has(parenMatch[2])) {
      addName(parenMatch[2], false);
    }
  }

  // 2. Standalone business acronyms (e.g. "BCT", "TT", "VB")
  const acronymMatches = caseContext.match(/\b[A-Z]{2,6}\b/g) || [];
  for (const a of acronymMatches) {
    if (!EXCLUDED_CONTEXT_ACRONYMS.has(a)) {
      addName(a, false);
    }
  }

  // 3. CamelCase brand names ("TimberCraft", "SolarFleet", "EcoDrive", "CleanSpace")
  const camelMatches = caseContext.match(/\b[A-Z][a-z]+[A-Z][A-Za-z0-9]*\b/g) || [];
  for (const c of camelMatches) {
    addName(c, false);
  }

  // 4. Multi-word entity ending in corporate/brand suffix ("Orient Textiles Ltd", "EcoDrive Motors")
  const suffixPattern =
    /\b([A-Z][A-Za-z0-9&'.-]+(?:\s+[A-Z][A-Za-z0-9&'.-]+){0,2}\s+(?:Motors|Mobility|Tech|Robotics|Group|Systems|Foods|Airlines|Logistics|Retail|Holdings|Solutions|Industries|Enterprises|Treats|Brew|Cafe|Coffee|Services|Works|Innovations|Textiles|Seafoods|Furniture|Studios|Ventures|Supplies|Co\.?|Ltd\.?|Plc\.?|Inc\.?|Corp\.?))\b/g;
  let sufMatch: RegExpExecArray | null;
  while ((sufMatch = suffixPattern.exec(caseContext)) !== null) {
    const full = sufMatch[1].trim();
    addName(full, true);
    const withoutLegal = full.replace(/\s+(?:Ltd|Plc|Inc|Co|Corp)\.?$/i, "").trim();
    if (withoutLegal && withoutLegal !== full) {
      addName(withoutLegal, true);
    }
  }

  // 5. Capitalized subject at start of "X is a ...", "X operates ...", "X employs ..."
  const subjectRegex =
    /\b([A-Z][A-Za-z0-9'&-]+(?:\s+[A-Z][A-Za-z0-9'&-]+){0,2})\s+(?:is\s+a|is\s+an|owns|operates|produces|manufactures|employs|sells|provides|wants\s+to|plans\s+to|needs\s+to|was\s+founded)\b/g;
  let subMatch: RegExpExecArray | null;
  while ((subMatch = subjectRegex.exec(caseContext)) !== null) {
    const subj = subMatch[1].trim();
    const firstLower = subj.split(/\s+/)[0].toLowerCase();
    if (!GENERIC_CASE_CONTEXT_WORDS.has(firstLower)) {
      addName(subj, true);
    }
  }

  return names;
}

function isStandaloneCompanyToken(
  token: string,
  detectedCompanyNames: Set<string>
): boolean {
  const cleanLower = token.replace(/[.,;:]+$/g, "").replace(/\s+/g, " ").trim().toLowerCase();
  if (!cleanLower) return false;
  if (detectedCompanyNames.has(cleanLower)) return true;
  // CamelCase single brand word (e.g. "TimberCraft", "SolarFleet")
  if (/^[A-Z][a-z]+[A-Z][A-Za-z0-9]*$/.test(token.trim())) return true;
  // Standalone short uppercase business acronym not in economic/syllabus acronyms (e.g. "BCT", "TT")
  if (/^[A-Z]{2,5}$/.test(token.trim()) && !EXCLUDED_CONTEXT_ACRONYMS.has(token.trim())) {
    return true;
  }
  return false;
}

/**
 * Extracts concrete business-specific facts (currencies, percentages, ratios,
 * quantified metrics, and key domain nouns) from the case study stem & appendices,
 * explicitly EXCLUDING standalone company names so pure name-dropping earns 0 AO2.
 */
export function extractCaseContextFacts(caseContext?: string): string[] {
  if (!caseContext || !caseContext.trim()) return [];
  const facts: string[] = [];
  const seenLower = new Set<string>();
  const companyNames = extractCompanyNames(caseContext);

  const addFact = (raw: string) => {
    const clean = raw.replace(/\s+/g, " ").trim();
    if (!clean || clean.length < 2) return;
    const key = clean.toLowerCase();
    if (isStandaloneCompanyToken(clean, companyNames)) return;
    if (GENERIC_CASE_CONTEXT_WORDS.has(key) || GENERIC_FILLER_WORDS.has(key)) return;
    if (!seenLower.has(key)) {
      seenLower.add(key);
      facts.push(clean);
    }
  };

  // 1. Currency & scaled numbers ($500,000, $1.1 million, $0.5m, $600.00, $75,000)
  const currencyMatches =
    caseContext.match(/[$£€]\s*\d[\d,]*(?:\.\d+)?(?:\s*(?:million|billion|bn|m|k))?(?![A-Za-z0-9_])/gi) || [];
  for (const m of currencyMatches) addFact(m);

  // 2. Non-prefixed scaled numbers (e.g. "1.1 million")
  const scaledMatches =
    caseContext.match(/(?<![A-Za-z0-9_.$£€])\d[\d,]*(?:\.\d+)?\s*(?:million|billion)(?![A-Za-z0-9_])/gi) || [];
  for (const m of scaledMatches) addFact(m);

  // 3. Percentages & financial ratios (e.g. "4%", "3.5%", "3.17:1", "15%")
  const pctMatches = caseContext.match(/(?<![A-Za-z0-9_.])\d+(?:\.\d+)?%/g) || [];
  for (const m of pctMatches) addFact(m);

  const ratioMatches = caseContext.match(/\b\d+(?:\.\d+)?:\d+(?:\.\d+)?\b/g) || [];
  for (const m of ratioMatches) addFact(m);

  // 4. Quantified staff / output / facility metrics
  const quantifiedMatches =
    caseContext.match(
      /(?<![A-Za-z0-9_.])\d[\d,]*(?:\.\d+)?\s+(?:[a-z]+(?:-[a-z]+)?\s+){0,2}(?:bio-engineers|engineers|technicians|developers|artisans|craftspeople|craftsmen|potters|bakers|chefs|farmers|fishermen|loggers|miners|drivers|couriers|woodworkers|carpenters|workers|employees|staff|managers|directors|bioreactors|bioreactor\s+units|robots|units|vans|vehicles|cars|trucks|buses|trawlers|boats|kilns|ovens|looms|scanners|cafes|coffee\s+shops|shops|stores|branches|restaurants|hotels|factories|plants|warehouses|workshops|showrooms|machines|mines|ships|planes|customers|clients|orders|lines)\b/gi
    ) || [];
  for (const m of quantifiedMatches) addFact(m);

  // 5. Standalone multi-digit / comma numeric values (e.g. "160,000", "250,000") excluding syllabus/years
  const commaNumbers = caseContext.match(/\b\d{1,3}(?:,\d{3})+(?:\.\d+)?\b/g) || [];
  for (const n of commaNumbers) addFact(n);

  // 6. Concrete domain nouns from scenario lexicon & hyphenated nouns (e.g. "kiln", "clay", "artisans", "cold-storage", "wood-router")
  const hyphenMatches = caseContext.match(/\b[a-z]{3,}-[a-z]{3,}\b/gi) || [];
  for (const h of hyphenMatches) {
    const lowerH = h.toLowerCase();
    if (!GENERIC_CASE_CONTEXT_WORDS.has(lowerH) && !isStandaloneCompanyToken(h, companyNames)) {
      addFact(lowerH);
    }
  }

  const wordTokens = caseContext.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  for (const w of wordTokens) {
    if (CONCRETE_CASE_NOUNS.has(w) && !companyNames.has(w)) {
      addFact(w);
    }
  }

  // 7. Nouns immediately following production/acquisition/asset verbs ("produces X", "installing Y", "acquiring Z")
  const verbCueRegex =
    /\b(?:produces?|manufactures?|crafts?|bakes?|brews?|processes?|recycles?|refurbishes?|transports?|installing|install|purchasing|purchase|buying|acquiring|acquire|building|build|extend(?:ing)?)\s+(?:a|an|the|her|his|their|new|automated|commercial|electric|custom|eco-friendly|wooden|woven|hand-painted|ceramic|biodegradable|digital|diagnostic|ocean|fresh|cold-storage|refrigerated|\s){0,4}([a-z]{4,}(?:\s+[a-z]{4,})?)/gi;
  let vMatch: RegExpExecArray | null;
  while ((vMatch = verbCueRegex.exec(caseContext)) !== null) {
    const phrase = vMatch[1].trim().toLowerCase();
    for (const tok of phrase.split(/\s+/)) {
      if (
        tok.length >= 4 &&
        !GENERIC_CASE_CONTEXT_WORDS.has(tok) &&
        !GENERIC_FILLER_WORDS.has(tok) &&
        !companyNames.has(tok) &&
        !/(?:ly|tion|sion|ment|ness|ity|ous|ive|able|ing|ed)$/.test(tok)
      ) {
        addFact(tok);
      }
    }
  }

  return facts;
}

/**
 * Computes a numeric signature for deduplicating stem facts against curated compound valid_app_words
 * (e.g. "$1,700,000" vs "$1,700,000 expansion", "$1.1 million" vs "1.1 million", "4%" vs "4% defect rate").
 */
function getMetricDedupeSignature(phrase: string): string | null {
  const lower = phrase.toLowerCase().trim();
  const scaledMatch = lower.match(/(?:[$£€]\s*)?(\d[\d,]*(?:\.\d+)?)\s*(million|billion|bn|m|k)\b/);
  if (scaledMatch) {
    const num = scaledMatch[1].replace(/,/g, "");
    const unit = scaledMatch[2].startsWith("m") ? "m" : scaledMatch[2].startsWith("b") ? "b" : scaledMatch[2];
    const hasCurr = /[$£€]/.test(lower);
    // Treat "$1.1 million" and "1.1 million" as the same signature, while keeping "$1,700,000" separate from "$1.7m"
    return `${hasCurr && unit !== "m" ? "curr:" : "scaled:"}${num}${unit}`;
  }
  const currMatch = lower.match(/[$£€]\s*(\d[\d,]*(?:\.\d+)?)/);
  if (currMatch) {
    return `curr:${currMatch[1].replace(/,/g, "")}`;
  }
  const pctMatch = lower.match(/(\d+(?:\.\d+)?)%/);
  if (pctMatch) {
    return `pct:${pctMatch[1]}%`;
  }
  const unitNumMatch = lower.match(/\b(\d[\d,]*(?:\.\d+)?)\s+(?:[a-z-]+\s+){0,2}(?:units|bioreactors|technicians|engineers|bio-engineers|artisans|vans|cafes|shops|workers|employees|staff)\b/);
  if (unitNumMatch) {
    return `unitnum:${unitNumMatch[1].replace(/,/g, "")}`;
  }
  return null;
}

/**
 * Resolves the single authoritative caseKeywords / contextPhrases list shared between
 * the AO2 grading scanner and the live AOHighlightViewer.
 * Explicitly excludes standalone company names so pure name-dropping earns 0 AO2.
 */
export function getActiveCaseContextKeywords(
  activeSet?: ActiveCaseContextSet | string[]
): string[] {
  const normalized: ActiveCaseContextSet = Array.isArray(activeSet)
    ? { validAppWords: activeSet }
    : activeSet || {};

  if (normalized.ao2Max === 0) {
    return [];
  }

  const companyNames = extractCompanyNames(normalized.caseContext);
  const curated = (normalized.validAppWords || [])
    .map((w) => w.trim())
    .filter((w) => Boolean(w) && !isStandaloneCompanyToken(w, companyNames));
  const extracted = extractCaseContextFacts(normalized.caseContext);

  const result: string[] = [];
  const seenLower = new Set<string>();
  const seenSignatures = new Set<string>();

  for (const kw of curated) {
    const key = kw.toLowerCase();
    if (!seenLower.has(key)) {
      seenLower.add(key);
      result.push(kw);
      const sig = getMetricDedupeSignature(kw);
      if (sig) seenSignatures.add(sig);
    }
  }

  for (const fact of extracted) {
    const key = fact.toLowerCase();
    if (seenLower.has(key)) continue;
    const sig = getMetricDedupeSignature(fact);
    if (sig && seenSignatures.has(sig)) continue;
    seenLower.add(key);
    if (sig) seenSignatures.add(sig);
    result.push(fact);
  }

  return result;
}

/**
 * Builds a regex pattern for matching a case keyword/number cleanly inside student text,
 * handling currency signs, commas, percentages, ratios, scaled units ("million"/"m"), and singular/plural stems.
 */
function buildCaseTokenPattern(token: string, allowOptionalLeadingCurrency = false): string {
  const trimmed = token.trim();
  const currPrefix = allowOptionalLeadingCurrency ? "(?:[$£€]\\s*)?" : "";

  // Scaled currency/number (e.g. "$1.1 million", "1.1 million", "$0.5m", "$1.7m")
  const scaledMatch = trimmed.match(/^([$£€])?\s*(\d[\d,]*(?:\.\d+)?)\s*(million|billion|bn|m|k)$/i);
  if (scaledMatch) {
    const hasCurr = Boolean(scaledMatch[1]) || allowOptionalLeadingCurrency;
    const numPat = escapeRegExp(scaledMatch[2]).replace(/,/g, ",?");
    const unitRaw = scaledMatch[3].toLowerCase();
    const unitPat =
      unitRaw === "million" || unitRaw === "m"
        ? "(?:million|m)"
        : unitRaw === "billion" || unitRaw === "bn"
        ? "(?:billion|bn)"
        : escapeRegExp(unitRaw);
    return `${hasCurr ? "(?:[$£€]\\s*)?" : ""}${numPat}\\s*${unitPat}`;
  }

  // Currency number (e.g. "$500,000", "$1,700,000", "$600.00")
  const currMatch = trimmed.match(/^[$£€]\s*(\d[\d,]*(?:\.\d+)?)$/);
  if (currMatch) {
    const rawDigits = currMatch[1];
    const noTrailingZeros = rawDigits.replace(/\.00$/, "");
    const numPat =
      noTrailingZeros !== rawDigits
        ? `${escapeRegExp(noTrailingZeros).replace(/,/g, ",?")}(?:\\.00)?`
        : escapeRegExp(rawDigits).replace(/,/g, ",?");
    return `(?:[$£€]\\s*)?${numPat}`;
  }

  // Percentage (e.g. "4%", "3.5%")
  const pctMatch = trimmed.match(/^(\d+(?:\.\d+)?)%$/);
  if (pctMatch) {
    return `${escapeRegExp(pctMatch[1])}\\s*%`;
  }

  // Ratio (e.g. "3.17:1")
  const ratioMatch = trimmed.match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/);
  if (ratioMatch) {
    return `${escapeRegExp(ratioMatch[1])}\\s*:\\s*${escapeRegExp(ratioMatch[2])}`;
  }

  // Plain comma-formatted number (e.g. "500,000")
  if (/^\d[\d,]*(?:\.\d+)?$/.test(trimmed)) {
    return `${currPrefix}${escapeRegExp(trimmed).replace(/,/g, ",?")}`;
  }

  // Single alphabetic word >= 4 chars: allow singular/plural inflections safely
  if (/^[A-Za-z-]+$/.test(trimmed) && trimmed.length >= 4) {
    const lower = trimmed.toLowerCase();
    if (lower.endsWith("ies") && trimmed.length >= 5) {
      const base = escapeRegExp(trimmed.slice(0, -3));
      return `${base}(?:y|ies)`;
    }
    if (lower.endsWith("y") && !/[aeiou]y$/i.test(lower) && trimmed.length >= 5) {
      const base = escapeRegExp(trimmed.slice(0, -1));
      return `${base}(?:y|ies)`;
    }
    if (lower.endsWith("s") && !lower.endsWith("ss") && trimmed.length >= 4) {
      return `${escapeRegExp(trimmed.slice(0, -1))}s?`;
    }
    return `${escapeRegExp(trimmed)}(?:s|es)?`;
  }

  return escapeRegExp(trimmed);
}

function buildCasePhraseRegex(phrase: string): RegExp | null {
  const parts = phrase.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return null;

  // Preserve leading currency optionality for phrases like "1.1 million"
  if (parts.length === 2 && /^\d[\d,.]*$/.test(parts[0]) && /^(?:million|billion)$/i.test(parts[1])) {
    const pat = buildCaseTokenPattern(phrase, true);
    return new RegExp(`${LEFT_BOUND}${pat}${RIGHT_BOUND}`, "gi");
  }

  const tokenPatterns = parts.map((part, idx) => {
    // Allow optional currency before leading numbers in compound phrases if first token is numeric
    const allowCurr = idx === 0 && /^\d/.test(part);
    return buildCaseTokenPattern(part, allowCurr);
  });

  return new RegExp(`${LEFT_BOUND}${tokenPatterns.join("\\s+")}${RIGHT_BOUND}`, "gi");
}

function extractNumericCoresFromPhrase(phrase: string): string[] {
  const cores: string[] = [];
  const matches =
    phrase.match(
      /[$£€]\s*\d[\d,]*(?:\.\d+)?(?:\s*(?:million|billion|bn|m|k))?|\d+(?:\.\d+)?%|\b\d+(?:\.\d+)?:\d+(?:\.\d+)?\b|\b\d[\d,]*(?:\.\d+)?\s*(?:million|billion)\b/gi
    ) || [];
  for (const m of matches) {
    const clean = m.trim();
    if (clean) cores.push(clean);
  }
  return cores;
}

/**
 * Shared AO2 Case Context Detector used identically by both the grading scanner
 * and the live AOHighlightViewer across Paper 1 and Paper 2.
 */
export function detectCaseContext(
  text: string,
  activeSet?: ActiveCaseContextSet | string[]
): CaseContextDetectionResult {
  const activeKeywords = getActiveCaseContextKeywords(activeSet);
  if (activeKeywords.length === 0) {
    return { passed: true, foundWords: [], spans: [], activeKeywords: [] };
  }
  if (!text || !text.trim()) {
    return { passed: false, foundWords: [], spans: [], activeKeywords };
  }

  const candidateSpans: CaseContextMatch[] = [];

  for (const kw of activeKeywords) {
    const fullRegex = buildCasePhraseRegex(kw);
    let matchedFull = false;

    if (fullRegex) {
      let m: RegExpExecArray | null;
      fullRegex.lastIndex = 0;
      while ((m = fullRegex.exec(text)) !== null) {
        if (m[0].length === 0) {
          fullRegex.lastIndex++;
          continue;
        }
        matchedFull = true;
        candidateSpans.push({
          keyword: kw,
          matchedText: m[0],
          start: m.index,
          end: m.index + m[0].length,
          isFallbackMatch: false,
        });
      }
    }

    if (matchedFull) continue;

    // Fallback 1: Numeric / metric cores inside compound valid_app_words (e.g. "$1,700,000" from "$1,700,000 expansion", "4%" from "4% defect rate")
    const cores = extractNumericCoresFromPhrase(kw);
    let matchedCore = false;
    for (const core of cores) {
      const coreRegex = buildCasePhraseRegex(core);
      if (!coreRegex) continue;
      let m: RegExpExecArray | null;
      coreRegex.lastIndex = 0;
      while ((m = coreRegex.exec(text)) !== null) {
        if (m[0].length === 0) {
          coreRegex.lastIndex++;
          continue;
        }
        matchedCore = true;
        candidateSpans.push({
          keyword: kw,
          matchedText: m[0],
          start: m.index,
          end: m.index + m[0].length,
          isFallbackMatch: true,
        });
      }
    }

    if (matchedCore) continue;

    // Fallback 2: Multi-word phrase where all significant tokens (>= 4 chars, non-generic) appear in text
    const rawTokens = kw.trim().split(/\s+/);
    if (rawTokens.length >= 2) {
      const sigTokens = rawTokens
        .map((t) => t.replace(/^[^A-Za-z0-9$£€]+|[^A-Za-z0-9%]+$/g, ""))
        .filter((t) => {
          if (!t) return false;
          if (/\d/.test(t)) return true;
          return t.length >= 4 && !GENERIC_FILLER_WORDS.has(t.toLowerCase());
        });

      if (sigTokens.length >= 2) {
        const tokenSpans: CaseContextMatch[] = [];
        let allPresent = true;
        for (const tok of sigTokens) {
          const tokRegex = buildCasePhraseRegex(tok);
          if (!tokRegex) {
            allPresent = false;
            break;
          }
          let m: RegExpExecArray | null;
          let tokFound = false;
          tokRegex.lastIndex = 0;
          while ((m = tokRegex.exec(text)) !== null) {
            if (m[0].length === 0) {
              tokRegex.lastIndex++;
              continue;
            }
            tokFound = true;
            tokenSpans.push({
              keyword: kw,
              matchedText: m[0],
              start: m.index,
              end: m.index + m[0].length,
              isFallbackMatch: true,
            });
          }
          if (!tokFound) {
            allPresent = false;
            break;
          }
        }
        if (allPresent) {
          candidateSpans.push(...tokenSpans);
        }
      }
    }
  }

  // Resolve overlapping spans: prefer exact (non-fallback) longer matches first, then earliest position
  candidateSpans.sort((a, b) => {
    const aFallback = a.isFallbackMatch ? 1 : 0;
    const bFallback = b.isFallbackMatch ? 1 : 0;
    if (aFallback !== bFallback) return aFallback - bFallback;
    const lenDiff = (b.end - b.start) - (a.end - a.start);
    if (lenDiff !== 0) return lenDiff;
    return a.start - b.start;
  });

  const acceptedSpans: CaseContextMatch[] = [];
  for (const s of candidateSpans) {
    const overlaps = acceptedSpans.some((a) => s.start < a.end && s.end > a.start);
    if (!overlaps) {
      acceptedSpans.push(s);
    }
  }

  // Sort final spans left-to-right for inline rendering
  acceptedSpans.sort((a, b) => a.start - b.start);

  // Build unique foundWords list synchronized 1:1 with winning spans
  const foundWords: string[] = [];
  const seenFoundKeys = new Set<string>();
  const seenSpanTexts = new Set<string>();

  for (const s of acceptedSpans) {
    const kwKey = s.keyword.toLowerCase();
    const textKey = s.matchedText.trim().toLowerCase();
    if (seenFoundKeys.has(kwKey) || seenSpanTexts.has(textKey)) continue;
    seenFoundKeys.add(kwKey);
    seenSpanTexts.add(textKey);
    foundWords.push(s.isFallbackMatch && s.matchedText.trim().length >= 2 ? s.matchedText.trim() : s.keyword);
  }

  return {
    passed: foundWords.length > 0,
    foundWords,
    spans: acceptedSpans,
    activeKeywords,
  };
}

/**
 * Website Code Rule 1: Application Keyword Scan
 * Evaluates active case keywords + context facts against the candidate answer via detectCaseContext.
 */
export function scanApplicationKeywords(
  answer: string,
  validAppWords?: string[],
  caseContext?: string,
  ao2Max?: number
): { passed: boolean; foundWords: string[] } {
  const detection = detectCaseContext(answer, { validAppWords, caseContext, ao2Max });
  return {
    passed: detection.passed,
    foundWords: detection.foundWords,
  };
}

// Decisive conclusion / judgment / recommendation phrasing (AO4 core)
const EVAL_JUDGMENT_TERMS = [
  "overall",
  "in conclusion",
  "to conclude",
  "to sum up",
  "in summary",
  "on balance",
  "recommend",
  "recommendation",
  "the deciding factor",
  "deciding factor",
  "outweigh",
  "outweighs",
  "greater than",
  "advantages are greater",
  "disadvantages are greater",
  "benefits outweigh",
  "costs outweigh",
  "better option",
  "best option",
  "more suitable",
  "preferable",
  "ultimately",
  "beneficial overall",
  "worthwhile",
  "worth it",
  "i conclude",
  "i believe",
  "i think",
  "should choose",
  "should use",
  "is superior",
  "crucial factor",
  "vital factor",
  "most significant",
  "more important than",
  "justified",
  "judgement",
  "judgment",
];

// Counter-argument / qualification / contingency terms (AO4 balance)
const EVAL_QUALIFIER_TERMS = [
  "however",
  "on the other hand",
  "depends on",
  "depends upon",
  "in the short term",
  "in the long term",
  "in the short run",
  "in the long run",
  "although",
  "whereas",
  "despite",
  "nevertheless",
  "nonetheless",
  "trade-off",
  "tradeoff",
  "opportunity cost",
  "conversely",
  "alternatively",
  "even though",
];

/**
 * Website Code Rule 2: Evaluation Judgment Word Scan
 * Distinguishes decisive judgment/recommendation phrases from counter-balance qualifiers.
 */
export function scanEvaluationKeywords(answer: string): {
  passed: boolean;
  foundWords: string[];
  judgmentCount: number;
  qualifierCount: number;
} {
  const lower = answer.toLowerCase();
  const foundWords: string[] = [];
  let judgmentCount = 0;
  let qualifierCount = 0;

  for (const term of EVAL_JUDGMENT_TERMS) {
    if (lower.includes(term)) {
      foundWords.push(term);
      judgmentCount++;
    }
  }
  for (const term of EVAL_QUALIFIER_TERMS) {
    if (lower.includes(term)) {
      foundWords.push(term);
      qualifierCount++;
    }
  }

  return {
    passed: judgmentCount > 0 || qualifierCount > 0,
    foundWords,
    judgmentCount,
    qualifierCount,
  };
}

// Explicit multi-step analytical chain markers (Cambridge AO3)
const STRONG_CAUSAL_CHAINS = [
  "this leads to",
  "which leads to",
  "as a result",
  "consequently",
  "because of this",
  "therefore",
  "which means that",
  "which means",
  "meaning that",
  "enabling the business to",
  "enabling them to",
  "enables the business to",
  "this causes",
  "which causes",
  "results in",
  "resulting in",
  "in turn",
  "which reduces",
  "which increases",
  "which lowers",
  "which raises",
  "which improves",
  "which attracts",
  "which avoids",
  "which prevents",
  "which protects",
  "which maintains",
  "which preserves",
  "which ensures",
  "which allows",
  "which enables",
  "leading to",
  "so that",
  "thereby",
  "due to this",
  "allowing the business",
  "allows the business",
  "which impacts",
  "impact on profit",
  "affects cash flow",
  "improves cash flow",
  "reduces financial risk",
  "lowers unit costs",
  "higher profit margin",
  "competitive advantage",
  "loss of customers",
  "loss of reputation",
  "loss of brand image",
  "delays operations",
];

// Basic single-step reason markers (not full AO3 chain on their own)
const BASIC_REASON_MARKERS = [
  "because",
  "due to",
  "since",
  "in order to",
  "so it can",
  "so they can",
];

function scanCausalAnalysis(text: string): {
  strongChains: number;
  basicReasons: number;
  matchedChains: string[];
} {
  const lower = text.toLowerCase();
  const matchedChains: string[] = [];
  let strongChains = 0;
  let basicReasons = 0;

  for (const conn of STRONG_CAUSAL_CHAINS) {
    if (lower.includes(conn)) {
      strongChains++;
      matchedChains.push(conn);
    }
  }
  for (const marker of BASIC_REASON_MARKERS) {
    const regex = new RegExp(`\\b${marker.replace(/\s+/g, "\\s+")}\\b`, "i");
    if (regex.test(lower)) {
      basicReasons++;
    }
  }

  return { strongChains, basicReasons, matchedChains };
}

/**
 * Returns true if segment text duplicates any previously credited segment
 * (normalized Jaccard token similarity > 0.70, or every sentence matches a prior sentence > 0.70).
 */
export function isSegmentDuplicateOfAny(segText: string, priorSegments: string[]): boolean {
  const trimmed = segText.trim();
  if (!trimmed || priorSegments.length === 0) return false;

  const curSents = trimmed
    .split(/(?<=[.!?])\s+|[;\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 4);

  for (const prev of priorSegments) {
    const prevTrimmed = prev.trim();
    if (!prevTrimmed) continue;
    if (computeSentenceJaccardSimilarity(trimmed, prevTrimmed) > 0.7) {
      return true;
    }
    const prevSents = prevTrimmed
      .split(/(?<=[.!?])\s+|[;\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length >= 4);
    if (
      curSents.length > 0 &&
      prevSents.length > 0 &&
      curSents.every((cs) => prevSents.some((ps) => computeSentenceJaccardSimilarity(cs, ps) > 0.7))
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Extracts strictly the final paragraph for AO4 Evaluation checks.
 * Never allows Paragraph 1 balancing/evaluation terms (e.g. "however") to leak into AO4.
 */
export function extractFinalParagraph(answer: string): string {
  const rawParagraphs = splitEssayParagraphs(answer);

  if (rawParagraphs.length >= 2) {
    return rawParagraphs[rawParagraphs.length - 1];
  }

  const single = rawParagraphs[0] || "";
  if (!single) return "";

  const sentences = single
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length <= 1) {
    return single;
  }

  // Single-block essay without newlines: locate final concluding marker in the latter portion,
  // or take strictly the last 1-2 sentences so early paragraphs never trigger AO4.
  const startSearchIdx = Math.max(1, Math.floor(sentences.length * 0.45));
  for (let i = sentences.length - 1; i >= startSearchIdx; i--) {
    if (
      /^(?:recommendation|conclusion|in conclusion|to conclude|overall|on balance|to sum up|in summary|ultimately|i recommend|therefore,\s*i\s+recommend)\b/i.test(
        sentences[i]
      )
    ) {
      return sentences.slice(i).join(" ");
    }
  }

  return sentences.slice(sentences.length >= 4 ? -2 : -1).join(" ");
}

export interface Paper2FinalParagraphEvalScan {
  finalParagraph: string;
  makesClearChoice: boolean;
  hasCaseContextInFinal: boolean;
  weighsBenefitVsDrawbackInContext: boolean;
  explainsWhyRejectedWorse: boolean;
  hasGenericTradeOffOnly: boolean;
  ao4DeterministicCeiling: number;
  foundWords: string[];
  judgmentCount: number;
  qualifierCount: number;
}

/**
 * Strict Paper 2 AO4 Final-Paragraph Evaluator:
 * Scans ONLY the final paragraph. Generic assertions ("it is the best way") score max 1/3.
 * Requires clear choice AND (weighs benefit vs drawback in case context OR explains rejected options are worse) for 3/3.
 */
export function scanPaper2FinalParagraphEvaluation(
  answer: string,
  effectiveAppWords: string[],
  caseMainStem: string
): Paper2FinalParagraphEvalScan {
  const finalParagraph = extractFinalParagraph(answer);
  const finalEval = scanEvaluationKeywords(finalParagraph);
  const finalWords = finalParagraph ? finalParagraph.split(/\s+/).filter(Boolean).length : 0;

  const makesClearChoice =
    /\b(recommend|recommendation|recommendations|should choose|should use|should select|should adopt|should invest|should focus|must choose|i choose|we choose|prefer|preferable|preferred|best option|better option|best choice|better choice|best method|better method|best strategy|better strategy|best way|more suitable|most suitable|is superior|greatest impact|did not improve|has not improved|has improved|has deteriorated|is worse)\b/i.test(
      finalParagraph
    ) ||
    (finalEval.judgmentCount >= 1 &&
      /\b(should|best|better|choose|select|adopt|prefer|improved|deteriorated|worse|outweigh|recommend)\b/i.test(
        finalParagraph
      ));

  const finalAppCheck = detectCaseContext(finalParagraph, {
    validAppWords: effectiveAppWords,
    caseContext: caseMainStem,
    ao2Max: 3,
  });
  const hasCaseFigureInFinal =
    /(?:\$\s*\d[\d,.]*(?:k|m|million)?|\b\d+(?:\.\d+)?%|\b\d+(?:\.\d+)?:1\b)/i.test(finalParagraph);
  const hasCaseContextInFinal = finalAppCheck.foundWords.length >= 1 || hasCaseFigureInFinal;

  const hasWeighingMarker =
    /(?:\boutweigh\w*\b|\boffset\w*\b|\bworth the\b|\bworthwhile despite\b|\bgreater than\b|\bmore significant than\b|\beven though\b|\bdespite\b|\balthough\b|\bhowever\b|\bon the other hand\b|\bat the expense of\b|\bcompensat\w*\s+for\b)/i.test(
      finalParagraph
    ) ||
    (/\bshort[\s-]+term\b/i.test(finalParagraph) && /\blong[\s-]+term\b/i.test(finalParagraph)) ||
    /\bwhile\b[^.!?;]{4,95}\b(?:cost\w*|expensive|fee\w*|time|delay\w*|risk\w*|drawback\w*|disadvantage\w*|limit\w*|interest|overdraft|training|capital|burden|loss|strain|high\w*)\b/i.test(
      finalParagraph
    );

  const hasDrawbackSide =
    /\b(cost\w*|expensive|fee\w*|time-consuming|takes?\s+(?:longer|time)|(?:setup|research|extra|additional)\s+time|delay\w*|risk\w*|drawback\w*|disadvantage\w*|limitation\w*|short[\s-]+term|interest|debt|overdraft|training|burden|loss|strain|capital|sacrifice|higher initial|initial outlay|upfront)\b/i.test(
      finalParagraph
    );

  const hasBusinessBenefitJustification =
    /\b(profit\w*|revenue\w*|sales|demand|cash\s*flow|cashflow|liquidity|quality|defect\w*|rework|brand|reputation|loyalty|customer\w*|retention|growth|survival|efficiency|productivity|long[\s-]+term|vital|ensure\w*|protect\w*|secure\w*|avoid\w*|prevent\w*|boost\w*|generat\w*|stimulat\w*|mitigat\w*|reduce\w*|lower\w*|target)\b/i.test(
      finalParagraph
    );

  const hasGenericTradeOffStructure =
    hasWeighingMarker && hasDrawbackSide && hasBusinessBenefitJustification;
  const weighsBenefitVsDrawbackInContext =
    hasGenericTradeOffStructure && hasCaseContextInFinal;

  const hasRejectedComparisonMarker =
    /(?:\bwhereas\b|\bunlike\b|\bcompared to\b|\bcompared with\b|\bin contrast\b|\brather than\b|\binstead of\b|\bthe other options?\b|\bthe other two\b|\brejected options?\b|\balternatives?\b|\bother methods?\b|\bother strategies?\b|\bless effective\b|\bworse\b|\briskier\b|\btoo costly\b|\btoo slow\b|\btoo risky\b)/i.test(
      finalParagraph
    );

  const hasRejectedReason =
    /\b(fail\w*|cannot|could not|would not|does not|do not|lack\w*|negligible|inaccurate|bias\w*|demotivat\w*|delay\w*|risk\w*|debt|interest|loss|lose|damage\w*|erod\w*|squeez\w*|short[\s-]+term|too costly|more expensive|higher cost|lower demand|insufficient|limited|unreliable|conflict\w*|waste|worse|less effective)\b/i.test(
      finalParagraph
    );

  const explainsWhyRejectedWorse = hasRejectedComparisonMarker && hasRejectedReason;

  let ao4DeterministicCeiling = 0;
  if (makesClearChoice) {
    if (!hasGenericTradeOffStructure && !explainsWhyRejectedWorse) {
      // Generic assertion (e.g. "it is the best way") without weighing trade-offs -> max 1/3
      ao4DeterministicCeiling = 1;
    } else if (
      (weighsBenefitVsDrawbackInContext || (explainsWhyRejectedWorse && hasCaseContextInFinal)) &&
      finalWords >= 16
    ) {
      ao4DeterministicCeiling = 3;
    } else {
      ao4DeterministicCeiling = 2;
    }
  }

  return {
    finalParagraph,
    makesClearChoice,
    hasCaseContextInFinal,
    weighsBenefitVsDrawbackInContext,
    explainsWhyRejectedWorse,
    hasGenericTradeOffOnly: hasGenericTradeOffStructure && !hasCaseContextInFinal,
    ao4DeterministicCeiling,
    foundWords: finalEval.foundWords,
    judgmentCount: finalEval.judgmentCount,
    qualifierCount: finalEval.qualifierCount,
  };
}

const P2_CAUSAL_LINKS = [
  "this leads to",
  "which leads to",
  "leading to",
  "as a result",
  "consequently",
  "therefore",
  "this means that",
  "this means",
  "which means that",
  "which means",
  "meaning that",
  "resulting in",
  "results in",
  "in turn",
  "thereby",
  "so that",
  "because of this",
  "due to this",
  "could reduce",
  "could cause",
  "would reduce",
  "would cause",
  "making it",
  "forcing the business",
  "forcing it to",
  "enabling the business",
  "enabling them to",
  "enables the business",
  "allowing the business",
  "allows the business",
];

const P2_CAUSAL_VERBS_REGEX =
  /\b(leads?\s+to|causes?|causing|results?\s+in|resulting\s+in|reduces?|reducing|increases?|increasing|lowers?|lowering|raises?|raising|improves?|improving|boosts?|boosting|prevents?|preventing|avoids?|avoiding|protects?|protecting|preserves?|preserving|covers?|covering|worsens?|worsening|drives?|driving|squeezes?|squeezing|damages?|damaging|harms?|harming|delays?|delaying|forces?|forcing|allows?|allowing|enables?|enabling|ensures?|ensuring|helps?|helping|generates?|generating|erodes?|eroding|attracts?|attracting|retains?|retaining|hurts?|hurting|cuts?|cutting|stimulates?|stimulating|mitigates?|mitigating|elevates?|elevating|making\s+it|makes?\s+it\s+(?:harder|easier))\b/gi;

const P2_OPERATIONAL_MECHANISMS = [
  "defect", "defects", "rework", "error", "errors", "fault", "faults", "redesign", "redesigns",
  "waste", "wastage", "scrap", "quality", "reliability", "specifications", "requirements",
  "productivity", "efficiency", "efficient", "output", "orders", "capacity", "bottleneck", "delay", "delays",
  "motivation", "motivated", "demotivate", "demotivated", "morale", "absenteeism", "turnover",
  "customer service", "satisfaction", "dissatisfaction", "loyalty", "brand image", "reputation",
  "feedback", "accurate", "accuracy", "bias", "tailor", "customise", "customize", "innovation",
  "demand", "spending", "disposable income", "economies of scale", "workforce", "staff commitment",
  "working capital", "liquidity", "liquid assets", "overdraft", "cash reserve", "cash reserves",
  "reinvestment", "stock", "inventory", "training", "skills", "skilled", "speed",
  "workload", "communication", "decision-making", "decisions", "interest expense", "interest charges",
  "borrowing cost", "borrowing costs", "variable cost", "variable costs", "unit cost", "unit costs",
  "average cost", "short-term debt", "short-term debts", "mistakes", "service standards",
  "overheads", "fixed overheads", "cost", "costs", "recalibration", "contracts", "leads",
];

const P2_BUSINESS_IMPACTS = [
  "profit", "profits", "profitability", "profit margin", "profit margins", "gross margin", "net margin",
  "cash flow", "cashflow", "liquidity", "working capital", "insolvency", "bankruptcy", "survival", "survive",
  "failure", "failures", "sales", "revenue", "sales revenue", "sales volume", "market share",
  "competitors", "competitor", "competitiveness", "competitive advantage", "customer retention",
  "repeat purchase", "repeat sales", "loss of customers", "lose customers", "lose sales",
  "unit cost", "unit costs", "average cost", "rework cost", "rework costs", "break-even", "breakeven",
  "gearing", "return on capital", "retained profit", "retained profits", "funding", "finance charges",
  "interest costs", "interest charges", "net profit", "gross profit", "operating profit",
  "long-term growth", "market demand", "demand", "overheads", "cost", "costs", "output", "orders",
];

const BOTTOM_LINE_IMPACT_REGEX =
  /\b(profit(?:s|ability|\s+margin(?:s)?)?|net\s+profit|gross\s+profit|operating\s+profit|retained\s+profit|cash\s*flow|cashflow|liquidity|liquid\s+assets|competitiveness|competitive\s+advantage|market\s+share|survival|survive|insolvency|bankruptcy)\b/i;

const MITIGATION_CONTINGENCY_REGEX =
  /\b(provided that|depends on|depends upon|depending on|as long as|on condition that|only if|in the short term|in the short run|to overcome|to minimi[sz]e|to mitigate|can mitigate|helps? mitigate|mitigat(?:e|ing)|to offset|can offset|to counter|to reduce (?:the|this) (?:risk|drawback|cost|delay|bottleneck|shortage|burden|impact|disruption)|to limit (?:the|this) (?:risk|drawback|cost|delay|bottleneck|impact|disruption)|to manage (?:the|this) (?:risk|drawback|cost|delay|bottleneck|workload|impact)|to avoid (?:disrupting|delaying|overworking|losing)|by scheduling|by staggering|by allocating|by delegating|by outsourcing|by hiring|by phasing|by training|by retaining|negotiating|retain(?:ing)? a majority|board representation|stagger(?:ing)?|phased approach|off-peak|outside (?:core|peak) hours)\b/i;

export function detectMitigationOrContingency(text: string): boolean {
  return MITIGATION_CONTINGENCY_REGEX.test(text);
}

export interface Paper2ParagraphAnalysis {
  index: number;
  text: string;
  isConclusionLike: boolean;
  validatedChains: number;
  singleStepReasons: number;
  hasTwoSidedContrast: boolean;
  proHasCausal: boolean;
  conHasCausal: boolean;
  hasOperationalMechanism: boolean;
  hasBottomLineImpact: boolean;
}

export interface Paper2CausalChainScan {
  validatedChains: number;
  singleStepReasons: number;
  matchedChains: string[];
  rejectedCostSpeedCount: number;
  paragraphsWithAnalysis: number;
  paragraphsWithValidatedChains: number;
  paragraphDetails: Paper2ParagraphAnalysis[];
}

function extractCausalSignalsFromText(lower: string): {
  causalSignals: Set<string>;
  linkHits: string[];
  verbMatches: string[];
  basicMarkerMatches: string[];
} {
  const linkHits = P2_CAUSAL_LINKS.filter((l) => lower.includes(l));
  const verbMatches = lower.match(P2_CAUSAL_VERBS_REGEX) || [];
  const basicMarkerMatches = BASIC_REASON_MARKERS.filter((m) =>
    new RegExp(`\\b${m.replace(/\s+/g, "\\s+")}\\b`, "i").test(lower)
  );
  const causalSignals = new Set<string>([
    ...linkHits,
    ...verbMatches.map((v) => v.toLowerCase().trim()),
    ...basicMarkerMatches,
  ]);
  return { causalSignals, linkHits, verbMatches, basicMarkerMatches };
}

function extractBusinessOutcomeHits(lower: string): {
  opHits: string[];
  impactHits: string[];
  allHits: string[];
} {
  const opHits = P2_OPERATIONAL_MECHANISMS.filter((term) =>
    new RegExp(`\\b${escapeRegExp(term).replace(/\s+/g, "\\s+")}\\b`, "i").test(lower)
  );
  const impactHits = P2_BUSINESS_IMPACTS.filter((term) =>
    new RegExp(`\\b${escapeRegExp(term).replace(/\s+/g, "\\s+")}\\b`, "i").test(lower)
  );
  return {
    opHits,
    impactHits,
    allHits: Array.from(new Set([...opHits, ...impactHits])),
  };
}

/**
 * Paper 2 AO3 Analysis Chain Detector:
 * Detects both intra-sentence and cross-sentence consecutive two-step cause-and-effect chains
 * (Causal/Consequence language in consecutive sentences/clauses + business outcome),
 * tracks per-paragraph operational/bottom-line depth & two-sided chains,
 * while rejecting bare cost/speed assertions (e.g. "booth fees incur high costs", "it is cheap and quick").
 */
export function scanPaper2CausalChains(answer: string): Paper2CausalChainScan {
  const paragraphs = splitEssayParagraphs(answer);

  let validatedChains = 0;
  let singleStepReasons = 0;
  let rejectedCostSpeedCount = 0;
  const matchedChains: string[] = [];
  const analysisParagraphIndices = new Set<number>();
  const validatedChainParagraphIndices = new Set<number>();
  const paragraphDetails: Paper2ParagraphAnalysis[] = [];

  const analyzeUnit = (
    unitText: string
  ): { isTwoStep: boolean; isSingleStep: boolean; matchedLink?: string; isBareCostSpeed: boolean } => {
    const lower = unitText.toLowerCase();
    const words = lower.split(/\s+/).filter(Boolean).length;
    if (words < 5) {
      return { isTwoStep: false, isSingleStep: false, isBareCostSpeed: false };
    }

    const { causalSignals, linkHits, verbMatches, basicMarkerMatches } =
      extractCausalSignalsFromText(lower);
    const { opHits, impactHits, allHits } = extractBusinessOutcomeHits(lower);

    const hasBareCostOrSpeedLanguage =
      /\b(high(?:er)? costs?|incurs?\s+(?:high\s+)?(?:booth|travel|setup|initial)?\s*costs?|booth fees?|cheap and quick|quick and cheap|fast and cheap|cheap(?:er)?|quick(?:ly|er)?|saves?\s+(?:time|money)|costs?\s+a\s+lot|very\s+expensive|expensive|time[\s-]+consuming|minimal\s+cost|low\s+cost)\b/i.test(
        lower
      );

    // Reject bare cost/speed statements without any causal step or operational/commercial consequence
    if (
      hasBareCostOrSpeedLanguage &&
      causalSignals.size === 0 &&
      opHits.length === 0 &&
      impactHits.length === 0
    ) {
      return { isTwoStep: false, isSingleStep: false, isBareCostSpeed: true };
    }

    const clauses = unitText
      .split(/[,;]+/)
      .map((c) => c.trim().toLowerCase())
      .filter((c) => c.split(/\s+/).length >= 3);
    const clausesWithCausal = clauses.filter(
      (c) => extractCausalSignalsFromText(c).causalSignals.size >= 1
    ).length;

    const totalCausalSteps = causalSignals.size;
    const hasOperationalToCommercialBridge = opHits.length >= 1 && impactHits.length >= 1;
    const hasMultiOutcomeChain =
      allHits.length >= 2 && totalCausalSteps >= 2 && words >= 12;
    const hasMultiClauseCausalChain =
      clausesWithCausal >= 2 && allHits.length >= 1 && totalCausalSteps >= 2 && words >= 12;

    if (
      totalCausalSteps >= 2 &&
      (hasOperationalToCommercialBridge || hasMultiOutcomeChain || hasMultiClauseCausalChain) &&
      words >= 12
    ) {
      return {
        isTwoStep: true,
        isSingleStep: false,
        matchedLink: linkHits[0] || verbMatches[0]?.toLowerCase() || basicMarkerMatches[0],
        isBareCostSpeed: false,
      };
    }

    // 1-step operational or commercial consequence (still excludes bare cost/speed with no causal reasoning)
    if (
      totalCausalSteps >= 1 &&
      (opHits.length >= 1 || impactHits.length >= 1) &&
      !(hasBareCostOrSpeedLanguage && totalCausalSteps <= 1 && opHits.length === 0 && impactHits.length === 0)
    ) {
      return {
        isTwoStep: false,
        isSingleStep: true,
        matchedLink: linkHits[0] || verbMatches[0]?.toLowerCase() || basicMarkerMatches[0],
        isBareCostSpeed: false,
      };
    }

    return {
      isTwoStep: false,
      isSingleStep: false,
      isBareCostSpeed: hasBareCostOrSpeedLanguage,
    };
  };

  for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
    const para = paragraphs[pIdx];
    const pLower = para.toLowerCase();
    const sentences = para
      .split(/(?<=[.!?])\s+|[;\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const consumedIndices = new Set<number>();
    let paraValidatedChains = 0;
    let paraSingleStepReasons = 0;

    // First pass: check consecutive sentence pairs within each paragraph.
    // If two consecutive sentences BOTH contain causal/consequence language AND at least one
    // contains a business outcome (e.g. cost, output, orders, cash flow, liquidity, working capital,
    // overheads, failure, demand, profit, sales, competitors), count as 1 developed two-step causal chain.
    for (let i = 0; i < sentences.length - 1; i++) {
      if (consumedIndices.has(i) || consumedIndices.has(i + 1)) continue;

      const s1 = sentences[i];
      const s2 = sentences[i + 1];
      const s1Lower = s1.toLowerCase();
      const s2Lower = s2.toLowerCase();

      // Do not merge a Pro sentence with a contrasting Con sentence starting with "However, ..." / "On the other hand, ..."
      const s2StartsNewContrastSide =
        /^(?:however|on the other hand|conversely|nevertheless|nonetheless|in contrast|alternatively|still|yet)\b/i.test(
          s2
        );
      if (s2StartsNewContrastSide) continue;

      const sig1 = extractCausalSignalsFromText(s1Lower);
      const sig2 = extractCausalSignalsFromText(s2Lower);
      const out1 = extractBusinessOutcomeHits(s1Lower);
      const out2 = extractBusinessOutcomeHits(s2Lower);

      const bothContainCausalLanguage =
        sig1.causalSignals.size >= 1 && sig2.causalSignals.size >= 1;
      const hasOutcomeInPair = out1.allHits.length >= 1 || out2.allHits.length >= 1;

      if (bothContainCausalLanguage && hasOutcomeInPair) {
        validatedChains++;
        paraValidatedChains++;
        consumedIndices.add(i);
        consumedIndices.add(i + 1);
        analysisParagraphIndices.add(pIdx);
        validatedChainParagraphIndices.add(pIdx);
        const link =
          sig1.linkHits[0] ||
          sig2.linkHits[0] ||
          sig1.verbMatches[0]?.toLowerCase() ||
          sig2.verbMatches[0]?.toLowerCase() ||
          sig1.basicMarkerMatches[0] ||
          sig2.basicMarkerMatches[0];
        if (link) matchedChains.push(link);
        continue;
      }

      const continuesPrior =
        /^(?:this|which|as a result|consequently|therefore|in turn|thereby|thus|hence|meaning|it also|this also)\b/i.test(
          s2
        );
      if (continuesPrior) {
        const pairRes = analyzeUnit(`${s1} ${s2}`);
        if (pairRes.isTwoStep) {
          validatedChains++;
          paraValidatedChains++;
          consumedIndices.add(i);
          consumedIndices.add(i + 1);
          analysisParagraphIndices.add(pIdx);
          validatedChainParagraphIndices.add(pIdx);
          if (pairRes.matchedLink) matchedChains.push(pairRes.matchedLink);
        }
      }
    }

    // Second pass: evaluate remaining unconsumed individual sentences
    for (let i = 0; i < sentences.length; i++) {
      if (consumedIndices.has(i)) continue;
      const res = analyzeUnit(sentences[i]);
      if (res.isTwoStep) {
        validatedChains++;
        paraValidatedChains++;
        analysisParagraphIndices.add(pIdx);
        validatedChainParagraphIndices.add(pIdx);
        if (res.matchedLink) matchedChains.push(res.matchedLink);
      } else if (res.isSingleStep) {
        singleStepReasons++;
        paraSingleStepReasons++;
        analysisParagraphIndices.add(pIdx);
        if (res.matchedLink) matchedChains.push(res.matchedLink);
      } else if (res.isBareCostSpeed) {
        rejectedCostSpeedCount++;
      }
    }

    const isConclusionLike =
      pIdx === paragraphs.length - 1 &&
      paragraphs.length >= 3 &&
      /^(?:recommendation|conclusion|in conclusion|to conclude|overall|on balance|in summary|to sum up|i recommend|[\w\s&'.-]+?\s+should choose)\b/i.test(
        para
      );

    const contrastMatch = para.match(
      /\b(?:however|on the other hand|whereas|although|conversely|nevertheless|nonetheless|even though|in contrast|yet)\b/i
    );
    let hasTwoSidedContrast = false;
    let proHasCausal = false;
    let conHasCausal = false;
    if (contrastMatch && typeof contrastMatch.index === "number") {
      const proHalf = para.slice(0, contrastMatch.index).trim();
      const conHalf = para.slice(contrastMatch.index).trim();
      if (
        proHalf.split(/\s+/).filter(Boolean).length >= 6 &&
        conHalf.split(/\s+/).filter(Boolean).length >= 6
      ) {
        hasTwoSidedContrast = true;
        proHasCausal = extractCausalSignalsFromText(proHalf.toLowerCase()).causalSignals.size >= 1;
        conHasCausal = extractCausalSignalsFromText(conHalf.toLowerCase()).causalSignals.size >= 1;
      }
    }

    const { opHits } = extractBusinessOutcomeHits(pLower);
    const hasOperationalMechanism = opHits.length >= 1;
    const hasBottomLineImpact = BOTTOM_LINE_IMPACT_REGEX.test(pLower);

    paragraphDetails.push({
      index: pIdx,
      text: para,
      isConclusionLike,
      validatedChains: paraValidatedChains,
      singleStepReasons: paraSingleStepReasons,
      hasTwoSidedContrast,
      proHasCausal,
      conHasCausal,
      hasOperationalMechanism,
      hasBottomLineImpact,
    });
  }

  return {
    validatedChains,
    singleStepReasons,
    matchedChains: Array.from(new Set(matchedChains)),
    rejectedCostSpeedCount,
    paragraphsWithAnalysis: analysisParagraphIndices.size,
    paragraphsWithValidatedChains: validatedChainParagraphIndices.size,
    paragraphDetails,
  };
}

const JACCARD_STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being", "to", "of",
  "in", "for", "on", "with", "and", "or", "that", "this", "it", "its", "as", "by",
  "from", "can", "will", "would", "could", "should", "also", "which", "so", "they",
  "them", "their", "have", "has", "had", "into", "more", "than",
]);

function normalizeTokensForJaccard(sentence: string): Set<string> {
  const cleaned = sentence
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !JACCARD_STOPWORDS.has(w));
  return new Set(cleaned);
}

/**
 * Computes normalized Jaccard token similarity between two sentences.
 */
export function computeSentenceJaccardSimilarity(a: string, b: string): number {
  const setA = normalizeTokensForJaccard(a);
  const setB = normalizeTokensForJaccard(b);
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const tok of setA) {
    if (setB.has(tok)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union > 0 ? intersection / union : 0;
}

/**
 * Anti-Double-Counting Guard:
 * Splits student answer into clauses/sentences and removes near-duplicate repetitions
 * (Jaccard token similarity > 0.70) so restating the same idea twice earns at most 1 AO1 mark.
 */
export function deduplicateRepeatedSentences(answer: string): {
  uniqueSentences: string[];
  deduplicatedText: string;
  duplicateCount: number;
  maxSimilarity: number;
} {
  const sentences = answer
    .split(/(?<=[.!?])\s+|[;\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 4);

  const uniqueSentences: string[] = [];
  let duplicateCount = 0;
  let maxSimilarity = 0;

  for (const s of sentences) {
    let isDuplicate = false;
    for (const prev of uniqueSentences) {
      const sim = computeSentenceJaccardSimilarity(s, prev);
      if (sim > maxSimilarity) maxSimilarity = sim;
      if (sim > 0.7) {
        isDuplicate = true;
        break;
      }
    }
    if (isDuplicate) {
      duplicateCount++;
    } else {
      uniqueSentences.push(s);
    }
  }

  return {
    uniqueSentences,
    deduplicatedText: uniqueSentences.join(". "),
    duplicateCount,
    maxSimilarity,
  };
}

/**
 * Rejects pure vague filler (e.g. "it saves money", "customers will be happy", "good for the business")
 * with no specific business mechanism so neither 0.8B nor 2B can award marks to fluff.
 */
export function isPureVagueFillerAnswer(answer: string): boolean {
  const lower = answer.toLowerCase().trim();
  if (!lower) return true;
  const words = lower.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;

  const VAGUE_EXTRA = new Set([
    "save", "saves", "saving", "saved", "happy", "happier", "good", "bad", "nice",
    "easy", "easier", "fast", "faster", "cheap", "cheaper", "quick", "quicker",
    "thing", "things", "stuff", "lot", "lots", "very", "really", "always", "never",
    "everyone", "everything", "something", "anything", "help", "helps", "helpful",
    "useful", "important", "successful", "success", "work", "works", "working",
    "run", "runs", "running", "grow", "grows", "growing", "growth",
  ]);

  const specificWords = words.filter(
    (w) =>
      w.length >= 4 &&
      !GENERIC_FILLER_WORDS.has(w) &&
      !VAGUE_EXTRA.has(w)
  );

  // Accept valid economic/business concepts and concise 2-4 word syllabus points
  if (specificWords.length >= 2) return false;
  if (words.length <= 4 && specificWords.length >= 1 && countSyllabusTerms(lower) >= 1) {
    return false;
  }

  // Reject vague filler with no specific mechanism/concept vocabulary
  return true;
}

const AO3_CONNECTIVE_PATTERNS: Array<{ label: string; regex: RegExp }> = [
  { label: "because", regex: /\bbecause\b/i },
  { label: "since", regex: /\bsince\b/i },
  { label: "therefore", regex: /\btherefore\b/i },
  { label: "which leads to", regex: /\bwhich leads to\b/i },
  { label: "this leads to", regex: /\bthis leads to\b/i },
  { label: "leading to", regex: /\bleading to\b/i },
  { label: "resulting in", regex: /\bresulting in\b/i },
  { label: "results in", regex: /\bresults in\b/i },
  { label: "so that", regex: /\bso that\b/i },
  { label: "as a result", regex: /\bas a result\b/i },
  { label: "consequently", regex: /\bconsequently\b/i },
  { label: "this means", regex: /\bthis means\b/i },
  { label: "which means", regex: /\bwhich means\b/i },
  { label: "meaning that", regex: /\bmeaning that\b/i },
  { label: "could reduce", regex: /\bcould reduce\b/i },
  { label: "could cause", regex: /\bcould cause\b/i },
  { label: "making it", regex: /\bmaking it\b/i },
  { label: "increasing", regex: /\bincreasing\b/i },
  { label: "increases", regex: /\bincreases\b/i },
  { label: "reducing", regex: /\breducing\b/i },
  { label: "reduces", regex: /\breduces\b/i },
  { label: "lowering", regex: /\blowering\b/i },
  { label: "lowers", regex: /\blowers\b/i },
  { label: "raises", regex: /\braises\b/i },
  { label: "improves", regex: /\bimproves\b/i },
  { label: "prevents", regex: /\bprevents\b/i },
  { label: "avoids", regex: /\bavoids\b/i },
  { label: "preserves", regex: /\bpreserv(?:e|es|ing)\b/i },
  { label: "covers", regex: /\bcover(?:s|ing)?\b/i },
  { label: "worsens", regex: /\bworsen(?:s|ing)?\b/i },
  { label: "delay", regex: /\bdelay(?:s|ing)?\b/i },
  { label: "ensures", regex: /\bensur(?:e|es|ing)\b/i },
  { label: "enables", regex: /\benabl(?:e|es|ing)\b/i },
  { label: "allows", regex: /\ballow(?:s|ing)?\b/i },
  { label: "helping", regex: /\bhelp(?:s|ing)?\b/i },
  { label: "thereby", regex: /\bthereby\b/i },
];

const AO3_MECHANISM_TERMS = Array.from(
  new Set([
    ...P2_OPERATIONAL_MECHANISMS,
    ...P2_BUSINESS_IMPACTS,
    "cost per unit",
    "cost per item",
    "economies of scale",
    "cash inflow",
    "cash outflow",
    "brand loyalty",
    "repeat purchases",
    "market competitiveness",
    "production cost",
    "production costs",
    "fixed costs",
    "variable costs",
    "labor productivity",
    "labour productivity",
    "employee retention",
    "staff turnover",
    "debt burden",
    "interest payments",
    "capital expenditure",
    "customer base",
    "selling price",
    "added value",
  ])
);

/**
 * Causal Connectives Guardrail for AO3:
 * Requires BOTH an explanatory/causal connective ('because', 'since', 'therefore', 'which leads to',
 * 'resulting in', 'so that', 'as a result', 'ensures', 'allowing', 'helping', 'reducing', etc.)
 * AND a specific business mechanism/outcome (not vague filler or a simple list).
 */
export function hasAo3CausalConnectiveAndMechanism(text: string): {
  passed: boolean;
  connectivesFound: string[];
  mechanismsFound: string[];
} {
  const lower = text.toLowerCase();
  const connectivesFound: string[] = [];
  for (const c of AO3_CONNECTIVE_PATTERNS) {
    if (c.regex.test(lower)) connectivesFound.push(c.label);
  }
  const mechanismsFound: string[] = [];
  for (const m of AO3_MECHANISM_TERMS) {
    const reg = new RegExp(`\\b${escapeRegExp(m)}\\b`, "i");
    if (reg.test(lower)) mechanismsFound.push(m);
  }
  return {
    passed: connectivesFound.length >= 1 && mechanismsFound.length >= 1,
    connectivesFound,
    mechanismsFound,
  };
}

export interface DeterministicAo4Result {
  score: number;
  max: number;
  hasClearDecision: boolean;
  hasTwoSidedContrast: boolean;
  weighsBothSides: boolean;
  hasBecauseCaseJustification: boolean;
  explainsChosenOverAlternatives: boolean;
  feedback: string;
}

/**
 * Deterministic AO4 Evaluation Engine (Paper 1 8m [max 2] and Paper 2 12m [max 3]):
 * - Preserves AO1: 2, AO2: 3, AO3: 4, AO4: 3 for 12-mark questions.
 * - On 12m, inspects strictly the ENTIRE FINAL PARAGRAPH (including "Recommendation" heading & openers).
 * - Awards 2/3 or 3/3 when AO3 >= 2 and the final paragraph clearly chooses an option AND weighs
 *   trade-offs / rejects alternatives using comparative contrast words paired with case-study figures.
 * - Bare generic assertions ("it is the best way") score max 1/3; AO3 === 1 caps AO4 at 1/3; AO3 === 0 caps AO4 at 0.
 */
export function evaluateDeterministicAo4(opts: {
  answer: string;
  marks: 8 | 12;
  ao2Score: number;
  ao3Score: number;
  effectiveAppWords: string[];
  caseContext: string;
  finalParagraphOverride?: string;
}): DeterministicAo4Result {
  const { answer, marks, ao2Score, ao3Score, effectiveAppWords, caseContext, finalParagraphOverride } = opts;
  const max = marks === 12 ? 3 : 2;
  const finalParagraph =
    finalParagraphOverride !== undefined ? finalParagraphOverride.trim() : extractFinalParagraph(answer);
  const finalLower = finalParagraph.toLowerCase();
  const finalWords = finalParagraph ? finalParagraph.split(/\s+/).filter(Boolean).length : 0;

  const clearDecisionRegex =
    /\b(overall|i recommend|recommend(?:ation)?|the advantages outweigh|advantages outweigh|benefits outweigh|outweigh(?:s)?|should choose|should use|should select|should adopt|should invest|should focus|must choose|i choose|we choose|in conclusion|to conclude|on balance|is best|are best|best option|better option|better choice|preferable|most suitable|more suitable)\b/i;

  const twoSidedContrastRegex =
    /\b(however|on the other hand|whereas|although|meanwhile|despite|nevertheless|nonetheless|even though|in contrast|conversely|alternatively|while)\b/i;

  // Scope final recommendation & weighing checks strictly to finalParagraph (no spillover from body paragraphs)
  const decisionTarget = finalParagraph;
  const hasClearDecision = clearDecisionRegex.test(decisionTarget);
  const hasTwoSidedContrastInEssay = twoSidedContrastRegex.test(answer);
  const hasTwoSidedContrastInFinal = twoSidedContrastRegex.test(finalParagraph);

  // Weighing both sides: contrast + drawback/limitation + benefit/business impact in final paragraph ONLY
  const weighTarget = finalParagraph;
  const hasDrawbackTerms =
    /\b(cost\w*|expensive|too\s+expensive|too\s+costly|fee\w*|risk\w*|drawback\w*|disadvantage\w*|limitation\w*|short[\s-]+term|interest|debt|overdraft|training|burden|loss|strain|capital|delay\w*|time[\s-]+consuming|takes?\s+(?:longer|time)|lacks?|divert\w*|pulls?\s+away|dilut\w*|loss\s+of\s+control|shared\s+control)\b/i.test(
      weighTarget
    );
  const hasBenefitTerms =
    /\b(profit\w*|revenue\w*|sales|demand|cash\s*flow|cashflow|liquidity|working\s+capital|quality|defect\w*|rework|redesign\w*|brand|reputation|loyalty|customer\w*|retention|growth|survival|efficiency|productivity|long[\s-]+term|unit\s+cost\w*|specifications?|accurate|precision|prevents?|protects?|preserves?|covers?|output|orders)\b/i.test(
      weighTarget
    );
  const hasExplicitWeighingPhrase =
    /\b(outweigh\w*|offset\w*|greater than|more important than|even though|despite|although|however|on the other hand|whereas|meanwhile)\b/i.test(
      weighTarget
    ) ||
    (/\bshort[\s-]+term\b/i.test(weighTarget) && /\blong[\s-]+term\b/i.test(weighTarget)) ||
    /\bwhile\b[^.!?;]{4,110}\b(?:cost\w*|expensive|fee\w*|time|delay\w*|risk\w*|drawback\w*|disadvantage\w*|limit\w*|interest|overdraft|training|capital|burden|loss|strain|lacks?|dilut\w*)\b/i.test(
      weighTarget
    );

  const weighsBothSides =
    (hasTwoSidedContrastInFinal || hasExplicitWeighingPhrase) &&
    hasDrawbackTerms &&
    hasBenefitTerms;

  // Check justification with "because / since / given / as" linked to a case detail in the conclusion paragraph ONLY
  const hasCausalJustificationMarker =
    /\b(because|since|given\s+(?:that|bct|the|its|their|his|her|[A-Z][a-z]+)|as\s+(?:the|it|this|they|there|demand|sales|costs?|their|her|his))\b/i.test(
      weighTarget
    );
  const caseCheckInFinal = detectCaseContext(weighTarget, {
    validAppWords: effectiveAppWords,
    caseContext,
    ao2Max: max,
  });
  const hasNumberInFinal =
    /(?:\$\s*\d[\d,.]*(?:k|m|million)?|\b\d+(?:\.\d+)?%|\b\d+(?:\.\d+)?:1\b|\b\d[\d,]*(?:\.\d+)?\s*(?:units?|bio-engineers?|engineers?|hours?|months?|years?|million)\b)/i.test(
      weighTarget
    );
  const hasCaseDetailInDecision =
    caseCheckInFinal.foundWords.length >= 1 || hasNumberInFinal || effectiveAppWords.length === 0;
  const hasBecauseCaseJustification = hasCausalJustificationMarker && hasCaseDetailInDecision;

  // On 12m, check whether final paragraph explains why chosen option is better than rejected alternatives
  const hasAltComparisonMarker =
    /\b(whereas|meanwhile|unlike|compared to|compared with|in contrast|rather than|instead of|other options?|other two|other methods?|other strategies?|alternatives?|rejected|less effective|worse|riskier|too expensive(?:\s+given)?|too costly(?:\s+given)?|too slow|too risky|better than|more effective than|lacks?)\b/i.test(
      finalLower
    );
  const hasAltReason =
    /\b(fail\w*|cannot|could not|would not|does not|do not|lacks?|inaccurate|bias\w*|demotivat\w*|delay\w*|risk\w*|debt|interest|overdraft|cash|loss|lose|damage\w*|erod\w*|squeez\w*|short[\s-]+term|too expensive|too costly|more expensive|higher cost|insufficient|limited|unreliable|worse|less effective|slower|dilut\w*|control|feedback)\b/i.test(
      finalLower
    );
  const explainsChosenOverAlternatives =
    hasAltComparisonMarker && (hasAltReason || hasCaseDetailInDecision);

  // Hard rule: no AO4 marks if AO3 === 0 (or no context on Paper 2)
  if (ao3Score === 0 || (marks === 12 && ao2Score === 0)) {
    return {
      score: 0,
      max,
      hasClearDecision,
      hasTwoSidedContrast: hasTwoSidedContrastInEssay,
      weighsBothSides,
      hasBecauseCaseJustification,
      explainsChosenOverAlternatives,
      feedback: `AO4 score: 0/${max} (Level 1 Gate: AO3 analysis and case application required before earning AO4 evaluation).`,
    };
  }

  const hasMitigationOrContingency = detectMitigationOrContingency(finalParagraph);

  if (marks === 8) {
    // Paper 1 8-mark Conclusion (Max 2):
    // - 1/2: Clear decision/choice OR basic two-sided reason
    // - 2/2: Clear decision/choice AND justified comparison explaining WHY chosen option is better
    //        than the rejected option using case context INSIDE Conclusion (or contextual trade-off + mitigation)
    if (
      hasClearDecision &&
      hasCaseDetailInDecision &&
      ((explainsChosenOverAlternatives && hasBecauseCaseJustification) ||
        (weighsBothSides && hasBecauseCaseJustification && hasMitigationOrContingency))
    ) {
      return {
        score: 2,
        max: 2,
        hasClearDecision,
        hasTwoSidedContrast: hasTwoSidedContrastInEssay,
        weighsBothSides,
        hasBecauseCaseJustification,
        explainsChosenOverAlternatives,
        feedback:
          "Full evaluation marks (2/2): Clear choice with justified comparison in case context inside the Conclusion paragraph.",
      };
    }
    if (
      hasClearDecision &&
      (hasTwoSidedContrastInEssay || weighsBothSides) &&
      hasBecauseCaseJustification
    ) {
      return {
        score: 1,
        max: 2,
        hasClearDecision,
        hasTwoSidedContrast: hasTwoSidedContrastInEssay,
        weighsBothSides,
        hasBecauseCaseJustification,
        explainsChosenOverAlternatives,
        feedback:
          "Partial evaluation (1/2): Clear decision and reasoning in context. For 2/2, explicitly compare WHY your choice is better than the rejected option using case context inside the Conclusion paragraph.",
      };
    }
    if (hasClearDecision && (hasTwoSidedContrastInFinal || hasBecauseCaseJustification)) {
      return {
        score: 1,
        max: 2,
        hasClearDecision,
        hasTwoSidedContrast: hasTwoSidedContrastInFinal,
        weighsBothSides,
        hasBecauseCaseJustification,
        explainsChosenOverAlternatives,
        feedback:
          "Partial evaluation (1/2): Decision or contrast shown in Conclusion; justify why it is better than the rejected option using case context for 2/2.",
      };
    }
    if (hasClearDecision && finalWords >= 6) {
      return {
        score: 1,
        max: 2,
        hasClearDecision,
        hasTwoSidedContrast: hasTwoSidedContrastInFinal,
        weighsBothSides,
        hasBecauseCaseJustification,
        explainsChosenOverAlternatives,
        feedback:
          "Partial evaluation (1/2): Clear choice stated in Conclusion, but lacks justified case-context comparison against the rejected option.",
      };
    }
    return {
      score: 0,
      max: 2,
      hasClearDecision,
      hasTwoSidedContrast: hasTwoSidedContrastInEssay,
      weighsBothSides,
      hasBecauseCaseJustification,
      explainsChosenOverAlternatives,
      feedback:
        "AO4 score: 0/2: Missing evaluative decision and contextual comparison inside the Conclusion paragraph.",
    };
  }

  // Paper 2 12-mark: max 3 (scoped strictly to FINAL PARAGRAPH)
  // - 2/3: Clear recommendation weighing/rejecting alternatives with comparative contrast + case figures (once AO3 >= 2)
  // - 3/3: ONLY when Recommendation ALSO addresses how to mitigate/manage chosen option's main drawback or states a contextual contingency
  let rawScore = 0;
  let feedback = `AO4 score: 0/3: Missing evaluative judgment or two-sided contrast in final paragraph.`;

  if (
    hasClearDecision &&
    hasCaseDetailInDecision &&
    finalWords >= 16 &&
    weighsBothSides &&
    (explainsChosenOverAlternatives || hasBecauseCaseJustification) &&
    hasMitigationOrContingency
  ) {
    rawScore = 3;
    feedback =
      "Full evaluation marks (3/3): Final paragraph clearly chooses an option, weighs trade-offs and rejected alternatives with case figures, and addresses how to mitigate/manage the chosen option's main drawback or contingency.";
  } else if (
    hasClearDecision &&
    finalWords >= 12 &&
    (weighsBothSides ||
      explainsChosenOverAlternatives ||
      (hasTwoSidedContrastInFinal && hasCaseDetailInDecision) ||
      hasBecauseCaseJustification)
  ) {
    rawScore = 2;
    feedback =
      "Developed evaluation (2/3): Clear recommendation weighing/rejecting alternatives in case context. To unlock 3/3, also explain how to mitigate/manage the chosen option's main drawback in context or state a contextual condition ('provided that', 'depends on', 'to overcome').";
  } else if (hasClearDecision) {
    rawScore = 1;
    feedback =
      "Basic evaluation (1/3): Generic choice stated in final paragraph without weighing trade-offs or comparing alternatives with case figures.";
  } else if (hasTwoSidedContrastInEssay) {
    rawScore = 1;
    feedback =
      "Basic evaluation (1/3): Two-sided contrast noted; add a clear recommendation weighing alternatives in the final paragraph for 2–3/3.";
  }

  const finalScore = ao3Score === 1 ? Math.min(rawScore, 1) : rawScore;
  if (ao3Score === 1 && rawScore > 1) {
    feedback =
      "AO4 capped at 1/3 (Level 2 Gate): Develop multi-step AO3 analysis across options (AO3 >= 2) to unlock 2–3/3 AO4 evaluation.";
  }

  return {
    score: finalScore,
    max: 3,
    hasClearDecision,
    hasTwoSidedContrast: hasTwoSidedContrastInEssay,
    weighsBothSides,
    hasBecauseCaseJustification,
    explainsChosenOverAlternatives,
    feedback,
  };
}

export const evaluateAO4Deterministically = evaluateDeterministicAo4;

/**
 * Strips bracket annotations like [K], [APP], [AN], [EVAL], [1], [2], [4]
 * and normalizes whitespace for exact model answer comparison.
 */
export function stripAoAnnotations(text: string): string {
  return text
    .replace(/\[(?:k|app|an|eval|ao1|ao2|ao3|ao4|1|2|3|4|6|8)\]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Tests whether candidate text substantially reproduces the full official model answer.
 * Strictly requires >= 85% coverage of the FULL model answer (never triggers on short substrings).
 */
export function checkIsExactOrSubstantialModelAnswer(
  candidateText: string,
  modelAnswer?: string
): boolean {
  if (!modelAnswer) return false;

  const candidateClean = stripAoAnnotations(candidateText).toLowerCase();
  const modelClean = stripAoAnnotations(modelAnswer).toLowerCase();

  if (candidateClean.length < 15) return false;

  // 1. Exact full match
  if (candidateClean === modelClean) return true;

  // 2. Candidate contains the entire model answer
  if (modelClean.length >= 25 && candidateClean.includes(modelClean)) return true;

  // 3. Model contains candidate ONLY if candidate covers >= 85% of the full model answer
  if (
    candidateClean.length >= Math.max(40, Math.floor(modelClean.length * 0.85)) &&
    modelClean.includes(candidateClean)
  ) {
    return true;
  }

  // 4. Normalized alphanumeric equality
  const candAlpha = candidateClean.replace(/[^a-z0-9]/g, "");
  const modAlpha = modelClean.replace(/[^a-z0-9]/g, "");
  if (candAlpha.length >= 25 && candAlpha === modAlpha) return true;

  // 5. Substantial full-answer overlap (>= 85% of model words AND comparable length)
  const modWords = modelClean
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9]/g, ""))
    .filter((w) => w.length >= 3 && !GENERIC_FILLER_WORDS.has(w));

  const candWordsList = candidateClean
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9]/g, ""))
    .filter((w) => w.length >= 3 && !GENERIC_FILLER_WORDS.has(w));

  if (modWords.length >= 5 && candWordsList.length >= Math.floor(modWords.length * 0.7)) {
    const candWordSet = new Set(candWordsList);
    const matched = modWords.filter((w) => candWordSet.has(w)).length;
    if (matched / modWords.length >= 0.85) {
      return true;
    }
  }

  return false;
}

/**
 * Checks how closely the student's answer matches specific syllabus knowledge points
 * from the Cambridge 0264 mark scheme and domain concepts in the model answer.
 */
export function checkKnowledgePointMatches(
  studentAnswer: string,
  knowledgePoints?: string[],
  modelAnswer?: string
): {
  matchedCount: number;
  matchedPoints: string[];
  totalPoints: number;
  domainOverlapCount: number;
  domainOverlapRatio: number;
  isFullMatch: boolean;
  feedback: string;
} {
  const normText = normalizeForMatching(studentAnswer);
  const studentWordSet = new Set(
    normText
      .split(/\s+/)
      .map((w) => w.replace(/[^a-z0-9]/g, ""))
      .filter((w) => w.length >= 3)
  );
  let matchedCount = 0;
  const matchedPoints: string[] = [];

  // Helper to check if a word or its singular/plural root is in student's answer
  const hasConceptWord = (w: string): boolean => {
    const clean = w.replace(/[^a-z0-9]/g, "");
    if (!clean || clean.length < 3) return false;
    if (studentWordSet.has(clean)) return true;
    if (clean.length >= 5) {
      const stem = clean.endsWith("s") ? clean.slice(0, -1) : clean;
      if (normText.includes(stem)) return true;
    }
    return false;
  };

  const validKps = (knowledgePoints || []).filter((kp) => kp && kp.trim().length > 0);
  if (validKps.length > 0) {
    for (const kp of validKps) {
      // Mark scheme points often look like "industrialization/technology growth" or "land, labor, capital, enterprise"
      const branches = kp
        .toLowerCase()
        .split(/[\/;]+/)
        .map((t) => t.trim())
        .filter((t) => t.length >= 3);

      const isMatched = branches.some((branch) => {
        const words = branch
          .replace(/[^a-z0-9\s]/g, " ")
          .split(/\s+/)
          .map((w) => w.trim())
          .filter((w) => w.length >= 3 && !GENERIC_FILLER_WORDS.has(w));

        if (words.length === 0) {
          // Fallback to literal words if all were common
          const rawWords = branch.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length >= 3);
          return rawWords.length > 0 && rawWords.every(hasConceptWord);
        }

        const hits = words.filter(hasConceptWord).length;
        // Require majority (>= 60%) of domain concept words in the branch (or all if <= 2 words)
        const required = words.length <= 2 ? words.length : Math.ceil(words.length * 0.6);
        return hits >= required;
      });

      if (isMatched) {
        matchedCount++;
        matchedPoints.push(kp);
      }
    }
  }

  // Domain-specific vocabulary overlap against model answer (excluding generic words)
  let domainOverlapCount = 0;
  let domainOverlapRatio = 0;
  if (modelAnswer) {
    const modelClean = stripAoAnnotations(modelAnswer).toLowerCase();
    const modelDomainWords = Array.from(
      new Set(
        modelClean
          .replace(/[^a-z0-9\s]/g, " ")
          .split(/\s+/)
          .filter((w) => w.length >= 4 && !GENERIC_FILLER_WORDS.has(w))
      )
    );

    if (modelDomainWords.length > 0) {
      domainOverlapCount = modelDomainWords.filter(hasConceptWord).length;
      domainOverlapRatio = domainOverlapCount / modelDomainWords.length;
    }
  }

  let isFullMatch = false;
  if (validKps.length >= 2) {
    isFullMatch = matchedCount >= 2;
  } else if (validKps.length === 1) {
    isFullMatch = matchedCount >= 1 && (domainOverlapCount >= 3 || domainOverlapRatio >= 0.35);
  } else {
    isFullMatch = domainOverlapCount >= 5 && domainOverlapRatio >= 0.4;
  }

  return {
    matchedCount,
    matchedPoints,
    totalPoints: validKps.length,
    domainOverlapCount,
    domainOverlapRatio,
    isFullMatch,
    feedback: isFullMatch
      ? "Directly matches Cambridge 0264 mark scheme knowledge points."
      : matchedCount > 0 || domainOverlapCount >= 2
      ? "Partial knowledge alignment with mark scheme."
      : "Limited syllabus knowledge aligned to this question's mark scheme.",
  };
}

/**
 * Checks calculation questions by extracting target calculated values from modelAnswer
 * (excluding numbers that were already given verbatim in the question/case stem).
 */
function checkCalculationAccuracy(
  studentAnswer: string,
  questionPrompt: string,
  caseContext: string,
  modelAnswer?: string,
  markSchemeText?: string
): { isCalculation: boolean; matchedOutputs: number; expectedOutputs: number; hasWorking: boolean } {
  const isCalc = /\bcalculate\b/i.test(questionPrompt) || Boolean(markSchemeText && /working_marks/i.test(markSchemeText));
  if (!isCalc) {
    return { isCalculation: false, matchedOutputs: 0, expectedOutputs: 0, hasWorking: false };
  }

  const givenNumbers = new Set(
    ((questionPrompt + " " + caseContext).match(/-?\d[\d,]*(?:\.\d+)?/g) || []).map((n) =>
      n.replace(/,/g, "")
    )
  );
  const sourceText = `${modelAnswer || ""} ${markSchemeText || ""}`;
  const modelNumbers = Array.from(
    new Set(
      (sourceText.match(/-?\d[\d,]*(?:\.\d+)?/g) || [])
        .map((n) => n.replace(/,/g, ""))
        .filter((n) => !givenNumbers.has(n) && n !== "1" && n !== "2" && n !== "4" && n !== "8")
    )
  );

  const studentNumbers = new Set(
    (studentAnswer.match(/-?\d[\d,]*(?:\.\d+)?/g) || []).map((n) => n.replace(/,/g, ""))
  );

  let matchedOutputs = 0;
  for (const target of modelNumbers) {
    if (studentNumbers.has(target) || studentAnswer.replace(/,/g, "").includes(target)) {
      matchedOutputs++;
    }
  }

  const hasWorking = /[=\/×÷*]|\bdivide\b|\bdivided\b|\bminus\b|\bplus\b|\bformula\b/i.test(studentAnswer);
  return {
    isCalculation: true,
    matchedOutputs,
    expectedOutputs: modelNumbers.length,
    hasWorking,
  };
}

const BUSINESS_SYLLABUS_TERMS = [
  "profit", "revenue", "turnover", "liquidity", "cash flow", "overdraft", "working capital",
  "economies of scale", "diseconomies of scale", "branding", "brand", "quality", "lean",
  "productivity", "efficiency", "division of labor", "division of labour", "specialization",
  "motivation", "training", "recruitment", "turnover", "stakeholder", "added value",
  "fixed cost", "variable cost", "break-even", "breakeven", "margin", "contribution",
  "partnership", "sole trader", "limited liability", "private limited", "public limited",
  "plc", "ltd", "shareholder", "dividend", "equity", "retained profit",
  "exchange rate", "inflation", "interest rate", "tax", "tariff", "quota", "recession",
  "ethics", "ethical", "sustainable", "sustainability", "environment", "export", "import",
  "factors of production", "land", "labor", "labour", "capital", "enterprise",
  "primary sector", "secondary sector", "tertiary sector", "industrialization",
  "joint venture", "franchise", "franchisor", "franchisee", "market research",
  "focus group", "segmentation", "elasticity", "penetration pricing", "skimming",
  "dynamic pricing", "competitive pricing", "promotion", "distribution", "e-commerce",
  "job enrichment", "job rotation", "delegation", "autocratic", "democratic", "laissez-faire",
  "batch production", "flow production", "job production", "automation", "kaizen",
  "current ratio", "acid test", "gross profit", "net profit", "inventory", "receivables",
  "primary research", "secondary research", "qualitative", "quantitative", "sample", "bias",
  "competitiveness", "unit cost", "fixed overheads", "customer loyalty", "market share", "target market",
  "prototype", "cash",
];

function countSyllabusTerms(lowerText: string): number {
  let count = 0;
  for (const term of BUSINESS_SYLLABUS_TERMS) {
    if (lowerText.includes(term)) count++;
  }
  return count;
}

/**
 * Broad Cambridge IGCSE Business (0264) concept lexicon.
 * Used to credit valid syllabus points even when the candidate writes a short
 * single-sentence paraphrase instead of textbook-exact wording.
 */
const CAMBRIDGE_KNOWLEDGE_CONCEPTS: string[] = Array.from(
  new Set([
    ...BUSINESS_SYLLABUS_TERMS,
    "continuity", "continuity of existence", "existence", "survival", "going concern",
    "limited liability", "unlimited liability", "legal personality", "separate legal identity",
    "ownership", "owner control", "control", "independence", "autonomy", "privacy",
    "peace of mind", "financial security", "security", "flexibility", "diversification",
    "risk sharing", "shared risk", "spread risk", "expertise", "experience", "specialisation",
    "specialization", "division of labour", "division of labor", "opportunity cost",
    "added value", "stakeholder", "shareholder", "dividend", "retained profit",
    "working capital", "cash flow", "cashflow", "liquidity", "profit margin",
    "gross profit", "net profit", "break-even", "breakeven", "margin of safety",
    "fixed cost", "fixed costs", "variable cost", "variable costs", "unit cost", "unit costs",
    "average cost", "economies of scale", "diseconomies of scale", "supply chain",
    "logistics", "market research", "primary research", "secondary research",
    "market segmentation", "marketing mix", "product life cycle", "branding", "brand image",
    "promotion", "distribution", "e-commerce", "recruitment", "selection", "training",
    "motivation", "remuneration", "job satisfaction", "job rotation", "job enrichment",
    "delegation", "leadership", "autocratic", "democratic", "laissez-faire", "trade union",
    "industrial action", "production", "batch production", "flow production",
    "job production", "lean production", "quality control", "quality assurance",
    "stock control", "automation", "capacity utilisation", "location", "offshoring",
    "outsourcing", "globalisation", "globalization", "exchange rate", "inflation",
    "interest rate", "tax", "tariff", "quota", "recession", "ethics", "ethical",
    "sustainability", "sustainable", "corporate social responsibility", "stakeholder conflict",
    "business plan", "cash flow forecast", "break-even chart", "source of finance",
    "internal finance", "external finance", "loan", "overdraft", "trade credit", "leasing",
    "hire purchase", "venture capital", "share issue", "crowdfunding", "microfinance",
    "grant", "subsidy", "partnership", "sole trader", "private limited company",
    "public limited company", "franchise", "joint venture", "merger", "takeover",
    "organic growth", "external growth", "vertical integration", "horizontal integration",
    "conglomerate", "customer base", "customer loyalty", "repeat purchase", "sales leads",
    "demand", "supply", "output", "productivity", "efficiency", "capacity", "quality",
    "reputation", "goodwill", "competitiveness", "competitive advantage", "market share",
  ])
);

const GENERAL_MECHANISM_TERMS = [
  "debt", "repayment", "repayments", "debt repayments", "borrowing", "borrowings", "loan",
  "loans", "interest", "equity", "funding", "investment", "investments", "capital",
  "connections", "commercial connections", "contacts", "manufacturers", "suppliers",
  "supply contracts", "contracts", "marketing", "advertising", "promotion", "exhibiting",
  "exhibitions", "trade fairs", "trade fair", "prototypes", "diverting", "diverts",
  "divert", "recruitment", "recruiting", "training", "automation", "technology",
  "machinery", "interviews", "interviewing", "research", "website", "websites",
  "quality", "specifications", "engineers", "bio-engineers", "staff", "employees",
  "workers", "managers", "management", "customer service", "delivery", "deliveries",
  "production", "stock", "inventory", "materials", "component", "components",
  "batch production", "flow production", "job production", "outsourcing", "offshoring",
];

const LIGHT_ACTION_WORDS = new Set([
  "make", "makes", "making", "made", "get", "gets", "getting", "got", "give", "gives",
  "giving", "given", "take", "takes", "taking", "taken", "have", "has", "having", "had",
  "do", "does", "doing", "did", "be", "is", "are", "was", "were", "been", "being",
  "can", "could", "will", "would", "may", "might", "should", "must", "more", "less",
  "very", "really", "also", "then", "than", "that", "this", "these", "those", "which",
  "increase", "increases", "increased", "increasing", "reduce", "reduces", "reduced",
  "reducing", "lower", "lowers", "lowered", "lowering", "raise", "raises", "raised",
  "raising", "improve", "improves", "improved", "improving", "boost", "boosts", "boosted",
  "boosting", "create", "creates", "created", "creating", "generate", "generates",
  "generated", "generating", "lead", "leads", "leading", "led", "result", "results",
  "resulted", "resulting", "cause", "causes", "caused", "causing", "allow", "allows",
  "allowed", "allowing", "enable", "enables", "enabled", "enabling", "ensure", "ensures",
  "ensured", "ensuring", "help", "helps", "helped", "helping", "provide", "provides",
  "provided", "providing", "offer", "offers", "offered", "offering", "keep", "keeps",
  "keeping", "kept", "retain", "retains", "retained", "retaining", "earn", "earns",
  "earned", "earning", "receive", "receives", "received", "receiving", "pay", "pays",
  "paid", "paying", "sell", "sells", "selling", "sold", "produce", "produces", "produced",
  "producing", "employ", "employs", "employed", "employing", "would", "could", "should",
  "they", "their", "them", "there", "with", "from", "into", "over", "under", "about",
  "when", "where", "what", "while", "because", "therefore", "since", "thus", "hence",
]);

const BUSINESS_CONSEQUENCE_TERMS: string[] = [
  // Cash flow / liquidity
  "cash flow", "cashflow", "cash inflow", "cash inflows", "cash reserve", "cash reserves",
  "cash balance", "cash position", "working capital", "liquidity", "liquid assets",
  "overdraft", "insolvency", "bankruptcy",
  // Costs
  "cost", "costs", "unit cost", "unit costs", "average cost", "fixed cost", "fixed costs",
  "variable cost", "variable costs", "overheads", "fixed overheads", "expenses",
  "expenditure", "interest payments", "interest charges", "interest costs", "wastage",
  // Risk
  "risk", "risks", "uncertainty", "failure", "liability", "legal action", "lost customers",
  "lost sales", "reputational damage",
  // Efficiency
  "efficiency", "productivity", "output", "capacity", "capacity utilisation", "wastage",
  "delay", "delays", "bottleneck", "downtime", "absenteeism", "time-consuming",
  "takes time", "takes longer",
  // Profit / revenue
  "profit", "profits", "profitability", "profit margin", "profit margins", "gross profit",
  "net profit", "operating profit", "revenue", "sales", "sales revenue", "sales volume",
  "turnover", "margin", "sales leads", "leads", "orders",
  // Decision-making / strategic choice
  "decision", "decisions", "decision-making", "choose", "chooses", "choice", "strategy",
  "strategic", "plan", "plans", "planning", "negotiation", "negotiate", "control",
  "flexibility",
];

const BUSINESS_CONSEQUENCE_REGEXES = BUSINESS_CONSEQUENCE_TERMS.map((term) => ({
  term,
  regex: new RegExp(`\\b${escapeRegExp(term).replace(/\s+/g, "\\s+")}\\b`, "i"),
}));

function hasBusinessTerm(lowerText: string, term: string): boolean {
  return new RegExp(`\\b${escapeRegExp(term).replace(/\s+/g, "\\s+")}\\b`, "i").test(lowerText);
}

function collectBusinessConsequenceHits(lowerText: string): string[] {
  return BUSINESS_CONSEQUENCE_REGEXES.filter((entry) => entry.regex.test(lowerText)).map(
    (entry) => entry.term
  );
}

const STRICT_CAUSAL_LINK_REGEXES: RegExp[] = [
  /\b(?:because|since|as|due\s+to|owing\s+to)\b/i,
  /\b(?:therefore|thus|hence|consequently|as\s+a\s+result|which\s+leads?\s+to|leading\s+to|this\s+leads?\s+to|results?\s+in|resulting\s+in|which\s+means(?:\s+that)?|this\s+means(?:\s+that)?|meaning\s+that|thereby|so\s+that|in\s+turn)\b/i,
  /\b(?:leads?\s+to|causes?|causing|reduces?|reducing|increases?|increasing|lowers?|lowering|raises?|raising|improves?|improving|boosts?|boosting|prevents?|preventing|avoids?|avoiding|protects?|protecting|preserves?|preserving|covers?|covering|worsens?|worsening|drives?|driving|squeezes?|squeezing|damages?|damaging|harms?|harming|delays?|delaying|erodes?|eroding|attracts?|attracting|retains?|retaining|hurts?|hurting|cuts?|cutting|stimulates?|stimulating|strains?|straining|secures?|securing|saves?|saving|secures?|securing)\b/i,
];

function hasStrictCausalLink(text: string): boolean {
  return STRICT_CAUSAL_LINK_REGEXES.some((regex) => regex.test(text));
}

type BusinessConsequenceCheck = {
  passed: boolean;
  reason: "ok" | "no-causal-link" | "no-business-consequence" | "restatement-only";
  consequence?: string;
};

/**
 * Cambridge 0264 strict AO3 gate.
 * An:1 is ONLY awarded when there is a clear cause-and-effect chain whose consequence is a real
 * business outcome (cash flow, costs, risk, efficiency, profit, or decision-making).
 * Merely repeating the knowledge point with connectives ("because", "therefore") is rejected.
 */
export function hasClearBusinessConsequenceChain(text: string): BusinessConsequenceCheck {
  const trimmed = text.trim();
  if (!trimmed) return { passed: false, reason: "no-causal-link" };

  const lower = trimmed.toLowerCase();
  const sentences = trimmed
    .split(/(?<=[.!?])\s+|[;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const allConsequenceHits = collectBusinessConsequenceHits(lower);
  const nonCausalSentences = sentences.filter((s) => !hasStrictCausalLink(s.toLowerCase()));

  for (const sentence of sentences) {
    const sentenceLower = sentence.toLowerCase();
    if (!hasStrictCausalLink(sentenceLower)) continue;

    const consequenceHits = collectBusinessConsequenceHits(sentenceLower);
    if (consequenceHits.length === 0) continue;

    // Reject a sentence that only restates a consequence already stated as knowledge.
    const novelConsequences = consequenceHits.filter(
      (term) => !nonCausalSentences.some((s) => hasBusinessTerm(s.toLowerCase(), term))
    );
    if (novelConsequences.length === 0) continue;

    const mechanismHits = Array.from(
      new Set([
        ...P2_OPERATIONAL_MECHANISMS,
        ...P2_BUSINESS_IMPACTS,
        ...CAMBRIDGE_KNOWLEDGE_CONCEPTS,
        ...GENERAL_MECHANISM_TERMS,
      ])
    ).filter(
      (term) =>
        hasBusinessTerm(sentenceLower, term) &&
        !consequenceHits.some((hit) => hit.toLowerCase() === term.toLowerCase())
    );

    if (mechanismHits.length >= 1 || consequenceHits.length >= 2) {
      return { passed: true, reason: "ok", consequence: novelConsequences[0] || consequenceHits[0] };
    }
  }

  // Cross-sentence chain fallback: still requires a genuine business consequence somewhere.
  const crossSentenceScan = scanPaper2CausalChains(trimmed);
  if (crossSentenceScan.validatedChains >= 1 && allConsequenceHits.length > 0) {
    return { passed: true, reason: "ok", consequence: allConsequenceHits[0] };
  }

  if (!hasStrictCausalLink(lower)) return { passed: false, reason: "no-causal-link" };
  if (allConsequenceHits.length === 0) return { passed: false, reason: "no-business-consequence" };
  return { passed: false, reason: "restatement-only" };
}

/**
 * Cambridge 0264 Knowledge (AO1) generosity gate.
 * ANY valid syllabus point, benefit, drawback or concept is credited immediately, even when it is
 * written as a short single sentence without textbook-exact phrasing.
 */
export function looksLikeValidCambridgeKnowledgePoint(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (isPureVagueFillerAnswer(trimmed)) return false;

  const lower = trimmed.toLowerCase();

  // 1. Any recognised 0264 concept/term (including very short points such as "Continuity of existence").
  if (CAMBRIDGE_KNOWLEDGE_CONCEPTS.some((term) => hasBusinessTerm(lower, term))) {
    return true;
  }

  const words = lower.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const contentWords = words.filter(
    (w) =>
      w.length >= 4 &&
      !GENERIC_FILLER_WORDS.has(w) &&
      !GENERIC_CASE_CONTEXT_WORDS.has(w) &&
      !LIGHT_ACTION_WORDS.has(w)
  );
  if (contentWords.length === 0) return false;

  // 2. Any Cambridge "point frame": benefit / advantage / drawback / reason / purpose / role ...
  const pointFrame =
    /\b(?:benefit|benefits|advantage|advantages|drawback|drawbacks|disadvantage|disadvantages|reason|reasons|purpose|aim|objective|importance|role|function|feature|characteristic|method|way|type|example|effect|impact|result|definition|meaning)\b/i;
  if (pointFrame.test(lower) && contentWords.length >= 1) return true;

  // 3. A definitional or explanatory statement containing a genuine business idea.
  const definitional =
    /\b(?:is|are|means|refers\s+to|involves|consists\s+of|includes|allows|enables|provides|offers|gives|creates|generates|leads\s+to|results\s+in|helps|prevents|reduces|increases|improves|keeps|owns|controls|shares|retains|earns|receives|pays|sells|produces|employs)\b/i;
  if (definitional.test(lower) && contentWords.length >= 2) return true;

  return false;
}

export interface KnowledgeCreditLedger {
  signatures: Set<string>[];
  matchedPoints: Set<string>;
  conceptSets: Set<string>[];
}

export function createKnowledgeCreditLedger(): KnowledgeCreditLedger {
  return { signatures: [], matchedPoints: new Set<string>(), conceptSets: [] };
}

function normalizeKnowledgeKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Builds a stable concept signature for a paragraph so paraphrased repeats of the same
 * syllabus point can be detected even when the wording changes.
 */
export function extractKnowledgeSignature(text: string): Set<string> {
  const lower = text.toLowerCase();
  const concepts = CAMBRIDGE_KNOWLEDGE_CONCEPTS.filter((term) => hasBusinessTerm(lower, term));
  const signature = new Set<string>(concepts);

  if (signature.size >= 2) return signature;

  const contentWords = lower
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter(
      (w) =>
        w.length >= 4 &&
        !GENERIC_FILLER_WORDS.has(w) &&
        !GENERIC_CASE_CONTEXT_WORDS.has(w) &&
        !LIGHT_ACTION_WORDS.has(w)
    );

  for (const word of contentWords.slice(0, 12)) signature.add(word);
  return signature;
}

function isKnowledgeSignatureAlreadyCredited(
  signature: Set<string>,
  priorSignatures: Set<string>[]
): boolean {
  if (signature.size === 0) return false;

  for (const prior of priorSignatures) {
    if (prior.size === 0) continue;
    const shared = [...signature].filter((term) => prior.has(term));
    if (shared.length === 0) continue;

    if (shared.length >= 2) {
      const union = new Set([...signature, ...prior]).size;
      if (shared.length / union >= 0.5) return true;
    }

    // A very short single-concept point repeated verbatim counts as a repeat.
    if (signature.size === 1 && prior.size <= 2 && shared.length === 1) return true;
  }

  return false;
}

/**
 * Syllabus concepts present in a paragraph. Used by the anti-repetition ledger to decide
 * whether a later paragraph introduces a genuinely new point or merely paraphrases one
 * already credited.
 */
function extractConceptSet(text: string): Set<string> {
  const lower = text.toLowerCase();
  return new Set(CAMBRIDGE_KNOWLEDGE_CONCEPTS.filter((term) => hasBusinessTerm(lower, term)));
}

/**
 * Anti-repetition gate for K/App/An.
 * A paragraph repeats an earlier point when:
 *  - its knowledge signature strongly overlaps an earlier paragraph; or
 *  - every syllabus concept it uses was already credited AND the loose mark-scheme hit is
 *    also already credited (i.e. it only paraphrases the earlier point).
 * If the paragraph introduces at least one new syllabus concept it is a new point and is allowed.
 */
function isKnowledgePointRepeated(
  signature: Set<string>,
  conceptSet: Set<string>,
  matchedKeys: string[],
  ledger: KnowledgeCreditLedger
): boolean {
  if (isKnowledgeSignatureAlreadyCredited(signature, ledger.signatures)) return true;
  if (conceptSet.size === 0) return false;

  const priorConcepts = new Set<string>();
  for (const prior of ledger.conceptSets) {
    for (const concept of prior) priorConcepts.add(concept);
  }

  const introducesNewConcept = [...conceptSet].some((concept) => !priorConcepts.has(concept));
  if (introducesNewConcept) return false;

  const reusesCreditedPoint =
    matchedKeys.length === 0 || matchedKeys.every((key) => ledger.matchedPoints.has(key));
  return reusesCreditedPoint;
}

function recordKnowledgeCredit(
  ledger: KnowledgeCreditLedger,
  signature: Set<string> | null,
  conceptSet: Set<string>,
  matchedKeys: string[]
): void {
  if (signature) ledger.signatures.push(signature);
  if (conceptSet.size > 0) ledger.conceptSets.push(conceptSet);
  for (const key of matchedKeys) ledger.matchedPoints.add(key);
}

/**
 * Filters the case-study details credited in a paragraph down to the ones that have not
 * already earned Application in an earlier paragraph.
 */
function findFreshAppDetails(foundWords: string[], credited: Set<string>): string[] {
  return foundWords.filter((word) => {
    const key = normalizeKnowledgeKey(word);
    return key.length > 0 && !credited.has(key);
  });
}

/**
 * Strict Cambridge 0264/0450 Paper 1 & Short-Response Evaluation Engine
 * Combines Qwen 3 0.6B boolean checklist evaluation with strict 0264 deterministic
 * AO2/AO3/AO4 verification so paraphrased understanding is credited fairly while vague filler,
 * repeated sentences, simple lists, and standalone company name-dropping are not over-scored.
 */
export async function evaluateStudentEssay(
  input: EvaluatorInput
): Promise<EvaluationResult> {
  const { marks, studentAnswer, webllmEngine, deterministicRules, modelAnswer } = input;
  // Cambridge 0264 2-mark questions assess PURE KNOWLEDGE (AO1) only.
  // Force the breakdown to K:0-2 with zero Application/Analysis/Evaluation, even if a
  // caller passes a rubric that incorrectly advertises AO2/AO3/AO4 marks.
  const rubric =
    marks <= 2
      ? { ...input.rubric, ao1Max: 2, ao2Max: 0, ao3Max: 0, ao4Max: 0 }
      : input.rubric;
  const answer = studentAnswer.trim();
  const lowerAnswer = answer.toLowerCase();
  const wordCount = answer ? answer.split(/\s+/).length : 0;

  // Reject blank or placeholder text immediately
  if (wordCount < 5 || lowerAnswer === "no candidate answer provided.") {
    const emptyRule: RuleEnforcementResult = {
      appWordsRequired: input.validAppWords || [],
      appWordsFound: [],
      appWordsPassed: false,
      ao2CappedToZero: rubric.ao2Max > 0,
      evalWordRequired: rubric.ao4Max > 0,
      evalWordsFound: [],
      evalWordPassed: false,
      ao4CappedToZero: rubric.ao4Max > 0,
      ruleNotes: ["Response below minimum examinable length (under 5 words)."],
    };
    return {
      totalScore: 0,
      maxMarks: marks,
      percentage: 0,
      aoBreakdown: {
        ao1: { score: 0, max: rubric.ao1Max, feedback: "Response is too brief to demonstrate syllabus knowledge." },
        ao2: { score: 0, max: rubric.ao2Max, feedback: "No application to the specific business context." },
        ao3: { score: 0, max: rubric.ao3Max, feedback: "No analytical chain developed." },
        ao4: { score: 0, max: rubric.ao4Max, feedback: "No evaluation or justified recommendation." },
      },
      strengths: [],
      improvements: ["Provide a complete answer using relevant Cambridge 0264 business terminology and case facts."],
      examinerNotes: `[Cambridge 0264 Strict Examiner] Awarded 0/${marks} marks. Response below minimum examinable length.`,
      modelAnswerSnippet: modelAnswer || rubric.sampleStrongPoint,
      isAiEvaluated: false,
      evaluatedAt: new Date().toISOString(),
      ruleEnforcement: emptyRule,
    };
  }

  // Resolve effective application keywords via shared detectCaseContext helper (curated validAppWords + caseContext facts)
  const ao2ContextSet: ActiveCaseContextSet = {
    validAppWords: input.validAppWords,
    caseContext: input.caseContext,
    ao2Max: rubric.ao2Max,
  };
  const appDetection = detectCaseContext(answer, ao2ContextSet);
  const effectiveAppWords = appDetection.activeKeywords;

  // 0. Check for genuine >=85% full reproduction of the official Cambridge model answer
  // Multi-point / multi-paragraph questions (4m, 6m, 8m) with fewer than 2 segments cannot bypass per-segment caps.
  const isPaper1EightMark = marks === 8 && rubric.ao4Max > 0;
  const responseSegments = splitResponsePoints(answer);
  const rawParagraphCount = responseSegments.length;
  const isModelMatch =
    checkIsExactOrSubstantialModelAnswer(answer, modelAnswer) &&
    !(marks >= 4 && rawParagraphCount < 2);
  if (isModelMatch && marks > 0) {
    const fullRuleEnforcement: RuleEnforcementResult = {
      appWordsRequired: effectiveAppWords || [],
      appWordsFound: effectiveAppWords || [],
      appWordsPassed: true,
      ao2CappedToZero: false,
      evalWordRequired: Boolean(deterministicRules?.if_no_eval_word && rubric.ao4Max > 0),
      evalWordsFound: ["overall", "on balance"],
      evalWordPassed: true,
      ao4CappedToZero: false,
      ruleNotes: [
        "Full exemplar alignment verified against official Cambridge mark scheme model answer.",
        "Full marks awarded across all Assessment Objectives.",
      ],
    };

    return {
      totalScore: marks,
      maxMarks: marks,
      percentage: 100,
      aoBreakdown: {
        ao1: {
          score: rubric.ao1Max,
          max: rubric.ao1Max,
          feedback: "Full textbook precision and concept understanding matching Cambridge mark scheme model answer.",
        },
        ao2: {
          score: rubric.ao2Max,
          max: rubric.ao2Max,
          feedback: "Directly contextualised to the business scenario facts and data points.",
        },
        ao3: {
          score: rubric.ao3Max,
          max: rubric.ao3Max,
          feedback: "Exemplary multi-step causal analytical chain linking actions to commercial outcomes.",
        },
        ao4: {
          score: rubric.ao4Max,
          max: rubric.ao4Max,
          feedback: "Comprehensive balanced evaluative judgment with justified recommendation.",
        },
      },
      strengths: [
        "Matches official Cambridge exemplar model answer.",
        "Demonstrates complete syllabus coverage across all assessment objectives.",
      ],
      improvements: [
        "Exemplar quality: Maintain this level of precision and time management under timed exam conditions.",
      ],
      examinerNotes: `[Cambridge 0264 Examiner] Awarded ${marks}/${marks} marks (100%). Exemplar Cambridge Model Answer standard.`,
      modelAnswerSnippet: modelAnswer || rubric.sampleStrongPoint,
      isAiEvaluated: false,
      evaluatedAt: new Date().toISOString(),
      ruleEnforcement: fullRuleEnforcement,
    };
  }

  // 1. Strict Deterministic Cambridge Scans + Anti-Double-Counting Deduplication
  const dedup = deduplicateRepeatedSentences(answer);
  const textForAo1 = dedup.uniqueSentences.length > 0 ? dedup.deduplicatedText : answer;
  const singleRepeatedPointCap =
    dedup.duplicateCount > 0 &&
    dedup.uniqueSentences.length <= 1 &&
    (marks >= 4 || /\btwo\b/i.test(input.questionPrompt));
  const vagueFillerOnly = isPureVagueFillerAnswer(answer);
  const ao3Guardrail = hasAo3CausalConnectiveAndMechanism(answer);

  const knowledgePoints =
    input.indicativeKnowledgePoints && input.indicativeKnowledgePoints.length > 0
      ? input.indicativeKnowledgePoints
      : rubric.indicativeContent;
  const knowledgeEval = checkKnowledgePointMatches(textForAo1, knowledgePoints, modelAnswer);
  const syllabusTermCount = countSyllabusTerms(textForAo1.toLowerCase());
  const calcCheck = checkCalculationAccuracy(answer, input.questionPrompt, input.caseContext, modelAnswer);

  const appScan = { passed: appDetection.passed, foundWords: appDetection.foundWords };
  const requiresApp = effectiveAppWords.length > 0 && rubric.ao2Max > 0;
  const ao2CappedToZero = requiresApp && !appScan.passed;

  const requiresEval = Boolean(rubric.ao4Max > 0);
  const evalScan = requiresEval
    ? scanEvaluationKeywords(answer)
    : { passed: true, foundWords: [], judgmentCount: 0, qualifierCount: 0 };
  const causalScan = scanCausalAnalysis(answer);
  const paper2CausalScan = scanPaper2CausalChains(answer);

  const ruleNotes: string[] = [];
  if (requiresApp) {
    if (ao2CappedToZero) {
      ruleNotes.push(
        `[Application Rule] Capped to 0: None of the required context facts (${effectiveAppWords.slice(0, 5).join(", ")}) were detected in your response.`
      );
    } else {
      ruleNotes.push(
        `[Application Rule] Matched ${appScan.foundWords.length} case fact(s) [${appScan.foundWords.slice(0, 4).join(", ")}]${
          appScan.foundWords.length < 2 && rubric.ao2Max >= 2 ? " (need 2+ distinct case references for full AO2)" : ""
        }.`
      );
    }
  }
  if (singleRepeatedPointCap) {
    ruleNotes.push(
      "[Anti-Double-Counting Rule] Repeated point detected across sentences (similarity > 70%): capped at 1 AO1 mark for that idea."
    );
  }

  // Strict Paper 1 Per-Segment Isolated Scoring Engines (2m, 4m, 6m, 8m)
  // Zero cross-paragraph spillover + strict Jaccard > 0.70 duplicate rejection.
  const isConclusionSegment = (p: string, isLastOfThreePlus: boolean): boolean => {
    const trimmed = p.trim();
    if (!trimmed) return false;
    const startsWithConclusion =
      /^(?:recommendation|conclusion|in conclusion|to conclude|to sum up|in summary|overall|on balance|ultimately|i recommend|we recommend|therefore,\s*i\s+recommend|to evaluate|in evaluation)\b/i.test(
        trimmed
      );
    if (startsWithConclusion) return true;
    if (!isLastOfThreePlus) return false;
    const startsLikeBodyContinuation =
      /^(?:secondly|second|another|furthermore|in addition|moreover|point\s*2|advantage\s*2|disadvantage\s*2|on the other hand|however|alternatively)\b/i.test(
        trimmed
      );
    if (startsLikeBodyContinuation) return false;
    return /\b(overall|in conclusion|to conclude|on balance|recommend|should choose|should use|should select|best option|better option|best choice|better choice|preferable|advantages outweigh|benefits outweigh)\b/i.test(
      trimmed
    );
  };

  type IsolatedSegmentResult = {
    k: 0 | 1;
    app: 0 | 1;
    an: 0 | 1;
    total: number;
    isDuplicate: boolean;
    foundAppWords: string[];
    knowledgeRepetition?: boolean;
    appRepetition?: boolean;
    noBusinessConsequence?: boolean;
    analysisReason?: BusinessConsequenceCheck["reason"];
  };

  const evaluateIsolatedSegment = (
    segText: string,
    priorSegments: string[],
    qwenAllowsK: boolean,
    opts: {
      minWordsK?: number;
      minWordsApp?: number;
      minWordsAn?: number;
      knowledgeLedger?: KnowledgeCreditLedger;
      appDetailLedger?: Set<string>;
    } = {}
  ): IsolatedSegmentResult => {
    const trimmed = segText.trim();
    if (!trimmed) {
      return { k: 0, app: 0, an: 0, total: 0, isDuplicate: false, foundAppWords: [] };
    }

    if (isSegmentDuplicateOfAny(trimmed, priorSegments)) {
      return {
        k: 0,
        app: 0,
        an: 0,
        total: 0,
        isDuplicate: true,
        knowledgeRepetition: true,
        foundAppWords: [],
      };
    }

    const segWords = trimmed.split(/\s+/).filter(Boolean).length;
    const segVague = isPureVagueFillerAnswer(trimmed);
    const minWordsK = opts.minWordsK ?? 5;
    const minWordsApp = opts.minWordsApp ?? 6;
    const minWordsAn = opts.minWordsAn ?? 10;
    const ledger = opts.knowledgeLedger;
    const appLedger = opts.appDetailLedger;
    const kWordFloor = Math.min(minWordsK, 4);

    // AO1 [K] (max 1 per segment) — generous: ANY valid 0264 concept/point earns K:1,
    // even a short single-sentence paraphrase without textbook-exact wording.
    let k: 0 | 1 = 0;
    let knowledgeSignature: Set<string> | null = null;
    let knowledgeConceptSet: Set<string> | null = null;
    let matchedKnowledgeKeys: string[] = [];
    if (!segVague && segWords >= kWordFloor) {
      const pKnowledge = checkKnowledgePointMatches(trimmed, knowledgePoints, modelAnswer);
      const pTerms = countSyllabusTerms(trimmed.toLowerCase());
      const pCalc = checkCalculationAccuracy(trimmed, input.questionPrompt, input.caseContext, modelAnswer);
      const validPoint = looksLikeValidCambridgeKnowledgePoint(trimmed);
      const detK = pCalc.isCalculation
        ? pCalc.matchedOutputs >= 1 || pCalc.hasWorking
        : pKnowledge.matchedCount >= 1 ||
          pKnowledge.domainOverlapCount >= 1 ||
          pTerms >= 1 ||
          validPoint;
      const llmK = qwenAllowsK && segWords >= 2;
      if (detK || llmK) k = 1;

      knowledgeSignature = extractKnowledgeSignature(trimmed);
      knowledgeConceptSet = extractConceptSet(trimmed);
      matchedKnowledgeKeys = pKnowledge.matchedPoints
        .map((point) => normalizeKnowledgeKey(point))
        .filter(Boolean);
    }

    // Anti-Repetition: a repeated syllabus point earns K:0, App:0, An:0 for that paragraph.
    if (k === 1 && ledger) {
      const repeated =
        knowledgeSignature !== null &&
        knowledgeConceptSet !== null &&
        isKnowledgePointRepeated(
          knowledgeSignature,
          knowledgeConceptSet,
          matchedKnowledgeKeys,
          ledger
        );

      if (repeated) {
        return {
          k: 0,
          app: 0,
          an: 0,
          total: 0,
          isDuplicate: true,
          knowledgeRepetition: true,
          foundAppWords: [],
        };
      }

      recordKnowledgeCredit(
        ledger,
        knowledgeSignature,
        knowledgeConceptSet ?? new Set<string>(),
        matchedKnowledgeKeys
      );
    }

    // AO2 [App] (max 1 per segment, strictly isolated to this segment).
    // Every App:1 must use at least one fresh case detail not already credited for App in an earlier paragraph.
    let app: 0 | 1 = 0;
    let foundAppWords: string[] = [];
    let appRepetition = false;
    if (k === 1 && rubric.ao2Max > 0) {
      if (requiresApp) {
        const pApp = detectCaseContext(trimmed, ao2ContextSet);
        foundAppWords = pApp.foundWords;
        const freshAppWords = appLedger ? findFreshAppDetails(foundAppWords, appLedger) : foundAppWords;
        if (foundAppWords.length >= 1 && freshAppWords.length === 0) {
          appRepetition = true;
        } else if (foundAppWords.length >= 1 && segWords >= minWordsApp) {
          app = 1;
          if (appLedger) {
            for (const word of foundAppWords) {
              const key = normalizeKnowledgeKey(word);
              if (key) appLedger.add(key);
            }
          }
        }
      } else if (segWords >= minWordsApp + 2) {
        app = 1;
      }
    }

    // AO3 [An] (max 1 per segment) — strict: ONLY a clear cause-and-effect chain that explains an
    // actual business consequence (cash flow, costs, risk, efficiency, profit, decision-making).
    let an: 0 | 1 = 0;
    let noBusinessConsequence = false;
    let analysisReason: BusinessConsequenceCheck["reason"] | undefined;
    if (k === 1 && rubric.ao3Max > 0) {
      const consequenceCheck = hasClearBusinessConsequenceChain(trimmed);
      analysisReason = consequenceCheck.reason;
      const pCausal = scanCausalAnalysis(trimmed);
      const p2Scan = scanPaper2CausalChains(trimmed);
      const hasCausalStep =
        p2Scan.validatedChains >= 1 ||
        p2Scan.singleStepReasons >= 1 ||
        pCausal.strongChains >= 1 ||
        pCausal.basicReasons >= 1;
      if (consequenceCheck.passed && hasCausalStep && segWords >= minWordsAn) {
        an = 1;
      } else {
        noBusinessConsequence = true;
      }
    }

    return {
      k,
      app,
      an,
      total: k + app + an,
      isDuplicate: false,
      foundAppWords,
      appRepetition,
      noBusinessConsequence,
      analysisReason,
    };
  };

  type SegmentBreakdownMeta = {
    p1: { k: 0 | 1; app: 0 | 1; an: 0 | 1; total: number; isDuplicateOfP1: boolean; foundAppWords: string[] };
    p2: { k: 0 | 1; app: 0 | 1; an: 0 | 1; total: number; isDuplicateOfP1: boolean; foundAppWords: string[] };
    hasBodyPara2: boolean;
    hasConclusionPara: boolean;
    summaryLine: string;
    paragraphAudits: ParagraphAuditItem[];
    totalFromSubtotals: number;
  };

  const formatTags = (res: { k: 0 | 1; app: 0 | 1; an: 0 | 1 }) => {
    const tags: string[] = [];
    if (res.k) tags.push("K");
    if (res.app) tags.push("App");
    if (res.an) tags.push("An");
    return tags.join(" + ");
  };

  const matchAiParagraphAudit = (
    segText: string,
    slotIndex: number,
    aiAudit?: QwenParagraphAuditResult,
    expectedRole?: "body_point" | "option" | "conclusion"
  ): ParagraphAuditItem | undefined => {
    if (!aiAudit?.paragraphs?.length) return undefined;
    if (expectedRole === "conclusion") {
      const conc = aiAudit.paragraphs.find((p) => p.role === "conclusion");
      if (conc) return conc;
    }
    const nonConc = aiAudit.paragraphs.filter((p) => p.role !== "conclusion");
    if (segText.trim()) {
      let best: ParagraphAuditItem | undefined;
      let bestSim = 0;
      for (const p of aiAudit.paragraphs) {
        if (!p.isolated_quote) continue;
        const sim = computeSentenceJaccardSimilarity(segText, p.isolated_quote);
        if (sim > bestSim) {
          bestSim = sim;
          best = p;
        }
      }
      if (best && bestSim >= 0.45) return best;
    }
    return nonConc[slotIndex] || aiAudit.paragraphs[slotIndex];
  };

  const buildCritiqueForBodyPara = (
    label: string,
    seg: string,
    res: IsolatedSegmentResult,
    needsApp: boolean,
    needsAn: boolean,
    aiCritique?: string
  ): string => {
    if (!seg.trim()) return `${label} was not provided.`;
    if (res.isDuplicate || res.knowledgeRepetition) {
      return `${label} repeated a syllabus point already credited in an earlier paragraph — K:0, App:0 and An:0 withheld under the Anti-Repetition rule.`;
    }
    if (res.k === 0) {
      return `Missing valid Cambridge 0264 syllabus knowledge point inside this paragraph (K:0).`;
    }

    const notes: string[] = [];
    if (needsApp && res.app === 0) {
      notes.push(
        res.appRepetition
          ? "App:0 withheld — this paragraph reuses a case-study fact/figure already credited in an earlier paragraph; App:1 requires a fresh, uncredited case detail."
          : "App:0 withheld — no concrete case-study detail inside this paragraph."
      );
    }
    if (needsAn && res.an === 0) {
      notes.push(
        res.noBusinessConsequence
          ? "An:0 withheld — no clear cause-and-effect chain explaining an actual business consequence (cash flow, costs, risk, efficiency, profit, or decision-making); restating the point or summarising case facts is not analysis."
          : "An:0 withheld — missing a cause-and-effect analysis chain inside this paragraph."
      );
    }
    if (notes.length === 0) {
      return aiCritique && aiCritique.length >= 10
        ? aiCritique
        : `Awarded full marks inside this isolated paragraph${res.foundAppWords.length ? ` (applied: ${res.foundAppWords.slice(0, 2).join(", ")})` : ""}.`;
    }
    const credited = [res.k ? "K" : "", res.app ? "App" : ""].filter(Boolean).join(" + ");
    return `Credited ${credited || "no marks"}; ${notes.join(" ")}`;
  };

  const computePaper1EightMarkIsolated = (
    aiAudit: QwenParagraphAuditResult | undefined,
    knowledgeLedger: KnowledgeCreditLedger,
    appDetailLedger: Set<string>
  ) => {
    const paragraphs = responseSegments;

    let bodyPara1 = "";
    let bodyPara2 = "";
    let conclusionPara = "";

    if (paragraphs.length === 1) {
      bodyPara1 = paragraphs[0];
    } else if (paragraphs.length === 2) {
      if (isConclusionSegment(paragraphs[1], false)) {
        bodyPara1 = paragraphs[0];
        conclusionPara = paragraphs[1];
      } else {
        bodyPara1 = paragraphs[0];
        bodyPara2 = paragraphs[1];
      }
    } else if (paragraphs.length >= 3) {
      const lastPara = paragraphs[paragraphs.length - 1];
      if (isConclusionSegment(lastPara, true)) {
        conclusionPara = lastPara;
        bodyPara1 = paragraphs[0];
        bodyPara2 = paragraphs[1];
      } else {
        bodyPara1 = paragraphs[0];
        bodyPara2 = paragraphs[1];
      }
    }

    const aiP1 = matchAiParagraphAudit(bodyPara1, 0, aiAudit, "option");
    const aiP2 = matchAiParagraphAudit(bodyPara2, 1, aiAudit, "option");
    const aiConc = conclusionPara ? matchAiParagraphAudit(conclusionPara, 2, aiAudit, "conclusion") : undefined;

    const p1Raw = evaluateIsolatedSegment(bodyPara1, [], (aiP1?.k_score ?? 0) >= 1, {
      minWordsK: 6,
      minWordsApp: 8,
      minWordsAn: 12,
      knowledgeLedger,
      appDetailLedger,
    });
    const p2Raw = evaluateIsolatedSegment(bodyPara2, bodyPara1 ? [bodyPara1] : [], (aiP2?.k_score ?? 0) >= 1, {
      minWordsK: 6,
      minWordsApp: 8,
      minWordsAn: 12,
      knowledgeLedger,
      appDetailLedger,
    });

    const p1 = { ...p1Raw, isDuplicateOfP1: false };
    const p2 = { ...p2Raw, isDuplicateOfP1: p2Raw.isDuplicate };

    // Anti-halo Conclusion audit (Paragraph 3, Max 2):
    // Repeating Paragraph 1 or Paragraph 2 in Conclusion MUST score 0.
    let ao4Result: DeterministicAo4Result | null = null;
    let ao4Score = 0;
    const isConcDuplicate =
      Boolean(conclusionPara) &&
      isSegmentDuplicateOfAny(
        conclusionPara,
        [bodyPara1, bodyPara2].filter((s) => s.trim().length > 0)
      );

    if (conclusionPara && !isConcDuplicate && p1.k + p2.k > 0) {
      ao4Result = evaluateDeterministicAo4({
        answer,
        marks: 8,
        ao2Score: Math.min(2, p1.app + p2.app),
        ao3Score: Math.min(2, p1.an + p2.an),
        effectiveAppWords,
        caseContext: input.caseContext,
        finalParagraphOverride: conclusionPara,
      });
      ao4Score = Math.min(rubric.ao4Max, ao4Result.score);
      // Allow Qwen's vacuum conclusion judgment to award 2/2 ONLY when conclusion has clear choice + case detail + comparison/weighing inside P3
      if (
        aiConc &&
        (aiConc.eval_score ?? 0) >= 2 &&
        ao4Score === 1 &&
        ao4Result.hasClearDecision &&
        ao4Result.hasBecauseCaseJustification &&
        (ao4Result.explainsChosenOverAlternatives || ao4Result.weighsBothSides)
      ) {
        const concHasCase =
          detectCaseContext(conclusionPara, ao2ContextSet).foundWords.length >= 1 ||
          /(?:\$\s*\d|\b\d+(?:\.\d+)?%)/i.test(conclusionPara);
        if (concHasCase && ao4Result.explainsChosenOverAlternatives) {
          ao4Score = 2;
        }
      }
    }

    const paragraphAudits: ParagraphAuditItem[] = [];
    paragraphAudits.push({
      paragraph_number: 1,
      role: "option",
      isolated_quote: bodyPara1,
      k_score: p1.k,
      app_score: p1.app,
      an_score: p1.an,
      eval_score: 0,
      subtotal: p1.k + p1.app + p1.an,
      max_subtotal: 3,
      critique: buildCritiqueForBodyPara("Paragraph 1", bodyPara1, p1Raw, requiresApp, rubric.ao3Max > 0, aiP1?.critique),
      is_duplicate: false,
      app_words_found: p1.foundAppWords,
    });
    if (bodyPara2.trim()) {
      paragraphAudits.push({
        paragraph_number: 2,
        role: "option",
        isolated_quote: bodyPara2,
        k_score: p2.k,
        app_score: p2.app,
        an_score: p2.an,
        eval_score: 0,
        subtotal: p2.k + p2.app + p2.an,
        max_subtotal: 3,
        critique: buildCritiqueForBodyPara("Paragraph 2", bodyPara2, p2Raw, requiresApp, rubric.ao3Max > 0, aiP2?.critique),
        is_duplicate: p2.isDuplicateOfP1,
        app_words_found: p2.foundAppWords,
      });
    }
    if (conclusionPara.trim()) {
      paragraphAudits.push({
        paragraph_number: paragraphAudits.length + 1,
        role: "conclusion",
        isolated_quote: conclusionPara,
        k_score: 0,
        app_score: 0,
        an_score: 0,
        eval_score: ao4Score,
        subtotal: ao4Score,
        max_subtotal: 2,
        critique: isConcDuplicate
          ? "Conclusion repeated Paragraph 1/2 instead of evaluating; awarded 0/2."
          : ao4Result?.feedback || (ao4Score > 0 ? aiConc?.critique || "Evaluative conclusion credited." : "Missing justified contextual comparison in Conclusion."),
        is_duplicate: isConcDuplicate,
      });
    }

    // Never let AI calculate total score — always sum paragraph subtotals in TypeScript
    const totalScore = Math.min(
      marks,
      paragraphAudits.reduce((sum, p) => sum + p.subtotal, 0)
    );
    const ao1Score = Math.min(rubric.ao1Max, p1.k + p2.k);
    const ao2Score = Math.min(rubric.ao2Max, p1.app + p2.app);
    const ao3Score = Math.min(rubric.ao3Max, p1.an + p2.an);

    const p1Note =
      p1.total > 0
        ? `Paragraph 1: ${p1.total}/3 [${formatTags(p1)}]`
        : "Paragraph 1: 0/3 (missing syllabus point/context/analysis)";
    const p2Note = !bodyPara2.trim()
      ? "Paragraph 2: 0/3 (missing second paragraph/point)"
      : p2.isDuplicateOfP1
      ? "Paragraph 2: 0/3 (repeated point from Paragraph 1)"
      : p2.total > 0
      ? `Paragraph 2: ${p2.total}/3 [${formatTags(p2)}]`
      : "Paragraph 2: 0/3 (missing second distinct point)";
    const concNote = !conclusionPara.trim()
      ? "Conclusion: 0/2 (missing evaluation)"
      : isConcDuplicate
      ? "Conclusion: 0/2 (repeated Paragraph 1)"
      : ao4Score > 0
      ? `Conclusion: ${ao4Score}/2 [Eval]`
      : "Conclusion: 0/2 (missing justified decision in context)";

    const paragraphSummaryLine = `${p1Note} · ${p2Note} · ${concNote} → Total: ${totalScore}/8`;

    return {
      finalAo1: ao1Score,
      finalAo2: ao2Score,
      finalAo3: ao3Score,
      finalAo4: ao4Score,
      ao4Result,
      paragraphBreakdown: {
        p1,
        p2,
        hasBodyPara2: Boolean(bodyPara2.trim()),
        hasConclusionPara: Boolean(conclusionPara.trim()),
        summaryLine: paragraphSummaryLine,
        paragraphAudits,
        totalFromSubtotals: totalScore,
      } as SegmentBreakdownMeta,
    };
  };

  // Strict Paper 1 2-mark, 4-mark, 6-mark, and 8-mark Scoring Engine (Total = sum(p.subtotal))
  const computeCalibratedPaper1Scores = (aiAudit?: QwenParagraphAuditResult) => {
    const knowledgeLedger = createKnowledgeCreditLedger();
    const appDetailLedger = new Set<string>();

    if (isPaper1EightMark) {
      return computePaper1EightMarkIsolated(aiAudit, knowledgeLedger, appDetailLedger);
    }

    const aiParas = aiAudit?.paragraphs || [];

    // --- Paper 1 2-Mark Questions (1 + 1 = 2 AO1) ---
    if (marks <= 2) {
      const seg1 = responseSegments[0] || "";
      const seg2 = responseSegments[1] || "";
      const requiresTwoSeparatePoints = /\b(?:identify|state|list|give|name|outline|explain)\s+(?:two|2)\b/i.test(
        input.questionPrompt
      );

      if (calcCheck.isCalculation) {
        const ao1Score =
          calcCheck.expectedOutputs > 0
            ? calcCheck.matchedOutputs >= calcCheck.expectedOutputs
              ? Math.min(rubric.ao1Max, 2)
              : calcCheck.matchedOutputs >= 1 || calcCheck.hasWorking
              ? 1
              : 0
            : calcCheck.hasWorking
            ? 1
            : 0;
        const p1 = { k: (ao1Score >= 1 ? 1 : 0) as 0 | 1, app: 0 as 0 | 1, an: 0 as 0 | 1, total: ao1Score >= 1 ? 1 : 0, isDuplicateOfP1: false, foundAppWords: [] as string[] };
        const p2 = { k: (ao1Score >= 2 ? 1 : 0) as 0 | 1, app: 0 as 0 | 1, an: 0 as 0 | 1, total: ao1Score >= 2 ? 1 : 0, isDuplicateOfP1: false, foundAppWords: [] as string[] };
        const paragraphAudits: ParagraphAuditItem[] = [
          {
            paragraph_number: 1,
            role: "body_point",
            isolated_quote: answer,
            k_score: p1.k,
            app_score: 0,
            an_score: 0,
            eval_score: 0,
            subtotal: ao1Score,
            max_subtotal: 2,
            critique: ao1Score === 2 ? "Accurate formula/working and final calculated figure." : ao1Score === 1 ? "Partial calculation credit (working or single figure shown)." : "Missing accurate working and calculated figure.",
          },
        ];
        return {
          finalAo1: ao1Score,
          finalAo2: 0,
          finalAo3: 0,
          finalAo4: 0,
          ao4Result: null,
          paragraphBreakdown: {
            p1,
            p2,
            hasBodyPara2: ao1Score >= 2,
            hasConclusionPara: false,
            summaryLine: `Point 1 (Working/Formula): ${p1.k}/1 · Point 2 (Result): ${p2.k}/1 → Total: ${ao1Score}/2`,
            paragraphAudits,
            totalFromSubtotals: ao1Score,
          } as SegmentBreakdownMeta,
        };
      }

      if (responseSegments.length <= 1 && !requiresTwoSeparatePoints) {
        const aiP1 = matchAiParagraphAudit(seg1, 0, aiAudit, "body_point");
        const p1Raw = evaluateIsolatedSegment(seg1, [], (aiP1?.k_score ?? 0) >= 1, {
          minWordsK: 3,
          knowledgeLedger,
        });
        const hasTwoDefinitionComponents =
          !vagueFillerOnly &&
          p1Raw.k === 1 &&
          ((knowledgeEval.isFullMatch && wordCount >= 7) ||
            knowledgeEval.matchedCount >= 2 ||
            (knowledgeEval.matchedCount >= 1 && knowledgeEval.domainOverlapCount >= 2 && wordCount >= 8) ||
            (knowledgeEval.domainOverlapCount >= 2 && syllabusTermCount >= 2 && wordCount >= 10) ||
            (aiParas.filter((p) => p.k_score >= 1).length >= 2 && wordCount >= 7));
        const ao1Score = hasTwoDefinitionComponents ? 2 : p1Raw.k;
        const p1 = { k: p1Raw.k, app: 0 as 0 | 1, an: 0 as 0 | 1, total: p1Raw.k, isDuplicateOfP1: false, foundAppWords: [] as string[] };
        const p2 = {
          k: (ao1Score === 2 ? 1 : 0) as 0 | 1,
          app: 0 as 0 | 1,
          an: 0 as 0 | 1,
          total: ao1Score === 2 ? 1 : 0,
          isDuplicateOfP1: false,
          foundAppWords: [] as string[],
        };
        const paragraphAudits: ParagraphAuditItem[] = [
          {
            paragraph_number: 1,
            role: "body_point",
            isolated_quote: seg1,
            k_score: ao1Score,
            app_score: 0,
            an_score: 0,
            eval_score: 0,
            subtotal: ao1Score,
            max_subtotal: 2,
            critique:
              ao1Score === 2
                ? "Accurate two-part Cambridge 0264 definition/explanation."
                : ao1Score === 1
                ? "Basic knowledge shown; add a second distinct feature/component for 2/2."
                : "Missing accurate syllabus knowledge matching the 0264 mark scheme.",
          },
        ];
        const summaryLine =
          ao1Score === 2
            ? "Point 1: 1/1 [K] · Point 2: 1/1 [K] → Total: 2/2"
            : ao1Score === 1
            ? "Point 1: 1/1 [K] · Point 2: 0/1 (missing second distinct point/component) → Total: 1/2"
            : "Point 1: 0/1 · Point 2: 0/1 → Total: 0/2";
        return {
          finalAo1: ao1Score,
          finalAo2: 0,
          finalAo3: 0,
          finalAo4: 0,
          ao4Result: null,
          paragraphBreakdown: {
            p1,
            p2,
            hasBodyPara2: ao1Score === 2,
            hasConclusionPara: false,
            summaryLine,
            paragraphAudits,
            totalFromSubtotals: ao1Score,
          } as SegmentBreakdownMeta,
        };
      }

      const aiP1 = matchAiParagraphAudit(seg1, 0, aiAudit, "body_point");
      const aiP2 = matchAiParagraphAudit(seg2, 1, aiAudit, "body_point");
      const p1Raw = evaluateIsolatedSegment(seg1, [], (aiP1?.k_score ?? 0) >= 1, {
        minWordsK: 2,
        knowledgeLedger,
        appDetailLedger,
      });
      const p2Raw = evaluateIsolatedSegment(seg2, seg1 ? [seg1] : [], (aiP2?.k_score ?? 0) >= 1, {
        minWordsK: 2,
        knowledgeLedger,
        appDetailLedger,
      });
      const p1 = { k: p1Raw.k, app: 0 as 0 | 1, an: 0 as 0 | 1, total: p1Raw.k, isDuplicateOfP1: false, foundAppWords: [] as string[] };
      const p2 = { k: p2Raw.k, app: 0 as 0 | 1, an: 0 as 0 | 1, total: p2Raw.k, isDuplicateOfP1: p2Raw.isDuplicate, foundAppWords: [] as string[] };

      const paragraphAudits: ParagraphAuditItem[] = [
        {
          paragraph_number: 1,
          role: "body_point",
          isolated_quote: seg1,
          k_score: p1.k,
          app_score: 0,
          an_score: 0,
          eval_score: 0,
          subtotal: p1.k,
          max_subtotal: 1,
          critique: p1.k > 0 ? (aiP1?.critique || "Valid first knowledge point.") : "Missing valid syllabus point.",
          is_duplicate: false,
        },
      ];
      if (seg2.trim()) {
        paragraphAudits.push({
          paragraph_number: 2,
          role: "body_point",
          isolated_quote: seg2,
          k_score: p2.k,
          app_score: 0,
          an_score: 0,
          eval_score: 0,
          subtotal: p2.k,
          max_subtotal: 1,
          critique: p2.isDuplicateOfP1
            ? "Repeated Point 1; 0 marks awarded."
            : p2.k > 0
            ? (aiP2?.critique || "Valid second distinct knowledge point.")
            : "Missing valid second syllabus point.",
          is_duplicate: p2.isDuplicateOfP1,
        });
      }

      const totalScore = Math.min(
        marks,
        paragraphAudits.reduce((sum, p) => sum + p.subtotal, 0)
      );
      const ao1Score = totalScore;
      const p1Note = p1.k > 0 ? "Point 1: 1/1 [K]" : "Point 1: 0/1 (missing knowledge point)";
      const p2Note = !seg2.trim()
        ? "Point 2: 0/1 (missing second distinct point)"
        : p2.isDuplicateOfP1
        ? "Point 2: 0/1 (repeated point from Point 1)"
        : p2.k > 0
        ? "Point 2: 1/1 [K]"
        : "Point 2: 0/1 (missing valid second knowledge point)";

      return {
        finalAo1: ao1Score,
        finalAo2: 0,
        finalAo3: 0,
        finalAo4: 0,
        ao4Result: null,
        paragraphBreakdown: {
          p1,
          p2,
          hasBodyPara2: Boolean(seg2.trim()),
          hasConclusionPara: false,
          summaryLine: `${p1Note} · ${p2Note} → Total: ${ao1Score}/2`,
          paragraphAudits,
          totalFromSubtotals: totalScore,
        } as SegmentBreakdownMeta,
      };
    }

    // --- Paper 1 4-Mark Questions (2 paragraphs x 2 marks = 4: 1 K + 1 App per paragraph) ---
    if (marks === 4) {
      const seg1 = responseSegments[0] || "";
      const seg2 = responseSegments[1] || "";
      const aiP1 = matchAiParagraphAudit(seg1, 0, aiAudit, "body_point");
      const aiP2 = matchAiParagraphAudit(seg2, 1, aiAudit, "body_point");
      const p1Raw = evaluateIsolatedSegment(seg1, [], (aiP1?.k_score ?? 0) >= 1, {
        minWordsK: 4,
        minWordsApp: 5,
        knowledgeLedger,
        appDetailLedger,
      });
      const p2Raw = evaluateIsolatedSegment(seg2, seg1 ? [seg1] : [], (aiP2?.k_score ?? 0) >= 1, {
        minWordsK: 4,
        minWordsApp: 5,
        knowledgeLedger,
        appDetailLedger,
      });

      const p1 = { k: p1Raw.k, app: p1Raw.app, an: 0 as 0 | 1, total: p1Raw.k + p1Raw.app, isDuplicateOfP1: false, foundAppWords: p1Raw.foundAppWords };
      const p2 = { k: p2Raw.k, app: p2Raw.app, an: 0 as 0 | 1, total: p2Raw.k + p2Raw.app, isDuplicateOfP1: p2Raw.isDuplicate, foundAppWords: p2Raw.foundAppWords };

      const paragraphAudits: ParagraphAuditItem[] = [
        {
          paragraph_number: 1,
          role: "body_point",
          isolated_quote: seg1,
          k_score: p1.k,
          app_score: p1.app,
          an_score: 0,
          eval_score: 0,
          subtotal: p1.k + p1.app,
          max_subtotal: 2,
          critique: buildCritiqueForBodyPara("Paragraph 1", seg1, p1Raw, requiresApp, false, aiP1?.critique),
          is_duplicate: false,
          app_words_found: p1.foundAppWords,
        },
      ];
      if (seg2.trim()) {
        paragraphAudits.push({
          paragraph_number: 2,
          role: "body_point",
          isolated_quote: seg2,
          k_score: p2.k,
          app_score: p2.app,
          an_score: 0,
          eval_score: 0,
          subtotal: p2.k + p2.app,
          max_subtotal: 2,
          critique: buildCritiqueForBodyPara("Paragraph 2", seg2, p2Raw, requiresApp, false, aiP2?.critique),
          is_duplicate: p2.isDuplicateOfP1,
          app_words_found: p2.foundAppWords,
        });
      }

      const totalScore = Math.min(
        marks,
        paragraphAudits.reduce((sum, p) => sum + p.subtotal, 0)
      );
      const ao1Score = Math.min(rubric.ao1Max, p1.k + p2.k);
      const ao2Score = Math.min(rubric.ao2Max, p1.app + p2.app);

      const formatFourMarkNote = (label: string, seg: string, res: typeof p1, isDup: boolean) => {
        if (!seg.trim()) return `${label}: 0/2 (missing second paragraph/point)`;
        if (isDup) return `${label}: 0/2 (repeated point from Paragraph 1)`;
        if (res.total === 2) return `${label}: 2/2 [K + App]`;
        if (res.k === 1 && res.app === 0) return `${label}: 1/2 [K — missing App inside paragraph]`;
        return `${label}: 0/2 (missing syllabus point)`;
      };

      const summaryLine = `${formatFourMarkNote("Paragraph 1", seg1, p1, false)} · ${formatFourMarkNote(
        "Paragraph 2",
        seg2,
        p2,
        p2.isDuplicateOfP1
      )} → Total: ${totalScore}/4`;

      return {
        finalAo1: ao1Score,
        finalAo2: ao2Score,
        finalAo3: 0,
        finalAo4: 0,
        ao4Result: null,
        paragraphBreakdown: {
          p1,
          p2,
          hasBodyPara2: Boolean(seg2.trim()),
          hasConclusionPara: false,
          summaryLine,
          paragraphAudits,
          totalFromSubtotals: totalScore,
        } as SegmentBreakdownMeta,
      };
    }

    // --- Paper 1 6-Mark Questions (2 paragraphs x 3 marks = 6: 1 K + 1 App + 1 An per paragraph) ---
    if (marks === 6) {
      const seg1 = responseSegments[0] || "";
      const seg2 = responseSegments[1] || "";
      const aiP1 = matchAiParagraphAudit(seg1, 0, aiAudit, "body_point");
      const aiP2 = matchAiParagraphAudit(seg2, 1, aiAudit, "body_point");
      const p1Raw = evaluateIsolatedSegment(seg1, [], (aiP1?.k_score ?? 0) >= 1, {
        minWordsK: 5,
        minWordsApp: 7,
        minWordsAn: 10,
        knowledgeLedger,
        appDetailLedger,
      });
      const p2Raw = evaluateIsolatedSegment(seg2, seg1 ? [seg1] : [], (aiP2?.k_score ?? 0) >= 1, {
        minWordsK: 5,
        minWordsApp: 7,
        minWordsAn: 10,
        knowledgeLedger,
        appDetailLedger,
      });

      const p1 = { ...p1Raw, isDuplicateOfP1: false };
      const p2 = { ...p2Raw, isDuplicateOfP1: p2Raw.isDuplicate };

      const paragraphAudits: ParagraphAuditItem[] = [
        {
          paragraph_number: 1,
          role: "body_point",
          isolated_quote: seg1,
          k_score: p1.k,
          app_score: p1.app,
          an_score: p1.an,
          eval_score: 0,
          subtotal: p1.k + p1.app + p1.an,
          max_subtotal: 3,
          critique: buildCritiqueForBodyPara("Paragraph 1", seg1, p1Raw, requiresApp, true, aiP1?.critique),
          is_duplicate: false,
          app_words_found: p1.foundAppWords,
        },
      ];
      if (seg2.trim()) {
        paragraphAudits.push({
          paragraph_number: 2,
          role: "body_point",
          isolated_quote: seg2,
          k_score: p2.k,
          app_score: p2.app,
          an_score: p2.an,
          eval_score: 0,
          subtotal: p2.k + p2.app + p2.an,
          max_subtotal: 3,
          critique: buildCritiqueForBodyPara("Paragraph 2", seg2, p2Raw, requiresApp, true, aiP2?.critique),
          is_duplicate: p2.isDuplicateOfP1,
          app_words_found: p2.foundAppWords,
        });
      }

      const totalScore = Math.min(
        marks,
        paragraphAudits.reduce((sum, p) => sum + p.subtotal, 0)
      );
      const ao1Score = Math.min(rubric.ao1Max, p1.k + p2.k);
      const ao2Score = Math.min(rubric.ao2Max, p1.app + p2.app);
      const ao3Score = Math.min(rubric.ao3Max, p1.an + p2.an);

      const formatSixMarkNote = (label: string, seg: string, res: typeof p1, isDup: boolean) => {
        if (!seg.trim()) return `${label}: 0/3 (missing second paragraph/point)`;
        if (isDup) return `${label}: 0/3 (repeated point from Paragraph 1)`;
        if (res.total === 3) return `${label}: 3/3 [K + App + An]`;
        if (res.total > 0) {
          const missing: string[] = [];
          if (!res.app) missing.push("App");
          if (!res.an) missing.push("An");
          return `${label}: ${res.total}/3 [${formatTags(res)}${
            missing.length ? ` — missing ${missing.join(" & ")}` : ""
          }]`;
        }
        return `${label}: 0/3 (missing syllabus point)`;
      };

      const summaryLine = `${formatSixMarkNote("Paragraph 1", seg1, p1, false)} · ${formatSixMarkNote(
        "Paragraph 2",
        seg2,
        p2,
        p2.isDuplicateOfP1
      )} → Total: ${totalScore}/6`;

      return {
        finalAo1: ao1Score,
        finalAo2: ao2Score,
        finalAo3: ao3Score,
        finalAo4: 0,
        ao4Result: null,
        paragraphBreakdown: {
          p1,
          p2,
          hasBodyPara2: Boolean(seg2.trim()),
          hasConclusionPara: false,
          summaryLine,
          paragraphAudits,
          totalFromSubtotals: totalScore,
        } as SegmentBreakdownMeta,
      };
    }

    // Fallback for any non-standard mark tier (e.g. 12m invoked via PracticeStudio)
    const hasMarkSchemeHit = knowledgeEval.matchedCount >= 1 || knowledgeEval.domainOverlapCount >= 2;
    const promptLower = input.questionPrompt.toLowerCase();
    const nonPromptAppWords = appScan.foundWords.filter(
      (w) => /\d/.test(w) || !promptLower.includes(w.toLowerCase())
    );
    const aiKCount = aiParas.filter((p) => p.k_score >= 1).length;
    const aiAnCount = aiParas.filter((p) => p.an_score >= 1).length;

    let ao1Score = 0;
    if (rubric.ao1Max > 0 && !vagueFillerOnly) {
      const detAo1 =
        knowledgeEval.matchedCount >= 2 || (knowledgeEval.isFullMatch && wordCount >= 30)
          ? rubric.ao1Max
          : hasMarkSchemeHit && wordCount >= 10
          ? 1
          : 0;
      const llmAo1 = aiAudit && aiKCount >= 2 && wordCount >= 14 ? rubric.ao1Max : aiKCount >= 1 ? 1 : 0;
      ao1Score = Math.min(rubric.ao1Max, Math.max(detAo1, llmAo1));
      if (singleRepeatedPointCap) ao1Score = Math.min(ao1Score, 1);
    }
    const onTopic = ao1Score > 0;
    let ao2Score = 0;
    if (rubric.ao2Max > 0 && onTopic && !ao2CappedToZero) {
      ao2Score =
        nonPromptAppWords.length >= 3 && wordCount >= 45
          ? rubric.ao2Max
          : nonPromptAppWords.length >= 2 && wordCount >= 24
          ? Math.min(rubric.ao2Max, 2)
          : appScan.foundWords.length >= 1
          ? 1
          : 0;
    }
    let ao3Score = 0;
    if (rubric.ao3Max > 0 && onTopic && ao3Guardrail.passed) {
      const twoStep = paper2CausalScan.validatedChains;
      const singleStep = paper2CausalScan.singleStepReasons;
      ao3Score =
        twoStep >= 2 || aiAnCount >= 3
          ? rubric.ao3Max
          : twoStep >= 1 || singleStep >= 3
          ? Math.min(rubric.ao3Max, 3)
          : singleStep >= 1
          ? Math.min(rubric.ao3Max, 2)
          : 0;
    }
    let ao4Result: DeterministicAo4Result | null = null;
    let ao4Score = 0;
    if (rubric.ao4Max > 0 && onTopic && wordCount >= 28) {
      ao4Result = evaluateDeterministicAo4({
        answer,
        marks: 12,
        ao2Score,
        ao3Score,
        effectiveAppWords,
        caseContext: input.caseContext,
      });
      ao4Score = Math.min(rubric.ao4Max, ao4Result.score);
    }

    return {
      finalAo1: ao1Score,
      finalAo2: ao2Score,
      finalAo3: ao3Score,
      finalAo4: ao4Score,
      ao4Result,
      paragraphBreakdown: null as SegmentBreakdownMeta | null,
    };
  };

  // Build concise rule audit notes for AO4 once score is known
  const finalizeRuleEnforcement = (finalAo4: number, ao4Result: DeterministicAo4Result | null): RuleEnforcementResult => {
    const notes = [...ruleNotes];
    const ao4CappedToZero = requiresEval && finalAo4 === 0;
    if (requiresEval) {
      if (ao4CappedToZero) {
        notes.push(
          ao4Result?.feedback ||
            "[Evaluation Rule] Capped to 0: No evaluative decision or contextual comparison detected inside Conclusion paragraph."
        );
      } else {
        notes.push(
          ao4Result?.feedback ||
            `[Evaluation Rule] Evaluative phrasing detected [${evalScan.foundWords.slice(0, 3).join(", ")}].`
        );
      }
    }
    if (rubric.ao3Max > 0 && !ao3Guardrail.passed) {
      notes.push(
        "[Analysis Guardrail] AO3 = 0: Needs an explanatory connective ('because', 'therefore', 'which leads to', 'resulting in', 'reducing', etc.) linked to a business mechanism."
      );
    }
    return {
      appWordsRequired: effectiveAppWords || [],
      appWordsFound: appScan.foundWords,
      appWordsPassed: appScan.passed,
      ao2CappedToZero,
      evalWordRequired: requiresEval,
      evalWordsFound: evalScan.foundWords,
      evalWordPassed: finalAo4 > 0 || evalScan.passed,
      ao4CappedToZero,
      ruleNotes: notes,
    };
  };

  const p1QuestionType: GradingQuestionType = resolveGradingQuestionType(marks, 1);

  // 2. AI Anti-Halo Paragraph Audit Pass (Qwen 3 0.6B via WebGPU if loaded)
  if (webllmEngine) {
    try {
      const markSchemeBullets: string[] = [];
      if (knowledgePoints && knowledgePoints.length > 0) {
        markSchemeBullets.push(`- Knowledge (AO1 max ${rubric.ao1Max}): ${knowledgePoints.join("; ")}`);
      } else if (rubric.indicativeContent?.length) {
        markSchemeBullets.push(`- Knowledge (AO1 max ${rubric.ao1Max}): ${rubric.indicativeContent.join("; ")}`);
      }
      if (rubric.ao3Max > 0) {
        markSchemeBullets.push(`- Analysis (AO3 max ${rubric.ao3Max}): Explain cause-and-effect using 'because -> therefore -> business impact' inside that paragraph.`);
      }
      if (rubric.ao4Max > 0) {
        markSchemeBullets.push(`- Evaluation (AO4 max ${rubric.ao4Max}): Clear decision + justified comparison vs rejected option using case context inside Conclusion.`);
      }

      const llmResult = await evaluateEssayWebLLM({
        essayText: answer,
        examQuestion: input.questionPrompt,
        markScheme: markSchemeBullets.join("\n") || `Marks: ${marks}`,
        maxMarks: marks,
        paper: 1,
        questionType: p1QuestionType,
        caseContextSummary: input.caseContext,
        targetAppKeywords: effectiveAppWords,
        engine: webllmEngine,
      });

      const { finalAo1, finalAo2, finalAo3, finalAo4, ao4Result, paragraphBreakdown } =
        computeCalibratedPaper1Scores(llmResult.paragraphAudit);
      // Strictly sum paragraph subtotals for Paper 1 (never trust AI total calculation)
      const totalScore = paragraphBreakdown
        ? Math.min(marks, paragraphBreakdown.totalFromSubtotals)
        : Math.min(marks, finalAo1 + finalAo2 + finalAo3 + finalAo4);
      const percentage = marks > 0 ? Math.round((totalScore / marks) * 100) : 0;
      const ruleEnforcement = finalizeRuleEnforcement(finalAo4, ao4Result);

      const strengths: string[] = [];
      const improvements: string[] = [];

      if (finalAo1 >= rubric.ao1Max && rubric.ao1Max > 0) {
        strengths.push(llmResult.paragraphAudit?.overall_critique || "Accurate Cambridge 0264 syllabus knowledge demonstrated.");
      } else if (finalAo1 > 0) {
        strengths.push("Relevant Cambridge 0264 syllabus knowledge shown.");
      }

      if (finalAo2 >= rubric.ao2Max && rubric.ao2Max > 0) {
        strengths.push(`Strong isolated case application (${appScan.foundWords.slice(0, 3).join(", ")}).`);
      } else if (finalAo2 > 0) {
        strengths.push(`Partial case application (${appScan.foundWords.slice(0, 2).join(", ")}).`);
      }

      if (finalAo3 >= rubric.ao3Max && rubric.ao3Max > 0) {
        strengths.push("Clear multi-step cause-and-effect analytical chains.");
      } else if (finalAo3 > 0) {
        strengths.push("Attempted causal explanation in one paragraph.");
      }

      if (finalAo4 >= rubric.ao4Max && rubric.ao4Max > 0) {
        strengths.push("Balanced evaluation with justified contextual comparison in Conclusion.");
      } else if (finalAo4 > 0) {
        strengths.push("Decision attempted in Conclusion paragraph.");
      }

      if (strengths.length === 0) {
        strengths.push("Attempted a response under exam conditions.");
      }

      if (paragraphBreakdown && !paragraphBreakdown.hasBodyPara2) {
        improvements.push(
          marks === 2
            ? "Add a second distinct point in a new sentence/line for the second knowledge mark."
            : marks === 4
            ? "Write a separate Paragraph 2 with a distinct concept and case application (2 x 2 = 4)."
            : marks === 6
            ? "Write a separate Paragraph 2 with a distinct concept, case application, and causal analysis (2 x 3 = 6)."
            : "Write a separate Body Paragraph 2 with a second distinct point, case application, and causal analysis (3 + 3 + 2 = 8)."
        );
      } else if (paragraphBreakdown && paragraphBreakdown.p2.isDuplicateOfP1) {
        improvements.push(
          marks <= 4
            ? "Paragraph 2 repeated Paragraph 1; introduce a distinct second point."
            : "Body Paragraph 2 repeated Paragraph 1; introduce a distinct second point."
        );
      }
      if (rubric.ao1Max > 0 && finalAo1 < rubric.ao1Max) {
        improvements.push(
          marks <= 2
            ? "Give a complete definition or two distinct points matching the 0264 mark scheme."
            : "State two distinct syllabus concepts in separate body paragraphs without repeating the same idea."
        );
      }
      if (rubric.ao2Max > 0 && finalAo2 === 0) {
        improvements.push(
          `Application is 0/${rubric.ao2Max}: integrate specific case details such as ${effectiveAppWords?.slice(0, 4).join(", ") || "named figures/products"} (company names alone score 0).`
        );
      } else if (rubric.ao2Max > 0 && finalAo2 < rubric.ao2Max) {
        improvements.push(
          `Apply distinct case facts (${effectiveAppWords?.slice(0, 4).join(", ") || "specific figures"}) INSIDE EVERY paragraph — context in Paragraph 1 does not carry over.`
        );
      }
      if (rubric.ao3Max > 0 && finalAo3 < rubric.ao3Max) {
        improvements.push("Develop a complete cause-and-effect chain ('because -> therefore -> business impact') INSIDE each body paragraph.");
      }
      if (rubric.ao4Max > 0 && finalAo4 < rubric.ao4Max) {
        improvements.push(
          paragraphBreakdown && !paragraphBreakdown.hasConclusionPara
            ? "Add a separate Conclusion paragraph making a clear decision (1/2) and comparing why it is better than the rejected option in case context (2/2)."
            : ao4Result?.feedback ||
              "Inside Paragraph 3 (Conclusion), compare WHY your chosen option is better than the rejected option using case study context."
        );
      }

      let ao4FeedbackText = "Not assessed for this mark tier.";
      if (rubric.ao4Max > 0) {
        ao4FeedbackText =
          paragraphBreakdown && !paragraphBreakdown.hasConclusionPara
            ? "AO4 score: 0/2 (no separate Conclusion paragraph detected)."
            : ao4Result?.feedback ||
              `AO4 score: ${finalAo4}/${rubric.ao4Max}. Needs a justified comparison in case context inside the Conclusion.`;
      }

      const activeModelShortLabel =
        webllmEngine?.tier
          ? getActiveQwenConfig(webllmEngine.tier).shortLabel
          : getActiveQwenConfig().shortLabel;
      const examinerNotes = paragraphBreakdown
        ? `[${activeModelShortLabel} Cambridge 0264 Anti-Halo Examiner] ${paragraphBreakdown.summaryLine}`
        : `[${activeModelShortLabel} Cambridge 0264 Anti-Halo Examiner] Awarded ${totalScore}/${marks} marks (${percentage}%).`;

      return {
        totalScore,
        maxMarks: marks,
        percentage,
        aoBreakdown: {
          ao1: {
            score: finalAo1,
            max: rubric.ao1Max,
            feedback:
              finalAo1 === 0
                ? `0/${rubric.ao1Max}: Insufficient alignment with 0264 mark scheme knowledge points.`
                : finalAo1 < rubric.ao1Max
                ? `Partial knowledge (${finalAo1}/${rubric.ao1Max}): ${singleRepeatedPointCap ? "Repeated point counted once; add a second distinct idea." : "Develop two distinct syllabus points in separate paragraphs."}`
                : "Full Cambridge 0264 mark scheme knowledge points demonstrated.",
          },
          ao2: {
            score: finalAo2,
            max: rubric.ao2Max,
            feedback:
              rubric.ao2Max === 0
                ? "Not assessed for this mark tier."
                : finalAo2 === 0
                ? `0/${rubric.ao2Max}: No concrete case application facts detected.`
                : finalAo2 < rubric.ao2Max
                ? `Partial application (${finalAo2}/${rubric.ao2Max}): Only applied case context in one paragraph (no cross-paragraph carryover).`
                : `Strong isolated application (${finalAo2}/${rubric.ao2Max}): Applied case context [${appScan.foundWords.slice(0, 3).join(", ")}] across paragraphs.`,
          },
          ao3: {
            score: finalAo3,
            max: rubric.ao3Max,
            feedback:
              rubric.ao3Max === 0
                ? "Not assessed for this mark tier."
                : finalAo3 === 0
                ? `0/${rubric.ao3Max}: Lacks explanatory connectives ('because', 'therefore', 'which leads to') with a business mechanism.`
                : finalAo3 < rubric.ao3Max
                ? `Partial analysis (${finalAo3}/${rubric.ao3Max}): Extend causal chains inside each body paragraph.`
                : "Developed multi-step cause-and-effect reasoning across body paragraphs.",
          },
          ao4: {
            score: finalAo4,
            max: rubric.ao4Max,
            feedback: ao4FeedbackText,
          },
        },
        strengths,
        improvements,
        examinerNotes,
        modelAnswerSnippet: modelAnswer || rubric.sampleStrongPoint,
        isAiEvaluated: true,
        evaluatedAt: new Date().toISOString(),
        questionType: p1QuestionType,
        paragraphAudits: paragraphBreakdown?.paragraphAudits,
        ruleEnforcement,
      };
    } catch (e) {
      if (e instanceof WebLLMEvaluationError) {
        console.warn("WebLLM assessment failed, falling back to Instant Examiner:", e.message);
      } else {
        console.warn("Unexpected WebLLM error, falling back to Instant Examiner:", e);
      }
    }
  }

  // 3. Instant Cambridge 0264 Anti-Halo Examiner (uses exact same isolated paragraph audit + subtotal summation)
  const { finalAo1, finalAo2, finalAo3, finalAo4, ao4Result, paragraphBreakdown } =
    computeCalibratedPaper1Scores();
  const totalScore = paragraphBreakdown
    ? Math.min(marks, paragraphBreakdown.totalFromSubtotals)
    : Math.min(marks, finalAo1 + finalAo2 + finalAo3 + finalAo4);
  const percentage = marks > 0 ? Math.round((totalScore / marks) * 100) : 0;
  const ruleEnforcement = finalizeRuleEnforcement(finalAo4, ao4Result);

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (finalAo1 >= rubric.ao1Max && rubric.ao1Max > 0) strengths.push("Accurately covered required 0264 mark scheme knowledge points.");
  else if (finalAo1 > 0) strengths.push("Identified relevant syllabus concept(s).");

  if (finalAo2 >= rubric.ao2Max && rubric.ao2Max > 0) strengths.push(`Directly integrated case facts (${appScan.foundWords.slice(0, 3).join(", ")}).`);
  else if (finalAo2 > 0) strengths.push(`Referenced case context (${appScan.foundWords.slice(0, 2).join(", ")}).`);

  if (finalAo3 >= rubric.ao3Max && rubric.ao3Max > 0) strengths.push("Developed clear multi-step cause-and-effect chains.");
  else if (finalAo3 > 0) strengths.push("Included causal explanation in one paragraph.");

  if (finalAo4 >= rubric.ao4Max && rubric.ao4Max > 0) strengths.push("Delivered a justified evaluative comparison in context.");
  else if (finalAo4 > 0) strengths.push("Attempted an evaluative decision in Conclusion.");

  if (strengths.length === 0) strengths.push("Submitted an exam response, though key mark scheme criteria were missed.");

  if (paragraphBreakdown && !paragraphBreakdown.hasBodyPara2) {
    improvements.push(
      marks === 2
        ? "Add a second distinct point in a new sentence/line for the second knowledge mark."
        : marks === 4
        ? "Write a separate Paragraph 2 with a distinct concept and case application (2 x 2 = 4)."
        : marks === 6
        ? "Write a separate Paragraph 2 with a distinct concept, case application, and causal analysis (2 x 3 = 6)."
        : "Write a separate Body Paragraph 2 with a second distinct point, case application, and causal analysis (3 + 3 + 2 = 8)."
    );
  } else if (paragraphBreakdown && paragraphBreakdown.p2.isDuplicateOfP1) {
    improvements.push(
      marks <= 4
        ? "Paragraph 2 repeated Paragraph 1; introduce a distinct second point."
        : "Body Paragraph 2 repeated Paragraph 1; introduce a distinct second point for up to +3 marks."
    );
  }
  if (rubric.ao1Max > 0 && finalAo1 < rubric.ao1Max) {
    improvements.push("Address all required syllabus knowledge points across separate body paragraphs matching the 0264 mark scheme.");
  }
  if (rubric.ao2Max > 0 && finalAo2 < rubric.ao2Max) {
    improvements.push(
      finalAo2 === 0
        ? `Rule Cap: Application is 0/${rubric.ao2Max}. Cite case facts such as: ${effectiveAppWords?.slice(0, 4).join(", ") || "named figures/products"} (not just the company name).`
        : `Apply distinct case references (${effectiveAppWords?.slice(0, 4).join(", ") || "figures"}) INSIDE each body paragraph (no cross-paragraph carryover).`
    );
  }
  if (rubric.ao3Max > 0 && finalAo3 < rubric.ao3Max) {
    improvements.push("Extend causal analytical chains using 'because -> therefore -> business impact' inside each body paragraph.");
  }
  if (rubric.ao4Max > 0 && finalAo4 < rubric.ao4Max) {
    improvements.push(
      paragraphBreakdown && !paragraphBreakdown.hasConclusionPara
        ? "Add a separate Conclusion paragraph making a clear decision (1/2) and comparing why it is better than the rejected option using case context (2/2)."
        : ao4Result?.feedback ||
          "In Paragraph 3 (Conclusion), compare why your choice is better than the rejected option using case study context for 2/2."
    );
  }

  let examinerNotes = paragraphBreakdown
    ? `[Cambridge 0264 Anti-Halo Examiner] ${paragraphBreakdown.summaryLine}`
    : `[Cambridge 0264 Anti-Halo Examiner] Awarded ${totalScore}/${marks} marks (${percentage}%). `;
  if (!paragraphBreakdown) {
    if (ao2CappedToZero) examinerNotes += "AO2 was capped at 0 because concrete case facts were missing. ";
    if (rubric.ao4Max > 0 && finalAo4 === 0) examinerNotes += "AO4 scored 0 because no justified evaluative judgment or two-sided contrast was demonstrated. ";
    if (percentage >= 85) examinerNotes += "Excellent response demonstrating Grade A* examination mastery.";
    else if (percentage >= 65) examinerNotes += "Strong response demonstrating solid Grade B/A technique.";
    else if (percentage >= 45) examinerNotes += "Developing response; address missing AO criteria above to reach higher bands.";
    else examinerNotes += "Below target standard; review the mark scheme points and model answer carefully.";
  }

  if (webllmEngine) {
    examinerNotes = `Local AI could not complete this assessment. Instant Examiner marked your answer. ${examinerNotes}`;
  }

  const breakdown: AssessmentObjectivesBreakdown = {
    ao1: {
      score: finalAo1,
      max: rubric.ao1Max,
      feedback:
        finalAo1 === 0
          ? `0/${rubric.ao1Max}: Insufficient syllabus knowledge matching mark scheme.`
          : finalAo1 < rubric.ao1Max
          ? `Partial knowledge (${finalAo1}/${rubric.ao1Max}): ${singleRepeatedPointCap || paragraphBreakdown?.p2.isDuplicateOfP1 ? "Repeated point counted once; add a second distinct point." : "Cover all required mark scheme points across separate body paragraphs."}`
          : "Full 0264 mark scheme knowledge points demonstrated.",
    },
    ao2: {
      score: finalAo2,
      max: rubric.ao2Max,
      feedback:
        rubric.ao2Max === 0
          ? "Not assessed for this mark tier."
          : finalAo2 === 0
          ? `0/${rubric.ao2Max}: No concrete case study context applied.`
          : finalAo2 < rubric.ao2Max
          ? `Partial application (${finalAo2}/${rubric.ao2Max}): Applied context in only one paragraph (no cross-paragraph carryover).`
          : `Explicitly applied to case study facts (${appScan.foundWords.slice(0, 3).join(", ")}).`,
    },
    ao3: {
      score: finalAo3,
      max: rubric.ao3Max,
      feedback:
        rubric.ao3Max === 0
          ? "Not assessed for this mark tier."
          : finalAo3 === 0
          ? `0/${rubric.ao3Max}: Lacks explanatory connectives ('because', 'therefore', 'which leads to') with a business mechanism.`
          : finalAo3 < rubric.ao3Max
          ? `Partial analysis (${finalAo3}/${rubric.ao3Max}): Deepen causal chains inside each body paragraph.`
          : "Clear multi-step cause-and-effect analysis linking decisions to commercial outcomes.",
    },
    ao4: {
      score: finalAo4,
      max: rubric.ao4Max,
      feedback:
        rubric.ao4Max === 0
          ? "Not assessed for this mark tier."
          : paragraphBreakdown && !paragraphBreakdown.hasConclusionPara
          ? "AO4 score: 0/2 (no separate Conclusion paragraph detected)."
          : ao4Result?.feedback || `AO4 score: ${finalAo4}/${rubric.ao4Max}.`,
    },
  };

  return {
    totalScore,
    maxMarks: marks,
    percentage,
    aoBreakdown: breakdown,
    strengths,
    improvements,
    examinerNotes,
    modelAnswerSnippet: modelAnswer || rubric.sampleStrongPoint,
    isAiEvaluated: false,
    evaluatedAt: new Date().toISOString(),
    questionType: p1QuestionType,
    paragraphAudits: paragraphBreakdown?.paragraphAudits,
    ruleEnforcement,
  };
}

export interface Paper2EvaluatorInput {
  questionNumber: string;
  questionText: string;
  markValue: 8 | 12;
  markScheme: any;
  modelAnswer: string;
  validAppWords: string[];
  studentAnswer: string;
  caseMainStem: string;
  webllmEngine?: any;
}

export interface Paper2EvaluationResult {
  totalScore: number;
  maxMarks: 8 | 12;
  level: string;
  levelDescription: string;
  percentage: number;
  aoBreakdown: {
    ao1: { score: number; max: number; feedback: string };
    ao2: { score: number; max: number; feedback: string };
    ao3: { score: number; max: number; feedback: string };
    ao4?: { score: number; max: number; feedback: string };
  };
  strengths: string[];
  improvements: string[];
  examinerNotes: string;
  isAiEvaluated: boolean;
  appWordsFound: string[];
  evaluatedAt: string;
  questionType?: GradingQuestionType;
  paragraphAudits?: ParagraphAuditItem[];
  isManuallyOverridden?: boolean;
  originalAiScore?: number;
  overrideReason?: string;
}

function formatPaper2MarkSchemeBullets(markScheme: any): string {
  if (!markScheme || typeof markScheme !== "object") {
    return String(markScheme || "");
  }
  const bullets: string[] = [];
  for (const [key, val] of Object.entries(markScheme)) {
    const cleanKey = key.replace(/_/g, " ");
    if (Array.isArray(val) && val.length > 0) {
      bullets.push(`- ${cleanKey}: ${val.join("; ")}`);
    } else if (typeof val === "string" && val.trim()) {
      bullets.push(`- ${cleanKey}: ${val.trim()}`);
    }
  }
  return bullets.length > 0 ? bullets.join("\n") : JSON.stringify(markScheme);
}

/**
 * Calibrated Cambridge IGCSE Business (0264) Paper 2 Examiner (Local Qwen 3 0.6B + Anti-Halo Paragraph Isolation)
 * - 8-mark Part (a): Separate Paragraph Audit -> Level 1 (1–3), Level 2 (4–6), Level 3 (7–8)
 * - 12-mark Part (b): 3 Option Paragraphs + 1 Conclusion Paragraph -> Level 1 (1–4), Level 2 (5–8), Level 3 (9–12)
 */
export async function evaluatePaper2Answer(
  input: Paper2EvaluatorInput
): Promise<Paper2EvaluationResult> {
  const { questionNumber, questionText, markValue, markScheme, modelAnswer, validAppWords, studentAnswer, caseMainStem, webllmEngine } = input;
  const answer = studentAnswer.trim();

  const questionType: GradingQuestionType = markValue === 12 ? "paper2_12m_b" : "paper2_8m_a";
  const ao1Max = 2;
  const ao2Max = markValue === 12 ? 3 : 2;
  const ao3Max = 4;
  const ao4Max = markValue === 12 ? 3 : 0;

  const appDetection = detectCaseContext(answer, {
    validAppWords,
    caseContext: caseMainStem,
    ao2Max,
  });
  const effectiveAppWords = appDetection.activeKeywords;
  const appScan = { passed: appDetection.passed, foundWords: appDetection.foundWords };
  const causalScan = scanCausalAnalysis(answer);
  const paper2CausalScan = scanPaper2CausalChains(answer);
  const ao3Guardrail = hasAo3CausalConnectiveAndMechanism(answer);
  const dedup = deduplicateRepeatedSentences(answer);
  const textForAo1 = dedup.uniqueSentences.length > 0 ? dedup.deduplicatedText : answer;
  const singleRepeatedPointCap = dedup.duplicateCount > 0 && dedup.uniqueSentences.length <= 1;
  const vagueFillerOnly = isPureVagueFillerAnswer(answer);

  const p2WordCount = answer ? answer.split(/\s+/).length : 0;

  if (p2WordCount < 10) {
    return {
      totalScore: 0,
      maxMarks: markValue,
      level: "Level 0 (0 marks)",
      levelDescription: "Response too brief to earn credit under Cambridge IGCSE Business (0264) criteria.",
      percentage: 0,
      aoBreakdown: {
        ao1: { score: 0, max: ao1Max, feedback: "Under 10 words; insufficient knowledge demonstrated." },
        ao2: { score: 0, max: ao2Max, feedback: "No case context applied." },
        ao3: { score: 0, max: ao3Max, feedback: "No analysis developed." },
        ...(markValue === 12 ? { ao4: { score: 0, max: ao4Max, feedback: "No evaluative judgment or conclusion." } } : {}),
      },
      strengths: [],
      improvements: ["Write a developed response referencing specific details from the case study and Appendices."],
      examinerNotes: `Level 0: 0/${markValue} — Response is below minimum examinable standard. Requirement to Reach Level 3: ${
        markValue === 12
          ? "All 3 option paragraphs must demonstrate K + App + detailed An, plus a conclusion with justified Eval comparing options in context."
          : "Write 2+ distinct paragraphs that BOTH include K + App + detailed cause-and-effect An."
      }`,
      isAiEvaluated: false,
      appWordsFound: [],
      evaluatedAt: new Date().toISOString(),
      questionType,
      paragraphAudits: answer
        ? [
            {
              paragraph_number: 1,
              role: "body_point",
              isolated_quote: answer,
              k_score: 0,
              app_score: 0,
              an_score: 0,
              eval_score: 0,
              subtotal: 0,
              max_subtotal: 3,
              critique: "Under 10 words; insufficient syllabus evidence for Cambridge 0264 credit.",
            },
          ]
        : [],
    };
  }

  const p2Segments = splitResponsePoints(answer);
  const asksConclusionOnEight =
    markValue === 8 &&
    /\b(recommend|justify|evaluate|which\s+(?:method|option|one)|do you think|to what extent|conclusion)\b/i.test(
      questionText
    );

  // Exact or >=85% reproduction of official model answer (still requires multi-paragraph structure)
  const isModelMatch =
    checkIsExactOrSubstantialModelAnswer(answer, modelAnswer) &&
    p2Segments.length >= (markValue === 12 ? 4 : 2);
  if (isModelMatch) {
    const levelName = markValue === 12 ? "Level 3 (9–12 marks)" : "Level 3 (7–8 marks)";
    return {
      totalScore: markValue,
      maxMarks: markValue,
      level: levelName,
      levelDescription:
        markValue === 12
          ? "Supported Evaluation & Recommendation — exemplary Cambridge 0264 standard."
          : "Developed Contextual Analysis — exemplary Cambridge 0264 standard.",
      percentage: 100,
      aoBreakdown: {
        ao1: { score: ao1Max, max: ao1Max, feedback: "Exemplar syllabus knowledge and concept accuracy." },
        ao2: { score: ao2Max, max: ao2Max, feedback: `Seamlessly contextualised to case facts (${effectiveAppWords.slice(0, 3).join(", ")}).` },
        ao3: { score: ao3Max, max: ao3Max, feedback: "Comprehensive multi-step cause-and-effect reasoning." },
        ...(markValue === 12 ? { ao4: { score: ao4Max, max: ao4Max, feedback: "Fully justified and balanced final recommendation comparing options in context." } } : {}),
      },
      strengths: ["Direct match with official Cambridge 0264 Mark Scheme Model Answer.", "Full mastery of all assessment objectives."],
      improvements: ["Maintain this concise exam technique under timed conditions."],
      examinerNotes: `Level 3: ${markValue}/${markValue} — ${
        markValue === 12 ? "Supported Evaluation & Recommendation" : "Developed Contextual Analysis"
      }. Exemplar Cambridge 0264 Model Answer standard.`,
      isAiEvaluated: false,
      appWordsFound: effectiveAppWords,
      evaluatedAt: new Date().toISOString(),
      questionType,
      paragraphAudits: p2Segments.map((seg, i) => ({
        paragraph_number: i + 1,
        role:
          markValue === 12 && i === p2Segments.length - 1
            ? "conclusion"
            : markValue === 12
            ? "option"
            : "body_point",
        isolated_quote: seg,
        k_score: markValue === 12 && i === p2Segments.length - 1 ? 0 : 1,
        app_score: markValue === 12 && i === p2Segments.length - 1 ? 0 : 1,
        an_score: markValue === 12 && i === p2Segments.length - 1 ? 0 : 1,
        eval_score: markValue === 12 && i === p2Segments.length - 1 ? 3 : 0,
        subtotal: 3,
        max_subtotal: 3,
        critique: "Exemplar alignment with Cambridge 0264 mark scheme criteria.",
        has_detailed_an: true,
      })),
    };
  }

  const msKps: string[] = Array.isArray(markScheme?.knowledge_max_2) ? markScheme.knowledge_max_2 : [];
  const knowledgeEval = checkKnowledgePointMatches(textForAo1, msKps, modelAnswer);
  const calcCheck = checkCalculationAccuracy(
    answer,
    questionText,
    caseMainStem,
    modelAnswer,
    JSON.stringify(markScheme || {})
  );

  const matchAiPara = (
    segText: string,
    idx: number,
    aiAudit?: QwenParagraphAuditResult,
    isConclusion?: boolean
  ): ParagraphAuditItem | undefined => {
    if (!aiAudit?.paragraphs?.length) return undefined;
    if (isConclusion) {
      const c = aiAudit.paragraphs.find((p) => p.role === "conclusion");
      if (c) return c;
    }
    let best: ParagraphAuditItem | undefined;
    let bestSim = 0;
    for (const p of aiAudit.paragraphs) {
      if (!p.isolated_quote) continue;
      const sim = computeSentenceJaccardSimilarity(segText, p.isolated_quote);
      if (sim > bestSim) {
        bestSim = sim;
        best = p;
      }
    }
    if (best && bestSim >= 0.45) return best;
    const nonConc = aiAudit.paragraphs.filter((p) => p.role !== "conclusion");
    return nonConc[idx] || aiAudit.paragraphs[idx];
  };

  /**
   * Anti-Halo Isolated Paragraph Audit helper shared by Paper 2 8m (a) and 12m (b)
   */
  const auditPaper2BodyParagraph = (
    segText: string,
    idx: number,
    seenSegments: string[],
    role: "body_point" | "option",
    knowledgeLedger: KnowledgeCreditLedger,
    appDetailLedger: Set<string>,
    aiPara?: ParagraphAuditItem
  ): ParagraphAuditItem => {
    const trimmed = segText.trim();
    if (!trimmed) {
      return {
        paragraph_number: idx + 1,
        role,
        isolated_quote: "",
        k_score: 0,
        app_score: 0,
        an_score: 0,
        eval_score: 0,
        subtotal: 0,
        max_subtotal: 3,
        critique: "Paragraph empty.",
        is_duplicate: false,
        app_words_found: [],
        has_detailed_an: false,
      };
    }

    if (isSegmentDuplicateOfAny(trimmed, seenSegments)) {
      return {
        paragraph_number: idx + 1,
        role,
        isolated_quote: trimmed,
        k_score: 0,
        app_score: 0,
        an_score: 0,
        eval_score: 0,
        subtotal: 0,
        max_subtotal: 3,
        critique: "Repeated an earlier paragraph (similarity > 70%); scored 0 under anti-halo rules.",
        is_duplicate: true,
        app_words_found: [],
        has_detailed_an: false,
      };
    }

    const segWords = trimmed.split(/\s+/).filter(Boolean).length;
    const segVague = isPureVagueFillerAnswer(trimmed);

    // Knowledge (isolated to THIS quote) — generous: ANY valid 0264 point earns K:1 immediately.
    let kScore = 0;
    let knowledgeSignature: Set<string> | null = null;
    let knowledgeConceptSet: Set<string> | null = null;
    let matchedKnowledgeKeys: string[] = [];
    if (!segVague && segWords >= 3) {
      const pKnowledge = checkKnowledgePointMatches(trimmed, msKps, modelAnswer);
      const pTerms = countSyllabusTerms(trimmed.toLowerCase());
      const pCalc = checkCalculationAccuracy(
        trimmed,
        questionText,
        caseMainStem,
        modelAnswer,
        JSON.stringify(markScheme || {})
      );
      const validPoint = looksLikeValidCambridgeKnowledgePoint(trimmed);
      const detK = pCalc.isCalculation
        ? pCalc.matchedOutputs >= 1 || pCalc.hasWorking
        : pKnowledge.matchedCount >= 1 ||
          pKnowledge.domainOverlapCount >= 1 ||
          pTerms >= 1 ||
          validPoint;
      const llmK = (aiPara?.k_score ?? 0) >= 1 && segWords >= 2;
      if (detK || llmK) kScore = 1;

      knowledgeSignature = extractKnowledgeSignature(trimmed);
      knowledgeConceptSet = extractConceptSet(trimmed);
      matchedKnowledgeKeys = pKnowledge.matchedPoints
        .map((point) => normalizeKnowledgeKey(point))
        .filter(Boolean);
    }

    // Anti-Repetition: repeated syllabus point => K:0, App:0, An:0 for this paragraph.
    if (kScore === 1) {
      const repeated =
        knowledgeSignature !== null &&
        knowledgeConceptSet !== null &&
        isKnowledgePointRepeated(
          knowledgeSignature,
          knowledgeConceptSet,
          matchedKnowledgeKeys,
          knowledgeLedger
        );

      if (repeated) {
        return {
          paragraph_number: idx + 1,
          role,
          isolated_quote: trimmed,
          k_score: 0,
          app_score: 0,
          an_score: 0,
          eval_score: 0,
          subtotal: 0,
          max_subtotal: 3,
          critique:
            "Repeated a syllabus point already credited in an earlier paragraph — K:0, App:0 and An:0 withheld under the Anti-Repetition rule.",
          is_duplicate: true,
          app_words_found: [],
          has_detailed_an: false,
        };
      }

      recordKnowledgeCredit(
        knowledgeLedger,
        knowledgeSignature,
        knowledgeConceptSet ?? new Set<string>(),
        matchedKnowledgeKeys
      );
    }

    // Application (strictly isolated to THIS quote — zero carryover from P1).
    // Every App:1 must use a fresh, previously uncredited case detail.
    let appScore = 0;
    let foundAppWords: string[] = [];
    let appRepetition = false;
    if (kScore === 1) {
      if (effectiveAppWords.length > 0) {
        const pApp = detectCaseContext(trimmed, {
          validAppWords,
          caseContext: caseMainStem,
          ao2Max,
        });
        foundAppWords = pApp.foundWords;
        const freshAppWords = findFreshAppDetails(foundAppWords, appDetailLedger);
        if (foundAppWords.length >= 1 && freshAppWords.length === 0) {
          appRepetition = true;
        } else if (foundAppWords.length >= 1 && segWords >= 6) {
          appScore = 1;
          for (const word of foundAppWords) {
            const key = normalizeKnowledgeKey(word);
            if (key) appDetailLedger.add(key);
          }
        }
      } else if (segWords >= 8) {
        appScore = 1;
      }
    }

    // Analysis & Detailed-An Depth (strictly isolated to THIS quote) — strict business-consequence chain.
    let anScore = 0;
    let hasDetailedAn = false;
    let noBusinessConsequence = false;
    let analysisReason: BusinessConsequenceCheck["reason"] | undefined;
    if (kScore === 1) {
      const consequenceCheck = hasClearBusinessConsequenceChain(trimmed);
      analysisReason = consequenceCheck.reason;
      const pGuard = hasAo3CausalConnectiveAndMechanism(trimmed);
      const p2SegScan = scanPaper2CausalChains(trimmed);
      const segCausal = scanCausalAnalysis(trimmed);
      const pDetail = p2SegScan.paragraphDetails[0];
      const hasValidatedScan =
        p2SegScan.validatedChains >= 1 ||
        (p2SegScan.singleStepReasons >= 1 &&
          Boolean(pDetail?.hasOperationalMechanism || pDetail?.hasBottomLineImpact));
      const hasCausalSignal =
        hasValidatedScan ||
        segCausal.strongChains >= 1 ||
        segCausal.basicReasons >= 1 ||
        ((aiPara?.an_score ?? 0) >= 1 && segWords >= 12);
      if (consequenceCheck.passed && hasCausalSignal && segWords >= 10) {
        anScore = 1;
        const twoSidedOrOpImpact =
          p2SegScan.validatedChains >= 1 ||
          segCausal.strongChains >= 1 ||
          (p2SegScan.singleStepReasons >= 1 &&
            Boolean(pDetail?.hasOperationalMechanism) &&
            Boolean(pDetail?.hasBottomLineImpact)) ||
          (pDetail?.hasTwoSidedContrast && (pDetail.proHasCausal || pDetail.conHasCausal)) ||
          (segWords >= 22 && pGuard.connectivesFound.length >= 1 && pGuard.mechanismsFound.length >= 2);
        hasDetailedAn = Boolean(twoSidedOrOpImpact);
      } else {
        noBusinessConsequence = true;
      }
    }

    const subtotal = kScore + appScore + anScore;
    const missing: string[] = [];
    if (kScore === 0) missing.push("relevant syllabus point");
    if (appScore === 0) missing.push("case study context inside this paragraph");
    if (anScore === 0) missing.push("causal analysis ('because -> therefore -> impact') inside this paragraph");

    const critique =
      subtotal === 3
        ? aiPara?.critique && aiPara.critique.length >= 10
          ? aiPara.critique
          : `Strong ${hasDetailedAn ? "detailed " : ""}K + App + An inside this paragraph${foundAppWords.length ? ` (${foundAppWords.slice(0, 2).join(", ")})` : ""}.`
        : kScore === 0
        ? "Missing valid Cambridge 0264 syllabus knowledge point in this paragraph (K:0)."
        : [
            `Credited ${[kScore ? "K" : "", appScore ? "App" : "", anScore ? "An" : ""].filter(Boolean).join(" + ")}.`,
            appScore === 0 && appRepetition
              ? "App:0 withheld — this paragraph reuses a case-study fact/figure already credited in an earlier paragraph; App:1 requires a fresh, uncredited case detail."
              : appScore === 0
              ? "App:0 withheld — no concrete case-study detail inside this paragraph."
              : "",
            anScore === 0 && noBusinessConsequence
              ? "An:0 withheld — no clear cause-and-effect chain explaining an actual business consequence (cash flow, costs, risk, efficiency, profit, or decision-making); restating the point or summarising case facts is not analysis."
              : anScore === 0
              ? "An:0 withheld — missing a cause-and-effect analysis chain inside this paragraph."
              : "",
          ]
            .filter(Boolean)
            .join(" ");

    return {
      paragraph_number: idx + 1,
      role,
      isolated_quote: trimmed,
      k_score: kScore,
      app_score: appScore,
      an_score: anScore,
      eval_score: 0,
      subtotal,
      max_subtotal: 3,
      critique,
      is_duplicate: false,
      app_words_found: foundAppWords,
      has_detailed_an: hasDetailedAn,
    };
  };

  // Calibrated Cambridge 0264 Paper 2 Engine:
  // - 8-mark Part (a): Separate Paragraph Audit -> Level 1 (1-3), Level 2 (4-6), Level 3 (7-8)
  // - 12-mark Part (b): 3 Option Paragraphs + 1 Conclusion Paragraph -> Level 1 (1-4), Level 2 (5-8), Level 3 (9-12)
  const computePaper2Scores = (aiAudit?: QwenParagraphAuditResult) => {
    // =========================================================================
    // PAPER 2 PART (a) — 8 MARKS (Separate Paragraph Audit -> Level 1–3)
    // =========================================================================
    if (markValue === 8) {
      const seenSegments: string[] = [];
      const knowledgeLedger = createKnowledgeCreditLedger();
      const appDetailLedger = new Set<string>();
      const auditedParagraphs: ParagraphAuditItem[] = [];

      const segmentsToAudit = p2Segments.length > 0 ? p2Segments : [answer];
      segmentsToAudit.forEach((segText, idx) => {
        const isLastAndConclusion =
          asksConclusionOnEight &&
          idx === segmentsToAudit.length - 1 &&
          segmentsToAudit.length >= 2 &&
          /^(?:recommendation|conclusion|in conclusion|to conclude|overall|on balance|i recommend|we recommend)\b/i.test(
            segText.trim()
          );
        const aiPara = matchAiPara(segText, idx, aiAudit, isLastAndConclusion);
        if (isLastAndConclusion) {
          const isDup = isSegmentDuplicateOfAny(segText, seenSegments);
          const concEval = isDup
            ? 0
            : Math.min(
                2,
                evaluateDeterministicAo4({
                  answer,
                  marks: 8,
                  ao2Score: 1,
                  ao3Score: 1,
                  effectiveAppWords,
                  caseContext: caseMainStem,
                  finalParagraphOverride: segText,
                }).score
              );
          auditedParagraphs.push({
            paragraph_number: idx + 1,
            role: "conclusion",
            isolated_quote: segText.trim(),
            k_score: 0,
            app_score: 0,
            an_score: 0,
            eval_score: concEval,
            subtotal: concEval,
            max_subtotal: 2,
            critique: isDup
              ? "Conclusion repeated earlier paragraph; 0 evaluation credit."
              : concEval > 0
              ? `Conclusion awarded ${concEval}/2.`
              : "Conclusion lacks justified decision in case context.",
            is_duplicate: isDup,
          });
          return;
        }

        const audited = auditPaper2BodyParagraph(
          segText,
          idx,
          seenSegments,
          "body_point",
          knowledgeLedger,
          appDetailLedger,
          aiPara
        );
        if (!audited.is_duplicate && audited.isolated_quote) {
          seenSegments.push(audited.isolated_quote);
        }
        auditedParagraphs.push(audited);
      });

      const bodyAudits = auditedParagraphs.filter((p) => p.role !== "conclusion" && !p.is_duplicate);
      const conclusionAudit = auditedParagraphs.find((p) => p.role === "conclusion");
      const conclusionSatisfied = !asksConclusionOnEight || Boolean(conclusionAudit && (conclusionAudit.eval_score ?? 0) >= 1 && !conclusionAudit.is_duplicate);

      const validKParas = bodyAudits.filter((p) => p.k_score === 1);
      const appParas = validKParas.filter((p) => p.app_score === 1);
      const anParas = validKParas.filter((p) => p.an_score === 1);
      const completeParas = validKParas.filter((p) => p.app_score === 1 && p.an_score === 1);
      const strongDetailedParas = completeParas.filter((p) => p.has_detailed_an);

      const twoStepScan = scanPaper2CausalChains(seenSegments.join("\n\n") || answer);

      let totalScore = 0;
      let levelBand = "Level 0 (0 marks)";
      let bandTitle = "No Creditworthy Points";
      let levelDescription = "Response lacks valid Cambridge 0264 syllabus points.";
      let requirementToLevel3 = "Write 2+ separate paragraphs, each with Knowledge + Case App + detailed Causal Analysis.";

      if (validKParas.length === 0) {
        totalScore = 0;
      } else if (strongDetailedParas.length >= 2 && conclusionSatisfied) {
        // Level 3 (7–8): 2+ paragraphs BOTH have strong K + App + detailed An (and conclusion if asked)
        const qualifiesForEight =
          strongDetailedParas.length >= 3 ||
          twoStepScan.validatedChains >= 2 ||
          (strongDetailedParas.length >= 2 && p2WordCount >= 65 && completeParas.length >= 2);
        totalScore = qualifiesForEight ? 8 : 7;
        levelBand = "Level 3 (7–8 marks)";
        bandTitle = "Developed Contextual Analysis";
        levelDescription =
          totalScore === 8
            ? "2+ paragraphs contain strong Knowledge, concrete Case Application, and detailed multi-step Analysis."
            : "2+ paragraphs contain strong Knowledge, Case Application, and developed Analysis.";
        requirementToLevel3 =
          totalScore === 8
            ? "Full Level 3 Cambridge 0264 standard achieved."
            : "Develop two-step causal chains to commercial impact across paragraphs for 8/8.";
      } else if (
        validKParas.length >= 1 &&
        (appParas.length >= 1 || anParas.length >= 1) &&
        (completeParas.length >= 1 || (appParas.length >= 2 && validKParas.length >= 2) || (anParas.length >= 2 && validKParas.length >= 2))
      ) {
        // Level 2 (4–6): Paragraphs have K + App + basic An, OR one paragraph is strong while another lacks App/An
        if (completeParas.length >= 2 || (strongDetailedParas.length >= 1 && validKParas.length >= 2 && (appParas.length >= 2 || anParas.length >= 2))) {
          totalScore = 6;
        } else if (
          (strongDetailedParas.length >= 1 && validKParas.length >= 2) ||
          (completeParas.length >= 1 && validKParas.length >= 2) ||
          (appParas.length >= 2 && anParas.length >= 1)
        ) {
          totalScore = 5;
        } else {
          totalScore = 4;
        }
        levelBand = "Level 2 (4–6 marks)";
        bandTitle = "Applied Explanation";
        levelDescription =
          strongDetailedParas.length === 1 && validKParas.length >= 2
            ? "One paragraph is strong [K+App+An], while another paragraph lacks its own App or detailed An."
            : "Paragraphs explain points with Case Application and basic Analysis, but lack 2+ paragraphs with detailed multi-step Analysis.";
        requirementToLevel3 =
          !conclusionSatisfied
            ? "Requirement to Reach Level 3 (7–8): Add a brief Conclusion answering the judgment prompt."
            : "Requirement to Reach Level 3 (7–8): Ensure at least 2 paragraphs BOTH have Knowledge + concrete Case Application + detailed multi-step Analysis.";
      } else {
        // Level 1 (1–3): Generic points with weak/missing App and An
        if (validKParas.length >= 2 && (appParas.length >= 1 || anParas.length >= 1)) {
          totalScore = 3;
        } else if (validKParas.length >= 2 || appParas.length >= 1 || anParas.length >= 1) {
          totalScore = 2;
        } else {
          totalScore = 1;
        }
        levelBand = "Level 1 (1–3 marks)";
        bandTitle = "Limited / Generic Identification";
        levelDescription = "Generic syllabus statements with weak or missing isolated Case Application and Analysis.";
        requirementToLevel3 =
          "Requirement to Reach Level 3 (7–8): Apply specific case figures/facts and develop 'because -> therefore -> impact' analysis inside 2+ separate paragraphs.";
      }

      // Allocate AO1 (max 2), AO2 (max 2), AO3 (max 4) strictly matching audited strengths and summing to totalScore
      let ao1Score = Math.min(2, validKParas.length, totalScore);
      let ao2Score = Math.min(2, appParas.length, Math.max(0, totalScore - ao1Score));
      let ao3Score = Math.min(4, anParas.length > 0 ? Math.max(0, totalScore - ao1Score - ao2Score) : 0);

      // Ensure sum === totalScore when totalScore is in 1..8 respecting AO caps
      let remainder = totalScore - (ao1Score + ao2Score + ao3Score);
      if (remainder > 0 && ao3Score < 4 && anParas.length > 0) {
        const add = Math.min(remainder, 4 - ao3Score);
        ao3Score += add;
        remainder -= add;
      }
      if (remainder > 0 && ao2Score < 2 && appParas.length > 0) {
        const add = Math.min(remainder, 2 - ao2Score);
        ao2Score += add;
        remainder -= add;
      }
      if (remainder > 0 && ao1Score < 2) {
        const add = Math.min(remainder, 2 - ao1Score);
        ao1Score += add;
        remainder -= add;
      }
      if (remainder > 0) {
        totalScore = ao1Score + ao2Score + ao3Score;
      }

      const paraNotes = auditedParagraphs.map((p) => {
        if (p.is_duplicate) return `P${p.paragraph_number}: 0/3 (duplicate)`;
        if (p.role === "conclusion") return `Conclusion: ${p.eval_score}/2 [Eval]`;
        const tags = [p.k_score ? "K" : "", p.app_score ? "App" : "", p.an_score ? (p.has_detailed_an ? "An+" : "An") : ""]
          .filter(Boolean)
          .join("+");
        return `P${p.paragraph_number}: ${p.subtotal}/3 [${tags || "0"}]`;
      });
      const segmentBreakdownLine = `${paraNotes.join(" · ")} → ${levelBand}: ${totalScore}/8`;

      return {
        ao1Score,
        ao2Score,
        ao3Score,
        ao4Score: 0,
        ao4Result: null as DeterministicAo4Result | null,
        totalScore,
        levelBand,
        levelLabelShort: `Level ${totalScore >= 7 ? "3" : totalScore >= 4 ? "2" : totalScore >= 1 ? "1" : "0"}: ${totalScore}/8 — ${bandTitle}`,
        levelDescription,
        requirementToLevel3,
        segmentBreakdownLine,
        paragraphAudits: auditedParagraphs,
      };
    }

    // =========================================================================
    // PAPER 2 PART (b) — 12 MARKS (3 Option Paragraphs + 1 Conclusion -> Level 1–3)
    // =========================================================================
    const rawParas = p2Segments.length > 0 ? p2Segments : [answer];
    const lastIdx = rawParas.length - 1;
    const lastText = rawParas[lastIdx]?.trim() || "";
    const hasExplicitConclusionPara =
      rawParas.length >= 2 &&
      (/^(?:recommendation|conclusion|in conclusion|to conclude|overall|on balance|in summary|to sum up|i recommend|we recommend|ultimately)\b/i.test(
        lastText
      ) ||
        (rawParas.length >= 4 &&
          /\b(recommend|should choose|should use|should select|best option|better option|outweigh)\b/i.test(
            lastText
          )));

    const optionRawParas = hasExplicitConclusionPara ? rawParas.slice(0, lastIdx) : rawParas;
    const conclusionRawPara = hasExplicitConclusionPara ? lastText : "";

    const seenOptions: string[] = [];
    const knowledgeLedger = createKnowledgeCreditLedger();
    const appDetailLedger = new Set<string>();
    const auditedOptionParas: ParagraphAuditItem[] = optionRawParas.map((seg, idx) => {
      const aiPara = matchAiPara(seg, idx, aiAudit, false);
      const audited = auditPaper2BodyParagraph(
        seg,
        idx,
        seenOptions,
        "option",
        knowledgeLedger,
        appDetailLedger,
        aiPara
      );
      if (!audited.is_duplicate && audited.isolated_quote) {
        seenOptions.push(audited.isolated_quote);
      }
      return audited;
    });

    const deduplicatedOptionText = seenOptions.join("\n\n") || answer;
    const dedupCausalScan = scanPaper2CausalChains(deduplicatedOptionText);
    const dedupAppDetection = detectCaseContext(deduplicatedOptionText, {
      validAppWords,
      caseContext: caseMainStem,
      ao2Max,
    });
    const dedupWords = deduplicatedOptionText.split(/\s+/).filter(Boolean).length;
    const dedupKnowledgeEval = checkKnowledgePointMatches(deduplicatedOptionText, msKps, modelAnswer);
    const dedupSyllabusTerms = countSyllabusTerms(deduplicatedOptionText.toLowerCase());

    const uniqueValidOptions = auditedOptionParas.filter((p) => !p.is_duplicate && p.k_score === 1);
    const appOptionCount = uniqueValidOptions.filter((p) => p.app_score === 1).length;
    const anOptionCount = uniqueValidOptions.filter((p) => p.an_score === 1).length;
    const completeOptionCount = uniqueValidOptions.filter((p) => p.app_score === 1 && p.an_score === 1).length;
    const detailedOptionCount = uniqueValidOptions.filter(
      (p) => p.app_score === 1 && p.an_score === 1 && p.has_detailed_an
    ).length;

    // --- AO1 (max 2) ---
    const aiKTotal = auditedOptionParas.filter((p) => !p.is_duplicate && p.k_score === 1).length;
    let ao1Score = 0;
    if (calcCheck.isCalculation && calcCheck.expectedOutputs > 0) {
      ao1Score =
        calcCheck.matchedOutputs >= calcCheck.expectedOutputs
          ? 2
          : calcCheck.matchedOutputs >= 1 || calcCheck.hasWorking
          ? 1
          : 0;
    } else if (!vagueFillerOnly) {
      let detAo1 = 0;
      if (
        (uniqueValidOptions.length >= 2 && dedupWords >= 22) ||
        (dedupWords >= 30 &&
          (dedupKnowledgeEval.isFullMatch ||
            (dedupKnowledgeEval.domainOverlapCount >= 4 && dedupSyllabusTerms >= 2) ||
            (dedupSyllabusTerms >= 3 && dedupKnowledgeEval.domainOverlapCount >= 2)))
      ) {
        detAo1 = 2;
      } else if (
        uniqueValidOptions.length >= 1 ||
        (dedupWords >= 12 &&
          (dedupKnowledgeEval.matchedCount >= 1 || dedupKnowledgeEval.domainOverlapCount >= 2 || dedupSyllabusTerms >= 2))
      ) {
        detAo1 = 1;
      }
      const llmAo1 = aiKTotal >= 2 && dedupWords >= 22 ? 2 : aiKTotal >= 1 && dedupWords >= 10 ? 1 : 0;
      ao1Score = Math.min(2, Math.max(detAo1, llmAo1));
      if (singleRepeatedPointCap) ao1Score = Math.min(ao1Score, 1);
    }

    const onTopic = ao1Score > 0;

    // --- AO2 (max 3; isolated across unique option segments) ---
    let ao2Score = 0;
    if (onTopic && effectiveAppWords.length > 0 && dedupAppDetection.passed) {
      if (ao2Max >= 3 && (appOptionCount >= 3 || (dedupAppDetection.foundWords.length >= 3 && dedupWords >= 40))) {
        ao2Score = 3;
      } else if (appOptionCount >= 2 || (dedupAppDetection.foundWords.length >= 2 && dedupWords >= 28)) {
        ao2Score = 2;
      } else if (appOptionCount >= 1 || dedupAppDetection.foundWords.length >= 1) {
        ao2Score = 1;
      }
    } else if (onTopic && effectiveAppWords.length === 0) {
      ao2Score = dedupWords >= 45 ? ao2Max : 1;
    }

    // --- AO3 (max 4; isolated per option paragraph) ---
    let ao3Score = 0;
    if (onTopic && ao3Guardrail.passed) {
      const twoStep = dedupCausalScan.validatedChains;
      const singleStep = dedupCausalScan.singleStepReasons;

      const optionParas = dedupCausalScan.paragraphDetails.filter((p) => !p.isConclusionLike);
      const optionParasForCheck =
        optionParas.length >= 2 ? optionParas : dedupCausalScan.paragraphDetails;
      const allOptionParasTwoSidedChains =
        optionParasForCheck.length >= 2 &&
        optionParasForCheck.every(
          (p) => p.hasTwoSidedContrast && p.proHasCausal && p.conHasCausal && p.validatedChains >= 1
        );
      const optValidated = optionParasForCheck.reduce((s, p) => s + p.validatedChains, 0);
      const optSingle = optionParasForCheck.reduce((s, p) => s + p.singleStepReasons, 0);
      const optParaWithAnalysis = optionParasForCheck.filter(
        (p) => p.validatedChains > 0 || p.singleStepReasons > 0
      ).length;
      const finalHasMitigation = detectMitigationOrContingency(conclusionRawPara || extractFinalParagraph(answer));

      if (allOptionParasTwoSidedChains && finalHasMitigation && dedupWords >= 65 && completeOptionCount >= 3) {
        ao3Score = 4;
      } else if (
        ((optSingle >= 4 && optParaWithAnalysis >= 2) ||
          (optValidated >= 1 && (optSingle >= 1 || optParaWithAnalysis >= 2 || anOptionCount >= 3)) ||
          (twoStep >= 1 && (singleStep >= 1 || dedupCausalScan.paragraphsWithAnalysis >= 2))) &&
        dedupWords >= 45
      ) {
        ao3Score = 3;
      } else if (
        (twoStep >= 1 && dedupWords >= 28) ||
        (singleStep >= 2 && dedupWords >= 30) ||
        (anOptionCount >= 2 && dedupWords >= 30)
      ) {
        ao3Score = 2;
      } else if ((singleStep >= 1 || causalScan.basicReasons >= 1 || anOptionCount >= 1) && dedupWords >= 18) {
        ao3Score = 1;
      }
    }

    // --- AO4 (max 3; strictly audited on final Conclusion paragraph, rejects repetition of options) ---
    let ao4Result: DeterministicAo4Result | null = null;
    let ao4Score = 0;
    const concIsDuplicateOfOptions =
      Boolean(conclusionRawPara) && isSegmentDuplicateOfAny(conclusionRawPara, seenOptions);

    if (onTopic && p2WordCount >= 28 && !concIsDuplicateOfOptions) {
      ao4Result = evaluateDeterministicAo4({
        answer,
        marks: 12,
        ao2Score,
        ao3Score,
        effectiveAppWords,
        caseContext: caseMainStem,
        finalParagraphOverride: conclusionRawPara || undefined,
      });
      ao4Score = ao4Result.score;
    }

    const auditedParagraphs: ParagraphAuditItem[] = [...auditedOptionParas];
    if (conclusionRawPara) {
      const aiConc = matchAiPara(conclusionRawPara, rawParas.length - 1, aiAudit, true);
      auditedParagraphs.push({
        paragraph_number: auditedOptionParas.length + 1,
        role: "conclusion",
        isolated_quote: conclusionRawPara,
        k_score: 0,
        app_score: 0,
        an_score: 0,
        eval_score: ao4Score,
        subtotal: ao4Score,
        max_subtotal: 3,
        critique: concIsDuplicateOfOptions
          ? "Conclusion merely repeated an earlier option paragraph; awarded 0/3 Evaluation."
          : ao4Result?.feedback || (ao4Score > 0 ? aiConc?.critique || "Evaluative conclusion credited." : "Conclusion lacks justified comparison in context."),
        is_duplicate: concIsDuplicateOfOptions,
      });
    }

    // --- Official Cambridge 0264 12-Mark Level Band Gating ---
    // Level 3 (9–12): All 3 option paragraphs have K + App + detailed An, PLUS conclusion with justified Eval comparing options in context.
    // Level 2 (5–8): Options have K + App + some An, OR conclusion merely repeats earlier points / is missing / lacks justified contextual Eval.
    // Level 1 (1–4): Generic statements with weak/missing App and An.
    let totalScore = 0;
    let levelBand = "";
    let bandTitle = "";
    let levelDescription = "";
    let requirementToLevel3 = "";

    const hasAllThreeCompleteOptions = completeOptionCount >= 3 || (optionRawParas.length <= 2 && completeOptionCount >= 2 && detailedOptionCount >= 2);

    if (ao3Score === 0 || ao2Score === 0 || ao1Score === 0 || ao3Score < 2) {
      // Level 1 (1–4 marks — Limited / Descriptive)
      ao4Score = 0;
      const rawL1 = ao1Score + ao2Score + ao3Score;
      totalScore = Math.min(4, Math.max(onTopic ? 1 : 0, rawL1));
      if (ao1Score + ao2Score + ao3Score > totalScore) {
        ao3Score = Math.max(0, totalScore - ao1Score - ao2Score);
        if (ao1Score + ao2Score > totalScore) {
          ao2Score = Math.max(0, totalScore - ao1Score);
        }
      }
      levelBand = totalScore === 0 ? "Level 0 (0 marks)" : "Level 1 (1–4 marks)";
      bandTitle = totalScore === 0 ? "No Creditable Response" : "Limited / Descriptive";
      levelDescription =
        totalScore === 0
          ? "No creditable response."
          : "Limited knowledge & understanding in context; limited discussion with little/no explanation and a simple judgement with limited justification.";
      const missing: string[] = [];
      if (ao2Score === 0) missing.push("apply concrete case facts/figures inside each paragraph (AO2)");
      if (ao3Score < 2) missing.push("develop 'because -> therefore' causal chains inside each option paragraph (AO3)");
      missing.push("add a conclusion with justified Eval comparing options in context");
      requirementToLevel3 = `Requirement to Reach Level 3: ${missing.join("; ")}.`;
    } else if (
      !(
        ao1Score >= 2 &&
        ao2Score >= 2 &&
        ao3Score >= 3 &&
        ao4Score >= 2 &&
        hasAllThreeCompleteOptions &&
        !concIsDuplicateOfOptions
      )
    ) {
      // Level 2 (5–8 marks — Developed Analysis in Context)
      const rawL2 = ao1Score + ao2Score + ao3Score + ao4Score;
      totalScore = Math.min(8, Math.max(5, rawL2));
      if (ao1Score + ao2Score + ao3Score + ao4Score > 8) {
        let excess = ao1Score + ao2Score + ao3Score + ao4Score - 8;
        if (ao3Score >= 2 && ao4Score >= 2 && ao2Score > 2) {
          const trimAo2 = Math.min(excess, ao2Score - 2);
          ao2Score -= trimAo2;
          excess -= trimAo2;
        }
        if (excess > 0 && ao3Score >= 3 && ao4Score === 0) {
          const trimAo3 = Math.min(excess, ao3Score - 2);
          ao3Score -= trimAo3;
          excess -= trimAo3;
        }
        if (excess > 0) {
          const minAo4 = ao3Score >= 2 && ao4Score >= 2 ? 2 : 0;
          const trimAo4 = Math.min(excess, Math.max(0, ao4Score - minAo4));
          ao4Score -= trimAo4;
          excess -= trimAo4;
        }
        if (excess > 0) {
          ao2Score = Math.max(1, ao2Score - excess);
        }
      }
      levelBand = "Level 2 (5–8 marks)";
      bandTitle = "Developed Analysis in Context";
      levelDescription = concIsDuplicateOfOptions
        ? "Good knowledge & understanding in context + detailed discussion of at least one option + judgement with some justification, but the conclusion repeated earlier points instead of weighing trade-offs."
        : !hasAllThreeCompleteOptions
        ? "Good knowledge & understanding in context + detailed discussion of at least one option + judgement with some justification, but not all options contain isolated Case Application and detailed Analysis."
        : "Good knowledge & understanding in context + detailed discussion of at least one option + judgement with some justification/evaluation.";
      const missing: string[] = [];
      if (!hasAllThreeCompleteOptions) missing.push("ensure ALL 3 option paragraphs contain K + App + detailed An");
      if (ao2Score < 2) missing.push("apply distinct case details inside each paragraph (AO2 >= 2/3)");
      if (ao3Score < 3) missing.push("develop two-step causal chains across options (AO3 >= 3/4)");
      if (concIsDuplicateOfOptions) missing.push("replace repeated points in Conclusion with new contextual trade-off evaluation");
      else if (ao4Score < 2) {
        missing.push("add a Conclusion paragraph weighing trade-offs and comparing options in context (AO4 >= 2/3)");
      }
      requirementToLevel3 = `Requirement to Reach Level 3: ${missing.join("; ")}.`;
    } else {
      // Level 3 (9–12 marks — Supported Evaluation & Recommendation)
      const rawL3 = ao1Score + ao2Score + ao3Score + ao4Score;
      totalScore = Math.min(12, Math.max(9, rawL3));
      levelBand = "Level 3 (9–12 marks)";
      bandTitle = "Supported Evaluation & Recommendation";
      levelDescription =
        ao4Score === 3
          ? "Excellent knowledge & understanding in context + detailed discussion of both options + a well-justified recommendation, including why the alternative was rejected and how drawbacks are managed."
          : "Excellent knowledge & understanding in context + detailed discussion of both options + a well-justified recommendation explaining why the alternative was rejected.";
      requirementToLevel3 =
        totalScore < 12
          ? "To reach 12/12: Ensure 3/3 AO2, 4/4 two-sided AO3 across all 3 options, and 3/3 AO4 weighing trade-offs/mitigation in context."
          : "Full Level 3 Cambridge 0264 standard achieved.";
    }

    // Keep the conclusion paragraph audit numerically synced with the final Level-gated AO4
    // score so the UI never shows AO4: 0/3 in the summary while claiming Eval: 1/3 below.
    if (markValue === 12) {
      const conclusionAudit = auditedParagraphs.find((p) => p.role === "conclusion");
      if (conclusionAudit) {
        conclusionAudit.eval_score = ao4Score;
        conclusionAudit.subtotal = ao4Score;
      }
    }

    const levelNumberMatch = levelBand.match(/Level\s+(\d)/);
    const levelLabelShort = `Level ${levelNumberMatch ? levelNumberMatch[1] : "1"}: ${totalScore}/${markValue} — ${bandTitle}`;

    const segmentSummaryTags = auditedParagraphs.map((p) => {
      if (p.is_duplicate) return `P${p.paragraph_number}: duplicate (0)`;
      if (p.role === "conclusion") return `Recommendation: ${ao4Score}/3 [Eval]`;
      const tags = [
        p.k_score ? "K" : "",
        p.app_score ? "App" : "",
        p.an_score ? (p.has_detailed_an ? "An(detailed)" : "An") : "",
      ]
        .filter(Boolean)
        .join("+");
      return `P${p.paragraph_number}: [${tags || "0"}]`;
    });
    const segmentBreakdownLine =
      segmentSummaryTags.length > 0 ? `${segmentSummaryTags.join(" · ")} → Total: ${totalScore}/12` : "";

    return {
      ao1Score,
      ao2Score,
      ao3Score,
      ao4Score,
      ao4Result,
      totalScore,
      levelBand,
      levelLabelShort,
      levelDescription,
      requirementToLevel3,
      segmentBreakdownLine,
      paragraphAudits: auditedParagraphs,
    };
  };

  // Helper to assemble final Paper2EvaluationResult consistently for both AI and Fallback paths
  const buildPaper2Result = (
    computed: ReturnType<typeof computePaper2Scores>,
    isAi: boolean,
    aiAudit?: QwenParagraphAuditResult
  ): Paper2EvaluationResult => {
    const {
      ao1Score,
      ao2Score,
      ao3Score,
      ao4Score,
      ao4Result,
      totalScore,
      levelBand,
      levelLabelShort,
      levelDescription,
      requirementToLevel3,
      segmentBreakdownLine,
      paragraphAudits,
    } = computed;

    const strengths: string[] = [];
    if (ao1Score >= 2) strengths.push(aiAudit?.overall_critique || "Accurate identification of Cambridge 0264 syllabus concepts.");
    else if (ao1Score >= 1) strengths.push("Identified a relevant syllabus point.");
    if (ao2Score >= 2) strengths.push(`Consistently applied case context (${appScan.foundWords.slice(0, 3).join(", ")}).`);
    else if (ao2Score >= 0.5) strengths.push(`Referenced case fact (${appScan.foundWords.slice(0, 2).join(", ")}).`);
    if (ao3Score >= 3) strengths.push("Developed cause-and-effect analytical chains.");
    else if (ao3Score >= 1) strengths.push("Included some causal reasoning.");
    if (markValue === 12 && ao4Score >= 2) strengths.push("Included reasoned evaluation comparing options in context.");
    if (strengths.length === 0) strengths.push("Engaged with the question prompt.");

    const improvements: string[] = [];
    if (ao1Score < 2) {
      improvements.push(
        markValue === 8
          ? "Include distinct paragraphs, each stating a clear Cambridge 0264 syllabus point."
          : "Demonstrate distinct Cambridge 0264 syllabus concepts across all option paragraphs."
      );
    }
    if (ao2Score === 0) {
      improvements.push(
        `Include specific case facts/figures such as: ${effectiveAppWords.slice(0, 4).join(", ") || "figures from Appendices 1–3"} (company names alone score 0 AO2).`
      );
    } else if (ao2Score < ao2Max) {
      improvements.push(
        markValue === 8
          ? "Apply specific case figures/facts INSIDE every paragraph (no cross-paragraph carryover)."
          : `Cite case details inside EVERY option paragraph for full ${ao2Max}/${ao2Max} AO2.`
      );
    }
    if (ao3Score < 4) {
      improvements.push(
        markValue === 8
          ? "Include a detailed 'because -> therefore -> business impact' chain inside at least 2 paragraphs for Level 3 (7–8)."
          : ao3Score < 3
          ? "Build 'because -> therefore -> business impact' chains inside each option paragraph (linking to profit, cash flow, defects, or sales)."
          : "Extend developed two-sided causal chains across all 3 option paragraphs for full 4/4 AO3."
      );
    }
    if (markValue === 12 && ao4Score < ao4Max) {
      improvements.push(
        ao4Result?.feedback ||
          "In your final Conclusion paragraph, weigh trade-offs in context without repeating earlier points."
      );
    }

    const prefix = isAi && webllmEngine
      ? `[${getActiveQwenConfig(webllmEngine.tier).shortLabel} Cambridge 0264 Anti-Halo Examiner]`
      : "[Cambridge 0264 Anti-Halo Examiner]";

    const examinerNotes =
      markValue === 8
        ? `${prefix} ${segmentBreakdownLine}`
        : `${prefix} ${levelLabelShort}. ${segmentBreakdownLine ? `${segmentBreakdownLine}. ` : ""}${requirementToLevel3}`;

    return {
      totalScore,
      maxMarks: markValue,
      level: levelBand,
      levelDescription,
      percentage: Math.round((totalScore / markValue) * 100),
      aoBreakdown: {
        ao1: {
          score: ao1Score,
          max: ao1Max,
          feedback:
            ao1Score === 0
              ? "0/2: Syllabus knowledge did not match the 0264 mark scheme."
              : ao1Score === 1
              ? `1/2: ${singleRepeatedPointCap ? "Repeated idea counted once; add a second distinct concept." : "Basic knowledge shown; add distinct syllabus points across paragraphs."}`
              : "2/2: Business concepts accurately demonstrated across paragraphs.",
        },
        ao2: {
          score: ao2Score,
          max: ao2Max,
          feedback:
            ao2Score === 0
              ? `0/${ao2Max}: No concrete case study facts detected (company name-dropping alone does not earn AO2).`
              : ao2Score < ao2Max
              ? `Partial application (${ao2Score}/${ao2Max}): Applied case context in only some paragraphs (no carryover).`
              : `${ao2Max}/${ao2Max}: Applied concrete case facts (${appScan.foundWords.slice(0, 3).join(", ")}).`,
        },
        ao3: {
          score: ao3Score,
          max: ao3Max,
          feedback:
            ao3Score === 0
              ? "0/4: Lacks explanatory connectives ('because', 'therefore', 'which leads to') with a business mechanism."
              : ao3Score < 3
              ? `Developing analysis (${ao3Score}/4): ${paper2CausalScan.validatedChains} two-step chain(s), ${paper2CausalScan.singleStepReasons} single-step reason(s); deepen causal links inside each paragraph.`
              : `Developed causal analysis (${ao3Score}/4): ${paper2CausalScan.validatedChains} two-step chain(s), ${paper2CausalScan.singleStepReasons} single-step reason(s).`,
        },
        ...(markValue === 12
          ? {
              ao4: {
                score: ao4Score,
                max: ao4Max,
                feedback:
                  ao4Result?.feedback ||
                  `AO4 score: ${ao4Score}/${ao4Max}.`,
              },
            }
          : {}),
      },
      strengths,
      improvements: improvements.length > 0 ? improvements : ["Maintain precise focus on Appendices 1–3."],
      examinerNotes,
      isAiEvaluated: isAi,
      appWordsFound: appScan.foundWords,
      evaluatedAt: new Date().toISOString(),
      questionType,
      paragraphAudits,
    };
  };

  // 1. Try the Local Qwen 3 0.6B AI Anti-Halo Paragraph Audit if engine available
  if (webllmEngine) {
    try {
      const userPrompt = buildParagraphAuditUserPrompt({
        questionType,
        questionText: `${questionNumber ? `${questionNumber}: ` : ""}${questionText}`,
        markValue,
        markSchemeText: formatPaper2MarkSchemeBullets(markScheme),
        studentAnswer: answer,
        caseContextSummary: caseMainStem,
        targetAppKeywords: effectiveAppWords,
      });

      const raw = await runQwenChatCompletion({
        engine: webllmEngine,
        systemPrompt: CAMBRIDGE_0264_SYSTEM_PROMPT,
        userPrompt,
        maxNewTokens: computeRecommendedMaxTokens(answer, questionType),
        temperature: 0.0,
      });

      if (raw && raw.trim()) {
        let aiAudit: QwenParagraphAuditResult;
        try {
          aiAudit = parseParagraphAuditResponse(raw, questionType, answer);
        } catch (parseErr) {
          console.warn(
            "[QwenEngine] Initial Paper 2 paragraph audit unusable — re-auditing per paragraph:",
            parseErr instanceof Error ? parseErr.message : parseErr
          );
          aiAudit = {
            question_type: questionType,
            paragraphs: [],
            overall_critique:
              "Local Qwen audit incomplete — paragraphs were re-audited individually.",
          };
        }
        aiAudit = await completeParagraphAudit({
          engine: webllmEngine,
          paragraphAudit: aiAudit,
          studentAnswer: answer,
          questionType,
          questionText: `${questionNumber ? `${questionNumber}: ` : ""}${questionText}`,
          markValue,
          markSchemeText: formatPaper2MarkSchemeBullets(markScheme),
          caseContextSummary: caseMainStem,
          targetAppKeywords: effectiveAppWords,
        });
        const computed = computePaper2Scores(aiAudit);
        return buildPaper2Result(computed, true, aiAudit);
      }
    } catch (aiErr) {
      console.warn("Local Qwen evaluation error, falling back to deterministic examiner:", aiErr);
    }
  }

  // 2. Deterministic Cambridge 0264 Anti-Halo Examiner Fallback
  const fallbackComputed = computePaper2Scores();
  const result = buildPaper2Result(fallbackComputed, false);
  if (webllmEngine) {
    result.examinerNotes = `Local AI could not complete this assessment. Instant Examiner marked your answer. ${result.examinerNotes}`;
  }
  return result;
}

/* EcBiz local AI / instant marking engine — plain ES5 JavaScript, no framework or build step.
 *
 * Ports the deterministic Cambridge IGCSE Business (0264) marking rules from
 * src/lib/engine/evaluator.ts (keyword/exemplar match, AO2 application cap,
 * AO4 evaluation cap + final-paragraph scope, AO3 consequence chains,
 * duplicate/anti-repetition suppression, 2-mark pure-knowledge forcing,
 * Paper 2 level-gated marking and 8-mark band labels) and exposes them as
 * window.EC.autoMark(answer, questionInfo).
 *
 * The optional local model path loads Transformers.js v3 directly from the
 * jsDelivr ESM CDN (no build step, no worker bundle) and runs the q4f16 Qwen 3
 * 0.6B ONNX model with WebGPU, falling back to WASM. It ALWAYS degrades to the
 * deterministic marker if the CDN/model cannot load or generate.
 */
(function () {
  "use strict";

  if (!window.EC) return;
  var EC = window.EC;
  function esc(v) { return EC.esc(v); }

  /* ================================================================ */
  /* ES5 helpers                                                       */
  /* ================================================================ */

  function hasOwn(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  function indexOf(arr, v) { for (var i = 0; i < arr.length; i++) { if (arr[i] === v) return i; } return -1; }
  function uniq(arr) { var out = []; for (var i = 0; i < arr.length; i++) { if (indexOf(out, arr[i]) === -1) out.push(arr[i]); } return out; }
  function clampI(v, min, max) { var n = Number(v); if (!isFinite(n)) return min; return Math.max(min, Math.min(max, Math.round(n))); }
  function wc(s) { return (s && String(s).trim()) ? String(s).trim().split(/\s+/).length : 0; }
  function includes(t, n) { return String(t == null ? "" : t).indexOf(n) !== -1; }
  function escapeRegExp(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  function normalizeText(t) { return String(t || "").toLowerCase().replace(/[,/#!$%\^&\*;:{}=\-_`~()]/g, " ").replace(/\s+/g, " "); }
  function hasTerm(lower, term) { return new RegExp("\\b" + escapeRegExp(term).replace(/\s+/g, "\\s+") + "\\b", "i").test(lower); }
  function find(arr, fn) { for (var i = 0; i < arr.length; i++) { if (fn(arr[i], i)) return arr[i]; } return null; }
  function asArray(v) { return Array.isArray(v) ? v : (v ? [v] : []); }
  function lowerArr(arr) { var o = {}; for (var i = 0; i < arr.length; i++) { o[String(arr[i]).toLowerCase()] = true; } return o; }

  /* ================================================================ */
  /* Rule vocabulary (ported from evaluator.ts)                        */
  /* ================================================================ */

  var GENERIC_FILLER = lowerArr([
    "the", "and", "for", "with", "from", "that", "this", "these", "those", "have", "been", "which",
    "will", "would", "could", "should", "they", "their", "them", "there", "here", "into", "over",
    "under", "more", "less", "most", "some", "many", "such", "also", "very", "business", "businesses",
    "company", "companies", "firm", "firms", "profit", "profits", "cost", "costs", "price", "prices",
    "money", "sales", "revenue", "customer", "customers", "worker", "workers", "staff", "employee",
    "employees", "people", "market", "markets", "product", "products", "service", "services", "good",
    "goods", "increase", "increases", "increased", "increasing", "decrease", "decreases", "decreased",
    "higher", "lower", "better", "worse", "greater", "smaller", "large", "small", "high", "low",
    "benefit", "benefits", "advantage", "advantages", "disadvantage", "disadvantages", "reason",
    "reasons", "factor", "factors", "impact", "effect", "result", "cause", "because", "therefore",
    "however", "overall", "although", "whereas", "while", "when", "using", "used", "make", "making",
    "made", "need", "needs", "help", "helps", "able", "allow", "allows", "lead", "leads", "mean",
    "means", "may", "might", "can", "one", "two", "three", "four", "first", "second"
  ]);

  var VAGUE_EXTRA = lowerArr([
    "save", "saves", "saving", "saved", "happy", "happier", "good", "bad", "nice", "easy", "easier",
    "fast", "faster", "cheap", "cheaper", "quick", "quicker", "thing", "things", "stuff", "lot",
    "lots", "really", "always", "never", "everyone", "everything", "something", "anything", "helpful",
    "useful", "important", "successful", "success", "works", "working", "run", "runs", "grows", "growing"
  ]);

  var JACCARD_STOP = lowerArr([
    "a", "an", "the", "is", "are", "was", "were", "be", "been", "being", "to", "of", "in", "for",
    "on", "with", "and", "or", "that", "this", "it", "its", "as", "by", "from", "can", "will",
    "would", "could", "should", "also", "which", "so", "they", "them", "their", "have", "has",
    "had", "into", "more", "than"
  ]);

  var LIGHT_ACTION = lowerArr([
    "make", "makes", "making", "made", "get", "gets", "getting", "got", "give", "gives", "taking",
    "take", "takes", "have", "has", "do", "does", "be", "is", "are", "was", "were", "can", "could",
    "will", "would", "may", "might", "should", "must", "more", "less", "very", "really", "also",
    "then", "than", "this", "these", "those", "which", "increase", "increases", "reduce", "reduces",
    "lower", "lowers", "raise", "raises", "improve", "improves", "boost", "boosts", "create",
    "creates", "generate", "generates", "lead", "leads", "result", "results", "cause", "causes",
    "allow", "allows", "enable", "enables", "ensure", "ensures", "help", "helps", "provide",
    "provides", "offer", "offers", "keep", "keeps", "retain", "retains", "earn", "earns", "receive",
    "pay", "pays", "sell", "produce", "produces", "employ", "employs", "they", "their", "them",
    "there", "with", "from", "into", "over", "under", "when", "where", "what", "while", "because",
    "therefore", "since", "thus", "hence"
  ]);

  /* AO1 KNOWLEDGE_TERMS — the full ~140-term Cambridge 0264 highlight bank from
   * AOHighlightViewer.tsx:110-255. SYLLABUS_TERMS below stays as the original
   * narrow "mechanism" bank, but is widened with these so AO1 knowledge
   * detection, the concept-set ledger and the calculation backfill all see the
   * same vocabulary the original React engine used. */
  var KNOWLEDGE_TERMS = [
    "fixed costs", "variable costs", "fixed cost", "variable cost", "revenue", "profit",
    "break-even", "margin of safety", "market segmentation", "niche market", "mass market",
    "economies of scale", "diseconomies of scale", "product life cycle", "price elasticity",
    "demand", "supply", "equilibrium", "sole trader", "unlimited liability", "limited liability",
    "partnership", "private limited company", "public limited company", "plc", "ltd",
    "joint venture", "franchise", "franchisee", "franchisor", "quality control", "quality assurance",
    "total quality management", "tqm", "just-in-time", "jit", "batch production", "flow production",
    "job production", "lean production", "kaizen", "buffer stock", "boston matrix", "cash cow",
    "cash dog", "star", "problem child", "opportunity cost", "factors of production", "land",
    "labour", "labor", "capital", "enterprise", "rent", "wages", "interest", "salary",
    "commission", "piece rate", "bonus", "fringe benefits", "profit sharing", "motivation",
    "maslow", "taylor", "herzberg", "hierarchy of needs", "hygiene factors", "job rotation",
    "job enrichment", "span of control", "chain of command", "delegation", "centralised",
    "decentralised", "autocratic", "democratic", "paternalistic", "laissez-faire", "trade union",
    "industrial action", "strike", "overtime", "recruitment", "redundancy", "dismissal",
    "contract of employment", "market research", "primary research", "secondary research",
    "sampling", "random sample", "quota sample", "market share", "marketing mix", "product",
    "price", "promotion", "place", "penetration pricing", "price skimming", "cost-plus pricing",
    "competitive pricing", "promotional mix", "branding", "brand image", "e-commerce",
    "distribution channel", "wholesaler", "retailer", "cash flow", "cash flow forecast",
    "working capital", "liquidity", "overdraft", "bank loan", "retained profit", "share capital",
    "income statement", "gross profit", "net profit", "balance sheet", "current ratio",
    "acid test ratio", "return on capital employed", "roce", "inflation", "unemployment",
    "economic growth", "gross domestic product", "gdp", "exchange rate", "appreciation",
    "depreciation", "tariff", "quota", "added value", "specialisation", "division of labour",
    "primary sector", "secondary sector", "tertiary sector"
  ];

  /* Analysis / evaluation connective banks from AOHighlightViewer.tsx:19-108. */
  var ANALYSIS_CONNECTIVES = [
    "this leads to", "as a result", "consequently", "therefore", "this means that", "meaning that",
    "which enables", "enabling the business to", "enabling them to", "enables the business to",
    "resulting in", "because of this", "leading to", "this results in", "which causes", "in turn",
    "which leads to", "this allows the business to", "this reduces", "this increases", "which helps",
    "subsequently", "due to this", "thereby", "because", "due to", "in order to", "allowing",
    "which impacts", "which lowers", "impact on profit", "affects cash flow", "loss of customers",
    "lower costs", "higher revenue", "higher profit", "reduces financial risk", "delays operations",
    "lowers unit costs", "increased productivity", "improves cash flow", "competitive advantage",
    "loss of reputation"
  ];
  var EVALUATION_CONNECTIVES = [
    "on balance", "in conclusion", "to conclude", "overall", "however", "weighing up", "weighing",
    "depends on", "depends upon", "it depends on", "the deciding factor", "deciding factor",
    "greater than", "outweigh", "outweighs", "short run", "long run", "in the short term",
    "in the long term", "in the short run", "in the long run", "ultimately", "despite this",
    "nevertheless", "on the other hand", "in contrast", "although", "vital that", "crucial factor",
    "vital factor", "most important factor", "most critical factor", "best option", "recommend",
    "justified because", "advantages are greater", "disadvantages are greater", "preferable",
    "superior", "decisive"
  ];

  var SYLLABUS_TERMS = uniq([
    "profit", "revenue", "turnover", "liquidity", "cash flow", "overdraft", "working capital",
    "economies of scale", "branding", "brand", "quality", "productivity", "efficiency",
    "division of labour", "division of labor", "specialisation", "specialization", "motivation",
    "training", "recruitment", "stakeholder", "added value", "fixed cost", "variable cost",
    "break-even", "margin", "contribution", "partnership", "sole trader", "limited liability",
    "shareholder", "dividend", "equity", "retained profit", "exchange rate", "inflation",
    "interest rate", "tax", "tariff", "recession", "sustainability", "export", "import",
    "factors of production", "land", "labour", "labor", "capital", "enterprise", "primary sector",
    "secondary sector", "tertiary sector", "industrialization", "joint venture", "franchise",
    "market research", "segmentation", "elasticity", "promotion", "distribution", "e-commerce",
    "delegation", "batch production", "flow production", "job production", "automation", "kaizen",
    "current ratio", "gross profit", "net profit", "inventory", "qualitative", "quantitative",
    "competitiveness", "unit cost", "customer loyalty", "market share", "target market", "continuity",
    "survival", "legal personality", "ownership", "risk sharing", "expertise", "opportunity cost",
    "supply chain", "marketing mix", "product life cycle", "brand image", "job satisfaction",
    "leadership", "industrial action", "lean production", "quality control", "capacity utilisation",
    "outsourcing", "globalisation", "corporate social responsibility", "business plan", "loan",
    "trade credit", "leasing", "crowdfunding", "private limited company", "public limited company",
    "merger", "takeover", "vertical integration", "horizontal integration", "customer base",
    "repeat purchase", "demand", "supply", "output", "capacity", "reputation", "goodwill",
    "competitive advantage", "margin of safety", "average cost", "fixed costs", "variable costs",
    "unit costs", "secondary research", "primary research", "cashflow", "profit margin"
  ].concat(KNOWLEDGE_TERMS));

  /* Full ~186-word concrete case-noun bank from evaluator.ts:117-142. */
  var CONCRETE_CASE_NOUNS = lowerArr([
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
    "hand-painted", "handcrafted", "biodegradable", "eco-friendly", "automated"
  ]);

  var EVAL_JUDGMENT = [
    "overall", "in conclusion", "to conclude", "to sum up", "in summary", "on balance", "recommend",
    "recommendation", "the deciding factor", "deciding factor", "outweigh", "outweighs", "greater than",
    "advantages are greater", "disadvantages are greater", "benefits outweigh", "costs outweigh",
    "better option", "best option", "more suitable", "preferable", "ultimately", "worthwhile",
    "worth it", "i conclude", "i believe", "i think", "should choose", "should use", "is superior",
    "crucial factor", "vital factor", "most significant", "more important than", "justified",
    "judgement", "judgment"
  ];

  var EVAL_QUALIFIER = [
    "however", "on the other hand", "depends on", "depends upon", "in the short term", "in the long term",
    "in the short run", "in the long run", "although", "whereas", "despite", "nevertheless",
    "nonetheless", "trade-off", "tradeoff", "opportunity cost", "conversely", "alternatively", "even though"
  ];

  var STRONG_CAUSAL_CHAINS = [
    "this leads to", "which leads to", "as a result", "consequently", "because of this", "therefore",
    "which means that", "which means", "meaning that", "enabling the business to", "enabling them to",
    "this causes", "which causes", "results in", "resulting in", "in turn", "which reduces",
    "which increases", "which lowers", "which raises", "which improves", "which attracts", "which avoids",
    "which prevents", "which protects", "which maintains", "which preserves", "which ensures",
    "which allows", "which enables", "leading to", "so that", "thereby", "due to this",
    "allowing the business", "which impacts", "impact on profit", "affects cash flow",
    "improves cash flow", "reduces financial risk", "lowers unit costs", "higher profit margin",
    "competitive advantage", "loss of customers", "loss of reputation", "delays operations"
  ];

  var BASIC_REASONS = ["because", "due to", "since", "in order to", "so it can", "so they can"];

  var CONSEQUENCE_TERMS = uniq([
    "cash flow", "cashflow", "cash inflow", "cash reserve", "working capital", "liquidity",
    "overdraft", "insolvency", "bankruptcy", "cost", "costs", "unit cost", "average cost",
    "fixed cost", "variable cost", "overheads", "expenses", "interest payments", "wastage", "risk",
    "failure", "lost customers", "lost sales", "efficiency", "productivity", "output", "capacity",
    "delay", "delays", "bottleneck", "absenteeism", "profit", "profits", "profitability",
    "profit margin", "revenue", "sales", "turnover", "margin", "orders", "decision", "strategy",
    "defects", "rework", "quality", "customer service", "satisfaction", "loyalty", "reputation",
    "morale", "demand", "training", "skills", "stock", "inventory", "interest", "debt"
  ]);

  var STRICT_CAUSAL_RE = [
    /\b(?:because|since|as|due\s+to|owing\s+to)\b/i,
    /\b(?:therefore|thus|hence|consequently|as\s+a\s+result|which\s+leads?\s+to|leading\s+to|this\s+leads?\s+to|results?\s+in|resulting\s+in|which\s+means(?:\s+that)?|this\s+means(?:\s+that)?|meaning\s+that|thereby|so\s+that|in\s+turn)\b/i,
    /\b(?:leads?\s+to|causes?|causing|reduces?|reducing|increases?|increasing|lowers?|lowering|raises?|raising|improves?|improving|boosts?|boosting|prevents?|preventing|avoids?|avoiding|protects?|protecting|preserves?|preserving|worsens?|damages?|damaging|harms?|delays?|delaying|erodes?|eroding|attracts?|retains?|hurts?|cuts?|stimulates?|saves?|saving)\b/i
  ];

  var MITIGATION_RE = /\b(?:provided that|depends on|depends upon|depending on|as long as|on condition that|only if|in the short term|in the short run|to overcome|to minimi[sz]e|to mitigate|can mitigate|helps? mitigate|mitigat(?:e|ing)|to offset|can offset|to counter|to reduce (?:the|this) (?:risk|drawback|cost|delay|bottleneck|impact|disruption)|to limit (?:the|this) (?:risk|drawback|cost|delay|bottleneck|impact|disruption)|to manage (?:the|this) (?:risk|drawback|cost|delay|bottleneck|workload)|by scheduling|by staggering|by allocating|by delegating|by outsourcing|by hiring|by phasing|by training|by retaining|negotiating|phased approach|off-peak|outside (?:core|peak) hours)\b/i;

  /* ================================================================ */
  /* Text structure helpers                                            */
  /* ================================================================ */

  function splitEssayParagraphs(answer) {
    var text = String(answer || "");
    var blocks = text.split(/\n\s*\n+/).map(function (p) { return p.trim(); }).filter(Boolean);
    var raw = blocks.length >= 2 ? blocks : text.split(/\n+/).map(function (p) { return p.trim(); }).filter(Boolean);
    var merged = [];
    for (var i = 0; i < raw.length; i++) {
      var block = raw[i];
      var words = wc(block);
      var isHeading = words <= 5 && i + 1 < raw.length &&
        (/^(?:recommendation|conclusion|summary|option\s*\d+|method\s*\d+|choice|final\s+decision)\b/i.test(block) || /:$/.test(block));
      if (isHeading) { merged.push(block + "\n" + raw[i + 1]); i++; }
      else merged.push(block);
    }
    return merged;
  }

  var CONCLUSION_HEAD = /^(?:recommendation|conclusion|in conclusion|to conclude|to sum up|in summary|overall|on balance|ultimately|summary|final decision|choice)\b/i;
  var POINT_PREFIX = /^(?:(?:\(\d{1,2}\)|\d{1,2}[.)])\s+|(?:point|reason|benefit|advantage|disadvantage|drawback|limitation|factor|method|way|option)\s*\d{0,2}\s*[:.-]?\s+)/i;

  function splitResponsePoints(answer) {
    var paras = splitEssayParagraphs(answer);
    var out = [];
    for (var p = 0; p < paras.length; p++) {
      var lines = paras[p].split(/\n+/);
      var current = "";
      for (var l = 0; l < lines.length; l++) {
        var line = lines[l].trim();
        if (!line) continue;
        var isPoint = POINT_PREFIX.test(line) || /^\(\d{1,2}\)\s/.test(line) || /^\d{1,2}[.)]\s/.test(line);
        if (isPoint) { if (current) out.push(current); current = line.replace(POINT_PREFIX, "").trim(); }
        else if (CONCLUSION_HEAD.test(line) || !current) { if (current) out.push(current); current = line; }
        else current += " " + line;
      }
      if (current) out.push(current);
    }
    return out.filter(function (s) { return s.length > 0; });
  }

  function splitSentences(text) {
    return String(text || "").split(/[.!?;]\s+|\n+/).map(function (s) { return s.trim(); }).filter(function (s) { return s.length >= 4; });
  }

  function jaccard(a, b) {
    function tokens(s) {
      var out = [];
      var parts = String(s).toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/);
      for (var i = 0; i < parts.length; i++) {
        if (parts[i].length >= 2 && !JACCARD_STOP[parts[i]]) out.push(parts[i]);
      }
      return lowerArr(out);
    }
    var A = tokens(a), B = tokens(b);
    var sizeA = Object.keys(A).length, sizeB = Object.keys(B).length;
    if (!sizeA || !sizeB) return 0;
    var inter = 0;
    for (var k in A) { if (hasOwn(A, k) && hasOwn(B, k)) inter++; }
    return inter / (sizeA + sizeB - inter);
  }

  function deduplicateRepeatedSentences(answer) {
    var sentences = splitSentences(answer);
    var unique = [], dupes = 0, maxSim = 0;
    for (var i = 0; i < sentences.length; i++) {
      var isDup = false;
      for (var j = 0; j < unique.length; j++) {
        var sim = jaccard(sentences[i], unique[j]);
        if (sim > maxSim) maxSim = sim;
        if (sim > 0.7) { isDup = true; break; }
      }
      if (isDup) dupes++; else unique.push(sentences[i]);
    }
    return { unique: unique, text: unique.join(". "), duplicateCount: dupes, maxSimilarity: maxSim };
  }

  function isSegmentDuplicateOfAny(seg, prior) {
    var cur = String(seg || "").trim();
    if (!cur || !prior.length) return false;
    var curSents = splitSentences(cur);
    for (var i = 0; i < prior.length; i++) {
      var prev = String(prior[i] || "").trim();
      if (!prev) continue;
      if (jaccard(cur, prev) > 0.7) return true;
      var prevSents = splitSentences(prev);
      if (curSents.length && prevSents.length) {
        var every = true;
        for (var c = 0; c < curSents.length; c++) {
          var found = false;
          for (var ps = 0; ps < prevSents.length; ps++) { if (jaccard(curSents[c], prevSents[ps]) > 0.7) { found = true; break; } }
          if (!found) { every = false; break; }
        }
        if (every) return true;
      }
    }
    return false;
  }

  function stripAoAnnotations(text) {
    return String(text || "").replace(/\[(?:k|app|an|eval|ao1|ao2|ao3|ao4|1|2|3|4|6|8)\]/gi, " ").replace(/\s+/g, " ").trim();
  }

  function checkIsModelAnswer(answer, modelAnswer) {
    if (!modelAnswer) return false;
    var cand = stripAoAnnotations(answer).toLowerCase();
    var model = stripAoAnnotations(modelAnswer).toLowerCase();
    if (cand.length < 15) return false;
    if (cand === model) return true;
    if (model.length >= 25 && includes(cand, model)) return true;
    if (cand.length >= Math.max(40, Math.floor(model.length * 0.85)) && includes(model, cand)) return true;
    var ca = cand.replace(/[^a-z0-9]/g, ""), ma = model.replace(/[^a-z0-9]/g, "");
    if (ca.length >= 25 && ca === ma) return true;
    var modelWords = model.split(/\s+/).map(function (w) { return w.replace(/[^a-z0-9]/g, ""); }).filter(function (w) { return w.length >= 3 && !GENERIC_FILLER[w]; });
    var candWords = cand.split(/\s+/).map(function (w) { return w.replace(/[^a-z0-9]/g, ""); }).filter(function (w) { return w.length >= 3 && !GENERIC_FILLER[w]; });
    if (modelWords.length >= 5 && candWords.length >= Math.floor(modelWords.length * 0.7)) {
      var candSet = lowerArr(candWords), matched = 0;
      for (var i = 0; i < modelWords.length; i++) { if (candSet[modelWords[i]]) matched++; }
      if (matched / modelWords.length >= 0.85) return true;
    }
    return false;
  }

  function countSyllabusTerms(lower) {
    var n = 0;
    for (var i = 0; i < SYLLABUS_TERMS.length; i++) { if (includes(lower, SYLLABUS_TERMS[i])) n++; }
    return n;
  }

  /* Port of evaluator.ts:2134-2182. Identifies calculation questions from the
   * prompt/mark scheme, extracts model-answer outputs that were NOT already
   * given in the question/case stem, and checks whether the candidate supplied
   * them and showed working. Used in the AO1/AO3 knowledge path below. */
  function checkCalculationAccuracy(studentAnswer, questionPrompt, caseContext, modelAnswer, markSchemeText) {
    var isCalc = /\bcalculate\b/i.test(String(questionPrompt || "")) || !!(markSchemeText && /working_marks/i.test(String(markSchemeText)));
    if (!isCalc) return { isCalculation: false, matchedOutputs: 0, expectedOutputs: 0, hasWorking: false };
    function nums(s) { return String(s || "").match(/-?\d[\d,]*(?:\.\d+)?/g) || []; }
    function clean(n) { return String(n).replace(/,/g, ""); }
    var given = lowerArr(nums(String(questionPrompt || "") + " " + String(caseContext || "")).map(clean));
    var modelNums = uniq(nums(String(modelAnswer || "") + " " + String(markSchemeText || "")).map(clean).filter(function (n) {
      return !given[n] && n !== "1" && n !== "2" && n !== "4" && n !== "8";
    }));
    var studentNums = lowerArr(nums(studentAnswer).map(clean));
    var studentFlat = String(studentAnswer || "").replace(/,/g, "");
    var matched = 0;
    for (var i = 0; i < modelNums.length; i++) {
      if (studentNums[modelNums[i]] || studentFlat.indexOf(modelNums[i]) !== -1) matched++;
    }
    var hasWorking = /[=\/×÷*]|\bdivide\b|\bdivided\b|\bminus\b|\bplus\b|\bformula\b/i.test(String(studentAnswer || ""));
    return { isCalculation: true, matchedOutputs: matched, expectedOutputs: modelNums.length, hasWorking: hasWorking };
  }

  function flattenScheme(ms) {
    var out = [];
    if (!ms || typeof ms !== "object") return out;
    Object.keys(ms).forEach(function (key) {
      var val = ms[key];
      if (Array.isArray(val)) {
        val.forEach(function (v) { if (typeof v === "string" && v.trim()) out.push(v.trim()); });
      } else if (typeof val === "string" && val.trim()) {
        val.split(/[;\n]+/).forEach(function (v) { if (v.trim()) out.push(v.trim()); });
      }
    });
    return uniq(out);
  }

  function checkKnowledgePoints(answerText, points, modelAnswer) {
    var norm = normalizeText(answerText);
    var words = norm.split(/\s+/).map(function (w) { return w.replace(/[^a-z0-9]/g, ""); }).filter(function (w) { return w.length >= 3; });
    var wordSet = lowerArr(words);
    function hasConcept(w) {
      var clean = String(w).replace(/[^a-z0-9]/g, "");
      if (!clean || clean.length < 3) return false;
      if (wordSet[clean.toLowerCase()]) return true;
      if (clean.length >= 5) {
        var stem = clean.charAt(clean.length - 1) === "s" ? clean.slice(0, -1) : clean;
        if (includes(norm, stem.toLowerCase())) return true;
      }
      return false;
    }
    var matched = [], valid = (points || []).filter(function (p) { return p && String(p).trim(); });
    for (var i = 0; i < valid.length; i++) {
      var branches = String(valid[i]).toLowerCase().split(/[\/;]+/).map(function (t) { return t.trim(); }).filter(function (t) { return t.length >= 3; });
      var ok = false;
      for (var b = 0; b < branches.length && !ok; b++) {
        var branchWords = branches[b].replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(function (w) { return w.length >= 3 && !GENERIC_FILLER[w]; });
        if (!branchWords.length) {
          var raw = branches[b].replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(function (w) { return w.length >= 3; });
          ok = raw.length > 0;
          for (var r = 0; r < raw.length && ok; r++) { if (!hasConcept(raw[r])) ok = false; }
        } else {
          var hits = 0;
          for (var w = 0; w < branchWords.length; w++) { if (hasConcept(branchWords[w])) hits++; }
          ok = hits >= (branchWords.length <= 2 ? branchWords.length : Math.ceil(branchWords.length * 0.6));
        }
      }
      if (ok) matched.push(valid[i]);
    }
    var domain = [], ratio = 0;
    if (modelAnswer) {
      var modelClean = stripAoAnnotations(modelAnswer).toLowerCase();
      domain = uniq(modelClean.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(function (w) { return w.length >= 4 && !GENERIC_FILLER[w]; }));
      if (domain.length) {
        var hits = 0;
        for (var d = 0; d < domain.length; d++) { if (hasConcept(domain[d])) hits++; }
        ratio = hits / domain.length;
      }
    }
    return { matchedCount: matched.length, matchedPoints: matched, domainOverlap: Math.round(ratio * domain.length), ratio: ratio };
  }

  function isVagueFiller(answer) {
    var lower = String(answer || "").toLowerCase().trim();
    if (!lower) return true;
    var words = lower.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
    if (!words.length) return true;
    var specific = words.filter(function (w) { return w.length >= 4 && !GENERIC_FILLER[w] && !VAGUE_EXTRA[w]; });
    if (specific.length >= 2) return false;
    if (words.length <= 4 && specific.length >= 1 && countSyllabusTerms(lower) >= 1) return false;
    return true;
  }

  function looksLikeKnowledgePoint(text) {
    var trimmed = String(text || "").trim();
    if (!trimmed || isVagueFiller(trimmed)) return false;
    var lower = trimmed.toLowerCase();
    for (var i = 0; i < SYLLABUS_TERMS.length; i++) { if (hasTerm(lower, SYLLABUS_TERMS[i])) return true; }
    var words = lower.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
    var content = words.filter(function (w) { return w.length >= 4 && !GENERIC_FILLER[w] && !LIGHT_ACTION[w]; });
    if (!content.length) return false;
    if (/\b(?:benefit|benefits|advantage|advantages|drawback|drawbacks|disadvantage|disadvantages|reason|reasons|purpose|aim|objective|importance|role|function|feature|characteristic|method|way|type|example|effect|impact|result|definition|meaning)\b/i.test(lower)) return true;
    if (/\b(?:is|are|means|refers\s+to|involves|consists\s+of|includes|allows|enables|provides|offers|creates|generates|leads\s+to|results\s+in|helps|prevents|reduces|increases|improves|keeps|owns|controls|shares|retains|earns|receives|pays|sells|produces|employs)\b/i.test(lower) && content.length >= 2) return true;
    return false;
  }

  /* ================================================================ */
  /* AO2 case-context detection                                        */
  /* ================================================================ */

  function isCompanyToken(tok) {
    var t = String(tok).trim();
    if (/^[A-Z][a-z]+[A-Z][A-Za-z0-9]*$/.test(t)) return true;
    if (/^[A-Z]{2,6}$/.test(t) && !/^(?:PLC|LTD|GDP|ROI|ROCE|ARR|NPV|USP|TQM|JIT|CEO|CFO|CSR|SWOT|PEST|USD|EUR|GBP|CIE|USA|UK|EU|IT|AI|HR|AO1|AO2|AO3|AO4)$/.test(t)) return true;
    return false;
  }

  function metricSignature(phrase) {
    var s = String(phrase).toLowerCase();
    var m = s.match(/(?:[$£€]\s*)?(\d[\d,]*(?:\.\d+)?)\s*(million|billion|bn|m|k)\b/);
    if (m) return "scaled:" + m[1].replace(/,/g, "") + m[2].charAt(0);
    m = s.match(/[$£€]\s*(\d[\d,]*(?:\.\d+)?)/);
    if (m) return "curr:" + m[1].replace(/,/g, "");
    m = s.match(/(\d+(?:\.\d+)?)%/);
    if (m) return "pct:" + m[1] + "%";
    return null;
  }

  function extractCaseFacts(caseContext) {
    if (!caseContext) return [];
    var text = String(caseContext);
    var facts = [];
    function add(v) { var s = String(v).replace(/\s+/g, " ").trim(); if (s.length >= 2) facts.push(s); }
    asArray(text.match(/[$£€]\s*\d[\d,]*(?:\.\d+)?(?:\s*(?:million|billion|bn|m|k))?(?![A-Za-z0-9_])/gi)).forEach(add);
    asArray(text.match(/\d[\d,]*(?:\.\d+)?\s*(?:million|billion)/gi)).forEach(add);
    asArray(text.match(/\b\d+(?:\.\d+)?%/g)).forEach(add);
    asArray(text.match(/\b\d+(?:\.\d+)?:\d+(?:\.\d+)?\b/g)).forEach(add);
    asArray(text.match(/\b\d{1,3}(?:,\d{3})+(?:\.\d+)?\b/g)).forEach(add);
    asArray(text.toLowerCase().match(/\b[a-z]{3,}-[a-z]{3,}\b/g)).forEach(function (h) { if (!GENERIC_FILLER[h]) add(h); });
    asArray(text.toLowerCase().match(/\b[a-z]{3,}\b/g)).forEach(function (w) { if (CONCRETE_CASE_NOUNS[w]) add(w); });
    return facts;
  }

  function getActiveAppWords(valid, caseContext, ao2Max) {
    if (ao2Max === 0) return [];
    var out = [];
    var sigs = {};
    var curated = (valid || []).map(function (w) { return String(w).trim(); }).filter(function (w) { return w && !isCompanyToken(w); });
    for (var i = 0; i < curated.length; i++) {
      var key = curated[i].toLowerCase();
      if (indexOf(out.map(function (x) { return x.toLowerCase(); }), key) === -1) {
        out.push(curated[i]);
        var sig = metricSignature(curated[i]); if (sig) sigs[sig] = true;
      }
    }
    var facts = extractCaseFacts(caseContext);
    for (var f = 0; f < facts.length; f++) {
      var fKey = facts[f].toLowerCase();
      var fSig = metricSignature(facts[f]);
      var seen = false;
      for (var o = 0; o < out.length; o++) { if (out[o].toLowerCase() === fKey) { seen = true; break; } }
      if (seen || (fSig && sigs[fSig])) continue;
      out.push(facts[f]); if (fSig) sigs[fSig] = true;
    }
    return out;
  }

  function keywordRegex(kw) {
    var t = String(kw).trim();
    if (!t) return null;
    var scaled = t.match(/^([$£€])?\s*(\d[\d,]*(?:\.\d+)?)\s*(million|billion|bn|m|k)$/i);
    if (scaled) {
      var num = escapeRegExp(scaled[2]).replace(/,/g, ",?");
      var unit = scaled[3].toLowerCase();
      var unitPat = (unit === "million" || unit === "m") ? "(?:million|m)" : (unit === "billion" || unit === "bn") ? "(?:billion|bn)" : escapeRegExp(unit);
      return new RegExp("(?:[$£€]\\s*)?" + num + "\\s*" + unitPat, "i");
    }
    if (/^[$£€]\s*\d[\d,]*(?:\.\d+)?$/.test(t)) {
      return new RegExp("(?:[$£€]\\s*)?" + escapeRegExp(t.replace(/[$£€]\s*/, "")).replace(/,/g, ",?"), "i");
    }
    if (/^\d+(?:\.\d+)?%$/.test(t)) return new RegExp(escapeRegExp(t.replace("%", "")) + "\\s*%", "i");
    if (/^\d[\d,]*(?:\.\d+)?$/.test(t)) return new RegExp(escapeRegExp(t).replace(/,/g, ",?"), "i");
    var parts = t.split(/\s+/);
    var pats = [];
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (/\d/.test(p)) { pats.push(escapeRegExp(p).replace(/,/g, ",?")); continue; }
      p = p.replace(/[^A-Za-z-]/g, "");
      if (!p) continue;
      if (p.length >= 4) {
        var pl = p.toLowerCase();
        if (/ies$/.test(pl)) pats.push(escapeRegExp(p.slice(0, -3)) + "(?:y|ies)");
        else if (/y$/.test(pl) && !/[aeiou]y$/.test(pl)) pats.push(escapeRegExp(p.slice(0, -1)) + "(?:y|ies)");
        else if (/s$/.test(pl) && !/ss$/.test(pl)) pats.push(escapeRegExp(p.slice(0, -1)) + "s?");
        else pats.push(escapeRegExp(p) + "(?:s|es)?");
      } else pats.push(escapeRegExp(p));
    }
    return pats.length ? new RegExp("\\b" + pats.join("\\s+") + "\\b", "i") : null;
  }

  function detectCaseContext(text, active) {
    var words = active || [];
    if (!words.length) return { passed: true, found: [] };
    var found = [];
    for (var i = 0; i < words.length; i++) {
      var re = keywordRegex(words[i]);
      if (re && re.test(text)) { found.push(words[i]); continue; }
      var nums = String(words[i]).match(/[$£€]\s*\d[\d,]*(?:\.\d+)?(?:k|m|million)?|\d+(?:\.\d+)?%|\b\d[\d,]*(?:\.\d+)?\s*(?:million|billion)\b/gi) || [];
      var hit = false;
      for (var n = 0; n < nums.length; n++) {
        var nre = keywordRegex(nums[n]);
        if (nre && nre.test(text)) { hit = true; break; }
      }
      if (hit) found.push(words[i]);
    }
    return { passed: found.length > 0, found: uniq(found) };
  }

  /* ================================================================ */
  /* AO3 analysis helpers                                              */
  /* ================================================================ */

  function hasStrictCausalLink(text) {
    for (var i = 0; i < STRICT_CAUSAL_RE.length; i++) { if (STRICT_CAUSAL_RE[i].test(text)) return true; }
    return false;
  }

  function consequenceHits(lower) {
    var hits = [];
    for (var i = 0; i < CONSEQUENCE_TERMS.length; i++) { if (hasTerm(lower, CONSEQUENCE_TERMS[i])) hits.push(CONSEQUENCE_TERMS[i]); }
    return hits;
  }

  function hasClearBusinessConsequenceChain(text) {
    var trimmed = String(text || "").trim();
    if (!trimmed) return { passed: false, reason: "no-causal-link" };
    var lower = trimmed.toLowerCase();
    var sentences = splitSentences(trimmed);
    var nonCausal = sentences.filter(function (s) { return !hasStrictCausalLink(s.toLowerCase()); });
    var allHits = consequenceHits(lower);
    for (var i = 0; i < sentences.length; i++) {
      var sLower = sentences[i].toLowerCase();
      if (!hasStrictCausalLink(sLower)) continue;
      var hits = consequenceHits(sLower);
      if (!hits.length) continue;
      var novel = hits.filter(function (h) {
        for (var n = 0; n < nonCausal.length; n++) { if (hasTerm(nonCausal[n].toLowerCase(), h)) return false; }
        return true;
      });
      if (!novel.length) continue;
      var mechanisms = 0;
      for (var m = 0; m < SYLLABUS_TERMS.length; m++) {
        var term = SYLLABUS_TERMS[m];
        if (indexOf(hits.map(function (h) { return h.toLowerCase(); }), term) !== -1) continue;
        if (hasTerm(sLower, term)) mechanisms++;
      }
      if (mechanisms >= 1 || hits.length >= 2) return { passed: true, reason: "ok", consequence: novel[0] };
    }
    var scan = scanCausalChains(trimmed);
    if (scan.validatedChains >= 1 && allHits.length > 0) return { passed: true, reason: "ok", consequence: allHits[0] };
    if (!hasStrictCausalLink(lower)) return { passed: false, reason: "no-causal-link" };
    if (!allHits.length) return { passed: false, reason: "no-business-consequence" };
    return { passed: false, reason: "restatement-only" };
  }

  function scanCausalAnalysis(text) {
    var lower = String(text || "").toLowerCase();
    var chains = [];
    for (var i = 0; i < STRONG_CAUSAL_CHAINS.length; i++) { if (includes(lower, STRONG_CAUSAL_CHAINS[i])) chains.push(STRONG_CAUSAL_CHAINS[i]); }
    /* AO3 connectives from the original highlight bank (AOHighlightViewer.tsx:19-64). */
    for (var ac = 0; ac < ANALYSIS_CONNECTIVES.length; ac++) {
      if (includes(lower, ANALYSIS_CONNECTIVES[ac]) && indexOf(chains, ANALYSIS_CONNECTIVES[ac]) === -1) chains.push(ANALYSIS_CONNECTIVES[ac]);
    }
    var basic = 0;
    for (var b = 0; b < BASIC_REASONS.length; b++) {
      var re = new RegExp("\\b" + BASIC_REASONS[b].replace(/\s+/g, "\\s+") + "\\b", "i");
      if (re.test(lower)) basic++;
    }
    return { strongChains: chains.length, basicReasons: basic, matched: chains };
  }

  function scanCausalChains(answer) {
    var paras = splitEssayParagraphs(answer);
    var validated = 0, single = 0, matched = [];
    var contrastStart = /^(?:however|on the other hand|conversely|nevertheless|in contrast|alternatively|still|yet)\b/i;
    for (var p = 0; p < paras.length; p++) {
      var sentences = splitSentences(paras[p]);
      var consumed = {};
      for (var i = 0; i < sentences.length - 1; i++) {
        if (consumed[i] || consumed[i + 1] || contrastStart.test(sentences[i + 1])) continue;
        var s1 = sentences[i].toLowerCase(), s2 = sentences[i + 1].toLowerCase();
        var c1 = hasStrictCausalLink(s1) || scanCausalAnalysis(s1).strongChains > 0;
        var c2 = hasStrictCausalLink(s2) || scanCausalAnalysis(s2).strongChains > 0;
        var o1 = consequenceHits(s1), o2 = consequenceHits(s2);
        if (c1 && c2 && (o1.length || o2.length)) {
          validated++; consumed[i] = consumed[i + 1] = true;
          matched.push(scanCausalAnalysis(s1).matched[0] || scanCausalAnalysis(s2).matched[0] || "causal link");
        }
      }
      for (var j = 0; j < sentences.length; j++) {
        if (consumed[j]) continue;
        var s = sentences[j].toLowerCase();
        var chain = scanCausalAnalysis(s);
        var hits = consequenceHits(s);
        if (wc(sentences[j]) >= 10 && chain.strongChains >= 2 && hits.length >= 1) {
          validated++; if (chain.matched[0]) matched.push(chain.matched[0]);
        } else if (wc(sentences[j]) >= 5 && (chain.strongChains >= 1 || chain.basicReasons >= 1) && hits.length >= 1) {
          single++; if (chain.matched[0]) matched.push(chain.matched[0]);
        }
      }
    }
    return { validatedChains: validated, singleStepReasons: single, matched: uniq(matched) };
  }

  function hasAo3Guardrail(answer) {
    var lower = String(answer || "").toLowerCase();
    var connective = /\b(?:because|since|therefore|which leads to|this leads to|leading to|resulting in|results in|so that|as a result|consequently|this means|which means|meaning that|could reduce|could cause|making it|increases?|reduces?|lowers?|raises?|improves?|prevents?|avoids?|ensures?|enables?|allows?|helps?|thereby)\b/i.test(lower);
    var mechanism = false;
    for (var i = 0; i < SYLLABUS_TERMS.length; i++) { if (hasTerm(lower, SYLLABUS_TERMS[i])) { mechanism = true; break; } }
    if (!mechanism) { var hits = consequenceHits(lower); mechanism = hits.length > 0; }
    return { passed: connective && mechanism };
  }

  /* ================================================================ */
  /* AO4 evaluation helpers                                            */
  /* ================================================================ */

  function scanEvaluationKeywords(answer) {
    var lower = String(answer || "").toLowerCase();
    var found = [], judgment = 0, qualifier = 0;
    for (var i = 0; i < EVAL_JUDGMENT.length; i++) { if (includes(lower, EVAL_JUDGMENT[i])) { found.push(EVAL_JUDGMENT[i]); judgment++; } }
    for (var q = 0; q < EVAL_QUALIFIER.length; q++) { if (includes(lower, EVAL_QUALIFIER[q])) { found.push(EVAL_QUALIFIER[q]); qualifier++; } }
    /* AO4 connectives from the original highlight bank (AOHighlightViewer.tsx:67-108). */
    for (var ec = 0; ec < EVALUATION_CONNECTIVES.length; ec++) {
      if (includes(lower, EVALUATION_CONNECTIVES[ec])) {
        if (indexOf(found, EVALUATION_CONNECTIVES[ec]) === -1) found.push(EVALUATION_CONNECTIVES[ec]);
        if (/^(?:weighing|short run|long run|in the short|in the long|despite this|on the other hand|in contrast|although|however|depends)/.test(EVALUATION_CONNECTIVES[ec])) qualifier++;
        else judgment++;
      }
    }
    return { passed: judgment > 0 || qualifier > 0, found: uniq(found), judgmentCount: judgment, qualifierCount: qualifier };
  }

  function extractFinalParagraph(answer) {
    var paras = splitEssayParagraphs(answer);
    if (paras.length >= 2) return paras[paras.length - 1];
    var single = paras[0] || "";
    if (!single) return "";
    var sentences = single.split(/[.!?]\s+/).map(function (s) { return s.trim(); }).filter(Boolean);
    if (sentences.length <= 1) return single;
    var start = Math.max(1, Math.floor(sentences.length * 0.45));
    for (var i = sentences.length - 1; i >= start; i--) {
      if (/^(?:recommendation|conclusion|in conclusion|to conclude|overall|on balance|to sum up|in summary|ultimately|i recommend)\b/i.test(sentences[i])) {
        return sentences.slice(i).join(" ");
      }
    }
    return sentences.slice(sentences.length >= 4 ? -2 : -1).join(" ");
  }

  function evaluateDeterministicAo4(opts) {
    var marks = opts.marks;
    var max = marks === 12 ? 3 : 2;
    var finalP = opts.finalParagraphOverride !== undefined ? String(opts.finalParagraphOverride).trim() : extractFinalParagraph(opts.answer);
    var finalWords = wc(finalP);
    var lower = finalP.toLowerCase();

    var clearDecision = /\b(?:overall|i recommend|recommend(?:ation)?|advantages outweigh|benefits outweigh|outweighs?|should choose|should use|should select|should adopt|should invest|should focus|must choose|i choose|we choose|in conclusion|to conclude|on balance|is best|are best|best option|better option|preferable|most suitable|more suitable)\b/i.test(finalP);
    var contrastFinal = /\b(?:however|on the other hand|whereas|although|meanwhile|despite|nevertheless|nonetheless|even though|in contrast|conversely|alternatively|while)\b/i.test(finalP);
    var contrastEssay = /\b(?:however|on the other hand|whereas|although|meanwhile|despite|nevertheless|even though|in contrast|conversely|alternatively|while)\b/i.test(opts.answer);
    var drawback = /\b(?:cost\w*|expensive|fee\w*|risk\w*|drawback\w*|disadvantage\w*|limitation\w*|short[\s-]+term|interest|debt|overdraft|training|burden|loss|strain|capital|delay\w*|time[\s-]+consuming|lacks?|dilut\w*|loss of control)\b/i.test(finalP);
    var benefit = /\b(?:profit\w*|revenue\w*|sales|demand|cash\s*flow|cashflow|liquidity|quality|defect\w*|rework|brand|reputation|loyalty|customer\w*|retention|growth|survival|efficiency|productivity|long[\s-]+term|unit\s*cost\w*|output|orders)\b/i.test(finalP);
    var weighing = /\b(?:outweigh\w*|offset\w*|greater than|more important than|even though|despite|although|however|on the other hand|whereas)\b/i.test(finalP) ||
      (/\bshort[\s-]+term\b/i.test(finalP) && /\blong[\s-]+term\b/i.test(finalP)) ||
      /\bwhile\b[^.!?;]{4,110}\b(?:cost\w*|expensive|fee\w*|time|delay\w*|risk\w*|drawback\w*|disadvantage\w*|limit\w*|interest|overdraft|training|capital|burden|loss|strain)\b/i.test(finalP);
    var weighsBoth = (contrastFinal || weighing) && drawback && benefit;

    var causalMarker = /\b(?:because|since|given\s+(?:that|the|its|their)|as\s+(?:the|it|this|they|there|demand|sales|costs?))\b/i.test(finalP);
    var caseCheck = detectCaseContext(finalP, { valid: opts.effectiveAppWords || [], ao2Max: max });
    var number = /(?:\$\s*\d[\d,.]*(?:k|m|million)?|\b\d+(?:\.\d+)?%|\b\d+(?:\.\d+)?:1\b|\b\d[\d,]*\s*(?:units?|million)\b)/i.test(finalP);
    var hasCase = caseCheck.found.length > 0 || number || (opts.effectiveAppWords || []).length === 0;
    var becauseCase = causalMarker && hasCase;

    var altCompare = /\b(?:whereas|unlike|compared to|compared with|in contrast|rather than|instead of|other options?|other methods?|other strategies?|alternatives?|rejected|less effective|worse|riskier|better than|more effective than)\b/i.test(lower);
    var altReason = /\b(?:fail\w*|cannot|would not|does not|lacks?|inaccurate|delay\w*|risk\w*|debt|interest|loss|damage\w*|erod\w*|short[\s-]+term|too expensive|more expensive|higher cost|insufficient|unreliable|worse|less effective)\b/i.test(lower);
    var explainsAlt = altCompare && (altReason || hasCase);

    if (opts.ao3Score === 0 || (marks === 12 && opts.ao2Score === 0)) {
      return { score: 0, max: max, feedback: "AO4 score: 0/" + max + " (Level 1 Gate: AO3 analysis and case application required before earning evaluation marks)." };
    }

    var mitigation = MITIGATION_RE.test(finalP);

    if (marks === 8) {
      if (clearDecision && hasCase && ((explainsAlt && becauseCase) || (weighsBoth && becauseCase && mitigation))) {
        return { score: 2, max: 2, feedback: "Full evaluation marks (2/2): clear choice with justified comparison in case context inside the Conclusion." };
      }
      if (clearDecision && (contrastEssay || weighsBoth) && becauseCase) {
        return { score: 1, max: 2, feedback: "Partial evaluation (1/2): clear decision and reasoning in context. For 2/2, compare WHY your choice is better than the rejected option using case context in the Conclusion." };
      }
      if (clearDecision && (contrastFinal || becauseCase || finalWords >= 6)) {
        return { score: 1, max: 2, feedback: "Partial evaluation (1/2): decision stated in Conclusion, but lacks justified case-context comparison against the rejected option." };
      }
      return { score: 0, max: 2, feedback: "AO4 score: 0/2: missing evaluative decision and contextual comparison inside the Conclusion paragraph." };
    }

    var raw = 0, fb = "AO4 score: 0/3: missing evaluative judgment or two-sided contrast in the final paragraph.";
    if (clearDecision && hasCase && finalWords >= 16 && weighsBoth && (explainsAlt || becauseCase) && mitigation) {
      raw = 3;
      fb = "Full evaluation (3/3): final paragraph chooses an option, weighs trade-offs and rejected alternatives with case figures, and addresses how to mitigate the main drawback.";
    } else if (clearDecision && finalWords >= 12 && (weighsBoth || explainsAlt || (contrastFinal && hasCase) || becauseCase)) {
      raw = 2;
      fb = "Developed evaluation (2/3): clear recommendation weighing/rejecting alternatives in context. To unlock 3/3, explain how to mitigate the chosen option's main drawback or state a contextual condition.";
    } else if (clearDecision || contrastEssay) {
      raw = 1;
      fb = "Basic evaluation (1/3): generic choice or two-sided contrast noted; add a clear recommendation weighing alternatives with case figures for 2-3/3.";
    }
    var score = opts.ao3Score === 1 ? Math.min(raw, 1) : raw;
    if (opts.ao3Score === 1 && raw > 1) {
      fb = "AO4 capped at 1/3 (Level 2 Gate): develop multi-step AO3 analysis across options (AO3 >= 2) to unlock 2-3/3.";
    }
    return { score: score, max: 3, feedback: fb };
  }

  /* ================================================================ */
  /* Question type / AO caps                                           */
  /* ================================================================ */

  function resolveQuestionType(marks, paper) {
    if (paper === 2) return marks >= 12 ? "paper2_12m_b" : "paper2_8m_a";
    if (marks <= 2) return "paper1_2m";
    if (marks <= 4) return "paper1_4m";
    if (marks <= 6) return "paper1_6m";
    if (marks === 8) return "paper1_8m";
    return "paper2_12m_b";
  }

  function aoCaps(marks, qtype) {
    if (marks <= 2) return [2, 0, 0, 0];
    if (qtype === "paper2_12m_b") return [2, 3, 4, 3];
    if (qtype === "paper2_8m_a") return [2, 2, 4, 0];
    if (marks <= 4) return [2, 2, 0, 0];
    if (marks <= 6) return [2, 2, 2, 0];
    return [2, 2, 2, 2]; /* paper1_8m */
  }

  function isPaper2(qtype, paper, marks) { return paper === 2 || /^paper2/.test(qtype) || marks === 12; }

  function knowledgeSignature(text) {
    var lower = String(text || "").toLowerCase();
    var sig = {};
    for (var i = 0; i < SYLLABUS_TERMS.length; i++) { if (hasTerm(lower, SYLLABUS_TERMS[i])) sig[SYLLABUS_TERMS[i]] = true; }
    if (Object.keys(sig).length >= 2) return sig;
    var words = lower.replace(/[^a-z\s]/g, " ").split(/\s+/).filter(function (w) { return w.length >= 4 && !GENERIC_FILLER[w] && !LIGHT_ACTION[w]; });
    for (var w = 0; w < Math.min(words.length, 12); w++) sig[words[w]] = true;
    return sig;
  }

  /* Concept-set escape hatch (evaluator.ts:2452-2569): a paragraph that
   * introduces a syllabus concept from a preset concept set which has not yet
   * been credited counts as a distinct point, even when its loose signature
   * overlaps an earlier paragraph (near-synonyms across different sets). */
  function extractConceptSet(text) {
    var lower = String(text || "").toLowerCase();
    var out = [];
    for (var i = 0; i < KNOWLEDGE_TERMS.length; i++) {
      if (hasTerm(lower, KNOWLEDGE_TERMS[i]) && indexOf(out, KNOWLEDGE_TERMS[i]) === -1) out.push(KNOWLEDGE_TERMS[i]);
    }
    return out;
  }
  function isKnowledgePointRepeated(sig, conceptSet, ledger) {
    if (!signatureRepeated(sig, ledger.signatures)) return false;
    if (!conceptSet.length) return true;
    if (!ledger.conceptSets.length) return false; /* nothing credited yet */
    for (var p = 0; p < ledger.conceptSets.length; p++) {
      var allSeen = true;
      for (var c = 0; c < conceptSet.length; c++) {
        if (!ledger.conceptSets[p][conceptSet[c]]) { allSeen = false; break; }
      }
      if (!allSeen) return false; /* at least one genuinely new concept */
    }
    return true;
  }

  function signatureRepeated(sig, prior) {
    var keys = Object.keys(sig);
    if (!keys.length) return false;
    for (var p = 0; p < prior.length; p++) {
      var shared = 0;
      for (var k = 0; k < keys.length; k++) { if (hasOwn(prior[p], keys[k])) shared++; }
      if (!shared) continue;
      if (shared >= 2) {
        var unionObj = {};
        for (var a in sig) { if (hasOwn(sig, a)) unionObj[a] = true; }
        for (var b in prior[p]) { if (hasOwn(prior[p], b)) unionObj[b] = true; }
        if (shared / Object.keys(unionObj).length >= 0.5) return true;
      }
      if (keys.length === 1 && Object.keys(prior[p]).length <= 2 && shared === 1) return true;
    }
    return false;
  }

  /* ================================================================ */
  /* The synchronous marking engine                                   */
  /* ================================================================ */

  function autoMark(answer, questionInfo, aiParagraphs) {
    var info = questionInfo || {};

    /* Compatibility with the paper1.js hook: autoMark({ answer, markValue, ... }). */
    if (arguments.length === 1 && answer && typeof answer === "object" && answer.answer !== undefined) {
      var bundle = answer;
      answer = bundle.answer;
      info = {
        mark_value: bundle.markValue,
        question_text: bundle.questionText || bundle.question_text,
        questionType: bundle.questionType,
        paper: bundle.paper,
        model_answer: bundle.modelAnswer || bundle.model_answer,
        mark_scheme: bundle.markScheme || bundle.mark_scheme,
        caseMainStem: bundle.caseStem || bundle.caseMainStem || bundle.scenario_stem,
        validAppWords: bundle.validAppWords,
        questionId: bundle.questionId
      };
      answer = bundle.answer;
    }

    var text = String(answer == null ? "" : answer).trim();
    var marks = clampI(info.mark_value != null ? info.mark_value : info.markValue, 0, 20);
    if (!marks) marks = 8;
    var qtype = info.questionType || resolveQuestionType(marks, info.paper === 2 ? 2 : 1);
    var p2 = isPaper2(qtype, info.paper, marks);
    var caps = aoCaps(marks, qtype);
    var valid = info.qwen_marking_keys && info.qwen_marking_keys.valid_app_words ? info.qwen_marking_keys.valid_app_words : (info.validAppWords || []);
    var caseStem = info.caseMainStem || info.case_stem || info.caseStem || info.scenario_stem || "";
    var modelAnswer = info.model_answer || info.modelAnswer || "";
    var markScheme = info.mark_scheme || info.markScheme || {};
    var qtext = info.question_text || info.questionText || "";
    var words = wc(text);
    var ruleNotes = [];

    function result(total, aos, strengths, improvements, notes, snippet, level, extra) {
      var pct = marks > 0 ? Math.round((total / marks) * 100) : 0;
      var obj = {
        totalScore: total,
        maxMarks: marks,
        percentage: pct,
        level: level || "Level 0 (0 marks)",
        aoBreakdown: {
          ao1: { score: aos[0], max: caps[0], feedback: extra && extra.ao1fb || "" },
          ao2: { score: aos[1], max: caps[1], feedback: extra && extra.ao2fb || "" },
          ao3: { score: aos[2], max: caps[2], feedback: extra && extra.ao3fb || "" },
          ao4: { score: aos[3], max: caps[3], feedback: extra && extra.ao4fb || "" }
        },
        strengths: strengths || [],
        improvements: improvements || [],
        examinerNotes: notes || "",
        feedback: notes || "",
        modelAnswerSnippet: snippet || "",
        ruleEnforcement: extra && extra.rules || { appWordsRequired: [], appWordsFound: [], appWordsPassed: true, ao2CappedToZero: false, evalWordRequired: false, evalWordsFound: [], evalWordPassed: true, ao4CappedToZero: false, ruleNotes: [] },
        questionType: qtype,
        isAiEvaluated: !!(extra && extra.isAiEvaluated),
        evaluatedAt: new Date().toISOString(),
        paragraphAudits: extra && extra.audits || []
      };
      if (extra && extra.levelDescription) obj.levelDescription = extra.levelDescription;
      if (extra && extra.requirementToLevel3) obj.requirementToLevel3 = extra.requirementToLevel3;
      return obj;
    }

    var snippet = modelAnswer || (flattenScheme(markScheme)[0] || "");

    /* Under-length / blank: immediate Level 0 / 0 marks. */
    var minWords = p2 ? 10 : 5;
    if (words < minWords || /^no candidate answer provided\.$/i.test(text)) {
      var zeroRules = {
        appWordsRequired: valid || [], appWordsFound: [], appWordsPassed: false,
        ao2CappedToZero: caps[1] > 0, evalWordRequired: caps[3] > 0, evalWordsFound: [],
        evalWordPassed: false, ao4CappedToZero: caps[3] > 0,
        ruleNotes: ["Response below minimum examinable length (under " + minWords + " words)."]
      };
      return result(0, [0, 0, 0, 0],
        [],
        ["Write a developed answer using relevant Cambridge 0264 business terminology and case facts."],
        "[ Cambridge 0264 Examiner ] Awarded 0/" + marks + ". Response below minimum examinable length (" + minWords + " words minimum).",
        snippet, "Level 0 (0 marks)",
        { rules: zeroRules, ao1fb: "Too brief to demonstrate syllabus knowledge.", ao2fb: "No application to the specific business context.", ao3fb: "No analytical chain developed.", ao4fb: "No evaluation or justified recommendation.", levelDescription: "Response is below minimum examinable standard." });
    }

    var segments = splitResponsePoints(text);
    var effective = getActiveAppWords(valid, caseStem, caps[1]);
    var appDet = detectCaseContext(text, effective);
    var evalScan = caps[3] > 0 ? scanEvaluationKeywords(text) : { passed: true, found: [], judgmentCount: 0, qualifierCount: 0 };
    var causal = scanCausalAnalysis(text);
    var p2Causal = scanCausalChains(text);
    var dedup = deduplicateRepeatedSentences(text);
    var textForK = dedup.unique.length ? dedup.text : text;
    var kp = flattenScheme(markScheme);
    var knowledge = checkKnowledgePoints(textForK, kp, modelAnswer);
    var guardrail = hasAo3Guardrail(text);
    var singleRepeat = dedup.duplicateCount > 0 && dedup.unique.length <= 1 && (marks >= 4 || /\btwo\b/i.test(qtext));
    var vague = isVagueFiller(text);

    if (singleRepeat) ruleNotes.push("[Anti-Double-Counting Rule] Repeated point detected (similarity > 70%): capped at 1 AO1 mark for that idea.");
    var requiresApp = effective.length > 0 && caps[1] > 0;
    var ao2Capped = requiresApp && !appDet.passed;
    if (requiresApp) {
      if (ao2Capped) ruleNotes.push("[Application Rule] Capped to 0: none of the required case facts (" + effective.slice(0, 5).join(", ") + ") were detected. Company names alone earn no AO2.");
      else ruleNotes.push("[Application Rule] Matched " + appDet.found.length + " case fact(s) [" + appDet.found.slice(0, 4).join(", ") + "].");
    }

    /* Exemplar / >=85% full model-answer match -> full marks (multi-part answers need structure). */
    var isModelMatch = checkIsModelAnswer(text, modelAnswer) && !(marks >= 4 && segments.length < 2);
    if (isModelMatch && marks > 0) {
      var fullRules = {
        appWordsRequired: effective, appWordsFound: effective, appWordsPassed: true,
        ao2CappedToZero: false, evalWordRequired: caps[3] > 0, evalWordsFound: ["overall", "on balance"],
        evalWordPassed: true, ao4CappedToZero: false,
        ruleNotes: ["Full exemplar alignment verified against the official mark scheme model answer.", "Full marks awarded across all assessment objectives."]
      };
      var fullLevel = marks === 12 ? "Level 3 (9–12 marks)" : (marks === 8 ? "Level 3 (7–8 marks)" : "Full marks");
      return result(marks, caps.slice(0, 4),
        ["Matches the official Cambridge exemplar model answer.", "Demonstrates complete syllabus coverage across all assessment objectives."],
        ["Exemplar quality: maintain this precision and time management under timed conditions."],
        "[ Cambridge 0264 Examiner ] Awarded " + marks + "/" + marks + " (100%). Exemplar Cambridge model answer standard.",
        snippet, fullLevel,
        { rules: fullRules, ao1fb: "Full textbook precision matching the mark scheme model answer.", ao2fb: "Directly contextualised to the case scenario facts.", ao3fb: "Exemplary multi-step causal analysis.", ao4fb: "Comprehensive balanced evaluative judgment.", levelDescription: "Exemplar Cambridge 0264 standard." });
    }

    /* Per-segment isolated scoring with anti-repetition ledger. The ledger now
     * records signatures AND preset concept sets so near-synonyms from different
     * concept sets can still earn a fresh AO1 mark. */
    var ledger = { signatures: [], conceptSets: [], matchedPoints: [] };
    var appLedger = [];
    var aiList = Array.isArray(aiParagraphs) ? aiParagraphs : null;
    var audits = [];
    var ao1 = 0, ao2 = 0, ao3 = 0, ao4 = 0, ao4Result = null;
    var detailedCount = 0, completeCount = 0, validKCount = 0, appCount = 0, anCount = 0;
    var calcSeen = false, calcMatchedTotal = 0, calcExpectedTotal = 0, calcWorkingTotal = 0;

    function evaluateSegment(seg, prior, opts) {
      var trimmed = String(seg || "").trim();
      var empty = { k: 0, app: 0, an: 0, duplicate: false, found: [], noBusiness: false, reason: "" };
      if (!trimmed) return empty;
      if (isSegmentDuplicateOfAny(trimmed, prior)) {
        empty.duplicate = true; empty.reason = "duplicate"; return empty;
      }
      var segWords = wc(trimmed);
      var segVague = isVagueFiller(trimmed);
      var minK = opts.minK || 4, minApp = opts.minApp || 6, minAn = opts.minAn || 10;
      var ai = aiList && aiList[opts.index] ? aiList[opts.index] : null;
      var k = 0, app = 0, an = 0;
      var found = [];

      if (!segVague && segWords >= Math.min(minK, 4)) {
        var pk = checkKnowledgePoints(trimmed, kp, modelAnswer);
        var calc = checkCalculationAccuracy(trimmed, qtext, caseStem, modelAnswer, JSON.stringify(markScheme));
        if (calc.isCalculation) {
          if (!calcSeen) calcSeen = true;
          calcMatchedTotal += calc.matchedOutputs;
          calcExpectedTotal += calc.expectedOutputs;
          if (calc.hasWorking) calcWorkingTotal++;
        }
        var calcK = calc.isCalculation && (calc.matchedOutputs >= 1 || calc.hasWorking);
        var detK = pk.matchedCount >= 1 || pk.domainOverlap >= 1 || countSyllabusTerms(trimmed.toLowerCase()) >= 1 || looksLikeKnowledgePoint(trimmed) || calcK;
        if (detK || (ai && Number(ai.k_score) >= 1)) k = 1;
        var sig = knowledgeSignature(trimmed);
        var conceptSet = extractConceptSet(trimmed);
        if (k && isKnowledgePointRepeated(sig, conceptSet, ledger)) { empty.duplicate = true; empty.reason = "repetition"; return empty; }
        if (k) {
          ledger.signatures.push(sig);
          if (conceptSet.length) ledger.conceptSets.push(lowerArr(conceptSet));
          if (pk.matchedCount) for (var mp = 0; mp < pk.matchedPoints.length; mp++) ledger.matchedPoints.push(String(pk.matchedPoints[mp]).toLowerCase());
        }
      }

      if (k && caps[1] > 0) {
        var pApp = detectCaseContext(trimmed, effective);
        found = pApp.found;
        var fresh = found.filter(function (w) { return indexOf(appLedger, w.toLowerCase()) === -1; });
        if (requiresApp) {
          if (found.length && !fresh.length) { /* reuse -> no credit */ }
          else if (found.length && segWords >= minApp) {
            app = 1;
            for (var f = 0; f < found.length; f++) { if (indexOf(appLedger, found[f].toLowerCase()) === -1) appLedger.push(found[f].toLowerCase()); }
          }
        } else if (segWords >= minApp + 2) app = 1;
        if (ai && Number(ai.app_score) >= 1 && !app) {
          if (segWords >= minApp && (!requiresApp || found.length)) app = 1;
        }
      }

      if (k && caps[2] > 0) {
        var chain = hasClearBusinessConsequenceChain(trimmed);
        var step = p2Causal.validatedChains >= 1 || p2Causal.singleStepReasons >= 1 || causal.strongChains >= 1 || causal.basicReasons >= 1;
        var localChain = scanCausalAnalysis(trimmed);
        var localP2 = scanCausalChains(trimmed);
        var localStep = localP2.validatedChains >= 1 || localP2.singleStepReasons >= 1 || localChain.strongChains >= 1 || localChain.basicReasons >= 1;
        if (chain.passed && (step || localStep) && segWords >= minAn) an = 1;
        /* Calculation questions: shown working plus a correct model output is a
         * valid AO3 chain to the commercial result (evaluator.ts calcCheck path). */
        if (!an && calc && calc.isCalculation && calc.hasWorking && (calc.matchedOutputs >= 1 || segWords >= minAn) && segWords >= minAn) an = 1;
        if (ai && Number(ai.an_score) >= 1 && segWords >= minAn) an = 1;
        if (!an) empty.noBusiness = true;
        empty.reason = chain.reason;
      }
      return { k: k, app: app, an: an, duplicate: false, found: found, noBusiness: !an && caps[2] > 0, reason: empty.reason };
    }

    var minApp = marks === 8 || p2 ? 8 : 6;
    var minAn = marks === 8 || p2 ? 12 : 10;
    var prior = [];
    for (var s = 0; s < segments.length; s++) {
      var r = evaluateSegment(segments[s], prior.slice(), {
        index: s, minK: 3, minApp: minApp, minAn: minAn
      });
      if (!r.duplicate && segments[s].trim()) prior.push(segments[s]);
      var detailed = r.an && (p2Causal.validatedChains >= 1 || wc(segments[s]) >= 12) && consequenceHits(segments[s].toLowerCase()).length > 0;
      audits.push({
        paragraph_number: s + 1,
        role: s === segments.length - 1 && CONCLUSION_HEAD.test(segments[s].trim()) ? "conclusion" : "body_point",
        isolated_quote: segments[s], k_score: r.k, app_score: r.app, an_score: r.an, eval_score: 0,
        subtotal: r.k + r.app + r.an,
        is_duplicate: r.duplicate, app_words_found: r.found,
        critique: r.duplicate ? "Repeated point / near-duplicate: 0 marks under the anti-repetition rule." :
          (r.k ? "Credited " + [r.k ? "K" : "", r.app ? "App" : "", r.an ? "An" : ""].filter(Boolean).join(" + ") : "No valid Cambridge 0264 knowledge point in this paragraph.")
      });
      if (!r.duplicate) {
        if (r.k) validKCount++;
        if (r.app) appCount++;
        if (r.an) anCount++;
        if (r.k && r.app && r.an) completeCount++;
        if (r.k && r.app && r.an && detailed) detailedCount++;
        ao1 += r.k; ao2 += r.app; ao3 += r.an;
      }
    }

    if (calcSeen) ruleNotes.push("[Calculation Rule] Target outputs matched " + calcMatchedTotal + "/" + calcExpectedTotal + "; shown working detected in " + calcWorkingTotal + " paragraph(s). Calculation accuracy feeds AO1 knowledge and AO3 chains.");

    /* 2-mark questions: PURE KNOWLEDGE (AO1 only, max 2). */
    var conclusionSeg = null;
    for (var cs = 0; cs < segments.length; cs++) {
      var isLast = cs === segments.length - 1 && segments.length >= 2;
      if (CONCLUSION_HEAD.test(segments[cs].trim()) ||
        (isLast && /\b(?:recommend|should choose|best option|advantages outweigh|benefits outweigh|preferable|overall)\b/i.test(segments[cs]))) {
        conclusionSeg = segments[cs];
      }
    }

    if (marks <= 2) {
      ao2 = 0; ao3 = 0; ao4 = 0;
      if (ao1 > 2) ao1 = 2;
      if (ao1 === 1 && !singleRepeat &&
        ((knowledge.matchedCount >= 2) || (knowledge.matchedCount >= 1 && knowledge.domainOverlap >= 2 && words >= 8) ||
          (knowledge.domainOverlap >= 2 && countSyllabusTerms(textForK.toLowerCase()) >= 2 && words >= 10))) ao1 = 2;
      ruleNotes.push("[Knowledge Rule] 2-mark questions assess pure Knowledge (AO1 max 2); Application, Analysis and Evaluation are not assessed.");
    } else {
      if (caps[1] === 0 || ao2Capped) ao2 = 0;
      if (caps[2] === 0 || !guardrail.passed) ao3 = 0;
      if (caps[3] === 0) ao4 = 0;
      else {
        var finalP = conclusionSeg || extractFinalParagraph(text);
        ao4Result = evaluateDeterministicAo4({
          answer: text, marks: marks === 12 ? 12 : 8, ao2Score: Math.min(caps[1], ao2), ao3Score: Math.min(caps[2], ao3),
          effectiveAppWords: effective, caseContext: caseStem, finalParagraphOverride: finalP
        });
        ao4 = Math.min(caps[3], ao4Result.score);
        if (aiList && marks !== 12) {
          var aiEval = 0;
          for (var a = 0; a < aiList.length; a++) { aiEval += Number(aiList[a].eval_score) || 0; }
          if (ao4Result.score === 0 && aiEval > 0 && ao3 > 0) ao4 = Math.min(caps[3], aiEval);
        }
        if (ao4 > 0) ruleNotes.push("[Evaluation Rule] " + ao4Result.feedback);
        else ruleNotes.push("[Evaluation Rule] Capped to 0: no evaluative decision or justified contextual comparison in the Conclusion paragraph.");
      }
    }

    ao1 = Math.min(caps[0], ao1);
    ao2 = Math.min(caps[1], ao2);
    ao3 = Math.min(caps[2], ao3);
    ao4 = Math.min(caps[3], ao4);

    if (caps[2] > 0 && !guardrail.passed) {
      ruleNotes.push("[Analysis Guardrail] AO3 = 0: needs an explanatory connective ('because', 'therefore', 'which leads to', 'resulting in') linked to a business mechanism.");
    }

    /* ----- Level gating: mark decided by Level, not paragraph addition ----- */
    var total = 0, level = "Level 0 (0 marks)", levelDesc = "", requirement = "";
    var onTopic = validKCount > 0 || knowledge.matchedCount > 0 || countSyllabusTerms(text.toLowerCase()) > 0;

    if (p2 && marks === 12) {
      /* Official 12-mark 3-level rubric (Level 1/2/3/0). */
      var options = [];
      for (var oi = 0; oi < segments.length; oi++) {
        if (oi === segments.length - 1 && (CONCLUSION_HEAD.test(segments[oi].trim()) || /\b(?:recommend|should choose|best option|outweigh)\b/i.test(segments[oi]))) continue;
        options.push(audits[oi]);
      }
      var completeOptions = 0, detailedOptions = 0;
      for (var q = 0; q < options.length; q++) {
        var oa = options[q];
        if (oa && oa.k_score && oa.app_score && oa.an_score) {
          completeOptions++;
          if (wc(oa.isolated_quote) >= 12 && p2Causal.validatedChains >= 1) detailedOptions++;
        }
      }
      var allThree = completeOptions >= 3 || (options.length <= 2 && completeOptions >= 2 && detailedOptions >= 2);
      var concDup = conclusionSeg ? isSegmentDuplicateOfAny(conclusionSeg, options.map(function (x) { return x.isolated_quote; })) : false;
      var raw = ao1 + ao2 + ao3 + ao4;
      if (ao3 < 2 || ao2 === 0 || ao1 === 0) {
        ao4 = 0;
        total = Math.min(4, Math.max(onTopic ? 1 : 0, ao1 + ao2 + ao3));
        if (ao1 + ao2 + ao3 > total) { ao3 = Math.max(0, total - ao1 - ao2); if (ao1 + ao2 > total) ao2 = Math.max(0, total - ao1); }
        level = total === 0 ? "Level 0 (0 marks)" : "Level 1 (1–4 marks)";
        levelDesc = total === 0 ? "No creditable response." : "Limited knowledge in context; little/no explanation and a simple judgement.";
        var miss = [];
        if (ao2 === 0) miss.push("apply concrete case facts/figures inside each paragraph (AO2)");
        if (ao3 < 2) miss.push("develop 'because -> therefore' causal chains inside each option (AO3)");
        miss.push("add a conclusion with justified evaluation comparing options in context");
        requirement = "Requirement to Reach Level 3: " + miss.join("; ") + ".";
      } else if (!(ao1 >= 2 && ao2 >= 2 && ao3 >= 3 && ao4 >= 2 && allThree && !concDup)) {
        total = Math.min(8, Math.max(5, raw));
        level = "Level 2 (5–8 marks)";
        levelDesc = concDup ? "Good knowledge in context + discussion of at least one option, but the conclusion repeated earlier points." : "Good knowledge in context + discussion of at least one option + judgement with some justification.";
        requirement = "Requirement to Reach Level 3: " + (!allThree ? "ensure ALL option paragraphs contain K + App + detailed An; " : "") + (ao2 < 2 ? "apply distinct case details (AO2 >= 2/3); " : "") + (ao3 < 3 ? "develop two-step causal chains (AO3 >= 3/4); " : "") + (ao4 < 2 ? "add a conclusion weighing trade-offs in context (AO4 >= 2/3)." : "");
      } else {
        total = Math.min(12, Math.max(9, raw));
        level = "Level 3 (9–12 marks)";
        levelDesc = ao4 === 3 ? "Excellent knowledge in context + detailed discussion of both options + a well-justified recommendation including why the alternative was rejected." : "Excellent knowledge in context + detailed discussion + a well-justified recommendation explaining why the alternative was rejected.";
        requirement = total < 12 ? "To reach 12/12: ensure 3/3 AO2, 4/4 two-sided AO3 and 3/3 AO4 weighing trade-offs/mitigation in context." : "Full Level 3 Cambridge 0264 standard achieved.";
      }
    } else if (marks === 8) {
      /* 8-mark band labels: Level 3 (7-8), Level 2 (4-6), Level 1 (1-3), Level 0 (0). */
      var askedConclusion = /\b(?:recommend|justify|evaluate|which\s+(?:method|option|one)|do you think|to what extent|conclusion|advantages.*greater)\b/i.test(qtext);
      var concSatisfied = !askedConclusion || (conclusionSeg && ao4 >= 1);
      if (!validKCount) { total = 0; level = "Level 0 (0 marks)"; levelDesc = "No Creditworthy Points"; }
      else if (detailedCount >= 2 && concSatisfied) {
        var eight = detailedCount >= 3 || p2Causal.validatedChains >= 2 || (detailedCount >= 2 && words >= 65 && completeCount >= 2);
        total = eight ? 8 : 7;
        level = "Level 3 (7–8 marks)";
        levelDesc = "Developed Contextual Analysis — 2+ paragraphs with strong Knowledge, Case Application and multi-step Analysis.";
        requirement = eight ? "Full Level 3 Cambridge 0264 standard achieved." : "Develop two-step causal chains to commercial impact across paragraphs for 8/8.";
      } else if (validKCount >= 1 && (appCount >= 1 || anCount >= 1) && (completeCount >= 1 || (appCount >= 2 && validKCount >= 2) || (anCount >= 2 && validKCount >= 2))) {
        total = completeCount >= 2 || (detailedCount >= 1 && validKCount >= 2 && (appCount >= 2 || anCount >= 2)) ? 6 :
          ((detailedCount >= 1 && validKCount >= 2) || (completeCount >= 1 && validKCount >= 2) || (appCount >= 2 && anCount >= 1)) ? 5 : 4;
        level = "Level 2 (4–6 marks)";
        levelDesc = "Applied Explanation — paragraphs explain points with case application and basic analysis.";
        requirement = !concSatisfied ? "Add a brief Conclusion answering the judgment prompt for Level 3 (7–8)." : "Ensure at least 2 paragraphs BOTH have Knowledge + concrete Case Application + detailed multi-step Analysis for Level 3 (7–8).";
      } else {
        total = validKCount >= 2 && (appCount >= 1 || anCount >= 1) ? 3 : (validKCount >= 2 || appCount >= 1 || anCount >= 1) ? 2 : 1;
        level = "Level 1 (1–3 marks)";
        levelDesc = "Limited / Generic Identification — generic syllabus statements with weak application and analysis.";
        requirement = "Apply specific case figures/facts and develop 'because -> therefore -> impact' chains inside 2+ paragraphs for Level 3 (7–8).";
      }
      /* Allocate AO scores to sum to the Level mark, respecting AO caps. */
      ao1 = Math.min(caps[0], validKCount, total);
      ao2 = Math.min(caps[1], appCount, Math.max(0, total - ao1));
      ao3 = Math.min(caps[2], anCount ? Math.max(0, total - ao1 - ao2) : 0);
      var rem = total - (ao1 + ao2 + ao3);
      if (rem > 0 && ao3 < caps[2] && anCount) { var add3 = Math.min(rem, caps[2] - ao3); ao3 += add3; rem -= add3; }
      if (rem > 0 && ao2 < caps[1] && appCount) { var add2 = Math.min(rem, caps[1] - ao2); ao2 += add2; rem -= add2; }
      if (rem > 0 && ao1 < caps[0]) { var add1 = Math.min(rem, caps[0] - ao1); ao1 += add1; rem -= add1; }
      if (rem > 0) total = ao1 + ao2 + ao3;
      /* AO4 belongs to the Conclusion (max 2) and must not inflate the Level total above 8. */
      if (ao4 > 0 && caps[3] > 0) {
        var concNeed = Math.min(2, Math.max(0, 8 - total));
        if (concNeed > 0) { ao4 = Math.min(ao4, concNeed); total += ao4; }
        else ao4 = 0;
      }
    } else {
      /* 2m / 4m / 6m: sum of isolated marks, capped at the question's mark value. */
      total = Math.min(marks, ao1 + ao2 + ao3 + ao4);
      var lv = total === marks ? 2 : (total > 0 ? 1 : 0);
      level = "Level " + lv + " (" + total + "–" + marks + " marks)";
      levelDesc = lv === 2 ? "Full marks — all mark scheme criteria satisfied." : lv === 1 ? "Partial credit — address the missing AO criteria above." : "No creditworthy response.";
      requirement = lv === 2 ? "Full standard achieved." : "Cover all required mark scheme points across separate paragraphs for full marks.";
    }

    /* ----- Strengths / improvements / notes (ported from evaluator.ts) ----- */
    var strengths = [];
    var improvements = [];
    if (caps[0] > 0) { if (ao1 >= caps[0]) strengths.push("Accurately covered required 0264 mark scheme knowledge points."); else if (ao1 > 0) strengths.push("Identified relevant syllabus concept(s)."); }
    if (caps[1] > 0) { if (ao2 >= caps[1]) strengths.push("Directly integrated case facts (" + appDet.found.slice(0, 3).join(", ") + ")."); else if (ao2 > 0) strengths.push("Referenced case context (" + appDet.found.slice(0, 2).join(", ") + ")."); }
    if (caps[2] > 0) { if (ao3 >= caps[2]) strengths.push("Developed clear multi-step cause-and-effect chains."); else if (ao3 > 0) strengths.push("Included causal explanation in one paragraph."); }
    if (caps[3] > 0) { if (ao4 >= caps[3]) strengths.push("Delivered a justified evaluative comparison in context."); else if (ao4 > 0) strengths.push("Attempted an evaluative decision in the Conclusion."); }
    if (!strengths.length) strengths.push("Submitted an exam response, though key mark scheme criteria were missed.");

    if (!p2 && segments.length < 2 && marks >= 4) improvements.push("Write a separate second paragraph with a distinct concept, case application and causal analysis.");
    if (singleRepeat) improvements.push("Repeated point counted once; add a second distinct point.");
    if (caps[0] > 0 && ao1 < caps[0]) improvements.push("Address all required syllabus knowledge points across separate body paragraphs matching the 0264 mark scheme.");
    if (caps[1] > 0 && ao2 < caps[1]) improvements.push(ao2 === 0 ? "Rule Cap: Application is 0/" + caps[1] + ". Cite case facts such as: " + (effective.slice(0, 4).join(", ") || "named figures/products") + " (not just the company name)." : "Apply distinct case references (" + effective.slice(0, 4).join(", ") + ") INSIDE each body paragraph (no cross-paragraph carryover).");
    if (caps[2] > 0 && ao3 < caps[2]) improvements.push("Extend causal analytical chains using 'because -> therefore -> business impact' inside each body paragraph.");
    if (caps[3] > 0 && ao4 < caps[3]) improvements.push(ao4Result && ao4Result.feedback ? ao4Result.feedback : "In the Conclusion, compare why your choice is better than the rejected option using case study context.");
    if (requirement && /^Requirement|^To reach/.test(requirement)) improvements.push(requirement);

    var pct = marks ? Math.round(total / marks * 100) : 0;
    var sumLine = "AO1 " + ao1 + "/" + caps[0] + " · AO2 " + ao2 + "/" + caps[1] + " · AO3 " + ao3 + "/" + caps[2] + " · AO4 " + ao4 + "/" + caps[3];
    var examinerNotes = "[ Cambridge 0264 Anti-Halo Examiner ] " + level + ": " + total + "/" + marks + " (" + pct + "%). " + sumLine + ". ";
    if (ao2Capped) examinerNotes += "AO2 was capped at 0 because concrete case facts were missing. ";
    if (caps[3] > 0 && ao4 === 0) examinerNotes += "AO4 scored 0 because no justified evaluative judgment was demonstrated. ";
    if (p2) examinerNotes += requirement;
    else if (pct >= 85) examinerNotes += "Excellent response demonstrating Grade A* examination mastery.";
    else if (pct >= 65) examinerNotes += "Strong response demonstrating solid Grade B/A technique.";
    else if (pct >= 45) examinerNotes += "Developing response; address missing AO criteria above to reach higher bands.";
    else examinerNotes += "Below target standard; review the mark scheme points and model answer carefully.";

    var rules = {
      appWordsRequired: effective,
      appWordsFound: appDet.found,
      appWordsPassed: appDet.passed || !requiresApp,
      ao2CappedToZero: caps[1] > 0 && ao2 === 0,
      evalWordRequired: caps[3] > 0,
      evalWordsFound: evalScan.found,
      evalWordPassed: caps[3] === 0 || evalScan.passed || ao4 > 0,
      ao4CappedToZero: caps[3] > 0 && ao4 === 0,
      ruleNotes: ruleNotes
    };

    return result(total, [ao1, ao2, ao3, ao4], strengths, improvements, examinerNotes, snippet, level, {
      rules: rules,
      audits: audits,
      levelDescription: levelDesc,
      requirementToLevel3: requirement,
      ao1fb: caps[0] === 0 ? "Not assessed for this mark tier (pure knowledge only)." : (ao1 === 0 ? "0/" + caps[0] + ": insufficient syllabus knowledge matching the mark scheme." : ao1 < caps[0] ? "Partial knowledge (" + ao1 + "/" + caps[0] + "): " + (singleRepeat ? "repeated point counted once; add a distinct point." : "cover all required mark scheme points.") : "Full 0264 mark scheme knowledge demonstrated."),
      ao2fb: caps[1] === 0 ? "Not assessed for this mark tier." : (ao2 === 0 ? "0/" + caps[1] + ": no concrete case study context applied." : ao2 < caps[1] ? "Partial application (" + ao2 + "/" + caps[1] + "): applied context in only some paragraphs (no carryover)." : "Explicitly applied to case study facts (" + appDet.found.slice(0, 3).join(", ") + ")."),
      ao3fb: caps[2] === 0 ? "Not assessed for this mark tier." : (ao3 === 0 ? "0/" + caps[2] + ": lacks explanatory connectives with a business mechanism." : ao3 < caps[2] ? "Partial analysis (" + ao3 + "/" + caps[2] + "): deepen causal chains inside each body paragraph." : "Clear multi-step cause-and-effect analysis linking decisions to commercial outcomes."),
      ao4fb: caps[3] === 0 ? "Not assessed for this mark tier." : (ao4Result ? ao4Result.feedback : "AO4 score: " + ao4 + "/" + caps[3] + ".")
    });
  }

  /* ================================================================ */
  /* Optional local model (Transformers.js v3 ESM CDN, zero build)      */
  /* ================================================================ */

  var MODEL_ID = "SemiLunarz/qwen3-0.6b-igcse-0264-onnx";
  var TRANSFORMERS_CDN = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3";
  /* The model repo ships chat_template.jinja but does NOT embed it in
   * tokenizer_config.json, so Transformers.js cannot find it automatically.
   * Fetch the exact Qwen3 template from the same repo and pass it explicitly. */
  var CHAT_TEMPLATE_URL = "https://huggingface.co/" + MODEL_ID + "/resolve/main/chat_template.jinja";
  /* Exact copy of chat_template.jinja from SemiLunarz/qwen3-0.6b-igcse-0264-onnx.
   * Used verbatim when the repo fetch fails; never a simplified substitute. */
  var INLINE_CHAT_TEMPLATE = "{%- if tools %}\n    {{- '<|im_start|>system\\n' }}\n    {%- if messages[0].role == 'system' %}\n        {{- messages[0].content + '\\n\\n' }}\n    {%- endif %}\n    {{- \"# Tools\\n\\nYou may call one or more functions to assist with the user query.\\n\\nYou are provided with function signatures within <tools></tools> XML tags:\\n<tools>\" }}\n    {%- for tool in tools %}\n        {{- \"\\n\" }}\n        {{- tool | tojson }}\n    {%- endfor %}\n    {{- \"\\n</tools>\\n\\nFor each function call, return a json object with function name and arguments within <tool_call></tool_call> XML tags:\\n<tool_call>\\n{\\\"name\\\": <function-name>, \\\"arguments\\\": <args-json-object>}\\n</tool_call><|im_end|>\\n\" }}\n{%- else %}\n    {%- if messages[0].role == 'system' %}\n        {{- '<|im_start|>system\\n' + messages[0].content + '<|im_end|>\\n' }}\n    {%- endif %}\n{%- endif %}\n{%- set ns = namespace(multi_step_tool=true, last_query_index=messages|length - 1) %}\n{%- for forward_message in messages %}\n    {%- set index = (messages|length - 1) - loop.index0 %}\n    {%- set message = messages[index] %}\n    {%- set current_content = message.content if message.content is defined and message.content is not none else '' %}\n    {%- set tool_start = '<tool_response>' %}\n    {%- set tool_start_length = tool_start|length %}\n    {%- set start_of_message = current_content[:tool_start_length] %}\n    {%- set tool_end = '</tool_response>' %}\n    {%- set tool_end_length = tool_end|length %}\n    {%- set start_pos = (current_content|length) - tool_end_length %}\n    {%- if start_pos < 0 %}\n        {%- set start_pos = 0 %}\n    {%- endif %}\n    {%- set end_of_message = current_content[start_pos:] %}\n    {%- if ns.multi_step_tool and message.role == \"user\" and not(start_of_message == tool_start and end_of_message == tool_end) %}\n        {%- set ns.multi_step_tool = false %}\n        {%- set ns.last_query_index = index %}\n    {%- endif %}\n{%- endfor %}\n{%- for message in messages %}\n    {%- if (message.role == \"user\") or (message.role == \"system\" and not loop.first) %}\n        {{- '<|im_start|>' + message.role + '\\n' + message.content + '<|im_end|>' + '\\n' }}\n    {%- elif message.role == \"assistant\" %}\n        {%- set m_content = message.content if message.content is defined and message.content is not none else '' %}\n        {%- set content = m_content %}\n        {%- set reasoning_content = '' %}\n        {%- if message.reasoning_content is defined and message.reasoning_content is not none %}\n            {%- set reasoning_content = message.reasoning_content %}\n        {%- else %}\n            {%- if '</think>' in m_content %}\n                {%- set content = (m_content.split('</think>')|last).lstrip('\\n') %}\n                {%- set reasoning_content = (m_content.split('</think>')|first).rstrip('\\n') %}\n                {%- set reasoning_content = (reasoning_content.split('<think>')|last).lstrip('\\n') %}\n            {%- endif %}\n        {%- endif %}\n        {%- if loop.index0 > ns.last_query_index %}\n            {%- if loop.last or (not loop.last and (not reasoning_content.strip() == '')) %}\n                {{- '<|im_start|>' + message.role + '\\n<think>\\n' + reasoning_content.strip('\\n') + '\\n</think>\\n\\n' + content.lstrip('\\n') }}\n            {%- else %}\n                {{- '<|im_start|>' + message.role + '\\n' + content }}\n            {%- endif %}\n        {%- else %}\n            {{- '<|im_start|>' + message.role + '\\n' + content }}\n        {%- endif %}\n        {%- if message.tool_calls %}\n            {%- for tool_call in message.tool_calls %}\n                {%- if (loop.first and content) or (not loop.first) %}\n                    {{- '\\n' }}\n                {%- endif %}\n                {%- if tool_call.function %}\n                    {%- set tool_call = tool_call.function %}\n                {%- endif %}\n                {{- '<tool_call>\\n{\"name\": \"' }}\n                {{- tool_call.name }}\n                {{- '\", \"arguments\": ' }}\n                {%- if tool_call.arguments is string %}\n                    {{- tool_call.arguments }}\n                {%- else %}\n                    {{- tool_call.arguments | tojson }}\n                {%- endif %}\n                {{- '}\\n</tool_call>' }}\n            {%- endfor %}\n        {%- endif %}\n        {{- '<|im_end|>\\n' }}\n    {%- elif message.role == \"tool\" %}\n        {%- if loop.first or (messages[loop.index0 - 1].role != \"tool\") %}\n            {{- '<|im_start|>user' }}\n        {%- endif %}\n        {{- '\\n<tool_response>\\n' }}\n        {{- message.content }}\n        {{- '\\n</tool_response>' }}\n        {%- if loop.last or (messages[loop.index0 + 1].role != \"tool\") %}\n            {{- '<|im_end|>\\n' }}\n        {%- endif %}\n    {%- endif %}\n{%- endfor %}\n{%- if add_generation_prompt %}\n    {{- '<|im_start|>assistant\\n' }}\n    {%- if enable_thinking is defined and enable_thinking is false %}\n        {{- '<think>\\n\\n</think>\\n\\n' }}\n    {%- endif %}\n{%- endif %}";
  var chatTemplate = null;
  var chatTemplatePromise = null;
  var generator = null;
  var tfModule = null;
  var transformersPromise = null;
  var aiReady = false;
  var aiLoading = false;

  /* Watchdog state. There is no module worker here, so the GPU/ONNX call itself
   * cannot truly be aborted: it runs on the main thread. What we CAN guarantee
   * is that the UI, status, busy flag and deterministic fallback always recover
   * from a stall, and that a late resolution is ignored (loadEpoch). */
  var LOAD_TIMEOUT_MS = 300000;   /* 300 s download / shader-compile budget */
  var MARK_TIMEOUT_MS = 300000;   /* idle timeout between streamed tokens */
  var REAUDIT_TIMEOUT_MS = 240000; /* per-paragraph re-audit budget */
  var MARK_TOTAL_MS = 600000;      /* absolute cap for one generation */
  var aiBusy = false;             /* module-level guard: one generation at a time */
  var loadEpoch = 0;              /* rejects callbacks from a timed-out load */
  var loadTimer = null;
  var markTimer = null;
  var aiHeartbeat = null;         /* set while a generation is in flight */
  var stopCriteria = null;        /* Transformers.js InterruptableStoppingCriteria */

  function clearLoadTimer() { if (loadTimer !== null) { clearTimeout(loadTimer); loadTimer = null; } }
  function clearMarkTimer() { if (markTimer !== null) { clearTimeout(markTimer); markTimer = null; } }

  /* Resolve `promise` with `fallback` if it has not settled within `ms`.
   * The underlying work keeps running (no worker / no real abort) but the
   * caller is unblocked and can fall back deterministically. */
  function withTimeout(promise, ms, fallback) {
    if (!promise || typeof promise.then !== "function") return Promise.resolve(fallback);
    return new Promise(function (resolve) {
      var done = false;
      var timer = setTimeout(function () {
        if (done) return;
        done = true;
        resolve(fallback);
      }, ms);
      promise.then(function (v) {
        if (done) return;
        done = true; clearTimeout(timer); resolve(v);
      }, function () {
        if (done) return;
        done = true; clearTimeout(timer); resolve(fallback);
      });
    });
  }

  /* Public state/event API used by the header "Local AI" dropdown and by the
   * "Enable local AI" buttons in Paper 1 / Paper 2. */
  var aiListeners = [];
  var aiState = {
    status: "Local AI: not loaded — instant deterministic marker is active.",
    ready: false, loading: false, progress: 0, percent: 0,
    device: "webgpu", reason: deviceReason()
  };
  /* Real device detection (§4.4): navigator.deviceMemory + navigator.gpu.
   * The sync label is available immediately; an async adapter probe below
   * refines it (e.g. Safari-on-macOS, or no hardware adapter at all). */
  function deviceMemoryGb() {
    try { var m = Number(navigator.deviceMemory); return isFinite(m) && m > 0 ? m : 0; }
    catch (e) { return 0; }
  }
  function deviceReason() {
    try {
      var ua = navigator.userAgent || "";
      var ios = /iPhone|iPad|iPod/.test(ua);
      var macSafari = /Macintosh/.test(ua) && /Safari/.test(ua) && !/Chrome/.test(ua);
      if (ios) return "iOS / iPadOS Safari memory cap (< 2 GB tab limit)";
      var mem = deviceMemoryGb();
      if (navigator.gpu) {
        if (macSafari) return "macOS Safari Desktop WebGPU";
        return "Desktop WebGPU (" + (mem ? mem + " GB" : "16 GB") + " RAM)";
      }
      if (macSafari) return "macOS Safari Desktop WebGPU";
      if (mem) return "Device RAM (" + mem + " GB)";
      return "WebGPU hardware adapter unavailable";
    } catch (e) { return "WebGPU hardware adapter unavailable"; }
  }
  /* Refine the label once the WebGPU adapter probe resolves. Never blocks load. */
  function probeGpuAdapter() {
    try {
      if (!navigator.gpu || typeof navigator.gpu.requestAdapter !== "function") return;
      navigator.gpu.requestAdapter().then(function (adapter) {
        if (!adapter) {
          aiState.reason = "WebGPU hardware adapter unavailable";
          aiState.device = "wasm";
          emitAi(); updateDownloadBanner();
          return;
        }
        var ua = navigator.userAgent || "";
        if (/Macintosh/.test(ua) && /Safari/.test(ua) && !/Chrome/.test(ua)) {
          aiState.reason = "macOS Safari Desktop WebGPU";
        }
        emitAi(); updateDownloadBanner();
      })["catch"](function () {});
    } catch (e) {}
  }

  function emitAi() {
    for (var i = 0; i < aiListeners.length; i++) {
      try { aiListeners[i](aiState); } catch (e) {}
    }
  }

  function el(id) { return (typeof document !== "undefined") ? document.getElementById(id) : null; }

  function updateFileNotice() {
    var notice = el("ec-ai-file-notice");
    if (notice) notice.hidden = (window.location.protocol !== "file:");
  }

  function showProgress() {
    var bar = el("ec-ai-progress");
    if (bar) { bar.value = 0; bar.style.width = "2%"; bar.style.display = "block"; }
  }
  function setProgress(pct) {
    var bar = el("ec-ai-progress");
    if (!bar) return;
    var n = Number(pct);
    if (!isFinite(n)) n = 0;
    n = Math.max(0, Math.min(100, Math.round(n)));
    bar.value = n;
    bar.style.width = (n === 100 ? "100%" : Math.max(2, n) + "%");
  }
  function hideProgress() {
    var bar = el("ec-ai-progress");
    if (bar) { bar.value = 100; bar.style.width = "100%"; bar.style.display = "none"; }
  }

  /* Background-download banner (§4.4). Sky = WebGPU download, amber = WASM
   * fallback / unavailable. Always visible while aiLoading is true. */
  var BG_HELP = "Downloading in the background — you can still click Submit anytime to mark immediately with Instant CIE 0264 Examiner!";
  var BG_SIZE = "Preparing Qwen 3 0.6B (~650 MB)…";
  function updateDownloadBanner() {
    var banner = el("ec-ai-bg-banner");
    if (!banner) return;
    if (!aiLoading) { banner.style.display = "none"; return; }
    var amber = /wasm|unavailable|retry/i.test(aiState.reason || "");
    banner.style.display = "block";
    banner.style.borderLeftColor = amber ? "#b45309" : "#0284c7";
    banner.style.background = amber ? "#fffbeb" : "#f0f9ff";
    banner.style.color = amber ? "#7c2d12" : "#0c4a6e";
    var sizeEl = el("ec-ai-bg-size"), helpEl = el("ec-ai-bg-help"), devEl = el("ec-ai-bg-device");
    if (sizeEl) sizeEl.textContent = BG_SIZE;
    if (helpEl) helpEl.textContent = BG_HELP;
    if (devEl) devEl.textContent = aiState.reason || deviceReason();
  }
  function setDownloadBanner(on) {
    aiLoading = !!on;
    aiState.loading = !!on;
    updateDownloadBanner();
    emitAi();
  }

  /* BraceDepthTracker (§4.5 item 3). Tracks brace depth while streaming so we
   * can interrupt generation at the closing `}` of the first balanced JSON
   * object, and can ignore trailing prose when parsing. Transformers.js v3 has
   * no built-in string stop criterion in this build, so InterruptableStopping-
   * Criteria is driven from the stream instead; a leading `{` is prefilled into
   * the prompt. NOTE: without a worker the interrupt is cooperative (checked
   * between generated tokens) and the main-thread GPU pass cannot be cancelled
   * mid-flight — extractJsonObject remains the guaranteed safety net. */
  var braceStop = null;
  function createBraceDepthTracker(initialDepth) {
    /* The prompt is prefilled with "{", so generation starts one level deep. */
    var depth = initialDepth || 0, inStr = false, esc = false,
      started = (initialDepth || 0) > 0, complete = false;
    return {
      isComplete: function () { return complete; },
      feed: function (chunk) {
        var s = String(chunk == null ? "" : chunk);
        for (var i = 0; i < s.length && !complete; i++) {
          var c = s.charAt(i);
          if (inStr) { if (esc) esc = false; else if (c === "\\") esc = true; else if (c === '"') inStr = false; continue; }
          if (c === '"') { inStr = true; continue; }
          if (c === "{") { depth++; started = true; continue; }
          if (c === "}" && started) { depth--; if (depth <= 0) complete = true; }
        }
        return complete;
      },
      sliceComplete: function (raw) {
        var s = String(raw || "");
        var start = s.indexOf("{");
        if (start === -1) return s;
        depth = 0; inStr = false; esc = false; started = false; complete = false;
        for (var i = start; i < s.length; i++) {
          var c = s.charAt(i);
          if (inStr) { if (esc) esc = false; else if (c === "\\") esc = true; else if (c === '"') inStr = false; continue; }
          if (c === '"') { inStr = true; continue; }
          if (c === "{") depth++;
          else if (c === "}") { depth--; if (depth === 0) { complete = true; return s.slice(start, i + 1); } }
        }
        return s;
      }
    };
  }

  /* Streaming draft output: a small label plus a pre-wrapped text body. */
  function streamStart() {
    var box = el("ec-ai-stream");
    if (!box) return;
    box.innerHTML = '<div class="ec-meta" style="text-transform:none;letter-spacing:0;margin:0 0 6px"><strong>Local AI draft output</strong></div><div class="ec-ai-stream-body"></div>';
    box.style.display = "block";
  }
  function streamToken(token) {
    if (token == null) return;
    /* Heartbeat: any token proves the model is alive, so push the deadline out. */
    if (aiHeartbeat) { try { aiHeartbeat(); } catch (e) {} }
    if (braceStop && braceStop.feed(token) && stopCriteria && stopCriteria.interrupt) {
      try { stopCriteria.interrupt(); } catch (e) {}
    }
    var box = el("ec-ai-stream");
    if (!box) return;
    var body = box.querySelector ? box.querySelector(".ec-ai-stream-body") : null;
    if (!body) { box.appendChild(document.createTextNode(String(token))); return; }
    body.textContent = (body.textContent || "") + String(token);
  }
  function streamFail() {
    var box = el("ec-ai-stream");
    if (box) { box.style.display = "none"; box.innerHTML = ""; }
  }
  /* Show the complete model draft once generation finishes. Streaming can
   * emit partial tokens; the final text is the authoritative full output. */
  function streamFinish(text) {
    var box = el("ec-ai-stream");
    if (!box) return;
    var body = box.querySelector ? box.querySelector(".ec-ai-stream-body") : null;
    if (!body) { streamStart(); body = box.querySelector ? box.querySelector(".ec-ai-stream-body") : null; }
    if (!body) return;
    var clean = String(text || "").replace(/<think>[\s\S]*?<\/think>/gi, "").replace(/<think>[\s\S]*$/gi, "").trim();
    if (clean) body.textContent = clean.slice(0, 2000);
  }

  /* Cache the dynamic-import promise. The import() call lives inside a Function
   * constructor so browsers that cannot parse import() do not break this file. */
  function loadTransformers() {
    if (transformersPromise) return transformersPromise;
    transformersPromise = new Promise(function (resolve, reject) {
      var dynImport;
      try { dynImport = new Function("u", "return import(u)"); }
      catch (e) { reject(new Error("dynamic import not supported")); return; }
      var p;
      try { p = dynImport(TRANSFORMERS_CDN); }
      catch (e) { reject(e); return; }
      if (!p || typeof p.then !== "function") { reject(new Error("dynamic import failed")); return; }
      p.then(function (mod) { tfModule = mod; resolve(mod); }, reject);
    });
    transformersPromise["catch"](function () { transformersPromise = null; });
    return transformersPromise;
  }

  function createGenerator(tf, device, progressCb) {
    return tf.pipeline("text-generation", MODEL_ID, {
      dtype: "q4",
      device: device,
      /* Disable ConstantFolding so the q4 graph fits on low-memory devices. */
      session_options: {
        extra: { "optimization.disable_specified_optimizers": "ConstantFolding" }
      },
      progress_callback: progressCb
    });
  }

  /* Load (and cache) the repo's exact Qwen3 chat template. Never blocks model
   * loading: on any failure the inline Qwen3 template above is used instead. */
  function loadChatTemplate() {
    if (chatTemplate) return Promise.resolve(chatTemplate);
    if (chatTemplatePromise) return chatTemplatePromise;
    chatTemplatePromise = (typeof fetch === "function" ? fetch(CHAT_TEMPLATE_URL) : Promise.reject(new Error("fetch unavailable")))
      .then(function (r) {
        if (!r.ok) throw new Error("chat template HTTP " + r.status);
        return r.text();
      })
      .then(function (t) {
        if (!t || t.indexOf("<|im_start|>") === -1) throw new Error("invalid chat template");
        chatTemplate = t;
        return t;
      })["catch"](function () {
        chatTemplatePromise = null;
        return INLINE_CHAT_TEMPLATE;
      });
    return chatTemplatePromise;
  }

  function loadLocalAI(statusFn) {
    function status(s) {
      aiState.status = s;
      emitAi();
      if (statusFn) { try { statusFn(s); } catch (e) {} }
    }
    function resetDownloadButton(label) {
      if (typeof document === "undefined") return;
      var dl = document.getElementById("ec-ai-dl");
      if (dl) { dl.disabled = false; if (label) dl.textContent = label; }
    }
    function enableAiRun() {
      if (typeof document === "undefined") return;
      var btn = document.getElementById("ec-ai-ai-run");
      if (btn) btn.disabled = false;
    }
    function finishLoading() {
      clearLoadTimer();
      aiLoading = false;
      aiState.loading = false;
      setDownloadBanner(false);
    }
    updateFileNotice();
    if (window.location.protocol === "file:") {
      status("Local AI unavailable (open this page over HTTP/HTTPS to download browser AI models) — deterministic marker active.");
      return;
    }
    if (aiReady) { status("Local AI: Qwen 3 0.6B is ready."); return; }
    /* Busy guard: never start a second model load while marking or loading. */
    if (aiBusy || aiLoading) return;
    if (typeof Promise === "undefined") {
      status("Local AI unavailable (Promise not supported) — deterministic marker active.");
      return;
    }
    var epoch = ++loadEpoch;
    aiLoading = true;
    aiState.loading = true;
    status("Local AI: loading Transformers.js from CDN…");
    showProgress();
    updateDownloadBanner();
    probeGpuAdapter();
    loadChatTemplate(); /* prefetch the exact Qwen3 template while the model loads */

    /* 300 s watchdog: a stalled shader compile / download must not leave the
     * promise pending with aiLoading stuck true and no deterministic fallback. */
    clearLoadTimer();
    loadTimer = setTimeout(function () {
      if (epoch !== loadEpoch) return;
      clearLoadTimer();
      loadEpoch++; /* invalidate any late resolution from the stalled load */
      generator = null;
      aiReady = false;
      finishLoading();
      aiState.ready = false; aiState.percent = 0; emitAi();
      hideProgress();
      resetDownloadButton("Retry local AI download");
      status("Local AI unavailable (model download timed out) — deterministic marker active.");
    }, LOAD_TIMEOUT_MS);

    function onProgress(p) {
      if (epoch !== loadEpoch) return;
      try {
        if (!p) return;
        if (p.status === "progress_total" && typeof p.progress === "number") {
          var pct = Math.min(99, Math.round(p.progress * 100));
          var mb = p.total ? " (" + Math.round((p.loaded || 0) / 1048576) + "/" + Math.round(p.total / 1048576) + " MB)" : "";
          setProgress(pct);
          aiState.percent = pct; emitAi();
          status("Local AI: downloading Qwen 3 0.6B — " + pct + "%" + mb + "…");
        } else if (p.status === "progress" && typeof p.progress === "number") {
          /* Transformers.js reports per-file "progress" as a 0–100 percentage. */
          aiState.percent = Math.min(99, Math.round(p.progress)); emitAi();
          setProgress(aiState.percent);
          status("Local AI: downloading " + (p.file ? String(p.file).split("/").pop() : "weights") + " (" + Math.round(p.progress) + "%)…");
        } else if (p.status === "ready") {
          setProgress(99);
          status("Local AI: compiling WebGPU shaders…");
        } else if (p.status === "done") {
          setProgress(100);
        }
      } catch (e) {}
    }

    loadTransformers().then(function (tf) {
      if (epoch !== loadEpoch) return null;
      /* Pin the cache namespace and base env flags immediately after import,
       * before pipeline(), so cached ONNX weights from the React build are reused. */
      try {
        tf.env.allowLocalModels = false;
        tf.env.useBrowserCache = true;
        tf.env.cacheKey = (EC.aiCacheKey ? EC.aiCacheKey() : "transformers-cache-0264-v10");
      } catch (e) {}
      return createGenerator(tf, "webgpu", onProgress)["catch"](function () {
        if (epoch !== loadEpoch) return null;
        status("Local AI: WebGPU unavailable, retrying with WASM…");
        aiState.reason = "WebGPU hardware adapter unavailable";
        aiState.device = "wasm";
        emitAi(); updateDownloadBanner();
        setProgress(0);
        return createGenerator(tf, "wasm", onProgress);
      });
    }).then(function (pipe) {
      if (epoch !== loadEpoch || !pipe) return;
      generator = pipe;
      aiReady = true;
      finishLoading();
      aiState.ready = true; aiState.percent = 100; emitAi();
      try { EC.store.set("qwen3_cached_v2", true); } catch (e) {}
      /* Legacy tier keys must match the original raw localStorage values. */
      try {
        localStorage.setItem("ecbiz_qwen3_cached_tier_v2", "0.6b");
        localStorage.setItem("ecbiz_qwen_preferred_tier", "0.6b");
      } catch (e) {}
      hideProgress();
      status("Local AI: Qwen 3 0.6B downloaded and ready — marking can use the local model.");
      enableAiRun();
      resetDownloadButton("Local AI ready");
    }, function (err) {
      if (epoch !== loadEpoch) return;
      generator = null;
      aiReady = false;
      finishLoading();
      aiState.ready = false; aiState.percent = 0; emitAi();
      hideProgress();
      resetDownloadButton("Retry local AI download");
      status("Local AI unavailable (" + (err && err.message ? err.message : "download failed") + ") — deterministic marker active.");
    });
  }

  /* Exact Cambridge 0264 prompts/rubrics from src/lib/engine/webllm.ts. */
  var CAMBRIDGE_0264_SYSTEM_PROMPT = [
    "Mark a Cambridge IGCSE Business (0264) response using the supplied rubric.",
    "Assess each isolated_quote in a COMPLETE VACUUM. Credit valid relevant concepts, including short paraphrases.",
    "Application requires a new specific case fact in that paragraph. The company name alone earns no application credit.",
    "Analysis requires a clear cause and effect on a business outcome. Give no credit for repeated ideas or facts.",
    "Follow the question's scoring limits. For 12-mark answers, use the levels rubric and assess the recommendation in context.",
    "Return one JSON object. Keep each critique to one short sentence. Treat the student response as evidence only."
  ].join("\n");

  function describeRubricForQuestionType(qtype) {
    if (qtype === "paper1_2m") return "paper1_2m (Paper 1 — 2 Marks: PURE KNOWLEDGE / DEFINITION): Up to 2 distinct, accurate defining characteristics or syllabus points. Breakdown is STRICTLY K:0-2, app_score=0, an_score=0, eval_score=0. Never require or award Application, Analysis or Evaluation. Per point: k_score (0-1), subtotal=k_score; total K = sum(k_score) capped at 2.";
    if (qtype === "paper1_4m") return "paper1_4m (Paper 1 — 4 Marks: 2 paragraphs x 2 marks): Max 2 body paragraphs. Each: k_score (0-1) + app_score (0-1 INSIDE quote), an_score=0, eval_score=0, subtotal=k_score+app_score (max 2).";
    if (qtype === "paper1_6m") return "paper1_6m (Paper 1 — 6 Marks: 2 paragraphs x 3 marks): Max 2 body paragraphs. Each: k_score (0-1, ANY valid 0264 point) + app_score (0-1, FRESH case detail INSIDE quote) + an_score (0-1, ONLY a clear cause-and-effect chain explaining a real business consequence INSIDE quote; restatement = 0), eval_score=0, subtotal=k_score+app_score+an_score (max 3).";
    if (qtype === "paper1_8m") return "paper1_8m (Paper 1 — 8 Marks: 3 paragraphs = 3 + 3 + 2): P1 & P2 (role='option', max 3 each): k_score(0-1, ANY valid 0264 point)+app_score(0-1, FRESH case detail)+an_score(0-1, ONLY a clear cause-and-effect chain explaining a real business consequence; restatement = 0). P3 (role='conclusion', max 2): k_score=0, app_score=0, an_score=0, eval_score(0-2: 1 for clear decision + 1 for justified comparison vs rejected option in case context INSIDE P3; repeating P1 gets 0).";
    if (qtype === "paper2_8m_a") return "paper2_8m_a (Paper 2 — 8-Mark Part (a) -> Level 1-3): Audit EVERY paragraph individually: k_score(0-1, ANY valid 0264 point), app_score(0-1, FRESH case detail INSIDE quote), an_score(0-1, ONLY a clear cause-and-effect chain explaining a real business consequence; restatement/summary = 0), eval_score=0, subtotal=k+app+an. Evaluate Level 3 (2+ strong K+App+detailed An), Level 2 (K+App+basic An or mixed), or Level 1 (generic/weak App & An).";
    if (qtype === "paper2_12m_b") return "paper2_12m_b (Paper 2 — 12-Mark Part (b) LEVELS-BASED -> Official Cambridge 3-Level rubric): Paragraph scores (k_score 0-1 ANY valid 0264 point, app_score 0-1 FRESH case detail, an_score 0-1 clear consequence chain, eval_score diagnostic) are DIAGNOSTIC ONLY and are NOT added to produce the final mark. Level 3 (9-12): excellent knowledge in context + detailed discussion of BOTH options + well-justified recommendation including why the alternative was rejected. Level 2 (5-8): good knowledge in context + detailed discussion of AT LEAST ONE option + judgement with some justification. Level 1 (1-4): limited knowledge/discussion + simple judgement with limited justification. Level 0 (0): no creditable response.";
    return "paper1_8m (Paper 1 — 8 Marks: 3 paragraphs = 3 + 3 + 2): P1 & P2 (role='option', max 3 each): k_score(0-1)+app_score(0-1)+an_score(0-1). P3 (role='conclusion', max 2): eval_score(0-2) for a justified decision in context.";
  }
  function describeRubric(marks, qtype) { return describeRubricForQuestionType(qtype || resolveQuestionType(marks, 1)); }

  function splitResponsePoints(answer) {
    var text = String(answer || "").trim();
    if (!text) return [];
    var blocks = text.split(/\n\s*\n|\n/);
    var out = [];
    for (var b = 0; b < blocks.length; b++) {
      var parts = blocks[b].split(/(?:(?:^|[.!?;]\s+)\s*)(?=(?:\(\d{1,2}\)\s+|\d{1,2}[.)]\s+|(?:point|reason|benefit|advantage|disadvantage|drawback|limitation|factor|method|way|option)\s*\d{1,2}\s*[:.-]\s+))/i);
      for (var p = 0; p < parts.length; p++) {
        var part = String(parts[p] || "").trim();
        if (!part) continue;
        if (/^(recommendation|conclusion|overall)\s*[:\-]/i.test(part)) { out.push(part); continue; }
        var cleaned = part.replace(/^(?:(?:\(\d{1,2}\)|\d{1,2}[.)]|(?:point|reason|benefit|advantage|disadvantage|drawback|limitation|factor|method|way|option)\s*\d{1,2})\s*[:.\-]?\s*)+/i, "").trim();
        if (cleaned) out.push(cleaned);
      }
    }
    return out;
  }

  /* Closes open delimiters in a truncated JSON fragment (webllm.ts:440-493). */
  function closeJsonFragment(body) {
    var stack = [], inString = false, escaped = false, out = "";
    for (var i = 0; i < body.length; i++) {
      var ch = body.charAt(i);
      if (inString) { out += ch; if (escaped) escaped = false; else if (ch === "\\") escaped = true; else if (ch === '"') inString = false; continue; }
      if (ch === '"') { inString = true; out += ch; continue; }
      if (ch === "{" || ch === "[") { stack.push(ch === "{" ? "}" : "]"); out += ch; continue; }
      if (ch === "}") {
        while (stack.length && stack[stack.length - 1] === "]") { out += "]"; stack.pop(); }
        if (stack.length && stack[stack.length - 1] === "}") stack.pop();
        out += ch; continue;
      }
      if (ch === "]") { if (stack.length && stack[stack.length - 1] === "]") stack.pop(); out += ch; continue; }
      out += ch;
    }
    if (escaped) out = out.slice(0, -1);
    if (inString) out += '"';
    out = out.replace(/\s+$/, "");
    if (/:\s*$/.test(out)) { out = out.replace(/[\s,]*:[\s]*$/, ""); out = out.replace(/,?\s*"(?:[^"\\]|\\.)*"\s*$/, ""); }
    out = out.replace(/[\s,]+$/, "");
    while (stack.length) out += stack.pop();
    return out;
  }
  function salvageTruncatedJsonObject(withoutThink) {
    var start = withoutThink.indexOf("{");
    if (start === -1) return null;
    var body = withoutThink.slice(start).replace(/\\$/, "");
    for (var attempt = 0; attempt < 50 && body.length > 0; attempt++) {
      var candidate = closeJsonFragment(body);
      try { JSON.parse(candidate); return candidate; }
      catch (e) { var cut = body.lastIndexOf(","); if (cut <= 0) return null; body = body.slice(0, cut); }
    }
    return null;
  }
  function extractJsonObject(raw) {
    if (!raw || typeof raw !== "string") return null;
    var s = String(raw).replace(/<think>[\s\S]*?<\/think>/gi, "").replace(/<think>[\s\S]*$/gi, "").trim();
    /* BraceDepthTracker: ignore anything after the first balanced JSON object
     * (§4.5 item 3) even when the model kept generating past the closing brace. */
    s = createBraceDepthTracker().sliceComplete(s);
    var start = s.indexOf("{");
    if (start === -1) return null;
    var depth = 0, inStr = false, esc = false;
    for (var i = start; i < s.length; i++) {
      var c = s.charAt(i);
      if (inStr) { if (esc) esc = false; else if (c === "\\") esc = true; else if (c === '"') inStr = false; }
      else if (c === '"') inStr = true;
      else if (c === "{") depth++;
      else if (c === "}" && --depth === 0) {
        var fragment = closeJsonFragment(s.slice(start, i + 1));
        try { return JSON.parse(fragment); } catch (e) { /* fall through to salvage */ }
      }
    }
    var salvaged = salvageTruncatedJsonObject(s);
    if (!salvaged) return null;
    try { return JSON.parse(salvaged); } catch (e) { return null; }
  }

  /* The prompt prefills "{", so generated text usually starts mid-object.
   * Restore the opening brace, then prefer any balanced object that actually
   * contains a paragraphs array (the model may emit a smaller object first). */
  function parseMarkJson(raw) {
    var s = String(raw == null ? "" : raw)
      .replace(/<think>[\s\S]*?<\/think>/gi, "")
      .replace(/<think>[\s\S]*$/gi, "")
      .trim();
    if (!s) return null;
    if (s.charAt(0) !== "{") s = "{" + s;
    var parsed = extractJsonObject(s);
    if (parsed && Array.isArray(parsed.paragraphs) && parsed.paragraphs.length) return parsed;
    var from = s.indexOf("{", 1);
    var checked = 0;
    while (from !== -1 && checked < 24) {
      var candidate = extractJsonObject(s.slice(from));
      checked++;
      if (candidate && Array.isArray(candidate.paragraphs) && candidate.paragraphs.length) return candidate;
      from = s.indexOf("{", from + 1);
    }
    return parsed;
  }

  /* Normalise the Transformers.js output shape to a plain text string. */
  function generatedTextOf(output) {
    var text = output && output[0] ? output[0].generated_text : "";
    if (Array.isArray(text)) {
      var last = null;
      for (var i = text.length - 1; i >= 0; i--) {
        var part = text[i];
        if (typeof part === "string") { last = { content: part }; break; }
        if (part && typeof part.content === "string") { last = part; break; }
        if (part && typeof part.generated_text === "string") { last = { content: part.generated_text }; break; }
      }
      text = last ? last.content : "";
    } else if (text && typeof text === "object") {
      text = text.content != null ? text.content : (text.generated_text || "");
    }
    return String(text == null ? "" : text);
  }

  /* Some generations return a metadata stub rather than an assessment.
   * Regenerate a few times before allowing the deterministic fallback. */
  function generateValidJson(prompt, opts, tries) {
    return generator(prompt, opts).then(function (out) {
      var parsed = parseMarkJson(generatedTextOf(out));
      if (parsed && Array.isArray(parsed.paragraphs) && parsed.paragraphs.length) return out;
      if (tries <= 1) return out;
      return generateValidJson(prompt, opts, tries - 1);
    })["catch"](function (err) {
      if (tries <= 1) throw err;
      return generateValidJson(prompt, opts, tries - 1);
    });
  }

  function computeRecommendedMaxTokens(answer, qtype) {
    var words = String(answer || "").trim().split(/\s+/).filter(Boolean).length;
    var base = qtype === "paper2_12m_b" ? 420 : (qtype === "paper1_8m" || qtype === "paper2_8m_a") ? 360 : 280;
    return Math.min(1150, Math.max(460, Math.ceil(words * 2.2) + base));
  }

  /* ================================================================ */
  /* Rule pre-scan / paragraph-audit completion (webllm.ts:560-818)     */
  /* ================================================================ */

  var SECTION_HEADER_LINE_REGEX = /^(?:(?:advantage|disadvantage|benefit|drawback|drawbacks|limitation|point|reason|factor|option|method|way|step|part)\s*\d{0,2}\s*(?:\([^)\n]*\))?|(?:conclusion|recommendation|summary|in\s+conclusion|in\s+summary|final\s+(?:decision|verdict)|overall))\s*:?\.?$/i;
  var CONCLUSION_HEADING_LIKE = /^(?:recommendation|conclusion|in conclusion|to conclude|to sum up|in summary|overall|on balance|ultimately|i recommend|we recommend|the deciding factor)\b/i;
  var EVAL_JUDGMENT_RE = /(recommend|overall|in conclusion|to conclude|on balance|ultimately|deciding factor|outweigh|better option|best option|more suitable|preferable|i conclude|we recommend|justified)/i;
  var EVAL_COMPARISON_RE = /(whereas|rather than|instead of|outweigh|compared|trade.?off|on the one hand|greater than|advantages are greater|disadvantages are greater)/i;
  var EVAL_MITIGATION_RE = /(mitigat|provided that|contingency|deal with|overcome|manage this|depends on)/i;

  function isSectionHeaderOnlyLine(text) {
    var trimmed = String(text == null ? "" : text).trim();
    if (!trimmed) return true;
    var words = trimmed.split(/\s+/).filter(Boolean).length;
    if (words > 7) return false;
    if (/[.!?;,]/.test(trimmed.replace(/:\s*$/, ""))) return false;
    return SECTION_HEADER_LINE_REGEX.test(trimmed);
  }
  function getSubstantiveParagraphIndices(segments) {
    var out = [];
    for (var i = 0; i < segments.length; i++) { if (!isSectionHeaderOnlyLine(segments[i])) out.push(i + 1); }
    return out;
  }
  function conclusionRoleFor(quote, qtype) {
    if (CONCLUSION_HEADING_LIKE.test(String(quote || "").trim())) return "conclusion";
    return (qtype === "paper1_8m" || qtype === "paper2_12m_b" || qtype === "paper2_8m_a") ? "option" : "body_point";
  }
  function maxSubtotalFor(role, qtype) {
    if (role === "conclusion") return qtype === "paper2_12m_b" ? 3 : 2;
    if (qtype === "paper1_2m" || qtype === "paper1_4m") return 2;
    return 3;
  }
  function zeroParagraphItem(index, quote, qtype) {
    var role = conclusionRoleFor(quote, qtype);
    return {
      paragraph_number: index + 1, role: role, isolated_quote: String(quote || "").trim(),
      k_score: 0, app_score: 0, an_score: 0, eval_score: 0, subtotal: 0,
      max_subtotal: maxSubtotalFor(role, qtype),
      critique: "Section header — 0 marks (no substantive 0264 content inside this line)."
    };
  }
  /* Deterministic safety net for a paragraph slot neither Qwen nor the
   * per-paragraph re-audit supplied (evaluator/webllm backfill port). */
  function deterministicParagraphBackfill(index, quote, qtype, opts) {
    opts = opts || {};
    var trimmed = String(quote || "").trim();
    var words = trimmed.split(/\s+/).filter(Boolean).length;
    var role = conclusionRoleFor(trimmed, qtype);
    var isConclusionSlot = role === "conclusion" &&
      (qtype === "paper1_8m" || qtype === "paper2_8m_a" || qtype === "paper2_12m_b");
    var kScore = 0, appScore = 0, anScore = 0, evalScore = 0;
    if (isConclusionSlot) {
      var maxEval = qtype === "paper2_12m_b" ? 3 : 2;
      evalScore = (EVAL_JUDGMENT_RE.test(trimmed) ? 1 : 0) +
        (EVAL_COMPARISON_RE.test(trimmed) ? 1 : 0) +
        (qtype === "paper2_12m_b" && EVAL_MITIGATION_RE.test(trimmed) ? 1 : 0);
      evalScore = Math.min(evalScore, maxEval);
    } else {
      var sentences = trimmed.split(/[.!?]\s+|\n+/).map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 3; });
      if (qtype === "paper1_2m") {
        var kn = 0;
        for (var si = 0; si < sentences.length; si++) { if (looksLikeKnowledgePoint(sentences[si])) kn++; }
        kScore = Math.min(2, kn || (looksLikeKnowledgePoint(trimmed) ? 1 : 0));
      } else {
        kScore = looksLikeKnowledgePoint(trimmed) && words >= 4 ? 1 : 0;
        var found = detectCaseContext(trimmed, { valid: opts.targetAppKeywords || [], ao2Max: 1 }).found;
        appScore = found.length > 0 ? 1 : 0;
        anScore = qtype === "paper1_4m" ? 0 : (hasClearBusinessConsequenceChain(trimmed).passed ? 1 : 0);
      }
    }
    var maxSubtotal = maxSubtotalFor(role, qtype);
    var credited = [kScore ? "K" : "", appScore ? "App" : "", anScore ? "An" : "", evalScore ? "Eval" : ""].filter(Boolean);
    return {
      paragraph_number: index + 1, role: role, isolated_quote: trimmed,
      k_score: kScore, app_score: appScore, an_score: anScore, eval_score: evalScore,
      subtotal: kScore + appScore + anScore + evalScore, max_subtotal: maxSubtotal,
      critique: credited.length
        ? "Deterministic CIE 0264 paragraph audit (AI backfill): credited " + credited.join(" + ") + "."
        : "Deterministic CIE 0264 paragraph audit (AI backfill): no creditable AO evidence inside this paragraph."
    };
  }
  /* Maps one parsed model row (object or compact tuple) into a clamped,
   * subtotal-recomputed audit item. Header-only source segments always zero. */
  function normalizeParsedParagraphRow(row, pi, segments, qtype) {
    var k = 0, app = 0, an = 0, ev = 0, critique = "", quote = segments[pi] || "";
    var role = "", levelRec = "", aiSubtotal = 0;
    if (Array.isArray(row)) {
      k = clampI(row[1], 0, 1); app = clampI(row[2], 0, 1);
      an = clampI(row[3], 0, 1); ev = clampI(row[4], 0, 3);
      critique = String(row[5] || "");
    } else if (row && typeof row === "object") {
      k = clampI(row.k_score, 0, 1); app = clampI(row.app_score, 0, 1);
      an = clampI(row.an_score, 0, 1); ev = clampI(row.eval_score, 0, 3);
      critique = String(row.critique || "");
      quote = String(row.isolated_quote || quote);
      role = String(row.role || "");
      levelRec = /^Level [0-3]$/.test(String(row.level_recommendation || "")) ? String(row.level_recommendation) : "";
      /* Accepted but never trusted: subtotals are always recomputed locally. */
      aiSubtotal = clampI(row.subtotal, 0, 12);
    }
    if (/^(?:P\d+|Paragraph\s*\d+)\s*:/i.test(quote)) quote = quote.replace(/^[^:]+:\s*/, "");
    var idx = clampI((row && row.paragraph_number) || pi + 1, 1, segments.length) - 1;
    var sourceSegment = segments[idx] || "";
    var header = isSectionHeaderOnlyLine(sourceSegment);
    var inferredConclusion = role === "conclusion" ||
      ((qtype === "paper1_8m" || qtype === "paper2_12m_b") &&
        (ev > 0 || CONCLUSION_HEADING_LIKE.test(quote)));
    var finalRole = role === "conclusion" || inferredConclusion ? "conclusion" :
      (role === "option" || qtype === "paper1_8m" || qtype === "paper2_12m_b") ? "option" : "body_point";
    if (finalRole === "conclusion" && qtype === "paper1_8m") {
      /* Paper 1 8-mark conclusion scores evaluation only (rubric 3+3+2). */
      k = 0; app = 0; an = 0;
    }
    if (header) { k = 0; app = 0; an = 0; ev = 0; }
    var subtotal = Math.min(maxSubtotalFor(finalRole, qtype), k + app + an + ev);
    return {
      paragraph_number: idx + 1, role: finalRole,
      isolated_quote: quote || sourceSegment,
      k_score: k, app_score: app, an_score: an, eval_score: ev,
      subtotal: subtotal, ai_subtotal: aiSubtotal, max_subtotal: maxSubtotalFor(finalRole, qtype),
      level_recommendation: levelRec,
      critique: header ? "Section header — 0 marks (no substantive 0264 content inside this line)." : critique
    };
  }
  /* Guarantees one clamped, subtotal-recomputed item per source segment:
   * model rows first, then header zeroing, then per-paragraph re-audit rows,
   * then deterministic backfill. Never discards what the model did produce. */
  function completeParagraphAudit(opts) {
    var segments = opts.segments || [];
    var parsedAudit = opts.audit || {};
    var qtype = opts.questionType || parsedAudit.question_type || "paper1_8m";
    if (!segments.length) return { question_type: qtype, paragraphs: [], overall_critique: parsedAudit.overall_critique || "" };
    var slots = [];
    for (var s = 0; s < segments.length; s++) slots.push(null);
    var rows = Array.isArray(parsedAudit.paragraphs) ? parsedAudit.paragraphs : [];
    for (var r = 0; r < rows.length; r++) {
      var item = normalizeParsedParagraphRow(rows[r], r, segments, qtype);
      var idx = item.paragraph_number - 1;
      if (idx >= 0 && idx < slots.length && !slots[idx]) slots[idx] = item;
    }
    /* Section-header zeroing: no inference call for these lines. */
    for (var h = 0; h < segments.length; h++) {
      if (!slots[h] && isSectionHeaderOnlyLine(segments[h])) slots[h] = zeroParagraphItem(h, segments[h], qtype);
    }
    /* Missing substantive slots: use re-audit rows if supplied, else backfill. */
    var reaudits = opts.reaudits || [];
    for (var q = 0; q < reaudits.length; q++) {
      var ri = clampI(reaudits[q].paragraph_number, 1, segments.length) - 1;
      if (ri >= 0 && ri < slots.length && !slots[ri]) {
        slots[ri] = normalizeParsedParagraphRow(reaudits[q], ri, segments, qtype);
      }
    }
    for (var m = 0; m < segments.length; m++) {
      if (!slots[m]) slots[m] = deterministicParagraphBackfill(m, segments[m], qtype, {
        targetAppKeywords: opts.targetAppKeywords || []
      });
    }
    /* Final pass: exactly one entry per source segment, scores clamped again. */
    var paragraphs = [];
    for (var f = 0; f < segments.length; f++) {
      var p = slots[f] || zeroParagraphItem(f, segments[f], qtype);
      var sub = clampI(p.k_score, 0, 2) + clampI(p.app_score, 0, 1) + clampI(p.an_score, 0, 1) + clampI(p.eval_score, 0, 3);
      paragraphs.push({
        paragraph_number: f + 1,
        role: p.role || conclusionRoleFor(segments[f], qtype),
        isolated_quote: segments[f],
        k_score: clampI(p.k_score, 0, 2), app_score: clampI(p.app_score, 0, 1),
        an_score: clampI(p.an_score, 0, 1), eval_score: clampI(p.eval_score, 0, 3),
        subtotal: Math.min(p.max_subtotal || maxSubtotalFor(p.role, qtype), sub),
        ai_subtotal: typeof p.ai_subtotal === "number" ? p.ai_subtotal : 0,
        max_subtotal: p.max_subtotal || maxSubtotalFor(p.role, qtype),
        level_recommendation: p.level_recommendation || "",
        critique: p.critique || ""
      });
    }
    return {
      question_type: qtype,
      paragraphs: paragraphs,
      level_recommendation: parsedAudit.level_recommendation || "",
      overall_critique: parsedAudit.overall_critique || "Paragraphs graded individually under Cambridge IGCSE Business (0264) Anti-Halo scoring."
    };
  }

  /* Rule pre-scan injected into the prompt (webllm.ts:820-852): give the model
   * the deterministic engine's verified facts so it cannot contradict them. */
  function formatRulePreScanForPrompt(text, effectiveWords) {
    var appDet = detectCaseContext(text, { valid: effectiveWords || [], ao2Max: 2 });
    var causal = scanCausalAnalysis(text);
    var ev = scanEvaluationKeywords(text);
    return [
      "DETERMINISTIC WEBSITE RULE ENGINE PRE-SCAN (MUST RESPECT THESE VERIFIED FACTS):",
      "- Case Application Target Keywords: " + ((effectiveWords || []).slice(0, 8).join(", ") || "None required (pure knowledge question)"),
      "- Detected Case Facts in Candidate Answer: " + (appDet.found.join(", ") || "NONE DETECTED") + " (AO2 Capped at 0?: " + (effectiveWords && effectiveWords.length && !appDet.passed ? "YES — assign AO2=0" : "NO") + ")",
      "- Causal Analysis Connectives Detected: strongChains=" + causal.strongChains + ", basicReasons=" + causal.basicReasons + ", matched=[" + causal.matched.slice(0, 6).join(", ") + "]",
      "- Evaluation Triggers Detected: judgmentCount=" + ev.judgmentCount + ", qualifierCount=" + ev.qualifierCount + ", matched=[" + ev.found.slice(0, 6).join(", ") + "]"
    ].join("\n");
  }

  /* Manual greedy generation for ONNX exports that lack KV-cache inputs.
   * Calling the model directly avoids Transformers.js generate(), which crashes
   * with "reading 'dims'" on a cache-less graph. It stops at the closing JSON
   * brace so output stays short, and re-arms the watchdog on every token. */
  function manualGenerate(pipe, prompt, opts) {
    opts = opts || {};
    var tok = pipe.tokenizer, model = pipe.model;
    var maxNew = clampI(opts.max_new_tokens || 220, 8, 360);
    var initial = Array.from(tok(prompt, { return_tensors: "pt" }).input_ids.data).map(Number);
    var ids = initial.slice();
    var streamer = opts.streamer;
    /* The prompt is prefilled with "{", so generation starts one level deep. */
    var depth = 1, seenOpen = true, done = false;
    return (async function () {
      var decoded = "";
      for (var step = 0; step < maxNew; step++) {
        var input = new tfModule.Tensor("int64", BigInt64Array.from(ids.map(BigInt)), [1, ids.length]);
        var mask = new tfModule.Tensor("int64", BigInt64Array.from(ids.map(function () { return 1n; })), [1, ids.length]);
        var out = await model({ input_ids: input, attention_mask: mask });
        var logits = out.logits, g = logits.data, vocab = logits.dims[2], seq = logits.dims[1];
        var off = (seq - 1) * vocab, best = 0, bv = -Infinity;
        for (var i = 0; i < vocab; i++) { var v = g[off + i]; if (v > bv) { bv = v; best = i; } }
        input.dispose(); mask.dispose(); logits.dispose();
        if (best === 151645 || best === 151643) break;
        ids.push(best);
        var piece = String(tok.decode([best], { skip_special_tokens: true }) || "");
        decoded += piece;
        if (streamer && typeof streamer.callback_function === "function") {
          try { streamer.callback_function(piece); } catch (e) {}
        }
        if (aiHeartbeat) { try { aiHeartbeat(); } catch (e) {} }
        for (var j = 0; j < piece.length; j++) {
          var c = piece.charAt(j);
          if (c === "{") { depth++; seenOpen = true; }
          else if (c === "}") { depth--; if (seenOpen && depth === 0) { done = true; break; } }
        }
        if (done) break;
      }
      return [{ generated_text: String(tok.decode(ids.slice(initial.length), { skip_special_tokens: true }) || "") }];
    })();
  }

  function markWithLocalAI(answer, info, statusFn) {
    function status(s) { if (statusFn) { try { statusFn(s); } catch (e) {} } }
    if (aiBusy) { status("The local AI is already marking an answer."); return null; }
    if (!aiReady || !generator) { status("Local AI not loaded — using the deterministic marker."); return null; }
    aiBusy = true;
    var marks = clampI(info.mark_value, 0, 20) || 8;
    var qtype = info.questionType || resolveQuestionType(marks, 1);
    var system = CAMBRIDGE_0264_SYSTEM_PROMPT;
    var cleanQuestion = String(info.question_text || "").replace(/\nContext\s*\/\s*Case\s*Scenario:[\s\S]*$/i, "").trim();
    var caseFacts = String(info.caseMainStem || "").trim();
    var keywords = (info.qwen_marking_keys || {}).valid_app_words || [];
    var effectiveWords = getActiveAppWords(keywords, caseFacts, 3);
    var schemeText = info.model_answer ? ("Model answer:\n" + String(info.model_answer)) : JSON.stringify(info.mark_scheme || {});
    var context = "RUBRIC: " + describeRubricForQuestionType(qtype) +
      "\nQUESTION (" + marks + " marks): " + cleanQuestion +
      (caseFacts ? "\nCASE STUDY FACTS (for verifying Application INSIDE each isolated paragraph):\n" + caseFacts.slice(0, 750) : "") +
      (keywords.length ? "\nTARGET CASE CONTEXT KEYWORDS (non-company-name facts): " + keywords.slice(0, 12).join(", ") : "") +
      "\n\nMARK SCHEME:\n" + schemeText +
      "\n\n" + formatRulePreScanForPrompt(String(answer || ""), effectiveWords);
    var segments = splitResponsePoints(answer);
    var simplePrompt = /^paper1_/.test(qtype) && segments.length <= 3 && String(answer || "").length <= 1000;
    var schemaExample = '{"question_type":"' + qtype + '","paragraphs":[{"paragraph_number":1,' +
      '"role":"body_point | option | conclusion","isolated_quote":"<exact text of paragraph 1>",' +
      '"k_score":0,"app_score":0,"an_score":0,"eval_score":0,"subtotal":0,' +
      '"critique":"<specific feedback for this paragraph>"}],' +
      '"level_recommendation":"Level 0 | Level 1 | Level 2 | Level 3",' +
      '"overall_critique":"<one sentence of advice>"}';
    var user = context + (simplePrompt
      ? "\n\nSTUDENT ANSWER (split into paragraphs and assess each isolated_quote separately):\n" + String(answer || "") +
        "\n\nReturn only this JSON object. Include one object per paragraph. Copy each paragraph into isolated_quote.\n" + schemaExample
      : "\n\nSTUDENT ANSWER (each numbered paragraph is one isolated_quote):\n" +
        segments.map(function (p, ix) { return "Paragraph " + (ix + 1) + ": " + p; }).join("\n\n") +
        '\n\nRespond with this JSON shape only:\n{"question_type":"' + qtype + '","paragraphs":[[1,1,0,0,0,"Add a specific case detail"]],"level_recommendation":"Level 0 | Level 1 | Level 2 | Level 3"}\n' +
        "Include one row for each numbered paragraph, with these columns in order:\n" +
        "[paragraph number, knowledge score, application score, analysis score, evaluation score, feedback of at most 8 words].\n" +
        "Do not copy the answer text into the JSON. Do not add other fields.");
    var messages = [{ role: "system", content: system }, { role: "user", content: user }];
    var prompt, streamer;
    var expired = false, settled = false, resolvePromise = null;
    var keepAlive = null, startedAt = 0;
    function cleanupGeneration() {
      clearMarkTimer();
      if (keepAlive !== null) { clearInterval(keepAlive); keepAlive = null; }
      aiHeartbeat = null;
      stopCriteria = null;
      braceStop = null;
      aiBusy = false;
    }
    function failGeneration(message) {
      if (settled) return;
      settled = true; expired = true;
      cleanupGeneration();
      streamFail();
      status(message);
      if (resolvePromise) resolvePromise(null);
    }
    function armMarkTimer() {
      clearMarkTimer();
      markTimer = setTimeout(function () {
        if (settled || expired) return;
        /* No worker: the ONNX/WebGPU call keeps running on the main thread, but
         * the UI, busy flag and deterministic fallback always recover. */
        failGeneration("Local AI marking failed (Local AI timed out. Reload the model to try again.) — using the deterministic marker.");
      }, MARK_TIMEOUT_MS);
    }
    try {
      prompt = generator.tokenizer.apply_chat_template(messages, {
        tokenize: false,
        add_generation_prompt: true,
        enable_thinking: false,
        chat_template: chatTemplate || INLINE_CHAT_TEMPLATE
      });
      /* Prefill the leading brace so the model starts inside the JSON object
       * (original webllm behaviour). extractJsonObject also accepts a full
       * object, so models that re-emit `{` remain compatible. */
      prompt += "{";
      braceStop = createBraceDepthTracker(1);
      if (tfModule && typeof tfModule.InterruptableStoppingCriteria === "function") {
        stopCriteria = new tfModule.InterruptableStoppingCriteria();
      }
      streamStart();
      streamer = new tfModule.TextStreamer(generator.tokenizer, {
        skip_prompt: true,
        skip_special_tokens: true,
        callback_function: function (token) { streamToken(token); }
      });
    } catch (e) {
      cleanupGeneration();
      streamFail();
      status("Local AI marking failed (" + (e && e.message ? e.message : "error") + ") — using the deterministic marker.");
      return null;
    }
    status("Local AI: marking your answer locally…");
    /* Manual decoding recomputes the whole prefix each step; keep it short.
     * The JSON audit fits comfortably in ~200 tokens. */
    var maxTokens = Math.min(200, Math.max(160, computeRecommendedMaxTokens(answer, qtype)));
    /* No streamer/stopping_criteria: on WebGPU they can prevent generate()
     * from resolving even after the final token. The keepalive interval below
     * handles the watchdog instead. */
    var genOpts = {
      max_new_tokens: maxTokens,
      do_sample: false,
      repetition_penalty: 1.1,
      return_full_text: false
    };

    /* One best-effort single-paragraph re-audit per missing substantive segment
     * (webllm.ts:751-802). Bounded to 3 calls and 60 s each; any failure falls
     * through to deterministic backfill. */
    function reauditMissing(missing) {
      var chain = Promise.resolve([]);
      for (var m = 0; m < missing.length && m < 3; m++) {
        chain = chain.then((function (mi) {
          return function (acc) {
            if (expired) return acc;
            try {
              var seg = segments[mi];
              var oneMessages = [
                { role: "system", content: system },
                { role: "user", content: context +
                  "\n\nSTUDENT PARAGRAPH " + (mi + 1) + " ONLY (assess this isolated_quote in a vacuum):\n" + seg +
                  "\n\nReturn one JSON object with a 'paragraphs' array containing exactly one row for paragraph " + (mi + 1) +
                  " with paragraph_number, role, isolated_quote, k_score, app_score, an_score, eval_score, subtotal, critique." }
              ];
              var onePrompt = generator.tokenizer.apply_chat_template(oneMessages, {
                tokenize: false, add_generation_prompt: true, enable_thinking: false,
                chat_template: chatTemplate || INLINE_CHAT_TEMPLATE
              }) + "{";
              var oneCriteria = (tfModule && typeof tfModule.InterruptableStoppingCriteria === "function")
                ? new tfModule.InterruptableStoppingCriteria() : null;
              var oneStreamer = new tfModule.TextStreamer(generator.tokenizer, {
                skip_prompt: true, skip_special_tokens: true,
                callback_function: function (token) { if (aiHeartbeat) { try { aiHeartbeat(); } catch (e) {} } }
              });
              var oneOpts = { max_new_tokens: 180, do_sample: false, repetition_penalty: 1.1, return_full_text: false };
              var reauditGen;
              try {
                reauditGen = generateValidJson(onePrompt, oneOpts, 3)["catch"](function () {
                  return manualGenerate(generator, onePrompt, oneOpts);
                });
              } catch (ge) { reauditGen = manualGenerate(generator, onePrompt, oneOpts); }
              return withTimeout(reauditGen, REAUDIT_TIMEOUT_MS, null).then(function (out) {
                if (expired || !out) return acc;
                var t = out && out[0] ? out[0].generated_text : "";
                var parsedOne = parseMarkJson(t);
                if (parsedOne && Array.isArray(parsedOne.paragraphs) && parsedOne.paragraphs.length) {
                  var row = parsedOne.paragraphs[0];
                  if (row && typeof row === "object") row.paragraph_number = mi + 1;
                  acc = acc.concat([row]);
                }
                return acc;
              }, function () { return acc; });
            } catch (e) { return acc; }
          };
        })(m));
      }
      return chain;
    }

    return new Promise(function (resolve) {
      resolvePromise = resolve;
      armMarkTimer();
      startedAt = Date.now();
      /* Re-arm the idle deadline while generation is still pending. Some WebGPU
       * runs produce no streamed tokens for a long time but are not stuck. */
      keepAlive = setInterval(function () {
        if (settled || expired) return;
        if (Date.now() - startedAt > MARK_TOTAL_MS) {
          failGeneration("Local AI marking failed (Local AI timed out. Reload the model to try again.) — using the deterministic marker.");
          return;
        }
        armMarkTimer();
      }, 15000);
      aiHeartbeat = armMarkTimer;
      /* Native generate() with no streamer/stopping criteria resolves reliably
       * for this q4 model; manual loop stays only as a fallback on rejection. */
      var generation;
      try {
        generation = generateValidJson(prompt, genOpts, 4)["catch"](function (ge) {
          return manualGenerate(generator, prompt, genOpts);
        });
      } catch (ge) {
        generation = manualGenerate(generator, prompt, genOpts);
      }
      /* One heartbeat-resettable deadline only (no second fixed timer): every
       * streamed token re-arms markTimer, so an actively generating model is
       * never timed out mid-response. */
      generation.then(function (output) {
        if (expired || settled) return;
        if (!output) { failGeneration("Local AI marking failed (Local AI timed out. Reload the model to try again.) — using the deterministic marker."); return; }
        var text = generatedTextOf(output);
        var parsed = parseMarkJson(text);
        if (parsed) {
          try { streamFinish(text.charAt(0) === "{" ? text : "{" + text); } catch (e) {}
        }
        if (!parsed || !Array.isArray(parsed.paragraphs) || !parsed.paragraphs.length) {
          failGeneration("Local AI marking failed (Local AI returned no usable assessment.) — using the deterministic marker.");
          return;
        }
        var missing = [];
        for (var i = 0; i < segments.length; i++) {
          var covered = false;
          for (var c = 0; c < parsed.paragraphs.length; c++) {
            var rowNum = clampI((parsed.paragraphs[c] && parsed.paragraphs[c].paragraph_number) || c + 1, 1, segments.length);
            if (rowNum === i + 1) { covered = true; break; }
          }
          if (!covered && !isSectionHeaderOnlyLine(segments[i])) missing.push(i);
        }
        reauditMissing(missing).then(function (reaudits) {
          if (expired || settled) return;
          var audit = completeParagraphAudit({
            segments: segments, audit: parsed, questionType: qtype,
            reaudits: reaudits, targetAppKeywords: effectiveWords
          });
          var paragraphs = [];
          for (var pi = 0; pi < audit.paragraphs.length; pi++) {
            var p = audit.paragraphs[pi];
            paragraphs.push({
              paragraph_number: p.paragraph_number, role: p.role,
              isolated_quote: p.isolated_quote,
              k_score: p.k_score, app_score: p.app_score, an_score: p.an_score, eval_score: p.eval_score,
              subtotal: p.subtotal, max_subtotal: p.max_subtotal,
              level_recommendation: p.level_recommendation, critique: p.critique
            });
          }
          cleanupGeneration();
          try { streamFinish(text.charAt(0) === "{" ? text : "{" + text); } catch (e) {}
          var result = autoMark(answer, info, paragraphs);
          result.isAiEvaluated = true;
          result.examinerNotes = "[ Local Qwen 3 0.6B + deterministic caps ] " + result.examinerNotes;
          result.feedback = result.examinerNotes;
          status("Local AI: answer marked with local AI + deterministic caps.");
          settled = true;
          resolve(result);
        })["catch"](function (err) {
          failGeneration("Local AI marking failed (" + (err && err.message ? err.message : "error") + ") — using the deterministic marker.");
        });
      })["catch"](function (err) {
        failGeneration("Local AI marking failed (" + (err && err.message ? err.message : "error") + ") — using the deterministic marker.");
      });
    });
  }

  /* ================================================================ */
  /* View                                                              */
  /* ================================================================ */

  function resultHtml(r, usedAi) {
    var h = '<section class="ec-question" style="border-color:var(--ec-green)">';
    h += '<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:baseline;justify-content:space-between">';
    h += '<h2 style="margin:0">Practice mark: ' + esc(r.totalScore) + ' / ' + esc(r.maxMarks) + ' <span class="ec-meta">(' + esc(r.percentage) + '%)</span></h2>';
    h += '<span class="ec-note" style="margin:0">' + esc(r.level) + '</span></div>';
    h += '<p class="ec-meta" style="text-transform:none;letter-spacing:0;margin:8px 0"><strong>Instant Examiner</strong> · ' + esc(r.levelDescription || (usedAi ? "Local AI assisted, Instant Examiner caps enforced." : "Instant Examiner rule engine.")) + '</p>';

    h += '<table style="width:100%;border-collapse:collapse;margin:12px 0">';
    h += '<thead><tr><th style="text-align:left;border-bottom:1px solid var(--ec-line);padding:6px">Assessment Objective</th><th style="text-align:left;border-bottom:1px solid var(--ec-line);padding:6px">Mark</th><th style="text-align:left;border-bottom:1px solid var(--ec-line);padding:6px">Feedback</th></tr></thead><tbody>';
    var aoNames = [["ao1", "AO1 · Knowledge"], ["ao2", "AO2 · Application"], ["ao3", "AO3 · Analysis"], ["ao4", "AO4 · Evaluation"]];
    for (var i = 0; i < aoNames.length; i++) {
      var a = r.aoBreakdown[aoNames[i][0]] || { score: 0, max: 0, feedback: "" };
      h += '<tr><td style="padding:6px;border-bottom:1px solid var(--ec-line)"><strong>' + aoNames[i][1] + '</strong></td>' +
        '<td style="padding:6px;border-bottom:1px solid var(--ec-line)">' + esc(a.score) + ' / ' + esc(a.max) + '</td>' +
        '<td style="padding:6px;border-bottom:1px solid var(--ec-line)">' + esc(a.feedback) + '</td></tr>';
    }
    h += '</tbody></table>';

    function list(title, arr) {
      if (!arr || !arr.length) return "";
      var s = '<p style="margin:10px 0 4px"><strong>' + title + '</strong></p><ul style="margin:0;padding-left:20px">';
      for (var j = 0; j < arr.length; j++) s += '<li>' + esc(arr[j]) + '</li>';
      return s + '</ul>';
    }
    h += list("Strengths", r.strengths);
    h += list("How to improve", r.improvements);
    /* Original vocabulary (§4.4): senior examiner notes + explicit next steps. */
    h += '<div class="ec-note" style="margin-top:12px"><strong>Senior Examiner Notes &amp; Recommendations</strong><p>' + esc(r.examinerNotes) + '</p></div>';
    h += list("Key Next Steps:", r.improvements);

    if (r.paragraphAudits && r.paragraphAudits.length) {
      h += '<details class="ec-detail" style="margin-top:10px"><summary>Paragraph-by-paragraph audit</summary><ul style="padding-left:18px">';
      for (var p = 0; p < r.paragraphAudits.length; p++) {
        var pa = r.paragraphAudits[p];
        h += '<li>P' + esc(pa.paragraph_number) + ': ' + esc(pa.subtotal) + '/3 — ' + esc(pa.critique) +
          (pa.app_words_found && pa.app_words_found.length ? ' <em>Applied: ' + esc(pa.app_words_found.slice(0, 3).join(", ")) + '</em>' : '') + '</li>';
      }
      h += '</ul></details>';
    }
    var re = r.ruleEnforcement || {};
    if (re.ruleNotes && re.ruleNotes.length) {
      h += '<details class="ec-detail"><summary>Rules applied (AO caps, duplicates, case facts)</summary><ul style="padding-left:18px">';
      for (var n = 0; n < re.ruleNotes.length; n++) h += '<li>' + esc(re.ruleNotes[n]) + '</li>';
      h += '</ul></details>';
    }
    if (r.modelAnswerSnippet) h += '<details class="ec-detail"><summary>Model answer / mark scheme extract</summary><p>' + esc(r.modelAnswerSnippet) + '</p></details>';
    h += '<p class="ec-meta" style="margin-top:12px;text-transform:none;letter-spacing:0">Practice feedback generated on this device. It is not an official Cambridge grade or examiner judgement.</p>';
    h += '</section>';
    return h;
  }

  function renderView(main) {
    main.innerHTML =
      '<section class="ec-page">' +
        '<h1>AI Marker <span class="ec-meta">practice feedback</span></h1>' +
        '<div style="border-left:4px solid #b45309;background:#fffbeb;color:#7c2d12;padding:10px 14px;border-radius:8px;margin:10px 0 16px">' +
          '<strong>Practice feedback only — not an official grade.</strong> This marker uses the Instant Examiner (Cambridge 0264 rules) and, optionally, a local AI model downloaded to your device. Marks are indicative; always check the mark scheme and your teacher’s judgement.' +
        '</div>' +
        /* Background download banner: amber / sky with helper text and size. */
        '<div id="ec-ai-bg-banner" class="ec-banner" style="display:none;border-left:4px solid #0284c7;background:#f0f9ff;color:#0c4a6e;padding:10px 14px;border-radius:8px;margin:10px 0">' +
          '<strong id="ec-ai-bg-size">Preparing Qwen 3 0.6B (~650 MB)…</strong> ' +
          '<span id="ec-ai-bg-device">' + esc(deviceReason()) + '</span>' +
          '<p style="margin:6px 0 0" id="ec-ai-bg-help">Downloading in the background — you can still click Submit anytime to mark immediately with Instant CIE 0264 Examiner!</p>' +
        '</div>' +
        '<div class="ec-question">' +
          '<label for="ec-ai-answer"><strong>Your answer</strong></label>' +
          '<textarea id="ec-ai-answer" class="ec-answer" placeholder="Paste your full exam answer here (2–12 mark question)…" rows="9"></textarea>' +
          '<div class="ec-toolbar">' +
            '<label>Question type <select id="ec-ai-type">' +
              '<option value="paper1_2m">Paper 1 · 2 marks (knowledge)</option>' +
              '<option value="paper1_4m">Paper 1 · 4 marks</option>' +
              '<option value="paper1_6m">Paper 1 · 6 marks</option>' +
              '<option value="paper1_8m">Paper 1 · 8 marks</option>' +
              '<option value="paper2_8m_a">Paper 2 (a) · 8 marks (levels)</option>' +
              '<option value="paper2_12m_b">Paper 2 (b) · 12 marks (levels)</option>' +
            '</select></label>' +
            '<button type="button" id="ec-ai-run" class="ec-btn">Mark my answer</button>' +
            '<button type="button" id="ec-ai-dl" class="ec-btn ghost">Download local AI (optional)</button>' +
            '<button type="button" id="ec-ai-ai-run" class="ec-btn ghost" disabled>Mark with local AI</button>' +
          '</div>' +
          '<p id="ec-ai-status" class="ec-meta" style="text-transform:none;letter-spacing:0">Local AI: not loaded — instant deterministic marker is active.</p>' +
          '<progress id="ec-ai-progress" max="100" value="0" style="width:100%;display:none"></progress>' +
          '<div id="ec-ai-stream" class="ec-detail" aria-live="polite" style="white-space:pre-wrap;display:none"></div>' +
          '<div id="ec-ai-file-notice" class="ec-banner" hidden>Open this page over HTTP/HTTPS (GitHub Pages, Netlify or python -m http.server) to use the browser AI — browsers block ES module imports and the Cache API on file:// URLs.</div>' +
          '<details class="ec-detail"><summary>Optional: question text, case facts &amp; model answer (improve accuracy)</summary>' +
            '<p><label>Question text<br><input id="ec-ai-q" type="text" style="width:100%;padding:8px" placeholder="e.g. Explain two benefits of division of labour…"></label></p>' +
            '<p><label>Case facts for application (comma separated)<br><input id="ec-ai-app" type="text" style="width:100%;padding:8px" placeholder="e.g. mill, loggers, $250,000, 4%"></label></p>' +
            '<p><label>Case main stem<br><textarea id="ec-ai-case" class="ec-answer" rows="3" placeholder="Paste the case scenario facts…"></textarea></label></p>' +
            '<p><label>Model answer / mark scheme extract<br><textarea id="ec-ai-model" class="ec-answer" rows="3" placeholder="Paste the official model answer or key mark-scheme points…"></textarea></label></p>' +
          '</details>' +
        '</div>' +
        '<div id="ec-ai-result" aria-live="polite"></div>' +
      '</section>';
    updateFileNotice();

    var answerEl = document.getElementById("ec-ai-answer");
    var typeEl = document.getElementById("ec-ai-type");
    var qEl = document.getElementById("ec-ai-q");
    var appEl = document.getElementById("ec-ai-app");
    var caseEl = document.getElementById("ec-ai-case");
    var modelEl = document.getElementById("ec-ai-model");
    var statusEl = document.getElementById("ec-ai-status");
    var resultEl = document.getElementById("ec-ai-result");
    var runBtn = document.getElementById("ec-ai-run");
    var dlBtn = document.getElementById("ec-ai-dl");
    var aiRunBtn = document.getElementById("ec-ai-ai-run");

    function setStatus(s) { if (statusEl) statusEl.textContent = s; }
    function info() {
      var t = typeEl ? typeEl.value : "paper1_8m";
      var m = /12m/.test(t) ? 12 : (/8m/.test(t) ? 8 : (/6m/.test(t) ? 6 : (/4m/.test(t) ? 4 : 2)));
      var words = appEl ? String(appEl.value || "").split(",").map(function (x) { return x.trim(); }).filter(Boolean) : [];
      return {
        questionType: t,
        mark_value: m,
        paper: /^paper2/.test(t) ? 2 : 1,
        question_text: qEl ? qEl.value : "",
        caseMainStem: caseEl ? caseEl.value : "",
        model_answer: modelEl ? modelEl.value : "",
        mark_scheme: {},
        qwen_marking_keys: { valid_app_words: words }
      };
    }
    function answerText() { return answerEl ? answerEl.value : ""; }
    function setResult(html) { if (resultEl) resultEl.innerHTML = html; }
    function show(r, usedAi) {
      if (!r) { setResult('<div class="ec-banner">Marking failed. Please try again — the Instant Examiner is always available.</div>'); return; }
      setResult(resultHtml(r, usedAi));
    }
    function run(useAi) {
      var ans = answerText();
      if (!ans.trim()) { setResult('<div class="ec-banner">Please paste an answer first.</div>'); return; }
      /* Busy guard: never launch a second generation while one is in flight. */
      if (useAi && aiBusy) { setStatus("The local AI is already marking an answer."); return; }
      try {
        if (useAi && aiReady) {
          markWithLocalAI(ans, info(), setStatus).then(function (r) { show(r || autoMark(ans, info()), !!r); });
        } else {
          show(autoMark(ans, info()), false);
        }
      } catch (e) {
        try { show(autoMark(ans, info()), false); }
        catch (e2) { setResult('<div class="ec-banner">Could not mark this answer: ' + esc(e2 && e2.message ? e2.message : e2) + '</div>'); }
      }
    }
    if (runBtn) runBtn.addEventListener("click", function () { run(false); });
    if (aiRunBtn) aiRunBtn.addEventListener("click", function () { run(true); });
    if (dlBtn) dlBtn.addEventListener("click", function () {
      if (aiBusy) { setStatus("The local AI is already marking an answer."); return; }
      dlBtn.disabled = true;
      dlBtn.textContent = "Downloading local AI…";
      loadLocalAI(function (s) {
        setStatus(s);
        if (!aiLoading && /unavailable/i.test(s)) {
          dlBtn.disabled = false;
          dlBtn.textContent = "Retry local AI download";
        }
      });
      setTimeout(function () { if (!aiLoading && !aiReady) { dlBtn.disabled = false; dlBtn.textContent = "Retry local AI download"; } }, 1500);
    });
    if (typeof document !== "undefined") {
      var btn = document.getElementById("ec-ai-ai-run");
      if (btn) btn.disabled = !aiReady;
    }
  }

  /* ================================================================ */
  /* Public API                                                        */
  /* ================================================================ */

  EC.autoMark = autoMark;
  EC.ai = {
    /* No-op while busy/loading — a second load or generation cannot be started. */
    load: function () { if (aiBusy || aiLoading) return; loadLocalAI(); },
    isReady: function () { return aiReady; },
    isLoading: function () { return aiLoading; },
    isBusy: function () { return aiBusy; },
    state: function () { return aiState; },
    onChange: function (fn) {
      if (typeof fn === "function") { aiListeners.push(fn); try { fn(aiState); } catch (e) {} }
    },
    reason: deviceReason
  };
  /* Original behaviour: a returning user with a cached model saw "AI ready"
   * without clicking anything. */
  if (window.location.protocol !== "file:" && EC.store && typeof EC.store.get === "function" && EC.store.get("qwen3_cached_v2", false)) {
    setTimeout(function () { loadLocalAI(); }, 1200);
  }
  EC.register("ai-marker", { title: "AI Marker", render: renderView });
})();

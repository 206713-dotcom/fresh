// Deterministic gatekeeper for the 0264 Paper 1 scenario-set database.
// Line-ported from the "Master Orchestrator" Python validation gate (Section 4),
// extended with the Section 2/3 audit rules that can be checked deterministically.
//
// Usage:
//   node scripts/validate-paper1.mjs                       # validate the bundled DB
//   node scripts/validate-paper1.mjs path/to/sets.json     # validate a staging file
//   node scripts/validate-paper1.mjs file.json --quiet     # only print failures
//
// Exit code 0 = all sets pass. Exit code 1 = at least one error was found.

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BLACKLIST_TERMS = [
  "boston matrix", "cash dog", "cash cow", "star product", "problem child",
  "question mark", "stratified sampling", "systematic sampling",
  "cluster sampling", "convenience sampling", "snowball sampling",
  "push strategy", "pull strategy", "ansoff", "porter",
  "swot", "pestle", "pest analysis", "mcgregor", "theory x", "theory y",
  "vroom", "expectancy theory", "mayo", "hawthorne", "adams equity",
  "mcclelland", "mintzberg", "belbin", "tuckman", "paternalistic",
  "hard hrm", "soft hrm", "zero-hours", "7 ps", "7ps", "physical evidence",
  "critical path", "network diagram", "decision tree", "expected monetary value",
  "economic order quantity", "buffer inventory", "gearing ratio",
  "inventory turnover", "trade receivables days", "trade payables days",
  "net present value", "internal rate of return", "payback period",
  "average rate of return", "arr calculation", "conglomerate",
];

const REQUIRED_UNITS = new Set([
  "Unit 1: Understanding Business Activity",
  "Unit 2: People in Business",
  "Unit 3: Marketing",
  "Unit 4: Operations Management",
  "Unit 5: Financial Information and Decisions",
  "Unit 6: External Influences on Business Activity",
]);

const UNIT_NUMBER = {
  "Unit 1: Understanding Business Activity": 1,
  "Unit 2: People in Business": 2,
  "Unit 3: Marketing": 3,
  "Unit 4: Operations Management": 4,
  "Unit 5: Financial Information and Decisions": 5,
  "Unit 6: External Influences on Business Activity": 6,
};

const PART_COMMANDS = {
  a: ["define", "identify", "outline", "state", "calculate"],
  b: ["explain", "outline", "calculate"],
  c: ["explain", "analyse", "analyze"],
  d: ["do you think", "consider"],
};

const args = process.argv.slice(2);
const quiet = args.includes("--quiet");
const target = args.find((a) => !a.startsWith("--"))
  ?? path.join(__dirname, "..", "src", "lib", "data", "paper1-database.json");

const raw = readFileSync(target, "utf8");
let waveData;
try {
  waveData = JSON.parse(raw);
} catch (err) {
  console.error(`FATAL: Cannot parse ${target}: ${err.message}`);
  process.exit(1);
}
if (!Array.isArray(waveData)) {
  console.error("FATAL: Top-level JSON value must be an array of scenario sets.");
  process.exit(1);
}

const seenIds = new Set();
const seenStemOpenings = new Set();
const errors = [];

for (const item of waveData) {
  const sid = item?.scenario_id ?? "UNKNOWN";
  const unit = item?.unit ?? "";
  const stem = item?.scenario_stem ?? "";
  const questions = Array.isArray(item?.questions) ? item.questions : [];

  // --- 1. Uniqueness, unit & ID/unit consistency -------------------------------
  if (seenIds.has(sid)) errors.push(`${sid}: Duplicate scenario_id`);
  seenIds.add(sid);
  if (!REQUIRED_UNITS.has(unit)) {
    errors.push(`${sid}: Invalid unit '${unit}'`);
  } else {
    const m = /^P1_U([1-6])_SET_(\d{2,3})$/.exec(sid);
    if (!m) {
      errors.push(`${sid}: scenario_id does not match pattern P1_U<unit>_SET_<NN>`);
    } else if (Number(m[1]) !== UNIT_NUMBER[unit]) {
      errors.push(`${sid}: scenario_id unit number ${m[1]} does not match declared unit`);
    }
  }
  const opening = stem.replace(/\s+/g, " ").trim().slice(0, 80).toLowerCase();
  if (seenStemOpenings.has(opening)) errors.push(`${sid}: Duplicate scenario_stem opening`);
  seenStemOpenings.add(opening);

  // --- 2. Stem paragraph & length check ---------------------------------------
  const paragraphs = stem.split("\n\n").map((p) => p.trim()).filter(Boolean);
  if (paragraphs.length !== 2) {
    errors.push(`${sid}: Stem has ${paragraphs.length} paragraph(s) (must be exactly 2 separated by \\n\\n)`);
  }
  const wc = stem.split(/\s+/).filter(Boolean).length;
  if (wc < 50 || wc > 85) {
    errors.push(`${sid}: Stem word count is ${wc} (must be 50-85)`);
  }
  // At least 3 quantitative figures (audit-tier check)
  const figures = stem.match(/\d[\d,.%$]*/g) ?? [];
  if (figures.length < 3) {
    errors.push(`${sid}: Stem contains only ${figures.length} quantitative figure(s) (must be >= 3)`);
  }

  // --- 3. Blacklist hallucination scan (word-boundary match) --------------------
  const fullBlob = JSON.stringify(item).toLowerCase();
  for (const term of BLACKLIST_TERMS) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`\\b${escaped}\\b`).test(fullBlob)) {
      errors.push(`${sid}: BLACKLISTED OUT-OF-SYLLABUS TERM DETECTED -> '${term}'`);
    }
  }

  // --- 4. Questions structure, tagging & mark-scheme check ----------------------
  if (questions.length !== 4) {
    errors.push(`${sid}: Expected 4 questions, found ${questions.length}`);
    continue;
  }

  const expectedParts = [["a", 2], ["b", 4], ["c", 6], ["d", 8]];
  const stemLower = stem.toLowerCase();

  for (const [idx, [expPart, expMarks]] of expectedParts.entries()) {
    const q = questions[idx] ?? {};
    const part = q.part;
    const marks = q.mark_value;
    const qt = (q.question_text ?? "").trim();
    const ans = q.model_answer ?? "";
    const ms = q.mark_scheme ?? {};
    const qmk = q.qwen_marking_keys ?? {};
    const appWords = Array.isArray(qmk.valid_app_words) ? qmk.valid_app_words : null;

    if (part !== expPart || marks !== expMarks) {
      errors.push(`${sid}: Question ${idx + 1} part/marks mismatch (part=${part}, mark_value=${marks})`);
    }

    // Command-word whitelist per part
    const firstWords = qt.toLowerCase().replace(/^[("']+/, "").slice(0, 22);
    const allowed = PART_COMMANDS[expPart] ?? [];
    if (!allowed.some((cmd) => firstWords.startsWith(cmd))) {
      errors.push(`${sid} part ${part}: question_text does not start with an allowed 0264 command word (${allowed.join(" / ")})`);
    }

    if (appWords === null) {
      errors.push(`${sid} part ${part}: valid_app_words must be an array`);
    } else if (part === "a") {
      if (appWords.length !== 0) errors.push(`${sid} part a: valid_app_words must be [] (found ${appWords.length})`);
      if (!Array.isArray(ms.knowledge_max_2)) errors.push(`${sid} part a: missing mark_scheme.knowledge_max_2 array`);
    } else {
      if (appWords.length < 5 || appWords.length > 9) {
        errors.push(`${sid} part ${part}: valid_app_words count ${appWords.length} out of range (5-9)`);
      }
      for (const w of appWords) {
        if (typeof w !== "string" || !stemLower.includes(String(w).toLowerCase())) {
          errors.push(`${sid} part ${part}: valid_app_word '${w}' NOT FOUND verbatim (case-insensitive) in scenario_stem`);
        }
      }
      // Mark-scheme sections present
      if (!Array.isArray(ms.knowledge_max_2)) errors.push(`${sid} part ${part}: missing mark_scheme.knowledge_max_2`);
      if (!Array.isArray(ms.application_max_2)) errors.push(`${sid} part ${part}: missing mark_scheme.application_max_2`);
      if (["c", "d"].includes(part) && !Array.isArray(ms.analysis_max_2)) {
        errors.push(`${sid} part ${part}: missing mark_scheme.analysis_max_2`);
      }
      if (part === "d" && !Array.isArray(ms.evaluation_max_2)) {
        errors.push(`${sid} part d: missing mark_scheme.evaluation_max_2`);
      }
    }

    // AO-tag accounting in the model answer
    const k = (ans.match(/\[k\]/g) ?? []).length;
    const app = (ans.match(/\[app\]/g) ?? []).length;
    const an = (ans.match(/\[an\]/g) ?? []).length;
    const ev = (ans.match(/\[eval\]/g) ?? []).length;
    if (part === "a") {
      if (k !== 0 || app !== 0 || an !== 0 || ev !== 0) {
        errors.push(`${sid} part a: model_answer must carry no [k]/[app]/[an]/[eval] tags`);
      }
      if (!/\[2\]|\[1\][\s\S]*\[1\]/.test(ans)) {
        errors.push(`${sid} part a: model_answer must end with [2] (or two [1] points)`);
      }
    } else if (part === "b") {
      if (k !== 2 || app !== 2) errors.push(`${sid} part b: must have exactly 2 [k] and 2 [app] (found ${k} [k], ${app} [app])`);
    } else if (part === "c") {
      if (k !== 2 || app !== 2 || an !== 2) errors.push(`${sid} part c: must have exactly 2 [k], 2 [app], 2 [an] (found ${k}/${app}/${an})`);
    } else if (part === "d") {
      if (k !== 2 || app !== 2 || an !== 2 || ev !== 2) {
        errors.push(`${sid} part d: must have exactly 2 [k], 2 [app], 2 [an], 2 [eval] (found ${k}/${app}/${an}/${ev})`);
      }
      if (!qmk.deterministic_rules) errors.push(`${sid} part d: missing qwen_marking_keys.deterministic_rules`);
    }
  }
}

const failedIds = [...new Set(errors.map((e) => (e.match(/P1_U\d_SET_\d+/) ?? ["UNKNOWN"])[0]))];
if (!quiet) {
  for (const e of errors) console.error("ERROR", e);
}
console.error(`\nGatekeeper result for ${target}`);
console.error(`Sets: ${waveData.length} | Failed sets: ${failedIds.length} | Errors: ${errors.length}`);
if (failedIds.length > 0) process.exit(1);
console.error("PASS: all sets are gatekeeper-clean.");
process.exit(0);

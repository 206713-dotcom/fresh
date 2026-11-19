// Targeted syllabus-compliance repairs, applied to the parsed JSON graph.
// Every replacement is asserted to occur exactly once per set (or counted globally).
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "src", "lib", "data", "paper1-database.json");
const data = JSON.parse(readFileSync(dbPath, "utf8"));

let totalReplacements = 0;
const replaceInString = (obj, oldStr, newStr) => {
  let count = 0;
  const walk = (node) => {
    if (node === null || node === undefined) return node;
    if (typeof node === "string") {
      const idx = node.indexOf(oldStr);
      if (idx !== -1) count++;
      return node.split(oldStr).join(newStr);
    }
    if (Array.isArray(node)) return node.map(walk);
    if (typeof node === "object") {
      for (const k of Object.keys(node)) node[k] = walk(node[k]);
    }
    return node;
  };
  walk(obj);
  return count;
};
const expect = (cond, label) => {
  if (!cond) throw new Error(`PATCH ASSERTION FAILED: ${label}`);
};

// ============ PHASE A: global, mechanical 9609-term removal ============
// Ordered: longer phrases first, catch-all last. Applied to the WHOLE database.
const GEARING_RULES = [
  [/ROCE and gearing analysis/gi, "ROCE and liquidity analysis"],
  [/gearing ratio[s]?/gi, "fixed-interest debt level"],
  [/financial gearing analysis/gi, "debt-versus-equity assessment"],
  [/financial gearing\/debt ratio/gi, "debt-versus-equity structure"],
  [/gearing financial leverage/gi, "reliance on loan capital"],
  [/gearing financial risk/gi, "fixed-interest financial risk"],
  [/gearing and interest/gi, "fixed-interest debt"],
  [/gearing risk/gi, "fixed-interest debt risk"],
  [/gearing pressure/gi, "debt pressure"],
  [/gearing burden/gi, "fixed-interest debt burden"],
  [/gearing cash strain/gi, "fixed-interest cash strain"],
  [/gearing analysis/gi, "debt-versus-equity analysis"],
  [/gearing\//gi, "debt/"],
  [/gearing/gi, "debt financing"],
];
let gearingCount = 0;
for (const item of data) {
  const walkStr = (node) => {
    if (typeof node === "string") {
      let s = node;
      for (const [re, repl] of GEARING_RULES) s = s.replace(re, repl);
      if (s !== node) gearingCount++;
      return s;
    }
    if (Array.isArray(node)) return node.map(walkStr);
    if (node && typeof node === "object") {
      for (const k of Object.keys(node)) node[k] = walkStr(node[k]);
    }
    return node;
  };
  walkStr(item);
}
// Remove "gearing" entries from valid_app_words arrays (now invalid after replacement)
let appWordRemovals = 0;
for (const item of data) {
  for (const q of item.questions ?? []) {
    const arr = q?.qwen_marking_keys?.valid_app_words;
    if (Array.isArray(arr)) {
      const before = arr.length;
      q.qwen_marking_keys.valid_app_words = arr.filter((w) => String(w).toLowerCase() !== "gearing");
      appWordRemovals += before - q.qwen_marking_keys.valid_app_words.length;
    }
  }
}
console.log(`gearing: replaced in ${gearingCount} string fields; removed ${appWordRemovals} 'gearing' valid_app_words`);
totalReplacements += gearingCount + appWordRemovals;

// Payback period (U1_SET_16, U6_SET_32)
{
  const s16 = data.find((x) => x.scenario_id === "P1_U1_SET_16");
  expect(s16, "P1_U1_SET_16 missing");
  expect(replaceInString(s16, "uncertain payback periods", "uncertain returns") === 1, "U1_SET_16 payback replace");
  const s32 = data.find((x) => x.scenario_id === "P1_U6_SET_32");
  expect(s32, "P1_U6_SET_32 missing");
  expect(replaceInString(s32, "considering payback period", "considering the time needed to recover the investment") === 1, "U6_SET_32 payback replace");
}

// Inventory turnover (U5_SET_01, U5_SET_28)
{
  const s01 = data.find((x) => x.scenario_id === "P1_U5_SET_01");
  expect(s01, "P1_U5_SET_01 missing");
  expect(replaceInString(s01, "fast inventory turnover to pay suppliers", "fast-selling inventory to pay suppliers") === 1, "U5_SET_01 inventory replace");
  const s28 = data.find((x) => x.scenario_id === "P1_U5_SET_28");
  expect(s28, "P1_U5_SET_28 missing");
  expect(replaceInString(s28, "Fast inventory turnover", "Fast-selling inventory") >= 1, "U5_SET_28 inventory replace");
}
console.log("PHASE A complete.");
writeFileSync(dbPath, JSON.stringify(data, null, 2) + "\n");
console.log("Wrote", dbPath);

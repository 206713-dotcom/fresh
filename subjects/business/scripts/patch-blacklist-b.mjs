// Phase B: rewrites of 9609 marketing-theory leaks (Boston Matrix, push/pull)
// and unapproved sampling methods (stratified -> quota). Operates on the parsed
// JSON graph; every replacement is asserted.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "src", "lib", "data", "paper1-database.json");
const data = JSON.parse(readFileSync(dbPath, "utf8"));

const get = (id) => {
  const s = data.find((x) => x.scenario_id === id);
  if (!s) throw new Error(`Set ${id} not found`);
  return s;
};
const replaceInObject = (obj, oldStr, newStr) => {
  let count = 0;
  const walk = (node) => {
    if (typeof node === "string") {
      const occurrences = node.split(oldStr).length - 1;
      count += occurrences;
      return node.split(oldStr).join(newStr);
    }
    if (Array.isArray(node)) return node.map(walk);
    if (node && typeof node === "object") {
      for (const k of Object.keys(node)) node[k] = walk(node[k]);
    }
    return node;
  };
  walk(obj);
  return count;
};
const expectReplace = (obj, oldStr, newStr, minCount, label) => {
  const n = replaceInObject(obj, oldStr, newStr);
  if (n < minCount) throw new Error(`PATCH ASSERTION FAILED: ${label} (expected >=${minCount}, got ${n})`);
  console.log(`  [${label}] replaced ${n}`);
};
const getQuestion = (s, part) => s.questions.find((q) => q.part === part);
const setAppWords = (s, part, words) => {
  getQuestion(s, part).qwen_marking_keys.valid_app_words = words;
};
const setField = (s, part, field, value) => {
  getQuestion(s, part)[field] = value;
};

// ============ P1_U3_SET_04 (stratified -> quota) ============
{
  const s = get("P1_U3_SET_04");
  expectReplace(s, "or stratified sampling targeting existing buyers of organic and dairy-free food products", "or quota sampling targeting a set number of buyers from each organic and dairy-free segment", 1, "SET_04 stem");
  expectReplace(s, "stratified sampling", "quota sampling", 1, "SET_04 residual stratified");
  expectReplace(s, "stratified", "quota", 1, "SET_04 appwords c");
  expectReplace(s, "Stratified sampling", "Quota sampling", 1, "SET_04 model_answer d");
  // any remaining occurrences of 'stratified' anywhere in the set
  if (JSON.stringify(s).toLowerCase().includes("stratified")) throw new Error("SET_04 still contains 'stratified'");
  console.log("  SET_04 OK");
}

// ============ P1_U3_SET_05 (Boston Matrix removal) ============
{
  const s = get("P1_U3_SET_05");
  expectReplace(s, "According to the Boston Matrix, the product risks turning into a cash dog. ", "If sales keep falling at this rate, the product could be withdrawn from sale. ", 1, "SET_05 stem Boston sentence");
  if (/boston|cash dog/i.test(JSON.stringify(s))) throw new Error("SET_05 still contains Boston/cash dog");
  console.log("  SET_05 OK");
}

// ============ P1_U3_SET_10 (push/pull removal) ============
{
  const s = get("P1_U3_SET_10");
  expectReplace(s, "executing a 'pull' strategy focused on television advertisements and social media video campaigns targeted directly at parents and gift buyers, or implementing a 'push' strategy offering trade discounts and point-of-sale display units to retail toy shop owners.", "launching television advertisements and social media video campaigns aimed directly at parents and gift buyers, or using retailer-focused promotions offering trade discounts and point-of-sale display units to toy shop owners.", 1, "SET_10 stem");
  setField(s, "c", "question_text", "Explain two benefits to this business of using retailer-focused promotions, such as trade discounts and point-of-sale displays, aimed at toy shops.");
  expectReplace(s, "'pull' promotional strategy", "consumer-facing promotion", 1, "SET_10 d question 'pull'");
  expectReplace(s, "'push' promotional strategy", "retailer-focused promotion", 1, "SET_10 d question 'push'");
  expectReplace(s, "retailer push incentives", "retailer incentives", 1, "SET_10 eval_max_2");
  expectReplace(s, "'pull' strategy", "consumer-facing promotion", 2, "SET_10 answer 'pull'");
  expectReplace(s, "'push' strategy", "retailer-focused promotion", 1, "SET_10 answer 'push'");
  setAppWords(s, "c", ["trade discounts", "toy shops", "wooden", "building blocks", "promotions", "display"]);
  setAppWords(s, "d", ["toys", "wooden", "parents", "discounts", "building blocks", "$250,000", "promotions", "display"]);
  if (/pull|push/i.test(JSON.stringify(s).replace(/push\s*-?\s*back/gi, ""))) {
    const t = JSON.stringify(s); const tl = t.toLowerCase(); let i = -1;
    while ((i = tl.search(/pull|push/g)) >= 0) { console.log("   residual:", t.slice(Math.max(0, i - 60), i + 40)); break; }
    throw new Error("SET_10 still contains pull/push");
  }
  console.log("  SET_10 OK");
}

// ============ P1_U3_SET_15 ============
{
  const s = get("P1_U3_SET_15");
  expectReplace(s, "According to the Boston Matrix, the product risks becoming a cash dog. ", "If sales continue to fall, the product may have to be discontinued. ", 1, "SET_15 stem Boston sentence");
  if (/boston|cash dog/i.test(JSON.stringify(s))) throw new Error("SET_15 still contains Boston/cash dog");
  console.log("  SET_15 OK");
}

// ============ P1_U3_SET_16 ============
{
  const s = get("P1_U3_SET_16");
  expectReplace(s, "According to the Boston Matrix, its loose-leaf tea line operates as a Cash Cow, generating strong cash inflows to fund a new Question Mark product line of canned iced teas.", "Its established loose-leaf tea line generates strong, stable cash inflows that fund the launch of a new line of canned iced teas.", 1, "SET_16 stem");
  setField(s, "b", "question_text", "Explain two benefits to this business of having an established product line that generates strong, stable cash inflows.");
  expectReplace(s, "launch the Question Mark line of canned iced teas [app].", "launch the new line of canned iced teas [app].", 1, "SET_16 b answer");
  expectReplace(s, "Question Mark line", "canned iced teas launch", 1, "SET_16 b application_max_2");
  setAppWords(s, "b", ["tea", "loose-leaf", "iced tea", "canned iced teas", "$2.4m", "cash inflows"]);
  if (/boston|cash cow|question mark/i.test(JSON.stringify(s))) throw new Error("SET_16 still contains Boston/Cash Cow/Question Mark");
  console.log("  SET_16 OK");
}

// ============ P1_U3_SET_28 (stratified -> quota) ============
{
  const s = get("P1_U3_SET_28");
  expectReplace(s, "conduct stratified consumer surveys across target urban demographics", "conduct quota consumer surveys across targeted urban demographic groups", 1, "SET_28 stem");
  expectReplace(s, "stratified", "quota", 4, "SET_28 residual stratified");
  if (JSON.stringify(s).toLowerCase().includes("stratified")) throw new Error("SET_28 still contains 'stratified'");
  console.log("  SET_28 OK");
}

// ============ P1_U3_SET_29 ============
{
  const s = get("P1_U3_SET_29");
  expectReplace(s, "According to the Boston Matrix, the earbud line risks becoming a cash dog. ", "If sales continue to fall, the earbud line may be withdrawn from the market. ", 1, "SET_29 stem Boston sentence");
  expectReplace(s, "prevent its earbuds from becoming a cash dog", "extend the product life cycle of its earbuds", 1, "SET_29 c question");
  if (/boston|cash dog/i.test(JSON.stringify(s))) throw new Error("SET_29 still contains Boston/cash dog");
  console.log("  SET_29 OK");
}

// ============ P1_U3_SET_30 (full Boston rewrite) ============
{
  const s = get("P1_U3_SET_30");
  // part a: re-scope to a compliant definition question
  setField(s, "a", "question_text", "Define the term 'market share'.");
  setField(s, "a", "model_answer", "The proportion of total market sales held by one business or product [2].");
  getQuestion(s, "a").mark_scheme = { knowledge_max_2: ["proportion/percentage of total market sales", "held by one business or product"] };
  expectReplace(s, "According to the Boston Matrix, its traditional apple sparkling juice operates as a Cash Cow generating steady cash inflows, while its new passionfruit soda is a Question Mark holding a low 2% market share in a rapidly growing segment.", "Its traditional apple sparkling juice generates steady cash inflows, while its new passionfruit soda holds only a 2% market share in a rapidly growing segment.", 1, "SET_30 stem");
  setField(s, "b", "question_text", "Explain two characteristics of an established product line that generates strong, steady cash inflows for this beverage company.");
  setField(s, "c", "question_text", "Explain two benefits to this firm of using cash flows from its established apple juice line to support the passionfruit soda launch.");
  setAppWords(s, "b", ["apple", "juice", "passionfruit", "sparkling", "bottles", "cash inflows"]);
  setAppWords(s, "c", ["apple", "passionfruit", "juice", "embossing", "soda", "cash inflows"]);
  if (/boston|cash cow|question mark|problem child/i.test(JSON.stringify(s))) {
    const m = JSON.stringify(s).toLowerCase().match(/boston[^"]*|cash cow[^"]*|question mark[^"]*|problem child[^"]*/i);
    throw new Error("SET_30 still contains: " + (m ? m[0] : "unknown"));
  }
  if (/boston|cash cow|question mark|problem child/i.test(JSON.stringify(s))) {
    const residual = JSON.stringify(s).toLowerCase().match(/boston|cash cow|question mark|problem child/i);
    throw new Error("SET_30 still contains: " + residual[0]);
  }
  console.log("  SET_30 OK");
}

// ============ P1_U3_SET_35 (push/pull removal) ============
{
  const s = get("P1_U3_SET_35");
  expectReplace(s, "executing a 'pull' strategy focused on targeted social media video ads and consumer coupon giveaways, or implementing a 'push' strategy offering trade discounts and floor display units to retail toy shop buyers.", "executing a targeted social media advertising campaign with consumer coupon giveaways aimed directly at parents and gift buyers, or using retailer-focused promotions offering trade discounts and floor display units to toy shop buyers.", 1, "SET_35 stem");
  setField(s, "c", "question_text", "Explain two benefits to this business of using retailer-focused promotions, such as trade discounts, with toy shops.");
  setField(s, "d", "question_text", "Do you think a consumer-facing social media advertising campaign is a better promotional strategy for this toy business than retailer-focused promotions? Justify your answer.");
  expectReplace(s, "retailer push incentives", "retailer incentives", 1, "SET_35 eval_max_2");
  expectReplace(s, "shopkeeper push", "retailer promotion", 1, "SET_35 c knowledge");
  expectReplace(s, "'pull' strategy", "consumer-facing promotion", 2, "SET_35 answer 'pull'");
  expectReplace(s, "'push' strategy", "retailer-focused promotion", 1, "SET_35 answer 'push'");
  setAppWords(s, "c", ["trade discounts", "toy shops", "wooden", "building blocks", "promotions", "display"]);
  setAppWords(s, "d", ["toys", "wooden", "parents", "discounts", "building blocks", "$280,000", "social media"]);
  if (/push|pull/i.test(JSON.stringify(s))) throw new Error("SET_35 still contains push/pull");
  console.log("  SET_35 OK");
}

// ============ P1_U3_SET_37 ============
{
  const s = get("P1_U3_SET_37");
  expectReplace(s, "targeted sampling and trade push incentives", "targeted sampling and trade incentives", 1, "SET_37 eval_max_2");
  if (/push incentives|push strategy|pull strategy/i.test(JSON.stringify(s))) throw new Error("SET_37 still contains push/pull marketing terms");
  console.log("  SET_37 OK");
}

writeFileSync(dbPath, JSON.stringify(data, null, 2) + "\n");
console.log("Phase B complete. Wrote", dbPath);

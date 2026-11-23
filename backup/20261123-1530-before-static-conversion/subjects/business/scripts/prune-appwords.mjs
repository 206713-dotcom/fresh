// Deterministic pre-repair: from every part b/c/d valid_app_words, drop entries
// that are NOT verbatim (case-insensitive) substrings of the scenario_stem.
// Parts that end up under-filled (<5) are listed in appwords-underfilled.txt for
// the repair agents to rebuild.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "src", "lib", "data", "paper1-database.json");
const data = JSON.parse(readFileSync(dbPath, "utf8"));

let droppedTotal = 0;
const underfilled = [];
for (const item of data) {
  const stemLower = (item.scenario_stem ?? "").toLowerCase();
  for (const q of item.questions ?? []) {
    if (q.part === "a") continue;
    if (!Array.isArray(q?.qwen_marking_keys?.valid_app_words)) continue;
    const before = q.qwen_marking_keys.valid_app_words.length;
    const kept = q.qwen_marking_keys.valid_app_words.filter((w) => stemLower.includes(String(w).toLowerCase()));
    droppedTotal += before - kept.length;
    q.qwen_marking_keys.valid_app_words = kept;
    if (kept.length < 5) underfilled.push(`${item.scenario_id} part ${q.part}: ${kept.length} valid words remain (was [${q.qwen_marking_keys.valid_app_words.join(", ")}])`);
  }
}

writeFileSync(dbPath, JSON.stringify(data, null, 2) + "\n");
writeFileSync(path.join(__dirname, "..", "..", "err-appwords-underfilled.txt"), underfilled.join("\n") + "\n");
// also emit a stats line
console.log(`Dropped ${droppedTotal} non-verbatim valid_app_words; ${underfilled.length} part(s) need agent rebuild.`);

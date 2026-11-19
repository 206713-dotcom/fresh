// One-off mechanical repair: stems that were stored as a single paragraph are
// split into exactly two paragraphs at the sentence boundary nearest to ~68 words
// into the stem. No other content is altered.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "src", "lib", "data", "paper1-database.json");
const data = JSON.parse(readFileSync(dbPath, "utf8"));

let fixed = 0;
for (const item of data) {
  const stem = item.scenario_stem ?? "";
  if (stem.split("\n\n").filter((p) => p.trim()).length === 2) continue;

  const sentences = stem.split(/(?<=[.!?])\s+(?=[A-Z(])/);
  if (sentences.length < 2) continue;

  const wc = (s) => s.split(/\s+/).filter(Boolean).length;
  const target = 68;
  let best = 1, bestDist = Infinity, acc = 0;
  for (let i = 0; i < sentences.length - 1; i++) {
    acc += wc(sentences[i]);
    const dist = Math.abs(acc - target);
    if (dist < bestDist) { bestDist = dist; best = i + 1; }
  }
  item.scenario_stem = sentences.slice(0, best).join(" ") + "\n\n" + sentences.slice(best).join(" ");
  fixed++;
}

writeFileSync(dbPath, JSON.stringify(data, null, 2) + "\n");
console.log(`Split ${fixed} single-paragraph stems into two paragraphs.`);

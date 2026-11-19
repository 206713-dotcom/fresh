// Splits the CURRENT master DB into 9 staging files (U2/U4/U5 split in halves)
// and writes per-staging error logs from the validate-paper1.mjs output at err4.log.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const staging = path.join(root, "data-staging");
mkdirSync(staging, { recursive: true });
const dbPath = path.join(root, "src", "lib", "data", "paper1-database.json");
const data = JSON.parse(readFileSync(dbPath, "utf8"));

const buckets = {
  "unit-1.json": (n) => n === 1,
  "unit-2a.json": (n, s) => n === 2 && s <= 20,
  "unit-2b.json": (n, s) => n === 2 && s > 20,
  "unit-3.json": (n) => n === 3,
  "unit-4a.json": (n, s) => n === 4 && s <= 20,
  "unit-4b.json": (n, s) => n === 4 && s > 20,
  "unit-5a.json": (n, s) => n === 5 && s <= 20,
  "unit-5b.json": (n, s) => n === 5 && s > 20,
  "unit-6.json": (n) => n === 6,
};
const setNum = (id) => Number(id.match(/_SET_(\d+)/)[1]);

const manifest = {};
for (const [file, pred] of Object.entries(buckets)) {
  const sets = data.filter((s) => pred(Number(s.unit.match(/Unit (\d)/)[1]), setNum(s.scenario_id)));
  writeFileSync(path.join(staging, file), JSON.stringify(sets, null, 2) + "\n");
  manifest[file] = sets.map((s) => s.scenario_id);
  console.log(file, sets.length, "sets");
}
writeFileSync(path.join(staging, "manifest.json"), JSON.stringify(manifest, null, 2));

const errLog = readFileSync(process.argv[2] ?? path.join(root, "err4.log"), "utf8");
const byFile = new Map(Object.keys(buckets).map((f) => [f, []]));
for (const line of errLog.split(/\r?\n/)) {
  const m = line.match(/^ERROR (P1_U([1-6])_SET_(\d+))/);
  if (!m) continue;
  const n = Number(m[2]), s = Number(m[3]);
  for (const [file, pred] of Object.entries(buckets)) {
    if (pred(n, s)) { byFile.get(file).push(line); break; }
  }
}
for (const [file, lines] of byFile) {
  const out = path.join(staging, file.replace(".json", ".errors.txt"));
  writeFileSync(out, lines.join("\n") + "\n");
  console.log(out, lines.length, "errors");
}

// Final assembly: merges master 240 + every gen/gen-*.json into the 600-set
// Paper 1 database. Asserts id uniqueness and per-unit counts, sorts by unit
// then set number, writes src/lib/data/paper1-database.json.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dbPath = path.join(root, "src", "lib", "data", "paper1-database.json");
const staging = path.join(root, "data-staging", "gen");

const master = JSON.parse(readFileSync(dbPath, "utf8"));
const genFiles = readdirSync(staging).filter((f) => /^gen-u[1-6]-[a-f]\.json$/.test(f)).sort();
if (genFiles.length !== 36) {
  console.error(`FATAL: expected 36 gen files, found ${genFiles.length}: ${genFiles.join(", ") || "none"}`);
  process.exit(1);
}

const genSets = [];
for (const f of genFiles) {
  const arr = JSON.parse(readFileSync(path.join(staging, f), "utf8"));
  if (!Array.isArray(arr)) { console.error(`FATAL: ${f} is not a JSON array`); process.exit(1); }
  console.log(f, arr.length, "sets");
  genSets.push(...arr);
}

const all = [...master, ...genSets];
const ids = all.map((s) => s.scenario_id);
const seen = new Set();
const dups = [];
for (const id of ids) { if (seen.has(id)) dups.push(id); seen.add(id); }
if (dups.length) { console.error("FATAL: duplicate ids:", dups); process.exit(1); }

const byUnit = new Map();
for (const s of all) {
  const n = Number(s.unit.match(/Unit (\d)/)[1]);
  byUnit.set(n, (byUnit.get(n) ?? 0) + 1);
}
const unitReport = [1, 2, 3, 4, 5, 6].map((n) => `Unit ${n}: ${byUnit.get(n) ?? 0}`).join(" | ");
console.log("Per-unit counts:", unitReport);
if ([...byUnit.values()].some((v) => v !== 100) || byUnit.size !== 6) {
  console.error("FATAL: per-unit count is not 100 for every unit — refusing to write.");
  process.exit(1);
}

const setNum = (id) => Number(id.match(/_SET_(\d+)/)[1]);
const unitNum = (s) => Number(s.unit.match(/Unit (\d)/)[1]);
all.sort((a, b) => unitNum(a) - unitNum(b) || setNum(a.scenario_id) - setNum(b.scenario_id));

// First-80-char opening uniqueness across the WHOLE database
const openings = new Map();
const openingDups = [];
for (const s of all) {
  const key = (s.scenario_stem ?? "").replace(/\s+/g, " ").trim().slice(0, 80).toLowerCase();
  if (openings.has(key)) openingDups.push([openings.get(key), s.scenario_id]);
  else openings.set(key, s.scenario_id);
}
if (openingDups.length) {
  console.error("WARNING: duplicate 80-char stem openings (must be reworded):", openingDups);
  process.exit(2);
}

writeFileSync(dbPath, JSON.stringify(all, null, 2) + "\n");
console.log(`\nWrote ${all.length} sets into ${dbPath}`);

// Final assembly wave 2: merges master (currently 600 sets) + every
// gen/gen-*.json (target: 60 files, 600 new sets) into the 1,200-set
// Paper 1 database. Asserts id uniqueness, per-unit count = 200, and no
// duplicate 80-char stem openings; refuses to write otherwise.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dbPath = path.join(root, "src", "lib", "data", "paper1-database.json");
const staging = path.join(root, "data-staging", "gen");

const master = JSON.parse(readFileSync(dbPath, "utf8"));
const genFiles = readdirSync(staging).filter((f) => /^gen-u[1-6]-[a-f][12]?\.json$/.test(f)).sort();
console.log(`master: ${master.length} sets | gen files found: ${genFiles.length}`);
if (genFiles.length !== 60) {
  console.error(`FATAL: expected 60 gen files, found ${genFiles.length}`);
  process.exit(1);
}

const genSets = [];
for (const f of genFiles) {
  const arr = JSON.parse(readFileSync(path.join(staging, f), "utf8"));
  if (!Array.isArray(arr)) { console.error(`FATAL: ${f} is not a JSON array`); process.exit(1); }
  genSets.push(...arr);
}

const all = [...master, ...genSets];
// id uniqueness check
const ids = all.map((s) => s.scenario_id);
const counts = new Map();
for (const id of ids) counts.set(id, (counts.get(id) ?? 0) + 1);
const duplicateIds = [...counts].filter(([, n]) => n > 1).map(([id]) => id);
if (duplicateIds.length) { console.error("FATAL: duplicate ids:", duplicateIds); process.exit(1); }

const byUnit = new Map();
for (const s of all) byUnit.set(Number(s.unit.match(/Unit (\d)/)[1]), (byUnit.get(Number(s.unit.match(/Unit (\d)/)[1])) ?? 0) + 1);
const unitReport = [1, 2, 3, 4, 5, 6].map((n) => `Unit ${n}: ${byUnit.get(n) ?? 0}`).join(" | ");
console.log("Per-unit counts:", unitReport);
const target = 200;
if ([...byUnit.values()].some((v) => v !== target) || byUnit.size !== 6) {
  console.error(`FATAL: per-unit count is not ${target} for every unit — refusing to write.`);
  process.exit(1);
}

const setNum = (id) => Number(id.match(/_SET_(\d+)/)[1]);
const unitNum = (s) => Number(s.unit.match(/Unit (\d)/)[1]);
all.sort((a, b) => unitNum(a) - unitNum(b) || setNum(a.scenario_id) - setNum(b.scenario_id));

const openings = new Map();
const openingDups = [];
for (const s of all) {
  const key = (s.scenario_stem ?? "").replace(/\s+/g, " ").trim().slice(0, 80).toLowerCase();
  if (openings.has(key)) openingDups.push([openings.get(key), s.scenario_id]);
  else openings.set(key, s.scenario_id);
}
if (openingDups.length) {
  console.error("FATAL: duplicate 80-char stem openings:", openingDups);
  process.exit(2);
}

writeFileSync(dbPath, JSON.stringify(all, null, 2) + "\n");
console.log(`\nWrote ${all.length} sets into ${dbPath}`);

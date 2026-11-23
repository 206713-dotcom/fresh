// Merges repaired staging unit files back into the master DB.
// Usage: node subjects/business/scripts/merge-staging.mjs
// Reads data-staging/unit-{1,2a,2b,3,4a,4b,5a,5b,6}.json, concatenates (ordered by
// scenario_id), writes src/lib/data/paper1-database.json, and reports counts.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const staging = path.join(root, "data-staging");
const dbPath = path.join(root, "src", "lib", "data", "paper1-database.json");

const original = JSON.parse(readFileSync(dbPath, "utf8"));
const pieces = ["unit-1.json", "unit-2a.json", "unit-2b.json", "unit-3.json", "unit-4a.json", "unit-4b.json", "unit-5a.json", "unit-5b.json", "unit-6.json"];
const merged = [];
for (const p of pieces) {
  const full = path.join(staging, p);
  let arr;
  try {
    arr = JSON.parse(readFileSync(full, "utf8"));
  } catch (err) {
    console.error(`FATAL: cannot parse ${full}: ${err.message}`);
    process.exit(1);
  }
  merged.push(...arr);
}

// sanity: id uniqueness, count match
const ids = merged.map((s) => s.scenario_id);
const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
const origIds = new Set(original.map((s) => s.scenario_id));
const mergedIds = new Set(ids);
const missing = [...origIds].filter((id) => !mergedIds.has(id));
const added = [...mergedIds].filter((id) => !origIds.has(id));
if (dup.length) { console.error("FATAL: duplicate ids after merge:", dup); process.exit(1); }
if (missing.length) { console.error("FATAL: missing ids:", missing); process.exit(1); }
if (added.length) { console.error("FATAL: unexpected new ids:", added); process.exit(1); }
if (merged.length !== original.length) { console.error(`FATAL: count mismatch ${merged.length} vs ${original.length}`); process.exit(1); }

// Preserve original database order (sort by unit then set number)
const setNum = (id) => Number(id.match(/_SET_(\d+)/)[1]);
const unitNum = (s) => Number(s.unit.match(/Unit (\d)/)[1]);
merged.sort((a, b) => unitNum(a) - unitNum(b) || setNum(a.scenario_id) - setNum(b.scenario_id));

writeFileSync(dbPath, JSON.stringify(merged, null, 2) + "\n");
console.log(`Merged ${merged.length} sets into ${dbPath}`);

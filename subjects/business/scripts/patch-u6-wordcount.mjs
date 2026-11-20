import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "src", "lib", "data", "paper1-database.json");
const db = JSON.parse(readFileSync(dbPath, "utf8"));

const expansions = {
  "P1_U6_SET_186": (stem) => stem.replace("a workshop service manager.", "a workshop service manager and sells through 4 dealer partners."),
  "P1_U6_SET_187": (stem) => stem + " Competition from online rivals is intensifying.",
  "P1_U6_SET_188": (stem) => stem + " The partnership's banker asked for a forecast by Friday.",
  "P1_U6_SET_189": (stem) => stem + " The firm plans to exhibit at the trade fair in March.",
};

for (const [id, fn] of Object.entries(expansions)) {
  const idx = db.findIndex((s) => s.scenario_id === id);
  if (idx === -1) throw new Error(`${id} not found`);
  const before = db[idx].scenario_stem;
  const after = fn(before);
  if (after === before) throw new Error(`${id}: expansion produced no change`);
  db[idx].scenario_stem = after;
  console.log(id, "words now:", after.split(/\s+/).filter(Boolean).length);
}
writeFileSync(dbPath, JSON.stringify(db, null, 2) + "\n");
console.log("Done.");

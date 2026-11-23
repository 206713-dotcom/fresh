// Splits the master DB into per-unit staging files and emits per-unit error logs
// (from validate-paper1.mjs output passed via stdin).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const data = JSON.parse(readFileSync(path.join(root, "src", "lib", "data", "paper1-database.json"), "utf8"));
const staging = path.join(root, "data-staging");
mkdirSync(staging, { recursive: true });

const unitNum = (u) => Number((u.match(/Unit (\d)/) ?? [null, "0"])[1]);
for (let n = 1; n <= 6; n++) {
  const unitSets = data.filter((s) => unitNum(s.unit) === n);
  writeFileSync(path.join(staging, `repair-unit-${n}.json`), JSON.stringify(unitSets, null, 2) + "\n");
  console.log(`unit ${n}: ${unitSets.length} sets`);
}

// Read full error log, split into per-unit files
const errLog = readFileSync(process.argv[2] ?? path.join(root, "err2.log"), "utf8");
const byUnit = new Map([[1, []], [2, []], [3, []], [4, []], [5, []], [6, []]]);
for (const line of errLog.split(/\r?\n/)) {
  const m = line.match(/^ERROR (P1_U([1-6])_SET_\d+)/);
  if (!m) continue;
  byUnit.get(Number(m[2])).push(line);
}
for (const [n, lines] of byUnit) {
  writeFileSync(path.join(staging, `errors-unit-${n}.txt`), lines.join("\n") + "\n");
  console.log(`unit ${n}: ${lines.length} errors`);
}

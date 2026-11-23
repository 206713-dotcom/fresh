// Generate pre-compressed copies of the static data banks for js/fast-load.js.
// Run from anywhere: node subjects/business/tools/compress-data.mjs
// Re-run whenever a JSON file in data/ changes. The original files are untouched.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const dataDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'data');
const outDir = join(dataDir, 'gz');
mkdirSync(outDir, { recursive: true });

let rawTotal = 0;
let gzipTotal = 0;
for (const file of readdirSync(dataDir)) {
  if (!file.endsWith('.json')) continue;
  const path = join(dataDir, file);
  if (!statSync(path).isFile()) continue;
  const raw = readFileSync(path);
  const gz = gzipSync(raw, { level: 9 });
  writeFileSync(join(outDir, file + '.gz'), gz);
  rawTotal += raw.length;
  gzipTotal += gz.length;
  console.log(`${file.padEnd(28)} ${(raw.length / 1048576).toFixed(2).padStart(7)} MB -> ${(gz.length / 1048576).toFixed(2).padStart(6)} MB`);
}
console.log(`TOTAL ${(rawTotal / 1048576).toFixed(2)} MB -> ${(gzipTotal / 1048576).toFixed(2)} MB`);

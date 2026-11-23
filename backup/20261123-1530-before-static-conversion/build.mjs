import { cpSync, mkdirSync, readdirSync, rmSync, existsSync } from "node:fs";
import path from "node:path";

// Static assembly only. Both subject sites are plain files in the repo:
// economics keeps its readable source in subjects/economics/, and business
// keeps its committed compiled bundle in subjects/business/assets/.
// Nothing here runs npm, Vite or any compiler.

const root = process.cwd();
const dist = path.join(root, "dist");

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

// Root static files
for (const f of [
  "index.html", "privacy.html", "404.html", "style.css", "home.css",
  "privacy.css", "privacy.js", "search.js", "fresh.svg",
  "CNAME", ".nojekyll", "metadata.json",
]) {
  const src = path.join(root, f);
  if (existsSync(src)) cpSync(src, path.join(dist, f));
}

// subjects/*.html — includes the no-build entry pages economics.html and business.html
const subjectsDir = path.join(root, "subjects");
const distSubjects = path.join(dist, "subjects");
mkdirSync(distSubjects, { recursive: true });
for (const f of readdirSync(subjectsDir)) {
  if (f.endsWith(".html")) {
    cpSync(path.join(subjectsDir, f), path.join(distSubjects, f));
  }
}

// subjects/economics/ — plain CSS/JS source, served as-is
const econDir = path.join(subjectsDir, "economics");
if (existsSync(econDir)) {
  cpSync(econDir, path.join(distSubjects, "economics"), { recursive: true });
}

// subjects/assets/ — compatibility copies of the two local PDFs linked from
// the business document archive by document-relative ./assets/aistudio/ URLs.
const compatAssets = path.join(subjectsDir, "assets");
if (existsSync(compatAssets)) {
  cpSync(compatAssets, path.join(distSubjects, "assets"), { recursive: true });
}

// subjects/business/ — committed static output only (no src/, node_modules, etc.)
const businessDir = path.join(subjectsDir, "business");
const distBusiness = path.join(distSubjects, "business");
mkdirSync(distBusiness, { recursive: true });
for (const f of ["Business.html", "index.html", "404.html"]) {
  const src = path.join(businessDir, f);
  if (existsSync(src)) cpSync(src, path.join(distBusiness, f));
}
cpSync(path.join(businessDir, "assets"), path.join(distBusiness, "assets"), { recursive: true });

console.log("Static site assembled: dist/ (no Vite/npm build required)");

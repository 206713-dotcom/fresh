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
  "privacy.css", "privacy.js", "search.js", "home.js", "fresh.svg",
  "CNAME", ".nojekyll", "metadata.json", "gis-points.css", "gis-points.js",
]) {
  const src = path.join(root, f);
  if (existsSync(src)) cpSync(src, path.join(dist, f));
}

// Subject entry pages and shared subject assets
const subjectsDir = path.join(root, "subjects");
const distSubjects = path.join(dist, "subjects");
mkdirSync(distSubjects, { recursive: true });
for (const f of readdirSync(subjectsDir)) {
  if (f.endsWith(".html") || ["fresh-home-link.css", "science.css", "science-loading.css", "science-loading.js", "study-tracks.css"].includes(f)) {
    cpSync(path.join(subjectsDir, f), path.join(distSubjects, f));
  }
}

// Static subject apps and their lesson data. The plain-file subject
// folders are copied as-is; subjects/business/ is assembled separately below
// so its React source/build tooling is never included in dist/.
for (const subject of ["biology", "chemistry", "design-and-technology", "economics", "mathquest", "physics", "pyquest", "vertex-maths"]) {
  const subjectDir = path.join(subjectsDir, subject);
  if (existsSync(subjectDir)) {
    cpSync(subjectDir, path.join(distSubjects, subject), { recursive: true });
  }
}

// subjects/assets/ — compatibility copies of the two local PDFs linked from
// the business document archive by document-relative ./assets/aistudio/ URLs.
const compatAssets = path.join(subjectsDir, "assets");
if (existsSync(compatAssets)) {
  cpSync(compatAssets, path.join(distSubjects, "assets"), { recursive: true });
}

// subjects/business/ — plain HTML/CSS/JS/data only (no React source or build files)
const businessDir = path.join(subjectsDir, "business");
const distBusiness = path.join(distSubjects, "business");
mkdirSync(distBusiness, { recursive: true });
for (const f of ["Business.html", "index.html", "404.html", "legacy.html", "style.css", "site.css"]) {
  const src = path.join(businessDir, f);
  if (existsSync(src)) cpSync(src, path.join(distBusiness, f));
}
for (const d of ["assets", "js", "data"]) {
  const src = path.join(businessDir, d);
  if (existsSync(src)) cpSync(src, path.join(distBusiness, d), { recursive: true });
}

console.log("Static site assembled: dist/ (no Vite/npm build required)");

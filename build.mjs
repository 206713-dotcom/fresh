import { execSync } from "node:child_process";
import { cpSync, mkdirSync, readdirSync, rmSync, existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const businessDir = path.join(root, "subjects", "business");
const businessDist = path.join(businessDir, "dist");

// 1. Build the Business Vite app
execSync("npm run build", { cwd: businessDir, stdio: "inherit" });

// 2. Assemble dist/
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

// Root static files
for (const f of ["index.html", "privacy.html", "404.html", "style.css", "home.css", "privacy.css", "privacy.js", "search.js", "fresh.svg"]) {
  const src = path.join(root, f);
  if (existsSync(src)) cpSync(src, path.join(dist, f));
}

// subjects/*.html
const subjectsDir = path.join(root, "subjects");
const distSubjects = path.join(dist, "subjects");
mkdirSync(distSubjects, { recursive: true });
for (const f of readdirSync(subjectsDir)) {
  if (f.endsWith(".html")) {
    cpSync(path.join(subjectsDir, f), path.join(distSubjects, f));
  }
}

// subjects/economics/
const econDir = path.join(subjectsDir, "economics");
if (existsSync(econDir)) {
  cpSync(econDir, path.join(distSubjects, "economics"), { recursive: true });
}

// Compiled business app
const distBusiness = path.join(distSubjects, "business");
mkdirSync(distBusiness, { recursive: true });
cpSync(businessDist, distBusiness, { recursive: true });

console.log("Build complete: dist/");

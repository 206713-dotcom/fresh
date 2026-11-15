// Post-build step for the static GitHub Pages deployment.
// `npm run build` compiles into dist/, then this script makes the built app the
// committed site root that GitHub Pages serves:
//   dist/index.html -> Business.html   (the file linked from the hub page)
//   dist/assets/    -> assets/         (compiled JS/CSS/images)
//   any other dist/ files (e.g. 404.html copied from public/) -> copied too
import { cpSync, copyFileSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

// Remove stale compiled assets from the previous build.
rmSync('assets', { recursive: true, force: true });

// Business.html is the compiled entry; index.html stays as the source template.
copyFileSync('dist/index.html', 'Business.html');

// Copy everything Vite emitted (assets/, 404.html, ...) into the site root.
for (const entry of readdirSync('dist')) {
  if (entry === 'index.html') continue;
  cpSync(join('dist', entry), join('.', entry), { recursive: true, force: true });
}

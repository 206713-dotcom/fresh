// Post-build step for the static GitHub Pages deployment.
// `npm run build` compiles into dist/, then this script makes the built app the
// committed site root that GitHub Pages serves:
//   dist/app.html   -> index.html and Business.html
//   dist/assets/    -> assets/         (compiled JS/CSS/images)
//   any other dist/ files (e.g. 404.html copied from public/) -> copied too
import { cpSync, copyFileSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { join } from 'node:path';

// Remove stale compiled assets from the previous build.
rmSync('assets', { recursive: true, force: true });

// Serve compiled JavaScript both from the directory URL and from existing Business.html links.
renameSync('dist/app.html', 'dist/index.html');
copyFileSync('dist/index.html', 'Business.html');

// Copy the compiled index, assets and the other public files into the Pages checkout.
for (const entry of readdirSync('dist')) {
  cpSync(join('dist', entry), join('.', entry), { recursive: true, force: true });
}

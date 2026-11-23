# Fast loading for the static Business app

Economics has no runtime data fetches — its content is baked into JS files loaded with `defer`.
Business deliberately externalised its banks into JSON (`data/*.json`), which is why practice
views show `Loading…` while ~82 MB is transferred and parsed.

This opt-in patch reduces the transfer to **~19 MB** (gzip) and warms the cache before the user
clicks. It does **not** modify `core.js`, `app.js`, any view, any existing data file, or any HTML
for you — you apply one script tag.

## 1. Generate compressed data

```sh
node subjects/business/tools/compress-data.mjs
```

This writes `subjects/business/data/gz/<name>.json.gz` for every `data/*.json`. Re-run whenever
the JSON changes. The original files remain untouched.

## 2. Enable the patch

**Already enabled** in `Business.html` and `index.html`: the line below sits after
`ai-marker.js` and before `app.js`. To add it manually to a fresh copy, insert:

```html
<script defer src="./js/fast-load.js"></script>
```

It must run after `core.js` (which defines `EC.load`) and before `app.js` (which calls
`EC.render()`). Do not add it to `legacy.html` — that page uses the old React bundle.

## 3. What it does

- Wraps `EC.load(name)` to fetch `./data/gz/<name>.json.gz` and decompress it in the browser with
  `DecompressionStream('gzip')`. Parsed results are cached exactly as before.
- Falls back automatically to the original `./data/<name>.json` when:
  - the browser has no `DecompressionStream` (older Safari/Firefox/Edge),
  - a `.gz` file is missing or fails to decompress,
  - or a fetch 404s.
- Warms small data files on idle after first paint, then the big banks (Paper 1, Paper 2, six MCQ
  banks) **only** when the network is not save-data/2G and the device reports ≥4 GB RAM. On
  low-end devices the big banks wait for user intent instead.
- On `pointerover`/`focusin` of a `[data-nav]` or `[data-ec-nav]` control, prefetches the data that
  view needs — usually seconds before the click.
- Serialises prefetches through a one-at-a-time queue so a low-end device is never hit by eight
  concurrent decompressions.

Measured sizes: Paper 1 31.0 → 5.7 MB, Paper 2 50.8 → 9.7 MB, six MCQ banks 16.3 → 3.4 MB.
Total 82 MB → 19 MB.

## 4. Caveats / verification

- `file://` will still fail (module/fetch/CORS); serve over `http://localhost:8000` or HTTPS.
- Prefetching only saves **network** time; the JSON still has to be parsed when a view opens.
  Parsing ~50 MB of JSON is the remaining cost on very weak CPUs. Splitting the banks into
  smaller per-section/per-case chunks would remove that too, but requires view changes.
- No service worker is included deliberately: caching 82 MB of decompressed data would consume
  storage on low-end devices. Add one later only if repeat visits need it.
- After enabling, open a practice view with DevTools → Network: expect requests for `.json.gz`
  files (200) and no `Loading…` delay on subsequent navigation within the same tab.

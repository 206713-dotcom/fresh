/* Optional instant-load patch for the static Business app. No build step at runtime.
 *
 * Install: load this file AFTER js/core.js and BEFORE js/app.js (see FAST-LOAD.md).
 * It wraps EC.load so compressed data is fetched from ./data/gz/<name>.json.gz and
 * decompressed in the browser (DecompressionStream), with automatic fallback to the
 * original ./data/<name>.json on older browsers or if a compressed file is missing.
 *
 * It also warms the cache: small files on idle, big banks only on capable devices,
 * and anything on hover/focus of a navigation control (user intent).
 *
 * The original core.js, app.js, view scripts and data files are NOT modified.
 */
(function () {
  "use strict";

  var EC = window.EC;
  if (!EC || typeof EC.load !== "function" || EC.__fastLoadInstalled) return;
  EC.__fastLoadInstalled = true;

  var originalLoad = EC.load;
  var textCache = Object.create(null);   // name -> Promise<string> (decompressed JSON text)
  var jsonCache = Object.create(null);   // name -> Promise<parsed JSON>
  var failed = Object.create(null);      // name -> true after a failed compressed fetch
  var gzipSupported = typeof DecompressionStream === "function" &&
    typeof ReadableStream === "function" && typeof Response === "function";

  /* ---------- compressed fetch + decompress ---------- */

  function fetchCompressedText(name) {
    return fetch("./data/gz/" + name + ".json.gz", { cache: "force-cache", priority: "low" })
      .then(function (response) {
        if (!response.ok || !response.body) throw new Error("compressed data unavailable");
        var stream = response.body.pipeThrough(new DecompressionStream("gzip"));
        return new Response(stream).text();
      });
  }

  function getText(name) {
    if (textCache[name]) return textCache[name];
    if (!gzipSupported) return Promise.reject(new Error("gzip unsupported"));
    textCache[name] = fetchCompressedText(name).then(function (text) {
      return text;
    }, function (err) {
      delete textCache[name];
      failed[name] = true;
      throw err;
    });
    return textCache[name];
  }

  /* ---------- EC.load replacement ---------- */

  function loadFast(name) {
    if (jsonCache[name]) return jsonCache[name];
    if (failed[name] || !gzipSupported) {
      jsonCache[name] = originalLoad(name);
      return jsonCache[name];
    }
    jsonCache[name] = getText(name).then(function (text) {
      return JSON.parse(text);
    })["catch"](function () {
      return originalLoad(name);
    });
    return jsonCache[name];
  }

  EC.load = loadFast;
  EC.fastLoad = {
    enabled: function () { return gzipSupported; },
    prefetch: function (name) { enqueue(name); },
    warm: function () { warmAll(); }
  };

  /* ---------- low-impact background warming ---------- */

  var MCQ = ["mcq-section1", "mcq-section2", "mcq-section3",
    "mcq-section4", "mcq-section5", "mcq-section6"];

  var SMALL = [
    "glossary", "syllabus-static", "syllabus-sections", "lessons",
    "compare-notes-static", "revision-summaries", "one-page-sheets",
    "verified-questions", "verified-p1-cases", "verified-p2-cases",
    "other-paper2-cases", "skin-tones", "hair-designs", "top-designs",
    "bottom-designs", "shoe-designs"
  ];
  var BIG = ["paper1", "paper2"].concat(MCQ);

  var NAV_DATA = {
    practice: ["paper1"], paper1: ["paper1"], "paper2": ["paper2"],
    mocks: ["paper1", "paper2"], quiz: MCQ, drill: MCQ,
    challenge: MCQ, "quick-quiz": MCQ, boss: MCQ,
    checklist: ["syllabus-static", "glossary"], glossary: ["glossary"],
    lessons: ["lessons"], compare: ["compare-notes-static", "revision-summaries"],
    progress: ["glossary", "syllabus-static"]
  };

  var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};
  var slowNetwork = !!connection.saveData || /(?:^|-)slow-2g$|2g/.test(connection.effectiveType || "");
  var lowMemory = typeof navigator.deviceMemory === "number" && navigator.deviceMemory < 4;

  var queue = [], running = false;

  function pump() {
    if (running || !queue.length) return;
    running = true;
    var name = queue.shift();
    getText(name).then(function () {
      running = false;
      pump();
    }, function () {
      failed[name] = true;
      running = false;
      pump();
    });
  }

  function enqueue(name) {
    if (!gzipSupported || !name || failed[name] || textCache[name] ||
        queue.indexOf(name) !== -1) return;
    queue.push(name);
    pump();
  }

  function whenIdle(fn) {
    if (typeof requestIdleCallback === "function") requestIdleCallback(fn, { timeout: 3000 });
    else setTimeout(fn, 1500);
  }

  function warmAll() {
    if (!gzipSupported) return;
    SMALL.forEach(enqueue);
    /* Big banks are ~19 MB compressed / 82 MB decompressed. Only warm them on
     * devices that can comfortably hold them; otherwise wait for user intent. */
    if (!slowNetwork && !lowMemory) BIG.forEach(enqueue);
  }

  whenIdle(warmAll);

  /* Navigation intent: start the relevant fetch as soon as a control is hovered
   * or focused, usually well before the click completes. */
  function onIntent(event) {
    var target = event && event.target;
    if (!target || typeof target.closest !== "function") return;
    var control = target.closest("[data-nav], [data-ec-nav]");
    if (!control) return;
    var name = control.getAttribute("data-nav") || control.getAttribute("data-ec-nav");
    (NAV_DATA[name] || []).forEach(enqueue);
  }

  document.addEventListener("pointerover", onIntent, { passive: true });
  document.addEventListener("focusin", onIntent);
})();

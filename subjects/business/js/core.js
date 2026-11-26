/* EcBiz static core — no frameworks, no build step. */
(function () {
  "use strict";

  var cache = {};
  var views = {};

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "class") node.className = attrs[k];
      else if (k === "html") node.innerHTML = attrs[k];
      else if (k === "text") node.textContent = attrs[k];
      else if (k.slice(0, 2) === "on" && typeof attrs[k] === "function") node.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== null && attrs[k] !== undefined && attrs[k] !== false) node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function load(name) {
    if (cache[name]) return cache[name];
    cache[name] = fetch("./data/" + name + ".json").then(function (r) {
      if (!r.ok) throw new Error("Cannot load " + name);
      return r.json();
    }, function (error) {
      /* Never retain a rejected promise: a transient failure must be retryable
         by revisiting the view instead of poisoning the cache for this session. */
      delete cache[name];
      throw error;
    });
    return cache[name];
  }

  /* Original app used snake_case keys; the static port used camelCase. Read the
   * legacy value when the current key is absent so saved progress survives. */
  var LEGACY_KEYS = {
    studyPos: "study_pos", studyFocusMins: "study_focus_mins",
    studyGhost: "study_ghost", studyMiniMode: "study_minimode",
    studyStreak: "study_streak", glossaryMastered: "mastered_terms",
    boss_max_ammo: "max_ammo", p1_studio_state: "practice_session_state",
    p2_position: "p2_last_position", coins: "study_coins"
  };

  /* Two aliases kept their key name but changed their object shape. When a
   * value is read through one of them, copy every original field first (so no
   * saved data is lost) and add the field names the static views actually read.
   * "as appropriate": practiceMode becomes the unit only when no selectedUnit
   * exists; a non-numeric scenarioId is kept under its original name. */
  var LEGACY_SHAPES = {
    p1_studio_state: function (o) {
      var out = {};
      Object.keys(o).forEach(function (k) { out[k] = o[k]; });
      if (out.unit === undefined) {
        if (o.selectedUnit !== undefined) out.unit = String(o.selectedUnit);
        else if (o.practiceMode !== undefined) out.unit = String(o.practiceMode);
      }
      if (out.activeId === undefined && o.activeScenarioId !== undefined) out.activeId = o.activeScenarioId;
      if (out.part === undefined && o.activePart !== undefined) out.part = o.activePart;
      return out;
    },
    p2_position: function (o) {
      var out = {};
      Object.keys(o).forEach(function (k) { out[k] = o[k]; });
      if (out.index === undefined && o.scenarioId !== undefined) {
        var v = o.scenarioId;
        var numeric = (typeof v === "number" && isFinite(v)) ||
          (typeof v === "string" && v !== "" && /^\d+$/.test(v));
        if (numeric) out.index = Number(v);
      }
      if (out.qidx === undefined && o.questionIdx !== undefined) out.qidx = o.questionIdx;
      return out;
    }
  };

  /* The static build has one model tier and one cached boolean. Older builds
   * stored a tier name under either legacy key; a truthy value means the
   * weights are already cached, so views should see qwen3_cached_v2 as true. */
  var LEGACY_TRUTHY_FLAGS = {
    qwen3_cached_v2: ["qwen3_cached_tier_v2", "qwen_preferred_tier"]
  };

  var store = {
    get: function (key, fallback) {
      try {
        var raw = localStorage.getItem("ecbiz_" + key);
        var usedLegacy = false;
        if (raw === null && LEGACY_KEYS[key]) {
          raw = localStorage.getItem("ecbiz_" + LEGACY_KEYS[key]);
          usedLegacy = raw !== null;
        }
        /* Original wrote scalar values as raw strings (e.g. "sepia"). Parse
         * JSON when possible, otherwise keep the raw string as the value. */
        var value, parsedOk = true;
        if (raw !== null) {
          try { value = JSON.parse(raw); } catch (e) { value = raw; parsedOk = false; }
        }
        /* A truthy legacy tier flag implies the single-tier cached boolean. */
        if (LEGACY_TRUTHY_FLAGS[key] && !value) {
          var flags = LEGACY_TRUTHY_FLAGS[key];
          for (var f = 0; f < flags.length; f++) {
            var flagRaw = localStorage.getItem("ecbiz_" + flags[f]);
            if (flagRaw === null) continue;
            var flagValue;
            try { flagValue = JSON.parse(flagRaw); } catch (e2) { flagValue = flagRaw; }
            if (flagValue) return true;
          }
        }
        if (raw === null) return fallback;
        if (!parsedOk) return value;
        if (usedLegacy && LEGACY_SHAPES[key] && value && typeof value === "object" && !Array.isArray(value)) {
          return LEGACY_SHAPES[key](value);
        }
        return value;
      } catch (e) { return fallback; }
    },
    set: function (key, value) {
      try { localStorage.setItem("ecbiz_" + key, JSON.stringify(value)); } catch (e) {}
    },
    del: function (key) {
      try { localStorage.removeItem("ecbiz_" + key); } catch (e) {}
    },
    keys: function () {
      var out = [];
      try {
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (k && k.indexOf("ecbiz_") === 0) out.push(k.slice(6));
        }
      } catch (e) {}
      return out;
    }
  };

  function register(name, definition) {
    views[name] = definition;
  }

  function navigate(name, params) {
    var query = "?open=" + encodeURIComponent(name);
    Object.keys(params || {}).forEach(function (k) {
      query += "&" + encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
    });
    history.replaceState(null, "", location.pathname + query);
    render();
  }

  var OPEN_ALIASES = {
    progress: "progress", dashboard: "progress", signin: "progress", "sign-in": "progress",
    signup: "progress", "sign-up": "progress"
  };
  var TAB_ALIASES = {
    progress: "progress", dashboard: "progress", signin: "progress", "sign-in": "progress",
    signup: "progress", "sign-up": "progress", overview: "overview", mocks: "mocks",
    checklist: "checklist", glossary: "glossary", lessons: "lessons", compare: "compare",
    practice: "practice", paper1: "practice", paper2: "paper2", quiz: "quiz", drill: "drill",
    "boss-battle": "boss-battle", boss: "boss-battle", "study-space": "study-space",
    studyspace: "study-space", sections: "sections", "chapter-sheets": "chapter-sheets",
    archive: "archive", review: "review", achievements: "achievements", avatar: "avatar",
    themes: "themes", flashcards: "flashcards", "ai-marker": "ai-marker", extras: "extras",
    sources: "sources", help: "help", export: "export", misc: "misc"
  };

  function current() {
    var params = new URLSearchParams(location.search);
    var name = params.get("open");
    if (!name && params.has("tab")) name = params.get("tab");
    if (!name) name = store.get("business_tab", "overview");
    name = OPEN_ALIASES[name] || TAB_ALIASES[name] || name;
    return { name: name, params: params };
  }

  function render() {
    var state = current();
    var view = views[state.name] || views.overview;
    /* The original app remembered the last VALID tab in ecbiz_business_tab. */
    if (views[state.name]) { try { store.set("business_tab", state.name); } catch (e) {} }
    var main = document.getElementById("main");
    if (!main || !view) return;
    main.innerHTML = '<p class="p-8">Loading…</p>';
    try {
      var result = view.render(main, state.params, state.name);
      if (result && typeof result.catch === "function") {
        result.catch(function (err) {
          main.innerHTML = '<div class="p-8 text-red-700">Could not load this section: ' + esc(err && err.message) + '</div>';
        });
      }
    } catch (err) {
      main.innerHTML = '<div class="p-8 text-red-700">Could not load this section: ' + esc(err && err.message) + '</div>';
    }
    document.querySelectorAll("[data-ec-nav]").forEach(function (a) {
      var active = a.getAttribute("data-ec-nav") === state.name;
      a.classList.toggle("ec-nav-active", active);
      if (active) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    if (window.EC && typeof window.EC.onRender === "function") {
      try { window.EC.onRender(state); } catch (e) {}
    }
  }

  var sharedPoints = window.FreshPoints;
  function points() { return sharedPoints.balance(); }
  function earnPoints(n, label, claim) {
    return sharedPoints.earn("Business", n, label || "Study reward", claim);
  }
  function spendPoints(n, label, purchase) {
    return sharedPoints.transaction("Business", function (wallet) {
      var records = purchase ? purchase() : {};
      if (!records || (n && !wallet.adjust(-n, label))) return false;
      Object.keys(records).forEach(function (name) { wallet.write("ecbiz_" + name, records[name]); });
      return true;
    }).catch(function () { return false; });
  }
  window.addEventListener(sharedPoints.changeEvent, function () {
    var next = points();
    document.querySelectorAll("[data-ec-coins]").forEach(function (node) { node.textContent = next; });
    document.querySelectorAll("[data-eb-coins]").forEach(function (node) {
      var balance = next + " GIS Points";
      node.textContent = "◎ " + balance;
      node.setAttribute("aria-label", balance);
    });
  });

  /* Pinned Transformers.js cache namespace for the 0264 weights. ai-marker.js
   * can call EC.aiCacheKey() (or coerce the helper) to set env.cacheKey so the
   * cached ONNX weights are reused. String coercion is supported for callers
   * that assign the helper directly. */
  var AI_CACHE_KEY = "transformers-cache-0264-v4";
  function aiCacheKey() { return AI_CACHE_KEY; }
  aiCacheKey.toString = function () { return AI_CACHE_KEY; };
  aiCacheKey.valueOf = function () { return AI_CACHE_KEY; };

  window.EC = {
    esc: esc, el: el, load: load, store: store, register: register,
    navigate: navigate, render: render, current: current, views: views,
    points: points, earnPoints: earnPoints, spendPoints: spendPoints, aiCacheKey: aiCacheKey,
    claimedPoints: function (claim) { return sharedPoints.hasClaim("Business", claim); }
  };
})();

(() => {
  "use strict";
  const key = "fresh:gis-points:v1";
  const changeEvent = "fresh:gis-points-change";
  const script = document.currentScript;
  const home = new URL("./", script.src);
  const points = value => {
    const amount = Number(value);
    return Number.isSafeInteger(amount) && amount > 0 ? amount : 0;
  };
  const format = new Intl.NumberFormat();
  const converted = "Previous balance converted";
  const subjects = [
    ["mathematics", "Mathematics", "mathematics.html", "Solve a maths practice question", "MathQuest", "Vertex Maths"],
    ["english-language", "First Language English", "english-language.html#practice", "Review a written answer"],
    ["english-literature", "Literature in English", "english-literature.html", "Complete a quick practice"],
    ["biology", "Biology", "biology.html", "Complete a revision lesson"],
    ["chemistry", "Chemistry", "chemistry.html", "Mark a lecture done"],
    ["physics", "Physics", "physics.html", "Mark a topic understood"],
    ["computer-science", "Computer Science", "pyquest/#igcse", "Answer an IGCSE question in PyQuest", "PyQuest"],
    ["design-and-technology", "Design & Technology", "design-and-technology/", "Answer questions in an RM Revise quiz", "RM Revise", "Design and Technology"],
    ["geography", "Geography", "geography.html", "Complete a quick practice"],
    ["history", "History", "history.html", "Complete a quick practice"],
    ["economics", "Economics", "economics.html#practice", "Answer a practice question"],
    ["business-studies", "Business Studies", "business.html?open=checklist", "Rate a checklist item", "Business"],
  ];
  const subjectIds = new Map();
  for (const [id, name, url, activity, ...aliases] of subjects) {
    for (const alias of [id, name, ...aliases]) subjectIds.set(alias, id);
  }

  function recordSubject(totals, subject, amount) {
    const id = subjectIds.get(subject);
    if (!id || !Number.isSafeInteger(amount) || !amount) return;
    const total = totals[id] ??= {earned: 0, spent: 0};
    const field = amount > 0 ? "earned" : "spent";
    total[field] = points(total[field]) + Math.abs(amount);
  }

  function migrateSubjects(state) {
    if (state.subjectTotals && typeof state.subjectTotals === "object" && !Array.isArray(state.subjectTotals)) return false;
    state.subjectTotals = {};
    for (const entry of state.recent) {
      if (entry && entry.label !== converted) recordSubject(state.subjectTotals, entry.subject, entry.amount);
    }
    return true;
  }
  function saved(key) {
    try { return JSON.parse(localStorage.getItem(key)); }
    catch { return null; }
  }

  function initialWallet() {
    const state = {balance: 0, earned: 0, claims: [], recent: [], subjectTotals: {}};
    const profiles = saved("pyquest-local-v1:profiles");
    const pythonIds = new Set(["local-learner", ...(Array.isArray(profiles)
      ? profiles.map(profile => profile?.uid).filter(id => typeof id === "string" && id.startsWith("local-"))
      : [])]);
    const python = [...pythonIds].reduce((total, id) =>
      total + points(saved("pyquest-local-v1:game:" + id)?.wallet?.coins), 0);
    const former = [
      ["Business", saved("ecbiz_study_coins") ?? saved("ecbiz_coins")],
      ["MathQuest", saved("mathquest.igcse.v1")?.wallet?.coins],
      ["PyQuest", python],
      ["RM Revise", saved("rmlocal_db")?.users?.[0]?.coins],
    ];
    former.forEach(([subject, value]) => {
      const amount = points(value);
      if (!amount) return;
      state.balance += amount;
      state.recent.push({subject, label: converted, amount});
    });
    return state;
  }

  function readWallet() {
    const state = saved(key);
    if (state && Number.isSafeInteger(state.balance) && state.balance >= 0 &&
        Array.isArray(state.claims) && Array.isArray(state.recent)) return state;
    return initialWallet();
  }

  function transaction(subject, action) {
    const apply = () => {
      const original = localStorage.getItem(key);
      const state = readWallet();
      const writes = new Map();
      const claims = new Set(state.claims);
      const migrated = migrateSubjects(state);
      let changed = original === null || migrated;

      const result = action({
        balance: () => state.balance,
        adjust(amount, label, claim) {
          if (!Number.isSafeInteger(amount) || !amount) return false;
          const claimKey = claim ? subject + "/" + claim : null;
          if (claimKey && claims.has(claimKey)) return false;
          const next = state.balance + amount;
          if (next < 0 || !Number.isSafeInteger(next)) return false;
          state.balance = next;
          if (amount > 0) state.earned += amount;
          recordSubject(state.subjectTotals, subject, amount);
          if (claimKey) claims.add(claimKey);
          state.recent = [{subject, label, amount}, ...state.recent].slice(0, 20);
          changed = true;
          return true;
        },
        write(storageKey, value) {
          writes.set(storageKey, JSON.stringify(value));
        }
      });

      if (changed) {
        state.claims = [...claims];
        writes.set(key, JSON.stringify(state));
      }
      const previous = [];
      try {
        for (const [storageKey, value] of writes) {
          const old = localStorage.getItem(storageKey);
          if (old === value) continue;
          localStorage.setItem(storageKey, value);
          previous.push([storageKey, old]);
        }
      } catch {
        for (const [storageKey, old] of previous.reverse()) {
          if (old === null) localStorage.removeItem(storageKey);
          else localStorage.setItem(storageKey, old);
        }
        throw new Error("Your browser couldn't save this change. Check its site storage settings.");
      }
      if (changed) queueMicrotask(() => window.dispatchEvent(new Event(changeEvent)));
      return result;
    };
    return navigator.locks ? navigator.locks.request(key, apply) : Promise.resolve().then(apply);
  }

  function earn(subject, amount, label, claim) {
    return transaction(subject, wallet => wallet.adjust(amount, label, claim)).catch(() => false);
  }

  window.FreshPoints = {
    key, changeEvent, transaction, earn,
    balance: () => readWallet().balance,
    hasClaim: (subject, claim) => readWallet().claims.includes(subject + "/" + claim)
  };
  window.addEventListener("storage", event => {
    if (event.key === key || event.key === null) window.dispatchEvent(new Event(changeEvent));
  });

  function mount() {
    let button = document.querySelector("[data-gis-points-trigger]");
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "gisp-button gisp-floating";
      button.innerHTML = '<span class="gisp-star" aria-hidden="true">✦</span><strong data-gisp-count>0</strong><span>GIS Points</span>';
      document.body.append(button);
    }
    button.setAttribute("aria-haspopup", "dialog");
    const balanceLabel = button.querySelector("[data-gisp-count]");

    const dialog = document.createElement("dialog");
    dialog.className = "gisp-dialog";
    dialog.setAttribute("aria-labelledby", "gisp-title");
    dialog.innerHTML = `
      <header class="gisp-header">
        <h2 id="gisp-title">GIS Points</h2>
        <form method="dialog"><button class="gisp-close" aria-label="Close GIS Points">×</button></form>
      </header>
      <div class="gisp-balance">
        <div><span>Available</span><strong data-gisp-balance>0</strong></div>
        <div><span>Earned on Fresh</span><strong data-gisp-earned>0</strong></div>
      </div>
      <p>Earn points by completing lessons and practice across Fresh. Use your balance in the subject shops.</p>
      <div class="gisp-views" role="group" aria-label="Points views">
        <button type="button" data-gisp-toggle="subjects" aria-pressed="true" aria-controls="gisp-by-subject">By subject</button>
        <button type="button" data-gisp-toggle="activity" aria-pressed="false" aria-controls="gisp-activity">Recent activity</button>
      </div>
      <section id="gisp-by-subject" data-gisp-view="subjects" aria-label="Points by subject">
        <table class="gisp-subject-table">
          <thead><tr><th scope="col">Subject</th><th scope="col">Earned</th><th scope="col">Spent</th></tr></thead>
          <tbody data-gisp-totals></tbody>
        </table>
        <p class="gisp-earlier" data-gisp-earlier hidden></p>
      </section>
      <section id="gisp-activity" data-gisp-view="activity" aria-labelledby="gisp-activity-title" hidden>
        <h3 id="gisp-activity-title">Recent activity</h3>
        <p data-gisp-empty>Finish a study activity to earn your first points.</p>
        <ol data-gisp-history></ol>
      </section>
      <footer><span>Saved in this browser</span><a data-gisp-subjects>Explore subjects →</a></footer>`;
    document.body.append(dialog);
    dialog.querySelector("[data-gisp-subjects]").href = new URL("#subjects", home);

    const totalsBody = dialog.querySelector("[data-gisp-totals]");
    const totalsCells = subjects.map(([id, name, url, activity]) => {
      const row = totalsBody.insertRow();
      const subject = document.createElement("th");
      subject.scope = "row";
      const link = document.createElement("a");
      link.href = new URL("subjects/" + url, home);
      link.textContent = name;
      link.addEventListener("click", () => dialog.close());
      const hint = document.createElement("small");
      hint.textContent = activity;
      subject.append(link, hint);
      row.append(subject);
      return {id, earned: row.insertCell(), spent: row.insertCell()};
    });
    const views = dialog.querySelectorAll("[data-gisp-view]");
    const toggles = dialog.querySelectorAll("[data-gisp-toggle]");
    for (const toggle of toggles) {
      toggle.addEventListener("click", () => {
        for (const item of toggles) item.setAttribute("aria-pressed", String(item === toggle));
        for (const view of views) view.hidden = view.dataset.gispView !== toggle.dataset.gispToggle;
      });
    }

    function render() {
      const state = readWallet();
      migrateSubjects(state);
      balanceLabel.textContent = format.format(state.balance);
      button.setAttribute("aria-label", format.format(state.balance) + " GIS Points. Open activity");
      if (!dialog.open) return;
      dialog.querySelector("[data-gisp-balance]").textContent = format.format(state.balance);
      dialog.querySelector("[data-gisp-earned]").textContent = format.format(points(state.earned));
      let attributed = 0;
      for (const {id, earned, spent} of totalsCells) {
        const total = state.subjectTotals[id];
        const earnedPoints = points(total?.earned);
        attributed += earnedPoints;
        earned.textContent = format.format(earnedPoints);
        spent.textContent = format.format(points(total?.spent));
      }
      const earlier = Math.max(0, points(state.earned) - attributed);
      const earlierNote = dialog.querySelector("[data-gisp-earlier]");
      earlierNote.hidden = earlier === 0;
      earlierNote.textContent = format.format(earlier) + " earlier points are included in your total. Fresh kept only recent subject details at the time.";
      dialog.querySelector("[data-gisp-empty]").hidden = state.recent.length > 0;
      const rows = state.recent.map(({subject, label, amount}) => {
        const row = document.createElement("li");
        const description = document.createElement("div");
        const source = document.createElement("small");
        source.textContent = subject;
        description.append(source, document.createTextNode(label));
        const delta = document.createElement("b");
        delta.textContent = (amount > 0 ? "+" : "−") + format.format(Math.abs(amount));
        if (amount < 0) delta.className = "gisp-debit";
        row.append(description, delta);
        return row;
      });
      dialog.querySelector("[data-gisp-history]").replaceChildren(...rows);
    }

    button.addEventListener("click", () => { dialog.showModal(); render(); });
    dialog.querySelector("[data-gisp-subjects]").addEventListener("click", () => dialog.close());
    window.addEventListener(changeEvent, render);
    render();
    button.hidden = false;

    for (const answer of document.querySelectorAll(".topic[id] .practice details")) {
      const topic = answer.closest(".topic");
      const claim = location.pathname + "#" + topic.id;
      const subject = document.querySelector("h1")?.textContent || "Quick revision";
      const done = document.createElement("button");
      done.type = "button";
      done.className = "gisp-practice";
      function refresh() {
        done.disabled = window.FreshPoints.hasClaim(subject, claim);
        done.textContent = done.disabled ? "Practice completed ✓" : "Mark practice complete · +5 GIS Points";
      }
      refresh();
      done.addEventListener("click", async () => {
        done.disabled = true;
        await earn(subject, 5, "Quick practice completed", claim);
        refresh();
      });
      window.addEventListener(changeEvent, refresh);
      answer.append(done);
    }
    void transaction("Fresh", () => {}).catch(() => {});
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, {once: true});
  else mount();
})();

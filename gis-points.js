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
  function saved(key) {
    try { return JSON.parse(localStorage.getItem(key)); }
    catch { return null; }
  }

  function initialWallet() {
    const state = {balance: 0, earned: 0, claims: [], recent: []};
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
      state.recent.push({subject, label: "Previous balance converted", amount});
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
      let changed = original === null;

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
      <h3>Recent activity</h3>
      <p data-gisp-empty>Finish a study activity to earn your first points.</p>
      <ol data-gisp-history></ol>
      <footer><span>Saved in this browser</span><a data-gisp-subjects>Explore subjects →</a></footer>`;
    document.body.append(dialog);
    dialog.querySelector("[data-gisp-subjects]").href = new URL("#subjects", home);

    function render() {
      const state = readWallet();
      balanceLabel.textContent = format.format(state.balance);
      button.setAttribute("aria-label", format.format(state.balance) + " GIS Points. Open activity");
      if (!dialog.open) return;
      dialog.querySelector("[data-gisp-balance]").textContent = format.format(state.balance);
      dialog.querySelector("[data-gisp-earned]").textContent = format.format(points(state.earned));
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

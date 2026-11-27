/* Level Test: 30 questions from KS3 to olympiad, in rising difficulty, scored with a 3-parameter IRT model so the
   placement depends on which questions you get right, not just how many. Route: #level-test. On a first visit a
   small window invites the student to take it. */
(function () {
  const GC = () => window.GC || {};
  const esc = s => (GC().esc ? GC().esc(s) : String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])));
  const il = s => (GC().inline ? GC().inline(s) : esc(s));
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };
  const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* lv: 0 KS3, 1 IGCSE, 2 AS, 3 A Level, 4 Olympiad. b: difficulty on the ability scale. k: 'c' calculation or 'k' concept.
     MC items have o (options) and a (index of the right one); numeric items have a (value) with tol (relative) or abs. */
  const Q = [
    { lv: 0, b: -2.6, k: 'k', t: 'Physical and chemical change', lec: 'k3-4-1', q: 'Which of these is a chemical change?', o: ['Ice melting', 'Sugar dissolving in tea', 'Iron rusting', 'Water boiling'], a: 2, w: 'Rusting makes a new substance (hydrated iron(III) oxide). In the other three the substance stays the same: they are physical changes.' },
    { lv: 0, b: -2.3, k: 'c', t: 'Atomic structure', lec: 'ci-2-2', q: 'An atom of sodium has 11 protons and 12 neutrons. How many electrons does it have?', a: 11, abs: 0, u: '', w: 'A neutral atom has as many electrons as protons: 11. The neutrons do not change the charge.' },
    { lv: 0, b: -2.0, k: 'k', t: 'Acids and alkalis', lec: 'ci-7-1', q: 'Universal indicator turns purple in a solution. What is its most likely pH?', o: ['2', '6', '7', '13'], a: 3, w: 'Purple means strongly alkaline: pH 13. Red is strongly acidic and green is neutral (pH 7).' },
    { lv: 0, b: -1.9, k: 'k', t: 'Separating mixtures', lec: 'k3-3-4', q: 'Which method gives pure water from sea water?', o: ['Filtration', 'Distillation', 'Chromatography', 'Crystallisation'], a: 1, w: 'Dissolved salt passes straight through a filter. Distillation boils the water off and condenses it, leaving the salt behind.' },
    { lv: 0, b: -1.6, k: 'c', t: 'Conservation of mass', lec: 'k3-2-4', q: '12.0 g of magnesium burns in oxygen to make 20.0 g of magnesium oxide. What mass of oxygen reacted?', a: 8.0, abs: 0.05, u: 'g', w: 'Mass is conserved: 20.0 − 12.0 = 8.0 g of oxygen.' },

    { lv: 1, b: -1.2, k: 'k', t: 'Ionic bonding', lec: 'ci-2-4', q: 'Why does sodium chloride conduct electricity when molten but not when solid?', o: ['When molten, its electrons are free to move', 'When molten, its ions are free to move', 'Melting breaks covalent bonds and releases charges', 'Molten salt contains free sodium atoms'], a: 1, w: 'The charge carriers are ions. In the solid they are locked in the lattice; in the melt they can move. Ionic compounds have no free electrons.' },
    { lv: 1, b: -1.0, k: 'c', t: 'The mole', lec: 'ci-3-3', q: 'How many moles of molecules are in 8.80 g of carbon dioxide? (C = 12.0, O = 16.0)', a: 0.200, tol: 0.01, u: 'mol', w: 'M(CO₂) = 44.0 g mol⁻¹, so n = 8.80 ÷ 44.0 = 0.200 mol.' },
    { lv: 1, b: -0.8, k: 'k', t: 'Group I trends', lec: 'ci-8-2', q: 'Why does reactivity increase down Group I?', o: ['The outer electron is further from the nucleus and more shielded, so it is lost more easily', 'The atoms have more electrons in their outer shell', 'The nuclear charge decreases down the group', 'The atoms get smaller, so they collide more often'], a: 0, w: 'Nuclear charge actually increases, but the extra shells put the single outer electron further away and shield it, so less energy is needed to remove it.' },
    { lv: 1, b: -0.6, k: 'k', t: 'Rates of reaction', lec: 'ci-6-2', q: 'What is the main reason that raising the temperature speeds up a reaction?', o: ['It lowers the activation energy', 'A larger fraction of collisions have at least the activation energy', 'The particles get larger, so they collide more', 'It shifts the equilibrium to the right'], a: 1, w: 'Particles collide a little more often, but the big effect is that many more collisions now have enough energy to react. A catalyst lowers the activation energy; heating does not.' },
    { lv: 1, b: -0.5, k: 'c', t: 'Reacting masses', lec: 'ci-3-3', q: '25.0 g of calcium carbonate is heated until it fully decomposes: CaCO₃ → CaO + CO₂. What mass of calcium oxide forms? (Ca = 40.1, C = 12.0, O = 16.0)', a: 14.0, tol: 0.01, u: 'g', w: 'n(CaCO₃) = 25.0 ÷ 100.1 = 0.250 mol, which gives 0.250 mol CaO: 0.250 × 56.1 = 14.0 g.' },
    { lv: 1, b: -0.4, k: 'k', t: 'Electrolysis', lec: 'ci-4-1', q: 'Concentrated aqueous sodium chloride is electrolysed with inert electrodes. What forms at the cathode and at the anode?', o: ['Sodium at the cathode, chlorine at the anode', 'Hydrogen at the cathode, chlorine at the anode', 'Hydrogen at the cathode, oxygen at the anode', 'Sodium at the cathode, oxygen at the anode'], a: 1, w: 'Water is reduced more easily than Na⁺, so hydrogen forms at the cathode. With concentrated chloride, chlorine forms at the anode. Sodium only forms from molten NaCl.' },
    { lv: 1, b: -0.1, k: 'c', t: 'Titration calculations', lec: 'ci-12-2', q: 'What volume of 0.100 mol dm⁻³ HCl neutralises 25.0 cm³ of 0.0800 mol dm⁻³ Ba(OH)₂?', a: 40.0, tol: 0.01, u: 'cm³', w: 'Ba(OH)₂ + 2HCl → BaCl₂ + 2H₂O. n(Ba(OH)₂) = 2.00 × 10⁻³ mol, so HCl = 4.00 × 10⁻³ mol = 40.0 cm³. Forgetting the 2 : 1 ratio gives 20.0 cm³.' },

    { lv: 2, b: 0.0, k: 'k', t: 'Shapes of molecules', lec: 'ca-3-5', q: 'What are the shape and bond angle of NH₃?', o: ['Trigonal planar, 120°', 'Tetrahedral, 109.5°', 'Trigonal pyramidal, about 107°', 'Bent, about 104.5°'], a: 2, w: 'Four electron pairs (three bonding, one lone pair) point tetrahedrally, but the shape describes the atoms only: trigonal pyramidal. The lone pair repels more, squeezing the angle to about 107°.' },
    { lv: 2, b: 0.2, k: 'k', t: 'Intermolecular forces', lec: 'ca-3-6', q: 'These four have similar Mr. Which has the highest boiling point?', o: ['Butane, CH₃CH₂CH₂CH₃', 'Propanal, CH₃CH₂CHO', 'Propan-1-ol, CH₃CH₂CH₂OH', 'Methoxyethane, CH₃OCH₂CH₃'], a: 2, w: 'Only propan-1-ol has an O–H group, so only it forms hydrogen bonds between its molecules. Propanal and methoxyethane have weaker permanent dipole forces; butane has only London forces.' },
    { lv: 2, b: 0.3, k: 'c', t: "Hess's law", lec: 'ca-5-2', q: 'Enthalpies of combustion (kJ mol⁻¹): C(graphite) −394, H₂ −286, C₃H₈ −2220. Find the enthalpy of formation of propane.', a: -106, abs: 1, u: 'kJ mol⁻¹', w: 'ΔfH = 3(−394) + 4(−286) − (−2220) = −1182 − 1144 + 2220 = −106 kJ mol⁻¹.' },
    { lv: 2, b: 0.3, k: 'k', t: 'Equilibrium and Kc', lec: 'ca-7-1', q: 'N₂ + 3H₂ ⇌ 2NH₃, ΔH = −92 kJ mol⁻¹. The pressure is increased at constant temperature. What happens?', o: ['The position moves right; Kc stays the same', 'The position moves right; Kc increases', 'The position moves left; Kc decreases', 'Nothing changes, because K depends only on temperature'], a: 0, w: 'The right-hand side has fewer gas moles, so the position shifts right. K changes only with temperature, so Kc is unchanged: the concentrations rearrange to fit it again.' },
    { lv: 2, b: 0.4, k: 'k', t: 'Ionisation energy', lec: 'ca-1-4', q: 'Why is the first ionisation energy of oxygen lower than that of nitrogen?', o: ["Oxygen's outer electron is further from the nucleus", 'Oxygen has a paired electron in a 2p orbital, and the repulsion makes it easier to remove', 'Oxygen has more inner-shell shielding', 'Nitrogen has the higher nuclear charge'], a: 1, w: 'N is 2p³ (one electron per orbital); O is 2p⁴, so one 2p orbital holds a pair. The repulsion between the paired electrons outweighs oxygen’s extra proton. Same shell, same shielding.' },
    { lv: 2, b: 0.5, k: 'k', t: 'Electrophilic addition', lec: 'ca-14-2', q: 'Propene reacts with HBr. What is the major product, and why?', o: ['1-bromopropane, because a primary carbocation is less crowded', '2-bromopropane, because the secondary carbocation intermediate is more stable', '1,2-dibromopropane, by addition across the double bond', '2-bromopropane, because Br⁻ attacks the less substituted carbon first'], a: 1, w: 'H⁺ adds first. Adding it to C1 gives a secondary carbocation on C2, stabilised by two alkyl groups, so Br⁻ ends up on C2 (Markovnikov).' },
    { lv: 2, b: 0.6, k: 'c', t: 'Calculating Kc', lec: 'ca-7-1', q: '1.00 mol H₂ and 1.00 mol I₂ are heated in a sealed 1.00 dm³ flask: H₂ + I₂ ⇌ 2HI. At equilibrium there is 1.56 mol HI. Find Kc.', a: 50.3, tol: 0.015, u: '', w: '0.78 mol of each reactant was used, leaving 0.22 mol each. Kc = 1.56² ÷ (0.22 × 0.22) = 50.3.' },
    { lv: 2, b: 0.8, k: 'c', t: 'Redox titration', lec: 'ca-6-1', q: '25.0 cm³ of an Fe²⁺ solution needs 22.40 cm³ of 0.0200 mol dm⁻³ KMnO₄ in acid: MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O. Find [Fe²⁺].', a: 0.0896, tol: 0.01, u: 'mol dm⁻³', w: 'n(MnO₄⁻) = 4.48 × 10⁻⁴ mol, so n(Fe²⁺) = 5 × that = 2.24 × 10⁻³ mol in 0.0250 dm³: 0.0896 mol dm⁻³.' },

    { lv: 3, b: 1.0, k: 'c', t: 'Buffer pH', lec: 'ca-25-1', q: 'A buffer contains 0.200 mol dm⁻³ ethanoic acid (Ka = 1.74 × 10⁻⁵) and 0.100 mol dm⁻³ sodium ethanoate. Find its pH.', a: 4.46, abs: 0.02, u: '', w: 'pH = pKa + log([A⁻]/[HA]) = 4.76 + log(0.5) = 4.46.' },
    { lv: 3, b: 1.0, k: 'k', t: 'Electrode potentials', lec: 'ca-24-2', q: 'E°: Fe³⁺/Fe²⁺ +0.77 V; I₂/I⁻ +0.54 V; Br₂/Br⁻ +1.07 V; Cl₂/Cl⁻ +1.36 V. Which halide ions can Fe³⁺ oxidise under standard conditions?', o: ['I⁻ only', 'I⁻ and Br⁻', 'Cl⁻ only', 'All three'], a: 0, w: 'Fe³⁺ can oxidise a halide only if E°(Fe³⁺/Fe²⁺) is more positive than E°(X₂/X⁻). That is true only for iodide (0.77 > 0.54).' },
    { lv: 3, b: 1.1, k: 'c', t: 'Gibbs free energy', lec: 'ca-23-4', q: 'CaCO₃ → CaO + CO₂ has ΔH = +178 kJ mol⁻¹ and ΔS = +161 J K⁻¹ mol⁻¹. Above what temperature is the reaction feasible?', a: 1106, tol: 0.005, u: 'K', w: 'Feasible when ΔG = ΔH − TΔS < 0, so T > 178 000 ÷ 161 = 1106 K. Watch the units: kJ against J.' },
    { lv: 3, b: 1.3, k: 'k', t: 'Colour of complexes', lec: 'ca-28-3', q: 'Why is [Cu(H₂O)₆]²⁺ blue but [Zn(H₂O)₆]²⁺ colourless?', o: ['Zinc is not a transition element, so it cannot bond to ligands', 'Zn²⁺ has a full 3d¹⁰ subshell, so no d–d electron transition is possible', 'Cu²⁺ absorbs blue light; Zn²⁺ absorbs none', 'The zinc complex is tetrahedral, which never absorbs visible light'], a: 1, w: 'Colour comes from an electron jumping between split d orbitals. Cu²⁺ (3d⁹) has a gap to jump into; Zn²⁺ (3d¹⁰) has none. Cu²⁺ absorbs orange-red light, so it looks blue.' },
    { lv: 3, b: 1.5, k: 'k', t: 'NMR spectroscopy', lec: 'ca-37-4', q: 'An ester C₄H₈O₂ shows three ¹H NMR signals: a singlet (3H) at 2.0 ppm, a quartet (2H) at 4.1 ppm and a triplet (3H) at 1.2 ppm. Which ester is it?', o: ['Methyl propanoate', 'Ethyl ethanoate', 'Propyl methanoate', 'Methyl 2-methylpropanoate'], a: 1, w: 'A CH₂ quartet at 4.1 ppm is next to the ester oxygen (O–CH₂CH₃), and a CH₃ singlet at 2.0 ppm is next to C=O. That is CH₃COOCH₂CH₃. Methyl propanoate also gives singlet, quartet and triplet, but its singlet is at 3.7 and its quartet at 2.3 ppm.' },
    { lv: 3, b: 1.7, k: 'c', t: 'Arrhenius equation', lec: 'ca-26-1', q: 'A first-order reaction has a half-life of 12.0 min at 25.0 °C and 3.0 min at 45.0 °C. Find the activation energy.', a: 54.7, tol: 0.01, u: 'kJ mol⁻¹', w: 'k is 4 times larger at 45 °C. ln 4 = (Ea/R)(1/298.15 − 1/318.15), so Ea = 8.3145 × 1.386 ÷ 2.108 × 10⁻⁴ = 54.7 kJ mol⁻¹.' },

    { lv: 4, b: 2.0, k: 'k', t: 'Crystal field theory', lec: 'ca-28-3', q: 'How many unpaired electrons does [CoF₆]³⁻ have?', a: 4, abs: 0, u: '', w: 'Co³⁺ is d⁶. F⁻ is a weak-field ligand, so the splitting is smaller than the pairing energy and the complex is high spin: t₂g⁴e_g², with 4 unpaired electrons. With a strong-field ligand such as NH₃ it would be low spin with none.' },
    { lv: 4, b: 2.3, k: 'c', t: 'Combining potentials', lec: 'ca-24-2', q: 'E°(Cu²⁺/Cu) = +0.34 V and E°(Cu²⁺/Cu⁺) = +0.15 V. Find E°(Cu⁺/Cu).', a: 0.53, abs: 0.01, u: 'V', w: 'Potentials do not add, but ΔG° = −nFE° does: 2(0.34) = 1(0.15) + 1·E°, so E° = 0.53 V. Since 0.53 > 0.15, Cu⁺ disproportionates in water.' },
    { lv: 4, b: 2.4, k: 'c', t: 'Solubility and complexes', lec: 'ca-28-5', q: 'Ksp(AgCl) = 1.8 × 10⁻¹⁰, and for Ag⁺ + 2NH₃ ⇌ [Ag(NH₃)₂]⁺, β₂ = 1.6 × 10⁷. Find the solubility of AgCl in 0.10 mol dm⁻³ aqueous NH₃ (the total ammonia concentration).', a: 4.85e-3, tol: 0.03, u: 'mol dm⁻³', w: 'AgCl + 2NH₃ ⇌ [Ag(NH₃)₂]⁺ + Cl⁻ has K = Ksp β₂ = 2.88 × 10⁻³. With s dissolved: s²/(0.10 − 2s)² = K, so s/(0.10 − 2s) = 0.0537 and s = 4.8 × 10⁻³ mol dm⁻³, over 300 times more than in pure water.' },
    { lv: 4, b: 2.6, k: 'c', t: 'Amphiprotic ions', lec: 'ca-25-1', q: 'Find the pH of 0.10 mol dm⁻³ NaHCO₃ (H₂CO₃: pKa₁ = 6.35, pKa₂ = 10.33).', a: 8.34, abs: 0.03, u: '', w: 'HCO₃⁻ is both an acid and a base, and the two equilibria balance at [H⁺] ≈ √(Ka₁Ka₂). So pH = (6.35 + 10.33) ÷ 2 = 8.34, almost independent of concentration.' },
  ];
  const LV = ['KS3', 'IGCSE', 'AS Level', 'A Level', 'Olympiad'];
  const MCC = 0.25, A = 1.35; // guessing floor for multiple choice, common discrimination

  /* placement: expected-a-posteriori ability over a grid, normal prior. Bands were set from the ability of a student who
     gets exactly everything up to the end of each level right: */
  const BANDS = [
    { cut: -Infinity, lv: 0, name: 'KS3 foundations', hash: 'ks3', go: 'Start with KS3', say: 'Build the basics first: particles, atoms, simple reactions and the Periodic Table. The KS3 lectures are short and every one has questions to check yourself.' },
    { cut: -1.75, lv: 1, name: 'IGCSE', hash: 'igcse', go: 'Go to IGCSE', say: 'Your KS3 chemistry is solid. IGCSE is where moles, bonding and calculations come in: work through it topic by topic.' },
    { cut: -0.6, lv: 2, name: 'AS Level', hash: 'as', go: 'Go to AS Level', say: 'You have the IGCSE toolkit. AS Level deepens it: shapes, energetics, equilibria and the first organic mechanisms.' },
    { cut: 0.55, lv: 3, name: 'A Level', hash: 'a-level', go: 'Go to A Level', say: 'You are comfortable at AS Level. A Level adds the quantitative chemistry: buffers, Gibbs energy, electrochemistry, transition metals and spectroscopy.' },
    { cut: 1.58, lv: 4, name: 'Olympiad ready', hash: 'olympiad-train', go: 'Start Olympiad training', say: 'You are beyond the A Level syllabus in places. The Olympiad training course and past papers are the right challenge now.' },
  ];
  const grid = []; for (let t = -4; t <= 4.0001; t += 0.05) grid.push(t);
  const pCorrect = (q, th) => { const c = q.o ? MCC : 0; return c + (1 - c) / (1 + Math.exp(-1.7 * A * (th - q.b))); };
  function ability(right) {
    let num = 0, den = 0;
    for (const th of grid) { let L = Math.exp(-th * th / (2 * 1.3 * 1.3)); Q.forEach((q, i) => { const p = pCorrect(q, th); L *= right[i] ? p : 1 - p; }); num += th * L; den += L; }
    return num / den;
  }
  const band = th => { let b = BANDS[0]; for (const x of BANDS) if (th >= x.cut) b = x; return b; };

  /* answers */
  const num = s => (window.Olympiad && Olympiad.num ? Olympiad.num(s) : parseFloat(String(s).replace(/[−–]/g, '-')));
  function isRight(q, v) {
    if (v == null || v === '') return false;
    if (q.o) return v === q.a;
    const x = num(v); if (isNaN(x)) return false;
    if (q.abs != null) return Math.abs(x - q.a) <= q.abs + 1e-9;
    return Math.abs(x - q.a) <= Math.abs(q.a) * (q.tol || 0.01) + 1e-12;
  }

  /* state */
  const KEY = 'gc.lt';
  const fresh = () => ({ v: 1, i: -1, ans: Q.map(() => null), done: false });
  let S = store.get(KEY, null); if (!S || S.v !== 1 || !Array.isArray(S.ans) || S.ans.length !== Q.length) S = fresh();
  const save = () => store.set(KEY, S);

  /* views */
  const head = (title, lede) => `<nav class="crumbs" aria-label="Breadcrumb"><a href="#chemistry">Chemistry</a><span>Level Test</span></nav><header class="page-head lt-head"><p class="kicker">Level Test</p><h1>${title}</h1>${lede ? `<p>${lede}</p>` : ''}</header>`;
  function intro() {
    const started = S.i >= 0 && !S.done, answered = S.ans.filter(a => a != null).length;
    return `<div class="page lt">${head('Where should you start?', '30 questions that get harder as you go, from KS3 to the Chemistry Olympiad. Your result tells you which level to study next and which topics to fix first.')}
      <section class="lt-start panel">
        <ul class="lt-facts"><li><b>30</b><span>questions</span></li><li><b>25–40</b><span>minutes</span></li><li><b>5</b><span>levels, KS3 to Olympiad</span></li></ul>
        <ol class="lt-rules"><li>Have a calculator and a periodic table ready.</li><li>It starts easy and ends at olympiad level. Nobody is expected to get everything.</li><li>If you don’t know, press <b>I don’t know</b> rather than guessing: a guess makes the result less accurate.</li><li>Numerical answers: type the number only; the unit is shown next to the box.</li></ol>
        <div class="lt-cta">${started ? `<button class="btn" type="button" data-lt="resume">Continue (${answered} of ${Q.length} answered) ${ARROW}</button><button class="btn ghost" type="button" data-lt="restart">Start again</button>` : S.done ? `<a class="btn" href="#level-test" data-lt="result">See your result ${ARROW}</a><button class="btn ghost" type="button" data-lt="restart">Take it again</button>` : `<button class="btn" type="button" data-lt="begin">Start the Level Test ${ARROW}</button>`}</div>
      </section></div>`;
  }
  function question() {
    const i = S.i, q = Q[i], a = S.ans[i];
    return `<div class="page lt lt-run">
      <div class="lt-top"><span>Question ${i + 1} of ${Q.length}</span><span class="lt-tag">${q.k === 'c' ? 'Calculation' : 'Concept'} · ${esc(q.t)}</span></div>
      <div class="lt-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${Q.length}" aria-valuenow="${i}"><i style="--v:${Math.round(i / Q.length * 100)}%"></i></div>
      <article class="lt-q panel"><p class="lt-stem">${il(q.q)}</p>
        ${q.o ? `<div class="lt-opts" role="radiogroup" aria-label="Choose one answer">${q.o.map((o, k) => `<button type="button" role="radio" aria-checked="${a === k}" class="lt-opt${a === k ? ' is-on' : ''}" data-opt="${k}"><b>${'ABCD'[k]}</b><span>${il(o)}</span></button>`).join('')}</div>`
        : `<div class="lt-num"><input id="ltIn" type="text" inputmode="decimal" autocomplete="off" aria-label="Your answer" placeholder="your answer" value="${a != null && a !== 'skip' ? esc(a) : ''}">${q.u ? `<span class="ol-unit">${esc(q.u)}</span>` : ''}</div><p class="lt-fmt">For powers of ten type, for example, 4.2e-3 or 4.2 × 10^-3.</p>`}
        <div class="lt-nav"><button type="button" class="btn ghost small" data-lt="back"${i === 0 ? ' disabled' : ''}>Back</button><button type="button" class="chip" data-lt="skip">I don’t know</button><button type="button" class="btn small" data-lt="next">${i === Q.length - 1 ? 'Finish' : 'Next'} ${ARROW}</button></div>
      </article>
      <p class="lt-quit"><button type="button" class="linkish" data-lt="pause">Save and leave</button> Your answers are kept in this browser.</p></div>`;
  }
  function result() {
    const right = Q.map((q, i) => isRight(q, S.ans[i])), th = ability(right), B = band(th), n = right.filter(Boolean).length;
    const per = LV.map((l, v) => { const idx = Q.map((q, i) => i).filter(i => Q[i].lv === v); return { l, n: idx.length, r: idx.filter(i => right[i]).length }; });
    const kinds = ['c', 'k'].map(k => { const idx = Q.map((q, i) => i).filter(i => Q[i].k === k); return { k, n: idx.length, r: idx.filter(i => right[i]).length }; });
    const pos = Math.max(2, Math.min(98, (th + 3) / 6 * 100));
    const misses = Q.map((q, i) => ({ q, i })).filter(x => !right[x.i] && x.q.lv <= B.lv);
    const lecLink = id => { const L = (GC().BY || {})[id]; return L ? `<a class="ol-lec" href="#${id}">${esc(L.stage.label)} ${esc(L.code)} ${esc(L.title)}</a>` : ''; };
    return `<div class="page lt">${head('Your result', '')}
      <section class="lt-res panel">
        <div class="lt-res-main"><p class="kicker">Where to start</p><h2>${esc(B.name)}</h2><p>${esc(B.say)}</p><a class="btn" href="#${B.hash}">${esc(B.go)} ${ARROW}</a></div>
        <div class="lt-res-score"><b>${n}</b><span>of ${Q.length} correct</span></div>
        <div class="lt-scale" aria-label="Your position on the scale from KS3 to Olympiad"><div class="lt-scale-row">${BANDS.map(x => `<span class="${x === B ? 'is-on' : ''}">${esc(x.name.replace(' foundations', '').replace(' ready', ''))}</span>`).join('')}</div><div class="lt-scale-track"><i style="left:${pos.toFixed(1)}%"></i></div></div>
      </section>
      <section class="lt-break"><h2>By level</h2><div class="lt-levels">${per.map(p => `<div><span>${p.l}</span><div class="meter"><i style="--v:${Math.round(p.r / p.n * 100)}%"></i></div><b>${p.r}/${p.n}</b></div>`).join('')}</div>
        <p class="lt-kinds">Calculation questions: <b>${kinds[0].r}/${kinds[0].n}</b> · Concept questions: <b>${kinds[1].r}/${kinds[1].n}</b>${Math.abs(kinds[0].r / kinds[0].n - kinds[1].r / kinds[1].n) >= 0.25 ? (kinds[0].r / kinds[0].n < kinds[1].r / kinds[1].n ? ' · Your calculations are the weaker side: practise the worked examples in each lecture.' : ' · Your concepts are the weaker side: read the explanations, not just the formulas.') : ''}</p></section>
      ${misses.length ? `<section class="lt-break"><h2>Fix these first</h2><p class="lt-sub">Questions you missed up to the level you should study now, with the lecture that teaches each one.</p><ul class="lt-fix">${misses.map(x => `<li><b>${esc(x.q.t)}</b><span>${LV[x.q.lv]}</span>${lecLink(x.q.lec)}</li>`).join('')}</ul></section>` : ''}
      <section class="lt-break"><h2>Every question, with the answer</h2><ol class="lt-review">${Q.map((q, i) => { const a = S.ans[i], ok = right[i]; const yours = a == null || a === 'skip' ? 'I don’t know' : q.o ? `${'ABCD'[a]}. ${q.o[a]}` : `${a}${q.u ? ' ' + q.u : ''}`; const corr = q.o ? `${'ABCD'[q.a]}. ${q.o[q.a]}` : `${q.a}${q.u ? ' ' + q.u : ''}`;
        return `<li class="${ok ? 'is-ok' : 'is-no'}"><details><summary><b>${i + 1}</b><span>${esc(q.t)}</span><em>${LV[q.lv]}</em><i>${ok ? 'Correct' : 'Not correct'}</i></summary><p class="lt-stem">${il(q.q)}</p><p><b>Your answer:</b> ${il(yours)}</p>${ok ? '' : `<p><b>Answer:</b> ${il(corr)}</p>`}<p class="lt-why">${il(q.w)}</p>${lecLink(q.lec)}</details></li>`; }).join('')}</ol></section>
      <p class="lt-cta"><button class="btn ghost" type="button" data-lt="restart">Take the test again</button></p></div>`;
  }

  /* events */
  let VIEW = null;
  function draw() { if (!VIEW) return; VIEW.innerHTML = S.done && S.i === -2 ? result() : S.i >= 0 && !S.done ? question() : intro(); bind(); const f = VIEW.querySelector('#ltIn'); if (f && matchMedia('(pointer: fine)').matches) f.focus(); window.scrollTo(0, 0); }
  function record() { const q = Q[S.i]; if (!q || q.o) return; const f = VIEW.querySelector('#ltIn'); const v = f ? f.value.trim() : ''; if (v) S.ans[S.i] = v; }
  function go(d) { record(); if (S.i + d >= Q.length) { S.done = true; S.i = -2; } else S.i = Math.max(0, S.i + d); save(); draw(); }
  function bind() {
    VIEW.onclick = e => {
      const o = e.target.closest('[data-opt]'); if (o) { S.ans[S.i] = +o.dataset.opt; save(); VIEW.querySelectorAll('.lt-opt').forEach(b => { const on = b === o; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', on); }); return; }
      const b = e.target.closest('[data-lt]'); if (!b) return; const act = b.dataset.lt;
      if (act === 'begin') { S = fresh(); S.i = 0; save(); draw(); }
      else if (act === 'resume') { S.i = Math.max(0, S.ans.findIndex(a => a == null)); if (S.i < 0) S.i = 0; draw(); }
      else if (act === 'restart') { S = fresh(); S.i = 0; save(); draw(); }
      else if (act === 'result') { e.preventDefault(); S.i = -2; draw(); }
      else if (act === 'next') go(1);
      else if (act === 'back') go(-1);
      else if (act === 'skip') { S.ans[S.i] = 'skip'; save(); go(1); }
      else if (act === 'pause') { record(); save(); location.hash = 'start'; }
    };
    VIEW.onkeydown = e => { if (e.key === 'Enter' && e.target.id === 'ltIn') { e.preventDefault(); go(1); } };
  }
  function render(view) {
    VIEW = view; document.title = 'Level Test · Quilio';
    if (S.done) S.i = -2; else if (S.i >= 0) S.i = Math.max(0, Math.min(S.i, Q.length - 1));
    draw();
  }
  function leave() { if (VIEW && VIEW.querySelector('#ltIn')) record(); save(); VIEW = null; }

  /* first visit: a small window that points to the test */
  const PROMPT = 'gc.lt.prompted';
  let shown = false;
  function prompt() {
    if (shown || store.get(PROMPT, false) || S.done) return; const h = location.hash.slice(1);
    const loading = document.getElementById('science-loading');
    if (!['', 'start', 'enter', 'home', 'chemistry'].includes(h) || document.documentElement.classList.contains('intro') || (window.GCIntro && window.GCIntro.playing) || (loading && !loading.hidden) || document.querySelector('.chat.open, .chat[open], .rv') || /\brv-/.test(document.documentElement.className)) return;
    shown = true; store.set(PROMPT, true);
    const d = document.createElement('div'); d.className = 'lt-pop'; d.innerHTML = `<div class="lt-pop-card panel" role="dialog" aria-modal="true" aria-labelledby="ltPopH"><button type="button" class="lt-pop-x" aria-label="Close" data-x>×</button><p class="kicker">New here?</p><h2 id="ltPopH">Find your level in 30 questions.</h2><p>A short test from KS3 to the Chemistry Olympiad. It tells you where to start on this site and which topics to fix first.</p><div class="lt-pop-cta"><a class="btn" href="#level-test" data-go>Take the Level Test ${ARROW}</a><button type="button" class="btn ghost" data-x>Maybe later</button></div><p class="lt-pop-note">You can find it any time in the menu and on the home screen.</p></div>`;
    const prev = document.activeElement, close = () => { d.classList.remove('is-in'); setTimeout(() => d.remove(), 220); document.removeEventListener('keydown', key); if (prev && prev.focus) try { prev.focus(); } catch (e) { } };
    const key = e => { if (e.key === 'Escape') close(); if (e.key === 'Tab') { const f = [...d.querySelectorAll('a,button')]; const i = f.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } } };
    d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-x]')) close(); else if (e.target.closest('[data-go]')) close(); });
    document.addEventListener('keydown', key); document.body.appendChild(d); requestAnimationFrame(() => d.classList.add('is-in')); setTimeout(() => { const b = d.querySelector('.btn'); if (b) b.focus(); }, 60);
  }
  const later = ms => setTimeout(prompt, ms);
  window.addEventListener('hashchange', () => { if (!shown) later(900); });
  // The entrance film can start after this script has run (on Fresh it waits for the loading screen),
  // so offer the test whenever the film ends or the page finishes opening, not only once at load.
  window.addEventListener('gc-intro-done', () => later(1400), { once: true });
  window.addEventListener('fresh-science-ready', () => later(1600), { once: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => later(1600)); else later(1600);

  window.LevelTest = { render, leave, Q, ability, band, BANDS, isRight };
})();

/* Quilio: the Olympiad section.
   #olympiad (overview) · #olympiad-competitions · #olympiad-syllabus · #olympiad-practice · #olympiad-p-<id> (one problem) · #olympiad-papers (competitions) · #olympiad-papers-<c> (one competition, by year)
   Competition facts were checked against the organisers' own pages in November 2026; dates and rules change, so every
   card links to the organiser. The practice problems are original, written for this site, with full worked solutions.
   Progress is kept in this browser. */
(function () {
  'use strict';
  const R = String.raw, GC = () => window.GC || {};
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const il = s => (GC().inline ? GC().inline(s) : esc(s));
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };
  const lec = id => { const L = (GC().BY || {})[id]; return L ? `<a class="ol-lec" href="#${id}">${L.stage.label} ${L.code} ${esc(L.title)}</a>` : ''; };
  const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const EXT = (href, label) => `<a href="${href}" target="_blank" rel="noopener">${label} ↗</a>`;

  /* ---------------- competitions ---------------- */
  const COMPS = [
    { id: 'icho', name: 'International Chemistry Olympiad', short: 'IChO', where: 'International', who: 'Secondary school students, under 20 on 1 July, who have not started university', when: 'Every July. 2026: 58th IChO, Tashkent, Uzbekistan. 2027: Chinese Taipei.',
      format: ['A theoretical exam and a practical (laboratory) exam, each of about 4 to 5 hours', 'Each country sends a team of up to four students, chosen by its own national olympiad', 'Before the competition the host publishes preparatory problems that introduce the advanced topics it may use'],
      route: 'The top of the ladder: every national olympiad below can lead here.', links: [['https://www.icho2026.uz/', 'IChO 2026 (Uzbekistan)'], ['https://www.icho2026.uz/regulations.pdf', 'Regulations and syllabus (PDF)']] },
    { id: 'ukcho', name: 'UK Chemistry Olympiad', short: 'UKChO', where: 'United Kingdom and British international schools', who: 'Sixth-form students; Year 12 and Year 11 students often take it too', when: 'Round 1 in schools in late January; Round 2 in April for about 25 to 30 invited students.',
      format: ['Round 1: a 2-hour written paper of five or six long questions set on unfamiliar, real-world chemistry', 'Teachers mark Round 1 in school with the RSC mark scheme and send in the scores', 'Its past questions are recreated with new numbers in the Past papers tab here'],
      route: 'Run by the Royal Society of Chemistry. The RSC has said that from January 2027 Round 1 will no longer be a route to RSC-supported UK team selection for the international final: check the RSC page before you plan around it.', links: [['https://edu.rsc.org/enrichment/uk-chemistry-olympiad', 'UKChO at the RSC'], ['https://www.rsc.org/news/evolving-our-approach-to-the-uk-chemistry-olympiad', 'RSC: changes from 2027']] },
    { id: 'c3l6', name: 'Cambridge Chemistry Challenge (Lower Sixth)', short: 'C3L6', where: 'United Kingdom', who: 'Students in Year 12 (Lower Sixth) or below', when: 'One paper in June, taken at school. Top scorers are invited to a residential camp in Cambridge.',
      format: ['A 90-minute written paper with two long questions', 'Each question takes a piece of real chemistry and walks you, step by step, well beyond A Level', 'Each paper comes with a mark scheme and a commentary on every question'],
      route: 'The best warm-up before the UK Chemistry Olympiad: the same style, but gentler and shorter.', links: [['https://www.c3l6.caths.cam.ac.uk/about', 'About C3L6']] },
    { id: 'usnco', name: 'U.S. National Chemistry Olympiad', short: 'USNCO', where: 'United States', who: 'High school students. Only U.S. citizens and permanent residents can go beyond the Local Exam', when: 'Local Exam in March; National Exam in April; study camp in June; the U.S. IChO team is chosen from the camp.',
      format: ['Local Exam: 60 multiple-choice questions in 110 minutes', 'National Exam Part I: 60 multiple-choice questions in 90 minutes', 'Part II: 8 written problems in 105 minutes. Part III: 2 laboratory practicals in 90 minutes', 'The multiple-choice papers come in ten blocks of six, one block per topic, from stoichiometry to organic chemistry'],
      route: 'Run by the American Chemical Society. Its multiple-choice papers are the best fast practice there is: short, sharp and spread across every topic.', links: [['https://www.acs.org/education/olympiad.html', 'USNCO at the ACS'], ['https://www.acs.org/education/olympiad/prepare-for-exams/exam-information.html', 'Exam format and topics']] },
    { id: 'asoe', name: 'Australian Science Olympiad Exam: Chemistry', short: 'ASOE', where: 'Australia', who: 'Secondary school students', when: 'Once a year; top students go on to a summer school, from which the IChO team is chosen.',
      format: ['Part A: 15 multiple-choice questions on basic concepts', 'Part B: three long written questions that test skills rather than recall', 'Answers are published for every past exam'],
      route: 'Run by Australian Science Innovations. Part B is excellent practice for long, data-heavy questions.', links: [['https://asi.edu.au/programs/australian-science-olympiads/', 'Australian Science Olympiads'], ['https://asi.edu.au/wp-content/uploads/2024/06/Chemistry-ASOE-syllabus-2023.pdf', 'Chemistry syllabus (PDF)']] },
    { id: 'cco', name: 'Canadian Chemistry Olympiad', short: 'CCO', where: 'Canada', who: 'Students at Canadian high schools and Québec cégeps', when: 'The qualifying exam is held in April, alongside the Canadian Chemistry Contest; regional camps follow.',
      format: ['Part A: multiple choice, shared with the Canadian Chemistry Contest', 'Part C: the Olympiad selection paper of long problems', 'The CCO site has free preparation problems, with a strong practical focus'],
      route: 'Leads to the Canadian IChO team.', links: [['https://cco-occ.utschools.ca/?p=160', 'CCO preparation resources']] },
    { id: 'scho', name: 'Singapore Chemistry Olympiad', short: 'SChO', where: 'Singapore', who: 'Students in Singapore', when: 'The IChO team is chosen through two rounds of tests and training.',
      format: ['Run with the Department of Chemistry, National University of Singapore', 'Singapore has competed every year since 1990'],
      route: 'Leads to the Singapore IChO team.', links: [['https://chemistry.nus.edu.sg/events/cho/', 'SChO at NUS']] },
  ];

  /* ---------------- the IChO syllabus, mapped onto this site ----------------
     The regulations split the syllabus into concepts every participant is expected to know, and advanced topics that may
     be set only if the host has introduced them in its preparatory problems (no more than six theoretical and two
     practical). This map follows that split; it is a guide, so read the official Appendix C for the exact list. */
  const SYL = [
    { f: 'Atoms, structure and spectra', core: [['Nucleons, isotopes, relative atomic mass', 'ca-1-2'], ['Electron configuration: Aufbau, Pauli, Hund', 'ca-1-3'], ['Ionisation energy and periodic trends', 'ca-1-4'], ['Mass spectra, including isotope patterns', 'ca-22-2']], adv: ['Quantum numbers and the shapes of orbitals', 'Particle in a box: energy levels of conjugated molecules', 'Line spectra of hydrogen: the Rydberg equation', 'Radioactive decay: half-life and nuclear equations'] },
    { f: 'Bonding and structure', core: [['Ionic, covalent and metallic bonding', 'ca-3-1'], ['VSEPR shapes and bond angles', 'ca-3-5'], ['Intermolecular forces and hydrogen bonding', 'ca-3-6'], ['Giant structures and their properties', 'ca-4-2']], adv: ['Hybridisation and resonance', 'Molecular orbital diagrams of diatomic molecules: bond order and magnetism', 'Unit cells: counting atoms, density and packing efficiency', 'Lattice energy from the Born–Landé idea'] },
    { f: 'Stoichiometry and the mole', core: [['The mole, molar mass, formulae', 'ci-3-3'], ['Reacting masses, gas volumes, concentrations', 'ca-2-4'], ['The ideal gas equation and partial pressures', 'ca-4-1'], ['Titration calculations, including back titration', 'ci-12-2']], adv: ['Real gases: the van der Waals equation', 'Gravimetric analysis', 'Complex multi-step deduction of formulae from data'] },
    { f: 'Thermodynamics', core: [['Enthalpy changes and Hess’s law', 'ca-5-2'], ['Bond enthalpies', 'ca-5-1'], ['Born–Haber cycles', 'ca-23-1'], ['Entropy and Gibbs energy; feasibility', 'ca-23-4']], adv: ['ΔG° = −RT ln K and its temperature dependence (van ’t Hoff)', 'Heat capacity and the first law; work done by a gas', 'Phase diagrams and the Clausius–Clapeyron equation'] },
    { f: 'Equilibrium', core: [['Kc and Kp; Le Chatelier', 'ca-7-1'], ['Acids, bases, pH, Ka and buffers', 'ca-25-1'], ['Solubility product, Ksp', 'ca-25-1'], ['Partition coefficients', 'ca-25-2']], adv: ['Polyprotic acids and species distribution diagrams', 'Simultaneous equilibria: complex formation with precipitation', 'Equilibria of complex ions: stepwise stability constants'] },
    { f: 'Kinetics', core: [['Rate equations, orders and rate constants', 'ca-26-1'], ['Half-life of first-order reactions', 'ca-26-1'], ['Activation energy and the Arrhenius equation', 'ca-8-2'], ['Catalysis', 'ca-26-2']], adv: ['Integrated rate laws for zero, first and second order', 'Steady-state and pre-equilibrium approximations', 'Enzyme kinetics: Michaelis–Menten', 'Transition state theory: Eyring equation'] },
    { f: 'Electrochemistry', core: [['Redox, oxidation numbers, half-equations', 'ca-6-1'], ['Electrode potentials and cell EMF', 'ca-24-2'], ['Electrolysis and Faraday’s laws', 'ca-24-1']], adv: ['The Nernst equation in full; concentration cells', 'ΔG° = −nFE° and links to K', 'Latimer and Frost diagrams'] },
    { f: 'Inorganic chemistry', core: [['Group 2 and Group 17 trends', 'ca-10-1'], ['Nitrogen, sulfur and their compounds', 'ca-12-1'], ['Transition elements: oxidation states, complexes', 'ca-28-1'], ['Colour of complexes', 'ca-28-3'], ['Qualitative tests for ions and gases', 'ci-12-5']], adv: ['Crystal field theory: splitting, high and low spin, CFSE', 'Magnetic moments: spin-only formula', 'Isomerism in coordination compounds', 'Main-group chemistry of boron, phosphorus and the noble gases'] },
    { f: 'Organic chemistry', core: [['Functional groups and naming', 'ca-13-1'], ['Isomerism, including optical', 'ca-29-4'], ['Mechanisms: substitution, addition, elimination', 'ca-15-1'], ['Carbonyl chemistry', 'ca-17-1'], ['Arenes and electrophilic substitution', 'ca-30-1'], ['Synthesis routes', 'ca-36-1']], adv: ['CIP rules: R/S and E/Z in complex molecules', 'Conformations of cyclohexane', 'Pericyclic reactions: Diels–Alder', 'Carbonyl condensations: aldol, Claisen', 'Protecting groups and multi-step synthesis'] },
    { f: 'Analysis and spectroscopy', core: [['Infrared spectroscopy', 'ca-22-1'], ['¹³C NMR', 'ca-37-3'], ['¹H NMR, including splitting', 'ca-37-4'], ['Chromatography', 'ca-37-1']], adv: ['Coupling constants and complex splitting', 'UV–visible spectroscopy and the Beer–Lambert law', 'Combining IR, NMR and MS to solve a structure'] },
    { f: 'Biological and polymer chemistry', core: [['Addition and condensation polymers', 'ca-35-1'], ['Amino acids and peptides', 'ca-34-4']], adv: ['Carbohydrates: ring forms and glycosidic links', 'Nucleic acids and base pairing', 'Polymer molar mass: degree of polymerisation'] },
    { f: 'Practical skills', core: [['Experimental design and errors', 'ci-12-1'], ['Titration technique', 'ci-12-2'], ['Separation and purification', 'ci-12-4']], adv: ['Synthesis, recrystallisation and melting point', 'Complexometric (EDTA) and redox titrations', 'Thin-layer chromatography to follow a reaction'] },
  ];

  /* ---------------- practice problems: original, with worked solutions ----------------
     Each part has either a numeric answer (checked within tol, a fraction) or a written answer to compare with. */
  const P = [
    { id: 'smelling-salts', t: 'Smelling salts', f: 'Stoichiometry', lv: 1, m: 8, lec: ['ca-4-1', 'ci-3-3'],
      s: R`Ammonium carbonate, $\mathrm{(NH_4)_2CO_3}$, was once sold as smelling salts. On warming it decomposes completely: $\mathrm{(NH_4)_2CO_3(s) \rightarrow 2NH_3(g) + CO_2(g) + H_2O(g)}$. A student heats $9.61\ \mathrm{g}$ of it to $150\ ^\circ\mathrm{C}$. ($M = 96.09\ \mathrm{g\ mol^{-1}}$; $R = 8.314\ \mathrm{J\ K^{-1}\ mol^{-1}}$.)`,
      p: [{ q: 'How many moles of gas are produced in total?', a: 0.400, u: 'mol', tol: 0.01, h: 'First find the moles of ammonium carbonate. Each mole gives how many moles of gas?', w: R`$n = 9.61 \div 96.09 = 0.1000\ \mathrm{mol}$. Each mole gives $2 + 1 + 1 = 4$ mol of gas, so $4 \times 0.1000 = 0.400\ \mathrm{mol}$.` },
        { q: 'What volume does this gas occupy at 150 °C and 100 kPa? Give your answer in dm³.', a: 14.1, u: 'dm³', tol: 0.015, h: 'Use pV = nRT with T in kelvin and p in pascals. 1 m³ = 1000 dm³.', w: R`$T = 423.15\ \mathrm{K}$. $V = nRT/p = 0.400 \times 8.314 \times 423.15 \div 100\,000 = 0.01407\ \mathrm{m^3} = 14.1\ \mathrm{dm^3}$.` },
        { q: 'What mass of solid is left in the tube?', a: 0, u: 'g', tol: 0, abs: 0.01, h: 'Look at the state symbols of the products.', w: 'None: every product is a gas at 150 °C, so the solid disappears completely. That is why it worked as smelling salts.' }] },
    { id: 'sugar', t: 'A sugar and its acetate', f: 'Stoichiometry', lv: 1, m: 7, lec: ['ci-3-3', 'ca-33-2'],
      s: R`A sugar contains, by mass, $40.0\%$ carbon, $6.7\%$ hydrogen and $53.3\%$ oxygen. Its relative molecular mass is $180$.`,
      p: [{ q: 'How many carbon atoms are in one molecule?', a: 6, u: '', tol: 0, h: 'Find the empirical formula first: divide each percentage by the relative atomic mass.', w: R`C: $40.0/12.0 = 3.33$; H: $6.7/1.0 = 6.7$; O: $53.3/16.0 = 3.33$. Ratio $1:2:1$, so the empirical formula is $\mathrm{CH_2O}$ ($M_r = 30$). $180/30 = 6$, so the molecular formula is $\mathrm{C_6H_{12}O_6}$: six carbons.` },
        { q: 'All five –OH groups are converted to ethanoate esters, –OCOCH₃. What is the relative molecular mass of the product?', a: 390, u: '', tol: 0.003, h: 'Each –OH becomes –OCOCH₃. What mass does that add each time?', w: R`Each change replaces $\mathrm{H}$ (1) by $\mathrm{COCH_3}$ (43): a gain of 42. $180 + 5 \times 42 = 390$.` }] },
    { id: 'boron', t: 'Boron and its chloride', f: 'Atomic structure', lv: 1, m: 8, lec: ['ca-1-2', 'ca-22-2'],
      s: R`Boron has two stable isotopes: $^{10}\mathrm{B}$ ($10.013$) and $^{11}\mathrm{B}$ ($11.009$). Its relative atomic mass is $10.81$.`,
      p: [{ q: 'What percentage of boron atoms are boron-10?', a: 20.0, u: '%', tol: 0.02, h: 'Let x be the fraction of boron-10. Then 1 − x is boron-11.', w: R`$10.013x + 11.009(1-x) = 10.81$, so $0.996x = 0.199$ and $x = 0.200$: $20.0\%$.` },
        { q: 'Chlorine is ³⁵Cl and ³⁷Cl. How many different molecular-ion peaks does BCl₃ show in its mass spectrum?', a: 8, u: '', tol: 0, h: 'List the possible chlorine combinations, then add each boron isotope.', w: R`The three chlorines can total $105, 107, 109$ or $111$. With $^{10}\mathrm{B}$: 115, 117, 119, 121. With $^{11}\mathrm{B}$: 116, 118, 120, 122. All eight are different: 8 peaks, from $m/z$ 115 to 122.` }] },
    { id: 'dilution', t: 'Diluting sulfuric acid safely', f: 'Practical skills', lv: 1, m: 6, lec: ['ci-12-1'],
      s: R`You need $250\ \mathrm{cm^3}$ of $0.500\ \mathrm{mol\ dm^{-3}}$ sulfuric acid. The stock bottle is $18.0\ \mathrm{mol\ dm^{-3}}$.`,
      p: [{ q: 'What volume of the concentrated acid do you need, in cm³?', a: 6.94, u: 'cm³', tol: 0.01, h: 'The moles of acid stay the same when you dilute.', w: R`Moles needed $= 0.250 \times 0.500 = 0.125\ \mathrm{mol}$. Volume $= 0.125 \div 18.0 = 6.94 \times 10^{-3}\ \mathrm{dm^3} = 6.94\ \mathrm{cm^3}$.` },
        { q: 'Describe how you make the solution, and say why the order matters.', h: 'Think about what happens when concentrated acid meets a little water.', w: 'Half-fill a 250 cm³ volumetric flask with distilled water. Measure 6.94 cm³ of acid with a burette or graduated pipette and add it slowly to the water, swirling, with the flask cool. Make up to the mark with water, stopper and invert. Always add acid to water: the dilution is very exothermic, and adding water to the acid can boil the water at the surface and spray out concentrated acid.' }] },
    { id: 'dolomite', t: 'Heating a carbonate mixture', f: 'Stoichiometry', lv: 2, m: 10, lec: ['ca-10-1', 'ca-2-4'],
      s: R`$10.00\ \mathrm{g}$ of a mixture of calcium carbonate and magnesium carbonate is heated strongly until the mass stops changing. The mass falls by $4.80\ \mathrm{g}$. ($M$: $\mathrm{CaCO_3}$ 100.09, $\mathrm{MgCO_3}$ 84.31, $\mathrm{CO_2}$ 44.01.)`,
      p: [{ q: 'How many moles of CO₂ were given off?', a: 0.1091, u: 'mol', tol: 0.01, h: 'The mass lost is all carbon dioxide.', w: R`$4.80 \div 44.01 = 0.1091\ \mathrm{mol}$.` },
        { q: 'What is the percentage by mass of calcium carbonate in the mixture?', a: 51.0, u: '%', tol: 0.015, h: 'Two unknowns, two equations: one for the total mass, one for the moles of CO₂.', w: R`Let $x$ and $y$ be the moles of $\mathrm{CaCO_3}$ and $\mathrm{MgCO_3}$. $x + y = 0.1091$ and $100.09x + 84.31y = 10.00$. Substituting: $15.78x = 10.00 - 84.31 \times 0.1091 = 0.804$, so $x = 0.0510\ \mathrm{mol}$, a mass of $5.10\ \mathrm{g}$: $51.0\%$.` },
        { q: 'Why does magnesium carbonate decompose at a lower temperature than calcium carbonate?', h: 'Compare the sizes and charges of the two cations.', w: R`$\mathrm{Mg^{2+}}$ is smaller than $\mathrm{Ca^{2+}}$ with the same charge, so it has a higher charge density. It polarises the carbonate ion more, distorting its electron cloud and weakening a C–O bond, so $\mathrm{CO_2}$ is released more easily.` }] },
    { id: 'antacid', t: 'An antacid by back titration', f: 'Analysis', lv: 2, m: 10, lec: ['ci-12-2'],
      s: R`A $1.200\ \mathrm{g}$ antacid tablet contains calcium carbonate. It is added to $50.0\ \mathrm{cm^3}$ of $0.500\ \mathrm{mol\ dm^{-3}}$ HCl, an excess. When the fizzing stops, the remaining acid needs $22.40\ \mathrm{cm^3}$ of $0.200\ \mathrm{mol\ dm^{-3}}$ NaOH.`,
      p: [{ q: 'How many moles of HCl reacted with the tablet?', a: 0.02052, u: 'mol', tol: 0.01, h: 'Acid added minus acid left over.', w: R`Added: $0.0500 \times 0.500 = 0.02500$. Left: $0.02240 \times 0.200 = 0.00448$. Reacted: $0.02052\ \mathrm{mol}$.` },
        { q: 'What is the percentage by mass of CaCO₃ in the tablet?', a: 85.6, u: '%', tol: 0.01, h: 'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂', w: R`Moles $\mathrm{CaCO_3} = 0.02052 \div 2 = 0.01026$. Mass $= 0.01026 \times 100.09 = 1.027\ \mathrm{g}$. $1.027 \div 1.200 = 85.6\%$.` },
        { q: 'Why is a back titration used here instead of titrating the tablet directly?', h: 'Think about how quickly a solid tablet reacts.', w: 'The tablet is a solid that dissolves and reacts slowly, so a direct titration would have no sharp end point. Reacting it completely with a known excess of acid, then titrating what is left, gives a clean, fast end point.' }] },
    { id: 'n2o4', t: 'Brown gas in a flask', f: 'Equilibrium', lv: 2, m: 12, lec: ['ca-7-1', 'ca-4-1'],
      s: R`$9.20\ \mathrm{g}$ of $\mathrm{N_2O_4}$ ($0.100\ \mathrm{mol}$) is sealed in a $5.00\ \mathrm{dm^3}$ flask at $298\ \mathrm{K}$. It partly dissociates: $\mathrm{N_2O_4(g) \rightleftharpoons 2NO_2(g)}$, with $K_p = 0.148$ (pressures in bar) at $298\ \mathrm{K}$.`,
      p: [{ q: 'What would the pressure be, in bar, if no N₂O₄ dissociated?', a: 0.4955, u: 'bar', tol: 0.01, h: 'pV = nRT, then 1 bar = 10⁵ Pa.', w: R`$p_0 = 0.100 \times 8.314 \times 298 \div 0.00500 = 49\,550\ \mathrm{Pa} = 0.4955\ \mathrm{bar}$.` },
        { q: 'Find the fraction α of N₂O₄ that dissociates.', a: 0.238, u: '', tol: 0.015, h: 'p(N₂O₄) = p₀(1 − α) and p(NO₂) = 2αp₀. Substitute into Kp and solve the quadratic.', w: R`$K_p = \dfrac{(2\alpha p_0)^2}{p_0(1-\alpha)} = \dfrac{4\alpha^2 p_0}{1-\alpha}$, so $1.982\alpha^2 + 0.148\alpha - 0.148 = 0$, giving $\alpha = 0.238$.` },
        { q: 'What is the total pressure at equilibrium, in bar?', a: 0.614, u: 'bar', tol: 0.01, h: 'Add the two partial pressures.', w: R`$p = p_0(1-\alpha) + 2\alpha p_0 = p_0(1+\alpha) = 0.4955 \times 1.238 = 0.614\ \mathrm{bar}$.` },
        { q: 'The flask is warmed and the colour darkens. What does this tell you about ΔH for the dissociation?', h: 'NO₂ is the brown gas.', w: R`More brown $\mathrm{NO_2}$ forms on heating, so the equilibrium moves forward when heat is supplied: the dissociation is endothermic, $\Delta H > 0$. (It breaks an N–N bond and makes nothing.)` }] },
    { id: 'ethanoic', t: 'Titrating a weak acid', f: 'Equilibrium', lv: 2, m: 12, lec: ['ca-25-1'],
      s: R`$25.0\ \mathrm{cm^3}$ of $0.100\ \mathrm{mol\ dm^{-3}}$ ethanoic acid ($K_a = 1.75 \times 10^{-5}$) is titrated with $0.100\ \mathrm{mol\ dm^{-3}}$ NaOH at $25\ ^\circ\mathrm{C}$ ($K_w = 1.00 \times 10^{-14}$).`,
      p: [{ q: 'What is the pH before any alkali is added?', a: 2.88, u: '', tol: 0, abs: 0.02, h: 'For a weak acid, [H⁺] ≈ √(Ka × c).', w: R`$[\mathrm{H^+}] = \sqrt{1.75 \times 10^{-5} \times 0.100} = 1.32 \times 10^{-3}$, so $\mathrm{pH} = 2.88$.` },
        { q: 'What is the pH after 12.50 cm³ of NaOH has been added?', a: 4.76, u: '', tol: 0, abs: 0.02, h: 'This is half-way to the equivalence point. What is true of [HA] and [A⁻] there?', w: R`Half the acid has been neutralised, so $[\mathrm{HA}] = [\mathrm{A^-}]$ and $\mathrm{pH} = \mathrm{p}K_a = -\log(1.75 \times 10^{-5}) = 4.76$.` },
        { q: 'What is the pH at the equivalence point?', a: 8.73, u: '', tol: 0, abs: 0.03, h: 'At equivalence you have 0.0500 mol dm⁻³ sodium ethanoate (the volume has doubled). The ethanoate ion is a weak base: Kb = Kw ÷ Ka.', w: R`$K_b = 10^{-14} \div 1.75 \times 10^{-5} = 5.71 \times 10^{-10}$. $[\mathrm{OH^-}] = \sqrt{5.71 \times 10^{-10} \times 0.0500} = 5.35 \times 10^{-6}$, $\mathrm{pOH} = 5.27$, $\mathrm{pH} = 8.73$. So phenolphthalein, not methyl orange, is the right indicator.` }] },
    { id: 'methane-hess', t: 'Methane from combustion data', f: 'Thermodynamics', lv: 2, m: 10, lec: ['ca-5-2', 'ca-5-1'],
      s: R`Standard enthalpies of combustion, in $\mathrm{kJ\ mol^{-1}}$: graphite $-393.5$, hydrogen $-285.8$, methane $-890.3$. Enthalpy of atomisation of graphite $+716.7$; H–H bond enthalpy $+436.0$.`,
      p: [{ q: 'Calculate the standard enthalpy of formation of methane, in kJ mol⁻¹.', a: -74.8, u: 'kJ mol⁻¹', tol: 0.01, h: 'ΔfH = (combustion of the elements) − (combustion of the compound).', w: R`$\Delta_f H = -393.5 + 2(-285.8) - (-890.3) = -74.8\ \mathrm{kJ\ mol^{-1}}$.` },
        { q: 'Use your answer to find the mean C–H bond enthalpy in methane, in kJ mol⁻¹.', a: 415.9, u: 'kJ mol⁻¹', tol: 0.01, h: 'Build CH₄(g) → C(g) + 4H(g) from atomising carbon, breaking two H–H bonds, and reversing the formation.', w: R`$\mathrm{CH_4 \rightarrow C(g) + 4H(g)}$: $\Delta H = +74.8 + 716.7 + 2 \times 436.0 = 1663.5\ \mathrm{kJ\ mol^{-1}}$. Four C–H bonds: $1663.5 \div 4 = 415.9\ \mathrm{kJ\ mol^{-1}}$.` }] },
    { id: 'mgcl2-bh', t: 'Lattice energy of magnesium chloride', f: 'Thermodynamics', lv: 2, m: 10, lec: ['ca-23-1'],
      s: R`Data in $\mathrm{kJ\ mol^{-1}}$: $\Delta_f H(\mathrm{MgCl_2}) = -641.3$; atomisation of Mg $+147.7$; first and second ionisation energies of Mg $+737.7$ and $+1450.7$; Cl–Cl bond enthalpy $+242.4$; electron affinity of Cl $-348.6$.`,
      p: [{ q: 'Calculate the lattice energy (formation of the lattice from gaseous ions) of MgCl₂, in kJ mol⁻¹.', a: -2522.6, u: 'kJ mol⁻¹', tol: 0.005, h: 'You need two chlorine atoms, so break one Cl–Cl bond and use the electron affinity twice.', w: R`Steps to the gaseous ions: $147.7 + 737.7 + 1450.7 + 242.4 + 2(-348.6) = +1881.3$. Lattice energy $= -641.3 - 1881.3 = -2522.6\ \mathrm{kJ\ mol^{-1}}$.` },
        { q: 'Why is this so much more exothermic than the lattice energy of NaCl (−787)?', h: 'Charge and size of the cation.', w: R`$\mathrm{Mg^{2+}}$ has twice the charge of $\mathrm{Na^+}$ and is smaller, so the attraction to each chloride is much stronger. There are also two chloride ions per formula unit.` }] },
    { id: 'n2o5', t: 'A first-order decomposition', f: 'Kinetics', lv: 2, m: 10, lec: ['ca-26-1', 'ca-8-2'],
      s: R`Dinitrogen pentoxide decomposes in a first-order reaction, with $k = 6.2 \times 10^{-4}\ \mathrm{s^{-1}}$ at $318\ \mathrm{K}$.`,
      p: [{ q: 'What is the half-life, in seconds?', a: 1118, u: 's', tol: 0.01, h: 'For first order, t½ = ln 2 ÷ k.', w: R`$t_{1/2} = 0.693 \div 6.2 \times 10^{-4} = 1.12 \times 10^3\ \mathrm{s}$ (about 19 minutes). It does not depend on the starting concentration.` },
        { q: 'How long, in seconds, until only 10% of the N₂O₅ is left?', a: 3714, u: 's', tol: 0.01, h: 'Integrated first-order law: ln([A]₀/[A]) = kt.', w: R`$t = \ln 10 \div k = 2.303 \div 6.2 \times 10^{-4} = 3.71 \times 10^3\ \mathrm{s}$: a little over three half-lives.` },
        { q: 'For another reaction the rate constant doubles between 298 K and 308 K. What is its activation energy, in kJ mol⁻¹?', a: 52.9, u: 'kJ mol⁻¹', tol: 0.015, h: 'ln(k₂/k₁) = (Ea/R)(1/T₁ − 1/T₂).', w: R`$E_a = \dfrac{R \ln 2}{1/298 - 1/308} = \dfrac{8.314 \times 0.693}{1.090 \times 10^{-4}} = 5.29 \times 10^4\ \mathrm{J\ mol^{-1}} = 52.9\ \mathrm{kJ\ mol^{-1}}$. This is the origin of the rule that rates double for every 10 °C.` }] },
    { id: 'rate-law', t: 'Reading a rate equation', f: 'Kinetics', lv: 1, m: 6, lec: ['ca-26-1'],
      s: R`For $\mathrm{2NO(g) + O_2(g) \rightarrow 2NO_2(g)}$, the rate equation is $\text{rate} = k[\mathrm{NO}]^2[\mathrm{O_2}]$.`,
      p: [{ q: 'The concentration of NO is tripled and that of O₂ is halved. By what factor does the rate change?', a: 4.5, u: '', tol: 0.001, h: 'Raise each factor to its order, then multiply.', w: R`$3^2 \times 0.5 = 4.5$: the rate goes up four and a half times.` },
        { q: 'What are the units of k, if concentrations are in mol dm⁻³ and time in seconds?', h: 'rate has units mol dm⁻³ s⁻¹; the overall order is 3.', w: R`$k = \dfrac{\text{rate}}{[\mathrm{NO}]^2[\mathrm{O_2}]}$, so units are $\mathrm{mol\ dm^{-3}\ s^{-1}} \div (\mathrm{mol\ dm^{-3}})^3 = \mathrm{dm^6\ mol^{-2}\ s^{-1}}$.` }] },
    { id: 'zn-ag', t: 'A zinc–silver cell', f: 'Electrochemistry', lv: 2, m: 10, lec: ['ca-24-2'],
      s: R`$E^\ominus(\mathrm{Zn^{2+}/Zn}) = -0.76\ \mathrm{V}$ and $E^\ominus(\mathrm{Ag^+/Ag}) = +0.80\ \mathrm{V}$. $F = 96\,485\ \mathrm{C\ mol^{-1}}$; at $298\ \mathrm{K}$, $RT/F = 0.0257\ \mathrm{V}$.`,
      p: [{ q: 'What is the standard cell potential, in volts?', a: 1.56, u: 'V', tol: 0.005, h: 'More positive minus more negative.', w: R`$E^\ominus_{cell} = 0.80 - (-0.76) = +1.56\ \mathrm{V}$. Zinc is oxidised; silver ions are reduced.` },
        { q: 'Calculate ΔG° for Zn + 2Ag⁺ → Zn²⁺ + 2Ag, in kJ mol⁻¹.', a: -301, u: 'kJ mol⁻¹', tol: 0.01, h: 'ΔG° = −nFE°. How many electrons are transferred?', w: R`$n = 2$: $\Delta G^\ominus = -2 \times 96\,485 \times 1.56 = -3.01 \times 10^5\ \mathrm{J\ mol^{-1}} = -301\ \mathrm{kJ\ mol^{-1}}$.` },
        { q: 'The silver ion concentration is lowered to 0.010 mol dm⁻³ (zinc ions stay at 1.0 mol dm⁻³). What is the cell potential now, in volts?', a: 1.44, u: 'V', tol: 0.005, h: 'Nernst: E = E° − (RT/nF) ln Q, with Q = [Zn²⁺]/[Ag⁺]².', w: R`$Q = 1.0 \div 0.010^2 = 10^4$. $E = 1.56 - \dfrac{0.0257}{2}\ln 10^4 = 1.56 - 0.118 = 1.44\ \mathrm{V}$.` }] },
    { id: 'iron-tablet', t: 'Iron in a tablet', f: 'Analysis', lv: 2, m: 8, lec: ['ca-6-1', 'ci-12-2'],
      s: R`An iron tablet is dissolved in dilute sulfuric acid. The $\mathrm{Fe^{2+}}$ ions need $12.50\ \mathrm{cm^3}$ of $0.0200\ \mathrm{mol\ dm^{-3}}$ potassium manganate(VII): $\mathrm{MnO_4^- + 5Fe^{2+} + 8H^+ \rightarrow Mn^{2+} + 5Fe^{3+} + 4H_2O}$.`,
      p: [{ q: 'What mass of iron, in mg, is in the tablet? (Fe = 55.85)', a: 69.8, u: 'mg', tol: 0.01, h: 'Moles of manganate(VII), then use the 1 : 5 ratio.', w: R`$n(\mathrm{MnO_4^-}) = 0.01250 \times 0.0200 = 2.50 \times 10^{-4}$. $n(\mathrm{Fe^{2+}}) = 1.25 \times 10^{-3}$. Mass $= 1.25 \times 10^{-3} \times 55.85 = 0.0698\ \mathrm{g} = 69.8\ \mathrm{mg}$.` },
        { q: 'Why is no indicator needed?', h: 'What colour is manganate(VII)? What colour is Mn²⁺?', w: 'Manganate(VII) is deep purple and Mn²⁺ is almost colourless. The first drop in excess turns the solution permanently pale pink, so the reagent is its own indicator.' }] },
    { id: 'butanone', t: 'Identify the ketone', f: 'Organic', lv: 2, m: 8, lec: ['ca-17-1', 'ca-29-4'],
      s: R`Compound X, $\mathrm{C_4H_8O}$, gives an orange precipitate with 2,4-DNPH, does not react with Tollens’ reagent, and gives a yellow precipitate with alkaline iodine. Reduction of X with $\mathrm{NaBH_4}$ gives Y.`,
      p: [{ q: 'How many double-bond equivalents (rings plus π bonds) does X have?', a: 1, u: '', tol: 0, h: 'DBE = (2C + 2 − H) ÷ 2, ignoring oxygen.', w: R`$(2 \times 4 + 2 - 8) \div 2 = 1$: one C=O, which the 2,4-DNPH test confirms.` },
        { q: 'Name X.', h: 'Not an aldehyde (Tollens). The iodoform test needs a CH₃C=O group.', w: R`Butanone, $\mathrm{CH_3COCH_2CH_3}$: a ketone with a methyl group next to the C=O.` },
        { q: 'How many stereoisomers of Y are there?', a: 2, u: '', tol: 0, h: 'Draw Y, butan-2-ol. Look at carbon 2.', w: 'Y is butan-2-ol. Carbon 2 carries H, OH, CH₃ and C₂H₅: four different groups, a chiral centre. So there are two enantiomers. NaBH₄ attacks the flat C=O equally from both faces, so Y forms as a racemic mixture.' }] },
    { id: 'pbi2', t: 'Golden rain', f: 'Equilibrium', lv: 2, m: 8, lec: ['ca-25-1'],
      s: R`Lead(II) iodide forms beautiful yellow crystals. $K_{sp}(\mathrm{PbI_2}) = 9.8 \times 10^{-9}\ \mathrm{mol^3\ dm^{-9}}$ at $25\ ^\circ\mathrm{C}$.`,
      p: [{ q: 'What is the solubility of PbI₂ in pure water, in mol dm⁻³?', a: 1.35e-3, u: 'mol dm⁻³', tol: 0.015, h: 'If s mol dissolves, [Pb²⁺] = s and [I⁻] = 2s.', w: R`$K_{sp} = s(2s)^2 = 4s^3$, so $s = (9.8 \times 10^{-9} \div 4)^{1/3} = 1.35 \times 10^{-3}\ \mathrm{mol\ dm^{-3}}$.` },
        { q: 'What is its solubility in 0.10 mol dm⁻³ KI, in mol dm⁻³?', a: 9.8e-7, u: 'mol dm⁻³', tol: 0.02, h: 'Now [I⁻] ≈ 0.10, from the KI.', w: R`$s = K_{sp} \div [\mathrm{I^-}]^2 = 9.8 \times 10^{-9} \div 0.010 = 9.8 \times 10^{-7}\ \mathrm{mol\ dm^{-3}}$: over a thousand times less. This is the common ion effect.` }] },
    { id: 'nacl-cell', t: 'The rock salt unit cell', f: 'Bonding and structure', lv: 3, m: 12, lec: ['ca-4-2', 'ca-3-2'],
      s: R`Sodium chloride has a cubic unit cell with edge $a = 564\ \mathrm{pm}$. Na⁺ ions sit at the corners and face centres; Cl⁻ ions at the edge centres and the body centre. ($N_A = 6.022 \times 10^{23}$; NaCl = 58.44.)`,
      p: [{ q: 'How many NaCl formula units are in one unit cell?', a: 4, u: '', tol: 0, h: 'A corner is shared by 8 cells, a face by 2, an edge by 4.', w: R`Na⁺: $8 \times \tfrac18 + 6 \times \tfrac12 = 4$. Cl⁻: $12 \times \tfrac14 + 1 = 4$. So 4 formula units.` },
        { q: 'Calculate the density of NaCl, in g cm⁻³.', a: 2.16, u: 'g cm⁻³', tol: 0.01, h: 'Density = (mass of 4 formula units) ÷ a³. 1 pm = 10⁻¹⁰ cm.', w: R`Mass $= 4 \times 58.44 \div 6.022 \times 10^{23} = 3.882 \times 10^{-22}\ \mathrm{g}$. Volume $= (5.64 \times 10^{-8}\ \mathrm{cm})^3 = 1.794 \times 10^{-22}\ \mathrm{cm^3}$. Density $= 2.16\ \mathrm{g\ cm^{-3}}$, close to the measured $2.17$.` },
        { q: 'What is the coordination number of each ion?', a: 6, u: '', tol: 0, h: 'Count the nearest opposite ions around the body-centre Cl⁻.', w: 'The body-centre Cl⁻ is surrounded by the six face-centre Na⁺ ions, at the corners of an octahedron: 6:6 coordination.' }] },
    { id: 'iron-complexes', t: 'Two iron(II) complexes', f: 'Inorganic', lv: 3, m: 12, lec: ['ca-28-1', 'ca-28-3'],
      s: R`$[\mathrm{Fe(H_2O)_6}]^{2+}$ is pale green and paramagnetic. $[\mathrm{Fe(CN)_6}]^{4-}$ is pale yellow and diamagnetic. Both are octahedral iron(II), $d^6$.`,
      p: [{ q: 'How many unpaired electrons does the aqua complex (high spin) have?', a: 4, u: '', tol: 0, h: 'Small splitting: put one electron in each of the five d orbitals before pairing.', w: R`$t_{2g}^4 e_g^2$: five orbitals, six electrons, one pair. Four unpaired.` },
        { q: 'Estimate its spin-only magnetic moment, in Bohr magnetons.', a: 4.90, u: 'μB', tol: 0.01, h: 'μ = √(n(n + 2)).', w: R`$\mu = \sqrt{4 \times 6} = \sqrt{24} = 4.90\ \mu_B$.` },
        { q: 'Cyanide is a strong-field ligand. What is the crystal field stabilisation energy of the low-spin complex, in units of Δo (ignore pairing energy)?', a: -2.4, u: 'Δo', tol: 0.01, h: 't₂g orbitals are 0.4Δo below the average; eg orbitals 0.6Δo above.', w: R`Low spin: $t_{2g}^6 e_g^0$. CFSE $= 6 \times (-0.4\Delta_o) = -2.4\Delta_o$. All electrons are paired, so the complex is diamagnetic.` }] },
    { id: 'haber-g', t: 'When does ammonia stop forming?', f: 'Thermodynamics', lv: 3, m: 12, lec: ['ca-23-4', 'ca-7-1'],
      s: R`For $\mathrm{N_2(g) + 3H_2(g) \rightleftharpoons 2NH_3(g)}$: $\Delta H^\ominus = -92.2\ \mathrm{kJ\ mol^{-1}}$ and $\Delta S^\ominus = -198.7\ \mathrm{J\ K^{-1}\ mol^{-1}}$. Assume both are constant with temperature.`,
      p: [{ q: 'Calculate ΔG° at 298 K, in kJ mol⁻¹.', a: -33.0, u: 'kJ mol⁻¹', tol: 0.015, h: 'ΔG = ΔH − TΔS; convert ΔS to kJ.', w: R`$\Delta G^\ominus = -92.2 - 298 \times (-0.1987) = -33.0\ \mathrm{kJ\ mol^{-1}}$.` },
        { q: 'Calculate the equilibrium constant K at 298 K.', a: 6.1e5, u: '', tol: 0.04, h: 'ΔG° = −RT ln K.', w: R`$\ln K = 33\,000 \div (8.314 \times 298) = 13.3$, so $K = 6.1 \times 10^5$.` },
        { q: 'Above what temperature, in kelvin, does K fall below 1?', a: 464, u: 'K', tol: 0.01, h: 'K = 1 when ΔG° = 0.', w: R`$T = \Delta H \div \Delta S = 92\,200 \div 198.7 = 464\ \mathrm{K}$. The Haber process runs at about 700 K anyway, accepting a smaller K for a faster rate, and uses high pressure to push the yield back up.` }] },
    { id: 'hydrogen-lines', t: 'The red line of hydrogen', f: 'Atomic structure', lv: 3, m: 10, lec: ['ca-1-3'],
      s: R`The energy levels of the hydrogen atom are $E_n = -R_H/n^2$ with $R_H = 2.18 \times 10^{-18}\ \mathrm{J}$. ($h = 6.626 \times 10^{-34}\ \mathrm{J\ s}$, $c = 2.998 \times 10^8\ \mathrm{m\ s^{-1}}$.)`,
      p: [{ q: 'Calculate the wavelength, in nm, of light emitted when an electron falls from n = 3 to n = 2.', a: 656, u: 'nm', tol: 0.01, h: 'ΔE = R_H(1/4 − 1/9), then λ = hc/ΔE.', w: R`$\Delta E = 2.18 \times 10^{-18} \times (\tfrac14 - \tfrac19) = 3.03 \times 10^{-19}\ \mathrm{J}$. $\lambda = hc/\Delta E = 6.56 \times 10^{-7}\ \mathrm{m} = 656\ \mathrm{nm}$: the red line in the hydrogen spectrum.` },
        { q: 'Calculate the ionisation energy of hydrogen, in kJ mol⁻¹.', a: 1313, u: 'kJ mol⁻¹', tol: 0.01, h: 'From n = 1 to n = ∞, then multiply by the Avogadro constant.', w: R`$2.18 \times 10^{-18} \times 6.022 \times 10^{23} = 1.313 \times 10^6\ \mathrm{J\ mol^{-1}} = 1313\ \mathrm{kJ\ mol^{-1}}$, matching the measured 1312.` }] },
    { id: 'ester-nmr', t: 'Two singlets', f: 'Analysis', lv: 3, m: 10, lec: ['ca-37-4', 'ca-22-1'],
      s: R`Compound Z, $\mathrm{C_3H_6O_2}$, has a strong IR absorption at $1740\ \mathrm{cm^{-1}}$ and no broad absorption around $3000$–$3300\ \mathrm{cm^{-1}}$. Its $^1\mathrm{H}$ NMR spectrum shows only two signals, both singlets, each of three protons, at $\delta$ 3.7 and 2.0.`,
      p: [{ q: 'How many double-bond equivalents does Z have?', a: 1, u: '', tol: 0, h: 'DBE = (2C + 2 − H) ÷ 2.', w: R`$(6 + 2 - 6) \div 2 = 1$: the C=O seen in the IR.` },
        { q: 'Identify Z.', h: 'No O–H, so not a carboxylic acid. Two methyl groups with no neighbouring H.', w: R`Methyl ethanoate, $\mathrm{CH_3COOCH_3}$. The $\mathrm{OCH_3}$ is deshielded by oxygen ($\delta$ 3.7); the $\mathrm{CH_3}$ next to C=O is at $\delta$ 2.0. Neither has H on the neighbouring atom, so both are singlets. (Its isomer ethyl methanoate would show a quartet and a triplet.)` },
        { q: 'How many peaks does Z show in its ¹³C NMR spectrum?', a: 3, u: '', tol: 0, h: 'Count the carbon environments.', w: 'Three: the C=O carbon, the O–CH₃ carbon and the C–CH₃ carbon are all different.' }] },
    { id: 'polyethene', t: 'How long is a polymer chain?', f: 'Polymers', lv: 1, m: 5, lec: ['ca-20-1'],
      s: R`A sample of poly(ethene) has an average relative molecular mass of $140\,000$.`,
      p: [{ q: 'On average, how many ethene units are in each chain?', a: 4991, u: '', tol: 0.01, h: 'Divide by the Mr of the repeat unit, C₂H₄.', w: R`$M_r(\mathrm{C_2H_4}) = 28.05$; $140\,000 \div 28.05 \approx 4990$ units, so about 10 000 carbon atoms in a row.` }] },
  ];
  // a card preview: cut at a word, and never inside a $…$ formula
  const short = t => { if (t.length <= 170) return t; let c = t.slice(0, t.lastIndexOf(' ', 160)); if ((c.match(/\$/g) || []).length % 2) c = c.slice(0, c.lastIndexOf('$')); return c.trim() + ' …'; };
  const LV = { 1: 'Entry', 2: 'Intermediate', 3: 'Advanced' };
  const PAPERS = (window.OLY_PAST || []).map(pp => ({ ...pp, key: pp.c + String(pp.y).slice(2) }));
  const PAST = PAPERS.flatMap(pp => pp.qs.map(q => ({ ...q, paper: pp })));
  const ALLP = P.concat(PAST), findP = id => ALLP.find(x => x.id === id);
  const pname = pp => `${pp.comp} ${pp.round} ${pp.y}`;
  const FIELDS = [...new Set(P.map(p => p.f))];

  /* ---------------- answers ---------------- */
  function num(s) {
    const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
    s = String(s).trim().replace(/[−–]/g, '-').replace(/,/g, '').replace(/⁻/g, '-').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, c => SUP.indexOf(c));
    s = s.replace(/(\d(?:\.\d+)?)\s*(?:[×x*]\s*10\s*\^?\s*|e)\(?\s*([+-]?\d+)\)?/i, '$1e$2');
    const m = /-?\d*\.?\d+(e[+-]?\d+)?/i.exec(s); return m ? parseFloat(m[0]) : NaN;
  }
  const ok = (part, v) => { const a = part.a; if (part.abs != null) return Math.abs(v - a) <= part.abs + 1e-12; return a === 0 ? Math.abs(v) < 1e-9 : Math.abs(v - a) <= Math.abs(a) * ((part.tol || 0.01) + 1e-9); };
  const prog = () => store.get('gc.oly', {});
  const solvedParts = id => (prog()[id] || []).length;
  const numeric = p => p.p.filter(x => x.a != null).length;

  /* ---------------- pages ---------------- */
  const TABS = [['olympiad', 'Overview'], ['olympiad-train', 'Training'], ['olympiad-competitions', 'Competitions'], ['olympiad-syllabus', 'IChO syllabus'], ['olympiad-practice', 'Practice'], ['olympiad-papers', 'Past papers']];
  const TRAINSUB = /^olympiad-(m-|review$|sprint$)/;
  const head = (h, title, lede) => `<nav class="crumbs" aria-label="Breadcrumb"><a href="#chemistry">Chemistry</a><span>${h === 'olympiad' ? 'Olympiad' : '<a href="#olympiad">Olympiad</a>'}</span>${TRAINSUB.test(h) ? '<span><a href="#olympiad-train">Training</a></span>' : ''}${h.startsWith('olympiad-p-') && (findP(h.slice(11)) || {}).paper ? `<span><a href="#olympiad-papers">Past papers</a></span><span><a href="#olympiad-papers-${findP(h.slice(11)).paper.c}">${esc(ppName(findP(h.slice(11)).paper.c))}</a></span>` : ''}${h.startsWith('olympiad-papers-') ? '<span><a href="#olympiad-papers">Past papers</a></span>' : ''}${h !== 'olympiad' ? `<span>${esc(title)}</span>` : ''}</nav>
    <header class="page-head ol-head"><p class="kicker">${h === 'olympiad-train' || TRAINSUB.test(h) ? 'Olympiad Training' : 'Chemistry Olympiad'}</p><h1>${title}</h1>${lede ? `<p>${lede}</p>` : ''}</header>
    <nav class="ol-tabs" aria-label="Olympiad">${TABS.map(([k, l]) => `<a href="#${k}" class="${h === k || (k === 'olympiad-practice' && h.startsWith('olympiad-p-') && !(findP(h.slice(11)) || {}).paper) || (k === 'olympiad-papers' && (h.startsWith('olympiad-papers-') || (h.startsWith('olympiad-p-') && !!(findP(h.slice(11)) || {}).paper))) || (k === 'olympiad-train' && TRAINSUB.test(h)) ? 'is-on' : ''}">${l}</a>`).join('')}</nav>`;

  function overview() {
    const done = P.filter(p => solvedParts(p.id) >= numeric(p) && numeric(p)).length;
    return `<div class="page ol">${head('olympiad', 'Chemistry beyond the syllabus.', 'The Chemistry Olympiad asks you to use what you know on chemistry you have never seen: a new reaction, an unfamiliar molecule, a page of data. This section shows you the competitions, the syllabus they share, and problems to practise on, with every step worked.')}
      <section class="ol-ladder" aria-label="How the competitions connect">
        <div class="ol-rung"><b>1</b><h3>Warm up</h3><p>C3L6 for Year 12 and below; the USNCO Local Exam for fast multiple-choice practice.</p></div>
        <div class="ol-rung"><b>2</b><h3>National olympiad</h3><p>UK Chemistry Olympiad Round 1, the USNCO, or your own country’s olympiad.</p></div>
        <div class="ol-rung"><b>3</b><h3>Training and selection</h3><p>Camps and further rounds choose a team of four.</p></div>
        <div class="ol-rung top"><b>4</b><h3>IChO</h3><p>Two exams, theory and practical, in July. 2026 was Tashkent; 2027 is Chinese Taipei.</p></div>
      </section>
      ${window.Training ? `<a class="tr-banner" href="#olympiad-train"><div><span class="kicker">New · ${window.Training.count} modules</span><h2>Training: a complete course, from moles to crystal field theory.</h2><p>Learn a concept, check it at once, follow a worked example one question at a time, climb a ladder of problems with hints and step-by-step solutions, then lock it in with flashcards and spaced review. Plans for C3L6, UKChO, USNCO and the IChO.</p></div><span class="btn">Start training ${ARROW}</span></a>` : ''}
      <div class="ol-grid">
        <a class="ol-card panel" href="#olympiad-competitions"><span class="kicker">${COMPS.length} competitions</span><h2>Competitions</h2><p>Who can enter, what the papers look like, when they run, and where they lead.</p><span class="go">See the competitions ${ARROW}</span></a>
        <a class="ol-card panel" href="#olympiad-syllabus"><span class="kicker">${SYL.length} fields</span><h2>IChO syllabus</h2><p>What every competitor is expected to know, what goes beyond, and where to learn each part on this site.</p><span class="go">Open the syllabus map ${ARROW}</span></a>
        <a class="ol-card panel" href="#olympiad-practice"><span class="kicker">${P.length} problems · ${done} finished</span><h2>Practice</h2><p>Original olympiad-style problems at three levels, each marked as you go, with hints and full worked solutions.</p><span class="go">Start practising ${ARROW}</span></a>
        <a class="ol-card panel" href="#olympiad-papers"><span class="kicker">${PAPERS.length} papers · ${PAST.length} questions</span><h2>Past papers</h2><p>Real past-paper questions recreated with new numbers, marked as you type, with worked solutions.</p><span class="go">Open the past papers ${ARROW}</span></a>
      </div>
      <section class="ol-sec"><h2>How to prepare</h2>
        <ol class="ol-steps">
          <li><b>Finish the A Level content first.</b> Olympiad papers assume all of it. Work through the AS and A Level stages on this site, especially equilibria, kinetics, electrochemistry and organic mechanisms.</li>
          <li><b>Learn to read a long question.</b> Olympiad questions teach you something new on the page, then test it. Underline what is given, and use every piece of data.</li>
          <li><b>Practise in levels.</b> Start with the Entry problems in Practice, then the recreated past papers, newest first.</li>
          <li><b>Go beyond the syllabus.</b> The Syllabus page lists the advanced topics, such as crystal field theory, integrated rate laws and NMR coupling, that national rounds and the IChO use.</li>
          <li><b>Mark honestly.</b> Compare every written answer with the model answer, and redo any part you needed the solution for.</li>
        </ol></section>
      <p class="ol-note">Competition details were checked against the organisers’ own websites in November 2026. The practice problems are original, written for Quilio. This section was planned with help from the structure of <a href="https://olympiax-chemistry.vercel.app/" target="_blank" rel="noopener">OlympiaX Chemistry ↗</a>.</p></div>`;
  }
  function competitions() {
    return `<div class="page ol">${head('olympiad-competitions', 'Competitions', 'From the first warm-up paper to the International Chemistry Olympiad. Each card links to the organiser, who has the final word on dates and eligibility.')}
      <div class="ol-comps">${COMPS.map(c => `<section class="ol-comp panel" id="c-${c.id}"><header><span class="ol-tag">${esc(c.short)}</span><h2>${esc(c.name)}</h2><p>${esc(c.where)}</p></header>
        <dl><div><dt>Who</dt><dd>${esc(c.who)}</dd></div><div><dt>When</dt><dd>${esc(c.when)}</dd></div></dl>
        <h3>Format</h3><ul>${c.format.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
        <p class="ol-route">${esc(c.route)}</p>
        <p class="ol-links">${c.links.map(l => EXT(l[0], esc(l[1]))).join('')}</p></section>`).join('')}</div></div>`;
  }
  function syllabus() {
    return `<div class="page ol">${head('olympiad-syllabus', 'The IChO syllabus', 'The IChO regulations divide the syllabus in two. Some concepts every competitor is expected to know. Others may be set only if the host has introduced them in its preparatory problems, published months before the competition: at most six advanced theoretical topics and two practical ones, each about a 2 to 3 hour lecture’s worth.')}
      <div class="ol-key"><span class="ol-b core">Core</span> expected of everyone; on this site in the lecture linked <span class="ol-b adv">Beyond</span> beyond A Level; national rounds use it, and the IChO only after the preparatory problems</div>
      <div class="ol-syl">${SYL.map(s => `<section class="ol-field panel"><h2>${esc(s.f)}</h2><ul>${s.core.map(c => `<li><span class="ol-b core">Core</span><span>${esc(c[0])}</span>${lec(c[1])}</li>`).join('')}${s.adv.map(a => `<li><span class="ol-b adv">Beyond</span><span>${esc(a)}</span></li>`).join('')}</ul></section>`).join('')}</div>
      <p class="ol-note">This is our map of the syllabus, made to help you plan. The official list is Appendix C of the ${EXT('https://www.icho2026.uz/regulations.pdf', 'IChO regulations')}, and each year’s preparatory problems say which advanced topics that year’s exam may use.</p></div>`;
  }
  let filt = { f: '', lv: '' };
  function practice() {
    const list = P.filter(p => (!filt.f || p.f === filt.f) && (!filt.lv || String(p.lv) === filt.lv));
    return `<div class="page ol">${head('olympiad-practice', 'Practice problems', `${P.length} original problems in the olympiad style, each in several parts. Numerical parts are checked as you type; written parts have a model answer to compare with. Every part has a hint and a full worked solution.`)}
      <div class="filterbar ol-filter"><select id="olF" aria-label="Field"><option value="">All fields</option>${FIELDS.map(f => `<option${filt.f === f ? ' selected' : ''}>${esc(f)}</option>`).join('')}</select>
        <div class="seg" role="group" aria-label="Level">${[['', 'All levels'], ['1', 'Entry'], ['2', 'Intermediate'], ['3', 'Advanced']].map(([k, l]) => `<button type="button" data-lv="${k}" class="${filt.lv === k ? 'is-on' : ''}">${l}</button>`).join('')}</div>
        <button type="button" class="btn small" data-random>A random problem</button></div>
      <div class="ol-probs">${list.map(p => { const n = numeric(p), d = Math.min(n, solvedParts(p.id)); return `<a class="ol-prob panel${n && d >= n ? ' is-done' : ''}" href="#olympiad-p-${p.id}"><div class="ol-prob-top"><span class="ol-lv l${p.lv}">${LV[p.lv]}</span><span>${esc(p.f)}</span><span>${p.m} min</span></div><h3>${esc(p.t)}</h3><p>${il(short(p.s))}</p><div class="meter"><i style="--v:${n ? Math.round(d / n * 100) : 0}%"></i></div><small>${p.p.length} parts${n ? ` · ${d} of ${n} answers correct` : ''}</small></a>`; }).join('') || '<p class="def-wait">No problems match. Try another field or level.</p>'}</div></div>`;
  }
  function problem(id) {
    const p = findP(id); if (!p) return practice();
    const list = p.paper ? p.paper.qs.map(q => findP(q.id)) : P, i = list.findIndex(x => x.id === p.id), prev = list[i - 1], next = list[i + 1], got = new Set(prog()[p.id] || []);
    return `<div class="page ol">${head('olympiad-p-' + id, p.t, '')}
      <article class="ol-problem panel">${p.paper ? `<p class="ol-src"><b>${esc(pname(p.paper))} · Question ${p.n}</b> · the same chemistry as the original question, with new numbers</p>` : ''}<div class="ol-prob-top"><span class="ol-lv l${p.lv}">${LV[p.lv]}</span><span>${esc(p.f)}</span><span>about ${p.m} min</span><span class="ol-clock" id="olClock">0:00</span></div>
        <div class="ol-stem">${il(p.s)}</div>
        <ol class="ol-parts">${p.p.map((q, k) => `<li class="ol-part${got.has(k) ? ' is-right' : ''}" data-k="${k}"><p class="ol-q">${il(q.q)}</p>
          ${q.a != null ? `<div class="q-in"><input type="text" inputmode="decimal" autocomplete="off" aria-label="Your answer to part ${k + 1}" placeholder="your answer${q.u ? ' in ' + esc(q.u) : ''}"><button type="button" class="btn small" data-act="check">Check</button>${q.u ? `<span class="ol-unit">${esc(q.u)}</span>` : ''}</div>` : ''}
          <div class="ol-tools"><button type="button" class="chip" data-act="hint">Hint</button><button type="button" class="chip" data-act="sol">${q.a != null ? 'Worked solution' : 'Model answer'}</button></div>
          <div class="fb" hidden></div></li>`).join('')}</ol>
        ${p.lec.length ? `<p class="ol-learn">The chemistry behind it: ${p.lec.map(lec).join(' ')}</p>` : ''}</article>
      <nav class="lect-nav" aria-label="Problems">${prev ? `<a href="#olympiad-p-${prev.id}"><small>${p.paper ? `Question ${prev.n}` : 'Previous problem'}</small><b>${esc(prev.t)}</b></a>` : '<span></span>'}${next ? `<a href="#olympiad-p-${next.id}"><small>${p.paper ? `Question ${next.n}` : 'Next problem'}</small><b>${esc(next.t)}</b></a>` : p.paper ? `<a href="#olympiad-papers-${p.paper.c}"><small>End of the ${p.paper.y} paper</small><b>All ${esc(ppName(p.paper.c))} papers</b></a>` : `<a href="#olympiad-practice"><small>That was the last one</small><b>All problems</b></a>`}</nav></div>`;
  }
  const PPC = { ukcho: ['UK Chemistry Olympiad', 'UKChO', 'Round 1: the UK national paper, two hours of long, data-rich questions.'], c3l6: ['Cambridge Chemistry Challenge', 'C3L6', 'The gentler warm-up for Year 12 and below: the same style as the UKChO, shorter.'], usnco: ['US National Chemistry Olympiad', 'USNCO', 'National exam, Part II: the written problems, quick to set up and wide-ranging.'], icho: ['International Chemistry Olympiad', 'IChO', 'The theory exam of the world final: five hours, the hardest problems here.'] };
  const ppOrder = [...new Set(PAPERS.map(pp => pp.c))];
  const ppName = c => (PPC[c] || [c, c])[0];
  const ppStat = list => { const qs = list.flatMap(pp => pp.qs.map(q => findP(q.id))); const tot = qs.reduce((a, q) => a + numeric(q), 0), got = qs.reduce((a, q) => a + Math.min(numeric(q), solvedParts(q.id)), 0); return { n: qs.length, tot, got }; };
  const ppHow = `<section class="ol-sec"><h2>How to use them</h2>
        <ol class="ol-steps"><li><b>Sit a whole paper:</b> give yourself the full time and go through the questions in order, as in the real exam. The clock on each question shows the suggested time.</li>
          <li><b>Do every part you can:</b> later parts often do not need the earlier answers, so never stop at the first hard part.</li>
          <li><b>Check, then study the solution:</b> numerical answers are marked as you type; every part has a hint and a worked solution or model answer.</li>
          <li><b>Fill the gaps:</b> each question links to the lectures behind it, and the Training tab has a module for every big topic.</li></ol></section>`;
  function papers(c) {
    const nQ = PAST.length, nDone = PAST.filter(p => numeric(p) && solvedParts(p.id) >= numeric(p)).length;
    if (!c || !ppOrder.includes(c)) return `<div class="page ol">${head('olympiad-papers', 'Past papers', `Real past-paper questions, recreated: each one keeps the chemistry and the kind of task of the original question, with new wording and new numbers, so you can work it here and have every answer checked. ${nQ} questions so far, ${nDone} finished. Pick a competition to see its papers by year.`)}
      <div class="ol-ppc-grid">${ppOrder.map(k => { const list = PAPERS.filter(pp => pp.c === k), ys = list.map(pp => pp.y), st = ppStat(list), d = PPC[k] || [k, k, '']; return `<a class="ol-card ol-ppc panel" href="#olympiad-papers-${k}"><span class="kicker">${list.length} ${list.length === 1 ? 'paper' : 'papers'} · ${Math.min(...ys)}${ys.length > 1 ? '–' + Math.max(...ys) : ''}</span><h2>${esc(d[0])}</h2><p>${esc(d[2])}</p><div class="meter"><i style="--v:${st.tot ? Math.round(st.got / st.tot * 100) : 0}%"></i></div><small class="ol-pp-score">${st.n} questions · ${st.got} of ${st.tot} answers correct</small><span class="go">See the papers ${ARROW}</span></a>`; }).join('')}</div>
      ${ppHow}</div>`;
    const list = PAPERS.filter(pp => pp.c === c).sort((a, b) => b.y - a.y), d = PPC[c] || [c, c, ''];
    return `<div class="page ol">${head('olympiad-papers-' + c, d[0], `${list.length} ${list.length === 1 ? 'paper' : 'papers'}, newest first. ${esc(d[2])}`)}
      <nav class="ol-years" aria-label="Jump to a year">${list.map(pp => `<a href="#olympiad-papers-${c}" data-year="${pp.y}">${pp.y}</a>`).join('')}</nav>
      <div class="ol-pps">${list.map(pp => { const qs = pp.qs.map(q => findP(q.id)), st = ppStat([pp]); return `<article class="ol-pp panel" id="pp-${pp.y}"><header><span class="ol-tag">${esc(pp.round)}</span><h3>${pp.y}</h3><span class="ol-pp-meta">${pp.mins} min · ${qs.length} questions</span></header>
        <p class="ol-pp-topics">${esc(pp.topics)}</p><div class="meter"><i style="--v:${st.tot ? Math.round(st.got / st.tot * 100) : 0}%"></i></div><small class="ol-pp-score">${st.got} of ${st.tot} answers correct</small>
        <details class="ol-pp-more"><summary>${qs.length} questions</summary><ol class="ol-pp-qs">${qs.map(q => `<li class="${numeric(q) && solvedParts(q.id) >= numeric(q) ? 'is-done' : ''}"><a href="#olympiad-p-${q.id}"><b>Q${q.n}</b><span>${esc(q.t)}</span><em>${q.p.length} parts · ${q.m} min</em></a></li>`).join('')}</ol>
        ${pp.skipped ? `<p class="ol-note">${esc(pp.skipped)}</p>` : ''}</details><a class="btn small" href="#olympiad-p-${qs[0].id}">Start the ${pp.y} paper ${ARROW}</a></article>`; }).join('')}</div>
      <p class="ol-back"><a href="#olympiad-papers">← All competitions</a></p></div>`;
  }

  /* ---------------- events ---------------- */
  let clock = 0;
  function bind(view, h) {
    clearInterval(clock);
    if (h.startsWith('olympiad-p-')) {
      const id = h.slice(11), p = findP(id); if (!p) return; const t0 = Date.now(), el = $('#olClock');
      clock = setInterval(() => { if (!el.isConnected) { clearInterval(clock); return; } const s = Math.floor((Date.now() - t0) / 1000); el.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); el.classList.toggle('over', s > p.m * 60); }, 1000);
      const check = li => {
        const k = +li.dataset.k, q = p.p[k], fb = $('.fb', li), v = num($('input', li).value);
        if (isNaN(v)) { fb.hidden = false; fb.className = 'fb'; fb.innerHTML = 'Type a number, for example 0.238 or 6.1 × 10^5.'; return; }
        const right = ok(q, v); fb.hidden = false; fb.className = 'fb ' + (right ? 'ok' : 'no');
        fb.innerHTML = right ? `<b>Correct.</b> ${il(q.w)}` : `<b>Not yet.</b> Check your units and significant figures, or take a hint.`;
        if (right) { li.classList.add('is-right'); const all = prog(), s = new Set(all[p.id] || []); s.add(k); all[p.id] = [...s]; store.set('gc.oly', all); }
      };
      view.onclick = e => {
        const b = e.target.closest('[data-act]'); if (!b) return; const li = b.closest('.ol-part'), k = +li.dataset.k, q = p.p[k], fb = $('.fb', li);
        if (b.dataset.act === 'check') check(li);
        else if (b.dataset.act === 'hint') { fb.hidden = false; fb.className = 'fb'; fb.innerHTML = `<b>Hint.</b> ${il(q.h)}`; }
        else if (b.dataset.act === 'sol') { fb.hidden = false; fb.className = 'fb'; fb.innerHTML = `<b>${q.a != null ? 'Worked solution' : 'Model answer'}.</b> ${il(q.w)}`; }
      };
      view.onkeydown = e => { if (e.key === 'Enter' && e.target.matches('.ol-part input')) { e.preventDefault(); check(e.target.closest('.ol-part')); } };
      return;
    }
    view.onkeydown = null;
    if (h === 'olympiad-practice') {
      const sel = $('#olF'); if (sel) sel.onchange = () => { filt.f = sel.value; view.innerHTML = practice(); bind(view, h); };
      view.onclick = e => { const b = e.target.closest('[data-lv]'); if (b) { filt.lv = b.dataset.lv; view.innerHTML = practice(); bind(view, h); return; } if (e.target.closest('[data-random]')) { const pool = P.filter(p => (!filt.f || p.f === filt.f) && (!filt.lv || String(p.lv) === filt.lv)); const p = pool[Math.random() * pool.length | 0]; if (p) location.hash = 'olympiad-p-' + p.id; } };
      return;
    }
    if (h.startsWith('olympiad-papers-')) { view.onclick = e => { const y = e.target.closest('[data-year]'); if (!y) return; e.preventDefault(); const el = document.getElementById('pp-' + y.dataset.year); if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); }; return; }
    view.onclick = null;
  }
  function render(view, h) {
    clearInterval(clock);
    if (window.Training && window.Training.owns(h)) return window.Training.render(view, h, head);
    document.title = 'Olympiad · Quilio';
    view.innerHTML = h === 'olympiad-competitions' ? competitions() : h === 'olympiad-syllabus' ? syllabus() : h === 'olympiad-practice' ? practice() : h === 'olympiad-papers' ? papers() : h.startsWith('olympiad-papers-') ? papers(h.slice(16)) : h.startsWith('olympiad-p-') ? problem(h.slice(11)) : overview();
    bind(view, h);
  }
  function leave(view) { clearInterval(clock); if (window.Training) window.Training.leave(); if (view) view.onclick = view.onkeydown = null; }
  window.Olympiad = { render, leave, P, COMPS, SYL, num, ok, count: P.length };
})();

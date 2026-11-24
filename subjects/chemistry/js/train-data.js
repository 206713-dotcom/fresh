/* Quilio: Olympiad Training modules (content). Every module: learn (each section ends in a quick check),
   a worked example revealed one step at a time with a "think first" prompt, a problem ladder with two hints and a
   step-by-step solution, and flashcards. Step c fields point at the learn section the step uses (index, or "module:index").
   All content is original; every number was checked by calculation. */
(function () {
  'use strict';
  const R = String.raw;
  window.TRAIN_MODS = [
  { id: 'moles', t: 'Moles: counting with confidence', ph: 1, m: 40, comps: ['C3L6', 'UKChO', 'USNCO'], lec: ['ci-3-3', 'ca-2-4'], more: ['smelling-salts', 'sugar', 'dolomite'],
    why: 'Nearly every olympiad question has a mole calculation somewhere inside it, often hidden in the middle of an unfamiliar story. If this is automatic, all your attention is free for the new chemistry.',
    learn: [
      { h: 'One idea, three doors', b: R`Every quantity in chemistry can be turned into **moles**, and the reaction equation only speaks in moles.

- From a mass: $n = m \div M$
- From a solution: $n = c \times V$, with $V$ in $\mathrm{dm^3}$
- From a gas: $n = pV \div RT$, with $p$ in Pa, $V$ in $\mathrm{m^3}$, $T$ in K

**The strategy never changes:** convert what you are given into moles, use the ratio from the equation, then convert back to what you are asked for.`,
        q: { q: R`How many moles of oxygen atoms are in $0.50\ \mathrm{mol}$ of $\mathrm{Ca(NO_3)_2}$?`, o: ['1.5', '3.0', '0.50', '6.0'], a: 1, x: R`Each formula unit has two nitrate groups with three O each: 6 O atoms. $0.50 \times 6 = 3.0\ \mathrm{mol}$. (1.5 forgets the bracket; 6.0 counts per mole of nitrate twice.)` } },
      { h: 'The limiting reagent', b: R`When two reactants are given, only one of them runs out first. To find it, **divide each amount in moles by its coefficient** in the equation. The smallest result is the limiting reagent, and it alone decides how much product forms.

Picture it: 10 bread slices and 3 eggs, one sandwich needs 2 slices and 1 egg. $10 \div 2 = 5$, $3 \div 1 = 3$: the eggs limit you to 3 sandwiches.`,
        q: { q: R`$\mathrm{2H_2 + O_2 \rightarrow 2H_2O}$. You have $3.0\ \mathrm{mol}\ \mathrm{H_2}$ and $2.0\ \mathrm{mol}\ \mathrm{O_2}$. Which is limiting?`, o: ['Hydrogen', 'Oxygen', 'Neither: exact amounts', 'It depends on the temperature'], a: 0, x: R`$3.0 \div 2 = 1.5$ for $\mathrm{H_2}$, $2.0 \div 1 = 2.0$ for $\mathrm{O_2}$. Hydrogen gives the smaller number, so it runs out first. Comparing $3.0$ with $2.0$ directly is the classic trap.` } },
      { h: 'Formulae from data', b: R`Olympiad questions love to make you deduce a formula.

- **Percentage composition:** divide each percentage by $A_r$, then divide by the smallest to get the empirical formula.
- **Combustion analysis:** all the carbon ends up in $\mathrm{CO_2}$ and all the hydrogen in $\mathrm{H_2O}$. Mass of C $= m(\mathrm{CO_2}) \times \tfrac{12.01}{44.01}$; mass of H $= m(\mathrm{H_2O}) \times \tfrac{2.016}{18.02}$. Oxygen is found **by difference**, because some of the oxygen in the products came from the air.
- **Molecular formula:** compare the empirical formula mass with $M_r$ (often from the mass spectrum).`,
        q: { q: R`A compound burns to give $0.220\ \mathrm{g}$ of $\mathrm{CO_2}$. What mass of carbon did it contain?`, o: ['0.0600 g', '0.0819 g', '0.220 g', '0.0300 g'], a: 0, x: R`$0.220 \times 12.01 \div 44.01 = 0.0600\ \mathrm{g}$. The ratio $12.01/44.01$ is the fraction of a $\mathrm{CO_2}$ molecule’s mass that is carbon.` } },
    ],
    ex: { t: 'Combustion analysis', s: R`$0.250\ \mathrm{g}$ of an organic compound containing only C, H and O burns completely to give $0.366\ \mathrm{g}$ of $\mathrm{CO_2}$ and $0.150\ \mathrm{g}$ of $\mathrm{H_2O}$. Its mass spectrum has a molecular ion at $m/z = 60$. Find the molecular formula.`,
      steps: [
        { p: 'Where did all the carbon in the compound end up?', w: R`In the $\mathrm{CO_2}$. Mass of C $= 0.366 \times \tfrac{12.01}{44.01} = 0.0999\ \mathrm{g}$, which is $0.0999 \div 12.01 = 8.32 \times 10^{-3}\ \mathrm{mol}$.`, c: 2 },
        { p: 'And the hydrogen?', w: R`In the water. Mass of H $= 0.150 \times \tfrac{2.016}{18.02} = 0.0168\ \mathrm{g}$, which is $0.0168 \div 1.008 = 1.66 \times 10^{-2}\ \mathrm{mol}$ of H atoms.`, c: 2 },
        { p: 'The products contain oxygen too. Can you use them to find the oxygen in the compound?', w: R`No: the burning used oxygen from the air. Find it by difference instead. Mass of O $= 0.250 - 0.0999 - 0.0168 = 0.1333\ \mathrm{g}$, so $0.1333 \div 16.00 = 8.33 \times 10^{-3}\ \mathrm{mol}$.`, c: 2 },
        { p: 'What is the simplest whole-number ratio?', w: R`Divide by the smallest ($8.32 \times 10^{-3}$): C $1.00$, H $2.00$, O $1.00$. Empirical formula $\mathrm{CH_2O}$, mass 30.`, c: 2 },
        { p: 'How do you get from the empirical to the molecular formula?', w: R`$M_r = 60$ and $60 \div 30 = 2$, so the molecular formula is $\mathrm{C_2H_4O_2}$: for example ethanoic acid, or its isomer methyl methanoate.`, c: 2 },
      ], ans: R`$\mathrm{C_2H_4O_2}$` },
    lad: [
      { t: 'Burning magnesium', lv: 1, s: R`$0.486\ \mathrm{g}$ of magnesium ribbon burns completely in oxygen. What mass of magnesium oxide forms, in g? ($\mathrm{Mg} = 24.31$, $\mathrm{MgO} = 40.30$)`, a: 0.806, u: 'g', tol: 0.01,
        h: ['Write the equation first: 2Mg + O₂ → 2MgO. What is the ratio of Mg to MgO?', 'Find the moles of Mg; you get the same number of moles of MgO.'],
        steps: [{ w: R`$n(\mathrm{Mg}) = 0.486 \div 24.31 = 0.0200\ \mathrm{mol}$`, c: 0 }, { w: R`$\mathrm{2Mg + O_2 \rightarrow 2MgO}$: one MgO for each Mg, so $0.0200\ \mathrm{mol}$ of MgO.`, c: 0 }, { w: R`$m = 0.0200 \times 40.30 = 0.806\ \mathrm{g}$`, c: 0 }], ans: '0.806 g' },
      { t: 'Aluminium chloride and its yield', lv: 2, s: R`$5.00\ \mathrm{g}$ of aluminium is heated in $20.0\ \mathrm{g}$ of chlorine: $\mathrm{2Al + 3Cl_2 \rightarrow 2AlCl_3}$. The student collects $22.0\ \mathrm{g}$ of $\mathrm{AlCl_3}$. What is the percentage yield? ($\mathrm{Al} = 26.98$, $\mathrm{Cl_2} = 70.90$, $\mathrm{AlCl_3} = 133.33$)`, a: 89.0, u: '%', tol: 0.01,
        h: ['Two reactant amounts are given: one of them is limiting. Divide each amount in moles by its coefficient.', 'Aluminium is (just) limiting. The theoretical yield comes from the aluminium alone.'],
        steps: [{ w: R`$n(\mathrm{Al}) = 5.00 \div 26.98 = 0.1853$; $n(\mathrm{Cl_2}) = 20.0 \div 70.90 = 0.2821$.`, c: 0 }, { w: R`Divide by coefficients: Al $0.1853 \div 2 = 0.0927$; $\mathrm{Cl_2}$ $0.2821 \div 3 = 0.0940$. Aluminium is limiting, only just.`, c: 1 }, { w: R`Theoretical $\mathrm{AlCl_3} = 0.1853\ \mathrm{mol} = 0.1853 \times 133.33 = 24.7\ \mathrm{g}$.`, c: 1 }, { w: R`Yield $= 22.0 \div 24.7 \times 100 = 89.0\%$.`, c: 1 }], ans: '89.0%' },
      { t: 'Which metal?', lv: 3, s: R`$2.780\ \mathrm{g}$ of a hydrated sulfate $\mathrm{MSO_4 \cdot 7H_2O}$ is heated to constant mass and loses $1.261\ \mathrm{g}$ of water. Find the relative atomic mass of M, and identify it.`, a: 55.9, u: '', tol: 0.01,
        h: ['The mass lost is water. Seven waters per formula unit lets you count the formula units.', 'Moles of salt = moles of water ÷ 7. The anhydrous mass divided by that gives M(MSO₄).'],
        steps: [{ w: R`$n(\mathrm{H_2O}) = 1.261 \div 18.02 = 0.06998\ \mathrm{mol}$, so $n(\mathrm{MSO_4}) = 0.06998 \div 7 = 0.009997\ \mathrm{mol}$.`, c: 0 }, { w: R`Anhydrous mass $= 2.780 - 1.261 = 1.519\ \mathrm{g}$, so $M(\mathrm{MSO_4}) = 1.519 \div 0.009997 = 151.9$.`, c: 0 }, { w: R`$A_r(\mathrm{M}) = 151.9 - 96.06 = 55.9$: iron. The salt is green $\mathrm{FeSO_4 \cdot 7H_2O}$.`, c: 2 }], ans: '55.9: iron' },
    ],
    cards: [[R`$n$ from a solution`, R`$n = cV$, with $V$ in $\mathrm{dm^3}$`], ['How do you find the limiting reagent?', 'Moles of each reactant ÷ its coefficient: the smallest result is limiting'], ['In combustion analysis, how is oxygen found?', 'By difference: mass of compound − mass of C − mass of H'], [R`Mass of C from $\mathrm{CO_2}$`, R`$m(\mathrm{CO_2}) \times 12.01/44.01$`], ['Percentage yield', 'actual ÷ theoretical × 100']] },

  { id: 'energy', t: 'Energy cycles', ph: 1, m: 40, comps: ['UKChO', 'USNCO', 'IChO'], lec: ['ca-5-2', 'ca-23-1'], more: ['methane-hess', 'mgcl2-bh'],
    why: 'Hess’s law is a favourite of every olympiad because it rewards careful bookkeeping on unfamiliar compounds. Born–Haber cycles appear whenever ionic compounds do.',
    learn: [
      { h: 'Hess’s law in two shortcuts', b: R`Enthalpy depends only on the start and the end, not the route. That gives two shortcuts you should know cold:

- From **formation** data: $\Delta_r H = \sum \Delta_f H(\text{products}) - \sum \Delta_f H(\text{reactants})$
- From **combustion** data: $\Delta_r H = \sum \Delta_c H(\text{reactants}) - \sum \Delta_c H(\text{products})$

Notice the order flips between the two. Elements in their standard states have $\Delta_f H = 0$. Multiply each value by its coefficient.`,
        q: { q: R`$\Delta_f H$ in $\mathrm{kJ\ mol^{-1}}$: $\mathrm{CO_2}$ −393.5, $\mathrm{H_2O(l)}$ −285.8, $\mathrm{C_2H_5OH(l)}$ −277.7. What is $\Delta_c H$ of ethanol?`, o: ['−1366.7', '−1922.1', '−957.0', '+1366.7'], a: 0, x: R`$\mathrm{C_2H_5OH + 3O_2 \rightarrow 2CO_2 + 3H_2O}$: $2(-393.5) + 3(-285.8) - (-277.7) = -1366.7$. −1922.1 adds the ethanol instead of subtracting it.` } },
      { h: 'Bond enthalpies', b: R`For gas-phase reactions you can estimate $\Delta H$ from bonds:

$$\Delta H = \sum(\text{bonds broken}) - \sum(\text{bonds made})$$

Breaking costs energy; making releases it. Mean bond enthalpies are averages over many compounds, so the answer is only approximate, and they only apply to gases.`,
        q: { q: R`$\mathrm{H_2 + Cl_2 \rightarrow 2HCl}$. Bond enthalpies: H–H 436, Cl–Cl 242, H–Cl 431. What is $\Delta H$?`, o: ['−184', '+184', '−247', '−431'], a: 0, x: R`Broken: $436 + 242 = 678$. Made: $2 \times 431 = 862$. $678 - 862 = -184\ \mathrm{kJ\ mol^{-1}}$. Forgetting the 2 gives −247.` } },
      { h: 'Lattice energy and Born–Haber', b: R`The **lattice energy** is the enthalpy change when gaseous ions form one mole of solid lattice (exothermic as defined here). It cannot be measured directly, so build a cycle: atomise the metal, ionise it, atomise the non-metal, add electrons (electron affinity), then form the lattice. Hess says the cycle total equals $\Delta_f H$.

Lattice energy is **more exothermic for higher charges and smaller ions**: the attraction goes as $\dfrac{q_+ q_-}{r_+ + r_-}$.`,
        q: { q: 'Which compound has the most exothermic lattice energy?', o: ['MgO', 'NaCl', 'KBr', 'NaF'], a: 0, x: R`$\mathrm{Mg^{2+}}$ and $\mathrm{O^{2-}}$ are both doubly charged and small: about four times the charge product of the others.` } },
    ],
    ex: { t: 'Hydrogenating ethene, two ways', s: R`Calculate $\Delta H$ for $\mathrm{C_2H_4(g) + H_2(g) \rightarrow C_2H_6(g)}$ from enthalpies of combustion ($\mathrm{kJ\ mol^{-1}}$): $\mathrm{C_2H_4}$ −1411, $\mathrm{H_2}$ −286, $\mathrm{C_2H_6}$ −1560. Then check it with bond enthalpies: C=C 612, H–H 436, C–C 348, C–H 413.`,
      steps: [
        { p: 'Combustion data are given. Which shortcut, and which way round?', w: R`Combustion route: $\Delta H = \sum \Delta_c H(\text{reactants}) - \sum \Delta_c H(\text{products})$.`, c: 0 },
        { p: 'Put the numbers in.', w: R`$\Delta H = (-1411) + (-286) - (-1560) = -137\ \mathrm{kJ\ mol^{-1}}$.`, c: 0 },
        { p: 'Now with bonds: which bonds break, and which form?', w: R`Break: one C=C and one H–H, $612 + 436 = 1048$. Make: one C–C and two new C–H, $348 + 2 \times 413 = 1174$. (The other four C–H bonds are in both, so they cancel.)`, c: 1 },
        { p: 'Compare the two answers. Why are they different?', w: R`Bond estimate: $1048 - 1174 = -126\ \mathrm{kJ\ mol^{-1}}$, against $-137$ from Hess. Mean bond enthalpies are averages over many molecules, so the bond method is only approximate. Trust the Hess value.`, c: 1 },
      ], ans: R`$-137\ \mathrm{kJ\ mol^{-1}}$ (bond estimate $-126$)` },
    lad: [
      { t: 'Ammonia from bonds', lv: 1, s: R`Estimate $\Delta_f H$ of ammonia, $\mathrm{\tfrac12 N_2 + \tfrac32 H_2 \rightarrow NH_3}$, from bond enthalpies: N≡N 945, H–H 436, N–H 391.`, a: -46.5, u: 'kJ mol⁻¹', tol: 0.01,
        h: ['Formation makes ONE mole of NH₃, so you break half an N≡N and one and a half H–H.', 'Broken: ½(945) + 1.5(436). Made: three N–H bonds.'],
        steps: [{ w: R`Broken: $0.5 \times 945 + 1.5 \times 436 = 472.5 + 654 = 1126.5$`, c: 1 }, { w: R`Made: $3 \times 391 = 1173$`, c: 1 }, { w: R`$\Delta H = 1126.5 - 1173 = -46.5\ \mathrm{kJ\ mol^{-1}}$ (the data book value is −46.1).`, c: 1 }], ans: R`$-46.5\ \mathrm{kJ\ mol^{-1}}$` },
      { t: 'Decomposing limestone', lv: 2, s: R`$\Delta_f H$ ($\mathrm{kJ\ mol^{-1}}$): $\mathrm{CaCO_3}$ −1206.9, $\mathrm{CaO}$ −635.1, $\mathrm{CO_2}$ −393.5. Find $\Delta H$ for $\mathrm{CaCO_3 \rightarrow CaO + CO_2}$.`, a: 178.3, u: 'kJ mol⁻¹', tol: 0.005,
        h: ['Formation data: products minus reactants.', '(−635.1 − 393.5) − (−1206.9)'],
        steps: [{ w: R`$\Delta H = [\Delta_f H(\mathrm{CaO}) + \Delta_f H(\mathrm{CO_2})] - \Delta_f H(\mathrm{CaCO_3})$`, c: 0 }, { w: R`$= (-635.1 - 393.5) + 1206.9 = +178.3\ \mathrm{kJ\ mol^{-1}}$: endothermic, which is why lime kilns are so hot.`, c: 0 }], ans: R`$+178.3\ \mathrm{kJ\ mol^{-1}}$` },
      { t: 'Why salt dissolves', lv: 3, s: R`Lattice energy of NaCl −787; hydration enthalpies $\mathrm{Na^+}$ −406, $\mathrm{Cl^-}$ −378 ($\mathrm{kJ\ mol^{-1}}$). Find the enthalpy of solution of NaCl.`, a: 3, u: 'kJ mol⁻¹', abs: 0.5,
        h: ['Dissolving = break the lattice into gaseous ions, then hydrate each ion.', 'Breaking the lattice is the reverse of forming it: +787.'],
        steps: [{ w: R`$\mathrm{NaCl(s) \rightarrow Na^+(g) + Cl^-(g)}$: $+787$`, c: 2 }, { w: R`Hydrate both ions: $-406 + (-378) = -784$`, c: 2 }, { w: R`$\Delta_{sol}H = 787 - 784 = +3\ \mathrm{kJ\ mol^{-1}}$. Almost zero: salt dissolves because of the entropy gain, not the enthalpy.`, c: 0 }], ans: R`$+3\ \mathrm{kJ\ mol^{-1}}$` },
    ],
    cards: [['ΔrH from formation data', 'Σ products − Σ reactants'], ['ΔrH from combustion data', 'Σ reactants − Σ products'], ['ΔH from bond enthalpies', 'bonds broken − bonds made'], ['Lattice energy is larger (more exothermic) when…', 'ion charges are higher and ions are smaller'], ['Standard ΔfH of an element in its standard state', 'zero']] },

  { id: 'equilibrium', t: 'Equilibrium and ICE tables', ph: 1, m: 45, comps: ['UKChO', 'USNCO', 'IChO'], lec: ['ca-7-1'], more: ['n2o4'],
    why: 'Equilibrium calculations are the single most common long-calculation type at USNCO National Part II and in IChO theory papers. The ICE table turns them into routine.',
    learn: [
      { h: 'Writing K', b: R`For $a\mathrm{A} + b\mathrm{B} \rightleftharpoons c\mathrm{C} + d\mathrm{D}$:

$$K_c = \frac{[\mathrm{C}]^c[\mathrm{D}]^d}{[\mathrm{A}]^a[\mathrm{B}]^b}$$

Products on top, reactants below, each raised to its coefficient. **Solids and pure liquids are left out.** $K$ depends only on temperature.`,
        q: { q: R`What is $K_c$ for $\mathrm{2SO_2(g) + O_2(g) \rightleftharpoons 2SO_3(g)}$?`, o: [R`$\dfrac{[\mathrm{SO_3}]^2}{[\mathrm{SO_2}]^2[\mathrm{O_2}]}$`, R`$\dfrac{2[\mathrm{SO_3}]}{2[\mathrm{SO_2}][\mathrm{O_2}]}$`, R`$\dfrac{[\mathrm{SO_2}]^2[\mathrm{O_2}]}{[\mathrm{SO_3}]^2}$`, R`$\dfrac{[\mathrm{SO_3}]}{[\mathrm{SO_2}][\mathrm{O_2}]}$`], a: 0, x: 'Coefficients become powers, not multipliers; products go on top.' } },
      { h: 'The ICE table', b: R`Three rows, one column per species:

- **I**nitial amounts
- **C**hange, written with one unknown $x$ and the coefficients ($-x$, $-x$, $+2x$ …)
- **E**quilibrium = I + C

Then convert to concentrations (divide by volume) and substitute into $K$. If the equation has equal numbers of moles on each side, the volume cancels.

A shortcut: if both sides of the $K$ expression are perfect squares, take the square root instead of solving a quadratic.`,
        q: { q: R`$\mathrm{H_2 + I_2 \rightleftharpoons 2HI}$, starting from $1.0\ \mathrm{mol}$ of each reactant. If $x$ mol of $\mathrm{H_2}$ reacts, how much HI is there at equilibrium?`, o: ['2x', 'x', '1.0 − x', '2(1.0 − x)'], a: 0, x: 'Each H₂ that reacts makes two HI, so the change for HI is +2x.' } },
      { h: 'Kp, partial pressures and small K', b: R`For gases, use partial pressures: $p_i = x_i \, p_{total}$, where $x_i$ is the mole fraction. Then $K_p$ has the same shape as $K_c$. The two are linked by $K_p = K_c(RT)^{\Delta n}$, where $\Delta n$ is moles of gas on the right minus on the left.

When $K$ is very small, $x$ is tiny compared with the starting amounts, so $(c - x) \approx c$. Always check afterwards that $x$ is less than 5% of $c$.`,
        q: { q: R`For $\mathrm{N_2O_4 \rightleftharpoons 2NO_2}$, what is $\Delta n$ in $K_p = K_c(RT)^{\Delta n}$?`, o: ['1', '2', '−1', '0'], a: 0, x: 'Two moles of gas on the right, one on the left: Δn = 2 − 1 = 1.' } },
    ],
    ex: { t: 'Hydrogen iodide', s: R`$\mathrm{H_2(g) + I_2(g) \rightleftharpoons 2HI(g)}$ has $K_c = 50.0$ at $721\ \mathrm{K}$. $1.00\ \mathrm{mol}$ of $\mathrm{H_2}$ and $1.00\ \mathrm{mol}$ of $\mathrm{I_2}$ are sealed in a $2.00\ \mathrm{dm^3}$ flask. Find $[\mathrm{HI}]$ at equilibrium.`,
      steps: [
        { p: 'What are the starting concentrations?', w: R`$1.00 \div 2.00 = 0.500\ \mathrm{mol\ dm^{-3}}$ for each of $\mathrm{H_2}$ and $\mathrm{I_2}$; HI starts at zero.`, c: 1 },
        { p: 'Fill in the C and E rows with one unknown.', w: R`Change: $-x$, $-x$, $+2x$. Equilibrium: $[\mathrm{H_2}] = [\mathrm{I_2}] = 0.500 - x$, $[\mathrm{HI}] = 2x$.`, c: 1 },
        { p: 'Write K and look at its shape before expanding anything.', w: R`$50.0 = \dfrac{(2x)^2}{(0.500 - x)^2}$: both top and bottom are squares.`, c: 0 },
        { p: 'Use the shortcut.', w: R`Square root: $\dfrac{2x}{0.500 - x} = \sqrt{50.0} = 7.071$, so $2x = 3.536 - 7.071x$ and $x = 0.390$.`, c: 1 },
        { p: 'Answer, and sanity check.', w: R`$[\mathrm{HI}] = 2x = 0.780\ \mathrm{mol\ dm^{-3}}$. Check: $0.780^2 \div 0.110^2 = 50.3$. ✓ (The 0.3 is rounding.)`, c: 0 },
      ], ans: R`$[\mathrm{HI}] = 0.780\ \mathrm{mol\ dm^{-3}}$` },
    lad: [
      { t: 'K from equilibrium amounts', lv: 1, s: R`At equilibrium in a $2.00\ \mathrm{dm^3}$ vessel there are $0.400\ \mathrm{mol}\ \mathrm{PCl_5}$, $0.200\ \mathrm{mol}\ \mathrm{PCl_3}$ and $0.200\ \mathrm{mol}\ \mathrm{Cl_2}$. Find $K_c$ for $\mathrm{PCl_5 \rightleftharpoons PCl_3 + Cl_2}$, in $\mathrm{mol\ dm^{-3}}$.`, a: 0.0500, u: 'mol dm⁻³', tol: 0.01,
        h: ['Convert every amount to a concentration first.', '[PCl₃][Cl₂] ÷ [PCl₅] = (0.100 × 0.100) ÷ 0.200'],
        steps: [{ w: R`Concentrations: $[\mathrm{PCl_5}] = 0.200$, $[\mathrm{PCl_3}] = [\mathrm{Cl_2}] = 0.100\ \mathrm{mol\ dm^{-3}}$.`, c: 1 }, { w: R`$K_c = \dfrac{0.100 \times 0.100}{0.200} = 0.0500\ \mathrm{mol\ dm^{-3}}$.`, c: 0 }], ans: R`$0.0500\ \mathrm{mol\ dm^{-3}}$` },
      { t: 'The water–gas shift', lv: 2, s: R`$\mathrm{CO + H_2O \rightleftharpoons CO_2 + H_2}$, $K_c = 4.00$. Starting from $1.00\ \mathrm{mol}$ of CO and $1.00\ \mathrm{mol}$ of $\mathrm{H_2O}$ only, what percentage of the CO is converted?`, a: 66.7, u: '%', tol: 0.01,
        h: ['Two moles of gas on each side: the volume cancels, so you can use moles directly.', 'x²/(1 − x)² = 4: take the square root.'],
        steps: [{ w: R`ICE: CO and $\mathrm{H_2O}$ $1.00 - x$; $\mathrm{CO_2}$ and $\mathrm{H_2}$ $x$. Volume cancels ($\Delta n = 0$).`, c: 1 }, { w: R`$\dfrac{x^2}{(1.00 - x)^2} = 4.00$, so $\dfrac{x}{1.00 - x} = 2.00$ and $x = 0.667$.`, c: 1 }, { w: R`$0.667$ of $1.00\ \mathrm{mol}$: $66.7\%$ converted.`, c: 0 }], ans: '66.7%' },
      { t: 'Squeezing PCl₅', lv: 3, s: R`At a certain temperature, $\mathrm{PCl_5(g) \rightleftharpoons PCl_3(g) + Cl_2(g)}$ is 50% dissociated at a total pressure of $1.00\ \mathrm{bar}$. Find the fraction dissociated, $\alpha$, at $4.00\ \mathrm{bar}$.`, a: 0.277, u: '', tol: 0.015,
        h: ['Start from 1 mol PCl₅: at equilibrium 1 − α, α, α; total 1 + α. Write each partial pressure as a mole fraction times p.', 'You should find Kp = α²p ÷ (1 − α²). Use the 1 bar data to get Kp, then solve for α at 4 bar.'],
        steps: [{ w: R`Moles: $1 - \alpha$, $\alpha$, $\alpha$; total $1 + \alpha$. Partial pressures: $\tfrac{1-\alpha}{1+\alpha}p$, $\tfrac{\alpha}{1+\alpha}p$, $\tfrac{\alpha}{1+\alpha}p$.`, c: 2 }, { w: R`$K_p = \dfrac{\alpha^2 p}{(1+\alpha)(1-\alpha)} = \dfrac{\alpha^2 p}{1 - \alpha^2}$. At $\alpha = 0.5$, $p = 1$: $K_p = 0.25 \div 0.75 = 0.333$.`, c: 2 }, { w: R`At $4.00\ \mathrm{bar}$: $\dfrac{4\alpha^2}{1-\alpha^2} = 0.333$, so $4.333\alpha^2 = 0.333$ and $\alpha = 0.277$. Higher pressure favours the side with fewer gas molecules, as Le Chatelier predicts.`, c: 2 }], ans: R`$\alpha = 0.277$` },
    ],
    cards: [['What is left out of K?', 'Solids and pure liquids'], ['ICE stands for…', 'Initial, Change, Equilibrium'], ['Kp and Kc are linked by…', 'Kp = Kc(RT)^Δn'], ['Partial pressure', 'mole fraction × total pressure'], ['When can you say c − x ≈ c?', 'When K is small; check x < 5% of c afterwards']] },

  { id: 'acids', t: 'Acids, buffers and titration curves', ph: 1, m: 45, comps: ['UKChO', 'USNCO', 'IChO'], lec: ['ca-25-1', 'ci-12-2'], more: ['ethanoic', 'antacid'],
    why: 'pH questions are everywhere because they test logs, equilibria and approximations at once. Buffers and titration curves are the step from A Level to olympiad level.',
    learn: [
      { h: 'pH of strong and weak acids', b: R`$\mathrm{pH} = -\log_{10}[\mathrm{H^+}]$.

- **Strong acid:** fully dissociated, so $[\mathrm{H^+}]$ = acid concentration (× number of H for $\mathrm{H_2SO_4}$, roughly).
- **Weak acid:** $K_a = \dfrac{[\mathrm{H^+}][\mathrm{A^-}]}{[\mathrm{HA}]}$. With $[\mathrm{H^+}] = [\mathrm{A^-}]$ and little dissociation, $[\mathrm{H^+}] \approx \sqrt{K_a c}$.
- **Bases:** find $[\mathrm{OH^-}]$, then $\mathrm{pH} = 14 - \mathrm{pOH}$ at 25 °C.`,
        q: { q: R`What is the pH of $0.010\ \mathrm{mol\ dm^{-3}}$ HCl?`, o: ['2.00', '1.00', '0.010', '12.00'], a: 0, x: R`$-\log(0.010) = 2.00$.` } },
      { h: 'Buffers', b: R`A buffer is a weak acid with its conjugate base (or a weak base with its conjugate acid). Added $\mathrm{H^+}$ is mopped up by $\mathrm{A^-}$; added $\mathrm{OH^-}$ by HA. Rearranging $K_a$:

$$\mathrm{pH} = \mathrm{p}K_a + \log\frac{[\mathrm{A^-}]}{[\mathrm{HA}]}$$

Because only the **ratio** matters, you can use moles instead of concentrations. A buffer works best within one pH unit of its $\mathrm{p}K_a$.`,
        q: { q: R`A buffer has $0.20\ \mathrm{mol\ dm^{-3}}$ HA and $0.10\ \mathrm{mol\ dm^{-3}}\ \mathrm{A^-}$, with $\mathrm{p}K_a = 4.76$. What is its pH?`, o: ['4.46', '5.06', '4.76', '2.38'], a: 0, x: R`$4.76 + \log(0.10/0.20) = 4.76 - 0.30 = 4.46$. More acid than base, so below the $\mathrm{p}K_a$.` } },
      { h: 'Reading a titration curve', b: R`Weak acid + strong base:

- **Half-way** to equivalence, $[\mathrm{HA}] = [\mathrm{A^-}]$, so $\mathrm{pH} = \mathrm{p}K_a$. This is how $K_a$ is measured.
- At **equivalence** the solution is just $\mathrm{A^-}$, a weak base, so the pH is above 7.
- Choose an indicator whose colour change lies in the steep part: phenolphthalein (8.2–10) here.

A diprotic acid gives two steps, one per proton.`,
        q: { q: 'Which indicator suits ethanoic acid titrated with sodium hydroxide?', o: ['Phenolphthalein', 'Methyl orange', 'Either', 'Neither'], a: 0, x: 'The equivalence point is around pH 8.7, inside phenolphthalein’s range (8.2–10) and far from methyl orange’s (3.1–4.4).' } },
    ],
    ex: { t: 'A buffer under attack', s: R`$1.00\ \mathrm{dm^3}$ of buffer contains $0.100\ \mathrm{mol}$ of ethanoic acid and $0.100\ \mathrm{mol}$ of sodium ethanoate ($\mathrm{p}K_a = 4.76$). $0.010\ \mathrm{mol}$ of solid NaOH is added. Find the new pH, and compare with adding the same NaOH to $1.00\ \mathrm{dm^3}$ of pure water.`,
      steps: [
        { p: 'What is the pH before anything is added?', w: R`Equal amounts of HA and $\mathrm{A^-}$, so $\mathrm{pH} = \mathrm{p}K_a = 4.76$.`, c: 1 },
        { p: 'What does the hydroxide react with, and what does that make?', w: R`$\mathrm{OH^- + CH_3COOH \rightarrow CH_3COO^- + H_2O}$. HA falls to $0.090\ \mathrm{mol}$; $\mathrm{A^-}$ rises to $0.110\ \mathrm{mol}$.`, c: 1 },
        { p: 'New pH?', w: R`$\mathrm{pH} = 4.76 + \log(0.110/0.090) = 4.76 + 0.087 = 4.85$: a change of only 0.09.`, c: 1 },
        { p: 'And in pure water?', w: R`$[\mathrm{OH^-}] = 0.010$, $\mathrm{pOH} = 2.00$, $\mathrm{pH} = 12.00$: a jump of 5 units from 7. That contrast is the whole point of a buffer.`, c: 0 },
      ], ans: 'pH 4.85 in the buffer; 12.00 in water' },
    lad: [
      { t: 'A strong base', lv: 1, s: R`What is the pH of $0.050\ \mathrm{mol\ dm^{-3}}$ barium hydroxide, $\mathrm{Ba(OH)_2}$, at 25 °C?`, a: 13.00, u: '', abs: 0.02,
        h: ['How many OH⁻ does each Ba(OH)₂ release?', '[OH⁻] = 0.100; pOH = 1.00.'],
        steps: [{ w: R`$[\mathrm{OH^-}] = 2 \times 0.050 = 0.100\ \mathrm{mol\ dm^{-3}}$`, c: 0 }, { w: R`$\mathrm{pOH} = 1.00$, so $\mathrm{pH} = 14.00 - 1.00 = 13.00$.`, c: 0 }], ans: '13.00' },
      { t: 'An acidic salt', lv: 2, s: R`What is the pH of $0.20\ \mathrm{mol\ dm^{-3}}$ ammonium chloride? $K_b(\mathrm{NH_3}) = 1.8 \times 10^{-5}$, $K_w = 1.0 \times 10^{-14}$.`, a: 4.98, u: '', abs: 0.02,
        h: ['NH₄⁺ is the conjugate acid of NH₃. Its Ka = Kw ÷ Kb.', 'Then treat it as a weak acid: [H⁺] = √(Ka c).'],
        steps: [{ w: R`$K_a(\mathrm{NH_4^+}) = 10^{-14} \div 1.8 \times 10^{-5} = 5.6 \times 10^{-10}$`, c: 0 }, { w: R`$[\mathrm{H^+}] = \sqrt{5.6 \times 10^{-10} \times 0.20} = 1.05 \times 10^{-5}$`, c: 0 }, { w: R`$\mathrm{pH} = 4.98$: salts of weak bases with strong acids are acidic.`, c: 0 }], ans: '4.98' },
      { t: 'Designing a buffer', lv: 3, s: R`You have $500\ \mathrm{cm^3}$ of $0.100\ \mathrm{mol\ dm^{-3}}$ ethanoic acid ($\mathrm{p}K_a = 4.76$). How many moles of NaOH must you add to make a buffer of pH 5.00?`, a: 0.0317, u: 'mol', tol: 0.015,
        h: ['The NaOH turns some HA into A⁻. The total HA + A⁻ stays 0.0500 mol.', 'Ratio A⁻/HA = 10^(5.00 − 4.76) = 1.74. Split 0.0500 mol in that ratio.'],
        steps: [{ w: R`Total acid $= 0.500 \times 0.100 = 0.0500\ \mathrm{mol}$.`, c: 1 }, { w: R`$\dfrac{[\mathrm{A^-}]}{[\mathrm{HA}]} = 10^{5.00 - 4.76} = 1.74$.`, c: 1 }, { w: R`$n(\mathrm{A^-}) = 0.0500 \times \dfrac{1.74}{2.74} = 0.0317\ \mathrm{mol}$, and each $\mathrm{A^-}$ came from one $\mathrm{OH^-}$: add $0.0317\ \mathrm{mol}$ NaOH.`, c: 1 }], ans: '0.0317 mol' },
    ],
    cards: [['[H⁺] of a weak acid', '≈ √(Ka c)'], ['Henderson–Hasselbalch', 'pH = pKa + log([A⁻]/[HA])'], ['pH at half-equivalence', '= pKa'], ['pH at equivalence: weak acid + strong base', 'above 7, because A⁻ is a weak base'], ['Ka × Kb for a conjugate pair', '= Kw']] },

  { id: 'titrations', t: 'Redox and iodometric titrations', ph: 1, m: 40, comps: ['UKChO', 'USNCO', 'IChO'], lec: ['ca-6-1', 'ci-12-2'], more: ['iron-tablet', 'antacid'],
    why: 'Practical exams at national and international level are built around titrations, and theory papers ask you to process the results. Iodometry is the olympiad favourite.',
    learn: [
      { h: 'The key ratios', b: R`Build each redox equation from half-equations, then read off the ratio.

- $\mathrm{MnO_4^- + 8H^+ + 5e^- \rightarrow Mn^{2+} + 4H_2O}$: one manganate(VII) takes 5 electrons, so it reacts with **5 Fe²⁺**.
- $\mathrm{Cr_2O_7^{2-} + 14H^+ + 6e^- \rightarrow 2Cr^{3+} + 7H_2O}$: one dichromate takes 6 electrons, so it reacts with **6 Fe²⁺**.
- Manganate(VII) is its own indicator: the first excess drop turns the solution pink.`,
        q: { q: R`How many moles of $\mathrm{Fe^{2+}}$ react with one mole of $\mathrm{Cr_2O_7^{2-}}$?`, o: ['6', '5', '2', '3'], a: 0, x: 'Each Cr goes from +6 to +3: two Cr gain 6 electrons in total, and each Fe²⁺ gives one.' } },
      { h: 'Iodometry', b: R`To measure an **oxidising agent**, add excess iodide. The oxidant makes an equivalent amount of iodine:

$\mathrm{2Cu^{2+} + 4I^- \rightarrow 2CuI + I_2}$ (for copper)

Then titrate the iodine with sodium thiosulfate:

$$\mathrm{I_2 + 2S_2O_3^{2-} \rightarrow 2I^- + S_4O_6^{2-}}$$

Add starch near the end, when the colour is pale yellow: blue-black turns colourless at the end point. Chain the ratios: here $\mathrm{Cu^{2+} : I_2 : S_2O_3^{2-} = 2 : 1 : 2}$.`,
        q: { q: R`How many moles of thiosulfate react with one mole of iodine?`, o: ['2', '1', '0.5', '4'], a: 0, x: R`$\mathrm{I_2 + 2S_2O_3^{2-}}$: two thiosulfates, each losing one electron, reduce one $\mathrm{I_2}$.` } },
      { h: 'Back titrations and EDTA', b: R`**Back titration:** when the substance reacts slowly or is insoluble, add a known excess of reagent, then titrate what is left. Reacted = added − left over.

**EDTA** forms a 1:1 complex with almost every metal ion, whatever its charge. It is used to measure water hardness ($\mathrm{Ca^{2+}}$ and $\mathrm{Mg^{2+}}$), usually quoted as mg of $\mathrm{CaCO_3}$ per $\mathrm{dm^3}$.`,
        q: { q: R`What is the mole ratio of EDTA to $\mathrm{Ca^{2+}}$?`, o: ['1 : 1', '1 : 2', '2 : 1', 'It depends on the pH'], a: 0, x: 'EDTA wraps around one metal ion with six donor atoms: always 1:1.' } },
    ],
    ex: { t: 'Copper in brass', s: R`$0.200\ \mathrm{g}$ of brass is dissolved in nitric acid, neutralised, and treated with excess potassium iodide. The iodine released needs $20.50\ \mathrm{cm^3}$ of $0.100\ \mathrm{mol\ dm^{-3}}$ sodium thiosulfate. Find the percentage of copper in the brass. ($\mathrm{Cu} = 63.55$; zinc does not react with iodide.)`,
      steps: [
        { p: 'Start from what you measured. How many moles of thiosulfate?', w: R`$0.02050 \times 0.100 = 2.05 \times 10^{-3}\ \mathrm{mol}$`, c: 1 },
        { p: 'Chain the ratios back to copper.', w: R`$\mathrm{I_2 : S_2O_3^{2-} = 1 : 2}$ and $\mathrm{Cu^{2+} : I_2 = 2 : 1}$, so $\mathrm{Cu^{2+} : S_2O_3^{2-} = 1 : 1}$. $n(\mathrm{Cu}) = 2.05 \times 10^{-3}\ \mathrm{mol}$.`, c: 1 },
        { p: 'Mass and percentage?', w: R`$2.05 \times 10^{-3} \times 63.55 = 0.130\ \mathrm{g}$; $0.130 \div 0.200 = 65.1\%$. Typical brass is 60–70% copper. ✓`, c: 0 },
        { p: 'Why is starch added only near the end?', w: 'Starch binds iodine very strongly when it is concentrated, and the complex releases it slowly, which blurs the end point. Adding it when the solution is pale yellow keeps the end point sharp.', c: 1 },
      ], ans: '65.1% copper' },
    lad: [
      { t: 'Iron by dichromate', lv: 1, s: R`$25.0\ \mathrm{cm^3}$ of an $\mathrm{Fe^{2+}}$ solution needs $18.40\ \mathrm{cm^3}$ of $0.0200\ \mathrm{mol\ dm^{-3}}$ potassium dichromate(VI). Find $[\mathrm{Fe^{2+}}]$.`, a: 0.0883, u: 'mol dm⁻³', tol: 0.01,
        h: ['Ratio Cr₂O₇²⁻ : Fe²⁺ = 1 : 6.', 'n(Fe²⁺) = 6 × 0.01840 × 0.0200; divide by 0.0250 dm³.'],
        steps: [{ w: R`$n(\mathrm{Cr_2O_7^{2-}}) = 0.01840 \times 0.0200 = 3.68 \times 10^{-4}$`, c: 0 }, { w: R`$n(\mathrm{Fe^{2+}}) = 6 \times 3.68 \times 10^{-4} = 2.21 \times 10^{-3}$`, c: 0 }, { w: R`$[\mathrm{Fe^{2+}}] = 2.21 \times 10^{-3} \div 0.0250 = 0.0883\ \mathrm{mol\ dm^{-3}}$`, c: 0 }], ans: R`$0.0883\ \mathrm{mol\ dm^{-3}}$` },
      { t: 'Hydrogen peroxide', lv: 2, s: R`$10.0\ \mathrm{cm^3}$ of diluted hydrogen peroxide needs $15.00\ \mathrm{cm^3}$ of $0.0200\ \mathrm{mol\ dm^{-3}}$ $\mathrm{KMnO_4}$: $\mathrm{2MnO_4^- + 5H_2O_2 + 6H^+ \rightarrow 2Mn^{2+} + 5O_2 + 8H_2O}$. Find $[\mathrm{H_2O_2}]$.`, a: 0.0750, u: 'mol dm⁻³', tol: 0.01,
        h: ['Here peroxide is the reducing agent. The ratio is 2 : 5.', 'n(H₂O₂) = n(MnO₄⁻) × 5/2.'],
        steps: [{ w: R`$n(\mathrm{MnO_4^-}) = 0.01500 \times 0.0200 = 3.00 \times 10^{-4}$`, c: 0 }, { w: R`$n(\mathrm{H_2O_2}) = 3.00 \times 10^{-4} \times \tfrac52 = 7.50 \times 10^{-4}$`, c: 0 }, { w: R`$[\mathrm{H_2O_2}] = 7.50 \times 10^{-4} \div 0.0100 = 0.0750\ \mathrm{mol\ dm^{-3}}$`, c: 0 }], ans: R`$0.0750\ \mathrm{mol\ dm^{-3}}$` },
      { t: 'How hard is the water?', lv: 3, s: R`$100.0\ \mathrm{cm^3}$ of tap water needs $12.50\ \mathrm{cm^3}$ of $0.0100\ \mathrm{mol\ dm^{-3}}$ EDTA. Express the hardness as mg of $\mathrm{CaCO_3}$ per $\mathrm{dm^3}$. ($\mathrm{CaCO_3} = 100.09$)`, a: 125, u: 'mg dm⁻³', tol: 0.01,
        h: ['EDTA : metal ion = 1 : 1. Count all the hardness as Ca²⁺.', 'Scale from 100 cm³ to 1 dm³, then use the mass of CaCO₃.'],
        steps: [{ w: R`$n(\mathrm{EDTA}) = 0.01250 \times 0.0100 = 1.25 \times 10^{-4}\ \mathrm{mol}$ = moles of hardness ions in $100\ \mathrm{cm^3}$.`, c: 2 }, { w: R`Per $\mathrm{dm^3}$: $1.25 \times 10^{-3}\ \mathrm{mol}$, as $\mathrm{CaCO_3}$: $1.25 \times 10^{-3} \times 100.09 = 0.125\ \mathrm{g}$.`, c: 2 }, { w: R`$125\ \mathrm{mg\ dm^{-3}}$: moderately hard water.`, c: 2 }], ans: R`$125\ \mathrm{mg\ dm^{-3}}$` },
    ],
    cards: [['MnO₄⁻ : Fe²⁺', '1 : 5'], ['Cr₂O₇²⁻ : Fe²⁺', '1 : 6'], ['I₂ : S₂O₃²⁻', '1 : 2'], ['When do you add starch in iodometry?', 'Near the end, when the solution is pale yellow'], ['EDTA : metal ion', 'always 1 : 1']] },
  ];
})();
(function () {
  'use strict';
  const R = String.raw;
  window.TRAIN_MODS.push(
  { id: 'gibbs', t: 'Entropy, Gibbs energy and K', ph: 2, m: 45, comps: ['UKChO', 'USNCO', 'IChO'], lec: ['ca-23-3', 'ca-23-4'], more: ['haber-g'],
    why: 'Gibbs energy ties thermodynamics to equilibrium: one number tells you whether a reaction goes, at what temperature it switches, and how far it goes. IChO theory papers use it almost every year.',
    learn: [
      { h: 'Entropy: counting the ways', b: R`**Entropy**, $S$, measures how many ways the energy and particles of a system can be arranged. Gases have far more entropy than liquids, and liquids more than solids.

The quickest estimate of $\Delta S$: **count the moles of gas**. If a reaction makes more gas than it uses, $\Delta S$ is positive. To calculate it exactly:

$$\Delta S = \sum S(\text{products}) - \sum S(\text{reactants})$$

Note the units: $S$ is in $\mathrm{J\ K^{-1}\ mol^{-1}}$, not kJ, and elements do **not** have zero entropy.`,
        q: { q: 'Which reaction has the most positive entropy change?', o: [R`$\mathrm{CaCO_3(s) \rightarrow CaO(s) + CO_2(g)}$`, R`$\mathrm{N_2(g) + 3H_2(g) \rightarrow 2NH_3(g)}$`, R`$\mathrm{H_2O(g) \rightarrow H_2O(l)}$`, R`$\mathrm{Ag^+(aq) + Cl^-(aq) \rightarrow AgCl(s)}$`], a: 0, x: 'It turns a solid into a solid plus a gas. Each of the others reduces the number of gas or solution particles, so their ΔS is negative.' } },
      { h: 'ΔG and the switching temperature', b: R`$$\Delta G = \Delta H - T\Delta S$$

A reaction is feasible when $\Delta G < 0$. Convert $\Delta S$ to $\mathrm{kJ\ K^{-1}\ mol^{-1}}$ (divide by 1000) before you combine it with $\Delta H$.

When $\Delta H$ and $\Delta S$ have the **same sign**, temperature decides. The switch happens where $\Delta G = 0$:

$$T = \frac{\Delta H}{\Delta S}$$

Endothermic with positive $\Delta S$: feasible **above** that temperature. Exothermic with negative $\Delta S$: feasible **below** it.`,
        q: { q: R`$\Delta H = +50\ \mathrm{kJ\ mol^{-1}}$ and $\Delta S = +100\ \mathrm{J\ K^{-1}\ mol^{-1}}$. Above what temperature is the reaction feasible?`, o: ['500 K', '0.5 K', '2 K', '5000 K'], a: 0, x: R`$T = 50\,000 \div 100 = 500\ \mathrm{K}$. Getting 0.5 K means the units were not matched.` } },
      { h: 'ΔG° and the equilibrium constant', b: R`The standard Gibbs energy change fixes the equilibrium constant:

$$\Delta G^\circ = -RT\ln K$$

so $K = e^{-\Delta G^\circ / RT}$, with $\Delta G^\circ$ in $\mathrm{J\ mol^{-1}}$ and $R = 8.314$.

- $\Delta G^\circ$ negative: $K > 1$, products favoured.
- Every $5.7\ \mathrm{kJ\ mol^{-1}}$ changes $K$ by a factor of 10 at 298 K.

Combine the two equations for $\Delta G^\circ$ and you get the **van ’t Hoff equation**, which tells you how $K$ changes with temperature:

$$\ln\frac{K_2}{K_1} = -\frac{\Delta H^\circ}{R}\left(\frac{1}{T_2} - \frac{1}{T_1}\right)$$`,
        q: { q: R`$\Delta G^\circ = -11.4\ \mathrm{kJ\ mol^{-1}}$ at 298 K. Roughly what is $K$?`, o: ['about 100', 'about 1', 'about 0.01', 'about 10¹¹'], a: 0, x: R`$\ln K = 11\,400 \div (8.314 \times 298) = 4.60$, so $K = e^{4.60} \approx 100$. Two lots of 5.7 kJ: two factors of 10.` } },
    ],
    ex: { t: 'When does silver oxide decompose?', s: R`$\mathrm{2Ag_2O(s) \rightarrow 4Ag(s) + O_2(g)}$. Data: $\Delta_f H(\mathrm{Ag_2O}) = -31.0\ \mathrm{kJ\ mol^{-1}}$; $S$ in $\mathrm{J\ K^{-1}\ mol^{-1}}$: $\mathrm{Ag_2O}$ 121.3, Ag 42.6, $\mathrm{O_2}$ 205.2. Find the lowest temperature at which the decomposition is feasible.`,
      steps: [
        { p: 'Start with ΔH. Which values are zero?', w: R`Ag and $\mathrm{O_2}$ are elements: $\Delta_f H = 0$. So $\Delta H = 0 - 2(-31.0) = +62.0\ \mathrm{kJ\ mol^{-1}}$.`, c: 'energy:0' },
        { p: 'Now ΔS. Do the elements count this time?', w: R`Yes: entropies are never zero. $\Delta S = 4(42.6) + 205.2 - 2(121.3) = +133.0\ \mathrm{J\ K^{-1}\ mol^{-1}}$. Positive, as expected: a gas is made.`, c: 0 },
        { p: 'Both are positive. What does that tell you about temperature?', w: R`Endothermic, entropy increasing: feasible only **above** the temperature where $\Delta G = 0$.`, c: 1 },
        { p: 'Find that temperature, watching the units.', w: R`$T = \dfrac{\Delta H}{\Delta S} = \dfrac{62\,000}{133.0} = 466\ \mathrm{K}$, about 193 °C. That is why silver oxide decomposes on gentle heating.`, c: 1 },
      ], ans: R`Above $466\ \mathrm{K}$` },
    lad: [
      { t: 'Limestone at room temperature', lv: 1, s: R`For $\mathrm{CaCO_3(s) \rightarrow CaO(s) + CO_2(g)}$, $\Delta H = +178.3\ \mathrm{kJ\ mol^{-1}}$ and $\Delta S = +159.0\ \mathrm{J\ K^{-1}\ mol^{-1}}$. Calculate $\Delta G$ at 298 K.`, a: 130.9, u: 'kJ mol⁻¹', tol: 0.01,
        h: ['Use ΔG = ΔH − TΔS, but first turn ΔS into kJ.', '178.3 − 298 × 0.1590'],
        steps: [{ w: R`$\Delta S = 0.1590\ \mathrm{kJ\ K^{-1}\ mol^{-1}}$`, c: 1 }, { w: R`$\Delta G = 178.3 - 298 \times 0.1590 = 178.3 - 47.4 = +130.9\ \mathrm{kJ\ mol^{-1}}$: not feasible at room temperature.`, c: 1 }], ans: R`$+130.9\ \mathrm{kJ\ mol^{-1}}$` },
      { t: 'How little CO₂?', lv: 2, s: R`Using $\Delta G^\circ = +130.9\ \mathrm{kJ\ mol^{-1}}$ at 298 K for the decomposition of calcium carbonate, calculate $K_p$ (which equals $p(\mathrm{CO_2})$ in bar).`, a: 1.13e-23, u: '', tol: 0.1,
        h: ['ΔG° = −RT ln K. Keep ΔG° in J.', 'ln K = −130 900 ÷ (8.314 × 298) = −52.84; keep all the decimals, because e^x magnifies rounding.'],
        steps: [{ w: R`$\ln K = -\dfrac{130\,900}{8.314 \times 298} = -52.84$`, c: 2 }, { w: R`$K = e^{-52.84} = 1.1 \times 10^{-23}$: no measurable $\mathrm{CO_2}$ pressure at room temperature, which is why limestone survives for millions of years.`, c: 2 }], ans: R`$1.1 \times 10^{-23}$` },
      { t: 'ΔH from two equilibrium constants', lv: 3, s: R`An equilibrium constant is $1.0 \times 10^{-5}$ at 300 K and $1.0 \times 10^{-3}$ at 400 K. Assuming $\Delta H^\circ$ does not change with temperature, find $\Delta H^\circ$ in $\mathrm{kJ\ mol^{-1}}$.`, a: 45.9, u: 'kJ mol⁻¹', tol: 0.01,
        h: ['This is the van ’t Hoff equation: ln(K₂/K₁) = −(ΔH°/R)(1/T₂ − 1/T₁).', 'ln 100 = 4.605; 1/400 − 1/300 = −8.33 × 10⁻⁴ K⁻¹.'],
        steps: [{ w: R`$\ln\dfrac{K_2}{K_1} = \ln 100 = 4.605$`, c: 2 }, { w: R`$\dfrac{1}{T_2} - \dfrac{1}{T_1} = \dfrac{1}{400} - \dfrac{1}{300} = -8.333 \times 10^{-4}\ \mathrm{K^{-1}}$`, c: 2 }, { w: R`$\Delta H^\circ = -\dfrac{4.605 \times 8.314}{-8.333 \times 10^{-4}} = +45\,900\ \mathrm{J\ mol^{-1}} = +45.9\ \mathrm{kJ\ mol^{-1}}$. $K$ rose with temperature, so the reaction is endothermic. ✓`, c: 2 }], ans: R`$+45.9\ \mathrm{kJ\ mol^{-1}}$` },
    ],
    cards: [['Quick sign of ΔS', 'Count moles of gas: more gas made → ΔS positive'], ['ΔG in terms of ΔH and ΔS', 'ΔG = ΔH − TΔS (ΔS in kJ!)'], ['Temperature at which feasibility switches', 'T = ΔH ÷ ΔS'], ['ΔG° and K', 'ΔG° = −RT ln K'], ['K rises with temperature, so the reaction is…', 'endothermic']] },

  { id: 'ksp', t: 'Solubility products', ph: 2, m: 35, comps: ['USNCO', 'UKChO', 'IChO'], lec: ['ca-25-1'], more: ['pbi2'],
    why: 'Solubility questions combine equilibrium, stoichiometry and pH in a few lines. Olympiads use them for qualitative analysis, selective precipitation and the Mohr titration.',
    learn: [
      { h: 'Ksp and solubility', b: R`For a sparingly soluble salt in a saturated solution, the dissolved ions are in equilibrium with the solid. The solid is left out:

$\mathrm{Ag_2CrO_4(s) \rightleftharpoons 2Ag^+(aq) + CrO_4^{2-}(aq)}$, $\quad K_{sp} = [\mathrm{Ag^+}]^2[\mathrm{CrO_4^{2-}}]$

If the solubility is $s\ \mathrm{mol\ dm^{-3}}$, then $[\mathrm{CrO_4^{2-}}] = s$ and $[\mathrm{Ag^+}] = 2s$. So $K_{sp} = (2s)^2 s = 4s^3$.

Do not compare $K_{sp}$ values directly between salts of different formula types: compare the solubilities $s$.`,
        q: { q: R`For $\mathrm{Ag_2CrO_4}$ with solubility $s$, what is $K_{sp}$?`, o: [R`$4s^3$`, R`$s^2$`, R`$2s^3$`, R`$27s^4$`], a: 0, x: R`$[\mathrm{Ag^+}] = 2s$, squared gives $4s^2$, times $s$ for chromate: $4s^3$.` } },
      { h: 'Will a precipitate form?', b: R`Calculate the **ionic product** $Q$ with the concentrations just after mixing, using the same expression as $K_{sp}$:

- $Q > K_{sp}$: the solution is supersaturated, so a precipitate forms until $Q = K_{sp}$.
- $Q \le K_{sp}$: no precipitate.

**The trap:** mixing two solutions dilutes both. Equal volumes halve each concentration.`,
        q: { q: R`Equal volumes of $2.0 \times 10^{-4}\ \mathrm{mol\ dm^{-3}}$ $\mathrm{AgNO_3}$ and NaCl are mixed. What is $Q$ for AgCl just after mixing?`, o: [R`$1.0 \times 10^{-8}$`, R`$4.0 \times 10^{-8}$`, R`$2.0 \times 10^{-4}$`, R`$1.0 \times 10^{-4}$`], a: 0, x: R`Each concentration halves to $1.0 \times 10^{-4}$; $Q = (1.0 \times 10^{-4})^2 = 1.0 \times 10^{-8}$. Forgetting the dilution gives $4.0 \times 10^{-8}$.` } },
      { h: 'Common ions, pH and selective precipitation', b: R`- **Common ion effect:** adding an ion that is already in the equilibrium pushes it to the left, so the salt becomes *less* soluble.
- **Hydroxides:** $[\mathrm{OH^-}]$ needed to start precipitation comes straight from $K_{sp}$, then convert to pH.
- **Selective precipitation:** with two anions present, the salt that needs the *lower* cation concentration precipitates first. This is how the Mohr titration works: white AgCl forms first, and red $\mathrm{Ag_2CrO_4}$ appears only once nearly all the chloride is gone.`,
        q: { q: 'Solid NaCl is added to a saturated solution of AgCl. What happens to the solubility of AgCl?', o: ['It decreases', 'It increases', 'It stays the same', 'AgCl turns into NaCl'], a: 0, x: 'The extra Cl⁻ shifts AgCl(s) ⇌ Ag⁺ + Cl⁻ to the left: the common ion effect.' } },
    ],
    ex: { t: 'Mixing silver nitrate and salt', s: R`$50.0\ \mathrm{cm^3}$ of $2.0 \times 10^{-4}\ \mathrm{mol\ dm^{-3}}$ $\mathrm{AgNO_3}$ is mixed with $50.0\ \mathrm{cm^3}$ of $2.0 \times 10^{-4}\ \mathrm{mol\ dm^{-3}}$ NaCl. $K_{sp}(\mathrm{AgCl}) = 1.8 \times 10^{-10}$. Does a precipitate form? If so, what fraction of the silver stays in solution?`,
      steps: [
        { p: 'What are the concentrations the moment the solutions mix?', w: R`The volume doubles, so $[\mathrm{Ag^+}] = [\mathrm{Cl^-}] = 1.0 \times 10^{-4}\ \mathrm{mol\ dm^{-3}}$.`, c: 1 },
        { p: 'Compare Q with Ksp.', w: R`$Q = (1.0 \times 10^{-4})^2 = 1.0 \times 10^{-8}$, which is larger than $1.8 \times 10^{-10}$: a precipitate forms.`, c: 1 },
        { p: 'Ag⁺ and Cl⁻ were in equal amounts and precipitate 1 : 1. What is left in solution?', w: R`Equal amounts are removed, so $[\mathrm{Ag^+}] = [\mathrm{Cl^-}]$ still, in a saturated solution: $[\mathrm{Ag^+}] = \sqrt{K_{sp}} = \sqrt{1.8 \times 10^{-10}} = 1.34 \times 10^{-5}$.`, c: 0 },
        { p: 'As a fraction of the silver you started with?', w: R`$1.34 \times 10^{-5} \div 1.0 \times 10^{-4} = 0.134$: about 13% of the silver stays dissolved. Precipitation is far from complete at such low concentrations.`, c: 0 },
      ], ans: 'Yes: Q > Ksp; about 13% of the silver stays in solution' },
    lad: [
      { t: 'Ksp from solubility', lv: 1, s: R`The solubility of calcium fluoride, $\mathrm{CaF_2}$, is $2.15 \times 10^{-4}\ \mathrm{mol\ dm^{-3}}$ at 25 °C. Calculate $K_{sp}$.`, a: 3.98e-11, u: 'mol³ dm⁻⁹', tol: 0.02,
        h: ['Write the dissolving equation: how many F⁻ per CaF₂?', 'Ksp = s × (2s)² = 4s³'],
        steps: [{ w: R`$\mathrm{CaF_2 \rightleftharpoons Ca^{2+} + 2F^-}$: $[\mathrm{Ca^{2+}}] = s$, $[\mathrm{F^-}] = 2s$`, c: 0 }, { w: R`$K_{sp} = s(2s)^2 = 4s^3 = 4 \times (2.15 \times 10^{-4})^3 = 3.98 \times 10^{-11}$`, c: 0 }], ans: R`$3.98 \times 10^{-11}\ \mathrm{mol^3\ dm^{-9}}$` },
      { t: 'When does Mg(OH)₂ appear?', lv: 2, s: R`Sodium hydroxide is added slowly to a solution with $[\mathrm{Mg^{2+}}] = 0.010\ \mathrm{mol\ dm^{-3}}$. $K_{sp}(\mathrm{Mg(OH)_2}) = 5.6 \times 10^{-12}$. At what pH does a precipitate first appear?`, a: 9.37, u: '', abs: 0.02,
        h: ['Ksp = [Mg²⁺][OH⁻]². Solve for [OH⁻].', '[OH⁻] = √(5.6 × 10⁻¹² ÷ 0.010); then pOH, then pH.'],
        steps: [{ w: R`$[\mathrm{OH^-}] = \sqrt{\dfrac{5.6 \times 10^{-12}}{0.010}} = 2.37 \times 10^{-5}$`, c: 2 }, { w: R`$\mathrm{pOH} = 4.63$, so $\mathrm{pH} = 9.37$.`, c: 2 }], ans: 'pH 9.37' },
      { t: 'The Mohr titration', lv: 3, s: R`A solution contains $0.010\ \mathrm{mol\ dm^{-3}}$ $\mathrm{Cl^-}$ and $0.010\ \mathrm{mol\ dm^{-3}}$ $\mathrm{CrO_4^{2-}}$. Silver nitrate is added slowly (ignore the volume change). $K_{sp}$: AgCl $1.8 \times 10^{-10}$; $\mathrm{Ag_2CrO_4}$ $1.1 \times 10^{-12}$. What percentage of the chloride is still in solution when red silver chromate first appears?`, a: 0.172, u: '%', tol: 0.02,
        h: ['Find the [Ag⁺] at which Ag₂CrO₄ starts to precipitate.', 'At that [Ag⁺], AgCl is saturated: [Cl⁻] = 1.8 × 10⁻¹⁰ ÷ [Ag⁺].'],
        steps: [{ w: R`AgCl needs only $[\mathrm{Ag^+}] = 1.8 \times 10^{-8}$ to start, so it precipitates first, despite its larger $K_{sp}$.`, c: 2 }, { w: R`Chromate starts when $[\mathrm{Ag^+}] = \sqrt{\dfrac{1.1 \times 10^{-12}}{0.010}} = 1.05 \times 10^{-5}$.`, c: 2 }, { w: R`Then $[\mathrm{Cl^-}] = \dfrac{1.8 \times 10^{-10}}{1.05 \times 10^{-5}} = 1.72 \times 10^{-5}$, which is $0.172\%$ of 0.010. So the red colour marks the end point almost exactly.`, c: 2 }], ans: '0.172%' },
    ],
    cards: [['Ksp for an AB₂ salt with solubility s', '4s³'], ['Precipitate forms when…', 'Q > Ksp (using concentrations after mixing)'], ['Common ion effect', 'An added ion already in the equilibrium makes the salt less soluble'], ['Which salt precipitates first?', 'The one that needs the lower cation concentration to reach its Ksp'], ['Mohr titration indicator', 'Chromate: red Ag₂CrO₄ appears after the chloride is used up']] },

  { id: 'kinetics', t: 'Rate laws and the Arrhenius equation', ph: 2, m: 45, comps: ['UKChO', 'USNCO', 'IChO'], lec: ['ca-26-1', 'ca-8-2'], more: ['rate-law'],
    why: 'Kinetics is the topic where olympiad papers go furthest beyond A Level: integrated rate laws, half-lives and activation energies from data. The maths is short once you know which equation to pick.',
    learn: [
      { h: 'Rate equations and orders', b: R`$$\text{rate} = k[\mathrm{A}]^m[\mathrm{B}]^n$$

The orders $m$ and $n$ come from **experiment**, not from the balanced equation. From initial-rates data, compare two experiments where only one concentration changes:

- concentration ×2, rate ×1: order 0
- concentration ×2, rate ×2: order 1
- concentration ×2, rate ×4: order 2

The units of $k$ make the units of rate come out as $\mathrm{mol\ dm^{-3}\ s^{-1}}$.`,
        q: { q: R`Doubling $[\mathrm{A}]$ while everything else stays the same makes the rate four times faster. What is the order with respect to A?`, o: ['2', '4', '1', '0.5'], a: 0, x: R`$2^m = 4$, so $m = 2$.` } },
      { h: 'Integrated rate laws and half-lives', b: R`To follow one reaction over time you need the integrated forms:

- **First order:** $\ln[\mathrm{A}] = \ln[\mathrm{A}]_0 - kt$. The half-life $t_{1/2} = \dfrac{\ln 2}{k}$ is **constant**, whatever the starting concentration.
- **Second order:** $\dfrac{1}{[\mathrm{A}]} = \dfrac{1}{[\mathrm{A}]_0} + kt$. The half-life gets longer as the reaction slows.
- **Zero order:** $[\mathrm{A}]$ falls in a straight line.

A test: plot $\ln[\mathrm{A}]$ or $1/[\mathrm{A}]$ against $t$. Whichever is straight tells you the order.`,
        q: { q: 'A first-order reaction has gone through three half-lives. What fraction of the reactant is left?', o: ['12.5%', '33%', '25%', '0%'], a: 0, x: R`$\tfrac12 \times \tfrac12 \times \tfrac12 = \tfrac18 = 12.5\%$.` } },
      { h: 'The Arrhenius equation', b: R`$$k = A\,e^{-E_a/RT}$$

$A$ is the pre-exponential factor; $E_a$ the activation energy. Two ways to use it:

- **Graph:** $\ln k = \ln A - \dfrac{E_a}{R}\cdot\dfrac{1}{T}$, so a plot of $\ln k$ against $1/T$ has gradient $-E_a/R$.
- **Two temperatures:** $\ln\dfrac{k_2}{k_1} = \dfrac{E_a}{R}\left(\dfrac{1}{T_1} - \dfrac{1}{T_2}\right)$

Keep $E_a$ in J and $T$ in K.`,
        q: { q: 'What are the units of k for a reaction that is second order overall?', o: [R`$\mathrm{dm^3\ mol^{-1}\ s^{-1}}$`, R`$\mathrm{s^{-1}}$`, R`$\mathrm{mol\ dm^{-3}\ s^{-1}}$`, R`$\mathrm{dm^6\ mol^{-2}\ s^{-1}}$`], a: 0, x: R`rate ÷ concentration² $= \mathrm{mol\ dm^{-3}\ s^{-1}} \div \mathrm{mol^2\ dm^{-6}} = \mathrm{dm^3\ mol^{-1}\ s^{-1}}$.` } },
    ],
    ex: { t: 'Orders from initial rates', s: R`For $\mathrm{A + B \rightarrow products}$: experiment 1, $[\mathrm{A}] = 0.10$, $[\mathrm{B}] = 0.10$, rate $2.0 \times 10^{-4}$; experiment 2, $[\mathrm{A}] = 0.20$, $[\mathrm{B}] = 0.10$, rate $8.0 \times 10^{-4}$; experiment 3, $[\mathrm{A}] = 0.10$, $[\mathrm{B}] = 0.20$, rate $4.0 \times 10^{-4}$ (concentrations in $\mathrm{mol\ dm^{-3}}$, rates in $\mathrm{mol\ dm^{-3}\ s^{-1}}$). Find the rate equation, $k$, and the rate when $[\mathrm{A}] = 0.30$ and $[\mathrm{B}] = 0.50$.`,
      steps: [
        { p: 'Which two experiments isolate A?', w: R`1 and 2: B is fixed, A doubles, rate goes from $2.0$ to $8.0 \times 10^{-4}$, four times. Second order in A.`, c: 0 },
        { p: 'And B?', w: R`1 and 3: A is fixed, B doubles, rate doubles. First order in B. So rate $= k[\mathrm{A}]^2[\mathrm{B}]$, third order overall.`, c: 0 },
        { p: 'Find k, with units.', w: R`From experiment 1: $k = \dfrac{2.0 \times 10^{-4}}{(0.10)^2 \times 0.10} = 0.20\ \mathrm{dm^6\ mol^{-2}\ s^{-1}}$.`, c: 2 },
        { p: 'Predict the new rate.', w: R`rate $= 0.20 \times (0.30)^2 \times 0.50 = 9.0 \times 10^{-3}\ \mathrm{mol\ dm^{-3}\ s^{-1}}$.`, c: 0 },
      ], ans: R`rate $= 0.20[\mathrm{A}]^2[\mathrm{B}]$; $9.0 \times 10^{-3}\ \mathrm{mol\ dm^{-3}\ s^{-1}}$` },
    lad: [
      { t: 'A half-life from a percentage', lv: 1, s: 'A first-order reaction is 75% complete after 40 minutes. What is its half-life, in minutes?', a: 20, u: 'min', tol: 0.01,
        h: ['75% complete means 25% is left. How many halvings is that?', '100% → 50% → 25%: two half-lives in 40 minutes.'],
        steps: [{ w: R`25% left $= \tfrac14 = (\tfrac12)^2$: two half-lives.`, c: 1 }, { w: R`$t_{1/2} = 40 \div 2 = 20\ \mathrm{min}$, constant because the reaction is first order.`, c: 1 }], ans: '20 min' },
      { t: 'A second-order decay', lv: 2, s: R`$\mathrm{NO_2}$ decomposes by a second-order process with $k = 0.54\ \mathrm{dm^3\ mol^{-1}\ s^{-1}}$ (using $1/[\mathrm{A}] = 1/[\mathrm{A}]_0 + kt$). If $[\mathrm{NO_2}]_0 = 0.050\ \mathrm{mol\ dm^{-3}}$, what is $[\mathrm{NO_2}]$ after 100 s?`, a: 0.0135, u: 'mol dm⁻³', tol: 0.01,
        h: ['Use the second-order integrated rate law.', '1/[A] = 20 + 54 = 74'],
        steps: [{ w: R`$\dfrac{1}{[\mathrm{A}]} = \dfrac{1}{0.050} + 0.54 \times 100 = 20 + 54 = 74\ \mathrm{dm^3\ mol^{-1}}$`, c: 1 }, { w: R`$[\mathrm{A}] = 1 \div 74 = 0.0135\ \mathrm{mol\ dm^{-3}}$`, c: 1 }], ans: R`$0.0135\ \mathrm{mol\ dm^{-3}}$` },
      { t: 'Heating it up', lv: 3, s: R`A reaction has $k = 1.0 \times 10^{-3}\ \mathrm{s^{-1}}$ at 300 K and $E_a = 75\ \mathrm{kJ\ mol^{-1}}$. Find $k$ at 350 K.`, a: 0.0734, u: 's⁻¹', tol: 0.02,
        h: ['Use ln(k₂/k₁) = (Ea/R)(1/T₁ − 1/T₂), with Ea in J.', '(75 000 ÷ 8.314) × (1/300 − 1/350) = 4.296'],
        steps: [{ w: R`$\dfrac{1}{300} - \dfrac{1}{350} = 4.762 \times 10^{-4}\ \mathrm{K^{-1}}$`, c: 2 }, { w: R`$\ln\dfrac{k_2}{k_1} = \dfrac{75\,000}{8.314} \times 4.762 \times 10^{-4} = 4.296$, so $\dfrac{k_2}{k_1} = 73.4$`, c: 2 }, { w: R`$k_2 = 7.34 \times 10^{-2}\ \mathrm{s^{-1}}$: 50 K hotter, 73 times faster.`, c: 2 }], ans: R`$7.3 \times 10^{-2}\ \mathrm{s^{-1}}$` },
    ],
    cards: [['Where do orders of reaction come from?', 'Experiment, never the balanced equation'], ['First-order half-life', 't½ = ln 2 ÷ k, constant'], ['Second-order integrated rate law', '1/[A] = 1/[A]₀ + kt'], ['Arrhenius plot', 'ln k against 1/T: gradient −Ea/R'], ['Units of k, first order', 's⁻¹']] },

  { id: 'electro', t: 'Electrochemistry and the Nernst equation', ph: 2, m: 45, comps: ['UKChO', 'USNCO', 'IChO'], lec: ['ca-24-2', 'ca-24-1'], more: ['zn-ag', 'nacl-cell'],
    why: 'Electrode potentials connect to ΔG and K, so one cell can be turned into a thermodynamics or an equilibrium question. The Nernst equation is the olympiad step beyond A Level.',
    learn: [
      { h: 'Cells and E°cell', b: R`Standard electrode potentials are written as **reductions**. In a cell:

$$E^\circ_{cell} = E^\circ_{\text{reduction}} - E^\circ_{\text{oxidation}}$$

The half-cell with the more positive $E^\circ$ is reduced (it is the positive electrode); the other is oxidised. A positive $E^\circ_{cell}$ means the reaction is feasible under standard conditions.

Never multiply $E^\circ$ by a coefficient: potentials are per electron.`,
        q: { q: R`$E^\circ$: $\mathrm{Cu^{2+}/Cu}$ $+0.34\ \mathrm{V}$; $\mathrm{Fe^{2+}/Fe}$ $-0.44\ \mathrm{V}$. What is $E^\circ_{cell}$ for iron reducing copper(II) ions?`, o: ['+0.78 V', '−0.10 V', '+0.10 V', '+1.56 V'], a: 0, x: R`Copper is reduced: $0.34 - (-0.44) = +0.78\ \mathrm{V}$.` } },
      { h: 'Energy, K and Faraday', b: R`$$\Delta G^\circ = -nFE^\circ_{cell}$$

$n$ is the number of electrons transferred in the equation as written; $F = 96\,485\ \mathrm{C\ mol^{-1}}$. Together with $\Delta G^\circ = -RT\ln K$:

$$\ln K = \frac{nFE^\circ}{RT}$$

Even $E^\circ = 0.5\ \mathrm{V}$ gives an enormous $K$, so cell reactions usually go to completion.

**Electrolysis:** charge $Q = It$, and moles of electrons $= Q \div F$.`,
        q: { q: R`For $\mathrm{Zn + Cu^{2+} \rightarrow Zn^{2+} + Cu}$, what is $n$ in $\Delta G^\circ = -nFE^\circ$?`, o: ['2', '1', '4', '0'], a: 0, x: 'Each zinc atom gives two electrons to one copper ion.' } },
      { h: 'The Nernst equation', b: R`Away from standard conditions:

$$E = E^\circ - \frac{RT}{nF}\ln Q \quad\Longrightarrow\quad E = E^\circ - \frac{0.0592}{n}\log_{10} Q \ \ \text{at 298 K}$$

For a half-cell written as a reduction, $Q = \dfrac{[\text{reduced}]}{[\text{oxidised}]}$. If $\mathrm{H^+}$ appears in the half-equation, its power goes into $Q$, so the potential depends on pH.

A **concentration cell** has the same electrode in two concentrations: $E^\circ = 0$, so the whole voltage comes from the Nernst term.`,
        q: { q: R`Two copper electrodes dip into $1.0$ and $0.010\ \mathrm{mol\ dm^{-3}}$ $\mathrm{Cu^{2+}}$ at 298 K. What is the cell voltage?`, o: ['0.0592 V', '0.118 V', '0.0296 V', '0 V'], a: 0, x: R`$\dfrac{0.0592}{2}\log\dfrac{1.0}{0.010} = 0.0296 \times 2 = 0.0592\ \mathrm{V}$.` } },
    ],
    ex: { t: 'How far does the Daniell cell go?', s: R`For $\mathrm{Zn(s) + Cu^{2+}(aq) \rightarrow Zn^{2+}(aq) + Cu(s)}$, $E^\circ_{cell} = +1.10\ \mathrm{V}$. Calculate $\Delta G^\circ$ and $K$ at 298 K.`,
      steps: [
        { p: 'How many electrons are transferred?', w: R`$\mathrm{Zn \rightarrow Zn^{2+} + 2e^-}$: $n = 2$.`, c: 1 },
        { p: 'Find ΔG°.', w: R`$\Delta G^\circ = -2 \times 96\,485 \times 1.10 = -212\,300\ \mathrm{J\ mol^{-1}} = -212\ \mathrm{kJ\ mol^{-1}}$.`, c: 1 },
        { p: 'Now K. Which equation links ΔG° and K?', w: R`$\ln K = \dfrac{212\,300}{8.314 \times 298} = 85.7$.`, c: 'gibbs:2' },
        { p: 'What does that number mean?', w: R`$K = e^{85.7} = 1.6 \times 10^{37}$. When the cell is flat, $[\mathrm{Zn^{2+}}]/[\mathrm{Cu^{2+}}]$ is about $10^{37}$: essentially no copper ions are left.`, c: 1 },
      ], ans: R`$\Delta G^\circ = -212\ \mathrm{kJ\ mol^{-1}}$; $K = 1.6 \times 10^{37}$` },
    lad: [
      { t: 'Copper plating', lv: 1, s: 'A current of 2.00 A passes through copper(II) sulfate solution for 30.0 minutes. What mass of copper is deposited, in g? (Cu = 63.55, F = 96 485 C mol⁻¹)', a: 1.19, u: 'g', tol: 0.01,
        h: ['Q = It, with t in seconds.', 'Moles of electrons = 3600 ÷ 96 485; each Cu²⁺ needs two.'],
        steps: [{ w: R`$Q = 2.00 \times 1800 = 3600\ \mathrm{C}$`, c: 1 }, { w: R`$n(e^-) = 3600 \div 96\,485 = 0.03731\ \mathrm{mol}$; $n(\mathrm{Cu}) = 0.01866\ \mathrm{mol}$`, c: 1 }, { w: R`$m = 0.01866 \times 63.55 = 1.19\ \mathrm{g}$`, c: 1 }], ans: '1.19 g' },
      { t: 'Not standard any more', lv: 2, s: R`$E^\circ(\mathrm{Fe^{3+}/Fe^{2+}}) = +0.77\ \mathrm{V}$. Find the electrode potential at 298 K when $[\mathrm{Fe^{3+}}] = 10\,[\mathrm{Fe^{2+}}]$.`, a: 0.829, u: 'V', abs: 0.003,
        h: ['For Fe³⁺ + e⁻ → Fe²⁺, Q = [Fe²⁺] ÷ [Fe³⁺] and n = 1.', 'E = 0.77 − 0.0592 log(0.1)'],
        steps: [{ w: R`$Q = \dfrac{[\mathrm{Fe^{2+}}]}{[\mathrm{Fe^{3+}}]} = 0.1$, $n = 1$`, c: 2 }, { w: R`$E = 0.77 - 0.0592 \log 0.1 = 0.77 + 0.0592 = +0.829\ \mathrm{V}$: more oxidised form, more positive potential.`, c: 2 }], ans: '+0.829 V' },
      { t: 'Manganate(VII) in weak acid', lv: 3, s: R`$\mathrm{MnO_4^- + 8H^+ + 5e^- \rightarrow Mn^{2+} + 4H_2O}$, $E^\circ = +1.51\ \mathrm{V}$. Find $E$ at pH 3.00, with $[\mathrm{MnO_4^-}] = [\mathrm{Mn^{2+}}] = 1.0\ \mathrm{mol\ dm^{-3}}$, at 298 K.`, a: 1.226, u: 'V', abs: 0.006,
        h: ['Q = [Mn²⁺] ÷ ([MnO₄⁻][H⁺]⁸), with n = 5.', '[H⁺] = 10⁻³, so log Q = 24.'],
        steps: [{ w: R`$Q = \dfrac{1}{(10^{-3})^8} = 10^{24}$`, c: 2 }, { w: R`$E = 1.51 - \dfrac{0.0592}{5} \times 24 = 1.51 - 0.284 = +1.226\ \mathrm{V}$`, c: 2 }, { w: 'Manganate(VII) is a much weaker oxidant in weak acid: that is why titrations with it are done in plenty of dilute sulfuric acid.', c: 2 }], ans: '+1.226 V' },
    ],
    cards: [['E°cell', 'E°(reduced half) − E°(oxidised half)'], ['ΔG° from E°', 'ΔG° = −nFE°'], ['Nernst at 298 K', 'E = E° − (0.0592/n) log Q'], ['Moles of electrons in electrolysis', 'It ÷ F'], ['Do you multiply E° by coefficients?', 'Never: potentials are per electron']] },

  { id: 'organic', t: 'Organic mechanisms and stereochemistry', ph: 2, m: 50, comps: ['UKChO', 'USNCO', 'IChO'], lec: ['ca-15-1', 'ca-13-4', 'ca-29-4'], more: ['butanone', 'polyethene'],
    why: 'Organic questions are often worth a third of a national paper. They reward mechanistic reasoning: if you know why a reaction happens, you can predict reactions you have never seen.',
    learn: [
      { h: 'Nucleophiles, electrophiles and curly arrows', b: R`- A **nucleophile** has a lone pair to donate and attacks a δ+ atom: $\mathrm{OH^-}$, $\mathrm{CN^-}$, $\mathrm{NH_3}$, $\mathrm{H_2O}$.
- An **electrophile** accepts a pair of electrons: $\mathrm{H^+}$, $\mathrm{NO_2^+}$, $\mathrm{Br_2}$ (when polarised), carbocations.

A curly arrow shows a **pair of electrons** moving. It starts at a lone pair or a bond, and ends at an atom (new bond) or between atoms. Every arrow must keep each atom’s valence possible.`,
        q: { q: 'Which of these is a nucleophile?', o: [R`$\mathrm{OH^-}$`, R`$\mathrm{H^+}$`, R`$\mathrm{NO_2^+}$`, R`$\mathrm{BF_3}$`], a: 0, x: R`Hydroxide has lone pairs and a negative charge. The others are electron-pair acceptors.` } },
      { h: 'SN1, SN2 and elimination', b: R`Halogenoalkanes react by three main routes:

- **SN2** (primary): one step, the nucleophile attacks from the side opposite the halogen. Rate $= k[\mathrm{RX}][\mathrm{Nu}]$. A chiral centre is **inverted**.
- **SN1** (tertiary): the C–X bond breaks first, giving a carbocation stabilised by the three alkyl groups. Rate $= k[\mathrm{RX}]$. A chiral centre gives a **racemic** mixture, because the flat carbocation is attacked from either face.
- **Elimination**: a strong base in hot ethanol removes H and X to give an alkene, most easily with tertiary halides.

Water and warm aqueous conditions favour substitution; hot ethanolic hydroxide favours elimination.`,
        q: { q: R`$\mathrm{(CH_3)_3CBr}$ is warmed with water. Which mechanism?`, o: ['SN1', 'SN2', 'Electrophilic addition', 'Free-radical substitution'], a: 0, x: 'Tertiary halide, weak nucleophile: the stable tertiary carbocation forms first. SN2 is blocked by the three methyl groups.' } },
      { h: 'Stereoisomers: counting them properly', b: R`- **E/Z isomerism:** each carbon of the C=C must carry two different groups.
- **Optical isomerism:** a chiral centre is a carbon with four different groups. A molecule with $n$ chiral centres has **at most** $2^n$ stereoisomers.
- A **meso** compound has chiral centres but also an internal mirror plane, so it is identical to its mirror image. Meso forms reduce the count below $2^n$.

To assign R or S: rank the four groups by atomic number (CIP rules), point the lowest away, and read 1 → 2 → 3: clockwise is R.`,
        q: { q: R`How many stereoisomers does 2,3-dibromobutane, $\mathrm{CH_3CHBrCHBrCH_3}$, have?`, o: ['3', '4', '2', '1'], a: 0, x: 'Two chiral centres give at most 4, but (2R,3S) and (2S,3R) are the same meso compound. So: (R,R), (S,S) and meso.' } },
    ],
    ex: { t: 'One halide, two products', s: R`2-bromo-2-methylpropane is (a) warmed with water, and (b) heated with KOH in ethanol. Name the main product of each, the mechanism, and the rate equation for (a).`,
      steps: [
        { p: 'Classify the halide first. Why does that matter?', w: R`$\mathrm{(CH_3)_3C{-}Br}$: the C–Br carbon carries three alkyl groups, so it is **tertiary**. Backside attack is blocked, and a tertiary carbocation is unusually stable.`, c: 1 },
        { p: '(a) Water is a weak nucleophile. What happens first?', w: R`The C–Br bond breaks on its own (slow step): $\mathrm{(CH_3)_3C^+ + Br^-}$. Then water attacks the carbocation and loses $\mathrm{H^+}$: SN1.`, c: 1 },
        { p: 'Product and rate equation for (a)?', w: R`2-methylpropan-2-ol, $\mathrm{(CH_3)_3COH}$. Only the halide is in the slow step: rate $= k[\mathrm{(CH_3)_3CBr}]$.`, c: 'steady:0' },
        { p: '(b) Hot ethanolic KOH: what changes?', w: R`Hydroxide now acts as a **base**, removing an H from a carbon next to C–Br while Br⁻ leaves: elimination. Product: 2-methylpropene, $\mathrm{(CH_3)_2C{=}CH_2}$.`, c: 1 },
      ], ans: '(a) 2-methylpropan-2-ol by SN1, rate = k[RBr]; (b) 2-methylpropene by elimination' },
    lad: [
      { t: 'Counting stereoisomers', lv: 1, s: R`How many stereoisomers does pentane-2,3-diol, $\mathrm{CH_3CH(OH)CH(OH)CH_2CH_3}$, have?`, a: 4, u: '', abs: 0.01,
        h: ['Find the chiral centres.', 'Two chiral centres. Is there a mirror plane? The two ends are different.'],
        steps: [{ w: 'C2 and C3 each carry four different groups: two chiral centres, so at most 2² = 4.', c: 2 }, { w: 'The ends (CH₃ and CH₂CH₃) differ, so no meso form is possible: all 4 exist (RR, SS, RS, SR).', c: 2 }], ans: '4' },
      { t: 'Alkenes C₄H₈', lv: 2, s: R`How many alkenes with formula $\mathrm{C_4H_8}$ are there, counting E and Z isomers separately?`, a: 4, u: '', abs: 0.01,
        h: ['Draw the carbon skeletons first: straight chain and branched.', 'Straight chain: but-1-ene and but-2-ene. Which can show E/Z?'],
        steps: [{ w: 'Straight chain: but-1-ene; but-2-ene.', c: 2 }, { w: 'But-2-ene has CH₃ and H on each C=C carbon: (E) and (Z). But-1-ene has two H on C1: no E/Z.', c: 2 }, { w: 'Branched: 2-methylpropene, no E/Z. Total: but-1-ene, (E)-but-2-ene, (Z)-but-2-ene, 2-methylpropene = 4.', c: 2 }], ans: '4' },
      { t: 'Which way round?', lv: 3, s: R`(S)-2-bromobutane reacts with aqueous sodium hydroxide by the SN2 mechanism. Name the product, including its configuration (R or S), and explain.`, a: null,
        h: ['SN2: from which side does the hydroxide attack?', 'Inversion. Now rank the groups on C2 of the product: does OH take the place of Br in the ranking?'],
        steps: [{ w: 'SN2: OH⁻ attacks opposite the C–Br bond, and the other three groups flip over like an umbrella in the wind (Walden inversion).', c: 1 }, { w: 'In the product, OH is the highest-priority group, just as Br was. The other ranks (C₂H₅ > CH₃ > H) are unchanged.', c: 2 }, { w: 'So the geometric inversion also inverts the label: the product is (R)-butan-2-ol.', c: 2 }], ans: '(R)-butan-2-ol' },
    ],
    cards: [['SN2 rate equation and stereochemistry', 'rate = k[RX][Nu]; inversion'], ['SN1 rate equation and stereochemistry', 'rate = k[RX]; racemisation'], ['Conditions for elimination', 'Hot, ethanolic, strong base (KOH)'], ['Maximum stereoisomers with n chiral centres', '2ⁿ (fewer if a meso form exists)'], ['A curly arrow shows…', 'the movement of a pair of electrons']] },

  { id: 'spectro', t: 'Structure from spectra', ph: 2, m: 45, comps: ['UKChO', 'USNCO', 'IChO'], lec: ['ca-37-4', 'ca-37-3', 'ca-22-1', 'ca-22-2'], more: ['ester-nmr'],
    why: '“Identify compound X” is the classic olympiad puzzle. It is detective work: each piece of data rules structures out, and the answer must fit every clue at once.',
    learn: [
      { h: 'Degree of unsaturation', b: R`Before anything else, count rings plus π bonds:

$$\text{DBE} = C - \frac{H}{2} + \frac{N}{2} + 1$$

Halogens count as H; oxygen and sulfur are ignored.

- DBE 1: one C=C, one C=O, or one ring.
- DBE 4 or more with six or more carbons: suspect a benzene ring.`,
        q: { q: R`What is the DBE of benzene, $\mathrm{C_6H_6}$?`, o: ['4', '3', '6', '1'], a: 0, x: R`$6 - 3 + 1 = 4$: one ring and three C=C.` } },
      { h: 'Mass spectra and IR', b: R`**Mass spectrum:** the molecular ion $\mathrm{M^+}$ gives $M_r$.

- Peaks at M and M+2 of **equal** height: one Br ($^{79}$Br and $^{81}$Br are about 1 : 1).
- M and M+2 in a **3 : 1** ratio: one Cl.
- Common losses: 15 ($\mathrm{CH_3}$), 29 ($\mathrm{C_2H_5}$ or CHO), 45 (COOH).

**Infrared:** C=O 1680–1750 cm⁻¹; O–H in alcohols 3200–3550 (broad); O–H in acids 2500–3300 (very broad); N–H 3300–3500.`,
        q: { q: 'A mass spectrum shows peaks at M and M+2 of equal height. Which element is present?', o: ['Bromine', 'Chlorine', 'Sulfur', 'Nitrogen'], a: 0, x: 'Bromine’s two isotopes are almost equally abundant. Chlorine would give a 3 : 1 pattern.' } },
      { h: 'NMR: environments, shifts, splitting', b: R`**¹H NMR** gives four pieces of information:

- **Number of signals:** number of different H environments.
- **Chemical shift:** $\delta$ 0.9–1.7 alkyl; 2.0–2.6 next to C=O; 3.3–4.3 on C attached to O; 6.5–8 aromatic; 9–10 aldehyde; 10–12 acid.
- **Integration:** the ratio of H atoms.
- **Splitting (n + 1 rule):** $n$ H on neighbouring carbons split a signal into $n + 1$ peaks. A quartet (2H) with a triplet (3H) is the fingerprint of an **ethyl** group.

**¹³C NMR:** one signal per carbon environment; C=O appears near 160–220.`,
        q: { q: 'A ¹H NMR spectrum has a 3H triplet and a 2H quartet. Which group is present?', o: [R`An ethyl group, $\mathrm{CH_3CH_2{-}}$`, 'Two methyl groups', 'An isopropyl group', R`A $\mathrm{CH_2}$ next to an OH`], a: 0, x: R`The $\mathrm{CH_3}$ is split by two neighbours (triplet); the $\mathrm{CH_2}$ by three (quartet).` } },
    ],
    ex: { t: 'Identify compound X', s: R`Compound X, $\mathrm{C_4H_8O_2}$, has a strong IR band at 1740 cm⁻¹ and no broad band above 2500. Its ¹H NMR spectrum: $\delta$ 4.1 (quartet, 2H), 2.0 (singlet, 3H), 1.3 (triplet, 3H). Identify X.`,
      steps: [
        { p: 'Start with the formula. How unsaturated is X?', w: R`DBE $= 4 - 4 + 1 = 1$: one C=C, C=O or ring.`, c: 0 },
        { p: 'What does the IR say?', w: R`1740 cm⁻¹ is C=O, and with no O–H band it is not an acid. Two O atoms and a C=O: an **ester** is the best fit.`, c: 1 },
        { p: 'Read the NMR signals one by one.', w: R`Quartet 2H + triplet 3H: an ethyl group. Singlet 3H at 2.0: a $\mathrm{CH_3}$ with no H neighbours, next to C=O.`, c: 2 },
        { p: 'The quartet is at δ 4.1. What is the CH₂ attached to?', w: R`An oxygen: $\mathrm{{-}O{-}CH_2CH_3}$. So X is $\mathrm{CH_3COOCH_2CH_3}$, **ethyl ethanoate**.`, c: 2 },
        { p: 'Rule out the isomer methyl propanoate, CH₃CH₂COOCH₃.', w: R`It would show a 3H singlet near $\delta$ 3.7 ($\mathrm{OCH_3}$) and the quartet near 2.3 (next to C=O, not O). The data fit ethyl ethanoate only.`, c: 2 },
      ], ans: R`Ethyl ethanoate, $\mathrm{CH_3COOCH_2CH_3}$` },
    lad: [
      { t: 'Caffeine', lv: 1, s: R`Calculate the degree of unsaturation of caffeine, $\mathrm{C_8H_{10}N_4O_2}$.`, a: 6, u: '', abs: 0.01,
        h: ['DBE = C − H/2 + N/2 + 1. Ignore the oxygens.', '8 − 5 + 2 + 1'],
        steps: [{ w: R`DBE $= 8 - \tfrac{10}{2} + \tfrac{4}{2} + 1 = 6$`, c: 0 }, { w: 'Caffeine has two rings, two C=O and two C=N/C=C: 6. ✓', c: 0 }], ans: '6' },
      { t: 'An isopropyl group', lv: 2, s: R`How many signals are in the ¹H NMR spectrum of 2-bromopropane, $\mathrm{CH_3CHBrCH_3}$?`, a: 2, u: '', abs: 0.01,
        h: ['Are the two CH₃ groups in the same environment?', 'Yes: there is a mirror plane through the C–Br. So: CH₃ (6H) and CH (1H).'],
        steps: [{ w: 'The two methyl groups are equivalent: one signal for 6H.', c: 2 }, { w: 'The CH is a second signal (1H). Total: 2.', c: 2 }, { w: 'Splitting: the 6H signal is a doublet (one neighbour), and the CH is a septet (six neighbours).', c: 2 }], ans: '2 (a 6H doublet and a 1H septet)' },
      { t: 'A symmetrical ketone', lv: 3, s: R`Compound Y, $\mathrm{C_5H_{10}O}$, has a strong IR band at 1715 cm⁻¹. Its ¹H NMR spectrum shows only a quartet (4H) and a triplet (6H). How many signals will its ¹³C NMR spectrum show?`, a: 3, u: '', abs: 0.01,
        h: ['DBE 1 and 1715 cm⁻¹: a C=O. Only two ¹H signals means high symmetry.', 'Two identical ethyl groups, one each side of a C=O.'],
        steps: [{ w: R`DBE $= 5 - 5 + 1 = 1$; 1715 cm⁻¹ with no aldehyde signal: a ketone.`, c: 0 }, { w: R`4H quartet + 6H triplet: two equivalent ethyl groups. Y is pentan-3-one, $\mathrm{CH_3CH_2COCH_2CH_3}$.`, c: 2 }, { w: 'Carbon environments: C=O, the two CH₂ (equivalent), the two CH₃ (equivalent): 3 signals.', c: 2 }], ans: '3 (Y is pentan-3-one)' },
    ],
    cards: [['DBE formula', 'C − H/2 + N/2 + 1 (halogens count as H)'], ['M : M+2 = 1 : 1', 'One bromine'], ['M : M+2 = 3 : 1', 'One chlorine'], ['n + 1 rule', 'n H on neighbouring carbons → n + 1 peaks'], ['C=O stretch in IR', '1680–1750 cm⁻¹']] },

  { id: 'steady', t: 'Mechanisms and the steady state', ph: 3, m: 50, comps: ['UKChO', 'IChO'], lec: ['ca-26-1', 'ca-26-2'], more: ['rate-law'],
    why: 'Deriving a rate law from a proposed mechanism is a signature IChO skill, and national finals love it. It tests whether you understand what a rate equation really means.',
    learn: [
      { h: 'The rate-determining step', b: R`A mechanism is a sequence of elementary steps. For an elementary step, the order **does** equal the number of molecules colliding.

If one step is much slower than the rest, it sets the rate. The rate equation then contains the species in that slow step (and any steps before it), but **never an intermediate**: intermediates must be replaced by reactants.

Species that only appear after the slow step do not appear in the rate equation at all: they are zero order.`,
        q: { q: R`Step 1 (slow): $\mathrm{A + B \rightarrow X}$. Step 2 (fast): $\mathrm{X + B \rightarrow P}$. What is the rate equation?`, o: [R`rate $= k[\mathrm{A}][\mathrm{B}]$`, R`rate $= k[\mathrm{A}][\mathrm{B}]^2$`, R`rate $= k[\mathrm{X}][\mathrm{B}]$`, R`rate $= k[\mathrm{A}]$`], a: 0, x: 'Only the slow step counts. The second B arrives after it.' } },
      { h: 'Pre-equilibrium', b: R`If a **fast equilibrium** comes before the slow step, the intermediate’s concentration is set by that equilibrium:

Step 1 (fast): $\mathrm{2NO \rightleftharpoons N_2O_2}$, $\quad K = \dfrac{[\mathrm{N_2O_2}]}{[\mathrm{NO}]^2}$

Step 2 (slow): $\mathrm{N_2O_2 + O_2 \rightarrow 2NO_2}$

rate $= k_2[\mathrm{N_2O_2}][\mathrm{O_2}] = k_2K[\mathrm{NO}]^2[\mathrm{O_2}]$

The intermediate is gone, replaced by $K$ and the reactants.`,
        q: { q: 'With the mechanism above, what is the order with respect to NO?', o: ['2', '1', '3', '0'], a: 0, x: R`$[\mathrm{N_2O_2}] = K[\mathrm{NO}]^2$, so NO appears squared.` } },
      { h: 'The steady-state approximation', b: R`When no single step is clearly slowest, assume each reactive intermediate is used up as fast as it is made, so its concentration stays small and constant:

$$\frac{d[\mathrm{I}]}{dt} = (\text{rate of formation}) - (\text{rate of removal}) = 0$$

Solve that equation for $[\mathrm{I}]$ and substitute into the rate of the product-forming step.

The most famous result is **Michaelis–Menten** kinetics for enzymes:

$$\text{rate} = \frac{V_{max}[\mathrm{S}]}{K_M + [\mathrm{S}]}$$`,
        q: { q: R`In Michaelis–Menten kinetics, what is the rate when $[\mathrm{S}] = K_M$?`, o: [R`$V_{max}/2$`, R`$V_{max}$`, R`$V_{max}/4$`, R`$2V_{max}$`], a: 0, x: R`$\dfrac{V_{max}K_M}{2K_M} = \dfrac{V_{max}}{2}$: this is the definition of $K_M$.` } },
    ],
    ex: { t: 'Why ozone decomposition slows in oxygen', s: R`Proposed mechanism for $\mathrm{2O_3 \rightarrow 3O_2}$: step 1, $\mathrm{O_3 \rightleftharpoons O_2 + O}$ (forward $k_1$, back $k_{-1}$); step 2, $\mathrm{O + O_3 \rightarrow 2O_2}$ ($k_2$). Use the steady-state approximation for O to derive the rate law, then simplify it when $k_{-1}[\mathrm{O_2}] \gg k_2[\mathrm{O_3}]$.`,
      steps: [
        { p: 'Write d[O]/dt: what makes O and what removes it?', w: R`Made by step 1 forward; removed by step 1 back and by step 2: $\dfrac{d[\mathrm{O}]}{dt} = k_1[\mathrm{O_3}] - k_{-1}[\mathrm{O_2}][\mathrm{O}] - k_2[\mathrm{O}][\mathrm{O_3}] = 0$`, c: 2 },
        { p: 'Solve for [O].', w: R`$[\mathrm{O}] = \dfrac{k_1[\mathrm{O_3}]}{k_{-1}[\mathrm{O_2}] + k_2[\mathrm{O_3}]}$`, c: 2 },
        { p: 'Put it into the rate of step 2.', w: R`rate $= k_2[\mathrm{O}][\mathrm{O_3}] = \dfrac{k_1k_2[\mathrm{O_3}]^2}{k_{-1}[\mathrm{O_2}] + k_2[\mathrm{O_3}]}$`, c: 2 },
        { p: 'Simplify when k₋₁[O₂] is much bigger than k₂[O₃]. What does the result predict?', w: R`rate $\approx \dfrac{k_1k_2[\mathrm{O_3}]^2}{k_{-1}[\mathrm{O_2}]}$: second order in ozone and order −1 in oxygen. Adding $\mathrm{O_2}$ slows the reaction, as observed. This is also the pre-equilibrium result.`, c: 1 },
      ], ans: R`rate $= \dfrac{k_1k_2[\mathrm{O_3}]^2}{k_{-1}[\mathrm{O_2}] + k_2[\mathrm{O_3}]} \approx \dfrac{k_1k_2[\mathrm{O_3}]^2}{k_{-1}[\mathrm{O_2}]}$` },
    lad: [
      { t: 'NO₂ and CO', lv: 1, s: R`$\mathrm{NO_2 + CO \rightarrow NO + CO_2}$ goes by: step 1 (slow) $\mathrm{2NO_2 \rightarrow NO_3 + NO}$; step 2 (fast) $\mathrm{NO_3 + CO \rightarrow NO_2 + CO_2}$. What is the order with respect to CO?`, a: 0, u: '', abs: 0.01,
        h: ['Which species are in the slow step?', 'CO only appears in step 2, after the slow step.'],
        steps: [{ w: R`Slow step: two $\mathrm{NO_2}$, so rate $= k[\mathrm{NO_2}]^2$.`, c: 0 }, { w: 'CO is consumed after the slow step: zero order. Notice the rate equation looks nothing like the overall equation.', c: 0 }], ans: '0' },
      { t: 'Hydrogen iodide again', lv: 2, s: R`A mechanism for $\mathrm{H_2 + I_2 \rightarrow 2HI}$: step 1 (fast equilibrium) $\mathrm{I_2 \rightleftharpoons 2I}$, constant $K$; step 2 (slow) $\mathrm{H_2 + 2I \rightarrow 2HI}$. What order with respect to $\mathrm{I_2}$ does this predict?`, a: 1, u: '', abs: 0.01,
        h: ['rate = k₂[H₂][I]². Replace [I]² using K.', 'K = [I]² ÷ [I₂], so [I]² = K[I₂].'],
        steps: [{ w: R`rate $= k_2[\mathrm{H_2}][\mathrm{I}]^2$`, c: 1 }, { w: R`$[\mathrm{I}]^2 = K[\mathrm{I_2}]$, so rate $= k_2K[\mathrm{H_2}][\mathrm{I_2}]$: first order in $\mathrm{I_2}$, the same rate law as a single collision.`, c: 1 }], ans: '1' },
      { t: 'Enzyme at 90%', lv: 3, s: R`An enzyme has $K_M = 2.0 \times 10^{-3}\ \mathrm{mol\ dm^{-3}}$. At what substrate concentration does it reach 90% of $V_{max}$?`, a: 0.018, u: 'mol dm⁻³', tol: 0.01,
        h: ['Set rate = 0.9 Vmax in the Michaelis–Menten equation.', '0.9(K_M + [S]) = [S], so [S] = 9 K_M.'],
        steps: [{ w: R`$0.9 = \dfrac{[\mathrm{S}]}{K_M + [\mathrm{S}]}$`, c: 2 }, { w: R`$0.9K_M + 0.9[\mathrm{S}] = [\mathrm{S}]$, so $[\mathrm{S}] = 9K_M$`, c: 2 }, { w: R`$[\mathrm{S}] = 9 \times 2.0 \times 10^{-3} = 0.018\ \mathrm{mol\ dm^{-3}}$. Going from 50% to 90% needs nine times more substrate: saturation is slow.`, c: 2 }], ans: R`$0.018\ \mathrm{mol\ dm^{-3}}$` },
    ],
    cards: [['Can an intermediate appear in a rate equation?', 'No: replace it with reactants'], ['Pre-equilibrium: [intermediate] =', 'K × (reactant concentrations)'], ['Steady-state approximation', 'd[I]/dt = 0 for each reactive intermediate'], ['Michaelis–Menten', 'rate = Vmax[S] ÷ (K_M + [S])'], ['Species consumed after the slow step are…', 'zero order']] },

  { id: 'crystal', t: 'Crystal field theory', ph: 3, m: 45, comps: ['UKChO', 'IChO'], lec: ['ca-28-3', 'ca-28-1', 'ca-28-5'], more: ['iron-complexes'],
    why: 'Colour and magnetism of transition-metal complexes go beyond A Level, and both UKChO and IChO expect you to explain them with d-orbital splitting.',
    learn: [
      { h: 'Counting d electrons', b: R`For a first-row transition metal ion:

$$n = \text{group} - \text{oxidation state}$$

where $n$ is the number of d electrons, $d^n$.

Fe is in group 8, so $\mathrm{Fe^{3+}}$ is $d^5$; Cu is in group 11, so $\mathrm{Cu^{2+}}$ is $d^9$. Remember that 4s electrons are lost first when the ion forms. Ligands do not change $n$.`,
        q: { q: R`How many d electrons does $\mathrm{Co^{3+}}$ have?`, o: ['6', '7', '9', '3'], a: 0, x: 'Cobalt is in group 9: 9 − 3 = 6.' } },
      { h: 'Splitting, and high or low spin', b: R`In an **octahedral** complex the ligands point straight at two of the d orbitals ($e_g$), raising them, while the other three ($t_{2g}$) are lowered:

- $t_{2g}$: $-0.4\Delta_o$ each; $e_g$: $+0.6\Delta_o$ each.
- **CFSE** $= -0.4\Delta_o\,n(t_{2g}) + 0.6\Delta_o\,n(e_g)$, where $n$ counts the electrons in each set.

For $d^4$ to $d^7$ there is a choice. If $\Delta_o$ is larger than the pairing energy, electrons pair in $t_{2g}$ (**low spin**); otherwise they spread out (**high spin**). The ligand decides, through the **spectrochemical series**:

I⁻ < Br⁻ < Cl⁻ < F⁻ < OH⁻ < H₂O < NH₃ < en < CN⁻ < CO`,
        q: { q: R`Which ligand gives the largest $\Delta_o$?`, o: [R`$\mathrm{CN^-}$`, R`$\mathrm{H_2O}$`, R`$\mathrm{Cl^-}$`, R`$\mathrm{NH_3}$`], a: 0, x: 'Cyanide is near the strong-field end of the spectrochemical series.' } },
      { h: 'Colour and magnetism', b: R`- **Colour:** an electron jumps from $t_{2g}$ to $e_g$ by absorbing light with $E = \Delta_o$. We see the **complementary** colour. Bigger $\Delta_o$ → shorter wavelength absorbed. Convert with $E = hc/\lambda$, then multiply by $N_A$ for $\mathrm{J\ mol^{-1}}$.
- $d^0$ and $d^{10}$ ions have no possible d–d jump, so they are colourless.
- **Magnetism:** the spin-only moment is $\mu = \sqrt{n(n+2)}$ Bohr magnetons, with $n$ unpaired electrons. No unpaired electrons: **diamagnetic**.`,
        q: { q: R`Why are zinc(II) compounds white?`, o: [R`$\mathrm{Zn^{2+}}$ is $d^{10}$, so no d–d transition is possible`, R`$\mathrm{Zn^{2+}}$ has no d electrons`, 'Zinc is not a metal', 'Its Δo is too small'], a: 0, x: R`Zinc is group 12, so $\mathrm{Zn^{2+}}$ is $d^{10}$: every d orbital is full.` } },
    ],
    ex: { t: 'Two cobalt(III) complexes', s: R`$[\mathrm{Co(NH_3)_6}]^{3+}$ is diamagnetic, but $[\mathrm{CoF_6}]^{3-}$ is paramagnetic. Explain, and give each complex’s CFSE (in terms of $\Delta_o$) and spin-only magnetic moment.`,
      steps: [
        { p: 'Start by counting d electrons.', w: R`Both contain $\mathrm{Co^{3+}}$: $9 - 3 = d^6$.`, c: 0 },
        { p: 'Where are NH₃ and F⁻ in the spectrochemical series, and what does that mean?', w: R`$\mathrm{NH_3}$ is fairly strong-field: $\Delta_o$ is larger than the pairing energy, so **low spin**, $t_{2g}^6 e_g^0$. $\mathrm{F^-}$ is weak-field: **high spin**, $t_{2g}^4 e_g^2$.`, c: 1 },
        { p: 'Unpaired electrons and μ for each?', w: R`Low spin $t_{2g}^6$: none, diamagnetic, $\mu = 0$. High spin $t_{2g}^4 e_g^2$: four unpaired, $\mu = \sqrt{4 \times 6} = 4.90\ \mu_B$.`, c: 2 },
        { p: 'CFSE for each?', w: R`Low spin: $6 \times (-0.4) = -2.4\Delta_o$ (plus the cost of pairing). High spin: $4(-0.4) + 2(0.6) = -0.4\Delta_o$.`, c: 1 },
      ], ans: R`$[\mathrm{Co(NH_3)_6}]^{3+}$: low spin, $-2.4\Delta_o$, $\mu = 0$; $[\mathrm{CoF_6}]^{3-}$: high spin, $-0.4\Delta_o$, $\mu = 4.90\ \mu_B$` },
    lad: [
      { t: 'Chromium(III) in water', lv: 1, s: R`Calculate the spin-only magnetic moment of $[\mathrm{Cr(H_2O)_6}]^{3+}$, in Bohr magnetons.`, a: 3.87, u: 'μB', tol: 0.01,
        h: ['Cr is group 6. How many d electrons in Cr³⁺?', 'd³: three unpaired electrons in t₂g, whatever the ligand.'],
        steps: [{ w: R`$\mathrm{Cr^{3+}}$: $6 - 3 = d^3$, $t_{2g}^3$: three unpaired.`, c: 0 }, { w: R`$\mu = \sqrt{3 \times 5} = \sqrt{15} = 3.87\ \mu_B$`, c: 2 }], ans: '3.87 μB' },
      { t: 'The special d⁵', lv: 2, s: R`What is the CFSE, as a multiple of $\Delta_o$, of a high-spin octahedral $d^5$ ion such as $[\mathrm{Fe(H_2O)_6}]^{3+}$?`, a: 0, u: 'Δo', abs: 0.01,
        h: ['High spin d⁵: one electron in each d orbital.', 't₂g³ e_g²: 3(−0.4) + 2(+0.6)'],
        steps: [{ w: R`High spin $d^5$: $t_{2g}^3 e_g^2$`, c: 1 }, { w: R`CFSE $= 3(-0.4) + 2(0.6) = 0$. No stabilisation at all, which is why high-spin $d^5$ complexes are often pale: their transitions are spin-forbidden.`, c: 1 }], ans: '0' },
      { t: 'The purple titanium ion', lv: 3, s: R`$[\mathrm{Ti(H_2O)_6}]^{3+}$ absorbs most strongly at 500 nm. Calculate $\Delta_o$ in $\mathrm{kJ\ mol^{-1}}$. ($h = 6.626 \times 10^{-34}\ \mathrm{J\ s}$, $c = 2.998 \times 10^8\ \mathrm{m\ s^{-1}}$, $N_A = 6.022 \times 10^{23}$)`, a: 239, u: 'kJ mol⁻¹', tol: 0.01,
        h: ['d¹: one electron jumps t₂g → e_g, so the photon energy equals Δo.', 'E = hc/λ for one ion; × N_A for a mole; ÷ 1000 for kJ.'],
        steps: [{ w: R`$\mathrm{Ti^{3+}}$ is $d^1$: the single absorption is $t_{2g} \rightarrow e_g$, so $E_{photon} = \Delta_o$.`, c: 2 }, { w: R`$E = \dfrac{6.626 \times 10^{-34} \times 2.998 \times 10^8}{500 \times 10^{-9}} = 3.973 \times 10^{-19}\ \mathrm{J}$`, c: 2 }, { w: R`$\times 6.022 \times 10^{23} = 239\,000\ \mathrm{J\ mol^{-1}} = 239\ \mathrm{kJ\ mol^{-1}}$. It absorbs green-yellow light, so it looks purple.`, c: 2 }], ans: R`$239\ \mathrm{kJ\ mol^{-1}}$` },
    ],
    cards: [['d electrons in a first-row ion', 'group number − oxidation state'], ['Octahedral splitting energies', 't₂g −0.4Δo; e_g +0.6Δo'], ['Low spin happens when…', 'Δo > pairing energy (strong-field ligands)'], ['Spin-only magnetic moment', 'μ = √(n(n+2)) μB'], ['Why are d¹⁰ ions colourless?', 'No empty d orbital for a d–d jump']] }
  );
})();

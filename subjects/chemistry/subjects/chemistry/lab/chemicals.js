'use strict';
/* =====================================================================
   CHEMICALS — every substance used in Cambridge IGCSE Chemistry (0620)
   st: aq | l | s | g      conc: mol/dm³ (aq)      M: g/mol (solids)
   ab: acid–base content. aq/l: per dm³ of solution; s and g: per mol.
       pos/neg = spectator ion charge; sys = weak acid/base systems.
   tv: colour strength of a solution · tm: colour strength per mol/dm³
   once a solid dissolves · imm: immiscible with water (organic layer)
   ===================================================================== */
const CHEM={},CHEM_ORDER=[];
const CHEM_CATS=[['acid','Acids & alkalis'],['soln','Solutions'],['reag','Test reagents'],['ind','Indicators'],['solid','Solids & salts'],
  ['metal','Metals'],['gas','Gases'],['org','Organic']];
function ch(id,o){CHEM[id]={id,...o};CHEM_ORDER.push(id);}
const HZ={C:'Corrosive',I:'Irritant',F:'Flammable',T:'Toxic',O:'Oxidising',H:'Harmful',E:'Environmental hazard',L:'Low hazard'};

/* acids & alkalis */
ch('water',{n:'Distilled water',f:'H₂O',st:'l',cat:'acid',col:'#dcebf6',haz:['L'],look:'colourless liquid',
  note:'Pure water has pH 7. Test for water: turns anhydrous copper(II) sulfate from white to blue, or cobalt(II) chloride paper from blue to pink. Pure water boils at exactly 100 °C and freezes at 0 °C.'});
ch('hcl',{n:'Hydrochloric acid',f:'HCl',st:'aq',conc:1.0,cat:'acid',col:'#dcebf6',haz:['I'],ab:{neg:1},look:'colourless solution',
  note:'Strong acid: fully ionised, HCl → H⁺ + Cl⁻. Its salts are chlorides. Acid + metal → salt + hydrogen; acid + base → salt + water; acid + carbonate → salt + water + CO₂.'});
ch('h2so4',{n:'Sulfuric acid',f:'H₂SO₄',st:'aq',conc:1.0,cat:'acid',col:'#dcebf6',haz:['C'],ab:{neg:2},look:'colourless solution',
  note:'Strong acid. Its salts are sulfates. Each H₂SO₄ gives two H⁺, so it needs twice as much alkali to neutralise as HCl of the same concentration.'});
ch('hno3',{n:'Nitric acid',f:'HNO₃',st:'aq',conc:1.0,cat:'acid',col:'#dcebf6',haz:['I','O'],ab:{neg:1},look:'colourless solution',
  note:'Strong acid. Its salts are nitrates. Used to acidify a sample before the halide (AgNO₃) and sulfate (Ba(NO₃)₂) tests.'});
ch('ethanoic',{n:'Ethanoic acid',f:'CH₃COOH',st:'aq',conc:1.0,cat:'acid',col:'#dcebf6',haz:['I'],ab:{sys:{eth:1}},look:'colourless, smells of vinegar',
  note:'Weak acid: only partly ionised, so its pH is higher than a strong acid of the same concentration and it reacts more slowly. Made by oxidising ethanol. Forms esters with alcohols.'});
ch('naoh',{n:'Sodium hydroxide',f:'NaOH',st:'aq',conc:1.0,cat:'acid',col:'#dcebf6',haz:['C'],ab:{pos:1},look:'colourless solution',
  note:'Strong alkali. Cation test: add it drop by drop, then in excess, and look at the colour of the hydroxide precipitate. Warm with an ammonium salt to release ammonia.'});
ch('koh',{n:'Potassium hydroxide',f:'KOH',st:'aq',conc:1.0,cat:'acid',col:'#dcebf6',haz:['C'],ab:{pos:1},look:'colourless solution',
  note:'Strong alkali, like sodium hydroxide. Its salts are potassium salts.'});
ch('nh3aq',{n:'Aqueous ammonia',f:'NH₃',st:'aq',conc:1.0,cat:'acid',col:'#dcebf6',haz:['I'],ab:{sys:{nh:1}},look:'colourless, sharp smell',
  note:'Weak alkali. Cation tests: Cu²⁺ gives a light blue precipitate that dissolves in excess to a dark blue solution; Zn²⁺ precipitate dissolves in excess; Al³⁺ precipitate does not.'});

/* solutions */
ch('naclaq',{n:'Sodium chloride solution',f:'NaCl',st:'aq',conc:0.5,cat:'soln',col:'#dcebf6',haz:['L'],ab:{pos:0.5,neg:0.5},look:'colourless solution',
  note:'Neutral salt. Concentrated solution (brine) electrolysis: H₂ at the cathode, Cl₂ at the anode, NaOH left in solution.'});
ch('kbr',{n:'Potassium bromide solution',f:'KBr',st:'aq',conc:0.5,cat:'soln',col:'#dcebf6',haz:['L'],ab:{pos:0.5,neg:0.5},look:'colourless solution',
  note:'Contains Br⁻. Chlorine displaces bromine (solution turns orange). With acidified AgNO₃: cream precipitate.'});
ch('ki',{n:'Potassium iodide solution',f:'KI',st:'aq',conc:0.5,cat:'soln',col:'#dcebf6',haz:['L'],ab:{pos:0.5,neg:0.5},look:'colourless solution',
  note:'Contains I⁻. Chlorine or bromine displaces iodine (solution turns brown). With acidified AgNO₃: yellow precipitate.'});
ch('cuso4aq',{n:'Copper(II) sulfate solution',f:'CuSO₄',st:'aq',conc:0.5,cat:'soln',col:'#3d8fd6',tv:2.5,haz:['H','E'],ab:{neg:1,sys:{Cu:0.5}},look:'blue solution',
  note:'Blue because of Cu²⁺. With NaOH: light blue precipitate. Electrolysis with copper electrodes purifies copper; with inert electrodes copper forms at the cathode and oxygen at the anode.'});
ch('cucl2',{n:'Copper(II) chloride solution',f:'CuCl₂',st:'aq',conc:0.5,cat:'soln',col:'#36a29b',tv:2.5,haz:['H','E'],ab:{neg:1,sys:{Cu:0.5}},look:'blue-green solution',
  note:'Electrolysis with inert electrodes: copper at the cathode, chlorine at the anode.'});
ch('feso4',{n:'Iron(II) sulfate solution',f:'FeSO₄',st:'aq',conc:0.5,cat:'soln',col:'#9fcf86',tv:1.4,haz:['H'],ab:{neg:1,sys:{Fe2:0.5}},look:'pale green solution',
  note:'Fe²⁺. With NaOH or aqueous ammonia: green precipitate, insoluble in excess, which slowly turns red-brown at the surface.'});
ch('fecl3',{n:'Iron(III) chloride solution',f:'FeCl₃',st:'aq',conc:0.5,cat:'soln',col:'#c9862a',tv:3,haz:['I'],ab:{neg:1.5,sys:{Fe3:0.5}},look:'yellow-brown solution',
  note:'Fe³⁺. With NaOH or aqueous ammonia: red-brown precipitate, insoluble in excess.'});
ch('znso4',{n:'Zinc sulfate solution',f:'ZnSO₄',st:'aq',conc:0.5,cat:'soln',col:'#dcebf6',haz:['I','E'],ab:{neg:1,sys:{Zn:0.5}},look:'colourless solution',
  note:'Zn²⁺. White precipitate with NaOH that dissolves in excess; with aqueous ammonia it also dissolves in excess.'});
ch('mgso4',{n:'Magnesium sulfate solution',f:'MgSO₄',st:'aq',conc:0.5,cat:'soln',col:'#dcebf6',haz:['L'],ab:{pos:1,neg:1},look:'colourless solution',
  note:'Mg²⁺. White precipitate with NaOH, insoluble in excess.'});
ch('alsulf',{n:'Aluminium sulfate solution',f:'Al₂(SO₄)₃',st:'aq',conc:0.25,cat:'soln',col:'#dcebf6',haz:['I'],ab:{neg:1.5,sys:{Al:0.5}},look:'colourless solution',
  note:'Al³⁺. White precipitate with NaOH that dissolves in excess; with aqueous ammonia it does not dissolve in excess. That is how you tell it from Zn²⁺.'});
ch('crsulf',{n:'Chromium(III) sulfate solution',f:'Cr₂(SO₄)₃',st:'aq',conc:0.1,cat:'soln',col:'#4f8f5a',tv:3,haz:['H'],ab:{neg:0.6,sys:{Cr:0.2}},look:'green solution',
  note:'Cr³⁺. Green precipitate with NaOH that dissolves in excess; green precipitate with aqueous ammonia, insoluble in excess.'});
ch('cacl2',{n:'Calcium chloride solution',f:'CaCl₂',st:'aq',conc:0.5,cat:'soln',col:'#dcebf6',haz:['I'],ab:{pos:1,neg:1},look:'colourless solution',
  note:'Ca²⁺. White precipitate with NaOH, insoluble in excess; no precipitate or a very slight one with aqueous ammonia. Orange-red flame.'});
ch('nh4claq',{n:'Ammonium chloride solution',f:'NH₄Cl',st:'aq',conc:0.5,cat:'soln',col:'#dcebf6',haz:['H'],ab:{neg:0.5,sys:{nh:0.5}},look:'colourless solution',
  note:'NH₄⁺. Warm with NaOH: ammonia is given off, which turns damp red litmus blue. Slightly acidic.'});
ch('na2co3aq',{n:'Sodium carbonate solution',f:'Na₂CO₃',st:'aq',conc:0.5,cat:'soln',col:'#dcebf6',haz:['I'],ab:{pos:1,sys:{co3:0.5}},look:'colourless solution',
  note:'CO₃²⁻. Add dilute acid: effervescence, and the CO₂ turns limewater milky. Its solution is alkaline.'});
ch('na2so4',{n:'Sodium sulfate solution',f:'Na₂SO₄',st:'aq',conc:0.5,cat:'soln',col:'#dcebf6',haz:['L'],ab:{pos:1,neg:1},look:'colourless solution',
  note:'SO₄²⁻. Electrolysis with inert electrodes: hydrogen at the cathode and oxygen at the anode, in a 2:1 volume ratio.'});
ch('thio',{n:'Sodium thiosulfate solution',f:'Na₂S₂O₃',st:'aq',conc:0.15,cat:'soln',col:'#dcebf6',haz:['L'],ab:{pos:0.3,neg:0.3},look:'colourless solution',
  note:'Rates of reaction: with dilute HCl a pale yellow precipitate of sulfur forms. Time how long until the cross under the flask disappears.'});
ch('h2o2',{n:'Hydrogen peroxide',f:'H₂O₂',st:'aq',conc:0.9,cat:'soln',col:'#dcebf6',haz:['I'],look:'colourless solution (3%)',
  note:'Decomposes slowly to water and oxygen: 2H₂O₂ → 2H₂O + O₂. Manganese(IV) oxide catalyses it, which makes it the classic catalyst and rates experiment.'});

/* test reagents */
ch('limewater',{n:'Limewater',f:'Ca(OH)₂',st:'aq',conc:0.02,cat:'reag',col:'#dcebf6',haz:['I'],ab:{pos:0.04},look:'colourless solution',
  note:'Test for CO₂: bubble the gas through it and it turns milky (a white precipitate of calcium carbonate).'});
ch('agno3',{n:'Silver nitrate solution',f:'AgNO₃',st:'aq',conc:0.05,cat:'reag',col:'#dcebf6',haz:['I','E'],ab:{pos:0.05,neg:0.05},look:'colourless solution',
  note:'Halide test. Acidify the sample with dilute nitric acid, then add it: Cl⁻ white precipitate, Br⁻ cream, I⁻ yellow.'});
ch('bano3',{n:'Barium nitrate solution',f:'Ba(NO₃)₂',st:'aq',conc:0.1,cat:'reag',col:'#dcebf6',haz:['H'],ab:{pos:0.2,neg:0.2},look:'colourless solution',
  note:'Sulfate test. Acidify the sample with dilute nitric acid, then add it: a white precipitate of barium sulfate means SO₄²⁻ is present.'});
ch('kmno4',{n:'Acidified potassium manganate(VII)',f:'KMnO₄/H⁺',st:'aq',conc:0.01,cat:'reag',col:'#7a1f8f',tv:40,haz:['O','H'],ab:{pos:0.01,neg:2.01},look:'purple solution',
  note:'Oxidising agent. Test for sulfur dioxide: turns from purple to colourless. Also decolourised by Fe²⁺ and by sulfite ions.'});
ch('brwater',{n:'Bromine water',f:'Br₂',st:'aq',conc:0.02,cat:'reag',col:'#e8902a',tv:6,haz:['H','I'],look:'orange solution',
  note:'Test for C=C bonds: shake with an alkene and it goes from orange to colourless. Alkanes leave it orange.'});
ch('clwater',{n:'Chlorine water',f:'Cl₂',st:'aq',conc:0.02,cat:'reag',col:'#d8e27a',tv:1.2,haz:['I'],look:'very pale yellow-green solution',
  note:'Chlorine is the most reactive of Cl, Br, I: it displaces bromine from bromides and iodine from iodides.'});
ch('i2aq',{n:'Iodine solution',f:'I₂',st:'aq',conc:0.05,cat:'reag',col:'#8a4a14',tv:10,haz:['H'],look:'brown solution',
  note:'Iodine is the least reactive halogen here, so it cannot displace chlorine or bromine.'});

/* indicators */
ch('ui',{n:'Universal indicator',short:'UI',f:'UI',st:'aq',cat:'ind',ind:'ui',col:'#5fb848',haz:['F'],look:'green solution',
  note:'Gives a colour for each pH: red (1–2) strong acid, orange or yellow (3–6) weak acid, green (7) neutral, blue (8–11) weak alkali, purple (12–14) strong alkali.'});
ch('litmus',{n:'Litmus solution',short:'Litmus',f:'Litmus',st:'aq',cat:'ind',ind:'litmus',col:'#8a4f9e',haz:['L'],look:'purple solution',
  note:'Red in acid, blue in alkali, purple in neutral solution. Only tells you acid or alkali, not the pH.'});
ch('mo',{n:'Methyl orange',short:'MO',f:'MO',st:'aq',cat:'ind',ind:'mo',col:'#f08a24',haz:['T'],look:'orange solution',
  note:'Red in acid, yellow in alkali. Titration indicator: the end-point is the change to orange.'});
ch('phph',{n:'Phenolphthalein',short:'Phth',f:'Phth',st:'aq',cat:'ind',ind:'phph',col:'#f2f2f2',haz:['F'],look:'colourless solution',
  note:'Colourless in acid and neutral solution, pink in alkali.'});
ch('thymol',{n:'Thymolphthalein',short:'Thy',f:'Thy',st:'aq',cat:'ind',ind:'thymol',col:'#f2f2f2',haz:['F'],look:'colourless solution',
  note:'Colourless in acid, blue in alkali. A titration indicator in the IGCSE syllabus.'});

/* solids & salts */
ch('nacls',{n:'Sodium chloride',f:'NaCl',st:'s',cat:'solid',col:'#f4f4f2',M:58.5,sol:1,ab:{pos:1,neg:1},haz:['L'],look:'white crystals',
  note:'Ionic compound with a giant lattice: high melting point; conducts only when molten or dissolved.'});
ch('cuso4p',{n:'Copper(II) sulfate crystals',f:'CuSO₄·5H₂O',st:'s',cat:'solid',col:'#2f7fd0',acol:'#3d8fd6',tm:5,M:249.7,sol:1,ab:{neg:2,sys:{Cu:1}},haz:['H','E'],look:'blue crystals',
  note:'Hydrated: contains water of crystallisation. Heating gives white anhydrous copper(II) sulfate; adding water reverses it (reversible reaction).'});
ch('cuso4a',{n:'Anhydrous copper(II) sulfate',f:'CuSO₄',st:'s',cat:'solid',col:'#f1f0ea',acol:'#3d8fd6',tm:5,M:159.6,sol:1,ab:{neg:2,sys:{Cu:1}},haz:['H','E'],look:'white powder',
  note:'Test for water: turns from white to blue.'});
ch('caco3',{n:'Calcium carbonate (marble chips)',f:'CaCO₃',st:'s',cat:'solid',col:'#ecebe6',M:100,haz:['L'],look:'white chips',
  note:'Reacts with acid to give CO₂. Rates experiments: powder reacts faster than chips (bigger surface area). Thermal decomposition: CaCO₃ → CaO + CO₂.'});
ch('cuco3',{n:'Copper(II) carbonate',f:'CuCO₃',st:'s',cat:'solid',col:'#3a9c7a',M:123.6,haz:['H'],look:'green powder',
  note:'Thermal decomposition: green → black. CuCO₃ → CuO + CO₂.'});
ch('znco3',{n:'Zinc carbonate',f:'ZnCO₃',st:'s',cat:'solid',col:'#f0efea',M:125.4,haz:['E'],look:'white powder',
  note:'Insoluble carbonate. Reacts with acids to make zinc salts and CO₂.'});
ch('na2co3s',{n:'Sodium carbonate',f:'Na₂CO₃',st:'s',cat:'solid',col:'#f4f4f2',M:106,sol:1,ab:{pos:2,sys:{co3:1}},haz:['I'],look:'white powder',
  note:'Soluble carbonate. Group I carbonates do not decompose with Bunsen heat.'});
ch('nahco3',{n:'Sodium hydrogencarbonate',f:'NaHCO₃',st:'s',cat:'solid',col:'#f4f4f2',M:84,sol:1,ab:{pos:1,sys:{co3:1}},haz:['L'],look:'white powder',
  note:'Baking soda. Weakly alkaline in solution.'});
ch('naohs',{n:'Sodium hydroxide pellets',f:'NaOH',st:'s',cat:'solid',col:'#f4f4f2',M:40,sol:1,ab:{pos:1},haz:['C'],look:'white pellets',
  note:'Dissolving it is strongly exothermic.'});
ch('nh4cls',{n:'Ammonium chloride',f:'NH₄Cl',st:'s',cat:'solid',col:'#f4f4f2',M:53.5,sol:1,ab:{neg:1,sys:{nh:1}},haz:['H'],look:'white crystals',
  note:'On heating it splits into NH₃ and HCl, which recombine on cooling: a reversible reaction. Dissolving it is endothermic.'});
ch('kmno4s',{n:'Potassium manganate(VII)',f:'KMnO₄',st:'s',cat:'solid',col:'#4b1452',acol:'#7a1f8f',tm:4000,M:158,sol:1,ab:{pos:1,neg:1},haz:['O','H','E'],look:'purple-black crystals',
  note:'Drop one crystal into water to watch diffusion: the purple colour slowly spreads.'});
ch('cuo',{n:'Copper(II) oxide',f:'CuO',st:'s',cat:'solid',col:'#1f1f1f',M:79.5,haz:['H','E'],look:'black powder',
  note:'Basic oxide: reacts with warm dilute acid to make a blue copper(II) salt solution. Reduced to copper by hydrogen or carbon.'});
ch('mgo',{n:'Magnesium oxide',f:'MgO',st:'s',cat:'solid',col:'#f4f4f2',M:40.3,haz:['L'],look:'white powder',
  note:'Basic oxide formed when magnesium burns.'});
ch('cao',{n:'Calcium oxide (quicklime)',f:'CaO',st:'s',cat:'solid',col:'#f2f1ec',M:56,sol:1,ab:{pos:2},haz:['C'],look:'white lumps',
  note:'Reacts with water (very exothermic) to make calcium hydroxide. Used to neutralise acidic soil and in the blast furnace.'});
ch('zno',{n:'Zinc oxide',f:'ZnO',st:'s',cat:'solid',col:'#f4f4f2',M:81.4,haz:['E'],look:'white powder',
  note:'Amphoteric oxide: reacts with both acids and alkalis.'});
ch('al2o3',{n:'Aluminium oxide',f:'Al₂O₃',st:'s',cat:'solid',col:'#f2f2ef',M:102,haz:['L'],look:'white powder',
  note:'Amphoteric. Aluminium is extracted from it by electrolysis, dissolved in molten cryolite.'});
ch('fe2o3',{n:'Iron(III) oxide',f:'Fe₂O₃',st:'s',cat:'solid',col:'#8b2e16',M:159.7,haz:['L'],look:'red-brown powder',
  note:'Haematite. Reduced to iron by carbon monoxide in the blast furnace. Rust is hydrated iron(III) oxide.'});
ch('mno2',{n:'Manganese(IV) oxide',f:'MnO₂',st:'s',cat:'solid',col:'#262626',M:86.9,haz:['H'],look:'black powder',
  note:'Catalyst for decomposing hydrogen peroxide. Its mass is the same at the end.'});
ch('pbbr2',{n:'Lead(II) bromide',f:'PbBr₂',st:'s',cat:'solid',col:'#f2f2ef',M:367,haz:['T','E'],look:'white powder',
  note:'Electrolysis when molten: lead at the cathode, red-brown bromine vapour at the anode. Solid does not conduct.'});
ch('sulfur',{n:'Sulfur',f:'S',st:'s',cat:'solid',col:'#f2d43c',M:32,haz:['L'],look:'yellow powder',
  note:'Non-metal. Burns with a blue flame to make sulfur dioxide.'});
ch('carbon',{n:'Carbon (charcoal powder)',f:'C',st:'s',cat:'solid',col:'#202020',M:12,haz:['L'],look:'black powder',
  note:'Reduces oxides of metals below carbon in the reactivity series, e.g. 2CuO + C → 2Cu + CO₂.'});
ch('iodine',{n:'Iodine',f:'I₂',st:'s',cat:'solid',col:'#3b2a4a',M:253.8,haz:['H','E'],look:'grey-black crystals',
  note:'Sublimes on gentle heating to a purple vapour.'});
ch('glucose',{n:'Glucose',f:'C₆H₁₂O₆',st:'s',cat:'solid',col:'#f6f6f3',M:180,sol:1,haz:['L'],look:'white powder',
  note:'Fermentation by yeast at about 30 °C makes ethanol and CO₂.'});

/* metals */
const metal=(id,n,f,col,haz,note,look)=>ch(id,{n,f,st:'s',cat:'metal',col,M:1,haz,note,look});
metal('mg','Magnesium ribbon','Mg','#b9bec3',['F'],'Reacts with dilute acids to give hydrogen (fizzing). Burns with a bright white flame to form MgO.','shiny grey ribbon');
metal('zn','Zinc granules','Zn','#9da4aa',['E'],'Reacts with dilute acids to give hydrogen. More reactive than iron, so it protects steel (galvanising, sacrificial protection).','grey granules');
metal('fe','Iron filings','Fe','#5f6368',['L'],'Rusts when both water and oxygen are present. Displaces copper from copper(II) sulfate.','dark grey filings');
metal('cu','Copper turnings','Cu','#c46a3a',['L'],'Below hydrogen in the reactivity series: no reaction with dilute HCl or H₂SO₄.','orange-brown turnings');
metal('al','Aluminium foil','Al','#d3d7db',['L'],'Reactive, but a thin protective oxide layer makes it seem unreactive.','silvery foil');
metal('na','Sodium','Na','#c9ced2',['F','C'],'Stored under oil. In water it floats, fizzes, melts into a ball and moves around, forming NaOH and H₂.','soft silvery metal (under oil)');
metal('k','Potassium','K','#c4c9cd',['F','C'],'Stored under oil. Reacts violently with water; the hydrogen burns with a lilac flame.','soft silvery metal (under oil)');
metal('li','Lithium','Li','#cfd3d6',['F','C'],'Stored under oil. Fizzes steadily in water. Group I gets more reactive going down: Li < Na < K.','soft silvery metal (under oil)');
metal('ca','Calcium granules','Ca','#d9dcdf',['F'],'Reacts steadily with cold water, giving calcium hydroxide and hydrogen.','grey granules');

/* gases (amount in mol: 0.001 mol = 24 cm³ at r.t.p.) */
ch('h2',{n:'Hydrogen',f:'H₂',st:'g',cat:'gas',col:'#d64545',haz:['F'],look:'colourless gas',note:'Test: a lighted splint gives a squeaky pop. Less dense than air.'});
ch('o2',{n:'Oxygen',f:'O₂',st:'g',cat:'gas',col:'#f2f2f2',haz:['O'],look:'colourless gas',note:'Test: relights a glowing splint. About 21% of air.'});
ch('co2',{n:'Carbon dioxide',f:'CO₂',st:'g',cat:'gas',col:'#6b7177',ab:{sys:{co3:1}},haz:['L'],look:'colourless gas',note:'Test: turns limewater milky. Weakly acidic in water. Denser than air.'});
ch('cl2',{n:'Chlorine',f:'Cl₂',st:'g',cat:'gas',col:'#d8e27a',ab:{neg:1},haz:['T'],look:'pale yellow-green gas',note:'Test: bleaches damp litmus paper. Toxic, so use a fume cupboard.'});
ch('nh3',{n:'Ammonia',f:'NH₃',st:'g',cat:'gas',col:'#5b84d8',ab:{sys:{nh:1}},haz:['T','C'],look:'colourless gas, sharp smell',note:'Test: turns damp red litmus paper blue. The only common alkaline gas. Very soluble in water; less dense than air.'});
ch('so2',{n:'Sulfur dioxide',f:'SO₂',st:'g',cat:'gas',col:'#e6b94f',ab:{sys:{so2:1}},haz:['T'],look:'colourless gas, choking smell',note:'Test: turns acidified potassium manganate(VII) from purple to colourless. Causes acid rain.'});
ch('ch4',{n:'Methane',f:'CH₄',st:'g',cat:'gas',col:'#3b7fc0',haz:['F'],look:'colourless gas',note:'Natural gas: the fuel for the Bunsen burner. An alkane, so no reaction with bromine water.'});
ch('c2h4',{n:'Ethene',f:'C₂H₄',st:'g',cat:'gas',col:'#7a6cf0',haz:['F'],look:'colourless gas',note:'Alkene: decolourises bromine water. Monomer for poly(ethene). Made by cracking.'});

/* organic */
ch('ethanol',{n:'Ethanol',f:'C₂H₅OH',st:'l',cat:'org',col:'#dcebf6',dens:0.79,haz:['F'],look:'colourless liquid',
  note:'Fuel (spirit burner). Made by fermentation of glucose or by hydration of ethene with steam. Mixes completely with water.'});
ch('hexane',{n:'Hexane',f:'C₆H₁₄',st:'l',cat:'org',col:'#eef3f7',imm:1,dens:0.66,haz:['F','H','E'],look:'colourless liquid',
  note:'Alkane: saturated, so bromine water stays orange. Does not mix with water and floats on it.'});
ch('hexene',{n:'Hex-1-ene',f:'C₆H₁₂',st:'l',cat:'org',col:'#eef3f7',imm:1,dens:0.67,haz:['F'],look:'colourless liquid',
  note:'Alkene: unsaturated, so it decolourises bromine water.'});
ch('paraffin',{n:'Liquid paraffin',f:'CₙH₂ₙ₊₂',st:'l',cat:'org',col:'#f3efd9',imm:1,dens:0.85,haz:['L'],look:'colourless oily liquid',
  note:'A mixture of long-chain alkanes. Cracking it over a hot catalyst gives shorter alkanes and alkenes.'});
ch('vegoil',{n:'Vegetable oil',f:'oil',st:'l',cat:'org',col:'#e8cf6a',imm:1,dens:0.92,haz:['L'],look:'yellow oily liquid',
  note:'Immiscible with water: it forms a separate layer on top. Separate the two layers with a separating funnel.'});
ch('ethylethanoate',{n:'Ethyl ethanoate',f:'CH₃COOC₂H₅',st:'l',cat:'org',col:'#eef3f7',imm:1,dens:0.9,haz:['F','I'],look:'colourless liquid, fruity smell',
  note:'An ester. Made from ethanoic acid and ethanol with a concentrated sulfuric acid catalyst.'});
ch('ink',{n:'Black ink',f:'ink',st:'aq',cat:'org',col:'#1d1f24',tv:60,haz:['L'],look:'black liquid',
  note:'A mixture of coloured dyes. Separate them by paper chromatography.'});

/* ---------- acid–base equilibrium (pH by charge balance) ---------- */
const SYS={eth:{z:0,pk:[4.76]},nh:{z:1,pk:[9.25]},co3:{z:0,pk:[6.35,10.33]},so2:{z:0,pk:[1.8,7.2]},
  Fe3:{z:3,pk:[2.2]},Al:{z:3,pk:[5.0]},Cr:{z:3,pk:[4.0]},Cu:{z:2,pk:[7.5]},Zn:{z:2,pk:[9.0]},Fe2:{z:2,pk:[9.5]}};
function sysCharge(S,T,h){let acc=1,sum=1,nb=0;for(let i=0;i<S.pk.length;i++){acc*=10**-S.pk[i]/h;sum+=acc;nb+=(i+1)*acc;}return T*(S.z-nb/sum);}
function solvePH(sp){if(!(sp.V>0))return null;
  const g=pH=>{const h=10**-pH;let c=h-1e-14/h+(sp.pos-sp.neg)/sp.V;for(const k in sp.sys)c+=sysCharge(SYS[k],sp.sys[k]/sp.V,h);return c;};
  let lo=-1.5,hi=15.5;for(let i=0;i<64;i++){const m=(lo+hi)/2;if(g(m)>0)lo=m;else hi=m;}return Math.max(0,Math.min(14,(lo+hi)/2));}

/* ---------- indicator colours ---------- */
const UI_SCALE=['#d7191c','#e3301f','#ef5a28','#f68a2e','#fbb03b','#f4d443','#c4dc45','#5fb848','#2fa48a','#2b8cbe','#2e5ba8','#47409c','#5b2f8f','#6b2584','#741b7a'];
const hex2rgb=hx=>{const n=parseInt(hx.slice(1),16);return [n>>16&255,n>>8&255,n&255];};
function indColour(ind,pH){
  if(ind==='ui'){const i=Math.max(0,Math.min(13.999,pH)),a=Math.floor(i),t=i-a,c1=hex2rgb(UI_SCALE[a]),c2=hex2rgb(UI_SCALE[a+1]);
    return '#'+c1.map((v,k)=>Math.round(v+(c2[k]-v)*t).toString(16).padStart(2,'0')).join('');}
  if(ind==='litmus')return pH<5?'#d64545':pH>8?'#3b5fc0':'#8a4f9e';
  if(ind==='mo')return pH<3.1?'#d9342b':pH>4.4?'#f2c12e':'#f08a24';
  if(ind==='phph')return pH<8.2?null:pH<10?'#f3a0c4':'#e0458f';
  if(ind==='thymol')return pH<9.3?null:pH<10.5?'#8fb8e8':'#2f5fd0';
  return null;}
const indName=(ind,pH)=>{const c=pH==null?null:indColour(ind,pH);if(ind==='phph'||ind==='thymol')return c?(ind==='phph'?'pink':'blue'):'colourless';
  if(ind==='litmus')return pH<5?'red':pH>8?'blue':'purple';if(ind==='mo')return pH<3.1?'red':pH>4.4?'yellow':'orange';
  return pH<2.5?'red':pH<4.5?'orange':pH<6.5?'yellow':pH<7.5?'green':pH<11?'blue':'purple';};

/* =====================================================================
   CONTENTS — what is inside a container.  it.contents = [{c,a}]
   a is cm³ for liquids/solutions, g for solids, mol for gases.
   ===================================================================== */
const unitOf=C=>C.st==='s'?'g':C.st==='g'?'mol':'cm3';
function fmtAmt(C,a){if(C.st==='s')return (a<0.1?a.toFixed(3):a.toFixed(2))+' g';if(C.st==='g')return Math.round(a*24000)+' cm³ of gas';
  return (a<1?a.toFixed(2):a<100?a.toFixed(1):Math.round(a))+' cm³';}
const chemName=C=>C.n+(C.st==='aq'&&C.conc?` (${C.conc.toFixed(C.conc<0.1?2:1)} mol/dm³)`:'');
const stName={aq:'aqueous solution',l:'liquid',s:'solid',g:'gas'};
/* volume (cm³) that fills each container's liquid region to the top */
const FULL={
  beaker:(it,w,h)=>{const v=variantOf(it);return v.cap*(h-5)/((h-3.8)-h*0.2);},
  conical:(it,w,h)=>{const v=variantOf(it),nh=h*0.3,yTop=nh+(h-nh)*0.28;return v.cap*(h-2.4-nh)/((h-6)-yTop);},
  cylinder:(it,w,h)=>{const v=variantOf(it);return v.cap*((h-11)-4)/((h-11)-18);},
  burette:(it,w,h)=>50*(h-48)/(h-74),
  volflask:it=>variantOf(it).cap,testtube:()=>22,boilingtube:()=>55,rbf:()=>290,basin:()=>110,crucible:()=>22,gasjar:()=>420,
  polycup:()=>170,coppercan:()=>200,mortar:()=>60,sepfunnel:()=>250,spirit:()=>100};
const fullOf=it=>{const f=FULL[it.type],{w,h}=dims(it);return f?f(it,w,h):100;};
const isContainer=it=>!!(REG[it.type].liquid&&FULL[it.type]&&!it.state.flip&&it.type!=='spirit');
const aCache=new WeakMap();
function analyse(it){const key=JSON.stringify(it.contents||[]),hit=aCache.get(it);if(hit&&hit.key===key)return hit.res;
  const cs=it.contents||[];let Vaq=0,Vorg=0,mass=0;const org=[],solids=[],sp={pos:0,neg:0,sys:{}},cols=[],inds=[],dissolved=[];
  const addAb=(ab,k)=>{if(!ab)return;sp.pos+=(ab.pos||0)*k;sp.neg+=(ab.neg||0)*k;for(const s in ab.sys||{})sp.sys[s]=(sp.sys[s]||0)+ab.sys[s]*k;};
  cs.forEach(e=>{const C=CHEM[e.c];if(!C)return;if(C.st==='aq'||C.st==='l'){if(C.imm){Vorg+=e.a;org.push(e);}else Vaq+=e.a;mass+=e.a*(C.dens||1);}else if(C.st==='s')mass+=e.a;});
  cs.forEach(e=>{const C=CHEM[e.c];if(!C)return;
    if((C.st==='aq'||C.st==='l')&&!C.imm){addAb(C.ab,e.a/1000);if(C.ind)inds.push([C.ind,e.a]);else if(C.tv)cols.push([C.col,C.tv*e.a/Vaq]);}
    else if(C.st==='s'){if(C.sol&&Vaq>0){const mol=e.a/C.M;addAb(C.ab,mol);dissolved.push(e);if(C.acol)cols.push([C.acol,C.tm*mol/(Vaq/1000)]);}else solids.push(e);}
    else if(C.st==='g'&&Vaq>0)addAb(C.ab,e.a);});
  const pH=Vaq>0?solvePH({V:Vaq/1000,...sp}):null;
  if(pH!=null)inds.forEach(([ind,v])=>{const c=indColour(ind,pH);if(c)cols.push([c,700*v/Vaq]);});
  const mix=(list,base)=>{let W=1,r=base[0],g=base[1],b=base[2];list.forEach(([c,w])=>{const q=hex2rgb(c);r+=q[0]*w;g+=q[1]*w;b+=q[2]*w;W+=w;});
    const s=W-1;return `rgba(${Math.round(r/W)},${Math.round(g/W)},${Math.round(b/W)},${(0.34+0.56*s/(1+s)).toFixed(2)})`;};
  const res={Vaq,Vorg,V:Vaq+Vorg,mass,pH,solids,dissolved,inds,aqCol:mix(cols,[205,226,242]),
    orgCol:org.length?mix(org.map(e=>[CHEM[e.c].col,4*e.a/Vorg]),[236,240,232]):null};
  aCache.set(it,{key,res});return res;}
const contentsMass=it=>it.contents?.length?analyse(it).mass:0;
function hash(s){let h=2166136261;for(const ch of s){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function contentsSVG(it,w,h){const d=REG[it.type];if(!d.liquid||!it.contents?.length)return '';
  const A=analyse(it),L=d.liquid(w,h),H=L.bottom-L.top,full=fullOf(it);if(A.V<=0&&!A.solids.length)return '';
  const yA=L.bottom-H*Math.min(1,A.Vaq/full),yO=L.bottom-H*Math.min(1,A.V/full);
  let s=`<clipPath id="cl-${it.id}"><path d="${L.d}"/></clipPath><g clip-path="url(#cl-${it.id})">`;
  if(A.Vaq>0)s+=`<rect x="-5" y="${yA.toFixed(2)}" width="${w+10}" height="${h}" style="fill:${A.aqCol}"/>`;
  if(A.Vorg>0)s+=`<rect x="-5" y="${yO.toFixed(2)}" width="${w+10}" height="${(yA-yO).toFixed(2)}" style="fill:${A.orgCol}"/><line x1="-5" y1="${yA.toFixed(2)}" x2="${w+5}" y2="${yA.toFixed(2)}" style="stroke:var(--water-edge);stroke-width:.6"/>`;
  if(A.solids.length){let rnd=hash(it.id),k=0;const R=()=>((rnd=Math.imul(rnd^rnd>>>15,2246822507)>>>0)/4294967296);
    const x0=w*0.2,x1=w*0.8,per=Math.max(3,Math.floor((x1-x0)/3.1));
    A.solids.forEach(e=>{const C=CHEM[e.c],n=Math.min(70,Math.max(2,Math.ceil(e.a*(C.cat==='metal'?6:10))));
      for(let i=0;i<n;i++,k++){const x=x0+(k%per+R()*0.6)*3.1,y=L.bottom-2-Math.floor(k/per)*2.6-R()*0.8;
        s+=`<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${C.cat==='metal'?1.9:1.6}" style="fill:${C.col};stroke:rgba(0,0,0,.25);stroke-width:.3"/>`;}});}
  return s+'</g>';}
function liquidTopWorld(c){const A=analyse(c),{w,h}=dims(c),L=REG[c.type].liquid(w,h);return c.y-h+L.bottom-(L.bottom-L.top)*Math.min(1,A.V/fullOf(c));}
function containerAt(p,exclude){let best=null;renderOrder().forEach(c=>{if(c===exclude||!isContainer(c))return;const {w,h}=dims(c);
  if(Math.abs(p.x-c.x)<=w/2+6&&p.y>=c.y-h-14&&p.y<=c.y+4)best=c;});return best;}
function containerBelow(it){const {h}=dims(it);let best=null,bd=1e9;items.forEach(c=>{if(c===it||!isContainer(c)||descendants(it.id).has(c.id))return;const d=dims(c);
  if(Math.abs(c.x-it.x)<d.w/2-2){const top=c.y-d.h,dy=top-it.y;if(dy>-30&&dy<260&&dy<bd){bd=dy;best=c;}}});return best;}
function addTo(c,chemId,amt){const C=CHEM[chemId];if(!C||!isContainer(c))return 0;
  if(C.st==='aq'||C.st==='l'){const room=fullOf(c)-analyse(c).V;amt=Math.max(0,Math.min(amt,room));if(amt<=0)return 0;}
  c.contents=c.contents||[];const e=c.contents.find(x=>x.c===chemId);if(e)e.a+=amt;else c.contents.push({c:chemId,a:amt});return amt;}
/* move liquid from one container to another; undissolved solids stay behind (decanting) */
function transfer(from,to,vol,bottomFirst){const A=analyse(from);if(A.V<=0)return 0;
  let room=to?fullOf(to)-analyse(to).V:Infinity;vol=Math.min(vol,A.V,room);if(vol<=0)return 0;
  let va,vo;if(bottomFirst&&A.Vorg>0&&A.Vaq>0){va=Math.min(vol,A.Vaq);vo=vol-va;}else{va=vol*A.Vaq/A.V;vo=vol-va;}
  const fa=A.Vaq>0?va/A.Vaq:0,fo=A.Vorg>0?vo/A.Vorg:0,diss=new Set(A.dissolved.map(e=>e.c));
  from.contents.forEach(e=>{const C=CHEM[e.c];let f=0;
    if(C.st==='aq'||C.st==='l')f=C.imm?fo:fa;else if(C.st==='g')f=fa;else if(diss.has(e.c))f=fa;
    if(f>0){const m=e.a*f;e.a-=m;if(to){to.contents=to.contents||[];const t=to.contents.find(x=>x.c===e.c);if(t)t.a+=m;else to.contents.push({c:e.c,a:m});}}});
  from.contents=from.contents.filter(e=>e.a>1e-7);return vol;}
function buretteReading(it){const {h}=dims(it),A=analyse(it),full=fullOf(it);if(A.V<=0)return null;
  const yTop=(h-46)-(h-48)*Math.min(1,A.V/full);return Math.max(0,(yTop-14)/((h-74)/50));}
let toastT=0;function toast(msg){const t=$('#toast');t.textContent=msg;t.hidden=false;t.classList.remove('show');void t.offsetWidth;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>{t.hidden=true;},2600);}
function pourChem(c,chemId,amt){const C=CHEM[chemId],got=addTo(c,chemId,amt);
  if(got<=0){toast(C.st==='aq'||C.st==='l'?`${nameOf(c)} is full.`:`Can't add to ${nameOf(c)}.`);return 0;}
  toast(`Added ${fmtAmt(C,got)} of ${C.n} to ${nameOf(c)}`+(got<amt-1e-9?' (it is now full)':''));return got;}

/* ---------- reagent bottles ---------- */
const BOTTLE={bottle:{w:46,h:82},drop:{w:30,h:66},jar:{w:52,h:60},gas:{w:38,h:128}};
const bottleKind=C=>C.ind?'drop':C.st==='g'?'gas':C.st==='s'?'jar':'bottle';
const POUR={bottle:[[0.05,'1 drop'],[1,'1 cm³'],[5,'5 cm³'],[10,'10 cm³'],[25,'25 cm³'],[50,'50 cm³']],drop:[[0.05,'1 drop'],[0.1,'2 drops'],[0.25,'5 drops']],
  jar:[[0.1,'0.1 g'],[0.5,'0.5 g'],[1,'1 g'],[2,'2 g'],[5,'5 g']],gas:[[0.001,'24 cm³'],[0.005,'120 cm³'],[0.01,'240 cm³']]};
const defPour=C=>({bottle:10,drop:0.1,jar:1,gas:0.001})[bottleKind(C)];
function fTxt(f,x,y,maxW,base){const n=[...f].length,fs=Math.min(base,maxW/(n*0.62));return `<text x="${x}" y="${y}" text-anchor="middle" style="font:700 ${fs.toFixed(2)}px var(--f-ui);fill:var(--ink)">${esc(f)}</text>`;}
function bottleSVG(C,w,h,id){const k=bottleKind(C),cx=w/2,uid='b'+(id||C.id);let s='';
  const liq=C.ind?C.col:C.col;
  if(k==='bottle'){const body=`M8,${h} L${w-8},${h} Q${w-2},${h} ${w-2},${h-6} L${w-2},30 Q${w-2},22 ${cx+8},20 L${cx+6},14 L${cx-6},14 L${cx-8},20 Q2,22 2,30 L2,${h-6} Q2,${h} 8,${h} Z`;
    s=`<clipPath id="${uid}"><path d="${body}"/></clipPath><rect x="0" y="${h*0.42}" width="${w}" height="${h}" clip-path="url(#${uid})" style="fill:${liq};opacity:.75"/>
    <path class="g-glass" d="${body}"/><rect class="g-glass" x="${cx-7}" y="4" width="14" height="12" rx="3"/><rect class="g-glass" x="${cx-4}" y="0" width="8" height="6" rx="2"/>
    <rect class="g-paper" x="6" y="38" width="${w-12}" height="26" rx="2"/>${fTxt(C.f,cx,52,w-16,10)}
    <text x="${cx}" y="60.5" text-anchor="middle" class="g-tiny">${C.conc?C.conc+' M':C.st==='l'?'liquid':''}</text>`;}
  else if(k==='drop'){s=`<rect class="g-rubber" x="${cx-4.5}" y="0" width="9" height="14" rx="4"/><rect class="g-glass" x="${cx-6}" y="12" width="12" height="8" rx="1.5"/>
    <rect x="3" y="20" width="${w-6}" height="${h-20}" rx="5" style="fill:#8a5a2b;opacity:.85;stroke:var(--dark-edge);stroke-width:1"/>
    <rect class="g-paper" x="5" y="32" width="${w-10}" height="22" rx="2"/>${fTxt(C.short||C.f,cx,45,w-12,9)}
    <rect x="9" y="${h-9}" width="${w-18}" height="4" rx="2" style="fill:${C.ind?indColour(C.ind,7)||'#f2f2f2':C.col}"/>`;}
  else if(k==='jar'){const band=h-14-(h-24)*0.42;
    s=`<rect class="g-plastic" x="2" y="12" width="${w-4}" height="${h-12}" rx="6"/><rect x="4" y="${band}" width="${w-8}" height="${h-band-2}" rx="5" style="fill:${C.col}"/>
    <rect x="0" y="3" width="${w}" height="11" rx="2.5" style="fill:${C.cat==='metal'?'var(--dark-metal)':'var(--cap)'}"/>
    <rect class="g-paper" x="6" y="18" width="${w-12}" height="18" rx="2"/>${fTxt(C.f,cx,31,w-14,10)}`;}
  else{s=`<rect class="g-darkm" x="${cx-10}" y="0" width="20" height="5" rx="2"/><rect class="g-darkm" x="${cx-5}" y="4" width="10" height="16" rx="2"/>
    <clipPath id="${uid}"><rect x="3" y="18" width="${w-6}" height="${h-18}" rx="${(w-6)/2}"/></clipPath>
    <rect x="3" y="18" width="${w-6}" height="${h-18}" rx="${(w-6)/2}" style="fill:var(--metal);stroke:var(--metal-edge);stroke-width:1"/>
    <rect x="0" y="18" width="${w}" height="22" clip-path="url(#${uid})" style="fill:${C.col}"/>
    <rect class="g-paper" x="6" y="58" width="${w-12}" height="22" rx="2"/>${fTxt(C.f,cx,73,w-14,10)}`;}
  return s;}
register({id:'reagent',name:'Chemical',cat:'_chem',tags:[],z:6,defaults:{chem:'water',pour:10},
  dimsFn:it=>BOTTLE[bottleKind(CHEM[it.state.chem]||CHEM.water)],nameFn:it=>(CHEM[it.state.chem]||CHEM.water).n,
  massFn:it=>({bottle:250,drop:60,jar:180,gas:3000})[bottleKind(CHEM[it.state.chem]||CHEM.water)],
  draw(w,h,it){return bottleSVG(CHEM[it.state.chem]||CHEM.water,w,h,it.id);},use:'',tip:''});

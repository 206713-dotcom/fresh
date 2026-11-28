'use strict';
/* Chem Lab Bench: AS Level chemicals, apparatus and reaction engine */
try{

/* =====================================================================
   AS LEVEL CHEMICALS (Cambridge 9701 AS practical work) and the hidden
   products that reactions make. Products have cat '_p' so they never
   appear on the shelf.
   ===================================================================== */
CHEM_CATS.push(['as','AS Level inorganic'],['orgreag','Organic test reagents']);
/* acids & alkalis */
ch('h2so4conc',{n:'Concentrated sulfuric acid',f:'H₂SO₄ (conc)',st:'aq',conc:18,cat:'acid',col:'#e9eef2',haz:['C'],ab:{neg:2},look:'colourless, oily liquid',dens:1.84,
  note:'Concentrated (98%) acid: a strong oxidising agent and a dehydrating agent. With solid halides: NaCl gives misty HCl fumes; NaBr gives HBr, orange-brown Br₂ and SO₂; NaI gives purple I₂ vapour, H₂S and sulfur. Catalyst for esterification. Diluting it releases a lot of heat: always add acid to water.'});
ch('nh3conc',{n:'Concentrated aqueous ammonia',f:'NH₃ (conc)',st:'aq',conc:15,cat:'acid',col:'#dcebf6',haz:['C','I'],ab:{sys:{nh:1}},look:'colourless, very sharp smell',dens:0.9,
  note:'"0.880 ammonia". Silver halide solubility: AgCl dissolves in dilute NH₃, AgBr only in concentrated NH₃, AgI in neither. Use in a fume cupboard.'});
ch('kohethanol',{n:'Ethanolic potassium hydroxide',f:'KOH in ethanol',st:'aq',conc:1.0,cat:'orgreag',col:'#eef3f7',haz:['C','F'],ab:{pos:1},look:'colourless solution',
  note:'Heated with a halogenoalkane, KOH dissolved in ethanol causes elimination to an alkene. KOH in water causes substitution to an alcohol instead.'});
/* AS inorganic solutions */
ch('bacl2',{n:'Barium chloride solution',f:'BaCl₂',st:'aq',conc:0.1,cat:'as',col:'#dcebf6',haz:['T'],ab:{pos:0.2,neg:0.2},look:'colourless solution',
  note:'Sulfate test (acidify first with dilute HCl): white precipitate of BaSO₄. Without acid, carbonate also gives a white precipitate (BaCO₃), which then fizzes in acid.'});
ch('srcl2',{n:'Strontium chloride solution',f:'SrCl₂',st:'aq',conc:0.5,cat:'as',col:'#dcebf6',haz:['I'],ab:{pos:1,neg:1},look:'colourless solution',
  note:'Group 2. Sr(OH)₂ is fairly soluble, so NaOH gives only a slight precipitate; SrSO₄ is sparingly soluble. Crimson flame.'});
ch('mgcl2',{n:'Magnesium chloride solution',f:'MgCl₂',st:'aq',conc:0.5,cat:'as',col:'#dcebf6',haz:['L'],ab:{pos:1,neg:1},look:'colourless solution',
  note:'Group 2 trend: Mg(OH)₂ is the least soluble hydroxide (heavy white precipitate with NaOH) but MgSO₄ is the most soluble sulfate. Down the group hydroxide solubility increases and sulfate solubility decreases.'});
ch('naf',{n:'Sodium fluoride solution',f:'NaF',st:'aq',conc:0.1,cat:'as',col:'#dcebf6',haz:['T'],ab:{pos:0.1,neg:0.1},look:'colourless solution',
  note:'F⁻: no precipitate with silver nitrate, because AgF is soluble.'});
ch('nabraq',{n:'Sodium bromide solution',f:'NaBr',st:'aq',conc:0.5,cat:'as',col:'#dcebf6',haz:['L'],ab:{pos:0.5,neg:0.5},look:'colourless solution',
  note:'Br⁻. Cream AgBr precipitate with acidified silver nitrate, soluble in concentrated ammonia only.'});
ch('dichrom',{n:'Acidified potassium dichromate(VI)',f:'K₂Cr₂O₇/H⁺',st:'aq',conc:0.02,cat:'orgreag',col:'#f08a24',tv:12,haz:['T','O','E'],ab:{pos:0.04,neg:2.04},look:'orange solution',
  note:'Oxidising agent. Warm with an alcohol: orange → green (Cr³⁺) for primary and secondary alcohols and aldehydes; tertiary alcohols and ketones leave it orange. Primary alcohol → aldehyde (distil it off) → carboxylic acid (heat under reflux).'});
ch('starch',{n:'Starch solution',short:'Starch',f:'starch',st:'aq',cat:'ind',col:'#eef0f2',haz:['L'],look:'colourless, slightly cloudy',
  note:'Turns blue-black with iodine. Iodine–thiosulfate titration: add it near the end point (pale yellow); the end point is blue-black → colourless.'});
ch('kscn',{n:'Potassium thiocyanate solution',f:'KSCN',st:'aq',conc:0.1,cat:'as',col:'#dcebf6',haz:['H'],ab:{pos:0.1,neg:0.1},look:'colourless solution',
  note:'Test for Fe³⁺: a blood-red colour ([Fe(SCN)]²⁺). Fe²⁺ gives no red colour.'});
ch('kio3',{n:'Potassium iodate(V) solution',f:'KIO₃',st:'aq',conc:0.02,cat:'as',col:'#dcebf6',haz:['O','I'],ab:{pos:0.02,neg:0.02},look:'colourless solution',
  note:'With excess KI and acid it releases iodine: IO₃⁻ + 5I⁻ + 6H⁺ → 3I₂ + 3H₂O. Used to standardise sodium thiosulfate.'});
ch('thio01',{n:'Sodium thiosulfate (standard)',f:'Na₂S₂O₃',st:'aq',conc:0.1,cat:'as',col:'#dcebf6',haz:['L'],ab:{pos:0.2,neg:0.2},look:'colourless solution',
  note:'Titrant for iodine: I₂ + 2S₂O₃²⁻ → 2I⁻ + S₄O₆²⁻. Brown → pale yellow → (add starch) blue-black → colourless at the end point.'});
ch('kmno4t',{n:'Potassium manganate(VII) (0.02 M)',f:'KMnO₄',st:'aq',conc:0.02,cat:'as',col:'#7a1f8f',tv:80,haz:['O','H'],ab:{pos:0.02,neg:0.02},look:'purple solution',
  note:'Redox titrant, self-indicating: MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O. The end point is the first permanent pale pink. Acidify the Fe²⁺ with dilute sulfuric acid first.'});
ch('nano2',{n:'Sodium nitrite solution',f:'NaNO₂',st:'aq',conc:0.1,cat:'_p',col:'#dcebf6',haz:['T'],ab:{pos:0.1,neg:0.1},look:'colourless solution',note:'Product of heating sodium nitrate.'});
/* organic test reagents */
ch('tollens',{n:"Tollens' reagent",f:'[Ag(NH₃)₂]⁺',st:'aq',conc:0.05,cat:'orgreag',col:'#dcebf6',haz:['C'],ab:{pos:0.05,neg:0.05},look:'colourless solution',
  note:'Warm with an aldehyde in a water bath: a silver mirror forms. Ketones give no change. Make fresh: AgNO₃ + NaOH, then ammonia until the brown precipitate just dissolves.'});
ch('fehling',{n:"Fehling's solution",f:'Cu²⁺ complex',st:'aq',conc:0.05,cat:'orgreag',col:'#2f6fd6',tv:2,haz:['C'],ab:{pos:0.2},look:'deep blue solution',
  note:'Warm with an aldehyde: blue → brick-red precipitate of copper(I) oxide. Ketones stay blue.'});
ch('benedict',{n:"Benedict's solution",f:'Cu²⁺ complex',st:'aq',conc:0.05,cat:'orgreag',col:'#3d8fd6',tv:2,haz:['I'],ab:{pos:0.1},look:'blue solution',
  note:'Reducing sugars (e.g. glucose) and aliphatic aldehydes: heat in a boiling water bath → green, yellow, orange, brick-red precipitate. Sucrose is not a reducing sugar.'});
ch('dnph',{n:'2,4-DNPH (Brady’s reagent)',f:'2,4-DNPH',st:'aq',conc:0.05,cat:'orgreag',col:'#f2b13c',tv:3,haz:['F','T'],ab:{neg:0.05},look:'orange-yellow solution',
  note:'Test for a carbonyl group (C=O in aldehydes and ketones): orange or yellow precipitate. Carboxylic acids and esters do not react.'});
ch('alkiodine',{n:'Alkaline iodine solution',f:'I₂ / NaOH',st:'aq',conc:0.05,cat:'orgreag',col:'#8a4a14',tv:10,haz:['C','H'],ab:{pos:0.3},look:'brown solution',
  note:'Tri-iodomethane (iodoform) test: warm with CH₃CO– (ethanal, methyl ketones) or CH₃CH(OH)– (ethanol, propan-2-ol): pale yellow precipitate of CHI₃ with an antiseptic smell.'});
ch('pcl5',{n:'Phosphorus(V) chloride',f:'PCl₅',st:'s',cat:'orgreag',col:'#f2f0d8',M:208.2,haz:['C','T'],look:'off-white powder',
  note:'Test for –OH (alcohols, carboxylic acids, water): steamy, misty fumes of HCl, which turn damp blue litmus red. Use in a fume cupboard.'});
ch('antibump',{n:'Anti-bumping granules',f:'granules',st:'s',cat:'orgreag',col:'#9a9488',M:60,haz:['L'],look:'grey granules',
  note:'Add before heating a liquid in a flask so it boils smoothly instead of "bumping" (violent sudden boiling).'});
/* AS solids */
const sld=(id,n,f,col,M,o,note,look)=>ch(id,{n,f,st:'s',cat:'as',col,M,haz:o.haz||['L'],...o,note,look});
sld('nabrs','Sodium bromide','NaBr','#f4f4f2',102.9,{sol:1,ab:{pos:1,neg:1}},'With concentrated H₂SO₄: steamy HBr fumes, orange-brown Br₂ and SO₂. Br⁻ is a stronger reducing agent than Cl⁻.','white crystals');
sld('nais','Sodium iodide','NaI','#f4f4f2',149.9,{sol:1,ab:{pos:1,neg:1}},'With concentrated H₂SO₄: purple iodine vapour, a black solid, H₂S (bad-egg smell) and yellow sulfur. I⁻ is the strongest reducing agent of the halides.','white crystals');
sld('mgco3','Magnesium carbonate','MgCO₃','#f2f1ec',84.3,{},'Group 2 carbonates decompose on heating to the oxide and CO₂. Thermal stability increases down the group: MgCO₃ decomposes most easily.','white powder');
sld('srco3','Strontium carbonate','SrCO₃','#f4f4f0',147.6,{},'Needs a much higher temperature to decompose than CaCO₃. Larger Sr²⁺ ion polarises the carbonate ion less.','white powder');
sld('baco3','Barium carbonate','BaCO₃','#f4f4f0',197.3,{haz:['H']},'The most thermally stable Group 2 carbonate: it does not decompose in a Bunsen flame.','white powder');
sld('mgno3s','Magnesium nitrate','Mg(NO₃)₂','#f4f4f2',148.3,{sol:1,ab:{pos:2,neg:2},haz:['O']},'Group 2 nitrates decompose on heating: 2Mg(NO₃)₂ → 2MgO + 4NO₂ + O₂ (brown gas). Group 1 nitrates (except Li) give only the nitrite and O₂.','white crystals');
sld('bano3s','Barium nitrate','Ba(NO₃)₂','#f4f4f2',261.3,{sol:1,ab:{pos:2,neg:2},haz:['O','H']},'Decomposes at a higher temperature than Mg(NO₃)₂: thermal stability increases down Group 2.','white crystals');
sld('nano3s','Sodium nitrate','NaNO₃','#f4f4f2',85,{sol:1,ab:{pos:1,neg:1},haz:['O']},'Group 1 nitrate: heating gives sodium nitrite and oxygen only (no brown NO₂).','white crystals');
sld('nh4no3','Ammonium nitrate','NH₄NO₃','#f4f4f2',80,{sol:1,ab:{neg:1,sys:{nh:1}},haz:['O']},'Dissolving it in water is strongly endothermic: the temperature falls.','white crystals');
sld('cacl2s','Calcium chloride (anhydrous)','CaCl₂','#f4f4f2',111,{sol:1,ab:{pos:2,neg:2},haz:['I']},'Dissolving it is strongly exothermic. Also used as a drying agent.','white granules');
sld('caco3p','Calcium carbonate powder','CaCO₃','#efeee9',100,{},'Same substance as marble chips, but a much larger surface area: it reacts with acid much faster.','white powder');
sld('benzoic','Benzoic acid','C₆H₅COOH','#f6f6f3',122.1,{mp:122},'Pure benzoic acid melts sharply at 122 °C. An impure sample melts lower and over a range. Purify by recrystallisation from hot water.','white crystals');
sld('benzoicimp','Impure benzoic acid','C₆H₅COOH (impure)','#efe9dd',122.1,{mp:114,mpr:8},'Impurities lower the melting point and spread it over a range of temperatures.','off-white crystals');
sld('aspirin','Aspirin','C₉H₈O₄','#f6f6f3',180.2,{mp:136},'Melting point 136 °C.','white crystals');
sld('sio2','Silicon(IV) oxide','SiO₂','#f2efe6',60.1,{},'Giant covalent, acidic oxide. Insoluble in water; reacts only with hot concentrated NaOH.','white sand');
sld('p4o10','Phosphorus(V) oxide','P₄O₁₀','#f6f6f3',284,{haz:['C']},'Acidic oxide: reacts violently with water to give phosphoric acid (pH about 2).','white powder');
sld('alcl3','Aluminium chloride (anhydrous)','AlCl₃','#f4f2e8',133.3,{haz:['C']},'Covalent chloride: reacts with water giving steamy HCl fumes and an acidic solution (pH about 3).','pale yellow-white powder');
sld('sucrose','Sucrose','C₁₂H₂₂O₁₁','#f6f6f3',342.3,{sol:1},'Not a reducing sugar: Benedict’s and Fehling’s stay blue.','white crystals');
metal('sr','Strontium','Sr','#d8d4c9',['F'],'Group 2: reacts with cold water faster than calcium.','silvery-grey pieces');
metal('ba','Barium','Ba','#d6d6cf',['F','T'],'Group 2: reacts vigorously with cold water. Reactivity increases down the group.','silvery pieces (under oil)');
/* AS organic compounds (M in g/mol, dens in g/cm³, bp in °C) */
const org=(id,n,f,o,note,look)=>ch(id,{n,f,st:'l',cat:'org',col:'#eef3f7',haz:['F'],...o,note,look:look||'colourless liquid'});
org('methanol','Methanol','CH₃OH',{M:32,dens:0.79,bp:65,haz:['F','T'],cls:'alc1',dhc:-726},'Primary alcohol. Fuel: ΔHc = −726 kJ/mol.');
org('propan1ol','Propan-1-ol','CH₃CH₂CH₂OH',{M:60.1,dens:0.80,bp:97,cls:'alc1',dhc:-2021,ox:'propanal'},'Primary alcohol: oxidised to propanal, then propanoic acid. ΔHc = −2021 kJ/mol.');
org('propan2ol','Propan-2-ol','CH₃CH(OH)CH₃',{M:60.1,dens:0.79,bp:82,cls:'alc2',me:1,ox:'propanone'},'Secondary alcohol: oxidised to the ketone propanone. Positive tri-iodomethane test.');
org('butan1ol','Butan-1-ol','CH₃(CH₂)₃OH',{M:74.1,dens:0.81,bp:118,cls:'alc1',dhc:-2676,imm:1},'Primary alcohol. ΔHc = −2676 kJ/mol. Only slightly soluble in water.');
org('mepropan2ol','2-methylpropan-2-ol','(CH₃)₃COH',{M:74.1,dens:0.78,bp:82,cls:'alc3'},'Tertiary alcohol: not oxidised by acidified dichromate, which stays orange.');
org('ethanal','Ethanal','CH₃CHO',{M:44,dens:0.78,bp:21,cls:'ald',me:1,ox:'ethanoicM',haz:['F','H']},'Aldehyde: positive Tollens’ and Fehling’s, positive 2,4-DNPH and tri-iodomethane tests. Boils at 21 °C.');
org('propanal','Propanal','CH₃CH₂CHO',{M:58.1,dens:0.81,bp:48,cls:'ald',ox:'propanoicM'},'Aldehyde: silver mirror with Tollens’, brick-red with Fehling’s, orange precipitate with 2,4-DNPH.');
org('propanone','Propanone','CH₃COCH₃',{M:58.1,dens:0.79,bp:56,cls:'ket',me:1,haz:['F','I']},'Ketone: positive 2,4-DNPH and tri-iodomethane tests, but no reaction with Tollens’, Fehling’s or dichromate.');
org('cyclohexene','Cyclohexene','C₆H₁₀',{M:82.1,dens:0.81,bp:83,cls:'alkene',imm:1},'Alkene: decolourises bromine water and acidified manganate(VII).');
org('bromobutane','1-bromobutane','CH₃(CH₂)₃Br',{M:137,dens:1.27,bp:102,cls:'rx',hal:'Br',deg:1,imm:1,haz:['F','H']},'Primary halogenoalkane. Hydrolysis with aqueous AgNO₃ in ethanol: cream AgBr precipitate, slower than the iodo compound and faster than the chloro. Denser than water.');
org('chlorobutane','1-chlorobutane','CH₃(CH₂)₃Cl',{M:92.6,dens:0.89,bp:78,cls:'rx',hal:'Cl',deg:1,imm:1},'C–Cl is the strongest carbon–halogen bond, so it hydrolyses most slowly: white AgCl precipitate appears last.');
org('iodobutane','1-iodobutane','CH₃(CH₂)₃I',{M:184,dens:1.62,bp:130,cls:'rx',hal:'I',deg:1,imm:1,haz:['H']},'C–I is the weakest bond, so it hydrolyses fastest: yellow AgI precipitate appears first.');
org('bromomeprop','2-bromo-2-methylpropane','(CH₃)₃CBr',{M:137,dens:1.22,bp:73,cls:'rx',hal:'Br',deg:3,imm:1},'Tertiary halogenoalkane: hydrolyses much faster than 1-bromobutane (SN1 mechanism via a stable carbocation).');
Object.assign(CHEM.ethanol,{M:46,bp:78,cls:'alc1',me:1,dhc:-1367,ox:'ethanal'});
Object.assign(CHEM.hexane,{M:86.2,bp:69,cls:'alkane'});Object.assign(CHEM.hexene,{M:84.2,bp:63,cls:'alkene'});
Object.assign(CHEM.paraffin,{M:240,bp:300,cls:'alkane'});Object.assign(CHEM.vegoil,{M:880,bp:300});
Object.assign(CHEM.ethylethanoate,{M:88.1,bp:77,cls:'ester'});
Object.assign(CHEM.ethanoic,{cls:'acid'});Object.assign(CHEM.water,{bp:100,M:18});Object.assign(CHEM.glucose,{cls:'sugar'});
Object.assign(CHEM.ink,{bp:100});
/* gases made by reactions */
ch('hclg',{n:'Hydrogen chloride',f:'HCl',st:'g',cat:'_p',col:'#e6e6e6',haz:['T','C'],look:'steamy, misty fumes',note:'Turns damp blue litmus red; white smoke with ammonia.'});
ch('no2',{n:'Nitrogen dioxide',f:'NO₂',st:'g',cat:'_p',col:'#9a4a1a',haz:['T'],look:'brown gas',note:'Acidic, toxic brown gas from heating most nitrates.'});
ch('h2s',{n:'Hydrogen sulfide',f:'H₂S',st:'g',cat:'_p',col:'#e6e6e6',haz:['T','F'],look:'colourless gas, bad-egg smell',note:'Toxic. Formed when NaI reduces concentrated H₂SO₄ all the way.'});
ch('br2g',{n:'Bromine vapour',f:'Br₂',st:'g',cat:'_p',col:'#9a3a12',haz:['T','C'],look:'orange-brown vapour',note:'Halogen vapour.'});
ch('i2g',{n:'Iodine vapour',f:'I₂',st:'g',cat:'_p',col:'#6b2a8a',haz:['H'],look:'purple vapour',note:'Iodine sublimes on heating.'});
ch('alkeneg',{n:'Alkene gas',f:'CₙH₂ₙ',st:'g',cat:'_p',col:'#7a6cf0',haz:['F'],look:'colourless gas',note:'Made by elimination or cracking. Decolourises bromine water.'});
ch('steam',{n:'Steam',f:'H₂O',st:'g',cat:'_p',col:'#f2f2f2',haz:['L'],look:'steam',note:'Water given off on heating.'});
/* precipitates and other solid products */
const ppt=(id,n,f,col,M,note)=>ch(id,{n,f,st:'s',cat:'_p',col,M,ppt:1,haz:['L'],note,look:n.split(' ').slice(-1)[0]});
ppt('cuoh2','Copper(II) hydroxide','Cu(OH)₂','#7fb6e8',97.6,'Light blue precipitate. Dissolves in excess ammonia to give a deep blue solution.');
ppt('feoh2','Iron(II) hydroxide','Fe(OH)₂','#6f9a52',89.9,'Green precipitate that slowly turns orange-brown at the surface as it is oxidised by air.');
ppt('feoh3','Iron(III) hydroxide','Fe(OH)₃','#a5501f',106.9,'Red-brown (rust-coloured) precipitate.');
ppt('znoh2','Zinc hydroxide','Zn(OH)₂','#f3f3f1',99.4,'White precipitate; amphoteric, so it dissolves in excess NaOH, and also in excess ammonia.');
ppt('aloh3','Aluminium hydroxide','Al(OH)₃','#f4f4f2',78,'White precipitate; dissolves in excess NaOH but not in excess ammonia.');
ppt('croh3','Chromium(III) hydroxide','Cr(OH)₃','#6f8f6a',103,'Grey-green precipitate; dissolves in excess NaOH to a dark green solution.');
ppt('mgoh2','Magnesium hydroxide','Mg(OH)₂','#f5f5f3',58.3,'White precipitate. The least soluble Group 2 hydroxide.');
ppt('caoh2p','Calcium hydroxide','Ca(OH)₂','#f5f5f3',74.1,'Slightly soluble: forms only when the solution is concentrated enough.');
ppt('sroh2p','Strontium hydroxide','Sr(OH)₂','#f5f5f3',121.6,'Fairly soluble; only a slight precipitate.');
ppt('agcl','Silver chloride','AgCl','#f7f7f5',143.4,'White precipitate; dissolves in dilute ammonia. Darkens in sunlight.');
ppt('agbr','Silver bromide','AgBr','#efe6c8',187.8,'Cream precipitate; dissolves in concentrated ammonia only.');
ppt('agi','Silver iodide','AgI','#f1e07a',234.8,'Yellow precipitate; insoluble even in concentrated ammonia.');
ppt('ag2o','Silver(I) oxide','Ag₂O','#6b4a2c',231.7,'Brown precipitate formed by Ag⁺ and hydroxide ions; dissolves in ammonia.');
ppt('baso4','Barium sulfate','BaSO₄','#f7f7f5',233.4,'White precipitate, insoluble in acid. The least soluble Group 2 sulfate.');
ppt('caso4','Calcium sulfate','CaSO₄','#f5f5f3',136.1,'Sparingly soluble: a slight white precipitate.');
ppt('srso4','Strontium sulfate','SrSO₄','#f5f5f3',183.7,'White precipitate.');
ppt('baco3p','Barium carbonate','BaCO₃','#f5f5f3',197.3,'White precipitate; fizzes and dissolves in acid (so acidify before the sulfate test).');
ppt('caco3p2','Calcium carbonate','CaCO₃','#f3f3f1',100,'White precipitate: limewater turns milky.');
ppt('cu2o','Copper(I) oxide','Cu₂O','#b2401f',143.1,'Brick-red precipitate: positive Fehling’s or Benedict’s test.');
ppt('agmirror','Silver','Ag','#b9bcc0',107.9,'Silver mirror on the inside of the tube: positive Tollens’ test.');
ppt('dnppt','2,4-dinitrophenylhydrazone','2,4-DNP derivative','#f08a24',238,'Orange precipitate: a carbonyl group is present. Its melting point identifies the compound.');
ppt('chi3','Tri-iodomethane','CHI₃','#f2dc6a',393.7,'Pale yellow precipitate with an antiseptic smell: positive iodoform test.');
ppt('sppt','Sulfur','S','#f4e79a',32.1,'Pale yellow sulfur: the mixture turns cloudy.');
ppt('cufine','Copper','Cu','#b8673a',63.5,'Pink-brown copper metal.');
ppt('agfine','Silver','Ag','#b9bcc0',107.9,'Grey silver crystals.');
ppt('pbmetal','Lead','Pb','#8a9096',207.2,'Lead metal.');
ppt('i2s','Iodine','I₂','#2e2238',253.8,'Black solid iodine.');
ch('sro',{n:'Strontium oxide',f:'SrO',st:'s',cat:'_p',col:'#f4f4f2',M:103.6,haz:['C'],note:'White basic oxide.',look:'white solid'});
ch('bao',{n:'Barium oxide',f:'BaO',st:'s',cat:'_p',col:'#f4f4f2',M:153.3,haz:['T'],note:'White basic oxide.',look:'white solid'});
ppt('mnoh2','Manganese(II) hydroxide','Mn(OH)₂','#e9e2d6',88.9,'Off-white precipitate, darkens in air.');
ch('nano2s',{n:'Sodium nitrite',f:'NaNO₂',st:'s',cat:'_p',col:'#f6f2df',M:69,sol:1,ab:{pos:1,neg:1},haz:['T'],note:'Product of heating sodium nitrate.',look:'pale yellow-white solid'});
ch('_ions',{n:'Dissolved',f:'',st:'x',cat:'_p',col:'#dcebf6',haz:['L'],note:'',look:''});
ch('_crys',{n:'Crystals',f:'',st:'s',cat:'_p',col:'#f4f4f2',M:100,haz:['L'],note:'Solid left when the water evaporated.',look:'crystals'});

/* ---------- what each chemical contains, per mol, for the reaction engine ---------- */
const IONMAP={hcl:{H:1,Cl:1},h2so4:{H:2,SO4:1},hno3:{H:1,NO3:1},ethanoic:{H:1,CH3COO:1},naoh:{Na:1,OH:1},koh:{K:1,OH:1},nh3aq:{OH:1,NH4:1},nh3conc:{OH:1,NH4:1},
  kohethanol:{K:1,OH:1},naclaq:{Na:1,Cl:1},kbr:{K:1,Br:1},ki:{K:1,I:1},cuso4aq:{Cu2:1,SO4:1},cucl2:{Cu2:1,Cl:2},feso4:{Fe2:1,SO4:1},fecl3:{Fe3:1,Cl:3},
  znso4:{Zn2:1,SO4:1},mgso4:{Mg2:1,SO4:1},alsulf:{Al3:2,SO4:3},crsulf:{Cr3:2,SO4:3},cacl2:{Ca2:1,Cl:2},nh4claq:{NH4:1,Cl:1},na2co3aq:{Na:2,CO3:1},
  na2so4:{Na:2,SO4:1},thio:{Na:2,S2O3:1},thio01:{Na:2,S2O3:1},limewater:{Ca2:1,OH:2},agno3:{Ag:1,NO3:1},bano3:{Ba2:1,NO3:2},kmno4:{K:1,MnO4:1},kmno4t:{K:1,MnO4:1},
  brwater:{Br2:1},clwater:{Cl2:1},i2aq:{I2:1},nacls:{Na:1,Cl:1},cuso4p:{Cu2:1,SO4:1},cuso4a:{Cu2:1,SO4:1},na2co3s:{Na:2,CO3:1},nahco3:{Na:1,HCO3:1},
  naohs:{Na:1,OH:1},nh4cls:{NH4:1,Cl:1},kmno4s:{K:1,MnO4:1},cao:{Ca2:1,OH:2},bacl2:{Ba2:1,Cl:2},srcl2:{Sr2:1,Cl:2},mgcl2:{Mg2:1,Cl:2},naf:{Na:1,F:1},nabraq:{Na:1,Br:1},
  dichrom:{K:2,Cr2O7:1},kscn:{K:1,SCN:1},kio3:{K:1,IO3:1},tollens:{AgNH3:1,NO3:1},fehling:{CuTart:1,Na:4,OH:4},benedict:{CuCit:1,Na:2,OH:2},dnph:{DNPH:1},alkiodine:{I2:1,OH:6,Na:6},
  nabrs:{Na:1,Br:1},nais:{Na:1,I:1},mgno3s:{Mg2:1,NO3:2},bano3s:{Ba2:1,NO3:2},nano3s:{Na:1,NO3:1},nh4no3:{NH4:1,NO3:1},cacl2s:{Ca2:1,Cl:2},nano2s:{Na:1,NO2:1},nano2:{Na:1,NO2:1},
  co2:{CO2:1},cl2:{Cl2:1},nh3:{OH:1,NH4:1},so2:{SO2:1},hclg:{H:1,Cl:1},br2g:{Br2:1}};
for(const k in IONMAP)if(CHEM[k])CHEM[k].ion=IONMAP[k];
['nh3aq','nh3conc','nh3'].forEach(k=>{CHEM[k].weak=1;CHEM[k].is='NH3';});CHEM.ethanoic.weak=1;
/* ions & dissolved molecules: ab = contribution to the charge balance, col/tm = colour, M = g/mol */
const ION={H:{n:'H⁺',M:1},OH:{n:'OH⁻',M:17},Na:{n:'Na⁺',ab:{pos:1},M:23},K:{n:'K⁺',ab:{pos:1},M:39.1},Li:{n:'Li⁺',ab:{pos:1},M:6.9},
  Mg2:{n:'Mg²⁺',ab:{pos:2},M:24.3},Ca2:{n:'Ca²⁺',ab:{pos:2},M:40.1},Sr2:{n:'Sr²⁺',ab:{pos:2},M:87.6},Ba2:{n:'Ba²⁺',ab:{pos:2},M:137.3},Ag:{n:'Ag⁺',ab:{pos:1},M:107.9},
  Mn2:{n:'Mn²⁺',ab:{pos:2},M:54.9,col:'#f4cfd8',tm:1},Pb2:{n:'Pb²⁺',ab:{pos:2},M:207.2},Cu2:{n:'Cu²⁺',ab:{sys:{Cu:1}},M:63.5,col:'#3d8fd6',tm:5},
  Fe2:{n:'Fe²⁺',ab:{sys:{Fe2:1}},M:55.8,col:'#9fcf86',tm:2.8},Fe3:{n:'Fe³⁺',ab:{sys:{Fe3:1}},M:55.8,col:'#c9862a',tm:6},Zn2:{n:'Zn²⁺',ab:{sys:{Zn:1}},M:65.4},
  Al3:{n:'Al³⁺',ab:{sys:{Al:1}},M:27},Cr3:{n:'Cr³⁺',ab:{sys:{Cr:1}},M:52,col:'#4f8f5a',tm:15},NH4:{n:'NH₄⁺',ab:{sys:{nh:1}},M:18},NH3:{n:'NH₃',ab:{sys:{nh:1}},M:17},
  Cl:{n:'Cl⁻',ab:{neg:1},M:35.5},Br:{n:'Br⁻',ab:{neg:1},M:79.9},I:{n:'I⁻',ab:{neg:1},M:126.9},F:{n:'F⁻',ab:{neg:1},M:19},NO3:{n:'NO₃⁻',ab:{neg:1},M:62},NO2:{n:'NO₂⁻',ab:{neg:1},M:46},
  SO4:{n:'SO₄²⁻',ab:{neg:2},M:96.1},CO3:{n:'CO₃²⁻',ab:{sys:{co3:1}},M:60},HCO3:{n:'HCO₃⁻',ab:{sys:{co3:1}},M:61},CO2:{n:'CO₂',ab:{sys:{co3:1}},M:44},SO2:{n:'SO₂',ab:{sys:{so2:1}},M:64.1},
  S2O3:{n:'S₂O₃²⁻',ab:{neg:2},M:112.1},S4O6:{n:'S₄O₆²⁻',ab:{neg:2},M:224.2},MnO4:{n:'MnO₄⁻',ab:{neg:1},M:118.9,col:'#7a1f8f',tm:4000},
  Cr2O7:{n:'Cr₂O₇²⁻',ab:{neg:2},M:216,col:'#f08a24',tm:600},SCN:{n:'SCN⁻',ab:{neg:1},M:58.1},FeSCN:{n:'[Fe(SCN)]²⁺',ab:{pos:2},M:113.9,col:'#a3141c',tm:2500},
  IO3:{n:'IO₃⁻',ab:{neg:1},M:174.9},CH3COO:{n:'CH₃COO⁻',ab:{sys:{eth:1}},M:59},ZnOH4:{n:'[Zn(OH)₄]²⁻',ab:{neg:2},M:133.4},AlOH4:{n:'[Al(OH)₄]⁻',ab:{neg:1},M:95},
  CrOH6:{n:'[Cr(OH)₆]³⁻',ab:{neg:3},M:154,col:'#2f8a45',tm:20},CuNH3:{n:'[Cu(NH₃)₄]²⁺',ab:{pos:2},M:131.6,col:'#1f3fb8',tm:45},ZnNH3:{n:'[Zn(NH₃)₄]²⁺',ab:{pos:2},M:133.5},
  AgNH3:{n:'[Ag(NH₃)₂]⁺',ab:{pos:1},M:141.9},CuTart:{n:'Cu²⁺ (Fehling’s)',M:63.5,col:'#2f6fd6',tm:40},CuCit:{n:'Cu²⁺ (Benedict’s)',M:63.5,col:'#3d8fd6',tm:40},DNPH:{n:'2,4-DNPH',M:198,col:'#f2b13c',tm:60},
  Br2:{n:'Br₂',M:159.8,col:'#e8902a',tm:300},I2:{n:'I₂',M:253.8,col:'#8a4a14',tm:200},Cl2:{n:'Cl₂',M:70.9,col:'#d8e27a',tm:60},H3PO4:{n:'H₃PO₄',ab:{neg:1},M:98},
  ethanoicM:{n:'ethanoic acid',ab:{sys:{eth:1}},M:60},propanoicM:{n:'propanoic acid',ab:{sys:{eth:1}},M:74},dibromo:{n:'dibromo compound',M:200},diol:{n:'diol',M:62},
  ester:{n:'ester (fruity smell)',M:88},alkoxide:{n:'alkoxide',ab:{pos:1},M:68},carbox:{n:'carboxylate',ab:{sys:{eth:1}},M:66},alcoholP:{n:'alcohol',M:74}};
const ionName=k=>ION[k]?.n||CHEM[k]?.n||k;

/* real molar masses for metals (the IGCSE list used M:1 as a placeholder) */
Object.entries({mg:24.3,zn:65.4,fe:55.8,cu:63.5,al:27,na:23,k:39.1,li:6.9,ca:40.1,sr:87.6,ba:137.3}).forEach(([k,M])=>{if(CHEM[k])CHEM[k].M=M;});

/* =====================================================================
   REACTION ENGINE
   Everything is tracked as amounts of species in each container:
   chemical entries (it.contents) plus one hidden '_ions' entry holding
   ions/molecules made by reactions. pH still comes from the charge
   balance, so H⁺ and OH⁻ are bookkeeping only (they carry no charge here).
   ===================================================================== */
const RT=20;
Object.assign(CHEM.h2,{M:2});Object.assign(CHEM.o2,{M:32});Object.assign(CHEM.co2,{M:44});Object.assign(CHEM.cl2,{M:70.9});Object.assign(CHEM.nh3,{M:17});
Object.assign(CHEM.so2,{M:64.1});Object.assign(CHEM.ch4,{M:16});Object.assign(CHEM.c2h4,{M:28,cls:'alkene'});
Object.assign(CHEM.hclg,{M:36.5});Object.assign(CHEM.no2,{M:46});Object.assign(CHEM.h2s,{M:34.1});Object.assign(CHEM.br2g,{M:159.8});Object.assign(CHEM.i2g,{M:253.8});
Object.assign(CHEM.alkeneg,{M:56,cls:'alkene'});Object.assign(CHEM.steam,{M:18});Object.assign(CHEM.h2o2,{M:34});
const now=()=>Date.now();
const looseOf=it=>(it.contents||[]).find(x=>x.c==='_ions');
function loose(it){let e=looseOf(it);if(!e){e={c:'_ions',a:0,ions:{},m:0};(it.contents=it.contents||[]).push(e);}return e;}
function molOf(e){const C=CHEM[e.c];if(!C)return 0;
  if(C.st==='aq')return e.a/1000*(C.conc||0);if(C.st==='l')return C.M?e.a*(C.dens||1)/C.M:0;if(C.st==='s')return C.M?e.a/C.M:0;if(C.st==='g')return e.a;return 0;}
/* which entries contain species q, and how much per mol */
function carriers(it,q,o={}){const out=[],wet=(it.contents||[]).some(e=>{const C=CHEM[e.c];return C&&(C.st==='aq'||(C.st==='l'&&!C.imm))&&e.a>0;});
  for(const e of it.contents||[]){
    if(e.c==='_ions'){if(e.ions[q]>1e-13)out.push({e,k:q,per:1,kind:'loose'});continue;}
    const C=CHEM[e.c];if(!C||!(e.a>0))continue;
    if(e.c===q||C.is===q){if(o.strong&&C.weak&&q==='OH')continue;out.push({e,per:1,kind:'self'});continue;}
    if(C.ion&&C.ion[q]){if(C.st==='s'&&!(C.sol&&wet)&&!o.solid)continue;if(o.strong&&C.weak)continue;out.push({e,per:C.ion[q],kind:'comp'});}}
  return out;}
const carN=c=>c.kind==='loose'?c.e.ions[c.k]:molOf(c.e)*c.per;
function amt(it,q,o){return carriers(it,q,o).reduce((s,c)=>s+carN(c),0);}
function addWater(it,v){if(!(v>0))return;const w=it.contents.find(x=>x.c==='water');if(w)w.a+=v;else it.contents.push({c:'water',a:v});}
function reduceEntry(it,e,mol){const C=CHEM[e.c];
  if(C.st==='aq'){const v=Math.min(e.a,mol*1000/(C.conc||1));e.a-=v;if(C.conc<5)addWater(it,v);else addWater(it,v*0.1);}
  else if(C.st==='l')e.a=Math.max(0,e.a-mol*C.M/(C.dens||1));
  else if(C.st==='s')e.a=Math.max(0,e.a-mol*C.M);
  else if(C.st==='g')e.a=Math.max(0,e.a-mol);}
function take(it,q,n,o){const cs=carriers(it,q,o),tot=cs.reduce((s,c)=>s+carN(c),0);if(!(tot>0)||!(n>0))return 0;const f=Math.min(1,n/tot);
  cs.forEach(c=>{if(c.kind==='loose'){c.e.ions[c.k]*=(1-f);return;}
    const m=molOf(c.e)*f;reduceEntry(it,c.e,m);
    if(c.kind==='comp'){const C=CHEM[c.e.c],L=loose(it);for(const r in C.ion)if(r!==q)L.ions[r]=(L.ions[r]||0)+m*C.ion[r];}});
  return Math.min(n,tot);}
function give(it,q,n){if(!(n>0))return;const C=CHEM[q];it.contents=it.contents||[];
  if(C&&C.st==='s'){const e=it.contents.find(x=>x.c===q);if(e)e.a+=n*C.M;else it.contents.push({c:q,a:n*C.M});return;}
  if(C&&C.st==='l'){const v=n*C.M/(C.dens||1),e=it.contents.find(x=>x.c===q);if(e)e.a+=v;else it.contents.push({c:q,a:v});return;}
  const L=loose(it);L.ions[q]=(L.ions[q]||0)+n;}
function cleanup(it){if(!it.contents)return;const L=looseOf(it);
  if(L){for(const k in L.ions)if(!(L.ions[k]>1e-12))delete L.ions[k];}
  it.contents=it.contents.filter(e=>e.c==='_ions'?Object.keys(e.ions).length>0||Math.abs(e.m||0)>1e-6:e.a>1e-9);}
const waterVol=it=>(it.contents||[]).reduce((s,e)=>{const C=CHEM[e.c];return s+(C&&C.st==='aq'&&!C.imm&&!['h2so4conc','kohethanol'].includes(e.c)?e.a:0);},0);
const has=(it,id,min=1e-9)=>(it.contents||[]).some(e=>e.c===id&&e.a>min);
const hasCls=(it,cls)=>(it.contents||[]).some(e=>CHEM[e.c]?.cls===cls&&e.a>1e-9)||Object.keys(looseOf(it)?.ions||{}).some(k=>CHEM[k]?.cls===cls);

/* ---------- heat ---------- */
const DHSOL={naohs:-44.5,nh4cls:14.8,cuso4a:-66.5,cuso4p:11.5,nacls:3.9,na2co3s:-26.7,nahco3:16.7,nh4no3:25.7,cacl2s:-82.8,cao:-65,kmno4s:43.6,glucose:11,sucrose:5.4,nabrs:-0.6,nais:-7.5};
const LOSSK={polycup:0.07,coppercan:0.9,testtube:0.18,boilingtube:0.25,crucible:0.5,basin:0.9,cuvette:0.05,weighbottle:0.1};
function heatCap(it){let c=0;(it.contents||[]).forEach(e=>{const C=CHEM[e.c];if(!C)return;
  if(C.st==='aq'||C.st==='l')c+=e.a*(C.dens||1)*(e.c==='water'||C.st==='aq'?4.18:2.4);else if(C.st==='s')c+=e.a*0.8;});
  const d=REG[it.type],v=variantOf(it),m=d.massFn?d.massFn(it):(v?.mass??d.mass??40),mat={polycup:1.3,coppercan:0.385,crucible:0.85,basin:0.85}[it.type]||0.84;
  return Math.max(3,c+m*mat*(it.type==='polycup'?0.3:1));}
function addHeat(it,J){if(!J)return;it.state.temp=(it.state.temp??RT)+J/heatCap(it);}
/* boiling: the lowest boiling point of the liquids present (water 100 °C) */
function boilInfo(it){const A=analyse(it);if(A.V<=0)return null;let best=null;
  (it.contents||[]).forEach(e=>{const C=CHEM[e.c];if(!C||!(e.a>0))return;let bp=null,share=e.a/A.V;
    if(C.st==='l')bp=C.bp??100;else if(C.st==='aq')bp=e.c==='h2so4conc'?330:100;if(bp==null||share<0.02)return;if(!best||bp<best.bp)best={bp,e,C};});
  return best;}
function evaporate(it,grams,info,dest){if(!(grams>0))return;const C=info.C;
  if(C.st==='l'){let v=Math.min(info.e.a,grams/(C.dens||1));info.e.a-=v;if(dest){addTo(dest,info.e.c,v);react(dest,0);}return;}
  /* water: from distilled water first, then from solutions (their solutes stay behind as dissolved ions) */
  let v=grams;const w=it.contents.find(x=>x.c==='water');if(w){const d=Math.min(w.a,v);w.a-=d;v-=d;if(dest)addTo(dest,'water',d);}
  if(v>0){const aqs=it.contents.filter(e=>{const K=CHEM[e.c];return K&&K.st==='aq'&&!K.imm&&e.a>0;}),tot=aqs.reduce((s,e)=>s+e.a,0);
    aqs.forEach(e=>{const K=CHEM[e.c],dv=Math.min(e.a,v*e.a/tot),mol=dv/1000*(K.conc||0);e.a-=dv;if(dest)addTo(dest,'water',dv);
      if(K.ion){const L=loose(it);for(const r in K.ion)L.ions[r]=(L.ions[r]||0)+mol*K.ion[r];}});}
  const A=analyse(it);
  if(A.Vaq<0.05){const L=looseOf(it);if(L&&Object.keys(L.ions).length){let m=0,cs=[];for(const k in L.ions){const I=ION[k];if(I){m+=L.ions[k]*(I.M||50);if(I.col)cs.push(I.col);}}
      if(m>0){const e=it.contents.find(x=>x.c==='_crys');if(e)e.a+=m;else it.contents.push({c:'_crys',a:m,col:cs[0]||'#f4f4f2'});}L.ions={};L.m=0;note(it,'All the water has evaporated: crystals are left.');}}}
function heatSources(c){const {w}=dims(c);
  if(c.mount){const p=byId(c.mount.pid);if(p){if(p.type==='waterbath')return {bath:p.state.temp};if(p.type==='icebath')return {bath:0.5};
    if(p.type==='hotplate'||p.type==='mantle')return p.state.on?{P:p.type==='mantle'?260:340,max:p.state.set,elec:1}:{};}}
  let P=0,max=0,flame=false;
  for(const b of items){if(!(b.type==='bunsen'||b.type==='spirit')||!b.state.lit)continue;const bh=dims(b).h,top=b.y-bh+(b.type==='spirit'?4:6);
    if(Math.abs(b.x-c.x)>Math.max(16,w/2-2))continue;if(c.y>top+6||c.y<top-(b.type==='spirit'?70:90))continue;
    if(b.type==='bunsen'){const air=b.state.air||'open';P+={open:420,half:300,closed:130}[air];max=Math.max(max,{open:950,half:760,closed:520}[air]);}
    else{P+=spiritPower(b);max=Math.max(max,600);}flame=true;}
  return P>0?{P,max,flame}:{};}
function spiritFuel(b){return (b.contents||[]).find(e=>CHEM[e.c]?.dhc&&e.a>0.01);}
function spiritPower(b){const f=spiritFuel(b);if(!f)return 0;const C=CHEM[f.c];return 0.016/C.M*(-C.dhc)*1000*0.32;}

/* ---------- gases: where they go ---------- */
const gasM=g=>CHEM[g]?.M||30;
const SOLUBLE_GAS=new Set(['co2','nh3','cl2','so2','hclg','no2','h2s','c2h4','alkeneg','br2g']);
function neckChild(c){return childrenOf(c).find(k=>mountOf(k)?.type==='neck');}
function deliveryEnd(d){const {w,h}=dims(d);return {x:d.x-w/2+(d.state.mirror?6:w-6),y:d.y-20};}
function routeGas(c,g,mol){const k=neckChild(c);
  if(!k||k.type==='cotton'||k.type==='funnel'||k.type==='filler')return 'air';
  if(k.type==='bung'||k.type==='reflux'||k.type==='dropfun'){c.state.held=c.state.held||{};c.state.held[g]=(c.state.held[g]||0)+mol;return 'held';}
  if(k.type!=='delivery'&&k.type!=='stillhead'&&k.type!=='fraccol')return 'air';
  const end=k.type==='delivery'?deliveryEnd(k):{x:k.x+dims(k).w/2,y:k.y-dims(k).h+20};
  for(const s of items){if(s.type!=='syringe')continue;const nz={x:s.x+100,y:s.y-16};if(Math.hypot(nz.x-end.x,nz.y-end.y)<46){
      const add=mol*24000;s.state.vol=Math.min(100,(s.state.vol||0)+add);if(s.state.vol>=100&&!s.state.full){s.state.full=1;note(c,'The gas syringe is full (100 cm³).');}return 'syringe';}}
  for(const t of items){if(t===c)continue;const {w,h}=dims(t);if(Math.abs(end.x-t.x)>w/2+4||end.y<t.y-h-6||end.y>t.y+4)continue;
    if(t.state.flip&&(REG[t.type].tags||[]).includes('gas-collect')){t.state.held=t.state.held||{};t.state.held[g]=(t.state.held[g]||0)+mol;t.state.fizz=now()+1200;return 'collected';}
    if(isContainer(t)&&analyse(t).Vaq>0){t.state.fizz=now()+1200;if(SOLUBLE_GAS.has(g)){addTo(t,g,mol);react(t,0);}return 'bubbled';}}
  return 'air';}
function evolve(c,g,mol){if(!(mol>0))return;const s=c.state;s.gas=s.gas||{};s.gas[g]=(s.gas[g]||0)+mol;s.gasT=now();s.fizz=now()+1600;
  s.recent=s.recent||{};s.recent[g]=(s.recent[g]||0)+mol;routeGas(c,g,mol);}

/* ---------- observations ---------- */
let toastQ=[];
function note(it,msg){if(!msg)return;const s=it.state;s.log=s.log||[];const t=now();
  if(s.log.some(l=>l.m===msg&&t-l.t<9000))return;s.log.push({t,m:msg});if(s.log.length>8)s.log.shift();toastQ.push(msg);}
function flushNotes(){if(!toastQ.length)return;toast(toastQ[toastQ.length-1]);toastQ=[];}

/* ---------- reaction rules ---------- */
const RX=[];const R=o=>RX.push(o);
const Tf=E=>2**((E.T-20)/10);
const SA=n=>Math.cbrt(n*n);
function env(it,dt){const A=analyse(it),T=it.state.temp??RT;return {it,A,T,V:Math.max(1e-6,A.Vaq/1000),dt,n:(q,o)=>amt(it,q,o),c:q=>amt(it,q)/Math.max(1e-6,A.Vaq/1000),wet:waterVol(it)>0.2};}
/* effective acid strength for rates: free H⁺ plus a share of weak acid */
const hEff=E=>(E.A.pH!=null?10**-E.A.pH:0)+0.05*(E.n('ethanoic')+E.n('ethanoicM'))/E.V;
function runRule(it,r,dt){
  if(r.note){if(it.state.noted?.[r.id])return false;const E=env(it,dt);if(r.when&&!r.when(E))return false;it.state.noted=it.state.noted||{};it.state.noted[r.id]=1;note(it,r.note);return false;}
  if(r.rate&&!(dt>0))return false;
  let lim=Infinity;for(const q in r.r){const n=amt(it,q,{strong:r.strong?.includes(q),solid:r.solid?.includes(q)});lim=Math.min(lim,n/r.r[q]);if(!(lim>1e-10))return false;}
  const E=env(it,dt);if(r.when&&!r.when(E))return false;
  if(r.sol)lim-=r.sol*E.V;if(r.max)lim=Math.min(lim,r.max(E));if(!(lim>1e-10))return false;let x=lim;
  if(r.rate){x=Math.min(lim,r.rate(E)*dt);if(!(x>1e-12))return false;}
  applyRx(it,r,x,E);return true;}
function applyRx(it,r,x,E){const M0=contentsMass(it);let gas=0;
  for(const q in r.r)take(it,q,r.r[q]*x,{strong:r.strong?.includes(q),solid:r.solid?.includes(q)});
  it.state.made=it.state.made||{};for(const q in r.p||{}){const C=CHEM[q],n=r.p[q]*x;it.state.made[q]=1;if(C&&C.st==='g'){evolve(it,q,n);gas+=n*gasM(q);}else give(it,q,n);}
  if(r.dh)addHeat(it,-r.dh*1000*x);
  const M1=contentsMass(it),L=loose(it);L.m=(L.m||0)+(M0-gas+(r.dm||0)*x-M1);
  const o=typeof r.obs==='function'?r.obs(E,x):r.obs;if(o)note(it,o);cleanup(it);}
function react(it,dt=0){if(!it||!it.contents?.length)return false;let any=false;
  const inst=()=>{for(let p=0;p<18;p++){let f=false;for(const r of RX)if(!r.rate&&!r.note&&runRule(it,r,0))f=true;if(!f)break;any=true;}};
  inst();if(dt>0){let k=false;for(const r of RX)if(r.rate&&runRule(it,r,dt))k=true;if(k){any=true;inst();}
    }
  for(const r of RX)if(r.note)runRule(it,r,0);
  return any;}

/* acids and bases */
R({id:'neut',r:{H:1,OH:1},dh:-57.1});
R({id:'co3h',r:{CO3:1,H:1},p:{HCO3:1},dh:-12});
R({id:'hco3h',r:{HCO3:1,H:1},p:{co2:1},dh:12,obs:'Effervescence (fizzing): carbon dioxide is given off.'});
/* limewater */
R({id:'lime',r:{CO2:1,Ca2:1,OH:2},strong:['OH'],p:{caco3p2:1},obs:'Limewater turns milky: a white precipitate of calcium carbonate. Carbon dioxide is present.'});
R({id:'co2oh',r:{CO2:1,OH:2},strong:['OH'],p:{CO3:1},dh:-50});
R({id:'limeX',r:{caco3p2:1,CO2:1},p:{Ca2:1,HCO3:2},obs:'With a lot more CO₂ the milkiness disappears (soluble calcium hydrogencarbonate).'});
/* insoluble carbonates, oxides and hydroxides with acid */
[['caco3',0.00007,'Ca2',1,-15,'The marble chips fizz: carbon dioxide is given off.'],['caco3p',0.0007,'Ca2',1,-15,'The powder fizzes rapidly: carbon dioxide (bigger surface area, faster reaction).'],
 ['caco3p2',0.05,'Ca2',1,-15,''],['cuco3',0.0003,'Cu2',1,-10,'Fizzing; the green solid dissolves to give a blue solution.'],['znco3',0.0003,'Zn2',1,-10,'Fizzing; the white solid dissolves.'],
 ['mgco3',0.0004,'Mg2',1,-30,'Fizzing; the solid dissolves.'],['srco3',0.0003,'Sr2',1,-10,'Fizzing; the solid dissolves.'],['baco3',0.0003,'Ba2',1,-10,'Fizzing; the solid dissolves.'],['baco3p',0.05,'Ba2',1,-10,'The white precipitate fizzes and dissolves: it was barium carbonate, not sulfate.']]
.forEach(([id,k,ion,n,dh,obs])=>R({id:'acid-'+id,r:{[id]:1,H:2},solid:[],p:{[ion]:n,co2:1},dh,rate:E=>k*SA(E.n(id))*hEff(E)*Tf(E)*20,obs}));
[['cuo','Cu2',1,2,-63,0.0015,'The black solid dissolves and the solution turns blue (copper(II) salt).'],['mgo','Mg2',1,2,-150,0.004,'The white solid dissolves.'],['zno','Zn2',1,2,-90,0.003,'The white solid dissolves.'],
 ['al2o3','Al3',2,6,-100,0.0002,'The solid dissolves slowly.'],['fe2o3','Fe3',2,6,-120,0.0003,'The solid slowly dissolves to a yellow-brown solution.']]
.forEach(([id,ion,n,h,dh,k,obs])=>R({id:'acid-'+id,r:{[id]:1,H:h},p:{[ion]:n},dh,rate:E=>k*SA(E.n(id))*hEff(E)*Tf(E)*20,obs}));
[['cuoh2','Cu2',2],['feoh2','Fe2',2],['feoh3','Fe3',3],['znoh2','Zn2',2],['aloh3','Al3',3],['croh3','Cr3',3],['mgoh2','Mg2',2],['caoh2p','Ca2',2],['sroh2p','Sr2',2],['mnoh2','Mn2',2]]
.forEach(([id,ion,h])=>R({id:'acid-'+id,r:{[id]:1,H:h},p:{[ion]:1},dh:-40}));
R({id:'acid-ag2o',r:{ag2o:1,H:2},p:{Ag:2}});
/* metals */
[['mg',0.0002,-467,'Mg2'],['zn',0.00004,-153,'Zn2'],['fe',0.00001,-89,'Fe2'],['al',0.00004,-530,'Al3'],['ca',0.0015,-543,'Ca2'],['sr',0.002,-545,'Sr2'],['ba',0.003,-540,'Ba2']]
.forEach(([id,k,dh,ion])=>{const z=ion==='Al3'?3:2;R({id:'acid-'+id,r:{[id]:1,H:z},p:{[ion]:1,h2:z/2},dh,rate:E=>k*SA(E.n(id))*hEff(E)*Tf(E)*20,
  obs:E=>'Fizzing: hydrogen is given off'+(E.T>35?' and the mixture gets warm':'')+'. The metal slowly disappears.'});});
R({id:'cu-acid',note:'No reaction: copper is below hydrogen in the reactivity series.',when:E=>has(E.it,'cu')&&E.n('H')>1e-5});
[['na',0.0006,-184,'Na',1,'Sodium floats, fizzes, melts into a silvery ball and whizzes around. The solution is now alkaline (NaOH).'],
 ['k',0.002,-196,'K',1,'Potassium reacts violently: the hydrogen catches fire with a lilac flame.'],['li',0.0002,-222,'Li',1,'Lithium floats and fizzes steadily.'],
 ['ca',0.00012,-414,'Ca2',2,'Calcium sinks and fizzes steadily; the water turns cloudy (calcium hydroxide).'],['sr',0.0002,-420,'Sr2',2,'Strontium fizzes quickly.'],['ba',0.0004,-430,'Ba2',2,'Barium fizzes vigorously.'],
 ['mg',0.0000002,-350,'Mg2',2,'Only a very few bubbles: magnesium reacts very slowly with cold water.']]
.forEach(([id,k,dh,ion,z,obs])=>R({id:'water-'+id,r:{[id]:1},p:{[ion]:1,OH:z,h2:z/2},dh,when:E=>E.wet&&(E.A.pH??7)>5,rate:E=>k*SA(E.n(id))*Tf(E)*20,obs}));
/* displacement of metals from solution */
[['mg','Cu2','cufine','Mg2',1,1,1,1,-532],['zn','Cu2','cufine','Zn2',1,1,1,1,-217],['fe','Cu2','cufine','Fe2',1,1,1,1,-153],['al','Cu2','cufine','Al3',2,3,3,2,-1200],
 ['cu','Ag','agfine','Cu2',1,2,2,1,-146],['zn','Ag','agfine','Zn2',1,2,2,1,-370],['mg','Ag','agfine','Mg2',1,2,2,1,-680],['mg','Zn2','zn','Mg2',1,1,1,1,-310],['mg','Fe2','fe','Mg2',1,1,1,1,-380],['zn','Fe2','fe','Zn2',1,1,1,1,-64]]
.forEach(([m,ion,prod,mion,a,b,c,d,dh])=>R({id:`disp-${m}-${ion}`,r:{[m]:a,[ion]:b},p:{[prod]:c,[mion]:d},dh,rate:E=>0.02*SA(E.n(m))*E.c(ion)*Tf(E)/a,
  obs:ion==='Cu2'?'A pink-brown coating of copper forms on the metal and the blue colour fades. The mixture warms up.':ion==='Ag'?'Grey-silver crystals of silver grow on the metal.':'A coating of the less reactive metal forms.'}));
/* precipitation: hydroxides */
const PH=[['Cu2','cuoh2',2,0,'Light blue precipitate of copper(II) hydroxide.'],['Fe2','feoh2',2,0,'Green precipitate of iron(II) hydroxide.'],['Fe3','feoh3',3,0,'Red-brown precipitate of iron(III) hydroxide.'],
  ['Zn2','znoh2',2,0,'White precipitate of zinc hydroxide.'],['Al3','aloh3',3,0,'White precipitate of aluminium hydroxide.'],['Cr3','croh3',3,0,'Grey-green precipitate of chromium(III) hydroxide.'],
  ['Mn2','mnoh2',2,0,'Off-white precipitate of manganese(II) hydroxide.'],['Mg2','mgoh2',2,1e-4,'White precipitate of magnesium hydroxide.']];
PH.forEach(([ion,p,n,sol,obs])=>R({id:'ppt-'+p,r:{[ion]:1,OH:n},p:{[p]:1},sol,dh:-20,obs}));
[['Ca2','caoh2p',0.02,'A slight white precipitate of calcium hydroxide (it is only slightly soluble).'],['Sr2','sroh2p',0.06,'A very slight white precipitate: strontium hydroxide is fairly soluble.']]
.forEach(([ion,p,sol,obs])=>R({id:'ppt-'+p,r:{[ion]:1,OH:2},strong:['OH'],p:{[p]:1},sol,obs}));
R({id:'ba-oh',note:'No precipitate: barium hydroxide is soluble. Hydroxide solubility increases down Group 2.',when:E=>E.n('Ba2')>1e-6&&E.n('OH',{strong:true})>1e-6});
/* amphoteric hydroxides dissolve in excess NaOH; ammonia complexes */
R({id:'zn-xs',r:{znoh2:1,OH:2},strong:['OH'],p:{ZnOH4:1},obs:'The white precipitate dissolves in excess sodium hydroxide: colourless solution.'});
R({id:'al-xs',r:{aloh3:1,OH:1},strong:['OH'],p:{AlOH4:1},obs:'The white precipitate dissolves in excess sodium hydroxide: colourless solution.'});
R({id:'cr-xs',r:{croh3:1,OH:3},strong:['OH'],p:{CrOH6:1},obs:'The precipitate dissolves in excess sodium hydroxide: dark green solution.'});
R({id:'cu-nh3',r:{cuoh2:1,NH3:4},p:{CuNH3:1,OH:2},obs:'The precipitate dissolves in excess ammonia: deep blue solution.'});
R({id:'zn-nh3',r:{znoh2:1,NH3:4},p:{ZnNH3:1,OH:2},obs:'The white precipitate dissolves in excess ammonia: colourless solution.'});
R({id:'al-nh3',note:'The white precipitate does not dissolve in excess ammonia (Al³⁺, not Zn²⁺).',when:E=>has(E.it,'aloh3')&&E.n('NH3')>1e-4});
/* silver */
R({id:'ppt-agcl',r:{Ag:1,Cl:1},p:{agcl:1},obs:'White precipitate of silver chloride.'});
R({id:'ppt-agbr',r:{Ag:1,Br:1},p:{agbr:1},obs:'Cream precipitate of silver bromide.'});
R({id:'ppt-agi',r:{Ag:1,I:1},p:{agi:1},obs:'Yellow precipitate of silver iodide.'});
R({id:'agf',note:'No precipitate: silver fluoride is soluble.',when:E=>E.n('Ag')>1e-6&&E.n('F')>1e-6});
R({id:'ppt-ag2o',r:{Ag:2,OH:2},p:{ag2o:1},obs:'Brown precipitate of silver(I) oxide.'});
R({id:'ag2o-nh3',r:{ag2o:1,NH3:4},p:{AgNH3:2,OH:2},obs:'The brown precipitate dissolves in ammonia (this is Tollens’ reagent).'});
R({id:'agcl-nh3',r:{agcl:1,NH3:2},p:{AgNH3:1,Cl:1},when:E=>E.c('NH3')>0.15,obs:'The white precipitate dissolves in ammonia: it was AgCl.'});
R({id:'agbr-nh3',r:{agbr:1,NH3:2},p:{AgNH3:1,Br:1},when:E=>E.c('NH3')>3,obs:'The cream precipitate dissolves in concentrated ammonia: it was AgBr.'});
R({id:'agbr-dil',note:'The cream precipitate does not dissolve in dilute ammonia. Try concentrated ammonia.',when:E=>has(E.it,'agbr')&&E.n('NH3')>1e-5&&E.c('NH3')<=3});
R({id:'agi-nh3',note:'The yellow precipitate does not dissolve, even in concentrated ammonia: it is AgI.',when:E=>has(E.it,'agi')&&E.n('NH3')>1e-5});
/* sulfates and carbonates */
[['Ba2','SO4','baso4',1e-5,'White precipitate of barium sulfate: sulfate ions are present.'],['Sr2','SO4','srso4',7e-4,'White precipitate of strontium sulfate.'],
 ['Ca2','SO4','caso4',0.015,'A slight white precipitate of calcium sulfate (sparingly soluble).'],['Ba2','CO3','baco3p',0,'White precipitate (barium carbonate). Acidify first in a sulfate test!'],
 ['Ca2','CO3','caco3p2',0,'White precipitate of calcium carbonate.'],['Cu2','CO3','cuco3',0,'Blue-green precipitate of copper(II) carbonate.'],['Zn2','CO3','znco3',0,'White precipitate of zinc carbonate.'],
 ['Mg2','CO3','mgco3',0.004,'White precipitate of magnesium carbonate.']]
.forEach(([a,b,p,sol,obs])=>R({id:`ppt-${p}`,r:{[a]:1,[b]:1},p:{[p]:1},sol,obs}));
/* ammonium ions + warm alkali */
R({id:'nh4-oh',r:{NH4:1,OH:1},strong:['OH'],p:{nh3:1},when:E=>E.T>=35,rate:E=>0.04*E.n('NH4')*Tf(E),dh:50,obs:'A gas with a sharp smell is given off: ammonia (it turns damp red litmus blue).'});
/* halogens */
R({id:'cl-br',r:{Cl2:1,Br:2},p:{Br2:1,Cl:2},obs:'The solution turns orange-yellow: chlorine displaces bromine.'});
R({id:'cl-i',r:{Cl2:1,I:2},p:{I2:1,Cl:2},obs:'The solution turns brown: chlorine displaces iodine.'});
R({id:'br-i',r:{Br2:1,I:2},p:{I2:1,Br:2},obs:'The solution turns brown: bromine displaces iodine.'});
R({id:'i-x',note:'No change: iodine is less reactive than chlorine and bromine, so it cannot displace them.',when:E=>E.n('I2')>1e-7&&!E.it.state.made?.I2&&(E.n('Cl')>1e-6||E.n('Br')>1e-6)&&!E.n('I')});
R({id:'br-cl',note:'No change: bromine cannot displace chlorine.',when:E=>E.n('Br2')>1e-7&&!E.it.state.made?.Br2&&E.n('Cl')>1e-6&&!E.n('I')});
/* redox */
R({id:'mno4-fe',r:{MnO4:1,Fe2:5},p:{Mn2:1,Fe3:5},when:E=>(E.A.pH??7)<5,obs:'The purple manganate(VII) is decolourised as it oxidises Fe²⁺.'});
R({id:'mno4-fe-noacid',r:{MnO4:1,Fe2:3},p:{Fe3:3,mno2:1},when:E=>(E.A.pH??7)>=5,obs:'A brown precipitate (MnO₂) forms: the solution was not acidified with dilute sulfuric acid.'});
R({id:'cr-fe',r:{Cr2O7:1,Fe2:6},p:{Cr3:2,Fe3:6},obs:'Orange dichromate turns green as it oxidises Fe²⁺.'});
R({id:'i2-thio',r:{I2:1,S2O3:2},p:{I:2,S4O6:1},obs:'The iodine colour fades as thiosulfate reduces it to iodide.'});
R({id:'io3-i',r:{IO3:1,I:5,H:6},p:{I2:3},obs:'The solution turns brown: iodine is released.'});
R({id:'mno4-so2',r:{MnO4:2,SO2:5},p:{Mn2:2,SO4:5},obs:'Acidified potassium manganate(VII) turns from purple to colourless: sulfur dioxide.'});
R({id:'cr-so2',r:{Cr2O7:1,SO2:3},p:{Cr3:2,SO4:3},obs:'Acidified dichromate turns from orange to green: sulfur dioxide.'});
R({id:'fe-scn',r:{Fe3:1,SCN:1},p:{FeSCN:1},obs:'A blood-red colour: Fe³⁺ ions are present.'});
R({id:'fe2-scn',note:'No red colour: Fe²⁺ does not react with thiocyanate (only Fe³⁺ does).',when:E=>E.n('Fe2')>1e-6&&E.n('SCN')>1e-6&&!E.n('Fe3')});
R({id:'h2o2-i',r:{h2o2:1,I:2,H:2},p:{I2:1},rate:E=>0.02*E.c('h2o2')*E.c('I')*E.V*Tf(E),obs:'The solution slowly turns yellow-brown as iodine forms.'});
/* rates experiments */
R({id:'thio-acid',r:{S2O3:1,H:2},p:{sppt:1,so2:1},rate:E=>0.04*E.c('S2O3')*Math.min(E.c('H'),2)*E.V*Tf(E),
  obs:'The mixture slowly turns cloudy pale yellow: sulfur is forming. Time how long until the cross disappears.'});
R({id:'h2o2-mno2',r:{h2o2:2},p:{o2:1},dh:-196,rate:E=>(0.05*(has(E.it,'mno2')?(E.it.contents.find(e=>e.c==='mno2').a):0)+2e-6)*E.c('h2o2')*E.V*Tf(E)*4,
  obs:E=>has(E.it,'mno2')?'Vigorous fizzing: oxygen is given off. The black MnO₂ is a catalyst and is not used up.':''});
/* heating solids (thermal decomposition) */
const dry=E=>E.A.Vaq<0.5;
[['cuco3',260,['cuo'],['co2'],'The green solid turns black (copper(II) oxide) and carbon dioxide is given off.'],
 ['znco3',300,['zno'],['co2'],'The white solid decomposes (it is yellow while hot, white when cold): zinc oxide and carbon dioxide.'],
 ['mgco3',380,['mgo'],['co2'],'Magnesium carbonate decomposes easily: MgO and carbon dioxide.'],
 ['caco3',820,['cao'],['co2'],'The chips glow brightly and slowly decompose to calcium oxide (quicklime) and carbon dioxide.'],
 ['caco3p',820,['cao'],['co2'],'The powder decomposes to calcium oxide and carbon dioxide.'],
 ['srco3',1150,['sro'],['co2'],''],['baco3',1350,['bao'],['co2'],''],
 ['mgno3s',330,['mgo'],{no2:2,o2:0.5},'Brown gas (NO₂) and oxygen are given off; white MgO is left.'],
 ['bano3s',620,['bao'],{no2:2,o2:0.5},'At a higher temperature than Mg(NO₃)₂: brown NO₂ and oxygen are given off.'],
 ['nano3s',500,['nano2s'],{o2:0.5},'The solid melts and gives off oxygen (relights a glowing splint), but no brown gas: Group 1 nitrate.'],
 ['nahco3',110,{na2co3s:0.5},{co2:0.5,steam:0.5},'Carbon dioxide and water vapour are given off; sodium carbonate is left.'],
 ['cuso4p',110,['cuso4a'],{steam:5},'Blue crystals turn white as the water of crystallisation is driven off. Droplets condense near the mouth.'],
 ['nh4cls',300,[],{nh3:1,hclg:1},'The white solid seems to disappear; it re-forms as a white solid in the cooler part of the tube (NH₃ + HCl ⇌ NH₄Cl).'],
 ['iodine',114,[],{i2g:1},'The iodine sublimes into a purple vapour.']]
.forEach(([id,T,sol,gas,obs])=>{const p={};(Array.isArray(sol)?sol:Object.keys(sol)).forEach(k=>p[k]=Array.isArray(sol)?1:sol[k]);
  (Array.isArray(gas)?gas:Object.keys(gas)).forEach(k=>p[k]=Array.isArray(gas)?1:gas[k]);
  R({id:'heat-'+id,r:{[id]:1},p,when:E=>dry(E)&&E.T>=T,rate:E=>0.004*SA(E.n(id))*(1+(E.T-T)/120),dh:id==='nh4cls'?176:120,obs});});
R({id:'baco3-stable',note:'No change: barium carbonate is too stable to decompose at Bunsen-flame temperature. Thermal stability increases down Group 2.',when:E=>has(E.it,'baco3')&&dry(E)&&E.T>700});
R({id:'srco3-stable',note:'Strontium carbonate barely decomposes in a Bunsen flame: it needs a higher temperature than CaCO₃.',when:E=>has(E.it,'srco3')&&dry(E)&&E.T>700});
/* burning in air (crucible or tongs in a flame) */
R({id:'burn-mg',r:{mg:1},p:{mgo:1},dm:16,when:E=>dry(E)&&E.T>=640,rate:E=>0.02*SA(E.n('mg')),dh:-602,obs:'Magnesium burns with a dazzling white flame, leaving white magnesium oxide. Don’t look directly at it.'});
R({id:'burn-cu',r:{cu:1},p:{cuo:1},dm:16,when:E=>dry(E)&&E.T>=300,rate:E=>0.0015*SA(E.n('cu')),dh:-157,obs:'The copper surface turns black: copper(II) oxide.'});
R({id:'burn-s',r:{sulfur:1},p:{so2:1},when:E=>dry(E)&&E.T>=250,rate:E=>0.004*SA(E.n('sulfur')),dh:-297,obs:'Sulfur melts and burns with a blue flame, giving choking sulfur dioxide.'});
/* concentrated sulfuric acid + halides */
const concAcid=E=>{const a=E.it.contents.find(e=>e.c==='h2so4conc');return a&&a.a/Math.max(1e-6,E.A.Vaq)>0.5;};
R({id:'conc-cl',r:{Cl:1},p:{hclg:1},when:concAcid,rate:E=>0.02*Math.max(E.n('Cl'),1e-5)*Tf(E)*10,obs:'Steamy, misty fumes of hydrogen chloride.'});
R({id:'conc-br',r:{Br:2,h2so4conc:1},p:{br2g:1,so2:1},when:concAcid,rate:E=>0.02*Math.max(E.n('Br'),1e-5)*Tf(E)*10,obs:'Steamy fumes (HBr) and orange-brown bromine vapour; sulfur dioxide is also given off.'});
R({id:'conc-i',r:{I:8,h2so4conc:1},p:{i2s:3.6,i2g:0.4,h2s:1},when:concAcid,rate:E=>0.02*Math.max(E.n('I'),1e-5)*Tf(E)*10,obs:'Purple iodine vapour and a black solid (iodine); a bad-egg smell of hydrogen sulfide and some yellow sulfur.'});
/* Period 3 oxides and chlorides with water */
R({id:'p4o10',r:{p4o10:1},p:{H:4,H3PO4:4},when:E=>E.wet,rate:E=>0.05,dh:-380,obs:'Reacts vigorously with water: phosphoric acid forms (pH about 2).'});
R({id:'alcl3',r:{alcl3:1},p:{Al3:1,Cl:3,hclg:0.2},when:E=>E.wet,rate:E=>0.05,dh:-300,obs:'Steamy fumes of HCl; the solution is acidic (pH about 3).'});
R({id:'sio2',note:'No reaction: silicon dioxide is insoluble in water.',when:E=>has(E.it,'sio2')&&E.wet});
/* ---------- organic ---------- */
const ORG=k=>CHEM[k]?.cls;
const orgIds=cls=>CHEM_ORDER.filter(k=>CHEM[k].cls===cls);
const subst=E=>Math.max(E.A.V,1)/1000;
/* alkenes */
['hexene','cyclohexene','c2h4','alkeneg'].forEach(id=>{
  R({id:'br-'+id,r:{Br2:1,[id]:1},p:{dibromo:1},obs:'Bromine water is decolourised (orange → colourless): there is a C=C double bond.'});
  R({id:'mno4-'+id,r:{MnO4:2,[id]:5},p:{Mn2:2,diol:5},obs:'Acidified manganate(VII) is decolourised (purple → colourless): there is a C=C double bond.'});});
R({id:'alkane-br',note:'Bromine water stays orange: alkanes are saturated (no C=C).',when:E=>(has(E.it,'hexane')||has(E.it,'paraffin'))&&E.n('Br2')>1e-6&&!['hexene','cyclohexene','c2h4','alkeneg'].some(k=>E.n(k)>0)});
/* oxidation: dichromate and manganate(VII) */
const OXP={ethanol:'ethanal',methanol:null,propan1ol:'propanal',butan1ol:'propanal',propan2ol:'propanone',ethanal:'ethanoicM',propanal:'propanoicM'};
Object.entries(OXP).forEach(([alc,prod])=>{if(!prod)return;const cls=CHEM[alc].cls;
  R({id:'cr-'+alc,r:{Cr2O7:1,[alc]:3},p:{Cr3:2,[prod]:3},when:E=>E.T>=40,rate:E=>0.25*E.c('Cr2O7')*E.n(alc)/subst(E)*E.V*Tf(E)*0.3,
    obs:cls==='ald'?'Orange → green: the aldehyde is oxidised to a carboxylic acid.':cls==='alc2'?'Orange → green: the secondary alcohol is oxidised to a ketone.':'Orange → green: the primary alcohol is oxidised (to an aldehyde, then a carboxylic acid under reflux).'});
  R({id:'mn-'+alc,r:{MnO4:2,[alc]:5},p:{Mn2:2,[prod]:5},when:E=>E.T>=40,rate:E=>0.25*E.c('MnO4')*E.n(alc)/subst(E)*E.V*Tf(E)*0.3,obs:'Purple → colourless: the compound is oxidised.'});});
R({id:'cr-tert',note:'Stays orange: a tertiary alcohol is not oxidised.',when:E=>E.T>=40&&E.n('Cr2O7')>1e-7&&has(E.it,'mepropan2ol')});
R({id:'cr-ket',note:'Stays orange: ketones are not oxidised by acidified dichromate.',when:E=>E.T>=40&&E.n('Cr2O7')>1e-7&&E.n('propanone')>1e-6&&!['ethanol','propan1ol','propan2ol','ethanal','propanal','methanol','butan1ol'].some(k=>E.n(k)>0)});
/* aldehyde tests */
const REDUCERS=['ethanal','propanal','glucose'];
REDUCERS.forEach(a=>{
  R({id:'tol-'+a,r:{AgNH3:2,[a]:1},p:{agmirror:2,carbox:1,NH3:4},when:E=>E.T>=38,rate:E=>0.4*E.c('AgNH3')*E.n(a)/subst(E)*E.V*Tf(E)*0.2,obs:'A silver mirror forms on the inside of the tube: positive Tollens’ test.'});
  R({id:'feh-'+a,r:{CuTart:2,[a]:1},p:{cu2o:1,carbox:1},when:E=>E.T>=60,rate:E=>0.4*E.c('CuTart')*E.n(a)/subst(E)*E.V*Tf(E)*0.2,obs:'Blue → brick-red precipitate of copper(I) oxide: positive Fehling’s test.'});
  R({id:'ben-'+a,r:{CuCit:2,[a]:1},p:{cu2o:1,carbox:1},when:E=>E.T>=65,rate:E=>0.4*E.c('CuCit')*E.n(a)/subst(E)*E.V*Tf(E)*0.2,obs:'The blue solution turns green, then yellow, orange and finally a brick-red precipitate: reducing sugar or aldehyde.'});});
R({id:'tol-ket',note:'No change: ketones do not reduce Tollens’ reagent.',when:E=>E.T>=38&&E.n('AgNH3')>1e-6&&E.n('propanone')>1e-6&&!REDUCERS.some(k=>E.n(k)>0)});
R({id:'feh-ket',note:'Stays blue: ketones do not reduce Fehling’s or Benedict’s solution.',when:E=>E.T>=60&&(E.n('CuTart')>1e-6||E.n('CuCit')>1e-6)&&E.n('propanone')>1e-6&&!REDUCERS.some(k=>E.n(k)>0)});
R({id:'ben-suc',note:'Stays blue: sucrose is not a reducing sugar.',when:E=>E.T>=65&&(E.n('CuCit')>1e-6||E.n('CuTart')>1e-6)&&has(E.it,'sucrose')&&!REDUCERS.some(k=>E.n(k)>0)});
['ethanal','propanal','propanone'].forEach(c=>R({id:'dnph-'+c,r:{DNPH:1,[c]:1},p:{dnppt:1},obs:'Orange precipitate with 2,4-DNPH: a carbonyl group (C=O) is present.'}));
R({id:'dnph-no',note:'No precipitate with 2,4-DNPH: no aldehyde or ketone C=O group.',when:E=>E.n('DNPH')>1e-6&&['ethanol','propan1ol','propan2ol','ethanoic','ethylethanoate','mepropan2ol','hexane','hexene'].some(k=>has(E.it,k))&&!['ethanal','propanal','propanone'].some(k=>E.n(k)>0)});
['ethanol','ethanal','propanone','propan2ol'].forEach(c=>R({id:'iod-'+c,r:{I2:3,OH:4,[c]:1},strong:['OH'],p:{chi3:1,carbox:1},when:E=>E.T>=30,rate:E=>0.3*E.c('I2')*E.n(c)/subst(E)*E.V*Tf(E),
  obs:'Pale yellow precipitate with an antiseptic smell (CHI₃): positive tri-iodomethane test.'}));
R({id:'iod-no',note:'No yellow precipitate: no CH₃CO– or CH₃CH(OH)– group.',when:E=>E.T>=30&&E.n('I2')>1e-6&&E.n('OH',{strong:true})>1e-6&&['propan1ol','methanol','mepropan2ol','propanal','butan1ol'].some(k=>has(E.it,k))&&!['ethanol','ethanal','propanone','propan2ol'].some(k=>E.n(k)>0)});
/* sodium with alcohols and acids; PCl5 test for –OH */
['ethanol','methanol','propan1ol','propan2ol','butan1ol','mepropan2ol'].forEach(a=>R({id:'na-'+a,r:{na:1,[a]:1},p:{alkoxide:1,h2:0.5},when:E=>!E.wet,rate:E=>0.004*SA(E.n('na'))*Tf(E)*20,dh:-150,obs:'Steady fizzing: hydrogen is given off and the sodium slowly disappears (an alkoxide forms).'}));
['ethanol','methanol','propan1ol','propan2ol','butan1ol','mepropan2ol','ethanoic','water'].forEach(a=>R({id:'pcl5-'+a,r:{pcl5:1,[a]:1},p:{hclg:1},solid:['pcl5'],dh:-100,obs:'Steamy, misty fumes of HCl: an –OH group is present.'}));
/* esterification (an equilibrium: stops at about two-thirds) */
[['ethanoic','ethanol','ethylethanoate'],['ethanoic','methanol','ester'],['ethanoic','propan1ol','ester'],['ethanoicM','ethanol','ethylethanoate']].forEach(([ac,al,es])=>
  R({id:`est-${ac}-${al}`,r:{[ac]:1,[al]:1},p:{[es]:1},when:E=>has(E.it,'h2so4conc')&&E.T>=50,max:E=>{const made=E.n(es),lim=Math.min(E.n(ac),E.n(al));return Math.max(0,0.67*(made+lim)-made);},
    rate:E=>0.06*E.c(ac)*E.n(al)/subst(E)*E.V*Tf(E)*0.2,obs:'A sweet, fruity smell: an ester is forming (catalysed by concentrated sulfuric acid).'}));
R({id:'est-noacid',note:'Nothing much happens without a catalyst: add a few drops of concentrated sulfuric acid and warm.',when:E=>E.T>=50&&has(E.it,'ethanol')&&has(E.it,'ethanoic')&&!has(E.it,'h2so4conc')});
/* halogenoalkanes: hydrolysis (substitution) and elimination */
[['iodobutane','I',0.0002],['bromobutane','Br',0.00003],['chlorobutane','Cl',0.000002],['bromomeprop','Br',0.002]].forEach(([rx,X,k])=>{
  R({id:'hyd-'+rx,r:{[rx]:1},p:{alcoholP:1,[X]:1},when:E=>E.wet&&!(has(E.it,'kohethanol')&&E.T>=60),rate:E=>k*E.n(rx)*Tf(E)*(E.n('OH',{strong:true})>1e-5?6:1)*0.25});
  R({id:'eli-'+rx,r:{[rx]:1},p:{alkeneg:1,[X]:1},when:E=>has(E.it,'kohethanol')&&E.T>=60,rate:E=>k*3*E.n(rx)*Tf(E),obs:'A gas is given off (an alkene): ethanolic KOH causes elimination.'});});
/* cracking */
R({id:'crack',r:{paraffin:0.05},p:{alkeneg:1},when:E=>(has(E.it,'al2o3')||has(E.it,'antibump'))&&E.T>=250,rate:E=>0.00008,obs:'Gas is given off (short alkenes and alkanes). Collect it and test with bromine water.'});

/* ---------- flame tests ---------- */
const FLAME={Li:['#e8213a','crimson red (Li⁺)'],Na:['#ffb000','yellow-orange (Na⁺)'],K:['#c48cf2','lilac (K⁺)'],Ca2:['#ff5a1f','orange-red (Ca²⁺)'],
  Sr2:['#e3002a','red (Sr²⁺)'],Ba2:['#8ee06a','apple green (Ba²⁺)'],Cu2:['#2ad4a0','blue-green (Cu²⁺)']};
function sampleIons(c){const out={};(c.contents||[]).forEach(e=>{if(e.c==='_ions'){for(const k in e.ions)out[k]=(out[k]||0)+e.ions[k];return;}const C=CHEM[e.c];if(C?.ion)for(const k in C.ion)out[k]=(out[k]||0)+molOf(e)*C.ion[k];
  if(['li','na','k','ca','sr','ba'].includes(e.c))out[{li:'Li',na:'Na',k:'K',ca:'Ca2',sr:'Sr2',ba:'Ba2'}[e.c]]=(out[{li:'Li',na:'Na',k:'K',ca:'Ca2',sr:'Sr2',ba:'Ba2'}[e.c]]||0)+molOf(e);});return out;}

/* ---------- electrolysis ---------- */
let lastCurrent=0;
function electrodeIn(el){const tip={x:el.x,y:el.y-4};for(const c of items){if(!isContainer(c))continue;const {w,h}=dims(c);
  if(Math.abs(tip.x-c.x)<w/2&&tip.y<c.y&&tip.y>c.y-h){const A=analyse(c);if((A.V>0&&tip.y>liquidTopWorld(c))||(has(c,'pbbr2')&&(c.state.temp??RT)>=373))return c;}}return null;}
function electrolysis(dt){lastCurrent=0;const pp=items.find(p=>p.type==='powerpack'&&p.state.on&&p.state.volts>0);if(!pp)return false;
  const an=items.filter(e=>e.type==='electrode'&&e.state.term==='+'),ca=items.filter(e=>e.type==='electrode'&&e.state.term==='-');if(!an.length||!ca.length)return false;
  const A0=an[0],C0=ca[0],c=electrodeIn(A0);if(!c||electrodeIn(C0)!==c)return false;
  const molten=has(c,'pbbr2')&&(c.state.temp??RT)>=373&&analyse(c).Vaq<0.5;const ions=sampleIons(c);
  const ionic=molten||Object.keys(ions).some(k=>ION[k]?.ab&&ions[k]>1e-6);if(!ionic){c.state.noted=c.state.noted||{};if(!c.state.noted.nocond){c.state.noted.nocond=1;note(c,'No current flows: the liquid has no free ions, so it does not conduct.');}return false;}
  const I=pp.state.volts/4;lastCurrent=I;const ne=I*dt/96500*25;let obsC,obsA;
  if(molten){const m=Math.min(ne/2,amt(c,'pbbr2'));take(c,'pbbr2',m);C0.state.coat=(C0.state.coat||0)+m*207.2;C0.state.coatCol='#8a9096';evolve(c,'br2g',m);
    obsC='Molten lead forms at the cathode.';obsA='Red-brown bromine vapour forms at the anode.';}
  else{if(amt(c,'Ag')>1e-7){const m=take(c,'Ag',ne);C0.state.coat=(C0.state.coat||0)+m*107.9;C0.state.coatCol='#b9bcc0';obsC='Silver is deposited on the cathode.';}
    else if(amt(c,'Cu2')>1e-7){const m=take(c,'Cu2',ne/2);C0.state.coat=(C0.state.coat||0)+m*63.5;C0.state.coatCol='#b8673a';obsC='A pink-brown layer of copper forms on the cathode; the blue colour fades.';}
    else{give(c,'OH',ne);evolve(c,'h2',ne/2);obsC='Bubbles of hydrogen at the cathode.';}
    if(A0.variant==='copper'){give(c,'Cu2',ne/2);A0.state.lost=(A0.state.lost||0)+ne/2*63.5;obsA='The copper anode dissolves (gets thinner), putting Cu²⁺ ions into solution.';}
    else{const X=['I','Br','Cl'].find(x=>amt(c,x)/Math.max(1e-6,analyse(c).Vaq/1000)>0.1);
      if(X==='Cl'){take(c,'Cl',ne);evolve(c,'cl2',ne/2);obsA='Bubbles of pale green chlorine at the anode (it bleaches damp litmus).';}
      else if(X){take(c,X,ne);give(c,X==='Br'?'Br2':'I2',ne/2);obsA=X==='Br'?'Orange-brown bromine forms around the anode.':'Brown iodine forms around the anode.';}
      else{give(c,'H',ne);evolve(c,'o2',ne/4);obsA='Bubbles of oxygen at the anode.';}}}
  note(c,obsC);note(c,obsA);react(c,0);cleanup(c);return true;}

/* ---------- gas and probe tests ---------- */
function gasNear(it){const {w,h}=dims(it),x0=it.x-w/2-8,x1=it.x+w/2+8,y0=it.y-h-8,y1=it.y+8;let best=null;
  for(const c of items){if(c===it)continue;const d=dims(c);const s=c.state;const held=s.held&&Object.values(s.held).some(v=>v>1e-6);
    const recent=s.recent&&now()-(s.gasT||0)<25000&&Object.values(s.recent).some(v=>v>1e-6);if(!held&&!recent)continue;
    const mouthY=c.state.flip?c.y:c.y-d.h;const zx0=c.x-d.w/2-14,zx1=c.x+d.w/2+14,zy0=mouthY-60,zy1=mouthY+24;
    if(x1<zx0||x0>zx1||y1<zy0||y0>zy1)continue;best={c,gases:{...(held?s.held:{}),...(recent?s.recent:{})}};}
  return best;}
function liquidUnder(it){const {w,h}=dims(it);const p={x:it.x,y:it.y-4};for(const c of items){if(c===it||!isContainer(c))continue;const d=dims(c);
  if(Math.abs(p.x-c.x)<d.w/2&&p.y<c.y&&p.y>c.y-d.h){const A=analyse(c);if(A.V>0&&p.y>liquidTopWorld(c))return c;if(A.solids.length)return c;}}return null;}
function probe(it){if(!it)return;
  if(it.type==='nichrome'){const lx=it.x-dims(it).w/2+(it.state.mirror?5.5:dims(it).w-5.5),ly=it.y-6;
    for(const b of items){if(b.type!=='bunsen'||!b.state.lit)continue;const top=b.y-dims(b).h;if(Math.abs(lx-b.x)<14&&ly<top+4&&ly>top-62){
        const k=it.state.sample;if(!k){toast('Clean loop: no colour. Dip it in a sample first.');return;}const f=FLAME[k];b.state.tint=f[0];b.state.tintT=now()+6000;
        toast('Flame test: '+f[1]+' flame.');it.state.sample=null;commit();renderAll();return;}}
    for(const c of items){if(!isContainer(c))continue;const d=dims(c);if(Math.abs(lx-c.x)<d.w/2&&ly<c.y&&ly>c.y-d.h){const ions=sampleIons(c);let best=null,bn=0;
        for(const k in FLAME)if((ions[k]||0)>bn){bn=ions[k];best=k;}if(best){it.state.sample=best;toast('Loop dipped in '+nameOf(c)+'. Now hold it in a blue Bunsen flame.');commit();renderAll();}
        else toast('No metal ions here that give a flame colour.');return;}}return;}
  if(it.type==='splint'||it.type==='indpaper'){
    if(it.type==='indpaper'){const c=liquidUnder(it);if(c){const A=analyse(c);if(A.pH!=null){const v=it.variant;
          if(v==='ui'){it.state.col=indColour('ui',A.pH);toast('Universal indicator paper turns '+indName('ui',A.pH)+' (pH about '+Math.round(A.pH)+').');}
          else if(v==='red'&&A.pH>8){it.state.col='var(--litmus-blue)';toast('Red litmus turns blue: alkaline.');}
          else if(v==='blue'&&A.pH<5){it.state.col='var(--litmus-red)';toast('Blue litmus turns red: acidic.');}
          else toast('No colour change.');commit();renderAll();return;}}}
    const g=gasNear(it);if(!g){if(it.type==='splint'&&it.state.fire!=='none')toast('Nothing happens. Hold it at the mouth of a tube where a gas is being given off.');return;}
    const G=g.gases,has2=k=>(G[k]||0)>1e-6,c=g.c;let msg='';
    if(it.type==='splint'){const f=it.state.fire;
      if(f==='lit'&&has2('h2')){msg='Squeaky pop! The gas is hydrogen.';if(c.state.held)c.state.held.h2=0;}
      else if(f==='glowing'&&has2('o2')){msg='The glowing splint relights: the gas is oxygen.';it.state.fire='lit';}
      else if(f==='lit'&&has2('o2'))msg='The splint burns more brightly: oxygen.';
      else if(f==='lit'&&(has2('co2')||has2('nh3')||has2('cl2')||has2('hclg')||has2('so2'))){msg='The lit splint goes out'+(has2('co2')?' (carbon dioxide does this, but confirm it with limewater).':'.');it.state.fire='none';}
      else if(f==='glowing')msg='The glowing splint does not relight: not oxygen.';
      else msg='Light the splint (or make it glow) first.';}
    else{const v=it.variant;
      if(has2('cl2')){it.state.col='#f7f7f2';msg='The damp paper is bleached white'+(v==='blue'?' (it turns red first)':'')+': chlorine.';}
      else if(has2('nh3')){if(v==='red'){it.state.col='var(--litmus-blue)';msg='Damp red litmus turns blue: ammonia (an alkaline gas).';}else if(v==='ui'){it.state.col=indColour('ui',11);msg='Universal indicator turns blue-purple: ammonia.';}else msg='Blue litmus stays blue: the gas is alkaline (ammonia).';}
      else if(has2('hclg')||has2('so2')||has2('no2')||has2('h2s')){const nm=has2('hclg')?'hydrogen chloride':has2('so2')?'sulfur dioxide':has2('no2')?'nitrogen dioxide':'hydrogen sulfide';
        if(v==='blue'){it.state.col='var(--litmus-red)';msg='Damp blue litmus turns red: an acidic gas ('+nm+').';}else if(v==='ui'){it.state.col=indColour('ui',2);msg='Universal indicator turns red: an acidic gas ('+nm+').';}else msg='Red litmus stays red: the gas is acidic ('+nm+').';}
      else if(has2('co2')){if(v==='blue'){it.state.col='#b8577a';msg='Damp blue litmus turns slightly red: carbon dioxide is weakly acidic.';}else if(v==='ui'){it.state.col=indColour('ui',5);msg='Universal indicator turns yellow-orange: weakly acidic CO₂.';}else msg='No change.';}
      else msg='No change: the gas is neutral.';}
    toast(msg);note(c,msg);commit();renderAll();}}

/* =====================================================================
   AS LEVEL APPARATUS
   ===================================================================== */
register({id:'hotplate',name:'Hot plate / stirrer',cat:'heat',tags:[],z:2,w:130,h:44,mass:2200,defaults:{on:false,set:80},
  controls:[{key:'on',type:'toggle',label:'Heater',on:'On',off:'Off'},{key:'set',type:'range',label:'Set temperature',min:20,max:300,step:5,unit:'°C'}],
  mounts:(it,w,h)=>[{type:'surface',x1:-w/2+12,x2:w/2-12,y:h,accepts:['container','tube','surface-ok']}],
  draw(w,h,it){return `<rect class="g-device" x="0" y="8" width="${w}" height="${h-8}" rx="6"/><rect x="8" y="0" width="${w-16}" height="9" rx="3" style="fill:${it.state.on?'#d9623b':'var(--metal)'};stroke:var(--metal-edge)"/>
    <rect class="g-lcd" x="12" y="18" width="50" height="17" rx="3"/><text class="g-lcdtext" x="58" y="30.5" text-anchor="end">${it.state.on?it.state.set+'°C':'--'}</text><circle class="g-btn" cx="${w-28}" cy="26" r="9"/>`;},
  readout:it=>[['Heater',it.state.on?'on, set to '+it.state.set+' °C':'off']],
  use:'Heats a beaker or flask without a flame, up to a set temperature.',
  tip:'Use it (or a heating mantle or water bath) for ethanol and other flammable liquids instead of a Bunsen burner.'});
register({id:'mantle',name:'Heating mantle',cat:'heat',tags:[],z:6,w:116,h:66,mass:1500,defaults:{on:false,set:120},
  controls:[{key:'on',type:'toggle',label:'Heater',on:'On',off:'Off'},{key:'set',type:'range',label:'Set temperature',min:20,max:250,step:5,unit:'°C'}],
  mounts:(it,w,h)=>[{type:'surface',x1:-6,x2:6,y:22,accepts:['container'],behind:true}],
  draw(w,h,it){return `<path class="g-device" d="M4,6 Q${w/2},${h*0.62} ${w-4},6 L${w-2},${h-6} Q${w-2},${h} ${w-8},${h} L8,${h} Q2,${h} 2,${h-6} Z"/>
    <path d="M10,9 Q${w/2},${h*0.5} ${w-10},9" style="fill:none;stroke:${it.state.on?'#d9623b':'var(--device-edge)'};stroke-width:3"/>
    <circle class="g-btn" cx="${w-18}" cy="${h-14}" r="6"/><text class="g-tiny" x="16" y="${h-10}">${it.state.on?it.state.set+' °C':'off'}</text>`;},
  readout:it=>[['Heater',it.state.on?'on, set to '+it.state.set+' °C':'off']],
  use:'Heats a round-bottom flask evenly and safely, with no flame. The usual heat source for reflux and distillation.',
  tip:'Drop a round-bottom flask into it. Add anti-bumping granules to the flask first.'});
register({id:'icebath',name:'Ice bath',cat:'heat',tags:[],z:2,w:150,h:66,mass:1200,
  mounts:(it,w,h)=>[{type:'surface',x1:-w/2+14,x2:w/2-14,y:h-10,accepts:['container','tube'],behind:true}],
  draw(w,h){let ice='';[[18,22],[40,30],[70,20],[100,28],[124,21]].forEach(([x,y])=>ice+=`<rect x="${x}" y="${y}" width="16" height="13" rx="3" style="fill:#f2fbff;stroke:#9cc4de;stroke-width:1"/>`);
    return `<rect class="g-water" x="3" y="16" width="${w-6}" height="${h-19}"/>${ice}<path class="g-glass" style="fill:none" d="M0,6 L0,${h-3} Q0,${h} 3,${h} L${w-3},${h} Q${w},${h} ${w},${h-3} L${w},6"/>`;},
  readout:()=>[['Temperature','about 0 °C']],
  use:'Cools a reaction mixture or collects a volatile product (for example ethanal, which boils at 21 °C).',
  tip:'Stand the receiving flask in ice so a low-boiling distillate does not evaporate.'});
register({id:'reflux',name:'Reflux condenser',cat:'separate',tags:['stopper','clampable'],z:6,w:34,h:210,mass:220,plug:{dx:0,depth:12},
  draw(w,h){const cx=w/2;return `<rect class="g-glass" x="${cx-4}" y="0" width="8" height="${h}" rx="2"/><rect class="g-glass" x="${cx-11}" y="26" width="22" height="${h-70}" rx="8"/>
    <rect class="g-water" x="${cx-9}" y="28" width="18" height="${h-74}" rx="7"/><rect class="g-glass" x="${cx+10}" y="${h-56}" width="12" height="7" rx="2"/><rect class="g-glass" x="${cx-22}" y="32" width="12" height="7" rx="2"/>
    <text class="g-tiny" x="${cx+12}" y="${h-60}">in</text><text class="g-tiny" x="${cx-24}" y="29">out</text>`;},
  use:'Fits vertically on top of a flask. Vapour condenses and runs back, so you can heat a volatile mixture for a long time without losing it (heating under reflux).',
  tip:'Water in at the bottom, out at the top. Never put a stopper on top: the system must be open to the air.'});
register({id:'stillhead',name:'Still head',cat:'separate',tags:['stopper'],z:6,w:76,h:60,mass:60,plug:(it,w)=>({dx:12-w/2,depth:10}),orient:['mirror'],
  draw(w,h){return `<rect class="g-glass" x="6" y="0" width="12" height="${h}" rx="2"/><path class="g-tube-o" d="M18,14 L${w-4},${h-14}"/><path class="g-tube-i" d="M18,14 L${w-4},${h-14}"/>
    <rect class="g-darkm" x="4" y="0" width="16" height="6" rx="2"/>`;},
  use:'Sits on top of the distillation flask. Its side arm carries vapour to the Liebig condenser; a thermometer goes in the top.',
  tip:'Put the thermometer bulb level with the side arm: it then reads the boiling point of what is distilling.'});
register({id:'dropfun',name:'Dropping funnel',cat:'separate',tags:['stopper','clampable','container'],z:6,w:44,h:156,mass:90,plug:{dx:0,depth:12},defaults:{tap:false},
  controls:[{key:'tap',type:'toggle',label:'Tap',on:'Open',off:'Closed'}],
  draw(w,h,it){const cx=w/2,b=h*0.62,yt=h*0.72;
    return `<path class="g-glass" d="M${cx-2.5},${b} L${cx-2.5},${h} L${cx+2.5},${h} L${cx+2.5},${b} Z"/>
    <path class="g-glass" d="M${cx-5},10 L${cx-18},24 L${cx-18},${b-14} L${cx-3},${b} L${cx+3},${b} L${cx+18},${b-14} L${cx+18},24 L${cx+5},10 Z"/><rect class="g-glass" x="${cx-4}" y="0" width="8" height="11" rx="2"/>
    ${it.state.tap?`<rect class="g-tap" x="${cx-1.5}" y="${yt-9}" width="3" height="18" rx="1.5"/>`:`<rect class="g-tap" x="${cx-11}" y="${yt-1.5}" width="22" height="3" rx="1.5"/>`}`;},
  liquid(w,h){const cx=w/2,b=h*0.62;return {d:`M${cx-16.5},24 L${cx-16.5},${b-14} L${cx-2.5},${b-1} L${cx+2.5},${b-1} L${cx+16.5},${b-14} L${cx+16.5},24 Z`,top:24,bottom:b-1};},
  use:'Adds a liquid slowly to a reaction flask, a drop at a time, e.g. to control an exothermic reaction.',
  tip:'Fit it into the neck of the flask, fill it, then open the tap.'});
register({id:'buchner',name:'Büchner flask and funnel',cat:'separate',tags:['surface-ok','container'],z:5,w:96,h:170,mass:420,defaults:{residue:[]},
  draw(w,h,it){const cx=w/2,ft=58;let res='';const R=it.state.residue||[],m=R.reduce((s,e)=>s+e.a,0);
    if(m>0)res=`<ellipse cx="${cx}" cy="14" rx="${Math.min(30,10+m*8)}" ry="4" style="fill:${CHEM[R[0].c]?.col||'#ccc'}"/>`;
    return `<path class="g-glass" d="M${cx-9},${ft} L${cx-9},${ft+20} L4,${h-8} Q2,${h-1} 9,${h-1} L${w-9},${h-1} Q${w-2},${h-1} ${w-4},${h-8} L${cx+9},${ft+20} L${cx+9},${ft}"/>
    <path class="g-tube-o" d="M${cx+9},${ft+30} L${w},${ft+24}"/><path class="g-tube-i" d="M${cx+9},${ft+30} L${w},${ft+24}"/>
    <path class="g-porc" d="M${cx-34},8 L${cx+34},8 L${cx+28},34 L${cx+5},40 L${cx+5},${ft+8} L${cx-5},${ft+8} L${cx-5},40 L${cx-28},34 Z"/><rect class="g-bung" x="${cx-11}" y="${ft-4}" width="22" height="12" rx="2"/>${res}`;},
  liquid(w,h){const cx=w/2,ft=58;return {d:`M${cx-7.5},${ft+22} L5.5,${h-8} Q3.5,${h-2.5} 9,${h-2.5} L${w-9},${h-2.5} Q${w-3.5},${h-2.5} ${w-5.5},${h-8} L${cx+7.5},${ft+22} Z`,top:ft+22,bottom:h-2.5};},
  use:'Vacuum (suction) filtration: much faster than gravity filtration, and it leaves the crystals almost dry. Used in recrystallisation.',
  tip:'Pour the mixture in: the solid stays on the filter paper in the funnel, the filtrate collects in the flask. Wash the crystals with a little ice-cold solvent.'});
register({id:'cuvette',name:'Cuvette',cat:'measure',tags:['cuvette','container','surface-ok'],z:6,w:14,h:42,mass:3,
  draw(w,h){return `<rect class="g-plastic" x="0" y="0" width="${w}" height="${h}" rx="1.5"/><rect class="g-darkm" x="0" y="0" width="${w}" height="5" rx="1"/>`;},
  liquid(w,h){return {d:`M1.5,6 L${w-1.5},6 L${w-1.5},${h-1.5} L1.5,${h-1.5} Z`,top:6,bottom:h-1.5};},
  use:'Holds a solution in a colorimeter.',tip:'Fill it about three-quarters full and handle it by the ribbed sides.'});
register({id:'colorimeter',name:'Colorimeter',cat:'measure',tags:['surface-ok'],z:4,w:104,h:58,mass:900,
  mounts:(it,w,h)=>[{type:'slot',x:-w/2+26,y:h-8,accepts:['cuvette'],behind:true}],
  draw(w,h,it,ctx){const c=ctx.childrenOf?ctx.childrenOf(it)[0]:null,a=c&&c.contents?.length?Math.min(2,analyse(c).absorb):null;
    return `<rect class="g-device" x="0" y="0" width="${w}" height="${h}" rx="6"/><rect class="g-hole" x="16" y="2" width="20" height="10" rx="2"/>
    <rect class="g-lcd" x="44" y="14" width="${w-52}" height="18" rx="3"/><text class="g-lcdtext" x="${w-12}" y="27" text-anchor="end">${a==null?'-.---':a.toFixed(3)}</text><text class="g-tiny" x="${w-30}" y="${h-10}" text-anchor="middle">ABS</text>`;},
  readout:(it,ctx)=>{const c=ctx.childrenOf(it)[0];return [['Absorbance',c&&c.contents?.length?Math.min(2,analyse(c).absorb).toFixed(3):'no cuvette']];},
  use:'Measures how much light a coloured solution absorbs. Absorbance is proportional to concentration, so it can follow a reaction rate.',
  tip:'Zero it with a cuvette of water. Use a filter of the complementary colour.'});
const MP={benzoic:['Benzoic acid',122,0.5],benzoicimp:['Impure benzoic acid',114,8],aspirin:['Aspirin',136,0.5]};
register({id:'mpapp',name:'Melting-point apparatus',cat:'measure',tags:['surface-ok'],z:4,w:112,h:84,mass:1800,defaults:{sample:'benzoic',temp:20},
  controls:[{key:'sample',type:'seg',label:'Sample in capillary',options:Object.entries(MP).map(([k,v])=>[k,v[0]])},{key:'temp',type:'range',label:'Heater temperature',min:20,max:180,step:0.5,unit:'°C'}],
  draw(w,h,it){const m=MP[it.state.sample],T=it.state.temp,st=T<m[1]-m[2]?'solid':T<m[1]+0.2?'melting':'liquid';
    return `<rect class="g-device" x="0" y="0" width="${w}" height="${h}" rx="6"/><circle cx="30" cy="34" r="16" style="fill:#2b3036;stroke:var(--device-edge)"/>
    <rect x="28" y="20" width="4" height="22" rx="1" style="fill:${st==='solid'?'#f2f2f0':st==='melting'?'#e8e2c8':'#c9dceb'}"/>
    <rect class="g-lcd" x="54" y="14" width="${w-62}" height="18" rx="3"/><text class="g-lcdtext" x="${w-12}" y="27" text-anchor="end">${T.toFixed(1)}°C</text>
    <text class="g-tiny" x="58" y="${h-14}">${st}</text>`;},
  readout:it=>{const m=MP[it.state.sample],T=it.state.temp;return [['Temperature',T.toFixed(1)+' °C'],['Sample',T<m[1]-m[2]?'solid':T<m[1]+0.2?'melting…':'melted (liquid)'],['Melting point',m[2]>1?`${m[1]-m[2]}–${m[1]} °C (a range)`:'sharp, at '+m[1]+' °C']];},
  use:'Finds the melting point of a solid in a capillary tube. A pure solid melts sharply; an impure one melts lower and over a range.',
  tip:'Heat quickly to about 10 °C below the expected value, then slowly (about 1–2 °C per minute).'});
register({id:'weighbottle',name:'Weighing bottle',cat:'measure',tags:['surface-ok','container'],z:5,w:32,h:36,mass:14,
  draw(w,h){return `<path class="g-glass" d="M3,8 L3,${h-3} Q3,${h} 6,${h} L${w-6},${h} Q${w-3},${h} ${w-3},${h-3} L${w-3},8"/><rect class="g-glass" x="1" y="2" width="${w-2}" height="7" rx="2"/>`;},
  liquid(w,h){return {d:`M4.5,10 L${w-4.5},10 L${w-4.5},${h-1.5} L4.5,${h-1.5} Z`,top:10,bottom:h-1.5};},
  use:'Weighing a solid accurately, by difference: weigh it full, tip the solid out, weigh it again.',tip:'The mass transferred is the difference between the two readings.'});
Object.assign(FULL,{dropfun:()=>110,buchner:()=>260,cuvette:()=>4,weighbottle:()=>16,spirit:()=>100});

/* electrodes: choose which terminal each one is wired to */
REG.electrode.defaults={term:'none'};
REG.electrode.controls=[{key:'term',type:'seg',label:'Wired to power supply',options:[['none','Not connected'],['+','+ (anode)'],['-','− (cathode)']]}];
{const d0=REG.electrode.draw;REG.electrode.draw=(w,h,it,c)=>{let s=d0(w,h,it,c);if(it.state.coat>0)s+=`<rect x="0" y="${h-Math.min(60,20+it.state.coat*40)}" width="${w}" height="${Math.min(60,20+it.state.coat*40)}" rx="2" style="fill:${it.state.coatCol};opacity:.9"/>`;
  if(it.state.term&&it.state.term!=='none')s+=`<text class="g-label7" x="${w/2}" y="-3" text-anchor="middle" style="fill:${it.state.term==='+'?'var(--term-red)':'var(--ink)'}">${it.state.term==='+'?'+':'−'}</text>`;return s;};}
REG.ammeter.readout=()=>[['Current',lastCurrent.toFixed(2)+' A']];
/* thermometer reads the liquid its bulb is in */
const tempAt=th=>{const b={x:th.x,y:th.y-5};for(const c of items){if(!isContainer(c))continue;const {w,h}=dims(c);
    if(Math.abs(b.x-c.x)<w/2&&b.y<c.y+2&&b.y>c.y-h){const A=analyse(c);if(A.V>0&&b.y>liquidTopWorld(c)-2)return c.state.temp??RT;if(A.solids.length&&b.y>c.y-12)return c.state.temp??RT;}}
  for(const k of items){if(k.type!=='stillhead'&&k.type!=='fraccol')continue;const d=dims(k);if(Math.abs(b.x-(k.x-d.w/2+12))<10&&b.y<k.y&&b.y>k.y-d.h-10){const p=k.mount&&byId(k.mount.pid);if(p){const bi=boilInfo(p);if(bi&&p.state.boil>now())return bi.bp;return Math.max(RT,(p.state.temp??RT)-25);}}}
  return RT;};
ctx.tempAt=tempAt;iconCtx.tempAt=()=>RT;
{const d0=REG.thermometer.draw;REG.thermometer.draw=(w,h,it,c)=>d0(w,h,{...it,state:{...it.state,temp:Math.max(-10,Math.min(110,c.tempAt?c.tempAt(it):RT))}},c);
  REG.thermometer.readout=it=>{const T=tempAt(it);return [['Reading',T>110?'off the scale (above 110 °C)':T.toFixed(1)+' °C'],['Range','−10 to 110 °C'],['Read to','±0.5 °C']];};
  REG.thermometer.tip='Put the bulb in the liquid to read its temperature; in a still head, level with the side arm, it reads the boiling point of the vapour.';}
/* flame colour after a flame test */
{const d0=REG.bunsen.draw;REG.bunsen.draw=(w,h,it,c)=>{let s=d0(w,h,it,c);if(it.state.lit&&it.state.tint&&it.state.tintT>now())s=s.replace(/class="fl-(blue|cone|half|yellow|yellow-in)"/g,`style="fill:${it.state.tint};opacity:.85"`);return s;};}
{const d0=REG.indpaper.draw;REG.indpaper.draw=(w,h,it,c)=>it.state.col?`<rect x="0" y="0" width="${w}" height="${h}" rx="1.2" style="fill:${it.state.col};stroke:var(--porc-edge);stroke-width:.5"/>`:d0(w,h,it,c);}
{const d0=REG.nichrome.draw;REG.nichrome.draw=(w,h,it,c)=>d0(w,h,it,c)+(it.state.sample?`<circle cx="${w-5.5}" cy="6" r="3" style="fill:${FLAME[it.state.sample][0]};opacity:.7"/>`:'');}
{const d0=REG.funnel.draw;REG.funnel.draw=(w,h,it,c)=>{let s=d0(w,h,it,c);const R=it.state.residue||[],m=R.reduce((t,e)=>t+e.a,0);
  if(m>0&&it.state.paper)s+=`<path d="M${w/2-Math.min(14,5+m*6)},${h*0.38} L${w/2},${h*0.46} L${w/2+Math.min(14,5+m*6)},${h*0.38} Z" style="fill:${CHEM[R[0].c]?.col||'#ccc'}"/>`;return s;};}
['testtube','boilingtube','cylinder','gasjar'].forEach(id=>{const r0=REG[id].readout;REG[id].readout=(it,c)=>{const base=r0?r0(it,c):[];const H=it.state.held;
  if(H){const tot=Object.values(H).reduce((s,v)=>s+v,0);if(tot>1e-6)base.push(['Gas collected',Math.round(tot*24000)+' cm³ ('+Object.keys(H).filter(k=>H[k]>1e-6).map(k=>CHEM[k].f).join(', ')+')']);}return base;};});
REG.syringe.readout=it=>[['Volume',(it.state.vol||0).toFixed(0)+' cm³'],['Capacity','100 cm³'],['Read to','±1 cm³']];
REG.syringe.tip='Connect it to a delivery tube: the gas from the reaction pushes the plunger out. Take readings at regular time intervals.';
REG.spirit.use='Burns a liquid fuel (an alcohol). Weigh it before and after to find the mass of fuel burned, and heat water in a copper can above it to find the enthalpy change of combustion.';
REG.spirit.tip='Pour a different alcohol in to compare fuels: methanol, ethanol, propan-1-ol, butan-1-ol. Keep the cap on when it is not lit.';

/* =====================================================================
   OVERRIDES: analysis, drawing contents, pouring and the inspector
   ===================================================================== */
function abPerMol(k){if(ION[k])return ION[k].ab||null;const C=CHEM[k];if(!C||!C.ab)return null;
  if(C.st==='aq'&&C.conc){const f=1/C.conc,o={pos:(C.ab.pos||0)*f,neg:(C.ab.neg||0)*f,sys:{}};for(const s in C.ab.sys||{})o.sys[s]=C.ab.sys[s]*f;return o;}return C.ab;}
const HALO_ORG={Br2:'#d4561c',I2:'#8e2fb0',Cl2:'#e3ec9a'};
analyse=function(it){const key=JSON.stringify(it.contents||[]),hit=aCache.get(it);if(hit&&hit.key===key)return hit.res;
  const cs=it.contents||[];let Vaq=0,Vorg=0,mass=0,orgM=0;const org=[],solids=[],ppts=[],sp={pos:0,neg:0,sys:{}},cols=[],inds=[],dissolved=[],halo={};
  const addAb=(ab,k)=>{if(!ab)return;sp.pos+=(ab.pos||0)*k;sp.neg+=(ab.neg||0)*k;for(const s in ab.sys||{})sp.sys[s]=(sp.sys[s]||0)+ab.sys[s]*k;};
  const starch=cs.some(e=>e.c==='starch'&&e.a>0);
  cs.forEach(e=>{const C=CHEM[e.c];if(!C)return;if(C.st==='aq'||C.st==='l'){if(C.imm){Vorg+=e.a;orgM+=e.a*(C.dens||1);org.push(e);}else Vaq+=e.a;mass+=e.a*(C.dens||1);}
    else if(C.st==='s')mass+=e.a;else if(e.c==='_ions')mass+=e.m||0;});
  const Vl=Math.max(1e-9,Vaq/1000);
  cs.forEach(e=>{const C=CHEM[e.c];if(!C)return;
    if(e.c==='_ions'){if(Vaq<=0)return;for(const k in e.ions){const n=e.ions[k];if(!(n>1e-12))continue;addAb(abPerMol(k),n);const I=ION[k];
        if(I&&I.col){if(HALO_ORG[k])halo[k]=(halo[k]||0)+n;else cols.push([I.col,I.tm*n/Vl]);}}return;}
    if((C.st==='aq'||C.st==='l')&&!C.imm){addAb(C.ab,e.a/1000);
      if(C.ind)inds.push([C.ind,e.a]);
      else if(C.ion&&(C.ion.I2||C.ion.Br2||C.ion.Cl2)&&C.conc){const k=C.ion.I2?'I2':C.ion.Br2?'Br2':'Cl2';halo[k]=(halo[k]||0)+e.a/1000*C.conc*C.ion[k];}
      else if(C.tv)cols.push([C.col,C.tv*e.a/Vaq]);}
    else if(C.st==='s'){if(C.sol&&Vaq>0){const mol=e.a/C.M;addAb(C.ab,mol);dissolved.push(e);if(C.acol)cols.push([C.acol,C.tm*mol/Vl]);}else{solids.push(e);if(C.ppt&&!['agmirror','cufine','agfine','pbmetal','sppt'].includes(e.c)||e.c==='sppt')ppts.push(e);}}
    else if(C.st==='g'&&Vaq>0)addAb(C.ab,e.a);});
  const orgExtra=[];
  for(const k in halo){const n=halo[k];
    if(k==='I2'&&starch&&Vaq>0){cols.push(['#141a4f',5000*n/Vl]);continue;}
    if(Vorg>0){orgExtra.push([HALO_ORG[k],ION[k].tm*n/(Vorg/1000)*0.7]);if(Vaq>0)cols.push([ION[k].col,ION[k].tm*n/Vl*0.06]);}
    else if(Vaq>0)cols.push([ION[k].col,ION[k].tm*n/Vl]);}
  const pH=Vaq>0?solvePH({V:Vl,...sp}):null;
  if(pH!=null)inds.forEach(([ind,v])=>{const c=indColour(ind,pH);if(c)cols.push([c,700*v/Vaq]);});
  const mix=(list,base)=>{let W=1,r=base[0],g=base[1],b=base[2];list.forEach(([c,w])=>{const q=hex2rgb(c);r+=q[0]*w;g+=q[1]*w;b+=q[2]*w;W+=w;});
    const s=W-1;return `rgba(${Math.round(r/W)},${Math.round(g/W)},${Math.round(b/W)},${(0.34+0.56*s/(1+s)).toFixed(2)})`;};
  let cloud=0,cloudCol=null;if(ppts.length&&Vaq+Vorg>0){let W=0,r=0,g=0,b=0;ppts.forEach(e=>{const C=CHEM[e.c],c=(e.a/C.M)/((Vaq+Vorg)/1000);W+=c;const q=hex2rgb(C.col);r+=q[0]*c;g+=q[1]*c;b+=q[2]*c;});
    cloud=Math.min(0.92,1-Math.exp(-W*45));cloudCol=`rgb(${Math.round(r/W)},${Math.round(g/W)},${Math.round(b/W)})`;}
  const res={Vaq,Vorg,V:Vaq+Vorg,mass,pH,solids,ppts,dissolved,inds,aqCol:mix(cols,[205,226,242]),absorb:0.03*cols.reduce((s,c)=>s+c[1],0),cloud,cloudCol,
    orgCol:org.length?mix(org.map(e=>[CHEM[e.c].col,4*e.a/Vorg]).concat(orgExtra),[236,240,232]):null,orgDense:Vorg>0&&orgM/Vorg>1};
  aCache.set(it,{key,res});return res;};
contentsSVG=function(it,w,h){const d=REG[it.type];if(!d.liquid||!it.contents?.length)return '';
  const A=analyse(it),L=d.liquid(w,h),H=L.bottom-L.top,full=fullOf(it);if(A.V<=0&&!A.solids.length)return '';
  const yT=L.bottom-H*Math.min(1,A.V/full),fO=H*Math.min(1,A.Vorg/full),fQ=H*Math.min(1,A.Vaq/full);
  let aq0,aq1,or0,or1;if(A.orgDense){or1=L.bottom;or0=L.bottom-fO;aq1=or0;aq0=yT;}else{aq1=L.bottom;aq0=L.bottom-fQ;or1=aq0;or0=yT;}
  const rect=(y0,y1,fill,extra='')=>`<rect x="-5" y="${y0.toFixed(2)}" width="${w+10}" height="${Math.max(0,y1-y0).toFixed(2)}" style="fill:${fill}${extra}"/>`;
  let s=`<clipPath id="cl-${it.id}"><path d="${L.d}"/></clipPath><g clip-path="url(#cl-${it.id})">`;
  if(A.Vaq>0){s+=rect(aq0,aq1,A.aqCol);if(A.cloud>0.01)s+=rect(aq0,aq1,A.cloudCol,`;opacity:${A.cloud.toFixed(2)}`);}
  if(A.Vorg>0)s+=rect(or0,or1,A.orgCol)+`<line x1="-5" y1="${(A.orgDense?or0:or1).toFixed(2)}" x2="${w+5}" y2="${(A.orgDense?or0:or1).toFixed(2)}" style="stroke:var(--water-edge);stroke-width:.6"/>`;
  if(A.solids.length){let rnd=hash(it.id),k=0;const R=()=>((rnd=Math.imul(rnd^rnd>>>15,2246822507)>>>0)/4294967296);
    const x0=w*0.2,x1=w*0.8,per=Math.max(3,Math.floor((x1-x0)/3.1));
    A.solids.forEach(e=>{const C=CHEM[e.c],n=C.ppt?Math.min(50,Math.max(3,Math.ceil(e.a/C.M*5000))):Math.min(70,Math.max(2,Math.ceil(e.a*(C.cat==='metal'?6:10))));
      if(e.c==='agmirror'){s+=`<path d="${L.d}" style="fill:none;stroke:#aeb3b8;stroke-width:${Math.min(4,1+e.a*20).toFixed(1)}"/>`;return;}
      for(let i=0;i<n;i++,k++){const x=x0+(k%per+R()*0.6)*3.1,y=L.bottom-2-Math.floor(k/per)*2.6-R()*0.8;
        s+=`<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${C.cat==='metal'?1.9:C.ppt?1.2:1.6}" style="fill:${e.col||C.col};stroke:rgba(0,0,0,.25);stroke-width:.3"/>`;}});}
  if(it.state.fizz>now()&&A.V>0){for(let i=0;i<7;i++){const x=w*0.25+((hash(it.id+i)%100)/100)*w*0.5,y=L.bottom-4-((i*13)%Math.max(6,L.bottom-yT-6));
    s+=`<circle class="bub" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.2+i%3*0.5).toFixed(1)}" style="fill:rgba(255,255,255,.75);stroke:rgba(80,120,160,.5);stroke-width:.4;animation-delay:${(i*0.15).toFixed(2)}s"/>`;}}
  s+='</g>';
  if(it.state.boil>now())s+=`<g class="steam"><path d="M${w*0.4},${L.top-2} q-5,-8 0,-16 q5,-8 0,-16" /><path d="M${w*0.6},${L.top-4} q5,-8 0,-16 q-5,-8 0,-14"/></g>`;
  return s;};
function isFilter(t){return t&&((t.type==='funnel'&&t.state.paper&&t.variant!=='small')||t.type==='buchner');}
function filterDest(f){if(f.type==='buchner')return f;if(f.mount&&mountOf(f)?.type==='neck'){const p=byId(f.mount.pid);if(p&&isContainer(p))return p;}return containerBelow(f);}
transfer=function(from,to,vol,bottomFirst){const A=analyse(from);if(A.V<=0)return 0;
  const filt=to&&isFilter(to),dest=filt?filterDest(to):to;if(filt&&!dest){toast('Put a beaker or flask under the funnel first.');return 0;}
  const room=dest?fullOf(dest)-analyse(dest).V:Infinity;vol=Math.min(vol,A.V,room);if(vol<=0)return 0;
  let va,vo;if(bottomFirst&&A.Vorg>0&&A.Vaq>0){if(A.orgDense){vo=Math.min(vol,A.Vorg);va=vol-vo;}else{va=Math.min(vol,A.Vaq);vo=vol-va;}}else{va=vol*A.Vaq/A.V;vo=vol-va;}
  const fa=A.Vaq>0?va/A.Vaq:0,fo=A.Vorg>0?vo/A.Vorg:0,diss=new Set(A.dissolved.map(e=>e.c));
  let C0=0,T0=0;if(dest){C0=heatCap(dest);T0=dest.state.temp??RT;}const Tf=from.state.temp??RT;
  const res=filt?(to.state.residue=to.state.residue||[]):null;let toRes=0;
  from.contents.forEach(e=>{const C=CHEM[e.c];
    if(e.c==='_ions'){if(fa>0&&dest){const Ld=loose(dest);for(const k in e.ions){const m=e.ions[k]*fa;e.ions[k]-=m;Ld.ions[k]=(Ld.ions[k]||0)+m;}const mm=(e.m||0)*fa;e.m=(e.m||0)-mm;Ld.m=(Ld.m||0)+mm;}return;}
    if(!C)return;let f=0,rs=false;
    if(C.st==='aq'||C.st==='l')f=C.imm?fo:fa;else if(C.st==='g')f=fa;else if(diss.has(e.c))f=fa;else if(C.ppt){f=fa;rs=filt;}else if(filt){f=fa;rs=true;}
    if(f>0){const m=e.a*f;e.a-=m;if(rs){toRes+=m;const r=res.find(x=>x.c===e.c);if(r)r.a+=m;else res.push({c:e.c,a:m});}
      else if(dest){dest.contents=dest.contents||[];const t=dest.contents.find(x=>x.c===e.c);if(t)t.a+=m;else dest.contents.push({c:e.c,a:m,...(e.col?{col:e.col}:{})});}}});
  from.contents=from.contents.filter(e=>e.c==='_ions'||e.a>1e-7);cleanup(from);
  if(dest){const C1=heatCap(dest);dest.state.temp=(C0*T0+(C1-C0)*Tf)/Math.max(1e-6,C1);react(dest,0);cleanup(dest);}
  if(filt&&toRes>0)note(to,'The solid stays on the filter paper (the residue); the clear filtrate runs through.');
  flushNotes();return vol;};
pourChem=(f=>function(c,chemId,amt){const C0=heatCap(c),T0=c.state.temp??RT,got=f(c,chemId,amt);
  if(got>0){const C1=heatCap(c);c.state.temp=(C0*T0+(C1-C0)*RT)/Math.max(1e-6,C1);react(c,0);cleanup(c);flushNotes();}return got;})(pourChem);
chemInspector=(f=>it=>f(it).replace('IGCSE notes','Notes'))(chemInspector);
const fmtSpecies=(k,n)=>`<div class="crow"><span>${esc(ionName(k))}</span><span>${n<0.001?(n*1000).toFixed(2)+' mmol':n.toFixed(4)+' mol'}</span></div>`;
contentsHTML=function(it){const A=analyse(it),cs=(it.contents||[]).filter(e=>e.c!=='_ions'),L=looseOf(it),T=it.state.temp??RT;let h='';
  const log=(it.state.log||[]).slice(-4).reverse();
  h+=`<div class="i-sec"><div class="i-lab">Temperature</div><p><b style="font-family:var(--f-num)">${T.toFixed(1)} °C</b>${it.state.boil>now()?' · boiling':''}</p></div>`;
  if(log.length)h+=`<div class="i-sec"><div class="i-lab">What you see</div>${log.map((l,i)=>`<p${i?' class="tip"':''}>${esc(l.m)}</p>`).join('')}</div>`;
  h+=`<div class="i-sec"><div class="i-lab">Contents</div>`;
  if(!cs.length&&!(L&&Object.keys(L.ions).length))return h+`<p class="muted">Empty. Drag a chemical from the Chemicals tab onto it, or select it and tap a chemical.</p></div>`;
  h+=`<div class="clist">${cs.map(e=>{const C=CHEM[e.c];const dis=C.st==='s'&&A.dissolved.some(x=>x.c===e.c);
    return `<div class="crow"><span><i class="swatch" style="background:${C.ind&&A.pH!=null?(indColour(C.ind,A.pH)||'#f2f2f2'):(e.col||(C.acol&&dis?C.acol:C.col))}"></i>${esc(C.n)}${C.st==='s'?(dis?' (dissolved)':C.ppt?' (precipitate)':''):''}</span><span>${fmtAmt(C,e.a)}</span></div>`;}).join('')}</div>`;
  if(L&&Object.keys(L.ions).length){const list=Object.entries(L.ions).filter(([k,n])=>n>1e-7&&k!=='H'&&k!=='OH').sort((a,b)=>b[1]-a[1]).slice(0,8);
    if(list.length)h+=`<div class="i-lab" style="margin-top:6px">${A.Vaq>0?'Dissolved (made by reactions)':'Left behind'}</div><div class="clist">${list.map(([k,n])=>fmtSpecies(k,n)).join('')}</div>`;}
  h+=`<div class="crow" style="margin-top:4px"><span class="muted">Liquid volume</span><span>${A.V.toFixed(1)} cm³</span></div>`;
  if(A.Vorg>0&&A.Vaq>0)h+=`<p class="muted">Two layers: the organic liquid is ${A.orgDense?'denser, so it sinks below':'less dense, so it floats on'} the water layer.</p>`;
  if(A.cloud>0.05)h+=`<p class="muted">Cloudy (${Math.round(A.cloud*100)}%): ${A.cloud>0.6?'a cross drawn under the flask can no longer be seen.':'a cross drawn under the flask is still visible.'}</p>`;
  const nonppt=A.solids.filter(e=>!CHEM[e.c].ppt);if(nonppt.length)h+=`<p class="muted">Undissolved solid at the bottom${A.Vaq>0?' (insoluble, or it needs to react first)':''}.</p>`;
  const G=it.state.gas;if(G){const list=Object.keys(G).filter(k=>G[k]>1e-7);if(list.length)h+=`<p class="muted">Gas given off so far: ${list.map(k=>CHEM[k].f+' '+Math.round(G[k]*24000)+' cm³').join(', ')}.</p>`;}
  h+='</div>';
  if(A.pH!=null){h+=`<div class="i-sec"><div class="i-lab">pH (calculated)</div>${phBlock(A.pH)}`;
    A.inds.forEach(([ind])=>{const C=CHEM_ORDER.map(k=>CHEM[k]).find(c=>c.ind===ind);h+=`<p class="muted">${esc(C.n)} is <b>${indName(ind,A.pH)}</b>.</p>`;});h+='</div>';}
  if(it.type==='burette'){const t=containerBelow(it);h+=`<div class="i-sec"><div class="i-lab">Run out of the tap</div>
    ${t?`<p class="muted">Into <b>${esc(nameOf(t))}</b> below.</p>`:`<p class="muted">Put a flask under the tap first.</p>`}
    <div class="seg">${[[0.05,'1 drop'],[0.1,'0.10 cm³'],[1,'1.00 cm³'],[5,'5.00 cm³']].map(([a,l])=>`<button type="button" class="act" data-run="${a}"${t&&A.V>0?'':' disabled'}>${l}</button>`).join('')}</div></div>`;}
  if(it.type==='sepfunnel'){const t=containerBelow(it);h+=`<div class="i-sec"><div class="i-lab">Run off the bottom layer</div>
    ${!it.state.tap?`<p class="muted">Open the tap first.</p>`:t?`<p class="muted">Into <b>${esc(nameOf(t))}</b> below.</p>`:`<p class="muted">Put a beaker or flask under the tap.</p>`}
    <div class="seg">${[[1,'1 cm³'],[5,'5 cm³'],[20,'20 cm³']].map(([a,l])=>`<button type="button" class="act" data-drain="${a}"${it.state.tap&&t&&A.V>0?'':' disabled'}>${l}</button>`).join('')}</div></div>`;}
  const others=items.filter(o=>o!==it&&(isContainer(o)||isFilter(o)));
  if(A.V>0){h+=`<div class="i-sec"><div class="i-lab">Pour into another container</div>
    <div class="seg">${[1,5,10,25,'all'].map(a=>`<button type="button" data-pamt="${a}" aria-pressed="${String(pourAmt)===String(a)}">${a==='all'?'All':a+' cm³'}</button>`).join('')}</div>
    ${others.length?`<div class="prow"><select class="tsel" id="pourTo">${others.map(o=>`<option value="${o.id}">${esc(nameOf(o))}${isFilter(o)&&o.type==='funnel'?' (filter)':''}</option>`).join('')}</select><button type="button" class="act" data-act2="pour">Pour</button></div>`:`<p class="muted">Put another container on the workspace to pour into it.</p>`}</div>`;}
  h+=`<div class="i-sec"><div class="acts"><button type="button" class="act del" data-act2="empty">Empty it</button></div></div>`;
  return h;};
renderInspector=(f=>function(){f();const it=sel(),el=$('#insp');
  if(!it){const ul=el.querySelector('ul.howto');if(ul)ul.insertAdjacentHTML('beforeend',`<li>Reactions happen by themselves: precipitates, fizzing, colour changes and temperature changes. Check "What you see" in a container's panel.</li>
    <li>Heat with a Bunsen under a tripod and gauze, a water bath, a hot plate or a heating mantle. Thermometers read the liquid their bulb is in.</li>
    <li>Gas tests: fit a delivery tube to the flask and lead it into limewater, a gas syringe or an upside-down tube in the trough. Or hold a lit or glowing splint, or damp litmus, at the mouth.</li>
    <li>Flame test: drop the nichrome loop into the sample, then into a blue Bunsen flame.</li>
    <li>Electrolysis: put two electrodes in the electrolyte, wire one to + and one to −, and switch the power supply on.</li>
    <li>Use the ×1 / ×5 / ×20 button to speed up slow experiments.</li>`);return;}
  if((it.type==='funnel'||it.type==='buchner')&&it.state.residue?.length){const R=it.state.residue.filter(e=>e.a>1e-7);if(R.length)el.insertAdjacentHTML('afterbegin',`<div class="i-sec"><div class="i-lab">Residue on the filter paper</div><div class="clist">${R.map(e=>`<div class="crow"><span><i class="swatch" style="background:${CHEM[e.c].col}"></i>${esc(CHEM[e.c].n)}</span><span>${fmtAmt(CHEM[e.c],e.a)}</span></div>`).join('')}</div></div>`);}})(renderInspector);
$('#insp').addEventListener('click',e=>{const b=e.target.closest('button');const it=sel();if(b&&it&&b.dataset.act2==='empty'){it.state.log=[];it.state.noted={};it.state.gas=null;it.state.held=null;it.state.recent=null;it.state.temp=RT;}},true);

/* =====================================================================
   TICK: heating, boiling, distillation, slow reactions, electrolysis
   ===================================================================== */
let speed=1,lastTick=now(),commitT=0,dirtyAny=false,inspT=0;
function vapourRoute(c){const k=neckChild(c);if(!k)return {mode:'open'};
  if(k.type==='reflux')return {mode:'reflux'};if(k.type==='bung')return {mode:'sealed',k};
  if(k.type==='stillhead'||k.type==='fraccol'){const cond=items.find(L=>L.type==='condenser'&&Math.hypot(L.x-k.x,L.y-k.y)<340);
    if(cond){const {w}=dims(cond),lx=cond.state.mirror?cond.x-w/2+8:cond.x+w/2-8,ly=cond.y-12;let best=null,bd=1e9;
      for(const r of items){if(r===c||!isContainer(r))continue;const d=dims(r),dx=Math.abs(r.x-lx),top=r.y-d.h;if(dx<d.w/2+40&&top>ly-60&&top<ly+200){const dd=dx+Math.abs(top-ly);if(dd<bd){bd=dd;best=r;}}}
      return {mode:'distil',dest:best};}return {mode:'open'};}
  if(k.type==='delivery'){const t=containerAt(deliveryEnd(k),c);return {mode:'distil',dest:t||null};}
  return {mode:'open'};}
function popBung(c,k){k.mount=null;k.y-=90;k.x+=24;layout();note(c,'Pressure builds up and the bung shoots out! Never heat a closed container.');}
function tick(){const t=now(),dt=Math.min(1,(t-lastTick)/1000)*speed;lastTick=t;let dirty=false;
  for(const c of items){
    if(c.type==='spirit'&&c.state.lit){const f=spiritFuel(c);if(!f){c.state.lit=false;note(c,'The burner goes out: no fuel left.');dirty=true;}else{f.a=Math.max(0,f.a-0.016*dt/(CHEM[f.c].dens||0.79));dirty=true;}}
    if(!isContainer(c))continue;
    const key0=JSON.stringify(c.contents||[]),T0=c.state.temp??RT,vis0=(c.state.fizz>t)||(c.state.boil>t);
    if(!c.contents?.length){if(Math.abs(T0-RT)>0.05){c.state.temp=T0+(RT-T0)*(1-Math.exp(-dt/30));dirty=true;}continue;}
    const A=analyse(c);
    if(A.Vaq>0)c.contents.forEach(e=>{const h=DHSOL[e.c],C=CHEM[e.c];if(h==null||!C.sol)return;const mol=e.a/C.M,dq=mol-(e.dq||0);if(Math.abs(dq)>1e-9){addHeat(c,-h*1000*dq);e.dq=mol;}});
    const ca=c.contents.find(e=>e.c==='h2so4conc');if(ca&&waterVol(c)>0.5){const mol=ca.a/1000*18,dq=mol-(ca.dq||0);if(dq>1e-9){addHeat(c,30000*dq);ca.dq=mol;if(dq>0.002)note(c,'The mixture gets very hot as the concentrated acid mixes with water.');}}
    const H=heatSources(c),Cp=heatCap(c),hasLiq=analyse(c).V>0;let T=c.state.temp??RT;
    if(H.bath!=null)T+=(H.bath-T)*(1-Math.exp(-dt/(hasLiq?28:15)));
    else if(H.P>0){if(hasLiq){T+=(H.P-(LOSSK[c.type]??0.45)*(T-RT))*dt/Cp;if(H.elec&&T>H.max)T=Math.max(H.max,T-0.5*dt);}else T+=(Math.max(RT,H.max)-T)*(1-Math.exp(-dt/7));
      if(H.flame&&c.contents.some(e=>CHEM[e.c]?.st==='l'&&CHEM[e.c].haz?.includes('F')&&e.a>0.5))note(c,'Careful: a flammable liquid near a naked flame. Use a water bath, hot plate or heating mantle.');}
    else{const k=(LOSSK[c.type]??0.45)*(c.state.lid?0.5:1);T+=hasLiq?-k*(T-RT)*dt/Cp:(RT-T)*(1-Math.exp(-dt/40));}
    c.state.temp=T;
    const bi=boilInfo(c);
    if(bi&&T>bi.bp){const excess=(T-bi.bp)*heatCap(c);c.state.temp=bi.bp;c.state.boil=t+1500;const route=vapourRoute(c),g=excess/(bi.C.st==='l'&&bi.e.c!=='water'?850:2260);
      if(route.mode==='reflux'){if(!c.state.noted?.reflux){(c.state.noted=c.state.noted||{}).reflux=1;note(c,'Heating under reflux: the vapour condenses and drips back, so nothing escapes.');}}
      else if(route.mode==='sealed')popBung(c,route.k);
      else{evaporate(c,g,bi,route.dest||null);if(route.dest&&!c.state.noted?.dist){(c.state.noted=c.state.noted||{}).dist=1;note(c,`Distilling: ${bi.C.n.toLowerCase()} boils at ${bi.bp} °C and condenses into ${nameOf(route.dest)}.`);}
        else if(!route.dest&&bi.C.st==='l'&&!c.state.noted?.lost){(c.state.noted=c.state.noted||{}).lost=1;note(c,`${bi.C.n} is boiling away into the air. Fit a reflux condenser to keep it, or a still head and condenser to collect it.`);}}
      if(c.type==='rbf'&&!has(c,'antibump')&&!c.state.noted?.bump){(c.state.noted=c.state.noted||{}).bump=1;note(c,'The liquid bumps (boils violently in bursts). Add anti-bumping granules before heating.');}}
    if(react(c,dt))dirty=true;
    if(c.type==='dropfun'&&c.state.tap&&c.mount&&mountOf(c)?.type==='neck'){const p=byId(c.mount.pid);if(p&&isContainer(p)&&analyse(c).V>0){transfer(c,p,0.8*dt,true);dirty=true;}}
    if(c.state.recent&&t-(c.state.gasT||0)>25000)c.state.recent=null;
    if(JSON.stringify(c.contents||[])!==key0||Math.abs((c.state.temp??RT)-T0)>0.02||vis0!==((c.state.fizz>t)||(c.state.boil>t)))dirty=true;}
  if(electrolysis(dt))dirty=true;
  for(const b of items)if(b.type==='bunsen'&&b.state.tint){if(b.state.tintT<t)b.state.tint=null;dirty=true;}
  if(dirty){renderStage();dirtyAny=true;const s=sel(),ae=document.activeElement;
    if(s&&t-inspT>700&&!(ae&&/^(SELECT|INPUT)$/.test(ae.tagName)&&$('#insp').contains(ae))){inspT=t;renderInspector();}}
  if(dirtyAny&&t-commitT>2500){commitT=t;dirtyAny=false;commit();}
  flushNotes();}
setInterval(tick,250);
/* gas & flame tests: run when a probe is dropped */
let downInfo=null;
svg.addEventListener('pointerdown',()=>{downInfo=drag?{id:drag.it.id,x:drag.it.x,y:drag.it.y}:null;});
svg.addEventListener('pointerup',()=>{const d=downInfo;downInfo=null;if(!d)return;const it=byId(d.id);if(!it||(Math.abs(it.x-d.x)<2&&Math.abs(it.y-d.y)<2))return;
  if(['splint','indpaper','nichrome'].includes(it.type))probe(it);});
/* speed button, header and CSS */
{const tools=$('#bClear').parentElement;tools.insertAdjacentHTML('afterbegin','<button class="tb" id="bSpeed" type="button" title="Speed up time for slow experiments">Time ×1</button><span class="tsep"></span>');
  $('#bSpeed').onclick=()=>{speed=speed===1?5:speed===5?20:1;$('#bSpeed').textContent='Time ×'+speed;$('#bSpeed').setAttribute('aria-pressed',speed>1);};
  document.querySelector('.brand span').textContent='IGCSE & AS Level apparatus · reactions · infinite workspace';
  const st=document.createElement('style');st.textContent=`.bub{transform-box:fill-box;animation:bub 1.1s linear infinite}@keyframes bub{from{transform:translateY(0);opacity:.9}to{transform:translateY(-26px);opacity:0}}
  .steam path{fill:none;stroke:var(--muted);stroke-width:1.4;opacity:.5;stroke-linecap:round;animation:stm 1.6s ease-in-out infinite alternate}@keyframes stm{from{opacity:.15}to{opacity:.6}}
  @media (prefers-reduced-motion:reduce){.bub,.steam path{animation:none}}`;document.head.appendChild(st);}
window.LabX={react,amt,analyse:it=>analyse(it),CHEM,RX,tick,get items(){return items},setSpeed:v=>{speed=v;},addTo,pourChem:(c,id,a)=>pourChem(c,id,a),transfer:(a,b,v,bf)=>transfer(a,b,v,bf),probe,tempAt,electrolysis};

}catch(e){console.error('Lab extension failed',e);}

/* ===================== BOOT (moved here so the extension loads first) ===================== */
window.claude?.hot?.ready?window.claude.hot.ready(start):start(window.claude?.hot?.data??{});

// Fresh Biology · labelled diagrams for every structure the 0610 syllabus asks students to identify.
// Original schematic drawings (not to scale). Drawing area is x 160–480 of a 640-wide viewBox;
// labels sit in a column on the left (side 'l') or right (side 'r').
// label: [text, anchorX, anchorY, side, labelY, tier?]
const G = {
  green: '#d9ead4', greenLine: '#396b3c', teal: '#087e83', tealSoft: '#c5e9ef', purple: '#6941a5', purpleSoft: '#c8b4e3',
  orange: '#a35f27', orangeSoft: '#f0c9a2', red: '#b8433a', redSoft: '#f3c1bb', blue: '#2b6cb0', blueSoft: '#c6dcf3', yellow: '#f3e7a6', grey: '#8a9a94'
};
const mito = (x, y, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r})"><ellipse rx="17" ry="8" fill="${G.orangeSoft}" stroke="${G.orange}"/><path d="M-12 0q3-6 6 0t6 0t6 0" stroke="${G.orange}" fill="none"/></g>`;
const dots = (pts, c = G.greenLine) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="${c}"/>`).join('');
const chloro = (x, y, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r})"><ellipse rx="15" ry="7" fill="#57a866" stroke="#2f6b3a"/><path d="M-9-1h18M-9 2h18" stroke="#2f6b3a" stroke-width=".8"/></g>`;
const arrow = (x1, y1, x2, y2, c = 'currentColor') => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${c}" stroke-width="2" marker-end="url(#gis-ah)"/>`;

export const gisDiagrams = [
{
  key: 'plant-cell', name: 'Plant cell', topicId: 't02', year: 'Y10', h: 300,
  description: 'A palisade-type plant cell, not to scale. A cellulose cell wall surrounds the cell membrane; inside are cytoplasm, a nucleus, a large permanent vacuole, chloroplasts, mitochondria and ribosomes.',
  shapes: `<rect x="190" y="30" width="260" height="240" rx="16" fill="${G.green}" stroke="${G.greenLine}" stroke-width="7"/>
    <rect x="200" y="40" width="240" height="220" rx="12" fill="#f0f7d5" stroke="${G.teal}" stroke-width="2"/>
    <rect x="262" y="78" width="160" height="160" rx="18" fill="${G.tealSoft}" stroke="${G.teal}"/>
    <circle cx="228" cy="150" r="22" fill="${G.purpleSoft}" stroke="${G.purple}"/><circle cx="231" cy="146" r="7" fill="${G.purple}" opacity=".5"/>
    ${chloro(232, 64, 10)}${chloro(238, 230, -15)}${chloro(330, 58, 0)}${chloro(410, 252, 5)}${mito(226, 200, 60)}${dots([[300, 55], [312, 62], [380, 250], [392, 244], [214, 96]])}`,
  labels: [['Cell wall', 190, 110, 'l', 60], ['Cell membrane', 201, 182, 'l', 100], ['Nucleus', 220, 150, 'l', 150], ['Mitochondrion', 226, 200, 'l', 200], ['Chloroplast', 238, 230, 'l', 250],
    ['Ribosomes', 312, 62, 'r', 40], ['Cytoplasm', 300, 255, 'r', 285], ['Large permanent vacuole (cell sap)', 360, 160, 'r', 160]]
},
{
  key: 'animal-cell', name: 'Animal cell', topicId: 't02', year: 'Y10', h: 260,
  description: 'An animal cell, not to scale. A cell membrane encloses cytoplasm, a nucleus, mitochondria and ribosomes. There is no cell wall, no large vacuole and no chloroplasts.',
  shapes: `<path d="M210 70C250 20 380 25 430 75S470 205 410 228 245 245 205 200 170 120 210 70Z" fill="#d6eae4" stroke="${G.teal}" stroke-width="3"/>
    <circle cx="300" cy="135" r="38" fill="${G.purpleSoft}" stroke="${G.purple}"/><circle cx="306" cy="128" r="11" fill="${G.purple}" opacity=".45"/>
    ${mito(395, 100, -20)}${mito(380, 190, 25)}${dots([[240, 110], [250, 120], [238, 180], [420, 150], [410, 160]])}`,
  labels: [['Cell membrane', 196, 160, 'l', 160], ['Nucleus', 290, 135, 'l', 90], ['Cytoplasm', 250, 205, 'l', 220], ['Mitochondrion', 395, 100, 'r', 70], ['Ribosomes', 420, 150, 'r', 150], ['Mitochondrion', 380, 190, 'r', 210]]
},
{
  key: 'bacterial-cell', name: 'Bacterial cell', topicId: 't02', year: 'Y10', h: 230,
  description: 'A bacterial cell (prokaryote), not to scale. It has a cell wall, cell membrane, cytoplasm and ribosomes, a circular DNA chromosome and plasmids, but no nucleus or mitochondria. Some have a flagellum.',
  shapes: `<rect x="190" y="70" width="230" height="100" rx="50" fill="#e8f1dc" stroke="${G.greenLine}" stroke-width="6"/><rect x="198" y="78" width="214" height="84" rx="42" fill="#f6f9ee" stroke="${G.teal}" stroke-width="1.5"/>
    <path d="M250 115c20-25 60 15 80-5s50 10 30 25-60 0-80 10-50-10-30-30Z" fill="none" stroke="${G.purple}" stroke-width="2.5"/>
    <circle cx="380" cy="100" r="9" fill="none" stroke="${G.red}" stroke-width="2"/><circle cx="235" cy="140" r="7" fill="none" stroke="${G.red}" stroke-width="2"/>
    ${dots([[300, 95], [320, 150], [355, 145], [270, 92]])}<path d="M420 120c20 0 25-20 40-10s20 20 15 30" stroke="${G.greenLine}" stroke-width="2.5" fill="none"/>`,
  labels: [['Cell wall', 190, 120, 'l', 60], ['Cell membrane', 199, 150, 'l', 110], ['Plasmid', 235, 140, 'l', 175], ['Circular DNA (chromosome)', 290, 108, 'l', 215], ['Ribosomes', 320, 150, 'r', 200], ['Cytoplasm', 340, 88, 'r', 40], ['Plasmid', 380, 100, 'r', 85], ['Flagellum', 470, 125, 'r', 140]]
},
{
  key: 'leaf', name: 'Leaf cross-section', topicId: 't06', year: 'Y10', h: 330,
  description: 'Cross-section of a dicotyledon leaf. From the top: waxy cuticle, upper epidermis, palisade mesophyll, spongy mesophyll with air spaces, lower epidermis with stomata and guard cells. A vascular bundle contains xylem and phloem.',
  shapes: `<rect x="170" y="30" width="300" height="8" fill="#e9e3b8" stroke="#9c8f3a"/>
    ${Array.from({ length: 10 }, (_, i) => `<rect x="${170 + i * 30}" y="38" width="30" height="22" fill="#eef6ea" stroke="${G.greenLine}"/>`).join('')}
    ${Array.from({ length: 12 }, (_, i) => `<rect x="${172 + i * 25}" y="62" width="21" height="68" rx="9" fill="${G.green}" stroke="${G.greenLine}"/>${chloro(182 + i * 25, 80, 90).replace('rx="15"', 'rx="6"').replace('ry="7"', 'ry="4"')}${chloro(182 + i * 25, 110, 90).replace('rx="15"', 'rx="6"').replace('ry="7"', 'ry="4"')}`).join('')}
    ${[[195, 160], [245, 150], [300, 172], [360, 152], [430, 165], [220, 205], [280, 215], [400, 210], [455, 200]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="20" ry="15" fill="${G.green}" stroke="${G.greenLine}"/>`).join('')}
    <circle cx="335" cy="200" r="26" fill="#f6f2dd" stroke="${G.greenLine}"/><circle cx="328" cy="192" r="6" fill="#fff" stroke="${G.blue}" stroke-width="2"/><circle cx="340" cy="190" r="5" fill="#fff" stroke="${G.blue}" stroke-width="2"/><circle cx="335" cy="212" r="5" fill="${G.orangeSoft}" stroke="${G.orange}"/><circle cx="345" cy="210" r="4" fill="${G.orangeSoft}" stroke="${G.orange}"/>
    ${Array.from({ length: 10 }, (_, i) => i === 6 ? '' : `<rect x="${170 + i * 30}" y="240" width="30" height="20" fill="#eef6ea" stroke="${G.greenLine}"/>`).join('')}
    <path d="M350 240q10 10 0 20M370 240q-10 10 0 20" stroke="${G.greenLine}" stroke-width="7" fill="none"/><rect x="170" y="260" width="300" height="6" fill="#e9e3b8" stroke="#9c8f3a"/>`,
  labels: [['Waxy cuticle', 200, 33, 'l', 30], ['Upper epidermis', 200, 50, 'l', 60], ['Palisade mesophyll', 190, 95, 'l', 100], ['Spongy mesophyll', 220, 205, 'l', 180], ['Air space', 260, 180, 'l', 215], ['Lower epidermis', 200, 250, 'l', 255],
    ['Xylem', 333, 192, 'r', 175], ['Phloem', 338, 212, 'r', 215], ['Vascular bundle (vein)', 357, 188, 'r', 140], ['Guard cell', 370, 250, 'r', 255], ['Stoma', 360, 262, 'r', 290]]
},
{
  key: 'root-stem', name: 'Xylem and phloem in root and stem', topicId: 't08', year: 'Y10', h: 270,
  description: 'Transverse sections. Root (left): xylem forms a star shape in the centre with phloem between its arms; root hair cells on the outside. Stem (right): vascular bundles in a ring, xylem towards the centre and phloem towards the outside.',
  shapes: `<circle cx="245" cy="140" r="80" fill="#f4f1dc" stroke="${G.greenLine}" stroke-width="2"/><path d="M245 105l9 26 26 9-26 9-9 26-9-26-26-9 26-9z" fill="${G.blueSoft}" stroke="${G.blue}" stroke-width="2"/>
    ${[[268, 117], [268, 163], [222, 163], [222, 117]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="${G.orangeSoft}" stroke="${G.orange}"/>`).join('')}
    <path d="M190 85l-20-25M300 195l22 24M175 170l-30 8" stroke="${G.greenLine}" stroke-width="3"/>
    <circle cx="395" cy="140" r="80" fill="#f4f1dc" stroke="${G.greenLine}" stroke-width="2"/>
    ${Array.from({ length: 6 }, (_, i) => { const a = i * Math.PI / 3, x = 395 + 52 * Math.cos(a), y = 140 + 52 * Math.sin(a); return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(i * 60 + 90)})"><ellipse rx="13" ry="18" fill="#fff" stroke="${G.greenLine}"/><ellipse cy="7" rx="10" ry="7" fill="${G.blueSoft}" stroke="${G.blue}"/><ellipse cy="-8" rx="10" ry="6" fill="${G.orangeSoft}" stroke="${G.orange}"/></g>`; }).join('')}
    <text x="245" y="245" text-anchor="middle" font-size="13" fill="currentColor">Root</text><text x="395" y="245" text-anchor="middle" font-size="13" fill="currentColor">Stem</text>`,
  labels: [['Root hair cell', 170, 62, 'l', 60], ['Xylem (root)', 236, 140, 'l', 120], ['Phloem (root)', 222, 163, 'l', 175], ['Cortex', 190, 200, 'l', 225], ['Xylem (stem, inner side)', 447, 147, 'r', 100], ['Phloem (stem, outer side)', 455, 140, 'r', 160], ['Vascular bundle', 421, 185, 'r', 215]]
},
{
  key: 'digestive', name: 'Human digestive system', topicId: 't07', year: 'Y9', h: 380,
  description: 'The alimentary canal from mouth to anus, with the associated organs: liver, gall bladder and pancreas. Food passes through the oesophagus, stomach, small intestine (duodenum, ileum), large intestine (colon, rectum) and out of the anus.',
  shapes: `<ellipse cx="320" cy="34" rx="28" ry="16" fill="${G.redSoft}" stroke="${G.red}"/><path d="M314 50v95M326 50v95" stroke="${G.red}" stroke-width="3"/>
    <path d="M320 140c40-10 80 0 75 40s-50 40-70 30" fill="${G.redSoft}" stroke="${G.red}" stroke-width="3"/>
    <path d="M200 115c40-20 100-15 125 5-10 25-80 50-125 25z" fill="#b5654e" stroke="#7a3a2a" stroke-width="2"/><ellipse cx="300" cy="160" rx="10" ry="8" fill="#6aa84f" stroke="#2f6b3a"/>
    <path d="M330 205c30 5 60-2 70-8" stroke="#d9a13b" stroke-width="12" stroke-linecap="round"/>
    <path d="M325 210c-30 10-20 20 0 25s30 15 0 20-40 10-10 20 40 15 0 22" fill="none" stroke="${G.orange}" stroke-width="9" stroke-linecap="round"/>
    <path d="M300 320c-60 0-75-10-75-50v-80c0-15 10-20 40-20M300 320h55c20 0 20-20 20-40v-60" fill="none" stroke="#7d5a3c" stroke-width="13" stroke-linecap="round"/>
    <path d="M300 322v30" stroke="#7d5a3c" stroke-width="10"/><circle cx="300" cy="358" r="5" fill="#7d5a3c"/>`,
  labels: [['Mouth', 300, 34, 'l', 30], ['Oesophagus', 314, 90, 'l', 80], ['Liver', 240, 125, 'l', 125], ['Gall bladder', 298, 162, 'l', 165], ['Large intestine (colon)', 226, 230, 'l', 230], ['Rectum', 300, 335, 'l', 320], ['Anus', 300, 358, 'l', 360],
    ['Stomach', 385, 175, 'r', 150], ['Pancreas', 398, 198, 'r', 195], ['Small intestine', 335, 255, 'r', 255]]
},
{
  key: 'tooth', name: 'Structure of a tooth', topicId: 't07', year: 'Y9', h: 300,
  description: 'Section through a molar tooth. The crown is covered in enamel over dentine; the pulp cavity contains nerves and blood vessels; cement and fibres hold the root in the jaw bone below the gum.',
  shapes: `<path d="M260 40c30-15 50 5 60 0s30-15 60 0 10 70 0 110c-5 30-8 70-20 110-6 20-20 20-22-5l-6-60-24 0-6 60c-2 25-16 25-22 5-12-40-15-80-20-110-10-40-30-95 0-110z" fill="#f3efe3" stroke="#6b6553" stroke-width="3"/>
    <path d="M272 52c25-10 40 5 48 2s28-12 48 0 6 60-2 85l-92 0c-8-25-22-77-2-87z" fill="#fffdf6" stroke="#9fb4c7" stroke-width="6" opacity=".9"/>
    <path d="M300 100c10-8 30-8 40 0v80l-8 70h-6l-6-70-6 70h-6l-8-70z" fill="${G.redSoft}" stroke="${G.red}"/>
    <path d="M220 160h200" stroke="#d48a8a" stroke-width="22" opacity=".45"/><rect x="205" y="185" width="230" height="95" fill="#e7e1cf" opacity=".6"/>`,
  labels: [['Enamel', 275, 60, 'l', 50], ['Crown', 260, 100, 'l', 95], ['Gum', 230, 160, 'l', 160], ['Root', 285, 230, 'l', 230], ['Jaw bone', 220, 270, 'l', 280],
    ['Dentine', 362, 110, 'r', 70], ['Pulp cavity (nerves, blood vessels)', 320, 140, 'r', 140], ['Cement', 352, 220, 'r', 210]]
},
{
  key: 'villus', name: 'A villus', topicId: 't07', year: 'Y9', h: 320,
  description: 'A villus in the small intestine. A thin epithelium one cell thick with microvilli covers a network of capillaries and a central lacteal (lymph vessel).',
  tier: 'supplement',
  shapes: `<path d="M240 300V90c0-60 160-60 160 0v210" fill="#f6dcd0" stroke="#b05a44" stroke-width="5"/>
    ${Array.from({ length: 14 }, (_, i) => `<path d="M${245 + i * 11} ${i < 7 ? 70 - i * 2 : 58 + (i - 7) * 2}v-8" stroke="#b05a44" stroke-width="2"/>`).join('')}
    <path d="M280 300V110c0-30 80-30 80 0v190" fill="none" stroke="${G.red}" stroke-width="3"/><path d="M290 110c10 30 60 30 60 0M285 160c20 20 50 20 70 0M285 210c20 20 50 20 70 0" stroke="${G.red}" stroke-width="2" fill="none"/>
    <path d="M320 300V120" stroke="#e8c84a" stroke-width="10" stroke-linecap="round"/>`,
  labels: [['Microvilli', 258, 60, 'l', 45], ['Epithelium (one cell thick)', 242, 140, 'l', 130], ['Capillary network', 285, 200, 'l', 215], ['Lacteal', 320, 170, 'r', 150], ['Arteriole / venule', 360, 280, 'r', 270]]
},
{
  key: 'enzyme', name: 'Enzyme action (lock and key)', topicId: 't05', year: 'Y9', h: 230,
  description: 'An enzyme with an active site; a substrate with a complementary shape binds to form an enzyme–substrate complex; products are formed and released, and the enzyme is unchanged.',
  shapes: `<defs><marker id="gis-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>
    ${[170, 290, 410].map(x => `<path d="M${x} 190V138q0-10 10-10h15l10 22 10-22h15q10 0 10 10V190z" fill="${G.tealSoft}" stroke="${G.teal}" stroke-width="2.5"/>`).join('')}
    <path d="M195 70h20l-10 22z" fill="${G.orangeSoft}" stroke="${G.orange}" stroke-width="2"/>
    <path d="M315 128h20l-10 22z" fill="${G.orangeSoft}" stroke="${G.orange}" stroke-width="2"/>
    <path d="M420 70h10l-5 12zM445 58l10 0-5 10z" fill="${G.yellow}" stroke="${G.orange}" stroke-width="2"/>
    ${arrow(255, 160, 282, 160)}${arrow(375, 160, 402, 160)}`,
  labels: [['Substrate', 205, 78, 'l', 60], ['Active site', 205, 140, 'l', 120], ['Enzyme', 190, 175, 'l', 180], ['Enzyme–substrate complex', 325, 138, 'r', 40, 'supplement'], ['Products released', 450, 62, 'r', 90], ['Enzyme unchanged', 440, 175, 'r', 175]]
},

{
  key: 'heart', name: 'The mammalian heart', topicId: 't09', year: 'Y11', h: 360,
  description: 'Front view of the heart (the left side of the heart appears on the right of the diagram). Four chambers, the septum, valves, and the vena cava, pulmonary artery, pulmonary vein and aorta.',
  shapes: `<path d="M220 110c0-30 30-45 70-45h60c40 0 70 15 70 45v70c0 60-60 120-100 150-40-30-100-90-100-150z" fill="#f7d9d5" stroke="${G.red}" stroke-width="3"/>
    <path d="M320 70v260" stroke="${G.red}" stroke-width="10" opacity=".55"/>
    <path d="M232 120h80M330 120h78" stroke="#9c3b33" stroke-width="2"/><path d="M265 120l10 14 10-14M360 120l10 14 10-14" fill="#fff" stroke="#9c3b33" stroke-width="2"/>
    <path d="M240 80V25h25v55" fill="${G.blueSoft}" stroke="${G.blue}" stroke-width="2"/><path d="M285 70c0-30 10-45 30-50h40" fill="none" stroke="${G.blue}" stroke-width="14" opacity=".7"/>
    <path d="M330 70c0-40 30-55 70-55 30 0 30 30 30 40" fill="none" stroke="${G.red}" stroke-width="16" opacity=".8"/><path d="M410 90h50M410 105h50" stroke="${G.red}" stroke-width="7" opacity=".6"/>
    <path d="M240 260v60" stroke="${G.blue}" stroke-width="18" opacity=".6"/><path d="M255 125l-5 0" stroke="none"/>
    <path d="M375 130c-10 60-20 120-45 170" stroke="#9c3b33" stroke-width="1" fill="none" opacity=".4"/>`,
  labels: [['Vena cava (from head)', 252, 40, 'l', 35], ['Right atrium', 255, 100, 'l', 100], ['Atrioventricular valve', 275, 128, 'l', 140, 'supplement'], ['Right ventricle', 270, 200, 'l', 200], ['Vena cava (from body)', 240, 300, 'l', 300],
    ['Pulmonary artery', 340, 22, 'r', 20], ['Aorta', 425, 40, 'r', 50], ['Pulmonary vein', 455, 97, 'r', 95], ['Left atrium', 380, 100, 'r', 130], ['Septum', 320, 220, 'r', 230], ['Left ventricle (thickest wall)', 370, 190, 'r', 180]]
},
{
  key: 'vessels', name: 'Artery, vein and capillary', topicId: 't09', year: 'Y11', h: 230,
  description: 'Cross-sections. Artery: thick muscular, elastic wall and narrow lumen. Vein: thin wall, wide lumen (valves along its length). Capillary: wall one cell thick.',
  shapes: `<circle cx="210" cy="115" r="52" fill="${G.redSoft}" stroke="${G.red}" stroke-width="2"/><circle cx="210" cy="115" r="20" fill="#fff" stroke="${G.red}"/>
    <ellipse cx="330" cy="115" rx="58" ry="44" fill="${G.blueSoft}" stroke="${G.blue}" stroke-width="2"/><ellipse cx="330" cy="115" rx="48" ry="34" fill="#fff" stroke="${G.blue}"/>
    <circle cx="440" cy="115" r="14" fill="#fff" stroke="${G.red}" stroke-width="3"/><circle cx="440" cy="115" r="5" fill="${G.red}"/>
    <text x="210" y="40" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">Artery</text><text x="330" y="40" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">Vein</text><text x="440" y="40" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">Capillary</text>`,
  labels: [['Thick muscular, elastic wall', 172, 85, 'l', 85], ['Narrow lumen', 210, 115, 'l', 150], ['Thin wall', 372, 148, 'r', 200], ['Wide lumen', 330, 125, 'r', 175], ['Wall one cell thick', 452, 108, 'r', 95], ['Red blood cell', 440, 115, 'r', 130]]
},
{
  key: 'lungs', name: 'The breathing system', topicId: 't11', year: 'Y11', h: 340,
  description: 'Larynx, trachea (with cartilage rings), bronchi, bronchioles and alveoli in the lungs, protected by the ribs; intercostal muscles between the ribs and the diaphragm below.',
  shapes: `<rect x="308" y="20" width="24" height="18" rx="5" fill="${G.orangeSoft}" stroke="${G.orange}"/><path d="M320 38v80" stroke="${G.orange}" stroke-width="16"/>
    ${Array.from({ length: 6 }, (_, i) => `<path d="M311 ${46 + i * 12}h18" stroke="#fff" stroke-width="3"/>`).join('')}
    <path d="M320 115l-50 40M320 115l50 40" stroke="${G.orange}" stroke-width="11" stroke-linecap="round"/>
    <path d="M300 120c-50-30-110 10-110 110 0 60 20 80 60 80 30 0 50-10 50-40z" fill="#f3d0d3" stroke="#b05a6a" stroke-width="2" opacity=".9"/>
    <path d="M340 120c50-30 110 10 110 110 0 60-20 80-60 80-30 0-50-10-50-40z" fill="#f3d0d3" stroke="#b05a6a" stroke-width="2" opacity=".9"/>
    <path d="M270 155l-25 40M270 155l5 50M245 195l-15 20M245 195l10 25" stroke="${G.orange}" stroke-width="3" fill="none"/>
    ${[[228, 218], [255, 222], [275, 208]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#fbe3e6" stroke="#b05a6a"/>`).join('')}
    ${Array.from({ length: 5 }, (_, i) => `<path d="M175 ${150 + i * 32}q-10 14 0 28M465 ${150 + i * 32}q10 14 0 28" stroke="#bba98a" stroke-width="7" fill="none"/>`).join('')}
    <path d="M180 318c60-35 220-35 280 0" stroke="#b0423a" stroke-width="7" fill="none"/>`,
  labels: [['Larynx', 308, 28, 'l', 30], ['Trachea', 312, 70, 'l', 70], ['Cartilage ring', 320, 82, 'r', 70, 'supplement'], ['Bronchus', 295, 135, 'l', 120], ['Bronchiole', 258, 180, 'l', 175], ['Alveoli', 228, 218, 'l', 225], ['Rib', 172, 280, 'l', 275], ['Diaphragm', 230, 306, 'l', 320],
    ['Lung', 420, 200, 'r', 200], ['Intercostal muscles', 465, 240, 'r', 245]]
},
{
  key: 'alveolus', name: 'Gas exchange at an alveolus', topicId: 't11', year: 'Y11', h: 250,
  description: 'An alveolus and a capillary. Oxygen diffuses from the air in the alveolus into the blood; carbon dioxide diffuses from the blood into the alveolus. Both walls are one cell thick.',
  shapes: `<circle cx="290" cy="120" r="85" fill="#fbe3e6" stroke="#b05a6a" stroke-width="3"/><path d="M380 30c0 80 0 140 0 200" stroke="${G.red}" stroke-width="34" opacity=".35"/>
    <circle cx="380" cy="80" r="9" fill="${G.red}"/><circle cx="380" cy="150" r="9" fill="${G.red}"/>
    <defs><marker id="gis-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>
    ${arrow(320, 95, 362, 95)}${arrow(362, 140, 320, 140)}<text x="315" y="88" font-size="12" fill="currentColor">O₂</text><text x="318" y="160" font-size="12" fill="currentColor">CO₂</text>`,
  labels: [['Air in alveolus', 260, 120, 'l', 120], ['Alveolus wall (one cell thick)', 210, 90, 'l', 60], ['Moist lining', 215, 160, 'l', 185], ['Capillary', 380, 200, 'r', 210], ['Red blood cell', 388, 80, 'r', 60], ['Oxygen diffuses into blood', 345, 95, 'r', 110], ['Carbon dioxide diffuses out', 345, 140, 'r', 150]]
},
{
  key: 'urinary', name: 'The urinary system', topicId: 't13', year: 'Y11', h: 300,
  description: 'Two kidneys (each with cortex and medulla) supplied by renal arteries and drained by renal veins; ureters carry urine to the bladder, which empties through the urethra.',
  shapes: `<path d="M300 20v260" stroke="${G.red}" stroke-width="10" opacity=".7"/><path d="M340 20v260" stroke="${G.blue}" stroke-width="12" opacity=".6"/>
    <path d="M215 80c-30 0-40 40-35 70s25 50 45 40c15-8 10-30 20-50s-5-60-30-60z" fill="#c76e5a" stroke="#7a3a2a" stroke-width="2"/><path d="M225 95c-15 10-20 45 0 70" stroke="#f0c9a2" stroke-width="10" fill="none" opacity=".7"/>
    <path d="M425 80c30 0 40 40 35 70s-25 50-45 40c-15-8-10-30-20-50s5-60 30-60z" fill="#c76e5a" stroke="#7a3a2a" stroke-width="2"/>
    <path d="M300 130h-55M340 140h55M300 115h97" stroke="currentColor" stroke-width="0"/><path d="M300 125h-52" stroke="${G.red}" stroke-width="5"/><path d="M340 140h-25M300 140h-52" stroke="${G.blue}" stroke-width="5" opacity=".8"/><path d="M340 125h55" stroke="${G.red}" stroke-width="5"/><path d="M340 140h55" stroke="${G.blue}" stroke-width="5"/>
    <path d="M240 175c10 40 40 70 60 85M400 175c-10 40-40 70-60 85" stroke="#d9a13b" stroke-width="4" fill="none"/><ellipse cx="320" cy="262" rx="32" ry="22" fill="#f3e7a6" stroke="#b89a2a" stroke-width="2"/><path d="M320 284v16" stroke="#b89a2a" stroke-width="5"/>`,
  labels: [['Kidney', 190, 150, 'l', 150], ['Cortex', 205, 100, 'l', 90, 'supplement'], ['Medulla', 225, 125, 'l', 120, 'supplement'], ['Renal artery', 270, 125, 'l', 60], ['Ureter', 260, 210, 'l', 215], ['Bladder', 300, 262, 'l', 260], ['Urethra', 320, 296, 'l', 295],
    ['Aorta', 300, 40, 'r', 30], ['Vena cava', 340, 50, 'r', 60], ['Renal vein', 380, 140, 'r', 160]]
},
{
  key: 'nephron', name: 'A nephron', topicId: 't13', year: 'Y11', h: 320, tier: 'supplement',
  description: 'A kidney nephron. Blood is filtered at the glomerulus into the Bowman’s capsule. Glucose and some water are reabsorbed in the proximal convoluted tubule; more water is reabsorbed in the loop of Henle and collecting duct, which carries urine to the ureter.',
  shapes: `<circle cx="215" cy="70" r="30" fill="#fff" stroke="${G.teal}" stroke-width="5"/><path d="M200 60c10-15 20 15 30 0s-10 25-20 15 20-10 15 10" stroke="${G.red}" stroke-width="4" fill="none"/>
    <path d="M190 55l-25-15M195 85l-30 15" stroke="${G.red}" stroke-width="5"/>
    <path d="M245 70c30 0 20 30 45 25s15-30 40-25 10 40-10 50" stroke="${G.teal}" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M320 120v130c0 25 40 25 40 0V110c0-20 30-20 40 0v40" stroke="${G.teal}" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M430 30v260" stroke="#d9a13b" stroke-width="12" stroke-linecap="round"/><path d="M400 150c0 20 15 10 30 20" stroke="${G.teal}" stroke-width="8" fill="none"/>
    <path d="M160 160h300" stroke="${G.grey}" stroke-dasharray="6 6"/><text x="465" y="150" font-size="11" fill="currentColor">cortex</text><text x="465" y="178" font-size="11" fill="currentColor">medulla</text>`,
  labels: [['Afferent arteriole (from renal artery)', 168, 42, 'l', 30], ['Glomerulus (filtration)', 215, 65, 'l', 75], ['Bowman’s capsule', 190, 85, 'l', 120], ['Efferent arteriole', 170, 98, 'l', 160],
    ['Proximal convoluted tubule (glucose reabsorbed)', 290, 95, 'r', 60], ['Loop of Henle (water reabsorbed)', 340, 268, 'r', 270], ['Collecting duct (water reabsorbed)', 430, 220, 'r', 215], ['To ureter', 430, 288, 'r', 300]]
},
{
  key: 'reflex', name: 'Reflex arc', topicId: 't14', year: 'Y11', h: 280,
  description: 'Stimulus → receptor → sensory neurone → relay neurone in the spinal cord → motor neurone → effector (muscle) → response. Synapses join the neurones.',
  shapes: `<ellipse cx="380" cy="80" rx="70" ry="55" fill="#eee6f6" stroke="${G.purple}" stroke-width="2"/><path d="M380 45c-15 15-15 55 0 70 15-15 15-55 0-70z" fill="#d8c7ee" stroke="${G.purple}"/>
    <circle cx="190" cy="230" r="10" fill="${G.yellow}" stroke="${G.orange}" stroke-width="2"/><path d="M198 222C260 160 300 40 345 62" stroke="${G.blue}" stroke-width="3" fill="none"/><circle cx="300" cy="80" r="7" fill="${G.blue}"/>
    <path d="M352 70h40" stroke="${G.teal}" stroke-width="3"/><circle cx="372" cy="70" r="5" fill="${G.teal}"/>
    <circle cx="400" cy="95" r="8" fill="${G.red}"/><path d="M400 103C410 170 380 230 300 250" stroke="${G.red}" stroke-width="3" fill="none"/>
    <path d="M230 245c25-20 60-20 75 5-15 25-50 25-75-5z" fill="#f3c1bb" stroke="#b05a44" stroke-width="2"/>`,
  labels: [['Stimulus / receptor (skin)', 190, 230, 'l', 230], ['Sensory neurone', 260, 140, 'l', 140], ['Cell body of sensory neurone', 300, 80, 'l', 60], ['Effector (muscle)', 265, 248, 'l', 268],
    ['Spinal cord (CNS)', 430, 50, 'r', 30], ['Relay neurone', 375, 70, 'r', 75], ['Motor neurone', 400, 160, 'r', 160], ['Grey matter', 380, 95, 'r', 115]]
},
{
  key: 'synapse', name: 'A synapse', topicId: 't14', year: 'Y11', h: 240, tier: 'supplement',
  description: 'The end of one neurone contains vesicles of neurotransmitter. When an impulse arrives, neurotransmitter is released, diffuses across the synaptic gap and binds to receptor proteins on the next neurone, stimulating an impulse.',
  shapes: `<defs><marker id="gis-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>
    <path d="M170 90h90c40 0 60 20 60 30s-20 30-60 30h-90z" fill="#eee6f6" stroke="${G.purple}" stroke-width="2"/>
    ${[[275, 105], [290, 125], [272, 138], [300, 108]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#fff" stroke="${G.purple}"/><circle cx="${x}" cy="${y}" r="2" fill="${G.orange}"/>`).join('')}
    <path d="M345 70c0 30 0 70 0 100h130V70z" fill="#e5f1ee" stroke="${G.teal}" stroke-width="2"/>${[90, 110, 130, 150].map(y => `<rect x="341" y="${y}" width="8" height="10" fill="${G.teal}"/>`).join('')}
    ${[[330, 100], [333, 128], [328, 145]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="${G.orange}"/>`).join('')}${arrow(180, 60, 260, 60)}`,
  labels: [['Direction of impulse', 220, 60, 'l', 40], ['Neurone 1 (end)', 210, 120, 'l', 120], ['Vesicle of neurotransmitter', 275, 138, 'l', 190], ['Neurotransmitter molecules', 330, 128, 'r', 40], ['Synaptic gap', 334, 155, 'r', 190], ['Receptor proteins', 345, 115, 'r', 90], ['Neurone 2', 420, 140, 'r', 140]]
},
{
  key: 'eye', name: 'The human eye', topicId: 't14', year: 'Y11', h: 300,
  description: 'Horizontal section through the eye: cornea, iris, pupil, lens held by suspensory ligaments and ciliary muscles, retina with the fovea, optic nerve and blind spot.',
  shapes: `<circle cx="340" cy="150" r="115" fill="#fbfbf6" stroke="#6b6553" stroke-width="4"/><path d="M340 35a115 115 0 0 1 0 230" fill="none" stroke="#b05a6a" stroke-width="7" opacity=".55"/>
    <path d="M232 110c-25 15-25 65 0 80" fill="none" stroke="${G.teal}" stroke-width="4"/>
    <path d="M245 100v30M245 170v30" stroke="#6a4b2a" stroke-width="7"/><ellipse cx="262" cy="150" rx="13" ry="34" fill="${G.tealSoft}" stroke="${G.teal}" stroke-width="2"/>
    <path d="M262 116l-8-20M262 184l-8 20" stroke="${G.grey}" stroke-width="1.5"/><rect x="248" y="88" width="10" height="12" fill="#c9a07a"/><rect x="248" y="200" width="10" height="12" fill="#c9a07a"/>
    <path d="M440 165h50" stroke="#e8c84a" stroke-width="14"/><circle cx="452" cy="138" r="4" fill="${G.orange}"/>`,
  labels: [['Cornea', 226, 150, 'l', 150], ['Iris', 245, 115, 'l', 100], ['Pupil', 247, 150, 'l', 185], ['Ciliary muscle', 252, 94, 'l', 60, 'supplement'], ['Suspensory ligaments', 257, 197, 'l', 225, 'supplement'], ['Lens', 265, 165, 'l', 260],
    ['Retina', 400, 55, 'r', 50], ['Fovea', 452, 138, 'r', 120, 'supplement'], ['Blind spot', 440, 165, 'r', 170], ['Optic nerve', 485, 165, 'r', 205]]
},
{
  key: 'skin', name: 'Skin and temperature control', topicId: 't14', year: 'Y11', h: 280, tier: 'supplement',
  description: 'Section through skin: hairs with hair erector muscles, sweat glands and pores, receptors and sensory neurones, arterioles and capillaries near the surface, and fatty tissue beneath.',
  shapes: `<rect x="170" y="40" width="300" height="20" fill="#f2d7c4" stroke="#b0805a"/><rect x="170" y="60" width="300" height="130" fill="#f8e7dc" stroke="#b0805a"/><rect x="170" y="190" width="300" height="70" fill="#fff4c4" stroke="#c9a84a"/>
    ${[[180, 215], [215, 230], [250, 210], [290, 232], [330, 214], [370, 230], [410, 212], [450, 230]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15" fill="#fde9a2" stroke="#c9a84a"/>`).join('')}
    <path d="M220 160V20" stroke="#5b3f2a" stroke-width="3"/><ellipse cx="220" cy="165" rx="9" ry="14" fill="#e0b89a" stroke="#5b3f2a"/><path d="M226 150l25-40" stroke="${G.red}" stroke-width="4"/>
    <path d="M330 40v80c0 15 15 15 20 30s-20 10-20 25 20 5 15 15" stroke="${G.blue}" stroke-width="3" fill="none"/>
    <path d="M190 120h270" stroke="${G.red}" stroke-width="4" opacity=".7"/><path d="M200 90c40-10 80 10 120 0s80 10 120 0" stroke="${G.red}" stroke-width="2" fill="none"/>
    <circle cx="410" cy="75" r="6" fill="${G.purple}"/><path d="M410 81c10 40-20 70 0 100" stroke="${G.purple}" stroke-width="2.5" fill="none"/>`,
  labels: [['Hair', 220, 30, 'l', 30], ['Epidermis', 180, 50, 'l', 65], ['Hair erector muscle', 240, 125, 'l', 110], ['Hair follicle', 215, 165, 'l', 165], ['Fatty tissue (insulation)', 200, 225, 'l', 225],
    ['Sweat pore', 330, 42, 'r', 30], ['Sweat gland', 340, 170, 'r', 210], ['Capillaries near the surface', 400, 92, 'r', 85], ['Arteriole', 450, 120, 'r', 125], ['Receptor', 410, 75, 'r', 55], ['Sensory neurone', 412, 150, 'r', 160]]
},
{
  key: 'flower', name: 'Insect-pollinated flower', topicId: 't16', year: 'Y10', h: 320,
  description: 'Half-flower of an insect-pollinated plant. Stamens (anther on a filament) surround the carpel (stigma, style, ovary containing ovules). Large coloured petals, protective sepals and a nectary.',
  shapes: `<path d="M320 300v-60" stroke="${G.greenLine}" stroke-width="8"/><path d="M290 245c10-20 50-20 60 0" fill="#9cc98a" stroke="${G.greenLine}" stroke-width="2"/>
    <path d="M300 240c-80-20-120-120-90-160 30 20 60 70 90 150zM340 240c80-20 120-120 90-160-30 20-60 70-90 150z" fill="#f4b8c9" stroke="#b0446a" stroke-width="2"/>
    <path d="M285 245c-30 10-50 0-60-15M355 245c30 10 50 0 60-15" stroke="${G.greenLine}" stroke-width="5" fill="none"/>
    <ellipse cx="320" cy="215" rx="22" ry="26" fill="#d3e7a8" stroke="${G.greenLine}" stroke-width="2"/>${[[312, 208], [328, 208], [320, 224]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#fff" stroke="${G.greenLine}"/>`).join('')}
    <path d="M320 190V95" stroke="${G.greenLine}" stroke-width="5"/><ellipse cx="320" cy="90" rx="12" ry="7" fill="#c4df7a" stroke="${G.greenLine}" stroke-width="2"/>
    <path d="M300 235c-10-40-20-80-30-120M340 235c10-40 20-80 30-120" stroke="#c99a2a" stroke-width="2.5" fill="none"/><ellipse cx="268" cy="108" rx="8" ry="13" fill="#f0c84a" stroke="#a37a12"/><ellipse cx="372" cy="108" rx="8" ry="13" fill="#f0c84a" stroke="#a37a12"/>
    <ellipse cx="305" cy="243" rx="6" ry="3" fill="#f6bb83"/>`,
  labels: [['Anther', 268, 108, 'l', 100], ['Filament', 285, 170, 'l', 160], ['Petal', 235, 130, 'l', 60], ['Nectary', 305, 243, 'l', 245], ['Sepal', 240, 238, 'l', 285],
    ['Stigma', 330, 90, 'r', 70], ['Style', 320, 140, 'r', 140], ['Ovary', 340, 218, 'r', 195], ['Ovule', 328, 208, 'r', 235], ['Receptacle / stalk', 320, 280, 'r', 285]]
},
{
  key: 'wind-flower', name: 'Wind-pollinated flower', topicId: 't16', year: 'Y10', h: 280,
  description: 'A wind-pollinated (grass-type) flower: small dull bracts, no scent or nectar, anthers hanging outside on long filaments, and large feathery stigmas outside the flower to catch light, smooth pollen.',
  shapes: `<path d="M320 270V150" stroke="${G.greenLine}" stroke-width="5"/><path d="M320 160c-20-10-25-50-10-70 10 25 12 50 10 70zM320 160c20-10 25-50 10-70-10 25-12 50-10 70z" fill="#c7d6a4" stroke="${G.greenLine}" stroke-width="2"/>
    <path d="M312 120c-30 10-60 40-70 90M328 120c30 10 60 40 70 90" stroke="#a89a6a" stroke-width="2" fill="none"/><rect x="232" y="205" width="16" height="30" rx="5" fill="#e8d585" stroke="#a37a12"/><rect x="392" y="205" width="16" height="30" rx="5" fill="#e8d585" stroke="#a37a12"/>
    <path d="M315 95c-20-20-40-30-60-60M325 95c20-20 40-30 60-60" stroke="#bfa7c9" stroke-width="2" fill="none"/>${Array.from({ length: 8 }, (_, i) => `<path d="M${300 - i * 6} ${80 - i * 6}l-10-5M${340 + i * 6} ${80 - i * 6}l10-5" stroke="#bfa7c9" stroke-width="2"/>`).join('')}
    ${[[260, 250], [275, 262], [380, 255], [365, 266]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="#d9b54a"/>`).join('')}`,
  labels: [['Feathery stigma (outside the flower)', 270, 50, 'l', 50], ['Anther hanging outside', 240, 220, 'l', 220], ['Long filament', 270, 160, 'l', 150], ['Light, smooth pollen', 268, 256, 'l', 265],
    ['Small, dull bracts (no scent, no nectar)', 330, 120, 'r', 120], ['Stem', 320, 240, 'r', 240]]
},
{
  key: 'male', name: 'Male reproductive system', topicId: 't16', year: 'Y11', h: 280,
  description: 'Side view of the male reproductive system: testes in the scrotum, sperm ducts, prostate gland and seminal vesicles, urethra and penis; the bladder is shown for reference.',
  shapes: `<ellipse cx="300" cy="70" rx="36" ry="28" fill="#f3e7a6" stroke="#b89a2a" stroke-width="2"/>
    <path d="M300 98v40c0 40 40 60 90 60" stroke="#d9a13b" stroke-width="8" fill="none"/><ellipse cx="312" cy="140" rx="18" ry="12" fill="#e6c7a7" stroke="#8a6a4a"/><ellipse cx="270" cy="110" rx="10" ry="18" fill="#e6c7a7" stroke="#8a6a4a"/>
    <path d="M390 198c30 0 50 5 60 15" stroke="#e0b89a" stroke-width="26" stroke-linecap="round"/><path d="M380 199h80" stroke="#d9a13b" stroke-width="4"/>
    <path d="M330 220c0 30 40 40 50 10" fill="#e9c4b0" stroke="#8a6a4a" stroke-width="2"/><ellipse cx="352" cy="232" rx="14" ry="10" fill="#d8a08a" stroke="#8a6a4a"/>
    <path d="M352 222c-10-30-30-60-60-75-20-10-30-25-25-40" stroke="${G.blue}" stroke-width="3" fill="none"/>`,
  labels: [['Bladder', 300, 70, 'l', 50], ['Seminal vesicle', 270, 110, 'l', 110], ['Sperm duct', 285, 170, 'l', 170], ['Testis', 352, 232, 'l', 240],
    ['Prostate gland', 325, 140, 'r', 110], ['Urethra', 420, 199, 'r', 170], ['Penis', 445, 210, 'r', 210], ['Scrotum', 372, 236, 'r', 255]]
},
{
  key: 'female', name: 'Female reproductive system', topicId: 't16', year: 'Y11', h: 260,
  description: 'Front view of the female reproductive system: ovaries, oviducts (where fertilisation happens), uterus with its lining, cervix and vagina.',
  shapes: `<path d="M280 70c0 60 15 100 40 110 25-10 40-50 40-110z" fill="#f4c6cc" stroke="#b0446a" stroke-width="3"/><path d="M290 80c0 45 10 80 30 88 20-8 30-43 30-88" fill="none" stroke="#e58a9a" stroke-width="6"/>
    <path d="M282 78c-30-30-60-25-75 0M358 78c30-30 60-25 75 0" stroke="#b0446a" stroke-width="5" fill="none"/><path d="M207 78l-12 12M433 78l12 12" stroke="#b0446a" stroke-width="3"/>
    <ellipse cx="215" cy="110" rx="18" ry="12" fill="#f3e7a6" stroke="#b89a2a" stroke-width="2"/><ellipse cx="425" cy="110" rx="18" ry="12" fill="#f3e7a6" stroke="#b89a2a" stroke-width="2"/>
    <path d="M310 180h20v15h-20z" fill="#e58a9a" stroke="#b0446a"/><path d="M308 195l-6 50h36l-6-50" fill="#f8dadf" stroke="#b0446a" stroke-width="2"/>`,
  labels: [['Oviduct', 245, 55, 'l', 40], ['Ovary', 215, 110, 'l', 110], ['Funnel of oviduct', 197, 88, 'l', 75], ['Cervix', 310, 188, 'l', 190], ['Vagina', 305, 225, 'l', 235],
    ['Uterus', 330, 120, 'r', 60], ['Uterus lining (endometrium)', 350, 110, 'r', 110], ['Ovary', 425, 110, 'r', 160]]
},
{
  key: 'fetus', name: 'Fetus in the uterus', topicId: 't16', year: 'Y11', h: 300,
  description: 'A fetus inside the amniotic sac filled with amniotic fluid, connected by the umbilical cord to the placenta in the uterus wall; the cervix closes the uterus below.',
  shapes: `<path d="M210 150c0-90 50-130 110-130s110 40 110 130-50 130-110 130-110-40-110-130z" fill="#f4c6cc" stroke="#b0446a" stroke-width="6"/>
    <path d="M230 150c0-75 40-110 90-110s90 35 90 110-40 110-90 110-90-35-90-110z" fill="#e3f0f6" stroke="${G.blue}" stroke-width="2"/>
    <path d="M372 52c30 10 45 40 40 70l-35-10z" fill="#c76e8a" stroke="#8a2a4a" stroke-width="2"/>
    <circle cx="300" cy="120" r="34" fill="#f6dcd0" stroke="#b07a64" stroke-width="2"/><path d="M290 150c-20 30-10 70 30 80 30 5 45-25 30-55-10-20-40-30-60-25z" fill="#f6dcd0" stroke="#b07a64" stroke-width="2"/>
    <path d="M330 175c30-10 40-60 52-95" stroke="#b05a8a" stroke-width="6" fill="none"/><path d="M310 280h20" stroke="#b0446a" stroke-width="10"/>`,
  labels: [['Uterus wall (muscle)', 214, 150, 'l', 150], ['Amniotic sac', 238, 110, 'l', 90], ['Amniotic fluid', 260, 210, 'l', 225], ['Fetus', 300, 120, 'l', 40], ['Cervix', 320, 282, 'l', 285],
    ['Placenta', 398, 80, 'r', 60], ['Umbilical cord', 365, 120, 'r', 130]]
},
{
  key: 'dna', name: 'DNA structure', topicId: 't17', year: 'Y11', h: 280, tier: 'supplement',
  description: 'DNA is two strands coiled into a double helix. Each strand has a sequence of bases; bases on opposite strands pair: A with T, C with G.',
  shapes: `${Array.from({ length: 9 }, (_, i) => { const y = 30 + i * 27, s = Math.sin(i * 0.75), x1 = 320 - 80 * s, x2 = 320 + 80 * s; const pair = ['AT', 'CG', 'TA', 'GC', 'AT', 'GC', 'CG', 'TA', 'AT'][i]; const col = { A: '#e07b67', T: '#5aa0d8', C: '#e8c84a', G: '#6bb96b' }; const mid = (x1 + x2) / 2; return `<path d="M${x1} ${y}H${mid}" stroke="${col[pair[0]]}" stroke-width="9"/><path d="M${mid} ${y}H${x2}" stroke="${col[pair[1]]}" stroke-width="9"/>${Math.abs(x2 - x1) > 40 ? `<text x="${(x1 + mid) / 2}" y="${y + 4}" font-size="10" text-anchor="middle" fill="#10251f">${pair[0]}</text><text x="${(mid + x2) / 2}" y="${y + 4}" font-size="10" text-anchor="middle" fill="#10251f">${pair[1]}</text>` : ''}`; }).join('')}
    <path d="M320 30${Array.from({ length: 9 }, (_, i) => `L${(320 - 80 * Math.sin(i * 0.75)).toFixed(1)} ${30 + i * 27}`).join('')}" stroke="#7d5a3c" stroke-width="4" fill="none"/>
    <path d="M320 30${Array.from({ length: 9 }, (_, i) => `L${(320 + 80 * Math.sin(i * 0.75)).toFixed(1)} ${30 + i * 27}`).join('')}" stroke="#5a7d3c" stroke-width="4" fill="none"/>`,
  labels: [['Strand 1 (sugar–phosphate backbone)', 266, 57, 'l', 50], ['Base pair A–T', 280, 84, 'l', 120], ['Base pair C–G', 290, 111, 'l', 190], ['Strand 2', 395, 84, 'r', 80], ['Double helix', 395, 165, 'r', 165], ['Bonds between bases hold strands together', 320, 138, 'r', 240]]
},
{
  key: 'carbon', name: 'The carbon cycle', topicId: 't19', year: 'Y10', h: 330,
  description: 'Carbon dioxide in the air is taken in by photosynthesis; carbon passes to animals by feeding; respiration by plants, animals and decomposers returns carbon dioxide; dead remains may form fossil fuels, which release carbon dioxide on combustion.',
  shapes: `<defs><marker id="gis-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>
    <rect x="250" y="15" width="140" height="40" rx="20" fill="${G.tealSoft}" stroke="${G.teal}"/><text x="320" y="40" text-anchor="middle" font-size="13" fill="#10251f">CO₂ in air</text>
    <rect x="175" y="130" width="100" height="40" rx="12" fill="${G.green}" stroke="${G.greenLine}"/><text x="225" y="155" text-anchor="middle" font-size="13" fill="#10251f">Plants</text>
    <rect x="365" y="130" width="100" height="40" rx="12" fill="${G.orangeSoft}" stroke="${G.orange}"/><text x="415" y="155" text-anchor="middle" font-size="13" fill="#10251f">Animals</text>
    <rect x="235" y="220" width="170" height="40" rx="12" fill="#e6d9c7" stroke="#7d5a3c"/><text x="320" y="245" text-anchor="middle" font-size="12" fill="#10251f">Dead matter, decomposers</text>
    <rect x="250" y="285" width="140" height="35" rx="10" fill="#cfc7bd" stroke="#555"/><text x="320" y="307" text-anchor="middle" font-size="12" fill="#10251f">Fossil fuels</text>
    ${arrow(270, 55, 225, 128)}${arrow(240, 128, 285, 57)}${arrow(277, 150, 363, 150)}${arrow(420, 128, 375, 57)}${arrow(225, 172, 270, 218)}${arrow(415, 172, 370, 218)}${arrow(320, 218, 320, 58)}${arrow(320, 262, 320, 283)}${arrow(392, 300, 430, 300)}<path d="M430 300c40 0 50-260-38-262" stroke="currentColor" stroke-width="2" fill="none" marker-end="url(#gis-ah)"/>`,
  labels: [['Photosynthesis', 245, 95, 'l', 80], ['Respiration (plants)', 262, 90, 'l', 110], ['Death and decay', 245, 195, 'l', 200], ['Fossilisation', 320, 272, 'l', 275],
    ['Feeding', 320, 150, 'r', 115], ['Respiration (animals)', 398, 95, 'r', 75], ['Respiration (decomposers)', 320, 140, 'r', 200], ['Combustion', 470, 200, 'r', 255]]
},
{
  key: 'nitrogen', name: 'The nitrogen cycle', topicId: 't19', year: 'Y10', h: 340, tier: 'supplement',
  description: 'Nitrogen gas is fixed by nitrogen-fixing bacteria (some in root nodules) and lightning; plants absorb nitrate ions to make proteins; animals eat plants; decomposers turn proteins and urea into ammonium ions; nitrifying bacteria make nitrite then nitrate; denitrifying bacteria return nitrogen gas to the air.',
  shapes: `<defs><marker id="gis-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>
    ${[['Nitrogen gas (N₂) in air', 330, 32, 180, G.tealSoft, G.teal], ['Plant proteins', 245, 145, 120, G.green, G.greenLine], ['Animal proteins', 425, 145, 110, G.orangeSoft, G.orange], ['Ammonium ions', 425, 255, 110, '#e6d9c7', '#7d5a3c'], ['Nitrate ions', 245, 255, 120, '#e6d9c7', '#7d5a3c'], ['Nitrite ions', 335, 312, 100, '#e6d9c7', '#7d5a3c']].map(([t, x, y, w, f, st]) => `<rect x="${x - w / 2}" y="${y - 18}" width="${w}" height="36" rx="12" fill="${f}" stroke="${st}"/><text x="${x}" y="${y + 5}" text-anchor="middle" font-size="12" fill="#10251f">${t}</text>`).join('')}
    ${arrow(300, 50, 262, 125)}${arrow(245, 236, 245, 165)}${arrow(306, 145, 368, 145)}${arrow(290, 164, 380, 236)}${arrow(425, 164, 425, 236)}${arrow(400, 274, 372, 294)}${arrow(298, 304, 268, 275)}
    <path d="M186 255C160 205 160 80 238 40" stroke="currentColor" stroke-width="2" fill="none" marker-end="url(#gis-ah)"/>`,
  labels: [['Nitrogen fixation (root nodule bacteria, lightning)', 281, 88, 'l', 60], ['Denitrification (denitrifying bacteria)', 172, 160, 'l', 150], ['Absorption of nitrate ions by roots', 245, 200, 'l', 230],
    ['Feeding', 337, 145, 'r', 60], ['Decomposition of dead organisms and urea (decomposers)', 335, 200, 'r', 205], ['Nitrification (nitrifying bacteria)', 386, 284, 'r', 300], ['Nitrification', 283, 290, 'l', 310]]
},

{
  key: 'fermenter', name: 'A fermenter', topicId: 't21', year: 'Y10', h: 320, tier: 'supplement',
  description: 'An industrial fermenter: sterile nutrient and air inlets, a stirrer, a water jacket to control temperature, probes for temperature and pH, a gas outlet and a tap to collect the product.',
  shapes: `<rect x="250" y="50" width="140" height="220" rx="24" fill="#f4f1e8" stroke="#666" stroke-width="4"/><rect x="238" y="80" width="164" height="160" rx="18" fill="none" stroke="${G.blue}" stroke-width="8" opacity=".5"/>
    <rect x="258" y="120" width="124" height="140" rx="14" fill="#f3e7a6" opacity=".7"/><path d="M320 20v220" stroke="#555" stroke-width="5"/>${[160, 210].map(y => `<path d="M295 ${y}h50" stroke="#555" stroke-width="6"/>`).join('')}
    <path d="M200 255h60" stroke="#888" stroke-width="5"/><path d="M380 40h50M270 40h-50" stroke="#888" stroke-width="5"/><path d="M320 270v30" stroke="#888" stroke-width="6"/><path d="M350 60v80M365 60v70" stroke="${G.red}" stroke-width="3"/>
    <path d="M232 230h-30M408 100h30" stroke="${G.blue}" stroke-width="5"/>`,
  labels: [['Nutrient inlet (sterile)', 225, 40, 'l', 40], ['Motor / stirrer', 320, 30, 'l', 90], ['Water jacket (temperature)', 240, 160, 'l', 150], ['Cooling water in', 205, 230, 'l', 215], ['Sterile air in (oxygen)', 205, 255, 'l', 260],
    ['Gas outlet', 425, 40, 'r', 40], ['Temperature and pH probes', 357, 100, 'r', 100], ['Cooling water out', 435, 100, 'r', 140], ['Culture of microorganisms', 345, 230, 'r', 210], ['Tap to collect product', 320, 295, 'r', 295]]
},
{
  key: 'growth-curve', name: 'Sigmoid population growth curve', topicId: 't19', year: 'Y10', h: 270,
  description: 'Number of individuals against time: lag phase, exponential (log) phase, stationary phase and death phase.',
  shapes: `<path d="M180 230V30M180 230h290" stroke="currentColor" stroke-width="2"/><text x="325" y="262" text-anchor="middle" font-size="12" fill="currentColor">Time</text><text transform="translate(168 135) rotate(-90)" text-anchor="middle" font-size="12" fill="currentColor">Population size</text>
    <path d="M182 225c30 0 40-5 55-20s35-120 70-150 50-12 90-12 40 5 70 70" stroke="${G.teal}" stroke-width="4" fill="none"/>
    ${[215, 300, 400].map(x => `<path d="M${x} 230V40" stroke="${G.grey}" stroke-dasharray="4 5"/>`).join('')}`,
  labels: [['Lag phase', 198, 222, 'l', 200], ['Exponential (log) phase', 265, 130, 'l', 100], ['Stationary phase', 350, 44, 'r', 40], ['Death phase', 450, 100, 'r', 130]]
}
];

// Draw a diagram. hidden: replace label text with numbers (for recall practice).
// extended: false hides Supplement-only labels.
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const wrap = t => { if (t.length <= 28) return [t]; const out = []; let line = ''; for (const w of t.split(' ')) { if ((line + ' ' + w).trim().length > 28 && line) { out.push(line); line = w; } else line = (line + ' ' + w).trim(); } if (line) out.push(line); return out; };
export function visibleLabels(d, extended = true) { return d.labels.filter(l => extended || l[5] !== 'supplement'); }
export function renderGisDiagram(d, {hidden = false, extended = true} = {}) {
  const labels = visibleLabels(d, extended);
  const parts = labels.map(([text, ax, ay, side, ly], i) => {
    const lx = side === 'l' ? 150 : 490, tx = side === 'l' ? 146 : 494;
    const shown = hidden ? String(i + 1) : esc(text);
    return `<g class="gis-label"><path d="M${ax} ${ay}L${lx} ${ly}" stroke="currentColor" stroke-width="1" opacity=".55"/><circle cx="${ax}" cy="${ay}" r="2.6" fill="#176b52"/>`
      + `<text x="${tx}" y="${ly + 4}" font-size="${hidden ? 14 : 12.5}" font-weight="${hidden ? 800 : 500}" text-anchor="${side === 'l' ? 'end' : 'start'}" fill="currentColor">${wrap(shown).map((t, k, all) => `<tspan x="${tx}" dy="${k ? 14 : -(all.length - 1) * 7}">${t}</tspan>`).join('')}</text></g>`;
  }).join('');
  return `<div class="gis-diagram-wrap" style="overflow-x:auto;-webkit-overflow-scrolling:touch"><svg class="diagram gis-diagram" viewBox="-70 0 780 ${d.h}" role="img" aria-label="${esc(d.name + '. ' + d.description)}" style="width:100%;min-width:620px;height:auto;max-width:760px;display:block;margin:0 auto">${d.shapes}${parts}</svg></div>`;
}
export const gisDiagramByKey = Object.fromEntries(gisDiagrams.map(d => [d.key, d]));

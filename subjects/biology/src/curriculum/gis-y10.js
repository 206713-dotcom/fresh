// Fresh Biology · GIS Year 10 notes, in the GIS Biology year-plan order.
// Cambridge IGCSE Biology 0610 (2026–2028) objectives; sections tagged 'S' are Supplement only.
export const y10 = [
{
  unit: 'Plants', term: 'Term 1',
  lessons: [
  {
    slug: 'cell-structure', topicId: 't02', tier: 'core', refs: ['2.1.1', '2.1.2', '2.1.3', '2.1.4', '2.1.5'], visual: 'gis:plant-cell+animal-cell+bacterial-cell',
    title: 'Plant, animal and bacterial cells',
    body: 'All cells come from the division of existing cells. Plant and animal cells share several structures; plant cells have three extra ones, and bacterial cells are organised differently.',
    sections: [
      ['In both plant and animal cells', 'Cell membrane: controls what enters and leaves the cell (partially permeable). Cytoplasm: where most chemical reactions happen. Nucleus: contains the genetic material (DNA in chromosomes) that controls the cell. Mitochondria: site of aerobic respiration, releasing energy. Ribosomes: site of protein synthesis.'],
      ['Only in plant cells', 'Cell wall made of cellulose: strengthens the cell and stops it bursting. Large permanent vacuole containing cell sap: keeps the cell turgid. Chloroplasts (in green parts): contain chlorophyll and are the site of photosynthesis.'],
      ['Bacterial cells', 'Cell wall (not cellulose), cell membrane, cytoplasm and ribosomes. No nucleus: the DNA is a single circular chromosome loose in the cytoplasm, plus small rings of DNA called plasmids. Bacteria do not have mitochondria.'],
      ['Spotting them in images', 'A regular, box-like outline with a thick wall and green chloroplasts → plant cell. An irregular outline with no wall → animal cell. Very small with no nucleus → bacterium.']
    ],
    markScheme: ['Function of each named structure', 'Plant extras: cellulose cell wall, large permanent vacuole, chloroplasts', 'Bacteria: circular DNA and plasmids, no nucleus', 'New cells are produced by division of existing cells'],
    mistakes: ['Saying the cell wall controls what enters — that is the membrane.', 'Saying the mitochondria “make energy” — they release energy by respiration.']
  },
  {
    slug: 'specialised-cells', topicId: 't02', tier: 'core', refs: ['2.1.6', '2.1.7'],
    title: 'Specialised cells and levels of organisation',
    body: 'Specialised cells have features that suit their function. Similar cells work together as tissues, tissues as organs, organs as organ systems.',
    sections: [
      ['Six cells to know', 'Ciliated cells: move mucus in the trachea and bronchi. Root hair cells: absorb water and mineral ions. Palisade mesophyll cells: photosynthesis. Neurones: conduct electrical impulses. Red blood cells: transport oxygen. Sperm and egg cells (gametes): reproduction.'],
      ['Definitions', 'Cell: the basic unit of life. Tissue: a group of cells with similar structures, working together to perform a shared function. Organ: a structure made of a group of tissues working together to perform specific functions. Organ system: a group of organs with related functions, working together. Organism: a whole living thing.']
    ],
    markScheme: ['Match each specialised cell to its function', 'Tissue → organ → organ system definitions in the syllabus wording'],
    mistakes: ['Confusing tissue and organ (e.g. calling the heart a tissue).']
  },
  {
    slug: 'microscopes', topicId: 't02', tier: 'core', refs: ['2.2.1', '2.2.2', '2.2.3'],
    title: 'Microscopes and magnification',
    body: 'A light microscope lets you see cells; magnification links the size of the image to the real size.',
    sections: [
      ['The formula', 'magnification = image size ÷ actual size. Measure the image in mm, use the same unit for both sizes, and give magnification as a number with × and no unit.'],
      ['Units', '1 mm = 1000 µm. Cells are usually 10–100 µm across.', 'S'],
      ['Preparing a slide', 'Place a thin specimen on a slide, add a drop of water or stain (iodine for plant cells, methylene blue for cheek cells), lower a cover slip at an angle to avoid air bubbles, start on the lowest power objective.']
    ],
    markScheme: ['Formula and units consistent', 'Extended: mm ↔ µm conversion'],
    mistakes: ['Rounding too early in multi-step calculations.']
  },
  {
    slug: 'diffusion', topicId: 't03', tier: 'core', refs: ['3.1.1', '3.1.2', '3.1.3', '3.1.4', '3.1.5'],
    title: 'Diffusion',
    body: 'Diffusion is the net movement of particles from a region of their higher concentration to a region of their lower concentration, down a concentration gradient, as a result of their random movement.',
    sections: [
      ['Where the energy comes from', 'The energy for diffusion comes from the kinetic energy of the random movement of molecules and ions. Diffusion is passive: the cell does not use energy from respiration.'],
      ['Diffusion in organisms', 'Oxygen into and carbon dioxide out of the alveoli and leaf cells; carbon dioxide into leaves through stomata; digested food from the small intestine into the blood; urea from cells into the blood. Some substances move into and out of cells by diffusion through the cell membrane.'],
      ['Factors affecting the rate', 'Faster with a larger surface area, a higher temperature, a steeper concentration gradient and a shorter distance. Investigate with agar cubes containing indicator, or with dye in water at different temperatures.']
    ],
    markScheme: ['“Net movement”, “higher to lower concentration”, “down a concentration gradient”, “random movement” — learn the definition', 'Energy from kinetic energy of particles; passive', 'Four factors: surface area, temperature, concentration gradient, distance'],
    mistakes: ['Writing “particles move from high to low” without “net” — particles move in both directions.', 'Saying diffusion needs energy from respiration.']
  },
  {
    slug: 'active-transport', topicId: 't03', tier: 'core', refs: ['3.3.1', '3.3.2', '3.3.3', '8.2.1', '8.2.2'],
    title: 'Root hair cells and active transport',
    body: 'Active transport is the movement of particles through a cell membrane from a region of lower concentration to a region of higher concentration — against a concentration gradient — using energy from respiration.',
    sections: [
      ['Why it matters', 'Root hair cells take in mineral ions (such as nitrate) from soil, where the concentration is lower than inside the cell. Diffusion alone could not do this. Active transport is also used to absorb glucose in the small intestine.', 'S'],
      ['How it works', 'Protein carriers in the cell membrane bind the ion or molecule and move it across the membrane. Energy from respiration changes the shape of the carrier.', 'S'],
      ['Root hair cells', 'A long extension gives a large surface area, increasing the uptake of water and mineral ions. Many mitochondria release the energy for active transport.']
    ],
    markScheme: ['Against a concentration gradient / low to high', 'Uses energy from respiration', 'Extended: protein carriers in the membrane', 'Root hair: large surface area for uptake'],
    mistakes: ['Saying root hairs absorb water by active transport — water enters by osmosis; ions by active transport.']
  },
  {
    slug: 'osmosis', topicId: 't03', tier: 'core', refs: ['3.2.1', '3.2.2', '3.2.3', '3.2.4', '3.2.5', '3.2.6', '3.2.7', '3.2.8', '3.2.9'],
    title: 'Osmosis and water potential',
    body: 'Osmosis is the net movement of water molecules from a region of higher water potential (dilute solution) to a region of lower water potential (concentrated solution), through a partially permeable membrane.',
    sections: [
      ['Water as a solvent', 'Water dissolves substances so they can be digested, excreted (urea in urine) and transported (in blood plasma, xylem and phloem).'],
      ['Investigations', 'Dialysis tubing filled with sugar solution and placed in water gains mass and swells. Potato cylinders in a range of sucrose solutions: find the percentage change in mass; the concentration where the mass does not change matches the potato’s own.'],
      ['Plant cells in different solutions', 'In water: the cell takes in water by osmosis and the vacuole pushes the membrane against the wall — the cell is turgid. Plants are supported by this pressure of water inside cells pushing outwards on the cell wall.'],
      ['Turgor and plasmolysis', 'In a solution with a lower water potential than the cell, water leaves by osmosis, the cell becomes flaccid, and eventually the membrane pulls away from the wall (plasmolysis). In a higher water potential, water enters, turgor pressure builds against the wall and the cell becomes turgid. The cell wall stops it bursting.', 'S'],
      ['Animal cells', 'Animal cells have no wall: in water a red blood cell swells and bursts; in a concentrated solution it shrinks.', 'S'],
      ['Why it matters', 'Water uptake by root hair cells, water loss from leaves, and keeping the water potential of blood plasma constant all depend on osmosis.', 'S']
    ],
    markScheme: ['Net movement of water through a partially permeable membrane', 'Higher to lower water potential (Extended)', 'Turgid, flaccid, plasmolysis, turgor pressure — use the right term', 'Cell wall prevents bursting'],
    mistakes: ['“Water moves from high to low concentration” — say water potential, or dilute to concentrated solution.', 'Saying the cell wall is partially permeable — it is fully permeable.']
  },
  {
    slug: 'plant-classification', topicId: 't01', tier: 'core', refs: ['1.3.1', '1.3.5', '1.3.6'],
    title: 'Plant classification',
    body: 'Plants are multicellular, have cells with a cellulose cell wall and contain chloroplasts, so they can photosynthesise.',
    sections: [
      ['Ferns', 'Have leaves called fronds; do not produce flowers; reproduce by spores.', 'S'],
      ['Flowering plants', 'Reproduce sexually by flowers and seeds. Monocotyledons: one cotyledon in the seed, leaves with parallel veins, flower parts in threes. Dicotyledons: two cotyledons, leaves with branching (net) veins, flower parts in fours or fives.', 'S'],
      ['Drawing leaves', 'Draw the outline and main veins with single clear lines, then label blade (lamina), midrib, veins and petiole.']
    ],
    markScheme: ['Plant kingdom: multicellular, cellulose walls, chloroplasts/photosynthesis', 'Extended: ferns vs flowering plants; monocot vs dicot features'],
    mistakes: ['Saying ferns produce seeds.']
  },
  {
    slug: 'leaf-structure', topicId: 't06', tier: 'core', refs: ['6.2.1', '6.2.2', '6.2.3'], visual: 'gis:leaf',
    title: 'Cross-section of a leaf',
    body: 'Leaves are adapted for photosynthesis: a large surface area to absorb light and carbon dioxide, and thin so gases have a short diffusion distance.',
    sections: [
      ['From top to bottom', 'Waxy cuticle → upper epidermis → palisade mesophyll → spongy mesophyll with air spaces → lower epidermis with stomata and guard cells. Vascular bundles contain xylem and phloem.'],
      ['How each part helps', 'Cuticle: waterproof, reduces water loss; transparent. Upper epidermis: thin and transparent to let light through. Palisade mesophyll: tightly packed, many chloroplasts, near the top — most photosynthesis. Spongy mesophyll: air spaces allow gases to diffuse to and from cells. Stomata: let carbon dioxide in and oxygen out; guard cells open and close them. Xylem: brings water and mineral ions. Phloem: carries sucrose and amino acids away.']
    ],
    markScheme: ['Large surface area → absorb more light/CO₂', 'Thin → short diffusion distance', 'Palisade: many chloroplasts', 'Air spaces → diffusion of gases', 'Stomata → gas exchange'],
    mistakes: ['Saying stomata let in oxygen for photosynthesis.']
  },
  {
    slug: 'photosynthesis', topicId: 't06', tier: 'core', refs: ['6.1.1', '6.1.2', '6.1.3', '6.1.4', '6.1.5', '6.1.6', '6.1.7', '6.1.9', '6.1.10'],
    title: 'Photosynthesis',
    body: 'Photosynthesis is the process by which plants synthesise carbohydrates from raw materials using energy from light.',
    sections: [
      ['Equations', 'carbon dioxide + water → glucose + oxygen (in the presence of light and chlorophyll).'],
      ['Balanced equation', '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂', 'S'],
      ['Chlorophyll', 'Chlorophyll is a green pigment found in chloroplasts. It transfers light energy into chemical energy in molecules, for the synthesis of carbohydrates.'],
      ['Uses of the glucose', 'Starch as an energy store; cellulose to build cell walls; glucose for respiration; sucrose for transport in the phloem; nectar to attract insects for pollination.'],
      ['Mineral ions', 'Nitrate ions are needed to make amino acids (and so proteins). Magnesium ions are needed to make chlorophyll. Lack of magnesium → yellow leaves.'],
      ['Investigations', 'De-starch a plant in the dark for 48 hours first. Test a leaf for starch (boil in water, then ethanol to remove chlorophyll, rinse, add iodine). Variegated leaf → only green parts make starch (need chlorophyll). Foil strip → covered part has no starch (need light). Leaf in a bag with soda lime → no starch (need carbon dioxide). Always use a control.'],
      ['Hydrogencarbonate indicator', 'Aquatic plants in light take in carbon dioxide → indicator turns purple. In the dark they only respire, adding carbon dioxide → indicator turns yellow. Orange-red = atmospheric level.']
    ],
    markScheme: ['Word equation (and balanced equation for Extended)', 'Chlorophyll transfers light energy to chemical energy', 'Nitrate → amino acids/proteins; magnesium → chlorophyll', 'Destarching and a control in every investigation'],
    mistakes: ['“Chlorophyll makes energy” — it absorbs and transfers light energy.', 'Forgetting to de-starch the plant.']
  },
  {
    slug: 'limiting-factors', topicId: 't06', tier: 'core', refs: ['6.1.8', '6.1.11'],
    title: 'Limiting factors of photosynthesis',
    body: 'Light intensity, carbon dioxide concentration and temperature all affect the rate of photosynthesis.',
    sections: [
      ['Measuring the rate', 'Count bubbles of oxygen from pondweed per minute (or collect the gas) at different distances from a lamp. Keep temperature constant with a heat filter or water bath, and use the same piece of pondweed and the same hydrogencarbonate concentration.'],
      ['Limiting factor', 'A limiting factor is the factor that is in shortest supply, so it limits the rate. On a graph: where the line is rising, the factor on the x-axis is limiting. Where it levels off, something else (carbon dioxide, temperature, chlorophyll) is limiting.', 'S'],
      ['Using it in glasshouses', 'Growers add heating, lighting and extra carbon dioxide (from burning paraffin) to raise yield — but only up to the point where another factor limits.', 'S']
    ],
    markScheme: ['Identify the limiting factor from the shape of a graph', 'Plateau → another factor is limiting', 'Temperature affects enzymes in photosynthesis'],
    mistakes: ['Saying light is limiting on the plateau.']
  },
  {
    slug: 'xylem-phloem', topicId: 't08', tier: 'core', refs: ['8.1.1', '8.1.2', '8.1.3', '8.2.3', '8.2.4'], visual: 'gis:root-stem',
    title: 'Xylem, phloem and the pathway of water',
    body: 'Xylem transports water and mineral ions and provides support. Phloem transports sucrose and amino acids.',
    sections: [
      ['Where they are', 'In the root: xylem in the centre (often star-shaped) with phloem between its arms. In the stem: vascular bundles in a ring, xylem on the inside, phloem on the outside. In the leaf: in the veins, xylem on the upper side.'],
      ['Xylem structure', 'Xylem vessels are long, hollow tubes of dead cells joined end to end with no cross walls, so water can flow continuously. Their walls are thickened with lignin, which makes them strong and waterproof and supports the plant.', 'S'],
      ['Water’s pathway', 'Root hair cells → root cortex cells → xylem → up the stem → mesophyll cells in the leaf.'],
      ['Tracing water', 'Stand a celery stalk in coloured dye; cut it after a few hours — the dye shows where the xylem is.']
    ],
    markScheme: ['Xylem: water + mineral ions, support; phloem: sucrose + amino acids', 'Extended: no cross walls, hollow, lignin', 'Water path: root hair → cortex → xylem → mesophyll'],
    mistakes: ['Saying phloem carries glucose — it carries sucrose.']
  },
  {
    slug: 'transpiration', topicId: 't08', tier: 'core', refs: ['8.3.1', '8.3.2', '8.3.4', '8.3.5', '8.3.7'],
    title: 'Transpiration',
    body: 'Transpiration is the loss of water vapour from leaves. Water evaporates from the surfaces of the mesophyll cells into the air spaces, then diffuses out of the leaf through the stomata as water vapour.',
    sections: [
      ['Air spaces and stomata', 'The large surface area of the mesophyll cell walls and the air spaces lets a lot of water evaporate; open stomata let the vapour diffuse out.', 'S'],
      ['Transpiration pull', 'Water lost from the leaf is replaced from the xylem. Water molecules are attracted to each other (cohesion), so a continuous column of water is pulled up the xylem from the roots.', 'S'],
      ['Wilting', 'If water is lost faster than it is taken up, cells lose water by osmosis, become flaccid, and the leaves droop. Closing stomata reduces the loss.', 'S']
    ],
    markScheme: ['Evaporation from mesophyll surfaces → diffusion of water vapour through stomata', 'Extended: transpiration pull and cohesion between water molecules', 'Extended: wilting = cells lose turgor'],
    mistakes: ['Saying water “evaporates from the stomata”.']
  },
  {
    slug: 'measuring-transpiration', topicId: 't08', tier: 'core', refs: ['8.3.3', '8.3.6'],
    title: 'Measuring transpiration',
    body: 'A potometer measures water uptake, which is used as an estimate of transpiration.',
    sections: [
      ['Using a potometer', 'Cut the shoot under water and fit it under water so no air enters. Seal joints. Measure how far an air bubble moves along a capillary tube in a set time. Reset the bubble with the reservoir.'],
      ['Effects of conditions', 'Higher temperature: more kinetic energy, faster evaporation and diffusion → faster transpiration. Wind: removes water vapour from around the leaf, keeping a steep concentration gradient → faster. Higher humidity: smaller concentration gradient of water vapour → slower.', 'S']
    ],
    markScheme: ['Potometer measures water uptake, not loss directly', 'Explain each factor using evaporation and concentration gradient'],
    mistakes: ['“Wind blows the water out of the leaf.”']
  },
  {
    slug: 'translocation', topicId: 't08', tier: 'core', refs: ['8.4.1', '8.4.2', '8.4.3'],
    title: 'Phloem and translocation',
    body: 'Translocation is the movement of sucrose and amino acids in phloem from sources to sinks.',
    sections: [
      ['Sources and sinks', 'Source: a part of a plant that releases sucrose or amino acids (e.g. photosynthesising leaves). Sink: a part that uses or stores them (e.g. roots, growing buds, fruits, storage organs).'],
      ['Changing roles', 'A part can be a source at one time and a sink at another. In spring, a potato tuber is a source: stored starch is converted to sucrose for new shoots. In summer, it is a sink as leaves send sucrose down to be stored as starch.', 'S']
    ],
    markScheme: ['Translocation: sucrose and amino acids, source → sink, in phloem', 'Extended: example of a part switching between source and sink'],
    mistakes: ['Mixing translocation with transpiration.']
  },
  {
    slug: 'auxins', topicId: 't14', tier: 'core', refs: ['14.5.1', '14.5.2', '14.5.3', '14.5.4', '14.5.5'],
    title: 'Plant coordination: tropisms and auxin',
    body: 'Gravitropism is a response in which part of a plant grows towards or away from gravity. Phototropism is a response in which part of a plant grows towards or away from the direction from which light is coming.',
    sections: [
      ['Responses', 'Shoots grow towards light (positive phototropism) and away from gravity (negative gravitropism). Roots grow towards gravity (positive gravitropism).'],
      ['Investigating', 'Seedlings in a box with light from one side; seedlings on a clinostat (rotating) as a control for gravity.'],
      ['Auxin', 'Tropisms are an example of the chemical control of plant growth. Auxin is made in the shoot tip and diffuses through the plant from the tip. In a shoot lit from one side, auxin moves to the shaded side. Auxin stimulates cell elongation, so cells on the shaded side grow longer and the shoot bends towards the light.', 'S']
    ],
    markScheme: ['Correct definitions of gravitropism and phototropism', 'Extended: auxin made in tip → unequal distribution → cell elongation on the shaded side'],
    mistakes: ['Saying auxin makes cells divide on the shaded side — it makes them elongate.', 'Saying light “destroys” auxin — the mark scheme credits auxin moving to the shaded side.']
  },
  {
    slug: 'plant-reproduction', topicId: 't16', tier: 'core', refs: ['16.1.1', '16.1.2', '16.2.1', '16.2.2', '16.2.3', '16.2.4', '16.3.1', '16.3.2'], visual: 'gis:flower',
    title: 'Sexual and asexual reproduction; parts of a flower',
    body: 'Asexual reproduction is a process resulting in the production of genetically identical offspring from one parent. Sexual reproduction is a process involving the fusion of the nuclei of two gametes to form a zygote and the production of offspring that are genetically different from each other.',
    sections: [
      ['Asexual examples', 'Bacteria by binary fission; potato tubers; strawberry runners; spider plants; fungi by spores.'],
      ['Fertilisation', 'Fertilisation is the fusion of the nuclei of gametes. Gametes are haploid; the zygote is diploid.', 'S'],
      ['Comparing them', 'Asexual: one parent, fast, no need for a mate, but no variation, so a whole population can be wiped out by one disease. Sexual: variation, so a species can adapt to change — but slower, and needs pollinators or mates.', 'S'],
      ['Flower parts', 'Sepals protect the bud. Petals attract insects. Stamen = anther (makes pollen, the male gamete) + filament. Carpel = stigma (receives pollen) + style + ovary (contains ovules with the female gametes). Nectary makes nectar.']
    ],
    markScheme: ['Definitions of asexual and sexual reproduction', 'Functions of sepal, petal, anther, filament, stigma, style, ovary, ovule', 'Extended: advantages and disadvantages for a population'],
    mistakes: ['Calling pollen the male gamete itself — the male gamete is the nucleus inside the pollen grain.']
  },
  {
    slug: 'pollination', topicId: 't16', tier: 'core', refs: ['16.3.3', '16.3.4', '16.3.5', '16.3.6', '16.3.7', '16.3.8'], visual: 'gis:flower+wind-flower',
    title: 'Pollination and fertilisation in plants',
    body: 'Pollination is the transfer of pollen grains from an anther to a stigma.',
    sections: [
      ['Self and cross', 'Self-pollination: pollen from the anther of a flower to the stigma of the same flower or a different flower on the same plant. Cross-pollination: to a flower on a different plant of the same species.'],
      ['Consequences', 'Self-pollination needs no pollinator but gives little variation. Cross-pollination gives more variation (better able to adapt) but depends on pollinators or wind.', 'S'],
      ['Insect vs wind', 'Insect-pollinated: large brightly coloured petals, scent, nectar, anthers and stigma inside the flower, sticky stigma, fewer larger sticky/spiky pollen grains. Wind-pollinated: small dull petals, no scent or nectar, anthers and feathery stigmas hanging outside, lots of small, light, smooth pollen.'],
      ['Fertilisation', 'A pollen tube grows from the pollen grain down the style to the ovule; the male nucleus travels down the tube and fuses with the female nucleus in the ovule. The ovule becomes a seed and the ovary becomes the fruit.', 'S']
    ],
    markScheme: ['Pollination ≠ fertilisation', 'Compare insect and wind flowers feature by feature', 'Extended: pollen tube grows to ovule, nuclei fuse'],
    mistakes: ['Saying pollination is fertilisation.']
  },
  {
    slug: 'germination', topicId: 't16', tier: 'core', refs: ['16.3.9'],
    title: 'Germination',
    body: 'Seeds need water, oxygen and a suitable temperature to germinate.',
    sections: [
      ['Why each is needed', 'Water: activates enzymes and lets the seed swell and the testa split. Oxygen: for aerobic respiration to release energy for growth. Warmth: enzymes work at a suitable rate.'],
      ['Investigating', 'Set up tubes of cress seeds: dry cotton wool (no water), boiled cooled water with an oil layer (no oxygen), a fridge (cold), and a control with all three. Light is not needed for germination.']
    ],
    markScheme: ['Water, oxygen, suitable temperature', 'Control with all conditions present'],
    mistakes: ['Saying seeds need light or soil to germinate.']
  }
  ]
},
{
  unit: 'Microbes and viruses', term: 'Term 2',
  lessons: [
  {
    slug: 'five-kingdoms', topicId: 't01', tier: 'core', refs: ['1.3.4', '1.3.7'], visual: 'gis:bacterial-cell',
    title: 'Bacteria, fungi, protoctists and viruses',
    body: 'Living things are placed into five kingdoms: animals, plants, fungi, prokaryotes and protoctists. Viruses are not part of any kingdom.',
    sections: [
      ['Kingdom features', 'Prokaryotes (bacteria): single cells, no nucleus, circular DNA, cell wall not made of cellulose. Fungi: cell walls of chitin, feed by secreting enzymes and absorbing the products (saprotrophic), many are made of hyphae; yeast is single-celled. Protoctists: mostly single-celled with a nucleus, some photosynthesise (algae), some feed like animals (Amoeba).', 'S'],
      ['Viruses', 'Viruses are not cells. They contain genetic material (DNA or RNA) inside a protein coat. They can only reproduce inside a host cell.', 'S']
    ],
    markScheme: ['Extended: name the five kingdoms with one feature each', 'Extended: virus = protein coat + genetic material'],
    mistakes: ['Calling viruses bacteria or saying antibiotics kill them.']
  },
  {
    slug: 'microbe-reproduction', topicId: 't16', tier: 'core', refs: ['16.1.1', '16.1.2', '19.4.5'],
    title: 'How microbes reproduce',
    body: 'Bacteria reproduce asexually by binary fission: the cell copies its DNA and splits into two. In good conditions this can happen about every 20 minutes. Fungi reproduce using spores. Viruses take over a host cell to make new viruses.',
    sections: [
      ['Growth of a culture', 'Numbers in a culture follow a sigmoid curve: lag phase (adjusting, making enzymes), exponential (log) phase, stationary phase (birth rate = death rate as food runs short and toxins build up) and death phase.'],
      ['Virus replication', 'The virus attaches to a host cell and injects its genetic material; the host cell makes new virus parts; new viruses are released, often destroying the cell.']
    ],
    markScheme: ['Binary fission = asexual, identical offspring', 'Name the phases of the growth curve'],
    mistakes: ['Saying viruses divide by binary fission.']
  },
  {
    slug: 'aerobic-respiration', topicId: 't12', tier: 'core', refs: ['12.1.1', '12.1.2', '12.2.1', '12.2.2', '12.2.3'],
    title: 'Respiration and aerobic respiration',
    body: 'Respiration is the chemical reactions in cells that break down nutrient molecules and release energy for metabolism. Aerobic respiration is the chemical reactions in cells that use oxygen to break down nutrient molecules to release energy.',
    sections: [
      ['Uses of energy', 'Muscle contraction, protein synthesis, cell division, active transport, growth, the passage of nerve impulses, and maintaining a constant body temperature.'],
      ['Equation', 'glucose + oxygen → carbon dioxide + water'],
      ['Balanced equation', 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O', 'S'],
      ['Temperature and yeast', 'Measure the rate of respiration of yeast in sugar solution by counting carbon dioxide bubbles per minute at different temperatures in water baths. The rate rises to an optimum then falls, because respiration is controlled by enzymes.']
    ],
    markScheme: ['Respiration releases energy (never “makes” or “produces” energy)', 'Word equation; balanced equation (Extended)', 'List at least three uses of energy'],
    mistakes: ['Confusing respiration with breathing.', 'Writing “produces energy”.']
  },
  {
    slug: 'anaerobic-respiration', topicId: 't12', tier: 'core', refs: ['12.3.1', '12.3.2', '12.3.3', '12.3.4', '12.3.5', '12.3.6', '12.3.7'],
    title: 'Anaerobic respiration',
    body: 'Anaerobic respiration is the chemical reactions in cells that break down nutrient molecules to release energy without using oxygen. It releases much less energy per glucose molecule than aerobic respiration.',
    sections: [
      ['Yeast', 'glucose → alcohol (ethanol) + carbon dioxide'],
      ['Balanced equation for yeast', 'C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂', 'S'],
      ['Muscles during vigorous exercise', 'glucose → lactic acid'],
      ['Oxygen debt', 'Lactic acid builds up in muscles and blood during vigorous exercise, causing an oxygen debt. After exercise, a fast heart rate carries lactic acid to the liver, and deep, fast breathing supplies extra oxygen for the aerobic respiration of lactic acid in the liver.', 'S']
    ],
    markScheme: ['Less energy per glucose than aerobic', 'Yeast → ethanol + CO₂; muscle → lactic acid', 'Extended: oxygen debt removed by heart rate and breathing continuing, lactic acid broken down in the liver'],
    mistakes: ['Saying muscles make carbon dioxide in anaerobic respiration.']
  },
  {
    slug: 'carbon-cycle', topicId: 't19', tier: 'core', refs: ['19.3.1'], visual: 'gis:carbon',
    title: 'The carbon cycle',
    body: 'Carbon is recycled between the air and living things by photosynthesis, feeding, respiration, decomposition, fossilisation and combustion.',
    sections: [
      ['The processes', 'Photosynthesis removes carbon dioxide from the air into plants. Feeding passes carbon compounds along food chains. Respiration by plants, animals and decomposers returns carbon dioxide to the air. Decomposers break down dead organisms and waste. Some carbon is locked up as fossil fuels (fossilisation) and released by combustion.'],
      ['Why it matters now', 'Burning fossil fuels and deforestation increase the carbon dioxide concentration in the atmosphere, adding to the enhanced greenhouse effect.']
    ],
    markScheme: ['Name each process and the direction carbon moves', 'Decomposers respire, releasing CO₂'],
    mistakes: ['Forgetting that plants also respire.']
  },
  {
    slug: 'nitrogen-cycle', topicId: 't19', tier: 'supplement', refs: ['19.3.2', '19.3.3'], visual: 'gis:nitrogen',
    title: 'The nitrogen cycle',
    body: 'Nitrogen is needed to make amino acids and proteins, but most organisms cannot use nitrogen gas directly. Microorganisms do most of the work in this cycle.',
    sections: [
      ['Nitrogen fixation', 'Nitrogen-fixing bacteria (some free in soil, some in root nodules of legumes) convert nitrogen gas into ammonium/nitrogen compounds. Lightning and the Haber process also fix nitrogen.'],
      ['Into plants and animals', 'Plants absorb nitrate ions by active transport and use them to make amino acids and proteins. Animals eat plants and use the proteins.'],
      ['Decomposition and nitrification', 'Decomposers break down proteins in dead organisms and urea into ammonium ions (deamination/ammonification). Nitrifying bacteria convert ammonium ions to nitrite then nitrate ions. This needs oxygen.'],
      ['Denitrification', 'Denitrifying bacteria convert nitrate ions back to nitrogen gas. They are common in waterlogged, airless soil.']
    ],
    markScheme: ['Correct named microorganism for each step', 'Nitrifying needs aerobic conditions; denitrifying in anaerobic/waterlogged soil'],
    mistakes: ['Mixing up nitrifying and nitrogen-fixing bacteria.']
  },
  {
    slug: 'eutrophication', topicId: 't20', tier: 'core', refs: ['20.3.1', '20.3.4'],
    title: 'Eutrophication',
    body: 'Untreated sewage and excess fertiliser running into rivers and lakes add nutrients and lead to the death of aquatic organisms.',
    sections: [
      ['The sequence', 'Increased availability of nitrate and other ions → increased growth of producers (algae) → increased decomposition after the producers die → increased aerobic respiration by decomposers (bacteria) → reduction in dissolved oxygen → death of organisms that need dissolved oxygen in water, such as fish.', 'S'],
      ['Core points', 'Sewage and fertiliser increase nutrients in water; algae grow and block light; plants below die; bacteria decompose them and use up oxygen; fish die.']
    ],
    markScheme: ['Get the order right — every step is a mark', 'It is the decomposing bacteria that use up the oxygen'],
    mistakes: ['Saying the algae use up the oxygen.', 'Saying fish die because of the fertiliser poisoning them.']
  },
  {
    slug: 'populations', topicId: 't19', tier: 'core', refs: ['19.4.1', '19.4.2', '19.4.3', '19.4.4', '19.4.5', '19.4.6', '19.4.7'], visual: 'gis:growth-curve',
    title: 'Populations',
    body: 'A population is a group of organisms of one species, living in the same area, at the same time. A community is all of the populations of different species in an ecosystem. An ecosystem is a unit containing the community of organisms and their environment, interacting together.',
    sections: [
      ['What limits growth', 'Food supply, competition, predation and disease.'],
      ['Sigmoid curve', 'Lag phase → exponential (log) phase → stationary phase → death phase.'],
      ['Explaining the phases', 'Lag: few individuals, adapting, few reproducing. Exponential: plenty of food and space, birth rate far greater than death rate. Stationary: food, space or oxygen become limiting, waste builds up — birth rate equals death rate. Death: resources run out or toxins build up, death rate greater than birth rate.', 'S']
    ],
    markScheme: ['Definitions of population, community and ecosystem in the syllabus wording', 'Extended: explain each phase using birth rate and death rate'],
    mistakes: ['Defining population without “same species” or “same time”.']
  },
  {
    slug: 'biotech-intro', topicId: 't21', tier: 'core', refs: ['21.1.1', '21.1.2', '21.2.1', '21.2.2', '21.2.3', '21.2.4', '21.2.5'],
    title: 'Biotechnology: pectinase, washing powders and lactase',
    body: 'Bacteria are useful in biotechnology and genetic modification because they reproduce rapidly and can make complex molecules.',
    sections: [
      ['Why bacteria', 'Few ethical concerns over their manipulation and growth; they contain plasmids, which make it easy to transfer genes.', 'S'],
      ['Yeast', 'Anaerobic respiration by yeast makes ethanol for biofuels. In bread-making, carbon dioxide from yeast makes the dough rise.'],
      ['Pectinase', 'Breaks down pectin in plant cell walls, so more juice is released from fruit and the juice is clearer.'],
      ['Biological washing powders', 'Contain proteases and lipases that digest protein and fat stains into small soluble molecules that wash away, at lower temperatures (saving energy).'],
      ['Lactase', 'Lactase breaks down lactose into glucose and galactose, producing lactose-free milk for people who are lactose intolerant.', 'S']
    ],
    markScheme: ['Bacteria: rapid reproduction, make complex molecules', 'Pectinase → more and clearer juice', 'Washing powders: enzymes digest stains; work at low temperatures'],
    mistakes: ['Saying yeast makes bread rise with oxygen.']
  },
  {
    slug: 'fermenters', topicId: 't21', tier: 'supplement', refs: ['21.2.6', '21.2.7'], visual: 'gis:fermenter',
    title: 'Fermenters',
    body: 'Fermenters grow microorganisms on a large scale to make products such as insulin, penicillin and mycoprotein.',
    sections: [
      ['Conditions controlled', 'Temperature (water jacket — respiration releases heat, enzymes need an optimum), pH (probes and acid/alkali added), oxygen (sterile air bubbled in for aerobic respiration), nutrient supply (glucose, amino acids), and waste products are removed. A stirrer mixes the contents.'],
      ['Sterile conditions', 'Everything is sterilised with steam so no other microorganisms compete or contaminate the product.']
    ],
    markScheme: ['Name the condition and the reason it is controlled', 'Aseptic/sterile conditions to stop contamination'],
    mistakes: ['Saying the stirrer “gives oxygen”.']
  },
  {
    slug: 'genetic-modification', topicId: 't21', tier: 'core', refs: ['21.3.1', '21.3.2', '21.3.3', '21.3.4'],
    title: 'Genetic modification',
    body: 'Genetic modification is changing the genetic material of an organism by removing, changing or inserting individual genes.',
    sections: [
      ['Examples', 'Bacteria making human insulin; crop plants made resistant to herbicides or insect pests; crops with extra vitamins (e.g. golden rice with extra vitamin A).'],
      ['Making human insulin', 'Isolate the human insulin gene, cutting it out with a restriction enzyme to form sticky ends. Cut a bacterial plasmid with the same restriction enzyme, giving complementary sticky ends. Insert the gene into the plasmid using DNA ligase, forming a recombinant plasmid. Insert the plasmid into bacteria. The bacteria reproduce and express the gene, making human insulin.', 'S'],
      ['GM crops — for and against', 'For: higher yields, less pesticide use, improved nutrition. Against: GM seeds can be expensive, possible effects on biodiversity, genes could spread to wild plants, possible health worries.', 'S']
    ],
    markScheme: ['Definition of genetic modification', 'Extended: restriction enzyme, sticky ends, ligase, plasmid, recombinant, express', 'Extended: balanced advantages and disadvantages'],
    mistakes: ['Using a different restriction enzyme for gene and plasmid.']
  },
  {
    slug: 'disease-intro', topicId: 't10', tier: 'core', refs: ['10.1.1', '10.1.2', '10.1.3', '10.1.4', '10.1.5'],
    title: 'Pathogens and how disease spreads',
    body: 'A pathogen is a disease-causing organism. A transmissible disease is a disease in which the pathogen can be passed from one host to another.',
    sections: [
      ['Transmission', 'Direct contact: through blood or other body fluids. Indirect contact: contaminated surfaces, food, animals (vectors such as mosquitoes) or air (droplets).'],
      ['Body defences', 'Mechanical barriers: skin, hairs in the nose. Chemical barriers: mucus (traps pathogens) and stomach acid (kills them). Cells: phagocytosis and antibody production by white blood cells. Vaccination also protects.'],
      ['Controlling spread', 'Clean water supply; hygienic food preparation; good personal hygiene; waste disposal; sewage treatment.']
    ],
    markScheme: ['Definitions of pathogen and transmissible disease', 'Explain how each hygiene measure breaks transmission'],
    mistakes: ['Saying skin “kills” pathogens — it is a barrier.']
  },
  {
    slug: 'cholera', topicId: 't10', tier: 'supplement', refs: ['10.1.16', '10.1.17'],
    title: 'Cholera and diarrhoea',
    body: 'Cholera is caused by the bacterium Vibrio cholerae, transmitted in water or food contaminated with faeces.',
    sections: [
      ['How it causes diarrhoea', 'The bacterium produces a toxin. The toxin causes secretion of chloride ions into the small intestine. This lowers the water potential in the gut, so water moves out of the blood into the gut by osmosis. This causes diarrhoea, dehydration and loss of salts from the blood.'],
      ['Treatment', 'Oral rehydration therapy: a drink of water with glucose and salts to replace what is lost.']
    ],
    markScheme: ['Toxin → chloride ions secreted into small intestine → water potential lowered → water leaves blood by osmosis → diarrhoea and dehydration'],
    mistakes: ['Saying the bacteria “eat” the gut lining.']
  },
  {
    slug: 'stis', topicId: 't16', tier: 'core', refs: ['16.6.1', '16.6.2', '16.6.3', '16.6.4', '16.6.5'],
    title: 'Sexually transmitted infections',
    body: 'A sexually transmitted infection (STI) is an infection that is transmitted through sexual contact. HIV is a pathogen that causes an STI; infection with HIV may lead to AIDS.',
    sections: [
      ['How HIV spreads', 'Unprotected sex, sharing needles, blood transfusions with infected blood, and from mother to baby across the placenta, at birth or in breast milk.'],
      ['Controlling spread', 'Using condoms, limiting the number of sexual partners, testing and treating partners, not sharing needles, screening donated blood, education.']
    ],
    markScheme: ['Definition of an STI', 'HIV → may lead to AIDS', 'Explain how each control method stops transmission'],
    mistakes: ['Saying HIV is AIDS.']
  },
  {
    slug: 'active-immunity', topicId: 't10', tier: 'supplement', refs: ['10.1.6', '10.1.7', '10.1.8', '10.1.9', '10.1.10'],
    title: 'Active immunity and antibodies',
    body: 'Active immunity is defence against a pathogen by antibody production in the body.',
    sections: [
      ['Antigens and antibodies', 'Each pathogen has its own antigens, which have specific shapes. Antibodies are proteins that bind to antigens, leading to direct destruction of pathogens or marking of pathogens for destruction by phagocytes. Specific antibodies have complementary shapes which fit specific antigens.'],
      ['How it develops', 'Active immunity is gained after an infection by a pathogen or by vaccination. Lymphocytes make antibodies and memory cells; memory cells give long-term protection because a second response is faster and larger.']
    ],
    markScheme: ['Antibodies are complementary in shape to antigens', 'Memory cells → faster, larger secondary response'],
    mistakes: ['Saying antibodies are cells, or that phagocytes make antibodies.']
  },
  {
    slug: 'vaccination', topicId: 't10', tier: 'supplement', refs: ['10.1.11', '10.1.12', '10.1.13', '10.1.14', '10.1.15'],
    title: 'Vaccination and passive immunity',
    body: 'Vaccines contain harmless pathogens or antigens. They stimulate an immune response without causing the disease.',
    sections: [
      ['The vaccination process', 'Weakened pathogens or their antigens are put into the body → the antigens trigger an immune response by lymphocytes → antibodies are produced → memory cells are produced, giving long-term immunity.'],
      ['Controlling spread', 'When most of a population is vaccinated, the pathogen cannot spread easily, which also protects people who cannot be vaccinated (herd immunity).'],
      ['Passive immunity', 'Short-term defence against a pathogen by antibodies acquired from another individual — for example across the placenta, in breast milk, or by injection. Memory cells are not made, so it does not last. Breast-feeding is important because it passes antibodies to the baby, whose immune system is not yet fully developed.']
    ],
    markScheme: ['Vaccine stages in order', 'Passive: antibodies from another individual; no memory cells; short-term'],
    mistakes: ['Saying vaccines contain antibodies.']
  },
  {
    slug: 'antibiotics', topicId: 't15', tier: 'core', refs: ['15.1.1', '15.1.2', '15.1.3', '15.1.4', '15.1.5', '18.3.5'],
    title: 'Drugs and antibiotics',
    body: 'A drug is any substance taken into the body that modifies or affects chemical reactions in the body. Antibiotics are used to treat bacterial infections.',
    sections: [
      ['Viruses', 'Antibiotics do not affect viruses, because viruses are not cells and do not have the structures that antibiotics target.'],
      ['Resistance', 'Some bacteria are resistant to antibiotics, which reduces how well antibiotics work. To reduce the development of resistant bacteria such as MRSA, antibiotics should be used only when essential and the course should be completed.', 'S'],
      ['How resistance spreads', 'A random mutation makes a bacterium resistant. When the antibiotic is used, non-resistant bacteria die; resistant ones survive, reproduce and pass on the resistance allele — natural selection.', 'S']
    ],
    markScheme: ['Drug definition', 'Antibiotics kill bacteria, not viruses', 'Extended: limit use, finish course; resistance spreads by natural selection'],
    mistakes: ['Saying bacteria become resistant because they “get used to” the antibiotic.']
  }
  ]
},
{
  unit: 'Ecology and human impact on the environment', term: 'Term 3',
  lessons: [
  {
    slug: 'pollution-land-water', topicId: 't20', tier: 'core', refs: ['20.3.1', '20.3.2'],
    title: 'Pollution of land and water',
    body: 'Pollution harms ecosystems by adding substances in amounts that living things cannot cope with.',
    sections: [
      ['Sewage and fertiliser', 'Untreated sewage and excess fertiliser lead to eutrophication (see Microbes unit). Sewage also spreads pathogens such as cholera.'],
      ['Plastics', 'Non-biodegradable plastics are not broken down by decomposers. In water, animals become entangled or eat them and starve; on land they build up in landfill and release toxins. Microplastics move along food chains.']
    ],
    markScheme: ['Non-biodegradable → not decomposed → persists', 'Effects on aquatic and terrestrial ecosystems'],
    mistakes: ['Saying plastics cause eutrophication.']
  },
  {
    slug: 'pollution-air', topicId: 't20', tier: 'core', refs: ['20.3.3'],
    title: 'Air pollution: carbon dioxide and methane',
    body: 'Carbon dioxide and methane are greenhouse gases. Increasing their concentrations enhances the greenhouse effect and contributes to climate change.',
    sections: [
      ['Sources', 'Carbon dioxide: burning fossil fuels, deforestation (less photosynthesis, and burning trees). Methane: cattle and other ruminants, rice paddy fields, landfill sites.'],
      ['Effects', 'More heat is trapped in the atmosphere → global warming → melting ice, rising sea levels, flooding, droughts, changes to habitats and species distribution, extinction.']
    ],
    markScheme: ['Name the source of each gas', 'Enhanced greenhouse effect → climate change consequences'],
    mistakes: ['Linking the ozone hole to global warming.']
  },
  {
    slug: 'food-supply', topicId: 't20', tier: 'core', refs: ['20.1.1', '20.1.2', '20.1.3', '20.2.1', '20.2.2', '20.2.3', '20.2.4'],
    title: 'Food supply and habitat destruction',
    body: 'Humans increase food production with machinery, chemical fertilisers, insecticides, herbicides and selective breeding.',
    sections: [
      ['Monocultures', 'Large areas of one crop: efficient to plant and harvest, high yield — but reduce biodiversity, spread pests and disease easily and need more pesticides and fertiliser.'],
      ['Intensive livestock', 'Animals kept indoors close together: cheap, efficient food — but disease spreads easily, high use of antibiotics, welfare concerns and pollution from waste.'],
      ['Biodiversity', 'Biodiversity is the number of different species that live in an area.'],
      ['Habitat destruction', 'Caused by clearing land for farming and housing, extracting natural resources, and marine pollution. Humans also change food webs and chains, harming habitats.'],
      ['Deforestation', 'Causes extinction, loss of soil (erosion), flooding, and increased carbon dioxide in the atmosphere.']
    ],
    markScheme: ['Advantage AND disadvantage when asked to discuss', 'Biodiversity definition', 'Deforestation effects list'],
    mistakes: ['Listing only disadvantages for “evaluate” questions.']
  },
  {
    slug: 'conservation', topicId: 't20', tier: 'core', refs: ['20.4.1', '20.4.2', '20.4.3', '20.4.4', '20.4.5', '20.4.6', '20.4.7', '20.4.8', '20.4.9'],
    title: 'Conservation, sustainability and fish stocks',
    body: 'A sustainable resource is one which is produced as rapidly as it is removed from the environment, so that it does not run out.',
    sections: [
      ['Endangered species', 'Species become endangered or extinct because of climate change, habitat destruction, hunting, overharvesting, pollution and introduced species. Conservation methods: monitoring and protecting species and habitats, education, captive breeding, seed banks.'],
      ['Forests', 'Education, protected areas, quotas, replanting.', 'S'],
      ['Fish stocks', 'Closed seasons, protected areas, controlled net types and mesh size so young fish escape, quotas, monitoring.', 'S'],
      ['Why conserve', 'To reduce extinction, protect vulnerable ecosystems, maintain ecosystem functions such as nutrient cycling and resource provision (food, drugs, fuel and genes).', 'S'],
      ['Assisted reproduction', 'Artificial insemination and IVF are used in captive breeding programmes.', 'S'],
      ['Small populations', 'A population that becomes very small loses genetic variation, so it is less able to adapt to change and more likely to become extinct.', 'S']
    ],
    markScheme: ['Sustainable resource definition', 'Specific conservation methods', 'Extended: reduced genetic variation → less able to adapt'],
    mistakes: ['Vague answers such as “protect the animals”.']
  },
  {
    slug: 'food-chains', topicId: 't19', tier: 'core', refs: ['19.1.1', '19.1.2', '19.2.1', '19.2.2', '19.2.3', '19.2.4', '19.2.5', '19.2.6', '19.2.7', '19.2.8', '19.2.9', '19.2.10'],
    title: 'Energy flow and food chains',
    body: 'The Sun is the main source of energy for biological systems. Energy flows through organisms and is eventually transferred to the environment.',
    sections: [
      ['Food chains and webs', 'A food chain shows the transfer of energy from one organism to the next, beginning with a producer. A food web is a network of interconnected food chains. Arrows point in the direction energy flows (to the eater).'],
      ['Who is who', 'Producer: an organism that makes its own organic nutrients, usually using energy from sunlight, through photosynthesis. Consumer: an organism that gets its energy by feeding on other organisms. Herbivore: eats plants. Carnivore: eats other animals. Decomposer: gets its energy from dead or waste organic material.'],
      ['Changing a web', 'Overharvesting or introducing a species can remove or add a link, changing the numbers of other species.']
    ],
    markScheme: ['Arrows in the direction of energy flow', 'Name trophic levels: producer, primary, secondary, tertiary, quaternary consumer', 'Explain knock-on effects through more than one link'],
    mistakes: ['Drawing arrows from the eater to the eaten.']
  },
  {
    slug: 'pyramids', topicId: 't19', tier: 'core', refs: ['19.2.11', '19.2.12', '19.2.13', '19.2.14', '19.2.15', '19.2.16', '19.2.17', '19.2.18', '19.2.19'],
    title: 'Pyramids and trophic levels',
    body: 'A trophic level is the position of an organism in a food chain, food web or ecological pyramid.',
    sections: [
      ['Numbers vs biomass', 'A pyramid of numbers can be inverted (one tree, many caterpillars). A pyramid of biomass shows the mass of living material at each level, so it is almost always a true pyramid — it is a better representation.'],
      ['Pyramids of energy', 'Show the energy transferred at each level per unit area per year. Always pyramid-shaped; take into account how much energy each organism actually passes on.', 'S'],
      ['Why transfer is inefficient', 'Energy is lost at each level: not all of an organism is eaten, some is not digested (egested), and much is used in respiration and lost as heat, movement and in excretion. Typically about 10% is passed on.', 'S'],
      ['Short food chains', 'So little energy reaches the top that there is not enough to support another level — food chains usually have fewer than five trophic levels.', 'S'],
      ['Eating crops', 'Humans get more energy by eating crops than livestock fed on crops, because a whole trophic level’s losses are avoided.', 'S']
    ],
    markScheme: ['Biomass pyramid better than numbers', 'Extended: losses through respiration, heat, excretion, uneaten parts', 'Extended: fewer than five trophic levels because too little energy left'],
    mistakes: ['Saying energy is “used up” — it is transferred to the environment.']
  },
  {
    slug: 'classification-animals', topicId: 't01', tier: 'core', refs: ['1.1.1', '1.2.1', '1.2.2', '1.2.3', '1.2.4', '1.2.5', '1.2.6', '1.2.7', '1.3.1', '1.3.2', '1.3.3'],
    title: 'Classification: vertebrates and invertebrates',
    body: 'Organisms are classified into groups by the features they share. A species is a group of organisms that can reproduce to produce fertile offspring. The binomial system names each species with its genus and species, e.g. Homo sapiens.',
    sections: [
      ['Characteristics of living things', 'Movement, respiration, sensitivity, growth, reproduction, excretion, nutrition (MRS GREN). Learn each definition: e.g. growth is a permanent increase in size and dry mass; excretion is the removal of waste products of metabolism and substances in excess of requirements.'],
      ['Vertebrates', 'Mammals: fur/hair, external ears (pinna), mammary glands. Birds: feathers, beak, wings, hard-shelled eggs. Reptiles: dry scaly skin, soft-shelled eggs on land. Amphibians: moist smooth skin, eggs laid in water. Bony fish: scales, fins, gills.'],
      ['Arthropods', 'Jointed legs, exoskeleton, segmented body. Insects: 3 pairs of legs, 3 body parts, 1 pair of antennae, often wings. Arachnids: 4 pairs of legs, 2 body parts, no antennae. Crustaceans: more than 4 pairs of legs, 2 pairs of antennae, chalky exoskeleton. Myriapods: many segments, each with legs, 1 pair of antennae.'],
      ['Dichotomous keys', 'Each step splits into two choices based on a visible feature. Use features that do not vary (number of legs), not size or colour.'],
      ['Evolution and DNA', 'Classification systems aim to reflect evolutionary relationships. The sequence of bases in DNA is used to classify: organisms that share a more recent common ancestor have base sequences in DNA that are more similar than those that share only a distant ancestor.', 'S']
    ],
    markScheme: ['Species = can breed to produce fertile offspring', 'Binomial: genus capital letter, species lower case, italics/underlined', 'Use the features listed in the syllabus for each group', 'Extended: more similar DNA = more recent common ancestor'],
    mistakes: ['Using “it is big” as a key question.', 'Writing genus in lower case.']
  }
  ]
}
];

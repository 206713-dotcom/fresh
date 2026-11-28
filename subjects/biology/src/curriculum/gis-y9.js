// Fresh Biology · GIS Year 9 notes, in the order the GIS Biology year plan teaches them.
// Written against the Cambridge IGCSE Biology 0610 (2026–2028) learning objectives, using the
// wording mark schemes credit. Sections tagged 'S' are Supplement (Extended) only.
export const y9 = [
{
  unit: 'Food groups and food tests', term: 'Term 1',
  lessons: [
  {
    slug: 'food-groups-1', topicId: 't07', tier: 'core', refs: ['7.1.1', '7.1.2', '4.1.1'],
    title: 'The food groups: carbohydrates, proteins and fats',
    body: 'A balanced diet supplies every nutrient in the right amounts, and enough energy, for a person’s age, sex and activity. Carbohydrates, fats and proteins are the three nutrients the body needs in large amounts. Each is built from a small set of chemical elements.',
    sections: [
      ['Carbohydrates', 'Made of carbon, hydrogen and oxygen. Main use: a source of energy released in respiration. Sources: rice, bread, pasta, potatoes (starch); fruit and sweets (sugars). Simple sugars such as glucose are small and soluble; starch, glycogen and cellulose are large molecules built from many glucose units.'],
      ['Fats and oils (lipids)', 'Made of carbon, hydrogen and oxygen (with much less oxygen than carbohydrates). Uses: energy store, insulation, making cell membranes. Sources: butter, oil, nuts, oily fish, cheese. A fat molecule is built from fatty acids and glycerol.'],
      ['Proteins', 'Made of carbon, hydrogen, oxygen and nitrogen (some also contain sulfur). Uses: growth and repair, making enzymes, antibodies and some hormones. Sources: meat, fish, eggs, beans, lentils, tofu. Proteins are built from amino acids.'],
      ['Energy in food', 'Fats release about twice as much energy per gram as carbohydrates or proteins. Energy needs rise with activity, during growth and during pregnancy or breast-feeding.']
    ],
    markScheme: ['Balanced diet: all nutrients in the correct proportions/amounts, and enough energy, for the person’s needs', 'Carbohydrate and fat: C, H and O only; protein: C, H, O and N', 'Protein is needed for growth and repair (also enzymes, antibodies)', 'Name a food source for each nutrient when asked'],
    mistakes: ['“A balanced diet means eating the same amount of every food group” — no: correct proportions, not equal amounts.', 'Saying proteins are mainly for energy — their main role is growth and repair.']
  },
  {
    slug: 'food-groups-2', topicId: 't07', tier: 'core', refs: ['7.1.2', '7.1.3'],
    title: 'Water, fibre, vitamins and minerals',
    body: 'These nutrients are needed for health rather than for energy. The syllabus names vitamins C and D, calcium and iron, fibre and water, and two deficiency diseases: scurvy and rickets.',
    sections: [
      ['Vitamin C', 'Needed to make collagen, a protein that holds skin, gums and blood vessels together. Sources: citrus fruit, peppers, broccoli. Deficiency: scurvy — bleeding gums, poor wound healing.'],
      ['Vitamin D', 'Needed to absorb calcium from the gut, so needed for strong bones and teeth. Sources: oily fish, eggs; also made in skin in sunlight. Deficiency: rickets — soft, weak bones that bend.'],
      ['Calcium', 'Needed for bones and teeth (and blood clotting, muscle contraction). Sources: milk, cheese, green vegetables. Lack of calcium (or vitamin D) can also cause rickets.'],
      ['Iron', 'Needed to make haemoglobin in red blood cells, which carries oxygen. Sources: red meat, liver, spinach, beans. Deficiency: anaemia — tiredness, because less oxygen is carried.'],
      ['Fibre (roughage)', 'Cellulose from plant cell walls that is not digested. It adds bulk so the muscles of the gut wall can push food along by peristalsis, preventing constipation. Sources: wholemeal bread, vegetables, fruit, beans.'],
      ['Water', 'A solvent for chemical reactions and for transport (in blood plasma and urine), needed for digestion and to remove waste, and to keep body temperature stable by sweating.']
    ],
    markScheme: ['Scurvy = lack of vitamin C; rickets = lack of vitamin D (or calcium)', 'Iron → haemoglobin → carries oxygen', 'Fibre → bulk → peristalsis → prevents constipation', 'Water: solvent for transport, digestion and excretion'],
    mistakes: ['Calling fibre a source of energy — humans cannot digest cellulose.', 'Writing “vitamin D makes bones” — it helps the gut absorb calcium.']
  },
  {
    slug: 'food-tests-1', topicId: 't04', tier: 'core', refs: ['4.1.3'],
    title: 'Food tests: starch, fats and proteins',
    body: 'Food tests use reagents that change colour when a nutrient is present. Always state the starting colour and the colour for a positive result, and use a negative control (water) to compare.',
    sections: [
      ['Starch — iodine test', 'Add a few drops of iodine solution to the food (solid or solution). Positive: orange-brown changes to blue-black. Negative: stays orange-brown.'],
      ['Protein — biuret test', 'Add biuret solution (or sodium hydroxide then dilute copper sulfate) to a solution of the food. Positive: blue changes to purple (lilac/violet). Negative: stays blue.'],
      ['Fats and oils — ethanol emulsion test', 'Shake the food with ethanol to dissolve any fat, then pour the ethanol into water. Positive: a white cloudy emulsion forms. Negative: stays clear. Keep ethanol away from flames.'],
      ['Making a fair test', 'Use the same volume of food sample and reagent, the same amount of time, and compare against a water control. Wear eye protection.']
    ],
    markScheme: ['Iodine: brown/orange → blue-black = starch', 'Biuret: blue → purple/lilac = protein', 'Ethanol then water → cloudy white emulsion = fat', 'State both colours (before and after) for full marks'],
    mistakes: ['Writing “iodine turns black” — the mark scheme wants blue-black.', 'Heating the biuret test — only Benedict’s needs heating.']
  },
  {
    slug: 'food-tests-2', topicId: 't04', tier: 'core', refs: ['4.1.3'],
    title: 'Food tests: reducing sugars (Benedict’s)',
    body: 'Reducing sugars include glucose, fructose and maltose. Sucrose is not a reducing sugar, so it gives a negative Benedict’s test.',
    sections: [
      ['Method', 'Add an equal volume of Benedict’s solution to the food solution. Heat in a water bath at about 80 °C (or a boiling water bath) for a few minutes.'],
      ['Results', 'Negative: stays blue. Positive: blue → green → yellow → orange → brick red as the amount of reducing sugar increases. The colour is semi-quantitative: it shows roughly how much sugar there is.'],
      ['Comparing samples', 'To compare sugar content, keep the volumes, the temperature and the heating time the same, and compare colours against known standards.']
    ],
    markScheme: ['Benedict’s solution + heat (water bath)', 'Blue → brick red (via green, yellow, orange) = reducing sugar', 'Must heat — no heat, no mark for method'],
    mistakes: ['Forgetting to say the mixture is heated.', 'Saying sucrose gives a positive Benedict’s result.']
  },
  {
    slug: 'practical-skills', topicId: 't04', tier: 'core', refs: ['Practical skills'],
    title: 'Practical skills: methods, tables and graphs',
    body: 'Papers 5 and 6 test how you plan, record and analyse experiments. Most marks come from a small set of habits.',
    sections: [
      ['Variables', 'Independent variable: what you change. Dependent variable: what you measure. Control variables: what you keep the same — name them specifically (for example “volume of Benedict’s solution”, not “amount”).'],
      ['Writing a method', 'Numbered steps in order. Give quantities with units, the apparatus, how the dependent variable is measured, at least five values of the independent variable, repeats to calculate a mean, and one safety precaution.'],
      ['Tables', 'Independent variable in the first column. Units in the column headings, not in the cells. Same number of decimal places down a column.'],
      ['Graphs', 'Independent variable on the x-axis, dependent on the y-axis; label both axes with units; use more than half the grid; plot points accurately with small crosses; join with a ruled line point-to-point or a smooth best-fit line. Use a bar chart when the independent variable is in categories.'],
      ['Evaluating', 'Spot anomalous results, explain why repeats improve reliability, and suggest a specific improvement (for example “use a water bath to keep temperature constant”).']
    ],
    markScheme: ['Units in headings only', 'Axes the right way round and labelled with units', 'Specific control variables', 'Repeat and calculate a mean'],
    mistakes: ['Vague controls such as “same conditions”.', 'Bar chart for continuous data.']
  },
  {
    slug: 'balanced-diet', topicId: 't07', tier: 'core', refs: ['7.1.1', '7.1.2'],
    title: 'Balanced diets and energy needs',
    body: 'Different people need different diets. The right diet depends on age, sex, activity level and whether a person is pregnant or breast-feeding.',
    sections: [
      ['Why needs differ', 'Teenagers are growing, so they need more protein and energy. Active people need more energy. Pregnant women need extra protein, iron and calcium for the fetus. Older people tend to need less energy.'],
      ['Too much or too little', 'Too much energy (especially fat and sugar) can lead to obesity; too much saturated fat and salt increases the risk of coronary heart disease. Too little leads to deficiency diseases and, in children, poor growth.']
    ],
    markScheme: ['Link the need to a reason: e.g. pregnancy → more iron for extra red blood cells / more calcium for fetal bones', 'Energy need increases with activity'],
    mistakes: ['Listing foods without linking them to the nutrient and its use.']
  },
  {
    slug: 'vitamin-c', topicId: 't04', tier: 'core', refs: ['4.1.3', '7.1.3'],
    title: 'Vitamin C and the DCPIP test',
    body: 'DCPIP is a blue dye that is decolourised by vitamin C. The more vitamin C in a juice, the less juice you need to add to decolourise a fixed volume of DCPIP.',
    sections: [
      ['Method', 'Put 1 cm³ of DCPIP in a test tube. Add the juice drop by drop from a syringe or pipette, shaking after each drop, until the blue colour disappears. Record the volume added. Repeat and calculate a mean.'],
      ['Result', 'Positive: blue → colourless. Smaller volume needed = more vitamin C.'],
      ['Controls and sources of error', 'Same volume and concentration of DCPIP, same shaking, same end point judged against a white tile. Vitamin C is destroyed by heating and by storage, so fresh juice contains more.'],
      ['Scurvy', 'Lack of vitamin C causes scurvy: bleeding gums and poor healing of wounds.']
    ],
    markScheme: ['DCPIP blue → colourless = vitamin C', 'Less juice needed to decolourise = higher vitamin C concentration'],
    mistakes: ['Saying DCPIP “turns white” — write colourless.', 'Getting the inverse relationship backwards.']
  },
  {
    slug: 'drawing', topicId: 't02', tier: 'core', refs: ['Practical skills'],
    title: 'Biological drawing skills',
    body: 'Drawing questions are marked on a short checklist. Neat, large and accurate beats artistic.',
    sections: [
      ['The rules', 'Use a sharp pencil. Draw clear, continuous single lines — no sketching or shading. Make the drawing large (fill most of the space given). Keep the proportions of the specimen. Draw only what you can see.'],
      ['Labels', 'Label lines drawn with a ruler, touching the structure, not crossing each other, with labels outside the drawing. Add a title and the magnification if asked.']
    ],
    markScheme: ['Clear continuous outline, no shading', 'Correct proportions and fills the space', 'Ruled label lines that touch the part'],
    mistakes: ['Shading cells or arrows instead of label lines.']
  },
  {
    slug: 'magnification', topicId: 't02', tier: 'core', refs: ['2.2.1', '2.2.2', '2.2.3'],
    title: 'Calculating magnification',
    body: 'magnification = image size ÷ actual size. Rearranged: actual size = image size ÷ magnification. Both sizes must be in the same unit before you divide.',
    sections: [
      ['Worked example', 'A drawing of a cell is 45 mm long. The real cell is 0.15 mm long. Magnification = 45 ÷ 0.15 = ×300 (magnification has no unit).'],
      ['Finding the actual size', 'An image is 60 mm long at ×400. Actual size = 60 ÷ 400 = 0.15 mm.'],
      ['Millimetres and micrometres', '1 mm = 1000 µm. To change mm to µm, multiply by 1000; µm to mm, divide by 1000. 0.15 mm = 150 µm.', 'S'],
      ['Measuring the image', 'Measure the image with a ruler in mm, along the line you are told to measure. Show the working: formula, numbers, answer.']
    ],
    markScheme: ['Correct formula written', 'Measurement in matching units', 'Answer with × and no unit for magnification; actual size with unit', 'Extended: correct conversion between mm and µm'],
    mistakes: ['Dividing the wrong way round (actual ÷ image).', 'Mixing mm and µm in one calculation.']
  }
  ]
},
{
  unit: 'Digestion and enzymes', term: 'Term 2/3',
  lessons: [
  {
    slug: 'digestive-system', topicId: 't07', tier: 'core', refs: ['7.2.1', '7.2.2'], visual: 'gis:digestive',
    title: 'The digestive system and its organs',
    body: 'The alimentary canal is a tube from mouth to anus. Food is ingested, digested, absorbed, assimilated and the leftovers egested.',
    sections: [
      ['Five key processes', 'Ingestion: taking substances (food and drink) into the body through the mouth. Digestion: breaking down large insoluble molecules into small soluble molecules, by physical and chemical means. Absorption: movement of nutrients from the intestines into the blood. Assimilation: uptake and use of nutrients by cells. Egestion: passing out of food that has not been digested or absorbed, as faeces, through the anus.'],
      ['The organs in order', 'Mouth (teeth, salivary glands) → oesophagus → stomach → small intestine (duodenum then ileum) → large intestine (colon, then rectum) → anus. The liver, gall bladder and pancreas are associated organs: food does not pass through them.'],
      ['Jobs of each part', 'Mouth: chewing, salivary amylase. Oesophagus: carries food to the stomach by peristalsis. Stomach: churning, protease, hydrochloric acid. Duodenum: receives pancreatic juice and bile. Ileum: absorption of nutrients and most water. Colon: absorbs more water. Rectum: stores faeces. Liver: makes bile. Gall bladder: stores bile. Pancreas: makes amylase, protease and lipase.']
    ],
    markScheme: ['Egestion ≠ excretion: egestion removes undigested food', 'Absorption = into the blood (and lacteals) through the wall of the small intestine', 'Bile is made in the liver and stored in the gall bladder'],
    mistakes: ['Saying the gall bladder makes bile.', 'Putting food through the liver or pancreas.']
  },
  {
    slug: 'teeth', topicId: 't07', tier: 'core', refs: ['7.3.1', '7.3.2', '7.3.3', '7.3.4', '7.3.5', '7.3.6'], visual: 'gis:tooth',
    title: 'Physical digestion and teeth',
    body: 'Physical digestion breaks food into smaller pieces without chemical change to the food molecules. This increases the surface area for enzymes to act on.',
    sections: [
      ['Types of teeth', 'Incisors: chisel-shaped, for biting and cutting. Canines: pointed, for holding and tearing. Premolars and molars: broad, ridged surfaces for grinding and crushing.'],
      ['Structure of a tooth', 'Crown above the gum, root below. Enamel: hardest outer layer of the crown. Dentine: under the enamel. Pulp cavity: contains nerves and blood vessels. Cement and fibres hold the root in the jaw bone.'],
      ['Stomach churning', 'Muscles in the stomach wall contract to churn food with gastric juice, physically breaking it down and mixing it with enzymes.'],
      ['Bile emulsifies fats', 'Bile breaks large fat droplets into small droplets (emulsification). This is physical digestion: it increases the surface area for lipase to act on.', 'S']
    ],
    markScheme: ['Physical digestion: no chemical change; increases surface area for enzymes', 'Incisors cut, canines hold/tear, molars and premolars grind', 'Extended: bile emulsifies fat → larger surface area for lipase'],
    mistakes: ['Saying bile digests fat or is an enzyme — it only emulsifies.']
  },
  {
    slug: 'big-molecules', topicId: 't04', tier: 'core', refs: ['4.1.1', '4.1.2'],
    title: 'Biological molecules: how big molecules are built',
    body: 'Large food molecules are built from smaller units joined together. Digestion breaks them back down to these units.',
    sections: [
      ['Carbohydrates', 'Starch (store in plants), glycogen (store in animals, in liver and muscles) and cellulose (plant cell walls) are all made from many glucose molecules joined together.'],
      ['Proteins', 'Made from amino acids joined in chains. About 20 different amino acids exist; their order decides the protein’s shape.'],
      ['Fats and oils', 'Made from fatty acids and glycerol.'],
      ['Elements', 'Carbohydrates and fats: carbon, hydrogen, oxygen. Proteins: carbon, hydrogen, oxygen, nitrogen.']
    ],
    markScheme: ['Starch, glycogen, cellulose ← glucose', 'Protein ← amino acids', 'Fats and oils ← fatty acids and glycerol'],
    mistakes: ['Saying fats are made of “fatty acids” only — glycerol is needed too.']
  },
  {
    slug: 'enzymes-intro', topicId: 't05', tier: 'core', refs: ['5.1.1', '5.1.2', '5.1.3', '7.4.1', '7.4.2'],
    title: 'Chemical digestion and enzymes',
    body: 'A catalyst is a substance that increases the rate of a chemical reaction and is not changed by the reaction. Enzymes are proteins that are involved in all metabolic reactions, where they function as biological catalysts.',
    sections: [
      ['Why life needs enzymes', 'Without enzymes, reactions in cells at body temperature would be far too slow to sustain life. Enzymes allow reactions to happen fast enough at body temperature.'],
      ['Chemical digestion', 'The breakdown of large insoluble molecules into small soluble molecules, so they can be absorbed into the blood.'],
      ['Main digestive enzymes', 'Amylase: starch → simple reducing sugars (maltose). Protease: protein → amino acids. Lipase: fats and oils → fatty acids and glycerol.']
    ],
    markScheme: ['Enzyme = protein + biological catalyst', 'Catalyst: speeds up reaction and is not changed/used up', 'Chemical digestion: large insoluble → small soluble molecules (for absorption)'],
    mistakes: ['Saying enzymes are “used up” or “alive”.']
  },
  {
    slug: 'lock-and-key', topicId: 't05', tier: 'core', refs: ['5.1.4', '5.1.6', '5.1.7'], visual: 'gis:enzyme',
    title: 'Enzyme structure: active site and lock and key',
    body: 'Each enzyme has an active site with a specific shape. The substrate is complementary in shape to the active site, so it fits; the reaction happens and products are released, leaving the enzyme free to work again.',
    sections: [
      ['Core sequence', 'Substrate collides with the enzyme → substrate fits into the active site (complementary shapes) → reaction takes place → products leave the active site → enzyme is unchanged and can be reused.'],
      ['Enzyme–substrate complex', 'When the substrate binds to the active site, an enzyme–substrate complex forms. The substrate is converted to products, which are released.', 'S'],
      ['Specificity', 'Enzymes are specific: each enzyme acts on only one substrate (or a small group) because only that substrate’s shape is complementary to its active site.', 'S']
    ],
    markScheme: ['Active site and substrate have complementary shapes', 'Enzyme–substrate complex forms (Extended)', 'Products released; enzyme unchanged', 'Specific because of shape of active site'],
    mistakes: ['Writing “same shape” instead of “complementary shape”.', 'Saying the substrate has an active site.']
  },
  {
    slug: 'enzyme-investigation', topicId: 't05', tier: 'core', refs: ['5.1.5', '12.1.2'],
    title: 'Investigating enzyme activity (catalase)',
    body: 'Catalase is found in almost all living cells, including potato and liver. It breaks down hydrogen peroxide into water and oxygen. The rate of oxygen production shows how active the enzyme is.',
    sections: [
      ['Measuring the rate', 'Collect oxygen in an upturned measuring cylinder or gas syringe and record the volume every 30 seconds, or count bubbles per minute, or measure the height of foam.'],
      ['Fair test', 'Same mass and surface area of potato or volume of catalase, same volume and concentration of hydrogen peroxide, same temperature (water bath), same time.'],
      ['Other enzyme tests', 'Amylase and starch: take drops at intervals onto a spotting tile with iodine; record the time until iodine stays orange-brown (no starch left). Shorter time = faster rate.']
    ],
    markScheme: ['Rate = volume of oxygen per unit time', 'Name specific control variables', 'Iodine stays orange-brown when starch has all been digested'],
    mistakes: ['Saying the enzyme “runs out” when the substrate runs out.']
  },
  {
    slug: 'enzymes-temperature', topicId: 't05', tier: 'core', refs: ['5.1.5', '5.1.8'], visual: 'enzyme-curves',
    title: 'Enzymes and temperature',
    body: 'As temperature rises towards the optimum, enzyme activity increases. Above the optimum, activity falls quickly because the enzyme is denatured.',
    sections: [
      ['Core description', 'Low temperature: slow rate. Optimum temperature (about 37 °C for human enzymes): fastest rate. High temperature: the enzyme denatures — the shape of the active site changes, the substrate no longer fits, and the rate falls to zero.'],
      ['Explaining the rise', 'Increasing temperature gives enzyme and substrate molecules more kinetic energy, so they move faster and collide more often. More frequent effective collisions form more enzyme–substrate complexes per second.', 'S'],
      ['Explaining the fall', 'Above the optimum, bonds holding the enzyme’s shape break, the active site changes shape, the substrate is no longer complementary and fewer enzyme–substrate complexes form. Denaturation is permanent.', 'S'],
      ['Low temperature is not denaturing', 'Cold slows enzymes down but does not denature them; activity returns on warming.']
    ],
    markScheme: ['Optimum temperature = fastest rate', 'Above optimum: active site changes shape / denatured, substrate cannot fit', 'Extended: kinetic energy → more collisions → more enzyme–substrate complexes'],
    mistakes: ['“The enzyme is killed” — enzymes are not alive; say denatured.', 'Saying enzymes are denatured at low temperature.']
  },
  {
    slug: 'enzymes-ph', topicId: 't05', tier: 'core', refs: ['5.1.5', '5.1.9'],
    title: 'Enzymes and pH',
    body: 'Each enzyme works best at its optimum pH. Pepsin in the stomach works best around pH 2; most enzymes in the small intestine work best near pH 7–8.',
    sections: [
      ['Core description', 'Moving away from the optimum pH in either direction reduces activity; extreme pH denatures the enzyme.'],
      ['Explanation', 'A change in pH changes the shape of the active site. The substrate fits less well, so fewer enzyme–substrate complexes form. At extreme pH the enzyme is denatured.', 'S']
    ],
    markScheme: ['Optimum pH differs between enzymes (pepsin ~2)', 'pH change → active site shape changes → substrate no longer complementary / fits'],
    mistakes: ['Using kinetic-energy ideas to explain pH — pH acts on shape, not on collisions.']
  },
  {
    slug: 'stomach-liver', topicId: 't07', tier: 'core', refs: ['7.4.3', '7.4.4', '7.4.5', '7.4.6', '7.4.7', '7.4.8', '7.3.7'],
    title: 'The stomach, pancreas and liver',
    body: 'Different enzymes are secreted in different places, and each works in the conditions found there.',
    sections: [
      ['Where enzymes come from and act', 'Amylase: secreted by the salivary glands and pancreas; acts in the mouth and the duodenum. Protease: secreted by the stomach and pancreas; acts in the stomach and the duodenum. Lipase: secreted by the pancreas; acts in the duodenum.'],
      ['Hydrochloric acid', 'Gastric juice contains hydrochloric acid. It kills harmful microorganisms in food and gives the acidic pH that is the optimum for the enzymes in the stomach.'],
      ['Starch digestion in detail', 'Amylase breaks starch down to maltose. Maltase, on the membranes of the epithelium lining the small intestine, breaks maltose down to glucose.', 'S'],
      ['Protein digestion in detail', 'Pepsin (in the stomach) and trypsin (in the small intestine) break proteins down to amino acids.', 'S'],
      ['Bile', 'Bile, made by the liver and stored in the gall bladder, is alkaline. It neutralises the acidic mixture of food and gastric juice entering the duodenum, giving a suitable pH for the enzymes there. It also emulsifies fats.', 'S']
    ],
    markScheme: ['HCl: kills microorganisms + optimum (acid) pH for stomach enzymes', 'Extended: maltase on epithelium membranes; pepsin in stomach, trypsin in small intestine', 'Extended: bile neutralises acid so intestinal enzymes work at their optimum pH'],
    mistakes: ['Saying hydrochloric acid digests protein — it does not; pepsin does.']
  },
  {
    slug: 'absorption', topicId: 't07', tier: 'core', refs: ['7.5.1', '7.5.2', '7.5.3', '7.5.4', '7.5.5'], visual: 'gis:villus',
    title: 'Absorption in the small intestine',
    body: 'The small intestine is the region where nutrients are absorbed. Most water is absorbed in the small intestine; some is absorbed in the colon.',
    sections: [
      ['Villi and microvilli', 'The inner wall is folded into millions of finger-like villi, and the cells on each villus have microvilli. Both greatly increase the surface area for absorption.', 'S'],
      ['Structure of a villus', 'A wall one cell thick (thin epithelium) → short diffusion distance. A network of capillaries → carries absorbed glucose and amino acids away, keeping a steep concentration gradient. A lacteal in the centre → absorbs fatty acids and glycerol into the lymphatic system.', 'S'],
      ['After absorption', 'Blood from the small intestine goes to the liver in the hepatic portal vein. Cells then assimilate the nutrients — for example using amino acids to make proteins.']
    ],
    markScheme: ['Small intestine absorbs most nutrients and most water; colon absorbs some water', 'Extended: villi and microvilli → large surface area', 'Extended: capillaries take glucose and amino acids; lacteal takes fatty acids and glycerol'],
    mistakes: ['Saying villi have “thin walls” without “one cell thick” or “short diffusion distance”.']
  }
  ]
}
];

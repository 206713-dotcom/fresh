// Fresh Biology · GIS Year 11 notes, in the GIS Biology year-plan order.
// Cambridge IGCSE Biology 0610 (2026–2028) objectives; sections tagged 'S' are Supplement only.
export const y11 = [
{
  unit: 'Circulation', term: 'Term 1',
  lessons: [
  {
    slug: 'circulatory-systems', topicId: 't09', tier: 'core', refs: ['9.1.1', '9.1.2', '9.1.3', '9.1.4'],
    title: 'Circulatory systems: single and double',
    body: 'The circulatory system is a system of blood vessels with a pump and valves to ensure one-way flow of blood.',
    sections: [
      ['Single circulation (fish)', 'Blood passes through the heart once for each complete circuit: heart → gills → body → heart.', 'S'],
      ['Double circulation (mammals)', 'Blood passes through the heart twice for each complete circuit: the right side pumps blood to the lungs (pulmonary circulation); the left side pumps blood to the rest of the body (systemic circulation).', 'S'],
      ['Advantages of double circulation', 'Blood returns to the heart after the lungs and is pumped again, so it reaches the body at high pressure and flows quickly. This delivers oxygen and glucose fast enough for a high metabolic rate. Low pressure in the lungs avoids damaging the capillaries.', 'S']
    ],
    markScheme: ['Pump + vessels + valves → one-way flow', 'Extended: twice through the heart per circuit; higher pressure to the body'],
    mistakes: ['Saying double circulation means “two hearts”.']
  },
  {
    slug: 'heart', topicId: 't09', tier: 'core', refs: ['9.2.1', '9.2.2', '9.2.7', '9.2.8', '9.2.9'], visual: 'gis:heart',
    title: 'The mammalian heart',
    body: 'The heart is a muscular pump with four chambers. Blood is pumped away from the heart into arteries and returns to the heart in veins.',
    sections: [
      ['Structures', 'Right atrium, right ventricle, left atrium, left ventricle; septum; vena cava, pulmonary artery, pulmonary vein, aorta; coronary arteries supply the heart muscle.'],
      ['The route', 'Vena cava → right atrium → right ventricle → pulmonary artery → lungs → pulmonary vein → left atrium → left ventricle → aorta → body.'],
      ['Valves', 'Atrioventricular valves (between atria and ventricles) and semilunar valves (at the base of the aorta and pulmonary artery) prevent backflow.', 'S'],
      ['Wall thickness', 'Ventricles have thicker muscle walls than atria because they pump blood further (out of the heart, not just into the ventricle). The left ventricle wall is thicker than the right because it pumps blood at higher pressure all around the body; the right pumps only to the nearby lungs.', 'S'],
      ['Septum', 'The septum separates oxygenated blood (left side) from deoxygenated blood (right side).', 'S']
    ],
    markScheme: ['Correct order of chambers and vessels', 'Extended: left ventricle thicker → higher pressure, further distance', 'Extended: septum keeps oxygenated and deoxygenated blood apart'],
    mistakes: ['Mixing left and right — the heart is drawn as if facing you.', 'Saying the pulmonary artery carries oxygenated blood.']
  },
  {
    slug: 'cardiac-cycle', topicId: 't09', tier: 'core', refs: ['9.2.3', '9.2.4', '9.2.10', '9.2.11'],
    title: 'The cardiac cycle and heart rate',
    body: 'Heart activity can be monitored with an ECG, by measuring pulse rate, and by listening to the sounds of the valves closing.',
    sections: [
      ['Exercise and heart rate', 'Investigate by measuring pulse rate at rest, then after exercise, then every minute during recovery.'],
      ['The sequence', 'The atria contract, pushing blood into the ventricles. The ventricles contract; the atrioventricular valves close (preventing backflow into the atria) and blood is forced out through the semilunar valves into the arteries. The semilunar valves then close to stop blood flowing back into the ventricles.', 'S'],
      ['Why heart rate rises in exercise', 'Muscles respire faster and need more oxygen and glucose and must remove more carbon dioxide (and lactic acid). The heart beats faster and harder to increase blood flow.', 'S']
    ],
    markScheme: ['Three ways to monitor heart activity', 'Extended: contraction order and which valves close', 'Extended: link to increased respiration rate in muscles'],
    mistakes: ['Saying “the heart beats faster to make more energy”.']
  },
  {
    slug: 'blood-vessels', topicId: 't09', tier: 'core', refs: ['9.3.1', '9.3.2', '9.3.3', '9.3.4', '9.3.5', '9.3.6'], visual: 'gis:vessels',
    title: 'Arteries, veins and capillaries',
    body: 'Arteries carry blood away from the heart at high pressure; veins return blood at low pressure; capillaries exchange substances with tissues.',
    sections: [
      ['Structure', 'Arteries: thick, muscular, elastic walls; narrow lumen. Veins: thin walls, wide lumen, valves. Capillaries: walls one cell thick.'],
      ['Capillaries', 'Capillaries exchange substances between the blood and the tissues: oxygen and glucose out, carbon dioxide and waste in.'],
      ['Main vessels', 'Heart: vena cava, aorta, pulmonary artery and vein. Lungs: pulmonary artery and vein. Kidney: renal artery and vein.'],
      ['Linking structure to pressure', 'Arteries: thick elastic walls withstand and even out high pressure; muscle and elastic fibres. Veins: wide lumen reduces resistance at low pressure; valves prevent backflow.', 'S'],
      ['Capillary structure', 'One cell thick → short diffusion distance; huge network → large surface area; narrow → blood flows slowly past every cell.', 'S'],
      ['Liver vessels', 'Hepatic artery, hepatic veins and hepatic portal vein (which brings blood from the gut to the liver).', 'S']
    ],
    markScheme: ['Correct structure for each vessel', 'Extended: link wall/lumen/valves to pressure', 'Capillary wall one cell thick → short diffusion distance'],
    mistakes: ['Saying arteries always carry oxygenated blood.']
  },
  {
    slug: 'chd', topicId: 't09', tier: 'core', refs: ['9.2.5', '9.2.6'],
    title: 'Coronary heart disease',
    body: 'Coronary heart disease (CHD) is the blockage of the coronary arteries.',
    sections: [
      ['What happens', 'Fatty deposits (and blood clots) build up in the coronary arteries, narrowing them. Less blood reaches the heart muscle, so it gets less oxygen and glucose for respiration. Muscle cells can die → heart attack.'],
      ['Risk factors', 'Diet high in saturated fat and salt, lack of exercise, stress, smoking, genetic predisposition, age and sex (more common in men and older people).'],
      ['Reducing risk', 'A diet low in saturated fat and salt, with more fibre; regular exercise strengthens the heart and helps keep body mass and blood pressure down.']
    ],
    markScheme: ['Blockage of coronary arteries → less oxygen to heart muscle', 'Discuss diet AND exercise'],
    mistakes: ['Saying the blood vessels inside the heart chambers are blocked.']
  },
  {
    slug: 'blood', topicId: 't09', tier: 'core', refs: ['9.4.1', '9.4.2', '9.4.3', '9.4.4', '9.4.5', '9.4.6', '9.4.7'],
    title: 'Blood',
    body: 'Blood is made of red blood cells, white blood cells, platelets and plasma.',
    sections: [
      ['Functions', 'Red blood cells: transport oxygen (haemoglobin). White blood cells: phagocytosis and antibody production. Platelets: clotting. Plasma: transport of blood cells, ions, nutrients, urea, hormones and carbon dioxide.'],
      ['Clotting', 'Clotting prevents blood loss and stops pathogens entering.'],
      ['Phagocytes and lymphocytes', 'Phagocytes have a lobed nucleus and engulf and digest pathogens (phagocytosis). Lymphocytes have a large round nucleus and make antibodies.', 'S'],
      ['How a clot forms', 'Clotting involves the conversion of the soluble protein fibrinogen into insoluble fibrin, which forms a mesh that traps red blood cells.', 'S']
    ],
    markScheme: ['Function of each component', 'Extended: fibrinogen (soluble) → fibrin (insoluble)', 'Extended: identify phagocytes and lymphocytes'],
    mistakes: ['Saying platelets are cells with nuclei.']
  }
  ]
},
{
  unit: 'Gas exchange, respiration and excretion', term: 'Term 1',
  lessons: [
  {
    slug: 'breathing-system', topicId: 't11', tier: 'core', refs: ['11.1.1', '11.1.2', '11.1.6', '11.1.7', '11.1.11'], visual: 'gis:lungs+alveolus',
    title: 'The breathing system and gas exchange surfaces',
    body: 'Gas exchange surfaces in humans have features that make diffusion fast.',
    sections: [
      ['Features of gas exchange surfaces', 'Large surface area, thin surface (short diffusion distance), good blood supply (maintains the concentration gradient), good ventilation with air.'],
      ['Parts of the breathing system', 'Larynx, trachea, bronchi, bronchioles, alveoli, lungs, diaphragm, ribs, intercostal muscles, and the associated capillaries.'],
      ['Extended details', 'Internal and external intercostal muscles. Cartilage in the trachea keeps it open. Goblet cells make mucus that traps particles and pathogens; ciliated cells beat to move the mucus up and out of the airways.', 'S']
    ],
    markScheme: ['Four features of a gas exchange surface', 'Extended: cartilage keeps airway open; mucus and cilia protect'],
    mistakes: ['Saying cilia “trap” dust — mucus traps; cilia move it.']
  },
  {
    slug: 'ventilation', topicId: 't11', tier: 'core', refs: ['11.1.3', '11.1.4', '11.1.8', '11.1.9'],
    title: 'Ventilation and inspired vs expired air',
    body: 'Expired air contains less oxygen and more carbon dioxide and water vapour than inspired air.',
    sections: [
      ['Limewater', 'Breathing out through limewater turns it cloudy faster than air drawn in, showing expired air has more carbon dioxide.'],
      ['Composition', 'Inspired: about 21% oxygen, 0.04% carbon dioxide. Expired: about 16% oxygen, 4% carbon dioxide, more water vapour.'],
      ['Breathing in', 'External intercostal muscles contract, ribs move up and out; diaphragm contracts and flattens → volume of the thorax increases → pressure decreases → air flows in.', 'S'],
      ['Breathing out', 'External intercostals relax (internal intercostals contract in forced breathing), ribs move down and in; diaphragm relaxes and domes up → volume decreases → pressure increases → air flows out.', 'S'],
      ['Explaining the differences', 'Oxygen is absorbed into the blood for respiration; carbon dioxide is produced in respiration and diffuses out; water evaporates from the moist alveolar lining.', 'S']
    ],
    markScheme: ['Expired: less O₂, more CO₂, more water vapour', 'Extended: muscle → volume → pressure → air movement, in that order'],
    mistakes: ['Saying expired air has no oxygen.', 'Saying the lungs “suck in” air.']
  },
  {
    slug: 'exercise', topicId: 't11', tier: 'core', refs: ['11.1.5', '11.1.10', '9.2.4'],
    title: 'Exercise, breathing and heart rate',
    body: 'Physical activity increases the rate and depth of breathing.',
    sections: [
      ['Investigating', 'Count breaths per minute at rest and after exercise; use a spirometer or a tape round the chest for depth.'],
      ['The link', 'Exercise → muscles respire more → more carbon dioxide in the blood → the brain detects the increase → it sends impulses to the diaphragm and intercostal muscles → faster, deeper breathing removes carbon dioxide and supplies more oxygen.', 'S']
    ],
    markScheme: ['Rate AND depth increase', 'Extended: CO₂ concentration detected by the brain'],
    mistakes: ['Saying the brain detects low oxygen as the main stimulus.']
  },
  {
    slug: 'respiration-recap', topicId: 't12', tier: 'core', refs: ['12.2.1', '12.3.1', '12.3.2', '12.3.6', '12.3.7'],
    title: 'Aerobic and anaerobic respiration (Year 11 recap)',
    body: 'Aerobic respiration uses oxygen; anaerobic does not and releases much less energy per glucose molecule.',
    sections: [
      ['Side by side', 'Aerobic: glucose + oxygen → carbon dioxide + water; lots of energy; continues as long as oxygen is supplied. Anaerobic in muscle: glucose → lactic acid; little energy; used in vigorous exercise.'],
      ['Oxygen debt', 'After exercise, heart rate and breathing stay high to transport lactic acid to the liver and supply oxygen to break it down by aerobic respiration.', 'S']
    ],
    markScheme: ['Compare energy released and products', 'Extended: oxygen debt'],
    mistakes: ['Saying lactic acid is broken down in the muscles.']
  },
  {
    slug: 'excretion-liver', topicId: 't13', tier: 'core', refs: ['13.1.1', '13.1.2', '13.1.6', '13.1.7', '13.1.8', '13.1.9'], visual: 'gis:urinary',
    title: 'Excretion and the liver',
    body: 'Excretion is the removal of the waste products of metabolism and substances in excess of requirements. Carbon dioxide is excreted through the lungs; the kidneys excrete urea, excess water and excess ions.',
    sections: [
      ['Assimilation of amino acids', 'The liver uses amino acids to make proteins, including plasma proteins.', 'S'],
      ['Deamination', 'Excess amino acids cannot be stored. In the liver, the nitrogen-containing part (amino group) is removed to form urea. The rest is used in respiration or converted to glycogen or fat.', 'S'],
      ['Why excrete', 'Urea and other waste products are toxic if they build up in the body.', 'S']
    ],
    markScheme: ['Excretion definition', 'Lungs: CO₂; kidneys: urea, water, ions', 'Extended: deamination = removal of nitrogen-containing part of amino acids to form urea'],
    mistakes: ['Saying the kidneys make urea — the liver does.']
  },
  {
    slug: 'kidney', topicId: 't13', tier: 'core', refs: ['13.1.3', '13.1.4', '13.1.5'], visual: 'gis:nephron',
    title: 'The kidney and nephron',
    body: 'The urinary system: kidneys, ureters, bladder and urethra.',
    sections: [
      ['Kidney structure', 'Outer cortex and inner medulla; the ureter leaves from the centre.', 'S'],
      ['The nephron', 'Glomerulus: a knot of capillaries where blood is filtered under high pressure. Bowman’s capsule: collects the filtrate (water, glucose, urea, salts — not proteins or cells). Proximal tubule: all glucose and some water and ions are reabsorbed (selective reabsorption). Loop of Henle and collecting duct: more water is reabsorbed. What remains is urine: water, urea and salts.', 'S']
    ],
    markScheme: ['Identify kidneys, ureters, bladder, urethra', 'Extended: filtration at glomerulus; glucose reabsorbed in proximal tubule; water reabsorbed in loop/collecting duct'],
    mistakes: ['Saying glucose is “filtered out” and lost in urine in a healthy person.']
  }
  ]
},
{
  unit: 'Coordination and control', term: 'Term 1',
  lessons: [
  {
    slug: 'nervous-system', topicId: 't14', tier: 'core', refs: ['14.1.1', '14.1.2', '14.1.3', '14.1.4'],
    title: 'The human nervous system',
    body: 'Electrical impulses travel along neurones. The nervous system coordinates and regulates body functions.',
    sections: [
      ['CNS and PNS', 'The central nervous system (CNS) is the brain and spinal cord. The peripheral nervous system (PNS) is the nerves outside the brain and spinal cord.'],
      ['Three neurones', 'Sensory neurones carry impulses from receptors to the CNS. Relay neurones connect neurones inside the CNS. Motor neurones carry impulses from the CNS to effectors (muscles or glands).']
    ],
    markScheme: ['CNS = brain + spinal cord', 'Identify sensory, relay and motor neurones and their direction'],
    mistakes: ['Saying neurones carry “messages” — say electrical impulses.']
  },
  {
    slug: 'reflex-synapse', topicId: 't14', tier: 'core', refs: ['14.1.5', '14.1.6', '14.1.7', '14.1.8', '14.1.9', '14.1.10'], visual: 'gis:reflex+synapse',
    title: 'Reflex arcs and synapses',
    body: 'A reflex action is a means of automatically and rapidly integrating and coordinating stimuli with the responses of effectors.',
    sections: [
      ['The reflex arc', 'Stimulus → receptor → sensory neurone → relay neurone (in the spinal cord) → motor neurone → effector (muscle or gland) → response.'],
      ['Synapse', 'A synapse is a junction between two neurones.'],
      ['Structure', 'Vesicles containing neurotransmitter molecules in the first neurone; a synaptic gap; receptor proteins on the membrane of the next neurone.', 'S'],
      ['Events at a synapse', 'An impulse arrives → vesicles release neurotransmitter into the gap → it diffuses across the gap → binds to receptor proteins on the next neurone → an impulse is stimulated in the next neurone.', 'S'],
      ['One direction', 'Synapses ensure impulses travel in one direction only, because only the first neurone releases neurotransmitter and only the second has receptors.', 'S']
    ],
    markScheme: ['Reflex arc in order', 'Reflex: automatic and rapid', 'Extended: neurotransmitter diffuses and binds to receptors'],
    mistakes: ['Saying the impulse “jumps” the gap.']
  },
  {
    slug: 'eye', topicId: 't14', tier: 'core', refs: ['14.2.1', '14.2.2', '14.2.3', '14.2.7', '14.2.8', '14.2.9'], visual: 'gis:eye',
    title: 'The eye',
    body: 'Sense organs are groups of receptor cells responding to specific stimuli: light, sound, touch, temperature and chemicals.',
    sections: [
      ['Parts and functions', 'Cornea: refracts light. Iris: controls how much light enters the pupil. Lens: focuses light onto the retina. Retina: contains light receptors, some sensitive to light of different colours. Optic nerve: carries impulses to the brain.'],
      ['Rods and cones', 'Rods: sensitive in low light, black and white, spread across the retina. Cones: three types sensitive to different colours of light, work in bright light, concentrated at the fovea.', 'S'],
      ['Fovea', 'The fovea is the part of the retina with the most cones and no rods; it gives the most detailed colour vision.', 'S']
    ],
    markScheme: ['Function of cornea, iris, lens, retina, optic nerve', 'Extended: rods → dim light; cones → colour; fovea → most cones'],
    mistakes: ['Saying the lens does all the refracting — the cornea does most.']
  },
  {
    slug: 'pupil-accommodation', topicId: 't14', tier: 'core', refs: ['14.2.4', '14.2.5', '14.2.6'],
    title: 'Pupil reflex and accommodation',
    body: 'The pupil reflex changes pupil diameter in response to light intensity.',
    sections: [
      ['Pupil reflex', 'Bright light → pupil gets smaller (constricts) to protect the retina. Dim light → pupil gets wider (dilates) so more light enters.'],
      ['Antagonistic muscles', 'In bright light the circular muscles of the iris contract and the radial muscles relax → pupil constricts. In dim light the radial muscles contract and the circular muscles relax → pupil dilates.', 'S'],
      ['Accommodation', 'Near object: ciliary muscles contract, suspensory ligaments slacken, lens becomes fatter (more convex) → more refraction. Distant object: ciliary muscles relax, suspensory ligaments tighten, lens is pulled thinner → less refraction.', 'S']
    ],
    markScheme: ['Direction of change for each condition', 'Extended: circular vs radial muscles', 'Extended: ciliary muscle → suspensory ligament → lens shape, in that order'],
    mistakes: ['Saying “the pupil muscles contract” without naming circular or radial.']
  },
  {
    slug: 'thermoregulation', topicId: 't14', tier: 'supplement', refs: ['14.4.1', '14.4.3', '14.4.6', '14.4.7', '14.4.8'], visual: 'gis:skin',
    title: 'Homeostasis: controlling body temperature',
    body: 'Homeostasis is the maintenance of a constant internal environment. It works by negative feedback, with a set point.',
    sections: [
      ['Negative feedback', 'A change away from the set point is detected and a response returns the condition to the set point.'],
      ['Skin', 'Know: hairs, hair erector muscles, sweat glands, receptors, sensory neurones, blood vessels and fatty tissue.'],
      ['Too hot', 'The hypothalamus detects the rise. Sweating: sweat evaporates, transferring heat from the skin. Vasodilation: arterioles near the skin surface widen, more blood flows near the surface, more heat is lost by radiation.'],
      ['Too cold', 'Shivering: muscle contractions release heat from respiration. Vasoconstriction: arterioles near the surface narrow, less blood flows near the surface, less heat is lost. Hairs stand up, trapping insulating air. Fatty tissue insulates.']
    ],
    markScheme: ['Homeostasis definition', 'Vasodilation/vasoconstriction: arterioles widen/narrow', 'Sweat evaporation removes heat'],
    mistakes: ['Saying blood vessels “move” closer to the skin.', 'Saying capillaries dilate — it is the arterioles.']
  },
  {
    slug: 'blood-glucose', topicId: 't14', tier: 'core', refs: ['14.4.2', '14.4.4', '14.4.5', '14.3.5'],
    title: 'Homeostasis: controlling blood glucose',
    body: 'Insulin decreases blood glucose concentration.',
    sections: [
      ['Too high', 'After a meal, the pancreas detects high blood glucose and secretes insulin. Insulin makes the liver (and muscles) take up glucose and convert it to glycogen, lowering blood glucose.', 'S'],
      ['Too low', 'The pancreas secretes glucagon, which makes the liver convert glycogen to glucose and release it into the blood.', 'S'],
      ['Type 1 diabetes', 'The pancreas does not make enough insulin. Treated by injecting insulin, monitoring blood glucose and controlling the diet (carbohydrate intake) and exercise.', 'S']
    ],
    markScheme: ['Insulin lowers blood glucose', 'Extended: glucose ↔ glycogen in the liver', 'Extended: treatment of Type 1 diabetes'],
    mistakes: ['Mixing glucagon (hormone) with glycogen (storage carbohydrate).']
  },
  {
    slug: 'hormones', topicId: 't14', tier: 'core', refs: ['14.3.1', '14.3.2', '14.3.3', '14.3.4', '14.3.6'],
    title: 'Hormones versus nervous control; adrenaline',
    body: 'A hormone is a chemical substance, produced by a gland and carried by the blood, which alters the activity of one or more specific target organs.',
    sections: [
      ['Glands and hormones', 'Adrenal glands: adrenaline. Pancreas: insulin (and glucagon). Testes: testosterone. Ovaries: oestrogen.'],
      ['Adrenaline', 'Secreted in fight-or-flight situations. Increases breathing rate and heart rate, and widens the pupils.'],
      ['Metabolic role', 'Adrenaline increases blood glucose concentration and heart rate, to supply more glucose and oxygen to muscles.', 'S'],
      ['Nervous vs hormonal', 'Nervous: electrical impulses along neurones, very fast, short-lasting, very precise target. Hormonal: chemicals in the blood, slower, longer-lasting, can affect several organs.']
    ],
    markScheme: ['Hormone definition (gland, blood, target organ)', 'Adrenaline effects', 'Compare speed and duration'],
    mistakes: ['Saying hormones travel along nerves.']
  }
  ]
},
{
  unit: 'Sexual reproduction', term: 'Term 2',
  lessons: [
  {
    slug: 'reproductive-systems', topicId: 't16', tier: 'core', refs: ['16.4.1', '16.4.2', '16.4.3', '16.4.4', '16.4.5', '16.4.6', '16.5.1'], visual: 'gis:male+female',
    title: 'Reproductive organs, gametes and fertilisation; puberty',
    body: 'Fertilisation is the fusion of the nuclei from a male gamete (sperm) and a female gamete (egg cell).',
    sections: [
      ['Male system', 'Testes make sperm and testosterone; scrotum holds the testes; sperm ducts carry sperm; prostate gland and seminal vesicles add fluid; urethra carries semen (and urine); penis.'],
      ['Female system', 'Ovaries make eggs and oestrogen; oviducts carry the egg and are where fertilisation happens; uterus is where the fetus develops; cervix; vagina.'],
      ['Gametes', 'Sperm: flagellum to swim, many mitochondria for energy, acrosome with enzymes to digest the jelly coat. Egg: energy stores in the cytoplasm, a jelly coat that changes after fertilisation so only one sperm enters. Sperm are smaller, motile and made in huge numbers; eggs are larger, not motile and few.'],
      ['Puberty', 'Testosterone causes secondary sexual characteristics in boys (deeper voice, facial and body hair, muscle growth, sperm production). Oestrogen causes them in girls (breasts, wider hips, the menstrual cycle starts).']
    ],
    markScheme: ['Function of each named organ', 'Adaptive features of sperm and egg', 'Compare gametes: size, structure, motility, numbers'],
    mistakes: ['Saying fertilisation happens in the uterus — it happens in the oviduct.']
  },
  {
    slug: 'menstrual-cycle', topicId: 't16', tier: 'core', refs: ['16.5.2', '16.5.3', '16.5.4'],
    title: 'Hormones and the menstrual cycle',
    body: 'The menstrual cycle repeats about every 28 days: the uterus lining thickens, an egg is released at ovulation (around day 14), and if there is no fertilisation the lining breaks down (menstruation).',
    sections: [
      ['Where hormones are made', 'FSH and LH: the pituitary gland. Oestrogen: the ovary. Progesterone: the corpus luteum in the ovary, and the placenta in pregnancy.', 'S'],
      ['What they do', 'FSH: an egg matures in a follicle; stimulates oestrogen. Oestrogen: rebuilds the uterus lining; high levels trigger the LH surge. LH: triggers ovulation; the follicle becomes the corpus luteum. Progesterone: maintains the uterus lining. If no pregnancy, the corpus luteum breaks down, progesterone falls, and menstruation begins. In pregnancy progesterone stays high (from the placenta), so the lining is kept.', 'S']
    ],
    markScheme: ['Order of events in the cycle', 'Extended: name the gland for each hormone and its role'],
    mistakes: ['Saying oestrogen causes ovulation directly — it triggers the LH surge.']
  },
  {
    slug: 'pregnancy', topicId: 't16', tier: 'core', refs: ['16.4.7', '16.4.8', '16.4.9', '16.4.10'], visual: 'gis:fetus',
    title: 'Pregnancy and birth',
    body: 'After fertilisation the zygote divides to form a ball of cells, an embryo, which implants into the lining of the uterus.',
    sections: [
      ['Supporting the fetus', 'Placenta: exchange between mother and fetus. Umbilical cord: carries blood between fetus and placenta. Amniotic sac and amniotic fluid: protect the fetus from bumps.'],
      ['The placenta', 'Dissolved nutrients, oxygen and antibodies pass from the mother’s blood to the fetus; carbon dioxide and urea pass from the fetus to the mother. The bloods do not mix.', 'S'],
      ['Crossing the placenta', 'Some pathogens (e.g. rubella virus) and toxins (nicotine, alcohol, some drugs) can pass across the placenta and harm the fetus.', 'S']
    ],
    markScheme: ['Functions of placenta, umbilical cord, amniotic sac/fluid', 'Extended: what passes each way across the placenta'],
    mistakes: ['Saying the mother’s and fetus’s blood mix.']
  },
  {
    slug: 'ivf', topicId: 't20', tier: 'supplement', refs: ['20.4.8'],
    title: 'Artificial insemination and IVF',
    body: 'Assisted reproduction is used in fertility treatment and in captive breeding of endangered species.',
    sections: [
      ['Artificial insemination', 'Sperm are collected and placed directly into the female’s reproductive tract — useful when animals are far apart or will not mate.'],
      ['In vitro fertilisation', 'Eggs are collected, fertilised with sperm in a dish, and the resulting embryos are placed into the uterus (or a surrogate). In captive breeding, this lets breeders choose parents to keep genetic variation.']
    ],
    markScheme: ['Describe each method and why it helps conservation'],
    mistakes: ['Calling IVF a form of cloning.']
  }
  ]
},
{
  unit: 'Chromosomes, genes, proteins and inheritance', term: 'Term 2',
  lessons: [
  {
    slug: 'mitosis-meiosis', topicId: 't17', tier: 'core', refs: ['17.2', '17.3', '17.1.10', '17.1.11', '17.1.12'],
    title: 'Mitosis and meiosis',
    body: 'Mitosis is nuclear division giving rise to genetically identical cells. Meiosis is involved in the production of gametes; it is reduction division, halving the chromosome number and producing genetically different cells.',
    sections: [
      ['Mitosis', 'Used for growth, repair of damaged tissues, replacement of cells and asexual reproduction.'],
      ['Haploid and diploid', 'A haploid nucleus contains a single set of chromosomes (human gametes: 23). A diploid nucleus contains two sets (human body cells: 46, as 23 pairs).', 'S'],
      ['What happens in mitosis', 'Chromosomes are copied exactly before mitosis; the copies separate so each new cell has the same number of chromosomes as the parent.', 'S'],
      ['Stem cells', 'Stem cells are unspecialised cells that divide by mitosis to produce daughter cells that can become specialised for specific functions.', 'S'],
      ['Meiosis', 'Halves the chromosome number from diploid to haploid; produces four genetically different cells.', 'S']
    ],
    markScheme: ['Mitosis → genetically identical; meiosis → gametes, genetically different', 'Extended: haploid/diploid, chromosome replication before mitosis'],
    mistakes: ['Saying meiosis is used for growth.']
  },
  {
    slug: 'dna-protein', topicId: 't17', tier: 'core', refs: ['4.1.4', '17.1.1', '17.1.2', '17.1.3', '17.1.5', '17.1.6', '17.1.7', '17.1.8', '17.1.9'], visual: 'gis:dna',
    title: 'DNA structure and protein synthesis',
    body: 'A chromosome is made of DNA, which contains genetic information in the form of genes. A gene is a length of DNA that codes for a protein. An allele is an alternative form of a gene.',
    sections: [
      ['DNA structure', 'Two strands coiled together to form a double helix. Each strand has a sequence of bases. The strands are held together by bonds between pairs of bases. A pairs with T; C pairs with G.', 'S'],
      ['Genes to proteins', 'The sequence of bases in a gene determines the sequence of amino acids in a protein. Different sequences of amino acids give different shapes to proteins (enzymes, antibodies, receptors). DNA controls cell function by controlling the production of proteins.', 'S'],
      ['Protein synthesis', 'The gene stays in the nucleus. mRNA is made as a copy of the gene and moves to the cytoplasm. At a ribosome, the mRNA base sequence is used to assemble amino acids into a protein in the correct sequence.', 'S'],
      ['Gene expression', 'All body cells contain the same genes, but in a given cell many are not expressed: the cell makes only the proteins it needs.', 'S']
    ],
    markScheme: ['Chromosome → DNA → genes → proteins', 'Extended: A–T, C–G; double helix', 'Extended: base sequence → amino acid sequence → protein shape'],
    mistakes: ['Saying the gene leaves the nucleus — mRNA does.']
  },
  {
    slug: 'genetic-diagrams', topicId: 't17', tier: 'core', refs: ['17.1.4', '17.4.1', '17.4.2', '17.4.3', '17.4.4', '17.4.5', '17.4.6', '17.4.7', '17.4.8', '17.4.9', '17.4.10', '17.4.11', '17.4.12', '17.4.13'],
    title: 'Genetic diagrams and test crosses',
    body: 'Inheritance is the transmission of genetic information from generation to generation.',
    sections: [
      ['Key terms', 'Genotype: the genetic make-up of an organism in terms of the alleles present. Phenotype: the observable features. Homozygous: two identical alleles of a gene. Heterozygous: two different alleles. Dominant: an allele expressed if present. Recessive: expressed only when there is no dominant allele. Identical homozygous individuals that breed together are pure-breeding; heterozygous individuals are not.'],
      ['Writing a cross', 'Parent phenotypes → parent genotypes → gametes (circle them) → Punnett square → offspring genotypes → offspring phenotypes → ratio. Aa × Aa → 3 dominant : 1 recessive. Aa × aa → 1 : 1.'],
      ['Sex', 'Females XX, males XY. Each child has a 50% chance of being male.'],
      ['Pedigrees', 'Two unaffected parents with an affected child → the condition is recessive, and both parents are heterozygous.'],
      ['Test cross', 'Cross the unknown (dominant phenotype) with a homozygous recessive. All offspring dominant → unknown is homozygous dominant. About half recessive → unknown is heterozygous.', 'S']
    ],
    markScheme: ['Full genetic diagram with gametes shown', 'Ratios as probabilities, not certainties', 'Extended: test cross with homozygous recessive'],
    mistakes: ['Writing “Aa” as one gamete — gametes carry one allele.']
  },
  {
    slug: 'codominance', topicId: 't17', tier: 'supplement', refs: ['17.4.14', '17.4.15', '17.4.16', '17.4.17', '17.4.18'],
    title: 'Codominance and sex linkage',
    body: 'Codominance is a situation in which both alleles in heterozygous organisms contribute to the phenotype.',
    sections: [
      ['ABO blood groups', 'Three alleles: Iᴬ, Iᴮ and Iᴼ. Iᴬ and Iᴮ are codominant; both are dominant to Iᴼ. Group A: IᴬIᴬ or IᴬIᴼ. Group B: IᴮIᴮ or IᴮIᴼ. Group AB: IᴬIᴮ. Group O: IᴼIᴼ.'],
      ['Sex linkage', 'A sex-linked characteristic is one for which the gene responsible is on a sex chromosome, so it is more common in one sex. Red-green colour blindness is recessive on the X chromosome: Xᴮ (normal), Xᵇ (colour blind). Males (XᵇY) need only one recessive allele, so they are affected more often.'],
      ['Crosses', 'Show the X and Y chromosomes with the alleles as superscripts, e.g. XᴮXᵇ × XᴮY → ¼ chance of a colour-blind son.']
    ],
    markScheme: ['Use the correct allele symbols', 'Explain why males are affected more often'],
    mistakes: ['Putting an allele on the Y chromosome.']
  }
  ]
},
{
  unit: 'Variation and selection', term: 'Term 2',
  lessons: [
  {
    slug: 'variation', topicId: 't18', tier: 'core', refs: ['18.1.1', '18.1.2', '18.1.3', '18.1.4', '18.1.5', '18.1.6', '18.1.7', '18.1.8', '18.1.9', '18.1.10'],
    title: 'Continuous and discontinuous variation; mutation',
    body: 'Variation is the differences between individuals of the same species.',
    sections: [
      ['Two kinds', 'Continuous variation results in a range of phenotypes between two extremes (height, mass) — plot as a histogram. Discontinuous variation results in a limited number of phenotypes with no intermediates (ABO blood group, seed shape) — plot as a bar chart. Discontinuous is usually caused by genes only; continuous by genes and the environment.'],
      ['Mutation', 'Mutation is genetic change. Mutation is the way new alleles are formed. Ionising radiation and some chemicals increase the rate of mutation.'],
      ['Gene mutation', 'A gene mutation is a random change in the base sequence of DNA.', 'S'],
      ['Sources of genetic variation', 'Mutation, meiosis, random mating and random fertilisation.', 'S']
    ],
    markScheme: ['Continuous: range, intermediates; discontinuous: distinct categories', 'Mutation = genetic change; forms new alleles', 'Extended: list the four sources of variation'],
    mistakes: ['Saying all mutations are harmful.']
  },
  {
    slug: 'natural-selection', topicId: 't18', tier: 'core', refs: ['18.3.1', '18.3.4', '18.3.5'],
    title: 'Natural selection',
    body: 'Natural selection happens because individuals vary and not all of them survive to reproduce.',
    sections: [
      ['The steps', 'Genetic variation within a population → production of many offspring → competition for resources → struggle for survival → individuals better adapted to the environment are more likely to survive and reproduce → they pass on their alleles to the next generation.'],
      ['Adaptation', 'The process, resulting from natural selection, by which populations become more suited to their environment over many generations.', 'S'],
      ['Antibiotic resistance', 'A mutation gives resistance → the antibiotic kills non-resistant bacteria → resistant bacteria survive and reproduce → the resistance allele becomes more common.', 'S']
    ],
    markScheme: ['All six steps, especially “pass on alleles”', 'Extended: antibiotic resistance as an example'],
    mistakes: ['Saying organisms change in order to survive — the variation already exists.']
  },
  {
    slug: 'adaptive-features', topicId: 't18', tier: 'core', refs: ['18.2.1', '18.2.2', '18.2.3'],
    title: 'Adaptive features',
    body: 'An adaptive feature is an inherited feature that helps an organism to survive and reproduce in its environment.',
    sections: [
      ['Interpreting data', 'Link each feature to the problem it solves: thick fur → insulation in cold; large ears → heat loss in desert.'],
      ['Xerophytes', 'Plants adapted to dry conditions: thick waxy cuticle, sunken stomata, few stomata, rolled leaves, hairs (trap moist air), small leaves or spines, deep or widespread roots, water storage tissue.', 'S'],
      ['Hydrophytes', 'Plants adapted to water: large air spaces for buoyancy and gas supply, stomata on the upper surface of floating leaves, little or no cuticle, little xylem and support tissue.', 'S']
    ],
    markScheme: ['Feature → how it helps → in that environment', 'Extended: explain each xerophyte feature by reducing water loss'],
    mistakes: ['Listing features without explaining them.']
  },
  {
    slug: 'selective-breeding', topicId: 't18', tier: 'core', refs: ['18.3.2', '18.3.3', '18.3.6'],
    title: 'Selective breeding',
    body: 'Selective breeding (artificial selection) is done by humans to produce useful varieties.',
    sections: [
      ['The steps', 'Choose individuals with the desirable features → cross (breed) them → select the offspring showing the features → repeat over many generations.'],
      ['Examples', 'Crops with higher yield or disease resistance; cattle with more milk; dogs with particular temperaments.'],
      ['Natural vs artificial', 'Natural selection: the environment selects; features help survival; slow. Artificial selection: humans select; features useful to humans; faster.', 'S']
    ],
    markScheme: ['Steps in order including many generations', 'Extended: compare natural and artificial selection'],
    mistakes: ['Confusing selective breeding with genetic modification.']
  }
  ]
}
];

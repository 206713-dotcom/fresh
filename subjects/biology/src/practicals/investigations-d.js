export const investigationsD = [
  [
    "lipids",
    "04",
    "Ethanol emulsion test for lipids",
    "Detect lipids in teacher-provided food extracts.",
    "Lipids dissolve in ethanol and form a cloudy emulsion when water is added.",
    "Sample",
    "Emulsion observation",
    null,
    null,
    "test-tubes",
    "Ethanol, distilled water, teacher-approved samples, tubes and pipettes.",
    "Place equal amounts of each sample in separate tubes. Add ethanol under supervision and mix. Transfer the liquid extract to water as directed; observe cloudiness. Repeat with known oil and water controls. Use separate clean tubes to avoid cross-contamination.",
    "Sample, ethanol and water volumes; mixing and observation time",
    "Oil positive; water negative.",
    "Ethanol flammable; no heat or ignition; goggles; teacher supervises.",
    "White cloudy emulsion indicates lipid; clear mixture is negative.",
    "Qualitative result; no quantitative concentration from cloudiness alone.",
    "Record observed appearance in a table; no line graph for categories.",
    "Suspended solids mimic cloudiness; use clarified extract and matched blank.",
    "Why must ethanol be kept away from flames?",
    [
      "Ethanol is flammable",
      "Ignition can cause fire or burns"
    ],
    "Add water after ethanol extraction, not Benedict’s reagent."
  ],
  [
    "vitamin-storage",
    "04",
    "Vitamin C: storage time",
    "Investigate how storage duration affects vitamin C in juice.",
    "Vitamin C may oxidise during storage, increasing juice volume required for a fixed DCPIP endpoint.",
    "Storage time / days",
    "Juice volume / cm³",
    [
      0,
      1,
      2,
      3,
      4
    ],
    [
      1.5,
      1.7,
      2,
      2.3,
      2.6
    ],
    "test-tubes",
    "One batch of juice; labelled closed containers; DCPIP; graduated syringe; white tile; timer.",
    "Divide juice into equal sealed aliquots. Store at the same temperature and light exposure for different durations. Test each against equal freshly prepared DCPIP volumes, adding juice in small measured increments to the same endpoint. Repeat using independently stored aliquots.",
    "Juice batch, container size, headspace, temperature, light, DCPIP volume and concentration",
    "Fresh day-zero juice; known vitamin C standard.",
    "Teacher stores and discards samples safely; no tasting; goggles.",
    "More stored juice may be needed as vitamin C concentration falls.",
    "If 1.5 cm³ fresh and 2.0 cm³ stored are required, estimated relative concentration = 1.5/2.0 = 75%.",
    "Endpoint volume rises as estimated vitamin C concentration falls; inverse relationship.",
    "Other reducing compounds and colour affect DCPIP; use standards, same juice batch and controlled storage.",
    "Explain why the day-zero result matters.",
    [
      "Provides initial reference concentration",
      "Allows comparison of later change"
    ],
    "Do not conclude that larger endpoint volume means more vitamin C."
  ],
  [
    "vitamin-heating",
    "04",
    "Vitamin C: heating duration",
    "Investigate the effect of heating time on vitamin C in juice.",
    "Longer heating may reduce vitamin C content through degradation or oxidation.",
    "Heating time / min",
    "Juice volume / cm³",
    [
      0,
      2,
      4,
      6,
      8
    ],
    [
      1.2,
      1.4,
      1.7,
      2,
      2.4
    ],
    "water-bath",
    "Teacher-provided juice; covered tubes; temperature-controlled bath; DCPIP; pipettes; timer.",
    "Prepare equal juice aliquots and heat for different durations at a fixed safe teacher-selected temperature. Cool all to the same temperature before testing. Check evaporation and restore original volume with water where appropriate. Add juice to fixed DCPIP volume until colour disappears. Repeat independent aliquots.",
    "Juice source, heating temperature, initial and final volume, DCPIP conditions",
    "Unheated aliquot treated identically otherwise.",
    "Teacher handles hot water; goggles; avoid sealed heated containers.",
    "Endpoint volume may rise after prolonged heating.",
    "1.2/2.4 × 100 = 50% of initial estimated vitamin C concentration.",
    "Compare inverse endpoint volumes, not raw volume as vitamin concentration.",
    "Evaporation concentrates solutes; measure volume before and after, cool before test and standardise endpoint.",
    "Why cool the aliquots before testing?",
    [
      "Temperature may alter reaction or endpoint",
      "Makes test conditions comparable"
    ],
    "Control evaporation rather than assuming heating changes only vitamin C."
  ],
  [
    "vitamin-juices",
    "04",
    "Comparing vitamin C in different fruit juices",
    "Compare DCPIP endpoint volumes for different juices.",
    "Juices with more vitamin C require less volume to reduce a fixed amount of DCPIP.",
    "Juice identity",
    "Mean endpoint volume / cm³",
    null,
    null,
    "test-tubes",
    "Teacher-provided juices, DCPIP, graduated syringe, tubes, white background.",
    "Use separate samples of each juice. Mix and filter where appropriate using the same method. Measure identical DCPIP volumes into clean tubes. Add juice in small measured increments until colour just disappears. Record three independent endpoints for each juice and calculate mean.",
    "DCPIP concentration and volume, temperature, endpoint criterion, sample preparation",
    "Known vitamin C reference and water negative control.",
    "No tasting; goggles; teacher handles waste.",
    "Example means: orange 1.6, guava 0.8, apple 4.2 cm³; these are fictional, not nutritional claims.",
    "Guava relative to orange = 1.6/0.8 = 2 times estimated concentration under this model.",
    "Use separate bars for juice types; lowest endpoint volume indicates highest estimated vitamin C.",
    "Juice pigments and other reducing compounds confound results; clarify samples and compare calibrated standards.",
    "Which example juice has greatest estimated concentration, and why?",
    [
      "Guava",
      "Smallest volume needed to reduce equal DCPIP"
    ],
    "Do not rank real brands from fictional data."
  ],
  [
    "enzyme-concentration",
    "05",
    "Amylase: enzyme concentration",
    "Investigate enzyme concentration and starch digestion rate.",
    "Increasing enzyme concentration increases available active sites until substrate availability limits the reaction.",
    "Relative enzyme concentration / %",
    "Reciprocal endpoint time / s⁻¹",
    [
      10,
      25,
      50,
      75,
      100
    ],
    [
      0.006,
      0.015,
      0.029,
      0.041,
      0.049
    ],
    "water-bath",
    "Teacher-prepared amylase dilutions, starch, buffer, iodine, spotting tile, pipettes, timer.",
    "Prepare equal total-volume mixtures with different enzyme concentrations by dilution. Keep starch amount and buffer constant. Equilibrate at same temperature. Mix and time; test at fixed intervals with iodine until starch is absent. Repeat independently; calculate reciprocal endpoint times.",
    "Starch concentration, pH, temperature, final volume and sampling interval",
    "No active enzyme control.",
    "Goggles; teacher prepares enzyme solutions; avoid aerosols.",
    "Higher enzyme concentration usually gives shorter endpoint time.",
    "At 50 s, reciprocal rate = 0.020 s⁻¹.",
    "Rate may approach a plateau; fixed endpoint reciprocal is a proxy, not instantaneous rate.",
    "Dilution can change final volume and pH; use consistent buffer and equal volumes.",
    "Explain the initial increase in rate.",
    [
      "More enzyme active sites available",
      "More enzyme–substrate complexes formed per unit time"
    ],
    "Do not confuse enzyme concentration with substrate concentration."
  ],
  [
    "substrate-concentration",
    "05",
    "Catalase: substrate concentration",
    "Investigate how dilute teacher-prepared hydrogen peroxide concentration affects oxygen output.",
    "Rate increases with substrate concentration until enzyme active sites become limiting.",
    "Relative substrate concentration / %",
    "Oxygen production / cm³ min⁻¹",
    [
      10,
      25,
      50,
      75,
      100
    ],
    [
      1,
      2.3,
      3.8,
      4.5,
      4.7
    ],
    "gas",
    "Teacher-approved dilute substrate, food plant catalase preparation, gas syringe, timer, buffer.",
    "Teacher prepares safe diluted substrate levels. Keep catalase preparation and volume identical. Equilibrate mixtures separately, combine under supervision and collect oxygen using a freely moving gas syringe. Measure gas output in the same early time interval. Repeat with fresh mixtures.",
    "Enzyme amount, temperature, pH, total volume, observation interval",
    "No-enzyme mixture at matching substrate level.",
    "Teacher handles peroxide; goggles; never use concentrated peroxide or seal a gas-producing vessel without outlet.",
    "Oxygen production increases then approaches a plateau.",
    "9 cm³ in 2 min = 4.5 cm³/min.",
    "Enzyme availability limits further increase at high substrate concentration in the model.",
    "Gas leakage and tissue variability; use uniform enzyme preparation and check gas collection connections.",
    "Explain why the curve levels off.",
    [
      "Most active sites occupied",
      "Enzyme concentration limits further rate increase"
    ],
    "A plateau is not evidence that all enzyme is denatured."
  ],
  [
    "catalase",
    "05",
    "Catalase: enzyme activity and tissue treatment",
    "Compare oxygen output from equal masses of untreated and heat-treated plant tissue.",
    "Heating can denature catalase, reducing oxygen output when exposed to substrate.",
    "Tissue treatment",
    "Oxygen output / cm³",
    null,
    null,
    "gas",
    "Teacher-prepared untreated and heat-treated potato tissue; approved dilute hydrogen peroxide; gas syringe; timer.",
    "Teacher prepares equal tissue masses and heat-treated samples, then cools them to the same temperature. Add each to equal volumes of approved dilute substrate. Collect oxygen for a fixed interval in a safe gas syringe setup. Repeat fresh samples and compare means.",
    "Tissue mass and surface area, substrate concentration/volume, reaction temperature and time",
    "No tissue and heat-treated tissue comparisons.",
    "Teacher handles reagent and hot preparation; goggles; avoid sealed gas systems.",
    "Untreated tissue gives greater oxygen output; heat-treated tissue gives little output.",
    "Illustrative untreated 12, 11, 13 cm³ → mean 12; treated 1, 0, 2 → mean 1.",
    "Use a bar chart for treatments; rate requires division by identical measurement time.",
    "Foam height depends on bubble size; gas volume is more direct. Use equal tissue surface area.",
    "Why cool heat-treated tissue before reaction?",
    [
      "Makes reaction temperature equal",
      "Separates effect of prior heating from immediate temperature effect"
    ],
    "Distinguish oxygen gas from carbon dioxide."
  ],
  [
    "lipase",
    "05",
    "Lipase and milk: pH endpoint",
    "Investigate temperature and time for lipase to acidify a milk mixture.",
    "Lipase releases fatty acids, lowering pH; rate depends on temperature.",
    "Temperature / °C",
    "Reciprocal endpoint time / s⁻¹",
    [
      15,
      25,
      35,
      45,
      55
    ],
    [
      0.004,
      0.009,
      0.018,
      0.013,
      0.003
    ],
    "water-bath",
    "Teacher-approved milk mixture and lipase, pH indicator, water baths, pipettes and stopwatch.",
    "Use equal milk aliquots with identical initial pH and indicator. Equilibrate milk and enzyme separately at selected temperatures. Mix, start timing and observe until a defined colour endpoint. Repeat each condition; record reciprocal time. Use teacher-approved concentrations and pH.",
    "Milk type/fat content, enzyme concentration, initial pH, final volume, indicator amount",
    "No active lipase control.",
    "Goggles; check milk allergy; no tasting; teacher prepares reagents.",
    "Fatty acid production decreases pH; fastest endpoint near enzyme optimum.",
    "56 s corresponds to about 0.018 s⁻¹.",
    "Compare reciprocal rates rather than pH endpoint alone.",
    "Initial pH and indicator visibility in milk vary; standardise preparation and consider pH sensor.",
    "Why does pH fall?",
    [
      "Lipase breaks down lipid",
      "Fatty acids are produced"
    ],
    "Do not claim lipase produces amino acids."
  ]
];

import { core, depths, prescribed } from './history-content.js';
import { studyTopics } from './history-study.js?v=2027';
import { documentSets } from './history-mock-sources.js?v=2027';

const coreOrder = {
  A: [['revolutions', 'german-unification', 'civil-war', 'empires'], ['italy', 'german-unification', 'empires', 'ww1-origins']],
  B: [['versailles', 'league', 'cold-war', 'eastern-europe'], ['league', 'outbreak-1939', 'containment', 'eastern-europe']]
};

const depthPapers = {
  ww1: [
    ['the development of trench warfare on the Western Front in 1914', 'the fighting at Verdun and the Somme', 'Trace the failure of the German advance, the Marne, the Race to the Sea and First Ypres. Explain how a continuous front and defensive firepower encouraged both armies to dig in.', 'Compare losses and attrition, relief of pressure on Verdun, changes to tactics and the limits of territorial gains. Judge how each battle changed the armies’ capacity to fight.'],
    ['the German Spring Offensive of 1918', 'the part played by American entry in the Allied victory', 'Explain Germany’s aims after Russia’s exit, the offensive’s opening advances and problems with supplies, casualties and changing objectives before the offensive ran out of momentum.', 'Assess manpower, finance, supplies, morale and the German decision to attack before US strength grew. Weigh the contribution against the blockade, Allied coordination and German exhaustion.'],
    ['Japan’s military involvement in the war', 'the part played by troops from the British Empire on the Western Front', 'Cover Japan’s entry on the Allied side, the capture of Tsingtao and German islands, and later assistance with naval protection and convoy work.', 'Discuss reinforcement in 1914, Indian forces at Neuve Chapelle, Canadians at Vimy and the diversity of imperial contributions. Weigh timing, casualties, combat effects and the limits of individual successes.'],
    ['the Allied campaign at Gallipoli', 'the effect of the war at sea on the outcome of the war', 'Explain why the Allies sought to open the Dardanelles, the naval failure, landings, failure to secure decisive ground and evacuation.', 'Compare the effect of the British blockade, the strategic consequences of Jutland and the U-boat challenge. Link convoys to endurance and weigh sea power against land offensives.']
  ],
  germany: [
    ['the crisis over the Ruhr and German currency in 1923', 'Stresemann’s contribution to the survival of the Weimar Republic', 'Link reparations defaults to French and Belgian occupation, passive resistance, money creation and hyperinflation. Finish with the end of resistance and the new currency.', 'Compare domestic stabilisation, Dawes-era loans, improved diplomacy at Locarno and League membership. Weigh recovered confidence against financial dependence and enduring opposition.'],
    ['the consolidation of Hitler’s political power between January 1933 and August 1934', 'the role of coercion in securing control of German society', 'Follow the Reichstag Fire decree, election, Enabling Act, removal of parties and unions, purge of the SA leadership and merger of state offices after Hindenburg’s death.', 'Consider the police, camps, denunciation and penalties, alongside propaganda, concessions and evidence of dissent. Judge what coercion achieved in behaviour and where belief is harder to measure.'],
    ['the developments that led to Hitler’s appointment as chancellor in January 1933', 'the Great Depression for the collapse of parliamentary government', 'Trace unemployment and coalition instability, elections in 1930 and 1932, presidential government and the negotiations involving Hindenburg, von Papen and Hitler.', 'Compare economic insecurity, radical voting and loss of confidence with Article 48, elite choices and long-standing resistance to the republic. Explain what the Depression accelerated.'],
    ['changes to German civilian life during the Second World War', 'the impact of racial persecution on life under the Nazis', 'Describe rationing and bombing, changes in labour mobilisation, forced labour and the effects of mounting casualties and resource shortages.', 'Trace exclusion, legal discrimination, violence and mass murder. Compare direct effects on persecuted groups with the roles of institutions, war and the opportunities or risks faced by others.']
  ],
  russia: [
    ['the events that led to the abdication of Nicholas II in March 1917', 'the importance of the First World War in bringing down Tsarism', 'Connect shortages and protest in Petrograd to the soldiers’ refusal to suppress them, formation of alternative authorities and the loss of political and military support for the Tsar.', 'Assess military defeats, the Tsar’s assumption of command, discontent at home and the loss of army loyalty. Compare longer-standing political and rural grievances evident in 1905.'],
    ['the Bolshevik seizure of power in November 1917', 'the decisions that helped the Bolsheviks win the Civil War', 'Track Bolshevik influence in the soviets, preparations by the Military Revolutionary Committee, occupation of strategic points and fall of the Provisional Government.', 'Compare Red Army organisation, control of railways and major cities, War Communism and use of coercion with divisions among the Whites and the effects of foreign intervention.'],
    ['the political struggle that followed Lenin’s death', 'the part played by the Purges in preserving Stalin’s power', 'Explain Stalin’s party post, Trotsky’s isolation, Stalin’s alliances and his successive attacks on rival groups. Cover the debate over the direction of socialism.', 'Weigh removal of rivals, forced compliance and control of institutions against damage to expertise, economic costs and other mechanisms such as propaganda and appointments.'],
    ['the introduction of collectivisation in the Soviet Union', 'the impact of the Five-Year Plans on Soviet workers', 'Trace efforts to increase grain control, the campaign against supposed kulaks, forced consolidation, resistance and famine, and the state’s eventual grip on grain procurement.', 'Compare job creation, opportunities for some women and technical advancement with strict labour discipline, housing shortages and pressure for higher output. Weigh different groups’ experiences.']
  ],
  usa: [
    ['the growth of the car industry in the 1920s', 'the limits of prosperity in the United States during the 1920s', 'Explain assembly lines, rising output, lower prices, demand supported by credit and growth in roads and related industries.', 'Contrast urban consumer industries with farm oversupply, sectoral decline and inequalities affecting Black workers and other groups. Judge the reach of growth by income and security as well as output.'],
    ['Roosevelt’s response to the banking crisis in 1933', 'the significance of the New Deal for unemployed people', 'Link loss of confidence and bank runs to the bank holiday, emergency legislation, supervised reopening and later deposit insurance.', 'Discuss direct jobs, relief, the WPA and CCC, and social insurance. Weigh uneven access and persistent unemployment, including the recession of 1937–38, against what the relief measures achieved.'],
    ['the introduction, enforcement and repeal of national Prohibition', 'the social changes experienced by American women in the 1920s', 'Trace temperance campaigning, national prohibition, bootlegging and enforcement difficulties, and repeal in 1933.', 'Assess suffrage, employment and changes in urban social life. Compare experiences by region, class and race, including continuing discriminatory voting barriers.'],
    ['the events and immediate effects of the Wall Street Crash', 'the consequences of Hoover’s policies during the Depression', 'Set out speculation and margin buying, rapid selling in October 1929, falling prices, losses and declining confidence. Explain how these interacted with wider economic weaknesses.', 'Assess public works and loans to banks and other institutions, reluctance over direct relief and the public reaction to the Bonus Army. Distinguish the effects of policy from the depth of the downturn.']
  ],
  ww2: [
    ['Germany’s defeat of France in 1940', 'the consequences of the Battle of Britain for the war in Europe', 'Trace Germany’s breakthrough, the Allied position at Dunkirk, the capture of Paris and the armistice that left an occupation zone and a government based at Vichy.', 'Discuss denial of air superiority, postponement of Sea Lion, preservation of Britain as an Allied base and the continuation of bombing. Assess significance alongside the opening of the Eastern Front.'],
    ['the expansion of Japanese control in Malaya through February 1942', 'the consequences of Japanese occupation for civilians in Malaya and Singapore', 'Follow the initial landings, Japanese air and naval advantages, Allied retreat down the peninsula and the surrender of Singapore.', 'Compare shortages, forced labour, repression and Sook Ching with examples of resistance and changes in British imperial authority. Weigh effects by community and timescale.'],
    ['Germany’s invasion of the Soviet Union and defeat at Stalingrad', 'the contribution of Soviet military action to Germany’s defeat', 'Describe the initial advance, longer supply lines and Soviet resistance, followed by the drive on Stalingrad, encirclement and surrender of the Sixth Army.', 'Consider attrition, lost resources, the Red Army’s advance and capture of Berlin. Weigh Western bombing, Italy and Normandy alongside Soviet fighting.'],
    ['the Allied advance across the Pacific from Guadalcanal to Okinawa', 'the pressures on Japan’s leadership before surrender in August 1945', 'Trace the struggle for Guadalcanal, capture or bypass of island positions and the advance to Okinawa, explaining the strategic value of bases and mounting losses.', 'Compare industrial and naval losses, blockade, conventional bombing, the atomic bombings and Soviet entry. Assess how pressures accumulated and which best explains the timing of surrender.']
  ]
};

const letters = (rows) => rows.map(([marks, prompt, guidance], index) => ({
  letter: 'abcde'[index], marks, prompt, guidance
}));

function structuredGroup(topic, index) {
  const section = studyTopics[topic[0]][index];
  return { title: topic[1], context: section.title, parts: letters(
    section.parts.map(({ marks, prompt, guidance }) => [marks, prompt, guidance])
  ) };
}

export const paperOneMocks = [0, 1].map((version) => ({
  id: 'paper1-' + (version + 1),
  paper: '1',
  label: 'Paper 1 · Mock ' + (version + 1),
  minutes: 120,
  marks: 60,
  sections: [
    ...Object.entries(core).map(([option, topics]) => ({
      id: 'core-' + option,
      title: 'Section A · Core option ' + option,
      groups: coreOrder[option][version].map((id, index) =>
        structuredGroup(topics.find(([topic]) => topic === id), version * 2 + index % 2))
    })),
    ...Object.values(depths).map((topic) => ({
      id: topic[0],
      title: 'Section B · ' + topic[1],
      groups: [structuredGroup(topic, version * 2), structuredGroup(topic, version * 2 + 1)]
    }))
  ].map((section, index, sections) => ({
    ...section,
    groups: section.groups.map((group, offset) => ({
      ...group, number: sections.slice(0, index).reduce((total, entry) => total + entry.groups.length, 1) + offset
    }))
  }))
}));

export const paperTwoMocks = Object.entries(prescribed[2027]).map(([series, choices], index) => ({
  id: 'paper2-' + (index + 1),
  paper: '2',
  label: 'Paper 2 · ' + series + ' 2027',
  series,
  minutes: 105,
  marks: 40,
  sections: Object.entries(choices).map(([option, topic], position) => {
    const { parts, ...pack } = documentSets[topic];
    return {
      id: 'core-' + option,
      title: 'Core option ' + option,
      groups: [{ ...pack, number: position + 1, parts: letters(parts) }]
    };
  })
}));

export const paperFourMocks = [0, 1].map((version) => ({
  id: 'paper4-' + (version + 1),
  paper: '4',
  label: 'Paper 4 · Mock ' + (version + 1),
  minutes: 60,
  marks: 40,
  sections: Object.values(depths).map(([id, title], index) => ({
    id,
    title,
    groups: depthPapers[id].slice(version * 2, version * 2 + 2).map(([account, discuss, accountGuide, discussGuide], offset) => ({
      number: index * 2 + offset + 1,
      title,
      parts: letters([
        [15, 'Write an account of ' + account + '.', accountGuide],
        [25, 'Discuss ' + discuss + '.', discussGuide]
      ])
    }))
  }))
}));

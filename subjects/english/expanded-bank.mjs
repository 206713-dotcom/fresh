import { scenarios } from './bank-scenarios.mjs';
import { imageNotes } from './bank-image-notes.mjs';

const skills = [
  ['detail', 'Retrieving details', 'R1'],
  ['sequence', 'Sequencing events', 'R1'],
  ['inference', 'Inference from evidence', 'R2'],
  ['language', 'Writer’s effects', 'R4'],
  ['summary', 'Selective summary', 'R5'],
  ['evaluation', 'Evaluating evidence', 'R3'],
  ['description', 'Descriptive writing', 'W2'],
  ['narrative', 'Narrative choices', 'W1'],
];

function passage(s) {
  return `During preparations, ${s.problem}. ${s.image}. ${s.name} paused to see what had changed.\n\nFirst, ${s.name} ${s.check}. Then ${s.name} ${s.action}.\n\nAfter the change, ${s.benefit}. However, ${s.limit}.`;
}

function reading(s) {
  return [
    [`What interrupted preparations in “${s.title}”?`, `The interruption was that ${s.problem}.`],
    [`Which action came first, and what did ${s.name} do next?`, `${s.name} first ${s.check}, then ${s.action}.`],
    [`What does the first action in paragraph 2 suggest about how ${s.name} makes decisions?`, `The detail “${s.check}” suggests that ${s.name} gathered information or took a precaution before making the next change.`],
    [`Reread “${s.image}”. Choose one word or phrase and explain what it makes you picture.`, imageNotes[s.id]],
    ['Summarise the outcome of the change in one sentence. Include an improvement and a remaining problem.', `Although ${s.benefit}, ${s.limit}.`],
    ['A visitor calls the response a complete success. Which detail supports that view, and which detail qualifies it?', `The improvement was that ${s.benefit}, but the claim overlooks the fact that ${s.limit}.`],
    ['What changes between paragraphs 1 and 3? Give one detail from each to support your answer.', `The opening presents a disruption because ${s.problem}. By paragraph 3 there has been some recovery, since ${s.benefit}.`],
    [`Which sentence in paragraph 3 would you quote to show that ${s.name} had only partly solved the problem? Explain why.`, `Quote “However, ${s.limit}.” It identifies a practical issue that remained after the response.`],
  ];
}

function revision(s) {
  const questions = reading(s);
  return [
    ['Something went wrong.', 'Name the specific interruption from the opening instead of using “something”.'],
    [`${s.name} ${s.action}, then ${s.check}.`, 'Correct the order of the two actions using paragraph 2.'],
    [`${s.name} made a sensible choice.`, 'Use the first action in paragraph 2 to support and explain the inference.'],
    ['The sentence uses a technique and makes an image.', `Replace the technique label with a precise explanation of a phrase from “${s.image}”.`],
    [`At the start, ${s.problem}.`, 'Replace this background detail with a one-sentence summary of the outcome. Include the improvement and the limitation.'],
    ['The response worked perfectly and there were no drawbacks.', 'Qualify this claim with one benefit and one unresolved problem from paragraph 3.'],
    [`It was a strange place. ${s.name} looked around.`, `Rewrite the opening to draw attention to the sensory detail in “${s.image}”.`],
    [`${s.name} made a decision. Everything was fine after that.`, `Rewrite the turning point to show the choice through “${s.action}” and keep a consequence unresolved.`],
  ].map(([excerpt, question], index) => ({
    excerpt, question,
    example: index === 6 ? `${s.image}. ${s.name} stopped and took in the scene before moving again.`
      : index === 7 ? `${s.name} ${s.action}. For a while, that was enough: ${s.benefit}. Even so, ${s.limit}.`
      : questions[index][1],
  }));
}

export const extraLabPassages = scenarios.map(s => ({
  id:'bank-lab-' + s.id, title:s.title, source:passage(s), questions:reading(s),
}));

export const extraNotebookExercises = scenarios.flatMap(s => revision(s).map((item, index) => ({
  ...item,
  skill:skills[index][2],
  group:skills[index][1],
  title:s.title + ' · ' + skills[index][1],
  context:passage(s),
})));

const checkpoints = [
  'Name what went wrong, using a specific detail from paragraph 1.',
  'State the first action accurately.',
  'Identify what the action suggests about the person’s approach.',
  'Select a short quotation that carries the image.',
  'Identify the improvement without repeating the whole passage.',
  'Acknowledge the benefit before assessing the claim.',
  'Give the reader one concrete sensory detail.',
  'Show the decision with an action.',
];

export const extraWorkshopCases = scenarios.flatMap(s => revision(s).map((item, index) => {
  const [kind, group] = skills[index];
  return {
    id:`bank-map-${s.id}-${kind}`,
    task:`bank-desk-${s.id}-${kind}`,
    group, title:s.title + ' · ' + group,
    source:passage(s), brief:item.question,
    starting:item.excerpt,
    pitfall:'Start by checking the wording against the passage.',
    versions:[
      ['Developing', item.excerpt, 'Identify what the starter response leaves unclear.'],
      ['Strong', item.example, 'Compare the revision with your response and check its use of detail.'],
      ['Further revision', checkpoints[index], index < 6
        ? 'Try rewriting the response in your own words and check it against the passage.'
        : 'Try a second draft that keeps the same situation but changes the order or rhythm of the sentences.'],
    ],
  };
}));

const readingRubrics = [
  'Credit an accurate and specific identification of the disruption.',
  'Credit the two actions in the correct order, with clear wording.',
  'Credit a plausible inference, exact evidence and a clear explanation of the connection.',
  'Credit a precise quotation, contextual meaning and a convincing explanation of the effect.',
  'Credit an accurate improvement and limitation, expressed concisely in continuous prose.',
];

export const extraDeskTasks = scenarios.flatMap(s => skills.map(([kind, group, objective], index) => {
  const id = `bank-desk-${s.id}-${kind}`;
  const title = s.title + ' · ' + group;
  if (index === 5) {
    return {
      id, title:s.title + ' · Directed writing', group:'Directed writing', paper:'p2', number:'Short practice', marks:10, timing:12,
      objectives:['R3','W4','W5'], source:passage(s), target:[90,120],
      prompt:'Write an email to the organiser recommending whether to keep the temporary arrangement next time. Weigh one benefit and one limitation from the passage. Write about 90–120 words.',
      example:`Dear Organiser,\nI would keep the temporary arrangement as a fallback because ${s.benefit}. However, ${s.limit}. Before making the arrangement permanent, consider how to preserve the improvement while addressing that limitation.`,
      criteria:[
        ['Reading',5,'Assess the accurate selection and weighing of a benefit and limitation.'],
        ['Writing',5,'Assess the clarity of the recommendation, appropriate register and accurate expression.'],
      ],
    };
  }
  if (index < 5) {
    const [prompt, example] = reading(s)[index];
    return {
      id, title, group, paper:'p1', number:'Short practice', marks:4, timing:6,
      objectives:[objective], source:passage(s), prompt, example,
      criteria:[['Reading',4,readingRubrics[index] + ' Award 4 for a complete, precise answer; 2–3 for a partly developed answer; 1 for a relevant point; 0 for no creditable content.']],
    };
  }
  const descriptive = index === 6;
  return {
    id, title, group, paper:'p2', number:'Composition', marks:40, timing:60, target:[350,450],
    objectives: descriptive ? ['W1','W2','W3','W5'] : ['W1','W2','W3','W4','W5'],
    prompt:descriptive
      ? `Describe the scene in “${s.title}” just after preparations are interrupted. Begin with a detail close by, then shift attention farther away. Write about 350–450 words.`
      : `Write a story inspired by “${s.title}” in which someone must change a plan at the last minute. Develop the choice and its consequences. Write about 350–450 words.`,
    example:revision(s)[index].example,
    criteria:[
      ['Content and structure',16, descriptive
        ? 'Assess precise sensory detail, atmosphere and controlled shifts in focus.'
        : 'Assess the character’s motivation, the turning point and the consequences of the choice.'],
      ['Style and accuracy',24,'Assess clarity, accuracy, precise vocabulary and deliberate sentence variety.'],
    ],
  };
}));

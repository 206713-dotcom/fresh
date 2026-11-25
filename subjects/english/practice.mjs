const harbour = `At six on Saturday, the harbour gates were already open. Volunteers had moved the repair workshop indoors after overnight rain. The new hall was harder to find, so Mina chalked arrows on the pavement. By noon, thirty bicycles had been repaired. She counted the untouched bicycles twice before deciding to keep the doors open another hour.`;

const library = `The old station library extended its opening hours last winter. Students now have somewhere warm to work after school, and weekend shifts suit readers who work late. A small donation paid for improved lighting, which made the quiet room usable after dark. The library lends tablets as well as books, and its volunteers help people complete online forms. Residents with weak internet connections can reserve a desk. The station location means that people can visit without paying for a second bus journey. Book deliveries reach readers with limited mobility. Rather than charging for every activity, the library offers free workshops and lends tools for simple repairs. Its shelves used to crowd the entrance. They have been rearranged, making it easier to move between sections. The manager calls the service “a second front door into the town”. She welcomes higher attendance but worries that the council may assume the volunteers can maintain the service alone.`;

const storm = `At the crossing, the river shouldered through the arch, carrying branches like broken oars. The flood gauge was a thin red stitch on the far wall. I could see the village lights trembling in the water, and for a moment it looked as if the village itself were about to come undone. The barrier gave a dry click. I put down my bag and listened.

The bridge keeper, Alma, came from the hut with a lantern. She closed the footpath and called the council. The main road was still open, but waiting there meant missing the last bus. A shopkeeper offered to let passengers wait inside. By midnight the river was falling. Alma suggested putting a painted depth marker on the near wall and arranging a volunteer rota before winter.`;

const market = `Text A · A stallholder
The market closes just as most office workers finish. A trial last summer brought in a younger crowd and gave local musicians a place to play. Extra lighting would cost money, but stallholders could share the bill if the trial ran on Fridays only.

Text B · A resident
The summer trial left litter outside our building and made it hard for my father to sleep. The council counted visitors but never asked neighbours what had changed. I would support a shorter trial if stalls faced away from homes and council staff monitored noise and collected rubbish before midnight.`;

export const papers = [
  { id: 'p1', title: 'Reading', marks: 80, summary: 'Four compulsory questions across three source texts.' },
  { id: 'p2', title: 'Directed Writing & Composition', marks: 80, summary: 'Two directed-writing parts and one composition from four titles.' },
];

const exercises = [
  { id: 'comprehension', paper: 'p1', number: '1', title: 'Comprehension', marks: 4, timing: 5, source: harbour,
    prompt: 'Why was the workshop moved? Give two details about the response to the change. What does Mina’s decision at noon suggest about her attitude?',
    example: 'It had rained overnight (1). The volunteers put the workshop inside the hall (1), and Mina marked the route with arrows (1). Mina is determined to help the remaining cyclists (1).',
    criteria: [['Reading', 4, 'Award one mark per distinct valid point: rain; indoor location; arrows to guide visitors; a supported inference that Mina wanted to help those still waiting. Accept equivalent wording.']] },
  { id: 'summary', paper: 'p1', number: '2(a)', title: 'Selective summary', marks: 15, timing: 18, target: [0,120], source: library,
    prompt: 'Summarise the ways the station library makes its services easier to access. Write in continuous prose, in your own words as far as possible, using no more than 120 words.',
    example: 'Later opening gives students a place to study and lets people who finish work late visit. Better lighting makes the study room usable at night. Visitors can borrow tablets, reserve desks when home internet is poor and get help with digital paperwork. The station location avoids an extra bus fare, and deliveries serve people who struggle to travel. Workshops are free, tools can be borrowed, and visitors can now move between shelves more easily.',
    criteria: [['Reading',10,'Reward a broad, accurate, selective account of access improvements across time, space, cost, technology and outreach. Treat the example as indicative.'],['Writing',5,'Assess concision, grouping and fluent continuous prose in own words. Use the 120-word limit as a task constraint.']] },
  { id: 'attitude', paper: 'p1', number: '2(b)', title: 'Attitude and opinion', marks: 5, timing: 6, source: library,
    prompt: 'How does the manager feel about the library’s growing popularity? Support your explanation with evidence from the text.',
    example: 'She is proud that it has become central to local life. Calling it a “second front door” suggests that people can turn to it as naturally as they would to their own homes. She also worries that popularity might lead the council to overlook the volunteers’ limited capacity.',
    criteria: [['Reading',5,'Reward a clear explanation of the manager’s mixed attitude with relevant textual support. Recognise pride in accessibility and concern about resourcing.']] },
  { id: 'short-language', paper: 'p1', number: '3(a–c)', title: 'Short answers', marks: 10, timing: 13, source: storm,
    prompt: '(a) State the two immediate actions Alma took to manage the danger. [2] (b) What problem did the travellers have, and what help was offered? [3] (c) Use one example from the first paragraph to explain how the writer makes the river seem dangerous. [5]',
    example: '(a) She shut the footpath and contacted the council. (b) They could still use the main road but would miss their last bus. The shopkeeper offered indoor shelter. (c) “Shouldered through” suggests a powerful body forcing itself through a narrow opening. It makes the flood seem capable of pushing aside anything in its path.',
    criteria: [['Immediate actions',2,'One mark each for closing the path and calling the council.'],['Travel and help',3,'One mark each for the main road remaining open, risk of missing the last bus, and indoor shelter.'],['Language analysis',5,'Assess the precision of the quotation and how clearly its effects are developed in context.']] },
  { id: 'language', paper: 'p1', number: '3(d)', title: 'Writer’s effects', marks: 10, timing: 20, target: [200,250], source: storm,
    prompt: 'Choose three powerful words or phrases from the first paragraph, including imagery, and explain how the writer makes the flood seem threatening. Write about 200–250 words.',
    example: 'The river “shouldered through the arch”. This ordinarily describes a person using a shoulder to force a passage. Here the river appears muscular and determined, as if a solid bridge could barely contain it. The branches are “like broken oars”. Oars ought to let a rower control a boat, but these float uselessly downstream. This hints at the loss of human control: the flood has more power than the equipment built to navigate water. When the village seems “about to come undone”, the wording evokes something stitched together that is starting to loosen. The reflection makes this danger visible in miniature. Buildings have not fallen, but the narrator briefly sees an entire community as something fragile. The three images move from direct pressure on the bridge to scattered evidence of damage and then to the possible destruction of a place where people live. The river begins as a force the narrator observes and ends as a threat to the village itself. That progression explains why the narrator stops to listen when the barrier clicks: its small, dry sound suddenly matters after such forceful images.',
    criteria: [['Reading',10,'Judge the quality and range of precise choices, contextual meanings, connotations and effects, including imagery. Credit plausible alternatives. Generic effect labels alone earn limited credit.']] },
  { id: 'extended', paper: 'p1', number: '4', title: 'Extended response', marks: 20, timing: 24, target: [250,300], source: storm,
    prompt: 'Write a report for the local council as Alma. Explain the risks during the flood, how people responded, and what should change before winter. Cover all three points using the source. Write about 250–300 words.',
    example: 'Report on the bridge closure\nThe river was carrying debris through the crossing and the gauge was difficult to read from the near bank. I closed the footpath and contacted the council. Although the main road stayed open, waiting there left passengers at risk of missing the last bus. The nearby shop provided temporary shelter. Before winter, paint a depth marker on our side so that staff can read it without crossing. A volunteer rota would also let the keeper contact the council while someone else directs passengers. Arrange an agreed waiting point with the shopkeeper and publish the diversion before the next flood.',
    criteria: [['Reading',10,'Look for accurate selection, inference and development across risks, actions and future improvements.'],['Writing',10,'Assess coherent sequencing, adaptation into report form, precise expression and appropriate register.']] },
  { id: 'evaluation', paper: 'p2', number: '1(a)', title: 'Source evaluation', marks: 5, timing: 8, source: market,
    prompt: 'Explain how the resident’s wording shows that their support for the market trial is conditional. Use evidence from the text.',
    example: '“I would support” leaves the possibility open, while “if” introduces the changes that must happen first. The resident’s specific demands on noise and litter link their support directly to avoiding a repeat of the first trial.',
    criteria: [['Reading',5,'Reward a clear account of the qualified position with relevant evidence and explanation of wording.']] },
  { id: 'directed', paper: 'p2', number: '1(b)', title: 'Directed writing', marks: 35, timing: 47, target: [250,350], source: market,
    prompt: 'Write a letter to the town council evaluating both views and recommending whether and how to extend the market’s hours. Write about 250–350 words.',
    example: 'Dear Council Members,\nLater closing would bring the market within reach of people who finish work at five, but a high visitor count tells us little about the burden on nearby residents. I propose a four-week Friday trial with stalls facing away from homes, a fixed closing time and a named council officer to record noise and oversee cleaning. Shared lighting costs could keep the trial affordable. Ask households as well as stallholders for feedback before deciding whether later hours should continue.',
    criteria: [['Reading',10,'Assess how well ideas from both texts are selected, developed, weighed and applied to the recommendation.'],['Writing',25,'Assess register, organisation, range and precision of expression, audience engagement and technical accuracy.']] },
  ...[
    ['descriptive', '2', 'Descriptive composition', 'Describe a railway platform just before the first train of the day.', 'The platform clock clicked. Under a lamp, a wet footprint shone for a moment before the light disappeared into morning.'],
    ['descriptive-room', '3', 'Descriptive composition', 'Describe a room immediately after a celebration has ended.', 'A ribbon hung from the lamp like a loose seam. A melting cube tipped into the gap between two abandoned glasses.'],
    ['narrative', '4', 'Narrative composition', 'Write a story titled “The second key”.', 'The first key opened the shed. The second had my name scratched into it, though I had never seen it before.'],
    ['narrative-promise', '5', 'Narrative composition', 'Write a story in which keeping a promise turns out to be difficult.', 'I had promised to leave the package on the step. By the time I reached the house, the name on the door had changed.'],
  ].map(([id,number,title,prompt,example]) => ({ id, paper: 'p2', number, title, marks: 40, timing: 60, target: [350,450], prompt, example,
    criteria: [['Content and structure',16, id.startsWith('descriptive') ? 'Assess developed detail, atmosphere, focal control and deliberate organisation.' : 'Assess developed character, convincing events, deliberate pacing and a satisfying resolution.'], ['Style and accuracy',24,'Assess vocabulary precision, deliberate sentence variety, register, spelling, punctuation and grammar.']] })),
];

// Adapted from the published 2027 specimen mark schemes, version 2.
const shortBands = '4–5: clear and supported. 2–3: some relevant understanding. 1: limited. 0: no creditable content.';
const bandGuides = {
  summary: [
    '9–10: wide, well-selected range. 7–8: competent selection across a good range. 5–6: some range with uneven selection. 3–4: basic understanding of relevant ideas. 1–2: limited understanding. 0: no creditable content.',
    '4–5: clear, fluent, concise and mostly independently phrased. 2–3: generally clear but uneven or sometimes reliant on source wording. 1: unclear or substantially copied. 0: no creditable content.',
  ],
  attitude: [shortBands],
  'short-language': ['', '', shortBands],
  language: ['9–10: precise choices explored for contextual meanings, associations and imagery. 7–8: secure explanations and some analysis. 5–6: relevant choices with mainly straightforward explanations. 3–4: partial or generic explanation. 1–2: mostly irrelevant choices or little explanation. 0: no creditable content.'],
  extended: [
    '9–10: thorough, sustained interpretation and development across the task. 7–8: competent reading and some development. 5–6: sound basic reading with uneven development. 3–4: general understanding with little assimilation. 1–2: minimal engagement. 0: no creditable content.',
    '9–10: effective style, organisation and register. 7–8: mostly clear and appropriate, sometimes effective. 5–6: plain, clear expression. 3–4: inconsistent or awkward. 1–2: unclear expression. 0: no creditable content.',
  ],
  evaluation: [shortBands],
  directed: [
    '9–10: wide range applied with sustained evaluation. 7–8: good range with meaningful development and some evaluation. 5–6: straightforward range and some development. 3–4: brief explicit references with little evaluation. 1–2: minimal or copied. 0: no creditable content.',
    '22–25: subtle, controlled, engaging and highly accurate. 18–21: effective style and organisation with mostly accurate expression. 14–17: sometimes effective with some control. 10–13: inconsistent but generally intelligible. 6–9: limited control. 1–5: unclear expression. 0: no creditable content.',
  ],
};
const compositionBands = [
  '14–16: developed, convincing material and deliberate structure. 11–13: effective development and secure structure. 8–10: clear development and generally coherent structure. 5–7: straightforward content and simple structure. 3–4: limited material and uneven structure. 1–2: minimal or unclear. 0: no creditable content.',
  '21–24: precise vocabulary, purposeful sentence variety, consistent register and high accuracy. 17–20: mostly precise and accurate with range. 13–16: some precision and variety with generally secure control. 9–12: straightforward expression with uneven control. 5–8: limited range and frequent errors. 1–4: substantial imprecision or errors impede meaning. 0: no creditable content.',
];

export const tasks = exercises.map(task => {
  const bands = task.marks === 40 ? compositionBands : bandGuides[task.id] ?? [];
  return {
    ...task,
    criteria: task.criteria.map(([name, max, guidance], index) =>
      [name, max, [guidance, bands[index]].filter(Boolean).join(' ')]),
  };
});

export function countWords(value) {
  return (value.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu) || []).length;
}

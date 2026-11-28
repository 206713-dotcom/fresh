import optionA from './history-study-a.js?v=2027';
import optionB from './history-study-b.js?v=2027';
import depthNotes from './history-study-depths.js?v=2027';

export const studyTopics = Object.fromEntries(
  [optionA, optionB, depthNotes].flatMap((text) => text.trim().split(/^#/m).filter(Boolean).map((topic) => {
    const [id, ...sections] = topic.trim().split(/^@/m);
    return [id.trim(), sections.map((section) => {
      const [title, ...rows] = section.trim().split('\n');
      const facts = [];
      const parts = [];
      for (const row of rows) {
        const [prompt, answer, explanation] = row.split('|');
        if (['4', '6', '10'].includes(prompt)) {
          parts.push({ marks: Number(prompt), prompt: answer, guidance: explanation });
        } else {
          facts.push({ prompt, answer, explanation });
        }
      }
      return { title, facts, parts };
    })];
  }))
);

function answerType(question, answer) {
  if (/^(?:\d{4}|\d{1,2} [A-Z][a-z]+ \d{4}|[A-Z][a-z]+ \d{4})$/.test(answer)) return 'date';
  if (/^Who\b|^Which (?:leader|king|prime minister|reformer|official|politician|abolitionist|admira[l]|general|republican|statesman|French governor|minister|shipyard electrician|Austrian chancellor|Soviet leader)\b/i.test(question)) return 'person';
  if (/^Where\b|^Which (?:territory|city|island|port|state|neutral country|country|waterway|British stronghold)\b/i.test(question)) return 'place';
  if (/^Which .*\b(?:amendment|law|act)\b/i.test(question)) return 'law';
  if (/^(Which|What) .*\b(?:treaty|agreement|pact|armistice|convention)\b/i.test(question)) return 'agreement';
  if (/^Which .*\b(?:battle|offensive|campaign|uprising|putsch|revolt)\b/i.test(question)) return 'event';
  return '';
}

const topicOrder = Object.keys(studyTopics);
const topicFacts = Object.values(studyTopics).map((sections) => sections.flatMap(({ facts }) => facts));
const plausibleChoices = {
  'A German imperial crown': ['Command of the imperial army', 'The post of federal chancellor', 'A seat on the federal diet'],
  'Abolition of peasant labour dues': ['Hungarian independence', 'Universal male suffrage in the empire', 'An elected assembly with authority over the whole empire'],
  "Resistance to the new state's authority": ['Support for Austrian control of Venetia', 'French claims to the Papal States', 'Pressure to restore trade barriers in Piedmont'],
  'The status of Schleswig': ['Access to the port of Kiel', 'Ownership of the Danish West Indies', 'Membership of Hamburg in the Zollverein'],
  'Funding army reform': ['Establishing universal suffrage', 'Ending tariffs on Austrian goods', 'Financing the administration of Hanover'],
  'Secret defensive alliances': ['Abolition of southern state governments', 'Treaties of neutrality with France', 'Immediate political annexation of the south'],
  'They split into northern and southern tickets': ['They withdrew from the election', 'They endorsed Lincoln in border states', 'They united behind the Constitutional Union candidate'],
  'Withdrawal of remaining troops supporting those governments': ['Passage of the Fifteenth Amendment', 'Extension of federal military districts', 'Expansion of the Freedmen’s Bureau'],
  'Access to raw materials and markets': ['Elimination of competition between European firms', 'A need to reduce exports to overseas markets', 'Pressure to return concessions to local rulers'],
  'Suspected animal fat on rifle cartridges': ['A ban on Indian infantry recruitment', 'Objections to the withdrawal of new rifles', 'Removal of European troops from India'],
  'Direct rule by the British Crown': ['Self-government by elected Indian assemblies', 'A protectorate run by the Mughal court', 'Rule by an independent council of princes'],
  'An Austrian ultimatum to disarm': ['A French demand for Lombardy', 'A Piedmontese attack in Venetia', 'The withdrawal of French troops from Rome'],
  'War with the USSR at the same time': ['An Italian declaration of neutrality', 'Loss of German ports under the Versailles settlement', 'Czechoslovak intervention from the south'],
  'It was excluded from the main negotiations': ['It negotiated as an equal with the victors', 'It set the reparations figure during the conference', 'It chaired the territorial negotiations'],
  'Demilitarised zone': ['Independent state', 'French sovereign territory', 'League mandate'],
  'Free City under League protection': ['Province under Polish sovereignty', 'German naval district', 'Territory administered jointly by France and Britain'],
  'They became mandates': ['They returned to German rule', 'They immediately became independent states', 'They came under direct US administration'],
  'It awarded the islands to Finland with safeguards': ['It awarded the islands to Sweden without conditions', 'It placed the islands permanently under direct League administration', 'It divided the islands between Finland and Sweden'],
  'Reconstruction and recovery in European economies': ['Creation of a common European army', 'Financing of war reparations to the USSR', 'Removal of Western currencies from Germany'],
  'Introduction of a new currency': ['Return to a single German occupation authority', 'Closure of West Berlin’s air corridors', 'Cancellation of the Western zonal merger'],
  'It was boycotting the Security Council': ['It had temporarily lost its permanent seat', 'It had voted to recognise North Korea only after the war', 'It had already transferred its veto to China'],
  'Jupiter missiles in Turkey': ['Polaris missiles in the Caribbean', 'Thor missiles in Norway', 'Minuteman missiles in South Korea'],
  'Crossing from East to West Berlin': ['Crossing the Hungarian-Austrian border after 1989', 'Taking a passenger ferry from East Germany to Denmark', 'Travelling directly across the fortified rural frontier'],
  'They declined sharply': ['They rose to permanent wartime highs', 'They rose faster than urban wages', 'They remained unchanged while production fell'],
  'Aircraft carriers': ['Battleships', 'Patrol aircraft', 'Destroyers'],
  'Partial decoding of Japanese naval communications': ['Access to Japan’s home ports', 'Advance warning from Germany', 'Visual observation from bases in the Japanese home islands'],
  'Austrian involvement in investigating the plot in Serbia': ['A Serbian promise to compensate Belgium', 'A British guarantee of Bosnian independence', 'A demand that Germany join the investigation']
};

function chooseOptions(correct, near, topicIndex) {
  const custom = plausibleChoices[correct.answer];
  if (custom) return custom.slice();
  const type = answerType(correct.prompt, correct.answer);
  if (type === 'date') {
    const year = Number(correct.answer.slice(-4));
    return [year - 1, year + 1, year + 2].map((date) => correct.answer.slice(0, -4) + date);
  }
  const topic = topicFacts[topicIndex];
  const neighbours = topicFacts.flatMap((facts, index) => ({ facts, distance: Math.abs(index - topicIndex) }))
    .sort((left, right) => left.distance - right.distance).flatMap(({ facts }) => facts);
  const related = type ? [...near, ...topic, ...neighbours].filter(({ prompt, answer }) =>
    answerType(prompt, answer) === type) : [];
  return [...new Set([...related, ...near, ...topic].map(({ answer }) => answer))]
    .filter((answer) => answer !== correct.answer).slice(0, 3);
}

function questionHash(prompt) {
  let hash = 0;
  for (const character of prompt) hash = (Math.imul(hash, 31) + character.codePointAt(0)) >>> 0;
  return hash;
}

export const recallQuestions = topicOrder.flatMap((topicId, topicIndex) =>
  studyTopics[topicId].flatMap((section) => section.facts.map((fact) => {
    const hash = questionHash(fact.prompt);
    const correct = (hash >>> 12) % 4;
    const options = chooseOptions(fact, section.facts, topicIndex);
    const rotation = (hash >>> 6) % options.length;
    const choices = [...options.slice(rotation), ...options.slice(0, rotation)];
    choices.splice(correct, 0, fact.answer);
    return [topicId, fact.prompt, choices, correct, fact.explanation];
  }))
);

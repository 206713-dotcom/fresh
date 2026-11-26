import { setupClearWriting, setupNewQuestion } from './question-controls.mjs';
const cases = [
  {
    id: 'language', title: 'Writer’s effects',
    brief: 'Explain how “the river shouldered through the arch” suggests danger.',
    starting: 'The writer uses personification. It creates an image and makes the reader want to read on.',
    pitfall: 'The response names a technique without explaining what “shouldered” contributes to the danger.',
    versions: [
      ['Developing', '“Shouldered” suggests that the river pushes through the bridge with force.', 'Defines the action in context. It could say what sort of force the reader pictures.'],
      ['Strong', '“Shouldered” makes the water seem like a powerful body pushing past an obstacle. The bridge appears barely able to contain it.', 'Connects the physical action with the threat to the structure.'],
      ['Sophisticated', 'To “shoulder” through is to force a way with the weight of a body. The river seems almost purposeful, while the stone arch becomes the obstacle it can push aside.', 'Develops both the bodily association and the reversal in apparent power between the river and the bridge.'],
    ],
  },
  {
    id: 'directed', title: 'Directed writing',
    brief: 'Explain to the town council how it should weigh visitor numbers against the effect of later market hours on residents.',
    starting: 'There were more visitors. Some people complained about noise. Both sides have good points, so the market should stay open later.',
    pitfall: 'The conclusion skips the reasoning. The response needs to explain what attendance can establish and what further evidence matters.',
    versions: [
      ['Developing', 'More visitors suggest there is demand for later opening, but noise may make the trial difficult for people nearby.', 'Connects each point to a consequence, but leaves the decision unresolved.'],
      ['Strong', 'Attendance shows that later opening attracts visitors. It says little about whether residents can sleep, so judge a shorter trial using both footfall and a log of noise complaints.', 'Tests an argument against the limits of its evidence and proposes a workable check.'],
      ['Sophisticated', 'Footfall makes the case for testing later opening. It cannot tell us whether the benefit is worth a nightly disruption borne by a few streets. Limit the trial to Fridays, record noise and ask affected households before committing to a permanent change.', 'Weighs the distribution of benefits and costs and makes the recommendation conditional on relevant evidence.'],
    ],
  },
  {
    id: 'descriptive', title: 'Descriptive composition',
    brief: 'Describe a railway platform just before its first train. Establish the setting and create anticipation.',
    starting: 'It was a cold morning. The platform was quiet and empty. I waited for my train and went to get a coffee.',
    pitfall: 'Broad adjectives establish little atmosphere, and the sequence of actions pulls attention away from the setting.',
    versions: [
      ['Developing', 'The platform was empty apart from a paper cup. Cold air blew under the shelter and rolled the cup towards the yellow line.', 'Uses a particular detail and its movement to suggest emptiness.'],
      ['Strong', 'The wind rolled a paper cup down the yellow line. Beyond the shelter, the platform clock clicked over to six and the rails began to hum.', 'Moves from one close detail to sound in the distance, letting the train’s approach shape the description.'],
      ['Sophisticated', 'A paper cup rolled along the yellow line and rested against a post. The clock clicked. Then the thin hum from the rails deepened, and the cup began to tremble where it lay.', 'Returns to the same visual detail after a change in sound. The tremor suggests the unseen train is close.'],
    ],
  },
  {
    id: 'inference-letter', task: 'attitude', title: 'Inference from actions',
    brief: 'Amir takes his name off the sign-up sheet, then stays beside the door until his friend arrives. What might these actions suggest? Support your inference.',
    starting: 'Amir is scared and does not want to go.',
    pitfall: 'The answer gives one confident explanation and ignores Amir’s decision to stay.',
    versions: [
      ['Developing', 'Amir is hesitant because he takes his name off the sheet.', 'Supports a basic inference with one action.'],
      ['Strong', 'Crossing out his name suggests Amir has doubts, but waiting by the door shows he still wants to see what happens.', 'Explains the tension between the two actions.'],
      ['Sophisticated', 'Amir backs out of committing, but he does not leave. Waiting for his friend suggests his doubts may be about going alone, though the passage does not establish his exact motive.', 'Uses both details and distinguishes an inference from a certainty.'],
    ],
  },
  {
    id: 'summary-changes', task: 'summary', title: 'Selective summary',
    brief: 'Summarise how the museum improved access. It painted its doors blue, replaced steep steps with a ramp, added large-print maps and bought two paintings.',
    starting: 'The museum made changes, including painting its doors and buying artwork.',
    pitfall: 'The answer leaves out both changes relevant to access.',
    versions: [
      ['Developing', 'The museum built a ramp and added large-print maps.', 'Includes the two relevant changes.'],
      ['Strong', 'The museum made entry easier with a ramp and made its maps easier to read by using larger print.', 'Restates both details and links each to access.'],
      ['Sophisticated', 'Visitors can enter without using the steep steps and navigate the galleries with maps printed in larger type.', 'Combines the points concisely and explains their practical benefits.'],
    ],
  },
  {
    id: 'evaluate-survey', task: 'evaluation', title: 'Evaluating evidence',
    brief: 'A school trialled a later start. Eighteen of twenty survey respondents said they felt more alert. Explain what this evidence can and cannot show.',
    starting: 'The later start worked because 90 per cent of students were more alert.',
    pitfall: 'The answer treats self-reports from twenty respondents as a measurement of the whole school.',
    versions: [
      ['Developing', 'Most respondents felt more alert, but only twenty answered.', 'Limits the claim to the group surveyed.'],
      ['Strong', 'Eighteen replies suggest the trial helped some students feel more alert, but the small group may differ from the rest of the school.', 'Separates the observation from a wider inference.'],
      ['Sophisticated', 'The replies support continuing the trial, but they measure perceived alertness in a small group. A broader survey alongside attendance or punctuality records would give the school a firmer basis for a decision.', 'Weighs the strength of the evidence and identifies what could improve it.'],
    ],
  },
  {
    id: 'narrative-choice', task: 'narrative', title: 'Narrative turning points',
    brief: 'Rewrite the moment a runner must choose between finishing a race and helping a rival who has fallen.',
    starting: 'I stopped to help. I decided that helping was more important than winning.',
    pitfall: 'The answer reports the decision before the reader can feel what the choice costs.',
    versions: [
      ['Developing', 'I could see the finish line, but I stopped when my rival tried and failed to stand.', 'Gives a concrete reason for stopping.'],
      ['Strong', 'The finish tape was lifting in the wind. Behind me, a shoe scraped twice against the track. I turned and held out a hand.', 'Alternates details from the two choices and shows the decision in action.'],
      ['Sophisticated', 'One stride more and I could reach the tape. Behind me came a scrape, a pause, then the same scrape. I stepped out of my lane. The cheers went on without me.', 'Uses pacing and sound to dramatise the choice and lets the consequence close the moment.'],
    ],
  },
];

export function setupWorkshop(read, write) {
  const get = id => document.getElementById(id);
  const select = get('workshop-skill');
  const draft = get('workshop-draft');
  const status = get('workshop-status');
  select.append(...cases.map(item => new Option(item.title,item.id)));

  const steps = [...document.querySelectorAll('[data-map-step]')];
  function showStep(step, focus = false) {
    for (const button of steps) {
      const current = button.dataset.mapStep === step;
      if (current) button.setAttribute('aria-current','step');
      else button.removeAttribute('aria-current');
      get('map-' + button.dataset.mapStep).hidden = !current;
    }
    if (step === 'compare') {
      get('map-your-draft').textContent = draft.value.trim() ? 'Your revision: ' + draft.value.trim() : 'Write a revision to compare it here.';
    }
    if (focus) get('map-' + step).querySelector('h3').focus();
  }

  for (const button of steps) {
    button.addEventListener('click', () => showStep(button.dataset.mapStep, true));
  }

  function show() {
    const item = cases.find(row => row.id === select.value);
    get('workshop-brief').textContent = item.brief;
    get('workshop-start').textContent = item.starting;
    get('workshop-pitfall').textContent = item.pitfall;
    get('map-write-brief').textContent = item.brief;
    draft.value = read('workshop:' + item.id) ?? '';
    status.textContent = draft.value ? 'Revision restored' : '';
    get('workshop-practice').href = '?task=' + (item.task ?? item.id) + '#practice';
    get('workshop-versions').replaceChildren(...item.versions.map(([name,text,explanation]) => {
      const article = document.createElement('article');
      for (const [tag,value] of [['h3',name],['p',text],['p',explanation]]) {
        const node = document.createElement(tag);
        node.textContent = value;
        article.append(node);
      }
      return article;
    }));
    showStep('read');
  }

  select.addEventListener('change', show);
  setupNewQuestion(get('workshop-new-question'), select);
  setupClearWriting(get('workshop-clear'), [draft]);
  draft.addEventListener('input', () => write('workshop:' + select.value,draft.value,status));
  show();
}

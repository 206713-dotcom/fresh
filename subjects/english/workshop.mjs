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
    get('workshop-practice').href = '?task=' + item.id + '#practice';
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
  draft.addEventListener('input', () => write('workshop:' + select.value,draft.value,status));
  show();
}

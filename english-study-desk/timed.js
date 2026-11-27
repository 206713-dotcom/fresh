const timedTopics = {
  poetry: {
    title: "Poetry skills",
    questions: [
      {
        skill: "Imagery and atmosphere",
        passage: "The station lights blinked in the rain.\nA paper cup rolled down the track.\nBeyond the glass, a single train\ncarried its windows into black.",
        prompt: "How does the poet use imagery to create a sense of isolation?",
        hint: "Compare the intermittent lights with the final darkness. Explain how the movement of the cup or train makes the speaker’s surroundings feel empty."
      },
      {
        skill: "Structure and changes in tone",
        passage: "We shouted our names from the hill\nand waited to hear them return.\nThe valley gave back only wind.\nI walked home quietly.",
        prompt: "How does the movement from the first line to the last change the mood?",
        hint: "Trace the contrast between shouting and quiet. Consider how the change from ‘we’ to ‘I’ affects your reading of the ending."
      },
      {
        skill: "Sound and rhythm",
        passage: "Tick, tap, the rain began,\nthen rattled down the drain.\nIt stopped. Across the yard\na blackbird tried one note.",
        prompt: "How do sound and rhythm make the change in the scene vivid?",
        hint: "Compare the repeated hard sounds with the short sentence ‘It stopped.’ Consider how the final sound differs from the opening."
      }
    ]
  },
  unseen: {
    title:"Unseen prose",
    questions:[
      {skill:"Narrative perspective",passage:"From the porch, Mae could see the lit kitchen. Her brother was laughing at something she could not hear. She tried her key, then put it away and knocked.",prompt:"How does the writer make an ordinary homecoming seem uncertain?",hint:"Compare what Mae can see with what she cannot hear. Consider why the sequence of actions at the door matters."},
      {skill:"Pace and suspense",passage:"The museum clock drifted towards six. Lena took her time crossing the gallery, stopping at every frame and label. Then the portrait at the end moved.",prompt:"How does the writer use pace to make the final moment unsettling?",hint:"Compare the slow series of actions with the short final sentence and the change it introduces."}
    ]
  },
  hullabaloo: {
    title: "Hullabaloo in the Guava Orchard",
    questions: [
      {skill:"Character and setting",prompt:"How does Kiran Desai make Sampath’s move to the orchard seem both liberating and complicated?",hint:"Contrast his earlier life in Shahkot with his life in the tree. Consider how visitors and publicity change the meaning of the orchard."},
      {skill:"Satire and characterisation",prompt:"How does Desai use the townspeople’s responses to Sampath to satirise the way reputations are made?",hint:"Select moments when people interpret his behaviour or words as signs of wisdom. Explain how the difference between their interpretations and yours creates comedy."},
      {skill:"Plot and competing perspectives",prompt:"How does Desai use the monkeys to turn the orchard into a place of conflict?",hint:"Compare reactions to the monkeys. Look at how the escalating responses reveal the competing interests of people around Sampath."}
    ]
  },
  pride: {
    title: "Pride and Prejudice",
    questions: [
      {skill:"Perspective and judgement",prompt:"How does Jane Austen make Elizabeth’s changing opinion of Darcy convincing?",hint:"Compare early impressions with the letter and the visit to Pemberley. Explain how the reader’s access to Elizabeth’s perspective shapes the change."},
      {skill:"Irony and social expectations",prompt:"How does Austen use irony to explore attitudes to marriage?",hint:"Compare the opening of the novel with a proposal or marriage of your choice. Explain how narration or dialogue exposes a gap between what characters say and what they value."},
      {skill:"Dialogue and character",prompt:"How does Austen make Lady Catherine’s confrontation with Elizabeth revealing?",hint:"Consider the questions, commands and replies in the encounter. Explain what the exchange shows about both characters’ ideas of authority."}
    ]
  },
  midsummer: {
    title: "A Midsummer Night’s Dream",
    questions: [
      {skill:"Stagecraft and dramatic irony",prompt:"How does Shakespeare make the confusion over the love potion entertaining on stage?",hint:"Choose a moment when the audience knows something a character lacks. Explain how the actors’ movement, reactions or timing can heighten the comedy."},
      {skill:"Setting and structure",prompt:"How does Shakespeare use the contrast between Athens and the forest to explore control and freedom?",hint:"Compare the pressures on the lovers in Athens with what happens to them in the forest. Consider how the return to Athens affects your reading."},
      {skill:"Comedy and performance",prompt:"How does Shakespeare make the mechanicals’ performance of Pyramus and Thisbe memorable?",hint:"Consider how the actors explain the staging and how their onstage audience responds. Explain how these choices create comedy out of the tragic story."}
    ]
  }
};

const timedModels = {
  poetry:[
    "The lights ‘blinked’, making the station seem only intermittently visible. The cup and train are both in motion, yet neither brings company. The final ‘black’ turns the train’s departure into the disappearance of the speaker’s last point of interest.",
    "At first, the plural ‘we’ makes the shouting feel like a shared game. The valley replies with ‘only wind’, which makes their expectation seem misplaced. The shift to ‘I’ makes the quiet ending feel more solitary.",
    "The short sounds of ‘Tick, tap’ establish a pattern that grows louder in ‘rattled’. The brief sentence ‘It stopped’ breaks that movement. The bird’s single note makes the stillness feel newly audible."
  ],
  unseen:[
    "The lit kitchen suggests warmth, but Mae can see the laughter without hearing its cause. The key gives her a way in, yet the decision to knock makes entering seem like a request. The writer lets a small action carry the uncertainty.",
    "The leisurely sequence of frames and labels invites the reader to linger with Lena. The short last sentence changes the pace, and the unexpected verb ‘moved’ makes the portrait seem to act on its own."
  ],
  hullabaloo:[
    "The move to the tree makes Sampath’s escape visible. Its distance from the town offers a physical image of freedom. As visitors gather, the tree becomes a place where other people assign him a role, giving the retreat a new set of expectations.",
    "People read wisdom into Sampath’s remarks because they expect the man in the tree to be wise. Desai lets readers recognise a gap between those readings and the origins of his remarks, making the believers’ certainty part of the joke.",
    "The monkeys give the orchard’s growing public attention something to turn against. Compare the reactions to the animals and the proposed responses. The escalation shows how little agreement there is about whom the orchard serves."
  ],
  pride:[
    "Darcy’s letter interrupts Elizabeth’s confident reading of events by giving him a sustained account of his own. Her reconsideration matters because the reader has spent so much time close to her judgement. Pemberley tests that revised reading through behaviour.",
    "The opening gives the search for a husband the authority of a universal truth. The mismatch between that grand claim and the interests of the families creates irony. Charlotte’s practical decisions let Austen explore the pressures behind such claims.",
    "Lady Catherine’s questioning assumes a right to control Elizabeth’s decisions. Elizabeth answers on her own terms and refuses the undertaking Lady Catherine wants. The dialogue makes authority depend on whether the other speaker agrees to recognise it."
  ],
  midsummer:[
    "The audience sees Puck’s intervention before the lovers can recognise its effects. The actors can make the sudden change in attention exaggerated and immediate. That contrast lets the audience enjoy a mistake that the characters take seriously.",
    "In Athens, Hermia’s father tries to enlist public authority in a private choice. The forest loosens that authority while exposing the lovers to the fairies’ control. The return to Athens lets the audience measure how those pressures have changed.",
    "The mechanicals explain devices such as Wall so carefully that the audience notices the effort behind the illusion. The court’s comments add a second performance around the first. Shakespeare lets the tragedy become comedy through its staging and reception."
  ]
};

const timedDraftKey = "english-study-desk-timed-drafts";
let timedDrafts = {};
try { timedDrafts = JSON.parse(localStorage.getItem(timedDraftKey)) || {}; } catch {}

const timedSession = {topic:"poetry", question:0, minutes:15, remaining:900, deadline:0};
let timerInterval;

function timedView() {
  const textOptions = Object.entries(timedTopics).filter(([id])=>Object.hasOwn(textLibrary,id))
    .map(([id, topic]) => '<option value="'+id+'">'+topic.title+'</option>').join("");
  return `<section class="panel timed-workspace" aria-label="Writing workspace">
    <div class="actions timed-modes" aria-label="Practice section">
      <a class="secondary" id="poetry-mode" href="#timed/poetry">Poetry skills</a>
      <a class="secondary" id="anthology-mode" href="#anthology">Songs of Ourselves</a>
      <a class="secondary" id="unseen-mode" href="#timed/unseen">Unseen prose</a>
      <a class="secondary" id="text-mode" href="#timed/texts">Set-text skills</a>
    </div>
    <label id="text-choice" hidden>Choose a text
      <select id="timed-topic">${textOptions}</select>
    </label>
    <label>Practice mode <select id="practice-mode"><option value="guided">Guided</option><option value="timed">Timed</option></select></label>
    <div class="practice-columns"><div class="timed-question">
      <p id="timed-poem" hidden></p>
      <p id="timed-skill" class="timed-skill"></p>
      <div id="timed-passage" class="example model" hidden></div>
      <h2 id="timed-prompt" tabindex="-1"></h2>
      <div class="actions">
        <button id="next-question" class="secondary" type="button">Change question</button>
        <span id="question-position"></span>
      </div>
      <details id="timed-help"><summary>Show a planning hint</summary><p id="timed-hint"></p></details>
    </div>
    <div class="editor-pane"><div class="timed-editor-head">
      <label for="timed-answer"><strong>Your response</strong></label>
      <output id="word-count" for="timed-answer" aria-live="off">0 words</output>
    </div>
    <textarea id="timed-answer" rows="10" aria-describedby="draft-status"></textarea>
    <div class="timed-controls">
      <div class="actions" id="clock-controls">
        <label>Practice time <select id="timer-limit">
          <option value="5">5 min</option><option value="10">10 min</option>
          <option value="15">15 min</option><option value="25">25 min</option><option value="45">45 min</option>
        </select></label>
        <span id="timer-display" role="timer" aria-label="Time remaining"></span>
        <button id="timer-toggle" class="primary" type="button">Start</button>
        <button id="timer-reset" class="secondary" type="button">Reset timer</button>
      </div>
      <div class="actions"><button id="undo-answer" class="secondary" type="button" hidden>Undo clear</button><button id="clear-answer" class="secondary" type="button">Clear text</button></div>
    </div>
    <p id="draft-status" class="timed-meta">Drafts are kept per question in this browser.</p>
    <p id="timer-status" role="status" class="timed-meta"></p></div></div>
    <button id="review-answer" class="primary" type="button">Finish writing and review</button>
    <section id="answer-review" hidden>
      <h2 tabindex="-1" id="review-title">Review your response</h2>
      <ul><li>Did I answer the exact question?</li><li>Did I use precise evidence?</li><li>Did I explain a writer’s choice and its effect?</li><li>Did I develop an interpretation?</li></ul>
      <h3 id="review-model-title">Worked paragraph</h3><p class="example" id="review-model"></p>
      <p>Look for the opening claim, the specific evidence and the explanation of its effect. Compare them with your paragraph.</p>
      <label for="practice-target">What will you improve next time?</label><input id="practice-target" maxlength="240">
      <button class="secondary" id="save-target" type="button">Save improvement</button>
      <p id="target-status" role="status"></p>
    </section>
    ${markingView()}
    ${selfMarkingView()}
  </section>`;
}

function resetTimedClock() {
  timedSession.deadline = 0;
  timedSession.remaining = timedSession.minutes * 60;
}

function wireTimed(section) {
  const session = timedSession;
  const [choice,index] = (section || "").split("/");
  const target = Object.hasOwn(timedTopics,choice) ? choice :
    choice === "texts" && !Object.hasOwn(textLibrary,session.topic) ? "hullabaloo" : session.topic;
  const questionIndex = /^\d+$/.test(index) && timedTopics[target].questions[index] ? Number(index) :
    target === session.topic ? session.question : 0;
  const mode = $("#practice-mode");
  let cleared = "";
  const editor = $("#timed-answer");
  const marking = wireMarking(session,editor);
  const select = $("#timed-topic");
  const limit = $("#timer-limit");
  const toggle = $("#timer-toggle");
  const status = $("#timer-status");
  const prompt = $("#timed-prompt");
  const draftId = () => session.topic + "/" + session.question;

  function showCount() {
    const words = editor.value.match(/[\p{L}\p{N}]+(?:[’'\-][\p{L}\p{N}]+)*/gu)?.length || 0;
    $("#word-count").textContent = words + (words === 1 ? " word" : " words");
    $("#clear-answer").disabled = !editor.value;
  }

  function saveDraft() {
    delete timedDrafts[draftId()];
    if (editor.value.trim()) timedDrafts[draftId()] = editor.value;
    try { localStorage.setItem(timedDraftKey, JSON.stringify(timedDrafts)); }
    catch { $("#draft-status").textContent = "Drafts will last until you close or reload this page."; }
    showCount();
    marking.invalidate();
  }

  function showClock() {
    if (session.deadline) {
      session.remaining = Math.max(0, Math.ceil((session.deadline - Date.now()) / 1000));
      if (!session.remaining) {
        session.deadline = 0;
        status.textContent = "Time is up. You can still review or edit your response.";
      }
    }
    const minutes = Math.floor(session.remaining / 60);
    const seconds = String(session.remaining % 60).padStart(2,"0");
    $("#timer-display").textContent = minutes + ":" + seconds;
    toggle.textContent = session.deadline ? "Pause" : session.remaining === session.minutes * 60 ? "Start" : "Resume";
    toggle.disabled = !session.remaining;
  }

  function showQuestion() {
    const poetry = session.topic === "poetry";
    const questions = timedTopics[session.topic].questions;
    const question = questions[session.question];
    $("#poetry-mode").toggleAttribute("aria-current", poetry);
    $("#unseen-mode").toggleAttribute("aria-current", session.topic === "unseen");
    const setText = Object.hasOwn(textLibrary,session.topic);
    $("#text-mode").toggleAttribute("aria-current", setText);
    $("#text-choice").hidden = !setText;
    if (setText) select.value = session.topic;
    $("#answer-review").hidden = true;
    $("#undo-answer").hidden = true;
    cleared = "";
    mode.value = session.mode || "guided";
    $("#clock-controls").hidden = mode.value === "guided";
    $("#timed-help").hidden = mode.value === "timed";
    $("#timed-skill").textContent = question.skill;
    $("#timed-poem").hidden = !question.text;
    $("#timed-poem").textContent = question.text ? "Open your anthology to "+question.text+"." : "";
    $("#anthology-mode").toggleAttribute("aria-current",Boolean(question.text));
    const passage = $("#timed-passage");
    passage.hidden = !question.passage;
    passage.textContent = question.passage || "";
    prompt.textContent = question.prompt;
    $("#timed-hint").textContent = question.hint;
    $("#timed-help").open = false;
    $("#question-position").textContent = "Question " + (session.question + 1) + " of " + questions.length;
    editor.value = timedDrafts[draftId()] || "";
    marking.reset();
    limit.value = String(session.minutes);
    showCount();
    showClock();
  }

  function changeQuestion(topic, question) {
    session.topic = topic;
    session.question = question;
    resetTimedClock();
    status.textContent = "";
    showQuestion();
  }

  editor.oninput = saveDraft;
  $("#clear-answer").onclick = () => {
    cleared = editor.value;
    editor.value = "";
    saveDraft();
    $("#undo-answer").hidden = false;
    $("#undo-answer").focus();
  };
  $("#undo-answer").onclick = () => {
    editor.value = cleared + (editor.value ? "\n"+editor.value : "");
    $("#undo-answer").hidden = true;
    saveDraft();
    editor.focus();
  };
  mode.onchange = () => {
    session.mode = mode.value;
    resetTimedClock();
    status.textContent = "";
    showQuestion();
  };
  $("#review-answer").onclick = () => {
    if (session.deadline) {
      showClock();
      session.deadline = 0;
      showClock();
    }
    const model = timedModels[session.topic]?.[session.question];
    $("#review-model-title").textContent = model ? "Worked paragraph" : "Review your analysis";
    $("#review-model").textContent = model || timedTopics[session.topic].questions[session.question].hint;
    $("#practice-target").value = saved.improvement || "";
    $("#target-status").textContent = "";
    $("#answer-review").hidden = false;
    $("#review-title").focus();
    saved.recentPractice = {topic:session.topic, question:session.question};
    persist();
  };
  $("#save-target").onclick = () => {
    saved.improvement = $("#practice-target").value.trim();
    persist();
    $("#target-status").textContent = storageFailed ? "Saved for this session." : "Improvement saved.";
  };
  select.onchange = () => changeQuestion(select.value, 0);
  $("#next-question").onclick = () => {
    const total = timedTopics[session.topic].questions.length;
    changeQuestion(session.topic, (session.question + 1) % total);
    prompt.focus();
  };
  limit.onchange = () => {
    session.minutes = Number(limit.value);
    resetTimedClock();
    status.textContent = "";
    showClock();
  };
  $("#timer-reset").onclick = () => {
    resetTimedClock();
    status.textContent = "";
    showClock();
  };
  toggle.onclick = () => {
    if (session.deadline) {
      showClock();
      session.deadline = 0;
    } else {
      session.deadline = Date.now() + session.remaining * 1000;
    }
    showClock();
  };

  if (target !== session.topic || questionIndex !== session.question) changeQuestion(target, questionIndex);
  else showQuestion();
  timerInterval = setInterval(showClock, 250);
}

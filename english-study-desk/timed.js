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

const timedDraftKey = "english-study-desk-timed-drafts";
let timedDrafts = {};
try { timedDrafts = JSON.parse(localStorage.getItem(timedDraftKey)) || {}; } catch {}

const timedSession = {topic:"poetry", question:0, minutes:15, remaining:900, deadline:0};
let timerInterval;

function timedView() {
  const textOptions = Object.entries(timedTopics).slice(1)
    .map(([id, topic]) => '<option value="'+id+'">'+topic.title+'</option>').join("");
  return `<section class="panel timed-workspace" aria-label="Writing workspace">
    <div class="actions timed-modes" aria-label="Practice section">
      <a class="secondary" id="poetry-mode" href="#timed/poetry">Poetry skills</a>
      <a class="secondary" id="text-mode" href="#timed/texts">Set-text skills</a>
    </div>
    <label id="text-choice" hidden>Choose a text
      <select id="timed-topic">${textOptions}</select>
    </label>
    <div class="timed-question">
      <p id="timed-skill" class="timed-skill"></p>
      <div id="timed-passage" class="example model" hidden></div>
      <h2 id="timed-prompt" tabindex="-1"></h2>
      <div class="actions">
        <button id="next-question" class="secondary" type="button">Change question</button>
        <span id="question-position"></span>
      </div>
      <details id="timed-help"><summary>Show a planning hint</summary><p id="timed-hint"></p></details>
    </div>
    <div class="timed-editor-head">
      <label for="timed-answer"><strong>Your response</strong></label>
      <output id="word-count" for="timed-answer" aria-live="off">0 words</output>
    </div>
    <textarea id="timed-answer" rows="10" aria-describedby="draft-status"></textarea>
    <div class="timed-controls">
      <div class="actions">
        <label>Time limit <select id="timer-limit">
          <option value="5">5 min</option><option value="10">10 min</option>
          <option value="15">15 min</option><option value="25">25 min</option><option value="45">45 min</option>
        </select></label>
        <span id="timer-display" role="timer" aria-label="Time remaining"></span>
        <button id="timer-toggle" class="primary" type="button">Start</button>
        <button id="timer-reset" class="secondary" type="button">Reset timer</button>
      </div>
      <button id="clear-answer" class="secondary" type="button">Clear text</button>
    </div>
    <p id="draft-status" class="timed-meta">Drafts are kept per question in this browser.</p>
    <p id="timer-status" role="status" class="timed-meta"></p>
  </section>`;
}

function resetTimedClock() {
  timedSession.deadline = 0;
  timedSession.remaining = timedSession.minutes * 60;
}

function wireTimed(section) {
  const session = timedSession;
  const target = section === "poetry" ? "poetry" :
    section === "texts" && session.topic === "poetry" ? "hullabaloo" : session.topic;
  const editor = $("#timed-answer");
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
    if (editor.value) timedDrafts[draftId()] = editor.value;
    else delete timedDrafts[draftId()];
    try { localStorage.setItem(timedDraftKey, JSON.stringify(timedDrafts)); }
    catch { $("#draft-status").textContent = "Drafts will last until you close or reload this page."; }
    showCount();
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
    $("#text-mode").toggleAttribute("aria-current", !poetry);
    $("#text-choice").hidden = poetry;
    if (!poetry) select.value = session.topic;
    $("#timed-skill").textContent = question.skill;
    const passage = $("#timed-passage");
    passage.hidden = !question.passage;
    passage.textContent = question.passage || "";
    prompt.textContent = question.prompt;
    $("#timed-hint").textContent = question.hint;
    $("#timed-help").open = false;
    $("#question-position").textContent = "Question " + (session.question + 1) + " of " + questions.length;
    editor.value = timedDrafts[draftId()] || "";
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
  $("#clear-answer").onclick = () => { editor.value = ""; saveDraft(); editor.focus(); };
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

  if (target !== session.topic) changeQuestion(target, 0);
  else showQuestion();
  timerInterval = setInterval(showClock, 250);
}

const categories = [
  {id:"reading", title:"Reading", icon:"book", color:"blue", desc:"Analyse language, structure and evidence."},
  {id:"writing", title:"Writing", icon:"edit", color:"purple", desc:"Shape clear arguments and responses."},
  {id:"comprehension", title:"Comprehension", icon:"eye", color:"green", desc:"Read for detail, inference and summary."},
  {id:"grammar", title:"Grammar", icon:"type", color:"amber", desc:"Build accurate sentences and punctuation."}
];

const lessons = [
  ["reading","writer-effect","How word choices create effects",
   "Start with the impression the writer creates. Choose a short quotation and unpack a word that contributes to that impression. Tie the effect back to the moment in the passage.",
   "‘Fog swallowed the last house.’ Swallowed makes the fog seem like a creature consuming the street. The last house disappears completely, leaving the speaker isolated.",
   "The gate ‘groaned’ in the wind. What does the verb suggest about the place?",
   "Groaned gives the gate a human sound associated with pain or effort. The movement can make the empty place seem restless or threatening."],
  ["reading","literary-essay","Build a literature argument",
   "Use the exact focus of the question to make a claim about the text. Develop it with brief, precise evidence and analysis of the writer’s choices. Connect the paragraph back to your interpretation.",
   "Mara says she is ready to leave, yet she folds her ticket ‘into a square no bigger than a nail’. The small, deliberate action suggests hesitation beneath her confident words.",
   "How could you extend the argument if Mara later smooths the ticket flat?",
   "The change in gesture can mark a change in resolve. Compare the earlier action with the later one and explain what the contrast reveals."],
  ["reading","poetry-drama","Read poetry and drama closely",
   "In poetry, notice where a sentence crosses a line break, where its sound changes, and where the speaker’s attitude shifts. In drama, ask how pauses, entrances, movement and interruptions would change what an audience sees or hears.",
   "‘I waited. / The door stayed shut.’ The short opening sentence and the line break leave a beat of silence before the refusal implied by the shut door.",
   "A character says ‘Please stay’ while turning away. What might an audience notice?",
   "The direction creates tension between the invitation and the body language. The audience might read it as embarrassment, fear of rejection or an attempt to hide emotion."],
  ["writing","audience-purpose","Write for audience and purpose",
   "Identify who will read the response, what they already know and what you want them to do. Choose a register and arrange your ideas in the order that makes your request easiest to follow.",
   "A letter to a headteacher might open with the request and its reason. A student magazine article can open with a shared experience that makes the issue matter to its readers.",
   "Turn ‘We need better buses’ into a specific request for a school leader.",
   "‘Please trial a later Thursday bus so students in after-school clubs can travel home safely.’ This gives the reader a clearly defined action and rationale."],
  ["writing","composition","Shape a descriptive or narrative piece",
   "In description, move the reader’s attention through the scene with selected sensory details. In narrative, give a character a goal and let a setback force a meaningful decision.",
   "‘The clock clicked above the counter. On the floor, a trail of sugar ended at the locked door.’ The shift in focus turns a familiar setting into a puzzle.",
   "Write two sentences that move from a wide view of a station to one detail.",
   "‘The platform stretched into the mist. Beneath the departure board, one red glove lay palm up on the tiles.’"],
  ["writing","directed-writing","Evaluate ideas in directed writing",
   "Pick evidence from the source that matters to your audience. Explain its significance, judge how convincing it is, and weave it into your own response in the specified form.",
   "A source claims a later start improves concentration. You could consider the benefit alongside travel and after-school commitments before recommending a short trial.",
   "A survey reports that 18 of 20 library users want longer hours. What limitation should you mention?",
   "The result reflects frequent users in a small sample. A wider survey could check whether students who do not currently use the library would benefit too."],
  ["comprehension","inference","Find clues and make inferences",
   "Separate what the passage states from what it implies. Base each inference on a clue and allow for alternative readings when the text is ambiguous.",
   "‘Noah checked the clock three times and kept his coat on.’ His behaviour suggests he expects to leave soon or is impatient. The text gives no definite reason.",
   "‘Iris hid her medal in the drawer before her friend arrived.’ What might this suggest?",
   "Iris may feel awkward about showing off. Hiding the medal before the visit supports that reading, though her exact motive remains open."],
  ["comprehension","summary","Summarise relevant ideas",
   "Underline the scope of the task, select distinct relevant points, and combine closely related details. Use your own words where possible, then check that the meaning has stayed accurate.",
   "‘The paths flooded and the shuttle stopped running’ can become ‘Flooding and the loss of the shuttle made the site difficult to reach.’",
   "Summarise the barriers to attending: ‘Tickets rose in price, the venue moved away from bus routes, and the posters were blue.’",
   "‘Higher ticket prices and poorer transport links made attendance harder.’ Poster colour falls outside the question’s focus."],
  ["grammar","sentence-boundaries","Fix sentence boundaries",
   "Check whether each part around a comma can stand alone. To join two independent clauses, use a full stop, a semicolon, or an appropriate conjunction.",
   "‘The bell rang, we packed our bags’ can become ‘When the bell rang, we packed our bags.’",
   "Repair ‘The lights went out, the crowd fell silent.’",
   "‘The lights went out, and the crowd fell silent.’ The conjunction connects two complete clauses."],
  ["grammar","agreement","Keep subjects and verbs in agreement",
   "Find the subject that controls the verb. A nearby phrase often adds information without changing whether the subject is singular or plural.",
   "‘The stack of books is on the desk.’ The subject is stack, so the verb is singular.",
   "Choose the verb in ‘The collection of old letters (was/were) donated on Friday.’",
   "‘Was’ agrees with the singular subject ‘collection’."]
];

const quizzes = {
  reading:[
    ["‘The houses crouched beneath the storm.’ What does ‘crouched’ suggest?",["The houses seem vulnerable.","The houses are newly built.","The storm is clearing."],0,"Crouched evokes a lowered, defensive posture and makes the buildings seem vulnerable."],
    ["Which sentence analyses a writer’s method?",["The narrator arrives at a bridge.","The repeated short questions suggest rising anxiety.","The passage has three paragraphs."],1,"This connects a specific structural choice to a plausible effect."],
    ["Why might a playwright place a pause after a confession?",["To reveal the set design","To prove the speaker forgot a line","To let tension build while the audience waits for a reply"],2,"A deliberate pause can draw attention to the reaction the audience anticipates."]
  ],
  writing:[
    ["Which opening suits a formal letter requesting a policy change?",["You have to sort this out.","I am writing to request a trial of longer library hours.","Guess what happened today?"],1,"A precise request and courteous tone suit this audience."],
    ["A source cites one pupil’s experience. Which response evaluates that evidence?",["This illustrates the problem, though a survey would show how widespread it is.","The pupil had a problem.","The source mentions a pupil."],0,"It explains the evidence’s value and its limitation."],
    ["Which detail creates an atmosphere through sound?",["The room measured six metres.","The room was old.","A loose pane rattled whenever the wind rose."],2,"The movement and sound let the reader experience the room."]
  ],
  comprehension:[
    ["‘Mina lowered her voice when she saw the sleeping baby.’ What can you infer?",["She wanted to avoid waking the baby.","She had lost her voice.","The baby was hungry."],0,"The timing links the quieter voice to the baby’s sleep."],
    ["The task asks why a trip was delayed. Which detail belongs?",["The bus had blue seats.","The map showed two rivers.","A bridge closure forced the driver to take a longer route."],2,"The detour directly explains the delay."],
    ["‘The library was packed by noon.’ Which is the best paraphrase?",["It closed at lunchtime.","It was already very crowded at midday.","Someone moved the books into boxes."],1,"In context, ‘packed’ describes the number of people."]
  ],
  grammar:[
    ["Choose the sentence with correct agreement.",["A list of items were missing.","A list of items was missing.","A list of items are missing."],1,"The singular subject ‘list’ takes ‘was’."],
    ["Which sentence correctly joins two independent clauses?",["The wind rose, we went inside.","Because the wind rose.","The wind rose, so we went inside."],2,"The conjunction ‘so’ joins the clauses and shows cause and effect."],
    ["Which sentence makes it clear who crossed the road?",["Crossing the road, Sam noticed the light change.","Crossing the road, the light changed.","Crossing the road, the light was red."],0,"Sam follows the opening phrase and clearly performs the action."]
  ]
};

const models = [
  ["Literature essay","0475 · Argument and analysis",
   "How does the writer present a character’s uncertainty? Use the original ticket example from the literature lesson.",
   "Mara’s confidence is undermined by her handling of the ticket. She insists that she is ready, yet folds it ‘into a square no bigger than a nail’. The careful reduction makes the ticket seem like something she wants to hide, turning an ordinary gesture into a sign of hesitation. When she later smooths it flat, the reversal gives her decision to leave a physical form.",
   "The response develops one interpretation through two moments and explains the effect of precise evidence."],
  ["Formal letter","0500 · Directed writing",
   "Write to the headteacher proposing a trial of longer library opening hours.",
   "Dear Headteacher,\n\nI am writing to propose a four-week trial in which the library stays open until 5 p.m. on Tuesdays. A quiet space after school would give students time to work before late buses depart. Although staffing is a concern, opening on one day would let us record demand and review the cost before committing to a longer schedule. Could the school council help agree the trial dates?\n\nYours faithfully,\nA student representative",
   "The opening makes a specific request and the middle weighs benefit against a practical constraint."],
  ["Report","0500 · Directed writing",
   "Report to the student council on access to after-school study spaces.",
   "Purpose\nThis report reviews whether students can find a quiet place to study after lessons.\n\nFindings\nThe library closes at 4 p.m., while the late bus leaves at 5 p.m. Students waiting for transport therefore have limited access to desks or computers during the last hour.\n\nRecommendation\nTrial one late opening per week for a month. Record attendance and ask users how the extra hour affected their study.",
   "Headings let a decision-maker locate the findings and the recommended action quickly."]
];

const glossary = [
  ["Inference","A conclusion drawn from evidence that the writer leaves implicit."],
  ["Register","The level and style of language chosen for an audience and situation."],
  ["Imagery","Language that evokes a sensory impression or helps the reader picture an idea."],
  ["Dramatic irony","A moment when the audience knows something a character does not."],
  ["Enjambment","A sentence or phrase that continues past the end of a line of poetry."],
  ["Motif","A recurring image, detail or idea that develops meaning across a text."],
  ["Independent clause","A group of words with a subject and verb that can stand as a sentence."],
  ["Paraphrase","A restatement in your own words that preserves the original meaning."]
];

const cambridge = "https://www.cambridgeinternational.org/";
const official = {
  lit:cambridge+"programmes-and-qualifications/english-literature-0475/",
  lang:cambridge+"programmes-and-qualifications/cambridge-igcse-english-first-language-0500/",
  pdfs:[
    ["0475 · 2026 syllabus","697163-2026-syllabus.pdf"],
    ["0475 · 2027 syllabus","721333-2027-syllabus.pdf"],
    ["0475 · 2028–2030 syllabus","743282-2028-2030-syllabus.pdf"],
    ["0500 · 2024–2026 syllabus","635230-2024-2026-syllabus.pdf"],
    ["0500 · 2027–2029 syllabus","718783-2027-2029-syllabus.pdf"]
  ]
};

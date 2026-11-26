const categories = [
  {id:"reading", title:"Close reading", icon:"book", color:"blue", desc:"Analyse language, structure and evidence."},
  {id:"writing", title:"Literary essays", icon:"edit", color:"purple", desc:"Build interpretations and support them with evidence."},
  {id:"unseen", title:"Unseen texts", icon:"eye", color:"green", desc:"Build interpretations of unfamiliar poetry and prose."},
  {id:"drama", title:"Drama", icon:"type", color:"amber", desc:"Analyse dialogue, staging and dramatic irony."}
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
  ["writing","essay-structure","Build an argument across an essay",
   "Turn the question into a claim you can develop. Give each paragraph a distinct role, such as showing how an impression begins, shifts or becomes more complicated.",
   "An essay about isolation could begin with the speaker’s separation from the group, then examine how the ending makes that isolation feel chosen.",
   "Plan two paragraphs for a question about a character who appears confident at first but later asks for help.",
   "First analyse how dialogue presents confidence. Then examine how a later request exposes vulnerability or shows the character learning to trust others."],
  ["unseen","inference","Find clues and make inferences",
   "Separate what an unfamiliar text states from what it implies. Test your reading against a second detail and pay attention to how the writer shapes the reader’s view.",
   "Noah checks the clock three times while keeping his coat on. The repetition draws attention to his impatience or anticipation.",
   "Iris hides a medal before her friend arrives, then places a photograph of the two of them on the desk. How might the gestures work together?",
   "The contrast may suggest that Iris values the friendship and feels awkward about displaying an achievement that could come between them."],
  ["unseen","unseen-shifts","Trace a shift in an unseen text",
   "Read once for situation and tone. On a second reading, mark a change in imagery, voice or pace. Use your opening paragraph to explain how that change contributes to an interpretation.",
   "A poem moves from bustling market sounds to the line ‘One stall stood silent’. The narrowing focus turns a lively setting into a reminder of absence.",
   "A passage moves from long descriptions of a garden to the short sentence ‘Then the latch lifted.’ What changes for the reader?",
   "The abrupt sentence breaks the descriptive pace and focuses attention on a single action, creating suspense about who is entering."],
  ["drama","stagecraft","Analyse stage directions and pauses",
   "Imagine a performance. Ask what the audience sees or hears and how a pause, entrance, movement or prop changes the meaning of a line.",
   "A character says ‘I’m ready’ while gripping the doorframe. The gesture can make the declaration sound like an effort to persuade herself.",
   "A character says ‘Take it’ while pulling a letter back. Explain how the staging affects the line.",
   "The withdrawal contradicts the invitation and can suggest that the character wants to appear willing while still controlling what the other person learns."],
  ["drama","dramatic-irony","Explain dramatic irony",
   "Identify the difference between what an audience knows and what a character knows. Explain how that gap changes the audience’s reaction to a particular line or decision.",
   "The audience sees a character hide the key before another says ‘At least we can still get out.’ The reassurance can heighten tension because the audience knows escape is uncertain.",
   "An audience knows a letter is forged, but a character immediately trusts it. What might the gap in knowledge make the audience anticipate?",
   "The audience may anticipate the consequences of the character’s trust, so even an ordinary plan can carry tension."]
];

const quizzes = {
  reading:[
    ["‘The houses crouched beneath the storm.’ What does ‘crouched’ suggest?",["The houses seem vulnerable.","The houses are newly built.","The storm is clearing."],0,"Crouched evokes a lowered, defensive posture and makes the buildings seem vulnerable."],
    ["Which sentence analyses a writer’s method?",["The narrator arrives at a bridge.","The repeated short questions suggest rising anxiety.","The passage has three paragraphs."],1,"This connects a specific structural choice to a plausible effect."],
    ["Why might a playwright place a pause after a confession?",["To reveal the set design","To prove the speaker forgot a line","To let tension build while the audience waits for a reply"],2,"A deliberate pause can draw attention to the reaction the audience anticipates."]
  ],
  writing:[
    ["Which opening offers a literature argument?",["This essay is about the poem.","The changing images of light make hope seem increasingly fragile.","The poem has four stanzas."],1,"The claim interprets an effect and identifies a pattern that the essay can trace."],
    ["Which sentence connects evidence to a reading?",["The repeated word ‘still’ slows the line and suggests the speaker feels trapped.","The writer uses repetition.","There is a quotation in the second stanza."],0,"It explains how the repeated word shapes pace and meaning."],
    ["How can a second paragraph develop an argument?",["Copy the first claim.","List every image in the text.","Use a later moment to show how the first impression changes."],2,"A shift gives the essay something new to explain while keeping the same focus."]
  ],
  unseen:[
    ["What is a productive first step with an unfamiliar poem?",["Identify the speaker, situation and initial tone.","Count every adjective.","Choose a theme before reading."],0,"These observations help you build an interpretation grounded in the poem."],
    ["A passage moves from a bustling street to a silent room. What should you examine?",["Only the length of each paragraph.","Only the meaning of the word room.","How the contrast changes the atmosphere."],2,"The shift in setting and sound can shape how the reader experiences the moment."],
    ["The final line changes from ‘we’ to ‘I’. What might the shift suggest?",["The speaker has changed the time of day.","The speaker is becoming isolated or asserting independence.","The poem has a regular rhyme scheme."],1,"The move from a group to an individual gives you a specific change to interpret in context."]
  ],
  drama:[
    ["A character says ‘Of course’ after a long pause. What could the pause suggest?",["The scene has ended.","The character hesitates before agreeing.","The audience has already left."],1,"The delay can make apparently direct agreement feel reluctant or uncertain."],
    ["When is there dramatic irony?",["Two characters disagree openly.","A character repeats an earlier line.","The audience knows a key fact that a character lacks."],2,"The gap in knowledge changes how the audience hears the character’s words."],
    ["Why might a playwright keep one character by the door?",["Their position can show a wish to leave or distance from the others.","Every actor must stay near a door.","The position proves the character is angry."],0,"The staging offers a visual clue whose interpretation depends on the dialogue and context."]
  ]
};

const models = [
  ["Literature essay","0475 · Argument and analysis",
   "How does the writer present a character’s uncertainty? Use the original ticket example from the literature lesson.",
   "Mara’s confidence is undermined by her handling of the ticket. She insists that she is ready, yet folds it ‘into a square no bigger than a nail’. The careful reduction makes the ticket seem like something she wants to hide, turning an ordinary gesture into a sign of hesitation. When she later smooths it flat, the reversal gives her decision to leave a physical form.",
   "The response develops one interpretation through two moments and explains the effect of precise evidence."],
  ["Poetry commentary","0475 · Unseen poetry",
   "How does the shift from market noise to a silent stall change the mood?",
   "The market’s noise initially makes the setting feel communal. The final image, ‘One stall stood silent’, narrows the speaker’s attention from the crowd to a single absence. The repeated s sound gives the line a subdued quality, while ‘one’ isolates the stall from the surrounding activity. The ending makes the lively market feel like a place where someone is missing.",
   "The paragraph connects a structural shift and a sound pattern to the changing mood."],
  ["Drama response","0475 · Stagecraft",
   "How does a character’s movement complicate the command ‘Take it’?",
   "The character offers the letter in words but pulls it back on stage. That change in distance turns ‘Take it’ into an uncertain invitation. An audience can see the hesitation even if the character tries to conceal it with a firm voice. The scene leaves the other character waiting and makes the letter a visible source of tension.",
   "The paragraph considers how an audience experiences the dialogue and movement together."]
];

const glossary = [
  ["Inference","A conclusion drawn from evidence that the writer leaves implicit."],
  ["Tone","The attitude a speaker or narrator conveys through language."],
  ["Imagery","Language that evokes a sensory impression or helps the reader picture an idea."],
  ["Dramatic irony","A moment when the audience knows something a character does not."],
  ["Enjambment","A sentence or phrase that continues past the end of a line of poetry."],
  ["Motif","A recurring image, detail or idea that develops meaning across a text."],
  ["Stage directions","Instructions that guide actions, movement or delivery in a play."],
  ["Narrative perspective","The position from which a story is told and the access it gives to events or thoughts."]
];

const cambridge = "https://www.cambridgeinternational.org/";
const official = {
  lit:cambridge+"programmes-and-qualifications/english-literature-0475/",
  pdfs:[
    ["0475 · 2026 syllabus","697163-2026-syllabus.pdf"],
    ["0475 · 2027 syllabus","721333-2027-syllabus.pdf"],
    ["0475 · 2028–2030 syllabus","743282-2028-2030-syllabus.pdf"]
  ]
};

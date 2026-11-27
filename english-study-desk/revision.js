const anthologySets = {
  "volume-1": {
    "title": "Volume 1",
    "years": [
      2026,
      2027,
      2028
    ],
    "poems": [
      [
        "Aphra Behn",
        "Song: Love Armed"
      ],
      [
        "Sujata Bhatt",
        "A Different History"
      ],
      [
        "William Blake",
        "The Chimney-Sweeper"
      ],
      [
        "Elizabeth Brewster",
        "Where I Come From"
      ],
      [
        "Boey Kim Cheng",
        "Report to Wordsworth"
      ],
      [
        "Gillian Clarke",
        "Lament"
      ],
      [
        "Kevin Halligan",
        "The Cockroach"
      ],
      [
        "Seamus Heaney",
        "Follower"
      ],
      [
        "Liz Lochhead",
        "Storyteller"
      ],
      [
        "Charles Mungoshi",
        "Before the Sun"
      ],
      [
        "Katherine Philips",
        "A Married State"
      ],
      [
        "Alexander Pope",
        "from An Essay on Man"
      ],
      [
        "Carol Rumens",
        "Carpet-weavers, Morocco"
      ],
      [
        "William Shakespeare",
        "Sonnet 18"
      ],
      [
        "Judith Wright",
        "Hunting Snake"
      ]
    ]
  },
  "volume-2-part-3": {
    "title": "Volume 2 · Part 3",
    "years": [
      2026,
      2027
    ],
    "poems": [
      [
        "Nancy Fotheringham Cato",
        "The Road"
      ],
      [
        "Sarah Jackson",
        "The Instant of My Death"
      ],
      [
        "Arun Kolatkar",
        "The Bus"
      ],
      [
        "Julius Chingono",
        "At the Bus Station"
      ],
      [
        "Imtiaz Dharker",
        "These are the Times We Live in"
      ],
      [
        "Elizabeth Jennings",
        "The Enemies"
      ],
      [
        "Sampurna Chattarji",
        "Boxes"
      ],
      [
        "W H Auden",
        "The Capital"
      ],
      [
        "Arthur Yap",
        "an afternoon nap"
      ],
      [
        "Elizabeth Smither",
        "Plaits"
      ],
      [
        "Elizabeth Daryush",
        "Children of Wealth"
      ],
      [
        "Thomas Love Peacock",
        "Rich and Poor or, Saint and Sinner"
      ],
      [
        "Musaemura Zimunya",
        "A Long Journey"
      ],
      [
        "Stevie Smith",
        "Touch and Go"
      ],
      [
        "George Szirtes",
        "Song"
      ]
    ]
  },
  "volume-2-part-2": {
    "title": "Volume 2 · Part 2",
    "years": [
      2029,
      2030
    ],
    "poems": [
      [
        "Jack Underwood",
        "Taking Back"
      ],
      [
        "Christopher Reid",
        "‘Blessed by the Indifference …’ (from The Flowers of Crete)"
      ],
      [
        "Judith Wright",
        "Australia 1970"
      ],
      [
        "Thomas Carew",
        "The Spring"
      ],
      [
        "Thomas Hardy",
        "The Darkling Thrush"
      ],
      [
        "Ruth Pitter",
        "Stormcock in Elder"
      ],
      [
        "Stevie Smith",
        "Parrot"
      ],
      [
        "Vivian Smith",
        "At the Parrot House, Taronga Park"
      ],
      [
        "Alice Oswald",
        "Eel Tail"
      ],
      [
        "Walt Whitman",
        "from Crossing Brooklyn Ferry"
      ],
      [
        "Kofi Awoonor",
        "The Sea Eats the Land at Home"
      ],
      [
        "Allen Curnow",
        "You will Know When You Get There"
      ],
      [
        "Charlotte Smith",
        "Written Near a Port on a Dark Evening"
      ],
      [
        "Imtiaz Dharker",
        "Blessing"
      ],
      [
        "Robinson Jeffers",
        "The Stars Go Over the Lonely Ocean"
      ]
    ]
  },
  "volume-3": {
    "title": "Volume 3",
    "years": [
      2028,
      2029,
      2030
    ],
    "poems": [
      [
        "John Clare",
        "Insects"
      ],
      [
        "Ellis Ayitey Komey",
        "Oblivion"
      ],
      [
        "Alice Oswald",
        "Fox"
      ],
      [
        "Ruth Dallas",
        "Deep in the Hills"
      ],
      [
        "Moniza Alvi",
        "My Aunts Don’t Want to Move"
      ],
      [
        "Jacob Polley",
        "Ruin"
      ],
      [
        "William Wordsworth",
        "from The Prelude"
      ],
      [
        "Helen Dunmore",
        "Bouncing Boy"
      ],
      [
        "Yvonne Gray",
        "Lightness"
      ],
      [
        "William Shakespeare",
        "Sonnet 106"
      ],
      [
        "Lady Mary Chudleigh",
        "To the Ladies"
      ],
      [
        "Romalyn Ante",
        "Ode to a Pot Noodle"
      ],
      [
        "Elizabeth Barrett Browning",
        "from My Heart and I"
      ],
      [
        "Les Murray",
        "The Widower in the Country"
      ],
      [
        "Ifi Amadiume",
        "Mistress of My Own Being"
      ]
    ]
  }
};

const poemFocus = {
  "Song: Love Armed":["how Behn presents love as a force with power over the speaker","Trace the personification of Love and consider who supplies its weapons."],
  "A Different History":["how Bhatt explores the relationship between language and power","Compare the shift from books and reverence to the questions about language and conquest."],
  "The Chimney-Sweeper":["how Blake uses contrasting voices or perspectives to expose injustice","Identify the anthology version and trace what the speaker reveals about the adults around them."],
  "Where I Come From":["how Brewster uses place to explore identity","Track the images people carry from their surroundings and how the speaker describes her own landscape."],
  "Report to Wordsworth":["how Cheng makes the speaker’s appeal urgent","Consider the address to Wordsworth and how images of environmental destruction intensify the appeal."],
  "Lament":["how Clarke communicates the cost of war","Trace the accumulated references to different victims and consider the effect of repetition."],
  "The Cockroach":["how Halligan makes an ordinary creature compelling","Follow the insect’s movement and the speaker’s change in perspective near the ending."],
  "Follower":["how Heaney presents the changing relationship between father and son","Compare the father’s skill early in the poem with how the roles shift at the end."],
  "Storyteller":["how Lochhead makes storytelling a vivid shared experience","Consider the interaction of storyteller and listeners, and how repeated patterns create an oral quality."],
  "Before the Sun":["how Mungoshi makes the early-morning scene memorable","Select details of a routine and trace how sensory imagery shapes the speaker’s experience."],
  "A Married State":["how Philips challenges expectations about marriage","Consider how the speaker addresses her audience and how the ending shapes her argument."],
  "from An Essay on Man":["how Pope presents uncertainty about humanity’s place","Explore contrasts in the poem and how balanced phrasing develops the argument."],
  "Carpet-weavers, Morocco":["how Rumens draws attention to the children and their work","Compare the description of the children with the images associated with the carpets."],
  "Sonnet 18":["how Shakespeare contrasts passing time with endurance","Trace the movement from the summer comparison to the closing claim about the poem’s power."],
  "Hunting Snake":["how Wright makes the encounter with the snake striking","Compare the walkers’ attention before, during and after the encounter."],
  "The Darkling Thrush":["how Hardy makes the bird’s song surprising","Compare the winter landscape with the energy of the song and the uncertainty of the final lines."],
  "Blessing":["how Dharker makes the arrival of water vivid","Contrast the opening dryness with the sound and movement of the crowd."],
  "To the Ladies":["how Chudleigh challenges assumptions about marriage","Trace how the address to women develops into a warning about power."],
  "Sonnet 106":["how Shakespeare connects earlier descriptions of beauty to the present","Compare the old accounts the speaker reads with what the speaker says about expressing beauty now."]
};

for (const [id,selection] of Object.entries(anthologySets)) {
  timedTopics[id] = {
    title:"Songs of Ourselves · "+selection.title,
    questions:selection.poems.map(([author,title])=>{
      const focus = poemFocus[title];
      return {skill:"Set poetry · "+author,text:title+" by "+author,
        prompt:focus ? "Explore "+focus[0]+" in “"+title+"”." : "How does "+author+" use language and structure to develop a central idea in “"+title+"”?",
        hint:focus?.[1] || "Use your anthology. Identify the speaker or central situation, then compare two moments and explain how a shift or recurring detail develops your interpretation."};
    })
  };
}

const recallTopics = {
  hullabaloo:{title:"Hullabaloo in the Guava Orchard",questions:[
    ["Where does Sampath settle after leaving home?",["A guava tree","A temple courtyard","A railway platform"],0,"The orchard becomes a refuge before his presence draws visitors."],
    ["What is Sampath’s job early in the novel?",["Schoolteacher","Postal worker","Fruit seller"],1,"His work at the post office gives him access to other people’s correspondence."],
    ["Who is Sampath’s mother?",["Pinkie","Ammaji","Kulfi"],2,"Kulfi is Sampath’s mother. Pinkie is his sister."],
    ["Which event increases pressure on the orchard?",["The monkeys’ disruptive behaviour","A railway extension","A courtship contest"],0,"The monkeys’ behaviour brings competing responses from the town and officials."],
    ["Who sees a business opportunity in Sampath’s following?",["The District Collector","Mr Chawla","The spy"],1,"Sampath’s father recognises the commercial potential of the crowds."]
  ]},
  pride:{title:"Pride and Prejudice",questions:[
    ["Who marries Mr Collins?",["Jane Bennet","Lydia Bennet","Charlotte Lucas"],2,"Charlotte accepts after Elizabeth refuses him."],
    ["Which estate belongs to Darcy?",["Pemberley","Netherfield","Rosings"],0,"Elizabeth visits Pemberley with the Gardiners."],
    ["What prompts Elizabeth to reconsider Wickham’s account?",["A discussion with Lady Catherine","Darcy’s letter","A note from Lydia"],1,"Darcy’s letter gives his account of Wickham and the separation of Jane and Bingley."],
    ["Who elopes with Wickham?",["Kitty","Mary","Lydia"],2,"Lydia’s elopement threatens her family’s reputation."],
    ["Why does Lady Catherine confront Elizabeth near the end?",["She wants a promise that Elizabeth will refuse Darcy","She wants to buy Longbourn","She wants Elizabeth to visit Jane"],0,"Elizabeth refuses to make the promise Lady Catherine demands."]
  ]},
  midsummer:{title:"A Midsummer Night’s Dream",questions:[
    ["Whom does Egeus want Hermia to marry?",["Lysander","Demetrius","Theseus"],1,"Egeus supports Demetrius even though Hermia wants Lysander."],
    ["Which Athenian does Puck enchant first by mistake?",["Lysander","Demetrius","Bottom"],0,"Puck mistakes Lysander for the man Oberon told him to find."],
    ["What happens to Bottom’s appearance in the forest?",["He becomes invisible","He looks like a lion","He acquires an ass’s head"],2,"The transformed Bottom is the first creature Titania sees after waking."],
    ["Which play do the mechanicals perform?",["Pyramus and Thisbe","Hero and Leander","Orpheus and Eurydice"],0,"Their performance of the tragic story becomes comic entertainment for the court."],
    ["Who is engaged to Hippolyta?",["Oberon","Theseus","Egeus"],1,"Their wedding frames the events in Athens and the forest."]
  ]},
  poetry:{title:"Poetry techniques",questions:[
    ["What is enjambment?",["A repeated vowel sound","A sentence or phrase that runs across a line break","A pause inside a line"],1,"Enjambment can carry the reader forward or create temporary uncertainty."],
    ["Which feature marks a turn in a poem’s argument or feeling?",["A volta","A simile","A rhyme pair"],0,"A volta is a significant turn. Explain what changes and why it matters."],
    ["Which describes a caesura?",["A repeated line","A character speaking to the audience","A pause within a line"],2,"A caesura can interrupt rhythm or make a phrase stand out."],
    ["What does identifying the speaker help establish?",["The point of view the poem presents","The poet’s biography","The number of syllables"],0,"The speaker’s reactions and limits shape what a reader learns and feels."]
  ]}
};

for (const [id,selection] of Object.entries(anthologySets)) {
  const {poems,title} = selection;
  recallTopics[id] = {title:"Songs of Ourselves · "+title,questions:poems.map(([author,poem],i)=>{
    const choices = [author,poems[(i+3)%poems.length][0],poems[(i+7)%poems.length][0]];
    const correct = i%choices.length;
    [choices[0],choices[correct]] = [choices[correct],choices[0]];
    return ["Who wrote “"+poem+"”?",choices,correct,author+" wrote this poem in the "+title+" selection."];
  })};
}

function anthologyView() {
  const selections = Object.entries(anthologySets).filter(([,selection])=>selection.years.includes(saved.examYear));
  const pdf = official.pdfs[saved.examYear>=2028 ? 2 : saved.examYear===2026 ? 0 : 1];
  return panel("Choose your anthology selection",examYearPicker()+'<p>Open your printed or licensed anthology alongside the writing desk. These original questions practise the poems in Cambridge’s published selections.</p><p>'+link(cambridge+"Images/"+pdf[1],pdf[0]+" (PDF)")+' · '+link(official.lit,"Cambridge syllabus updates")+'</p>')+
    selections.map(([id,selection])=>panel(selection.title,'<p>'+link("#mcq/"+id,"Practise poet and title recall")+'</p><ol class="poem-list">'+selection.poems.map(([author,title],i)=>'<li>'+link("#timed/"+id+"/"+i,title)+' <span>· '+author+'</span></li>').join("")+'</ol>')).join("");
}

function mcqView(id) {
  if (Object.hasOwn(recallTopics,id)) {
    const topic = recallTopics[id];
    return '<p>'+link("#mcq","All quiz topics")+'</p><h2>'+topic.title+'</h2>'+quizForm(topic.questions);
  }
  return panel("Text and poetry recall",'<div class="cards recall-cards">'+Object.entries(recallTopics).filter(([key])=>!anthologySets[key] || anthologySets[key].years.includes(saved.examYear)).map(([key,topic])=>'<a class="card" href="#mcq/'+key+'"><h3>'+topic.title+'</h3><p>'+topic.questions.length+' questions</p></a>').join("")+'</div>')+
    panel("Skills quizzes",list(categories.map(c=>link("#practice/"+c.id,c.title))));
}

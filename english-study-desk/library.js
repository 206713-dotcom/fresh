const textLibrary = {
  hullabaloo:{
    author:"Kiran Desai", type:"Prose", years:[2027,2028],
    overview:"Sampath escapes everyday life in Shahkot, only to discover that other people can turn his retreat into a public spectacle.",
    characters:"Sampath wants space from the town’s expectations. Mr Chawla sees an opportunity in his son’s reputation. Kulfi approaches the orchard through her fascination with food.",
    themes:"Freedom and expectation, the making of a reputation, and the gap between private desire and public interpretation.",
    moments:[
      ["Sampath moves to the tree","The orchard offers physical space and distance from town. Contrast the freedom of the move with the growing presence of visitors. The same setting changes meaning as more people claim a stake in it."],
      ["The monkeys become a public problem","Compare how different groups react to the monkeys. Desai’s shifting attention makes a problem at the orchard expose competing priorities across Shahkot."]
    ]
  },
  pride:{
    author:"Jane Austen", type:"Prose", years:[2027,2028],
    overview:"Elizabeth Bennet’s changing judgements of Darcy and others make the novel an inquiry into how people read social behaviour.",
    characters:"Elizabeth is quick to interpret others and capable of reconsidering. Darcy’s reserve affects how people read him. Charlotte Lucas’s choices offer a different perspective on marriage.",
    themes:"First impressions, class and reputation, marriage, and the relationship between judgement and self-knowledge.",
    moments:[
      ["Elizabeth reads Darcy’s letter","The letter gives Darcy sustained room to explain his actions. Follow how the narration then returns to Elizabeth’s reading and rereading, making the revision of her judgement part of the drama."],
      ["Lady Catherine visits Elizabeth","Track who asks the questions and who controls what is disclosed. The exchange dramatises the limits of Lady Catherine’s social authority."]
    ]
  },
  midsummer:{
    author:"William Shakespeare", type:"Drama", years:[2027],
    overview:"Lovers, fairies and amateur actors cross paths in the forest, where mistakes about love and identity become visible to the audience.",
    characters:"Hermia resists the marriage her father demands. Oberon and Puck intervene in the lovers’ lives. Bottom’s confidence carries the mechanicals’ performance through its mishaps.",
    themes:"Love and perception, authority and freedom, transformation, and the audience’s role in making theatre.",
    moments:[
      ["Puck mistakes Lysander for Demetrius","The audience can recognise the error as it happens. Describe how the gap between intention and action shapes the comedy of the next scene."],
      ["The mechanicals perform Pyramus and Thisbe","Consider their explanations of props and staging alongside the court’s interruptions. Shakespeare lets two audiences experience the same performance at once."]
    ]
  }
};

const skillPaths = [
  {title:"Poetry", icon:"book", color:"blue", desc:"Trace imagery, sound and changes in tone.", lessons:["poetry-sound","poetry-structure"], practice:"poetry"},
  {title:"Prose", icon:"eye", color:"purple", desc:"Follow perspective, character and setting.", lessons:["prose-perspective","prose-setting"], practice:"hullabaloo"},
  {title:"Drama", icon:"type", color:"green", desc:"Read dialogue as something an audience hears and sees.", lessons:["stagecraft","dramatic-irony"], practice:"midsummer"},
  {title:"Unseen", icon:"map", color:"amber", desc:"Build a reading of a passage you have just met.", lessons:["inference","unseen-shifts"], practice:"unseen"}
];

function skillsCards() {
  return '<div class="cards">'+skillPaths.map((path,i)=>
    '<a class="card" href="#skills/'+i+'"><span class="tile '+path.color+'">'+icon(path.icon)+'</span><h3>'+path.title+'</h3><p>'+path.desc+'</p></a>'
  ).join("")+'</div>';
}

function skillsView(id) {
  const path = Object.hasOwn(skillPaths,id) && /^\d$/.test(id) ? skillPaths[id] : null;
  if (!path) return skillsCards()+panel("Essay technique",'<p>Build and support an argument across a response.</p>'+list(["literary-essay","essay-structure"].map(id=>link("#lesson/"+id,lesson(id)[2])))+'<p>'+link("#lessons","Browse all lessons")+'</p>');
  return panel(path.title,list(path.lessons.map(id=>link("#lesson/"+id,lesson(id)[2])))+'<a class="primary" href="#timed/'+path.practice+'">Practise '+path.title.toLowerCase()+'</a>');
}

function textsView(id) {
  if (Object.hasOwn(textLibrary,id)) {
    const book = textLibrary[id];
    const topic = timedTopics[id];
    return panel(topic.title,"<p>"+book.author+" · "+book.type+"</p><p>"+book.overview+"</p>"+textEligibility(book))+
      panel("Characters","<p>"+book.characters+"</p>")+panel("Themes","<p>"+book.themes+"</p>")+
      panel("Key moments",book.moments.map(([title,analysis])=>"<h3>"+title+"</h3><p>"+analysis+"</p>").join(""))+
      panel("Practice questions",list(topic.questions.map((q,index)=>link("#timed/"+id+"/"+index,q.prompt))));
  }
  return '<div class="cards text-library">'+Object.entries(textLibrary).map(([key,book])=>
    '<a class="card" href="#texts/'+key+'"><span class="tile blue">'+icon("book")+'</span><h3>'+timedTopics[key].title+'</h3><p>'+book.author+' · '+book.type+'</p>'+textEligibility(book)+'</a>'
  ).join("")+'</div>';
}

function textEligibility(book) {
  const year = saved.examYear;
  const listed = book.years.includes(year) || (year===2026 && book.type==="Prose");
  return '<small>'+(listed ? "Listed for "+year : "Study resource · check the "+year+" set-text list")+'</small>';
}

function examYearPicker() {
  return '<label class="exam-choice">Exam year <select class="exam-year">'+[2026,2027,2028,2029,2030].map(year=>
    '<option value="'+year+'"'+(year===saved.examYear?" selected":"")+'>'+year+'</option>'
  ).join("")+'</select></label>';
}

function updateResume() {
  const entry = Object.keys(timedDrafts).reverse().find(key=>{
    const [topic,question] = key.split("/");
    return Object.hasOwn(timedTopics,topic) && timedTopics[topic].questions[question];
  });
  const resume = $("#resume-study");
  const [topic,question] = entry ? entry.split("/") : ["poetry","0"];
  resume.href = "#timed/"+topic+"/"+question;
  resume.textContent = entry ? "Resume draft" : "Try a poetry question";
  if (entry) $("#home-progress").textContent = timedTopics[topic].questions[question].prompt;
}

const icons = {
  book:'<path d="M12 7C9 4 5 4 2.5 5.5v13C6 17 9 17 12 20c3-3 6-3 9.5-1.5v-13C19 4 15 4 12 7v13"/>',
  edit:'<path d="m4 16-1 5 5-1L20 8l-4-4L4 16zm9-9 4 4M15 5l2-2a2 2 0 0 1 3 0l1 1a2 2 0 0 1 0 3l-2 2"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
  chart:'<path d="M4 4v16h16M8 15v-3m5 3V8m5 7V5"/>',
  map:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6m-6 4h6m-6 4h4"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  type:'<path d="m3 19 6-14 6 14M5 15h8m3-3h5v7m0-4h-3a2 2 0 0 0 0 4h3"/>',
  close:'<path d="m6 6 12 12M18 6 6 18"/>'
};
const icon = name => '<svg viewBox="0 0 24 24" aria-hidden="true">'+icons[name]+'</svg>';
const $ = selector => document.querySelector(selector);
document.querySelectorAll('[data-icon]').forEach(el => el.innerHTML = icon(el.dataset.icon));

const titles = {home:"Home",syllabus:"Exam guide",skills:"Skills",texts:"Set texts",lessons:"Lessons & study guides",practice:"Practice exercises",mcq:"Multiple-choice practice",anthology:"Songs of Ourselves",timed:"Writing practice",writing:"Writing help & samples",strategies:"Exam strategies",resources:"Resources & downloads",about:"About & contact",progress:"My progress"};
const key = "english-study-desk-v1";
let saved = {lessons:[],scores:{},large:false,activity:{},examYear:2027};
try { saved = {...saved,...JSON.parse(localStorage.getItem(key))}; } catch {}
saved.lessons = saved.lessons.filter(id => lessons.some(item => item[1] === id));
// The essay quiz has new questions, so its old best score no longer applies.
if (saved.quizVersion !== 2) {
  saved.scores = {reading:saved.scores.reading};
  saved.quizVersion = 2;
}
let storageFailed = false;
function persist() {
  try { localStorage.setItem(key,JSON.stringify(saved)); }
  catch { storageFailed = true; }
}
function count(event) {
  saved.activity[event] = (saved.activity[event] || 0) + 1;
  persist();
}
function updateTextSize() {
  document.documentElement.classList.toggle("big",saved.large);
  $("#type").setAttribute("aria-pressed",String(saved.large));
}
updateTextSize();
$("#type").onclick = () => { saved.large = !saved.large; persist(); updateTextSize(); };
function applyTheme() {
  const dark = saved.theme ? saved.theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  $("#theme").textContent = dark ? "Light" : "Dark";
  $("#theme").setAttribute("aria-label",dark ? "Switch to light theme" : "Switch to dark theme");
  $('meta[name="theme-color"]').content = dark ? "#101a29" : "#f6f8fa";
}
applyTheme();
$("#theme").onclick = () => {
  saved.theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  persist();
  applyTheme();
};
$(".progress-link").setAttribute("aria-label","My progress");

const cat = id => categories.find(item => item.id === id);
const lesson = id => lessons.find(item => item[1] === id);
const categoryCards = (base) => '<div class="cards">'+categories.map(c => {
  const total = base === 'practice' ? quizzes[c.id].length+' questions' : lessons.filter(l=>l[0]===c.id).length+' lessons';
  return '<a class="card" href="#'+base+'/'+c.id+'"><span class="tile '+c.color+'">'+icon(c.icon)+'</span><h3>'+c.title+'</h3><p>'+c.desc+'</p><small>'+total+'</small></a>';
}).join("")+'</div>';
$("#home-cards").outerHTML = skillsCards();

const panel = (title,body) => '<section class="panel"><h2>'+title+'</h2>'+body+'</section>';
const list = (items,tag="ul") => '<'+tag+'>'+items.map(item=>'<li>'+item+'</li>').join("")+'</'+tag+'>';
const link = (href,label) => '<a href="'+href+'">'+label+'</a>';
const download = (file,label) => '<a href="downloads/'+file+'" download>'+label+'</a>';

function syllabus() {
  const modern = saved.examYear >= 2028;
  const papers = modern ? [
    "<strong>Paper 1 · Poetry and Prose.</strong> 90 minutes, 50 marks, open text. Answer one poetry question and one prose essay.",
    "<strong>Paper 2 · Drama and Unseen.</strong> 120 minutes, 50 marks, open text. Choose a drama passage question or essay and an unseen poem or prose extract.",
    "<strong>Component 3 · Coursework.</strong> The alternative to Paper 2. Submit one essay comparing complete texts and one comparing poems."
  ] : [
    "<strong>Paper 1 · Poetry and Prose.</strong> 90 minutes, 50 marks, closed text. Answer one poetry and one prose question.",
    "<strong>Paper 2 · Drama.</strong> 90 minutes, 50 marks, closed text. This route has two drama questions on two texts.",
    "<strong>Paper 3 · Drama (Open Text).</strong> 45 minutes, 25 marks. Your school may pair it with Paper 4 Unseen (75 minutes, 25 marks) or Component 5 Coursework."
  ];
  const pdf = official.pdfs[modern ? 2 : saved.examYear === 2026 ? 0 : 1];
  return panel("Your exam route",examYearPicker()+'<p>Everyone takes Paper 1. Confirm your other components and permitted materials with your school.</p>'+list(papers))+
    panel("Plan your time",'<p>On the 90-minute Paper 1, a practice split is about 45 minutes per response, including reading, planning and checking. Use the opening minutes to identify the question’s focus and pick evidence.</p><p>Avoid retelling the plot. For example, instead of stopping at “Elizabeth reads Darcy’s letter”, explain how the letter gives him space to challenge the reader’s earlier impression.</p>')+
    panel("Official Cambridge materials",list([link(cambridge+"Images/"+pdf[1],pdf[0]+" (PDF)"),link(official.lit,"Syllabus updates and permitted materials"),link(official.lit+"past-papers/","Past papers, specimen papers and mark schemes")]));
}

function lessonView(id) {
  const [category,lessonId,title,explanation,example,prompt,answer] = lesson(id);
  const complete = saved.lessons.includes(lessonId);
  return panel("Learn the skill",'<p>'+explanation+'</p><div class="steps" aria-label="Study sequence"><span>Read the task</span><span>Pick a detail</span><span>Explain your choice</span></div><h3>Worked example</h3><div class="example">'+example+'</div><h3>Try it</h3><p>'+prompt+'</p><details><summary>Reveal a sample response</summary><p>'+answer+'</p></details><p id="lesson-status" aria-live="polite">'+(complete?"Completed":"")+'</p><div class="actions"><button id="complete" class="primary" type="button" '+(complete?"disabled":"")+'>Mark complete</button><a class="secondary" href="#practice/'+category+'">Practise '+cat(category).title.toLowerCase()+'</a></div>');
}

function lessonList(category) {
  if (!category) return categoryCards("lessons");
  return lessons.filter(l=>l[0]===category).map(l=>panel(l[2],'<p>'+l[3]+'</p><a class="secondary" href="#lesson/'+l[1]+'">'+(saved.lessons.includes(l[1])?"Review lesson":"Open lesson")+'</a>')).join("");
}
function practice(category) {
  if (!category) return panel("Writing practice",'<p>Practise a poetry or set-text response with a timer and word counter.</p><div class="actions"><a class="primary" href="#timed/poetry">Poetry skills</a><a class="secondary" href="#timed/texts">Set-text skills</a><a class="secondary" href="#timed/unseen">Unseen prose</a><a class="secondary" href="#anthology">Songs of Ourselves</a><a class="secondary" href="#mcq">Multiple-choice practice</a></div>')+categoryCards("practice")+panel("Exam-style practice",'<p>Start with a topic quiz, then apply the skill to an original timed prompt or a Cambridge paper from your exam series.</p>'+list([download("timed-practice.txt","Timed practice prompts by topic"),link("#resources","Official past papers and mark schemes")]));
  return quizForm(quizzes[category]);
}

function quizForm(questions) {
  return '<form id="quiz" class="panel">'+questions.map(([question,answers],i)=>'<fieldset><legend>'+(i+1)+'. '+question+'</legend>'+answers.map((a,j)=>'<label class="choice"><input type="radio" name="q'+i+'" value="'+j+'" '+(j===0?"required":"")+'> '+a+'</label>').join("")+'<p class="feedback" id="feedback-'+i+'"></p></fieldset>').join("")+'<div class="actions"><button class="primary" type="submit">Check answers</button><button class="secondary" type="reset">Try again</button></div><p id="quiz-result" role="status"></p></form>';
}

function progress() {
  const recent = saved.recentPractice;
  const question = recent && timedTopics[recent.topic]?.questions[recent.question];
  const practicePanel = panel("Writing review",'<p id="next-improvement"></p>'+(question?'<p>'+link("#timed/"+recent.topic+"/"+recent.question,question.prompt)+'</p>': '<p>'+link("#timed","Try a writing question")+'</p>'));

  const count = saved.lessons.length;
  const recallScores = Object.entries(recallTopics).filter(([id])=>saved.scores["recall/"+id]!==undefined);
  const recallPanel = recallScores.length ? panel("Text and poetry recall scores",list(recallScores.map(([id,topic])=>
    link("#mcq/"+id,topic.title)+" · "+saved.scores["recall/"+id]+" / "+topic.questions.length))) : "";
  return practicePanel+recallPanel+panel("Lesson progress",'<p>'+count+' of '+lessons.length+' lessons completed.</p><progress aria-label="Completed lessons" max="'+lessons.length+'" value="'+count+'"></progress>'+ (count?list(saved.lessons.map(id=>lesson(id)).filter(Boolean).map(l=>link("#lesson/"+l[1],l[2]))):'<p><a href="#lessons">Choose a lesson to get started</a>.</p>'))+
    panel("Best quiz scores",list(categories.map(c=>link("#practice/"+c.id,c.title)+" · "+(saved.scores[c.id]===undefined?"Awaiting first attempt":saved.scores[c.id]+" / "+quizzes[c.id].length)))+'<p>'+(storageFailed?"Browser storage is unavailable. Progress will last for this session.":"Progress and study activity are stored in this browser.")+'</p><p>Lessons opened: '+(saved.activity.lessonViews||0)+' · Quizzes submitted: '+(saved.activity.quizSubmissions||0)+'</p>');
}

function resources() {
  return panel("Official Cambridge materials",list([
    link(official.lit+"past-papers/","0475 past papers, mark schemes and specimen materials"),
    link(official.lit+"endorsed-resources/","0475 endorsed books and resources"),
    link("#syllabus","Syllabus PDFs by exam year")
  ])+'<p>Match the syllabus code, exam series and component on the paper and mark scheme before starting.</p>')+
  panel("Printable downloads",list([
    download("revision-notes.txt","Revision notes"),
    download("writing-templates.txt","Literature response templates"),
    download("revision-timetable.csv","Weekly revision timetable"),
    download("timed-practice.txt","Timed practice prompts")
  ]))+panel("Glossary",'<dl>'+glossary.map(([term,meaning])=>'<dt><strong>'+term+'</strong></dt><dd>'+meaning+'</dd>').join("")+'</dl>');
}

const descriptions = {
  syllabus:"Find the assessment route and official syllabus for Literature in English (0475) and your exam year.",
  lessons:"Study a skill, read a worked example and try it yourself.",
  timed:"Choose a poetry or set-text question and write a timed response. Check your exam-year syllabus for your set texts.",
  practice:"Answer topic questions and get feedback as soon as you submit.",
  writing:"See how a task becomes a structured response, then use a template to draft your own.",
  strategies:"Make a revision plan and practise the decisions you will face under exam conditions.",
  resources:"Find official exam materials and print study resources for offline revision.",
  about:"English Study Desk is an independent revision site for students, teachers and families.",
  progress:"Review your completed lessons and best quiz scores on this device."
};
const views = {
  syllabus,
  anthology:anthologyView,
  mcq:mcqView,
  skills:skillsView,
  texts:textsView,
  lessons:lessonList,
  practice,
  timed:timedView,
  writing:() => models.map(([title,track,prompt,model,reason])=>panel(title,'<p><strong>'+track+'</strong></p><p>'+prompt+'</p><div class="example model">'+model+'</div><p>'+reason+'</p>')).join("")+panel("Writing templates",'<p>'+download("writing-templates.txt","Download literature response templates")+'</p>'),
  strategies:() => panel("Before the exam",list([
    "Confirm your syllabus code, exam year and route. For 0475, check which texts you will answer on and what you can bring into the room.",
    "Practise with one timed task at a time. Mark it with the corresponding Cambridge mark scheme, then rewrite the weakest paragraph.",
    "Space out review. Revisit a difficult skill later in the week and test yourself from memory."
  ],"ol"))+panel("During the exam",list([
    "Allocate time using the marks and instructions on your paper. Leave a short window at the end to check for omissions.",
    "For literature, use the question’s focus to shape your argument. Avoid plot retelling and explain how details support your reading.",
    "For poetry and prose, explain how a significant word, image or structural shift shapes meaning.",
    "For drama, consider what an audience sees or hears. Link dialogue and stagecraft to your interpretation.",
    "For unseen commentary, read twice if time allows. Identify a shift and select details that support your reading."
  ])+'<p>'+download("revision-timetable.csv","Download the revision timetable")+'</p>'),
  resources,
  progress,
  about:() => panel("About the study desk",'<p>English Study Desk was created as an independent, self-paced resource for Literature in English (0475). Cambridge International provides the official syllabus, specimen papers and mark schemes linked here.</p>')+panel("Share feedback",'<p>Prepare a feedback draft to share with a teacher or the person who gave you this site link.</p><form id="contact"><label>Name<input name="name" autocomplete="name" required></label><label>Email<input name="email" type="email" autocomplete="email" required></label><label>Message<textarea name="message" required></textarea></label><button class="primary" type="submit">Download feedback draft</button><p id="contact-status" role="status"></p></form><p>'+link("https://www.youtube.com/@CambridgeInt","Cambridge International on YouTube")+'</p>')
};

function updateExamYear(event) {
  saved.examYear = Number(event.target.value);
  persist();
  render();
  $(/^#(?:syllabus|anthology)/.test(location.hash) ? "#page .exam-year" : "#home-exam-year .exam-year").focus();
}

function render() {
  clearInterval(timerInterval);
  const [raw, sub, detail] = location.hash.slice(1).split("/");
  const route = raw === "lesson" && lesson(sub) ? "lesson" : Object.hasOwn(titles,raw) ? raw : "home";
  const currentLesson = route === "lesson" ? lesson(sub) : null;
  const category = ["practice","lessons"].includes(route) ? cat(sub) : null;
  const title = currentLesson?.[2] || category?.title || titles[route];
  document.title = route==="home" ? "English Study Desk | Cambridge IGCSE Literature (0475)" : title+" | English Study Desk";
  document.querySelectorAll(".nav nav a").forEach(a=>{
    if (a.hash==="#"+(route==="lesson"?"lessons":route==="timed"?"practice":route)) a.setAttribute("aria-current","page");
    else a.removeAttribute("aria-current");
  });
  $("#home").hidden = route !== "home";
  $("#page").hidden = route === "home";
  $("#home-progress").textContent = saved.lessons.length ? saved.lessons.length+" of "+lessons.length+" lessons completed." : "Your lesson and quiz progress will appear here.";
  $("#home-exam-year").innerHTML = examYearPicker();
  $("#home-exam-year .exam-year").onchange = updateExamYear;
  updateResume();
  if (route === "home") return;
  const trail = currentLesson
    ? " / "+link("#lessons","Lessons")+" / "+link("#lessons/"+currentLesson[0],cat(currentLesson[0]).title)
    : category ? " / "+link("#"+route,titles[route]) : "";
  if (currentLesson) count("lessonViews");
  $("#page").innerHTML = '<div class="crumb" aria-label="Breadcrumb">'+link("#home","Home")+trail+' / '+title+'</div><h1 class="page-title" tabindex="-1">'+title+'</h1><p class="intro">'+(descriptions[route]||"")+'</p>'+
    (currentLesson ? lessonView(sub) : views[route](["skills","texts","mcq"].includes(route) ? sub : category?.id));
  if (currentLesson) $("#complete").onclick = () => {
    saved.lessons.push(sub);
    persist();
    $("#complete").disabled = true;
    $("#lesson-status").textContent = storageFailed ? "Completed for this session" : "Completed";
  };
  if (route==="practice" && category) wireQuiz(category.id);
  if (route==="mcq" && Object.hasOwn(recallTopics,sub)) wireQuiz("recall/"+sub,recallTopics[sub].questions);
  if (route==="timed") wireTimed(detail === undefined ? sub : sub+"/"+detail);
  if (route==="syllabus" || route==="anthology") $("#page .exam-year").onchange = updateExamYear;
  if (route==="progress") $("#next-improvement").textContent = saved.improvement || "Save an improvement after reviewing a response.";
  if (route==="about") $("#contact").onsubmit = event => {
    event.preventDefault();
    const draft = new FormData(event.target);
    const blob = new Blob(["English Study Desk feedback\n\nName: "+draft.get("name")+"\nEmail: "+draft.get("email")+"\n\n"+draft.get("message")+"\n"],{type:"text/plain"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "study-desk-feedback.txt";
    a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    $("#contact-status").textContent = "Feedback draft prepared.";
  };
}
function wireQuiz(category,questions = quizzes[category]) {
  const form = $("#quiz");
  form.onsubmit = event => {
    event.preventDefault();
    const answers = new FormData(form);
    let score = 0;
    questions.forEach(([,options,correct,explanation],i)=>{
      const answer = answers.get("q"+i);
      const right = answer !== null && Number(answer) === correct;
      score += Number(right);
      $("#feedback-"+i).textContent = (right?"Correct. ":"Answer: "+options[correct]+" ") + explanation;
    });
    saved.scores[category] = Math.max(saved.scores[category] || 0,score);
    count("quizSubmissions");
    $("#quiz-result").textContent = "You scored "+score+" out of "+questions.length+". "+(storageFailed?"Score saved for this session.":"Your best score is saved.");
  };
  form.onreset = () => {
    form.querySelectorAll(".feedback").forEach(el=>el.textContent="");
    $("#quiz-result").textContent = "";
  };
}
const search = $("#search");
const dialog = $("#search-dialog");
const index = [
  ...Object.entries(titles).map(([id,title])=>[id,title,descriptions[id]||""]),
  ...Object.keys(textLibrary).map(id=>["texts/"+id,timedTopics[id].title,textLibrary[id].author]),
  ...Object.entries(anthologySets).flatMap(([id,set])=>set.poems.map(([author,title],i)=>["timed/"+id+"/"+i,title,author+" Songs of Ourselves "+set.title])),
  ...Object.entries(recallTopics).map(([id,topic])=>["mcq/"+id,topic.title+" quiz","MCQ recall multiple choice"]),
  ["timed/poetry","Poetry skills writing practice","Unseen poetry imagery sound structure timer word counter"],
  ["timed/texts","Set-text writing practice","Hullabaloo in the Guava Orchard Pride and Prejudice A Midsummer Night’s Dream"],
  ["syllabus/0475","0475 literature papers","paper 1 poetry prose paper 2 drama unseen coursework"],
  ...lessons.map(([id,slug,title,desc])=>["lesson/"+slug,title,id+" "+desc]),
  ...categories.map(c=>["practice/"+c.id,c.title+" quiz",c.desc]),
  ...glossary.map(([term,meaning])=>["resources",term+" · Glossary",meaning])
];
function suggestions() {
  const words = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const results = words.length ? index.filter(x=>words.every(w=>x.join(" ").toLowerCase().includes(w))).slice(0,8) : index.slice(1,6);
  $("#suggestions").innerHTML = results.length ? results.map(([id,title])=>link("#"+id,title)).join("") : "<p>No matching study resources.</p>";
}
$("#search-open").onclick = () => { search.value=""; suggestions(); dialog.showModal(); search.focus(); };
$("#search-close").onclick = () => dialog.close();
search.oninput = suggestions;
dialog.addEventListener("click",event=>{ if(event.target.closest("#suggestions a")) dialog.close(); });
dialog.addEventListener("keydown",event=>{
  const links = [...$("#suggestions").querySelectorAll("a")];
  const active = links.indexOf(document.activeElement);
  if (event.key==="ArrowDown" && links.length) { event.preventDefault(); links[(active+1)%links.length].focus(); }
  if (event.key==="ArrowUp" && active>=0) { event.preventDefault(); (links[active-1]||search).focus(); }
  if (event.key==="Enter" && document.activeElement===search && links.length) { event.preventDefault(); links[0].click(); }
});
window.addEventListener("hashchange",()=>{
  if (location.hash === "#main") return;
  render();
  window.scrollTo(0,0);
  ($("#page").hidden ? $("#main") : $(".page-title"))?.focus({preventScroll:true});
});
render();

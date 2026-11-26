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

const titles = {home:"Home",syllabus:"Syllabus overview",lessons:"Lessons & study guides",practice:"Practice exercises",writing:"Writing help & samples",strategies:"Exam strategies",resources:"Resources & downloads",about:"About & contact",progress:"My progress"};
const key = "english-study-desk-v1";
let saved = {lessons:[],scores:{},large:false,activity:{}};
try { saved = {...saved,...JSON.parse(localStorage.getItem(key))}; } catch {}
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
$(".progress-link").setAttribute("aria-label","My progress");

const cat = id => categories.find(item => item.id === id);
const lesson = id => lessons.find(item => item[1] === id);
const categoryCards = (base) => '<div class="cards">'+categories.map(c => {
  const total = base === 'practice' ? quizzes[c.id].length+' questions' : lessons.filter(l=>l[0]===c.id).length+' lessons';
  return '<a class="card" href="#'+base+'/'+c.id+'"><span class="tile '+c.color+'">'+icon(c.icon)+'</span><h3>'+c.title+'</h3><p>'+c.desc+'</p><small>'+total+'</small></a>';
}).join("")+'</div>';
$("#home-cards").outerHTML = categoryCards("lessons");

const panel = (title,body) => '<section class="panel"><h2>'+title+'</h2>'+body+'</section>';
const list = (items,tag="ul") => '<'+tag+'>'+items.map(item=>'<li>'+item+'</li>').join("")+'</'+tag+'>';
const link = (href,label) => '<a href="'+href+'">'+label+'</a>';
const download = (file,label) => '<a href="downloads/'+file+'" download>'+label+'</a>';
const tab = (href,label,active) => '<a class="secondary" href="#'+href+'"'+(active?' aria-current="page"':'')+'>'+label+'</a>';

function syllabus(track) {
  const language = track === "0500";
  const tabs = '<div class="tabs" aria-label="Syllabus code">'+tab("syllabus/0475","0475 · Literature",!language)+tab("syllabus/0500","0500 · First Language",language)+'</div>';
  const overview = language
    ? panel("First Language English (0500)",'<p>Practise understanding explicit and implicit meaning, selecting evidence, evaluating ideas and writing clearly for a given audience.</p>'+list([
      '<strong>Paper 1 · Reading.</strong> Work with unseen texts and use evidence to answer comprehension, summary, language analysis and extended response tasks.',
      '<strong>Paper 2 · Directed Writing and Composition.</strong> Evaluate source ideas in a prescribed form and write a descriptive or narrative composition. From 2027, Question 1(a) introduces a short reading task before directed writing.',
      '<strong>Component 3 · Coursework Portfolio.</strong> Your school may enter you for coursework in place of Paper 2. Component 4 is the separately endorsed speaking and listening option.'
    ]))
    : panel("Literature in English (0475)",'<p>Study your set texts, develop interpretations, analyse writers’ choices and support a personal response with precise evidence.</p><h3>2026 and 2027 exams</h3>'+list([
        '<strong>Paper 1 · Poetry and Prose.</strong> Everyone takes this 90-minute paper and answers one poetry and one prose question.',
        '<strong>Paper 2 · Drama.</strong> One route pairs Paper 1 with this 90-minute paper, which has two drama questions.',
        '<strong>Paper 3 · Drama (Open Text).</strong> Other routes pair Paper 1 with this 45-minute paper, plus either the 75-minute Paper 4 Unseen or Component 5 Coursework.'
      ])+'<h3>2028–2030 exams</h3><p>Everyone takes the open-text Paper 1 (Poetry and Prose). The examined route adds open-text Paper 2 (Drama and Unseen). The coursework route adds Component 3. Check Cambridge’s syllabus updates for what you can bring into the exam.</p>');
  return tabs + overview + panel("Official syllabus PDFs",list(official.pdfs.filter(([name])=>name.startsWith(language?"0500":"0475")).map(([name,file])=>link(cambridge+"Images/"+file,name+" (PDF)")+" "))+'<p>Choose the year you will sit the exam and check your school’s entry route, set texts and permitted materials. '+link(language?official.lang:official.lit,"View the Cambridge syllabus page and updates")+'.</p>');
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
  if (!category) return categoryCards("practice")+panel("Exam-style practice",'<p>Start with a topic quiz, then apply the skill to an original timed prompt or a Cambridge paper from your exam series.</p>'+list([download("timed-practice.txt","Timed practice prompts by topic"),link("#resources","Official past papers and mark schemes")]));
  const questions = quizzes[category];
  return '<form id="quiz" class="panel">'+questions.map(([question,answers],i)=>'<fieldset><legend>'+(i+1)+'. '+question+'</legend>'+answers.map((a,j)=>'<label class="choice"><input type="radio" name="q'+i+'" value="'+j+'" '+(j===0?"required":"")+'> '+a+'</label>').join("")+'<p class="feedback" id="feedback-'+i+'"></p></fieldset>').join("")+'<div class="actions"><button class="primary" type="submit">Check answers</button><button class="secondary" type="reset">Try again</button></div><p id="quiz-result" role="status"></p></form>';
}

function progress() {
  const count = saved.lessons.length;
  return panel("Lesson progress",'<p>'+count+' of '+lessons.length+' lessons completed.</p><progress aria-label="Completed lessons" max="'+lessons.length+'" value="'+count+'"></progress>'+ (count?list(saved.lessons.map(id=>lesson(id)).filter(Boolean).map(l=>link("#lesson/"+l[1],l[2]))):'<p><a href="#lessons">Choose a lesson to get started</a>.</p>'))+
    panel("Best quiz scores",list(categories.map(c=>link("#practice/"+c.id,c.title)+" · "+(saved.scores[c.id]===undefined?"Awaiting first attempt":saved.scores[c.id]+" / "+quizzes[c.id].length)))+'<p>'+(storageFailed?"Browser storage is unavailable. Progress will last for this session.":"Progress and study activity are stored in this browser.")+'</p><p>Lessons opened: '+(saved.activity.lessonViews||0)+' · Quizzes submitted: '+(saved.activity.quizSubmissions||0)+'</p>');
}

function resources() {
  return panel("Official Cambridge materials",list([
    link(official.lit+"past-papers/","0475 past papers, mark schemes and specimen materials"),
    link(official.lang+"past-papers/","0500 past papers, mark schemes and specimen materials"),
    link(official.lit+"endorsed-resources/","0475 endorsed books and resources"),
    link(official.lang+"endorsed-resources/","0500 endorsed books and resources"),
    link("#syllabus","Syllabus PDFs by exam year")
  ])+'<p>Match the syllabus code, exam series and component on the paper and mark scheme before starting.</p>')+
  panel("Printable downloads",list([
    download("revision-notes.txt","Revision notes"),
    download("writing-templates.txt","Essay, letter and report templates"),
    download("revision-timetable.csv","Weekly revision timetable"),
    download("timed-practice.txt","Timed practice prompts")
  ]))+panel("Glossary",'<dl>'+glossary.map(([term,meaning])=>'<dt><strong>'+term+'</strong></dt><dd>'+meaning+'</dd>').join("")+'</dl>');
}

const descriptions = {
  syllabus:"Find the assessment route and official syllabus for your qualification and exam year.",
  lessons:"Study a skill, read a worked example and try it yourself.",
  practice:"Answer topic questions and get feedback as soon as you submit.",
  writing:"See how a task becomes a structured response, then use a template to draft your own.",
  strategies:"Make a revision plan and practise the decisions you will face under exam conditions.",
  resources:"Find official exam materials and print study resources for offline revision.",
  about:"English Study Desk is an independent revision site for students, teachers and families.",
  progress:"Review your completed lessons and best quiz scores on this device."
};
const views = {
  syllabus,
  lessons:lessonList,
  practice,
  writing:() => models.map(([title,track,prompt,model,reason])=>panel(title,'<p><strong>'+track+'</strong></p><p>'+prompt+'</p><div class="example model">'+model+'</div><p>'+reason+'</p>')).join("")+panel("Writing templates",'<p>'+download("writing-templates.txt","Download essay, letter and report templates")+'</p>'),
  strategies:() => panel("Before the exam",list([
    "Confirm your syllabus code, exam year and route. For 0475, check which texts you will answer on and what you can bring into the room.",
    "Practise with one timed task at a time. Mark it with the corresponding Cambridge mark scheme, then rewrite the weakest paragraph.",
    "Space out review. Revisit a difficult skill later in the week and test yourself from memory."
  ],"ol"))+panel("During the exam",list([
    "Allocate time using the marks and instructions on your paper. Leave a short window at the end to check for omissions.",
    "For literature, use the question’s focus to shape your argument. Avoid plot retelling and explain how details support your reading.",
    "For comprehension and summary, answer within the scope of the question. Check that paraphrasing preserves the source meaning.",
    "For directed writing, identify the audience, purpose and form before starting. Evaluate source claims and avoid copying whole sentences.",
    "For composition, leave time to correct sentence boundaries, unclear references and accidental tense shifts."
  ])+'<p>'+download("revision-timetable.csv","Download the revision timetable")+'</p>'),
  resources,
  progress,
  about:() => panel("About the study desk",'<p>English Study Desk was created as an independent, self-paced resource. Cambridge International provides the official syllabus, specimen papers and mark schemes linked here.</p>')+panel("Share feedback",'<p>Prepare a feedback draft to share with a teacher or the person who gave you this site link.</p><form id="contact"><label>Name<input name="name" autocomplete="name" required></label><label>Email<input name="email" type="email" autocomplete="email" required></label><label>Message<textarea name="message" required></textarea></label><button class="primary" type="submit">Download feedback draft</button><p id="contact-status" role="status"></p></form><p>'+link("https://www.youtube.com/@CambridgeInt","Cambridge International on YouTube")+'</p>')
};

function render() {
  const [raw, sub] = location.hash.slice(1).split("/");
  const route = raw === "lesson" && lesson(sub) ? "lesson" : Object.hasOwn(titles,raw) ? raw : "home";
  const currentLesson = route === "lesson" ? lesson(sub) : null;
  const category = ["practice","lessons"].includes(route) ? cat(sub) : null;
  const title = currentLesson?.[2] || category?.title || titles[route];
  document.title = route==="home" ? "English Study Desk | Cambridge IGCSE revision" : title+" | English Study Desk";
  document.querySelectorAll(".nav nav a").forEach(a=>{
    if (a.hash==="#"+(route==="lesson"?"lessons":route)) a.setAttribute("aria-current","page");
    else a.removeAttribute("aria-current");
  });
  $("#home").hidden = route !== "home";
  $("#page").hidden = route === "home";
  $("#home-progress").textContent = saved.lessons.length ? saved.lessons.length+" of "+lessons.length+" lessons completed." : "Your lesson and quiz progress will appear here.";
  if (route === "home") return;
  const trail = currentLesson
    ? " / "+link("#lessons","Lessons")+" / "+link("#lessons/"+currentLesson[0],cat(currentLesson[0]).title)
    : category ? " / "+link("#"+route,titles[route]) : "";
  if (currentLesson) count("lessonViews");
  $("#page").innerHTML = '<div class="crumb" aria-label="Breadcrumb">'+link("#home","Home")+trail+' / '+title+'</div><h1 class="page-title" tabindex="-1">'+title+'</h1><p class="intro">'+(descriptions[route]||"")+'</p>'+
    (currentLesson ? lessonView(sub) : views[route](category?.id || (route==="syllabus"?sub:undefined)));
  if (currentLesson) $("#complete").onclick = () => {
    saved.lessons.push(sub);
    persist();
    $("#complete").disabled = true;
    $("#lesson-status").textContent = storageFailed ? "Completed for this session" : "Completed";
  };
  if (route==="practice" && category) wireQuiz(category.id);
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
function wireQuiz(category) {
  const form = $("#quiz");
  const questions = quizzes[category];
  form.onsubmit = event => {
    event.preventDefault();
    const answers = new FormData(form);
    let score = 0;
    questions.forEach(([,options,correct,explanation],i)=>{
      const right = Number(answers.get("q"+i)) === correct;
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
  ["syllabus/0475","0475 literature papers","paper 1 poetry prose paper 2 drama unseen coursework"],
  ["syllabus/0500","0500 first language papers","paper 1 reading paper 2 composition directed writing"],
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

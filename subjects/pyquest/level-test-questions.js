// Original, short diagnostic questions; not official Cambridge exam questions.
// The test is an informal learning guide, not a school grade or certification.
export const TEST_VERSION = 1;
export const TOPICS = Object.freeze([
  {id:'basics',label:'Python basics',emoji:'🐍',focus:'Printing, variables, types and calculations',lessonIds:['hello','variables','maths','booleans']},
  {id:'control',label:'Conditions & loops',emoji:'🔁',focus:'If statements, Boolean logic and repetition',lessonIds:['conditions','loops','while','nested-loops']},
  {id:'collections',label:'Lists & strings',emoji:'📦',focus:'Indexing, lists, strings and dictionaries',lessonIds:['lists','strings','dictionary','slicing']},
  {id:'functions',label:'Functions & debugging',emoji:'🧩',focus:'Parameters, return values and errors',lessonIds:['functions','exceptions','testing','recursion']},
  {id:'algorithms',label:'Algorithms',emoji:'🧠',focus:'Tracing, searching and sorting',lessonIds:['sorting','binary-search-idea','binary-search','testing']},
  {id:'igcse',label:'IGCSE 0478 systems',emoji:'🎓',focus:'Binary, logic, hardware and data security',lessonIds:['binary-convert','hex-convert','bitwise','binary-search-idea']}
]);
// Four questions per strand. Gradually harder within each strand.
export const QUESTIONS = Object.freeze([
  {topic:'basics',q:'Which command displays text in Python?',a:['echo("Hi")','print("Hi")','show("Hi")','display("Hi")'],correct:1,why:'Python uses print() to display text.'},
  {topic:'basics',q:'After x = 5, what does print(x + 2) display?',a:['x + 2','52','7','Error'],correct:2,why:'x stores the number 5, and 5 + 2 is 7.'},
  {topic:'basics',q:'What is the type of the value "12"?',a:['Integer','String','Boolean','Float'],correct:1,why:'Quotation marks make "12" text rather than an integer.'},
  {topic:'basics',q:'What does 7 // 2 evaluate to?',a:['3','3.5','4','1'],correct:0,why:'// performs floor division, so 7 // 2 is 3.'},
  {topic:'control',q:'Which comparison checks whether x equals 4?',a:['x = 4','x == 4','x => 4','x is= 4'],correct:1,why:'== checks equality; = assigns a value.'},
  {topic:'control',q:'How many times does for i in range(3): run?',a:['2','3','4','Forever'],correct:1,why:'range(3) produces 0, 1 and 2.'},
  {topic:'control',q:'What does not (True and False) evaluate to?',a:['True','False','0','Error'],correct:0,why:'True and False is False; not False is True.'},
  {topic:'control',q:'What prevents a while loop from running forever?',a:['A changing condition that becomes False','An import statement','A list','Using print()'],correct:0,why:'The loop condition must eventually become False, or the loop must break.'},
  {topic:'collections',q:'Which expression gets the first element of items?',a:['items(0)','items[1]','items[0]','items.first'],correct:2,why:'Python list indexes begin at 0.'},
  {topic:'collections',q:'What is len("code")?',a:['3','4','5','Error'],correct:1,why:'The string has four characters.'},
  {topic:'collections',q:'What is [10, 20, 30][-1]?',a:['10','20','30','Error'],correct:2,why:'Index -1 accesses the last list element.'},
  {topic:'collections',q:'What expression reads the age stored under the key "age" in a dictionary d?',a:['d.age()','d["age"]','d(0)','d->age'],correct:1,why:'A dictionary uses keys inside square brackets.'},
  {topic:'functions',q:'Which keyword starts a function definition?',a:['func','function','def','return'],correct:2,why:'Python defines a function with def.'},
  {topic:'functions',q:'What is printed by def double(n): return n*2; print(double(3))?',a:['3','6','n*2','Nothing'],correct:1,why:'double(3) returns 6.'},
  {topic:'functions',q:'What is the difference between print() and return inside a function?',a:['There is none','return gives a result to the caller','print always ends the function','return writes to a file'],correct:1,why:'return passes a value back to the caller; print displays it.'},
  {topic:'functions',q:'Which error happens when code uses an undefined variable?',a:['IndexError','TypeError','NameError','SyntaxWarning'],correct:2,why:'NameError is raised when a name has not been defined.'},
  {topic:'algorithms',q:'What does an algorithm describe?',a:['A set of steps to solve a problem','Only Python code','A computer chip','A password'],correct:0,why:'An algorithm is a clear sequence of steps.'},
  {topic:'algorithms',q:'What should you do before binary searching a list?',a:['Reverse it','Sort it','Delete duplicates','Convert it to text'],correct:1,why:'Binary search assumes the data is sorted.'},
  {topic:'algorithms',q:'Which algorithm repeatedly swaps neighbouring items in the wrong order?',a:['Merge sort','Binary search','Bubble sort','Linear search'],correct:2,why:'Bubble sort compares adjacent items and swaps them.'},
  {topic:'algorithms',q:'A linear search of n items takes at most how many checks in the worst case?',a:['1','log₂ n','n','n²'],correct:2,why:'Linear search may need to inspect every element.'},
  {topic:'igcse',q:'What is the decimal value of binary 1010?',a:['8','10','12','14'],correct:1,why:'1010₂ = 8 + 2 = 10.'},
  {topic:'igcse',q:'How many bits are in one byte?',a:['2','4','8','16'],correct:2,why:'A byte contains 8 bits.'},
  {topic:'igcse',q:'Which logic gate is TRUE only when both inputs are TRUE?',a:['OR','NOT','AND','XOR'],correct:2,why:'AND gives output 1 only if both inputs are 1.'},
  {topic:'igcse',q:'What is a major reason to use encryption when data is sent over a network?',a:['To increase screen brightness','To protect data confidentiality','To stop all hardware failures','To make files smaller'],correct:1,why:'Encryption helps stop unauthorized readers understanding intercepted data.'}
]);
export const TOTAL = QUESTIONS.length;
export function scoreAnswers(answers) {
  if(!Array.isArray(answers) || answers.length!==TOTAL || answers.some(v=>!Number.isInteger(v)||v<0||v>3))throw Error('Answer all questions before finishing.');
  const scores=Object.fromEntries(TOPICS.map(x=>[x.id,0]));
  let correct=0;
  QUESTIONS.forEach((q,i)=>{if(answers[i]===q.correct){scores[q.topic]++;correct++;}});
  return {scores,correct};
}
export function studyPriority(scores) {
  // Prerequisite order breaks ties; foundations come before harder topics.
  return TOPICS.slice().sort((a,b)=>Number(scores[a.id]||0)-Number(scores[b.id]||0)||TOPICS.indexOf(a)-TOPICS.indexOf(b));
}
export function studyPlan(scores) {
  const priority=studyPriority(scores);
  const needs=priority.filter(t=>Number(scores[t.id]||0)<4);
  return (needs.length?needs:priority).slice(0,3).map(t=>({topic:t.id,lesson:t.lessonIds[Number(scores[t.id]||0)>=3?Math.min(1,t.lessonIds.length-1):0]}));
}
export function strengthLabel(score) {return score<=1?'Start here':score===2?'Building':score===3?'Developing':'Strong';}

// Diagnostic placement opens a learning pathway, not XP, completions or rewards.
// Four items per strand cannot certify mastery: three correct is a conservative
// signal to offer a starting point, and students can revisit ALL earlier lessons.
export function diagnosticPlacement(scores) {
  const strands=['basics','control','collections','functions','algorithms','igcse'];
  let cleared=0;
  for (const id of strands) {
    if (Number(scores?.[id]??0) < 3) break;
    cleared++;
  }
  // Lessons are arranged in groups of four; stop after 6 groups (lesson 25).
  const index=cleared*4;
  return {index, skippedCheckpoints:cleared, clearedStrands:strands.slice(0,cleared),
    nextStrand:strands[cleared]||null};
}
export function localDiagnosticFeedback(scores) {
  const place=diagnosticPlacement(scores);
  const topic=TOPICS.find(t=>t.id===place.nextStrand);
  const strong=TOPICS.filter(t=>Number(scores?.[t.id]||0)>=3);
  const needs=studyPriority(scores).filter(t=>Number(scores?.[t.id]||0)<3);
  const summary=place.index>0
    ? `Your answers suggest you can start further along the Python pathway. ${strong.length} topic area${strong.length===1?' looks':'s look'} comfortable so far. Your earlier lessons are available for revision without their checkpoints.`
    : `The test suggests beginning with Python foundations, then building step by step. This is only a short starting-point check, not a judgement of your ability.`;
  const steps=(needs.length?needs:studyPriority(scores).slice(0,3)).slice(0,3).map(t=>{
    const n=Number(scores?.[t.id]||0);
    return {topic:t.id,reason:n<=1
      ? `Start with ${t.focus.toLowerCase()}. Write and run a small example, then try the practice tasks.`
      : `You answered ${n}/4 correctly here. Review ${t.focus.toLowerCase()} and retry the examples without copying.`};
  });
  if(topic && !steps.some(s=>s.topic===topic.id))steps.unshift({topic:topic.id,reason:`This is your next suggested topic: ${topic.focus.toLowerCase()}. Start with the recommended lesson.`});
  return {summary,steps:steps.slice(0,3),placementIndex:place.index,source:'built-in'};
}

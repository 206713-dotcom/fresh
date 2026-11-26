import {rates} from './rewards.js?v=balanced';
import {allQuestionRefs, courseLessons, courseUnit, courseUnits, questionByKey, unitName, courseLabel} from './curriculum.js';
import {answerChoices, courseButton} from './views.js?v=balanced';
import {badge, button, e, empty, icon, link, pageHead, progress, tile} from './ui.js';

export const MODES = {
  checkpoint:{name:'Topic checkpoint', icon:'test', tone:'mint', coins:rates.checkpoint, description:'Answer eight questions and score at least six. Small topics include related skills.'},
  quest:{name:'Mixed challenge', icon:'flag', tone:'violet', coins:rates.quest, description:'Answer eight questions from across your curriculum and score at least six.'},
  team:{name:'Pair sprint', icon:'pair', tone:'amber', coins:rates.team, description:'Take turns on one device. Each player answers eight questions for a combined score.'}
};

export function createRound(course,mode,unit,seed,reorder) {
  const lessons = courseLessons(course);
  const topic = lessons.filter(item => courseUnit(course,item) === unit);
  const count = mode === 'team' ? 16 : 8;
  const baseOrder = reorder(lessons,seed);
  const mixed = [
    ...baseOrder.map(lesson => allQuestionRefs(lesson)[0]),
    ...reorder(baseOrder.flatMap(lesson => allQuestionRefs(lesson).slice(1)),seed+1)
  ];
  const items = mode === 'checkpoint' ? [...reorder(topic.flatMap(allQuestionRefs),seed+2), ...mixed] : mixed;
  const keys = [...new Set(items.map(ref=>ref.key))].slice(0,count);
  return {mode,unit,seed,keys,answers:keys.map(()=>null),index:0,done:false,reward:0};
}

export function markRound(round) {
  return round.keys.map((key,i) => questionByKey(key).question.answer === round.answers[i]);
}

export function arenaView(state,course,unit,shuffle) {
  if (!course) return `${pageHead('','Practice lab','Test yourself and earn GIS Points.')}${empty('flask','Choose your curriculum','The practice lab draws questions from the syllabus you select.',courseButton('Choose curriculum'))}`;
  const round = state.rounds[course.id];
  const head = actions => pageHead(e(courseLabel(course)),'Practice lab','Check your skills and earn GIS Points.',actions);
  if (!round) {
    return `${head('')}<div class="practice-picker">
      ${Object.entries(MODES).map(([id,mode])=>`<section class="mode-card card">${tile(mode.icon,mode.tone,24)}<h2>${mode.name}</h2><p>${mode.description}</p>
        ${id==='checkpoint' ? '<label class="field-label" for="practice-topic">Choose a topic</label><div class="select-wrap"><select id="practice-topic">' + courseUnits(course).map(topic=> '<option value="' + topic + '"' + (topic===unit ? ' selected' : '') + '>' + e(unitName(course,topic)) + '</option>').join('') + '</select>' + icon('down',16) + '</div>' : ''}
        <div class="mode-foot">${badge('+' + mode.coins + ' GIS Points','amber')}${button('start-round','Start ' + mode.name.toLowerCase(),'primary','data-mode="' + id + '"')}</div>
      </section>`).join('')}</div>
      <p class="quiet-text">Earn a checkpoint reward once per topic and a mixed challenge or pair sprint reward once per curriculum. Replay any round for practice.</p>`;
  }
  const mode = MODES[round.mode];
  const title = round.mode === 'checkpoint' ? unitName(course,round.unit) + ' checkpoint' : mode.name;
  if (round.done) {
    const marks = markRound(round);
    const score = marks.filter(Boolean).length;
    const passed = round.mode==='team' || score >= 6;
    const teamScore = marks.slice(0,8).filter(Boolean).length;
    return `${head(button('leave-round','All practice modes','secondary'))}
      <section class="card round-result"><div>${tile(passed ? 'check' : 'target',passed ? 'mint' : 'amber',26)}<h2>${e(title)} complete</h2>
        <p>${passed ? round.reward ? 'You earned ' + round.reward + ' GIS Points.' : 'You’ve already claimed this reward.' : 'Review the answers and try again when you’re ready.'}</p>
        ${round.mode === 'team' ? '<p>Player 1: ' + teamScore + '/8 · Player 2: ' + (score-teamScore) + '/8</p>' : ''}
        <div class="actions">${button('leave-round','Try another round')}${link('gear','Gear shop')}</div></div>
        <div class="round-score"><strong>${score}/${marks.length}</strong><span>correct</span></div>
      </section><details class="card answer-review"><summary>Review round answers</summary>
      ${round.keys.map((key,i) => {
        const {question,lesson} = questionByKey(key);
        return `<article><div class="question-top">${badge('Question ' + (i+1))}${badge(marks[i] ? 'Correct' : 'Needs review',marks[i] ? 'mint' : 'amber')}</div><h3>${e(question.prompt)}</h3><p><strong>Your answer</strong> ${e(round.answers[i])} · <strong>Correct answer</strong> ${e(question.answer)}</p><p>${e(question.why)}</p><a href="#lesson/${lesson.id}">Review ${e(lesson.title.toLowerCase())}</a></article>`;
      }).join('')}</details>`;
  }
  const i = round.index;
  const {question} = questionByKey(round.keys[i]);
  const team = round.mode === 'team';
  const questionNo = team ? (i % 8) + 1 : i + 1;
  return `${head(link('home','Pause round'))}<div class="test-layout">
    <section class="card test-question">
      <div class="question-top">${badge(team ? 'Player ' + (i < 8 ? '1' : '2') : title,mode.tone)}<span>Question ${questionNo} of 8</span></div>
      ${progress(i+(round.answers[i] ? 1 : 0),round.keys.length,'Round questions answered')}
      ${team && i === 8 && !round.answers[i] ? '<p class="turn-notice">Pass the device to Player 2.</p>' : ''}
      <h2 id="active-question" tabindex="-1">${e(question.prompt)}</h2>
      ${answerChoices(shuffle(question,round.keys[i] + ':' + round.seed),round.answers[i],'round-answer')}
      <div class="question-controls"><span></span>${button('round-next',i === round.keys.length-1 ? 'Finish round' : team && i === 7 ? 'Pass to Player 2' : 'Next question','primary',round.answers[i] ? '' : 'disabled')}</div>
    </section>
    <aside class="card side-panel">${tile(mode.icon,mode.tone)}<h2>${e(title)}</h2><p>${mode.description}</p><p>${round.answers.filter(Boolean).length}/${round.keys.length} answered</p>${button('confirm-round','End round','secondary')}</aside></div>`;
}

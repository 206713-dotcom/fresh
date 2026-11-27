export const techniqueTopics = [
  {title:'Comprehension and inference',task:'comprehension',questions:[
    ['A question asks why an event happened. What should you select first?', ['A detail that directly explains the cause','An interesting detail from later in the text','A phrase that repeats the event'],0,'Find the cause the question asks for. Retelling the event leaves the reason unstated.'],
    ['“Leah checked the address again before knocking.” Which inference is most defensible?', ['She definitely knows nobody is home','She wants to make sure she has the right house','She dislikes the person inside'],1,'Checking the address supports uncertainty about the location. Her relationship with the person is unknown.'],
    ['The question asks for two reasons. Which answer is best?', ['Two versions of the same reason','A long quotation containing several unrelated ideas','Two distinct reasons, each clearly stated'],2,'Two differently worded versions of the same point still express one reason.'],
    ['How should you handle an attitude question where the writer shows mixed feelings?', ['Explain both feelings with evidence','Choose the stronger feeling and ignore the other','List the events without interpreting them'],0,'A response can capture nuance by connecting each attitude to a separate detail.'],
  ]},
  {title:'Selective summary',task:'summary',questions:[
    ['The question asks how a library became easier to use. Which detail belongs?', ['Its walls were green','It extended evening opening hours','Its first manager was born in April'],1,'Longer opening hours affect access. The colour and birthday do not answer the question.'],
    ['Which sentence best combines related points?', ['It opens later. It opens on Sundays. It opens on Sundays for longer.','The library is very good for everyone.','Evening and Sunday hours give readers more chances to visit.'],2,'The sentence groups related changes and retains their shared effect without repetition.'],
    ['When using your own words, what matters most?', ['Preserving the original meaning while phrasing it clearly','Replacing every word with a synonym','Making every point more dramatic'],0,'Accurate paraphrasing preserves meaning and can retain technical words when needed.'],
    ['You are over the stated word limit. What should you cut first?', ['The most specific relevant point','Repeated ideas and unnecessary introductions','The evidence that answers the question'],1,'Remove repetition and framing first so you retain as many distinct relevant points as possible.'],
  ]},
  {title:'Writer’s effects',task:'language',questions:[
    ['“The river clawed at the bank.” Which explanation develops the effect?', ['It is personification.','The writer uses strong words.','“Clawed” suggests an animal scraping or tearing, making the flood feel aggressive.'],2,'The explanation identifies a precise word and connects its associations to the threat in the scene.'],
    ['What should you do after choosing a quotation?', ['Explain what the wording means here and what it suggests','Name as many devices as possible','Give a different quotation immediately'],0,'The meaning in context gives you a basis for analysing the effect.'],
    ['Which quotation is most useful for analysing an isolated light?', ['“and then”','“a single lamp shivered”','“they went”'],1,'“Single” isolates the lamp, while “shivered” can suggest movement and vulnerability.'],
    ['Which is the strongest way to finish an explanation?', ['“This makes the reader read on.”','“This is very effective.”','“The fragile movement of the light makes the street feel exposed.”'],2,'The last explanation names the impression and ties it to a particular detail.'],
  ]},
  {title:'Extended response to reading',task:'extended',questions:[
    ['If the prompt asks for a report written as a character, which approach works best?', ['Use a suitable report structure and adapt source details to the character’s perspective','Copy the original story','Write as an outside narrator'],0,'The task tests selection and transformation, so both the form and the assigned perspective matter.'],
    ['What makes an inference appropriate for an extended response?', ['It adds a dramatic event not mentioned in the source','It follows plausibly from a relevant source detail','It repeats the wording of the question'],1,'Develop implications that the source supports. Invented events can undermine accuracy.'],
    ['A task gives three bullet points. How should you plan?', ['Write everything you remember about the first bullet','Treat the bullet points as suggestions you can skip','Allocate relevant ideas to all three bullets before drafting'],2,'Planning across the bullets helps you cover the whole task with relevant detail.'],
    ['Which report recommendation best develops a detail about a hard-to-read depth gauge?', ['Paint a depth marker on the near bank so staff can read it safely','The bridge was closed yesterday','Buy equipment for an unrelated building'],0,'The recommendation turns a source problem into a specific, practical action.'],
  ]},
  {title:'Directed writing and evaluation',task:'directed',questions:[
    ['Which response evaluates a claim about rising visitor numbers?', ['Visitor numbers rose','Higher attendance suggests demand, but the count says little about noise for nearby residents','Both sources mention the market'],1,'Evaluation weighs what the evidence shows and what it cannot establish.'],
    ['When two sources disagree, what should your recommendation do?', ['Summarise one source and dismiss the other','Blend the viewpoints without deciding','Weigh relevant ideas from both and explain the trade-off behind your recommendation'],2,'A reasoned position uses both sources to justify a decision.'],
    ['Which opening suits a formal email to a council?', ['I am writing to recommend a limited trial of the proposed opening hours.','Hey, this idea is obviously great.','Once upon a time, there was a market.'],0,'The first opening addresses the audience and states a clear purpose in an appropriate register.'],
    ['What is a good way to use a short idea from a source?', ['Copy its whole paragraph','Rephrase the relevant idea and explain its importance to your argument','Replace it with a statistic you invented'],1,'Selectivity and development show that you understand the source and can apply it to the task.'],
  ]},
  {title:'Description, narrative and editing',task:'descriptive',questions:[
    ['Which opening best suits a description of an empty hall?', ['I woke up, ate breakfast and drove there.','Today I will explain what halls are used for.','A paper streamer brushed the floor in the draught.'],2,'A focused sensory detail establishes the scene without turning the description into a sequence of events.'],
    ['What gives a short narrative a convincing turning point?', ['A choice that follows from the character’s motives and changes what happens next','An unrelated surprise in the last line','A sudden change of tense'],0,'A turning point is strongest when the decision grows out of the situation and has consequences.'],
    ['Which revision corrects “The rain stopped, the river was still rising”?', ['The rain stopped the river was still rising.','The rain stopped, but the river was still rising.','The rain stopped, the river, was still rising.'],1,'The coordinating conjunction joins two complete clauses and clarifies the contrast.'],
    ['Which is the most purposeful way to vary sentence length?', ['Alternate long and short sentences regardless of meaning','Use the longest sentences you can','Use a short sentence for a decisive moment after a fuller description'],2,'Variation is useful when it changes pace or emphasis where the writing needs it.'],
  ]},
];

export function setupTechniqueQuiz({read,write}) {
  const get = id => document.getElementById(id);
  const select = get('quiz-topic');
  const form = get('technique-form');
  const questions = get('technique-questions');
  const score = get('quiz-score');
  select.replaceChildren(...techniqueTopics.map(({title}, i)=>new Option(title,i)));

  function render() {
    const topic = techniqueTopics[Number(select.value)];
    get('quiz-to-practice').href = '?task='+encodeURIComponent(topic.task)+'#practice';
    questions.replaceChildren(...topic.questions.map(([question,choices],i)=>{
      const field = document.createElement('fieldset');
      const legend = document.createElement('legend');
      legend.textContent = (i+1)+'. '+question;
      field.append(legend);
      choices.forEach((choice,j)=>{
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'technique-'+i;
        input.value = j;
        input.required = true;
        label.append(input,' '+choice);
        field.append(label);
      });
      const explanation = document.createElement('p');
      explanation.className = 'technique-explanation';
      explanation.hidden = true;
      field.append(explanation);
      return field;
    }));
    const best = read('technique-best:'+select.value);
    score.textContent = best === undefined ? '' : 'Best score: '+best+'/'+topic.questions.length+'.';
  }
  select.addEventListener('change',render);
  form.addEventListener('reset',()=>{
    for (const item of questions.querySelectorAll('.technique-explanation')) item.hidden = true;
    score.textContent = '';
  });
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const {questions:items} = techniqueTopics[Number(select.value)];
    const answers = new FormData(form);
    let correct = 0;
    items.forEach(([,choices,answer,reason],i)=>{
      const value = answers.get('technique-'+i);
      const right = value !== null && Number(value) === answer;
      correct += Number(right);
      const entry = questions.children[i].querySelector('.technique-explanation');
      entry.textContent = (right ? 'Correct. ' : 'Answer: '+choices[answer]+'. ') + reason;
      entry.hidden = false;
    });
    const key = 'technique-best:'+select.value;
    const best = Math.max(Number(read(key)) || 0,correct);
    write(key,String(best),null);
    score.textContent = correct+'/'+items.length+' correct. Best score: '+best+'/'+items.length+'.';
  });
  render();
}

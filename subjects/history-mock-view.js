const instructions = {
  1: 'Answer two questions from Section A and one from Section B. Answer every part of each question you choose.',
  2: 'Choose one Core option and answer its five parts. Use details from the documents and relevant historical knowledge.',
  4: 'Choose one question from a depth study and answer both parts.'
};

function slotLimit(paper, section) {
  return paper === '1' && section.id.startsWith('core-') ? 2 : 1;
}

function slotFor(paper, section) {
  return paper === '1' && section.id.startsWith('core-') ? 'core' : 'main';
}

function formatTime(milliseconds) {
  const remaining = Math.max(0, Math.ceil(milliseconds / 1000));
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor(remaining / 60) % 60;
  const seconds = String(remaining % 60).padStart(2, '0');
  return hours ? hours + ':' + String(minutes).padStart(2, '0') + ':' + seconds : minutes + ':' + seconds;
}

export function renderMockExams(exams, state, { element, action, link, reveal, save, topicSelector, writing }) {
  const wrapper = element('div', '', 'history-mock-player');
  const recommended = state.course.year === '2027' && exams.find((exam) => exam.series === state.course.series)?.id;
  const { field, select } = topicSelector(exams.map(({ id, label }) => [id, label]), 'Choose a mock',
    state.mockExam || recommended);
  const output = element('div');
  wrapper.append(field, output);
  let tick;

  function render() {
    clearInterval(tick);
    const exam = exams.find(({ id }) => id === select.value);
    const run = state.mockRuns[exam.id];
    const summary = element('p', exam.minutes + ' minutes · ' + exam.marks + ' marks');
    const instruction = element('p', instructions[exam.paper]);
    output.replaceChildren(summary, instruction);
    if (!run) {
      const actions = element('div', '', 'history-section-links');
      actions.append(
        action('Start timed mock', () => start(exam, true)),
        action('Start untimed mock', () => start(exam, false))
      );
      output.append(actions);
      return;
    }
    if (run.deadline && run.deadline <= Date.now() && !run.finished) {
      run.finished = 'Time is up.';
      save();
    }
    const header = element('div', '', 'history-section-links');
    const status = element('p');
    status.setAttribute('role', 'status');
    const timer = element('time');
    timer.setAttribute('aria-label', 'Time remaining');
    const finish = action('Finish mock and see guidance', () => complete('Mock finished.'));
    if (!run.finished && run.deadline) header.append(timer);
    if (!run.finished) header.append(finish);
    output.append(header, status);
    const groups = [];
    const firstCore = state.course.core || 'A';
    const firstDepth = state.course.depth || 'ww1';

    for (const section of exam.sections) {
      const panel = element('details', '', 'history-mock-section');
      panel.open = section.id === 'core-' + firstCore || section.id === firstDepth ||
        section.groups.some(({ number }) => run.selected.includes(number));
      panel.append(element('summary', section.title));
      for (const group of section.groups) {
        const card = element('section', '', 'history-mock-question');
        const title = element('h4', group.number + '. ' + group.title);
        const label = element('label', '', 'history-mock-choice');
        const checkbox = element('input');
        checkbox.type = 'checkbox';
        checkbox.checked = run.selected.includes(group.number);
        label.append(checkbox, ' Answer question ' + group.number);
        card.append(title, label);
        if (group.context) card.append(element('p', group.context));
        if (group.background) card.append(element('p', group.background));
        if (group.sources) {
          const sourceList = element('details', '', 'history-mock-sources');
          sourceList.append(element('summary', 'Read sources A–' + 'ABCDE'[group.sources.length - 1]));
          for (const [index, [provenance, excerpt, url]] of group.sources.entries()) {
            const figure = element('figure');
            figure.append(element('figcaption', 'Source ' + 'ABCDE'[index] + ' · ' + provenance),
              element('blockquote', excerpt), link('Read original document', url));
            sourceList.append(figure);
          }
          sourceList.append(element('p', 'Source passages are adapted for this mock.'));
          card.append(sourceList);
        }
        const parts = element('ol', '', 'history-mock-parts');
        parts.type = 'a';
        const answers = [];
        const schemes = [];
        for (const { letter, marks, prompt, guidance } of group.parts) {
          const item = element('li');
          const answer = writing('mock-' + exam.id + '-' + group.number + '-' + letter, 'Your answer (' + letter + ')');
          const scheme = reveal('Marking guidance (' + letter + ')', guidance);
          item.append(element('p', prompt + ' [' + marks + ']'), answer, scheme);
          parts.append(item);
          answers.push(answer);
          schemes.push(scheme);
        }
        card.append(parts);
        const slot = slotFor(exam.paper, section);
        const limit = slotLimit(exam.paper, section);
        groups.push({ number: group.number, slot, limit, checkbox, answers, schemes });
        checkbox.addEventListener('change', () => {
          if (checkbox.checked) run.selected.push(group.number);
          else run.selected = run.selected.filter((number) => number !== group.number);
          update();
          save();
        });
        panel.append(card);
      }
      output.append(panel);
    }

    function update() {
      const picked = { core: 0, main: 0 };
      for (const item of groups) {
        if (run.selected.includes(item.number)) picked[item.slot]++;
      }
      for (const item of groups) {
        const selected = run.selected.includes(item.number);
        item.checkbox.disabled = Boolean(run.finished) || (!selected && picked[item.slot] >= item.limit);
        for (const answer of item.answers) {
          answer.hidden = !selected;
          answer.querySelector('textarea').readOnly = Boolean(run.finished);
        }
        for (const scheme of item.schemes) scheme.hidden = !run.finished;
      }
      status.textContent = run.finished ? run.finished + ' Open the marking guidance to review your answers.'
        : exam.paper === '1' ? picked.core + ' of 2 Core questions and ' + picked.main + ' of 1 depth-study question selected.'
          : picked.main + ' of 1 question selected.';
    }

    function complete(message) {
      clearInterval(tick);
      run.finished = message;
      save();
      const returnFocus = header.contains(document.activeElement) && !wrapper.closest('[hidden]');
      header.hidden = true;
      update();
      status.tabIndex = -1;
      if (returnFocus) status.focus();
    }

    function updateTimer() {
      if (!wrapper.isConnected) {
        clearInterval(tick);
        return;
      }
      const remaining = run.deadline - Date.now();
      if (remaining <= 0) {
        complete('Time is up.');
        return;
      }
      timer.textContent = formatTime(remaining);
    }

    update();
    if (!run.finished && run.deadline) {
      timer.textContent = formatTime(run.deadline - Date.now());
      tick = setInterval(updateTimer, 1000);
    }
  }

  function start(exam, timed) {
    state.mockRuns[exam.id] = { selected: [], deadline: timed ? Date.now() + exam.minutes * 60000 : null };
    save();
    render();
    output.querySelector('button').focus();
  }

  select.addEventListener('change', () => {
    state.mockExam = select.value;
    save();
    render();
  });
  render();
  return wrapper;
}

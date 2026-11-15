const ecbizMarking = (() => {
  const banks = new Map();
  function questionBank() {
    if (banks.size) return banks;
    for (const { id, q, marks, case: context, scheme, note, options } of questions) {
      if (!options) banks.set(id, { prompt: q, marks, context, scheme, note });
    }
    revisionPaper2.forEach(({ stimulus, parts }, group) => {
      parts.forEach(([marks, prompt, scheme], part) => {
        banks.set('mock-' + group + '-' + part, { prompt, marks, scheme, context: stimulus, diagram: group === 0 && part === 3 });
      });
    });
    for (const topic of revisionLab.topics) {
      const [answer, reason] = topic.options[topic.answer];
      banks.set('teach-' + topic.code, { prompt: topic.prompt, marks: 2,
        scheme: '1 mark for the stated outcome: ' + answer + ' 1 mark for the economic reasoning: ' + reason });
    }
    return banks;
  }

  const status = document.querySelector('#marking-status');
  const workerURL = new URL('marking-worker.js?v=4', document.currentScript.src);
  const pending = new Map();
  let queue = Promise.resolve();
  let worker;
  let task;
  let nextId = 0;

  async function evaluate(question, answer, image, report) {
    if (!navigator.gpu || typeof Worker !== 'function') {
      throw new Error('On-device marking needs a browser and device with WebGPU. Your answer is still here.');
    }
    if (!worker) {
      worker = new Worker(workerURL, { type: 'module' });
      worker.onmessage = ({ data }) => {
        if (!task || data.id !== task.id) return;
        if (data.progress) task.progress(data.progress);
        else if (data.error) task.reject(new Error(data.error));
        else task.resolve(data.grade);
      };
      worker.onerror = () => {
        task?.reject(new Error('The local marker could not start. Check your connection and try again.'));
      };
      worker.onmessageerror = () => task?.reject(new Error('The local marker returned an unreadable result. Try again.'));
    }
    status.hidden = false;
    let stage = 'Starting the on-device marker…';
    function showProgress(message) {
      stage = message;
      status.textContent = message;
      report?.(message);
    }
    showProgress(stage);
    try {
      return await new Promise((resolve, reject) => {
        const id = ++nextId;
        let idleTimer;
        const idle = () => task.reject(new Error(
          /Marking on|Checking the local marking/.test(stage)
            ? 'The device took too long to mark this answer. Try again with a shorter answer.'
            : 'The local model stopped loading. Check your connection and try again.'
        ));
        const resetIdle = () => {
          clearTimeout(idleTimer);
          idleTimer = setTimeout(idle, /Marking on|Checking the local marking/.test(stage) ? 120000 : 90000);
        };
        const overall = setTimeout(() => task.reject(new Error('The local model took too long. Please try again.')), 300000);
        const settle = (callback, value) => {
          clearTimeout(idleTimer);
          clearTimeout(overall);
          callback(value);
        };
        task = {
          id,
          progress(message) {
            if (stage !== message) resetIdleAfterProgress(message);
          },
          resolve: grade => settle(resolve, grade),
          reject: error => settle(reject, error)
        };
        function resetIdleAfterProgress(message) {
          showProgress(message);
          resetIdle();
        }
        resetIdle();
        try {
          worker.postMessage({ id, question, answer, image });
        } catch (error) {
          task.reject(error);
        }
      });
    } catch (error) {
      worker.terminate();
      worker = undefined;
      throw error;
    } finally {
      task = undefined;
      status.hidden = true;
      status.textContent = '';
    }
  }

  function gradeListedItems(question, answer) {
    // Only unambiguous one-mark-per-item schemes and short lists of named items qualify.
    if (question.marks !== 2 || !/^Identify two\b/i.test(question.prompt)) return;
    const match = /^Award 1 mark each for the ([a-z][a-z -]*?) and the ([a-z][a-z -]*?)\./i.exec(question.scheme);
    if (!match) return;
    const names = match.slice(1).map(name => name.toLowerCase());
    const items = answer.toLowerCase().replace(/[.!?]+$/g, '')
      .replace(/\band\b/g, ',').split(/[,;\n]+/)
      .map(item => item.trim().replace(/^(?:the|a|an)\s+/, '')).filter(Boolean);
    if (!items.length || items.length > 2 || items.some(item => !names.includes(item))) return;
    const credited = [...new Set(items)];
    const remaining = names.filter(name => !credited.includes(name));
    return {
      score: credited.length,
      band: 'point-based',
      credits: credited.map(name => ({ criterion: 'Identified a listed item', evidence: name })),
      feedback: credited.length === 2 ? 'You identified both items in the mark scheme.' : 'You identified one of the two required items.',
      nextStep: remaining.length ? 'The other item in the mark scheme is the ' + remaining[0] + '.' :
        'Keep naming each item as precisely as you did here.'
    };
  }

  function grade(id, answer, image, report) {
    const question = questionBank().get(id);
    const response = answer.trim();
    if (!question?.scheme || response.length > 8000 || (!response && !image) || (image && !question.diagram)) {
      return Promise.reject(new Error('Check the question, answer length or diagram and try again.'));
    }
    const listedGrade = !image && gradeListedItems(question, response);
    if (listedGrade) return Promise.resolve(listedGrade);
    const key = JSON.stringify([id, response, image]);
    if (!pending.has(key)) {
      report?.('Waiting for the on-device marker…');
      const request = queue.then(() => evaluate(question, response, image, report));
      queue = request.catch(() => {});
      pending.set(key, request);
      const clear = () => pending.delete(key);
      request.then(clear, clear);
    }
    return pending.get(key);
  }

  function feedback(result, marks) {
    return '<strong>' + result.score + '/' + marks + ' marks' +
      (result.band && result.band !== 'point-based' ? ' · Band ' + escapeHtml(result.band) : '') +
      '</strong><p>' + escapeHtml(result.feedback) + '</p>' +
      (result.credits?.length ? '<ul>' + result.credits.map(credit =>
        '<li><strong>' + escapeHtml(credit.criterion) + '</strong> · ' +
        escapeHtml(credit.evidence) + '</li>').join('') + '</ul>' : '') +
      (result.nextStep ? '<p><strong>Next step</strong> ' + escapeHtml(result.nextStep) + '</p>' : '');
  }

  function scheme(prompt) {
    return '<details><summary>View mark scheme</summary><div class="mark-scheme">' +
      escapeHtml(prompt.scheme) + '</div>' +
      (prompt.note ? '<p>' + escapeHtml(prompt.note) + '</p>' : '') + '</details>';
  }

  return { grade, feedback, scheme, blank: { score: 0, feedback: 'No answer submitted.' } };
})();

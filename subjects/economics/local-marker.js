const ecbizMarking = (() => {
  const banks = new Map();
  function questionBank() {
    if (banks.size) return banks;
    for (const { id, q, marks, case: context, scheme, note, options } of questions) {
      if (!options) banks.set(id, { prompt: q, marks, context, scheme, note });
    }
    function registerMock(paper) {
      revisionPaper2Groups(paper).forEach(({stimulus, tables, parts}, group) => {
        const tableText = (tables ?? []).map(({caption,headers,rows}) =>
          [caption,headers.join(' | '),...rows.map(row => row.join(' | '))].join('\n')).join('\n\n');
        const context = [stimulus, tableText].filter(Boolean).join('\n\n');
        parts.forEach(({topic, ...question}, part) => {
          banks.set(revisionPaper2Id(paper,group,part), {...question,context});
        });
      });
    }
    registerMock(0);
    for (let paper = 1; paper <= mockPaperCount; paper++) registerMock(paper);
    return banks;
  }

  const status = document.querySelector('#marking-status');
  const trainedMarkerURL = new URL('trained-marker.js?v=14', document.currentScript.src);
  const workerURL = new URL('local-marker-worker.js', document.currentScript.src);
  const pending = new Map();
  let queue = Promise.resolve();
  let worker;
  let task;
  let nextId = 0;

  async function evaluate(question, answer, image, report) {
    if (!image) {
      const progress = message => {
        if (question) {
          status.hidden = false;
          status.textContent = message;
        }
        report?.(message);
      };
      progress(question ? 'Starting the on-device marker…' : 'Preparing model download…');
      try {
        const marker = await import(trainedMarkerURL);
        return await marker.evaluate(question, answer, progress);
      } finally {
        if (question) {
          status.hidden = true;
          status.textContent = '';
        }
      }
    }

    if (!navigator.gpu || typeof Worker !== 'function') {
      throw new Error('On-device marking needs a browser and device with WebGPU. Your answer is still here.');
    }
    if (!worker) {
      worker = new Worker(workerURL, { type: 'module' });
      worker.onmessage = ({ data }) => {
        if (!task || data.id !== task.id) return;
        if (data.progress) task.progress(data.progress);
        else if (data.error) task.reject(new Error(data.error));
        else task.resolve(data.grade ?? data.ready);
      };
      worker.onerror = () => {
        task?.reject(new Error('The local marker could not start. Check your connection and try again.'));
      };
      worker.onmessageerror = () => task?.reject(new Error('The local marker returned an unreadable result. Try again.'));
    }
    status.hidden = false;
    let stage = question ? 'Starting the on-device marker…' : 'Preparing model download…';
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
          worker.postMessage({ id, question, answer, image, loadOnly: !question });
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
      modelResponse: names.map(name => 'The ' + name).join(' and ').replace(' and The ', ' and the ') + '.',
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
      const request = enqueue(async () => {
        const result = await evaluate(question, response, image, report);
        if (!image) return result;
        try {
          const marker = await import(trainedMarkerURL);
          return await marker.review(question, '', result, message => report?.(message));
        } catch {
          return { ...result, reviewUnavailable: true };
        }
      });
      pending.set(key, request);
      const clear = () => pending.delete(key);
      request.then(clear, clear);
    }
    return pending.get(key);
  }

  function enqueue(operation) {
    const request = queue.then(operation);
    queue = request.catch(() => {});
    return request;
  }

  const downloadDialog = document.querySelector('#marking-download');
  const download = document.querySelector('#marking-download-start');
  const downloadStatus = document.querySelector('#marking-download-status');
  const downloadOpeners = document.querySelectorAll('[data-ai-download-open]');
  const setupHint = document.querySelector('#marking-model p');
  for (const opener of downloadOpeners) {
    opener.addEventListener('click', () => downloadDialog.showModal());
  }

  if (!globalThis.WebAssembly || typeof Worker !== 'function') {
    download.setAttribute('aria-disabled', 'true');
    downloadStatus.textContent = 'This browser does not support on-device AI marking.';
  } else {
    download.onclick = async () => {
      if (download.getAttribute('aria-disabled') === 'true') return;
      download.setAttribute('aria-disabled', 'true');
      download.textContent = 'Downloading local AI…';
      downloadStatus.textContent = 'Preparing download…';
      const report = message => { downloadStatus.textContent = message; };
      try {
        await enqueue(() => evaluate(null, '', undefined, report));
        download.textContent = 'Local AI ready';
        downloadStatus.textContent = 'You can now mark written answers on this device.';
        for (const opener of downloadOpeners) opener.textContent = 'Local AI ready';
        setupHint.textContent = 'AI marking is ready for written answers.';
      } catch (error) {
        download.removeAttribute('aria-disabled');
        download.textContent = 'Retry AI download';
        downloadStatus.textContent = error.message;
      }
    };
  }

  function reviewReason(result, answer) {
    if (result.reviewNote) return result.reviewNote;
    if (result.reviewUnavailable || result.modelPlan) return 'The marker could not verify a complete worked example.';
    if (result.diagram && result.provisional) return 'Check the visual assessment against the model diagram and mark scheme.';
    if (result.provisional && result.score>0 && !creditedEvidence(answer,result).length) {
      return 'The marker awarded credit without a verifiable quotation from your answer.';
    }
    return '';
  }

  function feedback(result, marks, answer) {
    const paragraphs = value => value.split(/\n\s*\n/).map(part => '<p>' +
      escapeHtml(part).replace(/\n/g, '<br>') + '</p>').join('');
    const section = (title, value, kind = '') => value ? '<section class="review-section ' + kind + '"><h3>' + title + '</h3>' + paragraphs(value) + '</section>' : '';
    const coaching = result.coaching;
    const evidence = markedEvidence(answer,result);
    const reason = reviewReason(result,answer);
    return '<div class="review-summary"><div><span class="review-eyebrow">Answer review</span><h3>Your feedback</h3>' +
      (result.provisional ? '<span class="review-status">Provisional AI mark</span>' : '') +
      (result.band && result.band !== 'point-based' ? '<span class="review-status">Band ' + escapeHtml(result.band) + '</span>' : '') +
      '</div><div class="review-score"><strong>' + result.score + '<span> / ' + marks + '</span></strong><span>marks</span></div></div>' +
      '<p class="review-overview">' + escapeHtml(result.feedback) + '</p>' +
      (reason?'<p class="mark-review-flag"><strong>Review recommended.</strong> '+escapeHtml(reason)+'</p>':'') +
      (evidence?'<section class="review-section review-evidence">' + evidence + '</section>':'') +
      '<div class="review-coaching">' + section('What worked', coaching?.strengths, 'review-strengths') +
      section('What to improve', coaching?.gaps, 'review-gaps') + '</div>' +
      section('How to reach full marks', result.nextStep || coaching?.next, 'review-next') +
      section(result.diagram ? 'Model diagram instructions' : 'Model response', result.modelResponse, 'review-model') +
      (result.generatedModelResponse ? '<p class="muted">AI-generated example. Check it against the question’s mark scheme.</p>' : '') +
      (result.modelPlan ? '<h3>Mark-scheme answer plan</h3><p>The AI could not verify a complete model response. Use these points to build your answer.</p><div class="mark-scheme">' + escapeHtml(result.modelPlan) + '</div>' : '') +
      (result.reviewUnavailable && !result.modelPlan ? '<p>AI review was unavailable. Use the question’s mark scheme for the required points.</p>' : '') +
      (coaching || result.modelResponse || result.modelPlan ? '<p><a href="https://www.cambridgeinternational.org/Images/718148-2027-2029-syllabus.pdf" target="_blank" rel="noopener noreferrer">Cambridge 0455 syllabus</a> · ' +
        '<a href="https://www.cambridgeinternational.org/Images/718805-2027-specimen-paper-2-mark-scheme.pdf" target="_blank" rel="noopener noreferrer">Cambridge specimen mark scheme</a></p>' : '');
  }

  function scheme(prompt) {
    return '<details><summary>View mark scheme</summary><div class="mark-scheme">' +
      escapeHtml(prompt.scheme) + '</div>' +
      (prompt.note ? '<p>' + escapeHtml(prompt.note) + '</p>' : '') + '</details>';
  }

  return { grade, feedback, scheme, reviewReason, blank: { score: 0, feedback: 'No answer submitted.' } };
})();


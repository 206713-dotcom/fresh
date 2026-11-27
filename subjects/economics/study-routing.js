/* Load exam data and the marking interface only when a study route needs them. */
const economicsScripts = new Map();
function loadEconomicsScript(file) {
  if (!economicsScripts.has(file)) {
    const request = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = new URL('economics/' + file, document.baseURI);
      script.onload = resolve;
      script.onerror = () => {
        script.remove();
        reject(new Error('The required study files could not be loaded.'));
      };
      document.head.append(script);
    }).catch(error => {
      economicsScripts.delete(file);
      throw error;
    });
    economicsScripts.set(file, request);
  }
  return economicsScripts.get(file);
}

let questionBankRequest;
function loadEconomicsQuestions() {
  if (!questionBankRequest) {
    questionBankRequest = (async () => {
      await loadEconomicsScript('study.js?v=20261106-credit-points');
      await loadEconomicsScript('practice-2027.js?v=study-improvements');
      await loadEconomicsScript('exam-practice.js?v=1');
      await loadEconomicsScript('structured-practice.js?v=1');
      questions.push(...examPracticeQuestions);
    })().catch(error => {
      questionBankRequest = undefined;
      throw error;
    });
  }
  return questionBankRequest;
}

let mockBankRequest;
function loadEconomicsMocks() {
  if (!mockBankRequest) {
    mockBankRequest = loadEconomicsQuestions().then(() =>
      Promise.all([
        loadEconomicsScript('mock-paper-1.js?v=1'),
        loadEconomicsScript('mock-paper-2-choices.js?v=1')
      ])
    ).then(() => loadEconomicsScript('mock-paper-2.js?v=study-improvements')).catch(error => {
      mockBankRequest = undefined;
      throw error;
    });
  }
  return mockBankRequest;
}

function loadEconomicsMarker() {
  return loadEconomicsScript('local-marker.js?v=ready-banner-1');
}

const mockDataPages = new Set(['revision-test', 'revision-retry', 'revision-corrections']);
const progressDataPages = new Set(['progress','progress-weak-topics','revision-review','revision-history']);
const markerDataPages = new Set(['revision-test', 'revision-retry', 'revision-writing', 'revision-corrections']);
let economicsRouteRequest = 0;
const economicsLoadingView = document.querySelector('.ecbiz-route-loading').cloneNode(true);
const economicsLoadingLabels = {
  practice: 'Loading practice questions…',
  progress: 'Loading your progress…',
  'progress-weak-topics': 'Loading your progress…',
  'revision-test': 'Loading exam practice…',
  'revision-retry': 'Loading your question…',
  'revision-corrections': 'Loading mock corrections…',
  'revision-history': 'Loading mock history…',
  'revision-writing': 'Loading written-answer review…',
  sources: 'Loading sources…'
};

async function renderEconomicsRoute(focus = false) {
  const version = ++economicsRouteRequest;
  const page = location.hash.slice(1).split('/')[0];
  const pending = [];
  const current = progressDataPages.has(page) ? revisionState('test',null) : null;
  if (mockDataPages.has(page) || (current?.finished && ['p1','p2'].includes(current.mode))) {
    pending.push(loadEconomicsMocks());
  } else if (progressDataPages.has(page) || ['practice','revision-writing','sources'].includes(page)) {
    pending.push(loadEconomicsQuestions());
  }
  if (markerDataPages.has(page)) pending.push(loadEconomicsMarker());
  try {
    if (pending.length) {
      main.after(markingControls);
      markingControls.hidden = true;
      const loading = economicsLoadingView.cloneNode(true);
      loading.querySelector('[data-loading-label]').textContent =
        economicsLoadingLabels[page] || 'Loading revision tools…';
      main.replaceChildren(loading);
      await Promise.all(pending);
    }
    if (version !== economicsRouteRequest) return;
    render();
    if (page === 'progress-weak-topics') {
      const weakTopics = document.querySelector('#progress-weak-topics');
      weakTopics.focus({preventScroll:true});
      weakTopics.scrollIntoView({block:'start'});
      return;
    }
    if (focus) {
      main.focus({preventScroll:true});
      window.scrollTo(0, 0);
    }
  } catch (error) {
    if (version !== economicsRouteRequest) return;
    main.innerHTML = '<div class="wrap"><p role="alert">This study page could not be loaded. Check your connection and try again.</p><button type="button" id="retry-study-route">Try again</button></div>';
    main.querySelector('#retry-study-route').onclick = () => renderEconomicsRoute(true);
  }
}

document.addEventListener('click', async event => {
  if (!event.target.closest('[data-ai-download-open]')) return;
  const dialog = document.querySelector('#marking-download');
  const download = document.querySelector('#marking-download-start');
  const status = document.querySelector('#marking-download-status');
  if (!dialog.open) dialog.showModal();
  if (typeof ecbizMarking !== 'undefined') return;
  download.disabled = true;
  dialog.setAttribute('data-loading', '');
  status.textContent = 'Loading marking settings…';
  try {
    await loadEconomicsMarker();
    if (status.textContent === 'Loading marking settings…') status.textContent = '';
    download.disabled = false;
  } catch {
    status.textContent = 'Marking settings couldn’t load. Close and reopen this window to try again.';
  } finally {
    dialog.removeAttribute('data-loading');
  }
});

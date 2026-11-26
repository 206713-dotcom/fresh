import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const markerPath = new URL('../js/views/ai-marker.js', import.meta.url);
const paper1Path = new URL('../js/views/paper1.js', import.meta.url);
const paper2Path = new URL('../js/views/paper2.js', import.meta.url);
const appPath = new URL('../js/app.js', import.meta.url);

/* Loads the real IIFE with fake wllama/GGUF downloads so the local engine
 * becomes "ready" without pulling the real 610 MB model. */
function loadMarker() {
  const calls = [];
  const partHash = '00'.repeat(32);
  const manifest = Array.from({ length: 13 }, (_, i) => `${partHash}  model.part-${String(i).padStart(2, '0')}`).join('\n');
  const answerFromModel = JSON.stringify({
    question_type: 'paper2_8m_a',
    paragraphs: [{
      paragraph_number: 1,
      role: 'body_point',
      isolated_quote: 'Kestrel introduced job rotation which raised motivation.',
      k_score: 1, app_score: 1, an_score: 1, eval_score: 0,
      critique: 'Uses a case fact and a causal chain.',
    }],
    level_recommendation: 'Level 2',
    overall_critique: 'Add a second developed paragraph.',
  });
  class FakeBlob {
    constructor(parts) { this.parts = parts; }
    arrayBuffer() { return Promise.resolve(new Uint8Array(8).buffer); }
  }
  class FakeWllama {
    setCompat() {}
    loadModel() { return Promise.resolve(); }
    createCompletion() {
      calls.push('generate');
      return Promise.resolve({ choices: [{ text: answerFromModel }] });
    }
    exit() {}
  }
  const EC = {
    esc: v => String(v == null ? '' : v),
    register: () => {},
    store: { get: () => false, set: () => {}, del: () => {} },
    aiCacheKey: () => 'test-cache',
  };
  const sandbox = {
    window: { location: { protocol: 'https:' }, EC },
    document: { getElementById: () => null },
    navigator: { gpu: { requestAdapter: () => Promise.resolve({}) }, userAgent: 'test' },
    localStorage: { setItem: () => {}, getItem: () => null },
    Blob: FakeBlob,
    Uint8Array,
    crypto: { subtle: { digest: () => Promise.resolve(new Uint8Array(32)) } },
    caches: undefined,
    AbortSignal: { timeout: () => undefined },
    fetch: url => Promise.resolve(String(url).endsWith('SHA256SUMS')
      ? { ok: true, text: () => Promise.resolve(manifest) }
      : { ok: true, blob: () => Promise.resolve(new FakeBlob(['part'])) }),
    console,
    setTimeout, clearTimeout, setInterval, clearInterval, Date, Promise, JSON, Object,
    Function: function () {
      return url => String(url).includes('wllama')
        ? Promise.resolve({ Wllama: FakeWllama })
        : Promise.resolve({});
    },
  };
  runInNewContext(readFileSync(markerPath, 'utf8'), sandbox, { filename: markerPath.pathname });
  return { EC, calls };
}

const answer = 'Kestrel introduced job rotation across three stations which raised motivation because the work became more varied. Staff also received a daily praise board so recognition improved and productivity rose. This means absence should fall and output will increase.';
const paper2Info = {
  markValue: 8,
  mark_value: 8,
  questionText: 'Explain two ways Kestrel could improve motivation.',
  questionType: 'paper2_8m_a',
  paper: 2,
  caseMainStem: 'Kestrel makes knitwear. Job rotation changes tasks and a praise board recognises effort.',
  qwen_marking_keys: { valid_app_words: ['job rotation', 'praise board'] },
  validAppWords: ['job rotation', 'praise board'],
};

async function readyMarker() {
  const harness = loadMarker();
  harness.EC.ai.load();
  for (let i = 0; i < 20 && !harness.EC.ai.isReady(); i++) {
    await new Promise(resolve => setTimeout(resolve, 1));
  }
  assert.equal(harness.EC.ai.isReady(), true, 'fake local model should load');
  return harness;
}

test('local engine marks Paper 2 two-argument autoMark calls', async () => {
  const { EC, calls } = await readyMarker();
  const result = await EC.autoMark(answer, paper2Info);
  assert.equal(result.isAiEvaluated, true);
  assert.ok(calls.length > 0, 'the local model should have generated an assessment');
});

test('engine mode toggle switches local and instant marking', async () => {
  const { EC, calls } = await readyMarker();
  assert.equal(EC.ai.getMode(), 'local');
  const before = calls.length;
  assert.equal(EC.ai.setMode('instant'), 'instant');
  const instant = EC.autoMark(answer, paper2Info);
  assert.notEqual(instant.isAiEvaluated, true);
  assert.equal(calls.length, before, 'instant mode must not call the local model');

  EC.ai.setMode('local');
  const local = await EC.autoMark(answer, paper2Info);
  assert.equal(local.isAiEvaluated, true);
  assert.ok(calls.length > before);
});

test('both practice views wire the engine mode buttons', () => {
  const p1 = readFileSync(paper1Path, 'utf8');
  const p2 = readFileSync(paper2Path, 'utf8');
  assert.match(p1, /data-action="instant-examiner"/);
  assert.match(p1, /action === "instant-examiner"/);
  assert.match(p1, /setMode\("instant"\)/);
  assert.match(p2, /data-act="instant-examiner"/);
  assert.match(p2, /case 'instant-examiner'/);
  assert.match(p2, /setMode\('instant'\)/);
  assert.match(p2, /setMode\('local'\)/);
});

test('header and mobile model loaders also select the local engine', () => {
  const app = readFileSync(appPath, 'utf8');
  assert.match(app, /function loadLocalEngine\(\)/);
  assert.match(app, /EC\.ai\.setMode\('local'\)/);
  assert.match(app, /closest\('#mobileAiLoad'\)[\s\S]{0,120}loadLocalEngine\(\)/);
  assert.match(app, /closest\('#aiLoadBtn'\)[\s\S]{0,160}loadLocalEngine\(\)/);
});

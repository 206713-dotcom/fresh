// Learner code runs in a Web Worker using the bundled Pyodide runtime.
const indexURL = new URL('./assets/pyodide/', self.location.href).href;
const outputLimit = 24000;
let runtimePromise;
let stdout;
let stderr;

function collect(stream, line) {
  if (stream.length >= outputLimit) return stream;
  const text = (stream ? stream + '\n' : '') + line;
  return text.length > outputLimit ? text.slice(0, outputLimit) + '\n[Output truncated]' : text;
}

async function loadRuntime() {
  try {
    importScripts(indexURL + 'pyodide.js');
    const py = await loadPyodide({indexURL});
    py.setStdout({batched: line => { stdout = collect(stdout ?? '', line); }});
    py.setStderr({batched: line => { stderr = collect(stderr ?? '', line); }});
    postMessage({type: 'ready'});
    return py;
  } catch (error) {
    postMessage({type: 'load-error', message: String(error.message || error)});
    throw error;
  }
}

function initialize() {
  runtimePromise ??= loadRuntime();
  return runtimePromise;
}

async function evaluate(py, code, globals, filename) {
  const value = await py.runPythonAsync(code, {globals, filename});
  if (value instanceof py.ffi.PyProxy) value.destroy();
}

onmessage = async ({data}) => {
  if (data.type === 'init') {
    // The runner has already reported an initialization failure to the page.
    await initialize().catch(() => {});
    return;
  }
  if (data.type !== 'run') return;

  const {requestId, code, tests} = data;
  let globals;
  stdout = '';
  stderr = '';
  try {
    const py = await initialize();
    globals = py.toPy({});
    postMessage({type: 'running', requestId});
    await evaluate(py, code || '', globals, 'main.py');
    py.runPython('import sys; sys.stdout.flush(); sys.stderr.flush()');

    // Challenge assertions see this run's definitions, never a previous run's.
    const output = stdout;
    const errors = stderr;
    let testsPassed = null;
    if (typeof tests === 'string' && tests.trim()) {
      try {
        await evaluate(py, tests, globals, 'checks.py');
        testsPassed = true;
      } catch {
        testsPassed = false;
      }
    }
    postMessage({type: 'result', requestId, output, errors, testsPassed});
  } catch (error) {
    postMessage({
      type: 'result',
      requestId,
      output: stdout,
      errors: [stderr, String(error.message || error)].filter(Boolean).join('\n')
    });
  } finally {
    globals?.destroy();
  }
};

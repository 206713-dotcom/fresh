let worker;
let pending = false;

export function markHistory(task, answer, onProgress) {
  if (pending) return Promise.reject(new Error('Another answer is being marked. Try again when it finishes.'));
  if (!globalThis.navigator.gpu) {
    return Promise.reject(new Error('AI marking needs a browser and device with WebGPU. Compare your draft with the model answer below.'));
  }
  return new Promise((resolve, reject) => {
    worker ??= new Worker(new URL('./english/marker-worker.mjs?v=practice2', import.meta.url), { type: 'module' });
    pending = true;
    function finish(error, result) {
      clearTimeout(timeout);
      worker.onmessage = null;
      worker.onerror = null;
      pending = false;
      if (error) reject(new Error(error));
      else resolve(result);
    }
    const timeout = setTimeout(() => {
      finish('AI marking timed out. You can try again or use the model answer.');
      worker.terminate();
      worker = undefined;
    }, 300000);
    worker.onmessage = ({ data }) => {
      if (data.progress) onProgress(data.progress);
      else finish(data.error, data.result);
    };
    worker.onerror = () => {
      finish('The AI model could not start. Check your connection and try again, or use the model answer.');
      worker.terminate();
      worker = undefined;
    };
    try {
      worker.postMessage({ task, answer });
    } catch {
      finish('The answer could not be sent to the on-device marker. Try again.');
    }
  });
}

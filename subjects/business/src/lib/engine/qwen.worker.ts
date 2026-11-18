import { pipeline, env, TextStreamer, InterruptableStoppingCriteria } from "@huggingface/transformers";
import type { TextGenerationPipeline } from "@huggingface/transformers";

let grader: TextGenerationPipeline | null = null;
let activeRequestId: number | null = null;

type Request =
  | { id: number; modelId: string }
  | { id: number; systemPrompt: string; userPrompt: string; maxNewTokens: number };

// Background ONNX Runtime / WebGPU rejections that never reach onmessage's try/catch:
// surface them immediately and fail the in-flight request instead of hanging for 90s.
self.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason;
  const message =
    reason instanceof Error
      ? reason.message
      : String(reason ?? "Unknown WebGPU/ONNX background rejection");
  console.error("[QwenWorker] unhandledrejection:", reason);
  if (activeRequestId !== null) {
    self.postMessage({ id: activeRequestId, error: `WebGPU background rejection: ${message}` });
  }
});
self.addEventListener("error", (event) => {
  const message =
    event.error instanceof Error
      ? event.error.message
      : event.message || "Unknown WebGPU worker error";
  console.error("[QwenWorker] error:", event.error ?? event.message);
  if (activeRequestId !== null) {
    self.postMessage({ id: activeRequestId, error: `WebGPU worker error: ${message}` });
  }
});

self.onmessage = async ({ data }: MessageEvent<Request>) => {
  const { id } = data;
  activeRequestId = id;
  try {
    if ("modelId" in data) {
      const loadStart = performance.now();
      env.allowLocalModels = false;
      env.useBrowserCache = true;
      if (env.backends.onnx?.wasm) {
        env.backends.onnx.wasm.proxy = false;
        env.backends.onnx.wasm.numThreads = 1;
      }

      const adapter = await navigator.gpu?.requestAdapter();
      if (!adapter) throw new Error("WebGPU is unavailable in the AI worker.");
      const maxStorageBufferBindingSize = adapter.limits?.maxStorageBufferBindingSize;
      const maxStorageMB =
        typeof maxStorageBufferBindingSize === "number"
          ? Math.floor(maxStorageBufferBindingSize / (1024 * 1024))
          : 0;
      console.log(`[QwenWorker] maxStorageBufferBindingSize: ${maxStorageMB} MB`);
      if (typeof maxStorageBufferBindingSize === "number" && maxStorageBufferBindingSize < 320 * 1024 * 1024) {
        throw new Error(
          `GPU single-buffer limit too small: maxStorageBufferBindingSize is ${maxStorageMB} MB, ` +
            `but the unquantized FP16 vocabulary table alone requires 311 MB. ` +
            `This GPU/driver cannot satisfy the model's single-buffer requirement — use a discrete GPU or update graphics drivers, or fall back to the Instant CIE Examiner.`
        );
      }

      const progress_callback: NonNullable<
        Parameters<typeof pipeline>[2]
      >["progress_callback"] = (progress: any) => self.postMessage({ id, progress });
      // Single self-contained onnx/model_q4f16.onnx (~535 MB) — no external data format needed.
      console.log("[QwenWorker] 1. Loading ONNX session...");
      grader = await pipeline("text-generation", data.modelId, {
        dtype: "q4f16",
        device: "webgpu",
        progress_callback,
        // Forward ONNX Runtime / WebGPU session-creation failures to the main thread.
      }).catch((pipelineErr) => {
        const message =
          pipelineErr instanceof Error ? pipelineErr.message : String(pipelineErr);
        console.error("[QwenWorker] pipeline() failed:", pipelineErr);
        throw new Error(`Failed to load the WebGPU model: ${message}`);
      });
      console.log("[QwenWorker] 2. Model ready");
      console.log(`[QwenWorker] Model ready in ${Math.round(performance.now() - loadStart)}ms`);
      self.postMessage({ id, value: "" });
      return;
    }

    if (!grader) throw new Error("The Qwen WebGPU grader is not loaded yet.");

    const messages = [
      { role: "system" as const, content: data.systemPrompt },
      { role: "user" as const, content: data.userPrompt },
    ];
    // Marking starts inside the JSON object: prefill "{" so the model emits the grading
    // JSON immediately and can never ramble before the root object. The InterruptableStoppingCriteria
    // starts at brace depth 1 (this prefilled "{") and halts at the matching top-level "}".
    const prompt =
      messages
        .map((m) => `<|im_start|>${m.role}\n${m.content}<|im_end|>\n`)
        .join("") + "<|im_start|>assistant\n<think>\n\n</think>\n{";

    const generateStart = performance.now();

    // Stop as soon as the root JSON grading object closes: track brace depth outside of
    // strings while the streamer decodes, and interrupt generation at the final top-level "}".
    let braceDepth = 1; // the assistant prompt prefills the opening "{" of the grading JSON
    let inString = false;
    let escaped = false;
    let rootJsonClosed = false;
    let firstTokenReceived = false;
    const stoppingCriteria = new InterruptableStoppingCriteria();
    const streamer = new TextStreamer(grader.tokenizer, {
      skip_prompt: true,
      skip_special_tokens: true,
      callback_function: (piece: string) => {
        // Lightweight heartbeat so webllm.ts keeps its inactivity timer reset mid-stream.
        self.postMessage({ id, heartbeat: true });
        if (!firstTokenReceived) {
          firstTokenReceived = true;
          console.log("[QwenWorker] 4. First token received");
        }
        if (rootJsonClosed) return;
        for (const ch of piece) {
          if (inString) {
            if (escaped) escaped = false;
            else if (ch === "\\") escaped = true;
            else if (ch === '"') inString = false;
            continue;
          }
          if (ch === '"') {
            inString = true;
          } else if (ch === "{") {
            braceDepth++;
          } else if (ch === "}" && braceDepth > 0) {
            braceDepth--;
            if (braceDepth === 0) {
              rootJsonClosed = true;
              stoppingCriteria.interrupt();
              return;
            }
          }
        }
      },
    });

    console.log("[QwenWorker] 3. Running inference...");
    const output = await grader(prompt, {
      max_new_tokens: Math.max(data.maxNewTokens ?? 750, 750),
      do_sample: false,
      return_full_text: false,
      eos_token_id: [151645, 151643],
      streamer,
      stopping_criteria: stoppingCriteria,
    }).catch((inferenceErr) => {
      const message =
        inferenceErr instanceof Error ? inferenceErr.message : String(inferenceErr);
      console.error("[QwenWorker] grader() failed:", inferenceErr);
      throw new Error(`WebGPU inference failed: ${message}`);
    });
    console.log(`[QwenWorker] Grading finished in ${Math.round(performance.now() - generateStart)}ms`);
    const rawGrading = output[0].generated_text;
    if (typeof rawGrading !== "string") throw new Error("Qwen did not return generated text.");
    // The "{" lives in the prefilled prompt, so put it back on the decoded text.
    const finalOutput = rawGrading.trimStart().startsWith("{") ? rawGrading : `{${rawGrading}`;
    console.log("[QwenWorker] Raw output:", finalOutput);
    self.postMessage({ id, value: finalOutput });
  } catch (error) {
    console.error("[QwenWorker] Request failed:", error);
    self.postMessage({ id, error: error instanceof Error ? error.message : String(error) });
  } finally {
    if (activeRequestId === id) activeRequestId = null;
  }
};

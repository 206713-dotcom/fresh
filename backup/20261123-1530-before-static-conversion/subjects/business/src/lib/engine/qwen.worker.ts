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
      // Versioned browser-cache key: bump this whenever the fine-tuned weights on
      // Hugging Face are replaced, so clients re-download instead of reusing the
      // stale cached model files (Cache API keys are namespaced by this value).
      env.cacheKey = "transformers-cache-0264-v4";
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
      // The browser loads the single-file Transformers.js export onnx/model_q4f16.onnx
      // (~540 MB). The same HF repo also contains the onnxruntime-genai int4 export
      // (genai_config.json + model.onnx + model.onnx.data); that layout is for native
      // inference and is intentionally NOT used by this WebGPU/Transformers.js loader.
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
      // Install the repo's Qwen3 chat template on the tokenizer so apply_chat_template()
      // can render the non-thinking prompt. Transformers.js ignores chat_template.jinja
      // unless it is embedded in tokenizer_config.json, which this repo does not do.
      // A failure here is non-fatal: generation falls back to the equivalent literal.
      try {
        const templateUrl = `https://huggingface.co/${data.modelId}/resolve/main/chat_template.jinja`;
        const response = await fetch(templateUrl);
        if (response.ok) {
          const templateText = await response.text();
          if (grader?.tokenizer) (grader.tokenizer as any).chat_template = templateText;
        }
      } catch (e) {
        console.warn("[QwenWorker] Could not load chat_template.jinja:", e);
      }
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
    //
    // Prefer the repo's real Qwen3 chat template rendered with enable_thinking: false;
    // it yields "<|im_start|>assistant\n<think>\n\n</think>\n\n" (verified against the
    // model's chat_template.jinja). Fall back to that same literal prefix if the
    // template fetch or rendering fails.
    let promptPrefix: string;
    try {
      promptPrefix = (grader.tokenizer as any).apply_chat_template(messages, {
        add_generation_prompt: true,
        enable_thinking: false,
        tokenize: false,
        tools: null,
        documents: null,
      }) as string;
    } catch (e) {
      console.warn("[QwenWorker] apply_chat_template failed; using Qwen3 non-thinking fallback:", e);
      promptPrefix =
        messages
          .map((m) => `<|im_start|>${m.role}\n${m.content}<|im_end|>\n`)
          .join("") + "<|im_start|>assistant\n<think>\n\n</think>\n\n";
    }
    const prompt = promptPrefix + "{";

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

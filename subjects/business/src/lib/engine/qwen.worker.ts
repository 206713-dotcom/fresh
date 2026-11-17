import { pipeline, env, TextStreamer, InterruptableStoppingCriteria } from "@huggingface/transformers";
import type { TextGenerationPipeline } from "@huggingface/transformers";

let grader: TextGenerationPipeline | null = null;

type Request =
  | { id: number; modelId: string }
  | { id: number; systemPrompt: string; userPrompt: string; maxNewTokens: number };

self.onmessage = async ({ data }: MessageEvent<Request>) => {
  const { id } = data;
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
      const progress_callback: NonNullable<
        Parameters<typeof pipeline>[2]
      >["progress_callback"] = (progress: any) => self.postMessage({ id, progress });
      // Single self-contained onnx/model_q4f16.onnx (~535 MB) — no external data format needed.
      grader = await pipeline("text-generation", data.modelId, {
        dtype: "q4f16",
        device: "webgpu",
        progress_callback,
      });
      console.log(`[QwenWorker] Model ready in ${Math.round(performance.now() - loadStart)}ms`);
      self.postMessage({ id, value: "" });
      return;
    }

    if (!grader) throw new Error("The Qwen WebGPU grader is not loaded yet.");

    const messages = [
      { role: "system" as const, content: data.systemPrompt },
      { role: "user" as const, content: data.userPrompt },
    ];
    // tokenizer_config.json for SemiLunarz/qwen3-0.6b-igcse-0264-onnx has no chat_template,
    // so render Qwen3 ChatML directly. The empty <think> block mirrors enable_thinking: false,
    // making the model emit the grading block immediately.
    const prompt =
      messages
        .map((m) => `<|im_start|>${m.role}\n${m.content}<|im_end|>\n`)
        .join("") + "<|im_start|>assistant\n<think>\n\n</think>\n\n";

    const generateStart = performance.now();

    // Stop as soon as the root JSON grading object closes: track brace depth outside of
    // strings while the streamer decodes, and interrupt generation at the final top-level "}".
    let braceDepth = 0;
    let inString = false;
    let escaped = false;
    let rootJsonClosed = false;
    const stoppingCriteria = new InterruptableStoppingCriteria();
    const streamer = new TextStreamer(grader.tokenizer, {
      skip_prompt: true,
      skip_special_tokens: true,
      callback_function: (piece: string) => {
        // Lightweight heartbeat so webllm.ts keeps its inactivity timer reset mid-stream.
        self.postMessage({ id, heartbeat: true });
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

    const output = await grader(prompt, {
      max_new_tokens: data.maxNewTokens,
      do_sample: false,
      return_full_text: false,
      eos_token_id: [151645, 151643],
      streamer,
      stopping_criteria: stoppingCriteria,
    });
    console.log(`[QwenWorker] Grading finished in ${Math.round(performance.now() - generateStart)}ms`);
    const rawGrading = output[0].generated_text;
    if (typeof rawGrading !== "string") throw new Error("Qwen did not return generated text.");
    self.postMessage({ id, value: rawGrading });
  } catch (error) {
    self.postMessage({ id, error: error instanceof Error ? error.message : String(error) });
  }
};

import { pipeline, env } from "@huggingface/transformers";
import type { TextGenerationPipeline } from "@huggingface/transformers";

let grader: TextGenerationPipeline | null = null;

type Request =
  | { id: number; modelId: string }
  | { id: number; systemPrompt: string; userPrompt: string; maxNewTokens: number };

self.onmessage = async ({ data }: MessageEvent<Request>) => {
  const { id } = data;
  try {
    if ("modelId" in data) {
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
      self.postMessage({ id, value: "" });
      return;
    }

    if (!grader) throw new Error("The Qwen WebGPU grader is not loaded yet.");

    const messages = [
      { role: "system" as const, content: data.systemPrompt },
      { role: "user" as const, content: data.userPrompt },
    ];
    const templateOptions = {
      tokenize: false as const,
      add_generation_prompt: true,
      enable_thinking: false,
    };
    const prompt = grader.tokenizer.apply_chat_template(messages, templateOptions);
    if (typeof prompt !== "string") throw new Error("The Qwen chat template did not return text.");

    const output = await grader(prompt, {
      max_new_tokens: 350,
      do_sample: false,
      return_full_text: false,
    });
    const rawGrading = output[0].generated_text;
    if (typeof rawGrading !== "string") throw new Error("Qwen did not return generated text.");
    self.postMessage({ id, value: rawGrading });
  } catch (error) {
    self.postMessage({ id, error: error instanceof Error ? error.message : String(error) });
  }
};

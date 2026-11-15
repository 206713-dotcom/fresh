import { AutoModelForCausalLM, AutoTokenizer, env } from "@huggingface/transformers";

let model: Awaited<ReturnType<typeof AutoModelForCausalLM.from_pretrained>>;
let tokenizer: Awaited<ReturnType<typeof AutoTokenizer.from_pretrained>>;

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
      const dtype = adapter.features.has("shader-f16") ? "q4f16" : "q4";
      const progress_callback: NonNullable<Parameters<typeof AutoTokenizer.from_pretrained>[1]>["progress_callback"] =
        (progress) => self.postMessage({ id, progress });
      tokenizer = await AutoTokenizer.from_pretrained(data.modelId, { progress_callback });
      model = await AutoModelForCausalLM.from_pretrained(data.modelId, {
        dtype,
        device: "webgpu",
        progress_callback,
      });
      self.postMessage({ id, value: "" });
      return;
    }

    const templateOptions = {
      tokenize: false as const,
      add_generation_prompt: true,
      enable_thinking: false,
    };
    const prompt = tokenizer.apply_chat_template([
      { role: "system", content: data.systemPrompt },
      { role: "user", content: data.userPrompt },
    ], templateOptions);
    if (typeof prompt !== "string") throw new Error("The Qwen chat template did not return text.");

    const inputs = tokenizer(prompt, { return_tensor: true });
    let outputs: Awaited<ReturnType<typeof model.generate>> | undefined;
    let generated;
    try {
      outputs = await model.generate({
        ...inputs,
        max_new_tokens: data.maxNewTokens,
        do_sample: false,
        return_dict_in_generate: false,
      });
      if (!("slice" in outputs)) throw new Error("Qwen did not return generated tokens.");
      const promptLength = inputs.input_ids.dims[1];
      if (outputs.dims[1] <= promptLength) throw new Error("Qwen returned an empty assessment.");
      generated = outputs.slice(null, [promptLength, outputs.dims[1]]);
      const [value] = tokenizer.batch_decode(generated, { skip_special_tokens: true });
      self.postMessage({ id, value });
    } finally {
      inputs.input_ids.dispose();
      inputs.attention_mask?.dispose();
      generated?.dispose();
      if (outputs && "dispose" in outputs) outputs.dispose();
    }
  } catch (error) {
    self.postMessage({ id, error: error instanceof Error ? error.message : String(error) });
  }
};

/**
 * WebLLM Browser AI Engine Integration
 * Runs Qwen 2.5 0.5B Instruct locally via WebGPU at $0 server cost
 */

export interface WebLLMStatus {
  isSupported: boolean;
  isLoading: boolean;
  isReady: boolean;
  progressText: string;
  progressPercent: number;
  error: string | null;
}

export type WebLLMProgressCallback = (status: WebLLMStatus) => void;

let engineInstance: any = null;
const SELECTED_MODEL = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";

export async function checkWebGPUSupport(): Promise<boolean> {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  return !!(navigator as any).gpu;
}

export async function initializeWebLLM(
  onProgress?: WebLLMProgressCallback
): Promise<any> {
  if (typeof window === "undefined") return null;

  if (engineInstance) {
    if (onProgress) {
      onProgress({
        isSupported: true,
        isLoading: false,
        isReady: true,
        progressText: "Model cached and ready.",
        progressPercent: 100,
        error: null,
      });
    }
    return engineInstance;
  }

  const supported = await checkWebGPUSupport();
  if (!supported) {
    const errorMsg =
      "WebGPU is not enabled or supported on this browser/hardware. Falling back to the instant CIE Examiner heuristic engine.";
    if (onProgress) {
      onProgress({
        isSupported: false,
        isLoading: false,
        isReady: false,
        progressText: errorMsg,
        progressPercent: 0,
        error: errorMsg,
      });
    }
    return null;
  }

  try {
    if (onProgress) {
      onProgress({
        isSupported: true,
        isLoading: true,
        isReady: false,
        progressText: "Initializing local WebGPU pipeline...",
        progressPercent: 10,
        error: null,
      });
    }

    const webllm = await import("@mlc-ai/web-llm");

    const engine = await webllm.CreateMLCEngine(SELECTED_MODEL, {
      initProgressCallback: (report: any) => {
        const percent = Math.round((report.progress || 0) * 100);
        if (onProgress) {
          onProgress({
            isSupported: true,
            isLoading: percent < 100,
            isReady: percent >= 100,
            progressText: report.text || "Loading Qwen 2.5 0.5B model...",
            progressPercent: percent,
            error: null,
          });
        }
      },
    });

    engineInstance = engine;
    return engine;
  } catch (err: any) {
    console.warn("WebLLM initialization warning:", err);
    if (onProgress) {
      onProgress({
        isSupported: true,
        isLoading: false,
        isReady: false,
        progressText: "Could not load WebGPU model weights.",
        progressPercent: 0,
        error: err?.message || "Failed to initialize WebGPU model",
      });
    }
    return null;
  }
}

export async function evaluateEssayWithWebLLM(
  engine: any,
  systemPrompt: string,
  userPrompt: string
): Promise<string | null> {
  if (!engine) return null;
  try {
    const reply = await engine.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 600,
    });
    return reply.choices[0]?.message?.content || null;
  } catch (e) {
    console.error("WebLLM inference failed:", e);
    return null;
  }
}

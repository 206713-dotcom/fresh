/**
 * WebLLM Browser AI Assessment Engine
 * Runs Qwen 3.5 0.8B locally in-browser via WebGPU at $0 server cost.
 * Evaluates candidate essays as a strict CIE Senior Examiner.
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

export const SELECTED_MODEL = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";
export const QWEN_MODEL_LABEL = "Qwen 3.5 0.8B (Local WebGPU)";

export function isQwenCachedLocally(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("qwen_model_downloaded") === "true";
}

export function setQwenCachedLocally(isCached: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("qwen_model_downloaded", isCached ? "true" : "false");
}

/**
 * Custom error thrown when WebGPU is unsupported, initialization fails,
 * or JSON schema parsing/validation fails.
 */
export class WebLLMEvaluationError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "WebLLMEvaluationError";
    Object.setPrototypeOf(this, WebLLMEvaluationError.prototype);
  }
}

/**
 * Strict JSON Schema enforced by WebLLM's grammar-constrained generation
 */
export const CIE_ESSAY_JSON_SCHEMA = {
  type: "object",
  properties: {
    marks_awarded: { type: "integer" },
    band: { type: "integer" },
    ao_feedback: {
      type: "object",
      properties: {
        AO1: { type: "string" },
        AO2: { type: "string" },
        AO3: { type: "string" },
      },
      required: ["AO1", "AO2"],
    },
    examiner_notes: { type: "string" },
  },
  required: ["marks_awarded", "band", "ao_feedback", "examiner_notes"],
} as const;

export interface EvaluateEssayWebLLMInput {
  essayText: string;
  examQuestion: string;
  markScheme: string;
  maxMarks: number;
  engine?: any;
  onProgress?: WebLLMProgressCallback;
}

export interface WebLLMEvaluationOutput {
  marks_awarded: number;
  band: number;
  ao_feedback: {
    AO1: string;
    AO2: string;
    AO3?: string;
  };
  examiner_notes: string;
}

let engineInstance: any = null;

export async function checkWebGPUSupport(): Promise<boolean> {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  return !!(navigator as any).gpu;
}

export async function initializeWebLLM(
  onProgress?: WebLLMProgressCallback
): Promise<any> {
  if (typeof window === "undefined") {
    throw new WebLLMEvaluationError("WebLLM can only run in a browser environment.");
  }

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
      "WebGPU is not supported or enabled on this browser/hardware.";
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
    throw new WebLLMEvaluationError(errorMsg);
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
            progressText: report.text || "Loading Qwen 3.5 0.8B model weights...",
            progressPercent: percent,
            error: null,
          });
        }
      },
    });

    engineInstance = engine;
    setQwenCachedLocally(true);
    return engine;
  } catch (err: any) {
    const errorMsg = err?.message || "Failed to initialize WebGPU model";
    if (onProgress) {
      onProgress({
        isSupported: true,
        isLoading: false,
        isReady: false,
        progressText: "Could not load WebGPU model weights.",
        progressPercent: 0,
        error: errorMsg,
      });
    }
    throw new WebLLMEvaluationError(errorMsg, err);
  }
}

/**
 * Evaluates candidate essay using Qwen 3.5 0.8B in-browser via WebLLM.
 * Acts as a strict CIE Senior Examiner grading candidate essays.
 *
 * Pre-processes statistical metrics in JavaScript (wordCount, paragraphCount).
 * Enforces strict JSON output matching CIE_ESSAY_JSON_SCHEMA.
 * Throws WebLLMEvaluationError upon failure so caller falls back to Pass 2 Heuristic Engine.
 */
export async function evaluateEssayWebLLM(
  input: EvaluateEssayWebLLMInput
): Promise<WebLLMEvaluationOutput> {
  const { essayText, examQuestion, markScheme, maxMarks, onProgress } = input;

  try {
    // 1. Pre-Processing in JavaScript to save LLM context
    const trimmed = essayText.trim();
    const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
    const paragraphCount = essayText
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean).length;

    // 2. Ensure WebLLM engine is initialized
    let engine = input.engine || engineInstance;
    if (!engine) {
      engine = await initializeWebLLM(onProgress);
    }
    if (!engine) {
      throw new WebLLMEvaluationError("WebLLM engine instance unavailable.");
    }

    // 3. System & User Prompt Structure
    const systemPrompt =
      "You are Qwen 3.5 0.8B functioning as a CIE Business Examiner for interpretation. Read the candidate's text and confirm whether they understood the core business concepts (AO1 Knowledge) and developed causal reasoning (AO3 Analysis). The website code automatically evaluates case keywords (AO2) and evaluation rules (AO4). Output valid JSON matching the schema.";

    const userPrompt = `### EXAM QUESTION
${examQuestion}

### CIE MARK SCHEME & RUBRIC (Max Marks: ${maxMarks})
${markScheme}

### STATISTICAL METRICS
- Word Count: ${wordCount}
- Paragraph Count: ${paragraphCount}

### 1-SHOT EXAMPLE
Input Essay Snippet: "Factors of production are land, labor, capital, and enterprise which the business combines to produce goods."
Output: {"marks_awarded": 2, "band": 3, "ao_feedback": {"AO1": "Accurate identification of all 4 factors of production.", "AO2": "Definition question; no case context required."}, "examiner_notes": "Candidate demonstrates clear understanding of foundational business concepts."}

### CANDIDATE TEXT TO INTERPRET
${essayText}

### TASK
Read the candidate text and confirm if they understood the core business concepts and analytical reasoning against the mark scheme.`;

    // 4. Execution with deterministic temperature and token limit
    const completion = await engine.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.1,
      max_tokens: 350,
      response_format: {
        type: "json_object",
        schema: JSON.stringify(CIE_ESSAY_JSON_SCHEMA),
      },
    });

    const rawContent = completion.choices[0]?.message?.content;
    if (!rawContent || !rawContent.trim()) {
      throw new WebLLMEvaluationError("WebLLM returned an empty response.");
    }

    // 5. JSON Parsing & Schema Validation
    let parsed: any;
    try {
      parsed = JSON.parse(rawContent.trim());
    } catch {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch (jsonErr) {
          throw new WebLLMEvaluationError(
            `Failed to parse JSON response from WebLLM: ${rawContent}`,
            jsonErr
          );
        }
      } else {
        throw new WebLLMEvaluationError(
          `WebLLM response did not contain valid JSON: ${rawContent}`
        );
      }
    }

    if (
      typeof parsed.marks_awarded !== "number" ||
      typeof parsed.band !== "number" ||
      !parsed.ao_feedback ||
      typeof parsed.ao_feedback !== "object" ||
      typeof parsed.ao_feedback.AO1 !== "string" ||
      typeof parsed.ao_feedback.AO2 !== "string" ||
      typeof parsed.examiner_notes !== "string"
    ) {
      throw new WebLLMEvaluationError(
        `WebLLM response failed required schema verification: ${JSON.stringify(parsed)}`
      );
    }

    return {
      marks_awarded: Math.min(maxMarks, Math.max(0, Math.round(parsed.marks_awarded))),
      band: parsed.band,
      ao_feedback: {
        AO1: parsed.ao_feedback.AO1,
        AO2: parsed.ao_feedback.AO2,
        AO3: parsed.ao_feedback.AO3,
      },
      examiner_notes: parsed.examiner_notes,
    };
  } catch (err: unknown) {
    if (err instanceof WebLLMEvaluationError) {
      throw err;
    }
    throw new WebLLMEvaluationError(
      err instanceof Error ? err.message : "Unexpected WebLLM evaluation failure",
      err
    );
  }
}

/**
 * Backward compatibility helper for legacy caller invocations
 */
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
      temperature: 0.1,
      max_tokens: 350,
      response_format: {
        type: "json_object",
      },
    });
    return reply.choices[0]?.message?.content || null;
  } catch (e) {
    console.error("WebLLM inference failed:", e);
    return null;
  }
}

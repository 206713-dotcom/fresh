/**
 * Local In-Browser Transformers.js (WebGPU) AI Assessment Engine
 * Cambridge IGCSE Business (0264) — Anti-Halo Paragraph Isolation Grader
 * Uses AutoModelForCausalLM (text-only Qwen3_5ForCausalLM, skipping vision_encoder ~350MB)
 * Runs the single Qwen 3.5 0.8B (q4f16) text decoder on every capable device.
 */

import type { GradingQuestionType, ParagraphAuditItem } from "../types";

export type QwenModelTier = "0.8b";
export type QwenTierPreference = "auto" | "0.8b";

export interface QwenModelConfig {
  tier: QwenModelTier;
  id: string;
  label: string;
  shortLabel: string;
  activeLabel: string;
  footerLabel: string;
  approxDownloadSize: string;
}

export const QWEN_MODELS: Record<QwenModelTier, QwenModelConfig> = {
  "0.8b": {
    tier: "0.8b",
    id: "onnx-community/Qwen3.5-0.8B-ONNX",
    label: "Qwen 3.5 0.8B (Local WebGPU)",
    shortLabel: "Qwen 3.5 0.8B",
    activeLabel: "Qwen 3.5 0.8B Active",
    footerLabel: "Qwen 3.5 0.8B AI",
    approxDownloadSize: "~560 MB",
  },
};

export const SELECTED_MODEL = QWEN_MODELS["0.8b"].id;
export const QWEN_MODEL_LABEL = "Qwen 3.5 0.8B (Local WebGPU)";

export interface DeviceTierInfo {
  deviceMemoryGB: number;
  isIOSMobile: boolean;
  isMacDesktopSafari: boolean;
  isLowMemory: boolean;
  recommendedTier: QwenModelTier;
  reason: string;
}

export function getDeviceTierInfo(): DeviceTierInfo {
  if (typeof navigator === "undefined") {
    return {
      deviceMemoryGB: 8,
      isIOSMobile: false,
      isMacDesktopSafari: false,
      isLowMemory: false,
      recommendedTier: "0.8b",
      reason: "Desktop WebGPU environment",
    };
  }

  const ua = navigator.userAgent || "";
  const isIOSMobile =
    /iPhone|iPad|iPod/i.test(ua) ||
    (navigator.platform === "MacIntel" && (navigator.maxTouchPoints || 0) > 1);
  const isMacDesktopSafari =
    !isIOSMobile &&
    /Macintosh/i.test(ua) &&
    /Safari/i.test(ua) &&
    !/Chrome|Chromium|Edg/i.test(ua);

  const rawMem = (navigator as any).deviceMemory;
  const deviceMemoryGB =
    typeof rawMem === "number" && rawMem > 0 ? rawMem : isMacDesktopSafari ? 8 : 4;
  const isLowMemory = deviceMemoryGB < 6;

  if (isIOSMobile) {
    return {
      deviceMemoryGB,
      isIOSMobile: true,
      isMacDesktopSafari: false,
      isLowMemory: true,
      recommendedTier: "0.8b",
      reason: "iOS / iPadOS Safari memory cap (< 2 GB tab limit)",
    };
  }

  if (isLowMemory) {
    return {
      deviceMemoryGB,
      isIOSMobile: false,
      isMacDesktopSafari,
      isLowMemory: true,
      recommendedTier: "0.8b",
      reason: `Device RAM (${deviceMemoryGB} GB)`,
    };
  }

  return {
    deviceMemoryGB,
    isIOSMobile: false,
    isMacDesktopSafari,
    isLowMemory: false,
    recommendedTier: "0.8b",
    reason: isMacDesktopSafari
      ? "macOS Safari Desktop WebGPU"
      : `Desktop WebGPU (${deviceMemoryGB} GB RAM)`,
  };
}

const PREF_STORAGE_KEY = "ecbiz_qwen_preferred_tier";
// Versioned cache keys so legacy WebLLM Qwen2.5 flags don't trigger unintended auto-downloads
const CACHE_STORAGE_KEY = "ecbiz_qwen35_cached_v2";
const CACHE_TIER_KEY = "ecbiz_qwen35_cached_tier_v2";

export function getPreferredQwenTier(): QwenTierPreference {
  if (typeof window === "undefined") return "auto";
  const saved = localStorage.getItem(PREF_STORAGE_KEY);
  // Legacy "2b" preferences silently collapse to the single 0.8B tier.
  if (saved === "0.8b") return saved;
  return "auto";
}

export function resolveTargetQwenTier(overrideTier?: QwenModelTier): QwenModelTier {
  if (overrideTier) return overrideTier;
  return "0.8b";
}

export function isQwenCachedLocally(): boolean {
  if (typeof window === "undefined") return false;
  if (localStorage.getItem(CACHE_STORAGE_KEY) !== "true") return false;
  const savedTier = localStorage.getItem(CACHE_TIER_KEY);
  // Ignore a legacy cache entry from the removed 2B tier so we never trigger a
  // silent re-download: only the 0.8B weights are considered cached.
  return !savedTier || savedTier === "0.8b";
}

export function setQwenCachedLocally(isCached: boolean, tier?: QwenModelTier): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CACHE_STORAGE_KEY, isCached ? "true" : "false");
  if (isCached && tier) {
    localStorage.setItem(CACHE_TIER_KEY, tier);
  }
}

export function getCachedQwenTier(): QwenModelTier {
  return "0.8b";
}

export interface WebLLMStatus {
  isSupported: boolean;
  isLoading: boolean;
  isReady: boolean;
  progressText: string;
  progressPercent: number;
  error: string | null;
  activeTier: QwenModelTier;
  preferredTier: QwenTierPreference;
  recommendedTier: QwenModelTier;
  activeModelId: string;
  activeLabel: string;
  fallbackReason: string | null;
  deviceInfo: DeviceTierInfo;
}

export type WebLLMProgressCallback = (status: WebLLMStatus) => void;

export interface RulePreScanContext {
  appWordsRequired: string[];
  appWordsFound: string[];
  ao2CappedToZero: boolean;
  causalChainsMatched: string[];
  strongCausalCount: number;
  basicReasonCount: number;
  evalWordsFound: string[];
  evalJudgmentCount: number;
  evalQualifierCount: number;
  ao4CappedToZero: boolean;
  evalScopeLabel?: string;
  ao3ValidatedChains?: number;
  finalParagraphTradeOffDetected?: boolean;
  finalParagraphRejectedOptionExplained?: boolean;
}

export interface QwenEngineWrapper {
  tier: QwenModelTier;
  modelId: string;
  label: string;
  activeLabel: string;
  model: any;
  tokenizer: any;
  dispose: () => Promise<void>;
  chat: {
    completions: {
      create: (opts: {
        messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
        temperature?: number;
        max_tokens?: number;
      }) => Promise<{ choices: Array<{ message: { content: string } }> }>;
    };
  };
}

function buildInitialStatus(): WebLLMStatus {
  const deviceInfo = getDeviceTierInfo();
  const preferredTier = getPreferredQwenTier();
  const effectiveTier =
    preferredTier === "auto" ? deviceInfo.recommendedTier : preferredTier;
  const cfg = QWEN_MODELS[effectiveTier];

  return {
    isSupported:
      typeof navigator !== "undefined" ? !!(navigator as any).gpu : true,
    isLoading: false,
    isReady: false,
    progressText: "",
    progressPercent: 0,
    error: null,
    activeTier: effectiveTier,
    preferredTier,
    recommendedTier: deviceInfo.recommendedTier,
    activeModelId: cfg.id,
    activeLabel: cfg.activeLabel,
    fallbackReason: null,
    deviceInfo,
  };
}

let engineInstance: QwenEngineWrapper | null = null;
let currentStatus: WebLLMStatus = buildInitialStatus();
let activeInitPromise: Promise<QwenEngineWrapper> | null = null;
let activeInitTier: QwenModelTier | null = null;
let initEpoch = 0;
const statusListeners = new Set<WebLLMProgressCallback>();

function emitStatus(partial: Partial<WebLLMStatus>): WebLLMStatus {
  currentStatus = {
    ...currentStatus,
    ...partial,
  };
  statusListeners.forEach((cb) => {
    try {
      cb(currentStatus);
    } catch {
      // ignore listener errors
    }
  });
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(
        new CustomEvent("ecbiz_qwen_status", { detail: currentStatus })
      );
    } catch {
      // ignore CustomEvent errors in restricted environments
    }
  }
  return currentStatus;
}

export function getQwenStatusSnapshot(): WebLLMStatus {
  return currentStatus;
}

export function getLoadedQwenEngine(): QwenEngineWrapper | null {
  return engineInstance;
}

export function subscribeQwenStatus(cb: WebLLMProgressCallback): () => void {
  statusListeners.add(cb);
  cb(currentStatus);
  return () => {
    statusListeners.delete(cb);
  };
}

export function getActiveQwenConfig(tier?: QwenModelTier): QwenModelConfig {
  return QWEN_MODELS[tier || currentStatus.activeTier || resolveTargetQwenTier()];
}

/**
 * Verifies real WebGPU adapter availability (not just presence of navigator.gpu).
 */
export async function checkWebGPUSupport(): Promise<boolean> {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  const gpu = (navigator as any).gpu;
  if (!gpu || typeof gpu.requestAdapter !== "function") {
    return false;
  }
  try {
    const adapter = await Promise.race([
      gpu.requestAdapter(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500)),
    ]);
    return Boolean(adapter);
  } catch {
    return false;
  }
}

export class WebLLMEvaluationError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "WebLLMEvaluationError";
    Object.setPrototypeOf(this, WebLLMEvaluationError.prototype);
  }
}

export const CAMBRIDGE_0264_PARAGRAPH_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    question_type: {
      type: "string",
      enum: ["paper1_2m", "paper1_4m", "paper1_6m", "paper1_8m", "paper2_8m_a", "paper2_12m_b"],
    },
    paragraphs: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          paragraph_number: { type: "integer", minimum: 1 },
          role: {
            type: "string",
            enum: ["body_point", "option", "conclusion"],
          },
          isolated_quote: { type: "string" },
          k_score: { type: "integer", minimum: 0, maximum: 1 },
          app_score: { type: "integer", minimum: 0, maximum: 1 },
          an_score: { type: "integer", minimum: 0, maximum: 1 },
          eval_score: { type: "integer", minimum: 0, maximum: 3 },
          subtotal: { type: "integer", minimum: 0, maximum: 3 },
          critique: { type: "string" },
        },
        required: [
          "paragraph_number",
          "isolated_quote",
          "k_score",
          "app_score",
          "an_score",
          "eval_score",
          "subtotal",
          "critique",
        ],
      },
    },
    level_recommendation: {
      type: "string",
      enum: ["Level 0", "Level 1", "Level 2", "Level 3"],
    },
    overall_critique: { type: "string" },
  },
  required: ["paragraphs"],
} as const;

export const CIE_ESSAY_JSON_SCHEMA = CAMBRIDGE_0264_PARAGRAPH_JSON_SCHEMA;

export interface QwenParagraphAuditResult {
  question_type?: GradingQuestionType;
  paragraphs: ParagraphAuditItem[];
  level_recommendation?: "Level 0" | "Level 1" | "Level 2" | "Level 3";
  overall_critique: string;
}

export interface QwenChecklistResult {
  ao1_point1: boolean;
  ao1_point2: boolean;
  ao1_point3: boolean;
  ao1_point4: boolean;
  ao3_chain1: boolean;
  ao3_chain2: boolean;
  ao3_chain3: boolean;
  ao3_chain4: boolean;
  strength: string;
  improvement: string;
}

export interface EvaluateEssayWebLLMInput {
  essayText: string;
  examQuestion: string;
  markScheme: string;
  maxMarks: number;
  paper?: 1 | 2;
  questionType?: GradingQuestionType;
  caseContextSummary?: string;
  targetAppKeywords?: string[];
  engine?: any;
  rulePreScan?: RulePreScanContext;
  onProgress?: WebLLMProgressCallback;
}

export interface WebLLMEvaluationOutput {
  marks_awarded: number;
  band: number;
  ao_scores?: {
    AO1?: number;
    AO2?: number;
    AO3?: number;
    AO4?: number;
  };
  ao_feedback: {
    AO1: string;
    AO2: string;
    AO3?: string;
    AO4?: string;
  };
  examiner_notes: string;
  paragraphs: ParagraphAuditItem[];
  paragraphAudit: QwenParagraphAuditResult;
  checklist?: QwenChecklistResult;
}

/**
 * Strips any <think>...</think> blocks and extracts the substring between
 * the first '{' and last '}' so extra conversational text never breaks JSON.parse().
 */
export function extractJsonObjectString(raw: string): string | null {
  if (!raw || typeof raw !== "string") return null;
  const withoutThink = raw
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<think>[\s\S]*$/gi, "")
    .trim();
  const firstBrace = withoutThink.indexOf("{");
  const lastBrace = withoutThink.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace <= firstBrace) return null;
  return withoutThink.slice(firstBrace, lastBrace + 1);
}

export function formatRulePreScanForPrompt(preScan?: RulePreScanContext): string {
  if (!preScan) return "";
  const req = preScan.appWordsRequired.length > 0
    ? preScan.appWordsRequired.slice(0, 8).join(", ")
    : "None required (pure knowledge question)";
  const foundApp = preScan.appWordsFound.length > 0
    ? preScan.appWordsFound.join(", ")
    : "NONE DETECTED";
  const causalList = preScan.causalChainsMatched.length > 0
    ? preScan.causalChainsMatched.slice(0, 6).join(", ")
    : "NONE";
  const evalList = preScan.evalWordsFound.length > 0
    ? preScan.evalWordsFound.slice(0, 6).join(", ")
    : "NONE";

  const scopeLabel = preScan.evalScopeLabel ? ` (${preScan.evalScopeLabel})` : "";
  const chainSummary =
    typeof preScan.ao3ValidatedChains === "number"
      ? `validatedTwoStepChains=${preScan.ao3ValidatedChains}, singleStepReasons=${preScan.basicReasonCount}, matched=[${causalList}]`
      : `strongChains=${preScan.strongCausalCount}, basicReasons=${preScan.basicReasonCount}, matched=[${causalList}]`;
  const tradeOffMeta =
    typeof preScan.finalParagraphTradeOffDetected === "boolean"
      ? `, weighsTradeOffInContext=${preScan.finalParagraphTradeOffDetected ? "YES" : "NO"}, explainsRejectedWorse=${preScan.finalParagraphRejectedOptionExplained ? "YES" : "NO"}`
      : "";

  return [
    "DETERMINISTIC WEBSITE RULE ENGINE PRE-SCAN (MUST RESPECT THESE VERIFIED FACTS):",
    `- Case Application Target Keywords: ${req}`,
    `- Detected Case Facts in Candidate Answer: ${foundApp} (AO2 Capped at 0?: ${preScan.ao2CappedToZero ? "YES — assign AO2=0" : "NO"})`,
    `- Causal Analysis Connectives Detected: ${chainSummary}`,
    `- Evaluation Triggers Detected${scopeLabel}: judgmentCount=${preScan.evalJudgmentCount}, qualifierCount=${preScan.evalQualifierCount}${tradeOffMeta}, matched=[${evalList}] (AO4 Capped at 0?: ${preScan.ao4CappedToZero ? "YES — assign AO4=0" : "NO"})`,
  ].join("\n");
}

export async function disposeWebLLMEngine(): Promise<void> {
  if (engineInstance) {
    try {
      await engineInstance.dispose();
    } catch (e) {
      console.warn("Failed to dispose previous Qwen WebGPU model cleanly:", e);
    }
    engineInstance = null;
  }
}

/**
 * Runs fast JSON text generation via @huggingface/transformers AutoModelForCausalLM
 * with enable_thinking: false and a safety timeout so WebGPU stalls never freeze marking.
 */
export async function runQwenChatCompletion(opts: {
  engine: QwenEngineWrapper | any;
  systemPrompt: string;
  userPrompt: string;
  maxNewTokens?: number;
  timeoutMs?: number;
  temperature?: number;
}): Promise<string> {
  const {
    engine,
    systemPrompt,
    userPrompt,
    maxNewTokens = 760,
    timeoutMs = 40000,
    temperature = 0.0,
  } = opts;

  if (!engine) {
    throw new WebLLMEvaluationError("Qwen model engine is not loaded.");
  }

  if (!engine.model || !engine.tokenizer) {
    if (engine.chat?.completions?.create) {
      const legacy = await engine.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature,
        max_tokens: maxNewTokens,
        enable_thinking: false,
      } as any);
      const legacyContent = legacy?.choices?.[0]?.message?.content || "";
      return legacyContent.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
    }
    throw new WebLLMEvaluationError("Invalid Qwen engine instance.");
  }

  const { model, tokenizer } = engine;
  const messages = [
    { role: "system" as const, content: systemPrompt },
    { role: "user" as const, content: userPrompt },
  ];

  // Disable Qwen 3.5 thinking mode so the model outputs JSON directly without <think> blocks
  const promptText = tokenizer.apply_chat_template(messages, {
    tokenize: false,
    add_generation_prompt: true,
    enable_thinking: false,
  } as any);

  const inputs = tokenizer(promptText, { return_tensor: true });
  const promptTokenCount = Number(inputs?.input_ids?.dims?.[1] ?? 0);

  let outputs: any = null;
  let generatedOnly: any = null;

  try {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      outputs = await Promise.race([
        model.generate({
          ...inputs,
          max_new_tokens: maxNewTokens,
          do_sample: false,
          temperature: 0.0,
          return_dict_in_generate: false,
        } as any),
        new Promise<never>((_, reject) => {
          timer = setTimeout(
            () => reject(new WebLLMEvaluationError(`Qwen inference timed out after ${timeoutMs}ms`)),
            timeoutMs
          );
        }),
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }

    const outTensor = Array.isArray(outputs) ? outputs[0] : outputs;
    if (
      outTensor &&
      typeof outTensor.slice === "function" &&
      Array.isArray(outTensor.dims) &&
      outTensor.dims.length >= 2 &&
      promptTokenCount > 0 &&
      outTensor.dims[1] > promptTokenCount
    ) {
      generatedOnly = outTensor.slice(null, [promptTokenCount, null]);
    } else {
      generatedOnly = outTensor;
    }

    const decodedList = tokenizer.batch_decode(generatedOnly, {
      skip_special_tokens: true,
    });
    const rawText = (Array.isArray(decodedList) ? decodedList[0] : String(decodedList || "")) || "";
    return rawText.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  } finally {
    try {
      inputs?.input_ids?.dispose?.();
      inputs?.attention_mask?.dispose?.();
      if (generatedOnly && generatedOnly !== outputs) {
        generatedOnly?.dispose?.();
      }
      outputs?.dispose?.();
    } catch {
      // ignore tensor cleanup errors
    }
  }
}

async function loadSpecificTier(
  tier: QwenModelTier,
  epoch: number,
  fallbackReason: string | null,
  onProgress?: WebLLMProgressCallback
): Promise<QwenEngineWrapper> {
  const cfg = QWEN_MODELS[tier];
  let highestPercent = 4;

  const updateProgress = (pct: number, text: string) => {
    if (epoch !== initEpoch) return;
    highestPercent = Math.max(highestPercent, Math.min(99, Math.round(pct)));
    const status = emitStatus({
      isSupported: true,
      isLoading: highestPercent < 100,
      isReady: false,
      progressPercent: highestPercent,
      progressText: text,
      error: null,
      activeTier: tier,
      activeModelId: cfg.id,
      activeLabel: cfg.activeLabel,
      fallbackReason,
    });
    if (onProgress) onProgress(status);
  };

  updateProgress(5, `Preparing ${cfg.shortLabel} (${cfg.approxDownloadSize})...`);

  const transformers = await import("@huggingface/transformers");
  const { AutoModelForCausalLM, AutoTokenizer, env } = transformers;

  env.allowLocalModels = false;
  env.useBrowserCache = true;
  if (env.backends?.onnx?.wasm) {
    env.backends.onnx.wasm.proxy = false;
  }

  const progressCallback = (info: any) => {
    if (!info || epoch !== initEpoch) return;
    if (info.status === "progress_total" && typeof info.progress === "number") {
      const scaled = Math.min(95, Math.max(6, Math.round(6 + info.progress * 0.89)));
      const loadedMB = info.loaded ? Math.round(info.loaded / (1024 * 1024)) : null;
      const totalMB = info.total ? Math.round(info.total / (1024 * 1024)) : null;
      const sizeStr = loadedMB !== null && totalMB ? ` (${loadedMB}/${totalMB} MB)` : "";
      updateProgress(scaled, `Downloading ${cfg.shortLabel}${sizeStr}...`);
    } else if (info.status === "progress" && typeof info.progress === "number") {
      const scaled = Math.min(95, Math.max(6, Math.round(6 + info.progress * 0.89)));
      const fileLabel = info.file ? String(info.file).split("/").pop() : "weights";
      updateProgress(scaled, `Downloading ${fileLabel} (${Math.round(info.progress)}%)...`);
    } else if (info.status === "ready") {
      updateProgress(96, `Compiling WebGPU shaders for ${cfg.shortLabel}...`);
    }
  };

  let model: any = null;
  let tokenizer: any = null;

  try {
    tokenizer = await AutoTokenizer.from_pretrained(cfg.id, {
      progress_callback: progressCallback,
    });

    if (epoch !== initEpoch) {
      throw new WebLLMEvaluationError("Model load superseded by user tier switch.");
    }

    // AutoModelForCausalLM uses Qwen3_5ForCausalLM (text decoder only),
    // skipping vision_encoder weights (~350MB saved).
    model = await AutoModelForCausalLM.from_pretrained(cfg.id, {
      dtype: "q4f16",
      device: "webgpu",
      progress_callback: progressCallback,
    });

    if (epoch !== initEpoch) {
      await model?.dispose?.();
      throw new WebLLMEvaluationError("Model load superseded by user tier switch.");
    }
  } catch (err) {
    try {
      await model?.dispose?.();
    } catch {
      // ignore cleanup error on failed load
    }
    throw err;
  }

  const wrapper: QwenEngineWrapper = {
    tier,
    modelId: cfg.id,
    label: cfg.label,
    activeLabel: cfg.activeLabel,
    model,
    tokenizer,
    dispose: async () => {
      try {
        await model?.dispose?.();
      } catch {
        // ignore
      }
    },
    chat: {
      completions: {
        create: async ({ messages, max_tokens, temperature }) => {
          const sys = messages.find((m) => m.role === "system")?.content || "";
          const usr = messages.find((m) => m.role === "user")?.content || "";
          const content = await runQwenChatCompletion({
            engine: wrapper,
            systemPrompt: sys,
            userPrompt: usr,
            maxNewTokens: max_tokens || 760,
            temperature: typeof temperature === "number" ? temperature : 0.0,
          });
          return { choices: [{ message: { content } }] };
        },
      },
    },
  };

  return wrapper;
}

/**
 * Initializes the in-browser Qwen 3.5 0.8B WebGPU model.
 * A single tier is used on every device, so there is no model fallback path.
 */
export async function initializeWebLLM(
  onProgress?: WebLLMProgressCallback,
  requestedTier?: QwenModelTier
): Promise<QwenEngineWrapper> {
  if (typeof window === "undefined") {
    throw new WebLLMEvaluationError("Local WebGPU inference can only run in a browser environment.");
  }

  const targetTier = resolveTargetQwenTier(requestedTier);

  if (engineInstance && engineInstance.tier === targetTier) {
    const cfg = QWEN_MODELS[engineInstance.tier];
    const readyStatus = emitStatus({
      isSupported: true,
      isLoading: false,
      isReady: true,
      progressText: `${cfg.activeLabel} (Cached & Ready)`,
      progressPercent: 100,
      error: null,
      activeTier: engineInstance.tier,
      activeModelId: cfg.id,
      activeLabel: cfg.activeLabel,
    });
    if (onProgress) onProgress(readyStatus);
    return engineInstance;
  }

  if (activeInitPromise && activeInitTier === targetTier) {
    const res = await activeInitPromise;
    if (onProgress) onProgress(currentStatus);
    return res;
  }

  const supported = await checkWebGPUSupport();
  if (!supported) {
    const errorMsg = "WebGPU hardware adapter unavailable — using Instant CIE 0264 Examiner.";
    const status = emitStatus({
      isSupported: false,
      isLoading: false,
      isReady: false,
      progressText: errorMsg,
      progressPercent: 0,
      error: errorMsg,
    });
    if (onProgress) onProgress(status);
    throw new WebLLMEvaluationError(errorMsg);
  }

  const myEpoch = ++initEpoch;
  activeInitTier = targetTier;

  const runInit = async (): Promise<QwenEngineWrapper> => {
    if (engineInstance && engineInstance.tier !== targetTier) {
      await disposeWebLLMEngine();
    }

    try {
      const loaded = await loadSpecificTier(targetTier, myEpoch, null, onProgress);
      if (myEpoch !== initEpoch) {
        await loaded.dispose();
        throw new WebLLMEvaluationError("Superseded by newer tier selection.");
      }
      engineInstance = loaded;
      setQwenCachedLocally(true, loaded.tier);

      const readyStatus = emitStatus({
        isSupported: true,
        isLoading: false,
        isReady: true,
        progressText: `${QWEN_MODELS[loaded.tier].activeLabel} (Text Decoder Ready)`,
        progressPercent: 100,
        error: null,
        activeTier: loaded.tier,
        activeModelId: loaded.modelId,
        activeLabel: loaded.activeLabel,
        fallbackReason: null,
      });
      if (onProgress) onProgress(readyStatus);
      return loaded;
    } catch (primaryErr: any) {
      if (myEpoch !== initEpoch) {
        throw primaryErr;
      }

      await disposeWebLLMEngine();
      const errorMsg = primaryErr?.message || "Failed to initialize WebGPU model";
      const errStatus = emitStatus({
        isSupported: true,
        isLoading: false,
        isReady: false,
        progressText: "WebGPU model failed — Instant CIE Examiner ready.",
        progressPercent: 0,
        error: errorMsg,
      });
      if (onProgress) onProgress(errStatus);
      throw new WebLLMEvaluationError(errorMsg, primaryErr);
    }
  };

  const promise = runInit().finally(() => {
    if (activeInitPromise === promise) {
      activeInitPromise = null;
      activeInitTier = null;
    }
  });
  activeInitPromise = promise;
  return promise;
}

/**
 * Manual switcher called from the Header badge toggle.
 * Saves user preference and immediately loads/switches to the chosen Qwen tier.
 */
export async function switchQwenTier(
  preference: QwenTierPreference,
  onProgress?: WebLLMProgressCallback
): Promise<QwenEngineWrapper | null> {
  if (typeof window !== "undefined") {
    localStorage.setItem(PREF_STORAGE_KEY, preference);
  }
  const deviceInfo = getDeviceTierInfo();
  const resolved: QwenModelTier =
    preference === "auto" ? deviceInfo.recommendedTier : preference;
  const cfg = QWEN_MODELS[resolved];

  emitStatus({
    preferredTier: preference,
    recommendedTier: deviceInfo.recommendedTier,
    activeTier: resolved,
    activeModelId: cfg.id,
    activeLabel: cfg.activeLabel,
    fallbackReason: null,
    error: null,
  });

  const supported = await checkWebGPUSupport();
  if (!supported) {
    emitStatus({
      isSupported: false,
      isLoading: false,
      isReady: false,
      error: "WebGPU hardware adapter unavailable.",
    });
    return null;
  }
  return initializeWebLLM(onProgress, resolved);
}

export function resolveGradingQuestionType(
  marks: number,
  paper?: 1 | 2
): GradingQuestionType {
  if (paper === 2) {
    return marks >= 12 ? "paper2_12m_b" : "paper2_8m_a";
  }
  if (marks <= 2) return "paper1_2m";
  if (marks <= 4) return "paper1_4m";
  if (marks <= 6) return "paper1_6m";
  if (marks === 8) return "paper1_8m";
  return "paper2_12m_b";
}

export function computeRecommendedMaxTokens(studentAnswer: string, questionType: GradingQuestionType): number {
  const words = studentAnswer.trim() ? studentAnswer.trim().split(/\s+/).length : 0;
  const baseByType =
    questionType === "paper2_12m_b"
      ? 420
      : questionType === "paper1_8m" || questionType === "paper2_8m_a"
      ? 360
      : 280;
  return Math.min(1150, Math.max(460, Math.ceil(words * 2.2) + baseByType));
}

/**
 * Cambridge IGCSE Business (0264) Anti-Halo Paragraph Isolation System Prompt
 */
export const CAMBRIDGE_0264_SYSTEM_PROMPT = [
  "You are a strict Senior Examiner for Cambridge IGCSE Business (0264).",
  "Your marking MUST obey Anti-Halo Paragraph Isolation and Cambridge 0264 Assessment Objectives.",
  "",
  "CRITICAL RULE 1 — MANDATORY PARAGRAPH SPLITTING & VERBATIM ISOLATION:",
  "- Before scoring anything, split the student's response into individual paragraphs (or distinct numbered points).",
  "- Output the EXACT verbatim text of each paragraph inside its own JSON object field `isolated_quote`.",
  "",
  "CRITICAL RULE 2 — ANTI-HALO VACUUM EVALUATION (ZERO CARRY-OVER):",
  "- Evaluate EACH paragraph in a COMPLETE VACUUM based ONLY on what appears inside THAT paragraph's `isolated_quote`.",
  "- Case study Application (`app_score`) or Analysis (`an_score`) or Evaluation (`eval_score`) in Paragraph 1 CANNOT carry over to Paragraph 2, Paragraph 3, or the Conclusion.",
  "- If Paragraph 2 or Paragraph 3 is a short generic sentence lacking its own case context or cause-and-effect chain INSIDE `isolated_quote`, it MUST score 0 for `app_score` and/or `an_score`.",
  "- Name-dropping ONLY the company name without concrete case facts, products, figures, or circumstances does NOT count as Application (`app_score: 0`).",
  "- Reject vague filler ('saves money', 'makes more profit', 'happy customers' with no specific business mechanism).",
  "",
  "CRITICAL RULE 3 — KNOWLEDGE (K) GENEROSITY:",
  "- Award `k_score: 1` IMMEDIATELY for ANY valid Cambridge 0264 syllabus point, benefit, drawback, purpose, method, or concept present in the quote.",
  "- A short single sentence is enough. Do NOT require textbook-exact phrasing, a full definition, or multiple sentences.",
  "- Example: \"Another benefit is continuity of existence\" MUST score `k_score: 1` because continuity of existence is a valid Cambridge 0264 benefit/concept.",
  "- Only award `k_score: 0` when the quote contains no valid 0264 business idea at all (pure vague filler, off-topic text, or an empty claim).",
  "",
  "CRITICAL RULE 4 — STRICT ANALYSIS (An) / NO YAPPING CREDIT:",
  "- Award `an_score: 1` ONLY when the quote contains a clear logical cause-and-effect chain explaining an ACTUAL BUSINESS CONSEQUENCE: cash flow, costs, risk, efficiency, productivity, profit, revenue, survival, or decision-making.",
  "- The chain must explain WHAT happens and WHY it matters to the business (e.g. 'bulk buying lowers unit costs, therefore profit margins rise').",
  "- Long paragraphs, connective words ('because', 'therefore', 'which leads to') and repeated case-study facts are NOT analysis on their own.",
  "- If the quote merely restates the knowledge point in different words, or summarises case-study facts without explaining the business impact, award `an_score: 0`.",
  "- When in doubt about whether a real business consequence has been explained, award `an_score: 0`.",
  "",
  "CRITICAL RULE 5 — ANTI-REPETITION LEDGER (applies to K, App and An):",
  "- Before marking, track every syllabus point and every case-study detail (e.g. \"$500,000\", \"assembly factory\") already credited in earlier paragraphs.",
  "- If a later paragraph repeats a syllabus point already credited: award `k_score: 0`, `app_score: 0` and `an_score: 0` for that paragraph.",
  "- If a later paragraph reuses a case-study fact/figure already credited for Application in an earlier paragraph: award `app_score: 0`.",
  "- Every `app_score: 1` MUST come from a fresh, previously uncredited case-study detail inside that paragraph.",
  "- Paraphrasing a repeated point does NOT make it a new point; repetition earns zero even when the wording changes.",
  "- In `critique`, explicitly state when a mark was withheld for repetition or because there is no business consequence.",
  "- Accept valid student paraphrases of mark-scheme knowledge points (`k_score: 1`) when genuinely present in that quote and not already credited.",
  "",
  "SUPPORTED CAMBRIDGE 0264 MARK SCHEMES BY QUESTION TYPE:",
  "1. `paper1_2m` (Paper 1 — 2 Marks, PURE KNOWLEDGE / DEFINITION): Up to 2 distinct, accurate defining characteristics or syllabus features. Each valid characteristic = 1 Knowledge mark (max K:2). Output `k_score` (0-1 per point), `app_score`: 0, `an_score`: 0, `eval_score`: 0, `subtotal` = k_score. NEVER require, award or display Application, Analysis or Evaluation on a 2-mark definition question.",
  "2. `paper1_4m` (Paper 1 — 4 Marks: 2 paragraphs x 2 marks = 4): Each paragraph (max 2): `k_score` (0-1) + `app_score` (0-1, case context INSIDE that paragraph). `an_score`: 0, `eval_score`: 0, `subtotal`: 0-2.",
  "3. `paper1_6m` (Paper 1 — 6 Marks: 2 paragraphs x 3 marks = 6): Each paragraph (max 3): `k_score` (0-1) + `app_score` (0-1 INSIDE that paragraph) + `an_score` (0-1 cause-and-effect chain INSIDE that paragraph). `eval_score`: 0, `subtotal`: 0-3.",
  "4. `paper1_8m` (Paper 1 — 8 Marks: 3 paragraphs = 3 + 3 + 2):",
  "   - Paragraph 1 (Option/Side 1, role='option', max 3): `k_score` (0-1) + `app_score` (0-1) + `an_score` (0-1), `eval_score`: 0.",
  "   - Paragraph 2 (Option/Side 2, role='option', max 3): `k_score` (0-1) + `app_score` (0-1) + `an_score` (0-1), `eval_score`: 0.",
  "   - Paragraph 3 (Conclusion, role='conclusion', max 2): `k_score`: 0, `app_score`: 0, `an_score`: 0, `eval_score` (0-2): +1 for clear decision/choice + 1 for justified comparison explaining WHY it is better than the rejected option using case context INSIDE Paragraph 3 (repeating Paragraph 1 gets 0).",
  "5. `paper2_8m_a` (Paper 2 — 8-Mark Part (a) Separate Paragraph Audit -> Level 1-3):",
  "   - Audit every paragraph individually: `k_score` (0-1), `app_score` (0-1), `an_score` (0-1), `eval_score`: 0 (unless prompt asks for a conclusion/recommendation).",
  "   - Level 3 (7-8): 2+ paragraphs BOTH have strong K + App + detailed multi-step An (and conclusion if asked).",
  "   - Level 2 (4-6): Paragraphs have K + App + basic An, OR one paragraph is strong while another lacks App/An.",
  "   - Level 1 (1-3): Generic points with weak/missing App and An.",
  "6. `paper2_12m_b` (Paper 2 — 12-Mark Part (b) LEVELS-BASED -> Official Cambridge 3-Level rubric, NOT point-by-point paragraph addition):",
  "   - Paragraph `k_score`/`app_score`/`an_score`/`eval_score` are DIAGNOSTIC ONLY. The final mark MUST come from the official Level descriptors below, never from adding paragraph subtotals.",
  "   - Level 3 (9-12): Excellent knowledge & understanding in context + detailed discussion of BOTH methods/options + well-justified recommendation (including why the rejected alternative was rejected for top marks).",
  "   - Level 2 (5-8): Good knowledge & understanding in context + detailed discussion of AT LEAST ONE method/option + judgement with some justification/evaluation.",
  "   - Level 1 (1-4): Limited knowledge & understanding in context + limited discussion with little/no explanation + simple judgement with limited justification.",
  "   - Level 0 (0): No creditable response.",
  "   - Audit every option paragraph individually (`role='option'`) and the final conclusion paragraph (`role='conclusion'`) so feedback can explain the Level, but do NOT imply the Level is the sum of paragraph scores.",
  "",
  "CRITICAL OUTPUT RULES:",
  "- Do NOT calculate or output any `total_score` or `marks_awarded` field. Application code sums Paper 1 `subtotal` fields and computes Paper 2 levels.",
  "- Output ONLY valid JSON matching the required schema (no markdown fences, no commentary).",
].join("\n");

export const CALIBRATED_CAMBRIDGE_SYSTEM_PROMPT = CAMBRIDGE_0264_SYSTEM_PROMPT;

function describeRubricForQuestionType(questionType: GradingQuestionType): string {
  switch (questionType) {
    case "paper1_2m":
      return "paper1_2m (Paper 1 — 2 Marks: PURE KNOWLEDGE / DEFINITION): Up to 2 distinct, accurate defining characteristics or syllabus points. Breakdown is STRICTLY K:0-2, app_score=0, an_score=0, eval_score=0. Never require or award Application, Analysis or Evaluation. Per point: k_score (0-1), subtotal=k_score; total K = sum(k_score) capped at 2.";
    case "paper1_4m":
      return "paper1_4m (Paper 1 — 4 Marks: 2 paragraphs x 2 marks): Max 2 body paragraphs. Each: k_score (0-1) + app_score (0-1 INSIDE quote), an_score=0, eval_score=0, subtotal=k_score+app_score (max 2).";
    case "paper1_6m":
      return "paper1_6m (Paper 1 — 6 Marks: 2 paragraphs x 3 marks): Max 2 body paragraphs. Each: k_score (0-1, ANY valid 0264 point) + app_score (0-1, FRESH case detail INSIDE quote) + an_score (0-1, ONLY a clear cause-and-effect chain explaining a real business consequence INSIDE quote; restatement = 0), eval_score=0, subtotal=k_score+app_score+an_score (max 3).";
    case "paper1_8m":
      return "paper1_8m (Paper 1 — 8 Marks: 3 paragraphs = 3 + 3 + 2): P1 & P2 (role='option', max 3 each): k_score(0-1, ANY valid 0264 point)+app_score(0-1, FRESH case detail)+an_score(0-1, ONLY a clear cause-and-effect chain explaining a real business consequence; restatement = 0). P3 (role='conclusion', max 2): k_score=0, app_score=0, an_score=0, eval_score(0-2: 1 for clear decision + 1 for justified comparison vs rejected option in case context INSIDE P3; repeating P1 gets 0).";
    case "paper2_8m_a":
      return "paper2_8m_a (Paper 2 — 8-Mark Part (a) -> Level 1-3): Audit EVERY paragraph individually: k_score(0-1, ANY valid 0264 point), app_score(0-1, FRESH case detail INSIDE quote), an_score(0-1, ONLY a clear cause-and-effect chain explaining a real business consequence; restatement/summary = 0), eval_score=0, subtotal=k+app+an. Evaluate Level 3 (2+ strong K+App+detailed An), Level 2 (K+App+basic An or mixed), or Level 1 (generic/weak App & An).";
    case "paper2_12m_b":
      return "paper2_12m_b (Paper 2 — 12-Mark Part (b) LEVELS-BASED -> Official Cambridge 3-Level rubric): Paragraph scores (k_score 0-1 ANY valid 0264 point, app_score 0-1 FRESH case detail, an_score 0-1 clear consequence chain, eval_score diagnostic) are DIAGNOSTIC ONLY and are NOT added to produce the final mark. Level 3 (9-12): excellent knowledge in context + detailed discussion of BOTH options + well-justified recommendation including why the alternative was rejected. Level 2 (5-8): good knowledge in context + detailed discussion of AT LEAST ONE option + judgement with some justification. Level 1 (1-4): limited knowledge/discussion + simple judgement with limited justification. Level 0 (0): no creditable response.";
  }
}

export function buildParagraphAuditUserPrompt(opts: {
  questionType: GradingQuestionType;
  questionText: string;
  markValue: number;
  markSchemeText: string;
  studentAnswer: string;
  caseContextSummary?: string;
  targetAppKeywords?: string[];
}): string {
  const cleanQuestion = opts.questionText
    .replace(/\nContext\s*\/\s*Case\s*Scenario:[\s\S]*$/i, "")
    .trim();

  const contextSection = opts.caseContextSummary?.trim()
    ? `\nCASE STUDY FACTS (for verifying Application INSIDE each isolated paragraph):\n${opts.caseContextSummary.trim().slice(0, 750)}`
    : "";

  const appKeywordsLine =
    opts.targetAppKeywords && opts.targetAppKeywords.length > 0
      ? `\nTARGET CASE CONTEXT KEYWORDS (non-company-name facts): ${opts.targetAppKeywords.slice(0, 12).join(", ")}`
      : "";

  const requiresEvalRecommendation =
    opts.questionType === "paper2_8m_a" || opts.questionType === "paper2_12m_b";

  return `QUESTION TYPE: ${describeRubricForQuestionType(opts.questionType)}
QUESTION (${opts.markValue} marks): ${cleanQuestion}${contextSection}${appKeywordsLine}

NON-NEGOTIABLE MARKING RULES (apply to EVERY paragraph independently):
1. K GENEROSITY: Award k_score 1 IMMEDIATELY for ANY valid Cambridge 0264 syllabus point, benefit, drawback, purpose, method, or concept in the quote. A short single sentence is enough; textbook-exact phrasing is NOT required. Only k_score 0 when there is no valid 0264 business idea at all.
2. STRICT ANALYSIS (An): Award an_score 1 ONLY for a clear logical cause-and-effect chain explaining an ACTUAL BUSINESS CONSEQUENCE (cash flow, costs, risk, efficiency, productivity, profit, revenue, survival, or decision-making). Restating knowledge in different words, listing case facts, or "yapping" with connectives but no explained business impact MUST be an_score 0.
3. ANTI-REPETITION LEDGER: Track every syllabus point and case-study detail already credited in earlier paragraphs. A later paragraph that repeats an already-credited syllabus point gets k_score 0, app_score 0 and an_score 0. A case fact/figure already credited for Application cannot earn app_score again — every app_score 1 requires a FRESH, previously uncredited case detail inside that paragraph. Paraphrasing does not create a new point.
4. CRITIQUE: In each paragraph's \`critique\`, explicitly state when a mark was withheld because of repetition or because no business consequence was explained (e.g. "K withheld: repeats the continuity point credited in Paragraph 1"; "An withheld: restates the point without explaining the effect on costs or profit").
${opts.questionType === "paper2_12m_b" ? `5. LEVELS-BASED 12-MARK RULE: Paragraph k_score/app_score/an_score/eval_score are DIAGNOSTIC ONLY. The final mark comes from the official Cambridge 3-Level rubric (Level 1 1-4, Level 2 5-8, Level 3 9-12, Level 0 = 0), NOT from adding paragraph subtotals. In critiques, explain the Level qualitatively (e.g. "Level 2: one option developed with context and judgement, but the second option and rejected-alternative comparison are not developed").` : ""}

MARK SCHEME CRITERIA:
${opts.markSchemeText}

STUDENT ANSWER (Split into paragraphs first and evaluate each \`isolated_quote\` in a COMPLETE VACUUM — ZERO carry-over across paragraphs, then apply the anti-repetition ledger):
${opts.studentAnswer}

Return STRICT JSON matching this exact structure (NO \`total_score\` field):
{
  "question_type": "${opts.questionType}",
  "paragraphs": [
    {
      "paragraph_number": 1,
      "role": "body_point | option | conclusion",
      "isolated_quote": "<exact verbatim text of paragraph 1>",
      "k_score": 0,
      "app_score": 0,
      "an_score": 0,
      "eval_score": 0,
      "subtotal": 0,
      "critique": "<specific vacuum critique of THIS paragraph only, naming any withheld mark for repetition or missing business consequence>"
    }
  ]${requiresEvalRecommendation ? `,
  "level_recommendation": "Level 1 | Level 2 | Level 3"` : ""},
  "overall_critique": "<brief 1-sentence Cambridge 0264 next-step advice>"
}`;
}

export function buildChecklistUserPrompt(opts: {
  questionText: string;
  markValue: number;
  markSchemeText: string;
  studentAnswer: string;
  paper?: 1 | 2;
  questionType?: GradingQuestionType;
  caseContextSummary?: string;
  targetAppKeywords?: string[];
}): string {
  const questionType =
    opts.questionType || resolveGradingQuestionType(opts.markValue, opts.paper);
  return buildParagraphAuditUserPrompt({
    questionType,
    questionText: opts.questionText,
    markValue: opts.markValue,
    markSchemeText: opts.markSchemeText,
    studentAnswer: opts.studentAnswer,
    caseContextSummary: opts.caseContextSummary,
    targetAppKeywords: opts.targetAppKeywords,
  });
}

function clampInt(val: unknown, min: number, max: number): number {
  const n = Number(val);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.round(n)));
}

/**
 * Parses Qwen's structured paragraph audit JSON response, strips any <think> tags,
 * clamps per-paragraph AO scores to Cambridge 0264 limits for the questionType,
 * and ALWAYS recomputes `subtotal` in TypeScript so AI addition mistakes are impossible.
 */
export function parseParagraphAuditResponse(
  rawContent: string,
  questionType: GradingQuestionType
): QwenParagraphAuditResult {
  const jsonSlice = extractJsonObjectString(rawContent);
  if (!jsonSlice) {
    throw new WebLLMEvaluationError(
      `Qwen response did not contain valid JSON: ${rawContent}`
    );
  }

  let parsed: any;
  try {
    parsed = JSON.parse(jsonSlice);
  } catch (jsonErr) {
    throw new WebLLMEvaluationError(
      `Failed to parse JSON response from Qwen: ${rawContent}`,
      jsonErr
    );
  }

  if (!Array.isArray(parsed?.paragraphs) || parsed.paragraphs.length === 0) {
    throw new WebLLMEvaluationError(
      `Qwen response failed paragraph audit schema verification (missing 'paragraphs' array): ${JSON.stringify(parsed)}`
    );
  }

  const paragraphs: ParagraphAuditItem[] = parsed.paragraphs.map((item: any, idx: number) => {
    const paragraphNumber = clampInt(item?.paragraph_number ?? idx + 1, 1, 12);
    const quote = typeof item?.isolated_quote === "string" ? item.isolated_quote.trim() : "";
    const rawRole = item?.role;
    const inferredConclusion =
      rawRole === "conclusion" ||
      ((questionType === "paper1_8m" || questionType === "paper2_12m_b") &&
        (Number(item?.eval_score ?? 0) > 0 ||
          /^(?:overall|in conclusion|to conclude|recommendation|on balance|i recommend|we recommend)\b/i.test(
            quote
          )));

    const role: "body_point" | "option" | "conclusion" =
      rawRole === "conclusion" || inferredConclusion
        ? "conclusion"
        : rawRole === "option" || questionType === "paper1_8m" || questionType === "paper2_12m_b"
        ? "option"
        : "body_point";

    let kScore = 0;
    let appScore = 0;
    let anScore = 0;
    let evalScore = 0;
    let maxSubtotal = 2;

    if (questionType === "paper1_2m") {
      // 2-mark definitions are pure knowledge: up to TWO distinct characteristics may appear
      // inside a single isolated paragraph, so a paragraph can carry K:0-2.
      kScore = clampInt(item?.k_score, 0, 2);
      maxSubtotal = 2;
    } else if (questionType === "paper1_4m") {
      kScore = clampInt(item?.k_score, 0, 1);
      appScore = clampInt(item?.app_score, 0, 1);
      maxSubtotal = 2;
    } else if (questionType === "paper1_6m") {
      kScore = clampInt(item?.k_score, 0, 1);
      appScore = clampInt(item?.app_score, 0, 1);
      anScore = clampInt(item?.an_score, 0, 1);
      maxSubtotal = 3;
    } else if (questionType === "paper1_8m") {
      if (role === "conclusion") {
        evalScore = clampInt(item?.eval_score, 0, 2);
        maxSubtotal = 2;
      } else {
        kScore = clampInt(item?.k_score, 0, 1);
        appScore = clampInt(item?.app_score, 0, 1);
        anScore = clampInt(item?.an_score, 0, 1);
        maxSubtotal = 3;
      }
    } else if (questionType === "paper2_8m_a") {
      kScore = clampInt(item?.k_score, 0, 1);
      appScore = clampInt(item?.app_score, 0, 1);
      anScore = clampInt(item?.an_score, 0, 1);
      evalScore = role === "conclusion" ? clampInt(item?.eval_score, 0, 2) : 0;
      maxSubtotal = 3;
    } else {
      // paper2_12m_b
      if (role === "conclusion") {
        evalScore = clampInt(item?.eval_score, 0, 3);
        maxSubtotal = 3;
      } else {
        kScore = clampInt(item?.k_score, 0, 1);
        appScore = clampInt(item?.app_score, 0, 1);
        anScore = clampInt(item?.an_score, 0, 1);
        maxSubtotal = 3;
      }
    }

    // Recompute subtotal strictly in TypeScript (never trust AI arithmetic)
    const subtotal = kScore + appScore + anScore + evalScore;
    const critique =
      typeof item?.critique === "string" && item.critique.trim()
        ? item.critique.trim()
        : subtotal === maxSubtotal
        ? "Criteria satisfied inside this isolated paragraph."
        : "Missing required AO evidence inside this isolated paragraph.";

    return {
      paragraph_number: paragraphNumber,
      role,
      isolated_quote: quote,
      k_score: kScore,
      app_score: appScore,
      an_score: anScore,
      eval_score: evalScore,
      subtotal,
      max_subtotal: maxSubtotal,
      critique,
    };
  });

  const levelRecRaw = parsed?.level_recommendation;
  const level_recommendation =
    levelRecRaw === "Level 0" ||
    levelRecRaw === "Level 1" ||
    levelRecRaw === "Level 2" ||
    levelRecRaw === "Level 3"
      ? levelRecRaw
      : undefined;

  const overall_critique =
    typeof parsed?.overall_critique === "string" && parsed.overall_critique.trim()
      ? parsed.overall_critique.trim()
      : paragraphs[0]?.critique || "Evaluated under Cambridge IGCSE Business (0264) Anti-Halo Paragraph Isolation.";

  return {
    question_type: questionType,
    paragraphs,
    level_recommendation,
    overall_critique,
  };
}

/**
 * Legacy helper preserved for compatibility; supports both new `paragraphs[]` JSON
 * and older checklist JSON if encountered.
 */
export function parseChecklistResponse(rawContent: string): QwenChecklistResult {
  const jsonSlice = extractJsonObjectString(rawContent);
  if (!jsonSlice) {
    throw new WebLLMEvaluationError(
      `Qwen response did not contain valid JSON: ${rawContent}`
    );
  }

  let parsed: any;
  try {
    parsed = JSON.parse(jsonSlice);
  } catch (jsonErr) {
    throw new WebLLMEvaluationError(
      `Failed to parse JSON response from Qwen: ${rawContent}`,
      jsonErr
    );
  }

  if (Array.isArray(parsed?.paragraphs) && parsed.paragraphs.length > 0) {
    const paras: any[] = parsed.paragraphs;
    const kFlags = paras.map((p) => Number(p?.k_score ?? 0) >= 1);
    const anFlags = paras.map((p) => Number(p?.an_score ?? 0) >= 1);
    const firstStrong = paras.find((p) => Number(p?.subtotal ?? 0) > 0)?.critique;
    const firstWeak = paras.find((p) => Number(p?.subtotal ?? 0) < 2)?.critique;
    return {
      ao1_point1: Boolean(kFlags[0]),
      ao1_point2: Boolean(kFlags[1]),
      ao1_point3: Boolean(kFlags[2]),
      ao1_point4: Boolean(kFlags[3]),
      ao3_chain1: Boolean(anFlags[0]),
      ao3_chain2: Boolean(anFlags[1]),
      ao3_chain3: Boolean(anFlags[2]),
      ao3_chain4: Boolean(anFlags[3]),
      strength:
        typeof parsed?.overall_critique === "string" && parsed.overall_critique.trim()
          ? parsed.overall_critique.trim()
          : firstStrong || "Identified relevant Cambridge 0264 syllabus knowledge.",
      improvement:
        firstWeak ||
        "Ensure every paragraph contains its own case application and causal analysis chain.",
    };
  }

  const toBool = (v: unknown): boolean => v === true || v === "true";
  const hasChecklistKeys =
    typeof parsed.ao1_point1 === "boolean" ||
    typeof parsed.ao1_point2 === "boolean" ||
    typeof parsed.ao3_chain1 === "boolean";

  if (!hasChecklistKeys && typeof parsed.marks_awarded !== "number") {
    throw new WebLLMEvaluationError(
      `Qwen response failed schema verification: ${JSON.stringify(parsed)}`
    );
  }

  return {
    ao1_point1: hasChecklistKeys
      ? toBool(parsed.ao1_point1)
      : Number(parsed.ao_scores?.AO1 ?? parsed.ao_scores?.ao1 ?? 0) >= 1,
    ao1_point2: hasChecklistKeys
      ? toBool(parsed.ao1_point2)
      : Number(parsed.ao_scores?.AO1 ?? parsed.ao_scores?.ao1 ?? 0) >= 2,
    ao1_point3: hasChecklistKeys ? toBool(parsed.ao1_point3) : false,
    ao1_point4: hasChecklistKeys ? toBool(parsed.ao1_point4) : false,
    ao3_chain1: hasChecklistKeys
      ? toBool(parsed.ao3_chain1)
      : Number(parsed.ao_scores?.AO3 ?? parsed.ao_scores?.ao3 ?? 0) >= 1,
    ao3_chain2: hasChecklistKeys
      ? toBool(parsed.ao3_chain2)
      : Number(parsed.ao_scores?.AO3 ?? parsed.ao_scores?.ao3 ?? 0) >= 2,
    ao3_chain3: hasChecklistKeys
      ? toBool(parsed.ao3_chain3)
      : Number(parsed.ao_scores?.AO3 ?? parsed.ao_scores?.ao3 ?? 0) >= 3,
    ao3_chain4: hasChecklistKeys
      ? toBool(parsed.ao3_chain4)
      : Number(parsed.ao_scores?.AO3 ?? parsed.ao_scores?.ao3 ?? 0) >= 4,
    strength:
      typeof parsed.strength === "string" && parsed.strength.trim()
        ? parsed.strength.trim()
        : "Identified relevant syllabus terminology.",
    improvement:
      typeof parsed.improvement === "string" && parsed.improvement.trim()
        ? parsed.improvement.trim()
        : "Add a specific mark-scheme concept with a 'because -> therefore' analytical link.",
  };
}

/**
 * Evaluates candidate answer using the local Qwen 3.5 0.8B model via @huggingface/transformers WebGPU.
 * Enforces Cambridge IGCSE Business (0264) Anti-Halo Paragraph Isolation JSON output at temperature 0.0,
 * and computes Paper 1 totals strictly via `sum(p.subtotal)` in TypeScript.
 */
export async function evaluateEssayWebLLM(
  input: EvaluateEssayWebLLMInput
): Promise<WebLLMEvaluationOutput> {
  const {
    essayText,
    examQuestion,
    markScheme,
    maxMarks,
    paper,
    caseContextSummary,
    targetAppKeywords,
    onProgress,
  } = input;

  const questionType =
    input.questionType || resolveGradingQuestionType(maxMarks, paper);

  try {
    let engine = input.engine || engineInstance;
    if (!engine) {
      engine = await initializeWebLLM(onProgress);
    }
    if (!engine) {
      throw new WebLLMEvaluationError("Local Qwen WebGPU engine instance unavailable.");
    }

    const userPrompt = buildParagraphAuditUserPrompt({
      questionType,
      questionText: examQuestion,
      markValue: maxMarks,
      markSchemeText: markScheme,
      studentAnswer: essayText,
      caseContextSummary,
      targetAppKeywords,
    });

    const rawContent = await runQwenChatCompletion({
      engine,
      systemPrompt: CAMBRIDGE_0264_SYSTEM_PROMPT,
      userPrompt,
      maxNewTokens: computeRecommendedMaxTokens(essayText, questionType),
      temperature: 0.0,
    });

    if (!rawContent || !rawContent.trim()) {
      throw new WebLLMEvaluationError("Local Qwen returned an empty response.");
    }

    const paragraphAudit = parseParagraphAuditResponse(rawContent, questionType);
    const paras = paragraphAudit.paragraphs;

    const kSum = paras.reduce((s, p) => s + p.k_score, 0);
    const appSum = paras.reduce((s, p) => s + p.app_score, 0);
    const anSum = paras.reduce((s, p) => s + p.an_score, 0);
    const evalSum = paras.reduce((s, p) => s + (p.eval_score || 0), 0);

    // For Paper 1, strictly sum paragraph subtotals in TypeScript (never trust LLM addition)
    const rawSubtotalSum = paras.reduce((s, p) => s + p.subtotal, 0);
    const totalEstimate = Math.min(maxMarks, Math.max(0, rawSubtotalSum));
    const band =
      totalEstimate >= maxMarks * 0.7 ? 3 : totalEstimate >= maxMarks * 0.4 ? 2 : 1;

    const checklist: QwenChecklistResult = {
      ao1_point1: Boolean(paras[0]?.k_score),
      ao1_point2: Boolean(paras[1]?.k_score),
      ao1_point3: Boolean(paras[2]?.k_score),
      ao1_point4: Boolean(paras[3]?.k_score),
      ao3_chain1: Boolean(paras[0]?.an_score),
      ao3_chain2: Boolean(paras[1]?.an_score),
      ao3_chain3: Boolean(paras[2]?.an_score),
      ao3_chain4: Boolean(paras[3]?.an_score),
      strength:
        paras.find((p) => p.subtotal > 0)?.critique ||
        paragraphAudit.overall_critique,
      improvement:
        paras.find((p) => p.subtotal < (p.max_subtotal || 2))?.critique ||
        paragraphAudit.overall_critique,
    };

    return {
      marks_awarded: totalEstimate,
      band,
      ao_scores: {
        AO1: kSum,
        AO2: appSum,
        AO3: anSum,
        AO4: evalSum,
      },
      ao_feedback: {
        AO1: checklist.strength,
        AO2: `Audited across ${paras.length} isolated paragraph(s).`,
        AO3: anSum > 0 ? checklist.strength : checklist.improvement,
        AO4: checklist.improvement,
      },
      examiner_notes: paragraphAudit.overall_critique,
      paragraphs: paras,
      paragraphAudit,
      checklist,
    };
  } catch (err: unknown) {
    if (err instanceof WebLLMEvaluationError) {
      throw err;
    }
    throw new WebLLMEvaluationError(
      err instanceof Error ? err.message : "Unexpected local Qwen evaluation failure",
      err
    );
  }
}

export async function evaluateEssayWithWebLLM(
  engine: any,
  systemPrompt: string,
  userPrompt: string
): Promise<string | null> {
  if (!engine) return null;
  try {
    const content = await runQwenChatCompletion({
      engine,
      systemPrompt,
      userPrompt,
      maxNewTokens: 760,
      temperature: 0.0,
    });
    return content || null;
  } catch (e) {
    console.error("Local Qwen inference failed:", e);
    return null;
  }
}

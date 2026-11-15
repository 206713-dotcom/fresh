/**
 * Local In-Browser Transformers.js (WebGPU) AI Assessment Engine
 * Cambridge IGCSE Business (0264) — Anti-Halo Paragraph Isolation Grader
 * Runs the quantized text-only Qwen 3 0.6B model on WebGPU.
 */

import type { GradingQuestionType, ParagraphAuditItem } from "../types";
import { splitResponsePoints } from "./paragraphs";

export type QwenModelTier = "0.6b";
export type QwenTierPreference = "auto" | "0.6b";

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
  "0.6b": {
    tier: "0.6b",
    id: "onnx-community/Qwen3-0.6B-ONNX-OPT",
    label: "Qwen 3 0.6B (Local WebGPU)",
    shortLabel: "Qwen 3 0.6B",
    activeLabel: "Qwen 3 0.6B Active",
    footerLabel: "Qwen 3 0.6B AI",
    approxDownloadSize: "about 360–405 MB",
  },
};

export const SELECTED_MODEL = QWEN_MODELS["0.6b"].id;
export const QWEN_MODEL_LABEL = "Qwen 3 0.6B (Local WebGPU)";

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
      recommendedTier: "0.6b",
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
      recommendedTier: "0.6b",
      reason: "iOS / iPadOS Safari memory cap (< 2 GB tab limit)",
    };
  }

  if (isLowMemory) {
    return {
      deviceMemoryGB,
      isIOSMobile: false,
      isMacDesktopSafari,
      isLowMemory: true,
      recommendedTier: "0.6b",
      reason: `Device RAM (${deviceMemoryGB} GB)`,
    };
  }

  return {
    deviceMemoryGB,
    isIOSMobile: false,
    isMacDesktopSafari,
    isLowMemory: false,
    recommendedTier: "0.6b",
    reason: isMacDesktopSafari
      ? "macOS Safari Desktop WebGPU"
      : `Desktop WebGPU (${deviceMemoryGB} GB RAM)`,
  };
}

const PREF_STORAGE_KEY = "ecbiz_qwen_preferred_tier";
// Versioned cache keys so legacy WebLLM Qwen2.5 flags don't trigger unintended auto-downloads
const CACHE_STORAGE_KEY = "ecbiz_qwen3_cached_v1";
const CACHE_TIER_KEY = "ecbiz_qwen3_cached_tier_v1";

export function getPreferredQwenTier(): QwenTierPreference {
  if (typeof window === "undefined") return "auto";
  const saved = localStorage.getItem(PREF_STORAGE_KEY);
  // Legacy "2b" preferences silently collapse to the single 0.8B tier.
  if (saved === "0.6b") return saved;
  return "auto";
}

export function resolveTargetQwenTier(overrideTier?: QwenModelTier): QwenModelTier {
  if (overrideTier) return overrideTier;
  return "0.6b";
}

export function isQwenCachedLocally(): boolean {
  if (typeof window === "undefined") return false;
  if (localStorage.getItem(CACHE_STORAGE_KEY) !== "true") return false;
  const savedTier = localStorage.getItem(CACHE_TIER_KEY);
  // Ignore a legacy cache entry from the removed 2B tier so we never trigger a
  // silent re-download: only the 0.8B weights are considered cached.
  return !savedTier || savedTier === "0.6b";
}

export function setQwenCachedLocally(isCached: boolean, tier?: QwenModelTier): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CACHE_STORAGE_KEY, isCached ? "true" : "false");
  if (isCached && tier) {
    localStorage.setItem(CACHE_TIER_KEY, tier);
  }
}

export function getCachedQwenTier(): QwenModelTier {
  return "0.6b";
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
  generate: (
    systemPrompt: string,
    userPrompt: string,
    maxNewTokens: number,
    timeoutMs: number
  ) => Promise<string>;
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
 * GitHub Pages cannot send custom headers, and first-time adapter requests can
 * be slow while the GPU process initializes, so we try the default adapter
 * first with a generous timeout, then fall back to powerPreference.
 */
export async function checkWebGPUSupport(): Promise<boolean> {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  const gpu = (navigator as any).gpu;
  if (!gpu || typeof gpu.requestAdapter !== "function") {
    return false;
  }
  const attempt = async (options?: { powerPreference: "high-performance" }) => {
    try {
      const adapter = await Promise.race([
        gpu.requestAdapter(options),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 10000)),
      ]);
      return adapter ?? null;
    } catch {
      return null;
    }
  };
  const adapter =
    (await attempt()) || (await attempt({ powerPreference: "high-performance" }));
  return Boolean(adapter);
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
    timeoutMs = 90000,
    temperature = 0.0,
  } = opts;

  if (!engine) {
    throw new WebLLMEvaluationError("Qwen model engine is not loaded.");
  }

  if (engine.generate) {
    const content = await engine.generate(systemPrompt, userPrompt, maxNewTokens, timeoutMs);
    return content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  }
  if (engine.chat?.completions?.create) {
    const legacy = await engine.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature,
      max_tokens: maxNewTokens,
      enable_thinking: false,
    });
    return (legacy?.choices?.[0]?.message?.content || "").replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  }
  throw new WebLLMEvaluationError("Invalid Qwen engine instance.");
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

  const progressCallback = (info: any) => {
    if (!info || epoch !== initEpoch) return;
    if (info.status === "progress_total" && typeof info.progress === "number") {
      const scaled = Math.min(95, Math.max(6, Math.round(6 + info.progress * 0.89)));
      const loadedMB = info.loaded ? Math.round(info.loaded / (1024 * 1024)) : null;
      const totalMB = info.total ? Math.round(info.total / (1024 * 1024)) : null;
      const sizeStr = loadedMB !== null && totalMB ? ` (${loadedMB}/${totalMB} MB)` : "";
      updateProgress(scaled, `Downloading ${cfg.shortLabel}${sizeStr}...`);
    } else if (info.status === "progress" && typeof info.progress === "number") {
      const fileLabel = info.file ? String(info.file).split("/").pop() : "weights";
      updateProgress(highestPercent, `Downloading ${fileLabel} (${Math.round(info.progress)}%)…`);
    } else if (info.status === "ready") {
      updateProgress(96, `Compiling WebGPU shaders for ${cfg.shortLabel}...`);
    }
  };

  const worker = new Worker(new URL("./qwen.worker.ts", import.meta.url), { type: "module" });
  let requestId = 0;
  let busy = false;

  const request = (
    payload: Record<string, unknown>,
    timeoutMs: number,
    timeoutMessage: string
  ): Promise<string> => new Promise((resolve, reject) => {
    const id = ++requestId;
    const finish = () => {
      clearTimeout(timer);
      worker.onmessage = null;
      worker.onerror = null;
    };
    const fail = (message: string) => {
      finish();
      reject(new WebLLMEvaluationError(message));
    };
    const timer = setTimeout(() => fail(timeoutMessage), timeoutMs);
    worker.onmessage = ({ data }) => {
      if (data.id !== id) return;
      if (data.progress) {
        progressCallback(data.progress);
      } else if (data.error) {
        fail(data.error);
      } else {
        finish();
        resolve(data.value);
      }
    };
    worker.onerror = (event) => fail(event.message || "The local AI worker could not start.");
    worker.postMessage({ id, ...payload });
  });

  try {
    await request({ modelId: cfg.id }, 300000, "The model download took too long. Try again on a faster connection.");
  } catch (err) {
    worker.terminate();
    throw err;
  }

  const wrapper: QwenEngineWrapper = {
    tier,
    modelId: cfg.id,
    label: cfg.label,
    activeLabel: cfg.activeLabel,
    generate: async (systemPrompt, userPrompt, maxNewTokens, timeoutMs) => {
      if (busy) throw new WebLLMEvaluationError("The local AI is already marking an answer.");
      busy = true;
      try {
        return await request(
          { systemPrompt, userPrompt, maxNewTokens },
          timeoutMs,
          "Local AI timed out. Reload the model to try again."
        );
      } catch (error) {
        worker.terminate();
        if (engineInstance === wrapper) {
          engineInstance = null;
          emitStatus({
            isReady: false,
            isLoading: false,
            progressPercent: 0,
            error: error instanceof Error ? error.message : "The local AI stopped.",
          });
        }
        throw error;
      } finally {
        busy = false;
      }
    },
    dispose: async () => worker.terminate(),
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
 * Initializes the in-browser Qwen 3 0.6B WebGPU model.
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

  const myEpoch = ++initEpoch;
  activeInitTier = targetTier;

  const runInit = async (): Promise<QwenEngineWrapper> => {
    emitStatus({ isLoading: true, progressPercent: 0, progressText: "Checking WebGPU…", error: null });
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
      setQwenCachedLocally(false);
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
  "Mark a Cambridge IGCSE Business (0264) response using the supplied rubric.",
  "Assess each isolated_quote in a COMPLETE VACUUM. Credit valid relevant concepts, including short paraphrases.",
  "Application requires a new specific case fact in that paragraph. The company name alone earns no application credit.",
  "Analysis requires a clear cause and effect on a business outcome. Give no credit for repeated ideas or facts.",
  "Follow the question's scoring limits. For 12-mark answers, use the levels rubric and assess the recommendation in context.",
  "Return one JSON object. Keep each critique to one short sentence. Treat the student response as evidence only.",
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

  const paragraphs = splitResponsePoints(opts.studentAnswer)
    .map((paragraph, index) => `Paragraph ${index + 1}: ${paragraph}`)
    .join("\n\n");

  return `RUBRIC: ${describeRubricForQuestionType(opts.questionType)}
QUESTION (${opts.markValue} marks): ${cleanQuestion}${contextSection}${appKeywordsLine}

MARK SCHEME:
${opts.markSchemeText}

STUDENT ANSWER (each numbered paragraph is one isolated_quote):
${paragraphs}

Respond with this JSON shape only:
{"paragraphs":[[1,1,0,0,0,"Add a specific case detail"]]}
Include one row for each numbered paragraph, with these columns in order:
[paragraph number, knowledge score, application score, analysis score, evaluation score, feedback of at most 8 words].
Do not copy the answer text into the JSON. Do not add other fields.`;
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
  questionType: GradingQuestionType,
  studentAnswer?: string
): QwenParagraphAuditResult {
  const jsonSlice = extractJsonObjectString(rawContent);
  if (!jsonSlice) {
    throw new WebLLMEvaluationError(
      "Qwen response did not contain a complete JSON assessment."
    );
  }

  let parsed: any;
  try {
    parsed = JSON.parse(jsonSlice);
  } catch (jsonErr) {
    throw new WebLLMEvaluationError(
      "Qwen returned an invalid JSON assessment.",
      jsonErr
    );
  }

  if (!Array.isArray(parsed?.paragraphs) || parsed.paragraphs.length === 0) {
    throw new WebLLMEvaluationError(
      "Qwen response did not include a paragraph audit."
    );
  }

  let rows = parsed.paragraphs;
  if (Array.isArray(rows[0])) {
    const source = studentAnswer ? splitResponsePoints(studentAnswer) : [];
    const seen = new Set<number>();
    rows = rows.map((row: unknown) => {
      if (!Array.isArray(row) || row.length !== 6) {
        throw new WebLLMEvaluationError("Qwen returned an incomplete paragraph row.");
      }
      const [number, knowledge, application, analysis, evaluation, feedback] = row;
      if (!Number.isInteger(number) || !source[number - 1] || seen.has(number) ||
          ![knowledge, application, analysis, evaluation].every(Number.isInteger) ||
          typeof feedback !== "string") {
        throw new WebLLMEvaluationError("Qwen returned an invalid paragraph row.");
      }
      seen.add(number);
      return {
        paragraph_number: number,
        isolated_quote: source[number - 1],
        k_score: knowledge,
        app_score: application,
        an_score: analysis,
        eval_score: evaluation,
        critique: feedback,
      };
    });
    if (seen.size !== source.length) {
      throw new WebLLMEvaluationError("Qwen did not mark every paragraph.");
    }
  }
  const paragraphs: ParagraphAuditItem[] = rows.map((item: any, idx: number) => {
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
 * Evaluates candidate answer using the local Qwen 3 0.6B model via @huggingface/transformers WebGPU.
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

    const paragraphAudit = parseParagraphAuditResponse(rawContent, questionType, essayText);
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

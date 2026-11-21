import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  awardBonusStudyCoins,
  deductStudyCoins,
  loadSubmissions,
  getStudyCoins,
  loadCustomizerState,
  saveCustomizerState,
  CharacterCustomizationState,
} from "../lib/cookies";
import { MCQ_BANK, MCQItem } from "../lib/data/mcq-bank";
import {
  getReviewAnswerCount,
  recordReviewMiss,
  recordWrongAnswerCorrect,
  resetWrongAnswerProgress,
} from "../lib/mcq-review";
import {
  TIER_LABELS,
  UNIT_OPTIONS,
  buildPool,
  drawBossQuestion,
  getSubsections,
  loadBossFilter,
  loadBossWrongQuestions,
  questionSecondsForStage,
  recordBossHit,
  recordBossMiss,
  saveBossFilter,
  type BossFilter,
  type BossFocusMode,
} from "../lib/boss-battle";
import {
  SKIN_TONES,
  HAIR_DESIGNS,
  TOP_DESIGNS,
  BOTTOM_DESIGNS,
  SHOE_DESIGNS,
} from "../lib/data/customizer-items";
import { AvatarCustomizerModal } from "./AvatarCustomizerModal";
import { FlagQuestionButton } from "./FlagQuestionButton";
import {
  ArrowLeft,
  ClipboardList,
  Shield,
  Sparkles,
  Award,
  RefreshCw,
  Volume2,
  VolumeX,
  Crosshair,
  ShoppingBag,
  Palette,
  Flame,
  AlertTriangle,
  Rocket,
  Zap,
  ChevronRight,
  RotateCcw,
  ArrowRight,
  Heart,
  Pause,
  Play,
  Swords,
} from "lucide-react";
import "../boss-battle.css";

export type DifficultyTier = "foundation" | "higher" | "nightmare";

export interface DifficultyConfig {
  id: DifficultyTier;
  label: string;
  badge: string;
  description: string;
  hpMult: number;
  speedMult: number;
  attackCadenceMult: number;
  rewardMult: number;
  color: string;
}

export const DIFFICULTY_TIERS: Record<DifficultyTier, DifficultyConfig> = {
  foundation: {
    id: "foundation",
    label: "Foundation",
    badge: "Core 0264",
    description: "Standard attack rhythm and base velocity.",
    hpMult: 1.0,
    speedMult: 1.0,
    attackCadenceMult: 1.0,
    rewardMult: 1.0,
    color: "#10b981",
  },
  higher: {
    id: "higher",
    label: "Higher Tier",
    badge: "Grade 7-8 Target",
    description: "+35% Boss HP, +25% Projectile Velocity & Multi-Height Barrages.",
    hpMult: 1.35,
    speedMult: 1.25,
    attackCadenceMult: 1.22,
    rewardMult: 1.6,
    color: "#f59e0b",
  },
  nightmare: {
    id: "nightmare",
    label: "A* Nightmare",
    badge: "Grade 9 Ruthless",
    description: "+80% Boss HP, Extreme Velocity & Undulating Wave Trajectories.",
    hpMult: 1.8,
    speedMult: 1.55,
    attackCadenceMult: 1.45,
    rewardMult: 2.8,
    color: "#ef4444",
  },
};

export const JETPACK_COST = 200;
export const JETPACK_FLIGHT_SECONDS = 3.0;

// Revive trial: survive death by answering this many questions correctly in a row.
export const REVIVE_REQUIRED_CORRECT = 10;

interface ArmourItem {
  id: string;
  name: string;
  icon: string;
  damagePerHit: number;
  cost: number;
  description: string;
}

const ARMOUR_TIERS: ArmourItem[] = [
  { id: "starter", name: "Candidate Uniform", icon: "🥋", damagePerHit: 30, cost: 0, description: "Standard exam uniform. Takes 30 damage per hit." },
  { id: "bronze", name: "Prefect Blazer", icon: "🛡️", damagePerHit: 22, cost: 40, description: "Sturdy woven blazer. Takes 22 damage per hit." },
  { id: "iron", name: "Kevlar Formula Sheet", icon: "📜", damagePerHit: 14, cost: 100, description: "Laminated business ratios absorb kinetic impact. Takes 14 damage." },
  { id: "diamond", name: "Cambridge Diamond Robe", icon: "💎", damagePerHit: 6, cost: 220, description: "Mythic examiner regalia. Deflects almost all damage (6 damage)." },
  { id: "graphene", name: "Graphene Exosuit", icon: "🦾", damagePerHit: 3, cost: 340, description: "Lab-grown carbon lattice. Takes 3 damage per hit." },
  { id: "nova", name: "Nova Chairman Plate", icon: "🌟", damagePerHit: 1, cost: 460, description: "Stellar forged plate. Takes 1 damage per hit." },
  { id: "grandmaster", name: "Grandmaster Mantle", icon: "🏛️", damagePerHit: 0, cost: 640, description: "Zero damage taken. You are the examiner now." },
];

interface CharacterSkin {
  id: string;
  name: string;
  icon: string;
  cost: number;
  flipSprite: boolean;
  isCustomAvatar?: boolean;
}

const CHARACTERS: CharacterSkin[] = [
  { id: "custom", name: "Custom Scholar", icon: "🧑‍🎓", cost: 0, flipSprite: false, isCustomAvatar: true },
  { id: "dino", name: "Dino Scholar", icon: "🦖", cost: 0, flipSprite: true },
  { id: "knight", name: "Business Knight", icon: "🤺", cost: 30, flipSprite: true },
  { id: "analyst", name: "Chief Financial Mage", icon: "🧙‍♂️", cost: 80, flipSprite: true },
  { id: "cyber", name: "Audit Cyborg", icon: "🤖", cost: 150, flipSprite: false },
  { id: "lion", name: "Audit Lion", icon: "🦁", cost: 220, flipSprite: true },
  { id: "phoenix", name: "Phoenix Rising Intern", icon: "🦅", cost: 260, flipSprite: true },
  { id: "phantom", name: "Cambridge Phantom", icon: "👻", cost: 380, flipSprite: true },
  { id: "dean", name: "The Dean", icon: "🎓", cost: 520, flipSprite: true },
];

interface BossConfig {
  id: string;
  name: string;
  title: string;
  icon: string;
  color: string;
  maxHp: number;
  attackIntervalMs: number;
  projectileSpeed: number;
  projectileIcon: string;
  bgGradient: string;
}

const BASE_BOSSES: BossConfig[] = [
  {
    id: "cash_flow_crisis",
    name: "Cash-Flow Kraken",
    title: "Terror of Insolvency & Liquidity",
    icon: "🐙",
    color: "#0284c7",
    maxHp: 220,
    attackIntervalMs: 12000,
    projectileSpeed: 5.5,
    projectileIcon: "💸",
    bgGradient: "from-cyan-950/60 via-neutral-900 to-black",
  },
  {
    id: "hostile_takeover",
    name: "Takeover Titan",
    title: "Predatory Buyouts & Shareholder Clashes",
    icon: "🦈",
    color: "#e11d48",
    maxHp: 320,
    attackIntervalMs: 10500,
    projectileSpeed: 6.2,
    projectileIcon: "📉",
    bgGradient: "from-rose-950/60 via-neutral-900 to-black",
  },
  {
    id: "diseconomy_dragon",
    name: "Diseconomy Dragon",
    title: "Bureaucracy & Scale Inefficiencies",
    icon: "🐉",
    color: "#ea580c",
    maxHp: 440,
    attackIntervalMs: 9500,
    projectileSpeed: 6.8,
    projectileIcon: "🔥",
    bgGradient: "from-amber-950/60 via-neutral-900 to-black",
  },
  {
    id: "hyperinflation_hydra",
    name: "Hyperinflation Hydra",
    title: "Macroeconomic Shocks & Spiral Costs",
    icon: "🐍",
    color: "#10b981",
    maxHp: 560,
    attackIntervalMs: 8800,
    projectileSpeed: 7.2,
    projectileIcon: "💹",
    bgGradient: "from-emerald-950/60 via-neutral-900 to-black",
  },
  {
    id: "monopoly_overlord",
    name: "Monopoly Overlord",
    title: "Anti-Trust Hegemony & Collusion",
    icon: "👁️",
    color: "#eab308",
    maxHp: 680,
    attackIntervalMs: 8200,
    projectileSpeed: 7.8,
    projectileIcon: "⚖️",
    bgGradient: "from-yellow-950/60 via-neutral-900 to-black",
  },
  {
    id: "grand_examiner",
    name: "Cambridge Grand Examiner",
    title: "Grade Boundary 9 Standard",
    icon: "👑",
    color: "#9333ea",
    maxHp: 800,
    attackIntervalMs: 7600,
    projectileSpeed: 8.4,
    projectileIcon: "⚡",
    bgGradient: "from-purple-950/60 via-neutral-900 to-black",
  },
];

// Fallback alias for backward compatibility
const BOSSES = BASE_BOSSES;

export interface ScaledBoss extends BossConfig {
  stage: number;
  loop: number;
  scaledTitle: string;
  attackCadenceMs: number;
}

export function computeScaledBoss(baseBoss: BossConfig, stage: number, difficulty: DifficultyTier): ScaledBoss {
  const diffCfg = DIFFICULTY_TIERS[difficulty] || DIFFICULTY_TIERS.foundation;
  const stageScale = 1 + (stage - 1) * 0.16;
  const scaledMaxHp = Math.round(baseBoss.maxHp * stageScale * diffCfg.hpMult);
  const scaledProjectileSpeed = Number(((baseBoss.projectileSpeed + (stage - 1) * 0.28) * diffCfg.speedMult).toFixed(2));
  const scaledAttackIntervalMs = Math.max(
    3600,
    Math.round(baseBoss.attackIntervalMs / (Math.min(2.5, 1 + (stage - 1) * 0.07) * diffCfg.attackCadenceMult))
  );
  const scaledAttackCadenceMs = Math.max(
    1150,
    Math.round(2400 / (Math.min(2.2, 1 + (stage - 1) * 0.08) * diffCfg.attackCadenceMult))
  );
  const loop = Math.floor((stage - 1) / BASE_BOSSES.length) + 1;
  return {
    ...baseBoss,
    maxHp: scaledMaxHp,
    projectileSpeed: scaledProjectileSpeed,
    attackIntervalMs: scaledAttackIntervalMs,
    attackCadenceMs: scaledAttackCadenceMs,
    stage,
    loop,
    scaledTitle: `Stage ${stage} (Loop ${loop}) · ${baseBoss.title}`,
  };
}

export type ProjectileHeightTier = "low" | "mid" | "high" | "wave";

export interface BossAttackProjectile {
  x: number;
  y: number;
  baseY: number;
  vx: number;
  width: number;
  height: number;
  icon: string;
  id: number;
  rotation: number;
  tier: ProjectileHeightTier;
  waveFreq?: number;
  waveAmp?: number;
}

export interface BossActiveQuestion {
  id: string;
  questionNumber: string;
  chapter: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  unit: string;
  subsection: string;
  difficulty: DifficultyTier;
  item: MCQItem;
}

function buildDistractors(target: MCQItem): string[] {
  const otherItems = MCQ_BANK.filter((item) => item.id !== target.id && item.correctAnswer !== target.correctAnswer);

  const sameChapter = otherItems.filter((item) => item.chapter === target.chapter);
  const diffChapter = otherItems.filter((item) => item.chapter !== target.chapter);

  const distractors: string[] = [];

  const shuffledSame = [...sameChapter].sort(() => 0.5 - Math.random());
  for (let i = 0; i < Math.min(2, shuffledSame.length); i++) {
    if (!distractors.includes(shuffledSame[i].correctAnswer)) {
      distractors.push(shuffledSame[i].correctAnswer);
    }
  }

  const shuffledDiff = [...diffChapter].sort(() => 0.5 - Math.random());
  for (let i = 0; i < shuffledDiff.length && distractors.length < 3; i++) {
    if (!distractors.includes(shuffledDiff[i].correctAnswer)) {
      distractors.push(shuffledDiff[i].correctAnswer);
    }
  }

  while (distractors.length < 3) {
    const randomPick = otherItems[Math.floor(Math.random() * otherItems.length)];
    if (!distractors.includes(randomPick.correctAnswer)) {
      distractors.push(randomPick.correctAnswer);
    }
  }

  return distractors;
}

function toBossQuestion(target: MCQItem, difficulty: DifficultyTier): BossActiveQuestion {
  const shuffledOptions = [target.correctAnswer, ...buildDistractors(target).slice(0, 3)].sort(() => 0.5 - Math.random());
  const correctIndex = shuffledOptions.indexOf(target.correctAnswer);
  const subsection = target.chapter.split(" ")[0] ?? target.chapter;

  return {
    id: target.id,
    questionNumber: target.questionNumber,
    chapter: target.chapter,
    question: target.question,
    options: shuffledOptions,
    correctIndex,
    explanation: `Cambridge Mark Scheme: "${target.correctAnswer}"`,
    unit: target.section,
    subsection,
    difficulty,
    item: target,
  };
}

interface BossBattleArenaProps {
  onBackToStudio: () => void;
  onOpenPracticeQuestion?: () => void;
  /** Opens the mistake review page where Boss Battle misses are banked. */
  onOpenReview?: () => void;
}

export const BossBattleArena: React.FC<BossBattleArenaProps> = ({
  onBackToStudio,
  onOpenReview,
}) => {
  // Web Audio Synthesizer
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const playTone = (freq: number, type: OscillatorType, duration: number, gainVal: number = 0.15) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  };

  const playJumpSound = () => playTone(360, "square", 0.15, 0.12);
  const playShootSound = () => playTone(650, "sawtooth", 0.12, 0.1);
  const playHitSound = () => playTone(130, "triangle", 0.25, 0.25);
  const playBossAttackSound = () => playTone(220, "sawtooth", 0.3, 0.15);
  const playCritSound = () => {
    playTone(523, "sine", 0.1, 0.25);
    setTimeout(() => playTone(659, "sine", 0.1, 0.25), 90);
    setTimeout(() => playTone(784, "sine", 0.15, 0.25), 180);
    setTimeout(() => playTone(1046, "square", 0.3, 0.3), 270);
  };
  const playBossHurtSound = () => playTone(170, "sawtooth", 0.2, 0.15);

  const playJetpackSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(130, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.35);
      osc.frequency.setValueAtTime(240, ctx.currentTime + 1.2);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.9);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.9);
    } catch {}
  };

  // Coins persistent state & real-time sync with other tabs
  const [coins, setCoins] = useState<number>(() => getStudyCoins());

  useEffect(() => {
    const handleCoinsUpdated = (e: any) => {
      if (e?.detail?.coins !== undefined) {
        setCoins(e.detail.coins);
      }
    };
    window.addEventListener("ecbiz_coins_updated", handleCoinsUpdated);
    return () => window.removeEventListener("ecbiz_coins_updated", handleCoinsUpdated);
  }, []);

  // Calculate real study time to determine Pokemon-style Scholar Level
  const studyStats = useMemo(() => {
    const subs = loadSubmissions();
    const totalSubSeconds = subs.reduce((acc, s) => acc + (s.timeSpentSeconds || 60), 0);
    const scholarLevel = Math.max(1, Math.min(50, 1 + Math.floor(totalSubSeconds / 180)));
    const damageMultiplier = 1 + (scholarLevel - 1) * 0.1;
    const maxHpBonus = (scholarLevel - 1) * 10;
    return {
      totalSubmissions: subs.length,
      totalStudyMinutes: Math.round(totalSubSeconds / 60),
      scholarLevel,
      damageMultiplier,
      maxHpBonus,
    };
  }, []);

  // Character Customization State
  const [customization, setCustomization] = useState<CharacterCustomizationState>(() => loadCustomizerState());
  const [showCustomizerModal, setShowCustomizerModal] = useState<boolean>(false);

  // Mod Upgrades
  const [equippedArmourId, setEquippedArmourId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ecbiz_armour_id") || "starter";
    }
    return "starter";
  });

  const [equippedCharId, setEquippedCharId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ecbiz_char_id") || "custom";
    }
    return "custom";
  });

  const [maxAmmo, setMaxAmmo] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ecbiz_max_ammo");
      return saved ? parseInt(saved, 10) || 20 : 20;
    }
    return 20;
  });

  const [unlockedArmour, setUnlockedArmour] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("ecbiz_unlocked_armour");
        return saved ? JSON.parse(saved) : ["starter"];
      } catch {}
    }
    return ["starter"];
  });

  const [unlockedChars, setUnlockedChars] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("ecbiz_unlocked_chars");
        return saved ? JSON.parse(saved) : ["custom", "dino"];
      } catch {}
    }
    return ["custom", "dino"];
  });

  // Quantum Scholar Jetpack state
  const [hasJetpack, setHasJetpack] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ecbiz_jetpack_unlocked") === "true";
    }
    return false;
  });
  const [jetpackActive, setJetpackActive] = useState<boolean>(false);
  const [jetpackTimeLeft, setJetpackTimeLeft] = useState<number>(0);
  const [jetpackCooldown, setJetpackCooldown] = useState<number>(0);
  const jetpackActiveRef = useRef<boolean>(false);
  const jetpackEndTimeRef = useRef<number>(0);
  const jetpackCooldownEndRef = useRef<number>(0);

  // Difficulty Tier state
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyTier>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ecbiz_boss_difficulty") as DifficultyTier;
      if (saved && (saved === "foundation" || saved === "higher" || saved === "nightmare")) {
        return saved;
      }
    }
    return "foundation";
  });

  // Infinite Stage Ascension loop state
  const [stageCount, setStageCount] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ecbiz_boss_stage");
      return Math.max(1, parseInt(saved || "", 10) || 1);
    }
    return 1;
  });

  const currentBossIndex = (stageCount - 1) % BASE_BOSSES.length;
  const activeBoss = useMemo(() => {
    const base = BASE_BOSSES[currentBossIndex];
    return computeScaledBoss(base, stageCount, selectedDifficulty);
  }, [currentBossIndex, stageCount, selectedDifficulty]);

  const currentArmour = ARMOUR_TIERS.find((a) => a.id === equippedArmourId) || ARMOUR_TIERS[0];
  const currentChar = CHARACTERS.find((c) => c.id === equippedCharId) || CHARACTERS[0];

  // Equipped Cosmetics Details for Canvas Drawing
  const activeSkin = SKIN_TONES.find((s) => s.id === customization.skinToneId) || SKIN_TONES[0];
  const activeHair = HAIR_DESIGNS.find((h) => h.id === customization.hairId) || HAIR_DESIGNS[0];
  const activeTop = TOP_DESIGNS.find((t) => t.id === customization.topId) || TOP_DESIGNS[0];
  const activeBottom = BOTTOM_DESIGNS.find((b) => b.id === customization.bottomId) || BOTTOM_DESIGNS[0];
  const activeShoe = SHOE_DESIGNS.find((s) => s.id === customization.shoeId) || SHOE_DESIGNS[0];

  const maxPlayerHp = 100 + studyStats.maxHpBonus;
  const [playerHp, setPlayerHp] = useState<number>(maxPlayerHp);
  const playerHpRef = useRef(maxPlayerHp);
  const updatePlayerHp = (value: number) => {
    playerHpRef.current = value;
    setPlayerHp(value);
  };

  // Dynamic Boss Health with Animated Ghost Bar (Delayed trailing recoil)
  const [bossHp, setBossHp] = useState<number>(activeBoss.maxHp);
  const [bossGhostHp, setBossGhostHp] = useState<number>(activeBoss.maxHp);
  const [ammo, setAmmo] = useState<number>(maxAmmo);

  // Smoothly catch up ghost bar when boss takes damage
  useEffect(() => {
    const timer = setTimeout(() => {
      setBossGhostHp(bossHp);
    }, 450);
    return () => clearTimeout(timer);
  }, [bossHp]);

  // Live Tokens: 3 Tokens = 1 Continue Life
  const [liveTokens, setLiveTokens] = useState<number>(0);
  const [extraLives, setExtraLives] = useState<number>(1);

  // Question focus filters (units / subsection / focus mode), persisted locally and synced via `ecbiz_*`
  const [bossFilter, setBossFilter] = useState<BossFilter>(() => loadBossFilter());
  const updateFilter = (patch: Partial<BossFilter>) => {
    setBossFilter((current) => {
      const next = { ...current, ...patch };
      saveBossFilter(next);
      return next;
    });
  };
  const subsections = useMemo(() => getSubsections(bossFilter.units), [bossFilter.units]);
  const poolCount = useMemo(() => buildPool(bossFilter).items.length, [bossFilter]);

  // Missed-questions state — the spaced-repetition map from localStorage
  const [bossWrongMap, setBossWrongMap] = useState(() => loadBossWrongQuestions());
  const missedCount = Object.keys(bossWrongMap).length;
  const reviewCount = getReviewAnswerCount();
  const refreshWrongMap = () => setBossWrongMap(loadBossWrongQuestions());

  // Recently drawn question ids so the same question never repeats back-to-back
  const recentQuestionRef = useRef<string[]>([]);

  // Draw the next question, applying the difficulty curve and spaced repetition.
  // Must be declared before the timer constants so effects can read it.
  const questionSeconds = questionSecondsForStage(selectedDifficulty, stageCount);

  // Correct-answer streak, run escalation, and the revive trial
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [rageLevel, setRageLevel] = useState<number>(0);
  const [reviveUsed, setReviveUsed] = useState<boolean>(false);
  const [reviveCorrect, setReviveCorrect] = useState<number>(0);
  const streakMultiplier = 1 + Math.min(streak, 10) * 0.2;

  const drawQuestion = (): BossActiveQuestion => {
    const target = drawBossQuestion({
      filter: bossFilter,
      wrong: loadBossWrongQuestions(),
      stage: stageCount,
      rage: rageLevel,
      recentIds: recentQuestionRef.current,
    });
    recentQuestionRef.current = [...recentQuestionRef.current, target.id].slice(-6);
    return toBossQuestion(target, selectedDifficulty);
  };

  // Game flow states
  const [gameState, setGameState] = useState<"idle" | "playing" | "paused" | "question_attack" | "revive_challenge" | "game_over" | "boss_defeated" | "shop">("idle");
  const [activeQuestion, setActiveQuestion] = useState<BossActiveQuestion | null>(null);
  const [questionEta, setQuestionEta] = useState(Math.ceil(activeBoss.attackIntervalMs / 1000));
  const [questionTimer, setQuestionTimer] = useState<number>(questionSeconds);
  const [questionFeedback, setQuestionFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [score, setScore] = useState<number>(0);
  const [bossAttackCharging, setBossAttackCharging] = useState<boolean>(false);
  const [floatingDamage, setFloatingDamage] = useState<{ id: number; text: string; x: number; y: number; color: string }[]>([]);

  // Live escalation: every correct answer enrages the boss, so the fight keeps getting harder.
  const combatBoss = useMemo(() => {
    const rage = Math.min(rageLevel, 15);
    return {
      ...activeBoss,
      projectileSpeed: Number(
        Math.min(10.5, activeBoss.projectileSpeed * (1 + rage * 0.05)).toFixed(2),
      ),
      attackCadenceMs: Math.max(850, Math.round(activeBoss.attackCadenceMs / (1 + rage * 0.055))),
      attackIntervalMs: Math.max(4200, Math.round(activeBoss.attackIntervalMs / (1 + rage * 0.035))),
    };
  }, [activeBoss, rageLevel]);

  // 2D Canvas Runner state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const questionRef = useRef<HTMLElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);
  const resumeRef = useRef<HTMLButtonElement>(null);
  const feedbackActionRef = useRef<(() => void) | null>(null);
  const answerLockedRef = useRef(false);
  const victoryAwardedRef = useRef(false);
  const pausedAtRef = useRef(0);
  const salvoTimerRef = useRef<number | null>(null);
  const playerRef = useRef({
    x: 80,
    y: 190,
    vy: 0,
    isJumping: false,
    width: 38,
    height: 48,
    rotation: 0,
  });

  // Projectiles (with multi-tier heights & trajectories)
  const playerProjectilesRef = useRef<{ x: number; y: number; vx: number; color: string; id: number }[]>([]);
  const bossAttacksRef = useRef<BossAttackProjectile[]>([]);
  const obstaclesRef = useRef<{ x: number; y: number; width: number; height: number; speed: number; id: number }[]>([]);

  const animationFrameRef = useRef<number | null>(null);
  const lastQuestionAttackTimeRef = useRef<number>(Date.now());
  const lastBossNormalAttackTimeRef = useRef<number>(Date.now());
  const screenShakeRef = useRef<number>(0); // Screen shake intensity (in pixels)
  const bossHitFlashRef = useRef<number>(0); // Boss flash counter
  const playerInvincibleUntilRef = useRef<number>(0); // Grace period i-frames
  const jumpHoldStartRef = useRef<number | null>(null); // Track Space / tap hold for Jetpack
  const jetpackTriggeredByHoldRef = useRef<boolean>(false);

  // Periodic timer for jetpack countdown & cooldown precision
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (jetpackActiveRef.current) {
        const left = Math.max(0, (jetpackEndTimeRef.current - now) / 1000);
        setJetpackTimeLeft(Number(left.toFixed(1)));
      } else {
        setJetpackTimeLeft(0);
        if (now < jetpackCooldownEndRef.current) {
          setJetpackCooldown(Math.ceil((jetpackCooldownEndRef.current - now) / 1000));
        } else {
          setJetpackCooldown(0);
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Floating text
  const addFloatingText = (text: string, x: number, y: number, color: string = "#ef4444") => {
    const id = Date.now() + Math.random();
    setFloatingDamage((prev) => [...prev, { id, text, x, y, color }]);
    setTimeout(() => {
      setFloatingDamage((prev) => prev.filter((item) => item.id !== id));
    }, 1300);
  };

  const selectMatch = (stage: number, difficulty: DifficultyTier) => {
    setStageCount(stage);
    setSelectedDifficulty(difficulty);
    localStorage.setItem("ecbiz_boss_stage", String(stage));
    localStorage.setItem("ecbiz_boss_difficulty", difficulty);
  };

  const finishStage = () => {
    if (victoryAwardedRef.current) return;
    victoryAwardedRef.current = true;
    const multiplier = DIFFICULTY_TIERS[selectedDifficulty].rewardMult;
    setCoins(awardBonusStudyCoins(Math.round((70 + stageCount * 25) * multiplier)));
    setScore((previous) => previous + Math.round((600 + stageCount * 180) * multiplier));
    setGameState("boss_defeated");
  };

  const pauseBattle = () => {
    pausedAtRef.current = Date.now();
    handleJumpEnd();
    setGameState("paused");
  };

  const resumeBattle = () => {
    const pausedFor = Date.now() - pausedAtRef.current;
    lastQuestionAttackTimeRef.current += pausedFor;
    lastBossNormalAttackTimeRef.current += pausedFor;
    playerInvincibleUntilRef.current += pausedFor;
    if (jetpackActiveRef.current) jetpackEndTimeRef.current += pausedFor;
    if (jetpackCooldownEndRef.current > pausedAtRef.current) jetpackCooldownEndRef.current += pausedFor;
    setGameState("playing");
  };

  const continueQuestion = () => {
    const action = feedbackActionRef.current;
    feedbackActionRef.current = null;
    action?.();
  };

  const returnToFight = () => {
    setQuestionFeedback(null);
    setActiveQuestion(null);
    setGameState("playing");
    lastQuestionAttackTimeRef.current = Date.now();
    lastBossNormalAttackTimeRef.current = Date.now();
    setQuestionEta(Math.ceil(combatBoss.attackIntervalMs / 1000));
  };

  // Start / Restart Battle (Scales boss health, velocity, and rewards per stage & difficulty)
  const handleStartGame = (stageTarget = stageCount, diffTarget = selectedDifficulty, continueRun = false) => {
    selectMatch(stageTarget, diffTarget);
    answerLockedRef.current = false;
    feedbackActionRef.current = null;
    victoryAwardedRef.current = false;
    if (salvoTimerRef.current !== null) window.clearTimeout(salvoTimerRef.current);

    const baseBoss = BASE_BOSSES[(stageTarget - 1) % BASE_BOSSES.length];
    const scaled = computeScaledBoss(baseBoss, stageTarget, diffTarget);

    updatePlayerHp(maxPlayerHp);
    setQuestionEta(Math.ceil(scaled.attackIntervalMs / 1000));
    setBossHp(scaled.maxHp);
    setBossGhostHp(scaled.maxHp);
    setAmmo(maxAmmo);
    setGameState("playing");
    setQuestionFeedback(null);
    setActiveQuestion(null);
    setBossAttackCharging(false);
    setStreak(0);
    setBestStreak(0);
    setRageLevel(0);
    setReviveUsed(false);
    setReviveCorrect(0);
    if (!continueRun) {
      setScore(0);
      setLiveTokens(0);
      setExtraLives(1);
    }
    setFloatingDamage([]);
    playerInvincibleUntilRef.current = 0;
    jetpackCooldownEndRef.current = 0;
    screenShakeRef.current = 0;
    bossHitFlashRef.current = 0;
    handleJumpEnd();
    playerProjectilesRef.current = [];
    bossAttacksRef.current = [];
    obstaclesRef.current = [];
    playerRef.current.y = 190;
    playerRef.current.vy = 0;
    playerRef.current.isJumping = false;
    playerRef.current.rotation = 0;
    jetpackActiveRef.current = false;
    setJetpackActive(false);
    lastQuestionAttackTimeRef.current = Date.now();
    lastBossNormalAttackTimeRef.current = Date.now();

    if (typeof window !== "undefined") {
      try {
        const count = parseInt(localStorage.getItem("ecbiz_boss_battles_count") || "0", 10) + 1;
        localStorage.setItem("ecbiz_boss_battles_count", String(count));
      } catch {}
    }
  };

  // Buy Quantum Scholar Jetpack
  const handleBuyJetpack = () => {
    if (coins < JETPACK_COST) {
      addFloatingText(`Need ${JETPACK_COST} Coins! (You have ${coins})`, 150, 100, "#ef4444");
      return;
    }
    const success = deductStudyCoins(JETPACK_COST);
    if (!success) {
      const nextCoins = coins - JETPACK_COST;
      setCoins(nextCoins);
      localStorage.setItem("ecbiz_study_coins", String(nextCoins));
      window.dispatchEvent(new CustomEvent("ecbiz_coins_updated", { detail: { coins: nextCoins } }));
    } else {
      setCoins(getStudyCoins());
    }
    setHasJetpack(true);
    localStorage.setItem("ecbiz_jetpack_unlocked", "true");
    playCritSound();
    addFloatingText("🚀 QUANTUM JETPACK UNLOCKED! Press Shift / W to Fly!", 100, 120, "#06b6d4");
  };

  // Activate Jetpack Flight
  const handleActivateJetpack = () => {
    if (gameState !== "playing") return;
    if (!hasJetpack) {
      addFloatingText(`Unlock Jetpack in Armour Shop! (${JETPACK_COST} 🪙)`, 150, 100, "#f59e0b");
      return;
    }
    if (jetpackActiveRef.current) return;
    if (Date.now() < jetpackCooldownEndRef.current) {
      const secLeft = Math.ceil((jetpackCooldownEndRef.current - Date.now()) / 1000);
      addFloatingText(`Jetpack cooling down (${secLeft}s)`, 150, 100, "#f59e0b");
      return;
    }

    // Activate 3.0 seconds of sustained rocket flight
    jetpackActiveRef.current = true;
    setJetpackActive(true);
    jetpackEndTimeRef.current = Date.now() + JETPACK_FLIGHT_SECONDS * 1000;
    playJetpackSound();
    addFloatingText(`🚀 JETPACK ENGAGED! (${JETPACK_FLIGHT_SECONDS}s)`, playerRef.current.x, playerRef.current.y - 25, "#38bdf8");
  };

  // Player Jump
  const handleJump = () => {
    if (gameState !== "playing") return;
    if (!playerRef.current.isJumping) {
      playerRef.current.vy = -14.2; // Crisp jump with high clearance over ground obstacles
      playerRef.current.isJumping = true;
      playJumpSound();
    }
  };

  // Jump Start (For Long-Press Jetpack detection via keyboard, mouse, or touch)
  const handleJumpStart = () => {
    if (gameState !== "playing") return;
    if (!jumpHoldStartRef.current) {
      jumpHoldStartRef.current = Date.now();
      jetpackTriggeredByHoldRef.current = false;
      handleJump();
    }
  };

  const handleJumpEnd = () => {
    jumpHoldStartRef.current = null;
    jetpackTriggeredByHoldRef.current = false;
  };

  // Player Shoot
  const handleShoot = () => {
    if (gameState !== "playing") return;
    if (ammo <= 0) {
      addFloatingText("NO AMMO! Press [R] to Refill 🎯", 150, 100, "#f59e0b");
      return;
    }
    setAmmo((prev) => Math.max(0, prev - 1));
    playShootSound();

    playerProjectilesRef.current.push({
      x: playerRef.current.x + playerRef.current.width,
      y: playerRef.current.y + 18,
      vx: 14,
      color: "#38bdf8",
      id: Math.random(),
    });
  };

  // Refill Ammo with Coins or Emergency Supply (Triggered by 'R' Key or Button)
  const handleRefillAmmo = () => {
    if (gameState !== "playing" && gameState !== "question_attack") return;
    const refillCost = 15;
    if (coins >= refillCost) {
      const newCoins = coins - refillCost;
      setCoins(newCoins);
      localStorage.setItem("ecbiz_study_coins", String(newCoins));
      setAmmo(maxAmmo);
      // Also restore +25 HP to heal up!
      updatePlayerHp(Math.min(maxPlayerHp, playerHpRef.current + 25));
      playCritSound();
      addFloatingText(`+${maxAmmo} Ammo & +25 HP Refilled! 🎯 [R]`, 100, 110, "#10b981");
    } else {
      // Free emergency ammo refill so player is NEVER softlocked
      setAmmo(maxAmmo);
      playCritSound();
      addFloatingText(`Emergency +${maxAmmo} Ammo Supplied! ⚡ [R]`, 100, 110, "#38bdf8");
    }
  };

  // Trigger Prodigy Question Attack (strictly from 129 Business Studies question bank!)
  const triggerQuestionAttack = () => {
    answerLockedRef.current = false;
    handleJumpEnd();
    setBossAttackCharging(false);
    setGameState("question_attack");
    setQuestionFeedback(null);
    setQuestionTimer(questionSeconds);
    const businessQ = drawQuestion();
    setActiveQuestion(businessQ);
    playTone(380, "square", 0.35, 0.2);
  };

  // Begin the 10-in-a-row revive trial after a strong run ends in defeat
  const startReviveChallenge = () => {
    if (reviveUsed) return;
    answerLockedRef.current = false;
    setReviveCorrect(0);
    setGameState("revive_challenge");
    setQuestionFeedback(null);
    setQuestionTimer(questionSeconds);
    setActiveQuestion(drawQuestion());
    playTone(440, "square", 0.4, 0.2);
  };

  // Answer question attack
  // Save practice outcomes in the browser's spaced-repetition store.
  const recordBossOutcome = (wasCorrect: boolean, question: BossActiveQuestion) => {
    if (wasCorrect) {
      recordBossHit(question.id);
      // A correct Boss Battle answer also counts towards clearing an item that
      // was moved into the MCQ Wrong Only bank.
      recordWrongAnswerCorrect(question.id);
      refreshWrongMap();
      return;
    }
    // Keep the in-game spaced-repetition weighting and also bank the miss on
    // the review page, where the student decides whether it joins MCQ Wrong Only.
    recordBossMiss(question.item, selectedDifficulty);
    resetWrongAnswerProgress(question.id);
    recordReviewMiss({
      id: question.id,
      question: question.question,
      options: question.options,
      correctIndex: question.correctIndex,
      chapter: question.chapter,
      unit: question.unit,
      explanation: question.explanation,
      difficulty: question.difficulty,
    });
    refreshWrongMap();
  };

  const handleSelectQuestionOption = (selectedIndex: number) => {
    if (!activeQuestion || answerLockedRef.current || (gameState !== "question_attack" && gameState !== "revive_challenge")) return;
    answerLockedRef.current = true;

    recordBossOutcome(selectedIndex === activeQuestion.correctIndex, activeQuestion);

    // ---- Revive trial: all 10 answers must be correct ----
    if (gameState === "revive_challenge") {
      if (selectedIndex === activeQuestion.correctIndex) {
        const nextCorrect = reviveCorrect + 1;
        setReviveCorrect(nextCorrect);
        playCritSound();

        if (nextCorrect >= REVIVE_REQUIRED_CORRECT) {
          setReviveUsed(true);
          setQuestionFeedback({
            isCorrect: true,
            text: `REVIVE COMPLETE! ${REVIVE_REQUIRED_CORRECT}/${REVIVE_REQUIRED_CORRECT} correct in a row. You claw your way back at full HP!`,
          });
          feedbackActionRef.current = () => {
            setReviveCorrect(0);
            updatePlayerHp(maxPlayerHp);
            setStreak(0);
            returnToFight();
            playerInvincibleUntilRef.current = Date.now() + 2000;
            addFloatingText("SECOND WIND! FULL HP RESTORED ❤️", 150, 100, "#10b981");
          };
        } else {
          setQuestionFeedback({
            isCorrect: true,
            text: `Revive trial ${nextCorrect}/${REVIVE_REQUIRED_CORRECT} correct. One mistake still ends the run!`,
          });
          feedbackActionRef.current = () => {
            setQuestionFeedback(null);
            setQuestionTimer(questionSeconds);
            answerLockedRef.current = false;
            setActiveQuestion(drawQuestion());
          };
        }
      } else {
        playHitSound();
        setReviveUsed(true);
        setReviveCorrect(0);
        setQuestionFeedback({
          isCorrect: false,
          text: `REVIVE FAILED — the trial needs ${REVIVE_REQUIRED_CORRECT} correct in a row. ${activeQuestion.explanation}`,
        });
        feedbackActionRef.current = () => {
          setQuestionFeedback(null);
          setActiveQuestion(null);
          setGameState("game_over");
        };
      }
      return;
    }

    if (selectedIndex === activeQuestion.correctIndex) {
      // Correct answer! Screen shake + scaling streak multiplier + boss hit + Live Token
      playCritSound();
      screenShakeRef.current = 10; // Trigger dramatic screen shake
      bossHitFlashRef.current = 8; // Flash boss white

      const nextStreak = streak + 1;
      const nextMultiplier = 1 + Math.min(nextStreak, 10) * 0.2;
      setStreak(nextStreak);
      setBestStreak((prev) => Math.max(prev, nextStreak));
      setRageLevel((prev) => Math.min(15, prev + 1));

      const critDamage = Math.round(55 * studyStats.damageMultiplier * nextMultiplier);
      const newBossHp = Math.max(0, bossHp - critDamage);
      setBossHp(newBossHp);

      // Earn +1 Live Token
      const updatedTokens = liveTokens + 1;
      let extraLivesAdded = 0;
      let finalTokens = updatedTokens;

      if (updatedTokens >= 3) {
        extraLivesAdded = Math.floor(updatedTokens / 3);
        finalTokens = updatedTokens % 3;
        setExtraLives((prev) => prev + extraLivesAdded);
        playCritSound();
      }
      setLiveTokens(finalTokens);

      const earnedCoins = Math.round(35 * nextMultiplier);
      const updatedTotalCoins = awardBonusStudyCoins(earnedCoins);
      setCoins(updatedTotalCoins);
      setScore((prev) => prev + Math.round(300 * nextMultiplier));

      setQuestionFeedback({
        isCorrect: true,
        text: `You dealt ${critDamage} damage and earned ${earnedCoins} coins. ${extraLivesAdded ? "You earned an extra life. " : ""}${activeQuestion.explanation}`,
      });

      feedbackActionRef.current = () => {
        if (newBossHp <= 0) {
          setQuestionFeedback(null);
          setActiveQuestion(null);
          finishStage();
        } else {
          returnToFight();
        }
      };
    } else {
      // Incorrect answer or timeout — the streak breaks and the boss keeps its rage
      playHitSound();
      setStreak(0);
      const rawDamage = 40;
      const mitigatedDamage = Math.max(5, rawDamage - (30 - currentArmour.damagePerHit));
      const nextPlayerHp = Math.max(0, playerHpRef.current - mitigatedDamage);
      updatePlayerHp(nextPlayerHp);

      setQuestionFeedback({
        isCorrect: false,
        text: `${selectedIndex === -1 ? "Time ran out." : "Incorrect."} Streak reset to 0. Boss struck through defense! -${mitigatedDamage} HP. (Armour absorbed ${
          rawDamage - mitigatedDamage
        } damage). ${activeQuestion.explanation}`,
      });

      feedbackActionRef.current = () => {
        if (nextPlayerHp > 0) {
          returnToFight();
        } else if (extraLives > 0) {
          setExtraLives((previous) => previous - 1);
          updatePlayerHp(maxPlayerHp);
          playerInvincibleUntilRef.current = Date.now() + 1200;
          returnToFight();
          addFloatingText("Extra life used", 150, 100, "#10b981");
        } else {
          setQuestionFeedback(null);
          setActiveQuestion(null);
          setGameState("game_over");
        }
      };
    }
  };

  useEffect(() => {
    if (gameState === "playing") canvasRef.current?.focus({ preventScroll: true });
    if (gameState === "paused") resumeRef.current?.focus({ preventScroll: true });
    if (gameState === "question_attack" || gameState === "revive_challenge") {
      questionRef.current?.focus({ preventScroll: true });
      questionRef.current?.scrollIntoView({ block: "nearest" });
    }
  }, [gameState, activeQuestion]);

  useEffect(() => {
    if (questionFeedback) continueRef.current?.focus({ preventScroll: true });
  }, [questionFeedback]);

  useEffect(() => {
    if (gameState !== "playing") {
      if (salvoTimerRef.current !== null) window.clearTimeout(salvoTimerRef.current);
      return;
    }
    const onVisibilityChange = () => {
      if (document.hidden) pauseBattle();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (salvoTimerRef.current !== null) window.clearTimeout(salvoTimerRef.current);
    };
  }, [gameState]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement) || event.ctrlKey || event.altKey || event.metaKey) return;

      if (gameState === "question_attack" || gameState === "revive_challenge") {
        if (!questionRef.current?.contains(target) || target.matches("input, textarea, select, [contenteditable=true]") || event.repeat) return;
        const key = event.key.toLowerCase();
        const index = /^[1-4]$/.test(key) ? Number(key) - 1 : "abcd".indexOf(key);
        if (index >= 0 && key.length === 1) {
          event.preventDefault();
          handleSelectQuestionOption(index);
        }
        return;
      }

      if (gameState !== "playing" || target.closest("button, a, input, textarea, select, [contenteditable=true]")) return;
      if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault();
        handleJumpStart();
      } else if (event.code === "KeyF" && !event.repeat) {
        event.preventDefault();
        handleShoot();
      } else if (event.code === "KeyR" && !event.repeat) {
        event.preventDefault();
        handleRefillAmmo();
      } else if (["ShiftLeft", "ShiftRight", "KeyW", "KeyJ"].includes(event.code) && !event.repeat) {
        event.preventDefault();
        handleActivateJetpack();
      } else if (event.code === "Escape" || event.code === "KeyP") {
        event.preventDefault();
        pauseBattle();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space" || event.code === "ArrowUp") handleJumpEnd();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", handleJumpEnd);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", handleJumpEnd);
    };
  });

  useEffect(() => {
    if ((gameState !== "question_attack" && gameState !== "revive_challenge") || questionTimer <= 0 || questionFeedback) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      window.clearInterval(timer);
      if (questionTimer === 1) handleSelectQuestionOption(-1);
      setQuestionTimer(questionTimer - 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [gameState, questionTimer, questionFeedback, activeQuestion]);

  // Main 2D Canvas Loop (Dino Runner & Boss Arcade)
  useEffect(() => {
    if (gameState !== "playing") {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    let remainingBossHp = bossHp;
    const groundY = 230;
    const sky = ctx.createLinearGradient(0, 0, canvas.width, groundY);
    sky.addColorStop(0, "#090f19");
    sky.addColorStop(1, "#280d1a");
    const floor = ctx.createLinearGradient(0, groundY, 0, canvas.height);
    floor.addColorStop(0, "#291726");
    floor.addColorStop(1, "#0c1018");

    const gameLoop = () => {
      if (!running) return;

      // Handle screen shake
      ctx.save();
      if (screenShakeRef.current > 0) {
        const shakeX = (Math.random() - 0.5) * screenShakeRef.current;
        const shakeY = (Math.random() - 0.5) * screenShakeRef.current;
        ctx.translate(shakeX, shakeY);
        screenShakeRef.current *= 0.85;
        if (screenShakeRef.current < 0.5) screenShakeRef.current = 0;
      }

      // 1. Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the arena and the moving floor grid beneath both combatants.
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, canvas.width, groundY);
      ctx.fillStyle = floor;
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
      ctx.strokeStyle = "rgba(244, 117, 129, 0.22)";
      ctx.lineWidth = 1;
      const scrollOffset = (Date.now() / 20) % 30;
      for (let x = -30; x < canvas.width + 30; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x - scrollOffset, groundY);
        ctx.lineTo(x - scrollOffset - 25, canvas.height);
        ctx.stroke();
      }
      ctx.strokeStyle = "#ef647c";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(canvas.width, groundY);
      ctx.stroke();

      // 3. Update Player Physics (Supports Standard Gravity & Jetpack Aerial Hover)
      const p = playerRef.current;
      const now = Date.now();
      const isFlying = jetpackActiveRef.current && now < jetpackEndTimeRef.current;
      if (jetpackActiveRef.current && !isFlying) {
        jetpackActiveRef.current = false;
        setJetpackActive(false);
        jetpackCooldownEndRef.current = now + 7000;
      }

      // Check Long-Press (Space / tap held >= 260ms) to trigger Jetpack
      if (jumpHoldStartRef.current && !jetpackTriggeredByHoldRef.current) {
        const holdDuration = now - jumpHoldStartRef.current;
        if (holdDuration >= 260) {
          jetpackTriggeredByHoldRef.current = true;
          if (hasJetpack) {
            handleActivateJetpack();
          } else {
            addFloatingText("🚀 Hold to Fly! Get Jetpack in Shop (200🪙)", p.x, p.y - 25, "#f59e0b");
          }
        }
      }

      if (isFlying) {
        // Quantum Jetpack Flight Mode: Overrides gravity and flies above ground & mid hazards
        const targetHoverY = 72;
        if (p.y > targetHoverY) {
          p.vy = Math.max(-5.5, p.vy - 1.2);
        } else {
          p.vy = Math.sin(now / 140) * 0.9;
        }
        p.isJumping = true;
        p.y += p.vy;
        if (p.y < 35) {
          p.y = 35;
          p.vy = 0;
        }
        p.rotation = Math.sin(now / 180) * 0.08;
      } else {
        // Standard Gravity
        p.vy += 0.65;
        p.y += p.vy;

        if (p.y >= groundY - p.height) {
          p.y = groundY - p.height;
          p.vy = 0;
          p.isJumping = false;
          p.rotation = 0;
        } else {
          p.rotation = p.vy * 0.03;
        }
      }

      // 4. DRAW PLAYER CHARACTER (FACING RIGHT TOWARDS BOSS)
      ctx.save();
      ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
      ctx.rotate(p.rotation);

      // Flashing opacity during invulnerability frames
      if (now < playerInvincibleUntilRef.current) {
        ctx.globalAlpha = Math.sin(now / 40) > 0 ? 0.35 : 0.85;
      }

      const runBob = p.isJumping ? 0 : Math.sin(Date.now() / 80) * 2;

      if (currentChar.isCustomAvatar) {
        // Render Full Modular Custom Character
        // Body: Legs/Pants
        ctx.fillStyle = activeBottom.previewColor;
        ctx.fillRect(-8, 6 + runBob, 6, 14);
        ctx.fillRect(2, 6 + runBob, 6, 14);

        // Shoes
        ctx.fillStyle = activeShoe.previewColor;
        ctx.fillRect(-9, 18 + runBob, 8, 4);
        ctx.fillRect(1, 18 + runBob, 8, 4);

        // Shirt / Torso
        ctx.fillStyle = activeTop.previewColor;
        ctx.beginPath();
        ctx.roundRect(-10, -8 + runBob, 20, 16, [4]);
        ctx.fill();

        // Head / Face
        ctx.fillStyle = activeSkin.color;
        ctx.beginPath();
        ctx.arc(0, -14 + runBob, 9, 0, Math.PI * 2);
        ctx.fill();

        // Eye looking right towards boss
        ctx.fillStyle = "#0F172A";
        ctx.beginPath();
        ctx.arc(3, -15 + runBob, 1.6, 0, Math.PI * 2);
        ctx.fill();

        // Hair Design — each wardrobe style is drawn with its own silhouette
        {
          const hy = runBob;
          const hairColor = activeHair.previewColor;
          const hairDark = activeHair.secondaryColor ?? "rgba(0,0,0,0.4)";
          ctx.fillStyle = hairColor;

          switch (activeHair.id) {
            case "hair-1": // Scholar Side-Part — neat dome with a side sweep and part line
              ctx.beginPath();
              ctx.ellipse(0, -16 + hy, 9.3, 6.9, 0, Math.PI, 0);
              ctx.fill();
              ctx.fillStyle = hairDark;
              ctx.fillRect(-4.6, -22.6 + hy, 1.7, 5.6); // side part line
              break;
            case "hair-2": // Academic Neat Crop — flat tapered crop
              ctx.beginPath();
              ctx.roundRect(-8.6, -22.4 + hy, 17.2, 5.6, 2.4);
              ctx.fill();
              ctx.fillRect(-8.6, -18 + hy, 17.2, 2.4);
              break;
            case "hair-3": // Messy Revision Curls — cluster of coils
              [[-8, -16, 3.6], [-4.6, -20.4, 3.8], [0.2, -22.4, 4], [4.9, -20.4, 3.8], [8.8, -16.2, 3.5]].forEach(([x, y, r]) => {
                ctx.beginPath();
                ctx.arc(x, y + hy, r, 0, Math.PI * 2);
                ctx.fill();
              });
              ctx.beginPath();
              ctx.ellipse(0, -13.4 + hy, 9.3, 4.7, 0, Math.PI, 0);
              ctx.fill();
              break;
            case "hair-4": // Modern Textured Quiff — high swept-back wedge
              ctx.beginPath();
              ctx.ellipse(0, -16 + hy, 9.2, 6.3, 0, Math.PI, 0);
              ctx.fill();
              ctx.beginPath();
              ctx.moveTo(-8.4, -17.2 + hy);
              ctx.quadraticCurveTo(-1, -27.5 + hy, 10, -19.5 + hy);
              ctx.quadraticCurveTo(2.5, -22.4 + hy, -8.4, -13.6 + hy);
              ctx.closePath();
              ctx.fill();
              break;
            case "hair-5": // Sleek High Ponytail — dome plus tail falling behind + exam ribbon
              ctx.beginPath();
              ctx.ellipse(0, -16 + hy, 9, 6.7, 0, Math.PI, 0);
              ctx.fill();
              ctx.beginPath(); // tail
              ctx.moveTo(8.3, -17.6 + hy);
              ctx.quadraticCurveTo(14.5, -13 + hy, 11.2, -2.5 + hy);
              ctx.quadraticCurveTo(8.6, -10.5 + hy, 5.4, -14 + hy);
              ctx.closePath();
              ctx.fill();
              ctx.fillStyle = "#BE123C"; // ribbon
              ctx.beginPath();
              ctx.ellipse(8.3, -18 + hy, 2.4, 1.5, 0.3, 0, Math.PI * 2);
              ctx.fill();
              break;
            case "hair-6": // Curly High-Top Fade — tall flat-top block with coils on top
              ctx.beginPath();
              ctx.roundRect(-7.6, -25 + hy, 15.2, 9.6, 3);
              ctx.fill();
              [[-5.4, -24.6, 2.4], [0, -25.9, 2.6], [5.4, -24.6, 2.4]].forEach(([x, y, r]) => {
                ctx.beginPath();
                ctx.arc(x, y + hy, r, 0, Math.PI * 2);
                ctx.fill();
              });
              break;
            case "hair-7": // Spiky Anime Protagonist — row of crimson spikes
              ctx.beginPath();
              ctx.ellipse(0, -15 + hy, 9.2, 5.2, 0, Math.PI, 0);
              ctx.fill();
              ctx.beginPath();
              ctx.moveTo(-9.4, -16.6 + hy);
              [-7.2, -4.4, -1.6, 1.4, 4.2, 7.1].forEach((x, i) => {
                ctx.lineTo(x + 1, (-22.5 - (i % 2) * 4) + hy);
                ctx.lineTo(x + 2.2, -16.6 + hy);
              });
              ctx.closePath();
              ctx.fill();
              break;
            case "hair-8": // Regal Braided Crown — beaded braid arc over the crown
              ctx.beginPath();
              ctx.ellipse(0, -15.5 + hy, 9.2, 6.1, 0, Math.PI, 0);
              ctx.fill();
              for (let i = 0; i <= 10; i += 1) {
                const angle = Math.PI - (i / 10) * Math.PI;
                const bx = Math.cos(angle) * 7.5;
                const by = -15.5 + hy - Math.sin(angle) * 6.1;
                ctx.beginPath();
                ctx.arc(bx, by, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = i % 2 === 0 ? hairDark : hairColor;
                ctx.fill();
              }
              ctx.fillStyle = hairColor;
              break;
            case "hair-9": // Platinum Valedictorian — long flowing panels both sides
              ctx.beginPath();
              ctx.ellipse(0, -16 + hy, 9.5, 7.1, 0, Math.PI, 0);
              ctx.fill();
              ctx.fillRect(-9.6, -15 + hy, 4.5, 16); // left panel
              ctx.fillRect(5.1, -15 + hy, 4.5, 16); // right panel
              break;
            case "hair-10": // Cyber Matrix Mohawk — standing center fin
              ctx.beginPath();
              ctx.ellipse(0, -14.8 + hy, 9.2, 4.8, 0, Math.PI, 0);
              ctx.fill();
              ctx.beginPath();
              ctx.moveTo(-2.6, -17 + hy);
              ctx.lineTo(-2.2, -27.5 + hy);
              ctx.lineTo(0, -20.5 + hy);
              ctx.lineTo(2.2, -29 + hy);
              ctx.lineTo(4.4, -17 + hy);
              ctx.closePath();
              ctx.fill();
              break;
            case "hair-11": // Crimson Comet Side-Sweep — blazing swept fringe
              ctx.beginPath();
              ctx.ellipse(0, -16 + hy, 9.3, 6.6, 0, Math.PI, 0);
              ctx.fill();
              ctx.beginPath();
              ctx.moveTo(-9.2, -16 + hy);
              ctx.quadraticCurveTo(-2, -25 + hy, 10.2, -19 + hy);
              ctx.lineTo(10.2, -16 + hy);
              ctx.quadraticCurveTo(0, -20.8 + hy, -9.2, -12.6 + hy);
              ctx.closePath();
              ctx.fill();
              break;
            case "hair-12": // Examiner's Silver Sweep — polished angled flat-top sweep
              ctx.beginPath();
              ctx.roundRect(-8.8, -22.6 + hy, 17.6, 6.4, 1.6);
              ctx.fill();
              ctx.fillRect(-8.8, -17.6 + hy, 17.6, 2.2);
              break;
            case "hair-13": // Chairman's Platinum Wave — layered swept waves
              ctx.beginPath();
              ctx.ellipse(0, -16.4 + hy, 9.4, 6.8, 0, Math.PI, 0);
              ctx.fill();
              ctx.beginPath();
              ctx.moveTo(-9, -18.5 + hy);
              ctx.quadraticCurveTo(-4.5, -25.5 + hy, 0.5, -19.5 + hy);
              ctx.quadraticCurveTo(5.5, -25.5 + hy, 9.4, -18 + hy);
              ctx.lineTo(9.4, -15.5 + hy);
              ctx.quadraticCurveTo(4.5, -20.5 + hy, 0.5, -15 + hy);
              ctx.quadraticCurveTo(-4.5, -20.5 + hy, -9, -14.5 + hy);
              ctx.closePath();
              ctx.fill();
              break;
            case "hair-14": // Obsidian Twilight Perm — dense dark coil crown
              [[-8.4, -15.6, 3.4], [-5.2, -20, 3.9], [-0.8, -22.2, 4.2], [3.8, -20.4, 4], [8, -15.8, 3.6]].forEach(([x, y, r]) => {
                ctx.beginPath();
                ctx.arc(x, y + hy, r, 0, Math.PI * 2);
                ctx.fill();
              });
              ctx.beginPath();
              ctx.ellipse(0, -13.6 + hy, 9.3, 4.8, 0, Math.PI, 0);
              ctx.fill();
              break;
            case "hair-15": // Quantum Gradient Fade — sharp high-top glow block
              ctx.shadowColor = "#22D3EE";
              ctx.shadowBlur = 6;
              ctx.beginPath();
              ctx.roundRect(-7.4, -25.5 + hy, 14.8, 10.5, 2.6);
              ctx.fill();
              ctx.shadowBlur = 0;
              break;
            default: // Fallback — neat dome with a fringe sweep
              ctx.beginPath();
              ctx.ellipse(0, -16.5 + hy, 9.2, 6.8, 0, Math.PI, 0);
              ctx.fill();
              ctx.fillRect(-2, -21 + hy, 10, 4);
          }
        }
      } else {
        // Emoji Sprite Character (Flipped to face right)
        if (currentChar.flipSprite) {
          ctx.scale(-1, 1);
        }
        ctx.font = "38px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(currentChar.icon, 0, runBob);
      }

      // Draw Quantum Jetpack on Player's back if equipped or flying
      if (hasJetpack) {
        ctx.save();
        ctx.fillStyle = "#1e293b";
        ctx.strokeStyle = isFlying ? "#38bdf8" : "#475569";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(-16, -11 + runBob, 7, 18, [2]);
        ctx.fill();
        ctx.stroke();

        // Cyan reactor core LED
        ctx.fillStyle = isFlying ? "#22d3ee" : "#0284c7";
        ctx.shadowColor = "#22d3ee";
        ctx.shadowBlur = isFlying ? 14 : 3;
        ctx.beginPath();
        ctx.arc(-12.5, -2 + runBob, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Animated rocket exhaust thrust flames when flying
        if (isFlying) {
          const flameLength = 16 + Math.random() * 14;
          // Outer blazing orange plume
          ctx.fillStyle = "#f97316";
          ctx.shadowColor = "#ef4444";
          ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.moveTo(-16, 7 + runBob);
          ctx.lineTo(-12.5, 7 + runBob + flameLength);
          ctx.lineTo(-9, 7 + runBob);
          ctx.closePath();
          ctx.fill();

          // Inner high-temp cyan core
          ctx.fillStyle = "#e0f2fe";
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.moveTo(-15, 7 + runBob);
          ctx.lineTo(-12.5, 7 + runBob + flameLength * 0.6);
          ctx.lineTo(-10, 7 + runBob);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      ctx.restore();

      // Player Shadow (scales based on flight height)
      const altitude = Math.max(0, groundY - p.height - p.y);
      const shadowScale = Math.max(0.28, 1 - altitude / 180);
      ctx.save();
      ctx.fillStyle = `rgba(0,0,0,${(0.35 * shadowScale).toFixed(2)})`;
      ctx.beginPath();
      ctx.ellipse(p.x + p.width / 2, groundY + 4, 16 * shadowScale, 5 * shadowScale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 5. Draw Boss on the Right
      const bossX = canvas.width - 95;
      const bossY = groundY - 85 + Math.sin(Date.now() / 250) * 8;

      ctx.save();
      ctx.font = "68px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Boss Hit Flash
      if (bossHitFlashRef.current > 0) {
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 25;
        bossHitFlashRef.current--;
      }

      ctx.fillText(activeBoss.icon, bossX, bossY + 30);
      ctx.restore();

      // 6. BOSS FIRES MOVING ATTACK PROJECTILES (MULTI-TIER HEIGHTS, CLEAR & FAIR)
      const timeSinceNormalAttack = Date.now() - lastBossNormalAttackTimeRef.current;
      if (timeSinceNormalAttack >= combatBoss.attackCadenceMs) {
        lastBossNormalAttackTimeRef.current = Date.now();
        playBossAttackSound();

        const spawnProjectile = (forceTier?: ProjectileHeightTier) => {
          let tier: ProjectileHeightTier = forceTier || "low";
          if (!forceTier) {
            const r = Math.random();
            if (selectedDifficulty === "foundation") {
              // Foundation: clear choice: low (jump!) or high (duck/stand safely)
              tier = r < 0.55 ? "low" : "high";
            } else if (selectedDifficulty === "higher") {
              tier = r < 0.45 ? "low" : r < 0.75 ? "high" : "mid";
            } else {
              tier = r < 0.35 ? "low" : r < 0.65 ? "high" : r < 0.85 ? "mid" : "wave";
            }
          }

          // Fair, intuitive, and readable heights:
          // groundY = 230. Standing player head is at y = 186.
          // Jump height: player rises to y <= 50!
          let projectileY = groundY - 20; // Low: ground hazard. JUMP cleanly clears by 70+ px!
          let baseY = groundY - 20;
          let waveAmp = 22;
          let waveFreq = 0.025;

          if (tier === "high") {
            // High: Flies high overhead at y = 134.
            // Standing player head is at 186, so high flies 32px safely over player's head!
            // Player stays grounded and projectile passes harmlessly!
            projectileY = groundY - 96;
            baseY = groundY - 96;
          } else if (tier === "mid") {
            // Mid: Torso level. Can be destroyed by shooting 'F' or flown over with Jetpack!
            projectileY = groundY - 50;
            baseY = groundY - 50;
          } else if (tier === "wave") {
            // Wave: Smooth, gentle sinusoidal wave
            baseY = groundY - 60;
            projectileY = baseY;
            waveAmp = 22;
            waveFreq = 0.025;
          }

          bossAttacksRef.current.push({
            x: bossX - 25,
            y: projectileY,
            baseY,
            vx: -Math.min(combatBoss.projectileSpeed, 9.5), // scales with boss rage, still dodgeable
            width: 24,
            height: 20,
            icon: combatBoss.projectileIcon,
            id: Math.random(),
            rotation: 0,
            tier,
            waveAmp,
            waveFreq,
          });
        };

        spawnProjectile();

        // Staggered Salvo only on Nightmare Tier and spaced by 1400ms so it is never an unfair wall
        if (selectedDifficulty === "nightmare" && Math.random() < 0.2) {
          const compTier: ProjectileHeightTier = Math.random() < 0.5 ? "high" : "low";
          salvoTimerRef.current = window.setTimeout(() => spawnProjectile(compTier), 1400);
        }
      }

      // 7. Update & Draw Boss Attacks (Multi-Tier Heights)
      for (let i = bossAttacksRef.current.length - 1; i >= 0; i--) {
        const ba = bossAttacksRef.current[i];
        ba.x += ba.vx;
        ba.rotation += 0.12;

        if (ba.tier === "wave") {
          const waveDist = (canvas.width - ba.x) * (ba.waveFreq || 0.025);
          ba.y = ba.baseY + Math.sin(waveDist) * (ba.waveAmp || 22);
        }

        // Draw Telemetry Trail based on Height Tier
        ctx.save();
        if (ba.tier === "low") {
          // Low ground skimmer: fiery ground friction sparks (JUMP TO CLEAR!)
          ctx.strokeStyle = "rgba(239, 68, 68, 0.75)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(ba.x + ba.width, groundY - 2);
          ctx.lineTo(ba.x + ba.width + 16, groundY - 2);
          ctx.stroke();
        } else if (ba.tier === "mid") {
          // Mid torso: shootable orange energy rings (SHOOT WITH 'F' OR FLY!)
          ctx.strokeStyle = "rgba(245, 158, 11, 0.6)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(ba.x + ba.width + 6, ba.y + ba.height / 2, 8, -Math.PI / 2, Math.PI / 2);
          ctx.stroke();
        } else if (ba.tier === "high") {
          // High swooper: cyan aerodynamic wind trails (SAFE TO STAND UNDER!)
          ctx.strokeStyle = "rgba(6, 182, 212, 0.65)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(ba.x + ba.width, ba.y + ba.height / 2);
          ctx.lineTo(ba.x + ba.width + 24, ba.y + ba.height / 2);
          ctx.stroke();
        } else if (ba.tier === "wave") {
          // Undulating wave: purple sine trajectory trail
          ctx.strokeStyle = "rgba(192, 132, 252, 0.55)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let k = 0; k <= 24; k += 6) {
            const tx = ba.x + ba.width + k;
            const ty =
              ba.baseY + Math.sin((canvas.width - tx) * (ba.waveFreq || 0.025)) * (ba.waveAmp || 22) + ba.height / 2;
            if (k === 0) ctx.moveTo(tx, ty);
            else ctx.lineTo(tx, ty);
          }
          ctx.stroke();
        }
        ctx.restore();

        // Projectile Icon & Glowing Aura
        ctx.save();
        ctx.translate(ba.x + ba.width / 2, ba.y + ba.height / 2);
        ctx.rotate(ba.rotation);

        let auraColor = activeBoss.color;
        if (ba.tier === "low") auraColor = "#ef4444";
        else if (ba.tier === "mid") auraColor = "#f59e0b";
        else if (ba.tier === "high") auraColor = "#06b6d4";
        else if (ba.tier === "wave") auraColor = "#c084fc";

        ctx.shadowColor = auraColor;
        ctx.shadowBlur = 12;
        ctx.font = "22px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(ba.icon, 0, 0);
        ctx.restore();

        // Fair Core Hurtbox Collision Detection (with Grace Period i-frames)
        const isInvincible = now < playerInvincibleUntilRef.current;
        if (!isInvincible) {
          const pHurt = {
            x: p.x + 8,
            y: p.y + 6,
            w: p.width - 16,
            h: p.height - 12,
          };
          const bHit = {
            x: ba.x + 4,
            y: ba.y + 4,
            w: ba.width - 8,
            h: ba.height - 8,
          };

          if (
            pHurt.x < bHit.x + bHit.w &&
            pHurt.x + pHurt.w > bHit.x &&
            pHurt.y < bHit.y + bHit.h &&
            pHurt.y + pHurt.h > bHit.y
          ) {
            bossAttacksRef.current.splice(i, 1);
            playerInvincibleUntilRef.current = now + 850; // 0.85s grace period
            playHitSound();

            const dmg = currentArmour.damagePerHit;
            const health = Math.max(0, playerHpRef.current - dmg);
            if (health > 0) {
              updatePlayerHp(health);
            } else if (extraLives > 0) {
              setExtraLives((lives) => lives - 1);
              updatePlayerHp(maxPlayerHp);
              addFloatingText("Extra life used", 150, 100, "#10b981");
            } else {
              updatePlayerHp(0);
              setGameState("game_over");
              ctx.restore();
              return;
            }
            addFloatingText(`-${dmg} HP! (Armour: ${currentArmour.name})`, p.x, p.y - 12, "#ef4444");
            continue;
          }
        }

        if (ba.x + ba.width < 0) {
          bossAttacksRef.current.splice(i, 1);
          setScore((s) => s + 15);
        }
      }

      // 8. Update & Draw Player Projectiles (Ink Darts) + Counter-Fire Deflection!
      for (let i = playerProjectilesRef.current.length - 1; i >= 0; i--) {
        const proj = playerProjectilesRef.current[i];
        proj.x += proj.vx;

        ctx.save();
        ctx.fillStyle = proj.color;
        ctx.shadowColor = proj.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Check Counter-Fire Deflection: Player shot destroys incoming boss projectile!
        let deflected = false;
        for (let j = bossAttacksRef.current.length - 1; j >= 0; j--) {
          const ba = bossAttacksRef.current[j];
          const dist = Math.hypot(proj.x - (ba.x + ba.width / 2), proj.y - (ba.y + ba.height / 2));
          if (dist < 24) {
            bossAttacksRef.current.splice(j, 1);
            playerProjectilesRef.current.splice(i, 1);
            playHitSound();
            addFloatingText("DEFLECTED! 💥", ba.x, ba.y - 12, "#38bdf8");
            setScore((s) => s + 30);
            deflected = true;
            break;
          }
        }
        if (deflected) continue;

        // Hit Boss!
        if (proj.x >= bossX - 25) {
          playerProjectilesRef.current.splice(i, 1);
          playBossHurtSound();
          bossHitFlashRef.current = 3;
          const baseDamage = Math.round(18 * studyStats.damageMultiplier);
          remainingBossHp = Math.max(0, remainingBossHp - baseDamage);
          setBossHp(remainingBossHp);
          setScore((s) => s + 35);
          addFloatingText(`-${baseDamage} Hit!`, bossX - 20, bossY - 20, "#38bdf8");

          if (remainingBossHp <= 0) {
            finishStage();
            ctx.restore();
            return;
          }
          continue;
        }

        if (proj.x > canvas.width) {
          playerProjectilesRef.current.splice(i, 1);
        }
      }

      // 10. Check Boss Special Attack Interval -> Triggers Question Attack
      const timeSinceLastQuestion = Date.now() - lastQuestionAttackTimeRef.current;
      if (timeSinceLastQuestion >= combatBoss.attackIntervalMs) {
        lastQuestionAttackTimeRef.current = Date.now();
        triggerQuestionAttack();
        ctx.restore();
        return;
      }

      setQuestionEta(Math.max(0, Math.ceil((combatBoss.attackIntervalMs - timeSinceLastQuestion) / 1000)));
      if (timeSinceLastQuestion >= combatBoss.attackIntervalMs - 2200) {
        setBossAttackCharging(true);
      } else {
        setBossAttackCharging(false);
      }

      ctx.restore(); // Restore screen shake transform
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);
    return () => {
      running = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    gameState,
    bossHp,
    currentArmour,
    currentChar,
    activeBoss,
    studyStats,
    extraLives,
    maxPlayerHp,
    activeSkin,
    activeHair,
    activeTop,
    activeBottom,
    activeShoe,
    hasJetpack,
    selectedDifficulty,
    stageCount,
    combatBoss,
  ]);

  // Mod Purchase Handlers
  const handleBuyArmour = (armour: ArmourItem) => {
    if (coins < armour.cost) return;
    const newCoins = coins - armour.cost;
    setCoins(newCoins);
    localStorage.setItem("ecbiz_study_coins", String(newCoins));

    const updated = [...unlockedArmour, armour.id];
    setUnlockedArmour(updated);
    localStorage.setItem("ecbiz_unlocked_armour", JSON.stringify(updated));

    setEquippedArmourId(armour.id);
    localStorage.setItem("ecbiz_armour_id", armour.id);
    playCritSound();
  };

  const handleEquipArmour = (id: string) => {
    setEquippedArmourId(id);
    localStorage.setItem("ecbiz_armour_id", id);
    playJumpSound();
  };

  const handleBuyCharacter = (char: CharacterSkin) => {
    if (coins < char.cost) return;
    const newCoins = coins - char.cost;
    setCoins(newCoins);
    localStorage.setItem("ecbiz_study_coins", String(newCoins));

    const updated = [...unlockedChars, char.id];
    setUnlockedChars(updated);
    localStorage.setItem("ecbiz_unlocked_chars", JSON.stringify(updated));

    setEquippedCharId(char.id);
    localStorage.setItem("ecbiz_char_id", char.id);
    playCritSound();
  };

  const handleEquipChar = (id: string) => {
    setEquippedCharId(id);
    localStorage.setItem("ecbiz_char_id", id);
    playJumpSound();
  };

  const AMMO_LADDER: { from: number; to: number; cost: number }[] = [
    { from: 20, to: 35, cost: 60 },
    { from: 35, to: 50, cost: 140 },
    { from: 50, to: 65, cost: 240 },
    { from: 65, to: 80, cost: 340 },
    { from: 80, to: 100, cost: 480 },
  ];
  const nextAmmoTier = AMMO_LADDER.find((tier) => tier.from === maxAmmo);

  const handleUpgradeMaxAmmo = () => {
    if (!nextAmmoTier) return;
    if (coins < nextAmmoTier.cost) return;
    const newCoins = coins - nextAmmoTier.cost;
    setCoins(newCoins);
    localStorage.setItem("ecbiz_study_coins", String(newCoins));

    const newMax = nextAmmoTier.to;
    setMaxAmmo(newMax);
    localStorage.setItem("ecbiz_max_ammo", String(newMax));
    setAmmo(newMax);
    playCritSound();
  };

  // Boss HP percentages for visual health bar
  const bossHpPercent = Math.max(0, Math.min(100, (bossHp / activeBoss.maxHp) * 100));
  const bossGhostHpPercent = Math.max(0, Math.min(100, (bossGhostHp / activeBoss.maxHp) * 100));
  const isEnraged = bossHpPercent <= 60 && bossHpPercent > 30;
  const isCritical = bossHpPercent <= 30;
  // A strong run (3+ streak or boss pushed below 40% HP) unlocks one revive trial.
  const canRevive = !reviveUsed && (bestStreak >= 3 || bossHpPercent <= 40);

  const isQuestionRound = gameState === "question_attack" || gameState === "revive_challenge";

  return (
    <div className="boss-page">
      <header className="boss-topbar">
        <button type="button" className="boss-quiet" onClick={onBackToStudio}>
          <ArrowLeft size={16} aria-hidden="true" /> Business overview
        </button>
        <div className="boss-topbar-actions">
          <span className="boss-coins" aria-label={`${coins} study coins`}>◎ {coins} coins</span>
          <button type="button" className="boss-quiet" aria-label={soundEnabled ? "Mute game audio" : "Unmute game audio"} onClick={() => setSoundEnabled(!soundEnabled)}>
            {soundEnabled ? <Volume2 size={17} aria-hidden="true" /> : <VolumeX size={17} aria-hidden="true" />}
          </button>
          {(gameState === "idle" || gameState === "shop") && (
            <button type="button" className="boss-quiet" onClick={() => setGameState(gameState === "shop" ? "idle" : "shop")}>
              <ShoppingBag size={16} aria-hidden="true" /> {gameState === "shop" ? "Battle lobby" : "Armour shop"}
            </button>
          )}
        </div>
      </header>

      {gameState === "idle" && (
        <>
          <section className="boss-lobby-hero" aria-labelledby="boss-lobby-title">
            <div className="boss-hero-copy">
              <p>IGCSE BUSINESS</p>
              <h1 id="boss-lobby-title">Boss Battle</h1>
              <div>Dodge attacks and answer Business questions to deal damage and earn Study Coins.</div>
              <button type="button" className="boss-cta" onClick={() => handleStartGame()}>
                <Swords size={20} aria-hidden="true" /> Start battle <ArrowRight size={19} aria-hidden="true" />
              </button>
            </div>
          </section>

          <div className="boss-lobby-grid">
            <section className="boss-lobby-panel" aria-labelledby="boss-picker-title">
              <div className="boss-panel-heading">
                <h2 id="boss-picker-title">Choose a boss</h2>
                {activeBoss.loop > 1 && <span>Loop {activeBoss.loop}</span>}
              </div>
              <div role="group" aria-label="Select boss" className="boss-picker">
                {BASE_BOSSES.map((boss, index) => {
                  const stage = index + 1 + (activeBoss.loop - 1) * BASE_BOSSES.length;
                  return (
                    <button key={boss.id} type="button" aria-pressed={currentBossIndex === index} onClick={() => selectMatch(stage, selectedDifficulty)}>
                      <span className="boss-picker-icon" aria-hidden="true">{boss.icon}</span>
                      <span><strong>{boss.name}</strong><small>Stage {stage}</small></span>
                      <ChevronRight size={16} aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="boss-lobby-panel" aria-labelledby="boss-difficulty-title">
              <div className="boss-panel-heading"><h2 id="boss-difficulty-title">Difficulty</h2></div>
              <div className="boss-difficulty" role="group" aria-label="Battle difficulty">
                {Object.values(DIFFICULTY_TIERS).map((difficulty) => (
                  <button key={difficulty.id} type="button" aria-pressed={difficulty.id === selectedDifficulty} onClick={() => selectMatch(stageCount, difficulty.id)}>
                    <span style={{ backgroundColor: difficulty.color }} aria-hidden="true" />
                    <strong>{difficulty.label}</strong>
                    <small>{difficulty.rewardMult}× rewards</small>
                  </button>
                ))}
              </div>
              <p className="boss-difficulty-hint">{DIFFICULTY_TIERS[selectedDifficulty].description}</p>
              <div className="boss-selected-match">
                <span>{activeBoss.icon} <strong>{activeBoss.name}</strong></span>
                <span>{activeBoss.maxHp} HP</span>
              </div>
              <div className="boss-lobby-actions">
                <button type="button" className="boss-quiet" onClick={() => setShowCustomizerModal(true)}><Palette size={16} aria-hidden="true" /> Wardrobe</button>
                {stageCount > 1 && (
                  <button type="button" className="boss-quiet" onClick={() => selectMatch(1, selectedDifficulty)}><RotateCcw size={16} aria-hidden="true" /> Select Stage 1</button>
                )}
                {onOpenReview && (
                  <button type="button" className="boss-quiet" onClick={onOpenReview}>
                    <ClipboardList size={16} aria-hidden="true" /> Review mistakes ({reviewCount})
                  </button>
                )}
              </div>
            </section>
          </div>

          {/* Question focus panel — unit / subsection / focus mode filters */}
          <section className="boss-lobby-panel boss-filters-panel" aria-labelledby="boss-filters-title">
            <div className="boss-panel-heading">
              <h2 id="boss-filters-title">Question focus</h2>
              <span>{bossFilter.focus === "missed" ? `${missedCount.toLocaleString()} missed questions` : `${poolCount.toLocaleString()} in the pool`}</span>
            </div>

            <div className="boss-filters-grid">
              <fieldset className="boss-filter-fieldset">
                <legend>Units</legend>
                <div className="boss-filter-chips" role="group" aria-label="Filter by unit">
                  <button
                    type="button"
                    className={`boss-filter-chip${bossFilter.units.length === 0 ? " is-on" : ""}`}
                    aria-pressed={bossFilter.units.length === 0}
                    onClick={() => updateFilter({ units: [], subsection: "all" })}
                  >
                    All
                  </button>
                  {UNIT_OPTIONS.map((unit) => {
                    const pressed = bossFilter.units.includes(unit.code);
                    return (
                      <button
                        key={unit.code}
                        type="button"
                        className={`boss-filter-chip${pressed ? " is-on" : ""}`}
                        aria-pressed={pressed}
                        title={unit.label}
                        onClick={() => {
                          const next = pressed
                            ? bossFilter.units.filter((u) => u !== unit.code)
                            : [...bossFilter.units, unit.code].sort((a, b) => Number(a) - Number(b));
                          updateFilter({ units: next, subsection: "all" });
                        }}
                      >
                        U{unit.code}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <label className="boss-filter-field">
                <span>Subsection</span>
                <select
                  className="boss-filter-select"
                  value={bossFilter.subsection}
                  onChange={(event) => updateFilter({ subsection: event.target.value })}
                >
                  <option value="all">All subsections ({subsections.reduce((total, s) => total + s.count, 0).toLocaleString()})</option>
                  {subsections.map((sub) => (
                    <option key={sub.code} value={sub.code}>
                      {sub.chapter} ({sub.count})
                    </option>
                  ))}
                </select>
              </label>

              <label className="boss-filter-field">
                <span>Focus mode</span>
                <select
                  className="boss-filter-select"
                  value={bossFilter.focus}
                  onChange={(event) => updateFilter({ focus: event.target.value as BossFocusMode })}
                >
                  <option value="all">All questions</option>
                  <option value="missed">Previously missed{missedCount > 0 ? ` (${missedCount})` : ""}</option>
                  <option value="definitions">Definitions &amp; key terms</option>
                  <option value="calculations">Calculations &amp; formulas</option>
                  <option value="application">Application &amp; analysis</option>
                </select>
              </label>
            </div>

            <div className="boss-filters-foot">
              <span>{questionSeconds}s per question on {TIER_LABELS[selectedDifficulty]} (tightens each stage) · questions escalate as the stage rises</span>
              {poolCount < 20 && (
                <span className="boss-filter-warning" role="status">
                  Only {poolCount.toLocaleString()} question{poolCount === 1 ? "" : "s"} match — broaden the filters for a varied fight.
                </span>
              )}
              {bossFilter.focus === "missed" && missedCount === 0 && (
                <span className="boss-filter-warning" role="status">
                  No missed questions yet — misses are banked here and resurface until you master them.
                </span>
              )}
              <span>
                Wrong answers also go to the Review page, where you can practise them and choose
                whether to add them to MCQ Wrong Only.
              </span>
            </div>
          </section>
        </>
      )}

      {/* MOD UPGRADE SHOP VIEW */}
      {gameState === "shop" ? (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xl space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <span>🛒 Armour & Mods Upgrades</span>
                <span className="text-xs bg-amber-500/20 text-amber-600 dark:text-amber-300 px-2.5 py-0.5 rounded-full font-mono">
                  Balance: {coins} Coins
                </span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Better armour reduces hit damage taken from boss strikes and moving projectiles.
              </p>
            </div>
            <button
              onClick={() => setGameState("idle")}
              className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl text-xs font-semibold text-neutral-800 dark:text-white cursor-pointer"
            >
              Exit Shop
            </button>
          </div>

          {/* Armour Shop */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              🛡️ Protection Armour (Reduces Hit Damage)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {ARMOUR_TIERS.map((armour) => {
                const isUnlocked = unlockedArmour.includes(armour.id);
                const isEquipped = equippedArmourId === armour.id;
                const canAfford = coins >= armour.cost;

                return (
                  <div
                    key={armour.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                      isEquipped
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md ring-2 ring-emerald-500/20"
                        : isUnlocked
                        ? "border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/40"
                        : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 opacity-90"
                    }`}
                  >
                    <div>
                      <div className="text-3xl mb-2">{armour.icon}</div>
                      <div className="font-bold text-sm text-neutral-900 dark:text-white">{armour.name}</div>
                      <div className="text-xs text-rose-600 dark:text-rose-400 font-mono font-semibold mt-1">
                        Takes {armour.damagePerHit} Dmg / Hit
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2">{armour.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                      {isEquipped ? (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          ✓ Equipped
                        </span>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => handleEquipArmour(armour.id)}
                          className="px-3 py-1 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-xs font-semibold rounded-lg text-neutral-900 dark:text-white transition cursor-pointer"
                        >
                          Equip
                        </button>
                      ) : (
                        <button
                          disabled={!canAfford}
                          onClick={() => handleBuyArmour(armour)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                            canAfford
                              ? "bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                              : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
                          }`}
                        >
                          <span>Buy for {armour.cost} 🪙</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Characters & Skins Shop */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              🎭 Character Skins (Who You Play As)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {CHARACTERS.map((char) => {
                const isUnlocked = unlockedChars.includes(char.id);
                const isEquipped = equippedCharId === char.id;
                const canAfford = coins >= char.cost;

                return (
                  <div
                    key={char.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                      isEquipped
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md ring-2 ring-emerald-500/20"
                        : isUnlocked
                          ? "border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/40"
                          : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 opacity-90"
                    }`}
                  >
                    <div>
                      <div className="text-4xl mb-2">{char.icon}</div>
                      <div className="font-bold text-sm text-neutral-900 dark:text-white">{char.name}</div>
                      {char.id === "custom" && (
                        <p className="text-[11px] text-sky-600 dark:text-sky-300 mt-1">Customise in the Wardrobe (top bar / after battle)</p>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                      {isEquipped ? (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          ✓ Equipped
                        </span>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => handleEquipChar(char.id)}
                          className="px-3 py-1 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-xs font-semibold rounded-lg text-neutral-900 dark:text-white transition cursor-pointer"
                        >
                          Equip
                        </button>
                      ) : (
                        <button
                          disabled={!canAfford}
                          onClick={() => handleBuyCharacter(char)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                            canAfford
                              ? "bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                              : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
                          }`}
                        >
                          <span>Buy for {char.cost} 🪙</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ammo & Bandolier Shop */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              🎯 Ammo Capacity & Refills
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/40 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                    <span>Expanded Ammo Bandolier</span>
                    <span className="text-xs bg-sky-500/20 text-sky-600 dark:text-sky-300 px-2 py-0.5 rounded-full font-mono">
                      Current: {maxAmmo} Max
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Increases maximum carried ink darts. Upgrades climb to 100 (+15 each tier, prices rise).
                  </p>
                </div>
                <button
                  disabled={!nextAmmoTier || coins < nextAmmoTier.cost}
                  onClick={handleUpgradeMaxAmmo}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition shrink-0 ml-4 cursor-pointer"
                >
                  {nextAmmoTier ? `Upgrade (+${nextAmmoTier.to - nextAmmoTier.from}) · ${nextAmmoTier.cost} 🪙` : "Maxed out · 100 🎉"}
                </button>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/40 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-neutral-900 dark:text-white">
                    Emergency Full Ammo Refill
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Refill all {maxAmmo} ammo immediately for battle.
                  </p>
                </div>
                <button
                  disabled={coins < 15 || ammo >= maxAmmo}
                  onClick={handleRefillAmmo}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition shrink-0 ml-4 cursor-pointer"
                >
                  Refill Ammo · 15 🪙
                </button>
              </div>
            </div>
          </div>

          {/* Quantum Scholar Jetpack & Aeronautics Shop */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
              <Rocket className="w-4 h-4 text-cyan-500" />
              <span>🚀 Aeronautics & Kinetic Gadgets</span>
            </h3>
            <div className="p-4 sm:p-5 rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/25 via-neutral-900/60 to-blue-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="text-3xl sm:text-4xl p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 shrink-0">
                  🚀
                </div>
                <div>
                  <div className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white flex items-center gap-2">
                    <span>Quantum Scholar Jetpack</span>
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                      3.0s Aerial Flight
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 max-w-lg leading-relaxed">
                    Sustained rocket propulsion! Defies gravity to fly smoothly over ground obstacles, torso projectiles, and undulating sine-wave attacks. Press <strong>Shift</strong> or <strong>W</strong> in combat.
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center">
                {hasJetpack ? (
                  <span className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs">
                    ✓ Unlocked & Equipped
                  </span>
                ) : (
                  <button
                    onClick={handleBuyJetpack}
                    disabled={coins < JETPACK_COST}
                    className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition shadow-lg cursor-pointer"
                  >
                    Buy Jetpack · {JETPACK_COST} 🪙
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : gameState !== "idle" && (
        <div className="boss-match">
          <div className="boss-match-bar">
            <div>
              <p className="boss-match-meta">Stage {stageCount} · {DIFFICULTY_TIERS[selectedDifficulty].label}</p>
              <h1>{activeBoss.name}</h1>
            </div>
            <div className="boss-match-actions">
              <span>{score.toLocaleString()} score</span>
              {gameState === "playing" && (
                <button type="button" className="boss-quiet" onClick={pauseBattle}><Pause size={16} aria-hidden="true" /> Pause</button>
              )}
              {(gameState === "game_over" || gameState === "boss_defeated") && (
                <button type="button" className="boss-quiet" onClick={() => setGameState("idle")}>Battle lobby</button>
              )}
            </div>
          </div>
          <div className="boss-match-hud">
          {/* ============================================================ */}
          {/* PROMINENT VISUAL BOSS HEALTH BAR (DECREASES DYNAMICALLY)      */}
          {/* ============================================================ */}
          <div className="boss-enemy-hud relative overflow-hidden text-white">
            {/* Background animated boss aura */}
            <div
              className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-500"
              style={{ backgroundColor: activeBoss.color }}
            />

            {/* Boss Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl filter drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
                  {activeBoss.icon}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base sm:text-lg tracking-wide uppercase font-academic-serif">
                      {activeBoss.name}
                    </span>
                    {/* Phase indicator badge */}
                    {isCritical ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1 animate-pulse">
                        <Flame className="w-3 h-3 text-rose-500" />
                        CRITICAL DESPERATION PHASE
                      </span>
                    ) : isEnraged ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        ENRAGED PHASE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        STAGE {stageCount} · LOOP {activeBoss.loop}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                        rageLevel > 0
                          ? "bg-orange-500/20 text-orange-400 border-orange-500/40"
                          : "bg-neutral-700/40 text-neutral-400 border-neutral-600"
                      }`}
                      title="Every correct answer enrages the boss: faster projectiles and shorter attack intervals."
                    >
                      ⚡ THREAT LV {rageLevel}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono">
                    {activeBoss.scaledTitle}
                  </div>
                </div>
              </div>

              {/* Dynamic Health Text Display */}
              <div className="text-right sm:text-right font-mono">
                <div className="text-xl sm:text-2xl font-black text-rose-400 tracking-tight">
                  {bossHp} <span className="text-xs font-normal text-neutral-400">/ {activeBoss.maxHp} HP</span>
                </div>
                <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
                  {Math.round(bossHpPercent)}% Health Remaining
                </div>
              </div>
            </div>

            {/* DUAL-LAYER VISUAL BOSS HEALTH BAR */}
            <div role="progressbar" aria-label="Boss health" aria-valuemin={0} aria-valuemax={activeBoss.maxHp} aria-valuenow={bossHp} className="relative w-full h-6 sm:h-7 bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-700/80 shadow-inner p-0.5">
              {/* Segment markers (25%, 50%, 75%) */}
              <div className="absolute inset-0 pointer-events-none z-20 flex justify-between px-[25%] opacity-40">
                <div className="w-0.5 h-full bg-white/40 shadow-xs" />
                <div className="w-0.5 h-full bg-white/40 shadow-xs" />
              </div>

              {/* 1. Trailing Ghost Health Bar (Smoothly catches up after damage strike) */}
              <div
                className="absolute top-0.5 bottom-0.5 left-0.5 rounded-xl transition-all duration-700 ease-out bg-gradient-to-r from-amber-500 via-orange-500 to-rose-400 opacity-70"
                style={{ width: `${bossGhostHpPercent}%` }}
              />

              {/* 2. Main Foreground Dynamic Health Bar (Drops immediately on question hit) */}
              <div
                className={`relative h-full rounded-xl transition-all duration-150 ease-out z-10 shadow-lg ${
                  isCritical
                    ? "bg-gradient-to-r from-rose-600 via-red-500 to-rose-400 animate-pulse"
                    : isEnraged
                    ? "bg-gradient-to-r from-amber-600 via-orange-500 to-amber-400"
                    : "bg-gradient-to-r from-cyan-600 via-blue-500 to-sky-400"
                }`}
                style={{ width: `${bossHpPercent}%` }}
              >
                {/* Shiny diagonal gloss */}
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.25)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.25)_50%,rgba(255,255,255,0.25)_75%,transparent_75%,transparent)] bg-[length:24px_24px] opacity-40" />
              </div>
            </div>

            {/* Boss Attack Status Notification */}
            <div className="flex items-center justify-between text-xs mt-2 text-neutral-400 font-mono">
              <span className="text-[11px]">
                {bossAttackCharging ? (
                  <span className="text-amber-400 font-bold animate-pulse flex items-center gap-1">
                    ⚡ 129-QUESTION SPECIAL STRIKE CHARGING!
                  </span>
                ) : (
                  <span>Next Special Strike: Timed Business Question</span>
                )}
              </span>
              <span className="text-[11px] text-neutral-400">{isQuestionRound ? "Question round" : `Next question in ${questionEta}s`}</span>
            </div>
          </div>

          {/* Player Mini Status */}
          <div className="boss-player-hud">
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentChar.icon}</span>
              <div>
                <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <span>{currentChar.name}</span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                    ({currentArmour.name} · takes {currentArmour.damagePerHit} dmg)
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500">
                  HP: {playerHp} / {maxPlayerHp}
                </div>
              </div>
            </div>

            {/* Player Mini Bar & Ammo */}
            <div className="flex items-center gap-4">
              <div className="w-32 h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden border border-neutral-300 dark:border-neutral-700">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${Math.max(0, (playerHp / maxPlayerHp) * 100)}%` }}
                />
              </div>

              <div className="flex items-center gap-2 font-mono">
                <span>Ammo: {ammo}/{maxAmmo}</span>
                {ammo <= 4 && (
                  <button
                    onClick={handleRefillAmmo}
                    className="px-2 py-0.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-[10px] font-bold cursor-pointer"
                  >
                    Refill 15🪙
                  </button>
                )}
              </div>

              <div className="boss-player-lives"><Heart size={16} aria-hidden="true" /> {extraLives} {extraLives === 1 ? "extra life" : "extra lives"} · {liveTokens}/3 tokens</div>
            </div>
          </div>

          </div>

          {/* 2D CANVAS ARENA VIEW */}
          <div className="boss-canvas-wrap" hidden={isQuestionRound}>
            <canvas
              ref={canvasRef}
              width={760}
              height={270}
              className="boss-canvas"
              tabIndex={gameState === "playing" ? 0 : -1}
              aria-label="Battle arena. Space jumps, F shoots, R refills, and Escape pauses."
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                handleJumpStart();
              }}
              onPointerUp={handleJumpEnd}
              onLostPointerCapture={handleJumpEnd}
              onPointerCancel={handleJumpEnd}
            />

            {/* Active Jetpack Flight HUD Status */}
            {hasJetpack && (
              <div className="absolute top-3 left-3 pointer-events-none z-10 flex items-center gap-2">
                {jetpackActive ? (
                  <div className="px-3 py-1 rounded-full bg-cyan-500/35 border border-cyan-400 text-cyan-100 font-mono text-xs font-black flex items-center gap-1.5 shadow-xl animate-pulse backdrop-blur-md">
                    <Rocket className="w-3.5 h-3.5 text-cyan-300 animate-bounce" />
                    <span>JETPACK ACTIVE: {jetpackTimeLeft}s</span>
                  </div>
                ) : jetpackCooldown > 0 ? (
                  <div className="px-2.5 py-0.5 rounded-full bg-black/60 border border-neutral-700 text-neutral-400 font-mono text-[10px] flex items-center gap-1 backdrop-blur-sm">
                    <span>⏳ Thruster Cool: {jetpackCooldown}s</span>
                  </div>
                ) : (
                  <div className="px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] flex items-center gap-1 backdrop-blur-sm">
                    <Rocket className="w-3 h-3 text-cyan-400" />
                    <span>Jetpack Ready [Shift / W]</span>
                  </div>
                )}
              </div>
            )}

            {/* Floating Damage Text Overlay */}
            {floatingDamage.map((fd) => (
              <div
                key={fd.id}
                style={{ left: `${fd.x}px`, top: `${fd.y}px` }}
                className="absolute pointer-events-none font-extrabold text-sm sm:text-base animate-bounce"
              >
                <span style={{ color: fd.color }} className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {fd.text}
                </span>
              </div>
            ))}

            {gameState === "paused" && (
              <div className="boss-pause">
                <h2>Battle paused</h2>
                <div>
                  <button type="button" ref={resumeRef} className="boss-cta" onClick={resumeBattle}><Play size={16} aria-hidden="true" /> Resume battle</button>
                  <button type="button" className="boss-quiet" onClick={() => setGameState("idle")}>Leave fight</button>
                </div>
              </div>
            )}

            {/* GAME OVER OVERLAY */}
            {gameState === "game_over" && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center text-white animate-fade-in overflow-y-auto">
                <div className="text-4xl mb-1">💀</div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold mb-1">
                  STAGE {stageCount} · LOOP {activeBoss.loop}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-rose-500 mb-1">
                  DEFEATED BY {activeBoss.name.toUpperCase()}
                </h3>

                {canRevive ? (
                  <div className="mb-3 w-full max-w-md rounded-xl border border-emerald-500/50 bg-emerald-950/70 p-3 shadow-lg">
                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      Second Wind Available
                    </div>
                    <p className="mt-1 text-[11px] leading-snug text-emerald-100/90">
                      Best streak {bestStreak} · Boss at {Math.round(bossHpPercent)}% HP. Answer{" "}
                      <strong>{REVIVE_REQUIRED_CORRECT} questions in a row</strong> correctly to
                      revive at full HP. One mistake ends the run for good.
                    </p>
                    <button
                      onClick={startReviveChallenge}
                      className="mt-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-[11px] sm:text-xs rounded-xl shadow-lg transition transform active:scale-95 cursor-pointer"
                    >
                      ⚡ Revive Trial · {REVIVE_REQUIRED_CORRECT} Correct in a Row
                    </button>
                  </div>
                ) : (
                  <p className="max-w-md text-[11px] leading-snug text-neutral-400 mb-3">
                    {reviveUsed
                      ? "Revive trial already used this run."
                      : "Build a 3+ answer streak or push the boss below 40% HP to unlock a revive trial."}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => handleStartGame(stageCount, selectedDifficulty)}
                    className="px-5 py-2.5 bg-white text-black hover:bg-neutral-200 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    ↺ Retry Stage {stageCount}
                  </button>
                  <button
                    onClick={() => handleStartGame(1, selectedDifficulty)}
                    className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Restart from Stage 1
                  </button>
                </div>
              </div>
            )}

            {/* BOSS DEFEATED OVERLAY (INFINITE ASCENSION) */}
            {gameState === "boss_defeated" && (
              <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white animate-fade-in">
                <div className="text-5xl mb-2 animate-bounce">🏆</div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold mb-1">
                  STAGE {stageCount} ASCENSION CONQUERED · LOOP {activeBoss.loop}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-emerald-400 mb-1">
                  {activeBoss.name.toUpperCase()} VANQUISHED!
                </h3>
                <p className="text-xs text-emerald-200 max-w-md mb-2">
                  Outstanding mastery! You fully drained {activeBoss.name}'s health bar on {DIFFICULTY_TIERS[selectedDifficulty].label} Tier!
                </p>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold mb-5 shadow-sm">
                  <span>🪙 +{Math.round((70 + stageCount * 25) * DIFFICULTY_TIERS[selectedDifficulty].rewardMult)} Coins Awarded</span>
                  <span>·</span>
                  <span>⭐ +{Math.round((600 + stageCount * 180) * DIFFICULTY_TIERS[selectedDifficulty].rewardMult)} Score</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => handleStartGame(stageCount + 1, selectedDifficulty, true)}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xl transition transform active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <span>Ascend to Stage {stageCount + 1} (Harder Boss)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleStartGame(stageCount, selectedDifficulty)}
                    className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    ↺ Replay Stage {stageCount}
                  </button>
                  <button
                    onClick={() => setShowCustomizerModal(true)}
                    className="px-4 py-2.5 bg-white text-black hover:bg-neutral-200 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Spend Coins in Wardrobe 🎨
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* TIMED PRODIGY QUESTION ATTACK MODAL / OVERLAY (FROM 129 BUSINESS BANK) */}
          {(gameState === "question_attack" || gameState === "revive_challenge") && activeQuestion && (
            <section
              ref={questionRef}
              tabIndex={-1}
              aria-labelledby="boss-question-title"
              className={`boss-question bg-gradient-to-br from-neutral-900 via-neutral-950 to-black border-2 rounded-2xl p-5 sm:p-6 text-white shadow-2xl ${
                gameState === "revive_challenge" ? "border-emerald-500" : "border-rose-500"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="text-2xl animate-bounce">
                    {gameState === "revive_challenge" ? "❤️" : "⚡"}
                  </span>
                  <div>
                    <div
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                        gameState === "revive_challenge" ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {gameState === "revive_challenge"
                        ? `REVIVE TRIAL · ${reviveCorrect}/${REVIVE_REQUIRED_CORRECT} CORRECT · Q#${activeQuestion.questionNumber}`
                        : "Business question"}
                    </div>
                    <div className="text-xs font-semibold text-neutral-300">
                      {gameState === "revive_challenge"
                        ? `Every answer must be correct. One mistake ends the run for good.`
                        : "A correct answer hits the boss. Choose A–D or press 1–4."}
                    </div>
                  </div>
                </div>

                {/* Countdown Timer */}
                <div
                  className={`px-3 py-1.5 rounded-xl font-mono text-sm font-black flex items-center gap-1.5 border ${
                    questionTimer <= 5
                      ? "bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse"
                      : "bg-neutral-800 border-neutral-700 text-neutral-200"
                  }`}
                >
                  <span>⏱️</span>
                  <span>{questionTimer}s</span>
                </div>
              </div>

              {/* Question Text */}
              <div className="py-4">
                <div className="text-xs font-mono text-sky-400 mb-1 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-bold">
                    0264 / 0450 Business
                  </span>
                  <span>{activeQuestion.chapter}</span>
                </div>
                <h2 id="boss-question-title" className="font-academic-serif text-lg sm:text-2xl font-bold text-white leading-snug">
                  {activeQuestion.question}
                </h2>
                {gameState === "revive_challenge" && (
                  <div className="mt-3 flex items-center gap-1">
                    {Array.from({ length: REVIVE_REQUIRED_CORRECT }).map((_, index) => (
                      <span
                        key={index}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          index < reviveCorrect ? "bg-emerald-400" : "bg-neutral-700"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Question Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeQuestion.options.map((opt, i) => {
                  const isAnswered = questionFeedback !== null;
                  const isCorrect = i === activeQuestion.correctIndex;

                  let btnStyle = "bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700";
                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = "bg-emerald-600 text-white border-emerald-400 shadow-md font-bold";
                    } else {
                      btnStyle = "bg-neutral-900 text-neutral-500 border-neutral-800 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={isAnswered}
                      onClick={() => handleSelectQuestionOption(i)}
                      className={`text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition cursor-pointer ${btnStyle}`}
                    >
                      <span className="font-mono text-sky-400 mr-2 font-bold">{String.fromCharCode(65 + i)}.</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback Banner */}
              {questionFeedback && (
                <div
                  role="status"
                  className={`mt-4 p-3.5 rounded-xl border text-xs leading-relaxed animate-fade-in ${
                    questionFeedback.isCorrect
                      ? "bg-emerald-950/60 border-emerald-500 text-emerald-200"
                      : "bg-rose-950/60 border-rose-500 text-rose-200"
                  }`}
                >
                  <strong className="block font-bold mb-0.5">
                    {questionFeedback.isCorrect ? "Correct" : "Correct answer highlighted above"}
                  </strong>
                  <p>{questionFeedback.text}</p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <FlagQuestionButton questionId={activeQuestion.id} />
                    <button type="button" ref={continueRef} className="boss-cta boss-continue" onClick={continueQuestion}>
                      Continue <ArrowRight size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ONSCREEN CONTROLS */}
          {gameState === "playing" && (
          <div className="boss-controls" role="group" aria-label="Combat controls">
            <button
              type="button"
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                handleJumpStart();
              }}
              onPointerUp={handleJumpEnd}
              onLostPointerCapture={handleJumpEnd}
              onPointerCancel={handleJumpEnd}
              onClick={(event) => { if (event.detail === 0) handleJump(); }}
              className="py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-neutral-700 cursor-pointer active:scale-95 shadow-sm"
              title="Tap or Space to Jump · Hold or Long Press for Jetpack 🚀"
            >
              <span>Jump</span><kbd>Space</kbd>
            </button>

            <button
              onClick={handleShoot}
              className="py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
              title="Press 'F' or click to Shoot (Can destroy enemy projectiles!)"
            >
              <Crosshair className="w-4 h-4" />
              <span>Shoot · {ammo}</span><kbd>F</kbd>
            </button>

            {/* Quantum Scholar Jetpack Button */}
            {hasJetpack ? (
              <button
                onClick={handleActivateJetpack}
                disabled={jetpackActive || jetpackCooldown > 0}
                className={`py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md active:scale-95 border cursor-pointer ${
                  jetpackActive
                    ? "bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white border-cyan-300 ring-2 ring-cyan-400 animate-pulse"
                    : jetpackCooldown > 0
                    ? "bg-neutral-800/80 text-neutral-400 border-neutral-700 cursor-not-allowed opacity-75"
                    : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-cyan-400/50"
                }`}
                title="Activate 3-second sustained rocket flight! (Hold Space or click)"
              >
                <Rocket className={`w-3.5 h-3.5 ${jetpackActive ? "animate-bounce" : ""}`} />
                <span>
                  {jetpackActive
                    ? `FLYING (${jetpackTimeLeft}s)`
                    : jetpackCooldown > 0
                    ? `Cooldown (${jetpackCooldown}s)`
                    : "🚀 JETPACK (Hold Space)"}
                </span>
              </button>
            ) : (
              <button
                onClick={handleBuyJetpack}
                className="py-3 bg-gradient-to-r from-cyan-950 via-neutral-900 to-blue-950 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                title={`Purchase Quantum Jetpack for ${JETPACK_COST} Coins`}
              >
                <Rocket className="w-3.5 h-3.5 text-cyan-400" />
                <span>Get Jetpack ({JETPACK_COST}🪙)</span>
              </button>
            )}

            <button
              onClick={handleRefillAmmo}
              className="py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
              title="Press 'R' key to refill ammo and heal HP!"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refill</span><kbd>R</kbd>
            </button>

          </div>
          )}
        </div>
      )}

      {/* AVATAR WARDROBE & COSMETICS CUSTOMIZER MODAL */}
      <AvatarCustomizerModal
        isOpen={showCustomizerModal}
        onClose={() => setShowCustomizerModal(false)}
        customization={customization}
        onUpdateCustomization={(updated) => {
          setCustomization(updated);
          saveCustomizerState(updated);
        }}
        coins={coins}
        onCoinsUpdated={(newCoins) => {
          setCoins(newCoins);
          localStorage.setItem("ecbiz_study_coins", String(newCoins));
        }}
      />
    </div>
  );
};

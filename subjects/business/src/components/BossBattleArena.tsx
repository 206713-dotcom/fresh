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
  SKIN_TONES,
  HAIR_DESIGNS,
  TOP_DESIGNS,
  BOTTOM_DESIGNS,
  SHOE_DESIGNS,
} from "../lib/data/customizer-items";
import { AvatarCustomizerModal } from "./AvatarCustomizerModal";
import {
  ArrowLeft,
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
  TrendingUp,
  Layers,
  ChevronRight,
  Gauge,
} from "lucide-react";

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
}

function getBusinessBossQuestion(): BossActiveQuestion {
  const target: MCQItem = MCQ_BANK[Math.floor(Math.random() * MCQ_BANK.length)];
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

  const options = [target.correctAnswer, ...distractors.slice(0, 3)];
  const shuffledOptions = [...options].sort(() => 0.5 - Math.random());
  const correctIndex = shuffledOptions.indexOf(target.correctAnswer);

  return {
    id: target.id,
    questionNumber: target.questionNumber,
    chapter: target.chapter,
    question: target.question,
    options: shuffledOptions,
    correctIndex,
    explanation: `Cambridge Mark Scheme: "${target.correctAnswer}"`,
  };
}

interface BossBattleArenaProps {
  onBackToStudio: () => void;
  onOpenPracticeQuestion?: () => void;
}

export const BossBattleArena: React.FC<BossBattleArenaProps> = ({
  onBackToStudio,
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
      return saved ? parseInt(saved, 10) || 1 : 1;
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

  // Game flow states
  const [gameState, setGameState] = useState<"idle" | "playing" | "question_attack" | "game_over" | "boss_defeated" | "shop">("idle");
  const [activeQuestion, setActiveQuestion] = useState<BossActiveQuestion | null>(null);
  const [questionTimer, setQuestionTimer] = useState<number>(15);
  const [questionFeedback, setQuestionFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [score, setScore] = useState<number>(0);
  const [bossAttackCharging, setBossAttackCharging] = useState<boolean>(false);
  const [floatingDamage, setFloatingDamage] = useState<{ id: number; text: string; x: number; y: number; color: string }[]>([]);

  // 2D Canvas Runner state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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

  // Start / Restart Battle (Scales boss health, velocity, and rewards per stage & difficulty)
  const handleStartGame = (stageTarget: number = stageCount, diffTarget: DifficultyTier = selectedDifficulty) => {
    setStageCount(stageTarget);
    setSelectedDifficulty(diffTarget);
    if (typeof window !== "undefined") {
      localStorage.setItem("ecbiz_boss_stage", String(stageTarget));
      localStorage.setItem("ecbiz_boss_difficulty", diffTarget);
    }

    const baseBoss = BASE_BOSSES[(stageTarget - 1) % BASE_BOSSES.length];
    const scaled = computeScaledBoss(baseBoss, stageTarget, diffTarget);

    setPlayerHp(maxPlayerHp);
    setBossHp(scaled.maxHp);
    setBossGhostHp(scaled.maxHp);
    setAmmo(maxAmmo);
    setGameState("playing");
    setQuestionFeedback(null);
    setBossAttackCharging(false);
    playerProjectilesRef.current = [];
    bossAttacksRef.current = [];
    obstaclesRef.current = [];
    playerRef.current.y = 190;
    playerRef.current.vy = 0;
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
      playerRef.current.vy = -13.5;
      playerRef.current.isJumping = true;
      playJumpSound();
    }
  };

  // Player Shoot
  const handleShoot = () => {
    if (gameState !== "playing") return;
    if (ammo <= 0) {
      addFloatingText("NO AMMO! Refill with Coins 🎯", 150, 100, "#f59e0b");
      return;
    }
    setAmmo((prev) => prev - 1);
    playShootSound();

    playerProjectilesRef.current.push({
      x: playerRef.current.x + playerRef.current.width,
      y: playerRef.current.y + 20,
      vx: 13,
      color: "#38bdf8",
      id: Math.random(),
    });
  };

  // Refill Ammo with Coins
  const handleRefillAmmo = () => {
    const refillCost = 15;
    if (coins < refillCost) {
      addFloatingText("Need 15 Coins to Refill!", 150, 100, "#ef4444");
      return;
    }
    const newCoins = coins - refillCost;
    setCoins(newCoins);
    localStorage.setItem("ecbiz_study_coins", String(newCoins));
    setAmmo(maxAmmo);
    playCritSound();
    addFloatingText(`+${maxAmmo} Ammo Refilled! 🎯`, 100, 120, "#10b981");
  };

  // Trigger Prodigy Question Attack (strictly from 129 Business Studies question bank!)
  const triggerQuestionAttack = () => {
    setGameState("question_attack");
    setQuestionFeedback(null);
    setQuestionTimer(15);
    const businessQ = getBusinessBossQuestion();
    setActiveQuestion(businessQ);
    playTone(380, "square", 0.35, 0.2);
  };

  // Answer question attack
  const handleSelectQuestionOption = (selectedIndex: number) => {
    if (!activeQuestion || questionFeedback) return;

    if (selectedIndex === activeQuestion.correctIndex) {
      // Correct answer! Screen shake + massive boss hit + Live Token
      playCritSound();
      screenShakeRef.current = 10; // Trigger dramatic screen shake
      bossHitFlashRef.current = 8; // Flash boss white

      const critDamage = Math.round(55 * studyStats.damageMultiplier);
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

      const earnedCoins = 35;
      const updatedTotalCoins = awardBonusStudyCoins(earnedCoins);
      setCoins(updatedTotalCoins);
      setScore((prev) => prev + 300);

      setQuestionFeedback({
        isCorrect: true,
        text: `CRITICAL COUNTER-STRIKE! -${critDamage} HP dealt! +${earnedCoins} Coins & +1 Live Token earned! ${
          extraLivesAdded > 0 ? "✨ 3 TOKENS FORGED +1 EXTRA LIFE!" : ""
        }`,
      });

      setTimeout(() => {
        if (newBossHp <= 0) {
          setGameState("boss_defeated");
        } else {
          setGameState("playing");
          lastQuestionAttackTimeRef.current = Date.now();
          lastBossNormalAttackTimeRef.current = Date.now();
        }
      }, 1800);
    } else {
      // Incorrect answer or timeout
      playHitSound();
      const rawDamage = 40;
      const mitigatedDamage = Math.max(5, rawDamage - (30 - currentArmour.damagePerHit));
      const nextPlayerHp = Math.max(0, playerHp - mitigatedDamage);
      setPlayerHp(nextPlayerHp);

      setQuestionFeedback({
        isCorrect: false,
        text: `INCORRECT! Boss struck through defense! -${mitigatedDamage} HP. (Armour absorbed ${
          rawDamage - mitigatedDamage
        } damage). ${activeQuestion.explanation}`,
      });

      setTimeout(() => {
        if (nextPlayerHp <= 0) {
          if (extraLives > 0) {
            setExtraLives((prev) => prev - 1);
            setPlayerHp(maxPlayerHp);
            setGameState("playing");
            addFloatingText("REVIVED BY EXTRA LIFE! ❤️", 150, 100, "#10b981");
          } else {
            setGameState("game_over");
          }
        } else {
          setGameState("playing");
          lastQuestionAttackTimeRef.current = Date.now();
          lastBossNormalAttackTimeRef.current = Date.now();
        }
      }, 2600);
    }
  };

  // Keyboard controls listener (Space/Up: Jump, F/Enter: Shoot, Shift/W/J: Jetpack)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        handleJump();
      } else if (e.code === "KeyF" || e.code === "Enter") {
        e.preventDefault();
        handleShoot();
      } else if (e.code === "ShiftLeft" || e.code === "ShiftRight" || e.code === "KeyW" || e.code === "KeyJ") {
        e.preventDefault();
        handleActivateJetpack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, ammo, hasJetpack]);

  // Question Attack countdown timer
  useEffect(() => {
    let timer: any = null;
    if (gameState === "question_attack" && questionTimer > 0 && !questionFeedback) {
      timer = setInterval(() => {
        setQuestionTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSelectQuestionOption(-1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, questionTimer, questionFeedback]);

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
    const groundY = 230;

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

      // 2. Arena Background
      ctx.fillStyle = "#070b14";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid Floor Lines with movement
      ctx.strokeStyle = "rgba(56, 189, 248, 0.12)";
      ctx.lineWidth = 1;
      const scrollOffset = (Date.now() / 20) % 30;
      for (let x = -30; x < canvas.width + 30; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x - scrollOffset, groundY);
        ctx.lineTo(x - scrollOffset - 25, canvas.height);
        ctx.stroke();
      }

      // Ground Line
      ctx.fillStyle = "#111827";
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 3;
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

        // Hair Design
        ctx.fillStyle = activeHair.previewColor;
        ctx.beginPath();
        ctx.arc(0, -17 + runBob, 9, Math.PI, Math.PI * 2);
        ctx.fill();
        // Hair fringe
        ctx.fillRect(-2, -21 + runBob, 10, 4);
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

      // 6. BOSS FIRES MOVING ATTACK PROJECTILES (MULTI-TIER HEIGHTS)
      const timeSinceNormalAttack = Date.now() - lastBossNormalAttackTimeRef.current;
      if (timeSinceNormalAttack >= activeBoss.attackCadenceMs) {
        lastBossNormalAttackTimeRef.current = Date.now();
        playBossAttackSound();

        const spawnProjectile = (forceTier?: ProjectileHeightTier) => {
          let tier: ProjectileHeightTier = forceTier || "low";
          if (!forceTier) {
            const r = Math.random();
            if (selectedDifficulty === "foundation") {
              tier = r < 0.45 ? "low" : r < 0.78 ? "mid" : "high";
            } else if (selectedDifficulty === "higher") {
              tier = r < 0.32 ? "low" : r < 0.62 ? "mid" : r < 0.82 ? "high" : "wave";
            } else {
              tier = r < 0.25 ? "low" : r < 0.5 ? "mid" : r < 0.75 ? "high" : "wave";
            }
          }

          let projectileY = groundY - 26; // low ground hugger
          let baseY = groundY - 26;
          let waveAmp = 38;
          let waveFreq = 0.035;

          if (tier === "mid") {
            projectileY = groundY - 62; // torso height
            baseY = groundY - 62;
          } else if (tier === "high") {
            projectileY = groundY - 110; // high overhead swooper
            baseY = groundY - 110;
          } else if (tier === "wave") {
            baseY = groundY - 68; // undulating sinusoidal wave
            projectileY = baseY;
            waveAmp = 38 + Math.random() * 10;
            waveFreq = 0.035;
          }

          bossAttacksRef.current.push({
            x: bossX - 25,
            y: projectileY,
            baseY,
            vx: -activeBoss.projectileSpeed,
            width: 28,
            height: 28,
            icon: activeBoss.projectileIcon,
            id: Math.random(),
            rotation: 0,
            tier,
            waveAmp,
            waveFreq,
          });
        };

        spawnProjectile();

        // Staggered Salvo on Higher / Nightmare or Stage >= 2
        const salvoChance =
          selectedDifficulty === "nightmare"
            ? 0.42
            : selectedDifficulty === "higher"
            ? 0.28
            : activeBoss.stage >= 3
            ? 0.18
            : 0;
        if (Math.random() < salvoChance) {
          const compTier: ProjectileHeightTier = Math.random() < 0.5 ? "high" : "low";
          setTimeout(() => {
            if (gameState === "playing") {
              spawnProjectile(compTier);
            }
          }, 300);
        }
      }

      // 7. Update & Draw Boss Attacks (Multi-Tier Heights)
      for (let i = bossAttacksRef.current.length - 1; i >= 0; i--) {
        const ba = bossAttacksRef.current[i];
        ba.x += ba.vx;
        ba.rotation += 0.15;

        if (ba.tier === "wave") {
          const waveDist = (canvas.width - ba.x) * (ba.waveFreq || 0.035);
          ba.y = ba.baseY + Math.sin(waveDist) * (ba.waveAmp || 38);
        }

        // Draw Telemetry Trail based on Height Tier
        ctx.save();
        if (ba.tier === "low") {
          // Low ground skimmer: fiery ground friction sparks
          ctx.strokeStyle = "rgba(239, 68, 68, 0.75)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(ba.x + ba.width, groundY - 2);
          ctx.lineTo(ba.x + ba.width + 16, groundY - 2);
          ctx.stroke();
        } else if (ba.tier === "mid") {
          // Mid torso: orange energy rings
          ctx.strokeStyle = "rgba(245, 158, 11, 0.6)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(ba.x + ba.width + 6, ba.y + ba.height / 2, 8, -Math.PI / 2, Math.PI / 2);
          ctx.stroke();
        } else if (ba.tier === "high") {
          // High swooper: cyan aerodynamic wind trails
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
              ba.baseY + Math.sin((canvas.width - tx) * (ba.waveFreq || 0.035)) * (ba.waveAmp || 38) + ba.height / 2;
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
        ctx.shadowBlur = 14;
        ctx.font = "24px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(ba.icon, 0, 0);
        ctx.restore();

        // Collision with Player
        if (
          p.x < ba.x + ba.width &&
          p.x + p.width > ba.x &&
          p.y < ba.y + ba.height &&
          p.y + p.height > ba.y
        ) {
          bossAttacksRef.current.splice(i, 1);
          playHitSound();

          const dmg = currentArmour.damagePerHit;
          setPlayerHp((prev) => {
            const next = Math.max(0, prev - dmg);
            if (next <= 0) {
              if (extraLives > 0) {
                setExtraLives((el) => el - 1);
                addFloatingText("REVIVED BY EXTRA LIFE! ❤️", 150, 100, "#10b981");
                return maxPlayerHp;
              } else {
                setGameState("game_over");
              }
            }
            return next;
          });
          addFloatingText(`-${dmg} HP! (Armour: ${currentArmour.name})`, p.x, p.y - 12, "#ef4444");
          continue;
        }

        if (ba.x + ba.width < 0) {
          bossAttacksRef.current.splice(i, 1);
          setScore((s) => s + 15);
        }
      }

      // 8. Ground Obstacle Hazards
      if (Math.random() < 0.012 && obstaclesRef.current.length < 2) {
        obstaclesRef.current.push({
          x: canvas.width,
          y: groundY - 30,
          width: 24,
          height: 30,
          speed: 4.8,
          id: Math.random(),
        });
      }

      for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
        const obs = obstaclesRef.current[i];
        obs.x -= obs.speed;

        ctx.save();
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.strokeStyle = "#fca5a5";
        ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
        ctx.font = "14px sans-serif";
        ctx.fillText("⚠️", obs.x + 2, obs.y + 20);
        ctx.restore();

        if (
          p.x < obs.x + obs.width &&
          p.x + p.width > obs.x &&
          p.y < obs.y + obs.height &&
          p.y + p.height > obs.y
        ) {
          obstaclesRef.current.splice(i, 1);
          playHitSound();
          const dmg = currentArmour.damagePerHit;
          setPlayerHp((prev) => {
            const next = Math.max(0, prev - dmg);
            if (next <= 0) {
              if (extraLives > 0) {
                setExtraLives((el) => el - 1);
                addFloatingText("REVIVED BY EXTRA LIFE! ❤️", 150, 100, "#10b981");
                return maxPlayerHp;
              } else {
                setGameState("game_over");
              }
            }
            return next;
          });
          addFloatingText(`-${dmg} HP!`, p.x, p.y - 10, "#ef4444");
          continue;
        }

        if (obs.x + obs.width < 0) {
          obstaclesRef.current.splice(i, 1);
        }
      }

      // 9. Update & Draw Player Projectiles (Ink Darts)
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

        // Hit Boss!
        if (proj.x >= bossX - 25) {
          playerProjectilesRef.current.splice(i, 1);
          playBossHurtSound();
          bossHitFlashRef.current = 3;
          const baseDamage = Math.round(18 * studyStats.damageMultiplier);
          const nextBossHp = Math.max(0, bossHp - baseDamage);
          setBossHp(nextBossHp);
          setScore((s) => s + 35);
          addFloatingText(`-${baseDamage} Hit!`, bossX - 20, bossY - 20, "#38bdf8");

          if (nextBossHp <= 0) {
            const diffCfg = DIFFICULTY_TIERS[selectedDifficulty];
            const coinsEarned = Math.round((70 + stageCount * 25) * diffCfg.rewardMult);
            const scoreEarned = Math.round((600 + stageCount * 180) * diffCfg.rewardMult);
            awardBonusStudyCoins(coinsEarned);
            setCoins(getStudyCoins());
            setScore((s) => s + scoreEarned);
            setGameState("boss_defeated");
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
      if (timeSinceLastQuestion >= activeBoss.attackIntervalMs) {
        lastQuestionAttackTimeRef.current = Date.now();
        triggerQuestionAttack();
        return;
      }

      if (timeSinceLastQuestion >= activeBoss.attackIntervalMs - 2200) {
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

  const handleUpgradeMaxAmmo = () => {
    const cost = maxAmmo === 20 ? 60 : 140;
    if (coins < cost) return;
    const newCoins = coins - cost;
    setCoins(newCoins);
    localStorage.setItem("ecbiz_study_coins", String(newCoins));

    const newMax = maxAmmo + 15;
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

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 font-sans">
      {/* Top Banner Navigation & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToStudio}
            className="p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition"
            title="Return to Studio"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                Cambridge 0264 / 0450 Arena
              </span>
              <span className="text-xs text-neutral-500 font-mono">129 Business Questions Bank</span>
            </div>
            <h1 className="font-academic-serif text-2xl sm:text-3xl font-extrabold text-[#0F2042] dark:text-white">
              Boss Battle Arena ⚔️
            </h1>
          </div>
        </div>

        {/* Player Stats Pills & Studio Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Study XP Pokemon Level Boost */}
          <div
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-semibold flex items-center gap-1.5"
            title={`Studied ${studyStats.totalStudyMinutes} mins on this site! +${Math.round((studyStats.damageMultiplier - 1) * 100)}% Attack Power`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Scholar Lv. {studyStats.scholarLevel}</span>
            <span className="text-[10px] font-mono opacity-80">(+{Math.round((studyStats.damageMultiplier - 1) * 100)}% DMG)</span>
          </div>

          {/* Study Coins */}
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-300 text-xs font-bold font-mono flex items-center gap-1.5 shadow-xs">
            <span>🪙 {coins} Coins</span>
          </div>

          {/* Live Tokens (3 Tokens = 1 Life) */}
          <div
            className="px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center gap-1.5"
            title="Answer Cambridge Business questions to earn Live Tokens! 3 tokens = 1 Extra Life"
          >
            <Award className="w-4 h-4 text-purple-500" />
            <span>Tokens: {liveTokens}/3</span>
            <span className="text-[10px] bg-purple-500/20 px-1.5 py-0.5 rounded-full font-mono">
              ❤️ {extraLives} Lives
            </span>
          </div>

          {/* Character Avatar Customizer Button */}
          <button
            onClick={() => setShowCustomizerModal(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
            title="Open Scholar Avatar Wardrobe & Customizer"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Avatar Wardrobe</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition cursor-pointer"
            title={soundEnabled ? "Mute Game Audio" : "Unmute Game Audio"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Mod Shop Toggle */}
          <button
            onClick={() => setGameState(gameState === "shop" ? "idle" : "shop")}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Armour Shop</span>
          </button>
        </div>
      </div>

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
                    Increases maximum carried ink darts by +15 per upgrade.
                  </p>
                </div>
                <button
                  disabled={coins < (maxAmmo === 20 ? 60 : 140)}
                  onClick={handleUpgradeMaxAmmo}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition shrink-0 ml-4 cursor-pointer"
                >
                  Upgrade (+15) · {maxAmmo === 20 ? 60 : 140} 🪙
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
      ) : (
        /* MAIN BATTLE DISPLAY */
        <div className="space-y-4">
          {/* Top Controls: Difficulty Tiers & Infinite Stage Progression */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            {/* Difficulty Selector Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 overflow-x-auto scrollbar-none">
              {(["foundation", "higher", "nightmare"] as DifficultyTier[]).map((tierKey) => {
                const cfg = DIFFICULTY_TIERS[tierKey];
                const isSel = selectedDifficulty === tierKey;
                return (
                  <button
                    key={tierKey}
                    onClick={() => {
                      setSelectedDifficulty(tierKey);
                      localStorage.setItem("ecbiz_boss_difficulty", tierKey);
                      handleStartGame(stageCount, tierKey);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      isSel
                        ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs"
                        : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                    <span>{cfg.label}</span>
                    <span className="text-[10px] font-mono opacity-70">({cfg.rewardMult}x)</span>
                  </button>
                );
              })}
            </div>

            {/* Stage & Loop Progression Info */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold border border-neutral-200 dark:border-neutral-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-500" />
                <span>Stage {stageCount}</span>
                <span className="text-neutral-400 dark:text-neutral-500">·</span>
                <span>Loop {activeBoss.loop}</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 font-bold">
                ∞ Infinite Mode
              </span>
            </div>
          </div>

          {/* Boss Stage Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {BASE_BOSSES.map((boss, idx) => {
              const isActive = currentBossIndex === idx;
              return (
                <button
                  key={boss.id}
                  onClick={() => handleStartGame(idx + 1 + (activeBoss.loop - 1) * BASE_BOSSES.length)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap border cursor-pointer ${
                    isActive
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent shadow-md"
                      : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                  }`}
                >
                  <span className="text-base">{boss.icon}</span>
                  <span>{boss.name}</span>
                  <span className="text-[10px] opacity-75 font-mono">
                    Lv.{idx + 1 + (activeBoss.loop - 1) * BASE_BOSSES.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ============================================================ */}
          {/* PROMINENT VISUAL BOSS HEALTH BAR (DECREASES DYNAMICALLY)      */}
          {/* ============================================================ */}
          <div className="relative bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border-2 border-rose-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl overflow-hidden text-white">
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
            <div className="relative w-full h-6 sm:h-7 bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-700/80 shadow-inner p-0.5">
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
              <span className="text-[11px] text-neutral-400">Score: {score}</span>
            </div>
          </div>

          {/* Player Mini Status */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-3.5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
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

              <div className="text-purple-600 dark:text-purple-400 font-bold font-mono">
                ❤️ x{extraLives}
              </div>
            </div>
          </div>

          {/* 2D CANVAS ARENA VIEW */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-neutral-800 shadow-2xl bg-black">
            <canvas
              ref={canvasRef}
              width={760}
              height={270}
              className="w-full h-[270px] sm:h-[300px] block"
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

            {/* IDLE / START OVERLAY */}
            {gameState === "idle" && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
                <div className="text-5xl mb-3">{activeBoss.icon}</div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-bold mb-1">
                  STAGE {stageCount} · LOOP {activeBoss.loop} · {DIFFICULTY_TIERS[selectedDifficulty].label}
                </div>
                <h3 className="text-2xl font-black mb-1">{activeBoss.name}</h3>
                <p className="text-xs text-neutral-300 max-w-md mb-4">
                  Dodge multi-height attacks (Ground skimmers, Torso beams, High swoopers, and Sinusoidal waves)! Answer authentic Cambridge 0264 questions to deplete boss HP!
                </p>
                <button
                  onClick={() => handleStartGame(stageCount, selectedDifficulty)}
                  className="px-6 py-3 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-sm rounded-xl shadow-lg transform active:scale-95 transition cursor-pointer"
                >
                  START BOSS FIGHT ⚔️
                </button>
                <div className="mt-4 text-[11px] text-neutral-400 font-mono">
                  Space / Tap: Jump · 'F': Shoot · Shift / W: Jetpack (3s) · Refill with Coins
                </div>
              </div>
            )}

            {/* GAME OVER OVERLAY */}
            {gameState === "game_over" && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white animate-fade-in">
                <div className="text-5xl mb-2">💀</div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold mb-1">
                  STAGE {stageCount} · LOOP {activeBoss.loop}
                </div>
                <h3 className="text-2xl font-black text-rose-500 mb-1">DEFEATED BY {activeBoss.name.toUpperCase()}</h3>
                <p className="text-xs text-neutral-300 max-w-md mb-4">
                  Your business barrier broke! Upgrade your armour or equip the Quantum Jetpack to soar over hazardous projectiles.
                </p>
                <div className="flex items-center gap-3">
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
                    onClick={() => handleStartGame(stageCount + 1, selectedDifficulty)}
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
          {gameState === "question_attack" && activeQuestion && (
            <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-black border-2 border-rose-500 rounded-2xl p-5 sm:p-6 text-white shadow-2xl animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="text-2xl animate-bounce">⚡</span>
                  <div>
                    <div className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-wider">
                      CAMBRIDGE BUSINESS QUESTION ATTACK · #{activeQuestion.questionNumber} / 129
                    </div>
                    <div className="text-xs font-semibold text-neutral-300">
                      Answer correctly to deplete the boss health bar & earn +35 Coins + 1 Live Token!
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
                <h3 className="font-academic-serif text-base sm:text-lg font-bold text-white leading-snug">
                  {activeQuestion.question}
                </h3>
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
                  className={`mt-4 p-3.5 rounded-xl border text-xs leading-relaxed animate-fade-in ${
                    questionFeedback.isCorrect
                      ? "bg-emerald-950/60 border-emerald-500 text-emerald-200"
                      : "bg-rose-950/60 border-rose-500 text-rose-200"
                  }`}
                >
                  <strong className="block font-bold mb-0.5">
                    {questionFeedback.isCorrect ? "🎯 CRITICAL PARRY SUCCESS! BOSS HP STRUCK!" : "💥 ATTACK CONNECTED!"}
                  </strong>
                  <span>{questionFeedback.text}</span>
                </div>
              )}
            </div>
          )}

          {/* ONSCREEN CONTROLS */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
            <button
              onClick={handleJump}
              className="py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-neutral-700 cursor-pointer active:scale-95 shadow-sm"
            >
              <span>⬆️ Space: JUMP</span>
            </button>

            <button
              onClick={handleShoot}
              className="py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
            >
              <Crosshair className="w-4 h-4" />
              <span>'F': SHOOT ({ammo})</span>
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
                title="Activate 3-second sustained rocket flight! Keys: Shift or W"
              >
                <Rocket className={`w-3.5 h-3.5 ${jetpackActive ? "animate-bounce" : ""}`} />
                <span>
                  {jetpackActive
                    ? `FLYING (${jetpackTimeLeft}s)`
                    : jetpackCooldown > 0
                    ? `Cooldown (${jetpackCooldown}s)`
                    : "🚀 JETPACK (3s)"}
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
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refill (15 🪙)</span>
            </button>

            <button
              onClick={() => setShowCustomizerModal(true)}
              className="py-3 bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm col-span-2 sm:col-span-1"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Wardrobe</span>
            </button>
          </div>
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

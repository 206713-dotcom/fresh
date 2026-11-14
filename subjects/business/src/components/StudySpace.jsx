'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  ShoppingBag,
  Flame,
  Coins,
  KeyRound,
  Check,
  Copy,
  ChevronRight,
  RefreshCw,
  Sliders,
  Music,
  CloudRain,
  Flame as FireIcon,
  Trees,
  CheckCircle2,
  Lock,
  ExternalLink,
  Laptop,
  Minimize2,
  Maximize2,
  GripVertical,
  X,
  ArrowRight,
  Ghost,
  Eye,
  EyeOff,
  Trophy,
  Clock,
} from 'lucide-react';
import {
  getStudyCoins,
  awardBonusStudyCoins,
  deductStudyCoins,
  incrementCompletedFocusSessions,
} from '../lib/cookies';
import { getStudentCode, flushProgress } from '../lib/sheetSync';


// Visual themes definition with Roblox study game aesthetic
const THEMES = {
  default: {
    id: 'default',
    name: 'Midnight Lo-Fi',
    subtitle: 'Cozy nocturnal vibes with purple ambient glow',
    price: 0,
    background: 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100',
    card: 'bg-slate-900/60 border-indigo-500/20 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(79,70,229,0.15)]',
    accent: 'from-indigo-500 to-purple-600',
    accentText: 'text-indigo-400',
    accentBorder: 'border-indigo-500/40',
    button: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30',
    badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    ring: 'ring-indigo-500/40',
    glow: 'rgba(99, 102, 241, 0.25)',
  },
  greenhouse: {
    id: 'greenhouse',
    name: 'Emerald Greenhouse',
    subtitle: 'Soothing botanical sanctum surrounded by lush rain foliage',
    price: 50,
    background: 'bg-gradient-to-br from-stone-950 via-emerald-950/70 to-teal-950 text-emerald-50',
    card: 'bg-emerald-950/40 border-emerald-500/25 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(16,185,129,0.18)]',
    accent: 'from-emerald-400 to-teal-500',
    accentText: 'text-emerald-400',
    accentBorder: 'border-emerald-500/40',
    button: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30',
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    ring: 'ring-emerald-500/40',
    glow: 'rgba(16, 185, 129, 0.25)',
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    subtitle: 'Futuristic night-city arcade with pulsating neon glow',
    price: 100,
    background: 'bg-gradient-to-br from-zinc-950 via-purple-950/80 to-neutral-950 text-pink-50',
    card: 'bg-zinc-900/60 border-pink-500/30 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(236,72,153,0.22)] ring-1 ring-cyan-500/20',
    accent: 'from-pink-500 via-purple-500 to-cyan-400',
    accentText: 'text-pink-400',
    accentBorder: 'border-pink-500/40',
    button: 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-lg shadow-pink-600/35',
    badge: 'bg-pink-500/10 text-pink-300 border-pink-500/30',
    ring: 'ring-pink-500/50',
    glow: 'rgba(236, 72, 153, 0.3)',
  },
};

// Default Ambient Sound Catalog
const SOUND_TRACKS = [
  {
    id: 'rain',
    name: 'Gentle Rain',
    icon: CloudRain,
    src: 'https://actions.google.com/sounds/v1/weather/rain_heavy.ogg',
    type: 'rain',
  },
  {
    id: 'lofi',
    name: 'Lo-Fi Chill',
    icon: Music,
    src: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
    type: 'lofi',
  },
  {
    id: 'fire',
    name: 'Cozy Hearth',
    icon: FireIcon,
    src: 'https://actions.google.com/sounds/v1/ambiences/fireplace.ogg',
    type: 'noise',
  },
  {
    id: 'nature',
    name: 'Forest Birds',
    icon: Trees,
    src: 'https://actions.google.com/sounds/v1/ambiences/forest_birds.ogg',
    type: 'nature',
  },
];

// Helper to generate a random 6-character study token (e.g., STUDY-X9F2)
const generateRandomToken = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `STUDY-${rand}`;
};

export default function StudySpace({
  isExpanded: externalIsExpanded,
  onToggleExpand,
  isVisible: externalIsVisible = true,
  onClose,
  onOpenAchievements,
}) {
  // Controlled or uncontrolled expanded mode
  const [internalExpanded, setInternalExpanded] = useState(true);
  const isExpanded = externalIsExpanded !== undefined ? externalIsExpanded : internalExpanded;

  const handleSetExpanded = (val) => {
    if (onToggleExpand) {
      onToggleExpand(val);
    } else {
      setInternalExpanded(val);
    }
  };

  // Movable mini widget position state
  const [position, setPosition] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ecbiz_study_pos');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
            return parsed;
          }
        } catch {}
      }
      const w = window.innerWidth || 1024;
      const h = window.innerHeight || 768;
      return { x: Math.max(16, w - 360), y: Math.max(16, h - 230) };
    }
    return { x: 30, y: 30 };
  });

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, startPosX: 0, startPosY: 0, hasMoved: false });

  // Size mode for minimized floating widget: 'micro' (ultra-slim pill capsule) vs 'compact' (card)
  const [miniMode, setMiniMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ecbiz_study_minimode');
      if (saved === 'compact' || saved === 'micro') return saved;
    }
    return 'micro'; // default to ultra-slim micro pill so it doesn't disturb students
  });

  // Ghost Mode: transparent HUD where background vanishes and numbers remain subtly legible
  const [isGhostMode, setIsGhostMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ecbiz_study_ghost') === 'true';
    }
    return false;
  });

  // Session & anonymous access code state
  const [accessCode, setAccessCode] = useState('');
  const [codeInput, setCodeInput] = useState('');
  // Synchronized study coins balance - starts with standard getStudyCoins() so it never shows 0 when user has coins
  const [coins, setCoins] = useState(() => getStudyCoins());
  const [streak, setStreak] = useState(0);
  const [unlockedThemes, setUnlockedThemes] = useState(['default']);
  const [activeThemeId, setActiveThemeId] = useState('default');

  // UI Panels state
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSoundMixerOpen, setIsSoundMixerOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Focus Timer state - supports arbitrary custom times (12m, 13m, 15m, etc.)
  const [focusMinutes, setFocusMinutes] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ecbiz_study_focus_mins');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (Number.isFinite(parsed) && parsed > 0 && parsed <= 180) return parsed;
      }
    }
    return 25;
  });
  const [customInputMins, setCustomInputMins] = useState('25');
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [timerMode, setTimerMode] = useState('focus'); // 'focus' | 'break'
  const [timeLeft, setTimeLeft] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ecbiz_study_focus_mins');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (Number.isFinite(parsed) && parsed > 0 && parsed <= 180) return parsed * 60;
      }
    }
    return 25 * 60;
  });
  const [isRunning, setIsRunning] = useState(false);

  // Sound mixer state (playing tracks + volumes)
  const [activeSounds, setActiveSounds] = useState({});
  const [masterVolume, setMasterVolume] = useState(0.65);
  const audioRefs = useRef({});
  const webAudioCtxRef = useRef(null);
  const webAudioNodesRef = useRef({});

  // Active theme object
  const currentTheme = THEMES[activeThemeId] || THEMES.default;

  // Show temporary toast notification
  const showToast = useCallback((msg, duration = 3000) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, duration);
  }, []);

  // Persist progress to the student's row in the Google Sheet.
  // The snapshot sync in ../lib/sheetSync captures every ecbiz_* key, so this
  // only needs to trigger a flush.
  const syncProgress = useCallback(() => {
    flushProgress();
  }, []);

  // The Sheet snapshot is restored once at startup by startSheetSync(); here
  // we just re-read the values it left in localStorage.
  const fetchSessionData = useCallback(() => {
    const localCoins = getStudyCoins();
    setCoins(localCoins);

    const localStreak = parseInt(
      localStorage.getItem('ecbiz_study_streak') || '0',
      10
    );
    setStreak(Number.isFinite(localStreak) ? localStreak : 0);

    let themes = ['default'];
    try {
      const parsed = JSON.parse(
        localStorage.getItem('ecbiz_study_themes') || '["default"]'
      );
      if (Array.isArray(parsed) && parsed.length > 0) themes = parsed;
    } catch {}
    setUnlockedThemes(themes);

    const activeTheme =
      localStorage.getItem('ecbiz_study_active_theme') || 'default';
    if (THEMES[activeTheme]) {
      setActiveThemeId(activeTheme);
    }
  }, []);

  // Synchronize coins across components whenever ecbiz_coins_updated event is dispatched
  useEffect(() => {
    const handleCoinsEvent = (e) => {
      if (e?.detail?.coins !== undefined) {
        setCoins(e.detail.coins);
      } else {
        setCoins(getStudyCoins());
      }
    };
    window.addEventListener('ecbiz_coins_updated', handleCoinsEvent);
    return () => window.removeEventListener('ecbiz_coins_updated', handleCoinsEvent);
  }, []);

  // Initial load: use the signed-in student's number when available, otherwise
  // fall back to this browser's local token.
  useEffect(() => {
    let savedCode = getStudentCode() || '';
    try {
      if (!savedCode) {
        savedCode = localStorage.getItem('ecbiz_study_code') || '';
      }
    } catch {}

    if (!savedCode) {
      savedCode = generateRandomToken();
      try {
        localStorage.setItem('ecbiz_study_code', savedCode);
      } catch {}
    }
    setAccessCode(savedCode);
    setCodeInput(savedCode);

    // Load active coins consistently using getStudyCoins()
    const activeCoins = getStudyCoins();
    setCoins(activeCoins);

    let savedStreak = 0;
    let savedThemes = ['default'];
    let savedActiveTheme = 'default';

    try {
      const rawStreak = localStorage.getItem('ecbiz_study_streak');
      if (rawStreak) savedStreak = parseInt(rawStreak, 10);
      const rawThemes = localStorage.getItem('ecbiz_study_themes');
      if (rawThemes) {
        const parsed = JSON.parse(rawThemes);
        if (Array.isArray(parsed) && parsed.length > 0) savedThemes = parsed;
      }
      savedActiveTheme = localStorage.getItem('ecbiz_study_active_theme') || 'default';
    } catch {}

    setStreak(Number.isFinite(savedStreak) ? savedStreak : 0);
    setUnlockedThemes(savedThemes);
    if (THEMES[savedActiveTheme]) {
      setActiveThemeId(savedActiveTheme);
    }

    // Attempt remote sync with the Google Sheet
    fetchSessionData(savedCode);
  }, [fetchSessionData]);

  // Ghost mode toggle and tap-to-wake handlers
  const toggleGhostMode = useCallback((e) => {
    if (e) e.stopPropagation();
    setIsGhostMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('ecbiz_study_ghost', String(next));
      } catch {}
      if (next) {
        showToast('👻 Ghost Mode ON: Transparent HUD. Tap or click anywhere on it to wake up!', 3000);
      } else {
        showToast('Ghost Mode OFF: Normal visibility restored', 2000);
      }
      return next;
    });
  }, [showToast]);

  const wakeFromGhostMode = useCallback(() => {
    if (isGhostMode) {
      setIsGhostMode(false);
      try {
        localStorage.setItem('ecbiz_study_ghost', 'false');
      } catch {}
      showToast('Study Space: Normal visibility restored', 2000);
    }
  }, [isGhostMode, showToast]);

  // Window resize listener to keep movable widget clamped inside viewport
  useEffect(() => {
    const handleResize = () => {
      setPosition((curr) => {
        const widgetWidth = miniMode === 'micro' ? 240 : 290;
        const widgetHeight = miniMode === 'micro' ? 44 : 150;
        const maxX = Math.max(8, window.innerWidth - widgetWidth - 8);
        const maxY = Math.max(8, window.innerHeight - widgetHeight - 8);
        const clampedX = Math.max(8, Math.min(maxX, curr.x));
        const clampedY = Math.max(8, Math.min(maxY, curr.y));
        if (clampedX !== curr.x || clampedY !== curr.y) {
          return { x: clampedX, y: clampedY };
        }
        return curr;
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [miniMode]);

  // Pointer drag handler for the movable mini popup widget
  const handlePointerDownDrag = (e) => {
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('a')) {
      return;
    }
    e.preventDefault();
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPosX: position.x,
      startPosY: position.y,
      hasMoved: false,
    };

    const handlePointerMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = moveEvent.clientX - dragStartRef.current.x;
      const deltaY = moveEvent.clientY - dragStartRef.current.y;

      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        dragStartRef.current.hasMoved = true;
      }

      const widgetWidth = miniMode === 'micro' ? 240 : 290;
      const widgetHeight = miniMode === 'micro' ? 44 : 150;
      const maxX = Math.max(8, window.innerWidth - widgetWidth - 8);
      const maxY = Math.max(8, window.innerHeight - widgetHeight - 8);

      const nextX = Math.max(8, Math.min(maxX, dragStartRef.current.startPosX + deltaX));
      const nextY = Math.max(8, Math.min(maxY, dragStartRef.current.startPosY + deltaY));

      setPosition({ x: nextX, y: nextY });
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);

      // If clicked/tapped without moving in ghost mode, wake it back up!
      if (!dragStartRef.current.hasMoved && isGhostMode) {
        wakeFromGhostMode();
      }

      setPosition((curr) => {
        try {
          localStorage.setItem('ecbiz_study_pos', JSON.stringify(curr));
        } catch {}
        return curr;
      });
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Switch access code handler
  const handleConnectCode = () => {
    const clean = codeInput.trim().toUpperCase();
    if (!clean) return;
    setAccessCode(clean);
    localStorage.setItem('ecbiz_study_code', clean);
    fetchSessionData(clean);
    setIsProfileOpen(false);
  };

  // Generate a brand new anonymous code
  const handleGenerateNewCode = () => {
    const fresh = generateRandomToken();
    setCodeInput(fresh);
    setAccessCode(fresh);
    const existingCoins = getStudyCoins();
    setCoins(existingCoins);
    setStreak(0);
    setUnlockedThemes(['default']);
    setActiveThemeId('default');
    localStorage.setItem('ecbiz_study_code', fresh);
    localStorage.setItem('ecbiz_study_coins', String(existingCoins));
    localStorage.setItem('ecbiz_study_streak', '0');
    localStorage.setItem('ecbiz_study_themes', JSON.stringify(['default']));
    localStorage.setItem('ecbiz_study_active_theme', 'default');

    syncProgress(fresh, existingCoins, 0, ['default']);
    showToast(`Generated new anonymous token: ${fresh}`);
    setIsProfileOpen(false);
  };

  // Copy code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(accessCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    showToast('Token copied to clipboard!');
  };

  // Audio mixer: Web Audio synth fallback
  const initWebAudioNoise = (type) => {
    try {
      if (!webAudioCtxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        webAudioCtxRef.current = new AudioCtx();
      }
      const ctx = webAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.12;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
      filter.frequency.value = type === 'rain' ? 800 : 440;

      const gainNode = ctx.createGain();
      gainNode.gain.value = masterVolume * 0.4;

      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      noise.start();

      return { source: noise, gain: gainNode };
    } catch {
      return null;
    }
  };

  // Toggle ambient track
  const toggleSoundTrack = (trackId) => {
    const isPlaying = !!activeSounds[trackId];
    const newActive = { ...activeSounds, [trackId]: !isPlaying };
    setActiveSounds(newActive);

    const track = SOUND_TRACKS.find((t) => t.id === trackId);
    if (!track) return;

    if (!isPlaying) {
      const audio = audioRefs.current[trackId];
      if (audio) {
        audio.volume = masterVolume;
        audio.play().catch(() => {
          if (!webAudioNodesRef.current[trackId]) {
            webAudioNodesRef.current[trackId] = initWebAudioNoise(track.type);
          }
        });
      }
    } else {
      const audio = audioRefs.current[trackId];
      if (audio) {
        audio.pause();
      }
      if (webAudioNodesRef.current[trackId]) {
        try {
          webAudioNodesRef.current[trackId].source.stop();
        } catch {}
        webAudioNodesRef.current[trackId] = null;
      }
    }
  };

  // Quick mute/unmute all sounds
  const toggleAllSounds = () => {
    const hasAnyActive = Object.values(activeSounds).some(Boolean);
    if (hasAnyActive) {
      // Mute all
      const muted = {};
      Object.keys(activeSounds).forEach((k) => {
        muted[k] = false;
        if (audioRefs.current[k]) audioRefs.current[k].pause();
        if (webAudioNodesRef.current[k]) {
          try {
            webAudioNodesRef.current[k].source.stop();
          } catch {}
          webAudioNodesRef.current[k] = null;
        }
      });
      setActiveSounds(muted);
    } else {
      // Play first track by default (rain)
      toggleSoundTrack('rain');
    }
  };

  // Adjust master volume
  const handleVolumeChange = (newVol) => {
    setMasterVolume(newVol);
    Object.keys(audioRefs.current).forEach((id) => {
      if (audioRefs.current[id]) {
        audioRefs.current[id].volume = newVol;
      }
    });
    Object.keys(webAudioNodesRef.current).forEach((id) => {
      if (webAudioNodesRef.current[id]?.gain) {
        webAudioNodesRef.current[id].gain.gain.value = newVol * 0.4;
      }
    });
  };

  // 1-minute ticker tracking ref
  const elapsedSecondCounter = useRef(0);

  // Main Pomodoro Countdown interval (runs continuously across both expanded & mini widget states)
  useEffect(() => {
    let timer = null;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });

        // Track active focus elapsed time
        if (timerMode === 'focus') {
          elapsedSecondCounter.current += 1;

          // Every 60 active seconds: award 1 coin via awardBonusStudyCoins and sync
          if (elapsedSecondCounter.current % 60 === 0) {
            awardBonusStudyCoins(1);
            const activeCoins = getStudyCoins();
            setCoins(activeCoins);
            syncProgress(accessCode, activeCoins, streak, unlockedThemes);
            showToast('+1 Study Coin earned for focused study! ✨');
          }
        }
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (timerMode === 'focus') {
        const bonusCoins = 25;
        awardBonusStudyCoins(bonusCoins);
        incrementCompletedFocusSessions();
        const activeCoins = getStudyCoins();
        const newStreak = streak + 1;

        setCoins(activeCoins);
        setStreak(newStreak);

        localStorage.setItem('ecbiz_study_streak', String(newStreak));
        syncProgress(accessCode, activeCoins, newStreak, unlockedThemes);

        showToast(`🎉 Focus Session Complete! +25 Coins & Streak increased to ${newStreak}!`);
        setTimerMode('break');
        setTimeLeft(breakMinutes * 60);
      } else {
        showToast('Break finished! Ready to dive back into study?');
        setTimerMode('focus');
        setTimeLeft(focusMinutes * 60);
      }
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft, timerMode, coins, streak, accessCode, unlockedThemes, syncProgress, showToast, focusMinutes, breakMinutes]);

  // Timer controls
  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    elapsedSecondCounter.current = 0;
    setTimeLeft(timerMode === 'focus' ? focusMinutes * 60 : breakMinutes * 60);
  };

  const switchTimerMode = (mode) => {
    setIsRunning(false);
    setTimerMode(mode);
    elapsedSecondCounter.current = 0;
    setTimeLeft(mode === 'focus' ? focusMinutes * 60 : breakMinutes * 60);
  };

  // Custom focus duration setter (supports 12, 13, 15, or any integer minutes)
  const handleSetFocusMinutes = (mins) => {
    const parsed = parseInt(mins, 10);
    if (!Number.isFinite(parsed) || parsed < 1 || parsed > 180) {
      showToast('Please enter a valid duration between 1 and 180 minutes.');
      return;
    }
    setFocusMinutes(parsed);
    setCustomInputMins(String(parsed));
    localStorage.setItem('ecbiz_study_focus_mins', String(parsed));
    localStorage.setItem('ecbiz_used_custom_timer', 'true');
    setIsRunning(false);
    elapsedSecondCounter.current = 0;
    if (timerMode === 'focus') {
      setTimeLeft(parsed * 60);
    }
    showToast(`⏱️ Focus session set to ${parsed} minutes!`);
  };

  const handleAddMinutes = (mins) => {
    const additionalSecs = mins * 60;
    setTimeLeft((prev) => prev + additionalSecs);
    showToast(`Added +${mins}m to timer`);
  };

  // Format MM:SS display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Decoration Store: Unlock theme
  const handleBuyTheme = (themeId) => {
    const theme = THEMES[themeId];
    if (!theme) return;

    if (unlockedThemes.includes(themeId)) {
      setActiveThemeId(themeId);
      localStorage.setItem('ecbiz_study_active_theme', themeId);
      showToast(`Equipped ${theme.name}!`);
      return;
    }

    const currentBalance = getStudyCoins();
    if (currentBalance < theme.price) {
      showToast(`Need ${theme.price - currentBalance} more Study Coins to unlock this theme!`);
      return;
    }

    const deducted = deductStudyCoins(theme.price);
    if (!deducted) {
      showToast(`Could not deduct coins. Please try again.`);
      return;
    }
    const updatedCoins = getStudyCoins();
    const updatedThemes = [...unlockedThemes, themeId];

    setCoins(updatedCoins);
    setUnlockedThemes(updatedThemes);
    setActiveThemeId(themeId);

    localStorage.setItem('ecbiz_study_themes', JSON.stringify(updatedThemes));
    localStorage.setItem('ecbiz_study_active_theme', themeId);

    syncProgress(accessCode, updatedCoins, streak, updatedThemes);
    showToast(`Unlocked and equipped ${theme.name}! 🎉`);
  };

  const isVisible = externalIsVisible || isExpanded;
  if (!isVisible) {
    return null;
  }

  // Check if any sound is currently active
  const isAnySoundActive = Object.values(activeSounds).some(Boolean);

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. COMPACT MOVABLE FLOATING POPUP WIDGET (Active when shrunk / minimized) */}
      {/* Supports Ultra-Slim Micro Pill, Compact Card, & Ghost Transparent Mode   */}
      {/* ========================================================================= */}
      {!isExpanded && (
        <div
          onPointerDown={handlePointerDownDrag}
          onClick={() => {
            // If in ghost mode, tapping or clicking anywhere wakes it up!
            if (isGhostMode) {
              wakeFromGhostMode();
            }
          }}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            touchAction: 'none',
          }}
          className={`fixed z-[90] select-none transition-all duration-300 animate-in fade-in zoom-in-95 ${
            isGhostMode
              ? 'opacity-25 hover:opacity-95 bg-black/25 border border-white/10 shadow-none backdrop-blur-none cursor-pointer'
              : `border ${currentTheme.card} shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl`
          } ${
            miniMode === 'micro'
              ? 'rounded-full px-2.5 py-1.5'
              : 'w-[280px] sm:w-[300px] rounded-3xl'
          }`}
          title={
            isGhostMode
              ? 'Ghost Mode Active • Tap or click anywhere on this widget to wake up'
              : 'Drag to reposition • Click Expand for full room'
          }
        >
          {/* ----------------------------------------------------------------- */}
          {/* A. ULTRA-SLIM MICRO PILL MODE (Extremely compact & non-disturbing) */}
          {/* ----------------------------------------------------------------- */}
          {miniMode === 'micro' ? (
            isGhostMode ? (
              /* Ghost Mode inside Micro Pill: Transparent with legible digits */
              <div className="flex items-center gap-2 px-1 py-0.5">
                <div className="flex items-center gap-1.5 cursor-grab active:cursor-grabbing">
                  <GripVertical className="w-3 h-3 text-white/40" />
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isRunning ? 'bg-emerald-400 animate-ping' : 'bg-white/40'
                    }`}
                  />
                </div>
                {/* Legible numbers that can still be seen */}
                <span className="font-mono text-xs sm:text-sm font-black tabular-nums tracking-wider text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-[10px] text-white/60 flex items-center gap-1 pl-1 font-sans">
                  <Ghost className="w-2.5 h-2.5 text-amber-300/80 animate-pulse" />
                  <span className="hidden sm:inline">Tap to wake</span>
                </span>
              </div>
            ) : (
              /* Normal Micro Pill: Sleek, compact capsule */
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Drag Handle & Status Dot */}
                <div
                  className="flex items-center gap-1 cursor-grab active:cursor-grabbing pl-0.5"
                  title="Drag to reposition anywhere"
                >
                  <GripVertical className="w-3.5 h-3.5 text-white/40 hover:text-white/80 transition" />
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isRunning ? 'bg-emerald-400 animate-ping' : 'bg-white/40'
                    }`}
                    title={isRunning ? 'Timer Running' : 'Timer Paused'}
                  />
                </div>

                {/* Clock digits - click opens full space */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSetExpanded(true);
                  }}
                  className="font-mono text-xs sm:text-sm font-black tabular-nums tracking-wide text-white hover:text-indigo-200 transition px-1 py-0.5 rounded cursor-pointer"
                  title="Click to expand to full Study Space"
                >
                  {formatTime(timeLeft)}
                </button>

                {/* Play / Pause */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartPause();
                  }}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition active:scale-90 shadow-sm cursor-pointer ${
                    isRunning
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white/90'
                  }`}
                  title={isRunning ? 'Pause' : 'Start Focus'}
                >
                  {isRunning ? (
                    <Pause className="w-2.5 h-2.5 fill-current" />
                  ) : (
                    <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                  )}
                </button>

                {/* Ghost Mode Toggle */}
                <button
                  onClick={toggleGhostMode}
                  className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/20 text-white/60 hover:text-amber-300 flex items-center justify-center transition active:scale-90 cursor-pointer"
                  title="Ghost Mode (Fairly transparent, numbers stay visible)"
                >
                  <Ghost className="w-3 h-3" />
                </button>

                {/* Switch to Card view */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMiniMode('compact');
                    try {
                      localStorage.setItem('ecbiz_study_minimode', 'compact');
                    } catch {}
                    showToast('Switched to Card view', 1500);
                  }}
                  className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/20 text-white/60 hover:text-white flex items-center justify-center transition active:scale-90 cursor-pointer"
                  title="Switch to Card view (with coins & streak)"
                >
                  <Maximize2 className="w-2.5 h-2.5" />
                </button>

                {/* Expand to Full Room */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSetExpanded(true);
                  }}
                  className="px-2 py-0.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm transition active:scale-90 cursor-pointer"
                  title="Open Fullscreen Study Realm"
                >
                  <ExternalLink className="w-2.5 h-2.5" />
                  <span className="hidden sm:inline">Max</span>
                </button>

                {/* Close widget */}
                {onClose && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                    className="w-5 h-5 rounded-full text-white/40 hover:text-white hover:bg-white/10 flex items-center justify-center transition cursor-pointer"
                    title="Close floating timer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            )
          ) : (
            /* ----------------------------------------------------------------- */
            /* B. COMPACT CARD MODE (Slim card with coins, streak, audio)        */
            /* ----------------------------------------------------------------- */
            isGhostMode ? (
              /* Ghost Mode inside Compact Card */
              <div className="p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-3 h-3 text-white/40" />
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isRunning ? 'bg-emerald-400 animate-ping' : 'bg-white/40'
                      }`}
                    />
                    <span className="text-[10px] font-mono text-white/50">Ghost HUD</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-white/60">
                    <Ghost className="w-3 h-3 text-amber-300 animate-pulse" />
                    <span>Tap anywhere to wake</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-black font-mono tracking-tight tabular-nums text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartPause();
                      }}
                      className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                    >
                      {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Normal Compact Card */
              <div>
                {/* Draggable Header Handle */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 cursor-grab active:cursor-grabbing">
                  <div className="flex items-center gap-1.5">
                    <GripVertical className="w-3.5 h-3.5 text-white/40" />
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isRunning ? 'bg-emerald-400 animate-ping' : 'bg-white/40'
                        }`}
                      />
                      <span className="text-[11px] font-bold tracking-wide text-white/80">
                        {timerMode === 'focus' ? 'Study Focus' : 'Break'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Ghost Mode Toggle */}
                    <button
                      onClick={toggleGhostMode}
                      className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-amber-300 border border-white/10 transition cursor-pointer"
                      title="Ghost Mode (Fairly transparent, numbers stay visible)"
                    >
                      <Ghost className="w-3 h-3" />
                    </button>

                    {/* Shrink to Micro Pill */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMiniMode('micro');
                        try {
                          localStorage.setItem('ecbiz_study_minimode', 'micro');
                        } catch {}
                        showToast('Shrunk to Micro Pill capsule', 1500);
                      }}
                      className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white border border-white/10 transition cursor-pointer"
                      title="Shrink even smaller to Micro Pill"
                    >
                      <Minimize2 className="w-3 h-3" />
                    </button>

                    {/* Quick Sound Mute/Unmute */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAllSounds();
                      }}
                      className={`p-1 rounded-lg border transition cursor-pointer ${
                        isAnySoundActive
                          ? 'bg-indigo-600/30 border-indigo-400/50 text-indigo-300'
                          : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                      }`}
                      title={isAnySoundActive ? 'Mute Ambient Audio' : 'Play Lo-Fi/Rain Audio'}
                    >
                      {isAnySoundActive ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                    </button>

                    {/* Maximize to full room */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetExpanded(true);
                      }}
                      className="p-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition border border-indigo-400/40 cursor-pointer"
                      title="Expand to Full Study Realm"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    {/* Close Widget */}
                    {onClose && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose();
                        }}
                        className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition cursor-pointer"
                        title="Close Widget"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Mini Card Body: Live Timer Digits & Controls */}
                <div className="p-3 flex items-center justify-between gap-2.5">
                  {/* Clock Digits & Stats */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetExpanded(true);
                    }}
                    className="cursor-pointer group flex flex-col"
                    title="Click to view full room"
                  >
                    <div className="text-2xl font-black font-mono tracking-tight tabular-nums text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80 group-hover:opacity-80 transition">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-white/50">
                      <span className="flex items-center gap-1 text-amber-300 font-semibold">
                        <Coins className="w-3 h-3 text-amber-400" />
                        {coins}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-orange-300 font-semibold">
                        <Flame className="w-3 h-3 text-orange-400" />
                        {streak}d
                      </span>
                    </div>
                  </div>

                  {/* Quick Actions (Play/Pause, Reset) */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartPause();
                      }}
                      className={`p-2 rounded-xl font-bold transition transform active:scale-95 shadow-md flex items-center justify-center cursor-pointer ${currentTheme.button}`}
                      title={isRunning ? 'Pause' : 'Start Focus'}
                    >
                      {isRunning ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResetTimer();
                      }}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/10 transition active:scale-95 cursor-pointer"
                      title="Reset Timer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Mini Visualizer strip if running */}
                {isRunning && (
                  <div className="h-0.5 bg-white/10 w-full overflow-hidden rounded-b-3xl">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-indigo-500 animate-pulse w-full" />
                  </div>
                )}
              </div>
            )
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FULLSCREEN AESTHETIC REALM (Active when expanded)                      */}
      {/* ========================================================================= */}
      {isExpanded && (
        <div
          className={`fixed inset-0 z-[100] w-full h-full min-h-screen overflow-y-auto transition-all duration-300 ${currentTheme.background} font-sans select-none animate-in fade-in zoom-in-95`}
        >
          {/* Background ambient lighting effects */}
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] rounded-full blur-[140px] pointer-events-none opacity-40 transition-all duration-1000"
            style={{ background: currentTheme.glow }}
          />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-[130px] bg-indigo-600/10 pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-[130px] bg-purple-600/10 pointer-events-none" />

          {/* Floating Header Navigation */}
          <header className="relative z-20 max-w-6xl mx-auto pt-6 px-4 sm:px-6">
            <div className={`flex items-center justify-between p-3.5 sm:p-4 rounded-3xl border ${currentTheme.card}`}>
              {/* Logo & Brand */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${currentTheme.accent} flex items-center justify-center shadow-lg shadow-black/30`}
                >
                  <Laptop className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold tracking-tight text-base sm:text-lg">Study Space</span>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                      Lo-Fi Hub
                    </span>
                  </div>
                  <p className="text-xs text-white/50 hidden sm:block">Aesthetic Roblox-inspired focus realm</p>
                </div>
              </div>

              {/* Gamified Stat Badges & Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Coins Counter */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-300 font-semibold text-xs sm:text-sm">
                  <Coins className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>{coins}</span>
                  <span className="text-[10px] text-amber-400/70 hidden sm:inline">Coins</span>
                </div>

                {/* Streak Counter */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-orange-500/10 border border-orange-500/25 text-orange-300 font-semibold text-xs sm:text-sm">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>{streak}</span>
                  <span className="text-[10px] text-orange-400/70 hidden sm:inline">Day Streak</span>
                </div>

                {/* Theme Shop Button */}
                <button
                  onClick={() => setIsStoreOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs sm:text-sm font-medium transition active:scale-95 cursor-pointer"
                  title="Cosmetics Shop"
                >
                  <ShoppingBag className="w-4 h-4 text-purple-300" />
                  <span className="hidden sm:inline">Shop</span>
                </button>

                {/* Achievements Modal Trigger */}
                {onOpenAchievements && (
                  <button
                    onClick={onOpenAchievements}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold transition active:scale-95 cursor-pointer shadow-xs"
                    title="View Achievements & Claim Bonus Study Coins"
                  >
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">Achievements</span>
                  </button>
                )}

                {/* Sound Mixer Toggle */}
                <button
                  onClick={() => setIsSoundMixerOpen(!isSoundMixerOpen)}
                  className={`p-2 rounded-2xl border transition active:scale-95 cursor-pointer ${
                    Object.values(activeSounds).some(Boolean)
                      ? 'bg-indigo-600/30 border-indigo-400 text-indigo-300'
                      : 'bg-white/10 hover:bg-white/15 border-white/15 text-white/80'
                  }`}
                  title="Ambient Sound Mixer"
                >
                  <Sliders className="w-4 h-4" />
                </button>

                {/* Anonymous Profile Access Button */}
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs sm:text-sm font-medium transition active:scale-95 cursor-pointer"
                  title="Anonymous Token Profile"
                >
                  <KeyRound className="w-4 h-4 text-cyan-300" />
                  <span className="font-mono text-xs hidden md:inline">{accessCode || 'CODE'}</span>
                </button>

                {/* SHRINK / MINIMIZE BUTTON */}
                <button
                  onClick={() => handleSetExpanded(false)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 border border-emerald-400/40 transition active:scale-95 cursor-pointer ml-1"
                  title="Shrink into a floating mini timer and continue practice questions"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span>Shrink to Mini Timer ↘</span>
                </button>
              </div>
            </div>
          </header>

          {/* Main Focus Space Layout */}
          <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
            {/* Toast Alert */}
            {toastMessage && (
              <div className="fixed top-24 z-50 animate-bounce px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-white/20 text-white text-xs sm:text-sm shadow-2xl backdrop-blur-xl flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{toastMessage}</span>
              </div>
            )}

            {/* Central Aesthetic Study Pod */}
            <div className="w-full max-w-xl mx-auto flex flex-col items-center">
              {/* Mode Switcher Tabs */}
              <div className="flex items-center p-1.5 rounded-3xl bg-black/30 border border-white/10 backdrop-blur-xl mb-4 shadow-inner">
                <button
                  onClick={() => switchTimerMode('focus')}
                  className={`px-5 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    timerMode === 'focus' ? `${currentTheme.button} shadow-md` : 'text-white/60 hover:text-white'
                  }`}
                >
                  Focus Session ({focusMinutes}m)
                </button>
                <button
                  onClick={() => switchTimerMode('break')}
                  className={`px-5 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    timerMode === 'break' ? `${currentTheme.button} shadow-md` : 'text-white/60 hover:text-white'
                  }`}
                >
                  Short Break ({breakMinutes}m)
                </button>
              </div>

              {/* Custom Study Times & Presets (supports 12m, 13m, 15m, 25m etc.) */}
              {timerMode === 'focus' && (
                <div className="w-full mb-6 p-3 rounded-2xl bg-black/25 border border-white/10 backdrop-blur-md flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-xs text-white/70">
                    <span className="flex items-center gap-1.5 font-bold text-white/90">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Choose Focus Duration:</span>
                    </span>
                    <span className="text-[11px] font-mono text-white/50">Custom Minutes</span>
                  </div>

                  {/* Interval Presets Chips including requested 12m, 13m, 15m */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[5, 10, 12, 13, 15, 20, 25, 45].map((mins) => {
                      const isSelected = focusMinutes === mins;
                      return (
                        <button
                          key={mins}
                          onClick={() => handleSetFocusMinutes(mins)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition active:scale-95 cursor-pointer border ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-400 text-white shadow-sm'
                              : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/70 hover:text-white'
                          }`}
                        >
                          {mins}m
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Number Input */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-white/60">Any Custom Time:</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="1"
                        max="180"
                        value={customInputMins}
                        onChange={(e) => setCustomInputMins(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSetFocusMinutes(customInputMins);
                        }}
                        placeholder="e.g. 12"
                        className="w-16 px-2 py-1 text-xs font-mono font-bold text-center bg-black/40 border border-white/20 rounded-xl text-white focus:outline-none focus:border-indigo-400"
                      />
                      <span className="text-xs text-white/60">mins</span>
                      <button
                        onClick={() => handleSetFocusMinutes(customInputMins)}
                        className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition active:scale-95 cursor-pointer"
                      >
                        Set
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Pomodoro Timer Glass Card */}
              <div
                className={`w-full p-8 sm:p-12 rounded-[36px] border ${currentTheme.card} flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500`}
              >
                {/* Visualizer Waves on Focus Running */}
                {isRunning && (
                  <div className="absolute inset-x-0 bottom-0 h-16 flex items-end justify-center gap-1.5 px-8 pb-3 opacity-25 pointer-events-none">
                    {[40, 75, 55, 90, 60, 85, 45, 100, 70, 50, 80, 65, 95, 40].map((h, i) => (
                      <span
                        key={i}
                        className="w-1.5 bg-current rounded-full animate-pulse"
                        style={{
                          height: `${h}%`,
                          animationDelay: `${(i * 0.15).toFixed(2)}s`,
                          animationDuration: '1.2s',
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Status indicator */}
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-emerald-400 animate-ping' : 'bg-white/30'}`}
                  />
                  <span className="text-xs uppercase tracking-widest font-bold text-white/60">
                    {isRunning
                      ? timerMode === 'focus'
                        ? `Studying (${focusMinutes}m session) • Earning Coins`
                        : 'Recharging...'
                      : `Ready to Focus (${focusMinutes}m session)`}
                  </span>
                </div>

                {/* Big Aesthetic Digits */}
                <div className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter my-2 tabular-nums text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 drop-shadow-sm">
                  {formatTime(timeLeft)}
                </div>

                {/* Quick Extenders +1m / +5m */}
                <div className="flex items-center gap-2 my-2">
                  <button
                    onClick={() => handleAddMinutes(1)}
                    className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white border border-white/10 text-xs font-mono font-semibold transition active:scale-95 cursor-pointer"
                    title="Add 1 minute"
                  >
                    +1m
                  </button>
                  <button
                    onClick={() => handleAddMinutes(5)}
                    className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white border border-white/10 text-xs font-mono font-semibold transition active:scale-95 cursor-pointer"
                    title="Add 5 minutes"
                  >
                    +5m
                  </button>
                </div>

                {/* Timer Control Buttons */}
                <div className="flex items-center gap-4 mt-4 z-10">
                  <button
                    onClick={handleStartPause}
                    className={`flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold text-sm sm:text-base transition transform active:scale-95 shadow-xl cursor-pointer ${currentTheme.button}`}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-5 h-5 fill-current" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                        <span>Start Session</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleResetTimer}
                    className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 transition active:scale-95 cursor-pointer"
                    title="Reset Clock"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>

                {/* Passive Earn Tracker Note */}
                <div className="mt-8 text-center text-xs text-white/40 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-400/70" />
                  <span>
                    Earn 1 Study Coin per active minute • 25 Coins & +1 Streak per complete block
                  </span>
                </div>
              </div>

              {/* Quick Sound Mixer Ribbon */}
              <div className="w-full mt-6 flex items-center justify-between p-3.5 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-white/60" />
                  <span className="text-xs font-medium text-white/70">Ambient Lo-Fi Tracks</span>
                </div>
                <div className="flex items-center gap-2">
                  {SOUND_TRACKS.map((track) => {
                    const Icon = track.icon;
                    const isPlaying = !!activeSounds[track.id];
                    return (
                      <button
                        key={track.id}
                        onClick={() => toggleSoundTrack(track.id)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition active:scale-95 border ${
                          isPlaying
                            ? 'bg-white/20 border-white/30 text-white'
                            : 'bg-white/5 border-transparent text-white/50 hover:text-white/80'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{track.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Helpful Hint on Minimizing to do website questions */}
              <div className="w-full mt-4 text-center">
                <button
                  onClick={() => handleSetExpanded(false)}
                  className="text-xs text-white/60 hover:text-emerald-400 transition inline-flex items-center gap-1.5 py-1 px-3 rounded-full hover:bg-white/5"
                >
                  <span>Ready to do practice questions on the website?</span>
                  <span className="font-semibold underline underline-offset-4">
                    Shrink into floating timer ↘
                  </span>
                </button>
              </div>
            </div>
          </main>

          {/* Sound Mixer Panel Modal */}
          {isSoundMixerOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
              <div className={`w-full max-w-md p-6 rounded-3xl border ${currentTheme.card} shadow-2xl`}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-bold text-base">Sound Mixer</h3>
                  </div>
                  <button
                    onClick={() => setIsSoundMixerOpen(false)}
                    className="text-white/50 hover:text-white text-xs px-2.5 py-1 rounded-xl bg-white/10"
                  >
                    Close
                  </button>
                </div>

                <div className="mb-6 p-4 rounded-2xl bg-black/30 border border-white/10">
                  <div className="flex items-center justify-between text-xs text-white/70 mb-2">
                    <span className="flex items-center gap-1.5 font-medium">
                      {masterVolume > 0 ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      Master Volume
                    </span>
                    <span className="font-mono">{Math.round(masterVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={masterVolume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                  />
                </div>

                <div className="space-y-2.5">
                  {SOUND_TRACKS.map((track) => {
                    const Icon = track.icon;
                    const isPlaying = !!activeSounds[track.id];
                    return (
                      <div
                        key={track.id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-xl ${
                              isPlaying ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/5 text-white/50'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium">{track.name}</span>
                        </div>
                        <button
                          onClick={() => toggleSoundTrack(track.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95 ${
                            isPlaying
                              ? 'bg-indigo-600 text-white shadow'
                              : 'bg-white/10 text-white/70 hover:bg-white/15'
                          }`}
                        >
                          {isPlaying ? 'Playing' : 'Muted'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Anonymous Profile Modal */}
          {isProfileOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
              <div className={`w-full max-w-md p-6 sm:p-8 rounded-3xl border ${currentTheme.card} shadow-2xl`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-bold text-lg">Anonymous Profile Token</h3>
                  </div>
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="text-white/50 hover:text-white text-xs px-2.5 py-1 rounded-xl bg-white/10"
                  >
                    Close
                  </button>
                </div>

                <p className="text-xs text-white/60 mb-6 leading-relaxed">
                  No email or personal details needed. Sign in with your 6-digit student number to save
                  your progress, coins, and themes to the class Google Sheet.
                </p>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/15 flex items-center justify-between mb-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-white/40 block">
                      Your Active Token
                    </span>
                    <span className="font-mono text-xl font-bold tracking-wider text-cyan-300">
                      {accessCode}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium transition active:scale-95"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="space-y-3 mb-6">
                  <label className="text-xs font-semibold text-white/70 block">
                    Load Old Token or Sync Another Device
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                      placeholder="e.g. STUDY-X9F2"
                      className="flex-1 px-4 py-2.5 rounded-2xl bg-black/30 border border-white/15 text-white placeholder-white/30 font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                    <button
                      onClick={handleConnectCode}
                      disabled={isSyncing}
                      className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs sm:text-sm text-white transition active:scale-95 flex items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>Sync</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-white/50">Want a clean slate?</span>
                  <button
                    onClick={handleGenerateNewCode}
                    className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition"
                  >
                    Create New Token
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Decoration Store Modal */}
          {isStoreOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
              <div className={`w-full max-w-xl p-6 sm:p-8 rounded-3xl border ${currentTheme.card} shadow-2xl`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-purple-400" />
                    <h3 className="font-bold text-lg">Decoration Store</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold text-xs">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      <span>{coins} Coins Available</span>
                    </div>
                    <button
                      onClick={() => setIsStoreOpen(false)}
                      className="text-white/50 hover:text-white text-xs px-2.5 py-1 rounded-xl bg-white/10"
                    >
                      Close
                    </button>
                  </div>
                </div>

                <p className="text-xs text-white/60 mb-6">
                  Use your hard-earned study coins to unlock aesthetic study room environments inspired by
                  Roblox lo-fi spaces.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {Object.values(THEMES).map((theme) => {
                    const isUnlocked = unlockedThemes.includes(theme.id);
                    const isEquipped = activeThemeId === theme.id;

                    return (
                      <div
                        key={theme.id}
                        className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                          isEquipped
                            ? `${theme.accentBorder} bg-white/10 shadow-lg`
                            : 'border-white/10 bg-black/25 hover:border-white/20'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-sm tracking-tight">{theme.name}</span>
                            {isEquipped && (
                              <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-white/50 leading-relaxed mb-4">{theme.subtitle}</p>
                        </div>

                        <div>
                          {isUnlocked ? (
                            <button
                              onClick={() => handleBuyTheme(theme.id)}
                              className={`w-full py-2 rounded-xl text-xs font-semibold transition active:scale-95 ${
                                isEquipped ? 'bg-white/20 text-white/70 cursor-default' : `${theme.button}`
                              }`}
                            >
                              {isEquipped ? 'Equipped' : 'Equip Theme'}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBuyTheme(theme.id)}
                              disabled={coins < theme.price}
                              className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 ${
                                coins >= theme.price
                                  ? `${theme.button}`
                                  : 'bg-white/5 text-white/30 border border-white/5 cursor-not-allowed'
                              }`}
                            >
                              <Lock className="w-3 h-3" />
                              <span>{theme.price} Coins</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden audio tags for ambient looping tracks (persistent in both modes) */}
      {SOUND_TRACKS.map((track) => (
        <audio
          key={track.id}
          ref={(el) => {
            if (el) audioRefs.current[track.id] = el;
          }}
          src={track.src}
          loop
          preload="none"
        />
      ))}
    </>
  );
}

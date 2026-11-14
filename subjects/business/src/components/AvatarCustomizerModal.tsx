import React, { useState, useEffect } from "react";
import {
  CharacterCustomizationState,
  deductStudyCoins,
  saveCustomizerState,
  loadCustomizerState,
  getStudyCoins,
} from "../lib/cookies";
import {
  SKIN_TONES,
  HAIR_DESIGNS,
  TOP_DESIGNS,
  BOTTOM_DESIGNS,
  SHOE_DESIGNS,
  CosmeticItem,
  SkinToneItem,
} from "../lib/data/customizer-items";
import { Sparkles, X, Check, Lock, Palette, Shirt, Scissors, Footprints, Wand2 } from "lucide-react";

interface AvatarCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customization?: CharacterCustomizationState;
  onUpdateCustomization?: (updated: CharacterCustomizationState) => void;
  coins?: number;
  onCoinsUpdated?: (newCoins: number) => void;
}

/**
 * Hair is drawn per style. Previously every style used the same cap, so the
 * ponytail (hair-5) looked identical to the default cut and its tail never
 * appeared.
 */
function AvatarHair({ hairId, color }: { hairId: string; color: string }) {
  const cap = (
    <path
      d="M 58 36 C 58 16, 102 16, 102 36 C 102 24, 94 20, 80 20 C 66 20, 58 24, 58 36 Z"
      fill={color}
    />
  );

  switch (hairId) {
    case "hair-2": // Academic Neat Crop
      return (
        <g>
          {cap}
          <path d="M 61 33 Q 80 24 99 33 L 97 29 Q 80 22 63 29 Z" fill={color} />
        </g>
      );

    case "hair-3": // Messy Revision Curls
      return (
        <g>
          <path d="M 56 34 C 52 16 68 9 80 13 C 92 7 108 14 104 34 Z" fill={color} />
          <circle cx="61" cy="23" r="6" fill={color} />
          <circle cx="73" cy="16" r="6.5" fill={color} />
          <circle cx="87" cy="15" r="6.5" fill={color} />
          <circle cx="99" cy="24" r="6" fill={color} />
        </g>
      );

    case "hair-4": // Modern Textured Quiff
      return (
        <g>
          {cap}
          <path d="M 59 30 C 64 13 87 7 101 22 C 96 15 78 14 70 21 C 66 25 62 27 59 30 Z" fill={color} />
        </g>
      );

    case "hair-5": // Sleek High Ponytail
      return (
        <g>
          {/* Tail falls behind the right shoulder */}
          <path
            d="M 97 29 C 114 29 122 45 116 61 C 112 72 105 80 99 87 C 110 72 109 55 100 44 Z"
            fill={color}
          />
          {cap}
          <path d="M 58 30 Q 70 20 86 28 Q 72 24 58 34 Z" fill={color} />
          {/* Exam ribbon at the base of the ponytail */}
          <ellipse cx="99" cy="31" rx="4.5" ry="3" fill="#BE123C" />
        </g>
      );

    case "hair-6": // Curly High-Top Fade
      return (
        <g>
          {cap}
          <path d="M 62 19 Q 80 1 98 19 L 96 27 Q 80 13 64 27 Z" fill={color} />
          <circle cx="68" cy="18" r="4" fill={color} />
          <circle cx="80" cy="12" r="4.5" fill={color} />
          <circle cx="92" cy="18" r="4" fill={color} />
        </g>
      );

    case "hair-7": // Spiky Anime Protagonist
      return (
        <g>
          {cap}
          <path
            d="M 59 24 L 65 7 L 70 20 L 77 3 L 82 20 L 90 5 L 94 21 L 101 11 L 101 29 Z"
            fill={color}
          />
        </g>
      );

    case "hair-8": // Regal Braided Crown
      return (
        <g>
          {cap}
          <path
            d="M 58 32 Q 59 17 72 13 Q 82 9 92 15 Q 102 19 102 32"
            stroke={color}
            strokeWidth="5.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
        </g>
      );

    case "hair-9": // Platinum Valedictorian
      return (
        <g>
          <path
            d="M 56 34 C 51 17 66 7 80 9 C 94 7 109 17 104 34 L 107 68 C 99 58 100 44 98 36 L 62 36 C 60 44 61 58 53 68 Z"
            fill={color}
          />
          {cap}
        </g>
      );

    case "hair-10": // Cyber Matrix Mohawk
      return (
        <g>
          {cap}
          <path d="M 71 21 C 73 3 87 3 89 21 Z" fill={color} />
          <path d="M 75 15 L 80 1 L 85 15 Z" fill={color} />
        </g>
      );

    default: // hair-1 Scholar Side-Part
      return (
        <g>
          {cap}
          <path d="M 58 30 Q 70 20 86 28 Q 72 24 58 34 Z" fill={color} />
        </g>
      );
  }
}

export const AvatarCustomizerModal: React.FC<AvatarCustomizerModalProps> = ({
  isOpen,
  onClose,
  customization: propsCustomization,
  onUpdateCustomization,
  coins: propsCoins,
  onCoinsUpdated,
}) => {
  const [activeCategory, setActiveCategory] = useState<"skin" | "hair" | "top" | "bottom" | "shoe">("skin");

  // Fallback internal state when used globally
  const [internalCustom, setInternalCustom] = useState<CharacterCustomizationState>(() => loadCustomizerState());
  const [internalCoins, setInternalCoins] = useState<number>(() => (typeof window !== "undefined" ? getStudyCoins() : 100));

  useEffect(() => {
    if (isOpen) {
      setInternalCustom(loadCustomizerState());
      setInternalCoins(getStudyCoins());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleCoinsEvent = () => {
      setInternalCoins(getStudyCoins());
    };
    window.addEventListener("ecbiz_coins_updated", handleCoinsEvent);
    return () => window.removeEventListener("ecbiz_coins_updated", handleCoinsEvent);
  }, []);

  if (!isOpen) return null;

  const customization = propsCustomization || internalCustom;
  const coins = typeof propsCoins === "number" ? propsCoins : internalCoins;

  const updateCustomState = (next: CharacterCustomizationState) => {
    setInternalCustom(next);
    saveCustomizerState(next);
    if (onUpdateCustomization) {
      onUpdateCustomization(next);
    }
  };

  const currentSkin = SKIN_TONES.find((s) => s.id === customization.skinToneId) || SKIN_TONES[0];
  const currentHair = HAIR_DESIGNS.find((h) => h.id === customization.hairId) || HAIR_DESIGNS[0];
  const currentTop = TOP_DESIGNS.find((t) => t.id === customization.topId) || TOP_DESIGNS[0];
  const currentBottom = BOTTOM_DESIGNS.find((b) => b.id === customization.bottomId) || BOTTOM_DESIGNS[0];
  const currentShoe = SHOE_DESIGNS.find((s) => s.id === customization.shoeId) || SHOE_DESIGNS[0];

  const handleBuyOrEquipItem = (item: CosmeticItem | SkinToneItem, category: "skin" | "hair" | "top" | "bottom" | "shoe") => {
    const isUnlocked = customization.unlockedItems.includes(item.id) || item.cost === 0;

    if (isUnlocked) {
      // Just equip
      const nextState: CharacterCustomizationState = {
        ...customization,
        ...(category === "skin" && { skinToneId: item.id }),
        ...(category === "hair" && { hairId: item.id }),
        ...(category === "top" && { topId: item.id }),
        ...(category === "bottom" && { bottomId: item.id }),
        ...(category === "shoe" && { shoeId: item.id }),
      };
      updateCustomState(nextState);
    } else {
      // Need to purchase
      if (coins < item.cost) return;
      const success = deductStudyCoins(item.cost);
      if (success) {
        const remaining = coins - item.cost;
        setInternalCoins(remaining);
        if (onCoinsUpdated) {
          onCoinsUpdated(remaining);
        }
        const nextUnlocked = [...customization.unlockedItems, item.id];
        const nextState: CharacterCustomizationState = {
          ...customization,
          unlockedItems: nextUnlocked,
          ...(category === "skin" && { skinToneId: item.id }),
          ...(category === "hair" && { hairId: item.id }),
          ...(category === "top" && { topId: item.id }),
          ...(category === "bottom" && { bottomId: item.id }),
          ...(category === "shoe" && { shoeId: item.id }),
        };
        updateCustomState(nextState);
      }
    }
  };

  const handleRandomize = () => {
    // Pick from already unlocked items
    const unlockedSkins = SKIN_TONES.filter((s) => customization.unlockedItems.includes(s.id) || s.cost === 0);
    const unlockedHairs = HAIR_DESIGNS.filter((h) => customization.unlockedItems.includes(h.id) || h.cost === 0);
    const unlockedTops = TOP_DESIGNS.filter((t) => customization.unlockedItems.includes(t.id) || t.cost === 0);
    const unlockedBottoms = BOTTOM_DESIGNS.filter((b) => customization.unlockedItems.includes(b.id) || b.cost === 0);
    const unlockedShoes = SHOE_DESIGNS.filter((s) => customization.unlockedItems.includes(s.id) || s.cost === 0);

    const randomSkin = unlockedSkins[Math.floor(Math.random() * unlockedSkins.length)] || SKIN_TONES[0];
    const randomHair = unlockedHairs[Math.floor(Math.random() * unlockedHairs.length)] || HAIR_DESIGNS[0];
    const randomTop = unlockedTops[Math.floor(Math.random() * unlockedTops.length)] || TOP_DESIGNS[0];
    const randomBottom = unlockedBottoms[Math.floor(Math.random() * unlockedBottoms.length)] || BOTTOM_DESIGNS[0];
    const randomShoe = unlockedShoes[Math.floor(Math.random() * unlockedShoes.length)] || SHOE_DESIGNS[0];

    const nextState: CharacterCustomizationState = {
      ...customization,
      skinToneId: randomSkin.id,
      hairId: randomHair.id,
      topId: randomTop.id,
      bottomId: randomBottom.id,
      shoeId: randomShoe.id,
    };
    updateCustomState(nextState);
  };

  const rarityBadge = (rarity?: string) => {
    switch (rarity) {
      case "legendary":
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-500 border border-amber-500/30">Legendary</span>;
      case "epic":
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-purple-500/20 text-purple-400 border border-purple-500/30">Epic</span>;
      case "rare":
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-sky-500/20 text-sky-400 border border-sky-500/30">Rare</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">Common</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-5xl max-h-[92vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/70 dark:bg-neutral-800/40">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 text-xl font-bold">
              ✨
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 dark:text-white">
                  Scholar Avatar Studio
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 font-bold uppercase">
                  Customization
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Unlock hairstyle, clothing, slacks, and shoes using study points earned across all questions!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Coin Balance */}
            <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-300 font-mono font-bold text-xs flex items-center gap-1.5 shadow-xs">
              <span className="text-sm">🪙</span>
              <span>{coins} Coins</span>
            </div>

            <button
              onClick={handleRandomize}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Randomize from unlocked wardrobe"
            >
              <Wand2 className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Randomize</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Body: Split View (Avatar Preview on Left, Wardrobe Picker on Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* LEFT: Live Avatar Mannequin Preview (4 cols) */}
          <div className="md:col-span-4 bg-gradient-to-b from-neutral-100 to-neutral-200/80 dark:from-neutral-950 dark:to-neutral-900 p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800">
            <div className="w-full text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold block mb-1">
                Live Avatar Preview
              </span>
              <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                Cambridge Candidate
              </h3>
            </div>

            {/* Dynamic Scaled SVG Scholar Avatar */}
            <div className="relative w-48 h-64 flex items-center justify-center my-3 drop-shadow-xl">
              <svg viewBox="0 0 160 220" className="w-full h-full">
                {/* Background Glow */}
                <ellipse cx="80" cy="210" rx="45" ry="8" fill="rgba(0,0,0,0.18)" />

                {/* 1. Legs / Pants */}
                <rect x="58" y="115" width="18" height="75" rx="4" fill={currentBottom.previewColor} />
                <rect x="84" y="115" width="18" height="75" rx="4" fill={currentBottom.previewColor} />
                {currentBottom.secondaryColor && (
                  <>
                    <line x1="58" y1="120" x2="58" y2="185" stroke={currentBottom.secondaryColor} strokeWidth="2" />
                    <line x1="102" y1="120" x2="102" y2="185" stroke={currentBottom.secondaryColor} strokeWidth="2" />
                  </>
                )}

                {/* 2. Shoes */}
                <ellipse cx="64" cy="193" rx="14" ry="7" fill={currentShoe.previewColor} />
                <ellipse cx="96" cy="193" rx="14" ry="7" fill={currentShoe.previewColor} />
                {currentShoe.secondaryColor && (
                  <>
                    <circle cx="64" cy="192" r="3" fill={currentShoe.secondaryColor} />
                    <circle cx="96" cy="192" r="3" fill={currentShoe.secondaryColor} />
                  </>
                )}

                {/* 3. Arms / Hands */}
                <rect x="36" y="66" width="12" height="48" rx="5" fill={currentTop.previewColor} />
                <circle cx="42" cy="118" r="6" fill={currentSkin.color} />
                <rect x="112" y="66" width="12" height="48" rx="5" fill={currentTop.previewColor} />
                <circle cx="118" cy="118" r="6" fill={currentSkin.color} />

                {/* 4. Torso / Shirt */}
                <rect x="48" y="60" width="64" height="60" rx="8" fill={currentTop.previewColor} />
                {currentTop.secondaryColor && (
                  <path d="M 68 60 L 80 85 L 92 60 Z" fill={currentTop.secondaryColor} />
                )}
                {/* Belt */}
                <rect x="48" y="114" width="64" height="6" fill="#18181B" />
                <rect x="74" y="113" width="12" height="8" rx="1" fill="#EAB308" />

                {/* 5. Neck */}
                <rect x="74" y="50" width="12" height="14" rx="2" fill={currentSkin.color} />

                {/* 6. Head / Face */}
                <circle cx="80" cy="38" r="22" fill={currentSkin.color} />

                {/* Eyes & Smile */}
                <circle cx="73" cy="36" r="2.5" fill="#1E293B" />
                <circle cx="87" cy="36" r="2.5" fill="#1E293B" />
                <path d="M 74 44 Q 80 49 86 44" stroke="#1E293B" strokeWidth="1.8" fill="none" strokeLinecap="round" />

                {/* 7. Hair */}
                <AvatarHair hairId={customization.hairId} color={currentHair.previewColor} />
              </svg>
            </div>

            {/* Currently Equipped Summary */}
            <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-3 text-xs space-y-1 shadow-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-500">Skin:</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{currentSkin.name}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-500">Hair:</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{currentHair.name}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-500">Top:</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{currentTop.name}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-500">Pants:</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{currentBottom.name}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-500">Shoes:</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{currentShoe.name}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Wardrobe Category Tabs & Catalog (8 cols) */}
          <div className="md:col-span-8 p-5 sm:p-6 flex flex-col overflow-hidden bg-white dark:bg-neutral-900">
            {/* Category Navigation Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 border-b border-neutral-200 dark:border-neutral-800 scrollbar-none">
              <button
                onClick={() => setActiveCategory("skin")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeCategory === "skin"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Skin Tones</span>
              </button>

              <button
                onClick={() => setActiveCategory("hair")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeCategory === "hair"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Hairstyles (10)</span>
              </button>

              <button
                onClick={() => setActiveCategory("top")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeCategory === "top"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
                }`}
              >
                <Shirt className="w-3.5 h-3.5" />
                <span>Clothing / Tops (10)</span>
              </button>

              <button
                onClick={() => setActiveCategory("bottom")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeCategory === "bottom"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
                }`}
              >
                <span>👖</span>
                <span>Pants / Bottoms (10)</span>
              </button>

              <button
                onClick={() => setActiveCategory("shoe")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeCategory === "shoe"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
                }`}
              >
                <Footprints className="w-3.5 h-3.5" />
                <span>Shoes (10)</span>
              </button>
            </div>

            {/* Catalog Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
              {/* Category 1: Skin Tones */}
              {activeCategory === "skin" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {SKIN_TONES.map((item) => {
                    const isEquipped = customization.skinToneId === item.id;
                    const isUnlocked = customization.unlockedItems.includes(item.id) || item.cost === 0;
                    const canAfford = coins >= item.cost;

                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                          isEquipped
                            ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20 shadow-sm"
                            : "border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className="w-9 h-9 rounded-full shadow-inner border border-black/10 shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <div>
                            <div className="font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-1.5">
                              <span>{item.name}</span>
                              {item.cost === 0 && <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">FREE</span>}
                            </div>
                            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">{item.description}</div>
                          </div>
                        </div>

                        <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-800/60 flex items-center justify-between">
                          {isEquipped ? (
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Equipped
                            </span>
                          ) : isUnlocked ? (
                            <button
                              onClick={() => handleBuyOrEquipItem(item, "skin")}
                              className="px-3 py-1 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 text-xs font-semibold rounded-lg text-neutral-900 dark:text-white cursor-pointer"
                            >
                              Equip
                            </button>
                          ) : (
                            <button
                              disabled={!canAfford}
                              onClick={() => handleBuyOrEquipItem(item, "skin")}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                                canAfford
                                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                                  : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
                              }`}
                            >
                              <Lock className="w-3 h-3" />
                              <span>{item.cost} 🪙</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Category 2: Hair (10 designs) */}
              {activeCategory === "hair" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {HAIR_DESIGNS.map((item) => {
                    const isEquipped = customization.hairId === item.id;
                    const isUnlocked = customization.unlockedItems.includes(item.id) || item.cost === 0;
                    const canAfford = coins >= item.cost;

                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                          isEquipped
                            ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20 shadow-sm"
                            : "border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xl">{item.icon}</span>
                            {rarityBadge(item.rarity)}
                          </div>
                          <div className="font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-2">
                            <span>{item.name}</span>
                            <span
                              className="w-3 h-3 rounded-full border border-black/20"
                              style={{ backgroundColor: item.previewColor }}
                            />
                          </div>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">{item.description}</p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-neutral-200 dark:border-neutral-800/60 flex items-center justify-between">
                          <span className="text-[11px] font-mono text-neutral-500">
                            {item.cost === 0 ? "Starter Default" : `${item.cost} Coins`}
                          </span>

                          {isEquipped ? (
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Equipped
                            </span>
                          ) : isUnlocked ? (
                            <button
                              onClick={() => handleBuyOrEquipItem(item, "hair")}
                              className="px-3 py-1 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 text-xs font-semibold rounded-lg text-neutral-900 dark:text-white cursor-pointer"
                            >
                              Equip
                            </button>
                          ) : (
                            <button
                              disabled={!canAfford}
                              onClick={() => handleBuyOrEquipItem(item, "hair")}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                                canAfford
                                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                                  : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
                              }`}
                            >
                              <Lock className="w-3 h-3" />
                              <span>Unlock {item.cost} 🪙</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Category 3: Tops (10 designs) */}
              {activeCategory === "top" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TOP_DESIGNS.map((item) => {
                    const isEquipped = customization.topId === item.id;
                    const isUnlocked = customization.unlockedItems.includes(item.id) || item.cost === 0;
                    const canAfford = coins >= item.cost;

                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                          isEquipped
                            ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20 shadow-sm"
                            : "border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xl">{item.icon}</span>
                            {rarityBadge(item.rarity)}
                          </div>
                          <div className="font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-2">
                            <span>{item.name}</span>
                            <span
                              className="w-3 h-3 rounded-full border border-black/20"
                              style={{ backgroundColor: item.previewColor }}
                            />
                          </div>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">{item.description}</p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-neutral-200 dark:border-neutral-800/60 flex items-center justify-between">
                          <span className="text-[11px] font-mono text-neutral-500">
                            {item.cost === 0 ? "Starter Default" : `${item.cost} Coins`}
                          </span>

                          {isEquipped ? (
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Equipped
                            </span>
                          ) : isUnlocked ? (
                            <button
                              onClick={() => handleBuyOrEquipItem(item, "top")}
                              className="px-3 py-1 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 text-xs font-semibold rounded-lg text-neutral-900 dark:text-white cursor-pointer"
                            >
                              Equip
                            </button>
                          ) : (
                            <button
                              disabled={!canAfford}
                              onClick={() => handleBuyOrEquipItem(item, "top")}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                                canAfford
                                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                                  : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
                              }`}
                            >
                              <Lock className="w-3 h-3" />
                              <span>Unlock {item.cost} 🪙</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Category 4: Bottoms / Pants (10 designs) */}
              {activeCategory === "bottom" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BOTTOM_DESIGNS.map((item) => {
                    const isEquipped = customization.bottomId === item.id;
                    const isUnlocked = customization.unlockedItems.includes(item.id) || item.cost === 0;
                    const canAfford = coins >= item.cost;

                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                          isEquipped
                            ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20 shadow-sm"
                            : "border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xl">{item.icon}</span>
                            {rarityBadge(item.rarity)}
                          </div>
                          <div className="font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-2">
                            <span>{item.name}</span>
                            <span
                              className="w-3 h-3 rounded-full border border-black/20"
                              style={{ backgroundColor: item.previewColor }}
                            />
                          </div>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">{item.description}</p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-neutral-200 dark:border-neutral-800/60 flex items-center justify-between">
                          <span className="text-[11px] font-mono text-neutral-500">
                            {item.cost === 0 ? "Starter Default" : `${item.cost} Coins`}
                          </span>

                          {isEquipped ? (
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Equipped
                            </span>
                          ) : isUnlocked ? (
                            <button
                              onClick={() => handleBuyOrEquipItem(item, "bottom")}
                              className="px-3 py-1 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 text-xs font-semibold rounded-lg text-neutral-900 dark:text-white cursor-pointer"
                            >
                              Equip
                            </button>
                          ) : (
                            <button
                              disabled={!canAfford}
                              onClick={() => handleBuyOrEquipItem(item, "bottom")}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                                canAfford
                                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                                  : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
                              }`}
                            >
                              <Lock className="w-3 h-3" />
                              <span>Unlock {item.cost} 🪙</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Category 5: Shoes (10 designs) */}
              {activeCategory === "shoe" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SHOE_DESIGNS.map((item) => {
                    const isEquipped = customization.shoeId === item.id;
                    const isUnlocked = customization.unlockedItems.includes(item.id) || item.cost === 0;
                    const canAfford = coins >= item.cost;

                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                          isEquipped
                            ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20 shadow-sm"
                            : "border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xl">{item.icon}</span>
                            {rarityBadge(item.rarity)}
                          </div>
                          <div className="font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-2">
                            <span>{item.name}</span>
                            <span
                              className="w-3 h-3 rounded-full border border-black/20"
                              style={{ backgroundColor: item.previewColor }}
                            />
                          </div>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">{item.description}</p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-neutral-200 dark:border-neutral-800/60 flex items-center justify-between">
                          <span className="text-[11px] font-mono text-neutral-500">
                            {item.cost === 0 ? "Starter Default" : `${item.cost} Coins`}
                          </span>

                          {isEquipped ? (
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Equipped
                            </span>
                          ) : isUnlocked ? (
                            <button
                              onClick={() => handleBuyOrEquipItem(item, "shoe")}
                              className="px-3 py-1 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 text-xs font-semibold rounded-lg text-neutral-900 dark:text-white cursor-pointer"
                            >
                              Equip
                            </button>
                          ) : (
                            <button
                              disabled={!canAfford}
                              onClick={() => handleBuyOrEquipItem(item, "shoe")}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                                canAfford
                                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                                  : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
                              }`}
                            >
                              <Lock className="w-3 h-3" />
                              <span>Unlock {item.cost} 🪙</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

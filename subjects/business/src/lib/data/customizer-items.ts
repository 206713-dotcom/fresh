export interface CosmeticItem {
  id: string;
  name: string;
  category: "hair" | "top" | "bottom" | "shoe" | "skin";
  cost: number;
  previewColor: string;
  secondaryColor?: string;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  icon: string;
}

export interface SkinToneItem {
  id: string;
  name: string;
  color: string;
  cost: number;
  description: string;
}

export const SKIN_TONES: SkinToneItem[] = [
  { id: "skin-1", name: "Fair Ivory", color: "#F7D0B3", cost: 0, description: "Classic academic light tone" },
  { id: "skin-2", name: "Warm Peach", color: "#E8B18A", cost: 0, description: "Warm natural peach tone" },
  { id: "skin-3", name: "Sunlit Olive", color: "#D19C74", cost: 0, description: "Sun-kissed olive complexion (Free)" },
  { id: "skin-4", name: "Golden Bronze", color: "#A76E43", cost: 0, description: "Rich golden bronze complexion (Free)" },
  { id: "skin-5", name: "Deep Amber", color: "#7B4B27", cost: 0, description: "Deep radiant amber tone (Free)" },
  { id: "skin-6", name: "Espresso", color: "#4B2810", cost: 0, description: "Deep polished espresso tone (Free)" },
  { id: "skin-7", name: "Cyberpunk Azure", color: "#38BDF8", cost: 150, description: "Synthetic blue holographic android tone" },
];

export const HAIR_DESIGNS: CosmeticItem[] = [
  { id: "hair-1", name: "Scholar Side-Part", category: "hair", cost: 0, previewColor: "#2B2118", description: "Neat, classic side part for exam focus", rarity: "common", icon: "🧑‍🎓" },
  { id: "hair-2", name: "Academic Neat Crop", category: "hair", cost: 20, previewColor: "#171717", description: "Short tapered crop with sharp edges", rarity: "common", icon: "💇" },
  { id: "hair-3", name: "Messy Revision Curls", category: "hair", cost: 40, previewColor: "#451A03", description: "Voluminous wild curls from late-night cramming", rarity: "rare", icon: "👨‍🦱" },
  { id: "hair-4", name: "Modern Textured Quiff", category: "hair", cost: 60, previewColor: "#3B2219", description: "Upswept brushed-back modern styling", rarity: "rare", icon: "✨" },
  { id: "hair-5", name: "Sleek High Ponytail", category: "hair", cost: 85, previewColor: "#1C1917", description: "High ponytail tied with an exam ribbon", rarity: "rare", icon: "👱‍♀️" },
  { id: "hair-6", name: "Curly High-Top Fade", category: "hair", cost: 110, previewColor: "#0A0A0A", description: "Crisp gradient fade with tight coils", rarity: "epic", icon: "💈" },
  { id: "hair-7", name: "Spiky Anime Protagonist", category: "hair", cost: 145, previewColor: "#DC2626", description: "Fiery red spikes ready to conquer the syllabus", rarity: "epic", icon: "🔥" },
  { id: "hair-8", name: "Regal Braided Crown", category: "hair", cost: 180, previewColor: "#78350F", description: "Intricately woven braids wrapped over crown", rarity: "epic", icon: "👑" },
  { id: "hair-9", name: "Platinum Valedictorian", category: "hair", cost: 250, previewColor: "#F1F5F9", description: "Striking silver-platinum flowing locks", rarity: "legendary", icon: "⚡" },
  { id: "hair-10", name: "Cyber Matrix Mohawk", category: "hair", cost: 350, previewColor: "#06B6D4", description: "Glowing neon cyan holographic mohawk", rarity: "legendary", icon: "🤖" },
];

export const TOP_DESIGNS: CosmeticItem[] = [
  { id: "top-1", name: "Candidate Basic Tee", category: "top", cost: 0, previewColor: "#F8FAFC", secondaryColor: "#CBD5E1", description: "Clean white combed cotton exam tee", rarity: "common", icon: "👕" },
  { id: "top-2", name: "Cambridge Navy Blazer", category: "top", cost: 25, previewColor: "#0F2042", secondaryColor: "#F59E0B", description: "Formal navy wool blazer with gold brass buttons", rarity: "common", icon: "🧥" },
  { id: "top-3", name: "Oxford Burgundy Knit Vest", category: "top", cost: 45, previewColor: "#881337", secondaryColor: "#FDE68A", description: "Scholastic cable-knit sweater vest over collar", rarity: "rare", icon: "👔" },
  { id: "top-4", name: "Campus Varsity Bomber", category: "top", cost: 70, previewColor: "#047857", secondaryColor: "#FEF08A", description: "Emerald green wool jacket with leather sleeves", rarity: "rare", icon: "⚾" },
  { id: "top-5", name: "Pinstripe Business Shirt", category: "top", cost: 95, previewColor: "#0284C7", secondaryColor: "#FFFFFF", description: "Sharp tailored sky-blue pinstripe executive shirt", rarity: "rare", icon: "💼" },
  { id: "top-6", name: "Vintage Scholar Trench", category: "top", cost: 130, previewColor: "#78350F", secondaryColor: "#451A03", description: "Distressed amber-brown leather scholar coat", rarity: "epic", icon: "🧥" },
  { id: "top-7", name: "Study Space Lo-Fi Hoodie", category: "top", cost: 170, previewColor: "#7C3AED", secondaryColor: "#C4B5FD", description: "Plush oversized lavender hoodie with lo-fi badge", rarity: "epic", icon: "🎧" },
  { id: "top-8", name: "Wall Street Silk Waistcoat", category: "top", cost: 220, previewColor: "#1E293B", secondaryColor: "#FBBF24", description: "Charcoal damask vest with antique gold pocket chain", rarity: "epic", icon: "📈" },
  { id: "top-9", name: "Royal Valedictorian Robe", category: "top", cost: 320, previewColor: "#991B1B", secondaryColor: "#FDE047", description: "Crimson ceremonial velvet robe with gold satin trim", rarity: "legendary", icon: "🎓" },
  { id: "top-10", name: "Quantum Cyber Carbon Plate", category: "top", cost: 480, previewColor: "#06B6D4", secondaryColor: "#A855F7", description: "Glowing reactive nanofiber chest armor with neon lights", rarity: "legendary", icon: "🛡️" },
];

export const BOTTOM_DESIGNS: CosmeticItem[] = [
  { id: "bot-1", name: "Standard Exam Trousers", category: "bottom", cost: 0, previewColor: "#334155", description: "Ironed charcoal grey school slacks", rarity: "common", icon: "👖" },
  { id: "bot-2", name: "Navy Pleated Chinos", category: "bottom", cost: 20, previewColor: "#1E293B", description: "Tailored slim-fit midnight navy chinos", rarity: "common", icon: "👖" },
  { id: "bot-3", name: "Campus Denim Jeans", category: "bottom", cost: 40, previewColor: "#2563EB", description: "Washed indigo durable university denim", rarity: "rare", icon: "👖" },
  { id: "bot-4", name: "Sand Khaki Slacks", category: "bottom", cost: 60, previewColor: "#D97706", description: "Breathable tailored sand-beige summer trousers", rarity: "rare", icon: "👖" },
  { id: "bot-5", name: "Highland Academic Plaid", category: "bottom", cost: 85, previewColor: "#991B1B", secondaryColor: "#1E293B", description: "Crisp red and black woven tartan check trousers", rarity: "rare", icon: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  { id: "bot-6", name: "Athletic Striped Trackpants", category: "bottom", cost: 115, previewColor: "#0F172A", secondaryColor: "#38BDF8", description: "Matte black runners with dual speed stripes", rarity: "epic", icon: "🏃" },
  { id: "bot-7", name: "Olive Field Cargo Pants", category: "bottom", cost: 150, previewColor: "#3F6212", description: "Tactical pocketed cargo pants with brass clasps", rarity: "epic", icon: "🪖" },
  { id: "bot-8", name: "Retro High-Waist Trousers", category: "bottom", cost: 200, previewColor: "#78350F", description: "1950s scholastic wide-leg camel wool trousers", rarity: "epic", icon: "🕰️" },
  { id: "bot-9", name: "Tuxedo Satin-Stripe Slacks", category: "bottom", cost: 280, previewColor: "#020617", secondaryColor: "#E2E8F0", description: "Midnight black formal trousers with silk side-braid", rarity: "legendary", icon: "🤵" },
  { id: "bot-10", name: "Cyber Neon Matrix Joggers", category: "bottom", cost: 420, previewColor: "#0369A1", secondaryColor: "#06B6D4", description: "Matte graphite techwear with pulsating neon piping", rarity: "legendary", icon: "⚡" },
];

export const SHOE_DESIGNS: CosmeticItem[] = [
  { id: "shoe-1", name: "Black Polish Loafers", category: "shoe", cost: 0, previewColor: "#1E293B", description: "Standard issue shiny black school shoes", rarity: "common", icon: "👞" },
  { id: "shoe-2", name: "Clean White Court Sneakers", category: "shoe", cost: 20, previewColor: "#F8FAFC", description: "Minimalist leather white casual sneakers", rarity: "common", icon: "👟" },
  { id: "shoe-3", name: "Tan Leather Oxford Brogues", category: "shoe", cost: 40, previewColor: "#B45309", description: "Perforated burnished cognac leather brogues", rarity: "rare", icon: "👞" },
  { id: "shoe-4", name: "High-Top Retro Sneakers", category: "shoe", cost: 65, previewColor: "#DC2626", secondaryColor: "#111827", description: "Iconic red, white & black basketball high-tops", rarity: "rare", icon: "🏀" },
  { id: "shoe-5", name: "Black Chelsea Boots", category: "shoe", cost: 90, previewColor: "#09090B", description: "Sleek elastic-sided polished urban boots", rarity: "rare", icon: "🥾" },
  { id: "shoe-6", name: "Chunky Platform Runners", category: "shoe", cost: 125, previewColor: "#E2E8F0", secondaryColor: "#3B82F6", description: "Max-cushion streetwear platform sneakers", rarity: "epic", icon: "👟" },
  { id: "shoe-7", name: "Cordovan Wine Derbies", category: "shoe", cost: 165, previewColor: "#4C0519", description: "Deep burgundy high-shine formal calfskin shoes", rarity: "epic", icon: "👞" },
  { id: "shoe-8", name: "Royal Gold Wingtip Slippers", category: "shoe", cost: 230, previewColor: "#CA8A04", secondaryColor: "#FEF08A", description: "Gold thread embroidered velvet ceremonial loafers", rarity: "epic", icon: "✨" },
  { id: "shoe-9", name: "Anti-Gravity Hover-Jets", category: "shoe", cost: 340, previewColor: "#0284C7", secondaryColor: "#38BDF8", description: "Magnetic levitation boots that float 2 inches up", rarity: "legendary", icon: "🚀" },
  { id: "shoe-10", name: "Mythic Diamond Striders", category: "shoe", cost: 500, previewColor: "#38BDF8", secondaryColor: "#F0FDFA", description: "Custom diamond-encrusted soles that leave sparkle trails", rarity: "legendary", icon: "💎" },
];

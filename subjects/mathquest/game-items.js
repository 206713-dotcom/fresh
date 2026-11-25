export const RARITIES = [
  {id:'common',name:'Common',tone:'#8ca0b8',mult:1,chance:46.25,resale:0.20},
  {id:'uncommon',name:'Uncommon',tone:'#38b87d',mult:2,chance:30,resale:0.30},
  {id:'rare',name:'Rare',tone:'#4a8dff',mult:3,chance:20,resale:0.40},
  {id:'legendary',name:'Legendary',tone:'#a86bff',mult:4,chance:2.5,resale:0.55},
  {id:'mythic',name:'Mythic',tone:'#ff8a3d',mult:5,chance:1,resale:0.65},
  {id:'secret',name:'Secret',tone:'#ff4da3',mult:6,chance:0.25,resale:0.80}
];

export const SLOTS = [
  {id:'head',label:'Headpiece',bonus:'Hint power',base:1,suffix:' level'},
  {id:'body',label:'Outfit',bonus:'Lesson PyCoins',base:5,suffix:'%'},
  {id:'hands',label:'Hand gear',bonus:'Team-game PyCoins',base:5,suffix:'%'},
  {id:'legs',label:'Leg gear',bonus:'Bonus XP',base:10,suffix:'%'},
  {id:'back',label:'Back gear',bonus:'Quest PyCoins',base:5,suffix:'%'},
  {id:'aura',label:'Aura',bonus:'Checkpoint PyCoins',base:5,suffix:'%'}
];

export const CRATES = [
  {id:'helmet',slot:'head',name:'Helmet Crate',theme:'pixel',cost:100,desc:'Only headpieces. Open this crate to get hats, crowns and visors.'},
  {id:'outfit',slot:'body',name:'Outfit Crate',theme:'cosmic',cost:115,desc:'Only outfits. Open this crate to get robes, jackets and uniforms.'},
  {id:'gloves',slot:'hands',name:'Gloves Crate',theme:'ocean',cost:110,desc:'Only hand gear. Open this crate to get gloves, cuffs and gauntlets.'},
  {id:'boots',slot:'legs',name:'Boots Crate',theme:'royal',cost:120,desc:'Only leg gear. Open this crate to get shoes, striders and boots.'},
  {id:'backpack',slot:'back',name:'Backpack Crate',theme:'robot',cost:125,desc:'Only back gear. Open this crate to get packs, capes and frames.'},
  {id:'halo',slot:'aura',name:'Halo Crate',theme:'dragon',cost:130,desc:'Only aura items. Open this crate to get rings, lights and glows.'}
];

const slotItemDefs = {
  head:[['Starter Cap','pixel'],['Leaf Visor','jungle'],['Star Circlet','cosmic'],['Scholar Crown','royal'],['Rocket Helm','robot'],['Galaxy Halo Crown','dragon']],
  body:[['Arcade Hoodie','pixel'],['Explorer Vest','jungle'],['Nebula Robe','cosmic'],['Royal Uniform','royal'],['Circuit Suit','robot'],['Dragon Scale Coat','dragon']],
  hands:[['Bit Grips','pixel'],['Vine Wraps','jungle'],['Orbit Gloves','cosmic'],['Gold Cuffs','royal'],['Servo Gauntlets','robot'],['Inferno Talons','dragon']],
  legs:[['Turbo Kicks','pixel'],['Trail Striders','jungle'],['Current Fins','ocean'],['Comet Boots','cosmic'],['Champion Boots','royal'],['Phase Walkers','robot']],
  back:[['Data Pack','pixel'],['Canopy Pack','jungle'],['Polar Cape','winter'],['Rocket Frame','cosmic'],['Jet Pack','robot'],['Dragon Wings','dragon']],
  aura:[['Neon Pulse','pixel'],['Aqua Ring','ocean'],['Aurora Mist','winter'],['Wisdom Light','royal'],['Inferno Crest','dragon'],['Galaxy Halo','cosmic']]
};

export const ITEMS = CRATES.flatMap(crate => {
  const names = slotItemDefs[crate.slot] || [];
  return RARITIES.map((rarity, i) => {
    const [name, theme] = names[i] || [`${rarity.name} ${crate.name}`, crate.theme];
    const slotMeta = SLOTS.find(s=>s.id===crate.slot);
    return {
      id:`${crate.id}-${rarity.id}`,
      crate:crate.id,
      name,
      rarity:rarity.id,
      slot:crate.slot,
      price:crate.cost,
      theme:theme || crate.theme,
      color:rarity.tone,
      bonus:slotMeta.base*rarity.mult,
      label:rarity.name,
      art:`${theme || crate.theme}-${crate.slot}`
    };
  });
});


// Preserve items owned before category crates were introduced; inventory is never wiped.
const LEGACY_CRATES = [
  {id:'pixel',theme:'pixel',names:['Pixel Visor','Arcade Jacket','Bit Gloves','8-Bit Sneakers','Pixel Pack','Neon Halo']},
  {id:'cosmic',theme:'cosmic',names:['Star Circlet','Nebula Robe','Orbit Gloves','Comet Boots','Rocket Frame','Galaxy Halo']},
  {id:'jungle',theme:'jungle',names:['Leaf Crown','Explorer Vest','Vine Grips','Trail Walkers','Canopy Pack','Firefly Glow']},
  {id:'ocean',theme:'ocean',names:['Coral Crown','Tide Jacket','Pearl Gloves','Flipper Boots','Shell Pack','Ocean Aura']},
  {id:'dragon',theme:'dragon',names:['Dragon Horns','Scale Armor','Flame Claws','Ember Boots','Dragon Wings','Inferno Aura']},
  {id:'winter',theme:'winter',names:['Frost Cap','Snow Coat','Ice Mittens','Glacier Boots','Polar Cape','Snowstorm Aura']},
  {id:'robot',theme:'robot',names:['Robot Antenna','Circuit Suit','Servo Gloves','Turbo Boots','Jetpack','Hologram Aura']},
  {id:'royal',theme:'royal',names:['Scholar Crown','Royal Coat','Gold Gauntlets','Champion Boots','Velvet Cape','Wisdom Glow']}
];
export const LEGACY_ITEMS = LEGACY_CRATES.flatMap(crate => RARITIES.map((rarity,i)=>{
  const slot=SLOTS[i];
  return {id:`${crate.id}-${rarity.id}`,crate:crate.id,theme:crate.theme,
    name:crate.names[i],rarity:rarity.id,slot:slot.id,
    price:0,color:rarity.tone,bonus:slot.base*rarity.mult,legacy:true};
}));

export function itemById(id){return ITEMS.find(x=>x.id===id)||LEGACY_ITEMS.find(x=>x.id===id);}
export function gearSellValue(item) {
  const rate = RARITIES.find(rarity => rarity.id === item.rarity).resale;
  const crateCost = item.price || CRATES.find(crate => crate.slot === item.slot).cost;
  return Math.floor(crateCost * rate);
}
export function slotBuff(equipped,slot){const item=itemById(equipped?.[slot]);return item&&item.slot===slot?item.bonus:0;}
export function chooseRarity(){
  const roll=Math.random()*100;
  let total=0;
  for(const rarity of RARITIES){total+=rarity.chance;if(roll<=total)return rarity.id;}
  return 'common';
}
export function crateItem(crateId,rarityId){return ITEMS.find(x=>x.crate===crateId&&x.rarity===rarityId)||null;}

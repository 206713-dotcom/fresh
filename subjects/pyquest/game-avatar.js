/**
 * PyQuest integrated equipment renderer.
 * All wearables share one SVG coordinate system and replace the matching body
 * part. Product artwork remains in the crate/collection cards, but is never
 * pasted on top of the avatar as an oversized, unrelated picture.
 */
import {itemById} from './game-items.js';

const PALETTES = {
  pixel:  {base:'#4877e6',light:'#88d3ff',dark:'#273b89',glow:'#48efff',trim:'#d8f8ff'},
  jungle: {base:'#279b69',light:'#a1e865',dark:'#135a45',glow:'#b8ff83',trim:'#defba2'},
  cosmic: {base:'#6954c7',light:'#b9a4ff',dark:'#342866',glow:'#e7a9ff',trim:'#ffdb84'},
  royal:  {base:'#7753c6',light:'#c8a2ed',dark:'#402b76',glow:'#e2baff',trim:'#ffd275'},
  robot:  {base:'#438fa7',light:'#8ae2e0',dark:'#244c77',glow:'#67f2e2',trim:'#ffdd86'},
  dragon: {base:'#b74d58',light:'#f08a59',dark:'#713346',glow:'#ffad60',trim:'#ffd47a'},
  ocean:  {base:'#268ead',light:'#94e8f5',dark:'#245879',glow:'#79f3ff',trim:'#dcfbff'},
  winter: {base:'#6f9dce',light:'#d6efff',dark:'#37547b',glow:'#b3edff',trim:'#e6faff'}
};
const DEFAULT = {base:'#5674d9',light:'#9383f3',dark:'#334777',glow:'#6fe0ff',trim:'#ffc66f'};
const RARITY = {
  common:'#a1adc5',uncommon:'#48d497',rare:'#55a4ff',
  legendary:'#b683ff',mythic:'#ffad66',secret:'#ff83ce'
};
const escapeAttr = val => String(val??'').replace(/[&<>"']/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const equipped = (wallet,slot) => {
  const id = wallet?.equipped?.[slot];
  const item = itemById(id);
  // Never display an item from another slot in the wrong position.
  return item?.slot===slot ? item : null;
};
const tint = item => PALETTES[item?.theme] || DEFAULT;
const outlines = 'stroke="#252f57" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"';
const outlineThin = 'stroke="#25355c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
const emblem = (x,y,color='#fff1c4') => `<path d="M${x} ${y-15} l5 10 10 5 -10 5 -5 10 -5 -10 -10 -5 10 -5Z" fill="${color}" stroke="#e9bd66" stroke-width="2"/><circle cx="${x}" cy="${y}" r="3" fill="#fff"/>`;
const accentDots=(c)=>`<circle cx="138" cy="218" r="3" fill="${c}"/><circle cx="182" cy="218" r="3" fill="${c}"/>`;
const trimCrest = (item,x,y) => {
  const c=tint(item),r=item?.rarity;
  if(r==='secret') return `<circle cx="${x}" cy="${y}" r="15" fill="${c.glow}" opacity=".18"/>${emblem(x,y,c.trim)}<circle cx="${x}" cy="${y}" r="3" fill="#fff"/>`;
  if(r==='mythic'||r==='legendary')return emblem(x,y,c.trim);
  if(r==='rare')return `<path d="M${x} ${y-9}l8 9-8 9-8-9Z" fill="${c.glow}" stroke="${c.trim}" stroke-width="2"/>`;
  return `<path d="M${x-9} ${y}h18" stroke="${c.trim}" stroke-width="3.5" stroke-linecap="round"/>`;
};

function aura(item){
  if(!item)return '';
  const c=tint(item),rarity=item.rarity;
  // Behind the whole person; the ring itself floats ABOVE, never across the face.
  const ringY=rarity==='secret'?41:50;
  return `<g class="avatar-wear-avatar-aura">
    <ellipse cx="160" cy="219" rx="125" ry="158" fill="${c.glow}" opacity=".10" filter="url(#av-softGlow)"/>
    <ellipse cx="160" cy="220" rx="101" ry="137" fill="none" stroke="${c.glow}" stroke-width="2.5" opacity=".18" stroke-dasharray="3 11"/>
    <ellipse cx="160" cy="${ringY}" rx="57" ry="12" fill="none" stroke="${c.dark}" stroke-width="8" opacity=".3"/>
    <ellipse cx="160" cy="${ringY-2}" rx="57" ry="12" fill="none" stroke="${c.glow}" stroke-width="6"/>
    <ellipse cx="160" cy="${ringY-3}" rx="55" ry="10.5" fill="none" stroke="#fff" stroke-width="1.6" opacity=".92"/>
    ${[ [93,101],[232,149],[99,288],[231,310] ].map(([x,y],i)=>`<path d="M${x} ${y-8-i%2*2} v${16+i%2*4} M${x-8-i%2*2} ${y} h${16+i%2*4}" stroke="${c.glow}" stroke-width="2.4" opacity=".75" stroke-linecap="round"/>`).join('')}
  </g>`;
}
function backEquipment(item){
  if(!item)return '';
  const c=tint(item),id=(item.name||'').toLowerCase();
  if(/wing|dragon/.test(id)){
    return `<g class="avatar-wear-back"><path d="M128 211 Q78 142 43 167 Q58 210 40 254 Q90 245 115 280Z" fill="${c.base}" ${outlines}/>
    <path d="M192 211 Q242 142 277 167 Q262 210 280 254 Q230 245 205 280Z" fill="${c.base}" ${outlines}/>
    <path d="M103 211Q80 201 60 184M217 211Q240 201 260 184" stroke="${c.glow}" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
  }
  if(/cape/.test(id)){
    return `<g class="avatar-wear-back"><path d="M128 189Q102 192 89 226L63 353Q159 394 257 353L232 226Q218 190 190 189Z" fill="${c.base}" ${outlines}/>
      <path d="M87 344Q158 370 235 344" fill="none" stroke="${c.trim}" stroke-width="7"/></g>`;
  }
  const jets=/rocket|jet|frame/.test(id);
  return `<g class="avatar-wear-back">
    <rect x="105" y="197" width="110" height="128" rx="28" fill="${c.dark}" ${outlines}/>
    <rect x="113" y="207" width="94" height="104" rx="22" fill="${c.base}" stroke="${c.trim}" stroke-width="4"/>
    <path d="M136 221h48M137 292h46" stroke="${c.light}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="160" cy="259" r="24" fill="${c.dark}" stroke="${c.trim}" stroke-width="4"/>
    <circle cx="160" cy="259" r="13" fill="${c.glow}" opacity=".95"/>
    ${jets?`<path d="M122 318l-9 28 17-9 8-19Z M198 318l9 28-17-9-8-19Z" fill="${c.glow}" opacity=".92"/>
      <rect x="57" y="231" width="21" height="81" rx="9" fill="${c.dark}" ${outlineThin}/>
      <rect x="242" y="231" width="21" height="81" rx="9" fill="${c.dark}" ${outlineThin}/>
      <path d="M64 303l4 26 5-26M249 303l4 26 5-26" fill="${c.glow}" stroke="${c.trim}" stroke-width="2"/>`:''}
  </g>`;
}
function backHarness(item){
  if(!item)return '';
  const c=tint(item);
  if(/wing|dragon|cape/i.test(item.name||''))return '';
  return `<g class="avatar-wear-harness" fill="none">
    <path d="M120 201Q115 230 120 267M200 201Q205 230 200 267" stroke="${c.dark}" stroke-width="10" stroke-linecap="round"/>
    <path d="M120 201Q115 230 120 267M200 201Q205 230 200 267" stroke="${c.trim}" stroke-width="4" stroke-linecap="round" opacity=".78"/>
    <path d="M125 261H195" stroke="${c.dark}" stroke-width="8" stroke-linecap="round"/>
    <rect x="151" y="252" width="18" height="16" rx="5" fill="${c.glow}" stroke="${c.dark}" stroke-width="3"/>
  </g>`;
}
function baseLegs(){
  return `<g class="avatar-base-legs">
    <path d="M101 284h53l-4 101h-54l-8-89Z" fill="url(#av-pants)" ${outlines}/>
    <path d="M166 284h53l13 101h-58l-8-101Z" fill="url(#av-pants)" ${outlines}/>
    <path d="M155 293v68M181 294v67" stroke="#8c9ac8" stroke-width="3" opacity=".4"/>
    <path d="M110 314h27M187 314h27" stroke="#586d9d" stroke-width="3" opacity=".55"/>
  </g>`;
}
function boots(item){
  const c=tint(item),have=!!item,r=item?.rarity;
  const fancy = r==='legendary'||r==='mythic'||r==='secret';
  const boot=(left)=>{
    const x=left?87:173;
    return `<g>
      <path d="M${x+10} 347q26 9 44 0l4 33q16 1 20 15v6H${x-2}q-9-5-5-13l5-13Z" fill="${have?'url(#av-bootFill)':'url(#av-basicBoot)'}" ${outlines}/>
      <path d="M${x+9} 358q23 8 43 0" stroke="${have?c.trim:'#8798be'}" stroke-width="4" fill="none"/>
      <path d="M${x+8} 377h45" stroke="${have?c.glow:'#c8d9ff'}" stroke-width="5" stroke-linecap="round"/>
      <path d="M${x-7} 395h79" stroke="#98b5e9" stroke-width="6" stroke-linecap="round"/>
      ${have?`<path d="M${x+14} 365h30" stroke="${c.light}" stroke-width="4" stroke-linecap="round"/>${fancy?`<path d="M${x+24} 369l7-8 7 8-7 8Z" fill="${c.trim}"/>`:''}`:''}
    </g>`;
  };
  return `<g class="avatar-wear-boots">${boot(true)}${boot(false)}</g>`;
}
function arms(){
  return `<g class="avatar-base-arms">
    <path d="M111 207Q86 199 78 222L70 299Q70 308 82 313L96 313Q107 309 106 295L111 250Z" fill="url(#av-sleeve)" ${outlines}/>
    <path d="M209 207Q234 199 242 222L250 299Q250 308 238 313L224 313Q213 309 214 295L209 250Z" fill="url(#av-sleeve)" ${outlines}/>
    <path d="M77 254l30 3M213 257l29-3" stroke="#a6b5ef" stroke-width="4" opacity=".6"/>
  </g>`;
}
function hands(item){
  const c=tint(item),have=!!item;
  const base=(left)=>{
    const a=left?'M79 292Q62 301 70 318Q73 327 84 326L99 315Q105 306 97 296Z':'M241 292Q258 301 250 318Q247 327 236 326L221 315Q215 306 223 296Z';
    return `<path d="${a}" fill="${have?'url(#av-gloveFill)':'url(#av-skin)'}" ${outlines}/>`;
  };
  return `<g class="avatar-wear-hands">
    ${base(true)}${base(false)}
    ${have?`<path d="M75 298l20-1M225 297l20 1" stroke="${c.trim}" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M79 309l11-3M230 306l11 3" stroke="${c.glow}" stroke-width="3.5" stroke-linecap="round"/>`:''}
  </g>`;
}
function body(item){
  const c=tint(item),have=!!item,robe=have&&/robe|coat/.test(item.name.toLowerCase());
  return `<g class="avatar-wear-body">
    ${robe?`<path d="M119 268l-19 57q28 19 48 10l11-49 11 49q25 11 48-10l-19-57Z" fill="${c.dark}" ${outlineThin}/>
      <path d="M113 322q17 8 27 2M183 324q13 6 27-2" fill="none" stroke="${c.trim}" stroke-width="3"/>`:''}
    <path d="M119 195 Q161 184 201 195 Q221 203 223 226 L215 277 Q193 296 160 298 Q128 296 105 277L97 226Q99 207 119 195Z" fill="url(#av-torso)" ${outlines}/>
    <path d="M114 207 Q161 195 207 207" fill="none" stroke="${c.light}" stroke-width="5" opacity=".68" stroke-linecap="round"/>
    <path d="M105 239q54 21 110 0" stroke="${c.dark}" stroke-width="3" opacity=".33" fill="none"/>
    <path d="M113 276q48 17 95 0" fill="none" stroke="${c.trim}" stroke-width="5" stroke-linecap="round"/>
    <path d="M143 194L160 218 178 194" fill="${c.dark}" stroke="${c.trim}" stroke-width="3" stroke-linejoin="round"/>
    ${have?`<path d="M116 227l-8 42M204 227l8 42" stroke="${c.light}" stroke-width="4" opacity=".7"/>
      ${trimCrest(item,160,248)}`:`${emblem(160,247,'#fff9c3')}`}
    <path d="M118 282Q161 302 202 282" stroke="${c.dark}" stroke-width="5" fill="none" opacity=".46"/>
    <path d="M106 282H215" stroke="${c.dark}" stroke-width="6" stroke-linecap="round"/>
    <rect x="148" y="279" width="24" height="12" rx="5" fill="${have?c.trim:'#ffcb78'}" stroke="#25355c" stroke-width="2"/>
  </g>`;
}
function longerHair() {
  const tail = `<path d="M120 99C101 97 88 110 87 130C86 155 90 178 77 199Q71 213 94 230C94 220 103 214 107 201C115 179 110 153 117 131Z" fill="url(#av-hair)" ${outlines}/>
    <path d="M95 150Q101 182 86 204" fill="none" stroke="#546b95" stroke-width="3" stroke-linecap="round" opacity=".6"/>
    <path d="M88 142Q95 146 103 141" fill="none" stroke="#8fcbb8" stroke-width="4" stroke-linecap="round"/>`;
  return `<g class="avatar-long-hair">${tail}<g transform="translate(320 0) scale(-1 1)">${tail}</g></g>`;
}

function face(girl) {
  const hair = girl
    ? `<path d="M108 124C99 112 101 93 116 84C129 75 145 74 159 79C180 71 199 80 211 95Q224 112 212 137Q201 127 194 104Q178 118 150 111Q130 126 115 124L113 136Z" fill="url(#av-hair)" ${outlineThin}/>
      <path d="M113 109Q123 89 147 85M175 85Q191 86 204 101" fill="none" stroke="#657da5" stroke-width="3" stroke-linecap="round" opacity=".65"/>`
    : '<path d="M108 118Q99 83 136 78Q161 70 185 78Q222 84 214 123L207 118Q198 110 195 99Q158 115 123 100L114 122Z" fill="url(#av-hair)" stroke="#25355c" stroke-width="4" stroke-linejoin="round"/>';
  return `<g class="avatar-head-and-face">
    <path d="M138 178H182V208Q160 222 138 208Z" fill="url(#av-skin)" stroke="#25355c" stroke-width="4"/>
    <ellipse cx="108" cy="148" rx="12" ry="18" fill="#f5bf9d" stroke="#25355c" stroke-width="4"/>
    <ellipse cx="212" cy="148" rx="12" ry="18" fill="#f5bf9d" stroke="#25355c" stroke-width="4"/>
    <path d="M106 116Q107 87 140 82H183Q213 89 214 116L208 162Q202 186 182 193Q160 199 138 193Q118 185 112 163Z" fill="url(#av-skin)" ${outlines}/>
    <ellipse cx="126" cy="163" rx="11" ry="7" fill="#fa9d9e" opacity=".47"/>
    <ellipse cx="194" cy="163" rx="11" ry="7" fill="#fa9d9e" opacity=".47"/>
    <ellipse cx="139" cy="148" rx="5.6" ry="7.5" fill="#27375b"/>
    <ellipse cx="181" cy="148" rx="5.6" ry="7.5" fill="#27375b"/>
    <circle cx="140.7" cy="145.3" r="1.8" fill="#fff"/><circle cx="182.7" cy="145.3" r="1.8" fill="#fff"/>
    <path d="M147 173Q160 183 173 173" fill="none" stroke="#ad5c68" stroke-width="4" stroke-linecap="round"/>
    ${hair}
  </g>`;
}
function helmet(item){
  if(!item) return '';
  const c=tint(item),name=item.name.toLowerCase();
  const crown=/crown|circlet/.test(name); const cap=/cap|visor/.test(name);const horns=/horn|dragon/.test(name);
  if(crown){
    return `<g class="avatar-wear-head">
      <path d="M109 107l-10-32 29 12 31-32 30 32 32-12-10 32-1 14H111Z" fill="url(#av-helm)" ${outlines}/>
      <path d="M111 107h99v14H111Z" fill="${c.dark}" stroke="${c.trim}" stroke-width="3"/>
      ${trimCrest(item,160,95)}
    </g>`;
  }
  if(cap){
    return `<g class="avatar-wear-head">
      <path d="M102 116Q98 72 130 67Q162 55 194 69Q222 79 217 114Z" fill="url(#av-helm)" ${outlines}/>
      <path d="M100 113Q158 102 220 114L214 128Q158 120 106 129Z" fill="${c.dark}" stroke="${c.trim}" stroke-width="4"/>
      <path d="M118 82q19-10 37-7" fill="none" stroke="${c.light}" stroke-width="6" opacity=".72" stroke-linecap="round"/>
      ${trimCrest(item,160,93)}
    </g>`;
  }
  return `<g class="avatar-wear-head">
    <path d="M103 121Q93 74 126 62Q159 48 194 62Q226 74 216 121L208 128Q159 118 112 128Z" fill="url(#av-helm)" ${outlines}/>
    <path d="M104 115Q160 108 216 115L213 127Q160 121 107 128Z" fill="${c.dark}" stroke="${c.trim}" stroke-width="3"/>
    <rect x="99" y="116" width="16" height="31" rx="8" fill="${c.dark}" stroke="${c.trim}" stroke-width="3"/>
    <rect x="205" y="116" width="16" height="31" rx="8" fill="${c.dark}" stroke="${c.trim}" stroke-width="3"/>
    ${horns?`<path d="M116 79l-5-31 25 20M204 79l5-31-25 20" fill="${c.light}" stroke="${c.dark}" stroke-width="4" stroke-linejoin="round"/>`:''}
    <path d="M123 75q18-10 33-7" stroke="${c.light}" stroke-width="5" opacity=".7" fill="none" stroke-linecap="round"/>
    ${trimCrest(item,160,90)}
  </g>`;
}

/** Renders a single coherent avatar. Item ids are visual styles, never image overlays. */
export function renderEquippedAvatar(wallet, instance = 'closet', style = 'boy') {
  const i={aura:equipped(wallet,'aura'),back:equipped(wallet,'back'),legs:equipped(wallet,'legs'),body:equipped(wallet,'body'),hands:equipped(wallet,'hands'),head:equipped(wallet,'head')};
  const c=tint(i.body), b=tint(i.legs),h=tint(i.head),g=tint(i.hands);
  const girl = style === 'girl';
  // SVG identifiers contain only constant names and a sanitized instance prefix.
  const prefix=String(instance||'closet').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,28)||'closet';
  let art = `<svg class="pyquest-avatar-svg" viewBox="0 0 320 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${girl ? 'Girl' : 'Boy'} coder avatar">
    <defs>
      <linearGradient id="${prefix}-av-skin" x1="0" x2=".8" y1="0" y2="1"><stop stop-color="#ffe4b9"/><stop offset="1" stop-color="#efb28e"/></linearGradient>
      <linearGradient id="${prefix}-av-hair" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#25375b"/><stop offset="1" stop-color="#161b38"/></linearGradient>
      <linearGradient id="${prefix}-av-pants" x1="0" x2=".7" y1="0" y2="1"><stop stop-color="#3d5084"/><stop offset="1" stop-color="#202e56"/></linearGradient>
      <linearGradient id="${prefix}-av-sleeve" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${c.base}"/><stop offset="1" stop-color="${c.dark}"/></linearGradient>
      <linearGradient id="${prefix}-av-torso" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${c.light}"/><stop offset=".47" stop-color="${c.base}"/><stop offset="1" stop-color="${c.dark}"/></linearGradient>
      <linearGradient id="${prefix}-av-gloveFill" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${g.light}"/><stop offset="1" stop-color="${g.dark}"/></linearGradient>
      <linearGradient id="${prefix}-av-helm" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${h.light}"/><stop offset=".55" stop-color="${h.base}"/><stop offset="1" stop-color="${h.dark}"/></linearGradient>
      <linearGradient id="${prefix}-av-bootFill" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${b.light}"/><stop offset=".5" stop-color="${b.base}"/><stop offset="1" stop-color="${b.dark}"/></linearGradient>
      <linearGradient id="${prefix}-av-basicBoot" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#5067a0"/><stop offset="1" stop-color="#293d74"/></linearGradient>
      <filter id="${prefix}-av-softGlow" x="-45%" y="-45%" width="190%" height="190%"><feGaussianBlur stdDeviation="15"/></filter>
    </defs>
    <ellipse cx="160" cy="405" rx="98" ry="10" fill="#677bb6" opacity=".18"/>
    ${aura(i.aura)}
    ${backEquipment(i.back)}
    ${girl ? longerHair() : ''}
    ${baseLegs()}
    ${boots(i.legs)}
    ${arms()}
    ${body(i.body)}
    ${backHarness(i.back)}
    ${face(girl)}
    ${hands(i.hands)}
    ${helmet(i.head)}
  </svg>`;
  // Make all local references instance-specific so future previews can show several avatars.
  art=art.replace(/url\(#(av-[a-zA-Z]+)\)/g,(_,id)=>`url(#${prefix}-${id})`);
  return art;
}

export function equippedItemsDescription(wallet){
  const slots=['head','body','hands','legs','back','aura'];
  const worn=slots.map(slot=>equipped(wallet,slot)).filter(Boolean);
  if(!worn.length)return 'Default coder outfit';
  return `${worn.length} of 6 slots equipped · ${worn.map(item=>escapeAttr(item.name)).join(' · ')}`;
}

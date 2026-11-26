import {courseLabel, COURSES} from './curriculum.js';

const icons = {
  desk:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  book:'<path d="M12 7a5 5 0 0 0-5-3H3v15h4a5 5 0 0 1 5 2 5 5 0 0 1 5-2h4V4h-4a5 5 0 0 0-5 3Zm0 0v14"/>',
  test:'<path d="M9 5H6a2 2 0 0 0-2 2v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V7a2 2 0 0 0-2-2h-3"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="m8 14 2 2 5-5"/>',
  route:'<circle cx="5" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 6h9a3 3 0 0 1 0 6H8a3 3 0 0 0 0 6h9"/>',
  flask:'<path d="M9 3h6m-5 0v6L5 17a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-8V3M7.5 14h9"/>',
  gift:'<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12m0-12H8a2.5 2.5 0 1 1 2.5-2.5L12 8Zm0 0h4a2.5 2.5 0 1 0-2.5-2.5L12 8Z"/>',
  shield:'<path d="M12 22s7-3 7-9V5l-7-3-7 3v8c0 6 7 9 7 9Z"/><path d="m9 12 2 2 4-4"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5v.2a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1h.2a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.4 1Z"/>',
  coin:'<circle cx="12" cy="12" r="9"/><path d="M12 7v10m2.5-8h-3a1.5 1.5 0 1 0 0 3h1a1.5 1.5 0 1 1 0 3h-3"/>',
  sprout:'<path d="M12 22v-8m0 2C6 16 3 13 3 7c6 0 9 3 9 9Zm0-2c0-6 3-9 9-9 0 6-3 9-9 9Z"/>',
  zap:'<path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z"/>',
  sparkle:'<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3Zm7 0v4m-2-2h4"/>',
  compass:'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  hash:'<path d="M5 9h15M4 15h15M10 4 7 20M17 4l-3 16"/>',
  function:'<path d="M17 4c-3-2-5 0-5.6 3L8.6 19c-.5 2.5-2 3.5-4.6 2M7 10h11"/>',
  axis:'<path d="M4 4v16h16M8 16l4-5 3 2 5-7"/><circle cx="20" cy="6" r="1"/>',
  shapes:'<circle cx="16.5" cy="7.5" r="4"/><path d="m7 7 5 8H2l5-8Zm7 8h7v7h-7z"/>',
  ruler:'<path d="M3 16 16 3l5 5L8 21l-5-5Zm9-9 2 2m1-5 2 2m-8 4 2 2m-5 1 2 2"/>',
  triangle:'<path d="M3 19h18L3 5v14Zm0-4h4v4"/>',
  move:'<path d="M3 12h18M12 3v18M3 12l3-3m-3 3 3 3m15-3-3-3m3 3-3 3M12 3l-3 3m3-3 3 3m-3 15-3-3m3 3 3-3"/>',
  dice:'<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01" stroke-width="3.1"/>',
  chart:'<path d="M4 4v16h17M8 16v-4m5 4V7m5 9v-6"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  jelly:'<path d="M4 14v-2a8 8 0 0 1 16 0v2l-3 3-2-2-3 3-3-3-2 2-3-3Z"/><path d="M9 11h.01m6 0h.01" stroke-width="3"/>',
  close:'<path d="m6 6 12 12M18 6 6 18"/>',
  search:'<circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 5 5"/>',
  chevron:'<path d="m9 6 6 6-6 6"/>',
  down:'<path d="m6 9 6 6 6-6"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  flag:'<path d="M5 21V4m0 1c7-6 8 5 15-1v11c-7 6-8-5-15 1"/>',
  target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
  person:'<circle cx="12" cy="8" r="3"/><path d="M5 20v-2a7 7 0 0 1 14 0v2"/>',
  pair:'<circle cx="9" cy="8" r="3"/><path d="M2 20v-2a7 7 0 0 1 14 0v2M17 5a3 3 0 0 1 0 6m1 3c2 1 4 2 4 5v1"/>',
  bulb:'<path d="M9 18v-2a6 6 0 1 1 6 0v2H9Zm1 3h4"/>',
  clock:'<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>',
  box:'<path d="m3 7 9-4 9 4v10l-9 4-9-4V7Zm0 0 9 4 9-4m-9 4v10M7 5l9 4"/>'
};

export const icon = (name,size=20) => '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (icons[name] ?? icons.book) + '</svg>';
export const e = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[char]);
export const badge = (label,tone='neutral') => '<span class="badge ' + tone + '">' + e(label) + '</span>';
export const tile = (name,tone,size=21) => '<span class="icon-tile ' + tone + '">' + icon(name,size) + '</span>';
export const progress = (done,total,label='Progress') => '<progress class="progress" value="' + done + '" max="' + (total || 1) + '" aria-label="' + e(label) + '"></progress>';
export const coinLabel = value => '<span class="coin-label">' + icon('coin',17) + '<strong>' + Number(value).toLocaleString() + '</strong> GIS Points</span>';
export const empty = (symbol,title,text,actions) => '<div class="empty card">' + tile(symbol,'violet',25) + '<h2>' + title + '</h2><p>' + text + '</p><div class="actions">' + actions + '</div></div>';
export const button = (action,label,kind='primary',attributes='') => '<button type="button" class="btn ' + kind + '" data-action="' + action + '" ' + attributes + '>' + label + '</button>';
export const link = (to,label,kind='secondary') => '<a class="btn ' + kind + '" href="#' + to + '">' + label + '</a>';
export const pageHead = (kicker,title,text,actions='') => '<div class="page-head"><div>' + (kicker ? '<div class="eyebrow">' + kicker + '</div>' : '') + '<h1>' + title + '</h1><p>' + text + '</p></div>' + (actions ? '<div class="actions">' + actions + '</div>' : '') + '</div>';

const navigation = [
  ['home','desk','Learn topics'],
  ['library','book','Lesson library'],
  ['test','test','Level test'],
  ['path','route','My study path'],
  ['practice','flask','Practice lab'],
  ['gear','gift','Gear shop']
];
export const navName = route => navigation.find(([id]) => id === (route === 'lesson' ? 'library' : route))?.[2] ?? 'Local profile';

export function chrome(route,state,saved) {
  const course = COURSES[state.courseId];
  const navLink = ([id,glyph,name]) => {
    const active = (route === 'lesson' ? 'library' : route) === id;
    return '<a href="#' + id + '" class="nav-link' + (active ? ' active' : '') + '"' + (active ? ' aria-current="page"' : '') + '>' + icon(glyph) + '<span>' + name + '</span></a>';
  };
  const sidebar = `
    <a class="brand" href="#home" aria-label="MathQuest topics">
      <span class="brand-mark" aria-hidden="true">√<i></i></span>
      <span><strong>MathQuest<span>.</span></strong><small>IGCSE &amp; A Level</small></span>
    </a>
    <nav class="navigation">
      <div class="nav-label">Learn</div>${navigation.slice(0,5).map(navLink).join('')}
      <div class="nav-label rewards-nav">Rewards</div>${navLink(navigation[5])}
    </nav>
    <div class="sidebar-bottom">
      ${course ? '<div class="sidebar-course">' + icon('layers',18) + '<span><strong>' + e(course.label) + '</strong><small>' + e(courseLabel(course)) + '</small></span></div>' : ''}
      <a href="#profile" class="profile-link${route === 'profile' ? ' active' : ''}" ${route === 'profile' ? 'aria-current="page"' : ''}>
        ${tile('person','violet',17)}<span><strong>Local profile</strong><small>On this device</small></span>${icon('settings',17)}
      </a>
    </div>`;
  const topbar = `
    <div class="crumb"><button type="button" class="mobile-menu icon-button" data-action="menu" aria-label="Toggle navigation" aria-controls="sidebar" aria-expanded="false">${icon('menu')}</button>
      <span class="crumb-home">Workspace</span><span class="crumb-divider">${icon('chevron',13)}</span><strong>${navName(route)}</strong></div>
    <div class="top-actions"><a class="fresh-home-link" href="../../" aria-label="Fresh homepage" title="Fresh homepage"><img src="../../fresh.svg" width="22" height="22" alt=""><span>Fresh home</span></a><a class="help-link" href="#website-help" data-scroll="website-help">Help</a>
      <a href="#profile" class="save-status ${saved ? '' : 'unsaved'}" aria-label="${saved ? 'Saved locally' : 'Saving unavailable'}. Open local profile">${icon('shield',17)}<span>${saved ? 'Saved locally' : 'Saving unavailable'}</span></a>
      <a href="#gear" class="wallet-link" aria-label="${state.wallet.coins} GIS Points, open gear shop">${coinLabel(state.wallet.coins)}</a></div>`;
  return {sidebar,topbar};
}

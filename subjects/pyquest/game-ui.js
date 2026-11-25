import {CRATES,ITEMS,RARITIES,SLOTS,itemById,slotBuff,checkpointQuestions} from './game-items.js';
import {gameState} from './game-state.js';
import {renderEquippedAvatar,equippedItemsDescription} from './game-avatar.js';
import {teamState,GAME_QUESTIONS,teamScore} from './team-rooms.js';
import {localPreview,primaryLocalUid} from './local-preview.js';
import {crateOdds, gearQuantities, gearResalePrice} from './shared/gear-crates.js';
const e=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function ownedItem(wallet,slot){return itemById(wallet?.equipped?.[slot]);}
function rarityMeta(id){return RARITIES.find(x=>x.id===id)||RARITIES[0];}
function itemArt(item,size='large'){
  if(!item)return `<div class="item-art ${size} placeholder"><span>Empty</span></div>`;
  // Every collectible has a real, bundled artwork image instead of a CSS icon.
  const premium=item.legacy&&item.theme==='cosmic'&&size==='large';
  const path=`assets/cosmetics/${item.id}${premium?'-premium.jpg':'.png'}`;
  return `<div class="item-art illustrated ${size} rarity-${e(item.rarity)}"><img src="${e(path)}" alt="${e(item.name)} illustration" loading="lazy" decoding="async"></div>`;
}
export function avatarHTML(wallet, style = 'boy') {
  return `<div class="character-stage illustrated-character">
    <figure class="illustrated-character-scene">
      <div class="illustrated-character-stage integrated-avatar-stage">
        ${renderEquippedAvatar(wallet, 'closet', style)}
      </div>
      <figcaption class="character-caption">${equippedItemsDescription(wallet)}</figcaption>
    </figure>
  </div>`;
}
function characterStyles(style) {
  return `<fieldset class="character-style">
    <legend>Character style</legend>
    <div class="character-style-options">
      <label><input type="radio" name="character-style" value="boy" class="visually-hidden" ${style === 'boy' ? 'checked' : ''}><span>Boy</span></label>
      <label><input type="radio" name="character-style" value="girl" class="visually-hidden" ${style === 'girl' ? 'checked' : ''}><span>Girl</span></label>
    </div>
  </fieldset>`;
}
function collectionHTML(wallet, quantities) {
  const items = Object.entries(quantities);
  const total = items.reduce((sum, [, quantity]) => sum + quantity, 0);
  return `<section class="panel game-collection" aria-labelledby="collection-title">
    <h2 id="collection-title" tabindex="-1">My collection (${total.toLocaleString()})</h2>
    ${items.length ? `<div class="owned-grid collection-grid">
      ${items.map(([id, quantity]) => {
        const item = itemById(id);
        const slot = SLOTS.find(slot => slot.id === item.slot);
        const equipped = wallet.equipped?.[slot.id] === id;
        const sellLabel = equipped && quantity === 1 ? 'Sell & unequip' : 'Sell one';
        const price = gearResalePrice(item);
        return `<article class="owned-item collection-item" data-collection-item="${e(id)}">
          ${itemArt(item, 'small')}
          <h3>${e(item.name)}</h3>
          <p>${e(rarityMeta(item.rarity).name)} · ${e(slot.label)}</p>
          ${localPreview ? `<p class="collection-quantity">${quantity.toLocaleString()} ${quantity === 1 ? 'copy' : 'copies'}</p>` : ''}
          <div class="collection-actions">
            <button type="button" class="btn btn-quiet" data-equip="${e(id)}" ${equipped ? 'disabled' : ''}>${equipped ? 'Equipped' : 'Equip'}</button>
            ${localPreview ? `<button type="button" class="btn btn-light" id="sell-${e(id)}" data-sell-gear="${e(id)}"
              aria-label="${e(sellLabel)} ${e(item.name)} for ${price} PyCoins">${e(sellLabel)} · ${price} PyCoins</button>` : ''}
          </div>
        </article>`;
      }).join('')}
    </div>` : '<p class="muted">Your first gear is waiting. Earn PyCoins from lessons, tests and team games, then open a crate.</p>'}
  </section>`;
}

export function gameShopHTML(tab = 'closet', crateId = 'helmet', style = 'boy') {
  const s=gameState();const w=s.wallet||{coins:0,owned:[],equipped:{},claimed:[],bonusXp:0};
  if(s.error)return `<div class="panel"><h2>PyCoins unavailable</h2><p class="feedback bad">${e(s.error)}</p></div>`;
  const quantities = gearQuantities(w);
  const crate = CRATES.find(c => c.id === crateId) || CRATES[0];
  return `<div class="page-head"><div><h1>Game Zone</h1><p>Open crates with earned PyCoins, equip your character, or play a two-person quiz.</p></div><span class="coin-pill">${Number(w.coins||0).toLocaleString()} PyCoins</span></div>
    ${localPreview?'':'<div class="coin-sync-actions"><button type="button" class="btn btn-primary" data-sync-coins="1">Sync earned PyCoins</button><span class="muted">Each completed activity earns PyCoins once.</span></div>'}
    ${s.rewardError?`<div class="feedback bad coin-reward-warning">PyCoins aren't syncing yet: ${e(s.rewardError)} <strong>Your lesson progress is still saved.</strong></div>`:''}
    <div class="game-tabs" role="group" aria-label="Game Zone sections"><button type="button" data-game-tab="closet" aria-pressed="${tab==='closet'}" class="${tab==='closet'?'selected':''}">My character</button><button type="button" data-game-tab="crates" aria-pressed="${tab==='crates'}" class="${tab==='crates'?'selected':''}">Cosmetic crates</button><button type="button" data-game-tab="teams" aria-pressed="${tab==='teams'}" class="${tab==='teams'?'selected':''}">Team games</button></div>
    ${tab==='teams'?'':tab==='crates'?shopCrates(crate, quantities, w):`<div class="game-dashboard"><section class="game-hero-card modern">
      <div class="game-hero-copy">
        <h2>Your character</h2>
        <p>Equip items from your collection to change your look and earn bonuses on future activities.</p>
        ${characterStyles(style)}
        <div class="game-wallet"><strong>${Number(w.coins||0)} <small>PyCoins</small></strong><strong>+${Number(w.bonusXp||0)} <small>Gear XP</small></strong></div>
        <button type="button" class="btn btn-primary" data-game-tab="crates">Browse crates</button>
      </div>
      ${avatarHTML(w, style)}
    </section>
    <section class="panel game-equipment"><h2>Equipped gear</h2><div class="slot-grid">${SLOTS.map(slot=>{const item=ownedItem(w,slot.id);return `<div class="gear-slot"><div class="slot-emoji art-holder">${itemArt(item,'mini')}</div><div><strong>${e(slot.label)}</strong><small>${e(item?.name||'Empty slot')}</small><small>${item?`+${item.bonus}${slot.suffix} ${e(slot.bonus)}`:e(slot.bonus)}</small></div>${item?`<button type="button" class="gear-remove" data-unequip="${slot.id}" title="Unequip">×</button>`:''}</div>`;}).join('')}</div><p class="fineprint muted">Bonus XP is tracked separately from the school leaderboard for fair rankings. Bonuses apply to future rewards only.</p></section>
    ${collectionHTML(w, quantities)}</div>`}
  `;
}
function oddsHTML({pool, totalWeight}) {
  return `<div class="crate-odds">${RARITIES.map(r=>{
    const entry = pool.find(({item}) => item.rarity === r.id);
    const chance = entry ? (entry.weight / totalWeight * 100).toFixed(2) + '%' : 'Already owned';
    return `<div class="odds-line rarity-${e(r.id)}"><strong>${e(r.name)}</strong><span>${chance}</span></div>`;
  }).join('')}</div>`;
}
function shopCrates(crate, quantities, w) {
  const odds = crateOdds(crate.id, localPreview ? [] : Object.keys(quantities));
  const canAfford=Number(w.coins||0)>=crate.cost;
  const allOwned=odds.pool.length===0;
  return `<section class="crate-intro"><h2>Random cosmetic crates</h2><p>Choose a category and open a crate for one of six items.${localPreview ? ' You can collect multiple copies and sell them for PyCoins from My character.' : ' PyCoins are earned through learning.'}</p></section>
  <div class="crate-nav">${CRATES.map(c=>`<button class="crate-chip ${c.id===crate.id?'selected':''}" data-crate="${e(c.id)}"><img class="crate-chip-picture" src="assets/cosmetics/crate-${e(c.theme)}.png" alt="" loading="lazy">${e(c.name)}</button>`).join('')}</div>
  <section class="crate-banner crate-${crate.theme}"><img class="crate-giant-picture" src="assets/cosmetics/crate-${e(crate.theme)}.png" alt="${e(crate.name)} illustration"><div><h2>${e(crate.name)}</h2><p>${e(crate.desc)}</p>
  <div class="crate-cost-line"><span>${crate.cost} PyCoins per opening</span><button type="button" class="btn btn-primary" data-open-crate="${e(crate.id)}" ${allOwned||!canAfford?'disabled':''}>${allOwned?'All items collected':canAfford?'Open random crate':`Need ${crate.cost-Number(w.coins||0)} more PyCoins`}</button></div>
  </div></section>
  <section class="panel crate-prob-panel"><div><h3>Rarity chances</h3><p class="muted">${localPreview
    ? 'Every opening uses these odds, including when you already own gear from this crate.'
    : 'After collecting an item, its rarity is removed and the remaining chances are adjusted proportionally.'}</p>${oddsHTML(odds)}</div>
  <div><h3>${localPreview ? 'Possible drops' : `Possible drops (${odds.pool.length} remaining)`}</h3><div class="shop-item-grid">${ITEMS.filter(x=>x.crate===crate.id).map(item=>{
    const rarity = rarityMeta(item.rarity);
    const slot = SLOTS.find(s => s.id === item.slot);
    const quantity = quantities[item.id] ?? 0;
    const ownership = quantity ? (localPreview ? `${quantity.toLocaleString()} owned` : 'Owned') : 'Random drop';
    return `<article class="shop-item" style="--rarity:${rarity.tone}"><span class="rarity-tag">${e(rarity.name)}</span>${itemArt(item,'large')}<h3>${e(item.name)}</h3><p>${e(slot.label)} · +${item.bonus}${slot.suffix} ${e(slot.bonus)}</p><div class="drop-foot"><span class="tag">${ownership}</span></div></article>`;
  }).join('')}</div></div></section>`;
}
export function checkpointHTML(group,lessons,answers,feedback=''){
  const q=checkpointQuestions(group,lessons);const state=gameState();const passed=(state.passedCheckpoints||[]).includes(group)||(state.wallet?.claimed||[]).includes('checkpoint:'+group);
  const groupStart=group*4+1;const end=Math.min(groupStart+3,lessons.length);const nextStart=end+1;const nextEnd=Math.min(nextStart+3,lessons.length);const finalGroup=end>=64;
  return `<div class="page-head"><div><div class="eyebrow">CHECKPOINT ${group+1} · AFTER LESSON ${end}</div><h1>Knowledge checkpoint</h1><p>Eight questions about lessons ${groupStart}–${end}. Score at least 6/8 to ${finalGroup?'complete the Python pathway':`unlock lessons ${nextStart}–${nextEnd}`}.</p></div><button type="button" class="btn btn-light" data-nav="learn">Learning path</button></div>
    ${passed?`<div class="feedback">Checkpoint ${group+1} completed. ${finalGroup?'You completed the Python pathway.':`Lessons ${nextStart}–${nextEnd} are unlocked.`}</div>`:''}
    <section class="panel checkpoint-panel"><div class="checkpoint-progress"><strong>${answers.filter(x=>x!==null).length}/${q.length} answered</strong><span>Pass mark: 6/8</span></div>${q.map((x,i)=>`<div class="checkpoint-question"><span class="tag">Question ${i+1}/${q.length}</span><h3>${e(x.q)}</h3><div class="checkpoint-options">${x.a.map((v,j)=>`<button type="button" data-cp-choice="${i}-${j}" class="${answers[i]===j?'chosen':''}" ${passed?'disabled':''}>${String.fromCharCode(65+j)}. ${e(v)}</button>`).join('')}</div></div>`).join('')}
    ${feedback?`<div class="feedback ${/^(Passed|Checkpoint)/.test(feedback)?'':'bad'}">${e(feedback)}</div>`:''}
    ${passed?`<button type="button" class="btn btn-primary" data-nav="learn">${finalGroup?'Back to learning path':'Continue to next lessons'}</button>`:`<button type="button" class="btn btn-primary" data-action="checkpoint-submit" ${answers.some(x=>x===null)?'disabled':''}>Grade my checkpoint</button>`}
    <p class="muted fineprint">You can retry after reviewing the lessons. The checkpoint unlock is saved to your ${localPreview?'local profile':'account'}.</p></section>`;
}

export function teamGamesHTML(user, selectedId) {
  const st = teamState();
  const rows = st.rooms;
  const room = rows.find(x => x.id === selectedId);
  const player = user.uid === primaryLocalUid ? 2 : 1;
  return `<div class="game-team">
    <section class="panel">
      <div class="section-head"><div><h2>Team challenge rooms</h2><p>${localPreview
        ? 'Create a room, then open the second player in another tab and enter the six-letter code.'
        : 'Create a room, then let another student join using the six-letter code.'}</p></div></div>
      <form id="team-create" class="help-form">
        <label for="team-mode">Challenge</label>
        <select id="team-mode" data-preserve><option value="python">Python Sprint</option><option value="igcse">IGCSE 0478 Blitz</option></select>
        <button class="btn btn-primary">Create room</button>
      </form>
      <form id="team-join" class="help-form team-join-form">
        <label for="team-code">Join code</label>
        <input id="team-code" data-preserve maxlength="6" placeholder="ABCDEF" autocomplete="off" autocapitalize="characters" spellcheck="false" required>
        <button class="btn btn-light">Join room</button>
      </form>
      ${localPreview ? `<a class="team-new-tab" href="?player=${player}#game/teams" target="_blank" rel="noopener">Open another player <span aria-hidden="true">↗</span></a>` : ''}
    </section>
    <section class="panel"><h2>Your game rooms</h2>${st.error?`<p class="feedback bad">${e(st.error)}</p>`:''}${rows.length?rows.map(r=>`<button type="button" class="team-room-line ${selectedId===r.id?'selected':''}" data-team-room="${e(r.id)}"><span class="room-code-badge">${e(r.joinCode||r.id)}</span><strong>${e(r.mode==='python'?'Python Sprint':'IGCSE Blitz')}</strong><small>${e(r.status==='waiting'?'Waiting':r.status==='done'?'Complete':'Playing')}</small></button>`).join(''):'<p class="muted">No games yet. Create a room and share the code.</p>'}</section>
    ${room?teamRoomHTML(room,user):''}</div>`;}
function teamRoomHTML(room,user){const questions=GAME_QUESTIONS[room.mode]||[];const mine=room.answers?.[user.uid]||[];const otherId=(room.members||[]).find(id=>id!==user.uid);const them=otherId?(room.answers?.[otherId]||[]):[];const canPlay=room.status==='playing'&&mine.length<questions.length;const q=questions[mine.length];const myScore=teamScore(room).find(x=>x.uid===user.uid)?.correct||0;const theirScore=teamScore(room).find(x=>x.uid===otherId)?.correct||0;
  const claimed=(gameState().wallet?.claimed||[]).includes('team:'+room.id);
  return `<section class="panel team-stage"><div class="section-head"><div><h2>${room.mode==='python'?'Python Sprint':'IGCSE Blitz'}</h2><p>Both players answer eight questions. Team score = combined correct answers.</p></div><span class="coin-pill">Room code ${e(room.joinCode||room.id)}</span></div>
   ${room.status==='waiting'?`<div class="team-wait"><h3>Waiting for another player</h3><p>Share this join code: <strong class="join-code-big">${e(room.joinCode||room.id)}</strong></p></div>`:''}
   ${room.status==='done'?`<div class="team-complete"><h3>Team game complete</h3><p>Combined score: <strong>${myScore+theirScore}/${questions.length*2}</strong></p><button class="btn btn-primary" data-team-claim="${e(room.id)}" ${claimed?'disabled':''}>${claimed?'PyCoins claimed':'Claim team-game PyCoins'}</button></div>`:''}
   ${room.status==='playing'?(canPlay?`<p class="team-progress">Your question ${mine.length+1}/${questions.length} · Partner answered ${them.length}/${questions.length}</p><h3>${e(q.q)}</h3><div class="team-options">${q.a.map((v,i)=>`<button type="button" data-team-answer="${e(room.id)}:${mine.length}:${i}">${String.fromCharCode(65+i)} · ${e(v)}</button>`).join('')}</div>`:`<div class="team-wait"><h3>Your questions are done</h3><p>Waiting for your partner (${them.length}/${questions.length}).</p></div>`):''}
   ${mine.length>0?`<p class="muted fineprint">Last answer: ${mine[mine.length-1]===questions[mine.length-1]?.right?'Correct':'Hint: '+e(questions[mine.length-1]?.why||'Keep practicing.')}</p>`:''}</section>`;
}

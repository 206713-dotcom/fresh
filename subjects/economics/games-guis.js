/* Clarity Economics Arcade: distinct visual stages; gameplay remains in games.js. */
(function () {
  'use strict';
  const root = document.getElementById('game-root');
  if (!root) return;
  const catalog = [
    ['island', '🌴', 'Scarcity Island'],
    ['market', '📈', 'Market Mayhem'],
    ['policy', '🏛', 'Policy Panic'],
    ['trade', '🚢', 'Trade Tycoon'],
    ['escape', '🗝', 'Escape Room']
  ];
  const templates = {
    island: '<div class="scene-copy"><span class="scene-eyebrow">ISLAND MANAGEMENT / SCARCITY & CHOICE</span><h2>Your island. Your decisions.</h2><p>Every worker assigned to crops is one worker unavailable to make tools. Watch the production trade-off below.</p><div class="scene-mini-stats"><span>🌽 Crops <strong id="scene-crops">—</strong></span><span>🔨 Tools <strong id="scene-tools">—</strong></span></div></div><div class="island-sea" role="img" aria-label="Illustrated island with farmland, a workshop, trees and a coastal settlement"><div class="island-land"><span>🌴</span><span>🌾</span><span>🏡</span><span>🌽</span><span>🪵</span><span>🔨</span><span>🐟</span><span>🌱</span><span>🌴</span></div><div class="island-watermark">SCARCITY ISLAND</div></div>',
    market: '<div class="scene-copy"><span class="scene-eyebrow"><i class="live-dot"></i> MARKET INTELLIGENCE / LIVE</span><h2>Read the shock. Move the market.</h2><p>Shift supply and demand independently. The live trading floor graph below shows your predicted equilibrium.</p><div class="scene-mini-stats"><span>NEWSWIRE <strong>PEAR MARKET</strong></span><span>EQUILIBRIUM <strong id="scene-market-equilibrium">Awaiting signal</strong></span></div></div><div class="market-visual" role="img" aria-label="Financial terminal illustration with demand and supply curves"><div class="terminal-top"><span class="live-dot"></span> EQUILIBRIUM TERMINAL <span>LIVE</span></div><svg viewBox="0 0 420 190" aria-hidden="true"><g stroke="#41617a" stroke-width="1" opacity=".45"><path d="M30 30V160H400"/><path d="M30 60H400M30 90H400M30 120H400"/></g><path d="M48 42L355 151" stroke="#69d0f3" stroke-width="4" fill="none"/><path d="M48 149L355 43" stroke="#f7c784" stroke-width="4" fill="none"/><circle cx="201" cy="96" r="8" fill="#a8ffdc" stroke="#0b2d43" stroke-width="4"/><text x="300" y="40" fill="#f9d59a" font-size="13">S</text><text x="355" y="151" fill="#8bdffd" font-size="13">D</text></svg><div class="terminal-caption">DEMAND / SUPPLY / PRICE DISCOVERY</div></div>',
    policy: '<div class="scene-copy"><span class="scene-eyebrow">OFFICE OF THE ECONOMIC ADVISER</span><h2>The cabinet needs a decision.</h2><p>Study the fictional economy, weigh policy trade-offs and choose a justified intervention.</p><div class="policy-dials"><div><span>Inflation</span><strong id="scene-inflation">—</strong><i></i></div><div><span>Unemployment</span><strong id="scene-unemployment">—</strong><i></i></div><div><span>Growth</span><strong id="scene-growth">—</strong><i></i></div></div></div><div class="policy-visual" role="img" aria-label="Government cabinet desk with an economic briefing folder"><div class="briefing-paper"><span>ECONOMIC BRIEFING</span><div class="briefing-stamp">CONFIDENTIAL</div><div class="briefing-lines"></div><div class="briefing-seal">⚖</div></div><div class="desk-pen">✎</div></div>',
    trade: '<div class="scene-copy"><span class="scene-eyebrow">GLOBAL SHIPPING / FOREIGN EXCHANGE</span><h2>Every trade route has a cost.</h2><p>Balance export revenue, import expenditure and domestic needs as the exchange rate changes.</p><div class="scene-mini-stats"><span>🚢 DESTINATION <strong id="scene-trade-port">Fictional port</strong></span><span>📦 CARGO <strong id="scene-trade-cargo">Goods</strong></span></div></div><div class="trade-map" role="img" aria-label="Illustrated shipping route crossing an ocean between two ports"><svg viewBox="0 0 440 200" aria-hidden="true"><defs><pattern id="sea-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#82d7d3" stroke-opacity=".15"/></pattern></defs><rect width="440" height="200" fill="url(#sea-grid)"/><path d="M0 0L114 0L136 37L112 83L140 128L85 200L0 200Z" fill="#91caa6"/><path d="M440 0L339 0L317 45L339 88L308 136L358 200L440 200Z" fill="#9dc7a8"/><path d="M100 107Q225 10 348 104" fill="none" stroke="#ffe7aa" stroke-dasharray="7 7" stroke-width="3"/><circle cx="100" cy="107" r="7" fill="#fff0bb"/><circle cx="348" cy="104" r="7" fill="#fff0bb"/><text x="170" y="80" font-size="27">🚢</text><text x="28" y="148" fill="#174c4f" font-size="13">HOME</text><text x="358" y="144" fill="#174c4f" font-size="13">PORT</text></svg><div class="map-strip">HOME PORT <span>— INTERNATIONAL TRADE ROUTE —</span> FOREIGN PORT</div></div>',
    escape: '<div class="scene-copy"><span class="scene-eyebrow">THE ECONOMICS ARCHIVES / PUZZLE QUEST</span><h2>Find the clue. Open the door.</h2><p>Each locked room hides an economics problem. Inspect the evidence, solve the puzzle, and escape.</p><div class="scene-mini-stats"><span>🔒 LOCK <strong id="scene-lock-state">SEALED</strong></span><span>ROOM <strong id="scene-room">01</strong></span></div><div class="escape-hotspots"><button type="button" data-scene-action="evidence">📜 Inspect evidence</button><button type="button" data-scene-action="hint">💡 Reveal hint</button><button type="button" data-scene-action="lock">🔑 Go to lock</button></div></div><div class="escape-room-art" role="img" aria-label="Illustrated mystery escape room with shelves, a glowing lantern and a locked doorway"><div class="room-lantern">✦</div><div class="room-books">▥<span>📚</span>▥</div><div class="room-door"><span>✥</span><strong>LOCKED</strong></div><div class="room-floor"></div></div>'
  };
  function slug() {
    const match = location.hash.match(/^#games\/(island|market|policy|trade|escape)/);
    return match ? match[1] : 'hub';
  }
  function switcher(game) {
    let nav = root.querySelector('.game-switcher');
    if (!nav) {
      nav = document.createElement('nav');
      nav.className = 'game-switcher';
      nav.setAttribute('aria-label', 'Choose a revision game');
      nav.innerHTML = catalog.map(item =>
        '<a href="#games/' + item[0] + '" data-switch-game="' + item[0] + '"><span aria-hidden="true">' + item[1] +
        '</span><strong>' + item[2] + '</strong></a>'
      ).join('');
      root.prepend(nav);
    }
    nav.querySelectorAll('a').forEach(a => {
      if (a.dataset.switchGame === game) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }
  function enhanceCards() {
    root.querySelectorAll('article.card').forEach(card => {
      const link = card.querySelector('a[href^="#games/"]');
      if (!link) return;
      const game = link.getAttribute('href').split('/').pop();
      card.dataset.gameCard = game;
      if (!card.querySelector('.card-kicker')) {
        const kicker = document.createElement('span');
        kicker.className = 'card-kicker';
        kicker.textContent = {island:'RESOURCE SIMULATOR',market:'MARKET ANALYSIS',policy:'CABINET SIMULATION',trade:'GLOBAL COMMERCE',escape:'PUZZLE ADVENTURE'}[game] || 'REVISION GAME';
        card.insertBefore(kicker, card.querySelector('h2'));
      }
    });
  }
  function updateLive(game) {
    const form = root.querySelector('#game-turn');
    if (!form) return;
    if (game === 'island') {
      const values = [...form.querySelectorAll('.stats strong')].map(node => Number(node.textContent));
      const workers = Number(form.querySelector('input[name="workers"]')?.value);
      if (values.length >= 3 && Number.isFinite(workers)) {
        const crops = document.getElementById('scene-crops');
        const tools = document.getElementById('scene-tools');
        if (crops) crops.textContent = String(workers * values[1]);
        if (tools) tools.textContent = String((values[0] - workers) * values[2]);
      }
    }
    if (game === 'market') {
      const caption = form.querySelector('figcaption')?.textContent || '';
      const metric = document.getElementById('scene-market-equilibrium');
      const found = caption.match(/Your model:\s*([^.]+)/);
      if (metric && found) metric.textContent = found[1];
    }
    if (game === 'policy') {
      const values = [...form.querySelectorAll('.stats strong')];
      ['inflation', 'unemployment', 'growth'].forEach((name, index) => {
        const metric = document.getElementById('scene-' + name);
        if (metric && values[index]) metric.textContent = values[index].textContent + '%';
      });
    }
    if (game === 'trade') {
      const clue = form.querySelector('.clue')?.textContent || '';
      const match = clue.match(/partner\s+([A-Za-z]+)/i);
      const good = clue.match(/orders?\s+([a-z]+)/i);
      const port = document.getElementById('scene-trade-port');
      const cargo = document.getElementById('scene-trade-cargo');
      if (port && match) port.textContent = match[1];
      if (cargo && good) cargo.textContent = good[1];
    }
    if (game === 'escape') {
      const progress = root.querySelector('.stats span')?.textContent || '';
      const room = document.getElementById('scene-room');
      const lock = document.getElementById('scene-lock-state');
      const m = progress.match(/Round\s+(\d+)/);
      if (room && m) room.textContent = String(m[1]).padStart(2, '0');
      if (lock) lock.textContent = root.querySelector('.feedback strong')?.textContent?.startsWith('2 of') ? 'OPEN' : 'SEALED';
    }
  }
  function enhance() {
    const game = slug();
    document.body.dataset.game = game;
    root.dataset.game = game;
    if (game === 'hub') { document.body.dataset.phase = 'hub'; enhanceCards(); return; }
    switcher(game);
    const hero = root.querySelector('.hero');
    if (!hero) return;
    let stage = root.querySelector('.game-scene');
    if (!stage) {
      stage = document.createElement('section');
      stage.className = 'game-scene scene-' + game;
      stage.setAttribute('aria-label', catalog.find(item => item[0] === game)[2] + ' dashboard');
      stage.innerHTML = templates[game];
      hero.insertAdjacentElement('afterend', stage);
    }
    document.body.dataset.phase = root.querySelector('#game-turn') ? 'playing' :
      root.querySelector('#game-start') ? 'intro' : 'finished';
    updateLive(game);
  }
  let queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; enhance(); });
  }
  const observer = new MutationObserver(schedule);
  observer.observe(root, {childList:true});
  window.addEventListener('hashchange', schedule);
  root.addEventListener('input', () => requestAnimationFrame(() => updateLive(slug())));
  root.addEventListener('click', event => {
    const button = event.target.closest('[data-scene-action]');
    if (!button) return;
    const action = button.dataset.sceneAction;
    const form = root.querySelector('#game-turn');
    if (!form) { root.querySelector('#game-start button.primary')?.focus(); return; }
    if (action === 'evidence' || action === 'hint') {
      const details = action === 'evidence' ? form.querySelector('details.clue') : [...form.querySelectorAll('details')].find(d => d.textContent.includes('Hint'));
      if (details) { details.open = true; details.scrollIntoView({behavior:'smooth',block:'center'}); details.querySelector('summary')?.focus({preventScroll:true}); }
    } else {
      const input = form.querySelector('input[name="answer"],select[name="answer"],select[name="step0"]');
      input?.scrollIntoView({behavior:'smooth',block:'center'});
      input?.focus({preventScroll:true});
    }
  });
  schedule();
})();
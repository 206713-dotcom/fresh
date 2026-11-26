/* EcBiz static bootstrap — exact original header + overview markup, vanilla JS. */
(function () {
  "use strict";
  var EC = window.EC;

  /* lucide-style icons, identical paths to the original bundle */
  var P = {
    bookOpen: '<path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>',
    timer: '<line x1="10" x2="14" y1="2" y2="2"></line><line x1="12" x2="15" y1="14" y2="11"></line><circle cx="12" cy="14" r="8"></circle>',
    squareCheckBig: '<path d="M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344"></path><path d="m9 11 3 3L22 4"></path>',
    chevronDown: '<path d="m6 9 6 6 6-6"></path>',
    cpu: '<path d="M12 20v2"></path><path d="M12 2v2"></path><path d="M17 20v2"></path><path d="M17 2v2"></path><path d="M2 12h2"></path><path d="M2 17h2"></path><path d="M2 7h2"></path><path d="M20 12h2"></path><path d="M20 17h2"></path><path d="M20 7h2"></path><path d="M7 20v2"></path><path d="M7 2v2"></path><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="8" y="8" width="8" height="8" rx="1"></rect>',
    headphones: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path>',
    palette: '<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"></path><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>',
    trophy: '<path d="M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978"></path><path d="M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978"></path><path d="M18 9h1.5a1 1 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"></path><path d="M6 9H4.5a1 1 0 0 1 0-5H6"></path>',
    paintbrush: '<path d="m14.622 17.897-10.68-2.913"></path><path d="M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z"></path><path d="M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15"></path>',
    menu: '<path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path>',
    x: '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>',
    hardDrive: '<line x1="22" x2="2" y1="12" y2="12"></line><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path><line x1="6" x2="6.01" y1="16" y2="16"></line><line x1="10" x2="10.01" y1="16" y2="16"></line>',
    arrowLeft: '<path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path>',
    layoutGrid: '<rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect>',
    chartColumn: '<path d="M3 3v16a2 2 0 0 0 2 2h16"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path>',
    fileText: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path>',
    graduationCap: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>',
    clipboardList: '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path>',
    clipboardCheck: '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="m9 14 2 2 4-4"></path>',
    target: '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>',
    swords: '<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"></polyline><line x1="13" x2="19" y1="19" y2="13"></line><line x1="16" x2="20" y1="16" y2="20"></line><line x1="19" x2="21" y1="21" y2="19"></line><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"></polyline><line x1="5" x2="9" y1="14" y2="18"></line><line x1="7" x2="4" y1="17" y2="20"></line><line x1="3" x2="5" y1="19" y2="21"></line>',
    arrowRight: '<path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>',
    zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>',
    scale: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path><path d="M7 21h10"></path><path d="M12 3v18"></path><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"></path>',
    externalLink: '<path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>'
  };
  function icon(name, size, cls) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-' + name + (cls ? ' ' + cls : '') + '" aria-hidden="true">' + P[name] + '</svg>';
  }
  function navBtn(view, ico, label, title) {
    return '<button type="button" data-nav="' + view + '"' + (title ? ' aria-label="' + EC.esc(title) + '" title="' + EC.esc(title) + '"' : '') + '>' + icon(ico, 16) + EC.esc(label) + (view === 'review' ? '<small class="ml-1 font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300" data-ec-review-count></small>' : '') + '</button>';
  }

  function shell() {
    var utilBtn = 'p-1.5 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-[#57534E] dark:text-neutral-300 transition-colors cursor-pointer';
    var menuItem = 'w-full text-left px-3 py-2 rounded-xl flex items-start gap-2.5 transition cursor-pointer text-[#1C1917] dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800';
    var compareSections = [
      ['1', 'Business activity, ownership, objectives'],
      ['2', 'Motivation, structure, people, communication'],
      ['3', 'Marketing mix, research, strategy'],
      ['4', 'Production, costs, quality, location'],
      ['5', 'Finance, cash flow, accounts, ratios'],
      ['6', 'Economy, ethics, global trade']
    ].map(function (s) {
      return '<button type="button" class="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold text-[#1C1917] dark:text-neutral-200 hover:bg-white dark:hover:bg-neutral-700 cursor-pointer" data-nav="compare" data-section="' + s[0] + '">Section ' + s[0] + '<span class="block text-[10px] font-normal opacity-70">' + s[1] + '</span></button>';
    }).join('');
    var header =
      '<header class="site-header sticky top-0 z-40 border-b backdrop-blur-md"><div class="site-header-inner">' +
        '<div class="shrink-0"><button aria-label="EcBiz overview" class="site-brand" data-nav="overview">' +
          '<span class="site-brand-icon" aria-hidden="true">' + icon('bookOpen', 18) + '</span>' +
          '<span class="font-academic-serif font-bold tracking-tight whitespace-nowrap">EcBiz</span></button></div>' +
        '<nav aria-label="More Business tools" class="hidden lg:flex items-center gap-1.5 text-sm font-medium">' +
          '<button type="button" class="business-mock-link" data-nav="mocks">' + icon('timer', 15) + ' Mock exam</button>' +
          '<div class="relative">' +
            '<button type="button" id="syllabusMenuBtn" aria-haspopup="true" aria-expanded="false" data-dropdown="checklist" class="px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer text-[#57534E] dark:text-neutral-300 hover:text-[#0F2042] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5">' + icon('squareCheckBig', 24, 'w-3.5 h-3.5') + '<span>Syllabus</span>' + icon('chevronDown', 24, 'w-3.5 h-3.5 transition-transform duration-200') + '</button>' +
            '<div id="syllabusMenu" class="hidden absolute top-full left-0 mt-1 w-72 p-2 rounded-2xl bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-700 shadow-xl backdrop-blur-xl z-50">' +
              '<button type="button" class="' + menuItem + '" data-nav="checklist">' + icon('squareCheckBig', 16, 'w-4 h-4 mt-0.5 shrink-0 opacity-70') + '<div><div class="text-xs font-bold">0264 Syllabus Checklist</div><div class="text-[10px] opacity-75">Rate and track every syllabus point</div></div></button>' +
              '<button type="button" class="' + menuItem + ' mt-1" data-nav="sections">' + icon('bookOpen', 16, 'w-4 h-4 mt-0.5 shrink-0 opacity-70') + '<div><div class="text-xs font-bold">Sections &amp; Chapters (1–6)</div><div class="text-[10px] opacity-75">Syllabus overview for every section</div></div></button>' +
              '<div class="mt-1 border-t border-neutral-100 dark:border-neutral-800 pt-1">' +
                '<button type="button" id="compareToggle" aria-expanded="false" class="' + menuItem + ' items-center">' + icon('scale', 16, 'w-4 h-4 shrink-0 opacity-70') + '<div class="flex-1"><div class="text-xs font-bold">Advantages &amp; Disadvantages</div><div class="text-[10px] opacity-75" id="compareHint">Choose a section</div></div>' + icon('chevronDown', 24, 'w-3.5 h-3.5 shrink-0 transition-transform duration-200') + '</button>' +
                '<div id="compareSections" class="hidden mt-1 mb-1 rounded-xl border border-[#E7E5E4] dark:border-neutral-700 bg-[#FAF9F6] dark:bg-neutral-800/60 p-1.5">' +
                  '<div class="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#78716C] dark:text-neutral-400">Chapter breakdown</div>' + compareSections +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="relative">' +
            '<button type="button" id="resourcesMenuBtn" aria-haspopup="true" aria-expanded="false" data-dropdown="resources" class="px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer text-[#57534E] dark:text-neutral-300 hover:text-[#0F2042] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"><span>Resources</span>' + icon('chevronDown', 24, 'w-3.5 h-3.5 transition-transform duration-200') + '</button>' +
            '<div id="resourcesMenu" class="hidden absolute top-full right-0 mt-1 w-60 p-2 rounded-2xl bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-700 shadow-xl backdrop-blur-xl z-50">' +
              '<button type="button" class="' + menuItem + '" data-nav="glossary">' + icon('bookOpen', 16, 'w-4 h-4 mt-0.5 shrink-0 opacity-70') + '<div><div class="text-xs font-semibold">0264 Glossary</div><div class="text-[10px] opacity-70">Cambridge syllabus definitions</div></div></button>' +
              '<button type="button" class="' + menuItem + ' mt-1" data-nav="archive">' + icon('fileText', 16, 'w-4 h-4 mt-0.5 shrink-0 opacity-70') + '<div><div class="text-xs font-semibold">Past Papers &amp; Archive</div><div class="text-[10px] opacity-70">Official Cambridge past exams</div></div></button>' +
              '<button type="button" class="' + menuItem + ' mt-1" data-nav="progress">' + icon('chartColumn', 16, 'w-4 h-4 mt-0.5 shrink-0 opacity-70') + '<div><div class="text-xs font-semibold">My progress</div><div class="text-[10px] opacity-70">Your evaluated answers</div></div></button>' +
              '<a href="https://forms.gle/6X2CAR1LkSQGRBx68" target="_blank" rel="noopener noreferrer" class="' + menuItem + ' mt-1 text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 border-t border-neutral-100 dark:border-neutral-800 pt-2"><span class="text-sm mt-0.5 shrink-0">💡</span><div><div class="text-xs font-semibold flex items-center gap-1"><span>Bug / Suggestion</span>' + icon('externalLink', 12, 'w-3 h-3 opacity-60') + '</div><div class="text-[10px] opacity-75">Send feedback or report an issue ↗</div></div></a>' +
            '</div>' +
          '</div>' +
        '</nav>' +
        '<div class="site-utilities">' +
          '<div class="relative hidden sm:block">' +
            '<button type="button" id="aiMenuBtn" aria-haspopup="menu" aria-expanded="false" data-dropdown="ai" class="px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#57534E] dark:text-neutral-300 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800" title="Local WebGPU Grader: Qwen 3 0.6B Active (Desktop WebGPU (16 GB RAM))">' + icon('cpu', 24, 'w-3.5 h-3.5 shrink-0') + '<span class="font-mono text-[11px] font-bold whitespace-nowrap" id="aiNavLabel">Local AI</span><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 hidden" id="aiNavDot"></span>' + icon('chevronDown', 24, 'w-3 h-3 opacity-60 shrink-0') + '</button>' +
            '<div id="aiMenu" role="menu" class="hidden absolute top-full right-0 mt-1 w-72 p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-700 shadow-xl backdrop-blur-xl z-50">' +
              '<div class="text-xs font-bold text-[#0F2042] dark:text-neutral-100">Local AI Grader (WebGPU)</div>' +
              '<div class="text-[10px] opacity-75">4-bit · Text only</div>' +
              '<div class="text-[10px] opacity-75 mt-1 font-mono" id="aiDeviceProfile">Device Profile: Desktop WebGPU (16 GB RAM)</div>' +
              '<div class="mt-2 text-xs font-semibold">Qwen 3 0.6B<span id="aiActiveLabel" class="text-[10px] font-normal opacity-75"> · Not loaded</span></div>' +
              '<div id="aiFallback" hidden class="mt-2 text-[10px] text-amber-800 dark:text-amber-300"></div>' +
              '<button type="button" id="aiLoadBtn" role="menuitem" class="w-full mt-2 text-left px-2 py-2 rounded-lg border border-[#E7E5E4] dark:border-neutral-700 bg-[#FAF9F6] dark:bg-neutral-800 hover:bg-[#F5F5F4] dark:hover:bg-neutral-700 cursor-pointer">' +
                '<span class="text-xs font-bold block">Qwen 3 0.6B (Local WebGPU)</span>' +
                '<span class="text-[10px] opacity-75">WebGPU · ~650 MB</span>' +
                '<span class="text-[10px] font-mono float-right text-emerald-700 dark:text-emerald-300" id="aiStateLabel">Load</span>' +
              '</button>' +
            '</div>' +
          '</div>' +
          '<div class="site-coin-balance sticker-badge font-mono text-xs font-bold cursor-default" title="Shared GIS Points balance"><span>✦</span><span data-ec-coins>' + EC.points() + '</span></div>' +
          '<button class="site-utility-button px-2.5 py-1.5 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-[#57534E] dark:text-neutral-300 transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer" title="Open Focus Realm &amp; Ambient Sounds" aria-label="Study Space" data-overlay="study-space">' + icon('headphones', 16) + '<span class="hidden 2xl:inline">Study Space</span></button>' +
          '<button type="button" class="' + utilBtn + '" title="Scholar Avatar &amp; Costumes" data-overlay="avatar">' + icon('palette', 24, 'w-4 h-4 text-purple-600 dark:text-purple-400') + '</button>' +
          '<button type="button" class="' + utilBtn + '" title="Milestones &amp; Achievements" data-overlay="achievements">' + icon('trophy', 24, 'w-4 h-4 text-amber-500') + '</button>' +
          '<div class="site-theme-control"><button type="button" aria-haspopup="menu" aria-expanded="false" class="' + utilBtn + '" title="Theme shop — Daylight" data-nav="themes">' + icon('paintbrush', 24, 'w-4 h-4') + '</button></div>' +
          '<button type="button" id="mobileNavBtn" class="lg:hidden p-1.5 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#1C1917] dark:text-white" aria-expanded="false" aria-label="Open study navigation">' + icon('menu', 24, 'w-5 h-5') + '</button>' +
        '</div></div>' +
      '<nav class="business-nav" aria-label="Business study tools"><div class="business-nav-inner">' +
        '<a class="business-nav-home" href="../../" aria-label="Fresh homepage" title="Fresh homepage">' + icon('arrowLeft', 16) + ' Fresh</a>' +
        '<div class="business-nav-tools">' +
          navBtn('overview', 'layoutGrid', 'Overview') +
          navBtn('progress', 'chartColumn', 'My progress') +
          navBtn('practice', 'fileText', 'Paper 1') +
          navBtn('paper2', 'bookOpen', 'Paper 2') +
          navBtn('lessons', 'graduationCap', 'Lessons') +
          navBtn('checklist', 'squareCheckBig', 'Checklist') +
          navBtn('review', 'clipboardList', 'Review') +
          navBtn('drill', 'target', 'MCQ', 'MCQ — Chapter Active Recall Drills') +
        '</div>' +
        '<button type="button" class="boss-cta boss-nav-button" data-nav="boss-battle">' + icon('swords', 19) + ' Boss Battle</button>' +
      '</div></nav></header>';

    var headerEl = EC.el('div', { html: header }).firstChild;
    document.body.insertBefore(headerEl, document.getElementById('main'));

    /* P1-9: the header theme control is a dropdown everywhere. misc.js adds
       EC.renderThemeShop and also auto-upgrades .site-theme-control on
       DOMContentLoaded; calling it here makes the dropdown available at once.
       The static data-nav="themes" button stays in the markup as the no-JS /
       no-API fallback and is replaced only when the helper exists. */
    if (typeof EC.renderThemeShop === 'function') {
      try { EC.renderThemeShop(document.querySelector('.site-theme-control')); } catch (e) {}
    }

    /* Original mobile study-navigation drawer. */
    var mobileNav = EC.el('nav', {
      class: 'site-mobile-navigation lg:hidden pt-3 border-t border-[#E7E5E4] dark:border-neutral-800 space-y-1.5 overscroll-contain max-h-[calc(100dvh-10rem)] overflow-y-auto hidden',
      'aria-label': 'Study navigation',
      html:
        '<a href="https://forms.gle/6X2CAR1LkSQGRBx68" target="_blank" rel="noopener noreferrer" class="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 mb-2"><span class="flex items-center gap-2"><span class="text-sm">💡</span><span>Report Bug / Suggestion</span></span><span class="text-[10px] opacity-75 font-mono">Feedback ↗</span></a>' +
        '<button type="button" data-nav="progress" class="mb-2 flex w-full items-center gap-2 rounded-xl bg-[#203e32] px-3 py-2.5 text-left text-xs font-bold text-white">' + icon('hardDrive', 16, 'w-4 h-4') + 'My progress</button>' +
        '<p class="mb-3 text-xs text-[var(--muted)]">Progress stays in this browser. Clearing site data removes it.</p>' +
        '<div class="rounded-xl border border-[#E7E5E4] dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70 p-2.5 mb-2 space-y-2"><div class="flex items-center justify-between text-[11px]"><span class="font-mono font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">' + icon('cpu', 16, 'w-3.5 h-3.5') + 'AI Model: <span data-ec-mobile-ai>Qwen 3 0.6B</span></span><span class="font-mono font-bold text-amber-600 hidden" data-ec-mobile-ai-pct></span></div><button type="button" id="mobileAiLoad" class="w-full px-2 py-1.5 rounded-lg text-[11px] font-bold border bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-[#D6D3D1] dark:border-neutral-700">Load Qwen 3 0.6B</button></div>' +
        '<div class="px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400">Questions</div>' +
        '<button type="button" data-nav="lessons" class="w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between text-[#203e32] dark:text-[#e4eeb2]"><span class="flex items-center gap-2">' + icon('graduationCap', 16, 'w-3.5 h-3.5') + 'Interactive Lessons</span><span class="text-[10px] px-1.5 py-0.5 rounded-full bg-[#e4eeb2] text-[#213b30] font-mono">24</span></button>' +
        '<button type="button" data-nav="practice" class="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between text-neutral-800 dark:text-neutral-200"><span>Topical Questions (Paper 1 · 1–40 sets)</span><span class="text-[10px] opacity-75 font-mono">Sec 1–6</span></button>' +
        '<button type="button" data-nav="paper2" class="w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between text-purple-700 dark:text-purple-400"><span>Paper 2 Practice</span><span class="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 font-mono">Sets 1–100</span></button>' +
        '<button type="button" data-nav="quiz" class="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400">⚡ Daily Challenge &amp; Quick Quiz</button>' +
        '<button type="button" data-nav="drill" class="w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between text-[#0F2042] dark:text-sky-300"><span class="flex items-center gap-2">' + icon('target', 16, 'w-3.5 h-3.5') + 'MCQ — Chapter Active Recall Drills</span><span class="text-[10px] px-1.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 font-mono">12,000</span></button>' +
        '<button type="button" data-nav="mocks" class="w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300"><span class="flex items-center gap-2">' + icon('timer', 16, 'w-3.5 h-3.5') + 'Start Mock Exam</span><span class="text-[10px] font-mono opacity-80">P1 / P2 timed</span></button>' +
        '<div class="pt-2 border-t border-[#E7E5E4] dark:border-neutral-800"></div>' +
        '<div class="px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400">Checklist</div>' +
        '<button type="button" data-nav="checklist" class="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200">0264 Syllabus Checklist</button>' +
        '<button type="button" data-nav="sections" class="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200">Sections &amp; Chapters (1–6)</button>' +
        '<details class="rounded-xl border border-[#E7E5E4] dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/60"><summary class="px-3 py-2 text-xs font-semibold cursor-pointer flex items-center gap-1.5">' + icon('scale', 16, 'w-3.5 h-3.5') + 'Advantages &amp; Disadvantages</summary><div class="px-2 pb-2"><div class="px-1 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Chapter breakdown</div>' +
        [1, 2, 3, 4, 5, 6].map(function (s) { return '<button type="button" data-nav="compare" data-section="' + s + '" class="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200">Section ' + s + '</button>'; }).join('') + '</div></details>' +
        '<button type="button" data-nav="boss-battle" class="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-rose-600">Boss Battle Arena ⚔️</button>' +
        '<button type="button" data-nav="review" class="w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between text-neutral-800 dark:text-neutral-200"><span class="flex items-center gap-2">' + icon('clipboardList', 16, 'w-3.5 h-3.5') + 'Review mistakes</span><span class="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 font-mono" data-ec-review-count></span></button>' +
        '<button type="button" data-nav="glossary" class="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200">0264 Glossary</button>' +
        '<button type="button" data-nav="archive" class="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200">Past Papers Archive</button>' +
        '<button type="button" data-nav="progress" class="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200">My progress</button>'
    });
    /* Keep the drawer inside the sticky header. As a body-level sibling it
       sits in normal flow above <main>, so once the page is scrolled its box
       is off-screen and opening it appears to do nothing. */
    if (headerEl) headerEl.appendChild(mobileNav);
    else document.body.insertBefore(mobileNav, document.getElementById('main'));
    var mobileBtn = document.getElementById('mobileNavBtn');
    if (mobileBtn) {
      mobileBtn.addEventListener('click', function (event) {
        event.preventDefault();
        var open = mobileNav.classList.contains('hidden');
        mobileNav.classList.toggle('hidden', !open);
        mobileBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        mobileBtn.setAttribute('aria-label', open ? 'Close study navigation' : 'Open study navigation');
        mobileBtn.innerHTML = open ? icon('x', 24, 'w-5 h-5') : icon('menu', 24, 'w-5 h-5');
      });
    }

    var footer = EC.el('footer', {
      class: 'border-t border-[var(--line,#d4d9cf)] dark:border-neutral-800 bg-[var(--paper,#f6f4ed)] dark:bg-[#0d1613] py-4 px-6 text-center text-xs text-[var(--muted,#4b5c54)] dark:text-neutral-400',
      html: '<p>EcBiz · IGCSE Business · <strong>Built by Jayden Tan · 11G</strong> · <a href="./Business.html?open=progress" class="font-semibold underline hover:text-[#8B1E1E]">Progress on this device</a> · <a href="../../privacy.html" class="font-semibold underline hover:text-[#8B1E1E]">Privacy notice</a></p>'
    });
    document.body.appendChild(footer);

    /* header dropdowns, mirroring the original app */
    function closeDropdowns() {
      ['syllabusMenu', 'resourcesMenu', 'aiMenu'].forEach(function (id) {
        var m = document.getElementById(id);
        if (m) m.classList.add('hidden');
      });
      ['syllabusMenuBtn', 'resourcesMenuBtn', 'aiMenuBtn'].forEach(function (id) {
        var b = document.getElementById(id);
        if (b) {
          b.setAttribute('aria-expanded', 'false');
          var chevron = b.querySelector('svg:last-child');
          if (chevron) chevron.classList.remove('rotate-180');
        }
      });
      var cs = document.getElementById('compareSections');
      if (cs) cs.classList.add('hidden');
      var ct = document.getElementById('compareToggle');
      if (ct) {
        ct.setAttribute('aria-expanded', 'false');
        var hint = document.getElementById('compareHint');
        if (hint) hint.textContent = 'Choose a section';
        var ch = ct.querySelector('svg:last-child');
        if (ch) ch.classList.remove('rotate-180');
      }
    }

    document.addEventListener('click', function (event) {
      var toggle = event.target.closest('[data-dropdown]');
      if (toggle) {
        event.preventDefault();
        var which = toggle.getAttribute('data-dropdown');
        var menu = document.getElementById(which === 'checklist' ? 'syllabusMenu' : (which === 'ai' ? 'aiMenu' : 'resourcesMenu'));
        var wasOpen = menu && !menu.classList.contains('hidden');
        closeDropdowns();
        if (!wasOpen && menu) {
          menu.classList.remove('hidden');
          toggle.setAttribute('aria-expanded', 'true');
          var chv = toggle.querySelector('svg:last-child');
          if (chv) chv.classList.add('rotate-180');
        }
        return;
      }
      var compareToggle = event.target.closest('#compareToggle');
      if (compareToggle) {
        event.preventDefault();
        var box = document.getElementById('compareSections');
        var wasHidden = box.classList.contains('hidden');
        if (wasHidden) box.classList.remove('hidden'); else box.classList.add('hidden');
        compareToggle.setAttribute('aria-expanded', wasHidden ? 'true' : 'false');
        var h = document.getElementById('compareHint');
        if (h) h.textContent = wasHidden ? 'Hide sections' : 'Choose a section';
        var cchv = compareToggle.querySelector('svg:last-child');
        if (cchv) cchv.classList.toggle('rotate-180', wasHidden);
        return;
      }
      var el = event.target.closest('[data-nav]');
      if (el) {
        event.preventDefault();
        var sec = el.getAttribute('data-section');
        closeDropdowns();
        if (mobileNav) {
          mobileNav.classList.add('hidden');
          if (mobileBtn) {
            mobileBtn.setAttribute('aria-expanded', 'false');
            mobileBtn.setAttribute('aria-label', 'Open study navigation');
            mobileBtn.innerHTML = icon('menu', 24, 'w-5 h-5');
          }
        }
        EC.navigate(el.getAttribute('data-nav'), sec ? { section: sec } : null);
        window.scrollTo(0, 0);
        return;
      }
      /* P1-8: global overlays in place of full-page routes. The overlay APIs
         are supplied by misc.js; check for them at click time so an older
         build still works, and fall back to the original route otherwise. */
      var overlayBtn = event.target.closest && event.target.closest('[data-overlay]');
      if (overlayBtn) {
        event.preventDefault();
        var kind = overlayBtn.getAttribute('data-overlay');
        var api = kind === 'study-space' ? 'openStudySpaceWidget'
          : (kind === 'avatar' ? 'openAvatarCustomizer' : 'openAchievementsOverlay');
        if (typeof EC[api] === 'function') {
          try { EC[api](); return; } catch (e) {}
        }
        EC.navigate(kind);
        window.scrollTo(0, 0);
        return;
      }
      var link = event.target.closest("a[href^='?open=']");
      if (link) {
        event.preventDefault();
        EC.navigate(new URLSearchParams(link.getAttribute('href')).get('open'));
        window.scrollTo(0, 0);
      }
    });
    document.addEventListener('click', function (event) {
      var toolsNav = document.querySelector('nav[aria-label="More Business tools"]');
      var aiWrap = document.getElementById('aiMenuBtn');
      var inAi = aiWrap && aiWrap.parentNode && aiWrap.parentNode.contains(event.target);
      if (toolsNav && !toolsNav.contains(event.target) && !inAi) closeDropdowns();
    });

    /* Local AI model menu — model loader, matching the original header dropdown. */
    function syncAiMenu(s) {
      var label = document.getElementById('aiNavLabel');
      var dot = document.getElementById('aiNavDot');
      var active = document.getElementById('aiActiveLabel');
      var stateLabel = document.getElementById('aiStateLabel');
      var device = document.getElementById('aiDeviceProfile');
      var fallback = document.getElementById('aiFallback');
      var btn = document.getElementById('aiMenuBtn');
      var loadBtn = document.getElementById('aiLoadBtn');
      if (label) label.textContent = s.loading ? ('AI ' + (s.percent || 0) + '%') : (s.ready ? 'AI ready' : 'Local AI');
      if (dot) dot.classList.toggle('hidden', !s.ready);
      if (btn) {
        btn.classList.toggle('border-emerald-500', !!s.ready);
        btn.classList.toggle('text-emerald-700', !!s.ready);
        btn.classList.toggle('border-amber-500', !!s.loading && !s.ready);
        btn.title = 'Local WebGPU Grader: ' + (s.ready ? 'Qwen 3 0.6B Active' : 'Qwen 3 0.6B Not loaded') + ' (' + s.reason + ')';
      }
      if (active) active.textContent = s.ready ? ' · Active: Qwen 3 0.6B' : ' · Not loaded';
      if (stateLabel) stateLabel.textContent = s.ready ? 'Active' : (s.loading ? (s.percent || 0) + '%' : 'Load');
      if (device) device.textContent = 'Device Profile: ' + s.reason;
      if (fallback) {
        var unusable = /unavailable|unsupported|failed|file:/i.test(s.status || '');
        fallback.hidden = !unusable;
        if (unusable) fallback.textContent = s.status;
      }
      if (loadBtn) loadBtn.disabled = !!s.loading || !!s.ready;
      var mobileAi = document.querySelector('[data-ec-mobile-ai]');
      if (mobileAi) mobileAi.textContent = s.ready ? 'Qwen 3 0.6B Active' : 'Qwen 3 0.6B';
      var mobilePct = document.querySelector('[data-ec-mobile-ai-pct]');
      if (mobilePct) {
        mobilePct.textContent = (s.percent || 0) + '%';
        mobilePct.classList.toggle('hidden', !s.loading);
      }
      var mobileLoad = document.getElementById('mobileAiLoad');
      if (mobileLoad) {
        mobileLoad.textContent = s.ready ? 'Qwen 3 0.6B Active' : (s.loading ? 'Loading Qwen 3 0.6B (' + (s.percent || 0) + '%)' : 'Load Qwen 3 0.6B');
        mobileLoad.disabled = !!s.loading || !!s.ready;
      }
    }
    document.addEventListener('click', function (event) {
      var mobileLoad = event.target.closest && event.target.closest('#mobileAiLoad');
      if (mobileLoad && window.EC && EC.ai) { event.preventDefault(); EC.ai.load(); return; }
      var loadBtn = event.target.closest && event.target.closest('#aiLoadBtn');
      if (loadBtn && window.EC && EC.ai) {
        event.preventDefault();
        EC.ai.load();
        return;
      }
    });
    if (window.EC && EC.ai) EC.ai.onChange(syncAiMenu);
    window.addEventListener('popstate', EC.render);

    EC.onRender = function (state) {
      closeDropdowns();
      var name = state.name;
      /* Mock exam mode is distraction-free: the original unmounted the whole
       * app. Hide the site chrome for every mock stage, restore it elsewhere. */
      document.body.classList.toggle('ec-exam-active', name === 'mocks');
      var resourcesBtn = document.getElementById('resourcesMenuBtn');
      var reviewCount = document.querySelector('[data-ec-review-count]');
      if (reviewCount) {
        var n = 0;
        try { var rv = JSON.parse(localStorage.getItem('ecbiz_mcq_review') || '{}'); n = rv && typeof rv === 'object' ? Object.keys(rv).length : 0; } catch (e) {}
        reviewCount.textContent = n;
        reviewCount.style.display = n ? '' : 'none';
      }
      document.querySelectorAll('nav button[data-nav]').forEach(function (b) {
        if (b.getAttribute('data-nav') === name) b.setAttribute('aria-current', 'page');
        else b.removeAttribute('aria-current');
      });
      if (resourcesBtn) {
        var resourcesActive = ['glossary', 'archive', 'progress'].indexOf(name) >= 0;
        resourcesBtn.classList.toggle('bg-[#0F2042]/10', resourcesActive);
        resourcesBtn.classList.toggle('text-[#0F2042]', resourcesActive);
        resourcesBtn.classList.toggle('font-semibold', resourcesActive);
      }
    };
  }

  var sectionOptions = [
    ['1', 'Understanding business activity'],
    ['2', 'People in business'],
    ['3', 'Marketing'],
    ['4', 'Operations management'],
    ['5', 'Financial information and decisions'],
    ['6', 'External influences on business activity']
  ];
  var consolidationUrls = {
    '1': 'https://docs.google.com/document/d/1vhY8qBmVvCjDHAq8BbR1SblXaNw8lv5hrxvEcioENOw/edit?tab=t.0',
    '2': 'https://docs.google.com/document/d/1CPrZbJA-8uhA_tP45FKHjo3pWFHPYnE2q7zL--IYPT8/edit?tab=t.0',
    '3': 'https://docs.google.com/document/d/1Qc3OYlT0VTAUUckaefMS7ynq3h41SvmqpdaZZBf_yWM/edit?tab=t.0',
    '4': 'https://docs.google.com/document/d/141lWIHYvK53CSvJDF9SfmAjYvqRA0MKgX_-ixOUT58A/edit?tab=t.0',
    '5': 'https://docs.google.com/document/d/1PdKDA-jKsDHv-ndiCXo4Ema7J-YQwkOznqjDIYWDlIs/edit?tab=t.0'
  };
  function options() {
    return sectionOptions.map(function (s) {
      return '<option value="' + s[0] + '">Section ' + s[0] + ' — ' + s[1] + '</option>';
    }).join('');
  }

  /* P1-5: open the diagram for the chosen section. An in-place overlay API
     (added by other builders) wins; otherwise the sections view is opened with
     the selected section so the breakdown is scoped correctly. */
  function openSectionDiagram(code, opener) {
    if (typeof EC.openSectionDiagram === 'function') {
      try { EC.openSectionDiagram(code); return; } catch (e) {}
    }
    EC.navigate('sections', { section: code || '1' });
  }

  /* P1-6: in-place chapter-summary dialog with role="dialog", Escape close and
     a body scroll lock. The page link remains in the markup for no-JS users. */
  var chapterOverlay = null;
  function chapterOverlayKey(event) {
    if (event.key === 'Escape' || event.keyCode === 27) closeChapterOverlay();
  }
  function closeChapterOverlay() {
    if (!chapterOverlay) return;
    var ov = chapterOverlay;
    chapterOverlay = null;
    document.removeEventListener('keydown', chapterOverlayKey);
    document.body.style.overflow = ov.prevOverflow;
    if (ov.opener && typeof ov.opener.focus === 'function') ov.opener.focus();
    if (ov.node.parentNode === ov.parent) ov.parent.removeChild(ov.node);
  }
  function mdBold(value) {
    return EC.esc(value == null ? '' : value).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }
  function visualLines(v) {
    var out = [];
    function add(label, text) {
      if (text == null || text === '') return;
      out.push((label ? '<strong>' + EC.esc(label) + ':</strong> ' : '') + mdBold(text));
    }
    if (!v || typeof v !== 'object') return '';
    if (Array.isArray(v.tokens)) v.tokens.forEach(function (t) { add(t.label || t.value, t.text || t.value); });
    if (Array.isArray(v.items)) v.items.forEach(function (t) {
      var tail = t.meta ? (t.text || t.formula ? ' — ' : '') + t.meta : '';
      add(t.title || t.label, (t.text || t.formula || '') + tail);
    });
    if (Array.isArray(v.steps)) v.steps.forEach(function (t) { add(t.title || t.label, t.text || t.formula || ''); });
    if (Array.isArray(v.columns)) v.columns.forEach(function (t) {
      add(t.title, (t.subtitle ? t.subtitle + ' — ' : '') + (Array.isArray(t.items) ? t.items.join(' · ') : ''));
    });
    if (Array.isArray(v.channels)) v.channels.forEach(function (t) { add(t.label, Array.isArray(t.steps) ? t.steps.join(' → ') : ''); });
    if (Array.isArray(v.stages)) v.stages.forEach(function (t) { add(t.title, (t.text || '') + (t.meta ? ' (' + t.meta + ')' : '')); });
    if (Array.isArray(v.rows)) v.rows.forEach(function (row) { if (Array.isArray(row)) add(row[0], row.slice(1).join(' · ')); });
    if (Array.isArray(v.costs)) add('Costs', v.costs.join(' · '));
    if (Array.isArray(v.benefits)) add('Benefits', v.benefits.join(' · '));
    if (v.note) add('Note', v.note);
    return out.length ? '<p class="mt-0.5 text-[11px] leading-snug text-[#57534E] dark:text-neutral-300">' + out.join('<br>') + '</p>' : '';
  }
  function renderSheetInto(body, sheet) {
    var blocks = Array.isArray(sheet.blocks) ? sheet.blocks : [];
    var html = '<div class="p-5 sm:p-7">';
    html += '<p class="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B1E1E]">EcBiz · Section ' + EC.esc(sheet.code) + ' of 6 · Chapter Summary</p>';
    html += '<h2 class="mt-1 text-xl font-bold text-[#0F2042] dark:text-white">' + EC.esc(sheet.title || '') + '</h2>';
    html += '<p class="mt-1 text-xs opacity-75">' + EC.esc(sheet.strap || '') + '</p><div class="mt-5 space-y-5">';
    blocks.forEach(function (block) {
      html += '<section class="rounded-xl border border-[#E7E5E4] dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/60 p-4">';
      html += '<h3 class="text-sm font-bold text-[#0F2042] dark:text-white">' + EC.esc(block.code || '') + ' ' + EC.esc(block.title || '') + '</h3>';
      if (block.eyebrow) html += '<p class="mt-0.5 text-[10px] italic opacity-70">' + EC.esc(block.eyebrow) + '</p>';
      var visuals = Array.isArray(block.visuals) ? block.visuals : [];
      if (visuals.length) {
        html += '<div class="mt-3 grid gap-2 sm:grid-cols-2">';
        visuals.forEach(function (v) {
          html += '<div class="rounded-lg border border-[#E7E5E4] dark:border-neutral-700 bg-[#FAF9F6] dark:bg-neutral-800/60 p-2.5">';
          html += '<div class="text-[11px] font-bold">' + EC.esc((v && v.title) || 'Visual') + '</div>' + visualLines(v) + '</div>';
        });
        html += '</div>';
      }
      var points = Array.isArray(block.points) ? block.points : [];
      if (points.length) {
        html += '<ul class="mt-3 space-y-1">';
        points.forEach(function (p) {
          html += '<li class="flex gap-2 text-[11px] leading-snug"><span class="text-emerald-600">✓</span><span>' + mdBold((p && (p.text || p.title)) || '') + '</span></li>';
        });
        html += '</ul>';
      }
      if (block.takeaway) html += '<p class="mt-3 rounded-lg bg-[#e4eeb2]/50 dark:bg-emerald-950/40 px-3 py-2 text-[11px]"><strong>Exam takeaway:</strong> ' + mdBold(block.takeaway) + '</p>';
      html += '</section>';
    });
    body.innerHTML = html + '</div></div>';
  }
  function openLocalChapterOverlay(code, opener) {
    closeChapterOverlay();
    var node = document.createElement('div');
    node.className = 'ec-chapter-overlay fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-3 sm:p-6';
    node.setAttribute('role', 'dialog');
    node.setAttribute('aria-modal', 'true');
    node.setAttribute('aria-label', 'Chapter summary — Section ' + (code || '1'));
    var box = document.createElement('div');
    box.className = 'relative w-full max-w-4xl rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl my-4';
    box.innerHTML = '<div class="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-[#E7E5E4] dark:border-neutral-700 bg-white/95 dark:bg-neutral-900/95 px-4 py-3 backdrop-blur">' +
      '<div class="min-w-0"><div class="text-xs font-bold text-[#0F2042] dark:text-white">Chapter Summary</div>' +
      '<div class="text-[10px] opacity-70">One-page visual revision sheet · Cambridge IGCSE Business 0264</div></div>' +
      '<button type="button" class="ec-chapter-overlay-close p-1.5 rounded-lg border border-[#D6D3D1] dark:border-neutral-700 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 cursor-pointer" aria-label="Close chapter summary">' + icon('x', 18) + '</button></div>' +
      '<div class="ec-chapter-overlay-body"><p class="p-6 text-xs opacity-70">Loading chapter summary…</p></div>';
    node.appendChild(box);
    var parent = document.body;
    chapterOverlay = { node: node, parent: parent, opener: opener, prevOverflow: document.body.style.overflow };
    parent.appendChild(node);
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', chapterOverlayKey);
    var closeBtn = box.querySelector('.ec-chapter-overlay-close');
    closeBtn.addEventListener('click', closeChapterOverlay);
    node.addEventListener('click', function (event) { if (event.target === node) closeChapterOverlay(); });
    closeBtn.focus();
    EC.load('one-page-sheets').then(function (sheets) {
      if (!chapterOverlay || chapterOverlay.node !== node) return;
      var body = node.querySelector('.ec-chapter-overlay-body');
      var list = Array.isArray(sheets) ? sheets : [];
      var sheet = null, i;
      for (i = 0; i < list.length; i++) if (String(list[i].code) === String(code)) { sheet = list[i]; break; }
      if (!sheet && list.length) sheet = list[0];
      if (!sheet) { body.innerHTML = '<p class="p-6 text-xs opacity-70">No chapter sheet available.</p>'; return; }
      renderSheetInto(body, sheet);
    }).catch(function () {
      if (!chapterOverlay || chapterOverlay.node !== node) return;
      node.querySelector('.ec-chapter-overlay-body').innerHTML = '<p class="p-6 text-xs text-rose-700">Could not load this chapter summary.</p>';
    });
  }
  function openChapterSheet(code, opener) {
    if (typeof EC.openChapterSheetOverlay === 'function') {
      try { EC.openChapterSheetOverlay(code); return; } catch (e) {}
    }
    openLocalChapterOverlay(code, opener);
  }

  EC.register('overview', {
    title: 'Overview',
    render: function (main) {
      main.innerHTML =
        '<div class="study-page business-overview">' +
          '<header class="study-hero business-overview-hero"><div class="study-hero-content">' +
            '<p class="study-hero-kicker">Cambridge IGCSE · 0264</p>' +
            '<h1 class="study-title">Business<br>Studies</h1>' +
            '<p class="study-description">Revise a topic, practise with case studies, and get feedback on your answers.</p>' +
            '<div class="study-hero-actions">' +
              '<button class="study-action btn-primary" type="button" data-nav="practice">Practise Paper 1 ' + icon('arrowRight', 17) + '</button>' +
              '<button class="study-action study-secondary-action" type="button" data-nav="mocks">' + icon('timer', 17) + ' Start a mock exam</button>' +
            '</div></div><div class="study-hero-image" aria-hidden="true"></div></header>' +

          '<button type="button" class="progress-overview-link" data-nav="progress">' + icon('chartColumn', 24) +
            '<span><strong>My progress</strong><small>View your marks, skills breakdown, saved answers and CSV download.</small></span>' + icon('arrowRight', 22) + '</button>' +

          '<button type="button" class="boss-cta boss-overview-button" data-nav="boss-battle">' + icon('swords', 25) +
            '<span><strong>Boss Battle</strong><small>Fight with Business questions and earn GIS Points.</small></span>' + icon('arrowRight', 23) + '</button>' +

          '<section class="business-overview-section" aria-labelledby="business-papers"><h2 id="business-papers">Exam practice</h2><div class="business-overview-papers">' +
            '<button class="business-overview-card business-paper-card" type="button" data-nav="practice"><span class="business-overview-icon">' + icon('fileText', 23) + '</span><span class="business-overview-card-copy"><strong>Paper 1 practice</strong><span>Choose a syllabus topic and work through short, structured questions.</span></span>' + icon('arrowRight', 20, 'business-overview-arrow') + '</button>' +
            '<button class="business-overview-card business-paper-card" type="button" data-nav="paper2"><span class="business-overview-icon">' + icon('bookOpen', 23) + '</span><span class="business-overview-card-copy"><strong>Paper 2 case studies</strong><span>Read the case and appendices, then practise applying the evidence in longer answers.</span></span>' + icon('arrowRight', 20, 'business-overview-arrow') + '</button>' +
          '</div></section>' +

          '<section class="business-overview-section" aria-labelledby="business-revision"><h2 id="business-revision">Revision tools</h2><div class="business-overview-tools">' +
            '<button class="business-overview-card business-tool-card" type="button" data-nav="lessons"><span class="business-overview-icon">' + icon('graduationCap', 20) + '</span><span class="business-overview-card-copy"><strong>Interactive lessons</strong><span>Learn a topic step by step.</span></span>' + icon('arrowRight', 17, 'business-overview-arrow') + '</button>' +
            '<button class="business-overview-card business-tool-card" type="button" data-nav="quiz"><span class="business-overview-icon">' + icon('zap', 20) + '</span><span class="business-overview-card-copy"><strong>Quick Quiz</strong><span>Test what you remember.</span></span>' + icon('arrowRight', 17, 'business-overview-arrow') + '</button>' +
            '<button class="business-overview-card business-tool-card" type="button" data-nav="checklist"><span class="business-overview-icon">' + icon('clipboardCheck', 20) + '</span><span class="business-overview-card-copy"><strong>0264 Syllabus Checklist</strong><span>Track what you still need to cover.</span></span>' + icon('arrowRight', 17, 'business-overview-arrow') + '</button>' +
          '</div></section>' +

          '<section class="business-overview-section" aria-labelledby="business-revision-pack"><h2 id="business-revision-pack">Section revision pack</h2><div class="business-revision-pack">' +
            '<div class="business-pack-card"><span class="business-overview-icon">' + icon('fileText', 22) + '</span><span class="business-pack-copy"><strong>Chapter Summary</strong><span>A full visual summary of each section — every topic, key idea, diagram and exam takeaway.</span></span><a class="business-pack-action" id="chapterSummariesBtn" href="?open=chapter-sheets">Open chapter summaries ' + icon('arrowRight', 16) + '</a></div>' +
            '<div class="business-pack-card"><span class="business-overview-icon">' + icon('graduationCap', 22) + '</span><span class="business-pack-copy"><strong>Section Diagrams</strong><span>Interactive diagram for each section. Choose a section below.</span></span><label class="business-pack-field"><span class="business-pack-label">Choose a section</span><select class="business-pack-select" id="diagramSection" aria-label="Choose which section diagram to open">' + options() + '</select></label><button type="button" class="business-pack-action" id="diagramOpenBtn">Open diagram ' + icon('arrowRight', 16) + '</button></div>' +
            '<div class="business-pack-card"><span class="business-overview-icon">' + icon('bookOpen', 22) + '</span><span class="business-pack-copy"><strong>Consolidation Documents</strong><span>Official Google Docs consolidation sheet for the section you pick.</span></span><label class="business-pack-field"><span class="business-pack-label">Choose a section</span><select class="business-pack-select" id="consolidationSection" aria-label="Choose which section’s consolidation document to open">' + options() + '</select></label><a class="business-pack-action" id="consolidationLink" href="' + consolidationUrls['1'] + '" target="_blank" rel="noopener noreferrer">Open consolidation document ' + icon('externalLink', 16) + '</a></div>' +
          '</div>' +
          '<button type="button" class="business-mcq-link" data-nav="drill"><span class="business-overview-icon business-mcq-link-icon">' + icon('target', 24) + '</span><span class="business-mcq-link-copy"><strong>MCQ Knowledge Practice</strong><span>Chapter Active Recall Drills — 12,000 syllabus MCQs across all six sections, with instant feedback and a Wrong-Only mode.</span></span><span class="business-pack-action business-pack-action-static">Start Active Recall Drills ' + icon('arrowRight', 16) + '</span></button>' +
        '</section></div>';

      var consSelect = document.getElementById('consolidationSection');
      var consLink = document.getElementById('consolidationLink');
      if (consSelect && consLink) {
        consSelect.addEventListener('change', function () {
          var url = consolidationUrls[consSelect.value];
          if (url) {
            consLink.setAttribute('href', url);
            consLink.innerHTML = 'Open consolidation document ' + icon('externalLink', 16);
            consLink.removeAttribute('aria-disabled');
          } else {
            consLink.removeAttribute('href');
            consLink.innerHTML = 'Consolidation doc coming soon';
          }
        });
      }
      var diagramBtn = document.getElementById('diagramOpenBtn');
      var diagramSel = document.getElementById('diagramSection');
      if (diagramBtn && diagramSel) {
        diagramBtn.addEventListener('click', function (event) {
          event.preventDefault();
          event.stopPropagation();
          openSectionDiagram(diagramSel.value || '1', diagramBtn);
        });
      }
      var chapterBtn = document.getElementById('chapterSummariesBtn');
      if (chapterBtn) {
        chapterBtn.addEventListener('click', function (event) {
          event.preventDefault();
          event.stopPropagation();
          openChapterSheet('1', chapterBtn);
        });
      }
    }
  });

  shell();
  EC.render();
})();

(function () {
  'use strict';

  // These controls belong to provider-only features embedded in upstream templates.
  const unavailable = [
    '.asktopic', '.ecard', '#more', '.recall-ai', '.exgen',
    '[data-ndeep]', '[data-open-ai]', '[data-recall-ai]', '[data-tutor-step]',
    '[data-discuss]', '[data-discuss-x]', '[data-cmfresh]', '[data-pcfresh]',
    '[data-tl-ask]', '[data-pcask]', '[data-oask]', '[data-xai]', '[data-xgen]',
    'a[href="#research"]', 'a[href="#advanced"]', 'a[href^="#adv-from-"]',
  ].join(',');
  const needsTutor = /\b(?:ask|with|by|let) (?:the )?(?:einstein|ai)\b|\b(?:einstein|ai) (?:writes|settings|tutor|hint|feedback|marking|mark|coach)\b/i;
  const view = document.querySelector('#view');
  function removeTutorControls() {
    view.querySelectorAll(unavailable).forEach(element => element.remove());
    view.querySelectorAll('button, a, label').forEach(element => {
      if (needsTutor.test(element.textContent.trim())) element.remove();
    });
  }
  new MutationObserver(removeTutorControls).observe(view, { childList: true, subtree: true });
}());

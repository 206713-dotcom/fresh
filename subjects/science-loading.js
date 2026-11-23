(() => {
  const screen = document.getElementById('science-loading');
  const subject = screen.dataset.subject;
  const status = screen.querySelector('[role="status"]');
  const actions = screen.querySelector('.science-loading-actions');

  function showRecovery(message) {
    clearTimeout(timer);
    screen.classList.add('is-slow');
    status.textContent = message;
    actions.hidden = false;
  }

  const timer = setTimeout(() => {
    showRecovery(subject + ' is taking longer than expected.');
  }, 25000);

  actions.querySelector('button').addEventListener('click', () => window.location.reload());
  window.addEventListener('fresh-science-ready', () => {
    clearTimeout(timer);
    screen.hidden = true;
  }, { once: true });
  window.addEventListener('fresh-science-error', () => {
    showRecovery(subject + ' couldn’t load. Try again in a moment.');
  }, { once: true });
})();

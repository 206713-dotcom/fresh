const ecbizMarking = (() => {
  const pending = new Map();

  function grade(id, answer, image) {
    const key = JSON.stringify([id, answer, image]);
    if (!pending.has(key)) {
      const request = (async () => {
        const response = await fetch('/api/ecbiz-mark', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, answer, image }), signal: AbortSignal.timeout(30000)
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.grade) {
          throw new Error(data.error || 'Written marking is unavailable. Please try again.');
        }
        return data.grade;
      })();
      pending.set(key, request);
      const clear = () => pending.delete(key);
      request.then(clear, clear);
    }
    return pending.get(key);
  }

  function feedback(result, marks) {
    return '<strong>' + result.score + '/' + marks + ' marks' +
      (result.band && result.band !== 'point-based' ? ' · Band ' + escapeHtml(result.band) : '') +
      '</strong><p>' + escapeHtml(result.feedback) + '</p>' +
      (result.credits?.length ? '<ul>' + result.credits.map(credit =>
        '<li><strong>' + escapeHtml(credit.criterion) + '</strong> · ' +
        escapeHtml(credit.evidence) + '</li>').join('') + '</ul>' : '') +
      (result.nextStep ? '<p><strong>Next step</strong> ' + escapeHtml(result.nextStep) + '</p>' : '');
  }

  function scheme(prompt) {
    return '<details><summary>View mark scheme</summary><div class="mark-scheme">' +
      escapeHtml(prompt.scheme) + '</div>' +
      (prompt.note ? '<p>' + escapeHtml(prompt.note) + '</p>' : '') + '</details>';
  }

  return { grade, feedback, scheme, blank: { score: 0, feedback: 'No answer submitted.' } };
})();

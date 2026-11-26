export function readAttempt(value, tasks) {
  try {
    const saved = JSON.parse(value);
    if (tasks.some(task => task.id === saved?.task) && typeof saved.answer === 'string' &&
        saved.answer.length <= 9000 && Number.isFinite(saved.endsAt) &&
        (saved.submittedAt === null || Number.isFinite(saved.submittedAt))) return saved;
  } catch {}
  return null;
}

export function timeRemaining(endsAt, now = Date.now()) {
  return Math.max(0, Math.ceil((endsAt - now) / 1000));
}

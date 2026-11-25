export function validateFeedback(result, task, answer) {
  if (!Array.isArray(result?.criteria) || result.criteria.length !== task.criteria.length ||
      typeof result.nextStep !== 'string' || !result.nextStep.trim()) {
    throw new Error('The model returned incomplete feedback.');
  }
  const criteria = task.criteria.map(([name, max], index) => {
    const entry = result.criteria[index];
    if (!Number.isInteger(entry?.mark) || entry.mark < 0 || entry.mark > max ||
        typeof entry.comment !== 'string' || !entry.comment.trim() ||
        typeof entry.evidence !== 'string' ||
        (entry.mark > 0 && (!entry.evidence.trim() || !answer.includes(entry.evidence)))) {
      throw new Error('The model returned a mark without valid supporting evidence.');
    }
    return { name, max, mark: entry.mark, evidence: entry.mark ? entry.evidence : '', comment: entry.comment };
  });
  return { criteria, total: criteria.reduce((total, item) => total + item.mark, 0), nextStep: result.nextStep };
}

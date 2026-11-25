export const check = (prompt, answer, distractors, why) => ({prompt, answer, distractors, why});

export const lesson = (id, title, unit, tier, objectives, method, example, diagnostic, practice, requires = []) => ({
  id, title, unit, tier, objectives, method, example, diagnostic, practice, requires
});

export function chooseDifferent(items, current) {
  const choices = items.filter(item => item !== current);
  return choices[Math.floor(Math.random() * choices.length)];
}

export function setupNewQuestion(button, select) {
  button.addEventListener('click', () => {
    if (select.disabled) return;
    const value = chooseDifferent(Array.from(select.options, option => option.value), select.value);
    if (value === undefined) return;
    select.value = value;
    select.dispatchEvent(new Event('change', { bubbles:true }));
  });
}

export function setupClearWriting(button, fields) {
  button.addEventListener('click', () => {
    const written = fields.filter(field => field.value && !field.readOnly && !field.disabled);
    if (!written.length || !window.confirm('Are you sure you want to clear what you’ve written?')) return;
    for (const field of written) field.value = '';
    for (const field of written) field.dispatchEvent(new Event('input', { bubbles:true }));
    fields[0].focus();
  });
}

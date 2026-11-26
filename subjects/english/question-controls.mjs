export function groupedQuestions(select, items, describe) {
  const groups = new Map();
  for (const [index, item] of items.entries()) {
    const [label, value, title] = describe(item, index);
    if (!groups.has(label)) {
      const group = document.createElement('optgroup');
      group.label = label;
      groups.set(label, group);
      select.append(group);
    }
    groups.get(label).append(new Option(title, value));
  }
}

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
  const dialog = document.createElement('dialog');
  const titleId = button.id + '-title';
  const descriptionId = button.id + '-description';
  dialog.className = 'clear-writing-dialog';
  dialog.setAttribute('aria-labelledby', titleId);
  dialog.setAttribute('aria-describedby', descriptionId);
  dialog.innerHTML = `
    <form method="dialog">
      <h2 id="${titleId}">Clear your writing?</h2>
      <p id="${descriptionId}">This will erase the text in the current form.</p>
      <div class="actions">
        <button value="no" autofocus>No</button>
        <button class="button" value="yes">Yes</button>
      </div>
    </form>`;
  document.body.append(dialog);

  function editableText() {
    return fields.filter(field => field.value && !field.readOnly && !field.disabled);
  }

  button.addEventListener('click', () => {
    if (!editableText().length) return;
    dialog.returnValue = 'no';
    dialog.showModal();
  });
  dialog.addEventListener('close', () => {
    if (dialog.returnValue !== 'yes') return;
    const written = editableText();
    for (const field of written) field.value = '';
    for (const field of written) field.dispatchEvent(new Event('input', { bubbles:true }));
    written[0]?.focus();
  });
}

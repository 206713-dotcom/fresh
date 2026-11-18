/** Download study records using spreadsheet-compatible CSV escaping. */
export function downloadProgressCsv(subject, records) {
  const rows = [['Subject', 'Activity', 'Item', 'Status', 'Answer', 'Details', 'Updated at'],
    ...records.map(record => [subject, ...record])];
  const csv = rows.map(row => row.map(value => {
    const text = String(value ?? '');
    const safe = /^[\s\u0000-\u001f]*[=+@-]/.test(text) ? "'" + text : text;
    return '"' + safe.replaceAll('"', '""') + '"';
  }).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'fresh-' + subject.toLowerCase().replaceAll(' ', '-') + '-progress-' + new Date().toISOString().slice(0, 10) + '.csv';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

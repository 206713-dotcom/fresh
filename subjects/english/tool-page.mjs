import { setupNotebook, setupReadingLab, setupStudyDisplay, setupTheme } from './learning.mjs';
import { tasks } from './practice.mjs';
import { read, write } from './storage.mjs';

setupTheme(read, write);
setupStudyDisplay(read, write);

if (document.getElementById('reading-lab')) {
  setupReadingLab(read, write);
} else {
  const requested = new URLSearchParams(location.search).get('task') ?? read('last-practice');
  const task = tasks.find(item => item.id === requested) ?? tasks[0];
  setupNotebook(read, write, task.id);
}

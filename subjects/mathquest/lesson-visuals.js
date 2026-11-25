import {dataVisuals} from './visuals-data.js';
import {geometryVisuals} from './visuals-geometry.js';
import {graphVisuals} from './visuals-graphs.js';
import {numberVisuals} from './visuals-number.js';
import {e, tile} from './ui.js';

const visuals = {
  ...numberVisuals,...graphVisuals,...geometryVisuals,...dataVisuals,
  'al-p1-quadratics':graphVisuals.graphs,
  'al-p1-coordinates':graphVisuals.coordinates,
  'al-p1-differentiation':graphVisuals.stationary,
  'al-p1-integration':graphVisuals.integration,
  'al-p3-differentiation':graphVisuals['derivative-rules'],
  'al-p3-integration':graphVisuals.integration,
  'al-s1-data':dataVisuals.histograms,
  'al-s1-probability':dataVisuals.conditional
};
const width = 600;
const height = 280;
const settings = new Map();

export const hasLessonVisual = id => Object.hasOwn(visuals,id);

export function lessonVisual(id) {
  if (!hasLessonVisual(id)) return '';
  const visual = visuals[id];
  return `<section class="card lesson-visual" id="lesson-visual" data-lesson-visual="${id}" aria-labelledby="visual-title" aria-describedby="visual-description">
    <div class="visual-header">
      ${tile('shapes','violet')}
      <div><p class="visual-label">Interactive visual</p><h2 id="visual-title">${e(visual.title)}</h2></div>
    </div>
    <p class="visual-description" id="visual-description">${e(visual.description)}</p>
    <div class="visual-layout">
      <figure class="visual-figure">
        <canvas width="${width}" height="${height}" role="img" aria-label="${e(visual.title)}" aria-describedby="visual-result">Use the controls and read the result below to explore this model.</canvas>
      </figure>
      <div class="visual-controls" role="group" aria-label="Model controls">
        ${visual.controls.map(control => `<div class="visual-control">
          <div class="visual-control-label">
            <label for="visual-${control.key}">${e(control.label)}</label>
            <output data-visual-value="${control.key}" for="visual-${control.key}" aria-hidden="true">${e(control.format ? control.format(control.initial) : control.initial)}</output>
          </div>
          <input id="visual-${control.key}" type="range" min="${control.min}" max="${control.max}"
            step="${control.step ?? 1}" value="${control.initial}" data-visual-control="${control.key}">
        </div>`).join('')}
        <button class="btn secondary visual-reset" type="button" data-visual-reset>Reset values</button>
      </div>
    </div>
    <p id="visual-result" class="visual-result" aria-live="polite" aria-atomic="true"></p>
  </section>`;
}

export function mountLessonVisual() {
  const panel = document.querySelector('[data-lesson-visual]');
  if (!panel) return;
  const id = panel.dataset.lessonVisual;
  const visual = visuals[id];
  const canvas = panel.querySelector('canvas');
  const caption = panel.querySelector('#visual-result');
  const density = Math.min(window.devicePixelRatio || 1,2);
  canvas.width = width * density;
  canvas.height = height * density;
  const ctx = canvas.getContext('2d');
  const defaults = Object.fromEntries(visual.controls.map(control => [control.key,control.initial]));
  const values = settings.get(id) ?? {...defaults};
  settings.set(id,values);

  function paint() {
    if (ctx) {
      ctx.setTransform(density,0,0,density,0,0);
      ctx.clearRect(0,0,width,height);
      ctx.save();
      visual.draw(ctx,values);
      ctx.restore();
    }
    caption.textContent = visual.readout(values);
  }

  const controls = visual.controls.map(control => ({
    ...control,
    input:panel.querySelector('#visual-' + control.key),
    output:panel.querySelector('[data-visual-value="' + control.key + '"]')
  }));

  function syncControl({key,input,output,format}) {
    input.value = values[key];
    const label = format ? format(values[key]) : String(values[key]);
    output.textContent = label;
    input.setAttribute('aria-valuetext',label);
  }

  for (const control of controls) {
    syncControl(control);
    control.input.addEventListener('input',()=>{
      values[control.key] = Number(control.input.value);
      syncControl(control);
      paint();
    });
  }
  panel.querySelector('[data-visual-reset]').addEventListener('click',()=>{
    Object.assign(values,defaults);
    controls.forEach(syncControl);
    paint();
  });
  paint();
}

// One import point for three.js. Since 1958 already ships three.js r187 and its
// post-processing add-ons in ../vendor/three/, so the page uses those (see the
// import map in index.html) and downloads nothing extra.
export * from 'three';
export { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
export { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
export { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
export { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

import './styles/main.css';

import { initSmoothScroll } from './modules/smoothScroll.js';
import { initWebGLScene } from './modules/webglScene.js';
import { initAnimations } from './modules/animations.js';
import { initUltravioletSpotlight } from './modules/spotlight.js';
import { initCustomCursor } from './modules/cursor.js';
import { initAudioController } from './modules/audio.js';
import { initInteractions } from './modules/interactions.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Smooth Scrolling Engine
  initSmoothScroll();

  // 2. Initialize Three.js 3D WebGL Scene
  initWebGLScene();

  // 3. Initialize GSAP ScrollTrigger & Choreographed Animations
  initAnimations();

  // 4. Initialize Custom Magnetic Cursor
  initCustomCursor();

  // 5. Initialize Sound Synthesizer Controller
  initAudioController();

  // 6. Initialize Ultraviolet Flashlight Duplicate Mask
  initUltravioletSpotlight();

  // 7. Initialize Dynamic UI Interactions (Accordion, Filters, Drawer, Form)
  initInteractions();

  console.log('%c✦ PRESTIGE PORTFOLIO INITIALIZED ✦', 'color: #ff4800; font-weight: bold; font-size: 14px;');
});

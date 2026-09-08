import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;

export function initSmoothScroll() {
  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    infinite: false,
  });

  // Synchronize Lenis with GSAP ScrollTrigger
  lenisInstance.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenisInstance.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Expose helper to jump or stop scroll
  window.lenis = lenisInstance;

  return lenisInstance;
}

export function stopScroll() {
  if (lenisInstance) lenisInstance.stop();
  document.documentElement.classList.add('is--scroll-locked');
}

export function startScroll() {
  if (lenisInstance) lenisInstance.start();
  document.documentElement.classList.remove('is--scroll-locked');
}

export function scrollToElement(target, options = {}) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      offset: options.offset || 0,
      duration: options.duration || 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}

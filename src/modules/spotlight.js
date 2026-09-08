import { gsap } from 'gsap';

export function initUltravioletSpotlight() {
  const root = document.querySelector('.footer-flashlight-container');
  if (!root) return;

  const duplicate = root.querySelector('.footer-layer--duplicate');
  if (!duplicate) return;

  // High-performance GSAP quickTo for smooth inertial mouse tracking
  const xTo = gsap.quickTo(duplicate, '--xpercent', {
    duration: 0.35,
    ease: 'power2.out',
  });

  const yTo = gsap.quickTo(duplicate, '--ypercent', {
    duration: 0.35,
    ease: 'power2.out',
  });

  root.addEventListener('mousemove', (e) => {
    const bound = root.getBoundingClientRect();
    const xPct = gsap.utils.mapRange(bound.left, bound.right, 0, 100, e.clientX);
    const yPct = gsap.utils.mapRange(bound.top, bound.bottom, 0, 100, e.clientY);

    xTo(`${xPct}%`);
    yTo(`${yPct}%`);
  });

  // Default center position on mouseleave
  root.addEventListener('mouseleave', () => {
    xTo('50%');
    yTo('50%');
  });
}

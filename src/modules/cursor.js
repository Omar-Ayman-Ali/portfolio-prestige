import { gsap } from 'gsap';

export function initCustomCursor() {
  // Only enable on pointer fine / hover devices
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.cursor-follower');
  if (!cursor || !follower) return;

  const cursorX = gsap.quickTo(cursor, 'x', { duration: 0.1, ease: 'power2.out' });
  const cursorY = gsap.quickTo(cursor, 'y', { duration: 0.1, ease: 'power2.out' });

  const followerX = gsap.quickTo(follower, 'x', { duration: 0.35, ease: 'power3.out' });
  const followerY = gsap.quickTo(follower, 'y', { duration: 0.35, ease: 'power3.out' });

  window.addEventListener('mousemove', (e) => {
    cursorX(e.clientX);
    cursorY(e.clientY);
    followerX(e.clientX);
    followerY(e.clientY);
  });

  // Hover target interactions & magnetic effect
  const interactiveElements = document.querySelectorAll(
    'a, button, input, .work-card, .service-header, .process-card, [data-cursor-hover]'
  );

  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('is-hovering');
      follower.classList.add('is-hovering');
    });

    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-hovering');
      follower.classList.remove('is-hovering');
      gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: 'power2.out' });
    });

    // Magnetic attraction for specific buttons
    if (el.classList.contains('btn') || el.classList.contains('filter-btn') || el.classList.contains('audio-toggle')) {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const pullStrength = 0.25;
        const x = (e.clientX - (rect.left + rect.width / 2)) * pullStrength;
        const y = (e.clientY - (rect.top + rect.height / 2)) * pullStrength;

        gsap.to(el, { x, y, duration: 0.2, ease: 'power1.out' });
      });
    }
  });

  // Click pulse
  window.addEventListener('mousedown', () => {
    gsap.to(cursor, { scale: 0.7, duration: 0.1 });
    gsap.to(follower, { scale: 1.25, duration: 0.15 });
  });

  window.addEventListener('mouseup', () => {
    gsap.to(cursor, { scale: 1, duration: 0.2, ease: 'back.out(2)' });
    gsap.to(follower, { scale: 1, duration: 0.3, ease: 'power2.out' });
  });
}

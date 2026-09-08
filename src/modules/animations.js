import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  initPreloader();
  initNavbarScroll();
  initHeroAnimations();
  initManifestoAndStats();
  initProcessFanOutDeck();
}

/**
 * Preloader Sequence (00% -> 100% + Wordmark entrance)
 */
function initPreloader() {
  const preloader = document.querySelector('.preloader');
  const counter = document.querySelector('.preloader__counter');
  const progressBar = document.querySelector('.preloader__progress-bar');
  const wordmark = document.querySelector('.preloader__wordmark');

  if (!preloader || !counter || !progressBar) return;

  // Animate wordmark entrance
  setTimeout(() => {
    if (wordmark) wordmark.classList.add('is-active');
  }, 200);

  const countObj = { val: 0 };

  gsap.to(countObj, {
    val: 100,
    duration: 1.8,
    ease: 'power2.inOut',
    onUpdate: () => {
      const current = Math.floor(countObj.val);
      counter.textContent = current < 10 ? `0${current}%` : `${current}%`;
      progressBar.style.width = `${current}%`;
    },
    onComplete: () => {
      gsap.timeline()
        .to(wordmark, {
          scale: 1.08,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.in'
        })
        .to(preloader, {
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          onComplete: () => {
            preloader.classList.add('is-loaded');
            document.documentElement.classList.remove('is--scroll-locked');
            document.body.classList.remove('is--scroll-locked');
            triggerHeroEntrance();
          }
        }, '-=0.2');
    }
  });
}

/**
 * Hero Entrance and Text Scrub
 */
function triggerHeroEntrance() {
  const heroSentence = document.querySelector('.hero__sentence');
  if (heroSentence) {
    heroSentence.classList.add('is-revealed');
  }

  gsap.from('.hero__bottom > *', {
    opacity: 0,
    y: 35,
    duration: 1,
    stagger: 0.15,
    ease: 'power3.out',
    delay: 0.3
  });
}

function initHeroAnimations() {
  // Hero scrub effect on scroll
  gsap.to('.hero__sentence', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
    y: 80,
    opacity: 0.25,
    scale: 0.96,
  });
}

/**
 * Navbar Intelligent Hide/Show on Scroll
 */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastY = window.scrollY;
  const threshold = 10;
  const topZone = 60;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const delta = y - lastY;

    // Scrolled class for background blur
    if (y > 40) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }

    if (Math.abs(delta) < threshold) return;

    if (y <= topZone) {
      navbar.classList.remove('is--nav-hidden');
    } else if (delta > 0) {
      // Scrolling down
      navbar.classList.add('is--nav-hidden');
    } else {
      // Scrolling up
      navbar.classList.remove('is--nav-hidden');
    }

    lastY = y;
  }, { passive: true });
}

/**
 * Manifesto & Stats Counter
 */
function initManifestoAndStats() {
  // Section entrance
  gsap.from('.manifesto-text', {
    scrollTrigger: {
      trigger: '.manifesto-section',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
    y: 50,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out'
  });

  // Numbers counter
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach((stat) => {
    const targetVal = parseFloat(stat.dataset.target || 0);
    const suffix = stat.dataset.suffix || '';
    const obj = { val: 0 };

    ScrollTrigger.create({
      trigger: stat,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: targetVal,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            if (targetVal % 1 === 0) {
              stat.innerHTML = `${Math.floor(obj.val)}<span>${suffix}</span>`;
            } else {
              stat.innerHTML = `${obj.val.toFixed(1)}<span>${suffix}</span>`;
            }
          }
        });
      }
    });
  });
}

/**
 * Signature nbnzia Process Cards Fan-Out & Inertia Momentum Physics
 */
function initProcessFanOutDeck() {
  const root = document.querySelector('.process-section');
  if (!root) return;

  const cardWrappers = root.querySelectorAll('.process-card-wrapper');
  if (!cardWrappers.length) return;

  const mm = gsap.matchMedia();

  mm.add('(min-width: 992px)', () => {
    const angle = 6;
    const spread = 280;
    const lift = 35;
    const totalCards = cardWrappers.length - 1;
    const center = totalCards / 2;

    // Set Initial Fan-out Geometry
    cardWrappers.forEach((el, index) => {
      const dist = index - center;
      gsap.set(el, {
        rotation: angle * dist,
        x: spread * dist,
        y: lift * Math.pow(dist, 2),
      });
    });

    // Reveal Animation on ScrollTrigger
    const revealTween = gsap.from(cardWrappers, {
      rotation: 40,
      scale: 0.9,
      opacity: 0.5,
      stagger: 0.08,
      ease: 'elastic.out(1, 0.75)',
      duration: 1.4,
      scrollTrigger: {
        trigger: root,
        start: 'top 65%',
        toggleActions: 'play none none none',
      }
    });

    /* Momentum Cursor Physics */
    const hoverOk = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hoverOk) return;

    let prevX = 0, prevY = 0;
    let velX = 0, velY = 0;
    let rafId = null;

    const onMove = (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        velX = e.clientX - prevX;
        velY = e.clientY - prevY;
        prevX = e.clientX;
        prevY = e.clientY;
        rafId = null;
      });
    };

    root.addEventListener('mousemove', onMove);

    cardWrappers.forEach((el) => {
      const card = el.querySelector('.process-card');
      if (!card) return;

      el.addEventListener('mouseenter', (e) => {
        const rect = card.getBoundingClientRect();
        const offsetX = e.clientX - (rect.left + rect.width / 2);
        const offsetY = e.clientY - (rect.top + rect.height / 2);
        const torque = (offsetX * velY - offsetY * velX) * 0.05;

        gsap.to(card, {
          rotateZ: gsap.utils.clamp(-12, 12, torque),
          scale: 1.04,
          y: -15,
          duration: 0.4,
          ease: 'power2.out',
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateZ: 0,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)',
        });
      });
    });

    return () => {
      root.removeEventListener('mousemove', onMove);
    };
  });

  mm.add('(max-width: 991px)', () => {
    // Stagger in on mobile
    cardWrappers.forEach((el) => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        }
      });
    });
  });
}

import { gsap } from 'gsap';
import { scrollToElement } from './smoothScroll.js';
import { sound } from './audio.js';

export function initInteractions() {
  initNavAnchorScroll();
  initServicesAccordion();
  initWorkFilters();
  initProjectModal();
  initContactForm();
}

/**
 * Smooth Anchor Navigation
 */
function initNavAnchorScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        e.preventDefault();
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          scrollToElement(targetEl, { offset: -40 });
        }
      }
    });
  });
}

/**
 * Services Accordion & Hover Cursor Thumbnail
 */
function initServicesAccordion() {
  const items = document.querySelectorAll('.service-item');
  const preview = document.querySelector('.service-cursor-preview');
  const previewImg = preview ? preview.querySelector('img') : null;

  items.forEach((item) => {
    const header = item.querySelector('.service-header');
    const body = item.querySelector('.service-body');
    const imageSrc = item.dataset.preview;

    if (!header || !body) return;

    // Accordion Toggle
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all others
      items.forEach((other) => {
        if (other !== item && other.classList.contains('is-open')) {
          other.classList.remove('is-open');
          const otherBody = other.querySelector('.service-body');
          if (otherBody) otherBody.style.height = '0px';
        }
      });

      if (isOpen) {
        item.classList.remove('is-open');
        body.style.height = '0px';
      } else {
        item.classList.add('is-open');
        body.style.height = `${body.scrollHeight}px`;
        sound.playWhoosh();
      }
    });

    // Hover Cursor Image Follower
    if (preview && previewImg && imageSrc) {
      header.addEventListener('mouseenter', () => {
        previewImg.src = imageSrc;
        preview.classList.add('is-active');
      });

      header.addEventListener('mouseleave', () => {
        preview.classList.remove('is-active');
      });

      header.addEventListener('mousemove', (e) => {
        gsap.to(preview, {
          x: e.clientX + 30,
          y: e.clientY + 30,
          duration: 0.25,
          ease: 'power2.out',
        });
      });
    }
  });
}

/**
 * Filter Work / Case Studies
 */
function initWorkFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.work-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filter = btn.dataset.filter;

      sound.playTick(750);

      cards.forEach((card) => {
        const category = card.dataset.category || '';
        const shouldShow = filter === 'all' || category.includes(filter);

        if (shouldShow) {
          gsap.to(card, {
            scale: 1,
            opacity: 1,
            display: 'flex',
            duration: 0.4,
            ease: 'power2.out',
          });
        } else {
          gsap.to(card, {
            scale: 0.9,
            opacity: 0,
            display: 'none',
            duration: 0.3,
            ease: 'power2.in',
          });
        }
      });
    });
  });
}

/**
 * Case Study Detail Modal Drawer
 */
function initProjectModal() {
  const modal = document.querySelector('.modal-backdrop');
  const closeBtn = document.querySelector('.modal-close-btn');
  const cards = document.querySelectorAll('.work-card');

  if (!modal) return;

  const modalTitle = modal.querySelector('.modal-title');
  const modalDesc = modal.querySelector('.modal-desc');
  const modalClient = modal.querySelector('.modal-client');
  const modalDeliverable = modal.querySelector('.modal-deliverable');
  const modalTech = modal.querySelector('.modal-tech');
  const modalLiveBtn = modal.querySelector('.modal-live-link');

  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      // Don't open if clicked directly on external link
      if (e.target.closest('.work-card__link')) return;

      const title = card.querySelector('.work-card__title')?.textContent || 'Project Details';
      const desc = card.querySelector('.work-card__desc')?.textContent || '';
      const client = card.dataset.client || title;
      const deliverable = card.dataset.deliverable || 'Web Experience & GSAP Architecture';
      const tech = card.dataset.tech || 'Three.js, GSAP, Webflow, Lenis';
      const link = card.dataset.url || '#';

      if (modalTitle) modalTitle.textContent = title;
      if (modalDesc) modalDesc.textContent = desc;
      if (modalClient) modalClient.textContent = client;
      if (modalDeliverable) modalDeliverable.textContent = deliverable;
      if (modalTech) modalTech.textContent = tech;
      if (modalLiveBtn) modalLiveBtn.href = link;

      modal.classList.add('is-open');
      sound.playWhoosh();
    });
  });

  const closeModal = () => {
    modal.classList.remove('is-open');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

/**
 * Contact Form & Celebratory Emoji Rain
 */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  const statusMsg = document.querySelector('.form-status');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      const btnText = submitBtn.querySelector('.button-text');
      if (btnText) btnText.textContent = 'Transmitting...';
    }

    setTimeout(() => {
      if (statusMsg) {
        statusMsg.classList.add('is-visible');
      }

      sound.playChime();
      triggerEmojiRain();

      form.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        const btnText = submitBtn.querySelector('.button-text');
        if (btnText) btnText.textContent = 'Transmitted ✓';
      }
    }, 800);
  });
}

/**
 * Signature nbnzia Emoji Rain Burst Effect (🔥, ✨, ⚡, 🪄)
 */
function triggerEmojiRain() {
  const container = document.querySelector('.emoji-rain-container');
  if (!container) return;

  const emojis = ['🔥', '✨', '⚡', '🪄', '🖤', '✦'];
  const count = 45;

  for (let i = 0; i < count; i++) {
    const emojiEl = document.createElement('div');
    emojiEl.className = 'single-rain-emoji';
    emojiEl.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const left = Math.random() * 100;
    const scale = Math.random() * 0.8 + 0.5;
    const duration = Math.random() * 1.5 + 1.2;
    const delay = Math.random() * 0.5;
    const rotate = (Math.random() - 0.5) * 60;

    emojiEl.style.left = `${left}%`;

    container.appendChild(emojiEl);

    gsap.fromTo(
      emojiEl,
      {
        y: 0,
        opacity: 1,
        scale: scale,
        rotateZ: 0,
      },
      {
        y: -window.innerHeight * 1.2,
        opacity: 0,
        rotateZ: rotate,
        duration: duration,
        delay: delay,
        ease: 'power1.out',
        onComplete: () => {
          emojiEl.remove();
        },
      }
    );
  }
}

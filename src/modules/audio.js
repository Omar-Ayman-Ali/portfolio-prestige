/**
 * Zero-dependency Web Audio API Sound Synthesizer
 * Generates tactile micro-interaction sound effects and ambient tone
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isEnabled = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.init();
    this.isEnabled = !this.isEnabled;
    if (this.isEnabled) {
      this.playChime();
    }
    return this.isEnabled;
  }

  // Soft tactile tick
  playTick(freq = 800) {
    if (!this.isEnabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }

  // Deep resonant whoosh on accordion/drawer open
  playWhoosh() {
    if (!this.isEnabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch (e) {}
  }

  // Crystalline harmonic chime on form submission / prestige moment
  playChime() {
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major triad (C5, E5, G5, C6)
      notes.forEach((note, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, this.ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + idx * 0.06 + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.06);
        osc.stop(this.ctx.currentTime + idx * 0.06 + 0.8);
      });
    } catch (e) {}
  }
}

export const sound = new SoundEngine();

export function initAudioController() {
  const toggleBtn = document.querySelector('.audio-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const active = sound.toggle();
    toggleBtn.classList.toggle('is-playing', active);
    const label = toggleBtn.querySelector('.audio-label');
    if (label) {
      label.textContent = active ? 'SOUND ON' : 'SOUND OFF';
    }
  });

  // Attach subtle audio cues to interactive items
  const hoverSounds = document.querySelectorAll('.nav__link, .btn, .filter-btn, .service-header');
  hoverSounds.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      sound.playTick(600 + Math.random() * 200);
    });
  });
}

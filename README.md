# Portfolio Prestige (Interactive Portfolio Design Study)

**Live Demo:** [https://portfolio-prestige.vercel.app](https://portfolio-prestige.vercel.app)

A single-page creative-developer portfolio built with Vite, Three.js, GSAP, and Lenis to practice WebGL rendering and scroll-driven motion design.

![Language](https://img.shields.io/badge/Language-JavaScript_ES_Modules-F7DF1E?style=flat-square)
![Build](https://img.shields.io/badge/Build-Vite_5-646CFF?style=flat-square)
![3D](https://img.shields.io/badge/3D-Three.js_r170-black?style=flat-square)
![Animation](https://img.shields.io/badge/Animation-GSAP_3-88CE02?style=flat-square)
![Scroll](https://img.shields.io/badge/Scroll-Lenis-lightgrey?style=flat-square)
![Deployment](https://img.shields.io/badge/Deployment-Vercel-black?style=flat-square)

---

## Table of Contents
- [About](#about)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Run Locally](#run-locally)
- [Project Structure](#project-structure)

---

## About
This project is a **design and engineering study** that recreates the style of a high-end creative studio portfolio. The "NBNZIA" branding, contact email, and case-study entries are placeholder content modeled on an existing studio's portfolio, not the author's own brand or client work. The goal was to practice a WebGL hero scene, GSAP ScrollTrigger choreography, and pointer-driven micro-interactions in a framework-free codebase.

---

## Architecture

### Module Layout
The site is a single static `index.html` with one module entry point, `src/main.js`. On `DOMContentLoaded`, it initializes seven independent modules in a fixed order:

1. `smoothScroll.js`: creates the **Lenis** instance and drives it from the GSAP ticker, so smooth scrolling and ScrollTrigger share one animation clock.
2. `webglScene.js`: renders the fixed-position **Three.js** background scene.
3. `animations.js`: runs the preloader, hero entrance, navbar state, stat counters, and the process-card fan-out.
4. `cursor.js`: custom cursor and magnetic buttons.
5. `audio.js`: Web Audio sound effects.
6. `spotlight.js`: the footer spotlight mask.
7. `interactions.js`: anchor navigation, services accordion, work filters, case-study modal, and contact form.

Modules share no state except the exported `sound` engine from `audio.js`, which `interactions.js` imports to play cues.

### Rendering
The WebGL scene is built from Three.js primitives (icosahedron shell, wireframe cage, emissive octahedron core, two torus rings, and a 750-point particle field). There are no external models or textures. Rotation follows elapsed time, mouse position is smoothed with linear interpolation, and the group moves down as the page scrolls. The render loop skips drawing while the tab is hidden, and the device pixel ratio is capped at 2.

### Responsive Behavior
`gsap.matchMedia()` switches the process section between a fanned card deck at widths of 992px and above, and a simple staggered reveal below that. The custom cursor and hover physics only activate on devices matching `(hover: hover) and (pointer: fine)`.

### Styling
CSS is split into `variables.css` (design tokens), `reset.css`, `main.css` (layout and sections), and `components.css` (UI components), all imported through `main.css`. Fonts are loaded from **Google Fonts** (Syne, Plus Jakarta Sans, Space Mono).

### Deployment
Vercel runs `vite build` and serves the `dist/` output. `vercel.json` rewrites every path to `index.html`.

### Known Limitations
- The **contact form has no backend**. Submitting it shows a success state after an 800 ms timeout and sends no data.
- There is no `prefers-reduced-motion` handling. All animations run for every visitor.
- The Lenis stylesheet is loaded from jsDelivr pinned to `1.2.3`, while npm resolves a newer `1.x` version for the script.
- The production JavaScript bundle is about 626 kB (176 kB gzipped), mostly Three.js, and Vite reports a chunk-size warning.

---

## Features
- **WebGL Hero Scene**: A procedurally built Three.js object with lighting, particles, mouse parallax, and scroll offset.
- **Smooth Scrolling**: Lenis inertial scrolling synchronized with GSAP ScrollTrigger.
- **Preloader**: A 0 to 100 percent counter and progress bar that unlocks scrolling and triggers the hero entrance.
- **Scroll Animations**: ScrollTrigger reveals and animated stat counters that run once on entry.
- **Process Card Deck**: A fanned card layout where hover tilt is based on cursor velocity.
- **Custom Cursor**: A two-part cursor with hover states, click feedback, and magnetic buttons.
- **Synthesized Sound**: Optional click and hover sounds generated with the Web Audio API, with no audio files.
- **Work Filters and Modal**: Category filters for case-study cards and a detail modal that closes on backdrop click or Escape.
- **Footer Spotlight**: A cursor-following mask that reveals a duplicate footer layer.

---

## Tech Stack
- **Languages**: JavaScript (ES modules), HTML, CSS
- **Build Tool**: Vite 5
- **Libraries**: Three.js 0.170, GSAP 3 with ScrollTrigger, Lenis 1
- **Browser APIs**: WebGL, Web Audio API, `matchMedia`
- **Styling**: Plain CSS with custom properties, Google Fonts
- **Deployment**: Vercel

---

## Run Locally

### Prerequisites
- **Node.js** 18, or 20 and later (required by Vite 5)
- npm (bundled with Node.js)

### Installation
```bash
git clone https://github.com/Omar-Ayman-Ali/portfolio-prestige.git
cd portfolio-prestige
npm install
```

### Execution
Start the development server:
```bash
npm run dev
```

The site is served at `http://localhost:3000`. The dev server binds to `0.0.0.0`, so it is also reachable from other devices on the same network.

Build and preview the production bundle:
```bash
npm run build
npm run preview
```

---

## Project Structure
```text
.
├── src/
│   ├── modules/
│   │   ├── animations.js     # Preloader, hero, stats, and process deck (GSAP)
│   │   ├── audio.js          # Web Audio sound engine and toggle
│   │   ├── cursor.js         # Custom cursor and magnetic buttons
│   │   ├── interactions.js   # Nav, accordion, filters, modal, contact form
│   │   ├── smoothScroll.js   # Lenis setup and scroll helpers
│   │   ├── spotlight.js      # Footer spotlight mask
│   │   └── webglScene.js     # Three.js background scene
│   ├── styles/
│   │   ├── components.css    # UI component styles
│   │   ├── main.css          # Layout, sections, and stylesheet imports
│   │   ├── reset.css         # CSS reset
│   │   └── variables.css     # Design tokens
│   └── main.js               # Entry point and module initialization
├── index.html                # Page markup and content
├── package.json              # Dependencies and scripts
├── package-lock.json         # Locked dependency versions
├── vercel.json               # Vercel rewrite rules
└── vite.config.js            # Dev server and build configuration
```

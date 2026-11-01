# dump — Creative Direction & Athletic Production

A high-fidelity layout, animation, and WebGL interaction engineering study inspired by [Podium](https://podium.global/), built with Next.js App Router, Tailwind CSS, GSAP, and Three.js.

**Live Deployment**: [https://dump-pied.vercel.app](https://dump-pied.vercel.app)

> **Disclaimer**: This codebase is an independent UI/UX layout, typography, and interaction engineering study created with 100% placeholder content (brand name `dump`, invented clients, invented athletes, placeholder imagery/video streams, and mock contact addresses/emails). It is not affiliated with, sponsored by, endorsed by, or copied from the original entity.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, TypeScript, React 19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with fluid typography and responsive design tokens
- **Typography**: Next.js Google Fonts (`Jost` replacing Futura, `Barlow Condensed` replacing Univers)
- **Smooth Scroll**: [Lenis](https://github.com/darkroomengineering/lenis) synchronised with GSAP ScrollTrigger on a single requestAnimationFrame ticker
- **Animations & Scrubbing**: [GSAP](https://greensock.com/gsap/) with [ScrollTrigger](https://greensock.com/scrolltrigger/)
- **WebGL 3D Layer**: [Three.js](https://threejs.org/) (procedural low-poly displaced rock podium, unfolding mosaic scroll track, and interactive 3D dotted Fibonacci globe with touch/mouse inertia)
- **Carousel**: [Embla Carousel](https://www.embla-carousel.com/) (free-drag continuous loop with progress bar and 3D card flip)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (preloader load sync, view toggle, mobile menu, contact modal)

---

## 🚀 Getting Started & Run Steps

### Prerequisites
- Node.js 18+ (tested on Node.js 20 & 22+)
- npm

### 1. Clean Install
```bash
npm ci
```

### 2. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build & Start
```bash
npm run build
npm run start
```

### 4. Code Quality & Linting
```bash
npm run lint
```

---

## 📷 Media & Image Credits

All image assets used in this project are authentic documentary sports and film production photographs licensed under permissive free-to-use licenses (Creative Commons, Public Domain, Pexels License) or generated originally with custom photographic prompts. None of the images are sourced from `podium.global` or any commercial studio site.

For a full breakdown of every image asset, creator, source URL, and license, see the comprehensive [Image Credits Documentation](/public/images/CREDITS.md).

---

## 📐 Key Architecture & Interactions

1. **Preloader**: Fullscreen curtain with centered indicator circle and 0–100% counter lerped via requestAnimationFrame (0.06 factor). Respects `prefers-reduced-motion`.
2. **Fixed Reactive Header**: Transitions dynamically between dark and light color tokens across section boundaries (`#hero`, `#work`, `#about`, `#worldwide`) via GSAP ScrollTrigger.
3. **Hero & WebGL Mosaic**: Procedural rock-podium geometry displaced via custom normal shaders, smoothly interpolating to an unfolding 12-plane mosaic scroll track over `300svh`.
4. **Work Grid & View Toggle**: Responsive columns (4 desktop / 3 tablet / 1 mobile) with per-column parallax drift, cursor spotlight halo, and hover video previews. Fixed floating pill toggles between grid layout and full-screen project list index with dashed pixel dividers.
5. **Behind the Scenes**: Drag-free Embla carousel with live scroll progress indicator, subtle image parallax, and 3D card flip on desktop.
6. **What We Do**: Three discipline containers (Services, Clients, Athletes) with corner registration dots and scrubbed rotation (-6° to 0°).
7. **Interactive 3D Globe**: Fibonacci-distributed 1,400-point dot sphere with touch/mouse drag rotation, momentum decay damping, and fallback to CSS gradient on low-end devices or reduced motion.
8. **Contact Modal & Mobile Menu**: Accessible dialogs featuring focus trapping, Escape key closing, visible focus indicators, and clipboard email copying with reactive status feedback.

# dump — Creative Direction & Athletic Production

`dump` is a UI/UX study of podium.global rebuilt as a front-end learning project, with placeholder content and no assets taken from the original. It explores advanced creative development patterns on the modern web—including synchronized WebGL 3D scenes, fluid responsive typography, momentum scrolling with Lenis and GSAP ScrollTrigger, and accessible interactive UI components.

## 🔗 Live Demo

Live Deployment: [https://dump-pied.vercel.app](https://dump-pied.vercel.app)

## 🏗 What I Built

A single-page athletic production studio website with dynamic project subpages and rich creative interactions:

- **Fullscreen Preloader**: Smooth 0–100% progress counter driven by ProgressiveFluxLoader with animated progress tracks, stage labels, and respect for `prefers-reduced-motion`.
- **Fixed Reactive Navigation**: Header dynamically transitioning its color between dark and light tokens across section boundaries (`#hero`, `#work`, `#about`, `#worldwide`) via GSAP ScrollTrigger.
- **Hero & 3D WebGL Canvas**: Procedural rock-podium geometry rendered with translucent ruby glass and custom Fresnel rim lighting, smoothly translating into an unfolding 12-plane image mosaic scroll track over `300svh`.
- **Work Grid & Dynamic Project Routing**: Multi-column responsive work grid (4 desktop / 3 tablet / 1 mobile) with parallax card drift, hover video previews, and dedicated dynamic project pages (`/projects/[slug]`).
- **Interactive View Toggle**: Floating toggle pill switching between visual grid layout and an editorial project list index with dashed pixel dividers and hover video preview.
- **Behind the Scenes Carousel**: Continuous drag-free Embla carousel featuring progress indicator, hover video playback, and 3D card flip on desktop.
- **What We Do Interactive Cards**: Discipline containers (Services, Clients, Athletes) with corner registration marks and scrubbed rotation animation.
- **Interactive 3D Globe**: Dot-based Fibonacci sphere with interactive touch/mouse drag inertia, momentum decay, and fallback to CSS gradient on low-end devices or reduced motion.
- **Accessible Contact Modal & Mobile Menu**: Modal dialogs with keyboard focus trapping, Escape key closing, visible focus states, and one-click copy-to-clipboard email functionality.

## 🛠 Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, TypeScript, React 19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with fluid typography and responsive design tokens
- **Typography**: Next.js Google Fonts (`Jost` replacing Futura, `Barlow Condensed` replacing Univers)
- **Smooth Scroll**: [Lenis](https://github.com/darkroomengineering/lenis) synchronised with GSAP ScrollTrigger on a single requestAnimationFrame ticker
- **Animations & Scrubbing**: [GSAP](https://greensock.com/gsap/) with [ScrollTrigger](https://greensock.com/scrolltrigger/)
- **WebGL 3D Layer**: [Three.js](https://threejs.org/) (procedural low-poly displaced rock podium, unfolding mosaic scroll track, and interactive 3D dotted Fibonacci globe with touch/mouse inertia)
- **Carousel**: [Embla Carousel](https://www.embla-carousel.com/) (free-drag continuous loop with progress bar and 3D card flip)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (preloader load sync, view toggle, mobile menu, contact modal)

## 💡 What I Learned

- **Scroll & WebGL Synchronization**: Coordinating continuous virtual scrolling via Lenis with Three.js rendering loops and GSAP ScrollTrigger timelines on a single unified requestAnimationFrame ticker without frame drops or jitter.
- **Advanced Three.js Shader Modification**: Customizing `MeshPhysicalMaterial` via `onBeforeCompile` to inject Fresnel rim glow and tuning procedural environment maps (PMREMGenerator with RoomEnvironment) for realistic translucent ruby glass.
- **Responsive Fluid Design Tokens**: Translating complex editorial designs into scalable CSS custom properties using `clamp()` and viewport units without sacrificing typographical clarity across mobile (390px), tablet (768px), and desktop displays (1440px+).
- **Accessibility in Creative Web**: Ensuring heavily animated, WebGL-driven sites remain fully accessible by supporting `prefers-reduced-motion`, ARIA dialog patterns, keyboard focus traps, visible focus rings, and proper color contrast ratios.

## 🔀 Differences from the Original

- **Simplified Self-Written WebGL**: Rather than relying on proprietary 3D models and proprietary shaders, the WebGL layer uses custom procedural low-poly geometry with displacement shaders, a procedural room environment, and a mathematical Fibonacci point-cloud globe.
- **Free Substitute Fonts**: Replaced commercial fonts Futura and Univers Condensed with open Google Fonts `Jost` and `Barlow Condensed`, calibrated with matched tracking, line heights, and optical sizing.
- **Custom Ruby-Colored Hero Rock**: The hero rock-podium is customized with a deep translucent ruby glass material featuring refraction, thickness attenuation, and crystal-like Fresnel facet glints instead of the original neutral grey stone.
- **100% Free / Independent Assets**: All photographs and video clips are sourced under free-to-use licenses (Creative Commons, Public Domain, Pexels) or custom photographic prompts, with zero assets taken from `podium.global`.

## 💻 Run Locally

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

## 📄 License

The code is MIT-licensed (see [LICENSE](LICENSE)). Photos and videos keep their own licenses, as listed in [public/images/CREDITS.md](public/images/CREDITS.md).

## 📷 Credits

- **Inspiration**: Visual and interaction design study inspired by [Podium](https://podium.global/).
- **Media & Assets**: Authentic documentary sports and production photographs and video clips licensed under Creative Commons, Public Domain, and Pexels License. Full asset-by-asset attributions, creators, and source links are documented in [public/images/CREDITS.md](public/images/CREDITS.md).

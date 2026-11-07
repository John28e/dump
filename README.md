# identity — Brand & Website Studio for Startups

`identity` is a creative development and design engineering study rebuilt as a front-end learning project, with placeholder content and no assets taken from any third-party source. It explores advanced creative development patterns on the modern web—including synchronized WebGL 3D scenes, fluid responsive typography, momentum scrolling with Lenis and GSAP ScrollTrigger, and accessible interactive UI components.

## 🔗 Live Demo

Live Deployment: [https://studio-identity.vercel.app](https://studio-identity.vercel.app)

## 🏗 What I Built

A brand identity and web design studio website for early-stage startups with dynamic project subpages and rich creative interactions:

- **Fullscreen Preloader**: Smooth 0–100% progress counter driven by ProgressiveFluxLoader with animated progress tracks, stage labels (discover, design, develop, deploy), and respect for `prefers-reduced-motion`.
- **Fixed Reactive Navigation**: Header dynamically transitioning its color between dark and light tokens over section boundaries (`#hero`, `#work`, `#about`, `#worldwide`) via GSAP ScrollTrigger.
- **Hero & 3D WebGL Canvas**: Procedural rock geometry rendered with translucent ruby glass and custom Fresnel rim lighting, smoothly translating into an unfolding 12-plane image mosaic scroll track over `300svh`.
- **Work Grid & Dynamic Project Routing**: Multi-column responsive work grid (4 desktop / 3 tablet / 1 mobile) with parallax card drift, hover video previews, and dedicated dynamic project pages (`/projects/[slug]`).
- **Interactive View Toggle**: Floating toggle pill switching between visual grid layout and an editorial project list index with dashed pixel dividers and hover video preview.
- **Behind the Scenes Carousel**: Continuous drag-free Embla carousel featuring progress indicator, hover video playback, and 3D card flip on desktop.
- **What We Do Interactive Cards**: Discipline containers (Services, Clients, Sectors) with corner registration marks and scrubbed rotation animation.
- **Interactive 3D Globe**: Dot-based Fibonacci sphere with interactive touch/mouse drag inertia, momentum decay, and fallback to CSS gradient on low-end devices or reduced motion.
- **Accessible Contact Modal & Mobile Menu**: Modal dialogs with keyboard focus trapping, Escape key closing, visible focus states, and one-click copy-to-clipboard email functionality.

## 🛠 Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, TypeScript, React 19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with fluid typography and responsive design tokens
- **Typography**: Next.js Google Fonts (`Jost` replacing Futura, `Barlow Condensed` replacing Univers)
- **Smooth Scroll**: [Lenis](https://github.com/darkroomengineering/lenis) synchronised with GSAP ScrollTrigger on a single requestAnimationFrame ticker
- **Animations & Scrubbing**: [GSAP](https://greensock.com/gsap/) with [ScrollTrigger](https://greensock.com/scrolltrigger/)
- **WebGL 3D Layer**: [Three.js](https://threejs.org/) (procedural low-poly displaced rock geometry, unfolding mosaic scroll track, and interactive 3D dotted Fibonacci globe with touch/mouse inertia)
- **Carousel**: [Embla Carousel](https://www.embla-carousel.com/) (free-drag continuous loop with progress bar and 3D card flip)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (preloader load sync, view toggle, mobile menu, contact modal)

## 💡 What I Learned

- **Scroll & WebGL Synchronization**: Coordinating continuous virtual scrolling via Lenis with Three.js rendering loops and GSAP ScrollTrigger timelines on a single unified requestAnimationFrame ticker without frame drops or jitter.
- **Advanced Three.js Shader Modification**: Customizing `MeshPhysicalMaterial` via `onBeforeCompile` to inject Fresnel rim glow and tuning procedural environment maps (PMREMGenerator with RoomEnvironment) for realistic translucent ruby glass.
- **Responsive Fluid Design Tokens**: Translating complex editorial designs into scalable CSS custom properties using `clamp()` and viewport units without sacrificing typographical clarity on mobile (390px), tablet (768px), and desktop displays (1440px+).
- **Accessibility in Creative Web**: Ensuring heavily animated, WebGL-driven sites remain fully accessible by supporting `prefers-reduced-motion`, ARIA dialog patterns, keyboard focus traps, visible focus rings, and proper color contrast ratios.

## 🔀 Differences from the Original

- **Simplified Self-Written WebGL**: Rather than relying on proprietary 3D models and proprietary shaders, the WebGL layer uses custom procedural low-poly geometry with displacement shaders, a procedural room environment, and a mathematical Fibonacci point-cloud globe.
- **Free Substitute Fonts**: Replaced commercial fonts Futura and Univers Condensed with open Google Fonts `Jost` and `Barlow Condensed`, calibrated with matched tracking, line heights, and optical sizing.
- **Custom Ruby-Colored Hero Rock**: The hero rock is customized with a deep translucent ruby glass material featuring refraction, thickness attenuation, and crystal-like Fresnel facet glints instead of the original neutral grey stone.
- **100% Free / Independent Assets**: All photographs and video clips are sourced under free-to-use licenses (Creative Commons, Public Domain, Pexels) or custom photographic compositions.

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

## 📬 Contact Form

The site includes an interactive contact form embedded inside the Contact pop-up dialog:

- **Serverless Submissions**: Submissions are routed directly from the browser to Web3Forms (`https://api.web3forms.com/submit`) via client-side `fetch()`, requiring no dedicated backend server or API route. Submissions land directly in the owner's inbox.
- **Environment Configuration**: Configured with the public environment variable `NEXT_PUBLIC_WEB3FORMS_KEY`. Set this key in `.env.local` for local development or in Vercel project environment variables (Production & Preview) for deployed environments. When the key is omitted, the form automatically runs in demo mode with an informational banner without breaking the UI.
- **Email Content & Structure**:
  - **Subject Line**: `New message from <name> - <project type>` (newlines stripped, max 100 characters, with name truncated first if needed).
  - **Sender Label**: `identity contact form`.
  - **Direct Reply-To**: Routed directly to the visitor's email for single-click replies.
  - **Clean Display Fields (in order)**:
    1. `Name` — visitor's full name.
    2. `Email` — visitor's contact email.
    3. `Company` — company name (omitted entirely from email when empty).
    4. `Project type` — selected requirement chip (`Brand identity`, `Website`, `Brand and website`, or `Something else`).
    5. `Message` — multi-line message (normalized line endings, three or more blank lines collapsed to one, 2000-character limit, line breaks preserved).
    6. `Sent from` — canonical site URL (`https://studio-identity.vercel.app`).
    7. `Sent at` — timestamp formatted in `Asia/Kolkata` time zone (e.g. `07 Nov 2026, 17:18 IST`).
- **Template Choice**: Uses Web3Forms' built-in minimal single-column tabular template. This single-column layout provides clear label-to-value hierarchy, a roomy message area, zero extraneous graphics, excellent readability in Gmail and mobile mail apps, and clean rendering across light and dark modes.
- **Client Protections**: To safeguard the owner's inbox against spam and automated abuse, the client enforces:
  - **Honeypot Trap**: A hidden `botcheck` input field caught and rejected if populated, and sent as `botcheck: ""` to the endpoint (never shown in email fields).
  - **Submission Duration Check**: Rejects submissions completed in under 3 seconds to deter fast headless scripts.
  - **Submission Cooldown**: A client-side 60-second cooldown between consecutive submissions.
  - **Session Limits**: A hard limit of at most 3 submissions per browser session.
  - **Input Sanitization**: Single-line sanitization on header fields to prevent injection.
- **Changing Delivery & Template Options**: See [docs/email-template-setup.md](docs/email-template-setup.md) for full details on field customization, dashboard key management, and Free vs. Pro tier capabilities.

## 📄 License

The code is MIT-licensed (see [LICENSE](LICENSE)). Photos and videos keep their own licenses, as listed in [public/images/CREDITS.md](public/images/CREDITS.md).

## 📷 Credits

- **Concept & Notice**: Concept study project. All client and project names are fictional.
- **Media & Assets**: High-resolution studio, tech, and design photographs and video clips licensed under Creative Commons, Public Domain, and Pexels License. Full asset-by-asset attributions, creators, and source links are documented in [public/images/CREDITS.md](public/images/CREDITS.md).

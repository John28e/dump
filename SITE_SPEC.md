# UI/UX Specification: Podium Global (https://podium.global/)

> **Document Version:** 1.0.0  
> **Target Production Site:** [https://podium.global/](https://podium.global/)  
> **Screenshots Stored At:** `spec-screenshots/` (relative to workspace root)  
> **Inspection Viewports:** 1440×900px (Desktop), 768×1024px (Tablet), 390×844px (Mobile)

---

## 1. Executive Summary & Tech Stack Architecture

Podium Global is a high-craft athletic creative production and direction studio website. It employs a responsive, fluid design philosophy based on a 1512px viewport reference grid (`calc(100vw / 151.2 * <units>)`), brutalist-modernist typography, WebGL 3D scenes (Three.js), seamless smooth-scrolling (Lenis), and timeline-driven animations (GSAP + ScrollTrigger).

### Core Libraries & Technologies Detected
- **Application Framework:** Next.js 15 (Turbopack, App Router, React 19)
- **Animation Engine:** GreenSock Animation Platform (`gsap` core + `ScrollTrigger` + `useGSAP`)
- **Smooth Scroll Engine:** Lenis (`@studio-freight/lenis` / `react-lenis`)
- **3D / WebGL Graphics:** Three.js (`three`, `@react-three/fiber`, `@react-three/drei` loading `/models/rockPodium.glb` and custom shader materials)
- **Carousel Engine:** Embla Carousel (`embla-carousel-react` with `dragFree: true, loop: true`)
- **Video Delivery:** Mux Video streaming CDN (`stream.mux.com`)
- **Styling Architecture:** Tailwind CSS v4-compatible token system with fluid vw-based scaling

---

## 2. Section Order & Purpose

| Order | Section Name | DOM / Component Identifier | Purpose |
|:---:|:---|:---|:---|
| **0** | **Preloader Curtain & Counter** | `.z-[10000].bg-white` (`PreloaderShell`) | Blocks view during asset loading; displays a live 0%→100% counter and centered black circle. Transitions out smoothly with GSAP once WebGL/assets are ready. |
| **1** | **Fixed Navigation Header** | `<header>` (`Header`) | Persistent top navigation bar displaying the SVG wordmark logo and navigation items ("Work", "About", "Contact" on desktop; "Menu" / "Close" trigger on mobile). Changes text color dynamically on scroll. |
| **2** | **Mobile Fullscreen Menu** | `#mobile-menu` | Fullscreen pure black overlay (`z-[100]`) accessible only on screens `< 768px`. Contains large typography navigation links and social media links. |
| **3** | **Interactive 3D Canvas** | `#global-canvas` | Fullscreen background WebGL canvas hosting the 3D rock podium model, dynamic 3D media mosaic, and the interactive 3D globe. |
| **4** | **Hero Overlay** | `<section>` (`HeroText`) | Fixed full-viewport statement overlay: *"We offer creative direction & production for athleticism."* and *"Scroll Down"* hint. Fades out on initial scroll. |
| **5** | **Hero & Mosaic Scroll Track** | `<section.h-svh>` + `h-[200svh]` | Scroll track that drives the 3D mosaic expansion and camera zoom in WebGL before pinning releases to the standard DOM page content. |
| **6** | **Floating View Toggle** | `<button>` (`aria-label="Open list view"`) | Fixed pill-button anchored at bottom center (`bottom: 24px`, `z-[70]`). Appears only while scrolling within the Work section to toggle between Grid View and List View. |
| **7** | **Project List View Overlay** | `.project-list-panel` | Fullscreen modal panel with smooth-scrolling project list (`ReactLenis`), interactive row dividers, and desktop hover poster preview. |
| **8** | **Work / Project Showcase Grid** | `<section>` (`#work`) | Showcase grid rendering project media cards with hover-activated video playback, custom cursor spotlight/halo, and title/client metadata. |
| **9** | **About Statement & Overline** | `<section>` (`#about`) | Editorial section opening with an uppercase category overline and a large justified studio mission statement. |
| **10** | **Behind the Scenes Carousel** | `.pt-ww-carousel-top` | Horizontal looping carousel (Embla) of cards with drag-free scrub, top progress indicator line, hover video playback, and 3D 180° flip interaction on click. |
| **11** | **What We Do (Service / Client / Athlete)** | `.whatwedo-box-p` | Structured brutalist boxes displaying studio services, client roster, and featured athlete names, highlighted by animated corner square dots (`data-dot`). |
| **12** | **Worldwide 3D Globe Section** | `<section.h-lvh>` | 100lvh interactive section with draggable 3D globe, studio philosophy text, and central closing CTA: *"Work with us"* (anchored to `#contact`). |
| **13** | **Footer Bottom Bar** | `<div.inset-x-0.bottom-0>` | Bottom credits bar with dotted divider line, copyright, one-click copyable email address (`CopyEmail`), and agency credit ("Website by San Rita"). |
| **14** | **Contact Card Modal ("Available Worldwide")** | `.z-[100].bg-black/30` (`ContactOverlay`) | 3D-perspective animated modal card featuring the `sign.svg` graphic, "Available worldwide" headline, Montreal physical address, social links, and email copy buttons. |

---

## 3. Responsive Layout per Section

The layout utilizes a 12-column grid (`--grid-cols: 12`) on desktop and tablet, and a 5-column or single-column layout on mobile. Spacing and dimensions are fluidly calculated via `calc(100vw / 151.2 * N)`.

### Breakpoint Matrix
- **Desktop:** $\ge 1280\text{px}$ (Reference tested at $1440\times900\text{px}$)
- **Tablet:** $768\text{px} - 1279\text{px}$ (Reference tested at $768\times1024\text{px}$)
- **Mobile:** $< 768\text{px}$ (Reference tested at $390\times844\text{px}$)

```
+---------------------------------------------------------------------------------------+
| SECTION LAYOUT COMPARISON                                                             |
+---------------------+-----------------------+--------------------+--------------------+
| Section             | Desktop (1440px)      | Tablet (768px)     | Mobile (390px)     |
+---------------------+-----------------------+--------------------+--------------------+
| Header              | Flex, p: 23.2px,      | Flex, p: 12.2px,   | Flex, p: 12px,     |
|                     | Logo + Nav links      | Logo + Nav links   | Logo + "Menu" btn  |
+---------------------+-----------------------+--------------------+--------------------+
| Hero Overlay        | 12-col grid-layout,   | 12-col grid-layout,| 5-col grid-layout, |
|                     | Text cols 1-6         | Text cols 1-8      | Text cols 1-4      |
+---------------------+-----------------------+--------------------+--------------------+
| Work Grid           | 4 columns,            | 3 columns,         | 1 column,          |
|                     | gap: 48px row / 23.4px| gap: 48px row /    | gap: 48px row /    |
|                     | col, parallax drift   | 12.2px col, drift  | 0 col, no drift    |
+---------------------+-----------------------+--------------------+--------------------+
| View Toggle Button  | Fixed bottom center,  | Fixed bottom center| Fixed bottom center|
|                     | 102x54px, z-70        | 102x54px, z-70     | 102x54px, z-70     |
+---------------------+-----------------------+--------------------+--------------------+
| List View Panel     | 12-col grid-layout,   | 12-col grid-layout,| 5-col grid-layout, |
|                     | List in cols 3-10     | List in cols 3-10  | List in cols 1-5   |
+---------------------+-----------------------+--------------------+--------------------+
| Behind the Scenes   | Horizontal carousel,  | Horizontal carousel| Horizontal carousel|
|                     | card: 400/527 aspect  | card: 400/527 asp  | card: 305/402 asp  |
+---------------------+-----------------------+--------------------+--------------------+
| What We Do Boxes    | 12-col grid: row 1 has| 12-col grid: row 1 | 5-col grid:        |
|                     | 2 boxes (w: 50%/50%), | has 2 boxes (50%), | All 3 boxes stacked|
|                     | row 2 has 1 full box  | row 2 full width   | vertically (100%)  |
+---------------------+-----------------------+--------------------+--------------------+
| Worldwide Section   | 100lvh, 3D Globe center| 100lvh, Globe center| 100lvh, Globe center|
|                     | Side texts col 1-2 &  | Side texts hidden  | Side texts hidden  |
|                     | col 11-12, CTA center | CTA center         | CTA center         |
+---------------------+-----------------------+--------------------+--------------------+
| Contact Modal Card  | Centered 3D card,     | Centered 3D card,  | Fullscreen/inset   |
|                     | 6-col grid, sign.svg  | 6-col grid,        | card, 5-col grid,  |
|                     | relative bottom-left  | sign.svg bottom-left| sign.svg top-left  |
+---------------------+-----------------------+--------------------+--------------------+
```

---

## 4. Typography Specifications

The design pairs **Futura** (geometric uppercase/title display) with **Univers Condensed** (technical labels, button micro-copy, and footnotes).

### Font Declarations (`@font-face`)
1. **Futura**
   - Book / Regular: `font-weight: 400`, `/fonts/futura-book.woff2`
   - Medium: `font-weight: 500`, `/fonts/futura-medium.woff2`
   - Bold: `font-weight: 700`, `/fonts/futura-bold.woff2`
2. **Univers Condensed**
   - Regular: `font-weight: 400`, `/fonts/univers-condensed.woff2`
   - Bold: `font-weight: 700`, `/fonts/univers-condensed-bold.woff2`

### Typography Scale & Hierarchy

| Utility Class | Family | Weight | Font Size (Desktop / Fluid) | Font Size (Tablet / Mobile) | Line Height | Letter Spacing | Case |
|:---|:---|:---:|:---|:---|:---:|:---:|:---:|
| `.text-display` | Futura | 700 | `7.40741vw` / `clamp(6.4rem, 4.71rem + 4.29vw, 11.2rem)` | `64px` – `75px` | `0.9` | `-0.0021em` | UPPER |
| `.text-heading-xl` | Futura | 700 | `4.2328vw` / `clamp(3.2rem, 2.08rem + 2.86vw, 6.4rem)` | `32px` – `48px` | `0.9` | normal | UPPER |
| `.text-heading-lg` | Futura | 700 | `1.5873vw` (`24px` @ 1512px) | `24px` | `1.0` | normal | UPPER |
| `.text-heading-md` | Futura | 700 | `1.32275vw` (`20px` @ 1512px) | `20px` | `1.0` | normal | UPPER |
| `.text-menu` | Futura | 700 | `1.32275vw` (`20px` @ 1512px) | `20px` (or `2.35vh` mobile) | `1.0` | `-0.03em` | UPPER |
| `.text-nav` | Futura | 700 | `0.925926vw` (`14px` @ 1512px) | `14px` | `1.0` | `-0.03em` | UPPER |
| `.text-footer-tagline` | Futura | 700 | `3.7037vw` / `clamp(3.2rem, 2.36rem + 2.14vw, 5.6rem)` | `32px` – `40px` | `1.0` | normal | UPPER |
| `.text-whatwedo-item`| Futura | 700 | `1.0582vw` (`16px` @ 1512px) | `16px` | `1.2` | normal | UPPER |
| `.text-body-md` | Futura | 400 | `1.0582vw` (`16px` @ 1512px) | `16px` | `1.5` | normal | None |
| `.text-body-card` | Futura | 400 | `0.925926vw` (`14px` @ 1512px) | `14px` | `1.4` | normal | None |
| `.text-body-sm` | Futura | 500 | `0.793651vw` (`12px` @ 1512px) | `12px` | `1.5` | normal | UPPER |
| `.text-button` | Univers Condensed | 700 | `1.0582vw` (`16px` @ 1512px) | `16px` | `1.2` | normal | UPPER |
| `.text-label` | Univers Condensed | 400 | `0.793651vw` (`12px` @ 1512px) | `12px` | `1.1` | normal | UPPER |
| `.text-footer-side` | Univers Condensed | 400 | `0.793651vw` (`12px` @ 1512px) | `12px` | `1.1` | normal | UPPER |

---

## 5. Color Palette & Token System

The design is built on a stark monochrome foundation with subtle off-white tones for section separation.

| Token Name | Hex Code / CSS Value | Description / Usage |
|:---|:---:|:---|
| `--color-black` | `#000000` | Pure Black: Page background, body text in white sections, mobile menu bg. |
| `--color-white` | `#ffffff` | Pure White: Preloader curtain, text in dark sections, contact card background. |
| `--color-whatwedo-service` | `#fdf7f7` | Very subtle warm off-white: Background for Services box. |
| `--color-whatwedo-client` | `#dddddd` | Light neutral gray: Background for Clients box. |
| `--color-whatwedo-athlete` | `#cacaca` | Medium light gray: Background for Athletes box. |
| `--color-neutral-900` | `#171717` | Very dark gray: Back face of Behind the Scenes flip cards. |
| `--color-gray-700` | `#364153` | Muted dark gray: Divider borders and secondary microcopy. |
| `--color-gray-400` | `#99a1af` | Neutral gray: Subtext, dates, secondary metadata. |
| `--color-gray-200` | `#e5e7eb` | Subtle borders, pixel dividers in list view. |
| Contact Backdrop | `rgba(0, 0, 0, 0.3)` | 30% black overlay behind the Contact Modal card. |

---

## 6. Spacing & Fluid Grid Tokens

Values are dynamically scaled using the 1512px design viewport formula: `calc(100vw / 151.2 * N)`.

| CSS Variable | Formula Unit ($N$) | Value @ 1440px | Value @ 768px | Value @ 390px | Description |
|:---|:---:|:---:|:---:|:---:|:---|
| `--spacing-grid-margin` | `2.4` | `23.21px` | `12.20px` | `12.00px` | Outer screen horizontal padding |
| `--spacing-grid-gutter` | `2.4` | `23.21px` | `12.20px` | `12.00px` | Horizontal column gap in grid layouts |
| `--spacing-section` | `12.8` | `123.87px` | `65.04px` | `60.00px` | Top/bottom padding for major sections |
| `--spacing-header-logo-w` | `22.0` | `214.86px` | `111.79px` | `110.00px` | SVG Logo width |
| `--spacing-header-nav-gap` | `3.2` | `30.95px` | `16.26px` | N/A | Gap between desktop navigation items |
| `--spacing-gap-xs` | `0.4` | `3.81px` | `2.03px` | `2.00px` | Micro gap |
| `--spacing-gap-sm` | `0.8` | `7.74px` | `4.07px` | `4.00px` | Small gap (e.g. card title to info) |
| `--spacing-gap-md` | `1.6` | `15.48px` | `8.13px` | `8.00px` | Medium gap |
| `--spacing-gap-lg` | `2.4` | `23.21px` | `12.20px` | `12.00px` | Large gap |
| `--spacing-gap-xl` | `4.8` | `46.45px` | `24.39px` | `24.00px` | Extra-large gap (grid row gap) |
| `--spacing-whatwedo-box-p`| `4.8` | `47.42px` | `24.39px` | `40.00px` | Internal padding of What We Do boxes |
| `--spacing-grid-drift` | `20.0` | `190.48px` | `101.59px` | `0px` | Max parallax displacement on columns |

### Border Radius
All containers, cards, and buttons use **`0px` border-radius** (sharp brutalist edges), with two intentional exceptions:
1. Centered preloader loading indicator: `rounded-full` ($2.38\text{vh}\times2.38\text{vh}$).
2. Floating View Toggle Button: Subtle rounded pill edges on outer bounding box ($54\text{px}$ high).

---

## 7. Navbar & Menu Behavior

### Header Navbar
- **Positioning:** `fixed top-0 left-0 right-0 z-50 bg-transparent p-grid-margin pt-header-pad-top`
- **Behavior on Scroll:** Stays persistently pinned to the top of the viewport (does **NOT** hide on scroll).
- **Dynamic Color Adaptation:** Driven by GSAP `ScrollTrigger` triggers linked to section positions:
  - Hero & Mosaic: `#000000` (Black)
  - Work Grid: Transitions to `#ffffff` (White)
  - About / Behind the Scenes / What We Do: Transitions to `#000000` (Black)
  - Worldwide / Globe: Transitions to `#ffffff` (White)
  - Contact Modal open: Forced to `#ffffff` or overlaid by modal
- **Logo Click:**
  - On Homepage: Calls Lenis `scrollTo(0)` to smoothly return to top.
  - If Mobile Menu is open: Closes menu first with a 350ms delay, then scrolls to top.

### Mobile Menu Overlay (`#mobile-menu`)
- **Activation:** Screens $< 768\text{px}$ (`md:hidden`). Triggered by the "Menu" / "Close" button.
- **Overlay Style:** `fixed inset-0 z-[100] bg-black text-white px-grid-margin flex flex-col items-end justify-center`
- **Animation:**
  - Transition: CSS `transition-opacity duration-300 ease-out`
  - Open: `opacity-100 pointer-events-auto`
  - Closed: `opacity-0 pointer-events-none`
- **Button Icon Animation:** Pixel-art SVG icon rotates from `rotate-0` to `-rotate-45` via `transition-transform duration-300 ease-out`.
- **Navigation Links Behavior:**
  - "Work": Smooth scrolls via Lenis to `#work` anchor and dismisses menu.
  - "About": Smooth scrolls via Lenis to `#about` anchor and dismisses menu.
  - "Contact": Triggers `useContactStore.getState().open()`, opening the Contact modal directly.
  - Bottom-right social links (Instagram, LinkedIn, Vimeo): Open in external tabs (`target="_blank"`).

---

## 8. Interactive Work Grid & 12 Project Handling

### Layout & Sizing
- **Card Media Aspect Ratio:** Strict `aspect-[348/259]` across all breakpoints.
- **Columns:**
  - Desktop ($\ge 1280\text{px}$): 4 columns (`min-[1280px]:grid-cols-4`, column gap `gap-x-grid-gutter`).
  - Tablet ($768\text{px}-1279\text{px}$): 3 columns (`min-[768px]:grid-cols-3`, column gap `gap-x-grid-gutter`).
  - Mobile ($< 768\text{px}$): 1 column (`grid-cols-1`, row gap `gap-gap-xl`).
- **Column Parallax Drift:**
  - Desktop: GSAP scrubbed column offsets based on `drifts4` array (`r % 4`).
  - Tablet: GSAP scrubbed column offsets based on `drifts3` array (`r % 3`).
  - Mobile: No parallax drift (`[0]`).
- **Live Site Item Count vs 12 Projects:**
  - On the live site at https://podium.global/, the work grid renders **8 active projects** (`homeProjectItems` array): Deviate (Puma), 80 Winters (Auclair), Milimani (Salomon), Not Quite Gone (Le Braquet), Western States (Salomon), Life Edition (Ciele), Summer Nights (Ciele), Jay Du Temple (Jay Du Temple).
  - All 8 projects use video streaming assets via Mux MP4 (`stream.mux.com/.../high.mp4#t=0.001`).
  - The grid template, modulo offsets (`r % 4` and `r % 3`), and layout seamlessly accommodate 12 items (or any multiple) without layout breaking.

### Work Card Interactions
- **Hover Scale:** `group-hover:scale-105` on the video/image element with CSS `transition-transform duration-700 ease-out`.
- **Spotlight / Halo Cursor Tracking:** Custom hook `e7({ radiusRatio: 0.7 })` creates an interactive radial illumination gradient following mouse coordinates within the card frame (`onMouseMove`, `onMouseEnter`, `onMouseLeave`).
- **Video Autoplay on Hover:** Handled via `CoverVideo`. On mouse enter, video plays (`video.play()`); on mouse leave, video pauses.
- **Card Click Morph Transition:** Clicking a card pauses Lenis smooth scroll, captures card viewport `getBoundingClientRect()` and video `currentTime`, and launches a full-viewport morph transition animation to `/projects/[slug]`.

---

## 9. Comprehensive Animation Registry

*Format: Element | Trigger | Type | Approximate Duration | Easing*

1. **Preloader Container:** Page Load | Counter Lerp & Opacity Fade Out | 0.40s | `power2.out`
2. **Preloader Counter Text:** Page Load | Dynamic rAF Text Interpolation (0%→100%) | ~1.50s - 2.50s | Asymptotic Ease ($0.06$ lerp)
3. **Hero Statement (`HeroText`):** Initial Scroll | Fixed Overlay Fade & PixelText Glitch Out | 0.40s | `power2.inOut`
4. **Hero 3D Rock & Mosaic:** Scroll Scrub | WebGL Camera Zoom & Mesh Unfold | Scroll-linked | Linear Scrub
5. **View Toggle Button (Appear):** Scroll Enter `#work` | GSAP `autoAlpha` Fade In | 0.30s | `power2.out`
6. **View Toggle Button (Disappear):** Scroll Leave `#work` | GSAP `autoAlpha` Fade Out | 0.22s | `power2.out`
7. **View Toggle Icon Squares:** Toggle Click | SVG Attribute Rect Morph & Stagger | 0.48s | `power3.inOut`
8. **View Toggle Text ("List" / "Grid"):** Toggle Click | ClipPath Y-Translate & Opacity Flip | 0.32s | `power3.inOut`
9. **Project List Panel:** Toggle Open | Overlay AutoAlpha + Container ScaleX & Slide | 0.58s | `power2.inOut`
10. **Project List Rows:** Toggle Open | Staggered Y-Percent Slide & Fade In | 0.46s | `power3.out`
11. **Project List Hover Poster:** Pointer Hover Row | Poster Frame Fade & Image Crossfade | 0.16s delay + 0.30s fade | `ease-out`
12. **Project Card Media (Grid):** Card Hover | Scale Transform ($1.00 \to 1.05$) | 0.70s | `ease-out`
13. **Project Card Spotlight Halo:** Card Pointer Move | Radial Highlight Position Lerp | Immediate rAF | Linear Follow
14. **Project Card Video:** Card Hover | Video Play / Pause | Immediate | None
15. **Project Grid Columns (4-col):** Scroll Scrub | Parallax Y-Offset per Column Modulo | Scroll-linked | Linear Scrub
16. **Behind the Scenes Carousel:** User Drag / Touch | Embla Drag-Free Inertial Looping Scroll | Inertial Decay | Fluid Spring
17. **Behind the Scenes Progress Bar:** Carousel Drag | TranslateX Bar Indicator ($-100\% \to 0\%$) | Continuous | Linear Sync
18. **Behind the Scenes Card Inner Image:** Carousel Drag | Parallax Interior Horizontal Translation | Continuous | Linear Sync
19. **Behind the Scenes Card Video:** Card Hover | MP4 Video Load & Play / Pause on Leave | Immediate | None
20. **Behind the Scenes Card Flip (Desktop):** Card Click | 3D Flip `rotateY(180deg)` with `translateZ(1px)` | 0.60s | `cubic-bezier(0.4, 0, 0.2, 1)`
21. **What We Do Box (Service/Client/Athlete):** Scroll Enter (top 90%→45%) | GSAP FromTo Opacity ($0\to1$) & Rotate ($-6^\circ\to0^\circ$) | Scroll-linked | Linear
22. **What We Do Corner Dots (`data-dot`):** Scroll Enter | Staggered Opacity Fade In | 0.15s stagger | Linear
23. **3D Interactive Globe:** User Pointer Drag | Pointer Capture Drag Rotation Delta Accumulation | Continuous Drag | Fluid Decay
24. **Closing CTA Link ("Work with us"):** Hover | Text Underline Accentuation | 0.20s | `ease`
25. **Header Color Switcher:** ScrollTrigger Boundaries | Text Color Hex Interpolation (Black $\leftrightarrow$ White) | Scroll-linked | Linear
26. **Mobile Menu Overlay:** Mobile Menu Click | Fullscreen Black Opacity Fade In/Out | 0.30s | `ease-out`
27. **Mobile Menu Button Icon:** Mobile Menu Click | SVG Pixel Icon Transform Rotate ($0^\circ \to -45^\circ$) | 0.30s | `ease-out`
28. **Contact Modal Backdrop (Desktop):** Click Contact Link | Black/30 Opacity Fade ($0\to1$) & Backdrop Blur ($0\to30\text{px}$) | 0.60s | `linear` + `none`
29. **Contact Modal Card (Desktop Open):** Click Contact Link | 3D Flip from Left (`rotateY: -60, x: -300, z: 300, scale: 0.5, skewX: -40`) to Center | 0.60s | `power3.out`
30. **Contact Modal Card (Desktop Close):** Click Close / Esc | 3D Flip to Right (`rotateY: 75, x: 300, z: 300, scale: 0.5, skewX: 30`) | 0.50s | `power2.in`
31. **Contact Modal Card (Mobile):** Click Contact Link | Opacity Fade In / Fade Out | 0.40s / 0.30s | `power2.out` / `power2.in`
32. **Contact Close Button:** Hover Enter / Leave | SVG Dashed Box Hover Play / Reverse | 0.30s | `power2.out`
33. **Email Button Copied State:** Click Email Button | Dual Span Opacity Swap (Text fades $1\to0$, "Copied" fades $0\to1$) | 0.20s fade, stays 800ms | `linear`

---

## 10. Specific Component & Interaction Analysis

### 1. View Toggle Icon ("Behind the Scenes" / Work Toggle)
- **Visuals:** Fixed centered pill ($102\times54\text{px}$) with an inner black background rectangle (`opacity: 0.9`, $98\times51\text{px}$), pixel SVG framing marks, and masked text labels.
- **States:**
  - Grid View Active: Icon displays four separated squares; label displays `"list"`.
  - List View Active: Icon squares morph into lines; label slides to `"grid"`.
- **Transition:** GSAP timeline ($0.48\text{s}$, `power3.inOut`) simultaneously morphs SVG rect coordinates via `eZ(t, n)` / `eW(e, t)` and translates title masks ($14\text{px}$ Y offset, $0.32\text{s}$).

### 2. Project List View Panel
- **Layout:** Replaces grid with an editorial typographic index.
  - Desktop: Spans columns 3 through 10 of the 12-column grid.
  - Tablet/Mobile: Full width.
- **Row Anatomy:** Project title, year, client, and animated dashed pixel dividers (`span[data-project-list-pixel]`, `span[data-project-list-line]`).
- **Interactive Hover:** On mouse hover over any project row, `project-list-hover-poster` loads and reveals the project thumbnail in the background (`col-start-4 col-span-6`) with a 160ms debounce.

### 3. "Copied" Feedback Interaction (`CopyEmail`)
- **Trigger:** Clicking any studio email address (e.g. `info@podium.global`, `general@podium.global`, `business@podium.global`).
- **Clipboard Action:** Invokes asynchronous `navigator.clipboard.writeText(email)`.
- **UI State Change:**
  - Original email text has `className="transition-opacity duration-200"` and style `opacity: +!copied` ($1 \to 0$).
  - Overlaid "Copied" badge has `className="absolute inset-0 text-left transition-opacity duration-200"` and style `opacity: +!!copied` ($0 \to 1$).
  - Resets automatically after exactly **800ms** (`setTimeout(() => setCopied(false), 800)`).

### 4. "Available Worldwide" Panel (Contact Card)
- **Structure:**
  - Modal container: `fixed inset-0 z-[100] bg-black/30 backdrop-blur-[30px] flex items-center justify-center p-[12px]`.
  - Perspective wrapper: `perspective: 800px, transformStyle: preserve-3d`.
  - Card: `bg-white text-black relative w-full md:contact-card-w md:contact-card-min-h`.
- **Contents:**
  1. Headline: `Available <br/> worldwide` in `.text-heading-xl` ($4.23\text{vw}$ / $32-64\text{px}$).
  2. Graphic: `/images/sign.svg` ($80\times122\text{px}$) — a brutalist architectural signpost graphic. Positioned top-left on mobile ($45\text{px}$ wide) and bottom-left in column 1-2 on desktop.
  3. Address: Montreal studio physical address formatted with bold uppercase headings.
  4. Social Links: Instagram, LinkedIn, Vimeo in `.text-heading-md`.
  5. Email Buttons: Interactive `CopyEmail` buttons for General Inquiries and New Business.
  6. Close Trigger: Top-right SVG button with dashed animated border. Also closes on backdrop click and `Escape` keypress.

---

## 11. Screenshots Index

All screenshots have been verified and saved into the project directory under `spec-screenshots/`:

| Filename | Viewport | Section / State Recorded |
|:---|:---:|:---|
| `1440_preloader.png` | 1440×900 | Preloader active at ~39% with centered circle and top-right counter |
| `1440_hero.png` | 1440×900 | Hero statement text overlay + fixed navbar |
| `1440_mosaic.png` | 1440×900 | 3D WebGL media mosaic unfolding on scroll |
| `1440_work_grid.png` | 1440×900 | 4-column project showcase grid with aspect 348/259 cards |
| `1440_work_hover.png` | 1440×900 | Project card hover state (scale 1.05 + video autoplay + spotlight halo) |
| `1440_work_list_view.png` | 1440×900 | Fullscreen Project List View opened via toggle button |
| `1440_work_list_hover.png` | 1440×900 | List view row hovered with background poster revealed |
| `1440_behind_the_scenes.png` | 1440×900 | Behind the scenes horizontal card carousel with top progress bar |
| `1440_what_we_do.png` | 1440×900 | What We Do boxed layout (Services, Clients, Athletes) with corner dots |
| `1440_worldwide_globe.png` | 1440×900 | Interactive 3D globe with "Work with us" closing CTA and footer bar |
| `1440_contact_modal.png` | 1440×900 | Contact modal card ("Available worldwide" + sign.svg + address) |
| `1440_email_copied.png` | 1440×900 | Email address showing live "Copied" feedback state |
| `768_preloader.png` | 768×1024 | Tablet preloader state |
| `768_hero.png` | 768×1024 | Tablet hero statement layout |
| `768_mosaic.png` | 768×1024 | Tablet 3D mosaic expansion |
| `768_work_grid.png` | 768×1024 | Tablet 3-column project showcase grid |
| `768_work_list_view.png` | 768×1024 | Tablet list view overlay |
| `768_behind_the_scenes.png` | 768×1024 | Tablet behind the scenes carousel |
| `768_what_we_do.png` | 768×1024 | Tablet What We Do section layout |
| `768_worldwide_globe.png` | 768×1024 | Tablet 3D globe section |
| `768_contact_modal.png` | 768×1024 | Tablet contact modal card |
| `768_email_copied.png` | 768×1024 | Tablet email copied badge feedback |
| `390_preloader.png` | 390×844 | Mobile preloader state |
| `390_hero.png` | 390×844 | Mobile hero statement layout with "Menu" button |
| `390_menu_open.png` | 390×844 | Mobile fullscreen navigation menu overlay (pure black) |
| `390_mosaic.png` | 390×844 | Mobile 3D mosaic scroll progress |
| `390_work_grid.png` | 390×844 | Mobile 1-column full-width project cards |
| `390_work_list_view.png` | 390×844 | Mobile project list view |
| `390_behind_the_scenes.png` | 390×844 | Mobile behind the scenes carousel |
| `390_what_we_do.png` | 390×844 | Mobile stacked What We Do boxes |
| `390_worldwide_globe.png` | 390×844 | Mobile 3D globe section |
| `390_contact_modal.png` | 390×844 | Mobile contact card modal layout |
| `390_email_copied.png` | 390×844 | Mobile email copied badge feedback |

---

## 12. UNSURE Items & Verification Notes

Below are observations and technical constraints explicitly marked **UNSURE** where exact runtime internal code could not be verified by static source or DOM inspection alone:

1. **[UNSURE] Active Work Grid Project Count (8 vs 12):**  
   The user prompt specified *"How the work grid handles the 12 items"*. In the live production CMS bundle fetched from https://podium.global/, `homeProjectItems` currently has **8 items** (Deviate, 80 Winters, Milimani, Not Quite Gone, Western States, Life Edition, Summer Nights, Jay Du Temple). The Behind the Scenes carousel, however, contains **12 items**. The work grid's 4-col / 3-col / 1-col layout and modulo parallax calculations (`r % 4`, `r % 3`) inherently scale to 12 items identically.
2. **[UNSURE] Three.js GLSL Custom Shaders:**  
   The exact mathematical formulas within the compiled WebGL fragment shaders for the 3D globe displacement mesh and the mosaic rock distortion (`WorldwideBackgroundMaterial`, `rockPodium.glb`) are minified WebGL bytecode programs. While the uniforms driven by scroll velocity and touch drag coordinates are fully documented, the exact internal noise algorithms in the shaders cannot be decompiled with 100% fidelity.
3. **[UNSURE] Headless CMS Origin & Schema:**  
   Next.js serves pre-rendered static content chunks (`_next/static/chunks/...`). The underlying headless CMS provider (e.g. Sanity, Storyblok, or Strapi) and its field schema definitions are internal to the build server and cannot be directly queried over the wire.
4. **[UNSURE] Safari-Specific Video Frame Nudge:**  
   A utility `withSafariVideoFrameNudge` / `nudgeSafariVideoFrame` appends `#t=0.001` to Mux video URLs on WebKit to bypass iOS Safari's black first-frame bug. The exact internal threshold for which iOS versions trigger this nudge is bundled within minified helper utilities.


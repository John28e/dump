# Color Specification and Accuracy Measurements

All color values and states documented below were measured directly from the live site [https://podium.global/](https://podium.global/) using browser automation (`puppeteer-core` running headless Google Chrome 156 on macOS at 1440px and 390px viewports), stylesheet parsing of `podium.css`, and pixel-sampling of WebGL canvas renders.

---

## 1. CSS Custom Properties & Design Tokens

Extracted directly from the compiled stylesheet and runtime computed styles:

| CSS Custom Property | Value (Hex / RGB / Value) | Description / Usage |
| :--- | :--- | :--- |
| `--color-black` | `#000000` (`rgb(0, 0, 0)`) | Pure black: canvas dark state, work grid bg, mobile menu bg |
| `--color-white` | `#ffffff` (`rgb(255, 255, 255)`) | Pure white: preloader curtain, about/BTS container bg, contact card bg |
| `--color-whatwedo-service` | `#fdf7f7` (`rgb(253, 247, 247)`) | Services box background in What We Do section |
| `--color-whatwedo-client` | `#dddddd` (`rgb(221, 221, 221)`) | Clients box background in What We Do section |
| `--color-whatwedo-athlete` | `#cacaca` (`rgb(202, 202, 202)`) | Athletes box background; also list view divider line |
| `--color-neutral-900` | `#171717` (`rgb(23, 23, 23)`) | Back face of Behind the Scenes 3D flip cards |
| `--color-gray-800` | `#1e2939` (`rgb(30, 41, 57)`) | Dark slate neutral |
| `--color-gray-700` | `#364153` (`rgb(54, 65, 83)`) | Muted secondary border & line token |
| `--color-gray-400` | `#99a1af` (`rgb(153, 161, 175)`) | Secondary subtext and date labels |
| `--color-gray-200` | `#e5e7eb` (`rgb(229, 231, 235)`) | Progress bar track in Behind the Scenes carousel |
| `--color-slate-200` | `#e2e8f0` (`rgb(226, 232, 240)`) | Light gray subtle utility tone |
| `--color-slate-100` | `#f1f5f9` (`rgb(241, 245, 249)`) | Lightest slate background tint |
| `--color-red-500` | `#fb2c36` (`rgb(251, 44, 54)`) | Video record dot / accent red |
| `--color-blue-500` | `#3080ff` (`rgb(48, 128, 255)`) | Focus ring default outline |
| `--color-blue-600` | `#155dfc` (`rgb(21, 93, 252)`) | Active blue state |

---

## 2. Complete Section & Component Color Measurements

| Section / Component | Element / State | Measured Value (Hex / RGBA) | Source | Notes / Transitions |
| :--- | :--- | :--- | :--- | :--- |
| **Document Root** | `html` background | `rgba(0, 0, 0, 0)` | computed | Transparent root |
| **Document Root** | `body` background | `#000000` | computed | Base dark background |
| **Document Root** | `body` text color | `#ffffff` | computed | Base text color |
| **Document Root** | `caret-color` | `#ffffff` | computed | Text cursor caret |
| **Document Root** | `::selection` | Default system selection | computed | No custom `::selection` override in stylesheet |
| **Document Root** | `.project-list-scroll` scrollbar | `display: none` | computed | Custom scrollbar hidden on panel |
| **Preloader** | Curtain background | `#ffffff` | computed & pixel-sampled | Full-screen white curtain overlay (`z-[200]`) |
| **Preloader** | Center circle indicator | `#000000` | computed & pixel-sampled | Centered black circle |
| **Preloader** | Percentage counter text | `#000000` | computed & pixel-sampled | Black text below circle |
| **Hero** | Background (initial at top) | `#ffffff` | pixel-sampled | Canvas renders white background (`rgb(255, 255, 255)`) |
| **Hero** | Background transition | `#ffffff` $\rightarrow$ `#000000` | pixel-sampled | Interpolates from white to black across 0% – 35% hero scroll |
| **Hero** | H1 Headline (`.c-hero_text`) | `#000000` | computed | Black typography over white hero aperture |
| **Hero** | Hint ("SCROLL DOWN") | `#000000` | computed | Black label text |
| **Hero** | Rock-podium 3D geometry | `#1e2225` to `#8a8a8a` | pixel-sampled | Natural cool stone facets and slate highlights |
| **Header** | Container background | `rgba(0, 0, 0, 0)` | computed | Transparent fixed navbar |
| **Header** | Over Hero (0% – 7% scroll) | `#000000` | computed & pixel-sampled | Black wordmark & nav links against white hero |
| **Header** | Transition boundary | `#000000` $\rightarrow$ `#ffffff` | computed & pixel-sampled | Occurs around ~500px – 700px scroll (entrance to Mosaic) |
| **Header** | Over Mosaic & Work (13% – 53%) | `#ffffff` | computed & pixel-sampled | White wordmark & nav links against black background |
| **Header** | Over About & What We Do (60% – 87%) | `#000000` | computed & pixel-sampled | Black wordmark & nav links against white container |
| **Header** | Over Worldwide & Footer (93% – 100%) | `#ffffff` | computed & pixel-sampled | White wordmark & nav links against black worldwide background |
| **Mosaic Track** | Background | `#000000` | pixel-sampled | Deep space black |
| **Mosaic Track** | Textured image planes | Original photographic | pixel-sampled | WebP image planes with subtle depth border |
| **Work Grid** | Section background | `#000000` | computed | Pure black |
| **Work Grid** | Project card background | `rgba(0, 0, 0, 0)` | computed | Transparent |
| **Work Grid** | Project card border | `0px` / none | computed | No borders on cards |
| **Work Grid** | Card title | `#ffffff` | computed | White bold uppercase |
| **Work Grid** | Card year | `#c4c4c4` (`rgb(196, 196, 196)`) | computed | Muted light gray |
| **Work Grid** | Card client | `#ffffff` | computed | White uppercase |
| **Work Grid** | Spotlight cursor halo | `rgba(255, 255, 255, 0.2)` | computed | Radial spotlight gradient |
| **View Toggle** | Button outer container | `rgba(0, 0, 0, 0)` | computed | Transparent bounding box |
| **View Toggle** | SVG Pill fill | `#000000` (`opacity: 0.9`) | computed | 90% black filled pill |
| **View Toggle** | SVG Pill border | `0px` | computed | Borderless pill |
| **View Toggle** | Active grid icon fill | `#000000` | computed | Black active state icon |
| **View Toggle** | Inactive grid icon stroke | `#767676` (`rgb(118, 118, 118)`) | computed | Medium gray icon stroke |
| **View Toggle** | Inactive list icon fill | `#d9d9d9` (`rgb(217, 217, 217)`) | computed | Light gray icon rect |
| **View Toggle** | Text label ("LIST" / "GRID") | `#ffffff` | computed | White text |
| **View Toggle** | Pixel dots on pill | `#e7dfd7` (`rgb(231, 223, 215)`) | computed | Warm off-white dots at 0.5/0.8 opacity |
| **View Toggle** | Focus outline | `#ffffff` | computed | 2px solid white outline |
| **Project List** | Overlay container background | `#000000` | computed | Pure black backdrop |
| **Project List** | Panel background | `rgba(0, 0, 0, 0)` | computed | Transparent container |
| **Project List** | Row project title | `#ffffff` | computed | White bold uppercase |
| **Project List** | Row client name | `#ffffff` | computed | White uppercase |
| **Project List** | Row year | `#ffffff` | computed | White uppercase |
| **Project List** | Row divider corner dots | `#d9d9d9` (`rgb(217, 217, 217)`) | computed | `span[data-project-list-pixel]` |
| **Project List** | Row divider line | `#cacaca` (`rgb(202, 202, 202)`) | computed | `span[data-project-list-line]` 0.5px line |
| **Project List** | Hover poster frame border | `0px` / none | computed | No border around hover poster |
| **Project List** | Bottom gradient fade | `from-black via-black/80 to-transparent` | computed | Black gradient overlay at bottom |
| **About** | Container background (`#about`) | `#ffffff` | computed & pixel-sampled | Pure white background block |
| **About** | Overline ("ABOUT") | `#000000` | computed | Black uppercase |
| **About** | Large justified statement | `#000000` | computed | Black bold text |
| **Behind the Scenes** | Section background | `#ffffff` | computed & pixel-sampled | Inside `#about` white background block |
| **Behind the Scenes** | Section heading | `#000000` | computed | Black uppercase |
| **Behind the Scenes** | Progress bar track | `#e5e7eb` (`rgb(229, 231, 235)`) | computed | 2px high light gray track |
| **Behind the Scenes** | Progress bar thumb / fill | `#000000` | computed | Black active indicator |
| **Behind the Scenes** | Card front face background | `rgba(0, 0, 0, 0)` | computed | Transparent media holder |
| **Behind the Scenes** | Card front face label text | `#ffffff` | computed | White bottom-right label |
| **Behind the Scenes** | Card back face background | `#171717` (`rgb(23, 23, 23)`) | computed & token | Charcoal gray back face |
| **Behind the Scenes** | Card back face text | `#ffffff` | computed | White caption and details |
| **What We Do** | Section title | `#000000` | computed | Black uppercase |
| **What We Do** | Services box background | `#fdf7f7` (`rgb(253, 247, 247)`) | computed | Warm off-white |
| **What We Do** | Services box border | `0px` / none | computed | No border |
| **What We Do** | Services box title & items | `#000000` | computed | Black text |
| **What We Do** | Services corner dots | `#000000` | computed | 4px black dots |
| **What We Do** | Clients box background | `#dddddd` (`rgb(221, 221, 221)`) | computed | Light gray |
| **What We Do** | Clients box border | `0px` / none | computed | No border |
| **What We Do** | Clients box title & items | `#000000` | computed | Black text |
| **What We Do** | Clients corner dots | `#000000` | computed | 4px black dots |
| **What We Do** | Athletes box background | `#cacaca` (`rgb(202, 202, 202)`) | computed | Medium light gray |
| **What We Do** | Athletes box border | `0px` / none | computed | No border |
| **What We Do** | Athletes box title & items | `#000000` | computed | Black text |
| **What We Do** | Athletes corner dots | `#000000` | computed | 4px black dots |
| **Worldwide** | Section background | `#000000` | computed & pixel-sampled | Deep black background |
| **Worldwide** | Side texts | `#e5e7eb` / `#cacaca` | computed | Muted light gray uppercase text |
| **Worldwide** | 3D Dotted globe background | `#000000` | pixel-sampled | Black canvas |
| **Worldwide** | 3D Dotted globe dots | `#ffffff` / `#f1f1f1` / `#e2e2e2` | pixel-sampled | White points with distance attenuation |
| **Worldwide** | "Available worldwide" badge | `#ffffff` | computed | White uppercase |
| **Worldwide** | Closing CTA ("Work with us") | `#ffffff` | computed | White uppercase with underline |
| **Footer** | Footer background | `#000000` | computed & pixel-sampled | Pure black |
| **Footer** | Top dotted divider | `rgba(255, 255, 255, 0.5)` | computed | Repeating 3px dash / 3px gap dotted line |
| **Footer** | Copyright text | `#ffffff` | computed | White text |
| **Footer** | Email address link | `#ffffff` | computed | White text with underline |
| **Footer** | "Copied" feedback state | `#ffffff` | computed | White text fading in over email |
| **Footer** | Credit line ("Website by ...") | `#ffffff` | computed | White text |
| **Contact Modal** | Backdrop overlay | `rgba(0, 0, 0, 0.3)` | computed | 30% black backdrop (`oklab(0 0 0 / 0.3)`) |
| **Contact Modal** | Backdrop filter | `blur(30px)` | computed | 30px frosted glass blur |
| **Contact Modal** | Card container background | `#ffffff` | computed | Pure white card |
| **Contact Modal** | Card text & headlines | `#000000` | computed | Black uppercase text |
| **Contact Modal** | Close button background | `#ffffff` | computed | White square |
| **Contact Modal** | Close button dashed border | `#000000` (`strokeDasharray="3 3"`) | computed | Dashed black 0.8px border |
| **Contact Modal** | Close button X icon | `#000000` | computed | Black diagonal strokes |
| **Contact Modal** | Email link text | `#000000` | computed | Black text with underline |
| **Contact Modal** | "Copied" feedback in modal | `#000000` | computed | Black text fading in over email |
| **Mobile Menu** | Overlay background | `#000000` | computed | Pure black (`bg-black`) |
| **Mobile Menu** | Navigation links text | `#ffffff` | computed | White display typography |
| **Mobile Menu** | Social links text | `#ffffff` | computed | White text |
| **Mobile Menu** | Close button pixel icon | `#ffffff` (`currentColor`) | computed | White pixelated icon |

---

## 3. Pixel-Sampled Color Audit at Fixed Scroll Positions

Screenshots taken at 1440px wide across fixed scroll checkpoints:

| Checkpoint | Scroll Y | Sample Coordinate | Sampled Hex | Sampled RGBA | Dominant Element & Context |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **0%** | 0 px | (30, 80) | `#ffffff` | `(255, 255, 255, 255)` | Preloader / Hero top-left background |
| **0%** | 0 px | (720, 30) | `#ffffff` | `(255, 255, 255, 255)` | Header area background (white) |
| **0%** | 0 px | (720, 450) | `#3d4142` | `(61, 65, 66, 255)` | Hero 3D rock-podium center facet |
| **10%** | 588 px | (30, 80) | `#878787` | `(135, 135, 135, 255)` | Hero aperture transition to dark |
| **20%** | 1,177 px | (30, 80) | `#000000` | `(0, 0, 0, 255)` | Mosaic scroll track background |
| **30%** | 1,766 px | (30, 80) | `#000000` | `(0, 0, 0, 255)` | Work Grid background |
| **50%** | 2,943 px | (30, 80) | `#000000` | `(0, 0, 0, 255)` | Work Grid lower rows background |
| **60%** | 3,532 px | (30, 80) | `#ffffff` | `(255, 255, 255, 255)` | `#about` section white background |
| **70%** | 4,120 px | (30, 80) | `#ffffff` | `(255, 255, 255, 255)` | Behind the Scenes carousel background |
| **80%** | 4,709 px | (30, 80) | `#ffffff` | `(255, 255, 255, 255)` | What We Do section background |
| **90%** | 5,298 px | (720, 450) | `#cacaca` | `(202, 202, 202, 255)` | Athletes box center fill |
| **100%** | 5,887 px | (30, 80) | `#000000` | `(0, 0, 0, 255)` | Worldwide / Globe / Footer background |
| **100%** | 5,887 px | (710, 620) | `#ffffff` | `(255, 255, 255, 255)` | 3D Globe active point |

---

## 4. Section Background Transitions & Header Color Synchronization

The live site alternates between dark and light environments cleanly:

```
[ Preloader: White (#fff) ]
        ↓
[ Hero Statement: White Canvas (#fff) / Black Text (#000) / Header Text (#000) ]
        ↓ (interpolates from #ffffff to #000000 across 0px to ~600px)
[ Mosaic Track & Work Grid: Pure Black (#000) / White Text (#fff) / Header Text (#fff) ]
        ↓ (hard boundary entering #about at ~3,400px)
[ About / BTS / What We Do: Pure White (#fff) / Black Text (#000) / Header Text (#000) ]
        ↓ (hard boundary entering #worldwide at ~5,400px)
[ Worldwide / Globe / Footer: Pure Black (#000) / White Text (#fff) / Header Text (#fff) ]
```

### Corrections from Initial `SITE_SPEC.md`
1. **Hero Background:** Initial spec listed Hero as `#000000`. Measured: Hero begins with `#ffffff` canvas clear color and black typography, fading to `#000000` as the camera zooms into the Mosaic track.
2. **Behind the Scenes Background:** Measured as pure `#ffffff` inside `#about`, not `#000000`.
3. **What We Do Borders:** Measured as `0px` border width with solid fill panels and `4px x 4px` black corner pixel dots.
4. **Footer Typography:** Measured as pure `#ffffff` for copyright and credit links (not `#99a1af`).
5. **Project List Dividers:** Measured as `#d9d9d9` for corner dots and `#cacaca` for line divider.


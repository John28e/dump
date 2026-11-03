export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  aspect: string;
  type: "video" | "image";
  videoUrl?: string;
  webmUrl?: string;
  imageUrl?: string;
  alt?: string;
  posterBg: string; // CSS gradient or color
  description: string;
  role?: string;
  format?: string;
  location?: string;
  brief?: string;
  approach?: string;
  result?: string;
}

export interface BtsCardItem {
  id: string;
  title: string;
  category: string;
  type: "video" | "image";
  videoUrl?: string;
  webmUrl?: string;
  imageUrl?: string;
  alt?: string;
  posterBg: string; // CSS gradient or color
  backTitle: string;
  backText: string;
}

// Exactly 8 projects for startup brand identity and web development
export const PLACEHOLDER_PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    slug: "clear-ledger",
    title: "Clear Ledger",
    client: "Finlo",
    year: "2026",
    aspect: "348 / 259",
    type: "video",
    videoUrl: "/media/work/work-01-payments-app.mp4#t=0.001",
    imageUrl: "/images/work/work-01-payments-app.webp",
    alt: "Payments application interface displayed on a smartphone mockup",
    posterBg: "linear-gradient(135deg, #1f2937 0%, #111827 50%, #030712 100%)",
    description: "Brand identity and a conversion-focused marketing site for a seed-stage payments startup.",
    role: "Brand identity, web design, development",
    format: "Brand system and marketing site",
    location: "Remote, India",
    brief: "Establish an authoritative financial presence for a seed-stage transaction infrastructure platform.",
    approach: "Designed a precision typography system and structured an interactive product walkthrough that simplifies complex settlement flows.",
    result: "A focused digital presence ready for institutional partner onboarding and launch.",
  },
  {
    id: "proj-2",
    slug: "slow-leaf",
    title: "Slow Leaf",
    client: "Verdant Tea Co.",
    year: "2025",
    aspect: "348 / 259",
    type: "video",
    videoUrl: "/media/work/work-02-tea-storefront.mp4#t=0.001",
    imageUrl: "/images/work/work-02-tea-storefront.webp",
    alt: "Loose-leaf tea packaging tins and ceramic cups on a curated display",
    posterBg: "linear-gradient(135deg, #374151 0%, #1f2937 50%, #0f172a 100%)",
    description: "A packaging-ready brand system and storefront for a direct-to-consumer tea label.",
    role: "Brand identity, packaging design, ecommerce development",
    format: "Visual identity and storefront",
    location: "Remote, India",
    brief: "Create an evocative visual world and high-converting storefront for single-origin harvest releases.",
    approach: "Combined warm earth-toned editorial photography with tactile typography and a bespoke headless storefront experience.",
    result: "A cohesive brand and ecommerce architecture supporting seasonal catalog rotations.",
  },
  {
    id: "proj-3",
    slug: "pilot-light",
    title: "Pilot Light",
    client: "Stackpilot",
    year: "2026",
    aspect: "348 / 259",
    type: "video",
    videoUrl: "/media/work/work-03-devtool-docs.mp4#t=0.001",
    imageUrl: "/images/work/work-03-devtool-docs.webp",
    alt: "Dark mode code editor and technical documentation on a desktop monitor",
    posterBg: "linear-gradient(135deg, #27272a 0%, #18181b 50%, #09090b 100%)",
    description: "A product-led brand and documentation-friendly website for a developer tool.",
    role: "Brand identity, documentation architecture, frontend engineering",
    format: "Product brand and technical website",
    location: "Remote, India",
    brief: "Position a technical infrastructure tool with clear utility for engineering teams.",
    approach: "Structured dark-mode documentation components, visual architecture diagrams, and a low-latency code showcase.",
    result: "An engineer-focused platform with structured documentation and product workflows.",
  },
  {
    id: "proj-4",
    slug: "open-door",
    title: "Open Door",
    client: "Homestead Care",
    year: "2025",
    aspect: "348 / 259",
    type: "video",
    videoUrl: "/media/work/work-04-homecare-booking.mp4#t=0.001",
    imageUrl: "/images/work/work-04-homecare-booking.webp",
    alt: "Caregiver assisting an older adult in a bright living room alongside a booking screen",
    posterBg: "linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%)",
    description: "A warm, trustworthy identity and booking flow for a home-care startup.",
    role: "Brand strategy, visual identity, web application design",
    format: "Brand identity and booking portal",
    location: "Remote, India",
    brief: "Design a human, reassuring experience for families coordinating specialized home assistance.",
    approach: "Built accessible, high-contrast layouts and an intuitive multi-step scheduling sequence emphasizing caregiver profiles.",
    result: "A compassionate and reliable digital touchpoint for home health coordination.",
  },
  {
    id: "proj-5",
    slug: "quiet-signal",
    title: "Quiet Signal",
    client: "Nimbus Labs",
    year: "2026",
    aspect: "348 / 259",
    type: "video",
    videoUrl: "/media/work/work-05-ai-infrastructure.mp4#t=0.001",
    imageUrl: "/images/work/work-05-ai-infrastructure.webp",
    alt: "Server room corridor with illuminated computing racks and network hardware",
    posterBg: "linear-gradient(135deg, #292524 0%, #1c1917 50%, #0c0a09 100%)",
    description: "A restrained brand and launch site for an AI infrastructure company.",
    role: "Brand strategy, visual identity, interactive web development",
    format: "Brand identity and launch platform",
    location: "Remote, India",
    brief: "Craft a minimal, confident identity for a high-performance computation research studio.",
    approach: "Engineered subtle canvas animations, monochrome typography, and concise technical positioning.",
    result: "A distinguished launch platform communicating deep infrastructure capability.",
  },
  {
    id: "proj-6",
    slug: "fieldnote",
    title: "Fieldnote",
    client: "Agrigrid",
    year: "2025",
    aspect: "348 / 259",
    type: "video",
    videoUrl: "/media/work/work-06-agritech-platform.mp4#t=0.001",
    imageUrl: "/images/work/work-06-agritech-platform.webp",
    alt: "Aerial perspective of agricultural farmland alongside farmer holding a digital tablet",
    posterBg: "linear-gradient(135deg, #18181b 0%, #09090b 50%, #000000 100%)",
    description: "An identity and farmer-facing web platform for an agricultural marketplace.",
    role: "Brand identity, UI/UX design, progressive web application",
    format: "Brand identity and web platform",
    location: "Remote, India",
    brief: "Bridge regional farm cooperatives with enterprise produce buyers through a transparent digital marketplace.",
    approach: "Created high-legibility mobile interfaces optimized for rural connectivity and rapid trade matching.",
    result: "An accessible agricultural trading interface built for field and desktop operations.",
  },
  {
    id: "proj-7",
    slug: "common-ground",
    title: "Common Ground",
    client: "Lumen Learning",
    year: "2025",
    aspect: "348 / 259",
    type: "video",
    videoUrl: "/media/work/work-07-course-learning.mp4#t=0.001",
    imageUrl: "/images/work/work-07-course-learning.webp",
    alt: "Student engaged in an interactive online video lesson on a modern laptop",
    posterBg: "linear-gradient(135deg, #334155 0%, #1e293b 50%, #0f172a 100%)",
    description: "A brand refresh and interactive course site for an online learning startup.",
    role: "Brand refresh, curriculum UX design, web development",
    format: "Interactive course platform and brand system",
    location: "Remote, India",
    brief: "Reimagine the educational experience for modular cohort-based professional study.",
    approach: "Introduced vibrant accent palettes, modular syllabus components, and distraction-free lecture viewing layouts.",
    result: "An engaging digital learning environment serving modern remote cohorts.",
  },
  {
    id: "proj-8",
    slug: "next-stop",
    title: "Next Stop",
    client: "Routewise",
    year: "2026",
    aspect: "348 / 259",
    type: "video",
    videoUrl: "/media/work/work-08-mobility-transit.mp4#t=0.001",
    imageUrl: "/images/work/work-08-mobility-transit.webp",
    alt: "Modern city electric transit bus and metro platform illuminated at dusk",
    posterBg: "linear-gradient(135deg, #1f2937 0%, #111827 50%, #030712 100%)",
    description: "A brand, motion language, and marketing site for a city mobility startup.",
    role: "Brand identity, motion design, web development",
    format: "Brand system, motion guidelines, and marketing site",
    location: "Remote, India",
    brief: "Define an electric urban transit service with dynamic visual pacing and route exploration.",
    approach: "Constructed interactive transit maps, responsive kinetic typography, and fluid route preview modules.",
    result: "A forward-looking mobility identity communicating speed, predictability, and civic integration.",
  },
];

// Exactly 12 Behind the Scenes cards matching studio process
export const PLACEHOLDER_BTS: BtsCardItem[] = [
  {
    id: "bts-1",
    title: "Positioning Workshop",
    category: "Strategy",
    type: "video",
    videoUrl: "/media/bts/bts-01-positioning-workshop.mp4#t=0.001",
    imageUrl: "/images/bts/bts-01-positioning-workshop.webp",
    alt: "Workshop whiteboard filled with structured sticky notes and positioning statements",
    posterBg: "linear-gradient(135deg, #1c1917, #0c0a09)",
    backTitle: "Finding the Sharp Edge",
    backText: "Two hours with the founders to turn a vague pitch into one clear sentence a customer can repeat.",
  },
  {
    id: "bts-2",
    title: "Competitor Teardown",
    category: "Strategy",
    type: "video",
    videoUrl: "/media/bts/bts-02-competitor-teardown.mp4#t=0.001",
    imageUrl: "/images/bts/bts-02-competitor-teardown.webp",
    alt: "Studio pinboard wall covered with printed visual brand references and category audit notes",
    posterBg: "linear-gradient(135deg, #1e293b, #0f172a)",
    backTitle: "Mapping the Category",
    backText: "Lining up the field to find the visual and verbal space nobody else is using.",
  },
  {
    id: "bts-3",
    title: "Logo Exploration",
    category: "Identity",
    type: "video",
    videoUrl: "/media/bts/bts-03-logo-exploration.mp4#t=0.001",
    imageUrl: "/images/bts/bts-03-logo-exploration.webp",
    alt: "Open designer sketchbook with pencil logo ideas and geometric lettermark studies",
    posterBg: "linear-gradient(135deg, #27272a, #18181b)",
    backTitle: "Sketch Before Screen",
    backText: "Dozens of rough marks on paper before a single pixel is drawn.",
  },
  {
    id: "bts-4",
    title: "Color and Type System",
    category: "Identity",
    type: "video",
    videoUrl: "/media/bts/bts-04-color-and-type.mp4#t=0.001",
    imageUrl: "/images/bts/bts-04-color-and-type.webp",
    alt: "Color swatch fan and typographic specimens laid out across a design worktable",
    posterBg: "linear-gradient(135deg, #1f2937, #111827)",
    backTitle: "Tokens, Not Guesses",
    backText: "Palettes and typefaces tested on real layouts so they hold up beyond the logo.",
  },
  {
    id: "bts-5",
    title: "Brand Guidelines",
    category: "Identity",
    type: "video",
    videoUrl: "/media/bts/bts-05-brand-guidelines.mp4#t=0.001",
    imageUrl: "/images/bts/bts-05-brand-guidelines.webp",
    alt: "Printed brand guidelines manual bound in linen showing design rules and spacing grids",
    posterBg: "linear-gradient(135deg, #334155, #1e293b)",
    backTitle: "Rules That Travel",
    backText: "A working guide the team can use on day one, from social posts to pitch decks.",
  },
  {
    id: "bts-6",
    title: "Wireframes",
    category: "Design",
    type: "video",
    videoUrl: "/media/bts/bts-06-wireframes.mp4#t=0.001",
    imageUrl: "/images/bts/bts-06-wireframes.webp",
    alt: "Paper wireframes of responsive application screens and navigation architecture",
    posterBg: "linear-gradient(135deg, #18181b, #09090b)",
    backTitle: "Structure First",
    backText: "Low-fidelity page flows that settle the hierarchy before any styling begins.",
  },
  {
    id: "bts-7",
    title: "Interface Design",
    category: "Design",
    type: "video",
    videoUrl: "/media/bts/bts-07-interface-design.mp4#t=0.001",
    imageUrl: "/images/bts/bts-07-interface-design.webp",
    alt: "Product designer fine-tuning screen layouts using a digital tablet and stylus",
    posterBg: "linear-gradient(135deg, #1e1e24, #0b0b0e)",
    backTitle: "Pixels With Purpose",
    backText: "High-fidelity screens built on the brand system and checked at every breakpoint.",
  },
  {
    id: "bts-8",
    title: "Motion Prototyping",
    category: "Design",
    type: "video",
    videoUrl: "/media/bts/bts-08-motion-prototyping.mp4#t=0.001",
    imageUrl: "/images/bts/bts-08-motion-prototyping.webp",
    alt: "Laptop screen displaying animation keyframe timelines and interactive curve editor",
    posterBg: "linear-gradient(135deg, #262626, #141414)",
    backTitle: "Movement as Meaning",
    backText: "Interaction and transition studies that show how the site should feel.",
  },
  {
    id: "bts-9",
    title: "Component Build",
    category: "Development",
    type: "video",
    videoUrl: "/media/bts/bts-09-component-build.mp4#t=0.001",
    imageUrl: "/images/bts/bts-09-component-build.webp",
    alt: "Code editor displaying modular React component files and typed design tokens",
    posterBg: "linear-gradient(135deg, #1f2421, #0d110f)",
    backTitle: "One System, Many Pages",
    backText: "Reusable React components that keep the site fast, consistent, and easy to extend.",
  },
  {
    id: "bts-10",
    title: "Performance Tuning",
    category: "Development",
    type: "video",
    videoUrl: "/media/bts/bts-10-performance-tuning.mp4#t=0.001",
    imageUrl: "/images/bts/bts-10-performance-tuning.webp",
    alt: "Laptop displaying performance waterfall charts alongside a connected mobile test device",
    posterBg: "linear-gradient(135deg, #1b263b, #0d1b2a)",
    backTitle: "Fast by Default",
    backText: "Image, font, and script budgets checked against real mobile connections.",
  },
  {
    id: "bts-11",
    title: "Quality Assurance",
    category: "Launch",
    type: "video",
    videoUrl: "/media/bts/bts-11-quality-assurance.mp4#t=0.001",
    imageUrl: "/images/bts/bts-11-quality-assurance.webp",
    alt: "Multiple test devices including phone, tablet, and laptop lined up on a studio desk",
    posterBg: "linear-gradient(135deg, #283618, #141a0d)",
    backTitle: "Break It Before They Do",
    backText: "Cross-browser, device, and accessibility checks ahead of every release.",
  },
  {
    id: "bts-12",
    title: "Go-Live and Handover",
    category: "Launch",
    type: "video",
    videoUrl: "/media/bts/bts-12-go-live-handover.mp4#t=0.001",
    imageUrl: "/images/bts/bts-12-go-live-handover.webp",
    alt: "Collaborative team gathered around a laptop monitor celebrating launch deployment",
    posterBg: "linear-gradient(135deg, #1a1a1a, #0a0a0a)",
    backTitle: "Launch Day",
    backText: "Deployment, analytics, and a walkthrough so the team can run the site on its own.",
  },
];

export const PLACEHOLDER_DATA = {
  brand: "dump",
  hero: {
    tagline: "We build brands and websites that help startups get taken seriously.",
    hint: "Scroll Down",
  },
  about: {
    overline: "ABOUT THE STUDIO",
    statement: "We design and build brands and websites for early-stage startups: strategy, identity, and code under one roof, with one small team carrying an idea from the first workshop to launch day.",
  },
  whatWeDo: {
    title: "What we do",
    // 5 services per spec
    services: [
      "Brand Strategy",
      "Visual Identity",
      "Web Design and UX",
      "Web Development",
      "Search and Launch Support",
    ],
    // 12 clients per spec
    clients: [
      "Finlo",
      "Verdant Tea Co.",
      "Stackpilot",
      "Homestead Care",
      "Nimbus Labs",
      "Agrigrid",
      "Lumen Learning",
      "Routewise",
      "Cobalt Freight",
      "Ember Pantry",
      "Sprout Capital",
      "Meridian Works",
    ],
    // Sectors description
    sectors:
      "Fintech, SaaS, D2C, Healthtech, Edtech, Agritech, Mobility, AI Infrastructure, Climate Tech, Marketplaces, Developer Tools, Consumer Apps, and many more early-stage teams.",
    // Alias for backward compatibility
    athletes:
      "Fintech, SaaS, D2C, Healthtech, Edtech, Agritech, Mobility, AI Infrastructure, Climate Tech, Marketplaces, Developer Tools, Consumer Apps, and many more early-stage teams.",
  },
  worldwide: {
    sideLeft: "DESIGNED AND BUILT FOR FOUNDERS ACROSS INDIA, WORKING REMOTELY OR ON SITE.",
    cta: "Work with us",
    sideRight: "TAKING ON A LIMITED NUMBER OF NEW STARTUP PROJECTS EACH QUARTER.",
  },
  contact: {
    heading: "Open for new projects",
    address: {
      line1: "STUDIO DUMP",
      line2: "BY APPOINTMENT",
      line3: "KOCHI, KERALA",
      country: "INDIA",
    },
    // 4 email rows
    emails: [
      { label: "Projects", email: "projects@dump.example" },
      { label: "Partnerships", email: "partnerships@dump.example" },
      { label: "General", email: "general@dump.example" },
      { label: "Invoicing", email: "invoicing@dump.example" },
    ],
    socials: [
      { name: "Instagram", url: "#" },
      { name: "LinkedIn", url: "#" },
      { name: "Behance", url: "#" },
    ],
  },
  footer: {
    copyright: "©dump 2026. CONCEPT PROJECT, ALL NAMES FICTIONAL.",
    email: "hello@dump.example",
    credit: "Website by dump",
  },
};

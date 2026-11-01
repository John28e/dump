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
  description?: string;
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

// Exactly 8 projects with authentic sports photojournalism posters
export const PLACEHOLDER_PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    slug: "ridge-stride",
    title: "Ridge Stride",
    client: "Apex Alpine",
    year: "2025",
    aspect: "348 / 259",
    type: "video",
    videoUrl: "/media/work/work-01-trail-running.mp4#t=0.001",
    imageUrl: "/images/work/work-01-trail-running.webp",
    alt: "Trail runner traversing a rugged mountain ridge at golden hour",
    posterBg: "linear-gradient(135deg, #1f2937 0%, #111827 50%, #030712 100%)",
    description: "Documentary trail running cinematography following endurance runners across high alpine ridgelines.",
  },
  {
    id: "proj-2",
    slug: "dawn-cadence",
    title: "Dawn Cadence",
    client: "Veloce Gear",
    year: "2025",
    aspect: "348 / 259",
    type: "video",
    videoUrl: "/media/work/work-02-road-cycling.mp4#t=0.001",
    imageUrl: "/images/work/work-02-road-cycling.webp",
    alt: "Solo road cyclist ascending a winding mountain highway at dawn",
    posterBg: "linear-gradient(135deg, #374151 0%, #1f2937 50%, #0f172a 100%)",
    description: "Cinematic road cycling visual story capturing dawn training climbs through mountain passes.",
  },
  {
    id: "proj-3",
    slug: "starting-blocks",
    title: "Starting Blocks",
    client: "Acro Athletics",
    year: "2025",
    aspect: "348 / 259",
    type: "video",
    videoUrl: "/media/work/work-03-track-sprinter.mp4#t=0.001",
    webmUrl: "/media/work/work-03-track-sprinter.webm#t=0.001",
    imageUrl: "/images/work/work-03-track-sprinter.webp",
    alt: "Sprinter locked in starting blocks focused on the track ahead under floodlights",
    posterBg: "linear-gradient(135deg, #27272a 0%, #18181b 50%, #09090b 100%)",
    description: "High-speed track sprint cinematography focusing on explosion out of the starting blocks.",
  },
  {
    id: "proj-4",
    slug: "asphalt-drive",
    title: "Asphalt Drive",
    client: "Hoop Theory",
    year: "2026",
    aspect: "348 / 259",
    type: "video",
    videoUrl: "/media/work/work-04-basketball-court.mp4#t=0.001",
    imageUrl: "/images/work/work-04-basketball-court.webp",
    alt: "Basketball player driving to the rim on an outdoor urban asphalt court",
    posterBg: "linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%)",
    description: "Raw outdoor streetball documentary capturing fast-paced physical play on asphalt.",
  },
  {
    id: "proj-5",
    slug: "lane-cadence",
    title: "Lane Cadence",
    client: "Hydro Form",
    year: "2025",
    aspect: "348 / 259",
    type: "video",
    videoUrl: "/media/work/work-05-swimmer-pool.mp4#t=0.001",
    imageUrl: "/images/work/work-05-swimmer-pool.webp",
    alt: "Swimmer slicing through pool lane water with spray and wake",
    posterBg: "linear-gradient(135deg, #292524 0%, #1c1917 50%, #0c0a09 100%)",
    description: "Lane-level cinematography capturing fluid dynamics, stroke cadence, and underwater wake.",
  },
  {
    id: "proj-6",
    slug: "dusk-pitch",
    title: "Dusk Pitch",
    client: "Kinetics Football",
    year: "2025",
    aspect: "348 / 259",
    type: "video",
    videoUrl: "/media/work/work-06-soccer-pitch.mp4#t=0.001",
    imageUrl: "/images/work/work-06-soccer-pitch.webp",
    alt: "Soccer striker striking the ball towards goal at dusk under stadium lights",
    posterBg: "linear-gradient(135deg, #18181b 0%, #09090b 50%, #000000 100%)",
    description: "Atmospheric evening football film capturing raw ball strikes and stadium floodlight mist.",
  },
  {
    id: "proj-7",
    slug: "shadow-fight",
    title: "Shadow Fight",
    client: "Iron & Rope",
    year: "2025",
    aspect: "348 / 259",
    type: "video",
    videoUrl: "/media/work/work-07-boxer-gym.mp4#t=0.001",
    imageUrl: "/images/work/work-07-boxer-gym.webp",
    alt: "Boxer striking a heavy leather punching bag in a moody warehouse gym",
    posterBg: "linear-gradient(135deg, #334155 0%, #1e293b 50%, #0f172a 100%)",
    description: "Monochrome training study documenting heavy bag endurance and hand speed in a raw gym.",
  },
  {
    id: "proj-8",
    slug: "alpine-descent",
    title: "Alpine Descent",
    client: "Glacier Peak",
    year: "2026",
    aspect: "348 / 259",
    type: "video",
    videoUrl: "/media/work/work-08-snowboarder-mountain.mp4#t=0.001",
    imageUrl: "/images/work/work-08-snowboarder-mountain.webp",
    alt: "Snowboarder carving a deep powder plume down an open mountain face",
    posterBg: "linear-gradient(135deg, #1f2937 0%, #111827 50%, #030712 100%)",
    description: "Backcountry snowboarding film following big-mountain lines through untouched powder.",
  },
];

// Exactly 12 Behind the Scenes cards per Requirement 4
export const PLACEHOLDER_BTS: BtsCardItem[] = [
  {
    id: "bts-1",
    title: "Tracking Dolly Setup",
    category: "Camera Movement",
    type: "video",
    videoUrl: "/media/bts/bts-01-camera-track.mp4#t=0.001",
    imageUrl: "/images/bts/bts-01-camera-track.webp",
    alt: "Film crew with camera dolly tracking on outdoor curved rails",
    posterBg: "linear-gradient(135deg, #1c1917, #0c0a09)",
    backTitle: "Curved Rail System",
    backText: "Precision ground track dolly keeping pace with athletes along technical bends.",
  },
  {
    id: "bts-2",
    title: "Rooftop Vantage",
    category: "Location Filming",
    type: "video",
    videoUrl: "/media/bts/bts-02-camera-rooftop.mp4#t=0.001",
    imageUrl: "/images/bts/bts-02-camera-rooftop.webp",
    alt: "Camera operator on rooftop overlooking sunset city skyline",
    posterBg: "linear-gradient(135deg, #1e293b, #0f172a)",
    backTitle: "High-Angle Perspective",
    backText: "Rigging camera platforms above city skylines during golden hour transitions.",
  },
  {
    id: "bts-3",
    title: "Softbox Assembly",
    category: "Lighting Setup",
    type: "video",
    videoUrl: "/media/bts/bts-03-studio-lighting.mp4#t=0.001",
    webmUrl: "/media/bts/bts-03-studio-lighting.webm#t=0.001",
    imageUrl: "/images/bts/bts-03-studio-lighting.webp",
    alt: "Film crew assembling tension rods and speed ring for studio softbox light",
    posterBg: "linear-gradient(135deg, #27272a, #18181b)",
    backTitle: "Speed Ring Tension",
    backText: "Hands-on assembly of heavy-duty diffusion softboxes and silver reflectors for controlled indoor studio shoots.",
  },
  {
    id: "bts-4",
    title: "Director Playback",
    category: "Directing",
    type: "video",
    videoUrl: "/media/bts/bts-04-director-monitor.mp4#t=0.001",
    webmUrl: "/media/bts/bts-04-director-monitor.webm#t=0.001",
    imageUrl: "/images/bts/bts-04-director-monitor.webp",
    alt: "Director reviewing footage on field monitor screens during production",
    posterBg: "linear-gradient(135deg, #1f2937, #111827)",
    backTitle: "Field Monitoring",
    backText: "Reviewing multi-angle camera feeds instantly between high-intensity takes on set.",
  },
  {
    id: "bts-5",
    title: "UAV Ground Prep",
    category: "Aerial Cinematography",
    type: "video",
    videoUrl: "/media/bts/bts-05-drone-ground.mp4#t=0.001",
    imageUrl: "/images/bts/bts-05-drone-ground.webp",
    alt: "Camera drone resting on the ground outdoors before flight",
    posterBg: "linear-gradient(135deg, #334155, #1e293b)",
    backTitle: "Gimbal & Rotor Prep",
    backText: "Positioning camera drone on location surface before launch, checking lens balance and sensors.",
  },
  {
    id: "bts-6",
    title: "Production Slate",
    category: "Camera Department",
    type: "video",
    videoUrl: "/media/bts/bts-06-clapperboard.mp4#t=0.001",
    webmUrl: "/media/bts/bts-06-clapperboard.webm#t=0.001",
    imageUrl: "/images/bts/bts-06-clapperboard.webp",
    alt: "Traditional clapperboard slate on set with chalk markings",
    posterBg: "linear-gradient(135deg, #18181b, #09090b)",
    backTitle: "Timecode Sync",
    backText: "Traditional clapperboard slating to maintain exact sync between audio arrays and multi-camera footage.",
  },
  {
    id: "bts-7",
    title: "Motorized Gimbal Rig",
    category: "Camera Stabilization",
    type: "video",
    videoUrl: "/media/bts/bts-07-gimbal-rig.mp4#t=0.001",
    imageUrl: "/images/bts/bts-07-gimbal-rig.webp",
    alt: "Videographer tuning motorized 3-axis camera gimbal rig outdoors",
    posterBg: "linear-gradient(135deg, #1e1e24, #0b0b0e)",
    backTitle: "Three-Axis Balance",
    backText: "Calibrating handheld motorized gimbal motors to absorb fast footfalls and running vibrations.",
  },
  {
    id: "bts-8",
    title: "Boom Microphone Record",
    category: "Field Sound",
    type: "video",
    videoUrl: "/media/bts/bts-08-boom-mic.mp4#t=0.001",
    imageUrl: "/images/bts/bts-08-boom-mic.webp",
    alt: "Boom microphone operator recording audio by a lake during location filming",
    posterBg: "linear-gradient(135deg, #262626, #141414)",
    backTitle: "Windscreen Array",
    backText: "Sound recordist operating shotgun boom pole with deadcat windscreen on location by water.",
  },
  {
    id: "bts-9",
    title: "Color & Edit Console",
    category: "Post-Production",
    type: "video",
    videoUrl: "/media/bts/bts-09-editing-suite.mp4#t=0.001",
    imageUrl: "/images/bts/bts-09-editing-suite.webp",
    alt: "Video editing keyboard and fader control console in post-production suite",
    posterBg: "linear-gradient(135deg, #1f2421, #0d110f)",
    backTitle: "Dedicated Edit Suite",
    backText: "Multi-track motorized audio/video control surface and color-coded shortcut keyboard for rapid rough cuts.",
  },
  {
    id: "bts-10",
    title: "Sideline Telephoto",
    category: "Still Photography",
    type: "video",
    videoUrl: "/media/bts/bts-10-photographer-athlete.mp4#t=0.001",
    imageUrl: "/images/bts/bts-10-photographer-athlete.webp",
    alt: "Sports photographer aiming a large telephoto prime lens on monopod at pitch",
    posterBg: "linear-gradient(135deg, #1b263b, #0d1b2a)",
    backTitle: "Action Catching",
    backText: "Sports photographer tracking match action with a high-speed telephoto lens on a monopod.",
  },
  {
    id: "bts-11",
    title: "Flight Case Logistics",
    category: "Equipment Transport",
    type: "video",
    videoUrl: "/media/bts/bts-11-equipment-cases.mp4#t=0.001",
    imageUrl: "/images/bts/bts-11-equipment-cases.webp",
    alt: "Heavy duty road flight cases with aluminum trim parked on shoot ground",
    posterBg: "linear-gradient(135deg, #283618, #141a0d)",
    backTitle: "Heavy Duty Transit",
    backText: "Reinforced aluminum-edge road cases housing cameras, lenses, and grip gear on location.",
  },
  {
    id: "bts-12",
    title: "Location Footage Review",
    category: "Field Operations",
    type: "video",
    videoUrl: "/media/bts/bts-12-crew-playback.mp4#t=0.001",
    imageUrl: "/images/bts/bts-12-crew-playback.webp",
    alt: "Camera operator and crew closely watching playback on camera monitor on set",
    posterBg: "linear-gradient(135deg, #1a1a1a, #0a0a0a)",
    backTitle: "On-Camera Replay",
    backText: "Camera operator and crew crowding the monitor to verify framing and focus on location.",
  },
];

export const PLACEHOLDER_DATA = {
  brand: "dump",
  hero: {
    tagline: "We offer creative direction &amp; production for athleticism.",
    hint: "Scroll Down",
  },
  about: {
    overline: "ABOUT THE STUDIO",
    statement: "We engineer films, campaigns, and visual narratives that honor the discipline and grit of human performance. Rooted in cinematic craft and modern athleticism, our studio bridges documentary honesty with commercial precision.",
  },
  whatWeDo: {
    title: "What we do",
    // 5 services per Requirement 5
    services: [
      "Creative Direction",
      "Cinematography & Film",
      "Post-Production & Color",
      "Motion & VFX",
      "Sound Design & Scoring",
    ],
    // 12 clients per Requirement 5
    clients: [
      "Acro Athletics",
      "Veloce Sport",
      "Summit Apparel",
      "Aero Dynamics",
      "Apex Labs",
      "Pulse Athletics",
      "Momentum Wear",
      "Wilderness Co.",
      "Kinetics Lab",
      "Equinox Gear",
      "Horizon Club",
      "Stratosphere",
    ],
    // Long invented athlete list per Requirement 5
    athletes:
      "Alex Vance, Maya Lindqvist, Julian Croft, Elena Rostova, Marcus Thorne, David Chen, Sarah Jenkins, Liam O'Connor, Camille Dupont, Soren Kjeldsen, Priya Sharma, Mateo Silva, Takuya Takahashi, Freja Nielsen, Gabriel Santos, and many more visionary athletes worldwide.",
  },
  worldwide: {
    sideLeft: "DIRECTED AND PRODUCED ACROSS SIX CONTINENTS WITH SPECIALIZED REMOTE CREWS.",
    cta: "Work with us",
    sideRight: "AVAILABLE GLOBALLY FOR SELECT COMMERCIAL AND EDITORIAL COMMISSIONS.",
  },
  contact: {
    heading: "Available worldwide",
    address: {
      line1: "STUDIO DUMP",
      line2: "404 ATHLETIC WAY, FLOOR 4",
      line3: "NEW YORK, NY 10001",
      country: "UNITED STATES",
    },
    // 4 email rows per Requirement 8
    emails: [
      { label: "Commercial", email: "commercial@dump.example" },
      { label: "Film", email: "film@dump.example" },
      { label: "General", email: "general@dump.example" },
      { label: "Invoicing", email: "invoicing@dump.example" },
    ],
    socials: [
      { name: "Instagram", url: "#" },
      { name: "LinkedIn", url: "#" },
      { name: "Vimeo", url: "#" },
    ],
  },
  footer: {
    copyright: "©dump 2026. ALL RIGHTS RESERVED.",
    email: "hello@dump.example",
    credit: "Website by dump",
  },
};

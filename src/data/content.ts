export interface HeroPanel {
  id: number;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tag: string;
  year: string;
  accent: string;
  specs: string[];
}

export interface EditorialStory {
  id: string;
  title: string;
  subtitle: string;
  chapter: string;
  image: string;
  date: string;
  readTime: string;
  excerpt: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  notes: string;
  badge?: string;
}

export const heroPanels: HeroPanel[] = [
  {
    id: 1,
    category: "01 / FACE",
    title: "DEFINE YOUR LOOK",
    subtitle: "ÉDITION VISAGE HAUTE DÉFINITION",
    description: "Discover a new expression of beauty. Sculptural silhouettes and illuminated textures conceived for transcendent presence.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=85",
    tag: "HAUTE BEAUTÉ",
    year: "VOL. XXIV",
    accent: "#E2D9CC",
    specs: ["Micro-milled pigment", "Photonic light refraction", "Weightless velvet finish"]
  },
  {
    id: 2,
    category: "02 / COLOR",
    title: "SHADES FOR EVERY SKIN TONE",
    subtitle: "SPECTRE CHROMATIQUE UNIVERSEL",
    description: "Color designed for individuality. Chromatics distilled from raw earth minerals and luminous botanicals, adapting organically to warmth.",
    image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1400&q=85",
    tag: "CHROMATIQUE",
    year: "SERIES 02",
    accent: "#D4B996",
    specs: ["Organic earth oxides", "Adaptive pigment matrix", "18-hour luminosity"]
  },
  {
    id: 3,
    category: "03 / COLLECTION",
    title: "EXPLORE THE SELECTION",
    subtitle: "ANTHOLOGIE COUTURE & ACCESSOIRES",
    description: "A collection created to inspire. Architectural tailoring and ethereal textiles captured at the intersection of stillness and movement.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=85",
    tag: "COLLECTION NO. 07",
    year: "AUTOMNE / HIVER",
    accent: "#C6BEB5",
    specs: ["Hand-draped mulberry silk", "Precision tailoring", "Atelier Parisien"]
  }
];

export const editorialManifesto = {
  quote: "“True luxury does not clamor for attention. It bends light, slows time, and invites the eye to linger in the quiet space between form and sensation.”",
  author: "HÉLÈNE DE ROCHEFORT",
  role: "Creative Director, Studio ÉLAN Paris",
  stats: [
    { label: "Atelier Artisans", value: "38" },
    { label: "Botanical Extracts", value: "100%" },
    { label: "Formulation Years", value: "07" },
    { label: "Limited Batches", value: "250" }
  ]
};

export const collectionGrid: ProductItem[] = [
  {
    id: "prod-01",
    name: "L'Ombre Solaire",
    category: "Haute Parfumerie",
    price: "€280",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=85",
    description: "Rare Bulgarian damask rose infused with smoked oud and golden ambergris. Bottled in hand-blown crystal.",
    notes: "Top: Saffron, Bergamot — Heart: Rose Absolue — Base: Smoked Agarwood, Amber",
    badge: "LIMITED EDITION"
  },
  {
    id: "prod-02",
    name: "Sérum Luminescence",
    category: "Soin Visage",
    price: "€195",
    image: "https://images.unsplash.com/photo-1608248597359-28c93540a876?auto=format&fit=crop&w=1000&q=85",
    description: "Cellular renewal nectar with concentrated alpine edelweiss stem cells and multi-molecular hyaluronic matrix.",
    notes: "Texture: Cashmere micro-fluid — Absorption: Instantaneous velvet",
    badge: "BESTSELLER"
  },
  {
    id: "prod-03",
    name: "Manteau Sculptural",
    category: "Prêt-à-Porter",
    price: "€1,850",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85",
    description: "Double-faced virgin cashmere tailored with asymmetrical storm flap and hand-stitched horn toggles.",
    notes: "Craft: Milanese tailor workshops — Material: 100% Mongolian virgin cashmere",
    badge: "RUNWAY EXCLUSIVE"
  },
  {
    id: "prod-04",
    name: "Vernis Prisme No. 09",
    category: "Cosmétique Pure",
    price: "€85",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85",
    description: "Multi-dimensional holographic lip lacquer with suspended micro-pearls that mirror ambient twilight.",
    notes: "Finish: Prismatic liquid glass — Non-sticky hydration lock"
  },
  {
    id: "prod-05",
    name: "Collier Orbite",
    category: "Haute Joaillerie",
    price: "€2,400",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85",
    description: "18-karat recycled yellow gold torque with tension-set baroque freshwater pearl and flush emerald accent.",
    notes: "Origin: Place Vendôme atelier — Weight: 34.2g pure gold",
    badge: "1 OF 25"
  },
  {
    id: "prod-06",
    name: "Élixir Botanique Nuit",
    category: "Soin Visage",
    price: "€240",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1000&q=85",
    description: "Overnight lipid restoration oil formulated with midnight primrose, bakuchiol, and squalane.",
    notes: "Application: 3 drops warmed in palm before sleep — 99.8% organic"
  }
];

export const editorialStories: EditorialStory[] = [
  {
    id: "story-01",
    title: "LIGHT AS SCULPTURE",
    subtitle: "The Optical Experiments of the Autumn Salon",
    chapter: "ACTE I",
    date: "SEPTEMBER 2026",
    readTime: "04 MIN",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=85",
    excerpt: "Exploring how lens refraction, curved glass surfaces, and fluid dynamics redefine the boundary between model and viewer."
  },
  {
    id: "story-02",
    title: "THE MINIMALIST COUTURE",
    subtitle: "Deconstructing the Architecture of Presence",
    chapter: "ACTE II",
    date: "OCTOBER 2026",
    readTime: "06 MIN",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85",
    excerpt: "Why simplicity in haute couture demands ten times more precision than ornamentation: a conversation with master cutters."
  }
];

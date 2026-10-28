export interface ServiceItem {
  id: string;
  name: string;
  category: 'hair' | 'nails' | 'skin' | 'grooming' | 'body' | 'lashes';
  duration: string;
  price: string;
  description: string;
  benefits: string[];
  popular?: boolean;
  image: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'pods' | 'hair' | 'spa' | 'lounge' | 'results';
  image: string;
  subtitle: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  service: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export const SALON_INFO = {
  name: "Diamond Trim",
  tagline: "You matter. Precision beauty & grooming, in private.",
  subTagline: "A private luxury atelier built around one idea — you.",
  address: "742 Royal Crescent Blvd, Suite 400 (Private Access Level)",
  city: "Downtown Promenade",
  phone: "+1 (800) 482-TRIM",
  whatsapp: "+18004828746",
  email: "concierge@diamondtrim.com",
  instagram: "@diamondtrim.atelier",
  socialLinks: {
    facebook: "https://www.facebook.com",
    twitter: "https://x.com",
    pinterest: "https://www.pinterest.com",
    instagram: "https://www.instagram.com",
  },
  openingHours: {
    weekdays: "Monday – Friday: 9:00 AM – 9:00 PM",
    saturday: "Saturday: 10:00 AM – 8:00 PM",
    sunday: "Sunday: 11:00 AM – 6:00 PM",
  },
  stats: [
    { value: "8+", label: "Years of Mastery" },
    { value: "28K+", label: "Happy Clients" },
    { value: "100%", label: "Private VIP Suites" },
    { value: "4.99 ★", label: "Client Satisfaction" },
  ]
};

export const SERVICES: ServiceItem[] = [
  // NAILS & PODOLOGY
  {
    id: "nail-russian-mani",
    name: "Diamond Russian Manicure",
    category: "nails",
    duration: "75 min",
    price: "$85",
    popular: true,
    description: "Our signature dry e-file manicure performed with medical precision in your private VIP pod. Flawless cuticle detailing and long-lasting gel coating.",
    benefits: [
      "Lasts 4+ weeks with pristine cuticles",
      "Conducted in acoustic VIP pod with Netflix & tea",
      "Surgical autoclave sterilized implements",
      "Strengthening rubber base coat included"
    ],
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: "nail-gel-extensions",
    name: "Architectural Gel Extensions",
    category: "nails",
    duration: "110 min",
    price: "$140",
    popular: false,
    description: "Custom sculpted soft or hard gel extensions tailored to your natural nail bed curvature with chrome, French micro-tips, or bespoke diamond glitter.",
    benefits: [
      "Natural-looking featherweight structure",
      "No harsh acetone soaking needed",
      "Bespoke nail art & Swarovski micro-crystal accents",
      "Organic cuticle oil therapy"
    ],
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: "nail-podology-pedi",
    name: "Clinical Podology Pedicure",
    category: "nails",
    duration: "80 min",
    price: "$110",
    popular: true,
    description: "Advanced dry medical pedicure performed by certified podology specialists. Restores skin elasticity, eliminates calluses, and deeply rehydrates.",
    benefits: [
      "Specialist medical-grade foot care protocols",
      "Aroma-infused botanical steam softening",
      "Zero razor blades: gentle diamond rotary burs",
      "Deep acupressure foot & calf massage"
    ],
    image: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?q=80&w=900&auto=format&fit=crop"
  },

  // HAIR ARTISTRY
  {
    id: "hair-bespoke-cut",
    name: "Couture Precision Cut & Blowout",
    category: "hair",
    duration: "60 min",
    price: "$95",
    popular: true,
    description: "Sculpted by master cutters considering facial geometry, hair density, and lifestyle. Includes scalp analysis and signature silk blowout.",
    benefits: [
      "In-depth face mapping consultation",
      "Deep clarifying wash & scalp massage",
      "Heat shield infusion & round brush silk finish",
      "Take-home styling guidance"
    ],
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: "hair-balayage-gloss",
    name: "French Balayage & Glaze Melt",
    category: "hair",
    duration: "180 min",
    price: "$240",
    popular: true,
    description: "Hand-painted sunlit dimensions paired with an acidic bonding gloss for luminous, natural shine without harsh demarcation lines.",
    benefits: [
      "Seamless soft regrowth blending",
      "Bond-repair Olaplex No. 1 & 2 integration",
      "Custom shade toning tailored to skin undertones",
      "Ultra-nourishing keratin seal"
    ],
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: "hair-nashi-filler",
    name: "Nashi Argan Collagen Filler",
    category: "hair",
    duration: "90 min",
    price: "$160",
    popular: false,
    description: "Deep cellular restoration therapy using pure plant collagen and organic argan oil to reconstruct damaged fibers and banish frizz.",
    benefits: [
      "Instant 300% boost in strand elasticity",
      "Restores natural luster and mirror shine",
      "Safe on all color-treated and bleached hair",
      "Lasts up to 8 weeks with proper home care"
    ],
    image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=900&auto=format&fit=crop"
  },

  // GROOMING & BARBER
  {
    id: "grooming-royal-shave",
    name: "The Royal Diamond Beard & Shave",
    category: "grooming",
    duration: "50 min",
    price: "$75",
    popular: true,
    description: "Traditional straight-razor precision shave with 3-stage essential oil hot towels, botanical lather, and cooling sandalwood tonic.",
    benefits: [
      "Triple eucalyptus steam hot towels",
      "Single-use Japanese feather razor blades",
      "Beard shaping and cheek line sharpening",
      "Ice-cold marble stone pore closure"
    ],
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: "grooming-gentleman-cut",
    name: "Executive Taper & Sculpt",
    category: "grooming",
    duration: "45 min",
    price: "$65",
    popular: false,
    description: "Engineered shear and clipper taper fade with neckline razoring, ear & eyebrow detailing, and invigorating tea-tree scalp rinse.",
    benefits: [
      "Micro-fade or classic executive taper",
      "Hot towel neck relief and straight edge line-up",
      "Matte paste or pomade styling finish",
      "Complimentary single malt or cold brew"
    ],
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=900&auto=format&fit=crop"
  },

  // FACIALS & SKIN
  {
    id: "skin-diamond-glow",
    name: "Diamond Micro-Infusion Facial",
    category: "skin",
    duration: "75 min",
    price: "$175",
    popular: true,
    description: "Non-invasive exfoliating diamond-tip resurfacing combined with deep vacuum extraction and targeted peptide serum infusion.",
    benefits: [
      "Immediate glowing clarity with zero downtime",
      "Pore vacuuming & gentle blackhead extraction",
      "Custom antioxidant & hyaluronic cocktail",
      "Cryo-globe lifting massage"
    ],
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: "skin-lymphatic-modelage",
    name: "Sculpting Facial Modelage",
    category: "skin",
    duration: "65 min",
    price: "$130",
    popular: false,
    description: "Deep tissue buccal and facial contouring technique that releases jaw tension, drains lymphatic fluid, and lifts cheekbones naturally.",
    benefits: [
      "Natural cheekbone and jawline definition",
      "Relieves TMJ tension and facial stress",
      "Increases microcirculation and collagen synthesis",
      "Conducted in quiet private skincare suite"
    ],
    image: "https://images.unsplash.com/photo-1512290900672-1f5517f8b919?q=80&w=900&auto=format&fit=crop"
  },

  // BODY & MASSAGE
  {
    id: "body-maderotherapy",
    name: "Body Slimming Maderotherapy",
    category: "body",
    duration: "70 min",
    price: "$150",
    popular: true,
    description: "Holistic wooden-roller contouring treatment that breaks down stubborn fat deposits, tones connective tissue, and accelerates lymphatic drainage.",
    benefits: [
      "Clinically proven reduction in fluid retention",
      "Smooths cellulite appearance on thighs & abdomen",
      "100% natural and non-invasive technique",
      "Private suite with heated ergonomic table"
    ],
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: "body-restorative-massage",
    name: "Aromatherapy Restorative Massage",
    category: "body",
    duration: "60 min",
    price: "$120",
    popular: false,
    description: "Harmonious full-body relaxation massage using warm botanical essential oils in a soundproofed, dimly lit private sanctuary.",
    benefits: [
      "Choice of calming lavender or revitalizing cedarwood",
      "Heated stone placement on spinal meridian",
      "Unhurried, rhythmic muscle release",
      "Complimentary herbal tea recovery ritual"
    ],
    image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=900&auto=format&fit=crop"
  },

  // LASHES & BROWS
  {
    id: "lash-brow-architecture",
    name: "Keratin Lash Lift & Brow Lamination",
    category: "lashes",
    duration: "85 min",
    price: "$135",
    popular: true,
    description: "Double enhancement transforming natural lashes into curled fluttering fans and styling brows into full, brushed-up perfection.",
    benefits: [
      "Lasts 6 to 8 weeks with minimal maintenance",
      "Deep nourishing keratin & castor oil infusion",
      "Custom vegetable pigment tinting included",
      "Gentle hypoallergenic formulations"
    ],
    image: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?q=80&w=900&auto=format&fit=crop"
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Private VIP Nail Pods",
    subtitle: "Acoustic sanctuary with personal entertainment and beverage service",
    category: "pods",
    image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "gal-2",
    title: "Hair Architecture Studio",
    subtitle: "Minimalist workstations bathed in flattering, color-accurate natural light",
    category: "hair",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "gal-3",
    title: "Private Facial & Body Suites",
    subtitle: "Heated ergonomic memory-foam beds designed for uninterrupted calm",
    category: "spa",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "gal-4",
    title: "Artisanal Refreshment Lounge",
    subtitle: "Complimentary matcha lattes, espresso, and infused hydration",
    category: "lounge",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "gal-5",
    title: "Flawless Russian Manicure Finish",
    subtitle: "Precision cuticle contouring with mirror diamond gloss",
    category: "results",
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "gal-6",
    title: "Luminous Balayage & Glaze",
    subtitle: "Seamless dimension sculpted by master colorists",
    category: "results",
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1000&auto=format&fit=crop"
  }
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "test-1",
    name: "Elena Rostova",
    service: "Russian Manicure & Hair Treatment",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    date: "Verified Visit • 3 days ago",
    text: "Diamond Trim is truly exceptional — without question the most serene and elevated salon I have ever stepped foot in. From the warm greeting at reception with iced rose tea to the private VIP pod where I relaxed while watching my favorite show, every single touchpoint makes you feel valued. My nails are flawless even 4 weeks later."
  },
  {
    id: "test-2",
    name: "Nadia Al-Mansoor",
    service: "French Balayage & Nashi Filler",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    date: "Verified Visit • 1 week ago",
    text: "I was nervous about coloring my hair after previous damage, but the master colorist spent 20 minutes doing a genuine strand test and consultation with zero rush. The Nashi Argan treatment brought my hair back to life with a mirror shine. It feels like a high-end private club rather than a noisy salon."
  },
  {
    id: "test-3",
    name: "Julian Vance",
    service: "The Royal Beard Sculpt & Facial",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    date: "Verified Visit • 2 weeks ago",
    text: "Best straight-razor shave and skin treatment in the city. Total acoustic isolation, incredible attention to detail, and no awkward small talk unless you want it. The cold marble finish and eucalyptus hot towels are an addiction now. Diamond Trim is unmatched."
  },
  {
    id: "test-4",
    name: "Camilla Sorensen",
    service: "Maderotherapy & Restorative Massage",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    date: "Verified Visit • 3 weeks ago",
    text: "The Maderotherapy body contouring genuinely eliminated my water retention before my trip. Cleanliness here is hospital standard — every tool unwrapped from sterile packaging in front of you. Truly quiet luxury designed for personal peace."
  }
];

export const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "Do I need to book my appointment in advance?",
    answer: "Yes — to ensure your preferred master specialist and guarantee an isolated private VIP pod or treatment suite, we recommend booking 2 to 4 days in advance. We also accommodate same-day VIP reservations when openings arise."
  },
  {
    id: "faq-2",
    question: "What makes Diamond Trim different from regular salons?",
    answer: "Unlike crowded open-floor salons with blaring hair dryers and constant foot traffic, Diamond Trim is engineered as a private acoustic retreat. You enjoy individual VIP nail pods, private soundproof treatment rooms, hospital-grade sterilization, and dedicated undivided attention from your specialist."
  },
  {
    id: "faq-3",
    question: "Can I get multiple treatments done simultaneously in a private pod?",
    answer: "Yes! In our private VIP pods, our synchronized dual-artisan service allows you to receive a manicure and pedicure or lash styling at the same time, saving valuable hours while you relax in supreme comfort."
  },
  {
    id: "faq-4",
    question: "Do you offer consultations before committing to a treatment?",
    answer: "Always. We provide complimentary 15-minute consultations — in-person over artisanal tea or directly via WhatsApp photo diagnosis. We evaluate your hair health, skin needs, or nail goals and present transparent fixed pricing before touching a single strand."
  },
  {
    id: "faq-5",
    question: "What hygiene and sterilization protocols do you uphold?",
    answer: "Hygiene is our highest priority. All metal tools undergo ultrasonic cleaning followed by hospital-grade medical autoclave steam sterilization in sealed medical pouches, opened strictly in your presence. Files, buffers, and foot soaks are 100% single-use."
  },
  {
    id: "faq-6",
    question: "Do you cater to both women and men?",
    answer: "Yes. Diamond Trim features dedicated wings and fully private individual suites with specialized protocols for both ladies and gentlemen — from Russian manicures and balayage to precision beard sculpting, scalp rejuvenation, and clinical skin therapies."
  }
];

export const DIFFERENTIATORS = [
  {
    id: "diff-1",
    icon: "ShieldCheck",
    title: "Total Acoustic Privacy",
    description: "Private VIP pods and standalone sound-dampened suites. Experience your service in peaceful seclusion without intrusive salon noise."
  },
  {
    id: "diff-2",
    icon: "Gem",
    title: "Diamond-Grade Craftsmanship",
    description: "Every artisan holds advanced international accreditations. We work exclusively with certified luxury formulations (Oribe, Olaplex, Dermalogica)."
  },
  {
    id: "diff-3",
    icon: "Clock",
    title: "Unhurried, Dedicated Time",
    description: "We never double-book or rush clients out of chairs. Each appointment is allocated generous buffer time so you feel deeply pampered."
  },
  {
    id: "diff-4",
    icon: "Coffee",
    title: "Artisanal Hospitality",
    description: "Enjoy complimentary ceremonial matcha, cold-pressed juices, espresso, and sparkling botanicals served on brass trays."
  }
];

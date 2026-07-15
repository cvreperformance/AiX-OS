/**
 * AiX OS™ — Centralized Brand Content
 * Source: https://cristianvaduva.com + https://aixluxury.com
 * Last extracted: 2026-07-01
 *
 * ALL hardcoded contact info, CTAs, services, and social links
 * across the platform must be imported from this file.
 */

export const brandContent = {
  // ─── Identity ──────────────────────────────────────────────────────────────
  name: "Cristian Văduva",
  tagline: "Real Estate Consultant · Insurance · Investments",
  brand: {
    primary: "AiX OS™",
    luxury: "AiXLuxury.com",
    personal: "CristianVaduva.com",
  },
  locations: ["Monaco", "Dubai", "Bucharest", "Europe"],

  // ─── Contact ───────────────────────────────────────────────────────────────
  contact: {
    phone: "+43 650 953 6345",
    phoneRaw: "+436509536345",
    phoneRO: "+43 650 953 6345",
    phoneRORaw: "+436509536345",
    email: "cristianvaduva@duck.com",
    emailLuxury: "cristianvaduva@duck.com",
    whatsapp: "https://wa.me/436509536345",
    whatsappRO: "https://wa.me/436509536345",
    whatsappText: "https://wa.me/436509536345?text=Hello,%20I%20would%20like%20details%20about%20real%20estate%20services.",
    telegram: "https://t.me/capitalinvestcristianvaduva",
    telegramInvestments: "https://t.me/investitiimobiliareCRISTIANVADUVA",
    address: "Monaco · Dubai · Vienna · Bucharest",
    linktree: "https://linktr.ee/cristianvaduvarealestate",
  },

  // ─── External URLs ─────────────────────────────────────────────────────────
  urls: {
    personal: "https://cristianvaduva.com",
    luxury: "https://aixluxury.com",
    linktree: "https://linktr.ee/cristianvaduvarealestate",
    propertyForm: "https://form.jotform.com/260995822821061",
    insuranceForm: "https://form.jotform.com/260995914926069",
    membershipForm: "https://form.jotform.com/252405778959070",
  },

  // ─── Social Media ──────────────────────────────────────────────────────────
  socials: [
    { platform: "LinkedIn", label: "LinkedIn", href: "https://www.linkedin.com/in/cristianv%C4%83duva", icon: "linkedin" },
    { platform: "Facebook", label: "Facebook", href: "https://www.facebook.com/CristianVaduvaCV", icon: "facebook" },
    { platform: "Instagram", label: "Instagram", href: "https://instagram.com/cristian_vaduva_cristianv", icon: "instagram" },
    { platform: "YouTube", label: "YouTube", href: "https://youtube.com/@CristianVaduvaCV", icon: "youtube" },
    { platform: "Telegram", label: "Capital Invest Telegram", href: "https://t.me/capitalinvestcristianvaduva", icon: "telegram" },
    { platform: "Telegram", label: "Investiții Imobiliare Channel", href: "https://t.me/investitiimobiliareCRISTIANVADUVA", icon: "telegram" },
    { platform: "WhatsApp", label: "WhatsApp Direct", href: "https://wa.me/436509536345", icon: "whatsapp" },
    { platform: "Linktree", label: "All Links", href: "https://linktr.ee/cristianvaduvarealestate", icon: "link" },
  ],

  // ─── Services (extracted from aixluxury.com) ───────────────────────────────
  services: [
    {
      id: "buyer-representation",
      title: "Buyer Representation & Unlisted Deals",
      titleRO: "Reprezentare Cumpărător Imobiliar",
      href: "/buyer",
      desc: "Access opportunities that are not publicly listed in Bucharest, Monaco, or Dubai. We find off-market properties and protect your transaction.",
      descRO: "Reprezentăm cumpărătorul, oferindu-vă acces la oportunități nelistate public și asigurând tranzacția pe tot parcursul achiziției.",
      features: [
        "Filter the market to see only relevant properties",
        "Get the best price with expert negotiation",
        "Verify legal details and avoid hidden risks",
        "Access opportunities that are not publicly listed",
        "Get help with setup and management after purchase",
      ],
    },
    {
      id: "seller-representation",
      title: "Property Sales & Target Marketing",
      titleRO: "Reprezentare și Marketing Vânzare",
      href: "/seller",
      desc: "Your property reaches buyers looking for high-value homes. We qualify buyers rigorously and support you through the entire sales process.",
      descRO: "Vă promovăm proprietatea direct către cumpărători calificați și vă asistăm pe tot parcursul procesului de vânzare.",
      features: [
        "Prepare your home to attract serious buyers",
        "Increase interest with clear, high-quality photos and drone footage",
        "Let buyers tour your property online before visiting",
        "Reach buyers and investors worldwide",
        "Get your property in front of 600+ partner agents",
        "Get expert support to close the deal on your terms",
        "List on global platforms to reach active international buyers",
      ],
    },
    {
      id: "luxury-portfolio",
      title: "Curated High-Value Properties",
      titleRO: "Portofoliu Proprietăți Selectate",
      href: "/proprietati",
      desc: "Find handpicked homes, historic villas, and high-value apartments in sought-after locations across Europe and the Middle East.",
      descRO: "Descoperiți locuințe deosebite, vile istorice și apartamente situate în cele mai căutate zone.",
      features: [
        "Unlisted and off-market properties in Monaco & Dubai",
        "Historic villas in Bucharest's premier areas",
        "Secure early-stage pricing before public launch",
        "Access opportunities that are not publicly listed",
      ],
    },
    {
      id: "insurance",
      title: "Asset & Business Insurance",
      titleRO: "Asigurări & Protecție Bunuri",
      href: "/insurance",
      desc: "Protect your business and properties from financial risks with coverage tailored to your needs.",
      descRO: "Protejați-vă afacerea și activele împotriva riscurilor financiare cu polițe de asigurare personalizate.",
      features: [
        "Protect your business operations and physical assets",
        "Ensure medical and life coverage for your family",
        "Cover your vehicles, travels, and properties against damages",
        "Asigurare obligatorie împotriva dezastrelor naturale (PAD)",
        "Compare offers from over 15 insurers instantly",
      ],
    },
    {
      id: "market-intelligence",
      title: "Market Insights & Pricing Trends",
      titleRO: "Tendințe de Piață și Analize",
      href: "/market",
      desc: "Understand price trends before buying or selling with detailed returns analysis and local market data.",
      descRO: "Înțelegeți evoluția prețurilor și randamentele investiționale înainte de a cumpăra sau a vinde.",
      features: [
        "Analyze rental yields and return on investment",
        "Compare price trends between older central properties and new developments",
        "Plan ahead with data-backed price trend projections",
        "Protect your purchasing power by tracking inflation and currency shifts",
      ],
    },
    {
      id: "private-investor-network",
      title: "Investor Network & Co-Investments",
      titleRO: "Rețea de Investitori și Parteneri",
      href: "/private-wealth",
      desc: "Connect with active capital partners and verified investors looking for joint opportunities.",
      descRO: "Conectați-vă rapid cu parteneri de capital și investitori verificați.",
      features: [
        "Partner with international capital providers",
        "Transact privately without public listing",
        "Connect with verified property professionals and investors",
        "Pool resources with other investors to acquire larger assets",
      ],
    },
    {
      id: "concierge",
      title: "Property Coordination & Management",
      titleRO: "Coordonare Servicii și Administrare",
      href: "/concierge",
      desc: "Get help coordinating services related to your property, from interior design to international relocation and maintenance.",
      descRO: "Primiți sprijin complet pentru administrare, design interior, relocare și servicii conexe proprietății.",
      features: [
        "Get help moving your household internationally",
        "Let us manage daily operations and maintenance",
        "Design your space with trusted professionals",
        "Ensure tax compliance and solid legal structures",
        "Get fast answers whenever you need assistance",
      ],
    },
  ],

  // ─── About / Brand Positioning ─────────────────────────────────────────────
  about: {
    short:
      "Cristian Văduva — Real Estate Consultant, Insurance (Asset Protection) and Investments. Monaco · Dubai · Bucharest.",
    long: `At Cristian Văduva, we help you secure high-value properties and manage your transactions safely and efficiently.

We coordinate property acquisitions in Monaco, Dubai, and Bucharest, matching you with handpicked homes that fit your criteria and leveraging modern search technology to find unlisted opportunities.

We help you analyze price trends, manage assets, and handle administrative details so you can focus on building your portfolio and securing your investments.`,
    mission: "Find and secure the ideal property for your goals.",
    philosophy:
      "In my world, success is not a zero-sum game. It is a culture of winning: If I win, you win. If you win, I win. That is the foundation of lasting partnerships and extraordinary results.",
    expertiseAreas: [
      "Real Estate: Villas, penthouses, and residential assets",
      "Historical Landmarks: Castles, mansions, and properties with unique heritage value",
      "Prestigious Locations: Monaco, Dubai, and premier European destinations",
      "Insurance & Asset Protection",
      "Alternative Investments: Yachts, Cars and more",
    ],
    skills: [
      "Exceptional Negotiation Skills",
      "Deep Market Insight",
      "Commitment to Trust",
      "Holistic Knowledge: financial, legal, and ecological",
      "Leadership & Communication",
      "Ethical Excellence",
    ],
  },

  // ─── CTA Sections ──────────────────────────────────────────────────────────
  cta: [
    {
      id: "main-contact",
      label: "WhatsApp Direct",
      href: "https://wa.me/436509536345?text=Hello,%20I%20would%20like%20details%20about%20real%20estate%20services.",
      variant: "whatsapp" as const,
    },
    {
      id: "property-form",
      label: "Property Inquiry Form",
      href: "https://form.jotform.com/260995822821061",
      variant: "primary" as const,
    },
    {
      id: "insurance-form",
      label: "Insurance Form",
      href: "https://form.jotform.com/260995914926069",
      variant: "secondary" as const,
    },
    {
      id: "membership-form",
      label: "Club Membership",
      href: "https://form.jotform.com/252405778959070",
      variant: "premium" as const,
    },
    {
      id: "linktree",
      label: "All Links",
      href: "https://linktr.ee/cristianvaduvarealestate",
      variant: "outline" as const,
    },
    {
      id: "consultation",
      label: "Solicită Consultanță Gratuită",
      href: "https://wa.me/436509536345",
      variant: "primary" as const,
    },
  ],

  // ─── Market Insight (static, sourced from aixluxury.com) ──────────────────
  marketInsight: {
    headline:
      "In Bucharest, OLD apartments (€2,653/sqm) are 27% MORE EXPENSIVE than NEW builds (€2,099/sqm)",
    explanation:
      "A phenomenon unique in Romania and rare across Europe. Root cause: 21% VAT on new residential construction (August 2025) redirected buyer demand to the secondary market. Centrally located, metro-connected older apartments now command a structural premium over new peripheral developments.",
    source: "Storia/OLX Mar 2026 · Imobiliare.ro · Crosspoint/Savills · Compiled by Cristian Văduva — AiXLuxury.com",
    updatedAt: "2026-03-01",
  },

  // ─── Footer ────────────────────────────────────────────────────────────────
  footer: {
    copyright: `Copyright ${new Date().getFullYear()}. All rights reserved.`,
    legal: [
      { label: "Legal Notice", href: "https://aixluxury.com/legal-notice" },
      { label: "Privacy", href: "https://aixluxury.com/privacy" },
    ],
    tagline: "AiXLuxury.com · CristianVaduva.com · Monaco · Dubai · Bucharest",
  },
};

// ─── Convenience re-exports ────────────────────────────────────────────────

export const contactInfo = brandContent.contact;
export const socialLinks = brandContent.socials;
export const ctaLinks = brandContent.cta;
export const brandServices = brandContent.services;

/** Gets a CTA by id */
export function getCta(id: string) {
  return brandContent.cta.find((c) => c.id === id);
}

/** Gets a service by id */
export function getService(id: string) {
  return brandContent.services.find((s) => s.id === id);
}

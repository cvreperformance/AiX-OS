/**
 * AiX OS — Centralized Brand Content
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
    primary: "AiX OS",
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
      title: "Exclusive Buyer Representation",
      titleRO: "Reprezentare Exclusivă Cumpărător",
      href: "/buyer",
      desc: "Exclusive assistance for purchasing luxury properties in Bucharest, Monaco, or Dubai. We identify off-market opportunities and ensure secured transactions.",
      descRO: "Reprezentăm exclusiv cumpărătorul și acționăm în interesul acestuia pe întreg parcursul procesului de achiziție.",
      features: [
        "Market analysis and offer filtering",
        "Professional price negotiation",
        "Legal support and technical due diligence",
        "Access to off-market properties",
        "Full post-purchase support",
      ],
    },
    {
      id: "seller-representation",
      title: "Seller Representation & Marketing",
      titleRO: "Reprezentare și Marketing Vânzare",
      href: "/seller",
      desc: "Customized marketing plan to maximize the value of your property. Exclusive promotion, rigorous buyer qualification, and full assistance.",
      descRO: "Plan de marketing personalizat pentru maximizarea valorii proprietății. Promovare exclusivă și calificarea riguroasă a cumpărătorilor.",
      features: [
        "Home staging and photo/video preparation",
        "Premium HDR photography + drone video",
        "Interactive 3D virtual tour",
        "Direct international exposure",
        "Distribution to 600+ partner agents",
        "Dedicated negotiation and legal support",
        "Exposure on Chestertons & JamesEdition.com",
      ],
    },
    {
      id: "luxury-portfolio",
      title: "Luxury Property Portfolio",
      titleRO: "Portofoliu Proprietăți Premium",
      href: "/proprietati",
      desc: "Exclusive portfolio of premium residential properties, historic villas, and luxury apartments in the most prestigious European and Middle Eastern addresses.",
      descRO: "Portofoliu exclusiv de proprietăți rezidențiale premium, vile istorice și apartamente de lux.",
      features: [
        "Exclusive properties in Monaco & Dubai",
        "Belle Époque villas in Bucharest",
        "Preferential access to off-plan projects",
        "Off-market private opportunities",
      ],
    },
    {
      id: "insurance",
      title: "Insurance & Asset Protection",
      titleRO: "Asigurări & Protecție Active",
      href: "/insurance",
      desc: "Consulting and brokerage for a full range of insurance solutions for companies and individuals through trusted partners.",
      descRO: "Consultanță și brokeraj pentru soluții complete de asigurare prin parteneri de încredere.",
      features: [
        "Business & Corporate Insurance",
        "Life & Health Insurance",
        "Travel, Auto, Home & Assets",
        "PAD obligatoriu",
        "Comparare automată 15+ asigurători",
      ],
    },
    {
      id: "market-intelligence",
      title: "Market Intelligence & Analytics",
      titleRO: "Analiză și Intelligence de Piață",
      href: "/market",
      desc: "Access to detailed macroeconomic analyses, yield reports from EU capitals, and real-time developments for price per square meter in premium areas.",
      descRO: "Analize macroeconomice detaliate, rapoarte de randament din capitalele UE și evoluția prețului pe metru pătrat.",
      features: [
        "ROI studies",
        "Price paradox analysis (old vs new builds)",
        "Asset value evolution forecasts",
        "EUR/RON & inflation tracking",
      ],
    },
    {
      id: "private-investor-network",
      title: "Private Investor Network",
      titleRO: "Rețea Privată de Investitori",
      href: "/private-wealth",
      desc: "Direct connection with qualified private investors (UHNW) from the world's major financial capitals.",
      descRO: "Conexiune directă cu investitori privați calificați (UHNW) din principalele capitale financiare globale.",
      features: [
        "Direct relations with foreign investors",
        "Discrete off-market private transactions",
        "Exclusive networking",
        "Co-investment opportunities",
      ],
    },
    {
      id: "concierge",
      title: "Luxury Concierge",
      titleRO: "Concierge de Lux",
      href: "/concierge",
      desc: "Beyond the sale — ongoing management, interior design, relocation, and lifestyle services to enhance your living experience.",
      descRO: "Dincolo de vânzare — management continuu, design interior, relocare și servicii lifestyle premium.",
      features: [
        "International relocation assistance",
        "Property management",
        "Interior design consulting",
        "Legal & fiscal advisory",
        "24/7 dedicated support",
      ],
    },
  ],

  // ─── About / Brand Positioning ─────────────────────────────────────────────
  about: {
    short:
      "Cristian Văduva — Real Estate Consultant, Insurance (Asset Protection) and Investments. Monaco · Dubai · Bucharest.",
    long: `At Cristian Văduva and AiXLuxury.com, we take pride in offering fast, efficient, and personalized services, ensuring every transaction is as seamless as it is successful.

AiXLuxury.com: where luxury real estate reaches new heights in Monaco, Dubai, and Bucharest, Europe and beyond. We offer an exclusive selection of the finest properties, blending breathtaking architecture with cutting-edge technology for a bespoke experience.

Our commitment to privacy, concierge services, and market insights ensures we're not just selling homes — we're crafting unparalleled lifestyles for the world's elite.`,
    mission: "Discover Luxury, Redefined for You.",
    philosophy:
      "In my world, success is not a zero-sum game. It is a culture of winning: If I win, you win. If you win, I win. That is the foundation of lasting partnerships and extraordinary results.",
    expertiseAreas: [
      "Luxury Real Estate: Villas, penthouses, and high-end properties",
      "Historical Landmarks: Castles, mansions, and palaces with unique heritage value",
      "Prestigious Locations: Monaco, Dubai, and premier European destinations",
      "Insurance & Asset Protection",
      "Alternative Investments: Yachts, Supercars and more",
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

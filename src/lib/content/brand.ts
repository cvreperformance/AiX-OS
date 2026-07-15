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
      title: "Avoid bidding wars and find unlisted properties",
      titleRO: "Evită licitațiile publice și găsește proprietăți nelistate",
      href: "/buyer",
      desc: "Find properties directly from owners before they reach public portals, and eliminate agent commissions.",
      descRO: "Găsește proprietăți direct de la proprietar înainte să apară pe portalurile publice și elimini comisioanele de intermediere.",
      features: [
        "Filter out properties that do not match your exact yield or lifestyle criteria",
        "Reduce purchase price by leveraging local transaction history in negotiations",
        "Detect title issues and structural risks before making any down payment",
        "Access a private database of properties that are not listed publicly",
        "Get complete coordination for property setup, tenancy, and local tax setup",
      ],
    },
    {
      id: "seller-representation",
      title: "Sell your home directly to verified buyers without public price drops",
      titleRO: "Vinde proprietatea direct către cumpărători calificați, fără expunere publică",
      href: "/seller",
      desc: "Reach active capital partners and qualified buyers directly, allowing you to close the sale at full market value without public pricing history.",
      descRO: "Promovează proprietatea direct către investitori cu fonduri verificate și vinde fără istoric public de prețuri.",
      features: [
        "Prepare and arrange your property to attract high-value offers immediately",
        "Increase property listings interest with high-definition drone footage and virtual tours",
        "Allow buyers to inspect your property online to filter out non-serious visits",
        "Publish directly to international buyer networks in Monaco, London, and Dubai",
        "Leverage partner agents to find a buyer quickly",
        "Get professional contract drafting and negotiation to secure your sale terms",
        "List on global platforms Chestertons and JamesEdition to access foreign capital",
      ],
    },
    {
      id: "luxury-portfolio",
      title: "Find properties in sought-after locations with stable rental yields",
      titleRO: "Găsește locuințe în zone premium cu randament stabil de închiriere",
      href: "/proprietati",
      desc: "Browse a curated database of verified residential properties, historic villas, and centrally located apartments in European and Middle Eastern capitals.",
      descRO: "Descoperă vile istorice și apartamente verificate cu potențial ridicat de apreciere în timp.",
      features: [
        "Secure off-market property options in Monaco & Dubai",
        "Acquire historic landmark villas in central areas of Bucharest",
        "Lock in early-stage pricing before public launch on off-plan projects",
        "Access deals that are not indexed or searched on public search engines",
      ],
    },
    {
      id: "insurance",
      title: "Protect your property assets against damage and liability risks",
      titleRO: "Protejează-ți clădirile și afacerile împotriva riscurilor financiare",
      href: "/insurance",
      desc: "Compare coverage options from accredited insurers to lower your premium rates while securing full asset protection.",
      descRO: "Compară ofertele de la asigurători autorizați pentru a reduce costurile cu asigurările.",
      features: [
        "Insure business operations and commercial buildings against liability claims",
        "Secure health and life coverage plans for your key business partners and family",
        "Cover vehicles, machinery, and residential structures under a single portal",
        "Comply with legal requirements through mandatory natural disaster coverage (PAD)",
        "Compare quotes and issue policies online instantly",
      ],
    },
    {
      id: "market-intelligence",
      title: "Track local price trends to avoid overpaying for properties",
      titleRO: "Monitorizează evoluția prețurilor pentru a nu cumpăra supraevaluat",
      href: "/market",
      desc: "Access actual transaction data, sub-zone returns analysis, and capital yield reports to identify under-priced properties before buying.",
      descRO: "Analizează randamentele din capitalele europene și prețurile reale de tranzacționare pentru a lua decizii informate.",
      features: [
        "Model rental cash flow and net yield estimations before bidding",
        "Analyze price differences between central old builds and peripheral new builds",
        "Project price trends for the near future based on BNR data",
        "Monitor ROBOR, IRCC, and inflation rates to protect your purchasing power",
      ],
    },
    {
      id: "private-investor-network",
      title: "Find vetted capital partners for your next real estate deal",
      titleRO: "Găsește parteneri de capital pentru proiecte de investiții",
      href: "/private-wealth",
      desc: "Connect directly with verified investors and family offices looking to pool resources for co-investments and private acquisitions.",
      descRO: "Conectează-te cu investitori verificați și co-investește în proiecte imobiliare mari.",
      features: [
        "Partner with international private capital providers looking for local exposure",
        "Fund large residential or commercial projects through joint venture structures",
        "Access off-market deal spaces to review high-value opportunities privately",
        "Acquire larger assets by pooling capital with other qualified network members",
      ],
    },
    {
      id: "concierge",
      title: "Coordinate relocation, transport, and management from one dashboard",
      titleRO: "Administrează relocarea, transportul și proprietatea fără efort",
      href: "/concierge",
      desc: "Get dedicated support to manage relocation paperwork, arrange private transport charters, design interiors, and handle local property maintenance.",
      descRO: "Primești sprijin complet pentru administrare, design interior, relocare și întreținerea proprietăților.",
      features: [
        "Get door-to-door relocation assistance for international moves",
        "Outsource property maintenance, tenancy management, and cleaning",
        "Find verified interior designers to increase your property's market value",
        "Resolve local legal and fiscal tax registration issues through local experts",
        "Access support agent via WhatsApp for fast issue resolution",
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

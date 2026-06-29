import type {
  Agency,
  Developer,
  MarketIndicator,
  NewsArticle,
  Opportunity,
  Property,
} from "./types";

export const marketIndicators: MarketIndicator[] = [
  { label: "ROBOR 3M", value: "6.85%", change: "+0.12", trend: "up" },
  { label: "EUR/RON", value: "4.97", change: "-0.02", trend: "down" },
  { label: "Inflație RO", value: "5.3%", change: "-0.4", trend: "down" },
  { label: "Preț mediu m² București", value: "€2,450", change: "+3.2%", trend: "up" },
];

export const properties: Property[] = [
  {
    id: "1",
    slug: "penthouse-floreasca-lake",
    title: "Penthouse Floreasca Lake — Vedere Panoramică",
    description:
      "Penthouse exclusivist cu terasă de 120 mp, finisaje premium și vedere completă spre lac. Proiect finalizat 2024, certificat energie A.",
    price: 890000,
    currency: "EUR",
    location: "Floreasca",
    city: "București",
    property_type: "Penthouse",
    bedrooms: 4,
    bathrooms: 3,
    area_sqm: 285,
    image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    aix_score: 9.2,
    score_explanation:
      "Locație premium, supply limitat, cerere crescută din segmentul luxury. Fundamentale solide pe termen lung.",
    investment_insight:
      "Potențial apreciere 8-12% anual în următorii 3 ani. Yield estimat din chirii premium: 4.2%.",
    features: ["Terasă 120mp", "Parcare 2 locuri", "Smart Home", "Concierge"],
    status: "active",
    featured: true,
  },
  {
    id: "2",
    slug: "vila-pipera-scandinavia",
    title: "Vilă Modernă Pipera — Scandinavia Residence",
    description:
      "Vilă cu design nordic, grădină 500 mp, piscină și zonă BBQ. Comunitate gated, acces rapid spre Băneasa.",
    price: 650000,
    currency: "EUR",
    location: "Pipera",
    city: "București",
    property_type: "Vilă",
    bedrooms: 5,
    bathrooms: 4,
    area_sqm: 340,
    image_url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    aix_score: 8.7,
    score_explanation:
      "Zonă cu infrastructură în dezvoltare, cerere stabilă din familii high-net-worth.",
    investment_insight:
      "Excelent pentru locuire + apreciere. Comparabil cu Pipera Nord la preț cu 15% sub piață.",
    features: ["Piscină", "Grădină 500mp", "Gated Community", "Garaj dublu"],
    status: "active",
    featured: true,
  },
  {
    id: "3",
    slug: "apartament-herastrau-2-camere",
    title: "Apartament 2 Camere Herăstrău — Investiție",
    description:
      "Apartament complet mobilat, ideal pentru investiție Airbnb sau chirie corporate. ROI estimat 7.5%.",
    price: 185000,
    currency: "EUR",
    location: "Herăstrău",
    city: "București",
    property_type: "Apartament",
    bedrooms: 2,
    bathrooms: 1,
    area_sqm: 72,
    image_url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    aix_score: 8.1,
    score_explanation:
      "Yield ridicat, locație cu cerere constantă din expats și corporații.",
    investment_insight:
      "Cash-on-cash return estimat 7.5% din chirie. Payback period ~11 ani.",
    features: ["Mobilat complet", "Parcare", "Balcon", "AC"],
    status: "active",
    featured: false,
  },
  {
    id: "4",
    slug: "spatiu-comercial-victoriei",
    title: "Spațiu Comercial Bulevardul Victoriei",
    description:
      "Spațiu ground floor, vitrină stradală, trafic pietonal intens. Contract chirie existent până 2028.",
    price: 420000,
    currency: "EUR",
    location: "Victoriei",
    city: "București",
    property_type: "Comercial",
    area_sqm: 180,
    image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    aix_score: 7.8,
    score_explanation:
      "Locație centrală cu lichiditate bună. Chiriaș stabil reduce riscul.",
    investment_insight: "Yield din chirie: 8.2% brut. Asset defensiv în portofoliu.",
    features: ["Vitrină stradală", "Chiriaș activ", "Renovare 2023"],
    status: "active",
    featured: false,
  },
  {
    id: "5",
    slug: "teren-corbeanca-residential",
    title: "Teren Rezidențial Corbeanca — 1,200 mp",
    description:
      "Teren intravilan cu PUD aprobat pentru 4 vile. Utilități la limita proprietății.",
    price: 95000,
    currency: "EUR",
    location: "Corbeanca",
    city: "Ilfov",
    property_type: "Teren",
    area_sqm: 1200,
    image_url: "https://images.unsplash.com/photo-1500382017468-90403fed3eff?w=800&q=80",
    aix_score: 7.2,
    score_explanation:
      "Expansiune urbană spre nord. PUD aprobat reduce riscul de dezvoltare.",
    investment_insight:
      "Potențial dezvoltator: ROI 25-35% la exit după construcție.",
    features: ["PUD aprobat", "Utilități", "Drum asfaltat"],
    status: "active",
    featured: false,
  },
  {
    id: "6",
    slug: "apartament-primaverii-luxury",
    title: "Apartament 3 Camere Primăverii — Luxury",
    description:
      "Apartament în clădire boutique, 3 camere + dressing, finisaje marmură și lemn masiv.",
    price: 520000,
    currency: "EUR",
    location: "Primăverii",
    city: "București",
    property_type: "Apartament",
    bedrooms: 3,
    bathrooms: 2,
    area_sqm: 145,
    image_url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    aix_score: 9.0,
    score_explanation:
      "Primăverii rămâne cel mai stabil segment luxury din București. Supply extrem de limitat.",
    investment_insight:
      "Asset de păstrare pe termen lung. Apreciere istorică 6-9% anual.",
    features: ["Dressing", "Marmură", "Parcare subterană", "Security 24/7"],
    status: "active",
    featured: true,
  },
];

export const newsArticles: NewsArticle[] = [
  {
    id: "1",
    slug: "bnr-dobanda-referinta-2026",
    title: "BNR menține dobânda de referință la 6.50% — Impact asupra pieței imobiliare",
    summary:
      "Banca Națională a României a decis menținerea dobânzii de referință, semnalând stabilitate pe termen scurt pentru creditele ipotecare.",
    category: "Macroeconomie",
    image_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    aix_score: 8.5,
    score_explanation:
      "Decizie BNR afectează direct costul finanțării și cererea imobiliară.",
    investment_insight:
      "Investitorii cu finanțare aprobată ar trebui să profite de fereastra actuală. Cumpărătorii cash câștigă putere de negociere.",
    status: "published",
    published_at: "2026-06-25T10:00:00Z",
  },
  {
    id: "2",
    slug: "pipera-nord-dezvoltare-infrastructura",
    title: "Pipera Nord: Noi proiecte de infrastructură acceleratează aprecierea",
    summary:
      "Primăria a aprobat extinderea rețelei de transport și noi legături cu DN1, ceea ce va reduce timpul de navetă cu 20%.",
    category: "Infrastructură",
    image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    aix_score: 7.8,
    score_explanation:
      "Infrastructura este driver principal de apreciere în zonele periurbane.",
    investment_insight:
      "Zonele din proximitatea noilor noduri de transport vor beneficia primul. Window de oportunitate: 12-18 luni.",
    status: "published",
    published_at: "2026-06-24T14:30:00Z",
  },
  {
    id: "3",
    slug: "segment-luxury-bucuresti-q2-2026",
    title: "Segmentul luxury București: +12% YoY — Supply record de livrări în Q3",
    summary:
      "Peste 800 de unități premium vor fi livrate în Q3 2026, dar cererea din segmentul €500K+ rămâne robustă.",
    category: "Real Estate",
    image_url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    aix_score: 8.2,
    score_explanation:
      "Dinamica supply/demand în luxury determină pricing power pe termen mediu.",
    investment_insight:
      "Evită proiectele fără diferențiere. Focus pe locații cu supply limitat: Primăverii, Floreasca, Herăstrău.",
    status: "published",
    published_at: "2026-06-23T09:00:00Z",
  },
  {
    id: "4",
    slug: "robor-scade-usor-iunie",
    title: "ROBOR 3M scade ușor la 6.85% — Semnal pozitiv pentru piața creditelor",
    summary:
      "Indicele ROBOR continuă tendința descendentă ușoară, oferind respiro cumpărătorilor cu credite variabile.",
    category: "Dobânzi",
    image_url: "https://images.unsplash.com/photo-1554224311-9b9459a08667?w=800&q=80",
    aix_score: 7.5,
    score_explanation: "ROBOR influențează direct rata lunară a creditelor ipotecare.",
    investment_insight:
      "Monitorizează refinanțarea dacă ești la rată variabilă. Fix rate devine mai atractiv sub 7%.",
    status: "published",
    published_at: "2026-06-22T11:00:00Z",
  },
];

export const developers: Developer[] = [
  {
    id: "1",
    slug: "one-united-properties",
    name: "One United Properties",
    description:
      "Liderul pieței imobiliare premium din România. Portofoliu de proiecte rezidențiale și mix-use în București.",
    aix_score: 9.1,
    score_explanation:
      "Track record solid, brand puternic, acces la finanțare preferențială.",
    projects_count: 12,
    city: "București",
    status: "active",
  },
  {
    id: "2",
    slug: "impact-developer",
    name: "Impact Developer & Contractor",
    description:
      "Dezvoltator activ în segmentul mid-to-premium, cu focus pe sustenabilitate și certificări green.",
    aix_score: 8.4,
    score_explanation: "Proiecte bine poziționate, livrări la timp, feedback pozitiv.",
    projects_count: 8,
    city: "București",
    status: "active",
  },
  {
    id: "3",
    slug: "speedwell",
    name: "Speedwell",
    description:
      "Dezvoltator belgian cu proiecte premium în București. Focus pe design și calitate construcție.",
    aix_score: 8.8,
    score_explanation:
      "Standard european de construcție, poziționare premium consistentă.",
    projects_count: 5,
    city: "București",
    status: "active",
  },
  {
    id: "4",
    slug: "granvia-residence",
    name: "Granvia Residence",
    description:
      "Specialist în proiecte boutique de lux, volume mici, personalizare maximă.",
    aix_score: 8.6,
    score_explanation: "Nisa luxury boutique cu clienți recurenti și referral rate ridicat.",
    projects_count: 4,
    city: "București",
    status: "active",
  },
];

export const agencies: Agency[] = [
  {
    id: "1",
    slug: "cristian-vaduva-real-estate",
    name: "Cristian Vaduva Real Estate",
    description:
      "Buyer representation, luxury properties și market intelligence. Parte din ecosistemul AiX OS.",
    phone: "+40 7XX XXX XXX",
    email: "contact@cristianvaduva.com",
    city: "București",
    aix_score: 9.5,
    properties_count: 45,
    status: "active",
  },
  {
    id: "2",
    slug: "aixluxury-properties",
    name: "AiX Luxury Properties",
    description:
      "Specialiști în proprietăți premium, off-market deals și investiții internaționale.",
    phone: "+40 7XX XXX XXX",
    email: "info@aixluxury.com",
    city: "București",
    aix_score: 9.2,
    properties_count: 38,
    status: "active",
  },
  {
    id: "3",
    slug: "premium-estates-ro",
    name: "Premium Estates Romania",
    description:
      "Agenție boutique focusată pe segmentul €300K+, cu rețea internațională de cumpărători.",
    city: "București",
    aix_score: 8.3,
    properties_count: 22,
    status: "active",
  },
];

export const opportunities: Opportunity[] = [
  {
    id: "1",
    slug: "off-market-floreasca-triplex",
    title: "Off-Market Triplex Floreasca — Sub preț de piață",
    description:
      "Triplex 320 mp, vândut discret de proprietar. Preț cu 12% sub comparabile. Disponibil 14 zile.",
    opportunity_type: "Off-Market",
    location: "Floreasca, București",
    min_investment: 720000,
    currency: "EUR",
    expected_yield: 4.5,
    aix_score: 9.3,
    score_explanation:
      "Preț sub piață, locație premium, vânzare motivată — factori rari simultan.",
    investment_insight:
      "Negociere suplimentară posibilă 3-5%. Recomandare: due diligence rapid, rezervare cu avans.",
    image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    status: "active",
    featured: true,
  },
  {
    id: "2",
    slug: "development-corbeanca-4-vile",
    title: "Dezvoltare 4 Vile Corbeanca — PUD Aprobat",
    description:
      "Teren 4,800 mp cu PUD aprobat. Cost construcție estimat €1.2M, valoare exit €2.1M.",
    opportunity_type: "Dezvoltare",
    location: "Corbeanca, Ilfov",
    min_investment: 350000,
    currency: "EUR",
    expected_yield: 28,
    aix_score: 8.5,
    score_explanation:
      "PUD aprobat reduce riscul regulamentar. ROI proiectat peste media pieței.",
    investment_insight:
      "Parteneriat cu dezvoltator local recomandat. Timeline: 18-24 luni.",
    image_url: "https://images.unsplash.com/photo-1500382017468-90403fed3eff?w=800&q=80",
    status: "active",
    featured: true,
  },
  {
    id: "3",
    slug: "portfolio-chirii-corporate-herastrau",
    title: "Portofoliu 3 Apartamente Herăstrău — Chirie Corporate",
    description:
      "Pachet 3 apartamente mobilate, contracte corporate active, yield 7.8% brut.",
    opportunity_type: "Portofoliu",
    location: "Herăstrău, București",
    min_investment: 520000,
    currency: "EUR",
    expected_yield: 7.8,
    aix_score: 8.8,
    score_explanation:
      "Yield stabil, chiriași corporate, diversificare pe 3 unități.",
    investment_insight:
      "Ideal pentru investitori care caută cash flow, nu speculație.",
    image_url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    status: "active",
    featured: false,
  },
];

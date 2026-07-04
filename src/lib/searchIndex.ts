import {
  Brain,
  Building2,
  Shield,
  Scale,
  Sliders,
  Coins,
  Lock,
  Sparkles,
  Plane,
  Globe,
  Activity,
  Calculator,
  FileText,
  User,
  Key,
  Compass,
  Bookmark,
  Newspaper,
  BookOpen,
} from "lucide-react";

export interface IndexItem {
  title: string;
  category:
    | "Services"
    | "Properties"
    | "Developers"
    | "Books"
    | "Education"
    | "Market Pulse"
    | "Tools"
    | "Travel"
    | "Cybersecurity"
    | "Legal";
  desc: string;
  href: string;
  icon: any;
  keywords: string[];
  actionLabel?: string;
}

export const ALL_SEARCH_INDEX: IndexItem[] = [
  // ─── SERVICES ──────────────────────────────────────────────────────────────
  {
    title: "AI Advisor",
    category: "Services",
    desc: "Intelligent AI financial and real estate consultancy.",
    href: "/money-advisor",
    icon: Brain,
    keywords: ["ai", "advisor", "money", "chat", "consultant", "wealth", "financial"],
    actionLabel: "Chat Now",
  },
  {
    title: "AntiȚeapă AI / Scanner",
    category: "Services",
    desc: "Cadastral map audit, court disputes, and risk analysis scanner.",
    href: "/anti-teapa",
    icon: Shield,
    keywords: ["anti", "teapa", "scan", "risk", "dispute", "liens", "mortgage", "scam", "cadastre"],
    actionLabel: "Audit Asset",
  },
  {
    title: "Buyer Representation",
    category: "Services",
    desc: "Exclusive guidance and negotiation audits for buying high-value properties.",
    href: "/buyer",
    icon: Key,
    keywords: ["buyer", "rep", "buy", "representare", "cumparator", "negotiation"],
    actionLabel: "Hire Broker",
  },
  {
    title: "Seller Representation",
    category: "Services",
    desc: "Maximize asset exposure and valuation through data-driven exclusive brokerage.",
    href: "/seller",
    icon: Building2,
    keywords: ["seller", "vinde", "vanzare", "representare", "vanzator", "market"],
    actionLabel: "List Property",
  },
  {
    title: "RO Law Desk",
    category: "Services",
    desc: "Romanian legal framework and notarization audit checklists.",
    href: "/law",
    icon: Scale,
    keywords: ["law", "lege", "legal", "notar", "notary", "taxes", "contract"],
    actionLabel: "Read Guide",
  },
  {
    title: "Insurance Desk",
    category: "Services",
    desc: "PAD and optional property insurance analysis & quotes.",
    href: "/insurance",
    icon: Shield,
    keywords: ["insurance", "asigurare", "pad", "calculator", "premium", "home"],
    actionLabel: "Get Quote",
  },
  {
    title: "Luxury Concierge & Relocation",
    category: "Services",
    desc: "UHNW lifestyle assistance, asset relocation, and off-market concierge.",
    href: "/concierge",
    icon: Sparkles,
    keywords: ["concierge", "luxury", "relocation", "lifestyle", "monaco", "yacht"],
    actionLabel: "Request Assist",
  },
  {
    title: "Off-Market Portal",
    category: "Services",
    desc: "Private discrete real estate deals under strict NDA.",
    href: "/off-market",
    icon: Lock,
    keywords: ["off", "market", "private", "nda", "discrete", "secrets"],
    actionLabel: "Access Deals",
  },

  // ─── PROPERTIES ────────────────────────────────────────────────────────────
  {
    title: "Penthouse Floreasca Lake",
    category: "Properties",
    desc: "Luxury 4-room penthouse in Bucharest North with panoramic lake view.",
    href: "/proprietati/penthouse-floreasca-lake",
    icon: Building2,
    keywords: ["apartament", "penthouse", "floreasca", "lake", "bucuresti", "nord"],
    actionLabel: "View Details",
  },
  {
    title: "Vila Modernă Pipera",
    category: "Properties",
    desc: "Eco-friendly premium villa with solar panels and a private pool.",
    href: "/proprietati/vila-premium-pipera",
    icon: Building2,
    keywords: ["vila", "pipera", "house", "casa", "sustainable", "pool"],
    actionLabel: "View Details",
  },
  {
    title: "Apartament Dorobanți Glass",
    category: "Properties",
    desc: "Ultra-luxury glass facade apartment in premium residential district.",
    href: "/proprietati/apartament-dorobanti-glass",
    icon: Building2,
    keywords: ["apartament", "dorobanti", "glass", "luxury"],
    actionLabel: "View Details",
  },

  // ─── DEVELOPERS & AGENCIES ─────────────────────────────────────────────────
  {
    title: "One United Properties",
    category: "Developers",
    desc: "Leading green premium real estate developer in Romania.",
    href: "/dezvoltatori/one-united-properties",
    icon: Compass,
    keywords: ["one", "united", "properties", "developer", "dezvoltator", "bucuresti"],
    actionLabel: "Audit Developer",
  },
  {
    title: "Emaar Properties",
    category: "Developers",
    desc: "Creator of Burj Khalifa and global master-planned developer in Dubai.",
    href: "/dezvoltatori/emaar-properties",
    icon: Globe,
    keywords: ["emaar", "dubai", "developer", "burj", "khalifa", "investments"],
    actionLabel: "Audit Developer",
  },
  {
    title: "Pastor Group Monaco",
    category: "Developers",
    desc: "Exclusive luxury construction and management operator in Monte-Carlo.",
    href: "/dezvoltatori/pastor-group",
    icon: Compass,
    keywords: ["pastor", "monaco", "monte", "carlo", "luxury", "developer"],
    actionLabel: "Audit Developer",
  },

  // ─── BOOKS ─────────────────────────────────────────────────────────────────
  {
    title: "The Millionaire Real Estate Investor",
    category: "Books",
    desc: "Gary Keller's core blueprint for real estate wealth structures.",
    href: "/books",
    icon: BookOpen,
    keywords: ["book", "gary", "keller", "investor", "real", "estate", "millionaire"],
    actionLabel: "View Book",
  },
  {
    title: "Never Split the Difference",
    category: "Books",
    desc: "Chris Voss's tactical empathy negotiation secrets.",
    href: "/books",
    icon: BookOpen,
    keywords: ["book", "voss", "negotiation", "never", "split", "difference", "negotiate"],
    actionLabel: "View Book",
  },
  {
    title: "The Psychology of Money",
    category: "Books",
    desc: "Morgan Housel's exploration of cognitive behavior and financial choices.",
    href: "/books",
    icon: BookOpen,
    keywords: ["book", "housel", "psychology", "money", "wealth", "behavior"],
    actionLabel: "View Book",
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    category: "Books",
    desc: "Yuval Noah Harari's macro view of cognitive myths and credit systems.",
    href: "/books",
    icon: BookOpen,
    keywords: ["book", "harari", "sapiens", "history", "humankind", "society"],
    actionLabel: "View Book",
  },
  {
    title: "Extreme Ownership: Lead and Win",
    category: "Books",
    desc: "Jocko Willink & Leif Babin's rules on total team accountability.",
    href: "/books",
    icon: BookOpen,
    keywords: ["book", "jocko", "willink", "extreme", "ownership", "leadership", "win"],
    actionLabel: "View Book",
  },

  // ─── EDUCATION ─────────────────────────────────────────────────────────────
  {
    title: "Buying Property Guide",
    category: "Education",
    desc: "Checklist and parameters for property acquisitions.",
    href: "/learning",
    icon: Key,
    keywords: ["education", "buying", "guide", "achizitie", "cumparare", "checklist"],
    actionLabel: "Study Guide",
  },
  {
    title: "Tax & Fiscal Auditing",
    category: "Education",
    desc: "VAT rates (9%, 19%), rental lease registration, and transfer taxes.",
    href: "/learning",
    icon: Coins,
    keywords: ["tax", "fiscal", "tva", "anaf", "impozit", "taxes"],
    actionLabel: "Study Guide",
  },
  {
    title: "Legal & Due Diligence Checklists",
    category: "Education",
    desc: "Ownership chain audits, liens, and title clearance benchmarks.",
    href: "/learning",
    icon: Scale,
    keywords: ["legal", "cadastru", "intabulare", "carte", "funciara", "due", "diligence"],
    actionLabel: "Study Guide",
  },

  // ─── MARKET PULSE ──────────────────────────────────────────────────────────
  {
    title: "BNR Exchange Rates & Macro",
    category: "Market Pulse",
    desc: "Live EUR/RON, USD/RON exchange rates, BNR key policy rate, and CPI inflation.",
    href: "/market",
    icon: Activity,
    keywords: ["bnr", "exchange", "rate", "eur", "ron", "usd", "macro", "inflation", "dobanda"],
    actionLabel: "View Rates",
  },
  {
    title: "Gold & Commodities Spot",
    category: "Market Pulse",
    desc: "Live calculated Gold spot per ounce and equivalent RON price per gram.",
    href: "/market",
    icon: Activity,
    keywords: ["gold", "spot", "aur", "silver", "argint", "gram", "commodity"],
    actionLabel: "View Spot",
  },

  // ─── TOOLS ─────────────────────────────────────────────────────────────────
  {
    title: "Mortgage Calculator",
    category: "Tools",
    desc: "Calculate monthly interest installments, principal payments, and DTI limits.",
    href: "/apps",
    icon: Calculator,
    keywords: ["calculator", "credit", "ipotecar", "mortgage", "rata", "dobanda", "principal"],
    actionLabel: "Use Tool",
  },
  {
    title: "ROI & Yield Calculator",
    category: "Tools",
    desc: "Calculate cashflow yield, return on investment, and capital recovery timeframes.",
    href: "/apps",
    icon: Calculator,
    keywords: ["calculator", "yield", "roi", "rentabilitate", "investitie", "chirii"],
    actionLabel: "Use Tool",
  },
  {
    title: "PDF Tool & OCR Reader",
    category: "Tools",
    desc: "Open source text extraction and document previewing utility.",
    href: "/apps",
    icon: FileText,
    keywords: ["pdf", "ocr", "read", "preview", "document", "extract"],
    actionLabel: "Use Tool",
  },
  {
    title: "GIS Mapping Platform",
    category: "Tools",
    desc: "Spatial property, developer, and infrastructure mapping system.",
    href: "/map",
    icon: Globe,
    keywords: ["gis", "map", "harta", "location", "marker", "radar", "coords"],
    actionLabel: "Open Map",
  },
];

export function querySearchIndex(query: string): IndexItem[] {
  if (!query.trim()) return [];
  const lower = query.toLowerCase().trim();

  return ALL_SEARCH_INDEX.filter((item) => {
    // Check match in title, category, description, and keywords array
    const titleMatch = item.title.toLowerCase().includes(lower);
    const categoryMatch = item.category.toLowerCase().includes(lower);
    const descMatch = item.desc.toLowerCase().includes(lower);
    const keywordMatch = item.keywords.some((k) => k.toLowerCase().includes(lower));

    return titleMatch || categoryMatch || descMatch || keywordMatch;
  });
}

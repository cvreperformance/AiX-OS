import {
  Brain,
  Building2,
  Activity,
  Coins,
  Shield,
  Scale,
  Cpu,
  Lock,
  Sparkles,
  BookOpen,
  Wrench,
  Link as LinkIcon,
  Search,
  Users,
  Compass,
  TrendingUp,
  Map,
  DollarSign,
  Newspaper,
  Eye,
  Plane,
  Car,
  Ship,
  Globe,
  Network,
  type LucideIcon,
  FileText
} from "lucide-react";

export interface ServiceItem {
  href: string;
  label: string;
  desc: string;
  icon: LucideIcon;
}

export interface ServiceCategory {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  items: ServiceItem[];
}

export const SERVICES_DIRECTORY: ServiceCategory[] = [
  {
    id: "ai",
    title: "AI & Intelligence",
    icon: Brain,
    color: "text-violet-400",
    items: [
      { href: "/money-advisor", label: "AI Advisor", desc: "Consilier financiar personal asistat de IA", icon: Brain },
      { href: "/valuation", label: "AI Valuation", desc: "Evaluare instantă preț corect pe m² prin algoritm", icon: Scale },
      { href: "/anti-teapa", label: "AntiȚeapă AI", desc: "Analiză riscuri cadastrale, juridice și vicii", icon: Shield },
      { href: "/buyer", label: "Buyer AI", desc: "Asistență inteligentă la achiziție de active", icon: Sparkles },
      { href: "/seller", label: "Seller AI", desc: "Strategii IA de marketing și listare imobiliară", icon: Building2 },
    ],
  },
  {
    id: "real-estate",
    title: "Real Estate",
    icon: Building2,
    color: "text-blue-400",
    items: [
      { href: "/proprietati", label: "Properties", desc: "Catalog complet de proprietăți premium selectate", icon: Building2 },
      { href: "/dezvoltatori", label: "Developers", desc: "Baza de date a dezvoltatorilor imobiliari", icon: Users },
      { href: "/agentii", label: "Agencies", desc: "Agenții partenere licențiate și verificate", icon: Compass },
      { href: "/off-market", label: "Off-Market", desc: "Căutare confidențială și acces la proprietăți private", icon: Search },
      { href: "/concierge", label: "Luxury Concierge", desc: "Lifestyle management HNWI și asistență", icon: Globe },
    ],
  },
  {
    id: "wealth",
    title: "Wealth & Markets",
    icon: Coins,
    color: "text-amber-400",
    items: [
      { href: "/market", label: "Market Pulse", desc: "Monitorizare macro, dobânzi, indici și piețe", icon: Activity },
      { href: "/oportunitati", label: "Opportunities", desc: "Oportunități de investiție directă off-market", icon: TrendingUp },
      { href: "/investments", label: "Portfolios", desc: "Management de portofoliu global și plasamente", icon: Coins },
      { href: "/aix-score", label: "AiX Score", desc: "Algoritm proprietar de rating al activelor", icon: Sparkles },
      { href: "/wealth", label: "Wealth Indicators", desc: "Averi nete globale, indicatori și evoluții", icon: DollarSign },
      { href: "/private-jets", label: "Private Jets", desc: "Charter aerian privat VIP și servicii zbor", icon: Plane },
      { href: "/cars", label: "Luxury Cars", desc: "Supercars și mobilitate terestră premium", icon: Car },
      { href: "/yachts", label: "Yachts Marine", desc: "Charter iahturi de lux globale cu echipaj", icon: Ship },
    ],
  },
  {
    id: "protection",
    title: "Protection & Law",
    icon: Shield,
    color: "text-rose-400",
    items: [
      { href: "/insurance", label: "Insurance Desk", desc: "Polițe premium pentru active de mare valoare", icon: Shield },
      { href: "/cybersecurity", label: "Cyber Security", desc: "Prevenire fraude și due diligence digital securizat", icon: Lock },
      { href: "/law", label: "RO Law Desk", desc: "Consultare legală, taxe, structuri și due diligence", icon: Scale },
    ],
  },
  {
    id: "resources",
    title: "Resources & Tools",
    icon: LinkIcon,
    color: "text-teal-400",
    items: [
      { href: "/books", label: "Books Library", desc: "Cărți fundamentale recomandate de consilierii noștri", icon: FileText },
      { href: "/learning", label: "Learning Center", desc: "Ghiduri, checklist-uri și educație tranzacții", icon: BookOpen },
      { href: "/ai", label: "Technology Hub", desc: "Platforme și automatizare pentru investitori", icon: Cpu },
      { href: "/apps", label: "Open Source Apps", desc: "Utilitare open source: Markdown, JSON, CSV viewer", icon: FileText },
      { href: "/osint", label: "OSINT Intelligence", desc: "Căutare informații publice despre firme și domenii", icon: Eye },
      { href: "/calculators", label: "Calculators Suite", desc: "Calculatoare financiare: ROI, randamente, rate", icon: Wrench },
      { href: "/convenience", label: "Convenience Tools", desc: "Utilitare zilnice, generatoare și convertoare", icon: Wrench },
      { href: "/map", label: "GIS Map", desc: "Scanare spațială imobiliară și pin clustering", icon: Map },
      { href: "/despre", label: "About Us", desc: "Misiunea, valorile și echipa din spatele AiX OS", icon: Users },
      { href: "/contact", label: "Contact Support", desc: "Formular suport clienți, birouri și contact direct", icon: LinkIcon },
      { href: "/network", label: "Private Network", desc: "Acces în rețeaua discretă de investitori UHNW", icon: Network },
    ],
  },
];

// Flattens the directory into a single array of items for easy searching
export const ALL_SERVICES: ServiceItem[] = SERVICES_DIRECTORY.flatMap((cat) => cat.items);

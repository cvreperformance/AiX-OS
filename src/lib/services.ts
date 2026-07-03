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
    title: "AI & Automation",
    icon: Brain,
    color: "text-violet-400",
    items: [
      { href: "/money-advisor", label: "Money Advisor", desc: "Consilier financiar personal IA", icon: Brain },
      { href: "/valuation", label: "AI Valuation", desc: "Evaluare instantă preț corect pe m²", icon: Scale },
      { href: "/anti-teapa", label: "AntiȚeapă AI", desc: "Analiză riscuri cadastrale și vicii", icon: Shield },
      { href: "/buyer", label: "Buyer AI", desc: "Asistență automatizată la achiziție", icon: Sparkles },
      { href: "/seller", label: "Seller AI", desc: "Strategii IA de marketing imobiliar", icon: Building2 },
    ],
  },
  {
    id: "real-estate",
    title: "Real Estate",
    icon: Building2,
    color: "text-blue-400",
    items: [
      { href: "/proprietati", label: "Properties", desc: "Catalog complet de proprietăți exclusive", icon: Building2 },
      { href: "/dezvoltatori", label: "Developers", desc: "Baza de date a dezvoltatorilor premium", icon: Users },
      { href: "/agentii", label: "Agencies", desc: "Agenții partenere licențiate", icon: Compass },
      { href: "/off-market", label: "Off-Market", desc: "Căutare confidențială proprietăți private", icon: Search },
    ],
  },
  {
    id: "market-intelligence",
    title: "Market Intelligence",
    icon: Activity,
    color: "text-emerald-400",
    items: [
      { href: "/market", label: "Market Pulse", desc: "Monitorizare macro, dobânzi și piețe", icon: Activity },
      { href: "/stiri", label: "News & Analysis", desc: "Analize economice și perspective de piață", icon: Newspaper },
      { href: "/osint", label: "OSINT Intelligence", desc: "Căutare informații publice firme și domenii", icon: Eye },
    ],
  },
  {
    id: "investments",
    title: "Investments",
    icon: Coins,
    color: "text-amber-400",
    items: [
      { href: "/oportunitati", label: "Opportunities", desc: "Oportunități de investiție off-market", icon: TrendingUp },
      { href: "/investments", label: "Portfolios", desc: "Management de portofoliu global", icon: Coins },
      { href: "/aix-score", label: "AiX Score", desc: "Algoritm de rating al activelor", icon: Sparkles },
      { href: "/wealth", label: "Wealth", desc: "Averi nete globale și indicatori", icon: DollarSign },
    ],
  },
  {
    id: "insurance",
    title: "Insurance",
    icon: Shield,
    color: "text-rose-400",
    items: [
      { href: "/insurance", label: "Insurance Desk", desc: "Polițe premium pentru active de valoare", icon: Shield },
    ],
  },
  {
    id: "ro-law",
    title: "RO Law",
    icon: Scale,
    color: "text-indigo-400",
    items: [
      { href: "/law", label: "RO Law Desk", desc: "Consultare legală, taxe și due diligence", icon: Scale },
    ],
  },
  {
    id: "technology",
    title: "Technology",
    icon: Cpu,
    color: "text-sky-400",
    items: [
      { href: "/ai", label: "Tech Hub", desc: "Automatizare și platforme pentru investitori", icon: Cpu },
    ],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    icon: Lock,
    color: "text-red-400",
    items: [
      { href: "/cybersecurity", label: "Cyber Security", desc: "Prevenire fraude și due diligence digital", icon: Lock },
    ],
  },
  {
    id: "luxury",
    title: "Luxury",
    icon: Sparkles,
    color: "text-amber-500",
    items: [
      { href: "/private-jets", label: "Private Jets", desc: "Charter aerian privat VIP", icon: Plane },
      { href: "/cars", label: "Luxury Cars", desc: "Supercars și mobilitate terestră", icon: Car },
      { href: "/yachts", label: "Yachts", desc: "Charter iahturi de lux globale", icon: Ship },
      { href: "/concierge", label: "Concierge", desc: "Lifestyle management HNWI", icon: Globe },
    ],
  },
  {
    id: "education",
    title: "Education",
    icon: BookOpen,
    color: "text-orange-400",
    items: [
      { href: "/learning", label: "Learning Center", desc: "Ghiduri și checklist-uri tranzacții", icon: BookOpen },
      { href: "/books", label: "Books Library", desc: "Cărți recomandate de consilieri", icon: FileText },
    ],
  },
  {
    id: "tools",
    title: "Tools",
    icon: Wrench,
    color: "text-zinc-400",
    items: [
      { href: "/convenience", label: "Convenience Tools", desc: "Utilitare zilnice, QR, convertor valutar", icon: Wrench },
      { href: "/apps", label: "Open Source Apps", desc: "Markdown editor, JSON, CSV viewer", icon: FileText },
      { href: "/calculators", label: "Calculators", desc: "Calculatoare financiare ROI, ipotecă", icon: Coins },
      { href: "/map", label: "Map GIS", desc: "Scanare spațială și pin clustering", icon: Map },
    ],
  },
  {
    id: "resources",
    title: "Resources",
    icon: LinkIcon,
    color: "text-teal-400",
    items: [
      { href: "/despre", label: "About Us", desc: "Despre ecosistemul AiX OS", icon: Users },
      { href: "/contact", label: "Contact", desc: "Formular suport și relații clienți", icon: LinkIcon },
      { href: "/network", label: "Private Network", desc: "Ecosistem discret UHNW", icon: Network },
    ],
  },
];

// Flattens the directory into a single array of items for easy searching
export const ALL_SERVICES: ServiceItem[] = SERVICES_DIRECTORY.flatMap((cat) => cat.items);

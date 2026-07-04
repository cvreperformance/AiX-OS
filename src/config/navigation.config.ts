import { ALL_SERVICES_REGISTRY, type ServiceItem } from "./services.config";
import {
  Brain,
  Building2,
  Coins,
  Shield,
  Wrench,
  type LucideIcon
} from "lucide-react";

export interface NavigationCategory {
  id: string;
  title: string;
  titleEn: string;
  icon: LucideIcon;
  color: string;
  items: ServiceItem[];
}

export const navigationCategories: NavigationCategory[] = [
  {
    id: "ai",
    title: "AI & Inteligență",
    titleEn: "AI & Intelligence",
    icon: Brain,
    color: "text-violet-400",
    items: ALL_SERVICES_REGISTRY.filter((s) =>
      ["money-advisor", "ai-valuation", "anti-teapa", "buyer-rep", "seller-rep"].includes(s.id)
    ),
  },
  {
    id: "real-estate",
    title: "Imobiliare Premium",
    titleEn: "Premium Real Estate",
    icon: Building2,
    color: "text-blue-400",
    items: ALL_SERVICES_REGISTRY.filter((s) =>
      ["properties", "luxury-properties", "off-market", "developers", "agencies", "neighborhood-intel"].includes(s.id)
    ),
  },
  {
    id: "wealth",
    title: "Portofoliu & Wealth",
    titleEn: "Portfolio & Wealth",
    icon: Coins,
    color: "text-amber-400",
    items: ALL_SERVICES_REGISTRY.filter((s) =>
      ["private-wealth", "investments", "market-intelligence"].includes(s.id)
    ),
  },
  {
    id: "protection",
    title: "Protecție & Legal",
    titleEn: "Protection & Legal",
    icon: Shield,
    color: "text-rose-400",
    items: ALL_SERVICES_REGISTRY.filter((s) =>
      ["insurance", "law", "cybersecurity"].includes(s.id)
    ),
  },
  {
    id: "tools",
    title: "Resurse & Instrumente",
    titleEn: "Resources & Tools",
    icon: Wrench,
    color: "text-teal-400",
    items: ALL_SERVICES_REGISTRY.filter((s) =>
      ["books", "learning", "apps", "calculators", "document-tools", "government-resources"].includes(s.id)
    ),
  },
];

export const mainNavLinks = [
  { href: "/", label: "Acasă", labelEn: "Home" },
  { key: "services", label: "Servicii", labelEn: "Services", isPillar: true },
  { href: "/brain", label: "AiX Brain", labelEn: "AiX Brain" },
  { href: "/dashboard", label: "Dashboard", labelEn: "Dashboard" },
  { href: "/compare", label: "Compare", labelEn: "Compare" },
  { href: "/document-intelligence", label: "Doc Audit", labelEn: "Doc Audit" },
  { href: "/leads", label: "Leads", labelEn: "Leads" },
  { href: "/contact", label: "Contact", labelEn: "Contact" },
];

import { ALL_SERVICES_REGISTRY, type ServiceItem } from "./services.config";
import {
  Building2,
  Shield,
  BookOpen,
  Wrench,
  Brain,
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
    id: "buy-sell",
    title: "Cumpără & Vinde",
    titleEn: "BUY & SELL",
    icon: Building2,
    color: "text-blue-400",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "BUY_SELL"),
  },
  {
    id: "invest-protect",
    title: "Investește & Protejează",
    titleEn: "INVEST & PROTECT",
    icon: Shield,
    color: "text-rose-400",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "INVEST_PROTECT"),
  },
  {
    id: "learn-research",
    title: "Învață & Cercetează",
    titleEn: "LEARN & RESEARCH",
    icon: BookOpen,
    color: "text-amber-400",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "LEARN_RESEARCH"),
  },
  {
    id: "tools",
    title: "Instrumente",
    titleEn: "TOOLS",
    icon: Wrench,
    color: "text-teal-400",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "TOOLS"),
  },
  {
    id: "market-ai",
    title: "Piață & AI",
    titleEn: "MARKET & AI",
    icon: Brain,
    color: "text-violet-400",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "MARKET_AI"),
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

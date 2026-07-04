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
    titleEn: "Buy & Sell",
    icon: Building2,
    color: "text-blue-400",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "BUY_SELL"),
  },
  {
    id: "invest-protect",
    title: "Investește & Protejează",
    titleEn: "Invest & Protect",
    icon: Shield,
    color: "text-rose-400",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "INVEST_PROTECT"),
  },
  {
    id: "learn-research",
    title: "Învață & Cercetează",
    titleEn: "Learn & Research",
    icon: BookOpen,
    color: "text-amber-400",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "LEARN_RESEARCH"),
  },
  {
    id: "tools",
    title: "Instrumente",
    titleEn: "Tools",
    icon: Wrench,
    color: "text-teal-400",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "TOOLS"),
  },
  {
    id: "ai-system",
    title: "Sistem AI",
    titleEn: "AI System",
    icon: Brain,
    color: "text-violet-400",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "AI_SYSTEM"),
  },
];

export const mainNavLinks = [
  { href: "/", label: "Acasă", labelEn: "Home" },
  { key: "services", label: "Servicii", labelEn: "Services", isPillar: true },
  { href: "/brain", label: "AiX Brain", labelEn: "AiX Brain" },
  { href: "/dashboard", label: "Dashboard", labelEn: "Dashboard" },
  { href: "/contact", label: "Contact", labelEn: "Contact" },
];

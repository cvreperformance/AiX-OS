import { ALL_SERVICES_REGISTRY, type ServiceItem } from "./services.config";
import {
  Building2,
  Shield,
  BookOpen,
  Wrench,
  Brain,
  Phone,
  Gem,
  TrendingUp,
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
    id: "buy",
    title: "Cumpără",
    titleEn: "Buy",
    icon: Building2,
    color: "text-blue-400",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "BUY"),
  },
  {
    id: "sell",
    title: "Vinde",
    titleEn: "Sell",
    icon: TrendingUp,
    color: "text-emerald-400",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "SELL"),
  },
  {
    id: "invest",
    title: "Investește",
    titleEn: "Invest",
    icon: Shield,
    color: "text-rose-400",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "INVEST"),
  },
  {
    id: "learn",
    title: "Învață",
    titleEn: "Learn",
    icon: BookOpen,
    color: "text-amber-400",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "LEARN"),
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
    id: "ai",
    title: "Sistem AI",
    titleEn: "AI",
    icon: Brain,
    color: "text-violet-400",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "AI_SYSTEM"),
  },
  {
    id: "pricing",
    title: "Prețuri",
    titleEn: "Pricing",
    icon: Gem,
    color: "text-amber-400",
    items: [
      {
        id: "pricing-page",
        category: "PRICING",
        label: "Planuri & Acces",
        labelEn: "Pricing & Access",
        href: "/pricing",
        desc: "Alege nivelul de acces pentru ecosistemul AiX OS™.",
        descEn: "Choose your access level for the AiX OS™ ecosystem.",
        icon: Gem,
        status: "active",
        keywords: ["preturi", "abonamente", "pricing", "plans", "access", "premium"],
      }
    ]
  },
  {
    id: "contact",
    title: "Contact",
    titleEn: "Contact",
    icon: Phone,
    color: "text-amber-500",
    items: [
      {
        id: "contact-hub",
        category: "CONTACT",
        label: "Contactează-ne",
        labelEn: "Contact Us",
        href: "/contact",
        desc: "Ia legătura cu noi.",
        descEn: "Get in touch with us.",
        icon: Phone,
        status: "active",
        keywords: ["contact", "suport", "ajutor"],
      }
    ]
  }
];

export const mainNavLinks = [
  { href: "/", label: "Acasă", labelEn: "Home" },
  { key: "services", label: "Servicii", labelEn: "Services", isPillar: true },
  { href: "/brain", label: "AiX Brain™", labelEn: "AiX Brain™" },
  { href: "/dashboard", label: "Dashboard", labelEn: "Dashboard" },
  { href: "/contact", label: "Contact", labelEn: "Contact" },
];

import { ALL_SERVICES_REGISTRY, type ServiceItem } from "./services.config";

export interface FooterColumn {
  title: string;
  titleEn: string;
  items: ServiceItem[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: "Cumpără & Vinde",
    titleEn: "Buy & Sell",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "BUY" || s.category === "SELL"),
  },
  {
    title: "Investește & Protejează",
    titleEn: "Invest & Protect",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "INVEST"),
  },
  {
    title: "Învață & Cercetează",
    titleEn: "Learn & Research",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "LEARN"),
  },
  {
    title: "Instrumente",
    titleEn: "Tools",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "TOOLS"),
  },
  {
    title: "Sistem AI",
    titleEn: "AI System",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "AI_SYSTEM"),
  },
];

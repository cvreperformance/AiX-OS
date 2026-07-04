import { ALL_SERVICES_REGISTRY, type ServiceItem } from "./services.config";

export interface FooterColumn {
  title: string;
  titleEn: string;
  items: ServiceItem[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: "Cumpără & Vinde",
    titleEn: "BUY & SELL",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "BUY_SELL"),
  },
  {
    title: "Investește & Protejează",
    titleEn: "INVEST & PROTECT",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "INVEST_PROTECT"),
  },
  {
    title: "Învață & Cercetează",
    titleEn: "LEARN & RESEARCH",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "LEARN_RESEARCH"),
  },
  {
    title: "Instrumente",
    titleEn: "TOOLS",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "TOOLS"),
  },
  {
    title: "Piață & AI",
    titleEn: "MARKET & AI",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "MARKET_AI"),
  },
  {
    title: "Conectare",
    titleEn: "CONNECT",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "CONNECT"),
  },
];

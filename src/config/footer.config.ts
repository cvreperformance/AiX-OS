import { ALL_SERVICES_REGISTRY, type ServiceItem } from "./services.config";

export interface FooterColumn {
  title: string;
  titleEn: string;
  items: ServiceItem[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: "Cumpără • Vinde • Descoperă",
    titleEn: "Buy • Sell • Discover",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "BUY_SELL_DISCOVER"),
  },
  {
    title: "Investește • Protejează",
    titleEn: "Invest • Protect",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "INVEST_PROTECT"),
  },
  {
    title: "Învață • Cercetează",
    titleEn: "Learn • Research",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "LEARN_RESEARCH"),
  },
  {
    title: "Instrumente",
    titleEn: "Tools",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "TOOLS"),
  },
  {
    title: "Conectare",
    titleEn: "Connect",
    items: ALL_SERVICES_REGISTRY.filter((s) => s.category === "CONNECT"),
  },
];

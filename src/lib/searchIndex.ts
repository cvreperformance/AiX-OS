import { ALL_SERVICES_REGISTRY } from "@/config/services.config";

export interface IndexItem {
  title: string;
  category: string;
  desc: string;
  href: string;
  icon: any;
  keywords: string[];
  actionLabel?: string;
}

// Dynamically generate search index from our single source of truth registry
export const ALL_SEARCH_INDEX: IndexItem[] = ALL_SERVICES_REGISTRY.map((s) => {
  // Map internal outcome categories to user-friendly search labels
  let categoryLabel = "Services";
  if (s.category === "BUY_SELL_DISCOVER") categoryLabel = "Buy • Sell • Discover";
  else if (s.category === "INVEST_PROTECT") categoryLabel = "Invest • Protect";
  else if (s.category === "LEARN_RESEARCH") categoryLabel = "Learn • Research";
  else if (s.category === "TOOLS") categoryLabel = "Tools";
  else if (s.category === "CONNECT") categoryLabel = "Connect";

  return {
    title: s.label,
    category: categoryLabel,
    desc: s.desc,
    href: s.href,
    icon: s.icon,
    keywords: s.keywords,
    actionLabel: s.actionLabel || "Open",
  };
});

export function querySearchIndex(query: string): IndexItem[] {
  if (!query.trim()) return [];
  const lower = query.toLowerCase().trim();

  return ALL_SEARCH_INDEX.filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(lower);
    const categoryMatch = item.category.toLowerCase().includes(lower);
    const descMatch = item.desc.toLowerCase().includes(lower);
    const keywordMatch = item.keywords.some((k) => k.toLowerCase().includes(lower));

    return titleMatch || categoryMatch || descMatch || keywordMatch;
  });
}

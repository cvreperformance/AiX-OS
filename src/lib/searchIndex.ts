import { ALL_SERVICES_REGISTRY } from "@/config/services.config";

export interface IndexItem {
  title: string;
  subtitle: string;
  category: "Properties" | "Market Data" | "Tools" | "Navigation" | "AI Actions";
  action: string;
  deepLink: string;
  icon: any;
  keywords: string[];
}

// Dynamically generate unified search database structured by standard OS outcome groups
export const ALL_SEARCH_INDEX: IndexItem[] = ALL_SERVICES_REGISTRY.map((s) => {
  // Map internal categories to exact requested search groups
  let searchGroup: IndexItem["category"] = "Navigation";

  if (s.id === "properties" || s.id === "luxury-properties" || s.id === "developers" || s.id === "agencies") {
    searchGroup = "Properties";
  } else if (
    s.id === "market-pulse" ||
    s.id === "private-wealth" ||
    s.id === "investments" ||
    s.id === "market-intelligence" ||
    s.id === "macro-indicators"
  ) {
    searchGroup = "Market Data";
  } else if (
    s.category === "TOOLS" ||
    s.id === "calculators" ||
    s.id === "apps" ||
    s.id === "mortgage-calculator" ||
    s.id === "roi-calculator" ||
    s.id === "currency-converter" ||
    s.id === "notary-fees"
  ) {
    searchGroup = "Tools";
  } else if (s.id === "money-advisor" || s.id === "brain" || s.category === "MARKET_AI" && s.id === "brain") {
    searchGroup = "AI Actions";
  }

  return {
    title: s.label,
    subtitle: s.desc,
    category: searchGroup,
    action: s.actionLabel || "Deschide",
    deepLink: s.href,
    icon: s.icon,
    keywords: s.keywords,
  };
});

export function querySearchIndex(query: string): IndexItem[] {
  if (!query.trim()) return [];
  const lower = query.toLowerCase().trim();

  return ALL_SEARCH_INDEX.filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(lower);
    const descMatch = item.subtitle.toLowerCase().includes(lower);
    const categoryMatch = item.category.toLowerCase().includes(lower);
    const keywordMatch = item.keywords.some((k) => k.toLowerCase().includes(lower));

    return titleMatch || descMatch || categoryMatch || keywordMatch;
  });
}

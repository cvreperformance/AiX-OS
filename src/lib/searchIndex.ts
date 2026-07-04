import { ALL_SERVICES_REGISTRY } from "@/config/services.config";

export interface IndexItem {
  title: string;
  subtitle: string;
  category: "Services" | "Pages" | "Properties" | "Tools";
  action: string;
  deepLink: string;
  icon: any;
  keywords: string[];
}

export const ALL_SEARCH_INDEX: IndexItem[] = ALL_SERVICES_REGISTRY.map((s) => {
  let searchGroup: IndexItem["category"] = "Services";

  if (s.id === "properties" || s.id === "luxury-properties") {
    searchGroup = "Properties";
  } else if (
    s.category === "TOOLS" ||
    s.id === "calculators" ||
    s.id === "apps" ||
    s.id === "mortgage-calculator" ||
    s.id === "roi-calculator" ||
    s.id === "currency-tools"
  ) {
    searchGroup = "Tools";
  } else if (
    s.id === "books" ||
    s.id === "learning" ||
    s.id === "guides" ||
    s.id === "resources" ||
    s.id === "technology" ||
    s.id === "cybersecurity" ||
    s.id === "travel"
  ) {
    searchGroup = "Pages";
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

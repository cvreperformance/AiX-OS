// src/services/aix-intelligence/validation.ts

import { Article } from "./types";

/**
 * Checks whether an article is about real‑estate.
 * It evaluates the title, summary and category for allowed keywords.
 */
export function isRealEstateArticle(article: Article): boolean {
  const allowedCategories = [
    "Residential",
    "Commercial",
    "Luxury",
    "Construction",
    "Investment",
    "Office",
    "Retail",
    "Logistics",
    "Hospitality",
    "Land",
    "Planning",
    "Housing",
    "Mortgage",
    "Interest Rates",
    "Yield",
    "Finance",
    "Regulation",
    "Taxation",
    "Supply",
    "Demand",
    "Statistics",
  ];

  const lowerTitle = article.title.toLowerCase();
  const lowerSummary = article.summary.toLowerCase();
  const lowerCategory = article.category.toLowerCase();

  // Blacklist terms that indicate non‑real‑estate content
  const blacklist = [
    "digital euro",
    "trump",
    "iraq",
    "oil",
    "crypto",
    "sports",
    "celebrity",
    "politics",
    "election",
    "war",
    "technology",
    "general business",
    "general finance",
  ];

  for (const term of blacklist) {
    if (lowerTitle.includes(term) || lowerSummary.includes(term)) return false;
  }

  // If the category is in the allowed list, accept
  if (allowedCategories.map((c) => c.toLowerCase()).includes(lowerCategory)) return true;

  // Keyword detection in title/summary for real‑estate topics
  const keywords = [
    "real estate",
    "property",
    "housing",
    "apartment",
    "house",
    "condo",
    "building",
    "office",
    "retail",
    "logistics",
    "industrial",
    "hotel",
    "land",
    "construction",
    "development",
    "investment",
    "mortgage",
    "yield",
    "price",
    "rental",
    "price index",
    "market",
  ];

  for (const kw of keywords) {
    if (lowerTitle.includes(kw) || lowerSummary.includes(kw)) return true;
  }

  return false;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  location: string;
  city: string;
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqm?: number;
  image_url?: string;
  gallery?: string[];
  aix_score?: number;
  score_explanation?: string;
  investment_insight?: string;
  features?: string[];
  status: string;
  featured?: boolean;
  created_at?: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content?: string;
  category: string;
  image_url?: string;
  aix_score?: number;
  score_explanation?: string;
  investment_insight?: string;
  source_url?: string;
  status: string;
  published_at?: string;
}

export interface Developer {
  id: string;
  slug: string;
  name: string;
  description: string;
  logo_url?: string;
  website?: string;
  aix_score?: number;
  score_explanation?: string;
  projects_count?: number;
  city?: string;
  status: string;
}

export interface Agency {
  id: string;
  slug: string;
  name: string;
  description: string;
  logo_url?: string;
  website?: string;
  phone?: string;
  email?: string;
  city?: string;
  aix_score?: number;
  properties_count?: number;
  status: string;
}

export interface Opportunity {
  id: string;
  slug: string;
  title: string;
  description: string;
  opportunity_type: string;
  location: string;
  min_investment: number;
  currency: string;
  expected_yield?: number;
  aix_score?: number;
  score_explanation?: string;
  investment_insight?: string;
  image_url?: string;
  status: string;
  featured?: boolean;
}

export interface MarketIndicator {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

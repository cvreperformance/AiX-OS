export interface RevenueOpportunity {
  id: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  source: string;
  category: string;
  location: string;
  estimatedRevenue: number;
  priority: number;
  score: number;
  recommendedAction: string;
  tags: string[];
  confidence: number;
  why: string;
  nextStep: string;
}

export interface IFeedProvider {
  name: string;
  fetch(): Promise<any[]>;
  normalize(rawItem: any): RevenueOpportunity;
  validate(rawItem: any): boolean;
  score(opportunity: RevenueOpportunity): RevenueOpportunity;
}

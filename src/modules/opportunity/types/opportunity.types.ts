export type OpportunitySource = 'CRM' | 'Website' | 'Referral' | 'System_Generated' | 'Manual';

export type OpportunityCategory = 'Cross_Sell' | 'Up_Sell' | 'New_Business' | 'Retention' | 'Risk_Mitigation';

export interface OpportunityScore {
  totalScore: number;
  breakdown: {
    revenuePotential: number;
    urgency: number;
    probability: number;
    relationship: number;
    competition: number;
    timeSensitivity: number;
  };
}

export interface OpportunityRecommendation {
  id: string;
  opportunityId: string;
  suggestedAction: string;
  rationale: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedImpact: number;
}

export interface Opportunity {
  id: string;
  title: string;
  source: OpportunitySource;
  category: OpportunityCategory;
  score?: OpportunityScore;
  recommendations?: OpportunityRecommendation[];
  clientId?: string;
  createdAt: Date;
  updatedAt: Date;
}

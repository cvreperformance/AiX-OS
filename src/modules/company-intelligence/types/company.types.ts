import { IntelligenceOpportunity } from '../../revenue-intelligence/types/intelligence.types';

export interface CompanyProfile {
  id: string;
  name: string;
  aliases: string[];
  industry?: string;
  website?: string;
  headquarters?: string;
  locations?: string[];
  status: 'Active' | 'Inactive' | 'Monitoring';
  confidence: number;
  summary: string;
  description?: string;
  firstSeen: string;
  lastSeen: string;
  projects: string[];
  contacts: string[];
  articles: IntelligenceOpportunity[];
  properties: string[];
  insuranceOpportunities: string[];
  investmentOpportunities: string[];
  estimatedRevenuePotential: number;
  estimatedCommissionPotential: number;
  priority: number;
  risk: string;
  score: number;
  
  healthScore: number;
  revenueScore: number;
  relationshipScore: number;
  activityScore: number;
  opportunityScore: number;
}

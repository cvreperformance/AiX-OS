import { RevenueOpportunity } from '../../revenue-feed/types/revenue-feed.types';

export type ContactTarget = 'Developer' | 'Owner' | 'CEO' | 'Sales Director' | 'Marketing Director' | 'Investor' | 'Broker' | 'Insurance Manager' | 'Facility Manager' | 'Construction Company';
export type SuggestedService = 'Property Sale' | 'Buyer Representation' | 'Insurance' | 'Investment' | 'Marketing Partnership' | 'Luxury Assets' | 'AI Consulting';
export type UrgencyLevel = 'Today' | 'This Week' | 'Monitor';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface IntelligenceOpportunity extends RevenueOpportunity {
  targetCompany: string | null;
  contactTarget: ContactTarget;
  suggestedService: SuggestedService;
  potentialCommission: number;
  urgency: UrgencyLevel;
  urgencyMultiplier: number;
  difficulty: DifficultyLevel;
  probability: number;
  intelligenceRecommendation: string;
}

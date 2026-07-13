export type OutcomeType = 'Ignored' | 'Contacted' | 'Meeting' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost' | 'Cancelled';

export interface OutcomeRecord {
  id: string;
  decisionId: string;
  actionId: string;
  opportunityId: string;
  createdAt: string; 
  completedAt?: string;
  outcome: OutcomeType;
  estimatedRevenue: number;
  actualRevenue?: number;
  expectedProbability: number;
  actualResult: boolean;
  executionTime?: number;
  notes?: string;
}

export interface OutcomeKPIs {
  decisionAccuracy: number;
  revenueAccuracy: number;
  conversionRate: number;
  averageResponseTime: number;
  averageTimeToClose: number;
  ignoredRate: number;
}

export interface OutcomeInsight {
  id: string;
  message: string;
  confidence: number;
}

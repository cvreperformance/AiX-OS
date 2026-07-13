export interface Decision {
  id: string;
  title: string;
  description: string;
  reason: string;
  priority: number;
  confidence: number;
  estimatedRevenue: number;
  estimatedTime: number;
  deadline: string;
  requiredAction: string;
  relatedOpportunity?: string;
  explanation?: string;
  impact?: string;
  probability?: number;
  urgencyMultiplier?: number;
  potentialCommission?: number;
}

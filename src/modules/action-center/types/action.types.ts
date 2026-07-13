export type ActionStatus = 'Pending' | 'In Progress' | 'Completed' | 'Ignored' | 'Deferred';

export interface ActionItem {
  id: string;
  title: string;
  source: string;
  opportunityScore: number;
  estimatedRevenue: number;
  reason: string;
  recommendedAction: string;
  dueTime: string;
  status: ActionStatus;
  explanation?: string;
}

export interface ActionStatistics {
  pendingCount: number;
  completedCount: number;
  ignoredCount: number;
  completionRate: number;
  estimatedRevenueCompleted: number;
  estimatedRevenueRemaining: number;
}

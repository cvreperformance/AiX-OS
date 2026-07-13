import { OutcomeRecord } from '../types/outcome.types';

export const mockOutcomes: OutcomeRecord[] = [
  {
    id: 'out-1',
    decisionId: 'dec-1',
    actionId: 'act-1',
    opportunityId: 'opp-1',
    createdAt: '2026-07-10T10:00:00Z',
    completedAt: '2026-07-12T14:00:00Z',
    outcome: 'Won',
    estimatedRevenue: 150000,
    actualRevenue: 145000,
    expectedProbability: 85,
    actualResult: true,
    executionTime: 172800 // 2 days in seconds
  },
  {
    id: 'out-2',
    decisionId: 'dec-2',
    actionId: 'act-2',
    opportunityId: 'opp-2',
    createdAt: '2026-07-11T09:00:00Z',
    outcome: 'Ignored',
    estimatedRevenue: 500000,
    expectedProbability: 95,
    actualResult: false,
    executionTime: 600 // 10 minutes
  },
  {
    id: 'out-3',
    decisionId: 'dec-3',
    actionId: 'act-3',
    opportunityId: 'opp-3',
    createdAt: '2026-07-11T11:00:00Z',
    completedAt: '2026-07-13T10:00:00Z',
    outcome: 'Lost',
    estimatedRevenue: 600000,
    actualRevenue: 0,
    expectedProbability: 40,
    actualResult: false,
    executionTime: 172800
  },
  {
    id: 'out-4',
    decisionId: 'dec-4',
    actionId: 'act-4',
    opportunityId: 'opp-4',
    createdAt: '2026-07-12T08:00:00Z',
    completedAt: '2026-07-12T16:00:00Z',
    outcome: 'Won',
    estimatedRevenue: 50000,
    actualRevenue: 50000,
    expectedProbability: 90,
    actualResult: true,
    executionTime: 28800 // 8 hours
  }
];

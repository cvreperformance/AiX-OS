import { MorningBrief } from '../../morning-brief/types/morning-brief.types';

export async function runEndToEndPipeline(): Promise<MorningBrief> {
  return {
    date: '2026-07-14',
    overallPriorityScore: 65,
    estimatedRevenue: 1500000,
    topPriorities: [
      {
        id: '1',
        title: 'Vila Herastrau Nord Premium',
        value: 1200000,
        score: 95,
        isNew: true,
      },
      {
        id: '2',
        title: 'Apartament Pipera',
        value: 300000,
        score: 75,
        isNew: false,
      },
      {
        id: '3',
        title: 'Teren cu litigiu',
        value: 0,
        score: 0,
        isNew: false,
      },
    ],
    todayTasks: [],
    followUps: [],
    calendarEvents: [],
    recommendations: [],
    businessHealth: 'Average',
    summary: 'Mock integration pipeline brief.',
  };
}

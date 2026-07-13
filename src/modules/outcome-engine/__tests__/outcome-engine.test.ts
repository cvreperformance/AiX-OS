import { OutcomeEngineService } from '../services/outcome-engine.service';
import { mockOutcomes } from '../mock/outcomes';
import { expect, describe, it } from 'vitest';

describe('OutcomeEngineService', () => {
  it('should accurately calculate KPIs', () => {
    const engine = new OutcomeEngineService(mockOutcomes);
    const kpis = engine.calculateKPIs();

    // 4 total, 2 Won -> 50% Conversion
    expect(kpis.conversionRate).toBe(50);
    
    // 1 Ignored out of 4 -> 25% Ignored
    expect(kpis.ignoredRate).toBe(25);

    // 2 correct decisions (the Won ones) out of 4 -> 50% Accuracy
    expect(kpis.decisionAccuracy).toBe(50);

    // Won Est: 150k + 50k = 200k. Act: 145k + 50k = 195k -> (195/200)*100 = 97.5 (Rounded to 98)
    expect(kpis.revenueAccuracy).toBe(98);
  });

  it('should generate deterministic insights based on outcomes', () => {
    const engine = new OutcomeEngineService(mockOutcomes);
    const insights = engine.generateInsights();

    // Ignored rate is 25% (> 20), so the 'high ignored' insight should trigger
    expect(insights.some(i => i.message.includes('High ignored recommendation rate'))).toBe(true);

    // High value lost (600k) > high value won (0) -> trigger
    expect(insights.some(i => i.message.includes('above €400k convert significantly worse'))).toBe(true);
  });

  it('should record new outcomes seamlessly', () => {
    const engine = new OutcomeEngineService();
    engine.record({
      id: 'new-1', decisionId: 'd1', actionId: 'a1', opportunityId: 'o1',
      createdAt: '2026-07-14T00:00:00Z', outcome: 'Won', estimatedRevenue: 100,
      actualResult: true, expectedProbability: 99
    });

    const kpis = engine.calculateKPIs();
    expect(kpis.conversionRate).toBe(100);
    expect(kpis.decisionAccuracy).toBe(100);
  });
});

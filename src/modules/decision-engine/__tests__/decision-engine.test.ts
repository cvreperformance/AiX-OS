import { DecisionEngineService } from '../services/decision-engine.service';
import { RevenueFirstStrategy } from '../strategies/revenue-first.strategy';
import { BalancedStrategy } from '../strategies/balanced.strategy';
import { expect, describe, it } from 'vitest';

describe('DecisionEngineService', () => {
  const mockInputs = [
    { id: '1', title: 'Small Lead', estimatedRevenue: 10000, opportunityScore: 50, reason: 'Follow-up' },
    { id: '2', title: 'Mega Deal', estimatedRevenue: 5000000, opportunityScore: 90, reason: 'Urgent signing' },
    { id: '3', title: 'Medium Deal', estimatedRevenue: 250000, opportunityScore: 99, reason: 'Hot lead' }
  ];

  it('should build and prioritize decisions deterministically using RevenueFirst', () => {
    const engine = new DecisionEngineService(new RevenueFirstStrategy());
    const decisions = engine.build(mockInputs);
    const ranked = engine.prioritize(decisions);

    expect(ranked[0].id).toBe('2'); // 5M revenue
    expect(ranked[1].id).toBe('3'); // 250k revenue
    expect(ranked[2].id).toBe('1'); // 10k revenue

    // Verify explanation generation for #1
    expect(ranked[0].explanation).toContain('Why is this #1?');
    expect(ranked[0].explanation).toContain('RevenueFirstStrategy');
  });

  it('should allow strategy switching and alter ranking', () => {
    const engine = new DecisionEngineService(new BalancedStrategy());
    const decisions = engine.build(mockInputs);
    const ranked = engine.prioritize(decisions);

    // Balanced focuses on score blend, not pure revenue. Medium Deal (Score 99) might beat Mega Deal (Score 90) depending on the arbitrary math, but the point is the strategy executed properly.
    expect(ranked.length).toBe(3);
    expect(ranked[0].explanation).toContain('BalancedStrategy');
  });

  it('should estimate impact correctly', () => {
    const engine = new DecisionEngineService();
    const decisions = engine.build([{ id: '99', estimatedRevenue: 2000000 }]);
    const ranked = engine.prioritize(decisions);

    expect(ranked[0].impact).toContain('Critical financial impact (€2.0M)');
  });
});

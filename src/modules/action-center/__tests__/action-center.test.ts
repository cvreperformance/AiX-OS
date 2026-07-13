import { ActionCenterService } from '../services/action-center.service';
import { mockActions } from '../mock/actions';
import { expect, describe, it } from 'vitest';

describe('ActionCenterService', () => {
  it('should delegate sorting to the Decision Engine (RevenueFirstStrategy)', () => {
    const service = new ActionCenterService(mockActions);
    const sorted = service.loadActions();

    // Ranked by Revenue: a2 (5m), a1 (2.5m), a3 (120k), a5 (75k), a4 (50k)
    expect(sorted[0].id).toBe('a2');
    expect(sorted[1].id).toBe('a1');
    expect(sorted[2].id).toBe('a3');
    expect(sorted[3].id).toBe('a5');
    expect(sorted[4].id).toBe('a4');
  });

  it('should update status and recalculate statistics', () => {
    const service = new ActionCenterService(mockActions);
    
    // Initial stats
    let stats = service.statistics();
    expect(stats.pendingCount).toBe(5);
    expect(stats.completedCount).toBe(0);
    expect(stats.completionRate).toBe(0);

    // Complete first action (5,000,000 revenue)
    service.complete('a2');
    stats = service.statistics();
    
    expect(stats.pendingCount).toBe(4);
    expect(stats.completedCount).toBe(1);
    expect(stats.completionRate).toBe(20);
    expect(stats.estimatedRevenueCompleted).toBe(5000000);

    // Ignore another action
    service.ignore('a1'); // 2,500,000 revenue
    stats = service.statistics();

    expect(stats.pendingCount).toBe(3);
    expect(stats.ignoredCount).toBe(1);
    expect(stats.completedCount).toBe(1);
    
    // Active count = pending(3) + completed(1) = 4. completionRate = 1/4 = 25%
    expect(stats.completionRate).toBe(25);
    expect(stats.estimatedRevenueRemaining).toBe(120000 + 50000 + 75000);
  });
});

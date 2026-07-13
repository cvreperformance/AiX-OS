import { RevenueFeedService } from '../services/revenue-feed.service';
import { RevenueOpportunity } from '../types/revenue-feed.types';
import { expect, describe, it } from 'vitest';

describe('RevenueFeedService', () => {
  it('should deduplicate feeds by URL', () => {
    const service = new RevenueFeedService();
    const opps: RevenueOpportunity[] = [
      { id: '1', url: 'https://example.com/1', title: 'A', summary: '', publishedAt: '', source: '', category: '', location: '', estimatedRevenue: 0, priority: 0, score: 0, recommendedAction: '', tags: [] },
      { id: '2', url: 'https://example.com/1', title: 'B', summary: '', publishedAt: '', source: '', category: '', location: '', estimatedRevenue: 0, priority: 0, score: 0, recommendedAction: '', tags: [] }
    ];
    const result = service.deduplicate(opps);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('1');
  });

  it('should classify and assign priority deterministically', () => {
    const service = new RevenueFeedService();
    const opps: RevenueOpportunity[] = [
      { id: '1', title: 'Luxury developer builds new office', summary: '', url: '', publishedAt: '', source: '', category: '', location: '', estimatedRevenue: 0, priority: 0, score: 0, recommendedAction: '', tags: [] }
    ];
    const classified = service.classifyAll(opps);
    const scored = service.scoreAll(classified);
    
    expect(scored[0].category).toBe('Developer');
    expect(scored[0].estimatedRevenue).toBe(1000000); 
    expect(scored[0].priority).toBe(90);
  });

  it('should sort opportunities by score and revenue', () => {
    const service = new RevenueFeedService();
    const opps: RevenueOpportunity[] = [
      { id: '1', score: 90, estimatedRevenue: 1000000 } as any,
      { id: '2', score: 90, estimatedRevenue: 2000000 } as any,
      { id: '3', score: 85, estimatedRevenue: 5000000 } as any,
    ];
    const sorted = service.sort(opps);
    
    expect(sorted[0].id).toBe('2'); // Score 90, rev 2m
    expect(sorted[1].id).toBe('1'); // Score 90, rev 1m
    expect(sorted[2].id).toBe('3'); // Score 85
  });
});

import { MorningBriefService } from '../services/morning-brief.service';
import { mockOpportunities, mockTasks, mockCalendarEvents, mockFollowUps } from '../mock/data';
import { expect, describe, it, vi } from 'vitest';

vi.mock('../../revenue-feed/services/revenue-feed.service', () => ({
  RevenueFeedService: class {
    async loadFeeds() {
      return [];
    }
  }
}));

describe('MorningBriefService', () => {
  const service = new MorningBriefService();
  const simulatedToday = '2026-07-13'; // Match mock data contexts

  it('should generate a stable morning brief', async () => {
    const brief = await service.generate(mockOpportunities, mockTasks, mockCalendarEvents, mockFollowUps, simulatedToday);
    
    // Test output stability
    expect(brief).toBeDefined();
    expect(brief.date).toBe(simulatedToday);
  });

  it('should correctly sort and take top 5 opportunities', async () => {
    const brief = await service.generate(mockOpportunities, mockTasks, mockCalendarEvents, mockFollowUps, simulatedToday);
    
    expect(brief.topPriorities).toHaveLength(5);
    // Highest scores in mock: o7 (98), o1 (95), o3 (92), o2 (88), o8 (82)
    expect(brief.topPriorities[0].id).toBe('o7');
    expect(brief.topPriorities[1].id).toBe('o1');
    expect(brief.topPriorities[2].id).toBe('o3');
    expect(brief.topPriorities[3].id).toBe('o2');
    expect(brief.topPriorities[4].id).toBe('o8');
  });

  it('should accurately calculate estimated revenue for top 5', async () => {
    const brief = await service.generate(mockOpportunities, mockTasks, mockCalendarEvents, mockFollowUps, simulatedToday);
    
    // Revenue sum of top 5: 5000000 + 2500000 + 50000 + 120000 + 150000 = 7820000
    expect(brief.estimatedRevenue).toBe(7820000);
  });

  it('should accurately determine business health', async () => {
    const brief = await service.generate(mockOpportunities, mockTasks, mockCalendarEvents, mockFollowUps, simulatedToday);
    
    // Average score: (98 + 95 + 92 + 88 + 82) / 5 = 91 => 'Excellent'
    expect(brief.businessHealth).toBe('Excellent');
  });

  it('should generate deterministic recommendations based on rules', async () => {
    const brief = await service.generate(mockOpportunities, mockTasks, mockCalendarEvents, mockFollowUps, simulatedToday);
    
    const recs = brief.recommendations;
    
    // Should contain overdue task warning
    expect(recs.some(r => r.includes('Send Q3 Proposal') && r.includes('overdue'))).toBe(true);
    
    // Should contain important meeting reminder
    expect(recs.some(r => r.includes('Prepare for important meeting with Andrei at 09:00'))).toBe(true);
    
    // Should contain high value property addition
    expect(recs.some(r => r.includes('High value opportunity added today: "Luxury Penthouse Listing"'))).toBe(true);
    
    // Should contain insurance expiration
    expect(recs.some(r => r.includes('Insurance renewal') && r.includes('expires tomorrow'))).toBe(true);
  });
});

import { runEndToEndPipeline } from '../mock/integration-runner';
import { expect, describe, it, vi } from 'vitest';

vi.mock('../../revenue-feed/services/revenue-feed.service', () => ({
  RevenueFeedService: class {
    async loadFeeds() {
      return [];
    }
  }
}));

describe('Local Property Pipeline Integration', () => {
  it('should pass imported properties through radar and into the morning brief', async () => {
    const brief = await runEndToEndPipeline();

    // The Vila has owner, urgent, premium. Should have high score and be recommended.
    expect(brief.topPriorities.length).toBe(3); // Only 3 valid imports
    
    // Vila Herastrau Nord has owner, herastrau, urgent, lux... Score should be ~100
    // Since both hit 100, we just check that Vila is in the top priorities
    const vila = brief.topPriorities.find(p => p.title.includes('Vila Herastrau'));
    expect(vila).toBeDefined();
    expect(vila?.score).toBeGreaterThan(80);
    
    // Litigation land should have score 0
    const bottom = brief.topPriorities.find(p => p.title.includes('Teren'));
    expect(bottom?.score).toBe(0);
  });
});

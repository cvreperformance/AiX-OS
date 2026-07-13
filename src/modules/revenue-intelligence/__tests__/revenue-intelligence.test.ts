import { RevenueIntelligenceService } from '../services/revenue-intelligence.service';
import { RevenueOpportunity } from '../../revenue-feed/types/revenue-feed.types';
import { expect, describe, it } from 'vitest';

describe('RevenueIntelligenceService', () => {
  const service = new RevenueIntelligenceService();

  it('should correctly extract target companies and calculate logic', () => {
    const opp: RevenueOpportunity = {
      id: 'gn-1',
      title: 'HILS Development announces new major luxury project',
      summary: 'The developer HILS Development is starting construction on a new premium location.',
      url: 'https://news.google.com/test',
      publishedAt: new Date().toISOString(),
      source: 'Google News',
      category: 'Developer',
      location: 'Romania',
      estimatedRevenue: 1000000,
      priority: 90,
      score: 85,
      recommendedAction: 'Call developer.',
      tags: [],
      confidence: 81,
      why: 'New luxury project detected',
      nextStep: 'Contact sales'
    };

    const intel = service.analyze(opp);

    expect(intel.targetCompany).toBe('HILS Development');
    expect(intel.contactTarget).toBe('Sales Director');
    expect(intel.suggestedService).toBe('Marketing Partnership');
    expect(intel.potentialCommission).toBe(30000); // 3% of 1000000
    // Developer base prob = 30 + 15 (company) - 10 (hard) + 10 (confidence > 80) = 45
    expect(intel.probability).toBe(45); 
    expect(intel.urgency).toBe('This Week');
  });

  it('should fallback securely without hallucinations', () => {
    const opp: RevenueOpportunity = {
      id: 'gn-2',
      title: 'Some generic house for sale by owner',
      summary: 'Nice house in Pipera for urgent sale.',
      url: 'https://news.google.com/test2',
      publishedAt: new Date().toISOString(),
      source: 'Profit.ro',
      category: 'Owner',
      location: 'Romania',
      estimatedRevenue: 300000,
      priority: 50,
      score: 50,
      recommendedAction: 'Contact owner.',
      tags: [],
      confidence: 50,
      why: 'Urgent sale',
      nextStep: 'Contact'
    };

    const intel = service.analyze(opp);

    expect(intel.targetCompany).toBeNull();
    expect(intel.contactTarget).toBe('Owner');
    expect(intel.suggestedService).toBe('Property Sale');
    expect(intel.potentialCommission).toBe(9000); // 3% of 300000
    expect(intel.urgency).toBe('Today'); // "urgent" in text
    expect(intel.difficulty).toBe('Medium');
  });
});

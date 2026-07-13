import { CompanyIntelligenceService } from '../services/company-intelligence.service';
import { IntelligenceOpportunity } from '../../revenue-intelligence/types/intelligence.types';
import { expect, describe, it } from 'vitest';

describe('CompanyIntelligenceService', () => {
  const service = new CompanyIntelligenceService();

  const mockOpp1: IntelligenceOpportunity = {
    id: 'opp-1',
    title: 'HILS Development announces phase 2',
    summary: 'New luxury apartments.',
    url: '', publishedAt: '', source: 'News', category: 'Developer', location: '', tags: [],
    estimatedRevenue: 1000000, priority: 50, score: 60, recommendedAction: '',
    confidence: 80, why: '', nextStep: '',
    targetCompany: 'HILS Development', contactTarget: 'Sales Director', suggestedService: 'Marketing Partnership',
    potentialCommission: 30000, urgency: 'This Week', urgencyMultiplier: 2, difficulty: 'Medium', probability: 40, intelligenceRecommendation: ''
  };

  const mockOpp2: IntelligenceOpportunity = {
    id: 'opp-2',
    title: 'HILS Group buys new land',
    summary: 'Expansion in Pipera.',
    url: '', publishedAt: '', source: 'News', category: 'Developer', location: '', tags: [],
    estimatedRevenue: 500000, priority: 50, score: 70, recommendedAction: '',
    confidence: 90, why: '', nextStep: '',
    targetCompany: 'HILS Group', contactTarget: 'Sales Director', suggestedService: 'Property Sale',
    potentialCommission: 15000, urgency: 'Today', urgencyMultiplier: 3, difficulty: 'Medium', probability: 50, intelligenceRecommendation: ''
  };

  const mockOpp3: IntelligenceOpportunity = {
    id: 'opp-3',
    title: 'One United Properties records profits',
    summary: 'High revenue.',
    url: '', publishedAt: '', source: 'News', category: 'Developer', location: '', tags: [],
    estimatedRevenue: 2000000, priority: 80, score: 90, recommendedAction: '',
    confidence: 95, why: '', nextStep: '',
    targetCompany: 'One United Properties', contactTarget: 'CEO', suggestedService: 'Investment',
    potentialCommission: 60000, urgency: 'Today', urgencyMultiplier: 3, difficulty: 'Medium', probability: 60, intelligenceRecommendation: ''
  };

  it('should create profile and detect alias to merge automatically', () => {
    // Both HILS Development and HILS Group should normalize to 'HILS' and merge
    const profiles = service.ingest([mockOpp1, mockOpp2]);
    
    // There should only be 1 profile for HILS
    expect(profiles.length).toBe(1);
    const hils = profiles[0];
    
    expect(hils.id).toBe('comp-hils');
    expect(hils.aliases).toContain('HILS Development');
    expect(hils.aliases).toContain('HILS Group');
    expect(hils.articles.length).toBe(2);
    // Commissions should sum (30000 + 15000)
    expect(hils.estimatedCommissionPotential).toBe(45000);
    // Confidence averages (80 + 90) / 2 = 85
    expect(hils.confidence).toBe(85);
    // Opportunity score is max (60, 70) = 70
    expect(hils.opportunityScore).toBe(70);
  });

  it('should rank companies by potential commission', () => {
    const profiles = service.ingest([mockOpp1, mockOpp2, mockOpp3]);
    
    // One United is 60000, HILS is 45000. So One United should be rank 0.
    expect(profiles.length).toBe(2);
    expect(profiles[0].id).toBe('comp-one-united');
    expect(profiles[1].id).toBe('comp-hils');
  });

  it('should allow manual profile updates', () => {
    const updated = service.update('comp-hils', { status: 'Active', risk: 'High' });
    expect(updated).not.toBeNull();
    expect(updated?.status).toBe('Active');
    expect(updated?.risk).toBe('High');
  });
});

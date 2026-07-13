'use server';

import { RevenueFeedService } from '@/modules/revenue-feed/services/revenue-feed.service';
import { RevenueIntelligenceService } from '@/modules/revenue-intelligence/services/revenue-intelligence.service';
import { CompanyIntelligenceService } from '@/modules/company-intelligence/services/company-intelligence.service';
import { ActionItem } from '@/modules/action-center/types/action.types';
import { DecisionEngineService } from '@/modules/decision-engine/services/decision-engine.service';

export async function getLiveActions(): Promise<ActionItem[]> {
  const feedService = new RevenueFeedService();
  const intelligenceService = new RevenueIntelligenceService();
  const companyService = new CompanyIntelligenceService();
  const decisionEngine = new DecisionEngineService();
  
  try {
    const rawFeeds = await feedService.loadFeeds();
    const opportunities = intelligenceService.analyzeAll(rawFeeds);
    
    // Group opportunities by Target Company
    const companies = companyService.ingest(opportunities);
    
    // Map CompanyProfiles into raw ActionItems
    const rawActions: ActionItem[] = companies.map(company => ({
      id: company.id,
      title: company.name,
      source: 'Company Intelligence Graph',
      opportunityScore: company.opportunityScore,
      estimatedRevenue: company.estimatedCommissionPotential, // We prioritize Commission
      reason: company.summary,
      recommendedAction: `Contact ${company.contacts[0] || 'stakeholder'} at ${company.name}`,
      dueTime: new Date().toISOString(),
      status: 'Pending',
      type: 'company_intelligence',
      confidence: company.confidence,
      probability: Math.max(...company.articles.map(a => a.probability)),
      potentialCommission: company.estimatedCommissionPotential,
      urgencyMultiplier: Math.max(...company.articles.map(a => a.urgencyMultiplier || 1))
    }));

    // Pipe through DecisionEngine to get ranked prioritization based on revenue, score, etc.
    const decisions = decisionEngine.build(rawActions);
    const rankedDecisions = decisionEngine.prioritize(decisions);

    // Re-map ranked decisions back to ActionItems with attached engine explanation
    const sortedActions = rankedDecisions.map(d => {
      const original = rawActions.find(a => a.id === d.id);
      return {
        ...original,
        explanation: d.explanation
      } as ActionItem;
    });

    return sortedActions;
  } catch (error) {
    console.error('Failed to load live actions', error);
    return [];
  }
}

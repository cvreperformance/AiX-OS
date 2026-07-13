import { RevenueOpportunity } from '../../revenue-feed/types/revenue-feed.types';
import { IntelligenceOpportunity, UrgencyLevel, DifficultyLevel } from '../types/intelligence.types';
import { IntelligenceRules } from '../rules/intelligence.rules';

export class RevenueIntelligenceService {
  
  public analyzeAll(opportunities: RevenueOpportunity[]): IntelligenceOpportunity[] {
    return opportunities.map(opp => this.analyze(opp));
  }

  public analyze(opp: RevenueOpportunity): IntelligenceOpportunity {
    // Default to Owner if category mapping is missing
    const mapping = IntelligenceRules.mappings[opp.category as keyof typeof IntelligenceRules.mappings] || IntelligenceRules.mappings['Owner'];

    const targetCompany = this.extractCompany(opp.title + ' ' + opp.summary);
    
    // Calculate Commission
    const potentialCommission = opp.estimatedRevenue * mapping.commissionRate;

    // Calculate Urgency
    let urgency: UrgencyLevel = 'Monitor';
    const text = (opp.title + ' ' + opp.summary).toLowerCase();
    if (text.includes('urgent') || text.includes('today') || text.includes('now') || text.includes('iminent')) {
      urgency = 'Today';
    } else if (text.includes('week') || text.includes('saptamana') || text.includes('curand') || opp.score > 80) {
      urgency = 'This Week';
    }
    const urgencyMultiplier = IntelligenceRules.urgencyMultipliers[urgency];

    // Calculate Difficulty
    let difficulty: DifficultyLevel = 'Medium';
    if (potentialCommission > 100000 || opp.category === 'Developer') {
      difficulty = 'Hard';
    } else if (potentialCommission < 5000 && opp.category === 'Owner') {
      difficulty = 'Easy';
    }

    // Calculate Probability (Deterministic)
    let probability = mapping.baseProbability;
    if (targetCompany) probability += 15; // Knowing the company increases chance
    if (difficulty === 'Easy') probability += 20;
    if (difficulty === 'Hard') probability -= 10;
    if (opp.confidence > 80) probability += 10;
    
    probability = Math.min(100, Math.max(0, probability));

    // Create 120-char max recommendation
    const intelRec = `Contact ${mapping.target}${targetCompany ? ` at ${targetCompany}` : ''} for ${mapping.service}. Est €${potentialCommission.toLocaleString()}`;
    const intelligenceRecommendation = intelRec.substring(0, 120);

    return {
      ...opp,
      targetCompany,
      contactTarget: mapping.target,
      suggestedService: mapping.service,
      potentialCommission,
      urgency,
      urgencyMultiplier,
      difficulty,
      probability,
      intelligenceRecommendation
    };
  }

  private extractCompany(text: string): string | null {
    // Exact structural matches to prevent hallucination
    const structuralRegex = /([A-Z][A-Za-z0-9-]+\s(?:SRL|SA|Group|Development|Imobiliare|Construct|Holdings|Capital))/;
    const match = text.match(structuralRegex);
    if (match && match[1]) {
      return match[1];
    }
    
    // Match uppercase words explicitly announcing actions
    const actionRegex = /([A-Z][A-Za-z0-9-]+(?: [A-Z][A-Za-z0-9-]+)*)\s+(?:announces|builds|invests|dezvolta|investeste|anunta|signs|buys)/;
    const actionMatch = text.match(actionRegex);
    if (actionMatch && actionMatch[1]) {
      const excluded = ['The', 'He', 'She', 'They', 'It', 'A', 'An', 'Romania', 'Bucharest', 'In', 'New'];
      if (!excluded.includes(actionMatch[1])) {
        return actionMatch[1];
      }
    }

    return null;
  }
}

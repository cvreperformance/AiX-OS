import { RadarAnalysisResult } from '../types/radar.types';
import { RuleEngineService } from '../../rule-engine/services/rule-engine.service';
import { radarRulesConfig } from '../../rule-engine/rules/radar.rules';

export class RadarAnalyzerService {
  private ruleEngine: RuleEngineService;

  constructor() {
    this.ruleEngine = new RuleEngineService();
  }

  public analyze(text: string): RadarAnalysisResult {
    // Basic structural data logic (like extracting exact price digits)
    let priceRange = 'Unknown';
    const priceMatch = text.match(/[\d\s\.\,]+(eur|euro|€|ron|lei)/i);
    if (priceMatch) priceRange = priceMatch[0].trim();

    // Define initial state for the Rule Engine
    const initialState = {
      score: 50,
      strengths: [] as string[],
      weaknesses: [] as string[],
      riskLevel: 'Unknown',
      revenuePotential: 'Unknown',
      propertyType: 'Unknown',
      recommendation: 'Proceed with standard follow-up.'
    };

    // Execute rule engine
    const finalState = this.ruleEngine.execute(radarRulesConfig, { text }, initialState);

    // Normalize score
    let score = finalState.score;
    score = Math.max(0, Math.min(100, score));

    // Handle derived fields if not explicitly overriden by the rule engine effects
    let riskLevel = finalState.riskLevel !== 'Unknown' ? finalState.riskLevel : (score < 40 ? 'High' : (score > 70 ? 'Low' : 'Medium'));
    let revenuePotential = finalState.revenuePotential !== 'Unknown' ? finalState.revenuePotential : (score > 80 ? 'High' : (score < 50 ? 'Low' : 'Medium'));
    
    let recommendation = finalState.recommendation !== 'Proceed with standard follow-up.' 
      ? finalState.recommendation 
      : (score >= 80 ? 'High priority. Contact immediately and prioritize pipeline.' : (score < 40 ? 'Low priority. Proceed with caution or archive.' : 'Proceed with standard follow-up.'));

    return {
      opportunityScore: score,
      revenuePotential,
      riskLevel,
      propertyType: finalState.propertyType,
      priceRange,
      strengths: finalState.strengths,
      weaknesses: finalState.weaknesses,
      recommendation
    };
  }
}


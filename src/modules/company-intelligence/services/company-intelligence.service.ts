import { CompanyProfile } from '../types/company.types';
import { IntelligenceOpportunity } from '../../revenue-intelligence/types/intelligence.types';

export class CompanyIntelligenceService {
  private profiles: Map<string, CompanyProfile> = new Map();

  public ingest(opportunities: IntelligenceOpportunity[]): CompanyProfile[] {
    opportunities.forEach(opp => {
      // If it has no targetCompany, we can't build a deterministic CompanyProfile
      if (!opp.targetCompany) return;

      const normalizedName = this.normalizeAlias(opp.targetCompany);
      let profile = this.find(normalizedName);

      if (!profile) {
        profile = this.createProfile(normalizedName, opp);
        this.profiles.set(normalizedName, profile);
      } else {
        this.merge(profile, opp);
      }
    });

    return this.rank(Array.from(this.profiles.values()));
  }

  public normalizeAlias(name: string): string {
    return name
      .replace(/\s+(SRL|SA|Group|Development|Imobiliare|Construct|Holdings|Capital|Properties|Partners)\b/ig, '')
      .trim()
      .toUpperCase();
  }

  public find(normalizedName: string): CompanyProfile | undefined {
    return this.profiles.get(normalizedName);
  }

  private createProfile(normalizedName: string, opp: IntelligenceOpportunity): CompanyProfile {
    const profile: CompanyProfile = {
      id: `comp-${normalizedName.replace(/\s+/g, '-').toLowerCase()}`,
      name: opp.targetCompany!, // Original formatted name
      aliases: [opp.targetCompany!],
      industry: opp.category,
      status: 'Monitoring',
      confidence: opp.confidence,
      summary: '',
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      projects: [],
      contacts: opp.contactTarget ? [opp.contactTarget] : [],
      articles: [opp],
      properties: [],
      insuranceOpportunities: [],
      investmentOpportunities: [],
      estimatedRevenuePotential: opp.estimatedRevenue,
      estimatedCommissionPotential: opp.potentialCommission,
      priority: opp.priority,
      risk: 'Low',
      score: opp.score,
      healthScore: 50,
      revenueScore: 0,
      relationshipScore: 0,
      activityScore: 10,
      opportunityScore: opp.score
    };

    this.updateScores(profile);
    profile.summary = this.summarize(profile);

    return profile;
  }

  public merge(profile: CompanyProfile, opp: IntelligenceOpportunity): void {
    // Check if article is already in
    if (!profile.articles.find(a => a.id === opp.id)) {
      profile.articles.push(opp);
      
      // Merge unique aliases
      if (!profile.aliases.includes(opp.targetCompany!)) {
        profile.aliases.push(opp.targetCompany!);
      }

      // Add contact if unique
      if (opp.contactTarget && !profile.contacts.includes(opp.contactTarget)) {
        profile.contacts.push(opp.contactTarget);
      }

      profile.estimatedRevenuePotential += opp.estimatedRevenue;
      profile.estimatedCommissionPotential += opp.potentialCommission;
      profile.lastSeen = new Date().toISOString();
      
      // Update confidence (avg)
      profile.confidence = Math.round((profile.confidence + opp.confidence) / 2);

      this.updateScores(profile);
      profile.summary = this.summarize(profile);
    }
  }

  public update(profileId: string, updates: Partial<CompanyProfile>): CompanyProfile | null {
    const profile = Array.from(this.profiles.values()).find(p => p.id === profileId);
    if (!profile) return null;
    
    Object.assign(profile, updates);
    this.updateScores(profile);
    return profile;
  }

  private updateScores(profile: CompanyProfile): void {
    profile.revenueScore = Math.min(100, Math.round(profile.estimatedCommissionPotential / 1000));
    profile.activityScore = Math.min(100, profile.articles.length * 10);
    profile.opportunityScore = Math.max(...profile.articles.map(a => a.score));
    profile.healthScore = Math.round((profile.revenueScore + profile.activityScore + profile.opportunityScore) / 3);
  }

  public summarize(profile: CompanyProfile): string {
    const totalCom = (profile.estimatedCommissionPotential / 1000).toFixed(1);
    return `${profile.name} has ${profile.articles.length} recent market signals. Target ${profile.contacts[0] || 'stakeholders'} for an estimated commission of €${totalCom}k.`;
  }

  public rank(profiles: CompanyProfile[]): CompanyProfile[] {
    return profiles.sort((a, b) => b.estimatedCommissionPotential - a.estimatedCommissionPotential);
  }
}

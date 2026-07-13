import { IFeedProvider, RevenueOpportunity } from '../types/revenue-feed.types';
import { GoogleNewsProvider } from '../providers/google-news.provider';
import { ProfitRoProvider } from '../providers/profit-ro.provider';
import { RadarAnalyzerService } from '../../radar/services/analyzer.service';

export class RevenueFeedService {
  private providers: IFeedProvider[] = [];
  private cache: { timestamp: number; data: RevenueOpportunity[] } | null = null;
  private readonly CACHE_TTL = 15 * 60 * 1000; // 15 minutes
  private analyzer = new RadarAnalyzerService();

  constructor() {
    this.providers = [
      new GoogleNewsProvider(),
      new ProfitRoProvider()
    ];
  }

  public async loadFeeds(): Promise<RevenueOpportunity[]> {
    // Check cache
    if (this.cache && (Date.now() - this.cache.timestamp) < this.CACHE_TTL) {
      return this.cache.data;
    }

    const allOpportunities: RevenueOpportunity[] = [];

    const fetchPromises = this.providers.map(async provider => {
      const rawItems = await provider.fetch();
      const validItems = rawItems.filter(item => provider.validate(item));
      const normalized = validItems.map(item => provider.normalize(item));
      return normalized;
    });

    const results = await Promise.allSettled(fetchPromises);
    
    let hasFailures = false;
    let failureReasons: string[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allOpportunities.push(...result.value);
      } else {
        hasFailures = true;
        failureReasons.push(result.reason?.message || 'Unknown error');
      }
    });

    if (allOpportunities.length === 0 && hasFailures) {
      throw new Error(`Revenue feeds failed to load: ${failureReasons.join(', ')}`);
    }

    const deduplicated = this.deduplicate(allOpportunities);
    const classified = this.classifyAll(deduplicated);
    const scored = this.scoreAll(classified);
    const sorted = this.sort(scored);

    // Only cache if we actually retrieved data to prevent caching a network error state
    if (sorted.length > 0) {
      this.cache = { timestamp: Date.now(), data: sorted };
    }

    return sorted;
  }

  public deduplicate(opportunities: RevenueOpportunity[]): RevenueOpportunity[] {
    const seenUrls = new Set<string>();
    const unique: RevenueOpportunity[] = [];

    for (const opp of opportunities) {
      if (!seenUrls.has(opp.url)) {
        seenUrls.add(opp.url);
        unique.push(opp);
      }
    }
    return unique;
  }

  public classifyAll(opportunities: RevenueOpportunity[]): RevenueOpportunity[] {
    return opportunities.map(opp => {
      const text = `${opp.title} ${opp.summary}`.toLowerCase();
      
      if (text.includes('developer') || text.includes('dezvoltator') || text.includes('construction') || text.includes('proiect')) {
        opp.category = 'Developer';
        opp.nextStep = 'Call developer.';
      } else if (text.includes('office') || text.includes('birouri') || text.includes('lease') || text.includes('corporate')) {
        opp.category = 'Office';
        opp.nextStep = 'Offer insurance review.';
      } else if (text.includes('luxury') || text.includes('premium') || text.includes('lux') || text.includes('exclusive')) {
        opp.category = 'Luxury';
        opp.nextStep = 'Search Head of Sales.';
      } else if (text.includes('invest') || text.includes('tranzactie') || text.includes('achizitie') || text.includes('fund')) {
        opp.category = 'Investment';
        opp.nextStep = 'Schedule follow-up.';
      } else if (text.includes('commercial') || text.includes('retail') || text.includes('magazin')) {
        opp.category = 'Commercial';
        opp.nextStep = 'Monitor project.';
      } else {
        opp.category = 'Owner';
        opp.nextStep = 'Contact owner directly.';
      }

      return opp;
    });
  }

  public scoreAll(opportunities: RevenueOpportunity[]): RevenueOpportunity[] {
    return opportunities.map(opp => {
      // Consume the existing Radar Analyzer to apply rules
      const analysis = this.analyzer.analyze(`${opp.title} ${opp.summary}`);
      
      opp.score = analysis.opportunityScore;
      const revenueStr = typeof analysis.revenuePotential === 'string' ? analysis.revenuePotential.replace(/[^\d]/g, '') : analysis.revenuePotential;
      opp.estimatedRevenue = parseInt(revenueStr as string || '0', 10);
      
      // Calculate confidence based on source and keyword match
      let baseConfidence = opp.source === 'Profit.ro' ? 85 : 70;
      if (analysis.strengths.length > 0) baseConfidence += 10;
      if (analysis.weaknesses.length > 0) baseConfidence -= 10;
      opp.confidence = Math.min(100, Math.max(0, baseConfidence));

      // Generate WHY
      opp.why = `AiX detected a high-value ${opp.category} opportunity with an estimated potential of €${(opp.estimatedRevenue / 1000).toFixed(0)}k based on recent market activity.`;

      // Apply business logic scaling
      if (opp.category === 'Developer') {
        opp.estimatedRevenue += 1000000;
        opp.priority = 90;
        opp.why = `Major developer activity detected, signaling immediate partnership potential worth €${(opp.estimatedRevenue / 1000000).toFixed(1)}M.`;
      } else if (opp.category === 'Investment') {
        opp.estimatedRevenue += 500000;
        opp.priority = 85;
        opp.why = `Investment market movement indicates a likely liquidity event or acquisition.`;
      } else {
        opp.priority = analysis.opportunityScore;
      }

      return opp;
    });
  }

  public sort(opportunities: RevenueOpportunity[]): RevenueOpportunity[] {
    return [...opportunities].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.estimatedRevenue - a.estimatedRevenue;
    });
  }
}

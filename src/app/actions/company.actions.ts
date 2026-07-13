'use server';

import { RevenueFeedService } from '@/modules/revenue-feed/services/revenue-feed.service';
import { RevenueIntelligenceService } from '@/modules/revenue-intelligence/services/revenue-intelligence.service';
import { CompanyIntelligenceService } from '@/modules/company-intelligence/services/company-intelligence.service';
import { CompanyProfile } from '@/modules/company-intelligence/types/company.types';

export async function getCompanyGraph(): Promise<CompanyProfile[]> {
  try {
    const feedService = new RevenueFeedService();
    const intelligenceService = new RevenueIntelligenceService();
    const companyService = new CompanyIntelligenceService();

    const rawFeeds = await feedService.loadFeeds();
    const opportunities = intelligenceService.analyzeAll(rawFeeds);
    const companies = companyService.ingest(opportunities);

    return companies;
  } catch (error) {
    console.error('Failed to load company graph', error);
    return [];
  }
}

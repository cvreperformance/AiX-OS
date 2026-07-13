import Parser from 'rss-parser';
import { IFeedProvider, RevenueOpportunity } from '../types/revenue-feed.types';

export class ProfitRoProvider implements IFeedProvider {
  name = 'Profit.ro';
  private parser = new Parser();

  public async fetch(): Promise<any[]> {
    try {
      const feed = await this.parser.parseURL('https://www.profit.ro/rss');
      return feed.items;
    } catch (e) {
      console.error('Failed to fetch Profit.ro RSS', e);
      return [];
    }
  }

  public validate(rawItem: any): boolean {
    return !!rawItem.title && !!rawItem.link;
  }

  public normalize(rawItem: any): RevenueOpportunity {
    const content = rawItem.contentSnippet || rawItem.content || '';
    
    return {
      id: rawItem.guid || rawItem.id || `pr-${Buffer.from(rawItem.link).toString('base64').substring(0, 10)}`,
      title: rawItem.title || 'Untitled',
      summary: content.substring(0, 300),
      url: rawItem.link,
      publishedAt: rawItem.isoDate || rawItem.pubDate || new Date().toISOString(),
      source: 'Profit.ro',
      category: 'Business',
      location: 'Romania',
      estimatedRevenue: 0,
      priority: 0,
      score: 0,
      recommendedAction: 'Review Opportunity',
      tags: ['profit.ro'],
      confidence: 0,
      why: '',
      nextStep: ''
    };
  }

  public score(opportunity: RevenueOpportunity): RevenueOpportunity {
    return opportunity;
  }
}

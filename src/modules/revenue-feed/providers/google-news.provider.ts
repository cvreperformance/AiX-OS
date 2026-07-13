import Parser from 'rss-parser';
import { IFeedProvider, RevenueOpportunity } from '../types/revenue-feed.types';

export class GoogleNewsProvider implements IFeedProvider {
  name = 'Google News';
  private parser = new Parser();
  private queries = [
    'Romania real estate',
    'Romania developers',
    'Romania investments',
    'Bucharest office lease'
  ];

  public async fetch(): Promise<any[]> {
    const allItems: any[] = [];
    
    for (const query of this.queries) {
      try {
        const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
        const feed = await this.parser.parseURL(url);
        const itemsWithSource = feed.items.map(item => ({ ...item, _query: query }));
        allItems.push(...itemsWithSource);
      } catch (e) {
        console.error(`Failed to fetch Google News for query: ${query}`, e);
      }
    }
    return allItems;
  }

  public validate(rawItem: any): boolean {
    return !!rawItem.title && !!rawItem.link;
  }

  public normalize(rawItem: any): RevenueOpportunity {
    const content = rawItem.contentSnippet || rawItem.content || '';
    
    return {
      id: rawItem.guid || rawItem.id || `gn-${Buffer.from(rawItem.link).toString('base64').substring(0, 10)}`,
      title: rawItem.title || 'Untitled News',
      summary: content.substring(0, 300),
      url: rawItem.link,
      publishedAt: rawItem.isoDate || rawItem.pubDate || new Date().toISOString(),
      source: rawItem.creator || rawItem.source || 'Google News',
      category: 'News',
      location: 'Romania',
      estimatedRevenue: 0,
      priority: 0,
      score: 0,
      recommendedAction: 'Review Opportunity',
      tags: [rawItem._query],
      confidence: 0,
      why: '',
      nextStep: ''
    };
  }

  public score(opportunity: RevenueOpportunity): RevenueOpportunity {
    return opportunity;
  }
}

// src/lib/dataHub/DataHub.ts

import { IDataProvider } from './IDataProvider';
import { NewsProvider } from '../providers/news.provider';
import { CompanyProvider } from '../providers/company.provider';
import { DeveloperProvider } from '../providers/developer.provider';
import { NewsRssProvider } from '../providers/newsRss.provider';

/**
 * Central hub that holds isolated data providers.
 * Each provider is responsible for fetching and normalising data for a specific domain.
 */
export class DataHub {
  private providers: Map<string, IDataProvider<any>> = new Map();

  /** Register a provider under a unique key */
  register<T>(key: string, provider: IDataProvider<T>) {
    if (this.providers.has(key)) {
      throw new Error(`Provider with key "${key}" is already registered.`);
    }
    this.providers.set(key, provider);
  }

  /** Get a provider instance by its key */
  get<T>(key: string): IDataProvider<T> {
    const provider = this.providers.get(key);
    if (!provider) {
      throw new Error(`Provider with key "${key}" not found.`);
    }
    return provider as IDataProvider<T>;
  }

  /** Convenience method to fetch all items from a provider */
  async fetchAll<T>(key: string): Promise<T[]> {
    const provider = this.get<T>(key);
    return provider.fetchAll();
  }
}

// Export a singleton instance for app-wide usage
export const dataHub = new DataHub();

// Register providers on import – no circular dependency now
const rssUrl = process.env.NEXT_PUBLIC_RSS_FEED_URL;

dataHub.register('news', new NewsProvider());
dataHub.register('companies', new CompanyProvider());
dataHub.register('developers', new DeveloperProvider());
if (rssUrl) {
  dataHub.register('newsRss', new NewsRssProvider(rssUrl));
} else {
  console.warn('NEXT_PUBLIC_RSS_FEED_URL not set – NewsRssProvider not registered');
}

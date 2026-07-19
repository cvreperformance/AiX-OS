// src/lib/dataHub/index.ts

import { dataHub } from './DataHub';
import { NewsProvider } from '../providers/news.provider';
import { CompanyProvider } from '../providers/company.provider';
import { DeveloperProvider } from '../providers/developer.provider';
import { NewsRssProvider } from '../providers/newsRss.provider';

export function registerProviders(hub: any) {
  hub.register('news', new NewsProvider());
  hub.register('companies', new CompanyProvider());
  hub.register('developers', new DeveloperProvider());

  const rssUrl = process.env.NEXT_PUBLIC_RSS_FEED_URL;
  if (rssUrl) {
    hub.register('newsRss', new NewsRssProvider(rssUrl));
  } else {
    console.warn('NEXT_PUBLIC_RSS_FEED_URL not set – NewsRssProvider not registered');
  }
}

// Register providers on import
registerProviders(dataHub);

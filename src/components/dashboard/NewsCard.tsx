import Image from 'next/image';
import Link from 'next/link';
import { NewsArticle } from '@/lib/types';

/**
 * Premium card component for a news article.
 * Displays image, title, category, published date and a short summary.
 * Clicking the card navigates to the article detail page.
 */
export default function NewsCard({ article }: { article: NewsArticle }) {
  const published = article.published_at
    ? new Date(article.published_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

  const imageSrc = article.image_url ?? '/placeholder-news.jpg'; // fallback static asset

  return (
    <Link
      href={`/dashboard/news/${article.id}`}
      className="group block rounded-2xl border border-zinc-200 bg-zinc-50/30 overflow-hidden hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all"
    >
      <div className="relative aspect-video bg-zinc-100 overflow-hidden">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={article.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-5 space-y-2">
        <div className="flex justify-between text-xs text-zinc-400">
          <span>{published}</span>
          {article.category && <span className="uppercase">{article.category}</span>}
        </div>
        <h2 className="font-medium text-zinc-100 line-clamp-2 group-hover:text-amber-400 transition-colors">
          {article.title}
        </h2>
        {article.summary && (
          <p className="text-sm text-zinc-400 line-clamp-3">{article.summary}</p>
        )}
      </div>
    </Link>
  );
}

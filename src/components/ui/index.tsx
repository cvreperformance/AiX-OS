import Link from "next/link";
import { ScoreBadge } from "./ScoreBadge";

export { ScoreBadge, ScoreCard } from "./ScoreBadge";
export { PropertyCard } from "./PropertyCard";
export { PropertyImage, PropertyImagePlaceholder } from "./PropertyImage";
export { PropertyGallery } from "./PropertyGallery";
export {
  SkeletonCard,
  SkeletonGrid,
  SkeletonPageHeader,
  SkeletonAgencyCard,
  SkeletonNewsCard,
  SkeletonIndicatorRow,
} from "./Skeletons";


interface NewsCardProps {
  article: {
    slug: string;
    title: string;
    summary: string;
    category: string;
    image_url?: string;
    aix_score?: number;
    published_at?: string;
  };
}

export function NewsCard({ article }: NewsCardProps) {
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString("ro-RO", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <Link
      href={`/stiri/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30 transition-all hover:border-amber-500/30"
    >
      {article.image_url && (
        <div className="aspect-video overflow-hidden bg-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.image_url}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-amber-500/80">
            {article.category}
          </span>
          {date && <span className="text-xs text-zinc-600">{date}</span>}
        </div>
        <h3 className="font-medium text-zinc-100 line-clamp-2 group-hover:text-amber-400 transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-zinc-400 line-clamp-2 flex-1">
          {article.summary}
        </p>
        <ScoreBadge score={article.aix_score} size="sm" />
      </div>
    </Link>
  );
}

interface OpportunityCardProps {
  opportunity: {
    slug: string;
    title: string;
    description: string;
    opportunity_type: string;
    location: string;
    min_investment: number;
    currency: string;
    expected_yield?: number;
    aix_score?: number;
    image_url?: string;
  };
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const price = new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: opportunity.currency,
    maximumFractionDigits: 0,
  }).format(opportunity.min_investment);

  return (
    <Link
      href={`/oportunitati/${opportunity.slug}`}
      className="group block overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30 transition-all hover:border-amber-500/30"
    >
      {opportunity.image_url && (
        <div className="aspect-[16/9] overflow-hidden bg-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={opportunity.image_url}
            alt={opportunity.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-amber-500/10 px-3 py-0.5 text-xs uppercase tracking-wider text-amber-400">
            {opportunity.opportunity_type}
          </span>
          <ScoreBadge score={opportunity.aix_score} size="sm" />
        </div>
        <h3 className="font-medium text-zinc-100 group-hover:text-amber-400 transition-colors">
          {opportunity.title}
        </h3>
        <p className="text-sm text-zinc-400 line-clamp-2">{opportunity.description}</p>
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
          <div>
            <p className="text-xs text-zinc-500">Investiție minimă</p>
            <p className="text-lg font-light text-white">{price}</p>
          </div>
          {opportunity.expected_yield && (
            <div className="text-right">
              <p className="text-xs text-zinc-500">Yield estimat</p>
              <p className="text-lg font-light text-emerald-400">
                {opportunity.expected_yield}%
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export function PageHeader({ title, subtitle, badge }: PageHeaderProps) {
  return (
    <div className="mb-12 space-y-4">
      {badge && (
        <span className="inline-block text-xs uppercase tracking-[0.2em] text-amber-500/80">
          {badge}
        </span>
      )}
      <h1 className="text-4xl md:text-5xl font-light text-white tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

interface SectionProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  children: React.ReactNode;
}

export function Section({ title, subtitle, href, linkLabel, children }: SectionProps) {
  return (
    <section className="py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-light text-white">{title}</h2>
          {subtitle && <p className="text-zinc-400 mt-2">{subtitle}</p>}
        </div>
        {href && linkLabel && (
          <Link
            href={href}
            className="text-sm text-amber-500/80 hover:text-amber-400 transition-colors"
          >
            {linkLabel} →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

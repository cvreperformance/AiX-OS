import Link from "next/link";
import { scoreBg, scoreColor, formatScore } from "@/lib/format";
import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function ScoreBadge({
  score,
  size = "md",
  showLabel = true,
  className,
}: ScoreBadgeProps) {
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border font-medium",
        scoreBg(score),
        sizes[size],
        className
      )}
    >
      {showLabel && (
        <span className="text-zinc-400 text-xs uppercase tracking-wider">
          AiX Score
        </span>
      )}
      <span className={cn("font-semibold tabular-nums", scoreColor(score))}>
        {formatScore(score)}
      </span>
    </div>
  );
}

interface ScoreCardProps {
  score?: number;
  explanation?: string;
  insight?: string;
}

export function ScoreCard({ score, explanation, insight }: ScoreCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium uppercase tracking-widest text-zinc-400">
          AiX OS Score
        </h3>
        <ScoreBadge score={score} size="lg" showLabel={false} />
      </div>
      {explanation && (
        <div>
          <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">
            Why
          </p>
          <p className="text-zinc-300 text-sm leading-relaxed">{explanation}</p>
        </div>
      )}
      {insight && (
        <div className="border-t border-zinc-800 pt-4">
          <p className="text-xs uppercase tracking-wider text-amber-500/80 mb-1">
            Investment Insight
          </p>
          <p className="text-zinc-200 text-sm leading-relaxed">{insight}</p>
        </div>
      )}
    </div>
  );
}

interface PropertyCardProps {
  property: {
    slug: string;
    title: string;
    location: string;
    city: string;
    property_type: string;
    price: number;
    currency: string;
    image_url?: string;
    aix_score?: number;
    bedrooms?: number;
    area_sqm?: number;
  };
}

export function PropertyCard({ property }: PropertyCardProps) {
  const price = new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: property.currency,
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <Link
      href={`/anunturi/${property.slug}`}
      className="group block overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30 transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-800">
        {property.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.image_url}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-600">
            No image
          </div>
        )}
        <div className="absolute top-3 right-3">
          <ScoreBadge score={property.aix_score} size="sm" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <p className="text-2xl font-light text-white">{price}</p>
        </div>
      </div>
      <div className="p-5 space-y-2">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="uppercase tracking-wider">{property.property_type}</span>
          <span>·</span>
          <span>
            {property.location}, {property.city}
          </span>
        </div>
        <h3 className="font-medium text-zinc-100 line-clamp-2 group-hover:text-amber-400 transition-colors">
          {property.title}
        </h3>
        <div className="flex gap-4 text-xs text-zinc-500">
          {property.bedrooms && <span>{property.bedrooms} camere</span>}
          {property.area_sqm && <span>{property.area_sqm} mp</span>}
        </div>
      </div>
    </Link>
  );
}

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

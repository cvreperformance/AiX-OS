import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ScoreCard } from "@/components/ui";
import { getNewsArticle } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsArticle(slug);
  if (!article) return { title: "Articol negăsit" };
  return { title: article.title, description: article.summary };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getNewsArticle(slug);
  if (!article) notFound();

  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString("ro-RO", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <Link
        href="/stiri"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-amber-400 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Market Pulse
      </Link>

      <article className="space-y-8">
        <header className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <span className="uppercase tracking-wider text-amber-500/80">
              {article.category}
            </span>
            {date && <span className="text-zinc-600">{date}</span>}
          </div>
          <h1 className="text-3xl md:text-4xl font-light text-zinc-900 leading-tight">
            {article.title}
          </h1>
        </header>

        {article.image_url && (
          <div className="aspect-video overflow-hidden rounded-2xl bg-zinc-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.image_url}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-zinc-600 leading-relaxed">{article.summary}</p>
          {article.content && (
            <p className="text-zinc-400 leading-relaxed mt-4">{article.content}</p>
          )}
        </div>

        <ScoreCard
          score={article.aix_score}
          explanation={article.score_explanation}
          insight={article.investment_insight}
        />

        <footer className="border-t border-zinc-200 pt-6 text-xs text-zinc-600">
          Powered by AiX OS™ Market Pulse · {article.source_url ? "Sursa externă" : "AiX OS™ Intelligence"}
        </footer>
      </article>
    </div>
  );
}

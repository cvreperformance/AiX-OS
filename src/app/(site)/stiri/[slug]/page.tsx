import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ArrowLeft, ExternalLink, Calendar, ShieldCheck, Sparkles } from "lucide-react";
import { RealEstateNewsArticle } from "@/lib/news-engine/types";
import { supabasePublic } from "@/lib/supabase/client";

import { getRelatedArticles } from "@/lib/data";
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

const getArticleBySlug = cache(async (rawSlug: string): Promise<RealEstateNewsArticle | null> => {
  try {
    const slug = decodeURIComponent(rawSlug);
    const { data, error } = await supabasePublic
      .from("real_estate_news")
      .select("*")
      .eq("slug", slug)
      .limit(1);
    if (data && data.length > 0 && !error) {
      return data[0] as RealEstateNewsArticle;
    }
    return null;
  } catch (err) {
    console.error("Error in getArticleBySlug:", err);
    return null;
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Articol Negăsit | AiX OS™" };

  return {
    title: `${article.title} | AiX OS™ Real Estate Intelligence`,
    description: article.excerpt?.slice(0, 160) || article.summary?.slice(0, 160),
    openGraph: {
      title: article.title,
      description: article.excerpt?.slice(0, 160) || article.summary?.slice(0, 160),
      images: article.image_url ? [{ url: article.image_url }] : [],
      type: "article",
      publishedTime: article.published_at,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt?.slice(0, 160),
      images: article.image_url ? [article.image_url] : [],
    },
  };
}

export default async function NewsArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const related = await getRelatedArticles(article.category, slug);

  const summaryText = article.summary || "";
  const sections = summaryText.split("\n\n").filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    image: [article.image_url],
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    author: {
      "@type": "Organization",
      name: article.source_name,
    },
    publisher: {
      "@type": "Organization",
      name: "AiX OS™ Real Estate Intelligence",
      logo: {
        "@type": "ImageObject",
        url: "https://os.cristianvaduva.com/favicon.ico",
      },
    },
    description: article.excerpt || article.summary,
  };

  const tagsList = Array.isArray(article.tags) ? article.tags : [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-zinc-950 min-h-screen text-zinc-100 font-sans py-12 selection:bg-amber-500/30 selection:text-amber-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-10">
          {/* Top Navigation */}
          <Link
            href="/stiri"
            className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-amber-400 transition-colors uppercase tracking-wider font-medium"
          >
            <ArrowLeft className="h-4 w-4" /> Înapoi la Feed-ul de Știri
          </Link>

          {/* Article Header */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
              <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 font-semibold text-amber-400 uppercase tracking-wider">
                {article.category}
              </span>
              <span className="text-zinc-600">·</span>
              <span className="flex items-center gap-1.5 font-medium text-white">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                {article.source_name}
              </span>
              <span className="text-zinc-600">·</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(article.published_at).toLocaleDateString("ro-RO", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-tight text-white leading-tight">
              {article.title}
            </h1>

            {/* Score & Attribution Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-400">Scor Ingestie AiX:</span>
                <span className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-sm font-bold text-amber-400 font-mono">
                  {article.aix_score ? Number(article.aix_score).toFixed(1) : "8.5"} / 10
                </span>
              </div>

              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-black hover:bg-amber-400 transition-all shadow-md shadow-amber-500/10"
              >
                <span>CITEȘTE ARTICOLUL ORIGINAL PE {article.source_name?.toUpperCase() || "SURSĂ"}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Hero Image */}
          {article.image_url && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Factual Summary Box */}
          {summaryText && (
            <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-b from-amber-500/10 to-transparent p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
                <Sparkles className="h-4 w-4" />
                REZUMAT DE INTELIGENȚĂ IMOBILIARĂ · AiX OS™
              </div>

              <div className="space-y-4 text-sm text-zinc-200 leading-relaxed font-light whitespace-pre-line">
                {sections.map((sec, idx) => (
                  <p key={idx} className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                    {sec}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Main Content Body */}
          <div className="prose prose-invert max-w-none prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:font-light prose-headings:font-light prose-headings:text-white">
            <div className="whitespace-pre-line text-base text-zinc-300 leading-relaxed font-light space-y-6">
              {article.content || article.excerpt || article.summary}
            </div>
          </div>

          {/* Metadata & Tags */}
          {tagsList.length > 0 && (
            <div className="pt-6 border-t border-zinc-800 space-y-3">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Tag-uri Imobiliare</span>
              <div className="flex flex-wrap gap-2">
                {tagsList.map((tag: any, idx: number) => (
                  <span
                    key={idx}
                    className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-300"
                  >
                    #{String(tag)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Source Attribution Link Footer */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wider">Atribuire Sursă Oficială</p>
              <p className="text-sm font-medium text-white mt-0.5">
                Articol publicat inițial de {article.source_name}
              </p>
            </div>
            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-5 py-2 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 transition-all"
            >
              <span>Accesează Articolul Original</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Related Articles Section */}
          {related.length > 0 && (
            <div className="pt-12 border-t border-zinc-800 space-y-6">
              <h3 className="text-xl font-light text-white tracking-tight">Știri și Analize Similare</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((rel) => (
                  <Link
                    key={rel.id || rel.slug}
                    href={`/stiri/${rel.slug}`}
                    className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 space-y-3 hover:border-zinc-700 transition-all group"
                  >
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-400">
                      {rel.category}
                    </span>
                    <h4 className="text-sm font-light text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {rel.summary || rel.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

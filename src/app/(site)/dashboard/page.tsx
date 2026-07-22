"use client";

import { useEffect, useState } from "react";
import NewsCard from "@/components/dashboard/NewsCard";
import { NewsArticle } from "@/lib/types";
import { SkeletonGrid } from "@/components/ui/Skeletons";

export default function DashboardPage() {
  const [articles, setArticles] = useState<NewsArticle[] | null>(null);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch("/api/datahub/news");
        if (!res.ok) throw new Error("Failed to fetch news");
        const data: NewsArticle[] = await res.json();
        setArticles(data);
      } catch (e) {
        console.error(e);
        setArticles([]);
      }
    }
    loadNews();
  }, []);

  if (articles === null) {
    return (
      <section className="p-6">
        <h1 className="text-3xl font-semibold mb-6 text-zinc-100">Executive Dashboard</h1>
        <SkeletonGrid count={6} />
      </section>
    );
  }

  if (articles.length === 0) {
    return (
      <section className="p-6">
        <h1 className="text-3xl font-semibold mb-6 text-zinc-100">Executive Dashboard</h1>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/30 p-12 text-center">
          <p className="text-sm font-medium text-amber-500/80 mb-2 tracking-widest uppercase">MARKET INTELLIGENCE</p>
          <p className="text-lg text-zinc-300 font-light max-w-lg mx-auto">
            No relevant property market news currently available. The dashboard will automatically update when new real estate data is acquired.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-zinc-100">Executive Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}

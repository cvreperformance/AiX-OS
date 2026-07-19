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
        <div className="text-center py-12 text-zinc-500">Waiting for provider…</div>
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

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { NewsArticle } from "@/lib/types"
import NewsCard from "@/components/dashboard/NewsCard"
import { SkeletonGrid } from "@/components/ui/Skeletons"

export default function NewsDetailPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch("/api/datahub/news")
        if (!res.ok) throw new Error("Failed to fetch news")
        const data: NewsArticle[] = await res.json()
        const found = data.find((a) => a.id === id)
        if (!found) {
          // If not found, redirect to dashboard or show 404
          router.replace("/dashboard")
          return
        }
        setArticle(found)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [id, router])

  if (loading) {
    return (
      <section className="p-6">
        <SkeletonGrid count={1} />
      </section>
    )
  }

  if (!article) {
    return (
      <section className="p-6 text-center text-zinc-500">
        Article not found.
      </section>
    )
  }

  return (
    <section className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-zinc-100">{article.title}</h1>
      {article.image_url && (
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-auto mb-4 rounded-lg object-cover"
        />
      )}
      <p className="text-sm text-zinc-400 mb-2">{article.published_at ? new Date(article.published_at).toLocaleDateString() : ""}</p>
      {article.summary && <p className="mb-4 text-zinc-300">{article.summary}</p>}
      {article.content && <article className="prose prose-invert text-zinc-200" dangerouslySetInnerHTML={{ __html: article.content }} />}
    </section>
  )
}

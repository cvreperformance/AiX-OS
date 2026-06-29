import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ScoreCard } from "@/components/ui";
import { getDeveloper } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dev = await getDeveloper(slug);
  if (!dev) return { title: "Dezvoltator negăsit" };
  return { title: dev.name, description: dev.description };
}

export default async function DeveloperDetailPage({ params }: Props) {
  const { slug } = await params;
  const dev = await getDeveloper(slug);
  if (!dev) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <Link
        href="/dezvoltatori"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-amber-400 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Dezvoltatori
      </Link>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-light text-white mb-2">{dev.name}</h1>
          <p className="text-zinc-500">{dev.city} · {dev.projects_count} proiecte</p>
        </div>

        <p className="text-zinc-300 leading-relaxed">{dev.description}</p>

        <ScoreCard
          score={dev.aix_score}
          explanation={dev.score_explanation}
        />

        {dev.website && (
          <a
            href={dev.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm text-amber-400 hover:text-amber-300"
          >
            Website →
          </a>
        )}
      </div>
    </div>
  );
}

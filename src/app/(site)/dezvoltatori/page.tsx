import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, ScoreBadge } from "@/components/ui";
import { getDevelopers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Dezvoltatori",
  description: "Dezvoltatori imobiliari evaluați cu AiX OS Score.",
};

export default async function DezvoltatoriPage() {
  const developers = await getDevelopers();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <PageHeader
        badge="Dezvoltatori"
        title="Developer Score"
        subtitle="Dezvoltatori evaluați pe baza track record, calitate construcție și poziționare piață."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {developers.map((d) => (
          <Link
            key={d.id}
            href={`/dezvoltatori/${d.slug}`}
            className="group rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 hover:border-amber-500/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-light text-white group-hover:text-amber-400 transition-colors">
                  {d.name}
                </h3>
                <p className="text-sm text-zinc-500 mt-1">{d.city}</p>
              </div>
              <ScoreBadge score={d.aix_score} size="md" />
            </div>
            <p className="text-sm text-zinc-400 line-clamp-2 mb-4">{d.description}</p>
            <div className="flex gap-4 text-xs text-zinc-500">
              <span>{d.projects_count} proiecte</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

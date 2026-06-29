import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ScoreCard } from "@/components/ui";
import { formatPrice } from "@/lib/format";
import { getOpportunity } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const opp = await getOpportunity(slug);
  if (!opp) return { title: "Oportunitate negăsită" };
  return { title: opp.title, description: opp.description };
}

export default async function OpportunityDetailPage({ params }: Props) {
  const { slug } = await params;
  const opp = await getOpportunity(slug);
  if (!opp) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <Link
        href="/oportunitati"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-amber-400 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Oportunități
      </Link>

      <div className="space-y-8">
        {opp.image_url && (
          <div className="aspect-video overflow-hidden rounded-2xl bg-zinc-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={opp.image_url} alt={opp.title} className="h-full w-full object-cover" />
          </div>
        )}

        <div>
          <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs uppercase tracking-wider text-amber-400">
            {opp.opportunity_type}
          </span>
          <h1 className="text-3xl font-light text-white mt-4 mb-2">{opp.title}</h1>
          <p className="text-zinc-500">{opp.location}</p>
        </div>

        <p className="text-zinc-300 leading-relaxed">{opp.description}</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-zinc-800 p-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Investiție minimă</p>
            <p className="text-2xl font-light text-white mt-1">
              {formatPrice(opp.min_investment, opp.currency)}
            </p>
          </div>
          {opp.expected_yield && (
            <div className="rounded-xl border border-zinc-800 p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Yield estimat</p>
              <p className="text-2xl font-light text-emerald-400 mt-1">
                {opp.expected_yield}%
              </p>
            </div>
          )}
        </div>

        <ScoreCard
          score={opp.aix_score}
          explanation={opp.score_explanation}
          insight={opp.investment_insight}
        />

        <Link
          href="/contact"
          className="block w-full rounded-full bg-amber-500/90 py-4 text-center text-sm font-medium text-black hover:bg-amber-400 transition-all"
        >
          Solicită Detalii — Acces Privat
        </Link>
      </div>
    </div>
  );
}

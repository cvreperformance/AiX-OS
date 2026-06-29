import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { ScoreCard } from "@/components/ui";
import { getAgency } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const agency = await getAgency(slug);
  if (!agency) return { title: "Agenție negăsită" };
  return { title: agency.name, description: agency.description };
}

export default async function AgencyDetailPage({ params }: Props) {
  const { slug } = await params;
  const agency = await getAgency(slug);
  if (!agency) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <Link
        href="/agentii"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-amber-400 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Agenții
      </Link>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-light text-white mb-2">{agency.name}</h1>
          <p className="text-zinc-500">
            {agency.city} · {agency.properties_count} proprietăți listate
          </p>
        </div>

        <p className="text-zinc-300 leading-relaxed">{agency.description}</p>

        <ScoreCard score={agency.aix_score} />

        <div className="rounded-xl border border-zinc-800 p-6 space-y-3">
          <h3 className="text-sm uppercase tracking-wider text-zinc-500">Contact</h3>
          {agency.email && (
            <p className="flex items-center gap-2 text-zinc-300">
              <Mail className="h-4 w-4 text-amber-500/70" /> {agency.email}
            </p>
          )}
          {agency.phone && (
            <p className="flex items-center gap-2 text-zinc-300">
              <Phone className="h-4 w-4 text-amber-500/70" /> {agency.phone}
            </p>
          )}
        </div>

        <Link
          href="/contact"
          className="block w-full rounded-full bg-amber-500/90 py-4 text-center text-sm font-medium text-black hover:bg-amber-400 transition-all"
        >
          Contactează Agenția
        </Link>
      </div>
    </div>
  );
}

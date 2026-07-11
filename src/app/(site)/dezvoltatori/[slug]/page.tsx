import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe, MapPin, Layers, CheckCircle2 } from "lucide-react";
import { ScoreCard } from "@/components/ui";
import { getDeveloper } from "@/lib/data";
import { designSystem } from "@/styles/designSystem";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dev = await getDeveloper(slug);
  if (!dev) return { title: "Dezvoltator negăsit" };
  return { title: `${dev.name} | AiX OS™ Intelligence`, description: dev.description };
}

export default async function DeveloperDetailPage({ params }: Props) {
  const { slug } = await params;
  const dev = await getDeveloper(slug);
  if (!dev) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 space-y-10 animate-in">
      <Link
        href="/dezvoltatori"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-amber-400 mb-2 transition-all hover:translate-x-[-2px]"
      >
        <ArrowLeft className="h-4 w-4" />
        Înapoi la dezvoltatori
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-start gap-5">
            <div className="flex-shrink-0 h-16 w-16 rounded-2xl border border-zinc-200 bg-zinc-50 flex items-center justify-center overflow-hidden">
              {dev.logo_url ? (
                <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={dev.logo_url} alt={dev.name} className="h-full w-full object-contain p-2" />
                </>
              ) : (
                <span className="text-xl font-light text-amber-400 font-mono">
                  {dev.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <span className={designSystem.badgeElite}>
                {dev.country || "România"}
              </span>
              <h1 className="text-2xl font-light text-zinc-900 mt-2 mb-1">{dev.name}</h1>
              <p className="text-xs text-zinc-550 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                <MapPin className="h-3.5 w-3.5" />
                {dev.city || "București"} · {dev.projects_count || 0} proiecte active
              </p>
            </div>
          </div>

          <div className={`rounded-3xl ${designSystem.glass} p-6 sm:p-7 space-y-4`}>
            <h2 className="text-base font-light text-zinc-900 tracking-wide border-b border-zinc-200 pb-2.5">
              Despre Companie
            </h2>
            <p className="text-xs text-zinc-350 leading-relaxed whitespace-pre-line">
              {dev.description}
            </p>
          </div>

          {/* Projects List */}
          {dev.projects_list && dev.projects_list.length > 0 && (
            <div className={`rounded-3xl ${designSystem.glass} p-6 sm:p-7 space-y-4`}>
              <h2 className="text-base font-light text-zinc-900 flex items-center gap-2 border-b border-zinc-200 pb-2.5">
                <Layers className="h-4.5 w-4.5 text-amber-500/85" />
                Portofoliu Proiecte Reprezentative
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dev.projects_list.map((proj, idx) => (
                  <div key={idx} className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white/40 p-4 hover:border-zinc-300 transition-colors">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 flex-shrink-0" />
                    <span className="text-xs text-zinc-200 font-semibold">{proj}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Gallery */}
          <div className={`rounded-3xl ${designSystem.glass} p-6 sm:p-7 space-y-4`}>
            <h2 className="text-base font-light text-zinc-900 border-b border-zinc-200 pb-2.5">
              Galerie Proiecte Premium (Project Gallery)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { title: "Lobby Concept", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80" },
                { title: "Rooftop Terrace", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=300&q=80" },
                { title: "Facade Glass Structure", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=80" },
              ].map((item, index) => (
                <div key={index} className="group relative rounded-2xl overflow-hidden border border-zinc-200 bg-white aspect-video">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[10px] text-zinc-900 font-semibold uppercase tracking-wider">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info Column */}
        <div className="space-y-6">
          <ScoreCard
            score={dev.aix_score}
            explanation={dev.score_explanation}
          />

          <div className={`rounded-3xl ${designSystem.glass} p-6 space-y-5`}>
            <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">Specificații Dezvoltator</h3>
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between py-2 border-b border-zinc-200">
                <span className="text-zinc-400">Regiune activă</span>
                <span className="text-zinc-600 font-medium text-right">{dev.cities?.join(", ") || dev.city}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-200">
                <span className="text-zinc-400">Tipuri proprietăți</span>
                <span className="text-zinc-600 font-medium text-right">{dev.property_types?.join(", ") || "Residential"}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-zinc-400">Status</span>
                <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">Activ / Verified</span>
              </div>
            </div>

            {dev.website && (
              <a
                href={dev.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-xl border border-zinc-200 py-3 text-xs font-semibold text-zinc-600 hover:border-amber-500/40 hover:text-zinc-900 transition-all bg-zinc-50/10"
              >
                <Globe className="h-4 w-4 text-amber-500" />
                Vizitează Website Oficial
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

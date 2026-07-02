"use client";

import { useState, useMemo, useEffect } from "react";
import { PageHeader } from "@/components/ui";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { designSystem } from "@/styles/designSystem";
import { brandContent } from "@/lib/content/brand";
import Link from "next/link";
import {
  MapPin,
  Globe,
  Layers,
  Sparkles,
  Briefcase,
  Building,
} from "lucide-react";

// Mock developers dataset matching all requirements
interface Developer {
  id: string;
  slug: string;
  name: string;
  description: string;
  logo_url?: string;
  website?: string;
  aix_score: number;
  score_explanation: string;
  projects_count: number;
  city: string;
  status: "elite" | "premium" | "active";
  country: "România" | "Europe" | "Dubai" | "Monaco";
  sector: "luxury" | "premium" | "mixed-use" | "commercial" | "mid";
  x: number; // map coordinates
  y: number;
}

const DEVELOPERS: Developer[] = [
  {
    id: "1",
    slug: "one-united-properties",
    name: "One United Properties",
    description: "Liderul imobiliar premium și sustenabil din România. Portofoliu extins de turnuri verzi și penthouse-uri exclusiviste pe malul lacului.",
    aix_score: 9.1,
    score_explanation: "Track record excelent, capitalizare solidă pe bursă, standarde ridicate de sustenabilitate (LEED/WELL).",
    projects_count: 15,
    city: "București",
    status: "elite",
    country: "România",
    sector: "luxury",
    website: "https://www.one.ro",
    x: 42,
    y: 35,
  },
  {
    id: "2",
    slug: "emaar-properties",
    name: "Emaar Properties",
    description: "Dezvoltatorul gigant din Dubai, renumit pentru modelarea orizontului urban al emiratului, inclusiv Burj Khalifa și Downtown Dubai.",
    aix_score: 9.5,
    score_explanation: "Forță financiară masivă, portofoliu global diversificat, asistență guvernamentală suverană și apreciere istorică.",
    projects_count: 85,
    city: "Dubai",
    status: "elite",
    country: "Dubai",
    sector: "luxury",
    website: "https://www.emaar.com",
    x: 50,
    y: 52,
  },
  {
    id: "3",
    slug: "pastor-group",
    name: "Pastor Group",
    description: "Sinonim cu imobiliarele exclusiviste de lux din Monaco. Construiește și deține unele dintre cele mai securizate reședințe de pe Riviera.",
    aix_score: 9.7,
    score_explanation: "Monopol pe piața restrânsă din Monaco, conservare istorică excepțională a valorii activelor.",
    projects_count: 14,
    city: "Monte-Carlo",
    status: "elite",
    country: "Monaco",
    sector: "luxury",
    website: "https://www.groupepastor.mc",
    x: 55,
    y: 40,
  },
  {
    id: "4",
    slug: "damac-properties",
    name: "DAMAC Properties",
    description: "Dezvoltator de renume din Dubai, specializat în turnuri luxury în colaborare cu case de modă (Cavalli, de GRISOGONO).",
    aix_score: 9.2,
    score_explanation: "Focus excelent pe branded luxury design, rețea comercială globală de clienți HNWI.",
    projects_count: 42,
    city: "Dubai",
    status: "elite",
    country: "Dubai",
    sector: "luxury",
    website: "https://www.damacproperties.com",
    x: 48,
    y: 48,
  },
  {
    id: "5",
    slug: "speedwell",
    name: "Speedwell",
    description: "Dezvoltator belgian axat pe proiecte mixte sustenabile în principalele noduri economice din România.",
    aix_score: 8.8,
    score_explanation: "Calitate europeană a designului, concecepte urbane inovatoare și livrare conform calendarului.",
    projects_count: 6,
    city: "București",
    status: "premium",
    country: "România",
    sector: "mixed-use",
    website: "https://speedwell.be",
    x: 45,
    y: 18,
  },
  {
    id: "6",
    slug: "sobha-realty",
    name: "Sobha Realty",
    description: "Cunoscut pentru integrarea verticală și finisajele excepționale realizate in-house în proiectele sale premium.",
    aix_score: 9.3,
    score_explanation: "Control total asupra lanțului de aprovizionare și construcție, rate superioare de yield pe termen scurt.",
    projects_count: 22,
    city: "Dubai",
    status: "elite",
    country: "Dubai",
    sector: "premium",
    website: "https://www.sobharealty.com",
    x: 58,
    y: 62,
  },
  {
    id: "7",
    slug: "impact-developer",
    name: "Impact Developer & Contractor",
    description: "Pionier al proiectelor rezidențiale de mari dimensiuni în România, remarcat pentru ansamblurile verzi din București.",
    aix_score: 7.4,
    score_explanation: "Portofoliu mare de terenuri, dar penalizat la finisaje ultra-premium și ritmul de reabilitare a infrastructurii.",
    projects_count: 8,
    city: "București",
    status: "premium",
    country: "România",
    sector: "mid",
    website: "https://www.impactsa.ro",
    x: 60,
    y: 28,
  },
  {
    id: "8",
    slug: "granvia-residence",
    name: "Granvia Residence",
    description: "Grup spaniol specializat în reconversia zonelor industriale în cartiere rezidențiale accesibile.",
    aix_score: 7.1,
    score_explanation: "Prețuri atractive pe segmentul mediu, amplasamente aproape de rețelele de transport urban.",
    projects_count: 5,
    city: "București",
    status: "active",
    country: "România",
    sector: "mid",
    website: "https://www.granvia.ro",
    x: 40,
    y: 45,
  },
  {
    id: "9",
    slug: "skanska-europe",
    name: "Skanska Europe",
    description: "Lider mondial suedez în clădiri de birouri comerciale verzi și hub-uri tehnologice premium.",
    aix_score: 9.0,
    score_explanation: "Rating ESG impecabil, parteneriate solide cu investitori instituționali globali.",
    projects_count: 50,
    city: "Stockholm",
    status: "elite",
    country: "Europe",
    sector: "commercial",
    website: "https://group.skanska.com",
    x: 35,
    y: 12,
  },
  {
    id: "10",
    slug: "bouygues-immobilier",
    name: "Bouygues Immobilier",
    description: "Grup industrial francez, axat pe crearea de eco-districte urbane durabile la nivel european.",
    aix_score: 8.9,
    score_explanation: "Capacitate structurală masivă, tehnologii avansate de reducere a amprentei de carbon.",
    projects_count: 120,
    city: "Paris",
    status: "elite",
    country: "Europe",
    sector: "mixed-use",
    website: "https://www.bouygues-immobilier.com",
    x: 32,
    y: 20,
  },
  {
    id: "11",
    slug: "marzocco-group",
    name: "Marzocco Group",
    description: "Autorii celebrului turn rezidențial de lux Tour Odeon din Monaco, definind luxul absolut de pe Coastă.",
    aix_score: 9.8,
    score_explanation: "Constructor exclusiv de penthouse-uri ultra-scumpe, colaborări cu arhitecți reputați mondiali.",
    projects_count: 8,
    city: "Monte-Carlo",
    status: "elite",
    country: "Monaco",
    sector: "luxury",
    website: "https://www.marzocco.mc",
    x: 52,
    y: 38,
  },
];

export default function DevelopersPage() {
  const [selectedRegion, setSelectedRegion] = useState<"all" | "România" | "Europe" | "Dubai" | "Monaco">("all");
  const [selectedSector, setSelectedSector] = useState<"all" | "luxury" | "premium" | "mixed-use" | "commercial" | "mid">("all");

  // Filtering
  const filteredDevs = useMemo(() => {
    return DEVELOPERS.filter((d) => {
      if (selectedRegion !== "all" && d.country !== selectedRegion) return false;
      if (selectedSector !== "all" && d.sector !== selectedSector) return false;
      return true;
    });
  }, [selectedRegion, selectedSector]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16 animate-in">
      <PageHeader
        badge="Developers Directory"
        title="Bază Date Dezvoltatori"
        subtitle="Analiza tehnică, performanțele portofoliilor și ratingul AiX Score pentru principalii lideri în construcții luxury."
      />

      {/* Grid: Map on Left, Filters & Cards on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Developer Intelligence Spotlight Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-6 shadow-2xl relative overflow-hidden`}>
            {/* Spotlight Header */}
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
              <div className="rounded-xl bg-amber-500/10 p-2.5 border border-amber-500/20 text-amber-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Spotlight: Top Developer</h2>
                <p className="text-[10px] text-zinc-550 uppercase tracking-widest font-mono">Elite Rating Platform</p>
              </div>
            </div>

            {/* Showcase Details */}
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-light text-white">Marzocco Group</h3>
                  <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1 font-mono">
                    <MapPin className="h-3.5 w-3.5" /> Monaco
                  </p>
                </div>
                <ScoreBadge score={9.8} size="sm" />
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Autorii celebrului turn rezidențial de lux Tour Odeon din Monaco, definind luxul absolut de pe Coastă. Constructor exclusiv de penthouse-uri ultra-scumpe, colaborări cu arhitecți reputați mondiali.
              </p>
              <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-zinc-900/60 text-xs">
                <div>
                  <p className="text-[10px] text-zinc-500">Active Projects</p>
                  <p className="font-semibold text-zinc-350 mt-0.5">8 proiecte active</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500">Sector</p>
                  <p className="font-semibold text-zinc-350 mt-0.5 uppercase tracking-wide text-[10px] font-mono text-amber-400">Luxury Elite</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/dezvoltatori/marzocco-group"
                  className="flex-1 text-center py-2.5 rounded-xl bg-amber-500 text-black text-xs font-semibold hover:bg-amber-400 transition-colors"
                >
                  Analiză Completă
                </Link>
                <a
                  href="https://www.marzocco.mc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors flex items-center justify-center"
                >
                  <Globe className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className={`rounded-3xl border border-zinc-800 bg-zinc-950/20 p-6 space-y-4`}>
            <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">Distribuție Evaluări</h3>
            <div className="space-y-3">
              {[
                { label: "Elite Developers (>9.0)", count: 8, pct: "72%", color: "bg-emerald-500" },
                { label: "Premium (8.0 - 8.9)", count: 2, pct: "18%", color: "bg-amber-500" },
                { label: "Active (7.0 - 7.9)", count: 1, pct: "10%", color: "bg-zinc-500" },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">{stat.label}</span>
                    <span className="font-semibold text-white">{stat.count} companii</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div className={`h-full ${stat.color}`} style={{ width: stat.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters & Grid List on Right */}
        <div className="lg:col-span-7 space-y-6">
          {/* Controls Box */}
          <div className={`p-4 rounded-3xl ${designSystem.glass} flex flex-wrap gap-4 items-center justify-between`}>
            {/* Region Select */}
            <div className="space-y-1">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">Regiune activă</p>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value as any)}
                className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50 appearance-none"
              >
                <option value="all">Toate Țările</option>
                <option value="România">România</option>
                <option value="Europe">Europa</option>
                <option value="Dubai">Dubai</option>
                <option value="Monaco">Monaco</option>
              </select>
            </div>

            {/* Sector Select */}
            <div className="space-y-1">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">Sector principal</p>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value as any)}
                className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50 appearance-none"
              >
                <option value="all">Toate Sectoarele</option>
                <option value="luxury">Luxury</option>
                <option value="premium">Premium</option>
                <option value="mixed-use">Mixed-Use</option>
                <option value="commercial">Commercial</option>
                <option value="mid">Mid-use</option>
              </select>
            </div>

            <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-550">
              {filteredDevs.length} Companii înregistrate
            </span>
          </div>

          {/* Cards list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredDevs.map((dev) => {
              const badgeStyle = dev.status === "elite"
                ? designSystem.badgeElite
                : dev.status === "premium"
                  ? designSystem.badgePremium
                  : designSystem.badgeActive;

              return (
                <div
                  key={dev.id}
                  className={`relative rounded-3xl ${designSystem.glass} ${designSystem.glassHover} ${designSystem.cardSpacing}`}
                >
                  <div className={designSystem.glowTop} />
                  
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className={badgeStyle}>{dev.status}</span>
                      <h3 className="text-sm font-semibold text-white mt-1.5 group-hover:text-amber-400 transition-colors">
                        {dev.name}
                      </h3>
                      <p className="text-[10px] text-zinc-500 flex items-center gap-1.5 mt-1 font-mono">
                        <MapPin className="h-3.5 w-3.5 text-zinc-650" />
                        {dev.city}, {dev.country}
                      </p>
                    </div>
                    <ScoreBadge score={dev.aix_score} size="sm" />
                  </div>

                  <p className="text-xs text-zinc-450 leading-relaxed line-clamp-3 min-h-[54px]">
                    {dev.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-zinc-900 text-xs">
                    <div>
                      <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Sector</p>
                      <p className="text-zinc-350 font-semibold mt-0.5 uppercase tracking-wide text-[9px] font-mono flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5 text-amber-500/30" />
                        {dev.sector}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Active Projects</p>
                      <p className="text-zinc-350 font-semibold mt-0.5 flex items-center gap-1 font-mono">
                        <Layers className="h-3.5 w-3.5 text-amber-500/30" />
                        {dev.projects_count} unități
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-1">
                    <Link
                      href={`/dezvoltatori/${dev.slug}`}
                      className="flex-1 text-center py-2 rounded-xl border border-zinc-850 hover:border-amber-500/40 text-xs font-semibold text-zinc-300 hover:text-white transition-all bg-zinc-900/10"
                    >
                      Analiză Completă
                    </Link>
                    {dev.website && (
                      <a
                        href={dev.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl border border-zinc-850 text-xs text-zinc-500 hover:text-white hover:border-zinc-700 transition-all flex items-center justify-center bg-zinc-900/10"
                        title="Website Oficial"
                      >
                        <Globe className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
      </div>
    </div>
  );
}
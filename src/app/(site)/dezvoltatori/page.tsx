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
  ShieldCheck,
  Briefcase,
  SlidersHorizontal,
  Compass,
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
    score_explanation: "Calitate europeană a designului, concepte urbane inovatoare și livrare conform calendarului.",
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
  const [activeDev, setActiveDev] = useState<Developer | null>(null);
  const [radarAngle, setRadarAngle] = useState(0);

  // Radar sweep animation
  useEffect(() => {
    const timer = setInterval(() => {
      setRadarAngle((prev) => (prev + 2.5) % 360);
    }, 40);
    return () => clearInterval(timer);
  }, []);

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
        
        {/* Interactive GIS Vector Map Component */}
        <div className="lg:col-span-5 rounded-3xl border border-zinc-800 bg-[#040404] p-4 relative overflow-hidden h-[480px] shadow-2xl flex flex-col justify-between">
          {/* Repeating grid pattern */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                radial-gradient(circle, rgba(251, 191, 36, 0.02) 1px, transparent 1px),
                linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px, 40px 40px, 40px 40px",
            }}
          />

          {/* Coordinate grid tickers */}
          <div className="absolute top-0 inset-x-0 h-6 border-b border-zinc-900/60 flex justify-between px-6 items-center text-[8px] font-mono text-zinc-600 pointer-events-none select-none">
            <span>LNG 26.082°</span>
            <span>LNG 26.105°</span>
            <span>LNG 26.130°</span>
          </div>

          <div className="absolute left-0 inset-y-0 w-6 border-r border-zinc-900/60 flex flex-col justify-between py-6 items-center text-[8px] font-mono text-zinc-600 pointer-events-none select-none">
            <span>LAT 44.455°</span>
            <span>LAT 44.439°</span>
            <span>LAT 44.421°</span>
          </div>

          {/* Golden Radar Lines & Concentric Target Circles */}
          <svg viewBox="0 0 1000 600" className="absolute inset-0 w-full h-full object-cover select-none opacity-25 pointer-events-none">
            <circle cx="500" cy="300" r="120" fill="none" stroke="rgba(251,191,36,0.12)" strokeWidth="1" />
            <circle cx="500" cy="300" r="240" fill="none" stroke="rgba(251,191,36,0.06)" strokeWidth="0.75" strokeDasharray="6 6" />
            <line
              x1="500"
              y1="300"
              x2={500 + 400 * Math.cos((radarAngle * Math.PI) / 180)}
              y2={300 + 400 * Math.sin((radarAngle * Math.PI) / 180)}
              stroke="rgba(251, 191, 36, 0.08)"
              strokeWidth="1.5"
            />
            <path d="M50 220 C250 140, 550 300, 950 120" fill="none" stroke="#2c2c2e" strokeWidth="1" />
          </svg>

          {/* Interactive GIS Pins */}
          {filteredDevs.map((dev) => {
            const isSelected = activeDev?.id === dev.id;
            return (
              <button
                key={dev.id}
                onClick={() => setActiveDev(dev)}
                className="absolute group transition-all duration-300 z-10"
                style={{
                  left: `${dev.x}%`,
                  top: `${dev.y}%`,
                  transform: `translate(-50%, -50%) ${isSelected ? "scale(1.2)" : "scale(1)"}`,
                }}
              >
                <span className={`absolute inset-0 rounded-full bg-amber-500 opacity-40 scale-150 animate-ping group-hover:block ${isSelected ? "block" : "hidden"}`} />
                <div className={`flex items-center gap-1.5 rounded-full p-2.5 border transition-all duration-300 ${
                  isSelected ? "bg-black border-amber-500 shadow-lg shadow-amber-500/20" : "bg-[#0e0e0e] border-zinc-800"
                }`}>
                  <Building className={`h-3.5 w-3.5 ${isSelected ? "text-amber-400" : "text-zinc-400 group-hover:text-white"}`} />
                  <span className="text-[8px] font-bold text-zinc-400 font-mono px-1 bg-zinc-900 rounded border border-zinc-800">
                    {dev.aix_score}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Active Hover Detail Popup */}
          {activeDev ? (
            <div className={`m-3 rounded-2xl p-4 shadow-xl z-20 ${designSystem.glassSolid} animate-in fade-in slide-in-from-bottom-2 duration-200 mt-auto`}>
              <div className="flex justify-between items-start">
                <span className={designSystem.badgeElite}>
                  {activeDev.sector}
                </span>
                <ScoreBadge score={activeDev.aix_score} size="sm" />
              </div>
              <h4 className="text-xs font-semibold text-white mt-2">{activeDev.name}</h4>
              <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed line-clamp-2">{activeDev.description}</p>
              <div className="pt-3 border-t border-zinc-850 flex gap-2 mt-2">
                <Link
                  href={`/dezvoltatori/${activeDev.slug}`}
                  className="flex-1 text-center py-2 rounded-xl bg-amber-500 text-black text-[10px] font-semibold hover:bg-amber-400 transition-colors"
                >
                  Analiză Completă
                </Link>
                {activeDev.website && (
                  <a
                    href={activeDev.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-2 rounded-xl border border-zinc-850 text-[10px] text-zinc-400 hover:text-white transition-colors flex items-center justify-center"
                  >
                    <Globe className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="m-3 rounded-2xl p-4 text-center border border-zinc-900 bg-zinc-950/80 text-[10px] text-zinc-550 flex items-center justify-center gap-2 mt-auto">
              <Compass className="h-4 w-4 text-amber-500/70 animate-spin" style={{ animationDuration: "8s" }} />
              <span>Selectați un marker pe hartă pentru analiza rapidă a companiei.</span>
            </div>
          )}
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
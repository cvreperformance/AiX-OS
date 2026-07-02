"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowUpRight,
  TrendingUp,
  Brain,
  Building2,
  Globe,
  Sparkles,
  Plane,
  Shield,
  Activity,
  Coins,
  ChevronRight,
  User,
  Quote,
  Star,
} from "lucide-react";
import { GlobalSearch } from "@/components/ui/GlobalSearch";
import { designSystem } from "@/styles/designSystem";
import { getMarketIntelligence, MarketItem } from "@/lib/market/dataProvider";

// Sample properties data
const FEATURED_PROPERTIES = [
  {
    id: "p1",
    title: "Penthouse Floreasca Lake",
    price: "4.850.000 €",
    location: "Floreasca, București",
    aixScore: 9.1,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
    tags: ["penthouse", "lake-view"],
    slug: "penthouse-floreasca-lake",
  },
  {
    id: "p2",
    title: "Vila Premium Pipera",
    price: "2.100.000 €",
    location: "Pipera, București",
    aixScore: 8.9,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
    tags: ["villa", "swimming-pool"],
    slug: "vila-premium-pipera",
  },
  {
    id: "p3",
    title: "Apartament Dorobanți Glass",
    price: "1.450.000 €",
    location: "Dorobanți, București",
    aixScore: 9.2,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    tags: ["apartment", "new-construction"],
    slug: "apartament-dorobanti-glass",
  },
];

const QUICK_ACCESS = [
  { label: "Hartă GIS", href: "/map", icon: Globe },
  { label: "Money Advisor", href: "/money-advisor", icon: Brain },
  { label: "Piață & Macro", href: "/market", icon: Activity },
  { label: "Aviație Privată", href: "/private-jets", icon: Plane },
  { label: "Dezvoltatori", href: "/dezvoltatori", icon: Building2 },
];

const SPOTLIGHT_DEVELOPERS = [
  {
    name: "One United Properties",
    country: "România",
    city: "București",
    aixScore: 9.1,
    desc: "Liderul imobiliar sustenabil de lux. Proiecte verzi premiate și standarde superioare de viață urbană.",
    slug: "one-united-properties",
  },
  {
    name: "Emaar Properties",
    country: "Emiratele Arabe",
    city: "Dubai",
    aixScore: 9.5,
    desc: "Autorul celebrelor turnuri Burj Khalifa și Downtown Dubai, definind orizontul modern al emiratului.",
    slug: "emaar-properties",
  },
];

const AI_TOOLS = [
  { title: "Money Advisor", desc: "Consultant financiar personal pentru optimizare portofolii rezidențiale.", href: "/money-advisor", icon: Brain, label: "AI Advisor" },
  { title: "AntiȚeapă AI", desc: "Scanare automată a riscurilor cadastrale și viciilor ascunse.", href: "/anti-teapa", icon: Shield, label: "Security Tool" },
  { title: "AI Valuation", desc: "Evaluare instantă a valorii corecte pe metru pătrat bazată pe tranzacții reale.", href: "/valuation", icon: Coins, label: "Valuator" },
];

const LUXURY_SERVICES = [
  { title: "Private Jets & Charter", desc: "Zboruri private la comandă și acces la terminale VIP FBO în întreaga lume.", href: "/private-jets", icon: Plane },
  { title: "Supercars & Mobility", desc: "Închirieri și achiziții de vehicule premium securizate pe Riviera Franceză și Dubai.", href: "/concierge", icon: Sparkles },
  { title: "Luxury Concierge", desc: "Servicii de relocare, achiziții discrete off-market și asistență juridică HNWI.", href: "/concierge", icon: Globe },
];

const NEWS = [
  { title: "Standardele ESG devin obligatorii pentru piața de lux în 2026", date: "Astăzi · Imobiliare", desc: "Noile reglementări europene recompensează clădirile rezidențiale verzi cu reduceri de impozite." },
  { title: "Capitalurile din Dubai migrează spre zonele de tip Safe Haven din Europa", date: "Ieri · Macro", desc: "Analiză macroeconomică asupra fluxurilor monetare direcționate spre Monaco și Elveția." },
];

const TESTIMONIALS = [
  { text: "AiX OS a redus timpul nostru de due diligence de la câteva săptămâni la câteva minute. AntiȚeapă AI a descoperit un viciu cadastral major înainte de tranzacție.", author: "Alexander V. · UHNW Investitor", city: "Monaco" },
  { text: "Indicatorul AiX Score este singurul pe care îl consultăm înainte de a plasa capital în proprietăți în București. Extrem de precis pe ROI.", author: "Elena M. · Manager Fond Imobiliar", city: "London / București" },
];

export default function HomePage() {
  const [liveCrypto, setLiveCrypto] = useState<MarketItem[]>([]);

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await getMarketIntelligence();
        setLiveCrypto(res.crypto);
      } catch (e) {
        console.warn("HomePage failed loading live market data", e);
      }
    };
    fetchLive();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. Hero Section & Global Search */}
      <section className="relative pt-20 pb-16 overflow-hidden flex flex-col items-center justify-center min-h-[85vh] text-center px-4 sm:px-6">
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] bg-amber-500/[0.03] blur-3xl rounded-full" />
          <div className="absolute top-10 right-20 w-80 h-80 bg-blue-500/[0.02] blur-3xl rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto space-y-8 relative z-10 animate-in">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-[9px] uppercase tracking-widest text-amber-400 font-mono">
            <Sparkles className="h-3.5 w-3.5" />
            Luxury Intelligence Platform · 2026 Edition
          </span>

          <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-white leading-tight">
            Sistemul de Operare al <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-white bg-clip-text text-transparent font-semibold">
              Imobiliarelor de Lux
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            AiX OS corelează tranzacțiile imobiliare premium cu indicii macroeconomici, analizele de risc AI și mobilitatea VIP. Platforma concepută exclusiv pentru investitori și fonduri UHNW.
          </p>

          {/* 2. Global Search Component */}
          <div className="pt-2">
            <GlobalSearch />
          </div>

          {/* 3. Quick Access */}
          <div className="pt-4 flex flex-wrap justify-center gap-2">
            {QUICK_ACCESS.map((qa) => (
              <Link
                key={qa.label}
                href={qa.href}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-850 bg-zinc-950/40 text-xs font-semibold text-zinc-400 hover:text-white hover:border-zinc-750 hover:bg-zinc-900/35 transition-all shadow-md"
              >
                <qa.icon className="h-3.5 w-3.5 text-amber-500/60" />
                {qa.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Properties */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
        <div className="flex justify-between items-end border-b border-zinc-900 pb-5">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-semibold">Portofoliu Selectat</span>
            <h2 className="text-2xl font-light text-white mt-1">Proprietăți Recomandate</h2>
          </div>
          <Link
            href="/proprietati"
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-amber-400 font-semibold transition-colors"
          >
            Vezi Toate
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_PROPERTIES.map((prop) => (
            <div
              key={prop.id}
              className={`group relative rounded-3xl overflow-hidden ${designSystem.glass} ${designSystem.glassHover}`}
            >
              <div className="absolute top-4 left-4 z-10 rounded-xl bg-black/60 border border-zinc-850 px-2.5 py-1 text-[10px] font-mono font-bold text-amber-400 flex items-center gap-1.5 backdrop-blur-md">
                <Star className="h-3.5 w-3.5 fill-current" />
                Score: {prop.aixScore}
              </div>
              
              {/* Image box */}
              <div className="relative h-60 w-full overflow-hidden bg-zinc-900">
                <img
                  src={prop.image}
                  alt={prop.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Detail Spacing */}
              <div className={designSystem.cardSpacing}>
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                    {prop.title}
                  </h3>
                  <p className="text-[10.5px] text-zinc-500 mt-0.5">{prop.location}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-900/60">
                  <span className="text-xs font-bold text-amber-400 font-mono">{prop.price}</span>
                  <Link
                    href={`/proprietati/${prop.slug}`}
                    className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 group-hover:text-white flex items-center gap-0.5"
                  >
                    Detalii
                    <ArrowUpRight className="h-3.5 w-3.5 text-amber-500/50 group-hover:text-amber-500 transition-colors" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Market Pulse Ticker */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className={`p-6 rounded-3xl ${designSystem.glass} grid grid-cols-1 md:grid-cols-4 gap-6 items-center`}>
          <div>
            <span className={designSystem.tickerText}>Live Market Data</span>
            <h3 className="text-sm font-bold text-white mt-1">Cotații Active</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Alimentat live de CoinGecko și BNR</p>
          </div>
          
          <div className="md:col-span-3 grid grid-cols-3 gap-4 border-l border-zinc-900/80 pl-6">
            {liveCrypto.length > 0 ? (
              liveCrypto.map((c) => (
                <div key={c.label}>
                  <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono">{c.label.split(" (")[0]}</p>
                  <p className="text-xs font-bold text-white mt-0.5 font-mono">{c.value}</p>
                  <span className="text-[10px] text-emerald-400 font-semibold">{c.change}</span>
                </div>
              ))
            ) : (
              [
                { label: "Bitcoin (BTC)", value: "$67,890.00", change: "+3.40%" },
                { label: "Ethereum (ETH)", value: "$3,480.20", change: "+2.15%" },
                { label: "Solana (SOL)", value: "$148.50", change: "+5.80%" },
              ].map((c) => (
                <div key={c.label}>
                  <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono">{c.label.split(" (")[0]}</p>
                  <p className="text-xs font-bold text-zinc-400 mt-0.5 font-mono">{c.value}</p>
                  <span className="text-[10px] text-emerald-500/70 font-semibold">{c.change}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 6. Developer Spotlight */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
        <div className="border-b border-zinc-900 pb-5">
          <span className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-semibold">Spotlight</span>
          <h2 className="text-2xl font-light text-white mt-1">Dezvoltatori Recomandați</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SPOTLIGHT_DEVELOPERS.map((dev) => (
            <div
              key={dev.name}
              className={`p-6 sm:p-8 rounded-3xl ${designSystem.glass} ${designSystem.glassHover} flex flex-col justify-between min-h-[220px]`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{dev.name}</h3>
                    <p className="text-[10.5px] text-zinc-550 font-mono">{dev.city}, {dev.country}</p>
                  </div>
                  <div className="text-[10px] font-mono font-bold text-amber-400 border border-amber-500/25 bg-amber-500/5 px-2 py-0.5 rounded-lg">
                    AiX: {dev.aixScore}
                  </div>
                </div>
                <p className="text-xs text-zinc-450 leading-relaxed">{dev.desc}</p>
              </div>

              <div className="pt-6 border-t border-zinc-900/60 mt-6 flex justify-between items-center">
                <Link
                  href={`/dezvoltatori/${dev.slug}`}
                  className="text-xs text-zinc-400 hover:text-white font-semibold flex items-center gap-1"
                >
                  Vezi Proiecte
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <a
                  href="/map"
                  className="text-[10px] text-zinc-550 hover:text-amber-400 font-mono uppercase tracking-wider"
                >
                  Locație Map GIS
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. AI Tools */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
        <div className="border-b border-zinc-900 pb-5">
          <span className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-semibold">Digital Suite</span>
          <h2 className="text-2xl font-light text-white mt-1">Instrumente AI de Analiză</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AI_TOOLS.map((tool) => (
            <div
              key={tool.title}
              className={`p-6 rounded-3xl ${designSystem.glass} ${designSystem.glassHover} relative overflow-hidden flex flex-col justify-between min-h-[200px]`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="rounded-xl bg-amber-500/10 p-2.5 border border-amber-500/20 text-amber-400">
                    <tool.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[9px] font-mono text-zinc-650 uppercase tracking-widest border border-zinc-900 px-2 py-0.5 rounded-full bg-zinc-950/20">
                    {tool.label}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-zinc-450 leading-relaxed mt-1">{tool.desc}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-900/60 mt-6">
                <Link
                  href={tool.href}
                  className="text-xs text-zinc-400 hover:text-white font-semibold flex items-center justify-between"
                >
                  Accesează Tool
                  <ArrowUpRight className="h-4 w-4 text-zinc-650" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Luxury Services Hub */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
        <div className="border-b border-zinc-900 pb-5">
          <span className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-semibold">Exclusive Mobility</span>
          <h2 className="text-2xl font-light text-white mt-1">Servicii Luxury Lifestyle</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LUXURY_SERVICES.map((s) => (
            <div
              key={s.title}
              className={`p-6 rounded-3xl ${designSystem.glass} ${designSystem.glassHover} flex flex-col justify-between min-h-[200px]`}
            >
              <div className="space-y-4">
                <div className="rounded-xl bg-zinc-900/60 p-2.5 border border-zinc-800 text-zinc-400 max-w-fit">
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{s.title}</h3>
                  <p className="text-xs text-zinc-450 leading-relaxed mt-1">{s.desc}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-900/60 mt-6">
                <Link
                  href={s.href}
                  className="text-xs text-zinc-400 hover:text-white font-semibold flex items-center justify-between"
                >
                  Rezervă Serviciu
                  <ArrowUpRight className="h-4 w-4 text-zinc-650" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Latest News */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
        <div className="flex justify-between items-end border-b border-zinc-900 pb-5">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-semibold">Macro Insights</span>
            <h2 className="text-2xl font-light text-white mt-1">Știri & Analize de Piață</h2>
          </div>
          <Link
            href="/stiri"
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-amber-400 font-semibold transition-colors"
          >
            Vezi Toate
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {NEWS.map((n) => (
            <div
              key={n.title}
              className={`p-6 rounded-3xl ${designSystem.glass} ${designSystem.glassHover} space-y-4`}
            >
              <div>
                <span className="text-[9px] uppercase tracking-widest text-amber-500/80 font-mono">{n.date}</span>
                <h3 className="text-sm font-semibold text-white mt-1.5 leading-snug">{n.title}</h3>
              </div>
              <p className="text-xs text-zinc-450 leading-relaxed">{n.desc}</p>
              <div className="pt-3 border-t border-zinc-900/60">
                <Link
                  href="/stiri"
                  className="text-[10.5px] uppercase tracking-widest font-mono text-zinc-500 hover:text-white flex items-center gap-1"
                >
                  Citește Articolul
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. Testimonials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
        <div className="border-b border-zinc-900 pb-5">
          <span className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-semibold">Credibilitate</span>
          <h2 className="text-2xl font-light text-white mt-1">Recomandări Clienți</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className={`p-6 sm:p-8 rounded-3xl ${designSystem.glass} flex flex-col justify-between relative min-h-[180px]`}
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-amber-500/[0.06] pointer-events-none" />
              <p className="text-xs text-zinc-350 leading-relaxed italic">
                "{t.text}"
              </p>
              <div className="pt-6 border-t border-zinc-900/60 mt-6 flex justify-between items-center text-[10px] font-mono">
                <span className="font-semibold text-zinc-450 flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-zinc-650" />
                  {t.author}
                </span>
                <span className="text-zinc-600">{t.city}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. Call To Action */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className={`p-8 sm:p-12 rounded-3xl border border-amber-500/20 bg-[#080808]/70 backdrop-blur-xl text-center space-y-6 relative overflow-hidden shadow-2xl`}>
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Descoperă Active Sub Evaluare
          </h2>
          <p className="text-xs text-zinc-450 max-w-lg mx-auto leading-relaxed">
            Consilierii noștri HNWI utilizează modulele avansate de pe AiX OS pentru a asigura randamente sigure pe portofolii imobiliare de lux.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-contact-popup"))}
              className="rounded-xl bg-amber-500 text-black px-6 py-2.5 text-xs font-semibold hover:bg-amber-400 transition-all shadow-md shadow-amber-500/10 flex items-center gap-1.5"
            >
              Programează Întâlnire Advisor
            </button>
            <Link
              href="/ai"
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 px-6 py-2.5 text-xs text-zinc-350 hover:text-white transition-all flex items-center gap-1"
            >
              AI Terminal
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

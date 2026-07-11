"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Building2,
  Sparkles,
  Shield,
  Activity,
  BookOpen,
  Wrench,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Lock,
  Globe,
  ArrowUpRight,
  Scale,
  Zap
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { designSystem } from "@/styles/designSystem";

interface HomeClientPageProps {
  featuredProperties: any[];
  featuredNews: any[];
}

export default function HomeClientPage({ featuredProperties, featuredNews }: HomeClientPageProps) {
  const { language } = useLanguage();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeSimulationStep, setActiveSimulationStep] = useState(0);

  const QUICK_GRID = [
    {
      title: language === "ro" ? "Cumpără & Vinde" : "Buy & Sell",
      desc: language === "ro" ? "Proprietăți premium, profile dezvoltatori și consultanță exclusivă." : "Premium units, builder audits, and exclusive buyer representation.",
      icon: Building2,
      color: "text-blue-400 border-blue-500/10 hover:bg-blue-500/[0.02]",
      href: "/proprietati"
    },
    {
      title: language === "ro" ? "Investește & Protejează" : "Invest & Protect",
      desc: language === "ro" ? "Market Pulse, dobânzi BNR active, portofolii și asigurări active." : "Macro ticker metrics, tax guidelines, asset allocations, and home insurance.",
      icon: Shield,
      color: "text-rose-400 border-rose-500/10 hover:bg-rose-500/[0.02]",
      href: "/stiri"
    },
    {
      title: language === "ro" ? "Învață & Cercetează" : "Learn & Research",
      desc: language === "ro" ? "Biblioteca de cărți, checklist-uri, cursuri practice și cuvântul zilei." : "Business reading list, document templates, investor guides, and the daily word.",
      icon: BookOpen,
      color: "text-amber-400 border-amber-500/10 hover:bg-amber-500/[0.02]",
      href: "/learning"
    },
    {
      title: language === "ro" ? "Instrumente" : "Tools",
      desc: language === "ro" ? "Calculatoare credite imobiliare, randament yield și convertoare." : "Mortgage interest estimators, cash flow ROI sheets, and currency values.",
      icon: Wrench,
      color: "text-teal-400 border-teal-500/10 hover:bg-teal-500/[0.02]",
      href: "/convenience"
    },
    {
      title: language === "ro" ? "Sistem AI" : "AI System",
      desc: language === "ro" ? "Nucleul central AiX Brain și asistentul tău financiar AI Advisor." : "The central decision cockpit routing queries across registries.",
      icon: Brain,
      color: "text-violet-400 border-violet-500/10 hover:bg-violet-500/[0.02]",
      href: "/brain"
    }
  ];

  const AI_AGENTS = [
    {
      id: "property",
      name: language === "ro" ? "Agent Proprietăți" : "Property Agent",
      desc: language === "ro" ? "Scanează automat documentațiile cadastrale și identifică riscurile ascunse." : "Scans land registry files automatically and flags structural or legal liabilities.",
      capabilities: language === "ro" 
        ? ["Verificare istoric titlu proprietate", "Detecție drum de servitute", "Sarcini bancare active"] 
        : ["Ownership title chain analysis", "Easement road audit", "Active mortgages check"],
      icon: Building2,
      href: "/property-scanner"
    },
    {
      id: "investment",
      name: language === "ro" ? "Agent Investiții" : "Investment Agent",
      desc: language === "ro" ? "Identifică oportunități premium off-market și calculează randamentul net." : "Locates off-market options and models dynamic net ROI benchmarks.",
      capabilities: language === "ro" 
        ? ["Simulare yield cash flow", "Comparație preț/mp pe sub-zone", "Arbitraj imobiliar"] 
        : ["Cash-flow yield modeling", "Sub-market price benchmarking", "Real estate arbitrage flags"],
      icon: TrendingUp,
      href: "/simulation"
    },
    {
      id: "insurance",
      name: language === "ro" ? "Agent Asigurări" : "Insurance Agent",
      desc: language === "ro" ? "Calculează cotațiile optime de primă și protejează activele împotriva riscurilor." : "Extracts optimal premium quotes and insulates high-value portfolios.",
      capabilities: language === "ro" 
        ? ["Estimator cotații PAD", "Evaluare risc seismic regional", "Garanții contractuale"] 
        : ["Optional PAD insurance estimates", "Seismic risk mapping", "Bespoke liability clauses"],
      icon: Shield,
      href: "/insurance"
    },
    {
      id: "market",
      name: language === "ro" ? "Agent Piață" : "Market Agent",
      desc: language === "ro" ? "Urmărește indicii BNR, inflația CPI și trendurile globale macro." : "Tracks BNR policy rates, inflation shifts, and sovereign macro indicators.",
      capabilities: language === "ro" 
        ? ["Urmărire indici ROBOR/IRCC", "Monitorizare cotații active", "Sentimentul general al pieței"] 
        : ["ROBOR/IRCC tracking", "Commodity & crypto feed scans", "Sentiment analysis indexes"],
      icon: Activity,
      href: "/market-radar"
    },
    {
      id: "concierge",
      name: language === "ro" ? "Agent Concierge" : "Concierge Agent",
      desc: language === "ro" ? "Gestionează cererile VIP pentru avioane private, iahturi și stil de viață de lux." : "Handles premium private aviation, marine chartering, and lifestyle management.",
      capabilities: language === "ro" 
        ? ["Charter avioane private", "Închiriere super-iahturi", "Management relocare HNWI"] 
        : ["Private jet booking", "Luxury yacht charters", "Bespoke HNWI lifestyle services"],
      icon: Sparkles,
      href: "/concierge"
    }
  ];

  const ROADMAP = [
    {
      year: "2026",
      title: language === "ro" ? "Fundația OS" : "OS Foundation",
      desc: language === "ro" ? "Sincronizarea registrelor cadastrale românești, a datelor macro BNR și a calculatoarelor offline." : "Syncing Romanian cadastre registries, macro BNR indexes, and offline sandboxed calculators."
    },
    {
      year: "2027",
      title: language === "ro" ? "Expansiune AI" : "AI Agent Expansion",
      desc: language === "ro" ? "Lansarea scanerelor automate cu scoruri ponderate AiX Score™ și a agenților cognitivi autonomi." : "Launching automated scans powered by weighted AiX Score™ parameters and cognitive agents."
    },
    {
      year: "2028",
      title: language === "ro" ? "Rețea Globală" : "Global Network Integration",
      desc: language === "ro" ? "Integrarea piețelor premium internaționale (Dubai, Monaco, Londra) și a camerelor private securizate." : "Onboarding top international markets (Dubai, Monaco, London) and secure deal spaces."
    },
    {
      year: "2030",
      title: language === "ro" ? "Intelligence Autonom" : "Autonomous Real Estate OS",
      desc: language === "ro" ? "Sistem autonom capabil să execute tranzacții licențiate prin contracte inteligente auditate AI." : "Complete decentralized, agent-driven transactional execution via AI-audited smart contracts."
    }
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 space-y-28 text-center animate-in">
      
      {/* ─── HOLOGRAM HERO EXPERIENCE ────────────────────────────────────── */}
      <section className="relative grid lg:grid-cols-12 gap-8 items-center text-left py-6 overflow-hidden">
        <div className="lg:col-span-7 space-y-6">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500 border border-amber-500/20 rounded-full px-4 py-1.5 bg-amber-500/5">
            AiX OS™ &bull; FUTURE 2030 INTELLIGENCE
          </span>
          <h1 className="text-5xl sm:text-6xl font-light text-zinc-900 tracking-tight leading-none">
            The AI Operating System <br />
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600">for Capital & Property</span>
          </h1>
          <p className="text-base sm:text-lg font-light text-zinc-600 max-w-xl leading-relaxed">
            {language === "ro" 
              ? "Experimentează prima platformă de inteligență imobiliară concepută pentru a de-risca achizițiile, a simula portofolii și a automatiza investițiile de lux."
              : "Experience the premier intelligence operating system built to de-risk acquisitions, model wealth portfolios, and manage luxury assets."}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/property-scanner"
              className="rounded-xl bg-amber-500 text-black px-6 py-3 text-xs font-semibold hover:bg-amber-400 transition-all shadow-md shadow-amber-500/10 flex items-center gap-1.5"
            >
              <span>{language === "ro" ? "Deschide Scanner AI" : "Launch AI Scanner"}</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100 px-6 py-3 text-xs text-zinc-600 hover:text-zinc-900 transition-all flex items-center gap-1.5"
            >
              <span>{language === "ro" ? "Command Center" : "Command Center"}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Premium Light Holographic AI SVG Core */}
        <div className="lg:col-span-5 relative flex items-center justify-center min-h-[350px]">
          <div className="absolute inset-0 bg-amber-500/5 blur-3xl pointer-events-none rounded-full animate-pulse duration-[4000ms]" />
          
          <svg className="w-full max-w-[350px] aspect-square drop-shadow-2xl" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e8d5a3" />
                <stop offset="50%" stopColor="#c9a962" />
                <stop offset="100%" stopColor="#b3914a" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Pulsing connections */}
            <g className="stroke-zinc-200 stroke-[1] fill-none">
              <line x1="100" y1="100" x2="40" y2="60" />
              <line x1="100" y1="100" x2="160" y2="60" />
              <line x1="100" y1="100" x2="150" y2="140" />
              <line x1="100" y1="100" x2="50" y2="140" />
              <line x1="100" y1="100" x2="100" y2="30" />
              <line x1="40" y1="60" x2="100" y2="30" className="stroke-zinc-100" />
              <line x1="160" y1="60" x2="100" y2="30" className="stroke-zinc-100" />
              <line x1="40" y1="60" x2="50" y2="140" className="stroke-zinc-100" />
              <line x1="160" y1="60" x2="150" y2="140" className="stroke-zinc-100" />
              <line x1="50" y1="140" x2="150" y2="140" className="stroke-zinc-100" />
            </g>

            {/* Glowing lines overlay on hover */}
            {hoveredNode && (
              <g className="stroke-amber-400 stroke-[2] fill-none transition-all duration-500 ease-out" filter="url(#glow)">
                {hoveredNode === "brain" && <circle cx="100" cy="100" r="14" className="stroke-amber-500" />}
                {hoveredNode === "properties" && <line x1="100" y1="100" x2="40" y2="60" />}
                {hoveredNode === "investments" && <line x1="100" y1="100" x2="160" y2="60" />}
                {hoveredNode === "markets" && <line x1="100" y1="100" x2="100" y2="30" />}
                {hoveredNode === "agents" && <line x1="100" y1="100" x2="50" y2="140" />}
                {hoveredNode === "nodes" && <line x1="100" y1="100" x2="150" y2="140" />}
              </g>
            )}

            {/* Nodes */}
            <g className="cursor-pointer">
              {/* Central Core Brain */}
              <g onMouseEnter={() => setHoveredNode("brain")} onMouseLeave={() => setHoveredNode(null)}>
                <circle cx="100" cy="100" r="14" className="fill-white stroke-[url(#goldGradient)] stroke-[3] filter drop-shadow-md transition-all duration-300 hover:scale-105 origin-center" style={{ transformBox: 'fill-box' }} />
                <circle cx="100" cy="100" r="6" className="fill-[url(#goldGradient)] animate-ping opacity-70" />
                <circle cx="100" cy="100" r="6" className="fill-[url(#goldGradient)]" />
                <text x="100" y="130" textAnchor="middle" className="fill-zinc-800 text-[9px] font-mono tracking-[0.2em] font-bold">AiX CORE</text>
              </g>

              {/* Properties Node */}
              <g onMouseEnter={() => setHoveredNode("properties")} onMouseLeave={() => setHoveredNode(null)}>
                <circle cx="40" cy="60" r="8" className="fill-white stroke-zinc-200 stroke-[2] transition-all hover:stroke-amber-400 hover:scale-110 origin-center" style={{ transformBox: 'fill-box' }} />
                <circle cx="40" cy="60" r="3" className="fill-amber-500" />
                <text x="40" y="46" textAnchor="middle" className="fill-zinc-500 text-[8px] font-mono tracking-widest font-semibold">PROPERTIES</text>
              </g>

              {/* Investments Node */}
              <g onMouseEnter={() => setHoveredNode("investments")} onMouseLeave={() => setHoveredNode(null)}>
                <circle cx="160" cy="60" r="8" className="fill-white stroke-zinc-200 stroke-[2] transition-all hover:stroke-amber-400 hover:scale-110 origin-center" style={{ transformBox: 'fill-box' }} />
                <circle cx="160" cy="60" r="3" className="fill-amber-500" />
                <text x="160" y="46" textAnchor="middle" className="fill-zinc-500 text-[8px] font-mono tracking-widest font-semibold">INVESTMENTS</text>
              </g>

              {/* Markets Node */}
              <g onMouseEnter={() => setHoveredNode("markets")} onMouseLeave={() => setHoveredNode(null)}>
                <circle cx="100" cy="30" r="8" className="fill-white stroke-zinc-200 stroke-[2] transition-all hover:stroke-amber-400 hover:scale-110 origin-center" style={{ transformBox: 'fill-box' }} />
                <circle cx="100" cy="30" r="3" className="fill-amber-500" />
                <text x="100" y="16" textAnchor="middle" className="fill-zinc-500 text-[8px] font-mono tracking-widest font-semibold">MARKETS</text>
              </g>

              {/* Agents Node */}
              <g onMouseEnter={() => setHoveredNode("agents")} onMouseLeave={() => setHoveredNode(null)}>
                <circle cx="50" cy="140" r="8" className="fill-white stroke-zinc-200 stroke-[2] transition-all hover:stroke-amber-400 hover:scale-110 origin-center" style={{ transformBox: 'fill-box' }} />
                <circle cx="50" cy="140" r="3" className="fill-amber-500" />
                <text x="50" y="158" textAnchor="middle" className="fill-zinc-500 text-[8px] font-mono tracking-widest font-semibold">AI AGENTS</text>
              </g>

              {/* Intelligence Nodes */}
              <g onMouseEnter={() => setHoveredNode("nodes")} onMouseLeave={() => setHoveredNode(null)}>
                <circle cx="150" cy="140" r="8" className="fill-white stroke-zinc-200 stroke-[2] transition-all hover:stroke-amber-400 hover:scale-110 origin-center" style={{ transformBox: 'fill-box' }} />
                <circle cx="150" cy="140" r="3" className="fill-amber-500" />
                <text x="150" y="158" textAnchor="middle" className="fill-zinc-500 text-[8px] font-mono tracking-widest font-semibold">INTELLIGENCE</text>
              </g>
            </g>
          </svg>
        </div>
      </section>

      {/* ─── QUICK ACCESS GRID (5 CATEGORIES ONLY) ─────────────────────────── */}
      <section className="space-y-6 text-left">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-mono">
          {language === "ro" ? "Categorii de Lucru" : "Quick Access Workspace"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {QUICK_GRID.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className={`p-6 rounded-2xl border bg-white/20 backdrop-blur-md transition-all duration-300 flex flex-col justify-between min-h-[200px] hover:-translate-y-1 ${item.color}`}
              >
                <div className="space-y-3">
                  <div className="p-2.5 rounded-xl border border-zinc-200 bg-white w-fit shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-900">{item.title}</h3>
                  <p className="text-[11px] text-zinc-400 leading-normal line-clamp-3">{item.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-zinc-400 mt-4">
                  <span>{language === "ro" ? "Deschide" : "Open"}</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── AI AGENTS DIRECTORY ─────────────────────────────────────────── */}
      <section className="space-y-8 text-left">
        <div className="space-y-2">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-mono">
            {language === "ro" ? "Consilieri Autonomi Activabili" : "AI Agent Infrastructure"}
          </h2>
          <p className="text-2xl font-light text-zinc-900">
            {language === "ro" ? "Specialiști Inteligenți Integrați" : "Specialized AI Agents"}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {AI_AGENTS.map((agent) => {
            const AgentIcon = agent.icon;
            return (
              <div
                key={agent.id}
                className={`rounded-2xl p-5 ${designSystem.glass} ${designSystem.glassHover} flex flex-col justify-between min-h-[300px]`}
              >
                <div className="space-y-4">
                  <div className="rounded-xl bg-amber-500/10 p-2 text-amber-500 border border-amber-500/20 w-fit">
                    <AgentIcon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-900">{agent.name}</h3>
                    <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">{agent.desc}</p>
                  </div>
                  <div className="space-y-1.5 border-t border-zinc-200 pt-3">
                    <p className="text-[8px] uppercase tracking-wider text-zinc-400 font-mono font-bold">Capabilities</p>
                    <ul className="space-y-1">
                      {agent.capabilities.map((c, i) => (
                        <li key={i} className="text-[9.5px] text-zinc-450 flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-amber-500/50 shrink-0" />
                          <span className="truncate">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-200/60">
                  <Link
                    href={agent.href}
                    className="w-full py-2 rounded-lg bg-zinc-50/60 border border-zinc-200 hover:border-amber-500/20 text-zinc-600 hover:text-amber-400 text-[9.5px] font-semibold uppercase tracking-wider text-center block transition-all"
                  >
                    {language === "ro" ? "Lansează Consilier" : "Deploy Agent"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── MARKET SNAPSHOT (AIX SCORE + MARKET PULSE PREVIEW) ───────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left items-start">
        
        {/* AiX Score rating widget */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl border border-zinc-200 bg-white/30 backdrop-blur-xl relative overflow-hidden space-y-4 min-h-[220px]">
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/[0.02] blur-3xl pointer-events-none rounded-full" />
          
          <div className="flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-amber-500" />
            <span className="text-[10px] uppercase font-bold font-mono text-zinc-400">Score Tracker</span>
          </div>
          <div>
            <h3 className="text-base font-semibold text-zinc-900">AiX Score™ Simulation</h3>
            <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
              {language === "ro"
                ? "Scorul de siguranță al tranzacției. Evaluăm variabile cadastrale, fiscale și juridice înainte de a recomanda un activ imobiliar."
                : "Transaction safety index. We audit key cadastre, tax, and legal coordinates prior to matching any listing."}
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/property-scanner"
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              {language === "ro" ? "Scanează Proprietate" : "Run Property Scan"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Market Pulse preview widget */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl border border-zinc-200 bg-white/30 backdrop-blur-xl relative overflow-hidden space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4.5 w-4.5 text-rose-500" />
            <span className="text-[10px] uppercase font-bold font-mono text-zinc-400">Market Pulse</span>
          </div>
          
          <div>
            <h3 className="text-base font-semibold text-zinc-900">
              {language === "ro" ? "Analize macroeconomice active" : "Active Macroeconomic Analysis"}
            </h3>
            <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
              {language === "ro"
                ? "Urmărește evoluția pieței imobiliare, deciziile de dobândă ale BNR și indicii inflației CPI."
                : "Monitor real estate shifts, BNR monetary interest rulings, and CPI inflation logs."}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-t-zinc-900/60">
            {featuredNews.slice(0, 2).map((n) => (
              <Link
                key={n.slug}
                href={`/stiri/${n.slug}`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/40 hover:bg-zinc-100/40 transition-colors border border-zinc-200/40"
              >
                <div className="text-left">
                  <p className="text-[11px] font-semibold text-zinc-600 truncate max-w-sm">{n.title}</p>
                  <p className="text-[9.5px] text-zinc-600 mt-0.5">{new Date(n.published_at || n.date).toLocaleDateString(language === "ro" ? "ro-RO" : "en-US")}</p>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
              </Link>
            ))}
          </div>

          <div className="pt-1">
            <Link
              href="/stiri"
              className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold"
            >
              {language === "ro" ? "Vezi toate analizele" : "View all market pulse logs"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

      </section>

      {/* ─── ROADMAP TIMELINE ────────────────────────────────────────────── */}
      <section className="space-y-8 text-left">
        <div className="space-y-2">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-mono">
            {language === "ro" ? "Evoluția Ecosistemului" : "Ecosystem Evolution"}
          </h2>
          <p className="text-2xl font-light text-zinc-900">
            {language === "ro" ? "Drumul către Autonomie Imobiliară" : "AiX OS™ Future Roadmap"}
          </p>
        </div>

        <div className="relative border-l border-zinc-200 ml-3 pl-8 py-4 space-y-12">
          {ROADMAP.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline dot */}
              <div className="absolute -left-[41px] top-1.5 h-6 w-6 rounded-full bg-white border border-zinc-200 flex items-center justify-center group-hover:border-amber-500 transition-colors">
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500/40 group-hover:bg-amber-500 transition-colors" />
              </div>

              <div className="space-y-2 max-w-2xl">
                <span className="text-[10px] font-bold font-mono text-amber-500 uppercase tracking-widest">{item.year}</span>
                <h3 className="text-sm font-semibold text-zinc-900">{item.title}</h3>
                <p className="text-xs text-zinc-450 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

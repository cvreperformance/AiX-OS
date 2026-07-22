"use client";

import { useState, useEffect } from "react";
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

function AnimatedCounter({ end, prefix = "", suffix = "" }: { end: number, prefix?: string, suffix?: string }) {
  const [count, setCount] = useState(end);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    setCount(0); // Start animation from 0 on the client after mount
  }, []);
  
  useEffect(() => {
    if (!isMounted) return;
    let start = 0;
    const duration = 1500;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [end, isMounted]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

function LiveTerminalWall({ language }: { language: string }) {
  const [events, setEvents] = useState<string[]>([]);
  
  const allEvents = language === "ro" ? [
    "AI a detectat oportunități noi pe piață",
    "Oportunitate de investiție identificată",
    "Actualizare asistență și servicii proprietăți",
    "Semnal de piață detectat",
    "Analiza AiX Brain completată"
  ] : [
    "AI detected new market opportunities",
    "Investment opportunity identified",
    "Property services update",
    "Market signal detected",
    "AiX Brain analysis completed"
  ];

  useEffect(() => {
    // Initial events
    setEvents([
      `[${new Date().toLocaleTimeString()}] System Initialized`,
      `[${new Date().toLocaleTimeString()}] Connecting to AiX Brain...`,
      `[${new Date().toLocaleTimeString()}] Secure connection established.`
    ]);

    const interval = setInterval(() => {
      const randomEvent = allEvents[Math.floor(Math.random() * allEvents.length)];
      setEvents(prev => {
        const newEvents = [...prev, `[${new Date().toLocaleTimeString()}] ${randomEvent}`];
        if (newEvents.length > 8) return newEvents.slice(newEvents.length - 8);
        return newEvents;
      });
    }, 2500);
    
    return () => clearInterval(interval);
  }, [language]);

  return (
    <div className="rounded-2xl bg-zinc-950 p-6 border border-zinc-800 shadow-2xl overflow-hidden font-mono text-[11px] leading-relaxed flex flex-col h-full min-h-[280px]">
      <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <div className="text-zinc-500 text-[10px] uppercase tracking-widest ml-2">Terminal Live Feed</div>
      </div>
      <div className="flex-1 space-y-2 overflow-hidden flex flex-col justify-end">
        {events.map((ev, i) => (
          <div key={i} className="text-emerald-400/90 animate-in slide-in-from-bottom-2 fade-in duration-300">
            <span className="text-zinc-600 mr-2">{'>'}</span> {ev}
          </div>
        ))}
        <div className="text-emerald-400/90 flex items-center">
          <span className="text-zinc-600 mr-2">{'>'}</span>
          <span className="w-1.5 h-3 bg-emerald-400/80 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

interface HomeClientPageProps {
  featuredProperties: any[];
  featuredNews: any[];
  stats?: {
    propertiesScanned: number;
    marketSignals: number;
    correlatedOpportunities: number;
    propertiesMonitored: number;
    reportsGenerated: number;
  };
}

export default function HomeClientPage({ featuredProperties, featuredNews, stats }: HomeClientPageProps) {
  const { language } = useLanguage();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeSimulationStep, setActiveSimulationStep] = useState(0);

  const QUICK_GRID = [
    {
      title: language === "ro" ? "Cumpără & Vinde" : "Buy & Sell",
      desc: language === "ro" ? "Evită intermediarii și comisioanele de agenție la tranzacționare." : "Acquire properties directly from owners to bypass intermediary commissions.",
      icon: Building2,
      color: "text-blue-400 border-blue-500/10 hover:bg-blue-500/[0.02]",
      href: "/proprietati"
    },
    {
      title: language === "ro" ? "Investește & Protejează" : "Invest & Protect",
      desc: language === "ro" ? "Protejează-ți economiile de inflație și calculează cotațiile de asigurare online." : "Protect assets against inflation and compare property insurance rates online.",
      icon: Shield,
      color: "text-rose-400 border-rose-500/10 hover:bg-rose-500/[0.02]",
      href: "/stiri"
    },
    {
      title: language === "ro" ? "Învață & Cercetează" : "Learn & Research",
      desc: language === "ro" ? "Accesează ghiduri practice de tranzacționare pentru a evita greșelile costisitoare." : "Access transaction templates and investor checklists to avoid common buying errors.",
      icon: BookOpen,
      color: "text-amber-400 border-amber-500/10 hover:bg-amber-500/[0.02]",
      href: "/learning"
    },
    {
      title: language === "ro" ? "Calculatoare & Modele" : "Calculators & Templates",
      desc: language === "ro" ? "Calculează instant dobânzile, creditele și randamentele nete de chirie." : "Calculate net rental yields, interest rates, and cash flow benchmarks instantly.",
      icon: Wrench,
      color: "text-teal-400 border-teal-500/10 hover:bg-teal-500/[0.02]",
      href: "/convenience"
    },

  ];

  const AI_AGENTS = [
    {
      id: "investment",
      name: language === "ro" ? "Modelare Randamente" : "Yield Estimator",
      desc: language === "ro" ? "Calculează randamentul net real din chirie și compară prețurile pe metru pătrat." : "Model cash-flow yields and compare sub-zone price-per-square-meter data.",
      capabilities: language === "ro" 
        ? ["Simulare yield cash flow", "Comparație preț/mp pe sub-zone", "Arbitraj imobiliar"] 
        : ["Cash-flow yield modeling", "Sub-market price benchmarking", "Real estate arbitrage flags"],
      icon: TrendingUp,
      href: "/simulation"
    },
    {
      id: "insurance",
      name: language === "ro" ? "Asigurări Directe" : "Insurance Matcher",
      desc: language === "ro" ? "Obține cotații de la asigurători și redu costul asigurării." : "Compare coverage options from accredited insurers to lower your premium rates.",
      capabilities: language === "ro" 
        ? ["Estimator cotații PAD", "Evaluare risc seismic regional", "Garanții contractuale"] 
        : ["Optional PAD insurance estimates", "Seismic risk mapping", "Bespoke liability clauses"],
      icon: Shield,
      href: "/insurance"
    },
    {
      id: "market",
      name: language === "ro" ? "Radar Prețuri" : "Price Radar",
      desc: language === "ro" ? "Urmărește indicii ROBOR, IRCC și inflația în timp real pentru a proteja capitalul." : "Track policy rates and inflation indexes to time your acquisitions correctly.",
      capabilities: language === "ro" 
        ? ["Urmărire indici ROBOR/IRCC", "Monitorizare cotații active", "Sentimentul general al pieței"] 
        : ["ROBOR/IRCC tracking", "Commodity & crypto feed scans", "Sentiment analysis indexes"],
      icon: Activity,
      href: "/market-radar"
    },
    {
      id: "concierge",
      name: language === "ro" ? "Coordonator Relocare" : "Relocation & Transport Coordinator",
      desc: language === "ro" ? "Planifică relocarea și zborurile private direct din dashboard, fără intermediari." : "Coordinate international relocation and private transport without third-party brokers.",
      capabilities: language === "ro" 
        ? ["Coordonare zboruri private", "Închiriere ambarcațiuni", "Asistență relocare"] 
        : ["Private flight coordination", "Boat charters", "Relocation assistance"],
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
      desc: language === "ro" ? "Conectează piețele imobiliare din Dubai, Monaco și Londra într-un spațiu securizat." : "Connects real estate markets in Dubai, Monaco, and London in a secure space."
    },
    {
      year: "2030",
      title: language === "ro" ? "Intelligence Autonom" : "Autonomous Real Estate OS",
      desc: language === "ro" ? "Sistem autonom capabil să execute tranzacții licențiate prin contracte inteligente auditate AI." : "Complete decentralized, agent-driven transactional execution via AI-audited smart contracts."
    }
  ];

  return (
    <>
      {/* ─── AI NEURAL NETWORK BACKGROUND (DEEP CYAN/BLUE) ─────────────── */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden flex items-start justify-end">
        {/* Subtle ambient cyan glow radiating from brain position */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-900/15 blur-[120px] rounded-full translate-x-1/4 -translate-y-1/4" />
        <div className="absolute top-40 right-40 w-[600px] h-[600px] bg-blue-900/10 blur-[100px] rounded-full" />
        
        {/* Neural Connections SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.35]" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cyanGradient" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#1e3a8a" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g stroke="url(#cyanGradient)" strokeWidth="0.15" fill="none">
            {/* Connections expanding outward from brain (x:75, y:20) */}
            <path d="M 75 20 Q 50 40 20 50" />
            <path d="M 75 20 Q 60 60 30 80" />
            <path d="M 75 20 Q 85 50 90 90" />
            <path d="M 75 20 Q 40 30 10 20" />
            <path d="M 75 20 Q 50 70 10 90" />
            
            {/* Interconnecting web */}
            <path d="M 20 50 Q 25 65 30 80" strokeOpacity="0.4" />
            <path d="M 30 80 Q 60 85 90 90" strokeOpacity="0.3" />
            
            {/* Neural nodes */}
            <circle cx="20" cy="50" r="0.3" fill="#06b6d4" />
            <circle cx="30" cy="80" r="0.2" fill="#3b82f6" />
            <circle cx="90" cy="90" r="0.4" fill="#06b6d4" />
            <circle cx="10" cy="20" r="0.2" fill="#0ea5e9" />
            <circle cx="10" cy="90" r="0.3" fill="#3b82f6" />
          </g>
        </svg>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 space-y-28 text-center animate-in">
      
      {/* ─── HOLOGRAM HERO EXPERIENCE ────────────────────────────────────── */}
      <section className="relative grid lg:grid-cols-12 gap-8 items-center text-left py-6 overflow-hidden">
        <div className="lg:col-span-7 space-y-6">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500 border border-amber-500/20 rounded-full px-4 py-1.5 bg-amber-500/5">
            AiX OS™ &bull; DECISION SUPPORT SYSTEM
          </span>
          <h1 className="text-5xl sm:text-7xl font-light text-zinc-900 tracking-tight leading-none">
            Stop overpaying <br />
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600 text-3xl sm:text-5xl mt-2 inline-block">and eliminate time‑wasting due diligence</span>
          </h1>
          <p className="text-base sm:text-lg font-light text-zinc-600 max-w-xl leading-relaxed">
            {language === "ro" 
              ? "Folosește date reale și scanări automate pentru a achiziționa la preț corect și a încheia rapid tranzacțiile."
              : "Leverage real data and automated scans to buy at the right price and close deals quickly."}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/property-scanner"
              className="rounded-xl bg-amber-500 text-black px-6 py-3 text-xs font-semibold hover:bg-amber-400 transition-all shadow-md shadow-amber-500/10 flex items-center gap-1.5"
            >
              <span>{language === "ro" ? "Obține verificare instantă a titlului" : "Get instant title verification"}</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100 px-6 py-3 text-xs text-zinc-600 hover:text-zinc-900 transition-all flex items-center gap-1.5"
            >
              <span>{language === "ro" ? "Accesează Dashboard Investiții" : "Access Investment Dashboard"}</span>
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

      {/* ─── LIVE INTELLIGENCE PREVIEW ─────────────────────────────────────────── */}
      <section className="space-y-8 text-left py-8 relative">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 font-mono">
              {language === "ro" ? "AiX OS™ Live Intelligence Preview" : "AiX OS™ Live Intelligence"}
            </h2>
          </div>
          <p className="text-2xl font-light text-zinc-900">
            {language === "ro" ? "Nucleul Analitic în Timp Real" : "Real-Time Analytical Core"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative z-10">
          {[
            { label: language === "ro" ? "Proprietăți Scanate" : "Properties Scanned", val: stats?.propertiesScanned },
            { label: language === "ro" ? "Semnale Piață" : "Market Signals", val: stats?.marketSignals },
            { label: language === "ro" ? "Oportunități Corelate" : "Correlated Opportunities", val: stats?.correlatedOpportunities },
            { label: language === "ro" ? "Active Monitorizate" : "Properties Monitored", val: stats?.propertiesMonitored },
            { label: language === "ro" ? "Rapoarte Generate" : "Reports Generated", val: stats?.reportsGenerated },
          ].map((stat, i) => (
            <div key={i} className="p-5 rounded-2xl border border-zinc-200 bg-white/60 backdrop-blur-md shadow-sm">
              <div className="text-3xl font-light text-zinc-900 tracking-tight">
                {stat.val != null ? (
                  <AnimatedCounter end={stat.val} />
                ) : (
                  <div className="h-9 w-24 bg-zinc-200/50 animate-pulse rounded-md" />
                )}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono mt-2">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Terminal Wall & AI Agents Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
          {/* Terminal Wall */}
          <LiveTerminalWall language={language} />
          
          {/* AI Agents Preview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AI_AGENTS.map((agent, i) => {
              const AgentIcon = agent.icon;
              return (
                <div key={i} className="p-4 rounded-2xl border border-zinc-200 bg-white/60 backdrop-blur-md flex flex-col justify-between space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-xl bg-zinc-100 text-zinc-900">
                      <AgentIcon className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono text-emerald-600 font-bold uppercase">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-900">{agent.name}</h3>
                    <p className="text-[10px] text-zinc-500 mt-1 line-clamp-2">{agent.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-zinc-200/60">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-400 block text-center">
                      {language === "ro" ? "Disponibil în AiX OS™" : "Available inside AiX OS™"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dashboard CTA */}
        <div className="p-8 sm:p-12 rounded-3xl border border-white/10 bg-gradient-to-b from-[#151515] to-[#0B0B0B] backdrop-blur-2xl text-center space-y-6 relative z-10 mt-8 shadow-2xl shadow-black/50 overflow-hidden">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-[#c96b1d]/[0.02] blur-3xl pointer-events-none rounded-full" />
          
          <div className="mx-auto w-fit p-3.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md shadow-inner relative">
            <Lock className="h-6 w-6 text-[#c96b1d]" />
          </div>
          <div className="space-y-2 max-w-lg mx-auto relative">
            <h3 className="text-xl sm:text-2xl font-medium text-white tracking-wide">
              {language === "ro" ? "Experimentează Dashboard-ul de Inteligență AiX OS™" : "Experience the complete AiX OS™ Intelligence Dashboard"}
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {language === "ro" 
                ? "Funcționalitatea completă este disponibilă exclusiv pentru utilizatorii aprobați."
                : "The complete Dashboard remains available only to approved users."}
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 pt-2 relative">
            <Link href="/login" className="px-6 py-3 rounded-xl bg-[#c96b1d] text-white text-xs font-semibold hover:bg-[#b05d18] transition-all shadow-lg shadow-black/20">
              {language === "ro" ? "Autentificare" : "Login"}
            </Link>
            <Link href="/pricing" className="px-6 py-3 rounded-xl bg-[#111111] border border-white/10 text-zinc-300 text-xs font-semibold hover:bg-[#1A1A1A] hover:text-white transition-all shadow-md">
              {language === "ro" ? "Solicită Acces" : "Request Access"}
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
            {language === "ro" ? "Drumul către Autonomie Imobiliară" : "AiX OS™ Roadmap"}
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
    </>
  );
}

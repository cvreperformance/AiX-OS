"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Brain,
  Building2,
  Sparkles,
  Shield,
  Activity,
  Coins,
  ChevronRight,
  Star,
  Users,
  Sliders,
  Lock,
  Plane,
  Globe,
  Scale,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { designSystem } from "@/styles/designSystem";
import HomeClient, { HomeMarketTicker, HomeCTAButtons } from "./HomeClient";
import { formatPrice } from "@/lib/format";

interface HomeClientPageProps {
  featuredProperties: any[];
  featuredNews: any[];
}

export default function HomeClientPage({ featuredProperties, featuredNews }: HomeClientPageProps) {
  const { language, t } = useLanguage();

  const SERVICES_LIST = [
    {
      title: language === "ro" ? "Reprezentare Cumpărător" : "Buyer Representation",
      desc: language === "ro" 
        ? "Achiziționează proprietăți off-market evitând comisioanele ascunse și greșelile de due diligence."
        : "Acquire off-market properties while avoiding hidden fees and due diligence mistakes.",
      href: "/buyer",
      icon: Users,
      color: "text-amber-400"
    },
    {
      title: language === "ro" ? "Reprezentare Vânzător" : "Seller Representation",
      desc: language === "ro"
        ? "Vinde proprietatea la prețul maxim în cel mai scurt timp prin strategii de marketing bazate pe date."
        : "Sell your property at peak price quickly using data-driven marketing strategies.",
      href: "/seller",
      icon: Building2,
      color: "text-blue-400"
    },
    {
      title: language === "ro" ? "Legislație Imobiliară" : "RO Law in Real Estate",
      desc: language === "ro"
        ? "Protejează-ți investițiile. Înțelege clauzele precontractuale, taxele notariale și riscurile de publicitate imobiliară."
        : "Protect your investments. Understand pre-contract clauses, notary taxes, and title registry risks.",
      href: "/law",
      icon: Scale,
      color: "text-amber-400"
    },
    {
      title: language === "ro" ? "Portofolii Imobiliare" : "Real Estate Portfolios",
      desc: language === "ro"
        ? "Maximizează randamentul portofoliului tău. Identifică oportunități sub-evaluate prin scanare continuă."
        : "Maximize your portfolio yields. Identify undervalued opportunities via continuous scanning.",
      href: "/proprietati",
      icon: Sliders,
      color: "text-emerald-400"
    },
    {
      title: language === "ro" ? "Birou de Asigurări" : "Insurance Desk",
      desc: language === "ro"
        ? "Redu expunerea la riscuri neprevăzute. Securizează-ți activele imobiliare de mare valoare cu polițe optimizate."
        : "Reduce exposure to unexpected risks. Secure your high-value property assets with optimized policies.",
      href: "/insurance",
      icon: Shield,
      color: "text-rose-400"
    },
    {
      title: language === "ro" ? "Consultanță Investiții" : "Investments Advisory",
      desc: language === "ro"
        ? "Investește inteligent pe baza indicatorilor macroeconomici și a fluxurilor globale de capital."
        : "Invest smartly based on macroeconomic indicators and global capital flows.",
      href: "/investments",
      icon: Coins,
      color: "text-violet-400"
    },
    {
      title: language === "ro" ? "Rețea Privată Globală" : "Private Global Network",
      desc: language === "ro"
        ? "Conectează-te cu parteneri de afaceri verificați pentru tranzacții sigure și oportunități private."
        : "Connect with verified business partners for secure transactions and private deals.",
      href: "/network",
      icon: Lock,
      color: "text-sky-400"
    },
    {
      title: language === "ro" ? "Concierge Imobiliar" : "Luxury Concierge",
      desc: language === "ro"
        ? "Soluționează relocarea, administrarea activelor și asistența specializată dintr-o singură interfață."
        : "Handle relocation, asset management, and specialized assistance from a single interface.",
      href: "/concierge",
      icon: Sparkles,
      color: "text-amber-400"
    },
    {
      title: language === "ro" ? "Consilier AI" : "AI Advisory",
      desc: language === "ro"
        ? "Întreabă o singură dată. Analizează sute de pagini de legislație și rapoarte financiare în doar câteva secunde."
        : "Ask once. Analyze hundreds of pages of legislation and financial reports in seconds.",
      href: "/money-advisor",
      icon: Brain,
      color: "text-violet-400"
    },
    {
      title: language === "ro" ? "Evaluare AI" : "AI Valuation",
      desc: language === "ro"
        ? "Află valoarea reală a oricărui metru pătrat instantaneu, eliminând speculațiile și incertitudinea."
        : "Get the true value of any square meter instantly, eliminating speculation and uncertainty.",
      href: "/valuation",
      icon: Activity,
      color: "text-emerald-400"
    },
    {
      title: language === "ro" ? "AntiȚeapă AI" : "AntiȚeapă AI",
      desc: language === "ro"
        ? "Scanează automat riscurile cadastrale și vicii ascunse ale oricărei proprietăți înainte de a semna."
        : "Automatically scan cadastral risks and hidden defects of any property before signing.",
      href: "/anti-teapa",
      icon: Shield,
      color: "text-red-400"
    },
    {
      title: language === "ro" ? "Aviație Privată & Charter" : "Private Jets & Charter",
      desc: language === "ro"
        ? "Călătorește rapid și fără bătăi de cap cu zboruri private planificate în câteva minute."
        : "Travel fast and hassle-free with private flights planned in minutes.",
      href: "/private-jets",
      icon: Plane,
      color: "text-sky-400"
    },
    {
      title: language === "ro" ? "Supercars & Mobilitate" : "Supercars & Mobility",
      desc: language === "ro"
        ? "Asigură-ți mobilitatea sigură și rapidă pe Riviera Franceză, Monaco sau Dubai."
        : "Secure safe and fast mobility on the French Riviera, Monaco, or Dubai.",
      href: "/cars",
      icon: Globe,
      color: "text-orange-400"
    },
  ];

  const AI_TOOLS = [
    {
      title: "Money Advisor",
      desc: language === "ro" 
        ? "Consultant financiar personal pentru optimizare portofolii rezidențiale."
        : "Personal financial advisor for optimizing residential portfolios.",
      href: "/money-advisor",
      icon: Brain,
      label: "AI Advisor"
    },
    {
      title: "AntiȚeapă AI",
      desc: language === "ro"
        ? "Scanare automată a riscurilor cadastrale și viciilor ascunse."
        : "Automatic scanning of cadastral risks and hidden defects.",
      href: "/anti-teapa",
      icon: Shield,
      label: "Security Tool"
    },
    {
      title: "AI Valuation",
      desc: language === "ro"
        ? "Evaluare instantă a valorii corecte pe metru pătrat bazată pe tranzacții reale."
        : "Instant valuation of correct price per square meter based on real transactions.",
      href: "/valuation",
      icon: Coins,
      label: "Valuator"
    },
  ];

  const LUXURY_SERVICES = [
    {
      title: language === "ro" ? "Avioane Private & Charter" : "Private Jets & Charter",
      desc: language === "ro"
        ? "Zboruri private la comandă și acces la terminale VIP FBO în întreaga lume."
        : "Charter private flights on demand and access VIP FBO terminals worldwide.",
      href: "/private-jets",
      icon: Plane
    },
    {
      title: language === "ro" ? "Supercars & Mobilitate" : "Supercars & Mobility",
      desc: language === "ro"
        ? "Vehicule premium pe Riviera Franceză, Monaco și Dubai."
        : "Premium vehicles on the French Riviera, Monaco, and Dubai.",
      href: "/cars",
      icon: Sparkles
    },
    {
      title: language === "ro" ? "Concierge Imobiliar" : "Luxury Concierge",
      desc: language === "ro"
        ? "Servicii de relocare, achiziții discrete off-market și asistență juridică HNWI."
        : "Relocation services, discrete off-market acquisitions, and HNWI legal assistance.",
      href: "/concierge",
      icon: Globe
    },
  ];

  const TESTIMONIALS = [
    {
      text: language === "ro"
        ? "AiX OS a redus timpul nostru de due diligence de la câteva săptămâni la câteva minute. AntiȚeapă AI a descoperit un viciu cadastral major înainte de tranzacție."
        : "AiX OS reduced our due diligence time from weeks to minutes. AntiȚeapă AI uncovered a major cadastral defect before closing the transaction.",
      author: "Alexander V. · UHNW Investor",
      city: "Monaco"
    },
    {
      text: language === "ro"
        ? "Indicatorul AiX Score este singurul pe care îl consultăm înainte de a plasa capital în proprietăți în București. Extrem de precis pe ROI."
        : "The AiX Score indicator is the only one we consult before placing capital in properties in Bucharest. Extremely precise on ROI.",
      author: "Elena M. · Real Estate Fund Manager",
      city: "London / București"
    },
  ];

  const SOLUTIONS = [
    {
      title: language === "ro" ? "Economisește Timp" : "Save Time",
      outcome: language === "ro" ? "Analizează proprietăți și rapoarte de piață în secunde." : "Analyze properties and market reports in seconds.",
      action: language === "ro" ? "Folosește Evaluatorul AI" : "Use AI Valuator",
      href: "/valuation"
    },
    {
      title: language === "ro" ? "Economisește Bani" : "Save Money",
      outcome: language === "ro" ? "Identifică proprietăți sub prețul pieței și obține cel mai bun randament." : "Identify properties under market price and get the best yield.",
      action: language === "ro" ? "Explorează Oportunitățile" : "Explore Opportunities",
      href: "/oportunitati"
    },
    {
      title: language === "ro" ? "Redu Riscul" : "Reduce Risk",
      outcome: language === "ro" ? "Scanează automat viciile cadastrale, ipotecile și litigiile înainte de achiziție." : "Automatically scan cadastral defects, mortgages, and litigation before purchase.",
      action: language === "ro" ? "Scanează cu AntiȚeapă AI" : "Scan with AntiȚeapă AI",
      href: "/anti-teapa"
    },
    {
      title: language === "ro" ? "Cumpără Inteligent" : "Buy Smart",
      outcome: language === "ro" ? "Fii reprezentat exclusiv în negocieri și obține acces la active off-market." : "Be exclusively represented in negotiations and get access to off-market assets.",
      action: language === "ro" ? "Vezi Reprezentare Cumpărător" : "View Buyer Rep",
      href: "/buyer"
    },
    {
      title: language === "ro" ? "Vinde Rapid" : "Sell Fast",
      outcome: language === "ro" ? "Optimizează prețul de listare și expunerea pe baza tranzacțiilor reale." : "Optimize listing price and exposure based on real transactions.",
      action: language === "ro" ? "Vezi Reprezentare Vânzător" : "View Seller Rep",
      href: "/seller"
    },
    {
      title: language === "ro" ? "Investește Mai Biine" : "Invest Better",
      outcome: language === "ro" ? "Gestionează-ți portofoliul global pe baza indicatorilor macroeconomici." : "Manage your global portfolio based on macroeconomic indicators.",
      action: language === "ro" ? "Deschide Advisor Financiari" : "Open Financial Advisor",
      href: "/money-advisor"
    },
    {
      title: language === "ro" ? "Protejează activele" : "Protect Assets",
      outcome: language === "ro" ? "Securizează-ți portofoliul prin polițe HNWI și asistență juridică." : "Secure your portfolio through HNWI policies and legal assistance.",
      action: language === "ro" ? "Vezi Insurance Desk" : "View Insurance Desk",
      href: "/insurance"
    },
    {
      title: language === "ro" ? "Înțelege Înainte de Semnare" : "Understand Before Signing",
      outcome: language === "ro" ? "Auditează clauzele legale și taxele notariale prin expertiză juridică prealabilă." : "Audit legal clauses and notary fees through prior legal expertise.",
      action: language === "ro" ? "Vezi Ghidul Legal RO" : "View RO Legal Guide",
      href: "/law"
    },
  ];

  return (
    <div className="space-y-16 md:space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-12 sm:pt-20 sm:pb-16 overflow-hidden flex flex-col items-center justify-center min-h-[70svh] sm:min-h-[85vh] text-center px-4 sm:px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[540px] h-[340px] sm:h-[540px] bg-amber-500/[0.04] blur-3xl rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 relative z-10 flex flex-col items-center">
          <span className="inline-block text-[10px] sm:text-xs uppercase tracking-[0.2em] text-amber-500/80 border border-amber-500/20 rounded-full px-4 py-1.5 backdrop-blur-md bg-zinc-950/30">
            {t("hero.badge")}
          </span>
          
          <h1 className="text-5xl sm:text-8xl font-light tracking-widest text-white leading-tight uppercase">
            AiX <span className="text-amber-500">OS</span>
          </h1>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-light text-zinc-300">
              {t("hero.subtitle")}
            </h2>
            <h3 className="text-xl sm:text-3xl font-semibold bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
              {t("hero.tagline")}
            </h3>
          </div>

          <div className="pt-8 space-y-4 flex flex-col items-center">
            <Link
              href="/join"
              className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 px-8 py-4 text-sm font-bold uppercase tracking-widest text-amber-400 transition-all duration-300 shadow-lg shadow-amber-500/10 active:scale-95"
            >
              {t("hero.join")}
            </Link>
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-mono">
              {t("hero.coming")}
            </p>
          </div>

          <div className="w-full max-w-2xl pt-12">
            <HomeClient />
          </div>
        </div>
      </section>

      {/* 1.5 Solutions Section (Outcome-Driven Solutions) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6 sm:space-y-8">
        <div className="border-b border-zinc-900 pb-5">
          <span className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-semibold">
            {language === "ro" ? "Soluții Orientate pe Rezultate" : "Outcome-Driven Solutions"}
          </span>
          <h2 className="text-2xl md:text-3xl font-light text-white mt-1">
            {language === "ro" ? "Cum te ajută AiX OS să reușești" : "How AiX OS Helps You Succeed"}
          </h2>
          <p className="text-xs text-zinc-500 mt-2">
            {language === "ro" 
              ? "Instrumente practice concepute pentru a elimina riscurile, greșelile de preț și pierderile de timp."
              : "Practical tools built to eliminate transaction risks, pricing errors, and time wasting."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SOLUTIONS.map((sol, index) => (
            <Link
              key={index}
              href={sol.href}
              className={`group p-5 rounded-2xl flex flex-col justify-between min-h-[160px] transition-all duration-300 ${designSystem.glass} ${designSystem.glassHover}`}
            >
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-semibold">
                  {sol.title}
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {sol.outcome}
                </p>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-zinc-400 group-hover:text-white uppercase tracking-wider pt-4 border-t border-zinc-900/60 mt-3">
                {sol.action}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. Premium Services Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6 sm:space-y-8">
        <div className="border-b border-zinc-900 pb-5">
          <span className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-semibold">
            {language === "ro" ? "Gama Completă de Servicii" : "Complete Service Catalog"}
          </span>
          <h2 className="text-2xl md:text-3xl font-light text-white mt-1">
            {language === "ro" ? "Servicii Imobiliare, AI & Lifestyle" : "Real Estate, AI & Lifestyle Services"}
          </h2>
          <p className="text-xs text-zinc-500 mt-2">
            {language === "ro"
              ? "Soluții complete pentru decizii de șase cifre: economisește timp și evită greșeli."
              : "Complete blueprints for six-figure decisions: save time and avoid expensive mistakes."}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {SERVICES_LIST.map((srv) => {
            const Icon = srv.icon;
            return (
              <Link
                key={srv.title}
                href={srv.href}
                className={`group p-4 md:p-5 rounded-2xl flex flex-col justify-between min-h-[130px] md:min-h-[150px] transition-all duration-300 ${designSystem.glass} ${designSystem.glassHover} active:scale-[0.98]`}
              >
                <div className="space-y-2.5">
                  <div className={`rounded-xl bg-zinc-900/60 p-2 text-amber-400 w-fit group-hover:bg-amber-500/15 transition-colors`}>
                    <Icon className={`h-4 w-4 md:h-4.5 md:w-4.5 ${srv.color}`} />
                  </div>
                  <div>
                    <h3 className="text-[11px] md:text-xs font-semibold text-white group-hover:text-amber-400 transition-colors leading-tight">
                      {srv.title}
                    </h3>
                    <p className="text-[9px] md:text-[10px] text-zinc-500 leading-normal mt-1 line-clamp-2 hidden sm:block">
                      {srv.desc}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[9px] font-semibold text-zinc-500 group-hover:text-white uppercase tracking-wider mt-3">
                  {language === "ro" ? "Detalii" : "Details"}
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Properties — loaded from Supabase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
        <div className="flex justify-between items-end border-b border-zinc-900 pb-5">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-semibold">
              {language === "ro" ? "Portofoliu Selectat" : "Curated Portfolio"}
            </span>
            <h2 className="text-2xl font-light text-white mt-1">
              {language === "ro" ? "Proprietăți Recomandate" : "Featured Properties"}
            </h2>
          </div>
          <Link
            href="/proprietati"
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-amber-400 font-semibold transition-colors"
          >
            {language === "ro" ? "Vezi Toate" : "View All"}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {featuredProperties.length > 0 ? (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 scrollbar-none scroll-smooth">
            {featuredProperties.map((prop) => (
              <div
                key={prop.id}
                className={`group relative rounded-3xl overflow-hidden shrink-0 w-[85vw] md:w-auto snap-center ${designSystem.glass} ${designSystem.glassHover}`}
              >
                {prop.aix_score && (
                  <div className="absolute top-4 left-4 z-10 rounded-xl bg-black/60 border border-zinc-850 px-2.5 py-1 text-[10px] font-mono font-bold text-amber-400 flex items-center gap-1.5 backdrop-blur-md">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    Score: {prop.aix_score}
                  </div>
                )}

                <div className="relative h-60 w-full overflow-hidden bg-zinc-900">
                  {prop.resolved_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={prop.resolved_image_url}
                      alt={prop.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Building2 className="h-10 w-10 text-zinc-700" />
                    </div>
                  )}
                </div>

                <div className={designSystem.cardSpacing}>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                      {prop.title}
                    </h3>
                    <p className="text-[10.5px] text-zinc-500 mt-0.5">{prop.location}{prop.city ? `, ${prop.city}` : ""}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-900/60">
                    <span className="text-xs font-bold text-amber-400 font-mono">{formatPrice(prop.price, prop.currency)}</span>
                    <Link
                      href={`/proprietati/${prop.slug}`}
                      className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 group-hover:text-white flex items-center gap-0.5"
                    >
                      {language === "ro" ? "Detalii" : "Details"}
                      <ArrowUpRight className="h-3.5 w-3.5 text-amber-500/50 group-hover:text-amber-500 transition-colors" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`p-8 rounded-3xl ${designSystem.glass} text-center space-y-3`}>
            <Building2 className="h-8 w-8 text-zinc-700 mx-auto" />
            <p className="text-sm text-zinc-400">
              {language === "ro" ? "Proprietăți în curs de actualizare." : "Properties portfolio is updating."}
            </p>
            <Link href="/proprietati" className="text-xs text-amber-400 hover:underline">
              {language === "ro" ? "Explorează catalogul complet →" : "Explore full portfolio →"}
            </Link>
          </div>
        )}
      </section>

      {/* 4. Market Pulse Ticker */}
      <HomeMarketTicker />

      {/* 5. AI Tools */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
        <div className="border-b border-zinc-900 pb-5">
          <span className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-semibold">Digital Suite</span>
          <h2 className="text-2xl font-light text-white mt-1">
            {language === "ro" ? "Instrumente AI de Analiză" : "AI Intelligence Suite"}
          </h2>
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
                  <h3 className="text-sm font-semibold text-white">{tool.title}</h3>
                  <p className="text-xs text-zinc-450 leading-relaxed mt-1">{tool.desc}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-900/60 mt-6">
                <Link
                  href={tool.href}
                  className="text-xs text-zinc-400 hover:text-white font-semibold flex items-center justify-between"
                >
                  {language === "ro" ? "Accesează Tool" : "Open Tool"}
                  <ArrowUpRight className="h-4 w-4 text-zinc-650" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Luxury Services Hub */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
        <div className="border-b border-zinc-900 pb-5">
          <span className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-semibold">Exclusive Mobility</span>
          <h2 className="text-2xl font-light text-white mt-1">
            {language === "ro" ? "Servicii Luxury Lifestyle" : "Luxury Lifestyle & Services"}
          </h2>
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
                  {language === "ro" ? "Rezervă Serviciu" : "Book Service"}
                  <ArrowUpRight className="h-4 w-4 text-zinc-650" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Latest News — from Supabase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
        <div className="flex justify-between items-end border-b border-zinc-900 pb-5">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-semibold">Macro Insights</span>
            <h2 className="text-2xl font-light text-white mt-1">
              {language === "ro" ? "Știri & Analize de Piață" : "Market Intelligence & News"}
            </h2>
          </div>
          <Link
            href="/stiri"
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-amber-400 font-semibold transition-colors"
          >
            {language === "ro" ? "Vezi Toate" : "View All"}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredNews.map((n) => (
            <Link
              key={n.id}
              href={`/stiri/${n.slug}`}
              className={`p-6 rounded-3xl ${designSystem.glass} ${designSystem.glassHover} space-y-4 block`}
            >
              <div>
                <span className="text-[9px] uppercase tracking-widest text-amber-500/80 font-mono">
                  {n.category}{n.published_at ? ` · ${new Date(n.published_at).toLocaleDateString(language === "ro" ? "ro-RO" : "en-US", { day: "numeric", month: "short" })}` : ""}
                </span>
                <h3 className="text-sm font-semibold text-white mt-1.5 leading-snug group-hover:text-amber-400">{n.title}</h3>
              </div>
              <p className="text-xs text-zinc-450 leading-relaxed line-clamp-2">{n.summary}</p>
              <div className="pt-3 border-t border-zinc-900/60">
                <span className="text-[10.5px] uppercase tracking-widest font-mono text-zinc-500 hover:text-white flex items-center gap-1">
                  {language === "ro" ? "Citește Articolul" : "Read Full Article"}
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 8. Testimonials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
        <div className="border-b border-zinc-900 pb-5">
          <span className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-semibold">
            {language === "ro" ? "Credibilitate" : "Trust & Credibility"}
          </span>
          <h2 className="text-2xl font-light text-white mt-1">
            {language === "ro" ? "Recomandări Clienți" : "Client Endorsements"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className={`p-6 sm:p-8 rounded-3xl ${designSystem.glass} flex flex-col justify-between relative min-h-[180px]`}
            >
              <p className="text-xs text-zinc-350 leading-relaxed italic">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="pt-6 border-t border-zinc-900/60 mt-6 flex justify-between items-center text-[10px] font-mono">
                <span className="font-semibold text-zinc-450">{t.author}</span>
                <span className="text-zinc-600">{t.city}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className={`p-8 sm:p-12 rounded-3xl border border-amber-500/20 bg-[#080808]/70 backdrop-blur-xl text-center space-y-6 relative overflow-hidden shadow-2xl`}>
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            {language === "ro" ? "Descoperă Active Sub Evaluare" : "Discover Undervalued Assets"}
          </h2>
          <p className="text-xs text-zinc-450 max-w-lg mx-auto leading-relaxed">
            {language === "ro"
              ? "Consilierii noștri HNWI utilizează modulele avansate de pe AiX OS pentru a asigura randamente sigure pe portofolii imobiliare de lux."
              : "Our HNWI advisors leverage AiX OS advanced models to secure alpha yields across premium luxury real estate portfolios."}
          </p>
          <HomeCTAButtons />
        </div>
      </section>
    </div>
  );
}

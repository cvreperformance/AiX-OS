"use client";

import { useState, useEffect } from "react";
import { Globe, Users, Lock, Handshake, Star, Building2, ArrowRight, MessageCircle, ChevronRight, Activity, Award, TrendingUp, TrendingDown, Trophy, Landmark, Calculator, Calendar, Briefcase, Coins, DollarSign, TrendingUp as TrendUpIcon, EyeOff, Key, ShieldCheck, Send, User, Phone, Mail, Home } from "lucide-react";
import { designSystem } from "@/styles/designSystem";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/format";
import { PageHeader } from "@/components/ui";

const BENEFITS = [
  { icon: Lock, title: "Acces la oferte nelistate", desc: "Accesați oportunități care nu sunt listate public, disponibile prin rețeaua noastră privată." },
  { icon: Users, title: "Networking cu Investitori", desc: "Conectează-te direct cu investitori, developeri și family offices cu capital alocat." },
  { icon: Globe, title: "Oportunități Internaționale", desc: "Deal-uri în România, Dubai, Monaco, Abu Dhabi și alte destinații căutate europene." },
  { icon: Handshake, title: "Co-investiții & JV", desc: "Structurăm parteneriate de investiție pentru proiecte mari. Putere colectivă, risc distribuit." },
  { icon: Star, title: "Evenimente Private", desc: "Vizite organizate la proprietăți, property tours private și sesiuni de networking pentru membri." },
  { icon: Building2, title: "Acces Prioritar la Noi Proiecte", desc: "Developerii parteneri prezintă proiectele membrilor rețelei înainte de lansarea publică." },
];

const TIERS = [
  {
    name: "Silver",
    price: "€299 / an",
    description: "Acces la comunitatea de investitori și newsletter cu oportunități nelistate.",
    features: [
      "Newsletter lunar cu oportunități nelistate public",
      "Acces la 2 evenimente private/an",
      "Profil în directorul de membri",
      "Raport lunar despre prețuri și tendințe",
    ],
    highlight: false,
  },
  {
    name: "Gold",
    price: "€799 / an",
    description: "Acces complet la oportunități off-market și co-investiții.",
    features: [
      "Tot din Silver",
      "Acces off-market database complet",
      "Participare co-investiții platformă",
      "4 întâlniri organizate de networking / an",
      "Consultanță lunară cu advisor dedicat",
    ],
    highlight: true,
  },
  {
    name: "Platinum",
    price: "NDA & Vetting",
    description: "Cerc restrâns pentru family offices și UHNWI cu portofolii €5M+.",
    features: [
      "Tot din Gold",
      "Acces la deal flow confidențial",
      "Matching personalizat cu investitori calificați",
      "Acces la rețeaua Monaco & Dubai",
      "Manager dedicat 24/7",
    ],
    highlight: false,
  },
];

// Anonymous network member thumbnails
const MEMBER_STATS = [
  { value: "200+", label: "Membri activi" },
  { value: "€50M+", label: "Capital alocat" },
  { value: "40+", label: "Deal-uri facilitate" },
  { value: "12", label: "Orașe active" },
];

const LOCATIONS = [
  { city: "București", flag: "🇷🇴", members: "85 membri", focus: "Residential + Commercial" },
  { city: "Cluj-Napoca", flag: "🇷🇴", members: "32 membri", focus: "Student Housing + Tech HQ" },
  { city: "Dubai", flag: "🇦🇪", members: "42 membri", focus: "Off-Plan + Marina Properties" },
  { city: "Monaco", flag: "🇲🇨", members: "18 membri", focus: "Bespoke Properties Portfolio" },
  { city: "Londra", flag: "🇬🇧", members: "12 membri", focus: "Prime Central London" },
  { city: "Lisabona", flag: "🇵🇹", members: "9 membri", focus: "Golden Visa + NHR" },
];

interface MarketItem {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  desc: string;
}

function NetworkTab() {
  const [selectedTier, setSelectedTier] = useState(1);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-20 py-12 animate-in">
      
      {/* Hero */}
      <section className="space-y-6">
        <span className="inline-block text-xs uppercase tracking-[0.2em] text-amber-500/80 border border-amber-500/20 rounded-full px-3 py-1">
          AiX OS™ · Investment Network
        </span>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-light text-zinc-900 leading-tight">
              Rețeaua Privată a<br />
              <span className="gradient-gold">Investitorilor de Top</span>
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Connect with buyers, investors and professionals faster. Access opportunities that are not publicly listed and pool resources to acquire larger assets.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {MEMBER_STATS.map(({ value, label }) => (
                <div key={label} className={`text-center rounded-2xl ${designSystem.glass} p-4`}>
                  <p className="text-xl font-light text-amber-400">{value}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-contact-popup"))}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 text-black px-6 py-3 text-xs font-semibold uppercase hover:bg-amber-400 transition-all shadow-md shadow-amber-500/10"
            >
              <MessageCircle className="h-4 w-4" />
              Solicită Acces la Rețea
            </button>
          </div>

          {/* Live location map grid */}
          <div className={`rounded-3xl ${designSystem.glass} p-6 space-y-4`}>
            <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-amber-500/80" />
              Distribuție Geografică Membri
            </h3>
            <div className="space-y-2.5">
              {LOCATIONS.map((loc) => (
                <div key={loc.city} className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white/40 px-4 py-3 hover:border-zinc-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-base">{loc.flag}</span>
                    <div>
                      <p className="text-xs font-semibold text-zinc-900">{loc.city}</p>
                      <p className="text-[10px] text-zinc-400">{loc.focus}</p>
                    </div>
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-amber-400 font-mono font-semibold bg-amber-500/5 border border-amber-500/15 rounded-full px-2 py-0.5">
                    {loc.members}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="space-y-6">
        <h2 className="text-xl font-light text-zinc-900">Avantajele Membrilor</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className={`rounded-3xl ${designSystem.glass} ${designSystem.glassHover} p-6 space-y-3`}>
                <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-400 w-fit">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900">{b.title}</h3>
                <p className="text-xs text-zinc-450 leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-light text-zinc-900">Membership Tiers</h2>
          <p className="text-xs text-zinc-400">Selectează nivelul de acces care corespunde obiectivelor tale de investiție.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {TIERS.map((tier, idx) => (
            <div
              key={tier.name}
              onClick={() => setSelectedTier(idx)}
              className={`rounded-3xl border p-6 space-y-5 cursor-pointer transition-all duration-300 ${
                selectedTier === idx
                  ? tier.highlight
                    ? "border-amber-500/40 bg-amber-500/5 ring-1 ring-amber-500/20 shadow-lg shadow-amber-500/5"
                    : "border-zinc-300 bg-zinc-50/40 ring-1 ring-zinc-700/40"
                  : tier.highlight
                    ? "border-amber-500/20 bg-amber-500/[0.02]"
                    : "border-zinc-200 bg-white/40"
              }`}
            >
              {tier.highlight && (
                <span className="inline-block text-[9px] uppercase tracking-widest text-amber-400 border border-amber-500/30 rounded-full px-2.5 py-0.5 font-bold">
                  Recomandat
                </span>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-zinc-900">{tier.name}</h3>
                </div>
                <p className="text-xl font-light text-amber-400 mt-1">{tier.price}</p>
                <p className="text-[11px] text-zinc-450 mt-2 leading-relaxed">{tier.description}</p>
              </div>
              <ul className="space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <ChevronRight className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="text-[11px] text-zinc-350">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-contact-popup"))}
                className={`block w-full rounded-xl py-2.5 text-center text-xs font-semibold transition-all ${
                  tier.highlight ? "bg-amber-500 text-black hover:bg-amber-400" : "border border-zinc-200 text-zinc-400 hover:text-zinc-900 hover:border-zinc-300"
                }`}
              >
                Solicită {tier.name} Access
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-8 max-w-4xl mx-auto py-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-light text-zinc-900">Întrebări Frecvente</h2>
          <p className="text-zinc-400">Despre apartenența la AiX Real Estate Network.</p>
        </div>
        <div className="space-y-4">
          {[
            { q: "Cum se face selecția membrilor?", a: "Toți membrii sunt validați (KYC) și trebuie să îndeplinească anumite criterii de portofoliu sau expertiză. Acest proces asigură un mediu de încredere pentru co-investiții și networking de înaltă calitate." },
            { q: "Pot participa la deal-uri off-market chiar dacă nu am tot capitalul necesar?", a: "Da, avantajul principal al rețelei este posibilitatea de co-investiții (Joint Ventures) alături de alți membri, permițând accesul la active mari (ex: dezvoltări rezidențiale, clădiri de birouri) cu fracțiuni de capital." },
            { q: "Ce fel de evenimente private se organizează?", a: "Organizăm vizionări private (property tours) pentru proprietăți rare nelistate public, întâlniri restrânse cu dezvoltatorii înainte de lansarea publică a proiectelor și evenimente anuale de networking în Monaco, Dubai sau București." },
          ].map((faq, i) => (
            <div key={i} className="rounded-2xl border border-zinc-200 bg-zinc-50/20 p-6 space-y-2">
              <h3 className="font-medium text-zinc-900">{faq.q}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Invitation CTA */}
      <section className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent p-10 md:p-14 text-center space-y-5">
        <Globe className="h-10 w-10 text-amber-500/60 mx-auto" />
        <h2 className="text-2xl font-light text-zinc-900">Membership pe bază de invitație</h2>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Rețeaua AiX Real Estate Network este selectivă. Calitatea comunității este prioritatea noastră. Aplică pentru a fi evaluat pentru membership.
        </p>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-contact-popup"))}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 text-black px-8 py-3 text-xs font-semibold uppercase hover:bg-amber-400 transition-all shadow-md"
        >
          Aplică pentru Membership
          <ArrowRight className="h-4 w-4" />
        </button>
        <p className="text-[10px] text-zinc-600">Răspuns în 48h · NDA disponibil la cerere</p>
      </section>
    </div>
  );
}

function WealthTab() {
  const { language, t } = useLanguage();
  const [marketData, setMarketData] = useState<any>(null);

  // Portfolio interactive allocation sliders
  const [allocation, setAllocation] = useState({
    realEstate: 40,
    equities: 30,
    metals: 10,
    crypto: 10,
    cash: 10,
  });

  const handleSliderChange = (key: keyof typeof allocation, value: number) => {
    setAllocation((prev) => {
      const updated = { ...prev, [key]: value };
      const total = Object.values(updated).reduce((a, b) => a + b, 0);
      
      // Auto adjust other values to ensure total is exactly 100%
      if (total !== 100) {
        const factor = (100 - value) / (100 - prev[key]);
        const keys = Object.keys(updated) as Array<keyof typeof allocation>;
        keys.forEach((k) => {
          if (k !== key) {
            updated[k] = Math.max(0, Math.round(prev[k] * factor));
          }
        });
      }
      return updated;
    });
  };

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch("/api/market");
        if (res.ok) {
          const json = await res.json();
          setMarketData(json);
        }
      } catch (e) {
        console.warn("[AiX Wealth Page] Failed loading live market data", e);
      }
    };
    fetchLive();
    const interval = setInterval(fetchLive, 40000);
    return () => clearInterval(interval);
  }, []);

  const totalAlloc = Object.values(allocation).reduce((a, b) => a + b, 0);

  // SVG parameters for allocations circle
  let strokeAccumulator = 0;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  const allocationTypes = [
    { key: "realEstate" as const, label: language === "ro" ? "Imobiliare" : "Real Estate", color: "stroke-blue-400", bg: "bg-blue-400" },
    { key: "equities" as const, label: language === "ro" ? "Acțiuni / ETF" : "Equities & ETFs", color: "stroke-violet-400", bg: "bg-violet-400" },
    { key: "metals" as const, label: language === "ro" ? "Metale (Aur/Argint)" : "Metals (Gold/Silver)", color: "stroke-amber-400", bg: "bg-amber-400" },
    { key: "crypto" as const, label: language === "ro" ? "Cripto-active" : "Cryptocurrency", color: "stroke-rose-400", bg: "bg-rose-400" },
    { key: "cash" as const, label: language === "ro" ? "Lichidități (Cash)" : "Cash & Treasury", color: "stroke-teal-400", bg: "bg-teal-400" },
  ];

  const calendarEvents = [
    { date: "15 Iul 2026", event: language === "ro" ? "Ședință Politică Monetară BNR" : "BNR Monetary Policy Meeting", desc: language === "ro" ? "Decizie referitoare la dobânda de referință în România." : "Decision on standard interest rates in Romania." },
    { date: "24 Iul 2026", event: language === "ro" ? "Publicare Indice Inflație (INS)" : "INS Inflation CPI Report", desc: language === "ro" ? "Raportul oficial pe luna iunie referitor la consumatori." : "Official report for June consumer pricing metrics." },
    { date: "30 Iul 2026", event: language === "ro" ? "Decizie Rată Dobândă Fed (SUA)" : "Fed Funds Interest Decision", desc: language === "ro" ? "Rezerva Federală publică noul coridor al ratelor de dobândă." : "Federal Reserve announces updated base rate window." },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16 animate-in">
      {/* Header */}
      <section className="space-y-6 max-w-3xl">
        <span className="inline-block text-xs uppercase tracking-[0.2em] text-amber-500/80 border border-amber-500/20 rounded-full px-3 py-1">
          {language === "ro" ? "AiX OS™ · Managementul Portofoliului" : "AiX OS™ · Portfolio Manager"}
        </span>
        <h1 className="text-4xl md:text-5xl font-light text-zinc-900 leading-tight">
          {language === "ro" ? "Private Wealth Desk &" : "Private Wealth Desk &"} <br />
          <span className="gradient-gold">{language === "ro" ? "Alocator de Active Live" : "Live Asset Allocator"}</span>
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          {language === "ro"
            ? "Configurează-ți structura portofoliului, monitorizează indicatorii macroeconomici și urmărește evoluția aurului, a burselor și a lichidităților într-o singură pagină securizată."
            : "Model your portfolio distribution, track macroeconomic benchmarks, and monitor real-time pricing of gold, stocks, and crypto."}
        </p>
      </section>

      {/* Asset Allocator Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Sliders Card */}
        <div className={`lg:col-span-2 rounded-3xl ${designSystem.glass} p-6 sm:p-8 space-y-6 shadow-2xl`}>
          <div className="flex items-center gap-3 border-b border-zinc-200 pb-4">
            <Calculator className="h-5 w-5 text-amber-400" />
            <div>
              <h2 className="text-lg font-light text-zinc-900">{language === "ro" ? "Modelator Alocare Active" : "Asset Allocation Modeler"}</h2>
              <p className="text-[10px] text-zinc-550 uppercase tracking-widest font-mono">{language === "ro" ? "Simulare structură capital" : "Capital Structure Simulation"}</p>
            </div>
          </div>

          <div className="space-y-6">
            {allocationTypes.map(({ key, label, bg }) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="flex items-center gap-2 text-zinc-600 font-medium">
                    <span className={`w-2.5 h-2.5 rounded-full ${bg}`} />
                    {label}
                  </span>
                  <span className="font-mono font-bold text-zinc-900">{allocation[key]}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={allocation[key]}
                  onChange={(e) => handleSliderChange(key, parseInt(e.target.value) || 0)}
                  className="w-full h-1 bg-zinc-50 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-zinc-200/60 text-xs">
            <span className="text-zinc-550">{language === "ro" ? "Total structură:" : "Total distribution:"}</span>
            <span className={`font-mono font-bold ${totalAlloc === 100 ? "text-emerald-400" : "text-amber-500"}`}>{totalAlloc}%</span>
          </div>
        </div>

        {/* Visual Allocation Graph Card */}
        <div className={`rounded-3xl ${designSystem.glass} p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col items-center justify-center text-center min-h-[360px]`}>
          <p className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-2">{language === "ro" ? "Diagramă Portofoliu" : "Visual Balance"}</p>
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* SVG Donut Chart */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="fill-transparent stroke-zinc-900/50"
                strokeWidth="10"
              />
              {allocationTypes.map(({ key, color }) => {
                const percent = allocation[key];
                if (percent === 0) return null;
                const strokeDasharray = `${(percent / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -strokeAccumulator;
                strokeAccumulator += (percent / 100) * circumference;
                return (
                  <circle
                    key={key}
                    cx="60"
                    cy="60"
                    r={radius}
                    className={`fill-transparent ${color} transition-all duration-500`}
                    strokeWidth="10"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                  />
                );
              })}
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-light font-mono text-zinc-900">100%</span>
              <span className="text-[9px] uppercase tracking-widest text-zinc-550 font-semibold mt-0.5">{language === "ro" ? "Active" : "Portfolio"}</span>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] mt-4 border-t border-zinc-200/60 pt-4">
            {allocationTypes.map(({ key, label, bg }) => (
              <div key={key} className="flex items-center gap-1.5 justify-start">
                <span className={`w-2 h-2 rounded-full ${bg} flex-shrink-0`} />
                <span className="text-zinc-450 truncate">{label}:</span>
                <span className="font-mono text-zinc-900 font-semibold ml-auto">{allocation[key]}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Market Pulse Indicators */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 pb-3">
          <h2 className="text-lg font-light text-zinc-900 uppercase tracking-wider">
            {language === "ro" ? "Indicatori Macro & Valutari Live" : "Live Macro & Currency Feeds"}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketData?.macro?.map((item: MarketItem) => (
            <div key={item.label} className={`p-5 rounded-2xl border border-zinc-200 bg-white/40 flex justify-between items-center`}>
              <div className="space-y-1">
                <p className="text-[10px] text-zinc-550 uppercase tracking-wider font-mono font-semibold">{item.label}</p>
                <p className="text-xs text-zinc-400 font-medium">{item.desc}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm font-bold text-zinc-900 font-mono">{item.value}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.trend === "up" ? "text-emerald-400 bg-emerald-500/5 border border-emerald-500/10" : item.trend === "down" ? "text-red-400 bg-red-500/5 border border-red-500/10" : "text-zinc-400"}`}>
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Forbes Wealth Rankings & Largest Companies */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Forbes HNWI Card */}
        <div className={`rounded-3xl ${designSystem.glass} p-6 sm:p-8 space-y-6 shadow-2xl`}>
          <div className="flex items-center gap-3 border-b border-zinc-200 pb-4">
            <Trophy className="h-5 w-5 text-amber-400 font-semibold" />
            <div>
              <h2 className="text-lg font-light text-zinc-900">{language === "ro" ? "Top Investitori & HNWI România" : "Top Investors & HNWI Romania"}</h2>
              <p className="text-[10px] text-zinc-550 uppercase tracking-widest font-mono">{language === "ro" ? "Clasament Forbes estimat" : "Estimated Forbes Wealth Rankings"}</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { rank: "1", name: "Dragoș & Adrian Pavăl", source: "Dedeman / Imobiliare", wealth: "€3.1 Billion" },
              { rank: "2", name: "Ion Țiriac", source: "Auto / Finanțe / Imobiliare", wealth: "€2.2 Billion" },
              { rank: "3", name: "Daniel Dines", source: "UiPath / Tech", wealth: "€1.9 Billion" },
              { rank: "4", name: "Ion Stoica & Matei Zaharia", source: "Databricks / Tech", wealth: "€1.4 Billion" },
              { rank: "5", name: "Ștefan Vuza", source: "Chimcomplex / Industrie", wealth: "€1.1 Billion" },
            ].map((hnwi) => (
              <div key={hnwi.rank} className="flex justify-between items-center p-3 rounded-xl border border-zinc-200 bg-white/20 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-amber-500 w-4">{hnwi.rank}.</span>
                  <div>
                    <span className="font-semibold text-zinc-900 block">{hnwi.name}</span>
                    <span className="text-[10px] text-zinc-400 block">{hnwi.source}</span>
                  </div>
                </div>
                <span className="font-mono text-zinc-900 font-semibold">{hnwi.wealth}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Corporate Index Card */}
        <div className={`rounded-3xl ${designSystem.glass} p-6 sm:p-8 space-y-6 shadow-2xl`}>
          <div className="flex items-center gap-3 border-b border-zinc-200 pb-4">
            <Landmark className="h-5 w-5 text-amber-400 font-semibold" />
            <div>
              <h2 className="text-lg font-light text-zinc-900">{language === "ro" ? "Cele mai Mari Companii (BVB)" : "Largest Romanian Companies (BSE)"}</h2>
              <p className="text-[10px] text-zinc-550 uppercase tracking-widest font-mono">{language === "ro" ? "Capitalizare bursieră de top" : "Top Market Cap Indexing"}</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { symbol: "H2O", name: "Hidroelectrica", sector: "Energie Verde", cap: "RON 56.4 Billion" },
              { symbol: "SNP", name: "OMV Petrom", sector: "Petrol & Gaze", cap: "RON 48.2 Billion" },
              { symbol: "TLV", name: "Banca Transilvania", sector: "Financiar-Bancar", cap: "RON 24.8 Billion" },
              { symbol: "SNG", name: "Romgaz", sector: "Gaze Naturale", cap: "RON 22.1 Billion" },
              { symbol: "BRD", name: "BRD Groupe SG", sector: "Financiar-Bancar", cap: "RON 12.6 Billion" },
            ].map((corp) => (
              <div key={corp.symbol} className="flex justify-between items-center p-3 rounded-xl border border-zinc-200 bg-white/20 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-indigo-450 w-10">{corp.symbol}</span>
                  <div>
                    <span className="font-semibold text-zinc-900 block">{corp.name}</span>
                    <span className="text-[10px] text-zinc-400 block">{corp.sector}</span>
                  </div>
                </div>
                <span className="font-mono text-zinc-900 font-semibold">{corp.cap}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Economic Calendar Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Economic Calendar events list */}
        <div className={`md:col-span-2 rounded-3xl ${designSystem.glass} p-6 sm:p-8 space-y-6 shadow-2xl`}>
          <div className="flex items-center gap-3 border-b border-zinc-200 pb-4">
            <Calendar className="h-5 w-5 text-amber-400" />
            <div>
              <h2 className="text-lg font-light text-zinc-900">{language === "ro" ? "Calendar Economic" : "Economic Calendar"}</h2>
              <p className="text-[10px] text-zinc-555 uppercase tracking-widest font-mono">{language === "ro" ? "Date cheie macro" : "Key Macro Releases"}</p>
            </div>
          </div>

          <div className="space-y-4">
            {calendarEvents.map((evt, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-2xl border border-zinc-200 bg-white/30">
                <div className="flex-shrink-0 text-center w-20 px-2.5 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-amber-400 font-mono leading-none block">{evt.date.split(" ")[1]}</span>
                  <span className="text-lg font-light text-zinc-900 font-mono block mt-1">{evt.date.split(" ")[0]}</span>
                  <span className="text-[8px] text-zinc-400 uppercase block leading-none mt-1">{evt.date.split(" ")[2]}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-zinc-900">{evt.event}</p>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{evt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wealth Resources list */}
        <div className={`rounded-3xl ${designSystem.glass} p-6 sm:p-8 space-y-6 shadow-2xl`}>
          <div className="flex items-center gap-3 border-b border-zinc-200 pb-4">
            <Briefcase className="h-5 w-5 text-amber-400" />
            <div>
              <h2 className="text-lg font-light text-zinc-900">{language === "ro" ? "Ghidul Investitorului" : "Wealth Resources"}</h2>
              <p className="text-[10px] text-zinc-555 uppercase tracking-widest font-mono">{language === "ro" ? "Checklist-uri active" : "Asset management lists"}</p>
            </div>
          </div>

          <ul className="space-y-4">
            {[
              { label: language === "ro" ? "Planificare Fiscală Română" : "Romanian Fiscal Optimization", desc: language === "ro" ? "Optimizarea impozitelor pe dividende și tranzacții în 2026." : "Tax planning details for local dividend taxation in 2026.", href: "/learning" },
              { label: language === "ro" ? "Calculatoare Randament" : "ROI and Mortgage Calculators", desc: language === "ro" ? "Calculează randamentul net din chirii (Yield) și rate." : "Calculate net rental yields and monthly mortgage amortization.", href: "/convenience" },
              { label: language === "ro" ? "Evaluare Riscuri Proprietăți" : "Real Estate Risk Scanning", desc: language === "ro" ? "Evită litigii, vicii cadastrale și probleme cadastru." : "Avoid court litigations, land registry claims, and cadastre loops.", href: "/anti-teapa" },
            ].map((res, idx) => (
              <li key={idx} className="group border-b border-zinc-200/60 pb-3 last:border-0 last:pb-0">
                <a href={res.href} className="block space-y-1">
                  <span className="text-xs font-semibold text-zinc-600 group-hover:text-amber-400 transition-colors flex items-center gap-1">
                    {res.label}
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                  <span className="text-[10px] text-zinc-550 leading-relaxed block">{res.desc}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function OffMarketTab() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [botfield, setBotfield] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: "Off-Market Deal Request",
          name,
          phone,
          email,
          message,
          source: "off-market-page",
          page: "/private-wealth",
          botfield: botfield || undefined,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to submit lead");
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16 animate-in">
      <PageHeader
        badge="Confidentiality First"
        title="Tranzacții Off-Market"
        subtitle="Acces la proprietăți care nu vor fi niciodată listate public. Vindeți sau cumpărați în deplină confidențialitate prin circuitul închis AiX OS™."
      />

      {/* Hero Explainer */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-500">
            <Lock className="h-3 w-3" /> Rețea Privată
          </div>
          <h2 className="text-3xl font-light text-zinc-900 leading-tight">
            De ce cele mai bune oportunități sunt invizibile?
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            La proprietățile cu valoare ridicată, proprietarii doresc discreție. Nu vor anunțuri pe portaluri publice, nu vor vizite de curiozitate și nu doresc expunerea prețului pe internet. Tranzacțiile în circuit închis protejează atât vânzătorul cât și cumpărătorul.
          </p>
          
          <ul className="space-y-4 pt-2">
            {[
              { title: "Zero Amprentă Digitală", desc: "Proprietatea nu este afișată online. Nu există istoric de prețuri sau fotografii indexate pe Google." },
              { title: "Calificarea Părților (NDA)", desc: "Vizitele se fac doar după semnarea unui Acord de Confidențialitate și confirmarea bonității financiare." },
              { title: "Concurență Redusă", desc: "Cumpărătorii accesează active unice (penthouse-uri rare, terenuri strategice) fără licitații publice." }
            ].map((benefit, idx) => (
              <li key={idx} className="flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0 mt-1">
                  <ShieldCheck className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900">{benefit.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-1">{benefit.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* NDA & Form Card */}
        <div className={`p-8 sm:p-10 rounded-3xl ${designSystem.glass} border border-zinc-200 relative overflow-hidden`}>
          <div className={designSystem.glowTop} />
          
          <div className="mb-8">
            <EyeOff className="h-8 w-8 text-amber-500 mb-4" />
            <h3 className="text-xl font-light text-zinc-900">Solicitare Acces Off-Market</h3>
            <p className="text-xs text-zinc-400 mt-2">
              Lăsați datele de contact și specificațiile căutării dumneavoastră. Un Private Broker AiX vă va contacta pentru semnarea NDA-ului.
            </p>
          </div>

          {submitted ? (
            <div className="h-[300px] flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in">
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <ShieldCheck className="h-8 w-8 text-emerald-500" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-zinc-900">Cerere Înregistrată Confidențial</h4>
                <p className="text-sm text-zinc-400 mt-2 max-w-xs mx-auto">
                  Veți fi contactat telefonic în maxim 24 de ore pentru validarea profilului.
                </p>
              </div>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-4 text-[11px] text-amber-500 font-semibold uppercase tracking-wider hover:text-amber-400"
              >
                Trimiteți altă cerere
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot Spam Protection */}
              <input
                type="text"
                name="botfield"
                value={botfield}
                onChange={(e) => setBotfield(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-red-400 text-xs">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold pl-1">Nume Complet</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/50 border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-zinc-900 placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none transition-colors" placeholder="Ion Popescu" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold pl-1">Telefon / WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-white/50 border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-zinc-900 placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none transition-colors" placeholder="+40 700 000 000" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold pl-1">Email Corporate/Personal</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/50 border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-zinc-900 placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none transition-colors" placeholder="adresa@companie.com" />
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold pl-1">Ce fel de proprietate căutați/vindeți?</label>
                <div className="relative">
                  <Home className="absolute left-3.5 top-4 h-4 w-4 text-zinc-600" />
                  <textarea required rows={3} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-white/50 border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-zinc-900 placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none transition-colors resize-none" placeholder="Ex: Caut Penthouse în zona Floreasca, buget 1.5M EUR. / Doresc să vând o vilă istorică în Primăverii..." />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-black py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  "Se trimite cererea securizată..."
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Solicită Acces Confidențial
                  </>
                )}
              </button>
              
              <p className="text-[9px] text-zinc-600 text-center px-4 pt-2">
                Prin trimiterea acestui formular vă dați acordul pentru a fi contactat de un broker autorizat. Datele sunt criptate și nu sunt partajate terților.
              </p>
            </form>
          )}
        </div>
      </section>
      
      {/* Target Audience */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-zinc-200 pt-12">
        <div className="space-y-2">
          <Briefcase className="h-5 w-5 text-zinc-400" />
          <h4 className="text-sm font-semibold text-zinc-900">Pentru Cumpărători</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">Acces la proprietăți excepționale care nu apar niciodată în listările publice sau pe site-urile agențiilor obișnuite.</p>
        </div>
        <div className="space-y-2">
          <Key className="h-5 w-5 text-zinc-400" />
          <h4 className="text-sm font-semibold text-zinc-900">Pentru Vânzători</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">Vindem proprietatea dumneavoastră direct bazei noastre de clienți calificați, fără a expune adresa sau prețul pe internet.</p>
        </div>
        <div className="space-y-2">
          <ShieldCheck className="h-5 w-5 text-zinc-400" />
          <h4 className="text-sm font-semibold text-zinc-900">Protecție Garantată</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">Toate detaliile financiare și vizitele sunt protejate prin acorduri de confidențialitate semnate în prealabil de ambele părți.</p>
        </div>
      </section>

    </div>
  );
}

export default function PrivateWealthClient() {
  const [activeTab, setActiveTab] = useState('wealth');
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-8 animate-in">
      <div className="flex justify-center border-b border-zinc-200 pb-4">
        <div className="flex gap-4">
          <button onClick={() => setActiveTab('wealth')} className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'wealth' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-zinc-50/50 text-zinc-400 hover:text-zinc-900'}`}>Wealth Manager</button>
          <button onClick={() => setActiveTab('network')} className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'network' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-zinc-50/50 text-zinc-400 hover:text-zinc-900'}`}>Private Network</button>
          <button onClick={() => setActiveTab('offmarket')} className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'offmarket' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-zinc-50/50 text-zinc-400 hover:text-zinc-900'}`}>Off-Market Deals</button>
        </div>
      </div>
      <div>
        {activeTab === 'wealth' && <WealthTab />}
        {activeTab === 'network' && <NetworkTab />}
        {activeTab === 'offmarket' && <OffMarketTab />}
      </div>
    </div>
  );
}
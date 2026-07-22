import type { Metadata } from "next";
import { getProperties, getOpportunities, getMarketIndicators } from "@/lib/data";
import { PropertyCard, OpportunityCard, PageHeader } from "@/components/ui";
import { getRomanianMarketPulse } from "@/lib/market";
import { brandContent } from "@/lib/content/brand";
import Link from "next/link";
import { Filter, TrendingUp, MapPin, Globe, Building2, ArrowRight, BarChart3, Gem, Star, Lock, Clock, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Property & Investment Hub | AiX OS™",
  description: "Imobiliare Premium, Investiții Globale și Oportunități Exclusive Evaluate cu AiX Score.",
};

const PROPERTY_TYPES = ["Toate", "Penthouse", "Vilă", "Apartament", "Studio"];
const LOCATIONS = ["Toate", "Floreasca", "Herăstrău", "Pipera", "Monaco", "Dubai"];

const MARKETS = [
  {
    flag: "🇷🇴",
    id: "romania",
    country: "România",
    city: "București · Cluj · Timișoara",
    roi: "6–9%",
    appreciation: "+5–8% /an",
    rental: "5–8%",
    score: 8.2,
    entry: "€50,000+",
    color: "amber",
    summary:
      "Piața cu cel mai bun raport risc-randament din UE. Convergență spre prețurile europene, creștere economică susținută și yield ridicat din chirii.",
    pros: [
      "Prețuri cu 40–60% sub media UE",
      "Randamente chirii 5–8% net",
      "Creștere PIB constant 4%+",
      "Convergență prețuri spre UE",
      "TVA 0% pentru prima proprietate",
    ],
    cons: [
      "Riscuri politice și regulamentare",
      "Volatilitate valutară RON",
      "Piață mai puțin lichidă",
    ],
    highlight: true,
  },
  {
    flag: "🇦🇪",
    id: "dubai",
    country: "Dubai",
    city: "Downtown · Marina · JVC · DIFC",
    roi: "7–12%",
    appreciation: "+10–15% /an",
    rental: "6–10%",
    score: 9.1,
    entry: "€80,000+",
    color: "blue",
    summary:
      "Cel mai dinamic hub imobiliar global. Fără impozit pe venit, acces 0% la câștiguri din chirii, piață în expansiune accelerată.",
    pros: [
      "0% impozit pe câștiguri și chirii",
      "Randamente 6–10% net",
      "Creștere accelerată a populației",
      "Status internațional hub global",
      "Plata în rate direct la developer",
    ],
    cons: [
      "Volatilitate mai mare",
      "Over-supply în anumite segmente",
      "Costuri de management la distanță",
    ],
    highlight: false,
  },
  {
    flag: "🇲🇨",
    id: "monaco",
    country: "Monaco",
    city: "Principat Monaco",
    roi: "3–4%",
    appreciation: "+3–6% /an",
    rental: "2–4%",
    score: 9.5,
    entry: "€2,000,000+",
    color: "gold",
    summary:
      "Cel mai exclusivist real estate din lume. Store of value suprem, fără impozit pe profit sau venit personal. Lichiditate pentru HNWI.",
    pros: [
      "0% impozit pe profit și venit",
      "Cel mai stabil asset din lume",
      "Lichiditate pentru ultra-HNWI",
      "Protecție maximă a averii",
      "Rezidență cu statut privilegiat",
    ],
    cons: [
      "Acces extrem de restrictiv",
      "Randament din chirii scăzut",
      "Capital imobilizat ridicat",
    ],
    highlight: false,
  },
  {
    flag: "🇦🇪",
    id: "abu-dhabi",
    country: "Abu Dhabi",
    city: "Yas Island · Saadiyat · Al Reem",
    roi: "6–9%",
    appreciation: "+8–12% /an",
    rental: "5–8%",
    score: 8.7,
    entry: "€120,000+",
    color: "emerald",
    summary:
      "Capital al UAE, piață mai stabilă decât Dubai. Backed de fonduri suverane, creștere controlată și randamente solide.",
    pros: [
      "Mai stabil decât Dubai",
      "Susținere fond suveran ADNOC",
      "Randamente 5–8% net",
      "Freehold zones accesibile",
      "Infrastructură de top global",
    ],
    cons: [
      "Piață mai mică decât Dubai",
      "Lichiditate mai redusă",
      "Management complex la distanță",
    ],
    highlight: false,
  },
];

const LUXURY_ASSETS = [
  { icon: Gem, title: "Proprietăți Boutique", desc: "Vile și apartamente ultra-premium cu potențial de apreciere ridicat și clientelă selectă.", roi: "3–6%" },
  { icon: Building2, title: "Hoteluri & Resort Shares", desc: "Co-ownership în proprietăți de ospitalitate premium. Venit pasiv garantat contractual.", roi: "5–8%" },
  { icon: BarChart3, title: "REIT & Fonduri Imobiliare", desc: "Expunere la piața imobiliară fără gestionare directă. Lichiditate ridicată.", roi: "4–7%" },
  { icon: Star, title: "Proprietăți Istorice", desc: "Clădiri cu valoare patrimonială, restaurate premium. Subvenții europene disponibile.", roi: "4–8%" },
];

const colorSchemes: Record<string, { border: string; badge: string; text: string }> = {
  amber: { border: "border-amber-500/30", badge: "bg-amber-500/10 text-amber-400", text: "text-amber-400" },
  blue: { border: "border-blue-500/30", badge: "bg-blue-500/10 text-blue-400", text: "text-blue-400" },
  gold: { border: "border-yellow-500/30", badge: "bg-yellow-500/10 text-yellow-400", text: "text-yellow-400" },
  emerald: { border: "border-emerald-500/30", badge: "bg-emerald-500/10 text-emerald-400", text: "text-emerald-400" },
};

export default async function PropertyInvestmentHub() {
  const [properties, pulse, opportunities] = await Promise.all([
    getProperties(),
    Promise.resolve(getRomanianMarketPulse()),
    getOpportunities()
  ]);

  const indicators = getMarketIndicators().slice(0, 4);
  const featuredProps = properties.filter((p) => p.featured);
  const regularProps = properties.filter((p) => !p.featured);
  const featuredOpps = opportunities.filter((o) => o.featured);
  const restOpps = opportunities.filter((o) => !o.featured);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-24">
      {/* ─── 1. PROPERTIES HEADER ─── */}
      <div>
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <PageHeader
            badge="Property & Investment Hub"
            title="Imobiliare Premium Evaluate"
            subtitle="Fiecare proprietate și investiție este analizată cu AiX Score — un sistem proprietar de intelligence imobiliar."
          />
          <div className="flex-shrink-0 flex flex-col items-end gap-2">
            <div className="text-right">
              <p className="text-xs text-zinc-400 uppercase tracking-widest">Sentiment piață</p>
              <p className={`text-lg font-semibold ${pulse.color}`}>
                {pulse.emoji} {pulse.label}
              </p>
            </div>
            <Link
              href="#oportunitati"
              className="rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2 text-xs text-amber-400 hover:bg-amber-500/20 transition-all"
            >
              Oportunități exclusive →
            </Link>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {indicators.map((ind) => (
            <div key={ind.label} className="rounded-xl border border-zinc-200 bg-zinc-50/30 p-3">
              <p className="text-xs text-zinc-400 mb-1">{ind.label}</p>
              <p className="text-sm font-medium text-zinc-900">{ind.value}</p>
              {ind.change && (
                <p className={`text-xs mt-0.5 ${ind.trend === "up" ? "text-emerald-400" : ind.trend === "down" ? "text-red-400" : "text-zinc-400"}`}>
                  {ind.change}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mb-8 flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs text-zinc-400 pr-2 border-r border-zinc-200">
              <Filter className="h-3 w-3" /> Tip:
            </span>
            {PROPERTY_TYPES.map((t) => (
              <span key={t} className={`rounded-full px-3 py-1 text-xs border transition-colors cursor-default ${t === "Toate" ? "border-amber-500/50 bg-amber-500/10 text-amber-400" : "border-zinc-200 text-zinc-400"}`}>
                {t}
              </span>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs text-zinc-400 pr-2 border-r border-zinc-200">
              <MapPin className="h-3 w-3" /> Zonă:
            </span>
            {LOCATIONS.map((l) => (
              <span key={l} className={`rounded-full px-3 py-1 text-xs border transition-colors cursor-default ${l === "Toate" ? "border-amber-500/50 bg-amber-500/10 text-amber-400" : "border-zinc-200 text-zinc-400"}`}>
                {l}
              </span>
            ))}
          </div>
        </div>

        {properties.length === 0 ? (
          <section className="mb-12">
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center border border-zinc-100 bg-zinc-50/50 rounded-2xl">
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-light text-zinc-900 mb-2">No properties available yet</h3>
              <p className="text-zinc-500 max-w-md mx-auto mb-8">
                We&apos;re preparing verified listings. New opportunities will appear here as soon as they are published.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="rounded-full bg-zinc-900 text-white px-6 py-2.5 text-sm font-medium hover:bg-zinc-800 transition-colors">
                  Publish Property
                </Link>
                <Link href="/contact" className="rounded-full bg-white text-zinc-900 border border-zinc-200 px-6 py-2.5 text-sm font-medium hover:bg-zinc-50 transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <>
            {featuredProps.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="h-4 w-4 text-amber-400" />
                  <h2 className="text-lg font-light text-zinc-900">Proprietăți Featured</h2>
                  <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-xs text-amber-400">
                    {featuredProps.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredProps.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
              </section>
            )}

            {regularProps.length > 0 && (
              <section className="mb-12">
                {featuredProps.length > 0 && <h2 className="text-lg font-light text-zinc-900 mb-6">Toate Proprietățile</h2>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularProps.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      <div className="h-px w-full bg-zinc-50"></div>

      {/* ─── 2. OPORTUNITĂȚI ─── */}
      <div id="oportunitati">
        <PageHeader
          badge="Oportunități Exclusive"
          title="Investiții Imobiliare Filtrate"
          subtitle="Oportunități rare: off-market, sub prețul pieței, yield ridicat sau potențial de apreciere accelerată."
        />

        <div className="mb-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {[
            { icon: Lock, label: "Off-Market", desc: "Listări nedisponibile public" },
            { icon: Shield, label: "Due Diligence", desc: "Verificate juridic" },
            { icon: TrendingUp, label: "AiX Scored", desc: "Analizate cu AI" },
            { icon: Clock, label: "Time-Sensitive", desc: "Disponibilitate limitată" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="rounded-xl border border-zinc-200 bg-zinc-50/30 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="h-4 w-4 text-amber-400" />
                <p className="text-sm font-medium text-zinc-900">{label}</p>
              </div>
              <p className="text-xs text-zinc-400">{desc}</p>
            </div>
          ))}
        </div>

        {opportunities.length === 0 ? (
          <section className="mb-12">
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center border border-zinc-100 bg-zinc-50/50 rounded-2xl">
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-light text-zinc-900 mb-2">No investments available yet</h3>
              <p className="text-zinc-500 max-w-md mx-auto mb-8">
                We&apos;re preparing verified investment opportunities. New deals will appear here as soon as they are approved.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="rounded-full bg-zinc-900 text-white px-6 py-2.5 text-sm font-medium hover:bg-zinc-800 transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <>
            {featuredOpps.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-xl font-light text-zinc-900">Oportunități Featured</h2>
                  <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 text-xs text-amber-400">
                    {featuredOpps.length} active
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredOpps.map((opp) => (
                    <OpportunityCard key={opp.id} opportunity={opp} />
                  ))}
                </div>
              </section>
            )}

            {restOpps.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-light text-zinc-900 mb-6">Alte Oportunități</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restOpps.map((opp) => (
                    <OpportunityCard key={opp.id} opportunity={opp} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <div className="mt-10 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-zinc-900/50 p-8">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <p className="text-xs uppercase tracking-widest text-amber-500/80">Acces Privat</p>
            <h3 className="text-2xl font-light text-zinc-900">Lista completă off-market — disponibilă prin cerere</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Unele oportunități nu sunt afișate public. Investitori calificați pot solicita acces la lista privată completă cu prețuri, locații și analize detaliate.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a href={brandContent.urls.propertyForm} target="_blank" rel="noopener noreferrer" className="rounded-full bg-amber-500/90 px-8 py-3 text-sm font-medium text-black hover:bg-amber-400 transition-all">Solicită Lista Privată</a>
              <a href={brandContent.contact.whatsappText} target="_blank" rel="noopener noreferrer" className="rounded-full border border-zinc-300 px-8 py-3 text-sm text-zinc-600 hover:border-amber-500/30 hover:text-zinc-900 transition-all">WhatsApp Direct</a>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-zinc-50"></div>

      {/* ─── 3. INVESTMENTS / GLOBAL MARKETS ─── */}
      <div id="investments">
        <section className="space-y-6">
          <h2 className="text-2xl font-light text-zinc-900">Piețe globale analizate</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {MARKETS.map((m) => {
              const c = colorSchemes[m.color] ?? colorSchemes.amber;
              return (
                <div key={m.id} className={`rounded-3xl border bg-zinc-50/30 p-7 space-y-5 transition-all hover:bg-zinc-100/50 ${m.highlight ? "border-amber-500/30 ring-1 ring-amber-500/10" : "border-zinc-200"}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{m.flag}</span>
                      <div>
                        <h3 className="text-lg font-light text-zinc-900">{m.country}</h3>
                        <p className="text-xs text-zinc-400 flex items-center gap-1"><MapPin className="h-3 w-3" /> {m.city}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-400">AiX Score</p>
                      <p className={`text-xl font-light ${c.text}`}>{m.score}</p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{m.summary}</p>
                  <div className="grid grid-cols-4 gap-3">
                    {[["ROI est.", m.roi], ["Apreciere", m.appreciation], ["Yield chirie", m.rental], ["Entry", m.entry]].map(([label, value]) => (
                      <div key={label as string} className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-center">
                        <p className="text-xs text-zinc-400 mb-1">{label}</p>
                        <p className={`text-sm font-medium ${c.text}`}>{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-zinc-400 uppercase tracking-widest mb-2">Avantaje</p>
                      <ul className="space-y-1.5">
                        {m.pros.map((p) => (
                          <li key={p} className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span><span className="text-zinc-400">{p}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-zinc-400 uppercase tracking-widest mb-2">Riscuri</p>
                      <ul className="space-y-1.5">
                        {m.cons.map((c) => (
                          <li key={c} className="flex items-start gap-2"><span className="text-amber-500/70 mt-0.5">△</span><span className="text-zinc-400">{c}</span></li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <Link href="/contact" className="block w-full rounded-full border border-zinc-300 py-2.5 text-center text-sm text-zinc-600 hover:border-amber-500/40 hover:text-zinc-900 transition-all">
                    Consultanță pentru {m.country} →
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-6 mt-16">
          <div className="space-y-2">
            <h2 className="text-2xl font-light text-zinc-900">Active de Lux & Alternative</h2>
            <p className="text-zinc-400">Diversificare cu active imobiliare speciale și instrumente alternative.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {LUXURY_ASSETS.map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.title} className="rounded-2xl border border-zinc-200 bg-zinc-50/30 p-6 space-y-3 hover:border-zinc-300 transition-colors">
                  <Icon className="h-6 w-6 text-amber-400" />
                  <div>
                    <h3 className="font-medium text-zinc-900 text-sm mb-1">{a.title}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{a.desc}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-200">
                    <span className="text-xs text-zinc-400">ROI estimat</span>
                    <span className="text-sm font-medium text-emerald-400">{a.roi}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-zinc-50/20 p-8 md:p-12 space-y-8 mt-16">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-light text-zinc-900">Procesul de Investiție AiX OS™</h2>
            <p className="text-zinc-400">De la strategie la achiziție, cu suport complet la distanță.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { n: "01", t: "Profilare Investitor", d: "Analizăm obiectivele, apetitul de risc și orizontul de investiție." },
              { n: "02", t: "Selecție Piață & Asset", d: "Recomandăm piețele și tipul de active potrivite profilului tău." },
              { n: "03", t: "Due Diligence", d: "Verificăm juridic, fiscal și financiar orice proprietate selectată." },
              { n: "04", t: "Structurare & Closing", d: "Structurăm optimal tranzacția și gestionăm procesul de achiziție." },
            ].map((s) => (
              <div key={s.n} className="space-y-3 text-center">
                <span className="block text-4xl font-light text-zinc-700">{s.n}</span>
                <h3 className="font-medium text-zinc-900 text-sm">{s.t}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent p-10 md:p-14 text-center space-y-6 mt-16">
          <Globe className="h-10 w-10 text-amber-500/60 mx-auto" />
          <h2 className="text-2xl md:text-3xl font-light text-zinc-900">Unde să investești în 2026?</h2>
          <p className="text-zinc-400 max-w-lg mx-auto">Strategie personalizată bazată pe capitalul, obiectivele și apetitul tău de risc. Consultanță gratuită.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="rounded-full bg-amber-500/90 px-8 py-3.5 text-sm font-medium text-black hover:bg-amber-400 transition-all">Programează Consultanță</Link>
            <Link href="/convenience" className="rounded-full border border-zinc-300 px-8 py-3.5 text-sm text-zinc-600 hover:text-zinc-900 transition-all">Calculatoare ROI →</Link>
          </div>
        </section>
      </div>
    </div>
  );
}

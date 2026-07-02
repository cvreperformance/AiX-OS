import type { Metadata } from "next";
import Link from "next/link";
import {
  TrendingUp,
  Globe,
  Building2,
  ArrowRight,
  BarChart3,
  Shield,
  Gem,
  MapPin,
  Star,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Investiții Imobiliare — Piețe Globale | AiX OS",
  description:
    "Oportunități de investiție în România, Dubai, Monaco, Abu Dhabi și active de lux. ROI, apreciere, randamente și AiX Score pentru fiecare piață.",
};

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

export default function InvestmentsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-20 py-12">
      {/* Header */}
      <section className="space-y-6">
        <span className="inline-block text-xs uppercase tracking-[0.2em] text-amber-500/80 border border-amber-500/20 rounded-full px-3 py-1">
          AiX OS · Investment Intelligence
        </span>
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-5">
            <h1 className="text-4xl md:text-5xl font-light text-white leading-[1.1]">
              Investiții Imobiliare<br />
              <span className="gradient-gold">Piețe Globale Selectate</span>
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Analizăm piețele cu cel mai bun raport risc-randament din lume.
              AiX OS Score pentru fiecare piață, comparare directă și acces la oportunități validate.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-amber-500/90 px-7 py-3.5 text-sm font-medium text-black hover:bg-amber-400 transition-all">
                Consultanță Investiții
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/calculators" className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-7 py-3.5 text-sm text-zinc-300 hover:border-amber-500/30 transition-all">
                Calculator ROI →
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { v: "4", l: "Piețe globale analizate" },
              { v: "€0", l: "Impozit în UAE pe câștiguri" },
              { v: "12%", l: "ROI maxim documentat" },
            ].map(({ v, l }) => (
              <div key={l} className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 text-center">
                <p className="text-3xl font-light text-amber-400">{v}</p>
                <p className="text-xs text-zinc-500 mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Cards */}
      <section className="space-y-6">
        <h2 className="text-2xl font-light text-white">Piețe analizate</h2>
        <div className="grid lg:grid-cols-2 gap-6">
          {MARKETS.map((m) => {
            const c = colorSchemes[m.color] ?? colorSchemes.amber;
            return (
              <div key={m.id}
                className={`rounded-3xl border bg-zinc-900/30 p-7 space-y-5 transition-all hover:bg-zinc-900/50 ${m.highlight ? "border-amber-500/30 ring-1 ring-amber-500/10" : "border-zinc-800"}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{m.flag}</span>
                    <div>
                      <h3 className="text-lg font-light text-white">{m.country}</h3>
                      <p className="text-xs text-zinc-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {m.city}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-500">AiX Score</p>
                    <p className={`text-xl font-light ${c.text}`}>{m.score}</p>
                  </div>
                </div>

                <p className="text-sm text-zinc-400 leading-relaxed">{m.summary}</p>

                <div className="grid grid-cols-4 gap-3">
                  {[["ROI est.", m.roi], ["Apreciere", m.appreciation], ["Yield chirie", m.rental], ["Entry", m.entry]].map(([label, value]) => (
                    <div key={label as string} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 text-center">
                      <p className="text-xs text-zinc-500 mb-1">{label}</p>
                      <p className={`text-sm font-medium ${c.text}`}>{value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-zinc-500 uppercase tracking-widest mb-2">Avantaje</p>
                    <ul className="space-y-1.5">
                      {m.pros.map((p) => (
                        <li key={p} className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5">✓</span>
                          <span className="text-zinc-400">{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-zinc-500 uppercase tracking-widest mb-2">Riscuri</p>
                    <ul className="space-y-1.5">
                      {m.cons.map((c) => (
                        <li key={c} className="flex items-start gap-2">
                          <span className="text-amber-500/70 mt-0.5">△</span>
                          <span className="text-zinc-500">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Link href="/contact"
                  className="block w-full rounded-full border border-zinc-700 py-2.5 text-center text-sm text-zinc-300 hover:border-amber-500/40 hover:text-white transition-all">
                  Consultanță pentru {m.country} →
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Luxury Assets */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-light text-white">Active de Lux & Alternative</h2>
          <p className="text-zinc-400">Diversificare cu active imobiliare speciale și instrumente alternative.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {LUXURY_ASSETS.map((a) => {
            const Icon = a.icon;
            return (
              <div key={a.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-3 hover:border-zinc-700 transition-colors">
                <Icon className="h-6 w-6 text-amber-400" />
                <div>
                  <h3 className="font-medium text-white text-sm mb-1">{a.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{a.desc}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                  <span className="text-xs text-zinc-500">ROI estimat</span>
                  <span className="text-sm font-medium text-emerald-400">{a.roi}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Investment Process */}
      <section className="rounded-3xl border border-zinc-800 bg-zinc-900/20 p-8 md:p-12 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-light text-white">Procesul de Investiție AiX OS</h2>
          <p className="text-zinc-400">De la strategie la achiziție, cu suport complet la distanță.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { n: "01", t: "Profilare Investitor", d: "Analizăm obiectivele, apetitul de risc și orizontul de investiție." },
            { n: "02", t: "Selecție Piață & Asset", d: "Recomandăm piețele și tipul de active potrivite profilului tău." },
            { n: "03", t: "Due Diligence Complet", d: "Verificăm juridic, fiscal și financiar orice proprietate selectată." },
            { n: "04", t: "Structurare & Closing", d: "Structurăm optimal tranzacția și gestionăm tot procesul de achiziție." },
          ].map((s) => (
            <div key={s.n} className="space-y-3 text-center">
              <span className="block text-4xl font-light text-zinc-700">{s.n}</span>
              <h3 className="font-medium text-white text-sm">{s.t}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Partner ecosystem */}
      <section className="grid md:grid-cols-2 gap-5">
        {[
          {
            href: "https://cristianvaduva.com",
            title: "CristianVaduva.com",
            desc: "Consultanță imobiliară personalizată, buyer representation și market intelligence pentru investitori exigenți.",
            badge: "Real Estate · Consultanță",
          },
          {
            href: "https://aixluxury.com",
            title: "AiXLuxury.com",
            desc: "Proprietăți de lux în România, Dubai, Monaco și Europa. Rețea exclusivă de proprietăți premium off-market.",
            badge: "Luxury · Premium · Off-Market",
          },
        ].map((p) => (
          <a key={p.title} href={p.href.replace(" ", "")} target="_blank" rel="noopener noreferrer"
            className="group rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-3 hover:border-amber-500/30 transition-all block">
            <span className="text-xs uppercase tracking-widest text-amber-500/70">{p.badge}</span>
            <h3 className="text-lg font-light text-white group-hover:text-amber-400 transition-colors">
              {p.title} ↗
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{p.desc}</p>
          </a>
        ))}
      </section>

      {/* FAQ */}
      <section className="space-y-8 max-w-4xl mx-auto py-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-light text-white">Întrebări Frecvente</h2>
          <p className="text-zinc-400">Despre investițiile imobiliare internaționale.</p>
        </div>
        <div className="space-y-4">
          {[
            { q: "Care este suma minimă recomandată pentru a investi?", a: "Pentru piața din România (București/Cluj), recomandăm un capital de pornire de minim €50,000 (pentru credite ipotecare sau studiouri). Pentru piața din Dubai, proiectele off-plan permit intrarea cu aproximativ €80,000, eșalonat pe perioada construcției." },
            { q: "Cum gestionez proprietățile aflate în străinătate (ex. Dubai)?", a: "Beneficiezi de un pachet complet, de la achiziție la gestionare. Dezvoltatorii parteneri și companiile locale de Property Management se ocupă de închiriere, colectarea chiriilor și mentenanță." },
            { q: "Sunt profiturile din Dubai scutite de taxe?", a: "Da, la acest moment Dubai nu percepe impozit pe veniturile din chirii și nici pe câștigurile de capital din tranzacțiile imobiliare (0% taxe pe profit)." },
          ].map((faq, i) => (
            <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 space-y-2">
              <h3 className="font-medium text-white">{faq.q}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent p-10 md:p-14 text-center space-y-6">
        <Globe className="h-10 w-10 text-amber-500/60 mx-auto" />
        <h2 className="text-2xl md:text-3xl font-light text-white">
          Unde să investești în 2026?
        </h2>
        <p className="text-zinc-400 max-w-lg mx-auto">
          Strategie personalizată bazată pe capitalul, obiectivele și apetitul tău de risc. Consultanță gratuită.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/contact" className="rounded-full bg-amber-500/90 px-8 py-3.5 text-sm font-medium text-black hover:bg-amber-400 transition-all">
            Programează Consultanță
          </Link>
          <Link href="/oportunitati" className="rounded-full border border-zinc-700 px-8 py-3.5 text-sm text-zinc-300 hover:text-white transition-all">
            Oportunități Active →
          </Link>
        </div>
      </section>
    </div>
  );
}

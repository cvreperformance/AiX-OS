import type { Metadata } from "next";
import Link from "next/link";
import {
  Camera,
  BarChart3,
  Globe,
  Brain,
  TrendingUp,
  Users,
  ArrowRight,
  CheckCircle2,
  Star,
  MessageCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Seller Representation — Vinzi la Prețul Corect | AiX OS",
  description:
    "Vinde-ți proprietatea cu maximum de expunere și prețul corect. Marketing premium, fotografie profesională, AI promotion și analiză de piață.",
};

const SERVICES = [
  {
    icon: BarChart3,
    title: "Evaluare AI la Prețul Corect",
    desc: "Analiză comparativă cu AiX Score. Stabilim prețul optim pe baza a 12+ indicatori de piață, nu pe intuiție.",
  },
  {
    icon: Camera,
    title: "Marketing Premium",
    desc: "Fotografie profesională, video drone, virtual tour 3D și materiale de prezentare de calitate luxury.",
  },
  {
    icon: Globe,
    title: "Expunere Maximă",
    desc: "Listare pe toate portalele majore + rețeaua privată AiX OS + baza de cumpărători calificați pre-aprovați.",
  },
  {
    icon: Brain,
    title: "AI Promotion",
    desc: "Targetare precisă cu AI. Identificăm cumpărătorii potriviți și le prezentăm proprietatea ta direct.",
  },
  {
    icon: Users,
    title: "Bază de Cumpărători Activi",
    desc: "Rețea de investitori, cumpărători calificați și expați cu bugete verificate. Zero timp pierdut.",
  },
  {
    icon: TrendingUp,
    title: "Analytics & Raportare",
    desc: "Dashboard live cu vizualizări, lead-uri și feedback. Știi exact unde stai în orice moment.",
  },
];

const RESULTS = [
  { value: "98%", label: "Proprietăți vândute la preț sau peste" },
  { value: "27 zile", label: "Medie timp până la ofertă" },
  { value: "€0", label: "Comision perceput cumpărătorului" },
  { value: "4.8★", label: "Rating mediu clienți vânzători" },
];

const PROCESS = [
  { step: "01", title: "Evaluare & Strategie", desc: "Stabilim prețul corect și strategia de marketing personalizată." },
  { step: "02", title: "Pregătirea Proprietății", desc: "Fotografie, video, home staging consultanță și materiale premium." },
  { step: "03", title: "Lansarea Campaniei", desc: "Listare multiplă, outreach activ și promovare AI-powered." },
  { step: "04", title: "Calificarea Lead-urilor", desc: "Filtrăm și calificăm fiecare interes. Prezentăm doar cumpărători serioși." },
  { step: "05", title: "Negociere & Ofertă", desc: "Negociem în interesul tău. Maximizăm prețul și minimizăm riscurile." },
  { step: "06", title: "Closing", desc: "Gestionăm tot procesul la notar. Tu semnezi și primești banii." },
];

export default function SellerPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-24 py-12">
      {/* Hero */}
      <section className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="inline-block text-xs uppercase tracking-[0.2em] text-amber-500/80 border border-amber-500/20 rounded-full px-3 py-1">
            AiX OS · Seller Representation
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-[1.1]">
            Vinzi la{" "}
            <span className="gradient-gold">Prețul Maxim</span>
            <br />
            în Timp Minim
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed max-w-lg">
            Marketing premium, AI promotion și acces la baza noastră de cumpărători calificați.
            Evaluare corectă, expunere maximă, rezultate garantate.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-amber-500/90 px-7 py-3.5 text-sm font-medium text-black hover:bg-amber-400 transition-all">
              Evaluare Gratuită
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="https://wa.me/40000000000" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-7 py-3.5 text-sm text-zinc-300 hover:border-amber-500/30 transition-all">
              <MessageCircle className="h-4 w-4 text-emerald-400" />
              WhatsApp
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-8 space-y-5">
          <h3 className="text-lg font-light text-white">Solicită Evaluare Gratuită</h3>
          <SellerLeadForm />
        </div>
      </section>

      {/* Results */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {RESULTS.map((r) => (
          <div key={r.label} className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 text-center space-y-2">
            <p className="text-3xl font-light text-amber-400">{r.value}</p>
            <p className="text-xs text-zinc-500 leading-relaxed">{r.label}</p>
          </div>
        ))}
      </section>

      {/* Services */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-light text-white">Ce facem pentru tine</h2>
          <p className="text-zinc-400">Marketing imobiliar la nivel internațional, aplicat proprietății tale.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-3 hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-amber-500/10 p-2.5">
                    <Icon className="h-5 w-5 text-amber-400" />
                  </div>
                  <h3 className="font-medium text-white">{s.title}</h3>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Process */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-light text-white">Procesul de Vânzare AiX OS</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROCESS.map((step) => (
            <div key={step.step} className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 space-y-3">
              <span className="text-4xl font-light text-zinc-700">{step.step}</span>
              <h3 className="font-medium text-white">{step.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Marketing Package */}
      <section className="rounded-3xl border border-zinc-800 bg-zinc-900/20 p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-light text-white">Pachetul Marketing Premium</h2>
            <p className="text-zinc-400">Inclus în orice mandat de vânzare AiX OS:</p>
            <ul className="space-y-3">
              {[
                "Fotografie profesională (20+ imagini HDR)",
                "Video drone exterior",
                "Virtual tour 3D interactiv",
                "Materiale de prezentare premium PDF",
                "Listare pe toate portalele majore (imobiliare.ro, storia.ro, OLX Pro)",
                "Promovare Social Media (Facebook, Instagram, LinkedIn)",
                "Outreach direct la baza de cumpărători qualificați",
                "Pagină dedicată proprietății pe AiX OS",
                "Raport săptămânal cu analytics",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-zinc-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-3">
              <p className="text-xs uppercase tracking-widest text-amber-500/80">Ecosistem Partener</p>
              <p className="text-zinc-300 text-sm leading-relaxed">
                Proprietatea ta va fi prezentată și în rețeaua internațională AiXLuxury.com,
                cu acces la cumpărători din România, Europa, Dubai și Monaco.
              </p>
              <a href="https://aixluxury.com" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 transition-colors">
                AiXLuxury.com <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-3">
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-zinc-300 italic text-sm leading-relaxed">
                &ldquo;Am vândut apartamentul în 18 zile, cu 3% peste prețul cerut inițial.
                Fotografia profesională și promovarea AI au atras cumpărători pe care nu i-aș fi găsit singur.&rdquo;
              </p>
              <p className="text-xs text-zinc-500">— Mihai D., vânzător, Floreasca</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-light text-white">Întrebări Frecvente</h2>
          <p className="text-zinc-400">Despre procesul de vânzare AiX OS.</p>
        </div>
        <div className="space-y-4">
          {[
            { q: "Trebuie să semnez un contract de exclusivitate?", a: "Recomandăm reprezentarea exclusivă pentru a putea investi masiv în marketing (foto, video, promovare) fără riscul ca altcineva să vândă proprietatea fără aceste materiale, însă oferim și opțiuni flexibile." },
            { q: "Cum stabiliți prețul corect?", a: "Folosim algoritmul AiX Score, coroborat cu expertiza umană, analizând tranzacții similare recente din zonă, tendințele macroeconomice și dotările specifice ale proprietății." },
            { q: "Cât durează procesul de vânzare?", a: "În medie, proprietățile evaluate și promovate prin AiX OS primesc o ofertă validă în 27 de zile de la lansarea campaniei de marketing." },
          ].map((faq, i) => (
            <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 space-y-2">
              <h3 className="font-medium text-white">{faq.q}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent p-10 md:p-16 text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-light text-white">Evaluare gratuită, fără angajamente</h2>
        <p className="text-zinc-400 max-w-lg mx-auto">
          Află în 24h care este prețul real al proprietății tale pe piața actuală.
        </p>
        <Link href="/contact" className="inline-block rounded-full bg-amber-500/90 px-10 py-4 text-sm font-medium text-black hover:bg-amber-400 transition-all">
          Solicită Evaluare Gratuită
        </Link>
      </section>
    </div>
  );
}

function SellerLeadForm() {
  return (
    <form action="mailto:contact@cristianvaduva.com" method="get" className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <input name="name" placeholder="Numele tău" required
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-amber-500/50 focus:outline-none transition-colors" />
        <input name="phone" placeholder="Telefon" required
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-amber-500/50 focus:outline-none transition-colors" />
      </div>
      <input name="address" placeholder="Adresa proprietății" required
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-amber-500/50 focus:outline-none transition-colors" />
      <select className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-300 focus:border-amber-500/50 focus:outline-none transition-colors">
        <option value="">Tipul proprietății</option>
        <option>Apartament</option><option>Casă / Vilă</option>
        <option>Penthouse</option><option>Teren</option><option>Comercial</option>
      </select>
      <input name="price" placeholder="Prețul estimat (EUR)" type="number"
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-amber-500/50 focus:outline-none transition-colors" />
      <button type="submit"
        className="w-full rounded-full bg-amber-500/90 py-3 text-sm font-medium text-black hover:bg-amber-400 transition-all">
        Solicită Evaluare Gratuită
      </button>
      <p className="text-xs text-zinc-600 text-center">Evaluare în 24h. Fără angajamente.</p>
    </form>
  );
}

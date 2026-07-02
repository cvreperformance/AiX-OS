import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Shield,
  TrendingUp,
  Brain,
  Search,
  FileText,
  Handshake,
  Star,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Buyer Representation — Cumpără Inteligent | AiX OS",
  description:
    "Reprezentare cumpărător profesională cu AI. Negociere, due diligence, market intelligence și protecție completă în procesul de achiziție imobiliară.",
  openGraph: {
    title: "Buyer Representation OS — AiX OS",
    description: "Cumpără orice proprietate cu un expert în echipa ta.",
    type: "website",
  },
};

const ADVANTAGES = [
  {
    icon: Brain,
    title: "AI Market Intelligence",
    desc: "Analiza automată a proprietăților cu AiX Score. Compari orice ofertă cu piața în timp real.",
  },
  {
    icon: Shield,
    title: "Protecție Completă",
    desc: "Verificăm titlul de proprietate, sarcini, ipoteci și litigii. Zero surprize după semnare.",
  },
  {
    icon: TrendingUp,
    title: "Negociere Expertă",
    desc: "Negociem în interesul tău exclusiv. Economii medii de 4–8% față de prețul cerut.",
  },
  {
    icon: Search,
    title: "Acces Off-Market",
    desc: "Proprietăți care nu apar pe portale. Rețea privată de vânzători motivați.",
  },
  {
    icon: FileText,
    title: "Due Diligence Complet",
    desc: "Analiză juridică, tehnică și financiară. Raport detaliat pentru fiecare proprietate.",
  },
  {
    icon: Handshake,
    title: "Reprezentare Exclusivă",
    desc: "Lucrăm doar pentru tine, nu pentru vânzător. Conflict de interes zero.",
  },
];

const PROCESS = [
  { step: "01", title: "Consultație Inițială", desc: "Definim criteriile, bugetul și obiectivele tale de investiție. Gratuită, fără angajamente." },
  { step: "02", title: "Căutare Activă", desc: "Identificăm proprietăți pe piață și off-market. Filtrăm și prezentăm doar ce se potrivește." },
  { step: "03", title: "Analiză AiX Score", desc: "Fiecare proprietate primește un scor bazat pe 12+ indicatori. Compari cu piața." },
  { step: "04", title: "Due Diligence", desc: "Verificăm legal, tehnic și financiar. Nimic nu scapă necontrolat." },
  { step: "05", title: "Negociere & Ofertă", desc: "Negociem prețul și clauzele contractuale în interesul tău." },
  { step: "06", title: "Closing & Post-vânzare", desc: "Suport la notar, transfer utilități și servicii post-achiziție." },
];

const COMPARISON = [
  { aspect: "Acces off-market", alone: false, withUs: true },
  { aspect: "Analiză AiX Score", alone: false, withUs: true },
  { aspect: "Negociere profesională", alone: false, withUs: true },
  { aspect: "Due diligence juridic", alone: false, withUs: true },
  { aspect: "Verificare sarcini/ipoteci", alone: false, withUs: true },
  { aspect: "Acces date comparative piață", alone: false, withUs: true },
  { aspect: "Suport notar & transfer", alone: false, withUs: true },
  { aspect: "Conflict de interes zero", alone: false, withUs: true },
];

const TESTIMONIALS = [
  {
    name: "Alexandru M.",
    role: "Investitor imobiliar, București",
    quote:
      "Cu ajutorul echipei AiX OS am identificat și achiziționat un apartament cu 6% sub prețul de piață. Due diligence-ul a identificat o problemă juridică pe care o treceam cu vederea. Economie reală: €14,000.",
    score: 5,
  },
  {
    name: "Elena P.",
    role: "Cumpărător prima locuință",
    quote:
      "Prima mea achiziție imobiliară și nu știam nimic. Echipa AiX OS m-a ghidat pas cu pas și am cumpărat o proprietate excelentă. Nu mi-aș fi imaginat că procesul poate fi atât de simplu.",
    score: 5,
  },
];

export default function BuyerPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-24 py-12">
      {/* Hero */}
      <section className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="inline-block text-xs uppercase tracking-[0.2em] text-amber-500/80 border border-amber-500/20 rounded-full px-3 py-1">
            AiX OS · Buyer Representation
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-[1.1]">
            Cumpără Orice Proprietate{" "}
            <span className="gradient-gold">cu un Expert</span> în Echipa Ta
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed max-w-lg">
            Reprezentare exclusivă a cumpărătorului. AI-powered market intelligence,
            negociere profesională și due diligence complet. De la căutare la cheie.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-amber-500/90 px-7 py-3.5 text-sm font-medium text-black hover:bg-amber-400 transition-all"
            >
              Consultație Gratuită
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://wa.me/40000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-7 py-3.5 text-sm text-zinc-300 hover:border-amber-500/30 hover:text-white transition-all"
            >
              <MessageCircle className="h-4 w-4 text-emerald-400" />
              WhatsApp
            </a>
          </div>
          <div className="flex items-center gap-6 pt-2">
            {[["€0", "Cost pentru cumpărător"], ["94%", "Rată succes negociere"], ["6%", "Economie medie din preț"]].map(([v, l]) => (
              <div key={l}>
                <p className="text-2xl font-light text-white">{v}</p>
                <p className="text-xs text-zinc-500">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-8 space-y-5">
          <h3 className="text-lg font-light text-white">Solicită Reprezentare</h3>
          <p className="text-sm text-zinc-400">Completează formularul și te contactăm în 24h.</p>
          <BuyerLeadForm />
        </div>
      </section>

      {/* Comparison: alone vs with us */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-light text-white">Singur vs. cu AiX OS</h2>
          <p className="text-zinc-400">Diferența dintre o decizie bună și una excelentă.</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="grid grid-cols-3 bg-zinc-900/80 px-6 py-4">
            <p className="text-sm font-medium text-zinc-300">Aspect</p>
            <p className="text-sm font-medium text-zinc-500 text-center">Singur</p>
            <p className="text-sm font-medium text-amber-400 text-center">Cu AiX OS</p>
          </div>
          {COMPARISON.map((row, i) => (
            <div
              key={row.aspect}
              className={`grid grid-cols-3 px-6 py-4 ${i % 2 === 0 ? "bg-zinc-900/20" : ""}`}
            >
              <p className="text-sm text-zinc-300">{row.aspect}</p>
              <div className="flex justify-center">
                {row.alone ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <span className="h-5 w-5 flex items-center justify-center text-red-500 text-lg leading-none">✗</span>
                )}
              </div>
              <div className="flex justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Advantages */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-light text-white">Ce obții cu AiX OS</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ADVANTAGES.map((adv) => {
            const Icon = adv.icon;
            return (
              <div key={adv.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-3 hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-amber-500/10 p-2.5">
                    <Icon className="h-5 w-5 text-amber-400" />
                  </div>
                  <h3 className="font-medium text-white">{adv.title}</h3>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">{adv.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Process */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-light text-white">Procesul AiX OS</h2>
          <p className="text-zinc-400">De la prima discuție la cheile în mână.</p>
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

      {/* Testimonials */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-light text-white">Ce spun clienții</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 space-y-4">
              <div className="flex gap-0.5">
                {Array.from({ length: t.score }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-zinc-300 italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div>
                <p className="text-sm font-medium text-white">{t.name}</p>
                <p className="text-xs text-zinc-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent p-10 md:p-16 text-center space-y-6">
        <Shield className="h-10 w-10 text-amber-500/60 mx-auto" />
        <h2 className="text-3xl md:text-4xl font-light text-white">
          Gata să cumperi inteligent?
        </h2>
        <p className="text-zinc-400 max-w-lg mx-auto">
          Prima consultație este gratuită. Nu există angajamente. Doar o discuție despre obiectivele tale.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/contact" className="rounded-full bg-amber-500/90 px-8 py-3.5 text-sm font-medium text-black hover:bg-amber-400 transition-all">
            Programează Consultație Gratuită
          </Link>
          <Link href="/proprietati" className="rounded-full border border-zinc-700 px-8 py-3.5 text-sm text-zinc-300 hover:text-white transition-all">
            Explorează Proprietăți →
          </Link>
        </div>
        <p className="text-xs text-zinc-600">
          Parte din ecosistemul{" "}
          <a href="https://cristianvaduva.com" target="_blank" rel="noopener noreferrer" className="text-amber-500/70 hover:text-amber-400">
            CristianVaduva.com
          </a>{" "}
          ·{" "}
          <a href="https://aixluxury.com" target="_blank" rel="noopener noreferrer" className="text-amber-500/70 hover:text-amber-400">
            AiXLuxury.com
          </a>
        </p>
      </section>
    </div>
  );
}

function BuyerLeadForm() {
  return (
    <form
      action="mailto:contact@cristianvaduva.com"
      method="get"
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <input
          name="name"
          placeholder="Prenume"
          required
          className="col-span-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-amber-500/50 focus:outline-none transition-colors"
        />
        <input
          name="phone"
          placeholder="Telefon"
          required
          className="col-span-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-amber-500/50 focus:outline-none transition-colors"
        />
      </div>
      <input
        name="budget"
        placeholder="Budget estimat (EUR)"
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-amber-500/50 focus:outline-none transition-colors"
      />
      <select className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-300 focus:border-amber-500/50 focus:outline-none transition-colors">
        <option value="">Tipul proprietății dorite</option>
        <option>Apartament</option>
        <option>Casă / Vilă</option>
        <option>Penthouse</option>
        <option>Comercial / Birou</option>
        <option>Teren</option>
        <option>Orice oportunitate bună</option>
      </select>
      <textarea
        placeholder="Detalii suplimentare (locație, suprafață, obiectiv...)"
        rows={3}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-amber-500/50 focus:outline-none transition-colors resize-none"
      />
      <button
        type="submit"
        className="w-full rounded-full bg-amber-500/90 py-3 text-sm font-medium text-black hover:bg-amber-400 transition-all"
      >
        Trimite Solicitarea
      </button>
      <p className="text-xs text-zinc-600 text-center">
        Răspundem în maxim 24h. Consultație inițială gratuită.
      </p>
    </form>
  );
}

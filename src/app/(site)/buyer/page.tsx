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
import BuyerLeadForm from "./BuyerLeadForm";

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
              href="https://wa.me/436509536345"
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

      {/* FAQ */}
      <section className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-light text-white">Întrebări Frecvente</h2>
          <p className="text-zinc-400">Tot ce trebuie să știi despre reprezentarea exclusivă.</p>
        </div>
        <div className="space-y-4">
          {[
            { q: "Cât mă costă serviciul de reprezentare?", a: "Pentru cumpărător, serviciul este complet gratuit. Comisionul nostru este plătit din bugetul de marketing al dezvoltatorului sau al vânzătorului, însă negocierea o facem exclusiv în interesul tău." },
            { q: "Cum mă ajută AiX Score?", a: "AiX Score este algoritmul nostru proprietar care analizează peste 12 indicatori (randament, infrastructură, istoric prețuri, risc legal) pentru a-ți oferi o evaluare obiectivă, dincolo de marketingul vânzătorului." },
            { q: "Aveți acces la proprietăți care nu sunt online?", a: "Da, gestionăm un portofoliu semnificativ de proprietăți off-market din rețeaua noastră privată de investitori, accesibile doar clienților calificați." },
          ].map((faq, i) => (
            <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 space-y-2">
              <h3 className="font-medium text-white">{faq.q}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent p-8 md:p-12">
        <div className="md:col-span-7 space-y-6 text-left">
          <Shield className="h-10 w-10 text-amber-500/60" />
          <h2 className="text-3xl md:text-4xl font-light text-white leading-tight">
            Gata să cumperi inteligent?
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-lg">
            Prima consultație este gratuită. Nu există angajamente. Completează formularul alăturat pentru a primi cotații off-market și detalii exclusive.
          </p>
          <div className="flex gap-4">
            <Link href="/proprietati" className="rounded-full border border-zinc-700 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-350 hover:text-white transition-all">
              Explorează Proprietăți →
            </Link>
          </div>
        </div>
        <div className="md:col-span-5 bg-zinc-950/45 p-6 rounded-3xl border border-zinc-850">
          <BuyerLeadForm />
        </div>
      </section>
    </div>
  );
}

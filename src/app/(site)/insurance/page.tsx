import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Heart,
  Activity,
  Plane,
  Car,
  Building2,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Asigurări AI — Hub Complet | AiX OS",
  description:
    "Comparați și obțineți cele mai bune oferte de asigurare: locuință, viață, sănătate, auto, călătorie și business. Consultanță AI gratuită.",
};

const PRODUCTS = [
  {
    icon: Shield,
    id: "locuinta",
    title: "Asigurare Locuință",
    tagline: "Protecție completă pentru proprietatea ta",
    desc: "Acoperire pentru incendiu, inundații, cutremur, furt și daune. Include PAD obligatoriu.",
    estPrice: "€15–80/lună",
    features: [
      "Daune materiale complete",
      "Incendiu și trăsnet",
      "Inundație și fenomene meteo",
      "Cutremur (opțional)",
      "Furt și vandalism",
      "Răspundere civilă față de terți",
    ],
    color: "amber",
  },
  {
    icon: Heart,
    id: "viata",
    title: "Asigurare de Viață",
    tagline: "Protecție pentru familie și ipotecă",
    desc: "Asigurare de viață cu componentă de economisire sau risc pur. Perfectă pentru credite ipotecare.",
    estPrice: "€20–150/lună",
    features: [
      "Deces prin accident sau boală",
      "Invaliditate permanentă",
      "Boli grave (cancer, AVC, infarct)",
      "Componentă de economisire",
      "Acoperire ipotecă",
      "Pensie privată integrată",
    ],
    color: "red",
  },
  {
    icon: Activity,
    id: "sanatate",
    title: "Asigurare de Sănătate",
    tagline: "Acces rapid la medici și clinici premium",
    desc: "Asigurare medicală privată cu acces la cele mai bune clinici din România și Europa.",
    estPrice: "€30–200/lună",
    features: [
      "Consultații specialiști fără liste de așteptare",
      "Investigații și analize",
      "Internare în clinici private",
      "Stomatologie (opțional)",
      "Urgențe în România și UE",
      "Telemedicină 24/7",
    ],
    color: "emerald",
  },
  {
    icon: Plane,
    id: "calatorie",
    title: "Asigurare Călătorie",
    tagline: "Liniște în orice destinație",
    desc: "Acoperire medicală, bagaje, anulare zbor și asistență în orice colț al lumii.",
    estPrice: "€5–30/călătorie",
    features: [
      "Urgențe medicale în străinătate",
      "Evacuare medicală",
      "Pierdere sau deteriorare bagaje",
      "Anulare / întârziere zbor",
      "Răspundere civilă",
      "Sporturi extreme (opțional)",
    ],
    color: "blue",
  },
  {
    icon: Car,
    id: "auto",
    title: "Asigurare Auto",
    tagline: "RCA + CASCO la prețul corect",
    desc: "Comparăm automat ofertele de la 15+ asigurători pentru cel mai bun preț.",
    estPrice: "€50–300/an",
    features: [
      "RCA obligatoriu la prețuri competitive",
      "CASCO complet sau parțial",
      "Asistență rutieră 24/7",
      "Auto de înlocuire",
      "Protecție juridică",
      "Daune proprii",
    ],
    color: "purple",
  },
  {
    icon: Building2,
    id: "business",
    title: "Asigurare Business",
    tagline: "Protecție completă pentru afacerea ta",
    desc: "Asigurare complexă pentru companii: proprietăți, răspundere civilă, angajați și business interruption.",
    estPrice: "Personalizat",
    features: [
      "Proprietăți și stocuri",
      "Răspundere civilă generală",
      "Asigurare angajați (grupuri)",
      "Business interruption",
      "Cyber asigurare",
      "Directors & Officers (D&O)",
    ],
    color: "zinc",
  },
];

const colorMap: Record<string, { border: string; icon: string; badge: string }> = {
  amber: { border: "border-amber-500/20 hover:border-amber-500/40", icon: "text-amber-400", badge: "bg-amber-500/10 text-amber-400" },
  red: { border: "border-red-500/20 hover:border-red-500/40", icon: "text-red-400", badge: "bg-red-500/10 text-red-400" },
  emerald: { border: "border-emerald-500/20 hover:border-emerald-500/40", icon: "text-emerald-400", badge: "bg-emerald-500/10 text-emerald-400" },
  blue: { border: "border-blue-500/20 hover:border-blue-500/40", icon: "text-blue-400", badge: "bg-blue-500/10 text-blue-400" },
  purple: { border: "border-purple-500/20 hover:border-purple-500/40", icon: "text-purple-400", badge: "bg-purple-500/10 text-purple-400" },
  zinc: { border: "border-zinc-600/30 hover:border-zinc-500/50", icon: "text-zinc-300", badge: "bg-zinc-800 text-zinc-300" },
};

export default function InsurancePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-20 py-12">
      {/* Header */}
      <section className="space-y-6 max-w-3xl">
        <span className="inline-block text-xs uppercase tracking-[0.2em] text-amber-500/80 border border-amber-500/20 rounded-full px-3 py-1">
          AiX OS · AI Insurance Advisor
        </span>
        <h1 className="text-4xl md:text-5xl font-light text-white leading-[1.1]">
          Asigurare Inteligentă<br />
          <span className="gradient-gold">Comparată și Optimizată cu AI</span>
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed">
          Comparăm ofertele de la cei mai mari asigurători din România și îți recomandăm cea
          mai bună acoperire la prețul corect. Consultanță gratuită, fără presiune de vânzare.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-amber-500/90 px-7 py-3.5 text-sm font-medium text-black hover:bg-amber-400 transition-all">
            Consultanță Gratuită AI
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/calculators" className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-7 py-3.5 text-sm text-zinc-300 hover:border-amber-500/30 transition-all">
            Calculator Asigurare →
          </Link>
        </div>
      </section>

      {/* Product cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-light text-white">Produse de asigurare</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRODUCTS.map((p) => {
            const Icon = p.icon;
            const c = colorMap[p.color];
            return (
              <div key={p.id} className={`rounded-2xl border bg-zinc-900/30 p-6 space-y-4 transition-all ${c.border}`}>
                <div className="flex items-start justify-between">
                  <div className={`rounded-xl bg-zinc-800 p-2.5`}>
                    <Icon className={`h-5 w-5 ${c.icon}`} />
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${c.badge}`}>
                    {p.estPrice}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">{p.title}</h3>
                  <p className="text-xs text-zinc-500 mb-2">{p.tagline}</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">{p.desc}</p>
                </div>
                <ul className="space-y-1.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="text-xs text-zinc-400">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact"
                  className="block w-full rounded-full border border-zinc-700 py-2.5 text-center text-xs text-zinc-300 hover:border-amber-500/30 hover:text-white transition-all">
                  Solicită Ofertă →
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why AiX Insurance */}
      <section className="rounded-3xl border border-zinc-800 bg-zinc-900/20 p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-light text-white">
              De ce să folosești AiX OS Insurance Advisor?
            </h2>
            <ul className="space-y-4">
              {[
                ["Comparare automată", "Analizăm ofertele de la 15+ asigurători în câteva secunde."],
                ["Fără conflict de interes", "Nu suntem agenți ai niciunui asigurător. Recomandăm ce e mai bun pentru tine."],
                ["AI-powered matching", "Profilul tău de risc este analizat și asociat cu produsul optim."],
                ["Consultanță post-vânzare", "Te ajutăm cu dosare de daune și reînnoiri. Nu dispărem după semnare."],
                ["Pachete combinate", "Discount de până la 20% dacă combini mai multe tipuri de asigurare."],
              ].map(([title, desc]) => (
                <li key={title} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white">{title}</p>
                    <p className="text-sm text-zinc-400">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
              <p className="text-sm font-medium text-white">Solicită consultanță asigurare</p>
              <InsuranceLeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* PAD Note */}
      <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 flex gap-4">
        <Shield className="h-6 w-6 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-400 mb-1">PAD — Asigurarea Obligatorie a Locuinței</p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Toate proprietățile rezidențiale din România trebuie să dețină o poliță PAD obligatorie.
            Suma asigurată minimă: 20.000 EUR (case de tip A) sau 10.000 EUR (tip B). Prima: ~20–100 EUR/an.
            AiX OS te ajută să obții polița rapid și să o completezi cu o asigurare facultativă adecvată.
          </p>
          <Link href="/contact" className="inline-block mt-3 text-sm text-amber-400 hover:text-amber-300 transition-colors">
            Solicită poliță PAD →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-8 max-w-4xl mx-auto pt-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-light text-white">Întrebări Frecvente</h2>
          <p className="text-zinc-400">Tot ce trebuie să știi despre asigurări.</p>
        </div>
        <div className="space-y-4">
          {[
            { q: "De ce să folosesc un broker și să nu merg direct la asigurător?", a: "Un broker (sau consultant AI) compară simultan toate ofertele din piață și negociază reduceri de volum, adesea obținând un preț mai mic decât dacă ai merge direct la compania de asigurări. De asemenea, te reprezentăm în cazul daunelor." },
            { q: "Ce este polița PAD și este obligatorie?", a: "Polița PAD este asigurarea obligatorie a locuinței care acoperă riscurile catastrofale: cutremur, inundații și alunecări de teren. Da, este obligatorie prin lege." },
            { q: "Pot asigura proprietăți premium la valoarea lor reală?", a: "Da, polițele standard au adesea limite mici. Pentru segmentul luxury, oferim polițe personalizate cu acoperiri specifice pentru artă, finisaje premium și daune de mare valoare." },
          ].map((faq, i) => (
            <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 space-y-2">
              <h3 className="font-medium text-white">{faq.q}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent p-10 text-center space-y-5">
        <Shield className="h-10 w-10 text-amber-500/60 mx-auto" />
        <h2 className="text-2xl md:text-3xl font-light text-white">Ești corect asigurat?</h2>
        <p className="text-zinc-400 max-w-md mx-auto text-sm">
          Mulți proprietari sunt sub-asigurați sau plătesc prea mult. O analiză gratuită de 15 minute îți poate salva mii de euro.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/contact" className="rounded-full bg-amber-500/90 px-8 py-3 text-sm font-medium text-black hover:bg-amber-400 transition-all">
            Analiză Gratuită
          </Link>
          <a href="https://wa.me/40000000000" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-8 py-3 text-sm text-zinc-300 hover:text-white transition-all">
            <MessageCircle className="h-4 w-4 text-emerald-400" />
            WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}

function InsuranceLeadForm() {
  return (
    <form action="mailto:contact@cristianvaduva.com" method="get" className="space-y-3">
      <input name="name" placeholder="Numele tău" required
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-amber-500/50 focus:outline-none transition-colors" />
      <input name="phone" placeholder="Telefon" required
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-amber-500/50 focus:outline-none transition-colors" />
      <select className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-300 focus:border-amber-500/50 focus:outline-none transition-colors">
        <option value="">Tipul asigurării dorite</option>
        <option>Asigurare Locuință</option>
        <option>Asigurare de Viață</option>
        <option>Asigurare Sănătate</option>
        <option>Asigurare Auto</option>
        <option>Asigurare Călătorie</option>
        <option>Asigurare Business</option>
        <option>Pachet combinat</option>
      </select>
      <button type="submit"
        className="w-full rounded-full bg-amber-500/90 py-2.5 text-sm font-medium text-black hover:bg-amber-400 transition-all">
        Solicită Consultanță Gratuită
      </button>
    </form>
  );
}

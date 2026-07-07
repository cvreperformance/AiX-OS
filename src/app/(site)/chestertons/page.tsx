import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { Building2, Globe, Bookmark, Award, ArrowUpRight, ShieldCheck, Landmark } from "lucide-react";

export const metadata: Metadata = {
  title: "Parteneriat Strategic Chestertons | AiX OS™",
  description: "Despre Chestertons — reper global istoric în consultanța imobiliară de lux și integrarea cu platforma AiX OS™.",
};

export default function ChestertonsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 space-y-16 animate-in">
      <PageHeader
        badge="Global Networks"
        title="Parteneriat Chestertons"
        subtitle="Unul dintre cele mai vechi și respectate branduri de consultanță imobiliară din lume, fondat în 1805 în Londra."
      />

      {/* Brand values grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Award, title: "Fondat în 1805", desc: "Peste două secole de expertiză neîntreruptă pe piața globală a proprietăților premium din Londra." },
          { icon: Globe, title: "Prezență Globală", desc: "O rețea extinsă de peste 120 de birouri repartizate strategic pe 5 continente." },
          { icon: Building2, title: "Lider Segment Lux", desc: "Specialiști recunoscuți în intermedieri de portofolii rezidențiale de lux și clădiri istorice." },
        ].map((item, idx) => (
          <div key={idx} className="rounded-2xl border border-zinc-850 bg-zinc-950/40 p-6 space-y-3 backdrop-blur-xl shadow-xl">
            <item.icon className="h-6 w-6 text-amber-500/80" />
            <h3 className="text-sm font-semibold text-white">{item.title}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout: Presence & Services */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Factual Summaries */}
        <div className="lg:col-span-7 space-y-8">
          <section className="space-y-3.5">
            <h2 className="text-lg font-light text-white flex items-center gap-2 border-b border-zinc-900 pb-2.5">
              <Landmark className="h-4.5 w-4.5 text-amber-500" />
              1. Global Presence & Markets
            </h2>
            <p className="text-xs text-zinc-450 leading-relaxed">
              Brandul <strong>Chestertons</strong> operează la nivel mondial cu o atenție sporită asupra piețelor imobiliare din <strong>Marea Britanie (UK)</strong>, <strong>Europa Occidentală</strong>, <strong>Orientul Mijlociu</strong> și **regiunile de tip Safe Haven** (Monaco, Elveția).
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-zinc-400 leading-relaxed">
              <li><strong>UK Market Dominance:</strong> Una dintre cele mai mari rețele de sucursale din Londra, oferind acces direct la proprietățile istorice din Chelsea, Kensington și Mayfair.</li>
              <li><strong>Middle East & Europe:</strong> Divizii dedicate de asistență pentru HNWI în Dubai, Abu Dhabi, Nisa și Monaco.</li>
              <li><strong>Licensing Strategy:</strong> Operează prin parteneriate strategice de franciză exclusivă cu entități autorizate local, respectând standardele profesionale RICS (Royal Institution of Chartered Surveyors).</li>
            </ul>
          </section>

          <section className="space-y-3.5">
            <h2 className="text-lg font-light text-white flex items-center gap-2 border-b border-zinc-900 pb-2.5">
              <ShieldCheck className="h-4.5 w-4.5 text-amber-500" />
              2. Servicii de Consultanță Integrată
            </h2>
            <p className="text-xs text-zinc-450 leading-relaxed">
              Chestertons oferă un spectru complet de asistență pentru tranzacții rezidențiale și comerciale de mare valoare:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-zinc-400 leading-relaxed">
              <li><strong>Intermediere Rezidențială:</strong> Servicii exclusiviste de listing și buyer representation pentru vile premium, penthouse-uri și conace.</li>
              <li><strong>Valuation & Advisory:</strong> Evaluări certificate conform standardelor globale RICS pentru raportări fiscale, garanții bancare și audituri de portofoliu.</li>
              <li><strong>Property Management:</strong> Administrarea completă a activelor imobiliare închirate pentru investitori internaționali de tip HNWI.</li>
            </ul>
          </section>
        </div>

        {/* Right Column: Why it matters in luxury & Connection */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-amber-500/20 bg-zinc-950/70 backdrop-blur-xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <h3 className="text-base font-light text-white flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-amber-500" />
              Conexiune cu AiX OS™
            </h3>
            
            <p className="text-xs text-zinc-400 leading-relaxed">
              Referențierea portofoliului Chestertons în platforma noastră de analiză aduce beneficii directe investitorilor:
            </p>

            <div className="space-y-3 text-xs leading-relaxed text-zinc-400">
              <div className="p-3 rounded-xl border border-zinc-900 bg-zinc-900/10">
                <span className="font-semibold text-white block mb-0.5">Sinergie de Portofoliu</span>
                Acces direct la ofertele exclusive listate sub marca Chestertons în zonele ultra-premium din București (Nordului, Herăstrău).
              </div>
              <div className="p-3 rounded-xl border border-zinc-900 bg-zinc-900/10">
                <span className="font-semibold text-white block mb-0.5">Filtru Riguros AiX Score</span>
                Proprietățile intermediate de agenții sub licență Chestertons obțin ratinguri înalte de siguranță juridică în modelul nostru IA.
              </div>
            </div>

            <a
              href="https://www.chestertons.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-amber-500 text-black py-3 text-xs font-semibold uppercase hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/10"
            >
              Accesează Chestertons Global
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

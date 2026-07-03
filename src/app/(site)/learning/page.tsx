"use client";

import {
  BookOpen,
  CheckCircle2,
  FileText,
  AlertOctagon,
  ShieldAlert,
  Search,
  Building,
  Key,
  TrendingUp,
  Download
} from "lucide-react";
import { designSystem } from "@/styles/designSystem";
import { PageHeader } from "@/components/ui";

export default function LearningPage() {
  const checklists = [
    {
      title: "Before Buying (Înainte de Achiziție)",
      icon: Key,
      color: "emerald",
      items: [
        "Setați un buget clar (inclusiv 10-15% marjă eroare, taxe, renovări).",
        "Obțineți pre-aprobarea de creditare (dacă este cazul).",
        "Analizați piața pentru prețul mediu real / mp în zonă.",
        "Verificați dacă infrastructura corespunde cu promisiunea (drumuri publice).",
      ]
    },
    {
      title: "Before Selling (Înainte de Vânzare)",
      icon: Building,
      color: "sky",
      items: [
        "Reparați viciile aparente (uși stricate, pete pe pereți).",
        "Eliberați proprietatea de mobilă masivă și lucruri personale.",
        "Pregătiți extrasul de CF pentru informare recent și certificatul energetic.",
        "Stabiliți un preț de listare ancorat în tranzacțiile recente din zonă, nu în speranțe.",
      ]
    },
    {
      title: "Întrebări Obligatorii (Questions to Ask)",
      icon: Search,
      color: "amber",
      items: [
        "De ce vinde actualul proprietar?",
        "Când a fost schimbată ultima dată instalația electrică / sanitară?",
        "Cine sunt vecinii și care este atmosfera generală în bloc?",
        "Există modificări interioare neînregistrate în planul cadastral?",
      ]
    },
    {
      title: "Red Flags (Steaguri Roșii)",
      icon: AlertOctagon,
      color: "red",
      items: [
        "Presiunea nejustificată de a da avans rapid, 'că mai sunt alți 5 la ușă'.",
        "Vânzătorul refuză tranzacția prin virament bancar sau cere cash nejustificat.",
        "Modificări structurale majore fărp autorizație (pereți de rezistență sparți).",
        "Preț mult sub media zonei, 'că se grăbește'.",
      ]
    },
    {
      title: "Greșeli Frecvente (Common Mistakes)",
      icon: ShieldAlert,
      color: "orange",
      items: [
        "Achiziția doar pe baza emoțiilor, ignorând calculele reci de rentabilitate.",
        "Omiterea verificării istoricului de litigii pentru proprietate sau dezvoltator.",
        "Nu se iau în calcul costurile de mentenanță viitoare.",
        "Subestimarea costului și timpului necesar pentru renovare.",
      ]
    },
    {
      title: "Documents Needed (Documente Necesare)",
      icon: FileText,
      color: "blue",
      items: [
        "Actele de proprietate (CVC, Moștenire, Donație).",
        "Extrasul de Carte Funciară și planul releveu.",
        "Certificat de atestare fiscală (impozite plătite la zi).",
        "Certificatul energetic (clasa A-G).",
      ]
    },
    {
      title: "Due Diligence & Inspecție",
      icon: CheckCircle2,
      color: "indigo",
      items: [
        "Apelați la un inginer structurist pentru clădirile mai vechi.",
        "Verificați izolația termică, mucegaiul ascuns (sub parchet / la colțuri).",
        "Măsurați dimensiunile camerelor pentru a corespunde cu releveul.",
        "Testați presiunea la apă și toate prizele electrice.",
      ]
    },
    {
      title: "Rental & Investment (Închirieri & Investiții)",
      icon: TrendingUp,
      color: "violet",
      items: [
        "Calculați randamentul net real, scăzând vacanța, reparațiile și taxele.",
        "Analizați polul de birouri din apropiere pentru cererea de chiriași.",
        "Efectuați background check pentru chiriași.",
        "Stabiliți prin contract un fond de reparații administrat de chiriaș sau o garanție fermă.",
      ]
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16 animate-in">
      <PageHeader
        badge="Education Hub"
        title="Centrul de Învățare"
        subtitle="Ghiduri practice și checklist-uri vitale. Fiecare punct ignorat de aici vă poate costa mii de euro. Protejați-vă deciziile investind 5 minute în educație."
      />

      {/* Grid of Checklists */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {checklists.map((list, idx) => {
          const Icon = list.icon;
          // Dynamically set some accent colors (in tailwind logic)
          const colorClassMap: Record<string, string> = {
            emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
            sky: "text-sky-400 bg-sky-500/10 border-sky-500/20",
            amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
            red: "text-red-400 bg-red-500/10 border-red-500/20",
            orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
            blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
            indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
            violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
          };
          const badgeClass = colorClassMap[list.color] || "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";

          return (
            <div key={idx} className={`p-6 rounded-3xl ${designSystem.glass} border-t border-zinc-800 flex flex-col`}>
              <div className="flex items-start gap-4 mb-5">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center border shrink-0 ${badgeClass}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="pt-1">
                  <h3 className="text-sm font-semibold text-white leading-tight">{list.title}</h3>
                </div>
              </div>
              <ul className="space-y-3 flex-1">
                {list.items.map((item, iIdx) => (
                  <li key={iIdx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-zinc-300 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-6 w-full py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-850 hover:text-white transition-all text-[10px] uppercase tracking-widest font-semibold text-zinc-400 flex items-center justify-center gap-2">
                <Download className="h-3.5 w-3.5" />
                Salvează PDF
              </button>
            </div>
          );
        })}
      </section>

      {/* Recommended Reading CTA */}
      <section>
        <div className={`p-8 sm:p-10 rounded-3xl border border-amber-500/20 bg-[#080808]/70 backdrop-blur-xl text-center space-y-4 relative overflow-hidden`}>
          <div className="absolute -left-20 -top-20 w-44 h-44 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
          <BookOpen className="h-7 w-7 text-amber-500/40 mx-auto" />
          <div>
            <h2 className="text-xl sm:text-2xl font-light text-white">Vrei să aprofundezi studiul?</h2>
            <p className="text-xs text-zinc-500 mt-2 max-w-md mx-auto leading-relaxed">
              Descoperă biblioteca noastră de cărți recomandate despre investiții, psihologia piețelor și negocieri de lux.
            </p>
          </div>
          <a
            href="/books"
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 text-black px-6 py-2.5 text-xs font-semibold hover:bg-amber-400 transition-all shadow-md shadow-amber-500/10 active:scale-95 mt-4"
          >
            Spre Biblioteca AiX
          </a>
        </div>
      </section>
    </div>
  );
}

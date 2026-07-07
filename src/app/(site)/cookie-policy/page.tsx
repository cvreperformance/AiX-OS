import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { ShieldCheck, Info, ToggleLeft, Cookie } from "lucide-react";

export const metadata: Metadata = {
  title: "Politica de Cookie-uri | AiX OS™",
  description: "Politica de cookie-uri și preferințe a platformei AiX OS™. Aflați cum folosim tehnologiile de stocare locală.",
};

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 space-y-12">
      <PageHeader
        badge="Legal & Conformitate"
        title="Politica de Cookie-uri"
        subtitle="Aflați cum utilizăm modulele cookie și tehnologiile similare de stocare locală pentru a vă îmbunătăți experiența de utilizare."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Cookie, title: "Cookie-uri Esențiale", desc: "Necesare pentru navigarea de bază, autentificare și securitatea formularelor." },
          { icon: ToggleLeft, title: "Opțiuni de Control", desc: "Puteți bloca sau șterge cookie-urile direct din setările browserului dvs." },
          { icon: ShieldCheck, title: "Fără Tracking Invaziv", desc: "Nu stocăm informații personale sensibile și nu utilizăm cookie-uri de publicitate agresivă." },
        ].map((item, idx) => (
          <div key={idx} className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-3">
            <item.icon className="h-6 w-6 text-amber-500/80" />
            <h3 className="text-base font-medium text-white">{item.title}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-invert max-w-none text-zinc-300 space-y-6 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-light text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
            <Info className="h-5 w-5 text-amber-500/80" />
            1. Ce sunt Cookie-urile?
          </h2>
          <p>
            Cookie-urile sunt fișiere de text de dimensiuni mici care sunt stocate pe computerul sau dispozitivul dvs. mobil atunci când vizitați un site web. Acestea permit site-ului să vă memoreze acțiunile și preferințele (cum ar fi autentificarea, setările lingvistice, dimensiunea caracterelor și alte preferințe de afișare) pentru o perioadă de timp, astfel încât să nu fie necesar să le reintroduceți de fiecare dată când reveniți la site sau navigați de la o pagină la alta.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-light text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
            <Info className="h-5 w-5 text-amber-500/80" />
            2. Cum Utilizăm Local Storage pe AiX OS™?
          </h2>
          <p>
            Pe lângă cookie-urile tradiționale, platforma <strong>AiX OS™</strong> utilizează memoria locală a browserului dvs. (<em>Local Storage</em>) pentru a vă memora opțiunile de interfață și respingerea bannerelor publicitare sau informative:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-400">
            <li>
              <strong>aix_banner_dismissed_ids</strong>: Memorează alert-urile și update-urile macroeconomice pe care le-ați respins din bara superioară rotativă, asigurându-ne că nu vă deranjăm cu aceleași notificări în mod repetat.
            </li>
            <li>
              <strong>aix_sticky_cta_dismissed</strong>: Păstrează data la care ați închis bara de consultanță din josul paginii, prevenind reafișarea acesteia timp de 3 zile.
            </li>
            <li>
              <strong>aix_popup_dismissed</strong>: Memorează data respingerii popup-ului principal de consultanță, evitând reafișarea lui timp de 7 zile.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-light text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
            <Info className="h-5 w-5 text-amber-500/80" />
            3. Tipuri de Cookie-uri pe care le folosim
          </h2>
          <p>
            Platforma noastră folosește două categorii mari de tehnologii:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li><strong>Strict Necesare:</strong> Fără de care modulele interactive precum calculatoarele de investiții sau contactul securizat cu partenerii noștri nu ar putea reține datele introduse.</li>
            <li><strong>Funcționale:</strong> Cele descrise la secțiunea de stocare locală, menite să optimizeze ritmul de afișare al interfețelor.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-light text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
            <Info className="h-5 w-5 text-amber-500/80" />
            4. Cum Puteți Controla Cookie-urile?
          </h2>
          <p>
            Puteți controla și/sau șterge cookie-urile după cum doriți – pentru detalii, consultați site-ul <a href="https://aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">aboutcookies.org</a>. Aveți posibilitatea de a șterge toate cookie-urile din computerul dvs. și puteți seta majoritatea browserelor să blocheze plasarea acestora. Cu toate acestea, dacă faceți acest lucru, este posibil să fiți nevoit să setați manual unele preferințe de fiecare dată când vizitați site-ul, iar unele servicii și funcționalități ar putea să nu funcționeze corect.
          </p>
        </section>
      </div>

      <div className="pt-6 border-t border-zinc-800 text-center text-xs text-zinc-500">
        Ultima actualizare: 1 Iulie 2026. Administrat de AiX OS™ Market Pulse.
      </div>
    </div>
  );
}

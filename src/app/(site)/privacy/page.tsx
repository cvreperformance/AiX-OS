import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { brandContent } from "@/lib/content/brand";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Politica de Confidențialitate | AiX OS™",
  description: "Politica de confidențialitate a platformei AiX OS™. Aflați cum vă protejăm și procesăm datele.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 space-y-12">
      <PageHeader
        badge="Legal & Conformitate"
        title="Politica de Confidențialitate"
        subtitle="Respectăm intimitatea dvs. și ne asigurăm că toate datele sunt securizate și procesate conform normelor europene."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Shield, title: "Conformitate GDPR", desc: "Datele dvs. sunt stocate și procesate în conformitate deplină cu directivele europene." },
          { icon: Lock, title: "Securitate Maximă", desc: "Folosim encriptare avansată și protocoale securizate în baza Supabase." },
          { icon: Eye, title: "Transparență Totală", desc: "Nu vindem și nu transmitem datele dvs. către terțe părți neautorizate." },
        ].map((item, idx) => (
          <div key={idx} className="rounded-2xl border border-zinc-200 bg-zinc-50/30 p-6 space-y-3">
            <item.icon className="h-6 w-6 text-amber-500/80" />
            <h3 className="text-base font-medium text-zinc-900">{item.title}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-invert max-w-none text-zinc-600 space-y-6 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-light text-zinc-900 flex items-center gap-2 border-b border-zinc-200 pb-2">
            <FileText className="h-5 w-5 text-amber-500/80" />
            1. Informații Generale
          </h2>
          <p>
            Această Politică de Confidențialitate descrie modul în care platforma <strong>AiX OS™</strong>, deținută și administrată în parteneriat cu <strong>{brandContent.name}</strong>, colectează, utilizează și protejează datele dvs. cu caracter personal atunci când accesați site-ul nostru și serviciile asociate.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-light text-zinc-900 flex items-center gap-2 border-b border-zinc-200 pb-2">
            <FileText className="h-5 w-5 text-amber-500/80" />
            2. Datele pe care le colectăm
          </h2>
          <p>
            Colectăm datele pe care ni le furnizați direct prin formularele noastre de contact, cererile de consultanță imobiliară sau calculatoarele de investiții:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li>Numele și prenumele</li>
            <li>Numărul de telefon și adresa de e-mail</li>
            <li>Detalii despre bugetul și preferințele dvs. imobiliare (Monaco, Dubai, București)</li>
            <li>Mesaje suplimentare furnizate prin formulare securizate JotForm sau direct prin WhatsApp</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-light text-zinc-900 flex items-center gap-2 border-b border-zinc-200 pb-2">
            <FileText className="h-5 w-5 text-amber-500/80" />
            3. Scopul Procesării Datelor
          </h2>
          <p>
            Datele furnizate sunt procesate exclusiv în următoarele scopuri:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li>Stabilirea unei consultații gratuite de 30 de minute cu Cristian Văduva</li>
            <li>Trimiterea de oferte și oportunități imobiliare off-market conforme cu solicitarea dvs.</li>
            <li>Calcularea parametrilor de finanțare și asigurări prin modulele noastre interactive</li>
            <li>Asigurarea bunei funcționări și securității tehnice a platformei</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-light text-zinc-900 flex items-center gap-2 border-b border-zinc-200 pb-2">
            <FileText className="h-5 w-5 text-amber-500/80" />
            4. Drepturile Dvs. (GDPR)
          </h2>
          <p>
            Conform Regulamentului General privind Protecția Datelor (GDPR), beneficiați de următoarele drepturi:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li>Dreptul de acces la datele dvs. stocate</li>
            <li>Dreptul la rectificarea sau actualizarea datelor incorecte</li>
            <li>Dreptul la ștergerea datelor („dreptul de a fi uitat”)</li>
            <li>Dreptul de a solicita restricționarea procesării sau de a vă opune acesteia</li>
            <li>Dreptul la portabilitatea datelor</li>
          </ul>
          <p className="mt-2">
            Pentru orice solicitare legată de datele dvs., ne puteți contacta direct la e-mailul oficial:{" "}
            <a href={`mailto:${brandContent.contact.email}`} className="text-amber-400 hover:underline">
              {brandContent.contact.email}
            </a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-light text-zinc-900 flex items-center gap-2 border-b border-zinc-200 pb-2">
            <FileText className="h-5 w-5 text-amber-500/80" />
            5. Securitate și Perioada de Păstrare
          </h2>
          <p>
            Păstrăm datele dvs. doar atât timp cât este necesar pentru îndeplinirea scopurilor menționate în această politică, dar nu mai mult de 3 ani de la ultima interacțiune activă, cu excepția cazului în care există o obligație legală contrară. Toate datele colectate prin intermediul API-urilor noastre securizate sunt stocate într-o infrastructură protejată.
          </p>
        </section>
      </div>

      <div className="pt-6 border-t border-zinc-200 text-center text-xs text-zinc-400">
        Ultima actualizare: 1 Iulie 2026. Administrat de AiX OS™ Market Pulse.
      </div>
    </div>
  );
}

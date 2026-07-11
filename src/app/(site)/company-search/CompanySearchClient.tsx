"use client";

import { useLanguage } from "@/context/LanguageContext";
import { designSystem } from "@/styles/designSystem";
import { Search, ExternalLink, ShieldAlert, Award, FileSpreadsheet, Briefcase, Landmark } from "lucide-react";

export default function CompanySearchClient() {
  const { language } = useLanguage();

  const registriesRO = [
    {
      title: "ONRC Infodebit / Portal",
      desc: "Registrul oficial al Comerțului din România. Utilizat pentru rapoarte de istoric asociați, verificarea capitalului social și a stării firmei (dizolvată, activă, insolvență).",
      url: "https://portal.onrc.ro/",
      purpose: "Legal Verification",
      icon: Briefcase,
    },
    {
      title: "ANAF Registrul TVA",
      desc: "Instrument oficial guvernamental pentru a verifica dacă o companie este plătitoare de TVA sau dacă are codul de TVA anulat din oficiu.",
      url: "https://www.anaf.ro/RegistruTVA/",
      purpose: "Tax Status Check",
      icon: Landmark,
    },
    {
      title: "ANAF Obligații Restante",
      desc: "Portalul pentru verificarea firmelor care înregistrează datorii fiscale restante către bugetul de stat din România.",
      url: "https://www.anaf.ro/restante/",
      purpose: "Solvency Check",
      icon: ShieldAlert,
    },
    {
      title: "Portalul Instanțelor (Just.ro)",
      desc: "Căutare după numele firmei pentru a identifica litigii active, procese comerciale, dosare de executare silită sau falimente.",
      url: "http://portal.just.ro/",
      purpose: "Litigation Audit",
      icon: FileSpreadsheet,
    },
  ];

  const registriesEU = [
    {
      title: "VIES VAT Number Validation",
      desc: "Sistemul oficial al Comisiei Europene pentru validarea codurilor de TVA intracomunitare. Esențial pentru facturarea transfrontalieră în UE.",
      url: "https://ec.europa.eu/taxation_customs/vies/",
      purpose: "TVA Intracomunitar",
      icon: Award,
    },
    {
      title: "European Business Register (EBR)",
      desc: "Acces la date oficiale despre companii din peste 20 de state europene: acționari, istoric legal și documente depuse.",
      url: "https://www.ebr.org/",
      purpose: "EU Company Registry",
      icon: Briefcase,
    },
    {
      title: "EU Insolvency Register",
      desc: "Baza de date unificată pentru căutarea procedurilor de insolvență deschise împotriva companiilor active în Uniunea Europeană.",
      url: "https://e-justice.europa.eu/content_insolvency_registers-110-en.do",
      purpose: "Solvency Audit",
      icon: ShieldAlert,
    },
  ];

  const translatedRO = registriesRO.map((r, idx) => {
    if (language === "ro") return r;
    const descMap = [
      "Official Trade Register portal in Romania. Used to fetch shareholder background sheets, check social capital, and trace corporate status (active, dissolved, bankrupt).",
      "Official government database to check if a local entity is a registered VAT payer or has had its VAT registration cancelled.",
      "ANAF Tax Debts Registry. Public registry listing corporations with outstanding tax debts or federal fiscal obligations.",
      "Ministry of Justice Courts Portal. Lookup active court cases, commercial disputes, asset foreclosures, and corporate lawsuits."
    ];
    return { ...r, desc: descMap[idx] };
  });

  const translatedEU = registriesEU.map((r, idx) => {
    if (language === "ro") return r;
    const descMap = [
      "European Commission VAT information system. Verify valid VAT registration numbers across EU countries for cross-border billing.",
      "Gateway offering access to official company details from over 20 European jurisdictions: directors, filings, and balance sheets.",
      "European e-Justice insolvency database. Search unified insolvency cases opened against legal entities operating in EU countries."
    ];
    return { ...r, desc: descMap[idx] };
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16 animate-in">
      {/* Header */}
      <section className="space-y-6 max-w-3xl">
        <span className="inline-block text-xs uppercase tracking-[0.2em] text-amber-500/80 border border-amber-500/20 rounded-full px-3 py-1">
          {language === "ro" ? "AiX OS™ · Verificare Companii" : "AiX OS™ · Business Lookup"}
        </span>
        <h1 className="text-4xl md:text-5xl font-light text-zinc-900 leading-tight">
          {language === "ro" ? "Rapoarte Clienți &" : "Corporate Intelligence &"} <br />
          <span className="gradient-gold">{language === "ro" ? "Verificări Firme Oficiale" : "Business Registries"}</span>
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          {language === "ro"
            ? "Verifică starea fiscală, asociații și solvabilitatea partenerilor de afaceri înainte de a semna un contract sau de a efectua plăți de tranzacție."
            : "Verify corporate solvency, active shareholders, litigation risk, and fiscal status before executing high-value business deals."}
        </p>
      </section>

      {/* Romania Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-zinc-200 pb-3">
          <span className="text-xl">🇷🇴</span>
          <h2 className="text-lg font-light text-zinc-900 uppercase tracking-wider">
            {language === "ro" ? "Verificare Firme România" : "Romania Company Lookup"}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {translatedRO.map((res) => {
            const Icon = res.icon;
            return (
              <div key={res.title} className={`p-6 rounded-3xl ${designSystem.glass} ${designSystem.glassHover} flex flex-col justify-between min-h-[200px]`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest border border-zinc-200 px-2 py-0.5 rounded-full bg-white/20">
                      {res.purpose}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">{res.title}</h3>
                    <p className="text-xs text-zinc-455 leading-relaxed mt-2">{res.desc}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-zinc-200/60 mt-4">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-amber-500/70 hover:text-amber-400 font-semibold transition-colors"
                  >
                    {language === "ro" ? "Caută Firmă" : "Lookup Business"}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Europe Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-zinc-200 pb-3">
          <span className="text-xl">🇪🇺</span>
          <h2 className="text-lg font-light text-zinc-900 uppercase tracking-wider">
            {language === "ro" ? "Registre Europene de Business" : "European Business Registries"}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {translatedEU.map((res) => {
            const Icon = res.icon;
            return (
              <div key={res.title} className={`p-6 rounded-3xl ${designSystem.glass} ${designSystem.glassHover} flex flex-col justify-between min-h-[200px]`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest border border-zinc-200 px-2 py-0.5 rounded-full bg-white/20">
                      {res.purpose}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">{res.title}</h3>
                    <p className="text-xs text-zinc-455 leading-relaxed mt-2">{res.desc}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-zinc-200/60 mt-4">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-400/80 hover:text-blue-400 font-semibold transition-colors"
                  >
                    {language === "ro" ? "Verifică Cod" : "Verify Register"}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

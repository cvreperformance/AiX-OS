"use client";

import { useLanguage } from "@/context/LanguageContext";
import { designSystem } from "@/styles/designSystem";
import { Link as LinkIcon, ExternalLink, Shield, Building, Scale, Landmark, FileText, Globe } from "lucide-react";

export default function ResourcesClient() {
  const { language } = useLanguage();

  const resourcesRO = [
    {
      title: "ANCPI (eTerra)",
      desc: "Agenția Națională de Cadastru și Publicitate Imobiliară. Utilizată pentru extrase de carte funciară, verificarea proprietarilor legali și intabulări.",
      url: "https://www.ancpi.ro/",
      category: "Real Estate",
      icon: Building,
    },
    {
      title: "ONRC",
      desc: "Oficiul Național al Registrului Comerțului. Baza oficială pentru verificarea existenței firmelor românești, a stării juridice și a acționarilor.",
      url: "https://www.onrc.ro/",
      category: "Business",
      icon: Scale,
    },
    {
      title: "ANAF Registry",
      desc: "Verificare stare de inactivitate fiscală, obligații restante și înregistrare în scopuri de TVA a partenerilor de tranzacție.",
      url: "https://www.anaf.ro/RegistruTVA/",
      category: "Tax & Finance",
      icon: Landmark,
    },
    {
      title: "PMB Urbanism",
      desc: "Directia de Urbanism Primăria București. Planuri Urbanistice Zonale (PUZ), regulamente locale și certificate de urbanism active.",
      url: "https://www.pmb.ro/",
      category: "Real Estate",
      icon: Shield,
    },
    {
      title: "SEAP (Sicap)",
      desc: "Sistemul Electronic de Achiziții Publice. Monitorizarea licitațiilor publice, achizițiilor guvernamentale și proiectelor de infrastructură.",
      url: "http://e-licitatie.ro/",
      category: "Public Sector",
      icon: FileText,
    },
    {
      title: "Ministerul Finanțelor",
      desc: "Verificare bilanțuri contabile anuale, profitabilitate firmă și indicatori de capital depuși oficial.",
      url: "https://mfinante.gov.ro/",
      category: "Tax & Finance",
      icon: Landmark,
    },
  ];

  const resourcesEU = [
    {
      title: "Eurostat",
      desc: "Oficiul de Statistică al Uniunii Europene. Date macroeconomice comparate, inflație, indici imobiliari europeni și demografie.",
      url: "https://ec.europa.eu/eurostat/",
      category: "Macro Intelligence",
      icon: Globe,
    },
    {
      title: "ECB (Central Bank)",
      desc: "Banca Centrală Europeană. Rata dobânzilor de referință EURIBOR, decizii de politică monetară din Zona Euro și prognoze economice.",
      url: "https://www.ecb.europa.eu/",
      category: "Macro Intelligence",
      icon: Landmark,
    },
    {
      title: "EUR-Lex",
      desc: "Acces direct și oficial la legislația Uniunii Europene, tratate fundamentale și jurisprudența Curții de Justiție (CJUE).",
      url: "https://eur-lex.europa.eu/",
      category: "Legal & Treaties",
      icon: FileText,
    },
    {
      title: "ESMA",
      desc: "Autoritatea Europeană pentru Valori Mobiliare și Piețe. Reglementări financiare, protecția investitorilor în piețe de capital.",
      url: "https://www.esma.europa.eu/",
      category: "Legal & Treaties",
      icon: Shield,
    },
    {
      title: "European Data Portal",
      desc: "Seturi de date publice din Uniunea Europeană referitoare la transporturi, mediu, economie și administrații locale.",
      url: "https://data.europa.eu/",
      category: "Public Sector",
      icon: FileText,
    },
  ];

  const resourcesRO_EN = resourcesRO.map((r, idx) => {
    if (language === "ro") return r;
    const descMap = [
      "National Agency for Cadastre and Land Registry. Used to fetch land registry documents, legal owner records, and property boundaries.",
      "National Trade Register Office. Official database to verify Romanian company details, legal status, and active shareholders.",
      "ANAF Tax Registry. Lookup fiscal inactivity status, outstanding tax liabilities, and VAT registration of transaction partners.",
      "Bucharest Municipality Urbanism Department. Zoning regulations (PUZ), building permissions, and active urban planning certs.",
      "SEAP Procurement System. Electronic Public Procurement System monitoring state auctions, tenders, and municipal projects.",
      "Ministry of Finance. Check annual balance sheets, profitability metrics, and officially declared financial statements."
    ];
    return { ...r, desc: descMap[idx] };
  });

  const resourcesEU_EN = resourcesEU.map((r, idx) => {
    if (language === "ro") return r;
    const descMap = [
      "Statistical Office of the European Union. Comparative macroeconomic charts, inflation indices, European housing metrics, and demographics.",
      "European Central Bank. Eurozone policy interest rate decisions, EURIBOR benchmarks, monetary policy, and macro forecasts.",
      "EUR-Lex Portal. Direct access to European Union law, fundamental treaties, regulations, and Court of Justice case law.",
      "European Securities and Markets Authority. Capital markets regulator, investor protection directives, and EU-wide watchlists.",
      "European Data Portal. Open public datasets from EU institutions covering transportation, environmental registers, and local economies."
    ];
    return { ...r, desc: descMap[idx] };
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16 animate-in">
      {/* Header */}
      <section className="space-y-6 max-w-3xl">
        <span className="inline-block text-xs uppercase tracking-[0.2em] text-amber-500/80 border border-amber-500/20 rounded-full px-3 py-1">
          {language === "ro" ? "AiX OS · Registre Publice" : "AiX OS · Public Registries"}
        </span>
        <h1 className="text-4xl md:text-5xl font-light text-white leading-tight">
          {language === "ro" ? "Registre Imobiliare &" : "Property Registries &"} <br />
          <span className="gradient-gold">{language === "ro" ? "Resurse Publice Directe" : "Public Government Hub"}</span>
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          {language === "ro"
            ? "Blueprints și puncte de acces direct către bazele de date oficiale din România și Uniunea Europeană pentru a asigura transparență maximă înainte de investiții."
            : "Direct access blueprints to official databases and records in Romania and the European Union to assure legal transparency before transactions."}
        </p>
      </section>

      {/* Romania Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
          <span className="text-xl">🇷🇴</span>
          <h2 className="text-lg font-light text-white uppercase tracking-wider">
            {language === "ro" ? "Registre Publice România" : "Romania Public Registries"}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resourcesRO_EN.map((res) => {
            const Icon = res.icon;
            return (
              <div key={res.title} className={`p-6 rounded-3xl ${designSystem.glass} ${designSystem.glassHover} flex flex-col justify-between min-h-[220px]`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest border border-zinc-900 px-2 py-0.5 rounded-full bg-zinc-950/20">
                      {res.category}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{res.title}</h3>
                    <p className="text-xs text-zinc-450 leading-relaxed mt-2">{res.desc}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-zinc-900/60 mt-4">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-amber-500/70 hover:text-amber-400 font-semibold transition-colors"
                  >
                    {language === "ro" ? "Accesează Portal" : "Open Registry"}
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
        <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
          <span className="text-xl">🇪🇺</span>
          <h2 className="text-lg font-light text-white uppercase tracking-wider">
            {language === "ro" ? "Resurse & Date Uniunea Europeană" : "European Union Registries"}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resourcesEU_EN.map((res) => {
            const Icon = res.icon;
            return (
              <div key={res.title} className={`p-6 rounded-3xl ${designSystem.glass} ${designSystem.glassHover} flex flex-col justify-between min-h-[220px]`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest border border-zinc-900 px-2 py-0.5 rounded-full bg-zinc-950/20">
                      {res.category}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{res.title}</h3>
                    <p className="text-xs text-zinc-450 leading-relaxed mt-2">{res.desc}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-zinc-900/60 mt-4">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-400/80 hover:text-blue-400 font-semibold transition-colors"
                  >
                    {language === "ro" ? "Accesează Portal" : "Open Registry"}
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

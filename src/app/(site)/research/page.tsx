"use client";

import { useState } from "react";
import {
  Search,
  Globe,
  Database,
  ShieldAlert,
  Server,
  Map as MapIcon,
  Briefcase,
  AlertTriangle,
  Lock,
  ExternalLink,
  Loader2,
  ShieldCheck,
  Building,
  TrendingUp,
  FileWarning,
  Scale,
  Landmark,
  Shield,
  FileText
} from "lucide-react";
import { designSystem } from "@/styles/designSystem";
import { PageHeader } from "@/components/ui";

interface OsintReport {
  companyName: string;
  cui: string;
  status: string;
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  lawsuitsCount: number;
  taxDebts: string;
  foundedYear: string;
  findings: string[];
}


export default function ResearchCenterPage() {

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState("");
  const [report, setReport] = useState<OsintReport | null>(null);

  
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

  const osintCategories = [

    {
      title: "Cercetare Companii și Asociați",
      icon: Briefcase,
      desc: "Investigați istoricul companiilor dezvoltatoare, datoriile la stat și conexiunile acționarilor.",
      links: [
        { name: "Termene.ro", url: "https://termene.ro", desc: "Date financiare și juridice companii RO" },
        { name: "Listă Firme", url: "https://www.listafirme.ro", desc: "Bilanțuri și asociați" },
        { name: "ONRC Portal", url: "https://portal.onrc.ro", desc: "Registrul Comerțului Oficial" },
        { name: "ANAF Registre", url: "https://www.anaf.ro/anaf/internet/ANAF/informatii_publice/", desc: "Datorii și stadiu fiscal" },
      ]
    },
    {
      title: "Infrastructură Digitală & Domenii",
      icon: Server,
      desc: "Verificați vechimea domeniilor web ale dezvoltatorilor și istoricul site-urilor lor.",
      links: [
        { name: "RoTLD WHOIS", url: "https://www.rotld.ro/whois/", desc: "Verificare proprietar domeniu .ro" },
        { name: "ICANN Lookup", url: "https://lookup.icann.org/", desc: "Domenii internaționale (.com, .eu)" },
        { name: "Wayback Machine", url: "https://archive.org/web/", desc: "Istoricul formelor vechi ale site-urilor" },
        { name: "DNS Dumpster", url: "https://dnsdumpster.com/", desc: "Analiză înregistrări DNS" },
      ]
    },
    {
      title: "Sisteme Geospațiale",
      icon: MapIcon,
      desc: "Analizați terenurile, planurile urbanistice și vecinătățile utilizând sateliți și registre publice.",
      links: [
        { name: "Geoportal ANCPI", url: "https://geoportal.ancpi.ro/", desc: "Suprapunere cadastru pe hartă" },
        { name: "Google Earth Pro", url: "https://earth.google.com/", desc: "Istoric imagini satelitare anuale" },
        { name: "Urbanism PMB", url: "https://urbanism.pmb.ro/", desc: "Planuri urbanistice București" },
      ]
    },
    {
      title: "Jurisprudență & Instanțe",
      icon: Database,
      desc: "Căutați posibile litigii comerciale sau plângeri pe rol împotriva agențiilor sau constructorilor.",
      links: [
        { name: "Portalul Instanțelor", url: "http://portal.just.ro/", desc: "Dosare civile și penale în România" },
        { name: "Rolii.ro", url: "http://www.rolii.ro/", desc: "Baza de date jurisprudență" },
      ]
    }
  ];

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setReport(null);
    setScanStep("Conectare la serverul securizat AiX OS™INT...");

    setTimeout(() => {
      setScanStep("Interogare baze de date ANAF & Stare Fiscală...");
      setTimeout(() => {
        setScanStep("Scanare dosare portal.just.ro (Litigii active)...");
        setTimeout(() => {
          setScanStep("Verificare structură acționari ONRC...");
          setTimeout(() => {
            const inputLower = query.toLowerCase();
            let mockReport: OsintReport;

            if (inputLower.includes("one") || inputLower.includes("united")) {
              mockReport = {
                companyName: "ONE UNITED PROPERTIES S.A.",
                cui: "RO22767862",
                status: "Activă / Solvabilă (Listată BVB)",
                riskScore: 92,
                riskLevel: "low",
                lawsuitsCount: 3,
                taxDebts: "Fără obligații fiscale restante",
                foundedYear: "2007",
                findings: [
                  "Capital social solid, lichiditate ridicată.",
                  "Litigiile comerciale identificate sunt de tip civil curent în limitele standard operaționale.",
                  "Transparență sporită datorată reglementărilor pieței de capital.",
                  "Certificare ESG și dezvoltare exclusiv sustenabilă."
                ]
              };
            } else if (inputLower.includes("phantom") || inputLower.includes("teap") || inputLower.includes("scam")) {
              mockReport = {
                companyName: "DEVELOPMENT CONSTRUCT S.R.L.",
                cui: "RO99882211",
                status: "Risc Insolvență Ridicat / Sediu expirat",
                riskScore: 28,
                riskLevel: "high",
                lawsuitsCount: 14,
                taxDebts: "185,400 RON restante la bugetul de stat",
                foundedYear: "2024",
                findings: [
                  "Companie înființată recent, fără istoric operațional demonstrat.",
                  "Litigii active pentru neplată subcontractori și litigiu pe titlu proprietate teren.",
                  "Sediu social declarat într-un apartament rezidențial de tip paravan.",
                  "Divergențe majore în planul de intabulare cadastrală."
                ]
              };
            } else {
              // General mock generated based on query
              const hash = query.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
              const isEven = hash % 2 === 0;
              mockReport = {
                companyName: `${query.toUpperCase()} S.R.L.`,
                cui: `RO${hash}3849`,
                status: "Activă",
                riskScore: isEven ? 81 : 62,
                riskLevel: isEven ? "low" : "medium",
                lawsuitsCount: isEven ? 0 : 2,
                taxDebts: isEven ? "Zero datorii restante" : "Obligații fiscale curente declarate",
                foundedYear: (2010 + (hash % 14)).toString(),
                findings: isEven
                  ? [
                      "Fără antecedente juridice sau litigii active identificate pe rol.",
                      "Bilanț financiar depus regulat, comportament fiscal corect.",
                      "Asociați fără alte firme în stare de faliment/lichidare."
                    ]
                  : [
                      "2 dosare comerciale active identificate în instanțele locale.",
                      "Obligații fiscale curente fără sechestre active.",
                      "Recomandăm due-diligence extins pe contractul de antrepriză."
                    ]
              };
            }

            setReport(mockReport);
            setLoading(false);
            setScanStep("");
          }, 400);
        }, 400);
      }, 400);
    }, 400);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16 animate-in">
      <PageHeader
        badge="Research & Intelligence"
        title="Research Center & OSINT"
        subtitle="Open-Source Intelligence (OSINT). Folosiți resurse publice și baze de date guvernamentale pentru un due diligence exhaustiv înainte de a semna orice contract."
      />

      {/* Intro Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`p-8 rounded-3xl ${designSystem.glass} relative overflow-hidden flex flex-col justify-center`}>
          <div className={designSystem.glowTop} />
          <h2 className="text-xl font-light text-zinc-900 mb-4">Ce este OSINT și de ce te salvează de faliment?</h2>
          <p className="text-sm text-zinc-400 leading-relaxed mb-4">
            În real estate-ul premium, riscurile nu se află în culorile pereților, ci în istoricul firmei dezvoltatoare. 
            Tehnicile de Open-Source Intelligence te învață cum să investighezi public și complet legal orice entitate.
          </p>
          <ul className="space-y-3 mt-4">
            {[
              "Descoperi firmele 'fantomă' create cu o lună înainte de șantier.",
              "Vezi datorii la stat, sechestre sau popriri.",
              "Afli dacă dezvoltatorul mai are 10 firme închise prin faliment.",
              "Vedeți exact planul cadastral și limitele reale, nu cele povestite."
            ].map((benefit, i) => (
              <li key={i} className="flex items-start gap-3">
                <ShieldAlert className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-xs text-zinc-600 leading-relaxed">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Interactive OSINT Lookup tool */}
        <div className={`p-8 rounded-3xl border border-zinc-200 bg-white flex flex-col justify-between relative overflow-hidden min-h-[360px]`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl" />
          
          <div className="space-y-4 text-center">
            <Globe className="h-10 w-10 text-amber-500/50 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">Căutare Rapidă Entități</h3>
              <p className="text-xs text-zinc-400 mt-2 max-w-sm mx-auto">
                Introduceți CUI-ul sau numele dezvoltatorului imobiliar pentru a efectua o scanare preliminară instantă.
              </p>
            </div>
          </div>
          
          {!report && !loading && (
            <form onSubmit={handleScan} className="w-full max-w-sm mx-auto space-y-4 mt-6">
              <div className="relative">
                <input 
                  type="text" 
                  required
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ex: One United, RO22767862, CUI..." 
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-4 pr-12 text-sm text-zinc-900 placeholder-zinc-650 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </div>
              <button 
                type="submit"
                className="w-full rounded-xl bg-amber-500 text-black py-3 text-xs font-semibold uppercase tracking-wider hover:bg-amber-400 transition-all shadow-md shadow-amber-500/10"
              >
                Lansează Scanare OSINT
              </button>
            </form>
          )}

          {loading && (
            <div className="py-8 text-center space-y-4">
              <Loader2 className="h-8 w-8 text-amber-500 animate-spin mx-auto" />
              <p className="text-xs text-zinc-450 font-mono animate-pulse">{scanStep}</p>
            </div>
          )}

          {report && (
            <div className="space-y-4 mt-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                <div className="text-left">
                  <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                    <Building className="h-4 w-4 text-zinc-400" />
                    {report.companyName}
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">CUI: {report.cui} &bull; Fondat: {report.foundedYear}</p>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono border ${
                  report.riskLevel === "low"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : report.riskLevel === "medium"
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}>
                  Risk Score: {report.riskScore}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="p-3 bg-zinc-50/40 rounded-xl border border-zinc-200">
                  <span className="text-[9px] uppercase text-zinc-400 font-mono">Stare ANAF</span>
                  <p className="text-xs font-semibold text-zinc-900 mt-0.5">{report.status}</p>
                </div>
                <div className="p-3 bg-zinc-50/40 rounded-xl border border-zinc-200">
                  <span className="text-[9px] uppercase text-zinc-400 font-mono">Litigii Instanțe</span>
                  <p className="text-xs font-semibold text-zinc-900 mt-0.5">{report.lawsuitsCount} dosare pe rol</p>
                </div>
              </div>

              <div className="text-left p-3 bg-zinc-50/40 rounded-xl border border-zinc-200">
                <span className="text-[9px] uppercase text-zinc-400 font-mono">Datorii Bugetare</span>
                <p className="text-xs font-semibold text-zinc-900 mt-0.5">{report.taxDebts}</p>
              </div>

              <div className="text-left space-y-1.5">
                <span className="text-[9px] uppercase text-zinc-400 font-mono">Constatări Cheie:</span>
                <ul className="space-y-1">
                  {report.findings.map((f, i) => (
                    <li key={i} className="text-[11px] text-zinc-400 flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">&bull;</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    setReport(null);
                    setQuery("");
                  }}
                  className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 py-2.5 text-xs font-semibold uppercase hover:bg-zinc-200/80 transition-all"
                >
                  Nouă Căutare
                </button>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("open-contact-popup"))}
                  className="flex-1 rounded-xl bg-amber-500 text-black py-2.5 text-xs font-semibold uppercase hover:bg-amber-400 transition-all shadow-md"
                >
                  Solicită Raport Complet
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      
      {/* Directory of Links */}
      <section className="space-y-8 mb-16">
        <div className="flex items-center gap-3 border-b border-zinc-200 pb-4">
          <Database className="h-6 w-6 text-amber-500" />
          <h2 className="text-2xl font-light text-zinc-900">Registre Publice România</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resourcesRO.map((res) => {
            const Icon = res.icon || Globe;
            return (
              <div key={res.title} className="p-6 rounded-3xl bg-zinc-50/30 border border-zinc-200 flex flex-col justify-between min-h-[220px]">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest border border-zinc-200 px-2 py-0.5 rounded-full bg-white/20">
                      {res.category}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">{res.title}</h3>
                    <p className="text-xs text-zinc-450 leading-relaxed mt-2">{res.desc}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-zinc-200/60 mt-4">
                  <a href={res.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-amber-500/70 hover:text-amber-400 font-semibold transition-colors">
                    Accesează Portal <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-8 mb-16">
        <div className="flex items-center gap-3 border-b border-zinc-200 pb-4">
          <Globe className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-light text-zinc-900">Resurse & Date Uniunea Europeană</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resourcesEU.map((res) => {
            const Icon = res.icon || Globe;
            return (
              <div key={res.title} className="p-6 rounded-3xl bg-zinc-50/30 border border-zinc-200 flex flex-col justify-between min-h-[220px]">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest border border-zinc-200 px-2 py-0.5 rounded-full bg-white/20">
                      {res.category}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">{res.title}</h3>
                    <p className="text-xs text-zinc-450 leading-relaxed mt-2">{res.desc}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-zinc-200/60 mt-4">
                  <a href={res.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-blue-400/80 hover:text-blue-400 font-semibold transition-colors">
                    Accesează Portal <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Directory of Links */}

      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-zinc-200 pb-4">
          <Database className="h-6 w-6 text-amber-500" />
          <h2 className="text-2xl font-light text-zinc-900">Director de Resurse Publice</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {osintCategories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <div key={idx} className={`p-6 sm:p-8 rounded-3xl ${designSystem.glass} border-t border-zinc-200 flex flex-col h-full`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-zinc-50/80 flex items-center justify-center border border-zinc-200/50">
                    <Icon className="h-5 w-5 text-amber-400" />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900">{category.title}</h3>
                </div>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed">{category.desc}</p>
                
                <div className="space-y-3 flex-1">
                  {category.links.map((link, lIdx) => (
                    <a
                      key={lIdx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-zinc-200/40 bg-zinc-50/30 hover:bg-zinc-850 hover:border-zinc-300 transition-all gap-2"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <Globe className="h-4 w-4 text-zinc-600 group-hover:text-amber-500 transition-colors shrink-0" />
                        <span className="text-xs font-semibold text-zinc-600 truncate">{link.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-zinc-400 truncate">{link.desc}</span>
                        <ExternalLink className="h-3 w-3 text-zinc-600 shrink-0 group-hover:text-amber-500" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="p-6 sm:p-8 rounded-3xl border border-amber-500/20 bg-amber-500/5 flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-zinc-900 mb-1.5 flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-zinc-400" /> Avertisment Legal și Securitate (Privacy Policy)
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-4xl">
            Această pagină este exclusiv un agregator educațional de resurse deschise și publice pe internet (OSINT). AiX OS™ nu recoltează, nu stochează și nu interoghează automat pe serverele noastre aceste baze de date. Toate linkurile vă direcționează către sursele oficiale guvernamentale sau de investigație. Folosiți datele găsite cu responsabilitate și în acord cu legea GDPR.
          </p>
        </div>
      </section>
    </div>
  );
}

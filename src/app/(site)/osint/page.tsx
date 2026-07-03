"use client";

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
  ExternalLink
} from "lucide-react";
import { designSystem } from "@/styles/designSystem";
import { PageHeader } from "@/components/ui";

export default function OsintPage() {
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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16 animate-in">
      <PageHeader
        badge="Market Intelligence"
        title="Centrul de Comandă OSINT"
        subtitle="Open-Source Intelligence (OSINT). Folosiți resurse publice și baze de date guvernamentale pentru un due diligence exhaustiv înainte de a semna orice contract."
      />

      {/* Intro Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`p-8 rounded-3xl ${designSystem.glass} relative overflow-hidden flex flex-col justify-center`}>
          <div className={designSystem.glowTop} />
          <h2 className="text-xl font-light text-white mb-4">Ce este OSINT și de ce te salvează de faliment?</h2>
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
                <span className="text-xs text-zinc-300 leading-relaxed">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Simple OSINT Lookup tool mockup */}
        <div className={`p-8 rounded-3xl border border-zinc-800 bg-zinc-950 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl" />
          
          <Globe className="h-10 w-10 text-amber-500/50" />
          <div>
            <h3 className="text-lg font-semibold text-white">Căutare Rapidă Entități</h3>
            <p className="text-xs text-zinc-500 mt-2 max-w-sm mx-auto">
              (Modul Simulator) Căutarea va indexa curând rezultate agregate pentru persoană juridică pe plan local.
            </p>
          </div>
          
          <div className="w-full max-w-sm relative mt-4">
            <input 
              type="text" 
              placeholder="Ex: CUI, Nume Firmă, Domeniu web..." 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          </div>
          <button className="rounded-xl bg-zinc-800 text-zinc-300 px-6 py-2.5 text-xs font-semibold hover:bg-zinc-700 transition-all">
            Lansează Scanare (Inactiv)
          </button>
        </div>
      </section>

      {/* Directory of Links */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
          <Database className="h-6 w-6 text-amber-500" />
          <h2 className="text-2xl font-light text-white">Director de Resurse Publice</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {osintCategories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <div key={idx} className={`p-6 sm:p-8 rounded-3xl ${designSystem.glass} border-t border-zinc-800 flex flex-col h-full`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-zinc-900/80 flex items-center justify-center border border-zinc-800/50">
                    <Icon className="h-5 w-5 text-amber-400" />
                  </div>
                  <h3 className="text-base font-semibold text-white">{category.title}</h3>
                </div>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed">{category.desc}</p>
                
                <div className="space-y-3 flex-1">
                  {category.links.map((link, lIdx) => (
                    <a
                      key={lIdx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-zinc-800/40 bg-zinc-900/30 hover:bg-zinc-850 hover:border-zinc-700 transition-all gap-2"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <Globe className="h-4 w-4 text-zinc-600 group-hover:text-amber-500 transition-colors shrink-0" />
                        <span className="text-xs font-semibold text-zinc-300 truncate">{link.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-zinc-500 truncate">{link.desc}</span>
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
          <h4 className="text-sm font-semibold text-white mb-1.5 flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-zinc-400" /> Avertisment Legal și Securitate (Privacy Policy)
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-4xl">
            Această pagină este exclusiv un agregator educațional de resurse deschise și publice pe internet (OSINT). AiX OS nu recoltează, nu stochează și nu interoghează automat pe serverele noastre aceste baze de date. Toate linkurile vă direcționează către sursele oficiale guvernamentale sau de investigație. Folosiți datele găsite cu responsabilitate și în acord cu legea GDPR.
          </p>
        </div>
      </section>
    </div>
  );
}

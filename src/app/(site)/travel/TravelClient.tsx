"use client";

import { useLanguage } from "@/context/LanguageContext";
import { designSystem } from "@/styles/designSystem";
import { Plane, Compass, Globe, Info, ExternalLink, Calendar, MapPin } from "lucide-react";

export default function TravelClient() {
  const { language } = useLanguage();

  const services = [
    {
      title: language === "ro" ? "Aviație Privată (FBO Lookup)" : "Private Aviation & Jet Charters",
      desc: language === "ro"
        ? "Planificare zboruri charter la cerere. Căutare terminale private (FBO) în întreaga lume, companii aeriene de lux și costuri estimate."
        : "Plan custom charter flights. Global FBO terminal searches, private jet broker comparisons, and estimated routing costs.",
      icon: Plane,
      category: "Aviation",
      link: "https://www.flapper.aero/",
    },
    {
      title: language === "ro" ? "Ghid de Vize (Henley Passport)" : "Global Passport & Visa Index",
      desc: language === "ro"
        ? "Verificare cerințe de viză pe baza cetățeniei tale. Analiză libertate de circulație și proceduri de obținere vize de investitor (Golden Visa)."
        : "Look up visa requirements based on your citizenship. Access global passport rankings and active Golden Visa program guidelines.",
      icon: Globe,
      category: "Visa & Entry",
      link: "https://www.henleyglobal.com/passport-index",
    },
    {
      title: language === "ro" ? "Ghiduri de Țară Oficiale (MAE)" : "Ministry of Foreign Affairs Guides",
      desc: language === "ro"
        ? "Alerte de călătorie, starea frontierelor, condiții de intrare în țară și servicii de asistență consulară oferite de Ministerul Afacerilor Externe."
        : "Travel alerts, active border policies, visa requirements, and consular services database managed by Ministry of Foreign Affairs.",
      icon: Info,
      category: "Safety Alerts",
      link: "https://www.mae.ro/travel-alerts",
    },
    {
      title: language === "ro" ? "Planificatoare Itinerarii VIP" : "Premium Itinerary Planning",
      desc: language === "ro"
        ? "Platforme recomandate pentru planificarea de călătorii premium: cazări verificate, transport dedicat și ghiduri lifestyle locale."
        : "Curated concierge booking platforms: luxury hotel directories, private ground transport, and local lifestyle assistance.",
      icon: Compass,
      category: "Lifestyle Planning",
      link: "https://www.virtuoso.com/",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16 animate-in">
      {/* Header */}
      <section className="space-y-6 max-w-3xl">
        <span className="inline-block text-xs uppercase tracking-[0.2em] text-amber-500/80 border border-amber-500/20 rounded-full px-3 py-1">
          {language === "ro" ? "AiX OS · Mobilitate Globală" : "AiX OS · Global Mobility"}
        </span>
        <h1 className="text-4xl md:text-5xl font-light text-white leading-tight">
          {language === "ro" ? "Zboruri Private &" : "Private Aviation &"} <br />
          <span className="gradient-gold">{language === "ro" ? "Ghiduri de Călătorie VIP" : "Premium Global Travel"}</span>
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          {language === "ro"
            ? "Instrumente practice de mobilitate pentru a securiza deplasările tale internaționale. De la charter aerian la detalii administrative de graniță."
            : "Practical mobility resources to plan secure international trips. From private air charters to consular and golden visa parameters."}
        </p>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className={`p-6 rounded-3xl ${designSystem.glass} ${designSystem.glassHover} flex flex-col justify-between min-h-[200px]`}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest border border-zinc-900 px-2 py-0.5 rounded-full bg-zinc-950/20">
                    {s.category}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{s.title}</h3>
                  <p className="text-xs text-zinc-455 leading-relaxed mt-2">{s.desc}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-zinc-900/60 mt-4">
                <a
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-amber-500/70 hover:text-amber-400 font-semibold transition-colors"
                >
                  {language === "ro" ? "Deschide Portal" : "Access Resource"}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  EyeOff,
  Lock,
  Briefcase,
  Key,
  ShieldCheck,
  Send,
  User,
  Phone,
  Mail,
  Home
} from "lucide-react";
import { designSystem } from "@/styles/designSystem";
import { PageHeader } from "@/components/ui";

export default function OffMarketPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16 animate-in">
      <PageHeader
        badge="Confidentiality First"
        title="Tranzacții Off-Market"
        subtitle="Acces la proprietăți care nu vor fi niciodată listate public. Vindeți sau cumpărați în deplină confidențialitate prin circuitul închis AiX OS."
      />

      {/* Hero Explainer */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-500">
            <Lock className="h-3 w-3" /> Rețea Privată
          </div>
          <h2 className="text-3xl font-light text-white leading-tight">
            De ce cele mai bune oportunități sunt invizibile?
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            În segmentul premium și super-premium, proprietarii doresc discreție. Nu vor anunțuri pe portaluri publice, nu vor vizite de curiozitate și nu doresc expunerea prețului pe internet. Tranzacțiile off-market (în circuit închis) protejează atât vânzătorul cât și cumpărătorul.
          </p>
          
          <ul className="space-y-4 pt-2">
            {[
              { title: "Zero Amprentă Digitală", desc: "Proprietatea nu este afișată online. Nu există istoric de prețuri sau fotografii indexate pe Google." },
              { title: "Calificarea Părților (NDA)", desc: "Vizitele se fac doar după semnarea unui Acord de Confidențialitate și confirmarea bonității financiare." },
              { title: "Concurență Redusă", desc: "Cumpărătorii accesează active unice (penthouse-uri rare, terenuri strategice) fără licitații publice." }
            ].map((benefit, idx) => (
              <li key={idx} className="flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 mt-1">
                  <ShieldCheck className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{benefit.title}</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed mt-1">{benefit.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* NDA & Form Card */}
        <div className={`p-8 sm:p-10 rounded-3xl ${designSystem.glass} border border-zinc-800 relative overflow-hidden`}>
          <div className={designSystem.glowTop} />
          
          <div className="mb-8">
            <EyeOff className="h-8 w-8 text-amber-500 mb-4" />
            <h3 className="text-xl font-light text-white">Solicitare Acces Off-Market</h3>
            <p className="text-xs text-zinc-400 mt-2">
              Lăsați datele de contact și specificațiile căutării dumneavoastră. Un Private Broker AiX vă va contacta pentru semnarea NDA-ului.
            </p>
          </div>

          {submitted ? (
            <div className="h-[300px] flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in">
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <ShieldCheck className="h-8 w-8 text-emerald-500" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">Cerere Înregistrată Confidențial</h4>
                <p className="text-sm text-zinc-500 mt-2 max-w-xs mx-auto">
                  Veți fi contactat telefonic în maxim 24 de ore pentru validarea profilului.
                </p>
              </div>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-4 text-[11px] text-amber-500 font-semibold uppercase tracking-wider hover:text-amber-400"
              >
                Trimiteți altă cerere
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold pl-1">Nume Complet</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <input required type="text" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-600 focus:border-amber-500/50 focus:outline-none transition-colors" placeholder="Ion Popescu" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold pl-1">Telefon / WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <input required type="tel" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-600 focus:border-amber-500/50 focus:outline-none transition-colors" placeholder="+40 700 000 000" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold pl-1">Email Corporate/Personal</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                  <input required type="email" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-600 focus:border-amber-500/50 focus:outline-none transition-colors" placeholder="adresa@companie.com" />
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold pl-1">Ce fel de proprietate căutați/vindeți?</label>
                <div className="relative">
                  <Home className="absolute left-3.5 top-4 h-4 w-4 text-zinc-600" />
                  <textarea required rows={3} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-600 focus:border-amber-500/50 focus:outline-none transition-colors resize-none" placeholder="Ex: Caut Penthouse în zona Floreasca, buget 1.5M EUR. / Doresc să vând o vilă istorică în Primăverii..." />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-black py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  "Se trimite cererea securizată..."
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Solicită Acces Confidențial
                  </>
                )}
              </button>
              
              <p className="text-[9px] text-zinc-600 text-center px-4 pt-2">
                Prin trimiterea acestui formular vă dați acordul pentru a fi contactat de un broker autorizat. Datele sunt criptate și nu sunt partajate terților.
              </p>
            </form>
          )}
        </div>
      </section>
      
      {/* Target Audience */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-zinc-900 pt-12">
        <div className="space-y-2">
          <Briefcase className="h-5 w-5 text-zinc-500" />
          <h4 className="text-sm font-semibold text-white">Pentru Cumpărători</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">Acces la proprietăți excepționale care nu apar niciodată în listările publice sau pe site-urile agențiilor obișnuite.</p>
        </div>
        <div className="space-y-2">
          <Key className="h-5 w-5 text-zinc-500" />
          <h4 className="text-sm font-semibold text-white">Pentru Vânzători</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">Vindem proprietatea dumneavoastră direct bazei noastre de clienți calificați, fără a expune adresa sau prețul pe internet.</p>
        </div>
        <div className="space-y-2">
          <ShieldCheck className="h-5 w-5 text-zinc-500" />
          <h4 className="text-sm font-semibold text-white">Protecție Garantată</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">Toate detaliile financiare și vizitele sunt protejate prin acorduri de confidențialitate semnate în prealabil de ambele părți.</p>
        </div>
      </section>

    </div>
  );
}

"use client";

import Link from "next/link";
import { Gem, Globe, Clock, Phone, Star, ArrowRight, MessageCircle, Shield, Car, Ship, ShieldCheck } from "lucide-react";
import { designSystem } from "@/styles/designSystem";

const SERVICES = [
  { icon: Globe, title: "Relocare Internațională", desc: "Gestionăm complet relocarea ta sau a companiei tale. Proprietăți, școli premium și servicii administrative." },
  { icon: Gem, title: "Proprietăți Off-Market", desc: "Acces exclusiv la portofolii rezidențiale care nu apar niciodată pe listările publice." },
  { icon: Shield, title: "Due Diligence Premium", desc: "Verificare juridică și tehnică rapidă completată în sub 48h de experți calificați." },
  { icon: Clock, title: "Suport Dedicated 24/7", desc: "Lifestyle manager personal disponibil oricând, asigurând rezolvarea oricărei solicitări." },
  { icon: Star, title: "Networking UHNW", desc: "Acces cu invitație la dineurile private din cercurile de parteneri investitori AiX OS." },
  { icon: Phone, title: "Planificare Fiscală", desc: "Asistență în optimizare fiscală transfrontalieră pentru achiziții mari de active." },
];

export default function ConciergePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-20 py-12 animate-in">
      
      {/* Hero section */}
      <section className="space-y-6 max-w-3xl">
        <span className="inline-block text-xs uppercase tracking-[0.2em] text-amber-500/80 border border-amber-500/20 rounded-full px-3 py-1">
          AiX OS · Luxury Concierge Desk
        </span>
        <h1 className="text-4xl md:text-5xl font-light text-white leading-tight">
          Lifestyle Management & <br />
          <span className="gradient-gold">Mobilitate Premium Globală</span>
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          O singură poartă de acces pentru mobilitate privată terestră, maritimă și asistență imobiliară premium. Conceput exclusiv pentru deținătorii de portofolii HNWI și familii din cercurile noastre elite.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-contact-popup"))}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 text-black px-6 py-3 text-xs font-semibold uppercase hover:bg-amber-400 transition-all shadow-md shadow-amber-500/10"
          >
            <MessageCircle className="h-4 w-4" />
            Contact Privat Desk
          </button>
        </div>
      </section>

      {/* Services Grid */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SERVICES.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className={`rounded-3xl ${designSystem.glass} ${designSystem.glassHover} p-6 space-y-3`}>
              <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-400 w-fit">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">{s.title}</h3>
              <p className="text-xs text-zinc-450 leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </section>

      {/* Call to action */}
      <section className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent p-10 md:p-14 text-center space-y-5">
        <Gem className="h-10 w-10 text-amber-500/60 mx-auto" />
        <h2 className="text-2xl font-light text-white">Discreție și NDA asigurate</h2>
        <p className="text-xs text-zinc-500 max-w-md mx-auto">
          Toate intermedierile noastre lifestyle sunt acoperite de acorduri stricte de confidențialitate înainte de programarea itinerariului.
        </p>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-contact-popup"))}
          className="inline-block rounded-xl bg-amber-500 text-black px-8 py-3 text-xs font-semibold uppercase hover:bg-amber-400 transition-all shadow-md"
        >
          Programează Apel Consultativ
        </button>
      </section>
    </div>
  );
}

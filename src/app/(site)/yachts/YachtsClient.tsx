"use client";

import { Ship, ArrowRight } from "lucide-react";
import { designSystem } from "@/styles/designSystem";

const YACHTS = [
  { title: "Project X (88m)", price: "De la €1,100,000 / săpt", img: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=600&q=80", spec: "14 Oaspeți · 28 Echipaj · Helipad" },
  { title: "Kismet (95m)", price: "De la €1,200,000 / săpt", img: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=600&q=80", spec: "12 Oaspeți · 28 Echipaj · Spa Premium" },
  { title: "Benetti Oasis 40M (Monaco Port)", price: "De la €180,000 / săpt", img: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=600&q=80", spec: "Echipaj 9 · Capacitate 10 oaspeți" },
  { title: "Sunseeker 88 (Dubai Marina)", price: "De la 2.200 $ / zi", img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80", spec: "Cruiză zilnică · Flybridge extins" },
];

export function YachtsClient() {
  const openContact = () => window.dispatchEvent(new CustomEvent("open-contact-popup"));

  return (
    <>
      {/* Yachts Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {YACHTS.map((yacht) => (
          <div key={yacht.title} className={`rounded-3xl overflow-hidden ${designSystem.glass} ${designSystem.glassHover}`}>
            <div className="h-64 w-full overflow-hidden bg-zinc-900">
              <img src={yacht.img} alt={yacht.title} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="text-base font-medium text-white">{yacht.title}</h4>
                <span className="text-sm text-amber-400 font-mono font-semibold">{yacht.price}</span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">{yacht.spec}</p>
              <button
                onClick={openContact}
                className="w-full text-center py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                Detalii & Disponibilitate
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent p-10 md:p-14 text-center space-y-6">
        <Ship className="h-10 w-10 text-amber-500/60 mx-auto" />
        <h2 className="text-2xl md:text-3xl font-light text-white">Planifici un Yacht Charter?</h2>
        <p className="text-zinc-400 max-w-lg mx-auto">
          Consultanții noștri brokeri de yachting se vor ocupa de întregul itinerariu, selecția echipajului și logistica VIP.
        </p>
        <button
          onClick={openContact}
          className="inline-flex items-center gap-2 rounded-full bg-amber-500/90 px-8 py-3.5 text-sm font-medium text-black hover:bg-amber-400 transition-all"
        >
          Discută cu un Broker
          <ArrowRight className="h-4 w-4" />
        </button>
      </section>
    </>
  );
}

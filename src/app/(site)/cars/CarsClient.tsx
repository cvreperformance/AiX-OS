"use client";

import { Car, ArrowRight } from "lucide-react";
import { designSystem } from "@/styles/designSystem";

const VEHICLES = [
  { title: "Rolls-Royce Spectre (Dubai Hub)", price: "De la 1.800 $ / zi", img: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=600&q=80", spec: "Electric · Chauffeur VIP inclus" },
  { title: "Porsche 911 GT3 RS (Monaco / Nice)", price: "De la 1.200 € / zi", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80", spec: "Nürburgring Tuned · Livrare direct la FBO Terminal" },
  { title: "Mercedes-Maybach S680 (București)", price: "De la 800 € / zi", img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80", spec: "V12 · Executive Chauffeur" },
  { title: "Lamborghini Revuelto (Dubai)", price: "De la 3.500 $ / zi", img: "https://images.unsplash.com/photo-1519245659620-e859806a8d3b?auto=format&fit=crop&w=600&q=80", spec: "V12 Hybrid · Self Drive" },
];

export function CarsClient() {
  const openContact = () => window.dispatchEvent(new CustomEvent("open-contact-popup"));

  return (
    <>
      {/* Vehicles Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {VEHICLES.map((car) => (
          <div key={car.title} className={`rounded-3xl overflow-hidden ${designSystem.glass} ${designSystem.glassHover}`}>
            <div className="h-64 w-full overflow-hidden bg-zinc-900">
              <img src={car.img} alt={car.title} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="text-base font-medium text-white">{car.title}</h4>
                <span className="text-sm text-amber-400 font-mono font-semibold">{car.price}</span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">{car.spec}</p>
              <button
                onClick={openContact}
                className="w-full text-center py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                Solicită Închiriere
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent p-10 md:p-14 text-center space-y-6">
        <Car className="h-10 w-10 text-amber-500/60 mx-auto" />
        <h2 className="text-2xl md:text-3xl font-light text-white">Căutați un model specific?</h2>
        <p className="text-zinc-400 max-w-lg mx-auto">
          Rețeaua noastră are acces la cele mai exclusive colecții private și flote comerciale din lume.
        </p>
        <button
          onClick={openContact}
          className="inline-flex items-center gap-2 rounded-full bg-amber-500/90 px-8 py-3.5 text-sm font-medium text-black hover:bg-amber-400 transition-all"
        >
          Contactează Concierge Auto
          <ArrowRight className="h-4 w-4" />
        </button>
      </section>
    </>
  );
}

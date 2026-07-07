import type { Metadata } from "next";
import { CarsClient } from "./CarsClient";

export const metadata: Metadata = {
  title: "Luxury Cars & VIP Ground Mobility | AiX OS™",
  description: "Flotă de supercars și limuzine exclusive în București, Monaco și Dubai. Rolls-Royce, Porsche 911, Lamborghini — chauffeur VIP inclus.",
};

export default function CarsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16 animate-in">
      {/* Header */}
      <section className="space-y-6 max-w-3xl">
        <span className="inline-block text-xs uppercase tracking-[0.2em] text-amber-500/80 border border-amber-500/20 rounded-full px-3 py-1">
          AiX OS™ · Luxury Mobility
        </span>
        <h1 className="text-4xl md:text-5xl font-light text-white leading-tight">
          Supercars & <br />
          <span className="gradient-gold">VIP Ground Mobility</span>
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Flotă dedicată de limuzine cu șofer privat, SUV-uri blindate și vehicule sport exotice pregătite în București, Nisa, Monaco și Dubai.
        </p>
      </section>

      <CarsClient />
    </div>
  );
}

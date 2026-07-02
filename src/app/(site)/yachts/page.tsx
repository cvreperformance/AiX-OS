import type { Metadata } from "next";
import { YachtsClient } from "./YachtsClient";

export const metadata: Metadata = {
  title: "Superyacht Charters & Marine Lifestyle | AiX OS",
  description: "Charter superyahturi în Marea Mediterană și Golful Persic. Flotă privată de mega-yacht-uri cu echipaj complet. București, Monaco, Dubai.",
};

export default function YachtsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16 animate-in">
      {/* Header */}
      <section className="space-y-6 max-w-3xl">
        <span className="inline-block text-xs uppercase tracking-[0.2em] text-amber-500/80 border border-amber-500/20 rounded-full px-3 py-1">
          AiX OS · Yachting Services
        </span>
        <h1 className="text-4xl md:text-5xl font-light text-white leading-tight">
          Superyacht Charters & <br />
          <span className="gradient-gold">Marine Lifestyle</span>
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Acces direct la o flotă globală de superyachts pentru charter în Marea Mediterană, Marea Egee și Golful Persic. Echipaj complet, itinerarii personalizate.
        </p>
      </section>

      <YachtsClient />
    </div>
  );
}

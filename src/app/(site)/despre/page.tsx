import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Brain, Building2, Network, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Despre AiX OS",
  description: "Operating System for Investors. Platformă de intelligence pentru decizii de investiții.",
};

const products = [
  {
    icon: TrendingUp,
    name: "Market Pulse",
    desc: "Collectează, analizează și explică automat tot ce se întâmplă pe piață.",
    href: "/stiri",
  },
  {
    icon: Brain,
    name: "AI Advisor",
    desc: "Consilierul tău personal de investiții. Conversational, contextual, inteligent.",
    href: "/ai",
  },
  {
    icon: Building2,
    name: "Intelligence Dashboard",
    desc: "Heatmaps, scoruri, calculatoare, portofoliu — totul într-un singur loc.",
    href: "/aix-score",
  },
  {
    icon: Network,
    name: "Connect",
    desc: "Rețea privată globală. Invitation only. Off-market deals.",
    href: "/oportunitati",
  },
];

export default function DesprePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <PageHeader
        badge="Despre"
        title="Operating System for Investors"
        subtitle="AiX OS nu este un site imobiliar. Este stratul de intelligence din spatele fiecărei decizii de investiție."
      />

      <div className="prose prose-invert max-w-3xl mb-16 space-y-6">
        <p className="text-lg text-zinc-300 leading-relaxed">
          Informația e peste tot. Inteligența e rară. AiX OS există pentru a transforma
          informația brută în claritate, strategie și decizii mai bune.
        </p>
        <p className="text-zinc-400 leading-relaxed">
          Platforma combină Market Pulse (știri analizate cu AiX Score), AI Advisor
          (consilier personal), Intelligence Dashboard (scoruri, heatmaps, calculatoare)
          și un ecosistem conectat cu CristianVaduva.com și AiXLuxury.com.
        </p>
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-light text-white mb-8">Produse</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((p) => (
            <Link
              key={p.name}
              href={p.href}
              className="group flex gap-5 rounded-2xl border border-zinc-800 p-6 hover:border-amber-500/30 transition-all"
            >
              <p.icon className="h-8 w-8 text-amber-500/70 flex-shrink-0 group-hover:text-amber-400 transition-colors" />
              <div>
                <h3 className="text-lg font-light text-white mb-1 flex items-center gap-2">
                  {p.name}
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </h3>
                <p className="text-sm text-zinc-400">{p.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 md:p-12 text-center space-y-4">
        <p className="font-display text-2xl font-light text-white italic">
          &ldquo;Information is infinite. Attention is limited. Decisions are expensive.&rdquo;
        </p>
        <p className="text-sm text-zinc-500">— Core Philosophy, AiX OS</p>
      </section>
    </div>
  );
}

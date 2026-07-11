"use client";

import Link from "next/link";
import { ArrowRight, Brain, Building2, Network, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { useLanguage } from "@/context/LanguageContext";

export function DespreCientPage() {
  const { language } = useLanguage();

  const products = language === "ro" ? [
    {
      icon: TrendingUp,
      name: "Market Pulse",
      desc: "Colectează, analizează și explică automat tot ce se întâmplă pe piață.",
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
      href: "/proprietati",
    },
  ] : [
    {
      icon: TrendingUp,
      name: "Market Pulse",
      desc: "Automatically collects, analyzes, and explains everything happening in the market.",
      href: "/stiri",
    },
    {
      icon: Brain,
      name: "AI Advisor",
      desc: "Your personal investment advisor. Conversational, contextual, intelligent.",
      href: "/ai",
    },
    {
      icon: Building2,
      name: "Intelligence Dashboard",
      desc: "Heatmaps, scores, calculators, portfolio — all in one place.",
      href: "/aix-score",
    },
    {
      icon: Network,
      name: "Connect",
      desc: "Private global network. Invitation only. Off-market deals.",
      href: "/proprietati",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <PageHeader
        badge={language === "ro" ? "Despre" : "About"}
        title="Operating System for Investors"
        subtitle={
          language === "ro"
            ? "AiX OS™ nu este un site imobiliar. Este stratul de intelligence din spatele fiecărei decizii de investiție."
            : "AiX OS™ is not a real estate website. It is the intelligence layer behind every investment decision."
        }
      />

      <div className="prose prose-invert max-w-3xl mb-16 space-y-6">
        <p className="text-lg text-zinc-600 leading-relaxed">
          {language === "ro"
            ? "Informația e peste tot. Inteligența e rară. AiX OS™ există pentru a transforma informația brută în claritate, strategie și decizii mai bune."
            : "Information is everywhere. Intelligence is rare. AiX OS™ exists to transform raw information into clarity, strategy, and better decisions."}
        </p>
        <p className="text-zinc-400 leading-relaxed">
          {language === "ro"
            ? "Platforma combină Market Pulse (știri analizate cu AiX Score), AI Advisor (consilier personal), Intelligence Dashboard (scoruri, heatmaps, calculatoare) și un ecosistem conectat cu CristianVaduva.com și AiXLuxury.com."
            : "The platform combines Market Pulse (news analyzed with AiX Score), AI Advisor (personal advisor), Intelligence Dashboard (scores, heatmaps, calculators), and an ecosystem connected with CristianVaduva.com and AiXLuxury.com."}
        </p>
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-light text-zinc-900 mb-8">
          {language === "ro" ? "Produse" : "Products"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((p) => (
            <Link
              key={p.name}
              href={p.href}
              className="group flex gap-5 rounded-2xl border border-zinc-200 p-6 hover:border-amber-500/30 transition-all"
            >
              <p.icon className="h-8 w-8 text-amber-500/70 flex-shrink-0 group-hover:text-amber-400 transition-colors" />
              <div>
                <h3 className="text-lg font-light text-zinc-900 mb-1 flex items-center gap-2">
                  {p.name}
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </h3>
                <p className="text-sm text-zinc-400">{p.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-zinc-50/30 p-8 md:p-12 text-center space-y-4">
        <p className="font-display text-2xl font-light text-zinc-900 italic">
          &ldquo;Information is infinite. Attention is limited. Decisions are expensive.&rdquo;
        </p>
        <p className="text-sm text-zinc-400">— Core Philosophy, AiX OS™</p>
      </section>
    </div>
  );
}

export default DespreCientPage;

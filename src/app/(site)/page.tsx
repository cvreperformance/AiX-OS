import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Building2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  NewsCard,
  OpportunityCard,
  PropertyCard,
  Section,
} from "@/components/ui";
import {
  getFeaturedProperties,
  getMarketIndicators,
  getNews,
  getOpportunities,
} from "@/lib/data";
import { siteConfig } from "@/lib/config";

export default async function HomePage() {
  const [featured, news, opportunities] = await Promise.all([
    getFeaturedProperties(),
    getNews(),
    getOpportunities(),
  ]);
  const indicators = getMarketIndicators();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden grid-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-24 md:py-32">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs uppercase tracking-widest text-amber-400/90">
                Market Pulse · Live Intelligence
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-light leading-[1.1] text-white">
              Intelligence Layer
              <br />
              <span className="gradient-gold">Built for Investors</span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-xl">
              {siteConfig.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/anunturi"
                className="inline-flex items-center gap-2 rounded-full bg-amber-500/90 px-7 py-3 text-sm font-medium text-black hover:bg-amber-400 transition-all"
              >
                Explorează Proprietăți
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/ai"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-7 py-3 text-sm text-zinc-300 hover:border-amber-500/30 hover:text-white transition-all"
              >
                <Brain className="h-4 w-4" />
                AI Advisor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Market Indicators */}
      <section className="border-y border-zinc-800 bg-zinc-900/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {indicators.map((ind) => (
              <div key={ind.label} className="text-center md:text-left">
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">
                  {ind.label}
                </p>
                <p className="text-2xl font-light text-white">{ind.value}</p>
                {ind.change && (
                  <p
                    className={`text-xs mt-0.5 ${
                      ind.trend === "up"
                        ? "text-emerald-400"
                        : ind.trend === "down"
                          ? "text-red-400"
                          : "text-zinc-500"
                    }`}
                  >
                    {ind.change}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: TrendingUp,
              title: "Market Pulse",
              desc: "Știri analizate, filtrate și evaluate cu AiX Score. Doar ce contează pentru investitori.",
              href: "/stiri",
            },
            {
              icon: BarChart3,
              title: "AiX Score",
              desc: "Rating proprietar care evaluează oportunități pe baza a 12+ indicatori strategici.",
              href: "/aix-score",
            },
            {
              icon: Brain,
              title: "AI Advisor",
              desc: "Consilierul tău personal de investiții. Întreabă orice despre piață, proprietăți, ROI.",
              href: "/ai",
            },
          ].map((product) => (
            <Link
              key={product.href}
              href={product.href}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 hover:border-amber-500/30 transition-all"
            >
              <product.icon className="h-8 w-8 text-amber-500/70 mb-4 group-hover:text-amber-400 transition-colors" />
              <h3 className="text-xl font-light text-white mb-2">{product.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{product.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Section
          title="Proprietăți Selectate"
          subtitle="Evaluate cu AiX OS Score"
          href="/anunturi"
          linkLabel="Vezi toate"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </Section>

        {/* Market Pulse */}
        <Section
          title="Market Pulse"
          subtitle="Intelligence, not news"
          href="/stiri"
          linkLabel="Toate știrile"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {news.slice(0, 4).map((a) => (
              <NewsCard key={a.id} article={a} />
            ))}
          </div>
        </Section>

        {/* Opportunities */}
        <Section
          title="Oportunități Investiționale"
          subtitle="Verificate și evaluate"
          href="/oportunitati"
          linkLabel="Toate oportunitățile"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {opportunities
              .filter((o) => o.featured)
              .map((o) => (
                <OpportunityCard key={o.id} opportunity={o} />
              ))}
          </div>
        </Section>
      </div>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent p-12 md:p-16 text-center space-y-6">
          <Building2 className="h-10 w-10 text-amber-500/70 mx-auto" />
          <h2 className="font-display text-3xl md:text-4xl font-light text-white">
            Ecosistemul tău de investiții
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto">
            De la market intelligence la buyer representation. Un singur loc pentru
            decizii mai bune.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-amber-500/90 px-8 py-3 text-sm font-medium text-black hover:bg-amber-400 transition-all"
            >
              Programează Consultație
            </Link>
            <Link
              href="/despre"
              className="rounded-full border border-zinc-700 px-8 py-3 text-sm text-zinc-300 hover:text-white transition-all"
            >
              Despre AiX OS
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

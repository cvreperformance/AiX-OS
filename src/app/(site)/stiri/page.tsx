import type { Metadata } from "next";
import { getNews } from "@/lib/data";
import { NewsCard, PageHeader } from "@/components/ui";
import { getRomanianMarketPulse } from "@/lib/market";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Market Pulse | AiX OS — Știri Imobiliare România & Global",
  description:
    "Știri imobiliare România, EU și global. Analize de piață, ROBOR, prețuri pe metru pătrat, yield-uri și market intelligence evaluat cu AiX Score.",
};

// Fallback news if Supabase is empty
const FALLBACK_NEWS = [
  {
    id: "f1", slug: "apartamente-vechi-mai-scumpe-noi",
    title: "Apartamentele vechi — 27% mai scumpe decât cele noi în București",
    summary: "Un fenomen unic în România: TVA 21% pe construcții noi (aug 2025) a inversat piața. Apartamentele vechi central-conectate costă €2,653/mp față de €2,099/mp blocurile noi.",
    category: "Analiză", image_url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    aix_score: 9.0, published_at: "2026-06-28T09:00:00Z",
  },
  {
    id: "f2", slug: "robor-3m-scade-iulie-2026",
    title: "ROBOR 3M coboară la 6.85% — Cel mai mic nivel din 2024",
    summary: "Indicele de referință pentru creditele variabile continuă tendința descendentă. Analiști prevăd o nouă reducere în Q3 2026 dacă BCE menține politica expansivă.",
    category: "Dobânzi", image_url: "https://images.unsplash.com/photo-1554224311-9b9459a08667?w=800&q=80",
    aix_score: 7.5, published_at: "2026-06-27T11:00:00Z",
  },
  {
    id: "f3", slug: "piata-luxury-bucuresti-q2-2026",
    title: "Segmentul luxury București: +12% YoY — Supply record în Q3",
    summary: "Peste 800 unități premium vor fi livrate în Q3 2026, dar cererea din segmentul €500K+ rămâne robustă. Zonele Floreasca, Herăstrău și Primăverii concentrează cea mai mare cerere.",
    category: "Real Estate", image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    aix_score: 8.2, published_at: "2026-06-25T09:00:00Z",
  },
  {
    id: "f4", slug: "dubai-real-estate-record-2026",
    title: "Dubai înregistrează cel mai mare volum de tranzacții din istorie în H1 2026",
    summary: "Piața imobiliară din Dubai a atins un nivel record de 186 miliarde AED în H1 2026. Investitorii români alocă tot mai mult capital în UAE pentru diversificare și 0% impozit.",
    category: "Dubai", image_url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    aix_score: 8.8, published_at: "2026-06-24T14:00:00Z",
  },
  {
    id: "f5", slug: "convergenta-preturi-romania-ue",
    title: "România converge spre media UE — Prețuri imobiliare sub 50% din medie",
    summary: "Cu un preț mediu de €2,200/mp, România rămâne la 50-55% din media UE (€4,500+/mp). Convergenței economice îi mai trebuie 8–12 ani — window oportunitate pentru investitori.",
    category: "Macro", image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    aix_score: 8.6, published_at: "2026-06-22T10:00:00Z",
  },
  {
    id: "f6", slug: "pnrr-impact-imobiliar-romania",
    title: "PNRR: Investițiile în infrastructură stimulează prețurile în 15 zone",
    summary: "Proiectele finanțate prin PNRR au generat o apreciere medie de 8–15% în zonele adiacente lucrărilor de infrastructură. Corbeanca, Voluntari și Otopeni — principalii beneficiari.",
    category: "Infrastructură", image_url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",
    aix_score: 7.8, published_at: "2026-06-20T09:00:00Z",
  },
];

const CATEGORIES = ["Toate", "Real Estate", "Dobânzi", "Macro", "Dubai", "Analiză", "Infrastructură", "Dobânzi"];

export default async function StiriPage() {
  let articles = await getNews();
  if (!articles || articles.length === 0) articles = FALLBACK_NEWS as typeof articles;

  const pulse = getRomanianMarketPulse();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <PageHeader
        badge="Market Pulse"
        title="Știri & Analize Imobiliare"
        subtitle="Intelligence în timp real pentru piața imobiliară din România, EU și global. Fiecare articol este evaluat cu AiX Score."
      />

      {/* Market Sentiment Bar */}
      <div className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-3xl">{pulse.emoji}</div>
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-0.5">Sentiment Piață RO — Iun 2026</p>
            <p className={`text-xl font-semibold ${pulse.color}`}>{pulse.label}</p>
            <p className="text-sm text-zinc-400 mt-0.5 max-w-xl">{pulse.description}</p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="relative h-16 w-16">
            <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#27272a" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke="currentColor"
                className={pulse.color}
                strokeWidth="3"
                strokeDasharray={`${pulse.score} ${100 - pulse.score}`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
              {pulse.score}
            </span>
          </div>
          <p className="text-xs text-zinc-600 text-center mt-1">/ 100</p>
        </div>
      </div>

      {/* Category filter (visual only — server component) */}
      <div className="mb-8 flex gap-2 flex-wrap">
        {["Toate", "Real Estate", "Dobânzi", "Macro", "Dubai", "Analiză", "Infrastructură"].map((cat) => (
          <span
            key={cat}
            className={`rounded-full px-4 py-1.5 text-xs border transition-colors ${
              cat === "Toate"
                ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
            }`}
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Articles grid */}
      {articles.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-zinc-500 text-lg">Nu există știri disponibile momentan.</p>
          <p className="text-zinc-600 text-sm mt-2">Revino în curând sau urmărește canalul Telegram.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Market insight banner */}
      <div className="mt-16 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-500/80 mb-2">AiX OS Intelligence</p>
            <p className="text-white font-light text-lg leading-relaxed max-w-2xl">
              Apartamentele vechi din București sunt cu{" "}
              <span className="text-amber-400 font-medium">27% mai scumpe</span>{" "}
              decât cele noi — fenomen unic în Europa cauzat de TVA 21%.
            </p>
            <p className="text-zinc-500 text-sm mt-2">
              Sursa: Storia/OLX Mar 2026 · Imobiliare.ro · Compilat de Cristian Văduva — AiXLuxury.com
            </p>
          </div>
          <Link
            href="/market"
            className="flex-shrink-0 rounded-full border border-amber-500/30 bg-amber-500/10 px-6 py-3 text-sm text-amber-400 hover:bg-amber-500/20 transition-all whitespace-nowrap"
          >
            Indicatori Piață →
          </Link>
        </div>
      </div>
    </div>
  );
}
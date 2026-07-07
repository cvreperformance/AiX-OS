"use client";

import { useState, useRef, useEffect } from "react";
import { Brain, Send, Sparkles, RefreshCw, Link2 } from "lucide-react";
import { PageHeader } from "@/components/ui";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  links?: Array<{ label: string; href: string }>;
}

const SUGGESTIONS = [
  "Am €300,000. Unde investesc acum?",
  "Compară Pipera cu Floreasca.",
  "Care e yield-ul mediu în Herăstrău?",
  "Care e impactul ROBOR-ului asupra prețurilor?",
  "Cum funcționează AiX Score?",
  "Ce taxe plătesc la cumpărarea unui apartament?",
  "Dubai sau România — unde investesc mai bine?",
  "Cum calculez ROI-ul unui apartament?",
  "Ce e AntiȚeapă AI?",
  "Care e diferența Buyer vs Seller Representation?",
];

// ─── Knowledge base ─────────────────────────────────────────────────────────

function generateResponse(input: string): Pick<Message, "content" | "links"> {
  const q = input.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // strip diacritics for matching

  // Budget / buy decision
  if (
    (q.includes("300") && (q.includes("euro") || q.includes("€") || q.includes("000"))) ||
    q.includes("cumpar") ||
    q.includes("cumpara") ||
    (q.includes("investesc") && q.includes("acum"))
  ) {
    return {
      content: `Pe baza condițiilor actuale de piață:

🏙️ Cu €300,000 ai acces la segmentul mid-premium din București.

Zone recomandate pentru investiție:
• Herăstrău / Aviatorilor → yield 6–8%, cerere expat constantă
• Pipera Corporate → cashflow solid, proximity la hub-uri tech
• Floreasca / Dorobanți → apreciere pe termen lung, wealth preservation
• Corbeanca / Nord → vile, dezvoltare în curs, potențial ridicat

Strategii recomandate:
• Buy & Hold 5–7 ani (apreciere estimată 5–8%/an)
• Buy & Rent cu yield net 5–7%

⚠️ Moment de piață: stabilitate cu oportunități selective. ROBOR 6.85% avantajează cumpărătorii cash.`,
      links: [
        { label: "Calculator ROI", href: "/convenience" },
        { label: "Proprietăți Disponibile", href: "/proprietati" },
        { label: "Consultanță Gratuită", href: "/contact" },
      ],
    };
  }

  // Pipera vs Floreasca
  if (q.includes("pipera") && (q.includes("floreasca") || q.includes("compara"))) {
    return {
      content: `Pipera vs Floreasca — AiX OS™ Comparație:

📊 Pipera / Voluntari:
• Preț mediu: €1,800–2,200/m²
• Yield mediu: 6–8% net
• Profil: investitor cashflow, expat, corporate
• Risc: moderat (dependență de piața de birouri)
• AiX Score mediu: 7.8

📊 Floreasca / Dorobanți:
• Preț mediu: €2,400–3,200/m²
• Yield mediu: 4–5.5% net
• Profil: wealth preservation, locuire premium
• Risc: scăzut (cerere constantă)
• AiX Score mediu: 8.2

Concluzie: Pipera = investiție cu cashflow mai bun. Floreasca = stabilitate și apreciere graduală pe termen lung.`,
      links: [{ label: "Calculator Yield", href: "/convenience" }],
    };
  }

  // Yield / Herastrau
  if (q.includes("yield") || q.includes("herastrau") || q.includes("randament")) {
    return {
      content: `Yield-uri imobiliare în București — Date AiX OS™ 2026:

🏢 Herăstrău / Aviatorilor: 6–8% net | Airbnb: 10–13%
🏢 Pipera / Voluntari: 6–8% net
🏢 Floreasca: 4.5–5.5% net
🏢 Centru / Unirii: 5–7% net
🏢 Militari / Drumul Taberei: 7–9% net (preț mai mic, yield mai mare)
🏢 Iancului / Titan: 7.5–9.5% net (cel mai bun yield/preț)

Medie național: 5.8% net

Formula Yield Net:
= (Chirie Anuală − Cheltuieli) ÷ Prețul de Achiziție × 100`,
      links: [{ label: "Calculator Yield Chirie", href: "/convenience" }],
    };
  }

  // ROBOR / Rate / Dobanda
  if (q.includes("robor") || q.includes("dobanda") || q.includes("rata") || q.includes("credit")) {
    return {
      content: `Rate imobiliare — Situație curentă:

📈 ROBOR 3M: ~6.85%
📈 ROBOR 6M: ~7.10%
📈 IRCC Q2 2026: 5.78% (baza pentru credite noi)
📈 Dobândă medie ipotecară: ~7.5–9% (variabil)

Impact asupra pieței:
• Cumpărătorii cash au avantaj competitiv major
• Cererea cu credit a scăzut cu ~15% față de 2023
• Prețurile se ajustează mai lent decât dobânzile

Strategie AiX OS™: momentul este favorabil pentru negociere agresivă dacă ești cash.`,
      links: [
        { label: "Calculator Ipotecă", href: "/convenience" },
        { label: "Indicatori Piață", href: "/market" },
      ],
    };
  }

  // AiX Score
  if (q.includes("aix score") || q.includes("aix-score") || q.includes("scor")) {
    return {
      content: `AiX Score — Rating proprietar de investment intelligence:

Scala: 1.0 – 10.0

9.0–10.0 → Exceptional: oportunitate rară, toți indicatorii favorabili
7.0–8.9  → Strong: fundamentale solide, merită atenție
5.0–6.9  → Moderate: context-dependent, analiză detaliată necesară
1.0–4.9  → Low: impact limitat, filtrat automat

Cei 12 factori analizați:
Economic Impact · Market Relevance · Investment Potential
Supply vs Demand · Capital Appreciation · Rental Potential
Liquidity · Risk Level · Infrastructure · Geopolitical
Market Sentiment · Long-term Value`,
      links: [{ label: "Detalii AiX Score", href: "/aix-score" }],
    };
  }

  // Taxe cumparare
  if (
    q.includes("taxa") ||
    q.includes("taxe") ||
    q.includes("notar") ||
    q.includes("cumparare") ||
    q.includes("costuri")
  ) {
    return {
      content: `Taxe și costuri la cumpărarea unui apartament în România:

1. Impozit transfer: 3% din prețul tranzacției
2. Taxă notar: ~0.5–1% (conform grilei UNNPR + TVA 19%)
3. Taxă Carte Funciară: ~0.5% + taxe fixe
4. TVA: 5% pentru imobile noi sub €120K, 19% peste (de la developer)
5. Agenție imobiliară: 2–3% (dacă e reprezentare tradițională)

Total estimat: 4–7% din prețul de achiziție

Cu AiX OS™ Buyer Representation: comisionul agentului tău = €0 (plătit de vânzător)`,
      links: [
        { label: "Calculator Taxe Notariale", href: "/convenience" },
        { label: "Buyer Representation", href: "/buyer" },
      ],
    };
  }

  // Dubai vs Romania
  if (q.includes("dubai") || q.includes("emirate") || q.includes("uae")) {
    return {
      content: `Dubai vs România — Comparație Investiție 2026:

🇦🇪 Dubai:
• ROI: 7–12% (net de taxe — 0% impozit!)
• Apreciere: 10–15%/an în ultimii 3 ani
• Entry: de la €80K (studiouri JVC, JVT)
• Risc: volatilitate mai mare, management la distanță
• Avantaj: 0% impozit câștiguri, freehold zone

🇷🇴 România:
• ROI: 6–9% (yield + apreciere)
• Apreciere: 5–8%/an
• Entry: de la €50K
• Risc: mai mic, piață mai previzibilă
• Avantaj: convergență spre prețuri UE

Concluzie AiX OS™: Dubai pentru maximizare randament, România pentru risc-randament optim și lichiditate mai bună.`,
      links: [{ label: "Investiții Globale", href: "/proprietati" }],
    };
  }

  // ROI calculation
  if (q.includes("roi") || q.includes("return") || q.includes("calcul")) {
    return {
      content: `Cum calculezi ROI-ul unui apartament:

Formula simplă:
ROI = (Venit anual net ÷ Total investit) × 100

Exemplu practic:
• Preț achiziție: €150,000
• Costuri (notar, renovare): €8,000
• Total investit: €158,000
• Chirie lunară: €750
• Cheltuieli lunare (taxe, asigurare, admin): €120
• NOI lunar net: €630
• NOI anual: €7,560

→ Yield net = 7,560 ÷ 158,000 × 100 = 4.79%

Adaugă apreciere 6%/an = ROI total estimat ~11%/an`,
      links: [{ label: "Calculator ROI Complet", href: "/convenience" }],
    };
  }

  // Anti-teapa
  if (q.includes("anti") || q.includes("teapa") || q.includes("verificare") || q.includes("frauda")) {
    return {
      content: `AntiȚeapă AI — Protecție înainte de orice semnătură:

Cele mai comune riscuri:
❌ Ipoteci nedivulgate (30% din litigii)
❌ Titlu de proprietate neconfirmat
❌ Prețuri umflate față de piață (15–25%)
❌ Litigii active necomunicate
❌ Acte incomplete sau falsificate

Ce verificăm noi:
✓ Carte Funciară la ghișeu (nu online)
✓ Sarcini, ipoteci, servituți
✓ Litigii la instanțele locale
✓ Preț vs. piață (AiX AI Valuation)
✓ Inspecție tehnică

Pachete: Quick (€149) | Standard (€299) | Premium (€599)`,
      links: [{ label: "AntiȚeapă AI", href: "/anti-teapa" }],
    };
  }

  // Buyer vs seller representation
  if (
    q.includes("buyer") ||
    q.includes("seller") ||
    q.includes("reprezentare") ||
    q.includes("reprezentant")
  ) {
    return {
      content: `Buyer vs Seller Representation:

👤 Buyer Representation:
• Agentul lucrează EXCLUSIV pentru cumpărător
• Acces off-market, due diligence, negociere
• Conflict de interes zero cu vânzătorul
• Comision: €0 pentru cumpărător (plătit de vânzător)

🏠 Seller Representation:
• Marketing premium: foto, video drone, virtual tour
• Promovare AI-powered și baza de cumpărători calificați
• Negociere pentru prețul maxim
• Analytics live și raport săptămânal

⚠️ Agenție tradițională: reprezintă ambele părți simultan — conflict de interese.`,
      links: [
        { label: "Buyer Representation", href: "/buyer" },
        { label: "Seller Representation", href: "/seller" },
      ],
    };
  }

  // Monaco
  if (q.includes("monaco") || q.includes("hnwi") || q.includes("ultra") || q.includes("lux")) {
    return {
      content: `Monaco — Real Estate de Lux:

• Cel mai scump imobil din lume: €50,000–70,000/m²
• 0% impozit pe profit și venit personal
• Lichiditate maximă pentru HNWI/UHNWI
• Yield: 2–4% (low, dar asset de wealth preservation suprem)
• Acces: extrem de restrictiv, rețea privată necesară

AiX OS™ are acces la proprietăți și rețea în Monaco prin AiXLuxury.com. Discuție privată disponibilă.`,
      links: [
        { label: "AiXLuxury.com ↗", href: "https://aixluxury.com" },
        { label: "Luxury Concierge", href: "/concierge" },
      ],
    };
  }

  // Insurance
  if (q.includes("asigurare") || q.includes("pad") || q.includes("viata") || q.includes("sanatate")) {
    return {
      content: `Asigurări imobiliare — Ce trebuie să știi:

🏠 PAD (obligatoriu):
• Toate proprietățile rezidențiale din România TREBUIE să aibă PAD
• Prima: €20–100/an
• Suma asigurată: €10K–20K (insuficientă pentru valoarea reală)

🏠 Asigurare facultativă (recomandat):
• Completează PAD până la valoarea reală a proprietății
• Prima: €15–80/lună pentru un apartament mediu
• Acoperire: incendiu, inundație, furt, cutremur, terți

AiX OS™: comparăm ofertele de la 15+ asigurători. Consultanță gratuită.`,
      links: [
        { label: "Asigurări AI", href: "/insurance" },
        { label: "Calculator Asigurare", href: "/convenience" },
      ],
    };
  }

  // Valuation
  if (q.includes("valuare") || q.includes("valoare") || q.includes("pret") || q.includes("evaluare")) {
    return {
      content: `Evaluare proprietate — AiX AI Valuation:

Metoda noastră:
• 50,000+ tranzacții comparabile analizate
• 6 categorii de factori: localizare, stare, comparabile, trend, AiX Score, infrastructură
• Precizie medie: ±3%
• Timp: 2 minute (estimare) sau 24h (raport complet)

De ce contează:
• Evitați supraplata (15–25% frecvent pe portale)
• Negociați din o poziție informată
• Identificați proprietăți sub-evaluate

Gratuit: estimare orientativă | Premium: raport complet €99–299`,
      links: [{ label: "AI Valuation Engine", href: "/valuation" }],
    };
  }

  // Default
  return {
    content: `Sunt AiX OS™ Advisor — specialistul tău în investiții imobiliare.

Pot analiza:
💰 Bugete și strategii de investiție
📍 Zone din București și România
📊 Yield, ROI, cashflow, apreciere
🏦 Credite, ROBOR, dobânzi
🌍 Piețe internaționale (Dubai, Monaco)
🛡️ Verificare proprietăți și due diligence
📋 Taxe, costuri și structurare tranzacții

Încearcă una din sugestiile de mai jos sau pune orice întrebare despre imobiliare.`,
    links: [{ label: "Consultanță cu un expert real", href: "/contact" }],
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AiAdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Bună. Sunt AiX OS™ Advisor.\n\nÎți pot analiza investiții imobiliare, randamente, zone, credite și mult mai mult.\n\nAlege o sugestie sau pune orice întrebare.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(text?: string) {
    const msg = text ?? input.trim();
    if (!msg || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);

    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));

    const response = generateResponse(msg);
    setMessages((prev) => [...prev, { role: "assistant", ...response }]);
    setLoading(false);
  }

  function reset() {
    setMessages([
      {
        role: "assistant",
        content:
          "Conversație nouă. Cu ce pot să te ajut?",
      },
    ]);
    setInput("");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 flex flex-col min-h-[calc(100vh-8rem)]">
      <div className="flex items-start justify-between mb-8">
        <PageHeader
          badge="AI Advisor"
          title="Consilierul Tău de Investiții"
          subtitle="Analiză imobiliară, ROI, zone, credite și oportunități — instant."
        />
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mt-1 flex-shrink-0"
          aria-label="Resetează conversația"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[520px] scrollbar-thin">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "assistant" && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center mt-0.5">
                  <Brain className="h-4 w-4 text-amber-400" />
                </div>
              )}

              <div className="max-w-[85%] space-y-2">
                <div
                  className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                    m.role === "user"
                      ? "bg-amber-500/10 text-zinc-200 border border-amber-500/20 rounded-tr-sm"
                      : "bg-zinc-800/60 text-zinc-300 rounded-tl-sm"
                  }`}
                >
                  {m.content}
                </div>

                {/* Contextual links from assistant */}
                {m.role === "assistant" && m.links && m.links.length > 0 && (
                  <div className="flex flex-wrap gap-2 pl-1">
                    {m.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-amber-400/80 hover:text-amber-400 hover:border-amber-500/30 transition-all"
                      >
                        <Link2 className="h-3 w-3" />
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-zinc-800/60 text-sm text-zinc-500 flex items-center gap-2">
                <span className="inline-flex gap-1">
                  <span className="animate-bounce" style={{ animationDelay: "0ms" }}>•</span>
                  <span className="animate-bounce" style={{ animationDelay: "150ms" }}>•</span>
                  <span className="animate-bounce" style={{ animationDelay: "300ms" }}>•</span>
                </span>
                Analizez…
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        <div className="border-t border-zinc-800/60 px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSend(s)}
                disabled={loading}
                className="flex-shrink-0 rounded-full border border-zinc-700 bg-zinc-800/40 px-3 py-1.5 text-xs text-zinc-400 hover:text-white hover:border-amber-500/30 transition-all disabled:opacity-40"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-zinc-800 p-4 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Întreabă AiX OS™ Advisor…"
            disabled={loading}
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-amber-500/40 focus:outline-none transition-all disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="rounded-xl bg-amber-500/90 px-4 py-2.5 text-black hover:bg-amber-400 disabled:opacity-40 transition-all"
            aria-label="Trimite"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 px-1">
        <p className="text-xs text-zinc-600">
          AiX OS™ Advisor v2 · Knowledge base local · Răspunsuri orientative
        </p>
        <Link href="/contact" className="text-xs text-amber-500/60 hover:text-amber-400 transition-colors">
          Consultanță reală →
        </Link>
      </div>
    </div>
  );
}
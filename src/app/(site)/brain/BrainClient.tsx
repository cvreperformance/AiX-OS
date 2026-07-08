"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { designSystem } from "@/styles/designSystem";
import { PageHeader } from "@/components/ui";
import { ALL_SERVICES_REGISTRY, type ServiceItem } from "@/config/services.config";
import {
  Brain,
  Send,
  Sparkles,
  ArrowRight,
  Shield,
  Activity,
  BookOpen,
  Key,
  Scale,
  Building,
  Plane,
  AlertTriangle,
  GitCompare,
  ArrowUpRight,
  HelpCircle
} from "lucide-react";
import Link from "next/link";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  structuredResults?: ServiceItem[];
  insights?: string;
  actions?: { label: string; href: string }[];
  confidence?: "high" | "medium" | "low";
}

export default function BrainClient() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    setMessages([
      {
        sender: "ai",
        text:
          language === "ro"
            ? "Salut! Sunt AiX Brain, nucleul decizional al platformei. Adresează-mi o întrebare legată de Imobiliare, Investiții, Legislație sau Instrumente financiare. Voi scana automat modulele pentru a-ți oferi un raport decizional structurat."
            : "Hello! I am AiX Brain, the platform's central decision engine. Ask me any question about Properties, Investments, Law, or Financial Estimators. I will scan our registries to compile a structured decision report.",
      },
    ]);
  }, [language]);

  // Scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSuggestClick = (q: string) => {
    setQuery(q);
    executeSearch(q);
  };

  const executeSearch = (searchQ: string) => {
    if (!searchQ.trim()) return;

    setLoading(true);
    
    // Simulate cognitive query parsing delay
    setTimeout(() => {
      const lower = searchQ.toLowerCase().trim();
      
      // Dynamic Query Matching over Centralized Registry keywords
      const matched = ALL_SERVICES_REGISTRY.filter((s) => {
        const matchesKeyword = s.keywords.some((k) => lower.includes(k.toLowerCase()));
        const matchesLabel = s.label.toLowerCase().includes(lower) || s.labelEn.toLowerCase().includes(lower);
        const matchesDesc = s.desc.toLowerCase().includes(lower) || s.descEn.toLowerCase().includes(lower);
        return matchesKeyword || matchesLabel || matchesDesc;
      }).slice(0, 4);

      let insights = "";
      const actionsList: { label: string; href: string }[] = [];
      let confidenceLevel: ChatMessage["confidence"] = "high";

      if (matched.length > 0) {
        // Build dynamic insights based on matched categories
        const categoriesMatched = Array.from(new Set(matched.map((m) => m.category)));
        
        if (categoriesMatched.includes("BUY") || categoriesMatched.includes("SELL")) {
          insights = language === "ro"
            ? "Am detectat intentie imobiliară. Recomandăm due diligence cadastral riguros înainte de orice promisiune de vânzare-cumpărare (verificarea titlului de proprietate, litigii active ale vânzătorului și limitări de drum de servitute)."
            : "Property transaction intent detected. We highly advise strict cadastre due diligence (checking ownership chains, active claims, and easement access) before signing any purchase contract.";
          
          actionsList.push(
            { label: language === "ro" ? "Scanează Carte Funciară" : "Scan Cadastre", href: "/anti-teapa" },
            { label: language === "ro" ? "Calculează Taxe Notariale" : "Calculate Notary Cost", href: "/convenience" }
          );
        } else if (categoriesMatched.includes("INVEST")) {
          insights = language === "ro"
            ? "Interogarea vizează managementul riscului și portofoliul de active. Recomandăm calcularea DTI (grad îndatorare) și corelarea randamentelor imobiliare cu dobânzile cheie ale BNR."
            : "Query maps to active asset allocation and risk mitigation. We advise evaluating your debt-to-income index and benchmarking rental yields against live BNR policy rates.";

          actionsList.push(
            { label: language === "ro" ? "Vezi Indicatori Macro" : "View Macro Ticker", href: "/market" },
            { label: language === "ro" ? "Estimează Cost Asigurare" : "Estimate Insurance Cost", href: "/insurance" }
          );
        } else if (categoriesMatched.includes("TOOLS")) {
          insights = language === "ro"
            ? "Utilizare utilitare financiare detectată. Generăm calculul în timp util direct din sandbox."
            : "Platform utilities request matched. Sandboxed financial computations are available instantly via the modules below.";
          
          actionsList.push(
            { label: language === "ro" ? "Calculează Ipotecă & ROI" : "Simulate Mortgage & ROI", href: "/convenience" }
          );
        } else {
          insights = language === "ro"
            ? "Am extras link-urile relevante din ghidurile noastre de intelligence. Consultați biblioteca sau resursele noastre publice."
            : "I extracted relevant guide paths matching your research focus. Check our bookshelf or open state registries below.";
        }
      } else {
        // No exact match - Low confidence warning
        confidenceLevel = "low";
        insights = language === "ro"
          ? "Nu am putut identifica potriviri exacte în baza de date locală a modulelor. Recomandăm adresarea unei întrebări mai specifice (ex: 'vânzare', 'dobândă', 'ROI', 'notar') sau contactarea unui consilier."
          : "No direct module matches found. We recommend using specific tags (e.g., 'buy', 'notary fees', 'insurance', 'BNR') or connecting directly with an advisor.";
        
        actionsList.push(
          { label: language === "ro" ? "Consultanță WhatsApp" : "WhatsApp Support", href: "https://wa.me/436509536345" },
          { label: language === "ro" ? "Deschide Calculator Financiar" : "Open Financial Calculators", href: "/convenience" }
        );
      }

      const replyText = language === "ro"
        ? `Am finalizat interogarea pentru intentia: "${searchQ}". Iată raportul decizional:`
        : `Finished analysis scan for query: "${searchQ}". Here is the decision report:`;

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: replyText,
          structuredResults: matched.length > 0 ? matched : undefined,
          insights,
          actions: actionsList.length > 0 ? actionsList : undefined,
          confidence: confidenceLevel,
        },
      ]);
      setLoading(false);
    }, 1000);
  };
  // Handle initial search params query
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      executeSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    const userQ = query.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userQ }]);
    setQuery("");
    executeSearch(userQ);
  };

  const suggestions = [
    language === "ro"
      ? "Cum cumpăr un apartament în siguranță?"
      : "How do I securely buy a property?",
    language === "ro"
      ? "Vreau să știu dobânda BNR și prețul aurului"
      : "What are the BNR rates and Gold spot prices?",
    language === "ro"
      ? "Cum calculez taxele notariale pentru achiziție?"
      : "How do I calculate notary fees for buying?",
    language === "ro"
      ? "Ce cărți recomandați pentru negociere?"
      : "What books do you recommend for negotiation?",
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-10 animate-in">
      <PageHeader
        badge="Decision Engine"
        title="AiX Brain Router"
        subtitle={
          language === "ro"
            ? "Interfața centrală de analiză. Scrie o întrebare liberă, iar motorul va căuta automat modulele platformei."
            : "Central decision interface. Ask once, and the brain routing layer synthesizes responses across all directories."
        }
      />

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Chat Screen */}
        <div className={`lg:col-span-8 rounded-3xl border border-zinc-800 bg-zinc-950/20 shadow-2xl p-4 sm:p-6 flex flex-col justify-between min-h-[500px] h-[640px] relative`}>
          
          {/* Scrollable messages container */}
          <div className="flex-1 overflow-y-auto space-y-5 pr-2 scrollbar-none">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-[90%] ${
                  m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                <div
                  className={`rounded-2xl p-4 text-xs leading-relaxed space-y-4 text-left ${
                    m.sender === "user"
                      ? "bg-amber-500 text-black font-semibold"
                      : "border border-zinc-850 bg-zinc-900/30 text-zinc-300"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Structured Results Layer */}
                  {m.structuredResults && (
                    <div className="space-y-2 pt-3 border-t border-zinc-800">
                      <span className="text-[9px] uppercase font-bold text-amber-500 tracking-wider block">
                        {language === "ro" ? "Module Identificate:" : "Identified Modules:"}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {m.structuredResults.map((item) => {
                          const ItemIcon = item.icon;
                          return (
                            <Link
                              key={item.id}
                              href={item.href}
                              className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-800/80 bg-zinc-950/60 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all group"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="rounded-lg bg-zinc-900 p-1.5 text-zinc-400 group-hover:text-amber-400 flex-shrink-0">
                                  <ItemIcon className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 text-left">
                                  <p className="text-[11px] font-semibold text-white truncate">
                                    {language === "ro" ? item.label : item.labelEn}
                                  </p>
                                </div>
                              </div>
                              <ArrowUpRight className="h-3.5 w-3.5 text-zinc-650 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Insight Layer */}
                  {m.insights && (
                    <div className="pt-3 border-t border-zinc-800 space-y-1">
                      <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider block">
                        {language === "ro" ? "Layer Analiză & Audit:" : "Analysis & Audit Layer:"}
                      </span>
                      <p className="text-zinc-400 text-[11px] leading-relaxed italic">{m.insights}</p>
                    </div>
                  )}

                  {/* Confidence indicators */}
                  {m.confidence && (
                    <div className="flex items-center gap-1.5 text-[9px] text-zinc-550 font-mono">
                      <span>Confidence:</span>
                      {m.confidence === "high" ? (
                        <span className="text-emerald-400 font-bold">HIGH</span>
                      ) : m.confidence === "medium" ? (
                        <span className="text-amber-400 font-bold">MEDIUM</span>
                      ) : (
                        <span className="text-red-400 font-bold flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> LOW (Missing exact database tags)
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Layer */}
                  {m.actions && (
                    <div className="pt-3 border-t border-zinc-800 flex flex-wrap gap-2">
                      {m.actions.map((act, i) => (
                        <Link
                          key={i}
                          href={act.href}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/20 text-[10px] text-amber-400 font-semibold uppercase tracking-wider transition-all"
                        >
                          {act.label}
                        </Link>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-xs text-zinc-500 italic animate-pulse">
                <Brain className="h-4 w-4 animate-spin text-amber-500" />
                <span>
                  {language === "ro"
                    ? "Brain interoghează modulele..."
                    : "Brain querying platform modules..."}
                </span>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-zinc-900 flex gap-2">
            <input
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                language === "ro"
                  ? "Întreabă AiX Brain (ex: 'dobândă', 'carte funciară', 'apartament Pipera')..."
                  : "Ask AiX Brain (e.g. 'notary fees', 'rent rate', 'buy villa')..."
              }
              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-xs text-white placeholder-zinc-500 focus:border-amber-500/50 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-amber-500 hover:bg-amber-400 text-black p-3 transition-colors flex items-center justify-center shrink-0 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>

        {/* Right suggestions bar */}
        <div className={`lg:col-span-4 rounded-3xl ${designSystem.glass} p-6 space-y-6 text-left`}>
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              {language === "ro" ? "Întrebări Sugerate" : "Suggested Audits"}
            </h3>
          </div>

          <div className="space-y-2">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestClick(s)}
                className="w-full text-left p-3 rounded-xl border border-zinc-850 hover:border-zinc-700 bg-zinc-950/20 text-xs text-zinc-400 hover:text-white transition-all text-ellipsis overflow-hidden flex justify-between items-center group"
              >
                <span className="truncate pr-2">{s}</span>
                <ArrowRight className="h-3.5 w-3.5 text-zinc-650 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </button>
            ))}
          </div>

          <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-950/30 space-y-2 text-[10.5px] leading-relaxed text-zinc-500">
            <HelpCircle className="h-4 w-4 text-zinc-500" />
            <p>
              {language === "ro"
                ? "AiX Brain analizează date brute din Supabase (proprietăți active, parametri fiscali) și folosește indexarea semantico-lexicală pentru a te ghida către decizia corectă."
                : "AiX Brain queries live metadata fields from databases (active units, tax variables) and applies semantic keyword indexing maps to guide your decisions."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

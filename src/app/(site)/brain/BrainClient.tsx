"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { designSystem } from "@/styles/designSystem";
import { PageHeader } from "@/components/ui";
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
} from "lucide-react";
import Link from "next/link";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  modules?: {
    title: string;
    icon: any;
    desc: string;
    href: string;
    actionLabel: string;
  }[];
  checklists?: string[];
}

export default function BrainClient() {
  const { language } = useLanguage();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting
    setMessages([
      {
        sender: "ai",
        text:
          language === "ro"
            ? "Salut! Sunt AiX Brain, nucleul de inteligență al platformei. Adresează-mi o întrebare complexă despre imobiliare, legislație, investiții sau asigurări, iar eu voi interoga modulele platformei pentru a-ți asambla răspunsul optim."
            : "Hello! I am AiX Brain, the platform's central intelligence layer. Ask me any question about properties, legal checks, parameters, or allocations, and I will query our modules to compile the answer.",
      },
    ]);
  }, [language]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSuggestClick = (q: string) => {
    setQuery(q);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userQ = query.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userQ }]);
    setQuery("");
    setLoading(true);

    setTimeout(() => {
      const lower = userQ.toLowerCase();
      let replyText = "";
      const modulesMatched: ChatMessage["modules"] = [];
      let checklistItems: string[] = [];

      // ─── ROUTING LOGIC ───
      const matchBuy = lower.includes("cumpar") || lower.includes("achiziti") || lower.includes("apartament") || lower.includes("vila") || lower.includes("casa") || lower.includes("floreasca") || lower.includes("pipera");
      const matchInsurance = lower.includes("asigur") || lower.includes("pad") || lower.includes("prima") || lower.includes("daun");
      const matchBooks = lower.includes("cart") || lower.includes("book") || lower.includes("negoci") || lower.includes("voss") || lower.includes("harari");
      const matchMarket = lower.includes("aur") || lower.includes("gold") || lower.includes("doband") || lower.includes("inflat") || lower.includes("bnr") || lower.includes("crypto") || lower.includes("bitcoin") || lower.includes("etf");
      const matchLaw = lower.includes("leg") || lower.includes("contract") || lower.includes("notar") || lower.includes("cf") || lower.includes("cadastru");
      const matchCyber = lower.includes("cyber") || lower.includes("securit") || lower.includes("pass") || lower.includes("yubico");
      const matchTravel = lower.includes("travel") || lower.includes("avion") || lower.includes("charter") || lower.includes("viza") || lower.includes("frontiera");

      if (matchBuy) {
        replyText += language === "ro"
          ? "Am interogat catalogul de **Proprietăți** active și **Ghidul de Achiziție Imobiliară**. Înainte de a cumpăra orice apartament, este vital să efectuezi un audit de carte funciară."
          : "I searched our active **Properties** portfolio and the **Acquisition Guide**. Before purchasing any home, performing a land registry audit is paramount.";
        
        modulesMatched.push(
          { title: language === "ro" ? "Ghid Achiziție" : "Acquisitions Guide", icon: Key, desc: "Checklist imobiliar pas cu pas.", href: "/learning", actionLabel: "Open Checklists" },
          { title: language === "ro" ? "Portofoliu Proprietăți" : "Property Portals", icon: Building, desc: "Filtrează clădiri premium active.", href: "/proprietati", actionLabel: "View Listings" }
        );
        
        checklistItems.push(
          language === "ro" ? "Stabiliți un buget cu rezervă de 10-15% pentru taxe notariale." : "Establish buying budgets with 10-15% notary buffer margins.",
          language === "ro" ? "Obțineți pre-aprobarea de creditare bancară." : "Secure banking credit approvals.",
          language === "ro" ? "Solicitați un extras de CF pentru informare recent." : "Fetch updated land registry records."
        );
      }

      if (matchInsurance) {
        replyText += " " + (language === "ro"
          ? "Am interogat **Insurance Desk**-ul AiX. Am calculat cotațiile medii pentru case premium bazate pe valoarea de reconstrucție."
          : "I queried the AiX **Insurance Desk**. I computed premium estimates for luxury structures based on reconstruction values.");
        
        modulesMatched.push(
          { title: "Insurance Desk", icon: Shield, desc: "Calculează prima și completează polița PAD.", href: "/insurance", actionLabel: "Calculate Premium" }
        );
      }

      if (matchBooks) {
        replyText += " " + (language === "ro"
          ? "Am accesat **Biblioteca de Cărți** și **Negocierea de Contracte**. Pentru negocieri imobiliare de lux, îți recomandăm tehnica mirroring a lui Chris Voss."
          : "I accessed our **Books Library** and **Contract Negotiation** files. For high-value real estate bids, we recommend Chris Voss's tactical mirroring.");
        
        modulesMatched.push(
          { title: language === "ro" ? "Biblioteca AiX" : "AiX Bookshelf", icon: BookOpen, desc: "Cărți de afaceri recomandate.", href: "/books", actionLabel: "Browse Library" }
        );
      }

      if (matchMarket || matchCyber || matchTravel || matchLaw) {
        replyText += " " + (language === "ro"
          ? "Am conectat **Indicatorii Macro BNR**, **Ghidul de Vize** și **RO Law Desk**-ul pentru a securiza fluxul de capital și tranzacția."
          : "I mapped **BNR Macro Indexes**, **Consular Travel Warnings**, and the **RO Law Desk** to safeguard capital transfers and notary details.");
        
        if (matchMarket) {
          modulesMatched.push({ title: "Market Pulse", icon: Activity, desc: "Cotații valutare active și BNR.", href: "/market", actionLabel: "Open Ticker" });
        }
        if (matchLaw) {
          modulesMatched.push({ title: "RO Law Desk", icon: Scale, desc: "Cadastru și legislație imobiliară.", href: "/law", actionLabel: "Check Law" });
        }
      }

      if (replyText === "") {
        replyText = language === "ro"
          ? "Întrebarea ta atinge elemente generale. Am interogat resursele noastre generale de analiză și îți recomandăm să consulți calculatorul financiar sau ghidurile noastre de investiții imobiliare."
          : "Your query refers to general parameters. I checked our analytics files. We advise reviewing our portfolio metrics and checking our property guidelines.";
        
        modulesMatched.push(
          { title: "Ecosistem Servicii", icon: Brain, desc: "Toate instrumentele AiX OS.", href: "/services", actionLabel: "View Services" }
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: replyText,
          modules: modulesMatched,
          checklists: checklistItems.length > 0 ? checklistItems : undefined,
        },
      ]);
      setLoading(false);
    }, 1200);
  };

  const suggestions = [
    language === "ro"
      ? "Cum cumpăr un apartament în siguranță?"
      : "How do I securely buy a property?",
    language === "ro"
      ? "Ce cărți recomandați pentru negociere?"
      : "What books do you recommend for negotiation?",
    language === "ro"
      ? "Vreau să știu dobânda BNR și prețul aurului"
      : "What are the BNR rates and Gold spot prices?",
    language === "ro"
      ? "Cum asigurez o proprietate de lux?"
      : "How do I insure a luxury home?",
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-10 animate-in">
      <PageHeader
        badge="Ecosistem Cognitiv"
        title="AiX Brain Router"
        subtitle={
          language === "ro"
            ? "Interfața centrală de analiză. Scrie o întrebare liberă, iar robotul va reuni cunoștințe din multiple module."
            : "Central intelligence interface. Ask once, and the brain synthesizes responses across all core directories."
        }
      />

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left chat panel */}
        <div className={`lg:col-span-8 rounded-3xl border border-zinc-800 bg-zinc-950/20 shadow-2xl p-4 sm:p-6 flex flex-col justify-between min-h-[480px] h-[600px]`}>
          {/* Timeline scroll */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-none">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] ${
                  m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                <div
                  className={`rounded-2xl p-3 text-xs leading-relaxed ${
                    m.sender === "user"
                      ? "bg-amber-500 text-black font-semibold"
                      : "border border-zinc-850 bg-zinc-900/40 text-zinc-300"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Render checklist */}
                  {m.checklists && (
                    <ul className="space-y-1.5 mt-3 pt-3 border-t border-zinc-800 text-[11px] text-zinc-400">
                      {m.checklists.map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
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

          {/* Form input */}
          <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-zinc-900 flex gap-2">
            <input
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                language === "ro"
                  ? "Întreabă AiX Brain (ex: 'vânzare', 'aur', 'negociere')..."
                  : "Ask AiX Brain (e.g. 'buy property', 'insurance check')..."
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
        <div className={`lg:col-span-4 rounded-3xl ${designSystem.glass} p-6 space-y-6`}>
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
        </div>
      </div>
    </div>
  );
}

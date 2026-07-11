"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Brain,
  X,
  MessageCircle,
  Mail,
  Phone,
  ArrowRight,
  Send,
  Sparkles,
  Shield,
  Activity,
  Gem,
  Lock,
  ChevronRight
} from "lucide-react";
import { brandContent } from "@/lib/content/brand";
import { useLanguage } from "@/context/LanguageContext";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

export function FloatingCTA() {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize greeting on language change
  useEffect(() => {
    setMessages([
      {
        sender: "ai",
        text:
          language === "ro"
            ? "Sunt consilierul tău digital AiX OS™. Te pot asista în timp real cu analize imobiliare, randamente investiționale, aspecte juridice sau servicii de concierge."
            : "I am your private AiX OS™ intelligence advisor. I can assist you in real time with property diagnostics, yield optimization, legal checks, or premium concierge requests.",
      },
    ]);
  }, [language]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const executeAdvisorQuery = (userText: string) => {
    if (!userText.trim()) return;

    setLoading(true);

    setTimeout(() => {
      const lower = userText.toLowerCase();
      let responseText = "";

      if (lower.includes("propriet") || lower.includes("scan") || lower.includes("apartament") || lower.includes("vila")) {
        responseText =
          language === "ro"
            ? "Analiza mea cadastrală sugerează că tranzacțiile în zone central-nordice (ex: Floreasca, Pipera) necesită verificarea extrasului de carte funciară (CF) pentru servituți active sau ipoteci bancare nerezolvate. Poți folosi modulul nostru AI Property Scanner pentru o scanare automată completă."
            : "Property scan analysis: Central-north transactions (e.g. Floreasca, Pipera) require verifying the land registry certificate for easement rights or active bank mortgages. You can run a full check using our AI Property Scanner module.";
      } else if (lower.includes("invest") || lower.includes("randament") || lower.includes("yield") || lower.includes("doband")) {
        responseText =
          language === "ro"
            ? "Randamentele (yield) medii nete în București variază între 5.5% și 6.5% pentru unități premium, comparativ cu 4.5% în Cluj-Napoca. Indicatorul IRCC actualizat la 5.78% favorizează achizițiile cash sau refinanțările strategice. Vezi detalii în Simulatorul nostru de Portofoliu."
            : "Yield optimization: Average net rental yields in Bucharest oscillate between 5.5% and 6.5% for premium units, vs. 4.5% in Cluj-Napoca. The active IRCC rate of 5.78% favors cash transactions or strategic refinancing. Run our Wealth Simulator for customized plans.";
      } else if (lower.includes("legal") || lower.includes("notar") || lower.includes("lege") || lower.includes("contract")) {
        responseText =
          language === "ro"
            ? "Cadrul legal din România impune taxe notariale calculate în tranșe progresive. Pentru proprietăți de peste 450.000 lei, se aplică de asemenea cote specifice de TVA (19% sau 9% pentru locuințe sociale). Vă recomandăm să consultați contractele pre-formulate în secțiunea RO Law."
            : "Legal framework: Notary fees are calculated progressively under Romanian civil codes. Property transactions exceeding 450,000 RON carry standard VAT implications (typically 9% or 19%). We advise reviewing the templates in our RO Law module.";
      } else if (lower.includes("concierge") || lower.includes("jet") || lower.includes("yacht") || lower.includes("lux")) {
        responseText =
          language === "ro"
            ? "Pentru solicitări VIP (chartere avioane private, închirieri de super-iahturi în Mediterană sau rezervări ultra-exclusive), echipa noastră de lifestyle management HNWI vă oferă asistență 24/7. Ne puteți contacta direct pe WhatsApp."
            : "HNWI Lifestyle: For VIP requests (private jet charters, luxury yachts in Monaco/Saint-Tropez, or bespoke lifestyle reservations), our concierge management is available 24/7. Connect with us directly on WhatsApp.";
      } else {
        responseText =
          language === "ro"
            ? "Interogarea ta a fost înregistrată. Pentru a primi o analiză exactă corelată cu rețeaua noastră off-market, poți discuta direct cu un advisor de investiții sau poți lansa o scanare de active."
            : "Your request is registered. To obtain an exact analysis mapped to our off-market listings database, you can connect directly with an investment advisor or launch a scan.";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: responseText,
        },
      ]);
      setLoading(false);
    }, 900);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userText = query.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setQuery("");
    executeAdvisorQuery(userText);
  };

  const handleSuggestion = (topic: string) => {
    setMessages((prev) => [...prev, { sender: "user", text: topic }]);
    executeAdvisorQuery(topic);
  };

  return (
    <>
      {/* ─── ASK AiX™ OVERLAY DRAWER ───────────────────────────────────────── */}
      {chatOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[350px] sm:w-[400px] h-[520px] z-[9999] rounded-3xl border border-zinc-200 bg-white/95 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden animate-in">
          {/* Glowing Top Line */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-500 via-amber-300 to-transparent" />

          {/* Chat Header */}
          <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-white/40">
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-amber-500/10 p-2 border border-amber-500/25 text-amber-500 animate-pulse">
                <Brain className="h-4 w-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-zinc-900 tracking-wide">ASK AiX™</p>
                <p className="text-[9px] font-mono text-amber-500 uppercase tracking-wider">Premium AI Advisor</p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-zinc-400 hover:text-zinc-900 p-1 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 max-w-[85%] ${m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                <div
                  className={`rounded-2xl p-3 text-xs leading-relaxed text-left ${
                    m.sender === "user"
                      ? "bg-amber-500 text-black font-semibold"
                      : "border border-zinc-200 bg-zinc-50/30 text-zinc-600"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 items-center text-[10px] text-zinc-400 italic pl-1">
                <Brain className="h-3 w-3 animate-spin text-amber-500" />
                <span>AiX Advisor analyzing...</span>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Quick Category Suggestions */}
          <div className="px-4 pb-2 pt-1 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            {[
              { label: language === "ro" ? "Scanare Acte" : "Property Scan", icon: Sparkles },
              { label: language === "ro" ? "Randament Chirii" : "Invest Yields", icon: Activity },
              { label: language === "ro" ? "Concierge Lux" : "VIP Concierge", icon: Gem },
            ].map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestion(s.label)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-zinc-200 bg-white/40 text-[9.5px] text-zinc-400 hover:text-zinc-900 hover:border-zinc-300 transition-all whitespace-nowrap cursor-pointer"
              >
                <s.icon className="h-3 w-3 text-amber-500/60" />
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-zinc-200/60 bg-white/40 flex gap-2">
            <input
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                language === "ro"
                  ? "Adresează o întrebare (ex: 'randament')..."
                  : "State your inquiry (e.g. 'yields')..."
              }
              className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-500 focus:border-amber-500/40 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-amber-500 hover:bg-amber-400 text-black p-2.5 transition-colors flex items-center justify-center shrink-0 disabled:opacity-50 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* ─── FLOATING TRIGGER BUTTON & SECONDARY ACTIONS ───────────────────── */}
      <div
        className="fixed top-[55%] -translate-y-1/2 right-4 z-[9999] flex flex-col items-end gap-3 xl:right-6"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {open && (
          <div className="flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Ask AI Trigger */}
            <button
              onClick={() => {
                setChatOpen(true);
                setOpen(false);
              }}
              className="flex min-h-12 items-center gap-3 rounded-full border border-amber-500/20 bg-zinc-50/95 text-amber-400 hover:bg-amber-500/10 px-4 py-3 text-sm backdrop-blur-xl shadow-2xl transition-all font-semibold cursor-pointer"
            >
              <Sparkles className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
              <span>ASK AiX™</span>
            </button>

            {/* Normal Contacts */}
            {[
              {
                href: brandContent.contact.whatsappText,
                label: "WhatsApp",
                icon: MessageCircle,
                tone: "emerald",
                external: true,
              },
              {
                href: `mailto:${brandContent.contact.email}`,
                label: "Email",
                icon: Mail,
                tone: "amber",
                external: false,
              },
              {
                href: `tel:${brandContent.contact.phoneRaw}`,
                label: language === "ro" ? "Telefon" : "Phone",
                icon: Phone,
                tone: "sky",
                external: false,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              const base = "flex min-h-12 items-center gap-3 rounded-full border px-4 py-3 text-sm backdrop-blur-xl shadow-2xl transition-all focus-visible:outline-none";
              const toneClass =
                item.tone === "emerald"
                  ? "border-emerald-500/20 bg-zinc-50/95 text-emerald-400 hover:bg-emerald-500/10"
                  : item.tone === "amber"
                    ? "border-amber-500/20 bg-zinc-50/95 text-amber-400 hover:bg-amber-500/10"
                    : "border-sky-500/20 bg-zinc-50/95 text-sky-400 hover:bg-sky-500/10";

              const content = (
                <>
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </>
              );

              if (item.external) {
                return (
                  <a
                    key={idx}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className={`${base} ${toneClass}`}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`${base} ${toneClass}`}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close panel" : "Open advisor panel"}
          aria-expanded={open}
          className={`relative flex h-14 w-14 items-center justify-center rounded-full border shadow-2xl transition-all duration-300 focus-visible:outline-none cursor-pointer ${
            open
              ? "border-zinc-200 bg-zinc-50/95 text-zinc-200"
              : "border-amber-500/20 bg-amber-500 text-black hover:bg-amber-400"
          }`}
        >
          {!open && <span className="absolute inset-0 rounded-full bg-amber-400/30 animate-ping" />}
          <span className="absolute inset-0 rounded-full bg-amber-400/10 blur-md" />
          {open ? <X className="h-5 w-5" /> : <Brain className="h-5 w-5" />}
        </button>
      </div>
    </>
  );
}

export default FloatingCTA;

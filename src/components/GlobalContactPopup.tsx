"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Sparkles,
  MessageCircle,
  Phone,
  Mail,
  Brain,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import { brandContent } from "@/lib/content/brand";
import { designSystem } from "@/styles/designSystem";
import { submitContactForm } from "@/lib/contactSubmit";

const SHOWN_KEY = "aix_global_popup_shown_v5";

export function GlobalContactPopup() {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [botfield, setBotfield] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const autoTriggeredRef = useRef(false);

  useEffect(() => {
    // Manual trigger listener
    const handleOpen = () => setVisible(true);
    window.addEventListener("open-contact-popup", handleOpen);

    // Check if shown once in this browser to prevent continuous auto-trigger
    try {
      const alreadyShown = localStorage.getItem(SHOWN_KEY);
      if (alreadyShown) {
        return () => window.removeEventListener("open-contact-popup", handleOpen);
      }
    } catch {}

    // Auto-trigger: mouseleave exit intent (desktop only)
    const handleMouseLeave = (e: MouseEvent) => {
      if (autoTriggeredRef.current) return;
      if (e.clientY <= 15) {
        autoTriggeredRef.current = true;
        setVisible(true);
        try {
          localStorage.setItem(SHOWN_KEY, "true");
        } catch {}
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
    if (!("ontouchstart" in window)) {
      document.addEventListener("mouseleave", handleMouseLeave);
    }

    // Auto-trigger: Scroll depth 60% (desktop only)
    const handleScroll = () => {
      if (autoTriggeredRef.current) return;
      const scrolled = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0 && scrolled / docHeight > 0.6) {
        autoTriggeredRef.current = true;
        setVisible(true);
        try {
          localStorage.setItem(SHOWN_KEY, "true");
        } catch {}
        window.removeEventListener("scroll", handleScroll);
      }
    };
    const isTouch = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
    if (!isTouch) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("open-contact-popup", handleOpen);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (!isTouch) {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  function dismiss() {
    setVisible(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await submitContactForm({
        service: "General Consultation (Popup)",
        page: window.location.pathname,
        name,
        phone,
        email: email || undefined,
        source: "popup",
        botfield: botfield || undefined,
      });
      setSubmitted(true);
      setTimeout(dismiss, 3000);
    } catch (err: any) {
      setError(err.message || "Eroare la trimitere.");
    } finally {
      setLoading(false);
    }
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-[10%] right-4 sm:right-8 z-[250] w-full max-w-[360px] rounded-3xl p-5 sm:p-6 space-y-4 border border-zinc-850 bg-[#080808]/95 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-350 pointer-events-auto text-left"
      role="dialog"
      aria-label="AiX Luxury Advisor Hub"
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={dismiss}
        className="absolute top-3.5 right-3.5 rounded-lg p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-900/60 transition-all border border-transparent"
        aria-label="Închide"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      {/* Brand Header */}
      <div className="flex items-start gap-3 border-b border-zinc-900 pb-3">
        <div className="rounded-xl bg-amber-500/10 p-2 border border-amber-500/20 flex-shrink-0">
          <Sparkles className="h-4 w-4 text-amber-400" />
        </div>
        <div>
          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-amber-500">
            AiX OS &bull; Intelligence
          </p>
          <h2 className="text-sm font-semibold text-white mt-0.5">Asistență Premium</h2>
          <p className="text-[10px] text-zinc-500 leading-normal mt-0.5">
            Consultanță imobiliară, asigurări active HNWI și sprijin direct.
          </p>
        </div>
      </div>

      {/* Quick Channels Grid */}
      <div className="grid grid-cols-2 gap-2">
        <a
          href={brandContent.contact.whatsappText}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2.5 hover:bg-emerald-500/10 transition-all text-left"
        >
          <MessageCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-white">WhatsApp</p>
            <p className="text-[8.5px] text-emerald-500/80 truncate">{brandContent.contact.phone}</p>
          </div>
        </a>

        <a
          href={`tel:${brandContent.contact.phoneRaw}`}
          className="flex items-center gap-2 rounded-xl border border-zinc-900 bg-zinc-950 p-2.5 hover:bg-zinc-900 transition-all text-left"
        >
          <Phone className="h-4.5 w-4.5 text-zinc-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-white">Apel VIP</p>
            <p className="text-[8.5px] text-zinc-500 truncate">{brandContent.contact.phone}</p>
          </div>
        </a>

        <a
          href={`mailto:${brandContent.contact.email}`}
          className="flex items-center gap-2 rounded-xl border border-zinc-900 bg-zinc-950 p-2.5 hover:bg-zinc-900 transition-all text-left col-span-2"
        >
          <Mail className="h-4.5 w-4.5 text-zinc-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-white">E-mail</p>
            <p className="text-[9px] text-zinc-500 truncate">{brandContent.contact.email}</p>
          </div>
        </a>
      </div>

      {/* Short Form */}
      <div className="pt-2 border-t border-zinc-900 space-y-2">
        {submitted ? (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
            <p className="text-emerald-400 text-[10px] font-bold">✓ Solicitare înregistrată!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="text"
              name="botfield"
              value={botfield}
              onChange={(e) => setBotfield(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nume"
                className="rounded-lg border border-zinc-850 bg-zinc-950 px-2.5 py-2 text-[10px] text-white placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none"
              />
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Telefon"
                className="rounded-lg border border-zinc-850 bg-zinc-950 px-2.5 py-2 text-[10px] text-white placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-amber-500 text-black py-2.5 text-[9.5px] font-bold uppercase tracking-wider hover:bg-amber-400 transition-all flex items-center justify-center gap-1 disabled:opacity-50"
            >
              {loading && <RefreshCw className="h-3 w-3 animate-spin" />}
              <span>{loading ? "Se trimite..." : "Solicită Sunet"}</span>
              {!loading && <ArrowRight className="h-3 w-3" />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
export default GlobalContactPopup;

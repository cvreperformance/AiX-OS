"use client";

import { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  Brain,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { brandContent } from "@/lib/content/brand";
import { designSystem } from "@/styles/designSystem";

const DISMISSED_KEY = "aix_global_popup_dismissed";
const DISMISS_DURATION = 3 * 24 * 60 * 60 * 1000; // 3 days

export function GlobalContactPopup() {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // 1. Listen for manual trigger event
    const handleOpen = () => setVisible(true);
    window.addEventListener("open-contact-popup", handleOpen);

    // Check if user dismissed recently
    try {
      const ts = localStorage.getItem(DISMISSED_KEY);
      if (ts && Date.now() - Number(ts) < DISMISS_DURATION) {
        return () => window.removeEventListener("open-contact-popup", handleOpen);
      }
    } catch {}

    // 2. Exit Intent Trigger
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 15) {
        setVisible(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);

    // 3. CTA Popup on Scroll (triggers when scrolling past 60% of page height)
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0 && scrolled / docHeight > 0.6) {
        setVisible(true);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("open-contact-popup", handleOpen);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    } catch {}
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(dismiss, 3000);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[250] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="AiX Luxury Advisor Hub"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Main Luxury Modal Panel */}
      <div className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[90vh] ${designSystem.glassSolid}`}>
        
        {/* Close Button */}
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-4 right-4 rounded-xl p-2 text-zinc-550 hover:text-white hover:bg-zinc-900/60 transition-all border border-transparent hover:border-zinc-850"
          aria-label="Închide"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Brand Header */}
        <div className="flex items-start gap-4 border-b border-zinc-900 pb-5">
          <div className="rounded-2xl bg-amber-500/10 p-3 border border-amber-500/20">
            <Sparkles className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <p className={designSystem.tickerText}>
              AiX OS · Intelligence Desk
            </p>
            <h2 className="text-xl font-light text-white mt-1">Conexiune Clienți Elită</h2>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Soluții de brokeraj exclusivist, private banking imobiliar și asistență directă asistată de AI.
            </p>
          </div>
        </div>

        {/* Communication Channels */}
        <div className="space-y-3">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-zinc-550">Canale Securizate de Contact</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* WhatsApp */}
            <a
              href={brandContent.contact.whatsappText}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-3 hover:bg-emerald-500/10 transition-all group"
            >
              <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400 group-hover:scale-105 transition-transform">
                <MessageCircle className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">WhatsApp Direct</p>
                <p className="text-[10px] text-emerald-400/80">{brandContent.contact.phone}</p>
              </div>
            </a>

            {/* Direct Call */}
            <a
              href={`tel:${brandContent.contact.phoneRORaw}`}
              className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/10 p-3 hover:bg-zinc-900/30 hover:border-zinc-700 transition-all group"
            >
              <div className="rounded-xl bg-zinc-850 p-2 text-zinc-400 group-hover:scale-105 transition-transform">
                <Phone className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Apel Asistență</p>
                <p className="text-[10px] text-zinc-405">{brandContent.contact.phoneRO}</p>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${brandContent.contact.email}`}
              className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/10 p-3 hover:bg-zinc-900/30 hover:border-zinc-700 transition-all group"
            >
              <div className="rounded-xl bg-zinc-850 p-2 text-zinc-400 group-hover:scale-105 transition-transform">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">E-mail Premium</p>
                <p className="text-[10px] text-zinc-405">{brandContent.contact.email}</p>
              </div>
            </a>

            {/* AI Advisor Entry Point */}
            <Link
              href="/ai"
              onClick={dismiss}
              className="flex items-center gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-3 hover:bg-amber-500/10 transition-all group"
            >
              <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400 group-hover:scale-105 transition-transform">
                <Brain className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">AI Advisor OS</p>
                <p className="text-[10px] text-amber-400/80">Discută cu inteligența artificială</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Dynamic inquiry form */}
        <div className="border-t border-zinc-900 pt-5 space-y-3.5">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-zinc-550">Trimite Solicitare Exclusivă</p>
          {submitted ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
              <p className="text-emerald-400 text-xs font-semibold">✓ Solicitare trimisă!</p>
              <p className="text-[10px] text-zinc-400 mt-1">Consilierul desemnat vă va contacta telefonic în cel mai scurt timp.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="name"
                  required
                  placeholder="Numele dvs."
                  className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500/50 focus:outline-none transition-colors"
                />
                <input
                  name="phone"
                  required
                  type="tel"
                  placeholder="Număr telefon"
                  className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500/50 focus:outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-amber-500 text-black py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-amber-400 transition-all shadow-md shadow-amber-500/10 flex items-center justify-center gap-1"
              >
                Transmite Securizat
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
export default GlobalContactPopup;

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
} from "lucide-react";
import Link from "next/link";
import { brandContent } from "@/lib/content/brand";
import { designSystem } from "@/styles/designSystem";

const DISMISSED_KEY = "aix_global_popup_dismissed";
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days — only manual triggers after dismiss

export function GlobalContactPopup() {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  // Track if auto-trigger has already fired this session — never fire auto again after first show
  const autoTriggeredRef = useRef(false);

  useEffect(() => {
    // Always register the manual trigger (buttons dispatching open-contact-popup)
    const handleOpen = () => setVisible(true);
    window.addEventListener("open-contact-popup", handleOpen);

    // Check if user dismissed recently — skip ALL auto-triggers if so
    try {
      const ts = localStorage.getItem(DISMISSED_KEY);
      if (ts && Date.now() - Number(ts) < DISMISS_DURATION) {
        return () => window.removeEventListener("open-contact-popup", handleOpen);
      }
    } catch {}

    // Exit Intent (desktop only — mouseleave at top of viewport)
    // Only fires ONCE per session and only if not already triggered
    const handleMouseLeave = (e: MouseEvent) => {
      if (autoTriggeredRef.current) return;
      if (e.clientY <= 15) {
        autoTriggeredRef.current = true;
        setVisible(true);
        // Remove itself immediately — never fires again
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
    // Only attach on non-touch devices
    if (!("ontouchstart" in window)) {
      document.addEventListener("mouseleave", handleMouseLeave);
    }

    // Scroll trigger — fires ONCE at 60% page depth, then removes itself
    const handleScroll = () => {
      if (autoTriggeredRef.current) return;
      const scrolled = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0 && scrolled / docHeight > 0.6) {
        autoTriggeredRef.current = true;
        setVisible(true);
        // Remove itself immediately — never fires again this session
        window.removeEventListener("scroll", handleScroll);
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
      className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="AiX Luxury Advisor Hub"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Modal Panel — slides up on mobile, centers on desktop */}
      <div
        className={`relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[92vh] sm:max-h-[90vh] ${designSystem.glassSolid} animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-4 right-4 rounded-xl p-2.5 text-zinc-400 hover:text-white hover:bg-zinc-900/60 transition-all border border-transparent hover:border-zinc-800"
          aria-label="Închide"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Brand Header */}
        <div className="flex items-start gap-4 border-b border-zinc-900 pb-5">
          <div className="rounded-2xl bg-amber-500/10 p-3 border border-amber-500/20 flex-shrink-0">
            <Sparkles className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-amber-500">
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
              <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400 group-hover:scale-105 transition-transform flex-shrink-0">
                <MessageCircle className="h-4 w-4" />
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
              <div className="rounded-xl bg-zinc-800 p-2 text-zinc-400 group-hover:scale-105 transition-transform flex-shrink-0">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Apel Asistență</p>
                <p className="text-[10px] text-zinc-500">{brandContent.contact.phoneRO}</p>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${brandContent.contact.email}`}
              className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/10 p-3 hover:bg-zinc-900/30 hover:border-zinc-700 transition-all group"
            >
              <div className="rounded-xl bg-zinc-800 p-2 text-zinc-400 group-hover:scale-105 transition-transform flex-shrink-0">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">E-mail Premium</p>
                <p className="text-[10px] text-zinc-500">{brandContent.contact.email}</p>
              </div>
            </a>

            {/* AI Advisor */}
            <Link
              href="/ai"
              onClick={dismiss}
              className="flex items-center gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-3 hover:bg-amber-500/10 transition-all group"
            >
              <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400 group-hover:scale-105 transition-transform flex-shrink-0">
                <Brain className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">AI Advisor OS</p>
                <p className="text-[10px] text-amber-400/80">Discută cu inteligența artificială</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Inquiry form */}
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
                  className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-amber-500/50 focus:outline-none transition-colors"
                />
                <input
                  name="phone"
                  required
                  type="tel"
                  placeholder="Număr telefon"
                  className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-amber-500/50 focus:outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-amber-500 text-black py-3 text-xs font-semibold uppercase tracking-wider hover:bg-amber-400 transition-all shadow-md shadow-amber-500/10 flex items-center justify-center gap-1.5"
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

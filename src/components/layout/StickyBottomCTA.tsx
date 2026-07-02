"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { brandContent } from "@/lib/content/brand";

const DISMISSED_KEY = "aix_sticky_cta_dismissed";
const DISMISS_DURATION = 3 * 24 * 60 * 60 * 1000; // 3 days

export function StickyBottomCTA() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const ts = localStorage.getItem(DISMISSED_KEY);
      if (ts && Date.now() - Number(ts) < DISMISS_DURATION) return;
    } catch {}
    // Show after 5 seconds
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    } catch {}
  }

  if (!mounted || !visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[150] flex items-center justify-between gap-3 border-t border-zinc-800/80 bg-[#0f0f0f]/95 backdrop-blur-md px-4 py-3 md:px-6 animate-in">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-amber-500/10 p-2 flex-shrink-0">
          <MessageCircle className="h-4 w-4 text-amber-400" />
        </div>
        <div>
          <p className="text-xs font-medium text-white">
            Consultanță gratuită cu Cristian Văduva
          </p>
          <p className="text-xs text-zinc-500 hidden sm:block">
            Monaco · Dubai · București · {brandContent.contact.phone}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <a
          href={brandContent.contact.whatsappText}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-500 transition-all"
          onClick={dismiss}
        >
          <MessageCircle className="h-3.5 w-3.5" />
          WhatsApp
        </a>
        <a
          href={brandContent.urls.propertyForm}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center rounded-full border border-zinc-700 px-4 py-2 text-xs text-zinc-300 hover:text-white hover:border-amber-500/30 transition-all"
          onClick={dismiss}
        >
          Formular
        </a>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-lg p-1.5 text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800 transition-all"
          aria-label="Închide"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Brain, X, MessageCircle, Mail, Phone, ArrowRight } from "lucide-react";
import { brandContent } from "@/lib/content/brand";
import { useLanguage } from "@/context/LanguageContext";

export function FloatingCTA() {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);

  const items = [
    {
      href: brandContent.contact.whatsappText,
      labelRo: "WhatsApp",
      labelEn: "WhatsApp",
      icon: MessageCircle,
      external: true,
      tone: "emerald",
    },
    {
      href: `mailto:${brandContent.contact.email}`,
      labelRo: "Email",
      labelEn: "Email",
      icon: Mail,
      external: false,
      tone: "amber",
    },
    {
      href: `tel:${brandContent.contact.phoneRaw}`,
      labelRo: "Telefon",
      labelEn: "Phone",
      icon: Phone,
      external: false,
      tone: "sky",
    },
    {
      href: "/contact",
      labelRo: "Contact",
      labelEn: "Contact",
      icon: ArrowRight,
      external: false,
      tone: "zinc",
    },
  ] as const;

  return (
    <div
      className="fixed bottom-5 right-4 z-[120] flex flex-col items-end gap-3 xl:right-6"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {open && (
        <div className="flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {items.map((item) => {
            const Icon = item.icon;
            const base = "flex min-h-12 items-center gap-3 rounded-full border px-4 py-3 text-sm backdrop-blur-xl shadow-2xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40";
            const toneClass =
              item.tone === "emerald"
                ? "border-emerald-500/20 bg-[#090909]/95 text-emerald-400 hover:bg-emerald-500/10"
                : item.tone === "amber"
                  ? "border-amber-500/20 bg-[#090909]/95 text-amber-400 hover:bg-amber-500/10"
                  : item.tone === "sky"
                    ? "border-sky-500/20 bg-[#090909]/95 text-sky-400 hover:bg-sky-500/10"
                    : "border-zinc-800 bg-[#090909]/95 text-zinc-200 hover:bg-zinc-900/90";

            const content = (
              <>
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span className="font-medium">{language === "ro" ? item.labelRo : item.labelEn}</span>
              </>
            );

            if (item.external) {
              return (
                <a
                  key={item.href}
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
                key={item.href}
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
        aria-label={open ? (language === "ro" ? "Închide contact" : "Close contact") : (language === "ro" ? "Deschide contact" : "Open contact")}
        aria-expanded={open}
        className={`relative flex h-14 w-14 items-center justify-center rounded-full border shadow-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 ${
          open
            ? "border-zinc-800 bg-[#0a0a0a]/95 text-zinc-200"
            : "border-amber-500/20 bg-amber-500/90 text-black hover:bg-amber-400"
        }`}
      >
        {!open && <span className="absolute inset-0 rounded-full bg-amber-400/30 animate-ping" />}
        <span className="absolute inset-0 rounded-full bg-amber-400/10 blur-md" />
        {open ? <X className="h-5 w-5" /> : <Brain className="h-5 w-5" />}
      </button>
    </div>
  );
}

export default FloatingCTA;

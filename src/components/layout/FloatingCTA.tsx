"use client";

import { useState } from "react";
import {
  MessageCircle,
  Phone,
  Mail,
  X,
  ExternalLink,
  Send,
  Calendar,
} from "lucide-react";
import { brandContent } from "@/lib/content/brand";
import Link from "next/link";

export function FloatingCTA() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-16 right-4 z-[100] flex flex-col items-end gap-3 md:bottom-6">
      {/* Expanded menu */}
      {open && (
        <div className="animate-in flex flex-col gap-2 items-end">
          {/* WhatsApp */}
          <a
            href={brandContent.contact.whatsappText}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-400 hover:bg-emerald-500/20 backdrop-blur-sm transition-all shadow-lg"
            onClick={() => setOpen(false)}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="font-medium">WhatsApp</span>
            <span className="text-xs opacity-70">{brandContent.contact.phone}</span>
          </a>

          {/* Phone RO */}
          <a
            href={`tel:${brandContent.contact.phoneRORaw}`}
            className="flex items-center gap-2.5 rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-2.5 text-sm text-zinc-200 hover:border-amber-500/30 hover:text-white backdrop-blur-sm transition-all shadow-lg"
            onClick={() => setOpen(false)}
          >
            <Phone className="h-4 w-4 text-amber-400" />
            <span>{brandContent.contact.phoneRO}</span>
          </a>

          {/* Email */}
          <a
            href={`mailto:${brandContent.contact.email}`}
            className="flex items-center gap-2.5 rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-2.5 text-sm text-zinc-200 hover:border-amber-500/30 hover:text-white backdrop-blur-sm transition-all shadow-lg"
            onClick={() => setOpen(false)}
          >
            <Mail className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">{brandContent.contact.email}</span>
            <span className="sm:hidden">Email</span>
          </a>

          {/* Telegram */}
          <a
            href={brandContent.contact.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-2.5 text-sm text-zinc-200 hover:border-amber-500/30 hover:text-white backdrop-blur-sm transition-all shadow-lg"
            onClick={() => setOpen(false)}
          >
            <Send className="h-4 w-4 text-blue-400" />
            Telegram Channel
          </a>

          {/* Schedule Meeting */}
          <a
            href={brandContent.urls.membershipForm}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-400 hover:bg-amber-500/20 backdrop-blur-sm transition-all shadow-lg"
            onClick={() => setOpen(false)}
          >
            <Calendar className="h-4 w-4 text-amber-400" />
            <span>Programare Meeting</span>
          </a>

          {/* Contact form quick link */}
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-2.5 text-sm text-zinc-200 hover:border-amber-500/30 hover:text-white backdrop-blur-sm transition-all shadow-lg text-left"
            onClick={() => {
              setOpen(false);
              window.dispatchEvent(new CustomEvent("open-contact-popup"));
            }}
          >
            <ExternalLink className="h-4 w-4 text-zinc-400" />
            Consultanță gratuită
          </button>
        </div>
      )}

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Închide contacte" : "Deschide contacte"}
        className={`relative flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 ${
          open
            ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            : "bg-amber-500/90 text-black hover:bg-amber-400"
        }`}
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <>
            <MessageCircle className="h-5 w-5" />
            {/* Pulse */}
            <span className="absolute inset-0 rounded-full bg-amber-400/40 animate-ping" />
          </>
        )}
      </button>
    </div>
  );
}

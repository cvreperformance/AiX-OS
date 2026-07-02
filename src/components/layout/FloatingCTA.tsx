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
  Brain,
} from "lucide-react";
import { brandContent } from "@/lib/content/brand";
import Link from "next/link";

export function FloatingCTA() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 z-[100] flex flex-col items-end gap-3 xl:bottom-6 xl:right-6" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      {/* Expanded menu */}
      {open && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-2 items-end max-h-[60vh] overflow-y-auto">
          {/* WhatsApp */}
          <a
            href={brandContent.contact.whatsappText}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-[#0c0c0c]/90 text-emerald-400 hover:bg-emerald-500/10 backdrop-blur-md px-4 py-2.5 text-sm transition-all shadow-lg"
            onClick={() => setOpen(false)}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="font-medium">WhatsApp</span>
            <span className="text-xs opacity-70">{brandContent.contact.phone}</span>
          </a>

          {/* Phone RO */}
          <a
            href={`tel:${brandContent.contact.phoneRORaw}`}
            className="flex items-center gap-2.5 rounded-full border border-zinc-800 bg-[#0c0c0c]/90 px-4 py-2.5 text-sm text-zinc-200 hover:border-amber-500/30 hover:text-white backdrop-blur-md transition-all shadow-lg"
            onClick={() => setOpen(false)}
          >
            <Phone className="h-4 w-4 text-amber-400" />
            <span>{brandContent.contact.phoneRO}</span>
          </a>

          {/* Email */}
          <a
            href={`mailto:${brandContent.contact.email}`}
            className="flex items-center gap-2.5 rounded-full border border-zinc-800 bg-[#0c0c0c]/90 px-4 py-2.5 text-sm text-zinc-200 hover:border-amber-500/30 hover:text-white backdrop-blur-md transition-all shadow-lg"
            onClick={() => setOpen(false)}
          >
            <Mail className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">{brandContent.contact.email}</span>
            <span className="sm:hidden">Email</span>
          </a>

          {/* AI Advisor */}
          <Link
            href="/money-advisor"
            className="flex items-center gap-2.5 rounded-full border border-violet-500/30 bg-[#0c0c0c]/90 px-4 py-2.5 text-sm text-violet-400 hover:border-violet-500/50 hover:text-white backdrop-blur-md transition-all shadow-lg"
            onClick={() => setOpen(false)}
          >
            <Brain className="h-4 w-4 text-violet-400" />
            <span>AI Advisor</span>
          </Link>

          {/* Telegram */}
          <a
            href={brandContent.contact.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-full border border-zinc-800 bg-[#0c0c0c]/90 px-4 py-2.5 text-sm text-zinc-200 hover:border-amber-500/30 hover:text-white backdrop-blur-md transition-all shadow-lg"
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
            className="flex items-center gap-2.5 rounded-full border border-amber-500/30 bg-[#0c0c0c]/90 px-4 py-2.5 text-sm text-amber-400 hover:bg-amber-500/10 backdrop-blur-md transition-all shadow-lg"
            onClick={() => setOpen(false)}
          >
            <Calendar className="h-4 w-4 text-amber-400" />
            <span>Programare Meeting</span>
          </a>

          {/* Contact form quick link */}
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-full border border-zinc-800 bg-[#0c0c0c]/90 px-4 py-2.5 text-sm text-zinc-200 hover:border-amber-500/30 hover:text-white backdrop-blur-md transition-all shadow-lg text-left"
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

"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Bell, Activity, Star, Calendar, MessageSquare, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function NotificationPopover() {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const notifications = [
    {
      id: 1,
      textRo: "Poliță BNR actualizată: Rata de politică monetară rămâne stabilă la 6.25%.",
      textEn: "BNR Policy Interest Rate remains stable at 6.25% in the latest release.",
      timeRo: "acum 1 oră",
      timeEn: "1 hour ago",
      icon: Activity,
      color: "text-amber-400",
    },
    {
      id: 2,
      textRo: "Proprietate Nouă: Tour Odeon Sky Penthouse listat în Monaco portofoliu.",
      textEn: "New Listing: Tour Odeon Sky Penthouse added to Monaco portfolio.",
      timeRo: "acum 3 ore",
      timeEn: "3 hours ago",
      icon: Star,
      color: "text-yellow-400",
    },
    {
      id: 3,
      textRo: "Rata Inflației RO: Scădere la 4.6% în conformitate cu rapoartele INS.",
      textEn: "RO Inflation Rate drops to 4.6% according to official INS data.",
      timeRo: "acum 1 zi",
      timeEn: "1 day ago",
      icon: Calendar,
      color: "text-emerald-400",
    },
    {
      id: 4,
      textRo: "Alerte Securitate: Recomandare Yubico hardware MFA pe conturi bancare.",
      textEn: "Cyber Security Alert: Recommended hardware MFA keys on active registers.",
      timeRo: "acum 2 zile",
      timeEn: "2 days ago",
      icon: ShieldAlert,
      color: "text-red-400",
    },
  ];

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative z-45">
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={language === "ro" ? "Alerte" : "Notifications"}
        aria-expanded={open}
        className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-white/60 text-zinc-400 transition-all hover:border-zinc-300 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/35 shrink-0"
      >
        <Bell className="h-4.5 w-4.5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
      </button>

      {/* Popover Card */}
      {open && (
        <div className="absolute -right-2 sm:right-0 top-full mt-2.5 w-[calc(100vw-2rem)] max-w-[320px] sm:w-80 sm:max-w-none rounded-2xl border border-zinc-200 bg-white/98 backdrop-blur-3xl shadow-2xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
            <span className="text-[10px] uppercase tracking-wider text-zinc-550 font-bold font-mono">
              {language === "ro" ? "Alerte Recente" : "Intelligence Alerts"}
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-[9px] text-zinc-650 hover:text-zinc-900 uppercase font-mono font-semibold"
            >
              {language === "ro" ? "Închide" : "Close"}
            </button>
          </div>

          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1 scrollbar-none overflow-x-hidden">
            {notifications.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex gap-3 p-2.5 rounded-xl border border-transparent hover:border-zinc-200 hover:bg-white/40 transition-colors"
                >
                  <div className={`rounded-lg bg-zinc-50 p-2 ${item.color} shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <p className="text-[11px] text-zinc-600 leading-normal break-words">
                      {language === "ro" ? item.textRo : item.textEn}
                    </p>
                    <span className="text-[9px] text-zinc-550 font-mono block">
                      {language === "ro" ? item.timeRo : item.timeEn}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

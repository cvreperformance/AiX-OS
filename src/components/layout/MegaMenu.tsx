"use client";

import Link from "next/link";
import { navigationCategories } from "@/config/navigation.config";
import { useLanguage } from "@/context/LanguageContext";
import { useRef } from "react";

type MegaMenuProps = {
  onClose: () => void;
  onMouseEnter?: () => void; // called by header when mouse enters the trigger
};

export function MegaMenu({ onClose, onMouseEnter }: MegaMenuProps) {
  const { language } = useLanguage();
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (onMouseEnter) onMouseEnter();
  };

  const handleLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      onClose();
    }, 250);
  };

  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[min(900px,calc(100vw-32px))] max-w-[calc(100vw-32px)] max-h-[calc(100vh-100px)] overflow-y-auto overflow-x-hidden rounded-[32px] bg-[rgba(12,12,12,.92)] backdrop-blur-[24px] border border-zinc-800 shadow-[0_20px_80px_rgba(0,0,0,0.4)] z-[99999] transition-opacity duration-200 ease-out flex flex-col"
      style={{ opacity: 1, transform: "translate(-50%, 0)" }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Header bar inside the mega menu */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700 text-amber-300">
        <h2 className="text-sm font-medium">
          {language === "ro" ? "Servicii Platformă" : "Platform Services"}
        </h2>
        <Link
          href="/services"
          onClick={onClose}
          className="flex items-center gap-1 text-xs font-semibold uppercase text-amber-300 hover:text-amber-200"
        >
          {language === "ro" ? "Vezi toate serviciile" : "View all services"}
        </Link>
      </div>

      {/* Grid of category cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-6">
        {navigationCategories.map((cat) => {
          const Icon = cat.icon;
          const title = language === "ro" ? cat.title : cat.titleEn;
          return (
            <div
              key={cat.id}
              className="flex flex-col rounded-[32px] bg-zinc-900/60 border border-zinc-800 p-6 hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon className="h-5 w-5 text-amber-300 transition-transform duration-200" />
                <h3 className="text-lg font-bold text-amber-300">{title}</h3>
              </div>
              {cat.description && (
                <p className="text-xs text-zinc-400 mb-3">{cat.description}</p>
              )}
              <ul className="flex flex-col gap-2">
                {cat.items.map((item) => {
                  const label = language === "ro" ? item.label : item.labelEn;
                  return (
                    <li key={item.id} className="group flex items-center justify-between">
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="text-sm text-zinc-400 group-hover:text-amber-300 transition-colors duration-200"
                      >
                        {label}
                      </Link>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-amber-300">
                        →
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

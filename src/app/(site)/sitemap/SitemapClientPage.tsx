"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { PageHeader } from "@/components/ui";
import { navigationCategories, mainNavLinks } from "@/config/navigation.config";
import { Home, Phone, Settings, Shield, User, ArrowRight, Brain } from "lucide-react";

export default function SitemapClientPage() {
  const { language } = useLanguage();

  const corePages = [
    { href: "/", label: language === "ro" ? "Acasă" : "Home", icon: Home },
    { href: "/contact", label: language === "ro" ? "Contact" : "Contact", icon: Phone },
    { href: "/brain", label: "AiX Brain™", icon: Brain },
    { href: "/dashboard", label: "Dashboard", icon: Settings },
    { href: "/admin", label: "Admin (Auth Required)", icon: Shield },
    { href: "/login", label: language === "ro" ? "Autentificare" : "Login", icon: User },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-12">
      <PageHeader
        badge={language === "ro" ? "Index platformă" : "Platform index"}
        title={language === "ro" ? "Sitemap" : "Sitemap"}
        subtitle={
          language === "ro"
            ? "Harta completă a sistemului decizional AiX OS™."
            : "Complete map of the AiX OS™ decision system."
        }
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Core Pages */}
        <section className="rounded-3xl border border-zinc-850 bg-[#080808]/60 p-6 sm:p-8 space-y-6 h-fit">
          <div className="border-b border-zinc-900 pb-4">
            <h2 className="text-xl text-white font-medium">
              {language === "ro" ? "Pagini Principale" : "Core Pages"}
            </h2>
          </div>
          <div className="grid gap-3">
            {corePages.map((page) => {
              const Icon = page.icon;
              return (
                <Link
                  key={page.href}
                  href={page.href}
                  className="group flex items-center justify-between rounded-2xl border border-zinc-850/60 bg-zinc-950/20 p-4 transition-all hover:border-amber-500/25 hover:bg-zinc-900/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-400 group-hover:text-amber-400 transition-colors">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                      {page.label}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-amber-400" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Categories */}
        <div className="space-y-8">
          {navigationCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <section key={cat.id} className="rounded-3xl border border-zinc-850 bg-[#080808]/60 p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 ${cat.color}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <h2 className="text-lg text-white font-medium">
                    {language === "ro" ? cat.title : cat.titleEn}
                  </h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {cat.items.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="group flex flex-col gap-1 rounded-xl border border-transparent p-3 transition-all hover:bg-zinc-900/40 hover:border-zinc-800"
                    >
                      <span className="text-sm font-medium text-zinc-300 group-hover:text-amber-400 transition-colors">
                        {language === "ro" ? item.label : item.labelEn}
                      </span>
                      <span className="text-xs text-zinc-500 line-clamp-1">
                        {language === "ro" ? item.desc : item.descEn}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

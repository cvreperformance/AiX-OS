"use client";

import { Mail, MapPin, MessageCircle, Phone, Clock, Globe } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { siteConfig } from "@/lib/config";
import ContactForm from "./ContactForm";
import { useLanguage } from "@/context/LanguageContext";

export function ContactClientPage() {
  const { language } = useLanguage();

  const contactItems = [
    {
      icon: Mail,
      label: language === "ro" ? "Email" : "Email",
      value: siteConfig.contact.email,
      href: `mailto:${siteConfig.contact.email}`,
    },
    {
      icon: Phone,
      label: language === "ro" ? "Telefon" : "Phone",
      value: siteConfig.contact.phone,
      href: `tel:${siteConfig.contact.phone}`,
    },
    {
      icon: MessageCircle,
      label: language === "ro" ? "WhatsApp" : "WhatsApp",
      value: language === "ro" ? "Mesaj direct →" : "Direct Message →",
      href: siteConfig.contact.whatsapp,
      external: true,
    },
    {
      icon: MapPin,
      label: language === "ro" ? "Locație" : "Location",
      value: language === "ro" ? "Monaco · Dubai · Viena · București" : "Monaco · Dubai · Vienna · Bucharest",
      href: null,
    },
    {
      icon: Clock,
      label: language === "ro" ? "Program" : "Schedule",
      value: language === "ro" ? "Non-stop disponibil" : "Non-stop available",
      href: null,
    },
    {
      icon: Globe,
      label: language === "ro" ? "Rețea globală" : "Global Network",
      value: language === "ro" ? "Monaco · Dubai · Viena · București" : "Monaco · Dubai · Vienna · Bucharest",
      href: null,
    },
  ];

  const serviceCategories = [
    {
      title: "Buyer Representation",
      desc: language === "ro"
        ? "Cumpărare cu expert în echipă. Due diligence, negociere."
        : "Acquisition with an expert on your side. Due diligence, negotiation.",
      href: "/buyer"
    },
    {
      title: "Seller Representation",
      desc: language === "ro"
        ? "Marketing premium. Preț maxim în timp minim."
        : "Premium marketing. Maximum price in minimum time.",
      href: "/seller"
    },
    {
      title: "Investment Intelligence",
      desc: language === "ro"
        ? "Analiză piețe globale. ROI, AiX Score, strategii."
        : "Global market analysis. ROI, AiX Score, strategies.",
      href: "/investments"
    },
    {
      title: "AntiȚeapă & Valuation",
      desc: language === "ro"
        ? "Verificare completă. Evaluare AI. Protecție totală."
        : "Full verification. AI valuation. Total asset protection.",
      href: "/anti-teapa"
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16">
      <PageHeader
        badge={language === "ro" ? "Contact Desk Privat" : "Private Desk Contact"}
        title={language === "ro" ? "Hai să vorbim" : "Let's Talk"}
        subtitle={
          language === "ro"
            ? "Consultații private pentru investitori, buyer/seller representation și market intelligence personalizat."
            : "Private consulting for investors, buyer/seller representation, and custom market intelligence."
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Left — Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact details */}
          <div className="space-y-5">
            {contactItems.map((item) => (
              <div key={item.label} className="flex items-center gap-4 text-left">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-550">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="text-zinc-200 hover:text-amber-400 transition-colors text-sm"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-zinc-200 text-sm">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick CTA cards */}
          <div className="space-y-3 text-left">
            <a
              href={siteConfig.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 hover:bg-emerald-500/10 transition-all"
            >
              <MessageCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">WhatsApp Direct</p>
                <p className="text-xs text-zinc-400">
                  {language === "ro" ? "Răspuns rapid, direct pe telefon" : "Fast response, directly to your phone"}
                </p>
              </div>
            </a>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4 space-y-2">
              <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-550">
                {language === "ro" ? "Ecosistem Partener" : "Partner Ecosystem"}
              </p>
              <div className="space-y-1.5">
                <a
                  href="https://cristianvaduva.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-amber-500/80 hover:text-amber-400 transition-colors"
                >
                  CristianVaduva.com ↗
                </a>
                <a
                  href="https://aixluxury.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-amber-500/80 hover:text-amber-400 transition-colors"
                >
                  AiXLuxury.com ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Form */}
        <div className="lg:col-span-3">
          <ContactForm />
        </div>
      </div>

      {/* Service categories */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        {serviceCategories.map((s) => (
          <a
            key={s.title}
            href={s.href}
            className="group rounded-2xl border border-zinc-800 bg-zinc-900/20 p-5 hover:border-amber-500/30 transition-all block"
          >
            <h3 className="text-sm font-medium text-white mb-2 group-hover:text-amber-400 transition-colors">
              {s.title}
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
export default ContactClientPage;

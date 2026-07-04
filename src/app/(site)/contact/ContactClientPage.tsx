"use client";

import {
  ArrowRight,
  Clock3,
  FileText,
  Globe,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/ui";
import { siteConfig } from "@/lib/config";
import { brandContent } from "@/lib/content/brand";
import { useLanguage } from "@/context/LanguageContext";
import ContactForm from "./ContactForm";

type ContactCard = {
  titleRo: string;
  titleEn: string;
  valueRo: string;
  valueEn: string;
  href?: string;
  external?: boolean;
  icon: LucideIcon;
  tone: "amber" | "emerald" | "zinc" | "sky";
};

const socialIconMap: Record<string, LucideIcon> = {
  LinkedIn: Globe,
  Facebook: Globe,
  Instagram: Globe,
  YouTube: Globe,
  Telegram: Send,
  WhatsApp: MessageCircle,
  Linktree: Link2,
};

export default function ContactClientPage() {
  const { language } = useLanguage();

  const directContacts: ContactCard[] = [
    {
      titleRo: "WhatsApp",
      titleEn: "WhatsApp",
      valueRo: "Mesaj direct",
      valueEn: "Direct message",
      href: siteConfig.contact.whatsapp,
      external: true,
      icon: MessageCircle,
      tone: "emerald",
    },
    {
      titleRo: "Email",
      titleEn: "Email",
      valueRo: siteConfig.contact.email,
      valueEn: siteConfig.contact.email,
      href: `mailto:${siteConfig.contact.email}`,
      icon: Mail,
      tone: "amber",
    },
    {
      titleRo: "Telefon",
      titleEn: "Phone",
      valueRo: siteConfig.contact.phoneRO,
      valueEn: siteConfig.contact.phone,
      href: `tel:${siteConfig.contact.phoneRO}`,
      icon: Phone,
      tone: "sky",
    },
    {
      titleRo: "Program",
      titleEn: "Business Hours",
      valueRo: "Non-stop",
      valueEn: "Non-stop",
      icon: Clock3,
      tone: "zinc",
    },
  ];

  const partnerLinks = [
    {
      label: "CristianVaduva.com",
      href: brandContent.urls.personal,
      icon: Globe,
    },
    {
      label: "AiXLuxury.com",
      href: brandContent.urls.luxury,
      icon: Globe,
    },
    {
      label: "Linktree",
      href: brandContent.urls.linktree,
      icon: Link2,
    },
  ];

  const contactForms = [
    {
      title: language === "ro" ? "Formular de proprietate" : "Property form",
      desc:
        language === "ro"
          ? "Solicitare pentru achiziții, vânzări și listări."
          : "Requests for buying, selling, and listings.",
      href: siteConfig.links.propertyForm,
    },
    {
      title: language === "ro" ? "Formular de asigurări" : "Insurance form",
      desc:
        language === "ro"
          ? "Cereri pentru protecția activelor și polițe."
          : "Requests for asset protection and policies.",
      href: siteConfig.links.insuranceForm,
    },
    {
      title: language === "ro" ? "Formular membership" : "Membership form",
      desc:
        language === "ro"
          ? "Acces și solicitări pentru membership."
          : "Access and membership requests.",
      href: siteConfig.links.membershipForm,
    },
  ];

  const socialLinks = brandContent.socials.map((item) => ({
    ...item,
    icon: socialIconMap[item.platform] || Link2,
  }));

  const toneClass: Record<ContactCard["tone"], string> = {
    amber: "border-amber-500/20 bg-amber-500/5 text-amber-400",
    emerald: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
    sky: "border-sky-500/20 bg-sky-500/5 text-sky-400",
    zinc: "border-zinc-800 bg-zinc-900/30 text-zinc-300",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-10">
      <PageHeader
        badge={language === "ro" ? "Hub de contact" : "Contact hub"}
        title={language === "ro" ? "Contact" : "Contact"}
        subtitle={
          language === "ro"
            ? "Toate canalele de contact, formularele și legăturile de business sunt reunite aici."
            : "All contact channels, forms, and business links are gathered here."
        }
      />

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <section className="grid gap-4 sm:grid-cols-2">
            {directContacts.map((item) => {
              const Icon = item.icon;
              const card = (
                <div className={`rounded-2xl border p-4 sm:p-5 transition-all ${toneClass[item.tone]}`}>
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-current/20 bg-black/10">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase tracking-[0.22em] opacity-70">
                        {language === "ro" ? item.titleRo : item.titleEn}
                      </p>
                      <p className="mt-1 text-sm text-white">
                        {language === "ro" ? item.valueRo : item.valueEn}
                      </p>
                    </div>
                  </div>
                </div>
              );

              if (item.href) {
                return (
                  <a
                    key={item.titleEn}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 rounded-2xl"
                  >
                    {card}
                  </a>
                );
              }

              return <div key={item.titleEn}>{card}</div>;
            })}
          </section>

          <section className="rounded-3xl border border-zinc-850 bg-[#080808]/60 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                  {language === "ro" ? "Formulare de business" : "Business forms"}
                </p>
                <h2 className="mt-1 text-lg text-white">
                  {language === "ro" ? "Formulare disponibile" : "Available forms"}
                </h2>
              </div>
              <FileText className="h-5 w-5 text-amber-400" />
            </div>

            <div className="grid gap-3">
              {contactForms.map((form) => (
                <a
                  key={form.title}
                  href={form.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start justify-between gap-4 rounded-2xl border border-zinc-850 bg-zinc-950/40 p-4 transition-all hover:border-amber-500/25 hover:bg-zinc-900/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">{form.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">{form.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:text-amber-400" />
                </a>
              ))}
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            {partnerLinks.map((partner) => {
              const Icon = partner.icon;
              return (
                <a
                  key={partner.label}
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-zinc-850 bg-zinc-950/35 p-4 transition-all hover:border-amber-500/25 hover:bg-zinc-900/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-amber-400">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white">{partner.label}</p>
                      <p className="text-xs text-zinc-500">
                        {language === "ro" ? "Deschide legătura" : "Open link"}
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}
          </section>

          <section className="rounded-3xl border border-zinc-850 bg-[#080808]/60 p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                <Globe className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                  {language === "ro" ? "Social media" : "Social media"}
                </p>
                <h2 className="mt-1 text-lg text-white">
                  {language === "ro" ? "Rețele sociale" : "Social channels"}
                </h2>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-2xl border border-zinc-850 bg-zinc-950/35 p-4 transition-all hover:border-amber-500/25 hover:bg-zinc-900/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white">{social.label}</p>
                      <p className="text-xs text-zinc-500 truncate">{social.platform}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-zinc-850 bg-[#080808]/60 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4 border-b border-zinc-900 pb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                  {language === "ro" ? "Formular principal" : "Primary form"}
                </p>
                <h2 className="mt-1 text-lg text-white">
                  {language === "ro" ? "Trimite un mesaj" : "Send a message"}
                </h2>
              </div>
              <MessageCircle className="h-5 w-5 text-amber-400" />
            </div>
            <div className="pt-5">
              <ContactForm />
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-850 bg-[#080808]/60 p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-amber-400">
                <MapPin className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                  {language === "ro" ? "Disponibilitate" : "Availability"}
                </p>
                <h2 className="mt-1 text-lg text-white">
                  {language === "ro" ? "Non-stop" : "Non-stop"}
                </h2>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">
              {language === "ro"
                ? "Răspundem prin WhatsApp, telefon, e-mail și formulare. Contactul direct este organizat pentru a reduce timpul de așteptare."
                : "We respond through WhatsApp, phone, email, and forms. Direct contact is organized to keep waiting times low."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

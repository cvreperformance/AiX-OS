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
  Building2,
  Shield,
  Briefcase,
  Users,
  Brain,
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
  tone: "amber" | "emerald" | "sky" | "violet" | "zinc";
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

  const personalContacts: ContactCard[] = [
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
      titleRo: "Telegram",
      titleEn: "Telegram",
      valueRo: "Canal & DM",
      valueEn: "Channel & DM",
      href: siteConfig.contact.telegram,
      external: true,
      icon: Send,
      tone: "sky",
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
      tone: "violet",
    },
  ];

  const websiteLinks = [
    {
      label: "CristianVaduva.com",
      desc: language === "ro" ? "Site-ul oficial de investiții" : "Official investment site",
      href: brandContent.urls.personal,
      icon: Globe,
    },
    {
      label: "AiXLuxury.com",
      desc: language === "ro" ? "Proprietăți premium Dubai" : "Premium properties Dubai",
      href: brandContent.urls.luxury,
      icon: Globe,
    },
    {
      label: "AiX OS™",
      desc: language === "ro" ? "Sistem Decizional" : "Decision System",
      href: "https://aixos.ro",
      icon: Brain,
    },
  ];

  const socialLinks = brandContent.socials.map((item) => ({
    ...item,
    icon: socialIconMap[item.platform] || Link2,
  }));

  // Grouped Professional Forms
  const formGroups = [
    {
      id: "real-estate",
      titleRo: "Imobiliare & Investiții",
      titleEn: "Real Estate & Investments",
      icon: Building2,
      forms: [
        {
          title: language === "ro" ? "Cumpără Proprietate" : "Buy Property",
          desc: language === "ro" ? "Cerere pentru achiziții." : "Purchase request.",
          href: siteConfig.links.propertyForm,
        },
        {
          title: language === "ro" ? "Vinde Proprietate" : "Sell Property",
          desc: language === "ro" ? "Listare și reprezentare." : "Listing and representation.",
          href: "/seller",
        },
        {
          title: language === "ro" ? "Investiții" : "Investments",
          desc: language === "ro" ? "Oportunități de randament." : "Yield opportunities.",
          href: "/proprietati",
        },
      ]
    },
    {
      id: "financial-legal",
      titleRo: "Financiar & Consultanță",
      titleEn: "Financial & Consulting",
      icon: Briefcase,
      forms: [
        {
          title: language === "ro" ? "Asigurări" : "Insurance",
          desc: language === "ro" ? "Polițe și protecție." : "Policies and protection.",
          href: siteConfig.links.insuranceForm,
        },
        {
          title: language === "ro" ? "Consultanță Privată" : "Private Consultation",
          desc: language === "ro" ? "Sesiuni 1-la-1." : "1-on-1 sessions.",
          href: "#general-form", 
        },
        {
          title: language === "ro" ? "Contact Premium" : "Premium Contact",
          desc: language === "ro" ? "Acces prioritar." : "Priority access.",
          href: brandContent.urls.personal,
        },
      ]
    },
    {
      id: "ecosystem",
      titleRo: "Ecosistem & Comunitate",
      titleEn: "Ecosystem & Community",
      icon: Users,
      forms: [
        {
          title: language === "ro" ? "Club Registration" : "Club Registration",
          desc: language === "ro" ? "Înscriere în rețea." : "Network enrollment.",
          href: siteConfig.links.membershipForm,
        },
        {
          title: language === "ro" ? "Newsletter" : "Newsletter",
          desc: language === "ro" ? "Abonare Market Pulse." : "Market Pulse subscription.",
          href: "/stiri",
        },
        {
          title: language === "ro" ? "Contact General" : "General Contact",
          desc: language === "ro" ? "Informații generale." : "General information.",
          href: "#general-form",
        },
      ]
    }
  ];

  const toneClass: Record<ContactCard["tone"], string> = {
    amber: "border-amber-500/20 bg-amber-500/5 text-amber-400",
    emerald: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
    sky: "border-sky-500/20 bg-sky-500/5 text-sky-400",
    violet: "border-violet-500/20 bg-violet-500/5 text-violet-400",
    zinc: "border-zinc-800 bg-zinc-900/30 text-zinc-300",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-10">
      <PageHeader
        badge={language === "ro" ? "Hub de contact" : "Contact hub"}
        title={language === "ro" ? "AiX OS™ Contact" : "AiX OS™ Contact"}
        subtitle={
          language === "ro"
            ? "Toate canalele de contact, rețelele sociale, ecosistemul web și formularele profesionale."
            : "All contact channels, social networks, web ecosystem, and professional forms."
        }
      />

      <div className="space-y-12">
        {/* ROW 1: Personal Contact & Websites */}
        <div className="grid gap-8 lg:grid-cols-2">
          
          {/* Personal Contact */}
          <section className="rounded-3xl border border-zinc-850 bg-[#080808]/60 p-5 sm:p-7 space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <MessageCircle className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                  {language === "ro" ? "Contact Personal" : "Personal Contact"}
                </p>
                <h2 className="mt-1 text-lg text-white">
                  {language === "ro" ? "Linii Directe" : "Direct Lines"}
                </h2>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {personalContacts.map((item) => {
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
                        <p className="mt-1 text-sm text-white font-medium">
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
                      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 rounded-2xl hover:scale-[1.02] transition-transform"
                    >
                      {card}
                    </a>
                  );
                }

                return <div key={item.titleEn}>{card}</div>;
              })}
            </div>
          </section>

          {/* Websites Ecosystem */}
          <section className="rounded-3xl border border-zinc-850 bg-[#080808]/60 p-5 sm:p-7 space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                <Globe className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                  {language === "ro" ? "Ecosistem" : "Ecosystem"}
                </p>
                <h2 className="mt-1 text-lg text-white">
                  {language === "ro" ? "Site-uri Partenere" : "Partner Websites"}
                </h2>
              </div>
            </div>

            <div className="grid gap-4">
              {websiteLinks.map((partner) => {
                const Icon = partner.icon;
                return (
                  <a
                    key={partner.label}
                    href={partner.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl border border-zinc-850 bg-zinc-950/35 p-4 sm:p-5 transition-all hover:border-amber-500/30 hover:bg-zinc-900/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-amber-400">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-base font-medium text-white">{partner.label}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{partner.desc}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-amber-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-500 opacity-0 transition-opacity group-hover:opacity-100 hidden sm:block">
                        {language === "ro" ? "Vizitează" : "Visit"}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        </div>

        {/* ROW 2: Professional Forms Categories */}
        <section className="rounded-3xl border border-zinc-850 bg-[#080808]/60 p-5 sm:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-amber-400">
                <FileText className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                  {language === "ro" ? "Acces Rapid" : "Quick Access"}
                </p>
                <h2 className="mt-1 text-xl text-white font-medium">
                  {language === "ro" ? "Formulare Profesionale" : "Professional Forms"}
                </h2>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {formGroups.map((group) => {
              const GroupIcon = group.icon;
              return (
                <div key={group.id} className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GroupIcon className="h-4.5 w-4.5 text-zinc-500" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-zinc-400">
                      {language === "ro" ? group.titleRo : group.titleEn}
                    </h3>
                  </div>
                  <div className="grid gap-3">
                    {group.forms.map((form) => (
                      <a
                        key={form.title}
                        href={form.href}
                        className="group flex items-center justify-between gap-3 rounded-2xl border border-zinc-850/60 bg-zinc-950/20 p-4 transition-all hover:border-amber-500/25 hover:bg-zinc-900/40"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-zinc-200 group-hover:text-amber-400 transition-colors">{form.title}</p>
                          <p className="mt-1 text-[11px] leading-relaxed text-zinc-500 truncate">{form.desc}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-amber-400" />
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ROW 3: Social Media & General Contact */}
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          
          {/* Social Media */}
          <section className="rounded-3xl border border-zinc-850 bg-[#080808]/60 p-5 sm:p-7 space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                <Globe className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                  {language === "ro" ? "Comunitate" : "Community"}
                </p>
                <h2 className="mt-1 text-lg text-white">
                  {language === "ro" ? "Rețele Sociale" : "Social Media"}
                </h2>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-2xl border border-zinc-850 bg-zinc-950/35 p-4 transition-all hover:border-indigo-500/25 hover:bg-zinc-900/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
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

          {/* General Contact Form */}
          <section id="general-form" className="rounded-3xl border border-zinc-850 bg-[#080808]/60 p-5 sm:p-7">
            <div className="flex items-center justify-between gap-4 border-b border-zinc-900 pb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                  {language === "ro" ? "Asistență Rapidă" : "Quick Support"}
                </p>
                <h2 className="mt-1 text-lg text-white">
                  {language === "ro" ? "Contact General" : "General Contact"}
                </h2>
              </div>
              <Mail className="h-5 w-5 text-amber-400" />
            </div>
            <div className="pt-6">
              <ContactForm />
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

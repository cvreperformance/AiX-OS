import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone, Clock, Globe } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { siteConfig } from "@/lib/config";
import ContactForm from "./ContactForm";
import type { JsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact — AiX OS",
  description:
    "Contactează AiX OS pentru consultații private de investiții imobiliare, buyer/seller representation și market intelligence.",
  openGraph: {
    title: "Contact AiX OS",
    description: "Consultații private pentru investitori exigenți.",
    type: "website",
  },
};

const jsonLd: JsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact AiX OS",
  description: "Contactează echipa AiX OS",
  url: "https://aixos.ro/contact",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    contactType: "customer service",
    areaServed: ["RO", "AE", "MC"],
    availableLanguage: ["Romanian", "English"],
  },
};

const CONTACT_ITEMS = [
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
  },
  {
    icon: Phone,
    label: "Telefon",
    value: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone}`,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Mesaj direct →",
    href: siteConfig.contact.whatsapp,
    external: true,
  },
  {
    icon: MapPin,
    label: "Locație",
    value: "București, România",
    href: null,
  },
  {
    icon: Clock,
    label: "Program",
    value: "Non-stop disponibil",
    href: null,
  },
  {
    icon: Globe,
    label: "Rețea globală",
    value: "România · Dubai · Monaco",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16">
        <PageHeader
          badge="Contact AiX OS"
          title="Hai să vorbim"
          subtitle="Consultații private pentru investitori, buyer/seller representation și market intelligence personalizat."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left — Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact details */}
            <div className="space-y-5">
              {CONTACT_ITEMS.map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-500">
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
            <div className="space-y-3">
              <a
                href={siteConfig.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 hover:bg-emerald-500/10 transition-all"
              >
                <MessageCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">WhatsApp Direct</p>
                  <p className="text-xs text-zinc-400">Răspuns rapid, direct pe telefon</p>
                </div>
              </a>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4 space-y-2">
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  Ecosistem Partener
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Buyer Representation", desc: "Cumpărare cu expert în echipă. Due diligence, negociere.", href: "/buyer" },
            { title: "Seller Representation", desc: "Marketing premium. Preț maxim în timp minim.", href: "/seller" },
            { title: "Investment Intelligence", desc: "Analiză piețe globale. ROI, AiX Score, strategii.", href: "/investments" },
            { title: "AntiȚeapă & Valuation", desc: "Verificare completă. Evaluare AI. Protecție totală.", href: "/anti-teapa" },
          ].map((s) => (
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
    </>
  );
}

import { brandContent } from "@/lib/content/brand";

/**
 * AiX OS — Site Configuration
 * All contact data sourced from @/lib/content/brand.ts
 * Do NOT hardcode contact info here — import from brandContent.
 */
export const siteConfig = {
  name: "AiX OS™",
  tagline: "Intelligence Layer Built for Investors.",
  description:
    "Platformă de intelligence pentru investitori imobiliari. Market Pulse, AiX Score, AI Advisor și oportunități verificate.",
  url: "https://aixos.ro",
  contact: {
    email: brandContent.contact.email,
    phone: brandContent.contact.phone,
    phoneRO: brandContent.contact.phoneRO,
    whatsapp: brandContent.contact.whatsapp,
    whatsappRO: brandContent.contact.whatsappRO,
    whatsappText: brandContent.contact.whatsappText,
    telegram: brandContent.contact.telegram,
    telegramInvestments: brandContent.contact.telegramInvestments,
    linktree: brandContent.contact.linktree,
  },
  links: {
    cristianvaduva: brandContent.urls.personal,
    aixluxury: brandContent.urls.luxury,
    propertyForm: brandContent.urls.propertyForm,
    insuranceForm: brandContent.urls.insuranceForm,
    membershipForm: brandContent.urls.membershipForm,
  },
  socials: brandContent.socials,
};

export const navLinks = [
  { href: "/proprietati", label: "Proprietăți" },
  { href: "/stiri", label: "Market Pulse" },
  { href: "/oportunitati", label: "Oportunități" },
  { href: "/investments", label: "Investiții" },
  { href: "/aix-score", label: "AiX Score" },
  { href: "/ai", label: "AI Advisor" },
  {
    href: "/services",
    label: "Servicii",
    children: [
      { href: "/buyer", label: "Buyer Representation" },
      { href: "/seller", label: "Seller Representation" },
      { href: "/insurance", label: "Asigurări" },
      { href: "/anti-teapa", label: "AntiȚeapă AI" },
      { href: "/valuation", label: "Evaluare AI" },
      { href: "/concierge", label: "Luxury Concierge" },
      { href: "/network", label: "Rețea Privată" },
    ],
  },
];

export const footerLinks = {
  platform: [
    { href: "/proprietati", label: "Proprietăți" },
    { href: "/stiri", label: "Market Pulse" },
    { href: "/oportunitati", label: "Oportunități" },
    { href: "/investments", label: "Investiții" },
    { href: "/market", label: "Indicatori Piață" },
    { href: "/calculators", label: "Calculatoare" },
    { href: "/aix-score", label: "AiX Score" },
    { href: "/ai", label: "AI Advisor" },
  ],
  services: [
    { href: "/buyer", label: "Buyer Representation" },
    { href: "/seller", label: "Seller Representation" },
    { href: "/insurance", label: "Asigurări AI" },
    { href: "/concierge", label: "Luxury Concierge" },
    { href: "/anti-teapa", label: "AntiȚeapă AI" },
    { href: "/valuation", label: "Evaluare AI" },
    { href: "/network", label: "Rețea Privată" },
  ],
  ecosystem: [
    { href: brandContent.urls.personal, label: "CristianVaduva.com", external: true },
    { href: brandContent.urls.luxury, label: "AiXLuxury.com", external: true },
    { href: brandContent.urls.linktree, label: "Linktree", external: true },
    { href: "/contact-hub", label: "Contact AiX OS" },
    { href: "/learning#word-of-the-day", label: "Word of the Day" },
  ],
};

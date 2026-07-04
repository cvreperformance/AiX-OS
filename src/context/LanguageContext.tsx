"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "ro" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const TRANSLATIONS: Record<Language, Record<string, any>> = {
  ro: {
    "nav.home": "Acasă",
    "nav.services": "Servicii Platformă",
    "nav.allServices": "Toate Serviciile",
    "nav.about": "Despre",
    "nav.contact": "Contact",
    "nav.join": "Alătură-te AiX",
    "nav.call": "Sună Acum",
    "nav.whatsapp": "WhatsApp",
    "nav.cta": "Creează Cont AiX",
    
    "hero.badge": "Sistemul tău secundar de inteligență imobiliară",
    "hero.title": "AiX OS",
    "hero.subtitle": "Al doilea creier al tău.",
    "hero.tagline": "Gândește mai rapid.",
    "hero.join": "🧠 Înscrie-te pe Waitlist",
    "hero.coming": "Disponibil în această vară.",
    "hero.powered": "Dezvoltat cu mândrie de cristianvaduva.com",

    "search.placeholder": "Caută proprietăți, orașe, servicii...",
    "search.empty": "Niciun rezultat găsit.",
    "search.shortcut": "Apasă ⌘K pentru a căuta instantaneu",

    "footer.tagline": "Ecosistem digital premium pentru tranzacții și inteligență imobiliară.",
    "footer.locations": "Monaco · Dubai · București · Europa",
    "footer.strategic": "Parteneri Strategici",
    "footer.rights": "© 2026 AiX OS — Ecosistem Digital de Tranzacții Imobiliare. Toate drepturile rezervate.",

    "contact.title": "Contact Desk Privat",
    "contact.subtitle": "Răspundem la solicitări confidențiale în mai puțin de 2 ore.",
    "contact.name": "Nume Complet",
    "contact.phone": "Număr de Telefon",
    "contact.email": "Adresă E-mail",
    "contact.subject": "Subiect Interes",
    "contact.budget": "Buget Disponibil",
    "contact.message": "Mesaj Suplimentar",
    "contact.submit": "Trimite Solicitare Securizată",
    "contact.success": "Solicitarea a fost trimisă cu succes. Consilierul tău te va contacta în curând.",
    "contact.error": "Eroare la trimiterea formularului. Te rugăm să încerci din nou."
  },
  en: {
    "nav.home": "Home",
    "nav.services": "Platform Services",
    "nav.allServices": "All Services",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.join": "Join AiX",
    "nav.call": "Call Now",
    "nav.whatsapp": "WhatsApp",
    "nav.cta": "Create AiX Account",
    
    "hero.badge": "Your secondary real estate intelligence system",
    "hero.title": "AiX OS",
    "hero.subtitle": "Your second brain.",
    "hero.tagline": "Think faster.",
    "hero.join": "🧠 Join the Waitlist",
    "hero.coming": "Coming this summer.",
    "hero.powered": "Proudly Powered by cristianvaduva.com",

    "search.placeholder": "Search properties, cities, services...",
    "search.empty": "No results found.",
    "search.shortcut": "Press ⌘K to search instantly",

    "footer.tagline": "Premium digital ecosystem for real estate transactions and intelligence.",
    "footer.locations": "Monaco · Dubai · Bucharest · Europe",
    "footer.strategic": "Strategic Partners",
    "footer.rights": "© 2026 AiX OS — Digital Real Estate Transaction Ecosystem. All rights reserved.",

    "contact.title": "Private Desk Contact",
    "contact.subtitle": "We respond to confidential inquiries in less than 2 hours.",
    "contact.name": "Full Name",
    "contact.phone": "Phone Number",
    "contact.email": "Email Address",
    "contact.subject": "Subject of Interest",
    "contact.budget": "Available Budget",
    "contact.message": "Additional Message",
    "contact.submit": "Send Secure Inquiry",
    "contact.success": "Inquiry sent successfully. Your advisor will contact you shortly.",
    "contact.error": "Error submitting the form. Please try again."
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ro");

  useEffect(() => {
    const saved = localStorage.getItem("aix_lang") as Language;
    if (saved === "ro" || saved === "en") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("aix_lang", lang);
  };

  const t = (key: string): string => {
    const dict = TRANSLATIONS[language];
    return dict[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

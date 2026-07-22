"use client";

import { useState } from "react";
import {
  UserPlus,
  Mail,
  ShieldCheck,
  TrendingUp,
  Clock,
  ArrowRight,
  Bell,
  Lock,
  Building2,
  CheckCircle2
} from "lucide-react";
import { designSystem } from "@/styles/designSystem";
import { PageHeader } from "@/components/ui";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { validateName, validatePhone, validateEmail, validateCheckbox } from "@/lib/validation";

export default function JoinPage() {
  const { language } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [botfield, setBotfield] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [gdpr, setGdpr] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{name?: string, phone?: string, email?: string, gdpr?: string}>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});


    const nameErr = validateName(name);
    const phoneErr = validatePhone(phone);
    const emailErr = validateEmail(email);
    const gdprErr = validateCheckbox(gdpr);

    if (nameErr || phoneErr || emailErr || gdprErr) {
      setFieldErrors({
        name: nameErr || undefined,
        phone: phoneErr || undefined,
        email: emailErr || undefined,
        gdpr: gdprErr || undefined,
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: "Join Waitlist / Newsletter",
          name,
          phone,
          email,
          source: "join-page",
          page: "/join",
          botfield: botfield || undefined,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to join waitlist");
      }
      
      setSuccess(true);
      setEmail("");
      setName("");
      setPhone("");
    } catch (err: any) {
      setError(err.message || (language === "ro" ? "A apărut o eroare." : "An error occurred."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = language === "ro" ? [
    {
      icon: Clock,
      title: "Economisiți Zile Întregi",
      desc: "Rapoarte gata făcute, checklist-uri și contracte validate. Fără căutări haotice pe zeci de site-uri."
    },
    {
      icon: ShieldCheck,
      title: "Preveniți Țepele",
      desc: "Alerte de siguranță, informații publice OSINT și evaluarea juridică a documentelor de achiziție."
    },
    {
      icon: Lock,
      title: "Oportunități Off-Market",
      desc: "Primiți direct pe email proprietățile exclusive înainte ca ele să ajungă pe piața publică."
    },
    {
      icon: TrendingUp,
      title: "Randament Real",
      desc: "Calculatoare financiare și analize macroeconomice care prezic tendințele viitoare ale dobânzilor."
    }
  ] : [
    {
      icon: Clock,
      title: "Save Days of Research",
      desc: "Ready-made reports, checklists, and validated contracts. No more scattered searches across dozens of websites."
    },
    {
      icon: ShieldCheck,
      title: "Prevent Scams & Traps",
      desc: "Safety alerts, OSINT public records, and legal evaluation of acquisition documents."
    },
    {
      icon: Lock,
      title: "Off-Market Opportunities",
      desc: "Receive exclusive properties directly in your inbox before they reach the public market."
    },
    {
      icon: TrendingUp,
      title: "Real Returns",
      desc: "Financial calculators and macroeconomic analyses that forecast future interest rate trends."
    }
  ];

  const perks = language === "ro"
    ? ["Newsletter lunar cu analize de piață", "Acces la calculatoare financiare", "Alerte proprietăți off-market"]
    : ["Monthly market analysis newsletter", "Access to financial calculators", "Off-market property alerts"];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16 animate-in">
      <PageHeader
        badge={language === "ro" ? "Abonament AiX OS™" : "AiX OS™ Membership"}
        title={language === "ro" ? "Alătură-te Ecosistemului AiX" : "Join the AiX Ecosystem"}
        subtitle={
          language === "ro"
            ? "Un singur cont. Acces la tot ce aveți nevoie înainte de a semna un contract imobiliar de sute de mii de euro."
            : "One account. Access to everything you need before signing a real estate contract worth hundreds of thousands of euros."
        }
      />

      {/* Grid: Benefits & Form */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Col: Benefits */}
        <div className="lg:col-span-3 space-y-8">
          <div>
            <h2 className="text-2xl font-light text-zinc-900 leading-tight mb-2">
              {language === "ro"
                ? "Transformați deciziile din emoție în matematică."
                : "Transform decisions from emotion into mathematics."}
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
              {language === "ro" ? "Prin crearea unui cont în AiX OS™ sau prin abonarea la newsletter, aveți garanția că nu veți rata nicio informație critică din piață. Vă livrăm direct în inbox rapoarte de care aveți nevoie." : "By creating an AiX OS™ account or subscribing to the newsletter, you are guaranteed not to miss any critical market information. We deliver the reports you need directly to your inbox."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <div key={i} className={`p-6 rounded-2xl ${designSystem.glass} border border-zinc-200`}>
                  <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-amber-500" />
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-900">{benefit.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-1.5">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Signup Form */}
        <div className={`lg:col-span-2 p-8 rounded-3xl border border-zinc-200 bg-white flex flex-col relative overflow-hidden h-full min-h-[400px]`}>
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />
          
          <div className="mb-8">
            <UserPlus className="h-8 w-8 text-amber-500 mb-4" />
            <h3 className="text-xl font-semibold text-zinc-900">
              {language === "ro" ? "Înregistrare Rapidă" : "Quick Registration"}
            </h3>
            <p className="text-xs text-zinc-400 mt-2">
              {language === "ro"
                ? "Lăsați adresa de email pentru a primi Newsletter-ul AiX Market Pulse și pentru a seta accesul la cont."
                : "Leave your email address to receive the AiX Market Pulse Newsletter and set up account access."}
            </p>
          </div>

          {success ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in">
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-zinc-900">
                  {language === "ro" ? "V-ați înscris cu succes!" : "Successfully registered!"}
                </h4>
                <p className="text-sm text-zinc-400 mt-2">
                  {language === "ro"
                    ? "Veți primi un email de confirmare și linkul de configurare a contului în scurt timp."
                    : "You will receive a confirmation email and account setup link shortly."}
                </p>
              </div>
              <button 
                onClick={() => setSuccess(false)}
                className="mt-6 rounded-xl bg-zinc-50 hover:bg-zinc-850 px-5 py-2 text-xs font-semibold text-zinc-600 transition-colors"
              >
                {language === "ro" ? "Înapoi" : "Back"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
              {/* Honeypot Spam Protection */}
              <input
                type="text"
                name="botfield"
                value={botfield}
                onChange={(e) => setBotfield(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="space-y-4">
                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-2.5 text-red-400 text-xs">
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold pl-1">
                    {language === "ro" ? "Nume Complet" : "Full Name"}
                  </label>
                  <input 
                    required 
                    type="text" 
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: undefined });
                    }}
                    className={`w-full bg-zinc-50/50 border ${fieldErrors.name ? 'border-red-500' : 'border-zinc-200'} rounded-xl py-2.5 px-4 text-xs text-zinc-900 placeholder-zinc-550 focus:border-amber-500/50 focus:outline-none transition-colors`} 
                    placeholder={language === "ro" ? "Numele tău" : "Your name"}
                  />
                  {fieldErrors.name && <p className="text-red-500 text-[10px] mt-0.5">{fieldErrors.name}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold pl-1">
                    {language === "ro" ? "Număr Telefon" : "Phone Number"}
                  </label>
                  <input 
                    required 
                    type="tel" 
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: undefined });
                    }}
                    className={`w-full bg-zinc-50/50 border ${fieldErrors.phone ? 'border-red-500' : 'border-zinc-200'} rounded-xl py-2.5 px-4 text-xs text-zinc-900 placeholder-zinc-550 focus:border-amber-500/50 focus:outline-none transition-colors`} 
                    placeholder="+43 650..."
                  />
                  {fieldErrors.phone && <p className="text-red-500 text-[10px] mt-0.5">{fieldErrors.phone}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold pl-1">
                    {language === "ro" ? "Adresa de Email" : "Email Address"}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-600" />
                    <input 
                      required 
                      type="email" 
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                      }}
                      className={`w-full bg-zinc-50/50 border ${fieldErrors.email ? 'border-red-500' : 'border-zinc-200'} rounded-xl py-3 pl-12 pr-4 text-sm text-zinc-900 placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none transition-colors`} 
                      placeholder="name@example.com"
                    />
                  </div>
                  {fieldErrors.email && <p className="text-red-500 text-[10px] mt-0.5">{fieldErrors.email}</p>}
                </div>

                <ul className="space-y-2 mt-4 pb-4">
                  {perks.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-amber-500/60" />
                      <span className="text-xs text-zinc-400">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 mt-4">
                <div>
                  <label className="flex items-start gap-2 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      required
                      checked={gdpr}
                      onChange={(e) => {
                        setGdpr(e.target.checked);
                        if (fieldErrors.gdpr) setFieldErrors({ ...fieldErrors, gdpr: undefined });
                      }}
                      className="mt-0.5"
                    />
                    <p className="text-[10px] text-zinc-500 leading-normal text-left">
                      {language === "ro" ? (
                        <>
                          Prin trimiterea acestui formular, confirmați că ați citit și sunteți de acord cu{" "}
                          <Link href="/privacy" className="text-amber-500 hover:underline font-semibold">
                            Politica de Confidențialitate & Notificarea GDPR AiX OS™
                          </Link>{" "}
                          și vă exprimați acordul pentru a fi contactat în legătură cu solicitarea dvs.
                        </>
                      ) : (
                        <>
                          By submitting this form, you confirm that you have read and agree to the{" "}
                          <Link href="/privacy" className="text-amber-500 hover:underline font-semibold">
                            AiX OS™ Privacy Policy & GDPR Notice
                          </Link>{" "}
                          and consent to being contacted regarding your enquiry and requested services.
                        </>
                      )}
                    </p>
                  </label>
                  {fieldErrors.gdpr && <p className="text-red-500 text-[10px] mt-0.5">{fieldErrors.gdpr}</p>}
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-amber-500/10 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? (language === "ro" ? "Se procesează..." : "Processing...")
                    : (language === "ro" ? "Continuă spre Cont" : "Continue to Account")}
                  {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Partner Teaser */}
      <section className="p-8 sm:p-10 rounded-3xl border border-zinc-200 bg-gradient-to-br from-zinc-950 to-zinc-900/50 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-zinc-50 px-3 py-1 border border-zinc-200 text-[10px] font-semibold uppercase tracking-wider text-amber-500">
            <Building2 className="h-3 w-3" />
            {language === "ro" ? "Pentru Agenții și Dezvoltatori" : "For Agencies & Developers"}
          </div>
          <h3 className="text-2xl font-light text-zinc-900">
            {language === "ro" ? "Programul de Parteneriat AiX" : "AiX Partnership Program"}
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
            {language === "ro"
              ? "Reprezentați o agenție imobiliară premium sau un dezvoltator de lux? Aplicați pentru pachetul Corporate B2B. Veți avea acces la listări prioritare, panou de brokeraj, integrare API și badge-ul de \"Partener Licențiat AiX\"."
              : "Do you represent a premium real estate agency or luxury developer? Apply for the Corporate B2B package. You will gain access to priority listings, brokerage dashboard, API integration, and the \"AiX Licensed Partner\" badge."}
          </p>
        </div>
        <div className="shrink-0">
          <a href="/agentii" className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-850 hover:border-zinc-300 transition-all">
            <Bell className="h-4 w-4 text-amber-500" />
            {language === "ro" ? "Detalii Parteneriat" : "Partnership Details"}
          </a>
        </div>
      </section>

    </div>
  );
}

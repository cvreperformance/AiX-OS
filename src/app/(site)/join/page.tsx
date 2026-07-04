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

export default function JoinPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [botfield, setBotfield] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !phone) return;
    
    setIsSubmitting(true);
    setError("");

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
      setError(err.message || "Failed to join.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16 animate-in">
      <PageHeader
        badge="Abonament AiX OS"
        title="Alătură-te Ecosistemului AiX"
        subtitle="Un singur cont. Acces la tot ce aveți nevoie înainte de a semna un contract imobiliar de sute de mii de euro."
      />

      {/* Grid: Benefits & Form */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Col: Benefits (Takes 3 columns) */}
        <div className="lg:col-span-3 space-y-8">
          <div>
            <h2 className="text-2xl font-light text-white leading-tight mb-2">
              Transformați deciziile din emoție în matematică.
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
              Prin crearea unui cont gratuit în AiX OS sau prin abonarea la newsletter, aveți garanția că nu veți rata nicio informație critică din piață. Vă livrăm direct în inbox rapoarte de care aveți nevoie.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
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
            ].map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <div key={i} className={`p-6 rounded-2xl ${designSystem.glass} border border-zinc-800`}>
                  <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-amber-500" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">{benefit.title}</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed mt-1.5">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Signup Form (Takes 2 columns) */}
        <div className={`lg:col-span-2 p-8 rounded-3xl border border-zinc-800 bg-zinc-950 flex flex-col relative overflow-hidden h-full min-h-[400px]`}>
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />
          
          <div className="mb-8">
            <UserPlus className="h-8 w-8 text-amber-500 mb-4" />
            <h3 className="text-xl font-semibold text-white">Înregistrare Rapidă</h3>
            <p className="text-xs text-zinc-400 mt-2">
              Lăsați adresa de email pentru a primi Newsletter-ul AiX Market Pulse și pentru a seta accesul la cont.
            </p>
          </div>

          {success ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in">
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">V-ați înscris cu succes!</h4>
                <p className="text-sm text-zinc-500 mt-2">
                  Veți primi un email de confirmare și linkul de configurare a contului în scurt timp.
                </p>
              </div>
              <button 
                onClick={() => setSuccess(false)}
                className="mt-6 rounded-xl bg-zinc-900 hover:bg-zinc-850 px-5 py-2 text-xs font-semibold text-zinc-300 transition-colors"
              >
                Înapoi
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
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold pl-1">Nume Complet</label>
                  <input 
                    required 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 px-4 text-xs text-white placeholder-zinc-550 focus:border-amber-500/50 focus:outline-none transition-colors" 
                    placeholder="Numele tău" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold pl-1">Număr Telefon</label>
                  <input 
                    required 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 px-4 text-xs text-white placeholder-zinc-550 focus:border-amber-500/50 focus:outline-none transition-colors" 
                    placeholder="+40 7..." 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold pl-1">Adresa de Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-600" />
                    <input 
                      required 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none transition-colors" 
                      placeholder="nume@exemplu.com" 
                    />
                  </div>
                </div>

                <ul className="space-y-2 mt-4 pb-4">
                  {[
                    "Newsletter lunar cu analize de piață",
                    "Acces la calculatoare financiare",
                    "Alerte proprietăți off-market"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-amber-500/60" />
                      <span className="text-xs text-zinc-400">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 mt-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-amber-500/10 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Se procesează..." : "Continuă spre Cont"}
                  {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                </button>
                <p className="text-[9px] text-zinc-600 text-center px-2">
                  Apăsând butonul, sunteți de acord cu Termenii și Condițiile și Politica de Confidențialitate AiX OS.
                </p>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Pro Membership Teaser */}
      <section className="p-8 sm:p-10 rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 to-zinc-900/50 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-1 border border-zinc-800 text-[10px] font-semibold uppercase tracking-wider text-amber-500">
            <Building2 className="h-3 w-3" />
            Pentru Agenții și Dezvoltatori
          </div>
          <h3 className="text-2xl font-light text-white">Programul de Parteneriat AiX</h3>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
            Reprezentați o agenție imobiliară premium sau un dezvoltator de lux? Aplicați pentru pachetul Corporate B2B. Veți avea acces la listări prioritare, panou de brokeraj, integrare API și badge-ul de "Partener Licențiat AiX".
          </p>
        </div>
        <div className="shrink-0">
          <a href="/agentii" className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-850 hover:border-zinc-700 transition-all">
            <Bell className="h-4 w-4 text-amber-500" />
            Detalii Parteneriat
          </a>
        </div>
      </section>

    </div>
  );
}

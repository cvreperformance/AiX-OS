"use client";

import { useLanguage } from "@/context/LanguageContext";
import { designSystem } from "@/styles/designSystem";
import { Cpu, Lock, Terminal, Cloud, HelpCircle, Code, Award, ExternalLink, Lightbulb } from "lucide-react";

export default function TechnologyClient() {
  const { language } = useLanguage();

  const techs = [
    {
      title: language === "ro" ? "Inteligență Artificială" : "Artificial Intelligence",
      desc: language === "ro"
        ? "Resurse utile, API-uri OpenAI/Anthropic și ghiduri despre implementarea LLM-urilor în analiza datelor financiare."
        : "Curated tools, OpenAI/Anthropic APIs, and deployment guides for LLM models in quantitative financial research.",
      icon: Cpu,
      category: "AI & ML",
      link: "https://openai.com/",
    },
    {
      title: language === "ro" ? "Cibernetica & Securitate" : "Cybersecurity & Cryptography",
      desc: language === "ro"
        ? "Bune practici despre autentificare MFA, stocare de parole securizată și prevenirea atacurilor de phishing."
        : "Best practices on hardware MFA keys, secure vault storage, and mitigating high-value phishing attacks.",
      icon: Lock,
      category: "Security",
      link: "https://www.yubico.com/",
    },
    {
      title: language === "ro" ? "Platforme Cloud & Infrastructură" : "Cloud & Scalability",
      desc: language === "ro"
        ? "Ghiduri practice despre stocare distribuită, securizarea datelor prin cloud privat și redundanță geo-localizată."
        : "Checklists for distributed database sharding, container encryption, and geo-redundant private cloud deployments.",
      icon: Cloud,
      category: "Infrastructure",
      link: "https://aws.amazon.com/",
    },
    {
      title: language === "ro" ? "Unelte de Dezvoltare" : "Developer & Devops Stack",
      desc: language === "ro"
        ? "Unelte recomandate pentru automatizare procese: terminal scripts, git pipelines și serverless computing."
        : "Recommended tools for process automations: custom shell utilities, Git workflows, and serverless compute setups.",
      icon: Terminal,
      category: "DevOps",
      link: "https://github.com/",
    },
    {
      title: language === "ro" ? "Aplicații Open Source" : "Open Source Ecosystem",
      desc: language === "ro"
        ? "Recomandări de proiecte software open source care susțin confidențialitatea datelor și suveranitatea digitală."
        : "Recommended open-source projects advocating data ownership, zero-knowledge sync, and digital sovereignty.",
      icon: Code,
      category: "Open Source",
      link: "https://vercel.com/oss",
    },
    {
      title: language === "ro" ? "Hardware & Inovație" : "Hardware & Smart Devices",
      desc: language === "ro"
        ? "Tendințe în arhitectura chip-urilor de AI, dispozitive hardware de securitate și stocare cold offline."
        : "Market trends in neural processors, physical HSM tokens, and offline cold storage vaults.",
      icon: Lightbulb,
      category: "Hardware",
      link: "https://www.ledger.com/",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16 animate-in">
      {/* Header */}
      <section className="space-y-6 max-w-3xl">
        <span className="inline-block text-xs uppercase tracking-[0.2em] text-amber-500/80 border border-amber-500/20 rounded-full px-3 py-1">
          {language === "ro" ? "AiX OS™ · Hub Tehnologic" : "AiX OS™ · Technology Hub"}
        </span>
        <h1 className="text-4xl md:text-5xl font-light text-zinc-900 leading-tight">
          {language === "ro" ? "Securitate, Automatizare &" : "Security, Automation &"} <br />
          <span className="gradient-gold">{language === "ro" ? "Infrastructură Digitală" : "Tech Stack Intelligence"}</span>
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          {language === "ro"
            ? "Blueprints tehnice recomandate pentru a construi sisteme sigure, a proteja datele sensibile și a eficientiza fluxurile zilnice prin cod."
            : "Technical stack blueprints for building robust local infrastructures, securing private assets, and automating daily operations."}
        </p>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techs.map((tech) => {
          const Icon = tech.icon;
          return (
            <div key={tech.title} className={`p-6 rounded-3xl ${designSystem.glass} ${designSystem.glassHover} flex flex-col justify-between min-h-[220px]`}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest border border-zinc-200 px-2 py-0.5 rounded-full bg-white/20">
                    {tech.category}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">{tech.title}</h3>
                  <p className="text-xs text-zinc-450 leading-relaxed mt-2">{tech.desc}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-zinc-200/60 mt-4">
                <a
                  href={tech.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-amber-500/70 hover:text-amber-400 font-semibold transition-colors"
                >
                  {language === "ro" ? "Vezi Resursă" : "Explore Source"}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </section>

      {/* Devops & Threat Audit Desk */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={`p-6 sm:p-8 rounded-3xl ${designSystem.glass} border border-zinc-200 space-y-4`}>
          <div className="rounded-xl bg-red-500/10 p-2.5 text-red-400 max-w-fit">
            <Lock className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900">
            {language === "ro" ? "Ghid Securizare Tranzacții UHNW" : "UHNW Cyber Risk Prevention Desk"}
          </h3>
          <ul className="space-y-3 text-xs text-zinc-400 leading-relaxed">
            <li>
              <strong>{language === "ro" ? "Fără instrucțiuni IBAN pe mail" : "IBAN Authentication Protocol"}:</strong> {language === "ro" ? "Toate conturile bancare primite electronic trebuie verificate telefonic prin cod separat." : "Never wire capital without verifying bank IBAN parameters via secondary voice verification."}
            </li>
            <li>
              <strong>{language === "ro" ? "MFA Fizic obligatoriu (YubiKey)" : "Physical Security Tokens (YubiKey)"}:</strong> {language === "ro" ? "Folosiți token hardware pentru a împiedica phishing-ul prin clonare SIM." : "Utilize hardware security keys for locking credential vaults against SIM-swap vectors."}
            </li>
            <li>
              <strong>{language === "ro" ? "Izolarea documentelor sensibile" : "Encrypted Cold Vault Archives"}:</strong> {language === "ro" ? "Nu păstrați schițele tehnice sau actele de identitate în conturi cloud nepărslate." : "Avoid storing property registry deeds inside plain unsecured cloud folders."}
            </li>
          </ul>
        </div>

        <div className={`p-6 sm:p-8 rounded-3xl ${designSystem.glass} border border-zinc-200 space-y-4`}>
          <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-400 max-w-fit">
            <Cpu className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900">
            {language === "ro" ? "Checklist Automatizare Dev" : "Serverless Automation Checklists"}
          </h3>
          <ul className="space-y-3 text-xs text-zinc-400 leading-relaxed">
            <li>
              <strong>{language === "ro" ? "Scanners de anunțuri imobiliare" : "Serverless Aggregator Scrapers"}:</strong> {language === "ro" ? "Rulați scripturi automate serverless pe servere pentru a detecta ofertele noi în 60s." : "Deploy cron-job serverless scraper workers to capture distressed seller posts within 60s."}
            </li>
            <li>
              <strong>{language === "ro" ? "Integrare LLM API pentru contracte" : "LLM pre-contract audits"}:</strong> {language === "ro" ? "Automatizați extragerea penalităților din promisiunile PDF prin modelul AI." : "Utilize API connectors to scan legal drafts for asymmetric cancellation fees."}
            </li>
            <li>
              <strong>{language === "ro" ? "Notificări instant (Telegram Bot)" : "Telegram Webhook Alerts"}:</strong> {language === "ro" ? "Configurați avertismente directe pe telefon la modificarea IRCC." : "Connect webhook notifications to sound instant phone alarms on central bank policy changes."}
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

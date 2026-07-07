import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Lock,
  AlertTriangle,
  Eye,
  FileSearch,
  Globe,
  Fingerprint,
  Server,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  UserCheck,
  Phone,
} from "lucide-react";
import { designSystem } from "@/styles/designSystem";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Cybersecurity & Fraud Prevention | AiX OS™",
  description:
    "Protecție digitală avansată pentru investitori imobiliari HNWI. Prevenire fraude, due diligence digital, securitate identitate și protecție active.",
};

// ─── Static data ─────────────────────────────────────────────────────────────

const FRAUD_TYPES = [
  {
    icon: AlertTriangle,
    title: "Fraude Cadastrale",
    desc: "Acte de proprietate falsificate, ipoteci ascunse sau modificări ilegale de carte funciară detectate înainte de tranzacție.",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
  },
  {
    icon: UserCheck,
    title: "Identitate Vânzător",
    desc: "Verificare KYC completă a identității reale a vânzătorului sau reprezentantului legal pentru a preveni uzurparea de identitate.",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: FileSearch,
    title: "Documente False",
    desc: "Scanare AI a contractelor, extraselor CF și actelor notariale pentru semnături false, date modificate sau inconsistențe.",
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
  },
  {
    icon: Globe,
    title: "Fraude Internaționale",
    desc: "Scheme transfrontaliere de spălare de bani prin imobiliare, detectate prin corelarea cu baze de date FATF și Interpol.",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Server,
    title: "Atacuri Digitale",
    desc: "Phishing imobiliar, wire fraud și atacuri man-in-the-middle pe comunicații de plată prevenite prin protocoale criptate.",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: Eye,
    title: "Monitorizare Continuă",
    desc: "Supraveghere activă a activelor deținute pentru sesizarea modificărilor cadastrale neautorizate sau tentativelor de fraudă.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
];

const PROTECTION_LAYERS = [
  { label: "KYC & AML Verification", desc: "Verificare identitate și anti-spălare de bani conform MiFID II și AMLD6" },
  { label: "Blockchain Land Registry", desc: "Validarea înregistrărilor de proprietate imutabile prin distributed ledger" },
  { label: "AI Document Scanner", desc: "Detectare manipulare documente prin machine learning și OCR avansat" },
  { label: "Encrypted Communications", desc: "Toate comunicațiile prin canale criptate E2E — zero interceptare posibilă" },
  { label: "Multi-Factor Authentication", desc: "Acces la active digitale și tranzacții protejat prin MFA hardware" },
  { label: "Real-Time Fraud Alerts", desc: "Notificări instantanee la orice activitate suspectă detectată pe active" },
];

const SECURITY_STATS = [
  { value: "€2.4M+", label: "Fraude Prevenite", sublabel: "Valoare totală protejată în portofolii client" },
  { value: "99.7%", label: "Acuratețe AI", sublabel: "Rata de detectare documente false" },
  { value: "<48h", label: "Time to Detect", sublabel: "Detectare medie tentativă fraudă" },
  { value: "0", label: "Breaches", sublabel: "Incidente de securitate în platforma AiX OS™" },
];

const CHECKLIST = [
  "Verificare extract CF actualizat în timp real",
  "Autenticitate acte notariale prin Biroul Notarilor Publici",
  "Verificare ipoteci și sarcini ANCPI",
  "Cross-check identitate vânzător cu B.N.R. și ONRC",
  "Screening AML / PEP / Sanctions List",
  "Confirmare legalitate construcție și conformitate urbanism",
  "Audit fiscal — datorii restante Fisc/ANAF",
  "Validare procuri și reprezentanți legali",
];

const RESOURCES = [
  { title: "Ghid Prevenire Fraude Imobiliare", desc: "Manual complet pentru cumpărători de protecție împotriva celor mai comune scheme.", href: "/anti-teapa" },
  { title: "AntiȚeapă AI Scanner", desc: "Scanează automat orice proprietate pentru riscuri cadastrale și juridice.", href: "/anti-teapa" },
  { title: "AI Valuation & Due Diligence", desc: "Evaluare justă de piață combinată cu audit de risc AI în timp real.", href: "/valuation" },
  { title: "Contactează Security Desk", desc: "Ai identificat o fraudă? Echipa noastră de securitate răspunde în 2 ore.", href: "/contact" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function CybersecurityPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-20 animate-in">

      {/* Header */}
      <PageHeader
        badge="Security Intelligence"
        title="Cybersecurity & Fraud Prevention"
        subtitle="Protecție digitală de nivel enterprise pentru investitori imobiliari HNWI. De la KYC și AML la monitorizare active și prevenire fraude cadastrale."
      />

      {/* Security Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {SECURITY_STATS.map((stat) => (
          <div
            key={stat.value}
            className={`relative rounded-3xl ${designSystem.glass} p-5 md:p-6 space-y-2 overflow-hidden`}
          >
            <div className={designSystem.glowTop} />
            <p className="text-2xl md:text-3xl font-light text-amber-400 font-mono">{stat.value}</p>
            <p className="text-xs font-semibold text-white">{stat.label}</p>
            <p className="text-[10px] text-zinc-500 leading-snug">{stat.sublabel}</p>
          </div>
        ))}
      </section>

      {/* Fraud Types Grid */}
      <section className="space-y-8">
        <div className="border-b border-zinc-900 pb-5">
          <span className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-semibold">Threat Intelligence</span>
          <h2 className="text-2xl md:text-3xl font-light text-white mt-1">Tipuri de Fraude Detectate</h2>
          <p className="text-xs text-zinc-500 mt-2 max-w-2xl">
            Sistemul AiX OS™ monitorizează în timp real toate categoriile majore de risc care amenință tranzacțiile imobiliare de lux.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FRAUD_TYPES.map((fraud) => {
            const Icon = fraud.icon;
            return (
              <div
                key={fraud.title}
                className={`group p-6 rounded-3xl ${designSystem.glass} ${designSystem.glassHover} space-y-4`}
              >
                <div className={`rounded-xl p-2.5 border w-fit ${fraud.bg}`}>
                  <Icon className={`h-5 w-5 ${fraud.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">{fraud.title}</h3>
                  <p className="text-xs text-zinc-450 leading-relaxed mt-1.5">{fraud.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Protection Layers */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Left: Layers */}
        <div className="space-y-6">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-semibold">Defense Stack</span>
            <h2 className="text-2xl font-light text-white mt-1">Straturi de Protecție</h2>
          </div>
          <div className="space-y-3">
            {PROTECTION_LAYERS.map((layer, i) => (
              <div
                key={layer.label}
                className={`flex items-start gap-4 p-4 rounded-2xl border border-zinc-900 bg-zinc-950/40 hover:border-zinc-800 hover:bg-zinc-900/20 transition-all`}
              >
                <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{layer.label}</p>
                  <p className="text-[10.5px] text-zinc-500 mt-0.5 leading-relaxed">{layer.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Due Diligence Checklist */}
        <div className={`p-6 sm:p-8 rounded-3xl ${designSystem.glass} space-y-6 h-fit`}>
          <div className="flex items-center gap-3 border-b border-zinc-900/60 pb-5">
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 text-amber-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Due Diligence Checklist</h3>
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wide mt-0.5">Standard HNWI Transaction</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {CHECKLIST.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-xs text-zinc-400 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-900/60">
            <Link
              href="/anti-teapa"
              className="flex items-center justify-between text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              Rulează AntiȚeapă AI acum
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="space-y-8">
        <div className="border-b border-zinc-900 pb-5">
          <span className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-semibold">Tools & Resources</span>
          <h2 className="text-2xl font-light text-white mt-1">Instrumente & Resurse Securitate</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {RESOURCES.map((r) => (
            <Link
              key={r.title}
              href={r.href}
              className={`group p-6 rounded-3xl ${designSystem.glass} ${designSystem.glassHover} flex flex-col justify-between min-h-[130px]`}
            >
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">{r.title}</h3>
                <p className="text-xs text-zinc-450 mt-1.5 leading-relaxed">{r.desc}</p>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-zinc-500 group-hover:text-white uppercase tracking-wider mt-4">
                Accesează
                <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Emergency Contact CTA */}
      <section>
        <div className={`p-8 sm:p-12 rounded-3xl border border-red-500/20 bg-[#080808]/70 backdrop-blur-xl text-center space-y-6 relative overflow-hidden`}>
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-red-500/5 blur-3xl rounded-full pointer-events-none" />
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-2.5 text-red-400">
              <Phone className="h-5 w-5" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Ai Identificat o Fraudă?
          </h2>
          <p className="text-xs text-zinc-450 max-w-lg mx-auto leading-relaxed">
            Echipa noastră de securitate este disponibilă non-stop pentru investitori afiliați AiX OS™. Raportează orice activitate suspectă și primești suport prioritar în maximum 2 ore.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/contact"
              className="rounded-xl bg-red-500 text-white px-6 py-2.5 text-xs font-semibold hover:bg-red-400 transition-all shadow-md shadow-red-500/10 flex items-center gap-1.5"
            >
              <Shield className="h-3.5 w-3.5" />
              Raportează Urgent
            </Link>
            <Link
              href="/anti-teapa"
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 px-6 py-2.5 text-xs text-zinc-350 hover:text-white transition-all flex items-center gap-1"
            >
              AntiȚeapă AI Scanner
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

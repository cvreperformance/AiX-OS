"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { validateName, validatePhone, validateEmail, validateSelect, validateCheckbox } from "@/lib/validation";
import { designSystem } from "@/styles/designSystem";
import {
  Shield,
  Heart,
  Activity,
  Plane,
  Car,
  Building2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calculator,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function InsuranceClient() {
  const { language } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState("locuinta");
  
  // Lead form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Locuință / Home");
  const [submitted, setSubmitted] = useState(false);
  const [gdpr, setGdpr] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{name?: string, phone?: string, email?: string, category?: string, gdpr?: string}>({});

  // Calculator state
  const [propertyValue, setPropertyValue] = useState(150000);
  const [riskTier, setRiskTier] = useState("medium");

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});


    const nameErr = validateName(name);
    const phoneErr = validatePhone(phone);
    const emailErr = validateEmail(email);
    const categoryErr = validateSelect(category);
    const gdprErr = validateCheckbox(gdpr);

    if (nameErr || phoneErr || emailErr || categoryErr || gdprErr) {
      setFieldErrors({
        name: nameErr || undefined,
        phone: phoneErr || undefined,
        email: emailErr || undefined,
        category: categoryErr || undefined,
        gdpr: gdprErr || undefined,
      });
      return;
    }
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: "Insurance Quote Request",
          name,
          phone,
          email,
          message: `Insurance Quote Requested: Type: ${category}, Value: €${propertyValue}, Risk Tier: ${riskTier}`,
          source: "insurance-page",
          page: "/insurance",
        }),
      });
      if (response.ok) {
        setSubmitted(true);
      } else {
        throw new Error("API error");
      }
    } catch (err) {
      console.warn("Lead submit failed", err);
      setSubmitted(true);
    }
  };

  // Basic premium calculator logic
  const calculatedPAD = 20; // Fixed legally for Case A
  const calculatedFacultativa = Math.max(80, Math.round(propertyValue * 0.0006 * (riskTier === "high" ? 1.3 : riskTier === "low" ? 0.8 : 1.0)));
  const totalEstimatedPremium = calculatedPAD + calculatedFacultativa;

  const faqItems = [
    {
      q: language === "ro" ? "De ce să folosesc un broker și să nu merg direct la asigurător?" : "Why use a broker instead of going direct to an insurer?",
      a: language === "ro"
        ? "Un broker compară simultan toate ofertele din piață și negociază reduceri de volum, obținând un preț adesea mai mic. De asemenea, te asistăm gratuit în caz de daună."
        : "A broker compares all active market offerings at once and leverages volume discounts, often delivering better rates. We also assist you during claims.",
    },
    {
      q: language === "ro" ? "Ce este polița PAD și este ea obligatorie?" : "What is the PAD policy and is it mandatory?",
      a: language === "ro"
        ? "Polița PAD este asigurarea obligatorie a locuinței care acoperă riscurile catastrofale: cutremur, inundații și alunecări de teren. Da, este obligatorie prin lege."
        : "PAD is the mandatory national home insurance covering natural disasters: earthquakes, floods, and landslides. It is required by Romanian law.",
    },
    {
      q: language === "ro" ? "Pot asigura proprietăți de mare valoare la valoarea lor reală?" : "Can I insure high-value properties at full value?",
      a: language === "ro"
        ? "Da, polițele standard au limite reduse de despăgubire. Pentru active imobiliare de valoare oferim polițe dedicate cu acoperiri complete pentru artă, finisaje superioare și bunuri de preț."
        : "Yes. Standard policies cap payouts. For high-value portfolios, we broker dedicated high-limit coverage protecting custom finishes, art collections, and high-value structures.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16 animate-in">
      {/* Header */}
      <section className="space-y-6 max-w-3xl">
        <span className="inline-block text-xs uppercase tracking-[0.2em] text-amber-500/80 border border-amber-500/20 rounded-full px-3 py-1">
          {language === "ro" ? "AiX OS™ · Asigurări Bunuri & Active" : "AiX OS™ · Asset Insurance"}
        </span>
        <h1 className="text-4xl md:text-5xl font-light text-zinc-900 leading-tight">
          {language === "ro"
            ? "Protejează-ți activele pentru a evita pierderi financiare"
            : "Safeguard your assets to prevent financial loss"}
          <br />
          <span className="gradient-gold">{language === "ro" ? "cu soluții optimizate pentru bugetul tău" : "with cost‑effective solutions"}</span>
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          {language === "ro"
            ? "Obține cea mai bună protecție pentru activele tale și economisește până la 20% la primă."
            : "Get optimal coverage for your assets while saving up to 20% on premiums."}
        </p>
      </section>

      {/* Calculator Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Sliders Card */}
        <div className={`lg:col-span-2 rounded-3xl ${designSystem.glass} p-6 sm:p-8 space-y-6 shadow-2xl`}>
          <div className="flex items-center gap-3 border-b border-zinc-200 pb-4">
            <Calculator className="h-5 w-5 text-amber-400" />
            <div>
              <h2 className="text-lg font-light text-zinc-900">
                {language === "ro" ? "Calculator Primă Locuință" : "Home Premium Estimator"}
              </h2>
              <p className="text-[10px] text-zinc-550 uppercase tracking-widest font-mono">
                {language === "ro" ? "Evaluare estimativă primă facultativă" : "Optional home coverage math"}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-600 font-medium">{language === "ro" ? "Valoare proprietate / reconstructie:" : "Property reconstruction value:"}</span>
                <span className="font-mono font-bold text-zinc-900">€{propertyValue.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="1000000"
                step="10000"
                value={propertyValue}
                onChange={(e) => setPropertyValue(parseInt(e.target.value) || 50000)}
                className="w-full h-1 bg-zinc-50 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs text-zinc-600 block">{language === "ro" ? "Nivel Risc Locație (Clădiri vechi, seism):" : "Location Risk Parameters (Seismic risk, construction age):"}</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "low", label: language === "ro" ? "Redus" : "Low" },
                  { id: "medium", label: language === "ro" ? "Mediu" : "Medium" },
                  { id: "high", label: language === "ro" ? "Ridicat" : "High" },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRiskTier(r.id)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      riskTier === r.id ? "bg-amber-500 border-amber-500 text-black" : "border-zinc-200 text-zinc-400 bg-white/20"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Visual Panel */}
        <div className={`rounded-3xl ${designSystem.glass} p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col justify-between min-h-[260px]`}>
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-widest text-zinc-550 font-bold block">{language === "ro" ? "Cotație Estimată" : "Estimated Premium Breakdown"}</span>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-zinc-450 border-b border-zinc-200 pb-1.5">
                <span>{language === "ro" ? "Poliță PAD (Obligatorie):" : "PAD (Mandatory):"}</span>
                <span className="text-zinc-900">€{calculatedPAD} / an</span>
              </div>
              <div className="flex justify-between text-zinc-450 border-b border-zinc-200 pb-1.5">
                <span>{language === "ro" ? "Facultativă (Clauze complete):" : "Optional (All-risk policy):"}</span>
                <span className="text-zinc-900">~€{calculatedFacultativa} / an</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-200/60 text-center">
            <span className="text-[9px] uppercase text-zinc-550 font-semibold block">{language === "ro" ? "Total Estimat" : "Total Estimated"}</span>
            <span className="text-3xl font-light text-amber-400 font-mono">~€{totalEstimatedPremium}</span>
            <span className="text-[9px] text-zinc-550 block mt-0.5">{language === "ro" ? "/ an (plată unică)" : "/ year (single payment)"}</span>
          </div>
        </div>
      </section>

      {/* PAD Note */}
      <section className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6 flex gap-4">
        <Shield className="h-6 w-6 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-400 mb-1">
            {language === "ro" ? "PAD — Asigurarea Obligatorie a Locuinței în România" : "PAD — Mandatory Romanian Home Insurance"}
          </p>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {language === "ro"
              ? "Toate proprietățile rezidențiale din România sunt obligate prin lege să dețină o poliță PAD activă. Suma asigurată este de 20.000 EUR pentru clădirile din beton/cărămidă (Prima de 20 EUR/an) sau 10.000 EUR pentru chirpici/lemn (Prima de 10 EUR/an). AiX OS™ completează automat PAD-ul cu o poliță facultativă pentru restul valorii proprietății tale."
              : "All residential properties in Romania are legally mandated to have active PAD insurance. PAD caps payouts at €20,000 for standard structures (at €20/year) and €10,000 for timber/clay structures (at €10/year). Our dashboard maps optional additions to cover properties up to their true replacement market value."}
          </p>
        </div>
      </section>

      {/* Comparisons Card Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={`p-6 sm:p-8 rounded-3xl ${designSystem.glass} border border-zinc-200 space-y-4`}>
          <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-400 max-w-fit">
            <Shield className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900">
            {language === "ro" ? "Polița Obligatorie PAD" : "PAD Mandatory Coverage"}
          </h3>
          <ul className="space-y-2 text-xs text-zinc-400 leading-relaxed">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-500/70" />
              <span>{language === "ro" ? "Cutremur (limitat la 20.000 EUR)" : "Earthquake (capped at €20,000)"}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-500/70" />
              <span>{language === "ro" ? "Inundații din cauze naturale" : "Flooding from natural causes"}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-500/70" />
              <span>{language === "ro" ? "Alunecări de teren" : "Landslides"}</span>
            </li>
          </ul>
        </div>

        <div className={`p-6 sm:p-8 rounded-3xl ${designSystem.glass} border border-zinc-200 space-y-4`}>
          <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-450 max-w-fit">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900">
            {language === "ro" ? "Asigurarea Facultativă Completă" : "All-Risk Optional Home Insurance"}
          </h3>
          <ul className="space-y-2 text-xs text-zinc-400 leading-relaxed">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-450" />
              <span>{language === "ro" ? "Incendiu, trăsnet, explozii sau fum" : "Fire, lightning strikes, smoke, or gas blasts"}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-450" />
              <span>{language === "ro" ? "Furt, vandalism și daune geamuri/finisaje" : "Theft, vandalism, structural windows, or custom finishes"}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-450" />
              <span>{language === "ro" ? "Răspundere civilă față de vecini (inundații bloc)" : "Civil liability coverage for neighbors (e.g. pipe leaks)"}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Claims Guidance & Risk Assessment */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={`p-6 sm:p-8 rounded-3xl ${designSystem.glass} border border-zinc-200 space-y-4`}>
          <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400 max-w-fit">
            <AlertCircle className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900">
            {language === "ro" ? "Ghid de Procedură în caz de Daună" : "Insurance Claims Action Guide"}
          </h3>
          <ol className="space-y-3 text-xs text-zinc-400 list-decimal pl-4 leading-relaxed">
            <li>
              <strong>{language === "ro" ? "Securizați bunurile" : "Mitigate Damage"}:</strong> {language === "ro" ? "Opriți alimentarea cu apă/gaze pentru a evita agravarea daunei." : "Turn off main water/gas valves to prevent wider losses."}
            </li>
            <li>
              <strong>{language === "ro" ? "Fotografiați distrugerile" : "Photo Evidence"}:</strong> {language === "ro" ? "Efectuați fotografii și video de detaliu înainte de a curăța locul." : "Take detailed close-up pictures and videos before cleanup."}
            </li>
            <li>
              <strong>{language === "ro" ? "Notificați rapid" : "Notify Insurer promptly"}:</strong> {language === "ro" ? "Contactați asigurătorul sau brokerul tău AiX OS™ pentru a înregistra dosarul." : "Report details to your broker or carrier to assign adjusters."}
            </li>
            <li>
              <strong>{language === "ro" ? "Păstrați devizele" : "Store Repair Bills"}:</strong> {language === "ro" ? "Toate reparațiile trebuie facturate pentru decontarea directă sau rambursare." : "All repairs require receipts/invoices for reimbursement audits."}
            </li>
          </ol>
        </div>

        <div className={`p-6 sm:p-8 rounded-3xl ${designSystem.glass} border border-zinc-200 space-y-4`}>
          <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-400 max-w-fit">
            <Shield className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900">
            {language === "ro" ? "Evaluarea Riscurilor Imobiliare" : "Real Estate Risk Assessment Parameters"}
          </h3>
          <ul className="space-y-3 text-xs text-zinc-400 leading-relaxed">
            <li>
              <strong>{language === "ro" ? "Clasa Seismică RS1/RS2" : "Seismic Class RS1/RS2"}:</strong> {language === "ro" ? "Clădirile încadrate în clasa 1 de risc seismic nu pot fi asigurate facultativ." : "RS1 class heritage structures cannot be insured under optional home policies."}
            </li>
            <li>
              <strong>{language === "ro" ? "Risc de Inundație Albie" : "River Basin Flood Risk"}:</strong> {language === "ro" ? "Apropierea de cursuri de apă active necesită franșize speciale la asiguratori." : "Plots located in river basins require custom deductibles."}
            </li>
            <li>
              <strong>{language === "ro" ? "Bunuri excluse implicit" : "Asset Exclusions"}:</strong> {language === "ro" ? "Bijuteriile, banii cash și arta necesită evaluare și poliță separată." : "Gold bars, cash, and fine arts are excluded from standard policies."}
            </li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-light text-zinc-900 text-center">
          {language === "ro" ? "Întrebări Frecvente" : "Frequently Asked Questions"}
        </h2>
        <div className="space-y-4">
          {faqItems.map((faq, idx) => (
            <div key={idx} className="rounded-2xl border border-zinc-200 bg-white/20 p-5 space-y-2">
              <h3 className="text-xs font-semibold text-zinc-900 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-amber-500/60 shrink-0" />
                {faq.q}
              </h3>
              <p className="text-xs text-zinc-450 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quote Submission Form */}
      <section className="rounded-3xl border border-zinc-200 bg-white/70 backdrop-blur-xl p-8 max-w-3xl mx-auto shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-light text-zinc-900">
            {language === "ro" ? "Solicită Consultanță Asigurări" : "Request Insurance Review"}
          </h2>
          <p className="text-xs text-zinc-550">
            {language === "ro" ? "Recomandăm ofertele cu clauze optime pe baza profilului tău." : "We outline the optimum coverage matching your risk profile."}
          </p>
        </div>

        {submitted ? (
          <div className="text-center p-6 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl animate-in fade-in duration-300">
            <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-zinc-900">
              {language === "ro" ? "Solicitare Trimisă cu Succes!" : "Quote Requested Successfully!"}
            </p>
            <p className="text-[11px] text-zinc-400 mt-1">
              {language === "ro" ? "Consilierii noștri de asigurare te vor contacta în scurt timp." : "Our specialist advisors will review and contact you shortly."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleLeadSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: undefined });
                  }}
                  placeholder={language === "ro" ? "Numele tău" : "Your Name"}
                  className={`w-full rounded-xl border ${fieldErrors.name ? 'border-red-500' : 'border-zinc-200'} bg-zinc-50/40 px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-500 focus:border-amber-500/50 focus:outline-none transition-colors`}
                />
                {fieldErrors.name && <p className="text-red-500 text-[10px] mt-0.5">{fieldErrors.name}</p>}
              </div>
              <div>
                <input
                  required
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: undefined });
                  }}
                  placeholder={language === "ro" ? "Telefon" : "Phone Number"}
                  className={`w-full rounded-xl border ${fieldErrors.phone ? 'border-red-500' : 'border-zinc-200'} bg-zinc-50/40 px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-500 focus:border-amber-500/50 focus:outline-none transition-colors`}
                />
                {fieldErrors.phone && <p className="text-red-500 text-[10px] mt-0.5">{fieldErrors.phone}</p>}
              </div>
            </div>
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                }}
                placeholder={language === "ro" ? "Email" : "Email Address"}
                className={`w-full rounded-xl border ${fieldErrors.email ? 'border-red-500' : 'border-zinc-200'} bg-zinc-50/40 px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-500 focus:border-amber-500/50 focus:outline-none transition-colors`}
              />
              {fieldErrors.email && <p className="text-red-500 text-[10px] mt-0.5">{fieldErrors.email}</p>}
            </div>
            <div>
              <select
                required
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (fieldErrors.category) setFieldErrors({ ...fieldErrors, category: undefined });
                }}
                className={`w-full rounded-xl border ${fieldErrors.category ? 'border-red-500 text-red-500' : 'border-zinc-200 text-zinc-900'} bg-zinc-50/40 px-4 py-2.5 text-xs focus:border-amber-500/50 focus:outline-none transition-colors`}
              >
                <option value="Locuință / Home">{language === "ro" ? "Asigurare Locuință" : "Home / Property Insurance"}</option>
                <option value="Viață / Life">{language === "ro" ? "Asigurare de Viață" : "Life & Mortgage Insurance"}</option>
                <option value="Sănătate / Health">{language === "ro" ? "Asigurare Sănătate" : "Private Medical Insurance"}</option>
                <option value="Auto / Motor">{language === "ro" ? "Asigurare Auto (RCA / CASCO)" : "Motor Insurance (RCA/CASCO)"}</option>
                <option value="Business / Corp">{language === "ro" ? "Asigurare Business / Corporate" : "Corporate & D&O Insurance"}</option>
              </select>
              {fieldErrors.category && <p className="text-red-500 text-[10px] mt-0.5">{fieldErrors.category}</p>}
            </div>

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
              className="w-full rounded-xl bg-amber-500 text-black py-3 text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10 active:scale-95"
            >
              {language === "ro" ? "Solicită Consultanță Gratuită" : "Submit Quote Request"}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

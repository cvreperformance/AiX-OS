"use client";

import { useState } from "react";
import Link from "next/link";
import { submitContactForm } from "@/lib/contactSubmit";
import { CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function SellerLeadForm() {
  const { language } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [botfield, setBotfield] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await submitContactForm({
        service: "Seller Representation",
        page: window.location.pathname,
        name,
        phone,
        email: email || undefined,
        message: `Property Address: ${address}\nProperty Type: ${propertyType || "N/A"}\nEstimated Price: ${estimatedPrice || "N/A"}`,
        source: "seller-form",
        botfield: botfield || undefined,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || (language === "ro" ? "Eroare la trimitere." : "Submission error."));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center space-y-2 animate-in fade-in duration-300">
        <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
        <h4 className="text-sm font-semibold text-zinc-900">
          {language === "ro" ? "Solicitare Înregistrată!" : "Request Submitted!"}
        </h4>
        <p className="text-xs text-zinc-400">
          {language === "ro"
            ? "Vă vom contacta telefonic pentru stabilirea evaluării gratuite în 24 de ore."
            : "We will contact you by phone to schedule your valuation within 24 hours."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-red-400 flex items-center gap-2 text-xs">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={language === "ro" ? "Numele tău" : "Your name"}
          className="rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none transition-colors"
        />
        <input
          required
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={language === "ro" ? "Telefon" : "Phone"}
          className="rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none transition-colors"
        />
      </div>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={language === "ro" ? "E-mail (opțional)" : "E-mail (optional)"}
        className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none transition-colors"
      />

      <input
        required
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder={language === "ro" ? "Adresa proprietății" : "Property address"}
        className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none transition-colors"
      />

      <div className="grid grid-cols-2 gap-3">
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-350 focus:border-amber-500/50 focus:outline-none transition-colors"
        >
          <option value="">{language === "ro" ? "Tipul proprietății" : "Property type"}</option>
          <option value="Apartament">{language === "ro" ? "Apartament" : "Apartment"}</option>
          <option value="Casă / Vilă">{language === "ro" ? "Casă / Vilă" : "House / Villa"}</option>
          <option value="Penthouse">Penthouse</option>
          <option value="Teren">{language === "ro" ? "Teren" : "Land"}</option>
          <option value="Comercial">{language === "ro" ? "Comercial" : "Commercial"}</option>
        </select>
        <input
          value={estimatedPrice}
          onChange={(e) => setEstimatedPrice(e.target.value)}
          placeholder={language === "ro" ? "Preț estimat (€)" : "Estimated price (€)"}
          type="number"
          className="rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none transition-colors"
        />
      </div>

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

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-amber-500/90 py-3 text-sm font-medium text-black hover:bg-amber-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
      >
        {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
        {loading
          ? (language === "ro" ? "Se trimite..." : "Sending...")
          : (language === "ro" ? "Solicită Evaluare" : "Request Valuation")}
      </button>
      <p className="text-xs text-zinc-650 text-center">
        {language === "ro" ? "Evaluare în 24h. Fără angajamente." : "Valuation within 24h. No obligations."}
      </p>
    </form>
  );
}

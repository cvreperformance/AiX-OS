"use client";

import { useState } from "react";
import Link from "next/link";
import { submitContactForm } from "@/lib/contactSubmit";
import { validateName, validatePhone, validateEmail, validateSelect, validateCheckbox, validateRequiredString } from "@/lib/validation";
import { CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function BuyerLeadForm() {
  const { language } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [details, setDetails] = useState("");
  const [botfield, setBotfield] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [gdpr, setGdpr] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{name?: string, phone?: string, email?: string, budget?: string, propertyType?: string, details?: string, gdpr?: string}>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});


    const nameErr = validateName(name);
    const phoneErr = validatePhone(phone);
    const emailErr = validateEmail(email);
    const budgetErr = validateRequiredString(budget, "Budget");
    const propTypeErr = validateSelect(propertyType);
    const detailsErr = validateRequiredString(details, "Details");
    const gdprErr = validateCheckbox(gdpr);

    if (nameErr || phoneErr || emailErr || budgetErr || propTypeErr || detailsErr || gdprErr) {
      setFieldErrors({
        name: nameErr || undefined,
        phone: phoneErr || undefined,
        email: emailErr || undefined,
        budget: budgetErr || undefined,
        propertyType: propTypeErr || undefined,
        details: detailsErr || undefined,
        gdpr: gdprErr || undefined,
      });
      return;
    }

    setLoading(true);

    try {
      await submitContactForm({
        service: "Buyer Representation",
        page: window.location.pathname,
        name,
        phone,
        email,
        message: `Property Type: ${propertyType || "N/A"}\nBudget: ${budget || "N/A"}\nDetails: ${details || "N/A"}`,
        source: "buyer-form",
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
          {language === "ro" ? "Solicitare Trimisă!" : "Request Submitted!"}
        </h4>
        <p className="text-xs text-zinc-400">
          {language === "ro"
            ? "Consilierul desemnat vă va contacta în maxim 24 de ore."
            : "Your assigned advisor will contact you within 24 hours."}
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
        <div>
          <input
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: undefined });
            }}
            placeholder={language === "ro" ? "Numele tău" : "Your name"}
            className={`w-full rounded-xl border ${fieldErrors.name ? 'border-red-500' : 'border-zinc-300'} bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none transition-colors`}
          />
          {fieldErrors.name && <p className="text-red-500 text-[10px] mt-1">{fieldErrors.name}</p>}
        </div>
        <div>
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: undefined });
            }}
            placeholder={language === "ro" ? "Telefon" : "Phone"}
            className={`w-full rounded-xl border ${fieldErrors.phone ? 'border-red-500' : 'border-zinc-300'} bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none transition-colors`}
          />
          {fieldErrors.phone && <p className="text-red-500 text-[10px] mt-1">{fieldErrors.phone}</p>}
        </div>
      </div>

      <div>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
          }}
          placeholder={language === "ro" ? "E-mail" : "E-mail"}
          className={`w-full rounded-xl border ${fieldErrors.email ? 'border-red-500' : 'border-zinc-300'} bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none transition-colors`}
        />
        {fieldErrors.email && <p className="text-red-500 text-[10px] mt-1">{fieldErrors.email}</p>}
      </div>

      <div>
        <input
          required
          value={budget}
          onChange={(e) => {
            setBudget(e.target.value);
            if (fieldErrors.budget) setFieldErrors({ ...fieldErrors, budget: undefined });
          }}
          placeholder={language === "ro" ? "Buget estimat (€)" : "Estimated budget (€)"}
          className={`w-full rounded-xl border ${fieldErrors.budget ? 'border-red-500' : 'border-zinc-300'} bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none transition-colors`}
        />
        {fieldErrors.budget && <p className="text-red-500 text-[10px] mt-1">{fieldErrors.budget}</p>}
      </div>

      <div>
        <select
          required
          value={propertyType}
          onChange={(e) => {
            setPropertyType(e.target.value);
            if (fieldErrors.propertyType) setFieldErrors({ ...fieldErrors, propertyType: undefined });
          }}
          className={`w-full rounded-xl border ${fieldErrors.propertyType ? 'border-red-500 text-red-500' : 'border-zinc-300 text-zinc-350'} bg-zinc-50 px-4 py-2.5 text-sm focus:border-amber-500/50 focus:outline-none transition-colors`}
        >
          <option value="">{language === "ro" ? "Tipul proprietății dorite" : "Desired property type"}</option>
          <option value="Apartament">{language === "ro" ? "Apartament" : "Apartment"}</option>
          <option value="Casă / Vilă">{language === "ro" ? "Casă / Vilă" : "House / Villa"}</option>
          <option value="Penthouse">Penthouse</option>
          <option value="Comercial / Birou">{language === "ro" ? "Comercial / Birou" : "Commercial / Office"}</option>
          <option value="Teren">{language === "ro" ? "Teren" : "Land"}</option>
          <option value="Orice oportunitate bună">{language === "ro" ? "Orice oportunitate bună" : "Any good opportunity"}</option>
        </select>
        {fieldErrors.propertyType && <p className="text-red-500 text-[10px] mt-1">{fieldErrors.propertyType}</p>}
      </div>

      <div>
        <textarea
          required
          value={details}
          onChange={(e) => {
            setDetails(e.target.value);
            if (fieldErrors.details) setFieldErrors({ ...fieldErrors, details: undefined });
          }}
          placeholder={language === "ro" ? "Detalii suplimentare (locație, suprafață, obiectiv...)" : "Additional details (location, area, goal...)"}
          rows={3}
          className={`w-full rounded-xl border ${fieldErrors.details ? 'border-red-500' : 'border-zinc-300'} bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none transition-colors resize-none`}
        />
        {fieldErrors.details && <p className="text-red-500 text-[10px] mt-1">{fieldErrors.details}</p>}
      </div>

      <div>
        <label className="flex items-start gap-2 cursor-pointer">
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
                Confirm că am citit și sunt de acord cu{" "}
                <Link href="/privacy" className="text-amber-500 hover:underline font-semibold">
                  Politica de Confidențialitate & Notificarea GDPR AiX OS™
                </Link>{" "}
                și accept să fiu contactat.
              </>
            ) : (
              <>
                I confirm that I have read and agree to the{" "}
                <Link href="/privacy" className="text-amber-500 hover:underline font-semibold">
                  AiX OS™ Privacy Policy & GDPR Notice
                </Link>{" "}
                and consent to being contacted.
              </>
            )}
          </p>
        </label>
        {fieldErrors.gdpr && <p className="text-red-500 text-[10px] mt-1">{fieldErrors.gdpr}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-amber-500/90 py-3 text-sm font-medium text-black hover:bg-amber-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
      >
        {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
        {loading
          ? (language === "ro" ? "Se trimite..." : "Sending...")
          : (language === "ro" ? "Trimite Solicitarea" : "Submit Request")}
      </button>
      <p className="text-[10px] text-zinc-600 text-center">
        {language === "ro"
          ? "Răspundem în maxim 24h. Beneficiați de o consultație inițială profesionistă."
          : "We respond within 24h. Receive an expert initial consultation."}
      </p>
    </form>
  );
}

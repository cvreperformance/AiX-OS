"use client";

import { useState } from "react";
import Link from "next/link";
import { submitContactForm } from "@/lib/contactSubmit";
import { validateName, validatePhone, validateEmail, validateSelect, validateCheckbox, validateRequiredString } from "@/lib/validation";
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

  const [gdpr, setGdpr] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{name?: string, phone?: string, email?: string, address?: string, propertyType?: string, estimatedPrice?: string, gdpr?: string}>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});


    const nameErr = validateName(name);
    const phoneErr = validatePhone(phone);
    const emailErr = validateEmail(email);
    const addressErr = validateRequiredString(address, "Address");
    const propTypeErr = validateSelect(propertyType);
    const priceErr = validateRequiredString(estimatedPrice, "Estimated Price");
    const gdprErr = validateCheckbox(gdpr);

    if (nameErr || phoneErr || emailErr || addressErr || propTypeErr || priceErr || gdprErr) {
      setFieldErrors({
        name: nameErr || undefined,
        phone: phoneErr || undefined,
        email: emailErr || undefined,
        address: addressErr || undefined,
        propertyType: propTypeErr || undefined,
        estimatedPrice: priceErr || undefined,
        gdpr: gdprErr || undefined,
      });
      return;
    }

    setLoading(true);

    try {
      await submitContactForm({
        service: "Seller Representation",
        page: window.location.pathname,
        name,
        phone,
        email,
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
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            if (fieldErrors.address) setFieldErrors({ ...fieldErrors, address: undefined });
          }}
          placeholder={language === "ro" ? "Adresa proprietății" : "Property address"}
          className={`w-full rounded-xl border ${fieldErrors.address ? 'border-red-500' : 'border-zinc-300'} bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none transition-colors`}
        />
        {fieldErrors.address && <p className="text-red-500 text-[10px] mt-1">{fieldErrors.address}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
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
            <option value="">{language === "ro" ? "Tipul proprietății" : "Property type"}</option>
            <option value="Apartament">{language === "ro" ? "Apartament" : "Apartment"}</option>
            <option value="Casă / Vilă">{language === "ro" ? "Casă / Vilă" : "House / Villa"}</option>
            <option value="Penthouse">Penthouse</option>
            <option value="Teren">{language === "ro" ? "Teren" : "Land"}</option>
            <option value="Comercial">{language === "ro" ? "Comercial" : "Commercial"}</option>
          </select>
          {fieldErrors.propertyType && <p className="text-red-500 text-[10px] mt-1">{fieldErrors.propertyType}</p>}
        </div>
        <div>
          <input
            required
            type="number"
            value={estimatedPrice}
            onChange={(e) => {
              setEstimatedPrice(e.target.value);
              if (fieldErrors.estimatedPrice) setFieldErrors({ ...fieldErrors, estimatedPrice: undefined });
            }}
            placeholder={language === "ro" ? "Preț estimat (€)" : "Estimated price (€)"}
            className={`w-full rounded-xl border ${fieldErrors.estimatedPrice ? 'border-red-500' : 'border-zinc-300'} bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none transition-colors`}
          />
          {fieldErrors.estimatedPrice && <p className="text-red-500 text-[10px] mt-1">{fieldErrors.estimatedPrice}</p>}
        </div>
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
          ? "Răspundem în maxim 24h. Evaluarile noastre sunt 100% confidențiale."
          : "We respond within 24h. Our valuations are 100% confidential."}
      </p>
    </form>
  );
}

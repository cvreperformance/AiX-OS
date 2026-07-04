"use client";

import { useState } from "react";
import { submitContactForm } from "@/lib/contactSubmit";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await submitContactForm({
        service: "Buyer Representation",
        page: window.location.pathname,
        name,
        phone,
        email: email || undefined,
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
        <h4 className="text-sm font-semibold text-white">
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
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={language === "ro" ? "Numele tău" : "Your name"}
          className="col-span-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none transition-colors"
        />
        <input
          required
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={language === "ro" ? "Telefon" : "Phone"}
          className="col-span-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none transition-colors"
        />
      </div>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={language === "ro" ? "E-mail (opțional)" : "E-mail (optional)"}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none transition-colors"
      />

      <input
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        placeholder={language === "ro" ? "Buget estimat (€)" : "Estimated budget (€)"}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none transition-colors"
      />

      <select
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value)}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-350 focus:border-amber-500/50 focus:outline-none transition-colors"
      >
        <option value="">{language === "ro" ? "Tipul proprietății dorite" : "Desired property type"}</option>
        <option value="Apartament">{language === "ro" ? "Apartament" : "Apartment"}</option>
        <option value="Casă / Vilă">{language === "ro" ? "Casă / Vilă" : "House / Villa"}</option>
        <option value="Penthouse">Penthouse</option>
        <option value="Comercial / Birou">{language === "ro" ? "Comercial / Birou" : "Commercial / Office"}</option>
        <option value="Teren">{language === "ro" ? "Teren" : "Land"}</option>
        <option value="Orice oportunitate bună">{language === "ro" ? "Orice oportunitate bună" : "Any good opportunity"}</option>
      </select>

      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder={language === "ro" ? "Detalii suplimentare (locație, suprafață, obiectiv...)" : "Additional details (location, area, goal...)"}
        rows={3}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none transition-colors resize-none"
      />

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
          ? "Răspundem în maxim 24h. Consultație inițială gratuită."
          : "We respond within 24h. Initial consultation is free."}
      </p>
    </form>
  );
}

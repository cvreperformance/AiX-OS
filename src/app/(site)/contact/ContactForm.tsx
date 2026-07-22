"use client";

import { useState } from "react";
import { submitContactForm } from "@/lib/contactSubmit";
import { validateName, validatePhone, validateEmail, validateSelect, validateCheckbox, validateRequiredString } from "@/lib/validation";
import Link from "next/link";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type Status = "idle" | "loading" | "success" | "error";

const SUBJECTS_RO = [
  "Consultație investiții",
  "Buyer Representation",
  "Seller Representation / Evaluare",
  "Asigurare locuință / viață",
  "AntiȚeapă — verificare proprietate",
  "Oportunitate off-market",
  "Luxury Concierge",
  "Rețea privată / Networking",
  "Parteneriat / Agenție",
  "Altceva",
];

const SUBJECTS_EN = [
  "Investment Consultation",
  "Buyer Representation",
  "Seller Representation / Valuation",
  "Asset / Life Insurance",
  "AntiȚeapă — Property Audit",
  "Off-Market Placement Deal",
  "Luxury Concierge",
  "Private Network / Networking",
  "Partnership / Agency",
  "Other Inquiry",
];

const BUDGETS_RO = [
  "Sub €50,000",
  "€50,000 — €100,000",
  "€100,000 — €250,000",
  "€250,000 — €500,000",
  "€500,000 — €1,000,000",
  "Peste €1,000,000",
  "Prefer să nu specific",
];

const BUDGETS_EN = [
  "Under €50,000",
  "€50,000 — €100,000",
  "€100,000 — €250,000",
  "€250,000 — €500,000",
  "€500,000 — €1,000,000",
  "Over €1,000,000",
  "Prefer not to specify",
];

export default function ContactForm() {
  const { language } = useLanguage();
  const [status, setStatus] = useState<Status>("idle");
  const [botfield, setBotfield] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    budget: "",
    message: "",
  });

  const [gdpr, setGdpr] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{name?: string, phone?: string, email?: string, subject?: string, budget?: string, message?: string, gdpr?: string}>({});

  const subjects = language === "ro" ? SUBJECTS_RO : SUBJECTS_EN;
  const budgets = language === "ro" ? BUDGETS_RO : BUDGETS_EN;

  function update(field: keyof typeof formData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field in fieldErrors) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    setFieldErrors({});


    const nameErr = validateName(formData.name);
    const phoneErr = validatePhone(formData.phone);
    const emailErr = validateEmail(formData.email);
    const subjectErr = validateSelect(formData.subject);
    const budgetErr = validateSelect(formData.budget);
    const messageErr = validateRequiredString(formData.message, "Message");
    const gdprErr = validateCheckbox(gdpr);

    if (nameErr || phoneErr || emailErr || subjectErr || budgetErr || messageErr || gdprErr) {
      setFieldErrors({
        name: nameErr || undefined,
        phone: phoneErr || undefined,
        email: emailErr || undefined,
        subject: subjectErr || undefined,
        budget: budgetErr || undefined,
        message: messageErr || undefined,
        gdpr: gdprErr || undefined,
      });
      setStatus("idle");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: formData.subject || "General Contact",
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          message: `Subject: ${formData.subject}\nBudget: ${formData.budget || "N/A"}\nMessage: ${formData.message || "N/A"}`,
          source: "contact-form",
          page: "/contact",
          botfield: botfield || undefined,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "API error");
      }
      setStatus("success");
    } catch (err: any) {
      const roMsg = "A apărut o eroare la trimiterea mesajului.";
      const enMsg = "An error occurred while sending the message.";
      setErrorMessage(err.message || (language === "ro" ? roMsg : enMsg));
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-zinc-300 bg-zinc-100/50 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-650 focus:border-amber-500/40 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all";

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-12 text-center space-y-4">
        <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
        <h3 className="text-xl font-light text-zinc-900">
          {language === "ro" ? "Mesaj trimis cu succes!" : "Message sent successfully!"}
        </h3>
        <p className="text-zinc-400 text-xs leading-relaxed">
          {language === "ro"
            ? "Te vom contacta în maxim 24h. Dacă este urgent, folosește WhatsApp."
            : "We will contact you within 24 hours. For urgent inquiries, please use WhatsApp."}
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setFormData({ name: "", email: "", phone: "", subject: "", budget: "", message: "" });
            setGdpr(false);
          }}
          className="text-sm font-semibold text-amber-500/80 hover:text-amber-400 transition-colors"
        >
          {language === "ro" ? "Trimite alt mesaj" : "Send another message"}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-zinc-200 bg-white/40 p-8 space-y-5"
    >
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

      {errorMessage && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-red-400 text-xs">
          {errorMessage}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5 text-left">
          <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-550">
            {language === "ro" ? "Nume" : "Name"} <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder={language === "ro" ? "Prenumele tău" : "Your name"}
            value={formData.name}
            onChange={(e) => update("name", e.target.value)}
            className={`${inputClass} ${fieldErrors.name ? 'border-red-500' : ''}`}
          />
          {fieldErrors.name && <p className="text-red-500 text-[10px]">{fieldErrors.name}</p>}
        </div>
        <div className="space-y-1.5 text-left">
          <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-550">
            {language === "ro" ? "Telefon" : "Phone"} <span className="text-red-400">*</span>
          </label>
          <input
            type="tel"
            required
            placeholder={language === "ro" ? "+43 650..." : "+43 650..."}
            value={formData.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={`${inputClass} ${fieldErrors.phone ? 'border-red-500' : ''}`}
          />
          {fieldErrors.phone && <p className="text-red-500 text-[10px]">{fieldErrors.phone}</p>}
        </div>
      </div>

      <div className="space-y-1.5 text-left">
        <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-550">
          Email <span className="text-red-400">*</span>
        </label>
        <input
          type="email"
          required
          placeholder="email@exemplu.com"
          value={formData.email}
          onChange={(e) => update("email", e.target.value)}
          className={`${inputClass} ${fieldErrors.email ? 'border-red-500' : ''}`}
        />
        {fieldErrors.email && <p className="text-red-500 text-[10px]">{fieldErrors.email}</p>}
      </div>

      <div className="space-y-1.5 text-left">
        <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-550">
          {language === "ro" ? "Subiect" : "Subject"} <span className="text-red-400">*</span>
        </label>
        <select
          required
          value={formData.subject}
          onChange={(e) => update("subject", e.target.value)}
          className={`w-full rounded-xl border ${fieldErrors.subject ? 'border-red-500 text-red-500' : 'border-zinc-300 text-zinc-900'} bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500/40 focus:outline-none transition-all`}
        >
          <option value="">
            {language === "ro" ? "Selectează subiectul…" : "Select subject…"}
          </option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {fieldErrors.subject && <p className="text-red-500 text-[10px]">{fieldErrors.subject}</p>}
      </div>

      <div className="space-y-1.5 text-left">
        <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-550">
          {language === "ro" ? "Buget estimat" : "Estimated Budget"} <span className="text-red-400">*</span>
        </label>
        <select
          required
          value={formData.budget}
          onChange={(e) => update("budget", e.target.value)}
          className={`w-full rounded-xl border ${fieldErrors.budget ? 'border-red-500 text-red-500' : 'border-zinc-300 text-zinc-900'} bg-zinc-50 px-4 py-3 text-sm focus:border-amber-500/40 focus:outline-none transition-all`}
        >
          <option value="">
            {language === "ro" ? "Selectează intervalul…" : "Select range…"}
          </option>
          {budgets.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        {fieldErrors.budget && <p className="text-red-500 text-[10px]">{fieldErrors.budget}</p>}
      </div>

      <div className="space-y-1.5 text-left">
        <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-550">
          {language === "ro" ? "Mesaj" : "Message"} <span className="text-red-400">*</span>
        </label>
        <textarea
          required
          rows={4}
          placeholder={
            language === "ro"
              ? "Descrie ce cauți, ce obiective ai sau orice altceva relevant…"
              : "Describe what you are looking for, your objectives, or anything else relevant…"
          }
          value={formData.message}
          onChange={(e) => update("message", e.target.value)}
          className={`${inputClass} resize-none ${fieldErrors.message ? 'border-red-500' : ''}`}
        />
        {fieldErrors.message && <p className="text-red-500 text-[10px]">{fieldErrors.message}</p>}
      </div>

      {status === "error" && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {language === "ro"
            ? "A apărut o eroare. Încearcă din nou sau folosește WhatsApp."
            : "An error occurred. Please try again or connect via WhatsApp."}
        </div>
      )}

      <div>
        <label className="flex items-start gap-2 cursor-pointer mb-3">
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
        {fieldErrors.gdpr && <p className="text-red-500 text-[10px] -mt-2 mb-3 text-left">{fieldErrors.gdpr}</p>}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-amber-500 text-black py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {language === "ro" ? "Se trimite…" : "Sending…"}
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            {language === "ro" ? "Trimite Mesaj" : "Send Message"}
          </>
        )}
      </button>

      <p className="text-[10px] text-zinc-600 text-center font-mono leading-relaxed">
        {language === "ro"
          ? "Răspundem în maxim 24h. Datele tale sunt confidențiale."
          : "We respond within 24 hours. Your details remain confidential."}
      </p>
    </form>
  );
}

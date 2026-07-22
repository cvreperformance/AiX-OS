import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { brandContent } from "@/lib/content/brand";
import { Shield, Lock, Eye, FileText, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy & GDPR Notice | AiX OS™",
  description: "Privacy Policy and GDPR Notice for the AiX OS™ platform. Read about how we process and protect your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 space-y-16">
      <PageHeader
        badge="Legal & Compliance"
        title="Privacy Policy & GDPR Notice"
        subtitle="This Privacy Policy applies to every interaction with AiX OS™. We process and protect your data in full compliance with Regulation (EU) 2016/679 (GDPR)."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Shield,
            title: "GDPR Compliance",
            desc: "All personal data is processed strictly in accordance with European Union data protection regulations."
          },
          {
            icon: Lock,
            title: "Neutral Security Protocols",
            desc: "Technical and organizational measures, including encryption and strict access controls, protect your information."
          },
          {
            icon: Eye,
            title: "Consent & Transparency",
            desc: "Clear processing purposes, explicit marketing consent options, and hassle-free withdrawal rights."
          }
        ].map((item, idx) => (
          <div key={idx} className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-3">
            <item.icon className="h-6 w-6 text-amber-500/80" />
            <h3 className="text-base font-medium text-zinc-100">{item.title}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="max-w-none text-zinc-300 space-y-10 text-sm leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-xl font-light text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
            <FileText className="h-5 w-5 text-amber-500/80" />
            1. Scope of the Privacy Policy
          </h2>
          <p>
            This Privacy Policy applies to any and all interactions with the <strong>AiX OS™</strong> ecosystem. The scope of processing encompasses, but is not limited to, the following modules, services, and communication channels:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-400">
            <li>Contact Forms, Concierge Requests, and Property Enquiries</li>
            <li>Buyer Requests, Seller Requests, and Home Find integrations</li>
            <li>Insurance, Mortgage, and Investment enquiries</li>
            <li>Market Pulse subscriptions, AiX Score interactions, and Property Scanner requests</li>
            <li>Deal Room requests and AI Match requests</li>
            <li>AI Assistant conversations and live chat services</li>
            <li>Premium Guide downloads and Newsletter subscriptions</li>
            <li>Direct email, telephone, and WhatsApp communications</li>
            <li>Saved properties, saved searches, and registered Dashboard accounts</li>
            <li>Authentication flows and all future modules integrated into the ecosystem</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-light text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Scale className="h-5 w-5 text-amber-500/80" />
            2. Personal Data We Process
          </h2>
          <p>
            Depending on the nature of your interaction, we may collect and process the following categories of personal data:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-400">
            <li><strong>Identity & Professional Details:</strong> Full name, company name, and professional role.</li>
            <li><strong>Contact Information:</strong> Email address, telephone number, and communication histories (emails, chat logs).</li>
            <li><strong>Preferences & Enquiries:</strong> Property preferences, budget ranges, investment preferences, insurance interests, mortgage interests, and geographic preferences.</li>
            <li><strong>Documents & Files:</strong> Uploaded files and any documentation you voluntarily provide to the platform.</li>
            <li><strong>Interactive Platform Data:</strong> Saved searches, saved properties, and specific interactions with evaluation tools.</li>
            <li><strong>Technical & Analytical Logs:</strong> Browser information, device type, operating system, IP address, cookie identifiers, analytics data, and platform security logs.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-light text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
            <FileText className="h-5 w-5 text-amber-500/80" />
            3. Legal Grounds and Purposes of Processing
          </h2>
          <p>
            We process personal data for specific, explicit, and legitimate purposes under the following legal bases:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-400">
            <li><strong>Contractual Performance & Pre-contractual Steps:</strong> Responding to enquiries, providing requested information, buyer representation, seller representation, facilitating insurance and mortgage assistance, presenting investment opportunities, and sending property recommendations.</li>
            <li><strong>Legitimate Interests:</strong> Running AI-powered matching, compiling market intelligence, enabling dashboard functionality, maintaining secure account authentication, saving user preferences, and personalising the overall user experience.</li>
            <li><strong>Platform Integrity & Security:</strong> Preventing fraud, monitoring system health, maintaining security logs, and improving platform reliability.</li>
            <li><strong>Legal Compliance:</strong> Meeting applicable regulatory, fiscal, or corporate governance obligations.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-light text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
            <FileText className="h-5 w-5 text-amber-500/80" />
            4. Marketing Consent Policy
          </h2>
          <p>
            Users who voluntarily submit forms or explicitly request information may be contacted regarding the services they have requested. Such communications may cover real estate, buyer/seller representation, investments, insurance, mortgage services, market reports, premium guides, educational material, platform updates, Home Find services, or related professional services.
          </p>
          <p className="text-zinc-400">
            Marketing communications will only be transmitted where permitted under applicable law (Regulation (EU) 2016/679 and local transpositions). We do not operate under implicit marketing consent:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li>Visiting the website does <strong>not</strong> grant marketing consent.</li>
            <li>Requesting or downloading a guide does <strong>not</strong> automatically establish generic marketing consent.</li>
            <li>Consent to receive marketing updates can be withdrawn at any time.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-light text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
            <FileText className="h-5 w-5 text-amber-500/80" />
            5. Downloadable Guides and Materials
          </h2>
          <p>
            When you voluntarily request a Premium Guide or other downloadable publications, your personal data will be processed to deliver the requested material, respond to any associated enquiries, and provide additional information related to the topic of interest. Where legally permitted, we may communicate about relevant opportunities within the AiX OS™ ecosystem.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-light text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
            <FileText className="h-5 w-5 text-amber-500/80" />
            6. Your GDPR Rights
          </h2>
          <p>
            Under Regulation (EU) 2016/679, you are entitled to exercise the following statutory rights:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-400">
            <li><strong>Right of Access:</strong> You may request confirmation of whether your data is being processed and obtain a copy of it.</li>
            <li><strong>Right to Rectification:</strong> You may request the correction of inaccurate or incomplete personal data.</li>
            <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> You may request the deletion of your data under specific statutory conditions.</li>
            <li><strong>Right to Restriction:</strong> You may request that we temporarily suspend the processing of your data.</li>
            <li><strong>Right to Data Portability:</strong> You have the right to receive your personal data in a structured, commonly used, and machine-readable format.</li>
            <li><strong>Right to Object:</strong> You may object to the processing of your personal data based on legitimate interests or for direct marketing.</li>
            <li><strong>Right to Withdraw Consent:</strong> Where processing is based on consent, you may withdraw it at any time without affecting prior lawfulness.</li>
            <li><strong>Right to Lodge a Complaint:</strong> You have the right to lodge a complaint with a competent supervisory authority in your jurisdiction.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-light text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
            <FileText className="h-5 w-5 text-amber-500/80" />
            7. Data Retention
          </h2>
          <p>
            Personal data is retained only for as long as necessary to fulfil the purposes outlined in this policy, satisfy contractual obligations, comply with statutory preservation duties, or until a valid deletion request is processed. Once the legal basis for retention ceases, data is permanently destroyed or anonymised.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-light text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Lock className="h-5 w-5 text-amber-500/80" />
            8. Data Security Measures
          </h2>
          <p>
            We implement comprehensive organizational and technical security measures designed to safeguard personal data against unauthorized access, disclosure, alteration, or destruction. These measures include:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-400">
            <li>Industry-standard transit and storage encryption protocols.</li>
            <li>Robust authentication mechanisms and multi-factor validation where appropriate.</li>
            <li>Secure hosting environments and redundant cloud infrastructure.</li>
            <li>Strict logical access controls enforced under the principle of least privilege.</li>
            <li>Continuous monitoring, logging, and regular backups to guarantee data resilience.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-light text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
            <FileText className="h-5 w-5 text-amber-500/80" />
            9. Cookies & Browser Storage
          </h2>
          <p>
            AiX OS™ uses necessary, functional, preference, and analytical cookies or local storage keys to optimize user experience. Essential cookies are required to authenticate sessions and validate secure submissions. Functional key-value pairs (such as dismiss markers for CTAs and banners) prevent repetitive notifications. You can configure your browser to decline cookies, though this may restrict access to certain interactive elements of the platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-light text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
            <FileText className="h-5 w-5 text-amber-500/80" />
            10. Third-Party Integrations & Transfers
          </h2>
          <p>
            To provide our services, we may integrate third-party providers for identity verification, analytics, communication channels, payment processing, or professional real estate utilities. These processors operate under strict data processing agreements. In the event that personal data is transferred outside the European Economic Area (EEA), we ensure such transfers rely on Standard Contractual Clauses (SCCs) or adequacy decisions.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-light text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
            <FileText className="h-5 w-5 text-amber-500/80" />
            11. Contact Information
          </h2>
          <p>
            For any enquiries, requests to exercise your data subject rights, or general feedback concerning our data processing activities, please reach out using the official contact details:
          </p>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-2 text-zinc-400">
            <p><strong>Name:</strong> {brandContent.name}</p>
            <p><strong>Official Email:</strong> <a href={`mailto:${brandContent.contact.email}`} className="text-amber-400 hover:underline">{brandContent.contact.email}</a></p>
            <p><strong>Official Phone:</strong> {brandContent.contact.phone}</p>
            <p><strong>Ecosystem Coverage:</strong> {brandContent.contact.address}</p>
          </div>
        </section>
      </div>

      <div className="pt-8 border-t border-zinc-800 text-center text-xs text-zinc-500">
        Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}. Powered by AiX OS™ intelligence framework.
      </div>
    </div>
  );
}

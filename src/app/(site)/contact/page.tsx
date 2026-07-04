import type { Metadata } from "next";
import ContactClientPage from "./ContactClientPage";

export const metadata: Metadata = {
  title: "Contact — AiX OS",
  description:
    "Contactează AiX OS pentru consultații private de investiții imobiliare, buyer/seller representation și market intelligence.",
  openGraph: {
    title: "Contact AiX OS",
    description: "Consultații private pentru investitori exigenți.",
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactClientPage />;
}

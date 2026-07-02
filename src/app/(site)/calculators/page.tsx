import type { Metadata } from "next";
import CalculatorsClient from "./CalculatorsClient";

export const metadata: Metadata = {
  title: "Calculatoare Imobiliare | AiX OS",
  description:
    "Calculatoare profesionale: ipotecă, ROI, yield chirie, cash flow, taxe notariale, apreciere proprietate și comparare investiții.",
};

export default function CalculatorsPage() {
  return <CalculatorsClient />;
}

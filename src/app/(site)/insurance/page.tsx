import type { Metadata } from "next";
import InsuranceClient from "./InsuranceClient";

export const metadata: Metadata = {
  title: "Asigurări AI — Hub Complet | AiX OS™",
  description:
    "Comparați și obțineți cele mai bune oferte de asigurare: locuință, viață, sănătate, auto, călătorie și business. Consultanță AI gratuită.",
};

export default function InsurancePage() {
  return <InsuranceClient />;
}

import type { Metadata } from "next";
import TravelClient from "./TravelClient";

export const metadata: Metadata = {
  title: "Premium Travel & Global Mobility | AiX OS",
  description:
    "Private charter resources, luxury flight planning, border entries, visa procedures, and global country guides.",
};

export default function TravelPage() {
  return <TravelClient />;
}

import type { Metadata } from "next";
import DespreCientPage from "./DespreCientPage";

export const metadata: Metadata = {
  title: "Despre AiX OS",
  description: "Operating System for Investors. Platformă de intelligence pentru decizii de investiții.",
};

export default function DesprePage() {
  return <DespreCientPage />;
}

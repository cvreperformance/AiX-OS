import type { Metadata } from "next";
import PrivateWealthClient from "./PrivateWealthClient";

export const metadata: Metadata = { title: "Private Wealth & Network | AiX OS" };

export default function PrivateWealthPage() { return <PrivateWealthClient />; }
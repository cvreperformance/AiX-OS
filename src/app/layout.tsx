import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { siteConfig } from "@/lib/config";
import { organizationSchema } from "@/lib/seo";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "investiții imobiliare",
    "market intelligence",
    "AiX Score",
    "proprietăți luxury",
    "București",
    "real estate Romania",
    "buyer representation",
    "seller representation",
    "investitii dubai",
    "analiza imobiliara",
    "calculator ipoteca",
    "asigurare locuinta",
    "aix os",
  ],
  authors: [{ name: "AiX OS", url: "https://aixos.ro" }],
  creator: "AiX OS",
  publisher: "AiX OS",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    type: "website",
    locale: "ro_RO",
    siteName: siteConfig.name,
    url: "https://aixos.ro",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  metadataBase: new URL("https://aixos.ro"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ro"
      className={`${dmSans.variable} ${cormorant.variable} h-full`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-full antialiased bg-[#080808] text-zinc-100" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

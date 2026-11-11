import type { Metadata } from "next";
import { Archivo, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

// Archivo (with its width axis) for display, Hanken Grotesk for reading,
// JetBrains Mono for data. All variable fonts, one file each.
const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["wdth"],
});

const body = Hanken_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const code = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

const SITE = "https://karthikreddyy.vercel.app";
const DESCRIPTION =
  "Software engineer building end-to-end systems with AI inside them. Four production initiatives shipped at Avis Budget Group. CS at Arizona State, 4.0 GPA.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Karthik Reddy Yalala | Software Engineer",
    template: "%s · Karthik Reddy Yalala",
  },
  description: DESCRIPTION,
  keywords: [
    "Software Engineer",
    "AI Engineer",
    "System architecture",
    "Amazon Bedrock",
    "LangGraph",
    "RAG",
    "Arizona State University",
  ],
  authors: [{ name: "Karthik Reddy Yalala" }],
  openGraph: {
    type: "website",
    url: SITE,
    title: "Karthik Reddy Yalala | Software Engineer",
    description: DESCRIPTION,
    siteName: "Karthik Reddy Yalala",
  },
  twitter: {
    card: "summary_large_image",
    title: "Karthik Reddy Yalala | Software Engineer",
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${code.variable}`}>
        {/* Reveal starts hidden and is shown by JS; without JS, show everything. */}
        <noscript>
          <style>{".reveal{opacity:1;transform:none}"}</style>
        </noscript>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

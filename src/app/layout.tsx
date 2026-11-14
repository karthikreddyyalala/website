import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

// One family for everything, the way Apple sets its pages: Inter, whose
// optical-size axis switches to its display cut at heading sizes.
// JetBrains Mono is for data only.
const sans = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

const code = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

const SITE = "https://karthikreddyy.vercel.app";
const DESCRIPTION =
  "Software engineer building end-to-end systems with AI inside them. Four production initiatives shipped at Avis Budget Group. CS at Arizona State, 4.0 GPA.";

// Tints the browser chrome on phones to match the page.
export const viewport: Viewport = { themeColor: "#0a0a0b", colorScheme: "dark" };

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
      <body className={`${sans.variable} ${code.variable}`}>
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

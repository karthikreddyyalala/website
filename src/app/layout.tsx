import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

// One family for everything: Archivo, a grotesk with a width axis as well as
// a weight axis, so display type can be wide and heavy while body text stays
// normal. JetBrains Mono carries numbers and annotations.
const sans = Archivo({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  axes: ["wdth"],
});

const code = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

const SITE = "https://karthikreddyy.vercel.app";
const DESCRIPTION =
  "Software engineer building end-to-end systems with AI inside them. Four production initiatives shipped at Avis Budget Group. CS at Arizona State, 4.0 GPA.";

// Tints the browser chrome on phones to match the page in either theme.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2ede1" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0e0c" },
  ],
};

/**
 * Runs before first paint, so there is no flash of the wrong theme:
 * a stored choice wins, otherwise the system preference. It also lets any
 * first input end the page-load sequence at once.
 */
const BOOT = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";d.dataset.theme=t}catch(e){d.dataset.theme="dark"}var f=function(){d.classList.add("intro-done")};["pointerdown","keydown","wheel","touchstart"].forEach(function(e){addEventListener(e,f,{once:true,passive:true})})})()`;

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
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

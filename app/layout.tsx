import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Geist_Mono } from "next/font/google";
import Script from "next/script";

import { AuthProvider } from "@/lib/auth-context";
import { getCurrentUser } from "@/lib/auth-server";
import { env } from "@/lib/env";
import { buildOrganizationGraph, schemaJson } from "@/lib/seo/schemas";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.appBaseUrl),
  title: {
    default: "Pannly — $3 to unlock an idea. Build it, get refunded.",
    template: "%s · Pannly",
  },
  description:
    "Pannly watches Reddit and Hacker News for real founder pain. We score the signals, write the brief, and let you unlock one for $3 — refunded the moment you ship.",
  // Default canonical = homepage. Per-route metadata overrides this with its
  // own `alternates.canonical: "/path"` (resolved relative to metadataBase).
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Pannly",
    locale: "en_US",
    url: "/",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Pannly — $3 to unlock an idea. Build it, get refunded.",
      },
    ],
  },
  twitter: {
    // summary_large_image > summary — bigger preview cards in shares.
    card: "summary_large_image",
    title: "Pannly — $3 to unlock an idea. Build it, get refunded.",
    description:
      "Pannly watches Reddit and Hacker News for real founder pain. We score the signals, write the brief, and let you unlock one for $3 — refunded the moment you ship.",
    images: ["/og-default.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  robots: {
    index: true,
    follow: true,
  },
  // Google Search Console site-verification meta tag. Renders site-wide as
  // <meta name="google-site-verification" content="..."> and stays valid as
  // long as it's served from any URL on the verified property.
  verification: {
    google: "b6f7c2enVZ4-58O3JBgrGgON1pqkkd_RCIXRngee2M4",
  },
};

// `themeColor` lives on the Viewport export in Next 14+ — the metadata API
// deprecated it. Tints the mobile address bar / Android chrome with moss.
export const viewport: Viewport = {
  themeColor: "#2a4c3f",
};

/**
 * Root layout: server-side fetches /v1/auth/me ONCE per hard navigation and
 * hydrates the AuthProvider. Client-side navigations don't re-run this, so
 * /me is called at most once per session bootstrap. Login / logout updates
 * happen in-context — no second round-trip.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialUser = await getCurrentUser();
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${geistMono.variable}`}
    >
      <body>
        {/* Site-wide JSON-LD: Organization + WebSite. Renders once on every
            page; per-route schemas (CreativeWork on idea pages, Product on
            pricing) are injected by their own page components. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaJson(buildOrganizationGraph()) }}
        />
        <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
        {env.plausibleDomain ? (
          <Script
            defer
            data-domain={env.plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Fraunces, Inter, Geist_Mono } from "next/font/google";
import Script from "next/script";

import { AuthProvider } from "@/lib/auth-context";
import { getCurrentUser } from "@/lib/auth-server";
import { env } from "@/lib/env";
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
  openGraph: {
    type: "website",
    siteName: "Pannly",
    locale: "en_US",
    url: env.appBaseUrl,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@pannly",
  },
  robots: {
    index: true,
    follow: true,
  },
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

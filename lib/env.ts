/**
 * Public-facing env vars exposed to the browser.
 * Server-only env reads happen inline; this file is browser-safe.
 */

const isProd = process.env.NODE_ENV === "production";

/**
 * Resolve a public env var, with TWO different rules depending on environment:
 *   - dev:  use `value` if set, else `fallback` (so localhost just works)
 *   - prod: use `value` if set AND not pointing at localhost, else THROW
 *
 * The localhost guard is intentional. Without it, forgetting to set
 * NEXT_PUBLIC_APP_BASE_URL on Coolify silently ships a build whose canonical
 * URLs, OG image URLs, sitemap entries, and JSON-LD ids all point at
 * `http://localhost:3000` — Google indexes nothing, social previews break.
 */
const required = (name: string, value: string | undefined, fallback?: string): string => {
  if (isProd) {
    if (!value || !value.length) {
      throw new Error(`Missing required env var: ${name}`);
    }
    if (value.includes("localhost") || value.includes("127.0.0.1")) {
      throw new Error(
        `${name} points at ${value} in production — set the real domain on Coolify.`,
      );
    }
    return value;
  }
  if (value && value.length) return value;
  if (fallback !== undefined) return fallback;
  return "";
};

export const env = {
  appBaseUrl: required(
    "NEXT_PUBLIC_APP_BASE_URL",
    process.env.NEXT_PUBLIC_APP_BASE_URL,
    "http://localhost:3000",
  ),
  apiBaseUrl: required(
    "NEXT_PUBLIC_API_BASE_URL",
    process.env.NEXT_PUBLIC_API_BASE_URL,
    "http://localhost:8000",
  ),
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "",
  prices: {
    proMonthlyUsd: Number(process.env.NEXT_PUBLIC_PRO_PRICE_USD_MONTHLY ?? 15),
    unlockDefaultUsd: Number(process.env.NEXT_PUBLIC_UNLOCK_PRICE_USD_DEFAULT ?? 3),
    unlockPremiumUsd: Number(process.env.NEXT_PUBLIC_UNLOCK_PRICE_USD_PREMIUM ?? 5),
    buildWindowDays: Number(process.env.NEXT_PUBLIC_BUILD_WINDOW_DAYS ?? 30),
  },
};

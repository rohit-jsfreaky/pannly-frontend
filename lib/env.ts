/**
 * Public-facing env vars exposed to the browser.
 * Server-only env reads happen inline; this file is browser-safe.
 */

const required = (name: string, value: string | undefined, fallback?: string): string => {
  if (value && value.length) return value;
  if (fallback !== undefined) return fallback;
  // We only error in production; dev gets a soft default to keep things moving.
  if (process.env.NODE_ENV === "production") {
    throw new Error(`Missing required env var: ${name}`);
  }
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
    buildWindowDays: Number(process.env.NEXT_PUBLIC_BUILD_WINDOW_DAYS ?? 60),
  },
};

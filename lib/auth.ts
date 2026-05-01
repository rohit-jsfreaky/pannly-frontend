/**
 * Auth barrel — re-exports the typed API and utility helpers so existing
 * imports of `@/lib/auth` keep working. New code can import directly from
 * `@/lib/api/auth`.
 */

import { env } from "@/lib/env";

export * from "@/lib/api/auth";

/** Build a fully-qualified app URL — used for next-redirect handling and email-clickbacks. */
export function appUrl(path: string): string {
  return `${env.appBaseUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

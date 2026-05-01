/**
 * Typed wrappers for /v1/checkout/* + /v1/ideas/{slug}/unlock + /v1/checkout/portal.
 * Mirrors backend/docs/api/payments.md.
 */

import { apiPost } from "@/lib/api-client";

export interface CheckoutResponse {
  checkout_url: string | null;
  session_id: string;
  unlock_id: string | null;
}

export interface PortalResponse {
  portal_url: string;
}

interface CheckoutOverrides {
  return_url?: string;
  cancel_url?: string;
}

export const startIdeaUnlock = (slug: string, overrides?: CheckoutOverrides) =>
  apiPost<CheckoutResponse>(`/v1/ideas/${encodeURIComponent(slug)}/unlock`, overrides ?? {});

export const startProMonthly = (overrides?: CheckoutOverrides) =>
  apiPost<CheckoutResponse>("/v1/checkout/pro-monthly", overrides ?? {});

export const startProYearly = (overrides?: CheckoutOverrides) =>
  apiPost<CheckoutResponse>("/v1/checkout/pro-yearly", overrides ?? {});

export const startLifetime = (overrides?: CheckoutOverrides) =>
  apiPost<CheckoutResponse>("/v1/checkout/lifetime", overrides ?? {});

export const openCustomerPortal = (overrides?: CheckoutOverrides) =>
  apiPost<PortalResponse>("/v1/checkout/portal", overrides ?? {});

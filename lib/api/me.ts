/**
 * Typed wrappers for /v1/me/*. Covers billing + unlock-state polling.
 * Mirrors docs/api/me.md and docs/api/payments.md.
 */

import { apiGet } from "@/lib/api-client";

// =================================================================== //
//  /v1/me/billing                                                      //
// =================================================================== //

export interface BillingPlan {
  plan_slug: "pro_monthly" | "pro_yearly" | "lifetime" | string;
  label: string;
  period: "monthly" | "yearly" | "lifetime" | string;
  amount_cents: number | null;
  currency: string;
  status: "active" | "canceled" | "expired" | string;
  current_period_end: string | null;
  renews_on: string | null;
  canceled_at: string | null;
}

export interface InvoiceItem {
  id: string;
  date: string;
  description: string;
  amount_cents: number;
  currency: string;
  status: "succeeded" | "failed" | "refunded" | "pending" | string;
  kind: string;
}

export interface BillingResponse {
  current_plan: BillingPlan | null;
  invoices: InvoiceItem[];
  portal_available: boolean;
}

export const getBilling = (signal?: AbortSignal) =>
  apiGet<BillingResponse>("/v1/me/billing", { signal });

// =================================================================== //
//  /v1/me/unlocks/{id}  — used by post-checkout polling                //
// =================================================================== //

export interface UnlockStateResponse {
  id: string;
  idea_slug: string;
  state:
    | "pending"
    | "unlocked"
    | "building"
    | "submitted"
    | "approved"
    | "refunded"
    | "rejected"
    | "failed";
  amount_paid_cents: number;
  unlocked_at: string | null;
  error_message: string | null;
}

export const getMyUnlock = (id: string, signal?: AbortSignal) =>
  apiGet<UnlockStateResponse>(`/v1/me/unlocks/${encodeURIComponent(id)}`, { signal });

// =================================================================== //
//  /v1/me/unlocked-slugs — feed-card overlay                           //
// =================================================================== //

export interface UnlockedSlugsResponse {
  /** True when the user has an active Pro/Lifetime subscription — every
   *  live idea is unlocked regardless of `slugs`. */
  has_pro_access: boolean;
  /** Slugs the user has paid for individually. May be empty for Pro-only users. */
  slugs: string[];
}

export const getMyUnlockedSlugs = (signal?: AbortSignal) =>
  apiGet<UnlockedSlugsResponse>("/v1/me/unlocked-slugs", { signal });

// =================================================================== //
//  /v1/me/last-checkout — subscription return polling                  //
// =================================================================== //

export interface LastCheckoutResponse {
  payment_id: string;
  kind: "unlock" | "pro_monthly" | "pro_yearly" | "lifetime" | string;
  status: "pending" | "succeeded" | "failed";
  amount_cents: number;
  currency: string;
  error_message: string | null;
  created_at: string;
}

export const getLastCheckout = (signal?: AbortSignal) =>
  apiGet<LastCheckoutResponse>("/v1/me/last-checkout", { signal });

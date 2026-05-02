/**
 * Typed wrappers for /v1/me/*. Covers dashboard, billing, unlock state polling.
 * Mirrors docs/api/me.md and docs/api/payments.md.
 */

import { apiGet } from "@/lib/api-client";

// =================================================================== //
//  /v1/me/dashboard — 4-tile stats strip + tab counts                 //
// =================================================================== //

export interface DashboardStats {
  total_unlocked: number;
  total_building: number;
  total_submitted: number;
  total_shipped: number;
  total_refunded_cents: number;
  /** True when the user has an active Pro / Lifetime subscription. */
  has_pro_access: boolean;
  /**
   * How many ideas the user can READ. For Pro / Lifetime: count of live ideas.
   * For free tier: same as total_unlocked. Use this as the headline "unlocked"
   * number when has_pro_access is true.
   */
  total_accessible: number;
}

export interface DashboardTabCounts {
  all: number;
  building: number;
  submitted: number;
  refunded: number;
}

export interface DashboardResponse {
  stats: DashboardStats;
  tab_counts: DashboardTabCounts;
}

export const getDashboard = (signal?: AbortSignal) =>
  apiGet<DashboardResponse>("/v1/me/dashboard", { signal });

// =================================================================== //
//  /v1/me/unlocks — paginated card list, filtered by tab               //
// =================================================================== //

export type UnlockTab = "all" | "building" | "submitted" | "refunded";
export type UnlockState =
  | "pending"
  | "unlocked"
  | "building"
  | "submitted"
  | "approved"
  | "refunded"
  | "rejected";

export interface MyUnlockItem {
  unlock_id: string;
  state: UnlockState;
  unlocked_at: string;
  submitted_at: string | null;
  refunded_at: string | null;
  reviewed_at: string | null;
  days_elapsed: number;
  days_remaining: number;
  build_window_days: number;
  amount_paid_cents: number;
  refund_amount_cents: number | null;
  idea_slug: string;
  idea_title: string;
  idea_one_line_pain: string | null;
  idea_tags: string[];
  build_url: string | null;
  build_screenshot_url: string | null;
  build_name: string | null;
  build_category: string | null;
  review_notes: string | null;
}

export interface MyUnlocksPagination {
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
  has_prev: boolean;
  has_next: boolean;
}

export interface MyUnlocksResponse {
  items: MyUnlockItem[];
  pagination: MyUnlocksPagination;
  applied_tab: UnlockTab;
}

export interface MyUnlocksQuery {
  tab?: UnlockTab;
  page?: number;
  per_page?: number;
}

export const getMyUnlocks = (query: MyUnlocksQuery = {}, signal?: AbortSignal) => {
  const params: Record<string, string | number | undefined> = {};
  if (query.tab) params.tab = query.tab;
  if (query.page !== undefined) params.page = query.page;
  if (query.per_page !== undefined) params.per_page = query.per_page;
  return apiGet<MyUnlocksResponse>("/v1/me/unlocks", { query: params, signal });
};

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

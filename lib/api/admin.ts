/**
 * Typed wrappers for /v1/admin/*.
 *
 * Every endpoint here requires the caller to have `is_admin = true` on the
 * server-side User record. The frontend layout guard at /admin redirects
 * non-admins away — these calls would 403 otherwise.
 */

import { api, apiGet, apiPost } from "@/lib/api-client";

// =================================================================== //
//  GET /v1/admin/stats — overview tiles                                //
// =================================================================== //

export interface StatsCounts {
  users_total: number;
  users_added_today: number;
  pro_active: number;
  pending_review: number;
  total_unlocks: number;
  total_shipped: number;
}

export interface StatsRevenue {
  paid_unlocks_cents: number;
  paid_pro_cents: number;
  refunded_cents: number;
  net_cents: number;
}

export interface StatsActivityPoint {
  /** YYYY-MM-DD UTC */
  date: string;
  unlocks: number;
}

export interface AdminStatsResponse {
  counts: StatsCounts;
  revenue: StatsRevenue;
  /** ISO currency code that `revenue.*_cents` is denominated in. */
  currency: string;
  activity_7d: StatsActivityPoint[];
}

export const getAdminStats = (init?: { headers?: Record<string, string> }) =>
  apiGet<AdminStatsResponse>("/v1/admin/stats", init);

// =================================================================== //
//  GET /v1/admin/users — paginated user list                           //
// =================================================================== //

export interface AdminUserRow {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  last_login_at: string | null;
  is_admin: boolean;
  is_pro: boolean;
  pro_expires_at: string | null;
  total_unlocks: number;
  total_builds: number;
  total_paid_cents: number;
  total_refunded_cents: number;
  /** ISO currency code that `total_paid_cents` / `total_refunded_cents` are denominated in. */
  currency: string;
  /** "Free" | "Pro Monthly" | "Pro Yearly" | "Lifetime" | "Pro" */
  plan_label: string;
}

export interface AdminUsersPagination {
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
  has_prev: boolean;
  has_next: boolean;
}

export interface AdminUsersResponse {
  items: AdminUserRow[];
  pagination: AdminUsersPagination;
}

export interface AdminUsersQuery {
  page?: number;
  per_page?: number;
  search?: string;
}

export const getAdminUsers = (
  query: AdminUsersQuery = {},
  init?: { headers?: Record<string, string> },
) => {
  const params: Record<string, string | number | undefined> = {};
  if (query.page !== undefined) params.page = query.page;
  if (query.per_page !== undefined) params.per_page = query.per_page;
  if (query.search) params.search = query.search;
  return apiGet<AdminUsersResponse>("/v1/admin/users", {
    query: params,
    ...(init ?? {}),
  });
};

// =================================================================== //
//  GET /v1/admin/builds/queue — pending review queue                   //
// =================================================================== //

export interface AdminQueueBuild {
  unlock_id: string;
  user_email: string;
  idea_slug: string;
  idea_title: string;
  build_url: string | null;
  build_screenshot_url: string | null;
  build_writeup: string | null;
  build_name: string | null;
  build_category: string | null;
  submitted_at: string | null;
  days_pending: number;
}

export interface AdminQueuePagination {
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
  has_prev: boolean;
  has_next: boolean;
}

export interface AdminQueueResponse {
  items: AdminQueueBuild[];
  pagination: AdminQueuePagination;
}

export const getAdminBuildsQueue = (
  page: number = 1,
  per_page: number = 20,
  init?: { headers?: Record<string, string> },
) =>
  apiGet<AdminQueueResponse>("/v1/admin/builds/queue", {
    query: { page, per_page },
    ...(init ?? {}),
  });

export const getAdminBuild = (
  unlockId: string,
  init?: { headers?: Record<string, string> },
) =>
  apiGet<AdminQueueBuild>(
    `/v1/admin/builds/${encodeURIComponent(unlockId)}`,
    init ?? {},
  );

// =================================================================== //
//  Approve / reject — actions                                          //
// =================================================================== //

export interface AdminReviewResponse {
  unlock_id: string;
  state: string;
  refund_id: string | null;
  notes: string | null;
}

export const approveBuild = (
  unlockId: string,
  body: { notes?: string | null; issue_refund: boolean },
) =>
  apiPost<AdminReviewResponse>(
    `/v1/admin/builds/${encodeURIComponent(unlockId)}/approve`,
    body,
  );

export const rejectBuild = (unlockId: string, reason: string) =>
  apiPost<AdminReviewResponse>(
    `/v1/admin/builds/${encodeURIComponent(unlockId)}/reject`,
    { reason },
  );

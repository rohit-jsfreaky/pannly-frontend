/**
 * Typed wrappers for /v1/refunds (summary) + /v1/refunds/ledger (paginated).
 * Mirrors backend/pannly/schemas/refunds.py exactly.
 */

import { apiGet } from "@/lib/api-client";

export interface RefundsSummary {
  total_refunded_cents: number;
  total_refunds_count: number;
  avg_refund_cents: number;
}

export interface LedgerBuilder {
  initials: string;
  display_name: string | null;
}

export interface LedgerEntry {
  unlock_id: string;
  builder: LedgerBuilder;
  project_seed: string;
  idea_slug: string;
  idea_title: string;
  shipped_at: string;
  amount_cents: number;
}

export interface LedgerPagination {
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
  has_prev: boolean;
  has_next: boolean;
}

export interface LedgerResponse {
  items: LedgerEntry[];
  pagination: LedgerPagination;
}

export interface LedgerQuery {
  page?: number;
  per_page?: number;
}

export const fetchRefundsSummary = (signal?: AbortSignal) =>
  apiGet<RefundsSummary>("/v1/refunds", {
    signal,
    withCredentials: false,
  });

export const fetchRefundsLedger = (query: LedgerQuery = {}, signal?: AbortSignal) => {
  const params: Record<string, string | number | undefined> = {};
  if (query.page !== undefined) params.page = query.page;
  if (query.per_page !== undefined) params.per_page = query.per_page;
  return apiGet<LedgerResponse>("/v1/refunds/ledger", {
    query: params,
    signal,
    withCredentials: false,
  });
};

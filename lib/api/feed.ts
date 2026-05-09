/**
 * Typed wrappers for /v1/feed/*. Mirrors backend/docs/api/feed.md exactly.
 * Cache-Control + X-Cache headers on the backend mean repeat-fetches inside
 * the TTL window are essentially free; we still avoid hammering them via
 * hooks (see lib/hooks/use-feed.ts).
 */

import { apiGet } from "@/lib/api-client";

// =================================================================== //
//  Domain types — mirror schemas/feed.py                              //
// =================================================================== //

export type FeedSort = "score" | "recent" | "trending" | "building";
export type ScoreKind = "hot" | "trending" | "fresh" | "normal";

export interface FeedIdea {
  slug: string;
  title: string;
  one_line_pain: string | null;
  overall_score: number | null;
  score_kind: ScoreKind;
  tags: string[];
  unlock_count: number;
  building_count: number;
  shipped_count: number;
  unlock_price_cents: number;
  first_published_at: string | null;
  /** When the brief was last regenerated (re-clustered or re-scored).
   *  Drives the sitemap `<lastmod>` for /ideas/{slug}. */
  last_refreshed_at?: string | null;
}

export interface Pagination {
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
  has_prev: boolean;
  has_next: boolean;
}

export interface AppliedFilters {
  topic: string | null;
  tags: string[];
  min_score: number | null;
  q: string | null;
  sort: FeedSort;
}

export interface FeedResponse {
  items: FeedIdea[];
  pagination: Pagination;
  applied_filters: AppliedFilters;
  last_updated_at: string | null;
}

export interface PopularTag {
  name: string;
  count: number;
}

export interface PopularTagsResponse {
  tags: PopularTag[];
}

export interface FeedTopic {
  slug: string;
  label: string;
  count: number;
}

export interface FeedTopicsResponse {
  topics: FeedTopic[];
}

// =================================================================== //
//  Query params                                                        //
// =================================================================== //

export interface FeedQuery {
  page?: number;
  per_page?: number;
  topic?: string | null;
  tags?: string[]; // sent as a comma-joined string
  min_score?: number | null;
  q?: string | null;
  sort?: FeedSort;
}

function buildQuery(q: FeedQuery): Record<string, string | number | undefined> {
  const out: Record<string, string | number | undefined> = {};
  if (q.page !== undefined) out.page = q.page;
  if (q.per_page !== undefined) out.per_page = q.per_page;
  if (q.topic) out.topic = q.topic;
  if (q.tags && q.tags.length) out.tags = q.tags.join(",");
  if (q.min_score !== null && q.min_score !== undefined) out.min_score = q.min_score;
  if (q.q) out.q = q.q;
  if (q.sort) out.sort = q.sort;
  return out;
}

// =================================================================== //
//  Public API                                                          //
// =================================================================== //

// Public, anonymous endpoints. Cache server-side so the SSR'd /feed page
// (and the per-idea metadata fetches) don't re-hit the backend on every
// visit. Browser ignores `next.revalidate`, so this is safe when the same
// helpers are invoked from client hooks too.
export const fetchFeed = (query: FeedQuery, signal?: AbortSignal) =>
  apiGet<FeedResponse>("/v1/feed", {
    query: buildQuery(query),
    signal,
    next: { revalidate: 60 },
  });

// Popular tags + topics are very stable — long TTL so they're effectively
// edge-cached after the first request.
export const fetchPopularTags = (limit?: number, signal?: AbortSignal) =>
  apiGet<PopularTagsResponse>("/v1/feed/popular-tags", {
    query: limit ? { limit } : undefined,
    signal,
    next: { revalidate: 300 },
  });

export const fetchTopics = (signal?: AbortSignal) =>
  apiGet<FeedTopicsResponse>("/v1/feed/topics", {
    signal,
    next: { revalidate: 300 },
  });

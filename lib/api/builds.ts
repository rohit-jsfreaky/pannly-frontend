/**
 * Typed wrappers for /v1/builds + /v1/builds/categories. Mirrors
 * backend/pannly/schemas/builds.py exactly.
 *
 * Cache headers on the backend mean repeat-fetches inside the 5-min TTL
 * window are essentially free; we still avoid hammering them via the
 * module-level dedup in lib/hooks/use-build-gallery.ts.
 */

import { apiGet, apiPost } from "@/lib/api-client";

// =================================================================== //
//  Domain types — mirror schemas/builds.py                            //
// =================================================================== //

export type BuildSort = "recent" | "oldest" | "fastest";
export type BuildState = "approved" | "refunded";

export interface GalleryBuilder {
  initials: string;
  display_name: string | null;
}

export interface GalleryBuild {
  id: string;
  build_name: string;
  build_url: string;
  screenshot_url: string | null;
  category: string | null;
  state: BuildState;
  builder: GalleryBuilder;
  idea_slug: string;
  idea_title: string;
  idea_pain: string | null;
  submitted_at: string | null;
  refunded_at: string | null;
  days_to_ship: number | null;
}

export interface GalleryPagination {
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
  has_prev: boolean;
  has_next: boolean;
}

export interface GalleryAppliedFilters {
  category: string | null;
  sort: BuildSort;
}

export interface GalleryHero {
  total_shipped: number;
  total_categories: number;
}

export interface GalleryResponse {
  items: GalleryBuild[];
  pagination: GalleryPagination;
  applied_filters: GalleryAppliedFilters;
  hero: GalleryHero;
}

export interface CategoryEntry {
  slug: string;
  label: string;
  count: number;
}

export interface CategoriesResponse {
  categories: CategoryEntry[];
}

// =================================================================== //
//  Query params                                                        //
// =================================================================== //

export interface GalleryQuery {
  page?: number;
  per_page?: number;
  category?: string | null;
  sort?: BuildSort;
}

function buildQuery(q: GalleryQuery): Record<string, string | number | undefined> {
  const out: Record<string, string | number | undefined> = {};
  if (q.page !== undefined) out.page = q.page;
  if (q.per_page !== undefined) out.per_page = q.per_page;
  if (q.category) out.category = q.category;
  if (q.sort) out.sort = q.sort;
  return out;
}

// =================================================================== //
//  Public API                                                          //
// =================================================================== //

export const fetchGallery = (query: GalleryQuery, signal?: AbortSignal) =>
  apiGet<GalleryResponse>("/v1/builds", { query: buildQuery(query), signal });

export const fetchBuildCategories = (signal?: AbortSignal) =>
  apiGet<CategoriesResponse>("/v1/builds/categories", { signal });

// =================================================================== //
//  Submission flow — /v1/unlocks/{id}/draft + /submit                  //
// =================================================================== //

export type BuildCategory = "SaaS" | "Tools" | "Content" | "Other";

export const BUILD_CATEGORIES: BuildCategory[] = ["SaaS", "Tools", "Content", "Other"];

export type UnlockDraftState =
  | "pending"
  | "unlocked"
  | "building"
  | "submitted"
  | "approved"
  | "refunded"
  | "rejected";

export interface DraftView {
  unlock_id: string;
  state: UnlockDraftState;
  idea_slug: string;
  idea_title: string;
  idea_pain: string | null;
  build_url: string | null;
  build_screenshot_url: string | null;
  build_writeup: string | null;
  build_name: string | null;
  build_category: BuildCategory | null;
  submitted_at: string | null;
  review_notes: string | null;
}

export interface DraftMutation {
  build_url?: string | null;
  build_screenshot_url?: string | null;
  build_writeup?: string | null;
  build_name?: string | null;
  build_category?: BuildCategory | null;
}

export interface SubmitBuildBody {
  build_url: string;
  build_screenshot_url: string;
  build_writeup?: string | null;
  build_name?: string | null;
  build_category?: BuildCategory | null;
}

export interface SubmitBuildResponse {
  unlock_id: string;
  state: UnlockDraftState;
  submitted_at: string;
  review_window_hours: number;
}

export const fetchDraft = (unlockId: string, init?: { cookieHeader?: string }) =>
  apiGet<DraftView>(`/v1/unlocks/${encodeURIComponent(unlockId)}/draft`, {
    headers: init?.cookieHeader ? { cookie: init.cookieHeader } : undefined,
    next: { revalidate: 0 },
  });

export const saveDraft = (unlockId: string, body: DraftMutation) =>
  apiPost<{ unlock_id: string; state: UnlockDraftState }>(
    `/v1/unlocks/${encodeURIComponent(unlockId)}/draft`,
    body,
  );

export const submitBuild = (unlockId: string, body: SubmitBuildBody) =>
  apiPost<SubmitBuildResponse>(
    `/v1/unlocks/${encodeURIComponent(unlockId)}/submit`,
    body,
  );

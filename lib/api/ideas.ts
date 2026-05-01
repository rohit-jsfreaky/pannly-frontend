/**
 * Typed wrappers + types for /v1/ideas/{slug}. Mirrors docs/api/idea-detail.md.
 */

import { apiGet } from "@/lib/api-client";
import type { FeedIdea, ScoreKind } from "@/lib/api/feed";

export type AccessKind = "locked" | "unlocked";

export interface IdeaHeader {
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
}

export interface LockedSummary {
  total_word_count: number;
  hidden_word_count: number;
  hidden_section_count: number;
  visible_section_count: number;
}

export interface UnlockedState {
  unlock_id: string;
  state: string;
  unlocked_at: string;
  days_elapsed: number;
  days_remaining: number;
  build_window_days: number;
  is_first_mover: boolean;
  first_mover_rank: number | null;
}

export interface BuilderPreview {
  initials: string;
  state: string;
}

export interface BuildersPanel {
  total_count: number;
  preview: BuilderPreview[];
}

export interface LockedIdeaResponse {
  access: "locked";
  idea: IdeaHeader;
  free_preview_md: string | null;
  locked_summary: LockedSummary;
  related: FeedIdea[];
}

export interface UnlockedIdeaResponse {
  access: "unlocked";
  idea: IdeaHeader;
  brief_md: string | null;
  /** Null when the user has access via an active Pro/Lifetime subscription
   *  (no per-idea purchase). Populated when they bought this specific brief. */
  unlock_state: UnlockedState | null;
  builders: BuildersPanel;
  related: FeedIdea[];
}

export type IdeaDetailResponse = LockedIdeaResponse | UnlockedIdeaResponse;

export const getIdeaDetail = (slug: string, signal?: AbortSignal) =>
  apiGet<IdeaDetailResponse>(`/v1/ideas/${encodeURIComponent(slug)}`, { signal });

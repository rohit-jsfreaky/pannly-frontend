/**
 * Typed wrappers + types for /v1/ideas/{slug}. Mirrors docs/api/idea-detail.md.
 *
 * The brief now ships as STRUCTURED fields (`brief.pain_md`,
 * `brief.evidence_quotes`, ...) so the frontend can render the design
 * exactly: pain section → evidence cards → 3-step validation plan → landing
 * copy block, plus the sidebar (who-buys-this bullets, builders, first-mover).
 *
 * `brief_md` is still emitted by the server for the PDF download — the UI
 * never renders it.
 */

import { apiGet, apiPost } from "@/lib/api-client";
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

// ===== Structured brief =====

export interface EvidenceQuote {
  quote: string;
  author_label: string;
  source_url: string | null;
}

export interface ValidationStep {
  headline: string;
  description: string;
}

export interface LandingCopy {
  headline: string;
  subhead: string;
}

export interface IdeaBrief {
  pain_md: string | null;
  evidence_quotes: EvidenceQuote[];
  buyer_personas: string[];
  validation_steps: ValidationStep[];
  landing_copy: LandingCopy | null;
}

// ===== Locked / unlocked branches =====

export interface LockedSummary {
  total_word_count: number;
  hidden_word_count: number;
  hidden_section_count: number;
  visible_section_count: number;
}

export interface LockedBriefPreview {
  pain_md: string | null;
  evidence_preview: EvidenceQuote | null;
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
  preview: LockedBriefPreview;
  locked_summary: LockedSummary;
  related: FeedIdea[];
  /** Legacy — server still emits but the locked-view should render `preview`. */
  free_preview_md: string | null;
}

export interface UnlockedIdeaResponse {
  access: "unlocked";
  idea: IdeaHeader;
  brief: IdeaBrief;
  /** Null when the user has access via an active Pro/Lifetime subscription. */
  unlock_state: UnlockedState | null;
  builders: BuildersPanel;
  related: FeedIdea[];
  /** Legacy — used by the PDF link, NOT rendered in the UI. */
  brief_md: string | null;
}

export type IdeaDetailResponse = LockedIdeaResponse | UnlockedIdeaResponse;

export const getIdeaDetail = (slug: string, signal?: AbortSignal) =>
  apiGet<IdeaDetailResponse>(`/v1/ideas/${encodeURIComponent(slug)}`, { signal });

// =================================================================== //
//  Action endpoints                                                    //
// =================================================================== //

export interface MarkBuildingResponse {
  unlock_id: string;
  state: string;
  days_remaining: number;
}

/** Flips an unlock from `unlocked` → `building`. Idempotent. */
export const markUnlockBuilding = (unlockId: string) =>
  apiPost<MarkBuildingResponse>(
    `/v1/unlocks/${encodeURIComponent(unlockId)}/mark-building`,
  );

export interface ClaimWithProResponse {
  unlock_id: string;
  state: string;
  /** True iff this call created a new Unlock row (false on idempotent re-claim). */
  created: boolean;
}

/**
 * Pro-only: claim an idea without payment. Idempotent.
 * Creates an Unlock row in `unlocked` state so the idea-detail page renders
 * the standard chips + action row.
 */
export const claimIdeaWithPro = (slug: string) =>
  apiPost<ClaimWithProResponse>(`/v1/ideas/${encodeURIComponent(slug)}/claim`);

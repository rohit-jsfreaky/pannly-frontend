/**
 * Fail-soft idea fetchers for the SEO blog listicles.
 *
 * Marketing/SEO surfaces must never 500 on a backend hiccup (same posture as
 * sitemap.ts and the feed page) — every fetcher returns [] on error so the
 * prose, schema, and CTA still render.
 */

import { fetchFeed, type FeedIdea } from "@/lib/api/feed";

/** Top score-sorted ideas, optionally filtered to one topic. */
export async function safeBlogIdeas(opts: {
  topic?: string;
  perPage: number;
}): Promise<FeedIdea[]> {
  try {
    const res = await fetchFeed({
      page: 1,
      per_page: opts.perPage,
      sort: "score",
      topic: opts.topic ?? null,
    });
    return res.items;
  } catch {
    return [];
  }
}

/** Total count of live ideas — for the citable "N validated ideas" sentence. */
export async function safeIdeaCount(): Promise<number | null> {
  try {
    const res = await fetchFeed({ page: 1, per_page: 1 });
    return res.pagination?.total_count ?? null;
  } catch {
    return null;
  }
}

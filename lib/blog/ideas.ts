/**
 * Fail-soft idea fetchers for the SEO blog listicles.
 *
 * Marketing/SEO surfaces must never 500 on a backend hiccup (same posture as
 * sitemap.ts and the feed page) — every fetcher returns [] on error so the
 * prose, schema, and CTA still render.
 */

import { fetchFeed, type FeedIdea } from "@/lib/api/feed";

/**
 * Top score-sorted ideas, optionally filtered by topic and/or free-text query.
 *
 * When a `q` is supplied (niche vertical pages) and the search returns nothing,
 * we fall back to the top-scored ideas so the page still shows real cards rather
 * than an empty section. The prose carries the niche framing either way.
 */
export async function safeBlogIdeas(opts: {
  topic?: string;
  q?: string;
  perPage: number;
}): Promise<FeedIdea[]> {
  try {
    const res = await fetchFeed({
      page: 1,
      per_page: opts.perPage,
      sort: "score",
      topic: opts.topic ?? null,
      q: opts.q ?? null,
    });
    if (res.items.length > 0 || (!opts.q && !opts.topic)) return res.items;

    // Niche search came back empty (or topic had no ideas) — fall back to the
    // top-scored general feed so the page never renders an empty list.
    const fallback = await fetchFeed({ page: 1, per_page: opts.perPage, sort: "score" });
    return fallback.items;
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

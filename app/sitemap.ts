/**
 * /sitemap.xml — generated dynamically.
 *
 * Static marketing routes are listed by hand. Idea briefs are pulled live from
 * the FastAPI backend via the existing public list endpoint (`/v1/feed`),
 * paginated up to 5 pages × 48 items = 240 URLs.
 *
 * Failure mode: if the backend is unreachable, we still return the static
 * routes — the sitemap stays valid, idea/build URLs just won't be enumerated
 * until the next regeneration. Don't throw; SEO infra should never 500.
 *
 * Cached in the framework via `revalidate = 3600`.
 *
 * Design notes:
 *   - `changefreq` and `priority` are NOT emitted — Google ignores both per
 *     their public docs. Slimmer payload, fewer misleading signals.
 *   - Pages that don't actually change daily get a pinned `lastmod`. Routes
 *     that are genuinely dynamic (`/`, `/feed`, `/built`, `/refunds`) keep
 *     a build-time timestamp.
 *   - Idea pages prefer `last_refreshed_at` (clustering re-score) over
 *     `first_published_at` so Googlebot recrawls when content changes.
 */

import type { MetadataRoute } from "next";

import { fetchFeed, type FeedIdea } from "@/lib/api/feed";
import { env } from "@/lib/env";

export const revalidate = 3600;

const PER_PAGE = 48; // Backend caps at 50 — keep <= 50.
const MAX_PAGES = 5;

interface StaticRoute {
  path: string;
  /** ISO date string when the page itself last meaningfully changed. Omit for
   *  routes whose content updates whenever the underlying data updates (those
   *  fall back to the build-time timestamp). */
  lastmod?: string;
}

// `lastmod` pinned to the date copy was last edited. Bump these when you ship
// a real content change to the page (not just a layout tweak).
const STATIC_PINNED = "2026-05-01";

const STATIC_ROUTES: StaticRoute[] = [
  { path: "/" },                        // homepage — content shifts with live numbers
  { path: "/feed" },                    // feed — fresh ideas, dynamic
  { path: "/built" },                   // gallery — dynamic
  { path: "/refunds" },                 // ledger — dynamic
  { path: "/pricing",      lastmod: STATIC_PINNED },
  { path: "/how-it-works", lastmod: STATIC_PINNED },
  { path: "/about",        lastmod: STATIC_PINNED },
  { path: "/contact",      lastmod: STATIC_PINNED },
  { path: "/privacy",      lastmod: STATIC_PINNED },
  { path: "/terms",        lastmod: STATIC_PINNED },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.appBaseUrl.replace(/\/+$/, "");
  const now = new Date();

  // NOTE: per-build pages (/built/[slug]) are deliberately NOT enumerated yet —
  // that route is a Phase 4.4 placeholder. Adding it back when the page is
  // implemented is one map() call away.
  const ideaUrls = await safeFetchAllIdeas();

  return [
    ...STATIC_ROUTES.map((r) => ({
      url: `${base}${r.path}`,
      lastModified: r.lastmod ? new Date(r.lastmod) : now,
    })),
    ...ideaUrls.map((idea) => ({
      url: `${base}/ideas/${encodeURIComponent(idea.slug)}`,
      lastModified: idea.last_refreshed_at
        ? new Date(idea.last_refreshed_at)
        : idea.first_published_at
          ? new Date(idea.first_published_at)
          : now,
    })),
  ];
}

// =================================================================== //
//  Backend fetchers — fail soft, never throw                          //
// =================================================================== //

async function safeFetchAllIdeas(): Promise<FeedIdea[]> {
  try {
    return await fetchAllPaginated((page) =>
      fetchFeed({ page, per_page: PER_PAGE }).then((r) => ({
        items: r.items,
        has_next: r.pagination.has_next,
      })),
    );
  } catch {
    // Backend down — the static routes still render a valid sitemap.
    return [];
  }
}

async function fetchAllPaginated<T>(
  fetchPage: (page: number) => Promise<{ items: T[]; has_next: boolean }>,
): Promise<T[]> {
  const out: T[] = [];
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const res = await fetchPage(page);
    out.push(...res.items);
    if (!res.has_next) break;
  }
  return out;
}

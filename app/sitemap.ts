/**
 * /sitemap.xml — generated dynamically.
 *
 * Static marketing routes are listed by hand. Idea briefs and shipped builds
 * are pulled live from the FastAPI backend via the existing public list
 * endpoints (`/v1/feed`, `/v1/builds`). We paginate each up to 5 pages × 48
 * items = 240 URLs per surface, which is plenty for the foreseeable future.
 *
 * Failure mode: if the backend is unreachable, we still return the static
 * routes — the sitemap stays valid, idea/build URLs just won't be enumerated
 * until the next regeneration. Don't throw; SEO infra should never 500.
 *
 * Cached in the framework via `revalidate = 3600` — a fresh fetch happens at
 * most once per hour even with high crawl volume.
 */

import type { MetadataRoute } from "next";

import { fetchFeed, type FeedIdea } from "@/lib/api/feed";
import { env } from "@/lib/env";

// Re-validate the sitemap once an hour. Crawlers don't need second-by-second
// freshness, and pulling N pages from the backend on every robot hit is wasteful.
export const revalidate = 3600;

// 48 is the per_page max enforced by /v1/feed.
const PER_PAGE = 48;
const MAX_PAGES = 5;

interface StaticRoute {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}

const STATIC_ROUTES: StaticRoute[] = [
  { path: "/", changeFrequency: "daily", priority: 1.0 },
  { path: "/feed", changeFrequency: "daily", priority: 0.9 },
  { path: "/built", changeFrequency: "daily", priority: 0.8 },
  { path: "/refunds", changeFrequency: "weekly", priority: 0.7 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.7 },
  { path: "/how-it-works", changeFrequency: "monthly", priority: 0.6 },
  { path: "/about", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.4 },
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
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...ideaUrls.map((idea) => ({
      url: `${base}/ideas/${encodeURIComponent(idea.slug)}`,
      lastModified: idea.first_published_at
        ? new Date(idea.first_published_at)
        : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
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

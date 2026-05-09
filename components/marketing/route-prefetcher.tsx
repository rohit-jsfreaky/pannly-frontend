"use client";

import { useRoutePrefetcher } from "@/lib/hooks/use-route-prefetcher";

/**
 * Tiny client component that prefetches the most-likely-next routes from
 * the marketing surface. Renders nothing.
 *
 * Mounted once on the homepage. By the time a Product Hunt visitor decides
 * to click "Browse the feed", "Pricing", or "How it works", the route is
 * already warmed in the browser cache.
 */
export function HomePagePrefetcher() {
  useRoutePrefetcher([
    "/feed",
    "/pricing",
    "/how-it-works",
    "/refunds",
    "/built",
    "/about",
  ]);
  return null;
}

/**
 * Idea-detail prefetcher — warms /feed (back) and any related-idea slugs
 * the page references. Used inside the /ideas/[slug] route.
 */
export function IdeaPagePrefetcher({ relatedSlugs }: { relatedSlugs: string[] }) {
  useRoutePrefetcher([
    "/feed",
    "/pricing",
    ...relatedSlugs.slice(0, 4).map((s) => `/ideas/${encodeURIComponent(s)}`),
  ]);
  return null;
}

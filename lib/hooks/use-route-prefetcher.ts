"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Programmatic, on-mount prefetcher.
 *
 * Why this exists: Next.js Link prefetches only when a Link enters the
 * viewport. Below-fold links and route destinations the user will navigate
 * to via JS (router.push) don't get warmed automatically. This hook calls
 * router.prefetch() for each provided route immediately on mount, so by
 * the time the user clicks anything in `routes`, the route is already in
 * the browser's prefetch cache.
 *
 * Usage:
 *   useRoutePrefetcher(["/feed", "/pricing", "/refunds"]);
 *
 * Notes:
 *   - Prefetching is a no-op in dev. Only runs in production builds.
 *   - Routes that fail to prefetch (404, network error) silently swallow.
 *   - Adding the same route twice is fine — Next.js dedupes internally.
 *   - Don't include too many routes — each prefetch is one HTTP roundtrip
 *     for the RSC payload. 3-6 destinations per page is the sweet spot.
 */
export function useRoutePrefetcher(routes: ReadonlyArray<string>) {
  const router = useRouter();
  useEffect(() => {
    // Defer to the next idle tick so prefetches don't compete with
    // hydration / first paint of the current page. requestIdleCallback
    // isn't available in Safari, so fall back to setTimeout(0).
    const schedule = (cb: () => void) => {
      const w = window as unknown as {
        requestIdleCallback?: (cb: () => void) => number;
      };
      if (typeof w.requestIdleCallback === "function") {
        w.requestIdleCallback(cb);
      } else {
        setTimeout(cb, 0);
      }
    };
    schedule(() => {
      for (const r of routes) {
        try {
          router.prefetch(r as Route);
        } catch {
          // Prefetch failures are not actionable — the user can still
          // navigate, it just won't be instant. Swallow.
        }
      }
    });
    // Routes is a tuple of strings. Joining is the cheapest stable
    // dependency for an effect that should re-run when the list changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, routes.join("|")]);
}

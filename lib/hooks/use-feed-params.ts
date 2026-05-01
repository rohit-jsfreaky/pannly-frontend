"use client";

import { useCallback, useMemo } from "react";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { FeedQuery, FeedSort } from "@/lib/api/feed";

const VALID_SORTS: ReadonlyArray<FeedSort> = ["score", "recent", "trending", "building"];

/**
 * URL is the source of truth for feed state. Reading: parse query string into
 * a typed FeedQuery. Writing: setParams() merges patches into the URL via
 * router.replace (no history pollution for filter clicks).
 *
 * History semantics:
 *   - Filter / sort / search changes → replace (one entry per session).
 *   - Page changes                   → push   (back-button returns to prev page).
 */
export function useFeedParams() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const params: FeedQuery = useMemo(() => {
    const tagsRaw = sp.get("tags") ?? "";
    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const sortRaw = sp.get("sort") as FeedSort | null;
    const sort: FeedSort = VALID_SORTS.includes(sortRaw as FeedSort)
      ? (sortRaw as FeedSort)
      : "score";
    const minScoreRaw = sp.get("min_score");
    const pageRaw = sp.get("page");
    const perPageRaw = sp.get("per_page");
    return {
      page: pageRaw ? Math.max(1, Number(pageRaw)) : 1,
      per_page: perPageRaw ? Number(perPageRaw) : 12,
      topic: sp.get("topic"),
      tags,
      q: sp.get("q") ?? null,
      min_score: minScoreRaw ? Number(minScoreRaw) : null,
      sort,
    };
  }, [sp]);

  /** Push a partial patch onto the URL. Pass `null` to drop a key. */
  const setParams = useCallback(
    (
      patch: Partial<{
        page: number | null;
        per_page: number | null;
        topic: string | null;
        tags: string[] | null;
        min_score: number | null;
        q: string | null;
        sort: FeedSort;
      }>,
      mode: "push" | "replace" = "replace",
    ) => {
      const next = new URLSearchParams(sp.toString());
      const apply = (key: string, value: string | null) => {
        if (value === null || value === "") next.delete(key);
        else next.set(key, value);
      };
      if ("page" in patch) apply("page", patch.page ? String(patch.page) : null);
      if ("per_page" in patch)
        apply("per_page", patch.per_page ? String(patch.per_page) : null);
      if ("topic" in patch) apply("topic", patch.topic ?? null);
      if ("tags" in patch) apply("tags", patch.tags && patch.tags.length ? patch.tags.join(",") : null);
      if ("min_score" in patch)
        apply("min_score", patch.min_score == null ? null : String(patch.min_score));
      if ("q" in patch) apply("q", patch.q ?? null);
      if ("sort" in patch) apply("sort", patch.sort ?? null);

      const qs = next.toString();
      const url = (qs ? `${pathname}?${qs}` : pathname) as Route;
      if (mode === "push") router.push(url);
      else router.replace(url);
    },
    [pathname, router, sp],
  );

  return { params, setParams };
}

"use client";

import { useCallback, useMemo } from "react";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { BuildSort, GalleryQuery } from "@/lib/api/builds";

const VALID_SORTS: ReadonlyArray<BuildSort> = ["recent", "oldest", "fastest"];

/**
 * URL is the source of truth for gallery state. Reading: parse query string
 * into a typed GalleryQuery. Writing: setParams() merges patches into the URL.
 *
 * History semantics (matches /feed):
 *   - Filter / sort changes → replace (one history entry per session).
 *   - Page changes          → push   (back-button returns to prev page).
 */
export function useGalleryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const params: GalleryQuery = useMemo(() => {
    const sortRaw = sp.get("sort") as BuildSort | null;
    const sort: BuildSort = VALID_SORTS.includes(sortRaw as BuildSort)
      ? (sortRaw as BuildSort)
      : "recent";
    const pageRaw = sp.get("page");
    const perPageRaw = sp.get("per_page");
    return {
      page: pageRaw ? Math.max(1, Number(pageRaw)) : 1,
      per_page: perPageRaw ? Number(perPageRaw) : 12,
      category: sp.get("category"),
      sort,
    };
  }, [sp]);

  const setParams = useCallback(
    (
      patch: Partial<{
        page: number | null;
        per_page: number | null;
        category: string | null;
        sort: BuildSort;
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
      if ("category" in patch) apply("category", patch.category ?? null);
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

"use client";

import { useEffect, useState } from "react";

import { ApiError } from "@/lib/api-client";
import {
  fetchBuildCategories,
  fetchGallery,
  type CategoriesResponse,
  type GalleryQuery,
  type GalleryResponse,
} from "@/lib/api/builds";

// =================================================================== //
//  Module-level dedup                                                  //
//
//  Same pattern as use-feed.ts:
//  - Categories are static-per-session → cache + inflight promise.
//  - Gallery list is keyed by query JSON; concurrent renders share the
//    same in-flight fetch and the entry is dropped after resolve so we
//    never serve stale data on a real refetch.
// =================================================================== //

let cachedCategories: CategoriesResponse | null = null;
let inflightCategories: Promise<CategoriesResponse> | null = null;

function ensureCategories(): Promise<CategoriesResponse> {
  if (cachedCategories) return Promise.resolve(cachedCategories);
  if (inflightCategories) return inflightCategories;
  inflightCategories = fetchBuildCategories()
    .then((r) => {
      cachedCategories = r;
      inflightCategories = null;
      return r;
    })
    .catch((err) => {
      inflightCategories = null;
      throw err;
    });
  return inflightCategories;
}

const inflightGallery = new Map<string, Promise<GalleryResponse>>();

function ensureGallery(query: GalleryQuery): Promise<GalleryResponse> {
  const key = JSON.stringify(query);
  const existing = inflightGallery.get(key);
  if (existing) return existing;
  const promise = fetchGallery(query).finally(() => {
    inflightGallery.delete(key);
  });
  inflightGallery.set(key, promise);
  return promise;
}

// =================================================================== //
//  Hooks                                                               //
// =================================================================== //

/**
 * Single-fetch hook for the gallery list.
 *
 * - Same query in two concurrent renders → ONE network call (shared promise).
 * - Filter / sort change → the previous render's setState is ignored via a
 *   `cancelled` flag, the underlying fetch is allowed to finish so any
 *   sibling consumer that wants the same data still gets it.
 * - Last successful response stays rendered while the next one loads — the
 *   skeleton only shows on first request.
 */
export function useGallery(query: GalleryQuery): {
  data: GalleryResponse | null;
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<GalleryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const key = JSON.stringify(query);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    ensureGallery(query)
      .then((res) => {
        if (cancelled) return;
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError) setError(err.message);
        else if (err instanceof Error) setError(err.message);
        else setError("Couldn't load the gallery.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { data, loading, error };
}

/**
 * Curated category chips with live counts. Module-level cache means the
 * network call fires ONCE per page load; subsequent mounts (StrictMode
 * double-mount, navigation back, sibling consumers) read from cache.
 */
export function useBuildCategories(): {
  data: CategoriesResponse | null;
  loading: boolean;
} {
  const [data, setData] = useState<CategoriesResponse | null>(cachedCategories);
  const [loading, setLoading] = useState(!cachedCategories);

  useEffect(() => {
    if (cachedCategories) {
      setData(cachedCategories);
      setLoading(false);
      return;
    }
    let alive = true;
    ensureCategories()
      .then((r) => {
        if (alive) {
          setData(r);
          setLoading(false);
        }
      })
      .catch(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { data, loading };
}

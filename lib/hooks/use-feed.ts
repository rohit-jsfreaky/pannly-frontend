"use client";

import { useEffect, useState } from "react";

import { ApiError } from "@/lib/api-client";
import {
  fetchFeed,
  fetchPopularTags,
  fetchTopics,
  type FeedQuery,
  type FeedResponse,
  type PopularTagsResponse,
  type FeedTopicsResponse,
} from "@/lib/api/feed";

// =================================================================== //
//  Module-level dedup                                                  //
// =================================================================== //

// React 18 StrictMode dev-mode runs effects twice. Without dedup, the second
// run's request gets aborted by the first run's cleanup — visible as
// "(canceled)" rows in the Network panel. Dedup at the module level means
// concurrent consumers share a single fetch, and per-component abort is
// replaced with a `cancelled` flag.
//
// In production React doesn't double-mount, so the dedup is mostly belt-and-
// braces — but it still helps when the same idea card is rendered twice
// (e.g. a related-rail item that's also on the page).

// Sidebar is constant per session — full cache.
let cachedPopular: PopularTagsResponse | null = null;
let cachedTopics: FeedTopicsResponse | null = null;
let inflightSidebar:
  | Promise<readonly [PopularTagsResponse, FeedTopicsResponse]>
  | null = null;

/**
 * Server-rendered pages can call this once on mount to seed the module-level
 * cache so the client never has to refetch sidebar data the SSR already knew.
 * Safe to call multiple times — the first call wins, subsequent calls are no-ops.
 */
export function seedSidebarCache(
  popular: PopularTagsResponse | null,
  topics: FeedTopicsResponse | null,
): void {
  if (popular && !cachedPopular) cachedPopular = popular;
  if (topics && !cachedTopics) cachedTopics = topics;
}

function ensureSidebar(): Promise<
  readonly [PopularTagsResponse, FeedTopicsResponse]
> {
  if (cachedPopular && cachedTopics) {
    return Promise.resolve([cachedPopular, cachedTopics] as const);
  }
  if (inflightSidebar) return inflightSidebar;
  inflightSidebar = Promise.all([fetchPopularTags(10), fetchTopics()])
    .then(([p, t]) => {
      cachedPopular = p;
      cachedTopics = t;
      inflightSidebar = null;
      return [p, t] as const;
    })
    .catch((err) => {
      inflightSidebar = null;
      throw err;
    });
  return inflightSidebar;
}

// Feed list — concurrent-only dedup keyed by query JSON. Once a fetch
// resolves, the entry is removed; we never serve stale data.
const inflightFeed = new Map<string, Promise<FeedResponse>>();

function ensureFeed(query: FeedQuery): Promise<FeedResponse> {
  const key = JSON.stringify(query);
  const existing = inflightFeed.get(key);
  if (existing) return existing;
  const promise = fetchFeed(query).finally(() => {
    inflightFeed.delete(key);
  });
  inflightFeed.set(key, promise);
  return promise;
}

// =================================================================== //
//  Hooks                                                               //
// =================================================================== //

/**
 * Single-fetch hook for the feed list.
 *
 * - Same query in two concurrent renders → ONE network call (shared promise).
 * - Filter change → previous render's state updates are ignored via a
 *   `cancelled` flag; the underlying fetch is allowed to complete so any
 *   sibling consumer that wants the same data still gets it.
 * - Last successful response stays rendered while the next one loads, so
 *   the skeleton only shows on the very first request.
 */
/**
 * Optional `initialData` lets the parent Server Component pre-fetch the
 * default-params feed and pass it in. The hook seeds the first render with
 * that data and skips the initial network call IF the query matches what was
 * pre-fetched. Any subsequent filter/page change still triggers a fresh
 * fetch as before.
 *
 * `initialKey` is the JSON-encoded query that produced `initialData`. If
 * the hook's current `query` differs (the user landed with URL search params),
 * we ignore the seed and fetch normally — first paint will show a skeleton.
 */
export function useFeed(
  query: FeedQuery,
  initialData?: FeedResponse | null,
  initialKey?: string,
): {
  data: FeedResponse | null;
  loading: boolean;
  error: string | null;
} {
  const key = JSON.stringify(query);
  const seedMatches = initialData != null && initialKey === key;
  const [data, setData] = useState<FeedResponse | null>(seedMatches ? initialData : null);
  const [loading, setLoading] = useState(!seedMatches);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // First render with matching seed: skip the initial network call. We
    // still mark hydrated so future query changes refetch normally.
    if (!hydrated && seedMatches) {
      setHydrated(true);
      return;
    }
    setLoading(true);
    setError(null);
    ensureFeed(query)
      .then((res) => {
        if (cancelled) return;
        setData(res);
        setLoading(false);
        setHydrated(true);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError) setError(err.message);
        else if (err instanceof Error) setError(err.message);
        else setError("Couldn't load the feed.");
        setLoading(false);
        setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
    // The shape of `query` is captured by ensureFeed; useEffect re-runs only
    // when its serialised key changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { data, loading, error };
}

/**
 * Sidebar tags + top-row topics. Module-level cache means the network calls
 * fire ONCE per page load — every subsequent mount (StrictMode double-mount,
 * navigation back, sibling components) reads from cache instantly.
 */
export function useFeedSidebar(): {
  popular: PopularTagsResponse | null;
  topics: FeedTopicsResponse | null;
  loading: boolean;
} {
  const [state, setState] = useState(() => ({
    popular: cachedPopular,
    topics: cachedTopics,
    loading: !(cachedPopular && cachedTopics),
  }));

  useEffect(() => {
    if (cachedPopular && cachedTopics) {
      // Synchronously hit cache on subsequent mounts (StrictMode, nav-back).
      setState({ popular: cachedPopular, topics: cachedTopics, loading: false });
      return;
    }
    let alive = true;
    ensureSidebar()
      .then(([p, t]) => {
        if (alive) setState({ popular: p, topics: t, loading: false });
      })
      .catch(() => {
        if (alive) setState((s) => ({ ...s, loading: false }));
      });
    return () => {
      alive = false;
    };
  }, []);

  return state;
}

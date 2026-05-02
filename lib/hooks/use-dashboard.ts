"use client";

import { useEffect, useState } from "react";

import { ApiError } from "@/lib/api-client";
import {
  getDashboard,
  getMyUnlocks,
  type DashboardResponse,
  type MyUnlocksQuery,
  type MyUnlocksResponse,
} from "@/lib/api/me";

/**
 * Hooks for the "Your ideas" dashboard.
 *
 *   useDashboard()          — fetches /v1/me/dashboard ONCE per session.
 *                             Counts only change when the user takes a state
 *                             action (mark-building, submit, refund webhook),
 *                             so we cache aggressively and expose an
 *                             invalidator for those code paths to call.
 *
 *   useMyUnlocks(query)     — per-(tab, page) dedup. Concurrent renders of the
 *                             same key share one fetch promise. Last good
 *                             response stays rendered while the next loads,
 *                             so the skeleton only shows on cold mount.
 *
 * Pattern mirrors lib/hooks/use-feed.ts and lib/hooks/use-build-gallery.ts.
 */

// =================================================================== //
//  Dashboard — module-level full cache                                //
// =================================================================== //

let cachedDashboard: DashboardResponse | null = null;
let inflightDashboard: Promise<DashboardResponse> | null = null;

function ensureDashboard(): Promise<DashboardResponse> {
  if (cachedDashboard) return Promise.resolve(cachedDashboard);
  if (inflightDashboard) return inflightDashboard;
  inflightDashboard = getDashboard()
    .then((res) => {
      cachedDashboard = res;
      inflightDashboard = null;
      return res;
    })
    .catch((err) => {
      inflightDashboard = null;
      throw err;
    });
  return inflightDashboard;
}

/** Wipe the cache after a state-changing action (mark-building, submit, etc.). */
export function invalidateDashboard() {
  cachedDashboard = null;
  inflightDashboard = null;
}

export function useDashboard(): {
  data: DashboardResponse | null;
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<DashboardResponse | null>(() => cachedDashboard);
  const [loading, setLoading] = useState<boolean>(() => !cachedDashboard);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedDashboard) {
      setData(cachedDashboard);
      setLoading(false);
      return;
    }
    let alive = true;
    ensureDashboard()
      .then((res) => {
        if (!alive) return;
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err instanceof ApiError ? err.message : "Couldn't load your dashboard.");
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { data, loading, error };
}

// =================================================================== //
//  Unlocks list — concurrent dedup keyed by (tab, page, per_page)     //
// =================================================================== //

const inflightUnlocks = new Map<string, Promise<MyUnlocksResponse>>();

function unlocksKey(query: MyUnlocksQuery): string {
  return JSON.stringify({
    tab: query.tab ?? "all",
    page: query.page ?? 1,
    per_page: query.per_page ?? 12,
  });
}

function ensureUnlocks(query: MyUnlocksQuery): Promise<MyUnlocksResponse> {
  const key = unlocksKey(query);
  const existing = inflightUnlocks.get(key);
  if (existing) return existing;
  const promise = getMyUnlocks(query).finally(() => inflightUnlocks.delete(key));
  inflightUnlocks.set(key, promise);
  return promise;
}

export function useMyUnlocks(query: MyUnlocksQuery): {
  data: MyUnlocksResponse | null;
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<MyUnlocksResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const key = unlocksKey(query);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    ensureUnlocks(query)
      .then((res) => {
        if (cancelled) return;
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Couldn't load your ideas.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // The shape of `query` is captured by ensureUnlocks; useEffect only re-runs
    // when its serialised key changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { data, loading, error };
}

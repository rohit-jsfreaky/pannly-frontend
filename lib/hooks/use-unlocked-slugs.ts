"use client";

import { useEffect, useState } from "react";

import { ApiError } from "@/lib/api-client";
import { getMyUnlockedSlugs } from "@/lib/api/me";
import { useAuth } from "@/lib/auth-context";

/**
 * Returns the user's access state for feed cards:
 *   - `slugs`: ideas the user has paid for individually
 *   - `hasProAccess`: true when an active Pro/Lifetime subscription grants
 *     read access to every live idea regardless of `slugs`
 *   - `loading`: true while the first fetch is in flight
 *
 * - Fires `/v1/me/unlocked-slugs` ONCE per session for logged-in users
 *   (module-level promise dedup, same pattern as the feed sidebar).
 * - Returns empty/false immediately for anonymous users — no network call.
 * - 401 silently downgrades to anon-shape; AuthProvider handles the auth
 *   change separately.
 */

interface AccessSnapshot {
  slugs: Set<string>;
  hasProAccess: boolean;
}

const ANON: AccessSnapshot = { slugs: new Set(), hasProAccess: false };

let cached: AccessSnapshot | null = null;
let inflight: Promise<AccessSnapshot> | null = null;

function ensureSnapshot(): Promise<AccessSnapshot> {
  if (cached) return Promise.resolve(cached);
  if (inflight) return inflight;
  inflight = getMyUnlockedSlugs()
    .then((res) => {
      cached = {
        slugs: new Set(res.slugs),
        hasProAccess: res.has_pro_access,
      };
      inflight = null;
      return cached;
    })
    .catch((err) => {
      inflight = null;
      if (err instanceof ApiError && err.status === 401) {
        cached = ANON;
        return ANON;
      }
      throw err;
    });
  return inflight;
}

/** Manually invalidate — call after a successful unlock or subscription so
 *  cards flip immediately on the next render. */
export function invalidateUnlockedSlugs() {
  cached = null;
  inflight = null;
}

export function useMyUnlockedSlugs(): {
  slugs: Set<string>;
  hasProAccess: boolean;
  loading: boolean;
} {
  const { user } = useAuth();
  const [snap, setSnap] = useState<AccessSnapshot>(() => cached ?? ANON);
  const [loading, setLoading] = useState<boolean>(() => Boolean(user) && !cached);

  useEffect(() => {
    if (!user) {
      setSnap(ANON);
      setLoading(false);
      return;
    }
    if (cached) {
      setSnap(cached);
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    ensureSnapshot()
      .then((s) => {
        if (alive) {
          setSnap(s);
          setLoading(false);
        }
      })
      .catch(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [user]);

  return { slugs: snap.slugs, hasProAccess: snap.hasProAccess, loading };
}

"use client";

import { useEffect, useState } from "react";

import { ApiError } from "@/lib/api-client";
import {
  fetchRefundsLedger,
  fetchRefundsSummary,
  type LedgerEntry,
  type LedgerPagination,
  type RefundsSummary,
} from "@/lib/api/refunds";

/**
 * Hooks for the public /refunds page.
 *
 *   useRefundsSummary()  — fires /v1/refunds ONCE per session (module cache).
 *                          The number changes only when refund.succeeded fires,
 *                          which already invalidates the server-side cache, so
 *                          a 5-minute stale window on the client is fine.
 *
 *   useRefundsLedger()   — paginated. "Load earlier entries" appends instead
 *                          of replacing, so already-rendered rows stay put.
 *                          Per-page dedup means rapid clicks share one fetch.
 */

// =================================================================== //
//  Summary — module-level full cache                                  //
// =================================================================== //

let cachedSummary: RefundsSummary | null = null;
let inflightSummary: Promise<RefundsSummary> | null = null;

function ensureSummary(): Promise<RefundsSummary> {
  if (cachedSummary) return Promise.resolve(cachedSummary);
  if (inflightSummary) return inflightSummary;
  inflightSummary = fetchRefundsSummary()
    .then((res) => {
      cachedSummary = res;
      inflightSummary = null;
      return res;
    })
    .catch((err) => {
      inflightSummary = null;
      throw err;
    });
  return inflightSummary;
}

export function useRefundsSummary(): {
  data: RefundsSummary | null;
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<RefundsSummary | null>(() => cachedSummary);
  const [loading, setLoading] = useState<boolean>(() => !cachedSummary);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedSummary) {
      setData(cachedSummary);
      setLoading(false);
      return;
    }
    let alive = true;
    ensureSummary()
      .then((res) => {
        if (!alive) return;
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err instanceof ApiError ? err.message : "Couldn't load refunds.");
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { data, loading, error };
}

// =================================================================== //
//  Ledger — append-on-load-more                                        //
// =================================================================== //

const inflightLedger = new Map<number, Promise<{ items: LedgerEntry[]; pagination: LedgerPagination }>>();
const PER_PAGE = 20;

function ensureLedger(page: number) {
  const existing = inflightLedger.get(page);
  if (existing) return existing;
  const promise = fetchRefundsLedger({ page, per_page: PER_PAGE }).finally(() =>
    inflightLedger.delete(page),
  );
  inflightLedger.set(page, promise);
  return promise;
}

interface LedgerState {
  items: LedgerEntry[];
  loaded_pages: number;          // highest page we've appended so far
  pagination: LedgerPagination | null;
  loading: boolean;
  error: string | null;
}

const INITIAL_STATE: LedgerState = {
  items: [],
  loaded_pages: 0,
  pagination: null,
  loading: true,
  error: null,
};

export function useRefundsLedger(): LedgerState & { loadMore: () => void } {
  const [state, setState] = useState<LedgerState>(INITIAL_STATE);

  // Fetch page 1 on mount.
  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    ensureLedger(1)
      .then((res) => {
        if (!alive) return;
        setState({
          items: res.items,
          loaded_pages: 1,
          pagination: res.pagination,
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        if (!alive) return;
        setState((s) => ({
          ...s,
          loading: false,
          error: err instanceof ApiError ? err.message : "Couldn't load the ledger.",
        }));
      });
    return () => {
      alive = false;
    };
  }, []);

  const loadMore = () => {
    setState((s) => {
      if (s.loading || !s.pagination?.has_next) return s;
      const nextPage = s.loaded_pages + 1;
      ensureLedger(nextPage)
        .then((res) => {
          setState((cur) => ({
            ...cur,
            items: [...cur.items, ...res.items],
            loaded_pages: nextPage,
            pagination: res.pagination,
            loading: false,
            error: null,
          }));
        })
        .catch((err) => {
          setState((cur) => ({
            ...cur,
            loading: false,
            error: err instanceof ApiError ? err.message : "Couldn't load more.",
          }));
        });
      return { ...s, loading: true, error: null };
    });
  };

  return { ...state, loadMore };
}

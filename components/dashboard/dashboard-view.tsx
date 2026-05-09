"use client";

import { Compass } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";

import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { StatsStrip } from "@/components/dashboard/stats-strip";
import { UnlockCard } from "@/components/dashboard/unlock-card";
import { FeedPagination } from "@/components/feed/feed-pagination";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { useDashboard, useMyUnlocks } from "@/lib/hooks/use-dashboard";
import type { UnlockTab } from "@/lib/api/me";

const ALLOWED_TABS: readonly UnlockTab[] = ["all", "building", "submitted", "refunded"] as const;

/**
 * Top-level view for /unlocks ("Your ideas").
 *
 * API shape per page mount:
 *   - useDashboard()     fires /v1/me/dashboard ONCE per session (module cache).
 *   - useMyUnlocks(q)    fires /v1/me/unlocks per (tab, page) tuple, deduped.
 *
 * Tab + page live in the URL — clicking a tab or paginating uses replace/push
 * so the back button works and the URL is shareable.
 */
export function DashboardView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // useTransition flag — fades the unlock list during a tab/page change
  // so the navigation feels instant even when /v1/me/unlocks is slow.
  const [isPending, startTransition] = useTransition();

  const tab: UnlockTab = useMemo(() => {
    const raw = searchParams.get("tab");
    return (ALLOWED_TABS as readonly string[]).includes(raw ?? "")
      ? (raw as UnlockTab)
      : "all";
  }, [searchParams]);

  const page = useMemo(() => {
    const raw = parseInt(searchParams.get("page") ?? "1", 10);
    return Number.isFinite(raw) && raw >= 1 ? raw : 1;
  }, [searchParams]);

  const setQuery = useCallback(
    (next: { tab?: UnlockTab; page?: number | null }, mode: "replace" | "push" = "replace") => {
      const params = new URLSearchParams(searchParams.toString());
      if (next.tab !== undefined) {
        if (next.tab === "all") params.delete("tab");
        else params.set("tab", next.tab);
      }
      if (next.page !== undefined) {
        if (next.page === null || next.page === 1) params.delete("page");
        else params.set("page", String(next.page));
      }
      const qs = params.toString();
      const url = qs ? `/unlocks?${qs}` : "/unlocks";
      // Wrap in startTransition so the existing list stays visible while
      // the new tab/page loads — pagination/tab clicks feel instant.
      startTransition(() => {
        if (mode === "push") router.push(url as Route);
        else router.replace(url as Route);
      });
    },
    [router, searchParams],
  );

  const dashboard = useDashboard();
  const unlocks = useMyUnlocks({ tab, page });

  return (
    <div className="mx-auto flex w-full flex-col gap-12 px-6 pt-12 pb-24 md:px-12">
      <header className="space-y-3">
        <h1 className="font-display text-4xl tracking-tight text-ink-700 md:text-5xl">
          Your ideas.
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-ink-50">
          Everything you've unlocked, in one place.
        </p>
        <div className="pt-4">
          <StatsStrip stats={dashboard.data?.stats ?? null} loading={dashboard.loading} />
        </div>
      </header>

      <section
        className={
          "transition-opacity duration-150 " +
          (isPending ? "pointer-events-none opacity-60" : "opacity-100")
        }
        aria-busy={isPending}
      >
        <DashboardTabs
          active={tab}
          counts={dashboard.data?.tab_counts ?? null}
          onChange={(t) => setQuery({ tab: t, page: null })}
        />

        {unlocks.error ? (
          <ErrorState message={unlocks.error} />
        ) : unlocks.loading && !unlocks.data ? (
          <CardSkeleton />
        ) : unlocks.data && unlocks.data.items.length > 0 ? (
          <div className="flex flex-col gap-6">
            {unlocks.data.items.map((u) => (
              <UnlockCard key={u.unlock_id} unlock={u} />
            ))}
          </div>
        ) : (
          <EmptyState tab={tab} />
        )}

        {unlocks.data?.pagination ? (
          <FeedPagination
            page={unlocks.data.pagination.page}
            totalPages={unlocks.data.pagination.total_pages}
            hasPrev={unlocks.data.pagination.has_prev}
            hasNext={unlocks.data.pagination.has_next}
            onChange={(p) => setQuery({ page: p }, "push")}
          />
        ) : null}
      </section>
    </div>
  );
}

// =================================================================== //
//  Loading + empty + error states                                      //
// =================================================================== //

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex flex-col gap-4 rounded-2xl border border-cream-300 bg-cream-50 p-6 md:p-8"
        >
          <div className="flex items-center justify-between">
            <SkeletonBlock className="h-5 w-32" />
            <SkeletonBlock className="h-5 w-24 rounded-full" />
          </div>
          <SkeletonBlock className="h-7 w-3/4" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-px w-full" />
          <div className="flex items-center justify-between">
            <SkeletonBlock className="h-10 w-40" />
            <SkeletonBlock className="h-10 w-32 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ tab }: { tab: UnlockTab }) {
  const copy: Record<UnlockTab, { title: string; body: string }> = {
    all: {
      title: "Nothing here yet.",
      body: "Browse the feed and unlock an idea to start your build window.",
    },
    building: {
      title: "No builds in progress.",
      body: "Mark an unlocked idea as building to start the 30-day window.",
    },
    submitted: {
      title: "Nothing submitted for review.",
      body: "When you submit a build, it'll show up here while admin reviews.",
    },
    refunded: {
      title: "No refunds yet.",
      body: "Ship a build within 30 days and your $3 comes back automatically.",
    },
  };
  const c = copy[tab];
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-cream-300 bg-cream-50 px-8 py-16 text-center">
      <span
        aria-hidden
        className="flex h-12 w-12 items-center justify-center rounded-full border border-cream-300 bg-cream-100 text-ink-50"
      >
        <Compass className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <div className="space-y-1">
        <h3 className="font-display text-xl text-ink-700">{c.title}</h3>
        <p className="max-w-md text-sm leading-relaxed text-ink-50">{c.body}</p>
      </div>
      <Link
        href={"/feed" as Route}
        className="mt-2 inline-flex items-center justify-center rounded-xl bg-moss-600 px-5 py-2.5 text-sm font-medium text-cream-50 transition-opacity hover:opacity-90"
      >
        Browse the feed
      </Link>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-error/30 bg-plum-100/30 px-6 py-8 text-center"
    >
      <h3 className="mb-2 font-display text-xl text-plum-700">
        Couldn't load your ideas.
      </h3>
      <p className="text-sm text-ink-50">{message}</p>
    </div>
  );
}

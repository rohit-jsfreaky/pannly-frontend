"use client";

import { useEffect } from "react";

import { FeedFilterBar } from "@/components/feed/feed-filter-bar";
import { FeedHero } from "@/components/feed/feed-hero";
import { FeedList } from "@/components/feed/feed-list";
import { FeedPagination } from "@/components/feed/feed-pagination";
import { FeedPopularTags } from "@/components/feed/feed-popular-tags";
import type {
  FeedResponse,
  FeedSort,
  FeedTopic,
  PopularTagsResponse,
  FeedTopicsResponse,
} from "@/lib/api/feed";
import { seedSidebarCache, useFeed, useFeedSidebar } from "@/lib/hooks/use-feed";
import { useFeedParams } from "@/lib/hooks/use-feed-params";
import { useRoutePrefetcher } from "@/lib/hooks/use-route-prefetcher";
import { useMyUnlockedSlugs } from "@/lib/hooks/use-unlocked-slugs";

const FALLBACK_TOPICS: FeedTopic[] = [
  { slug: "all", label: "All Topics", count: 0 },
];

interface Props {
  /** Server-prefetched feed for the default-params query. When the URL has no
   *  filters/sort/page, we seed the first render with this data so crawlers
   *  see real cards in the SSR HTML and JS users get an instant first paint. */
  initialData?: FeedResponse | null;
  /** JSON-encoded query that produced `initialData`. Used to detect when the
   *  current URL params match what was pre-fetched. */
  initialKey?: string;
  /** Pre-fetched sidebar payloads. Seeded into the module-level cache so the
   *  client never re-fetches them unless the page is hard-reloaded later. */
  initialPopular?: PopularTagsResponse | null;
  initialTopics?: FeedTopicsResponse | null;
}

/**
 * Top-level client component for /feed.
 *
 * Hydration model:
 *   - Server Component fetches the default-params feed + sidebar once and
 *     passes them as props.
 *   - On first render we seed the module cache (`seedSidebarCache`) and feed
 *     state. No client network call fires unless the URL has filters/sort/
 *     page parameters that don't match the seeded query.
 *   - Filter / sort / pagination changes after the first render fetch as
 *     before via the existing `useFeed` hook.
 *
 * URL is the source of truth. Filter / sort / search updates use replace;
 * pagination uses push so the back button works as expected.
 */
export function FeedView({ initialData, initialKey, initialPopular, initialTopics }: Props) {
  // Seed sidebar module cache before the first useFeedSidebar() call. This
  // runs at module init in dev (StrictMode double-mount), at first commit in
  // prod — both safe because seedSidebarCache is idempotent.
  if (initialPopular || initialTopics) {
    seedSidebarCache(initialPopular ?? null, initialTopics ?? null);
  }

  const { params, setParams, isPending } = useFeedParams();
  const { data, loading, error } = useFeed(params, initialData ?? null, initialKey);
  const sidebar = useFeedSidebar();
  // Fires ONCE per session for logged-in users; empty for anon.
  const { slugs: unlockedSlugs, hasProAccess } = useMyUnlockedSlugs();

  const topics = sidebar.topics?.topics ?? initialTopics?.topics ?? FALLBACK_TOPICS;
  const popular = sidebar.popular?.tags ?? initialPopular?.tags ?? null;

  // Side-effect re-seed in case React schedules the seed too late on the very
  // first commit. Idempotent.
  useEffect(() => {
    if (initialPopular || initialTopics) {
      seedSidebarCache(initialPopular ?? null, initialTopics ?? null);
    }
  }, [initialPopular, initialTopics]);

  // Prefetch the top idea slugs so clicking any of the first cards is
  // instant. Idea pages are dynamic routes — without programmatic prefetch
  // they only get prefetched down to the loading.tsx boundary on viewport
  // entry. This warms them as soon as feed data is ready.
  const topSlugs = (data?.items ?? []).slice(0, 6).map((i) => `/ideas/${encodeURIComponent(i.slug)}`);
  useRoutePrefetcher(topSlugs);

  return (
    <div className="flex flex-col gap-12 px-6 pb-16 pt-12 md:px-12">
      <FeedHero lastUpdatedAt={data?.last_updated_at ?? null} />

      <FeedFilterBar
        topics={topics}
        activeTopic={params.topic ?? null}
        sort={(params.sort as FeedSort) ?? "score"}
        q={params.q ?? null}
        onTopicChange={(slug) => setParams({ topic: slug, page: null })}
        onSortChange={(sort) => setParams({ sort, page: null })}
        onSearch={(q) => setParams({ q, page: null })}
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <FeedPopularTags
          tags={popular}
          activeTags={params.tags ?? []}
          loading={sidebar.loading && !initialPopular}
          onToggle={(tag) => {
            const current = params.tags ?? [];
            const next = current.includes(tag)
              ? current.filter((t) => t !== tag)
              : [...current, tag];
            setParams({ tags: next.length ? next : null, page: null });
          }}
        />

        {/* `isPending` from useTransition fades the existing list while the
            URL change resolves. The cards stay mounted (no flash to blank),
            interactivity is disabled to prevent double-clicks, and the
            opacity drop signals "loading next page" without a layout shift. */}
        <div
          className={
            "flex flex-grow flex-col gap-6 transition-opacity duration-150 " +
            (isPending ? "pointer-events-none opacity-60" : "opacity-100")
          }
          aria-busy={isPending}
        >
          <FeedList
            items={data?.items ?? []}
            loading={loading}
            error={error}
            unlockedSlugs={unlockedSlugs}
            hasProAccess={hasProAccess}
          />
          {data?.pagination ? (
            <FeedPagination
              page={data.pagination.page}
              totalPages={data.pagination.total_pages}
              hasPrev={data.pagination.has_prev}
              hasNext={data.pagination.has_next}
              onChange={(page) => setParams({ page }, "push")}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

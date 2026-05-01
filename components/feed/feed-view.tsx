"use client";

import { FeedFilterBar } from "@/components/feed/feed-filter-bar";
import { FeedHero } from "@/components/feed/feed-hero";
import { FeedList } from "@/components/feed/feed-list";
import { FeedPagination } from "@/components/feed/feed-pagination";
import { FeedPopularTags } from "@/components/feed/feed-popular-tags";
import type { FeedSort, FeedTopic } from "@/lib/api/feed";
import { useFeed, useFeedSidebar } from "@/lib/hooks/use-feed";
import { useFeedParams } from "@/lib/hooks/use-feed-params";
import { useMyUnlockedSlugs } from "@/lib/hooks/use-unlocked-slugs";

const FALLBACK_TOPICS: FeedTopic[] = [
  { slug: "all", label: "All Topics", count: 0 },
];

/**
 * Top-level client component for /feed.
 *
 * API-call shape (per page mount):
 *   - useFeedSidebar fires once → /v1/feed/popular-tags + /v1/feed/topics
 *     (only if the user reloads the page).
 *   - useFeed fires once per (page/per_page/topic/tags/min_score/q/sort) tuple,
 *     aborting any previous in-flight request.
 *
 * URL is the source of truth. Filter / sort / search updates use replace;
 * pagination uses push so the back button works as expected.
 */
export function FeedView() {
  const { params, setParams } = useFeedParams();
  const { data, loading, error } = useFeed(params);
  const sidebar = useFeedSidebar();
  // Fires ONCE per session for logged-in users; empty for anon.
  const { slugs: unlockedSlugs, hasProAccess } = useMyUnlockedSlugs();

  const topics = sidebar.topics?.topics ?? FALLBACK_TOPICS;
  const popular = sidebar.popular?.tags ?? null;

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
          loading={sidebar.loading}
          onToggle={(tag) => {
            const current = params.tags ?? [];
            const next = current.includes(tag)
              ? current.filter((t) => t !== tag)
              : [...current, tag];
            setParams({ tags: next.length ? next : null, page: null });
          }}
        />

        <div className="flex flex-grow flex-col gap-6">
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

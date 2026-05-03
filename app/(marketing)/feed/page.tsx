import { Suspense } from "react";

import { FeedView } from "@/components/feed/feed-view";
import {
  fetchFeed,
  fetchPopularTags,
  fetchTopics,
  type FeedQuery,
  type FeedResponse,
  type PopularTagsResponse,
  type FeedTopicsResponse,
} from "@/lib/api/feed";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { buildBreadcrumbSchema, schemaJson } from "@/lib/seo/schemas";

export const metadata = pageMetadata({
  title: "Feed",
  description:
    "Pain points from real builders, scored, briefed, and ready to unlock for $3.",
  path: "/feed",
});

const BREADCRUMB = buildBreadcrumbSchema([{ name: "Feed", path: "/feed" }]);

// Default-params query the server pre-fetches. MUST match the defaults in
// useFeedParams (page=1, per_page=12, sort=score, no topic/tags/q/min_score)
// so the seed-match check on first render succeeds and we skip the initial
// client fetch.
const DEFAULT_QUERY: FeedQuery = {
  page: 1,
  per_page: 12,
  topic: null,
  tags: [],
  q: null,
  min_score: null,
  sort: "score",
};
const DEFAULT_QUERY_KEY = JSON.stringify(DEFAULT_QUERY);

// Re-validate every 5 minutes. The cards visible on first paint are
// counter-stale by at most 5 min — acceptable for marketing, far better than
// hitting FastAPI on every crawler request.
export const revalidate = 300;

/**
 * /feed — public, browsable by anyone. Auth gating is per-action: clicking
 * "Unlock $X" while logged out pushes to /login?next=/ideas/{slug}.
 *
 * Server Component pre-fetches the default-params feed plus the sidebar
 * payloads so the SSR HTML contains real idea cards (titles + /ideas/{slug}
 * hrefs + counters). Crawlers see actual content; JS users get an instant
 * first paint with no skeleton flicker. The existing FeedView client
 * component takes over for filters, search, and pagination.
 *
 * Wrapped in <Suspense> because <FeedView> reads search params via
 * useSearchParams(), which Next.js requires under a Suspense boundary.
 */
export default async function FeedPage() {
  const [initialData, initialPopular, initialTopics] = await Promise.all([
    safeFetchFeed(),
    safeFetchPopular(),
    safeFetchTopics(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson(BREADCRUMB) }}
      />
      <Suspense fallback={null}>
        <FeedView
          initialData={initialData}
          initialKey={DEFAULT_QUERY_KEY}
          initialPopular={initialPopular}
          initialTopics={initialTopics}
        />
      </Suspense>
    </>
  );
}

// =================================================================== //
//  Backend fetchers — fail soft, never throw                          //
// =================================================================== //

async function safeFetchFeed(): Promise<FeedResponse | null> {
  try {
    return await fetchFeed(DEFAULT_QUERY);
  } catch {
    return null;
  }
}

async function safeFetchPopular(): Promise<PopularTagsResponse | null> {
  try {
    return await fetchPopularTags(10);
  } catch {
    return null;
  }
}

async function safeFetchTopics(): Promise<FeedTopicsResponse | null> {
  try {
    return await fetchTopics();
  } catch {
    return null;
  }
}

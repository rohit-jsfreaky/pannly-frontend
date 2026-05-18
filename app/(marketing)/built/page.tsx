import type { Metadata } from "next";
import { Suspense } from "react";

import { GalleryView } from "@/components/gallery/gallery-view";
import { fetchGallery, type GalleryBuild } from "@/lib/api/builds";
import { pageMetadata } from "@/lib/seo/page-metadata";
import {
  buildBreadcrumbSchema,
  buildGalleryGraph,
  schemaJson,
} from "@/lib/seo/schemas";

const BASE_METADATA = pageMetadata({
  title: "Build Gallery",
  path: "/built",
  description:
    "Real builders shipping real products from $3 idea unlocks — every project here got a refund.",
});

/**
 * Conditional indexing: until the gallery has shipped builds, we noindex it
 * to avoid Google evaluating an empty placeholder as thin content. The fetch
 * happens at metadata-resolve time so the page doesn't hide useful content
 * once builds exist.
 *
 * Returns to indexable as soon as `total_count >= 1`. Sitemap inclusion is
 * managed separately and remains active either way.
 */
export async function generateMetadata(): Promise<Metadata> {
  let hasBuilds = false;
  try {
    const res = await fetchGallery({ page: 1, per_page: 1 });
    hasBuilds = (res.pagination?.total_count ?? 0) > 0;
  } catch {
    // Backend down — preserve current indexing posture (noindex). Conservative
    // failure mode: better to under-index than to publish an empty page.
    hasBuilds = false;
  }
  return {
    ...BASE_METADATA,
    robots: hasBuilds
      ? undefined
      : {
          index: false,
          follow: true,
          googleBot: { index: false, follow: true },
        },
  };
}

const BREADCRUMB = buildBreadcrumbSchema([
  { name: "Build Gallery", path: "/built" },
]);

// New builds land at most a few times a day. 5-minute cache is fine and keeps
// the gallery listing snappy for crawlers that hit /built repeatedly.
export const revalidate = 300;

/**
 * /built — public Build Gallery. Auth-free; everything renders for anon users.
 *
 * The page component itself is SYNC so the HTML shell streams to the
 * browser immediately. The schema fetch (which awaits the backend) lives
 * in a separate async component wrapped in Suspense. This way the page
 * shell + GalleryView paint without waiting on the schema fetch — bots
 * still see the schema once it streams in (it lands in <head> equivalents
 * a moment later, well within Googlebot's render budget).
 *
 * Wrapped in <Suspense> because <GalleryView> reads search params via
 * useSearchParams(), which Next requires under a Suspense boundary.
 */
export default function BuildGalleryPage() {
  return (
    <>
      <Suspense fallback={null}>
        <GalleryItemListSchema />
      </Suspense>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson(BREADCRUMB) }}
      />
      <Suspense fallback={null}>
        <GalleryView />
      </Suspense>
    </>
  );
}

/**
 * Async schema injector. Streams the CollectionPage + ItemList JSON-LD
 * block into the response once the build list is fetched. Doesn't block
 * the visible UI.
 */
async function GalleryItemListSchema() {
  const items = await fetchInitialBuildsForSchema();
  const graph = buildGalleryGraph(
    items.map((b) => ({
      slug: b.idea_slug,
      name: b.build_name,
      description: b.idea_pain ?? b.idea_title,
    })),
  );
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schemaJson(graph) }}
    />
  );
}

/** Fail-soft fetch — if the backend is down, the schema just lists no items. */
async function fetchInitialBuildsForSchema(): Promise<GalleryBuild[]> {
  try {
    const res = await fetchGallery({ page: 1, per_page: 12 });
    return res.items;
  } catch {
    return [];
  }
}

import { Suspense } from "react";

import { GalleryView } from "@/components/gallery/gallery-view";
import { fetchGallery, type GalleryBuild } from "@/lib/api/builds";
import { pageMetadata } from "@/lib/seo/page-metadata";
import {
  buildBreadcrumbSchema,
  buildGalleryGraph,
  schemaJson,
} from "@/lib/seo/schemas";

export const metadata = pageMetadata({
  title: "Build Gallery",
  path: "/built",
  description:
    "Real builders shipping real products from $3 idea unlocks — every project here got a refund.",
});

const BREADCRUMB = buildBreadcrumbSchema([
  { name: "Build Gallery", path: "/built" },
]);

/**
 * /built — public Build Gallery. Auth-free; everything renders for anon users.
 *
 * Wrapped in <Suspense> because <GalleryView> reads search params via
 * useSearchParams(), which Next requires under a Suspense boundary.
 *
 * Server-side we ALSO fetch the first 12 builds and embed them as a
 * CollectionPage + ItemList JSON-LD block. Bots that don't execute JS still
 * get a structured list of the gallery's first page; the sitemap covers the
 * rest.
 */
export default async function BuildGalleryPage() {
  const items = await fetchInitialBuildsForSchema();
  const graph = buildGalleryGraph(
    items.map((b) => ({
      slug: b.idea_slug,
      name: b.build_name,
      description: b.idea_pain ?? b.idea_title,
    })),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson(graph) }}
      />
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

/** Fail-soft fetch — if the backend is down, the schema just lists no items. */
async function fetchInitialBuildsForSchema(): Promise<GalleryBuild[]> {
  try {
    const res = await fetchGallery({ page: 1, per_page: 12 });
    return res.items;
  } catch {
    return [];
  }
}

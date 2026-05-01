"use client";

import { GalleryCta } from "@/components/gallery/gallery-cta";
import { GalleryFilterBar } from "@/components/gallery/gallery-filter-bar";
import { GalleryHero } from "@/components/gallery/gallery-hero";
import { GalleryList } from "@/components/gallery/gallery-list";
import { FeedPagination } from "@/components/feed/feed-pagination";
import { useBuildCategories, useGallery } from "@/lib/hooks/use-build-gallery";
import { useGalleryParams } from "@/lib/hooks/use-gallery-params";

/**
 * Top-level client component for /built (Build Gallery).
 *
 * API-call shape (per page mount):
 *   - useBuildCategories fires ONCE per session → /v1/builds/categories
 *     (subsequent mounts hit the module-level cache).
 *   - useGallery fires once per (page/per_page/category/sort) tuple, sharing
 *     the in-flight promise with any concurrent consumer.
 *
 * URL is the source of truth. Filter / sort changes use replace; pagination
 * uses push so the back button works as expected.
 */
export function GalleryView() {
  const { params, setParams } = useGalleryParams();
  const { data, loading, error } = useGallery(params);
  const cats = useBuildCategories();

  return (
    <div className="mx-auto flex w-full flex-col gap-12 px-6 pt-16 pb-24 md:px-12">
      <GalleryHero
        totalShipped={data?.hero.total_shipped ?? null}
        loading={loading && !data}
      />

      <GalleryFilterBar
        categories={cats.data?.categories ?? null}
        loading={cats.loading}
        activeCategory={params.category ?? null}
        sort={params.sort ?? "recent"}
        onCategoryChange={(slug) => setParams({ category: slug, page: null })}
        onSortChange={(sort) => setParams({ sort, page: null })}
      />

      <GalleryList items={data?.items ?? []} loading={loading} error={error} />

      {data?.pagination ? (
        <FeedPagination
          page={data.pagination.page}
          totalPages={data.pagination.total_pages}
          hasPrev={data.pagination.has_prev}
          hasNext={data.pagination.has_next}
          onChange={(page) => setParams({ page }, "push")}
        />
      ) : null}

      <GalleryCta />
    </div>
  );
}

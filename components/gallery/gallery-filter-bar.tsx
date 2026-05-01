"use client";

import { Select, type SelectOption } from "@/components/ui/select";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import type { BuildSort, CategoryEntry } from "@/lib/api/builds";
import { cn } from "@/lib/utils";

interface Props {
  categories: CategoryEntry[] | null;
  loading: boolean;
  /** Currently-active category slug, or null = "All Builds". */
  activeCategory: string | null;
  sort: BuildSort;
  onCategoryChange: (slug: string | null) => void;
  onSortChange: (sort: BuildSort) => void;
}

const SORT_OPTIONS: SelectOption<BuildSort>[] = [
  { value: "recent", label: "Recent" },
  { value: "oldest", label: "Oldest" },
  { value: "fastest", label: "Fastest" },
];

/**
 * Pills row + custom Sort dropdown — same layout as the design.
 * Uses the shared <Select> so the visual stays under our design system.
 */
export function GalleryFilterBar({
  categories,
  loading,
  activeCategory,
  sort,
  onCategoryChange,
  onSortChange,
}: Props) {
  return (
    <div className="flex flex-col items-stretch justify-between gap-4 border-y border-cream-300/60 py-4 sm:flex-row sm:items-center">
      {/* Category pills */}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {loading && !categories ? (
          <FilterPillsFallback />
        ) : (
          (categories ?? []).map((c) => {
            const isActive =
              (c.slug === "all" && !activeCategory) ||
              (activeCategory && c.slug.toLowerCase() === activeCategory.toLowerCase());
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => onCategoryChange(c.slug === "all" ? null : c.slug)}
                className={cn(
                  "whitespace-nowrap rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors",
                  isActive
                    ? "border-cream-300 bg-cream-200 text-ink-500"
                    : "border-cream-300 bg-transparent text-ink-50 hover:bg-cream-200 hover:text-ink-500",
                )}
              >
                {c.label}
              </button>
            );
          })
        )}
      </div>

      <Select
        aria-label="Sort gallery"
        value={sort}
        onChange={onSortChange}
        options={SORT_OPTIONS}
        variant="inline"
        inlinePrefix="Sort by:"
      />
    </div>
  );
}

function FilterPillsFallback() {
  return (
    <>
      {[80, 60, 60, 70].map((w, i) => (
        <SkeletonBlock key={i} className="h-8 rounded-full" style={{ width: `${w}px` }} />
      ))}
    </>
  );
}

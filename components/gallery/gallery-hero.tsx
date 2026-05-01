import { SkeletonBlock } from "@/components/ui/skeleton-block";

interface Props {
  /** Total `approved` + `refunded` builds across the whole gallery (NOT filtered). */
  totalShipped: number | null;
  loading: boolean;
}

/**
 * Centered hero — "{N} builds shipped from $3 ideas." + tagline. The number
 * comes from `gallery.hero.total_shipped` so it counts the full archive even
 * when the user has a category filter applied.
 */
export function GalleryHero({ totalShipped, loading }: Props) {
  return (
    <section className="mx-auto max-w-3xl text-center">
      {loading && totalShipped === null ? (
        <SkeletonBlock className="mx-auto mb-6 h-12 w-3/4" />
      ) : (
        <h1 className="mb-6 font-display text-4xl font-semibold tracking-tight text-ink-700 md:text-5xl">
          {totalShipped ?? 0} builds shipped from $3 ideas.
        </h1>
      )}
      <p className="text-lg leading-relaxed text-ink-50">
        Every project below started as a $3 unlock. The builders all got their money back.
        Proof that constraint breeds creativity.
      </p>
    </section>
  );
}

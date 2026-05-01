import { formatRelative } from "@/lib/format";

interface Props {
  lastUpdatedAt: string | null;
}

/**
 * Page heading + last-updated indicator. Static — no interactive state.
 */
export function FeedHero({ lastUpdatedAt }: Props) {
  return (
    <section className="max-w-3xl">
      <h1 className="font-display text-5xl font-semibold tracking-tight text-ink-700 md:text-6xl">
        The feed.
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-50">
        Pain points from real builders, scored, briefed, and ready to unlock.
      </p>
      <div className="mt-6 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-plum-500 opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-plum-500" />
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.08em] text-cream-400">
          Last updated:{" "}
          <span className="text-ink-50/80">
            {lastUpdatedAt ? formatRelative(lastUpdatedAt) : "—"}
          </span>
        </span>
      </div>
    </section>
  );
}

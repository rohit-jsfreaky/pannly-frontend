import type { Route } from "next";
import Link from "next/link";

import { GalleryThumbnail } from "@/components/gallery/gallery-thumbnail";
import type { GalleryBuild } from "@/lib/api/builds";
import { cn } from "@/lib/utils";

interface Props {
  build: GalleryBuild;
}

const STATE_LABEL: Record<string, string> = {
  approved: "Approved",
  refunded: "Refunded",
};

/**
 * One gallery card. Whole card is a link to the build's external URL (opens
 * in a new tab), with the "from idea: …" line linking back to the source
 * brief on `/ideas/{slug}`.
 */
export function GalleryCard({ build }: Props) {
  const stateLabel = STATE_LABEL[build.state] ?? build.state;
  const ideaPain = build.idea_pain ?? build.idea_title;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-cream-300 bg-cream-50 transition-colors hover:border-ink-700/30">
      {/* Whole top half is the build URL — opens in a new tab so we don't
          eject the gallery state. */}
      <a
        href={build.build_url || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-500/40"
        aria-label={`Visit ${build.build_name}`}
      >
        <GalleryThumbnail
          src={build.screenshot_url}
          alt={`${build.build_name} screenshot`}
          seed={build.id}
        />
      </a>

      <div className="flex flex-grow flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-display text-xl text-ink-700 transition-colors group-hover:text-moss-700">
            {build.build_name}
          </h2>
          <StateBadge label={stateLabel} state={build.state} />
        </div>

        <Link
          href={`/ideas/${encodeURIComponent(build.idea_slug)}` as Route}
          className="text-sm leading-relaxed text-ink-50 underline decoration-cream-400 underline-offset-4 transition-colors hover:text-moss-700 hover:decoration-moss-500"
        >
          from idea: &ldquo;{ideaPain}&rdquo;
        </Link>

        <footer className="mt-auto flex items-center justify-between border-t border-cream-300/60 pt-4">
          <BuilderRow
            initials={build.builder.initials}
            displayName={build.builder.display_name}
          />
          {build.days_to_ship !== null ? (
            <span className="rounded-md bg-sage-100/40 px-2 py-1 font-mono text-xs tracking-wide text-sage-500">
              shipped in {build.days_to_ship} {build.days_to_ship === 1 ? "day" : "days"}
            </span>
          ) : null}
        </footer>
      </div>
    </article>
  );
}

function StateBadge({ label, state }: { label: string; state: string }) {
  const refunded = state === "refunded";
  return (
    <span
      className={cn(
        "shrink-0 rounded-md border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider",
        refunded
          ? "border-plum-300 bg-plum-100 text-plum-700"
          : "border-moss-600/30 bg-moss-100 text-moss-700",
      )}
    >
      {label}
    </span>
  );
}

function BuilderRow({
  initials,
  displayName,
}: {
  initials: string;
  displayName: string | null;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden
        className="flex h-6 w-6 items-center justify-center rounded-full border border-cream-300 bg-cream-200 font-mono text-[10px] font-semibold text-ink-50"
      >
        {initials}
      </span>
      <span className="text-sm text-ink-500">{displayName ?? "Anonymous"}</span>
    </div>
  );
}

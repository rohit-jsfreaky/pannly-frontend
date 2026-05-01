import type { BuildersPanel } from "@/lib/api/ideas";
import { cn } from "@/lib/utils";

interface Props {
  builders: BuildersPanel;
}

const STATE_TONE: Record<string, string> = {
  building: "bg-plum-100 text-plum-700",
  submitted: "bg-cream-200 text-ink-50",
  approved: "bg-moss-100 text-moss-700",
};

/** "How others are doing" sidebar — anonymised initials with state tint. */
export function BuildersCard({ builders }: Props) {
  if (builders.total_count === 0) return null;

  const visible = builders.preview.slice(0, 4);
  const overflow = Math.max(builders.total_count - visible.length, 0);

  return (
    <aside className="rounded-xl border border-cream-300 bg-cream-50 p-6">
      <h3 className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-cream-400">
        How others are doing
      </h3>
      <div className="flex items-center -space-x-2">
        {visible.map((b, i) => (
          <span
            key={i}
            title={b.state}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border-2 border-cream-50 font-mono text-[11px] font-semibold uppercase tracking-wider",
              STATE_TONE[b.state] ?? "bg-cream-200 text-ink-50",
            )}
          >
            {b.initials}
          </span>
        ))}
        {overflow > 0 ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-cream-50 bg-cream-200 font-mono text-[11px] font-semibold uppercase text-cream-400">
            +{overflow}
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-xs text-ink-50">
        <span className="font-medium text-ink-500">{builders.total_count}</span>{" "}
        builder{builders.total_count === 1 ? "" : "s"}{" "}
        currently tackling this problem space.
      </p>
    </aside>
  );
}

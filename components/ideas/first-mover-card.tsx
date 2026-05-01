import { Award } from "lucide-react";

interface Props {
  rank: number | null;
  buildWindowDays: number;
}

/**
 * Sidebar card shown to the first 10 unlockers — the back-end's
 * `is_first_mover` flag controls whether to render this at all.
 */
export function FirstMoverCard({ rank, buildWindowDays }: Props) {
  return (
    <aside className="rounded-xl border-2 border-plum-300 bg-cream-50 p-6">
      <div className="mb-3 flex items-center gap-2">
        <Award className="h-5 w-5 text-plum-500" strokeWidth={2} aria-hidden />
        <h3 className="font-display text-lg text-plum-700">First-mover bonus</h3>
      </div>
      <p className="text-sm text-ink-50">
        {rank === 1 ? (
          <>
            You are the <strong className="text-ink-700">first</strong> to claim this idea.
          </>
        ) : rank ? (
          <>
            You are claimer <strong className="text-ink-700">#{rank}</strong> of the first 10.
          </>
        ) : null}{" "}
        Build it within {buildWindowDays} days to secure a feature in the Pannly newsletter.
      </p>
    </aside>
  );
}

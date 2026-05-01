import Link from "next/link";
import { Lock } from "lucide-react";

import { formatMoney } from "@/lib/format";

export interface LandingIdeaCardProps {
  slug: string;
  title: string;
  one_line_pain: string | null;
  tags: string[];
  overall_score: number | null;
  unlock_price_cents: number;
}

export function LandingIdeaCard(props: LandingIdeaCardProps) {
  const { slug, title, one_line_pain, tags, overall_score, unlock_price_cents } = props;

  return (
    <Link
      href={`/ideas/${slug}`}
      className="group flex h-full flex-col rounded-xl border border-cream-300 bg-cream-50 p-6 transition-shadow hover:shadow-soft-lg"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="rounded-md border border-cream-300 bg-cream-200 px-2 py-1 font-mono text-xs font-semibold tracking-[0.05em] text-ink-50/80"
            >
              {t}
            </span>
          ))}
        </div>
        <span className="shrink-0 rounded-md border border-plum-300/40 bg-plum-100/60 px-2 py-1 font-mono text-xs font-medium tracking-[0.05em] text-plum-500">
          +{formatMoney(unlock_price_cents, "USD")} to unlock
        </span>
      </div>

      <h3 className="mb-2 font-display text-2xl text-ink-700">{title}</h3>

      <p className="mb-6 line-clamp-3 flex-grow text-sm text-ink-50/80">
        {one_line_pain ?? "No summary yet — generate the brief in Phase 3."}
      </p>

      <div className="flex items-center justify-between border-t border-cream-300 pt-4 text-ink-50/70">
        <span className="font-mono text-xs tracking-[0.05em]">
          Score: {overall_score ?? "—"}
          <span className="text-ink-50/40">/100</span>
        </span>
        <Lock
          className="h-5 w-5 transition-colors group-hover:text-moss-600"
          strokeWidth={1.75}
          aria-hidden
        />
      </div>
    </Link>
  );
}

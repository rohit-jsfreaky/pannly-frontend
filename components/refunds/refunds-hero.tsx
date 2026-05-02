import { formatMoney } from "@/lib/format";
import type { RefundsSummary } from "@/lib/api/refunds";
import { cn } from "@/lib/utils";

interface Props {
  summary: RefundsSummary | null;
  loading: boolean;
}

/**
 * Hero strip — big $ headline + two small chips below.
 * Numbers come from /v1/refunds (cached 5 min server-side).
 */
export function RefundsHero({ summary, loading }: Props) {
  return (
    <section className="mb-16">
      <h1
        className={cn(
          "mb-4 font-display text-5xl font-semibold text-moss-700 md:text-6xl",
          loading && summary === null && "opacity-60",
        )}
      >
        {summary ? formatMoney(summary.total_refunded_cents) : "$—"}
      </h1>
      <p className="mb-8 max-w-2xl text-2xl leading-snug text-ink-50">
        refunded to builders who actually shipped.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <Chip>
          <span aria-hidden className="block h-2 w-2 rounded-full bg-moss-600" />
          <span className="font-mono text-sm text-ink-700 tabular-nums">
            {summary ? `${summary.total_refunds_count} refunds since launch` : "—"}
          </span>
        </Chip>
        <Chip>
          <span className="font-mono text-sm text-ink-700 tabular-nums">
            {summary
              ? `Avg ${formatMoney(summary.avg_refund_cents)} each`
              : "—"}
          </span>
        </Chip>
      </div>
    </section>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-cream-300 bg-cream-200/60 px-4 py-2">
      {children}
    </span>
  );
}

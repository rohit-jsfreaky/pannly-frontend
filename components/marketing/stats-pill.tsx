import { apiGet } from "@/lib/api-client";
import { formatMoney } from "@/lib/format";

interface Stats {
  ideas_count: number;
  shipped_count: number;
  refunded_total_cents: number;
}

async function fetchStats(): Promise<Stats> {
  try {
    return await apiGet<Stats>("/v1/stats", { next: { revalidate: 60 } });
  } catch {
    // Fail soft — show zeros rather than breaking the hero on a backend hiccup.
    return { ideas_count: 0, shipped_count: 0, refunded_total_cents: 0 };
  }
}

export async function StatsPill() {
  const stats = await fetchStats();

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-cream-300 bg-cream-50 px-4 py-2">
      <span className="font-mono text-xs tracking-[0.05em] text-ink-50/70">
        <span className="text-ink-700">{stats.ideas_count}</span> ideas
      </span>
      <span className="h-1 w-1 rounded-full bg-cream-300" aria-hidden />
      <span className="font-mono text-xs tracking-[0.05em] text-ink-50/70">
        <span className="text-ink-700">{stats.shipped_count}</span> shipped
      </span>
      <span className="h-1 w-1 rounded-full bg-cream-300" aria-hidden />
      <span className="font-mono text-xs tracking-[0.05em] text-plum-500">
        {formatMoney(stats.refunded_total_cents, "USD")} refunded
      </span>
    </div>
  );
}

import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";

import { fetchAdminStats } from "@/lib/admin-server";
import type { StatsActivityPoint } from "@/lib/api/admin";
import { formatMoney } from "@/lib/format";

export const metadata: Metadata = {
  title: "Admin · Overview",
  robots: { index: false, follow: false },
};

// Disable any caching — admin numbers should always be live.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminOverviewPage() {
  const stats = await fetchAdminStats();
  const { counts, revenue, currency, activity_7d } = stats;
  const totalGross = revenue.paid_unlocks_cents + revenue.paid_pro_cents;
  const fmt = (cents: number) => formatMoney(cents, currency);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-12 md:px-12">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream-400">
            Admin
          </span>
          <h1 className="mt-2 font-display text-4xl tracking-tight text-ink-700 md:text-5xl">
            Overview
          </h1>
        </div>
        {counts.pending_review > 0 ? (
          <Link
            href={"/admin/builds" as Route}
            className="inline-flex items-center gap-2 rounded-xl border border-plum-300/60 bg-plum-100/40 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-plum-700 transition-colors hover:bg-plum-100"
          >
            <span className="font-display text-base font-semibold tabular-nums text-plum-700 normal-case tracking-normal">
              {counts.pending_review}
            </span>
            <span>pending review →</span>
          </Link>
        ) : null}
      </header>

      {/* ---------- Counts row ---------- */}
      <section className="mb-10">
        <SectionLabel>People</SectionLabel>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Tile
            label="Users total"
            value={counts.users_total.toString()}
            sub={
              counts.users_added_today > 0
                ? `+${counts.users_added_today} today`
                : "no signups today"
            }
          />
          <Tile
            label="Pro active"
            value={counts.pro_active.toString()}
            tone="moss"
          />
          <Tile
            label="Unlocks (all)"
            value={counts.total_unlocks.toString()}
          />
          <Tile
            label="Builds shipped"
            value={counts.total_shipped.toString()}
            tone="moss"
          />
        </div>
      </section>

      {/* ---------- Revenue row ---------- */}
      <section className="mb-10">
        <SectionLabel>Money · denominated in {currency}</SectionLabel>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Tile
            label="Paid · unlocks"
            value={fmt(revenue.paid_unlocks_cents)}
            sub="idea unlocks"
          />
          <Tile
            label="Paid · Pro"
            value={fmt(revenue.paid_pro_cents)}
            sub="monthly + yearly + lifetime"
          />
          <Tile
            label="Refunded"
            value={fmt(revenue.refunded_cents)}
            sub={
              totalGross > 0
                ? `${((revenue.refunded_cents / totalGross) * 100).toFixed(1)}% of gross`
                : "—"
            }
            tone="plum"
          />
          <Tile
            label="Net revenue"
            value={fmt(revenue.net_cents)}
            sub="paid − refunded"
            tone="moss"
            big
          />
        </div>
      </section>

      {/* ---------- 7-day activity sparkline ---------- */}
      <section>
        <SectionLabel>Last 7 days · unlocks per day</SectionLabel>
        <Last7DaysBars points={activity_7d} />
      </section>
    </div>
  );
}

// =================================================================== //
//  Sub-pieces                                                          //
// =================================================================== //

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-cream-400">
      {children}
    </h2>
  );
}

function Tile({
  label,
  value,
  sub,
  tone,
  big,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "moss" | "plum";
  big?: boolean;
}) {
  const valueColor =
    tone === "moss"
      ? "text-moss-700"
      : tone === "plum"
        ? "text-plum-500"
        : "text-ink-700";
  return (
    <div className="rounded-xl border border-cream-300 bg-cream-50 p-6 shadow-soft">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream-400">
        {label}
      </p>
      <p
        className={`mt-2 font-display ${big ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"} font-semibold tabular-nums leading-none ${valueColor}`}
      >
        {value}
      </p>
      {sub ? (
        <p className="mt-3 text-xs leading-relaxed text-ink-50">{sub}</p>
      ) : null}
    </div>
  );
}

/**
 * Tiny 7-bar SVG chart. No axis labels — just dates underneath each bar.
 * Shows "0" days too so the cadence visualises gaps as well as activity.
 */
function Last7DaysBars({ points }: { points: StatsActivityPoint[] }) {
  const max = Math.max(1, ...points.map((p) => p.unlocks));
  const totalWeek = points.reduce((sum, p) => sum + p.unlocks, 0);

  return (
    <div className="rounded-xl border border-cream-300 bg-cream-50 p-6 shadow-soft">
      <div className="mb-4 flex items-baseline justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-50">
          Total this week
        </span>
        <span className="font-display text-2xl font-semibold tabular-nums text-ink-700">
          {totalWeek}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-3">
        {points.map((p) => {
          const heightPct = (p.unlocks / max) * 100;
          // ISO date → "Mon 27" (short weekday + day of month)
          const d = new Date(`${p.date}T00:00:00Z`);
          const weekday = d.toLocaleDateString("en-US", {
            weekday: "short",
            timeZone: "UTC",
          });
          const dayOfMonth = d.getUTCDate();
          return (
            <div key={p.date} className="flex flex-col items-center gap-2">
              <div className="flex h-24 w-full items-end overflow-hidden rounded-md bg-cream-200">
                <div
                  className={`w-full rounded-t-sm transition-all ${
                    p.unlocks > 0 ? "bg-moss-600" : "bg-cream-300"
                  }`}
                  style={{ height: `${Math.max(heightPct, p.unlocks > 0 ? 8 : 0)}%` }}
                  aria-label={`${p.unlocks} unlocks on ${p.date}`}
                />
              </div>
              <p className="text-center font-mono text-[10px] uppercase tracking-wider text-cream-400">
                {weekday} {dayOfMonth}
              </p>
              <p className="font-display text-sm font-semibold tabular-nums text-ink-700">
                {p.unlocks}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

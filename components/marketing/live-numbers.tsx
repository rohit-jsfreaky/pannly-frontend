/**
 * "Real numbers, not a polished pitch" — live numbers + cumulative chart.
 *
 * SERVER COMPONENT. Fetches the public refunds endpoints once at render time:
 *   GET /v1/refunds         summary (total $, count, avg)
 *   GET /v1/refunds/ledger  full ledger (we use up to 50 most recent rows
 *                            to build the cumulative chart series)
 *
 * The chart is a custom inline SVG line+area chart drawn from the ACTUAL
 * ledger entries — every tick on the curve is a real refund event. No
 * fake data, no "trusted by 10K builders" filler. If the ledger is empty,
 * the chart degrades to an empty-state message.
 */
import type { Route } from "next";
import Link from "next/link";

import {
  fetchRefundsLedger,
  fetchRefundsSummary,
  type LedgerEntry,
  type RefundsSummary,
} from "@/lib/api/refunds";
import { formatMoney } from "@/lib/format";

const EMPTY_SUMMARY: RefundsSummary = {
  total_refunded_cents: 0,
  total_refunds_count: 0,
  avg_refund_cents: 0,
};

export async function LiveNumbers() {
  const [summary, ledger] = await Promise.all([
    fetchRefundsSummary().catch(() => EMPTY_SUMMARY),
    fetchRefundsLedger({ per_page: 50 }).catch(() => null),
  ]);

  const points = buildCumulativeSeries(ledger?.items ?? []);

  return (
    <section className="px-6 md:px-12">
      <div className="mx-auto max-w-[1280px] py-24 md:py-32">
        <header className="mb-12 max-w-2xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream-400">
            Build in public
          </span>
          <h2 className="mt-4 font-display text-3xl tracking-tight text-ink-700 md:text-4xl">
            Real numbers, not a polished pitch.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-50">
            Every refund Pannly has issued is publicly listed. We don't do
            "trusted by thousands" math — here's exactly what's happened so far.
          </p>
        </header>

        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-8 shadow-soft md:p-14">
          {/* 3-up stat row */}
          <div className="grid grid-cols-1 gap-10 border-b border-cream-300/60 pb-10 md:grid-cols-3">
            <Stat
              value={formatMoney(summary.total_refunded_cents)}
              label="Refunded so far"
              tone="moss"
            />
            <Stat
              value={summary.total_refunds_count.toString()}
              label="Builds shipped"
              tone="ink"
            />
            <Stat
              value={
                summary.total_refunds_count > 0
                  ? formatMoney(summary.avg_refund_cents)
                  : "$—"
              }
              label="Avg refund size"
              tone="plum"
            />
          </div>

          {/* Chart */}
          <div className="pt-10">
            <div className="mb-4 flex items-baseline justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream-400">
                Cumulative refunds · since launch
              </span>
              {points.length >= 2 ? (
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-moss-700">
                  Most recent: {formatMoney(points[points.length - 1].cents)}
                </span>
              ) : null}
            </div>

            {points.length >= 2 ? (
              <CumulativeChart points={points} />
            ) : (
              <EmptyChartState />
            )}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-cream-300/60 pt-8 text-sm">
            <Link
              href={"/refunds" as Route}
              className="font-medium text-moss-700 underline decoration-cream-400 underline-offset-4 transition-colors hover:decoration-moss-500"
            >
              View the full ledger →
            </Link>
            <Link
              href={"/built" as Route}
              className="font-medium text-moss-700 underline decoration-cream-400 underline-offset-4 transition-colors hover:decoration-moss-500"
            >
              See every shipped build →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// =================================================================== //
//  Sub-pieces                                                          //
// =================================================================== //

function Stat({
  value,
  label,
  tone,
}: {
  value: string;
  label: string;
  tone: "moss" | "ink" | "plum";
}) {
  const colorClass =
    tone === "moss"
      ? "text-moss-700"
      : tone === "plum"
        ? "text-plum-500"
        : "text-ink-700";
  return (
    <div>
      <div
        className={`font-display text-5xl font-semibold tabular-nums leading-none md:text-6xl ${colorClass}`}
      >
        {value}
      </div>
      <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-cream-400">
        {label}
      </div>
    </div>
  );
}

function EmptyChartState() {
  return (
    <div className="flex h-[260px] items-center justify-center rounded-xl border border-dashed border-cream-300 bg-cream-100 px-6 text-center">
      <p className="max-w-sm text-sm leading-relaxed text-ink-50">
        We're early. The first refunds will show up here as soon as
        builders start shipping. Every entry is a real, paid-back unlock —
        nothing seeded.
      </p>
    </div>
  );
}

// =================================================================== //
//  Chart — pure SVG, no JS, no canvas                                  //
// =================================================================== //

interface ChartPoint {
  /** ISO date string the data point belongs to. */
  date: string;
  /** Cumulative cents up to and including this date. */
  cents: number;
}

const CHART_W = 1120;
const CHART_H = 280;
const CHART_PAD_LEFT = 16;
const CHART_PAD_RIGHT = 16;
const CHART_PAD_TOP = 24;
const CHART_PAD_BOTTOM = 36;

function CumulativeChart({ points }: { points: ChartPoint[] }) {
  // Map each data point to chart coordinates.
  const innerW = CHART_W - CHART_PAD_LEFT - CHART_PAD_RIGHT;
  const innerH = CHART_H - CHART_PAD_TOP - CHART_PAD_BOTTOM;
  const xMax = points.length - 1 || 1;
  const yMax = Math.max(...points.map((p) => p.cents)) || 1;

  const project = (idx: number, cents: number) => ({
    x: CHART_PAD_LEFT + (idx / xMax) * innerW,
    y: CHART_PAD_TOP + (1 - cents / yMax) * innerH,
  });

  const projected = points.map((p, i) => ({ ...project(i, p.cents), p }));

  // Build a smooth path through the points. We use a simple monotone
  // Catmull-Rom-ish curve via cubic beziers — keeps the curve from
  // overshooting at hard step changes.
  const linePath = projected
    .map((pt, i) => {
      if (i === 0) return `M ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;
      const prev = projected[i - 1];
      const midX = (prev.x + pt.x) / 2;
      // Two control points anchored at the horizontal mid — gives a
      // gently flowing curve without overshoot for monotone data.
      return `C ${midX.toFixed(2)} ${prev.y.toFixed(2)}, ${midX.toFixed(2)} ${pt.y.toFixed(2)}, ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;
    })
    .join(" ");

  // Area fill = the line path closed back along the bottom of the chart.
  const baselineY = CHART_PAD_TOP + innerH;
  const lastX = projected[projected.length - 1].x;
  const firstX = projected[0].x;
  const areaPath = `${linePath} L ${lastX.toFixed(2)} ${baselineY} L ${firstX.toFixed(2)} ${baselineY} Z`;

  // Pick the labels for the X axis: first + last + maybe a middle one.
  const xLabels = pickXLabels(points);

  return (
    <svg
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Cumulative refunds over time"
    >
      {/* Subtle horizontal grid line at the chart top */}
      <line
        x1={CHART_PAD_LEFT}
        y1={CHART_PAD_TOP}
        x2={CHART_W - CHART_PAD_RIGHT}
        y2={CHART_PAD_TOP}
        stroke="#c1c8c3"
        strokeWidth="0.5"
      />
      <line
        x1={CHART_PAD_LEFT}
        y1={baselineY}
        x2={CHART_W - CHART_PAD_RIGHT}
        y2={baselineY}
        stroke="#c1c8c3"
        strokeWidth="0.5"
      />

      {/* Filled area underneath the curve */}
      <path d={areaPath} fill="#d7e1db" opacity="0.55" />
      {/* The curve itself */}
      <path
        d={linePath}
        fill="none"
        stroke="#2a4c3f"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data dots */}
      {projected.map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill="#2a4c3f" />
      ))}

      {/* X-axis date labels */}
      {xLabels.map((label) => {
        const projectedX = CHART_PAD_LEFT + (label.idx / xMax) * innerW;
        return (
          <text
            key={label.idx}
            x={projectedX}
            y={CHART_H - 10}
            textAnchor={
              label.idx === 0
                ? "start"
                : label.idx === points.length - 1
                  ? "end"
                  : "middle"
            }
            fontFamily="Geist Mono, ui-monospace, monospace"
            fontSize="9"
            letterSpacing="1.2"
            fill="#717974"
          >
            {label.text.toUpperCase()}
          </text>
        );
      })}
    </svg>
  );
}

// =================================================================== //
//  Data shaping                                                        //
// =================================================================== //

/**
 * Convert the public ledger into a cumulative-cents series.
 * - Sort ascending by shipped_at
 * - Prepend a "$0 a day before the first refund" point so the line has a
 *   visual baseline
 * - Output one ChartPoint per refund event (so 3 refunds → 4 points
 *   including the $0 origin)
 */
function buildCumulativeSeries(items: LedgerEntry[]): ChartPoint[] {
  if (!items.length) return [];

  const ascending = [...items].sort(
    (a, b) =>
      new Date(a.shipped_at).getTime() - new Date(b.shipped_at).getTime(),
  );

  const firstDate = new Date(ascending[0].shipped_at);
  // Anchor point: 1 day before the first refund. Uses ISO date; we don't
  // surface this label — the X axis only shows the first/last actual events.
  const origin = new Date(firstDate);
  origin.setUTCDate(origin.getUTCDate() - 1);

  const points: ChartPoint[] = [
    { date: origin.toISOString(), cents: 0 },
  ];
  let running = 0;
  for (const item of ascending) {
    running += item.amount_cents;
    points.push({ date: item.shipped_at, cents: running });
  }
  return points;
}

/**
 * Choose 3-5 x-axis labels: always first + last, plus one or two evenly
 * spaced middle labels if we have enough data points. Format like "MAR 8".
 */
function pickXLabels(points: ChartPoint[]): { idx: number; text: string }[] {
  if (points.length < 2) return [];
  const labels: { idx: number; text: string }[] = [];
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  labels.push({ idx: 0, text: fmt(points[0].date) });

  // Inject 1-2 middle labels for longer series so the axis isn't sparse.
  if (points.length >= 5) {
    const mid = Math.floor(points.length / 2);
    labels.push({ idx: mid, text: fmt(points[mid].date) });
  }
  if (points.length >= 9) {
    const q3 = Math.floor((points.length * 3) / 4);
    labels.push({ idx: q3, text: fmt(points[q3].date) });
  }

  labels.push({
    idx: points.length - 1,
    text: fmt(points[points.length - 1].date),
  });
  return labels;
}

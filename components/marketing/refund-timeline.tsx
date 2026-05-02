/**
 * "You don't pay $3. You stake $3." — refund-on-ship visual.
 *
 * Past attempt was an SVG horizontal axis with 5 dots and a dashed
 * build-window segment. It read as wireframe / AI-generated, and the
 * SVG `<title>` was triggering a browser tooltip on hover. Replaced with
 * a two-column editorial layout:
 *
 *   left  (cols 5) — a stylised "receipt" mock card showing the financial
 *                    round-trip. $3 OUT on Day 0, $3 IN on Day 30. Uses
 *                    real Inter / Fraunces / Geist Mono typography, dashed
 *                    perforated edges, a faint diagonal "REFUNDED" stamp.
 *                    This is the strong concrete visual.
 *
 *   right (cols 7) — the 5 milestones as a vertical numbered list. No
 *                    connecting line between items. Big serif numbers
 *                    (01–05) anchor each row; the day caption sits as a
 *                    small mono eyebrow above the action label.
 *
 * Day numbers / windows match PUBLIC_BUILD_WINDOW_DAYS=30 and the 24–48h
 * admin-review SLA stated on the contact and submit pages.
 */
const MILESTONES: { day: string; label: string; detail: string; emphasis?: boolean }[] = [
  {
    day: "Day 0",
    label: "Unlock the brief",
    detail: "Card charged $3. The deposit is held by our payment processor.",
    emphasis: true,
  },
  {
    day: "Day 1–3",
    label: "Read it",
    detail: "Pain analysis, sourced quotes, validation plan, sample landing copy.",
  },
  {
    day: "Day 4–28",
    label: "Build it",
    detail: "MVP, validation experiment, real landing page — your call.",
  },
  {
    day: "Day 29",
    label: "Submit your build URL",
    detail: "Hit Submit on the brief page. Manual review begins.",
    emphasis: true,
  },
  {
    day: "Day 30 + 24–48h",
    label: "Refund settles",
    detail: "Admin approves, the $3 returns to your card. No questions.",
  },
];

export function RefundTimeline() {
  return (
    <section className="px-6 md:px-12">
      <div className="mx-auto max-w-[1280px] py-24 md:py-32">
        <header className="mb-14 max-w-2xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream-400">
            The refund mechanic
          </span>
          <h2 className="mt-4 font-display text-3xl tracking-tight text-ink-700 md:text-4xl">
            You don't pay $3. You{" "}
            <span className="italic text-plum-500">stake</span> $3.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-50 md:text-lg">
            When you unlock a brief, the $3 isn't a fee. It's a deposit on
            your own follow-through. Ship a working URL within 30 days, hit
            Submit, an admin reviews within 24–48 hours, and the $3 returns
            to your card automatically through our payment processor.
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <RefundReceipt />
          </div>

          <ol className="lg:col-span-7">
            {MILESTONES.map((m, i) => (
              <Milestone
                key={m.day}
                index={i + 1}
                {...m}
                isLast={i === MILESTONES.length - 1}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

// =================================================================== //
//  Stylised "receipt" card — concrete metaphor for the $3 round-trip  //
// =================================================================== //

function RefundReceipt() {
  return (
    <div className="relative mx-auto w-full max-w-[400px]">
      <div className="relative overflow-hidden rounded-md bg-cream-50 px-7 pb-7 pt-8 shadow-soft-lg">
        {/* Perforated top edge — small zig-zag SVG, sits above the card */}
        <div className="absolute inset-x-0 -top-[1px] flex h-3 items-end" aria-hidden>
          <svg
            viewBox="0 0 200 12"
            preserveAspectRatio="none"
            className="h-3 w-full text-cream-50"
          >
            <path
              d="M0,12 L0,4 L8,12 L16,4 L24,12 L32,4 L40,12 L48,4 L56,12 L64,4 L72,12 L80,4 L88,12 L96,4 L104,12 L112,4 L120,12 L128,4 L136,12 L144,4 L152,12 L160,4 L168,12 L176,4 L184,12 L192,4 L200,12 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between border-b border-cream-300 pb-4">
          <span className="font-display text-base text-ink-700">
            Pannly · Idea unlock
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream-400">
            Receipt · #PNLY-3
          </span>
        </div>

        {/* OUT row — $3 deposit on Day 0 */}
        <div className="flex items-baseline justify-between pt-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream-400">
              Day 0
            </p>
            <p className="mt-1 font-display text-[15px] text-ink-700">
              Refund deposit
            </p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-ink-50">
              Paid via card · processor: Dodo
            </p>
          </div>
          <span className="font-display text-2xl tabular-nums text-ink-700">
            −$3.00
          </span>
        </div>

        {/* Time-passes divider */}
        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 border-t border-dashed border-cream-300" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream-400">
            30 days later
          </span>
          <span className="h-px flex-1 border-t border-dashed border-cream-300" />
        </div>

        {/* IN row — $3 refund on Day 30 */}
        <div className="flex items-baseline justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-moss-700">
              Day 30 + 24–48h
            </p>
            <p className="mt-1 font-display text-[15px] text-ink-700">
              Build approved · refund issued
            </p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-ink-50">
              Auto-credited to original card
            </p>
          </div>
          <span className="font-display text-2xl tabular-nums text-moss-700">
            +$3.00
          </span>
        </div>

        {/* Bottom net row */}
        <div className="mt-6 flex items-baseline justify-between border-t border-cream-300 pt-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-500">
            Net cost to you
          </span>
          <span className="font-display text-xl tabular-nums text-ink-700">
            $0.00
          </span>
        </div>

        {/* Faint diagonal stamp — uses an absolute box rotated -12deg.
            Drawn last, sits ABOVE the receipt rows but at low opacity so
            it reads as a paid stamp, not a watermark. */}
        <span
          aria-hidden
          className="pointer-events-none absolute right-6 top-[58%] -translate-y-1/2 -rotate-12 select-none rounded-sm border-[2.5px] border-moss-600/35 px-3 py-1 font-mono text-base font-bold uppercase tracking-[0.24em] text-moss-600/40"
        >
          Refunded
        </span>
      </div>
    </div>
  );
}

// =================================================================== //
//  Vertical milestone list — 5 numbered entries, no connecting line   //
// =================================================================== //

function Milestone({
  index,
  day,
  label,
  detail,
  emphasis,
  isLast,
}: {
  index: number;
  day: string;
  label: string;
  detail: string;
  emphasis?: boolean;
  isLast: boolean;
}) {
  const num = String(index).padStart(2, "0");
  return (
    <li
      className={`flex items-baseline gap-5 ${isLast ? "" : "pb-7"} ${
        isLast ? "" : "border-b border-cream-300/70"
      } ${isLast ? "" : "mb-7"}`}
    >
      <span
        aria-hidden
        className={`shrink-0 font-display text-3xl leading-none tabular-nums ${
          emphasis ? "text-moss-700" : "text-cream-400"
        }`}
      >
        {num}
      </span>
      <div className="flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream-400">
          {day}
        </p>
        <h3 className="mt-1 font-display text-xl text-ink-700">{label}</h3>
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink-50">
          {detail}
        </p>
      </div>
    </li>
  );
}

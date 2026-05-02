/**
 * "Where the signal comes from" — editorial colophon-style source list.
 *
 * Philosophy: lean on Fraunces serif typography, not UI chrome. No glyphs,
 * no pills, no constellation lines, no exposed "we crawl 600 posts/day"
 * metrics. The list itself is the visual.
 *
 * Layout:
 *   - Header column with eyebrow + H2 + intro paragraph
 *   - Single cream-50 panel split into Reddit / Hacker News groups, each
 *     row is a serif-rendered source name with a quiet plum diamond bullet
 *     and a 0.5px hairline divider beneath. A vertical rule separates the
 *     two groups on desktop.
 *   - Bottom border-rule + small mono-caps closer.
 *
 * Source list comes from backend/.env SUBREDDITS_LIST + the HN tags we
 * crawl, but the page never reveals counts or cadence — that's internal.
 */
const SUBREDDITS = [
  "r/SaaS",
  "r/indiehackers",
  "r/Entrepreneur",
  "r/SideProject",
  "r/microsaas",
  "r/SaaS_Ideas",
];

const HN_TAGS = ["Ask HN", "Show HN"];

export function WhereWeListen() {
  return (
    <section className="px-6 md:px-12">
      <div className="mx-auto max-w-[1280px] py-24 md:py-32">
        <header className="mb-14 max-w-2xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream-400">
            Where the signal comes from
          </span>
          <h2 className="mt-5 font-display text-3xl tracking-tight text-ink-700 md:text-5xl">
            We read what builders are already
            <br className="hidden md:block" /> saying out loud.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-50 md:text-lg">
            Pannly listens in public — the SaaS-focused communities on Reddit
            and the Ask HN / Show HN feeds. Every brief preserves the
            original source link so the evidence stays honest.
          </p>
        </header>

        <div className="rounded-2xl border border-cream-300 bg-cream-50 px-8 py-12 md:px-16 md:py-16">
          <div className="grid grid-cols-1 gap-x-16 gap-y-14 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <SectionHeading label="Reddit" />
              <ul className="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
                {SUBREDDITS.map((s) => (
                  <SourceRow key={s} label={s} />
                ))}
              </ul>
            </div>

            {/* Vertical rule + HN list. lg+ only — mobile gets the fallback below. */}
            <div className="hidden lg:col-span-4 lg:flex">
              <div className="h-full w-px bg-cream-300/70" aria-hidden />
              <div className="flex-1 pl-12">
                <SectionHeading label="Hacker News" />
                <ul>
                  {HN_TAGS.map((s) => (
                    <SourceRow key={s} label={s} />
                  ))}
                </ul>
              </div>
            </div>

            {/* Mobile fallback: HN block re-renders below the Reddit block */}
            <div className="lg:hidden">
              <SectionHeading label="Hacker News" />
              <ul>
                {HN_TAGS.map((s) => (
                  <SourceRow key={s} label={s} />
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-4 border-t border-cream-300/60 pt-6">
            <SmallOrnament />
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream-400">
              Public threads only · source URL on every quote
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// =================================================================== //
//  Sub-pieces                                                          //
// =================================================================== //

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-8 flex items-baseline gap-4">
      <h3 className="font-display text-xl text-ink-700 md:text-2xl">{label}</h3>
      <span aria-hidden className="h-px flex-1 bg-cream-300/70" />
    </div>
  );
}

function SourceRow({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-4 border-b border-cream-300/50 py-3.5 last:border-b-0">
      <Diamond />
      <span className="font-display text-lg leading-none tracking-tight text-ink-700 md:text-xl">
        {label}
      </span>
    </li>
  );
}

/** Open diamond bullet — quieter than ★ or •, reads as editorial dingbat. */
function Diamond() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 12"
      className="h-2.5 w-2.5 shrink-0 text-plum-500/80"
    >
      <path
        d="M6 1 L 11 6 L 6 11 L 1 6 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Three short vertical strokes — manuscript end-mark style colophon flourish. */
function SmallOrnament() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 12"
      className="h-3 w-6 shrink-0 text-moss-300"
    >
      <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <line x1="3" y1="2" x2="3" y2="10" />
        <line x1="12" y1="1" x2="12" y2="11" />
        <line x1="21" y1="2" x2="21" y2="10" />
      </g>
    </svg>
  );
}

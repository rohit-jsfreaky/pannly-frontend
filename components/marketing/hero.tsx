import type { Route } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Landing hero. Two-column on desktop:
 *   left  — eyebrow, headline, sub, two CTAs, mono micro-line
 *   right — editorial flat-lay SVG (notebook + pen + foliage + bookmark)
 *
 * Stacks centred on mobile, illustration drops below.
 */
export function Hero() {
  return (
    <section className="px-6 md:px-12">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-16 py-24 md:grid-cols-12 md:py-32">
        <div className="md:col-span-7">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream-400">
            Indie idea finder · Build in public
          </span>

          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink-700 md:text-6xl">
            Find an idea worth building.{" "}
            <span className="italic text-plum-500">Get refunded</span> if you
            actually ship.
          </h1>

          {/* Definitional one-sentence paragraph for AI Overviews / voice
              extraction. The .geo-speakable class is referenced by the
              SpeakableSpecification JSON-LD on the homepage. */}
          <p className="geo-speakable mt-6 max-w-2xl text-lg leading-relaxed text-ink-50">
            Pannly is a startup idea finder that surfaces validated software
            opportunities from real Reddit and Hacker News pain threads,
            priced at $3 per brief with an automatic refund if you ship within
            30 days.
          </p>

          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-50">
            We watch Reddit and Hacker News for the recurring "I'd pay for
            this" posts, score each one, and write the brief.
          </p>

          {/* prefetch={true} forces full prefetch (HTML + data) for these
              dynamic-route CTAs as soon as Hero hits the viewport. Default
              `auto` prefetches only down to the loading.tsx boundary, which
              is fine for casual links — these two are the primary CTAs from
              Product Hunt traffic, so we want them warm BEFORE the click. */}
          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Link
              href={"/feed" as Route}
              prefetch={true}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-moss-600 px-6 py-3 text-base font-medium text-cream-50 shadow-sm transition-opacity hover:opacity-90"
            >
              Browse the feed
              <ArrowRight className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
            </Link>
            <Link
              href={"/how-it-works" as Route}
              prefetch={true}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-cream-300 bg-cream-50 px-6 py-3 text-base font-medium text-ink-700 transition-colors hover:bg-cream-200"
            >
              How it works
            </Link>
          </div>

          <p className="mt-8 font-mono text-xs uppercase tracking-[0.12em] text-cream-400">
            $3 per brief · 30-day window · auto-refunded on ship
          </p>
        </div>

        <div className="md:col-span-5">
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}

/**
 * Custom inline SVG. Editorial flat-lay still life:
 *   - cream paper backdrop (the page itself)
 *   - notebook with leather cover (rotated slightly)
 *   - fountain pen at an angle
 *   - 3 dried-eucalyptus leaves
 *   - a small terracotta bookmark/page-corner
 *
 * Single-weight outlined strokes (1.5px) on moss-600. Fills in cream / sage /
 * plum. No drop shadows.
 */
function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 600 520"
      role="img"
      aria-labelledby="hero-illo-title"
      className="mx-auto h-auto w-full max-w-[520px]"
    >
      <title id="hero-illo-title">A notebook, fountain pen, and dried foliage on cream paper.</title>

      {/* Subtle background paper-tile shadow under everything */}
      <ellipse
        cx="305"
        cy="450"
        rx="240"
        ry="22"
        fill="#1a1c1b"
        opacity="0.05"
      />

      {/* Foliage sprigs — sage-300 fill, drawn behind the notebook */}
      <g
        stroke="#52634b"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.85"
      >
        {/* sprig top-left */}
        <path d="M88 110 C 110 140, 138 178, 162 220" />
        <ellipse cx="100" cy="138" rx="9" ry="4" fill="#b9ccae" transform="rotate(-30 100 138)" />
        <ellipse cx="118" cy="160" rx="11" ry="5" fill="#b9ccae" transform="rotate(-25 118 160)" />
        <ellipse cx="138" cy="186" rx="12" ry="5" fill="#b9ccae" transform="rotate(-20 138 186)" />
        <ellipse cx="156" cy="208" rx="10" ry="4" fill="#b9ccae" transform="rotate(-15 156 208)" />

        {/* sprig top-right (smaller) */}
        <path d="M510 80 C 502 118, 488 158, 470 192" />
        <ellipse cx="506" cy="106" rx="9" ry="4" fill="#cfe3c4" transform="rotate(70 506 106)" />
        <ellipse cx="498" cy="132" rx="10" ry="4" fill="#cfe3c4" transform="rotate(65 498 132)" />
        <ellipse cx="486" cy="160" rx="9" ry="4" fill="#cfe3c4" transform="rotate(60 486 160)" />
      </g>

      {/* Notebook — rotated 4°, layered */}
      <g transform="rotate(-4 300 280)">
        {/* shadow strip behind the cover */}
        <rect x="138" y="148" width="324" height="284" rx="10" fill="#1a1c1b" opacity="0.06" />
        {/* leather cover */}
        <rect
          x="135"
          y="142"
          width="328"
          height="288"
          rx="10"
          fill="#2a4c3f"
          stroke="#1f3a2e"
          strokeWidth="1"
        />
        {/* page block — slightly inset on the right edge to imply depth */}
        <rect x="160" y="158" width="298" height="256" rx="4" fill="#faf9f7" />
        {/* spine accent */}
        <rect x="296" y="158" width="2" height="256" fill="#1f3a2e" opacity="0.3" />
        {/* page rules (left side) */}
        <g stroke="#c1c8c3" strokeWidth="1" opacity="0.7">
          <line x1="176" y1="186" x2="280" y2="186" />
          <line x1="176" y1="206" x2="280" y2="206" />
          <line x1="176" y1="226" x2="266" y2="226" />
          <line x1="176" y1="246" x2="280" y2="246" />
          <line x1="176" y1="266" x2="252" y2="266" />
          <line x1="176" y1="286" x2="280" y2="286" />
          <line x1="176" y1="306" x2="270" y2="306" />
        </g>
        {/* a tiny moss-600 underline — the "found idea" highlight */}
        <line
          x1="176"
          y1="208"
          x2="240"
          y2="208"
          stroke="#2a4c3f"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* sketched bullets on the right page */}
        <g fill="#717974">
          <circle cx="324" cy="186" r="2" />
          <circle cx="324" cy="206" r="2" />
          <circle cx="324" cy="226" r="2" />
        </g>
        <g stroke="#c1c8c3" strokeWidth="1" opacity="0.7">
          <line x1="334" y1="186" x2="436" y2="186" />
          <line x1="334" y1="206" x2="424" y2="206" />
          <line x1="334" y1="226" x2="436" y2="226" />
        </g>

        {/* terracotta bookmark sticking up from the top */}
        <path
          d="M380 142 L 380 122 L 392 130 L 404 122 L 404 142 Z"
          fill="#613b38"
        />
      </g>

      {/* Fountain pen — diagonal across lower-right */}
      <g
        transform="rotate(28 360 380)"
        stroke="#2a4c3f"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* barrel */}
        <rect x="220" y="372" width="190" height="16" rx="8" fill="#2a4c3f" />
        {/* cap (lighter green) */}
        <rect x="392" y="370" width="58" height="20" rx="10" fill="#1f3a2e" stroke="#1f3a2e" />
        {/* nib */}
        <path
          d="M214 380 L 198 380 L 192 376 L 186 380 L 192 384 L 198 380"
          fill="#c1c8c3"
          stroke="#717974"
        />
        {/* clip on the cap */}
        <line x1="406" y1="376" x2="438" y2="376" stroke="#aacfbd" strokeWidth="1.4" />
        {/* tiny gold band where cap meets barrel */}
        <line x1="392" y1="380" x2="392" y2="380" />
      </g>

      {/* Single small dried leaf bottom-left */}
      <g
        stroke="#52634b"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M120 432 C 130 410, 156 396, 188 396" fill="none" />
        <ellipse cx="146" cy="412" rx="11" ry="5" fill="#cfe3c4" transform="rotate(-15 146 412)" />
        <ellipse cx="170" cy="402" rx="12" ry="5" fill="#cfe3c4" transform="rotate(-10 170 402)" />
      </g>
    </svg>
  );
}

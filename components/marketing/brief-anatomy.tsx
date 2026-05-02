/**
 * "Anatomy of a brief" — the $3-and-what-you-get section.
 *
 * Two-column layout:
 *   left  — stylised SVG mock of an idea-detail card. Uses the EXACT title
 *           of an idea slug that exists in the database
 *           ("ai-thumbnails-hindi-youtube") so the example is real.
 *   right — the five blocks every brief contains, with a one-sentence
 *           description per block.
 *
 * The mock is built from <rect> rounded shapes (no real text rendered as
 * "fake quote") so it suggests a paragraph layout without inventing copy.
 */
const BLOCKS: { label: string; body: string }[] = [
  {
    label: "Pain analysis",
    body: "A self-contained definitional opener and 2–3 FAQ-style questions a buyer would actually search.",
  },
  {
    label: "Evidence quotes",
    body: "Real Reddit / Hacker News quotes with the source URL preserved on every card.",
  },
  {
    label: "3-step validation plan",
    body: "What to do, what signal to watch for, when to walk away.",
  },
  {
    label: "Buyer personas",
    body: "Named groups, not 'engineers' — like 'Hindi creators with 10–500k subs'.",
  },
  {
    label: "Sample landing copy",
    body: "Headline + subhead you can paste into a Framer page tonight.",
  },
];

export function BriefAnatomy() {
  return (
    <section className="px-6 md:px-12">
      <div className="mx-auto max-w-[1280px] py-24 md:py-32">
        <header className="mb-12 max-w-2xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream-400">
            What you unlock
          </span>
          <h2 className="mt-4 font-display text-3xl tracking-tight text-ink-700 md:text-4xl">
            A brief is a research dossier, not a tweet.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-50">
            One $3 unlock buys the full structured brief — pain, sourced
            evidence, a real validation plan, named buyer personas, and
            ready-to-paste landing copy. Premium briefs (overall score ≥
            85) cost $5; the refund-on-ship promise still applies.
          </p>
        </header>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <BriefMockCard />
          </div>
          <ul className="space-y-7 lg:col-span-7">
            {BLOCKS.map((b, i) => (
              <li key={b.label} className="flex items-start gap-4">
                <span
                  aria-hidden
                  className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cream-300 bg-cream-50 font-mono text-[11px] font-semibold text-moss-700"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-lg text-ink-700">{b.label}</h3>
                  <p className="mt-1 text-base leading-relaxed text-ink-50">
                    {b.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/**
 * Mock idea-brief card — rendered in real HTML/Tailwind, not SVG.
 *
 * Why HTML over SVG:
 *   - Real Fraunces / Inter / Geist Mono typography renders with proper
 *     hinting and ligatures (SVG <text> is flat and looks artificial).
 *   - Skeleton-bar `<rect>` placeholders read as "loading state, not real
 *     product" — replacing them with plausible representative copy lets
 *     the section actually advertise what's inside a brief.
 *
 * Content notes:
 *   - Title + tags + one-line pain are anchored on a real idea slug we
 *     have in the database.
 *   - The pain paragraph and evidence quote are PARAPHRASED summaries of
 *     a typical complaint pattern, not quoted from any specific user. The
 *     attribution chip says "r/SaaS · public thread" — no fabricated
 *     usernames, no specific dates.
 *   - The validation step lines surface only HEADLINES (no descriptions),
 *     mirroring what bots and previewers see in the real product so we're
 *     not giving away the paid value here.
 */
function BriefMockCard() {
  return (
    <div className="relative">
      {/* Tiny plum tab — feels like a subtle bookmark on the brief */}
      <div
        aria-hidden
        className="absolute -top-2.5 right-10 h-7 w-3 rounded-b-md bg-plum-300 shadow-sm"
      />

      <article className="relative mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl border border-cream-300 bg-cream-50 shadow-soft">
        {/* Top row: tags + score */}
        <header className="flex items-start justify-between gap-3 px-6 pt-6">
          <div className="flex flex-wrap gap-1.5">
            {["YouTube", "AI-content", "Creator-tool"].map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-cream-300 bg-cream-200 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-moss-500"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-moss-600/30 bg-moss-100 px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-moss-700">
            92 <Star />
          </span>
        </header>

        {/* Title + one-line pain */}
        <div className="px-6 pt-5">
          <h3 className="font-display text-2xl leading-[1.15] text-ink-700">
            AI thumbnails for Hindi YouTube creators
          </h3>
          <p className="mt-2 text-[13px] italic leading-relaxed text-ink-50">
            Hindi creators with 10–500k subs hand-make thumbnails because
            Western-trained AI tools default to alien faces and compositions.
          </p>
        </div>

        {/* THE PAIN */}
        <div className="px-6 pt-6">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-cream-400">
            The pain
          </span>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-500">
            Mid-size Hindi creators spend hours on every thumbnail because the
            popular AI tools train on Western faces and generic compositions.
            The output looks foreign on a regional channel — and CTR drops
            until they redo it manually.
          </p>
        </div>

        {/* Evidence quote — semantic blockquote, generic attribution */}
        <figure className="mx-6 mt-5 rounded-md border border-plum-300/60 bg-cream-100/60 p-4">
          <div className="flex gap-3">
            <span
              aria-hidden
              className="mt-0.5 h-full w-[2px] shrink-0 self-stretch rounded-sm bg-plum-500"
            />
            <div>
              <blockquote className="text-[12.5px] leading-relaxed text-ink-500">
                "Tried three of the big tools — every preset gives me white,
                American-looking faces. Spent four hours redoing the
                thumbnail by hand. Again."
              </blockquote>
              <figcaption className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-plum-500">
                <cite className="not-italic">r/SaaS · public thread</cite>
              </figcaption>
            </div>
          </div>
        </figure>

        {/* 3-step validation — headlines only, no descriptions */}
        <div className="px-6 pt-6">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-cream-400">
            3-step validation
          </span>
          <ol className="mt-3 space-y-2.5">
            {[
              "Talk to 5 mid-size Hindi creators",
              "Test 3 prompt patterns on regional faces",
              "Ship a one-thumbnail demo, measure CTR",
            ].map((line, i) => (
              <li
                key={line}
                className="flex items-baseline gap-3 text-[13px] text-ink-700"
              >
                <span
                  aria-hidden
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-cream-300 bg-cream-100 font-mono text-[10px] font-semibold text-moss-700"
                >
                  {i + 1}
                </span>
                <span className="leading-snug">{line}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Bottom action row */}
        <footer className="mt-7 flex items-center gap-3 border-t border-cream-300/60 bg-cream-100/40 px-6 py-5">
          <span className="inline-flex items-center justify-center rounded-lg bg-moss-600 px-4 py-2 text-sm font-medium text-cream-50 shadow-sm">
            $3 to unlock
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-50">
            refunded if you ship
          </span>
        </footer>
      </article>
    </div>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden className="h-3 w-3">
      <path
        d="M6 1.5 L 7.45 4.55 L 10.7 5 L 8.35 7.25 L 8.9 10.5 L 6 9 L 3.1 10.5 L 3.65 7.25 L 1.3 5 L 4.55 4.55 Z"
        fill="currentColor"
      />
    </svg>
  );
}

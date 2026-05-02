/**
 * "We don't summarise threads. We process them." — five-stage pipeline.
 *
 * 5-up editorial grid where the STEP NUMBER is the typographic anchor
 * (Fraunces, oversized, low-opacity cream). The small glyph floats over
 * the number for a layered colophon feel — no connector line between
 * cards (we tried both a metro rail and a Lottie banner and both read
 * as wireframe / AI-generated; the calmer grid is what works here).
 *
 * Body copy intentionally omits crawl frequency / accept rate / vector
 * dimensions — those are internals.
 */

const STEPS: {
  number: string;
  title: string;
  body: string;
  Glyph: () => React.JSX.Element;
}[] = [
  {
    number: "01",
    title: "Crawl",
    body: "Pull the latest founder posts from Reddit and Hacker News on a regular cadence.",
    Glyph: RadarGlyph,
  },
  {
    number: "02",
    title: "Filter",
    body: "An LLM rejects noise. Only specific, repeatable pains move forward.",
    Glyph: FunnelGlyph,
  },
  {
    number: "03",
    title: "Embed",
    body: "Convert each accepted signal into a semantic vector we can reason over.",
    Glyph: EmbedGlyph,
  },
  {
    number: "04",
    title: "Cluster",
    body: "Group related pains. New ones become new ideas; close ones reinforce existing briefs.",
    Glyph: ClusterGlyph,
  },
  {
    number: "05",
    title: "Brief",
    body: "Generate a structured brief: pain, evidence, validation plan, landing copy.",
    Glyph: BriefGlyph,
  },
];

export function PipelineFlow() {
  return (
    <section className="px-6 md:px-12">
      <PipelineGlyphStyle />

      <div className="mx-auto max-w-[1280px] py-24 md:py-32">
        <header className="mb-14 max-w-2xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream-400">
            The pipeline
          </span>
          <h2 className="mt-5 font-display text-3xl tracking-tight text-ink-700 md:text-5xl">
            We don't summarise threads.
            <br className="hidden md:block" /> We process them.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-50 md:text-lg">
            Five stages turn a raw founder post into a paid idea brief.
            Each stage is deterministic and idempotent — the brief you read
            today comes from the freshest cluster of signals.
          </p>
        </header>

        <div className="rounded-2xl border border-cream-300 bg-cream-50 px-6 pb-14 pt-10 md:px-14 md:pb-20 md:pt-14">
          {/* 5-up grid on desktop, vertical stack on mobile. Step renders a
              <div> (not <li>) so the outer <li> wrapper here doesn't create
              the <li>-inside-<li> hydration error we had before. */}
          <ol className="grid grid-cols-1 gap-12 md:grid-cols-5 md:gap-6">
            {STEPS.map((s) => (
              <li key={s.number} className="relative">
                <Step {...s} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

// =================================================================== //
//  Step card — number-as-anchor, glyph beside it, body below          //
// =================================================================== //

function Step({
  number,
  title,
  body,
  Glyph,
}: {
  number: string;
  title: string;
  body: string;
  Glyph: () => React.JSX.Element;
}) {
  return (
    <div className="flex flex-col">
      {/* Big serif step number behind the glyph — design anchor. The Glyph
          floats over the bottom-right of the number for an editorial layered
          effect, instead of the icon-in-a-frame look. */}
      <div className="relative mb-6 flex h-[120px] items-center">
        <span
          aria-hidden
          className="font-display text-[88px] font-semibold leading-none tracking-tight text-cream-300/70 md:text-[104px]"
        >
          {number}
        </span>
        <span className="absolute right-2 top-2 md:right-4">
          <Glyph />
        </span>
      </div>

      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream-400">
        Step {number}
      </span>
      <h3 className="mt-1.5 font-display text-2xl text-ink-700">{title}</h3>
      <p className="mt-3 text-[14px] leading-relaxed text-ink-50">{body}</p>
    </div>
  );
}

// =================================================================== //
//  Glyphs — 64×64 viewBox, single-weight strokes + ambient micro-anim //
//                                                                      //
//  Animations cycle slowly with low amplitude. Stop on prefers-reduced-//
//  motion. Each glyph is small (~52px rendered) since the big serif    //
//  step number is now the dominant visual element.                     //
// =================================================================== //

function PipelineGlyphStyle() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
@keyframes pannly-radar-sweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes pannly-funnel-drop {
  0%   { transform: translateY(-12px); opacity: 0; }
  20%  { opacity: 1; }
  80%  { opacity: 1; }
  100% { transform: translateY(40px); opacity: 0; }
}
@keyframes pannly-vector-pulse {
  0%, 100% { opacity: 0.4; }
  50%      { opacity: 1; }
}
@keyframes pannly-cluster-breathe {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.04); }
}
@keyframes pannly-brief-line {
  0%   { stroke-dashoffset: 60; }
  60%  { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 0; }
}

.pannly-radar-arm   { transform-origin: 32px 32px; animation: pannly-radar-sweep 9s linear infinite; }
.pannly-funnel-dot  { animation: pannly-funnel-drop 3s ease-in infinite; }
.pannly-vector-edge { animation: pannly-vector-pulse 4s ease-in-out infinite; }
.pannly-cluster     { transform-origin: 32px 32px; animation: pannly-cluster-breathe 5s ease-in-out infinite; }
.pannly-brief-line  { stroke-dasharray: 60; animation: pannly-brief-line 6s ease-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .pannly-radar-arm,
  .pannly-funnel-dot,
  .pannly-vector-edge,
  .pannly-cluster,
  .pannly-brief-line { animation: none !important; }
}
`,
      }}
    />
  );
}

function RadarGlyph() {
  return (
    <svg viewBox="0 0 64 64" className="h-13 w-13" aria-hidden style={{ height: 52, width: 52 }}>
      <g fill="none" stroke="#2a4c3f" strokeWidth="1.4" strokeLinecap="round">
        <circle cx="32" cy="32" r="24" opacity="0.3" />
        <circle cx="32" cy="32" r="16" opacity="0.5" />
        <circle cx="32" cy="32" r="8" opacity="0.85" />
        <g className="pannly-radar-arm">
          <line x1="32" y1="32" x2="54" y2="16" strokeWidth="1.5" />
          <circle cx="54" cy="16" r="1.8" fill="#2a4c3f" stroke="none" />
        </g>
      </g>
      <circle cx="32" cy="32" r="1.6" fill="#2a4c3f" />
    </svg>
  );
}

function FunnelGlyph() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden style={{ height: 52, width: 52 }}>
      <g
        fill="none"
        stroke="#2a4c3f"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 14 H 53 L 40 33 V 48 L 27 52 V 33 Z" />
      </g>
      <g fill="#2a4c3f" opacity="0.5">
        <circle cx="18" cy="11" r="1.4" />
        <circle cx="26" cy="9" r="1.4" />
        <circle cx="35" cy="10" r="1.4" />
        <circle cx="44" cy="11" r="1.4" />
      </g>
      <circle className="pannly-funnel-dot" cx="33" cy="16" r="1.8" fill="#613b38" />
    </svg>
  );
}

function EmbedGlyph() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden style={{ height: 52, width: 52 }}>
      <g
        stroke="#2a4c3f"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      >
        <line className="pannly-vector-edge" x1="17" y1="17" x2="46" y2="25" />
        <line
          className="pannly-vector-edge"
          x1="46"
          y1="25"
          x2="25"
          y2="46"
          style={{ animationDelay: "1s" }}
        />
        <line
          className="pannly-vector-edge"
          x1="25"
          y1="46"
          x2="17"
          y2="17"
          style={{ animationDelay: "2s" }}
        />
        <line
          className="pannly-vector-edge"
          x1="46"
          y1="25"
          x2="50"
          y2="46"
          style={{ animationDelay: "0.5s" }}
          opacity="0.5"
        />
      </g>
      <g fill="#2a4c3f">
        <circle cx="17" cy="17" r="2.6" />
        <circle cx="46" cy="25" r="2.6" />
        <circle cx="25" cy="46" r="2.6" />
        <circle cx="50" cy="46" r="2" opacity="0.7" />
      </g>
    </svg>
  );
}

function ClusterGlyph() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden style={{ height: 52, width: 52 }}>
      <g className="pannly-cluster">
        <circle cx="25" cy="27" r="13" fill="#cfe3c4" stroke="#2a4c3f" strokeWidth="1.4" />
        <circle cx="40" cy="27" r="11" fill="#b9ccae" stroke="#2a4c3f" strokeWidth="1.4" opacity="0.85" />
        <circle cx="32" cy="40" r="11" fill="#d7e1db" stroke="#2a4c3f" strokeWidth="1.4" opacity="0.85" />
      </g>
      <circle cx="32" cy="32" r="1.5" fill="#2a4c3f" />
    </svg>
  );
}

function BriefGlyph() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden style={{ height: 52, width: 52 }}>
      <g
        fill="#faf9f7"
        stroke="#2a4c3f"
        strokeWidth="1.4"
        strokeLinejoin="round"
      >
        <path d="M17 9 H 40 L 48 17 V 54 H 17 Z" />
      </g>
      <path
        d="M40 9 V 17 H 48"
        fill="none"
        stroke="#2a4c3f"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <g
        stroke="#2a4c3f"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      >
        <line className="pannly-brief-line" x1="22" y1="27" x2="43" y2="27" />
        <line
          className="pannly-brief-line"
          x1="22"
          y1="34"
          x2="40"
          y2="34"
          style={{ animationDelay: "1s" }}
        />
        <line
          className="pannly-brief-line"
          x1="22"
          y1="41"
          x2="36"
          y2="41"
          style={{ animationDelay: "2s" }}
        />
      </g>
      <circle cx="40" cy="48" r="5" fill="#613b38" />
      <text
        x="40"
        y="50.5"
        textAnchor="middle"
        fontFamily="Geist Mono, ui-monospace, monospace"
        fontSize="6.5"
        fontWeight="700"
        fill="#faf9f7"
      >
        $
      </text>
    </svg>
  );
}

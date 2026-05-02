import type { Metadata } from "next";
import { MessageSquare, Lock, Infinity as InfinityIcon } from "lucide-react";

import { HowItWorksStep } from "@/components/marketing/how-it-works-step";
import { TrustStrip } from "@/components/marketing/trust-strip";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "From a Reddit complaint to a refunded build — the architectural process behind every Pannly brief.",
  alternates: { canonical: "/how-it-works" },
  openGraph: { url: "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <div className="px-6 md:px-12 flex flex-col gap-16 py-12 md:py-16">
      {/* Hero */}
      <section className="max-w-4xl pb-8 pt-12">
        <h1 className="mb-6 font-display text-4xl font-medium tracking-tight text-moss-600 md:text-5xl">
          From a Reddit complaint to a refunded build.
        </h1>
        <p className="max-w-2xl text-lg text-ink-50/80">
          The architectural process behind every Pannly brief. We dig through the
          noise to find structural problems worth solving, then turn raw frustration
          into actionable blueprints.
        </p>
      </section>

      <div className="flex flex-col border-t border-cream-300">
        {/* Step 1 — We listen */}
        <HowItWorksStep
          number="01"
          title="We listen"
          body="Every 30 minutes we crawl r/SaaS, r/indiehackers, r/Entrepreneur, r/SideProject, r/microsaas, r/SaaS_Ideas, plus Ask HN and Show HN. We don't look for ideas — we look for recurring complaints, workarounds, and 'why isn't there a…' moments."
        >
          <ListenDiagram />
        </HowItWorksStep>

        {/* Step 2 — We score */}
        <HowItWorksStep
          number="02"
          title="We score"
          body="Every raw signal goes through three scores: how strong the demand is, how reachable the buyer is, and how weak the existing competition is. The weighted total is what you see on each idea card."
        >
          <ScoreDiagram />
        </HowItWorksStep>

        {/* Step 3 — We write */}
        <HowItWorksStep
          number="03"
          title="We write"
          body="Each brief is a clinical document: the pain itself, 3–5 quoted excerpts as evidence, the persona who buys it, existing competitors and their prices, the wedge they're missing, sample landing copy, a 3-step validation plan, and distribution channels."
        >
          <WriteDiagram />
        </HowItWorksStep>

        {/* Step 4 — You unlock */}
        <HowItWorksStep
          number="04"
          title="You unlock"
          body="Pay $3 to unlock a single brief, or subscribe to Pro for $15/mo and unlock anything in the archive. No hard sell — most users start with one brief, and upgrade when they hit five in a month."
        >
          <UnlockDiagram />
        </HowItWorksStep>

        {/* Step 5 — You ship */}
        <HowItWorksStep
          number="05"
          title="You ship"
          body="You have 30 days to build and launch. A working URL with a real signup counts — even just a landing page. The constraint forces focus, and auto-validation does the rest."
        >
          <ShipDiagram />
        </HowItWorksStep>

        {/* Step 6 — We refund */}
        <HowItWorksStep
          number="06"
          title="We refund"
          body="Submit the live URL on your dashboard. If it passes auto-validation (real domain, registered after unlock, real content), we refund the $3 to your original card via Dodo within 7 days, and your build lands in the public gallery."
          isLast
        >
          <RefundDiagram />
        </HowItWorksStep>
      </div>

      <TrustStrip />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Step diagrams — small, sparse, editorial                          */
/* ---------------------------------------------------------------- */

function ListenDiagram() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-cream-300 bg-cream-50/60 p-6">
      {/* a muted post in the background */}
      <div className="border-b border-cream-300 pb-3 opacity-60">
        <div className="mb-2 h-2 w-16 rounded bg-cream-300" />
        <div className="mb-1 h-2 w-full rounded bg-cream-300" />
        <div className="h-2 w-3/4 rounded bg-cream-300" />
      </div>

      {/* the captured one — highlighted */}
      <div className="border-b border-cream-300 pb-3">
        <div className="mb-2 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-plum-500" strokeWidth={1.75} aria-hidden />
          <div className="h-2 w-20 rounded bg-plum-300/60" />
        </div>
        <p className="text-sm text-ink-700">
          &ldquo;I&apos;m spending four hours a week manually reconciling these specific
          Stripe events…&rdquo;
        </p>
      </div>

      <div className="opacity-50">
        <div className="mb-2 h-2 w-24 rounded bg-cream-300" />
        <div className="h-2 w-full rounded bg-cream-300" />
      </div>
    </div>
  );
}

function ScoreDiagram() {
  const rows = [
    { label: "Demand", value: 8.5, pct: 85 },
    { label: "Reach", value: 6.0, pct: 60 },
    { label: "Competition", value: 4.0, pct: 40 },
  ];

  return (
    <div className="flex flex-col gap-6 py-2">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-4">
          <div className="w-24 font-mono text-xs font-semibold uppercase tracking-[0.05em] text-ink-50/70">
            {r.label}
          </div>
          <div className="h-1 flex-grow overflow-hidden rounded-full bg-cream-200">
            <div className="h-full bg-moss-600" style={{ width: `${r.pct}%` }} />
          </div>
          <div className="w-8 text-right font-mono text-sm tracking-[0.05em] text-ink-700">
            {r.value.toFixed(1)}
          </div>
        </div>
      ))}
    </div>
  );
}

function WriteDiagram() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2 rounded-lg border border-cream-300 bg-cream-50 p-4">
        <div className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.05em] text-plum-500">
          Pain Point
        </div>
        <div className="mb-2 h-2 w-full rounded bg-cream-200" />
        <div className="h-2 w-2/3 rounded bg-cream-200" />
      </div>
      <div className="col-span-1 rounded-lg border border-cream-300 bg-cream-50 p-4">
        <div className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.05em] text-sage-300">
          Evidence
        </div>
        <div className="flex gap-2">
          <div className="h-4 w-4 rounded bg-cream-200" />
          <div className="h-4 w-4 rounded bg-cream-200" />
        </div>
      </div>
      <div className="col-span-1 rounded-lg border border-cream-300 bg-cream-50 p-4">
        <div className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.05em] text-sage-300">
          Persona
        </div>
        <div className="h-2 w-3/4 rounded bg-cream-200" />
      </div>
    </div>
  );
}

function UnlockDiagram() {
  return (
    <div className="flex gap-4">
      <div className="flex flex-1 flex-col justify-between rounded-xl border border-cream-300 bg-cream-50/60 p-6">
        <div>
          <div className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.05em] text-sage-300">
            Single brief
          </div>
          <div className="font-display text-4xl text-ink-700 md:text-5xl">$3</div>
        </div>
        <div className="mt-4 border-t border-cream-300 pt-4">
          <Lock className="h-5 w-5 text-sage-300" strokeWidth={1.75} aria-hidden />
        </div>
      </div>

      <div className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-xl border border-moss-600 bg-cream-50 p-6">
        <span className="absolute right-0 top-0 rounded-bl-lg bg-moss-600 px-2 py-1 font-mono text-[10px] font-semibold tracking-[0.08em] text-cream-50">
          PRO
        </span>
        <div>
          <div className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.05em] text-moss-600">
            Unlimited archive
          </div>
          <div className="font-display text-4xl text-moss-700 md:text-5xl">
            $15
            <span className="text-base font-normal">/mo</span>
          </div>
        </div>
        <div className="mt-4 border-t border-cream-300 pt-4">
          <InfinityIcon className="h-5 w-5 text-moss-600" strokeWidth={1.75} aria-hidden />
        </div>
      </div>
    </div>
  );
}

function ShipDiagram() {
  const points = [
    { label: "Day 0: Unlock", state: "filled" as const },
    { label: "Day 30: Build", state: "outlined" as const },
    { label: "Day 60: Ship", state: "tertiary" as const },
  ];

  return (
    <div className="flex h-full items-center">
      <div className="relative w-full py-8">
        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-cream-300" />
        <div className="relative z-10 flex justify-between">
          {points.map((p) => (
            <div key={p.label} className="flex flex-col items-center gap-2">
              <span
                className={cnDot(p.state)}
                aria-hidden
              />
              <span
                className={
                  p.state === "tertiary"
                    ? "font-mono text-[10px] tracking-[0.05em] text-plum-500"
                    : "font-mono text-[10px] tracking-[0.05em] text-ink-50/70"
                }
              >
                {p.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function cnDot(state: "filled" | "outlined" | "tertiary") {
  // 4-px cream "outline" makes the dot read as a node on the line.
  const base = "block h-3 w-3 rounded-full ring-4 ring-cream-100";
  if (state === "filled") return `${base} bg-moss-600`;
  if (state === "outlined") return `${base} border-2 border-moss-600 bg-cream-100`;
  return `${base} bg-plum-500`;
}

function RefundDiagram() {
  return (
    <div className="ml-auto max-w-xs rounded border border-dashed border-cream-300 bg-cream-50 p-6 font-mono text-sm tracking-[0.05em] text-ink-50/80 shadow-soft">
      <div className="mb-4 border-b border-dashed border-cream-300 pb-4 text-center">
        <div className="mb-1 font-display text-2xl text-moss-600">pannly</div>
        <div className="text-[10px] uppercase tracking-[0.1em]">Refund receipt</div>
      </div>
      <div className="mb-2 flex justify-between">
        <span>Original charge</span>
        <span>$3.00</span>
      </div>
      <div className="mb-4 flex justify-between text-plum-500">
        <span>Ship credit</span>
        <span>-$3.00</span>
      </div>
      <div className="flex justify-between border-t border-dashed border-cream-300 pt-4 font-semibold text-ink-700">
        <span>Total due</span>
        <span>$0.00</span>
      </div>
    </div>
  );
}

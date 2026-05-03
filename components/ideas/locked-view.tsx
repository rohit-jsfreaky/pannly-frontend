"use client";

import type { Route } from "next";
import { CheckCircle2, Lock, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { CountersStrip } from "@/components/ideas/counters-strip";
import { PainSection } from "@/components/ideas/pain-section";
import { TagsRow } from "@/components/ideas/tags-row";
import { ScoreBadge } from "@/components/feed/score-badge";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import { startIdeaUnlock } from "@/lib/api/checkout";
import type { LockedIdeaResponse } from "@/lib/api/ideas";
import { useAuth } from "@/lib/auth-context";
import { formatMoney } from "@/lib/format";

interface Props {
  data: LockedIdeaResponse;
}

const FIRST_MOVER_THRESHOLD = 10;

/**
 * Locked variant — surface only what's needed to convince someone the idea
 * is real, never enough to act on it without paying.
 *
 * Backend-enforced cap: `preview.pain_md` is a 2-sentence teaser. Evidence
 * quote text never reaches the wire — we get a count + distinct host names.
 *
 * Visual flow:
 *   - header (tags / score / title / one-line pain / counters / CTAs)
 *   - capped pain teaser
 *   - "what's inside the brief" panel = source-count line + named hidden
 *     sections + the unlock CTAs
 */
export function LockedView({ data }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const { idea, preview, locked_summary } = data;
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onUnlock = async () => {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(`/ideas/${idea.slug}`)}` as Route);
      return;
    }
    setUnlocking(true);
    setError(null);
    try {
      const res = await startIdeaUnlock(idea.slug);
      if (res.checkout_url) {
        window.location.href = res.checkout_url;
        return;
      }
      setError("Couldn't start checkout. Try again.");
    } catch (err) {
      if (err instanceof ApiError && err.code === "ALREADY_UNLOCKED") {
        router.refresh();
        return;
      }
      setError(err instanceof ApiError ? err.message : "Couldn't start checkout. Try again.");
    } finally {
      setUnlocking(false);
    }
  };

  const onPro = () => {
    if (!user) {
      router.push("/login?next=/pricing" as Route);
      return;
    }
    router.push("/pricing" as Route);
  };

  const firstMoverSlotsLeft = Math.max(FIRST_MOVER_THRESHOLD - idea.unlock_count, 0);

  return (
    <article className="mx-auto max-w-3xl">
      {/* Header */}
      <header className="mb-12">
        <div className="mb-6 flex items-start justify-between gap-4">
          <TagsRow tags={idea.tags} />
          <ScoreBadge score={idea.overall_score} kind={idea.score_kind} />
        </div>

        <h1 className="mb-6 font-display text-4xl text-ink-700 md:text-5xl">{idea.title}</h1>
        {idea.one_line_pain ? (
          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-ink-50">
            {idea.one_line_pain}
          </p>
        ) : null}

        <CountersStrip
          unlocked={idea.unlock_count}
          building={idea.building_count}
          shipped={idea.shipped_count}
          className="mb-3"
        />

        {/* Counter interpretation — only render when there's a story to tell.
            If shipped > 0, the completion-rate framing is more persuasive than
            the raw numbers above. Otherwise we surface the staked-money line
            so the indie hacker reads the counters as commitment, not vanity. */}
        {idea.shipped_count > 0 ? (
          <p className="mb-8 text-sm leading-relaxed text-ink-50">
            <span className="font-mono tabular-nums text-ink-700">
              {idea.unlock_count}
            </span>{" "}
            people staked{" "}
            <span className="font-mono tabular-nums">
              {formatMoney(idea.unlock_price_cents)}
            </span>{" "}
            on this.{" "}
            <span className="font-mono tabular-nums text-moss-700">
              {idea.shipped_count}
            </span>{" "}
            shipped and got refunded.
          </p>
        ) : idea.unlock_count > 0 ? (
          <p className="mb-8 text-sm leading-relaxed text-ink-50">
            <span className="font-mono tabular-nums text-ink-700">
              {idea.unlock_count}
            </span>{" "}
            {idea.unlock_count === 1 ? "person has" : "people have"} staked{" "}
            <span className="font-mono tabular-nums">
              {formatMoney(idea.unlock_price_cents)}
            </span>{" "}
            on this so far.
          </p>
        ) : (
          <div className="mb-8" />
        )}

        {/* Single primary action above the teaser. The Pro alternative lives
            inside the UnlockPanel below — surfacing both here reads as
            desperate to a suspicious indie hacker. */}
        <div className="flex flex-col gap-2">
          <Button onClick={onUnlock} loading={unlocking} size="lg" className="self-start">
            <Lock className="h-4 w-4" strokeWidth={2} aria-hidden />
            Unlock for {formatMoney(idea.unlock_price_cents)}
          </Button>
          <p className="font-mono text-xs uppercase tracking-wider text-cream-400">
            Refunded automatically if you ship within 30 days
          </p>
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-4 rounded-md border border-error/30 bg-error/10 px-3 py-2 text-sm text-error"
          >
            {error}
          </p>
        ) : null}
      </header>

      {/* Pain teaser. Already capped server-side to ~40 words ending in "…". */}
      <section className="mb-12">
        <PainSection pain={preview.pain_md} />
      </section>

      {/* Inside the brief — single panel, no fade trick. We are NOT showing a
          fake "more here" preview anymore — the user reads the teaser, then
          this panel sells what's behind the wall. */}
      <UnlockPanel
        evidenceCount={preview.evidence_count}
        evidenceSources={preview.evidence_sources}
        hiddenTitles={locked_summary.hidden_section_titles}
        firstMoverSlotsLeft={firstMoverSlotsLeft}
        unlockPriceCents={idea.unlock_price_cents}
        unlocking={unlocking}
        onUnlock={onUnlock}
        onPro={onPro}
      />
    </article>
  );
}

// =================================================================== //
//  Unlock panel                                                        //
// =================================================================== //

interface PanelProps {
  evidenceCount: number;
  evidenceSources: string[];
  hiddenTitles: string[];
  firstMoverSlotsLeft: number;
  unlockPriceCents: number;
  unlocking: boolean;
  onUnlock: () => void;
  onPro: () => void;
}

function UnlockPanel({
  evidenceCount,
  evidenceSources,
  hiddenTitles,
  firstMoverSlotsLeft,
  unlockPriceCents,
  unlocking,
  onUnlock,
  onPro,
}: PanelProps) {
  return (
    <section
      aria-labelledby="unlock-panel-heading"
      className="rounded-2xl border border-cream-300 bg-cream-50 p-8 shadow-soft md:p-12"
    >
      <div className="mb-6 flex items-start gap-3">
        <span
          aria-hidden
          className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-moss-100"
        >
          <Lock className="h-4 w-4 text-moss-600" strokeWidth={2} />
        </span>
        <div>
          <h2 id="unlock-panel-heading" className="font-display text-3xl text-ink-700">
            What's inside the brief.
          </h2>
          <p className="mt-2 text-base leading-relaxed text-ink-50">
            The pain above is the teaser. Everything below is what you stake $3 to read.
          </p>
        </div>
      </div>

      {/* Source-count line — the proof becomes a metric, not text you can read for free. */}
      {evidenceCount > 0 ? (
        <p className="mb-6 rounded-lg border border-cream-300 bg-cream-100/60 px-4 py-3 text-sm text-ink-500">
          <span className="font-mono font-semibold text-moss-700">
            {evidenceCount}
          </span>{" "}
          evidence quote{evidenceCount === 1 ? "" : "s"} with source URLs
          {evidenceSources.length > 0 ? (
            <>
              {" "}
              from{" "}
              <span className="font-mono text-ink-700">
                {evidenceSources.join(", ")}
              </span>
            </>
          ) : null}
          .
        </p>
      ) : null}

      {/* Named hidden sections — desire builder, not a generic "4 sections hidden". */}
      {hiddenTitles.length > 0 ? (
        <ul className="mb-8 space-y-3">
          {hiddenTitles.map((title) => (
            <li key={title} className="flex items-start gap-3 text-base leading-snug text-ink-700">
              <CheckCircle2
                className="mt-0.5 h-5 w-5 shrink-0 text-moss-600"
                strokeWidth={2}
                aria-hidden
              />
              <span>{title}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {/* First-mover scarcity — only render when slots actually exist. */}
      {firstMoverSlotsLeft > 0 ? (
        <div className="mb-6 flex items-center gap-2 rounded-md border border-plum-300 bg-plum-100/40 px-3 py-2">
          <Sparkles className="h-4 w-4 text-plum-700" strokeWidth={2} aria-hidden />
          <p className="font-mono text-xs uppercase tracking-wider text-plum-700">
            <span className="tabular-nums">{firstMoverSlotsLeft}</span> first-mover slot
            {firstMoverSlotsLeft === 1 ? "" : "s"} left · bonus material included
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button block size="lg" loading={unlocking} onClick={onUnlock}>
          Unlock for {formatMoney(unlockPriceCents)}
        </Button>
        <Button block size="lg" variant="secondary" onClick={onPro}>
          Get unlimited with Pro
        </Button>
      </div>
    </section>
  );
}

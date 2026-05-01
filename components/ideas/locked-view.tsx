"use client";

import type { Route } from "next";
import { Crown, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { CountersStrip } from "@/components/ideas/counters-strip";
import { EvidenceCards } from "@/components/ideas/evidence-cards";
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

/**
 * Locked variant — same content shape as unlocked, but truncated:
 *   - Pain section is fully visible (it's the hook)
 *   - One evidence quote teaser
 *   - Then the fade-into-paywall pattern, no validation plan / landing copy /
 *     buyer personas leaked
 *
 * Both CTAs (Unlock + Pro) trigger checkouts via the same auth-aware path:
 *   - logged out → /login?next=/ideas/{slug}
 *   - logged in  → POST checkout endpoint, hard-redirect to checkout_url
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

  const previewQuotes = preview.evidence_preview ? [preview.evidence_preview] : [];

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
          className="mb-8"
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={onUnlock} loading={unlocking} size="lg">
            <Lock className="h-4 w-4" strokeWidth={2} aria-hidden />
            Unlock for {formatMoney(idea.unlock_price_cents)}
          </Button>
          <Button onClick={onPro} variant="secondary" size="lg">
            <Crown className="h-4 w-4" strokeWidth={2} aria-hidden />
            Pro: unlimited unlocks · $15/mo
          </Button>
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

      {/* Free pain section is fully visible — it's the hook. */}
      <section className="mb-12">
        <PainSection pain={preview.pain_md} />
      </section>

      {/* Locked evidence section + overlay paywall card. The card is absolutely
          positioned over the fade so the user reads the teaser quote, sees the
          fade, then lands on the paywall — exactly the design's flow. */}
      <div className="relative border-t border-cream-300 pt-8">
        <section className="space-y-6">
          <EvidenceCards quotes={previewQuotes} heading="Evidence & Market Signals" />
          {/* Faded teaser paragraph — hints there's more market analysis below. */}
          <p className="px-1 text-base leading-relaxed text-ink-50 opacity-60">
            Furthermore, looking at the search volume for adjacent terms and the
            comment activity in the original thread, there is a clear upward
            trend indicating that existing tools are…
          </p>
        </section>

        {/* Soft cream fade — eats the bottom of the teaser paragraph. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[420px] bg-gradient-to-t from-cream-100 via-cream-100/95 to-transparent"
        />

        {/* Paywall card sits on top of the fade. */}
        <div className="relative z-20 mt-[-160px] flex justify-center pb-8">
          <PaywallCard
            locked={locked_summary}
            unlockPriceCents={idea.unlock_price_cents}
            unlocking={unlocking}
            onUnlock={onUnlock}
            onPro={onPro}
          />
        </div>

        {/* Spacer so the absolutely-positioned fade doesn't overflow into
            anything below (e.g. the related-rail rendered by the page). */}
        <div className="h-12" />
      </div>
    </article>
  );
}

interface PaywallProps {
  locked: LockedIdeaResponse["locked_summary"];
  unlockPriceCents: number;
  unlocking: boolean;
  onUnlock: () => void;
  onPro: () => void;
}

function PaywallCard({ locked, unlockPriceCents, unlocking, onUnlock, onPro }: PaywallProps) {
  return (
    <div className="w-full max-w-md rounded-xl border border-cream-300 bg-cream-50 p-8 text-center shadow-soft">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-moss-100">
        <Lock className="h-5 w-5 text-moss-600" strokeWidth={2} aria-hidden />
      </div>
      <h3 className="mb-3 font-display text-2xl text-ink-700">Unlock the rest of this brief.</h3>
      <p className="mb-6 px-2 text-sm text-ink-50">
        Access the full market analysis, targeted buyer profiles, the 3-step
        validation plan, and a ready-to-ship landing-page copy block.
      </p>
      <div className="mb-6 flex items-center justify-center gap-2 border-y border-cream-300/60 py-3 font-mono text-xs uppercase tracking-wider text-cream-400">
        <span className="tabular-nums text-ink-50">
          {locked.hidden_word_count.toLocaleString()} words
        </span>
        <span>·</span>
        <span className="tabular-nums text-ink-50">
          {locked.hidden_section_count} sections hidden
        </span>
      </div>
      <div className="flex flex-col gap-3">
        <Button block size="lg" loading={unlocking} onClick={onUnlock}>
          Unlock for {formatMoney(unlockPriceCents)}
        </Button>
        <Button block size="lg" variant="secondary" onClick={onPro}>
          Get unlimited with Pro
        </Button>
      </div>
    </div>
  );
}

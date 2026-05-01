import { ActionRow } from "@/components/ideas/action-row";
import { BuildersCard } from "@/components/ideas/builders-card";
import { ClaimWithProCta } from "@/components/ideas/claim-with-pro-cta";
import { EvidenceCards } from "@/components/ideas/evidence-cards";
import { FirstMoverCard } from "@/components/ideas/first-mover-card";
import { LandingCopyCard } from "@/components/ideas/landing-copy-card";
import { PainSection } from "@/components/ideas/pain-section";
import { StateChips } from "@/components/ideas/state-chips";
import { ValidationPlan } from "@/components/ideas/validation-plan";
import { WhoBuysCard } from "@/components/ideas/who-buys-card";
import type { UnlockedIdeaResponse } from "@/lib/api/ideas";

interface Props {
  data: UnlockedIdeaResponse;
}

/**
 * Unlocked variant. Two header shapes:
 *   - Per-idea purchase (`unlock_state` set) — "you've unlocked this" pill,
 *     state chips, action row, first-mover sidebar.
 *   - Subscription access (`unlock_state` null) — "Unlocked with Pro" pill,
 *     no state chips / no action row / no first-mover. Just the brief +
 *     builders sidebar.
 *
 * Layout matches the design exactly:
 *   - left  (8 cols): Pain → Evidence → 3-step validation plan → Sample landing copy
 *   - right (4 cols): First-mover bonus → Who buys this → How others are doing
 */
export function UnlockedView({ data }: Props) {
  const { idea, brief, unlock_state, builders } = data;
  const viaSubscription = unlock_state === null;

  return (
    <article className="mx-auto max-w-[1100px]">
      {/* Header */}
      <header className="mb-12 max-w-3xl">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span
            className={
              viaSubscription
                ? "rounded-md border border-moss-600/20 bg-moss-100 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-moss-700"
                : "rounded-md border border-plum-300 bg-plum-100 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-plum-700"
            }
          >
            {viaSubscription ? "Unlocked with Pro" : "You've unlocked this"}
          </span>
          {idea.tags.length ? (
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-cream-400">
              {idea.tags.slice(0, 3).join(" · ")}
            </span>
          ) : null}
        </div>

        <h1 className="mb-6 font-display text-4xl text-ink-700 md:text-5xl">{idea.title}</h1>
        {idea.one_line_pain ? (
          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-ink-50">
            {idea.one_line_pain}
          </p>
        ) : null}

        {unlock_state ? (
          <>
            <div className="mb-8">
              <StateChips state={unlock_state} />
            </div>
            <ActionRow unlockId={unlock_state.unlock_id} state={unlock_state.state} />
          </>
        ) : viaSubscription ? (
          // Pro user has access to everything but hasn't claimed this idea yet.
          // One-click claim creates the Unlock row → page refresh shows the
          // full chips + action row.
          <ClaimWithProCta slug={idea.slug} />
        ) : null}
      </header>

      {/* Brief grid */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="space-y-12 lg:col-span-8">
          <PainSection pain={brief.pain_md} />
          <EvidenceCards quotes={brief.evidence_quotes} />
          <ValidationPlan steps={brief.validation_steps} />
          <LandingCopyCard copy={brief.landing_copy} />
        </div>

        <div className="space-y-6 lg:col-span-4">
          {unlock_state?.is_first_mover ? (
            <FirstMoverCard
              rank={unlock_state.first_mover_rank}
              buildWindowDays={unlock_state.build_window_days}
            />
          ) : null}
          <WhoBuysCard personas={brief.buyer_personas} />
          <BuildersCard builders={builders} />
        </div>
      </div>
    </article>
  );
}

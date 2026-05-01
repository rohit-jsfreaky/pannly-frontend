import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ChecklistPanel } from "@/components/builds/checklist-panel";
import { IdeaPledgeCard } from "@/components/builds/idea-pledge-card";
import { SubmitForm } from "@/components/builds/submit-form";
import { ApiError } from "@/lib/api-client";
import { fetchDraft } from "@/lib/api/builds";

export const metadata: Metadata = {
  title: "Submit a build · Pannly",
  description:
    "Show us what you shipped. Manual review within 24–48 hours; refund clears once an admin approves.",
};

/**
 * /unlocks/[id]/submit
 *
 * One backend roundtrip on mount:
 *   GET /v1/unlocks/{id}/draft → DraftView (idea info + saved fields + state)
 *
 * Auth is enforced by the (app) layout; no need to re-check here. The draft
 * endpoint returns 404 for unlocks that don't belong to this user, which we
 * surface as Next's notFound page.
 *
 * Already-submitted unlocks render the success screen directly — handled
 * inside <SubmitForm> based on `draft.state`.
 */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const c = await cookies();
  const cookieHeader = c
    .getAll()
    .map((entry) => `${entry.name}=${entry.value}`)
    .join("; ");

  let draft;
  try {
    draft = await fetchDraft(id, { cookieHeader });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const isApprovedTerminal =
    draft.state === "approved" || draft.state === "refunded";

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 px-6 pt-12 pb-24 md:px-12 lg:flex-row lg:gap-16">
      <div className="w-full space-y-12 lg:w-2/3">
        <header className="space-y-4">
          <h1 className="font-display text-4xl tracking-tight text-ink-700 md:text-5xl">
            Show us what you shipped.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-ink-50">
            Manual review within 24–48 hours. The $3 refund clears once an admin
            approves your build.
          </p>
        </header>

        <IdeaPledgeCard title={draft.idea_title} pain={draft.idea_pain} />

        {isApprovedTerminal ? (
          <ApprovedNotice ideaSlug={draft.idea_slug} state={draft.state} />
        ) : draft.state === "rejected" ? (
          <RejectedNotice reviewNotes={draft.review_notes} />
        ) : (
          <SubmitForm draft={draft} />
        )}
      </div>

      <div className="w-full lg:w-1/3">
        <ChecklistPanel />
      </div>
    </div>
  );
}

function ApprovedNotice({ ideaSlug, state }: { ideaSlug: string; state: string }) {
  return (
    <section className="rounded-2xl border border-moss-600/30 bg-moss-100/60 p-8">
      <h2 className="mb-2 font-display text-2xl text-moss-700">
        {state === "refunded" ? "Refunded — you're on the gallery." : "Approved."}
      </h2>
      <p className="mb-6 text-base leading-relaxed text-ink-700">
        Nothing left to do here. {state === "refunded"
          ? "The $3 has cleared."
          : "Refund is processing — should clear within a few business days."}
      </p>
      <Link
        href={`/ideas/${encodeURIComponent(ideaSlug)}` as Route}
        className="inline-flex items-center justify-center rounded-full bg-moss-600 px-6 py-2.5 text-sm font-medium text-cream-50 transition-opacity hover:opacity-90"
      >
        Back to brief
      </Link>
    </section>
  );
}

function RejectedNotice({ reviewNotes }: { reviewNotes: string | null }) {
  return (
    <section className="rounded-2xl border border-error/30 bg-plum-100/40 p-8">
      <h2 className="mb-2 font-display text-2xl text-plum-700">
        This submission was rejected.
      </h2>
      {reviewNotes ? (
        <blockquote className="mb-4 border-l-2 border-plum-300 pl-4 text-base italic leading-relaxed text-ink-500">
          “{reviewNotes}”
        </blockquote>
      ) : null}
      <p className="text-sm leading-relaxed text-ink-50">
        Resubmitting isn't supported in the current beta — reach out to support
        and we'll reset the unlock so you can try again.
      </p>
    </section>
  );
}

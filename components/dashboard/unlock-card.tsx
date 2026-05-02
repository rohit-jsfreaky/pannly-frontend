import {
  CheckCircle2,
  Clock,
  Hammer,
  RotateCcw,
  ShieldCheck,
  Wallet,
  XCircle,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import type { MyUnlockItem, UnlockState } from "@/lib/api/me";
import { formatDate, formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Props {
  unlock: MyUnlockItem;
}

/**
 * One row in the dashboard list. Visual + action depends on `state`:
 *
 *   unlocked / building → "Submit my build" CTA + days_remaining countdown
 *   submitted           → "View Submission" + "Pending Review" status text
 *   approved            → "View Submission" + "Refund pending"
 *   refunded            → "$X credited" chip (no button), card slightly muted
 *   rejected            → "View feedback" + truncated review_notes preview
 */
export function UnlockCard({ unlock }: Props) {
  const ideaHref = `/ideas/${encodeURIComponent(unlock.idea_slug)}` as Route;
  const submitHref = `/unlocks/${encodeURIComponent(unlock.unlock_id)}/submit` as Route;
  const isRefunded = unlock.state === "refunded";

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-cream-300 bg-cream-50 p-6 shadow-soft transition-colors hover:bg-cream-100 md:p-8",
        isRefunded && "opacity-75",
      )}
    >
      {/* Top row: tags (left) + state pill (right) */}
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {unlock.idea_tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-cream-300 bg-cream-200 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-moss-500"
            >
              {tag}
            </span>
          ))}
        </div>
        <StatePill state={unlock.state} />
      </header>

      {/* Title + pain */}
      <div>
        <h2 className="mb-2 font-display text-2xl text-ink-700">
          <Link
            href={ideaHref}
            className="transition-colors hover:text-moss-700"
          >
            {unlock.idea_title}
          </Link>
        </h2>
        {unlock.idea_one_line_pain ? (
          <p className="text-base leading-relaxed text-ink-50">
            {unlock.idea_one_line_pain}
          </p>
        ) : null}
      </div>

      <div className="h-px bg-cream-300/60" aria-hidden />

      {/* Footer: meta on left, action on right */}
      <footer className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardMeta unlock={unlock} />
        <CardAction unlock={unlock} submitHref={submitHref} />
      </footer>
    </article>
  );
}

// =================================================================== //
//  State pill — colour + icon per state                                //
// =================================================================== //

function StatePill({ state }: { state: UnlockState }) {
  const config: Record<
    UnlockState,
    { label: string; tone: "moss" | "sage" | "plum" | "error" | "neutral"; Icon: typeof Clock; pulse?: boolean }
  > = {
    pending: { label: "Pending", tone: "neutral", Icon: Clock },
    unlocked: { label: "Just unlocked", tone: "moss", Icon: Hammer },
    building: { label: "Building", tone: "sage", Icon: Hammer, pulse: true },
    submitted: { label: "Submitted", tone: "sage", Icon: CheckCircle2 },
    approved: { label: "Approved", tone: "sage", Icon: ShieldCheck },
    refunded: { label: "Refunded", tone: "plum", Icon: RotateCcw },
    rejected: { label: "Rejected", tone: "error", Icon: XCircle },
  };
  const { label, tone, Icon, pulse } = config[state];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider",
        tone === "moss" && "border-moss-600/30 bg-moss-100/60 text-moss-700",
        tone === "sage" && "border-sage-300/60 bg-sage-100/40 text-sage-500",
        tone === "plum" && "border-plum-300/60 bg-plum-100/40 text-plum-500",
        tone === "error" && "border-error/30 bg-plum-100/30 text-error",
        tone === "neutral" && "border-cream-300 bg-cream-50 text-ink-50",
      )}
    >
      {pulse ? (
        <span
          aria-hidden
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-current"
        />
      ) : (
        <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      )}
      {label}
    </span>
  );
}

// =================================================================== //
//  Footer left side — date + state-dependent secondary metric          //
// =================================================================== //

function CardMeta({ unlock }: { unlock: MyUnlockItem }) {
  return (
    <div className="flex flex-wrap items-start gap-x-8 gap-y-3">
      <Field label="Unlocked on" value={formatDate(unlock.unlocked_at)} />
      <SecondaryField unlock={unlock} />
    </div>
  );
}

function SecondaryField({ unlock }: { unlock: MyUnlockItem }) {
  switch (unlock.state) {
    case "unlocked":
    case "building":
      return (
        <Field
          label="Time remaining"
          value={
            <span className="inline-flex items-center gap-1.5 text-sage-500">
              <Clock className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              {unlock.days_remaining}d
            </span>
          }
        />
      );
    case "submitted":
      return <Field label="Status" value="Pending review" />;
    case "approved":
      return <Field label="Status" value="Refund pending" />;
    case "refunded":
      return (
        <Field
          label="Refund date"
          value={unlock.refunded_at ? formatDate(unlock.refunded_at) : "—"}
        />
      );
    case "rejected":
      return (
        <Field
          label="Reason"
          value={
            <span className="line-clamp-2 max-w-md">
              {unlock.review_notes ?? "No reason given"}
            </span>
          }
        />
      );
    default:
      return null;
  }
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[11px] uppercase tracking-wider text-cream-400">
        {label}
      </span>
      <span className="text-sm text-ink-700">{value}</span>
    </div>
  );
}

// =================================================================== //
//  Footer right side — primary action / status chip                    //
// =================================================================== //

function CardAction({
  unlock,
  submitHref,
}: {
  unlock: MyUnlockItem;
  submitHref: Route;
}) {
  switch (unlock.state) {
    case "unlocked":
    case "building":
      return (
        <Link
          href={submitHref}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-moss-600 px-5 py-2.5 text-sm font-medium text-cream-50 shadow-sm transition-opacity hover:opacity-90 sm:self-auto"
        >
          Submit my build
        </Link>
      );
    case "submitted":
    case "approved":
      return (
        <Link
          href={submitHref}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-cream-300 bg-cream-50 px-5 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-cream-200 sm:self-auto"
        >
          View submission
        </Link>
      );
    case "refunded":
      return (
        <span className="inline-flex items-center gap-2 self-start text-sm text-plum-500 sm:self-auto">
          <Wallet className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          {formatMoney(unlock.refund_amount_cents ?? unlock.amount_paid_cents)}{" "}
          credited
        </span>
      );
    case "rejected":
      return (
        <Link
          href={submitHref}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-cream-300 bg-cream-50 px-5 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-cream-200 sm:self-auto"
        >
          View feedback
        </Link>
      );
    default:
      return null;
  }
}

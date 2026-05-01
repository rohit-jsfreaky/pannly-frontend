import type { Route } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, ExternalLink } from "lucide-react";

interface Props {
  ideaSlug: string;
  ideaTitle: string;
  buildUrl: string | null;
  buildName: string | null;
  submittedAt: string;
  /** Hours from POST /submit (review_window_hours). Defaults to 48. */
  reviewWindowHours?: number;
}

export function SubmissionSuccess({
  ideaSlug,
  ideaTitle,
  buildUrl,
  buildName,
  submittedAt,
  reviewWindowHours = 48,
}: Props) {
  const submitted = new Date(submittedAt);
  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-cream-300 bg-cream-50 p-10 text-center shadow-soft">
      <span
        aria-hidden
        className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-moss-100 text-moss-700"
      >
        <CheckCircle2 className="h-8 w-8" strokeWidth={1.5} />
      </span>

      <h1 className="mb-3 font-display text-3xl text-ink-700">Build submitted.</h1>
      <p className="mb-8 text-base leading-relaxed text-ink-50">
        Thanks for shipping. An admin will review within{" "}
        <strong className="font-semibold text-ink-700">{reviewWindowHours} hours</strong>.
        Once approved, your $3 refund clears automatically and your build appears on the
        public gallery.
      </p>

      <dl className="mb-8 grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
        <Field label="Idea" value={ideaTitle} />
        <Field
          label="Submitted"
          value={submitted.toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        />
        {buildName ? <Field label="Build" value={buildName} /> : null}
        {buildUrl ? (
          <Field
            label="Live URL"
            value={
              <a
                href={buildUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-moss-600 hover:underline"
              >
                {hostname(buildUrl)}
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              </a>
            }
          />
        ) : null}
      </dl>

      <div className="mb-6 flex items-center justify-center gap-2 rounded-xl border border-cream-300 bg-cream-100 px-4 py-3 text-sm text-ink-50">
        <Clock className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        We'll email you the moment a decision is made.
      </div>

      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href={`/ideas/${encodeURIComponent(ideaSlug)}` as Route}
          className="inline-flex items-center justify-center rounded-full bg-moss-600 px-6 py-3 text-sm font-medium text-cream-50 transition-opacity hover:opacity-90"
        >
          Back to brief
        </Link>
        <Link
          href={"/built" as Route}
          className="inline-flex items-center justify-center rounded-full border border-cream-300 bg-cream-50 px-6 py-3 text-sm font-medium text-ink-500 transition-colors hover:bg-cream-200"
        >
          See the gallery
        </Link>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-cream-300 bg-cream-100 px-4 py-3">
      <dt className="font-mono text-[11px] uppercase tracking-wider text-cream-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-ink-700">{value}</dd>
    </div>
  );
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

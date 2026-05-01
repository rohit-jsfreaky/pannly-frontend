import type { EvidenceQuote } from "@/lib/api/ideas";

interface Props {
  quotes: EvidenceQuote[];
  /** Override the section heading. Locked view uses "Evidence & Market Signals". */
  heading?: string;
}

/**
 * "## Evidence" — one card per quote. Each card has the quote, an author
 * label (e.g. "Indie Hacker, Twitter"), and an optional source link if the
 * brief generator passed one through.
 *
 * Initials are derived from the author_label so we never need image hosting.
 */
export function EvidenceCards({ quotes, heading = "Evidence" }: Props) {
  if (!quotes.length) return null;

  return (
    <section>
      <h2 className="mb-4 font-display text-2xl text-ink-700">{heading}</h2>
      <div className="space-y-4">
        {quotes.map((q, i) => (
          <article
            key={i}
            className="rounded-xl border border-cream-300 bg-cream-50 p-6"
          >
            <p className="mb-4 text-base leading-relaxed text-ink-50">
              &ldquo;{q.quote}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <Avatar label={q.author_label} />
              {q.source_url ? (
                <a
                  href={q.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] uppercase tracking-[0.12em] text-cream-400 hover:text-ink-500"
                >
                  {q.author_label}
                </a>
              ) : (
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-cream-400">
                  {q.author_label}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Avatar({ label }: { label: string }) {
  const initials = deriveInitials(label);
  return (
    <span
      aria-hidden
      className="flex h-8 w-8 items-center justify-center rounded-full border border-cream-300 bg-cream-200 font-mono text-[11px] font-semibold text-ink-50"
    >
      {initials}
    </span>
  );
}

function deriveInitials(label: string): string {
  const words = label
    .split(/[,\s]+/)
    .map((w) => w.trim())
    .filter(Boolean);
  if (!words.length) return "··";
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
}

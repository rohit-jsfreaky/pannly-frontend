import type { ReactNode } from "react";

interface Props {
  title: string;
  /** Display string like "May 3, 2026" — shown in the header. */
  lastUpdated: string;
  /** One-paragraph intro shown above the table of contents (optional). */
  intro?: ReactNode;
  children: ReactNode;
}

/**
 * Shared chrome for the long-form legal pages (/terms, /privacy).
 *
 * All prose styling cascades from this single `[&_*]:` block — pages can
 * just write semantic HTML (<h2>, <p>, <ul>, <a>, etc.) and the typography
 * stays consistent. Keeps the page files focused on content, not classnames.
 */
export function LegalPage({ title, lastUpdated, intro, children }: Props) {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16 md:px-8 md:py-24">
      <header className="mb-12 border-b border-cream-300 pb-8">
        <h1 className="mb-3 font-display text-4xl tracking-tight text-ink-700 md:text-5xl">
          {title}
        </h1>
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-cream-400">
          Last updated · {lastUpdated}
        </p>
        {intro ? (
          <div className="mt-6 text-base leading-relaxed text-ink-50">{intro}</div>
        ) : null}
      </header>

      <article
        className="
          [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-ink-700 [&_h2]:tracking-tight
          [&_h2:first-child]:mt-0
          [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-display [&_h3]:text-lg [&_h3]:text-ink-700
          [&_p]:mb-4 [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-ink-500
          [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6
          [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6
          [&_li]:text-ink-500 [&_li]:leading-relaxed
          [&_strong]:font-semibold [&_strong]:text-ink-700
          [&_a]:text-moss-700 [&_a]:underline [&_a]:decoration-cream-400 [&_a]:underline-offset-4 hover:[&_a]:decoration-moss-500
          [&_code]:rounded-sm [&_code]:bg-cream-200 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.92em] [&_code]:text-ink-700
          [&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-cream-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-ink-50
        "
      >
        {children}
      </article>
    </div>
  );
}

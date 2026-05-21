import type { ReactNode } from "react";

import { BLOG_UPDATED_LABEL } from "@/lib/blog/schema";

/**
 * Consistent blog hero: eyebrow + H1 + visible "Updated" date + lead copy.
 * The lead (`children`) is unique per page — put the `.geo-speakable`
 * definitional sentence in there.
 */
export function BlogHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <span className="mb-4 block font-mono text-xs font-semibold uppercase tracking-[0.2em] text-ink-50/70">
        {eyebrow}
      </span>
      <h1 className="mb-3 font-display text-4xl font-medium tracking-tight text-moss-600 md:text-5xl">
        {title}
      </h1>
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.12em] text-ink-50/60">
        Updated {BLOG_UPDATED_LABEL}
      </p>
      <div className="space-y-4 text-lg leading-relaxed text-ink-50/90">{children}</div>
    </section>
  );
}

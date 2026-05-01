import type { ReactNode } from "react";
import Link from "next/link";

import { Wordmark } from "@/components/brand/wordmark";
import { CompassIllustration } from "@/components/auth/compass-illustration";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  /** Footer slot below the form (links to other auth pages). */
  footer?: ReactNode;
  quote: string;
  attribution: string;
  className?: string;
}

/**
 * Full-viewport auth shell — wordmark top-left of the form column, form vertically
 * centred, footer at bottom. Right column is editorial: dark compass panel + quote.
 *
 * No outer header; auth pages mount this directly under the root layout.
 */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  quote,
  attribution,
  className,
}: Props) {
  return (
    <div className={cn("flex min-h-screen bg-cream-100", className)}>
      {/* Left column — wordmark + form + meta footer */}
      <div className="relative flex w-full flex-col p-6 md:w-1/2 md:p-12">
        <header className="flex items-center">
          <Link href="/" aria-label="Pannly home">
            <Wordmark size="sm" />
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[400px]">
            <h1 className="mb-2 font-display text-4xl font-semibold tracking-tight text-ink-700 md:text-5xl">
              {title}
            </h1>
            {subtitle ? (
              <div className="mb-12 text-base text-ink-50/80">{subtitle}</div>
            ) : (
              <div className="mb-12" />
            )}
            {children}
            {footer ? <div className="mt-8 text-sm text-ink-50/70">{footer}</div> : null}
          </div>
        </main>

        <footer className="flex w-full items-center justify-between font-mono text-xs uppercase tracking-[0.08em] text-ink-50/60">
          <span>Secure login</span>
          <span>System active</span>
        </footer>
      </div>

      {/* Right column — editorial */}
      <div className="relative hidden items-center justify-center overflow-hidden border-l border-cream-300 bg-cream-200 p-12 md:flex md:w-1/2">
        {/* Subtle dotted texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, var(--color-sage-300) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          aria-hidden
        />

        <div className="relative z-10 flex max-w-[480px] flex-col items-center text-center">
          <div className="mb-12">
            <CompassIllustration size={196} />
          </div>
          <blockquote className="space-y-6">
            <p className="font-display text-2xl italic leading-relaxed text-moss-600">
              &ldquo;{quote}&rdquo;
            </p>
            <cite className="block font-mono text-xs font-semibold uppercase not-italic tracking-[0.15em] text-ink-50/70">
              — {attribution}
            </cite>
          </blockquote>
        </div>
      </div>
    </div>
  );
}

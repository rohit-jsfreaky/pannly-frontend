import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface Props {
  number: string;
  title: string;
  body: string;
  children: ReactNode;
  /** Last step in the list — drop the bottom border. */
  isLast?: boolean;
}

/**
 * One row in the editorial how-it-works flow.
 * 12-column grid: number (2) · text (4) · visual (6). Stacks on mobile.
 */
export function HowItWorksStep({ number, title, body, children, isLast }: Props) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 items-start gap-8 py-12 md:grid-cols-12",
        !isLast && "border-b border-cream-300",
      )}
    >
      <div className="md:col-span-2">
        <span className="font-mono text-sm tracking-[0.05em] text-sage-300">{number}</span>
      </div>
      <div className="md:col-span-4">
        <h2 className="mb-4 font-display text-2xl text-ink-700">{title}</h2>
        <p className="text-base text-ink-50/80">{body}</p>
      </div>
      <div className="md:col-span-6">{children}</div>
    </div>
  );
}

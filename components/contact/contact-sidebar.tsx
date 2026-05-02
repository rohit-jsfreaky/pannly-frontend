import { Info } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

const DIRECT_LINES: { label: string; email: string }[] = [
  { label: "Support", email: "support@getrevlio.com" },
  { label: "Partnerships", email: "partners@getrevlio.com" },
];

export function ContactSidebar() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-cream-300 bg-cream-50 p-6">
        <h2 className="mb-6 font-display text-2xl text-ink-700">Direct lines</h2>
        <ul className="space-y-5">
          {DIRECT_LINES.map((line, i) => (
            <li
              key={line.label}
              className={
                i < DIRECT_LINES.length - 1
                  ? "border-b border-cream-300/60 pb-5"
                  : undefined
              }
            >
              <span className="mb-1 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-50">
                {line.label}
              </span>
              <a
                href={`mailto:${line.email}`}
                className="block text-base text-moss-700 transition-colors hover:text-moss-600"
              >
                {line.email}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-cream-300 bg-cream-200/60 p-6">
        <div className="flex items-start gap-3">
          <Info
            className="mt-0.5 h-5 w-5 shrink-0 text-cream-400"
            strokeWidth={1.75}
            aria-hidden
          />
          <div>
            <h3 className="mb-1 text-sm font-semibold text-ink-700">
              Before you reach out
            </h3>
            <p className="text-sm leading-relaxed text-ink-50">
              Check the{" "}
              <Link
                href={"/refunds" as Route}
                className="text-moss-700 underline decoration-cream-400 underline-offset-4 hover:text-moss-600"
              >
                Refunds page
              </Link>{" "}
              or{" "}
              <Link
                href={"/how-it-works" as Route}
                className="text-moss-700 underline decoration-cream-400 underline-offset-4 hover:text-moss-600"
              >
                How it works
              </Link>{" "}
              for quick answers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

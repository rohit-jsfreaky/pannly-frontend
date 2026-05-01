import type { ValidationStep } from "@/lib/api/ideas";

interface Props {
  steps: ValidationStep[];
}

/** "## 3-step validation plan" — numbered cards (01 / 02 / 03). */
export function ValidationPlan({ steps }: Props) {
  if (!steps.length) return null;

  return (
    <section>
      <h2 className="mb-6 font-display text-2xl text-ink-700">3-step validation plan</h2>
      <ol className="space-y-6">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-plum-100 font-mono text-xs font-semibold tracking-wide text-plum-700">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="mb-1 text-lg font-medium text-ink-700">{step.headline}</h3>
              <p className="text-sm leading-relaxed text-ink-50">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

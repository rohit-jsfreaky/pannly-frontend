/**
 * "How refunds work" sidebar — fully static copy, no API calls.
 * Sticky on lg+ so it stays in view while scrolling the ledger.
 */
export function MethodologyPanel() {
  return (
    <div className="lg:sticky lg:top-32">
      <h2 className="mb-6 border-b border-cream-300 pb-4 font-display text-2xl text-ink-700">
        How refunds work
      </h2>
      <div className="space-y-6">
        {STEPS.map((s) => (
          <div key={s.label}>
            <h3 className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-50">
              {s.label}
            </h3>
            <p className="text-base leading-relaxed text-ink-700">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const STEPS: { label: string; body: string }[] = [
  {
    label: "The pledge",
    body:
      "When you unlock an idea, you commit a small stake. It's a psychological anchor against endless procrastination.",
  },
  {
    label: "The execution",
    body: "Build the MVP. Ship it. Prove it exists in the real world outside your notebook.",
  },
  {
    label: "The return",
    body:
      "Submit your proof of launch. Once verified, your stake is returned. It's not a cost; it's a deposit on your own discipline.",
  },
];

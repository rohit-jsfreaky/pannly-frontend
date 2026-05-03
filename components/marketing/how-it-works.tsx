interface Step {
  number: string;
  title: string;
  body: string;
}

// H2 titles are deliberately self-contained so AI Overviews / voice agents
// can cite a single heading and the meaning survives — verb-only headings
// like "We listen" lose their object outside context.
const steps: Step[] = [
  {
    number: "01",
    title: "We crawl Reddit and Hacker News every 30 minutes for recurring pain signals",
    body: "Six SaaS-focused subreddits and the Ask HN / Show HN feeds, refreshed continuously and synthesised into actionable software briefs.",
  },
  {
    number: "02",
    title: "You unlock the full brief for $3",
    body: "Pay a small pledge to view the full brief — pain analysis, evidence, competitors, sample landing copy, and a 3-step validation plan.",
  },
  {
    number: "03",
    title: "You ship within 30 days and your $3 is refunded automatically",
    body: "Launch your build within 30 days, submit the live URL, an admin reviews within 24–48 hours, and your pledge is auto-credited back to your card.",
  },
];

export function HowItWorks() {
  return (
    <section className="px-6 md:px-12 w-full py-16">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.number}
            className="rounded-xl border border-cream-300 bg-cream-50/60 p-8"
          >
            <span className="mb-6 inline-block rounded-md border border-plum-300/40 bg-plum-100/60 px-3 py-1.5 font-mono text-xs font-semibold text-plum-500">
              {step.number}
            </span>
            <h3 className="font-display text-2xl text-ink-700">{step.title}</h3>
            <p className="mt-3 text-base text-ink-50/80">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ: FaqItem[] = [
  {
    question: "How does the Refund-on-ship work?",
    answer:
      "If you purchase a brief and launch a product based directly on it within 6 months, send us the link. We'll refund the cost of the brief. We want to subsidize action, not just reading.",
  },
  {
    question: "Can I upgrade from Per Unlock to Pro?",
    answer:
      "Yes, anytime. If you've purchased more than three briefs in a single month, we automatically suggest upgrading as it becomes more cost-effective.",
  },
  {
    question: "What is included in a PDF brief?",
    answer:
      "Each brief is a meticulously researched 10–15 page document covering market gaps, competitor analysis, suggested technical stacks, and initial go-to-market strategies.",
  },
  {
    question: "Do you offer team plans?",
    answer:
      "Currently, our focus is entirely on the solo indie hacker and small studio. We do not have enterprise or team billing at this time.",
  },
];

export function FaqSection() {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-32">
      <h2 className="mb-12 text-center font-display text-3xl text-ink-700">
        Frequently asked questions
      </h2>
      <div className="space-y-6">
        {FAQ.map((item) => (
          <div
            key={item.question}
            className="rounded-xl border border-cream-300 bg-cream-50 p-6"
          >
            <h3 className="mb-2 font-display text-xl text-ink-700">{item.question}</h3>
            <p className="text-base leading-relaxed text-ink-50">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

interface QA {
  question: string;
  answer: string;
}

interface Props {
  title?: string;
  items: QA[];
}

export function Faq({ title = "Frequently asked questions", items }: Props) {
  return (
    <section className="px-6 md:px-12 max-w-3xl pb-32">
      <h2 className="mb-12 text-center font-display text-3xl text-ink-700">{title}</h2>

      <div className="space-y-6">
        {items.map((qa) => (
          <div
            key={qa.question}
            className="rounded-xl border border-cream-300 bg-cream-50 p-6"
          >
            <h3 className="mb-2 font-display text-2xl text-ink-700">{qa.question}</h3>
            <p className="text-base text-ink-50/80">{qa.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

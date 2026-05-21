import type { BlogFaqItem } from "@/lib/blog/schema";

/**
 * Native <details> FAQ. Content is unique per page (passed in); this only
 * standardises the markup that the FAQPage JSON-LD mirrors.
 */
export function BlogFaq({ heading, items }: { heading: string; items: BlogFaqItem[] }) {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <h2 className="mb-10 font-display text-3xl text-moss-600">{heading}</h2>
      <div className="flex flex-col divide-y divide-cream-300 border-t border-cream-300">
        {items.map((f) => (
          <details key={f.question} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-display text-lg text-ink-700">
              {f.question}
              <span className="ml-4 font-mono text-xl text-moss-600 transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-4 text-base leading-relaxed text-ink-50/80">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

import type { LandingCopy } from "@/lib/api/ideas";

interface Props {
  copy: LandingCopy | null;
}

/** "## Sample landing copy" — hero block with display headline + subhead. */
export function LandingCopyCard({ copy }: Props) {
  if (!copy) return null;

  return (
    <section>
      <h2 className="mb-4 font-display text-2xl text-ink-700">Sample landing copy</h2>
      <div className="rounded-r-xl border border-cream-300 border-l-4 border-l-moss-600 bg-cream-50 p-8 shadow-soft">
        <h3 className="mb-4 font-display text-3xl leading-tight text-ink-700 md:text-4xl">
          {copy.headline}
        </h3>
        <p className="text-lg leading-relaxed text-ink-50">{copy.subhead}</p>
      </div>
    </section>
  );
}

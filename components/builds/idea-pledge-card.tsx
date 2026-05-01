import { Lightbulb } from "lucide-react";

interface Props {
  title: string;
  pain: string | null;
}

export function IdeaPledgeCard({ title, pain }: Props) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-cream-300 bg-cream-50 p-6">
      <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-plum-300" />
      <div className="flex items-start gap-4">
        <span
          aria-hidden
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-cream-300 bg-cream-100 text-plum-500"
        >
          <Lightbulb className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div>
          <span className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-wider text-plum-500">
            The Original Pledge
          </span>
          <h3 className="mb-2 font-display text-xl text-ink-700">{title}</h3>
          {pain ? (
            <p className="line-clamp-2 text-sm leading-relaxed text-ink-50">{pain}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

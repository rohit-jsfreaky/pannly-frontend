import { Check } from "lucide-react";

interface Props {
  personas: string[];
}

/** Sidebar card listing the buyer personas as bullets with check icons. */
export function WhoBuysCard({ personas }: Props) {
  if (!personas.length) return null;

  return (
    <aside className="rounded-xl border border-cream-300 bg-cream-50 p-6">
      <h3 className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-cream-400">
        Who buys this
      </h3>
      <ul className="space-y-2 text-sm text-ink-50">
        {personas.map((p, i) => (
          <li key={i} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-moss-600" strokeWidth={2.5} aria-hidden />
            {p}
          </li>
        ))}
      </ul>
    </aside>
  );
}

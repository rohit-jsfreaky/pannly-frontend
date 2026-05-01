import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type Cell = boolean | string;

interface Row {
  feature: string;
  free: Cell;
  perUnlock: Cell;
  pro: Cell;
}

const rows: Row[] = [
  { feature: "Daily feed previews", free: true, perUnlock: true, pro: true },
  { feature: "Weekly email digest", free: true, perUnlock: true, pro: true },
  { feature: "Daily personalised digest", free: false, perUnlock: false, pro: true },
  { feature: "Free unlocks per month", free: "1", perUnlock: "n/a", pro: "Unlimited" },
  {
    feature: "Full idea brief (PDF)",
    free: "Preview only",
    perUnlock: "Per unlock",
    pro: "Unlimited",
  },
  { feature: "Refund-on-ship within 60 days", free: false, perUnlock: true, pro: true },
  {
    feature: "First-mover bonus content",
    free: false,
    perUnlock: "First 10 only",
    pro: true,
  },
  { feature: "Custom keyword alerts", free: false, perUnlock: false, pro: true },
  { feature: "24-hour early access on new ideas", free: false, perUnlock: false, pro: true },
  { feature: "Build of the Quarter eligibility", free: false, perUnlock: true, pro: true },
];

export function FeatureMatrix() {
  return (
    <section className="px-6 md:px-12 max-w-4xl pb-24">
      <h2 className="mb-12 text-center font-display text-3xl text-ink-700">
        Compare detailed features
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-cream-300">
              <th className="w-1/3 py-4 text-sm font-normal text-ink-50/70">Feature</th>
              <th className="w-[22%] py-4 text-center font-display text-2xl text-ink-700">
                Free
              </th>
              <th className="w-[22%] py-4 text-center font-display text-2xl text-ink-700">
                Per-unlock
              </th>
              <th className="w-[22%] py-4 text-center font-display text-2xl text-ink-700">Pro</th>
            </tr>
          </thead>
          <tbody className="text-sm text-ink-700">
            {rows.map((row, i) => (
              <tr
                key={row.feature}
                className={cn(
                  "transition-colors hover:bg-cream-200/40",
                  i < rows.length - 1 ? "border-b border-cream-300/60" : "",
                )}
              >
                <td className="py-4 pr-4">{row.feature}</td>
                <CellTd value={row.free} />
                <CellTd value={row.perUnlock} />
                <CellTd value={row.pro} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CellTd({ value }: { value: Cell }) {
  if (typeof value === "boolean") {
    return (
      <td className="py-4 text-center">
        {value ? (
          <Check
            className="mx-auto h-5 w-5 text-moss-500"
            strokeWidth={2}
            aria-label="Included"
          />
        ) : (
          <span className="text-cream-300" aria-label="Not included">
            —
          </span>
        )}
      </td>
    );
  }
  return <td className="py-4 text-center">{value}</td>;
}

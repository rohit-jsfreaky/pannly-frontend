import type { LucideIcon } from "lucide-react";
import { CreditCard, ShieldCheck, Globe } from "lucide-react";

interface Item {
  icon: LucideIcon;
  title: string;
  body: string;
}

const items: Item[] = [
  {
    icon: CreditCard,
    title: "Dodo Payments",
    body: "Refunds processed back to your original card. No out-of-band promises.",
  },
  {
    icon: ShieldCheck,
    title: "Watermarked PDFs",
    body: "Your brief is stamped with your account ID — yours to keep.",
  },
  {
    icon: Globe,
    title: "Public refunds page",
    body: "See exactly how much we've paid back to shipping builders.",
  },
];

export function TrustStrip() {
  return (
    <div className="mt-12 grid grid-cols-1 gap-8 border-t border-cream-300 py-12 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-200 text-moss-500">
            <item.icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </div>
          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-700">
              {item.title}
            </h3>
            <p className="mt-1 text-xs text-ink-50/70">{item.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

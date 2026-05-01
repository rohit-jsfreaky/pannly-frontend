import { CheckCircle2, Clock, ShieldCheck } from "lucide-react";

const ITEMS = [
  {
    title: "Live URL accessibility",
    body: "An admin will visit the URL — make sure it's publicly accessible and doesn't require login.",
    Icon: CheckCircle2,
    tone: "primary" as const,
  },
  {
    title: "Matches the original idea",
    body: "Your screenshot and live site must demonstrably address the pledged idea above.",
    Icon: CheckCircle2,
    tone: "primary" as const,
  },
  {
    title: "No placeholder pages",
    body: "“Coming soon” or blank index pages will be rejected.",
    Icon: CheckCircle2,
    tone: "primary" as const,
  },
  {
    title: "Manual review (24–48 hr)",
    body: "Pannly is in beta — every build is reviewed by hand. Refund clears once an admin approves.",
    Icon: Clock,
    tone: "muted" as const,
  },
];

export function ChecklistPanel() {
  return (
    <aside className="sticky top-24 rounded-2xl border border-cream-300 bg-cream-50 p-8 shadow-soft">
      <header className="mb-6 flex items-center gap-3 border-b border-cream-300 pb-6">
        <span
          aria-hidden
          className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-100 text-sage-500"
        >
          <ShieldCheck className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <h2 className="font-display text-xl text-ink-700">What we'll check</h2>
      </header>

      <ul className="space-y-5">
        {ITEMS.map((item) => (
          <li key={item.title} className="flex items-start gap-3">
            <item.Icon
              className={
                item.tone === "primary"
                  ? "mt-0.5 h-5 w-5 shrink-0 text-moss-500"
                  : "mt-0.5 h-5 w-5 shrink-0 text-cream-400"
              }
              strokeWidth={1.75}
              aria-hidden
            />
            <div>
              <span className="mb-1 block text-sm font-medium text-ink-700">
                {item.title}
              </span>
              <span className="block text-sm leading-relaxed text-ink-50">
                {item.body}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

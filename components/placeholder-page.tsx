import Link from "next/link";

interface Props {
  route: string;
  phase: string;
  blurb?: string;
}

export function PlaceholderPage({ route, phase, blurb }: Props) {
  return (
    <main className="px-6 md:px-12 py-24">
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-sage-300">
        Phase 0 placeholder · {route}
      </p>
      <h1 className="mt-3 font-display text-4xl">{route}</h1>
      <p className="mt-4 max-w-xl text-ink-50">
        {blurb ?? "This screen is a placeholder."} It lands in <strong>{phase}</strong> of{" "}
        <code>implementation_plan.md</code>.
      </p>
      <Link href="/" className="mt-8 inline-block text-sm text-moss-600 hover:underline">
        ← back home
      </Link>
    </main>
  );
}

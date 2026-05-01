import Link from "next/link";

/**
 * App-root 404. Catches every unmatched route.
 * Renders full-viewport centered — intentionally NOT wrapped in the marketing layout.
 * Next.js automatically returns HTTP 404 from this file.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream-100 px-6 text-center">
      <div className="flex w-full max-w-[600px] flex-col items-center gap-8">
        <h1
          className="font-display font-semibold tracking-[-0.05em] text-moss-200"
          style={{ fontSize: "140px", lineHeight: 1 }}
          aria-hidden
        >
          404
        </h1>

        <div className="flex flex-col gap-4">
          <h2 className="font-display text-3xl font-medium text-moss-600 md:text-[2rem]">
            This idea didn&apos;t make the cut.
          </h2>
          <p className="mx-auto max-w-[400px] text-lg text-ink-50/80">
            Probably for the best. Try the feed instead.
          </p>
        </div>

        <Link
          href="/feed"
          className="mt-4 inline-flex items-center justify-center rounded-md bg-moss-600 px-6 py-3 text-base font-medium text-cream-50 transition-opacity hover:opacity-90"
        >
          Browse the feed.
        </Link>

        <span className="mt-12 block h-px w-16 bg-cream-300/70" aria-hidden />
      </div>
    </main>
  );
}

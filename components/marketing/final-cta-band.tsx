import Link from "next/link";

export function FinalCtaBand() {
  return (
    <section className="mt-16 border-y border-moss-700 bg-moss-600 py-24 text-cream-50">
      <div className="px-6 md:px-12 flex flex-col items-center text-center">
        <h2 className="max-w-2xl font-display text-3xl text-cream-50 md:text-[2rem]">
          There&apos;s a $3 idea waiting for you.
        </h2>
        <p className="mt-6 max-w-xl text-base text-cream-200/90">
          Stop searching for inspiration and start executing on validated demand.
        </p>
        <Link
          href="/feed"
          className="mt-8 rounded-xl bg-cream-50 px-8 py-4 text-base text-moss-700 shadow-soft transition-colors hover:bg-cream-100"
        >
          View the archive
        </Link>
      </div>
    </section>
  );
}

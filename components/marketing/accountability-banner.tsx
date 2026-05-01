import { ReceiptText, CheckCircle2 } from "lucide-react";

export function AccountabilityBanner() {
  return (
    <section className="mt-16 border-y border-cream-300 bg-cream-200 py-20">
      <div className="px-6 md:px-12 grid grid-cols-1 items-center gap-16 md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl text-ink-700 md:text-[2rem]">
            Accountability baked into the model.
          </h2>
          <p className="mt-4 text-lg text-ink-50/80">
            The internet doesn&apos;t need more neglected Notion boards of &ldquo;cool
            ideas.&rdquo; By requiring a small pledge, we filter for builders ready
            to execute. By refunding it, we align our success with yours.
          </p>
        </div>

        <div className="flex justify-center">
          <ReceiptCard />
        </div>
      </div>
    </section>
  );
}

function ReceiptCard() {
  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-cream-300 bg-cream-50 p-6">
      <ReceiptText
        className="absolute right-4 top-4 h-12 w-12 text-ink-700/10"
        strokeWidth={1.5}
        aria-hidden
      />

      <div className="mb-4 flex justify-between font-mono text-xs font-semibold tracking-[0.05em] text-ink-50/70">
        <span>TRANSACTION LOG</span>
        <span>#8842</span>
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex justify-between border-b border-cream-300 pb-2">
          <span className="text-sm text-ink-700">Unlock Idea #412</span>
          <span className="font-mono text-sm tracking-[0.05em] text-ink-700">-$3.00</span>
        </div>
        <div className="flex justify-between border-b border-cream-300 pb-2">
          <span className="flex items-center gap-1.5 text-sm text-ink-700">
            <CheckCircle2 className="h-4 w-4 text-moss-500" strokeWidth={1.75} aria-hidden />
            Shipped MVP
          </span>
          <span className="font-mono text-sm tracking-[0.05em] text-plum-500">+$3.00</span>
        </div>
      </div>

      <div className="flex justify-between font-mono text-xs font-semibold tracking-[0.05em] text-ink-700">
        <span>NET COST</span>
        <span>$0.00</span>
      </div>
    </div>
  );
}

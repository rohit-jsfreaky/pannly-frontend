/** Tiny formatting helpers used across screens. Locale-aware where it matters. */

export function formatMoney(cents: number, currency: "USD" | "INR" = "USD"): string {
  const amount = cents / 100;
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function formatCount(n: number): string {
  if (n < 1000) return n.toString();
  if (n < 1_000_000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}

export function formatDate(date: Date | string, opts?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...opts,
  }).format(d);
}

export function formatRelative(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.round((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86_400) return `${Math.floor(seconds / 3600)} hr ago`;
  if (seconds < 604_800) return `${Math.floor(seconds / 86_400)} d ago`;
  return formatDate(d);
}

/** "Day 7 of 60" timer string for unlock cards. */
export function formatBuildDay(unlockedAt: Date | string, windowDays = 60): string {
  const start = typeof unlockedAt === "string" ? new Date(unlockedAt) : unlockedAt;
  const day = Math.min(
    windowDays,
    Math.max(1, Math.floor((Date.now() - start.getTime()) / 86_400_000) + 1),
  );
  return `Day ${day} of ${windowDays}`;
}

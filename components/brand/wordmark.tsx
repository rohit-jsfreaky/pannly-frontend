import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  /** "default" renders dark on light. "inverse" renders cream on dark for the moss CTA band. */
  variant?: "default" | "inverse";
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
};

export function Wordmark({ className, variant = "default", size = "md" }: Props) {
  const tone = variant === "inverse" ? "text-cream-50" : "text-moss-500";
  const dot = variant === "inverse" ? "text-plum-300" : "text-plum-500";

  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-[1px] font-display font-semibold tracking-tight",
        sizes[size],
        tone,
        className,
      )}
      aria-label="Pannly"
    >
      pannly
      <span className={cn("leading-none", dot)} aria-hidden>
        .
      </span>
    </span>
  );
}

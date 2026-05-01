import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  /** Used by screen readers — set to a meaningful word for the loading reason. */
  label?: string;
}

/** Small inline spinner for use inside buttons. Inherits color from currentColor. */
export function Spinner({ className, label = "Loading" }: Props) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent",
        className,
      )}
    />
  );
}

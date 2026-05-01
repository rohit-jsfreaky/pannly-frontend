import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  /** Full-width on container. */
  block?: boolean;
  children: ReactNode;
}

const VARIANT: Record<Variant, string> = {
  primary: "bg-moss-600 text-cream-50 hover:opacity-90",
  secondary:
    "bg-cream-50 text-moss-600 border border-moss-600/20 hover:bg-cream-200",
  ghost: "bg-transparent text-moss-600 hover:bg-cream-200",
  danger: "bg-error text-cream-50 hover:opacity-90",
};

const SIZE: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-5 py-2.5 text-base rounded-md",
  lg: "px-6 py-3 text-base rounded-md",
};

/**
 * Generic button. When `loading` is set:
 *   - The button is disabled and aria-busy.
 *   - The label is rendered with `invisible` so the button keeps its width.
 *   - A centred Spinner sits on top.
 *
 * No "Logging in…" text. Spinner is the only loading indicator.
 */
export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  block = false,
  disabled,
  children,
  className,
  type = "button",
  ...rest
}: Props) {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 font-medium transition-opacity disabled:opacity-60 disabled:cursor-not-allowed",
        block && "w-full",
        VARIANT[variant],
        SIZE[size],
        className,
      )}
      {...rest}
    >
      <span className={cn("inline-flex items-center gap-2", loading && "invisible")}>
        {children}
      </span>
      {loading ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner aria-hidden />
        </span>
      ) : null}
    </button>
  );
}

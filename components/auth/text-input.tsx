import { forwardRef } from "react";

import { cn } from "@/lib/utils";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

/** Plain text/email input matching the auth-form visual language. */
export const TextInput = forwardRef<HTMLInputElement, Props>(function TextInput(
  { className, error, type = "text", ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "w-full rounded-md border bg-cream-50 px-4 py-3 text-base text-ink-700 placeholder:text-ink-50/40 focus:outline-none focus:ring-2 focus:ring-moss-500/40",
        error
          ? "border-error focus:ring-error/30"
          : "border-cream-300 focus:border-moss-500",
        className,
      )}
      {...rest}
    />
  );
});

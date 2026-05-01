"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  error?: boolean;
};

/**
 * Password field with an eye toggle to show/hide. Forwarded ref so it works
 * with react-hook-form's register().
 */
export const PasswordInput = forwardRef<HTMLInputElement, Props>(function PasswordInput(
  { className, error, ...rest },
  ref,
) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        ref={ref}
        type={show ? "text" : "password"}
        className={cn(
          "w-full rounded-md border bg-cream-50 px-4 py-3 pr-12 text-base text-ink-700 placeholder:text-ink-50/40 focus:outline-none focus:ring-2 focus:ring-moss-500/40",
          error
            ? "border-error focus:ring-error/30"
            : "border-cream-300 focus:border-moss-500",
          className,
        )}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-ink-50/60 transition-colors hover:bg-cream-200 hover:text-ink-700"
      >
        {show ? (
          <EyeOff className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        ) : (
          <Eye className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        )}
      </button>
    </div>
  );
});

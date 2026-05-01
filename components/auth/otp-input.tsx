"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  error?: boolean;
  /** Triggered when the user pastes/types the full code. */
  onComplete?: (value: string) => void;
  autoFocus?: boolean;
}

/**
 * 6-box OTP entry. Auto-advance forward, backspace to previous,
 * paste-aware (pasting "123456" fills all six boxes).
 */
export function OtpInput({
  value,
  onChange,
  length = 6,
  disabled,
  error,
  onComplete,
  autoFocus = true,
}: Props) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  useEffect(() => {
    if (value.length === length) onComplete?.(value);
    // intentionally narrow deps — we only want to fire on completion
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const setAt = (i: number, char: string) => {
    const next = (value.padEnd(length, " ").split("") as string[]).map((c) =>
      c === " " ? "" : c,
    );
    next[i] = char;
    onChange(next.join("").slice(0, length));
  };

  return (
    <div className="flex justify-between gap-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          disabled={disabled}
          value={value[i] ?? ""}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, "");
            if (!raw) {
              setAt(i, "");
              return;
            }
            const ch = raw[raw.length - 1];
            setAt(i, ch);
            if (i < length - 1) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value[i] && i > 0) {
              refs.current[i - 1]?.focus();
            } else if (e.key === "ArrowLeft" && i > 0) {
              refs.current[i - 1]?.focus();
            } else if (e.key === "ArrowRight" && i < length - 1) {
              refs.current[i + 1]?.focus();
            }
          }}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
            if (!text) return;
            e.preventDefault();
            onChange(text.padEnd(length, "").slice(0, length));
            const focusIdx = Math.min(text.length, length - 1);
            refs.current[focusIdx]?.focus();
          }}
          className={cn(
            "h-14 w-12 rounded-md border bg-cream-50 text-center font-mono text-2xl text-ink-700 transition-colors focus:outline-none focus:ring-2 focus:ring-moss-500/40",
            error
              ? "border-error focus:ring-error/30"
              : "border-cream-300 focus:border-moss-500",
            disabled && "opacity-60",
          )}
        />
      ))}
    </div>
  );
}

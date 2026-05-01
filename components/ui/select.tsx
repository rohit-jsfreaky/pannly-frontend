"use client";

import { Check, ChevronDown } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

export interface SelectOption<T extends string> {
  value: T;
  label: ReactNode;
  /** Plain text used for the trigger label and the announced state. Falls back to label when label is a string. */
  textLabel?: string;
}

interface Props<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  /** Shown on the trigger when no option matches `value`. */
  placeholder?: string;
  /** Aria label — the trigger isn't a real <label/> control. */
  "aria-label"?: string;
  /** Width-control class on the trigger; menu auto-matches min-width. */
  className?: string;
  /** Disabled trigger. */
  disabled?: boolean;
  /**
   * `boxed` (default): bordered, padded, fixed-width — fits inside form rows.
   * `inline`: borderless inline-text trigger (e.g. "Sort by: Recent ▾") for
   * unobtrusive in-flow use. Menu still gets the bordered popover.
   */
  variant?: "boxed" | "inline";
  /** Optional prefix label for the inline variant (e.g. "Sort by:"). */
  inlinePrefix?: string;
}

/**
 * Accessible custom select. No native <select> — keeps the visual under our
 * design system, including focus, hover, and keyboard nav.
 *
 * Keyboard:
 *   - Trigger:   ArrowDown / Enter / Space → open
 *   - Menu:      ArrowUp / ArrowDown → navigate
 *                Home / End          → first / last
 *                Enter / Space       → select + close
 *                Escape / Tab        → close, return focus to trigger
 */
export function Select<T extends string>({
  value,
  onChange,
  options,
  placeholder = "Select…",
  "aria-label": ariaLabel,
  className,
  disabled,
  variant = "boxed",
  inlinePrefix,
}: Props<T>) {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  const initialHighlight = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(initialHighlight);

  const selected = options.find((o) => o.value === value);
  const triggerText =
    selected?.textLabel ??
    (typeof selected?.label === "string" ? selected.label : placeholder);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        !triggerRef.current?.contains(t) &&
        !menuRef.current?.contains(t)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", onDoc);
    return () => window.removeEventListener("mousedown", onDoc);
  }, [open]);

  // When opening, jump highlight to current value + focus the menu so
  // keyboard nav works without an extra Tab.
  useEffect(() => {
    if (!open) return;
    const idx = Math.max(
      0,
      options.findIndex((o) => o.value === value),
    );
    setHighlight(idx);
    requestAnimationFrame(() => menuRef.current?.focus());
  }, [open, options, value]);

  // Keep the highlighted item in view when navigating with the keyboard.
  useEffect(() => {
    if (!open) return;
    itemRefs.current[highlight]?.scrollIntoView({ block: "nearest" });
  }, [open, highlight]);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const choose = useCallback(
    (opt: SelectOption<T>) => {
      onChange(opt.value);
      close();
    },
    [onChange, close],
  );

  const onMenuKey = (e: KeyboardEvent<HTMLUListElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlight((h) => Math.min(options.length - 1, h + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlight((h) => Math.max(0, h - 1));
        break;
      case "Home":
        e.preventDefault();
        setHighlight(0);
        break;
      case "End":
        e.preventDefault();
        setHighlight(options.length - 1);
        break;
      case "Enter":
      case " ": {
        e.preventDefault();
        const opt = options[highlight];
        if (opt) choose(opt);
        break;
      }
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        // Honour Tab — close menu first so focus moves naturally.
        setOpen(false);
        break;
    }
  };

  const onTriggerKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (open) return;
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  };

  const isInline = variant === "inline";

  return (
    <div className={cn("relative", isInline ? "inline-block" : "", className)}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onTriggerKey}
        className={cn(
          "flex items-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
          isInline
            ? "px-0 py-0 text-sm text-ink-50 hover:text-ink-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-500/40 rounded-sm"
            : "w-full justify-between rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-ink-500 hover:bg-cream-200 focus:outline-none focus:ring-2 focus:ring-moss-500/40",
        )}
      >
        {isInline && inlinePrefix ? (
          <span className="text-ink-50">{inlinePrefix}</span>
        ) : null}
        <span className={cn("truncate", isInline && "font-medium text-ink-500")}>
          {triggerText}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 flex-shrink-0 transition-transform",
            isInline ? "text-ink-50" : "text-cream-400",
            open && "rotate-180",
          )}
          strokeWidth={1.75}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          ref={menuRef}
          id={`${id}-listbox`}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={`${id}-opt-${highlight}`}
          onKeyDown={onMenuKey}
          className={cn(
            "absolute top-[calc(100%+4px)] z-50 overflow-auto rounded-md border border-cream-300 bg-cream-50 py-1 shadow-[0_2px_4px_rgba(26,31,27,0.08),0_16px_40px_rgba(26,31,27,0.10)] focus:outline-none",
            isInline ? "right-0 min-w-[180px]" : "left-0 min-w-full",
          )}
          style={{ maxHeight: "calc(min(60vh, 320px))" }}
        >
          {options.map((opt, i) => {
            const isSelected = opt.value === value;
            const isHighlighted = i === highlight;
            return (
              <li
                key={opt.value}
                id={`${id}-opt-${i}`}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setHighlight(i)}
                onClick={() => choose(opt)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 px-3 py-2 text-sm",
                  isHighlighted
                    ? "bg-moss-100 text-ink-700"
                    : "text-ink-500",
                  isSelected && !isHighlighted && "bg-cream-200",
                )}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected ? (
                  <Check
                    className="h-4 w-4 flex-shrink-0 text-moss-500"
                    strokeWidth={2}
                    aria-hidden
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

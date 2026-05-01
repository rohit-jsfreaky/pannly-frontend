"use client";

import { useEffect, useState } from "react";

/**
 * Returns a debounced copy of `value`. Updates only after `delayMs` of
 * stillness — the typical use is the search input where every keystroke
 * mustn't fire its own request.
 */
export function useDebounce<T>(value: T, delayMs = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);

  return debounced;
}

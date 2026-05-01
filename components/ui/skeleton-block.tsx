import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  style?: CSSProperties;
}

/**
 * Generic Tailwind-only skeleton block. Used inline AND as the `fallback`
 * for boneyard's `<Skeleton>` until `npx boneyard-js build` captures
 * pixel-perfect bones. After capture, boneyard renders extracted bones
 * automatically; this fallback only shows pre-capture / on capture failure.
 */
export function SkeletonBlock({ className, style }: Props) {
  return (
    <div
      aria-hidden
      style={style}
      className={cn("animate-pulse rounded-md bg-cream-200", className)}
    />
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  src: string | null;
  alt: string;
  /** Used as a deterministic seed for the procedural fallback so the same
   *  build always gets the same generated thumbnail. */
  seed: string;
}

/**
 * Square thumbnail for a gallery card.
 *
 * - When `src` is set, renders the builder's uploaded screenshot (R2 URL).
 *   Failures fall back to the procedural placeholder so a broken image link
 *   never leaves a hole in the grid.
 * - When `src` is null (build approved without a screenshot), renders the
 *   procedural placeholder. The geometry is hashed off `seed` so each build
 *   gets a stable, distinct visual — no random per-render flicker.
 */
export function GalleryThumbnail({ src, alt, seed }: Props) {
  const [errored, setErrored] = useState(false);
  const useFallback = !src || errored;

  return (
    <div className="relative aspect-square overflow-hidden border-b border-cream-300 bg-cream-200">
      {useFallback ? (
        <ProceduralPlaceholder seed={seed} />
      ) : (
        <Image
          src={src!}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          onError={() => setErrored(true)}
          unoptimized
        />
      )}
    </div>
  );
}

/**
 * Deterministic placeholder — three shape variants chosen by the seed hash,
 * each on a soft cream gradient. No randomness, so SSR + hydration agree.
 */
function ProceduralPlaceholder({ seed }: { seed: string }) {
  const variant = hashSeed(seed) % 3;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cream-200 to-cream-300/50 p-8">
      {variant === 0 ? (
        <div className="flex h-3/4 w-3/4 items-center justify-center rounded-2xl border border-cream-400/50">
          <div className="h-1/2 w-1/2 rounded-xl bg-moss-100" />
        </div>
      ) : variant === 1 ? (
        <div className="flex h-2/3 w-2/3 rotate-6 items-center justify-center rounded-lg border-2 border-cream-400/30">
          <div className="h-px w-full bg-cream-400/30" />
        </div>
      ) : (
        <div className="grid h-1/2 w-1/2 grid-cols-2 gap-2">
          <div className="rounded-sm bg-cream-400/10" />
          <div className="rounded-sm bg-cream-400/20" />
          <div className="rounded-sm bg-cream-400/30" />
          <div className="rounded-sm bg-moss-100" />
        </div>
      )}
    </div>
  );
}

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

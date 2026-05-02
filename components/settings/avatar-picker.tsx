"use client";

import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";

import { ALLOWED_IMAGE_MIME, type AllowedImageMime } from "@/lib/api/uploads";
import { cn } from "@/lib/utils";

interface Props {
  /** Initials shown when there's no preview / no avatar (e.g. "RK"). */
  fallbackInitials: string;
  /** R2 URL of the currently-saved avatar; null = no custom avatar. */
  initialUrl: string | null;
  /** Locally-staged file from the most recent pick (not yet uploaded). */
  file: File | null;
  /** Called when the user picks a new file (or null to clear local pick). */
  onFileChange: (file: File | null) => void;
  /** Called when "Remove" is clicked — clears both staged file AND saved URL. */
  onClear: () => void;
  /** Driven by parent — true while a save is in flight. */
  busy?: boolean;
}

const ACCEPT = ALLOWED_IMAGE_MIME.join(",");
const MAX_BYTES = 2 * 1024 * 1024; // mirrors backend AVATAR_MAX_BYTES

/**
 * Avatar picker for the settings page.
 *
 * Critically: this component does NOT upload to R2. It only stages a `File`
 * locally and shows a blob-URL preview. The parent form runs the actual
 * presign + PUT once the user clicks "Save Profile" — so abandoned changes
 * never hit storage.
 */
export function AvatarPicker({
  fallbackInitials,
  initialUrl,
  file,
  onFileChange,
  onClear,
  busy = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Manage blob URL lifecycle so we don't leak object URLs across pick events.
  useEffect(() => {
    if (!file) {
      setBlobUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setBlobUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const previewSrc = blobUrl ?? initialUrl ?? null;

  const handle = (f: File) => {
    if (!ALLOWED_IMAGE_MIME.includes(f.type as AllowedImageMime)) {
      setError("Use a PNG, JPG, GIF, WEBP or SVG.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError("File is over 2 MB.");
      return;
    }
    setError(null);
    onFileChange(f);
  };

  return (
    <div className="flex items-center gap-5">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        aria-label="Change avatar"
        className={cn(
          "group relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cream-300 bg-cream-200 transition-shadow hover:shadow-soft disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        {previewSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewSrc}
            alt="Avatar preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            className="font-display text-2xl font-semibold text-moss-600"
            aria-hidden
          >
            {fallbackInitials}
          </span>
        )}
        {/* Hover overlay — appears only on the picker button. */}
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink-500/0 opacity-0 transition-all group-hover:bg-ink-500/40 group-hover:opacity-100">
          <Camera className="h-5 w-5 text-cream-50" strokeWidth={1.75} aria-hidden />
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handle(f);
          // Reset so picking the same file twice still triggers onChange.
          e.target.value = "";
        }}
      />

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="rounded-md border border-cream-300 bg-cream-50 px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-cream-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Change avatar
          </button>
          {(file || initialUrl) ? (
            <button
              type="button"
              onClick={() => {
                setError(null);
                onClear();
                if (inputRef.current) inputRef.current.value = "";
              }}
              disabled={busy}
              className="text-sm text-ink-50 transition-colors hover:text-plum-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Remove
            </button>
          ) : null}
        </div>
        {error ? (
          <p role="alert" className="text-xs text-error">
            {error}
          </p>
        ) : (
          <p className="text-xs text-cream-400">
            PNG, JPG, GIF, WEBP or SVG · max 2 MB
          </p>
        )}
      </div>
    </div>
  );
}

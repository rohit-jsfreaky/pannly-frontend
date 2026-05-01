"use client";

import { CheckCircle2, CloudUpload, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { ALLOWED_IMAGE_MIME, type AllowedImageMime } from "@/lib/api/uploads";
import { cn } from "@/lib/utils";

interface Props {
  /** Already-uploaded R2 URL — typically rehydrated from a saved draft. */
  initialUrl: string | null;
  /** Locally-staged file from the most recent pick / paste / drop. */
  file: File | null;
  /** Called whenever the user picks a new file (or clears it). */
  onFileChange: (file: File | null) => void;
  /** Reset everything — staged file AND any rehydrated URL. */
  onClear: () => void;
  /** Driven by the form when an upload is in progress. */
  uploading?: boolean;
  /** Show a "Saved" state, e.g. right after a successful Save Draft / Submit. */
  uploaded?: boolean;
  /** Surface external errors (validation, R2 failure) on the dropzone. */
  externalError?: string | null;
}

const ACCEPT = ALLOWED_IMAGE_MIME.join(",");
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Pure picker — does NOT upload to R2. The form decides when to upload (on
 * Save Draft / Submit Build) so users who paste-then-change-their-mind don't
 * burn storage.
 *
 * Three input modes:
 *   - File picker (click)
 *   - Drag and drop
 *   - Cmd/Ctrl-V paste — page-wide, but skips when a text field is focused
 *
 * Preview is shown from a local blob URL when a file is staged, or from the
 * passed-in `initialUrl` when the user is just looking at a saved draft.
 */
export function ScreenshotDropzone({
  initialUrl,
  file,
  onFileChange,
  onClear,
  uploading = false,
  uploaded = false,
  externalError,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Re-create the blob URL whenever the staged file changes. The blob URL
  // is only ours to revoke — the rehydrated initialUrl belongs to R2.
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

  const validate = useCallback((f: File): string | null => {
    if (!ALLOWED_IMAGE_MIME.includes(f.type as AllowedImageMime)) {
      return "Unsupported file type — use PNG, JPG, GIF, WEBP or SVG.";
    }
    if (f.size > MAX_BYTES) {
      return "File is over 5 MB.";
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (f: File) => {
      const err = validate(f);
      setLocalError(err);
      if (err) return;
      onFileChange(f);
    },
    [validate, onFileChange],
  );

  // Page-wide paste support. Defer to text fields so pasting a URL into the
  // URL input doesn't accidentally stage a (clipboard) image.
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const active = document.activeElement;
      const isTextField =
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement;
      const item = Array.from(e.clipboardData?.items ?? []).find((i) =>
        i.type.startsWith("image/"),
      );
      if (!item) return;
      if (isTextField && !zoneRef.current?.contains(active)) return;
      const f = item.getAsFile();
      if (!f) return;
      e.preventDefault();
      handleFile(f);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [handleFile]);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const clear = () => {
    setLocalError(null);
    onClear();
    if (inputRef.current) inputRef.current.value = "";
  };

  const visibleError = localError ?? externalError ?? null;

  return (
    <div
      ref={zoneRef}
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={cn(
        "group relative flex min-h-[240px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center transition-colors",
        dragOver
          ? "border-moss-500 bg-moss-100/40"
          : "border-cream-300 hover:border-moss-500 hover:bg-cream-50",
        previewSrc && "p-4",
        visibleError && "border-error/60",
      )}
      aria-label="Upload, drag and drop, or paste a screenshot"
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />

      {previewSrc ? (
        <PreviewLayer
          src={previewSrc}
          uploading={uploading}
          uploaded={uploaded && !file}
          stagedNotUploaded={!!file && !uploading}
          onClear={(e) => {
            e.stopPropagation();
            clear();
          }}
        />
      ) : (
        <EmptyLayer />
      )}

      {visibleError ? (
        <span role="alert" className="text-xs text-error">
          {visibleError}
        </span>
      ) : null}
    </div>
  );
}

function EmptyLayer() {
  return (
    <>
      <span
        aria-hidden
        className="flex h-16 w-16 items-center justify-center rounded-full border border-cream-300 bg-cream-50 text-moss-500 shadow-soft transition-transform group-hover:scale-110"
      >
        <CloudUpload className="h-6 w-6" strokeWidth={1.75} />
      </span>
      <div className="space-y-1">
        <p className="text-sm font-medium text-ink-700">
          Click, drag a file, or paste from clipboard
        </p>
        <p className="text-xs text-ink-50">
          PNG, JPG, GIF, WEBP or SVG · max 5 MB · uploaded when you submit
        </p>
      </div>
    </>
  );
}

function PreviewLayer({
  src,
  uploading,
  uploaded,
  stagedNotUploaded,
  onClear,
}: {
  src: string;
  uploading: boolean;
  uploaded: boolean;
  stagedNotUploaded: boolean;
  onClear: (e: React.MouseEvent) => void;
}) {
  return (
    <div className="relative w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Screenshot preview"
        className="mx-auto max-h-72 w-auto rounded-lg border border-cream-300 object-contain"
      />
      <button
        type="button"
        onClick={onClear}
        className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-cream-300 bg-cream-50 text-ink-500 shadow-soft hover:bg-cream-200"
        aria-label="Remove screenshot"
      >
        <X className="h-4 w-4" strokeWidth={2} aria-hidden />
      </button>

      <StatusBadge
        uploading={uploading}
        uploaded={uploaded}
        stagedNotUploaded={stagedNotUploaded}
      />
    </div>
  );
}

function StatusBadge({
  uploading,
  uploaded,
  stagedNotUploaded,
}: {
  uploading: boolean;
  uploaded: boolean;
  stagedNotUploaded: boolean;
}) {
  if (uploading) {
    return (
      <Pill tone="muted">
        <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} aria-hidden />
        Uploading…
      </Pill>
    );
  }
  if (uploaded) {
    return (
      <Pill tone="moss">
        <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        Saved
      </Pill>
    );
  }
  if (stagedNotUploaded) {
    return <Pill tone="muted">Ready · uploads on submit</Pill>;
  }
  return null;
}

function Pill({
  tone,
  children,
}: {
  tone: "muted" | "moss";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "absolute left-2 top-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wider shadow-soft",
        tone === "moss"
          ? "border-moss-600/30 bg-moss-100/60 text-moss-700"
          : "border-cream-300 bg-cream-50 text-ink-50",
      )}
    >
      {children}
    </span>
  );
}

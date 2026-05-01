"use client";

import { ArrowRight, Link2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ScreenshotDropzone } from "@/components/builds/screenshot-dropzone";
import { SubmissionSuccess } from "@/components/builds/submission-success";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import {
  BUILD_CATEGORIES,
  type BuildCategory,
  type DraftView,
  saveDraft,
  submitBuild,
} from "@/lib/api/builds";
import { presignScreenshot, uploadFileToR2 } from "@/lib/api/uploads";
import { cn } from "@/lib/utils";

interface Props {
  draft: DraftView;
}

interface FormState {
  buildUrl: string;
  /** Locally-staged file pending upload. Cleared once uploaded. */
  screenshotFile: File | null;
  /** Already-uploaded R2 URL (rehydrated from draft, or set after a successful upload). */
  screenshotUrl: string | null;
  writeup: string;
  buildName: string;
  category: BuildCategory | "";
}

interface FieldErrors {
  buildUrl?: string;
  screenshotUrl?: string;
  general?: string;
}

const WRITEUP_MAX = 4000;
const NAME_MAX = 120;

/**
 * Submit-a-build form.
 *
 * Storage discipline: the screenshot is NOT uploaded on paste/drop/select.
 * It's staged as a File in component state and only PUT to R2 when the user
 * clicks Save Draft or Submit Build. If the user changes their mind and
 * picks a different image, only the final file is uploaded.
 *
 * Terminal-state handling: if `draft.state === "submitted"` we render the
 * success view directly. After a successful in-page submit we flip to the
 * same view without remounting.
 */
export function SubmitForm({ draft }: Props) {
  const router = useRouter();

  const [completedAt, setCompletedAt] = useState<string | null>(
    draft.state === "submitted" ? draft.submitted_at : null,
  );

  const [form, setForm] = useState<FormState>({
    buildUrl: draft.build_url ?? "",
    screenshotFile: null,
    screenshotUrl: draft.build_screenshot_url,
    writeup: draft.build_writeup ?? "",
    buildName: draft.build_name ?? "",
    category: draft.build_category ?? "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [savingDraft, setSavingDraft] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<number | null>(null);

  if (completedAt) {
    return (
      <SubmissionSuccess
        ideaSlug={draft.idea_slug}
        ideaTitle={draft.idea_title}
        buildUrl={form.buildUrl || draft.build_url}
        buildName={form.buildName || draft.build_name}
        submittedAt={completedAt}
      />
    );
  }

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors.screenshotUrl && (key === "screenshotFile" || key === "screenshotUrl")) {
      setErrors((prev) => ({ ...prev, screenshotUrl: undefined, general: undefined }));
    } else if (errors[key as keyof FieldErrors] || errors.general) {
      setErrors((prev) => ({ ...prev, [key]: undefined, general: undefined }));
    }
  };

  /**
   * If a file is staged, PUT it to R2 and return its public URL. If only a
   * previously-uploaded URL exists, return that. Both states pulled into one
   * helper so Save Draft and Submit share identical upload semantics.
   */
  const ensureScreenshotUploaded = async (): Promise<string | null> => {
    if (!form.screenshotFile) return form.screenshotUrl;
    setUploading(true);
    try {
      const presigned = await presignScreenshot(
        form.screenshotFile.type,
        draft.unlock_id,
      );
      const url = await uploadFileToR2(presigned, form.screenshotFile);
      // Promote the staged file → uploaded URL so a subsequent click doesn't
      // re-upload the same bytes.
      setForm((prev) => ({ ...prev, screenshotFile: null, screenshotUrl: url }));
      return url;
    } finally {
      setUploading(false);
    }
  };

  const onSaveDraft = async () => {
    if (savingDraft || submitting) return;
    setSavingDraft(true);
    setErrors({});
    try {
      const screenshotUrl = await ensureScreenshotUploaded();
      await saveDraft(draft.unlock_id, {
        build_url: form.buildUrl.trim() || null,
        build_screenshot_url: screenshotUrl,
        build_writeup: form.writeup.trim() || null,
        build_name: form.buildName.trim() || null,
        build_category: form.category || null,
      });
      setDraftSavedAt(Date.now());
    } catch (err) {
      setErrors({
        general:
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Couldn't save draft. Try again.",
      });
    } finally {
      setSavingDraft(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || savingDraft) return;

    const localErrors: FieldErrors = {};
    const trimmedUrl = form.buildUrl.trim();
    if (!trimmedUrl) {
      localErrors.buildUrl = "Live URL is required.";
    } else if (!/^https?:\/\//i.test(trimmedUrl)) {
      localErrors.buildUrl = "URL must start with http:// or https://";
    }
    if (!form.screenshotFile && !form.screenshotUrl) {
      localErrors.screenshotUrl =
        "A screenshot is required. Upload one or paste from your clipboard.";
    }
    if (Object.keys(localErrors).length) {
      setErrors(localErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});
    try {
      const screenshotUrl = await ensureScreenshotUploaded();
      if (!screenshotUrl) {
        // Defensive: ensureScreenshotUploaded threw or the upload silently
        // produced no URL — surface as a regular submit error instead of
        // submitting an incomplete payload.
        throw new Error("Screenshot upload failed. Try picking the file again.");
      }
      const result = await submitBuild(draft.unlock_id, {
        build_url: trimmedUrl,
        build_screenshot_url: screenshotUrl,
        build_writeup: form.writeup.trim() || null,
        build_name: form.buildName.trim() || null,
        build_category: form.category || null,
      });
      setCompletedAt(result.submitted_at);
      router.refresh();
    } catch (err) {
      setErrors({
        general:
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Couldn't submit. Try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-10" noValidate>
      <fieldset className="space-y-8" disabled={submitting}>
        <Field
          label="Live URL"
          hint="Where can we see the finished product? Must be publicly accessible."
          htmlFor="build_url"
          error={errors.buildUrl}
        >
          <div className="relative">
            <Link2
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-400"
              strokeWidth={1.75}
              aria-hidden
            />
            <input
              id="build_url"
              type="url"
              inputMode="url"
              placeholder="https://yourproject.com"
              required
              value={form.buildUrl}
              onChange={(e) => update("buildUrl", e.target.value)}
              className={cn(
                "w-full rounded-lg border bg-cream-50 py-3 pl-10 pr-4 text-base text-ink-700 outline-none transition-colors placeholder:text-cream-400",
                "focus:border-moss-500 focus:ring-1 focus:ring-moss-500/40",
                errors.buildUrl ? "border-error/60" : "border-cream-300",
              )}
            />
          </div>
        </Field>

        <Field
          label="Proof of life (screenshot)"
          hint="Upload a clear screenshot, drag a file in, or paste from clipboard. PNG, JPG, GIF, WEBP, or SVG — max 5 MB. We only upload to R2 once you Save Draft or Submit."
          error={errors.screenshotUrl}
        >
          <ScreenshotDropzone
            initialUrl={form.screenshotUrl}
            file={form.screenshotFile}
            onFileChange={(f) => update("screenshotFile", f)}
            onClear={() => {
              setForm((prev) => ({
                ...prev,
                screenshotFile: null,
                screenshotUrl: null,
              }));
              setErrors((prev) => ({ ...prev, screenshotUrl: undefined }));
            }}
            uploading={uploading}
            uploaded={!!form.screenshotUrl && !form.screenshotFile && !!draftSavedAt}
            externalError={errors.screenshotUrl}
          />
        </Field>

        <Field
          label="Build name"
          hint="What did you call it? Shown on the gallery card."
          htmlFor="build_name"
        >
          <input
            id="build_name"
            type="text"
            maxLength={NAME_MAX}
            placeholder="e.g. Nimbus Analytics"
            value={form.buildName}
            onChange={(e) => update("buildName", e.target.value)}
            className="w-full rounded-lg border border-cream-300 bg-cream-50 px-4 py-3 text-base text-ink-700 outline-none transition-colors placeholder:text-cream-400 focus:border-moss-500 focus:ring-1 focus:ring-moss-500/40"
          />
        </Field>

        <Field label="Category" hint="Helps us file your build in the gallery.">
          <div className="flex flex-wrap gap-2">
            {BUILD_CATEGORIES.map((c) => {
              const active = form.category === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => update("category", active ? "" : c)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors",
                    active
                      ? "border-moss-600 bg-moss-100 text-moss-700"
                      : "border-cream-300 bg-cream-50 text-ink-50 hover:bg-cream-200",
                  )}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </Field>

        <Field
          label="The journey (optional)"
          hint="What went well? What broke? Brief notes for the archive."
          htmlFor="writeup"
          counter={`${form.writeup.length} / ${WRITEUP_MAX}`}
        >
          <textarea
            id="writeup"
            rows={5}
            maxLength={WRITEUP_MAX}
            placeholder="We originally planned to use Postgres, but pivoted to SQLite for simplicity…"
            value={form.writeup}
            onChange={(e) => update("writeup", e.target.value)}
            className="w-full resize-y rounded-lg border border-cream-300 bg-cream-50 p-4 text-base text-ink-700 outline-none transition-colors placeholder:text-cream-400 focus:border-moss-500 focus:ring-1 focus:ring-moss-500/40"
          />
        </Field>
      </fieldset>

      {errors.general ? (
        <p
          role="alert"
          className="rounded-md border border-error/40 bg-plum-100/40 px-4 py-3 text-sm text-error"
        >
          {errors.general}
        </p>
      ) : null}

      <div className="flex flex-col items-stretch justify-between gap-3 border-t border-cream-300 pt-6 sm:flex-row sm:items-center">
        <SaveDraftBadge savedAt={draftSavedAt} />
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="secondary"
            onClick={onSaveDraft}
            loading={savingDraft || (uploading && !submitting)}
            disabled={submitting}
            className="rounded-xl"
          >
            Save Draft
          </Button>
          <Button
            type="submit"
            loading={submitting || (uploading && !savingDraft)}
            disabled={savingDraft}
            className="rounded-xl"
          >
            Submit Build
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
          </Button>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  htmlFor,
  error,
  counter,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  error?: string;
  counter?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor={htmlFor}
          className="block text-base font-medium text-ink-700"
        >
          {label}
        </label>
        {counter ? (
          <span className="font-mono text-[11px] text-cream-400">{counter}</span>
        ) : null}
      </div>
      {hint ? <p className="text-sm leading-relaxed text-ink-50">{hint}</p> : null}
      {children}
      {error ? (
        <p role="alert" className="text-xs text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SaveDraftBadge({ savedAt }: { savedAt: number | null }) {
  if (!savedAt) return <span className="hidden sm:block" aria-hidden />;
  const seconds = Math.max(1, Math.round((Date.now() - savedAt) / 1000));
  return (
    <span className="text-xs text-ink-50">
      Draft saved{seconds < 5 ? " just now" : ` ${seconds}s ago`}.
    </span>
  );
}

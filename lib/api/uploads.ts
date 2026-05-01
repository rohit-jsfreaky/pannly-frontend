/**
 * Direct-to-R2 screenshot uploads.
 *
 * Two-step flow:
 *   1. presignScreenshot(contentType, unlockId?) → backend signs an R2 PUT URL
 *   2. uploadFileToR2(presigned, file)           → browser PUTs file to R2
 *
 * The API never sees the bytes. We use **PUT** (not POST) because Cloudflare
 * R2 returns 501 on the S3 multipart-form POST endpoint — only PUT works.
 */

import { apiPost } from "@/lib/api-client";

export const ALLOWED_IMAGE_MIME = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
  "image/svg+xml",
] as const;

export type AllowedImageMime = (typeof ALLOWED_IMAGE_MIME)[number];

export interface PresignResponse {
  upload_url: string;
  method: "PUT";
  headers: Record<string, string>;
  object_key: string;
  object_url: string;
  expires_in_seconds: number;
  max_bytes: number;
  allowed_content_types: string[];
}

export const presignScreenshot = (contentType: string, unlockId?: string) =>
  apiPost<PresignResponse>("/v1/uploads/screenshot/presign", {
    content_type: contentType,
    unlock_id: unlockId ?? null,
  });

/**
 * PUT a file to R2 using a presigned URL. Sends the file as the request body
 * with the `Content-Type` header from the presign response (this header is
 * part of what the URL signed, so the upload fails if it's mismatched).
 */
export async function uploadFileToR2(
  presigned: PresignResponse,
  file: File,
  signal?: AbortSignal,
): Promise<string> {
  const res = await fetch(presigned.upload_url, {
    method: presigned.method,
    headers: presigned.headers,
    body: file,
    signal,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `R2 rejected upload (${res.status}): ${detail.slice(0, 200) || res.statusText}`,
    );
  }

  return presigned.object_url;
}

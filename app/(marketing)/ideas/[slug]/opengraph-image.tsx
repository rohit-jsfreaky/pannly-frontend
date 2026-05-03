import { apiGet } from "@/lib/api-client";
import type { IdeaDetailResponse } from "@/lib/api/ideas";
import {
  ogSize as size,
  ogContentType as contentType,
  renderPannlyOg,
} from "@/lib/seo/og-template";

export const runtime = "nodejs"; // apiGet uses fetch with cookies — Node runtime is safer here
export const alt = "Pannly idea brief";
export { size, contentType };

interface Props {
  params: { slug: string };
}

/**
 * Per-idea OG image: pulls the public idea row server-side and renders the
 * title + one-line pain into our standard cream/moss/Fraunces template.
 *
 * Failure mode: if the backend is unreachable, fall back to the generic
 * Pannly headline so the share preview is never broken.
 */
export default async function Image({ params }: Props) {
  const data = await safeFetch(params.slug);
  if (!data) {
    return renderPannlyOg({
      eyebrow: "Idea brief",
      headline: "Pannly — find an idea worth building.",
      sub: "$3 to unlock. Refunded if you ship within 30 days.",
    });
  }
  const score =
    typeof data.idea.overall_score === "number"
      ? `Score ${data.idea.overall_score} · ${data.idea.tags.slice(0, 3).join(" · ")}`
      : data.idea.tags.slice(0, 3).join(" · ");
  const dollars = (data.idea.unlock_price_cents / 100).toFixed(0);
  return renderPannlyOg({
    eyebrow: score || "Idea brief",
    headline: data.idea.title,
    sub: data.idea.one_line_pain ?? undefined,
    tag: `$${dollars} · refunded if you ship`,
  });
}

async function safeFetch(slug: string): Promise<IdeaDetailResponse | null> {
  try {
    return await apiGet<IdeaDetailResponse>(
      `/v1/ideas/${encodeURIComponent(slug)}`,
      { next: { revalidate: 300 } },
    );
  } catch {
    return null;
  }
}

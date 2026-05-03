import { ogSize as size, ogContentType as contentType, renderPannlyOg } from "@/lib/seo/og-template";

export const runtime = "edge";
export const alt = "Pannly Feed — pain points from real builders, scored, briefed, and ready to unlock for $3.";
export { size, contentType };

export default function Image() {
  return renderPannlyOg({
    eyebrow: "The feed",
    headline: "Pain points from real builders. Scored, briefed, ready to unlock.",
    sub: "$3 per brief. Refunded if you ship within 30 days.",
  });
}

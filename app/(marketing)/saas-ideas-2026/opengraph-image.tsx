import { ogSize as size, ogContentType as contentType, renderPannlyOg } from "@/lib/seo/og-template";

export const runtime = "edge";
export const alt = "SaaS ideas for 2026, backed by real Reddit pain — Pannly.";
export { size, contentType };

export default function Image() {
  return renderPannlyOg({
    eyebrow: "SaaS ideas · 2026",
    headline: "SaaS ideas for 2026, backed by real Reddit pain.",
    sub: "Scored from real demand. Not brainstormed.",
  });
}

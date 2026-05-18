import { ogSize as size, ogContentType as contentType, renderPannlyOg } from "@/lib/seo/og-template";

export const runtime = "edge";
export const alt = "The best GummySearch alternative in 2026 — Pannly.";
export { size, contentType };

export default function Image() {
  return renderPannlyOg({
    eyebrow: "GummySearch alternative",
    headline: "GummySearch shut down. Here's what to use instead.",
    sub: "Validated SaaS ideas from real Reddit & HN pain.",
  });
}

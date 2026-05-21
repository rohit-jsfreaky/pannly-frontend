import { ogSize as size, ogContentType as contentType, renderPannlyOg } from "@/lib/seo/og-template";

export const runtime = "edge";
export const alt = "Startup ideas worth building in 2026, from real founder pain — Pannly.";
export { size, contentType };

export default function Image() {
  return renderPannlyOg({
    eyebrow: "Startup ideas",
    headline: "Startup ideas worth building in 2026.",
    sub: "Software ideas grounded in real demand, by category.",
  });
}

import { ogSize as size, ogContentType as contentType, renderPannlyOg } from "@/lib/seo/og-template";

export const runtime = "edge";
export const alt = "Micro SaaS ideas from real Reddit threads — Pannly.";
export { size, contentType };

export default function Image() {
  return renderPannlyOg({
    eyebrow: "Micro SaaS ideas",
    headline: "Micro SaaS ideas from real Reddit threads.",
    sub: "Scored on demand. Linked to the receipts.",
  });
}

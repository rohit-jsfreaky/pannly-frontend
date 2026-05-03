import { ogSize as size, ogContentType as contentType, renderPannlyOg } from "@/lib/seo/og-template";

export const runtime = "edge";
export const alt = "How Pannly works — from a Reddit complaint to a refunded build.";
export { size, contentType };

export default function Image() {
  return renderPannlyOg({
    eyebrow: "How it works",
    headline: "From a Reddit complaint to a refunded build.",
    sub: "Crawl. Score. Brief. Unlock. Ship. Refund.",
  });
}

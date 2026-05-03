import { ogSize as size, ogContentType as contentType, renderPannlyOg } from "@/lib/seo/og-template";

export const runtime = "edge";
export const alt = "Pannly — Find an idea worth building. Get refunded if you actually ship.";
export { size, contentType };

export default function Image() {
  return renderPannlyOg({
    eyebrow: "Indie idea finder · Build in public",
    headline: "Find an idea worth building. Get refunded if you actually ship.",
    sub: "Sourced from Reddit and Hacker News. Priced at $3 per brief.",
  });
}

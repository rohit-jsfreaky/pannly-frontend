import { ogSize as size, ogContentType as contentType, renderPannlyOg } from "@/lib/seo/og-template";

export const runtime = "edge";
export const alt = "Pannly Build Gallery — every project here got a refund.";
export { size, contentType };

export default function Image() {
  return renderPannlyOg({
    eyebrow: "Build Gallery",
    headline: "Real builders shipping real products.",
    sub: "Every project in the gallery started as a $3 idea unlock — and got refunded.",
  });
}

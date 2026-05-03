import { ogSize as size, ogContentType as contentType, renderPannlyOg } from "@/lib/seo/og-template";

export const runtime = "edge";
export const alt = "Pannly Pricing — $3 per unlock, refunded on ship. $15/mo Pro for unlimited.";
export { size, contentType };

export default function Image() {
  return renderPannlyOg({
    eyebrow: "Pricing",
    headline: "Three ways to use Pannly.",
    sub: "Free to browse. $3 per unlock — refunded on ship. $15/mo Pro for unlimited.",
    tag: "Cancel anytime",
  });
}

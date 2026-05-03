import { ogSize as size, ogContentType as contentType, renderPannlyOg } from "@/lib/seo/og-template";

export const runtime = "edge";
export const alt = "Pannly refunds — public ledger of every refund issued to builders who shipped.";
export { size, contentType };

export default function Image() {
  return renderPannlyOg({
    eyebrow: "Refunds · public ledger",
    headline: "Refunded to builders who actually shipped.",
    sub: "Every refund Pannly has issued is publicly listed. No 'trusted by thousands' math.",
  });
}

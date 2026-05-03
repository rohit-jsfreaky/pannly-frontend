import { ogSize as size, ogContentType as contentType, renderPannlyOg } from "@/lib/seo/og-template";

export const runtime = "edge";
export const alt = "About Pannly — built in public from India by an indie founder.";
export { size, contentType };

export default function Image() {
  return renderPannlyOg({
    eyebrow: "About",
    headline: "Why Pannly exists.",
    sub: "A quiet space for builders. Built in public from India.",
  });
}

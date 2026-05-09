/**
 * Generate Pannly's social-share OG image via Nano Banana 2 (fal.ai).
 *
 * Run with:  node --env-file=.env.local scripts/generate-og-image.mjs
 *
 * Output:    public/og-default.png (1200×630, 16:9 nearest, deterministic seed)
 *
 * The prompt below is intentionally specific. Generic "modern SaaS gradient"
 * prompts come back generic. We anchor on:
 *   - Editorial / publisher feel (not slick SaaS)
 *   - Brand palette: deep moss-green primary, warm cream paper background,
 *     soft terracotta accent
 *   - Hand-set serif typography (matches the site's Fraunces wordmark)
 *   - Subject: a still-life "found notebook" composition that hints at the
 *     product (curated ideas worth building)
 *
 * If the rendered text comes back imperfect, regenerate with a different
 * seed; nano-banana-2 is decent at typography but not deterministic across
 * regenerations. The overall composition tends to be stable.
 */

import { writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, "..", "public", "og-default.png");

const PROMPT = `An elegant editorial brand banner, 16:9 landscape composition, photographed flat-lay style from directly above.

The scene: a warm cream-colored linen surface with subtle paper grain, softly lit by morning daylight from the upper left creating gentle natural shadows. Centered on the surface is a single small open notebook with cream pages and a deep moss-green leather cover, slightly tilted. Beside it lies a fountain pen with a brass nib and dark moss-green resin barrel, the cap removed. A few small dried eucalyptus sprigs and a single tiny terracotta-clay bookmark are arranged with intentional negative space.

Composed with a calm, considered editorial sensibility — like a William Morris-meets-modern-minimal aesthetic. NOT slick SaaS gradients. NOT digital UI. NOT 3D rendered. Real photographic feel, soft focus, shallow depth of field.

Across the top half of the image, hand-set serif typography in deep moss-green ink reads "pannly." in a Fraunces-style display serif, the period rendered in a rusty terracotta color. Below the wordmark, in smaller modern sans-serif italic, reads "find an idea worth building."

Color palette strictly: warm cream (#faf9f7), deep moss-green (#2a4c3f), rusty terracotta (#613b38), and natural paper tones. No bright white, no neon, no purple, no orange.

Highly detailed, magazine-quality, art-directed product photography vibe.`;

async function main() {
  const apiKey = process.env.FAL_API_KEY;
  if (!apiKey) {
    console.error("FAL_API_KEY missing. Run with: node --env-file=.env.local scripts/generate-og-image.mjs");
    process.exit(1);
  }

  console.log("Calling fal-ai/nano-banana-2 …");
  const startedAt = Date.now();
  const res = await fetch("https://fal.run/fal-ai/nano-banana-2", {
    method: "POST",
    headers: {
      Authorization: `Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: PROMPT,
      num_images: 1,
      aspect_ratio: "16:9",
      output_format: "png",
      resolution: "2K",          // 2K (≈ 2048×1152) keeps text readable when downscaled to 1200×630
      thinking_level: "high",    // small extra cost ($0.002), big quality win for typography
      limit_generations: true,
      safety_tolerance: "4",
    }),
  });

  if (!res.ok) {
    console.error(`fal.ai error ${res.status}:`, await res.text());
    process.exit(1);
  }

  const payload = await res.json();
  const url = payload?.images?.[0]?.url;
  if (!url) {
    console.error("No image URL in response:", payload);
    process.exit(1);
  }

  console.log(`Generated in ${((Date.now() - startedAt) / 1000).toFixed(1)}s — downloading …`);
  const imgRes = await fetch(url);
  if (!imgRes.ok) {
    console.error("Failed to download generated image:", imgRes.status);
    process.exit(1);
  }
  const buf = Buffer.from(await imgRes.arrayBuffer());

  // Downscale to OG canonical 1200×630 to keep file size sane and dimensions
  // honest. Most social platforms want exactly 1200×630.
  const sharp = (await import("sharp")).default;
  await mkdir(dirname(OUT_PATH), { recursive: true });
  await sharp(buf)
    .resize(1200, 630, { fit: "cover" })
    .png({ compressionLevel: 9, palette: false })
    .toFile(OUT_PATH);

  console.log(`✔ Saved ${OUT_PATH}`);
  if (payload.description) console.log(`Model description: ${payload.description}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

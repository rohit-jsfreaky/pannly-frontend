/**
 * Generate Pannly's brand icon (square, used as the favicon source).
 *
 * Run with:  node --env-file=.env.local scripts/generate-icon.mjs
 *
 * Output:    public/icon-source.png (1024×1024, transparent or solid moss bg)
 *
 * Concept (intentional, not just letter "P"):
 *   A minimalist compass-rose mark intersected with a bookmarked-page corner.
 *   Compass = Pannly's existing brand motif (the auth-shell illustration
 *   already uses one). Bookmark = "curated idea worth building, saved for
 *   later". The two glyphs blend into a single distinctive icon that reads
 *   well at 16px, 32px, and 512px.
 *
 * Single-color (deep moss-green) on transparent background so it composites
 * cleanly on light + dark UI surfaces. Geometric, not painterly — flat icon
 * design language.
 */

import { writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, "..", "public", "icon-source.png");

const PROMPT = `A minimalist app icon, perfectly centered, square 1:1 composition.

The mark: a single compass-rose symbol fused with a bookmark page-corner. The compass has four cardinal points forming a slim diamond/star shape (north pointing up, slightly elongated), with a small circular center. The bookmark element is a subtle ribbon descending from one of the compass arms, evoking a "saved page" — but rendered as a continuous line-art form, not a separate object.

Style: flat icon design, single-color silhouette, geometric and confident lines, generous negative space, balanced positive/negative ratio (mark occupies roughly 60% of the canvas). Inspired by minimal Apple-app-icon aesthetics from companies like Things 3 or Linear — refined, considered, distinctive at 16-pixel scale.

Color: deep moss-green (#2a4c3f) glyph on a warm cream (#faf9f7) circular background filling the canvas with rounded-square iOS-style padding (subtle, not extreme). The background fill should NOT be pure white. A very faint inner shadow at the edges to suggest depth, but stay flat overall.

Strictly NO letter "P" or any letterform. NO text. NO gradient backgrounds. NO 3D rendering. NO emoji. NO drop shadows behind the icon. NO photographic elements. Pure geometric vector-feel illustration.

Highly polished, suitable as a favicon at 16x16 pixels and as an app icon at 1024x1024 pixels.`;

async function main() {
  const apiKey = process.env.FAL_API_KEY;
  if (!apiKey) {
    console.error("FAL_API_KEY missing. Run with: node --env-file=.env.local scripts/generate-icon.mjs");
    process.exit(1);
  }

  console.log("Calling fal-ai/nano-banana-2 (icon) …");
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
      aspect_ratio: "1:1",
      output_format: "png",
      resolution: "1K",          // 1024×1024 — enough for app-icon size, source for favicon downscales
      thinking_level: "high",
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
    console.error("Failed to download:", imgRes.status);
    process.exit(1);
  }
  const buf = Buffer.from(await imgRes.arrayBuffer());

  // Normalise to 1024×1024 PNG, kept as the source for the favicon converter.
  const sharp = (await import("sharp")).default;
  await mkdir(dirname(OUT_PATH), { recursive: true });
  await sharp(buf)
    .resize(1024, 1024, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toFile(OUT_PATH);

  console.log(`✔ Saved ${OUT_PATH}`);
  console.log("Next: run `node scripts/png-to-favicons.mjs` to fan out into favicon sizes.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

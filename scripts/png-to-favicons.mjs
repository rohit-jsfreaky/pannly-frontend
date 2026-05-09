/**
 * Fan out one source PNG into every favicon size browsers, iOS, and PWAs need.
 *
 * Run with:  node scripts/png-to-favicons.mjs
 * (No FAL key required — purely local image transforms.)
 *
 * Reads:     public/icon-source.png  (1024×1024 from generate-icon.mjs)
 * Writes to public/:
 *   - favicon.ico              multi-resolution: 16, 32, 48
 *   - favicon-16x16.png
 *   - favicon-32x32.png
 *   - apple-touch-icon.png     180×180
 *   - icon-192.png             PWA manifest
 *   - icon-512.png             PWA manifest, also used as Organization JSON-LD logo source
 *
 * Re-running is safe — sharp + png-to-ico are deterministic given the same input.
 */

import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "..", "public");
const SOURCE = join(PUBLIC_DIR, "icon-source.png");

const PNG_SIZES = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
];

const ICO_SIZES = [16, 32, 48]; // multi-res .ico for legacy browsers / Windows

async function main() {
  try {
    await access(SOURCE);
  } catch {
    console.error(`Missing ${SOURCE}.`);
    console.error("Run `node --env-file=.env.local scripts/generate-icon.mjs` first.");
    process.exit(1);
  }

  const sharp = (await import("sharp")).default;
  const pngToIco = (await import("png-to-ico")).default;

  await mkdir(PUBLIC_DIR, { recursive: true });

  // PNG fan-out.
  for (const { name, size } of PNG_SIZES) {
    const out = join(PUBLIC_DIR, name);
    await sharp(SOURCE)
      .resize(size, size, { fit: "cover", kernel: "lanczos3" })
      .png({ compressionLevel: 9 })
      .toFile(out);
    console.log(`✔ ${name}  (${size}×${size})`);
  }

  // .ico (multi-resolution). png-to-ico takes Buffer[] of pre-sized PNGs.
  const icoBuffers = await Promise.all(
    ICO_SIZES.map((size) =>
      sharp(SOURCE)
        .resize(size, size, { fit: "cover", kernel: "lanczos3" })
        .png({ compressionLevel: 9 })
        .toBuffer(),
    ),
  );
  const icoBuf = await pngToIco(icoBuffers);
  await writeFile(join(PUBLIC_DIR, "favicon.ico"), icoBuf);
  console.log(`✔ favicon.ico  (${ICO_SIZES.join(", ")})`);

  console.log("\nDone. Check public/ — you should see 6 new files.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

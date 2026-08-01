// One-off/rerunnable script that derives all web-ready brand assets from the
// raw source files in D:\moneydoor (kept outside this project on purpose).
// Run with: node scripts/process-brand-assets.mjs
import sharp from "sharp";
import pngToIco from "png-to-ico";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE = path.resolve(__dirname, "../../"); // D:\moneydoor
const WEBSITE = path.resolve(__dirname, "../"); // D:\moneydoor\website

const LOGO = path.join(SOURCE, "WhatsApp Image 2026-07-29 at 06.24.32.jpeg");
const TRAINER_SLIDE = path.join(SOURCE, "3.png");
const TITLE_SLIDE = path.join(SOURCE, "1.png");

const ASSETS_BRAND = path.join(WEBSITE, "src/assets/brand");
const ASSETS_TEAM = path.join(WEBSITE, "src/assets/team");
const PUBLIC = path.join(WEBSITE, "public");
const PUBLIC_OG = path.join(PUBLIC, "images/og");

async function ensureDirs() {
  for (const dir of [ASSETS_BRAND, ASSETS_TEAM, PUBLIC, PUBLIC_OG]) {
    await mkdir(dir, { recursive: true });
  }
}

async function processLogo() {
  // Full badge (ring + wordmark) — used anywhere there's enough room to read it.
  await sharp(LOGO)
    .resize(800, 800)
    .jpeg({ quality: 92 })
    .toFile(path.join(ASSETS_BRAND, "logo-mark.jpg"));

  // Tight crop around just the monogram (no ring, no small text) for tiny icon sizes.
  const monogram = sharp(LOGO).extract({ left: 320, top: 120, width: 620, height: 620 });

  const sizes = [
    { file: "favicon-16x16.png", size: 16 },
    { file: "favicon-32x32.png", size: 32 },
    { file: "apple-touch-icon.png", size: 180 },
    { file: "android-chrome-192x192.png", size: 192 },
    { file: "android-chrome-512x512.png", size: 512 },
  ];

  for (const { file, size } of sizes) {
    const source = size <= 48 ? monogram.clone() : sharp(LOGO);
    await source.resize(size, size).png().toFile(path.join(PUBLIC, file));
  }

  // Multi-resolution .ico from the monogram crop (16/32/48)
  const icoBuffers = await Promise.all(
    [16, 32, 48].map((size) =>
      monogram.clone().resize(size, size).png().toBuffer()
    )
  );
  const icoBuffer = await pngToIco(icoBuffers);
  await writeFile(path.join(PUBLIC, "favicon.ico"), icoBuffer);

  await writeFile(
    path.join(PUBLIC, "site.webmanifest"),
    JSON.stringify(
      {
        name: "Money Door FX Academy",
        short_name: "Money Door FX",
        icons: [
          { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
        ],
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
      },
      null,
      2
    )
  );

  console.log("Logo + favicon set done.");
}

async function processTrainerPhoto() {
  // Just the photo (no slide text), for use as a portrait/thumbnail.
  await sharp(TRAINER_SLIDE)
    .extract({ left: 95, top: 250, width: 850, height: 655 })
    .jpeg({ quality: 90 })
    .toFile(path.join(ASSETS_TEAM, "venkatesh-m-portrait.jpg"));

  // The full designed slide (photo + bio + logo), for a richer section visual.
  await sharp(TRAINER_SLIDE)
    .resize(1600, 900)
    .jpeg({ quality: 88 })
    .toFile(path.join(ASSETS_TEAM, "venkatesh-m-forex-expo-slide.jpg"));

  console.log("Trainer photos done.");
}

async function processOgImage() {
  await sharp(TITLE_SLIDE)
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .jpeg({ quality: 90 })
    .toFile(path.join(PUBLIC_OG, "og-default.jpg"));

  console.log("Default OG image done.");
}

await ensureDirs();
await processLogo();
await processTrainerPhoto();
await processOgImage();
console.log("\nAll brand assets processed. Review the crops before relying on them:");
console.log(" - src/assets/team/venkatesh-m-portrait.jpg (verify framing)");
console.log(" - public/favicon-16x16.png, favicon-32x32.png (verify legibility)");

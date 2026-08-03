// Extracts the gold-bull hero visual from the client's approved design mockup
// and writes it into both worktrees (current redesign + `old` branch).
//
// Note on provenance: the bull is baked into the mockup the client commissioned
// rather than supplied as a separate licensed file, so this is a re-crop of
// their own design artwork. If a higher-resolution original ever turns up,
// drop it in and re-run — the markup references a stable filename.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const MOCKUP = path.join(ROOT, "WhatsApp Image 2026-07-29 at 06.28.20.jpeg");

// Both checkouts get the asset so the two branches stay runnable side by side.
const TARGETS = [
  path.join(ROOT, "website/src/assets/brand"),
  path.join(ROOT, "money-door-old/src/assets/brand"),
];

// Hero panel in the mockup: gold bull on its plinth over the candlestick backdrop.
const REGION = { left: 500, top: 55, width: 510, height: 330 };
const SCALE = 3;

const base = sharp(MOCKUP)
  .extract(REGION)
  .resize(REGION.width * SCALE, REGION.height * SCALE, { kernel: sharp.kernel.lanczos3 })
  // Gentle sharpen to recover edge definition lost in the upscale.
  .sharpen({ sigma: 1.1, m1: 0.5, m2: 0.7 })
  // The mockup's backdrop is dark navy, which reads as a visible rectangle
  // against the site's true-black page. Crushing the shadows toward #000 lets
  // the edges dissolve, while the gold bull and candlesticks stay bright.
  .linear(1.22, -26);

for (const dir of TARGETS) {
  try {
    await mkdir(dir, { recursive: true });
  } catch {
    // target worktree may not exist on a given machine — skip it rather than fail
    continue;
  }
  const out = path.join(dir, "hero-gold-bull.png");
  await base.clone().png({ quality: 95 }).toFile(out);
  console.log("wrote", out);
}

console.log(`\nSource region ${REGION.width}x${REGION.height} → ${REGION.width * SCALE}x${REGION.height * SCALE}`);

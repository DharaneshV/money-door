import { getImage } from "astro:assets";
import heroBullSrc from "../assets/brand/hero-gold-bull.png";

// Both the intro overlay and the hero render the bull. Resolving the image
// once here guarantees they emit the *same* URL — matching <Image> props by
// hand is fragile, and one differing prop would silently double the ~345 KB
// download and cost the intro its LCP head start.
export const heroBull = await getImage({
  src: heroBullSrc,
  width: 1530,
  height: 990,
  format: "webp",
});

export const heroBullAlt =
  "Gold bull statue set against a rising Gold (XAU/USD) candlestick chart";

# Chief Trainer — event photos

Drop the photos in here and they appear on `/chief-trainer/` automatically.
No code change is needed: the gallery globs this folder at build time.

## Filenames

Ordering on the page is by filename, so keep the numeric prefix. These four
stems have captions already written in `TrainerGallery.astro`:

| File                              | Caption shown                                                    |
| --------------------------------- | ---------------------------------------------------------------- |
| `01-money-expo.jpg`               | Money Expo — India                                               |
| `02-forex-expo-broker-hall.jpg`   | Forex Expo — Dubai                                               |
| `03-forex-expo-keynote.jpg`       | "Empowering Traders through Education and Excellence" — Forex Expo 2023, Dubai |
| `04-money-expo-floor.jpg`         | Money Expo — Exhibition floor                                    |

A photo with any other name still shows, just without a caption — add an entry
to `CAPTIONS` in `TrainerGallery.astro` to give it one.

## Format

- `.jpg`, `.jpeg`, `.png`, `.webp` or `.avif` all work.
- Astro resizes and converts these at build time, so upload the **originals** —
  don't pre-compress or pre-crop them.
- Frames are a fixed 3:4 portrait ratio and the image is centre-cropped to fit,
  so leave a little headroom around the subject.

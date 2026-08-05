# Partner logos

Drop a logo here named after the partner's `slug` in `src/data/site.ts`:

    fundingpips
    moneta-funded
    hfm
    justmarkets
    nys-markets
    valetax
    vigco
    mmsa

Accepted extensions, in priority order: `.svg`, `.png`, `.webp`, `.jpg`, `.jpeg`
— so `hfm.svg` or `hfm.png` both work. The file is picked up automatically at
build time; no code change is needed. Until one exists, a gold monogram tile
stands in.

Get the files from each partner's **affiliate media kit / press page**. Don't
hotlink their CDN: they can move or block the asset without warning, and it
leaks your visitors' requests to a third party.

Prefer SVG, or a PNG with a transparent background. Every surface on this site
is dark, so a logo baked onto a white rectangle will show as a white box — use
the light/reversed version each partner supplies for dark backgrounds.

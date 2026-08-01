# Money Door FX Academy — Website

The official website for Money Door FX Academy (Chennai, India) — a Gold (XAU/USD) and Forex trading education academy.

**Live site:** _(add the URL once the domain is connected)_

---

## Quick facts

| | |
|---|---|
| **Built with** | [Astro](https://docs.astro.build) (static site) + Tailwind CSS v4 |
| **Hosted on** | Cloudflare Pages (free tier) |
| **Deploys** | Automatically — every push to the `main` branch rebuilds and publishes the site |
| **JavaScript shipped** | Essentially none — the site is plain HTML + CSS, which is why it loads fast |
| **Total site weight** | ~1.8 MB for all 26 pages |

---

## Running it on your own computer

You need [Node.js](https://nodejs.org) v22 or newer installed. Then:

```bash
npm install       # once, to download dependencies
npm run dev       # start a live preview at http://localhost:4321
npm run build     # produce the production site into dist/
npm run preview   # preview the production build locally
```

---

## Where things live

```
src/
├── data/site.ts        ← Phone numbers, email, address, nav menu, social links.
│                          Change contact details HERE, not in individual pages.
├── content/
│   ├── programs/       ← MDC1/MDC2/MDC3 details: price, duration, what's covered
│   ├── blog/           ← Blog posts (one .md file each)
│   ├── faq/            ← FAQ questions & answers (one .md file each)
│   └── testimonials/   ← Student reviews (see "Add a testimonial" below)
├── pages/              ← One file per page of the site
├── components/         ← Reusable pieces (header, footer, cards, buttons)
├── assets/             ← Logo and photos
└── styles/global.css   ← Brand colours and fonts

public/                 ← Favicons, robots.txt (served as-is)
scripts/
└── process-brand-assets.mjs  ← Regenerates favicons/photos from the original
                                 source files in the parent folder
```

---

## Common edits

### Change a phone number, email, or address
Edit `src/data/site.ts`. It updates everywhere at once — header, footer, contact page, and the WhatsApp button.

### Change a course price or duration
Edit the matching file in `src/content/programs/` (`mdc1.md`, `mdc2.md`, `mdc3.md`). The change flows through to the homepage, the courses page, and the individual course page automatically.

### Add a blog post
Create a new `.md` file in `src/content/blog/`. Copy an existing post's header block and change the values:

```markdown
---
title: "Your Post Title"
description: "A one-sentence summary — shows on the blog listing and in Google results."
publishDate: 2026-08-15
category: "Risk Management"   # or: Trading Psychology, Beginner Guides, Gold Market Analysis, Strategy
---

Write the post here using normal text. Use ## for section headings.
```

The filename becomes the web address, so `my-new-post.md` → `/blog/my-new-post/`.

### Add a testimonial
See `src/content/testimonials/_example-template.md` for the format. **Only add reviews students have actually given and agreed to publish** — the section stays hidden until at least one has `published: true`. Keep the focus on what students learned rather than profit figures.

### Add an FAQ
Create a new `.md` file in `src/content/faq/` following the same pattern as the existing ones. The `order` number controls where it appears in the list.

---

## Before going fully live — remaining setup

These are marked with `TODO` in the code:

1. **Contact form** — create a free account at [web3forms.com](https://web3forms.com) using the academy's email, then paste the access key into `web3FormsAccessKey` in `src/data/site.ts`. Until this is set, the contact page shows WhatsApp/phone/email details instead of a form, so nothing fails silently.
2. **Domain** — once purchased, update `SITE_URL` in `astro.config.mjs`, `url` in `src/data/site.ts`, and the sitemap line in `public/robots.txt`.
3. **Social media links** — add the real profile URLs to `socials` in `src/data/site.ts`. Any left as `null` simply won't render, so there are no dead links.
4. **Legal pages** — the Privacy Policy, Terms & Conditions, and Risk Disclaimer are honest starting drafts, but should be reviewed by a lawyer before taking student payments.
5. **Confirm the two phone numbers** — which is the primary WhatsApp line, and whether both should be public.

---

## Content decisions worth preserving

A few things were built deliberately. If you change them, do so knowingly:

- **No fabricated testimonials.** The original design mockup contained sample reviews with invented student names. Those were not carried over — the section shows an honest "coming soon" state until real reviews exist.
- **No invented market data.** The mockup showed a live-looking price ticker with made-up prices. Instead, the Economic Calendar page embeds real TradingView data, clearly attributed. A genuine live ticker is a sensible future addition.
- **No profit guarantees anywhere.** This matches the academy's own stated position ("We don't promise profits") and keeps the site defensible.
- **A risk disclaimer appears on every trading-related page**, plus in the footer sitewide.
- **Daily Market Analysis is educational** — it describes how the live analysis sessions work, and deliberately does not publish daily buy/sell calls.

---

## Deployment

The site rebuilds and publishes automatically whenever changes are pushed to the `main` branch on GitHub. There is no separate "publish" step.

- **Build command:** `npm run build`
- **Output directory:** `dist`

To check on a deploy, log into Cloudflare → Workers & Pages → this project.

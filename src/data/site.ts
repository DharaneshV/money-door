// Single source of truth for site-wide facts: nav, contact details, socials.
// Update values here rather than hunting through components/pages.

export const siteConfig = {
  name: "Money Door FX Academy",
  shortName: "Money Door FX",
  tagline: "Master Gold Trading with Confidence",
  description:
    "Professional Gold (XAU/USD) & Forex trading education. Structured courses, live market mentorship, and disciplined risk management from a Chief Trainer with 18+ years of experience.",
  // TODO: confirm the final purchased domain and update this + astro.config.mjs `site`.
  // Candidates from the client's own materials: moneydoorfx.com, moneydoorfxacademy.com
  url: "https://moneydoorfxacademy.com",
  locale: "en_IN",
} as const;

// Thin promo strip above the nav.
//
// COMPLIANCE: this is the most prominent piece of copy on the site and sits
// above the fold on every page. It must never carry a return figure, a
// countdown, or a scarcity claim that isn't literally true ("only 3 seats
// left" is a factual statement, not a marketing device). Keep it to what the
// academy genuinely offers.
//
// Bump `id` whenever the copy changes — the dismissal is remembered against
// this value, so a new id resurfaces the bar for people who dismissed the old one.
export const announcement = {
  id: "mdc1-free-v1",
  text: "MDC1 Foundation Trader — a free, one-week introduction to Gold & Forex markets.",
  linkLabel: "Start free",
  href: "/courses/mdc1/",
} as const;

// Full-screen homepage intro.
//
// `src` null → the built-in CSS-animated bull sequence plays (a single static
// frame sold with camera motion). Drop a file into `public/` and set `src` to
// its path (e.g. "/intro.mp4") to play a real video instead — nothing else
// needs changing. Keep it short, silent and muted: it blocks first view of the
// page, browsers refuse to autoplay anything with sound, and it is skippable.
//
// `maxDurationMs` is the ceiling the overlay is allowed to stay up. It drives
// the safety timeouts as well, so a video that stalls or never fires `ended`
// can still never trap the viewer behind the curtain.
export const introVideo = {
  src: null as string | null,
  maxDurationMs: 2600,
} as const;

export const contact = {
  // Two numbers appear in the source materials; this one is the mockup's primary contact.
  // TODO: confirm with client whether both should be public and which is WhatsApp-active.
  primaryPhoneDisplay: "+91 91599 88000",
  primaryPhoneE164: "919159988000", // used for tel: and wa.me links
  secondaryPhoneDisplay: "+91 95009 30700",
  secondaryPhoneE164: "919500930700",
  whatsappMessage: "Hi Money Door FX Academy, I'd like to know more about your courses.",
  // TODO: swap to a branded support@ inbox once the domain + Zoho/Workspace mail is set up.
  email: "moneydoorchennai@gmail.com",
  addressLine: "Chennai, Tamil Nadu, India",
} as const;

export const whatsappHref = `https://wa.me/${contact.primaryPhoneE164}?text=${encodeURIComponent(
  contact.whatsappMessage
)}`;

// Broadcast-only WhatsApp Channel (separate from the 1:1 chat number above) —
// for market updates/announcements rather than direct conversation.
export const whatsappChannelUrl = "https://whatsapp.com/channel/0029VbAlxyC1NCrL77kXNR30";

// TODO: every URL here is a placeholder (null) until the client provides real handles —
// components must skip rendering any social link whose url is null rather than linking to "#".
export const socials = [
  { name: "YouTube", url: null as string | null },
  { name: "Instagram", url: null as string | null },
  { name: "Facebook", url: null as string | null },
  { name: "Telegram", url: null as string | null },
  { name: "LinkedIn", url: null as string | null },
];

export type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

// Resolved structure — see the plan's "Open items" #3 for why this differs slightly
// from the raw brief text. Pages not in the top nav are still real, linked pages
// (see footer siteLinks below).
export const primaryNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about/" },
  {
    label: "Courses",
    href: "/courses/",
    children: [
      { label: "All Courses", href: "/courses/" },
      { label: "MDC1 — Foundation Trader", href: "/courses/mdc1/", description: "Free · 1 week" },
      { label: "MDC2 — Professional Trader", href: "/courses/mdc2/", description: "USDT 300 · 6 months" },
      { label: "MDC3 — Elite Master Trader", href: "/courses/mdc3/", description: "USDT 1,000 · 12 months" },
    ],
  },
  { label: "Gold Trading", href: "/gold-trading/" },
  { label: "Copy Trading", href: "/copy-trading/" },
  { label: "Daily Analysis", href: "/daily-market-analysis/" },
  { label: "Blog", href: "/blog/" },
  // Replaced "Contact" in this slot. Contact and Join Now were always the same
  // destination, so the page survives at /join/ (where the register form now
  // lives) and /contact/ redirects there rather than 404ing.
  { label: "Trading Partners", href: "/partnerships/" },
];

// The single CTA target used by the header, mobile nav and every "Join Now"
// button. Kept here so the route can move without hunting through components.
export const joinHref = "/join/";

export const legalLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy/" },
  { label: "Terms & Conditions", href: "/terms-and-conditions/" },
  { label: "Risk Disclaimer", href: "/risk-disclaimer/" },
];

// Footer is organized into columns so every page in the site map (not just the
// top nav) is reachable within one click from anywhere on the site.
export const footerColumns: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about/" },
      { label: "Meet the Chief Trainer", href: "/chief-trainer/" },
      { label: "Blog", href: "/blog/" },
      { label: "Trading Partners", href: "/partnerships/" },
      { label: "Join Now", href: joinHref },
    ],
  },
  {
    heading: "Trading",
    links: [
      { label: "Courses", href: "/courses/" },
      { label: "Gold Trading", href: "/gold-trading/" },
      { label: "Forex Trading", href: "/forex-trading/" },
      { label: "Copy Trading", href: "/copy-trading/" },
      { label: "Funded Account Training", href: "/funded-account-training/" },
      { label: "Daily Market Analysis", href: "/daily-market-analysis/" },
      { label: "Economic Calendar", href: "/economic-calendar/" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Student Reviews", href: "/student-reviews/" },
      { label: "FAQ", href: "/faq/" },
      ...legalLinks,
    ],
  },
];

// ---------------------------------------------------------------------------
// Partner / referral links.
//
// COMPLIANCE, read before editing:
//  • Every CTA must carry rel="sponsored noopener noreferrer" and the
//    disclosure line below. FTC guidance requires the disclosure to sit with
//    the link, not buried in a footer, and most affiliate terms void the
//    payout without it.
//  • `blurb` and `pills` describe what the firm IS. Never state or imply a
//    return, win rate, payout likelihood, or that we vet/endorse their
//    financial soundness. "Tools the desk uses" is the honest framing.
//  • Several of these are offshore brokers, and three (Inocyx, Delta Exchange,
//    Binance) are crypto exchanges — a second, materially different
//    regulatory question from the forex/FEMA one below. India taxes crypto
//    gains at a flat 30% plus 1% TDS on most transactions, exchange access
//    has shifted under RBI/FIU-IND pressure before (Binance itself was
//    blocked in India in Dec 2023 and only reinstated after registering with
//    FIU-IND and paying a penalty), and "crypto exchange" is not the same
//    licensing question as "offshore forex broker" — both are flagged here,
//    but neither should be assumed to cover the other. Legal review is
//    recommended before promoting either category to an India-based audience.
export const partnerDisclosure =
  "Referral link. Money Door FX Academy may earn a commission if you sign up.";

export type PartnerGroup = "CFD Brokers" | "Prop Firms" | "Crypto Exchanges";

/** Display order for the group headings on /partnerships. */
export const partnerGroupOrder: PartnerGroup[] = ["CFD Brokers", "Prop Firms", "Crypto Exchanges"];

export type Partner = {
  name: string;
  /** Also the logo filename: `public/partners/<slug>.(svg|png|webp|jpg)`. */
  slug: string;
  /** Section heading this partner is grouped under on the page. */
  group: PartnerGroup;
  /** Per-partner label shown above its name (e.g. "Broker", "Crypto Exchange"). */
  category: string;
  blurb: string;
  pills: string[];
  href: string;
};

// Ordering, grouping and links match the client's requested list (2026-08-08,
// two messages: links first, then the numbered order with group labels).
// "Moneta Markets" — the client wrote "Moneta Markers" both times; the
// supplied link (monetamarkets.com) confirms the real name, used here. This
// is a DIFFERENT entity from "Moneta Funded" below (a prop firm) — same root
// brand, different product.
// "JustMarkets" and "FundingPips" are spelled as one word, matching the
// companies' own branding and their domains (justmarkets.com,
// fundingpips.com) — the client's messages wrote them with a space.
// Vigco and MMSA (previously listed, pre-dating the client's numbered list)
// stay dropped — they were never part of any version of the requested list.
export const partners: Partner[] = [
  {
    name: "Moneta Markets",
    slug: "moneta-markets",
    group: "CFD Brokers",
    category: "Broker",
    blurb:
      "A multi-asset broker offering Gold, FX majors, indices and commodities through MT4 and MT5, with account tiers by minimum deposit — a lower-cost tier to start on while position sizing and consistency are still being built.",
    pills: ["Gold & FX majors", "MT4 / MT5", "Tiered accounts"],
    href: "https://www.monetamarkets.com/open-live-account/?affid=Nzc0NzUwMQ==",
  },
  {
    name: "Valetax",
    slug: "valetax",
    group: "CFD Brokers",
    category: "Broker",
    blurb:
      "A broker with accounts aimed at smaller starting balances. Listed for completeness alongside the others so the comparison is yours to make rather than ours to make for you.",
    pills: ["Small accounts", "Gold & FX majors", "MT4 / MT5"],
    href: "https://ma.valetax.com/p/4650215",
  },
  {
    name: "HFM",
    slug: "hfm",
    group: "CFD Brokers",
    category: "Broker",
    blurb:
      "A long-established broker with a wide instrument range including XAU/USD. Commonly used by students who want a familiar platform and straightforward account setup while they're still learning execution mechanics.",
    pills: ["Gold & FX majors", "MT4 / MT5", "Established"],
    href: "https://register.hfm.com/sv/en/new-live-account/?refid=30516104",
  },
  {
    name: "Vantage Markets",
    slug: "vantage-markets",
    group: "CFD Brokers",
    category: "Broker",
    blurb:
      "A broker with a strong presence across Asia-Pacific, offering ECN-style spreads on Gold and the major currency pairs through MT4, MT5 and its own proprietary platform.",
    pills: ["ECN-style spreads", "Gold & FX majors", "MT4 / MT5"],
    href: "https://www.vantagemarkets.com/en/open-live-account/?affid=Mjc4NjgyMDA=&invitecode=5ErtKGci",
  },
  {
    name: "JustMarkets",
    slug: "justmarkets",
    group: "CFD Brokers",
    category: "Broker",
    blurb:
      "A broker offering low minimum deposits, which makes it a practical place to trade small while position sizing is still being learned. Small size is the point early on — the habit matters more than the capital.",
    pills: ["Low entry size", "Gold & FX majors", "MT4 / MT5"],
    href: "https://one.justmarkets.link/a/5daav08f6k",
  },
  {
    name: "NYS Markets",
    slug: "nys-markets",
    group: "Prop Firms",
    category: "Broker",
    blurb:
      "A broker option students have asked about often enough that we list it here rather than leave people to search unaided. As with every firm on this page, verify its regulatory status in your own jurisdiction before depositing.",
    pills: ["Gold & FX majors", "Multi-asset", "Verify locally"],
    href: "https://nysmarkets.com/signup?cxd=Moneydoor",
  },
  {
    name: "Moneta Funded",
    slug: "moneta-funded",
    group: "Prop Firms",
    category: "Funded Account Evaluations",
    blurb:
      "A second prop-firm option, useful for comparing evaluation structures side by side. Rule sets differ meaningfully between firms, and learning to read those rules before paying for a challenge is part of the training.",
    pills: ["Alternative rule set", "Comparison practice", "Challenge-based"],
    href: "https://www.monetafunded.com/checkout/?cxd=35587_365911&brand=monetafunded&bta=35587",
  },
  {
    name: "FundingPips",
    slug: "fundingpips",
    group: "Prop Firms",
    category: "Funded Account Evaluations",
    blurb:
      "A proprietary trading firm running paid evaluations. It's the environment our MDC3 funded-account training is built around, so students practise against the same style of drawdown and daily-loss rules they'll face in a real assessment.",
    pills: ["Evaluation model", "Defined risk rules", "Used in MDC3"],
    href: "https://app.fundingpips.com/register?referral_code=dbf794f6",
  },
  {
    name: "Inocyx",
    slug: "inocyx",
    group: "Crypto Exchanges",
    category: "Crypto Exchange",
    blurb:
      "A crypto exchange partner. As with every entry on this page, this is a pointer to a platform we're familiar with — not an endorsement of its features or an assessment of its suitability for your circumstances. Verify its registration and regulatory standing in your own jurisdiction before you sign up.",
    pills: ["Crypto trading", "Verify locally", "Separate risk profile"],
    href: "https://ref.inocyx.com/ref?code=Ayv3ov",
  },
  {
    name: "Delta Exchange",
    slug: "delta-exchange",
    group: "Crypto Exchanges",
    category: "Crypto Exchange",
    blurb:
      "A crypto derivatives exchange offering futures and options on major cryptocurrencies. A different asset class and risk profile from the Gold and Forex markets taught in our courses — evaluate it on its own terms, not as an extension of that training.",
    pills: ["Crypto futures & options", "Derivatives", "Separate risk profile"],
    href: "https://www.delta.exchange/?code=MONEYDOOR",
  },
  {
    name: "Binance",
    slug: "binance",
    group: "Crypto Exchanges",
    category: "Crypto Exchange",
    blurb:
      "One of the world's largest cryptocurrency exchanges by volume, offering spot and derivatives trading across a wide range of digital assets. Regulatory standing for crypto exchanges has shifted before in India — confirm current registration status before depositing.",
    pills: ["Spot & derivatives", "Wide asset range", "Verify locally"],
    href: "https://www.binance.com/register?ref=MONEYDOOR",
  },
];

export const riskDisclaimerShort =
  "Trading in financial markets involves substantial risk and may not be suitable for every individual. Money Door FX Academy provides educational content only and does not offer investment advice, portfolio management, or guarantees of profits. Past performance does not guarantee future results.";

// Compact one-liner for inline banners on trading-related pages — the full
// paragraph above lives in the footer and on /risk-disclaimer/.
export const riskDisclaimerBanner =
  "Educational content only — not investment advice. Trading involves risk and past performance does not guarantee future results.";

// NOTE: the Web3Forms integration was removed when the register form landed.
// Submissions now go to the site's own /api/register endpoint, which persists
// the record before emailing so a mail outage can't lose a lead — something a
// fire-and-forget form relay can't offer. See docs/REGISTRATIONS.md.

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
  { label: "Contact", href: "/contact/" },
];

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
      { label: "Contact", href: "/contact/" },
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

export const riskDisclaimerShort =
  "Trading in financial markets involves substantial risk and may not be suitable for every individual. Money Door FX Academy provides educational content only and does not offer investment advice, portfolio management, or guarantees of profits. Past performance does not guarantee future results.";

// Compact one-liner for inline banners on trading-related pages — the full
// paragraph above lives in the footer and on /risk-disclaimer/.
export const riskDisclaimerBanner =
  "Educational content only — not investment advice. Trading involves risk and past performance does not guarantee future results.";

// Web3Forms access key — a free, no-login form backend. Create the account under the
// client's own email (moneydoorchennai@gmail.com) at web3forms.com and paste the key here.
// TODO: currently empty — forms will show a "not configured yet" state until this is set.
export const web3FormsAccessKey = "";

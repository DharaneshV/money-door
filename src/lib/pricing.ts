// Single source of truth for how course money is rendered.
//
// Prices used to be interpolated inline as `${currency} ${price}` in each page,
// which read as "USD 300" once the collection moved off USDT. Centralising it
// means the symbol, the thousands separator and the discount maths are decided
// once, and a future currency change is a one-line edit here.

const SYMBOLS: Record<string, string> = {
  USD: "$",
  USDT: "USDT ",
  INR: "₹",
  EUR: "€",
};

export function formatPrice(amount: number, currency = "USD"): string {
  const symbol = SYMBOLS[currency] ?? `${currency} `;
  return `${symbol}${amount.toLocaleString("en-US")}`;
}

export interface PriceView {
  /** What the student pays, formatted. */
  now: string;
  /** The undiscounted fee, formatted — undefined when there's no discount. */
  was?: string;
  /** e.g. "50% off" — undefined when there's no discount. */
  discountLabel?: string;
  /** The money saved, formatted — undefined when there's no discount. */
  saving?: string;
}

/**
 * Derives every price string a course page needs from the raw frontmatter.
 *
 * The discount percentage is computed rather than authored so it can never
 * drift out of sync with the two numbers it describes — a "50% off" badge
 * sitting next to prices that aren't actually half is the kind of error that
 * is both easy to introduce and legally awkward in an advertised offer.
 */
export function priceView(
  price: number,
  listPrice?: number,
  currency = "USD",
  priceLabel?: string
): PriceView {
  const now = priceLabel ?? formatPrice(price, currency);
  if (listPrice === undefined || listPrice <= price) return { now };
  const pct = Math.round(((listPrice - price) / listPrice) * 100);
  return {
    now,
    was: formatPrice(listPrice, currency),
    discountLabel: `${pct}% off`,
    saving: formatPrice(listPrice - price, currency),
  };
}

/**
 * Shown wherever a funded-account or copy-trading benefit appears.
 *
 * Kept here, next to the money, so it travels with every surface that quotes an
 * offer instead of being remembered page by page. Deliberately avoids
 * "guaranteed funding", "guaranteed profit", "risk-free" and "guaranteed
 * returns" — the benefit is access to a third-party evaluation, not a payout.
 */
export const FUNDED_DISCLAIMER =
  "Funded-account access is subject to the applicable provider's rules, eligibility criteria, evaluation requirements, terms and conditions. Funding and trading profits are not guaranteed.";

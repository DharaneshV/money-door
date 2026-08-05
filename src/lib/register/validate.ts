// Server-side validation for /api/register.
//
// The client validates too, but only as a courtesy — everything here runs again
// on the server because the client checks are trivially bypassed by posting to
// the endpoint directly, which is exactly what a scraper does.

import { isValidCountry, isValidState, countryName } from "../../data/geo";

export type RegisterInput = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  consent: boolean;
  company: string;
  turnstileToken: string;
};

export type ValidRegistration = {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  countryName: string;
  state: string;
  city: string;
};

export type ValidationResult =
  | { ok: true; value: ValidRegistration }
  | { ok: false; fieldErrors: Record<string, string>; message: string };

// Intentionally permissive. Phone numbering plans vary enormously and an
// over-strict pattern rejects real customers, which costs more than it saves —
// the honeypot and captcha are what actually stop bots.
const PHONE_RE = /^[+]?[\d\s().-]{7,20}$/;
// Deliberately not RFC 5322: that regex is enormous and still can't prove an
// address is deliverable. Structural check here; real proof is the welcome
// email arriving.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const MAX = { fullName: 100, email: 254, phone: 20, state: 100, city: 100 };

function clean(v: unknown): string {
  return typeof v === "string" ? v.trim().replace(/\s+/g, " ") : "";
}

export function validate(raw: Partial<RegisterInput>): ValidationResult {
  const fieldErrors: Record<string, string> = {};

  const fullName = clean(raw.fullName);
  const email = clean(raw.email).toLowerCase();
  const phone = clean(raw.phone);
  const country = clean(raw.country);
  const state = clean(raw.state);
  const city = clean(raw.city);

  if (fullName.length < 2) fieldErrors.fullName = "Please enter your full name.";
  else if (fullName.length > MAX.fullName) fieldErrors.fullName = "That name is too long.";

  if (!EMAIL_RE.test(email)) fieldErrors.email = "Please enter a valid email address.";
  else if (email.length > MAX.email) fieldErrors.email = "That email address is too long.";

  if (!PHONE_RE.test(phone)) fieldErrors.phone = "Please enter a valid phone number.";

  if (!country) fieldErrors.country = "Please select your country.";
  else if (!isValidCountry(country)) fieldErrors.country = "Please select a country from the list.";

  if (!state) fieldErrors.state = "Please enter your state or region.";
  else if (state.length > MAX.state) fieldErrors.state = "That entry is too long.";
  else if (country && isValidCountry(country) && !isValidState(country, state)) {
    fieldErrors.state = "Please choose a state from the list for your country.";
  }

  if (city.length < 2) fieldErrors.city = "Please enter your city.";
  else if (city.length > MAX.city) fieldErrors.city = "That city name is too long.";

  // Consent is a legal requirement under the DPDP Act, not a UI nicety — the
  // record must not be stored at all without it.
  if (raw.consent !== true) {
    fieldErrors.consent = "Please agree to the privacy policy to continue.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      fieldErrors,
      message: "Please correct the highlighted fields and try again.",
    };
  }

  return {
    ok: true,
    value: {
      fullName,
      email,
      phone,
      countryCode: country,
      countryName: countryName(country),
      state,
      city,
    },
  };
}

/** True when the honeypot was filled, i.e. the submission is almost certainly a bot. */
export function isBot(raw: Partial<RegisterInput>): boolean {
  return clean(raw.company).length > 0;
}

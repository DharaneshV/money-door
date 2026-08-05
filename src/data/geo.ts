// Country and state/region options for the registration form.
//
// Deliberately a plain static table rather than an npm dependency: the popular
// country-state-city packages ship several megabytes of data for every country
// on earth, which is a poor trade for one form on an otherwise near-zero-JS
// site. Subdivisions are listed for the markets this academy actually draws
// from (India first, then the Gulf and the main diaspora destinations); any
// other country falls back to a free-text region field, which is handled in
// RegisterForm rather than by silently dropping the answer.

export type Country = { code: string; name: string };

/** Shown at the top of the select, above a separator, since most sign-ups are Indian. */
export const priorityCountryCodes = ["IN", "AE", "SA", "QA", "KW", "OM", "BH", "MY", "SG"];

export const countries: Country[] = [
  { code: "AF", name: "Afghanistan" }, { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" }, { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" }, { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" }, { code: "AZ", name: "Azerbaijan" },
  { code: "BH", name: "Bahrain" }, { code: "BD", name: "Bangladesh" },
  { code: "BY", name: "Belarus" }, { code: "BE", name: "Belgium" },
  { code: "BT", name: "Bhutan" }, { code: "BO", name: "Bolivia" },
  { code: "BA", name: "Bosnia and Herzegovina" }, { code: "BW", name: "Botswana" },
  { code: "BR", name: "Brazil" }, { code: "BN", name: "Brunei" },
  { code: "BG", name: "Bulgaria" }, { code: "KH", name: "Cambodia" },
  { code: "CM", name: "Cameroon" }, { code: "CA", name: "Canada" },
  { code: "CL", name: "Chile" }, { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" }, { code: "CR", name: "Costa Rica" },
  { code: "HR", name: "Croatia" }, { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czechia" }, { code: "DK", name: "Denmark" },
  { code: "EC", name: "Ecuador" }, { code: "EG", name: "Egypt" },
  { code: "EE", name: "Estonia" }, { code: "ET", name: "Ethiopia" },
  { code: "FI", name: "Finland" }, { code: "FR", name: "France" },
  { code: "GE", name: "Georgia" }, { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" }, { code: "GR", name: "Greece" },
  { code: "GT", name: "Guatemala" }, { code: "HK", name: "Hong Kong" },
  { code: "HU", name: "Hungary" }, { code: "IS", name: "Iceland" },
  { code: "IN", name: "India" }, { code: "ID", name: "Indonesia" },
  { code: "IQ", name: "Iraq" }, { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" }, { code: "IT", name: "Italy" },
  { code: "JM", name: "Jamaica" }, { code: "JP", name: "Japan" },
  { code: "JO", name: "Jordan" }, { code: "KZ", name: "Kazakhstan" },
  { code: "KE", name: "Kenya" }, { code: "KW", name: "Kuwait" },
  { code: "KG", name: "Kyrgyzstan" }, { code: "LA", name: "Laos" },
  { code: "LV", name: "Latvia" }, { code: "LB", name: "Lebanon" },
  { code: "LY", name: "Libya" }, { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" }, { code: "MO", name: "Macau" },
  { code: "MG", name: "Madagascar" }, { code: "MW", name: "Malawi" },
  { code: "MY", name: "Malaysia" }, { code: "MV", name: "Maldives" },
  { code: "MT", name: "Malta" }, { code: "MU", name: "Mauritius" },
  { code: "MX", name: "Mexico" }, { code: "MD", name: "Moldova" },
  { code: "MN", name: "Mongolia" }, { code: "ME", name: "Montenegro" },
  { code: "MA", name: "Morocco" }, { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar" }, { code: "NA", name: "Namibia" },
  { code: "NP", name: "Nepal" }, { code: "NL", name: "Netherlands" },
  { code: "NZ", name: "New Zealand" }, { code: "NG", name: "Nigeria" },
  { code: "NO", name: "Norway" }, { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" }, { code: "PS", name: "Palestine" },
  { code: "PA", name: "Panama" }, { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Peru" }, { code: "PH", name: "Philippines" },
  { code: "PL", name: "Poland" }, { code: "PT", name: "Portugal" },
  { code: "QA", name: "Qatar" }, { code: "RO", name: "Romania" },
  { code: "RU", name: "Russia" }, { code: "RW", name: "Rwanda" },
  { code: "SA", name: "Saudi Arabia" }, { code: "SN", name: "Senegal" },
  { code: "RS", name: "Serbia" }, { code: "SG", name: "Singapore" },
  { code: "SK", name: "Slovakia" }, { code: "SI", name: "Slovenia" },
  { code: "ZA", name: "South Africa" }, { code: "KR", name: "South Korea" },
  { code: "ES", name: "Spain" }, { code: "LK", name: "Sri Lanka" },
  { code: "SE", name: "Sweden" }, { code: "CH", name: "Switzerland" },
  { code: "TW", name: "Taiwan" }, { code: "TZ", name: "Tanzania" },
  { code: "TH", name: "Thailand" }, { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Türkiye" }, { code: "UG", name: "Uganda" },
  { code: "UA", name: "Ukraine" }, { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" }, { code: "US", name: "United States" },
  { code: "UY", name: "Uruguay" }, { code: "UZ", name: "Uzbekistan" },
  { code: "VN", name: "Vietnam" }, { code: "YE", name: "Yemen" },
  { code: "ZM", name: "Zambia" }, { code: "ZW", name: "Zimbabwe" },
  { code: "OTHER", name: "Other / Not listed" },
];

/**
 * Subdivisions keyed by ISO country code. A country absent from this map has no
 * fixed list, and the form shows a free-text region field for it instead.
 */
export const statesByCountry: Record<string, string[]> = {
  IN: [
    "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam",
    "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
    "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
    "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  ],
  AE: [
    "Abu Dhabi", "Ajman", "Dubai", "Fujairah", "Ras Al Khaimah", "Sharjah",
    "Umm Al Quwain",
  ],
  SA: [
    "Al Bahah", "Al Jawf", "Al Madinah", "Al Qassim", "Asir", "Eastern Province",
    "Ha'il", "Jazan", "Makkah", "Najran", "Northern Borders", "Riyadh", "Tabuk",
  ],
  QA: [
    "Al Daayen", "Al Khor", "Al Rayyan", "Al Shamal", "Al Wakrah", "Doha",
    "Umm Salal",
  ],
  KW: [
    "Al Ahmadi", "Al Asimah", "Al Farwaniyah", "Al Jahra", "Hawalli",
    "Mubarak Al-Kabeer",
  ],
  OM: [
    "Ad Dakhiliyah", "Ad Dhahirah", "Al Batinah North", "Al Batinah South",
    "Al Buraimi", "Al Wusta", "Ash Sharqiyah North", "Ash Sharqiyah South",
    "Dhofar", "Musandam", "Muscat",
  ],
  BH: [
    "Capital", "Muharraq", "Northern", "Southern",
  ],
  MY: [
    "Johor", "Kedah", "Kelantan", "Kuala Lumpur", "Labuan", "Melaka",
    "Negeri Sembilan", "Pahang", "Penang", "Perak", "Perlis", "Putrajaya",
    "Sabah", "Sarawak", "Selangor", "Terengganu",
  ],
  SG: ["Central", "East", "North", "North-East", "West"],
  US: [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
    "Connecticut", "Delaware", "District of Columbia", "Florida", "Georgia",
    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
    "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
    "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
    "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
  ],
  GB: ["England", "Northern Ireland", "Scotland", "Wales"],
  CA: [
    "Alberta", "British Columbia", "Manitoba", "New Brunswick",
    "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia",
    "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan",
    "Yukon",
  ],
  AU: [
    "Australian Capital Territory", "New South Wales", "Northern Territory",
    "Queensland", "South Australia", "Tasmania", "Victoria", "Western Australia",
  ],
  LK: [
    "Central", "Eastern", "North Central", "North Western", "Northern",
    "Sabaragamuwa", "Southern", "Uva", "Western",
  ],
  NP: [
    "Bagmati", "Gandaki", "Karnali", "Koshi", "Lumbini", "Madhesh",
    "Sudurpashchim",
  ],
  PK: [
    "Azad Jammu and Kashmir", "Balochistan", "Gilgit-Baltistan", "Islamabad",
    "Khyber Pakhtunkhwa", "Punjab", "Sindh",
  ],
  BD: ["Barisal", "Chittagong", "Dhaka", "Khulna", "Mymensingh", "Rajshahi", "Rangpur", "Sylhet"],
};

export function countryName(code: string): string {
  return countries.find((c) => c.code === code)?.name ?? code;
}

export function isValidCountry(code: string): boolean {
  return countries.some((c) => c.code === code);
}

/**
 * True when `state` is acceptable for `countryCode`. Countries with a fixed
 * list must match it exactly; countries without one accept any non-empty
 * string, since the form collects those as free text.
 */
export function isValidState(countryCode: string, state: string): boolean {
  const list = statesByCountry[countryCode];
  if (!list) return state.trim().length > 0;
  return list.includes(state);
}

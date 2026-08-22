# Registration form — setup

The Join Now form (`/join/`) posts to `/api/register`, which does three things
**in this order**:

1. **Persists** the record (so a mail outage can never lose a lead)
2. Sends the **welcome email** to the registrant
3. Sends the **notification email** to the owner inbox

Everything below is already built. What remains is provisioning the accounts and
pasting the keys into environment variables.

> **The form works right now without any of this.** With no keys set it still
> validates, blocks bots, rate-limits, and writes every registration to the
> server log as a `{"tag":"REGISTRATION",...}` line. It just can't email anyone
> or write to a sheet. Treat the steps below as required before launch, not
> before testing.

---

## 1. Sending domain (do this first — everything else depends on it)

You don't have a domain yet. Until you do, **no welcome email can be delivered
reliably**, because mail sent from an unverified domain is filtered as spam
almost every time. There is no workaround for this; it's how receiving mail
servers decide what to trust.

1. Buy the domain (the codebase currently assumes `moneydoorfxacademy.com` —
   see `SITE_URL` in `astro.config.mjs` and `siteConfig.url` in `src/data/site.ts`;
   update both if you choose a different one).
2. Sign up at [resend.com](https://resend.com) and add the domain under
   **Domains**.
3. Add the **SPF**, **DKIM** and **DMARC** DNS records Resend shows you, at your
   registrar. Wait for all three to show "Verified".
4. Only then set `MAIL_FROM` to an address on that domain.

Free tier is 3,000 emails/month and 100/day — far beyond early registration
volume.

**Use a real mailbox, not `noreply@`.** No-reply senders score worse with spam
filters and silently discard replies from people trying to reach you.

## 2. Environment variables

Copy `.env.example` to `.env` for local dev, and add the same keys in Vercel
under **Project Settings → Environment Variables**.

| Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | for email | Resend API key. **Server-side only.** |
| `MAIL_FROM` | for email | e.g. `Money Door FX Academy <hello@yourdomain.com>` — must be on the verified domain |
| `OWNER_EMAIL` | for email | Where the internal notification lands. Defaults to `moneydoor@gmail.com` |
| `REPLY_TO` | optional | Reply-to on the welcome email. Defaults to `OWNER_EMAIL` |
| `REGISTRATIONS_WEBHOOK_URL` | **strongly recommended** | Sheet/DB webhook — see below |
| `PUBLIC_TURNSTILE_SITE_KEY` | recommended | Cloudflare Turnstile site key (public by design) |
| `TURNSTILE_SECRET_KEY` | recommended | Turnstile secret. **Server-side only.** |

⚠️ Never prefix a secret with `PUBLIC_`. Astro inlines every `PUBLIC_*` variable
into the browser bundle, where anyone can read it.

## 3. Storing registrations (Google Sheet)

Until `REGISTRATIONS_WEBHOOK_URL` is set, registrations exist **only in the
Vercel log**. That's a real backstop, but it isn't a list you can work from and
it ages out. Set this up before launch.

1. Create a Google Sheet with these headers in row 1:

   ```
   submittedAt | interest | fullName | email | phone | city | state | countryName | countryCode | ip | userAgent
   ```

   `interest` is which form the visitor submitted — "MDC1 — Foundation
   Trader", "MDC2 — Professional Trader", "MDC3 — Elite Master Trader" or
   "Free 1-hour consultation" — so leads can be sorted without opening each
   row.

2. **Extensions → Apps Script**, and replace the contents with:

   ```javascript
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
     const d = JSON.parse(e.postData.contents);
     sheet.appendRow([
       d.submittedAt, d.interest, d.fullName, d.email, d.phone, d.city,
       d.state, d.countryName, d.countryCode, d.ip, d.userAgent,
     ]);
     return ContentService
       .createTextOutput(JSON.stringify({ ok: true }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```

3. **Deploy → New deployment → Web app**, with *Execute as* **Me** and
   *Who has access* **Anyone**.
4. Copy the `/exec` URL into `REGISTRATIONS_WEBHOOK_URL`.

Anyone who guesses that URL can append rows, so treat it as a secret. It only
ever accepts writes — it cannot leak the existing list.

To move to a real database later, replace `persist()` in
`src/lib/register/store.ts`. Nothing else needs to change.

## 4. Spam protection (Cloudflare Turnstile)

A public form collecting phone numbers gets scraped within days.

1. [Cloudflare dashboard](https://dash.cloudflare.com) → **Turnstile** → add a
   site for your domain.
2. Put the **site key** in `PUBLIC_TURNSTILE_SITE_KEY` and the **secret key** in
   `TURNSTILE_SECRET_KEY`.

The widget renders and is verified only when both are set, so previews keep
working without them. Two other guards are always active regardless:

- a **honeypot** field — filled by bots, invisible to people. Deliberately
  not named anything address-shaped ("company", "website", "url"): those are
  recognised profile fields in Chrome, Safari and most password managers,
  which ignore `autocomplete="off"` and can silently autofill them for a real
  visitor — which would make a genuine registration look like a bot and
  vanish with no error shown.
- **per-IP rate limiting** — 5 submissions per 10 minutes

### Rate limiting caveat

The limiter is in-memory (`src/lib/register/guards.ts`). Serverless instances
don't share memory, so it bounds a single warm instance rather than the whole
deployment. That stops the common case — one script hammering the endpoint — but
it is **not** a hard global cap. If abuse becomes a real problem, move it to
Vercel KV or Upstash Redis; the interface is deliberately small.

## 5. Verifying it works

```bash
npm run dev

curl -X POST http://localhost:4321/api/register \
  -H "Content-Type: application/json" \
  -d '{"interest":"MDC1","fullName":"Test User","email":"you@example.com","phone":"+91 9000000000",
       "country":"IN","state":"Tamil Nadu","city":"Chennai","consent":true,
       "mdfx_ref":"","turnstileToken":""}'
# -> {"ok":true}
```

Check, in order: the row appears in the Sheet, the welcome email arrives (check
spam on the first send), and the notification reaches `OWNER_EMAIL`.

The honeypot returns `{"ok":true}` deliberately — a bot that sees success won't
retry with a different shape. Nothing is stored or emailed in that case.

---

## Compliance notes

- **DPDP Act 2023.** The form collects name, phone, email and location from
  Indian users, so the Act applies. Consent is required before storing anything
  (the endpoint rejects a submission without it), and `/privacy-policy/` documents
  what's collected, why, retention periods, and how to request deletion. The
  consent checkbox links to it. **Retention periods in that policy are commitments
  — actually delete records when they expire.**
- **Referral links.** Every partner CTA carries `rel="sponsored noopener noreferrer"`
  and a visible disclosure. Removing the disclosure can void affiliate payouts and
  breaches FTC guidance.
- **Offshore brokers.** Several partners are offshore forex brokers, and the
  audience is India-based. Indian residents face FEMA/RBI restrictions on offshore
  forex trading and RBI publishes an Alert List of unauthorised platforms. Worth a
  lawyer's review before promoting these.

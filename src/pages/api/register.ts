import type { APIRoute } from "astro";
import { validate, isBot, type RegisterInput } from "../../lib/register/validate";
import { rateLimit, clientIp, verifyTurnstile } from "../../lib/register/guards";
import { persist, type StoredRegistration } from "../../lib/register/store";
import { sendWelcome, sendOwnerNotification } from "../../lib/register/email";

// The one route on this site that needs a server. Everything else stays
// prerendered static HTML — see the note in astro.config.mjs.
export const prerender = false;

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });

export const POST: APIRoute = async ({ request }) => {
  const ip = clientIp(request);

  // ---- 1. Cheap rejections first, before any parsing or network work -------
  const limit = rateLimit(ip);
  if (!limit.allowed) {
    return json(
      { ok: false, message: "Too many attempts. Please wait a few minutes and try again." },
      429,
      { "Retry-After": String(limit.retryAfterSec) }
    );
  }

  let raw: Partial<RegisterInput>;
  try {
    raw = (await request.json()) as Partial<RegisterInput>;
  } catch {
    return json({ ok: false, message: "Invalid request." }, 400);
  }

  // Honeypot. Answer 200 so the bot records a success and doesn't retry with a
  // different shape — nothing is stored and no email is sent.
  if (isBot(raw)) {
    return json({ ok: true });
  }

  if (!(await verifyTurnstile(raw.turnstileToken ?? "", ip))) {
    return json(
      { ok: false, message: "Verification failed. Please refresh the page and try again." },
      400
    );
  }

  // ---- 2. Validate ---------------------------------------------------------
  const result = validate(raw);
  if (!result.ok) {
    return json({ ok: false, message: result.message, fieldErrors: result.fieldErrors }, 400);
  }

  const record: StoredRegistration = {
    ...result.value,
    submittedAt: new Date().toISOString(),
    ip,
    userAgent: request.headers.get("user-agent")?.slice(0, 300) || "unknown",
  };

  // ---- 3. Persist BEFORE emailing -----------------------------------------
  // Ordering is deliberate: if the mail provider is down we still hold the lead.
  const stored = await persist(record);
  if (!stored.ok) {
    // A configured store that genuinely failed. The record was still written to
    // the platform log by the store, so it isn't lost — but don't claim success
    // to the visitor when the system of record rejected it.
    console.error("REGISTRATION_PERSIST_FAILED", stored.error);
    return json(
      {
        ok: false,
        message:
          "We couldn't save your registration just now. Please try again in a moment, or message us on WhatsApp.",
      },
      503
    );
  }

  // ---- 4. Emails, in order: registrant, then owner ------------------------
  // Neither send can fail the request: the lead is already stored, so telling a
  // visitor their registration failed because our mail provider hiccupped would
  // be both untrue and likely to produce a duplicate submission.
  const [welcome, notify] = await Promise.all([
    sendWelcome(record),
    sendOwnerNotification(record, stored.via),
  ]);

  if (!welcome.ok) console.error("REGISTRATION_WELCOME_EMAIL_FAILED", welcome.error);
  if (!notify.ok) console.error("REGISTRATION_OWNER_EMAIL_FAILED", notify.error);

  return json({ ok: true });
};

// A GET here is either a crawler or someone pasting the URL; neither should see
// a framework error page.
export const GET: APIRoute = () =>
  json({ ok: false, message: "Method not allowed." }, 405, { Allow: "POST" });

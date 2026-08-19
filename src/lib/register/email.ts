// Transactional email for registrations, via Resend.
//
// SETUP (none of this is optional for production — see docs/REGISTRATIONS.md):
//   1. Verify the sending domain in Resend and add its SPF, DKIM and DMARC
//      records. Sending from an unverified domain lands in spam essentially
//      every time, which silently breaks the welcome email.
//   2. Set RESEND_API_KEY (server-side env var only — never expose it to the
//      client; anyone with it can send mail as your domain).
//   3. Set MAIL_FROM to a real, monitored address such as
//      "Money Door FX Academy <hello@yourdomain.com>". Not "noreply@" —
//      no-reply senders score worse with filters and refuse real replies.
//   4. Set OWNER_EMAIL for the internal notification.
//
// With RESEND_API_KEY unset every send is skipped and reported as such, so the
// endpoint still returns success and the lead is still persisted. That keeps
// local dev and previews working before the domain exists.

import { Resend } from "resend";
import type { StoredRegistration } from "./store";

export type SendResult = { ok: boolean; skipped?: boolean; error?: string };

const OWNER_EMAIL = import.meta.env.OWNER_EMAIL || "moneydoor@gmail.com";
const MAIL_FROM =
  import.meta.env.MAIL_FROM || "Money Door FX Academy <hello@moneydoorfxacademy.com>";
const REPLY_TO = import.meta.env.REPLY_TO || OWNER_EMAIL;

function client(): Resend | null {
  const key = import.meta.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

/** Escapes interpolated values so a name containing markup can't inject HTML. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const SHELL = (inner: string) => `
<div style="margin:0;padding:24px;background:#0a0a0c;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#15161b;border-radius:16px;padding:32px;color:#faf9f7;">
    <div style="font-size:18px;font-weight:700;letter-spacing:.12em;margin-bottom:24px;">
      MONEY <span style="color:#d6a31e;">DOOR</span>
      <div style="font-size:10px;letter-spacing:.25em;color:rgba(250,249,247,.5);margin-top:4px;">FX ACADEMY</div>
    </div>
    ${inner}
  </div>
  <p style="max-width:560px;margin:16px auto 0;font-size:11px;line-height:1.6;color:rgba(250,249,247,.4);">
    Money Door FX Academy provides educational content only and does not offer investment advice
    or guarantees of profit. Trading involves substantial risk.
  </p>
</div>`;

export async function sendWelcome(record: StoredRegistration): Promise<SendResult> {
  const resend = client();
  if (!resend) return { ok: false, skipped: true, error: "RESEND_API_KEY not set" };

  const html = SHELL(`
    <h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;">Welcome, ${esc(record.fullName.split(" ")[0])}.</h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:rgba(250,249,247,.75);">
      Thanks for registering with Money Door FX Academy. We've received your details and someone
      from the team will be in touch personally about the right starting point for you.
    </p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:rgba(250,249,247,.75);">
      In the meantime, MDC1 &mdash; Foundation Trader is our one-month introduction to the Gold
      and Forex markets. It's the best place to begin.
    </p>
    <a href="https://moneydoorfxacademy.com/courses/mdc1/"
       style="display:inline-block;background:#d6a31e;color:#0a0a0c;text-decoration:none;font-weight:600;font-size:13px;letter-spacing:.1em;text-transform:uppercase;padding:14px 28px;border-radius:999px;">
      Start with MDC1
    </a>
    <p style="margin:28px 0 0;font-size:13px;line-height:1.6;color:rgba(250,249,247,.5);">
      Registering doesn't open a trading account and involves no payment. Reply to this email if
      you'd like your details removed &mdash; we'll action it.
    </p>
  `);

  try {
    const { error } = await resend.emails.send({
      from: MAIL_FROM,
      to: record.email,
      replyTo: REPLY_TO,
      subject: "Welcome to Money Door FX Academy",
      html,
    });
    if (error) return { ok: false, error: String(error.message || error) };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function sendOwnerNotification(
  record: StoredRegistration,
  persistNote: string
): Promise<SendResult> {
  const resend = client();
  if (!resend) return { ok: false, skipped: true, error: "RESEND_API_KEY not set" };

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 16px 8px 0;font-size:13px;color:rgba(250,249,247,.5);white-space:nowrap;vertical-align:top;">${esc(label)}</td>
      <td style="padding:8px 0;font-size:14px;color:#faf9f7;">${esc(value)}</td>
    </tr>`;

  const html = SHELL(`
    <h1 style="margin:0 0 20px;font-size:20px;line-height:1.3;">New registration</h1>
    <table style="width:100%;border-collapse:collapse;">
      ${row("Registering for", record.interest)}
      ${row("Name", record.fullName)}
      ${row("Email", record.email)}
      ${row("Phone", record.phone)}
      ${row("City", record.city)}
      ${row("State", record.state)}
      ${row("Country", record.countryName)}
      ${row("Submitted", record.submittedAt)}
      ${row("IP", record.ip)}
      ${row("User agent", record.userAgent)}
      ${row("Stored via", persistNote)}
    </table>
    <p style="margin:24px 0 0;font-size:13px;color:rgba(250,249,247,.5);">
      Reply directly to this email to reach the registrant.
    </p>
  `);

  try {
    const { error } = await resend.emails.send({
      from: MAIL_FROM,
      to: OWNER_EMAIL,
      // Replying to the notification reaches the registrant, not yourself.
      replyTo: record.email,
      subject: `New registration — ${record.interest} — ${record.fullName} (${record.city}, ${record.countryName})`,
      html,
    });
    if (error) return { ok: false, error: String(error.message || error) };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// Persistence for registrations.
//
// The spec's ordering matters: persist BEFORE emailing, so a mail outage can't
// lose a lead. This module is deliberately small and pluggable because nothing
// is provisioned yet.
//
// Configure ONE of:
//   REGISTRATIONS_WEBHOOK_URL — any endpoint that accepts a JSON POST:
//     a Formspree form (https://formspree.io/f/xxxx — nothing to build, and it
//     emails the owner itself), or a Google Apps Script that appends a row to a
//     Sheet. See docs/REGISTRATIONS.md for both.
//   (later) swap `persist` for a real database write — the call site only
//     depends on the PersistResult shape.
//
// With nothing configured the record is written to the platform log as a single
// structured JSON line. That is a genuine backstop (Vercel retains and lets you
// search/drain logs) but it is NOT a substitute for a real store: it is not
// queryable as a list and it ages out. Set the webhook before launch.

import type { ValidRegistration } from "./validate";

export type StoredRegistration = ValidRegistration & {
  submittedAt: string;
  ip: string;
  userAgent: string;
};

export type PersistResult = {
  /** False only when a store was configured and the write genuinely failed. */
  ok: boolean;
  /** Which path was taken — surfaced in the owner email so gaps are visible. */
  via: "webhook" | "log";
  error?: string;
};

export async function persist(record: StoredRegistration): Promise<PersistResult> {
  const webhook = import.meta.env.REGISTRATIONS_WEBHOOK_URL;

  if (webhook) {
    try {
      // Formspree needs two things a Google Apps Script webhook does not:
      // `Accept: application/json`, without which it answers with an HTML
      // redirect page instead of JSON, and a `_subject` line, which is what
      // makes a submission legible in the dashboard and the notification
      // email. Both are added only for a Formspree URL so a Sheet webhook
      // isn't handed a stray column it never asked for.
      // Hostname match, not a substring test: a regex on the raw URL both
      // missed the real endpoint (`https://formspree.io/...` — no dot before
      // the host) and would have matched a lookalike like
      // `formspree.io.attacker.example`.
      let isFormspree = false;
      try {
        const host = new URL(webhook).hostname.toLowerCase();
        isFormspree = host === "formspree.io" || host.endsWith(".formspree.io");
      } catch {
        // Malformed URL — the fetch below will fail and be reported anyway.
      }
      const body = isFormspree
        ? { ...record, _subject: `New registration — ${record.interest} — ${record.fullName}` }
        : record;

      const res = await fetch(webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(isFormspree && { Accept: "application/json" }),
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`webhook responded ${res.status}`);
      return { ok: true, via: "webhook" };
    } catch (err) {
      // Log the full record too, so a webhook outage doesn't lose the lead
      // even though we report the failure upstream.
      logRecord(record, "webhook-failed");
      return {
        ok: false,
        via: "webhook",
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  logRecord(record, "no-store-configured");
  return { ok: true, via: "log" };
}

function logRecord(record: StoredRegistration, reason: string) {
  // One line, machine-parseable, greppable by the tag.
  console.log(JSON.stringify({ tag: "REGISTRATION", reason, ...record }));
}

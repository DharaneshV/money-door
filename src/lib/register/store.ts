// Persistence for registrations.
//
// The spec's ordering matters: persist BEFORE emailing, so a mail outage can't
// lose a lead. This module is deliberately small and pluggable because nothing
// is provisioned yet.
//
// Configure ONE of:
//   REGISTRATIONS_WEBHOOK_URL — a Google Apps Script / Make / Zapier endpoint
//     that appends a row to a Sheet. Simplest option, no service-account JSON
//     or driver required. See docs/REGISTRATIONS.md for the Apps Script.
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
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
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

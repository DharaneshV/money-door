// Abuse guards for /api/register: per-IP rate limiting and Turnstile verification.

/**
 * In-memory fixed-window rate limiter.
 *
 * IMPORTANT: serverless instances don't share memory and are recycled freely,
 * so this bounds a single warm instance, not the whole deployment. That is
 * genuinely useful against the common case (one script hammering the endpoint,
 * which lands on a warm instance) but it is NOT a hard global guarantee. If
 * abuse becomes a real problem, move this to Vercel KV / Upstash Redis — the
 * interface below is deliberately small so swapping the store is a local change.
 */
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 5;

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function sweep(now: number) {
  // Unbounded growth would be a slow memory leak on a long-lived instance.
  if (buckets.size < 5000) return;
  for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
}

export function rateLimit(ip: string): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(ip);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSec: 0 };
  }

  bucket.count += 1;
  if (bucket.count > MAX_PER_WINDOW) {
    return { allowed: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { allowed: true, retryAfterSec: 0 };
}

/** Best-effort client IP. Vercel sets x-forwarded-for; the first entry is the client. */
export function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Verifies a Cloudflare Turnstile token.
 *
 * Returns true when no secret is configured, so the form still works on
 * previews and local dev before the Cloudflare keys exist. Production must set
 * TURNSTILE_SECRET_KEY — without it this check is a no-op.
 */
export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = import.meta.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    // A Cloudflare outage shouldn't take registrations down with it. The
    // honeypot and rate limiter still apply.
    return true;
  }
}

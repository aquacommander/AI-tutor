/**
 * Sliding-window rate limit — 20 requests per minute per caller (PRD 5.5).
 *
 * Deliberately in-memory. It is per-instance, so it resets on deploy and does
 * not coordinate across serverless invocations: it is a guard against a stuck
 * client or an impatient child hammering send, **not** protection against a
 * determined attacker. PRD 8.3 already schedules a real limiter at the edge for
 * v1.1; this is the honest v1.0 version.
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

/** Caller -> timestamps of its requests inside the current window. */
const hits = new Map<string, number[]>();

export interface RateLimitResult {
  allowed: boolean;
  /** Requests still available in the current window. */
  remaining: number;
  /** Seconds until the caller may retry. Only meaningful when blocked. */
  retryAfterSeconds: number;
}

export function checkRateLimit(key: string, now = Date.now()): RateLimitResult {
  const cutoff = now - WINDOW_MS;
  const recent = (hits.get(key) ?? []).filter((at) => at > cutoff);

  if (recent.length >= MAX_REQUESTS) {
    const oldest = recent[0] ?? now;
    hits.set(key, recent);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((oldest + WINDOW_MS - now) / 1000)),
    };
  }

  recent.push(now);
  hits.set(key, recent);

  // Drop callers who have gone quiet, so a long-lived instance does not grow a
  // map entry for every visitor it has ever seen.
  if (hits.size > 5_000) {
    for (const [entryKey, timestamps] of hits) {
      if (timestamps.every((at) => at <= cutoff)) hits.delete(entryKey);
    }
  }

  return { allowed: true, remaining: MAX_REQUESTS - recent.length, retryAfterSeconds: 0 };
}

/** Test seam — the fixtures reset between cases. */
export function resetRateLimits() {
  hits.clear();
}

/**
 * Simple in-memory sliding-window rate limiter (per process).
 * Good enough for single-instance / soft protection on Vercel.
 */

interface Bucket {
  timestamps: number[];
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
}

export function rateLimit(
  key: string,
  { limit = 20, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < windowMs);

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0] ?? now;
    const retryAfterSec = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
    buckets.set(key, bucket);
    return { ok: false, remaining: 0, retryAfterSec };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return { ok: true, remaining: Math.max(0, limit - bucket.timestamps.length), retryAfterSec: 0 };
}

export function clientIpFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

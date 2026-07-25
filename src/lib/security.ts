import { timingSafeEqual } from "crypto";
import { getSiteUrl } from "@/lib/site-url";

/** Constant-time string compare for secrets. Length mismatch returns false without leaking via timingSafeEqual throw. */
export function safeEqualSecret(
  provided: string | null | undefined,
  expected: string | null | undefined,
): boolean {
  if (typeof provided !== "string" || typeof expected !== "string") return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    timingSafeEqual(a, a);
    return false;
  }
  return timingSafeEqual(a, b);
}

/**
 * When NEXT_PUBLIC_APP_URL is set, require Origin (if present) to match.
 * Requests without Origin (non-browser) are allowed.
 */
export function isAllowedRequestOrigin(request: Request): boolean {
  if (!process.env.NEXT_PUBLIC_APP_URL?.trim()) return true;

  const appUrl = getSiteUrl();
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).origin === new URL(appUrl).origin;
  } catch {
    return false;
  }
}

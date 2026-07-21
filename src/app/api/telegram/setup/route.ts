import { NextResponse } from "next/server";
import { setTelegramWebhook } from "@/lib/telegram";
import { clientIpFromRequest, rateLimit } from "@/lib/rate-limit";
import { safeEqualSecret } from "@/lib/security";
import { isProductionRuntime } from "@/lib/supabase";

export async function POST(request: Request) {
  const adminSecret = process.env.TELEGRAM_ADMIN_SECRET;
  if (!adminSecret) {
    return NextResponse.json(
      {
        error: isProductionRuntime()
          ? "Setup disabled: TELEGRAM_ADMIN_SECRET is not configured"
          : "TELEGRAM_ADMIN_SECRET is not configured",
      },
      { status: isProductionRuntime() ? 403 : 503 },
    );
  }

  const ip = clientIpFromRequest(request);
  const limited = rateLimit(`telegram:setup:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    );
  }

  const provided = request.headers.get("x-admin-secret");
  if (!safeEqualSecret(provided, adminSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!appUrl || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing NEXT_PUBLIC_APP_URL or TELEGRAM_WEBHOOK_SECRET" },
      { status: 500 },
    );
  }

  const result = await setTelegramWebhook(appUrl, webhookSecret);
  return NextResponse.json({ ok: true, result });
}

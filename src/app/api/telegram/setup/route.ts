import { NextResponse } from "next/server";
import { setTelegramWebhook } from "@/lib/telegram";

export async function POST(request: Request) {
  const adminSecret = request.headers.get("x-admin-secret");
  if (!adminSecret || adminSecret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!appUrl || !webhookSecret) {
    return NextResponse.json({ error: "Missing NEXT_PUBLIC_APP_URL or TELEGRAM_WEBHOOK_SECRET" }, { status: 500 });
  }

  const result = await setTelegramWebhook(appUrl, webhookSecret);
  return NextResponse.json({ ok: true, result });
}
